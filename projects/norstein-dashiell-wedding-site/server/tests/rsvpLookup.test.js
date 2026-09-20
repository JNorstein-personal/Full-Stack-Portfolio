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
    now: () => OPEN_NOW,
    ...overrides,
  };
}

test(
  "valid lookup returns the completed three-property blank-form boundary",
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
          payload.questions.map(
            (question) =>
              question.id,
          ),
          [
            "eventAttendance",
            "additionalGuestResponses",
            "attendanceTotals",
            "receptionAttendeeDetails",
            "confirmationMethod",
            "confirmationEmail",
            "confirmationMobile",
            "smsAuthorization",
          ],
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

test(
  "all active development invitations receive the same reusable blank-form question schema",
  async () => {
    const inviteCodes = [
      "DEV-001",
      "DEV-002",
      "DEV-003",
      "DEV-004",
      "DEV-005",
      "DEV-006",
      "DEV-007",
      "DEV-008",
      "DEV-009",
      "DEV-010",
    ];

    await withTestServer(
      standardOptions(),
      async (baseUrl) => {
        let referenceQuestions;

        for (
          const inviteCode of
          inviteCodes
        ) {
          const {
            response,
            payload,
          } = await lookup(
            baseUrl,
            {
              inviteCode,
            },
          );

          assert.equal(
            response.status,
            200,
          );

          if (!referenceQuestions) {
            referenceQuestions =
              payload.questions;
            continue;
          }

          assert.deepEqual(
            payload.questions,
            referenceQuestions,
          );
        }
      },
    );
  },
);

test(
  "Plus1 variation remains invitation configuration rather than schema variation",
  async () => {
    await withTestServer(
      standardOptions(),
      async (baseUrl) => {
        const noAllocation =
          await lookup(
            baseUrl,
            {
              inviteCode:
                "DEV-001",
            },
          );

        const oneAllocation =
          await lookup(
            baseUrl,
            {
              inviteCode:
                "DEV-003",
            },
          );

        const multipleAllocations =
          await lookup(
            baseUrl,
            {
              inviteCode:
                "DEV-009",
            },
          );

        assert.equal(
          noAllocation.response.status,
          200,
        );
        assert.equal(
          oneAllocation.response.status,
          200,
        );
        assert.equal(
          multipleAllocations.response.status,
          200,
        );

        assert.deepEqual(
          noAllocation.payload.questions,
          oneAllocation.payload.questions,
        );
        assert.deepEqual(
          oneAllocation.payload.questions,
          multipleAllocations.payload.questions,
        );

        assert.equal(
          noAllocation.payload.invitation
            .additionalGuestAllocations
            .length,
          0,
        );
        assert.equal(
          oneAllocation.payload.invitation
            .additionalGuestAllocations
            .length,
          1,
        );
        assert.equal(
          multipleAllocations.payload.invitation
            .additionalGuestAllocations
            .length,
          3,
        );

        const plusOneQuestion =
          noAllocation.payload.questions
            .find(
              (question) =>
                question.id ===
                "additionalGuestResponses",
            );

        assert.equal(
          plusOneQuestion
            .repeatFromInvitationArray,
          "invitation.additionalGuestAllocations",
        );
      },
    );
  },
);
