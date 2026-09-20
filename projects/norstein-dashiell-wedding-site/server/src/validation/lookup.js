function parseLookupRequest(body) {
  if (
    body === null ||
    typeof body !== "object" ||
    Array.isArray(body)
  ) {
    return null;
  }

  const keys = Object.keys(body);

  if (
    keys.length !== 1 ||
    keys[0] !== "inviteCode"
  ) {
    return null;
  }

  return Object.freeze({
    inviteCode: body.inviteCode,
  });
}

module.exports = {
  parseLookupRequest,
};
