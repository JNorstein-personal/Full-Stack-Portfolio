import { NavLink } from "react-router-dom";

import { siteContent } from "../../data/siteContent.js";

function PrimaryNavigation({
  isOpen = false,
  onNavigate,
}) {
  return (
    <nav
      id="primary-navigation"
      className={`primary-navigation ${
        isOpen ? "primary-navigation--open" : ""
      }`}
      aria-label="Primary"
    >
      <ul className="primary-navigation__list">
        {siteContent.navigation.map((item) => (
          <li
            key={item.to}
            className="primary-navigation__item"
          >
            <NavLink
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={[
                "primary-navigation__link",
                item.prominent
                  ? "primary-navigation__link--rsvp"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default PrimaryNavigation;