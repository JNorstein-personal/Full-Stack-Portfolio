function isRsvpClosed(deadline, now) {
  const deadlineTime =
    Date.parse(deadline);

  const currentTime =
    now instanceof Date
      ? now.getTime()
      : Number(now);

  return currentTime >= deadlineTime;
}

module.exports = {
  isRsvpClosed,
};
