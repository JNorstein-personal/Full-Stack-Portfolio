const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");

const {
  GOOGLE_SHEETS_STORE_SCHEMA,
  GOOGLE_SHEETS_STORE_SECTIONS,
} = require(
  "../src/services/storage/googleSheetsStoreSchema"
);

const {
  SNAPSHOT_VERSION,
  assertOperationalInvitationCompatibility,
  assertOperationalSectionsEmpty,
  assertOperationalSectionsUnchanged,
  assertProductionInvitationsMatchExpected,
  collectOperationalPartyIds,
  readGoogleSheetsStoreSnapshot,
  restoreInvitationsFromSnapshot,
  writePrivateSnapshotFile,
} = require(
  "../src/services/storage/productionActivation"
);

const {
  createFakeSheetsClient,
} = require(
  "./helpers/fakeGoogleSheets"
);

const GROUPED_CHILD_PROMPT =
  "We'd love for your family to celebrate with us this Mayday - will your kid(s) be accompanying you?";

function productionInvitation(
  inviteCode,
  partyId,
  {
    recordRole = "assigned",
    guestListEligible = true,
    maximumAttendance = 2,
    namedInvitees = [
      {
        id:
          `invitee-${partyId}-a`,
        displayName:
          "Example Guest One",
      },
      {
        id:
          `invitee-${partyId}-b`,
        displayName:
          "Example Guest Two",
      },
    ],
    additionalGuestAllocations = [],
  } = {},
) {
  return {
    inviteCode,
    inviteCodeDisplay:
      `${inviteCode.slice(
        0,
        3,
      )}-${inviteCode.slice(3)}`,
    partyId,
    partyDisplayName:
      "Example Party",
    greeting:
      "Example Party",
    wordingMode:
      "plural",
    maximumAttendance,
    namedInvitees,
    additionalGuestAllocations,
    recordRole,
    guestListEligible,
    active: true,
    environment:
      "production",
  };
}

function invitationRow(
  invitation,
) {
  return [
    invitation.inviteCode,
    invitation.partyId,
    JSON.stringify(invitation),
  ];
}

function initialWorkbook({
  invitations = [],
  currentRsvps = [],
  rsvpVersions = [],
  submissionRecords = [],
  deliveryRecords = [],
  resendRecords = [],
} = {}) {
  return {
    [GOOGLE_SHEETS_STORE_SCHEMA
      .invitations.title]: [
      [
        ...GOOGLE_SHEETS_STORE_SCHEMA
          .invitations.headers,
      ],
      ...invitations.map(
        invitationRow,
      ),
    ],

    [GOOGLE_SHEETS_STORE_SCHEMA
      .currentRsvps.title]: [
      [
        ...GOOGLE_SHEETS_STORE_SCHEMA
          .currentRsvps.headers,
      ],
      ...currentRsvps,
    ],

    [GOOGLE_SHEETS_STORE_SCHEMA
      .rsvpVersions.title]: [
      [
        ...GOOGLE_SHEETS_STORE_SCHEMA
          .rsvpVersions.headers,
      ],
      ...rsvpVersions,
    ],

    [GOOGLE_SHEETS_STORE_SCHEMA
      .submissionRecords.title]: [
      [
        ...GOOGLE_SHEETS_STORE_SCHEMA
          .submissionRecords.headers,
      ],
      ...submissionRecords,
    ],

    [GOOGLE_SHEETS_STORE_SCHEMA
      .deliveryRecords.title]: [
      [
        ...GOOGLE_SHEETS_STORE_SCHEMA
          .deliveryRecords.headers,
      ],
      ...deliveryRecords,
    ],

    [GOOGLE_SHEETS_STORE_SCHEMA
      .resendRecords.title]: [
      [
        ...GOOGLE_SHEETS_STORE_SCHEMA
          .resendRecords.headers,
      ],
      ...resendRecords,
    ],
  };
}

function createInitializedFake(
  options = {},
) {
  return createFakeSheetsClient({
    initialSheets:
      initialWorkbook(
        options,
      ),
  });
}

async function snapshotFor(
  fake,
  now = () =>
    new Date(
      "2026-10-03T18:00:00.000Z",
    ),
) {
  return readGoogleSheetsStoreSnapshot({
    sheets:
      fake.sheets,
    spreadsheetId:
      "fictional-sheet",
    now,
  });
}

function currentRsvpRow(
  partyId,
  version = 1,
) {
  return [
    partyId,
    version,
    JSON.stringify({
      partyId,
      version,
    }),
  ];
}

