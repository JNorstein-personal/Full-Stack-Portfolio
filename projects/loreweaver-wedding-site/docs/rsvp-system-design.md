# RSVP System Design

**Project:** Loreweaver Creations Wedding Website
**Phase:** Phase 3 — Design the RSVP System
**Current completion:** Phase 3 through Step 14 — RSVP Architecture, Submission/Revision Payload Model, Conditional/Dependency Rules, Explicit React Interface State Model, Fictional Development Archetypes, Preliminary RSVP Test Catalog, Finalized Confirmation Refresh Behavior, and Finalized Privacy and Security Rules
**Phase 3 status:** Complete
**Last updated:** August 21, 2026

---

## 1. Purpose and Status

This document specifies the architecture, end-to-end data flow, trust boundaries, invitation-code normalization rules, sole RSVP access method, limited blank-form response boundary, exact submission/partial-revision payload model, authoritative conditional/dependency rules, explicit React interface-state model, fictional development archetypes, finalized confirmation-refresh behavior, and mandatory privacy and security rules of the RSVP system for the Loreweaver Creations wedding website.

Phase 3 defines how one reusable RSVP application:

* Accepts a manually entered invitation code.
* Normalizes that invitation code consistently in React and Express, with Express authoritative.
* Uses a private invitation-party configuration to determine the applicable personalized form.
* Returns only the information necessary to render a blank guest-facing form.
* Supports the approved `default` and `reduced-attendance-dietary` substantive question profiles.
* Supports zero, one, or multiple authorized additional guests through a nonnegative integer `additionalGuestAllowance`.
* Accepts either a complete initial RSVP or selected changes to an existing RSVP.
* Merges partial revisions with the current stored response on the backend.
* Validates the complete resulting RSVP.
* Stores one authoritative current RSVP while preserving version history.
* Sends complete guest and administrative confirmations after successful storage.
* Prevents private invitation and RSVP data from being exposed through browser URLs or unnecessary frontend data.
* Applies the finalized Phase 3 Step 14 privacy and security standard for caching, indexing, analytics, logs, rate limiting, credentials, administrative access, SMS use, retention, and production transport.

At the completion of **Phase 3 Step 1**, this document establishes the authoritative high-level RSVP data flow.

At the completion of **Phase 3 Step 2**, this document also establishes:

* The exact ordered invitation-code normalization process.
* The relationship among guest-entered, canonical, and display representations.
* The accepted presentation variations.
* The rejected malformed-input categories.
* The requirement that React and Express exhibit the same observable normalization behavior.
* The requirement that Express independently normalize every lookup and submission.
* The rule that runtime validation does not re-enforce the historical minimum-letter code-generation constraint.
* The production-source normalization and collision audit.

At the completion of **Phase 3 Step 3**, this document also establishes:

* The static invitation QR code as a public-homepage link rather than a personalized RSVP link.
* Manual entry of the printed invitation code at `/wedding/rsvp/` as the sole personalized RSVP access method.
* Client-side cleanup as a usability step only.
* Submission of the invitation code in a POST request body rather than in a browser URL.
* Preservation of `/wedding/rsvp/` as the browser route during lookup and validated-form rendering.
* Independent backend normalization and validation.
* Limited blank-form schema return after a valid lookup.
* Neutral guest-facing handling for invalid or unknown codes.
* The prohibition on direct personalized browser links.

Phase 3 Steps 4–6 are recorded in the associated RSVP documentation:

* Step 4 defines the preliminary backend endpoints and status semantics in `rsvp-api-contract.md`.
* Step 5 defines fictional private invitation-configuration examples in `rsvp-example-configurations.json`.
* Step 6 defines the reusable personalized form-schema shape in `rsvp-example-form-schemas.json`.

At the completion of **Phase 3 Step 7**, this document and `rsvp-api-contract.md` also establish:

* The exact successful lookup response boundary.
* The permitted guest-facing `invitation` fields.
* The applicable `questions` array.
* The `confirmationOptions` object.
* Profile- and allowance-specific question filtering.
* The blank-form invariant for both initial and revision access.
* The prohibition on stored-response indicators and unnecessary private configuration in lookup responses.

At the completion of **Phase 3 Step 8**, this document and `rsvp-api-contract.md` also establish:

* The exact four-property submission request envelope.
* UUID-form client submission identifiers and idempotent-retry behavior.
* Separate operational confirmation and substantive `changes` objects.
* `replace` and `clear` operation semantics.
* Explicit-zero representation through `replace` values.
* Exact attendance/decline, additional-guest, attendance-total, and dietary payload representation.
* Initial-submission completeness and partial-revision omission rules.
* The decision not to expose or accept `expectedVersion` in the current browser contract.
* The exact successful response envelope used by the temporary confirmation route.
* Public delivery-status values and post-storage delivery-warning behavior.

At the completion of **Phase 3 Step 9**, this document, `rsvp-api-contract.md`, and `rsvp-example-form-schemas.json` also establish:

* The authoritative ordering for revision merge, dependent-value adjustment, newly applicable requirements, and final validation.
* The complete attendance-versus-decline state rules.
* Automatic clearing of substantive values that become inapplicable when the party fully declines.
* The conditions under which additional-guest responses and default-profile attendance totals are applicable and required.
* The relationship between authorized additional-guest counts and complete party attendance totals.
* Party-level dietary applicability for any attending state—Ceremony only, Reception only, or both—and automatic clearing only when the party fully declines.
* The closed-set behavior of the `default` and `reduced-attendance-dietary` profiles.
* The exact operational confirmation dependencies for Email and Text Message.
* The distinction between unauthorized fields, contradictory values, missing newly required values, and stale stored dependent values that the backend clears.
* The requirement that Express enforce all dependency rules regardless of client-side visibility.

At the completion of **Phase 3 Step 10**, this document, `page-outlines.md`, and `wireframes.md` also establish:

* Thirteen explicit top-level RSVP interface states rather than a loose collection of loading, form, error, and confirmation conditions.
* The route on which each state appears and the conditions that may enter that state.
* The browser-visible responsibilities, accessibility behavior, and data-retention boundaries of every state.
* The allowed transitions among lookup, blank-form, validation, submission, uncertainty, confirmation, warning, refresh-fallback, and closed states.
* The distinction between a known pre-storage service failure and an uncertain submission outcome.
* The requirement that a safe retry from the uncertain state reuse the same logical request and `clientSubmissionId`.
* The requirement that successful storage always leads to an appropriate confirmation or success-with-delivery-warning state rather than back to an editable submission state.
* The requirement that the RSVP-closed state remove editable lookup and form controls without erasing a confirmation that already proves successful storage.
* The mapping between the formal React state model and the existing browser-facing Phase 2 page outlines and low-fidelity wireframes.

At the completion of **Phase 3 Step 11**, this document and `rsvp-example-configurations.json` also establish:

* A clearly fictional development-only configuration registry using canonical `DEVxxx` codes and derived `DEV-xxx` display values.
* The required original archetypes for singular/plural wording, no-additional-guest and one-additional-guest behavior, Ceremony-only attendance, Reception-only attendance, full decline, and existing-response revision.
* Additional archetypes required by the current approved architecture for multiple additional guests and the `reduced-attendance-dietary` profile.
* A disabled development guard fixture used to exercise inactive-code behavior without exposing existence to guests.
* Preservation of `DEV001`–`DEV004` as the existing example codes referenced by `rsvp-example-form-schemas.json`.
* The distinction between invitation configuration fixtures and behavioral scenario overlays so attendance, decline, stored response, delivery, and idempotency state are not invented as invitation-configuration fields.
* A fictional existing-response revision fixture that preserves the blank-form invariant while exercising partial merge, explicit zero, explicit clear, complete merged confirmation, and newly entered operational confirmation data.
* Delivery-warning and idempotent safe-retry scenario overlays that preserve the Step 8 storage/idempotency model and the Step 10 interface-state model.
* Mandatory separation between development fixtures and the production invitation source.

At the completion of **Phase 3 Step 12**, `rsvp-test-cases.md` also establishes:

* The controlling preliminary RSVP test catalog for later implementation and execution.
* Coverage for invitation-code normalization and lookup, API boundaries, invitation configuration, blank-form privacy, attendance/dependency logic, additional guests, attendance totals, dietary behavior, initial submissions, partial revisions, operational confirmation channels, storage, idempotency, delivery, interface states, confirmation routing, deadline behavior, accessibility, and the privacy boundaries already approved before Step 14.
* Direct use of the Step 11 fictional development archetypes and disabled guard fixture as the preferred test inputs.
* Explicit tests for the current no-`expectedVersion` contract rather than reviving an obsolete ordinary `409 Conflict` flow.
* Explicit identification of confirmation-refresh details assigned to Step 13 and privacy/security details assigned to Step 14 rather than inventing those later-step requirements prematurely.

At the completion of **Phase 3 Step 13**, this document, `rsvp-api-contract.md`, `page-outlines.md`, `wireframes.md`, and `rsvp-test-cases.md` also establish:

* The finalized lifecycle of the temporary successful-submission response used by `/wedding/rsvp/confirmation`.
* The rule that the confirmation renderer is driven by the presence of a structurally usable temporary successful-submission response, not by the mere fact that a browser refresh occurred.
* Continued display of State 9, 10, or 11 when a valid temporary successful response remains available, including after a history traversal or reload that happens to preserve that state.
* Entry into State 12 — Confirmation Refresh Fallback whenever the confirmation route loads without the temporary successful response required to prove and display the just-completed RSVP.
* The rule that State 12 performs no automatic RSVP lookup, response reconstruction, submission replay, or new mutation.
* The rule that the initial implementation requires no short-lived confirmation token, confirmation-recovery endpoint, code-bearing URL, or other new public API solely to make confirmation details survive refresh.
* Final guest-facing fallback wording, return-to-RSVP behavior, assistance behavior, and accessibility expectations.
* The continued prohibition on placing invitation codes, RSVP summaries, confirmation destinations, or other personalized confirmation content in browser URLs merely to preserve a confirmation across refresh.

At the completion of **Phase 3 Step 14**, this document and the approved Step 14 decision set also establish:

* Invitation codes as limited access tokens rather than passwords.
* No public guest directory, code-recovery search, fuzzy/close-match suggestion, personalized code-bearing route, or public saved-RSVP lookup.
* Request-body-only invitation-code transport for the approved RSVP flows.
* `Cache-Control: no-store, max-age=0` for personalized RSVP browser documents and lookup/submission API responses.
* Search-engine exclusion and metadata restrictions for RSVP, confirmation, not-found, and other transactional states.
* A strict analytics data-minimization boundary that excludes invitation codes, RSVP answers, contact destinations, dietary information, submission identifiers, and other personalized RSVP data.
* A routine logging boundary that excludes raw invitation codes, RSVP bodies, contact destinations, dietary information, client submission identifiers, private workbook data, and secrets.
* Concrete initial production rate limits for lookup and submission, including trusted-proxy handling.
* Backend-only Google, email, SMS, sender, and protected administrative-recipient credentials.
* Mandatory separation of production and development/test invitation data and secrets.
* Guest-safe error requirements.
* The protected dietary-information and administrative-confirmation boundary.
* Transactional-only use of RSVP mobile numbers and a provider-specific SMS disclosure gate before Text Message confirmation may be enabled in production.
* A prohibition on unsupported promises of absolute security.
* The finalized RSVP-operational data retirement date of July 30, 2027 and protected backup retirement deadline of August 29, 2027.
* Mandatory HTTPS for production guest traffic.

With Step 14 documented, **Phase 3 is complete**.

The approved Phase 1 and Phase 2 documentation remains controlling. This document must remain consistent with:

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

The application must load invitation records dynamically. Form-rendering, validation, lookup, and submission logic must not assume that the production invitation count will always remain fixed at 56.

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

### 2.3 Party-Level RSVP Question Profiles

The RSVP system operates at the invited-party level.

Every production invitation explicitly selects one of the approved substantive question profiles.

#### `default`

The `default` profile contains:

1. Invitation-specific attendance wording using the configured singular or plural mode.

   * Guests may select Ceremony, Reception, or both.
2. A mutually exclusive invitation-specific decline response.
3. The applicable additional-guest control determined by `additionalGuestAllowance`.
4. Four party attendance totals:

   * Adults, ages 21 and older.
   * Young Adults, ages 18–20.
   * Children, ages 3–17.
   * Children under 3.
5. One party-level free-text response requesting food allergies or dietary preferences.

For the `default` profile:

* `additionalGuestAllowance` is a nonnegative integer.
* An allowance of `0` produces no additional-guest question.
* An allowance of `1` produces “Will you be accompanied by a +1?” with Yes and No answers.
* An allowance greater than `1` produces a bounded whole-number or select control asking how many additional guests will accompany the invited party.
* The permitted additional-guest count ranges from `0` through the configured allowance.
* No additional guest's name is requested.
* The sum of the four age-category attendance totals represents the complete attending party, including every attending additional guest.
* The total may not exceed `maximumAttendance`.

#### `reduced-attendance-dietary`

The `reduced-attendance-dietary` profile contains only:

1. Ceremony and Reception attendance using the applicable singular or plural wording, or the mutually exclusive decline response.
2. One party-level free-text response requesting food allergies or dietary preferences.

The reduced profile does not render or accept:

* An additional-guest response.
* Adults, Young Adults, Children, or Children-under-3 totals.
* An overall attendance total derived from those absent fields.

No other production substantive question profile may be enabled without a later recorded decision.

Across all approved profiles, the form must not introduce:

* Individual named-guest attendance questions.
* Separate named-child attendance questions.
* An additional-guest name field.
* Per-person dietary fields.
* Accessibility questions.
* Lodging questions.
* Transportation questions.
* A message-to-the-couple field.
* Entrée selections.
* Additional substantive guest-facing questions not approved by a later recorded decision.

