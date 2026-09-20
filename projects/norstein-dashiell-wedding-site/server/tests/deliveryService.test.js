const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createEmailDeliveryService,
} = require("../src/services/deliveryService");

const invitation = {
  partyDisplayName:
    "Example Guest",
  additionalGuestAllocations:
    [],
};

const rsvp = {
  eventAttendance: [
    "ceremony",
  ],
  attendanceTotals: {
    adults21Plus: 1,
    youngAdults18To20: 0,
    children3To17: 0,
    childrenUnder3: 0,
  },
  overallAttendance: 1,
  recordedAt:
    "2026-09-20T20:00:00.000Z",
  deadline:
    "2027-03-01T23:59:00-05:00",
};

function makeService(
  sendEmail,
) {
  return createEmailDeliveryService({
    emailTransport: {
      sendEmail,
    },
    administrativeEmail:
      "admin@example.com",
    fromEmail:
      "rsvp@example.com",
  });
}

test(
  "email delivery service requires transport and protected email configuration",
  () => {
    assert.throws(
      () =>
        createEmailDeliveryService({
          administrativeEmail:
            "admin@example.com",
          fromEmail:
            "rsvp@example.com",
        }),
      /transport/,
    );

    assert.throws(
      () =>
        createEmailDeliveryService({
          emailTransport: {
            async sendEmail() {},
          },
          fromEmail:
            "rsvp@example.com",
        }),
      /administrative recipient/,
    );

    assert.throws(
      () =>
        createEmailDeliveryService({
          emailTransport: {
            async sendEmail() {},
          },
          administrativeEmail:
            "admin@example.com",
        }),
      /sender address/,
    );
  },
);

test(
  "guest and administrative email attempts both report sent independently",
  async () => {
    const calls = [];

    const service =
      makeService(
        async (message) => {
          calls.push(message);
          return {
            status: "sent",
          };
        },
      );

    const result =
      await service.deliver({
        invitation,
        rsvp,
        confirmation: {
          method: "email",
          email:
            "guest@example.com",
        },
        action: "initial",
      });

    assert.deepEqual(
      result,
      {
        guestDeliveryStatus:
          "sent",
        administrativeDeliveryStatus:
          "sent",
      },
    );

    assert.equal(
      calls.length,
      2,
    );

    assert.deepEqual(
      new Set(
        calls.map(
          (call) => call.to,
        ),
      ),
      new Set([
        "guest@example.com",
        "admin@example.com",
      ]),
    );

    assert.equal(
      calls.every(
        (call) =>
          call.from ===
          "rsvp@example.com",
      ),
      true,
    );
  },
);

test(
  "guest transport exception does not prevent administrative delivery",
  async () => {
    const destinations = [];

    const service =
      makeService(
        async (message) => {
          destinations.push(
            message.to,
          );

          if (
            message.to ===
            "guest@example.com"
          ) {
            throw new Error(
              "fictional provider failure",
            );
          }

          return {
            status: "sent",
          };
        },
      );

    const result =
      await service.deliver({
        invitation,
        rsvp,
        confirmation: {
          method: "email",
          email:
            "guest@example.com",
        },
        action: "initial",
      });

    assert.deepEqual(
      result,
      {
        guestDeliveryStatus:
          "uncertain",
        administrativeDeliveryStatus:
          "sent",
      },
    );

    assert.deepEqual(
      new Set(destinations),
      new Set([
        "guest@example.com",
        "admin@example.com",
      ]),
    );
  },
);

test(
  "administrative transport exception does not prevent guest delivery",
  async () => {
    const service =
      makeService(
        async (message) => {
          if (
            message.to ===
            "admin@example.com"
          ) {
            throw new Error(
              "fictional provider failure",
            );
          }

          return {
            status: "sent",
          };
        },
      );

    const result =
      await service.deliver({
        invitation,
        rsvp,
        confirmation: {
          method: "email",
          email:
            "guest@example.com",
        },
        action: "revision",
      });

    assert.deepEqual(
      result,
      {
        guestDeliveryStatus:
          "sent",
        administrativeDeliveryStatus:
          "uncertain",
      },
    );
  },
);

test(
  "non-email guest confirmation remains uncertain while administrative email is still attempted",
  async () => {
    const calls = [];

    const service =
      makeService(
        async (message) => {
          calls.push(message);
          return {
            status: "sent",
          };
        },
      );

    const result =
      await service.deliver({
        invitation,
        rsvp,
        confirmation: {
          method:
            "textMessage",
          mobile:
            "+15555550123",
          smsAuthorization:
            true,
        },
        action: "initial",
      });

    assert.deepEqual(
      result,
      {
        guestDeliveryStatus:
          "uncertain",
        administrativeDeliveryStatus:
          "sent",
      },
    );

    assert.equal(
      calls.length,
      1,
    );
    assert.equal(
      calls[0].to,
      "admin@example.com",
    );
    assert.equal(
      calls[0].text.includes(
        "+15555550123",
      ),
      true,
    );
  },
);


test(
  "manual guest resend sends only the guest email and does not repeat the administrative message",
  async () => {
    const calls = [];

    const service =
      makeService(
        async (message) => {
          calls.push(message);
          return {
            status: "sent",
          };
        },
      );

    const status =
      await service.resendGuest({
        invitation,
        rsvp,
        confirmation: {
          method: "email",
          email:
            "guest@example.com",
        },
        action: "revision",
      });

    assert.equal(
      status,
      "sent",
    );
    assert.equal(
      calls.length,
      1,
    );
    assert.equal(
      calls[0].to,
      "guest@example.com",
    );
  },
);

test(
  "manual guest resend leaves disabled text-message delivery uncertain without sending email",
  async () => {
    const calls = [];

    const service =
      makeService(
        async (message) => {
          calls.push(message);
          return {
            status: "sent",
          };
        },
      );

    const status =
      await service.resendGuest({
        invitation,
        rsvp,
        confirmation: {
          method:
            "textMessage",
          mobile:
            "+15555550123",
          smsAuthorization:
            true,
        },
        action: "initial",
      });

    assert.equal(
      status,
      "uncertain",
    );
    assert.deepEqual(
      calls,
      [],
    );
  },
);
