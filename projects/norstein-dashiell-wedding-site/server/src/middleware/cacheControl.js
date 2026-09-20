function rsvpNoStore(req, res, next) {
  res.set(
    "Cache-Control",
    "no-store, max-age=0",
  );

  next();
}

module.exports = {
  rsvpNoStore,
};
