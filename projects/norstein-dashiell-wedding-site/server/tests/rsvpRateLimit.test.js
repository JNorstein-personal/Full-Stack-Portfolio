const test = require("node:test");
const assert = require("node:assert/strict");
const { once } = require("node:events");

const {
  parseEnvironment,
} = require("../src/config/env");
const {
  createApp,
} = require("../src/app");
const {
  loadDevelopmentInvitationFixtures,
} = require("../src/rsvp/developmentInvitations");
const {
  RATE_LIMITED_RESPONSE,
} = require("../src/middleware/rateLimit");
const {
  createDevelopmentStore,
} = require("../src/services/storage/developmentStore");

const OPEN_NOW = new Date(
  "2026-09-20T19:00:00-04:00",
);

function makeEnvironment(
  overrides = {},
) {
  return parseEnvironment({
    NODE_ENV: "test",
    HOST: "127.0.0.1",
    PORT: "3001",
    SITE_BASE_PATH:
      "/wedding",
    RSVP_DEADLINE:
      "2027-03-01T23:59:00-05:00",
    RSVP_TIME_ZONE:
      "America/New_York",
    RSVP_SMS_ENABLED:
      "false",
    ...overrides,
  });
}

function createFixtureStore() {
  const registry =
    loadDevelopmentInvitationFixtures({
      runtimeEnvironment:
        "test",
    });

  return {
    registry,
    store:
      createDevelopmentStore({
        invitations:
          registry.fixtures,
      }),
  };
}

async function withServer(
  options,
  callback,
) {
  const app =
    createApp(options);

  const server =
    app.listen(
      0,
      "127.0.0.1",
    );

  await once(
    server,
    "listening",
  );

  const address =
    server.address();

  const baseUrl =
    `http://127.0.0.1:${address.port}`;

  try {
    return await callback(
      baseUrl,
    );
  } finally {
    await new Promise(
      (resolve, reject) => {
        server.close(
          (error) => {
            if (error) {
              reject(error);
              return;
            }

            resolve();
          },
        );
      },
    );
  }
}

async function postJson(
  baseUrl,
  path,
  body,
  headers = {},
) {
  const response =
    await fetch(
      `${baseUrl}${path}`,
      {
        method: "POST",
        headers: {
          "content-type":
            "application/json",
          ...headers,
        },
        body:
          JSON.stringify(body),
      },
    );

  return {
    response,
    payload:
      await response.json(),
  };
}

function submissionId(index) {
  return (
    "00000000-0000-4000-8000-" +
    String(index).padStart(
      12,
      "0",
    )
  );
}

function declineRequest(
  inviteCode,
  index,
) {
  return {
    inviteCode,
    clientSubmissionId:
      submissionId(index),
    confirmation: {
      method: "email",
      email:
        "guest@example.com",
    },
    changes: {
      eventAttendance: {
        operation: "replace",
        value: ["decline"],
      },
    },
  };
}

function standardOptions(
  overrides = {},
) {
  return {
    environment:
      makeEnvironment(),
    now: () => OPEN_NOW,
    rateLimitNow:
      () => 0,
    ...overrides,
  };
}

test(
  "lookup allows ten requests per client IP and returns guest-safe no-store 429 on the eleventh",
  async () => {
    await withServer(
      standardOptions(),
      async (baseUrl) => {
        for (
          let index = 0;
          index < 10;
          index += 1
        ) {
          const result =
            await postJson(
              baseUrl,
              "/wedding/api/rsvp/lookup",
              {
                inviteCode:
                  "DEV-001",
              },
            );

          assert.equal(
            result.response.status,
            200,
          );
        }

        const limited =
          await postJson(
            baseUrl,
            "/wedding/api/rsvp/lookup",
            {
              inviteCode:
                "DEV-001",
            },
          );

        assert.equal(
          limited.response.status,
          429,
        );
        assert.deepEqual(
          limited.payload,
          RATE_LIMITED_RESPONSE,
        );
        assert.equal(
          limited.response.headers.get(
            "cache-control",
          ),
          "no-store, max-age=0",
        );
        assert.equal(
          limited.response.headers.get(
            "retry-after",
          ),
          "900",
        );

        const serialized =
          JSON.stringify(
            limited.payload,
          );

        for (
          const forbidden of [
            "DEV001",
            "active",
            "development",
            "record",
            "counter",
          ]
        ) {
          assert.equal(
            serialized.includes(
              forbidden,
            ),
            false,
          );
        }
      },
    );
  },
);

test(
  "untrusted forwarded addresses cannot bypass the client-IP lookup limiter",
  async () => {
    await withServer(
      standardOptions(),
      async (baseUrl) => {
        for (
          let index = 1;
          index <= 10;
          index += 1
        ) {
          const result =
            await postJson(
              baseUrl,
              "/wedding/api/rsvp/lookup",
              {
                inviteCode:
                  "DEV-001",
              },
              {
                "x-forwarded-for":
                  `198.51.100.${index}`,
              },
            );

          assert.equal(
            result.response.status,
            200,
          );
        }

        const limited =
          await postJson(
            baseUrl,
            "/wedding/api/rsvp/lookup",
            {
              inviteCode:
                "DEV-001",
            },
            {
              "x-forwarded-for":
                "203.0.113.200",
            },
          );

        assert.equal(
          limited.response.status,
          429,
        );
      },
    );
  },
);