Operational confirmation fields are separate from the substantive RSVP question profiles.

### 2.4 Blank Forms

Every successfully validated invitation loads a blank personalized form.

This applies both when:

* No RSVP has previously been submitted; and
* A current RSVP already exists and the guest intends to make a revision.

The lookup response must not prefill or reveal:

* Stored attendance answers.
* Stored decline answers.
* Stored additional-guest answers.
* Stored attendance totals.
* Stored dietary information.
* Stored confirmation method.
* Stored email address.
* Stored mobile number.
* Other stored RSVP content.

### 2.5 Initial Responses and Partial Revisions

An initial RSVP must provide every substantive and operational field required by the invitation's approved question profile to create a complete valid response.

A revision may provide only the RSVP fields that need to change.

For revisions:

* Submitted RSVP fields replace the corresponding stored values.
* Omitted RSVP fields remain unchanged.
* The backend loads the current stored RSVP.
* The backend merges submitted changes with the current response.
* Explicit replacement, zero-value, decline, or clearing behavior must be available where simple omission would be ambiguous.
* The complete resulting merged response must pass validation against the invitation's approved profile, `additionalGuestAllowance`, and `maximumAttendance` before it becomes the new current RSVP.

The frontend must not reveal stored answers merely to support revision behavior.

### 2.6 Backend Authority

React may perform normalization and validation for usability, but it is not authoritative.

The Express backend independently controls:

* Invitation-code normalization.
* Invitation-code validation.
* Invitation authorization.
* Rate limiting.
* Deadline enforcement.
* Question-profile authorization.
* Additional-guest authorization.
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

The personalized RSVP interaction begins at:

`/wedding/rsvp/`

A guest may arrive there through ordinary public-site navigation, including by scanning the static invitation QR code to the public homepage and then selecting RSVP.

The guest manually enters the invitation code printed on the physical invitation.

The RSVP system does not require or distribute a personalized browser URL. The access sequence is defined formally in Section 8.

React may normalize the entered code for usability and display purposes before sending it to the backend.

The authoritative invitation-code normalization algorithm is defined in **Section 7 — Invitation-Code Normalization Specification**.

The browser-side result is never authoritative.

### 4.2 Invitation Lookup Request

React submits the entered invitation code to:

`POST /wedding/api/rsvp/lookup`

The invitation code is sent in the request body.

It is not placed in:

* The route path.
* A query string.
* A URL fragment.

Express independently performs the complete normalization process defined in Section 7 even if React has already normalized the value.

Express then:

* Determines whether the normalized result is structurally valid.
* Applies lookup rate limiting.
* Determines whether the canonical code corresponds to an active invitation-party configuration.

### 4.3 Invalid Invitation Result

If the submitted value is malformed or does not correspond to an authorized active invitation, the backend returns a guest-safe neutral result.

The guest-facing result must not disclose:

* Whether a similar code exists.
* A close match.
* Which character may be incorrect.
* A guest or party name.
* Another invitation code.
* Invitation-record counts.
* Spreadsheet information.
* Internal identifiers.
* Private source data.
* Backend implementation details.

The guest may correct the entered value and try again subject to applicable rate limits.

Malformed, unknown, and inactive codes must not result in guest-facing existence disclosures.

The API status-code contract for malformed, unknown, inactive, rate-limited, closed, and unavailable results is recorded in `rsvp-api-contract.md`.

### 4.4 Private Invitation Configuration

After a successful lookup, the backend loads the applicable private invitation-party configuration.

The private configuration determines the guest-facing information necessary to render the correct form, including:

* Reviewed party greeting or display wording.
* Explicit singular or plural `wordingMode`.
* `maximumAttendance`.
* Nonnegative integer `additionalGuestAllowance`.
* Approved `questionProfile`.
* Permitted question definitions.
* Relevant validation constraints.
* Protected active/environment status used by the backend.

The browser does not infer these values from names, greeting text, apparent household size, or any other client-visible value.

The browser does not directly access the private Google Sheets workbook.

The complete private invitation record is not returned to React.

### 4.5 Limited Blank-Form Response

After a valid active invitation lookup, the backend returns the exact limited blank-form response defined in `rsvp-api-contract.md`.

The response contains exactly three top-level properties:

* `invitation`
* `questions`
* `confirmationOptions`

The `invitation` object contains only the guest-facing invitation values necessary to render the form, including:

* Reviewed `partyDisplayName` and `greeting`.
* Explicit `wordingMode`.
* `maximumAttendance`.
* Approved `questionProfile`.
* The centralized public RSVP deadline.
* `America/New_York` time-zone information.
* `additionalGuestAllowance` for the `default` profile, including zero when no additional-guest control is authorized.

For `reduced-attendance-dietary`, `additionalGuestAllowance` is omitted from the guest-facing invitation object because that substantive profile does not permit an additional-guest response.

The `questions` array contains only the question objects applicable to that invitation and uses the common structure defined in:

`rsvp-example-form-schemas.json`

For the `default` profile, the backend returns the allowance-appropriate question set:

* An allowance of `0` produces no `additionalGuestAttendance` question.
* An allowance of `1` returns the approved Yes/No additional-guest question.
* An allowance greater than `1` returns the bounded whole-number additional-guest control.
* `attendanceTotals` remains part of the default profile.

For the `reduced-attendance-dietary` profile, the backend returns:

* `eventAttendance`.
* `declineAttendance`.
* `dietaryPreferences`.
* The separate operational confirmation questions.

The reduced profile does not return:

* `additionalGuestAttendance`.
* `attendanceTotals`.

`confirmationOptions` identifies the enabled guest-confirmation channels and whether the selected SMS process requires transactional authorization.

Lookup never returns stored RSVP data merely because a current response exists.

In particular, it does not return:

* Previous attendance selections.
* Previous decline status.
* Previous additional-guest response.
* Previous attendance totals.
* Previous dietary information.
* Previous confirmation method.
* Previous confirmation email.
* Previous confirmation mobile number.
* Previous SMS-authorization state.
* Previous delivery status.
* Current or superseded RSVP versions.

Lookup also does not return:

* Another invitation party's information.
* Other invitation codes.
* The production invitation code merely to reproduce it after validation.
* Private `partyId` values.
* Protected `active` or `environment` flags.
* Internal spreadsheet rows.
* Child-allocation notes.
* Private administrative notes.
* Credentials or secrets.
* Administrative delivery addresses.

The lookup response contains no `existingResponse`, `currentResponse`, `hasResponse`, response version, or equivalent stored-response indicator.

The browser therefore does not determine from lookup whether the eventual submission is an initial RSVP or revision.

That determination remains authoritative on the backend during submission.

### 4.6 Blank Personalized Form

React uses the limited backend response to render the personalized form as a state of:

`/wedding/rsvp/`

No invitation-specific route is created.

The form is blank whether the request will eventually become:

* An initial RSVP; or
* A revision to an existing RSVP.

The browser does not need to know which case applies before submission.

The backend determines initial versus revision status authoritatively.

### 4.7 Guest Completion

The guest completes either:

* A complete initial RSVP according to the invitation's approved substantive question profile; or
* Only the selected RSVP fields that need to change.

The form also collects the required operational confirmation information.

The invited party selects either:

* Email; or
* Text Message.

The applicable confirmation destination must be supplied.

Text-message confirmation also requires any transactional SMS authorization required by the finalized provider and project rules.

Operational confirmation data is not part of the closed substantive RSVP question set.

### 4.8 Client-Side Usability Validation

React may validate entered values before submission in order to provide prompt and accessible feedback.

Client-side validation may include:

* Invitation-code normalization for usability.
* Required-field completeness.
* Obvious formatting errors.
* Mutually exclusive selections.
* Numeric input constraints.
* Additional-guest bounds.
* Maximum-attendance checks.
* Conditional confirmation fields.

This validation exists only for usability.

The server must independently validate every submitted value and authorization rule.

### 4.9 RSVP Submission Request

React submits the RSVP to:

`POST /wedding/api/rsvp/submit`

Phase 3 Step 8 fixes the exact top-level request envelope as:

```text
RSVP submission
├── inviteCode
├── clientSubmissionId
├── confirmation
└── changes
```

No other top-level property is part of the current contract.

`inviteCode` carries the manually entered invitation code in the request body and is independently normalized by Express.

`clientSubmissionId` is a client-generated UUID-form identifier for one logical submission. React generates a new identifier for a new logical RSVP action and preserves the same identifier for a safe retry of that exact action after an uncertain client outcome.

`confirmation` contains the complete newly entered operational confirmation information:

* Email: `method: "email"` and the applicable email address.
* Text Message: `method: "textMessage"`, the applicable SMS-capable mobile number, and required transactional SMS authorization when configured.

`changes` is keyed by permanent substantive RSVP question ID.

Each submitted substantive change uses an authorized operation object:

* `replace` with a typed `value`; or
* `clear` without a `value`, only where the schema authorizes explicit client clearing.

Omitted substantive fields mean leave unchanged during a revision.

Explicit numeric zero is represented as an ordinary replacement value. There is no separate `zero` operation.

When the guest intentionally changes the attendance/decline state, React submits the complete intended `eventAttendance` and `declineAttendance` pair so the desired controlling state does not depend on hidden stored answers.

The request does not include `partyId`, `questionProfile`, `maximumAttendance`, `additionalGuestAllowance`, stored-answer data, `expectedVersion`, private RSVP version, or administrative recipient information.

The exact field-level request and response examples are normative in `rsvp-api-contract.md`.

### 4.10 Server Revalidation

Express independently normalizes and revalidates the invitation code on every new logical submission using the same authoritative algorithm defined in Section 7.

A previously successful lookup is not sufficient authorization.

The backend then verifies the submission against the current authoritative state, including:

* Invitation-code structure.
* Invitation existence and active/environment authorization.
* Current RSVP deadline for a new logical submission.
* `clientSubmissionId` validity and idempotency state.
* Approved question profile.
* Submitted question IDs and operation authorization.
* `additionalGuestAllowance`.
* `maximumAttendance`.
* Submitted values.
* Confirmation method, destination, and applicable SMS authorization.
* Initial-response completeness or revision merge semantics.
* Duplicate-submission protection.

If the same invitation and `clientSubmissionId` correspond to a previously successful materially identical logical request, the backend returns an idempotent success rather than writing another version.

If the same identifier is reused for materially different request content, the backend rejects the request rather than treating the second body as a new revision.

The server remains authoritative even when the client previously considered the same values valid.

### 4.11 Initial-Versus-Revision Determination

The backend determines whether a valid new logical request represents:

* The invited party's first stored RSVP; or
* A revision to an existing RSVP.

The browser does not make this authoritative determination and receives no stored-response indicator during lookup.

For an initial RSVP:

* `changes` must contain everything required to construct a complete valid substantive RSVP for the authoritative profile and resulting attendance state.
* Required operational confirmation information must also be present.

For a revision:

* The backend loads the existing current RSVP before applying submitted changes.
* Only substantive fields intentionally being changed need to appear in `changes`.
* A revision may use an empty `changes` object when the intended revision is limited to operational confirmation method or destination.

The current contract does not require or accept a client-supplied `expectedVersion`. Distinct revisions are merged against the authoritative current response that exists when each is processed.

### 4.12 Revision Merge

For a revision:

1. The backend loads the current stored RSVP.
2. Submitted `replace` operations replace their corresponding stored substantive values.
3. Submitted authorized `clear` operations remove the corresponding stored value.
4. Explicit zero is treated as a real replacement value rather than omission.
5. Omitted substantive fields remain unchanged.
6. For the grouped `attendanceTotals` field, omitted nested age-category keys remain unchanged during a revision.
7. Newly submitted operational confirmation values replace their stored counterparts after validation.
8. The backend resolves values that become incompatible because of controlling changes.
9. The resulting complete RSVP is validated against the invitation's approved profile, additional-guest allowance, and maximum attendance.

The current permanent substantive payload IDs are:

* `eventAttendance`
* `declineAttendance`
* `additionalGuestAttendance` when authorized.
* `attendanceTotals` when authorized.
* `dietaryPreferences`

For `additionalGuestAttendance`:

* Allowance `1` uses `"yes"` or `"no"` replacement values.
* Allowance greater than `1` uses a whole-number replacement value from zero through the allowance.
* Allowance `0` or the reduced profile makes the field unauthorized.

For `attendanceTotals`:

* Initial attending responses provide all four age-category values when the default profile requires them.
* Revisions may submit only the nested categories intended to change.
* Numeric zero is an explicit replacement value.

For `dietaryPreferences`:

* `replace` supplies a new party-level string.
* `clear` intentionally removes the stored response.
* Omission leaves the stored response unchanged.

An omitted revision field must never automatically mean “delete the stored value.”

A blank form therefore does not imply that the current stored response is blank.

### 4.13 Authoritative Conditional and Dependency Rules

Phase 3 Step 9 finalizes the dependency behavior that follows the Step 8 request and merge model.

These rules govern both:

* The conditional form behavior React may present for usability; and
* The authoritative resulting-state processing Express must perform before storage.

React may use the same rule definitions to hide, show, require, or clear page-entered values, but browser visibility is never authorization. Express independently evaluates the authoritative invitation configuration, submitted operations, current stored RSVP when one exists, and complete resulting state.

The controlling rule is:

**The server validates the complete resulting RSVP only after submitted changes have been merged, values made inapplicable by controlling changes have been removed, and newly applicable required values have been supplied.**

#### 4.13.1 Dependency Processing Order

For each genuinely new logical submission or revision, dependency processing occurs in this order:

1. Validate invitation-code structure, invitation authorization, deadline, `clientSubmissionId`, operational confirmation shape, submitted question IDs, and operation-object syntax.
2. Load the authoritative invitation configuration and approved question profile.
3. Determine whether the request is an initial RSVP or a revision.
4. For a revision, load the current stored RSVP.
5. Apply submitted `replace` and authorized `clear` operations.
6. Preserve omitted substantive fields and omitted nested attendance-total categories during a revision.
7. Resolve the complete intended attendance/decline state.
8. Remove stored or submitted dependent values that the resulting controlling state makes inapplicable, as specifically authorized below.
9. Determine which substantive fields have become newly applicable and therefore must now be supplied.
10. Validate the resulting profile, additional-guest response, attendance totals, dietary value, and operational confirmation state.
11. Reject the request without storage if the complete resulting RSVP is invalid.
12. Only after successful complete-state validation may the backend write a new RSVP version.

Authorization checks occur before dependency clearing. An unknown or profile-inapplicable question does not become acceptable merely because another answer would later hide it.

#### 4.13.2 Attendance and Decline

The authoritative attendance decision has exactly two valid forms.

An **attending** state has:

* `eventAttendance` containing `ceremony`, `reception`, or both; and
* `declineAttendance` equal to `false`.

A **declining** state has:

* `eventAttendance` equal to an empty array; and
* `declineAttendance` equal to `true`.

A complete RSVP must never contain both a nonempty event selection and `declineAttendance: true`.

A complete RSVP also must not contain both an empty event selection and `declineAttendance: false`.

Therefore:

* An initial RSVP must establish one of the two valid states.
* When a revision intentionally changes the attendance/decline state, React submits the complete intended pair defined in Step 8.
* When a revision does not change the attendance/decline state, both fields may be omitted and the stored pair remains authoritative after merge.
* A contradictory submitted pair is invalid rather than being silently reinterpreted.

#### 4.13.3 Full Decline and Automatic Dependent Clearing

When the complete resulting state is a full decline, the backend makes attendance-dependent substantive data inapplicable before final validation.

The resulting state is normalized so that:

* `eventAttendance` is `[]`.
* `declineAttendance` is `true`.
* `additionalGuestAttendance` is removed when that field exists in the default profile.
* `attendanceTotals` is removed when that field exists in the default profile.
* `dietaryPreferences` is cleared and the guest-facing complete RSVP represents the dietary value as `null`.

Attendance totals are **not** converted into a synthetic four-zero object merely to preserve the field. They are inapplicable to the declined resulting state and are omitted from the successful guest-facing RSVP.

A stale stored additional-guest response, attendance-total object, or dietary response must therefore not survive an attendance-to-decline revision.

If the client sends profile-authorized dependent values in the same request as a valid full-decline pair, the authoritative decline rule prevents those dependent values from being retained. React should ordinarily omit those now-hidden fields.

Fields that are not authorized by the invitation's profile or allowance remain authorization failures even if the request also declines.

Operational confirmation information does **not** become optional when the party declines. Every online initial submission and revision still requires a valid newly entered confirmation object.

#### 4.13.4 Attending State and Newly Applicable Fields

When the resulting state is attending:

* `eventAttendance` contains Ceremony, Reception, or both.
* `declineAttendance` is `false`.
* Party-level dietary information is applicable under both approved profiles.
* Dietary applicability does not depend on Reception attendance; Ceremony-only, Reception-only, and combined attendance are all attending states.
* Dietary information remains optional.
* Under the `default` profile, `attendanceTotals` is applicable and required for a complete attending response.
* Under the `default` profile with `additionalGuestAllowance > 0`, `additionalGuestAttendance` is applicable and required for a complete attending response.
* Under the `default` profile with `additionalGuestAllowance == 0`, no additional-guest field exists.
* Under `reduced-attendance-dietary`, neither `additionalGuestAttendance` nor `attendanceTotals` is applicable.

When a revision changes a previously declined RSVP to attending, values that were cleared by the decline become newly applicable:

* A default-profile revision must supply all four attendance-total categories.
* A default-profile invitation with a positive additional-guest allowance must supply the applicable additional-guest response.
* Dietary information may be supplied but is not required.
* A reduced-profile revision supplies no additional-guest or attendance-total value.

When a revision remains in an attending state, omitted applicable substantive fields retain their stored values under the Step 8 partial-revision rules.

#### 4.13.5 Additional-Guest Dependency Rules

`additionalGuestAttendance` is authorized only when all of the following are true:

* `questionProfile` is `default`.
* `additionalGuestAllowance` is greater than `0`.
* The resulting RSVP is attending.

For allowance `1`:

* The value is `"yes"` or `"no"`.
* `"yes"` represents one attending additional guest.
* `"no"` represents zero attending additional guests.

For an allowance greater than `1`:

* The value is a whole number.
* The minimum is `0`.
* The maximum is the authoritative `additionalGuestAllowance`.

For allowance `0` or `reduced-attendance-dietary`, the field is unauthorized and must not be submitted.

When the field is applicable, an initial RSVP or a decline-to-attendance revision must supply it. A direct `clear` on a continuing attending state cannot produce a valid complete response; `"no"` or numeric `0` is the ordinary representation for no attending additional guest.

When the party fully declines, the field is automatically removed as inapplicable.

For default-profile attending responses, the effective attending additional-guest count must not exceed the calculated `overallAttendance`, because the attendance totals represent the complete attending party, including additional guests.

Changing the additional-guest response does not cause the backend to guess which age category should change. Existing age-category totals remain subject to complete-result validation and must be revised explicitly when necessary.

#### 4.13.6 Attendance-Total Dependency Rules

`attendanceTotals` is authorized only for an attending `default`-profile RSVP.

The four permanent categories are:

* `adults21Plus`
* `youngAdults18To20`
* `children3To17`
* `childrenUnder3`

For an initial attending response, and whenever totals become newly applicable after a prior decline:

* All four categories are required.
* Every value must be a nonnegative whole number.
* Explicit numeric zero is valid.
* The backend calculates `overallAttendance` as the sum of the four values.
* `overallAttendance` must be at least `1` for an attending state.
* `overallAttendance` must not exceed `maximumAttendance`.

For a revision that remains attending:

* A replacement object may contain only the age categories intentionally changed.
* Omitted nested categories remain unchanged.
* The backend validates the complete merged four-category object and recalculated overall total.

If an authorized additional-guest response is present, its effective additional-guest count must not exceed `overallAttendance`.

The system does not derive an exact count of attending named invitees from `maximumAttendance` or from the additional-guest allowance. It therefore does not automatically alter age categories when an additional-guest response changes.

`attendanceTotals` is not accepted for `reduced-attendance-dietary`.

When the party fully declines, attendance totals are automatically removed as inapplicable. There is no direct Step 8 client `clear` operation for the grouped attendance-total field.

#### 4.13.7 Dietary Dependency Rules

`dietaryPreferences` is one optional party-level free-text value under both approved substantive profiles.

For any attending state:

* The field is applicable for Ceremony-only attendance, Reception-only attendance, or attendance at both.
* The field may be omitted on an initial response because it is optional.
* A revision `replace` supplies a new string.
* An authorized revision `clear` removes the stored string.
* Revision omission leaves the stored value unchanged.
* The configured maximum length remains `1000`.

Dietary applicability is **not** conditioned on Reception selection and is not conditioned on a positive attendance total beyond the ordinary requirement that an attending default-profile response have a valid positive overall attendance.

When the party fully declines, any stored dietary response is automatically cleared. A successful complete declined RSVP therefore reports `dietaryPreferences: null`.

The system does not create per-person dietary fields.

#### 4.13.8 Approved Profile Dependencies

The two approved substantive profiles remain a closed set.

For `default`:

* Attendance or decline is required.
* `additionalGuestAttendance` is included only when the authoritative allowance is positive and the resulting state is attending.
* `attendanceTotals` is required when attending.
* `dietaryPreferences` is applicable when attending and optional.
* A full decline clears or removes all attendance-dependent substantive values.

For `reduced-attendance-dietary`:

* Attendance or decline is required.
* `dietaryPreferences` is applicable when attending and optional.
* `additionalGuestAttendance` is never rendered or accepted.
* `attendanceTotals` is never rendered or accepted.
* A full decline clears dietary information.

No client-visible condition may add a substantive question outside the approved profile.

#### 4.13.9 Operational Confirmation Dependencies

Operational confirmation rules apply identically to both substantive profiles and to both initial submissions and revisions.

When `confirmation.method` is `email`:

* A valid newly entered `email` value is required.
* `mobile` is not part of the confirmation object.
* `smsAuthorization` is not part of the confirmation object.

When `confirmation.method` is `textMessage`:

* A valid newly entered SMS-capable `mobile` value is required.
* `email` is not part of the confirmation object.
* If centralized configuration requires transactional SMS authorization, `smsAuthorization` must be present and `true`.
* If centralized configuration does not require that authorization field, it is omitted.

After successful validation and storage, the newly submitted operational method, destination, and applicable authorization state replace their stored counterparts. Values belonging only to the previously selected channel do not remain active.

#### 4.13.10 Automatic Clearing, Rejection, and Missing Required Values

Step 9 distinguishes three cases.

**Automatic dependent clearing** applies when a previously applicable substantive value becomes inapplicable because the complete resulting RSVP is a full decline. The backend removes that dependent value before final validation.

**Authorization rejection** applies when the request submits a question that the authoritative invitation profile or allowance never authorizes, such as:

* `additionalGuestAttendance` for allowance `0`.
* `additionalGuestAttendance` for the reduced profile.
* `attendanceTotals` for the reduced profile.
* Any unknown substantive question.

**Validation rejection** applies when the request is structurally processable but cannot produce a valid complete resulting RSVP, including:

* A nonempty event selection combined with decline.
* No event selection combined with no decline.
* A missing additional-guest answer when it has become newly applicable.
* Missing default-profile attendance totals when they have become newly applicable.
* Negative, fractional, or above-allowance additional-guest values.
* Negative, fractional, incomplete, zero-total attending, or above-maximum attendance totals.
* An effective additional-guest count greater than overall attendance.
* Invalid dietary text.
* Invalid or incomplete operational confirmation information.

No invalid complete state is written as a new RSVP version.

Client-side field visibility and usability validation may mirror these rules, but Express must enforce them independently.

### 4.14 Invalid Resulting State

If the complete resulting RSVP is invalid, unauthorized, or contradictory, the backend rejects the request without writing a new RSVP version.

The response may contain guest-safe:

* Form-level validation information.
* Field-level validation information.

The error response must not reveal stored values that the guest omitted from a partial revision.

The guest may correct the submitted information and try again before the deadline.

### 4.15 Versioned Storage

After successful complete-state validation for a genuinely new logical submission, the backend:

1. Writes a new RSVP version.
2. Makes that version the current authoritative response.
3. Preserves prior versions as historical superseded responses.
4. Records whether the new version represents an initial RSVP or a revision.
5. Associates the logical submission with the normalized invitation and `clientSubmissionId` for idempotent replay handling.

The latest successfully stored version controls current attendance reporting.

Older versions must not be counted as separate current RSVPs.

A safe replay of the same logical submission identifier must not create another RSVP version.

The current browser contract does not expose the private RSVP version and does not accept `expectedVersion`. A future optimistic-concurrency mechanism requires a later recorded decision.

### 4.16 Protected Administrative Confirmation

After storage succeeds, the backend attempts to send a protected administrative email to the approved administrative destination.

The administrative confirmation contains the complete current RSVP required for private administrative use according to the invitation's applicable question profile.

The administrative email is private correspondence and is not a public browser response.

Failure to deliver the administrative email does not undo the stored RSVP.

### 4.17 Guest Confirmation

After storage succeeds, the backend also attempts to send the invited party a complete current RSVP using the confirmation method selected for that submission:

* Email; or
* Text Message.

The confirmation reflects the complete current RSVP after any revision merge.

A revision confirmation is not limited to the fields changed during that revision.

Profile-inapplicable substantive fields must be omitted rather than invented, displayed as zero, disabled, or labeled `N/A`.

Email and text-message confirmations may use different formatting, but must represent the same complete current guest-facing RSVP.

Failure of guest confirmation delivery does not undo the stored RSVP.

### 4.18 Delivery-Result Recording

Administrative and guest delivery results are recorded separately from the RSVP content itself.

A delivery retry or authorized resend must not create a new RSVP version merely because confirmation is being attempted again.

The system must therefore distinguish between:

* RSVP content and version history; and
* Confirmation-delivery attempts and outcomes.

### 4.19 Guest-Facing Confirmation Response

After storage and applicable delivery attempts, the backend returns the exact Step 8 successful response defined in `rsvp-api-contract.md`.

The response contains exactly five top-level properties:

* `submission`
* `invitation`
* `rsvp`
* `confirmation`
* `revisionPolicy`

`submission` identifies:

* Whether the logical action was an initial RSVP or revision.
* Whether this HTTP response is an idempotent replay.
* The authoritative stored timestamp.

`invitation` contains only guest-facing context required by the temporary confirmation experience, such as party display wording, `wordingMode`, and `questionProfile`.

`rsvp` contains the complete guest-facing RSVP resulting from the logical submission, not merely the submitted change set.

The resulting RSVP always communicates attendance/decline status and party-level dietary state, and conditionally includes authorized additional-guest and attendance-total values when applicable. When `attendanceTotals` is present, the backend also returns the calculated `overallAttendance`.

`confirmation` identifies only:

* Selected guest confirmation method.
* Guest delivery status: `sent`, `failed`, or `uncertain`.
* Limited administrative delivery status: `sent`, `failed`, or `uncertain`.
* `deliveryWarning`.

