const GOOGLE_SHEETS_SCOPE =
  "https://www.googleapis.com/auth/spreadsheets";

function requireNonemptyString(
  value,
  fieldName,
) {
  if (
    typeof value !== "string" ||
    value.trim() === ""
  ) {
    throw new Error(
      `Google Sheets configuration requires ${fieldName}.`,
    );
  }

  return value;
}

function loadGoogleApi() {
  try {
    return require("googleapis").google;
  } catch {
    throw new Error(
      "Google Sheets client dependency is unavailable.",
    );
  }
}

function createGoogleSheetsConnection({
  spreadsheetId,
  serviceAccountFile,
  googleApi,
} = {}) {
  const validatedSpreadsheetId =
    requireNonemptyString(
      spreadsheetId,
      "GOOGLE_SPREADSHEET_ID",
    );

  const validatedServiceAccountFile =
    requireNonemptyString(
      serviceAccountFile,
      "GOOGLE_SERVICE_ACCOUNT_FILE",
    );

  const google =
    googleApi ||
    loadGoogleApi();

  if (
    !google.auth ||
    typeof google.auth.GoogleAuth !==
      "function" ||
    typeof google.sheets !==
      "function"
  ) {
    throw new Error(
      "Google Sheets client dependency is invalid.",
    );
  }

  const auth =
    new google.auth.GoogleAuth({
      keyFile:
        validatedServiceAccountFile,
      scopes: [
        GOOGLE_SHEETS_SCOPE,
      ],
    });

  const sheets =
    google.sheets({
      version: "v4",
      auth,
    });

  if (
    !sheets ||
    !sheets.spreadsheets ||
    typeof sheets.spreadsheets.get !==
      "function"
  ) {
    throw new Error(
      "Google Sheets client dependency is invalid.",
    );
  }

  return Object.freeze({
    async verifyAccess() {
      try {
        await sheets.spreadsheets.get({
          spreadsheetId:
            validatedSpreadsheetId,
          fields: "spreadsheetId",
        });
      } catch {
        throw new Error(
          "Google Sheets authentication/access verification failed.",
        );
      }

      return true;
    },

    getSheetsClient() {
      return sheets;
    },

    getSpreadsheetId() {
      return validatedSpreadsheetId;
    },
  });
}

module.exports = {
  GOOGLE_SHEETS_SCOPE,
  createGoogleSheetsConnection,
};
