export const RSVP_TIMING_PHASES = Object.freeze({
  DEADLINE_ONLY: "deadline-only",
  COUNTDOWN: "countdown",
  CLOSED: "closed",
});

const SECOND_MS = 1_000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

function parseConfiguredInstant(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new TypeError(`${label} must be a non-empty ISO date-time string.`);
  }

  const timestamp = Date.parse(value);

  if (!Number.isFinite(timestamp)) {
    throw new RangeError(`${label} must be a valid ISO date-time string.`);
  }

  return timestamp;
}

function normalizeNow(now) {
  if (now instanceof Date) {
    const timestamp = now.getTime();

    if (!Number.isFinite(timestamp)) {
      throw new RangeError("now must be a valid Date or timestamp.");
    }

    return timestamp;
  }

  if (typeof now === "number" && Number.isFinite(now)) {
    return now;
  }

  throw new TypeError("now must be a valid Date or numeric timestamp.");
}

export function splitRemainingTime(remainingMilliseconds) {
  const safeRemaining = Math.max(0, Math.floor(remainingMilliseconds));

  const days = Math.floor(safeRemaining / DAY_MS);
  const afterDays = safeRemaining % DAY_MS;
  const hours = Math.floor(afterDays / HOUR_MS);
  const afterHours = afterDays % HOUR_MS;
  const minutes = Math.floor(afterHours / MINUTE_MS);
  const seconds = Math.floor((afterHours % MINUTE_MS) / SECOND_MS);

  return {
    days,
    hours,
    minutes,
    seconds,
  };
}

export function getRsvpTiming({
  now = new Date(),
  countdownStartIso,
  deadlineIso,
}) {
  const nowTimestamp = normalizeNow(now);
  const countdownStartTimestamp = parseConfiguredInstant(
    countdownStartIso,
    "countdownStartIso",
  );
  const deadlineTimestamp = parseConfiguredInstant(deadlineIso, "deadlineIso");

  if (countdownStartTimestamp >= deadlineTimestamp) {
    throw new RangeError("countdownStartIso must occur before deadlineIso.");
  }

  if (nowTimestamp >= deadlineTimestamp) {
    return {
      phase: RSVP_TIMING_PHASES.CLOSED,
      isClosed: true,
      showCountdown: false,
      remainingMilliseconds: 0,
      remaining: splitRemainingTime(0),
    };
  }

  const remainingMilliseconds = deadlineTimestamp - nowTimestamp;

  if (nowTimestamp < countdownStartTimestamp) {
    return {
      phase: RSVP_TIMING_PHASES.DEADLINE_ONLY,
      isClosed: false,
      showCountdown: false,
      remainingMilliseconds,
      remaining: splitRemainingTime(remainingMilliseconds),
    };
  }

  return {
    phase: RSVP_TIMING_PHASES.COUNTDOWN,
    isClosed: false,
    showCountdown: true,
    remainingMilliseconds,
    remaining: splitRemainingTime(remainingMilliseconds),
  };
}

function pluralize(value, singular, plural = `${singular}s`) {
  return `${value} ${value === 1 ? singular : plural}`;
}

export function formatRsvpCountdown(remaining) {
  if (!remaining || typeof remaining !== "object") {
    throw new TypeError("remaining must be a countdown-parts object.");
  }

  const values = [
    [remaining.days, "day"],
    [remaining.hours, "hour"],
    [remaining.minutes, "minute"],
    [remaining.seconds, "second"],
  ];

  if (values.some(([value]) => !Number.isInteger(value) || value < 0)) {
    throw new RangeError("Countdown parts must be non-negative whole numbers.");
  }

  return values.map(([value, label]) => pluralize(value, label)).join(", ");
}

export function getRsvpTimingRefreshDelay({
  now = new Date(),
  countdownStartIso,
  deadlineIso,
}) {
  const nowTimestamp = normalizeNow(now);
  const countdownStartTimestamp = parseConfiguredInstant(
    countdownStartIso,
    "countdownStartIso",
  );
  const deadlineTimestamp = parseConfiguredInstant(deadlineIso, "deadlineIso");

  if (countdownStartTimestamp >= deadlineTimestamp) {
    throw new RangeError("countdownStartIso must occur before deadlineIso.");
  }

  if (nowTimestamp >= deadlineTimestamp) {
    return null;
  }

  if (nowTimestamp < countdownStartTimestamp) {
    return Math.max(
      1,
      Math.min(MINUTE_MS, countdownStartTimestamp - nowTimestamp),
    );
  }

  return Math.max(1, Math.min(SECOND_MS, deadlineTimestamp - nowTimestamp));
}
