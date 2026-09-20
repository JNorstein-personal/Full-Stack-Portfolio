import test from "node:test";
import assert from "node:assert/strict";

import {
  RSVP_STATES,
  buildSubmissionRequest,
  confirmationState,
  createBlankDraft,
  lookupFailureState,
  resizeReceptionDetails,
  submitFailureState,
  toggleAttendance,
} from "../src/services/rsvpModel.js";

const lookup = Object.freeze({
  invitation: {
    partyDisplayName:
      "Example Household",
    greeting:
      "Welcome, Example Household!",
    wordingMode: "plural",
    maximumAttendance: 4,
    additionalGuestAllocations: [
      {
        id: "plus1-a",
        prompt:
          "Will Example Guest be accompanied by a +1?",
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

function completeFirstDraft() {
  const draft =
    createBlankDraft(lookup);

  draft.completionMode =
    "first";
  draft.attendance = {
    ceremony: true,
    reception: true,
    decline: false,
    touched: true,
  };
  draft.additionalGuestResponses[
    "plus1-a"
  ] = "yes";
  draft.attendanceTotals = {
    adults21Plus: "2",
    youngAdults18To20: "0",
    children3To17: "0",
    childrenUnder3: "0",
  };
  draft.receptionAttendeeDetails = [
    {
      attendeeName:
        "Example Guest",
      dietaryPreferences: "",
    },
    {
      attendeeName:
        "Example Companion",
      dietaryPreferences:
        "Vegetarian",
    },
  ];
  draft.confirmation.email =
    "guest@example.com";

  return draft;
}

test(
  "blank draft contains no stored RSVP values and uses available email confirmation",
  () => {
    const draft =
      createBlankDraft(lookup);

    assert.equal(
      draft.completionMode,
      "",
    );
    assert.deepEqual(
      draft.additionalGuestResponses,
      {
        "plus1-a": "",
      },
    );
    assert.deepEqual(
      draft.attendanceTotals,
      {
        adults21Plus: "",
        youngAdults18To20:
          "",
        children3To17: "",
        childrenUnder3: "",
      },
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
  "complete first RSVP builds the exact submission regions including explicit zero totals",
  () => {
    const result =
      buildSubmissionRequest({
        inviteCode:
          "DEV-006",
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
          "DEV-006",
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
          additionalGuestResponses:
            {
              operation:
                "replace",
              value: {
                "plus1-a":
                  "yes",
              },
            },
          attendanceTotals: {
            operation:
              "replace",
            value: {
              adults21Plus: 2,
              youngAdults18To20:
                0,
              children3To17: 0,
              childrenUnder3: 0,
            },
          },
          receptionAttendeeDetails:
            {
              operation:
                "replace",
              value: [
                {
                  attendeeName:
                    "Example Guest",
                  dietaryPreferences:
                    "",
                },
                {
                  attendeeName:
                    "Example Companion",
                  dietaryPreferences:
                    "Vegetarian",
                },
              ],
            },
        },
      },
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
          "DEV-006",
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
      result.request.changes,
      {
        eventAttendance: {
          operation: "replace",
          value: ["decline"],
        },
      },
    );
  },
);

test(
  "revision omits untouched RSVP regions and may replace confirmation only",
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
          "DEV-006",
        lookup,
        draft,
        clientSubmissionId:
          "00000000-0000-4000-8000-000000000003",
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
  "revision distinguishes untouched total from explicit zero replacement",
  () => {
    const draft =
      createBlankDraft(lookup);

    draft.completionMode =
      "revision";
    draft.confirmation.email =
      "guest@example.com";
    draft.attendanceTotals
      .children3To17 = "0";

    const result =
      buildSubmissionRequest({
        inviteCode:
          "DEV-006",
        lookup,
        draft,
        clientSubmissionId:
          "00000000-0000-4000-8000-000000000004",
      });

    assert.equal(
      result.ok,
      true,
    );
    assert.deepEqual(
      result.request.changes
        .attendanceTotals,
      {
        operation: "replace",
        value: {
          children3To17: 0,
        },
      },
    );
  },
);

test(
  "first attending RSVP fails client validation when complete totals or Plus 1 response are missing",
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
    draft.confirmation.email =
      "guest@example.com";

    const result =
      buildSubmissionRequest({
        inviteCode:
          "DEV-006",
        lookup,
        draft,
        clientSubmissionId:
          "00000000-0000-4000-8000-000000000005",
      });

    assert.equal(
      result.ok,
      false,
    );
    assert.ok(
      result.errors
        .additionalGuestResponses,
    );
    assert.ok(
      result.errors
        .attendanceTotals,
    );
  },
);

test(
  "client validation rejects attendance above invitation capacity",
  () => {
    const draft =
      completeFirstDraft();

    draft.attendance.reception =
      false;
    draft.receptionAttendeeDetails =
      [];
    draft.attendanceTotals =
      {
        adults21Plus: "5",
        youngAdults18To20:
          "0",
        children3To17: "0",
        childrenUnder3: "0",
      };

    const result =
      buildSubmissionRequest({
        inviteCode:
          "DEV-006",
        lookup,
        draft,
        clientSubmissionId:
          "00000000-0000-4000-8000-000000000006",
      });

    assert.equal(
      result.ok,
      false,
    );
    assert.match(
      result.errors
        .attendanceTotals,
      /between 1 and 4/,
    );
  },
);

test(
  "reception detail resizing preserves existing entries while matching requested count",
  () => {
    const current = [
      {
        attendeeName: "A",
        dietaryPreferences:
          "",
      },
    ];

    assert.deepEqual(
      resizeReceptionDetails(
        current,
        2,
      ),
      [
        current[0],
        {
          attendeeName: "",
          dietaryPreferences:
            "",
        },
      ],
    );

    assert.deepEqual(
      resizeReceptionDetails(
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
      lookupFailureState(400),
      RSVP_STATES
        .INVALID_INVITATION,
    );
    assert.equal(
      lookupFailureState(404),
      RSVP_STATES
        .INVALID_INVITATION,
    );
    assert.equal(
      lookupFailureState(410),
      RSVP_STATES.CLOSED,
    );
    assert.equal(
      lookupFailureState(503),
      RSVP_STATES
        .SERVICE_UNAVAILABLE,
    );
  },
);

test(
  "submission errors keep validation, closed, and service failures distinct",
  () => {
    assert.equal(
      submitFailureState(400),
      RSVP_STATES
        .VALIDATION_FAILURE,
    );
    assert.equal(
      submitFailureState(403),
      RSVP_STATES
        .VALIDATION_FAILURE,
    );
    assert.equal(
      submitFailureState(410),
      RSVP_STATES.CLOSED,
    );
    assert.equal(
      submitFailureState(429),
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
      confirmationState(base),
      RSVP_STATES
        .CONFIRMED_INITIAL,
    );
    assert.equal(
      confirmationState({
        ...base,
        submission: {
          ...base.submission,
          action: "revision",
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
      confirmationState(null),
      RSVP_STATES
        .CONFIRMATION_FALLBACK,
    );
  },
);
