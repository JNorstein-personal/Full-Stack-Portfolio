require("dotenv").config();

const {
  loadEnvironment,
} = require(
  "../src/config/env"
);
const {
  createConfiguredDeliveryService,
} = require(
  "../src/services/deliveryService"
);
const {
  createInvitationService,
} = require(
  "../src/services/invitationService"
);
const {
  createManualResendService,
} = require(
  "../src/services/manualResendService"
);
const {
  validateManualResendInvocation,
} = require(
  "../src/services/manualResendMaintenance"
);
const {
  createConfiguredEmailTransport,
} = require(
  "../src/services/resendEmailTransport"
);
const {
  createGoogleSheetsConnection,
} = require(
  "../src/services/storage/googleSheetsConnection"
);
const {
  createGoogleSheetsStore,
} = require(
  "../src/services/storage/googleSheetsStore"
);

async function main() {
  const environment =
    loadEnvironment();

  const invocation =
    validateManualResendInvocation({
      environment,
      inviteCode:
        process.env
          .RSVP_MANUAL_RESEND_INVITE_CODE,
      acknowledgement:
        process.env
          .RSVP_MANUAL_RESEND_ACK,
    });

  const connection =
    createGoogleSheetsConnection({
      spreadsheetId:
        environment
          .GOOGLE_SPREADSHEET_ID,
    });

  await connection.verifyAccess();

  const rsvpStore =
    createGoogleSheetsStore({
      sheets:
        connection
          .getSheetsClient(),
      spreadsheetId:
        connection
          .getSpreadsheetId(),
    });

  const invitationService =
    createInvitationService({
      runtimeEnvironment:
        environment.NODE_ENV,
      invitationSource:
        Object.freeze({
          async findByCanonicalCode(
            canonicalCode,
          ) {
            return rsvpStore
              .findInvitationByCanonicalCode(
                canonicalCode,
              );
          },
        }),
    });

  const emailTransport =
    createConfiguredEmailTransport({
      environment,
    });

  const deliveryService =
    createConfiguredDeliveryService({
      environment,
      emailTransport,
    });

  const resendService =
    createManualResendService({
      invitationService,
      rsvpStore,
      deliveryService,
    });

  const result =
    await resendService.resend(
      invocation.inviteCode,
    );

  if (
    result.status === "notFound"
  ) {
    console.error(
      "Manual RSVP confirmation resend: NOT FOUND",
    );
    process.exitCode = 1;
    return;
  }

  if (
    result.status !==
      "recorded" ||
    ![
      "sent",
      "failed",
      "uncertain",
    ].includes(
      result.result,
    )
  ) {
    throw new Error(
      "Manual RSVP confirmation resend returned an invalid result.",
    );
  }

  if (result.result === "sent") {
    console.log(
      "Manual RSVP confirmation resend: PASS (sent)",
    );
    return;
  }

  console.error(
    `Manual RSVP confirmation resend: RECORDED (${result.result})`,
  );
  process.exitCode = 1;
}

main().catch(() => {
  console.error(
    "Manual RSVP confirmation resend: FAIL",
  );
  process.exitCode = 1;
});
