import { NavLink } from "react-router-dom";

const navigationItems = [
  {
    label: "Home",
    to: "/",
    end: true,
  },
  {
    label: "RSVP",
    to: "/rsvp/",
    prominent: true,
  },
  {
    label: "Theme and Attire",
    to: "/theme",
  },
  {
    label: "Our Story",
    to: "/story",
  },
  {
    label: "Read, Listen, and Watch",
    to: "/read-listen-watch",
  },
  {
    label: "Venues",
    to: "/venues",
  },
  {
    label: "Travel",
    to: "/travel",
  },
  {
    label: "Schedule",
    to: "/schedule",
  },
  {
    label: "FAQ",
    to: "/faq",
  },
  {
    label: "Gallery",
    to: "/gallery",
  },
  {
    label: "Privacy",
    to: "/privacy",
  },
];

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
        {navigationItems.map((item) => (
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