function versionRow(
  partyId,
  version = 1,
) {
  return [
    partyId,
    version,
    "initial",
    "2026-10-03T18:00:00.000Z",
    JSON.stringify({
      partyId,
      version,
      mutationId:
        `mutation-${version}`,
    }),
  ];
}

function submissionRow(
  partyId,
  suffix = "submission-a",
) {
  return [
    `${partyId}:${suffix}`,
    "fingerprint",
    JSON.stringify({
      partyId,
      status:
        "completed",
    }),
  ];
}

function deliveryRow(
  partyId,
) {
  return [
    partyId,
    "2026-10-03T18:00:00.000Z",
    JSON.stringify({
      partyId,
      status:
        "delivered",
    }),
  ];
}

function resendRow(
  partyId,
) {
  return [
    partyId,
    "2026-10-03T18:05:00.000Z",
    JSON.stringify({
      partyId,
      status:
        "delivered",
    }),
  ];
}

test(
  "production activation snapshot captures all RSVP tabs and accepts empty operational tables",
  async () => {
    const fake =
      createInitializedFake();

    const snapshot =
      await snapshotFor(
        fake,
        () =>
          new Date(
            "2026-10-03T18:00:00.000Z",
          ),
      );

    assert.equal(
      snapshot.snapshotVersion,
      SNAPSHOT_VERSION,
    );

    assert.equal(
      snapshot.createdAt,
      "2026-10-03T18:00:00.000Z",
    );

    assert.deepEqual(
      Object.keys(
        snapshot.sections,
      ).sort(),
      GOOGLE_SHEETS_STORE_SECTIONS
        .map(
          (section) =>
            section.title,
        )
        .sort(),
    );

    assert.equal(
      assertOperationalSectionsEmpty(
        snapshot,
      ),
      true,
    );
  },
);

test(
  "legacy empty-store gate still rejects pre-existing RSVP operational data",
  async () => {
    const invitation =
      productionInvitation(
        "ABC123",
        "party-prod-a",
      );

    const fake =
      createInitializedFake({
        invitations: [
          invitation,
        ],
        currentRsvps: [
          currentRsvpRow(
            invitation.partyId,
          ),
        ],
      });

    const snapshot =
      await snapshotFor(fake);

    assert.throws(
      () =>
        assertOperationalSectionsEmpty(
          snapshot,
        ),
      /requires empty operational RSVP tables/,
    );
  },
);

test(
  "production invitation verification requires an exact private configuration match including test classification",
  async () => {
    const assigned =
      productionInvitation(
        "ABC123",
        "party-prod-a",
      );

    const testInvitation =
      productionInvitation(
        "TST068",
        "party-prod-test",
        {
          recordRole:
            "test",
          guestListEligible:
            false,
          maximumAttendance:
            2,
          namedInvitees: [
            {
              id:
                "invitee-prod-test-a",
              displayName:
                "Test Sample",
            },
          ],
          additionalGuestAllocations: [
            {
              id:
                "plus1-prod-test-a",
              kind:
                "plus1",
              prompt:
                "Will Test Sample be accompanied by a +1?",
              maximumCount:
                1,
            },
          ],
        },
      );

    const fake =
      createInitializedFake({
        invitations: [
          assigned,
          testInvitation,
        ],
      });

    const snapshot =
      await snapshotFor(fake);

    assert.deepEqual(
      assertProductionInvitationsMatchExpected(
        snapshot,
        [
          assigned,
          testInvitation,
        ],
      ),
      {
        invitationCount: 2,
      },
    );

    const changed =
      JSON.parse(
        JSON.stringify(
          snapshot,
        ),
      );

    const changedTest =
      JSON.parse(
        changed.sections
          .Invitations[2][2],
      );

    changedTest
      .guestListEligible =
      true;

    changed.sections
      .Invitations[2][2] =
      JSON.stringify(
        changedTest,
      );

    assert.throws(
      () =>
        assertProductionInvitationsMatchExpected(
          changed,
          [
            assigned,
            testInvitation,
          ],
        ),
      /configuration mismatch/,
    );
  },
);

