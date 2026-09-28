const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  loadDevelopmentInvitationFixtures,
} = require(
  "../src/rsvp/developmentInvitations"
);

const GROUPED_CHILD_PROMPT =
  "We'd love for your family to celebrate with us this Mayday - will your kid(s) be accompanying you?";

function loadRegistry() {
  return loadDevelopmentInvitationFixtures({
    runtimeEnvironment: "test",
  });
}

function cloneRegistry() {
  return loadRegistry().fixtures.map(
    (fixture) => ({
      ...fixture,

      namedInvitees:
        fixture.namedInvitees.map(
          (invitee) => ({
            ...invitee,
          }),
        ),

      additionalGuestAllocations:
        fixture.additionalGuestAllocations.map(
          (allocation) => ({
            ...allocation,
          }),
        ),
    }),
  );
}

function withTemporaryFixtureFile(
  data,
  callback,
) {
  const directory = fs.mkdtempSync(
    path.join(
      os.tmpdir(),
      "wedding-rsvp-fixtures-",
    ),
  );

  const filePath = path.join(
    directory,
    "fixtures.json",
  );

  try {
    fs.writeFileSync(
      filePath,
      JSON.stringify(
        data,
        null,
        2,
      ),
      "utf8",
    );

    return callback(filePath);
  } finally {
    fs.rmSync(
      directory,
      {
        recursive: true,
        force: true,
      },
    );
  }
}

function sumAllocationCapacity(
  fixture,
) {
  return fixture
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
}

test(
  "loads the complete governing development fixture registry",
  () => {
    const registry = loadRegistry();

    assert.equal(
      registry.fixtures.length,
      11,
    );

    assert.deepEqual(
      registry.fixtures.map(
        (fixture) =>
          fixture.inviteCode,
      ),
      [
        "DEV001",
        "DEV002",
        "DEV003",
        "DEV004",
        "DEV005",
        "DEV006",
        "DEV007",
        "DEV008",
        "DEV009",
        "DEV010",
        "DEV999",
      ],
    );
  },
);

test(
  "all loaded fixtures are explicitly development-only",
  () => {
    const registry = loadRegistry();

    for (
      const fixture of
        registry.fixtures
    ) {
      assert.equal(
        fixture.environment,
        "development",
      );
    }
  },
);

test(
  "indexes fixtures by canonical invitation code",
  () => {
    const registry = loadRegistry();

    assert.equal(
      registry.byCanonicalCode
        .DEV001
        .partyId,
      "party-dev-archetype-a",
    );

    assert.equal(
      registry.byCanonicalCode
        .DEV002
        .namedInvitees
        .length,
      3,
    );

    assert.equal(
      registry.byCanonicalCode
        .DEV002
        .additionalGuestAllocations
        .length,
      1,
    );

    assert.equal(
      registry.byCanonicalCode
        .DEV009
        .additionalGuestAllocations
        .length,
      3,
    );
  },
);

test(
  "preserves the governing active and inactive fixture states",
  () => {
    const registry = loadRegistry();

    for (
      const fixture of
        registry.fixtures
    ) {
      if (
        fixture.inviteCode ===
        "DEV999"
      ) {
        assert.equal(
          fixture.active,
          false,
        );
      } else {
        assert.equal(
          fixture.active,
          true,
        );
      }
    }
  },
);

test(
  "preserves maximum attendance, named-invitee counts, allocation-object counts, and allocation person-capacity",
  () => {
    const registry = loadRegistry();

    const expected = {
      DEV001: [1, 1, 0, 0],
      DEV002: [5, 3, 1, 2],
      DEV003: [2, 1, 1, 1],
      DEV004: [4, 3, 1, 1],
      DEV005: [4, 4, 0, 0],
      DEV006: [2, 1, 1, 1],
      DEV007: [3, 3, 0, 0],
      DEV008: [3, 3, 0, 0],
      DEV009: [7, 4, 3, 3],
      DEV010: [4, 3, 1, 1],
      DEV999: [2, 1, 1, 1],
    };

    for (
      const [
        inviteCode,
        [
          maximumAttendance,
          namedInviteeCount,
          allocationObjectCount,
          allocationCapacity,
        ],
      ] of Object.entries(expected)
    ) {
      const fixture =
        registry.byCanonicalCode[
          inviteCode
        ];

      assert.equal(
        fixture.maximumAttendance,
        maximumAttendance,
      );

      assert.equal(
        fixture.namedInvitees.length,
        namedInviteeCount,
      );

      assert.equal(
        fixture
          .additionalGuestAllocations
          .length,
        allocationObjectCount,
      );

      assert.equal(
        sumAllocationCapacity(
          fixture,
        ),
        allocationCapacity,
      );

      assert.equal(
        fixture.namedInvitees.length +
          sumAllocationCapacity(
            fixture,
          ),
        fixture.maximumAttendance,
      );
    }
  },
);

