const {
  createHash,
} = require("node:crypto");

const {
  normalizeInvitationCode,
} = require("./invitationCode");

const PRODUCTION_SOURCE_COLUMNS =
  Object.freeze({
    guestId: "Guest ID",
    firstNames: "First Name(s)",
    lastNames: "Last Name(s)",
    clarification:
      "Attendee Names Clarification",
    plus1: "Plus1",
    maximumAttendance:
      "Total Potential Attendees (Including Plus1 and Kids)",
    wordingMode:
      "I/We wording",
  });

const PRODUCTION_AUDIT_TARGETS =
  Object.freeze({
    activeInvitationCount: 57,
    uniqueCanonicalCodeCount: 57,
    singularCount: 35,
    pluralCount: 22,
    invitationsWithAllocations: 23,
    allocationCount: 26,
    multiAllocationInvitationCount: 2,
    combinedMaximumAttendance: 115,
  });

function cleanString(value) {
  if (
    value === undefined ||
    value === null
  ) {
    return "";
  }

  return String(value).trim();
}

function requireSourceValue(
  row,
  columnName,
  rowNumber,
) {
  const value =
    cleanString(row[columnName]);

  if (value === "") {
    throw new Error(
      `Production invitation source row ${rowNumber} is missing required field: ${columnName}`,
    );
  }

  return value;
}

function deriveStableId(
  namespace,
  canonicalCode,
  suffix = "",
) {
  return createHash("sha256")
    .update(
      `${namespace}:${canonicalCode}:${suffix}`,
    )
    .digest("hex")
    .slice(0, 16);
}

function derivePartyId(
  canonicalCode,
) {
  return (
    "party-" +
    deriveStableId(
      "party",
      canonicalCode,
    )
  );
}

function deriveAllocationId(
  canonicalCode,
  index,
) {
  return (
    "plus1-" +
    deriveStableId(
      "allocation",
      canonicalCode,
      String(index),
    )
  );
}

function parseWordingMode(
  value,
  rowNumber,
) {
  const normalized =
    cleanString(value)
      .toLowerCase();

  if (normalized === "i") {
    return "singular";
  }

  if (normalized === "we") {
    return "plural";
  }

  throw new Error(
    `Production invitation source row ${rowNumber} has unsupported I/We wording.`,
  );
}

function parseMaximumAttendance(
  value,
  rowNumber,
) {
  const normalized =
    typeof value === "number"
      ? value
      : Number(
          cleanString(value),
        );

  if (
    !Number.isInteger(
      normalized,
    ) ||
    normalized <= 0
  ) {
    throw new Error(
      `Production invitation source row ${rowNumber} has invalid maximum attendance.`,
    );
  }

  return normalized;
}

function derivePartyDisplayName(
  row,
  rowNumber,
) {
  const clarification =
    cleanString(
      row[
        PRODUCTION_SOURCE_COLUMNS
          .clarification
      ],
    );

  if (clarification !== "") {
    return clarification;
  }

  const firstNames =
    requireSourceValue(
      row,
      PRODUCTION_SOURCE_COLUMNS
        .firstNames,
      rowNumber,
    );

  const lastNames =
    requireSourceValue(
      row,
      PRODUCTION_SOURCE_COLUMNS
        .lastNames,
      rowNumber,
    );

  return `${firstNames} ${lastNames}`;
}

function derivePrimaryInviteeLabel(
  row,
  rowNumber,
) {
  const firstNames =
    requireSourceValue(
      row,
      PRODUCTION_SOURCE_COLUMNS
        .firstNames,
      rowNumber,
    );

  const lastNames =
    requireSourceValue(
      row,
      PRODUCTION_SOURCE_COLUMNS
        .lastNames,
      rowNumber,
    );

  if (
    /(?:&|\/|,|;|\band\b|\n)/i.test(
      firstNames,
    )
  ) {
    throw new Error(
      `Production invitation source row ${rowNumber} has an ambiguous primary invitee for an unparenthesized Plus1 allocation.`,
    );
  }

  return `${firstNames} ${lastNames}`;
}

