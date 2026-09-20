# RSVP System Design

**Project:** Loreweaver Creations Wedding Website
**Phase:** Phase 3 — Design the RSVP System
**Current completion:** Phase 3 RSVP architecture synchronized with the authoritative private `Invitees List` spreadsheet and its approved bottom-row RSVP display notes, including the current submission/revision model, interface-state model, fictional development fixtures, confirmation-refresh behavior, and privacy/security rules
**Phase 3 status:** Complete
**Last updated:** September 20, 2026

---

## 1. Purpose and Status

This document specifies the architecture, end-to-end data flow, trust boundaries, invitation-code normalization rules, sole RSVP access method, limited blank-form response boundary, submission/partial-revision model, authoritative conditional/dependency rules, explicit React interface-state model, fictional development archetypes, finalized confirmation-refresh behavior, and mandatory privacy and security rules of the RSVP system for the Loreweaver Creations wedding website.

The couple-supplied private `Invitees List` spreadsheet is authoritative for production invitation data and for the substantive RSVP presentation behavior described in its bottom-row notes. When an older Phase 3 example conflicts with that source, the spreadsheet-authoritative decisions control and the affected architecture must be interpreted through this revised document.

The current design defines how one reusable RSVP application:

* Accepts a manually entered invitation code.
* Normalizes that invitation code consistently in React and Express, with Express authoritative.
* Uses a private invitation-party configuration generated from the authoritative spreadsheet.
* Returns only the information necessary to render a blank guest-facing form.
* Uses one spreadsheet-authoritative substantive form structure for all active production invitations rather than separate production substantive form configurations.
* Varies the rendered form only through reviewed party display text, explicit singular/plural wording, `maximumAttendance`, and zero or more authorized named-invitee `Plus1` allocations.
* Presents one Yes/No question for every authorized `Plus1` allocation without requesting the additional guest's own name in that allocation question.
* Presents coordinated age-category numerical dials whose sum represents the complete attending party and cannot exceed the invitation maximum.
* Presents one Reception attendee-name/dietary pair per attending party member only when Reception is selected.
* Accepts either a complete initial RSVP or selected changes to an existing RSVP.
* Merges partial revisions with the current stored response on the backend.
* Applies dependent clearing before validating the complete resulting RSVP.
* Stores one authoritative current RSVP while preserving version history.
* Sends complete guest and administrative confirmations after successful storage.
* Prevents private invitation and RSVP data from being exposed through browser URLs or unnecessary frontend data.
* Applies the finalized privacy and security standard for caching, indexing, analytics, logs, rate limiting, credentials, administrative access, SMS use, retention, and production transport.

The Phase 3 step history remains useful as a record of how the design was developed, but the current rules are the synchronized rules stated in this document and the current `decisions.md` and `requirements.md`.

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
* 23 invitations authorizing at least one `Plus1` allocation.
* 26 total `Plus1` allocations.
* Two invitations containing more than one `Plus1` allocation.
* Combined maximum-attendance capacity of 115.
* No required active production placeholder record.

These figures are source-validation targets, not renderer constants.

At the completion of **Phase 3 Step 3**, this document established the static invitation QR code as a public-homepage link, manual code entry at `/wedding/rsvp/` as the sole personalized access method, request-body transport of invitation codes, independent backend validation, limited blank-form lookup, neutral invalid-code behavior, and the prohibition on personalized browser URLs.

Phase 3 Steps 4–6 define the endpoint contract, fictional private invitation configurations, and reusable personalized form-schema vocabulary in the companion RSVP documents. Those companion files must now use the spreadsheet-authoritative model defined here.

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

The substantive `changes` object now represents the spreadsheet-authoritative data model:

* Coordinated event attendance/decline state.
* Authorized named-invitee `Plus1` responses.
* Four age-category attendance totals.
* Reception attendee-detail records when Reception is selected.

Explicit omission, replacement, numeric zero, and authorized clear operations remain distinct. The browser does not send `expectedVersion`; ordinary RSVP revisions do not use a public optimistic-concurrency contract.

The authoritative dependency order remains:

1. Validate request envelope and invitation authorization.
2. Determine initial versus revision state.
3. For a revision, merge submitted changes with the stored current response.
4. Apply automatic dependent clearing required by the resulting attendance state.
5. Determine newly applicable required structures.
6. Validate the complete resulting RSVP against the authoritative invitation configuration.
7. Persist the new version and current-response record.
8. Attempt guest and administrative confirmation delivery independently.

The thirteen-state React interface model remains unchanged at the top level. The content rendered inside the validated blank-form, validation-failure, and confirmation states is revised to the spreadsheet-authoritative question structure.

The development fixture set remains fictional and development-only. Its configuration vocabulary must exercise:

* Singular and plural wording.
* Zero, one, and multiple named-invitee `Plus1` allocations.
* Small and larger maximum-attendance values.
* Ceremony-only, Reception-only, combined attendance, and full decline as behavioral scenarios.
* Reception attendee-detail repetition.
* Existing-response partial revision.
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

---

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

The RSVP system operates at the invited-party level and uses one reusable substantive form structure for all active production invitations.

The authoritative private `Invitees List` row determines only the invitation-specific configuration needed by that common structure:

* Reviewed `partyDisplayName` and greeting text.
* Explicit singular or plural `wordingMode` from `I/We wording`.
* `maximumAttendance` from `Total Potential Attendees (Including Plus1 and Kids)`.
* Zero or more authorized named-invitee `Plus1` allocation records derived from Column E.
* Protected `active` and `environment` state.

The renderer must not infer these values from visible names or household size.

#### Coordinated attendance control

The form presents one coordinated three-checkbox attendance interface:

1. `Ceremony`.
2. `Reception`.
3. `Regretfully, I am unable to attend.` or `Regretfully, we are unable to attend.`, according to `wordingMode`.