test(
  "production invitation verification preserves grouped-child allocation kind and person capacity",
  async () => {
    const expected =
      productionInvitation(
        "GHI789",
        "party-prod-children",
        {
          maximumAttendance:
            3,
          namedInvitees: [
            {
              id:
                "invitee-prod-children-a",
              displayName:
                "Example Adult",
            },
          ],
          additionalGuestAllocations: [
            {
              id:
                "children-prod-children-a",
              kind:
                "unnamedChildren",
              prompt:
                GROUPED_CHILD_PROMPT,
              maximumCount:
                2,
            },
          ],
        },
      );

    const fake =
      createInitializedFake({
        invitations: [
          expected,
        ],
      });

    const snapshot =
      await snapshotFor(fake);

    assert.deepEqual(
      assertProductionInvitationsMatchExpected(
        snapshot,
        [expected],
      ),
      {
        invitationCount: 1,
      },
    );

    const stored =
      JSON.parse(
        snapshot.sections
          .Invitations[1][2],
      );

    assert.deepEqual(
      stored
        .additionalGuestAllocations,
      [
        {
          id:
            "children-prod-children-a",
          kind:
            "unnamedChildren",
          prompt:
            GROUPED_CHILD_PROMPT,
          maximumCount:
            2,
        },
      ],
    );

    const capacity =
      stored
        .namedInvitees.length +
      stored
        .additionalGuestAllocations
        .reduce(
          (
            total,
            allocation,
          ) =>
            total +
            allocation.maximumCount,
          0,
        );

    assert.equal(
      capacity,
      stored.maximumAttendance,
    );
  },
);

test(
  "operational party discovery includes every operational RSVP section",
  async () => {
    const parties = [
      "party-current",
      "party-version",
      "party-submission",
      "party-delivery",
      "party-resend",
    ];

    const invitations =
      parties.map(
        (partyId, index) =>
          productionInvitation(
            `A${String(
              index + 1,
            ).padStart(
              5,
              "0",
            )}`,
            partyId,
          ),
      );

    const fake =
      createInitializedFake({
        invitations,
        currentRsvps: [
          currentRsvpRow(
            "party-current",
          ),
        ],
        rsvpVersions: [
          versionRow(
            "party-version",
          ),
        ],
        submissionRecords: [
          submissionRow(
            "party-submission",
          ),
        ],
        deliveryRecords: [
          deliveryRow(
            "party-delivery",
          ),
        ],
        resendRecords: [
          resendRow(
            "party-resend",
          ),
        ],
      });

    const snapshot =
      await snapshotFor(fake);

    assert.deepEqual(
      Array.from(
        collectOperationalPartyIds(
          snapshot,
        ),
      ).sort(),
      [...parties].sort(),
    );
  },
);

test(
  "invitation synchronization may add a newly assigned invitation while preserving existing RSVP data",
  async () => {
    const existing =
      productionInvitation(
        "ABC123",
        "party-existing",
      );

    const newlyAssigned =
      productionInvitation(
        "NEW058",
        "party-new-58",
        {
          maximumAttendance:
            1,
          namedInvitees: [
            {
              id:
                "invitee-new-58-a",
              displayName:
                "Future Guest",
            },
          ],
        },
      );

    const fake =
      createInitializedFake({
        invitations: [
          existing,
        ],
        currentRsvps: [
          currentRsvpRow(
            existing.partyId,
          ),
        ],
      });

    const snapshot =
      await snapshotFor(fake);

    assert.deepEqual(
      assertOperationalInvitationCompatibility(
        snapshot,
        [
          existing,
          newlyAssigned,
        ],
      ),
      {
        referencedPartyCount:
          1,
        preservedReferencedInvitationCount:
          1,
        existingInvitationCount:
          1,
        expectedInvitationCount:
          2,
        newInvitationCount:
          1,
        changedUnreferencedInvitationCount:
          0,
        removedUnreferencedInvitationCount:
          0,
      },
    );
  },
);

test(
  "permanent Test Sample may accumulate operational history without blocking unrelated future invitations",
  async () => {
    const testInvitation =
      productionInvitation(
        "TST068",
        "party-test-sample",
        {
          recordRole:
            "test",
          guestListEligible:
            false,
          maximumAttendance:
            2,
          namedInvitees: [
            {
              id:
                "invitee-test-sample",
              displayName:
                "Test Sample",
            },
          ],
          additionalGuestAllocations: [
            {
              id:
                "plus1-test-sample",
              kind:
                "plus1",
              prompt:
                "Will Test Sample be accompanied by a +1?",
              maximumCount:
                1,
            },
          ],
        },
      );

    const futureInvitation =
      productionInvitation(
        "NEW059",
        "party-new-59",
        {
          maximumAttendance:
            1,
          namedInvitees: [
            {
              id:
                "invitee-new-59-a",
              displayName:
                "Future Guest",
            },
          ],
        },
      );

    const fake =
      createInitializedFake({
        invitations: [
          testInvitation,
        ],
        currentRsvps: [
          currentRsvpRow(
            testInvitation.partyId,
          ),
        ],
        rsvpVersions: [
          versionRow(
            testInvitation.partyId,
          ),
        ],
        submissionRecords: [
          submissionRow(
            testInvitation.partyId,
          ),
        ],
        deliveryRecords: [
          deliveryRow(
            testInvitation.partyId,
          ),
        ],
      });

    const snapshot =
      await snapshotFor(fake);

    const result =
      assertOperationalInvitationCompatibility(
        snapshot,
        [
          testInvitation,
          futureInvitation,
        ],
      );

    assert.equal(
      result.referencedPartyCount,
      1,
    );

    assert.equal(
      result.newInvitationCount,
      1,
    );
  },
);

