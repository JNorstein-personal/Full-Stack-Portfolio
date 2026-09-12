function ExternalLink({
  children,
  className = "",
  ...props
}) {
  const classes = [
    "external-link",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <a
      {...props}
      className={classes}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <span
        className="external-link__indicator"
        aria-hidden="true"
      >
        ↗
      </span>
      <span className="visually-hidden">
        {" "}
        (opens in a new tab)
      </span>
    </a>
  );
}

export default ExternalLink;