function parsePlus1Entries(
  value,
  rowNumber,
) {
  const source =
    cleanString(value);

  if (source === "") {
    return [];
  }

  const occurrencePattern =
    /\bPlus1\b/gi;

  const occurrences = [];
  let occurrence;

  while (
    (occurrence =
      occurrencePattern.exec(
        source,
      )) !== null
  ) {
    occurrences.push({
      index:
        occurrence.index,
      tokenEnd:
        occurrencePattern
          .lastIndex,
    });
  }

  if (
    occurrences.length === 0
  ) {
    if (
      /\bplus\s+1\b|\bplus\s+one\b/i.test(
        source,
      )
    ) {
      throw new Error(
        `Production invitation source row ${rowNumber} has malformed or ambiguous Plus1 text.`,
      );
    }

    return [];
  }

  const entries = [];

  for (
    let index = 0;
    index <
    occurrences.length;
    index += 1
  ) {
    const current =
      occurrences[index];

    const segmentEnd =
      index + 1 <
      occurrences.length
        ? occurrences[index + 1]
            .index
        : source.length;

    const trailing =
      source
        .slice(
          current.tokenEnd,
          segmentEnd,
        )
        .trimStart();

    if (
      trailing.startsWith(
        "(",
      )
    ) {
      const closeIndex =
        trailing.indexOf(
          ")",
        );

      if (closeIndex < 0) {
        throw new Error(
          `Production invitation source row ${rowNumber} has malformed or ambiguous Plus1 text.`,
        );
      }

      const inside =
        trailing.slice(
          1,
          closeIndex,
        );

      if (
        inside.includes("(") ||
        inside.includes(")")
      ) {
        throw new Error(
          `Production invitation source row ${rowNumber} has malformed or ambiguous Plus1 text.`,
        );
      }

      const label =
        cleanString(inside);

      if (label === "") {
        throw new Error(
          `Production invitation source row ${rowNumber} has an empty Plus1 invitee label.`,
        );
      }

      entries.push(label);
      continue;
    }

    entries.push(null);
  }

  if (
    entries.length > 1 &&
    entries.some(
      (name) => name === null,
    )
  ) {
    throw new Error(
      `Production invitation source row ${rowNumber} requires a parenthesized invitee name for every Plus1 allocation when multiple allocations are present.`,
    );
  }

  return entries;
}

function buildAdditionalGuestAllocations({
  row,
  rowNumber,
  canonicalCode,
  maximumAttendance,
}) {
  const parsed =
    parsePlus1Entries(
      row[
        PRODUCTION_SOURCE_COLUMNS
          .plus1
      ],
      rowNumber,
    );

  if (
    parsed.length >=
    maximumAttendance
  ) {
    throw new Error(
      `Production invitation source row ${rowNumber} has an allocation count incompatible with maximum attendance.`,
    );
  }

  const primaryLabel =
    parsed.length === 1 &&
    parsed[0] === null
      ? derivePrimaryInviteeLabel(
          row,
          rowNumber,
        )
      : null;

  return parsed.map(
    (namedInvitee, index) => {
      const label =
        namedInvitee ||
        primaryLabel;

      if (
        typeof label !==
          "string" ||
        label.trim() === ""
      ) {
        throw new Error(
          `Production invitation source row ${rowNumber} has an ambiguous Plus1 invitee label.`,
        );
      }

      const prompt =
        `Will ${label.trim()} be accompanied by a +1?`;

      if (
        prompt.length > 200
      ) {
        throw new Error(
          `Production invitation source row ${rowNumber} has an overlong Plus1 prompt.`,
        );
      }

      return Object.freeze({
        id:
          deriveAllocationId(
            canonicalCode,
            index + 1,
          ),
        prompt,
      });
    },
  );
}

function transformProductionInvitationRow(
  row,
  {
    rowNumber = 1,
  } = {},
) {
  if (
    row === null ||
    typeof row !== "object" ||
    Array.isArray(row)
  ) {
    throw new Error(
      `Production invitation source row ${rowNumber} must be an object.`,
    );
  }

  const rawCode =
    requireSourceValue(
      row,
      PRODUCTION_SOURCE_COLUMNS
        .guestId,
      rowNumber,
    );

  const normalized =
    normalizeInvitationCode(
      rawCode,
    );

  if (!normalized) {
    throw new Error(
      `Production invitation source row ${rowNumber} has a malformed Guest ID.`,
    );
  }

  const partyDisplayName =
    derivePartyDisplayName(
      row,
      rowNumber,
    );

  const wordingMode =
    parseWordingMode(
      requireSourceValue(
        row,
        PRODUCTION_SOURCE_COLUMNS
          .wordingMode,
        rowNumber,
      ),
      rowNumber,
    );

  const maximumAttendance =
    parseMaximumAttendance(
      row[
        PRODUCTION_SOURCE_COLUMNS
          .maximumAttendance
      ],
      rowNumber,
    );

  const additionalGuestAllocations =
    buildAdditionalGuestAllocations({
      row,
      rowNumber,
      canonicalCode:
        normalized.canonicalCode,
      maximumAttendance,
    });

  return Object.freeze({
    inviteCode:
      normalized.canonicalCode,
    inviteCodeDisplay:
      normalized.displayCode,
    partyId:
      derivePartyId(
        normalized.canonicalCode,
      ),
    partyDisplayName,
    greeting:
      partyDisplayName,
    wordingMode,
    maximumAttendance,
    additionalGuestAllocations:
      Object.freeze(
        additionalGuestAllocations,
      ),
    active: true,
    environment: "production",
  });
}

