import test from "node:test";
import assert from "node:assert/strict";

import {
  RSVP_STATES,
  buildSubmissionRequest,
  confirmationState,
  createBlankDraft,
  derivedOverallAttendance,
  lookupFailureState,
  resizeAttendeeDetails,
  submitFailureState,
  toggleAttendance,
} from "../src/services/rsvpModel.js";

const GROUPED_CHILD_PROMPT =
  "We'd love for your family to celebrate with us this Mayday - will your kid(s) be accompanying you?";

const lookup = Object.freeze({
  invitation: {
    partyDisplayName: "Example Household",
    greeting: "Welcome, Example Household!",
    wordingMode: "plural",
    maximumAttendance: 5,
    namedInvitees: [
      {
        id: "invitee-a",
        displayName: "Example Guest One",
      },
      {
        id: "invitee-b",
        displayName: "Example Guest Two",
      },
    ],
    additionalGuestAllocations: [
      {
        id: "plus1-a",
        kind: "plus1",
        prompt:
          "Will Example Guest One be accompanied by a +1?",
        maximumCount: 1,
      },
      {
        id: "children-a",
        kind: "unnamedChildren",
        prompt: GROUPED_CHILD_PROMPT,
        maximumCount: 2,
      },
    ],
  },
  questions: [],
  confirmationOptions: {
    email: true,
    textMessage: false,
    smsAuthorizationRequired: false,
  },
});

function completeFirstDraft({
  reception = true,
} = {}) {
  const draft = createBlankDraft(lookup);

  draft.completionMode = "first";

  draft.attendance = {
    ceremony: true,
    reception,
    decline: false,
    touched: true,
  };

  draft.namedInviteeResponses[
    "invitee-a"
  ] = "yes";

  draft.namedInviteeResponses[
    "invitee-b"
  ] = "no";

  draft.additionalGuestResponses[
    "plus1-a"
  ] = "yes";

  draft.additionalGuestResponses[
    "children-a"
  ] = {
    attending: "yes",
    count: "2",
  };

  draft.attendanceTotals = {
    adults21Plus: "2",
    youngAdults18To20: "0",
    children3To17: "2",
    childrenUnder3: "0",
  };

  draft.attendeeDetails = [
    {
      attendeeName:
        "Example Guest One",
      dietaryPreferences: "",
    },
    {
      attendeeName:
        "Example Companion",
      dietaryPreferences:
        reception
          ? "Vegetarian"
          : "",
    },
    {
      attendeeName:
        "Example Child One",
      dietaryPreferences: "",
    },
    {
      attendeeName:
        "Example Child Two",
      dietaryPreferences: "",
    },
  ];

  draft.confirmation.email =
    "guest@example.com";

  return draft;
}

test(
  "blank draft contains blank named, Plus1, and grouped-child controls without stored RSVP values",
  () => {
    const draft =
      createBlankDraft(lookup);

    assert.equal(
      draft.completionMode,
      "",
    );

    assert.deepEqual(
      draft.namedInviteeResponses,
      {
        "invitee-a": "",
        "invitee-b": "",
      },
    );

    assert.deepEqual(
      draft.additionalGuestResponses,
      {
        "plus1-a": "",
        "children-a": {
          attending: "",
          count: "",
        },
      },
    );

    assert.deepEqual(
      draft.attendanceTotals,
      {
        adults21Plus: "",
        youngAdults18To20: "",
        children3To17: "",
        childrenUnder3: "",
      },
    );

    assert.deepEqual(
      draft.attendeeDetails,
      [],
    );

    assert.equal(
      draft.confirmation.method,
      "email",
    );

    assert.equal(
      draft.confirmation.email,
      "",
    );
  },
);

