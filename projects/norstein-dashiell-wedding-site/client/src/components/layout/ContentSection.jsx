function ContentSection({
  children,
  className = "",
  labelledBy,
  ...props
}) {
  const classes = [
    "content-section",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      className={classes}
      aria-labelledby={labelledBy}
      {...props}
    >
      {children}
    </section>
  );
}

export default ContentSection;