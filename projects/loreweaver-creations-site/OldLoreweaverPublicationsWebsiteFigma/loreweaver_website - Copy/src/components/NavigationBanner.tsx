import { useState } from "react";
import { ChevronDown, Instagram, Menu, X } from "lucide-react";
import blueskyLogo from "../assets/blueskyicon.png";
import loreweaverLogo from "../assets/loreweaverlogo.png";

// 🔹 Page type that App will also use
export type Page =
  | "home"
  | "blog"
  | "podcast"
  | "titles"
  | "creators"
  | "wiki"
  | "about"
  | "community"
  | "merch"
  | "comingsoon";

// 🔹 Props for NavigationBanner
interface NavigationBannerProps {
  onNavigate: (page: Page) => void;
}

interface NavItem {
  label: string;
  dropdownItems: string[];
}

// 🔹 Map nav labels to Page values
const labelToPage: Record<NavItem["label"], Page> = {
  HOME: "home",
  BLOG: "blog",
  PODCAST: "podcast",
  "OUR TITLES": "titles",
  "OUR CREATORS": "creators",
  WIKI: "wiki",
  "ABOUT US": "about",
  COMMUNITY: "community",
  MERCH: "merch",
};

const comingSoonSections: NavItem["label"][] = [
  "COMMUNITY",
  "PODCAST",
  "WIKI",
  "MERCH",
];

const navigationItems: NavItem[] = [
  { label: "HOME", dropdownItems: ["Welcome", "Featured", "Latest Updates", "Calendar"] },
  { label: "BLOG", dropdownItems: ["Recent Posts", "Categories", "Archives", "Reviews & Recommendations"] },
  { label: "PODCAST", dropdownItems: ["Latest Episodes", "Subscribe", "Archive"] },
  { label: "OUR TITLES", dropdownItems: ["All Titles", "New Releases", "Popular"] },
  { label: "OUR CREATORS", dropdownItems: ["Meet the Team", "Our Authors", "Our Artists", "Join Us", "Creator Resources"] },
  { label: "WIKI", dropdownItems: ["Browse", "Search", "Contribute"] },
  { label: "ABOUT US", dropdownItems: ["Our Story", "Contact", "FAQ"] },
  { label: "COMMUNITY", dropdownItems: ["Community", "Fan Art", "Fan Fiction", "Filk", "Fanthology", "Events"] },
  { label: "MERCH", dropdownItems: ["Shop All", "Apparel", "Accessories", "Games"] },
];

// Map dropdown items to section IDs
const dropdownLinks: Record<string, Record<string, string>> = {
  HOME: {
    Welcome: "#welcome",
    Featured: "#featured",
    "Latest Updates": "#latest-updates",
    Calendar: "#calendar",
  },
  "OUR TITLES": {
    "All Titles": "#all-titles",
    "New Releases": "#new-releases",
    Popular: "#popular",
  },
  BLOG: {
    "Recent Posts": "#recent-posts",
    Categories: "#categories",
    Archives: "#archives",
    "Reviews & Recommendations": "#reviews-recommendations",
  },
  PODCAST: {
    "Latest Episodes": "#latest-episodes",
    Subscribe: "#subscribe",
    Archive: "#archive",
  },
  "OUR CREATORS": {
    "Meet the Team": "#meet-the-team",
    "Our Authors": "#our-authors",
    "Our Artists": "#our-artists",
    "Join Us": "#join-us",
    "Creator Resources": "#creator-resources",
  },
  WIKI: {
    Browse: "#browse",
    Search: "#search",
    Contribute: "#contribute",
  },
  "ABOUT US": {
    "Our Story": "#our-story",
    Contact: "#contact",
    FAQ: "#faq",
  },
  COMMUNITY: {
    Community: "#community",
    "Fan Art": "#fan-art",
    "Fan Fiction": "#fan-fiction",
    Filk: "#filk",
    Fanthology: "#fanthology",
    Events: "#events",
  },
  MERCH: {
    "Shop All": "#shop-all",
    Apparel: "#apparel",
    Accessories: "#accessories",
    Games: "#games",
  },
};

