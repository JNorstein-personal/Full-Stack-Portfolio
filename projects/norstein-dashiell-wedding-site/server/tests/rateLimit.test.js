const test = require("node:test");
const assert = require("node:assert/strict");

const {
  RATE_LIMITED_RESPONSE,
  createRollingWindowLimiter,
  normalizedInvitationKey,
} = require("../src/middleware/rateLimit");

function createResponse() {
  const headers =
    new Map();

  return {
    statusCode: 200,
    payload: undefined,

    set(name, value) {
      headers.set(
        name.toLowerCase(),
        String(value),
      );
      return this;
    },

    status(code) {
      this.statusCode = code;
      return this;
    },

    json(payload) {
      this.payload = payload;
      return this;
    },

    get(name) {
      return headers.get(
        name.toLowerCase(),
      );
    },
  };
}

function invoke(
  limiter,
  req,
) {
  const res =
    createResponse();
  let nextCalled = false;
  let nextError;

  limiter(
    req,
    res,
    (error) => {
      nextCalled = true;
      nextError = error;
    },
  );

  return {
    res,
    nextCalled,
    nextError,
  };
}

test(
  "rolling-window limiter expires individual requests as they leave the active window",
  () => {
    let current = 0;

    const limiter =
      createRollingWindowLimiter({
        limit: 2,
        windowMs: 1000,
        keyGenerator:
          () => "client",
        now: () => current,
      });

    assert.equal(
      invoke(limiter, {})
        .nextCalled,
      true,
    );

    current = 500;

    assert.equal(
      invoke(limiter, {})
        .nextCalled,
      true,
    );

    current = 900;

    const limited =
      invoke(limiter, {});

    assert.equal(
      limited.nextCalled,
      false,
    );
    assert.equal(
      limited.res.statusCode,
      429,
    );
    assert.deepEqual(
      limited.res.payload,
      RATE_LIMITED_RESPONSE,
    );
    assert.equal(
      limited.res.get(
        "retry-after",
      ),
      "1",
    );

    current = 1000;

    assert.equal(
      invoke(limiter, {})
        .nextCalled,
      true,
    );
  },
);

test(
  "rolling-window limiter skips requests without an applicable key",
  () => {
    const limiter =
      createRollingWindowLimiter({
        limit: 1,
        keyGenerator:
          () => null,
      });

    for (
      let index = 0;
      index < 3;
      index += 1
    ) {
      assert.equal(
        invoke(
          limiter,
          {},
        ).nextCalled,
        true,
      );
    }
  },
);

test(
  "submission invitation key uses the authoritative normalization result",
  () => {
    for (
      const inviteCode of [
        "DEV-002",
        "dev002",
        " D E V - 0 0 2 ",
      ]
    ) {
      assert.equal(
        normalizedInvitationKey({
          body: {
            inviteCode,
          },
        }),
        "DEV002",
      );
    }

    assert.equal(
      normalizedInvitationKey({
        body: {
          inviteCode:
            "invalid/code",
        },
      }),
      null,
    );
  },
);