test(
  "invitation synchronization rejects changing any configuration already referenced by operational RSVP data",
  async () => {
    const existing =
      productionInvitation(
        "ABC123",
        "party-existing",
      );

    const changed = {
      ...existing,
      maximumAttendance:
        3,
    };

    const fake =
      createInitializedFake({
        invitations: [
          existing,
        ],
        deliveryRecords: [
          deliveryRow(
            existing.partyId,
          ),
        ],
      });

    const snapshot =
      await snapshotFor(fake);

    assert.throws(
      () =>
        assertOperationalInvitationCompatibility(
          snapshot,
          [changed],
        ),
      /would change an invitation referenced by operational RSVP data/,
    );
  },
);

test(
  "invitation synchronization rejects removing an invitation already referenced by operational RSVP data",
  async () => {
    const protectedInvitation =
      productionInvitation(
        "ABC123",
        "party-protected",
      );

    const otherInvitation =
      productionInvitation(
        "DEF456",
        "party-other",
      );

    const fake =
      createInitializedFake({
        invitations: [
          protectedInvitation,
          otherInvitation,
        ],
        resendRecords: [
          resendRow(
            protectedInvitation.partyId,
          ),
        ],
      });

    const snapshot =
      await snapshotFor(fake);

    assert.throws(
      () =>
        assertOperationalInvitationCompatibility(
          snapshot,
          [
            otherInvitation,
          ],
        ),
      /would remove an invitation referenced by operational RSVP data/,
    );
  },
);

test(
  "unreferenced invitation corrections and removals remain available before a party has operational history",
  async () => {
    const keep =
      productionInvitation(
        "ABC123",
        "party-keep",
      );

    const correct =
      productionInvitation(
        "DEF456",
        "party-correct",
      );

    const remove =
      productionInvitation(
        "GHI789",
        "party-remove",
      );

    const corrected = {
      ...correct,
      partyDisplayName:
        "Corrected Example Party",
      greeting:
        "Corrected Example Party",
    };

    const fake =
      createInitializedFake({
        invitations: [
          keep,
          correct,
          remove,
        ],
        currentRsvps: [
          currentRsvpRow(
            keep.partyId,
          ),
        ],
      });

    const snapshot =
      await snapshotFor(fake);

    assert.deepEqual(
      assertOperationalInvitationCompatibility(
        snapshot,
        [
          keep,
          corrected,
        ],
      ),
      {
        referencedPartyCount:
          1,
        preservedReferencedInvitationCount:
          1,
        existingInvitationCount:
          3,
        expectedInvitationCount:
          2,
        newInvitationCount:
          0,
        changedUnreferencedInvitationCount:
          1,
        removedUnreferencedInvitationCount:
          1,
      },
    );
  },
);

test(
  "invitation synchronization rejects orphaned operational data that no longer has an existing invitation",
  async () => {
    const expected =
      productionInvitation(
        "ABC123",
        "party-known",
      );

    const fake =
      createInitializedFake({
        invitations: [
          expected,
        ],
        rsvpVersions: [
          versionRow(
            "party-orphan",
          ),
        ],
      });

    const snapshot =
      await snapshotFor(fake);

    assert.throws(
      () =>
        assertOperationalInvitationCompatibility(
          snapshot,
          [expected],
        ),
      /operational RSVP data without its existing invitation configuration/,
    );
  },
);

test(
  "submission records must identify the same party in their key and private JSON when both are present",
  async () => {
    const invitation =
      productionInvitation(
        "ABC123",
        "party-one",
      );

    const fake =
      createInitializedFake({
        invitations: [
          invitation,
        ],
        submissionRecords: [
          [
            "party-one:submission-a",
            "fingerprint",
            JSON.stringify({
              partyId:
                "party-two",
            }),
          ],
        ],
      });

    const snapshot =
      await snapshotFor(fake);

    assert.throws(
      () =>
        collectOperationalPartyIds(
          snapshot,
        ),
      /inconsistent submission-record party identifiers/,
    );
  },
);

