const test = require("node:test");
const assert = require("node:assert/strict");

const {
  PRODUCTION_AUDIT_TARGETS,
  assertProductionAuditTargets,
  deriveAllocationId,
  derivePartyId,
  parsePlus1Entries,
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
      2,
    "I/We wording": "I",
    ...overrides,
  };
}

test(
  "production row transformation uses clarification, canonical code, explicit wording, and production classification",
  () => {
    const transformed =
      transformProductionInvitationRow(
        makeRow({
          "Guest ID":
            " abc-123 ",
          "Attendee Names Clarification":
            "The Reviewed Example Party",
          "I/We wording": "we",
          "Total Potential Attendees (Including Plus1 and Kids)":
            "4",
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
        maximumAttendance: 4,
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
  "single unparenthesized Plus1 is associated with the unambiguous primary named invitee",
  () => {
    const transformed =
      transformProductionInvitationRow(
        makeRow({
          Plus1: "Plus1",
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
          prompt:
            "Will Example Guest be accompanied by a +1?",
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
          Plus1:
            "Plus1 (Example Adult One); Plus1 (Example Adult Two)",
          "Total Potential Attendees (Including Plus1 and Kids)":
            4,
        }),
      );

    assert.deepEqual(
      transformed
        .additionalGuestAllocations
        .map(
          (allocation) =>
            allocation.prompt,
        ),
      [
        "Will Example Adult One be accompanied by a +1?",
        "Will Example Adult Two be accompanied by a +1?",
      ],
    );

    assert.equal(
      new Set(
        transformed
          .additionalGuestAllocations
          .map(
            (allocation) =>
              allocation.id,
          ),
      ).size,
      2,
    );
  },
);

test(
  "generated party and allocation identifiers are deterministic and do not encode guest names",
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
      deriveAllocationId(
        "ABC123",
        1,
      ),
      deriveAllocationId(
        "ABC123",
        1,
      ),
    );

    const combined =
      [
        derivePartyId(
          "ABC123",
        ),
        deriveAllocationId(
          "ABC123",
          1,
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
      deriveAllocationId(
        "ABC123",
        1,
      ),
      /^plus1-[a-f0-9]{16}$/,
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
        "Invited children: Example Child",
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
        "Children: Example Child; Plus1 (Alpha), household note; Plus1 (Beta)\nPlus1 (Gamma)",
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
  "production transformation fails closed on malformed source values",
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
  "unparenthesized Plus1 fails when the primary named invitee is ambiguous",
  () => {
    assert.throws(
      () =>
        transformProductionInvitationRow(
          makeRow({
            "First Name(s)":
              "Alpha and Beta",
            Plus1: "Plus1",
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
              4,
          }),
        ),
      /requires a parenthesized invitee name/,
    );
  },
);

test(
  "allocation count must leave room for at least one primary invited attendee",
  () => {
    assert.throws(
      () =>
        transformProductionInvitationRow(
          makeRow({
            Plus1:
              "Plus1 (Alpha); Plus1 (Beta)",
            "Total Potential Attendees (Including Plus1 and Kids)":
              2,
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
            }),
          ],
        ),
      /canonical invitation-code collision/,
    );
  },
);

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

    let plus1 = "";
    let maximumAttendance;

    if (index === 1) {
      plus1 =
        "Plus1 (Example A); Plus1 (Example B); Plus1 (Example C)";
      maximumAttendance = 4;
    } else if (
      index === 2
    ) {
      plus1 =
        "Plus1 (Example A); Plus1 (Example B)";
      maximumAttendance = 3;
    } else if (
      index <= 23
    ) {
      plus1 = "Plus1";
      maximumAttendance = 2;
    } else if (
      index <= 55
    ) {
      maximumAttendance = 2;
    } else {
      maximumAttendance = 1;
    }

    rows.push(
      makeRow({
        "Invite #":
          String(index),
        "Guest ID": code,
        "First Name(s)":
          `Example${index}`,
        "Last Name(s)":
          "Guest",
        Plus1: plus1,
        "Total Potential Attendees (Including Plus1 and Kids)":
          maximumAttendance,
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
  "synthetic authoritative-shape source reproduces every governing production audit target without hard-coding runtime invitation behavior",
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
            }),
          ],
        ),
      /duplicates an invitation number/,
    );
  },
);
