const test = require("node:test");
const assert = require("node:assert/strict");

const {
  RSVP_OVERVIEW_ATTENDEE_HEADERS,
  RSVP_OVERVIEW_PARTY_HEADERS,
  rebuildRsvpOverview,
  toNewYorkSheetsSerial,
} = require(
  "../src/services/storage/googleSheetsRsvpOverview"
);
const {
  createFakeSheetsClient,
} = require("./helpers/fakeGoogleSheets");

function makeOverviewRows() {
  const rows =
    Array.from(
      { length: 84 },
      () => [],
    );

  rows[0] = [
    "Wedding RSVP Overview",
  ];
  rows[13] = [
    ...RSVP_OVERVIEW_PARTY_HEADERS,
  ];
  rows[83] = [
    ...RSVP_OVERVIEW_ATTENDEE_HEADERS,
  ];

  return rows;
}

function makeInvitation({
  partyId,
  name,
  code,
  production = true,
  maximumAttendance = 2,
}) {
  return {
    inviteCode:
      code.replace(/-/g, ""),
    inviteCodeDisplay: code,
    partyId,
    partyDisplayName: name,
    maximumAttendance,
    namedInvitees: [],
    additionalGuestAllocations: [],
    recordRole:
      production
        ? "assigned"
        : "test",
    guestListEligible:
      production,
    active: true,
    environment: "production",
  };
}

function makeCurrentRsvp({
  version = 1,
  eventAttendance = [
    "ceremony",
    "reception",
  ],
  overallAttendance = 2,
  recordedAt =
    "2026-11-05T12:04:42.013Z",
} = {}) {
  return {
    eventAttendance,
    namedInviteeResponses: {},
    additionalGuestResponses: {},
    attendanceTotals: {
      adults21Plus:
        overallAttendance,
      youngAdults18To20: 0,
      children3To17: 0,
      childrenUnder3: 0,
    },
    overallAttendance,
    attendeeDetails:
      overallAttendance > 0
        ? [
            {
              attendeeName:
                "Example One",
              dietaryPreferences:
                "Vegetarian",
            },
            ...(overallAttendance > 1
              ? [
                  {
                    attendeeName:
                      "Example Two",
                  },
                ]
              : []),
          ]
        : [],
    confirmation: {
      method: "email",
      email:
        "example@example.com",
    },
    recordedAt,
    deadline:
      "2027-03-01T23:59:00-05:00",
    timeZone:
      "America/New_York",
    version,
  };
}

test(
  "RSVP Overview rebuild derives party and attendee rows without touching dashboard content",
  async () => {
    const productionInvitation =
      makeInvitation({
        partyId: "party-one",
        name: "Example Party",
        code: "ABC-123",
      });
    const testInvitation =
      makeInvitation({
        partyId: "party-test",
        name: "Test Sample",
        code: "XYZ-999",
        production: false,
        maximumAttendance: 4,
      });

    const overviewRows =
      makeOverviewRows();
    overviewRows[4] = [
      "dashboard-sentinel",
    ];

    const fake =
      createFakeSheetsClient({
        initialSheets: {
          Invitations: [
            [
              "inviteCode",
              "partyId",
              "configurationJson",
            ],
            [
              productionInvitation.inviteCode,
              productionInvitation.partyId,
              JSON.stringify(
                productionInvitation,
              ),
            ],
            [
              testInvitation.inviteCode,
              testInvitation.partyId,
              JSON.stringify(
                testInvitation,
              ),
            ],
          ],
          "Current RSVPs": [
            [
              "partyId",
              "version",
              "rsvpJson",
            ],
            [
              productionInvitation.partyId,
              1,
              JSON.stringify(
                makeCurrentRsvp(),
              ),
            ],
          ],
          "Wedding RSVP Overview":
            overviewRows,
        },
      });

    const result =
      await rebuildRsvpOverview({
        sheets: fake.sheets,
        spreadsheetId:
          "fictional-sheet",
      });

    assert.deepEqual(
      result,
      {
        invitationCount: 2,
        responseCount: 1,
        attendeeCount: 2,
      },
    );

    const overview =
      fake.workbook.get(
        "Wedding RSVP Overview",
      );

    assert.equal(
      overview[4][0],
      "dashboard-sentinel",
    );

    assert.deepEqual(
      overview[14].slice(0, 8),
      [
        "Production",
        "Example Party",
        "ABC-123",
        2,
        "Attending",
        "Yes",
        "Yes",
        2,
      ],
    );
    assert.equal(
      overview[14][13],
      "Example One: Vegetarian",
    );
    assert.equal(
      overview[14][16],
      "email",
    );
    assert.equal(
      overview[14][17],
      "party-one",
    );

    assert.deepEqual(
      overview[15].slice(0, 8),
      [
        "Test (excluded)",
        "Test Sample",
        "XYZ-999",
        4,
        "No Response",
        "",
        "",
        0,
      ],
    );

    assert.deepEqual(
      overview[84].slice(0, 6),
      [
        "Example Party",
        "Example One",
        "Vegetarian",
        1,
        toNewYorkSheetsSerial(
          "2026-11-05T12:04:42.013Z",
        ),
        "Production",
      ],
    );
    assert.equal(
      overview[85][1],
      "Example Two",
    );
  },
);

test(
  "RSVP Overview rebuild renders a current zero-attendance RSVP as Declined",
  async () => {
    const invitation =
      makeInvitation({
        partyId:
          "party-declined",
        name:
          "Declined Party",
        code: "DEC-001",
      });

    const fake =
      createFakeSheetsClient({
        initialSheets: {
          Invitations: [
            [
              "inviteCode",
              "partyId",
              "configurationJson",
            ],
            [
              invitation.inviteCode,
              invitation.partyId,
              JSON.stringify(
                invitation,
              ),
            ],
          ],
          "Current RSVPs": [
            [
              "partyId",
              "version",
              "rsvpJson",
            ],
            [
              invitation.partyId,
              1,
              JSON.stringify(
                makeCurrentRsvp({
                  eventAttendance: [],
                  overallAttendance: 0,
                }),
              ),
            ],
          ],
          "Wedding RSVP Overview":
            makeOverviewRows(),
        },
      });

    await rebuildRsvpOverview({
      sheets: fake.sheets,
      spreadsheetId:
        "fictional-sheet",
    });

    const row =
      fake.workbook.get(
        "Wedding RSVP Overview",
      )[14];

    assert.equal(
      row[4],
      "Declined",
    );
    assert.equal(row[5], "No");
    assert.equal(row[6], "No");
    assert.equal(row[7], 0);
  },
);

test(
  "RSVP Overview rebuild refuses to write when the copied layout headers do not match",
  async () => {
    const overviewRows =
      makeOverviewRows();
    overviewRows[13][0] =
      "Unexpected Header";

    const fake =
      createFakeSheetsClient({
        initialSheets: {
          Invitations: [
            [
              "inviteCode",
              "partyId",
              "configurationJson",
            ],
          ],
          "Current RSVPs": [
            [
              "partyId",
              "version",
              "rsvpJson",
            ],
          ],
          "Wedding RSVP Overview":
            overviewRows,
        },
      });

    await assert.rejects(
      () =>
        rebuildRsvpOverview({
          sheets: fake.sheets,
          spreadsheetId:
            "fictional-sheet",
        }),
      /unexpected worksheet layout/,
    );

    assert.equal(
      fake.calls.some(
        (call) =>
          call.method ===
          "values.clear",
      ),
      false,
    );
  },
);
