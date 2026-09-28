# RSVP System Design

**Project:** Loreweaver Creations Wedding Website
**Phase:** Phase 3 — Design the RSVP System
**Current completion:** Phase 3 RSVP architecture synchronized with the authoritative private `Invitees List` spreadsheet, the September 20, 2026 attendance-composition clarification, the September 27 unnamed-child source clarification, the cleaned latest source, and the grouped `Kids(n)` family-control clarification, including mixed allocation response types, derived actual attendance, attendee-detail behavior, the current submission/revision model, interface-state model, fictional development fixtures, confirmation-refresh behavior, and privacy/security rules
**Phase 3 status:** Complete; governing RSVP model corrected before further implementation
**Last updated:** September 27, 2026

---

## 1. Purpose and Status

This document specifies the architecture, end-to-end data flow, trust boundaries, invitation-code normalization rules, sole RSVP access method, limited blank-form response boundary, submission/partial-revision model, authoritative conditional/dependency rules, explicit React interface-state model, fictional development archetypes, finalized confirmation-refresh behavior, and mandatory privacy and security rules of the RSVP system for the Loreweaver Creations wedding website.

The couple-supplied private `Invitees List` spreadsheet remains authoritative for production invitation capacity, party identity, wording mode, explicit `Plus1` allocations, `Kids(n)` child authorization, and the source data from which the specifically named-invitee roster is constructed.

The September 20, 2026 attendance-composition clarification requires the system to identify which specifically named potential attendees and authorized additional guests are actually attending before age-category totals and attendee-detail cardinality are finalized.

The September 27 unnamed-child clarification establishes that children whose names are absent from the source name columns are not fabricated as named invitees. The cleaned latest source now uses `Kids(n)` only for such unnamed children.

The grouped-children clarification further establishes that an invitation with `Kids(n)` uses one family-level child authorization/control rather than one allocation object and one Yes/No prompt per possible child.

The current design defines how one reusable RSVP application:

* Accepts a manually entered invitation code.
* Normalizes that invitation code consistently in React and Express, with Express authoritative.
* Uses a private invitation-party configuration generated from the authoritative spreadsheet.
* Returns only the information necessary to render a blank guest-facing form.
* Uses one substantive form structure for all active production invitations rather than separate production substantive form configurations.
* Varies the rendered form only through reviewed party display text, explicit singular/plural wording, `maximumAttendance`, an authorized `namedInvitees` roster, and zero or more authorized `additionalGuestAllocations`.
* Represents each additional-guest allocation with a stable opaque `id`, safe `kind`, reviewed guest-facing `prompt`, and positive whole-number `maximumCount`.
* Presents one Yes/No attendance decision for every authorized named invitee when the party is attending.
* Presents one Yes/No question for every authorized `plus1` allocation.
* Presents at most one grouped `unnamedChildren` question per applicable invitation using the approved family-level wording; Yes reveals a required child-count selector from 1 through the allocation's `maximumCount`, while No records count 0.
* Keeps both Plus1 and grouped child responses within `additionalGuestResponses` rather than creating a separate child-specific substantive region.
* Derives `overallAttendance` from named-invitee Yes responses, Plus1 Yes responses, and any grouped unnamed-child attending count rather than from an independently chosen headcount.
* Presents coordinated age-category numerical dials whose sum must equal derived `overallAttendance` exactly.
* Presents exactly one `Attendee Details` record per attending person for Ceremony-only, Reception-only, or combined attendance, including one row for every child represented by the grouped count.
* Requires an attendee name in every attendee-detail record and presents `Dietary or allergy information` only when Reception is selected.
* Accepts either a complete initial RSVP or selected changes to an existing RSVP.
* Merges partial revisions with the current stored response on the backend.
* Uses replacement plus backend dependency-clearing semantics; it does not depend on a generic client substantive `clear` operation.
* Requires complete attendee-detail replacement whenever attending composition changes. Any grouped child response/count change is treated as composition-sensitive because the identities of previously unnamed child rows cannot safely be presumed unchanged.
* Stores one authoritative current RSVP while preserving version history.
* Sends complete guest and administrative confirmations after successful storage.
* Prevents private invitation and RSVP data from being exposed through browser URLs or unnecessary frontend data.
* Applies the finalized privacy and security standard for caching, indexing, analytics, logs, rate limiting, credentials, administrative access, SMS use, retention, and production transport.

The Phase 3 step history remains useful as a record of how the design was developed, but the current rules are the synchronized rules stated in this document and the current `decisions.md`, `requirements.md`, and `rsvp-api-contract.md`.

At the completion of **Phase 3 Step 1**, this document established the authoritative high-level RSVP data flow.

At the completion of **Phase 3 Step 2**, this document established:

* The exact ordered invitation-code normalization process.
* The relationship among guest-entered, canonical, and display representations.
* Accepted presentation variations and rejected malformed-input categories.
* The requirement that React and Express exhibit the same observable normalization behavior, with Express authoritative.
* The production-source normalization and collision audit.

The authoritative production audit is now:

* 57 active assigned invitation records.
* 57 unique canonical invitation-code keys.
* No normalization collisions.
* 35 singular `I` wording records and 22 plural `we` wording records.
* 23 invitations authorizing at least one `Plus1`.
* 26 total `plus1` allocation objects.
* Two invitations containing more than one `Plus1`.
* 84 specifically named potential attendees represented by the reviewed parallel name fields.
* Two invitations containing `Kids(n)`.
* Five total unnamed-child attendance-capacity slots across those two invitations.
* Two grouped `unnamedChildren` allocation objects.
* 28 total `additionalGuestAllocations` objects: 26 Plus1 objects plus two grouped child objects.
* 31 total additional-guest person-capacity slots: 26 Plus1 slots plus five unnamed-child slots.
* Combined maximum-attendance capacity of 115.
* No required active production placeholder record.

These figures are source-validation targets, not renderer constants.

At the completion of **Phase 3 Step 3**, this document established the static invitation QR code as a public-homepage link, manual code entry at `/wedding/rsvp/` as the sole personalized access method, request-body transport of invitation codes, independent backend validation, limited blank-form lookup, neutral invalid-code behavior, and the prohibition on personalized browser URLs.

Phase 3 Steps 4–6 define the endpoint contract, fictional private invitation configurations, and reusable personalized form-schema vocabulary in the companion RSVP documents. Those companion files must use the grouped-child model defined here.

The successful lookup boundary continues to contain exactly:

* `invitation`
* `questions`
* `confirmationOptions`

Lookup remains a blank-form operation. It never returns stored RSVP answers, prior confirmation destinations, response versions, or an indicator that a response already exists.

The current submission boundary continues to use the four-property request envelope:

* `inviteCode`
* `clientSubmissionId`
* `confirmation`
* `changes`

The substantive `changes` object uses the corrected spreadsheet-authoritative data model:

* Coordinated event attendance/decline state.
* Authorized named-invitee attendance responses.
* Authorized additional-guest responses:
  * scalar `"yes"` / `"no"` values for `plus1`;
  * structured `{ attending, count }` values for grouped `unnamedChildren`.
* Four age-category attendance totals that must equal the backend-derived actual attending count.
* `Attendee Details` records for every attending person, with Reception-specific dietary/allergy data only when applicable.

Omission, replacement, and explicit numeric zero remain distinct. Values made inapplicable by another submitted change are cleared by backend dependency rules. The browser does not send `expectedVersion`; ordinary RSVP revisions do not use a public optimistic-concurrency contract.

The authoritative dependency order is:

1. Validate request envelope and invitation authorization.
2. Determine initial versus revision state.
3. For a revision, merge submitted replacements with the stored current response.
4. Apply automatic dependent clearing required by the resulting attendance state.
5. Resolve complete named-invitee, Plus1, and grouped-child responses.
6. Derive authoritative `overallAttendance`.
7. Determine newly applicable required structures and whether attendee composition changed.
8. Validate the complete resulting RSVP against the authoritative invitation configuration.
9. Persist the new version and current-response record.
10. Attempt guest and administrative confirmation delivery independently.

The thirteen-state React interface model remains unchanged at the top level. The content rendered inside the validated blank-form, validation-failure, and confirmation states is revised to the grouped-child question structure.

The development fixture set remains fictional and development-only. Its configuration vocabulary must exercise:

* Singular and plural wording.
* Named-invitee roster sizes consistent with invitation capacity.
* Zero, one, and multiple Plus1 allocations.
* A grouped unnamed-child allocation with `maximumCount > 1`.
* Mixed Plus1 and grouped-child authorization in test scenarios where useful.
* Small and larger maximum-attendance values.
* Ceremony-only, Reception-only, combined attendance, and full decline.
* Mixed named-invitee attendance within one party.
* Grouped children answered No, Yes at the minimum count, and Yes at the maximum count.
* `Attendee Details` repetition for every attending event combination.
* Reception-specific dietary/allergy applicability.
* Existing-response partial revision.
* Attendee-composition changes with and without numeric count changes.
* Disabled-fixture behavior.
* Delivery warning and idempotent safe retry.

The former production `default` / `reduced-attendance-dietary` profile split is no longer part of the active architecture.

The approved Phase 1 and Phase 2 documentation remains controlling where it does not conflict with a later approved decision. This document must remain consistent with:

* `requirements.md`
* `content-inventory.md`
* `link-inventory.md`
* `decisions.md`
* `sitemap.md`
* `route-inventory.md`
* `page-outlines.md`
* `wireframes.md`
* `rsvp-api-contract.md`
* `rsvp-example-configurations.json`
* `rsvp-example-form-schemas.json`
* `rsvp-test-cases.md`

Where a later approved project decision supersedes a rule in this document, the later approved decision controls and this document must be revised accordingly.

## 2. Governing RSVP Design Principles

The RSVP system must preserve the following approved project boundaries.

### 2.1 One Reusable RSVP Application

The application uses one reusable React RSVP interface for all invited parties.

The system must not create:

* One React page per invitation.
* One React component per invitation.
* One public route per invitation.
* One personalized URL per invitation.
* Client-side invitation data containing all production invitation records.

Personalization is produced from a private invitation-party configuration returned in limited form by the backend after successful validation.

The application must load invitation records dynamically. Form-rendering, validation, lookup, and submission logic must not assume that the production invitation count will always remain fixed at 57.

### 2.2 Manual Invitation-Code Entry

Manual invitation-code entry is the sole access method for personalized RSVP functionality.

Every printed invitation uses the same static QR code for the public wedding homepage:

`https://www.loreweavercreations.com/wedding/`

The QR code:

* Does not contain an invitation code.
* Does not identify an invited party.
* Does not open a personalized RSVP route.
* Does not bypass manual invitation-code entry.

From the public homepage, the guest selects RSVP and proceeds to:

`/wedding/rsvp/`

The guest then manually enters the six-character invitation code printed on the invitation.

Invitation codes must not be carried in:

* Browser paths.
* Query strings.
* URL fragments.
* Page metadata.
* Analytics data.
* Referrer data.

There is no direct personalized browser link.

After successful validation, the personalized form remains a controlled state of `/wedding/rsvp/`.

A guest returning to revise an existing RSVP uses the same access method: return to `/wedding/rsvp/` and manually re-enter the printed invitation code.

### 2.3 Spreadsheet-Authoritative Substantive RSVP Structure

The RSVP system operates at the invited-party level while recording the named-person decisions and grouped unnamed-child count needed to determine actual attendance.

The authoritative private `Invitees List` row and its reviewed transformation determine the invitation-specific configuration used by the common substantive form structure:

* Reviewed `partyDisplayName` and greeting text.
* Explicit singular or plural `wordingMode` from `I/We wording`.
* `maximumAttendance` from `Total Potential Attendees (Including Plus1 and Kids)`.
* `namedInvitees`, containing one private roster record for every specifically named potential attendee represented by the reviewed parallel First Name(s) / Last Name(s) entries, including specifically named children.
* Zero or more `additionalGuestAllocations`, each containing:
  * stable opaque `id`;
  * safe `kind`;
  * reviewed guest-facing `prompt`; and
  * positive whole-number `maximumCount`.
* Protected `active` and `environment` state.

The supported allocation variants are:

* `plus1` — one allocation per explicit source `Plus1`, always `maximumCount: 1`.
* `unnamedChildren` — at most one grouped allocation per applicable invitation, with `maximumCount` equal to the complete reconciled unnamed-child capacity authorized by `Kids(n)`.

The configuration must account for every potential attendance slot represented by the authoritative maximum:

`namedInvitees.length + sum(additionalGuestAllocations.maximumCount) = maximumAttendance`

If the private source cannot satisfy this relationship deterministically, the configuration fails validation for private review rather than inventing, omitting, or guessing an attendee.

The latest authoritative source uses `Kids(n)` only for unnamed children, so an applicable production row must reconcile its grouped child `maximumCount` exactly to `n`. A specifically named child remains a `namedInvitees` record and is never duplicated in grouped child capacity.

The renderer must not infer roster membership, capacity, allocation kind, or child authorization from visible names, greeting text, or apparent household size.

#### Coordinated event-attendance control

The form presents one coordinated three-checkbox event-attendance interface:

1. `Ceremony`.
2. `Reception`.
3. `Regretfully, I am unable to attend.` or `Regretfully, we are unable to attend.`, according to `wordingMode`.

Ceremony and Reception may be selected independently or together. An attending event selection and decline are mutually exclusive. React coordinates the controls for usability; Express independently enforces the same rule.

The event choice establishes which wedding event or events the attending members of the invited party will attend. It does not by itself establish which people or how many grouped unnamed children are attending.

#### Named-invitee attendance decisions

For each object in `namedInvitees`, the form renders one Yes/No attendance question using the approved display name returned for that validated party.

Each response is keyed by the stable opaque invitee identifier rather than the display name.

For an initial attending RSVP and a transition from full decline to attendance, every authorized named invitee requires an explicit Yes/No response. On an ordinary revision that remains attending, an omitted response remains unchanged unless another change makes a complete dependent structure newly required.

Unknown, duplicate, malformed, or cross-party invitee identifiers are rejected.

A full party decline makes all named-invitee attendance responses inapplicable.

#### Named-invitee `Plus1` allocation questions

For each authorized allocation with `kind: "plus1"`, the form renders one Yes/No question:

`Will [Named Invitee] be accompanied by a +1?`

The allocation has `maximumCount: 1`. Its canonical response is `"yes"` or `"no"`.

The allocation question does not ask for the Plus1's own name. If that guest attends, the name is collected later through ordinary `Attendee Details`.

#### Grouped unnamed-children allocation question

When the validated invitation contains a `kind: "unnamedChildren"` allocation, the form renders exactly one family-level Yes/No question:

`We'd love for your family to celebrate with us this Mayday - will your kid(s) be accompanying you?`

The browser does not render one Yes/No question per child.

When No is selected:

* the count selector is not applicable;
* the canonical response is `{ "attending": "no", "count": 0 }`.

When Yes is selected:

* reveal one required dropdown;
* choices are the consecutive whole numbers from 1 through the allocation's `maximumCount`;
* the canonical response is `{ "attending": "yes", "count": k }`.

The browser receives the safe `kind` and `maximumCount` needed to render this interaction but does not receive raw source `Kids(n)` text or unrelated private source metadata.

The actual names of the selected number of attending children are collected later through ordinary `Attendee Details`. Their age distribution is recorded through the same attendance-total structure used for every attendee.

#### Authoritative actual attending count

`maximumAttendance` is the maximum possible size of the invitation-code party. It is not an independently chosen attending headcount.

For an attending RSVP:

`overallAttendance = named-invitee Yes count + Plus1 Yes count + grouped unnamed-child attending count`

Contribution rules:

* named invitee Yes = 1;
* Plus1 Yes = 1;
* grouped children Yes = validated `count`;
* corresponding No values = 0.

For an attending state, `overallAttendance` must be at least 1 and may never exceed `maximumAttendance`. For full decline, it is 0.

React may mirror the same derivation provisionally for usability, but Express independently derives and validates the authoritative value.

#### Attendance totals

Every attending RSVP supplies four nonnegative whole-number age-category totals:

* Adults, ages 21 and older.
* Young Adults, ages 18–20.
* Children, ages 3–17.
* Children under 3.

These controls classify the already-derived attending party; they do not choose its size.

Each dial's current browser-side upper bound is derived `overallAttendance` minus the values currently assigned to the other three dials. Express validates final equality rather than trusting browser limits.

The complete four-category sum must equal `overallAttendance` exactly.

#### Attendee Details

The repeating section is named `Attendee Details`.

Whenever `overallAttendance > 0`, the form renders exactly one attendee-detail record for each attending person regardless of whether attendance is Ceremony only, Reception only, or both. This includes one row for every child represented by the grouped child count.

Every record contains:

* Required `attendeeName`, nonblank, maximum 100 characters.
* When Reception is selected, `dietaryPreferences`, optional, maximum 1000 characters, displayed as `Dietary or allergy information`.

The visible dietary label does not include `(optional)`.

Ceremony-only attendance retains attendee names but does not render, accept, or store dietary/allergy values. Removing Reception while continuing to attend clears only dietary/allergy values.

A full decline produces no attendee-detail records.

If a revision changes attending composition, the complete `attendeeDetails` list must be replaced even when numeric `overallAttendance` remains unchanged. Named-invitee changes and Plus1 changes are composition-sensitive when they change who attends. Any grouped unnamed-child response/count change is treated as composition-sensitive because the backend cannot safely infer which unnamed child identity corresponds to previously stored rows.

If composition remains unchanged and `attendeeDetails` is omitted, the stored list remains unchanged except for Reception-specific dietary clearing.

#### Closed substantive question set

The production RSVP does not add separate accessibility, lodging, transportation, message-to-couple, entrée-selection, child-name-at-allocation, or other substantive questions unless the governing source and decisions are later changed.

There is no separate child-specific substantive response region. Both allocation variants use `additionalGuestResponses`.

The production system does not use separate substantive form configurations. Invitation-specific variation is data-driven from the authoritative row, the transformed private roster/allocation configuration, and the guest's current selections.

### 2.4 Blank Forms

Every successfully validated invitation loads a blank personalized form.

This applies both when:

* No RSVP has previously been submitted; and
* A current RSVP already exists and the guest intends to make a revision.

The lookup response must not prefill or reveal:

* Stored event-attendance or decline answers.
* Stored named-invitee attendance answers.
* Stored `additionalGuestResponses`, including Plus1 responses and grouped child count responses.
* Stored attendance totals.
* Stored attendee names or Reception-specific dietary/allergy information.
* Stored confirmation method.
* Stored email address.
* Stored mobile number.
* Other stored RSVP content.

The limited lookup response may include only the validated party's authorized blank-form configuration, including safe `namedInvitees` entries and safe allocation fields `id`, `kind`, `prompt`, and `maximumCount` needed to render that party's authorized controls.

### 2.5 Initial Responses and Partial Revisions

An initial RSVP requires all substantive values necessary to create a valid complete current state.

An attending initial response requires:

* a valid event-attendance state;
* every authorized named-invitee Yes/No response;
* every authorized additional-guest response in the shape required by its allocation `kind`;
* all four age-category totals equal to derived `overallAttendance`;
* a complete attendee-detail list of that exact cardinality; and
* complete operational confirmation data.