test(
  "preserves governing named-invitee IDs and display names",
  () => {
    const registry = loadRegistry();

    assert.deepEqual(
      registry.byCanonicalCode
        .DEV003
        .namedInvitees,
      [
        {
          id: "invitee-dev003-a",
          displayName:
            "Example Guest",
        },
      ],
    );

    assert.deepEqual(
      registry.byCanonicalCode
        .DEV002
        .namedInvitees,
      [
        {
          id: "invitee-dev002-a",
          displayName:
            "Example Adult One",
        },
        {
          id: "invitee-dev002-b",
          displayName:
            "Example Adult Two",
        },
        {
          id: "invitee-dev002-c",
          displayName:
            "Example Household Member Three",
        },
      ],
    );

    assert.deepEqual(
      registry.byCanonicalCode
        .DEV009
        .namedInvitees,
      [
        {
          id: "invitee-dev009-a",
          displayName:
            "Example Adult One",
        },
        {
          id: "invitee-dev009-b",
          displayName:
            "Example Adult Two",
        },
        {
          id: "invitee-dev009-c",
          displayName:
            "Example Adult Three",
        },
        {
          id: "invitee-dev009-d",
          displayName:
            "Example Child",
        },
      ],
    );
  },
);

test(
  "preserves typed Plus1 allocations with maximumCount 1",
  () => {
    const registry = loadRegistry();

    assert.deepEqual(
      registry.byCanonicalCode
        .DEV003
        .additionalGuestAllocations,
      [
        {
          id: "plus1-dev003-a",
          prompt:
            "Will Example Guest be accompanied by a +1?",
          kind: "plus1",
          maximumCount: 1,
        },
      ],
    );

    assert.deepEqual(
      registry.byCanonicalCode
        .DEV009
        .additionalGuestAllocations,
      [
        {
          id: "plus1-dev009-a",
          prompt:
            "Will Example Adult One be accompanied by a +1?",
          kind: "plus1",
          maximumCount: 1,
        },
        {
          id: "plus1-dev009-b",
          prompt:
            "Will Example Adult Two be accompanied by a +1?",
          kind: "plus1",
          maximumCount: 1,
        },
        {
          id: "plus1-dev009-c",
          prompt:
            "Will Example Adult Three be accompanied by a +1?",
          kind: "plus1",
          maximumCount: 1,
        },
      ],
    );
  },
);

test(
  "preserves DEV002 as one grouped unnamed-children allocation with capacity two",
  () => {
    const registry = loadRegistry();

    assert.deepEqual(
      registry.byCanonicalCode
        .DEV002
        .additionalGuestAllocations,
      [
        {
          id: "allocation-dev002-a",
          kind:
            "unnamedChildren",
          prompt:
            GROUPED_CHILD_PROMPT,
          maximumCount: 2,
        },
      ],
    );

    assert.equal(
      registry.byCanonicalCode
        .DEV002
        .namedInvitees
        .length,
      3,
    );

    assert.equal(
      registry.byCanonicalCode
        .DEV002
        .maximumAttendance,
      5,
    );
  },
);

test(
  "contains 27 named invitees, nine allocation objects, ten allocation-capacity slots, and 37 total potential attendees across the governing fixtures",
  () => {
    const registry = loadRegistry();

    const totals =
      registry.fixtures.reduce(
        (
          result,
          fixture,
        ) => ({
          namedInvitees:
            result.namedInvitees +
            fixture
              .namedInvitees
              .length,

          allocationObjects:
            result
              .allocationObjects +
            fixture
              .additionalGuestAllocations
              .length,

          allocationCapacity:
            result
              .allocationCapacity +
            sumAllocationCapacity(
              fixture,
            ),

          maximumAttendance:
            result.maximumAttendance +
            fixture.maximumAttendance,
        }),
        {
          namedInvitees: 0,
          allocationObjects: 0,
          allocationCapacity: 0,
          maximumAttendance: 0,
        },
      );

    assert.equal(
      totals.namedInvitees,
      27,
    );

    assert.equal(
      totals.allocationObjects,
      9,
    );

    assert.equal(
      totals.allocationCapacity,
      10,
    );

    assert.equal(
      totals.namedInvitees +
        totals.allocationCapacity,
      37,
    );

    assert.equal(
      totals.maximumAttendance,
      37,
    );
  },
);

