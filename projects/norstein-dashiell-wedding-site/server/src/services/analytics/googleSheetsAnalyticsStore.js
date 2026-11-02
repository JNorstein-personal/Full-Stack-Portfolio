const ANALYTICS_SHEET_TITLE =
  "Site Analytics";

const ANALYTICS_HEADERS =
  Object.freeze([
    "Page Path",
    "Page Views",
    "Anonymous Visitors",
    "Engagement Milliseconds",
    "Average Engagement Seconds",
  ]);

function quoteSheetTitle(title) {
  return `'${String(title).replace(
    /'/g,
    "''",
  )}'`;
}

function validateClient(sheets) {
  if (
    !sheets ||
    !sheets.spreadsheets ||
    !sheets.spreadsheets.values ||
    typeof sheets.spreadsheets.values
      .get !== "function" ||
    typeof sheets.spreadsheets.values
      .update !== "function" ||
    typeof sheets.spreadsheets.values
      .append !== "function"
  ) {
    throw new Error(
      "Site analytics store requires a valid Google Sheets values client.",
    );
  }
}

function parseCount(value) {
  const parsed =
    Number(value);

  return (
    Number.isFinite(parsed) &&
    parsed >= 0
  )
    ? parsed
    : 0;
}

function createGoogleSheetsAnalyticsStore({
  sheets,
  spreadsheetId,
} = {}) {
  validateClient(sheets);

  if (
    typeof spreadsheetId !==
      "string" ||
    spreadsheetId.trim() ===
      ""
  ) {
    throw new Error(
      "Site analytics store requires a spreadsheet identifier.",
    );
  }

  let writeQueue =
    Promise.resolve();

  async function readRows() {
    const response =
      await sheets.spreadsheets
        .values.get({
          spreadsheetId,
          range:
            `${quoteSheetTitle(
              ANALYTICS_SHEET_TITLE,
            )}!A2:E`,
        });

    return (
      response &&
      response.data &&
      Array.isArray(
        response.data.values,
      )
        ? response.data.values
        : []
    );
  }

  async function writeDelta(
    delta,
  ) {
    const rows =
      await readRows();

    const index =
      rows.findIndex(
        (row) =>
          row[0] ===
          delta.pagePath,
      );

    const existing =
      index >= 0
        ? rows[index]
        : [];

    const pageViews =
      parseCount(existing[1]) +
      delta.viewDelta;

    const anonymousVisitors =
      parseCount(existing[2]) +
      delta.visitorDelta;

    const engagementMs =
      parseCount(existing[3]) +
      delta.engagementMs;

    const averageEngagementSeconds =
      pageViews > 0
        ? Number(
            (
              engagementMs /
              1000 /
              pageViews
            ).toFixed(2),
          )
        : 0;

    const row = [
      delta.pagePath,
      pageViews,
      anonymousVisitors,
      engagementMs,
      averageEngagementSeconds,
    ];

    if (index < 0) {
      await sheets.spreadsheets
        .values.append({
          spreadsheetId,
          range:
            `${quoteSheetTitle(
              ANALYTICS_SHEET_TITLE,
            )}!A:E`,
          valueInputOption:
            "RAW",
          insertDataOption:
            "INSERT_ROWS",
          requestBody: {
            values: [row],
          },
        });
    } else {
      const rowNumber =
        index + 2;

      await sheets.spreadsheets
        .values.update({
          spreadsheetId,
          range:
            `${quoteSheetTitle(
              ANALYTICS_SHEET_TITLE,
            )}!A${rowNumber}:E${rowNumber}`,
          valueInputOption:
            "RAW",
          requestBody: {
            values: [row],
          },
        });
    }

    return Object.freeze({
      pagePath:
        delta.pagePath,
      pageViews,
      anonymousVisitors,
      engagementMs,
      averageEngagementSeconds,
    });
  }

  return Object.freeze({
    applyDelta(delta) {
      const operation =
        writeQueue.then(
          () =>
            writeDelta(delta),
        );

      writeQueue =
        operation.catch(
          () => undefined,
        );

      return operation;
    },
  });
}

module.exports = {
  ANALYTICS_HEADERS,
  ANALYTICS_SHEET_TITLE,
  createGoogleSheetsAnalyticsStore,
  quoteSheetTitle,
};
