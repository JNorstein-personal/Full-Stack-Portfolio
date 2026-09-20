const test = require("node:test");
const assert = require("node:assert/strict");

const {
  GOOGLE_SHEETS_SCOPE,
  createGoogleSheetsConnection,
} = require(
  "../src/services/storage/googleSheetsConnection"
);

function createFakeGoogle({
  failVerification = false,
} = {}) {
  const state = {
    authOptions: null,
    sheetsOptions: null,
    getRequest: null,
  };

  class GoogleAuth {
    constructor(options) {
      state.authOptions = options;
    }
  }

  const fakeSheets = {
    spreadsheets: {
      async get(request) {
        state.getRequest =
          request;

        if (failVerification) {
          throw new Error(
            "private provider detail",
          );
        }

        return {
          data: {
            spreadsheetId:
              request.spreadsheetId,
          },
        };
      },
    },
  };

  return {
    state,
    googleApi: {
      auth: {
        GoogleAuth,
      },

      sheets(options) {
        state.sheetsOptions =
          options;

        return fakeSheets;
      },
    },
    fakeSheets,
  };
}

test(
  "Google Sheets connection uses service-account key file and Sheets read/write scope",
  () => {
    const fake =
      createFakeGoogle();

    const connection =
      createGoogleSheetsConnection({
        spreadsheetId:
          "fictional-sheet-id",
        serviceAccountFile:
          "C:\\protected\\development-service-account.json",
        googleApi:
          fake.googleApi,
      });

    assert.deepEqual(
      fake.state.authOptions,
      {
        keyFile:
          "C:\\protected\\development-service-account.json",
        scopes: [
          GOOGLE_SHEETS_SCOPE,
        ],
      },
    );

    assert.equal(
      fake.state.sheetsOptions
        .version,
      "v4",
    );

    assert.equal(
      connection
        .getSpreadsheetId(),
      "fictional-sheet-id",
    );

    assert.equal(
      connection
        .getSheetsClient(),
      fake.fakeSheets,
    );
  },
);

test(
  "Google Sheets access verification performs a metadata-only workbook request",
  async () => {
    const fake =
      createFakeGoogle();

    const connection =
      createGoogleSheetsConnection({
        spreadsheetId:
          "fictional-sheet-id",
        serviceAccountFile:
          "C:\\protected\\development-service-account.json",
        googleApi:
          fake.googleApi,
      });

    assert.equal(
      await connection
        .verifyAccess(),
      true,
    );

    assert.deepEqual(
      fake.state.getRequest,
      {
        spreadsheetId:
          "fictional-sheet-id",
        fields:
          "spreadsheetId",
      },
    );
  },
);

test(
  "Google Sheets verification masks provider and credential details on failure",
  async () => {
    const fake =
      createFakeGoogle({
        failVerification: true,
      });

    const connection =
      createGoogleSheetsConnection({
        spreadsheetId:
          "private-sheet-id",
        serviceAccountFile:
          "C:\\private\\secret.json",
        googleApi:
          fake.googleApi,
      });

    await assert.rejects(
      () =>
        connection.verifyAccess(),
      (error) => {
        assert.equal(
          error.message,
          "Google Sheets authentication/access verification failed.",
        );

        assert.equal(
          error.message.includes(
            "private-sheet-id",
          ),
          false,
        );

        assert.equal(
          error.message.includes(
            "secret.json",
          ),
          false,
        );

        return true;
      },
    );
  },
);

test(
  "Google Sheets connection rejects missing backend configuration",
  () => {
    assert.throws(
      () =>
        createGoogleSheetsConnection({
          serviceAccountFile:
            "C:\\protected\\development-service-account.json",
          googleApi:
            createFakeGoogle()
              .googleApi,
        }),
      /GOOGLE_SPREADSHEET_ID/,
    );

    assert.throws(
      () =>
        createGoogleSheetsConnection({
          spreadsheetId:
            "fictional-sheet-id",
          googleApi:
            createFakeGoogle()
              .googleApi,
        }),
      /GOOGLE_SERVICE_ACCOUNT_FILE/,
    );
  },
);
