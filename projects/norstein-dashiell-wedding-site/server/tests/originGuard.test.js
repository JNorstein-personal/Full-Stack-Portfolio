const test = require("node:test");
const assert = require("node:assert/strict");

const {
  ORIGIN_FORBIDDEN_RESPONSE,
  createRsvpOriginGuard,
} = require(
  "../src/middleware/originGuard"
);

function responseFixture() {
  const state = {
    headers: {},
    status: null,
    body: null,
  };

  const res = {
    set(name, value) {
      state.headers[
        name.toLowerCase()
      ] = value;
      return res;
    },
    status(value) {
      state.status = value;
      return res;
    },
    json(value) {
      state.body = value;
      return res;
    },
  };

  return {
    res,
    state,
  };
}

test(
  "production RSVP origin guard accepts the canonical production origin",
  () => {
    const guard =
      createRsvpOriginGuard({
        environment: {
          NODE_ENV:
            "production",
          ALLOWED_ORIGIN:
            "https://www.loreweavercreations.com",
        },
      });

    let nextCount = 0;

    guard(
      {
        get() {
          return "https://www.loreweavercreations.com";
        },
      },
      responseFixture().res,
      () => {
        nextCount += 1;
      },
    );

    assert.equal(
      nextCount,
      1,
    );
  },
);

test(
  "production RSVP origin guard rejects a mismatched browser origin with no-store 403",
  () => {
    const guard =
      createRsvpOriginGuard({
        environment: {
          NODE_ENV:
            "production",
          ALLOWED_ORIGIN:
            "https://www.loreweavercreations.com",
        },
      });
    const {
      res,
      state,
    } =
      responseFixture();

    let nextCount = 0;

    guard(
      {
        get() {
          return "https://example.com";
        },
      },
      res,
      () => {
        nextCount += 1;
      },
    );

    assert.equal(
      nextCount,
      0,
    );
    assert.equal(
      state.status,
      403,
    );
    assert.equal(
      state.headers[
        "cache-control"
      ],
      "no-store, max-age=0",
    );
    assert.deepEqual(
      state.body,
      ORIGIN_FORBIDDEN_RESPONSE,
    );
  },
);

test(
  "origin guard remains transparent outside production and permits originless maintenance requests",
  () => {
    for (
      const environment of [
        {
          NODE_ENV: "test",
        },
        {
          NODE_ENV:
            "production",
          ALLOWED_ORIGIN:
            "https://www.loreweavercreations.com",
        },
      ]
    ) {
      const guard =
        createRsvpOriginGuard({
          environment,
        });
      let nextCount = 0;

      guard(
        {
          get() {
            return undefined;
          },
        },
        responseFixture().res,
        () => {
          nextCount += 1;
        },
      );

      assert.equal(
        nextCount,
        1,
      );
    }
  },
);