`revisionPolicy` carries the public deadline, `America/New_York` time zone, whether online revision remains available at response time, and the approved RSVP assistance email.

The public response does not expose:

* The invitation code.
* `clientSubmissionId`.
* Guest email address.
* Guest mobile number.
* SMS authorization content.
* Private RSVP version.
* Private workbook information.
* Private administrative notes.
* Credentials.
* Protected administrative email destination.
* Another invitation party's information.

A delivery warning must not imply that RSVP storage failed.

### 4.20 Confirmation Route

After a successful stored submission, React navigates to:

`/wedding/rsvp/confirmation`

The complete on-screen confirmation is carried through temporary React navigation/application state rather than through a code-bearing or data-bearing URL. The temporary state is the limited successful-submission response already returned by the Step 8 API contract; React does not construct a second, more permissive confirmation object.

The confirmation renderer must distinguish between:

* Successful storage with successful delivery; and
* Successful storage with one or more delivery warnings.

A delivery warning must not imply that RSVP storage failed.

Phase 3 Step 13 finalizes the confirmation-state lifecycle as follows:

1. A submission handler may create confirmation navigation state only after the backend returns a successful stored RSVP result.
2. The route renders State 9, 10, or 11 only when a structurally usable temporary successful response is available and reports `submission.recorded: true`.
3. `submission.action`, together with delivery-warning status, determines whether the visible state is Confirmed Initial Submission, Confirmed Revision, or Stored with Delivery Warning; HTTP `200` alone does not imply that the original logical action was a revision because an idempotent replay may preserve an original `initial` action.
4. A browser refresh is not, by itself, a command to discard or reconstruct confirmation data. If the temporary successful response remains available after the navigation event, the corresponding successful state may continue to render.
5. If the temporary successful response is absent, incomplete, or otherwise unusable, the route enters State 12 — Confirmation Refresh Fallback.
6. State 12 does not call a public saved-RSVP endpoint, automatically repeat invitation lookup, automatically replay the prior submission, or infer the prior stored result.
7. The initial implementation does not require a short-lived confirmation token or a separate confirmation-recovery endpoint. A later mechanism of that kind would require a new recorded decision and coordinated contract changes.
8. The application must not place the successful response, invitation code, confirmation destination, or RSVP answers into the browser URL merely to make the summary survive a refresh.
9. No application feature may depend on confirmation state surviving a full reload. The recovery path remains the State 12 fallback, the guest's selected confirmation channel, and the approved assistance method.

At the completion of Step 13, cache-control, server-log, retention, credential-storage, and rate-limit implementation requirements were intentionally left to Step 14. Those requirements are now finalized in Section 15.

---

## 5. Initial RSVP and Revision Model

### 5.1 Initial RSVP

For an initial RSVP:

* The form begins blank.
* The applicable substantive questions are determined by the invitation's approved profile.
* React generates one new UUID-form `clientSubmissionId` for the logical submission.
* The request contains `inviteCode`, `clientSubmissionId`, a complete operational `confirmation` object, and `changes`.
* The attendance decision is submitted through the intended `eventAttendance` and `declineAttendance` pair.
* All substantive fields required to create a complete valid RSVP under the profile and resulting attendance state are supplied.
* Required operational confirmation information is supplied.
* For the default profile, all four attendance-total categories are supplied when those totals are applicable.
* An allowance-one additional-guest answer uses `"yes"` or `"no"`.
* An allowance-greater-than-one additional-guest answer uses a whole number from zero through the configured allowance.
* The backend validates the complete submission.
* One new RSVP version is written.
* That version becomes the current authoritative response.
* Confirmation delivery begins only after storage succeeds.
* A successful newly stored initial response returns `201 Created`.

### 5.2 Revision

For a revision:

* The guest again begins through manual invitation-code entry.
* The validated form still loads blank.
* Stored answers and stored confirmation destinations are not displayed.
* React generates a new `clientSubmissionId` for that genuinely new logical revision.
* Required operational confirmation information is entered again in full.
* Only the substantive RSVP fields that need to change are submitted in `changes`.
* An operational-confirmation-only revision may use an empty `changes` object.
* Omitted substantive RSVP fields remain unchanged.
* Submitted `replace` operations replace corresponding stored values.
* Submitted authorized `clear` operations remove corresponding stored values.
* Explicit numeric zero is a `replace` value, not omission.
* If the guest intentionally changes attendance or decline, the complete intended `eventAttendance` and `declineAttendance` pair is submitted.
* For `attendanceTotals`, omitted nested age-category keys remain unchanged during a partial revision.
* The backend merges the change set with the existing current RSVP.
* The backend applies the authoritative conditional and dependency rules in Section 4.13, including automatic clearing of values made inapplicable by a full decline.
* The complete resulting RSVP is validated against the applicable profile, `additionalGuestAllowance`, and `maximumAttendance`.
* A successful genuinely new revision is stored as a new version and returns `200 OK`.
* The previous response remains only as superseded history.
* Guest and administrative confirmations contain the complete new resulting RSVP rather than merely the changed fields.

### 5.3 Safe Retry Versus New Revision

A safe retry after an uncertain browser outcome is not a new revision.

For a safe retry:

* React reuses the original `clientSubmissionId`.
* The request content remains materially the same logical request.
* The backend returns the previously recorded successful result when that logical submission already succeeded.
* No new RSVP version is created.
* No duplicate confirmation delivery attempt is created merely because the HTTP request was replayed.

A later intentional RSVP change receives a new `clientSubmissionId` and is processed as a new logical submission or revision according to current stored state.

There is no public “view my saved RSVP” operation required by the initial design, and no `expectedVersion` field is used by the current browser submission contract.

## 6. Trust Boundaries

### 6.1 Browser / React

React is responsible for:

* Collecting manual invitation-code entry.
* Performing non-authoritative usability normalization.
* Sending lookup requests.
* Rendering the limited blank schema returned by the backend.
* Collecting initial responses or selected revision fields.
* Collecting operational confirmation data.
* Performing non-authoritative usability validation.
* Generating a new UUID-form `clientSubmissionId` for each genuinely new logical RSVP action.
* Preserving the same `clientSubmissionId` for a safe retry of that exact logical action after an uncertain outcome.
* Encoding substantive changes through the Step 8 `replace` and authorized `clear` operation objects.
* Sending RSVP submissions.
* Displaying guest-safe validation states.
* Displaying successful confirmation or delivery-warning states.

React is not authoritative for:

* Whether an invitation code is structurally valid.
* Whether an invitation code exists.
* Whether an invitation is active.
* Whether a question profile is authorized.
* Whether an additional-guest field is authorized.
* The value of `additionalGuestAllowance`.
* The value of `maximumAttendance`.
* Whether a request is an initial response or revision.
* Whether an omitted field should be cleared.
* Whether the deadline has passed.
* Whether storage succeeded.
* Whether a submission is a duplicate.
* Whether an idempotency record already exists on the backend.
* The private RSVP version.
* Any `expectedVersion` because the current contract does not use one.

React must not connect directly to the private Google Sheets workbook.

### 6.2 Express Backend

The Express backend is authoritative for:

* Invitation-code normalization.
* Invitation-code validation.
* Lookup rate limiting.
* Invitation authorization.
* Private invitation-configuration retrieval.
* Selection of the approved question profile.
* Selection of guest-facing questions and wording.
* Additional-guest allowance interpretation and enforcement.
* Maximum-attendance enforcement.
* Submission revalidation.
* Deadline enforcement.
* Field authorization.
* Initial-versus-revision determination.
* Loading the current RSVP.
* Partial-revision merging.
* Explicit replace and clear-operation authorization.
* Dependent-value clearing.
* Complete-result validation.
* Validation of `clientSubmissionId` and materially identical replay behavior.
* Rejection of one identifier reused for materially different logical request content.
* Idempotency.
* Versioned storage.
* Current-response designation.
* Administrative confirmation delivery.
* Guest confirmation delivery.
* Delivery-result recording.
* Guest-safe API responses.

### 6.3 Private Data Store

The private data store contains or supports:

* The authoritative private production invitation source.
* Generated private invitation-party configurations.
* Production invitation codes.
* Private invitation identifiers.
* Explicit wording mode.
* Maximum attendance.
* Integer additional-guest allowance.
* Approved question profile.
* Active and environment classifications.
* Current RSVP responses.
* Superseded RSVP versions.
* Operational confirmation information.
* Confirmation-delivery records.
* Private idempotency records or request fingerprints needed to recognize safe replays.
* Private administrative information.

This information is not exposed directly to the frontend.

The frontend receives only the limited information required for the guest's current interaction.

---

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

The authoritative private production invitation source has been reviewed for Phase 3 Step 2 without reproducing production codes or guest identities in this document.

The current production-source audit establishes that:

* The source contains 56 active production invitation records corresponding to the 56 printed invitations.
* All 56 supplied invitation codes normalize successfully under the approved rules.
* All 56 produce valid six-character canonical lookup keys.
* All 56 canonical keys are unique.
* No normalization collision exists among the supplied production codes.
* Each production code maps to one populated primary invited-party record.
* The supplied guest-facing code values already use the approved `XXX-XXX` presentation format.

These values describe the current authoritative source and serve as validation targets for the initial production transformation.

They must not be hard-coded into reusable form-rendering or validation logic.

The real production codes, guest names, source spreadsheet data, and mappings between codes and invited parties remain private.

They must not be copied into:

* Public documentation.
* Public repositories.
* Frontend source files.
* Public assets.
* Browser URLs.
* Browser responses except where a later approved guest-facing response expressly requires an applicable display value.
* Page metadata.
* Analytics.
* Referrer data.
* Ordinary application logs.

---

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

When the backend accepts the invitation code as valid and active, it returns only the limited information required to render the appropriate blank personalized form.

The exact successful response is defined in `rsvp-api-contract.md` and contains:

* `invitation`.
* `questions`.
* `confirmationOptions`.

The lookup result does not return stored RSVP answers, stored confirmation destinations, response versions, or a stored-response existence flag.

React renders the returned form as a controlled state of:

`/wedding/rsvp/`

The form remains blank even if the invited party already has a stored RSVP.

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

Phase 3 Step 11 now defines the fictional development configuration registry and behavioral archetypes used to exercise the approved configuration, profile, allowance, attendance, decline, revision, confirmation, and idempotency model without using production guest data.

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

After successful invitation validation, the browser may receive only the exact blank-form response established in Phase 3 Step 7 and `rsvp-api-contract.md`.

That response consists of:

* `invitation` — limited guest-facing invitation values required for rendering.
* `questions` — only the applicable substantive and operational question definitions selected from the approved form schema.
* `confirmationOptions` — enabled confirmation channels and the applicable SMS-authorization requirement.

The invitation-specific values may include:

* Reviewed party display name or greeting.
* Explicit singular or plural `wordingMode`.
* Maximum authorized attendance.
* Approved `default` or `reduced-attendance-dietary` question profile.
* Authorized `additionalGuestAllowance` for the `default` profile, including zero.
* Public RSVP deadline.
* `America/New_York` time zone.

For the reduced profile, `additionalGuestAllowance` is omitted because that profile does not authorize an additional-guest response.

Question objects may contain the renderer-facing labels, options, display conditions, validation rules, patch behavior, clear behavior, and help text established in `rsvp-example-form-schemas.json`.

Client receipt of these rules supports rendering and usability validation only.

The backend remains authoritative.

### 10.2 Lookup Must Not Return

Lookup must not return:

* The stored current RSVP.
* Superseded RSVP versions.
* Any previous substantive RSVP answer.
* Stored confirmation method.
* Stored email address.
* Stored mobile number.
* Stored SMS-authorization state.
* Delivery history.
* An `existingResponse`, `currentResponse`, `hasResponse`, response version, or other stored-response indicator.
* Other invitation codes.
* Other invited parties.
* The production invitation code merely to reproduce it after validation.
* Private `partyId` values.
* Protected `active` or `environment` flags.
* Workbook row numbers.
* Child-allocation notes.
* Internal administrative notes.
* Credentials.
* Secrets.
* Administrative delivery addresses.
* Internal worksheet names.
* Unneeded private configuration flags.

This boundary applies whether or not a current RSVP already exists.

### 10.3 Submission Confirmation May Return

Following successful storage, the server returns the exact Step 8 successful submission response recorded in `rsvp-api-contract.md`.

This is distinct from lookup.

Lookup returns a blank-form schema.

Successful submission returns exactly:

* `submission`
* `invitation`
* `rsvp`
* `confirmation`
* `revisionPolicy`

The `rsvp` object contains the complete guest-facing RSVP resulting from the stored logical transaction rather than only the fields submitted in a revision.

The public response may include:

* Initial-versus-revision designation.
* Idempotent-replay flag.
* Authoritative submission timestamp.
* Guest-facing party display context.
* Approved question profile.
* Complete resulting attendance or decline state.
* Applicable additional-guest response.
* Applicable age-category totals and calculated overall attendance.
* Party-level dietary response or explicit absence.
* Selected confirmation method.
* Guest delivery status.
* Limited administrative delivery status.
* Delivery-warning flag.
* Public revision deadline, time zone, and assistance information.

The public response must not include:

* The invitation code.
* `clientSubmissionId`.
* Guest confirmation destination.
* SMS authorization content.
* Private RSVP version.
* Protected administrative destination.
* Private backend identifiers or provider internals.

The confirmation includes only substantive fields authorized and applicable to the invitation's approved profile and resulting state according to the finalized Section 4.13 dependency rules.

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

Profile variants, additional-guest allowance variants, countdown visibility, field-level errors, guest-versus-administrative delivery-warning categories, and responsive layouts are **substates or presentation variants** within these thirteen states. They do not create additional top-level RSVP states.

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

