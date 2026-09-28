const test = require("node:test");
const assert = require("node:assert/strict");

const {
  parseConfirmation,
  parseSubmitRequest,
  validateInitialChanges,
  validateRevisionChanges,
} = require("../src/validation/submit");

const invitation = Object.freeze({
  maximumAttendance: 3,
  namedInvitees: Object.freeze([
    Object.freeze({
      id: "invitee-example-a",
      displayName: "Example Guest One",
    }),
    Object.freeze({
      id: "invitee-example-b",
      displayName: "Example Guest Two",
    }),
  ]),
  additionalGuestAllocations: Object.freeze([
    Object.freeze({
      id: "plus1-example-a",
      kind: "plus1",
      prompt:
        "Will Example Guest One be accompanied by a +1?",
      maximumCount: 1,
    }),
  ]),
});

const noPlusOneInvitation = Object.freeze({
  maximumAttendance: 2,
  namedInvitees:
    invitation.namedInvitees,
  additionalGuestAllocations:
    Object.freeze([]),
});

const groupedChildrenInvitation =
  Object.freeze({
    maximumAttendance: 4,
    namedInvitees:
      invitation.namedInvitees,
    additionalGuestAllocations:
      Object.freeze([
        Object.freeze({
          id:
            "allocation-children-a",
          kind:
            "unnamedChildren",
          prompt:
            "We'd love for your family to celebrate with us this Mayday - will your kid(s) be accompanying you?",
          maximumCount: 2,
        }),
      ]),
  });

const mixedAllocationInvitation =
  Object.freeze({
    maximumAttendance: 5,
    namedInvitees:
      invitation.namedInvitees,
    additionalGuestAllocations:
      Object.freeze([
        Object.freeze({
          id:
            "plus1-example-a",
          kind: "plus1",
          prompt:
            "Will Example Guest One be accompanied by a +1?",
          maximumCount: 1,
        }),
        Object.freeze({
          id:
            "allocation-children-a",
          kind:
            "unnamedChildren",
          prompt:
            "We'd love for your family to celebrate with us this Mayday - will your kid(s) be accompanying you?",
          maximumCount: 2,
        }),
      ]),
  });

function replace(value) {
  return {
    operation: "replace",
    value,
  };
}

function makeInitialAttendingChanges({
  eventAttendance = [
    "ceremony",
  ],
  namedInviteeResponses = {
    "invitee-example-a":
      "yes",
    "invitee-example-b":
      "no",
  },
  additionalGuestResponses = {
    "plus1-example-a":
      "no",
  },
  attendanceTotals = {
    adults21Plus: 1,
    youngAdults18To20: 0,
    children3To17: 0,
    childrenUnder3: 0,
  },
  attendeeDetails = [
    {
      attendeeName:
        "Example Guest One",
    },
  ],
} = {}) {
  return {
    eventAttendance:
      replace(
        eventAttendance,
      ),
    namedInviteeResponses:
      replace(
        namedInviteeResponses,
      ),
    additionalGuestResponses:
      replace(
        additionalGuestResponses,
      ),
    attendanceTotals:
      replace(
        attendanceTotals,
      ),
    attendeeDetails:
      replace(
        attendeeDetails,
      ),
  };
}

function makeGroupedChildrenChanges({
  childResponse = {
    attending: "yes",
    count: 2,
  },
  namedInviteeResponses = {
    "invitee-example-a":
      "yes",
    "invitee-example-b":
      "no",
  },
  attendanceTotals = {
    adults21Plus: 1,
    youngAdults18To20: 0,
    children3To17: 2,
    childrenUnder3: 0,
  },
  attendeeDetails = [
    {
      attendeeName:
        "Example Guest One",
    },
    {
      attendeeName:
        "Example Child One",
    },
    {
      attendeeName:
        "Example Child Two",
    },
  ],
  eventAttendance = [
    "ceremony",
  ],
} = {}) {
  return {
    eventAttendance:
      replace(
        eventAttendance,
      ),
    namedInviteeResponses:
      replace(
        namedInviteeResponses,
      ),
    additionalGuestResponses:
      replace({
        "allocation-children-a":
          childResponse,
      }),
    attendanceTotals:
      replace(
        attendanceTotals,
      ),
    attendeeDetails:
      replace(
        attendeeDetails,
      ),
  };
}

