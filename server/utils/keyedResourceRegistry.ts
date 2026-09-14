/**
 * A lazily-populated registry of keyed, long-lived resources that hold a
 * connection (or similar handle) and must be explicitly closed.
 *
 * This exists because `cached()` was being used for the job: BullMQ `Queue` and
 * `Worker` objects were held in an in-memory cache with a TTL and a 128-entry
 * LRU whose eviction callback called `close()`. A cache is the wrong contract
 * for these:
 *
 * - A cache entry is a *copy* of something derivable, discardable at any time.
 *   A `Worker` is not a copy of anything, it is the thing doing the work.
 * - A TTL implies the value goes stale. These don't; the TTL just tore down and
 *   rebuilt job processing on a timer.
 * - LRU eviction bounds memory. Here it meant the (N+1)th active queue silently
 *   closed the least-recently-used queue's worker, stopping its stalled-job
 *   checker until something happened to request that queue again.
 *
 * So: no TTL, no size limit. Entries live until removed explicitly (the
 * resource's underlying subject is gone) or until the owner closes.
 *
 * The map stores the in-flight promise rather than the resolved value, so
 * concurrent `get()` calls for the same key share a single creation instead of
 * racing to build two workers against the same queue. A failed creation is
 * evicted so the next call retries rather than caching the rejection.
 */
export default class KeyedResourceRegistry<
  K,
  V extends { close(): Promise<unknown> },
> {
  readonly #entries = new Map<string, Promise<V>>();
  readonly #create: (key: K) => Promise<V>;
  readonly #keyToString: (key: K) => string;
  #closed = false;

  constructor(opts: {
    /** Builds the resource for a key. Called at most once per live key. */
    create: (key: K) => Promise<V>;
    /** Must be stable and collision-free for distinct keys. */
    keyToString: (key: K) => string;
  }) {
    this.#create = opts.create;
    this.#keyToString = opts.keyToString;
  }

  /** Returns the resource for `key`, creating it on first request. */
  async get(key: K): Promise<V> {
    if (this.#closed) {
      throw new Error('KeyedResourceRegistry used after close()');
    }

    const id = this.#keyToString(key);
    const existing = this.#entries.get(id);
    if (existing !== undefined) {
      return existing;
    }

    const created = this.#create(key).catch((err: unknown) => {
      // Don't cache a rejection: a transient failure to build the resource
      // shouldn't poison the key for the lifetime of the process.
      if (this.#entries.get(id) === created) {
        this.#entries.delete(id);
      }
      throw err;
    });

    this.#entries.set(id, created);
    return created;
  }

  /**
   * Closes and forgets the resource for `key`, if one exists. Use when the
   * resource's subject is gone (e.g. the queue it wraps has been deleted), so
   * nothing keeps holding a handle to something that no longer exists.
   *
   * A resource whose creation failed is forgotten without calling `close()`.
   */
  async remove(key: K): Promise<void> {
    const id = this.#keyToString(key);
    const entry = this.#entries.get(id);
    if (entry === undefined) {
      return;
    }
    this.#entries.delete(id);
    const resource = await entry.catch(() => undefined);
    await resource?.close();
  }

  /**
   * Closes every live resource. Subsequent `get()` calls throw; this is a
   * shutdown operation, not a reset.
   *
   * Rejects if any `close()` rejects, after attempting all of them, so a single
   * failure can't leave the rest open.
   */
  async close(): Promise<void> {
    this.#closed = true;
    const entries = [...this.#entries.values()];
    this.#entries.clear();

    const results = await Promise.allSettled(
      entries.map(async (entry) => {
        const resource = await entry.catch(() => undefined);
        await resource?.close();
      }),
    );

    const failures = results.filter((it) => it.status === 'rejected');
    if (failures.length > 0) {
      throw new AggregateError(
        failures.map((it) => it.reason),
        `Failed to close ${failures.length} of ${entries.length} resources`,
      );
    }
  }

  /** Number of live entries. Exposed for tests and diagnostics. */
  get size(): number {
    return this.#entries.size;
  }
}