Validated Blank Form begins only after a successful lookup returns the limited authorized blank-form schema.

Required behavior:

* Display the permitted invited-party greeting and configured singular/plural wording.
* Render only questions authorized by the returned approved profile and additional-guest allowance.
* Support the `default` and `reduced-attendance-dietary` profile rules already established in this document.
* Render the permitted zero-, one-, or multiple-additional-guest variant only where the default profile and authoritative allowance require it.
* Display the written deadline and conditional final-month countdown.
* Explain that previously submitted answers and confirmation destinations are not displayed.
* Present instructions for both a first RSVP and a possible revision without revealing whether a stored RSVP exists.
* Explain omission, replacement, explicit zero, decline, and explicit clear semantics where those distinctions are relevant.
* Collect the operational confirmation method and applicable destination on every initial submission and revision.
* Keep all substantive form controls blank on entry to this state.

The state may contain ordinary local field values as the guest types. Those page-entered values are not evidence of stored RSVP content.

A submit attempt transitions to either Validation Failure when client usability validation fails or Submitting when a logical request is sent.

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
* Display the complete current guest-facing RSVP for the applicable profile.
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

The state model may retain transient browser-memory values only as needed to support the current interaction safely.

Permitted transient data includes:

* The guest-entered invitation-code text while entering, looking up, or correcting an invalid entry.
* The limited blank-form schema returned for the validated invitation.
* The guest's newly entered form values while completing, validating, submitting, or safely retrying the current logical action.
* The original submission request and `clientSubmissionId` while State 7 or State 8 requires idempotent retry protection.
* The limited successful confirmation response while navigating to and displaying States 9–11.

Transient data must not be promoted into:

* Browser URLs.
* Query strings or fragments.
* Page metadata.
* Analytics payloads.

The initial confirmation implementation relies on temporary React navigation/application state and does not require intentional persistence of the successful response in `localStorage`, `sessionStorage`, IndexedDB, cookies, a code-bearing URL, or a new backend confirmation token solely to preserve the on-screen summary. Phase 3 Step 14 now confirms that the successful response must not be intentionally persisted in browser storage solely to reconstruct the confirmation after refresh; Step 13 continues to require no persistent recovery mechanism.

A full page reload, direct navigation, new-tab visit, or history traversal may leave temporary confirmation state available or may discard it depending on the eventual router/browser implementation. The rendering rule is therefore based on state availability rather than on detecting a refresh event: if a structurally usable successful response remains available, render State 9, 10, or 11; otherwise render State 12.

When confirmation state is lost, use State 12 rather than reconstructing private data from the URL or automatically querying/replaying the RSVP flow.

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

Phase 3 Step 11 creates a deliberately fictional development fixture set that exercises the RSVP architecture without using any production invitation code, guest identity, stored answer, confirmation destination, or administrative data.

The Step 11 fixtures have two related purposes:

1. `rsvp-example-configurations.json` provides private development-only invitation configurations that exercise the approved configuration dimensions.
2. This section defines behavioral archetypes and scenario overlays that use those configurations to exercise attendance, decline, revision, confirmation, and idempotency behavior without pretending that every behavior is itself an invitation-configuration field.

The archetypes are design fixtures. They are not production guest records. Phase 3 Step 12 has converted these behaviors into explicit preliminary test cases in `rsvp-test-cases.md`.

### 13.1 Development-Only Constraints

Every Step 11 fixture must satisfy all of the following:

* Use a clearly fictional six-character development code.
* Use a fictional party identifier, party display name, and greeting.
* Use `environment: "development"`.
* Remain absent from the active production invitation source.
* Never reuse a production invitation code.
* Never use a real guest's name, contact destination, RSVP answer, dietary information, or other private invitation data.
* Never be bundled into public frontend source merely because the fixture is fictional.
* Remain subject to the same authoritative normalization, profile, allowance, deadline, submission, dependency, storage, confirmation, and idempotency rules as an equivalent production invitation.
* Be disabled or omitted when the application runs against the production invitation source.

The synthetic `DEVxxx` values used here are intentionally recognizable as development fixtures. Their canonical values still satisfy the runtime six-character alphanumeric format, and their guest-facing display values are derived in the ordinary `XXX-XXX` form.

### 13.2 Configuration Fixtures Versus Behavioral Scenarios

Step 11 distinguishes an **invitation configuration fixture** from an **RSVP behavioral scenario**.

An invitation configuration fixture defines only private invitation attributes needed to authorize and render a form, such as:

* `wordingMode`.
* `maximumAttendance`.
* `additionalGuestAllowance`.
* `questionProfile`.
* `questionIds`.
* `active`.
* `environment`.

A behavioral scenario additionally defines a fictional interaction or stored-state condition, such as:

* Ceremony-only attendance.
* Reception-only attendance.
* Full decline.
* A prior stored response followed by a partial revision.
* A post-storage delivery warning.
* A safe idempotent retry after an uncertain browser result.

Those behavioral facts must not be added to the invitation configuration merely to make the fixture self-describing. Stored RSVP state, delivery results, and idempotency records remain separate backend concerns.

### 13.3 Compatibility with Existing Form-Schema Examples

The Step 11 expansion preserves the four development codes already referenced by `rsvp-example-form-schemas.json`:

* `DEV001` remains the `default` profile example with `additionalGuestAllowance: 0`.
* `DEV002` remains the `default` profile example with `additionalGuestAllowance: 1`.
* `DEV003` remains the `default` profile example with an allowance greater than one.
* `DEV004` remains the `reduced-attendance-dietary` profile example.

Step 11 therefore expands the development fixture set without requiring a Step 11 rewrite of `rsvp-example-form-schemas.json`.

### 13.4 Step 11 Development Configuration Registry

The complete Step 11 development configuration fixture set is stored in:

`docs/rsvp-example-configurations.json`

The registry is:

| Fixture | Primary archetype purpose | `wordingMode` | `questionProfile` | `maximumAttendance` | `additionalGuestAllowance` | Active |
|---|---|---|---|---:|---:|---|
| `DEV001` / `DEV-001` | A — Singular, no additional guest | `singular` | `default` | 1 | 0 | Yes |
| `DEV005` / `DEV-005` | B — Plural household, no additional guest | `plural` | `default` | 4 | 0 | Yes |
| `DEV006` / `DEV-006` | C — Singular, one additional guest authorized | `singular` | `default` | 2 | 1 | Yes |
| `DEV002` / `DEV-002` | D — Plural household, one additional guest authorized | `plural` | `default` | 5 | 1 | Yes |
| `DEV007` / `DEV-007` | E — Ceremony-only attendance scenario | `plural` | `default` | 3 | 0 | Yes |
| `DEV008` / `DEV-008` | F — Reception-only attendance scenario | `plural` | `default` | 3 | 0 | Yes |
| `DEV009` / `DEV-009` | G — Entire party declines | `plural` | `default` | 4 | 1 | Yes |
| `DEV010` / `DEV-010` | H — Existing-response revision | `plural` | `default` | 4 | 1 | Yes |
| `DEV003` / `DEV-003` | I — Multiple additional guests authorized | `plural` | `default` | 7 | 3 | Yes |
| `DEV004` / `DEV-004` | J — Reduced attendance-and-dietary profile | `plural` | `reduced-attendance-dietary` | 2 | 0 | Yes |
| `DEV999` / `DEV-999` | Disabled-development guard fixture | `singular` | `default` | 2 | 1 | No |

`DEV999` is not a guest-flow archetype. It exists to exercise the rule that a structurally valid development record can still be inactive and therefore unavailable to an ordinary valid lookup.

### 13.5 Archetype A — Singular, No Additional Guest

**Configuration fixture:** `DEV001`

Purpose:

* Exercise explicit singular wording.
* Exercise a maximum attendance of one.
* Exercise the default profile with `additionalGuestAllowance: 0`.
* Confirm that no additional-guest question is returned or accepted.

Expected blank-form behavior:

* The greeting is singular.
* `eventAttendance` and `declineAttendance` use the singular label variants.
* `attendanceTotals` is part of the default profile.
* `dietaryPreferences` is present as the optional party-level dietary field while attending.
* `additionalGuestAttendance` is absent because the allowance is zero.
* Operational confirmation fields remain available.

Representative valid attending result:

```json
{
  "eventAttendance": ["ceremony", "reception"],
  "declineAttendance": false,
  "attendanceTotals": {
    "adults21Plus": 1,
    "youngAdults18To20": 0,
    "children3To17": 0,
    "childrenUnder3": 0
  },
  "overallAttendance": 1,
  "dietaryPreferences": null
}
```

The backend must reject an `additionalGuestAttendance` change for this fixture as unauthorized.

### 13.6 Archetype B — Plural Household, No Additional Guest

**Configuration fixture:** `DEV005`

Purpose:

* Exercise explicit plural wording.
* Exercise a larger household maximum without named-guest rendering.
* Exercise adult and child attendance totals without any named-child controls.
* Confirm that no additional-guest question is rendered when the allowance is zero.

Representative valid attending result:

```json
{
  "eventAttendance": ["ceremony"],
  "declineAttendance": false,
  "attendanceTotals": {
    "adults21Plus": 2,
    "youngAdults18To20": 0,
    "children3To17": 1,
    "childrenUnder3": 1
  },
  "overallAttendance": 4,
  "dietaryPreferences": "One member of the fictional party has a dairy-free preference."
}
```

The example dietary text is fictional development data. It must not be copied from a production guest response.

### 13.7 Archetype C — Singular, One Additional Guest Authorized

**Configuration fixture:** `DEV006`

Purpose:

* Exercise singular wording together with one authorized additional guest.
* Exercise the allowance-one Yes/No representation.
* Confirm that one attending additional guest is included inside the complete attendance totals rather than counted separately.

Expected blank-form behavior:

* `additionalGuestAttendance` is returned.
* The allowance-one control uses the approved Yes/No representation.
* An answer of `"yes"` represents one attending additional guest.
* An answer of `"no"` represents zero attending additional guests.
* The complete age-category total remains subject to `maximumAttendance: 2`.

Representative valid result with the additional guest attending:

```json
{
  "eventAttendance": ["ceremony", "reception"],
  "declineAttendance": false,
  "additionalGuestAttendance": "yes",
  "attendanceTotals": {
    "adults21Plus": 2,
    "youngAdults18To20": 0,
    "children3To17": 0,
    "childrenUnder3": 0
  },
  "overallAttendance": 2,
  "dietaryPreferences": null
}
```

The backend must reject a complete result in which the effective additional-guest count exceeds `overallAttendance` or the attendance total exceeds the invitation maximum.

### 13.8 Archetype D — Plural Household, One Additional Guest Authorized

**Configuration fixture:** `DEV002`

Purpose:

* Exercise plural wording with a positive additional-guest allowance.
* Exercise household totals with an attending additional guest.
* Exercise maximum-attendance validation when the invited household and additional guest are represented only through party-level totals.
* Preserve `DEV002` as the allowance-one example referenced by `rsvp-example-form-schemas.json`.

Representative valid result:

```json
{
  "eventAttendance": ["reception"],
  "declineAttendance": false,
  "additionalGuestAttendance": "yes",
  "attendanceTotals": {
    "adults21Plus": 3,
    "youngAdults18To20": 0,
    "children3To17": 1,
    "childrenUnder3": 0
  },
  "overallAttendance": 4,
  "dietaryPreferences": null
}
```

The presence of `maximumAttendance: 5` does not tell the browser how many named invitees exist. The system does not infer an individual guest roster from the maximum or the allowance.

### 13.9 Archetype E — Ceremony Only

**Configuration fixture:** `DEV007`

Purpose:

* Exercise an attending state in which `eventAttendance` contains only `ceremony`.
* Confirm that `declineAttendance` is false.
* Confirm that default-profile attendance totals remain applicable and required.
* Confirm the current Step 9 dietary rule for Ceremony-only attendance.

Representative valid result:

```json
{
  "eventAttendance": ["ceremony"],
  "declineAttendance": false,
  "attendanceTotals": {
    "adults21Plus": 2,
    "youngAdults18To20": 0,
    "children3To17": 1,
    "childrenUnder3": 0
  },
  "overallAttendance": 3,
  "dietaryPreferences": "Fictional ceremony-only dietary note."
}
```

For the current project version, the Step 9 dependency rule controls: `dietaryPreferences` is applicable to **any attending state**, including Ceremony only. It is therefore not hidden or automatically cleared merely because Reception is not selected. A full decline is the controlling condition that automatically clears dietary information.

This Step 11 archetype intentionally follows the later Step 9 rule rather than reintroducing an older Reception-only dietary assumption.

### 13.10 Archetype F — Reception Only

**Configuration fixture:** `DEV008`

Purpose:

* Exercise an attending state in which `eventAttendance` contains only `reception`.
* Confirm that `declineAttendance` is false.
* Confirm that default-profile attendance totals are positive and within the invitation maximum.
* Confirm that the optional party-level dietary field is applicable.

Representative valid result:

```json
{
  "eventAttendance": ["reception"],
  "declineAttendance": false,
  "attendanceTotals": {
    "adults21Plus": 2,
    "youngAdults18To20": 1,
    "children3To17": 0,
    "childrenUnder3": 0
  },
  "overallAttendance": 3,
  "dietaryPreferences": "One fictional attendee requests a vegetarian option."
}
```

### 13.11 Archetype G — Entire Party Declines

**Configuration fixture:** `DEV009`

Purpose:

* Exercise a complete full-decline state.
* Exercise authoritative clearing of attendance-dependent substantive data.
* Confirm that an additional-guest response does not survive the decline.
* Confirm that attendance totals do not survive the decline as a synthetic all-zero object.
* Confirm that dietary information is cleared.
* Confirm that operational confirmation information remains required.

