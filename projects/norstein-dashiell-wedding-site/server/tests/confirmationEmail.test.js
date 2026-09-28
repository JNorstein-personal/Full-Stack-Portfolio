const test = require("node:test");
const assert = require("node:assert/strict");

const {
  attendanceLabel,
  buildAdministrativeConfirmationEmail,
  buildGuestConfirmationEmail,
} = require("../src/services/confirmationEmail");

const GROUPED_CHILD_PROMPT =
  "We'd love for your family to celebrate with us this Mayday - will your kid(s) be accompanying you?";

const invitation = {
  partyDisplayName:
    "The Example Household",
  namedInvitees: [
    {
      id:
        "invitee-example-a",
      displayName:
        "Example Adult",
    },
    {
      id:
        "invitee-example-b",
      displayName:
        "Example Child",
    },
  ],
  additionalGuestAllocations: [
    {
      id:
        "plus1-example-a",
      kind: "plus1",
      prompt:
        "Will Example Adult be accompanied by a +1?",
      maximumCount: 1,
    },
  ],
};

const groupedChildrenInvitation = {
  partyDisplayName:
    "The Example Family",
  namedInvitees: [
    {
      id:
        "invitee-family-a",
      displayName:
        "Example Adult One",
    },
    {
      id:
        "invitee-family-b",
      displayName:
        "Example Adult Two",
    },
  ],
  additionalGuestAllocations: [
    {
      id:
        "allocation-family-children",
      kind:
        "unnamedChildren",
      prompt:
        GROUPED_CHILD_PROMPT,
      maximumCount: 2,
    },
  ],
};

const attendingRsvp = {
  eventAttendance: [
    "ceremony",
    "reception",
  ],
  namedInviteeResponses: {
    "invitee-example-a":
      "yes",
    "invitee-example-b":
      "yes",
  },
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
  attendeeDetails: [
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

function groupedChildrenRsvp({
  attending = "yes",
  count = 2,
} = {}) {
  const childCount =
    attending === "yes"
      ? count
      : 0;

  return {
    eventAttendance: [
      "ceremony",
      "reception",
    ],
    namedInviteeResponses: {
      "invitee-family-a":
        "yes",
      "invitee-family-b":
        "yes",
    },
    additionalGuestResponses: {
      "allocation-family-children":
        {
          attending,
          count: childCount,
        },
    },
    attendanceTotals: {
      adults21Plus: 2,
      youngAdults18To20: 0,
      children3To17:
        childCount,
      childrenUnder3: 0,
    },
    overallAttendance:
      2 + childCount,
    attendeeDetails: [
      {
        attendeeName:
          "Example Adult One",
        dietaryPreferences:
          "",
      },
      {
        attendeeName:
          "Example Adult Two",
        dietaryPreferences:
          "",
      },
      ...Array.from(
        {
          length: childCount,
        },
        (_, index) => ({
          attendeeName:
            `Example Child ${index + 1}`,
          dietaryPreferences:
            "",
        }),
      ),
    ],
    recordedAt:
      "2026-09-27T20:00:00.000Z",
    deadline:
      "2027-03-01T23:59:00-05:00",
  };
}

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
        "Named invitees:",
        "Example Adult: Yes",
        "Example Child: Yes",
        "Will Example Adult be accompanied by a +1? Yes",
        "Adults 21+: 2",
        "Children 3–17: 1",
        "Overall attendance: 3",
        "Attendee Details:",
        "Example Adult",
        "Example Companion",
        "Dietary or allergy information: Vegetarian",
        "Example Child",
        "2027-03-01T23:59:00-05:00",
        "help@example.com",
      ]
    ) {
      assert.equal(
        message.text.includes(
          expected,
        ),
        true,
        `Expected guest confirmation to include: ${expected}`,
      );
    }

    assert.equal(
      message.text.includes(
        "Reception attendees:",
      ),
      false,
    );
  },
);

test(
  "grouped unnamed-children Yes response renders the family prompt and attending count without synthetic child authorization lines",
  () => {
    const message =
      buildGuestConfirmationEmail({
        invitation:
          groupedChildrenInvitation,
        rsvp:
          groupedChildrenRsvp({
            attending: "yes",
            count: 2,
          }),
        action: "initial",
      });

    for (
      const expected of [
        GROUPED_CHILD_PROMPT,
        `${GROUPED_CHILD_PROMPT} Yes`,
        "Children attending: 2",
        "Children 3–17: 2",
        "Overall attendance: 4",
        "3. Example Child 1",
        "4. Example Child 2",
      ]
    ) {
      assert.equal(
        message.text.includes(
          expected,
        ),
        true,
        `Expected grouped-child confirmation to include: ${expected}`,
      );
    }

    for (
      const omitted of [
        "Invited child 1",
        "Invited child 2",
        "Will invited child 1 be attending?",
        "Will invited child 2 be attending?",
      ]
    ) {
      assert.equal(
        message.text.includes(
          omitted,
        ),
        false,
        `Expected grouped-child confirmation to omit: ${omitted}`,
      );
    }
  },
);

