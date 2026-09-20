const { z } = require("zod");

const {
  parseTrustProxySetting,
} = require("./trustProxy");

const PROJECT_SITE_BASE_PATH = "/wedding";
const PROJECT_RSVP_DEADLINE = "2027-03-01T23:59:00-05:00";
const PROJECT_RSVP_TIME_ZONE = "America/New_York";

function emptyStringToUndefined(value) {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();

  return trimmed === "" ? undefined : trimmed;
}

const optionalString = z.preprocess(
  emptyStringToUndefined,
  z.string().min(1).optional(),
);

const optionalEmail = z.preprocess(
  emptyStringToUndefined,
  z.string().email().optional(),
);

const optionalUrl = z.preprocess(
  emptyStringToUndefined,
  z.string().url().optional(),
);

const trustProxySchema =
  optionalString.superRefine(
    (value, context) => {
      if (value === undefined) {
        return;
      }

      try {
        parseTrustProxySetting(
          value,
        );
      } catch {
        context.addIssue({
          code: "custom",
          message:
            "must identify a bounded trusted proxy chain",
        });
      }
    },
  );

const portSchema = z.preprocess(
  (value) => {
    if (value === undefined || value === "") {
      return 3001;
    }

    if (typeof value === "string") {
      return Number(value);
    }

    return value;
  },
  z.number().int().min(1).max(65535),
);

const booleanSchema = z.preprocess(
  (value) => {
    if (value === undefined || value === "") {
      return false;
    }

    if (typeof value === "boolean") {
      return value;
    }

    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();

      if (normalized === "true") {
        return true;
      }

      if (normalized === "false") {
        return false;
      }
    }

    return value;
  },
  z.boolean(),
);

const deadlineSchema = z
  .string()
  .refine(
    (value) =>
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/.test(
        value,
      ),
    {
      message:
        "must be an ISO-8601 date-time with an explicit UTC offset",
    },
  )
  .refine(
    (value) => !Number.isNaN(Date.parse(value)),
    {
      message: "must represent a valid date-time",
    },
  );

const environmentSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    HOST: z.string().min(1).default("127.0.0.1"),

    PORT: portSchema,

    SITE_BASE_PATH: z
      .literal(PROJECT_SITE_BASE_PATH)
      .default(PROJECT_SITE_BASE_PATH),

    GOOGLE_SPREADSHEET_ID: optionalString,

    RSVP_DEADLINE: deadlineSchema.default(
      PROJECT_RSVP_DEADLINE,
    ),

    RSVP_TIME_ZONE: z
      .literal(PROJECT_RSVP_TIME_ZONE)
      .default(PROJECT_RSVP_TIME_ZONE),

    RSVP_ADMIN_NOTIFICATION_EMAIL: optionalEmail,

    EMAIL_PROVIDER: optionalString,

    RSVP_FROM_EMAIL: optionalEmail,

    SMS_PROVIDER: optionalString,

    RSVP_SMS_ENABLED: booleanSchema,

    ALLOWED_ORIGIN: optionalUrl,

    TRUST_PROXY: trustProxySchema,
  })
  .superRefine((environment, context) => {
    if (
      environment.RSVP_SMS_ENABLED &&
      !environment.SMS_PROVIDER
    ) {
      context.addIssue({
        code: "custom",
        path: ["SMS_PROVIDER"],
        message:
          "is required when RSVP_SMS_ENABLED=true",
      });
    }

    if (environment.NODE_ENV !== "production") {
      return;
    }

    const productionRequired = [
      "GOOGLE_SPREADSHEET_ID",
      "RSVP_ADMIN_NOTIFICATION_EMAIL",
      "EMAIL_PROVIDER",
      "RSVP_FROM_EMAIL",
      "ALLOWED_ORIGIN",
      "TRUST_PROXY",
    ];

    for (const key of productionRequired) {
      if (!environment[key]) {
        context.addIssue({
          code: "custom",
          path: [key],
          message:
            "is required when NODE_ENV=production",
        });
      }
    }
  });

function formatValidationError(error) {
  const details = error.issues.map((issue) => {
    const path =
      issue.path.length > 0
        ? issue.path.join(".")
        : "environment";

    return `${path}: ${issue.message}`;
  });

  return [
    "Invalid server environment configuration:",
    ...details.map((detail) => `- ${detail}`),
  ].join("\n");
}

function parseEnvironment(rawEnvironment = {}) {
  const result =
    environmentSchema.safeParse(rawEnvironment);

  if (!result.success) {
    throw new Error(
      formatValidationError(result.error),
    );
  }

  return Object.freeze(result.data);
}

function loadEnvironment() {
  return parseEnvironment(process.env);
}

module.exports = {
  PROJECT_SITE_BASE_PATH,
  PROJECT_RSVP_DEADLINE,
  PROJECT_RSVP_TIME_ZONE,
  parseEnvironment,
  loadEnvironment,
};