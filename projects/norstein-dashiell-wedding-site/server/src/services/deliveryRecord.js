function confirmationDestination(
  confirmation,
) {
  if (
    confirmation.method ===
    "email"
  ) {
    return confirmation.email;
  }

  if (
    confirmation.method ===
    "textMessage"
  ) {
    return confirmation.mobile;
  }

  return null;
}

function buildDeliveryRecord({
  recordedAt,
  action,
  version,
  mutationId,
  confirmation,
  administrativeEmail,
  delivery,
}) {
  return Object.freeze({
    recordedAt,
    action,
    version,
    ...(mutationId
      ? { mutationId }
      : {}),
    guest: Object.freeze({
      method:
        confirmation.method,
      destination:
        confirmationDestination(
          confirmation,
        ),
      status:
        delivery
          .guestDeliveryStatus,
    }),
    administrative:
      Object.freeze({
        method: "email",
        destination:
          administrativeEmail ||
          null,
        status:
          delivery
            .administrativeDeliveryStatus,
      }),
  });
}

function buildResendRecord({
  recordedAt,
  version,
  confirmation,
  status,
}) {
  return Object.freeze({
    recordedAt,
    requestedBy:
      "administrator",
    version,
    guest: Object.freeze({
      method:
        confirmation.method,
      destination:
        confirmationDestination(
          confirmation,
        ),
      status,
    }),
  });
}

module.exports = {
  buildDeliveryRecord,
  buildResendRecord,
  confirmationDestination,
};
