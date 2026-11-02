function createUnavailableAnalyticsStore() {
  return Object.freeze({
    async applyDelta() {
      throw new Error(
        "Anonymous site analytics storage is unavailable.",
      );
    },
  });
}

module.exports = {
  createUnavailableAnalyticsStore,
};
