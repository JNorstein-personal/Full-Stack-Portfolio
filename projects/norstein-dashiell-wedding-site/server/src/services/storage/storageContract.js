const RSVP_STORAGE_METHODS =
  Object.freeze([
    "findInvitationByCanonicalCode",
    "getCurrentRsvp",
    "replaceCurrentRsvp",
    "appendRsvpVersion",
    "listRsvpVersions",
    "getSubmissionRecord",
    "setSubmissionRecord",
    "appendDeliveryRecord",
    "listDeliveryRecords",
    "appendResendRecord",
    "listResendRecords",
  ]);

function assertRsvpStorageContract(store) {
  if (
    store === null ||
    typeof store !== "object"
  ) {
    throw new Error(
      "RSVP storage adapter must be an object.",
    );
  }

  for (
    const methodName of
    RSVP_STORAGE_METHODS
  ) {
    if (
      typeof store[methodName] !==
      "function"
    ) {
      throw new Error(
        `RSVP storage adapter is missing required method: ${methodName}`,
      );
    }
  }

  return store;
}

module.exports = {
  RSVP_STORAGE_METHODS,
  assertRsvpStorageContract,
};
