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

function loadRegistry() {
  return loadDevelopmentInvitationFixtures({
    runtimeEnvironment: "test",
  });
}

function cloneRegistry() {
  return loadRegistry().fixtures.map(
    (fixture) => ({
      ...fixture,

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
      JSON.stringify(data, null, 2),
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
      const fixture of registry.fixtures
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
      const fixture of registry.fixtures
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
  "preserves the governing maximum-attendance and Plus1-allocation archetypes",
  () => {
    const registry = loadRegistry();

    const expected = {
      DEV001: [1, 0],
      DEV002: [5, 0],
      DEV003: [2, 1],
      DEV004: [4, 1],
      DEV005: [4, 0],
      DEV006: [2, 1],
      DEV007: [3, 0],
      DEV008: [3, 0],
      DEV009: [7, 3],
      DEV010: [4, 1],
      DEV999: [2, 1],
    };

    for (
      const [
        inviteCode,
        [
          maximumAttendance,
          allocationCount,
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
        fixture
          .additionalGuestAllocations
          .length,
        allocationCount,
      );
    }
  },
);

test(
  "preserves the governing named Plus1 prompts and stable allocation IDs",
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
        },
        {
          id: "plus1-dev009-b",
          prompt:
            "Will Example Adult Two be accompanied by a +1?",
        },
        {
          id: "plus1-dev009-c",
          prompt:
            "Will Example Adult Three be accompanied by a +1?",
        },
      ],
    );
  },
);

test(
  "contains eight total Plus1 allocation objects across the governing fixtures",
  () => {
    const registry = loadRegistry();

    const totalAllocations =
      registry.fixtures.reduce(
        (
          total,
          fixture,
        ) =>
          total +
          fixture
            .additionalGuestAllocations
            .length,
        0,
      );

    assert.equal(
      totalAllocations,
      8,
    );
  },
);

test(
  "returns immutable fixture records, allocation records, and registry structures",
  () => {
    const registry = loadRegistry();

    assert.equal(
      Object.isFrozen(registry),
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
        registry.fixtures[2]
          .additionalGuestAllocations,
      ),
      true,
    );

    assert.equal(
      Object.isFrozen(
        registry.fixtures[2]
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

    registry[0].questionProfile =
      "default";

    registry[0].additionalGuestAllowance =
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
  "rejects an allocation-ID collision across different invitations",
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
          /duplicates an additional-guest allocation identifier/,
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
  "rejects allocations that consume the invitation's entire maximum attendance",
  () => {
    const registry =
      cloneRegistry();

    registry[2].maximumAttendance =
      1;

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

    const directory = fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "wedding-rsvp-invalid-json-",
      ),
    );

    const filePath = path.join(
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