A revision begins from another blank form. Submitted substantive replacements are merged privately with stored state. Omitted substantive values remain unchanged when still applicable.

Numeric zero is an ordinary explicit replacement where authorized.

The client does not use a generic substantive `clear` operation. Values made inapplicable by another change are cleared by backend dependency rules.

A full decline clears all attendance-dependent substantive state. Removing Reception while continuing to attend clears only dietary/allergy values.

Any grouped child response/count change is treated as an attendee-composition change and requires complete `attendeeDetails` replacement.

### 2.6 Backend Authority

React provides usability validation and provisional derived display values. Express remains authoritative for:

* Invitation-code normalization and authorization.
* Environment/active/deadline eligibility.
* Safe allocation `kind` and `maximumCount`.
* Configuration capacity reconciliation:
  `namedInvitees.length + sum(additionalGuestAllocations.maximumCount) = maximumAttendance`
* Named-invitee identifier authorization.
* Additional-allocation identifier authorization.
* Plus1 response shape and value.
* Grouped child `{attending,count}` shape and count bounds.
* Initial-versus-revision determination.
* Revision merge semantics.
* Backend dependency clearing.
* Derivation of `overallAttendance`.
* Exact age-total equality.
* Attendee-detail cardinality, composition-sensitive replacement, and text limits.
* Reception-specific dietary applicability.
* Operational confirmation dependencies.
* Storage/version/idempotency/delivery ordering.

Browser visibility never grants authorization. The backend validates the complete resulting state before storage.

### 2.7 Storage Before Delivery

A successfully validated RSVP must be stored before any confirmation-delivery attempt begins.

Confirmation-delivery failure must not:

* Undo a stored RSVP.
* Create a duplicate RSVP.
* Cause the current RSVP to revert.
* Cause attendance to be counted twice.

Delivery status is recorded separately from RSVP content and version history.

---

## 3. Canonical End-to-End RSVP Data Flow

The following flow is the controlling Phase 3 Step 1 description of the RSVP process once the guest has reached `/wedding/rsvp/`. Phase 3 Step 3 separately defines the upstream static-QR and manual-entry access path in Section 8.

```text
Guest opens /wedding/rsvp/
 |
 v
Guest manually enters invitation code
 |
 v
React performs usability normalization for display
 |
 v
React POSTs the code in the request body to /wedding/api/rsvp/lookup
 |
 v
Express independently normalizes, rate-limits, and validates the code
 |
 +---- Malformed or unknown code
 |     |
 |     v
 |     Return guest-safe neutral result
 |
 v
Backend loads the private invitation-party configuration
 |
 v
Backend selects permitted questions, wording, and the validated party's limited named-invitee/allocation configuration
 |
 v
Backend returns a limited schema with no stored answers
 |
 v
React renders the blank personalized form on /wedding/rsvp/
 |
 v
Guest completes event attendance, authorized attendance decisions, age totals, attendee details, and operational confirmation data for an initial RSVP or selected revision fields
 |
 v
React performs usability validation
 |
 v
React POSTs invite code, confirmation data, client submission ID,
and submitted changes to /wedding/api/rsvp/submit
 |
 v
Express normalizes and revalidates the invitation code
 |
 v
Backend verifies deadline, authorization, values, and idempotency
 |
 v
Backend determines initial versus revision
 |
 +---- Revision
 |     |
 |     v
 |     Load current stored RSVP
 |     |
 |     v
 |     Merge submitted fields; omitted fields remain unchanged
 |
 v
Backend clears incompatible dependent values, derives actual attendance from named-invitee Yes responses, Plus1 Yes responses, and grouped child count, detects composition changes, and validates the complete resulting RSVP
 |
 +---- Invalid, unauthorized, or contradictory state
 |     |
 |     v
 |     Return field and form errors without revealing stored values
 |
 v
Backend writes the new version and updates the current-response record
 |
 v
Backend attempts protected administrative email
 |
 v
Backend attempts guest email or SMS according to selected method
 |
 v
Backend records delivery results separately from RSVP content
 |
 v
Backend returns limited complete guest-facing confirmation data
 |
 v
React navigates to /wedding/rsvp/confirmation using temporary state
 |
 v
React displays success or success-with-delivery-warning
```

---

## 4. Data-Flow Stages

### 4.1 RSVP Entry

The guest reaches `/wedding/rsvp/` through public navigation or the static invitation QR-code flow and manually enters the six-character invitation code printed with the invitation.

The browser may normalize the visible entry for usability, but it does not determine validity or authorization.

### 4.2 Invitation Lookup Request

React submits:

`POST /wedding/api/rsvp/lookup`

The invitation code is sent only in the request body. Express independently normalizes the value, applies the lookup rate limit, checks environment eligibility and active state, and retrieves the private invitation configuration.

### 4.3 Invalid Invitation Result

Malformed, unknown, inactive, disabled, or environment-ineligible codes produce the same neutral guest-facing invalid-invitation behavior. The response must not disclose whether a private record exists, whether a close match exists, or whether a development-only record was encountered.

### 4.4 Private Invitation Configuration

After a successful lookup, the backend loads one private invitation-party configuration generated from the authoritative `Invitees List` row.

The private record contains or derives, at minimum:

* Canonical invitation-code key and approved display representation.
* Private `partyId` or equivalent internal identifier.
* Reviewed `partyDisplayName` and greeting content.
* Explicit `wordingMode`.
* `maximumAttendance` as the maximum possible party size.
* `namedInvitees`, with one stable opaque invitee identifier and approved display name for every specifically named potential attendee.
* `additionalGuestAllocations`, where each record contains:
  * stable opaque `id`;
  * `kind` of `plus1` or `unnamedChildren`;
  * reviewed guest-facing `prompt`;
  * positive whole-number `maximumCount`.
* Protected `active` and `environment` values.

`plus1` allocations have `maximumCount: 1`. An applicable invitation has at most one grouped `unnamedChildren` allocation, whose `maximumCount` is the complete reconciled source-authorized unnamed-child capacity.

The private configuration must satisfy:

`namedInvitees.length + sum(additionalGuestAllocations.maximumCount) = maximumAttendance`

A contradictory configuration is rejected for private review rather than repaired by browser logic.

The private record does **not** require a production `questionProfile`. All active production invitations use the same substantive form model.

The browser never reads the private Google Sheets workbook directly.

### 4.5 Limited Blank-Form Response

A successful lookup returns exactly three top-level properties:

* `invitation`
* `questions`
* `confirmationOptions`

The `invitation` object may contain only guest-facing values required to render the validated party's blank form:

* Reviewed `partyDisplayName` and `greeting`.
* Explicit `wordingMode`.
* `maximumAttendance`.
* Limited `namedInvitees` entries containing only stable opaque ids and approved display names.
* Safe `additionalGuestAllocations` entries containing exactly the fields required for rendering and client-side usability validation:
  * `id`
  * `kind`
  * `prompt`
  * `maximumCount`
* Centralized RSVP deadline.
* `America/New_York` time-zone information.

The browser does not need the raw production code, private `partyId`, protected active/environment state, complete source row, raw `Kids(n)` text, unrelated guest names, private source mappings beyond the validated party, or administrative notes.

The `questions` array uses the reusable structure defined in `rsvp-example-form-schemas.json` and contains:

* Coordinated event attendance/decline.
* Named-invitee responses.
* Allocation-dependent additional-guest responses.
* Four coordinated age-category totals.
* `Attendee Details`.
* Reception-specific dietary/allergy information.
* Operational confirmation controls.

Lookup never returns stored RSVP answers, contact destinations, delivery state, versions, or an existing-response indicator.

### 4.6 Blank Personalized Form

React renders the personalized form on `/wedding/rsvp/` using only the limited lookup response.

Every lookup opens a blank substantive form and blank operational confirmation fields. No previously stored answer or contact destination is displayed or prefilled.

The blank form may still display invitation-specific static context returned by lookup, such as reviewed party heading, wording mode, maximum party size, the validated party's named-invitee roster, and authorized additional-guest prompts.

### 4.7 Guest Completion

For an initial RSVP, the guest provides a complete valid substantive response for the current attendance state plus required operational confirmation data.

For a revision, the guest may provide only substantive replacements that need to change except when dependency or composition rules require a complete replacement structure.

An attending initial response includes:

* Ceremony, Reception, or both.
* One Yes/No response for every authorized named invitee.
* For every authorized `plus1`, one Yes/No response.
* For every authorized `unnamedChildren` allocation, one grouped response:
  * No with count 0; or
  * Yes with a required count from 1 through `maximumCount`.
* Complete four-category age totals summing to derived `overallAttendance`.
* Exactly one complete `Attendee Details` record per derived attendee.

A full decline contains the decline state and operational confirmation data but no attendance-dependent substantive structures.

### 4.8 Client-Side Usability Validation

React may validate for usability before submission, including:

* Invitation-code presentation cleanup.
* Required fields.
* Mutually exclusive event-attendance/decline state.
* Named-invitee Yes/No completeness when newly applicable.
* Plus1 Yes/No completeness when newly applicable.
* Grouped child Yes/No completeness when authorized.
* Conditional display and requiredness of the grouped child count selector after Yes.
* Grouped child count as a whole number within `1..maximumCount`.
* Provisional derivation of `overallAttendance`.
* Whole-number age totals.
* Coordinated dial limits against the derived attending count.
* Exact equality between the four age totals and derived attendance.
* `Attendee Details` cardinality.
* Attendee-name 100-character maximum.
* Reception-specific dietary/allergy 1000-character maximum.
* Conditional operational confirmation fields.

All client validation is advisory. Express independently validates every value, identifier, response shape, allocation kind/count bound, dependency, composition rule, and authorization rule.

### 4.9 RSVP Submission Request

React submits:

`POST /wedding/api/rsvp/submit`

The top-level request envelope remains:

```text
RSVP submission
├── inviteCode
├── clientSubmissionId
├── confirmation
└── changes
```

`inviteCode` carries the manually entered value and is independently normalized by Express.

`clientSubmissionId` is a client-generated UUID-form identifier for one logical submission. A new logical RSVP action receives a new identifier; a safe retry of the same logical action reuses the same identifier and materially identical request content.

`confirmation` contains the complete newly entered operational confirmation data:

* Email: method plus applicable email address.
* Text Message, when enabled: method, applicable SMS-capable mobile number, and required transactional authorization.

`changes` contains only substantive operations. The corrected substantive vocabulary is:

* `eventAttendance`
* `namedInviteeResponses`
* `additionalGuestResponses`
* `attendanceTotals`
* `attendeeDetails`

#### `eventAttendance`

A replacement value is a complete closed-set event-attendance selection:

* `['ceremony']`
* `['reception']`
* `['ceremony', 'reception']`
* `['decline']`

Order is not semantically significant. `decline` cannot coexist with an attending event.

#### `namedInviteeResponses`

This structure is keyed only by stable authorized invitee identifiers returned through the validated party's limited `namedInvitees` roster. Each submitted response is Yes or No.

For an initial attending submission, every authorized named invitee requires a response. For a revision, individual named-invitee responses may be omitted to remain unchanged unless the field is newly applicable after a prior decline.

The backend never accepts an unknown, duplicate, malformed, or cross-party invitee identifier and never uses the guest-facing display name itself as the authorization key.

#### `additionalGuestResponses`

This structure is keyed only by stable authorized allocation identifiers returned through validated lookup.

Response shape is allocation-kind-specific.

For `kind: "plus1"`:

* Value is exactly `"yes"` or `"no"`.
* Yes contributes one attendee; No contributes zero.

For `kind: "unnamedChildren"`:

* Value contains exactly `attending` and `count`.
* `attending` is `"yes"` or `"no"`.
* Yes requires integer `count` from 1 through that allocation's `maximumCount`.
* No requires `count: 0`.
* The validated count contributes directly to derived attendance.

Initial attending submissions and decline-to-attending transitions require one complete valid response for every authorized allocation. Ordinary attending revisions may omit unchanged allocation responses.

Unknown, duplicate, malformed, cross-party, wrong-shape, or over-capacity responses are rejected.

#### `attendanceTotals`

The grouped value contains the four age categories. Initial attending submissions require all four. A revision may replace only selected nested category values; omitted nested categories remain unchanged. Numeric zero is an ordinary explicit replacement and is distinct from omission.

The backend does **not** derive actual attendance from these totals. It independently derives `overallAttendance` from named-invitee Yes responses, Plus1 Yes responses, and any grouped unnamed-child attending count, then requires the complete merged four-category sum to equal that derived value exactly.

#### `attendeeDetails`

When submitted, this value replaces the complete applicable attendee-detail list. Each item contains:

* `attendeeName` — required, nonblank, maximum 100 characters.
* `dietaryPreferences` — accepted only when Reception is selected; optional, maximum 1000 characters, and displayed with the label `Dietary or allergy information`.

For every attending state, the list length must equal the complete derived `overallAttendance`.

Because a blank revision form never reveals stored attendee names or dietary text, a composition-changing revision must provide the complete replacement list. A composition change includes a named-invitee or Plus1 change that changes who attends and any grouped child response/count change. Grouped child changes always require a complete replacement because previously unnamed child identities cannot safely be matched to stored attendee-detail rows.

If attendee composition remains unchanged and `attendeeDetails` is omitted during a revision, the stored list remains unchanged. If Reception becomes inapplicable while the party continues to attend, the backend clears only dietary/allergy values from those stored records while preserving attendee names.

The exact JSON encoding is finalized in `rsvp-api-contract.md`; this section governs the semantics.

### 4.10 Server Revalidation

Express independently:

* Normalizes and authorizes the invitation code.
* Loads and validates the private invitation configuration.
* Verifies allocation kinds and maximum counts.
* Enforces the configuration-capacity invariant.
* Parses the exact submission envelope.
* Authorizes substantive region IDs.
* Authorizes named-invitee IDs.
* Authorizes allocation IDs.
* Validates Plus1 scalar responses.
* Validates grouped child structured responses and count bounds.
* Determines initial versus revision.
* Merges permissible revisions.
* Applies backend dependency clearing.
* Derives `overallAttendance`.
* Validates exact age-total equality.
* Validates attendee-detail cardinality, required names, composition-sensitive replacement, and Reception-only dietary applicability.
* Validates operational confirmation fields.
* Applies deadline and other security boundaries.

Client-derived values never override backend derivation.

### 4.11 Initial-Versus-Revision Determination

The browser does not send an `initial` or `revision` authority flag and lookup does not reveal existing-response state.

After authorization and idempotency checks, the backend determines whether a current RSVP already exists for the invitation:

* No current response: validate as an initial RSVP.
* Current response exists: merge the submitted changes as a revision.

### 4.12 Revision Merge

For a revision:

1. Load the current stored RSVP privately.
2. Apply submitted substantive replacement operations.
3. Preserve omitted substantive values where still applicable.
4. Treat explicit numeric zero as a replacement, not omission.
5. Replace operational confirmation data with the newly submitted complete operational object.
6. Apply backend dependency clearing for values made inapplicable.
7. Determine whether the resulting state makes a complete structure newly required.
8. Validate the complete merged RSVP.

The client does not submit a generic substantive `clear` operation.

The blank-form policy does not weaken backend merge semantics; stored data may be used privately for merging without being returned to the browser.

### 4.13 Authoritative Conditional and Dependency Rules

#### 4.13.1 Dependency Processing Order

For an initial submission or merged revision:

1. Establish the resulting event-attendance/decline state.
2. Apply automatic clearing for data made inapplicable by full decline.
3. Establish the complete resulting named-invitee response map.
4. Establish the complete resulting allocation response map.
5. Validate each allocation response against its `kind` and `maximumCount`.
6. Derive authoritative `overallAttendance` from named-invitee Yes responses, Plus1 Yes responses, and grouped unnamed-child attending count.
7. Establish complete age totals and require exact equality to `overallAttendance` when attending.
8. Determine whether attendee composition changed and whether complete `attendeeDetails` replacement is required.
9. Resolve Reception-specific dietary/allergy applicability and clearing.
10. Validate final cross-field invariants.
11. Persist only after the complete result is valid.

#### 4.13.2 Attendance and Decline

The only valid event-attendance states are:

* Ceremony only.
* Reception only.
* Ceremony and Reception.
* Full decline.

The backend rejects an empty event-attendance state on an initial submission and rejects any state combining `decline` with Ceremony or Reception.

The event-attendance state does not by itself determine the attending party; named-invitee responses, Plus1 responses, and any grouped child count do that when the party is attending.

#### 4.13.3 Full Decline and Automatic Dependent Clearing

A resulting full decline automatically clears:

* Ceremony and Reception selections.
* Every stored named-invitee attendance response.
* Every stored additional-guest allocation response.
* All four age-category totals and derived `overallAttendance`.
* The entire `attendeeDetails` list, including any dietary/allergy values.

A successful declined current RSVP does not retain synthetic zero totals, named/additional response maps, grouped child count objects, or empty attendee placeholders as substantive answers.

#### 4.13.4 Transition from Decline to Attending

When a revision changes full decline into any attending state, the following become newly required:

* A Yes/No response for every authorized named invitee.
* A valid response for every authorized additional-guest allocation:
  * Plus1 Yes/No; or
  * grouped child Yes plus valid count, or No plus count 0.
* Complete values for all four age categories.
* A complete `attendeeDetails` list matching newly derived `overallAttendance`.

The backend rejects missing newly applicable data rather than inventing values.

#### 4.13.5 Authorized Attendance Response Dependency Rules

Named-invitee and additional-guest responses are applicable only while the party attends Ceremony, Reception, or both.

For every authorized named invitee:

* Initial attending response: exactly one Yes or No is required.
* Revision while attending: omission preserves the stored value unless newly applicable after decline.
* Unknown, duplicate, malformed, or cross-party id: reject.

For every `plus1` allocation:

* Initial attending response: exactly one `"yes"` or `"no"` is required.
* Revision while attending: omission preserves the stored value unless newly applicable.
* `maximumCount` must be 1.
* Unknown/unauthorized id or non-Yes/No value: reject.

For the grouped `unnamedChildren` allocation:

* At most one may exist per invitation.
* Initial attending response or decline-to-attending transition requires the complete `{attending,count}` value.
* `attending: "yes"` requires integer `count` from 1 through `maximumCount`.
* `attending: "no"` requires `count: 0`.
* Ordinary attending revision may omit an unchanged grouped response.
* Unknown/unauthorized id, wrong shape, invalid count, or count above maximum: reject.

A party with no authorized additional-guest allocations must not accept `additionalGuestResponses`.

The backend does not infer age category or attendee name from any attendance response.

Authoritative attendance is:

`overallAttendance = named-invitee Yes count + Plus1 Yes count + grouped unnamed-child attending count`

For an attending state the result must be at least 1 and may never exceed `maximumAttendance`. For full decline it is 0.

Any grouped child response/count change is an attendee-composition change. Named-invitee or Plus1 changes are composition changes when they alter who attends.

#### 4.13.6 Attendance-Total Dependency Rules

Attendance totals are applicable and required for every attending state.

The complete merged totals must:

