const MAX_TRUST_PROXY_HOPS = 10;

function parseTrustProxySetting(value) {
  if (
    value === undefined ||
    value === null ||
    String(value).trim() === ""
  ) {
    return false;
  }

  const normalized =
    String(value).trim();

  if (
    normalized.toLowerCase() ===
      "true" ||
    normalized === "*"
  ) {
    throw new Error(
      "TRUST_PROXY must identify a bounded trusted proxy chain, not trust every proxy.",
    );
  }

  if (/^\d+$/.test(normalized)) {
    const hops =
      Number(normalized);

    if (
      !Number.isInteger(hops) ||
      hops < 1 ||
      hops >
        MAX_TRUST_PROXY_HOPS
    ) {
      throw new Error(
        `TRUST_PROXY hop count must be between 1 and ${MAX_TRUST_PROXY_HOPS}.`,
      );
    }

    return hops;
  }

  const entries =
    normalized
      .split(",")
      .map(
        (entry) =>
          entry.trim(),
      )
      .filter(Boolean);

  if (
    entries.length === 0 ||
    entries.some(
      (entry) =>
        entry.toLowerCase() ===
          "true" ||
        entry === "*",
    )
  ) {
    throw new Error(
      "TRUST_PROXY must contain only bounded proxy addresses, subnets, names, or a hop count.",
    );
  }

  return entries.length === 1
    ? entries[0]
    : Object.freeze(entries);
}

module.exports = {
  MAX_TRUST_PROXY_HOPS,
  parseTrustProxySetting,
};
