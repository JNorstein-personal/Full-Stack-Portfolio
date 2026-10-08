const test = require("node:test");
const assert = require("node:assert/strict");

const {
  BASELINE_INVITE_NUMBER_MAX,
  EXPECTED_NUMBERED_SOURCE_ROW_COUNT,
  GROUPED_CHILD_PROMPT,
  PERMANENT_TEST_INVITE_NUMBER,
  PRODUCTION_AUDIT_TARGETS,
  RESERVED_INVITE_NUMBER_MAX,
  RESERVED_INVITE_NUMBER_MIN,
  assertProductionAuditTargets,
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
} = require("../src/rsvp/productionInvitationTransform");

function makeRow(
  overrides = {},
) {
  return {
    "Invite #": "1",
    "Guest ID": "ABC123",
    "First Name(s)": "Example",
    "Last Name(s)": "Guest",
    "Attendee Names Clarification": "",
    Plus1: "",
    "Total Potential Attendees (Including Plus1 and Kids)": 1,
    "I/We wording": "I",
    ...overrides,
  };
}

function makeReservedRow(
  inviteNumber,
  overrides = {},
) {
  return makeRow({
    "Invite #": String(inviteNumber),
    "Guest ID":
      `R${String(inviteNumber).padStart(
        5,
        "0",
      )}`,
    "First Name(s)": "?",
    "Last Name(s)": "?",
    "Attendee Names Clarification": "",
    Plus1: "",
    "Total Potential Attendees (Including Plus1 and Kids)": "",
    "I/We wording": "",
    ...overrides,
  });
}

function makeTestRow(
  overrides = {},
) {
  return makeRow({
    "Invite #":
      String(
        PERMANENT_TEST_INVITE_NUMBER,
      ),
    "Guest ID": "TST068",
    "First Name(s)": "Test",
    "Last Name(s)": "Sample",
    Plus1: "Plus1, kids(2)",
    "Total Potential Attendees (Including Plus1 and Kids)": 4,
    "I/We wording": "I",
    ...overrides,
  });
}

function namedSource(
  index,
  count,
) {
  const firstNames =
    Array.from(
      {
        length: count,
      },
      (_, offset) =>
        `Guest${index}${String.fromCharCode(
          65 + offset,
        )}`,
    );

  const lastNames =
    Array.from(
      {
        length: count,
      },
      () => "Example",
    );

  return {
    firstNames:
      firstNames.join(", "),
    lastNames:
      lastNames.join(", "),
    displayNames:
      firstNames.map(
        (firstName) =>
          `${firstName} Example`,
      ),
  };
}

function makeBaselineRows() {
  const rows = [];

  for (
    let index = 1;
    index <=
      BASELINE_INVITE_NUMBER_MAX;
    index += 1
  ) {
    const code =
      `P${String(index).padStart(
        5,
        "0",
      )}`;

    let namedCount = 1;

    if (index === 2) {
      namedCount = 4;
    } else if (
      index === 4 ||
      (
        index >= 5 &&
        index <= 27
      )
    ) {
      namedCount = 2;
    }

    const names =
      namedSource(
        index,
        namedCount,
      );

    let plus1 = "";
    let plus1Count = 0;
    let childCapacity = 0;

    if (index === 1) {
      plus1 =
        "Plus1, Kids(3)";
      plus1Count = 1;
      childCapacity = 3;
    } else if (
      index === 2
    ) {
      plus1 =
        `Plus1 (${names.displayNames[0]}), Plus1 (${names.displayNames[1]}), Plus1 (${names.displayNames[2]})`;
      plus1Count = 3;
    } else if (
      index === 3
    ) {
      plus1 =
        "Plus1, kids(2)";
      plus1Count = 1;
      childCapacity = 2;
    } else if (
      index === 4
    ) {
      plus1 =
        `Plus1 (${names.displayNames[0]}), Plus1 (${names.displayNames[1]})`;
      plus1Count = 2;
    } else if (
      index <= 23
    ) {
      plus1 =
        `Plus1 (${names.displayNames[0]})`;
      plus1Count = 1;
    }

    rows.push(
      makeRow({
        "Invite #":
          String(index),
        "Guest ID": code,
        "First Name(s)":
          names.firstNames,
        "Last Name(s)":
          names.lastNames,
        Plus1: plus1,
        "Total Potential Attendees (Including Plus1 and Kids)":
          namedCount +
          plus1Count +
          childCapacity,
        "I/We wording":
          index <= 35
            ? "I"
            : "we",
      }),
    );
  }

  return rows;
}

