const test = require("node:test");
const assert = require("node:assert/strict");

const {
  parseConfirmation,
  parseSubmitRequest,
  validateInitialChanges,
} = require("../src/validation/submit");

const invitation = Object.freeze({
  maximumAttendance: 3,
  additionalGuestAllocations:
    Object.freeze([
      Object.freeze({
        id: "plus1-example-a",
        prompt:
          "Will Example Guest be accompanied by a +1?",
      }),
    ]),
});

function replace(value) {
  return {
    operation: "replace",
    value,
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

    assert.equal(parsed.ok, true);
    assert.equal(
      parsed.value.inviteCode,
      123456,
    );

    for (
      const body of [
        {
          inviteCode: "DEV001",
          confirmation: {},
          changes: {},
        },
        {
          inviteCode: "DEV001",
          clientSubmissionId:
            "not-a-uuid",
          confirmation: {},
          changes: {},
        },
        {
          inviteCode: "DEV001",
          clientSubmissionId:
            "2bc9b79c-b707-4e10-a488-8d9575b961f5",
          confirmation: {},
          changes: {},
          expectedVersion: 1,
        },
      ]
    ) {
      assert.equal(
        parseSubmitRequest(body).ok,
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
  "disabled text-message confirmation is an authorization failure",
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
      const changes = {
        eventAttendance:
          replace(value),
      };

      if (
        value[0] !==
        "decline"
      ) {
        changes
          .additionalGuestResponses =
          replace({
            "plus1-example-a":
              "no",
          });
        changes.attendanceTotals =
          replace({
            adults21Plus: 1,
            youngAdults18To20: 0,
            children3To17: 0,
            childrenUnder3: 0,
          });

        if (
          value.includes(
            "reception",
          )
        ) {
          changes
            .receptionAttendeeDetails =
            replace([
              {
                attendeeName:
                  "Example Guest",
              },
            ]);
        }
      }

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
        {
          eventAttendance:
            replace([
              "reception",
              "ceremony",
            ]),
          additionalGuestResponses:
            replace({
              "plus1-example-a":
                "no",
            }),
          attendanceTotals:
            replace({
              adults21Plus: 1,
              youngAdults18To20: 0,
              children3To17: 0,
              childrenUnder3: 0,
            }),
          receptionAttendeeDetails:
            replace([
              {
                attendeeName:
                  "Example Guest",
              },
            ]),
        },
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
  "contradictory or empty attendance is rejected",
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
        ["unknown"],
      ]
    ) {
      assert.equal(
        validateInitialChanges(
          {
            eventAttendance:
              replace(value),
          },
          invitation,
        ).status,
        400,
      );
    }
  },
);

test(
  "initial attending response requires every authorized Plus1 allocation response",
  () => {
    const result =
      validateInitialChanges(
        {
          eventAttendance:
            replace([
              "ceremony",
            ]),
          attendanceTotals:
            replace({
              adults21Plus: 1,
              youngAdults18To20: 0,
              children3To17: 0,
              childrenUnder3: 0,
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
  "unknown Plus1 allocation IDs are forbidden",
  () => {
    const result =
      validateInitialChanges(
        {
          eventAttendance:
            replace([
              "ceremony",
            ]),
          additionalGuestResponses:
            replace({
              "not-authorized":
                "yes",
            }),
          attendanceTotals:
            replace({
              adults21Plus: 1,
              youngAdults18To20: 0,
              children3To17: 0,
              childrenUnder3: 0,
            }),
        },
        invitation,
      );

    assert.equal(
      result.status,
      403,
    );
  },
);

test(
  "party with no allocations cannot submit additionalGuestResponses",
  () => {
    const result =
      validateInitialChanges(
        {
          eventAttendance:
            replace([
              "ceremony",
            ]),
          additionalGuestResponses:
            replace({}),
          attendanceTotals:
            replace({
              adults21Plus: 1,
              youngAdults18To20: 0,
              children3To17: 0,
              childrenUnder3: 0,
            }),
        },
        {
          maximumAttendance: 2,
          additionalGuestAllocations:
            [],
        },
      );

    assert.equal(
      result.status,
      403,
    );
  },
);

test(
  "attendance totals require four nonnegative integers within invitation capacity",
  () => {
    const base = {
      eventAttendance:
        replace(["ceremony"]),
      additionalGuestResponses:
        replace({
          "plus1-example-a":
            "no",
        }),
    };

    for (
      const totals of [
        {
          adults21Plus: 1,
          youngAdults18To20: 0,
          children3To17: 0,
        },
        {
          adults21Plus: -1,
          youngAdults18To20: 0,
          children3To17: 0,
          childrenUnder3: 0,
        },
        {
          adults21Plus: 1.5,
          youngAdults18To20: 0,
          children3To17: 0,
          childrenUnder3: 0,
        },
        {
          adults21Plus: 4,
          youngAdults18To20: 0,
          children3To17: 0,
          childrenUnder3: 0,
        },
      ]
    ) {
      assert.equal(
        validateInitialChanges(
          {
            ...base,
            attendanceTotals:
              replace(totals),
          },
          invitation,
        ).status,
        400,
      );
    }
  },
);

test(
  "Reception initial response requires exactly one valid detail record per attendee",
  () => {
    const base = {
      eventAttendance:
        replace(["reception"]),
      additionalGuestResponses:
        replace({
          "plus1-example-a":
            "yes",
        }),
      attendanceTotals:
        replace({
          adults21Plus: 2,
          youngAdults18To20: 0,
          children3To17: 0,
          childrenUnder3: 0,
        }),
    };

    assert.equal(
      validateInitialChanges(
        base,
        invitation,
      ).status,
      400,
    );

    assert.equal(
      validateInitialChanges(
        {
          ...base,
          receptionAttendeeDetails:
            replace([
              {
                attendeeName:
                  "Only One",
              },
            ]),
        },
        invitation,
      ).status,
      400,
    );

    const validResult =
      validateInitialChanges(
        {
          ...base,
          receptionAttendeeDetails:
            replace([
              {
                attendeeName:
                  "Example Guest",
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
      );

    assert.equal(
      validResult.ok,
      true,
    );
    assert.equal(
      validResult.value
        .receptionAttendeeDetails[0]
        .dietaryPreferences,
      "",
    );
  },
);

test(
  "Reception details are forbidden when Reception is not selected",
  () => {
    const result =
      validateInitialChanges(
        {
          eventAttendance:
            replace(["ceremony"]),
          additionalGuestResponses:
            replace({
              "plus1-example-a":
                "no",
            }),
          attendanceTotals:
            replace({
              adults21Plus: 1,
              youngAdults18To20: 0,
              children3To17: 0,
              childrenUnder3: 0,
            }),
          receptionAttendeeDetails:
            replace([
              {
                attendeeName:
                  "Example Guest",
              },
            ]),
        },
        invitation,
      );

    assert.equal(
      result.status,
      403,
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
            replace(["decline"]),
          attendanceTotals:
            replace({
              adults21Plus: 0,
              youngAdults18To20: 0,
              children3To17: 0,
              childrenUnder3: 0,
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
  "generic client clear operation is forbidden",
  () => {
    const result =
      validateInitialChanges(
        {
          eventAttendance: {
            operation: "clear",
          },
        },
        invitation,
      );

    assert.equal(
      result.status,
      403,
    );
  },
);
