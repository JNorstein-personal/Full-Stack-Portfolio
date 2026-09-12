function PageContainer({
  children,
  className = "",
}) {
  const classes = [
    "page-container",
    "site-width",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {children}
    </div>
  );
}

export default PageContainer;