test(
  "grouped unnamed-children No response renders No and omits the child-count line",
  () => {
    const message =
      buildGuestConfirmationEmail({
        invitation:
          groupedChildrenInvitation,
        rsvp:
          groupedChildrenRsvp({
            attending: "no",
          }),
        action: "revision",
      });

    assert.equal(
      message.text.includes(
        `${GROUPED_CHILD_PROMPT} No`,
      ),
      true,
    );

    assert.equal(
      message.text.includes(
        "Children attending:",
      ),
      false,
    );

    assert.equal(
      message.text.includes(
        "Overall attendance: 2",
      ),
      true,
    );
  },
);

test(
  "Ceremony-only confirmation preserves attendee names without dietary or allergy output",
  () => {
    const ceremonyOnlyRsvp = {
      eventAttendance: [
        "ceremony",
      ],
      namedInviteeResponses: {
        "invitee-example-a":
          "yes",
        "invitee-example-b":
          "no",
      },
      additionalGuestResponses: {
        "plus1-example-a":
          "no",
      },
      attendanceTotals: {
        adults21Plus: 1,
        youngAdults18To20: 0,
        children3To17: 0,
        childrenUnder3: 0,
      },
      overallAttendance: 1,
      attendeeDetails: [
        {
          attendeeName:
            "Example Adult",
        },
      ],
      recordedAt:
        attendingRsvp.recordedAt,
      deadline:
        attendingRsvp.deadline,
    };

    const message =
      buildGuestConfirmationEmail({
        invitation,
        rsvp:
          ceremonyOnlyRsvp,
        action: "revision",
      });

    for (
      const expected of [
        "RSVP revision",
        "Attendance: Ceremony",
        "Example Adult: Yes",
        "Example Child: No",
        "Will Example Adult be accompanied by a +1? No",
        "Overall attendance: 1",
        "Attendee Details:",
        "1. Example Adult",
      ]
    ) {
      assert.equal(
        message.text.includes(
          expected,
        ),
        true,
        `Expected Ceremony-only confirmation to include: ${expected}`,
      );
    }

    assert.equal(
      message.text.includes(
        "Dietary or allergy information:",
      ),
      false,
    );
  },
);

test(
  "decline guest confirmation omits person responses, attendance totals, and attendee details",
  () => {
    const message =
      buildGuestConfirmationEmail({
        invitation: {
          ...invitation,
          namedInvitees: [],
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

    for (
      const omitted of [
        "Named invitees:",
        "Additional guests:",
        "Attendance totals:",
        "Overall attendance:",
        "Attendee Details:",
        "Dietary or allergy information:",
        "Children attending:",
      ]
    ) {
      assert.equal(
        message.text.includes(
          omitted,
        ),
        false,
        `Expected decline confirmation to omit: ${omitted}`,
      );
    }
  },
);

test(
  "administrative confirmation includes protected operational destination and complete corrected RSVP",
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
        "Named invitees:",
        "Example Adult: Yes",
        "Example Child: Yes",
        "Will Example Adult be accompanied by a +1? Yes",
        "Overall attendance: 3",
        "Attendee Details:",
        "Dietary or allergy information: Vegetarian",
      ]
    ) {
      assert.equal(
        message.text.includes(
          expected,
        ),
        true,
        `Expected administrative confirmation to include: ${expected}`,
      );
    }
  },
);

test(
  "administrative confirmation renders grouped unnamed-children response and count using guest-safe copy",
  () => {
    const message =
      buildAdministrativeConfirmationEmail({
        invitation:
          groupedChildrenInvitation,
        rsvp:
          groupedChildrenRsvp({
            attending: "yes",
            count: 2,
          }),
        action: "revision",
        confirmation: {
          method: "email",
          email:
            "family@example.com",
        },
      });

    for (
      const expected of [
        "family@example.com",
        `${GROUPED_CHILD_PROMPT} Yes`,
        "Children attending: 2",
        "Overall attendance: 4",
        "Example Child 1",
        "Example Child 2",
      ]
    ) {
      assert.equal(
        message.text.includes(
          expected,
        ),
        true,
        `Expected administrative grouped-child confirmation to include: ${expected}`,
      );
    }
  },
);