const test = require("node:test");
const assert = require("node:assert/strict");

const {
  normalizeInvitationCode,
} = require("../src/rsvp/invitationCode");

const acceptedCases = [
  ["A1B-C2D", "A1BC2D", "A1B-C2D"],
  ["a1b-c2d", "A1BC2D", "A1B-C2D"],
  ["A1BC2D", "A1BC2D", "A1B-C2D"],
  ["a1b c2d", "A1BC2D", "A1B-C2D"],
  [" A1B-C2D ", "A1BC2D", "A1B-C2D"],
  ["A 1 B - C 2 D", "A1BC2D", "A1B-C2D"],
];

for (
  const [
    receivedValue,
    canonicalCode,
    displayCode,
  ] of acceptedCases
) {
  test(
    `normalizes accepted value ${JSON.stringify(receivedValue)}`,
    () => {
      assert.deepEqual(
        normalizeInvitationCode(receivedValue),
        {
          canonicalCode,
          displayCode,
        },
      );
    },
  );
}

const rejectedCases = [
  ["underscore", "A1B_C2D"],
  ["too short", "A1B-C2"],
  ["too long", "A1B-C2D4"],
  ["en dash", "A1B–C2D"],
  ["em dash", "A1B—C2D"],
  ["internal tab", "A1B\tC2D"],
  ["internal newline", "A1B\nC2D"],
  ["internal nonbreaking space", "A1B\u00A0C2D"],
  ["slash", "A1B/C2D"],
  ["empty input", ""],
  ["whitespace only", "   "],
  ["non-ASCII letter", "A1B-C2É"],
];

for (const [name, receivedValue] of rejectedCases) {
  test(
    `rejects ${name}`,
    () => {
      assert.equal(
        normalizeInvitationCode(receivedValue),
        null,
      );
    },
  );
}

test(
  "removes only ordinary ASCII internal spaces",
  () => {
    assert.deepEqual(
      normalizeInvitationCode(
        " A 1 B - C 2 D ",
      ),
      {
        canonicalCode: "A1BC2D",
        displayCode: "A1B-C2D",
      },
    );

    assert.equal(
      normalizeInvitationCode(
        "A1B\tC2D",
      ),
      null,
    );
  },
);

test(
  "accepts a numeric six-character value after string conversion",
  () => {
    assert.deepEqual(
      normalizeInvitationCode(123456),
      {
        canonicalCode: "123456",
        displayCode: "123-456",
      },
    );
  },
);

test(
  "does not return a partial canonical result for malformed input",
  () => {
    const result =
      normalizeInvitationCode("A1B_C2D");

    assert.equal(result, null);
  },
);

test(
  "returns an immutable normalized result",
  () => {
    const result =
      normalizeInvitationCode("A1B-C2D");

    assert.equal(
      Object.isFrozen(result),
      true,
    );
  },
);