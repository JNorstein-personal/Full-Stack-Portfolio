const {
  RSVP_STORAGE_METHODS,
  assertRsvpStorageContract,
} = require("./storageContract");

function createUnavailableStore() {
  const store = {};

  for (
    const methodName of
    RSVP_STORAGE_METHODS
  ) {
    store[methodName] =
      async () => {
        throw new Error(
          "RSVP storage is unavailable.",
        );
      };
  }

  assertRsvpStorageContract(store);

  return Object.freeze(store);
}

module.exports = {
  createUnavailableStore,
};
