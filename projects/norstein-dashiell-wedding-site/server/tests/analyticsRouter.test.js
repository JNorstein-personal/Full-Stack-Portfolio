const test = require("node:test");
const assert = require("node:assert/strict");
const express = require("express");
const { once } = require("node:events");

const {
  createAnalyticsRouter,
} = require(
  "../src/routes/analytics",
);

async function withServer(
  analyticsStore,
  callback,
) {
  const app = express();

  app.use(
    express.json({
      limit: "1kb",
    }),
  );

  app.use(
    "/wedding/api/analytics",
    createAnalyticsRouter({
      analyticsStore,
    }),
  );

  const server =
    app.listen(
      0,
      "127.0.0.1",
    );

  await once(
    server,
    "listening",
  );

  try {
    const address =
      server.address();

    await callback(
      `http://127.0.0.1:${address.port}`,
    );
  } finally {
    await new Promise(
      (resolve) =>
        server.close(resolve),
    );
  }
}

test(
  "analytics endpoint stores only a validated aggregate delta and returns no content",
  async () => {
    const received = [];

    await withServer(
      {
        async applyDelta(
          delta,
        ) {
          received.push(delta);
        },
      },
      async (baseUrl) => {
        const response =
          await fetch(
            `${baseUrl}/wedding/api/analytics`,
            {
              method: "POST",
              headers: {
                "content-type":
                  "application/json",
              },
              body: JSON.stringify({
                pagePath:
                  "/wedding/faq",
                viewDelta: 1,
                visitorDelta: 1,
                engagementMs: 0,
              }),
            },
          );

        assert.equal(
          response.status,
          204,
        );

        assert.equal(
          await response.text(),
          "",
        );
      },
    );

    assert.deepEqual(
      received,
      [
        {
          pagePath:
            "/wedding/faq",
          viewDelta: 1,
          visitorDelta: 1,
          engagementMs: 0,
        },
      ],
    );
  },
);

test(
  "analytics endpoint rejects extra fields before storage",
  async () => {
    let called = false;

    await withServer(
      {
        async applyDelta() {
          called = true;
        },
      },
      async (baseUrl) => {
        const response =
          await fetch(
            `${baseUrl}/wedding/api/analytics`,
            {
              method: "POST",
              headers: {
                "content-type":
                  "application/json",
              },
              body: JSON.stringify({
                pagePath:
                  "/wedding/faq",
                viewDelta: 1,
                visitorDelta: 1,
                engagementMs: 0,
                inviteCode:
                  "SHOULD-NOT-BE-ACCEPTED",
              }),
            },
          );

        assert.equal(
          response.status,
          400,
        );
      },
    );

    assert.equal(
      called,
      false,
    );
  },
);
