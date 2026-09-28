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
const {
  createMutationId,
} = require("../src/services/rsvpSubmissionService");

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
  if (inviteCode !== "DEV-001") {
    throw new Error(
      "ceremonyRequest currently supports DEV-001 only; use the fixture-specific request helper for other invitations.",
    );
  }

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
      namedInviteeResponses: {
        operation: "replace",
        value: {
          "invitee-dev001-a":
            "yes",
        },
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
      attendeeDetails: {
        operation: "replace",
        value: [
          {
            attendeeName:
              "Example Guest",
          },
        ],
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
          action,
        }) {
          deliveryCount += 1;

          assert.equal(
            action,
            "initial",
          );

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
            namedInviteeResponses: [
              {
                id:
                  "invitee-dev001-a",
                displayName:
                  "Example Guest",
                response: "yes",
              },
            ],
            attendanceTotals: {
              adults21Plus: 1,
              youngAdults18To20: 0,
              children3To17: 0,
              childrenUnder3: 0,
            },
            overallAttendance: 1,
            attendeeDetails: [
              {
                attendeeName:
                  "Example Guest",
              },
            ],
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
  "valid initial Reception RSVP returns named invitee decision, authorized Plus1 prompt, and complete attendee details",
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
            dev006ReceptionRequest({
              clientSubmissionId:
                "22222222-2222-4222-8222-222222222222",
            }),
          );

        assert.equal(
          result.response.status,
          201,
        );
        assert.deepEqual(
          result.payload.rsvp
            .namedInviteeResponses,
          [
            {
              id:
                "invitee-dev006-a",
              displayName:
                "Example Guest",
              response: "yes",
            },
          ],
        );
        assert.deepEqual(
          result.payload.rsvp
            .additionalGuestResponses,
          [
            {
              id:
                "plus1-dev006-a",
              kind:
                "plus1",
              prompt:
                "Will Example Guest be accompanied by a +1?",
              maximumCount: 1,
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
            .attendeeDetails
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
  "valid initial grouped-child RSVP preserves safe allocation metadata, structured response, derived attendance, and stored state",
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
            dev002CeremonyRequest({
              clientSubmissionId:
                "22333333-3333-4333-8333-333333333333",
              adults21Plus: 2,
              children3To17: 2,
            }),
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
                "allocation-dev002-a",
              kind:
                "unnamedChildren",
              prompt:
                "We'd love for your family to celebrate with us this Mayday - will your kid(s) be accompanying you?",
              maximumCount: 2,
              response: {
                attending:
                  "yes",
                count: 2,
              },
            },
          ],
        );

        assert.equal(
          result.payload.rsvp
            .overallAttendance,
          4,
        );

        assert.equal(
          result.payload.rsvp
            .attendeeDetails.length,
          4,
        );

        const current =
          await rsvpStore
            .getCurrentRsvp(
              "party-dev-archetype-b",
            );

        assert.deepEqual(
          current
            .additionalGuestResponses,
          {
            "allocation-dev002-a":
              {
                attending:
                  "yes",
                count: 2,
              },
          },
        );

        assert.equal(
          current.overallAttendance,
          4,
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
          overallAttendance: {
            operation:
              "replace",
            value: 1,
          },
        },
      },
      {
        ...ceremonyRequest(),
        changes: {
          ...ceremonyRequest()
            .changes,
          attendeeDetails: {
            operation:
              "replace",
            value: [
              {
                attendeeName:
                  "Example Guest",
                dietaryPreferences:
                  "Vegetarian",
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

function buildNamedResponses(
  ids,
  attendingCount,
) {
  return Object.fromEntries(
    ids.map((id, index) => [
      id,
      index < attendingCount
        ? "yes"
        : "no",
    ]),
  );
}

function buildAttendeeDetails(
  attendingCount,
  {
    reception = false,
  } = {},
) {
  return Array.from(
    {
      length: attendingCount,
    },
    (_, index) => ({
      attendeeName:
        `Example Guest ${index + 1}`,
      ...(reception
        ? {
            dietaryPreferences:
              "",
          }
        : {}),
    }),
  );
}

function dev002CeremonyRequest({
  clientSubmissionId,
  adults21Plus = 1,
  children3To17 = 0,
} = {}) {
  if (
    adults21Plus < 0 ||
    adults21Plus > 3 ||
    children3To17 < 0 ||
    children3To17 > 2
  ) {
    throw new Error(
      "DEV002 helper counts exceed the fictional invitation capacity.",
    );
  }

  const overallAttendance =
    adults21Plus +
    children3To17;

  return {
    inviteCode: "DEV-002",
    clientSubmissionId,
    confirmation:
      emailConfirmation(),
    changes: {
      eventAttendance: {
        operation: "replace",
        value: ["ceremony"],
      },
      namedInviteeResponses: {
        operation: "replace",
        value:
          buildNamedResponses(
            [
              "invitee-dev002-a",
              "invitee-dev002-b",
              "invitee-dev002-c",
            ],
            adults21Plus,
          ),
      },
      additionalGuestResponses: {
        operation: "replace",
        value: {
          "allocation-dev002-a":
            children3To17 > 0
              ? {
                  attending: "yes",
                  count:
                    children3To17,
                }
              : {
                  attending: "no",
                  count: 0,
                },
        },
      },
      attendanceTotals: {
        operation: "replace",
        value: {
          adults21Plus,
          youngAdults18To20: 0,
          children3To17,
          childrenUnder3: 0,
        },
      },
      attendeeDetails: {
        operation: "replace",
        value:
          buildAttendeeDetails(
            overallAttendance,
          ),
      },
    },
  };
}

function dev002ReceptionRequest({
  clientSubmissionId,
  adults21Plus = 2,
  children3To17 = 0,
} = {}) {
  if (
    adults21Plus < 0 ||
    adults21Plus > 3 ||
    children3To17 < 0 ||
    children3To17 > 2
  ) {
    throw new Error(
      "DEV002 helper counts exceed the fictional invitation capacity.",
    );
  }

  const overallAttendance =
    adults21Plus +
    children3To17;

  return {
    inviteCode: "DEV-002",
    clientSubmissionId,
    confirmation:
      emailConfirmation(),
    changes: {
      eventAttendance: {
        operation: "replace",
        value: ["reception"],
      },
      namedInviteeResponses: {
        operation: "replace",
        value:
          buildNamedResponses(
            [
              "invitee-dev002-a",
              "invitee-dev002-b",
              "invitee-dev002-c",
            ],
            adults21Plus,
          ),
      },
      additionalGuestResponses: {
        operation: "replace",
        value: {
          "allocation-dev002-a":
            children3To17 > 0
              ? {
                  attending: "yes",
                  count:
                    children3To17,
                }
              : {
                  attending: "no",
                  count: 0,
                },
        },
      },
      attendanceTotals: {
        operation: "replace",
        value: {
          adults21Plus,
          youngAdults18To20: 0,
          children3To17,
          childrenUnder3: 0,
        },
      },
      attendeeDetails: {
        operation: "replace",
        value:
          buildAttendeeDetails(
            overallAttendance,
            {
              reception: true,
            },
          ),
      },
    },
  };
}

function dev006ReceptionRequest({
  clientSubmissionId,
} = {}) {
  return {
    inviteCode: "DEV-006",
    clientSubmissionId,
    confirmation:
      emailConfirmation(),
    changes: {
      eventAttendance: {
        operation: "replace",
        value: ["reception"],
      },
      namedInviteeResponses: {
        operation: "replace",
        value: {
          "invitee-dev006-a":
            "yes",
        },
      },
      additionalGuestResponses:
        {
          operation: "replace",
          value: {
            "plus1-dev006-a":
              "yes",
          },
        },
      attendanceTotals: {
        operation: "replace",
        value: {
          adults21Plus: 2,
          youngAdults18To20: 0,
          children3To17: 0,
          childrenUnder3: 0,
        },
      },
      attendeeDetails:
        {
          operation: "replace",
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
                "",
            },
          ],
        },
    },
  };
}

test(
  "confirmation-only revision preserves substantive RSVP and replaces operational confirmation",
  async () => {
    const rsvpStore =
      createFixtureStore();

    await withTestServer(
      standardOptions({
        rsvpStore,
      }),
      async (baseUrl) => {
        assert.equal(
          (
            await submit(
              baseUrl,
              ceremonyRequest(),
            )
          ).response.status,
          201,
        );

        const revision =
          await submit(
            baseUrl,
            {
              inviteCode:
                "DEV-001",
              clientSubmissionId:
                "55555555-5555-4555-8555-555555555555",
              confirmation: {
                method: "email",
                email:
                  "replacement@example.com",
              },
              changes: {},
            },
          );

        assert.equal(
          revision.response.status,
          200,
        );
        assert.equal(
          revision.payload
            .submission.action,
          "revision",
        );
        assert.deepEqual(
          revision.payload.rsvp,
          {
            eventAttendance: [
              "ceremony",
            ],
            namedInviteeResponses: [
              {
                id:
                  "invitee-dev001-a",
                displayName:
                  "Example Guest",
                response: "yes",
              },
            ],
            attendanceTotals: {
              adults21Plus: 1,
              youngAdults18To20: 0,
              children3To17: 0,
              childrenUnder3: 0,
            },
            overallAttendance: 1,
            attendeeDetails: [
              {
                attendeeName:
                  "Example Guest",
              },
            ],
          },
        );

        const current =
          await rsvpStore
            .getCurrentRsvp(
              "party-dev-archetype-a",
            );

        assert.equal(
          current.version,
          2,
        );
        assert.equal(
          current.confirmation
            .email,
          "replacement@example.com",
        );
        assert.equal(
          (
            await rsvpStore
              .listRsvpVersions(
                "party-dev-archetype-a",
              )
          ).length,
          2,
        );
      },
    );
  },
);

test(
  "partial attendance-total revision merges omitted categories and honors explicit zero without changing derived headcount",
  async () => {
    const rsvpStore =
      createFixtureStore();

    await withTestServer(
      standardOptions({
        rsvpStore,
      }),
      async (baseUrl) => {
        assert.equal(
          (
            await submit(
              baseUrl,
              dev002CeremonyRequest({
                clientSubmissionId:
                  "60000000-0000-4000-8000-000000000001",
                adults21Plus: 2,
                children3To17: 1,
              }),
            )
          ).response.status,
          201,
        );

        const revision =
          await submit(
            baseUrl,
            {
              inviteCode:
                "DEV-002",
              clientSubmissionId:
                "60000000-0000-4000-8000-000000000002",
              confirmation:
                emailConfirmation(),
              changes: {
                attendanceTotals: {
                  operation:
                    "replace",
                  value: {
                    adults21Plus: 3,
                    children3To17:
                      0,
                  },
                },
              },
            },
          );

        assert.equal(
          revision.response.status,
          200,
        );
        assert.deepEqual(
          revision.payload.rsvp
            .attendanceTotals,
          {
            adults21Plus: 3,
            youngAdults18To20: 0,
            children3To17: 0,
            childrenUnder3: 0,
          },
        );
        assert.equal(
          revision.payload.rsvp
            .overallAttendance,
          3,
        );
      },
    );
  },
);

test(
  "grouped-child count revision preserves structured response semantics and requires reconciled dependent state",
  async () => {
    const rsvpStore =
      createFixtureStore();

    await withTestServer(
      standardOptions({
        rsvpStore,
      }),
      async (baseUrl) => {
        assert.equal(
          (
            await submit(
              baseUrl,
              dev002CeremonyRequest({
                clientSubmissionId:
                  "60500000-0000-4000-8000-000000000001",
                adults21Plus: 1,
                children3To17: 1,
              }),
            )
          ).response.status,
          201,
        );

        const incomplete =
          await submit(
            baseUrl,
            {
              inviteCode:
                "DEV-002",
              clientSubmissionId:
                "60500000-0000-4000-8000-000000000002",
              confirmation:
                emailConfirmation(),
              changes: {
                additionalGuestResponses:
                  {
                    operation:
                      "replace",
                    value: {
                      "allocation-dev002-a":
                        {
                          attending:
                            "yes",
                          count: 2,
                        },
                    },
                  },
              },
            },
          );

        assert.equal(
          incomplete.response.status,
          400,
        );

        const revision =
          await submit(
            baseUrl,
            {
              inviteCode:
                "DEV-002",
              clientSubmissionId:
                "60500000-0000-4000-8000-000000000003",
              confirmation:
                emailConfirmation(),
              changes: {
                additionalGuestResponses:
                  {
                    operation:
                      "replace",
                    value: {
                      "allocation-dev002-a":
                        {
                          attending:
                            "yes",
                          count: 2,
                        },
                    },
                  },
                attendanceTotals: {
                  operation:
                    "replace",
                  value: {
                    children3To17:
                      2,
                  },
                },
                attendeeDetails: {
                  operation:
                    "replace",
                  value:
                    buildAttendeeDetails(
                      3,
                    ),
                },
              },
            },
          );

        assert.equal(
          revision.response.status,
          200,
        );

        assert.equal(
          revision.payload.rsvp
            .overallAttendance,
          3,
        );

        assert.deepEqual(
          revision.payload.rsvp
            .additionalGuestResponses,
          [
            {
              id:
                "allocation-dev002-a",
              kind:
                "unnamedChildren",
              prompt:
                "We'd love for your family to celebrate with us this Mayday - will your kid(s) be accompanying you?",
              maximumCount: 2,
              response: {
                attending:
                  "yes",
                count: 2,
              },
            },
          ],
        );

        const current =
          await rsvpStore
            .getCurrentRsvp(
              "party-dev-archetype-b",
            );

        assert.deepEqual(
          current
            .additionalGuestResponses[
            "allocation-dev002-a"
          ],
          {
            attending: "yes",
            count: 2,
          },
        );

        assert.equal(
          (
            await rsvpStore
              .listRsvpVersions(
                "party-dev-archetype-b",
              )
          ).length,
          2,
        );
      },
    );
  },
);

test(
  "partial Plus1 revision merges selected allocation responses against current state and revalidates dependent data",
  async () => {
    const rsvpStore =
      createFixtureStore();

    await withTestServer(
      standardOptions({
        rsvpStore,
      }),
      async (baseUrl) => {
        const initial =
          await submit(
            baseUrl,
            {
              inviteCode:
                "DEV-009",
              clientSubmissionId:
                "61000000-0000-4000-8000-000000000001",
              confirmation:
                emailConfirmation(),
              changes: {
                eventAttendance: {
                  operation:
                    "replace",
                  value: [
                    "ceremony",
                  ],
                },
                namedInviteeResponses:
                  {
                    operation:
                      "replace",
                    value: {
                      "invitee-dev009-a":
                        "yes",
                      "invitee-dev009-b":
                        "yes",
                      "invitee-dev009-c":
                        "no",
                      "invitee-dev009-d":
                        "no",
                    },
                  },
                additionalGuestResponses:
                  {
                    operation:
                      "replace",
                    value: {
                      "plus1-dev009-a":
                        "yes",
                      "plus1-dev009-b":
                        "no",
                      "plus1-dev009-c":
                        "no",
                    },
                  },
                attendanceTotals: {
                  operation:
                    "replace",
                  value: {
                    adults21Plus: 3,
                    youngAdults18To20:
                      0,
                    children3To17: 0,
                    childrenUnder3: 0,
                  },
                },
                attendeeDetails: {
                  operation:
                    "replace",
                  value:
                    buildAttendeeDetails(
                      3,
                    ),
                },
              },
            },
          );

        assert.equal(
          initial.response.status,
          201,
        );

        const revision =
          await submit(
            baseUrl,
            {
              inviteCode:
                "DEV-009",
              clientSubmissionId:
                "61000000-0000-4000-8000-000000000002",
              confirmation:
                emailConfirmation(),
              changes: {
                additionalGuestResponses:
                  {
                    operation:
                      "replace",
                    value: {
                      "plus1-dev009-b":
                        "yes",
                    },
                  },
                attendanceTotals: {
                  operation:
                    "replace",
                  value: {
                    adults21Plus: 4,
                  },
                },
                attendeeDetails: {
                  operation:
                    "replace",
                  value:
                    buildAttendeeDetails(
                      4,
                    ),
                },
              },
            },
          );

        assert.equal(
          revision.response.status,
          200,
        );

        const responses =
          Object.fromEntries(
            revision.payload.rsvp
              .additionalGuestResponses
              .map(
                (item) => [
                  item.id,
                  item.response,
                ],
              ),
          );

        assert.deepEqual(
          responses,
          {
            "plus1-dev009-a":
              "yes",
            "plus1-dev009-b":
              "yes",
            "plus1-dev009-c":
              "no",
          },
        );
        assert.equal(
          revision.payload.rsvp
            .overallAttendance,
          4,
        );
        assert.equal(
          revision.payload.rsvp
            .attendeeDetails.length,
          4,
        );
      },
    );
  },
);

test(
  "attending-to-decline revision clears all attendance-dependent data",
  async () => {
    const rsvpStore =
      createFixtureStore();

    await withTestServer(
      standardOptions({
        rsvpStore,
      }),
      async (baseUrl) => {
        assert.equal(
          (
            await submit(
              baseUrl,
              dev006ReceptionRequest({
                clientSubmissionId:
                  "62000000-0000-4000-8000-000000000001",
              }),
            )
          ).response.status,
          201,
        );

        const revision =
          await submit(
            baseUrl,
            {
              inviteCode:
                "DEV-006",
              clientSubmissionId:
                "62000000-0000-4000-8000-000000000002",
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
          revision.response.status,
          200,
        );
        assert.deepEqual(
          revision.payload.rsvp,
          {
            eventAttendance: [
              "decline",
            ],
          },
        );

        const current =
          await rsvpStore
            .getCurrentRsvp(
              "party-dev-archetype-f",
            );

        for (
          const key of [
            "namedInviteeResponses",
            "additionalGuestResponses",
            "attendanceTotals",
            "overallAttendance",
            "attendeeDetails",
          ]
        ) {
          assert.equal(
            Object.prototype
              .hasOwnProperty.call(
                current,
                key,
              ),
            false,
          );
        }
      },
    );
  },
);

test(
  "decline-to-Reception revision requires and then accepts all newly applicable person-level data",
  async () => {
    const rsvpStore =
      createFixtureStore();

    await withTestServer(
      standardOptions({
        rsvpStore,
      }),
      async (baseUrl) => {
        assert.equal(
          (
            await submit(
              baseUrl,
              {
                inviteCode:
                  "DEV-006",
                clientSubmissionId:
                  "63000000-0000-4000-8000-000000000001",
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
            )
          ).response.status,
          201,
        );

        const incomplete =
          await submit(
            baseUrl,
            {
              inviteCode:
                "DEV-006",
              clientSubmissionId:
                "63000000-0000-4000-8000-000000000002",
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
              },
            },
          );

        assert.equal(
          incomplete.response.status,
          400,
        );
        assert.equal(
          (
            await rsvpStore
              .listRsvpVersions(
                "party-dev-archetype-f",
              )
          ).length,
          1,
        );

        const complete =
          await submit(
            baseUrl,
            {
              inviteCode:
                "DEV-006",
              clientSubmissionId:
                "63000000-0000-4000-8000-000000000003",
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
                namedInviteeResponses:
                  {
                    operation:
                      "replace",
                    value: {
                      "invitee-dev006-a":
                        "yes",
                    },
                  },
                additionalGuestResponses:
                  {
                    operation:
                      "replace",
                    value: {
                      "plus1-dev006-a":
                        "no",
                    },
                  },
                attendanceTotals: {
                  operation:
                    "replace",
                  value: {
                    adults21Plus: 1,
                    youngAdults18To20:
                      0,
                    children3To17: 0,
                    childrenUnder3: 0,
                  },
                },
                attendeeDetails:
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
                    ],
                  },
              },
            },
          );

        assert.equal(
          complete.response.status,
          200,
        );
        assert.equal(
          complete.payload.rsvp
            .overallAttendance,
          1,
        );
        assert.equal(
          complete.payload.rsvp
            .namedInviteeResponses[0]
            .response,
          "yes",
        );
      },
    );
  },
);

test(
  "adding Reception without changing attendee composition preserves existing attendee names",
  async () => {
    const rsvpStore =
      createFixtureStore();

    await withTestServer(
      standardOptions({
        rsvpStore,
      }),
      async (baseUrl) => {
        assert.equal(
          (
            await submit(
              baseUrl,
              ceremonyRequest(),
            )
          ).response.status,
          201,
        );

        const revision =
          await submit(
            baseUrl,
            {
              inviteCode:
                "DEV-001",
              clientSubmissionId:
                "64000000-0000-4000-8000-000000000002",
              confirmation:
                emailConfirmation(),
              changes: {
                eventAttendance: {
                  operation:
                    "replace",
                  value: [
                    "ceremony",
                    "reception",
                  ],
                },
              },
            },
          );

        assert.equal(
          revision.response.status,
          200,
        );
        assert.deepEqual(
          revision.payload.rsvp
            .attendeeDetails,
          [
            {
              attendeeName:
                "Example Guest",
            },
          ],
        );
      },
    );
  },
);

test(
  "removing Reception preserves attendee names while clearing dietary information",
  async () => {
    const rsvpStore =
      createFixtureStore();

    await withTestServer(
      standardOptions({
        rsvpStore,
      }),
      async (baseUrl) => {
        assert.equal(
          (
            await submit(
              baseUrl,
              dev002ReceptionRequest({
                clientSubmissionId:
                  "65000000-0000-4000-8000-000000000001",
              }),
            )
          ).response.status,
          201,
        );

        const revision =
          await submit(
            baseUrl,
            {
              inviteCode:
                "DEV-002",
              clientSubmissionId:
                "65000000-0000-4000-8000-000000000002",
              confirmation:
                emailConfirmation(),
              changes: {
                eventAttendance: {
                  operation:
                    "replace",
                  value: [
                    "ceremony",
                  ],
                },
              },
            },
          );

        assert.equal(
          revision.response.status,
          200,
        );
        assert.deepEqual(
          revision.payload.rsvp
            .attendeeDetails,
          [
            {
              attendeeName:
                "Example Guest 1",
            },
            {
              attendeeName:
                "Example Guest 2",
            },
          ],
        );
      },
    );
  },
);

test(
  "Reception person-level attendance change requires totals reconciliation and a full replacement attendee list",
  async () => {
    const rsvpStore =
      createFixtureStore();

    await withTestServer(
      standardOptions({
        rsvpStore,
      }),
      async (baseUrl) => {
        assert.equal(
          (
            await submit(
              baseUrl,
              dev002ReceptionRequest({
                clientSubmissionId:
                  "66000000-0000-4000-8000-000000000001",
              }),
            )
          ).response.status,
          201,
        );

        const incomplete =
          await submit(
            baseUrl,
            {
              inviteCode:
                "DEV-002",
              clientSubmissionId:
                "66000000-0000-4000-8000-000000000002",
              confirmation:
                emailConfirmation(),
              changes: {
                namedInviteeResponses:
                  {
                    operation:
                      "replace",
                    value: {
                      "invitee-dev002-c":
                        "yes",
                    },
                  },
                attendanceTotals: {
                  operation:
                    "replace",
                  value: {
                    adults21Plus: 3,
                  },
                },
              },
            },
          );

        assert.equal(
          incomplete.response.status,
          400,
        );

        const complete =
          await submit(
            baseUrl,
            {
              inviteCode:
                "DEV-002",
              clientSubmissionId:
                "66000000-0000-4000-8000-000000000003",
              confirmation:
                emailConfirmation(),
              changes: {
                namedInviteeResponses:
                  {
                    operation:
                      "replace",
                    value: {
                      "invitee-dev002-c":
                        "yes",
                    },
                  },
                attendanceTotals: {
                  operation:
                    "replace",
                  value: {
                    adults21Plus: 3,
                  },
                },
                attendeeDetails:
                  {
                    operation:
                      "replace",
                    value:
                      buildAttendeeDetails(
                        3,
                        {
                          reception:
                            true,
                        },
                      ),
                  },
              },
            },
          );

        assert.equal(
          complete.response.status,
          200,
        );
        assert.equal(
          complete.payload.rsvp
            .overallAttendance,
          3,
        );
        assert.equal(
          complete.payload.rsvp
            .attendeeDetails
            .length,
          3,
        );
      },
    );
  },
);

test(
  "sequential distinct revisions merge against the latest authoritative current RSVP without 409 conflict",
  async () => {
    const rsvpStore =
      createFixtureStore();

    await withTestServer(
      standardOptions({
        rsvpStore,
      }),
      async (baseUrl) => {
        assert.equal(
          (
            await submit(
              baseUrl,
              dev002CeremonyRequest({
                clientSubmissionId:
                  "67000000-0000-4000-8000-000000000001",
              }),
            )
          ).response.status,
          201,
        );

        for (
          const [
            id,
            inviteeId,
            expectedCount,
          ] of [
            [
              "67000000-0000-4000-8000-000000000002",
              "invitee-dev002-b",
              2,
            ],
            [
              "67000000-0000-4000-8000-000000000003",
              "invitee-dev002-c",
              3,
            ],
          ]
        ) {
          const revision =
            await submit(
              baseUrl,
              {
                inviteCode:
                  "DEV-002",
                clientSubmissionId:
                  id,
                confirmation:
                  emailConfirmation(),
                changes: {
                  namedInviteeResponses:
                    {
                      operation:
                        "replace",
                      value: {
                        [inviteeId]:
                          "yes",
                      },
                    },
                  attendanceTotals: {
                    operation:
                      "replace",
                    value: {
                      adults21Plus:
                        expectedCount,
                    },
                  },
                  attendeeDetails:
                    {
                      operation:
                        "replace",
                      value:
                        buildAttendeeDetails(
                          expectedCount,
                        ),
                    },
                },
              },
            );

          assert.equal(
            revision.response.status,
            200,
          );
          assert.equal(
            revision.payload.rsvp
              .overallAttendance,
            expectedCount,
          );
        }

        const versions =
          await rsvpStore
            .listRsvpVersions(
              "party-dev-archetype-b",
            );

        assert.equal(
          versions.length,
          3,
        );
        assert.deepEqual(
          versions.map(
            (version) =>
              version.action,
          ),
          [
            "initial",
            "revision",
            "revision",
          ],
        );
      },
    );
  },
);

test(
  "lookup remains blank after initial submission and revision",
  async () => {
    const rsvpStore =
      createFixtureStore();

    await withTestServer(
      standardOptions({
        rsvpStore,
      }),
      async (baseUrl) => {
        assert.equal(
          (
            await submit(
              baseUrl,
              dev002CeremonyRequest({
                clientSubmissionId:
                  "68000000-0000-4000-8000-000000000001",
              }),
            )
          ).response.status,
          201,
        );

        assert.equal(
          (
            await submit(
              baseUrl,
              {
                inviteCode:
                  "DEV-002",
                clientSubmissionId:
                  "68000000-0000-4000-8000-000000000002",
                confirmation:
                  emailConfirmation(),
                changes: {
                  attendanceTotals: {
                    operation:
                      "replace",
                    value: {
                      adults21Plus: 0,
                      youngAdults18To20:
                        1,
                    },
                  },
                },
              },
            )
          ).response.status,
          200,
        );

        const response =
          await fetch(
            `${baseUrl}/wedding/api/rsvp/lookup`,
            {
              method: "POST",
              headers: {
                "content-type":
                  "application/json",
              },
              body: JSON.stringify({
                inviteCode:
                  "DEV-002",
              }),
            },
          );

        const payload =
          await response.json();

        assert.equal(
          response.status,
          200,
        );
        assert.deepEqual(
          Object.keys(payload),
          [
            "invitation",
            "questions",
            "confirmationOptions",
          ],
        );

        assert.equal(
          Object.prototype
            .hasOwnProperty.call(
              payload,
              "rsvp",
            ),
          false,
        );

        for (
          const forbiddenProperty of [
            "overallAttendance",
            "recordedAt",
            "version",
            "currentResponse",
            "existingResponse",
            "hasResponse",
          ]
        ) {
          assert.equal(
            Object.prototype
              .hasOwnProperty.call(
                payload.invitation,
                forbiddenProperty,
              ),
            false,
          );
        }

        const serialized =
          JSON.stringify(payload);

        assert.equal(
          serialized.includes(
            "guest@example.com",
          ),
          false,
        );
      },
    );
  },
);

test(
  "revision replay is idempotent and creates no duplicate version or delivery attempt",
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
        assert.equal(
          (
            await submit(
              baseUrl,
              dev002CeremonyRequest({
                clientSubmissionId:
                  "69000000-0000-4000-8000-000000000001",
              }),
            )
          ).response.status,
          201,
        );

        const revisionBody = {
          inviteCode:
            "DEV-002",
          clientSubmissionId:
            "69000000-0000-4000-8000-000000000002",
          confirmation:
            emailConfirmation(),
          changes: {
            attendanceTotals: {
              operation:
                "replace",
              value: {
                adults21Plus: 0,
                youngAdults18To20:
                  1,
              },
            },
          },
        };

        const first =
          await submit(
            baseUrl,
            revisionBody,
          );
        const replay =
          await submit(
            baseUrl,
            revisionBody,
          );

        assert.equal(
          first.response.status,
          200,
        );
        assert.equal(
          first.payload.submission
            .action,
          "revision",
        );
        assert.equal(
          replay.response.status,
          200,
        );
        assert.equal(
          replay.payload.submission
            .idempotentRepeat,
          true,
        );
        assert.equal(
          replay.payload.submission
            .action,
          "revision",
        );
        assert.equal(
          (
            await rsvpStore
              .listRsvpVersions(
                "party-dev-archetype-b",
              )
          ).length,
          2,
        );
        assert.equal(
          deliveryCount,
          2,
        );
        assert.equal(
          (
            await rsvpStore
              .listDeliveryRecords(
                "party-dev-archetype-b",
              )
          ).length,
          2,
        );
      },
    );
  },
);

