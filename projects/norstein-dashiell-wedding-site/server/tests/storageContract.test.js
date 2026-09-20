const test = require("node:test");
const assert = require("node:assert/strict");

const {
  RSVP_STORAGE_METHODS,
  assertRsvpStorageContract,
} = require(
  "../src/services/storage/storageContract"
);

test(
  "storage contract exposes only the RSVP lifecycle persistence responsibilities",
  () => {
    assert.deepEqual(
      RSVP_STORAGE_METHODS,
      [
        "findInvitationByCanonicalCode",
        "getCurrentRsvp",
        "replaceCurrentRsvp",
        "appendRsvpVersion",
        "listRsvpVersions",
        "commitRsvpMutation",
        "getSubmissionRecord",
        "setSubmissionRecord",
        "listSubmissionRecordsForParty",
        "appendDeliveryRecord",
        "listDeliveryRecords",
        "appendResendRecord",
        "listResendRecords",
      ],
    );
  },
);

test(
  "storage contract accepts a complete adapter and rejects an incomplete adapter",
  () => {
    const complete =
      Object.fromEntries(
        RSVP_STORAGE_METHODS.map(
          (methodName) => [
            methodName,
            async () => null,
          ],
        ),
      );

    assert.equal(
      assertRsvpStorageContract(
        complete,
      ),
      complete,
    );

    const incomplete = {
      ...complete,
    };

    delete incomplete
      .replaceCurrentRsvp;

    assert.throws(
      () =>
        assertRsvpStorageContract(
          incomplete,
        ),
      /replaceCurrentRsvp/,
    );
  },
);