* Contain all four categories.
* Use nonnegative whole numbers.
* Sum exactly to the authoritative derived `overallAttendance`.

The browser implements coordinated dial behavior against the derived attending count: each dial's current upper bound equals `overallAttendance` minus the other three current dial values. The backend independently validates the final equality and does not rely on browser control limits.

A revision may replace selected nested age categories while omitted nested categories remain unchanged. Age-category changes that preserve the same total do not by themselves change attendee identity and therefore do not independently require `attendeeDetails` replacement.

#### 4.13.7 Attendee-Detail Dependency Rules

`attendeeDetails` is applicable for every attending state, not only when Reception is selected.

When applicable, the complete list must:

* Contain exactly `overallAttendance` records.
* Contain a required nonblank `attendeeName` for each record, no more than 100 characters.
* When Reception is selected, permit an optional `dietaryPreferences` string no more than 1000 characters for each record.
* When Reception is not selected, contain no dietary/allergy value.
* Contain no additional unauthorized properties once the exact API schema is finalized.

The guest-facing dietary field label is `Dietary or allergy information`; it is not labeled `(optional)` even though a blank value is valid.

If attendee composition changes, the previous list cannot remain authoritative because the backend cannot safely infer which stored name belongs to which new set of attendees. The revision must therefore supply a complete replacement `attendeeDetails` list even when `overallAttendance` is unchanged.

If attendee composition remains unchanged and `attendeeDetails` is omitted, the stored list remains unchanged.

If Reception is removed while the party continues to attend, attendee names remain applicable and the backend clears only stored dietary/allergy values.

If Reception is added while attendee composition remains unchanged, the existing attendee names remain valid; dietary/allergy information becomes available but remains optional. Omission of `attendeeDetails` therefore does not by itself invalidate that revision.

Full decline clears the entire attendee-detail list.

#### 4.13.8 Spreadsheet-Authoritative Closed Set

All active production invitations use this same substantive field vocabulary. The backend must not accept an obsolete production profile identifier or a field that belonged only to the superseded profile model.

Invitation-specific variation is limited to authorized configuration data and current selections; it does not authorize separate guest-specific source code or routes.

#### 4.13.9 Operational Confirmation Dependencies

Operational confirmation is required for every initial submission and every revision.

For Email:

* `method` is Email.
* A valid email destination is required.
* Mobile number and SMS authorization are inapplicable.

For Text Message, only when the production SMS gate is enabled:

* `method` is Text Message.
* A valid SMS-capable mobile number is required.
* Any configured transactional authorization is required.
* Email destination is inapplicable unless a later decision explicitly creates a dual-channel mode.

New operational values replace their stored counterparts after successful validation.

#### 4.13.10 Automatic Clearing, Rejection, and Missing Required Values

Automatic clearing is used when a dependency makes stored data inapplicable, including:

* Full decline clearing all attendance-dependent substantive data.
* Removing Reception while continuing to attend clearing only dietary/allergy values from `attendeeDetails`.

The backend rejects contradictory or unauthorized values such as:

* Attendance together with decline.
* Unknown/unauthorized named-invitee ids.
* Unknown/unauthorized allocation ids.
* `additionalGuestResponses` for a party with no allocations.
* Plus1 response values other than `"yes"` / `"no"`.
* Grouped child response objects with unsupported properties or shapes.
* Grouped child Yes with count below 1, fractional, or above `maximumCount`.
* Grouped child No with count other than 0.
* A configuration whose named-invitee count plus summed allocation `maximumCount` differs from `maximumAttendance`.
* Derived attendance zero while event attendance says the party is attending.
* Negative or fractional age totals.
* Age totals not equal to derived `overallAttendance`.
* Missing `attendeeDetails` when newly required.
* Attendee-detail cardinality different from `overallAttendance`.
* Omitted complete attendee-detail replacement after a composition change.
* Missing or overlength attendee names.
* Dietary/allergy data when Reception is not selected.
* Overlength dietary/allergy text.
* Obsolete production-profile fields or identifiers.
* A separate child-specific substantive response field.

When a transition makes a structure newly applicable, missing required data causes validation failure rather than guessed data.

### 4.14 Invalid Resulting State

If the complete initial or merged response violates authorization, requiredness, dependency, or value rules, the backend returns guest-safe validation information and stores nothing for that attempt.

A validation failure does not reveal the stored value of an omitted revision field.

### 4.15 Versioned Storage

After successful validation, the backend atomically records a new RSVP version and designates it as the authoritative current response.

The stored current substantive response includes the normalized event-attendance state and, when attending:

* Authorized named-invitee attendance responses keyed by stable opaque invitee identifiers.
* Authorized additional-guest responses keyed by stable opaque allocation identifiers, preserving scalar Plus1 values and structured grouped-child `{attending,count}` values.
* Backend-derived `overallAttendance`.
* Four age-category totals whose sum equals `overallAttendance`.
* Complete `attendeeDetails`, including required attendee names and Reception-specific dietary/allergy values only when applicable.

The backend also stores the current operational confirmation data required to support confirmation delivery and approved manual resend.

A revision does not create a second active current-response row; it advances the authoritative version while preserving version history.

### 4.16 Protected Administrative Confirmation

After storage succeeds, the backend attempts a protected administrative email containing the complete current RSVP under the corrected spreadsheet-authoritative model.

The administrative confirmation may include the invited party identity, named-invitee responses, Plus1 responses, grouped child Yes/No and attending count, attendee names, and applicable Reception dietary/allergy information because it is private correspondence to the approved administrative destination.

### 4.17 Guest Confirmation

After storage succeeds, the backend independently attempts the guest's selected confirmation channel.

The guest confirmation contains the complete current guest-facing RSVP, not merely the changed fields. It includes:

* Ceremony/Reception or decline state.
* Every applicable named-invitee attendance Yes/No response.
* Every applicable additional-guest response, including grouped child attending count when Yes.
* Four age-category totals and derived `overallAttendance` when attending.
* Complete attendee names whenever attending.
* Supplied dietary/allergy information only when Reception is selected.
* Initial/revision designation and timestamp.
* Deadline, revision guidance, and assistance information.

Inapplicable data is omitted rather than represented with synthetic placeholders.

### 4.18 Delivery-Result Recording

Guest and administrative delivery results are recorded independently from RSVP content and from one another.

A delivery failure does not roll back storage and does not create another RSVP version. Manual resend is a delivery operation, not an RSVP mutation.

### 4.19 Guest-Facing Confirmation Response

The successful submission response contains only the limited complete information required to render the temporary confirmation route.

It identifies:

* Storage recorded status.
* Whether the stored action was an initial submission or revision.
* The complete current guest-facing RSVP under the spreadsheet-authoritative form model.
* Selected guest confirmation method.
* Guest delivery status.
* Limited administrative-delivery status that does not expose the protected address.
* Timestamp and revision guidance.

It does not expose the canonical invitation code, `partyId`, private workbook row, active/environment flags, private version-history records, provider credentials, or administrative destination.

### 4.20 Confirmation Route

React carries the successful response to `/wedding/rsvp/confirmation` through temporary navigation/application state. No personalized value is added to the URL.

The route renders State 9, 10, or 11 only when structurally usable temporary successful state is available. If that temporary state is absent or unusable, it renders State 12 — Confirmation Refresh Fallback without retrieving saved RSVP data or replaying a submission.

## 5. Initial RSVP and Revision Model

### 5.1 Initial RSVP

An initial RSVP is the first successfully stored response for one authorized invitation.

An initial attending response must provide:

* Ceremony, Reception, or both.
* One Yes/No answer for every authorized named invitee.
* One valid allocation-kind-specific answer for every authorized additional-guest allocation.
* A backend-derived `overallAttendance` of at least one.
* All four age-category totals, summing exactly to derived `overallAttendance`.
* Exactly one complete `attendeeDetails` record per attending person.
* `attendeeName` for every attendee and Reception-specific optional dietary/allergy information when applicable.
* Complete operational confirmation data.

A grouped child Yes response requires a count from 1 through the allocation's `maximumCount`; grouped child No requires count 0.

An initial full decline supplies the decline state plus operational confirmation data and retains no attendance-dependent substantive structures.

### 5.2 Revision

A revision begins from a new manual invitation-code entry and another blank form. The browser never receives the current stored RSVP merely because the guest is revising it.

The guest may submit only substantive fields intended to change, subject to dependency rules:

* Omitted substantive values remain unchanged when still applicable.
* Submitted replacements replace stored values.
* Explicit numeric zero is a replacement.
* Values made inapplicable by another change are cleared by backend dependency rules.
* Nested attendance-total categories may be partially replaced.
* Individual authorized named-invitee responses may be replaced independently.
* Individual Plus1 responses may be replaced independently.
* The grouped child response may be replaced as a complete `{attending,count}` value.
* `overallAttendance` is re-derived from the complete resulting named-invitee, Plus1, and grouped-child responses.
* Four age totals must equal resulting derived `overallAttendance`.
* `attendeeDetails`, when submitted, replace the complete applicable list.
* Any grouped child response/count change requires complete `attendeeDetails` replacement.
* Other attendee-composition changes likewise require complete replacement even if numeric count stays the same.
* Removing Reception while continuing to attend clears only dietary/allergy values and retains attendee names.
* Adding Reception while composition remains unchanged does not itself require attendee-list replacement.
* Full decline clears all attendance-dependent substantive data.
* Decline-to-attending makes complete attending structures newly required.

The backend validates the complete merged result before storing a new version.

### 5.3 Safe Retry Versus New Revision

A safe retry is the same logical request repeated after an uncertain client outcome. It reuses the same `clientSubmissionId` and materially identical content.

A genuine new RSVP action or later revision uses a new `clientSubmissionId`.

The backend must not create another RSVP version for an idempotent replay of an already completed logical submission, and it must reject reuse of one identifier for materially different request content.

## 6. Trust Boundaries

### 6.1 Browser / React

React is responsible for:

* Collecting manual invitation-code entry.
* Performing non-authoritative usability normalization.
* Sending lookup requests.
* Rendering only the limited blank schema returned by the backend.
* Rendering the validated party's authorized named-invitee attendance controls.
* Rendering each authorized additional-guest control according to its safe `kind`, `prompt`, and `maximumCount`.
* Managing the coordinated event-attendance checkboxes.
* Provisionally deriving the current attending count from named-invitee Yes responses, Plus1 Yes responses, and any grouped child selected count.
* Managing numerical age-category dials against that provisional derived count.
* Repeating `Attendee Details` according to the provisional derived attending count.
* Showing `Dietary or allergy information` only when Reception is selected.
* Collecting initial responses or selected revision fields.
* Collecting operational confirmation data.
* Performing non-authoritative usability validation.
* Generating a new UUID-form `clientSubmissionId` for each genuinely new logical RSVP action.
* Preserving that identifier for a safe retry of the same logical action.
* Sending RSVP submissions.
* Displaying guest-safe validation, confirmation, warning, and fallback states.

React is not authoritative for:

* Whether an invitation code is valid, known, active, or environment-eligible.
* Which named invitees belong to the validated party.
* Which named-invitee `Plus1` allocations are authorized.
* The private source mapping behind displayed names or allocation prompts.
* `maximumAttendance` beyond the limited value returned for form rendering.
* Whether submitted substantive fields or person identifiers are authorized.
* Whether a request is an initial response or revision.
* Whether omitted stored values should remain or be cleared.
* Authoritative `overallAttendance` derivation.
* Final age-total equality or attendee-list cardinality.
* Whether attendee composition changed relative to the stored RSVP.
* Whether complete attendee-list replacement is required.
* Whether the deadline has passed.
* Whether storage succeeded.
* Whether a submission is an idempotent duplicate.
* The private RSVP version.

React must not connect directly to the private Google Sheets workbook.

### 6.2 Express Backend

The Express backend is authoritative for:

* Invitation-code normalization and validation.
* Lookup and submission rate limiting.
* Invitation authorization and environment isolation.
* Private invitation-configuration retrieval.
* Selection of guest-facing wording, named-invitee roster entries, and safe authorized allocation `kind`/`prompt`/`maximumCount` fields.
* Validation that `namedInvitees.length + sum(additionalGuestAllocations.maximumCount)` equals `maximumAttendance`.
* Named-invitee identifier and response authorization.
* Additional-guest allocation identifier authorization plus kind-specific response/count validation.
* Derivation of `overallAttendance` from complete authorized attendance decisions.
* Age-total equality with the derived attending count.
* Field authorization and submission revalidation.
* Deadline enforcement.
* Initial-versus-revision determination.
* Loading the current RSVP privately.
* Partial-revision merging.
* Explicit replacement authorization.
* Dependent-value clearing.
* Attendee-composition change detection.
* `Attendee Details` cardinality, replacement, and length limits.
* Reception-specific dietary/allergy applicability and clearing.
* Complete resulting-state validation.
* `clientSubmissionId` validation and idempotent replay behavior.
* Versioned storage and current-response designation.
* Administrative confirmation delivery.
* Guest confirmation delivery.
* Delivery-result recording.
* Guest-safe API responses.

### 6.3 Private Data Store

The private data store contains or supports:

* The authoritative private production `Invitees List` source.
* Generated private invitation-party configurations.
* Production invitation codes and private invitation identifiers.
* Reviewed party display/greeting content.
* Explicit wording mode.
* `maximumAttendance`.
* Private named-invitee roster records with stable opaque identifiers and approved display names.
* Stable additional-guest allocation identifiers plus safe allocation kind, reviewed prompt, and maximum-count metadata.
* Protected active and environment classifications.
* Current RSVP responses.
* Superseded RSVP versions.
* Authorized named-invitee, Plus1, and grouped-child response state.
* Attendance totals, derived overall attendance, attendee names, and Reception-specific dietary/allergy information.
* Operational confirmation information.
* Confirmation-delivery records.
* Private idempotency records or request fingerprints needed to recognize safe replays.
* Private administrative information.

This information is not exposed directly to the frontend. The frontend receives only the limited information required for the current guest interaction.

## 7. Invitation-Code Normalization Specification

### 7.1 Scope and Authority

The same observable invitation-code normalization behavior applies to both:

* Invitation lookup; and
* RSVP submission or revision.

React performs normalization for usability so that ordinary presentation variations do not unnecessarily prevent a guest from continuing.

React normalization does not:

* Establish that a code exists.
* Establish that an invitation is active.
* Authorize a form.
* Authorize an RSVP submission.

Express independently repeats the complete normalization process on every lookup and every submission.

The backend alone determines whether:

* The received value is well formed.
* The canonical code exists.
* The matching invitation configuration is active.
* The current request is otherwise authorized.

A prior successful lookup does not permit the backend to skip normalization or validation during submission.

### 7.2 Canonical Normalization Algorithm

Apply the following rules in this exact order:

1. Convert the received value to a string.
2. Remove leading and trailing whitespace.
3. Remove internal ordinary whitespace.
4. Remove hyphens.
5. Convert letters to uppercase.
6. Reject the value if any remaining character is outside `A–Z` or `0–9`.
7. Reject the value unless exactly six characters remain.
8. Use the six-character value as the canonical internal lookup key.
9. Derive the guest-facing display value by inserting a hyphen after the third character: `XXX-XXX`.

A rejected value has:

* No valid canonical lookup key; and
* No valid normalized guest-facing display code.

The interface must not present a partially normalized rejected value as though the value were accepted.

### 7.3 Canonical and Display Representations

The system distinguishes the following representations:

| Representation             | Synthetic example | Purpose                                                                                              |
| -------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------- |
| Guest-entered value        | `a1b c2d`         | Temporary untrusted user input.                                                                      |
| Canonical internal key     | `A1BC2D`          | Private backend lookup, uniqueness checking, configuration association, and submission revalidation. |
| Guest-facing display value | `A1B-C2D`         | Printed or on-screen presentation after successful normalization where display is appropriate.       |

The canonical internal key:

* Contains exactly six characters.
* Contains only uppercase `A–Z` and digits `0–9`.
* Contains no display hyphen.
* Is the value used for private invitation lookup and uniqueness checking.

The guest-facing display form:

* Is derived from the canonical key.
* Places one hyphen after the third character.
* Uses the form `XXX-XXX`.
* Is not a separate invitation identifier.

### 7.4 Accepted Presentation Variations

The normalization rules intentionally tolerate ordinary differences in how a guest may type the code printed on an invitation.

The following may normalize to the same canonical key:

* Uppercase or lowercase letters.
* The printed hyphen being present.
* The printed hyphen being omitted.
* Ordinary whitespace entered around or within the code.
* Leading or trailing whitespace.

Acceptance of a presentation variation does not mean the corresponding code exists.

Existence is checked only after authoritative server normalization succeeds.

### 7.5 Rejected Input

After the approved cleanup operations are complete, the value must contain exactly six characters drawn only from:

`A–Z`

and:

`0–9`

The value is malformed if:

* Fewer than six permitted characters remain.
* More than six permitted characters remain.
* An underscore remains.
* A slash remains.
* Other punctuation remains.
* Another non-alphanumeric character remains.
* No characters remain.
* The resulting value otherwise fails the six-character alphanumeric requirement.

Malformed input must not be repaired through character guessing.

### 7.6 No Fuzzy Matching or Character Guessing

Invitation-code normalization is deterministic.

The system must not use:

* Fuzzy matching.
* Close-match suggestions.
* “Did you mean?” code suggestions.
* Automatic substitution between visually similar letters and digits.
* Keyboard-layout correction.
* Character-by-character guessing.
* Partial-code lookup.
* Guest-name lookup as a substitute for the code.
* A guest directory.
* Code-recovery search that reveals invitation records.

For example, the application must not silently decide that a typed letter `O` should have been a digit `0`, or that a typed letter `I` should have been a digit `1`.

If authoritative normalization produces a well-formed six-character canonical value, the backend checks that exact value.

If it does not exist as an active invitation configuration, the browser receives the neutral invalid-code treatment rather than a suggested alternative.

### 7.7 Malformed, Unknown, and Inactive Codes

Invitation-code processing distinguishes internally among at least the following concepts:

* **Malformed:** The value fails the normalization-format requirements.
* **Unknown:** The normalized value is structurally valid but does not identify a matching active invitation configuration.
* **Inactive:** The normalized value exists in private configuration but is disabled for the current production environment.
* **Valid and active:** The normalized value identifies one active authorized invitation configuration.

Malformed, unknown, and inactive codes must not produce guest-facing wording that reveals which of those conditions occurred.

The guest-facing invalid-code experience remains neutral.

The API status-code contract is recorded in `rsvp-api-contract.md`.

### 7.8 Normative Synthetic Normalization Matrix

The following examples use the synthetic development-only value:

`A1B-C2D`

This value is documentation and testing material only. It must not be activated as a production invitation code.