test(
  "attendance selection keeps decline mutually exclusive with attending events",
  () => {
    let state = {
      ceremony: false,
      reception: false,
      decline: false,
      touched: false,
    };

    state =
      toggleAttendance(
        state,
        "ceremony",
      );

    state =
      toggleAttendance(
        state,
        "reception",
      );

    assert.deepEqual(
      state,
      {
        ceremony: true,
        reception: true,
        decline: false,
        touched: true,
      },
    );

    state =
      toggleAttendance(
        state,
        "decline",
      );

    assert.deepEqual(
      state,
      {
        ceremony: false,
        reception: false,
        decline: true,
        touched: true,
      },
    );
  },
);

test(
  "derived attendance counts named Yes responses, Plus1 Yes responses, and grouped-child count",
  () => {
    assert.equal(
      derivedOverallAttendance({
        invitation:
          lookup.invitation,

        namedInviteeResponses: {
          "invitee-a": "yes",
          "invitee-b": "no",
        },

        additionalGuestResponses: {
          "plus1-a": "yes",

          "children-a": {
            attending: "yes",
            count: 2,
          },
        },
      }),
      4,
    );

    assert.equal(
      derivedOverallAttendance({
        invitation:
          lookup.invitation,

        namedInviteeResponses: {
          "invitee-a": "yes",
          "invitee-b": "yes",
        },

        additionalGuestResponses: {
          "plus1-a": "no",

          "children-a": {
            attending: "no",
            count: 0,
          },
        },
      }),
      2,
    );
  },
);

test(
  "complete first RSVP builds the five substantive regions with mixed additional-guest response shapes",
  () => {
    const result =
      buildSubmissionRequest({
        inviteCode:
          "DEV-002",

        lookup,

        draft:
          completeFirstDraft(),

        clientSubmissionId:
          "00000000-0000-4000-8000-000000000001",
      });

    assert.equal(
      result.ok,
      true,
    );

    assert.deepEqual(
      result.request,
      {
        inviteCode:
          "DEV-002",

        clientSubmissionId:
          "00000000-0000-4000-8000-000000000001",

        confirmation: {
          method: "email",
          email:
            "guest@example.com",
        },

        changes: {
          eventAttendance: {
            operation:
              "replace",

            value: [
              "ceremony",
              "reception",
            ],
          },

          namedInviteeResponses:
            {
              operation:
                "replace",

              value: {
                "invitee-a":
                  "yes",

                "invitee-b":
                  "no",
              },
            },

          additionalGuestResponses:
            {
              operation:
                "replace",

              value: {
                "plus1-a":
                  "yes",

                "children-a":
                  {
                    attending:
                      "yes",

                    count: 2,
                  },
              },
            },

          attendanceTotals: {
            operation:
              "replace",

            value: {
              adults21Plus: 2,

              youngAdults18To20:
                0,

              children3To17:
                2,

              childrenUnder3:
                0,
            },
          },

          attendeeDetails: {
            operation:
              "replace",

            value: [
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
                  "Vegetarian",
              },
              {
                attendeeName:
                  "Example Child One",

                dietaryPreferences:
                  "",
              },
              {
                attendeeName:
                  "Example Child Two",

                dietaryPreferences:
                  "",
              },
            ],
          },
        },
      },
    );

    assert.equal(
      Object.prototype
        .hasOwnProperty.call(
          result.request.changes,
          "receptionAttendeeDetails",
        ),
      false,
    );
  },
);

test(
  "grouped-child No response is normalized to count zero and contributes no attendance",
  () => {
    const draft =
      createBlankDraft(lookup);

    draft.completionMode =
      "first";

    draft.attendance = {
      ceremony: true,
      reception: false,
      decline: false,
      touched: true,
    };

    draft.namedInviteeResponses =
      {
        "invitee-a":
          "yes",

        "invitee-b":
          "yes",
      };

    draft.additionalGuestResponses[
      "plus1-a"
    ] = "no";

    draft.additionalGuestResponses[
      "children-a"
    ] = {
      attending: "no",
      count: "",
    };

    draft.attendanceTotals = {
      adults21Plus: "2",
      youngAdults18To20: "0",
      children3To17: "0",
      childrenUnder3: "0",
    };

    draft.attendeeDetails = [
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
          "",
      },
    ];

    draft.confirmation.email =
      "guest@example.com";

    const result =
      buildSubmissionRequest({
        inviteCode:
          "DEV-002",

        lookup,

        draft,

        clientSubmissionId:
          "00000000-0000-4000-8000-000000000002",
      });

    assert.equal(
      result.ok,
      true,
    );

    assert.deepEqual(
      result.request.changes
        .additionalGuestResponses
        .value[
        "children-a"
      ],
      {
        attending: "no",
        count: 0,
      },
    );

    assert.equal(
      result.request.changes
        .attendeeDetails
        .value.length,
      2,
    );
  },
);

