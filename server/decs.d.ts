declare module 'stream-to-blob' {
  export default function streamToBlob(
    stream: NodeJS.ReadableStream,
    mimeType?: string | null,
  ): Promise<Blob>;
}

declare module 'latlon-geohash' {
  export interface Point {
    lat: number;
    lon: number;
  }

  /**
   * Encodes latitude/longitude to geohash, either to specified precision or to automatically
   * evaluated precision.
   *
   * @param   lat - Latitude in degrees.
   * @param   lng - Longitude in degrees.
   * @param   [precision] - Number of characters in resulting geohash.
   * @returns Geohash of supplied latitude/longitude.
   * @throws  Invalid geohash.
   *
   * @example
   *     var geohash = Geohash.encode(52.205, 0.119, 7); // geohash: 'u120fxw'
   */
  export function encode(lat: number, lng: number, precision?: number): string;

  /**
   * Decode geohash to latitude/longitude (location is approximate centre of geohash cell,
   *     to reasonable precision).
   *
   * @param   geohash - Geohash string to be converted to latitude/longitude.
   * @returns (Center of) geohashed location.
   * @throws  Invalid geohash.
   *
   * @example
   *     var latlon = Geohash.decode('u120fxw'); // latlon: { lat: 52.205, lon: 0.1188 }
   */
  export function decode(geohash: string): Point;
}

namespace NodeJS {
  interface ProcessEnv {
    DATABASE_HOST?: string;
    DATABASE_READ_ONLY_HOST?: string;
    DATABASE_PORT?: string;
    DATABASE_NAME?: string;
    DATABASE_USER?: string;
    DATABASE_PASSWORD?: string;
    DATABASE_SSL?: string;
    DATABASE_POOL_MAX?: string;
    DATABASE_READ_POOL_MAX?: string;
    DATABASE_POOL_IDLE_TIMEOUT_MS?: string;
    DATABASE_POOL_CONNECTION_TIMEOUT_MS?: string;
    DATABASE_QUERY_TIMEOUT_MS?: string;
    DATABASE_IDLE_IN_TRANSACTION_TIMEOUT_MS?: string;
    DATABASE_PRINT_LOGS?: string;
    SESSION_SECRET?: string;
    WAREHOUSE_ADAPTER?: string;
    ANALYTICS_ADAPTER?: string;
    DATA_WAREHOUSE_PROVIDER?: string;
    NCMEC_ENV?: string;
    NODE_ENV?: string;
    EXPOSE_SENSITIVE_IMPLEMENTATION_DETAILS_IN_ERRORS?: string;
    ALLOW_USER_INPUT_LOCALHOST_URIS?: string;
    REDIS_USE_CLUSTER?: string;
    REDIS_HOST?: string;
    REDIS_PORT?: string;
    REDIS_USER?: string;
    REDIS_PASSWORD?: string;
    GROQ_SECRET_KEY?: string;
    SENDGRID_API_KEY?: string;
    GOOGLE_PLACES_API_KEY?: string;
    OPEN_AI_API_KEY?: string;
    SLACK_APP_BEARER_TOKEN?: string;
  }
}