Ceremony and Reception may be selected independently or together. An attending event selection and the decline selection are mutually exclusive. Selecting either attending event disables decline in the browser; selecting decline disables Ceremony and Reception. Express independently enforces the same rule.

#### Named-invitee `Plus1` allocation questions

For each authorized `Plus1` allocation, the form renders one Yes/No question:

`Will [Named Invitee] be accompanied by a +1?`

A row with no allocation renders none. A row with several allocations renders one question for each allocation. Each allocation is represented internally by a stable non-name identifier while the guest-facing prompt uses only the authorized named-invitee label required by the spreadsheet.

The allocation question does not ask for the additional guest's own name. If Reception is selected and that additional guest is attending, that person's name is captured later through the ordinary Reception attendee-detail list along with every other Reception attendee.

#### Attendance totals

Every attending RSVP supplies four nonnegative whole-number age-category totals:

* Adults, ages 21 and older.
* Young Adults, ages 18–20.
* Children, ages 3–17.
* Children under 3.

On the blank form each dial begins at zero. The current browser-side upper bound of each dial is `maximumAttendance` minus the current values of the other three dials. Express validates the equivalent final invariant rather than trusting browser limits.

The sum of the four categories is the derived `overallAttendance` for the complete attending party, including every attending additional guest. For an attending state it must be at least one and must not exceed `maximumAttendance`.

The number of authorized `Plus1` allocations answered Yes must not exceed the complete attendance total.

#### Reception attendee details

Reception attendee details are applicable only when Reception is selected.

For every person represented by `overallAttendance`, the form renders exactly one attendee-detail pair containing:

* Required attendee name, maximum 100 characters.
* Optional food-allergy / dietary-preference text, maximum 1000 characters.

The number of attendee-detail records must equal `overallAttendance`. This list covers every Reception attendee, including invited adults, young adults, children, and attending additional guests.

Ceremony-only attendance does not render or accept Reception attendee details. Removing Reception or fully declining clears the stored Reception attendee-detail list during authoritative dependency processing.

#### Closed substantive question set

The production RSVP does not add separate accessibility, lodging, transportation, message-to-couple, entrée-selection, named-child-attendance, or individual household-member attendance questions unless the authoritative source and governing decisions are later changed.

The production system does not use separate substantive substantive form configurations. Invitation-specific variation is data-driven from the authoritative row and the guest's current form selections.

### 2.4 Blank Forms

Every successfully validated invitation loads a blank personalized form.

This applies both when:

* No RSVP has previously been submitted; and
* A current RSVP already exists and the guest intends to make a revision.

The lookup response must not prefill or reveal:

* Stored attendance answers.
* Stored decline answers.
* Stored named-invitee `Plus1` answers.
* Stored attendance totals.
* Stored Reception attendee names or dietary/allergy information.
* Stored confirmation method.
* Stored email address.
* Stored mobile number.
* Other stored RSVP content.

### 2.5 Initial Responses and Partial Revisions

An initial RSVP must provide every substantive and operational field required by the invitation's approved substantive form configuration to create a complete valid response.

A revision may provide only the RSVP fields that need to change.

For revisions:

* Submitted RSVP fields replace the corresponding stored values.
* Omitted RSVP fields remain unchanged.
* The backend loads the current stored RSVP.
* The backend merges submitted changes with the current response.
* Explicit replacement, zero-value, decline, or clearing behavior must be available where simple omission would be ambiguous.
* The complete resulting merged response must pass validation against the invitation's authorized allocation configuration and `maximumAttendance` before it becomes the new current RSVP.

The frontend must not reveal stored answers merely to support revision behavior.

### 2.6 Backend Authority

React may perform normalization and validation for usability, but it is not authoritative.

The Express backend independently controls:

* Invitation-code normalization.
* Invitation-code validation.
* Invitation authorization.
* Rate limiting.
* Deadline enforcement.
* Form-configuration authorization.
* Named-invitee `Plus1` allocation authorization.
* Attendance-limit enforcement.
* Submitted-value validation.
* Initial-versus-revision determination.
* Revision merging.
* Explicit replace and clear-operation authorization.
* Dependent-value clearing.
* Complete-state validation.
* Duplicate-submission protection.
* Versioned storage.
* Current-response designation.
* Confirmation delivery.
* Delivery-result recording.

A successful client-side normalization, lookup, or validation result never authorizes a later submission by itself.

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
Backend selects permitted questions and wording
 |
 v
Backend returns a limited schema with no stored answers
 |
 v
React renders the blank personalized form on /wedding/rsvp/
 |
 v
Guest completes an initial RSVP or selected revision fields
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
Backend clears incompatible dependent values and validates the
complete resulting RSVP
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
* `maximumAttendance`.
* `additionalGuestAllocations`, with one stable allocation identifier and one authorized named-invitee prompt label per allocation.
* Protected `active` and `environment` values.

The private record does **not** require a production `questionProfile`. All active production invitations use the same spreadsheet-authoritative substantive form model.

The browser does not infer configuration from names, greeting text, or apparent household size and never reads the private Google Sheets workbook directly.

### 4.5 Limited Blank-Form Response

A successful lookup returns exactly three top-level properties:

* `invitation`
* `questions`
* `confirmationOptions`

The `invitation` object may contain only guest-facing values required to render the validated party's blank form, including:

* Reviewed `partyDisplayName` and `greeting`.
* Explicit `wordingMode`.
* `maximumAttendance`.
* The authorized named-invitee `Plus1` prompt definitions and stable non-name allocation identifiers.
* Centralized RSVP deadline.
* `America/New_York` time-zone information.

The browser does not need the raw production code, private `partyId`, protected active/environment state, complete source row, unrelated guest names, or administrative notes.

The `questions` array uses the reusable structure defined in `rsvp-example-form-schemas.json` and contains the permanent substantive regions needed by the spreadsheet-authoritative model:

* Coordinated event attendance/decline control.
* Named-invitee `Plus1` response collection driven by the authorized allocation list.
* Four coordinated age-category attendance dials.
* Reception attendee-detail repetition driven by the current attendance total and Reception selection.
* Operational confirmation controls.

`confirmationOptions` identifies the enabled guest-confirmation channels and whether the selected SMS process requires transactional authorization.

Lookup never returns stored RSVP data merely because a current response exists. It does not return prior attendance selections, prior `Plus1` responses, prior age totals, prior attendee-detail records, prior confirmation contact information, delivery status, versions, or an `existingResponse`/`hasResponse` indicator.

The browser therefore cannot determine from lookup whether the eventual submission is an initial RSVP or revision. That remains authoritative on the backend.

### 4.6 Blank Personalized Form

React renders the personalized form on `/wedding/rsvp/` using only the limited lookup response.

Every lookup opens a blank substantive form and blank operational confirmation fields. No previously stored answer or contact destination is displayed or prefilled.

The blank form may still display invitation-specific static context returned by lookup, such as reviewed party heading, wording mode, maximum party size, and authorized named-invitee `Plus1` prompts.

### 4.7 Guest Completion

For an initial RSVP, the guest provides a complete valid substantive response for the current attendance state plus the required operational confirmation data.

For a revision, the guest may provide only substantive fields that need to change, except when a dependency requires a complete replacement structure. The operational confirmation object is always re-entered in full.

An attending initial response includes:

* Ceremony, Reception, or both.
* One Yes/No response for every authorized named-invitee `Plus1` allocation.
* Complete values for all four age-category totals.
* Exactly one complete Reception attendee-detail record per attending party member when Reception is selected.

A full decline contains the decline state and operational confirmation data but no attendance-dependent substantive values.

### 4.8 Client-Side Usability Validation

React may validate for usability before submission, including:

* Invitation-code presentation cleanup.
* Required fields.
* Mutually exclusive attendance/decline state.
* Yes/No completeness for authorized `Plus1` allocations.
* Whole-number age totals.
* Coordinated dial remaining-capacity limits.
* Overall attendance minimum and maximum.
* Reception attendee-detail list length.
* Attendee-name 100-character maximum.
* Dietary/allergy 1000-character maximum.
* Conditional operational confirmation fields.

All client validation is advisory. Express independently validates every submitted value, dependency, and authorization rule.

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

`changes` contains only substantive operations. The revised substantive vocabulary is:

* `eventAttendance`
* `additionalGuestResponses`
* `attendanceTotals`
* `receptionAttendeeDetails`

#### `eventAttendance`

A replacement value is a complete closed-set attendance selection:

* `['ceremony']`
* `['reception']`
* `['ceremony', 'reception']`
* `['decline']`

Order is not semantically significant. `decline` cannot coexist with an attending event.

#### `additionalGuestResponses`

This structure is keyed only by stable authorized allocation identifiers returned through the validated lookup configuration. Each submitted allocation response is Yes or No.

For an initial attending submission, every authorized allocation requires a response. For a revision, individual allocation responses may be omitted to remain unchanged unless an attendance transition makes a complete set newly required.

The backend never accepts an unknown allocation identifier and never uses the guest-facing name label itself as the authorization key.

#### `attendanceTotals`

The grouped value contains the four age categories. Initial attending submissions require all four. A revision may replace only selected nested category values; omitted nested categories remain unchanged. Numeric zero is an ordinary explicit replacement and is distinct from omission.

The backend derives `overallAttendance` from the complete merged four-category sum.

#### `receptionAttendeeDetails`

When submitted, this value replaces the complete applicable Reception attendee-detail list. Each item contains:

* `attendeeName` — required, nonblank, maximum 100 characters.
* `dietaryPreferences` — optional, maximum 1000 characters.

The list is applicable only when Reception is selected and its length must equal the complete merged `overallAttendance`.

Because a blank revision form never reveals stored attendee names or dietary text, a guest who elects to replace this structure must provide the complete replacement list. If Reception remains selected, overall attendance remains unchanged, and this structure is omitted during a revision, the stored list remains unchanged.

The exact JSON encoding is finalized in `rsvp-api-contract.md`; this section governs the semantics.

### 4.10 Server Revalidation

Express independently:

1. Normalizes the invitation code.
2. Enforces submission rate limits.
3. Confirms that the invitation is active and authorized for the current environment.
4. Enforces the backend-authoritative deadline.
5. Validates `clientSubmissionId` and idempotency behavior.
6. Validates operational confirmation fields.
7. Authorizes every submitted substantive field and `Plus1` allocation identifier.
8. Determines whether the request creates an initial response or revises an existing response.
9. Merges a revision with the current stored response.
10. Applies dependent clearing.
11. Validates the complete resulting RSVP.

The request does not authorize itself by supplying `maximumAttendance`, allocation labels, private identifiers, or source data. Those values come from the backend configuration.

### 4.11 Initial-Versus-Revision Determination

The browser does not send an `initial` or `revision` authority flag and lookup does not reveal existing-response state.

After authorization and idempotency checks, the backend determines whether a current RSVP already exists for the invitation:

* No current response: validate as an initial RSVP.
* Current response exists: merge the submitted changes as a revision.

### 4.12 Revision Merge

For a revision:

1. Load the current stored RSVP privately.
2. Apply submitted substantive replacement/clear operations.
3. Preserve omitted substantive values.
4. Treat explicit zero as a replacement, not omission.
5. Replace operational confirmation data with the newly submitted complete operational object.
6. Apply dependency clearing.
7. Determine whether the resulting state makes any complete structure newly required.
8. Validate the complete merged RSVP.

The blank-form policy does not weaken backend merge semantics; stored data may be used privately for merging without being returned to the browser.

