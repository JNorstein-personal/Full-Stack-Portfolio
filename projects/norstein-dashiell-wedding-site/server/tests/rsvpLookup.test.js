const test = require("node:test");
const assert = require("node:assert/strict");
const { once } = require("node:events");

const {
  parseEnvironment,
} = require("../src/config/env");
const {
  createApp,
} = require("../src/app");

const OPEN_NOW = new Date(
  "2026-09-20T13:00:00-04:00",
);

function makeTestEnvironment(
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

async function withTestServer(
  options,
  callback,
) {
  const app = createApp(options);
  const server = app.listen(
    0,
    "127.0.0.1",
  );

  await once(server, "listening");

  const address = server.address();
  const baseUrl =
    `http://127.0.0.1:${address.port}`;

  try {
    return await callback(baseUrl);
  } finally {
    await new Promise(
      (resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      },
    );
  }
}

async function lookup(baseUrl, body) {
  const response = await fetch(
    `${baseUrl}/wedding/api/rsvp/lookup`,
    {
      method: "POST",
      headers: {
        "content-type":
          "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  return {
    response,
    payload: await response.json(),
  };
}

function standardOptions(
  overrides = {},
) {
  return {
    environment:
      makeTestEnvironment(),
    questions: Object.freeze([]),
    now: () => OPEN_NOW,
    ...overrides,
  };
}

test(
  "valid lookup returns only the Step 4 three-property blank-form boundary",
  async () => {
    await withTestServer(
      standardOptions(),
      async (baseUrl) => {
        const {
          response,
          payload,
        } = await lookup(
          baseUrl,
          {
            inviteCode:
              "DEV-001",
          },
        );

        assert.equal(
          response.status,
          200,
        );
        assert.equal(
          response.headers.get(
            "cache-control",
          ),
          "no-store, max-age=0",
        );
        assert.deepEqual(
          Object.keys(payload),
          [
            "invitation",
            "questions",
            "confirmationOptions",
          ],
        );
        assert.deepEqual(
          payload.questions,
          [],
        );
        assert.deepEqual(
          payload.confirmationOptions,
          {
            email: true,
            textMessage: false,
            smsAuthorizationRequired:
              false,
          },
        );
      },
    );
  },
);

test(
  "lookup projects only approved guest-facing invitation properties",
  async () => {
    await withTestServer(
      standardOptions(),
      async (baseUrl) => {
        const {
          response,
          payload,
        } = await lookup(
          baseUrl,
          {
            inviteCode:
              "DEV-009",
          },
        );

        assert.equal(
          response.status,
          200,
        );
        assert.deepEqual(
          Object.keys(
            payload.invitation,
          ),
          [
            "partyDisplayName",
            "greeting",
            "wordingMode",
            "maximumAttendance",
            "additionalGuestAllocations",
            "deadline",
            "timeZone",
          ],
        );
        assert.deepEqual(
          payload.invitation
            .additionalGuestAllocations
            .map(
              (allocation) =>
                allocation.id,
            ),
          [
            "plus1-dev009-a",
            "plus1-dev009-b",
            "plus1-dev009-c",
          ],
        );
      },
    );
  },
);

test(
  "lookup uses the approved invitation-code normalization",
  async () => {
    await withTestServer(
      standardOptions(),
      async (baseUrl) => {
        const { response } =
          await lookup(
            baseUrl,
            {
              inviteCode:
                " d e v - 0 0 3 ",
            },
          );

        assert.equal(
          response.status,
          200,
        );
      },
    );
  },
);

test(
  "malformed invitation input returns guest-safe 400",
  async () => {
    await withTestServer(
      standardOptions(),
      async (baseUrl) => {
        const {
          response,
          payload,
        } = await lookup(
          baseUrl,
          {
            inviteCode:
              "DEV_001",
          },
        );

        assert.equal(
          response.status,
          400,
        );
        assert.equal(
          payload.error.code,
          "INVALID_INVITATION",
        );
      },
    );
  },
);

test(
  "unknown and inactive invitations return the same guest-safe 404 response",
  async () => {
    await withTestServer(
      standardOptions(),
      async (baseUrl) => {
        const unknown =
          await lookup(
            baseUrl,
            {
              inviteCode:
                "UNK-404",
            },
          );

        const inactive =
          await lookup(
            baseUrl,
            {
              inviteCode:
                "DEV-999",
            },
          );

        assert.equal(
          unknown.response.status,
          404,
        );
        assert.equal(
          inactive.response.status,
          404,
        );
        assert.deepEqual(
          inactive.payload,
          unknown.payload,
        );
      },
    );
  },
);

test(
  "lookup request rejects extra identity properties",
  async () => {
    await withTestServer(
      standardOptions(),
      async (baseUrl) => {
        const { response } =
          await lookup(
            baseUrl,
            {
              inviteCode:
                "DEV-001",
              partyId:
                "client-supplied-party-id",
            },
          );

        assert.equal(
          response.status,
          400,
        );
      },
    );
  },
);

test(
  "valid invitation returns 410 at the backend deadline",
  async () => {
    await withTestServer(
      standardOptions({
        now: () =>
          new Date(
            "2027-03-01T23:59:00-05:00",
          ),
      }),
      async (baseUrl) => {
        const {
          response,
          payload,
        } = await lookup(
          baseUrl,
          {
            inviteCode:
              "DEV-001",
          },
        );

        assert.equal(
          response.status,
          410,
        );
        assert.equal(
          payload.error.code,
          "RSVP_CLOSED",
        );
      },
    );
  },
);

test(
  "source failures return guest-safe 503 without internal details",
  async () => {
    const invitationSource =
      Object.freeze({
        async findByCanonicalCode() {
          throw new Error(
            "private workbook path secret detail",
          );
        },
      });

    await withTestServer(
      standardOptions({
        invitationSource,
      }),
      async (baseUrl) => {
        const {
          response,
          payload,
        } = await lookup(
          baseUrl,
          {
            inviteCode:
              "DEV-001",
          },
        );

        assert.equal(
          response.status,
          503,
        );
        assert.equal(
          payload.error.code,
          "SERVICE_UNAVAILABLE",
        );

        const serialized =
          JSON.stringify(payload);

        assert.equal(
          serialized.includes(
            "workbook",
          ),
          false,
        );
        assert.equal(
          serialized.includes(
            "secret",
          ),
          false,
        );
      },
    );
  },
);
