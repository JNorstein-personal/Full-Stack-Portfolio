import { Link } from "react-router-dom";

import ContentSection from "../components/layout/ContentSection";
import PageContainer from "../components/layout/PageContainer";
import { activeEventConfiguration } from "../data/eventConfigurations.js";
import { siteContent } from "../data/siteContent.js";

function HomePage() {
  return (
    <PageContainer>
      <ContentSection labelledBy="welcome-heading">
        <p className="subtitle">
          {siteContent.wedding.date.display}
        </p>

        <h1 id="welcome-heading">
          {siteContent.labels.siteIdentity}
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
            {siteContent.labels.rsvp}
          </Link>
        </div>
      </ContentSection>

      <ContentSection labelledBy="information-heading">
        <h2 id="information-heading">
          Wedding Information
        </h2>

        <div className="prose-width">
          <p>
            {siteContent.wedding.generalLocation}
          </p>

          <p>
            <strong>Current event plan:</strong>{" "}
            {activeEventConfiguration.displayName}
          </p>

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