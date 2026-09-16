import { Env } from '#lib/env';

// `optional()` here means the application supplies a default, not that the
// value is unimportant. See the corresponding `config/*.ts` module for what
// that default is. Only variables the app genuinely cannot start without are
// required, so that existing deployments relying on a built-in default keep
// booting. An optional enum still rejects an invalid value when one is set.
const env = await Env.create(new URL('./', import.meta.url), {
  NODE_ENV: Env.schema.enum.optional([
    'development',
    'production',
    'test',
  ] as const),
  // For a future logger:
  // LOG_LEVEL: Env.schema.string(),
  PORT: Env.schema.integer.positive.optional(),
  // `tld: false` so `http://localhost:3000` is accepted — the URL format
  // requires a TLD by default, which rejects every local and container-internal
  // hostname.
  UI_URL: Env.schema.string({ format: 'url', tld: false }),

  OTEL_SERVICE_NAME: Env.schema.string.optional(),

  // Emails:
  NOREPLY_EMAIL: Env.schema.string.optional({ format: 'email' }),
  SUPPORT_EMAIL: Env.schema.string.optional({ format: 'email' }),
  TEAM_EMAIL: Env.schema.string.optional({ format: 'email' }),
  EMAIL_TRANSPORT: Env.schema.enum.optional(['console']),

  // Postgresql configuration:
  DATABASE_HOST: Env.schema.string({ format: 'host' }),
  DATABASE_READ_ONLY_HOST: Env.schema.string.optional({ format: 'host' }),
  DATABASE_PORT: Env.schema.integer.positive.optional(),
  DATABASE_NAME: Env.schema.string.optional(),
  DATABASE_USER: Env.schema.string.optional(),
  DATABASE_PASSWORD: Env.schema.secret(),
  DATABASE_SSL: Env.schema.boolean.optional(),
  DATABASE_POOL_MAX: Env.schema.integer.positive.optional(),
  DATABASE_READ_POOL_MAX: Env.schema.integer.positive.optional(),
  // Zero disables these, so they allow it.
  DATABASE_POOL_MAX_LIFETIME_SECONDS: Env.schema.integer.nonNegative.optional(),
  DATABASE_POOL_IDLE_TIMEOUT_MS: Env.schema.integer.nonNegative.optional(),
  DATABASE_POOL_CONNECTION_TIMEOUT_MS:
    Env.schema.integer.nonNegative.optional(),
  DATABASE_QUERY_TIMEOUT_MS: Env.schema.integer.nonNegative.optional(),
  DATABASE_IDLE_IN_TRANSACTION_TIMEOUT_MS:
    Env.schema.integer.nonNegative.optional(),
  DATABASE_STATEMENT_TIMEOUT_MS: Env.schema.integer.nonNegative.optional(),
  DATABASE_KEEPALIVE: Env.schema.boolean.optional(),
  DATABASE_KEEPALIVE_INITIAL_DELAY_MS:
    Env.schema.integer.nonNegative.optional(),
  DATABASE_PRINT_LOGS: Env.schema.boolean.optional(),

  // Redis:
  REDIS_USE_CLUSTER: Env.schema.boolean(),
  REDIS_HOST: Env.schema.string({ format: 'host' }),
  REDIS_PORT: Env.schema.integer.positive.optional(),
  REDIS_USER: Env.schema.string.optional(),
  REDIS_PASSWORD: Env.schema.secret.optional(),

  // Secrets:
  SESSION_SECRET: Env.schema.string(),
  GRAPHQL_MAX_DEPTH: Env.schema.integer.positive.optional(),

  // Default to `clickhouse`; ANALYTICS_ADAPTER falls back to WAREHOUSE_ADAPTER.
  WAREHOUSE_ADAPTER: Env.schema.enum.optional([
    'noop',
    'clickhouse',
    'postgresql',
  ]),
  ANALYTICS_ADAPTER: Env.schema.enum.optional([
    'noop',
    'clickhouse',
    'postgresql',
  ]),
  // Legacy: use WAREHOUSE_ADAPTER and ANALYTICS_ADAPTER instead:
  DATA_WAREHOUSE_PROVIDER: Env.schema.enum.optional([
    'noop',
    'clickhouse',
    'postgresql',
  ]),
  // Clickhouse settings, only used when WAREHOUSE_ADAPTER or ANALYTICS_ADAPTER is clickhouse:
  CLICKHOUSE_HOST: Env.schema.string.optional({ format: 'host' }),
  CLICKHOUSE_PORT: Env.schema.integer.positive.optional(),
  CLICKHOUSE_USERNAME: Env.schema.string.optional(),
  CLICKHOUSE_PASSWORD: Env.schema.secret.optional(),
  CLICKHOUSE_DATABASE: Env.schema.string.optional(),
  CLICKHOUSE_PROTOCOL: Env.schema.enum.optional(['https', 'http']),
  CLICKHOUSE_POOL_SIZE: Env.schema.integer.positive.optional(),
  // Zero means no retries and no delay respectively, so these allow it.
  CLICKHOUSE_INSERT_MAX_RETRIES: Env.schema.integer.nonNegative.optional(),
  CLICKHOUSE_INSERT_RETRY_INITIAL_MS: Env.schema.integer.nonNegative.optional(),
  CLICKHOUSE_INSERT_RETRY_MAX_MS: Env.schema.integer.nonNegative.optional(),
  // Clickhouse Memory settings. Zero disables the external-memory thresholds.
  CLICKHOUSE_MAX_BYTES_BEFORE_EXTERNAL_GROUP_BY:
    Env.schema.integer.nonNegative.optional(),
  CLICKHOUSE_MAX_BYTES_BEFORE_EXTERNAL_SORT:
    Env.schema.integer.nonNegative.optional(),
  CLICKHOUSE_MAX_THREADS: Env.schema.integer.positive.optional(),
  CLICKHOUSE_MAX_BLOCK_SIZE: Env.schema.integer.positive.optional(),
  // Other Clickhouse:
  CLICKHOUSE_RULE_INSIGHTS_LOOKBACK_DAYS:
    Env.schema.integer.positive.optional(),

  // Scylla:
  // Contact points, e.g. "db1,db2:9043". Parsed into a list here so consumers
  // receive `string[]` rather than re-splitting the raw value.
  SCYLLA_HOSTS: Env.schema.hostList.optional(),
  SCYLLA_USERNAME: Env.schema.string.optional(),
  SCYLLA_PASSWORD: Env.schema.secret.optional(),
  SCYLLA_LOCAL_DATACENTER: Env.schema.string.optional(),

  // Selects the NCMEC CyberTipline endpoint that "Submit to NCMEC" decisions are
  // routed to. Anything other than the literal string `production` (including
  // being unset) sends submissions to https://exttest.cybertip.org (the NCMEC
  // sandbox, reports are discarded). Set to `production` only when the
  // CyberTipline credentials configured in Settings → NCMEC are production
  // credentials issued by NCMEC and your integration has been approved for live
  // reporting.
  NCMEC_ENV: Env.schema.enum.optional(['production', 'test']),
  NCMEC_DEBUG: Env.schema.boolean.optional(),

  // Debugging:
  EXPOSE_SENSITIVE_IMPLEMENTATION_DETAILS_IN_ERRORS:
    Env.schema.boolean.optional(),
  ALLOW_USER_INPUT_LOCALHOST_URIS: Env.schema.boolean.optional(),
  LOG_REQUEST_BODY: Env.schema.boolean.optional(),

  // Integrations:
  GROQ_SECRET_KEY: Env.schema.secret.optional(),
  SENDGRID_API_KEY: Env.schema.secret.optional(),
  GOOGLE_PLACES_API_KEY: Env.schema.secret.optional(),
  OPEN_AI_API_KEY: Env.schema.secret.optional(),
  SLACK_APP_BEARER_TOKEN: Env.schema.secret.optional(),
  // Defaults to http://localhost:9876/ in `hmaService`.
  HMA_SERVICE_URL: Env.schema.string.optional({ format: 'url', tld: false }),

  // Others:
  ITEM_INVESTIGATION_AND_STRIKES_ENABLED: Env.schema.boolean.optional(),
  ITEM_QUEUE_TRAFFIC_PERCENTAGE: Env.schema.number(),
});

export default env;
