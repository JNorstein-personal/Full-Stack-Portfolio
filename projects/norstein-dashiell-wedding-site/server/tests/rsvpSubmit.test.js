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
  createDevelopmentStore,
} = require("../src/services/storage/developmentStore");

const OPEN_NOW = new Date(
  "2026-09-20T18:00:00Z",
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

function createFixtureStore() {
  const registry =
    loadDevelopmentInvitationFixtures({
      runtimeEnvironment:
        "test",
    });

  return createDevelopmentStore({
    invitations:
      registry.fixtures,
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

async function submit(
  baseUrl,
  body,
) {
  const response = await fetch(
    `${baseUrl}/wedding/api/rsvp/submit`,
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
    payload:
      await response.json(),
  };
}

function emailConfirmation() {
  return {
    method: "email",
    email:
      "guest@example.com",
  };
}

function ceremonyRequest({
  inviteCode = "DEV-001",
  clientSubmissionId =
    "11111111-1111-4111-8111-111111111111",
} = {}) {
  return {
    inviteCode,
    clientSubmissionId,
    confirmation:
      emailConfirmation(),
    changes: {
      eventAttendance: {
        operation: "replace",
        value: ["ceremony"],
      },
      attendanceTotals: {
        operation: "replace",
        value: {
          adults21Plus: 1,
          youngAdults18To20: 0,
          children3To17: 0,
          childrenUnder3: 0,
        },
      },
    },
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
  "valid initial Ceremony RSVP stores version one before delivery and returns the five-property success boundary",
  async () => {
    const rsvpStore =
      createFixtureStore();

    let deliveryCount = 0;

    const deliveryService =
      Object.freeze({
        async deliver({
          invitation,
        }) {
          deliveryCount += 1;

          assert.notEqual(
            await rsvpStore
              .getCurrentRsvp(
                invitation.partyId,
              ),
            null,
          );

          return {
            guestDeliveryStatus:
              "sent",
            administrativeDeliveryStatus:
              "sent",
          };
        },
      });

    await withTestServer(
      standardOptions({
        rsvpStore,
        deliveryService,
      }),
      async (baseUrl) => {
        const {
          response,
          payload,
        } = await submit(
          baseUrl,
          ceremonyRequest(),
        );

        assert.equal(
          response.status,
          201,
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
            "submission",
            "invitation",
            "rsvp",
            "confirmation",
            "revisionPolicy",
          ],
        );
        assert.deepEqual(
          payload.submission,
          {
            recorded: true,
            action: "initial",
            idempotentRepeat:
              false,
            recordedAt:
              OPEN_NOW.toISOString(),
          },
        );
        assert.deepEqual(
          payload.rsvp,
          {
            eventAttendance: [
              "ceremony",
            ],
            attendanceTotals: {
              adults21Plus: 1,
              youngAdults18To20: 0,
              children3To17: 0,
              childrenUnder3: 0,
            },
            overallAttendance: 1,
          },
        );
        assert.equal(
          payload.confirmation
            .deliveryWarning,
          false,
        );
        assert.equal(
          deliveryCount,
          1,
        );

        const current =
          await rsvpStore
            .getCurrentRsvp(
              "party-dev-archetype-a",
            );
        const versions =
          await rsvpStore
            .listRsvpVersions(
              "party-dev-archetype-a",
            );

        assert.equal(
          current.version,
          1,
        );
        assert.equal(
          versions.length,
          1,
        );

        const serialized =
          JSON.stringify(payload);

        for (
          const forbidden of [
            "DEV001",
            "11111111-1111-4111-8111-111111111111",
            "guest@example.com",
            "party-dev-archetype-a",
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
  "valid initial Reception RSVP returns authorized Plus1 prompt and complete attendee details",
  async () => {
    const rsvpStore =
      createFixtureStore();

    await withTestServer(
      standardOptions({
        rsvpStore,
      }),
      async (baseUrl) => {
        const result =
          await submit(
            baseUrl,
            {
              inviteCode:
                "DEV-006",
              clientSubmissionId:
                "22222222-2222-4222-8222-222222222222",
              confirmation:
                emailConfirmation(),
              changes: {
                eventAttendance: {
                  operation:
                    "replace",
                  value: [
                    "reception",
                  ],
                },
                additionalGuestResponses:
                  {
                    operation:
                      "replace",
                    value: {
                      "plus1-dev006-a":
                        "yes",
                    },
                  },
                attendanceTotals: {
                  operation:
                    "replace",
                  value: {
                    adults21Plus: 2,
                    youngAdults18To20:
                      0,
                    children3To17: 0,
                    childrenUnder3: 0,
                  },
                },
                receptionAttendeeDetails:
                  {
                    operation:
                      "replace",
                    value: [
                      {
                        attendeeName:
                          "Example Guest",
                        dietaryPreferences:
                          "",
                      },
                      {
                        attendeeName:
                          "Example Companion",
                        dietaryPreferences:
                          "Vegetarian",
                      },
                    ],
                  },
              },
            },
          );

        assert.equal(
          result.response.status,
          201,
        );
        assert.deepEqual(
          result.payload.rsvp
            .additionalGuestResponses,
          [
            {
              id:
                "plus1-dev006-a",
              prompt:
                "Will Example Guest be accompanied by a +1?",
              response: "yes",
            },
          ],
        );
        assert.equal(
          result.payload.rsvp
            .overallAttendance,
          2,
        );
        assert.equal(
          result.payload.rsvp
            .receptionAttendeeDetails
            .length,
          2,
        );
        assert.equal(
          result.payload.confirmation
            .deliveryWarning,
          true,
        );
      },
    );
  },
);

test(
  "valid initial full decline stores only the decline substantive state",
  async () => {
    const rsvpStore =
      createFixtureStore();

    await withTestServer(
      standardOptions({
        rsvpStore,
      }),
      async (baseUrl) => {
        const result =
          await submit(
            baseUrl,
            {
              inviteCode:
                "DEV-007",
              clientSubmissionId:
                "33333333-3333-4333-8333-333333333333",
              confirmation:
                emailConfirmation(),
              changes: {
                eventAttendance: {
                  operation:
                    "replace",
                  value: [
                    "decline",
                  ],
                },
              },
            },
          );

        assert.equal(
          result.response.status,
          201,
        );
        assert.deepEqual(
          result.payload.rsvp,
          {
            eventAttendance: [
              "decline",
            ],
          },
        );
      },
    );
  },
);

test(
  "strict submit envelope rejects missing, malformed, and extra top-level properties without storage",
  async () => {
    const cases = [
      {
        ...ceremonyRequest(),
        clientSubmissionId:
          "not-a-uuid",
      },
      (() => {
        const body =
          ceremonyRequest();
        delete body.confirmation;
        return body;
      })(),
      {
        ...ceremonyRequest(),
        expectedVersion: 1,
      },
    ];

    for (
      let index = 0;
      index < cases.length;
      index += 1
    ) {
      const rsvpStore =
        createFixtureStore();

      await withTestServer(
        standardOptions({
          rsvpStore,
        }),
        async (baseUrl) => {
          const result =
            await submit(
              baseUrl,
              cases[index],
            );

          assert.equal(
            result.response.status,
            400,
          );
          assert.equal(
            result.payload.error
              .code,
            "INVALID_SUBMISSION",
          );
          assert.equal(
            await rsvpStore
              .getCurrentRsvp(
                "party-dev-archetype-a",
              ),
            null,
          );
        },
      );
    }
  },
);

test(
  "unknown substantive regions and invitation-specific unauthorized fields return 403",
  async () => {
    const cases = [
      {
        ...ceremonyRequest(),
        changes: {
          ...ceremonyRequest()
            .changes,
          accessibilityNeeds: {
            operation:
              "replace",
            value: "none",
          },
        },
      },
      {
        ...ceremonyRequest(),
        changes: {
          ...ceremonyRequest()
            .changes,
          additionalGuestResponses:
            {
              operation:
                "replace",
              value: {},
            },
        },
      },
      {
        ...ceremonyRequest(),
        changes: {
          ...ceremonyRequest()
            .changes,
          receptionAttendeeDetails:
            {
              operation:
                "replace",
              value: [
                {
                  attendeeName:
                    "Example Guest",
                },
              ],
            },
        },
      },
    ];

    for (
      let index = 0;
      index < cases.length;
      index += 1
    ) {
      await withTestServer(
        standardOptions({
          rsvpStore:
            createFixtureStore(),
        }),
        async (baseUrl) => {
          const result =
            await submit(
              baseUrl,
              cases[index],
            );

          assert.equal(
            result.response.status,
            403,
          );
          assert.equal(
            result.payload.error
              .code,
            "RSVP_NOT_AUTHORIZED",
          );
        },
      );
    }
  },
);

test(
  "invalid initial attendance totals produce 400 and no RSVP version",
  async () => {
    const rsvpStore =
      createFixtureStore();

    const body =
      ceremonyRequest();

    body.changes
      .attendanceTotals
      .value.adults21Plus = 2;

    await withTestServer(
      standardOptions({
        rsvpStore,
      }),
      async (baseUrl) => {
        const result =
          await submit(
            baseUrl,
            body,
          );

        assert.equal(
          result.response.status,
          400,
        );
        assert.deepEqual(
          await rsvpStore
            .listRsvpVersions(
              "party-dev-archetype-a",
            ),
          [],
        );
      },
    );
  },
);

test(
  "disabled text-message channel returns 403",
  async () => {
    const body =
      ceremonyRequest({
        clientSubmissionId:
          "44444444-4444-4444-8444-444444444444",
      });

    body.confirmation = {
      method: "textMessage",
      mobile:
        "+15555550123",
    };

    await withTestServer(
      standardOptions({
        rsvpStore:
          createFixtureStore(),
      }),
      async (baseUrl) => {
        const result =
          await submit(
            baseUrl,
            body,
          );

        assert.equal(
          result.response.status,
          403,
        );
      },
    );
  },
);

test(
  "new initial submission at the backend deadline returns 410 without storage",
  async () => {
    const rsvpStore =
      createFixtureStore();

    await withTestServer(
      standardOptions({
        rsvpStore,
        now: () =>
          new Date(
            "2027-03-01T23:59:00-05:00",
          ),
      }),
      async (baseUrl) => {
        const result =
          await submit(
            baseUrl,
            ceremonyRequest(),
          );

        assert.equal(
          result.response.status,
          410,
        );
        assert.equal(
          await rsvpStore
            .getCurrentRsvp(
              "party-dev-archetype-a",
            ),
          null,
        );
      },
    );
  },
);

test(
  "same initial request replay is idempotent and creates no duplicate version or delivery",
  async () => {
    const rsvpStore =
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

    await withTestServer(
      standardOptions({
        rsvpStore,
        deliveryService,
      }),
      async (baseUrl) => {
        const body =
          ceremonyRequest();

        const first =
          await submit(
            baseUrl,
            body,
          );
        const replay =
          await submit(
            baseUrl,
            body,
          );

        assert.equal(
          first.response.status,
          201,
        );
        assert.equal(
          replay.response.status,
          200,
        );
        assert.equal(
          replay.payload
            .submission
            .idempotentRepeat,
          true,
        );
        assert.equal(
          replay.payload
            .submission.action,
          "initial",
        );
        assert.equal(
          (
            await rsvpStore
              .listRsvpVersions(
                "party-dev-archetype-a",
              )
          ).length,
          1,
        );
        assert.equal(
          deliveryCount,
          1,
        );
        assert.equal(
          (
            await rsvpStore
              .listDeliveryRecords(
                "party-dev-archetype-a",
              )
          ).length,
          1,
        );
      },
    );
  },
);

test(
  "same initial identifier with materially different content returns 400 and preserves original current RSVP",
  async () => {
    const rsvpStore =
      createFixtureStore();

    await withTestServer(
      standardOptions({
        rsvpStore,
      }),
      async (baseUrl) => {
        const firstBody =
          ceremonyRequest();

        assert.equal(
          (
            await submit(
              baseUrl,
              firstBody,
            )
          ).response.status,
          201,
        );

        const changed = JSON.parse(
          JSON.stringify(
            firstBody,
          ),
        );

        changed.confirmation.email =
          "different@example.com";

        assert.equal(
          (
            await submit(
              baseUrl,
              changed,
            )
          ).response.status,
          400,
        );

        assert.equal(
          (
            await rsvpStore
              .listRsvpVersions(
                "party-dev-archetype-a",
              )
          ).length,
          1,
        );
      },
    );
  },
);

test(
  "malformed JSON on submit uses the submission error boundary and no-store response",
  async () => {
    await withTestServer(
      standardOptions({
        rsvpStore:
          createFixtureStore(),
      }),
      async (baseUrl) => {
        const response =
          await fetch(
            `${baseUrl}/wedding/api/rsvp/submit`,
            {
              method: "POST",
              headers: {
                "content-type":
                  "application/json",
              },
              body: "{",
            },
          );

        const payload =
          await response.json();

        assert.equal(
          response.status,
          400,
        );
        assert.equal(
          response.headers.get(
            "cache-control",
          ),
          "no-store, max-age=0",
        );
        assert.equal(
          payload.error.code,
          "INVALID_SUBMISSION",
        );
      },
    );
  },
);

test(
  "submission storage failures return guest-safe 503 without internal detail",
  async () => {
    const rsvpStore =
      createFixtureStore();

    const failingStore = {
      ...rsvpStore,
      async getSubmissionRecord() {
        throw new Error(
          "private workbook secret detail",
        );
      },
    };

    await withTestServer(
      standardOptions({
        rsvpStore:
          failingStore,
      }),
      async (baseUrl) => {
        const result =
          await submit(
            baseUrl,
            ceremonyRequest(),
          );

        assert.equal(
          result.response.status,
          503,
        );
        assert.equal(
          result.payload.error
            .code,
          "SERVICE_UNAVAILABLE",
        );

        const serialized =
          JSON.stringify(
            result.payload,
          );

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
