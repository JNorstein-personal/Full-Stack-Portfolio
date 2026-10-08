const {
  createHash,
} = require("node:crypto");

const {
  normalizeInvitationCode,
} = require("./invitationCode");

const GROUPED_CHILD_PROMPT =
  "We'd love for your family to celebrate with us this Mayday - will your kid(s) be accompanying you?";

const BASELINE_INVITE_NUMBER_MAX = 57;
const RESERVED_INVITE_NUMBER_MIN = 58;
const RESERVED_INVITE_NUMBER_MAX = 67;
const PERMANENT_TEST_INVITE_NUMBER = 68;
const EXPECTED_NUMBERED_SOURCE_ROW_COUNT = 68;

const PRODUCTION_SOURCE_COLUMNS =
  Object.freeze({
    inviteNumber:
      "Invite #",
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

/*
 * These targets intentionally distinguish the stable 1-57 baseline from
 * the expandable 58-67 reserve. Filling a reserved row with a complete
 * invitation therefore increases the guest-list-eligible totals without
 * requiring these targets to be rewritten.
 */
const PRODUCTION_AUDIT_TARGETS =
  Object.freeze({
    numberedSourceRowCount:
      EXPECTED_NUMBERED_SOURCE_ROW_COUNT,
    uniqueSourceCodeCount:
      EXPECTED_NUMBERED_SOURCE_ROW_COUNT,
    sourceInviteNumberSequenceValid:
      true,

    baselineInvitationCount: 57,
    baselineUniqueCanonicalCodeCount:
      57,
    baselineSingularCount: 35,
    baselinePluralCount: 22,
    baselineNamedInviteeCount: 84,
    baselineInvitationsWithAllocations:
      23,
    baselineAllocationCount: 28,
    baselinePlus1AllocationCount: 26,
    baselineGroupedChildAllocationCount:
      2,
    baselineAdditionalGuestCapacity: 31,
    baselineGroupedChildCapacity: 5,
    baselineMultiAllocationInvitationCount:
      4,
    baselineCombinedMaximumAttendance:
      115,

    testInvitationCount: 1,
    testNamedInviteeCount: 1,
    testPlus1AllocationCount: 1,
    testCombinedMaximumAttendance: 4,
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

function deriveInviteeId(
  canonicalCode,
  index,
) {
  return (
    "invitee-" +
    deriveStableId(
      "invitee",
      canonicalCode,
      String(index),
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

function deriveChildrenAllocationId(
  canonicalCode,
) {
  return (
    "children-" +
    deriveStableId(
      "unnamed-children",
      canonicalCode,
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

function splitNamedSourceList(
  value,
  columnName,
  rowNumber,
) {
  const source =
    requireSourceValue(
      {
        [columnName]: value,
      },
      columnName,
      rowNumber,
    );

  const entries =
    source
      .split(",")
      .map((entry) =>
        cleanString(entry));

  if (
    entries.length === 0 ||
    entries.some(
      (entry) => entry === "",
    )
  ) {
    throw new Error(
      `Production invitation source row ${rowNumber} has malformed named-invitee data in ${columnName}.`,
    );
  }

  return entries;
}

function buildNamedInvitees({
  row,
  rowNumber,
  canonicalCode,
}) {
  const firstNames =
    splitNamedSourceList(
      row[
        PRODUCTION_SOURCE_COLUMNS
          .firstNames
      ],
      PRODUCTION_SOURCE_COLUMNS
        .firstNames,
      rowNumber,
    );

  const lastNames =
    splitNamedSourceList(
      row[
        PRODUCTION_SOURCE_COLUMNS
          .lastNames
      ],
      PRODUCTION_SOURCE_COLUMNS
        .lastNames,
      rowNumber,
    );

  if (
    firstNames.length !==
    lastNames.length
  ) {
    throw new Error(
      `Production invitation source row ${rowNumber} has mismatched named-invitee first-name and last-name counts.`,
    );
  }

  return firstNames.map(
    (firstName, index) => {
      const displayName =
        `${firstName} ${lastNames[index]}`
          .trim();

      if (
        displayName.length === 0 ||
        displayName.length > 200
      ) {
        throw new Error(
          `Production invitation source row ${rowNumber} has an invalid named-invitee display name.`,
        );
      }

      return Object.freeze({
        id:
          deriveInviteeId(
            canonicalCode,
            index + 1,
          ),
        displayName,
      });
    },
  );
}

function derivePrimaryInviteeLabel(
  namedInvitees,
  rowNumber,
) {
  if (
    !Array.isArray(
      namedInvitees,
    ) ||
    namedInvitees.length !== 1
  ) {
    throw new Error(
      `Production invitation source row ${rowNumber} has an ambiguous primary invitee for an unparenthesized Plus1 allocation.`,
    );
  }

  return namedInvitees[0]
    .displayName;
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

function parseUnnamedChildrenCount(
  value,
  rowNumber,
) {
  const source =
    cleanString(value);

  if (source === "") {
    return 0;
  }

  const pattern =
    /\bKids\s*\(\s*(\d+)\s*\)/gi;

  const matches = [];
  let match;

  while (
    (match =
      pattern.exec(
        source,
      )) !== null
  ) {
    matches.push(match[1]);
  }

  if (matches.length > 1) {
    throw new Error(
      `Production invitation source row ${rowNumber} contains more than one Kids(n) allocation.`,
    );
  }

  if (matches.length === 0) {
    if (/\bkids\b/i.test(source)) {
      throw new Error(
        `Production invitation source row ${rowNumber} has malformed or ambiguous Kids(n) text.`,
      );
    }

    return 0;
  }

  const count =
    Number(matches[0]);

  if (
    !Number.isInteger(count) ||
    count <= 0
  ) {
    throw new Error(
      `Production invitation source row ${rowNumber} has invalid Kids(n) capacity.`,
    );
  }

  return count;
}

function buildAdditionalGuestAllocations({
  row,
  rowNumber,
  canonicalCode,
  namedInvitees,
}) {
  const sourceValue =
    row[
      PRODUCTION_SOURCE_COLUMNS
        .plus1
    ];

  const plus1Entries =
    parsePlus1Entries(
      sourceValue,
      rowNumber,
    );

  const unnamedChildrenCount =
    parseUnnamedChildrenCount(
      sourceValue,
      rowNumber,
    );

  const primaryLabel =
    plus1Entries.length === 1 &&
    plus1Entries[0] === null
      ? derivePrimaryInviteeLabel(
          namedInvitees,
          rowNumber,
        )
      : null;

  const allocations =
    plus1Entries.map(
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

        if (prompt.length > 200) {
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
          kind: "plus1",
          prompt,
          maximumCount: 1,
        });
      },
    );

  if (unnamedChildrenCount > 0) {
    allocations.push(
      Object.freeze({
        id:
          deriveChildrenAllocationId(
            canonicalCode,
          ),
        kind:
          "unnamedChildren",
        prompt:
          GROUPED_CHILD_PROMPT,
        maximumCount:
          unnamedChildrenCount,
      }),
    );
  }

  return allocations;
}

function sumAllocationCapacity(
  allocations,
) {
  return allocations.reduce(
    (
      total,
      allocation,
    ) =>
      total +
      allocation.maximumCount,
    0,
  );
}

function normalizeRecordRole(
  recordRole,
  rowNumber,
) {
  if (
    recordRole !== "assigned" &&
    recordRole !== "test"
  ) {
    throw new Error(
      `Production invitation source row ${rowNumber} has an unsupported record role.`,
    );
  }

  return recordRole;
}

function transformProductionInvitationRow(
  row,
  {
    rowNumber = 1,
    recordRole = "assigned",
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

  const normalizedRecordRole =
    normalizeRecordRole(
      recordRole,
      rowNumber,
    );

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

  const namedInvitees =
    buildNamedInvitees({
      row,
      rowNumber,
      canonicalCode:
        normalized.canonicalCode,
    });

  const additionalGuestAllocations =
    buildAdditionalGuestAllocations({
      row,
      rowNumber,
      canonicalCode:
        normalized.canonicalCode,
      namedInvitees,
    });

  const configuredCapacity =
    namedInvitees.length +
    sumAllocationCapacity(
      additionalGuestAllocations,
    );

  if (
    configuredCapacity !==
    maximumAttendance
  ) {
    throw new Error(
      `Production invitation source row ${rowNumber} has named-invitee and additional-guest capacity incompatible with maximum attendance.`,
    );
  }

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
    namedInvitees:
      Object.freeze(
        namedInvitees,
      ),
    additionalGuestAllocations:
      Object.freeze(
        additionalGuestAllocations,
      ),
    recordRole:
      normalizedRecordRole,
    guestListEligible:
      normalizedRecordRole ===
      "assigned",
    active: true,
    environment: "production",
  });
}

function isReservedPlaceholderSourceRow(
  row,
  inviteNumber,
  rowNumber,
) {
  if (
    inviteNumber <
      RESERVED_INVITE_NUMBER_MIN ||
    inviteNumber >
      RESERVED_INVITE_NUMBER_MAX
  ) {
    return false;
  }

  const firstNames =
    cleanString(
      row[
        PRODUCTION_SOURCE_COLUMNS
          .firstNames
      ],
    );
  const lastNames =
    cleanString(
      row[
        PRODUCTION_SOURCE_COLUMNS
          .lastNames
      ],
    );

  const hasPlaceholderMarker =
    firstNames === "?" ||
    lastNames === "?";

  if (!hasPlaceholderMarker) {
    return false;
  }

  if (
    firstNames !== "?" ||
    lastNames !== "?"
  ) {
    throw new Error(
      `Production invitation source row ${rowNumber} has a partially populated reserved placeholder.`,
    );
  }

  const fieldsThatMustRemainBlank = [
    PRODUCTION_SOURCE_COLUMNS
      .clarification,
    PRODUCTION_SOURCE_COLUMNS.plus1,
    PRODUCTION_SOURCE_COLUMNS
      .maximumAttendance,
    PRODUCTION_SOURCE_COLUMNS
      .wordingMode,
  ];

  if (
    fieldsThatMustRemainBlank.some(
      (columnName) =>
        cleanString(
          row[columnName],
        ) !== "",
    )
  ) {
    throw new Error(
      `Production invitation source row ${rowNumber} has a partially populated reserved placeholder.`,
    );
  }

  return true;
}

function summarizeConfigurationSet(
  configurations,
) {
  const canonicalCodes =
    new Set();

  let activeInvitationCount = 0;
  let singularCount = 0;
  let pluralCount = 0;
  let namedInviteeCount = 0;
  let invitationsWithAllocations =
    0;
  let allocationCount = 0;
  let plus1AllocationCount = 0;
  let groupedChildAllocationCount =
    0;
  let additionalGuestCapacity = 0;
  let groupedChildCapacity = 0;
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

    if (configuration.active === true) {
      activeInvitationCount += 1;
    }

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

    namedInviteeCount +=
      configuration
        .namedInvitees.length;

    const allocations =
      configuration
        .additionalGuestAllocations;

    if (allocations.length > 0) {
      invitationsWithAllocations +=
        1;
    }

    if (allocations.length > 1) {
      multiAllocationInvitationCount +=
        1;
    }

    allocationCount +=
      allocations.length;

    for (
      const allocation of
      allocations
    ) {
      additionalGuestCapacity +=
        allocation.maximumCount;

      if (
        allocation.kind ===
        "plus1"
      ) {
        plus1AllocationCount += 1;
      }

      if (
        allocation.kind ===
        "unnamedChildren"
      ) {
        groupedChildAllocationCount +=
          1;
        groupedChildCapacity +=
          allocation.maximumCount;
      }
    }

    combinedMaximumAttendance +=
      configuration
        .maximumAttendance;
  }

  return Object.freeze({
    activeInvitationCount,
    uniqueCanonicalCodeCount:
      canonicalCodes.size,
    singularCount,
    pluralCount,
    namedInviteeCount,
    invitationsWithAllocations,
    allocationCount,
    plus1AllocationCount,
    groupedChildAllocationCount,
    additionalGuestCapacity,
    groupedChildCapacity,
    multiAllocationInvitationCount,
    combinedMaximumAttendance,
  });
}

function summarizeProductionConfigurations(
  configurations,
  {
    numberedSourceRowCount =
      configurations.length,
    uniqueSourceCodeCount =
      configurations.length,
    reservedPlaceholderCount = 0,
    sourceInviteNumberSequenceValid =
      false,
    baselineConfigurations =
      null,
  } = {},
) {
  const functional =
    summarizeConfigurationSet(
      configurations,
    );

  const guestListConfigurations =
    configurations.filter(
      (configuration) =>
        configuration
          .guestListEligible !== false,
    );

  const testConfigurations =
    configurations.filter(
      (configuration) =>
        configuration.recordRole ===
          "test" ||
        configuration
          .guestListEligible === false,
    );

  const guestList =
    summarizeConfigurationSet(
      guestListConfigurations,
    );

  const test =
    summarizeConfigurationSet(
      testConfigurations,
    );

  const baseline =
    summarizeConfigurationSet(
      Array.isArray(
        baselineConfigurations,
      )
        ? baselineConfigurations
        : guestListConfigurations,
    );

  return Object.freeze({
    numberedSourceRowCount,
    uniqueSourceCodeCount,
    reservedPlaceholderCount,
    sourceInviteNumberSequenceValid,

    functionalInvitationCount:
      functional.activeInvitationCount,
    functionalUniqueCanonicalCodeCount:
      functional
        .uniqueCanonicalCodeCount,
    functionalCombinedMaximumAttendance:
      functional
        .combinedMaximumAttendance,

    guestListInvitationCount:
      guestList.activeInvitationCount,
    testInvitationCount:
      test.activeInvitationCount,

    /*
     * Backward-compatible aggregate names now deliberately mean
     * guest-list-eligible production invitations. This prevents the
     * permanent Test Sample identity from affecting wedding counts.
     */
    activeInvitationCount:
      guestList.activeInvitationCount,
    uniqueCanonicalCodeCount:
      guestList
        .uniqueCanonicalCodeCount,
    singularCount:
      guestList.singularCount,
    pluralCount:
      guestList.pluralCount,
    namedInviteeCount:
      guestList.namedInviteeCount,
    invitationsWithAllocations:
      guestList
        .invitationsWithAllocations,
    allocationCount:
      guestList.allocationCount,
    plus1AllocationCount:
      guestList.plus1AllocationCount,
    groupedChildAllocationCount:
      guestList
        .groupedChildAllocationCount,
    additionalGuestCapacity:
      guestList
        .additionalGuestCapacity,
    groupedChildCapacity:
      guestList.groupedChildCapacity,
    multiAllocationInvitationCount:
      guestList
        .multiAllocationInvitationCount,
    combinedMaximumAttendance:
      guestList
        .combinedMaximumAttendance,

    testNamedInviteeCount:
      test.namedInviteeCount,
    testPlus1AllocationCount:
      test.plus1AllocationCount,
    testCombinedMaximumAttendance:
      test.combinedMaximumAttendance,

    baselineInvitationCount:
      baseline.activeInvitationCount,
    baselineUniqueCanonicalCodeCount:
      baseline
        .uniqueCanonicalCodeCount,
    baselineSingularCount:
      baseline.singularCount,
    baselinePluralCount:
      baseline.pluralCount,
    baselineNamedInviteeCount:
      baseline.namedInviteeCount,
    baselineInvitationsWithAllocations:
      baseline
        .invitationsWithAllocations,
    baselineAllocationCount:
      baseline.allocationCount,
    baselinePlus1AllocationCount:
      baseline.plus1AllocationCount,
    baselineGroupedChildAllocationCount:
      baseline
        .groupedChildAllocationCount,
    baselineAdditionalGuestCapacity:
      baseline
        .additionalGuestCapacity,
    baselineGroupedChildCapacity:
      baseline.groupedChildCapacity,
    baselineMultiAllocationInvitationCount:
      baseline
        .multiAllocationInvitationCount,
    baselineCombinedMaximumAttendance:
      baseline
        .combinedMaximumAttendance,
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

  if (
    summary.functionalInvitationCount !==
    summary.guestListInvitationCount +
      summary.testInvitationCount
  ) {
    throw new Error(
      "Production invitation transformation audit failed for functional invitation classification.",
    );
  }

  if (
    summary.numberedSourceRowCount !==
    summary.functionalInvitationCount +
      summary.reservedPlaceholderCount
  ) {
    throw new Error(
      "Production invitation transformation audit failed for numbered source-row classification.",
    );
  }

  if (
    summary.combinedMaximumAttendance <
    summary.baselineCombinedMaximumAttendance
  ) {
    throw new Error(
      "Production invitation transformation audit failed for guest-list-eligible capacity.",
    );
  }

  return true;
}

function hasExpectedInviteNumberSequence(
  inviteNumbers,
) {
  if (
    inviteNumbers.size !==
    EXPECTED_NUMBERED_SOURCE_ROW_COUNT
  ) {
    return false;
  }

  for (
    let inviteNumber = 1;
    inviteNumber <=
      EXPECTED_NUMBERED_SOURCE_ROW_COUNT;
    inviteNumber += 1
  ) {
    if (
      !inviteNumbers.has(
        String(inviteNumber),
      )
    ) {
      return false;
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

  const sourceRows =
    rows.map(
      (row, index) => ({
        row,
        rowNumber:
          index + 2,
      }),
    );

  const hasInviteNumberColumn =
    sourceRows.some(
      ({ row }) =>
        row !== null &&
        typeof row ===
          "object" &&
        !Array.isArray(row) &&
        Object.prototype
          .hasOwnProperty.call(
            row,
            PRODUCTION_SOURCE_COLUMNS
              .inviteNumber,
          ),
    );

  const invitationRows =
    sourceRows.filter(
      ({ row }) => {
        if (
          row === null ||
          typeof row !==
            "object" ||
          Array.isArray(row)
        ) {
          return false;
        }

        if (
          hasInviteNumberColumn
        ) {
          const inviteNumber =
            cleanString(
              row[
                PRODUCTION_SOURCE_COLUMNS
                  .inviteNumber
              ],
            );

          return /^\d+$/.test(
            inviteNumber,
          );
        }

        return (
          cleanString(
            row[
              PRODUCTION_SOURCE_COLUMNS
                .guestId
            ],
          ) !== ""
        );
      },
    );

  if (
    invitationRows.length === 0
  ) {
    throw new Error(
      "Production invitation source contains no invitation rows with a Guest ID.",
    );
  }

  const sourceCodes = new Set();
  const inviteNumbers = new Set();
  const configurationRecords = [];
  let reservedPlaceholderCount = 0;

  for (
    const {
      row,
      rowNumber,
    } of invitationRows
  ) {
    const rawCode =
      requireSourceValue(
        row,
        PRODUCTION_SOURCE_COLUMNS
          .guestId,
        rowNumber,
      );

    const normalizedCode =
      normalizeInvitationCode(
        rawCode,
      );

    if (!normalizedCode) {
      throw new Error(
        `Production invitation source row ${rowNumber} has a malformed Guest ID.`,
      );
    }

    if (
      sourceCodes.has(
        normalizedCode.canonicalCode,
      )
    ) {
      throw new Error(
        `Production invitation source row ${rowNumber} creates a canonical invitation-code collision.`,
      );
    }

    sourceCodes.add(
      normalizedCode.canonicalCode,
    );

    let inviteNumber = null;

    if (hasInviteNumberColumn) {
      const inviteNumberText =
        cleanString(
          row[
            PRODUCTION_SOURCE_COLUMNS
              .inviteNumber
          ],
        );

      if (
        inviteNumbers.has(
          inviteNumberText,
        )
      ) {
        throw new Error(
          `Production invitation source row ${rowNumber} duplicates an invitation number.`,
        );
      }

      inviteNumbers.add(
        inviteNumberText,
      );
      inviteNumber =
        Number(inviteNumberText);
    }

    if (
      inviteNumber !== null &&
      isReservedPlaceholderSourceRow(
        row,
        inviteNumber,
        rowNumber,
      )
    ) {
      reservedPlaceholderCount += 1;
      continue;
    }

    const recordRole =
      inviteNumber ===
      PERMANENT_TEST_INVITE_NUMBER
        ? "test"
        : "assigned";

    const configuration =
      transformProductionInvitationRow(
        row,
        {
          rowNumber,
          recordRole,
        },
      );

    configurationRecords.push({
      inviteNumber,
      rowNumber,
      configuration,
    });
  }

  const configurations =
    configurationRecords.map(
      ({ configuration }) =>
        configuration,
    );

  const partyIds = new Set();
  const configurationIds =
    new Set();

  for (
    const {
      configuration,
      rowNumber,
    } of configurationRecords
  ) {
    if (
      partyIds.has(
        configuration.partyId,
      )
    ) {
      throw new Error(
        `Production invitation source row ${rowNumber} creates a party-identifier collision.`,
      );
    }

    partyIds.add(
      configuration.partyId,
    );

    for (
      const invitee of
      configuration.namedInvitees
    ) {
      if (
        configurationIds.has(
          invitee.id,
        )
      ) {
        throw new Error(
          `Production invitation source row ${rowNumber} creates an invitee/allocation identifier collision.`,
        );
      }

      configurationIds.add(
        invitee.id,
      );
    }

    for (
      const allocation of
      configuration
        .additionalGuestAllocations
    ) {
      if (
        configurationIds.has(
          allocation.id,
        )
      ) {
        throw new Error(
          `Production invitation source row ${rowNumber} creates an invitee/allocation identifier collision.`,
        );
      }

      configurationIds.add(
        allocation.id,
      );
    }
  }

  const baselineConfigurations =
    configurationRecords
      .filter(
        ({ inviteNumber }) =>
          inviteNumber !== null &&
          inviteNumber >= 1 &&
          inviteNumber <=
            BASELINE_INVITE_NUMBER_MAX,
      )
      .map(
        ({ configuration }) =>
          configuration,
      );

  const summary =
    summarizeProductionConfigurations(
      configurations,
      {
        numberedSourceRowCount:
          hasInviteNumberColumn
            ? invitationRows.length
            : 0,
        uniqueSourceCodeCount:
          sourceCodes.size,
        reservedPlaceholderCount,
        sourceInviteNumberSequenceValid:
          hasInviteNumberColumn
            ? hasExpectedInviteNumberSequence(
                inviteNumbers,
              )
            : false,
        baselineConfigurations:
          hasInviteNumberColumn
            ? baselineConfigurations
            : null,
      },
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
  BASELINE_INVITE_NUMBER_MAX,
  EXPECTED_NUMBERED_SOURCE_ROW_COUNT,
  GROUPED_CHILD_PROMPT,
  PERMANENT_TEST_INVITE_NUMBER,
  PRODUCTION_AUDIT_TARGETS,
  PRODUCTION_SOURCE_COLUMNS,
  RESERVED_INVITE_NUMBER_MAX,
  RESERVED_INVITE_NUMBER_MIN,
  assertProductionAuditTargets,
  buildNamedInvitees,
  deriveAllocationId,
  deriveChildrenAllocationId,
  deriveInviteeId,
  derivePartyId,
  isReservedPlaceholderSourceRow,
  parsePlus1Entries,
  parseUnnamedChildrenCount,
  summarizeProductionConfigurations,
  transformProductionInvitationRow,
  transformProductionInvitationRows,
};