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
        .DEV004
        .questionProfile,
      "reduced-attendance-dietary",
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
  "preserves the governing profile and allowance archetypes",
  () => {
    const registry = loadRegistry();

    const expected = {
      DEV001: ["default", 1, 0],
      DEV002: ["default", 5, 1],
      DEV003: ["default", 7, 3],
      DEV004: [
        "reduced-attendance-dietary",
        2,
        0,
      ],
      DEV005: ["default", 4, 0],
      DEV006: ["default", 2, 1],
      DEV007: ["default", 3, 0],
      DEV008: ["default", 3, 0],
      DEV009: ["default", 4, 1],
      DEV010: ["default", 4, 1],
      DEV999: ["default", 2, 1],
    };

    for (
      const [
        inviteCode,
        [
          questionProfile,
          maximumAttendance,
          additionalGuestAllowance,
        ],
      ] of Object.entries(expected)
    ) {
      const fixture =
        registry.byCanonicalCode[
          inviteCode
        ];

      assert.equal(
        fixture.questionProfile,
        questionProfile,
      );

      assert.equal(
        fixture.maximumAttendance,
        maximumAttendance,
      );

      assert.equal(
        fixture.additionalGuestAllowance,
        additionalGuestAllowance,
      );
    }
  },
);

test(
  "returns immutable fixture records and registry structures",
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
        registry.fixtures[0]
          .questionIds,
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
      loadRegistry().fixtures.map(
        (fixture) => ({
          ...fixture,
          questionIds: [
            ...fixture.questionIds,
          ],
        }),
      );

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
      loadRegistry().fixtures.map(
        (fixture) => ({
          ...fixture,
          questionIds: [
            ...fixture.questionIds,
          ],
        }),
      );

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
      loadRegistry().fixtures.map(
        (fixture) => ({
          ...fixture,
          questionIds: [
            ...fixture.questionIds,
          ],
        }),
      );

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
  "rejects profile and question-list disagreement",
  () => {
    const registry =
      loadRegistry().fixtures.map(
        (fixture) => ({
          ...fixture,
          questionIds: [
            ...fixture.questionIds,
          ],
        }),
      );

    registry[0].questionIds.push(
      "additionalGuestAttendance",
    );

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
          /question IDs inconsistent/,
        );
      },
    );
  },
);

test(
  "rejects a reduced profile with an additional-guest allowance",
  () => {
    const registry =
      loadRegistry().fixtures.map(
        (fixture) => ({
          ...fixture,
          questionIds: [
            ...fixture.questionIds,
          ],
        }),
      );

    const reduced =
      registry.find(
        (fixture) =>
          fixture.questionProfile ===
          "reduced-attendance-dietary",
      );

    reduced.additionalGuestAllowance = 1;

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
          /unauthorized additional-guest allowance/,
        );
      },
    );
  },
);