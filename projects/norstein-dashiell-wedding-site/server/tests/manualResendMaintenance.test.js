const test = require("node:test");
const assert = require("node:assert/strict");

const {
  MANUAL_RESEND_ACK,
  validateManualResendInvocation,
} = require(
  "../src/services/manualResendMaintenance"
);

function environment(
  overrides = {},
) {
  return {
    NODE_ENV: "production",
    ...overrides,
  };
}

test(
  "manual resend maintenance accepts only an explicit production invocation",
  () => {
    assert.deepEqual(
      validateManualResendInvocation({
        environment:
          environment(),
        inviteCode:
          " ABC-123 ",
        acknowledgement:
          MANUAL_RESEND_ACK,
      }),
      {
        inviteCode:
          "ABC-123",
      },
    );
  },
);

test(
  "manual resend maintenance refuses non-production mode",
  () => {
    assert.throws(
      () =>
        validateManualResendInvocation({
          environment:
            environment({
              NODE_ENV:
                "development",
            }),
          inviteCode:
            "ABC-123",
          acknowledgement:
            MANUAL_RESEND_ACK,
        }),
      /only in production mode/,
    );
  },
);

test(
  "manual resend maintenance requires a code and exact acknowledgement",
  () => {
    assert.throws(
      () =>
        validateManualResendInvocation({
          environment:
            environment(),
          inviteCode: "",
          acknowledgement:
            MANUAL_RESEND_ACK,
        }),
      /invitation code/,
    );

    assert.throws(
      () =>
        validateManualResendInvocation({
          environment:
            environment(),
          inviteCode:
            "ABC-123",
          acknowledgement:
            "RESEND",
        }),
      /operator acknowledgement/,
    );
  },
);