function makeMixedAllocationChanges({
  namedInviteeResponses = {
    "invitee-example-a":
      "yes",
    "invitee-example-b":
      "no",
  },
  plus1Response = "yes",
  childResponse = {
    attending: "yes",
    count: 2,
  },
  attendanceTotals = {
    adults21Plus: 2,
    youngAdults18To20: 0,
    children3To17: 2,
    childrenUnder3: 0,
  },
  attendeeDetails = [
    {
      attendeeName:
        "Example Guest One",
    },
    {
      attendeeName:
        "Example Companion",
    },
    {
      attendeeName:
        "Example Child One",
    },
    {
      attendeeName:
        "Example Child Two",
    },
  ],
} = {}) {
  return {
    eventAttendance:
      replace([
        "ceremony",
      ]),
    namedInviteeResponses:
      replace(
        namedInviteeResponses,
      ),
    additionalGuestResponses:
      replace({
        "plus1-example-a":
          plus1Response,
        "allocation-children-a":
          childResponse,
      }),
    attendanceTotals:
      replace(
        attendanceTotals,
      ),
    attendeeDetails:
      replace(
        attendeeDetails,
      ),
  };
}

test(
  "submit parser accepts only the exact four-property envelope and UUID-form identifier",
  () => {
    const parsed =
      parseSubmitRequest({
        inviteCode: 123456,
        clientSubmissionId:
          "2bc9b79c-b707-4e10-a488-8d9575b961f5",
        confirmation: {
          method: "email",
          email:
            "guest@example.com",
        },
        changes: {},
      });

    assert.equal(
      parsed.ok,
      true,
    );

    assert.equal(
      parsed.value
        .inviteCode,
      123456,
    );

    for (
      const body of [
        {
          inviteCode:
            "DEV001",
          confirmation: {},
          changes: {},
        },
        {
          inviteCode:
            "DEV001",
          clientSubmissionId:
            "not-a-uuid",
          confirmation: {},
          changes: {},
        },
        {
          inviteCode:
            "DEV001",
          clientSubmissionId:
            "2bc9b79c-b707-4e10-a488-8d9575b961f5",
          confirmation: {},
          changes: {},
          expectedVersion: 1,
        },
      ]
    ) {
      assert.equal(
        parseSubmitRequest(
          body,
        ).ok,
        false,
      );
    }
  },
);

test(
  "email confirmation is strict and does not accept contradictory channel properties",
  () => {
    assert.deepEqual(
      parseConfirmation(
        {
          method: "email",
          email:
            "guest@example.com",
        },
        {
          textMessage: false,
          smsAuthorizationRequired:
            false,
        },
      ),
      {
        ok: true,
        value: {
          method: "email",
          email:
            "guest@example.com",
        },
      },
    );

    assert.equal(
      parseConfirmation(
        {
          method: "email",
          email: "invalid",
        },
        {
          textMessage: false,
        },
      ).status,
      400,
    );

    assert.equal(
      parseConfirmation(
        {
          method: "email",
          email:
            "guest@example.com",
          mobile:
            "+15555550123",
        },
        {
          textMessage: false,
        },
      ).status,
      400,
    );
  },
);

test(
  "text-message confirmation enforces channel authorization and required transactional authorization",
  () => {
    assert.equal(
      parseConfirmation(
        {
          method:
            "textMessage",
          mobile:
            "+15555550123",
        },
        {
          textMessage: false,
          smsAuthorizationRequired:
            false,
        },
      ).status,
      403,
    );

    assert.equal(
      parseConfirmation(
        {
          method:
            "textMessage",
          mobile:
            "+15555550123",
        },
        {
          textMessage: true,
          smsAuthorizationRequired:
            true,
        },
      ).status,
      400,
    );

    assert.equal(
      parseConfirmation(
        {
          method:
            "textMessage",
          mobile:
            "+15555550123",
          smsAuthorization:
            true,
        },
        {
          textMessage: true,
          smsAuthorizationRequired:
            true,
        },
      ).ok,
      true,
    );
  },
);

test(
  "event attendance accepts the four closed-set states and canonicalizes combined ordering",
  () => {
    for (
      const value of [
        ["ceremony"],
        ["reception"],
        [
          "ceremony",
          "reception",
        ],
        ["decline"],
      ]
    ) {
      const changes =
        value[0] ===
        "decline"
          ? {
              eventAttendance:
                replace(
                  value,
                ),
            }
          : makeInitialAttendingChanges(
              {
                eventAttendance:
                  value,
                attendeeDetails:
                  value.includes(
                    "reception",
                  )
                    ? [
                        {
                          attendeeName:
                            "Example Guest One",
                          dietaryPreferences:
                            "",
                        },
                      ]
                    : [
                        {
                          attendeeName:
                            "Example Guest One",
                        },
                      ],
              },
            );

      assert.equal(
        validateInitialChanges(
          changes,
          invitation,
        ).ok,
        true,
      );
    }

    const reversed =
      validateInitialChanges(
        makeInitialAttendingChanges(
          {
            eventAttendance: [
              "reception",
              "ceremony",
            ],
            attendeeDetails: [
              {
                attendeeName:
                  "Example Guest One",
                dietaryPreferences:
                  "",
              },
            ],
          },
        ),
        invitation,
      );

    assert.deepEqual(
      reversed.value
        .eventAttendance,
      [
        "ceremony",
        "reception",
      ],
    );
  },
);