The authoritative complete declined result is:

```json
{
  "eventAttendance": [],
  "declineAttendance": true,
  "dietaryPreferences": null
}
```

Because the default profile is declining:

* `additionalGuestAttendance` is inapplicable and omitted.
* `attendanceTotals` is inapplicable and omitted.
* `overallAttendance` is omitted because it is not defined without attendance totals.
* `dietaryPreferences` is represented as `null` in the successful guest-facing RSVP.
* A valid Email or Text Message confirmation object is still required for the online submission.

If the same request contains profile-authorized attendance-dependent values while also establishing a valid full-decline pair, the backend applies the Step 9 full-decline clearing rule before final complete-state validation.

### 13.12 Archetype H — Existing Response Revision

**Configuration fixture:** `DEV010`

Purpose:

* Exercise a lookup when a fictional current RSVP already exists.
* Confirm that the validated form still loads blank.
* Confirm that lookup returns no stored-answer indicator.
* Exercise a partial substantive revision.
* Exercise explicit zero and explicit clear behavior.
* Confirm that omitted stored values remain unchanged.
* Confirm that newly entered operational confirmation values replace the prior operational values.
* Confirm that the success response contains the complete merged RSVP rather than only changed fields.

#### Fictional stored starting response

For this archetype only, assume the private backend test fixture contains the following current substantive RSVP before the new revision begins:

```json
{
  "eventAttendance": ["ceremony", "reception"],
  "declineAttendance": false,
  "additionalGuestAttendance": "yes",
  "attendanceTotals": {
    "adults21Plus": 2,
    "youngAdults18To20": 0,
    "children3To17": 1,
    "childrenUnder3": 0
  },
  "dietaryPreferences": "One fictional attendee has a vegetarian preference."
}
```

Assume a valid stored operational confirmation record also exists privately. The lookup response still must not reveal that record or its destination.

#### Blank revision form

After `DEV010` is validated:

* The browser receives the ordinary limited blank-form schema.
* No prior event selection is checked.
* No prior decline state is shown.
* No prior additional-guest answer is shown.
* All attendance-total inputs begin blank.
* The dietary field begins blank.
* The confirmation method and destination fields begin blank.
* The browser receives no `existingResponse`, `hasResponse`, current version, stored-answer, or stored-destination indicator.

#### Representative partial revision

The guest may submit a genuinely new logical revision that:

* Replaces only `children3To17` with explicit numeric zero inside `attendanceTotals`.
* Explicitly clears `dietaryPreferences`.
* Re-enters a complete valid operational confirmation object.
* Omits `eventAttendance`, `declineAttendance`, and `additionalGuestAttendance` because those substantive values are intended to remain unchanged.

After the backend merge, the complete resulting substantive RSVP is:

```json
{
  "eventAttendance": ["ceremony", "reception"],
  "declineAttendance": false,
  "additionalGuestAttendance": "yes",
  "attendanceTotals": {
    "adults21Plus": 2,
    "youngAdults18To20": 0,
    "children3To17": 0,
    "childrenUnder3": 0
  },
  "overallAttendance": 2,
  "dietaryPreferences": null
}
```

The new version becomes current only after the complete merged state validates.

The confirmation identifies the action as a revision and contains this complete merged current RSVP rather than only the changed child-total and dietary fields.

### 13.13 Archetype I — Multiple Additional Guests Authorized

**Configuration fixture:** `DEV003`

Purpose:

* Exercise the current integer `additionalGuestAllowance` model beyond a simple Boolean plus-one case.
* Exercise the bounded whole-number additional-guest control.
* Confirm that no additional-guest name fields are introduced.
* Confirm that the additional-guest count is included within the complete party attendance totals.
* Preserve `DEV003` as the multiple-allowance example referenced by `rsvp-example-form-schemas.json`.

The configured allowance is `3`, so an attending response may use an integer from `0` through `3`.

Representative valid result:

```json
{
  "eventAttendance": ["ceremony", "reception"],
  "declineAttendance": false,
  "additionalGuestAttendance": 2,
  "attendanceTotals": {
    "adults21Plus": 4,
    "youngAdults18To20": 0,
    "children3To17": 1,
    "childrenUnder3": 0
  },
  "overallAttendance": 5,
  "dietaryPreferences": null
}
```

The backend must reject:

* A negative additional-guest count.
* A fractional additional-guest count.
* A count greater than `3`.
* An additional-guest count greater than `overallAttendance`.
* An `overallAttendance` greater than `maximumAttendance: 7`.

Changing the additional-guest count does not authorize the backend to guess which attendance age category should change.

### 13.14 Archetype J — Reduced Attendance-and-Dietary Profile

**Configuration fixture:** `DEV004`

Purpose:

* Exercise the second approved substantive profile.
* Confirm that the reduced profile is a closed set.
* Confirm that additional-guest and attendance-total fields are absent rather than disabled, zero-filled, or labeled not applicable.
* Confirm that operational confirmation requirements still apply.
* Preserve `DEV004` as the reduced-profile example referenced by `rsvp-example-form-schemas.json`.

Expected substantive blank-form questions:

* `eventAttendance`.
* `declineAttendance`.
* `dietaryPreferences`.

Expected absent substantive questions:

* `additionalGuestAttendance`.
* `attendanceTotals`.

Representative valid attending result:

```json
{
  "eventAttendance": ["ceremony", "reception"],
  "declineAttendance": false,
  "dietaryPreferences": null
}
```

The backend must reject an attempted `additionalGuestAttendance` or `attendanceTotals` change for this fixture as unauthorized.

`additionalGuestAllowance: 0` remains present in the private development configuration for shape consistency, but the limited guest-facing invitation object omits the allowance for the reduced profile because that profile does not expose an additional-guest control.

### 13.15 Disabled Development Guard Fixture

**Configuration fixture:** `DEV999`

Purpose:

* Exercise a structurally valid canonical development code whose configuration is inactive.
* Confirm that inactive and unknown codes do not produce guest-facing existence disclosures.
* Confirm that a development fixture is not automatically authorized merely because its code normalizes successfully.

Expected behavior:

* The code normalizes successfully.
* The private record may be found internally.
* The ordinary guest-facing experience remains the neutral invalid-invitation state because `active` is false.
* No blank personalized form schema is returned.
* No private indication that the code exists but is disabled is exposed.

### 13.16 Confirmation-Channel Scenario Overlay

The substantive archetypes above may each be exercised with either approved guest confirmation channel.

For an Email scenario:

```json
{
  "method": "email",
  "email": "fictional.guest@example.invalid"
}
```

For a Text Message scenario, use a clearly fictional development number reserved for documentation/test use and the applicable authorization flag when centralized configuration requires it.

The Step 11 archetype model does not store these example destinations in `rsvp-example-configurations.json`.

Confirmation behavior remains operational rather than substantive:

* The selected channel is required for every online initial submission and revision.
* The selected destination is newly entered.
* Stored destinations are not returned during lookup.
* Successful guest and administrative delivery attempts occur only after RSVP storage succeeds.
* A delivery problem does not roll back the stored RSVP.

### 13.17 Delivery-Warning Scenario Overlay

Any archetype that stores successfully may be combined with a fictional delivery-warning outcome.

For example, after Archetype C stores successfully:

* Administrative email may report `sent`.
* Guest delivery may report `failed` or `uncertain`.
* The successful RSVP result still represents stored data.
* React enters State 11 — Stored with Delivery Warning.
* The interface must not ask the guest to resubmit merely because delivery failed.
* An authorized resend does not create a new RSVP version.

This overlay tests the separation between storage and delivery without adding delivery-state fields to the invitation configuration.

### 13.18 Idempotent Safe-Retry Scenario Overlay

Archetype H is also the primary Step 11 fixture for an uncertain-outcome safe retry.

Assume React submitted one logical revision with a UUID-form `clientSubmissionId`, the browser lost the definitive response, and State 8 — Submission Uncertain was shown.

For the safe retry:

* React reuses the same `clientSubmissionId`.
* React sends materially the same logical request.
* If the backend already stored the logical revision, the backend returns the prior successful result as an idempotent replay.
* No new RSVP version is written.
* Attendance is not double-counted.
* Confirmation delivery is not duplicated merely because the HTTP request was replayed.
* The returned successful response may identify the response as an idempotent replay through the Step 8 `submission` object.

A genuinely new later revision uses a new `clientSubmissionId`.

Reusing the same identifier with materially different request content is invalid and must not be treated as a new revision.

### 13.19 Initial-versus-Revision Determination Across Archetypes

No archetype may cause the browser to determine initial versus revision status from lookup.

For every active development configuration:

* Lookup returns a blank form.
* Lookup contains no stored-response indicator.
* The backend determines initial versus revision only when processing the submission.
* An initial response must provide the complete required substantive state for the applicable profile.
* A revision may omit substantive fields that are intended to remain unchanged.
* An operational-confirmation-only revision may use an empty `changes` object.
* The confirmation response identifies whether the stored logical action was initial or revision.

Archetype H merely guarantees that a backend current response exists so the revision path can be exercised deterministically in development.

### 13.20 Production Isolation

The fictional fixture set must be isolated from production by configuration and deployment practice.

At minimum:

1. Production invitation generation does not source records from `rsvp-example-configurations.json`.
2. Production startup or deployment must not activate `environment: "development"` fixtures.
3. Real production invitation configurations remain outside public source control.
4. Development fixtures must not be transformed into production records through a bulk import unless a deliberate migration process strips the fixtures and validates the production source separately.
5. A production safety check should fail closed if a development fixture would otherwise become active in the production invitation source.
6. Synthetic codes must not be printed on real invitations.
7. Synthetic confirmation destinations must not be replaced with real guest destinations merely to reuse a documentation fixture.

### 13.21 Step 11 Cross-Document Boundary

Step 11 changes only the development fixture set and the system-design documentation of those fixtures.

It does not change:

* The Step 4 API endpoint contract.
* The Step 6 form-schema shape.
* The Step 7 limited blank-form response.
* The Step 8 request envelope or operation names.
* The Step 9 conditional/dependency rules.
* The Step 10 thirteen-state interface model.
* The public sitemap.
* Page responsibilities.
* Wireframe layout.
* The production question bank, which remains Phase 4 work.

`rsvp-example-configurations.json` remains a development-only example file. It is not a source of production guest data.

Phase 3 Step 12 uses these archetypes as concrete fixtures in the preliminary RSVP test catalog.

---

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

* The substantive RSVP question profiles.
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

Analytics must not receive personalized RSVP or invitation data.

Prohibited analytics values include:

* Invitation codes.
* Guest names or party identities derived from invitation records.
* RSVP answers.
* Attendance selections.
* Decline status.
* Additional-guest responses.
* Attendance totals.
* Dietary or allergy information.
* Email addresses.
* Mobile numbers.
* Confirmation destinations.
* `clientSubmissionId` values.
* Question-profile assignments.
* Additional-guest allowances.
* RSVP version numbers.
* Delivery-provider payloads.
* Private administrative identifiers.

If analytics are enabled on RSVP or confirmation routes, events may be limited to non-personalized aggregate interaction names such as:

* RSVP entry viewed.
* Generic lookup attempt.
* Generic invalid-invitation state displayed.
* Generic validation state displayed.
* Generic successful confirmation state displayed.
* Generic delivery-warning state displayed.

An analytics event must not include a value that can be used to reconstruct which invited party performed the interaction.

Analytics must not be required for RSVP functionality.

A failure or blocking of analytics must not prevent code lookup, form completion, submission, storage, confirmation delivery, or guest recovery.

### 15.7 Routine Logging Boundary

Ordinary application, reverse-proxy, and delivery logs must follow data minimization.

Routine logs may contain operational values such as:

* A server-generated request or correlation identifier.
* Timestamp.
* Endpoint or route category.
* HTTP status.
* Request duration.
* Generic error category.
* Guest-selected delivery channel without the destination.
* Rate-limit events.
* Non-sensitive delivery outcome categories.

Routine logs must not contain:

* Raw invitation codes.
* Guest names or party display names.
* RSVP lookup request bodies.
* RSVP submission request bodies.
* RSVP response bodies.
* RSVP answers.
* Dietary or allergy text.
* Email addresses.
* Mobile numbers.
* Confirmation destinations.
* `clientSubmissionId` values.
* Spreadsheet rows.
* Worksheet contents.
* Private administrative notes.
* Google credentials.
* Email or SMS credentials.
* Provider secrets.
* Full provider request or response payloads.

Middleware or proxy access logging must therefore be configured so that POST request bodies are not logged.

Provider error handling must extract only the minimum non-sensitive status needed for operation rather than copying full provider payloads into ordinary logs.

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

The Google Sheets workbook containing invitation configuration and RSVP responses remains private administrative infrastructure.

It may be accessible only to:

* The couple.
* Explicitly authorized administrators.
* The backend service account.

It must not be:

* Published to the web.
* Exposed through a public share link.
* Embedded into the frontend.
* Returned through a public API.
* Used as a browser-direct data source.

The browser must never receive complete workbook rows, spreadsheet row numbers, unnecessary worksheet names, or unrelated invitation records.

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

### 15.17 Protected Dietary and Allergy Information Boundary

Party-level dietary or allergy information is private RSVP content.

It may appear only in the surfaces required by the approved RSVP workflow:

* The submitting party's own temporary on-screen confirmation.
* The submitting party's own selected email confirmation.
* The submitting party's own selected text-message confirmation.
* The protected administrative confirmation.
* Authorized private administrative records required to operate the RSVP.

It must not appear in:

* Analytics.
* Public informational pages.
* Public metadata.
* Ordinary logs.
* Unrelated administrative messages.
* Another invited party's response.
* Public troubleshooting output.

