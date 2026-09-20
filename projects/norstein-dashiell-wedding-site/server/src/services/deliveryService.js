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

  const adminDestination =
    administrativeEmail.trim();
  const sender =
    fromEmail.trim();

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

module.exports = {
  createDeferredDeliveryService,
  createEmailDeliveryService,
};