export function NavigationBanner({ onNavigate }: NavigationBannerProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileOpenSubmenu, setMobileOpenSubmenu] = useState<string | null>(null);

  const handleMouseEnter = (label: string) => {
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };

  const handleSurpriseMe = (label: string, e: React.MouseEvent) => {
  e.preventDefault();

  // 👇 If this is COMMUNITY, PODCAST, WIKI, or MERCH,
  // always send user to Comingsoon.tsx
  if (comingSoonSections.includes(label as NavItem["label"])) {
    onNavigate("comingsoon");
    setOpenDropdown(null);
    closeMobileMenu();
    return;
  }

  const items =
    navigationItems.find((item) => item.label === label)?.dropdownItems || [];

  if (items.length > 0) {
    const randomIndex = Math.floor(Math.random() * items.length);
    const randomItem = items[randomIndex];
    const link = dropdownLinks[label]?.[randomItem] || "#";
    window.location.href = link;
  }

  setOpenDropdown(null);
  closeMobileMenu();
};

  const toggleMobileSubmenu = (label: string) => {
    setMobileOpenSubmenu(mobileOpenSubmenu === label ? null : label);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileOpenSubmenu(null);
  };

  const safeNavigate = (label: NavItem["label"]) => {
  if (comingSoonSections.includes(label)) {
    onNavigate("comingsoon");
    closeMobileMenu();
    return;
  }

  onNavigate(labelToPage[label]);
};


  return (
    <header className="bg-black shadow-md">
      {/* Top Bar with Login */}
      <div className="border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-end">
          <button className="px-4 py-1.5 text-sm text-gray-300 hover:text-blue-400 transition-colors">
            Log In
          </button>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <button
            className="flex items-center hover:opacity-80 transition-opacity"
            onClick={() => {
              onNavigate("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <img
              src={loreweaverLogo}
              alt="LOREWEAVER Publications"
              className="h-18 w-auto object-contain"
            />
          </button>

          {/* Desktop Navigation Links - 3 columns of 3 - Hidden on mobile */}
          <nav className="hidden lg:block flex-1 mx-8">
            <div className="grid grid-cols-3 gap-x-8 gap-y-2 max-w-3xl">
              {navigationItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="flex items-center space-x-1 py-2 text-sm">
                    {/* 🔹 Call onNavigate when a main nav item is clicked */}
                    <button
                      className="text-gray-300 hover:text-blue-400 transition-colors"
                      onClick={() => safeNavigate(item.label)}
                    >
                      {item.label}
                    </button>
                    <button className="text-gray-300 hover:text-blue-400 transition-colors">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Dropdown Menu */}
                  {openDropdown === item.label && (
                    <div className="absolute left-0 top-full w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                      {item.dropdownItems.map((dropdownItem, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => safeNavigate(item.label)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          {dropdownItem}
                        </button>
                      ))}
                      <div className="border-t border-gray-200 mt-1 pt-1">
                        <button
                          onClick={(e) => handleSurpriseMe(item.label, e)}
                          className="w-full text-left px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                        >
                          SURPRISE ME!
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* Desktop Social Media Links - Hidden on mobile */}
          <div className="hidden lg:flex lg:flex-col items-center space-y-4">
            <a
              href="#"
              className="text-white hover:opacity-70 transition-all"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="hover:opacity-70 transition-all"
              aria-label="Bluesky"
            >
              <img src={blueskyLogo} alt="Bluesky" className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-white hover:opacity-70 transition-all"
              aria-label="TikTok"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </a>
          </div>

          {/* Mobile Menu Button - Visible only on mobile */}
          <button
            className="lg:hidden text-gray-300 hover:text-blue-400 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu - Visible only when open */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-700 py-4">
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <div key={item.label} className="border-b border-gray-700 pb-2">
                  <button
                    onClick={() => {
                      safeNavigate(item.label);
                      toggleMobileSubmenu(item.label);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2 text-gray-300 hover:bg-gray-800 transition-colors"
              >
                  <span>{item.label}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      mobileOpenSubmenu === item.label ? "rotate-180" : ""
                    }`}
                  />
                </button>

                  {/* Mobile Submenu */}
                  {mobileOpenSubmenu === item.label && (
                    <div className="bg-gray-800 py-2">
                      {item.dropdownItems.map((dropdownItem, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => safeNavigate(item.label)}
                          className="block w-full text-left px-8 py-2 text-sm text-gray-400 hover:text-blue-400 hover:bg-gray-700 transition-colors"
                        >
                          {dropdownItem}
                        </button>
                  ))}
                      <div className="border-t border-gray-600 mt-1 pt-1 px-8">
                        <button
                          onClick={(e) => handleSurpriseMe(item.label, e)}
                          className="w-full text-left py-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          SURPRISE ME!
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Mobile Social Media Links */}
            <div className="flex items-center justify-center space-x-6 mt-6 pt-4 border-t border-gray-700">
              <a
                href="#"
                className="text-white hover:opacity-70 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="hover:opacity-70 transition-all"
                aria-label="Bluesky"
              >
                <img src={blueskyLogo} alt="Bluesky" className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-white hover:opacity-70 transition-all"
                aria-label="TikTok"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
