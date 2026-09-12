import { Outlet } from "react-router-dom";

import Footer from "./Footer";
import SiteHeader from "../navigation/SiteHeader";
import SkipLink from "../navigation/SkipLink";

function WeddingLayout() {
  return (
    <>
      <SkipLink />
      <SiteHeader />

      <main
        id="main-content"
        tabIndex="-1"
      >
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default WeddingLayout;