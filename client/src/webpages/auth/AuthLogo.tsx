import LogoWhite from '../../images/LogoAndWordmarkWhite.png';
import LogoBlack from '../../images/LogoBlack.png';

/**
 * The Coop wordmark on the signed-out pages (login, signup, password reset).
 *
 * These pages render outside the dashboard, but next-themes writes the theme
 * class on <html>, so a moderator who picked Dark still lands here in dark —
 * where the black wordmark is all but invisible. Swapping the asset is the
 * same approach the sidebar takes; a CSS filter on the black PNG muddies the
 * antialiasing.
 */
export default function AuthLogo() {
  return (
    <>
      <img src={LogoBlack} alt="Coop" className="h-12 dark:hidden" />
      <img
        src={LogoWhite}
        alt=""
        aria-hidden
        className="hidden h-12 dark:block"
      />
    </>
  );
}
