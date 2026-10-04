import assert from "node:assert/strict";
import test from "node:test";

import {
  RSVP_TIMING_PHASES,
  formatRsvpCountdown,
  getRsvpTiming,
  getRsvpTimingRefreshDelay,
  splitRemainingTime,
} from "../src/services/rsvpTiming.js";

const countdownStartIso = "2027-02-01T00:00:00-05:00";
const deadlineIso = "2027-03-01T23:59:00-05:00";

function timingAt(isoDateTime) {
  return getRsvpTiming({
    now: new Date(isoDateTime),
    countdownStartIso,
    deadlineIso,
  });
}

function refreshDelayAt(isoDateTime) {
  return getRsvpTimingRefreshDelay({
    now: new Date(isoDateTime),
    countdownStartIso,
    deadlineIso,
  });
}

test("before February 1 the RSVP shows the written deadline without a countdown", () => {
  const timing = timingAt("2027-01-31T23:59:59.999-05:00");

  assert.equal(timing.phase, RSVP_TIMING_PHASES.DEADLINE_ONLY);
  assert.equal(timing.isClosed, false);
  assert.equal(timing.showCountdown, false);
});

test("the final-month countdown begins exactly at February 1 midnight EST", () => {
  const timing = timingAt("2027-02-01T00:00:00-05:00");

  assert.equal(timing.phase, RSVP_TIMING_PHASES.COUNTDOWN);
  assert.equal(timing.isClosed, false);
  assert.equal(timing.showCountdown, true);
  assert.ok(timing.remainingMilliseconds > 0);
});

test("the countdown remains open one millisecond before the deadline", () => {
  const timing = timingAt("2027-03-01T23:58:59.999-05:00");

  assert.equal(timing.phase, RSVP_TIMING_PHASES.COUNTDOWN);
  assert.equal(timing.isClosed, false);
  assert.equal(timing.remainingMilliseconds, 1);
});

test("the RSVP closes exactly at the configured deadline", () => {
  const timing = timingAt("2027-03-01T23:59:00-05:00");

  assert.equal(timing.phase, RSVP_TIMING_PHASES.CLOSED);
  assert.equal(timing.isClosed, true);
  assert.equal(timing.showCountdown, false);
  assert.equal(timing.remainingMilliseconds, 0);
});

test("the RSVP remains closed after the configured deadline", () => {
  const timing = timingAt("2027-03-02T12:00:00-05:00");

  assert.equal(timing.phase, RSVP_TIMING_PHASES.CLOSED);
  assert.equal(timing.isClosed, true);
  assert.deepEqual(timing.remaining, {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
});

test("remaining milliseconds split into explicit day, hour, minute, and second parts", () => {
  const milliseconds =
    (((1 * 24 + 2) * 60 + 3) * 60 + 4) * 1000;

  assert.deepEqual(splitRemainingTime(milliseconds), {
    days: 1,
    hours: 2,
    minutes: 3,
    seconds: 4,
  });
});

test("countdown formatting produces readable explicit text", () => {
  assert.equal(
    formatRsvpCountdown({
      days: 1,
      hours: 2,
      minutes: 3,
      seconds: 4,
    }),
    "1 day, 2 hours, 3 minutes, 4 seconds",
  );

  assert.equal(
    formatRsvpCountdown({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 1,
    }),
    "0 days, 0 hours, 0 minutes, 1 second",
  );
});

test("pre-countdown refresh timing is bounded and lands on the exact start boundary", () => {
  assert.equal(
    refreshDelayAt("2026-10-03T12:00:00-04:00"),
    60_000,
  );

  assert.equal(
    refreshDelayAt("2027-01-31T23:59:59.500-05:00"),
    500,
  );
});

test("countdown refresh timing is bounded and lands on the exact deadline boundary", () => {
  assert.equal(
    refreshDelayAt("2027-02-15T12:00:00-05:00"),
    1_000,
  );

  assert.equal(
    refreshDelayAt("2027-03-01T23:58:59.500-05:00"),
    500,
  );

  assert.equal(
    refreshDelayAt("2027-03-01T23:59:00-05:00"),
    null,
  );
});

test("an invalid countdown configuration fails closed instead of guessing", () => {
  assert.throws(
    () =>
      getRsvpTiming({
        now: new Date("2027-01-01T00:00:00-05:00"),
        countdownStartIso: deadlineIso,
        deadlineIso,
      }),
    /must occur before/,
  );
});
