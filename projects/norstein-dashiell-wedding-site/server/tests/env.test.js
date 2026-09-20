const test = require("node:test");
const assert = require("node:assert/strict");

const {
  PROJECT_RSVP_DEADLINE,
  PROJECT_RSVP_TIME_ZONE,
  PROJECT_SITE_BASE_PATH,
  parseEnvironment,
} = require("../src/config/env");

function makeDevelopmentEnvironment(
  overrides = {},
) {
  return {
    NODE_ENV: "development",
    HOST: "127.0.0.1",
    PORT: "3001",
    SITE_BASE_PATH: PROJECT_SITE_BASE_PATH,
    RSVP_DEADLINE: PROJECT_RSVP_DEADLINE,
    RSVP_TIME_ZONE: PROJECT_RSVP_TIME_ZONE,
    RSVP_SMS_ENABLED: "false",
    ...overrides,
  };
}

test(
  "parses the valid development environment",
  () => {
    const environment = parseEnvironment(
      makeDevelopmentEnvironment(),
    );

    assert.equal(environment.NODE_ENV, "development");
    assert.equal(environment.HOST, "127.0.0.1");
    assert.equal(environment.PORT, 3001);
    assert.equal(
      environment.SITE_BASE_PATH,
      "/wedding",
    );
    assert.equal(
      environment.RSVP_DEADLINE,
      "2027-03-01T23:59:00-05:00",
    );
    assert.equal(
      environment.RSVP_TIME_ZONE,
      "America/New_York",
    );
    assert.equal(
      environment.RSVP_SMS_ENABLED,
      false,
    );
  },
);

test(
  "uses safe development defaults when baseline values are omitted",
  () => {
    const environment = parseEnvironment({});

    assert.equal(environment.NODE_ENV, "development");
    assert.equal(environment.HOST, "127.0.0.1");
    assert.equal(environment.PORT, 3001);
    assert.equal(
      environment.SITE_BASE_PATH,
      "/wedding",
    );
    assert.equal(
      environment.RSVP_DEADLINE,
      "2027-03-01T23:59:00-05:00",
    );
    assert.equal(
      environment.RSVP_TIME_ZONE,
      "America/New_York",
    );
    assert.equal(
      environment.RSVP_SMS_ENABLED,
      false,
    );
  },
);

test(
  "rejects an unexpected site base path",
  () => {
    assert.throws(
      () =>
        parseEnvironment(
          makeDevelopmentEnvironment({
            SITE_BASE_PATH: "/other",
          }),
        ),
      /SITE_BASE_PATH/,
    );
  },
);

test(
  "rejects a port outside the TCP port range",
  () => {
    assert.throws(
      () =>
        parseEnvironment(
          makeDevelopmentEnvironment({
            PORT: "70000",
          }),
        ),
      /PORT/,
    );
  },
);

test(
  "rejects an RSVP deadline without an explicit offset",
  () => {
    assert.throws(
      () =>
        parseEnvironment(
          makeDevelopmentEnvironment({
            RSVP_DEADLINE:
              "2027-03-01T23:59:00",
          }),
        ),
      /RSVP_DEADLINE/,
    );
  },
);

test(
  "rejects a different RSVP timezone",
  () => {
    assert.throws(
      () =>
        parseEnvironment(
          makeDevelopmentEnvironment({
            RSVP_TIME_ZONE: "UTC",
          }),
        ),
      /RSVP_TIME_ZONE/,
    );
  },
);

test(
  "rejects an invalid RSVP_SMS_ENABLED value",
  () => {
    assert.throws(
      () =>
        parseEnvironment(
          makeDevelopmentEnvironment({
            RSVP_SMS_ENABLED: "maybe",
          }),
        ),
      /RSVP_SMS_ENABLED/,
    );
  },
);

test(
  "requires an SMS provider when SMS is enabled",
  () => {
    assert.throws(
      () =>
        parseEnvironment(
          makeDevelopmentEnvironment({
            RSVP_SMS_ENABLED: "true",
          }),
        ),
      /SMS_PROVIDER/,
    );
  },
);

