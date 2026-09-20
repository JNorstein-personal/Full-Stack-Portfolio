const test = require("node:test");
const assert = require("node:assert/strict");

const {
  APPROVED_RESEND_LIVE_TEST,
  validateResendLiveTest,
} = require(
  "../src/services/resendLiveValidation"
);

function environment(
  overrides = {},
) {
  return {
    NODE_ENV: "development",
    EMAIL_PROVIDER: "resend",
    RSVP_FROM_NAME:
      APPROVED_RESEND_LIVE_TEST
        .fromName,
    RSVP_FROM_EMAIL:
      APPROVED_RESEND_LIVE_TEST
        .fromEmail,
    RSVP_REPLY_TO_EMAIL:
      APPROVED_RESEND_LIVE_TEST
        .replyToEmail,
    ...overrides,
  };
}

test(
  "live Resend validation builds only the approved isolated test message",
  () => {
    assert.deepEqual(
      validateResendLiveTest({
        environment:
          environment(),
        recipient:
          "owner@example.com",
        acknowledgement:
          APPROVED_RESEND_LIVE_TEST
            .acknowledgement,
      }),
      {
        to:
          "owner@example.com",
        from:
          "Norstein-Dashiell Wedding <confirm@rsvp.loreweavercreations.com>",
        replyTo:
          "RSVPhelp@loreweavercreations.com",
        subject:
          "Norstein-Dashiell Wedding RSVP email delivery test",
        text: [
          "This is an isolated Resend delivery test for the Norstein-Dashiell Wedding RSVP system.",
          "",
          "No RSVP was submitted, stored, revised, or modified by this test.",
          "No production invitation or guest record was accessed.",
          "",
          "Reply-To is configured as RSVPhelp@loreweavercreations.com.",
        ].join("\n"),
      },
    );
  },
);

test(
  "live Resend validation refuses production mode",
  () => {
    assert.throws(
      () =>
        validateResendLiveTest({
          environment:
            environment({
              NODE_ENV:
                "production",
            }),
          recipient:
            "owner@example.com",
          acknowledgement:
            APPROVED_RESEND_LIVE_TEST
              .acknowledgement,
        }),
      /must not run in production mode/,
    );
  },
);

test(
  "live Resend validation refuses unapproved sender or reply-to configuration",
  () => {
    for (
      const overrides of [
        {
          EMAIL_PROVIDER:
            "other",
        },
        {
          RSVP_FROM_NAME:
            "Other Wedding",
        },
        {
          RSVP_FROM_EMAIL:
            "other@example.com",
        },
        {
          RSVP_REPLY_TO_EMAIL:
            "other@example.com",
        },
      ]
    ) {
      assert.throws(
        () =>
          validateResendLiveTest({
            environment:
              environment(
                overrides,
              ),
            recipient:
              "owner@example.com",
            acknowledgement:
              APPROVED_RESEND_LIVE_TEST
                .acknowledgement,
          }),
        /approved wedding email identity/,
      );
    }
  },
);

test(
  "live Resend validation requires explicit recipient and exact acknowledgement",
  () => {
    assert.throws(
      () =>
        validateResendLiveTest({
          environment:
            environment(),
          recipient: "",
          acknowledgement:
            APPROVED_RESEND_LIVE_TEST
              .acknowledgement,
        }),
      /explicit test recipient/,
    );

    assert.throws(
      () =>
        validateResendLiveTest({
          environment:
            environment(),
          recipient:
            "owner@example.com",
          acknowledgement:
            "SEND",
        }),
      /acknowledgement/,
    );
  },
);
