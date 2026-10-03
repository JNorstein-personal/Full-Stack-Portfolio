require("dotenv").config();

const {
  PRODUCTION_AUDIT_TARGETS,
  assertProductionAuditTargets,
  transformProductionInvitationRows,
} = require(
  "../src/rsvp/productionInvitationTransform"
);

const {
  loadProductionSourceFile,
} = require(
  "../src/rsvp/productionSourceFile"
);

function formatSummary(summary) {
  return [
    `numbered source rows=${summary.numberedSourceRowCount}`,
    `unique source codes=${summary.uniqueSourceCodeCount}`,
    `source sequence valid=${summary.sourceInviteNumberSequenceValid}`,
    `reserved placeholders=${summary.reservedPlaceholderCount}`,
    `functional invitations=${summary.functionalInvitationCount}`,
    `functional unique codes=${summary.functionalUniqueCanonicalCodeCount}`,
    `functional maximum attendance=${summary.functionalCombinedMaximumAttendance}`,
    `guest-list invitations=${summary.guestListInvitationCount}`,
    `guest-list maximum attendance=${summary.combinedMaximumAttendance}`,
    `permanent test invitations=${summary.testInvitationCount}`,
    `test maximum attendance=${summary.testCombinedMaximumAttendance}`,
    `baseline invitations 1-57=${summary.baselineInvitationCount}`,
    `baseline maximum attendance=${summary.baselineCombinedMaximumAttendance}`,
    `singular guest-list invitations=${summary.singularCount}`,
    `plural guest-list invitations=${summary.pluralCount}`,
    `named guest-list invitees=${summary.namedInviteeCount}`,
    `guest-list invitations with allocations=${summary.invitationsWithAllocations}`,
    `guest-list allocation objects=${summary.allocationCount}`,
    `guest-list Plus1 allocations=${summary.plus1AllocationCount}`,
    `guest-list grouped-child allocations=${summary.groupedChildAllocationCount}`,
    `guest-list additional-guest capacity=${summary.additionalGuestCapacity}`,
    `guest-list grouped-child capacity=${summary.groupedChildCapacity}`,
    `guest-list multi-allocation invitations=${summary.multiAllocationInvitationCount}`,
  ].join(", ");
}

function main() {
  try {
    const rows =
      loadProductionSourceFile(
        process.env
          .RSVP_PRODUCTION_SOURCE_FILE,
      );

    const transformed =
      transformProductionInvitationRows(
        rows,
      );

    assertProductionAuditTargets(
      transformed.summary,
      PRODUCTION_AUDIT_TARGETS,
    );

    console.log(
      `Production invitation transformation audit: PASS (${formatSummary(
        transformed.summary,
      )})`,
    );
  } catch {
    console.error(
      "Production invitation transformation audit: FAIL",
    );

    process.exitCode = 1;
  }
}

main();