test(
  "contradictory, empty, duplicate, or unknown attendance is rejected",
  () => {
    for (
      const value of [
        [],
        [
          "decline",
          "ceremony",
        ],
        [
          "decline",
          "reception",
        ],
        [
          "ceremony",
          "ceremony",
        ],
        ["unknown"],
      ]
    ) {
      assert.equal(
        validateInitialChanges(
          {
            eventAttendance:
              replace(
                value,
              ),
          },
          invitation,
        ).status,
        400,
      );
    }
  },
);

test(
  "initial attending response requires one valid response for every authorized named invitee",
  () => {
    const missing =
      makeInitialAttendingChanges();

    delete missing
      .namedInviteeResponses;

    assert.equal(
      validateInitialChanges(
        missing,
        invitation,
      ).status,
      400,
    );

    const incomplete =
      makeInitialAttendingChanges(
        {
          namedInviteeResponses:
            {
              "invitee-example-a":
                "yes",
            },
        },
      );

    assert.equal(
      validateInitialChanges(
        incomplete,
        invitation,
      ).status,
      400,
    );
  },
);

test(
  "initial attending response requires every authorized Plus1 allocation response",
  () => {
    const changes =
      makeInitialAttendingChanges();

    delete changes
      .additionalGuestResponses;

    assert.equal(
      validateInitialChanges(
        changes,
        invitation,
      ).status,
      400,
    );
  },
);

test(
  "unknown named-invitee and Plus1 identifiers are forbidden",
  () => {
    assert.equal(
      validateInitialChanges(
        makeInitialAttendingChanges(
          {
            namedInviteeResponses:
              {
                "invitee-example-a":
                  "yes",
                "not-authorized":
                  "no",
              },
          },
        ),
        invitation,
      ).status,
      403,
    );

    assert.equal(
      validateInitialChanges(
        makeInitialAttendingChanges(
          {
            additionalGuestResponses:
              {
                "not-authorized":
                  "no",
              },
          },
        ),
        invitation,
      ).status,
      403,
    );
  },
);

test(
  "party with no Plus1 allocations must omit additionalGuestResponses",
  () => {
    const changes =
      makeInitialAttendingChanges();

    assert.equal(
      validateInitialChanges(
        changes,
        noPlusOneInvitation,
      ).status,
      403,
    );

    delete changes
      .additionalGuestResponses;

    assert.equal(
      validateInitialChanges(
        changes,
        noPlusOneInvitation,
      ).ok,
      true,
    );
  },
);

test(
  "overall attendance is derived from person-level Yes responses and age totals must match it exactly",
  () => {
    const validResult =
      validateInitialChanges(
        makeInitialAttendingChanges(
          {
            namedInviteeResponses:
              {
                "invitee-example-a":
                  "yes",
                "invitee-example-b":
                  "yes",
              },
            additionalGuestResponses:
              {
                "plus1-example-a":
                  "no",
              },
            attendanceTotals:
              {
                adults21Plus: 2,
                youngAdults18To20:
                  0,
                children3To17:
                  0,
                childrenUnder3:
                  0,
              },
            attendeeDetails: [
              {
                attendeeName:
                  "Example Guest One",
              },
              {
                attendeeName:
                  "Example Guest Two",
              },
            ],
          },
        ),
        invitation,
      );

    assert.equal(
      validResult.ok,
      true,
    );

    assert.equal(
      validResult.value
        .overallAttendance,
      2,
    );

    assert.equal(
      validateInitialChanges(
        makeInitialAttendingChanges(
          {
            attendanceTotals:
              {
                adults21Plus: 2,
                youngAdults18To20:
                  0,
                children3To17:
                  0,
                childrenUnder3:
                  0,
              },
          },
        ),
        invitation,
      ).status,
      400,
    );

    assert.equal(
      validateInitialChanges(
        makeInitialAttendingChanges(
          {
            namedInviteeResponses:
              {
                "invitee-example-a":
                  "no",
                "invitee-example-b":
                  "no",
              },
            additionalGuestResponses:
              {
                "plus1-example-a":
                  "no",
              },
            attendanceTotals:
              {
                adults21Plus: 0,
                youngAdults18To20:
                  0,
                children3To17:
                  0,
                childrenUnder3:
                  0,
              },
            attendeeDetails: [],
          },
        ),
        invitation,
      ).status,
      400,
    );
  },
);

