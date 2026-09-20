const test = require("node:test");
const assert = require("node:assert/strict");

const {
  buildDeliveryRecord,
  buildResendRecord,
  confirmationDestination,
} = require("../src/services/deliveryRecord");

test(
  "confirmation destination selects only the active operational channel",
  () => {
    assert.equal(
      confirmationDestination({
        method: "email",
        email:
          "guest@example.com",
      }),
      "guest@example.com",
    );

    assert.equal(
      confirmationDestination({
        method:
          "textMessage",
        mobile:
          "+15555550123",
      }),
      "+15555550123",
    );
  },
);

test(
  "delivery record preserves private channel, destination, action, version, and independent results",
  () => {
    const record =
      buildDeliveryRecord({
        recordedAt:
          "2026-09-20T20:00:00.000Z",
        action: "revision",
        version: 3,
        confirmation: {
          method: "email",
          email:
            "guest@example.com",
        },
        administrativeEmail:
          "admin@example.com",
        delivery: {
          guestDeliveryStatus:
            "sent",
          administrativeDeliveryStatus:
            "failed",
        },
      });

    assert.deepEqual(
      record,
      {
        recordedAt:
          "2026-09-20T20:00:00.000Z",
        action: "revision",
        version: 3,
        guest: {
          method: "email",
          destination:
            "guest@example.com",
          status: "sent",
        },
        administrative: {
          method: "email",
          destination:
            "admin@example.com",
          status: "failed",
        },
      },
    );

    assert.equal(
      Object.isFrozen(
        record.guest,
      ),
      true,
    );
    assert.equal(
      Object.isFrozen(
        record.administrative,
      ),
      true,
    );
  },
);

test(
  "resend record is administrative delivery history rather than RSVP mutation state",
  () => {
    assert.deepEqual(
      buildResendRecord({
        recordedAt:
          "2026-09-20T20:05:00.000Z",
        version: 2,
        confirmation: {
          method: "email",
          email:
            "guest@example.com",
        },
        status: "uncertain",
      }),
      {
        recordedAt:
          "2026-09-20T20:05:00.000Z",
        requestedBy:
          "administrator",
        version: 2,
        guest: {
          method: "email",
          destination:
            "guest@example.com",
          status: "uncertain",
        },
      },
    );
  },
);