test(
  "grouped-child response rejects missing, zero, fractional, and above-maximum Yes counts",
  () => {
    for (
      const count of [
        "",
        "0",
        "1.5",
        "3",
      ]
    ) {
      const draft =
        completeFirstDraft();

      draft.additionalGuestResponses[
        "children-a"
      ] = {
        attending: "yes",
        count,
      };

      const result =
        buildSubmissionRequest({
          inviteCode:
            "DEV-002",

          lookup,

          draft,

          clientSubmissionId:
            "00000000-0000-4000-8000-000000000003",
        });

      assert.equal(
        result.ok,
        false,
      );

      assert.ok(
        result.errors
          .additionalGuestResponses,
      );
    }
  },
);

test(
  "first attending RSVP requires every named invitee and additional-guest response",
  () => {
    const draft =
      completeFirstDraft();

    draft.namedInviteeResponses[
      "invitee-b"
    ] = "";

    draft.additionalGuestResponses[
      "plus1-a"
    ] = "";

    const result =
      buildSubmissionRequest({
        inviteCode:
          "DEV-002",

        lookup,

        draft,

        clientSubmissionId:
          "00000000-0000-4000-8000-000000000004",
      });

    assert.equal(
      result.ok,
      false,
    );

    assert.ok(
      result.errors
        .namedInviteeResponses,
    );

    assert.ok(
      result.errors
        .additionalGuestResponses,
    );
  },
);

test(
  "first attending RSVP requires age totals to equal derived attending headcount",
  () => {
    const draft =
      completeFirstDraft();

    draft.attendanceTotals
      .adults21Plus =
      "1";

    const result =
      buildSubmissionRequest({
        inviteCode:
          "DEV-002",

        lookup,

        draft,

        clientSubmissionId:
          "00000000-0000-4000-8000-000000000005",
      });

    assert.equal(
      result.ok,
      false,
    );

    assert.match(
      result.errors
        .attendanceTotals,
      /must add up to the 4 people marked as attending/,
    );
  },
);

test(
  "Ceremony-only initial RSVP still requires Attendee Details and omits dietary fields from the request",
  () => {
    const draft =
      completeFirstDraft({
        reception: false,
      });

    const result =
      buildSubmissionRequest({
        inviteCode:
          "DEV-002",

        lookup,

        draft,

        clientSubmissionId:
          "00000000-0000-4000-8000-000000000006",
      });

    assert.equal(
      result.ok,
      true,
    );

    assert.equal(
      result.request.changes
        .attendeeDetails
        .value.length,
      4,
    );

    for (
      const detail of
      result.request.changes
        .attendeeDetails
        .value
    ) {
      assert.deepEqual(
        Object.keys(
          detail,
        ),
        [
          "attendeeName",
        ],
      );
    }
  },
);

test(
  "Ceremony-only attendee details reject dietary or allergy information",
  () => {
    const draft =
      completeFirstDraft({
        reception: false,
      });

    draft.attendeeDetails[
      0
    ].dietaryPreferences =
      "Vegetarian";

    const result =
      buildSubmissionRequest({
        inviteCode:
          "DEV-002",

        lookup,

        draft,

        clientSubmissionId:
          "00000000-0000-4000-8000-000000000007",
      });

    assert.equal(
      result.ok,
      false,
    );

    assert.match(
      result.errors[
        "0.dietaryPreferences"
      ],
      /only when Reception is selected/,
    );
  },
);

