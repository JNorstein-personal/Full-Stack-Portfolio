const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  EXPECTED_QUESTION_IDS,
  loadReusableRsvpQuestions,
} = require("../src/rsvp/formSchemas");

const GROUPED_CHILD_PROMPT =
  "We'd love for your family to celebrate with us this Mayday - will your kid(s) be accompanying you?";

function withTemporaryJson(
  value,
  callback,
) {
  const directory =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "wedding-rsvp-schema-",
      ),
    );

  const filePath =
    path.join(
      directory,
      "schema.json",
    );

  try {
    fs.writeFileSync(
      filePath,
      JSON.stringify(
        value,
        null,
        2,
      ),
      "utf8",
    );

    return callback(filePath);
  } finally {
    fs.rmSync(
      directory,
      {
        recursive: true,
        force: true,
      },
    );
  }
}

function loadQuestionsById() {
  const questions =
    loadReusableRsvpQuestions();

  return Object.fromEntries(
    questions.map(
      (question) => [
        question.id,
        question,
      ],
    ),
  );
}

test(
  "loads the authoritative reusable RSVP question set in governing order",
  () => {
    const questions =
      loadReusableRsvpQuestions();

    assert.deepEqual(
      questions.map(
        (question) =>
          question.id,
      ),
      EXPECTED_QUESTION_IDS,
    );

    assert.deepEqual(
      EXPECTED_QUESTION_IDS,
      [
        "eventAttendance",
        "namedInviteeResponses",
        "additionalGuestResponses",
        "attendanceTotals",
        "attendeeDetails",
        "confirmationMethod",
        "confirmationEmail",
        "confirmationMobile",
        "smsAuthorization",
      ],
    );

    assert.equal(
      EXPECTED_QUESTION_IDS.includes(
        "overallAttendance",
      ),
      false,
    );

    assert.equal(
      EXPECTED_QUESTION_IDS.includes(
        "unnamedChildren",
      ),
      false,
    );
  },
);

test(
  "returns an immutable independent question tree",
  () => {
    const first =
      loadReusableRsvpQuestions();
    const second =
      loadReusableRsvpQuestions();

    assert.notEqual(
      first,
      second,
    );

    assert.equal(
      Object.isFrozen(first),
      true,
    );

    assert.equal(
      Object.isFrozen(first[0]),
      true,
    );

    assert.equal(
      Object.isFrozen(
        first[0].options,
      ),
      true,
    );

    const additionalGuest =
      first.find(
        (question) =>
          question.id ===
          "additionalGuestResponses",
      );

    assert.equal(
      Object.isFrozen(
        additionalGuest
          .instanceShape,
      ),
      true,
    );

    assert.equal(
      Object.isFrozen(
        additionalGuest
          .instanceShape
          .renderByKind,
      ),
      true,
    );

    assert.equal(
      Object.isFrozen(
        additionalGuest
          .instanceShape
          .renderByKind
          .unnamedChildren
          .countControl,
      ),
      true,
    );
  },
);

test(
  "preserves the spreadsheet-authoritative named-invitee attendance metadata",
  () => {
    const byId =
      loadQuestionsById();

    assert.equal(
      byId.namedInviteeResponses
        .type,
      "repeated-radio",
    );

    assert.equal(
      byId.namedInviteeResponses
        .repeatFromInvitationArray,
      "invitation.namedInvitees",
    );

    assert.equal(
      byId.namedInviteeResponses
        .instanceShape
        .submissionKeyFrom,
      "invitee.id",
    );

    assert.equal(
      byId.namedInviteeResponses
        .instanceShape
        .displayNameFrom,
      "invitee.displayName",
    );

    assert.deepEqual(
      byId.namedInviteeResponses
        .instanceShape
        .options,
      [
        {
          value: "yes",
          label: "Yes",
        },
        {
          value: "no",
          label: "No",
        },
      ],
    );
  },
);

test(
  "preserves one additionalGuestResponses substantive region with allocation-kind-dependent rendering",
  () => {
    const byId =
      loadQuestionsById();

    const additionalGuest =
      byId.additionalGuestResponses;

    assert.equal(
      additionalGuest.type,
      "repeated-allocation-dependent-control",
    );

    assert.equal(
      additionalGuest
        .repeatFromInvitationArray,
      "invitation.additionalGuestAllocations",
    );

    assert.equal(
      additionalGuest
        .instanceShape
        .submissionKeyFrom,
      "allocation.id",
    );

    assert.equal(
      additionalGuest
        .instanceShape
        .labelFrom,
      "allocation.prompt",
    );

    assert.deepEqual(
      Object.keys(
        additionalGuest
          .instanceShape
          .renderByKind,
      ),
      [
        "plus1",
        "unnamedChildren",
      ],
    );
  },
);

