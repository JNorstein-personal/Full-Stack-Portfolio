const fs = require("node:fs");
const path = require("node:path");
const { z } = require("zod");

const {
  normalizeInvitationCode,
} = require("./invitationCode");

const DEFAULT_DEVELOPMENT_FIXTURE_PATH =
  path.resolve(
    __dirname,
    "../../../docs/rsvp-example-configurations.json",
  );

const questionIdSchema = z.enum([
  "eventAttendance",
  "declineAttendance",
  "additionalGuestAttendance",
  "attendanceTotals",
  "dietaryPreferences",
]);

const invitationFixtureSchema = z
  .object({
    inviteCode: z
      .string()
      .regex(/^[A-Z0-9]{6}$/),

    inviteCodeDisplay: z
      .string()
      .regex(/^[A-Z0-9]{3}-[A-Z0-9]{3}$/),

    partyId: z.string().min(1),

    partyDisplayName: z.string().min(1),

    greeting: z.string().min(1),

    wordingMode: z.enum([
      "singular",
      "plural",
    ]),

    maximumAttendance: z
      .number()
      .int()
      .positive(),

    additionalGuestAllowance: z
      .number()
      .int()
      .nonnegative(),

    questionProfile: z.enum([
      "default",
      "reduced-attendance-dietary",
    ]),

    questionIds: z
      .array(questionIdSchema)
      .min(1)
      .refine(
        (values) =>
          new Set(values).size === values.length,
        {
          message:
            "questionIds must not contain duplicates",
        },
      ),

    active: z.boolean(),

    environment: z.literal("development"),
  })
  .strict();

const invitationFixtureRegistrySchema =
  z.array(invitationFixtureSchema).min(1);

function arraysEqual(left, right) {
  return (
    left.length === right.length &&
    left.every(
      (value, index) =>
        value === right[index],
    )
  );
}

function expectedQuestionIds(fixture) {
  if (
    fixture.questionProfile ===
    "reduced-attendance-dietary"
  ) {
    return [
      "eventAttendance",
      "declineAttendance",
      "dietaryPreferences",
    ];
  }

  const questionIds = [
    "eventAttendance",
    "declineAttendance",
  ];

  if (
    fixture.additionalGuestAllowance > 0
  ) {
    questionIds.push(
      "additionalGuestAttendance",
    );
  }

  questionIds.push(
    "attendanceTotals",
    "dietaryPreferences",
  );

  return questionIds;
}

function validateFixtureSemantics(fixtures) {
  const canonicalCodes = new Set();
  const partyIds = new Set();

  for (
    let index = 0;
    index < fixtures.length;
    index += 1
  ) {
    const fixture = fixtures[index];

    const normalized =
      normalizeInvitationCode(
        fixture.inviteCode,
      );

    if (
      !normalized ||
      normalized.canonicalCode !==
        fixture.inviteCode ||
      normalized.displayCode !==
        fixture.inviteCodeDisplay
    ) {
      throw new Error(
        `Development invitation fixture ${index} has inconsistent code representations.`,
      );
    }

    if (
      canonicalCodes.has(
        normalized.canonicalCode,
      )
    ) {
      throw new Error(
        `Development invitation fixture ${index} creates a canonical-code collision.`,
      );
    }

    canonicalCodes.add(
      normalized.canonicalCode,
    );

    if (partyIds.has(fixture.partyId)) {
      throw new Error(
        `Development invitation fixture ${index} duplicates a party identifier.`,
      );
    }

    partyIds.add(fixture.partyId);

    if (
      fixture.questionProfile ===
        "reduced-attendance-dietary" &&
      fixture.additionalGuestAllowance !== 0
    ) {
      throw new Error(
        `Development invitation fixture ${index} gives the reduced profile an unauthorized additional-guest allowance.`,
      );
    }

    const expectedIds =
      expectedQuestionIds(fixture);

    if (
      !arraysEqual(
        fixture.questionIds,
        expectedIds,
      )
    ) {
      throw new Error(
        `Development invitation fixture ${index} has question IDs inconsistent with its profile and allowance.`,
      );
    }
  }
}

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

function loadDevelopmentInvitationFixtures({
  runtimeEnvironment =
    process.env.NODE_ENV ||
    "development",

  filePath =
    DEFAULT_DEVELOPMENT_FIXTURE_PATH,
} = {}) {
  if (
    runtimeEnvironment !== "development" &&
    runtimeEnvironment !== "test"
  ) {
    throw new Error(
      "Development invitation fixtures are disabled outside development and test environments.",
    );
  }

  let rawRegistry;

  try {
    rawRegistry = JSON.parse(
      fs.readFileSync(
        filePath,
        "utf8",
      ),
    );
  } catch {
    throw new Error(
      "Unable to load development invitation fixtures.",
    );
  }

  const parsed =
    invitationFixtureRegistrySchema.safeParse(
      rawRegistry,
    );

  if (!parsed.success) {
    throw new Error(
      "Development invitation fixture schema validation failed.",
    );
  }

  validateFixtureSemantics(
    parsed.data,
  );

  const fixtures =
    parsed.data.map((fixture) =>
      deepFreeze({
        ...fixture,
        questionIds: [
          ...fixture.questionIds,
        ],
      }),
    );

  const byCanonicalCode =
    Object.create(null);

  for (const fixture of fixtures) {
    byCanonicalCode[
      fixture.inviteCode
    ] = fixture;
  }

  deepFreeze(byCanonicalCode);

  return Object.freeze({
    fixtures: Object.freeze(fixtures),
    byCanonicalCode,
  });
}

module.exports = {
  DEFAULT_DEVELOPMENT_FIXTURE_PATH,
  loadDevelopmentInvitationFixtures,
};