test(
  "attendance totals require all four nonnegative whole-number categories",
  () => {
    for (
      const totals of [
        {
          adults21Plus: 1,
          youngAdults18To20:
            0,
          children3To17: 0,
        },
        {
          adults21Plus: -1,
          youngAdults18To20:
            0,
          children3To17: 0,
          childrenUnder3: 2,
        },
        {
          adults21Plus: 1.5,
          youngAdults18To20:
            0,
          children3To17: 0,
          childrenUnder3: 0,
        },
      ]
    ) {
      assert.equal(
        validateInitialChanges(
          makeInitialAttendingChanges(
            {
              attendanceTotals:
                totals,
            },
          ),
          invitation,
        ).status,
        400,
      );
    }
  },
);

test(
  "attendeeDetails is required for every attending state and must match derived attendance exactly",
  () => {
    const missing =
      makeInitialAttendingChanges();

    delete missing
      .attendeeDetails;

    assert.equal(
      validateInitialChanges(
        missing,
        invitation,
      ).status,
      400,
    );

    assert.equal(
      validateInitialChanges(
        makeInitialAttendingChanges(
          {
            namedInviteeResponses:
              {
                "invitee-example-a":
                  "yes",
                "invitee-example-b":
                  "yes",
              },
            attendanceTotals:
              {
                adults21Plus: 2,
                youngAdults18To20:
                  0,
                children3To17:
                  0,
                childrenUnder3:
                  0,
              },
            attendeeDetails: [
              {
                attendeeName:
                  "Only One",
              },
            ],
          },
        ),
        invitation,
      ).status,
      400,
    );
  },
);

test(
  "Ceremony-only attendee details require names and reject Reception-only dietary fields",
  () => {
    assert.equal(
      validateInitialChanges(
        makeInitialAttendingChanges(
          {
            attendeeDetails: [
              {
                attendeeName:
                  "   ",
              },
            ],
          },
        ),
        invitation,
      ).status,
      400,
    );

    assert.equal(
      validateInitialChanges(
        makeInitialAttendingChanges(
          {
            attendeeDetails: [
              {
                attendeeName:
                  "Example Guest One",
                dietaryPreferences:
                  "Vegetarian",
              },
            ],
          },
        ),
        invitation,
      ).status,
      403,
    );
  },
);

test(
  "Reception attendee details accept optional dietary or allergy information",
  () => {
    const result =
      validateInitialChanges(
        makeInitialAttendingChanges(
          {
            eventAttendance: [
              "reception",
            ],
            attendeeDetails: [
              {
                attendeeName:
                  "Example Guest One",
                dietaryPreferences:
                  "",
              },
            ],
          },
        ),
        invitation,
      );

    assert.equal(
      result.ok,
      true,
    );

    assert.equal(
      result.value
        .attendeeDetails[0]
        .dietaryPreferences,
      "",
    );
  },
);

test(
  "full decline rejects attendance-dependent substantive data",
  () => {
    const result =
      validateInitialChanges(
        {
          eventAttendance:
            replace([
              "decline",
            ]),
          namedInviteeResponses:
            replace({
              "invitee-example-a":
                "no",
              "invitee-example-b":
                "no",
            }),
        },
        invitation,
      );

    assert.equal(
      result.status,
      400,
    );
  },
);

test(
  "unknown substantive regions, client-writable overallAttendance, and generic clear operations are forbidden",
  () => {
    assert.equal(
      validateInitialChanges(
        {
          ...makeInitialAttendingChanges(),
          overallAttendance:
            replace(1),
        },
        invitation,
      ).status,
      403,
    );

    assert.equal(
      validateInitialChanges(
        {
          eventAttendance: {
            operation: "clear",
          },
        },
        invitation,
      ).status,
      403,
    );
  },
);

function makeCurrentReceptionRsvp() {
  return {
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
          "Example Guest One",
        dietaryPreferences:
          "",
      },
      {
        attendeeName:
          "Example Guest Two",
        dietaryPreferences:
          "Vegetarian",
      },
      {
        attendeeName:
          "Example Companion",
        dietaryPreferences:
          "",
      },
    ],
  };
}

test(
  "revision with no substantive changes preserves the complete current substantive state",
  () => {
    const current =
      makeCurrentReceptionRsvp();

    const result =
      validateRevisionChanges(
        {},
        invitation,
        current,
      );

    assert.equal(
      result.ok,
      true,
    );

    assert.deepEqual(
      result.value,
      current,
    );
  },
);