function makeAuthoritativeShapeRows({
  populateReservedInvite = null,
} = {}) {
  const rows =
    makeBaselineRows();

  for (
    let inviteNumber =
      RESERVED_INVITE_NUMBER_MIN;
    inviteNumber <=
      RESERVED_INVITE_NUMBER_MAX;
    inviteNumber += 1
  ) {
    if (
      inviteNumber ===
      populateReservedInvite
    ) {
      rows.push(
        makeRow({
          "Invite #":
            String(inviteNumber),
          "Guest ID":
            `P${String(
              inviteNumber,
            ).padStart(
              5,
              "0",
            )}`,
          "First Name(s)":
            "Future",
          "Last Name(s)":
            "Guest",
          "Attendee Names Clarification":
            "",
          Plus1: "",
          "Total Potential Attendees (Including Plus1 and Kids)":
            1,
          "I/We wording":
            "I",
        }),
      );
      continue;
    }

    rows.push(
      makeReservedRow(
        inviteNumber,
        {
          "Guest ID":
            `P${String(
              inviteNumber,
            ).padStart(
              5,
              "0",
            )}`,
        },
      ),
    );
  }

  rows.push(
    makeTestRow({
      "Guest ID": "P00068",
    }),
  );

  rows.push({
    "Invite #": "Notes",
    "Guest ID":
      "Bottom-row note text",
    "I/We wording":
      "Note: display wording guidance",
  });

  return rows;
}

function assertTargetSubset(
  summary,
) {
  for (
    const [
      key,
      expectedValue,
    ] of Object.entries(
      PRODUCTION_AUDIT_TARGETS,
    )
  ) {
    assert.equal(
      summary[key],
      expectedValue,
      key,
    );
  }
}

test(
  "production row transformation uses clarification, canonical code, explicit wording, named invitees, and assigned production classification",
  () => {
    const transformed =
      transformProductionInvitationRow(
        makeRow({
          "Guest ID":
            " abc-123 ",
          "Attendee Names Clarification":
            "The Reviewed Example Party",
          "I/We wording":
            "we",
        }),
        {
          rowNumber: 2,
        },
      );

    assert.deepEqual(
      transformed,
      {
        inviteCode: "ABC123",
        inviteCodeDisplay:
          "ABC-123",
        partyId:
          derivePartyId(
            "ABC123",
          ),
        partyDisplayName:
          "The Reviewed Example Party",
        greeting:
          "The Reviewed Example Party",
        wordingMode: "plural",
        maximumAttendance: 1,
        namedInvitees: [
          {
            id:
              deriveInviteeId(
                "ABC123",
                1,
              ),
            displayName:
              "Example Guest",
          },
        ],
        additionalGuestAllocations:
          [],
        recordRole: "assigned",
        guestListEligible: true,
        active: true,
        environment: "production",
      },
    );

    assert.equal(
      Object.isFrozen(
        transformed,
      ),
      true,
    );

    assert.equal(
      Object.isFrozen(
        transformed.namedInvitees,
      ),
      true,
    );

    assert.equal(
      Object.isFrozen(
        transformed.namedInvitees[0],
      ),
      true,
    );
  },
);

test(
  "test-role transformation remains fully functional while being excluded from guest-list eligibility",
  () => {
    const transformed =
      transformProductionInvitationRow(
        makeTestRow(),
        {
          rowNumber: 69,
          recordRole: "test",
        },
      );

    assert.equal(
      transformed.recordRole,
      "test",
    );
    assert.equal(
      transformed.guestListEligible,
      false,
    );
    assert.equal(
      transformed.active,
      true,
    );
    assert.equal(
      transformed.environment,
      "production",
    );
    assert.equal(
      transformed.maximumAttendance,
      4,
    );
    assert.deepEqual(
      transformed.namedInvitees.map(
        (invitee) =>
          invitee.displayName,
      ),
      ["Test Sample"],
    );
    assert.equal(
      transformed
        .additionalGuestAllocations
        .length,
      2,
    );
    assert.equal(
      transformed
        .additionalGuestAllocations[0]
        .kind,
      "plus1",
    );
    assert.equal(
      transformed
        .additionalGuestAllocations[0]
        .prompt,
      "Will Test Sample be accompanied by a +1?",
    );
    assert.equal(
      transformed.additionalGuestAllocations[1].kind,
      "unnamedChildren",
    );
    assert.equal(
      transformed.additionalGuestAllocations[1].maximumCount,
      2,
    );
    assert.equal(
      transformed.additionalGuestAllocations[1].prompt,
      GROUPED_CHILD_PROMPT,
    );
  },
);

