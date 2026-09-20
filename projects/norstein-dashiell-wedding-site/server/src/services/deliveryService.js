const {
  buildAdministrativeConfirmationEmail,
  buildGuestConfirmationEmail,
} = require("./confirmationEmail");
const {
  assertEmailTransport,
  normalizeTransportStatus,
} = require("./emailTransport");

function createDeferredDeliveryService() {
  return Object.freeze({
    async deliver() {
      return Object.freeze({
        guestDeliveryStatus:
          "uncertain",
        administrativeDeliveryStatus:
          "uncertain",
      });
    },

    async resendGuest() {
      return "uncertain";
    },
  });
}

async function attemptEmail(
  createMessage,
  sendMessage,
) {
  try {
    const message =
      createMessage();

    const result =
      await sendMessage(message);

    return normalizeTransportStatus(
      result,
    );
  } catch {
    return "uncertain";
  }
}

function createEmailDeliveryService({
  emailTransport,
  administrativeEmail,
  fromEmail,
  fromName,
  replyToEmail,
  assistanceEmail,
} = {}) {
  const transport =
    assertEmailTransport(
      emailTransport,
    );

  if (
    typeof administrativeEmail !==
      "string" ||
    administrativeEmail.trim() === ""
  ) {
    throw new Error(
      "Email delivery requires an administrative recipient.",
    );
  }

  if (
    typeof fromEmail !== "string" ||
    fromEmail.trim() === ""
  ) {
    throw new Error(
      "Email delivery requires a sender address.",
    );
  }

  if (
    typeof fromName !== "string" ||
    fromName.trim() === ""
  ) {
    throw new Error(
      "Email delivery requires a sender name.",
    );
  }

  if (
    typeof replyToEmail !== "string" ||
    replyToEmail.trim() === ""
  ) {
    throw new Error(
      "Email delivery requires a reply-to address.",
    );
  }

  const adminDestination =
    administrativeEmail.trim();
  const sender =
    `${fromName.trim()} <${fromEmail.trim()}>`;
  const replyTo =
    replyToEmail.trim();

  async function sendGuest({
    invitation,
    rsvp,
    confirmation,
    action,
  }) {
    if (
      confirmation.method !==
      "email"
    ) {
      return "uncertain";
    }

    return attemptEmail(
      () =>
        buildGuestConfirmationEmail({
          invitation,
          rsvp,
          action,
          assistanceEmail,
        }),
      (message) =>
        transport.sendEmail({
          to:
            confirmation.email,
          from: sender,
          replyTo,
          subject:
            message.subject,
          text: message.text,
        }),
    );
  }

  return Object.freeze({
    async deliver({
      invitation,
      rsvp,
      confirmation,
      action,
    }) {
      const guestAttempt =
        sendGuest({
          invitation,
          rsvp,
          confirmation,
          action,
        });

      const administrativeAttempt =
        attemptEmail(
          () =>
            buildAdministrativeConfirmationEmail({
              invitation,
              rsvp,
              action,
              confirmation,
              assistanceEmail,
            }),
          (message) =>
            transport.sendEmail({
              to:
                adminDestination,
              from: sender,
              replyTo,
              subject:
                message.subject,
              text: message.text,
            }),
        );

      const [
        guestDeliveryStatus,
        administrativeDeliveryStatus,
      ] = await Promise.all([
        guestAttempt,
        administrativeAttempt,
      ]);

      return Object.freeze({
        guestDeliveryStatus,
        administrativeDeliveryStatus,
      });
    },

    async resendGuest({
      invitation,
      rsvp,
      confirmation,
      action,
    }) {
      return sendGuest({
        invitation,
        rsvp,
        confirmation,
        action,
      });
    },
  });
}

function createConfiguredDeliveryService({
  environment,
  deliveryService,
  emailTransport,
} = {}) {
  if (!environment) {
    throw new Error(
      "Delivery activation requires validated environment configuration.",
    );
  }

  if (deliveryService) {
    return deliveryService;
  }

  if (emailTransport) {
    return createEmailDeliveryService({
      emailTransport,
      administrativeEmail:
        environment
          .RSVP_ADMIN_NOTIFICATION_EMAIL,
      fromEmail:
        environment.RSVP_FROM_EMAIL,
      fromName:
        environment.RSVP_FROM_NAME,
      replyToEmail:
        environment
          .RSVP_REPLY_TO_EMAIL,
    });
  }

  if (
    environment.NODE_ENV ===
    "production"
  ) {
    throw new Error(
      "Production RSVP email delivery transport is not configured.",
    );
  }

  return createDeferredDeliveryService();
}

module.exports = {
  createConfiguredDeliveryService,
  createDeferredDeliveryService,
  createEmailDeliveryService,
};
