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
            "namedInviteeResponses",
            "additionalGuestResponses",
            "attendanceTotals",
            "attendeeDetails",
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
            "namedInvitees",
            "additionalGuestAllocations",
            "deadline",
            "timeZone",
          ],
        );

        assert.deepEqual(
          payload.invitation
            .namedInvitees
            .map(
              (invitee) =>
                invitee.id,
            ),
          [
            "invitee-dev009-a",
            "invitee-dev009-b",
            "invitee-dev009-c",
            "invitee-dev009-d",
          ],
        );

        for (
          const invitee of
          payload.invitation
            .namedInvitees
        ) {
          assert.deepEqual(
            Object.keys(invitee),
            [
              "id",
              "displayName",
            ],
          );
        }

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

        for (
          const allocation of
          payload.invitation
            .additionalGuestAllocations
        ) {
          assert.deepEqual(
            Object.keys(
              allocation,
            ),
            [
              "id",
              "kind",
              "prompt",
              "maximumCount",
            ],
          );

          assert.equal(
            allocation.kind,
            "plus1",
          );

          assert.equal(
            allocation.maximumCount,
            1,
          );
        }

        assert.equal(
          Object.hasOwn(
            payload.invitation,
            "partyId",
          ),
          false,
        );
        assert.equal(
          Object.hasOwn(
            payload.invitation,
            "inviteCode",
          ),
          false,
        );
        assert.equal(
          Object.hasOwn(
            payload.invitation,
            "inviteCodeDisplay",
          ),
          false,
        );
        assert.equal(
          Object.hasOwn(
            payload.invitation,
            "active",
          ),
          false,
        );
        assert.equal(
          Object.hasOwn(
            payload.invitation,
            "environment",
          ),
          false,
        );
      },
    );
  },
);

test(
  "lookup returns the grouped unnamed-children allocation with only approved safe metadata",
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
              "DEV-002",
          },
        );

        assert.equal(
          response.status,
          200,
        );

        assert.equal(
          payload.invitation
            .maximumAttendance,
          5,
        );

        assert.equal(
          payload.invitation
            .namedInvitees.length,
          3,
        );

        assert.deepEqual(
          payload.invitation
            .additionalGuestAllocations,
          [
            {
              id:
                "allocation-dev002-a",
              kind:
                "unnamedChildren",
              prompt:
                "We'd love for your family to celebrate with us this Mayday - will your kid(s) be accompanying you?",
              maximumCount: 2,
            },
          ],
        );

        assert.equal(
          payload.invitation
            .namedInvitees.length +
            payload.invitation
              .additionalGuestAllocations
              .reduce(
                (
                  total,
                  allocation,
                ) =>
                  total +
                  allocation
                    .maximumCount,
                0,
              ),
          payload.invitation
            .maximumAttendance,
        );

        const allocation =
          payload.invitation
            .additionalGuestAllocations[0];

        assert.deepEqual(
          Object.keys(
            allocation,
          ),
          [
            "id",
            "kind",
            "prompt",
            "maximumCount",
          ],
        );

        assert.equal(
          Object.hasOwn(
            allocation,
            "source",
          ),
          false,
        );

        assert.equal(
          Object.hasOwn(
            allocation,
            "rawKids",
          ),
          false,
        );

        assert.equal(
          Object.hasOwn(
            allocation,
            "sourceRow",
          ),
          false,
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
  "named-invitee, Plus1, and grouped-child variation remains invitation configuration rather than schema variation",
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

        const groupedChildren =
          await lookup(
            baseUrl,
            {
              inviteCode:
                "DEV-002",
            },
          );

        const onePlusOne =
          await lookup(
            baseUrl,
            {
              inviteCode:
                "DEV-003",
            },
          );

        const multiplePlusOnes =
          await lookup(
            baseUrl,
            {
              inviteCode:
                "DEV-009",
            },
          );

        for (
          const result of [
            noAllocation,
            groupedChildren,
            onePlusOne,
            multiplePlusOnes,
          ]
        ) {
          assert.equal(
            result.response.status,
            200,
          );
        }

        assert.deepEqual(
          noAllocation
            .payload.questions,
          groupedChildren
            .payload.questions,
        );

        assert.deepEqual(
          groupedChildren
            .payload.questions,
          onePlusOne
            .payload.questions,
        );

        assert.deepEqual(
          onePlusOne
            .payload.questions,
          multiplePlusOnes
            .payload.questions,
        );

        assert.equal(
          noAllocation
            .payload.invitation
            .namedInvitees.length,
          1,
        );

        assert.equal(
          groupedChildren
            .payload.invitation
            .namedInvitees.length,
          3,
        );

        assert.equal(
          onePlusOne
            .payload.invitation
            .namedInvitees.length,
          1,
        );

        assert.equal(
          multiplePlusOnes
            .payload.invitation
            .namedInvitees.length,
          4,
        );

        assert.equal(
          noAllocation
            .payload.invitation
            .additionalGuestAllocations
            .length,
          0,
        );

        assert.deepEqual(
          groupedChildren
            .payload.invitation
            .additionalGuestAllocations,
          [
            {
              id:
                "allocation-dev002-a",
              kind:
                "unnamedChildren",
              prompt:
                "We'd love for your family to celebrate with us this Mayday - will your kid(s) be accompanying you?",
              maximumCount: 2,
            },
          ],
        );

        assert.deepEqual(
          onePlusOne
            .payload.invitation
            .additionalGuestAllocations,
          [
            {
              id:
                "plus1-dev003-a",
              kind:
                "plus1",
              prompt:
                "Will Example Guest be accompanied by a +1?",
              maximumCount: 1,
            },
          ],
        );

        assert.equal(
          multiplePlusOnes
            .payload.invitation
            .additionalGuestAllocations
            .length,
          3,
        );

        const namedInviteeQuestion =
          noAllocation
            .payload.questions
            .find(
              (question) =>
                question.id ===
                "namedInviteeResponses",
            );

        assert.equal(
          namedInviteeQuestion
            .repeatFromInvitationArray,
          "invitation.namedInvitees",
        );

        const additionalGuestQuestion =
          noAllocation
            .payload.questions
            .find(
              (question) =>
                question.id ===
                "additionalGuestResponses",
            );

        assert.equal(
          additionalGuestQuestion
            .repeatFromInvitationArray,
          "invitation.additionalGuestAllocations",
        );

        assert.equal(
          additionalGuestQuestion
            .type,
          "repeated-allocation-dependent-control",
        );

        assert.deepEqual(
          Object.keys(
            additionalGuestQuestion
              .instanceShape
              .renderByKind,
          ),
          [
            "plus1",
            "unnamedChildren",
          ],
        );
      },
    );
  },
);