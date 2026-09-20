const DELIVERY_STATUSES =
  Object.freeze([
    "sent",
    "failed",
    "uncertain",
  ]);

function assertEmailTransport(
  transport,
) {
  if (
    !transport ||
    typeof transport.sendEmail !==
      "function"
  ) {
    throw new Error(
      "Email delivery requires a transport with a sendEmail method.",
    );
  }

  return transport;
}

function normalizeTransportStatus(
  result,
) {
  const status =
    typeof result === "string"
      ? result
      : result &&
          typeof result ===
            "object"
        ? result.status
        : undefined;

  return DELIVERY_STATUSES.includes(
    status,
  )
    ? status
    : "uncertain";
}

module.exports = {
  DELIVERY_STATUSES,
  assertEmailTransport,
  normalizeTransportStatus,
};
