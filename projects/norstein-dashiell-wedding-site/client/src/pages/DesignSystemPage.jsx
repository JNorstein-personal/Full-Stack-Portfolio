import { Link } from "react-router-dom";

import Button from "../components/common/Button";
import Card from "../components/common/Card";
import ExternalLink from "../components/common/ExternalLink";
import StatusMessage from "../components/common/StatusMessage";
import ContentSection from "../components/layout/ContentSection";
import PageContainer from "../components/layout/PageContainer";

import "../styles/design-system-calibration.css";

function DesignSystemPage() {
  function preventSubmission(event) {
    event.preventDefault();
  }

  return (
    <PageContainer className="design-system-calibration">
      <ContentSection labelledBy="calibration-heading">
        <p className="display-title">
          Norstein-Dashiell 2027
        </p>

        <h1 id="calibration-heading">
          Design System Calibration
        </h1>

        <p className="subtitle">
          Temporary development-only browser calibration
          surface
        </p>

        <div className="prose-width">
          <p>
            This page exercises the shared wedding-site
            design vocabulary in one place so typography,
            spacing, controls, surfaces, responsive behavior,
            and accessibility treatments can be evaluated
            before additional pages are implemented.
          </p>

          <p>
            It is intentionally available only during local
            development and must not become part of the
            production route set.
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="typography-heading">
        <h2 id="typography-heading">
          Typography
        </h2>

        <div className="design-system-calibration__stack">
          <h1>Heading Level 1</h1>
          <h2>Heading Level 2</h2>
          <h3>Heading Level 3</h3>
          <h4>Heading Level 4</h4>

          <p className="design-system-calibration__functional-heading">
            Felix Titling Functional Heading 2027
          </p>

          <p className="subtitle">
            Subtitle and emphasized body treatment
          </p>

          <div className="prose-width">
            <p>
              This is representative body copy using the
              established Book Antiqua body role. It should
              remain comfortable to read across narrow and
              wide layouts without appearing cramped,
              excessively large, or unusually sparse.
            </p>

            <p>
              This paragraph also contains{" "}
              <strong>bold body text</strong>,{" "}
              <em>italic body text</em>, and{" "}
              <strong>
                <em>bold italic body text</em>
              </strong>{" "}
              so the available Book Antiqua faces and browser
              synthesis can be inspected together.
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection labelledBy="links-heading">
        <h2 id="links-heading">
          Links
        </h2>

        <div className="design-system-calibration__stack prose-width">
          <p>
            <Link to="/">
              Ordinary internal link
            </Link>
          </p>

          <p>
            After following the ordinary link and returning
            with the browser Back command, inspect its
            visited treatment.
          </p>

          <p>
            <ExternalLink href="https://example.com">
              External link example
            </ExternalLink>
          </p>
        </div>
      </ContentSection>

      <ContentSection labelledBy="buttons-heading">
        <h2 id="buttons-heading">
          Buttons
        </h2>

        <div className="design-system-calibration__row">
          <Button>
            Primary Button
          </Button>

          <Button variant="secondary">
            Secondary Button
          </Button>

          <Button disabled>
            Disabled Button
          </Button>
        </div>
      </ContentSection>

      <ContentSection labelledBy="forms-heading">
        <h2 id="forms-heading">
          Form Controls
        </h2>

        <form
          className="form-width form-stack"
          onSubmit={preventSubmission}
        >
          <div className="form-field">
            <label htmlFor="calibration-name">
              Text input{" "}
              <span className="required-indicator">
                *
              </span>
            </label>

            <input
              id="calibration-name"
              name="calibration-name"
              type="text"
              placeholder="Representative text input"
            />

            <p
              id="calibration-name-help"
              className="form-help"
            >
              Representative help text beneath a standard
              form control.
            </p>
          </div>

          <div className="form-field">
            <label htmlFor="calibration-select">
              Select control
            </label>

            <select
              id="calibration-select"
              name="calibration-select"
              defaultValue=""
            >
              <option value="" disabled>
                Select an option
              </option>
              <option value="one">
                First option
              </option>
              <option value="two">
                Second option
              </option>
            </select>
          </div>

          <fieldset>
            <legend>
              Radio group
            </legend>

            <div className="form-field">
              <label className="form-choice">
                <input
                  type="radio"
                  name="calibration-radio"
                  value="one"
                  defaultChecked
                />
                <span>First radio option</span>
              </label>

              <label className="form-choice">
                <input
                  type="radio"
                  name="calibration-radio"
                  value="two"
                />
                <span>Second radio option</span>
              </label>
            </div>
          </fieldset>

          <div className="form-field">
            <label className="form-choice">
              <input
                type="checkbox"
                name="calibration-checkbox"
              />
              <span>
                Representative checkbox option
              </span>
            </label>
          </div>

          <div className="form-field">
            <label htmlFor="calibration-invalid">
              Invalid control example
            </label>

            <input
              id="calibration-invalid"
              name="calibration-invalid"
              type="text"
              aria-invalid="true"
              aria-describedby="calibration-invalid-error"
              defaultValue="Invalid example"
            />

            <p
              id="calibration-invalid-error"
              className="form-help"
            >
              Example validation message associated with an
              invalid control.
            </p>
          </div>

          <div className="form-field">
            <label htmlFor="calibration-textarea">
              Textarea
            </label>

            <textarea
              id="calibration-textarea"
              name="calibration-textarea"
              placeholder="Representative multiline content"
            />
          </div>

          <Button type="submit">
            Representative Submit
          </Button>
        </form>
      </ContentSection>

      <ContentSection labelledBy="status-heading">
        <h2 id="status-heading">
          Status Messages
        </h2>

        <div className="design-system-calibration__grid">
          <StatusMessage type="information">
            Representative informational message.
          </StatusMessage>

          <StatusMessage type="error">
            Representative error message.
          </StatusMessage>

          <StatusMessage type="warning">
            Representative warning message.
          </StatusMessage>

          <StatusMessage type="success">
            Representative success message.
          </StatusMessage>

          <StatusMessage type="uncertainty">
            Representative submission-uncertainty message.
          </StatusMessage>

          <StatusMessage type="closed">
            Representative closed-state message.
          </StatusMessage>
        </div>
      </ContentSection>

      <ContentSection labelledBy="surfaces-heading">
        <h2 id="surfaces-heading">
          Cards, Borders, and Surfaces
        </h2>

        <div className="design-system-calibration__grid">
          <Card>
            <h3>
              Shared Card
            </h3>

            <p>
              This specimen uses the actual reusable Card
              component and its shared border, radius,
              padding, surface, and shadow.
            </p>
          </Card>

          <div className="design-system-calibration__decorative-border">
            <h3>
              Decorative Border
            </h3>

            <p>
              Representative decorative framing using the
              established decorative-border token.
            </p>
          </div>

          <div className="design-system-calibration__surface">
            <h3>
              Readable Surface
            </h3>

            <p>
              Standard readable surface using the primary
              site surface token.
            </p>
          </div>

          <div className="design-system-calibration__surface design-system-calibration__surface--muted">
            <h3>
              Muted Surface
            </h3>

            <p>
              Secondary readable surface using the muted
              surface token.
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection labelledBy="focus-heading">
        <h2 id="focus-heading">
          Keyboard and Responsive Checks
        </h2>

        <div className="prose-width">
          <p>
            Navigate this page using the Tab and Shift+Tab
            keys. Every interactive control should receive a
            clearly visible focus indicator without being
            obscured by the sticky header.
          </p>

          <p>
            Resize the viewport through representative phone,
            tablet, laptop, and desktop widths. Typography,
            navigation, buttons, form controls, cards, and
            status messages should remain readable and
            usable without horizontal scrolling.
          </p>

          <p id="visited-link-target">
            Approved background-image and decorative-icon
            specimens are intentionally omitted until an
            appropriate reviewed asset exists.
          </p>
        </div>
      </ContentSection>
    </PageContainer>
  );
}

export default DesignSystemPage;