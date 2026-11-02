const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createDevelopmentAnalyticsStore,
} = require(
  "../src/services/analytics/developmentAnalyticsStore",
);

test(
  "development analytics store retains only aggregate page metrics",
  async () => {
    const store =
      createDevelopmentAnalyticsStore();

    await store.applyDelta({
      pagePath:
        "/wedding/story",
      viewDelta: 1,
      visitorDelta: 1,
      engagementMs: 0,
    });

    await store.applyDelta({
      pagePath:
        "/wedding/story",
      viewDelta: 0,
      visitorDelta: 0,
      engagementMs: 12500,
    });

    await store.applyDelta({
      pagePath:
        "/wedding/story",
      viewDelta: 1,
      visitorDelta: 0,
      engagementMs: 7500,
    });

    assert.deepEqual(
      await store.readAggregate(
        "/wedding/story",
      ),
      {
        pagePath:
          "/wedding/story",
        pageViews: 2,
        anonymousVisitors: 1,
        engagementMs: 20000,
        averageEngagementSeconds:
          10,
      },
    );
  },
);
