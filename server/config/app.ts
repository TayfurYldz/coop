import env from '#start/env';

const NODE_ENV = env.get('NODE_ENV', 'development');

// Derived once so the comparison lives in a single place. `NODE_ENV === 'prod'`
// is silently non-production everywhere it appears; `inProduction` is not.
const inProduction = NODE_ENV === 'production';
const inDev = NODE_ENV === 'development';
const inTest = NODE_ENV === 'test';

export default {
  env: NODE_ENV,
  inProduction,
  inDev,
  inTest,

  // Public origin of the frontend. Used to build the links and redirects the
  // application hands out, so it must be the origin a browser reaches, not an
  // internal one.
  uiUrl: env.get('UI_URL'),

  session: {
    secret: env.get('SESSION_SECRET'),
    cookie: {
      secure: inProduction,
      httpOnly: true,
      // 30 Days in milliseconds
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  },
};
