import { Link } from "react-router-dom";

import ContentSection from "../components/layout/ContentSection";
import BackToTop from "../components/navigation/BackToTop";
import PageContainer from "../components/layout/PageContainer";

function GalleryPage() {
  return (
    <PageContainer>
      <ContentSection labelledBy="gallery-heading">
        <h1 id="gallery-heading">Gallery</h1>

        <div className="prose-width">
          <h2>Coming Soon</h2>

          <p>
            We&apos;re saving this space for memories from our wedding
            celebration. Check back after May 1, 2027<strong>*</strong> for photos and our favorite moments
            from the day.
          </p>

          <p>
            In the meantime, you can explore <Link to="/story">Our Story</Link>{" "}
            and the inspiration behind the celebration on our{" "}
            <Link to="/theme">Theme &amp; Attire</Link> page.
          </p>

          <p><i>
            *You may want to wait a few weeks (or months) before checking back in; preparing the festivities was a labor of love with extra emphasis on labor, and we're probably going to need a few months' worth of a nap to recover! (Thanks in advance for understanding!!)</i>
          </p>
        </div>
      </ContentSection>

      <BackToTop />
    </PageContainer>
  );
}

export default GalleryPage;