function summarizeProductionConfigurations(
  configurations,
) {
  const canonicalCodes =
    new Set();

  let singularCount = 0;
  let pluralCount = 0;
  let invitationsWithAllocations =
    0;
  let allocationCount = 0;
  let multiAllocationInvitationCount =
    0;
  let combinedMaximumAttendance =
    0;

  for (
    const configuration of
    configurations
  ) {
    canonicalCodes.add(
      configuration.inviteCode,
    );

    if (
      configuration.wordingMode ===
      "singular"
    ) {
      singularCount += 1;
    }

    if (
      configuration.wordingMode ===
      "plural"
    ) {
      pluralCount += 1;
    }

    const allocations =
      configuration
        .additionalGuestAllocations
        .length;

    if (allocations > 0) {
      invitationsWithAllocations +=
        1;
    }

    if (allocations > 1) {
      multiAllocationInvitationCount +=
        1;
    }

    allocationCount +=
      allocations;

    combinedMaximumAttendance +=
      configuration
        .maximumAttendance;
  }

  return Object.freeze({
    activeInvitationCount:
      configurations.filter(
        (configuration) =>
          configuration.active ===
          true,
      ).length,
    uniqueCanonicalCodeCount:
      canonicalCodes.size,
    singularCount,
    pluralCount,
    invitationsWithAllocations,
    allocationCount,
    multiAllocationInvitationCount,
    combinedMaximumAttendance,
  });
}

function assertProductionAuditTargets(
  summary,
  targets =
    PRODUCTION_AUDIT_TARGETS,
) {
  for (
    const [
      key,
      expectedValue,
    ] of Object.entries(
      targets,
    )
  ) {
    if (
      summary[key] !==
      expectedValue
    ) {
      throw new Error(
        `Production invitation transformation audit failed for ${key}.`,
      );
    }
  }

  return true;
}

function transformProductionInvitationRows(
  rows,
  {
    auditTargets,
  } = {},
) {
  if (!Array.isArray(rows)) {
    throw new Error(
      "Production invitation source must be an array of row objects.",
    );
  }

  const invitationRows =
    rows
      .map(
        (row, index) => ({
          row,
          rowNumber:
            index + 2,
        }),
      )
      .filter(
        ({ row }) =>
          row !== null &&
          typeof row ===
            "object" &&
          !Array.isArray(row) &&
          cleanString(
            row[
              PRODUCTION_SOURCE_COLUMNS
                .guestId
            ],
          ) !== "",
      );

  if (
    invitationRows.length === 0
  ) {
    throw new Error(
      "Production invitation source contains no invitation rows with a Guest ID.",
    );
  }

  const configurations =
    invitationRows.map(
      ({
        row,
        rowNumber,
      }) =>
        transformProductionInvitationRow(
          row,
          {
            rowNumber,
          },
        ),
    );

  const codes = new Set();
  const partyIds = new Set();
  const allocationIds =
    new Set();

  for (
    let index = 0;
    index <
    configurations.length;
    index += 1
  ) {
    const configuration =
      configurations[index];

    const sourceRowNumber =
      invitationRows[index]
        .rowNumber;

    if (
      codes.has(
        configuration.inviteCode,
      )
    ) {
      throw new Error(
        `Production invitation source row ${sourceRowNumber} creates a canonical invitation-code collision.`,
      );
    }

    codes.add(
      configuration.inviteCode,
    );

    if (
      partyIds.has(
        configuration.partyId,
      )
    ) {
      throw new Error(
        `Production invitation source row ${sourceRowNumber} creates a party-identifier collision.`,
      );
    }

    partyIds.add(
      configuration.partyId,
    );

    for (
      const allocation of
      configuration
        .additionalGuestAllocations
    ) {
      if (
        allocationIds.has(
          allocation.id,
        )
      ) {
        throw new Error(
          `Production invitation source row ${sourceRowNumber} creates an allocation-identifier collision.`,
        );
      }

      allocationIds.add(
        allocation.id,
      );
    }
  }

  const summary =
    summarizeProductionConfigurations(
      configurations,
    );

  if (auditTargets) {
    assertProductionAuditTargets(
      summary,
      auditTargets,
    );
  }

  return Object.freeze({
    configurations:
      Object.freeze(
        configurations,
      ),
    summary,
  });
}

module.exports = {
  PRODUCTION_AUDIT_TARGETS,
  PRODUCTION_SOURCE_COLUMNS,
  assertProductionAuditTargets,
  deriveAllocationId,
  derivePartyId,
  parsePlus1Entries,
  summarizeProductionConfigurations,
  transformProductionInvitationRow,
  transformProductionInvitationRows,
};