test(
  "revision partially replaces attendance totals and treats explicit zero as a replacement",
  () => {
    const current =
      makeCurrentReceptionRsvp();

    const result =
      validateRevisionChanges(
        {
          attendanceTotals:
            replace({
              adults21Plus: 3,
              children3To17:
                0,
            }),
        },
        invitation,
        current,
      );

    assert.equal(
      result.ok,
      true,
    );

    assert.deepEqual(
      result.value
        .attendanceTotals,
      {
        adults21Plus: 3,
        youngAdults18To20: 0,
        children3To17: 0,
        childrenUnder3: 0,
      },
    );

    assert.equal(
      result.value
        .overallAttendance,
      3,
    );
  },
);

test(
  "same-count named-invitee composition change requires complete attendeeDetails replacement",
  () => {
    const current = {
      eventAttendance: [
        "reception",
      ],
      namedInviteeResponses: {
        "invitee-example-a":
          "yes",
        "invitee-example-b":
          "no",
      },
      additionalGuestResponses:
        {
          "plus1-example-a":
            "yes",
        },
      attendanceTotals: {
        adults21Plus: 2,
        youngAdults18To20: 0,
        children3To17: 0,
        childrenUnder3: 0,
      },
      overallAttendance: 2,
      attendeeDetails: [
        {
          attendeeName:
            "Example Guest One",
          dietaryPreferences:
            "",
        },
        {
          attendeeName:
            "Example Companion",
          dietaryPreferences:
            "",
        },
      ],
    };

    assert.equal(
      validateRevisionChanges(
        {
          namedInviteeResponses:
            replace({
              "invitee-example-a":
                "no",
              "invitee-example-b":
                "yes",
            }),
        },
        invitation,
        current,
      ).status,
      400,
    );

    const replacement =
      validateRevisionChanges(
        {
          namedInviteeResponses:
            replace({
              "invitee-example-a":
                "no",
              "invitee-example-b":
                "yes",
            }),
          attendeeDetails:
            replace([
              {
                attendeeName:
                  "Example Guest Two",
                dietaryPreferences:
                  "",
              },
              {
                attendeeName:
                  "Example Companion",
                dietaryPreferences:
                  "",
              },
            ]),
        },
        invitation,
        current,
      );

    assert.equal(
      replacement.ok,
      true,
    );

    assert.equal(
      replacement.value
        .overallAttendance,
      2,
    );
  },
);

test(
  "revision partially replaces authorized Plus1 responses and requires totals and details when attendance count changes",
  () => {
    const current =
      makeCurrentReceptionRsvp();

    assert.equal(
      validateRevisionChanges(
        {
          additionalGuestResponses:
            replace({
              "plus1-example-a":
                "no",
            }),
        },
        invitation,
        current,
      ).status,
      400,
    );

    const result =
      validateRevisionChanges(
        {
          additionalGuestResponses:
            replace({
              "plus1-example-a":
                "no",
            }),
          attendanceTotals:
            replace({
              adults21Plus: 2,
              children3To17:
                0,
            }),
          attendeeDetails:
            replace([
              {
                attendeeName:
                  "Example Guest One",
                dietaryPreferences:
                  "",
              },
              {
                attendeeName:
                  "Example Guest Two",
                dietaryPreferences:
                  "Vegetarian",
              },
            ]),
        },
        invitation,
        current,
      );

    assert.equal(
      result.ok,
      true,
    );

    assert.equal(
      result.value
        .overallAttendance,
      2,
    );
  },
);

test(
  "revision to full decline automatically clears attendance-dependent substantive data",
  () => {
    const result =
      validateRevisionChanges(
        {
          eventAttendance:
            replace([
              "decline",
            ]),
        },
        invitation,
        makeCurrentReceptionRsvp(),
      );

    assert.deepEqual(
      result,
      {
        ok: true,
        value: {
          eventAttendance: [
            "decline",
          ],
        },
      },
    );
  },
);

test(
  "decline-to-attending revision requires all newly applicable person responses, totals, and attendee details",
  () => {
    const current = {
      eventAttendance: [
        "decline",
      ],
    };

    assert.equal(
      validateRevisionChanges(
        {
          eventAttendance:
            replace([
              "ceremony",
            ]),
        },
        invitation,
        current,
      ).status,
      400,
    );

    const validResult =
      validateRevisionChanges(
        makeInitialAttendingChanges(),
        invitation,
        current,
      );

    assert.equal(
      validResult.ok,
      true,
    );
  },
);

test(
  "removing Reception preserves attendee names while clearing dietary information",
  () => {
    const result =
      validateRevisionChanges(
        {
          eventAttendance:
            replace([
              "ceremony",
            ]),
        },
        invitation,
        makeCurrentReceptionRsvp(),
      );

    assert.equal(
      result.ok,
      true,
    );

    assert.deepEqual(
      result.value
        .attendeeDetails,
      [
        {
          attendeeName:
            "Example Guest One",
        },
        {
          attendeeName:
            "Example Guest Two",
        },
        {
          attendeeName:
            "Example Companion",
        },
      ],
    );
  },
);