### 4.13 Authoritative Conditional and Dependency Rules

#### 4.13.1 Dependency Processing Order

For an initial submission or merged revision, process in this order:

1. Establish the resulting attendance/decline state.
2. Apply automatic clearing for data made inapplicable by that state.
3. Establish the complete resulting authorized `Plus1` response map.
4. Establish the complete four-category attendance totals and derive `overallAttendance` when attending.
5. Determine whether Reception attendee details are applicable.
6. Enforce any newly required complete structures.
7. Validate final cross-field invariants.
8. Persist only after the complete result is valid.

#### 4.13.2 Attendance and Decline

The only valid substantive attendance states are:

* Ceremony only.
* Reception only.
* Ceremony and Reception.
* Full decline.

The backend rejects an empty attendance state on an initial submission and rejects any state combining `decline` with Ceremony or Reception.

#### 4.13.3 Full Decline and Automatic Dependent Clearing

A resulting full decline automatically clears:

* Ceremony and Reception selections.
* Every stored named-invitee `Plus1` response.
* All four age-category totals and derived overall attendance.
* The entire Reception attendee-detail list.

A successful declined current RSVP does not retain synthetic zero totals or empty attendee placeholders as substantive answers.

#### 4.13.4 Transition from Decline to Attending

When a revision changes a full decline into any attending state, the following become newly required:

* A Yes/No response for every authorized named-invitee `Plus1` allocation.
* Complete values for all four attendance-total categories.
* A complete Reception attendee-detail list if Reception is selected.

The backend must reject the merged result if newly applicable data is missing; it must not invent values from the invitation configuration or prior cleared response.

#### 4.13.5 Named-Invitee `Plus1` Dependency Rules

Authorized `Plus1` responses are applicable only while the party is attending Ceremony, Reception, or both.

For every authorized allocation:

* Initial attending response: exactly one Yes or No is required.
* Revision while attending: omission preserves the stored value unless the field is newly applicable after a prior decline.
* Unknown or unauthorized allocation identifier: reject.
* Any value other than the approved Yes/No representation: reject.

A row with no authorized allocations must not accept a `Plus1` response.

The number of allocations answered Yes must not exceed `overallAttendance`.

Changing a `Plus1` response does not authorize the backend to guess an age category or attendee name. Any attendance-total or Reception-detail changes required by the guest's real-world party remain separate explicit changes.

#### 4.13.6 Attendance-Total Dependency Rules

Attendance totals are applicable and required for every attending state.

The complete merged totals must:

* Contain all four categories.
* Use nonnegative whole numbers.
* Sum to at least one.
* Sum to no more than `maximumAttendance`.

The browser implements the spreadsheet-requested dial behavior: each dial's current upper bound equals the remaining invitation capacity after the other three current dial values are subtracted. The backend validates the equivalent complete sum and does not rely on the browser's control limits.

If a revision changes only selected nested age categories, omitted nested categories remain unchanged. If the resulting total changes while Reception remains selected, a complete replacement Reception attendee-detail list is required.

#### 4.13.7 Reception Attendee-Detail Dependency Rules

Reception attendee details are applicable if and only if Reception is selected.

When applicable, the complete list must:

* Contain exactly `overallAttendance` records.
* Contain a required nonblank `attendeeName` for each record, no more than 100 characters.
* Contain an optional `dietaryPreferences` string no more than 1000 characters for each record.
* Contain no additional unauthorized properties once the exact API schema is finalized.

If Reception is removed while Ceremony remains selected, the backend automatically clears the entire stored Reception attendee-detail list.

If Reception remains selected and `overallAttendance` changes, the previous list cannot remain authoritative because its cardinality is no longer valid. The revision must supply a complete replacement list matching the new total.

If Reception remains selected, `overallAttendance` is unchanged, and the attendee-detail structure is omitted, the stored list remains unchanged.

Ceremony-only attendance and full decline must not retain Reception attendee details.

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

Automatic clearing is used only when a dependency makes previously stored data inapplicable, including:

* Full decline clearing all attendance-dependent substantive data.
* Removing Reception clearing Reception attendee details.

The backend rejects, rather than silently clears, contradictory or unauthorized submitted values such as:

* Attendance together with decline.
* Unknown `Plus1` allocation identifiers.
* `Plus1` responses when the invitation authorizes none.
* Negative, fractional, or above-capacity age totals.
* Attending total below one or above the invitation maximum.
* More Yes `Plus1` responses than the complete attendance total can contain.
* Reception attendee details when Reception is not selected.
* Reception attendee-detail count different from `overallAttendance`.
* Missing or overlength attendee names.
* Overlength dietary/allergy text.
* Obsolete production profile fields or identifiers.

When a transition makes a structure newly applicable, missing required data produces a validation failure rather than guessed data.

### 4.14 Invalid Resulting State

If the complete initial or merged response violates authorization, requiredness, dependency, or value rules, the backend returns guest-safe validation information and stores nothing for that attempt.

A validation failure does not reveal the stored value of an omitted revision field.

### 4.15 Versioned Storage

After successful validation, the backend atomically records a new RSVP version and designates it as the authoritative current response.

The stored current substantive response includes the normalized attendance state and, when applicable:

* Authorized `Plus1` responses keyed by stable allocation identifiers.
* Four age-category totals and derived overall attendance.
* Complete Reception attendee-detail records.

The backend also stores the current operational confirmation data required to support confirmation delivery and approved manual resend.

A revision does not create a second active current-response row; it advances the authoritative version while preserving version history.

### 4.16 Protected Administrative Confirmation

After storage succeeds, the backend attempts a protected administrative email containing the complete current RSVP under the spreadsheet-authoritative model.

The administrative confirmation may include the invited party identity and the applicable Reception attendee names/dietary information because it is private correspondence to the approved administrative destination.

