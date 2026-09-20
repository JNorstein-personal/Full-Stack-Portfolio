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

  return Object.freeze({
    async deliver({
      invitation,
      rsvp,
      confirmation,
      action,
    }) {
      const guestAttempt =
        confirmation.method ===
        "email"
          ? attemptEmail(
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
            )
          : Promise.resolve(
              "uncertain",
            );

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
  });
}

module.exports = {
  createDeferredDeliveryService,
  createEmailDeliveryService,
};
