require("dotenv").config();

const {
  loadEnvironment,
} = require("../src/config/env");
const {
  createGoogleSheetsConnection,
} = require(
  "../src/services/storage/googleSheetsConnection"
);
const {
  rebuildRsvpOverview,
} = require(
  "../src/services/storage/googleSheetsRsvpOverview"
);

const REQUIRED_ACK =
  "REBUILD_RSVP_OVERVIEW";

async function main() {
  if (
    process.env
      .RSVP_OVERVIEW_REBUILD_ACK !==
    REQUIRED_ACK
  ) {
    throw new Error(
      "RSVP Overview rebuild requires explicit acknowledgement.",
    );
  }

  const environment =
    loadEnvironment();

  if (
    !environment
      .GOOGLE_SPREADSHEET_ID
  ) {
    throw new Error(
      "RSVP Overview rebuild requires GOOGLE_SPREADSHEET_ID.",
    );
  }

  const connection =
    createGoogleSheetsConnection({
      spreadsheetId:
        environment
          .GOOGLE_SPREADSHEET_ID,
    });

  await connection.verifyAccess();

  const result =
    await rebuildRsvpOverview({
      sheets:
        connection
          .getSheetsClient(),
      spreadsheetId:
        connection
          .getSpreadsheetId(),
    });

  console.log(
    `RSVP Overview rebuild: PASS (${result.invitationCount} invitation rows, ${result.responseCount} current responses, ${result.attendeeCount} attendee rows)`,
  );
}

main().catch(() => {
  console.error(
    "RSVP Overview rebuild: FAIL",
  );
  process.exitCode = 1;
});
