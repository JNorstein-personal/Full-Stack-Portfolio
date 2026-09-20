const test = require("node:test");
const assert = require("node:assert/strict");

const {
  parseTrustProxySetting,
} = require("../src/config/trustProxy");

test(
  "trusted proxy parser defaults to no forwarded-address trust",
  () => {
    assert.equal(
      parseTrustProxySetting(
        undefined,
      ),
      false,
    );
    assert.equal(
      parseTrustProxySetting(""),
      false,
    );
  },
);

test(
  "trusted proxy parser accepts bounded hop counts and explicit proxy lists",
  () => {
    assert.equal(
      parseTrustProxySetting("1"),
      1,
    );

    assert.deepEqual(
      parseTrustProxySetting(
        "127.0.0.1, ::1",
      ),
      [
        "127.0.0.1",
        "::1",
      ],
    );
  },
);

test(
  "trusted proxy parser rejects blanket trust and invalid hop counts",
  () => {
    for (
      const value of [
        "true",
        "*",
        "0",
        "11",
      ]
    ) {
      assert.throws(
        () =>
          parseTrustProxySetting(
            value,
          ),
        /TRUST_PROXY/,
      );
    }
  },
);