test(
  "preserves the one-person Plus1 allocation control contract",
  () => {
    const byId =
      loadQuestionsById();

    const plus1 =
      byId.additionalGuestResponses
        .instanceShape
        .renderByKind
        .plus1;

    assert.equal(
      plus1.controlType,
      "radio",
    );

    assert.equal(
      plus1.required,
      true,
    );

    assert.equal(
      plus1.maximumCountRequired,
      1,
    );

    assert.deepEqual(
      plus1.options,
      [
        {
          value: "yes",
          label: "Yes",
        },
        {
          value: "no",
          label: "No",
        },
      ],
    );

    assert.equal(
      plus1.submissionValueShape,
      "\"yes\" or \"no\"",
    );

    assert.equal(
      plus1.attendanceContribution,
      "yes => 1; no => 0",
    );
  },
);

test(
  "preserves the grouped unnamed-children family question and conditional count selector",
  () => {
    const byId =
      loadQuestionsById();

    const groupedChildren =
      byId.additionalGuestResponses
        .instanceShape
        .renderByKind
        .unnamedChildren;

    assert.equal(
      groupedChildren.controlType,
      "grouped-children-attendance",
    );

    assert.equal(
      groupedChildren.required,
      true,
    );

    assert.equal(
      groupedChildren.promptRequired,
      GROUPED_CHILD_PROMPT,
    );

    assert.deepEqual(
      groupedChildren
        .attendanceControl,
      {
        type: "radio",
        field: "attending",
        options: [
          {
            value: "yes",
            label: "Yes",
          },
          {
            value: "no",
            label: "No",
          },
        ],
      },
    );

    assert.deepEqual(
      groupedChildren
        .countControl
        .displayWhen,
      {
        allocationResponseFieldEquals: [
          "currentAllocationResponse",
          "attending",
          "yes",
        ],
      },
    );

    assert.equal(
      groupedChildren
        .countControl
        .type,
      "select",
    );

    assert.equal(
      groupedChildren
        .countControl
        .field,
      "count",
    );

    assert.equal(
      groupedChildren
        .countControl
        .label,
      "How many?",
    );

    assert.equal(
      groupedChildren
        .countControl
        .requiredWhenDisplayed,
      true,
    );

    assert.equal(
      groupedChildren
        .countControl
        .wholeNumber,
      true,
    );

    assert.equal(
      groupedChildren
        .countControl
        .minimum,
      1,
    );

    assert.equal(
      groupedChildren
        .countControl
        .maximumFrom,
      "allocation.maximumCount",
    );

    assert.deepEqual(
      groupedChildren
        .countControl
        .optionsFromInclusiveRange,
      [
        1,
        "allocation.maximumCount",
      ],
    );
  },
);

test(
  "preserves the grouped child mixed response shapes and attendance contribution",
  () => {
    const byId =
      loadQuestionsById();

    const groupedChildren =
      byId.additionalGuestResponses
        .instanceShape
        .renderByKind
        .unnamedChildren;

    assert.deepEqual(
      groupedChildren
        .submissionValueShapes,
      {
        yes: {
          attending: "yes",
          count:
            "integer 1..allocation.maximumCount",
        },
        no: {
          attending: "no",
          count: 0,
        },
      },
    );

    assert.equal(
      groupedChildren
        .attendanceContribution,
      "attending=yes => count; attending=no => 0",
    );
  },
);

test(
  "preserves allocation-kind validation metadata for additional guest responses",
  () => {
    const byId =
      loadQuestionsById();

    const validation =
      byId.additionalGuestResponses
        .validation;

    assert.equal(
      validation
        .authorizedAllocationIdsOnly,
      true,
    );

    assert.equal(
      validation
        .duplicateAllocationIdsRejected,
      true,
    );

    assert.equal(
      validation
        .allAuthorizedAllocationsRequiredOnInitialAttending,
      true,
    );

    assert.equal(
      validation
        .allAuthorizedAllocationsRequiredWhenNewlyApplicable,
      true,
    );

    assert.equal(
      validation
        .allocationResponseShapeByKind,
      true,
    );

    assert.equal(
      validation
        .plus1ResponseRule,
      true,
    );

    assert.equal(
      validation
        .unnamedChildrenResponseRule,
      true,
    );

    assert.equal(
      validation
        .groupedChildrenCountSelectorRange,
      true,
    );

    assert.equal(
      validation
        .atMostOneUnnamedChildrenAllocationPerInvitation,
      true,
    );
  },
);

test(
  "preserves backend-derived overall attendance and exact age-total metadata",
  () => {
    const byId =
      loadQuestionsById();

    assert.equal(
      byId.attendanceTotals
        .validation
        .sumEqualsDerived,
      "overallAttendance",
    );

    assert.equal(
      byId.attendanceTotals
        .validation
        .overallAttendanceClientWritable,
      false,
    );

    assert.equal(
      byId.attendanceTotals
        .validation
        .coordinatedNumberGroup,
      true,
    );

    assert.equal(
      byId.attendanceTotals
        .patchBehavior
        .replacementRequiredWhen,
      "authorized attendance-response changes cause the complete merged attendanceTotals sum to differ from newly derived overallAttendance",
    );
  },
);

