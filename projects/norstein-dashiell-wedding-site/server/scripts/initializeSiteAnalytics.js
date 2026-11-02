require("dotenv").config();

const {
  createGoogleSheetsConnection,
} = require(
  "../src/services/storage/googleSheetsConnection",
);

const {
  ANALYTICS_HEADERS,
  ANALYTICS_SHEET_TITLE,
  quoteSheetTitle,
} = require(
  "../src/services/analytics/googleSheetsAnalyticsStore",
);

const INITIALIZE_ACK =
  "CREATE_SITE_ANALYTICS_SHEET";

async function readHeaders({
  sheets,
  spreadsheetId,
}) {
  const response =
    await sheets.spreadsheets
      .values.get({
        spreadsheetId,
        range:
          `${quoteSheetTitle(
            ANALYTICS_SHEET_TITLE,
          )}!A1:E1`,
      });

  return (
    response &&
    response.data &&
    Array.isArray(
      response.data.values,
    ) &&
    Array.isArray(
      response.data.values[0],
    )
      ? response.data.values[0]
      : []
  );
}

async function main() {
  if (
    process.env.NODE_ENV !==
      "production"
  ) {
    throw new Error(
      "Site analytics initialization requires NODE_ENV=production.",
    );
  }

  if (
    process.env
      .SITE_ANALYTICS_INITIALIZE_ACK !==
      INITIALIZE_ACK
  ) {
    throw new Error(
      "Site analytics initialization requires explicit acknowledgement.",
    );
  }

  const spreadsheetId =
    process.env
      .GOOGLE_SPREADSHEET_ID;

  if (
    typeof spreadsheetId !==
      "string" ||
    spreadsheetId.trim() ===
      ""
  ) {
    throw new Error(
      "Site analytics initialization requires GOOGLE_SPREADSHEET_ID.",
    );
  }

  const connection =
    createGoogleSheetsConnection({
      spreadsheetId,
    });

  await connection.verifyAccess();

  const sheets =
    connection.getSheetsClient();

  const workbook =
    await sheets.spreadsheets.get({
      spreadsheetId,
      fields:
        "sheets.properties.title",
    });

  const titles =
    (
      workbook &&
      workbook.data &&
      Array.isArray(
        workbook.data.sheets,
      )
        ? workbook.data.sheets
        : []
    )
      .map(
        (sheet) =>
          sheet &&
          sheet.properties &&
          sheet.properties.title,
      )
      .filter(Boolean);

  if (
    !titles.includes(
      ANALYTICS_SHEET_TITLE,
    )
  ) {
    await sheets.spreadsheets
      .batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title:
                    ANALYTICS_SHEET_TITLE,
                },
              },
            },
          ],
        },
      });
  }

  const existingHeaders =
    await readHeaders({
      sheets,
      spreadsheetId,
    });

  if (
    existingHeaders.length > 0 &&
    JSON.stringify(
      existingHeaders,
    ) !==
      JSON.stringify(
        ANALYTICS_HEADERS,
      )
  ) {
    throw new Error(
      "Existing Site Analytics worksheet has unexpected headers.",
    );
  }

  if (
    existingHeaders.length === 0
  ) {
    await sheets.spreadsheets
      .values.update({
        spreadsheetId,
        range:
          `${quoteSheetTitle(
            ANALYTICS_SHEET_TITLE,
          )}!A1:E1`,
        valueInputOption:
          "RAW",
        requestBody: {
          values: [
            [...ANALYTICS_HEADERS],
          ],
        },
      });
  }

  console.log(
    "Site analytics worksheet initialization: PASS",
  );
}

main().catch(() => {
  console.error(
    "Site analytics worksheet initialization: FAIL",
  );

  process.exitCode = 1;
});