test(
  "returns immutable fixture records, named-invitee records, allocation records, and registry structures",
  () => {
    const registry = loadRegistry();

    assert.equal(
      Object.isFrozen(
        registry,
      ),
      true,
    );

    assert.equal(
      Object.isFrozen(
        registry.fixtures,
      ),
      true,
    );

    assert.equal(
      Object.isFrozen(
        registry.fixtures[0],
      ),
      true,
    );

    assert.equal(
      Object.isFrozen(
        registry.fixtures[0]
          .namedInvitees,
      ),
      true,
    );

    assert.equal(
      Object.isFrozen(
        registry.fixtures[0]
          .namedInvitees[0],
      ),
      true,
    );

    assert.equal(
      Object.isFrozen(
        registry.byCanonicalCode
          .DEV002
          .additionalGuestAllocations,
      ),
      true,
    );

    assert.equal(
      Object.isFrozen(
        registry.byCanonicalCode
          .DEV002
          .additionalGuestAllocations[0],
      ),
      true,
    );

    assert.equal(
      Object.isFrozen(
        registry.byCanonicalCode,
      ),
      true,
    );
  },
);

test(
  "refuses to load development fixtures in production",
  () => {
    assert.throws(
      () =>
        loadDevelopmentInvitationFixtures({
          runtimeEnvironment:
            "production",
        }),
      /disabled outside development and test environments/,
    );
  },
);

test(
  "rejects an inconsistent display representation",
  () => {
    const registry =
      cloneRegistry();

    registry[0].inviteCodeDisplay =
      "BAD-000";

    withTemporaryFixtureFile(
      registry,
      (filePath) => {
        assert.throws(
          () =>
            loadDevelopmentInvitationFixtures({
              runtimeEnvironment:
                "test",
              filePath,
            }),
          /inconsistent code representations/,
        );
      },
    );
  },
);

test(
  "rejects duplicate canonical invitation codes",
  () => {
    const registry =
      cloneRegistry();

    registry.push({
      ...registry[0],

      namedInvitees:
        registry[0]
          .namedInvitees
          .map(
            (invitee) => ({
              ...invitee,
              id:
                "invitee-duplicate-code-test",
            }),
          ),

      partyId:
        "party-dev-duplicate-test",
    });

    withTemporaryFixtureFile(
      registry,
      (filePath) => {
        assert.throws(
          () =>
            loadDevelopmentInvitationFixtures({
              runtimeEnvironment:
                "test",
              filePath,
            }),
          /canonical-code collision/,
        );
      },
    );
  },
);

test(
  "rejects duplicate party identifiers",
  () => {
    const registry =
      cloneRegistry();

    registry[1].partyId =
      registry[0].partyId;

    withTemporaryFixtureFile(
      registry,
      (filePath) => {
        assert.throws(
          () =>
            loadDevelopmentInvitationFixtures({
              runtimeEnvironment:
                "test",
              filePath,
            }),
          /duplicates a party identifier/,
        );
      },
    );
  },
);

test(
  "rejects retired profile, allowance, and question-list fields",
  () => {
    const registry =
      cloneRegistry();

    registry[0]
      .questionProfile =
      "default";

    registry[0]
      .additionalGuestAllowance =
      0;

    registry[0].questionIds = [
      "eventAttendance",
    ];

    withTemporaryFixtureFile(
      registry,
      (filePath) => {
        assert.throws(
          () =>
            loadDevelopmentInvitationFixtures({
              runtimeEnvironment:
                "test",
              filePath,
            }),
          /fixture schema validation failed/,
        );
      },
    );
  },
);

test(
  "rejects a missing named-invitee roster",
  () => {
    const registry =
      cloneRegistry();

    delete registry[0]
      .namedInvitees;

    withTemporaryFixtureFile(
      registry,
      (filePath) => {
        assert.throws(
          () =>
            loadDevelopmentInvitationFixtures({
              runtimeEnvironment:
                "test",
              filePath,
            }),
          /fixture schema validation failed/,
        );
      },
    );
  },
);

test(
  "rejects an empty named-invitee roster",
  () => {
    const registry =
      cloneRegistry();

    registry[0].namedInvitees = [];

    withTemporaryFixtureFile(
      registry,
      (filePath) => {
        assert.throws(
          () =>
            loadDevelopmentInvitationFixtures({
              runtimeEnvironment:
                "test",
              filePath,
            }),
          /fixture schema validation failed/,
        );
      },
    );
  },
);