test(
  "new revision at the deadline returns 410 and preserves the previously stored current RSVP",
  async () => {
    const rsvpStore =
      createFixtureStore();

    let currentNow =
      OPEN_NOW;

    await withTestServer(
      standardOptions({
        rsvpStore,
        now: () => currentNow,
      }),
      async (baseUrl) => {
        assert.equal(
          (
            await submit(
              baseUrl,
              dev002CeremonyRequest({
                clientSubmissionId:
                  "70000000-0000-4000-8000-000000000001",
              }),
            )
          ).response.status,
          201,
        );

        currentNow =
          new Date(
            "2027-03-01T23:59:00-05:00",
          );

        const revision =
          await submit(
            baseUrl,
            {
              inviteCode:
                "DEV-002",
              clientSubmissionId:
                "70000000-0000-4000-8000-000000000002",
              confirmation:
                emailConfirmation(),
              changes: {},
            },
          );

        assert.equal(
          revision.response.status,
          410,
        );
        assert.equal(
          (
            await rsvpStore
              .listRsvpVersions(
                "party-dev-archetype-b",
              )
          ).length,
          1,
        );
        assert.equal(
          (
            await rsvpStore
              .getCurrentRsvp(
                "party-dev-archetype-b",
              )
          ).version,
          1,
        );
      },
    );
  },
);

