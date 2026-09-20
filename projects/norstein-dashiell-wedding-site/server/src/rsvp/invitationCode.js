function normalizeInvitationCode(receivedValue) {
  const canonicalCode = String(receivedValue)
    .trim()
    .replace(/ /g, "")
    .replace(/-/g, "")
    .toUpperCase();

  if (!/^[A-Z0-9]{6}$/.test(canonicalCode)) {
    return null;
  }

  return Object.freeze({
    canonicalCode,
    displayCode:
      `${canonicalCode.slice(0, 3)}-${canonicalCode.slice(3)}`,
  });
}

module.exports = {
  normalizeInvitationCode,
};