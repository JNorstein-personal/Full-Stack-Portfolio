const statusTypes = {
  information: {
    label: "Information",
    role: "status",
  },

  error: {
    label: "Error",
    role: "alert",
  },

  warning: {
    label: "Warning",
    role: "status",
  },

  success: {
    label: "Success",
    role: "status",
  },

  uncertainty: {
    label: "Submission status uncertain",
    role: "status",
  },

  closed: {
    label: "Closed",
    role: "status",
  },
};

function StatusMessage({
  type = "information",
  title,
  children,
  className = "",
  ...props
}) {
  const resolvedType =
    statusTypes[type] ? type : "information";

  const config = statusTypes[resolvedType];

  const classes = [
    "status-message",
    `status-message--${resolvedType}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      role={config.role}
      {...props}
    >
      <strong className="status-message__title">
        {title ?? config.label}
      </strong>

      <div className="status-message__content">
        {children}
      </div>
    </div>
  );
}

export default StatusMessage;