test(
  "successful submission records private delivery channel, destinations, version, action, and independent statuses",
  async () => {
    const rsvpStore =
      createFixtureStore();

    await withTestServer(
      standardOptions({
        environment:
          makeTestEnvironment({
            RSVP_ADMIN_NOTIFICATION_EMAIL:
              "admin@example.com",
          }),
        rsvpStore,
        deliveryService: {
          async deliver() {
            return {
              guestDeliveryStatus:
                "sent",
              administrativeDeliveryStatus:
                "failed",
            };
          },
        },
      }),
      async (baseUrl) => {
        const result =
          await submit(
            baseUrl,
            ceremonyRequest({
              clientSubmissionId:
                "71000000-0000-4000-8000-000000000001",
            }),
          );

        assert.equal(
          result.response.status,
          201,
        );

        assert.deepEqual(
          await rsvpStore
            .listDeliveryRecords(
              "party-dev-archetype-a",
            ),
          [
            {
              recordedAt:
                OPEN_NOW.toISOString(),
              action: "initial",
              version: 1,
              mutationId:
                createMutationId(
                  "party-dev-archetype-a:71000000-0000-4000-8000-000000000001",
                ),
              guest: {
                method: "email",
                destination:
                  "guest@example.com",
                status: "sent",
              },
              administrative: {
                method: "email",
                destination:
                  "admin@example.com",
                status: "failed",
              },
            },
          ],
        );
      },
    );
  },
);

