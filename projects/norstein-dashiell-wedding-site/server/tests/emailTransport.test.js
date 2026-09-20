const test = require("node:test");
const assert = require("node:assert/strict");

const {
  assertEmailTransport,
  normalizeTransportStatus,
} = require("../src/services/emailTransport");

test(
  "email transport contract requires sendEmail",
  () => {
    assert.throws(
      () =>
        assertEmailTransport(
          {},
        ),
      /sendEmail/,
    );

    const transport = {
      async sendEmail() {},
    };

    assert.equal(
      assertEmailTransport(
        transport,
      ),
      transport,
    );
  },
);

test(
  "email transport status normalization accepts documented delivery states",
  () => {
    for (
      const status of [
        "sent",
        "failed",
        "uncertain",
      ]
    ) {
      assert.equal(
        normalizeTransportStatus(
          status,
        ),
        status,
      );

      assert.equal(
        normalizeTransportStatus({
          status,
        }),
        status,
      );
    }
  },
);

test(
  "unknown email transport results become uncertain",
  () => {
    for (
      const result of [
        undefined,
        null,
        {},
        {
          status: "queued",
        },
      ]
    ) {
      assert.equal(
        normalizeTransportStatus(
          result,
        ),
        "uncertain",
      );
    }
  },
);
