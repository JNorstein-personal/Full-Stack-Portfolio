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

const additionalGuestAllocationSchema = z
  .object({
    id: z
      .string()
      .regex(
        /^plus1-[a-z0-9]+(?:-[a-z0-9]+)*$/,
      ),

    prompt: z
      .string()
      .min(1)
      .max(200)
      .regex(
        /^Will .+ be accompanied by a \+1\?$/,
      ),
  })
  .strict();

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

    additionalGuestAllocations: z
      .array(additionalGuestAllocationSchema),

    active: z.boolean(),

    environment: z.literal("development"),
  })
  .strict()
  .superRefine((fixture, context) => {
    const allocationIds = new Set();

    for (
      let index = 0;
      index <
      fixture.additionalGuestAllocations.length;
      index += 1
    ) {
      const allocation =
        fixture.additionalGuestAllocations[index];

      if (allocationIds.has(allocation.id)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: [
            "additionalGuestAllocations",
            index,
            "id",
          ],
          message:
            "additionalGuestAllocations must not contain duplicate IDs",
        });
      }

      allocationIds.add(allocation.id);
    }

    if (
      fixture.additionalGuestAllocations
        .length >= fixture.maximumAttendance
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["additionalGuestAllocations"],
        message:
          "additionalGuestAllocations must leave room for at least one primary invited attendee within maximumAttendance",
      });
    }
  });

const invitationFixtureRegistrySchema =
  z.array(invitationFixtureSchema).min(1);

function validateFixtureSemantics(fixtures) {
  const canonicalCodes = new Set();
  const partyIds = new Set();
  const allocationIds = new Set();

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

    for (
      const allocation of
      fixture.additionalGuestAllocations
    ) {
      if (allocationIds.has(allocation.id)) {
        throw new Error(
          `Development invitation fixture ${index} duplicates an additional-guest allocation identifier.`,
        );
      }

      allocationIds.add(allocation.id);
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

function cloneFixture(fixture) {
  return {
    ...fixture,

    additionalGuestAllocations:
      fixture.additionalGuestAllocations.map(
        (allocation) => ({
          ...allocation,
        }),
      ),
  };
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
      deepFreeze(
        cloneFixture(fixture),
      ),
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
