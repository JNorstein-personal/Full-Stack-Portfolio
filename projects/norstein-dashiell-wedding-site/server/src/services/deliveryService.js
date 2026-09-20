function createDeferredDeliveryService() {
  return Object.freeze({
    async deliver() {
      return Object.freeze({
        guestDeliveryStatus:
          "uncertain",
        administrativeDeliveryStatus:
          "uncertain",
      });
    },
  });
}

module.exports = {
  createDeferredDeliveryService,
};
