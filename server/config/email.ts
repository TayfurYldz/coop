import env from '#start/env';

/**
 * Outbound email.
 *
 * `transport` is only half a selector today: `makeSendEmail` falls through from
 * an explicitly-injected SES client, to `console`, to SendGrid if an API key
 * happens to be set, to SES. Making the choice explicit — and replacing the
 * `console` transport with SMTP against a local mail catcher — is left to the
 * change that adds an SMTP transport, so this module only moves the reads.
 */
export default {
  transport: env.get('EMAIL_TRANSPORT'),

  /** Only consulted when no SES client is injected and `transport` is unset. */
  sendgridApiKey: env.get('SENDGRID_API_KEY'),

  /** The addresses Coop sends as. */
  addresses: {
    noReply: env.get('NOREPLY_EMAIL', 'noreply@example.com'),
    support: env.get('SUPPORT_EMAIL', 'support@example.com'),
    team: env.get('TEAM_EMAIL', 'team@example.com'),
  },
};
