const fs = require("node:fs");
const path = require("node:path");

const DEFAULT_FORM_SCHEMA_PATH =
  path.resolve(
    __dirname,
    "../../../docs/rsvp-example-form-schemas.json",
  );

const EXPECTED_QUESTION_IDS =
  Object.freeze([
    "eventAttendance",
    "additionalGuestResponses",
    "attendanceTotals",
    "receptionAttendeeDetails",
    "confirmationMethod",
    "confirmationEmail",
    "confirmationMobile",
    "smsAuthorization",
  ]);

function deepFreeze(value) {
  if (
    value === null ||
    typeof value !== "object" ||
    Object.isFrozen(value)
  ) {
    return value;
  }

  for (const child of Object.values(value)) {
    deepFreeze(child);
  }

  return Object.freeze(value);
}

function cloneJsonValue(value) {
  return JSON.parse(
    JSON.stringify(value),
  );
}

function loadReusableRsvpQuestions({
  filePath = DEFAULT_FORM_SCHEMA_PATH,
} = {}) {
  let document;

  try {
    document = JSON.parse(
      fs.readFileSync(
        filePath,
        "utf8",
      ),
    );
  } catch {
    throw new Error(
      "Unable to load the reusable RSVP form schema.",
    );
  }

  if (
    !document ||
    !Array.isArray(
      document.formSchemas,
    )
  ) {
    throw new Error(
      "Reusable RSVP form schema validation failed.",
    );
  }

  const schema =
    document.formSchemas.find(
      (candidate) =>
        candidate &&
        candidate.schemaId ===
          "spreadsheet-authoritative-rsvp",
    );

  if (
    !schema ||
    !Array.isArray(schema.questions)
  ) {
    throw new Error(
      "Reusable RSVP form schema validation failed.",
    );
  }

  const questionIds =
    schema.questions.map(
      (question) =>
        question &&
        question.id,
    );

  const hasExpectedQuestions =
    questionIds.length ===
      EXPECTED_QUESTION_IDS.length &&
    questionIds.every(
      (questionId, index) =>
        questionId ===
        EXPECTED_QUESTION_IDS[index],
    ) &&
    new Set(questionIds).size ===
      EXPECTED_QUESTION_IDS.length;

  if (!hasExpectedQuestions) {
    throw new Error(
      "Reusable RSVP form schema validation failed.",
    );
  }

  return deepFreeze(
    cloneJsonValue(
      schema.questions,
    ),
  );
}

module.exports = {
  DEFAULT_FORM_SCHEMA_PATH,
  EXPECTED_QUESTION_IDS,
  loadReusableRsvpQuestions,
};
