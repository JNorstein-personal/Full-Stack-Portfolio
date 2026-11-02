import { Link } from "react-router-dom";
import CastleMoving from "client/src/assets/images/CastleMoving.gif";
import PageContainer from "../components/layout/PageContainer";

function NotFoundPage() {
  return (
    <PageContainer>
      <div className="prose-width">
        <h1>Page Not Found</h1>
        <img
          className="not-found-image"
          src={CastleMoving}
          alt="Even castles get lost sometimes"
          title="Even castles get lost sometimes"
        />
        <p>
          It looks like this page wandered off somewhere.
          No worries—we can help you find your way back.
        </p>

        <p>
          Here are a few useful places to continue your journey:
        </p>

        <ul>
          <li>
            <Link to="/">Wedding Home</Link>
          </li>

          <li>
            <Link to="/rsvp/">RSVP</Link>
          </li>

          <li>
            <Link to="/venue">Venue &amp; Directions</Link>
          </li>

          <li>
            <Link to="/day-of">Day-Of Details</Link>
          </li>

          <li>
            <Link to="/faq">Frequently Asked Questions</Link>
          </li>
        </ul>
      </div>
    </PageContainer>
  );
}

export default NotFoundPage;
