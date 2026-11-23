import { useState } from "react";
import { NavigationBanner, Page } from "./components/NavigationBanner";
import { FooterBanner } from "./components/FooterBanner";
import { ChatbotWidget } from "./components/ChatbotWidget";
import Home from "./Home";
import Titles from "./Titles";
import About from "./About";
import Blog from "./Blog";
import Creators from "./Creators";
// These imports can be left in or removed if unused now
// import Community from "./Community";
// import Podcast from "./Podcast";
// import Wiki from "./Wiki";
// import Merch from "./Merch";
import Comingsoon from "./Comingsoon";

export default function App() {
  // Which subpage is currently active
  const [currentPage, setCurrentPage] = useState<Page>("home");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* pass setter so NavigationBanner can change pages */}
      <NavigationBanner onNavigate={setCurrentPage} />

      {/* only one subpage rendered at a time */}
      {currentPage === "home" && <Home />}
      {currentPage === "titles" && <Titles />}
      {currentPage === "about" && <About />}
      {currentPage === "blog" && <Blog />}
      {currentPage === "creators" && <Creators />}

      {/* All of these are now redirected in NavigationBanner to "comingsoon" */}
      {currentPage === "comingsoon" && <Comingsoon />}

      <FooterBanner />
      <ChatbotWidget />
    </div>
  );
}
