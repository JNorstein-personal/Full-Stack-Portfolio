require("dotenv").config();

const {
  loadEnvironment,
} = require("./config/env");
const {
  createApp,
} = require("./app");
const {
  createConfiguredEmailTransport,
} = require("./services/resendEmailTransport");
const {
  acquireProductionWriterLock,
  assertProductionRuntimeEnvironment,
} = require("./services/productionRuntime");

async function main() {
  const environment =
    loadEnvironment();

  let writerLock;

  if (
    environment.NODE_ENV ===
      "production"
  ) {
    assertProductionRuntimeEnvironment(
      environment,
    );

    writerLock =
      await acquireProductionWriterLock({
        lockFile:
          environment
            .RSVP_SINGLE_WRITER_LOCK_FILE,
      });
  }

  try {
    const emailTransport =
      createConfiguredEmailTransport({
        environment,
      });

    const app = createApp({
      environment,
      emailTransport,
    });

    const server = app.listen(
      environment.PORT,
      environment.HOST,
      () => {
        console.log(
          `Wedding website API listening on ${environment.HOST}:${environment.PORT}`,
        );
      },
    );

    let shuttingDown = false;

    async function shutdown() {
      if (shuttingDown) {
        return;
      }

      shuttingDown = true;

      await new Promise(
        (resolve) => {
          server.close(
            () => resolve(),
          );
        },
      );

      if (writerLock) {
        await writerLock.release();
      }
    }

    process.once(
      "SIGINT",
      () => {
        shutdown()
          .finally(() =>
            process.exit(0),
          );
      },
    );

    process.once(
      "SIGTERM",
      () => {
        shutdown()
          .finally(() =>
            process.exit(0),
          );
      },
    );

    server.once(
      "error",
      async () => {
        if (writerLock) {
          await writerLock
            .release()
            .catch(() => {});
        }
      },
    );
  } catch (error) {
    if (writerLock) {
      await writerLock
        .release()
        .catch(() => {});
    }

    throw error;
  }
}

main().catch(() => {
  console.error(
    "Wedding website API startup: FAIL",
  );
  process.exitCode = 1;
});
