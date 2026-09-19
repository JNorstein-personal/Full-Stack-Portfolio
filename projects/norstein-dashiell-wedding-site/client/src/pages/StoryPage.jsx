import { Link } from "react-router-dom";

import ContentSection from "../components/layout/ContentSection";
import PageContainer from "../components/layout/PageContainer";

function StoryPage() {
  return (
    <PageContainer>
      <ContentSection labelledBy="story-heading">
        <h1 id="story-heading">
          Our Story
        </h1>

        <div className="prose-width">
          <p>
            We’re still putting our story into our own words.
            This page will share more about us, the life
            we’ve built together, and the path that brought
            us to our wedding day.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="relationship-heading">
        <h2 id="relationship-heading">
          Our Story
        </h2>

        <div className="prose-width">
          {/*
            STEP 14 STORY CONTENT PROMPTS

            Replace this provisional paragraph with the
            couple-approved relationship narrative.

            Useful prompts:
            - How and when did we meet?
            - What first drew us to one another?
            - What moments best represent our relationship?
            - What parts of our shared life do we want guests
              to know about?
            - Which details are meaningful without publishing
              anything we would prefer to keep private?
          */}

          <p>
            This section will tell the story of how we came
            together and some of the moments that have shaped
            our life as a couple.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="planning-heading">
        <h2 id="planning-heading">
          From Engagement to Wedding Day
        </h2>

        <div className="prose-width">
          {/*
            STEP 14 ENGAGEMENT / PLANNING CONTENT PROMPTS

            Replace this provisional paragraph with
            couple-approved engagement and wedding-planning
            context.

            Useful prompts:
            - What part of the engagement story do we want to
              share?
            - Why did we choose May 1, 2027?
            - What led us to the wedding's theme and style?
            - What has been especially meaningful about
              planning this celebration?
            - Are there people, traditions, places, or ideas
              we want to acknowledge here?
          */}

          <p>
            We’ll also share a little about our engagement
            and the planning that has led to the celebration
            on May 1, 2027.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="story-next-step-heading">
        <h2 id="story-next-step-heading">
          Join Us
        </h2>

        <div className="prose-width">
          <p>
            Wedding-day information and RSVP details are
            available throughout the site.
          </p>

          <p>
            <Link
              className="button button--primary"
              to="/rsvp/"
            >
              RSVP
            </Link>
          </p>

          <p>
            <Link to="/">
              Return to the wedding homepage
            </Link>
          </p>
        </div>
      </ContentSection>
    </PageContainer>
  );
}

export default StoryPage;