test(
  "rejects malformed named-invitee IDs",
  () => {
    const registry =
      cloneRegistry();

    registry[0]
      .namedInvitees[0]
      .id =
      "INVITEE DEV001 A";

    withTemporaryFixtureFile(
      registry,
      (filePath) => {
        assert.throws(
          () =>
            loadDevelopmentInvitationFixtures({
              runtimeEnvironment:
                "test",
              filePath,
            }),
          /fixture schema validation failed/,
        );
      },
    );
  },
);

test(
  "rejects blank named-invitee display names",
  () => {
    const registry =
      cloneRegistry();

    registry[0]
      .namedInvitees[0]
      .displayName = "";

    withTemporaryFixtureFile(
      registry,
      (filePath) => {
        assert.throws(
          () =>
            loadDevelopmentInvitationFixtures({
              runtimeEnvironment:
                "test",
              filePath,
            }),
          /fixture schema validation failed/,
        );
      },
    );
  },
);

test(
  "rejects duplicate named-invitee IDs within one invitation",
  () => {
    const registry =
      cloneRegistry();

    registry[1]
      .namedInvitees[1]
      .id =
      registry[1]
        .namedInvitees[0]
        .id;

    withTemporaryFixtureFile(
      registry,
      (filePath) => {
        assert.throws(
          () =>
            loadDevelopmentInvitationFixtures({
              runtimeEnvironment:
                "test",
              filePath,
            }),
          /fixture schema validation failed/,
        );
      },
    );
  },
);

test(
  "rejects duplicate allocation IDs within one invitation",
  () => {
    const registry =
      cloneRegistry();

    registry[8]
      .additionalGuestAllocations[1]
      .id =
      registry[8]
        .additionalGuestAllocations[0]
        .id;

    withTemporaryFixtureFile(
      registry,
      (filePath) => {
        assert.throws(
          () =>
            loadDevelopmentInvitationFixtures({
              runtimeEnvironment:
                "test",
              filePath,
            }),
          /fixture schema validation failed/,
        );
      },
    );
  },
);

test(
  "rejects a named-invitee identifier collision across invitations",
  () => {
    const registry =
      cloneRegistry();

    registry[1]
      .namedInvitees[0]
      .id =
      registry[0]
        .namedInvitees[0]
        .id;

    withTemporaryFixtureFile(
      registry,
      (filePath) => {
        assert.throws(
          () =>
            loadDevelopmentInvitationFixtures({
              runtimeEnvironment:
                "test",
              filePath,
            }),
          /duplicates an invitee\/allocation identifier/,
        );
      },
    );
  },
);

test(
  "rejects an allocation identifier collision across invitations",
  () => {
    const registry =
      cloneRegistry();

    registry[3]
      .additionalGuestAllocations[0]
      .id =
      registry[2]
        .additionalGuestAllocations[0]
        .id;

    withTemporaryFixtureFile(
      registry,
      (filePath) => {
        assert.throws(
          () =>
            loadDevelopmentInvitationFixtures({
              runtimeEnvironment:
                "test",
              filePath,
            }),
          /duplicates an invitee\/allocation identifier/,
        );
      },
    );
  },
);

test(
  "rejects malformed allocation IDs",
  () => {
    const registry =
      cloneRegistry();

    registry[2]
      .additionalGuestAllocations[0]
      .id =
      "PLUS1 DEV003 A";

    withTemporaryFixtureFile(
      registry,
      (filePath) => {
        assert.throws(
          () =>
            loadDevelopmentInvitationFixtures({
              runtimeEnvironment:
                "test",
              filePath,
            }),
          /fixture schema validation failed/,
        );
      },
    );
  },
);

test(
  "rejects an unsupported allocation kind",
  () => {
    const registry =
      cloneRegistry();

    registry[2]
      .additionalGuestAllocations[0]
      .kind =
      "guest";

    withTemporaryFixtureFile(
      registry,
      (filePath) => {
        assert.throws(
          () =>
            loadDevelopmentInvitationFixtures({
              runtimeEnvironment:
                "test",
              filePath,
            }),
          /fixture schema validation failed/,
        );
      },
    );
  },
);