test(
  "production row transformation rejects unsupported record roles",
  () => {
    assert.throws(
      () =>
        transformProductionInvitationRow(
          makeRow(),
          {
            recordRole:
              "reserved",
          },
        ),
      /unsupported record role/,
    );
  },
);

test(
  "production row transformation falls back to supplied first and last names when clarification is blank",
  () => {
    const transformed =
      transformProductionInvitationRow(
        makeRow(),
      );

    assert.equal(
      transformed.partyDisplayName,
      "Example Guest",
    );
    assert.equal(
      transformed.greeting,
      "Example Guest",
    );
    assert.equal(
      transformed.wordingMode,
      "singular",
    );
  },
);

test(
  "paired comma-separated first-name and last-name source columns create specifically named invitees",
  () => {
    const transformed =
      transformProductionInvitationRow(
        makeRow({
          "First Name(s)":
            "Alpha, Beta, Gamma",
          "Last Name(s)":
            "One, Two, Three",
          "Total Potential Attendees (Including Plus1 and Kids)":
            3,
          "I/We wording":
            "we",
        }),
      );

    assert.deepEqual(
      transformed.namedInvitees,
      [
        {
          id:
            deriveInviteeId(
              "ABC123",
              1,
            ),
          displayName:
            "Alpha One",
        },
        {
          id:
            deriveInviteeId(
              "ABC123",
              2,
            ),
          displayName:
            "Beta Two",
        },
        {
          id:
            deriveInviteeId(
              "ABC123",
              3,
            ),
          displayName:
            "Gamma Three",
        },
      ],
    );

    assert.equal(
      transformed
        .additionalGuestAllocations
        .length,
      0,
    );
  },
);

test(
  "named-invitee pairing fails closed when first-name and last-name counts disagree",
  () => {
    assert.throws(
      () =>
        transformProductionInvitationRow(
          makeRow({
            "First Name(s)":
              "Alpha, Beta",
            "Last Name(s)":
              "Example",
            "Total Potential Attendees (Including Plus1 and Kids)":
              2,
          }),
        ),
      /mismatched named-invitee first-name and last-name counts/,
    );
  },
);

test(
  "single unparenthesized Plus1 is associated with the only specifically named invitee",
  () => {
    const transformed =
      transformProductionInvitationRow(
        makeRow({
          Plus1: "Plus1",
          "Total Potential Attendees (Including Plus1 and Kids)":
            2,
        }),
      );

    assert.deepEqual(
      transformed
        .additionalGuestAllocations,
      [
        {
          id:
            deriveAllocationId(
              "ABC123",
              1,
            ),
          kind: "plus1",
          prompt:
            "Will Example Guest be accompanied by a +1?",
          maximumCount: 1,
        },
      ],
    );
  },
);

test(
  "multiple Plus1 allocations require and preserve separate parenthesized invitee labels",
  () => {
    const transformed =
      transformProductionInvitationRow(
        makeRow({
          "First Name(s)":
            "Example, Second",
          "Last Name(s)":
            "Adult, Adult",
          Plus1:
            "Plus1 (Example Adult); Plus1 (Second Adult)",
          "Total Potential Attendees (Including Plus1 and Kids)":
            4,
          "I/We wording":
            "we",
        }),
      );

    assert.deepEqual(
      transformed
        .additionalGuestAllocations,
      [
        {
          id:
            deriveAllocationId(
              "ABC123",
              1,
            ),
          kind: "plus1",
          prompt:
            "Will Example Adult be accompanied by a +1?",
          maximumCount: 1,
        },
        {
          id:
            deriveAllocationId(
              "ABC123",
              2,
            ),
          kind: "plus1",
          prompt:
            "Will Second Adult be accompanied by a +1?",
          maximumCount: 1,
        },
      ],
    );
  },
);

