const {
  assertRsvpStorageContract,
} = require("./storageContract");

function cloneJsonValue(value) {
  if (value === undefined) {
    return undefined;
  }

  return JSON.parse(
    JSON.stringify(value),
  );
}

function deepFreeze(value) {
  if (
    value === null ||
    typeof value !== "object" ||
    Object.isFrozen(value)
  ) {
    return value;
  }

  for (
    const child of
    Object.values(value)
  ) {
    deepFreeze(child);
  }

  return Object.freeze(value);
}

function immutableClone(value) {
  if (value === null) {
    return null;
  }

  return deepFreeze(
    cloneJsonValue(value),
  );
}

function createDevelopmentStore({
  invitations = [],
} = {}) {
  if (!Array.isArray(invitations)) {
    throw new Error(
      "Development RSVP store invitations must be an array.",
    );
  }

  const invitationsByCode =
    new Map();

  for (const invitation of invitations) {
    if (
      !invitation ||
      typeof invitation.inviteCode !==
        "string" ||
      invitationsByCode.has(
        invitation.inviteCode,
      )
    ) {
      throw new Error(
        "Development RSVP store received invalid or duplicate invitation configuration.",
      );
    }

    invitationsByCode.set(
      invitation.inviteCode,
      cloneJsonValue(invitation),
    );
  }

  const currentByParty =
    new Map();
  const versionsByParty =
    new Map();
  const submissionsById =
    new Map();
  const deliveryByParty =
    new Map();
  const resendsByParty =
    new Map();

  function listFor(
    collection,
    partyId,
  ) {
    const values =
      collection.get(partyId) || [];

    return immutableClone(values);
  }

  function sameJson(
    left,
    right,
  ) {
    return (
      JSON.stringify(left) ===
      JSON.stringify(right)
    );
  }

  const store = {
    async findInvitationByCanonicalCode(
      canonicalCode,
    ) {
      const invitation =
        invitationsByCode.get(
          canonicalCode,
        );

      return invitation
        ? immutableClone(invitation)
        : null;
    },

    async getCurrentRsvp(partyId) {
      const current =
        currentByParty.get(
          partyId,
        );

      return current
        ? immutableClone(current)
        : null;
    },

    async replaceCurrentRsvp(
      partyId,
      currentRsvp,
    ) {
      currentByParty.set(
        partyId,
        cloneJsonValue(currentRsvp),
      );

      return immutableClone(
        currentRsvp,
      );
    },

    async appendRsvpVersion(
      partyId,
      versionRecord,
    ) {
      const versions =
        versionsByParty.get(
          partyId,
        ) || [];

      versions.push(
        cloneJsonValue(
          versionRecord,
        ),
      );

      versionsByParty.set(
        partyId,
        versions,
      );

      return immutableClone(
        versionRecord,
      );
    },

    async listRsvpVersions(
      partyId,
    ) {
      return listFor(
        versionsByParty,
        partyId,
      );
    },

    async commitRsvpMutation(
      partyId,
      {
        expectedCurrentVersion,
        mutationId,
        currentRsvp,
        versionRecord,
      },
    ) {
      const targetVersion =
        currentRsvp &&
        currentRsvp.version;

      if (
        !Number.isInteger(
          expectedCurrentVersion,
        ) ||
        expectedCurrentVersion < 0 ||
        typeof mutationId !==
          "string" ||
        mutationId === "" ||
        !Number.isInteger(
          targetVersion,
        ) ||
        targetVersion !==
          expectedCurrentVersion +
            1 ||
        !versionRecord ||
        versionRecord.version !==
          targetVersion ||
        versionRecord.mutationId !==
          mutationId
      ) {
        throw new Error(
          "RSVP mutation commit received inconsistent mutation metadata.",
        );
      }

      const current =
        currentByParty.get(
          partyId,
        ) || null;
      const currentVersion =
        current
          ? current.version
          : 0;
      const versions =
        versionsByParty.get(
          partyId,
        ) || [];
      const matchingVersions =
        versions.filter(
          (record) =>
            record.version ===
            targetVersion,
        );

      if (
        matchingVersions.length > 1
      ) {
        throw new Error(
          "RSVP mutation commit found duplicate target versions.",
        );
      }

      const existingVersion =
        matchingVersions[0];

      if (existingVersion) {
        if (
          existingVersion.mutationId !==
          mutationId
        ) {
          throw new Error(
            "RSVP mutation commit found a conflicting target version.",
          );
        }

        if (
          currentVersion ===
          targetVersion
        ) {
          if (
            !sameJson(
              current,
              currentRsvp,
            )
          ) {
            throw new Error(
              "RSVP mutation commit found inconsistent current state.",
            );
          }

          return Object.freeze({
            status:
              "alreadyCommitted",
          });
        }

        if (
          currentVersion !==
          expectedCurrentVersion
        ) {
          throw new Error(
            "RSVP mutation commit found an unexpected current version.",
          );
        }

        currentByParty.set(
          partyId,
          cloneJsonValue(
            currentRsvp,
          ),
        );

        return Object.freeze({
          status: "recovered",
        });
      }

      if (
        currentVersion !==
        expectedCurrentVersion
      ) {
        throw new Error(
          "RSVP mutation commit found an unexpected current version.",
        );
      }

      versions.push(
        cloneJsonValue(
          versionRecord,
        ),
      );
      versionsByParty.set(
        partyId,
        versions,
      );
      currentByParty.set(
        partyId,
        cloneJsonValue(
          currentRsvp,
        ),
      );

      return Object.freeze({
        status: "committed",
      });
    },

    async getSubmissionRecord(
      clientSubmissionId,
    ) {
      const record =
        submissionsById.get(
          clientSubmissionId,
        );

      return record
        ? immutableClone(record)
        : null;
    },

    async setSubmissionRecord(
      clientSubmissionId,
      record,
    ) {
      submissionsById.set(
        clientSubmissionId,
        cloneJsonValue(record),
      );

      return immutableClone(record);
    },

    async listSubmissionRecordsForParty(
      partyId,
    ) {
      return immutableClone(
        Array.from(
          submissionsById.values(),
        ).filter(
          (record) =>
            record &&
            record.partyId ===
              partyId,
        ),
      );
    },

    async appendDeliveryRecord(
      partyId,
      record,
    ) {
      const records =
        deliveryByParty.get(
          partyId,
        ) || [];

      records.push(
        cloneJsonValue(record),
      );

      deliveryByParty.set(
        partyId,
        records,
      );

      return immutableClone(record);
    },

    async listDeliveryRecords(
      partyId,
    ) {
      return listFor(
        deliveryByParty,
        partyId,
      );
    },

    async appendResendRecord(
      partyId,
      record,
    ) {
      const records =
        resendsByParty.get(
          partyId,
        ) || [];

      records.push(
        cloneJsonValue(record),
      );

      resendsByParty.set(
        partyId,
        records,
      );

      return immutableClone(record);
    },

    async listResendRecords(
      partyId,
    ) {
      return listFor(
        resendsByParty,
        partyId,
      );
    },
  };

  assertRsvpStorageContract(
    store,
  );

  return Object.freeze(store);
}

module.exports = {
  createDevelopmentStore,
};