test(
  "full decline omits all attendance-dependent changes",
  () => {
    const draft =
      createBlankDraft(lookup);

    draft.completionMode =
      "first";

    draft.attendance = {
      ceremony: false,
      reception: false,
      decline: true,
      touched: true,
    };

    draft.confirmation.email =
      "guest@example.com";

    const result =
      buildSubmissionRequest({
        inviteCode:
          "DEV-002",

        lookup,

        draft,

        clientSubmissionId:
          "00000000-0000-4000-8000-000000000008",
      });

    assert.equal(
      result.ok,
      true,
    );

    assert.deepEqual(
      result.request.changes,
      {
        eventAttendance: {
          operation:
            "replace",

          value: [
            "decline",
          ],
        },
      },
    );
  },
);

test(
  "revision may omit all substantive regions and replace confirmation only",
  () => {
    const draft =
      createBlankDraft(lookup);

    draft.completionMode =
      "revision";

    draft.confirmation.email =
      "new@example.com";

    const result =
      buildSubmissionRequest({
        inviteCode:
          "DEV-002",

        lookup,

        draft,

        clientSubmissionId:
          "00000000-0000-4000-8000-000000000009",
      });

    assert.equal(
      result.ok,
      true,
    );

    assert.deepEqual(
      result.request.changes,
      {},
    );

    assert.deepEqual(
      result.request.confirmation,
      {
        method: "email",
        email:
          "new@example.com",
      },
    );
  },
);

test(
  "composition-sensitive revision rejects partial person-level responses",
  () => {
    const draft =
      createBlankDraft(lookup);

    draft.completionMode =
      "revision";

    draft.confirmation.email =
      "guest@example.com";

    draft.namedInviteeResponses[
      "invitee-b"
    ] = "yes";

    draft.additionalGuestResponses[
      "children-a"
    ] = {
      attending: "yes",
      count: "1",
    };

    const result =
      buildSubmissionRequest({
        inviteCode:
          "DEV-002",

        lookup,

        draft,

        clientSubmissionId:
          "00000000-0000-4000-8000-000000000010",
      });

    assert.equal(
      result.ok,
      false,
    );

    assert.match(
      result.errors
        .namedInviteeResponses,
      /complete intended attending party/i,
    );

    assert.match(
      result.errors
        .additionalGuestResponses,
      /answer every authorized additional-guest question/i,
    );

    assert.ok(
      result.errors
        .attendeeDetails,
    );
  },
);

test(
  "complete composition revision may leave event attendance unchanged while replacing attendee details",
  () => {
    const draft =
      createBlankDraft(lookup);

    draft.completionMode =
      "revision";

    draft.confirmation.email =
      "guest@example.com";

    draft.namedInviteeResponses = {
      "invitee-a": "yes",
      "invitee-b": "no",
    };

    draft.additionalGuestResponses = {
      "plus1-a": "yes",
      "children-a": {
        attending: "yes",
        count: "1",
      },
    };

    draft.attendeeDetails = [
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
      {
        attendeeName:
          "Example Child One",
        dietaryPreferences:
          "",
      },
    ];

    const result =
      buildSubmissionRequest({
        inviteCode:
          "DEV-002",

        lookup,

        draft,

        clientSubmissionId:
          "00000000-0000-4000-8000-000000000010",
      });

    assert.equal(
      result.ok,
      true,
    );

    assert.equal(
      Object.prototype
        .hasOwnProperty.call(
          result.request.changes,
          "eventAttendance",
        ),
      false,
    );

    assert.deepEqual(
      result.request.changes
        .namedInviteeResponses
        .value,
      {
        "invitee-a": "yes",
        "invitee-b": "no",
      },
    );

    assert.deepEqual(
      result.request.changes
        .additionalGuestResponses
        .value,
      {
        "plus1-a": "yes",
        "children-a": {
          attending: "yes",
          count: 1,
        },
      },
    );

    assert.deepEqual(
      result.request.changes
        .attendeeDetails
        .value,
      [
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
      ],
    );
  },
);