test(
  "rejects a missing allocation kind",
  () => {
    const registry =
      cloneRegistry();

    delete registry[2]
      .additionalGuestAllocations[0]
      .kind;

    withTemporaryFixtureFile(
      registry,
      (filePath) => {
        assert.throws(
          () =>
            loadDevelopmentInvitationFixtures({
              runtimeEnvironment:
                "test",
              filePath,
            }),
          /fixture schema validation failed/,
        );
      },
    );
  },
);

test(
  "rejects a missing maximumCount",
  () => {
    const registry =
      cloneRegistry();

    delete registry[2]
      .additionalGuestAllocations[0]
      .maximumCount;

    withTemporaryFixtureFile(
      registry,
      (filePath) => {
        assert.throws(
          () =>
            loadDevelopmentInvitationFixtures({
              runtimeEnvironment:
                "test",
              filePath,
            }),
          /fixture schema validation failed/,
        );
      },
    );
  },
);

test(
  "rejects zero, negative, and fractional maximumCount values",
  () => {
    for (
      const invalidMaximumCount of [
        0,
        -1,
        1.5,
      ]
    ) {
      const registry =
        cloneRegistry();

      registry[2]
        .additionalGuestAllocations[0]
        .maximumCount =
        invalidMaximumCount;

      withTemporaryFixtureFile(
        registry,
        (filePath) => {
          assert.throws(
            () =>
              loadDevelopmentInvitationFixtures({
                runtimeEnvironment:
                  "test",
                filePath,
              }),
            /fixture schema validation failed/,
          );
        },
      );
    }
  },
);

test(
  "rejects a Plus1 allocation whose maximumCount is not one",
  () => {
    const registry =
      cloneRegistry();

    registry[2]
      .additionalGuestAllocations[0]
      .maximumCount = 2;

    registry[2]
      .maximumAttendance = 3;

    withTemporaryFixtureFile(
      registry,
      (filePath) => {
        assert.throws(
          () =>
            loadDevelopmentInvitationFixtures({
              runtimeEnvironment:
                "test",
              filePath,
            }),
          /fixture schema validation failed/,
        );
      },
    );
  },
);

test(
  "rejects a Plus1 allocation whose ID does not use the Plus1 namespace",
  () => {
    const registry =
      cloneRegistry();

    registry[2]
      .additionalGuestAllocations[0]
      .id =
      "allocation-dev003-a";

    withTemporaryFixtureFile(
      registry,
      (filePath) => {
        assert.throws(
          () =>
            loadDevelopmentInvitationFixtures({
              runtimeEnvironment:
                "test",
              filePath,
            }),
          /fixture schema validation failed/,
        );
      },
    );
  },
);

test(
  "rejects malformed Plus1 prompts",
  () => {
    const registry =
      cloneRegistry();

    registry[2]
      .additionalGuestAllocations[0]
      .prompt =
      "How many additional guests?";

    withTemporaryFixtureFile(
      registry,
      (filePath) => {
        assert.throws(
          () =>
            loadDevelopmentInvitationFixtures({
              runtimeEnvironment:
                "test",
              filePath,
            }),
          /fixture schema validation failed/,
        );
      },
    );
  },
);

test(
  "rejects grouped unnamed-children allocations that do not use the approved family prompt",
  () => {
    const registry =
      cloneRegistry();

    registry[1]
      .additionalGuestAllocations[0]
      .prompt =
      "Will invited child 1 be attending?";

    withTemporaryFixtureFile(
      registry,
      (filePath) => {
        assert.throws(
          () =>
            loadDevelopmentInvitationFixtures({
              runtimeEnvironment:
                "test",
              filePath,
            }),
          /fixture schema validation failed/,
        );
      },
    );
  },
);

test(
  "rejects a grouped unnamed-children allocation that uses the Plus1 ID namespace",
  () => {
    const registry =
      cloneRegistry();

    registry[1]
      .additionalGuestAllocations[0]
      .id =
      "plus1-dev002-a";

    withTemporaryFixtureFile(
      registry,
      (filePath) => {
        assert.throws(
          () =>
            loadDevelopmentInvitationFixtures({
              runtimeEnvironment:
                "test",
              filePath,
            }),
          /fixture schema validation failed/,
        );
      },
    );
  },
);

test(
  "accepts the children- namespace for a grouped unnamed-children allocation",
  () => {
    const registry =
      cloneRegistry();

    registry[1]
      .additionalGuestAllocations[0]
      .id =
      "children-dev002-a";

    withTemporaryFixtureFile(
      registry,
      (filePath) => {
        const loaded =
          loadDevelopmentInvitationFixtures({
            runtimeEnvironment:
              "test",
            filePath,
          });

        assert.equal(
          loaded.byCanonicalCode
            .DEV002
            .additionalGuestAllocations[0]
            .id,
          "children-dev002-a",
        );
      },
    );
  },
);