### 4.17 Guest Confirmation

After storage succeeds, the backend independently attempts the guest's selected confirmation channel.

The guest confirmation contains the complete current guest-facing RSVP, not merely the changed fields. It includes:

* Ceremony/Reception or decline state.
* Every applicable named-invitee `Plus1` Yes/No response.
* Four age-category totals and derived overall attendance when attending.
* Complete Reception attendee names and dietary/allergy responses when Reception is selected.
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

An initial attending response must provide a complete valid state:

* Ceremony, Reception, or both.
* One Yes/No answer for every authorized named-invitee `Plus1` allocation.
* All four age-category totals.
* A total from one through `maximumAttendance`.
* Exactly one complete Reception attendee-detail record per attending person if Reception is selected.
* Complete operational confirmation data.

An initial full decline supplies the decline state plus complete operational confirmation data and does not retain attendance-dependent substantive structures.

### 5.2 Revision

A revision begins from a new manual invitation-code entry and another blank form. The browser never receives the current stored RSVP simply because the guest is revising it.

The guest may submit only fields intended to change, subject to dependency rules:

* Omitted substantive values remain unchanged.
* Submitted replacements replace stored values.
* Explicit numeric zero is a replacement.
* Authorized clear operations are distinct from omission.
* Nested attendance-total categories may be partially replaced.
* Individual authorized `Plus1` allocation responses may be replaced independently.
* Reception attendee details, when submitted, replace the complete applicable list.
* If overall attendance changes while Reception remains selected, a complete replacement attendee-detail list is required.
* Removing Reception or fully declining clears Reception attendee details automatically.
* Full decline clears all attendance-dependent substantive data.
* Changing from decline to attendance makes the complete attending structures newly required.

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
* Rendering the authorized named-invitee `Plus1` prompts returned for that invitation.
* Managing the coordinated attendance checkboxes and numerical dial usability limits.
* Repeating Reception attendee-detail inputs according to the guest's current page-entered attendance total.
* Collecting initial responses or selected revision fields.
* Collecting operational confirmation data.
* Performing non-authoritative usability validation.
* Generating a new UUID-form `clientSubmissionId` for each genuinely new logical RSVP action.
* Preserving that identifier for a safe retry of the same logical action.
* Sending RSVP submissions.
* Displaying guest-safe validation, confirmation, warning, and fallback states.

React is not authoritative for:

* Whether an invitation code is valid, known, active, or environment-eligible.
* Which named-invitee `Plus1` allocations are authorized.
* The source mapping behind a displayed allocation prompt.
* `maximumAttendance` beyond the limited value returned for form rendering.
* Whether submitted substantive fields are authorized.
* Whether a request is an initial response or revision.
* Whether omitted stored values should remain or be cleared.
* Final attendance arithmetic or attendee-list cardinality.
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
* Selection of guest-facing wording and authorized `Plus1` allocation prompts.
* Maximum-attendance enforcement.
* Field and allocation authorization.
* Submission revalidation.
* Deadline enforcement.
* Initial-versus-revision determination.
* Loading the current RSVP privately.
* Partial-revision merging.
* Explicit replacement/clear authorization.
* Dependent-value clearing.
* Complete resulting-state validation.
* Reception attendee-detail cardinality and length limits.
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
* Maximum attendance.
* Integer derived count of authorized `Plus1` allocations.
* Stable allocation identifiers and authorized named-invitee labels for those allocations.
* Protected active and environment classifications.
* Current RSVP responses.
* Superseded RSVP versions.
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

### 7.12 Production Code-Set Audit

The authoritative private `Invitees List` has been audited under the normalization rules above.

Current validation targets are:

* 57 active assigned invitation records.
* 57 successfully normalized canonical keys.
* 57 unique canonical keys.
* No normalization collisions.
* 35 singular `I` wording records.
* 22 plural `we` wording records.
* 23 records authorizing at least one `Plus1` allocation.
* 26 total `Plus1` allocations.
* Two records containing more than one `Plus1` allocation.
* Combined maximum-attendance capacity of 115.
* No required active production placeholder record.

These values validate the source transformation. They must not be hard-coded into reusable form-rendering, lookup, or submission logic.

The real production code values and code-to-party mappings remain private.

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

The response may contain reviewed party display/greeting text, wording mode, maximum attendance, authorized named-invitee `Plus1` prompt definitions with stable non-name allocation identifiers, reusable question definitions, deadline/time-zone information, and enabled confirmation options.

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
* Authorized named-invitee `Plus1` prompt definitions and stable non-name allocation identifiers.
* The reusable spreadsheet-authoritative substantive question definitions and validation metadata needed by the browser.
* RSVP deadline and authoritative time-zone display information.
* Enabled confirmation options and provider-neutral authorization metadata where applicable.

The browser may derive the current number of authorized `Plus1` allocations from the returned authorized allocation definitions; it does not need the private source row.

### 10.2 Lookup Must Not Return

Lookup must not return:

* The canonical production invitation code merely to echo it after validation.
* Other invitation codes.
* Another invitation's data.
* Complete spreadsheet rows.
* Private `partyId` or similar internal identifiers.
* Protected active/environment state.
* Unrelated named invitees or `Plus1` mappings.
* Private administrative notes.
* Stored attendance selections or decline state.
* Stored `Plus1` answers.
* Stored attendance totals.
* Stored Reception attendee names or dietary/allergy text.
* Stored confirmation method or destination.
* Stored SMS authorization.
* Stored delivery status.
* RSVP versions or history.
* `existingResponse`, `hasResponse`, or an equivalent prior-submission indicator.
* Credentials, secrets, spreadsheet identifiers, or protected administrative destination information.

### 10.3 Submission Confirmation May Return

After successful storage, the limited submission response may return the complete current guest-facing RSVP needed by the temporary confirmation experience:

* Attendance/decline state.
* Every applicable named-invitee `Plus1` Yes/No response with its authorized guest-facing prompt label.
* Four age-category totals and derived overall attendance when attending.
* Complete Reception attendee names and dietary/allergy values when Reception is selected.
* Initial/revision action designation.
* Recorded timestamp.
* Selected guest confirmation method.
* Guest delivery status.
* Limited administrative-delivery status.
* Deadline, revision policy, and assistance information.

The confirmation response must omit inapplicable conditional data and must not expose the canonical invitation code, private record identifiers, workbook details, full version history, provider credentials, or the protected administrative address.

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
* Render the blank coordinated Ceremony / Reception / decline checkbox interface.
* Render one blank Yes/No question per authorized named-invitee `Plus1` allocation.
* Render the four age-category dials at zero with coordinated remaining-capacity behavior once the guest enters an attending state.
* Render Reception attendee-detail inputs only after Reception is selected and according to the current page-entered attendance total.
* Render the applicable blank operational confirmation controls.
* Display maximum-attendance guidance where useful.
* Display no stored answers, contact destinations, response version, or existing-response indicator.

The same State 5 serves both potential initial submissions and potential revisions. The browser does not know which one it is until the backend processes the submission.

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
* Authorized named-invitee `Plus1` prompt definitions.
* Current unsaved form values.
* The current dial-derived overall attendance value.
* Current unsaved Reception attendee-detail rows.
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

The development fixture registry remains deliberately fictional and must stay isolated from production invitation data. The synthetic `DEVxxx` code family is used only for development/testing examples and must never be authorized as production invitation data.

### 13.1 Development-Only Constraints

Development fixtures must:

* Use only obviously synthetic `DEVxxx` canonical codes and `DEV-xxx` display forms.
* Use fictional party names.
* Be marked for development/test use only.
* Never contain or derive from production invitation codes or guest identities.
* Exercise the same structural rules as production configurations.
* Include at least one inactive fixture for neutral invalid/inactive behavior.

### 13.2 Configuration Fixtures Versus Behavioral Scenarios

Invitation configuration fixtures represent only stable invitation authorization/configuration:

* Wording mode.
* Maximum attendance.
* Authorized named-invitee `Plus1` allocation definitions.
* Active/environment state.

Attendance selections, RSVP answers, existing-response state, delivery outcomes, and idempotency outcomes are behavioral scenario overlays and are not invitation-configuration fields.

### 13.3 Compatibility with Form-Schema Examples

`rsvp-example-configurations.json` and `rsvp-example-form-schemas.json` must be revised together so that fixture configuration and schema examples use the spreadsheet-authoritative field vocabulary.

The active example architecture must not contain a production-style `questionProfile` property or a reduced-profile fixture.

### 13.4 Development Configuration Registry

The revised registry should retain the existing fictional canonical code set where practical so test references remain stable, while changing the configuration meaning to the new model:

| Fixture | Primary configuration purpose | Wording | Maximum | Named `Plus1` allocations | Active |
|---|---|---|---:|---:|---:|
| `DEV001` / `DEV-001` | Singular, no `Plus1` | singular | 1 | 0 | Yes |
| `DEV002` / `DEV-002` | Plural household, no `Plus1` | plural | 5 | 0 | Yes |
| `DEV003` / `DEV-003` | Singular, one named `Plus1` allocation | singular | 2 | 1 | Yes |
| `DEV004` / `DEV-004` | Plural, one named `Plus1` allocation | plural | 4 | 1 | Yes |
| `DEV005` / `DEV-005` | Ceremony-only behavioral base | plural | 4 | 0 | Yes |
| `DEV006` / `DEV-006` | Reception-only behavioral base | singular | 2 | 1 | Yes |
| `DEV007` / `DEV-007` | Combined-attendance behavioral base | plural | 3 | 0 | Yes |
| `DEV008` / `DEV-008` | Existing-response revision base | plural | 3 | 0 | Yes |
| `DEV009` / `DEV-009` | Multiple named `Plus1` allocations | plural | 7 | 3 | Yes |
| `DEV010` / `DEV-010` | Capacity/reception-detail boundary base | plural | 4 | 1 | Yes |
| `DEV999` / `DEV-999` | Disabled guard fixture | plural | 2 | 1 | No |

The precise fictional names and stable allocation IDs are defined in the revised JSON fixture document. They must remain synthetic.

### 13.5 Archetype A — Singular, No Additional Guest

Purpose:

* Exercise singular wording.
* Exercise `maximumAttendance: 1`.
* Confirm no named `Plus1` question is returned.
* Confirm an attending response still requires all four age-category totals.
* Confirm Reception selection creates exactly one attendee-detail row when overall attendance is one.

### 13.6 Archetype B — Plural Household, No Additional Guest

Purpose:

* Exercise plural wording.
* Exercise a larger party maximum without any authorized `Plus1` allocation.
* Confirm the renderer remains one reusable form rather than a household-specific form.

### 13.7 Archetype C — Singular, One Named `Plus1` Allocation

Purpose:

* Exercise one authorized allocation.
* Confirm exactly one Yes/No prompt is rendered using its authorized named-invitee label.
* Confirm the submitted response is keyed by the stable allocation identifier rather than by the display label.
* Confirm the additional guest's own name is not requested in the allocation question.

### 13.8 Archetype D — Plural, One Named `Plus1` Allocation

Purpose:

* Exercise plural wording with one allocation.
* Confirm the same reusable schema handles a household and an authorized `Plus1` question.

### 13.9 Archetype E — Ceremony Only

Behavioral scenario:

* Event state is Ceremony only.
* Authorized `Plus1` questions are answered as applicable.
* Four age totals are present.
* Reception attendee details are absent and unauthorized.

### 13.10 Archetype F — Reception Only

Behavioral scenario:

* Event state is Reception only.
* Four age totals produce a positive `overallAttendance`.
* The Reception attendee-detail list contains exactly that many entries.
* Every entry has a nonblank attendee name; dietary text may be blank.

### 13.11 Archetype G — Entire Party Declines

Behavioral scenario:

* Event state is full decline.
* `Plus1` responses are absent from the resulting current RSVP.
* Attendance totals are absent.
* Reception attendee details are absent.
* Operational confirmation remains required.

### 13.12 Archetype H — Existing Response Revision

A fictional stored starting response is created only in the private test scenario, never returned by lookup.

The revision flow must prove:

* Lookup is still blank.
* Omitted substantive fields retain stored values.
* An individual authorized `Plus1` response may be replaced.
* A selected age total may be replaced with explicit zero while other nested totals remain unchanged.
* Removing Reception automatically clears stored Reception attendee details.
* If Reception remains selected and total attendance changes, a complete replacement attendee-detail list is required.
* The guest re-enters operational confirmation data.
* The successful confirmation shows the complete merged RSVP.

### 13.13 Archetype I — Multiple Named `Plus1` Allocations

Purpose:

* Exercise more than one authorized allocation without converting them into one aggregate count control.
* Confirm one separate Yes/No prompt per allocation.
* Confirm each response uses its own stable identifier.
* Confirm the number of Yes responses cannot exceed complete overall attendance.
* Confirm changing allocation responses does not cause the backend to invent age totals or attendee names.

### 13.14 Archetype J — Capacity and Reception-Detail Boundary

Purpose:

* Exercise coordinated dial capacity at the invitation maximum.
* Confirm no dial can increase beyond remaining capacity in the browser.
* Confirm the backend rejects a sum over the maximum even if client controls are bypassed.
* Confirm Reception attendee-detail count must exactly equal overall attendance.
* Confirm attendee-name and dietary-length limits.

### 13.15 Disabled Development Guard Fixture

`DEV999` remains inactive. Lookup must treat it neutrally as an invalid/not-found invitation without disclosing that an inactive development record exists.

### 13.16 Confirmation-Channel Scenario Overlay

Run applicable fixtures with Email confirmation and, only in environments where the SMS gate is intentionally enabled for testing, Text Message confirmation.

Operational confirmation data is separate from substantive invitation configuration.

### 13.17 Delivery-Warning Scenario Overlay

After successful storage, independently simulate guest-delivery and administrative-delivery failure/uncertainty. The stored RSVP remains successful and no additional version is created merely because delivery failed.

### 13.18 Idempotent Safe-Retry Scenario Overlay

Simulate an uncertain client outcome and replay the materially identical request using the same `clientSubmissionId`. The backend must return the existing logical result without creating another RSVP version or duplicate delivery effects beyond the defined idempotency policy.

### 13.19 Initial-versus-Revision Determination Across Archetypes

Lookup never exposes whether a current response exists. Submission processing decides initial versus revision only after backend authorization and current-response lookup.

### 13.20 Production Isolation

Development fixture codes, fictional names, and test records must never be transformed into active production records. Production source data must never be copied into the fictional fixture registry.

### 13.21 Step 11 Cross-Document Boundary

The revised fixture registry must remain synchronized with:

* `rsvp-example-configurations.json`
* `rsvp-example-form-schemas.json`
* `rsvp-api-contract.md`
* `rsvp-test-cases.md`

The fixture examples may illustrate current behavior but cannot override the authoritative spreadsheet, `decisions.md`, or `requirements.md`.

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
* Named-invitee `Plus1` allocation mappings or responses.
* Reception attendee names.
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
* Named-invitee `Plus1` allocation mappings or responses.
* RSVP request or response bodies.
* Attendance totals.
* Reception attendee names.
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
* Authorized named-invitee `Plus1` allocation mappings.
* Current RSVP responses and version history.
* Reception attendee names and dietary/allergy information.
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

### 15.17 Protected Reception Attendee and Dietary/Allergy Information Boundary

Reception attendee names and dietary/allergy information are private RSVP content.

They may appear only in:

* The submitting party's own temporary on-screen confirmation.
* The submitting party's own selected electronic RSVP confirmation.
* The protected administrative confirmation.
* Authorized private administrative records required to operate the RSVP.

They must not appear in analytics, public pages, public metadata, ordinary logs, unrelated administrative messages, or another invited party's information.

Dietary/allergy text is collected only within the Reception attendee-detail structure. Ceremony-only attendance and full decline do not retain Reception attendee-detail data.

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
* Reception attendee names and dietary/allergy text.
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

The privacy/security rules apply at every stage of the current spreadsheet-authoritative data flow:

1. Manual code entry occurs only on `/wedding/rsvp/`.
2. Invitation codes travel to lookup and submission only in request bodies.
3. Lookup returns only the limited blank-form configuration, including authorized named-invitee `Plus1` prompts but no stored answers.
4. The browser collects attendance state, authorized `Plus1` responses, age totals, conditional Reception attendee details, and operational confirmation data.
5. Submission is rate-limited and independently revalidated by Express.
6. Revisions merge privately with stored state; lookup never reveals that state.
7. Dependency processing clears inapplicable stored data before final validation.
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

Phase 3 Step 1 remains complete because the design preserves one authoritative backend-mediated flow from manual invitation lookup through blank personalized rendering, validated submission/revision, storage, independent delivery attempts, and temporary confirmation.

The synchronized flow now carries named-invitee `Plus1` responses, age-category totals, and conditional Reception attendee details rather than the superseded profile-specific substantive model.

---

## 17. Phase 3 Step 2 Completion Check

Phase 3 Step 2 remains complete because:

* The normalization algorithm is unchanged.
* Every current production code normalizes successfully.
* The authoritative source contains 57 unique canonical keys with no collisions.
* The renderer does not depend on the fixed count.
* Production code values remain private.

