const {
  Resend,
} = require("resend");

function classifyResendError(
  error,
) {
  const statusCode =
    Number(
      error &&
      (
        error.statusCode ??
        error.status_code ??
        error.status
      ),
    );

  if (
    Number.isInteger(
      statusCode,
    ) &&
    statusCode >= 400 &&
    statusCode < 500
  ) {
    return "failed";
  }

  return "uncertain";
}

function createResendEmailTransport({
  apiKey,
  client,
} = {}) {
  if (
    typeof apiKey !== "string" ||
    apiKey.trim() === ""
  ) {
    throw new Error(
      "Resend email transport requires an API key.",
    );
  }

  const resend =
    client ||
    new Resend(
      apiKey.trim(),
    );

  if (
    !resend.emails ||
    typeof resend.emails.send !==
      "function"
  ) {
    throw new Error(
      "Resend email transport requires a valid Resend client.",
    );
  }

  return Object.freeze({
    async sendEmail({
      to,
      from,
      replyTo,
      subject,
      text,
    }) {
      const {
        data,
        error,
      } =
        await resend.emails.send({
          from,
          to,
          replyTo,
          subject,
          text,
        });

      if (error) {
        return Object.freeze({
          status:
            classifyResendError(
              error,
            ),
        });
      }

      if (
        data &&
        typeof data.id ===
          "string" &&
        data.id.trim() !== ""
      ) {
        return Object.freeze({
          status: "sent",
        });
      }

      return Object.freeze({
        status: "uncertain",
      });
    },
  });
}

function createConfiguredEmailTransport({
  environment,
  client,
} = {}) {
  if (!environment) {
    throw new Error(
      "Email transport activation requires validated environment configuration.",
    );
  }

  if (
    !environment.EMAIL_PROVIDER
  ) {
    return undefined;
  }

  if (
    environment.EMAIL_PROVIDER !==
    "resend"
  ) {
    throw new Error(
      "Configured email provider is not supported.",
    );
  }

  return createResendEmailTransport({
    apiKey:
      environment.RESEND_API_KEY,
    client,
  });
}

module.exports = {
  classifyResendError,
  createConfiguredEmailTransport,
  createResendEmailTransport,
};
