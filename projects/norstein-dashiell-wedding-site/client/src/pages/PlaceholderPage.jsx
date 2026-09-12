import PageContainer from "../components/layout/PageContainer";

function PlaceholderPage({
  title,
  message = "Page content is being prepared.",
}) {
  return (
    <PageContainer>
      <div className="prose-width">
        <h1>{title}</h1>

        <p>
          {message}
        </p>
      </div>
    </PageContainer>
  );
}

export default PlaceholderPage;