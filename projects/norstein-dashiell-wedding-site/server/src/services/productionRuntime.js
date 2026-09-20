const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");

const {
  PROJECT_PUBLIC_ORIGIN,
  PROJECT_RSVP_FROM_EMAIL,
  PROJECT_RSVP_FROM_NAME,
  PROJECT_RSVP_REPLY_TO_EMAIL,
} = require("../config/env");
const {
  parseTrustProxySetting,
} = require("../config/trustProxy");

const PRODUCTION_SMOKE_ACK =
  "RUN_READ_ONLY_PRODUCTION_SMOKE";

function defaultWriterLockFile() {
  return path.join(
    os.tmpdir(),
    "norstein-dashiell-wedding-rsvp-writer.lock",
  );
}

function assertProductionRuntimeEnvironment(
  environment,
) {
  if (
    !environment ||
    environment.NODE_ENV !==
      "production"
  ) {
    throw new Error(
      "Production runtime verification requires production environment configuration.",
    );
  }

  if (
    environment.ALLOWED_ORIGIN !==
      PROJECT_PUBLIC_ORIGIN
  ) {
    throw new Error(
      "Production runtime origin configuration is invalid.",
    );
  }

  if (
    environment.EMAIL_PROVIDER !==
      "resend" ||
    environment.RSVP_FROM_NAME !==
      PROJECT_RSVP_FROM_NAME ||
    environment.RSVP_FROM_EMAIL !==
      PROJECT_RSVP_FROM_EMAIL ||
    environment.RSVP_REPLY_TO_EMAIL !==
      PROJECT_RSVP_REPLY_TO_EMAIL
  ) {
    throw new Error(
      "Production runtime email identity is invalid.",
    );
  }

  if (
    environment.RSVP_SMS_ENABLED !==
      false
  ) {
    throw new Error(
      "Production runtime requires SMS to remain disabled.",
    );
  }

  if (
    environment
      .RSVP_WRITER_INSTANCE_COUNT !==
      1
  ) {
    throw new Error(
      "Production runtime requires exactly one mutation-capable writer instance.",
    );
  }

  parseTrustProxySetting(
    environment.TRUST_PROXY,
  );

  return true;
}

function validateProductionSmokeInvocation({
  environment,
  inviteCode,
  acknowledgement,
} = {}) {
  assertProductionRuntimeEnvironment(
    environment,
  );

  if (
    typeof inviteCode !== "string" ||
    inviteCode.trim() === ""
  ) {
    throw new Error(
      "Production runtime smoke test requires an explicit invitation code.",
    );
  }

  if (
    acknowledgement !==
      PRODUCTION_SMOKE_ACK
  ) {
    throw new Error(
      "Production runtime smoke test requires explicit operator acknowledgement.",
    );
  }

  return Object.freeze({
    inviteCode:
      inviteCode.trim(),
  });
}

async function acquireProductionWriterLock({
  lockFile,
  pid = process.pid,
} = {}) {
  const resolved =
    path.resolve(
      lockFile ||
        defaultWriterLockFile(),
    );

  await fs.mkdir(
    path.dirname(resolved),
    {
      recursive: true,
    },
  );

  let handle;

  try {
    handle =
      await fs.open(
        resolved,
        "wx",
        0o600,
      );

    await handle.writeFile(
      `${JSON.stringify({
        pid,
        createdAt:
          new Date().toISOString(),
      })}\n`,
      "utf8",
    );
  } catch (error) {
    if (handle) {
      await handle.close().catch(
        () => {},
      );
    }

    if (
      error &&
      error.code === "EEXIST"
    ) {
      throw new Error(
        "Production RSVP writer lock is already held or requires operator recovery.",
      );
    }

    throw new Error(
      "Production RSVP writer lock could not be acquired.",
    );
  }

  let released = false;

  return Object.freeze({
    path: resolved,

    async release() {
      if (released) {
        return;
      }

      released = true;

      await handle.close();

      try {
        await fs.unlink(
          resolved,
        );
      } catch (error) {
        if (
          !error ||
          error.code !== "ENOENT"
        ) {
          throw new Error(
            "Production RSVP writer lock could not be released cleanly.",
          );
        }
      }
    },
  });
}

module.exports = {
  PRODUCTION_SMOKE_ACK,
  acquireProductionWriterLock,
  assertProductionRuntimeEnvironment,
  defaultWriterLockFile,
  validateProductionSmokeInvocation,
};