test(
  "revision distinguishes untouched age totals from explicit zero replacement",
  () => {
    const draft =
      createBlankDraft(lookup);

    draft.completionMode =
      "revision";

    draft.confirmation.email =
      "guest@example.com";

    draft.attendanceTotals
      .children3To17 =
      "0";

    const result =
      buildSubmissionRequest({
        inviteCode:
          "DEV-002",

        lookup,

        draft,

        clientSubmissionId:
          "00000000-0000-4000-8000-000000000011",
      });

    assert.equal(
      result.ok,
      true,
    );

    assert.deepEqual(
      result.request.changes
        .attendanceTotals,
      {
        operation:
          "replace",

        value: {
          children3To17:
            0,
        },
      },
    );
  },
);

test(
  "attendee-detail resizing preserves existing rows and creates blank rows to the requested count",
  () => {
    const current = [
      {
        attendeeName:
          "A",

        dietaryPreferences:
          "",
      },
    ];

    assert.deepEqual(
      resizeAttendeeDetails(
        current,
        2,
      ),
      [
        current[0],

        {
          attendeeName:
            "",

          dietaryPreferences:
            "",
        },
      ],
    );

    assert.deepEqual(
      resizeAttendeeDetails(
        current,
        0,
      ),
      [],
    );
  },
);

test(
  "lookup errors map to invalid, closed, or service-unavailable states",
  () => {
    assert.equal(
      lookupFailureState(
        400,
      ),
      RSVP_STATES
        .INVALID_INVITATION,
    );

    assert.equal(
      lookupFailureState(
        404,
      ),
      RSVP_STATES
        .INVALID_INVITATION,
    );

    assert.equal(
      lookupFailureState(
        410,
      ),
      RSVP_STATES.CLOSED,
    );

    assert.equal(
      lookupFailureState(
        503,
      ),
      RSVP_STATES
        .SERVICE_UNAVAILABLE,
    );
  },
);

test(
  "submission errors keep validation, closed, and service failures distinct",
  () => {
    assert.equal(
      submitFailureState(
        400,
      ),
      RSVP_STATES
        .VALIDATION_FAILURE,
    );

    assert.equal(
      submitFailureState(
        403,
      ),
      RSVP_STATES
        .VALIDATION_FAILURE,
    );

    assert.equal(
      submitFailureState(
        410,
      ),
      RSVP_STATES.CLOSED,
    );

    assert.equal(
      submitFailureState(
        429,
      ),
      RSVP_STATES
        .SERVICE_UNAVAILABLE,
    );
  },
);

test(
  "confirmation payload selects initial, revision, warning, and fallback states",
  () => {
    const base = {
      submission: {
        recorded: true,
        action: "initial",
        idempotentRepeat:
          false,

        recordedAt:
          "2026-09-20T20:30:00Z",
      },

      invitation: {
        partyDisplayName:
          "Example Household",
      },

      rsvp: {
        eventAttendance: [
          "ceremony",
        ],
      },

      confirmation: {
        method: "email",

        guestDeliveryStatus:
          "sent",

        administrativeDeliveryStatus:
          "sent",

        deliveryWarning:
          false,
      },

      revisionPolicy: {
        deadline:
          "2027-03-01T23:59:00-05:00",
      },
    };

    assert.equal(
      confirmationState(
        base,
      ),
      RSVP_STATES
        .CONFIRMED_INITIAL,
    );

    assert.equal(
      confirmationState({
        ...base,

        submission: {
          ...base.submission,
          action:
            "revision",
        },
      }),
      RSVP_STATES
        .CONFIRMED_REVISION,
    );

    assert.equal(
      confirmationState({
        ...base,

        confirmation: {
          ...base.confirmation,
          deliveryWarning:
            true,
        },
      }),
      RSVP_STATES
        .DELIVERY_WARNING,
    );

    assert.equal(
      confirmationState(
        null,
      ),
      RSVP_STATES
        .CONFIRMATION_FALLBACK,
    );
  },
);