test(
  "production invitation activation detects any non-invitation RSVP data change",
  async () => {
    const fake =
      createInitializedFake();

    const before =
      await snapshotFor(fake);

    fake.workbook
      .get(
        GOOGLE_SHEETS_STORE_SCHEMA
          .deliveryRecords.title,
      )
      .push(
        deliveryRow(
          "party-a",
        ),
      );

    const after =
      await snapshotFor(fake);

    assert.throws(
      () =>
        assertOperationalSectionsUnchanged(
          before,
          after,
        ),
      /changed RSVP operational data/,
    );
  },
);

test(
  "production invitation exact-match verification rejects unexpected count, duplicate expected parties, and changed stored party IDs",
  async () => {
    const first =
      productionInvitation(
        "ABC123",
        "party-a",
      );

    const second =
      productionInvitation(
        "DEF456",
        "party-b",
      );

    const fake =
      createInitializedFake({
        invitations: [
          first,
          second,
        ],
      });

    const snapshot =
      await snapshotFor(fake);

    assert.throws(
      () =>
        assertProductionInvitationsMatchExpected(
          snapshot,
          [first],
        ),
      /unexpected record count/,
    );

    assert.throws(
      () =>
        assertProductionInvitationsMatchExpected(
          snapshot,
          [
            first,
            {
              ...second,
              partyId:
                first.partyId,
            },
          ],
        ),
      /invalid expected configuration/,
    );

    const changed =
      JSON.parse(
        JSON.stringify(
          snapshot,
        ),
      );

    changed.sections
      .Invitations[1][1] =
      "party-wrong";

    assert.throws(
      () =>
        assertProductionInvitationsMatchExpected(
          changed,
          [
            first,
            second,
          ],
        ),
      /configuration mismatch/,
    );
  },
);

test(
  "private snapshot is written before synchronization and prior invitations can be restored without touching operational data",
  async () => {
    const original =
      productionInvitation(
        "ABC123",
        "party-original",
      );

    const fake =
      createInitializedFake({
        invitations: [
          original,
        ],
        currentRsvps: [
          currentRsvpRow(
            original.partyId,
          ),
        ],
      });

    const before =
      await snapshotFor(
        fake,
        () =>
          new Date(
            "2026-10-03T18:00:00.000Z",
          ),
      );

    const temporaryDirectory =
      await fs.mkdtemp(
        path.join(
          os.tmpdir(),
          "wedding-rsvp-backup-",
        ),
      );

    try {
      const filepath =
        await writePrivateSnapshotFile({
          snapshot: before,
          backupDirectory:
            temporaryDirectory,
          now: () =>
            new Date(
              "2026-10-03T18:01:00.000Z",
            ),
        });

      const backup =
        JSON.parse(
          await fs.readFile(
            filepath,
            "utf8",
          ),
        );

      assert.equal(
        backup.snapshotVersion,
        SNAPSHOT_VERSION,
      );

      assert.equal(
        backup.sections
          .Invitations.length,
        2,
      );

      const replacement =
        productionInvitation(
          "DEF456",
          "party-replacement",
        );

      fake.workbook.set(
        GOOGLE_SHEETS_STORE_SCHEMA
          .invitations.title,
        [
          [
            ...GOOGLE_SHEETS_STORE_SCHEMA
              .invitations.headers,
          ],
          invitationRow(
            replacement,
          ),
        ],
      );

      const operationalBeforeRestore =
        JSON.parse(
          JSON.stringify(
            fake.workbook.get(
              GOOGLE_SHEETS_STORE_SCHEMA
                .currentRsvps.title,
            ),
          ),
        );

      await restoreInvitationsFromSnapshot({
        sheets:
          fake.sheets,
        spreadsheetId:
          "fictional-sheet",
        snapshot:
          before,
      });

      const restored =
        await snapshotFor(fake);

      assert.deepEqual(
        restored.sections[
          GOOGLE_SHEETS_STORE_SCHEMA
            .invitations.title
        ],
        before.sections[
          GOOGLE_SHEETS_STORE_SCHEMA
            .invitations.title
        ],
      );

      assert.deepEqual(
        fake.workbook.get(
          GOOGLE_SHEETS_STORE_SCHEMA
            .currentRsvps.title,
        ),
        operationalBeforeRestore,
      );
    } finally {
      await fs.rm(
        temporaryDirectory,
        {
          recursive: true,
          force: true,
        },
      );
    }
  },
);