test(
  "Kids(n) produces exactly one grouped unnamed-children allocation with n person-capacity slots",
  () => {
    const transformed =
      transformProductionInvitationRow(
        makeRow({
          Plus1: "Kids(3)",
          "Total Potential Attendees (Including Plus1 and Kids)":
            4,
        }),
      );

    assert.deepEqual(
      transformed
        .additionalGuestAllocations,
      [
        {
          id:
            deriveChildrenAllocationId(
              "ABC123",
            ),
          kind:
            "unnamedChildren",
          prompt:
            GROUPED_CHILD_PROMPT,
          maximumCount: 3,
        },
      ],
    );

    assert.equal(
      transformed
        .additionalGuestAllocations
        .length,
      1,
    );
  },
);

test(
  "Plus1 and Kids(n) may coexist and capacity is summed by maximumCount rather than allocation-object count",
  () => {
    const transformed =
      transformProductionInvitationRow(
        makeRow({
          Plus1:
            "Plus1, Kids(3)",
          "Total Potential Attendees (Including Plus1 and Kids)":
            5,
        }),
      );

    assert.deepEqual(
      transformed
        .additionalGuestAllocations,
      [
        {
          id:
            deriveAllocationId(
              "ABC123",
              1,
            ),
          kind: "plus1",
          prompt:
            "Will Example Guest be accompanied by a +1?",
          maximumCount: 1,
        },
        {
          id:
            deriveChildrenAllocationId(
              "ABC123",
            ),
          kind:
            "unnamedChildren",
          prompt:
            GROUPED_CHILD_PROMPT,
          maximumCount: 3,
        },
      ],
    );

    const allocationCapacity =
      transformed
        .additionalGuestAllocations
        .reduce(
          (
            total,
            allocation,
          ) =>
            total +
            allocation.maximumCount,
          0,
        );

    assert.equal(
      transformed.namedInvitees.length +
        allocationCapacity,
      transformed.maximumAttendance,
    );
    assert.equal(
      allocationCapacity,
      4,
    );
  },
);

test(
  "specifically named children remain ordinary named invitees and do not create grouped child capacity without Kids(n)",
  () => {
    const transformed =
      transformProductionInvitationRow(
        makeRow({
          "First Name(s)":
            "Example Adult, Named Child",
          "Last Name(s)":
            "Guest, Guest",
          "Total Potential Attendees (Including Plus1 and Kids)":
            2,
          "I/We wording":
            "we",
        }),
      );

    assert.deepEqual(
      transformed.namedInvitees.map(
        (invitee) =>
          invitee.displayName,
      ),
      [
        "Example Adult Guest",
        "Named Child Guest",
      ],
    );

    assert.equal(
      transformed
        .additionalGuestAllocations
        .length,
      0,
    );
  },
);

test(
  "generated party, invitee, Plus1, and grouped-child identifiers are deterministic and do not encode guest names",
  () => {
    assert.equal(
      derivePartyId(
        "ABC123",
      ),
      derivePartyId(
        "ABC123",
      ),
    );

    assert.equal(
      deriveInviteeId(
        "ABC123",
        1,
      ),
      deriveInviteeId(
        "ABC123",
        1,
      ),
    );

    assert.equal(
      deriveAllocationId(
        "ABC123",
        1,
      ),
      deriveAllocationId(
        "ABC123",
        1,
      ),
    );

    assert.equal(
      deriveChildrenAllocationId(
        "ABC123",
      ),
      deriveChildrenAllocationId(
        "ABC123",
      ),
    );

    const combined =
      [
        derivePartyId(
          "ABC123",
        ),
        deriveInviteeId(
          "ABC123",
          1,
        ),
        deriveAllocationId(
          "ABC123",
          1,
        ),
        deriveChildrenAllocationId(
          "ABC123",
        ),
      ].join(" ");

    assert.equal(
      combined.includes(
        "Example",
      ),
      false,
    );

    assert.match(
      derivePartyId(
        "ABC123",
      ),
      /^party-[a-f0-9]{16}$/,
    );
    assert.match(
      deriveInviteeId(
        "ABC123",
        1,
      ),
      /^invitee-[a-f0-9]{16}$/,
    );
    assert.match(
      deriveAllocationId(
        "ABC123",
        1,
      ),
      /^plus1-[a-f0-9]{16}$/,
    );
    assert.match(
      deriveChildrenAllocationId(
        "ABC123",
      ),
      /^children-[a-f0-9]{16}$/,
    );
  },
);

