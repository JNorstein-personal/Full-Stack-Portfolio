const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const {
  loadProductionSourceFile,
  parseCsv,
} = require("../src/rsvp/productionSourceFile");

test(
  "CSV parser preserves quoted commas, quoted newlines, and escaped quotes",
  () => {
    const rows =
      parseCsv(
        [
          "Guest ID,First Name(s),Attendee Names Clarification",
          'ABC123,Example,"The Example, Household"',
          'DEF456,Second,"Line one',
          'Line two ""quoted"""',
        ].join("\r\n"),
      );

    assert.deepEqual(
      rows,
      [
        {
          "Guest ID":
            "ABC123",
          "First Name(s)":
            "Example",
          "Attendee Names Clarification":
            "The Example, Household",
        },
        {
          "Guest ID":
            "DEF456",
          "First Name(s)":
            "Second",
          "Attendee Names Clarification":
            'Line one\r\nLine two "quoted"',
        },
      ],
    );
  },
);

test(
  "CSV parser rejects malformed quoting and duplicate headers",
  () => {
    assert.throws(
      () =>
        parseCsv(
          'Guest ID,Name\nABC123,"unterminated',
        ),
      /unterminated quoted field/,
    );

    assert.throws(
      () =>
        parseCsv(
          "Guest ID,Guest ID\nABC123,DEF456",
        ),
      /duplicate headers/,
    );
  },
);

test(
  "private source loader reads JSON and CSV row exports without exposing file contents in errors",
  () => {
    const directory =
      fs.mkdtempSync(
        path.join(
          os.tmpdir(),
          "rsvp-source-",
        ),
      );

    const jsonPath =
      path.join(
        directory,
        "source.json",
      );

    const csvPath =
      path.join(
        directory,
        "source.csv",
      );

    fs.writeFileSync(
      jsonPath,
      JSON.stringify([
        {
          "Guest ID":
            "ABC123",
        },
      ]),
      "utf8",
    );

    fs.writeFileSync(
      csvPath,
      "\uFEFFGuest ID,First Name(s)\nABC123,Example\n",
      "utf8",
    );

    assert.deepEqual(
      loadProductionSourceFile(
        jsonPath,
      ),
      [
        {
          "Guest ID":
            "ABC123",
        },
      ],
    );

    assert.deepEqual(
      loadProductionSourceFile(
        csvPath,
      ),
      [
        {
          "Guest ID":
            "ABC123",
          "First Name(s)":
            "Example",
        },
      ],
    );
  },
);

test(
  "private source loader rejects unsupported or invalid input with generic errors",
  () => {
    const directory =
      fs.mkdtempSync(
        path.join(
          os.tmpdir(),
          "rsvp-source-invalid-",
        ),
      );

    const jsonPath =
      path.join(
        directory,
        "private-secret-source.json",
      );

    const textPath =
      path.join(
        directory,
        "private-secret-source.txt",
      );

    fs.writeFileSync(
      jsonPath,
      "{",
      "utf8",
    );

    fs.writeFileSync(
      textPath,
      "SECRET-GUEST-CONTENT",
      "utf8",
    );

    for (
      const [
        target,
        pattern,
      ] of [
        [
          jsonPath,
          /JSON source is invalid/,
        ],
        [
          textPath,
          /must be a \.json or \.csv file/,
        ],
      ]
    ) {
      let error;

      try {
        loadProductionSourceFile(
          target,
        );
      } catch (caughtError) {
        error = caughtError;
      }

      assert.ok(
        error instanceof Error,
      );
      assert.match(
        error.message,
        pattern,
      );
      assert.equal(
        error.message.includes(
          "SECRET-GUEST-CONTENT",
        ),
        false,
      );
      assert.equal(
        error.message.includes(
          "private-secret-source",
        ),
        false,
      );
    }
  },
);