This rule does **not** remove dietary information from the approved complete-current-RSVP confirmation model.

The protected administrative confirmation may contain the complete current RSVP, including party-level dietary/allergy information, because it is private correspondence sent only to the approved administrative destination.

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
* Party-level dietary or allergy text.
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

The finalized privacy/security rules wrap the existing RSVP flow as follows:

```text
HTTPS browser request
  |
  |  no invitation code in URL
  |  no personalized analytics payload
  v
/wedding/rsvp/
  |
  |  Cache-Control: no-store, max-age=0
  v
POST /wedding/api/rsvp/lookup
  |
  |-- request-body inviteCode
  |-- trusted-proxy-aware IP rate limit
  |-- 10 lookups / 15 minutes / client IP
  |-- authoritative normalization
  |-- neutral invalid-code behavior
  |-- routine logs exclude raw code/body
  v
Limited blank-form response
  |
  |  no-store
  |  no stored answers
  |  no stored contact destination
  v
Guest completes blank form
  |
  v
POST /wedding/api/rsvp/submit
  |
  |-- 6 submits / 15 minutes / client IP
  |-- 6 submits / 15 minutes / normalized code
  |-- routine logs exclude body/answers/contact data
  |-- backend-only Google/email/SMS credentials
  |-- authoritative validation/merge/idempotency
  v
Private versioned storage
  |
  |-- private administrative workbook
  |-- production data separated from DEV fixtures
  v
Protected administrative confirmation
  +
Guest-selected confirmation
  |
  |-- complete current RSVP
  |-- dietary information restricted to authorized surfaces
  |-- SMS only if provider disclosure gate is satisfied
  v
Limited successful browser response
  |
  |  no-store
  |  no sensitive URL
  v
Temporary confirmation state
  |
  +--> State 9 / 10 / 11 when usable
  |
  +--> State 12 when unavailable

Post-event lifecycle:
  Active RSVP-operational data retirement by July 30, 2027
  Protected backup retirement by August 29, 2027
```

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

The Step 14 rules in this document must remain synchronized with:

* `decisions.md` — governing privacy/security decisions and permanent requirements.
* `rsvp-api-contract.md` — exact API-facing cache, rate-limit, logging, error, and credential behavior.
* `rsvp-test-cases.md` — executable verification coverage for the finalized rules.
* `page-outlines.md` — guest-facing Privacy-page responsibilities and final retention/provider wording.
* `wireframes.md` — browser-facing Privacy-page information order.
* `requirements.md` — project-wide functional and nonfunctional requirements.
* `sitemap.md` — public/private and indexing boundaries.
* `route-inventory.md` — browser-route privacy, indexing, and metadata behavior.
* `rsvp-example-form-schemas.json` — provider-neutral `smsAuthorization` structure and production channel availability.
* `rsvp-example-configurations.json` — development-fixture isolation from production.

The Step 14 design does not by itself change the factual public Privacy-page prose in `page-outlines.md` or `wireframes.md`; those files are synchronized in the later working-sequence review after the core system design, API contract, and test catalog have been finalized.

---

## 16. Phase 3 Step 1 Completion Check

Phase 3 Step 1 is complete because this document records that:

* Guests begin RSVP access through manual invitation-code entry at `/wedding/rsvp/`.
* Invitation codes are submitted in request bodies rather than code-bearing browser URLs.
* React performs usability normalization, but Express independently performs authoritative invitation validation.
* Malformed or unknown invitations receive a guest-safe neutral result.
* The backend loads the private invitation-party configuration.
* The backend selects the permitted question profile, questions, and wording.
* A successful lookup returns only a limited blank-form schema and no stored RSVP answers.
* React renders the personalized form as a state of `/wedding/rsvp/`.
* The RSVP form remains blank for both initial submissions and revisions.
* The approved `default` and `reduced-attendance-dietary` substantive profiles are supported.
* The default profile supports integer additional-guest allowances of zero, one, or greater than one without requesting additional-guest names.
* An initial RSVP supplies the fields necessary for a complete valid response under the applicable profile.
* A revision may submit only the RSVP fields that need to change.
* Omitted revision fields remain unchanged.
* Express revalidates the invitation code during submission.
* The backend verifies the deadline, authorization, question profile, submitted values, additional-guest allowance, maximum attendance, and duplicate-submission protection.
* The backend determines initial versus revision status.
* Revisions load and merge with the current stored RSVP.
* Incompatible dependent values are cleared or rejected as required.
* The complete resulting RSVP is validated before storage.
* Invalid, unauthorized, or contradictory resulting states are rejected without exposing omitted stored values.
* Successful submissions create a new RSVP version and update the authoritative current response.
* RSVP storage occurs before confirmation delivery.
* The backend attempts a protected administrative email.
* The backend attempts guest email or text-message confirmation according to the selected method.
* Delivery results are stored separately from RSVP content.
* Confirmation-delivery failure does not undo or duplicate the stored RSVP.
* Successful submission returns the complete current profile-applicable guest-facing RSVP needed for confirmation.
* React navigates to `/wedding/rsvp/confirmation` using temporary state rather than sensitive URL data.
* The confirmation experience can distinguish ordinary success from successful storage with a delivery warning.
* The RSVP architecture remains party-level and does not recreate named-guest forms, direct personalized links, stored-answer prefilling, per-person dietary questions, accessibility questions, travel questions, message fields, entrée selections, or additional-guest name fields.
* The design does not require application logic that assumes a permanently fixed number of invitation records.

---

## 17. Phase 3 Step 2 Completion Check

Phase 3 Step 2 is complete because this document records that:

* React and Express use the same observable invitation-code normalization behavior.
* React normalization exists only for usability.
* Express remains authoritative.
* Express independently normalizes every lookup.
* Express independently normalizes every initial submission and revision.
* A prior successful lookup does not allow submission-time normalization or validation to be skipped.
* The normalization operations occur in a fixed order.
* The received value is first converted to a string.
* Leading and trailing whitespace is removed.
* Internal ordinary whitespace is removed.
* Hyphens are removed.
* Letters are converted to uppercase.
* Remaining characters outside `A–Z` and `0–9` cause rejection.
* Exactly six characters must remain.
* The canonical internal invitation key is the six-character uppercase unhyphenated value.
* The guest-facing display code is derived from the canonical key in `XXX-XXX` form.
* Lowercase letters are accepted when normalization otherwise succeeds.
* The printed hyphen may be present or omitted.
* Ordinary whitespace may be tolerated according to the approved normalization process.
* Underscores, punctuation, short values, long values, empty values, and other values that fail the post-normalization six-character alphanumeric requirement are rejected.
* A rejected value has no valid canonical key or accepted display code.
* No fuzzy matching, close-match suggestion, keyboard correction, or letter/digit substitution is permitted.
* Malformed, unknown, and inactive codes do not disclose their differing internal classifications to the guest.
* Runtime validation does not re-enforce the historical minimum-letter code-generation requirement.
* The same normalization algorithm is used to validate production source records before activation.
* Production preparation rejects malformed invitation codes.
* Production preparation rejects canonical duplicate keys and normalization collisions.
* Every active canonical key must map to exactly one invited-party configuration.
* The current private production source contains 56 invitation records.
* All 56 supplied production codes normalize successfully.
* All 56 normalized canonical keys are unique.
* No normalization collision exists in the current production source.
* Each current production code maps to one populated invited-party record.
* All supplied production display codes already use the approved `XXX-XXX` presentation.
* Real production codes and guest-account details remain outside public documentation, public source control, public assets, analytics, metadata, and ordinary logs.
* Synthetic documentation and development codes remain separate from active production invitation records.

---

## 18. Phase 3 Step 3 Completion Check

Phase 3 Step 3 is complete because this document records that:

* All printed invitations use the same static QR code for the public wedding homepage.
* The static QR code does not contain an invitation code and does not open a personalized RSVP URL.
* The guest selects RSVP from the public site and proceeds to `/wedding/rsvp/`.
* Manual entry of the printed invitation code at `/wedding/rsvp/` is the sole personalized RSVP access method.
* React may clean and normalize the entered code for usability, but client cleanup is not authoritative.
* React submits the invitation code in a POST request body.
* The invitation code is not placed in a browser path, query string, or URL fragment.
* The browser remains on `/wedding/rsvp/` during lookup and validated-form rendering.
* Express independently normalizes and validates the invitation code.
* A valid active code returns a limited blank-form schema.
* The resulting personalized form remains a blank controlled state of `/wedding/rsvp/`.
* An invalid or unknown code returns the neutral guest-facing state.
* Invalid or unknown results do not reveal close matches, other codes, guest identities, or invitation-record details.
* There is no direct personalized browser link.
* Revisions use the same manual-entry access method rather than a separate revision or personalized link.
* Successful client-side lookup does not eliminate submission-time backend revalidation.
* The API request and status contract is recorded in `rsvp-api-contract.md`, and Phase 3 Step 7 finalizes the successful limited blank-form response.

---

## 19. Phase 3 Step 7 Completion Check

Phase 3 Step 7 is complete because this document records that:

* A successful invitation lookup returns the exact limited blank-form response recorded in `rsvp-api-contract.md`.
* The response contains exactly `invitation`, `questions`, and `confirmationOptions` at the top level.
* The browser receives only guest-facing invitation values necessary to render the applicable form.
* Explicit `wordingMode` is returned rather than inferred.
* `maximumAttendance` is returned where needed for the applicable form.
* The `default` profile receives its nonnegative integer `additionalGuestAllowance`, including zero.
* The `reduced-attendance-dietary` profile does not receive `additionalGuestAllowance` because the profile does not authorize an additional-guest response.
* The backend returns only the question definitions applicable to the selected profile and allowance.
* An allowance of zero returns no `additionalGuestAttendance` field.
* An allowance of one returns the approved Yes/No additional-guest control.
* An allowance greater than one returns the bounded whole-number additional-guest control.
* The reduced profile returns neither `additionalGuestAttendance` nor `attendanceTotals`.
* Operational confirmation questions remain separate from the substantive profile through `scope: "operational"`.
* The browser may receive the centralized public deadline and `America/New_York` time zone.
* Lookup never returns current or superseded RSVP answers.
* Lookup never returns stored confirmation method, destination, SMS authorization, or delivery history.
* Lookup never returns an `existingResponse`, `currentResponse`, `hasResponse`, response version, or equivalent stored-response indicator.
* Lookup does not return another party's record, other invitation codes, private `partyId`, protected `active` or `environment` flags, workbook rows, child-allocation notes, credentials, private administrative notes, or administrative delivery addresses.
* Lookup does not reproduce the production invitation code merely because validation succeeded.
* The personalized form remains blank for both initial and revision access.
* The backend still determines initial-versus-revision status authoritatively at submission time.
* Client-side rendering and usability validation do not replace backend authorization or validation.

---

## 20. Phase 3 Step 8 Completion Check

Phase 3 Step 8 is complete because this document records that:

* The exact submission endpoint remains `POST /wedding/api/rsvp/submit` for both initial responses and revisions.
* Every submission uses the exact top-level request properties `inviteCode`, `clientSubmissionId`, `confirmation`, and `changes`.
* Invitation codes remain in request bodies and are independently normalized and revalidated by Express.
* `clientSubmissionId` is a UUID-form identifier generated once per logical submission.
* A safe retry reuses the original identifier and materially identical request content.
* A genuinely new RSVP action receives a new identifier.
* Reuse of one identifier for materially different logical request content is invalid.
* Operational confirmation information is separate from substantive RSVP changes.
* Email and text-message confirmation objects have distinct required destination fields.
* Required transactional SMS authorization accompanies the text-message confirmation object when configured.
* Only one guest confirmation channel is selected for a submission under the current requirements.
* Permanent substantive question IDs are used as `changes` keys.
* `replace` and authorized `clear` are the Step 8 client operation names.
* Explicit zero is an ordinary `replace` value rather than a separate operation.
* Omitted substantive fields remain unchanged during revisions.
* Omitted nested age-category totals remain unchanged during a partial attendance-total revision.
* An initial RSVP must provide everything necessary to construct a complete valid response.
* A revision may provide only the substantive fields that need to change.
* A confirmation-channel-only revision may use an empty `changes` object.
* Attendance and decline are represented as a complete intended pair whenever that controlling state is intentionally changed.
* Allowance-one additional-guest responses use `"yes"` or `"no"`.
* Multiple-additional-guest responses use a whole-number count from zero through the authoritative allowance.
* The additional-guest field is unauthorized for allowance zero and for the reduced profile.
* Attendance totals are unauthorized for the reduced profile.
* Initial default-profile totals provide all four age categories when applicable.
* Dietary information supports explicit replacement and clear semantics.
* The backend still determines initial versus revision status authoritatively from stored state.
* The backend merges revision changes with the current response and validates the complete result before storage.
* The current browser contract does not expose a private RSVP version and does not accept `expectedVersion`.
* Distinct revisions merge against the authoritative current response present when each is processed.
* A safe idempotent replay does not create another RSVP version or duplicate delivery attempt.
* A successful response uses exactly `submission`, `invitation`, `rsvp`, `confirmation`, and `revisionPolicy`.
* The success response contains the complete resulting guest-facing RSVP rather than only the fields submitted in a partial revision.
* The response omits profile-inapplicable substantive fields.
* The backend calculates `overallAttendance` whenever attendance totals are returned.
* The public successful response does not expose the invitation code, client submission identifier, confirmation destination, SMS authorization content, private RSVP version, or protected administrative address.
* Delivery statuses in the public response are limited to `sent`, `failed`, or `uncertain`.
* A post-storage delivery problem produces a successful RSVP result with a guest-safe delivery warning rather than a false storage failure.
* Detailed dependent-value relationships are finalized by Phase 3 Step 9 in Section 4.13 and synchronized with `rsvp-api-contract.md` and `rsvp-example-form-schemas.json`.

