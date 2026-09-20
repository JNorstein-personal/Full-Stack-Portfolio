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
    `active invitations=${summary.activeInvitationCount}`,
    `unique codes=${summary.uniqueCanonicalCodeCount}`,
    `singular=${summary.singularCount}`,
    `plural=${summary.pluralCount}`,
    `invitations with Plus1=${summary.invitationsWithAllocations}`,
    `Plus1 allocations=${summary.allocationCount}`,
    `multi-allocation invitations=${summary.multiAllocationInvitationCount}`,
    `combined maximum attendance=${summary.combinedMaximumAttendance}`,
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