test(
  "adding Reception without changing attendee composition may preserve existing attendee names",
  () => {
    const current = {
      eventAttendance: [
        "ceremony",
      ],
      namedInviteeResponses: {
        "invitee-example-a":
          "yes",
        "invitee-example-b":
          "no",
      },
      additionalGuestResponses:
        {
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
            "Example Guest One",
        },
      ],
    };

    const result =
      validateRevisionChanges(
        {
          eventAttendance:
            replace([
              "ceremony",
              "reception",
            ]),
        },
        invitation,
        current,
      );

    assert.equal(
      result.ok,
      true,
    );

    assert.deepEqual(
      result.value
        .attendeeDetails,
      [
        {
          attendeeName:
            "Example Guest One",
        },
      ],
    );
  },
);

test(
  "revision rejects unauthorized person identifiers and dietary information in a non-Reception resulting state",
  () => {
    const current = {
      eventAttendance: [
        "ceremony",
      ],
      namedInviteeResponses: {
        "invitee-example-a":
          "yes",
        "invitee-example-b":
          "no",
      },
      additionalGuestResponses:
        {
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
            "Example Guest One",
        },
      ],
    };

    assert.equal(
      validateRevisionChanges(
        {
          namedInviteeResponses:
            replace({
              "unknown-invitee":
                "yes",
            }),
        },
        invitation,
        current,
      ).status,
      403,
    );

    assert.equal(
      validateRevisionChanges(
        {
          attendeeDetails:
            replace([
              {
                attendeeName:
                  "Example Guest One",
                dietaryPreferences:
                  "Vegetarian",
              },
            ]),
        },
        invitation,
        current,
      ).status,
      403,
    );
  },
);

test(
  "grouped unnamed-children allocation uses maximumCount as person capacity rather than allocation-object count",
  () => {
    const result =
      validateInitialChanges(
        makeGroupedChildrenChanges(),
        groupedChildrenInvitation,
      );

    assert.equal(
      result.ok,
      true,
    );

    assert.equal(
      groupedChildrenInvitation
        .namedInvitees.length,
      2,
    );

    assert.equal(
      groupedChildrenInvitation
        .additionalGuestAllocations
        .length,
      1,
    );

    assert.equal(
      groupedChildrenInvitation
        .additionalGuestAllocations[0]
        .maximumCount,
      2,
    );

    assert.equal(
      result.value
        .overallAttendance,
      3,
    );
  },
);

test(
  "grouped unnamed-children No response requires count zero and contributes no attendance",
  () => {
    const result =
      validateInitialChanges(
        makeGroupedChildrenChanges({
          childResponse: {
            attending: "no",
            count: 0,
          },
          attendanceTotals: {
            adults21Plus: 1,
            youngAdults18To20:
              0,
            children3To17: 0,
            childrenUnder3: 0,
          },
          attendeeDetails: [
            {
              attendeeName:
                "Example Guest One",
            },
          ],
        }),
        groupedChildrenInvitation,
      );

    assert.equal(
      result.ok,
      true,
    );

    assert.deepEqual(
      result.value
        .additionalGuestResponses[
          "allocation-children-a"
        ],
      {
        attending: "no",
        count: 0,
      },
    );

    assert.equal(
      result.value
        .overallAttendance,
      1,
    );
  },
);

test(
  "grouped unnamed-children Yes response accepts every whole-number count from one through maximumCount",
  () => {
    const oneChild =
      validateInitialChanges(
        makeGroupedChildrenChanges({
          childResponse: {
            attending: "yes",
            count: 1,
          },
          attendanceTotals: {
            adults21Plus: 1,
            youngAdults18To20:
              0,
            children3To17: 1,
            childrenUnder3: 0,
          },
          attendeeDetails: [
            {
              attendeeName:
                "Example Guest One",
            },
            {
              attendeeName:
                "Example Child One",
            },
          ],
        }),
        groupedChildrenInvitation,
      );

    assert.equal(
      oneChild.ok,
      true,
    );

    assert.equal(
      oneChild.value
        .overallAttendance,
      2,
    );

    const twoChildren =
      validateInitialChanges(
        makeGroupedChildrenChanges(),
        groupedChildrenInvitation,
      );

    assert.equal(
      twoChildren.ok,
      true,
    );

    assert.equal(
      twoChildren.value
        .overallAttendance,
      3,
    );
  },
);

