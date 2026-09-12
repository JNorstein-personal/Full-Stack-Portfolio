import { Link } from "react-router-dom";

import ContentSection from "../components/layout/ContentSection";
import PageContainer from "../components/layout/PageContainer";

function HomePage() {
  return (
    <PageContainer>
      <ContentSection labelledBy="welcome-heading">
        <p className="subtitle">
          May 1, 2027
        </p>

        <h1 id="welcome-heading">
          Norstein-Dashiell Wedding
        </h1>

        <div className="prose-width">
          <p>
            Welcome to our wedding website.
            Additional event details and guest
            resources will be added as the site is
            completed.
          </p>

          <Link
            className="button button--primary"
            to="/rsvp/"
          >
            RSVP
          </Link>
        </div>
      </ContentSection>

      <ContentSection labelledBy="information-heading">
        <h2 id="information-heading">
          Wedding Information
        </h2>

        <div className="prose-width">
          <p>
            Use the navigation to access information
            about attire, venues, travel, schedule,
            and other wedding resources as they
            become available.
          </p>
        </div>
      </ContentSection>
    </PageContainer>
  );
}

export default HomePage;