const GOOGLE_SHEETS_STORE_SCHEMA =
  Object.freeze({
    invitations: Object.freeze({
      title: "Invitations",
      headers: Object.freeze([
        "inviteCode",
        "partyId",
        "configurationJson",
      ]),
    }),
    currentRsvps: Object.freeze({
      title: "Current RSVPs",
      headers: Object.freeze([
        "partyId",
        "version",
        "rsvpJson",
      ]),
    }),
    rsvpVersions: Object.freeze({
      title: "RSVP Versions",
      headers: Object.freeze([
        "partyId",
        "version",
        "action",
        "recordedAt",
        "versionJson",
      ]),
    }),
    submissionRecords: Object.freeze({
      title: "Submission Records",
      headers: Object.freeze([
        "submissionKey",
        "fingerprint",
        "recordJson",
      ]),
    }),
    deliveryRecords: Object.freeze({
      title: "Delivery Records",
      headers: Object.freeze([
        "partyId",
        "recordedAt",
        "recordJson",
      ]),
    }),
    resendRecords: Object.freeze({
      title: "Resend Records",
      headers: Object.freeze([
        "partyId",
        "recordedAt",
        "recordJson",
      ]),
    }),
  });

const GOOGLE_SHEETS_STORE_SECTIONS =
  Object.freeze(
    Object.values(
      GOOGLE_SHEETS_STORE_SCHEMA,
    ),
  );

module.exports = {
  GOOGLE_SHEETS_STORE_SCHEMA,
  GOOGLE_SHEETS_STORE_SECTIONS,
};