| Received value  | Canonical key | Display value | Result   |
| --------------- | ------------- | ------------- | -------- |
| `A1B-C2D`       | `A1BC2D`      | `A1B-C2D`     | Accepted |
| `a1b-c2d`       | `A1BC2D`      | `A1B-C2D`     | Accepted |
| `A1BC2D`        | `A1BC2D`      | `A1B-C2D`     | Accepted |
| `a1b c2d`       | `A1BC2D`      | `A1B-C2D`     | Accepted |
| `A1B-C2D`       | `A1BC2D`      | `A1B-C2D`     | Accepted |
| `A 1 B - C 2 D` | `A1BC2D`      | `A1B-C2D`     | Accepted |
| `A1B_C2D`       | —             | —             | Rejected |
| `A1B/C2D`       | —             | —             | Rejected |
| `A1B-C2`        | —             | —             | Rejected |
| `A1B-C2D4`      | —             | —             | Rejected |
| Empty input     | —             | —             | Rejected |

These examples define expected observable behavior for both React and Express.

React and Express should be tested against the same normalization vectors so that client usability behavior does not diverge from authoritative server behavior.

### 7.9 Reference Pseudocode

The following language-neutral pseudocode defines the required normalization result.

Production client and server implementations may differ structurally, but their observable behavior must match this specification.

```text
function normalizeInvitationCode(receivedValue):
    value = String(receivedValue)

    value = trimLeadingAndTrailingWhitespace(value)

    value = removeInternalOrdinaryWhitespace(value)

    value = removeHyphens(value)

    value = uppercase(value)

    if value contains any character outside A-Z or 0-9:
        return invalid

    if length(value) is not exactly 6:
        return invalid

    return {
        canonicalCode: value,
        displayCode: firstThreeCharacters(value)
                     + "-"
                     + lastThreeCharacters(value)
    }
```

Express must run this process independently even when React submits a value that already appears canonical.

### 7.10 Runtime Validation Versus Historical Code Generation

The original invitation-code generation process used constraints beyond the runtime format requirement.

In particular, the historical generation process required a minimum number of letters.

That generation rule is not a runtime validation rule.

Runtime code validation determines only whether:

1. The received value normalizes successfully.
2. Exactly six permitted alphanumeric characters remain.
3. The resulting canonical value corresponds to an authorized active invitation configuration.

The application must not reject an otherwise valid configured code merely because it would not have satisfied a historical code-generation preference.

### 7.11 Production Import and Activation Validation

Before an invitation record may become an active production configuration, the private preparation process must:

1. Normalize the source invitation code using the same authoritative rules defined in this section.
2. Reject a malformed source code.
3. Confirm that the canonical key is exactly six uppercase alphanumeric characters.
4. Verify that no other production source record produces the same canonical key.
5. Reject any normalization collision.
6. Verify that the canonical key maps to exactly one invited-party configuration.
7. Keep the real source code, guest-account information, and code-to-party association in private backend-controlled project data.
8. Keep development and placeholder records isolated from active production records.

The reusable RSVP renderer and validator must not assume that the production record count is permanently fixed.

### 7.12 Production Source Capacity Reconciliation

For every production row, transformation proceeds deterministically:

1. Parse and trim the parallel comma-separated First Name(s) and Last Name(s) lists.
2. Require equal populated counts and create one `namedInvitees` record per paired name.
3. Parse explicit `Plus1` occurrences from Column E, including parenthesized ownership labels where supplied.
4. Create one `kind: "plus1"` allocation per occurrence with `maximumCount: 1`.
5. Parse `Kids(n)` when present.
6. Derive:

   `unnamedChildCapacity = maximumAttendance - namedInvitees.length - plus1Count`

7. If the residual is negative, reject the row.
8. If the residual is zero, create no grouped child allocation.
9. If the residual is positive, require source `Kids(n)` authorization.
10. Under the cleaned latest source, require the residual to equal `n`; a mismatch is contradictory source data.
11. Create exactly one `kind: "unnamedChildren"` allocation with `maximumCount: unnamedChildCapacity`.
12. Use the approved family prompt:
   `We'd love for your family to celebrate with us this Mayday - will your kid(s) be accompanying you?`
13. Require final capacity reconciliation:

   `namedInvitees.length + sum(additionalGuestAllocations.maximumCount) = maximumAttendance`

The transformer does not create one child allocation per possible child. It does not infer children from `maximumAttendance` without explicit source authorization.

A specifically named child remains in the paired name roster and is never duplicated into grouped unnamed-child capacity.

Reject mismatched name lists, malformed/ambiguous Plus1 ownership, malformed `Kids(n)`, duplicate or cross-type ids, unsupported allocation kinds/counts, or any contradictory final capacity.

### 7.13 Production Code-Set Audit

The current authoritative source audit requires:

* 57 active invitation records.
* 57 unique canonical invitation-code keys.
* 35 singular and 22 plural wording records.
* 23 invitation rows with at least one `Plus1`.
* 26 total Plus1 allocation objects.
* Two rows with multiple Plus1 allocations.
* 84 specifically named potential attendees.
* Two invitations with `Kids(n)`.
* Five total unnamed-child attendance-capacity slots.
* Two grouped `unnamedChildren` allocation objects.
* 28 total additional-allocation objects.
* 31 total additional-guest person-capacity slots.
* Combined maximum-attendance capacity of 115.
* No active production placeholder.

These are transformation-audit targets only. Reusable runtime behavior must not hard-code them.

## 8. Sole RSVP Access Method

### 8.1 Scope

This section is the controlling Phase 3 Step 3 specification for how an invited party reaches and unlocks the personalized RSVP form.

The access method is:

**Static QR to the public homepage, followed by manual invitation-code entry at `/wedding/rsvp/`.**

No invitation receives a unique browser route or a direct personalized RSVP link.

### 8.2 Canonical Access Sequence

The complete access sequence is:

```text
Printed invitation
 |
 +---- Static QR code
 |        |
 |        v
 |     https://www.loreweavercreations.com/wedding/
 |        |
 |        v
 |     Guest selects RSVP
 |        |
 |        v
 +----> /wedding/rsvp/
          |
          v
       Guest manually enters printed invitation code
          |
          v
       React performs usability cleanup and normalization
          |
          v
       React submits the code in a POST request body
          |
          v
       Browser remains at /wedding/rsvp/
          |
          v
       Express independently normalizes and validates
          |
          +---- Invalid or unknown
          |        |
          |        v
          |     Neutral guest-facing invalid-code state
          |
          +---- Valid and active
                   |
                   v
                Limited blank-form schema
                   |
                   v
                Blank personalized form remains
                at /wedding/rsvp/
```

This sequence does not create or reveal a personalized browser URL.

### 8.3 Static Invitation QR Code

All printed invitations use the same static QR destination:

`https://www.loreweavercreations.com/wedding/`

The static QR code is a navigation convenience only.

It must not:

* Contain an invitation code.
* Contain a party identifier.
* Contain an RSVP answer.
* Contain a confirmation destination.
* Encode a personalized route.
* Automatically perform invitation lookup.
* Automatically unlock a personalized RSVP form.

Scanning the QR code therefore gives the guest no personalized access by itself.

The guest must still select RSVP and manually enter the printed invitation code.

### 8.4 Manual Entry at `/wedding/rsvp/`

The sole personalized RSVP entry route is:

`/wedding/rsvp/`

The guest manually types the printed invitation code into the RSVP entry field.

Manual entry applies to:

* A first RSVP.
* A later revision.
* Access from another browser or device before the deadline.

The access method does not depend on a previously stored browser session, a personalized bookmark, or a code-bearing link.

### 8.5 Client Usability Cleanup

After the guest enters the code, React may perform the Phase 3 Step 2 normalization rules for usability.

This cleanup may make ordinary accepted presentation variations easier to process or display.

Client cleanup is not authorization.

React does not establish that:

* The normalized value exists.
* The corresponding invitation is active.
* The invited party is authorized.
* A personalized form may be displayed.

Express remains authoritative.

### 8.6 POST-Body Lookup

React submits the entered invitation code in the request body of the lookup request.

The lookup target is:

`POST /wedding/api/rsvp/lookup`

The invitation code must not be transferred through:

* A browser path segment.
* A query-string parameter.
* A URL fragment.

The lookup request, status semantics, and successful limited blank-form response are recorded in `rsvp-api-contract.md`.

Phase 3 Step 7 finalizes the successful lookup-response boundary. Phase 3 Step 14 now adds mandatory privacy/security response behavior, including no-store cache control, without expanding the permitted guest-facing data.

### 8.7 Browser URL Invariance

Submitting an invitation code does not change the browser to an invitation-specific route.

During:

* Code entry.
* Lookup in progress.
* Neutral invalid-code handling.
* Successful lookup.
* Blank personalized-form rendering.

the browser remains on:

`/wedding/rsvp/`

The application must not navigate to or construct routes such as:

`/wedding/rsvp/XXX-XXX`

or any equivalent route, query string, or fragment that carries the invitation code.

Successful validation changes application state, not the canonical RSVP browser route.

### 8.8 Independent Backend Normalization and Validation

The backend independently applies the complete Phase 3 Step 2 normalization process even when React has already cleaned or normalized the submitted value.

The backend then determines whether the canonical value identifies an authorized active invitation configuration.

A client-normalized value is never sufficient authorization.

A previously successful lookup also does not remove the requirement for submission-time normalization and revalidation.

### 8.9 Valid Lookup Result

A valid lookup returns the limited blank-form response required to render the spreadsheet-authoritative RSVP structure for only that invitation.

The response may contain reviewed party display/greeting text, wording mode, maximum attendance, the validated party's limited `namedInvitees` roster with stable opaque invitee identifiers and approved display information, authorized `additionalGuestAllocations` prompt definitions with stable opaque allocation identifiers, reusable question definitions, deadline/time-zone information, and enabled confirmation options.

It does not return stored answers, stored confirmation destinations, private source rows, unrelated invitation records, or an existing-response indicator.

### 8.10 Invalid or Unknown Lookup Result

When the invitation code is invalid or unknown, the guest receives the approved neutral invalid-code state.

The guest-facing result must not:

* Reveal whether another similar code exists.
* Suggest a close match.
* Reveal another invitation code.
* Reveal a guest or party identity.
* Reveal invitation-record counts.
* Reveal private source information.
* Create a code-bearing error URL.

The browser remains on `/wedding/rsvp/`, where the guest may correct the entered value and try again subject to applicable rate limits.

The API distinction among malformed, unknown, inactive, closed, rate-limited, and unavailable results is recorded in `rsvp-api-contract.md`.

### 8.11 No Direct Personalized Browser Link

The application and printed materials must not create, distribute, or rely on a direct personalized RSVP browser link.

Prohibited patterns include:

* `/wedding/rsvp/:inviteCode`
* `/wedding/rsvp/XXX-XXX`
* `/wedding/rsvp?inviteCode=XXX-XXX`
* `/wedding/rsvp/#XXX-XXX`
* Any equivalent path, query parameter, fragment, redirect target, QR destination, or browser-visible link carrying an invitation code.

The invitation code is an entered value handled inside the RSVP application, not a browser-route identifier.

### 8.12 Revision Access Uses the Same Method

A guest who wishes to revise a previously submitted RSVP does not receive a separate revision link.

Before the deadline, the guest:

1. Returns to `/wedding/rsvp/`.
2. Re-enters the printed invitation code manually.
3. Passes the same authoritative backend lookup process.
4. Receives the same blank personalized form behavior.
5. Submits only the fields intended to change together with the required operational confirmation information.

The existence of a stored RSVP does not change the access method and does not cause stored answers to be displayed during lookup.

### 8.13 Access-Method and Cross-Step Boundary

Phase 3 Step 3 establishes **how the guest reaches and unlocks the blank personalized form**.

The later completed steps now define the supporting data boundaries:

* Step 4 records the backend endpoint and status-code contract in `rsvp-api-contract.md`.
* Step 5 records the fictional invitation-configuration shape in `rsvp-example-configurations.json`.
* Step 6 records the reusable form-schema shape in `rsvp-example-form-schemas.json`.
* Step 7 records the exact successful limited blank-form response in `rsvp-api-contract.md` and this system-design document.

Step 8 now defines the exact submission and partial-revision payload structure, and Step 9 now defines the authoritative conditional and dependency rules.

Phase 3 Step 10 now defines the complete browser-facing interface-state model and synchronizes that model with `page-outlines.md` and `wireframes.md`.

Phase 3 Step 11 now defines the fictional development configuration registry and behavioral archetypes used to exercise the approved configuration, named-`Plus1` allocation, attendance, Reception-detail, decline, revision, confirmation, and idempotency model without using production guest data.

Phase 3 Step 12 now defines the preliminary RSVP test catalog in `rsvp-test-cases.md`, using the Step 11 development fixtures as the preferred test inputs.

Phase 3 Step 13 now finalizes the temporary successful-confirmation-state lifecycle and Confirmation Refresh Fallback behavior.

Phase 3 Step 14 now finalizes the privacy/security headers and caching rules, concrete initial production rate limits, logging requirements, credential safeguards, retention standard, and related security/privacy requirements recorded in Section 15.

---

## 9. Authoritative Storage and Delivery Order

The required ordering is:

```text
Validate complete resulting RSVP
 |
 v
Write new RSVP version
 |
 v
Update current-response record
 |
 v
Attempt protected administrative email
 |
 v
Attempt guest email or SMS
 |
 v
Record delivery results
 |
 v
Return guest-facing confirmation result
```

The critical boundary is:

**RSVP storage succeeds or fails independently of confirmation delivery.**

Once a valid RSVP has been successfully stored:

* Administrative delivery failure does not erase it.
* Guest delivery failure does not erase it.
* A delivery retry does not create another RSVP.
* A browser presentation problem does not erase it.
* A confirmation-page refresh does not itself create another RSVP.

---

## 10. Data That May and May Not Reach the Browser

### 10.1 Lookup May Return

After successful validation, lookup may return only the data needed to render that invitation's blank form:

* Reviewed party display name and greeting.
* Explicit singular/plural wording mode.
* `maximumAttendance`.
* Limited `namedInvitees` entries with stable opaque ids and approved display names.
* Authorized `additionalGuestAllocations` entries containing only:
  * `id`
  * `kind`
  * `prompt`
  * `maximumCount`
* Reusable question definitions and usability-validation metadata.
* RSVP deadline and authoritative time-zone display information.
* Enabled confirmation options and provider-neutral authorization metadata.

The browser may compute total additional-guest **capacity** by summing allocation `maximumCount`; it must not equate allocation-array length with person count.

The browser does not need the raw source row, raw `Kids(n)` text, private ownership mapping beyond approved prompts, or unrelated party mappings.

### 10.2 Lookup Must Not Return

Lookup must not return:

* Canonical production invitation code merely to echo it after validation.
* Other invitation codes.
* Another invitation's data.
* Complete spreadsheet rows.
* Raw `Kids(n)` source text.
* Private `partyId` or equivalent internal identifier.
* Protected active/environment state.
* Unrelated named-invitee or allocation mappings.
* Private administrative notes.
* Stored event attendance.
* Stored named-invitee responses.
* Stored additional-guest responses.
* Stored age totals or derived overall attendance.
* Stored attendee names or dietary/allergy text.
* Stored confirmation method/destination.
* Stored SMS authorization.
* Stored delivery status.
* RSVP versions/history.
* Existing-response indicators.
* Credentials, secrets, spreadsheet ids, or protected administrative destinations.

### 10.3 Submission Confirmation May Return

After successful storage, the limited response may return the complete current guest-facing RSVP needed by the temporary confirmation experience:

* Event-attendance/decline state.
* Every applicable named-invitee Yes/No response with approved display name.
* Every applicable Plus1 response with safe prompt metadata.
* Every applicable grouped child response, including the attending count when Yes.
* Four age-category totals and derived overall attendance when attending.
* Complete attendee names whenever attending.
* Supplied dietary/allergy values only when Reception is selected.
* Initial/revision action designation.
* Recorded timestamp.
* Selected guest confirmation method.
* Guest delivery status.
* Limited administrative-delivery status.
* Deadline, revision policy, and assistance information.

The confirmation response omits inapplicable data and never exposes the canonical invitation code, private record ids, raw source metadata, workbook details, full version history, provider credentials, or protected administrative address.

## 11. Failure and Uncertainty Principles

API status codes are recorded in `rsvp-api-contract.md`. Phase 3 Step 10 now maps these architectural failure and uncertainty principles into explicit browser-facing React states; the principles below remain authoritative for deciding which state is appropriate.

### 11.1 Malformed Invitation Code

If authoritative normalization fails:

* The request is not treated as a valid invitation lookup.
* No canonical invitation key exists for that request.
* The guest receives neutral invalid-code handling.
* The interface does not suggest a corrected code.

### 11.2 Unknown or Inactive Invitation Code

If a structurally valid canonical code does not identify an authorized active invitation configuration:

* The guest receives the same neutral invalid-code treatment used for malformed entry.
* The response does not reveal whether the code is unknown or inactive.
* The response does not reveal another valid code.

### 11.3 Invalid RSVP

Invalid, unauthorized, or contradictory RSVP data must be rejected before a new RSVP version is written.

### 11.4 Deadline Failure

The backend is authoritative for the RSVP deadline.

A client that displays an outdated state cannot force the backend to accept a late RSVP.

### 11.5 Duplicate Submission

A client-generated UUID-form `clientSubmissionId` is included so accidental repeated requests can be resolved without creating duplicate current responses or RSVP versions.

The normalized invitation plus `clientSubmissionId` identifies one logical submission for idempotency purposes.

A safe replay of the same materially identical logical request:

* Returns `200 OK` when the original logical submission was already stored successfully.
* Sets the successful response's `submission.idempotentRepeat` value to `true`.
* Preserves the original initial-versus-revision action designation.
* Does not write another RSVP version.
* Does not create duplicate delivery attempts merely because the HTTP request was repeated.

Reusing one identifier for materially different request content is invalid rather than a new revision.

A genuinely new RSVP action receives a new `clientSubmissionId`.

### 11.6 Delivery Failure

If storage succeeds but guest or administrative confirmation delivery fails:

* The RSVP remains successfully recorded.
* The failed delivery is recorded separately.
* The other applicable delivery attempt is not prevented solely by that failure.
* The browser receives a success state with the appropriate delivery warning rather than a false storage-failure result.

### 11.7 Uncertain Browser Outcome

A browser or network failure may leave the client temporarily unable to determine whether the server stored the submission.

The application must not encourage blind repeated submission in such a case.

For a safe retry of the same logical action:

* React preserves the original request content.
* React reuses the original `clientSubmissionId`.
* The backend applies the Step 8 idempotency rules.
* A previously stored logical submission returns an idempotent success rather than creating another version.

The client must not generate a new identifier merely because the first HTTP response was lost. A new identifier is reserved for a genuinely new RSVP action.

## 12. Phase 3 Step 10 — RSVP Interface State Model

### 12.1 Scope and Authority

React must represent the RSVP experience through explicit top-level interface states rather than allowing loading, error, submission, confirmation, and closed conditions to combine into contradictory browser presentations.

The state names in this section are authoritative as planning labels. Final React implementation may use any equivalent internal representation, but it must preserve the same observable states and transition rules.

The state model governs two canonical browser routes:

* `/wedding/rsvp/` — entry, lookup, validated blank form, validation, submission, uncertainty, service-unavailable, and closed states.
* `/wedding/rsvp/confirmation` — successful initial submission, successful revision, stored-with-delivery-warning, and confirmation-refresh-fallback states.

