const test = require("node:test");
const assert = require("node:assert/strict");
const {
  EventEmitter,
} = require("node:events");

const {
  classifyEndpoint,
  createSafeRequestAudit,
} = require("../src/middleware/requestAudit");

test(
  "safe request audit records only non-sensitive operational metadata",
  () => {
    const entries = [];
    let current = 1000;

    const middleware =
      createSafeRequestAudit({
        logger: {
          info(entry) {
            entries.push(entry);
          },
        },
        now: () => current,
        createCorrelationId:
          () =>
            "correlation-test",
      });

    const req = {
      method: "POST",
      originalUrl:
        "/wedding/api/rsvp/submit?do-not-log=query-secret",
      body: {
        inviteCode: "DEV001",
        clientSubmissionId:
          "private-submission-id",
        confirmation: {
          email:
            "guest@example.com",
        },
        changes: {
          dietaryPreferences:
            "private dietary text",
        },
      },
    };

    const res =
      new EventEmitter();
    res.statusCode = 201;

    let nextCalled = false;

    middleware(
      req,
      res,
      () => {
        nextCalled = true;
      },
    );

    assert.equal(
      nextCalled,
      true,
    );

    current = 1250;
    res.emit("finish");

    assert.deepEqual(
      entries,
      [
        {
          correlationId:
            "correlation-test",
          timestamp:
            "1970-01-01T00:00:01.000Z",
          endpointCategory:
            "rsvp_submit",
          httpStatus: 201,
          durationMs: 250,
        },
      ],
    );

    const serialized =
      JSON.stringify(entries);

    for (
      const sensitive of [
        "DEV001",
        "private-submission-id",
        "guest@example.com",
        "private dietary text",
        "query-secret",
      ]
    ) {
      assert.equal(
        serialized.includes(
          sensitive,
        ),
        false,
      );
    }
  },
);

test(
  "endpoint classification records only route categories rather than raw URLs",
  () => {
    assert.equal(
      classifyEndpoint({
        method: "POST",
        originalUrl:
          "/wedding/api/rsvp/lookup?secret=value",
      }),
      "rsvp_lookup",
    );

    assert.equal(
      classifyEndpoint({
        method: "GET",
        originalUrl:
          "/wedding/api/health",
      }),
      "api_health",
    );
  },
);