test(
  "Plus1 parser accepts blank, single, repeated, and mixed administrative source forms",
  () => {
    assert.deepEqual(
      parsePlus1Entries(
        "",
        2,
      ),
      [],
    );

    assert.deepEqual(
      parsePlus1Entries(
        "Kids(2)",
        2,
      ),
      [],
    );

    assert.deepEqual(
      parsePlus1Entries(
        "Plus1",
        2,
      ),
      [null],
    );

    assert.deepEqual(
      parsePlus1Entries(
        "Kids(2); Plus1 (Alpha), household note; Plus1 (Beta)\nPlus1 (Gamma)",
        2,
      ),
      [
        "Alpha",
        "Beta",
        "Gamma",
      ],
    );
  },
);

test(
  "Kids(n) parser accepts blank and case-insensitive grouped child capacity",
  () => {
    assert.equal(
      parseUnnamedChildrenCount(
        "",
        2,
      ),
      0,
    );
    assert.equal(
      parseUnnamedChildrenCount(
        "N/A",
        2,
      ),
      0,
    );
    assert.equal(
      parseUnnamedChildrenCount(
        "Kids(3)",
        2,
      ),
      3,
    );
    assert.equal(
      parseUnnamedChildrenCount(
        "Plus1, kids(2)",
        2,
      ),
      2,
    );
  },
);

test(
  "Kids(n) parser fails closed on malformed, zero, or repeated child allocations",
  () => {
    for (
      const source of [
        "Kids",
        "Kids()",
        "Kids(0)",
        "Kids(2), Kids(1)",
      ]
    ) {
      assert.throws(
        () =>
          parseUnnamedChildrenCount(
            source,
            2,
          ),
        /Kids\(n\)|invalid Kids\(n\) capacity|more than one Kids\(n\) allocation/,
      );
    }
  },
);

test(
  "production transformation fails closed on malformed core source values",
  () => {
    const cases = [
      [
        {
          "Guest ID":
            "bad/code",
        },
        /malformed Guest ID/,
      ],
      [
        {
          "I/We wording":
            "they",
        },
        /unsupported I\/We wording/,
      ],
      [
        {
          "Total Potential Attendees (Including Plus1 and Kids)":
            0,
        },
        /invalid maximum attendance/,
      ],
      [
        {
          Plus1:
            "Plus One",
        },
        /malformed or ambiguous Plus1/,
      ],
      [
        {
          Plus1:
            "Kids",
        },
        /malformed or ambiguous Kids\(n\) text/,
      ],
    ];

    for (
      const [
        overrides,
        pattern,
      ] of cases
    ) {
      assert.throws(
        () =>
          transformProductionInvitationRow(
            makeRow(
              overrides,
            ),
          ),
        pattern,
      );
    }
  },
);

test(
  "unparenthesized Plus1 fails when more than one specifically named invitee makes the primary invitee ambiguous",
  () => {
    assert.throws(
      () =>
        transformProductionInvitationRow(
          makeRow({
            "First Name(s)":
              "Alpha, Beta",
            "Last Name(s)":
              "Example, Example",
            Plus1: "Plus1",
            "Total Potential Attendees (Including Plus1 and Kids)":
              3,
            "I/We wording":
              "we",
          }),
        ),
      /ambiguous primary invitee/,
    );
  },
);

test(
  "multiple Plus1 entries fail when any allocation lacks a parenthesized invitee name",
  () => {
    assert.throws(
      () =>
        transformProductionInvitationRow(
          makeRow({
            Plus1:
              "Plus1 (Alpha); Plus1",
            "Total Potential Attendees (Including Plus1 and Kids)":
              3,
          }),
        ),
      /requires a parenthesized invitee name/,
    );
  },
);

