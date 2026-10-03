require("dotenv").config();

const { once } = require("node:events");

const {
  PRODUCTION_AUDIT_TARGETS,
  assertProductionAuditTargets,
  transformProductionInvitationRows,
} = require(
  "../src/rsvp/productionInvitationTransform"
);

const {
  loadProductionSourceFile,
} = require(
  "../src/rsvp/productionSourceFile"
);

const {
  normalizeInvitationCode,
} = require(
  "../src/rsvp/invitationCode"
);

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

function findPermanentTestInvitation(
  configurations,
) {
  const testInvitations =
    configurations.filter(
      (invitation) =>
        invitation &&
        invitation.recordRole ===
          "test" &&
        invitation
          .guestListEligible ===
          false,
    );

  if (
    testInvitations.length !== 1
  ) {
    throw new Error(
      "Production smoke requires exactly one permanent test invitation.",
    );
  }

  return testInvitations[0];
}

function assertSmokeUsesPermanentTest({
  invocation,
  permanentTestInvitation,
}) {
  const normalized =
    normalizeInvitationCode(
      invocation.inviteCode,
    );

  if (
    !normalized ||
    normalized.canonicalCode !==
      permanentTestInvitation
        .inviteCode
  ) {
    throw new Error(
      "Production smoke invitation code must identify the permanent Test Sample.",
    );
  }

  return normalized.canonicalCode;
}

function assertStoredTestInvitationMatches({
  storedInvitation,
  expectedInvitation,
}) {
  if (
    !storedInvitation ||
    storedInvitation.recordRole !==
      "test" ||
    storedInvitation
      .guestListEligible !==
      false ||
    storedInvitation.active !==
      true ||
    storedInvitation.environment !==
      "production" ||
    JSON.stringify(
      storedInvitation,
    ) !==
      JSON.stringify(
        expectedInvitation,
      )
  ) {
    throw new Error(
      "Production smoke permanent Test Sample does not match the authoritative production source.",
    );
  }

  return true;
}

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

  const rows =
    loadProductionSourceFile(
      process.env
        .RSVP_PRODUCTION_SOURCE_FILE,
    );

  const transformed =
    transformProductionInvitationRows(
      rows,
    );

  assertProductionAuditTargets(
    transformed.summary,
    PRODUCTION_AUDIT_TARGETS,
  );

  const permanentTestInvitation =
    findPermanentTestInvitation(
      transformed.configurations,
    );

  const smokeInviteCode =
    assertSmokeUsesPermanentTest({
      invocation,
      permanentTestInvitation,
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

  const storedTestInvitation =
    await store
      .findInvitationByCanonicalCode(
        permanentTestInvitation
          .inviteCode,
      );

  assertStoredTestInvitationMatches({
    storedInvitation:
      storedTestInvitation,
    expectedInvitation:
      permanentTestInvitation,
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
              smokeInviteCode,
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

    if (
      !payload.invitation ||
      payload.invitation
        .maximumAttendance !==
        permanentTestInvitation
          .maximumAttendance ||
      JSON.stringify(
        payload.invitation
          .namedInvitees,
      ) !==
        JSON.stringify(
          permanentTestInvitation
            .namedInvitees,
        ) ||
      JSON.stringify(
        payload.invitation
          .additionalGuestAllocations,
      ) !==
        JSON.stringify(
          permanentTestInvitation
            .additionalGuestAllocations,
        )
    ) {
      throw new Error(
        "Production smoke lookup did not return the permanent Test Sample configuration.",
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
    "Production RSVP permanent Test Sample loopback smoke: PASS",
  );
}

main().catch(() => {
  console.error(
    "Production RSVP permanent Test Sample loopback smoke: FAIL",
  );

  process.exitCode = 1;
});