const test = require("node:test");
const assert = require("node:assert/strict");

const {
  GROUPED_CHILD_PROMPT,
  PRODUCTION_AUDIT_TARGETS,
  assertProductionAuditTargets,
  deriveAllocationId,
  deriveChildrenAllocationId,
  deriveInviteeId,
  derivePartyId,
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
    "First Name(s)":
      "Example",
    "Last Name(s)":
      "Guest",
    "Attendee Names Clarification":
      "",
    Plus1: "",
    "Total Potential Attendees (Including Plus1 and Kids)":
      1,
    "I/We wording": "I",
    ...overrides,
  };
}

test(
  "production row transformation uses clarification, canonical code, explicit wording, named invitees, and production classification",
  () => {
    const transformed =
      transformProductionInvitationRow(
        makeRow({
          "Guest ID":
            " abc-123 ",
          "Attendee Names Clarification":
            "The Reviewed Example Party",
          "I/We wording": "we",
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

    assert.equal(
      transformed
        .additionalGuestAllocations
        .length,
      2,
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
  "registry transformation ignores non-invitation bottom-row notes and rejects canonical code collisions",
  () => {
    const transformed =
      transformProductionInvitationRows(
        [
          makeRow(),
          {
            Notes:
              "Bottom-row RSVP display notes",
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

function makeAuthoritativeShapeRows() {
  const rows = [];

  for (
    let index = 1;
    index <= 57;
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
      plus1 = "Plus1, Kids(3)";
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
      plus1 = "Plus1, kids(2)";
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

  rows.push({
    "Invite #": "Notes",
    "Guest ID":
      "Bottom-row note text",
    "I/We wording":
      "Note: display wording guidance",
  });

  return rows;
}

test(
  "synthetic authoritative-shape source reproduces every governing production audit target",
  () => {
    const transformed =
      transformProductionInvitationRows(
        makeAuthoritativeShapeRows(),
      );

    assert.deepEqual(
      transformed.summary,
      PRODUCTION_AUDIT_TARGETS,
    );

    assert.equal(
      assertProductionAuditTargets(
        transformed.summary,
      ),
      true,
    );

    assert.equal(
      transformed.summary
        .namedInviteeCount +
        transformed.summary
          .additionalGuestCapacity,
      transformed.summary
        .combinedMaximumAttendance,
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
  },
);

test(
  "synthetic production audit includes 26 Plus1 objects, two grouped-child objects, and five grouped-child person-capacity slots",
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
        .multiAllocationInvitationCount,
      4,
    );

    const grouped =
      transformed
        .configurations
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
  "summary counts allocation objects separately from additional-person capacity",
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