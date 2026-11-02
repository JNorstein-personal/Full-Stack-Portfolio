function cloneAggregate(
  aggregate,
) {
  return Object.freeze({
    pagePath:
      aggregate.pagePath,
    pageViews:
      aggregate.pageViews,
    anonymousVisitors:
      aggregate.anonymousVisitors,
    engagementMs:
      aggregate.engagementMs,
    averageEngagementSeconds:
      aggregate
        .averageEngagementSeconds,
  });
}

function createDevelopmentAnalyticsStore() {
  const aggregates =
    new Map();

  return Object.freeze({
    async applyDelta(delta) {
      const existing =
        aggregates.get(
          delta.pagePath,
        ) || {
          pagePath:
            delta.pagePath,
          pageViews: 0,
          anonymousVisitors: 0,
          engagementMs: 0,
          averageEngagementSeconds:
            0,
        };

      const next = {
        pagePath:
          delta.pagePath,
        pageViews:
          existing.pageViews +
          delta.viewDelta,
        anonymousVisitors:
          existing
            .anonymousVisitors +
          delta.visitorDelta,
        engagementMs:
          existing.engagementMs +
          delta.engagementMs,
        averageEngagementSeconds:
          0,
      };

      next.averageEngagementSeconds =
        next.pageViews > 0
          ? Number(
              (
                next.engagementMs /
                1000 /
                next.pageViews
              ).toFixed(2),
            )
          : 0;

      aggregates.set(
        delta.pagePath,
        next,
      );

      return cloneAggregate(next);
    },

    async readAggregate(
      pagePath,
    ) {
      const aggregate =
        aggregates.get(pagePath);

      return aggregate
        ? cloneAggregate(
            aggregate,
          )
        : null;
    },
  });
}

module.exports = {
  createDevelopmentAnalyticsStore,
};
