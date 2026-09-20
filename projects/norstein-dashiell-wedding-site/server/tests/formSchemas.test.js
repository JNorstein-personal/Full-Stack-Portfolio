const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  EXPECTED_QUESTION_IDS,
  loadReusableRsvpQuestions,
} = require("../src/rsvp/formSchemas");

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
  },
);

test(
  "preserves the spreadsheet-authoritative conditional and repeatable schema metadata",
  () => {
    const questions =
      loadReusableRsvpQuestions();

    const byId =
      Object.fromEntries(
        questions.map(
          (question) => [
            question.id,
            question,
          ],
        ),
      );

    assert.equal(
      byId.additionalGuestResponses
        .repeatFromInvitationArray,
      "invitation.additionalGuestAllocations",
    );

    assert.equal(
      byId.attendanceTotals
        .validation
        .sumMaximumFrom,
      "invitation.maximumAttendance",
    );

    assert.equal(
      byId.receptionAttendeeDetails
        .repeatCountFromDerivedValue,
      "overallAttendance",
    );

    assert.equal(
      byId.receptionAttendeeDetails
        .fields[0]
        .validation
        .maximumLength,
      100,
    );

    assert.equal(
      byId.receptionAttendeeDetails
        .fields[1]
        .validation
        .maximumLength,
      1000,
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
