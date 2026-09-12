import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner site-width">
        <nav
          className="site-footer__navigation"
          aria-label="Footer"
        >
          <Link to="/">
            Home
          </Link>

          <Link to="/rsvp/">
            RSVP
          </Link>

          <Link to="/privacy">
            Privacy
          </Link>
        </nav>

        <div className="site-footer__support">
          <p>
            RSVP assistance details will be
            available here.
          </p>

          <p>
            © 2027 Norstein-Dashiell Wedding
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;