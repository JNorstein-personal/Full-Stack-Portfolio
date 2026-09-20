require("dotenv").config();

const {
  loadEnvironment,
} = require(
  "../src/config/env"
);
const {
  createConfiguredEmailTransport,
} = require(
  "../src/services/resendEmailTransport"
);
const {
  validateResendLiveTest,
} = require(
  "../src/services/resendLiveValidation"
);

async function main() {
  const environment =
    loadEnvironment();

  const message =
    validateResendLiveTest({
      environment,
      recipient:
        process.env
          .RESEND_LIVE_TEST_RECIPIENT,
      acknowledgement:
        process.env
          .RESEND_LIVE_TEST_ACK,
    });

  const transport =
    createConfiguredEmailTransport({
      environment,
    });

  const result =
    await transport.sendEmail(
      message,
    );

  if (
    !result ||
    result.status !== "sent"
  ) {
    throw new Error(
      "Resend isolated live-email validation did not receive a definite accepted result.",
    );
  }

  console.log(
    "Resend isolated live-email validation: PASS",
  );
}

main().catch(() => {
  console.error(
    "Resend isolated live-email validation: FAIL",
  );
  process.exitCode = 1;
});