test(
  "grouped unnamed-children response rejects scalar, missing, extra, malformed, and contradictory values",
  () => {
    const invalidResponses = [
      "yes",
      "no",
      {
        attending: "yes",
      },
      {
        count: 1,
      },
      {
        attending: "yes",
        count: 1,
        extra: true,
      },
      {
        attending: "maybe",
        count: 1,
      },
      {
        attending: "yes",
        count: 0,
      },
      {
        attending: "yes",
        count: 3,
      },
      {
        attending: "yes",
        count: 1.5,
      },
      {
        attending: "yes",
        count: "1",
      },
      {
        attending: "yes",
        count: true,
      },
      {
        attending: "yes",
        count: null,
      },
      {
        attending: "yes",
        count: -1,
      },
      {
        attending: "no",
        count: 1,
      },
    ];

    for (
      const childResponse of
      invalidResponses
    ) {
      const result =
        validateInitialChanges(
          makeGroupedChildrenChanges({
            childResponse,
          }),
          groupedChildrenInvitation,
        );

      assert.equal(
        result.status,
        400,
      );
    }
  },
);

test(
  "mixed Plus1 and grouped-child responses derive attendance from one-person Plus1 and grouped child count",
  () => {
    const result =
      validateInitialChanges(
        makeMixedAllocationChanges(),
        mixedAllocationInvitation,
      );

    assert.equal(
      result.ok,
      true,
    );

    assert.equal(
      result.value
        .overallAttendance,
      4,
    );

    assert.deepEqual(
      result.value
        .additionalGuestResponses,
      {
        "plus1-example-a":
          "yes",
        "allocation-children-a":
          {
            attending: "yes",
            count: 2,
          },
      },
    );
  },
);

test(
  "mixed additional-guest response maps remain complete and allocation-authorized",
  () => {
    const incomplete =
      makeMixedAllocationChanges();

    incomplete
      .additionalGuestResponses =
      replace({
        "plus1-example-a":
          "yes",
      });

    assert.equal(
      validateInitialChanges(
        incomplete,
        mixedAllocationInvitation,
      ).status,
      400,
    );

    const unauthorized =
      makeMixedAllocationChanges();

    unauthorized
      .additionalGuestResponses =
      replace({
        "plus1-example-a":
          "yes",
        "not-authorized":
          {
            attending: "yes",
            count: 2,
          },
      });

    assert.equal(
      validateInitialChanges(
        unauthorized,
        mixedAllocationInvitation,
      ).status,
      403,
    );
  },
);

test(
  "revision may partially replace a grouped child response but count changes require reconciled totals and complete attendeeDetails",
  () => {
    const current = {
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
        "allocation-children-a":
          {
            attending: "yes",
            count: 2,
          },
      },
      attendanceTotals: {
        adults21Plus: 1,
        youngAdults18To20: 0,
        children3To17: 2,
        childrenUnder3: 0,
      },
      overallAttendance: 3,
      attendeeDetails: [
        {
          attendeeName:
            "Example Guest One",
        },
        {
          attendeeName:
            "Example Child One",
        },
        {
          attendeeName:
            "Example Child Two",
        },
      ],
    };

    const missingDependents =
      validateRevisionChanges(
        {
          additionalGuestResponses:
            replace({
              "allocation-children-a":
                {
                  attending:
                    "yes",
                  count: 1,
                },
            }),
        },
        groupedChildrenInvitation,
        current,
      );

    assert.equal(
      missingDependents.status,
      400,
    );

    const result =
      validateRevisionChanges(
        {
          additionalGuestResponses:
            replace({
              "allocation-children-a":
                {
                  attending:
                    "yes",
                  count: 1,
                },
            }),
          attendanceTotals:
            replace({
              children3To17: 1,
            }),
          attendeeDetails:
            replace([
              {
                attendeeName:
                  "Example Guest One",
              },
              {
                attendeeName:
                  "Example Child One",
              },
            ]),
        },
        groupedChildrenInvitation,
        current,
      );

    assert.equal(
      result.ok,
      true,
    );

    assert.equal(
      result.value
        .overallAttendance,
      2,
    );
  },
);

