import env from '#start/env';

const NODE_ENV = env.get('NODE_ENV', 'development');

export default {
  env: NODE_ENV,

  // Public origin of the frontend. Used to build the links and redirects the
  // application hands out, so it must be the origin a browser reaches, not an
  // internal one.
  uiUrl: env.get('UI_URL'),

  session: {
    secret: env.get('SESSION_SECRET'),
    cookie: {
      secure: NODE_ENV === 'production',
      httpOnly: true,
      // 30 Days in milliseconds
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  },
};
