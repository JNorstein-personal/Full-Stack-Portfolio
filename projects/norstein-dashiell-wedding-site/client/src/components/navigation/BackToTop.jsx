import castleImage from "../../assets/images/Castle.png";

function BackToTop() {
  function handleBackToTop() {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }

  return (
    <div className="back-to-top">
      <button
        className="back-to-top__button"
        type="button"
        onClick={handleBackToTop}
        aria-label="Return to top of page"
      >
        <img
          className="back-to-top__image"
          src={castleImage}
          alt=""
          aria-hidden="true"
        />
      </button>
      <p>
      <br /><i>{"<<"} Click the castle to
      <br />{"<<<"} return to the
      <br />{"<<"} top of the page.</i></p>
    </div>
  );
}

export default BackToTop;
