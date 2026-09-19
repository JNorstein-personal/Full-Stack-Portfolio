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
          {siteContent.wedding.date.fullDisplay}
        </p>

        <h1 id="welcome-heading">
          {siteContent.labels.siteIdentity}
        </h1>

        <div className="prose-width">
          <p>
            Welcome to our wedding website. We’re looking
            forward to celebrating with you and have gathered
            the information you’ll need to plan for the day
            here.
          </p>

          <p>
            {siteContent.wedding.generalLocation}
          </p>

          <Link
            className="button button--primary"
            to="/rsvp/"
          >
            {siteContent.labels.rsvp}
          </Link>
        </div>
      </ContentSection>

      <ContentSection labelledBy="planning-heading">
        <h2 id="planning-heading">
          Plan Your Visit
        </h2>

        <div className="prose-width">
          <p>
            Start with the information most useful for
            preparing for the wedding:
          </p>

          <ul>
            <li>
              <Link to="/theme">
                Theme and Attire
              </Link>
            </li>
            <li>
              <Link to="/venues">
                Venues
              </Link>
            </li>
            <li>
              <Link to="/travel">
                Travel
              </Link>
            </li>
          </ul>
        </div>
      </ContentSection>

      <ContentSection labelledBy="information-heading">
        <h2 id="information-heading">
          Wedding Day
        </h2>

        <div className="prose-width">
          {activeEventConfiguration.schedule.map((event) => (
            <div key={event.id}>
              <h3>{event.label}</h3>

              <p>
                <strong>{event.venueName}</strong>
                <br />
                {event.time}
              </p>
            </div>
          ))}

          <p>
            {activeEventConfiguration.receptionDescription}
          </p>

          <p>
            <Link to="/venues">
              View venue information
            </Link>
            {" · "}
            <Link to="/schedule">
              View the wedding schedule
            </Link>
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="story-heading">
        <h2 id="story-heading">
          Our Story
        </h2>

        <div className="prose-width">
          <p>
            We’ll share more about us, and the path that
            brought us to May 1, 2027 on our 'Our Story' page.
          </p>

          <p>
            <Link to="/story">
              Read Our Story
            </Link>
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="rsvp-reminder-heading">
        <h2 id="rsvp-reminder-heading">
          RSVP Reminder
        </h2>

        <div className="prose-width">
          <p>
            Please RSVP by{" "}
            <strong>
              {siteContent.rsvp.deadline.display}
            </strong>
            . Online responses may be revised as needed
            before the deadline.
          </p>

          <p>
            Need help with your RSVP? Email{" "}
            <a
              href={`mailto:${siteContent.rsvp.assistanceEmail}`}
            >
              {siteContent.rsvp.assistanceEmail}
            </a>
            .
          </p>
        </div>
      </ContentSection>
    </PageContainer>
  );
}

export default HomePage;