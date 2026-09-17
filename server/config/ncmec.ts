import appConfig from '#config/app';
import env from '#start/env';

/**
 * NCMEC CyberTipline reporting.
 *
 * `isTest` selects the endpoint submissions are routed to. Anything other than
 * `NCMEC_ENV=production` — including being unset — sends to
 * https://exttest.cybertip.org, the NCMEC sandbox, where reports are discarded.
 * Operators are responsible for matching this to whether the credentials
 * configured in Settings → NCMEC are production or test credentials issued by
 * NCMEC.
 *
 * Derived once here because getting it wrong in either direction is serious:
 * live reports sent to the sandbox are silently discarded, and test reports sent
 * to production are filed as real CyberTipline reports.
 */
const isTest = env.get('NCMEC_ENV') !== 'production';

export default {
  isTest,

  /**
   * Opt-in debug logs and XML/JSON dumps for submissions. Also gated on not
   * being in production, since the dumps contain reportable content and must
   * not be written in a shared environment. Never includes credentials.
   */
  debug: env.get('NCMEC_DEBUG', false) && !appConfig.inProduction,
};