---

## 18. Phase 3 Step 3 Completion Check

Phase 3 Step 3 remains complete because manual code entry at `/wedding/rsvp/` remains the sole personalized access method, codes remain out of browser URLs, lookup uses a POST body, Express independently validates the code, and valid lookup returns only a limited blank form.

---

## 19. Phase 3 Step 7 Completion Check

The lookup-boundary design is synchronized because:

* Success returns exactly `invitation`, `questions`, and `confirmationOptions`.
* `invitation` exposes reviewed party context, wording mode, maximum attendance, and authorized named-invitee `Plus1` prompt definitions only as needed for rendering.
* No production form-configuration identifier is needed.
* Lookup returns no stored RSVP answers, contact destinations, versions, or existing-response indicator.
* Private IDs, active/environment flags, source rows, and unrelated guest mappings remain backend-only.

---

## 20. Phase 3 Step 8 Completion Check

The submission model is synchronized because:

* The four-property request envelope remains `inviteCode`, `clientSubmissionId`, `confirmation`, and `changes`.
* Operational confirmation data remains separate from substantive RSVP changes.
* Substantive changes now cover event attendance, authorized named-invitee `Plus1` responses, age-category totals, and conditional Reception attendee details.
* Omission, replacement, explicit zero, and authorized clearing remain distinct.
* Reception attendee details use complete-list replacement semantics when submitted.
* Safe retry continues to reuse the same logical request and `clientSubmissionId`.
* The browser still does not send `expectedVersion`.

---

## 21. Phase 3 Step 9 Completion Check

The dependency rules are synchronized because:

* Attendance and decline remain mutually exclusive.
* Full decline clears all attendance-dependent substantive data.
* Transition from decline to attendance makes authorized `Plus1` responses and all four age totals newly required, plus Reception attendee details when applicable.
* Every authorized `Plus1` allocation has its own Yes/No state.
* Attending totals must be whole numbers whose sum is from one through `maximumAttendance`.
* Browser dials use remaining-capacity limits; Express independently validates the final sum.
* Reception attendee details are applicable only when Reception is selected and must contain exactly one record per attending person.
* Removing Reception clears the attendee-detail list.
* Changing attendance total while Reception remains selected requires a complete replacement attendee-detail list.
* Unauthorized and contradictory submitted fields are rejected rather than guessed.

---

## 22. Phase 3 Step 10 Completion Check

The thirteen-state interface model remains complete. The top-level states and transition precedence are unchanged; State 5, State 6, and confirmation-state content now render the spreadsheet-authoritative substantive structure.

---

## 23. Phase 3 Step 11 Completion Check

The development-archetype design is synchronized because the fictional fixture set now covers:

* Singular and plural wording.
* Zero, one, and multiple named-invitee `Plus1` allocations.
* Different maximum-attendance values.
* Ceremony-only, Reception-only, combined attendance, and decline behavioral scenarios.
* Reception attendee-detail repetition and length limits.
* Existing-response partial revision.
* Capacity-boundary validation.
* Disabled fixture behavior.
* Confirmation-channel, delivery-warning, and idempotent safe-retry overlays.

Development fixtures remain distinct from production data and do not use the superseded reduced-profile architecture.

---

## 24. Phase 3 Step 12 Completion Check

The preliminary test catalog must be revised to exercise the synchronized model. Its required coverage now includes:

* Invitation normalization and neutral lookup failures.
* Blank-form privacy.
* Named-invitee `Plus1` prompt authorization and response validation.
* Dial capacity and final attendance arithmetic.
* Reception attendee-detail cardinality and text-length limits.
* Ceremony-only and Reception-only conditional behavior.
* Full-decline clearing and decline-to-attendance newly required values.
* Partial revisions, explicit zero, complete attendee-list replacement, and omission semantics.
* Storage/version/idempotency behavior.
* Independent guest/admin delivery outcomes.
* All thirteen interface states.
* Privacy/security boundaries and the data-retirement schedule.

Until `rsvp-test-cases.md` is replaced in the approved document-revision sequence, this section states the controlling synchronized expectation.

---

## 25. Phase 3 Step 13 Completion Check

Phase 3 Step 13 remains complete because successful confirmation state still comes from the limited post-storage submission response carried through temporary React state; absent or unusable temporary state still produces State 12 without automatic saved-RSVP retrieval, submission replay, new idempotency identifiers, or personalized confirmation URLs.

---

## 26. Phase 3 Step 14 Completion Check

Phase 3 Step 14 remains complete and is synchronized with the current data model because:

* Invitation codes remain limited access tokens and request-body-only values.
* Personalized RSVP and confirmation responses use `Cache-Control: no-store, max-age=0` and remain non-indexed.
* Analytics and routine logs exclude invitation codes, RSVP answers, named-invitee allocation mappings/responses, Reception attendee names, dietary/allergy data, confirmation destinations, private identifiers, and secrets.
* Lookup and submission retain the approved rate limits and trusted-proxy boundary.
* Google, email, SMS, sender, and protected administrative-recipient credentials remain backend-only.
* Production and development/test invitation data remain separated.
* Guest-safe errors reveal no enumeration, infrastructure, provider, or spreadsheet details.
* Reception attendee names and dietary/allergy information are restricted to the submitting party's authorized confirmation surfaces and protected administrative records.
* Text Message confirmation remains provider-gated.
* Active RSVP-operational data is retired no later than July 30, 2027 except for a documented minimal administrative need, and protected backups expire by August 29, 2027.
* The separate private `Invitees List` may remain a personal planning/address record without keeping the public RSVP application dependent on retired response history.
* Production RSVP traffic uses HTTPS.

With this synchronization, **Phase 3 — Design the RSVP System remains complete under the authoritative spreadsheet-driven RSVP model.**

---

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
