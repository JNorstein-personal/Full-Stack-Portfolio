const MANUAL_RESEND_ACK =
  "RESEND_CURRENT_RSVP_CONFIRMATION";

function requireNonemptyString(
  value,
  fieldName,
) {
  if (
    typeof value !== "string" ||
    value.trim() === ""
  ) {
    throw new Error(
      `Manual resend requires ${fieldName}.`,
    );
  }

  return value.trim();
}

function validateManualResendInvocation({
  environment,
  inviteCode,
  acknowledgement,
} = {}) {
  if (!environment) {
    throw new Error(
      "Manual resend requires validated environment configuration.",
    );
  }

  if (
    environment.NODE_ENV !==
    "production"
  ) {
    throw new Error(
      "Manual resend maintenance is enabled only in production mode.",
    );
  }

  const validatedInviteCode =
    requireNonemptyString(
      inviteCode,
      "an invitation code",
    );

  if (
    acknowledgement !==
    MANUAL_RESEND_ACK
  ) {
    throw new Error(
      "Manual resend requires explicit operator acknowledgement.",
    );
  }

  return Object.freeze({
    inviteCode:
      validatedInviteCode,
  });
}

module.exports = {
  MANUAL_RESEND_ACK,
  validateManualResendInvocation,
};
