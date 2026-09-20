require("dotenv").config();

const { once } = require("node:events");

const {
  loadEnvironment,
} = require(
  "../src/config/env"
);
const {
  createApp,
} = require(
  "../src/app"
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
const {
  verifyGoogleSheetsStoreSchema,
} = require(
  "../src/services/storage/googleSheetsStoreSetup"
);
const {
  assertOperationalSectionsUnchanged,
  readGoogleSheetsStoreSnapshot,
} = require(
  "../src/services/storage/productionActivation"
);
const {
  validateProductionSmokeInvocation,
} = require(
  "../src/services/productionRuntime"
);

async function main() {
  const environment =
    loadEnvironment();

  const invocation =
    validateProductionSmokeInvocation({
      environment,
      inviteCode:
        process.env
          .RSVP_PRODUCTION_SMOKE_INVITE_CODE,
      acknowledgement:
        process.env
          .RSVP_PRODUCTION_SMOKE_ACK,
    });

  const connection =
    createGoogleSheetsConnection({
      spreadsheetId:
        environment
          .GOOGLE_SPREADSHEET_ID,
    });

  await connection.verifyAccess();

  const sheets =
    connection.getSheetsClient();
  const spreadsheetId =
    connection.getSpreadsheetId();

  await verifyGoogleSheetsStoreSchema({
    sheets,
    spreadsheetId,
  });

  const before =
    await readGoogleSheetsStoreSnapshot({
      sheets,
      spreadsheetId,
    });

  const store =
    createGoogleSheetsStore({
      sheets,
      spreadsheetId,
    });

  const emailTransport =
    createConfiguredEmailTransport({
      environment,
    });

  const app =
    createApp({
      environment,
      rsvpStore: store,
      emailTransport,
    });

  const server =
    app.listen(
      0,
      "127.0.0.1",
    );

  await once(
    server,
    "listening",
  );

  try {
    const address =
      server.address();
    const baseUrl =
      `http://127.0.0.1:${address.port}`;

    const health =
      await fetch(
        `${baseUrl}/wedding/api/health`,
      );

    if (
      health.status !== 200
    ) {
      throw new Error(
        "Production smoke health check failed.",
      );
    }

    const healthPayload =
      await health.json();

    if (
      healthPayload.status !==
        "ok"
    ) {
      throw new Error(
        "Production smoke health payload failed.",
      );
    }

    const lookup =
      await fetch(
        `${baseUrl}/wedding/api/rsvp/lookup`,
        {
          method: "POST",
          headers: {
            "content-type":
              "application/json",
            origin:
              environment
                .ALLOWED_ORIGIN,
          },
          body: JSON.stringify({
            inviteCode:
              invocation
                .inviteCode,
          }),
        },
      );

    if (
      lookup.status !== 200 ||
      lookup.headers.get(
        "cache-control",
      ) !==
        "no-store, max-age=0"
    ) {
      throw new Error(
        "Production smoke invitation lookup failed.",
      );
    }

    const payload =
      await lookup.json();

    if (
      !payload ||
      JSON.stringify(
        Object.keys(payload),
      ) !==
        JSON.stringify([
          "invitation",
          "questions",
          "confirmationOptions",
        ])
    ) {
      throw new Error(
        "Production smoke lookup boundary failed.",
      );
    }
  } finally {
    await new Promise(
      (resolve) =>
        server.close(
          () => resolve(),
        ),
    );
  }

  const after =
    await readGoogleSheetsStoreSnapshot({
      sheets,
      spreadsheetId,
    });

  assertOperationalSectionsUnchanged(
    before,
    after,
  );

  console.log(
    "Production RSVP loopback smoke: PASS",
  );
}

main().catch(() => {
  console.error(
    "Production RSVP loopback smoke: FAIL",
  );
  process.exitCode = 1;
});