test(
  "configured trusted proxy uses the forwarded client address for per-IP limiting",
  async () => {
    await withServer(
      standardOptions({
        environment:
          makeEnvironment({
            TRUST_PROXY: "1",
          }),
      }),
      async (baseUrl) => {
        for (
          let index = 0;
          index < 10;
          index += 1
        ) {
          const result =
            await postJson(
              baseUrl,
              "/wedding/api/rsvp/lookup",
              {
                inviteCode:
                  "DEV-001",
              },
              {
                "x-forwarded-for":
                  "198.51.100.10",
              },
            );

          assert.equal(
            result.response.status,
            200,
          );
        }

        const otherClient =
          await postJson(
            baseUrl,
            "/wedding/api/rsvp/lookup",
            {
              inviteCode:
                "DEV-001",
            },
            {
              "x-forwarded-for":
                "198.51.100.11",
            },
          );

        assert.equal(
          otherClient.response.status,
          200,
        );

        const firstClientAgain =
          await postJson(
            baseUrl,
            "/wedding/api/rsvp/lookup",
            {
              inviteCode:
                "DEV-001",
            },
            {
              "x-forwarded-for":
                "198.51.100.10",
            },
          );

        assert.equal(
          firstClientAgain
            .response.status,
          429,
        );
      },
    );
  },
);

test(
  "submission IP limiter blocks the seventh request before storage or delivery",
  async () => {
    const fixture =
      createFixtureStore();

    let deliveryCount = 0;

    const deliveryService = {
      async deliver() {
        deliveryCount += 1;

        return {
          guestDeliveryStatus:
            "sent",
          administrativeDeliveryStatus:
            "sent",
        };
      },
    };

    await withServer(
      standardOptions({
        rsvpStore:
          fixture.store,
        deliveryService,
      }),
      async (baseUrl) => {
        for (
          let index = 1;
          index <= 6;
          index += 1
        ) {
          const code =
            `DEV00${index}`;

          const result =
            await postJson(
              baseUrl,
              "/wedding/api/rsvp/submit",
              declineRequest(
                code,
                index,
              ),
            );

          assert.equal(
            result.response.status,
            201,
          );
        }

        const targetInvitation =
          fixture.registry.fixtures
            .find(
              (invitation) =>
                invitation.inviteCode ===
                "DEV007",
            );

        const limited =
          await postJson(
            baseUrl,
            "/wedding/api/rsvp/submit",
            declineRequest(
              "DEV007",
              7,
            ),
          );

        assert.equal(
          limited.response.status,
          429,
        );
        assert.deepEqual(
          limited.payload,
          RATE_LIMITED_RESPONSE,
        );
        assert.equal(
          limited.response.headers.get(
            "retry-after",
          ),
          "900",
        );
        assert.equal(
          deliveryCount,
          6,
        );
        assert.equal(
          await fixture.store
            .getCurrentRsvp(
              targetInvitation
                .partyId,
            ),
          null,
        );
        assert.deepEqual(
          await fixture.store
            .listRsvpVersions(
              targetInvitation
                .partyId,
            ),
          [],
        );
      },
    );
  },
);

test(
  "submission code limiter combines accepted presentation variants across distinct client IPs",
  async () => {
    const fixture =
      createFixtureStore();

    let deliveryCount = 0;

    const deliveryService = {
      async deliver() {
        deliveryCount += 1;

        return {
          guestDeliveryStatus:
            "sent",
          administrativeDeliveryStatus:
            "sent",
        };
      },
    };

    const variants = [
      "DEV-002",
      "dev002",
      " D E V - 0 0 2 ",
      "DEV 002",
      "D-E-V-0-0-2",
      "dev-002",
      "DEV002",
    ];

    await withServer(
      standardOptions({
        environment:
          makeEnvironment({
            TRUST_PROXY: "1",
          }),
        rsvpStore:
          fixture.store,
        deliveryService,
      }),
      async (baseUrl) => {
        for (
          let index = 0;
          index < 6;
          index += 1
        ) {
          const result =
            await postJson(
              baseUrl,
              "/wedding/api/rsvp/submit",
              declineRequest(
                variants[index],
                20 + index,
              ),
              {
                "x-forwarded-for":
                  `198.51.100.${20 + index}`,
              },
            );

          assert.equal(
            result.response.status,
            index === 0
              ? 201
              : 200,
          );
        }

        const invitation =
          fixture.registry.fixtures
            .find(
              (candidate) =>
                candidate.inviteCode ===
                "DEV002",
            );

        const limited =
          await postJson(
            baseUrl,
            "/wedding/api/rsvp/submit",
            declineRequest(
              variants[6],
              26,
            ),
            {
              "x-forwarded-for":
                "198.51.100.26",
            },
          );

        assert.equal(
          limited.response.status,
          429,
        );
        assert.equal(
          deliveryCount,
          6,
        );
        assert.equal(
          (
            await fixture.store
              .listRsvpVersions(
                invitation.partyId,
              )
          ).length,
          6,
        );
      },
    );
  },
);

test(
  "unexpected RSVP middleware errors collapse to guest-safe no-store 503",
  async () => {
    await withServer(
      standardOptions({
        rateLimitNow:
          () => Number.NaN,
      }),
      async (baseUrl) => {
        const result =
          await postJson(
            baseUrl,
            "/wedding/api/rsvp/lookup",
            {
              inviteCode:
                "DEV-001",
            },
          );

        assert.equal(
          result.response.status,
          503,
        );
        assert.equal(
          result.payload.error.code,
          "SERVICE_UNAVAILABLE",
        );
        assert.equal(
          result.response.headers.get(
            "cache-control",
          ),
          "no-store, max-age=0",
        );

        const serialized =
          JSON.stringify(
            result.payload,
          );

        assert.equal(
          serialized.includes(
            "Rate-limit clock",
          ),
          false,
        );
      },
    );
  },
);
