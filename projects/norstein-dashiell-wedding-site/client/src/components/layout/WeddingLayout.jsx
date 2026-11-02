import { Outlet } from "react-router-dom";

import AnonymousAnalytics from "../analytics/AnonymousAnalytics";
import Footer from "./Footer";
import { BackgroundMusicProvider } from "../media/BackgroundMusicProvider";
import SiteHeader from "../navigation/SiteHeader";
import SkipLink from "../navigation/SkipLink";
import RouteTransitionManager from "../navigation/RouteTransitionManager";

function WeddingLayout() {
  return (
    <BackgroundMusicProvider>
      <AnonymousAnalytics />
      <SkipLink />
      <SiteHeader />
      <RouteTransitionManager />

      <main
        id="main-content"
        tabIndex="-1"
      >
        <Outlet />
      </main>

      <Footer />
    </BackgroundMusicProvider>
  );
}

export default WeddingLayout;