test(
  "grouped child response change requires attendeeDetails replacement even when another attendance change preserves numeric headcount",
  () => {
    const current = {
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
        "allocation-children-a":
          {
            attending: "yes",
            count: 2,
          },
      },
      attendanceTotals: {
        adults21Plus: 1,
        youngAdults18To20: 0,
        children3To17: 2,
        childrenUnder3: 0,
      },
      overallAttendance: 3,
      attendeeDetails: [
        {
          attendeeName:
            "Example Guest One",
        },
        {
          attendeeName:
            "Example Child One",
        },
        {
          attendeeName:
            "Example Child Two",
        },
      ],
    };

    const withoutReplacement =
      validateRevisionChanges(
        {
          namedInviteeResponses:
            replace({
              "invitee-example-b":
                "yes",
            }),
          additionalGuestResponses:
            replace({
              "allocation-children-a":
                {
                  attending:
                    "yes",
                  count: 1,
                },
            }),
          attendanceTotals:
            replace({
              adults21Plus: 2,
              children3To17: 1,
            }),
        },
        groupedChildrenInvitation,
        current,
      );

    assert.equal(
      withoutReplacement.status,
      400,
    );

    assert.equal(
      withoutReplacement.reason,
      "missing-attendee-details",
    );

    const withReplacement =
      validateRevisionChanges(
        {
          namedInviteeResponses:
            replace({
              "invitee-example-b":
                "yes",
            }),
          additionalGuestResponses:
            replace({
              "allocation-children-a":
                {
                  attending:
                    "yes",
                  count: 1,
                },
            }),
          attendanceTotals:
            replace({
              adults21Plus: 2,
              children3To17: 1,
            }),
          attendeeDetails:
            replace([
              {
                attendeeName:
                  "Example Guest One",
              },
              {
                attendeeName:
                  "Example Guest Two",
              },
              {
                attendeeName:
                  "Example Child One",
              },
            ]),
        },
        groupedChildrenInvitation,
        current,
      );

    assert.equal(
      withReplacement.ok,
      true,
    );

    assert.equal(
      withReplacement.value
        .overallAttendance,
      3,
    );
  },
);

test(
  "revision rejects invalid stored grouped-child response state rather than silently repairing it",
  () => {
    const current = {
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
        "allocation-children-a":
          "yes",
      },
      attendanceTotals: {
        adults21Plus: 1,
        youngAdults18To20: 0,
        children3To17: 1,
        childrenUnder3: 0,
      },
      overallAttendance: 2,
      attendeeDetails: [
        {
          attendeeName:
            "Example Guest One",
        },
        {
          attendeeName:
            "Example Child One",
        },
      ],
    };

    const result =
      validateRevisionChanges(
        {},
        groupedChildrenInvitation,
        current,
      );

    assert.equal(
      result.status,
      400,
    );

    assert.equal(
      result.reason,
      "invalid-stored-additional-guest-responses",
    );
  },
);

test(
  "decline-to-attending revision with grouped children requires a complete grouped response and dependent state",
  () => {
    const current = {
      eventAttendance: [
        "decline",
      ],
    };

    const incomplete =
      makeGroupedChildrenChanges();

    delete incomplete
      .additionalGuestResponses;

    assert.equal(
      validateRevisionChanges(
        incomplete,
        groupedChildrenInvitation,
        current,
      ).status,
      400,
    );

    const valid =
      validateRevisionChanges(
        makeGroupedChildrenChanges(),
        groupedChildrenInvitation,
        current,
      );

    assert.equal(
      valid.ok,
      true,
    );
  },
);

test(
  "invitation capacity validation rejects malformed allocation metadata and summed-capacity contradictions",
  () => {
    const malformedInvitations = [
      {
        maximumAttendance: 3,
        namedInvitees:
          invitation.namedInvitees,
        additionalGuestAllocations: [
          {
            id:
              "plus1-example-a",
            prompt:
              "Will Example Guest One be accompanied by a +1?",
            maximumCount: 1,
          },
        ],
      },
      {
        maximumAttendance: 4,
        namedInvitees:
          invitation.namedInvitees,
        additionalGuestAllocations: [
          {
            id:
              "plus1-example-a",
            kind: "plus1",
            prompt:
              "Will Example Guest One be accompanied by a +1?",
            maximumCount: 2,
          },
        ],
      },
      {
        maximumAttendance: 5,
        namedInvitees:
          invitation.namedInvitees,
        additionalGuestAllocations: [
          {
            id:
              "allocation-children-a",
            kind:
              "unnamedChildren",
            prompt:
              "Grouped children",
            maximumCount: 1,
          },
          {
            id:
              "allocation-children-b",
            kind:
              "unnamedChildren",
            prompt:
              "Grouped children",
            maximumCount: 2,
          },
        ],
      },
      {
        maximumAttendance: 3,
        namedInvitees:
          invitation.namedInvitees,
        additionalGuestAllocations: [
          {
            id:
              "allocation-children-a",
            kind:
              "unnamedChildren",
            prompt:
              "Grouped children",
            maximumCount: 2,
          },
        ],
      },
    ];

    for (
      const malformedInvitation of
      malformedInvitations
    ) {
      assert.throws(
        () =>
          validateInitialChanges(
            makeInitialAttendingChanges(),
            malformedInvitation,
          ),
        /failed capacity validation/,
      );
    }
  },
);