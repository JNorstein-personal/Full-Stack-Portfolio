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
