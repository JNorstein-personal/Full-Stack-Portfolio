const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");

const {
  parseEnvironment,
} = require("../src/config/env");
const {
  PRODUCTION_SMOKE_ACK,
  acquireProductionWriterLock,
  assertProductionRuntimeEnvironment,
  validateProductionSmokeInvocation,
} = require("../src/services/productionRuntime");

function productionEnvironment(
  overrides = {},
) {
  return parseEnvironment({
    NODE_ENV: "production",
    HOST: "127.0.0.1",
    PORT: "3001",
    SITE_BASE_PATH:
      "/wedding",
    GOOGLE_SPREADSHEET_ID:
      "fictional-sheet",
    RSVP_DEADLINE:
      "2027-03-01T23:59:00-05:00",
    RSVP_TIME_ZONE:
      "America/New_York",
    RSVP_ADMIN_NOTIFICATION_EMAIL:
      "admin@example.com",
    EMAIL_PROVIDER: "resend",
    RESEND_API_KEY:
      "re_fictional_key",
    RSVP_FROM_NAME:
      "Norstein-Dashiell Wedding",
    RSVP_FROM_EMAIL:
      "confirm@rsvp.loreweavercreations.com",
    RSVP_REPLY_TO_EMAIL:
      "RSVPhelp@loreweavercreations.com",
    RSVP_WRITER_INSTANCE_COUNT:
      "1",
    RSVP_SMS_ENABLED:
      "false",
    ALLOWED_ORIGIN:
      "https://www.loreweavercreations.com",
    TRUST_PROXY: "1",
    ...overrides,
  });
}

test(
  "production runtime accepts the approved single-writer production configuration",
  () => {
    assert.equal(
      assertProductionRuntimeEnvironment(
        productionEnvironment(),
      ),
      true,
    );
  },
);

test(
  "production smoke invocation requires explicit code and acknowledgement",
  () => {
    const environment =
      productionEnvironment();

    assert.deepEqual(
      validateProductionSmokeInvocation({
        environment,
        inviteCode:
          " ABC-123 ",
        acknowledgement:
          PRODUCTION_SMOKE_ACK,
      }),
      {
        inviteCode:
          "ABC-123",
      },
    );

    assert.throws(
      () =>
        validateProductionSmokeInvocation({
          environment,
          inviteCode: "",
          acknowledgement:
            PRODUCTION_SMOKE_ACK,
        }),
      /invitation code/,
    );

    assert.throws(
      () =>
        validateProductionSmokeInvocation({
          environment,
          inviteCode:
            "ABC-123",
          acknowledgement:
            "RUN",
        }),
      /acknowledgement/,
    );
  },
);

test(
  "production writer lock excludes a second local writer until released",
  async () => {
    const directory =
      await fs.mkdtemp(
        path.join(
          os.tmpdir(),
          "wedding-writer-lock-",
        ),
      );
    const lockFile =
      path.join(
        directory,
        "writer.lock",
      );

    try {
      const first =
        await acquireProductionWriterLock({
          lockFile,
          pid: 111,
        });

      await assert.rejects(
        () =>
          acquireProductionWriterLock({
            lockFile,
            pid: 222,
          }),
        /already held/,
      );

      await first.release();

      const second =
        await acquireProductionWriterLock({
          lockFile,
          pid: 222,
        });

      await second.release();
    } finally {
      await fs.rm(
        directory,
        {
          recursive: true,
          force: true,
        },
      );
    }
  },
);