test(
  "preserves all-attendance attendee details and grouped-child composition replacement metadata",
  () => {
    const byId =
      loadQuestionsById();

    const attendeeDetails =
      byId.attendeeDetails;

    assert.equal(
      attendeeDetails
        .repeatCountFromDerivedValue,
      "overallAttendance",
    );

    assert.equal(
      attendeeDetails
        .fields[0]
        .id,
      "attendeeName",
    );

    assert.equal(
      attendeeDetails
        .fields[0]
        .validation
        .maximumLength,
      100,
    );

    assert.equal(
      attendeeDetails
        .fields[1]
        .id,
      "dietaryPreferences",
    );

    assert.equal(
      attendeeDetails
        .fields[1]
        .label,
      "Dietary or allergy information",
    );

    assert.equal(
      attendeeDetails
        .fields[1]
        .required,
      false,
    );

    assert.equal(
      attendeeDetails
        .fields[1]
        .validation
        .maximumLength,
      1000,
    );

    assert.equal(
      attendeeDetails
        .fields[1]
        .displayCondition
        .attendanceIncludes,
      "reception",
    );

    assert.equal(
      attendeeDetails
        .patchBehavior
        .completeReplacementWhenSubmitted,
      true,
    );

    assert.deepEqual(
      attendeeDetails
        .patchBehavior
        .replacementRequiredWhen,
      [
        "overallAttendance changes because named-invitee, Plus1, or grouped-child attendance changes",
        "named-invitee or Plus1 composition changes even when overallAttendance remains numerically unchanged",
        "any unnamedChildren response/count changes",
      ],
    );
  },
);

test(
  "keeps grouped children inside additionalGuestResponses rather than introducing another substantive question",
  () => {
    const questions =
      loadReusableRsvpQuestions();

    const ids =
      questions.map(
        (question) =>
          question.id,
      );

    assert.equal(
      ids.includes(
        "childrenResponses",
      ),
      false,
    );

    assert.equal(
      ids.includes(
        "unnamedChildrenResponses",
      ),
      false,
    );

    assert.equal(
      ids.includes(
        "childCount",
      ),
      false,
    );

    assert.equal(
      ids.includes(
        "overallAttendance",
      ),
      false,
    );

    assert.equal(
      ids.filter(
        (id) =>
          id ===
          "additionalGuestResponses",
      ).length,
      1,
    );
  },
);

test(
  "rejects a reusable schema with missing or reordered permanent questions",
  () => {
    const malformed = {
      formSchemas: [
        {
          schemaId:
            "spreadsheet-authoritative-rsvp",
          questions:
            EXPECTED_QUESTION_IDS
              .slice(0, -1)
              .map((id) => ({
                id,
              })),
        },
      ],
    };

    withTemporaryJson(
      malformed,
      (filePath) => {
        assert.throws(
          () =>
            loadReusableRsvpQuestions({
              filePath,
            }),
          /schema validation failed/,
        );
      },
    );
  },
);

test(
  "rejects a reusable schema with a duplicate permanent question ID",
  () => {
    const malformed = {
      formSchemas: [
        {
          schemaId:
            "spreadsheet-authoritative-rsvp",
          questions:
            EXPECTED_QUESTION_IDS.map(
              (id) => ({
                id,
              }),
            ),
        },
      ],
    };

    malformed
      .formSchemas[0]
      .questions[8]
      .id =
      "confirmationMobile";

    withTemporaryJson(
      malformed,
      (filePath) => {
        assert.throws(
          () =>
            loadReusableRsvpQuestions({
              filePath,
            }),
          /schema validation failed/,
        );
      },
    );
  },
);

test(
  "reports safe load failure for unreadable or invalid JSON schema input",
  () => {
    assert.throws(
      () =>
        loadReusableRsvpQuestions({
          filePath:
            path.join(
              os.tmpdir(),
              "missing-rsvp-form-schema.json",
            ),
        }),
      /Unable to load the reusable RSVP form schema/,
    );

    const directory =
      fs.mkdtempSync(
        path.join(
          os.tmpdir(),
          "wedding-rsvp-schema-invalid-",
        ),
      );

    const filePath =
      path.join(
        directory,
        "schema.json",
      );

    try {
      fs.writeFileSync(
        filePath,
        "{not valid json",
        "utf8",
      );

      assert.throws(
        () =>
          loadReusableRsvpQuestions({
            filePath,
          }),
        /Unable to load the reusable RSVP form schema/,
      );
    } finally {
      fs.rmSync(
        directory,
        {
          recursive: true,
          force: true,
        },
      );
    }
  },
);
