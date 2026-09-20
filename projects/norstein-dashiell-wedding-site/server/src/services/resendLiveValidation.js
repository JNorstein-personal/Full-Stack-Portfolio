const APPROVED_RESEND_LIVE_TEST =
  Object.freeze({
    provider: "resend",
    fromName:
      "Norstein-Dashiell Wedding",
    fromEmail:
      "confirm@rsvp.loreweavercreations.com",
    replyToEmail:
      "RSVPhelp@loreweavercreations.com",
    acknowledgement:
      "SEND_ISOLATED_RESEND_TEST",
  });

function assertEmailAddress(
  value,
) {
  return (
    typeof value === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      value.trim(),
    )
  );
}

function validateResendLiveTest({
  environment,
  recipient,
  acknowledgement,
}) {
  if (!environment) {
    throw new Error(
      "Resend live validation requires parsed environment configuration.",
    );
  }

  if (
    environment.NODE_ENV ===
    "production"
  ) {
    throw new Error(
      "Resend live validation must not run in production mode.",
    );
  }

  if (
    environment.EMAIL_PROVIDER !==
      APPROVED_RESEND_LIVE_TEST.provider ||
    environment.RSVP_FROM_NAME !==
      APPROVED_RESEND_LIVE_TEST.fromName ||
    environment.RSVP_FROM_EMAIL !==
      APPROVED_RESEND_LIVE_TEST.fromEmail ||
    environment
      .RSVP_REPLY_TO_EMAIL !==
      APPROVED_RESEND_LIVE_TEST.replyToEmail
  ) {
    throw new Error(
      "Resend live validation requires the approved wedding email identity.",
    );
  }

  if (
    !assertEmailAddress(
      recipient,
    )
  ) {
    throw new Error(
      "Resend live validation requires an explicit test recipient.",
    );
  }

  if (
    acknowledgement !==
    APPROVED_RESEND_LIVE_TEST
      .acknowledgement
  ) {
    throw new Error(
      "Resend live validation acknowledgement is missing or invalid.",
    );
  }

  return Object.freeze({
    to: recipient.trim(),
    from:
      `${APPROVED_RESEND_LIVE_TEST.fromName} <${APPROVED_RESEND_LIVE_TEST.fromEmail}>`,
    replyTo:
      APPROVED_RESEND_LIVE_TEST
        .replyToEmail,
    subject:
      "Norstein-Dashiell Wedding RSVP email delivery test",
    text: [
      "This is an isolated Resend delivery test for the Norstein-Dashiell Wedding RSVP system.",
      "",
      "No RSVP was submitted, stored, revised, or modified by this test.",
      "No production invitation or guest record was accessed.",
      "",
      `Reply-To is configured as ${APPROVED_RESEND_LIVE_TEST.replyToEmail}.`,
    ].join("\n"),
  });
}

module.exports = {
  APPROVED_RESEND_LIVE_TEST,
  validateResendLiveTest,
};