test(
  "does not require provider credentials during ordinary development",
  () => {
    const environment = parseEnvironment(
      makeDevelopmentEnvironment({
        GOOGLE_SPREADSHEET_ID: "",
        RSVP_ADMIN_NOTIFICATION_EMAIL: "",
        EMAIL_PROVIDER: "",
        RESEND_API_KEY: "",
        RSVP_FROM_NAME: "",
        RSVP_FROM_EMAIL: "",
        RSVP_REPLY_TO_EMAIL: "",
        SMS_PROVIDER: "",
        ALLOWED_ORIGIN: "",
        TRUST_PROXY: "",
      }),
    );

    assert.equal(
      environment.GOOGLE_SPREADSHEET_ID,
      undefined,
    );
    assert.equal(
      environment.EMAIL_PROVIDER,
      undefined,
    );
    assert.equal(
      environment.SMS_PROVIDER,
      undefined,
    );
  },
);

test(
  "requires production-only integration settings in production",
  () => {
    assert.throws(
      () =>
        parseEnvironment(
          makeDevelopmentEnvironment({
            NODE_ENV: "production",
          }),
        ),
      /NODE_ENV=production/,
    );
  },
);

test(
  "accepts a structurally complete fictional production configuration",
  () => {
    const environment = parseEnvironment(
      makeDevelopmentEnvironment({
        NODE_ENV: "production",
        GOOGLE_SPREADSHEET_ID:
          "fictional-spreadsheet-id",
        RSVP_ADMIN_NOTIFICATION_EMAIL:
          "admin@example.com",
        EMAIL_PROVIDER:
          "resend",
        RESEND_API_KEY:
          "re_fictional_test_key",
        RSVP_FROM_NAME:
          "Example Wedding",
        RSVP_FROM_EMAIL:
          "rsvp@example.com",
        RSVP_REPLY_TO_EMAIL:
          "help@example.com",
        ALLOWED_ORIGIN:
          "https://example.com",
        TRUST_PROXY: "1",
      }),
    );

    assert.equal(
      environment.NODE_ENV,
      "production",
    );
    assert.equal(
      environment.GOOGLE_SPREADSHEET_ID,
      "fictional-spreadsheet-id",
    );
    assert.equal(
      environment.RSVP_SMS_ENABLED,
      false,
    );
  },
);

test(
  "validation errors identify fields without echoing invalid values",
  () => {
    const secretLikeValue =
      "DO-NOT-ECHO-THIS-VALUE";

    let error;

    try {
      parseEnvironment(
        makeDevelopmentEnvironment({
          NODE_ENV: "production",
          RSVP_ADMIN_NOTIFICATION_EMAIL:
            secretLikeValue,
        }),
      );
    } catch (caughtError) {
      error = caughtError;
    }

    assert.ok(error instanceof Error);

    assert.match(
      error.message,
      /RSVP_ADMIN_NOTIFICATION_EMAIL/,
    );

    assert.equal(
      error.message.includes(secretLikeValue),
      false,
    );
  },
);

test(
  "rejects blanket trusted-proxy configuration without echoing the value",
  () => {
    const unsafeValue =
      "true";

    let error;

    try {
      parseEnvironment(
        makeDevelopmentEnvironment({
          TRUST_PROXY:
            unsafeValue,
        }),
      );
    } catch (caughtError) {
      error = caughtError;
    }

    assert.ok(
      error instanceof Error,
    );
    assert.match(
      error.message,
      /TRUST_PROXY/,
    );
    assert.equal(
      error.message.includes(
        unsafeValue,
      ),
      false,
    );
  },
);


test(
  "rejects unsupported email providers without echoing the configured value",
  () => {
    const secretLikeProvider =
      "DO-NOT-ECHO-PROVIDER";

    let error;

    try {
      parseEnvironment(
        makeDevelopmentEnvironment({
          EMAIL_PROVIDER:
            secretLikeProvider,
        }),
      );
    } catch (caughtError) {
      error = caughtError;
    }

    assert.ok(
      error instanceof Error,
    );
    assert.match(
      error.message,
      /EMAIL_PROVIDER/,
    );
    assert.equal(
      error.message.includes(
        secretLikeProvider,
      ),
      false,
    );
  },
);

test(
  "requires a Resend API key whenever the Resend provider is selected",
  () => {
    assert.throws(
      () =>
        parseEnvironment(
          makeDevelopmentEnvironment({
            EMAIL_PROVIDER:
              "resend",
          }),
        ),
      /RESEND_API_KEY/,
    );
  },
);
