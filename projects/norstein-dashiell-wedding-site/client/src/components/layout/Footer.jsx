import { Link } from "react-router-dom";

import { siteContent } from "../../data/siteContent.js";
import calciferBurning from "../../assets/images/calcifer_burning.gif";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner site-width">
        <nav
          className="site-footer__navigation"
          aria-label="Footer"
        >
          {siteContent.footerNavigation.map((item) => (
            <Link
              key={item.to}
              to={item.to}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-footer__support">
          <p>
            RSVP assistance:{" "}
            <a
              href={`mailto:${siteContent.rsvp.assistanceEmail}`}
            >
              {siteContent.rsvp.assistanceEmail}
            </a>
          </p>

          <p>
            © 2027 {siteContent.labels.siteIdentity}
          </p>
        </div>

        <img
          className="site-footer__calcifer"
          src={calciferBurning}
          alt=""
          aria-hidden="true"
        />
      </div>
    </footer>
  );
}

export default Footer;