test(
  "configured named-invitee plus allocation person-capacity must equal maximum attendance exactly",
  () => {
    assert.throws(
      () =>
        transformProductionInvitationRow(
          makeRow({
            Plus1:
              "Plus1, Kids(3)",
            "Total Potential Attendees (Including Plus1 and Kids)":
              3,
          }),
        ),
      /incompatible with maximum attendance/,
    );

    assert.throws(
      () =>
        transformProductionInvitationRow(
          makeRow({
            "First Name(s)":
              "Alpha, Beta",
            "Last Name(s)":
              "Example, Example",
            "Total Potential Attendees (Including Plus1 and Kids)":
              1,
          }),
        ),
      /incompatible with maximum attendance/,
    );
  },
);

test(
  "reserved placeholder recognition is limited to invites 58 through 67 and requires the complete placeholder shape",
  () => {
    assert.equal(
      isReservedPlaceholderSourceRow(
        makeReservedRow(58),
        58,
        59,
      ),
      true,
    );

    assert.equal(
      isReservedPlaceholderSourceRow(
        makeReservedRow(67),
        67,
        68,
      ),
      true,
    );

    assert.equal(
      isReservedPlaceholderSourceRow(
        makeReservedRow(57),
        57,
        58,
      ),
      false,
    );

    assert.equal(
      isReservedPlaceholderSourceRow(
        makeReservedRow(68),
        68,
        69,
      ),
      false,
    );

    assert.equal(
      isReservedPlaceholderSourceRow(
        makeRow({
          "Invite #": "58",
        }),
        58,
        59,
      ),
      false,
    );

    assert.throws(
      () =>
        isReservedPlaceholderSourceRow(
          makeReservedRow(
            58,
            {
              "Last Name(s)":
                "Guest",
            },
          ),
          58,
          59,
        ),
      /partially populated reserved placeholder/,
    );

    assert.throws(
      () =>
        isReservedPlaceholderSourceRow(
          makeReservedRow(
            58,
            {
              "Total Potential Attendees (Including Plus1 and Kids)":
                1,
            },
          ),
          58,
          59,
        ),
      /partially populated reserved placeholder/,
    );
  },
);

test(
  "registry transformation ignores non-invitation bottom-row notes and rejects canonical code collisions",
  () => {
    const transformed =
      transformProductionInvitationRows(
        [
          makeRow(),
          {
            "Invite #": "Notes",
            "Guest ID":
              "Bottom-row note text",
            "I/We wording":
              "Note only",
          },
        ],
      );

    assert.equal(
      transformed
        .configurations.length,
      1,
    );

    assert.throws(
      () =>
        transformProductionInvitationRows(
          [
            makeRow(),
            makeRow({
              "Invite #": "2",
              "Guest ID":
                "ABC-123",
              "First Name(s)":
                "Second",
              "Last Name(s)":
                "Guest",
            }),
          ],
        ),
      /canonical invitation-code collision/,
    );
  },
);

test(
  "reserved codes participate in collision detection even though they do not create active configurations",
  () => {
    const rows =
      makeAuthoritativeShapeRows();

    rows[
      RESERVED_INVITE_NUMBER_MIN -
        1
    ]["Guest ID"] =
      rows[0]["Guest ID"];

    assert.throws(
      () =>
        transformProductionInvitationRows(
          rows,
        ),
      /canonical invitation-code collision/,
    );
  },
);

