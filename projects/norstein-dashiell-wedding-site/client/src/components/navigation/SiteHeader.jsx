import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import PrimaryNavigation from "./PrimaryNavigation";

function SiteHeader() {
  const location = useLocation();

  const [menuState, setMenuState] = useState({
    isOpen: false,
    path: location.pathname,
  });

  const menuOpen =
    menuState.isOpen &&
    menuState.path === location.pathname;

  function toggleMenu() {
    setMenuState({
      isOpen: !menuOpen,
      path: location.pathname,
    });
  }

  function closeMenu() {
    setMenuState({
      isOpen: false,
      path: location.pathname,
    });
  }

  return (
    <header className="site-header">
      <div className="site-header__inner site-width">
        <Link
          className="site-header__logo-link site-header__logo-link--curse"
          to="/"
          onClick={closeMenu}
          aria-label="Norstein-Dashiell wedding homepage"
        >
          <span
            className="site-header__logo site-header__logo--curse"
            aria-hidden="true"
          />
        </Link>

        <button
          className="site-header__menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={toggleMenu}
        >
          <span aria-hidden="true">
            {menuOpen ? "×" : "☰"}
          </span>

          <span>
            {menuOpen ? "Close menu" : "Menu"}
          </span>
        </button>

        <PrimaryNavigation
          isOpen={menuOpen}
          onNavigate={closeMenu}
        />

        <a
          className="site-header__logo-link site-header__logo-link--loreweaver"
          href="https://www.loreweavercreations.com/"
          aria-label="Loreweaver Creations homepage"
        >
          <span
            className="site-header__logo site-header__logo--loreweaver"
            aria-hidden="true"
          />
        </a>
      </div>
    </header>
  );
}

export default SiteHeader;