function withStoreOverrides(
  store,
  overrides,
) {
  return Object.freeze({
    ...store,
    ...overrides,
  });
}

test(
  "retry recovers a stored mutation when lifecycle persistence fails after the RSVP commit",
  async () => {
    const baseStore =
      createFixtureStore();
    let submissionWriteCount = 0;
    let failSecondSubmissionWrite =
      true;
    let deliveryCount = 0;

    const rsvpStore =
      withStoreOverrides(
        baseStore,
        {
          async setSubmissionRecord(
            key,
            record,
          ) {
            submissionWriteCount += 1;

            if (
              failSecondSubmissionWrite &&
              submissionWriteCount ===
                2
            ) {
              failSecondSubmissionWrite =
                false;
              throw new Error(
                "fictional lifecycle write failure",
              );
            }

            return baseStore
              .setSubmissionRecord(
                key,
                record,
              );
          },
        },
      );

    const body =
      ceremonyRequest({
        clientSubmissionId:
          "72000000-0000-4000-8000-000000000001",
      });

    await withTestServer(
      standardOptions({
        rsvpStore,
        deliveryService: {
          async deliver() {
            deliveryCount += 1;

            return {
              guestDeliveryStatus:
                "sent",
              administrativeDeliveryStatus:
                "sent",
            };
          },
        },
      }),
      async (baseUrl) => {
        const interrupted =
          await submit(
            baseUrl,
            body,
          );

        assert.equal(
          interrupted.response.status,
          503,
        );
        assert.equal(
          deliveryCount,
          0,
        );
        assert.equal(
          (
            await baseStore
              .listRsvpVersions(
                "party-dev-archetype-a",
              )
          ).length,
          1,
        );
        assert.equal(
          (
            await baseStore
              .getCurrentRsvp(
                "party-dev-archetype-a",
              )
          ).version,
          1,
        );

        const replay =
          await submit(
            baseUrl,
            body,
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
          deliveryCount,
          1,
        );
        assert.equal(
          (
            await baseStore
              .listRsvpVersions(
                "party-dev-archetype-a",
              )
          ).length,
          1,
        );
        assert.equal(
          (
            await baseStore
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
  "retry does not repeat delivery when completion persistence fails after the delivery record is stored",
  async () => {
    const baseStore =
      createFixtureStore();
    let submissionWriteCount = 0;
    let failCompletionWrite =
      true;
    let deliveryCount = 0;

    const rsvpStore =
      withStoreOverrides(
        baseStore,
        {
          async setSubmissionRecord(
            key,
            record,
          ) {
            submissionWriteCount += 1;

            if (
              failCompletionWrite &&
              submissionWriteCount ===
                4
            ) {
              failCompletionWrite =
                false;
              throw new Error(
                "fictional completion write failure",
              );
            }

            return baseStore
              .setSubmissionRecord(
                key,
                record,
              );
          },
        },
      );

    const body =
      ceremonyRequest({
        clientSubmissionId:
          "72000000-0000-4000-8000-000000000002",
      });

    await withTestServer(
      standardOptions({
        rsvpStore,
        deliveryService: {
          async deliver() {
            deliveryCount += 1;

            return {
              guestDeliveryStatus:
                "sent",
              administrativeDeliveryStatus:
                "sent",
            };
          },
        },
      }),
      async (baseUrl) => {
        const interrupted =
          await submit(
            baseUrl,
            body,
          );

        assert.equal(
          interrupted.response.status,
          503,
        );
        assert.equal(
          deliveryCount,
          1,
        );
        assert.equal(
          (
            await baseStore
              .listDeliveryRecords(
                "party-dev-archetype-a",
              )
          ).length,
          1,
        );

        const replay =
          await submit(
            baseUrl,
            body,
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
            .confirmation
            .guestDeliveryStatus,
          "sent",
        );
        assert.equal(
          deliveryCount,
          1,
        );
        assert.equal(
          (
            await baseStore
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
  "retry records uncertain delivery without resending when provider delivery completed but delivery history persistence failed",
  async () => {
    const baseStore =
      createFixtureStore();
    let failDeliveryRecord =
      true;
    let deliveryCount = 0;

    const rsvpStore =
      withStoreOverrides(
        baseStore,
        {
          async appendDeliveryRecord(
            partyId,
            record,
          ) {
            if (
              failDeliveryRecord
            ) {
              failDeliveryRecord =
                false;
              throw new Error(
                "fictional delivery record failure",
              );
            }

            return baseStore
              .appendDeliveryRecord(
                partyId,
                record,
              );
          },
        },
      );

    const body =
      ceremonyRequest({
        clientSubmissionId:
          "72000000-0000-4000-8000-000000000003",
      });

    await withTestServer(
      standardOptions({
        rsvpStore,
        deliveryService: {
          async deliver() {
            deliveryCount += 1;

            return {
              guestDeliveryStatus:
                "sent",
              administrativeDeliveryStatus:
                "sent",
            };
          },
        },
      }),
      async (baseUrl) => {
        const interrupted =
          await submit(
            baseUrl,
            body,
          );

        assert.equal(
          interrupted.response.status,
          503,
        );
        assert.equal(
          deliveryCount,
          1,
        );
        assert.equal(
          (
            await baseStore
              .listDeliveryRecords(
                "party-dev-archetype-a",
              )
          ).length,
          0,
        );

        const replay =
          await submit(
            baseUrl,
            body,
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
            .confirmation
            .guestDeliveryStatus,
          "uncertain",
        );
        assert.equal(
          replay.payload
            .confirmation
            .administrativeDeliveryStatus,
          "uncertain",
        );
        assert.equal(
          replay.payload
            .confirmation
            .deliveryWarning,
          true,
        );
        assert.equal(
          deliveryCount,
          1,
        );
        assert.equal(
          (
            await baseStore
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
  "a different logical mutation is refused while an interrupted submission for the same invitation remains pending",
  async () => {
    const baseStore =
      createFixtureStore();
    let failMutationCommit =
      true;

    const rsvpStore =
      withStoreOverrides(
        baseStore,
        {
          async commitRsvpMutation(
            partyId,
            mutation,
          ) {
            if (
              failMutationCommit
            ) {
              failMutationCommit =
                false;
              throw new Error(
                "fictional mutation commit failure",
              );
            }

            return baseStore
              .commitRsvpMutation(
                partyId,
                mutation,
              );
          },
        },
      );

    const pendingBody =
      ceremonyRequest({
        clientSubmissionId:
          "72000000-0000-4000-8000-000000000004",
      });
    const differentBody =
      ceremonyRequest({
        clientSubmissionId:
          "72000000-0000-4000-8000-000000000005",
      });

    await withTestServer(
      standardOptions({
        rsvpStore,
      }),
      async (baseUrl) => {
        const interrupted =
          await submit(
            baseUrl,
            pendingBody,
          );

        assert.equal(
          interrupted.response.status,
          503,
        );

        const blocked =
          await submit(
            baseUrl,
            differentBody,
          );

        assert.equal(
          blocked.response.status,
          503,
        );
        assert.equal(
          (
            await baseStore
              .listRsvpVersions(
                "party-dev-archetype-a",
              )
          ).length,
          0,
        );

        const recovered =
          await submit(
            baseUrl,
            pendingBody,
          );

        assert.equal(
          recovered.response.status,
          200,
        );
        assert.equal(
          recovered.payload
            .submission
            .idempotentRepeat,
          true,
        );
        assert.equal(
          (
            await baseStore
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
  "simultaneous distinct revisions for one invitation are serialized against the latest current RSVP",
  async () => {
    const rsvpStore =
      createFixtureStore();

    await withTestServer(
      standardOptions({
        rsvpStore,
      }),
      async (baseUrl) => {
        assert.equal(
          (
            await submit(
              baseUrl,
              dev002CeremonyRequest({
                clientSubmissionId:
                  "72000000-0000-4000-8000-000000000006",
              }),
            )
          ).response.status,
          201,
        );

        const firstRevision = {
          inviteCode:
            "DEV-002",
          clientSubmissionId:
            "72000000-0000-4000-8000-000000000007",
          confirmation: {
            method: "email",
            email:
              "first-revision@example.com",
          },
          changes: {},
        };
        const secondRevision = {
          inviteCode:
            "DEV-002",
          clientSubmissionId:
            "72000000-0000-4000-8000-000000000008",
          confirmation: {
            method: "email",
            email:
              "second-revision@example.com",
          },
          changes: {},
        };

        const results =
          await Promise.all([
            submit(
              baseUrl,
              firstRevision,
            ),
            submit(
              baseUrl,
              secondRevision,
            ),
          ]);

        assert.deepEqual(
          results.map(
            (result) =>
              result.response.status,
          ),
          [200, 200],
        );

        const versions =
          await rsvpStore
            .listRsvpVersions(
              "party-dev-archetype-b",
            );
        const current =
          await rsvpStore
            .getCurrentRsvp(
              "party-dev-archetype-b",
            );

        assert.deepEqual(
          versions.map(
            (record) =>
              record.version,
          ),
          [1, 2, 3],
        );
        assert.equal(
          current.version,
          3,
        );
        assert.equal(
          current.overallAttendance,
          1,
        );
        assert.deepEqual(
          current.attendeeDetails,
          [
            {
              attendeeName:
                "Example Guest 1",
            },
          ],
        );
      },
    );
  },
);