No state creates an invitation-specific browser route. Invitation codes remain absent from paths, query strings, fragments, metadata, analytics, and referrer data.

The thirteen top-level states are:

1. Entry Ready.
2. Looking Up Invitation.
3. Invalid Invitation.
4. Service Unavailable.
5. Validated Blank Form.
6. Validation Failure.
7. Submitting.
8. Submission Uncertain.
9. Confirmed Initial Submission.
10. Confirmed Revision.
11. Stored with Delivery Warning.
12. Confirmation Refresh Fallback.
13. RSVP Closed.

Named-`Plus1` allocation variants, attendance-capacity variants, conditional Reception-detail rendering, countdown visibility, field-level errors, guest-versus-administrative delivery-warning categories, and responsive layouts are **substates or presentation variants** within these thirteen states. They do not create additional top-level RSVP states.

### 12.2 Canonical State Matrix

| State | Canonical route | Primary entry condition | Required browser result |
|---|---|---|---|
| 1 — Entry Ready | `/wedding/rsvp/` | RSVP is open and no lookup is in progress | Manual code field, written deadline, conditional countdown, printed alternative, privacy notice, assistance |
| 2 — Looking Up Invitation | `/wedding/rsvp/` | Guest submits a code for lookup | Progress announced; repeated lookup prevented; code remains out of URL |
| 3 — Invalid Invitation | `/wedding/rsvp/` | Lookup determines malformed, unknown, or inactive code using guest-neutral handling | Neutral error; editable entered value; no invitation-information disclosure |
| 4 — Service Unavailable | `/wedding/rsvp/` | Backend or dependency explicitly reports that lookup or submission cannot proceed and successful RSVP storage has not been established | Guest-safe unavailable message; assistance; no claim of storage |
| 5 — Validated Blank Form | `/wedding/rsvp/` | Valid active invitation lookup returns the limited blank-form schema | Personalized greeting and applicable blank questions; no stored answers or destinations; initial/revision instructions |
| 6 — Validation Failure | `/wedding/rsvp/` | Client usability validation or backend submission validation rejects the current attempted values without storing a new version | Error summary and field messages; current page-entered values preserved; accessible focus management |
| 7 — Submitting | `/wedding/rsvp/` | A logical RSVP submission begins | Submit disabled; progress announced; duplicate action prevented; logical request and `clientSubmissionId` retained |
| 8 — Submission Uncertain | `/wedding/rsvp/` | Browser loses or cannot interpret the result and cannot determine whether storage succeeded | Uncertainty explained; blind resubmission discouraged; safe retry/recovery path preserves original logical request identifier |
| 9 — Confirmed Initial Submission | `/wedding/rsvp/confirmation` | Backend proves a new initial RSVP was stored and no delivery warning is required | Success heading; complete current RSVP; initial designation; delivery status; revision guidance |
| 10 — Confirmed Revision | `/wedding/rsvp/confirmation` | Backend proves a revision was stored and no delivery warning is required | Success heading; complete merged RSVP; revision designation; new timestamp; delivery status |
| 11 — Stored with Delivery Warning | `/wedding/rsvp/confirmation` | Backend proves storage succeeded but guest delivery, administrative delivery, or both failed or remain uncertain | Storage success remains explicit; complete current RSVP shown; delivery warning identified safely; no resubmission instruction |
| 12 — Confirmation Refresh Fallback | `/wedding/rsvp/confirmation` | Confirmation route loads without the temporary successful-submission state needed to reconstruct the summary | Explain that summary is unavailable and RSVP may already have been recorded; direct guest to selected channel, RSVP entry, or assistance |
| 13 — RSVP Closed | `/wedding/rsvp/` | Backend-authoritative deadline has passed or lookup/submission receives the authoritative closed result | No editable lookup or RSVP form; deadline and assistance information; no personalized data exposure |

### 12.3 State 1 — Entry Ready

Entry Ready is the normal interactive starting state while online RSVP remains open.

Required behavior:

* Display a manually editable invitation-code field with a visible label.
* Display the example presentation format `XXX-XXX` without exposing a real invitation code.
* Display the written deadline at all times while the entry state is available.
* Display the live countdown only from February 1, 2027 at 12:00 a.m. EST through the deadline window established by the approved requirements.
* Provide the printed RSVP alternative, concise privacy notice, Privacy-page link, and `RSVPhelp@loreweavercreations.com` assistance information.
* Permit the guest to submit a lookup request only when client usability checks allow the request to be attempted.
* Treat client-side normalization as a convenience only; Express remains authoritative.

The primary transition from Entry Ready is to Looking Up Invitation when the guest activates Continue.

If the backend or centralized deadline state establishes that online RSVP is closed, the interface transitions to RSVP Closed rather than permitting a lookup.

### 12.4 State 2 — Looking Up Invitation

Looking Up Invitation begins after the guest initiates a lookup and ends only when the lookup has a usable outcome.

Required behavior:

* Announce progress through an accessible status mechanism.
* Disable or otherwise protect the lookup action against repeated activation.
* Keep the invitation code out of the browser URL and page metadata.
* Avoid revealing private invitation, workbook, provider, or backend details while the request is pending.
* Preserve the guest-entered code locally only as necessary to complete the current interaction or permit correction after a neutral invalid result.

Permitted outcomes are:

* Validated Blank Form for a valid active invitation.
* Invalid Invitation for guest-neutral malformed, unknown, or inactive handling.
* RSVP Closed for an authoritative closed-RSVP result.
* Service Unavailable for an explicitly known lookup-service failure.

A lookup request is not a submission and does not create Submission Uncertain.

### 12.5 State 3 — Invalid Invitation

Invalid Invitation represents the guest-facing result for malformed, unknown, or inactive invitation codes when the system can determine that no valid invitation form was unlocked.

Required behavior:

* Use the approved neutral invalid-code wording.
* Keep the entered value editable so the guest can correct it.
* Provide the generic `XXX-XXX` example, printed alternative, and assistance information.
* Do not reveal whether the internal cause was malformed, unknown, or inactive.
* Do not provide close matches, character guesses, named-party information, record counts, spreadsheet information, or another valid invitation code.

A corrected lookup transitions to Looking Up Invitation.

### 12.6 State 4 — Service Unavailable

Service Unavailable is used only when the application has affirmative evidence that the required lookup or submission service cannot complete the requested operation **and successful RSVP storage has not been established**.

Required behavior:

* Use guest-safe wording with no stack trace, workbook name, server path, provider detail, or credential information.
* Provide assistance and the printed RSVP alternative where relevant.
* Do not state or imply that an RSVP was recorded unless the backend has positively confirmed storage.
* Preserve the guest's current page-entered values in memory where practical if the unavailable condition occurred before a submission was accepted, so that a later retry does not unnecessarily destroy user work.

A known pre-storage failure is different from Submission Uncertain. If the browser cannot determine whether storage occurred, the interface must use Submission Uncertain rather than Service Unavailable.

### 12.7 State 5 — Validated Blank Form

**Route:** `/wedding/rsvp/`

**Entered when:** Lookup successfully validates one active invitation.

**Visible responsibilities:**

* Display the reviewed party heading/greeting and applicable singular/plural wording.
* Render the blank coordinated Ceremony / Reception / decline interface.
* Render one blank Yes/No attendance question per authorized named invitee.
* Render one blank Yes/No control per authorized `plus1` allocation.
* For an authorized `unnamedChildren` allocation, render the single approved family-level Yes/No question.
* Keep the grouped child count selector hidden/inapplicable while No or unanswered.
* When grouped children are answered Yes, reveal a required dropdown with values 1 through the allocation's `maximumCount`.
* Derive provisional attendance from named-invitee Yes responses, Plus1 Yes responses, and the grouped selected child count.
* Render four age-category dials at zero and constrain them against that derived count.
* Render exactly that many blank `Attendee Details` rows for every attending event combination.
* Require `Attendee name` in each row and show `Dietary or allergy information` only while Reception is selected.
* Render applicable blank operational confirmation controls.
* Display party-capacity/current-attendance guidance without implying `maximumAttendance` is separately chosen.
* Display no stored answers, contact destinations, response version, or existing-response indicator.

The same State 5 serves both potential initial submissions and revisions. The browser does not know which until the backend processes submission.

### 12.8 State 6 — Validation Failure

Validation Failure means the current attempted values were rejected and no new RSVP version was created for that rejected attempt.

The state may result from:

* Client-side usability validation before the request is sent; or
* Guest-safe field/form errors returned by authoritative backend validation before storage.

Required behavior:

* Present a form-level error summary.
* Associate field-level errors with the relevant controls.
* Move focus to the summary or first invalid control where appropriate.
* Preserve the guest's current page-entered values, including valid values, so correction does not require rebuilding the form.
* Keep the same limited invitation schema; do not reload stored RSVP answers to explain the error.
* Never claim that the rejected attempt was stored.
* Never reveal omitted stored revision values through an error response.

When the guest corrects the values, the interface may remain visually in the validation-failure form until the errors are resolved. A subsequent logical submission transitions to Submitting.

### 12.9 State 7 — Submitting

Submitting begins when React sends one logical RSVP request to `POST /wedding/api/rsvp/submit`.

Required behavior:

* Disable or otherwise protect the Submit RSVP action against repeated activation.
* Announce that the RSVP is being processed.
* Preserve the full logical request in memory until a definitive outcome or a safe-retry decision is reached.
* Preserve the generated `clientSubmissionId` for that logical request.
* Do not clear the form or show a confirmation before the backend proves successful storage.
* Do not generate a second `clientSubmissionId` merely because the request takes longer than expected.

Definitive outcomes may transition to:

* Confirmed Initial Submission.
* Confirmed Revision.
* Stored with Delivery Warning.
* Validation Failure.
* Service Unavailable when the server explicitly establishes a pre-storage/core-service failure.
* RSVP Closed when the backend authoritatively rejects the submission because the deadline has passed.

If the browser loses the response or otherwise cannot determine the storage outcome, transition to Submission Uncertain.

### 12.10 State 8 — Submission Uncertain

Submission Uncertain exists specifically to prevent an ambiguous network outcome from becoming duplicate attendance.

Required behavior:

* State that the browser cannot currently confirm whether the RSVP was recorded.
* Do not claim success.
* Do not claim failure.
* Do not advise blind repeated submission.
* Preserve the original logical request and its `clientSubmissionId` while the browser session can safely do so.
* Offer the approved safe verification, retry, or assistance path.
* Direct the guest to check the selected confirmation channel when that may help establish the outcome.

If the same logical request is retried, React must reuse the original request content and `clientSubmissionId`. The backend then applies idempotency rules so a previously stored request returns the existing success result rather than creating another version.

A safe retry may resolve to any definitive result appropriate to the original request, including Confirmed Initial Submission, Confirmed Revision, Stored with Delivery Warning, Validation Failure, Service Unavailable, or RSVP Closed.

The interface must not silently convert an uncertain result into a new logical revision by generating a fresh submission identifier.

### 12.11 State 9 — Confirmed Initial Submission

Confirmed Initial Submission begins only after the backend proves that an initial RSVP was stored successfully and the returned delivery statuses do not require the Step 10 warning state.

Required behavior:

* Navigate to `/wedding/rsvp/confirmation` using temporary state rather than URL parameters.
* State clearly that the RSVP was recorded.
* Identify the action as an initial submission.
* Display the complete current guest-facing RSVP for the spreadsheet-authoritative resulting state.
* Display the authoritative submission timestamp.
* Display the selected guest confirmation method and guest-safe delivery status.
* Display limited administrative-delivery status where appropriate without exposing the administrative address.
* Provide revision instructions that return the guest to manual code entry at `/wedding/rsvp/` before the deadline.
* Provide assistance information.

If the deadline has already passed by the time the guest reads the confirmation, the recorded success remains visible; only the availability of another online revision changes.

### 12.12 State 10 — Confirmed Revision

Confirmed Revision begins only after the backend proves that a revision was stored successfully and the returned delivery statuses do not require the Step 10 warning state.

Required behavior is the same as the successful initial-confirmation state except that the page must:

* Identify the action as a revision.
* Display the complete merged current RSVP rather than only the changed fields.
* Display the new authoritative submission/revision timestamp.
* Avoid revealing superseded stored values or private version identifiers.

The confirmation must make clear that the revision—not merely the changed fields—now represents the current RSVP.

### 12.13 State 11 — Stored with Delivery Warning

Stored with Delivery Warning begins only when the backend positively confirms RSVP storage but one or both confirmation-delivery categories failed or remain uncertain.

Required behavior:

* State prominently that the RSVP **was recorded**.
* Preserve the initial-versus-revision designation returned by the backend.
* Display the complete current guest-facing RSVP exactly as an ordinary successful confirmation would.
* Identify whether the warning concerns guest confirmation, protected administrative confirmation, or both using guest-safe language.
* Do not expose provider internals, private administrative addresses, credentials, or debugging information.
* Do not instruct the guest to resubmit the RSVP because delivery failed.
* Provide assistance where guest action may be useful.

A delivery warning does not create a new RSVP version and does not convert successful storage into a submission failure.

### 12.14 State 12 — Confirmation Refresh Fallback

Confirmation Refresh Fallback appears whenever `/wedding/rsvp/confirmation` loads without a structurally usable temporary successful-submission response. This includes a direct visit, bookmark/open-in-new-tab visit, or refresh/history event for which the temporary response is no longer available.

The mere fact that a refresh occurred does not force State 12 if the implementation still has the valid temporary successful response. When that response remains available, React continues to render the appropriate State 9, 10, or 11. When it does not, React must not pretend to know the prior storage result.

#### Final guest-facing fallback copy

**Heading:** `Confirmation Summary No Longer Available`

**Body:**

> The temporary on-screen RSVP summary is no longer available. If you submitted an RSVP, it may already have been recorded. Please check the email or text message you selected for confirmation. Do not submit the same response again only because this summary is unavailable.

**Revision guidance:**

> To make a deliberate revision, return to the RSVP page and enter your invitation code again.

**Assistance:**

> If you are unsure whether your RSVP was recorded or need help, contact RSVPhelp@loreweavercreations.com.

**Primary actions:**

* `Return to RSVP` → `/wedding/rsvp/`
* `Contact for Help` → the approved RSVP assistance method using `RSVPhelp@loreweavercreations.com`

Required behavior:

* Do not state that the RSVP succeeded.
* Do not state that the RSVP failed.
* Do not claim to know whether an email or text message was actually sent because the temporary response containing delivery status is unavailable.
* Do not automatically perform invitation lookup.
* Do not automatically replay or resubmit the prior RSVP request.
* Do not generate a new `clientSubmissionId` merely because the confirmation summary was lost.
* Do not reconstruct the prior RSVP from browser history, URL data, analytics data, or other public client-visible sources.
* Do not place summary data, invitation codes, confirmation destinations, or other personalized values into the URL merely to survive refresh.
* Do not require a short-lived confirmation token or a new public confirmation-recovery endpoint for the initial implementation.
* The `Return to RSVP` action begins a deliberate new manual-entry interaction. If the backend-authoritative deadline has passed, that route will present State 13 rather than allowing another online submission.
* Provide the approved assistance information without exposing protected administrative addresses or provider internals.
* Move focus to, or otherwise announce, the fallback heading/message when State 12 replaces a prior confirmation experience so keyboard and assistive-technology users understand that the summary is unavailable.
* Keep both recovery actions keyboard- and touch-operable.
* Do not use a timed automatic redirect; the guest chooses whether to return to RSVP or seek assistance.

### 12.15 State 13 — RSVP Closed

RSVP Closed replaces online code-entry and editable RSVP-form states at and after the backend-authoritative deadline.

Required behavior:

* Display that online initial submissions and revisions are closed.
* Display the approved deadline.
* Remove or disable invitation lookup and RSVP submission controls.
* Remove the live countdown.
* Provide assistance instructions for late corrections or exceptional circumstances.
* Do not expose personalized information merely because a guest previously used the RSVP system in the same browser session.

The closed state does **not** erase or invalidate a success response that was already stored before the deadline. A guest who has proof of successful storage may still see the appropriate confirmation state; the closed rule governs whether another online lookup or submission may be initiated.

### 12.16 Transition and Precedence Rules

The React implementation must preserve the following transition rules:

1. **One top-level RSVP state at a time.** Presentation variants may exist within a state, but the application must not simultaneously render contradictory top-level conditions such as both submitting and confirmed.
2. **Backend success outranks local assumptions.** If the backend proves storage succeeded, React must enter State 9, 10, or 11 even if a local timer has just crossed the deadline.
3. **Backend deadline enforcement outranks the client countdown.** A `410` or equivalent authoritative closed result transitions to State 13.
4. **Known failure and uncertain outcome are distinct.** State 4 requires affirmative knowledge that successful storage was not established; ambiguous post-request outcomes use State 8.
5. **Validation failure is non-destructive.** State 6 preserves the guest's current page-entered values and limited authorized schema.
6. **Submitting retains idempotency context.** State 7 retains the logical request and `clientSubmissionId` until a definitive result is known.
7. **Uncertain retry is the same logical action.** State 8 reuses the same identifier and materially identical request content.
8. **Successful confirmation is complete.** States 9–11 display the complete current guest-facing RSVP, not merely changed revision fields.
9. **Delivery failure does not return to editable submission.** Once storage succeeded, a delivery problem produces State 11 rather than State 4, 6, 7, or 8.
10. **Confirmation rendering depends on usable temporary success state.** If a valid temporary successful response remains available, React may continue to display State 9, 10, or 11. If it is absent or unusable, State 12 uses uncertainty-safe wording and does not infer storage.
11. **Closed state blocks new online changes but not historical success display.** State 13 prevents new lookup/submission interaction while allowing an already established confirmation to remain truthful.

### 12.17 Client-Side Transient Data Rules

React may hold current-page transient values required to render and submit the guest's interaction, including:

* The manually entered invitation code while the RSVP interaction is active.
* Limited invitation configuration returned by lookup.
* Authorized named-invitee roster entries and `Plus1` prompt definitions.
* Current unsaved authorized attendance responses.
* Current unsaved age-category totals.
* The current provisionally derived overall attendance value.
* Current unsaved `Attendee Details` rows, including dietary/allergy values only when Reception is selected.
* Current operational confirmation data.
* One `clientSubmissionId` for the current logical submission.
* A limited successful submission response used to render State 9, 10, or 11.

The initial design does not persist successful RSVP state solely to make the confirmation page survive refresh. It also does not cache or reconstruct previously stored RSVP answers for form prefilling.

Transient browser state must be discarded when no longer needed and must never be encoded into personalized URLs.

### 12.18 Accessibility and Status Announcement Rules

Every state change that materially affects the guest must be perceivable without relying on color, animation, or visual placement alone.

At minimum:

* Lookup, submission, and other progress states are announced programmatically.
* Validation errors provide a textual summary and associated field messages.
* Focus is moved or managed intentionally when a validation summary, major error, confirmation, warning, or closed state replaces the prior interaction.
* Loading and submitting controls remain unavailable to accidental repeated activation while preserving keyboard and touch usability.
* Success, warning, uncertainty, and closed messages use explicit text rather than icon-only meaning.
* Reduced-motion preferences are respected by any progress or transition animation used later.

