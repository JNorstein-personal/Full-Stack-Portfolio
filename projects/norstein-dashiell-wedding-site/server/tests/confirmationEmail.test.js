const test = require("node:test");
const assert = require("node:assert/strict");

const {
  attendanceLabel,
  buildAdministrativeConfirmationEmail,
  buildGuestConfirmationEmail,
} = require("../src/services/confirmationEmail");

const invitation = {
  partyDisplayName:
    "The Example Household",
  additionalGuestAllocations: [
    {
      id:
        "plus1-example-a",
      prompt:
        "Will Example Adult be accompanied by a +1?",
    },
  ],
};

const attendingRsvp = {
  eventAttendance: [
    "ceremony",
    "reception",
  ],
  additionalGuestResponses: {
    "plus1-example-a":
      "yes",
  },
  attendanceTotals: {
    adults21Plus: 2,
    youngAdults18To20: 0,
    children3To17: 1,
    childrenUnder3: 0,
  },
  overallAttendance: 3,
  receptionAttendeeDetails: [
    {
      attendeeName:
        "Example Adult",
      dietaryPreferences:
        "",
    },
    {
      attendeeName:
        "Example Companion",
      dietaryPreferences:
        "Vegetarian",
    },
    {
      attendeeName:
        "Example Child",
      dietaryPreferences:
        "",
    },
  ],
  recordedAt:
    "2026-09-20T20:00:00.000Z",
  deadline:
    "2027-03-01T23:59:00-05:00",
};

test(
  "attendance labels cover combined attendance and decline",
  () => {
    assert.equal(
      attendanceLabel([
        "ceremony",
        "reception",
      ]),
      "Ceremony and Reception",
    );

    assert.equal(
      attendanceLabel([
        "decline",
      ]),
      "Regretfully unable to attend",
    );
  },
);

test(
  "guest confirmation email contains the complete current attending RSVP",
  () => {
    const message =
      buildGuestConfirmationEmail({
        invitation,
        rsvp:
          attendingRsvp,
        action: "initial",
        assistanceEmail:
          "help@example.com",
      });

    for (
      const expected of [
        "Initial RSVP",
        "Ceremony and Reception",
        "Will Example Adult be accompanied by a +1? Yes",
        "Adults 21+: 2",
        "Children 3–17: 1",
        "Overall attendance: 3",
        "Example Companion",
        "Vegetarian",
        "2027-03-01T23:59:00-05:00",
        "help@example.com",
      ]
    ) {
      assert.equal(
        message.text.includes(
          expected,
        ),
        true,
      );
    }
  },
);

test(
  "decline guest confirmation omits attendance totals and Reception detail sections",
  () => {
    const message =
      buildGuestConfirmationEmail({
        invitation: {
          ...invitation,
          additionalGuestAllocations:
            [],
        },
        rsvp: {
          eventAttendance: [
            "decline",
          ],
          recordedAt:
            attendingRsvp.recordedAt,
          deadline:
            attendingRsvp.deadline,
        },
        action: "revision",
      });

    assert.equal(
      message.text.includes(
        "RSVP revision",
      ),
      true,
    );
    assert.equal(
      message.text.includes(
        "Regretfully unable to attend",
      ),
      true,
    );
    assert.equal(
      message.text.includes(
        "Attendance totals:",
      ),
      false,
    );
    assert.equal(
      message.text.includes(
        "Reception attendees:",
      ),
      false,
    );
  },
);

test(
  "administrative confirmation includes protected operational destination and complete RSVP",
  () => {
    const message =
      buildAdministrativeConfirmationEmail({
        invitation,
        rsvp:
          attendingRsvp,
        action: "revision",
        confirmation: {
          method: "email",
          email:
            "guest@example.com",
        },
      });

    for (
      const expected of [
        "RSVP revision",
        "The Example Household",
        "guest@example.com",
        "Overall attendance: 3",
        "Vegetarian",
      ]
    ) {
      assert.equal(
        message.text.includes(
          expected,
        ),
        true,
      );
    }
  },
);
