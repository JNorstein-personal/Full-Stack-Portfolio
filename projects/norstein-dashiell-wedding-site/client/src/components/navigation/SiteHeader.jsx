import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { siteContent } from "../../data/siteContent.js";
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
          className="site-header__identity"
          to="/"
          onClick={closeMenu}
        >
          {siteContent.labels.siteIdentity}
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
      </div>
    </header>
  );
}

export default SiteHeader;