### 12.19 Cross-Document Browser Mapping

`page-outlines.md` defines the browser-facing responsibilities of these states, and `wireframes.md` defines their mobile-first information order.

The Step 10 mapping is:

| Step 10 state | Page-outline responsibility | Wireframe location |
|---|---|---|
| 1 — Entry Ready | RSVP Entry State | 2A and 2B |
| 2 — Looking Up Invitation | RSVP Lookup-in-Progress State | 2C |
| 3 — Invalid Invitation | Invalid-Code State | 2D |
| 4 — Service Unavailable | RSVP Service-Unavailable State | 2E |
| 5 — Validated Blank Form | Validated Blank-Form State | 3A–3E |
| 6 — Validation Failure | Validation-Failure State | 3F |
| 7 — Submitting | Submission-in-Progress State | 3G |
| 8 — Submission Uncertain | Submission-Uncertain State | 3H |
| 9 — Confirmed Initial Submission | RSVP Confirmation — initial variant | 4A–4B |
| 10 — Confirmed Revision | RSVP Confirmation — revision variant | 4C |
| 11 — Stored with Delivery Warning | RSVP Confirmation — delivery-warning variant | 4D–4E |
| 12 — Confirmation Refresh Fallback | RSVP Confirmation — refresh-without-state variant | 4F |
| 13 — RSVP Closed | Closed-RSVP State | 2F |

The two supporting documents may organize states by route or page layout rather than numerical order, but they must preserve this one-to-one conceptual mapping.

---

## 13. Phase 3 Step 11 — Fictional Development Archetypes

The development fixture registry remains deliberately fictional and isolated from production invitation data. The synthetic `DEVxxx` code family is used only for development/testing examples and must never be authorized as production invitation data.

### 13.1 Development-Only Constraints

Development fixtures must:

* Use obviously synthetic codes and fictional names.
* Use stable opaque fictional invitee/allocation ids.
* Be marked for development/test use only.
* Exercise the same structural rules as production configurations.
* Satisfy:
  `namedInvitees.length + sum(additionalGuestAllocations.maximumCount) = maximumAttendance`
* Include at least one inactive fixture.

### 13.2 Configuration Fixtures Versus Behavioral Scenarios

Stable invitation configuration includes:

* Wording mode.
* Maximum attendance.
* Authorized named-invitee roster.
* Authorized additional-guest allocation definitions, including `kind` and `maximumCount`.
* Active/environment state.

Event attendance, named-invitee responses, Plus1 responses, grouped child responses/counts, age totals, attendee details, stored-response state, delivery outcomes, and idempotency outcomes are behavioral scenario overlays.

### 13.3 Compatibility with Form-Schema Examples

`rsvp-example-configurations.json` and `rsvp-example-form-schemas.json` must use the same grouped-child vocabulary and response rules.

The active architecture contains no production-style `questionProfile` or reduced-profile fixture.

### 13.4 Development Configuration Registry

Retain the existing fictional canonical code set where practical.

For grouped-child coverage, `DEV002` becomes the primary grouped-child fixture while preserving `maximumAttendance: 5`:

| Fixture | Primary purpose | Wording | Maximum | Named invitees | Plus1 objects | Grouped child objects | Grouped child capacity | Active |
|---|---|---|---:|---:|---:|---:|---:|---:|
| `DEV001` | Singular, no additional guest | singular | 1 | 1 | 0 | 0 | 0 | Yes |
| `DEV002` | Plural household with grouped unnamed children | plural | 5 | 3 | 0 | 1 | 2 | Yes |
| `DEV003` | Singular, one Plus1 | singular | 2 | 1 | 1 | 0 | 0 | Yes |
| `DEV004` | Plural, one Plus1 | plural | 4 | 3 | 1 | 0 | 0 | Yes |
| `DEV005` | Ceremony scenario base | plural | 4 | 4 | 0 | 0 | 0 | Yes |
| `DEV006` | Reception scenario base | singular | 2 | 1 | 1 | 0 | 0 | Yes |
| `DEV007` | Combined-attendance base | plural | 3 | 3 | 0 | 0 | 0 | Yes |
| `DEV008` | Existing-response revision base | plural | 3 | 3 | 0 | 0 | 0 | Yes |
| `DEV009` | Multiple Plus1 allocations | plural | 7 | 4 | 3 | 0 | 0 | Yes |
| `DEV010` | Capacity/composition boundary | plural | 4 | 3 | 1 | 0 | 0 | Yes |
| `DEV999` | Disabled guard | plural | 2 | 1 | 1 | 0 | 0 | No |

The precise fictional names and ids are controlled by the example configuration JSON.

### 13.5 Archetype A — Singular, No Additional Guest

Exercise singular wording, one named invitee, no allocations, derived attendance 1 when attending, exact age-total equality, and one attendee-detail row.

### 13.6 Archetype B — Plural Household with Grouped Unnamed Children

Purpose:

* Exercise plural wording.
* Exercise three named invitees plus one grouped `unnamedChildren` allocation with `maximumCount: 2`.
* Confirm only one child Yes/No question is rendered.
* Confirm the approved family-level prompt is used.
* Confirm No produces count 0 and hides the selector.
* Confirm Yes reveals a dropdown containing exactly 1 and 2.
* Confirm Yes/count 1 and Yes/count 2 both derive correct attendance.
* Confirm count 3 is rejected.
* Confirm one attendee-detail row is required per attending child and their actual names are collected only there.
* Confirm grouped child response/count changes require complete attendee-detail replacement.

### 13.7 Archetype C — Singular, One Named `Plus1` Allocation

Exercise one named invitee and one `plus1` allocation, separate opaque ids, one Yes/No prompt, and later attendee-name collection for an attending Plus1.

### 13.8 Archetype D — Plural, One Named `Plus1` Allocation

Exercise plural wording with three named invitees and one `plus1`, including mixed named-invitee attendance.

### 13.9 Archetype E — Ceremony Only

Exercise Ceremony-only attendance, complete authorized responses, derived attendance, exact age totals, attendee names, and no dietary/allergy values.

### 13.10 Archetype F — Reception Only

Exercise Reception-only attendance, positive derived count, exact age totals, complete attendee details, and optional dietary/allergy values.

### 13.11 Archetype G — Entire Party Declines

Exercise full decline and absence of named-invitee responses, additional-guest responses, age totals, derived attendance, and attendee details while operational confirmation remains required.

### 13.12 Archetype H — Existing Response Revision

Prove blank lookup plus private merge behavior, omission semantics, explicit numeric zero, named-invitee/Plus1 replacement, grouped-child response/count replacement where applicable, Reception removal dietary clearing, and mandatory complete attendee-detail replacement after composition change.

### 13.13 Archetype I — Multiple Named `Plus1` Allocations

Exercise several independent one-person Plus1 allocations. Confirm they remain separate Yes/No controls rather than becoming an aggregate count control.

### 13.14 Archetype J — Capacity and Composition Boundary

Exercise:

* `namedInvitees.length + sum(additionalGuestAllocations.maximumCount) = maximumAttendance`.
* Derived attendance from all authorized response types.
* Rejection above authorized grouped-child maximum.
* Exact age-total equality.
* Exact attendee-detail cardinality.
* Same-count composition replacement.
* Name/dietary length limits.

### 13.15 Disabled Development Guard Fixture

`DEV999` remains inactive and is treated neutrally as invalid/not-found.

### 13.16 Confirmation-Channel Scenario Overlay

Run applicable fixtures with Email and, only where intentionally enabled, Text Message confirmation.

### 13.17 Delivery-Warning Scenario Overlay

After successful storage, independently simulate guest/admin delivery failure or uncertainty. Storage remains successful and no extra RSVP version is created merely because delivery failed.

### 13.18 Idempotent Safe-Retry Scenario Overlay

Repeat the same logical request with the same `clientSubmissionId` and materially identical content. Confirm no duplicate logical RSVP/version/delivery workflow.

### 13.19 Initial-versus-Revision Determination Across Archetypes

The backend determines initial versus revision from private stored state after authorization and idempotency checks.

### 13.20 Production Isolation

Development fixtures and scenarios remain isolated from production codes and identities.

### 13.21 Step 11 Cross-Document Boundary

Development fixture/schema examples are development authorities only. Production transformation independently proves the governing capacity invariant before activation.

## 14. Phase 3 Step 13 — Finalized Confirmation Refresh Behavior

Phase 3 Step 13 finalizes how the browser handles the temporary successful-submission response after React has received authoritative proof that an RSVP was stored.

Step 13 does not change the RSVP storage model, lookup model, submission payload, idempotency rules, dependency rules, or successful response envelope. It defines the lifecycle and loss behavior of the already-approved successful response while it is being used by `/wedding/rsvp/confirmation`.

### 14.1 Source of Confirmation State

The only ordinary source of a successful on-screen confirmation is the successful response returned by `POST /wedding/api/rsvp/submit` after backend storage and the applicable delivery attempts.

That successful response contains exactly the five Step 8 top-level properties:

1. `submission`
2. `invitation`
3. `rsvp`
4. `confirmation`
5. `revisionPolicy`

React passes that limited response into temporary navigation/application state when navigating to:

`/wedding/rsvp/confirmation`

The confirmation route does not need and must not receive the original submission request body merely to display the successful result. In particular, the temporary confirmation summary does not require the invitation code, `clientSubmissionId`, guest email address, guest mobile number, SMS-authorization content, private RSVP version, or protected administrative destination because those values are already excluded from the approved public success response.

### 14.2 Successful-State Eligibility

The confirmation route may render a successful State 9, 10, or 11 only when the temporary response is structurally usable as the approved successful response and reports:

`submission.recorded: true`

The browser uses the response content to select the visible state:

* `submission.action: "initial"` with no delivery warning → State 9 — Confirmed Initial Submission.
* `submission.action: "revision"` with no delivery warning → State 10 — Confirmed Revision.
* Either action with `confirmation.deliveryWarning: true` → State 11 — Stored with Delivery Warning, while preserving the initial-versus-revision designation inside the confirmation.

An idempotent successful replay may return HTTP `200` while preserving `submission.action: "initial"`. The frontend therefore must not select State 10 merely because the HTTP status was `200`.

### 14.3 Refresh and History Behavior

The browser must not rely on temporary confirmation state surviving a full page reload.

Step 13 does not require the application to force-discard valid temporary state solely because a reload or history traversal occurred. Instead:

* If the structurally usable successful response is still available, continue to render the applicable State 9, 10, or 11.
* If the successful response is absent or unusable, render State 12 — Confirmation Refresh Fallback.

This rule also applies to direct navigation, bookmarks, opening the confirmation route in a new tab, or returning to a history entry whose temporary successful response is unavailable.

The application does not attempt to determine *why* the state is absent before entering State 12.

### 14.4 No Automatic Recovery Mutation

State 12 is a presentation and recovery-guidance state, not a submission mechanism.

When temporary confirmation state is unavailable, the browser must not automatically:

* Repeat `POST /wedding/api/rsvp/submit`.
* Repeat `POST /wedding/api/rsvp/lookup`.
* Generate a new `clientSubmissionId`.
* Use a previously retained `clientSubmissionId` to replay a request without an explicit safe-retry workflow from State 8.
* Request or reconstruct a saved RSVP through an undocumented public endpoint.
* Infer success from having reached `/wedding/rsvp/confirmation`.
* Infer failure from the absence of temporary state.

The State 8 safe-retry mechanism remains the correct place for idempotent replay when a submission result is genuinely uncertain during the submission interaction. State 12 does not silently convert itself into State 8.

### 14.5 No Confirmation-Recovery Token in the Initial Implementation

The initial implementation requires no short-lived confirmation token and no separate public confirmation-recovery endpoint.

Step 13 therefore does not add:

* A confirmation token in the route path.
* A confirmation token in a query string or fragment.
* A public `GET` endpoint for retrieving the just-submitted RSVP.
* A public saved-RSVP view endpoint.
* A code-bearing confirmation URL.

If later implementation testing identifies a concrete need for recoverable confirmation summaries, that change requires a new recorded decision and coordinated revisions to this document, `rsvp-api-contract.md`, route/privacy documentation, and the test catalog before implementation.

### 14.6 Temporary-State Storage Boundary

The initial design uses temporary React navigation/application state. It does not require writing the successful RSVP response to persistent browser storage solely so that the summary can be reconstructed later.

Specifically, Step 13 does not require persistence in:

* `localStorage`.
* `sessionStorage`.
* IndexedDB.
* Cookies.
* URL parameters or fragments.
* A newly created backend token record.

This section defines the confirmation lifecycle only. The final cache-control, logging, retention, credential, and broader privacy/security requirements are established separately by Phase 3 Step 14 in Section 15.

### 14.7 Final State 12 Copy

The approved State 12 guest-facing copy is:

**Heading**

> Confirmation Summary No Longer Available

**Primary explanation**

> The temporary on-screen RSVP summary is no longer available. If you submitted an RSVP, it may already have been recorded. Please check the email or text message you selected for confirmation. Do not submit the same response again only because this summary is unavailable.

**Revision guidance**

> To make a deliberate revision, return to the RSVP page and enter your invitation code again.

**Assistance**

> If you are unsure whether your RSVP was recorded or need help, contact RSVPhelp@loreweavercreations.com.

The primary actions are:

* `Return to RSVP` — navigates to `/wedding/rsvp/`.
* `Contact for Help` — exposes the approved RSVP assistance method using `RSVPhelp@loreweavercreations.com`.

The copy may receive minor punctuation or responsive line-wrap changes during implementation, but its substantive meaning must not change without a later recorded decision.

### 14.8 State 12 Route and Deadline Interaction

`Return to RSVP` begins a deliberate new manual-entry interaction. It is not an automatic replay of the response whose temporary summary was lost.

If online RSVP remains open, the guest may use the normal manual-entry flow for a deliberate revision or other intended action.

If the backend-authoritative deadline has passed, `/wedding/rsvp/` enters State 13 — RSVP Closed and does not permit another online lookup/submission merely because the guest arrived from the fallback.

State 12 itself does not need to reconstruct the lost `revisionPolicy` object to decide this. The ordinary RSVP route and backend deadline authority remain controlling.

### 14.9 Accessibility Behavior

When State 12 replaces a successful-confirmation display or is rendered on direct confirmation-route load:

* The fallback heading or primary explanatory region must receive appropriate focus or programmatic announcement so the change is perceivable.
* The explanation, revision guidance, and assistance information must remain text-based and understandable without color or icons.
* `Return to RSVP` and `Contact for Help` must remain keyboard- and touch-operable.
* Focus must not be obscured by the sticky header.
* The page must not use a timed automatic redirect that removes the guest's opportunity to read the uncertainty-safe explanation.
* Reduced-motion preferences remain respected by any optional transition treatment.

### 14.10 Step 13 Cross-Document Synchronization

The Step 13 behavior must be represented consistently in:

* `rsvp-system-design.md` — authoritative lifecycle and state behavior.
* `rsvp-api-contract.md` — successful-response handoff and explicit absence of a new recovery endpoint/token requirement.
* `page-outlines.md` — finalized State 12 page responsibility and copy.
* `wireframes.md` — finalized State 12 information order and visible copy.
* `rsvp-test-cases.md` — finalized, non-provisional confirmation-refresh tests.

`requirements.md`, `decisions.md`, `sitemap.md`, and `route-inventory.md` already establish the controlling high-level behavior and require review for consistency. They do not require a Step 13 change unless the synchronized files introduce a contradiction.

---

## 15. Phase 3 Step 14 — Finalized Privacy and Security Rules

Phase 3 Step 14 completes the RSVP-system planning architecture by establishing the mandatory privacy and security requirements that govern implementation, testing, deployment, operation, and eventual RSVP-data retirement.

These rules are governed by the approved Phase 3 Step 14 privacy and security decision set in `decisions.md`.

They refine implementation boundaries without changing:

* The substantive RSVP substantive form configurations.
* The blank-form lookup invariant.
* The Step 8 submission request envelope.
* The Step 8 successful response envelope.
* The Step 9 dependency rules.
* The no-`expectedVersion` concurrency model.
* The versioned storage model.
* The Step 10 thirteen-state browser model.
* The Step 13 confirmation-refresh architecture.

Where this section places a stricter privacy or security boundary around previously approved functionality, the stricter Step 14 boundary controls.

### 15.1 Invitation Codes Are Limited Access Tokens

Invitation codes are limited access tokens used to select the authorized blank RSVP configuration for one invited party.

They are **not passwords** and must not be represented to guests as equivalent to strong account authentication.

The RSVP system must not provide:

* A public guest directory.
* A public invitation directory.
* A code-recovery search.
* A list of valid invitation codes.
* A close-match or “Did you mean?” feature.
* Fuzzy matching.
* Automatic substitution of visually similar characters such as `O` and `0`.
* A public “view my saved RSVP” endpoint.
* A personalized browser route containing an invitation code.
* A public confirmation-recovery route that uses an invitation code or saved-response identifier.

Manual invitation-code entry at `/wedding/rsvp/` remains the sole personalized RSVP access method.

### 15.2 Request-Body-Only Invitation-Code Transport

Invitation codes are transported only in request bodies for the approved RSVP flows.

The approved public browser/API relationship remains:

```text
Browser route:
  /wedding/rsvp/

Lookup API:
  POST /wedding/api/rsvp/lookup
  body contains inviteCode

Submission API:
  POST /wedding/api/rsvp/submit
  body contains inviteCode
```

An invitation code must not appear in:

* Browser paths.
* API path parameters.
* Query strings.
* URL fragments.
* Canonical URLs.
* Social-preview metadata.
* Structured data.
* Analytics payloads.
* Referrer-visible personalized URLs.
* Ordinary application or reverse-proxy logs.
* Public source files.

The Step 13 confirmation route remains:

`/wedding/rsvp/confirmation`

and must not gain a token-bearing or code-bearing URL merely to preserve the temporary summary.

### 15.3 Production HTTPS Requirement

The production wedding website and RSVP API must be served over HTTPS.

Guest RSVP information must not be submitted over ordinary HTTP.

Production behavior must therefore ensure:

1. Ordinary HTTP navigation is redirected to HTTPS before RSVP information is submitted.
2. The RSVP browser routes use HTTPS.
3. Lookup and submission API requests use HTTPS.
4. Confirmation routes use HTTPS.
5. Backend credentials and provider secrets are never transported to the browser as part of making HTTPS work.

Local Windows development may use an appropriate local-development origin. The production transport requirement does not require public TLS configuration to be embedded into individual React components or API route definitions.

### 15.4 Personalized Cache-Control Policy

Personalized RSVP browser documents and RSVP API responses must not be stored by shared or persistent public caches.

The following production responses must use:

`Cache-Control: no-store, max-age=0`

This applies to responses serving:

* `/wedding/rsvp/`.
* `/wedding/rsvp/confirmation`.
* Successful `POST /wedding/api/rsvp/lookup` responses.
* Unsuccessful `POST /wedding/api/rsvp/lookup` responses.
* Successful `POST /wedding/api/rsvp/submit` responses.
* Unsuccessful `POST /wedding/api/rsvp/submit` responses.
* Any later endpoint or browser response that contains invitation-specific RSVP configuration, guest-entered RSVP information, confirmation destinations, confirmation status, or other personalized RSVP data.