test(
  "current 68-row authoritative shape preserves the 1-57 baseline, reserves ten future codes, and creates one non-counting functional test invitation",
  () => {
    const transformed =
      transformProductionInvitationRows(
        makeAuthoritativeShapeRows(),
      );

    assertTargetSubset(
      transformed.summary,
    );

    assert.equal(
      assertProductionAuditTargets(
        transformed.summary,
      ),
      true,
    );

    assert.equal(
      transformed.summary
        .numberedSourceRowCount,
      68,
    );
    assert.equal(
      transformed.summary
        .uniqueSourceCodeCount,
      68,
    );
    assert.equal(
      transformed.summary
        .sourceInviteNumberSequenceValid,
      true,
    );
    assert.equal(
      transformed.summary
        .reservedPlaceholderCount,
      10,
    );

    assert.equal(
      transformed.summary
        .functionalInvitationCount,
      58,
    );
    assert.equal(
      transformed.summary
        .guestListInvitationCount,
      57,
    );
    assert.equal(
      transformed.summary
        .testInvitationCount,
      1,
    );

    assert.equal(
      transformed.summary
        .combinedMaximumAttendance,
      115,
    );
    assert.equal(
      transformed.summary
        .baselineCombinedMaximumAttendance,
      115,
    );
    assert.equal(
      transformed.summary
        .testCombinedMaximumAttendance,
      4,
    );
    assert.equal(
      transformed.summary
        .functionalCombinedMaximumAttendance,
      119,
    );

    assert.equal(
      transformed
        .configurations.length,
      58,
    );

    const testInvitation =
      transformed.configurations.find(
        (configuration) =>
          configuration.recordRole ===
          "test",
      );

    assert.ok(
      testInvitation,
    );
    assert.equal(
      testInvitation
        .guestListEligible,
      false,
    );
    assert.equal(
      testInvitation.active,
      true,
    );
    assert.equal(
      testInvitation.maximumAttendance,
      4,
    );
  },
);

test(
  "the established grouped-child and Plus1 figures remain guest-list-only audit values",
  () => {
    const transformed =
      transformProductionInvitationRows(
        makeAuthoritativeShapeRows(),
      );

    assert.equal(
      transformed.summary
        .plus1AllocationCount,
      26,
    );
    assert.equal(
      transformed.summary
        .groupedChildAllocationCount,
      2,
    );
    assert.equal(
      transformed.summary
        .groupedChildCapacity,
      5,
    );
    assert.equal(
      transformed.summary
        .allocationCount,
      28,
    );
    assert.equal(
      transformed.summary
        .additionalGuestCapacity,
      31,
    );
    assert.equal(
      transformed.summary
        .multiAllocationInvitationCount,
      4,
    );

    assert.equal(
      transformed.summary
        .testPlus1AllocationCount,
      1,
    );

    const grouped =
      transformed
        .configurations
        .filter(
          (configuration) =>
            configuration
              .guestListEligible ===
            true,
        )
        .flatMap(
          (configuration) =>
            configuration
              .additionalGuestAllocations
              .filter(
                (allocation) =>
                  allocation.kind ===
                  "unnamedChildren",
              ),
        );

    assert.deepEqual(
      grouped.map(
        (allocation) =>
          allocation.maximumCount,
      ),
      [3, 2],
    );
  },
);

test(
  "populating a reserved invitation automatically increases guest-list count and capacity without changing the 1-57 baseline target",
  () => {
    const transformed =
      transformProductionInvitationRows(
        makeAuthoritativeShapeRows({
          populateReservedInvite: 58,
        }),
      );

    assert.equal(
      transformed.summary
        .numberedSourceRowCount,
      68,
    );
    assert.equal(
      transformed.summary
        .reservedPlaceholderCount,
      9,
    );
    assert.equal(
      transformed.summary
        .functionalInvitationCount,
      59,
    );
    assert.equal(
      transformed.summary
        .guestListInvitationCount,
      58,
    );
    assert.equal(
      transformed.summary
        .testInvitationCount,
      1,
    );

    assert.equal(
      transformed.summary
        .baselineInvitationCount,
      57,
    );
    assert.equal(
      transformed.summary
        .baselineCombinedMaximumAttendance,
      115,
    );

    assert.equal(
      transformed.summary
        .combinedMaximumAttendance,
      116,
    );
    assert.equal(
      transformed.summary
        .functionalCombinedMaximumAttendance,
      120,
    );

    assert.equal(
      assertProductionAuditTargets(
        transformed.summary,
      ),
      true,
    );

    const newlyAssigned =
      transformed.configurations.find(
        (configuration) =>
          configuration.inviteCode ===
          "P00058",
      );

    assert.ok(
      newlyAssigned,
    );
    assert.equal(
      newlyAssigned.recordRole,
      "assigned",
    );
    assert.equal(
      newlyAssigned
        .guestListEligible,
      true,
    );
  },
);