---

## 21. Phase 3 Step 9 Completion Check

Phase 3 Step 9 is complete because this document records that:

* Attendance and decline have exactly two valid complete-state forms: attending with one or more event selections and `declineAttendance: false`, or declining with no event selections and `declineAttendance: true`.
* An initial response must establish one valid attendance/decline state.
* A contradictory attendance/decline pair is invalid.
* Revision omission continues to mean leave unchanged.
* Dependency processing occurs after Step 8 merge operations and before final complete-state validation.
* A full decline automatically removes an applicable additional-guest response and attendance totals and clears dietary information.
* Declined default-profile responses do not preserve synthetic four-zero attendance-total objects merely to keep the field present.
* Operational confirmation remains required even when the party declines.
* Party-level dietary information is applicable to any attending state—Ceremony only, Reception only, or both—and is not restricted to Reception attendance.
* Dietary information is optional while attending and is automatically cleared on full decline.
* Default-profile attendance totals are required whenever the resulting RSVP is attending.
* All four age-category totals are required on an initial attending response and whenever totals become newly applicable after a prior decline.
* Partial revisions that remain attending may replace only selected age categories while omitted nested categories remain unchanged.
* The calculated overall attendance for an attending default-profile response is a positive whole-number sum that may not exceed `maximumAttendance`.
* An authorized additional-guest count may not exceed the complete overall attendance.
* Additional-guest responses are authorized only for the default profile with a positive `additionalGuestAllowance` while the party is attending.
* Allowance one continues to use `"yes"` or `"no"`; larger allowances continue to use bounded whole numbers.
* No backend rule guesses an additional guest's age category or automatically decrements attendance totals when an additional-guest response changes.
* The reduced profile never accepts additional-guest or attendance-total data.
* Email confirmation requires a valid email destination and excludes mobile/SMS fields.
* Text-message confirmation requires a valid SMS-capable mobile number, excludes email, and requires transactional authorization only when centralized configuration requires it.
* Unauthorized questions are rejected before dependency clearing can make them appear harmless.
* Stale stored values made inapplicable by a full decline are cleared before final validation.
* Missing newly applicable required values cause validation failure rather than being inferred from hidden stored data.
* Express enforces every dependency rule independently of React visibility.
* `rsvp-example-form-schemas.json` now carries Step 9-finalized display, clearing, validation, and dependency-rule metadata.
* The Step 8 request envelope and operation names remain unchanged.

---

## 22. Phase 3 Step 10 Completion Check

Phase 3 Step 10 is complete because this document records that:

* React is designed around thirteen explicit top-level RSVP states.
* Entry Ready is the normal open-RSVP starting state and includes the written deadline, conditional final-month countdown, printed alternative, privacy notice, and assistance information.
* Looking Up Invitation announces progress and prevents repeated lookup requests.
* Invalid Invitation uses neutral wording and reveals no close match, guest identity, record count, or internal source detail.
* Service Unavailable is reserved for a known inability to proceed when successful storage has not been established.
* Validated Blank Form renders only the authorized profile and allowance variant and never returns or displays stored RSVP answers or stored confirmation destinations.
* Validation Failure preserves current page-entered values and provides accessible form-level and field-level errors without implying storage.
* Submitting prevents duplicate activation and retains the logical request and `clientSubmissionId` until a definitive result is known.
* Submission Uncertain neither claims success nor failure and preserves the same logical request for an idempotent safe retry.
* Confirmed Initial Submission displays the complete current guest-facing RSVP after authoritative initial storage.
* Confirmed Revision displays the complete merged current guest-facing RSVP rather than only changed fields.
* Stored with Delivery Warning continues to state that storage succeeded and does not request resubmission merely because confirmation delivery failed or remains uncertain.
* Confirmation Refresh Fallback uses uncertainty-safe behavior and does not move sensitive summary data into the URL.
* RSVP Closed removes editable lookup and submission controls at and after the backend-authoritative deadline.
* A local deadline transition never overrides a backend response proving that a pre-deadline RSVP was stored successfully.
* The thirteen-state model distinguishes known pre-storage service failure from ambiguous post-request uncertainty.
* State transitions preserve the Step 8 idempotency rules and the Step 9 dependency rules.
* Progress, error, warning, uncertainty, success, and closed states have explicit accessibility requirements.
* `page-outlines.md` and `wireframes.md` are synchronized to the same thirteen-state conceptual model.
* No state creates a code-bearing personalized browser route or exposes stored answers merely to support revisions.

---

## 23. Phase 3 Step 11 Completion Check

Phase 3 Step 11 is complete because this document and `rsvp-example-configurations.json` record that:

* All Step 11 invitation codes, party identifiers, display names, greetings, RSVP values, dietary examples, and confirmation examples are fictional development data.
* No production invitation code or real guest identity is used as an archetype.
* Every active Step 11 code satisfies the ordinary six-character alphanumeric runtime shape and has a derived `XXX-XXX` display form.
* Every fixture is explicitly classified as `environment: "development"`.
* The existing `DEV001`, `DEV002`, `DEV003`, and `DEV004` schema-example mappings remain compatible with `rsvp-example-form-schemas.json`.
* A disabled `DEV999` guard fixture exists to exercise inactive-code behavior.
* Archetype A covers singular wording, maximum attendance one, and no additional-guest control.
* Archetype B covers plural household wording and age-category totals without named-child questions.
* Archetype C covers singular wording with one authorized additional guest and the allowance-one Yes/No representation.
* Archetype D covers plural wording with one authorized additional guest and household maximum validation.
* Archetype E covers Ceremony-only attendance under the current Step 9 rule that party-level dietary information remains applicable to any attending state.
* Archetype F covers Reception-only attendance with positive default-profile totals and optional party-level dietary information.
* Archetype G covers full decline, including clearing/removal of additional-guest state, attendance totals, and dietary information while preserving the operational confirmation requirement.
* Archetype H covers an existing fictional current response, blank revision lookup, partial merge, explicit numeric zero, explicit dietary clear, unchanged omitted fields, and complete merged confirmation.
* Archetype I covers a multiple-additional-guest allowance greater than one using the current integer allowance model.
* Archetype J covers the approved `reduced-attendance-dietary` profile and confirms that additional-guest and attendance-total questions are absent and unauthorized.
* Invitation configuration fixtures remain distinct from stored RSVP state, delivery state, and idempotency records.
* Delivery-warning behavior is exercised as a post-storage scenario overlay rather than an invitation-configuration field.
* Safe idempotent retry behavior is exercised by reusing the same logical request and `clientSubmissionId` after an uncertain outcome.
* A materially different request cannot reuse the same idempotency identifier as though it were a new revision.
* Lookup remains blank and does not reveal whether a current response exists for any archetype.
* Backend submission processing remains authoritative for determining initial versus revision.
* Step 11 does not change the Step 4 API contract, Step 6 schema shape, Step 7 lookup boundary, Step 8 payload envelope, Step 9 dependency rules, or Step 10 interface-state model.
* Development fixtures are prohibited from becoming active production invitation records.
* The fixture set provided the concrete inputs used by the Phase 3 Step 12 preliminary test catalog.

---

## 24. Phase 3 Step 12 Completion Check

Phase 3 Step 12 is complete because `rsvp-test-cases.md` now records a preliminary test catalog that:

* Covers accepted and rejected invitation-code normalization and lookup behavior.
* Covers manual entry, POST-body lookup, URL invariance, inactive/environment-ineligible fixtures, rate limiting, and known backend unavailability.
* Covers singular/plural wording, zero/one/multiple additional-guest allowances, maximum attendance, default/reduced profiles, and active/inactive development fixtures.
* Covers the blank-form invariant for initial and revision access and the prohibition on stored-response existence indicators.
* Covers omission, replacement, explicit numeric zero, explicit clear, attendance/decline transitions, and newly applicable revision fields.
* Covers Ceremony-only, Reception-only, combined attendance, full decline, contradictory states, attendance arithmetic, additional-guest bounds, and dietary applicability/clearing.
* Covers Email and Text Message operational confirmation dependencies.
* Covers initial and revision storage, current-response replacement, version history, duplicate activation, idempotent replay, materially changed identifier reuse, uncertain submission, and safe retry.
* Verifies that the current contract does not use client-supplied `expectedVersion` or ordinary `409 Conflict` concurrency handling.
* Covers independent guest and administrative delivery outcomes, delivery warning, manual resend, and the rule that delivery retry does not create another RSVP version.
* Covers all thirteen formal interface states.
* Covers confirmation routing, deadline/countdown behavior, accessibility, and the privacy boundaries already approved before Step 14.
* Exercises all Step 11 development archetypes and the disabled `DEV999` guard fixture.
* At the time Step 12 was completed, explicitly deferred the exact confirmation-refresh details assigned to Step 13 and the privacy/security implementation details assigned to Step 14 rather than inventing them prematurely; Steps 13 and 14 now finalize those respective areas.

---

## 25. Phase 3 Step 13 Completion Check

Phase 3 Step 13 is complete because this document records that:

* The ordinary successful confirmation source is the limited Step 8 successful response returned after authoritative RSVP storage.
* React carries that successful response to `/wedding/rsvp/confirmation` through temporary navigation/application state rather than through a personalized URL.
* State 9, 10, or 11 may render only when a structurally usable temporary successful response is available and reports that storage was recorded.
* The frontend uses `submission.action` and delivery-warning information rather than assuming that HTTP `200` means a revision.
* A refresh/history event does not itself force success or fallback; the renderer checks whether usable temporary successful state remains available.
* When that state is absent or unusable, the confirmation route enters State 12 — Confirmation Refresh Fallback.
* State 12 neither asserts success nor failure.
* State 12 does not automatically perform lookup, replay submission, create a new `clientSubmissionId`, or reconstruct a saved RSVP.
* The initial implementation requires no short-lived confirmation token and no separate public confirmation-recovery endpoint.
* The initial implementation does not require persistent browser storage solely to make the confirmation survive refresh.
* The finalized fallback copy instructs the guest to check the selected confirmation channel, avoid duplicate resubmission solely because the summary disappeared, use manual RSVP entry for a deliberate revision, and contact `RSVPhelp@loreweavercreations.com` when uncertain.
* `Return to RSVP` is a deliberate navigation action and remains subject to the backend-authoritative deadline.
* The fallback exposes no invitation code, RSVP summary, confirmation destination, protected administrative address, or provider internals through the URL.
* The fallback is accessible, text-based, keyboard/touch operable, and does not use an automatic timed redirect.
* Step 13 deliberately left cache-control, logging, rate-limit, credential, retention, and broader privacy/security requirements to Step 14; those requirements are now finalized in Section 15.

---

## 26. Phase 3 Step 14 Completion Check

Phase 3 Step 14 is complete because this document records that:

* Invitation codes are limited access tokens rather than passwords.
* The application exposes no public guest directory, code-recovery search, fuzzy/close-match suggestion, code-bearing personalized route, or public saved-RSVP endpoint.
* Invitation-code transport remains request-body-only.
* Production RSVP and confirmation browser responses and lookup/submission API responses use `Cache-Control: no-store, max-age=0`.
* Personalized RSVP and confirmation routes are excluded from public indexing and personalized values are prohibited from metadata.
* Analytics cannot receive invitation codes, guest identities derived from invitation records, RSVP answers, dietary information, confirmation destinations, `clientSubmissionId` values, profile assignments, allowances, versions, or provider payloads.
* Routine logs exclude raw invitation codes, RSVP request/response bodies, RSVP answers, dietary information, contact destinations, `clientSubmissionId` values, private workbook data, and secrets.
* A narrowly controlled, time-limited pseudonymous diagnostic correlation mechanism is permitted only when genuinely necessary.
* Lookup is limited to 10 requests per 15-minute rolling window per client IP in the initial production configuration.
* Submission is limited to 6 requests per 15-minute rolling window per client IP and 6 per 15-minute rolling window per normalized invitation code.
* Per-IP rate limiting relies only on the configured trusted proxy chain.
* Rate limiting does not change the approved storage, versioning, or idempotency model.
* Google, email, SMS, sender, and protected administrative-recipient credentials remain backend-only.
* The private administrative workbook remains non-public and browser-inaccessible.
* Production invitation data, development/test fixtures, and environment secrets remain separated.
* Guest-safe errors expose no infrastructure, provider, credential, spreadsheet, enumeration, or close-match information.
* Dietary/allergy information is limited to the submitting party's own confirmation surfaces, the protected administrative confirmation, and authorized private administrative records.
* RSVP mobile numbers are transactional-only.
* Text Message confirmation cannot be enabled in production until the selected provider's required disclosures and authorization wording are verified and implemented.
* Public security copy makes no unsupported promise of absolute security.
* Active RSVP-operational data is retired no later than July 30, 2027 unless a minimal record is temporarily required for a concrete documented administrative need.
* Protected backups containing retired RSVP-operational data expire by August 29, 2027.
* Non-identifying aggregate statistics may be retained after RSVP retirement.
* The private `Invitees List` may remain a separate personal planning/address record but must not keep the active public RSVP system dependent on retired response history.
* Production RSVP traffic uses HTTPS.
* Step 14 creates no new public RSVP endpoint.
* The Step 14 design is ready to be propagated into `rsvp-api-contract.md`, `rsvp-test-cases.md`, and the later browser-facing privacy-document synchronization.

With Step 14 complete, **Phase 3 — Design the RSVP System is complete.**

The next project phase is **Phase 4 — Establish the Visual Design System** after the remaining Step 14 cross-document replacements/reviews in the approved working sequence are completed.