This requirement is a **no-store boundary**, not an expansion of the data returned to the browser.

Static, versioned application assets containing no personalized or secret information may use ordinary cache optimization.

The Step 13 temporary confirmation model remains unchanged:

* The successful submission response may exist in temporary React navigation/application state.
* The application does not intentionally write that response to `localStorage`, `sessionStorage`, IndexedDB, cookies, or another persistent browser mechanism solely to reconstruct the confirmation after refresh.
* Loss of usable temporary confirmation state continues to produce State 12 — Confirmation Refresh Fallback.

### 15.5 Search-Indexing and Metadata Boundary

The following browser routes and states must not be publicly indexed:

* `/wedding/rsvp/`.
* All controlled RSVP states rendered on `/wedding/rsvp/`.
* `/wedding/rsvp/confirmation`.
* All success, warning, and refresh-fallback states rendered on the confirmation route.
* `/wedding/not-found`.
* Any unmatched wedding route.

The RSVP and confirmation routes must use appropriate page-level crawler directives and the applicable production server no-index behavior.

No personalized or transactional value may appear in:

* Page titles.
* Meta descriptions.
* Canonical URLs.
* Structured data.
* Social-preview metadata.
* Crawler-visible generated content outside the intended page body.
* Sitemap entries that would expose personalized variants.

The public Privacy page at:

`/wedding/privacy`

remains an ordinary public, indexable informational page.

Search-engine exclusion is a privacy boundary, not authentication. The application must not rely on `noindex` as a substitute for the backend authorization and data-minimization rules.

### 15.6 Analytics Data-Minimization Boundary

Analytics must not receive:

* Invitation codes.
* Guest or household identities derived from invitation records.
* RSVP answers.
* Named-invitee roster mappings or attendance responses.
* Named-invitee `Plus1` allocation mappings or responses.
* Attendee names.
* Dietary or allergy information.
* Email addresses.
* Mobile numbers.
* Confirmation destinations.
* `clientSubmissionId` values.
* Invitation-specific form-configuration details.
* RSVP version numbers.
* Delivery-provider payloads.

If analytics are used on RSVP or confirmation routes, events are limited to non-personalized aggregate interaction/state categories and are never required for RSVP functionality.

### 15.7 Routine Logging Boundary

Ordinary application, reverse-proxy, and delivery logs follow data minimization.

Routine logs may record server-generated correlation identifiers, timestamps, endpoint categories, HTTP status, request duration, generic error category, selected delivery channel without destination, rate-limit events, and non-sensitive delivery outcomes.

Routine logs must not record:

* Raw or normalized invitation codes.
* Guest or party display names.
* Named-invitee roster mappings or attendance responses.
* Named-invitee `Plus1` allocation mappings or responses.
* RSVP request or response bodies.
* Attendance totals.
* Attendee names.
* Dietary or allergy text.
* Email addresses or mobile numbers.
* Confirmation destinations.
* `clientSubmissionId` values.
* Private workbook rows or worksheet contents.
* Protected administrative addresses.
* Provider credentials or full provider payloads.

### 15.8 Restricted Diagnostic Correlation

Routine troubleshooting must prefer the non-sensitive correlation data allowed by Section 15.7.

When a specific secured diagnostic investigation genuinely requires correlation to one invitation, the system may use a non-reversible keyed pseudonymous invitation identifier instead of the raw invitation code.

Such diagnostic logging must be:

* Explicitly enabled for the investigation.
* Access-restricted.
* Limited to the minimum necessary fields.
* Time-limited.
* Disabled when the investigation ends.
* Removed or retired when no longer required.

The existence of this diagnostic exception does not authorize raw invitation codes, RSVP answers, dietary information, or confirmation destinations to be written to ordinary logs.

### 15.9 Lookup Rate Limiting

The initial production configuration for:

`POST /wedding/api/rsvp/lookup`

is:

**Maximum 10 requests per 15-minute rolling window per client IP address.**

The authoritative backend must enforce the limit.

The eleventh applicable request within the active rolling window returns:

`429 Too Many Requests`

with a guest-safe response.

A `Retry-After` indication should be returned when supported by the implementation.

The rate-limit result must not disclose:

* Whether the attempted invitation code exists.
* Whether a close code exists.
* Whether the code is active.
* Whether the code belongs to production or development.
* How many valid invitation records exist.

Rate limiting does not replace structural code validation or backend authorization.

### 15.10 Submission Rate Limiting

The initial production configuration for:

`POST /wedding/api/rsvp/submit`

uses two limits:

1. **Maximum 6 requests per 15-minute rolling window per client IP address.**
2. **Maximum 6 requests per 15-minute rolling window per normalized invitation code.**

The normalized-code limit is calculated from the backend's authoritative normalization result and does not require exposing the normalized code to logs.

Exceeding either applicable limit returns:

`429 Too Many Requests`

with guest-safe behavior and a `Retry-After` indication when supported.

Rate limiting must not alter RSVP storage or idempotency semantics.

In particular:

* A rate-limited request must not create a new RSVP version.
* A rate-limited request must not initiate guest or administrative confirmation delivery.
* A previously stored logical request remains stored.
* If a client later safely retries an uncertain logical request, the existing Step 8 idempotency rules still control the `clientSubmissionId`.
* Rate limiting does not introduce `expectedVersion` or ordinary `409 Conflict` behavior.

### 15.11 Trusted Reverse-Proxy Client Address Handling

The production deployment may sit behind one or more reverse proxies or tunnels.

Per-IP rate limiting must therefore use client-address information only from the specifically trusted production proxy chain.

The Express deployment must not blindly trust arbitrary forwarded-address headers supplied by an untrusted client.

The exact proxy configuration belongs to deployment implementation, but the security invariant is:

```text
Untrusted request
  |
  v
Approved production proxy/tunnel chain
  |
  v
Express receives client-address information
only from the configured trusted chain
  |
  v
Per-IP rate limiter
```

If the trusted proxy configuration is incorrect or absent, implementation testing must treat the per-IP limiter as not yet production-ready.

### 15.12 Backend-Only Google Credentials

Google API credentials, service-account material, private keys, access tokens, spreadsheet authentication secrets, and equivalent Google-side credentials must remain backend-only.

They must not appear in:

* React source.
* Compiled browser assets.
* Browser storage.
* Browser API responses.
* Public Nextcloud shares.
* Public documentation.
* Ordinary logs.
* Source-control commits.

The browser communicates only with the Express API.

The browser does not directly authenticate to the private administrative workbook.

### 15.13 Backend-Only Email, SMS, and Administrative Credentials

The following must remain backend-only:

* Email-delivery credentials.
* SMTP credentials.
* SMS-provider credentials.
* API keys.
* Sender configuration.
* Provider authentication secrets.
* The protected administrative recipient address.

These values belong in protected backend environment configuration or equivalent server-side secret storage.

They must not appear in:

* React source.
* Compiled browser assets.
* Browser storage.
* Public configuration files.
* Public documentation.
* Ordinary logs.
* Source-control commits.

Guest-facing confirmation responses may contain only the approved limited administrative-attempt status. They must not expose the protected administrative address.

### 15.14 Private Administrative Workbook

The private administrative workbook remains non-public and accessible only to the couple, explicitly authorized administrators, and the backend service account.

It may contain:

* The authoritative private `Invitees List` source or controlled transformed configuration data.
* Production invitation-code mappings.
* Reviewed party display data.
* Authorized named-invitee roster mappings and stable opaque identifiers.
* Authorized named-invitee `Plus1` allocation mappings.
* Current RSVP responses and version history, including authorized attendance responses.
* Attendee names and Reception-specific dietary/allergy information.
* Operational confirmation destinations and authorization records.
* Delivery-attempt records.

The browser never receives workbook credentials or direct workbook access.

### 15.15 Production and Development/Test Separation

Production invitation data, development/test fixtures, credentials, and delivery configuration must remain separated.

Development fixtures such as the Step 11 `DEVxxx` records:

* Are documentation/development fixtures.
* Must not be authorized by the production invitation registry.
* Must not be mixed into production guest data.
* Must not receive production guest contact information.
* Must not rely on production delivery credentials during ordinary development testing.

Production invitation records and production credentials must not be copied into:

* Public test fixtures.
* Frontend source.
* Public documentation.
* Public repositories.

Environment authorization remains a backend responsibility.

A syntactically valid development code used against production must receive the same neutral unauthorized/invalid guest-facing behavior as any other unavailable code.

### 15.16 Guest-Safe Backend Errors

Guest-facing backend errors must not reveal internal infrastructure, configuration, enumeration, or provider details.

Guest-visible errors must not contain:

* Stack traces.
* Framework/library diagnostic output.
* Filesystem paths.
* Server usernames.
* Spreadsheet identifiers.
* Worksheet names.
* Internal row or record identifiers.
* Credentials or secrets.
* Private administrative addresses.
* Raw provider payloads.
* Provider credentials.
* Another invitation record.
* A suggestion that a close-match code exists.

Malformed, unknown, inactive, development-only, or environment-ineligible invitation codes continue to produce neutral invalid-invitation behavior.

A known service failure continues to produce a guest-safe Service Unavailable state.

An uncertain browser outcome continues to use State 8 — Submission Uncertain.

A lost temporary confirmation summary continues to use State 12 — Confirmation Refresh Fallback.

These states must not be collapsed into technically revealing error output.

### 15.17 Protected Attendee Details and Dietary/Allergy Information Boundary

Attendee names collected through `Attendee Details` are private RSVP content for every attending event combination. Dietary/allergy information is also private RSVP content and is collected only when Reception is selected.

These values may appear only in:

* The submitting party's own temporary on-screen confirmation.
* The submitting party's own selected electronic RSVP confirmation.
* The protected administrative confirmation.
* Authorized private administrative records required to operate the RSVP.

They must not appear in analytics, public pages, public metadata, ordinary logs, unrelated administrative messages, or another invited party's information.

Ceremony-only attendance retains attendee names but does not collect or retain dietary/allergy values. Removing Reception while continuing to attend clears dietary/allergy values while preserving the attendee-name list. Full decline clears the attendee-detail list entirely.

### 15.18 Transactional Use of RSVP Mobile Numbers

A mobile number entered for Text Message confirmation is private operational contact information.

It may be used only for:

* The guest-requested transactional RSVP confirmation generated by the corresponding successful initial submission or revision.
* An approved manual resend of that RSVP confirmation.

It must not be used for:

* Marketing.
* Promotional messages.
* Unrelated wedding announcements.
* List building.
* A different communication purpose not separately authorized through a future recorded decision.

A revision requires the guest to re-enter the selected confirmation method, applicable destination, and required SMS authorization, consistent with the existing Step 8/Step 9 contract.

### 15.19 SMS Provider Disclosure Gate

Phase 3 does not require selection of the production SMS provider.

The permanent form architecture may continue to use:

`smsAuthorization`

as the stable operational authorization question identifier.

Before Text Message confirmation is enabled in production:

1. The production SMS provider must be selected.
2. The provider's then-current required disclosure and authorization language must be reviewed.
3. Applicable sender-identification language must be included.
4. Applicable consent language must be included.
5. Applicable carrier-rate language must be included when required.
6. Applicable opt-out/help language must be included when required.
7. Any other legally or contractually required provider-specific language must be included.
8. Provider credentials and sender configuration must be stored through the backend-only secret boundary.
9. The completed Text Message flow must be tested before production activation.

If the provider has not been selected or the applicable disclosure copy has not been verified, Text Message confirmation must remain disabled in production.

The application must not invent provider-specific language merely to make the option appear complete.

Disabling Text Message confirmation does not remove Email confirmation. The lookup schema's `confirmationOptions` must reflect the channels actually available in the current production configuration.

### 15.20 No Unsupported Absolute-Security Claims

Public RSVP and Privacy copy may describe concrete safeguards actually used by the system.

It must not claim that the RSVP system is:

* Completely secure.
* 100% secure.
* Unhackable.
* Risk-free.
* Guaranteed never to experience unauthorized access.

The Privacy page should explain actual collection, use, access, retention, and protection practices in plain language without making guarantees beyond the implementation.

### 15.21 RSVP Data Retention Standard

The complete active RSVP-operational dataset may be retained through:

**July 30, 2027**

which is 90 days after the May 1, 2027 wedding.

No later than July 30, 2027, the active RSVP system must delete or irreversibly de-identify RSVP-operational data that is no longer required for a documented unresolved administrative need.

The retirement scope includes:

* Current RSVP responses.
* Superseded RSVP versions.
* Attendee names and Reception-specific dietary/allergy text.
* Guest confirmation email addresses.
* Guest confirmation mobile numbers.
* SMS authorization records.
* `clientSubmissionId` values.
* Guest delivery-attempt records.
* Administrative delivery-attempt records.
* Submission and revision timestamps when retained only as RSVP transaction history.
* Active invitation-code-to-RSVP-response mappings used solely by the website.

The retirement process must preserve the principle that the public wedding website does not need the full historical RSVP transaction dataset indefinitely.

### 15.22 Protected Backup Retirement

Protected backups may temporarily contain RSVP-operational data that has already been retired from the active system.

Those backups must expire through the ordinary protected backup rotation no later than:

**August 29, 2027**

which is 30 days after the active-data retirement deadline.

The retirement design must not require editing individual historical backup files in place when the established protected backup rotation can expire them safely by the deadline.

New backups created after active retirement must not unnecessarily reintroduce data that has already been deleted or irreversibly de-identified from the active system.

### 15.23 Permitted Aggregate Retention

After RSVP-operational retirement, the couple may retain non-identifying aggregate wedding statistics, such as:

* Total attendance.
* Aggregate adult attendance.
* Aggregate young-adult attendance.
* Aggregate child attendance.
* Aggregate children-under-three attendance.

An aggregate record is permissible only when it cannot reasonably be used to reconstruct an invited party's RSVP.

The Step 14 retirement rule does not require preservation of aggregate statistics; it merely permits them.

Dietary/allergy free text, contact destinations, invitation codes, `clientSubmissionId` values, and per-party RSVP histories are not aggregate statistics.

### 15.24 Separate Status of the Private `Invitees List`

The private `Invitees List` is the source used to create the initial production invitation configurations, but it may also function as the couple's private personal wedding-planning/address record.

The RSVP-system retirement rule does not automatically require destruction of that separate personal source.

After RSVP-system retirement:

* The active public RSVP application must no longer depend on RSVP response history retained through that source.
* The source must remain private if the couple retains it.
* Retention of the source as a personal address/planning record does not authorize continued retention of unnecessary RSVP-operational response history inside the active website.
* The source must not be re-published, exposed to the frontend, or converted into a public guest directory.

### 15.25 Documented Exception for a Concrete Administrative Need

A particular RSVP record may be retained temporarily beyond July 30, 2027 only when a concrete administrative need remains unresolved, such as:

* A correction request.
* A dispute about a recorded response.
* A delivery investigation.
* Another documented wedding-administration issue that actually requires the record.

The exception must follow data minimization:

1. Retain only the minimum record required.
2. Document why the exception exists.
3. Restrict access.
4. Delete the retained record when the need ends.

The exception is not a general authorization to keep the entire RSVP dataset indefinitely.

### 15.26 Step 14 Data-Flow Integration

The finalized privacy/security rules apply to the corrected RSVP flow as follows:

1. The guest enters the invitation code manually at `/wedding/rsvp/`.
2. React and Express transport the invitation code for lookup and submission only in request bodies.
3. Lookup returns only the limited blank-form configuration, including the validated party's limited named-invitee roster and authorized additional-guest prompts but no stored answers.
4. The browser collects event attendance, named-invitee and additional-guest Yes/No responses, age totals, `Attendee Details`, Reception-specific dietary/allergy information when applicable, and operational confirmation data.
5. Submission is rate-limited and independently revalidated by Express.
6. Revisions merge privately with stored state; lookup never reveals that state.
7. Dependency processing derives actual attendance from named-invitee Yes responses, Plus1 Yes responses, and grouped child count, enforces age-total equality, requires complete attendee-list replacement when composition changes, and clears data that becomes inapplicable before final validation.
8. Successful storage precedes delivery attempts.
9. Guest and administrative confirmations contain the complete applicable current RSVP but remain limited to their authorized recipients.
10. Personalized responses are `no-store`, non-indexed, excluded from analytics payloads, and omitted from routine logs.
11. Active RSVP-operational data follows the approved retirement schedule.

### 15.27 Step 14 Does Not Create New Public Endpoints

The privacy/security design does not require a new public RSVP endpoint.

The public endpoint inventory remains:

* `GET /wedding/api/health`
* `POST /wedding/api/rsvp/lookup`
* `POST /wedding/api/rsvp/submit`

Step 14 does not create:

* A public guest directory.
* A public code-recovery endpoint.
* A public saved-RSVP endpoint.
* A public RSVP-history endpoint.
* A public administrative endpoint.
* A confirmation-recovery endpoint.
* A personalized invitation-specific route.

### 15.28 Step 14 Cross-Document Synchronization

The privacy/security architecture must remain synchronized with the current spreadsheet-authoritative RSVP model in:

* `requirements.md`
* `decisions.md`
* `content-inventory.md`
* `route-inventory.md`
* `sitemap.md`
* `page-outlines.md`
* `wireframes.md`
* `rsvp-api-contract.md`
* `rsvp-example-configurations.json`
* `rsvp-example-form-schemas.json`
* `rsvp-test-cases.md`

Later implementation may refine code organization but must not weaken these boundaries without a new recorded decision.

## 16. Phase 3 Step 1 Completion Check

Phase 3 Step 1 remains complete because one authoritative backend-mediated flow still connects manual invitation lookup, blank personalized rendering, validated submission/revision, storage, independent delivery attempts, and temporary confirmation.

The synchronized flow now carries named-invitee responses, Plus1 responses, grouped unnamed-child Yes/No plus count, derived attendance, exact age totals, and all-attendance `Attendee Details`.

---

## 17. Phase 3 Step 2 Completion Check

Invitation-code normalization remains unchanged. All 57 current production codes normalize uniquely without collision, renderer behavior does not depend on the fixed count, and production code values remain private.

---

## 18. Phase 3 Step 3 Completion Check

Manual code entry at `/wedding/rsvp/` remains the sole personalized access method. Codes remain out of browser URLs, lookup uses POST body transport, Express validates independently, and successful lookup returns only a limited blank form.

---

## 19. Phase 3 Step 7 Completion Check

Lookup remains synchronized because:

* Success returns exactly `invitation`, `questions`, and `confirmationOptions`.
* Safe invitation data includes party context, wording, maximum attendance, limited named-invitee roster, and safe allocation fields `id`, `kind`, `prompt`, `maximumCount`.
* No production form-profile id is needed.
* Stored RSVP answers/contact/history are never returned.
* Private party ids, raw source rows, raw `Kids(n)` text, and unrelated mappings remain backend-only.

---

## 20. Phase 3 Step 8 Completion Check

Submission remains synchronized because:

* Top-level request remains `inviteCode`, `clientSubmissionId`, `confirmation`, `changes`.
* Operational confirmation remains separate.
* Substantive changes use event attendance, named-invitee responses, allocation-dependent `additionalGuestResponses`, age totals, and attendee details.
* Plus1 responses are scalar Yes/No.
* Grouped child responses are `{attending,count}`.
* Omission, replacement, and explicit numeric zero remain distinct.
* Dependency clearing is backend-driven rather than a generic client clear operation.
* `overallAttendance` is derived, not client-writable.
* Attendee details use complete-list replacement when required.
* Grouped child response/count changes are composition-sensitive.
* Safe retry reuses the same logical request and `clientSubmissionId`.
* Browser does not send `expectedVersion`.

---

## 21. Phase 3 Step 9 Completion Check

Dependency rules remain synchronized because:

* Attendance and decline remain mutually exclusive.
* Full decline clears attendance-dependent substantive data.
* Decline-to-attending requires all newly applicable authorized responses, age totals, and complete attendee details.
* Named invitees and Plus1 allocations use explicit Yes/No.
* Grouped children use one Yes/No-plus-count response.
* `overallAttendance = named-invitee Yes + Plus1 Yes + grouped child count`.
* Age totals sum exactly to derived attendance.
* Attendee details apply to every attending event combination.
* Removing Reception clears dietary values only.
* Any grouped child response/count change requires complete attendee-detail replacement.
* Unauthorized/contradictory data is rejected rather than guessed.

---

## 22. Phase 3 Step 10 Completion Check

The thirteen-state interface model remains unchanged at the top level. State 5 renders the grouped child control and conditional count selector; State 6 can report grouped-child count validation; confirmation states display the resulting grouped child response/count.

---

## 23. Phase 3 Step 11 Completion Check

The fictional fixture set now covers:

* Singular/plural wording.
* Named roster/capacity reconciliation.
* Zero, one, and multiple Plus1 allocations.
* A grouped child allocation with `maximumCount > 1`.
* Grouped child No, minimum Yes count, maximum Yes count, and over-capacity rejection.
* Mixed named attendance.
* Ceremony-only, Reception-only, combined, and decline.
* Derived attendance/exact age totals.
* Attendee Details for all attending states.
* Grouped-child composition revisions.
* Same-count and changed-count composition replacement.
* Capacity-boundary validation.
* Disabled fixture behavior.
* Confirmation, delivery warning, and idempotent retry overlays.

---

## 24. Phase 3 Step 12 Completion Check

The test catalog must exercise:

* Invitation normalization and neutral lookup failures.
* Blank-form privacy.
* Named-invitee authorization/response validation.
* Plus1 prompt/response validation.
* Grouped child lookup metadata and rendering contract.
* Grouped child response-shape/count validation.
* Grouped child count derivation and composition-sensitive revision.
* Derived attendance and exact age-total equality.
* Attendee-detail cardinality/text limits.
* Reception-only dietary applicability.
* Full-decline clearing and decline-to-attending requirements.
* Partial revisions, explicit zero, same-count composition changes, complete attendee-list replacement, and omission semantics.
* Storage/version/idempotency behavior.
* Independent guest/admin delivery outcomes.
* All thirteen interface states.
* Privacy/security boundaries and retirement schedule.

## 25. Phase 3 Step 13 Completion Check

Phase 3 Step 13 remains complete because successful confirmation state still comes from the limited post-storage submission response carried through temporary React state; absent or unusable temporary state still produces State 12 without automatic saved-RSVP retrieval, submission replay, new idempotency identifiers, or personalized confirmation URLs.

---

## 26. Phase 3 Step 14 Completion Check

Phase 3 Step 14 remains complete and is synchronized with the current data model because:

* Invitation codes remain limited access tokens and request-body-only values.
* Personalized RSVP and confirmation responses use `Cache-Control: no-store, max-age=0` and remain non-indexed.
* Analytics and routine logs exclude invitation codes, RSVP answers, named-invitee roster/response data, named-invitee allocation mappings/responses, attendee names, dietary/allergy data, confirmation destinations, private identifiers, and secrets.
* Lookup and submission retain the approved rate limits and trusted-proxy boundary.
* Google, email, SMS, sender, and protected administrative-recipient credentials remain backend-only.
* Production and development/test invitation data remain separated.
* Guest-safe errors reveal no enumeration, infrastructure, provider, or spreadsheet details.
* Attendee names and Reception-specific dietary/allergy information are restricted to the submitting party's authorized confirmation surfaces and protected administrative records.
* Text Message confirmation remains provider-gated.
* Active RSVP-operational data is retired no later than July 30, 2027 except for a documented minimal administrative need, and protected backups expire by August 29, 2027.
* The separate private `Invitees List` may remain a personal planning/address record without keeping the public RSVP application dependent on retired response history.
* Production RSVP traffic uses HTTPS.

With this synchronization, **Phase 3 — Design the RSVP System remains complete under the corrected spreadsheet-authoritative attendance model, including the grouped `Kids(n)` child-count interaction.**

## 27. Implementation Reliability Clarification — Recoverable Persistence

The implemented RSVP mutation path uses a private lifecycle journal and recoverable mutation identifier to make partial Google Sheets writes and safe retries deterministic without representing the workbook as a transactional database.

### 27.1 Lifecycle Journal

A logical submission progresses privately through:

1. `prepared` — validated submission metadata and the complete proposed stored RSVP have been recorded before mutation.
2. `stored` — the version-history/current-response mutation has been confirmed.
3. `deliveryStarted` — the backend has crossed the boundary after which a provider call may already have occurred.
4. `complete` — the canonical guest-facing result has been durably associated with the logical submission.

The journal is backend-only. Public lookup and submit responses do not expose lifecycle state, private mutation IDs, private versions, storage rows, or recovery metadata.

### 27.2 Recoverable RSVP Mutation

The storage adapter exposes one logical `commitRsvpMutation` operation.

For the Google Sheets adapter this is a recoverable sequence rather than a database transaction:

* The backend verifies the expected private current version.
* It checks whether the target version already exists.
* A matching target version with the same private mutation ID is recognized as the same logical mutation.
* If version history exists but the current-response write is missing, retry repairs current state without appending another version.
* If the target version belongs to a different mutation or current state is inconsistent, the operation fails closed.
* An already complete matching mutation is returned as already committed.

This provides crash recovery and duplicate-version protection for the approved single-writer deployment model.

### 27.3 Delivery Crash Window

Before invoking guest/administrative delivery, the lifecycle is durably marked `deliveryStarted`.

On retry:

* A matching durable delivery record is reused.
* Delivery is not called again merely because the original HTTP response was lost.
* If delivery may have happened but its result was not durably recorded, the backend records an `uncertain` outcome rather than automatically risking duplicate email or SMS.
* A deliberate later resend remains a separate administrative operation and does not modify RSVP content or version history.

### 27.4 Concurrency Boundary

Within one backend process, mutations for the same invitation are serialized so each revision merges against the latest current RSVP.

Google Sheets does not provide distributed row-level locking, compare-and-swap, or an atomic multi-row transaction covering the RSVP lifecycle. Therefore production must operate with **one mutation-capable RSVP backend instance at a time** while Google Sheets remains the active persistence adapter.

A future horizontally scaled or active-active deployment must first replace or supplement this boundary with storage/locking semantics that safely coordinate independent writers.

### 27.5 Failure-Injection Coverage

Implementation tests now cover:

* Recovery when the RSVP mutation succeeded but the lifecycle update failed afterward.
* Recovery after delivery was recorded but final lifecycle completion failed.
* Recovery when provider delivery may have completed but delivery-history persistence failed, without automatic resend.
* Blocking of a different logical mutation while an earlier submission remains incomplete.
* Serialization of simultaneous distinct revisions for one invitation against the latest current state.
* Idempotent recovery of an orphaned matching version-history record.
* Rejection of a conflicting mutation occupying the same target version.

These rules refine the earlier storage-before-delivery and idempotent safe-retry requirements without changing the public RSVP API contract.

---

## 28. Implementation Validation Clarification — Resend Live Email

The production email adapter has completed an isolated live-delivery validation against the verified `rsvp.loreweavercreations.com` sending subdomain.

The validation path is intentionally separate from the RSVP mutation path. It requires an explicit test recipient and acknowledgement, refuses production mode, and requires the approved wedding sender identity before it will call the configured Resend transport.

The validation confirms that the implemented adapter can submit a message using:

* Sender name: `Norstein-Dashiell Wedding`
* Sender address: `confirm@rsvp.loreweavercreations.com`
* Reply-To: `RSVPhelp@loreweavercreations.com`

The live test returned a definite accepted result and the received message matched the expected From, Reply-To, and test-body content.

The validation did **not**:

* Start or exercise an RSVP submission.
* Read or write the Google Sheets RSVP workbook.
* Load production invitation data.
* Create an RSVP version.
* Create a delivery record.
* Send to a wedding guest.
* Expose the Resend API key or test-recipient address to source control.

This confirms transport readiness only. Production RSVP email delivery remains subject to the later production deployment, secret-management, and end-to-end RSVP activation gates.

---

## 29. Implementation Clarification — Manual Guest Confirmation Resend

The RSVP backend exposes manual guest-confirmation resend only as a protected maintenance CLI. No public or browser-accessible resend route exists.

### 29.1 Invocation Boundary

The command is:

`npm run resend:rsvp-confirmation`

It is enabled only when `NODE_ENV=production`.

Each invocation requires:

* `RSVP_MANUAL_RESEND_INVITE_CODE` — supplied ephemerally by the operator.
* `RSVP_MANUAL_RESEND_ACK=RESEND_CURRENT_RSVP_CONFIRMATION` — the exact explicit acknowledgement.

These maintenance-only values are not persisted in `.env.example`, source control, browser code, or ordinary logs.

### 29.2 Data and Delivery Behavior

The maintenance command:

1. Loads validated production environment configuration.
2. Verifies Google Sheets access.
3. Uses the production RSVP workbook as the invitation/current-RSVP source.
4. Performs the ordinary invitation normalization and environment-eligibility lookup.
5. Loads the party’s authoritative current RSVP.
6. Reuses the stored confirmation method and destination.
7. Sends only the guest confirmation through the configured provider.
8. Appends a separate `Resend Records` entry containing the resend timestamp, current RSVP version, requested-by marker, channel/destination, and closed delivery result.
9. Leaves current RSVP content and RSVP version history unchanged.

Manual resend never repeats the protected administrative confirmation.

### 29.3 Result Normalization and Safe Output

Resend result vocabulary remains closed to:

* `sent`
* `failed`
* `uncertain`

Any unknown or provider-specific value is normalized to `uncertain` before persistence.

The CLI prints only safe operational states. It does not print:

* Raw or normalized invitation codes.
* Guest confirmation destinations.
* RSVP answers.
* Attendee names or Reception-specific dietary/allergy text.
* Workbook identifiers or rows.
* Provider credentials or provider payloads.

### 29.4 Failure Semantics

Unknown invitation, environment-ineligible invitation, or invitation without a stored current RSVP produces the same maintenance `NOT FOUND` outcome and no delivery attempt.

Delivery failure or uncertainty is still recorded as a resend attempt. It does not mutate the RSVP or increment its version. A later resend is a new explicit administrator-requested delivery operation.

---

## 30. Implementation Clarification — Production Invitation Data Activation

Production invitation configuration is now staged in the private Google Sheets RSVP store through the guarded activation workflow.

### 30.1 Read-Only Readiness Gate

Before any invitation write, the maintenance workflow verifies:

* `NODE_ENV=production` for the production-only commands.
* Successful transformation and governing audit of the private authoritative source.
* Exact Google Sheets RSVP-store headers.
* Google Sheets access through the configured backend credential path.
* Empty operational rows in:
  * `Current RSVPs`
  * `RSVP Versions`
  * `Submission Records`
  * `Delivery Records`
  * `Resend Records`

The readiness command does not change workbook content.

### 30.2 Pre-Write Snapshot

The guarded invitation loader captures all six RSVP-store sections before modifying `Invitations`.

The snapshot is written to an ignored private working directory by default and may be redirected only to another private operator-controlled path. Its path and contents are not public runtime configuration and are not committed.

The snapshot exists to support controlled recovery of the pre-load invitation state and to preserve evidence that operational RSVP tables were empty immediately before production invitation activation.

### 30.3 Guarded Invitation Replacement

The loader requires the exact ephemeral acknowledgement:

`RSVP_PRODUCTION_ACTIVATION_ACK=WRITE_PRODUCTION_INVITATIONS`

Only the `Invitations` rows are replaced. Production configuration must match the transformed private source and must be explicitly classified as `production`.

After the write, the loader:

* Reads the workbook again.
* Confirms the invitation count and exact private configuration match.
* Confirms every written invitation is production-classified.
* Confirms all five operational RSVP sections are unchanged.
* Attempts to restore the prior `Invitations` rows if post-write activation verification fails.

### 30.4 Independent Post-Load Verification

A separate read-only command independently repeats:

* Authoritative private source transformation and audit.
* Google Sheets schema verification.
* Exact source-to-workbook invitation comparison.
* Empty-operational-table verification.

This independent command does not rely on the loader's success message as proof of activation.

### 30.5 September 20, 2026 Activation Result and Required Contract Resynchronization

The controlled September 20 production activation completed successfully under the then-current configuration shape:

* Authoritative source audit: 57 active invitation records.
* Guarded invitation load: 57 production configurations.
* Independent verification: 57 production configurations matched the transformed private source under that historical contract.
* RSVP operational tables: empty.
* Private pre-load snapshot: created outside source control.

Subsequent attendance-model clarifications changed the required production configuration by adding the specifically named `namedInvitees` roster and then replacing the per-unnamed-child allocation model with grouped `Kids(n)` authorization.

The current required capacity invariant is:

`namedInvitees.length + sum(additionalGuestAllocations.maximumCount) = maximumAttendance`

The current source also requires safe allocation `kind` and `maximumCount`, including two grouped child allocation objects carrying five total child-capacity slots.

The September 20 activation remains valid historical proof of the guarded loading mechanism, but it is **not** proof that the currently staged invitation rows satisfy this grouped-child contract.

Before production RSVP traffic is enabled, all 57 configurations must be regenerated, revalidated, reactivated, and independently verified under the current model.

Because the five operational RSVP sections were empty at the historical checkpoint, this correction does not require migration of guest RSVP responses.

## 31. Implementation Clarification — Production Runtime and Deployment Readiness

### 31.1 Production Configuration Gate

Production startup validates the complete runtime configuration before the RSVP application may listen for requests.

The gate requires the production Google Sheets workbook, protected administrative recipient, Resend provider and API key, approved sender identity, canonical public origin, bounded trusted-proxy value, disabled SMS state, and an explicit single mutation-writer count of one.

The approved production browser origin is:

`https://www.loreweavercreations.com`

The approved production email identity remains:

* Sender name: `Norstein-Dashiell Wedding`
* Sender address: `confirm@rsvp.loreweavercreations.com`
* Reply-To: `RSVPhelp@loreweavercreations.com`

A mismatch fails closed before the production service is considered ready.

### 31.2 Origin Boundary

Production RSVP API middleware checks an explicit browser `Origin` header.

If the header is present and does not equal the canonical production origin, the request receives a no-store `403` before RSVP route processing.

Originless requests are not rejected solely for lacking `Origin`, preserving controlled server-side health and maintenance use. The origin check is a browser-origin boundary and not a replacement for authentication, HTTPS, invitation-code validation, rate limiting, or reverse-proxy controls.

### 31.3 Trusted-Proxy Boundary

The currently validated production path is direct Cloudflare Tunnel ingress to the loopback-bound Express service without an additional nginx, Caddy, or Apache hop.

The active production setting is therefore bounded to `loopback`.

This value must be revisited if the reverse-proxy chain changes. The implementation does not use blanket proxy trust.

### 31.4 Single-Writer Enforcement

Production requires `RSVP_WRITER_INSTANCE_COUNT=1`.

Before the real production server listens, it also acquires an exclusive local writer-lock file. A second same-host process cannot acquire the lock simultaneously.

This local lock does not provide distributed coordination. The deployment/orchestration layer must still ensure that only one mutation-capable backend instance exists globally while Google Sheets remains the active persistence adapter.

### 31.5 Runtime Readiness Verification

The non-serving production runtime check verifies:

* Production environment validity.
* Google Sheets authentication/access.
* Exact RSVP-store schema.
* Resend transport construction with backend-only credentials.
* Successful exclusive writer-lock acquisition and release.

It does not start guest-facing traffic, perform a lookup, submit an RSVP, or send email.

### 31.6 Loopback Production Smoke

The smoke harness:

1. Requires an ephemeral real production invitation code and exact operator acknowledgement.
2. Uses the real production environment and staged Google Sheets invitation set.
3. Starts the real Express application only on `127.0.0.1` and an ephemeral port.
4. Requests `GET /wedding/api/health`.
5. Requests one `POST /wedding/api/rsvp/lookup` with the canonical production origin.
6. Requires HTTP 200 and the approved three-property blank-form response boundary.
7. Stops the loopback server.
8. Re-reads the RSVP workbook and verifies that all non-invitation operational sections are unchanged.

The smoke path never calls the submit endpoint and never deliberately invokes email delivery.

### 31.7 September 20, 2026 Runtime Result and Required Reverification

The September 20 production runtime-readiness command and loopback lookup smoke completed successfully under the then-current configuration contract without operational RSVP mutation or delivery.

Because the current grouped-child architecture changes private invitation configuration, safe lookup allocation shape, submission validation, derived-attendance semantics, and successful confirmation projection, that historical smoke result does not satisfy final readiness.

After all 57 production invitation configurations are regenerated/reactivated under the grouped-child model, the production runtime preflight and loopback lookup smoke must be rerun. They must again produce no operational RSVP mutation or delivery attempt.

## September 27, 2026 synchronization note

The current unnamed-child model is now explicitly grouped.

`Kids(n)` in the cleaned authoritative source applies only to children whose names are not supplied in Columns C/D. Each applicable invitation therefore receives one `unnamedChildren` allocation object rather than one allocation object per child.

That grouped allocation exposes only the safe browser fields required for rendering: `id`, `kind`, `prompt`, and `maximumCount`. The family answers one Yes/No question; Yes reveals a count selector from 1 through `maximumCount`, and No records count 0.

The change does **not** create a new browser route, API endpoint, top-level interface state, substantive response region, storage table, confirmation channel, or independently editable headcount. The existing `additionalGuestAllocations` / `additionalGuestResponses` mechanism remains the shared umbrella for Plus1 and grouped child authorization.

The governing configuration invariant is now:

`namedInvitees.length + sum(additionalGuestAllocations.maximumCount) = maximumAttendance`

The governing attendance derivation is:

`overallAttendance = named-invitee Yes count + Plus1 Yes count + grouped unnamed-child attending count`

The current authoritative production audit is 84 named potential attendees, 26 Plus1 allocation objects, two grouped child allocation objects carrying five child-capacity slots, 28 total allocation objects, 31 total additional-guest capacity, and maximum capacity 115.

This grouped-child correction requires downstream configuration, lookup, submission validation, confirmation formatting, frontend rendering, production transformation, and related tests to be resynchronized before final production readiness is claimed.
