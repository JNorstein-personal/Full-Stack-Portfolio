const {
  assertRsvpStorageContract,
} = require("./storageContract");
const {
  GOOGLE_SHEETS_STORE_SCHEMA,
} = require("./googleSheetsStoreSchema");

function freezeClone(value) {
  if (value === null) {
    return null;
  }

  const clone = JSON.parse(
    JSON.stringify(value),
  );

  function deepFreeze(item) {
    if (
      item === null ||
      typeof item !== "object" ||
      Object.isFrozen(item)
    ) {
      return item;
    }

    for (
      const child of
      Object.values(item)
    ) {
      deepFreeze(child);
    }

    return Object.freeze(item);
  }

  return deepFreeze(clone);
}

function quoteSheetTitle(title) {
  return `'${String(title).replace(
    /'/g,
    "''",
  )}'`;
}

function parseJsonCell(
  value,
  context,
) {
  try {
    return JSON.parse(value);
  } catch {
    throw new Error(
      `Google Sheets RSVP store contains invalid JSON in ${context}.`,
    );
  }
}

function validateClient(
  sheets,
) {
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
      "Google Sheets RSVP store requires a valid Sheets values client.",
    );
  }
}

function createGoogleSheetsStore({
  sheets,
  spreadsheetId,
} = {}) {
  validateClient(sheets);

  if (
    typeof spreadsheetId !==
      "string" ||
    spreadsheetId.trim() === ""
  ) {
    throw new Error(
      "Google Sheets RSVP store requires a spreadsheet identifier.",
    );
  }

  async function readRows(
    section,
  ) {
    const response =
      await sheets.spreadsheets.values.get({
        spreadsheetId,
        range:
          `${quoteSheetTitle(
            section.title,
          )}!A2:Z`,
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

  async function appendRow(
    section,
    row,
  ) {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range:
        `${quoteSheetTitle(
          section.title,
        )}!A:Z`,
      valueInputOption: "RAW",
      insertDataOption:
        "INSERT_ROWS",
      requestBody: {
        values: [row],
      },
    });
  }

  async function upsertByFirstColumn(
    section,
    key,
    row,
  ) {
    const rows =
      await readRows(section);

    const index =
      rows.findIndex(
        (candidate) =>
          candidate[0] === key,
      );

    if (index < 0) {
      await appendRow(
        section,
        row,
      );
      return;
    }

    const rowNumber =
      index + 2;

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range:
        `${quoteSheetTitle(
          section.title,
        )}!A${rowNumber}:${String.fromCharCode(
          64 + section.headers.length,
        )}${rowNumber}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [row],
      },
    });
  }

  const store = {
    async findInvitationByCanonicalCode(
      canonicalCode,
    ) {
      const rows =
        await readRows(
          GOOGLE_SHEETS_STORE_SCHEMA
            .invitations,
        );

      const row =
        rows.find(
          (candidate) =>
            candidate[0] ===
            canonicalCode,
        );

      return row
        ? freezeClone(
            parseJsonCell(
              row[2],
              "Invitations",
            ),
          )
        : null;
    },

    async getCurrentRsvp(
      partyId,
    ) {
      const rows =
        await readRows(
          GOOGLE_SHEETS_STORE_SCHEMA
            .currentRsvps,
        );

      const row =
        rows.find(
          (candidate) =>
            candidate[0] ===
            partyId,
        );

      return row
        ? freezeClone(
            parseJsonCell(
              row[2],
              "Current RSVPs",
            ),
          )
        : null;
    },

    async replaceCurrentRsvp(
      partyId,
      currentRsvp,
    ) {
      await upsertByFirstColumn(
        GOOGLE_SHEETS_STORE_SCHEMA
          .currentRsvps,
        partyId,
        [
          partyId,
          currentRsvp.version ?? "",
          JSON.stringify(
            currentRsvp,
          ),
        ],
      );

      return freezeClone(
        currentRsvp,
      );
    },

    async appendRsvpVersion(
      partyId,
      versionRecord,
    ) {
      await appendRow(
        GOOGLE_SHEETS_STORE_SCHEMA
          .rsvpVersions,
        [
          partyId,
          versionRecord.version ?? "",
          versionRecord.action ?? "",
          versionRecord.recordedAt ?? "",
          JSON.stringify(
            versionRecord,
          ),
        ],
      );

      return freezeClone(
        versionRecord,
      );
    },

    async listRsvpVersions(
      partyId,
    ) {
      const rows =
        await readRows(
          GOOGLE_SHEETS_STORE_SCHEMA
            .rsvpVersions,
        );

      return freezeClone(
        rows
          .filter(
            (row) =>
              row[0] === partyId,
          )
          .map((row) =>
            parseJsonCell(
              row[4],
              "RSVP Versions",
            ),
          ),
      );
    },

    async getSubmissionRecord(
      submissionKey,
    ) {
      const rows =
        await readRows(
          GOOGLE_SHEETS_STORE_SCHEMA
            .submissionRecords,
        );

      const row =
        rows.find(
          (candidate) =>
            candidate[0] ===
            submissionKey,
        );

      return row
        ? freezeClone(
            parseJsonCell(
              row[2],
              "Submission Records",
            ),
          )
        : null;
    },

    async setSubmissionRecord(
      submissionKey,
      record,
    ) {
      await upsertByFirstColumn(
        GOOGLE_SHEETS_STORE_SCHEMA
          .submissionRecords,
        submissionKey,
        [
          submissionKey,
          record.fingerprint ?? "",
          JSON.stringify(record),
        ],
      );

      return freezeClone(record);
    },

    async appendDeliveryRecord(
      partyId,
      record,
    ) {
      await appendRow(
        GOOGLE_SHEETS_STORE_SCHEMA
          .deliveryRecords,
        [
          partyId,
          record.recordedAt ?? "",
          JSON.stringify(record),
        ],
      );

      return freezeClone(record);
    },

    async listDeliveryRecords(
      partyId,
    ) {
      const rows =
        await readRows(
          GOOGLE_SHEETS_STORE_SCHEMA
            .deliveryRecords,
        );

      return freezeClone(
        rows
          .filter(
            (row) =>
              row[0] === partyId,
          )
          .map((row) =>
            parseJsonCell(
              row[2],
              "Delivery Records",
            ),
          ),
      );
    },

    async appendResendRecord(
      partyId,
      record,
    ) {
      await appendRow(
        GOOGLE_SHEETS_STORE_SCHEMA
          .resendRecords,
        [
          partyId,
          record.recordedAt ?? "",
          JSON.stringify(record),
        ],
      );

      return freezeClone(record);
    },

    async listResendRecords(
      partyId,
    ) {
      const rows =
        await readRows(
          GOOGLE_SHEETS_STORE_SCHEMA
            .resendRecords,
        );

      return freezeClone(
        rows
          .filter(
            (row) =>
              row[0] === partyId,
          )
          .map((row) =>
            parseJsonCell(
              row[2],
              "Resend Records",
            ),
          ),
      );
    },
  };

  assertRsvpStorageContract(store);

  return Object.freeze(store);
}

module.exports = {
  createGoogleSheetsStore,
  quoteSheetTitle,
};
