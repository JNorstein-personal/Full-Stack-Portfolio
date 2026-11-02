const test = require("node:test");
const assert = require("node:assert/strict");

const {
  parseAnalyticsDelta,
} = require(
  "../src/analytics/analyticsValidation",
);

test(
  "analytics validation accepts only the approved aggregate fields",
  () => {
    assert.deepEqual(
      parseAnalyticsDelta({
        pagePath:
          "/wedding/privacy",
        viewDelta: 1,
        visitorDelta: 1,
        engagementMs: 0,
      }),
      {
        pagePath:
          "/wedding/privacy",
        viewDelta: 1,
        visitorDelta: 1,
        engagementMs: 0,
      },
    );

    assert.equal(
      parseAnalyticsDelta({
        pagePath:
          "/wedding/privacy",
        viewDelta: 1,
        visitorDelta: 1,
        engagementMs: 0,
        email:
          "not-accepted@example.test",
      }),
      null,
    );
  },
);

test(
  "analytics validation rejects query strings, unknown pages, and invalid deltas",
  () => {
    assert.equal(
      parseAnalyticsDelta({
        pagePath:
          "/wedding/rsvp?code=ABC123",
        viewDelta: 1,
        visitorDelta: 1,
        engagementMs: 0,
      }),
      null,
    );

    assert.equal(
      parseAnalyticsDelta({
        pagePath:
          "/wedding/not-a-real-page",
        viewDelta: 1,
        visitorDelta: 0,
        engagementMs: 0,
      }),
      null,
    );

    assert.equal(
      parseAnalyticsDelta({
        pagePath:
          "/wedding/",
        viewDelta: 0,
        visitorDelta: 1,
        engagementMs: 0,
      }),
      null,
    );

    assert.equal(
      parseAnalyticsDelta({
        pagePath:
          "/wedding/",
        viewDelta: 0,
        visitorDelta: 0,
        engagementMs: 300001,
      }),
      null,
    );
  },
);