test(
  "rejects more than one grouped unnamed-children allocation on one invitation",
  () => {
    const registry =
      cloneRegistry();

    registry[1]
      .additionalGuestAllocations
      .push({
        id:
          "children-dev002-b",
        kind:
          "unnamedChildren",
        prompt:
          GROUPED_CHILD_PROMPT,
        maximumCount: 1,
      });

    registry[1]
      .maximumAttendance = 6;

    withTemporaryFixtureFile(
      registry,
      (filePath) => {
        assert.throws(
          () =>
            loadDevelopmentInvitationFixtures({
              runtimeEnvironment:
                "test",
              filePath,
            }),
          /fixture schema validation failed/,
        );
      },
    );
  },
);

test(
  "rejects a maximum-attendance value that does not equal named invitees plus summed allocation maximumCount",
  () => {
    const registry =
      cloneRegistry();

    registry[1]
      .maximumAttendance = 4;

    withTemporaryFixtureFile(
      registry,
      (filePath) => {
        assert.throws(
          () =>
            loadDevelopmentInvitationFixtures({
              runtimeEnvironment:
                "test",
              filePath,
            }),
          /fixture schema validation failed/,
        );
      },
    );
  },
);

test(
  "rejects an added named invitee when maximum attendance is not increased",
  () => {
    const registry =
      cloneRegistry();

    registry[0]
      .namedInvitees
      .push({
        id:
          "invitee-dev001-b",
        displayName:
          "Unexpected Extra Invitee",
      });

    withTemporaryFixtureFile(
      registry,
      (filePath) => {
        assert.throws(
          () =>
            loadDevelopmentInvitationFixtures({
              runtimeEnvironment:
                "test",
              filePath,
            }),
          /fixture schema validation failed/,
        );
      },
    );
  },
);

test(
  "rejects a removed authorized Plus1 allocation when maximum attendance is not reduced",
  () => {
    const registry =
      cloneRegistry();

    registry[2]
      .additionalGuestAllocations = [];

    withTemporaryFixtureFile(
      registry,
      (filePath) => {
        assert.throws(
          () =>
            loadDevelopmentInvitationFixtures({
              runtimeEnvironment:
                "test",
              filePath,
            }),
          /fixture schema validation failed/,
        );
      },
    );
  },
);

test(
  "rejects a reduced grouped-child maximumCount when maximum attendance is not reduced",
  () => {
    const registry =
      cloneRegistry();

    registry[1]
      .additionalGuestAllocations[0]
      .maximumCount = 1;

    withTemporaryFixtureFile(
      registry,
      (filePath) => {
        assert.throws(
          () =>
            loadDevelopmentInvitationFixtures({
              runtimeEnvironment:
                "test",
              filePath,
            }),
          /fixture schema validation failed/,
        );
      },
    );
  },
);

test(
  "rejects fixtures that are not explicitly development environment records",
  () => {
    const registry =
      cloneRegistry();

    registry[0].environment =
      "production";

    withTemporaryFixtureFile(
      registry,
      (filePath) => {
        assert.throws(
          () =>
            loadDevelopmentInvitationFixtures({
              runtimeEnvironment:
                "test",
              filePath,
            }),
          /fixture schema validation failed/,
        );
      },
    );
  },
);

test(
  "reports fixture-load failure for unreadable or invalid JSON input",
  () => {
    assert.throws(
      () =>
        loadDevelopmentInvitationFixtures({
          runtimeEnvironment:
            "test",
          filePath:
            path.join(
              os.tmpdir(),
              "definitely-missing-wedding-fixtures.json",
            ),
        }),
      /Unable to load development invitation fixtures/,
    );

    const directory =
      fs.mkdtempSync(
        path.join(
          os.tmpdir(),
          "wedding-rsvp-invalid-json-",
        ),
      );

    const filePath =
      path.join(
        directory,
        "fixtures.json",
      );

    try {
      fs.writeFileSync(
        filePath,
        "{not valid json",
        "utf8",
      );

      assert.throws(
        () =>
          loadDevelopmentInvitationFixtures({
            runtimeEnvironment:
              "test",
            filePath,
          }),
        /Unable to load development invitation fixtures/,
      );
    } finally {
      fs.rmSync(
        directory,
        {
          recursive: true,
          force: true,
        },
      );
    }
  },
);
