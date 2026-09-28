const RSVP_ASSISTANCE_EMAIL =
  "RSVPhelp@loreweavercreations.com";

function attendanceLabel(
  eventAttendance,
) {
  if (
    eventAttendance.length === 1 &&
    eventAttendance[0] ===
      "decline"
  ) {
    return "Regretfully unable to attend";
  }

  const labels = [];

  if (
    eventAttendance.includes(
      "ceremony",
    )
  ) {
    labels.push("Ceremony");
  }

  if (
    eventAttendance.includes(
      "reception",
    )
  ) {
    labels.push("Reception");
  }

  return labels.join(" and ");
}

function formatNamedInvitees(
  invitation,
  rsvp,
) {
  if (
    !rsvp.namedInviteeResponses
  ) {
    return [];
  }

  return invitation
    .namedInvitees
    .map(
      (invitee) =>
        `${invitee.displayName}: ${rsvp.namedInviteeResponses[
          invitee.id
        ] === "yes"
          ? "Yes"
          : "No"}`,
    );
}

function formatAdditionalGuests(
  invitation,
  rsvp,
) {
  if (
    !rsvp.additionalGuestResponses
  ) {
    return [];
  }

  return invitation
    .additionalGuestAllocations
    .flatMap(
      (allocation) => {
        const response =
          rsvp
            .additionalGuestResponses[
            allocation.id
          ];

        if (
          allocation.kind ===
          "unnamedChildren"
        ) {
          if (
            !response ||
            typeof response !==
              "object" ||
            Array.isArray(response)
          ) {
            return [];
          }

          const attending =
            response.attending ===
            "yes";

          return [
            `${allocation.prompt} ${attending
              ? "Yes"
              : "No"}`,
            ...(attending
              ? [
                  `Children attending: ${response.count}`,
                ]
              : []),
          ];
        }

        return [
          `${allocation.prompt} ${response === "yes"
            ? "Yes"
            : "No"}`,
        ];
      },
    );
}

function formatAttendanceTotals(
  rsvp,
) {
  if (!rsvp.attendanceTotals) {
    return [];
  }

  return [
    `Adults 21+: ${rsvp.attendanceTotals.adults21Plus}`,
    `Young Adults 18–20: ${rsvp.attendanceTotals.youngAdults18To20}`,
    `Children 3–17: ${rsvp.attendanceTotals.children3To17}`,
    `Children under 3: ${rsvp.attendanceTotals.childrenUnder3}`,
    `Overall attendance: ${rsvp.overallAttendance}`,
  ];
}

function formatAttendeeDetails(
  rsvp,
) {
  if (!rsvp.attendeeDetails) {
    return [];
  }

  const lines = [
    "Attendee Details:",
  ];

  rsvp.attendeeDetails
    .forEach(
      (detail, index) => {
        lines.push(
          `${index + 1}. ${detail.attendeeName}`,
        );

        if (
          detail.dietaryPreferences
        ) {
          lines.push(
            `   Dietary or allergy information: ${detail.dietaryPreferences}`,
          );
        }
      },
    );

  return lines;
}

function buildRsvpSummaryLines({
  invitation,
  rsvp,
}) {
  const lines = [
    `Attendance: ${attendanceLabel(
      rsvp.eventAttendance,
    )}`,
  ];

  const namedInviteeLines =
    formatNamedInvitees(
      invitation,
      rsvp,
    );

  if (
    namedInviteeLines.length > 0
  ) {
    lines.push(
      "",
      "Named invitees:",
      ...namedInviteeLines,
    );
  }

  const additionalGuestLines =
    formatAdditionalGuests(
      invitation,
      rsvp,
    );

  if (
    additionalGuestLines.length >
    0
  ) {
    lines.push(
      "",
      "Additional guests:",
      ...additionalGuestLines,
    );
  }

  const totalLines =
    formatAttendanceTotals(
      rsvp,
    );

  if (totalLines.length > 0) {
    lines.push(
      "",
      "Attendance totals:",
      ...totalLines,
    );
  }

  const attendeeDetailLines =
    formatAttendeeDetails(
      rsvp,
    );

  if (
    attendeeDetailLines.length >
    0
  ) {
    lines.push(
      "",
      ...attendeeDetailLines,
    );
  }

  return lines;
}

function actionLabel(action) {
  return action === "revision"
    ? "RSVP revision"
    : "Initial RSVP";
}

function buildGuestConfirmationEmail({
  invitation,
  rsvp,
  action,
  assistanceEmail =
    RSVP_ASSISTANCE_EMAIL,
}) {
  const summary =
    buildRsvpSummaryLines({
      invitation,
      rsvp,
    });

  return Object.freeze({
    subject:
      "Your Norstein-Dashiell Wedding RSVP confirmation",
    text: [
      `Hello ${invitation.partyDisplayName},`,
      "",
      `${actionLabel(
        action,
      )} recorded on ${rsvp.recordedAt}.`,
      "",
      ...summary,
      "",
      `RSVP deadline: ${rsvp.deadline}`,
      "You may revise your RSVP before the deadline by returning to the wedding website and entering your invitation code again.",
      `For assistance, contact ${assistanceEmail}.`,
    ].join("\n"),
  });
}

function buildAdministrativeConfirmationEmail({
  invitation,
  rsvp,
  action,
  confirmation,
  assistanceEmail =
    RSVP_ASSISTANCE_EMAIL,
}) {
  const summary =
    buildRsvpSummaryLines({
      invitation,
      rsvp,
    });

  const destinationLine =
    confirmation.method ===
      "email"
      ? `Guest confirmation email: ${confirmation.email}`
      : `Guest confirmation mobile: ${confirmation.mobile}`;

  return Object.freeze({
    subject:
      `Wedding RSVP recorded — ${invitation.partyDisplayName}`,
    text: [
      `${actionLabel(
        action,
      )} recorded on ${rsvp.recordedAt}.`,
      `Invited party: ${invitation.partyDisplayName}`,
      `Confirmation method: ${confirmation.method}`,
      destinationLine,
      "",
      ...summary,
      "",
      `RSVP deadline: ${rsvp.deadline}`,
      `Assistance address: ${assistanceEmail}`,
    ].join("\n"),
  });
}

module.exports = {
  RSVP_ASSISTANCE_EMAIL,
  attendanceLabel,
  buildAdministrativeConfirmationEmail,
  buildGuestConfirmationEmail,
  buildRsvpSummaryLines,
};