const test = require("node:test");
const assert = require("node:assert/strict");

const {
  classifyResendError,
  createConfiguredEmailTransport,
  createResendEmailTransport,
} = require("../src/services/resendEmailTransport");

function makeClient(
  send,
) {
  return {
    emails: {
      send,
    },
  };
}

test(
  "Resend transport sends the approved provider payload and maps accepted messages to sent",
  async () => {
    const calls = [];

    const transport =
      createResendEmailTransport({
        apiKey:
          "re_fictional_test_key",
        client:
          makeClient(
            async (message) => {
              calls.push(message);

              return {
                data: {
                  id:
                    "fictional-resend-id",
                },
                error: null,
              };
            },
          ),
      });

    assert.deepEqual(
      await transport.sendEmail({
        to:
          "guest@example.com",
        from:
          "Norstein-Dashiell Wedding <confirm@rsvp.example.com>",
        replyTo:
          "help@example.com",
        subject:
          "RSVP confirmation",
        text:
          "Fictional confirmation",
      }),
      {
        status: "sent",
      },
    );

    assert.deepEqual(
      calls,
      [
        {
          from:
            "Norstein-Dashiell Wedding <confirm@rsvp.example.com>",
          to:
            "guest@example.com",
          replyTo:
            "help@example.com",
          subject:
            "RSVP confirmation",
          text:
            "Fictional confirmation",
        },
      ],
    );
  },
);

test(
  "Resend transport maps definite client rejection to failed",
  async () => {
    const transport =
      createResendEmailTransport({
        apiKey:
          "re_fictional_test_key",
        client:
          makeClient(
            async () => ({
              data: null,
              error: {
                statusCode: 422,
              },
            }),
          ),
      });

    assert.deepEqual(
      await transport.sendEmail({
        to: "guest@example.com",
        from:
          "Wedding <confirm@example.com>",
        replyTo:
          "help@example.com",
        subject: "Example",
        text: "Example",
      }),
      {
        status: "failed",
      },
    );
  },
);

test(
  "Resend transport maps server-side or structurally ambiguous outcomes to uncertain",
  async () => {
    for (
      const response of [
        {
          data: null,
          error: {
            statusCode: 503,
          },
        },
        {
          data: null,
          error: {
            name:
              "unknown_error",
          },
        },
        {
          data: {},
          error: null,
        },
      ]
    ) {
      const transport =
        createResendEmailTransport({
          apiKey:
            "re_fictional_test_key",
          client:
            makeClient(
              async () =>
                response,
            ),
        });

      assert.deepEqual(
        await transport.sendEmail({
          to:
            "guest@example.com",
          from:
            "Wedding <confirm@example.com>",
          replyTo:
            "help@example.com",
          subject: "Example",
          text: "Example",
        }),
        {
          status:
            "uncertain",
        },
      );
    }
  },
);

test(
  "Resend error classifier recognizes only definite 4xx rejection as failed",
  () => {
    assert.equal(
      classifyResendError({
        statusCode: 400,
      }),
      "failed",
    );

    assert.equal(
      classifyResendError({
        statusCode: 429,
      }),
      "failed",
    );

    assert.equal(
      classifyResendError({
        statusCode: 500,
      }),
      "uncertain",
    );

    assert.equal(
      classifyResendError({}),
      "uncertain",
    );
  },
);

test(
  "configured email transport activates only the selected Resend provider",
  () => {
    assert.equal(
      createConfiguredEmailTransport({
        environment: {
          NODE_ENV:
            "development",
        },
      }),
      undefined,
    );

    assert.throws(
      () =>
        createConfiguredEmailTransport({
          environment: {
            EMAIL_PROVIDER:
              "other-provider",
          },
        }),
      /not supported/,
    );

    const transport =
      createConfiguredEmailTransport({
        environment: {
          EMAIL_PROVIDER:
            "resend",
          RESEND_API_KEY:
            "re_fictional_test_key",
        },
        client:
          makeClient(
            async () => ({
              data: {
                id: "example",
              },
              error: null,
            }),
          ),
      });

    assert.equal(
      typeof transport.sendEmail,
      "function",
    );
  },
);

test(
  "Resend transport configuration rejects a missing API key without echoing provider secrets",
  () => {
    assert.throws(
      () =>
        createConfiguredEmailTransport({
          environment: {
            EMAIL_PROVIDER:
              "resend",
          },
        }),
      /requires an API key/,
    );
  },
);