test(
  "summary counts allocation objects separately from additional-person capacity and excludes test-role capacity from guest-list aggregates",
  () => {
    const configurations = [
      transformProductionInvitationRow(
        makeRow({
          Plus1:
            "Plus1, Kids(3)",
          "Total Potential Attendees (Including Plus1 and Kids)":
            5,
        }),
      ),
      transformProductionInvitationRow(
        makeRow({
          "Guest ID":
            "DEF456",
          "Invite #": "2",
          Plus1: "",
          "Total Potential Attendees (Including Plus1 and Kids)":
            1,
        }),
      ),
      transformProductionInvitationRow(
        makeTestRow({
          "Guest ID":
            "TST999",
        }),
        {
          recordRole: "test",
        },
      ),
    ];

    const summary =
      summarizeProductionConfigurations(
        configurations,
      );

    assert.equal(
      summary.allocationCount,
      2,
    );
    assert.equal(
      summary.additionalGuestCapacity,
      4,
    );
    assert.equal(
      summary.namedInviteeCount,
      2,
    );
    assert.equal(
      summary.combinedMaximumAttendance,
      6,
    );

    assert.equal(
      summary.guestListInvitationCount,
      2,
    );
    assert.equal(
      summary.testInvitationCount,
      1,
    );
    assert.equal(
      summary.testNamedInviteeCount,
      1,
    );
    assert.equal(
      summary.testPlus1AllocationCount,
      1,
    );
    assert.equal(
      summary.testCombinedMaximumAttendance,
      4,
    );
    assert.equal(
      summary
        .functionalCombinedMaximumAttendance,
      10,
    );
  },
);

test(
  "audit target mismatch fails without echoing private source values",
  () => {
    const transformed =
      transformProductionInvitationRows(
        [
          makeRow(),
        ],
      );

    let error;

    try {
      assertProductionAuditTargets(
        transformed.summary,
      );
    } catch (caughtError) {
      error = caughtError;
    }

    assert.ok(
      error instanceof Error,
    );
    assert.match(
      error.message,
      /audit failed/,
    );
    assert.equal(
      error.message.includes(
        "ABC123",
      ),
      false,
    );
    assert.equal(
      error.message.includes(
        "Example Guest",
      ),
      false,
    );
  },
);

test(
  "numbered invitation rows fail closed when Guest ID is missing while nonnumeric note rows are ignored",
  () => {
    assert.throws(
      () =>
        transformProductionInvitationRows(
          [
            {
              ...makeRow(),
              "Guest ID": "",
            },
          ],
        ),
      /missing required field: Guest ID/,
    );

    const transformed =
      transformProductionInvitationRows(
        [
          makeRow(),
          {
            "Invite #": "Notes",
            "Guest ID":
              "Bottom-row note text",
            "I/We wording":
              "Note only",
          },
        ],
      );

    assert.equal(
      transformed
        .configurations.length,
      1,
    );
  },
);

test(
  "duplicate numeric invitation numbers are rejected as contradictory source rows",
  () => {
    assert.throws(
      () =>
        transformProductionInvitationRows(
          [
            makeRow(),
            makeRow({
              "Guest ID":
                "DEF456",
              "First Name(s)":
                "Second",
              "Last Name(s)":
                "Guest",
            }),
          ],
        ),
      /duplicates an invitation number/,
    );
  },
);

test(
  "missing numbered rows make the 1-through-68 source sequence invalid and fail the governing audit",
  () => {
    const rows =
      makeAuthoritativeShapeRows()
        .filter(
          (row) =>
            row["Invite #"] !==
            "67",
        );

    const transformed =
      transformProductionInvitationRows(
        rows,
      );

    assert.equal(
      transformed.summary
        .sourceInviteNumberSequenceValid,
      false,
    );

    assert.throws(
      () =>
        assertProductionAuditTargets(
          transformed.summary,
        ),
      /audit failed/,
    );
  },
);

test(
  "partially populated reserved source rows fail closed rather than being guessed as assigned or reserved",
  () => {
    const rows =
      makeAuthoritativeShapeRows();

    const reservedIndex =
      RESERVED_INVITE_NUMBER_MIN -
      1;

    rows[reservedIndex] = {
      ...rows[reservedIndex],
      "First Name(s)":
        "Future",
      "Last Name(s)":
        "?",
    };

    assert.throws(
      () =>
        transformProductionInvitationRows(
          rows,
        ),
      /partially populated reserved placeholder/,
    );
  },
);