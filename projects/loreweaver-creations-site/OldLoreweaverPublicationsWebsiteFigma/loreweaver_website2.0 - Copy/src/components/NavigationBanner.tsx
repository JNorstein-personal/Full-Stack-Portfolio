import { useState, useRef } from "react";
import { ChevronDown, Instagram, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import blueskyLogo from "figma:asset/b1f0202f03aaf57cde19101f0c0ae56d31445bee.png";
import loreweaverLogo from "figma:asset/a17dd244680ac8c02486ae642637b7467982b263.png";
import prideFlagImage from "figma:asset/ce716ce7b2a4a3f516cfa7dcb46da231c7d06375.png";

interface NavItem {
  label: string;
  dropdownItems: string[];
  path: string;
}

const navigationItems: NavItem[] = [
  { label: "HOME", dropdownItems: ["Welcome", "Featured", "Latest Updates", "Calendar"], path: "/" },
  // TEMPORARILY DISABLED - Redirect to Coming Soon
  // { label: "BLOG", dropdownItems: ["Recent Posts", "Categories", "Archives", "Reviews & Recommendations"], path: "/blog" },
  { label: "BLOG", dropdownItems: [], path: "/comingsoon" },
  // TEMPORARILY DISABLED - Redirect to Coming Soon
  // { label: "PODCAST", dropdownItems: ["Latest Episodes", "Subscribe", "Archive"], path: "/podcast" },
  { label: "PODCAST", dropdownItems: [], path: "/comingsoon" },
  { label: "OUR TITLES", dropdownItems: ["All Titles", "New Releases", "Popular"], path: "/titles" },
  { label: "OUR CREATORS", dropdownItems: ["Meet the Team", "Our Authors", "Our Artists", "Join Us", "Creator Resources"], path: "/creators" },
  // TEMPORARILY DISABLED - Redirect to Coming Soon
  // { label: "WIKI", dropdownItems: ["Browse", "Search", "Contribute"], path: "/wiki" },
  { label: "WIKI", dropdownItems: [], path: "/comingsoon" },
  { label: "ABOUT US", dropdownItems: ["Our Story", "Contact", "FAQ"], path: "/about" },
  // TEMPORARILY DISABLED - Redirect to Coming Soon
  // { label: "COMMUNITY", dropdownItems: ["Community", "Fan Art", "Fan Fiction", "Filk", "Fanthology", "Events"], path: "/community" },
  { label: "COMMUNITY", dropdownItems: [], path: "/comingsoon" },
  // TEMPORARILY DISABLED - Redirect to Coming Soon
  // { label: "MERCH", dropdownItems: ["Shop All", "Apparel", "Accessories", "Games"], path: "/merch" },
  { label: "MERCH", dropdownItems: [], path: "/comingsoon" },
];

// Mobile navigation order: HOME, OUR TITLES, OUR CREATORS, ABOUT US, COMMUNITY, WIKI, BLOG, PODCAST, MERCH
const mobileNavigationItems: NavItem[] = [
  { label: "HOME", dropdownItems: ["Welcome", "Featured", "Latest Updates", "Calendar"], path: "/" },
  { label: "OUR TITLES", dropdownItems: ["All Titles", "New Releases", "Popular"], path: "/titles" },
  { label: "OUR CREATORS", dropdownItems: ["Meet the Team", "Our Authors", "Our Artists", "Join Us", "Creator Resources"], path: "/creators" },
  { label: "ABOUT US", dropdownItems: ["Our Story", "Contact", "FAQ"], path: "/about" },
  { label: "COMMUNITY", dropdownItems: [], path: "/comingsoon" },
  { label: "WIKI", dropdownItems: [], path: "/comingsoon" },
  { label: "BLOG", dropdownItems: [], path: "/comingsoon" },
  { label: "PODCAST", dropdownItems: [], path: "/comingsoon" },
  { label: "MERCH", dropdownItems: [], path: "/comingsoon" },
];

// Map dropdown items to section IDs
const dropdownLinks: Record<string, Record<string, string>> = {
  "HOME": {
    "Welcome": "#welcome",
    "Featured": "#featured",
    "Latest Updates": "#latest-updates",
    "Calendar": "#calendar"
  },
  "OUR TITLES": {
    "All Titles": "#all-titles",
    "New Releases": "#new-releases",
    "Popular": "#popular"
  },
  "BLOG": {
    "Recent Posts": "#recent-posts",
    "Categories": "#categories",
    "Archives": "#archives",
    "Reviews & Recommendations": "#reviews-recommendations"
  },
  "PODCAST": {
    "Latest Episodes": "#latest-episodes",
    "Subscribe": "#subscribe",
    "Archive": "#archive"
  },
  "OUR CREATORS": {
    "Meet the Team": "#meet-the-team",
    "Our Authors": "#our-authors",
    "Our Artists": "#our-artists",
    "Join Us": "#join-us",
    "Creator Resources": "#creator-resources"
  },
  "WIKI": {
    "Browse": "#browse",
    "Search": "#search",
    "Contribute": "#contribute"
  },
  "ABOUT US": {
    "Our Story": "#our-story",
    "Contact": "#contact",
    "FAQ": "#faq"
  },
  "COMMUNITY": {
    "Community": "#community",
    "Fan Art": "#fan-art",
    "Fan Fiction": "#fan-fiction",
    "Filk": "#filk",
    "Fanthology": "#fanthology",
    "Events": "#events"
  },
  "MERCH": {
    "Shop All": "#shop-all",
    "Apparel": "#apparel",
    "Accessories": "#accessories",
    "Games": "#games"
  }
};

export function NavigationBanner() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileOpenSubmenu, setMobileOpenSubmenu] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (label: string) => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    // Set a 300ms delay before closing the dropdown
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 300);
  };

  const handleNavClick = (item: NavItem, dropdownItem: string, e: React.MouseEvent) => {
    e.preventDefault();
    const sectionId = dropdownLinks[item.label]?.[dropdownItem];
    
    if (sectionId) {
      // Navigate to the page first, then scroll to section
      navigate(item.path);
      
      // Use setTimeout to ensure navigation completes before scrolling
      setTimeout(() => {
        const element = document.querySelector(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
    
    setOpenDropdown(null);
    closeMobileMenu();
  };

  const handleSurpriseMe = (label: string, e: React.MouseEvent) => {
    e.preventDefault();
    const item = navigationItems.find(i => i.label === label);
    const items = item?.dropdownItems || [];
    
    if (items.length > 0 && item) {
      const randomIndex = Math.floor(Math.random() * items.length);
      const randomItem = items[randomIndex];
      handleNavClick(item, randomItem, e);
    }
    
    setOpenDropdown(null);
    closeMobileMenu();
  };

  const handleLogoClick = () => {
    navigate("/");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const toggleMobileSubmenu = (label: string) => {
    setMobileOpenSubmenu(mobileOpenSubmenu === label ? null : label);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileOpenSubmenu(null);
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
            className="flex items-center transition-all hover:drop-shadow-[0_0_7.5px_rgba(149,254,252,0.7)]"
            onClick={handleLogoClick}
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
                    <button 
                      onClick={() => navigate(item.path)}
                      className="text-gray-300 hover:text-[#95fefc] transition-colors font-bold relative group"
                      title={item.dropdownItems.length === 0 ? "COMING SOON!" : undefined}
                    >
                      {item.label}
                      {item.dropdownItems.length === 0 && (
                        <span className="absolute left-1/2 -translate-x-1/2 -bottom-8 bg-[#3d0099] text-white px-3 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                          COMING SOON!
                        </span>
                      )}
                    </button>
                    <button
                      className="text-gray-300 hover:text-[#95fefc] transition-colors"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Dropdown Menu */}
                  {openDropdown === item.label && item.dropdownItems.length > 0 && (
                    <div 
                      className="absolute left-0 top-full w-48 bg-[#ebf4ff] rounded-md shadow-lg border border-gray-200 py-2 z-50"
                    >
                      {item.dropdownItems.map((dropdownItem, index) => (
                        <a
                          key={index}
                          href="#"
                          onClick={(e) => handleNavClick(item, dropdownItem, e)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#cedff3] hover:text-[#000ba3] transition-colors font-bold"
                        >
                          {dropdownItem}
                        </a>
                      ))}
                      <div className="border-t border-gray-200 mt-1 pt-1">
                        <button
                          onClick={(e) => handleSurpriseMe(item.label, e)}
                          className="w-full text-left px-4 py-2 text-sm bg-black text-[#ff00d0] hover:bg-black hover:text-[#ff00a2] transition-colors"
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
          <div className="hidden lg:flex items-center gap-5">
            <div className="flex flex-col items-center space-y-4">
              <a
                href="https://www.instagram.com/jnorsteinauthor/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#00fffb] transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://bsky.app/profile/jsnorstein.bsky.social"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all relative group"
                aria-label="Bluesky"
              >
                <img 
                  src={blueskyLogo} 
                  alt="Bluesky" 
                  className="w-5 h-5"
                  style={{
                    filter: 'brightness(0) invert(1)',
                  }}
                />
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{
                    backgroundColor: '#00fffb',
                    mixBlendMode: 'multiply'
                  }}
                />
              </a>
              <a
                href="https://www.tiktok.com/@joshua.norstein"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#00fffb] transition-all"
                aria-label="TikTok"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
            
            {/* Pride Flag Image */}
            <img 
              src={prideFlagImage} 
              alt="Pride Flag" 
              className="w-15 h-auto object-contain"
              title="LOREWEAVER Publications proudly supports and welcomes all members of the BIPOC, LGBTQIA+ and Neurodiverse communities. Hate has no home here."
            />
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
              {mobileNavigationItems.map((item) => (
                <div key={item.label} className="border-b border-gray-700 pb-2">
                  <div className="flex items-center">
                    <button
                      onClick={() => {
                        navigate(item.path);
                        closeMobileMenu();
                      }}
                      className="flex-1 text-left px-4 py-2 text-gray-300 hover:bg-gray-800 transition-colors font-bold relative group"
                    >
                      {item.label}
                      {item.dropdownItems.length === 0 && (
                        <span className="ml-2 text-xs text-[#3d0099] group-hover:text-[#ff00d0]">
                          (COMING SOON!)
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => toggleMobileSubmenu(item.label)}
                      className="px-4 py-2 text-gray-300 hover:bg-gray-800 transition-colors"
                    >
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform ${
                          mobileOpenSubmenu === item.label ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>
                  
                  {/* Mobile Submenu */}
                  {mobileOpenSubmenu === item.label && item.dropdownItems.length > 0 && (
                    <div className="bg-gray-800 py-2">
                      {item.dropdownItems.map((dropdownItem, index) => (
                        <a
                          key={index}
                          href="#"
                          onClick={(e) => handleNavClick(item, dropdownItem, e)}
                          className="block px-8 py-2 text-sm text-gray-400 hover:text-blue-400 hover:bg-gray-700 transition-colors font-bold"
                        >
                          {dropdownItem}
                        </a>
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
                href="https://www.instagram.com/jnorsteinauthor/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#00fffb] transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://bsky.app/profile/jsnorstein.bsky.social"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all relative group"
                aria-label="Bluesky"
              >
                <img 
                  src={blueskyLogo} 
                  alt="Bluesky" 
                  className="w-5 h-5"
                  style={{
                    filter: 'brightness(0) invert(1)',
                  }}
                />
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{
                    backgroundColor: '#00fffb',
                    mixBlendMode: 'multiply'
                  }}
                />
              </a>
              <a
                href="https://www.tiktok.com/@joshua.norstein"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#00fffb] transition-all"
                aria-label="TikTok"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              
              {/* Pride Flag Image - Mobile */}
              <img 
                src={prideFlagImage} 
                alt="Pride Flag" 
                className="w-15 h-auto object-contain ml-2"
                title="LOREWEAVER Publications proudly supports and welcomes all members of the BIPOC, LGBTQIA+ and Neurodiverse communities. Hate has no home here."
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}