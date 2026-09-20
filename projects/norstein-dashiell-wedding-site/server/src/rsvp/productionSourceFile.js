const fs = require("node:fs");
const path = require("node:path");
const {
  TextDecoder,
} = require("node:util");

const HEADER_ALIASES =
  Object.freeze({
    "Invite #:": "Invite #",
    "Guest ID:": "Guest ID",
    "Kids(#?), Plus1 (which guest) or N/A":
      "Plus1",
    "Total Potential Attendees (Including Plus1 and Kids):":
      "Total Potential Attendees (Including Plus1 and Kids)",
  });

function normalizeHeader(
  header,
) {
  const normalized =
    String(header)
      .trim()
      .replace(
        /^\uFEFF/,
        "",
      );

  return (
    HEADER_ALIASES[
      normalized
    ] || normalized
  );
}

function normalizeRecordHeaders(
  record,
) {
  if (
    record === null ||
    typeof record !== "object" ||
    Array.isArray(record)
  ) {
    return record;
  }

  const normalized = {};

  for (
    const [
      key,
      value,
    ] of Object.entries(record)
  ) {
    const canonical =
      normalizeHeader(key);

    if (
      Object.prototype
        .hasOwnProperty.call(
          normalized,
          canonical,
        )
    ) {
      throw new Error(
        "Private RSVP production source contains duplicate canonical headers.",
      );
    }

    normalized[canonical] =
      value;
  }

  return normalized;
}

function decodeSourceBuffer(
  buffer,
) {
  try {
    return new TextDecoder(
      "utf-8",
      {
        fatal: true,
      },
    ).decode(buffer);
  } catch {
    try {
      return new TextDecoder(
        "windows-1252",
        {
          fatal: true,
        },
      ).decode(buffer);
    } catch {
      throw new Error(
        "Private RSVP production source uses an unsupported text encoding.",
      );
    }
  }
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (
    let index = 0;
    index < text.length;
    index += 1
  ) {
    const character =
      text[index];

    if (quoted) {
      if (
        character === '"' &&
        text[index + 1] === '"'
      ) {
        field += '"';
        index += 1;
        continue;
      }

      if (character === '"') {
        quoted = false;
        continue;
      }

      field += character;
      continue;
    }

    if (character === '"') {
      if (field !== "") {
        throw new Error(
          "Private production CSV contains malformed quoting.",
        );
      }

      quoted = true;
      continue;
    }

    if (character === ",") {
      row.push(field);
      field = "";
      continue;
    }

    if (
      character === "\n" ||
      character === "\r"
    ) {
      if (
        character === "\r" &&
        text[index + 1] === "\n"
      ) {
        index += 1;
      }

      row.push(field);
      field = "";

      if (
        row.some(
          (value) =>
            value !== "",
        )
      ) {
        rows.push(row);
      }

      row = [];
      continue;
    }

    field += character;
  }

  if (quoted) {
    throw new Error(
      "Private production CSV contains an unterminated quoted field.",
    );
  }

  row.push(field);

  if (
    row.some(
      (value) => value !== "",
    )
  ) {
    rows.push(row);
  }

  if (rows.length < 2) {
    throw new Error(
      "Private production CSV must contain a header row and at least one data row.",
    );
  }

  const headers =
    rows[0].map(
      (header) =>
        normalizeHeader(
          header,
        ),
    );

  if (
    headers.some(
      (header) =>
        header === "",
    ) ||
    new Set(headers).size !==
      headers.length
  ) {
    throw new Error(
      "Private production CSV contains invalid or duplicate headers.",
    );
  }

  return rows
    .slice(1)
    .map((values) => {
      const record = {};

      for (
        let index = 0;
        index < headers.length;
        index += 1
      ) {
        record[headers[index]] =
          values[index] ===
          undefined
            ? ""
            : values[index];
      }

      return record;
    });
}

function loadProductionSourceFile(
  filePath,
) {
  if (
    typeof filePath !==
      "string" ||
    filePath.trim() === ""
  ) {
    throw new Error(
      "RSVP production transformation requires RSVP_PRODUCTION_SOURCE_FILE.",
    );
  }

  const resolved =
    path.resolve(filePath);

  let content;

  try {
    const buffer =
      fs.readFileSync(
        resolved,
      );

    content =
      decodeSourceBuffer(
        buffer,
      );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.startsWith(
        "Private RSVP production source uses"
      )
    ) {
      throw error;
    }

    throw new Error(
      "Unable to read the private RSVP production source file.",
    );
  }

  const extension =
    path
      .extname(resolved)
      .toLowerCase();

  if (extension === ".json") {
    try {
      const parsed =
        JSON.parse(content);

      if (!Array.isArray(parsed)) {
        throw new Error();
      }

      return parsed.map(
        normalizeRecordHeaders,
      );
    } catch {
      throw new Error(
        "Private RSVP production JSON source is invalid.",
      );
    }
  }

  if (extension === ".csv") {
    return parseCsv(content);
  }

  throw new Error(
    "Private RSVP production source must be a .json or .csv file.",
  );
}

module.exports = {
  decodeSourceBuffer,
  loadProductionSourceFile,
  normalizeHeader,
  normalizeRecordHeaders,
  parseCsv,
};
