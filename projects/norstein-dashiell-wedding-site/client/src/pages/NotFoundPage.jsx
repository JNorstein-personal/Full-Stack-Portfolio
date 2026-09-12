import { Link } from "react-router-dom";

import PageContainer from "../components/layout/PageContainer";

function NotFoundPage() {
  return (
    <PageContainer>
      <div className="prose-width">
        <h1>Page Not Found</h1>

        <p>
          The requested wedding website page could
          not be found.
        </p>

        <p>
          <Link to="/">
            Return to the wedding homepage
          </Link>
        </p>
      </div>
    </PageContainer>
  );
}

export default NotFoundPage;