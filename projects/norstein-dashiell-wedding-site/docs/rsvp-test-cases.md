# RSVP Preliminary Test Cases

**Project:** Loreweaver Creations Wedding Website
**Phase:** Phase 3 — RSVP System Design and Planning; spreadsheet-authoritative revision
**Step:** Phase 3 Step 12 test catalog, synchronized through the corrected person-level attendance model
**Document:** `docs/rsvp-test-cases.md`
**Status:** Controlling preliminary test catalog; execution occurs during implementation, integration, production-gate, and lifecycle testing
**Phase 3 status:** Complete; RSVP data/form model resynchronized September 20, 2026
**Last updated:** September 20, 2026

---

## 1. Purpose

This document is the controlling preliminary test catalog for the Loreweaver Creations wedding RSVP system.

It translates the current approved requirements, decisions, API contract, one reusable form schema, fictional development configurations, thirteen-state browser model, temporary-confirmation/refresh-fallback behavior, and finalized privacy/security standard into testable cases.

The private couple-supplied `Invitees List` spreadsheet is authoritative for production invitation configuration and for the intended substantive RSVP presentation. The current production-source audit contains 57 active assigned invitation records. Those aggregate results are validation targets, not hard-coded renderer assumptions.

The corrected attendance model uses the invitation maximum as potential-party capacity, explicit Yes/No decisions for every authorized named invitee and authorized `Plus1` slot, backend-derived `overallAttendance`, age-category totals whose sum must equal that derived count, and exactly that many `attendeeDetails` records. Attendee names apply to every attending event combination; `dietaryPreferences` is optional and Reception-specific.

This document defines **expected behavior**. It does not claim that application code already satisfies every revised case. Tests marked as historically live validated against the superseded September 20 configuration shape must be rerun where the corrected invitation/configuration contract changes their subject.

Tests must use development or testing fixtures unless a controlled production-transformation validation explicitly requires the private source. Active production invitation codes, real guest identities, and private RSVP records must not be copied into ordinary automated fixtures, public documentation, or public source.

---

## 2. Governing Project Documents

The test cases in this file must remain consistent with the current approved versions of:

- `requirements.md`
- `decisions.md`
- `sitemap.md`
- `route-inventory.md`
- `page-outlines.md`
- `wireframes.md`
- `rsvp-system-design.md`
- `rsvp-api-contract.md`
- `rsvp-example-configurations.json`
- `rsvp-example-form-schemas.json`

The current Development and Deployment Plan is also a sequencing and coverage reference.

Where an older planning example conflicts with the authoritative spreadsheet or a later approved project decision, the later approved synchronized RSVP model controls.

In particular:

- The current production source contains 57 active assigned invitation records, 57 unique normalized codes, 35 singular `I` wording records, 22 plural `We` wording records, 23 invitations with at least one authorized `Plus1` allocation, 26 total `Plus1` allocations, two invitations with more than one allocation, and combined maximum-attendance capacity of 115.
- No production placeholder invitation is required by the active architecture.
- Production rendering uses one reusable RSVP form schema; the former `default` / `reduced-attendance-dietary` production-profile architecture is retired.
- `maximumAttendance` is potential-party capacity, not a browser-selected actual headcount.
- Every valid invitation configuration exposes a limited safe `namedInvitees` roster for non-`Plus1` potential attendees and satisfies `namedInvitees.length + additionalGuestAllocations.length = maximumAttendance`.
- Every authorized named invitee receives one Yes/No `namedInviteeResponses` control when the party is attending.
- A party receives a Plus 1 question **only** when its private invitation configuration contains the corresponding Column E `Plus1` allocation. Each allocation uses a stable private-authorized allocation ID for submission.
- A party with no authorized allocations receives no Plus 1 control and may not submit `additionalGuestResponses`.
- Attendance is represented by one closed-set `eventAttendance` value: Ceremony, Reception, both, or full decline.
- `overallAttendance` is backend-derived as the total count of Yes responses across complete `namedInviteeResponses` and `additionalGuestResponses`. It is not client-writable.
- Every attending response uses four coordinated numerical age-category dials whose complete sum must equal derived `overallAttendance` exactly.
- `attendeeDetails` is applicable whenever anyone attends, including Ceremony-only attendance, and contains exactly one required attendee name per derived attendee.
- `dietaryPreferences` is optional, limited to 1000 characters, labeled `Dietary or allergy information`, and authorized only when Reception is selected.
- A change in attendee identity composition requires complete `attendeeDetails` replacement even when the numeric attendee count is unchanged.
- Removing Reception while Ceremony attendance remains preserves attendee names and clears only Reception-specific dietary/allergy values.
- The current browser submission contract does **not** use client-supplied `expectedVersion`; ordinary `409 Conflict` is not part of the contract.
- The RSVP interface continues to use the thirteen-state model.
- Development fixtures are preferred for implementation testing; `DEV999` remains the inactive guard fixture.
- State 12 — Confirmation Refresh Fallback remains presentation/recovery guidance only and does not retrieve a saved RSVP or replay a submission automatically.
- The finalized privacy/security standard continues to require no-store responses, analytics/logging minimization, exact initial rate limits, trusted-proxy handling, backend-only credentials, environment separation, guest-safe errors, SMS-provider gating, HTTPS, and RSVP-data retirement.
- Invitation codes are limited access tokens rather than passwords; no public guest directory, code-recovery search, fuzzy/close-match suggestion, public saved-RSVP endpoint, or code-bearing personalized route is permitted.
- The initial lookup limit remains 10 requests per 15-minute rolling window per client IP.
- The initial submission limits remain 6 requests per 15-minute rolling window per client IP and 6 requests per 15-minute rolling window per normalized invitation code.
- Active RSVP-operational data is retired no later than July 30, 2027 unless a minimal record is temporarily required for a concrete documented administrative need; protected backups containing retired RSVP-operational data expire no later than August 29, 2027.

---

## 3. Test-Case Conventions

### 3.1 Test-case identifiers

| Prefix | Area |
|---|---|
| `CODE` | Invitation-code normalization and lookup |
| `APIH` | API health and endpoint boundaries |
| `CONF` | Invitation configuration and reusable form-schema behavior |
| `BLANK` | Blank-form and lookup privacy boundaries |
| `ATT` | Event attendance, named-invitee attendance, decline, and derived-headcount behavior |
| `ADD` | Authorized named-`Plus1` behavior |
| `TOTAL` | Age-category attendance-total and coordinated-dial behavior |
| `DIET` | Attendee-detail and Reception-specific dietary/allergy behavior |
| `INIT` | Initial-submission behavior |
| `REV` | Revision and merge behavior |
| `CHAN` | Guest confirmation-channel behavior |
| `ERR` | API error and authorization semantics |
| `STORE` | Storage, version history, concurrency, and idempotency |
| `DELIV` | Guest/admin delivery behavior |
| `STATE` | Thirteen-state React interface model |
| `PAGE` | Confirmation route and refresh behavior |
| `TIME` | Deadline and countdown behavior |
| `A11Y` | Accessibility behavior |
| `PRIV` | Privacy, security, caching, logging, credential, transport, and retention boundaries |
| `REL` | Persistence recovery and single-writer reliability |
| `EMAIL-LIVE` | Isolated live-email transport validation |
| `RESEND-CLI` | Manual resend maintenance CLI |
| `PROD-ACT` | Production invitation activation |
| `PROD-RUN` | Production runtime and deployment readiness |

### 3.2 Status labels

- **Required** — supported by the current finalized design and must be implemented and executed when the relevant implementation, production-gate, or lifecycle condition exists.
- **Implemented** — implementation behavior exists, but the case may still require ordinary regression execution.
- **Live validated** — the exact currently applicable behavior has been validated against a live controlled environment.
- **Historical live validation; rerun required** — the case passed under the prior September 20 production configuration/lookup contract, but the corrected person-level configuration shape materially changes what must be validated before the result can count for the current contract.

A test whose execution depends on production provider selection, deployment, or a future lifecycle date remains **Required**; execution timing does not make the requirement provisional.

### 3.3 General execution rule

For every server-side RSVP test, verify both:

1. The HTTP/API result.
2. The resulting authoritative stored state, version history, delivery records, or lack of mutation as applicable.

For every browser-facing test, verify both:

1. The visible state or behavior.
2. That no prohibited information is exposed through URLs, metadata, analytics payloads, browser storage, or unnecessary response content.

For every attendance test, distinguish **potential-party capacity** from **actual attending headcount**. `maximumAttendance` authorizes the roster/slots; person-level Yes/No responses derive actual `overallAttendance`; age totals and attendee-detail cardinality must reconcile to that derived value.

---

## 4. Development Fixture Registry

Use the fictional development fixtures defined in `rsvp-example-configurations.json` as the default test inputs.

| Fixture | Primary purpose | `wordingMode` | `maximumAttendance` | Named invitees | Authorized `Plus1` allocations | Active |
|---|---|---|---:|---:|---:|---|
| `DEV001` / `DEV-001` | Singular, one named invitee, no Plus 1 | `singular` | 1 | 1 | 0 | Yes |
| `DEV002` / `DEV-002` | Larger plural named household | `plural` | 5 | 5 | 0 | Yes |
| `DEV003` / `DEV-003` | Singular named invitee with one Plus 1 slot | `singular` | 2 | 1 | 1 | Yes |
| `DEV004` / `DEV-004` | Plural household with one Plus 1 slot | `plural` | 4 | 3 | 1 | Yes |
| `DEV005` / `DEV-005` | Ceremony-only scenario fixture | `plural` | 4 | 4 | 0 | Yes |
| `DEV006` / `DEV-006` | Reception-only scenario fixture | `singular` | 2 | 1 | 1 | Yes |
| `DEV007` / `DEV-007` | Combined Ceremony + Reception scenario | `plural` | 3 | 3 | 0 | Yes |
| `DEV008` / `DEV-008` | Existing-response and same-count revision scenario | `plural` | 3 | 3 | 0 | Yes |
| `DEV009` / `DEV-009` | Multiple named Plus 1 allocations | `plural` | 7 | 4 | 3 | Yes |
| `DEV010` / `DEV-010` | Capacity/equality boundary scenario | `plural` | 4 | 3 | 1 | Yes |
| `DEV999` / `DEV-999` | Disabled-development guard fixture | `plural` | 2 | 1 | 1 | No |

Every fixture above satisfies `namedInvitees.length + additionalGuestAllocations.length = maximumAttendance`.

`DEV999` is not an ordinary guest-flow fixture. It exists to test inactive/environment-ineligible lookup behavior.

The named-invitee display names, opaque IDs, allocation prompts, and allocation IDs in these fixtures are fictional. They test the same structural behavior required by production without exposing production identities or codes.

Use a separately reserved synthetic unknown code such as `UNK-404` only in a test environment where it has been confirmed not to exist.

---

# 5. Invitation-Code Normalization and Lookup Tests

| ID | Fixture / Context | Test | Expected result | Status |
|---|---|---|---|---|
| `CODE-001` | `DEV001` | Submit `DEV-001` to lookup. | Normalizes to canonical `DEV001`; lookup proceeds. | Required |
| `CODE-002` | `DEV001` | Submit lowercase `dev-001`. | Normalizes to `DEV001`; behavior matches uppercase input. | Required |
| `CODE-003` | `DEV001` | Submit `DEV001` without the display hyphen. | Normalizes to `DEV001`; lookup proceeds. | Required |
| `CODE-004` | `DEV001` | Submit ordinary internal spaces, e.g. `D E V 0 0 1`. | Ordinary whitespace is removed; canonical result is `DEV001`. | Required |
| `CODE-005` | `DEV001` | Submit leading and trailing whitespace around a valid code. | Leading/trailing whitespace is removed; lookup proceeds. | Required |
| `CODE-006` | `DEV001` | Submit mixed case, spaces, and hyphen that normalize to the same six characters. | Observable normalization matches the canonical `DEV001` result. | Required |
| `CODE-007` | Synthetic | Submit fewer than six permitted characters after cleanup. | Rejected as malformed; no canonical lookup key is accepted. | Required |
| `CODE-008` | Synthetic | Submit more than six permitted characters after cleanup. | Rejected as malformed. | Required |
| `CODE-009` | Synthetic | Submit a value containing `_`. | Rejected as malformed after approved cleanup. | Required |
| `CODE-010` | Synthetic | Submit a value containing `/`. | Rejected as malformed. | Required |
| `CODE-011` | Synthetic | Submit other punctuation that remains after hyphen removal. | Rejected as malformed. | Required |
| `CODE-012` | Synthetic | Submit an empty or whitespace-only value. | Rejected as malformed; no invitation information is disclosed. | Required |
| `CODE-013` | `UNK-404` | Submit a well-formed but unknown code. | Backend treats it as no matching active invitation; browser receives neutral invalid-invitation behavior. | Required |
| `CODE-014` | `DEV999` | Submit an inactive development fixture in development mode where inactive records remain unavailable. | Lookup does not return a personalized form; guest-facing result is neutral. | Required |
| `CODE-015` | Development fixture in production-mode test harness | Attempt a development-only code under production authorization rules. | Treated as no matching active invitation; existence of development record is not disclosed. | Required |
| `CODE-016` | Synthetic malformed vs unknown | Compare browser response to a malformed code and a well-formed unknown code. | Guest-facing wording does not reveal which internal condition occurred. | Required |
| `CODE-017` | Synthetic near-match | Submit a code one character away from a valid fixture. | No fuzzy matching, close-match suggestion, or “Did you mean?” response. | Required |
| `CODE-018` | Synthetic visual ambiguity | Submit `O` where a valid fixture would require `0`, or vice versa. | No automatic character substitution or guessing. | Required |
| `CODE-019` | Public browser | Enter a code manually at `/wedding/rsvp/`. | Manual entry is sufficient; no personalized link is required. | Required |
| `CODE-020` | Public browser | Perform lookup. | Browser remains on `/wedding/rsvp/`; code is not inserted into path, query, or fragment. | Required |
| `CODE-021` | Network inspection | Inspect lookup request. | Invitation code is sent in the `POST /wedding/api/rsvp/lookup` request body. | Required |
| `CODE-022` | Browser metadata | Inspect title, description, social metadata, history-visible URL, and equivalent browser metadata during lookup/form rendering. | No invitation code or RSVP data appears. | Required |
| `CODE-023` | Analytics instrumentation | Trigger entry, lookup, invalid, and valid-form states. | Analytics events do not contain invitation codes or RSVP answers. | Required |
| `CODE-024` | Referrer behavior | Navigate away from RSVP state to an approved destination. | No invitation code or RSVP data can appear in a referrer because none is present in the URL. | Required |
| `CODE-025` | Lookup rate-limit harness | Preload or exercise 10 applicable lookup requests for one client IP within a 15-minute rolling window, then issue the next applicable request. | The next request returns `429 Too Many Requests`; no invitation existence, near-match, active-status, environment, or record-count information is exposed; `Retry-After` is included when supported. | Required |
| `CODE-026` | Lookup backend unavailable | Cause a known pre-result backend failure. | Backend returns `503 Service Unavailable`; browser enters Service Unavailable and does not imply RSVP storage. | Required |
| `CODE-027` | Stale browser after deadline | Send lookup after authoritative deadline. | Backend returns `410 Gone`; no personalized blank form is returned. | Required |
| `CODE-028` | Lookup method boundary | Attempt a code-bearing GET/personalized API URL that is not part of the contract. | No supported public code-bearing lookup route exists. | Required |
| `CODE-029` | Lookup after prior RSVP exists | Use `DEV008` with a fictional stored response. | Lookup succeeds but reveals no stored-response existence indicator. | Required |
| `CODE-030` | Submission revalidation | After a successful lookup, submit an RSVP with a malformed or unauthorized invitation code. | Backend independently renormalizes/revalidates; prior lookup does not authorize submission. | Required |

---

# 6. API Health and Endpoint-Boundary Tests

| ID | Context | Test | Expected result | Status |
|---|---|---|---|---|
| `APIH-001` | Backend healthy | `GET /wedding/api/health`. | Returns `200 OK` and `{ "status": "ok" }`. | Required |
| `APIH-002` | Health endpoint | Inspect response. | Contains no invitation record, guest identity, RSVP answer, confirmation destination, attendee-detail value, delivery record, spreadsheet row, or administrative information. | Required |
| `APIH-003` | Health endpoint | Simulate unavailable Google Sheets while the application process itself can still answer health. | Health is not required by the current contract to prove Google Sheets reachability. | Required |
| `APIH-004` | Health endpoint | Simulate unavailable email/SMS providers while application process remains healthy. | Health is not required to prove delivery-provider availability. | Required |
| `APIH-005` | Route boundary | Verify public RSVP browser route vs API route. | Browser interaction remains under `/wedding/rsvp/`; backend operations remain under `/wedding/api/`. | Required |
| `APIH-006` | React fallback | Request `/wedding/api/health`, lookup, or submit through production routing. | React browser-route fallback does not intercept valid API endpoints. | Required |
| `APIH-007` | API inventory | Enumerate public RSVP endpoints. | Only documented health, lookup, and submit endpoints are required; no public saved-RSVP, directory, recovery, or admin endpoint is introduced. | Required |
| `APIH-008` | Dynamic records | Change the number of development invitation records in a controlled fixture registry. | Endpoint and renderer logic continue to work without assuming that the production count is permanently 57. | Required |

---

# 7. Invitation Configuration and Form-Schema Tests

| ID | Fixture | Test | Expected result | Status |
|---|---|---|---|---|
| `CONF-001` | `DEV001` | Lookup valid singular fixture. | Guest-facing attendance wording uses the singular variants supplied by configuration. | Required |
| `CONF-002` | `DEV002` | Lookup valid plural fixture. | Guest-facing attendance wording uses the plural variants supplied by configuration. | Required |
| `CONF-003` | Any fixture | Alter display name without altering `wordingMode` in a controlled fixture copy. | Renderer follows explicit `wordingMode`; it does not infer singular/plural from names. | Required |
| `CONF-004` | `DEV001` | Render an invitation with `additionalGuestAllocations: []`. | No Plus 1 question is rendered; the authorized named-invitee attendance control, totals, attendee details, and operational controls remain available as applicable. | Required |
| `CONF-005` | `DEV003` | Render one authorized named `Plus1` allocation. | Exactly one Plus 1 Yes/No question is rendered using the configured prompt and stable allocation ID. | Required |
| `CONF-006` | `DEV009` | Render three authorized named `Plus1` allocations. | Exactly three independent Plus 1 Yes/No questions are rendered; no aggregate additional-guest count control appears. | Required |
| `CONF-007` | All active fixtures | Inspect form-schema selection. | Every fixture uses the same reusable `spreadsheet-authoritative-rsvp` schema; production rendering does not branch on a `questionProfile`. | Required |
| `CONF-008` | `DEV001` | Verify capacity/roster reconciliation. | `maximumAttendance` is 1, `namedInvitees.length` is 1, allocation count is 0, and the invariant equals 1. | Required |
| `CONF-009` | `DEV002` | Verify larger named household. | `maximumAttendance` is 5, exactly five safe named-invitee records are authorized, and no Plus 1 slots exist. | Required |
| `CONF-010` | `DEV009` | Verify mixed roster/allocation capacity. | `maximumAttendance` is 7, `namedInvitees.length` is 4, allocation count is 3, and the invariant equals 7. | Required |
| `CONF-011` | `DEV999` | Validate fixture metadata. | `active` is false and fixture is not returned as an ordinary valid invitation. | Required |
| `CONF-012` | Development fixtures | Inspect all active fixture records. | Every fixture is `environment: "development"` and remains separated from production data. | Required |
| `CONF-013` | All fixtures | Inspect configuration shape. | Each contains `wordingMode`, positive `maximumAttendance`, a `namedInvitees` array, an `additionalGuestAllocations` array, protected `active`, and protected `environment`; no RSVP answers are embedded. | Required |
| `CONF-014` | Reusable schema | Enumerate substantive IDs. | Exactly `eventAttendance`, `namedInviteeResponses`, `additionalGuestResponses`, `attendanceTotals`, and `attendeeDetails` are substantive regions. | Required |
| `CONF-015` | Reusable schema | Inspect additional-guest rendering. | Each Plus 1 prompt comes only from an authorized allocation; no separate field requests the additional guest's name at the allocation stage. | Required |
| `CONF-016` | Reusable schema | Inspect age-total fields. | Exactly `adults21Plus`, `youngAdults18To20`, `children3To17`, and `childrenUnder3` are present in the coordinated dial group. | Required |
| `CONF-017` | Reusable schema | Check closed-set exclusions. | No accessibility, lodging, transportation, message-to-couple, entrée-selection, independent client-writable `overallAttendance`, or other unapproved substantive region is rendered. | Required |
| `CONF-018` | `DEV001` | Maliciously submit `additionalGuestResponses`. | Field is unauthorized because the invitation has no allocations. | Required |
| `CONF-019` | `DEV003` | Submit a response keyed by an allocation ID not returned for that invitation. | Unauthorized allocation is rejected; prompt text or arbitrary IDs do not authorize a slot. | Required |
| `CONF-020` | Any attending fixture | Inspect attendee-detail rendering. | Exactly one `attendeeDetails` row is rendered per derived `overallAttendance`; `attendeeName` is always present and `dietaryPreferences` appears only when Reception is selected. | Required |
| `CONF-021` | Any fixture | Alter browser-visible party text in a test double while backend configuration stays fixed. | Browser does not infer `maximumAttendance`, roster membership, or Plus 1 authorization from headings or display text. | Required |
| `CONF-022` | Schema/config compatibility | Exercise `DEV001`, `DEV003`, `DEV006`, `DEV008`, and `DEV009`. | The same reusable schema correctly handles named-only, one-allocation, Reception dietary, revision/composition, and multiple-allocation scenarios. | Required |
| `CONF-023` | Any active fixture | Inspect each `namedInvitees` object returned by the validated configuration. | Each safe roster item has one stable opaque `id` and approved `displayName`; private source-row identifiers are absent. | Required |
| `CONF-024` | All fixtures | Reconcile capacity. | `namedInvitees.length + additionalGuestAllocations.length` equals `maximumAttendance` exactly. | Required |
| `CONF-025` | Controlled malformed fixture | Reduce or increase roster/allocation count without updating `maximumAttendance`. | Configuration validation fails; contradictory capacity is not served to the browser. | Required |
| `CONF-026` | Reusable schema | Inspect `overallAttendance`. | It is documented as backend-derived from complete person-level Yes responses and is not a permanent client-writable question ID. | Required |
| `CONF-027` | Reusable schema | Inspect dietary field copy. | Visible label is exactly `Dietary or allergy information`; it is optional when Reception applies and contains no visible `(optional)` suffix. | Required |
| `CONF-028` | Any fixture | Compare `partyDisplayName` with `namedInvitees`. | Party heading does not substitute for the person-level roster; the renderer uses the explicit safe roster returned after validation. | Required |

---

# 8. Blank-Form and Lookup Privacy-Boundary Tests

| ID | Fixture | Test | Expected result | Status |
|---|---|---|---|---|
| `BLANK-001` | New `DEV001` | Lookup invitation with no stored RSVP. | Validated form loads blank. | Required |
| `BLANK-002` | `DEV008` with fictional stored RSVP | Lookup invitation with existing response. | Validated form still loads blank. | Required |
| `BLANK-003` | `DEV008` | Inspect lookup response for `existingResponse`, `currentResponse`, `hasResponse`, or equivalent. | None is returned. | Required |
| `BLANK-004` | `DEV008` | Inspect lookup response for prior `eventAttendance`. | Not returned. | Required |
| `BLANK-005` | `DEV008` | Inspect lookup response for prior full-decline or attending state. | Not returned. | Required |
| `BLANK-006` | `DEV008` | Inspect lookup response for prior `namedInviteeResponses` or `additionalGuestResponses`. | Neither stored response map is returned. | Required |
| `BLANK-007` | `DEV008` | Inspect lookup response for prior `attendanceTotals` or derived `overallAttendance`. | Not returned. | Required |
| `BLANK-008` | `DEV008` | Inspect lookup response for prior `attendeeDetails`, attendee-entered names, or dietary/allergy text. | Not returned. | Required |
| `BLANK-009` | `DEV008` | Inspect lookup response for prior confirmation method. | Not returned. | Required |
| `BLANK-010` | `DEV008` | Inspect lookup response for prior email/mobile/SMS authorization. | Not returned. | Required |
| `BLANK-011` | `DEV008` | Inspect lookup response for delivery history. | Not returned. | Required |
| `BLANK-012` | Valid fixture | Inspect lookup response for `partyId`, workbook row, private notes, `active`, `environment`, credentials, or raw source-column values. | None is returned. | Required |
| `BLANK-013` | Valid fixture | Inspect lookup response top level. | Contains only `invitation`, `questions`, and `confirmationOptions`. | Required |
| `BLANK-014` | Valid fixture | Inspect `invitation`. | Contains only values needed to render the blank form, including safe `namedInvitees`, `maximumAttendance`, wording, heading/greeting, and authorized Plus 1 definitions where applicable. | Required |
| `BLANK-015` | Valid fixture | Verify code echo behavior. | Invitation code is not returned merely to reproduce it after validation. | Required |
| `BLANK-016` | Public route | Inspect search indexing outcome for RSVP and confirmation routes. | Personalized/transactional RSVP states are excluded from public indexing. | Required |
| `BLANK-017` | Public route | Inspect concise privacy notice. | Notice is present on entry and validated form and links to `/wedding/privacy`. | Required |
| `BLANK-018` | Invalid/unknown lookup | Inspect error content. | No name, close match, roster, record count, spreadsheet detail, internal identifier, allocation data, or backend detail is disclosed. | Required |
| `BLANK-019` | Valid fixture | Inspect each lookup `namedInvitees` item. | Only the validated party's safe `id` and `displayName` are returned; no other party's roster or private source metadata is included. | Required |
| `BLANK-020` | `DEV008` with stored RSVP | Compare lookup roster with stored person-level responses. | Safe roster is returned because it is invitation configuration; stored Yes/No answers remain absent. | Required |

---

# 9. Attendance and Decline Dependency Tests

| ID | Fixture | Test | Expected result | Status |
|---|---|---|---|---|
| `ATT-001` | `DEV005` | Submit Ceremony-only with complete named-invitee responses, age totals equal to derived headcount, and matching `attendeeDetails`. | Valid Ceremony-only state; attendee names are required and dietary fields are absent. | Required |
| `ATT-002` | `DEV006` | Submit Reception-only with complete named-invitee/Plus 1 responses, exact age totals, and matching attendee details. | Valid Reception-only state; optional dietary/allergy fields are authorized. | Required |
| `ATT-003` | `DEV007` | Submit Ceremony + Reception with complete person-level responses, exact age totals, and matching attendee details. | Valid combined attending state. | Required |
| `ATT-004` | Any active fixture | Submit `eventAttendance: ["decline"]`. | Valid full decline; all attendance-dependent substantive structures become inapplicable and are cleared. | Required |
| `ATT-005` | Any fixture | Submit a complete attendance value containing `decline` with `ceremony` or `reception`. | Rejected as contradictory; no new RSVP version. | Required |
| `ATT-006` | Initial response | Submit `eventAttendance: []`. | Rejected because an initial RSVP has not established a complete valid event state. | Required |
| `ATT-007` | Initial response | Omit `eventAttendance`. | Rejected as incomplete. | Required |
| `ATT-008` | Existing attending response | Revise to `['decline']`. | Stored named-invitee responses, Plus 1 responses, attendance totals, derived headcount, and attendee details are cleared before final validation. | Required |
| `ATT-009` | Existing declined response | Revise to an attending state. | Every named-invitee response, every authorized Plus 1 response, all four totals, and a complete matching `attendeeDetails` list are newly required. | Required |
| `ATT-010` | Continuing attending response | Omit `eventAttendance` in a revision. | Stored event state remains unchanged. | Required |
| `ATT-011` | Revision | Intentionally change event attendance. | Client replaces the complete intended event state; backend validates the resulting dependencies. | Required |
| `ATT-012` | Full decline | Include otherwise authorized stale dependent structures in the same request. | Full-decline dependency processing clears those now-inapplicable values before storage; valid decline remains possible. | Required |
| `ATT-013` | Full decline | Include an unknown substantive region or unauthorized person/allocation ID. | Authorization failure remains; decline does not make unauthorized content acceptable. | Required |
| `ATT-014` | Ceremony-only attendance | Omit newly required `attendeeDetails`. | Rejected; attendee names apply to Ceremony-only attendance too. | Required |
| `ATT-015` | Any attending state | Omit newly required `attendanceTotals`. | Rejected as incomplete. | Required |
| `ATT-016` | Invitation with authorized allocations | Omit one or more newly required `additionalGuestResponses` on initial attending submission or decline-to-attending transition. | Rejected as incomplete. | Required |
| `ATT-017` | Any attending invitation | Omit one or more newly required `namedInviteeResponses`. | Rejected as incomplete. | Required |
| `ATT-018` | Full decline | Inspect successful guest-facing RSVP. | `eventAttendance` is `['decline']`; `namedInviteeResponses`, `additionalGuestResponses`, `attendanceTotals`, `overallAttendance`, and `attendeeDetails` are omitted. | Required |
| `ATT-019` | `DEV002` | Answer Yes for some named invitees and No for others while attending. | Valid mixed-household attendance when at least one person attends and all dependent structures reconcile. | Required |
| `ATT-020` | Any active fixture | Submit a named-invitee response keyed by an ID not in the validated roster. | `403 Forbidden`; no storage. | Required |
| `ATT-021` | Any named invitee | Submit a value other than string `yes` or `no`. | Rejected as invalid. | Required |
| `ATT-022` | Attending event selected | Answer No for every named invitee and every authorized Plus 1 slot. | Rejected because derived `overallAttendance` is 0 while the event state says attending. | Required |
| `ATT-023` | Mixed roster/allocation fixture | Count complete Yes responses. | Backend-derived `overallAttendance` equals named-invitee Yes count plus authorized Plus 1 Yes count. | Required |
| `ATT-024` | Any attending fixture | Add client-supplied `overallAttendance`. | Rejected as unauthorized/client-writable substantive data; backend derivation remains authoritative. | Required |
| `ATT-025` | Existing RSVP | Swap one attending named invitee from Yes to No and another from No to Yes, leaving numeric headcount unchanged. | Attendee composition changes; complete replacement `attendeeDetails` is required. | Required |
| `ATT-026` | Fixture containing a named child | Inspect/submit person-level attendance. | Named child receives an ordinary authorized named-invitee Yes/No decision; age classification is supplied separately through totals. | Required |
| `ATT-027` | Any attending fixture | Compare person-level decisions with age totals. | Person-level decisions determine who/how many attend; age totals classify the derived attendees and do not independently create or remove attendees. | Required |

---

# 10. Authorized Named-`Plus1` Tests

| ID | Fixture | Test | Expected result | Status |
|---|---|---|---|---|
| `ADD-001` | `DEV001` | Render form. | No Plus 1 control is rendered because `additionalGuestAllocations` is empty. | Required |
| `ADD-002` | `DEV001` | Maliciously submit `additionalGuestResponses`. | `403 Forbidden`; no storage. | Required |
| `ADD-003` | `DEV003` | Submit `{ "plus1-dev003-a": "yes" }` while attending. | Valid authorized response; this slot contributes one attendee to derived `overallAttendance`. | Required |
| `ADD-004` | `DEV003` | Submit `{ "plus1-dev003-a": "no" }` while attending. | Valid authorized response; this slot contributes zero attendees. | Required |
| `ADD-005` | `DEV003` | Use the guest-facing prompt or invitee name as the submission key instead of the stable allocation ID. | Rejected; authorization keys are stable allocation IDs only. | Required |
| `ADD-006` | `DEV009` | Submit `yes` for all three authorized allocations. | Each accepted Yes contributes one attendee; final derived count also includes named-invitee Yes responses. | Required |
| `ADD-007` | `DEV009` | Submit a mixed complete map of `yes` and `no`. | Valid; each allocation is independent. | Required |
| `ADD-008` | `DEV009` | Add an unknown fourth allocation ID. | `403 Forbidden`; no storage. | Required |
| `ADD-009` | Any authorized allocation | Submit numeric `1`, Boolean `true`, or another value instead of `yes`/`no`. | Rejected as invalid value. | Required |
| `ADD-010` | `DEV009` initial attending | Omit one authorized allocation from the initial map. | Rejected as incomplete. | Required |
| `ADD-011` | `DEV009` stored decline | Revise to attending but omit one authorized allocation response. | Rejected because every allocation is newly applicable after decline. | Required |
| `ADD-012` | Authorized allocations | Compare Yes/No responses with derived headcount. | Each Yes contributes exactly one; each No contributes zero; backend does not apply a separate Plus 1 count constraint because the person decisions themselves derive headcount. | Required |
| `ADD-013` | Continuing attending revision | Change one allocation response and supply dependent replacements needed for the new derived headcount/composition. | Valid when complete merged totals equal new `overallAttendance` and attendee details are replaced as required. | Required |
| `ADD-014` | Continuing attending revision | Change allocation response so derived headcount/composition changes but omit required dependent updates. | Rejected; backend does not guess age classification or attendee-detail identity. | Required |
| `ADD-015` | Prior positive Plus 1 response | Revise to full decline. | Entire stored `additionalGuestResponses` map is cleared as inapplicable. | Required |
| `ADD-016` | Any authorized allocation fixture | Inspect Plus 1 section and attendee details. | Allocation-stage controls never ask for the additional guest's name; if the slot attends, that attendee's name is supplied through `attendeeDetails` regardless of Ceremony/Reception combination. | Required |

---

# 11. Attendance-Total and Coordinated-Dial Tests

| ID | Fixture | Test | Expected result | Status |
|---|---|---|---|---|
| `TOTAL-001` | Any attending fixture | Supply four nonnegative whole-number categories whose sum equals derived `overallAttendance`. | Accepted when all other RSVP constraints are satisfied. | Required |
| `TOTAL-002` | Any attending fixture | Supply a four-category sum lower than derived `overallAttendance`. | Rejected; totals must classify every derived attendee. | Required |
| `TOTAL-003` | `DEV001`, derived headcount 1 | Supply age totals summing to 2. | Rejected because complete sum does not equal derived `overallAttendance` of 1. | Required |
| `TOTAL-004` | `DEV002`, derived headcount 5 | Supply age totals summing to 6. | Rejected; sum differs from derived headcount and also exceeds invitation capacity. | Required |
| `TOTAL-005` | Any attending fixture | Supply a negative category. | Rejected. | Required |
| `TOTAL-006` | Any attending fixture | Supply a fractional category. | Rejected. | Required |
| `TOTAL-007` | Any attending fixture | Supply nonnumeric content. | Rejected. | Required |
| `TOTAL-008` | Initial attending | Omit one category. | Rejected as incomplete. | Required |
| `TOTAL-009` | Decline-to-attendance revision | Omit one category after totals become newly applicable. | Rejected; all four are newly required. | Required |
| `TOTAL-010` | Continuing attending revision | Change one nested category and omit the other three. | Omitted categories remain unchanged; complete merged totals are validated against derived headcount. | Required |
| `TOTAL-011` | Continuing attending revision | Replace a prior positive category with numeric `0`. | Zero is stored as explicit replacement, not treated as omission, if the complete merged sum remains valid. | Required |
| `TOTAL-012` | Any attending fixture | Verify server-calculated `overallAttendance`. | Equals Yes count across complete named-invitee and authorized Plus 1 responses, not the age-total sum. | Required |
| `TOTAL-013` | Any attending fixture | Compare final age-total sum to derived `overallAttendance`. | They are exactly equal. | Required |
| `TOTAL-014` | `DEV010` with derived `overallAttendance = 3` | Set one dial to 2 and inspect the other three dial maxima. | Each other dial's available maximum reflects the remaining derived count of 1; reducing the first dial restores available capacity within the derived count. | Required |
| `TOTAL-015` | Full decline | Inspect resulting stored/public state. | Attendance totals and `overallAttendance` are omitted, not retained as a synthetic all-zero object. | Required |
| `TOTAL-016` | Any attending fixture | Attempt to use `maximumAttendance` as the dial sum when fewer people answered Yes. | Rejected unless that sum also equals derived `overallAttendance`; capacity does not independently choose headcount. | Required |

---

# 12. Attendee-Detail and Dietary/Allergy Tests

| ID | Fixture | Test | Expected result | Status |
|---|---|---|---|---|
| `DIET-001` | Ceremony-only attendance | Inspect rendering and submit complete `attendeeDetails`. | Exactly one row per derived attendee renders; `attendeeName` is required and `dietaryPreferences` is absent. | Required |
| `DIET-002` | `DEV006` Reception only, `overallAttendance = 2` | Supply exactly two complete attendee-detail rows. | Accepted when all names and dietary values satisfy validation. | Required |
| `DIET-003` | Combined attendance, `overallAttendance = 3` | Supply exactly three attendee-detail rows. | Accepted. | Required |
| `DIET-004` | Any attendee row | Submit blank or whitespace-only `attendeeName`. | Rejected; every attendee row requires a nonblank name. | Required |
| `DIET-005` | Any attendee row | Submit attendee name longer than 100 characters. | Rejected. | Required |
| `DIET-006` | Reception attendee row | Submit empty `dietaryPreferences`. | Accepted; dietary/allergy information is optional when Reception applies. | Required |
| `DIET-007` | Reception attendee row | Submit dietary/allergy text of 1000 characters. | Accepted if otherwise valid. | Required |
| `DIET-008` | Reception attendee row | Submit dietary/allergy text longer than 1000 characters. | Rejected. | Required |
| `DIET-009` | Attending RSVP, `overallAttendance = 3` | Submit only two attendee-detail rows. | Rejected because list length must exactly equal derived `overallAttendance`. | Required |
| `DIET-010` | Attending RSVP, `overallAttendance = 2` | Submit three attendee-detail rows. | Rejected because list length exceeds derived `overallAttendance`. | Required |
| `DIET-011` | Existing attending RSVP | Keep the same attending-person composition and omit `attendeeDetails` on revision. | Stored attendee-detail list remains unchanged, subject to automatic dietary clearing if Reception is removed. | Required |
| `DIET-012` | Existing attending RSVP | Change derived `overallAttendance` without replacing the complete attendee-detail list. | Rejected; complete replacement with exactly the new number of rows is required. | Required |
| `DIET-013` | Existing attending RSVP | Swap attendee identity composition while keeping `overallAttendance` numerically unchanged and omit `attendeeDetails`. | Rejected; same-count composition changes require complete replacement. | Required |
| `DIET-014` | Existing combined/Reception RSVP | Remove Reception but remain Ceremony-only with unchanged attendee composition. | Stored attendee names remain; all `dietaryPreferences` properties are cleared/absent. | Required |
| `DIET-015` | Existing Ceremony-only RSVP | Add Reception without changing attendee composition and omit `attendeeDetails`. | Existing names remain valid; dietary fields become available but are optional, so re-entry is not required solely because Reception was added. | Required |
| `DIET-016` | Ceremony-only RSVP | Submit `dietaryPreferences` inside an attendee row. | Rejected as unauthorized because Reception is not selected. | Required |
| `DIET-017` | Reception-selected form | Inspect visible dietary field label. | Label is exactly `Dietary or allergy information`. | Required |
| `DIET-018` | Reception-selected form | Inspect visible dietary field label/help. | The label does not append `(optional)` even though blank dietary value is accepted. | Required |
| `DIET-019` | Existing attending RSVP | Revise to full decline. | Entire `attendeeDetails` list is cleared. | Required |
| `DIET-020` | Attending authorized Plus 1 | Inspect where the additional guest's name is collected. | Name is collected in `attendeeDetails`, not in the allocation Yes/No question. | Required |

---

# 13. Initial Submission Tests

| ID | Fixture | Test | Expected result | Status |
|---|---|---|---|---|
| `INIT-001` | `DEV001` | Submit complete valid initial Ceremony RSVP with the named invitee attending, exact totals, one attendee-detail row, and email confirmation. | `201 Created`; one new RSVP version; `submission.action = "initial"`. | Required |
| `INIT-002` | `DEV006` | Submit complete valid Reception RSVP with named-invitee and authorized Plus 1 responses, exact totals, matching attendee-detail list, and operational confirmation. | `201 Created`; complete spreadsheet-authoritative RSVP is stored. | Required |
| `INIT-003` | Invitation with authorized allocation | Omit applicable Plus 1 response while attending. | `400 Bad Request`; no storage. | Required |
| `INIT-004` | Any attending initial response | Omit one required attendance-total category. | `400 Bad Request`; no storage. | Required |
| `INIT-005` | Any fixture | Omit operational `confirmation`. | `400 Bad Request`; no storage. | Required |
| `INIT-006` | Any fixture | Omit `clientSubmissionId`. | `400 Bad Request`; no storage. | Required |
| `INIT-007` | Any fixture | Use malformed `clientSubmissionId`. | `400 Bad Request`. | Required |
| `INIT-008` | Any fixture | Inspect request top level. | Exactly `inviteCode`, `clientSubmissionId`, `confirmation`, and `changes` are used by the current contract. | Required |
| `INIT-009` | Any fixture | Add unsupported authoritative/private top-level values such as `partyId`, `maximumAttendance`, `namedInvitees`, or `additionalGuestAllocations`. | Rejected as malformed/unsupported; client does not supply authoritative configuration. | Required |
| `INIT-010` | Any fixture | Add `expectedVersion`. | Not permitted; request does not enter a version-conflict flow and ordinary `409` is not used. | Required |
| `INIT-011` | Any fixture | Use unknown operation name. | `400 Bad Request`. | Required |
| `INIT-012` | Any fixture | Use `replace` without `value`. | `400 Bad Request`. | Required |
| `INIT-013` | Any fixture | Use unsupported generic `clear` operation on active substantive regions. | Rejected; current substantive model uses dependency clearing and replacement rather than a generic client clear operation. | Required |
| `INIT-014` | Any fixture | Successfully store response. | Storage completes before guest/admin delivery attempts begin. | Required |
| `INIT-015` | Any fixture | Inspect success response top level. | Exactly `submission`, `invitation`, `rsvp`, `confirmation`, and `revisionPolicy`. | Required |
| `INIT-016` | Any fixture | Inspect success response privacy boundary. | Does not echo invite code, `clientSubmissionId`, email/mobile destination, SMS authorization, private version, `partyId`, workbook row, admin address, or provider internals. | Required |
| `INIT-017` | Any attending initial response | Omit one or more authorized `namedInviteeResponses`. | `400 Bad Request`; no storage. | Required |
| `INIT-018` | Any attending initial response | Omit `attendeeDetails` or provide cardinality different from derived `overallAttendance`. | `400 Bad Request`; no storage. | Required |
| `INIT-019` | Any attending initial response | Add client-writable `overallAttendance`. | Rejected; backend derives the value from person-level responses. | Required |

---

# 14. Revision and Merge Tests

Use `DEV008` and a fictional stored response for revision-heavy cases unless another fixture better isolates the behavior.

| ID | Test | Expected result | Status |
|---|---|---|---|
| `REV-001` | Lookup `DEV008` before revision. | Form loads blank; no stored answers or existence indicator is returned. | Required |
| `REV-002` | Submit a valid partial substantive revision. | Backend loads current response, merges submitted changes, validates the complete result, writes one new revision version, and returns `200 OK`. | Required |
| `REV-003` | Omit an applicable substantive region. | Stored value remains unchanged unless a controlling dependency/composition rule makes it inapplicable or requires replacement. | Required |
| `REV-004` | Replace a stored substantive value. | Submitted replacement becomes authoritative after successful merge/storage. | Required |
| `REV-005` | Replace a prior positive attendance-total category with `0`. | Explicit zero replaces the prior value if the complete merged age-total sum remains equal to derived headcount. | Required |
| `REV-006` | Remove one attendee's previously stored dietary text while Reception remains selected and composition is unchanged. | Guest may submit a complete replacement attendee-detail list with that attendee's `dietaryPreferences` empty; the new list replaces the old one. | Required |
| `REV-007` | Submit only operational confirmation fields with `changes: {}`. | Valid revision if operational data is valid; new operational values replace stored ones. | Required |
| `REV-008` | Revise attendance while leaving unrelated fields omitted. | Omitted values remain unchanged unless dependency or composition rules make them inapplicable or newly require replacement. | Required |
| `REV-009` | Change attending response to full decline. | Named-invitee responses, Plus 1 responses, totals/derived headcount, and attendee details are cleared; operational confirmation remains required. | Required |
| `REV-010` | Change full decline to Ceremony-only for an invitation with no Plus 1 allocations. | All named-invitee responses, all four totals, and a complete attendee-detail list are newly required. | Required |
| `REV-011` | Change full decline to Reception for an invitation with an authorized Plus 1 allocation. | All named-invitee responses, every authorized Plus 1 response, all four totals, and a complete attendee-detail list matching derived `overallAttendance` are newly required. | Required |
| `REV-012` | Add Reception to an existing Ceremony-only RSVP while attending-person composition remains unchanged. | Existing attendee names may remain unchanged; `attendeeDetails` may be omitted because dietary/allergy information is optional. | Required |
| `REV-013` | Submit a partial nested attendance-total replacement while continuing to attend and person-level attendance is unchanged. | Omitted nested categories remain unchanged; complete merged totals must still equal derived `overallAttendance`. | Required |
| `REV-014` | Submit revision whose merged age totals do not equal the derived headcount. | Rejected; current stored RSVP remains unchanged. | Required |
| `REV-015` | Submit revision producing an invalid event selection such as `decline` plus `reception`. | Rejected; no new version. | Required |
| `REV-016` | Change confirmation method from email to text message after the SMS gate is enabled. | Newly entered text-message operational values replace email-channel operational values; email destination is no longer active. | Required |
| `REV-017` | Change confirmation method from text message to email. | Newly entered email replaces mobile/SMS operational values; mobile/SMS values are no longer active. | Required |
| `REV-018` | Perform revision from a second browser/device with a new `clientSubmissionId`. | Backend merges against authoritative current response at processing time; no `409` merely because another version exists. | Required |
| `REV-019` | Perform two distinct valid revisions before deadline, each with a new identifier. | Two new versions are created in order; latest successful version becomes current. | Required |
| `REV-020` | Inspect confirmation after partial revision. | Displays complete merged current RSVP, not merely changed fields. | Required |
| `REV-021` | Inspect superseded response after revision. | Remains historical only and is not counted as current attendance. | Required |
| `REV-022` | Submit revision after authoritative deadline. | `410 Gone`; no new version. | Required |
| `REV-023` | Change one person-level Yes response so numeric `overallAttendance` changes, but omit dependent total/detail replacements. | Rejected; dependent structures must reconcile to the newly derived count. | Required |
| `REV-024` | Swap one attending person for another while keeping numeric `overallAttendance` unchanged and omit `attendeeDetails`. | Rejected; composition change requires complete attendee-detail replacement. | Required |
| `REV-025` | Remove Reception while retaining Ceremony and the same attendees. | Attendee names are preserved and dietary/allergy properties are cleared automatically. | Required |
| `REV-026` | Add Reception while retaining the same attendees and omit `attendeeDetails`. | Valid; stored names remain and dietary/allergy information may remain blank because it is optional. | Required |
| `REV-027` | Change only age-category classification while keeping person-level attendance unchanged and complete age-total sum equal to derived headcount. | Valid without attendee-detail replacement. | Required |
| `REV-028` | Change named-invitee responses in a same-count Yes/No swap and supply a complete replacement attendee-detail list. | Valid when replacement list cardinality and all other merged constraints pass. | Required |

---

# 15. Confirmation-Channel Tests

| ID | Context | Test | Expected result | Status |
|---|---|---|---|---|
| `CHAN-001` | Email | Submit valid email confirmation object. | Accepted. | Required |
| `CHAN-002` | Email | Omit email address. | `400 Bad Request`. | Required |
| `CHAN-003` | Email | Supply invalid email format. | `400 Bad Request`. | Required |
| `CHAN-004` | Email | Include `mobile`. | Rejected as contradictory/unauthorized channel data. | Required |
| `CHAN-005` | Email | Include `smsAuthorization`. | Rejected as contradictory/unauthorized channel data. | Required |
| `CHAN-006` | Text | Submit valid SMS-capable number when authorization required, with `smsAuthorization: true`. | Accepted only when Text Message is enabled by centralized configuration. | Required |
| `CHAN-007` | Text | Omit mobile number. | `400 Bad Request`. | Required |
| `CHAN-008` | Text | Supply invalid mobile format. | `400 Bad Request`. | Required |
| `CHAN-009` | Text | Authorization-required configuration with missing `smsAuthorization`. | `400 Bad Request`. | Required |
| `CHAN-010` | Text | Authorization-required configuration with `smsAuthorization: false`. | Rejected; required value is `true`. | Required |
| `CHAN-011` | Text | Include email in text confirmation object. | Rejected as contradictory/unauthorized channel data. | Required |
| `CHAN-012` | Text | Configuration does not require SMS authorization. | `smsAuthorization` is omitted rather than treated as a second choice. | Required |
| `CHAN-013` | Any revision | Omit operational confirmation object because a prior one exists. | Rejected; every revision requires newly entered operational confirmation. | Required |
| `CHAN-014` | Any revision | Submit new valid destination. | New operational destination replaces prior stored destination after successful storage. | Required |
| `CHAN-015` | Guest confirmation | Inspect content for an initial RSVP. | Contains the complete current spreadsheet-authoritative guest-facing RSVP. | Required |
| `CHAN-016` | Guest confirmation | Inspect content for a revision. | Contains the complete merged current RSVP, not only changed fields. | Required |
| `CHAN-017` | SMS confirmation | Complete current RSVP requires multiple SMS segments. | Multiple segments are permitted; content still represents the complete current guest-facing RSVP. | Required |
| `CHAN-018` | Guest confirmation | Inspect conditionally inapplicable structures. | They are omitted rather than shown as zero, disabled, blank, or `N/A`. | Required |
| `CHAN-019` | Production before SMS provider gate is satisfied | Inspect lookup `confirmationOptions`. | `textMessage` is not advertised as available; the application does not invent provider-specific authorization language. | Required |
| `CHAN-020` | Production after SMS provider gate is satisfied | Enable Text Message only after provider selection, verified required disclosure/authorization language, backend-only credentials/sender configuration, and production-flow testing. | `textMessage` may be advertised only after all gate conditions are satisfied. | Required |
| `CHAN-021` | SMS authorization schema | Compare provider-specific approved copy with the form schema. | Permanent operational question ID remains `smsAuthorization`; only verified guest-facing copy/configuration changes as required. | Required |
| `CHAN-022` | Production Text Message disabled | Inspect alternative confirmation channel. | Email remains available; disabling Text Message does not remove the approved email path. | Required |
| `CHAN-023` | Submitted RSVP mobile number | Trace permitted use after successful submission/revision. | Number is used only for requested transactional RSVP confirmation and approved manual resend unless a future recorded decision authorizes another purpose. | Required |
| `CHAN-024` | Submitted RSVP mobile number | Attempt marketing, promotional, unrelated wedding messaging, or list-building use. | Prohibited; RSVP mobile number is not repurposed. | Required |

---

# 16. API Error and Authorization Tests

| ID | Test | Expected result | Status |
|---|---|---|---|
| `ERR-001` | Malformed submission body. | `400 Bad Request`. | Required |
| `ERR-002` | Missing required top-level property. | `400 Bad Request`. | Required |
| `ERR-003` | Unknown top-level property. | Rejected as `400 Bad Request` under the strict request envelope. | Required |
| `ERR-004` | Unknown substantive region ID. | `403 Forbidden`. | Required |
| `ERR-005` | Submit `additionalGuestResponses` for an invitation with no authorized allocations. | `403 Forbidden`. | Required |
| `ERR-006` | Submit an unknown/unauthorized allocation ID inside `additionalGuestResponses`. | `403 Forbidden`. | Required |
| `ERR-007` | Submit an unknown/unauthorized named-invitee ID inside `namedInviteeResponses`. | `403 Forbidden`. | Required |
| `ERR-008` | Submit `dietaryPreferences` in the complete resulting state when Reception is not selected. | `403 Forbidden`; Reception-specific field is unauthorized. | Required |
| `ERR-009` | Authorized attendance-total field with invalid numeric content. | `400 Bad Request`. | Required |
| `ERR-010` | Contradictory attendance selection containing `decline` and an attending event. | `400 Bad Request`. | Required |
| `ERR-011` | Reuse same identifier with materially different request. | `400 Bad Request`. | Required |
| `ERR-012` | New logical submission/revision at or after deadline. | `410 Gone`. | Required |
| `ERR-013` | Preload or exercise either finalized submission limit, then issue the next applicable request. | Exceeding 6 requests per 15-minute rolling window for client IP or normalized invitation code returns guest-safe `429`; no RSVP version or delivery attempt is created. | Required |
| `ERR-014` | Known core failure before successful storage. | `503 Service Unavailable`; no claim of storage. | Required |
| `ERR-015` | Browser receives no definitive response. | Do not synthesize `503`; use Submission Uncertain. | Required |
| `ERR-016` | Existing newer private version on server, no malformed request. | No ordinary `409`; current contract does not use `expectedVersion` concurrency. | Required |
| `ERR-017` | Validation error on partial revision. | Error response does not reveal omitted stored values. | Required |
| `ERR-018` | Authorization error. | Guest-facing response does not disclose private roster/allocation/configuration details merely to explain the failure. | Required |
| `ERR-019` | Submit client-writable `overallAttendance`. | Rejected as unauthorized substantive data; backend-derived value cannot be overridden. | Required |
| `ERR-020` | Submit `attendeeDetails` whose cardinality differs from derived `overallAttendance`. | `400 Bad Request`; no mutation. | Required |

---

# 17. Storage, Version History, Concurrency, and Idempotency Tests

| ID | Test | Expected result | Status |
|---|---|---|---|
| `STORE-001` | Store first valid RSVP. | Exactly one new version created; becomes current. | Required |
| `STORE-002` | Store valid revision. | Exactly one new version created; prior version remains superseded history. | Required |
| `STORE-003` | Read current-response reporting after revision. | Latest successful version controls current attendance/reporting. | Required |
| `STORE-004` | Count attendance across versions. | Superseded versions are not double-counted. | Required |
| `STORE-005` | Double-click Submit in browser. | UI prevents duplicate activation where possible; backend idempotency still protects against repeated requests. | Required |
| `STORE-006` | Send rapid duplicate network request with same ID and same content. | One logical submission/version only. | Required |
| `STORE-007` | Replay same invitation, same ID, materially same initial request after it succeeded. | `200 OK`, `idempotentRepeat: true`, original `action` remains `initial`, no new version. | Required |
| `STORE-008` | Replay same invitation, same ID, materially same revision after it succeeded. | `200 OK`, `idempotentRepeat: true`, original `action` remains `revision`, no new version. | Required |
| `STORE-009` | Replay same ID with materially different `changes`. | `400 Bad Request`; no new version. | Required |
| `STORE-010` | Replay same ID with materially different `confirmation`. | `400 Bad Request`; no new version. | Required |
| `STORE-011` | New intentional revision. | Client generates a new `clientSubmissionId`. | Required |
| `STORE-012` | Uncertain result followed by safe retry. | Same original ID and materially same request are reused. | Required |
| `STORE-013` | Uncertain result where first attempt actually stored successfully, then safe retry. | Retry returns prior success; no duplicate version or delivery attempt. | Required |
| `STORE-014` | Uncertain result where first attempt did not store, then safe retry. | Retry may create the single intended version when backend can process it; still one logical action. | Required |
| `STORE-015` | Browser refresh/retry during active submission. | Duplicate processing does not create extra versions. | Required |
| `STORE-016` | Different invitation uses same UUID-form identifier. | Idempotency scope includes normalized invitation plus identifier; invitations remain distinct logical scopes. | Required |
| `STORE-017` | Same invitation, new identifier, same values submitted intentionally as a new revision. | Treated as a new logical action and may create a revision version if valid. | Required |
| `STORE-018` | Two devices submit distinct revisions sequentially. | Each distinct revision merges against authoritative current state present when processed. | Required |
| `STORE-019` | Second device submits after another revision changed the current state. | No `expectedVersion` conflict is generated solely because the current private version advanced. | Required |
| `STORE-020` | Inspect browser/API success response. | Private RSVP version is not exposed. | Required |
| `STORE-021` | Inspect idempotency records/fingerprint through public API. | Not exposed. | Required |
| `STORE-022` | Idempotent replay after deadline of a logical submission already stored before deadline. | Replay is handled as idempotent retrieval of the prior logical result and does not create a new mutation/version. | Required |

---

# 18. Delivery and Resend Tests

| ID | Scenario | Expected result | Status |
|---|---|---|---|
| `DELIV-001` | Storage succeeds; guest delivery and admin email succeed. | Successful RSVP status; both delivery statuses `sent`; no delivery warning. | Required |
| `DELIV-002` | Storage succeeds; guest email fails; admin succeeds. | RSVP remains stored; guest status `failed`; admin `sent`; `deliveryWarning: true`. | Required |
| `DELIV-003` | Storage succeeds; guest SMS fails; admin succeeds. | RSVP remains stored; warning shown; no resubmission instruction. | Required |
| `DELIV-004` | Storage succeeds; admin email fails; guest succeeds. | RSVP remains stored; limited admin status `failed`; warning shown without exposing admin address. | Required |
| `DELIV-005` | Storage succeeds; both delivery attempts fail. | RSVP remains stored; both statuses represented safely; `deliveryWarning: true`. | Required |
| `DELIV-006` | Storage succeeds; one delivery is uncertain. | RSVP remains stored; applicable status `uncertain`; warning shown. | Required |
| `DELIV-007` | Guest delivery fails. | Failure does not roll back current RSVP. | Required |
| `DELIV-008` | Admin delivery fails. | Failure does not block guest delivery attempt. | Required |
| `DELIV-009` | Guest delivery fails first. | Admin attempt still proceeds independently. | Required |
| `DELIV-010` | Delivery retry/resend. | Does not create or increment RSVP version. | Required |
| `DELIV-011` | Manual guest-confirmation resend. | Sends complete current RSVP; RSVP content/version unchanged. | Required |
| `DELIV-012` | Idempotent HTTP replay after successful storage. | Does not create duplicate delivery attempts merely because request was replayed. | Required |
| `DELIV-013` | Inspect delivery records. | Guest and administrative delivery results are recorded separately by attempt/channel. | Required |
| `DELIV-014` | Inspect guest-facing delivery status. | Guest may see selected channel status and limited admin-attempt status, but not protected admin address/provider internals. | Required |
| `DELIV-015` | Simulate delivery failure after successful storage. | API still returns `201` for stored initial or `200` for stored revision/replay, not a generic `503` storage failure. | Required |

---

# 19. Thirteen-State React Interface Tests

The interface must render one top-level RSVP state at a time. Countdown, invitation-specific named-`Plus1` allocation count, attendance-dependent regions, delivery-warning category, and responsive layout are variants within these states.

| ID | State | Test | Expected result | Status |
|---|---|---|---|---|
| `STATE-001` | 1 — Entry Ready | Open `/wedding/rsvp/` while RSVP is open. | Manual code field, written deadline, printed alternative, concise privacy notice, assistance; countdown only when applicable. | Required |
| `STATE-002` | 1 — Entry Ready | Inspect invitation-code example. | Uses generic `XXX-XXX`; no real invitation code shown. | Required |
| `STATE-003` | 2 — Looking Up Invitation | Submit lookup. | Progress is announced and repeated lookup activation is prevented. | Required |
| `STATE-004` | 2 — Looking Up Invitation | Inspect URL/metadata during lookup. | Code remains absent. | Required |
| `STATE-005` | 3 — Invalid Invitation | Submit malformed code. | Neutral invalid-invitation state; entered value remains editable where safe. | Required |
| `STATE-006` | 3 — Invalid Invitation | Submit unknown/inactive code. | Same neutral guest-facing treatment; no record-existence disclosure. | Required |
| `STATE-007` | 4 — Service Unavailable | Backend definitively returns pre-storage `503`. | Guest-safe unavailable message, assistance, no claim that RSVP was recorded. | Required |
| `STATE-008` | 5 — Validated Blank Form | Valid lookup. | Personalized greeting and authorized blank questions; no stored answers/destinations. | Required |
| `STATE-009` | 5 — Validated Blank Form | Switch among fixtures with different named-invitee roster sizes, zero/one/multiple authorized `Plus1` allocations, and Ceremony/Reception attendance states. | Correct named-person, Plus 1, derived-total, attendee-detail, and Reception-specific dietary controls render within the same reusable state and route. | Required |
| `STATE-010` | 6 — Validation Failure | Client-side usability validation fails. | Error summary/field errors; current page-entered values preserved. | Required |
| `STATE-011` | 6 — Validation Failure | Server returns submission validation error. | Same conceptual state; no implication of storage; no omitted stored values revealed. | Required |
| `STATE-012` | 7 — Submitting | Begin logical submission. | Submit action protected/disabled; progress announced; logical request and ID retained. | Required |
| `STATE-013` | 7 — Submitting | Double-click or repeat activation. | UI prevents duplicate action where possible; backend idempotency remains authoritative. | Required |
| `STATE-014` | 8 — Submission Uncertain | Lose definitive client response. | State explicitly says outcome cannot be confirmed; does not claim success/failure. | Required |
| `STATE-015` | 8 — Submission Uncertain | Inspect recovery guidance. | Discourages blind resubmission, advises selected confirmation channel/assistance, and preserves same ID for a safe retry. | Required |
| `STATE-016` | 9 — Confirmed Initial Submission | Successful stored initial with no warning. | Success heading, complete current RSVP, initial designation, timestamp/delivery status, revision guidance. | Required |
| `STATE-017` | 10 — Confirmed Revision | Successful stored revision with no warning. | Success identifies revision and shows complete merged RSVP, not only changed fields. | Required |
| `STATE-018` | 11 — Stored with Delivery Warning | Storage succeeds but a delivery fails/uncertain. | Storage success remains explicit; complete RSVP shown; warning does not request resubmission. | Required |
| `STATE-019` | 12 — Confirmation Refresh Fallback | Confirmation route lacks a structurally usable temporary successful-submission response. | Finalized fallback states that the on-screen summary is unavailable and that an RSVP may already have been recorded; it does not infer success or failure, reconstruct private data, or perform automatic recovery mutation. | Required |
| `STATE-020` | 13 — RSVP Closed | Authoritative deadline reached/passed. | No editable lookup/form; deadline and assistance information shown. | Required |
| `STATE-021` | State precedence | Local clock says deadline passed but backend returns proof a pre-deadline submission was stored. | Successful confirmation remains truthful; local deadline transition does not overwrite proven success. | Required |
| `STATE-022` | State precedence | Browser displays stale open form after server deadline. | Submission/lookup receives authoritative `410` and transitions to Closed. | Required |
| `STATE-023` | State distinction | Compare known pre-storage `503` to missing client response. | `503` => Service Unavailable; missing/ambiguous response => Submission Uncertain. | Required |
| `STATE-024` | Transient data | Inspect URLs/metadata while draft/submission/confirmation data is held in memory. | Transient values are not promoted into URL/query/fragment/metadata/analytics. | Required |
| `STATE-025` | Full reload | Reload during a draft. | Transient draft may be discarded; system does not reconstruct private state from URL. | Required |

---

# 20. Confirmation Route and Refresh Tests

Phase 3 Step 13 finalizes this section. The ordinary source of a successful on-screen confirmation is the limited successful response returned by `POST /wedding/api/rsvp/submit` after authoritative storage and the applicable delivery attempts. React passes that response into temporary navigation/application state for `/wedding/rsvp/confirmation`.

| ID | Test | Expected result | Status |
|---|---|---|---|
| `PAGE-001` | Navigate after successful initial storage. | Browser uses `/wedding/rsvp/confirmation` and carries the approved limited successful response in temporary navigation/application state. | Required |
| `PAGE-002` | Navigate after successful revision. | Same canonical confirmation route is used with the complete merged successful response. | Required |
| `PAGE-003` | Inspect confirmation URL. | No code, RSVP answer, confirmation destination, private version, token, or other personalized data appears in path/query/fragment. | Required |
| `PAGE-004` | Inspect successful initial summary. | Shows complete current guest-facing RSVP and approved limited metadata. | Required |
| `PAGE-005` | Inspect successful revision summary. | Shows complete merged RSVP and revision designation. | Required |
| `PAGE-006` | Inspect conditionally inapplicable RSVP structures. | Omitted rather than fabricated as zero, blank, or `N/A`. | Required |
| `PAGE-007` | Inspect delivery warning. | Clearly states RSVP was recorded; warning relates to delivery only and preserves initial-versus-revision designation. | Required |
| `PAGE-008` | Refresh/history traversal while a structurally usable successful response remains available. | Continue to render the applicable State 9, 10, or 11; the refresh/history action alone does not force State 12. | Required |
| `PAGE-009` | Refresh `/wedding/rsvp/confirmation` after temporary successful state is absent. | State 12 — Confirmation Refresh Fallback is shown. | Required |
| `PAGE-010` | Directly navigate, bookmark/open a new tab, or return through history to `/wedding/rsvp/confirmation` without usable successful state. | State 12 is shown without attempting to determine why the state is unavailable. | Required |
| `PAGE-011` | Provide malformed/incomplete temporary confirmation state that cannot satisfy the approved successful response shape or `submission.recorded: true`. | Do not render State 9–11; render State 12. | Required |
| `PAGE-012` | Successful response has `submission.action: "initial"` and no delivery warning. | Render State 9 — Confirmed Initial Submission. | Required |
| `PAGE-013` | Successful response has `submission.action: "revision"` and no delivery warning. | Render State 10 — Confirmed Revision. | Required |
| `PAGE-014` | Successful response has either action and `confirmation.deliveryWarning: true`. | Render State 11 — Stored with Delivery Warning while preserving the underlying initial/revision designation. | Required |
| `PAGE-015` | Idempotent successful replay returns HTTP `200` but preserves `submission.action: "initial"`. | Render State 9 (or State 11 if a delivery warning is present), not State 10 merely because the HTTP status is `200`. | Required |
| `PAGE-016` | Inspect State 12 heading. | Heading is `Confirmation Summary No Longer Available`. | Required |
| `PAGE-017` | Inspect State 12 primary explanation. | It explains that the temporary on-screen RSVP summary is unavailable, that an RSVP may already have been recorded, directs the guest to check the selected email/text confirmation, and warns not to submit the same response again solely because the summary disappeared. | Required |
| `PAGE-018` | Inspect State 12 revision guidance. | Tells the guest that a deliberate revision begins by returning to the RSVP page and entering the invitation code again. | Required |
| `PAGE-019` | Inspect State 12 assistance content. | Provides `RSVPhelp@loreweavercreations.com` and a `Contact for Help` action. | Required |
| `PAGE-020` | Activate `Return to RSVP`. | Navigates to `/wedding/rsvp/` as a deliberate ordinary manual-entry interaction; it does not replay the lost submission. | Required |
| `PAGE-021` | Activate `Return to RSVP` after the authoritative deadline. | Ordinary RSVP route/backend deadline authority produces State 13 — RSVP Closed; State 12 does not bypass the deadline. | Required |
| `PAGE-022` | Enter State 12 and inspect network activity. | Browser does not automatically call `POST /wedding/api/rsvp/submit` or `POST /wedding/api/rsvp/lookup`. | Required |
| `PAGE-023` | Enter State 12 and inspect submission identifiers. | Browser does not generate a new `clientSubmissionId` or silently reuse a previously retained identifier. | Required |
| `PAGE-024` | Enter State 12 and inspect API calls/routes. | No undocumented saved-RSVP retrieval or public confirmation-recovery endpoint is called. | Required |
| `PAGE-025` | Inspect initial implementation route/API design. | No short-lived confirmation token, token-bearing path/query/fragment, public saved-RSVP endpoint, or code-bearing confirmation URL is required. | Required |
| `PAGE-026` | Inspect browser storage used solely for confirmation-refresh survival. | Step 13 does not require persistence of the successful response in `localStorage`, `sessionStorage`, IndexedDB, cookies, URL parameters/fragments, or a newly created backend token record solely to reconstruct the summary. | Required |
| `PAGE-027` | Compare State 12 to State 8 — Submission Uncertain. | State 12 does not silently become State 8 and does not offer an automatic idempotent replay; State 8 remains the explicit safe-retry state for an uncertain submission interaction. | Required |
| `PAGE-028` | Search indexing | Check confirmation route indexing. | Route, including State 12, is excluded from public indexing. | Required |
| `PAGE-029` | Nested-route refresh routing | Directly load/refresh `/wedding/rsvp/confirmation`. | React route resolves to the applicable confirmation/fallback experience rather than a generic server 404. | Required |
| `PAGE-030` | Inspect State 12 focus/announcement behavior. | Fallback heading or primary explanatory region receives appropriate focus or programmatic announcement so the change is perceivable. | Required |
| `PAGE-031` | Keyboard/touch test State 12 actions. | `Return to RSVP` and `Contact for Help` remain keyboard- and touch-operable and focus is not obscured by the sticky header. | Required |
| `PAGE-032` | Inspect State 12 semantics without visual cues. | Explanation, revision guidance, and assistance remain understandable in text without relying on color or icons. | Required |
| `PAGE-033` | Inspect timed navigation behavior. | State 12 does not use a timed automatic redirect that prevents the guest from reading the uncertainty-safe explanation. | Required |
| `PAGE-034` | Enable reduced-motion preference. | Optional State 12 transition treatment respects reduced motion without changing the required message or actions. | Required |

Minor punctuation or responsive line-wrap changes to the finalized State 12 copy are acceptable during implementation only when the substantive meaning remains unchanged.

---

# 21. Deadline and Countdown Tests

The authoritative deadline is Monday, March 1, 2027 at 11:59 p.m. EST, interpreted in `America/New_York`.

| ID | Test | Expected result | Status |
|---|---|---|---|
| `TIME-001` | Open RSVP before February 1, 2027 12:00 a.m. EST. | Written deadline shown; no live countdown. | Required |
| `TIME-002` | Reach February 1, 2027 12:00 a.m. EST. | Live final-month countdown becomes visible. | Required |
| `TIME-003` | Open validated form during final month. | Countdown appears there as well as on entry state. | Required |
| `TIME-004` | Guest device set to another time zone. | Countdown still targets `America/New_York` deadline. | Required |
| `TIME-005` | Guest device clock intentionally incorrect. | Backend deadline authority is unaffected; countdown logic must not let device clock extend acceptance. | Required |
| `TIME-006` | Server receives new logical submission at 2027-03-01 23:58:59 EST. | Accepted if otherwise valid. | Required |
| `TIME-007` | Server receives new logical submission at 2027-03-01 23:59:00 EST. | `410 Gone`. | Required |
| `TIME-008` | Server receives new logical submission after deadline. | `410 Gone`. | Required |
| `TIME-009` | Stale browser attempts lookup at/after deadline. | `410 Gone`; closed state; no blank personalized form. | Required |
| `TIME-010` | Stale browser attempts revision at/after deadline. | `410 Gone`; no new RSVP version. | Required |
| `TIME-011` | Deadline reached while user is viewing open entry/form without server interaction. | UI transitions to closed behavior according to centralized deadline state; backend remains authoritative on any request. | Required |
| `TIME-012` | Safe idempotent replay after deadline for a logical request already stored before deadline. | Does not create a new mutation/version; idempotent rules control the replay. | Required |

---

# 22. Accessibility Tests

These cases reflect the current requirements and Step 10 browser-state model. Exact implementation technology is not prescribed by Step 12.

| ID | Test | Expected result | Status |
|---|---|---|---|
| `A11Y-001` | Inspect every RSVP control. | Persistent visible guest-facing label exists; placeholder alone is not the label. | Required |
| `A11Y-002` | Inspect programmatic associations. | Assistive technology can determine labels, requiredness, help text, and associated error messages. | Required |
| `A11Y-003` | Inspect attendance checkbox/radio groups. | Related controls use meaningful semantic/visual grouping and group labels/legends. | Required |
| `A11Y-004` | Inspect the four coordinated attendance-total dials. | Group has an accessible legend/label, each age category is identifiable, and dynamic maximum changes are communicated without relying on visual position alone. | Required |
| `A11Y-005` | Keyboard-only navigation. | Guest can reach and operate all essential RSVP controls without mouse/touch. | Required |
| `A11Y-006` | Mobile menu keyboard operation. | Menu opens, closes, and navigates by keyboard; closes after destination selection. | Required |
| `A11Y-007` | Visible focus. | Current keyboard focus is clearly visible on every interactive element. | Required |
| `A11Y-008` | Sticky header focus test. | Focused control, heading, or error is not hidden under sticky navigation. | Required |
| `A11Y-009` | Trigger validation errors. | Written explanations identify what must be corrected; errors are not color/icon only. | Required |
| `A11Y-010` | Trigger form-level validation failure. | Accessible error summary appears; focus moves intentionally to summary or first invalid field. | Required |
| `A11Y-011` | Validation failure after partially completed form. | Previously valid page-entered answers remain intact. | Required |
| `A11Y-012` | Required fields. | Requiredness is understandable without relying on color alone. | Required |
| `A11Y-013` | Lookup/submission progress. | Progress is announced programmatically. | Required |
| `A11Y-014` | Success, warning, uncertainty, closed states. | State meaning is communicated in explicit text, not icon-only. | Required |
| `A11Y-015` | Browser zoom/text enlargement. | RSVP remains readable/operable without important clipping or ordinary-content horizontal scrolling. | Required |
| `A11Y-016` | Reduced-motion preference. | Any later-added progress/transition animation respects reduced motion while status remains understandable. | Required |
| `A11Y-017` | Touch target/use on mobile. | Essential controls remain touch-operable without losing keyboard support. | Required |
| `A11Y-018` | New-tab external link notices where linked from RSVP/privacy content. | New-tab behavior is identified accessibly. | Required |

---
| `A11Y-019` | Inspect repeated named-`Plus1` controls. | Each authorized allocation has a persistent accessible label containing the configured named-invitee prompt; parties with no allocations receive no empty or hidden placeholder controls. | Required |
| `A11Y-020` | Inspect repeated `attendeeDetails` rows in Ceremony-only and Reception states. | Each row has an accessible group label or position context; attendee-name fields are distinguishable programmatically, and Reception-only dietary/allergy fields are associated with the correct row. | Required |

# 23. Finalized Phase 3 Privacy and Security Tests

Phase 3 Step 14 finalizes this section. These cases verify the privacy/security requirements approved in `decisions.md` and synchronized into `rsvp-system-design.md` and `rsvp-api-contract.md`.

The test catalog defines expected behavior. Some production-gate and lifecycle tests can be executed only after provider selection, production deployment, or the applicable retirement date; they remain **Required**.

| ID | Test | Expected result | Status |
|---|---|---|---|
| `PRIV-001` | Inspect browser URL throughout RSVP flow. | No invitation code, guest identity, RSVP answer, email/mobile destination, confirmation detail, private version, or recovery token appears in path/query/fragment. | Required |
| `PRIV-002` | Inspect page titles, descriptions, canonical URLs, structured data, and social-preview metadata. | No invitation code, guest identity, RSVP response, confirmation destination, profile assignment, allowance, or other personalized RSVP value appears. | Required |
| `PRIV-003` | Inspect analytics events on RSVP/confirmation routes. | No invitation code, party identity derived from invitation data, RSVP answer, dietary information, email/mobile, confirmation destination, `clientSubmissionId`, profile assignment, allowance, version, or provider payload is sent. | Required |
| `PRIV-004` | Inspect lookup response. | No stored answers, stored destinations, stored-response existence indicator, private IDs, administrative data, another party's information, or credentials are exposed. | Required |
| `PRIV-005` | Inspect successful submission response. | No invitation code, `clientSubmissionId`, guest email/mobile destination, SMS authorization content, private RSVP version, protected administrative address, provider credential, or unrelated party data is exposed. | Required |
| `PRIV-006` | Inspect confirmation route. | No sensitive summary data is encoded into the URL; Step 13 temporary-state behavior remains controlling. | Required |
| `PRIV-007` | Inspect public RSVP and confirmation indexing treatment. | `/wedding/rsvp/` and `/wedding/rsvp/confirmation`, including all transactional states, are excluded from public indexing through appropriate page/server behavior. | Required |
| `PRIV-008` | Inspect health endpoint. | No invitation, RSVP, confirmation destination, dietary, delivery, workbook-row, or private administrative data is exposed. | Required |
| `PRIV-009` | Search React source, compiled browser assets, and public assets for production invitation records. | No production invitation list, real invitation code, guest identity, or private configuration is present. | Required |
| `PRIV-010` | Attempt `DEV999` or another development/test fixture in a production-mode harness. | Development/testing records do not become active production invitations and receive neutral unavailable/invalid behavior. | Required |
| `PRIV-011` | Inspect concise RSVP privacy notice. | Notice appears on the entry and validated-form experience, links to `/wedding/privacy`, and accurately reflects invitation-code use, processing, private storage, confirmation delivery, transactional contact use, and material practices without an absolute-security promise. | Required |
| `PRIV-012` | Access `/wedding/privacy` without an invitation code. | Full Privacy page is publicly reachable and remains indexable. | Required |
| `PRIV-013` | Inspect guest-facing administrative-delivery status. | Protected administrative email address is never exposed. | Required |
| `PRIV-014` | Force backend/provider/storage errors. | Guest-facing result contains no stack trace, framework output, workbook/worksheet name, server path, credential, private admin address, provider payload, record ID, or close-match information. | Required |
| `PRIV-015` | Trace RSVP mobile-number use. | Number is used only for approved transactional RSVP confirmation and approved manual resend unless a later recorded decision separately authorizes another purpose. | Required |
| `PRIV-016` | Review guest-facing invitation-code description. | Code is described as an invitation/access code or limited access token, not as a password or password-equivalent authentication mechanism. | Required |
| `PRIV-017` | Search public functionality for guest directory/code recovery. | No public guest directory, invitation directory, code-recovery search, valid-code list, public saved-RSVP endpoint, or RSVP-history endpoint exists. | Required |
| `PRIV-018` | Submit a one-character near match and visual-ambiguity variants. | No fuzzy matching, “Did you mean?” response, close-match disclosure, or automatic character substitution occurs. | Required |
| `PRIV-019` | Inspect lookup transport. | Invitation code appears only in the `POST /wedding/api/rsvp/lookup` request body; not in browser/API path, query, or fragment. | Required |
| `PRIV-020` | Inspect submission transport. | Invitation code appears only in the `POST /wedding/api/rsvp/submit` request body; not in browser/API path, query, or fragment. | Required |
| `PRIV-021` | Successful lookup response headers. | Includes `Cache-Control: no-store, max-age=0`. | Required |
| `PRIV-022` | Lookup failure response headers for `400`, `404`, `410`, `429`, and `503` as applicable. | Each includes `Cache-Control: no-store, max-age=0`. | Required |
| `PRIV-023` | Successful submission response headers for `201` and `200`. | Includes `Cache-Control: no-store, max-age=0`. | Required |
| `PRIV-024` | Submission failure response headers for `400`, `403`, `410`, `429`, and `503` as applicable. | Each includes `Cache-Control: no-store, max-age=0`. | Required |
| `PRIV-025` | Production `/wedding/rsvp/` browser response. | Uses `Cache-Control: no-store, max-age=0`. | Required |
| `PRIV-026` | Production `/wedding/rsvp/confirmation` browser response. | Uses `Cache-Control: no-store, max-age=0`. | Required |
| `PRIV-027` | Static versioned application asset with no personalized/secret data. | Ordinary cache optimization is permitted; Step 14 no-store policy is not unnecessarily applied to safe static assets. | Required |
| `PRIV-028` | Inspect browser storage after successful RSVP confirmation. | Successful response is not intentionally persisted in `localStorage`, `sessionStorage`, IndexedDB, cookies, or another persistent mechanism solely to reconstruct confirmation after refresh. | Required |
| `PRIV-029` | Remove temporary confirmation state and refresh/direct-load confirmation route. | State 12 is shown; browser does not bypass Step 13 by retrieving a saved RSVP or creating a recovery token. | Required |
| `PRIV-030` | Disable/block analytics. | Lookup, form rendering, submission, storage, confirmation delivery, and recovery continue to function; analytics are not operationally required. | Required |
| `PRIV-031` | Inspect allowed routine log fields. | Routine logs are limited to non-sensitive operational data such as server-generated correlation ID, timestamp, endpoint/route category, HTTP status, duration, generic error category, delivery channel without destination, rate-limit event, and non-sensitive delivery outcome. | Required |
| `PRIV-032` | Inspect ordinary logs during lookup. | Raw and normalized invitation codes, guest/party names, lookup request body, and lookup response body are absent. | Required |
| `PRIV-033` | Inspect ordinary logs during submission. | Submission request/response bodies, RSVP answers, dietary/allergy text, email/mobile, confirmation destinations, and `clientSubmissionId` are absent. | Required |
| `PRIV-034` | Inspect ordinary delivery/provider logs controlled by the application. | Provider credentials, backend secrets, protected administrative address, and full provider request/response payloads are absent. | Required |
| `PRIV-035` | Inspect reverse-proxy/middleware request logging for RSVP POST endpoints. | Request-body logging is disabled; private POST-body values do not enter ordinary logs. | Required |
| `PRIV-036` | Enable a controlled diagnostic correlation test. | When genuine correlation is necessary, a non-reversible keyed pseudonymous invitation identifier may be used instead of the raw code. | Required |
| `PRIV-037` | Inspect diagnostic-correlation controls. | Diagnostic logging is explicitly enabled, access-restricted, minimum-field, time-limited, disabled after the investigation, and retired when no longer needed. | Required |
| `PRIV-038` | Lookup limiter with one client IP. | Up to 10 applicable requests fit the 15-minute rolling window; the next applicable request returns guest-safe `429`. | Required |
| `PRIV-039` | Inspect lookup `429`. | Response discloses no invitation existence, near-match, active-status, environment, record-count, or private counter information and uses the no-store policy. | Required |
| `PRIV-040` | Submission IP limiter in controlled harness. | After 6 applicable requests for one client IP in the 15-minute rolling window, the next applicable request returns guest-safe `429`. | Required |
| `PRIV-041` | Submission normalized-code limiter in controlled harness. | After 6 applicable requests for one normalized invitation code in the 15-minute rolling window, the next applicable request returns guest-safe `429`. | Required |
| `PRIV-042` | Inspect rate-limited submission state. | No RSVP version is created and no guest/admin delivery attempt begins because of the rate-limited request. | Required |
| `PRIV-043` | Inspect rate-limit retry indication. | `Retry-After` is included when supported by the selected rate-limiting implementation; absence is acceptable only when the chosen implementation cannot provide it under the approved rule. | Required |
| `PRIV-044` | Trusted production proxy-chain test. | Per-IP limiter uses the intended client address supplied through the configured trusted proxy/tunnel chain. | Required |
| `PRIV-045` | Spoof arbitrary forwarded-address headers from an untrusted client. | Express does not blindly trust the spoofed value for rate-limiting identity. | Required |
| `PRIV-046` | Search frontend/browser artifacts for Google credentials. | No service-account file, private key, access token, spreadsheet authentication secret, or Google credential is present. | Required |
| `PRIV-047` | Search frontend/browser artifacts for email/SMS secrets. | No SMTP password, SMS API key, provider auth secret, sender secret/configuration, or protected administrative recipient address is present. | Required |
| `PRIV-048` | Inspect source-control/public documentation/public shares. | No backend credential, provider secret, production invitation data, or protected administrative configuration is present. | Required |
| `PRIV-049` | Inspect administrative workbook permissions. | Workbook is not public and is accessible only to the couple, explicitly authorized administrators, and backend service account. | Required |
| `PRIV-050` | Inspect browser network behavior. | React never authenticates directly to or reads directly from the private Google Sheets workbook. | Required |
| `PRIV-051` | Compare production and development/test environments. | Production invitation data, DEV fixtures, production credentials, and development/test credentials remain separated. | Required |
| `PRIV-052` | Present a syntactically valid development fixture to production. | Neutral unavailable/invalid behavior is returned without disclosing that the record exists in another environment. | Required |
| `PRIV-053` | Inspect guest-safe error response body across `400`, `403`, `404`, `410`, `429`, and `503`. | No infrastructure, filesystem, workbook, provider, credential, private-recipient, record-ID, close-match, or environment-enumeration detail is exposed. | Required |
| `PRIV-054` | Inspect submitting party's temporary on-screen confirmation. | Attendee names and applicable per-attendee dietary/allergy information may appear as part of that party's complete current RSVP. | Required |
| `PRIV-055` | Inspect submitting party's selected email/text confirmation. | Attendee names and applicable dietary/allergy responses may appear as part of that party's complete current RSVP. | Required |
| `PRIV-056` | Inspect protected administrative confirmation. | Attendee names and applicable per-attendee dietary/allergy information may appear because the protected administrative message contains the complete current RSVP. | Required |
| `PRIV-057` | Inspect analytics, public pages/metadata, ordinary logs, unrelated admin output, and another invited party's data. | Attendee-entered names and dietary/allergy text are absent from all prohibited surfaces. | Required |
| `PRIV-058` | Production SMS gate not yet satisfied. | Text Message confirmation remains disabled; no invented provider-specific disclosure is shown. | Required |
| `PRIV-059` | Production SMS gate satisfied. | Provider is selected; required sender/consent/carrier-rate/opt-out/help/other applicable wording is verified; credentials remain backend-only; production flow is tested before Text Message is enabled. | Required |
| `PRIV-060` | Inspect public security/privacy copy. | No claim of “completely secure,” “100% secure,” “unhackable,” “risk-free,” or equivalent absolute guarantee appears. | Required |
| `PRIV-061` | Production traffic test. | RSVP entry, lookup, submission, and confirmation use HTTPS. | Required |
| `PRIV-062` | Attempt ordinary HTTP navigation in production. | Redirects to HTTPS before RSVP information can be submitted. | Required |
| `PRIV-063` | Active RSVP-data lifecycle review by July 30, 2027. | Current responses, superseded versions, person-level attendance responses, attendee-entered names, dietary/allergy text, guest confirmation destinations, SMS authorization, `clientSubmissionId`, delivery-attempt history, transaction timestamps retained only as history, and active code-to-response mappings are deleted or irreversibly de-identified unless a documented exception applies. | Required |
| `PRIV-064` | Retention exception review after July 30, 2027. | Only the minimum record needed for a concrete unresolved correction, dispute, delivery investigation, or other documented administrative need remains; access is restricted and the record is deleted when the need ends. | Required |
| `PRIV-065` | Protected backup lifecycle review by August 29, 2027. | Backups containing retired RSVP-operational data have expired through protected backup rotation. | Required |
| `PRIV-066` | Create backups after active-data retirement. | New backups do not unnecessarily reintroduce RSVP-operational data already deleted or irreversibly de-identified from the active system. | Required |
| `PRIV-067` | Inspect post-retirement aggregate records. | Only non-identifying aggregates that cannot reasonably reconstruct an invited party's RSVP may be retained under the RSVP-system rule. | Required |
| `PRIV-068` | Inspect retained private `Invitees List` after RSVP-system retirement. | It may remain a private personal planning/address record, but the active public RSVP application no longer depends on retired RSVP response history and the list is not exposed publicly. | Required |
| `PRIV-069` | Enumerate public RSVP endpoints after Step 14. | Public endpoint inventory remains health, lookup, and submit only; no guest directory, code recovery, saved-RSVP, history, admin, or confirmation-recovery endpoint was added. | Required |
| `PRIV-070` | Inspect `/wedding/not-found` and unmatched wedding routes. | They are excluded from indexing and expose no technical/internal/private detail. | Required |
| `PRIV-071` | Compare no-index/no-store behavior with backend authorization. | Search/caching controls supplement rather than replace backend invitation validation, environment authorization, and response minimization. | Required |

---

# 24. Development-Fixture Coverage Matrix

The preliminary suite must exercise every active fictional fixture and the disabled guard fixture.

| Fixture | Primary coverage | Minimum cases that must exercise it |
|---|---|---|
| `DEV001` — one named invitee, no Plus 1, max 1 | Smallest capacity; named-response authorization; no-allocation guard | `CONF-001`, `CONF-004`, `CONF-008`, `ADD-001`, `ADD-002`, `ATT-017`, `TOTAL-003`, `INIT-001` |
| `DEV002` — five named invitees, no Plus 1 | Plural wording; mixed named-household attendance | `CONF-002`, `CONF-009`, `ATT-019`, `ATT-026`, `TOTAL-004` |
| `DEV003` — one named invitee + one Plus 1 | Single-allocation contribution to derived headcount | `CONF-005`, `ADD-003`–`ADD-005`, `ATT-023` |
| `DEV004` — three named invitees + one Plus 1 | Plural mixed roster/allocation path | `CONF-024`, confirmation/delivery cases as applicable |
| `DEV005` — four named invitees, Ceremony scenario | Ceremony-only attendee names and no dietary field | `ATT-001`, `DIET-001`, `STATE-009` |
| `DEV006` — one named invitee + one Plus 1, Reception scenario | Reception dietary applicability and detail cardinality | `ATT-002`, `DIET-002`, `INIT-002` |
| `DEV007` — three named invitees, combined attendance | Ceremony + Reception dependency behavior | `ATT-003`, `DIET-003` |
| `DEV008` — three named invitees, revision scenario | Blank revision access, same-count swaps, and merge semantics | `BLANK-002`–`BLANK-011`, `ATT-025`, `DIET-013`, `REV-001`–`REV-028` as applicable |
| `DEV009` — four named invitees + three Plus 1 slots | Multiple independent allocations and mixed derived headcount | `CONF-006`, `CONF-010`, `ADD-006`–`ADD-014` |
| `DEV010` — three named invitees + one Plus 1, max 4 | Derived-count dial equality and capacity invariant | `CONF-024`, `TOTAL-014`, `TOTAL-016` |
| `DEV999` — disabled guard | Neutral inactive/environment handling | `CODE-014`, `CONF-011`, `PRIV-010` |

---

# 25. Cross-Document Acceptance Checks

| ID | Check | Expected result |
|---|---|---|
| `DOC-001` | Compare test cases with current `rsvp-system-design.md`. | No test resurrects production question profiles, aggregate additional-guest counts, independently selected headcount, party-level dietary data, Reception-only attendee names, or a required production placeholder. |
| `DOC-002` | Compare with current `rsvp-api-contract.md`. | Status codes, four-property request envelope, five-property success envelope, person-level attendance derivation, idempotency, and no-`expectedVersion` behavior match. |
| `DOC-003` | Compare with `rsvp-example-form-schemas.json`. | Permanent IDs, named-invitee/Plus 1 behavior, derived-headcount rules, exact age-total equality, attendee-detail cardinality, dietary applicability, and replacement/clearing semantics match. |
| `DOC-004` | Compare with `rsvp-example-configurations.json`. | Fixture codes, wording modes, maximums, safe named rosters, named allocation arrays, capacity invariants, environment values, and active flags match. |
| `DOC-005` | Compare with `wireframes.md` and `page-outlines.md`. | All thirteen interface states and corrected spreadsheet-authoritative visible controls are represented consistently after those files are resynchronized. |
| `DOC-006` | Compare with `sitemap.md` and `route-inventory.md`. | Canonical routes, refresh fallback, non-indexing, and no-code-in-URL behavior are consistent. |
| `DOC-007` | Compare with `requirements.md` and `decisions.md`. | Corrected person-level attendance requirements and later decisions control over superseded entries. |
| `DOC-008` | Search this file for real production invitation codes or guest identities. | None present. |
| `DOC-009` | Search for active expected-version conflict tests. | None exists; ordinary `409` is unused. |
| `DOC-010` | Search for aggregate or universal Plus 1 assumptions. | None; Plus 1 controls exist only per authorized allocation and are absent for parties without allocations. |
| `DOC-011` | Compare confirmation-refresh tests with current governing docs. | Same temporary-state eligibility, State 12 trigger, fallback meaning, actions, and prohibited automatic recovery behavior are used. |
| `DOC-012` | Search for required confirmation token/recovery endpoint. | None exists. |
| `DOC-013` | Search for automatic lookup/submission replay from State 12. | None exists. |
| `DOC-014` | Search for an assumption that every browser refresh forces State 12. | None; usable temporary success may continue to render States 9–11. |
| `DOC-015` | Compare privacy/security tests with approved decisions. | Cache, logging, analytics, limits, credentials, provider gate, retention, HTTPS, and security wording match. |
| `DOC-016` | Compare with current `rsvp-system-design.md`. | Trusted-proxy behavior, retirement, environment separation, and browser privacy boundaries match. |
| `DOC-017` | Compare with current `rsvp-api-contract.md`. | `Cache-Control`, exact rate limits, `429`, error families, SMS gate, and endpoint inventory match. |
| `DOC-018` | Search for remaining active future/provisional/deferred privacy requirement. | None remains. |
| `DOC-019` | Search for provider-specific SMS copy before provider selection. | None; production enablement requires verified applicable copy first. |
| `DOC-020` | Search for retention rule inconsistent with July 30 / August 29, 2027. | None exists. |
| `DOC-021` | Search for `questionProfile`, `additionalGuestAllowance`, aggregate `additionalGuestAttendance`, or active reduced-profile logic. | None exists as an operative test requirement. |
| `DOC-022` | Search for a party-level dietary field assumption. | None; dietary/allergy information is optional per attendee and Reception-specific. |
| `DOC-023` | Verify production-source audit targets. | Documentation expects 57 active assigned records, 35 singular, 22 plural, 26 total Plus 1 allocations, and capacity 115 without hard-coding those aggregate figures into reusable renderer logic. |
| `DOC-024` | Search for Reception-only attendee-name assumptions. | None; `attendeeDetails` and required attendee names apply to every attending RSVP. |
| `DOC-025` | Search for age-total-derived headcount assumptions. | None; `overallAttendance` derives from person-level Yes responses and age totals must equal it. |
| `DOC-026` | Search for maximum-bounded-but-not-equal age-total rules. | None; active rules require exact equality to derived headcount. |
| `DOC-027` | Verify same-count attendee swap semantics. | Composition change requires complete `attendeeDetails` replacement even when numeric `overallAttendance` is unchanged. |
| `DOC-028` | Verify Reception removal semantics. | Removing Reception while Ceremony remains preserves attendee names and clears only dietary/allergy values. |

---

# 26. Privacy/Security Traceability

| Finalized subject | Coverage |
|---|---|
| Personalized-response `Cache-Control` | `PRIV-021`–`PRIV-029` |
| Ordinary-log redaction | `PRIV-031`–`PRIV-037` |
| Lookup rate limit | `CODE-025`, `PRIV-038`–`PRIV-039` |
| Submission rate limits | `ERR-013`, `PRIV-040`–`PRIV-042` |
| `Retry-After` handling | `PRIV-043` |
| Provider-specific SMS disclosure gate | `CHAN-019`–`CHAN-024`, `PRIV-058`–`PRIV-059` |
| RSVP-data retention | `PRIV-063`–`PRIV-068` |
| Credential/deployment boundaries | `PRIV-044`–`PRIV-052`, `PRIV-061`–`PRIV-062` |
| Browser/cache behavior | `PRIV-021`–`PRIV-030` |
| Server-log exclusion of codes, answers, attendee details, and confirmation destinations | `PRIV-031`–`PRIV-037` |
| Per-attendee dietary/allergy privacy | `PRIV-054`–`PRIV-057` |

No active privacy/security test identifier is intentionally deferred.

---

# 27. RSVP Test-Catalog Completion Check

The current test catalog is complete for implementation planning when it includes, at minimum:

- Accepted and rejected invitation-code normalization.
- Manual-entry and POST-body lookup.
- Neutral malformed/unknown/inactive handling.
- Final lookup and submission rate-limit behavior.
- Backend-unavailable versus submission-uncertain distinction.
- Singular and plural configuration wording.
- Safe named-invitee rosters plus zero, one, and multiple authorized `Plus1` allocation configurations.
- Capacity reconciliation: `namedInvitees.length + additionalGuestAllocations.length = maximumAttendance`.
- Explicit proof that invitations with no Column E `Plus1` allocation render and authorize no Plus 1 question.
- One reusable spreadsheet-authoritative form schema rather than production question-profile variants.
- Active and inactive fictional fixtures.
- Initial and revision blank-form behavior.
- No stored-response existence indicator.
- Omission, replacement, explicit zero, and backend dependency-clearing semantics.
- Ceremony-only, Reception-only, combined attendance, and full decline.
- Rejection of contradictory/empty complete event-attendance states.
- Explicit named-invitee Yes/No decisions, including valid mixed-household attendance.
- Stable named-invitee and allocation-ID authorization.
- Backend-derived `overallAttendance` from complete person-level Yes responses and rejection of client-written headcount.
- Four age-category totals whose complete sum equals derived `overallAttendance` exactly.
- Coordinated dial maxima based on the derived attendee count rather than invitation capacity alone.
- `attendeeDetails` for every attending state, including Ceremony-only attendance.
- Exact attendee-detail cardinality equal to derived `overallAttendance`.
- Required attendee names with 100-character maximum.
- Optional per-attendee Reception-specific dietary/allergy text with 1000-character maximum and exact visible label `Dietary or allergy information`.
- Required full attendee-detail replacement when attendee identity composition changes, including same-count swaps.
- Preservation of attendee names and automatic dietary/allergy clearing when Reception is removed but Ceremony attendance remains.
- Full attendee-detail clearing only when the party fully declines or the relevant attendee composition is replaced.
- Email and provider-gated text-message confirmation dependencies.
- Initial storage, revisions, current-response replacement, and version history.
- Double-click, duplicate request, idempotent replay, materially changed reused identifier, and safe retry.
- No active `expectedVersion` / ordinary `409` concurrency flow.
- Independent guest and administrative delivery outcomes and manual resend without RSVP mutation.
- All thirteen browser states and finalized confirmation-refresh fallback behavior.
- Deadline/countdown edge cases.
- Labels, repeated-group semantics, keyboard operation, focus, validation summaries, status announcements, text enlargement, and reduced motion.
- Final cache, analytics, logging, rate-limit, credential, SMS-gate, HTTPS, and retention tests.
- Every active fictional fixture and disabled `DEV999` guard fixture.
- Cross-document checks preventing the retired profile/aggregate-guest/age-derived-headcount/Reception-only-detail architecture from returning.
- Explicit production activation/runtime rerun gates for the corrected `namedInvitees` lookup/configuration shape.

---

# 28. Confirmation-Refresh Completion Check

The confirmation-refresh portion is complete when all of the following remain true:

- The ordinary successful confirmation source is the limited successful `POST /wedding/api/rsvp/submit` response passed into temporary React navigation/application state.
- States 9, 10, and 11 require a structurally usable successful response with `submission.recorded: true`.
- State selection uses `submission.action` and `confirmation.deliveryWarning`, not the HTTP status alone.
- Refresh/direct navigation/history behavior is based on whether usable temporary successful state remains available.
- Missing or unusable successful state renders State 12 — Confirmation Refresh Fallback.
- State 12 heading remains `Confirmation Summary No Longer Available`.
- State 12 states that the temporary on-screen summary is unavailable and that an RSVP may already have been recorded without asserting success or failure.
- State 12 directs the guest to the selected email/text confirmation and discourages resubmitting solely because the on-screen summary disappeared.
- Deliberate revision begins through `Return to RSVP` and manual code entry; assistance remains available through `RSVPhelp@loreweavercreations.com`.
- State 12 performs no automatic lookup, submission replay, new identifier generation, silent identifier reuse, saved-RSVP retrieval, or confirmation-recovery API call.
- State 12 remains distinct from State 8 — Submission Uncertain, where an explicit safe idempotent retry may reuse the original identifier.
- No sensitive summary information is moved into the URL or intentionally persistent browser storage solely for refresh survival.
- Accessibility coverage includes focus/announcement, keyboard/touch actions, text-based meaning, sticky-header visibility, reduced-motion handling, and no timed redirect.

---

# 29. Privacy/Security Completion Check

The privacy/security portion is complete when all of the following are true:

- Invitation codes are treated as limited access tokens rather than passwords.
- No public guest directory, code-recovery search, fuzzy/close-match suggestion, valid-code list, code-bearing personalized route, saved-RSVP endpoint, RSVP-history endpoint, administrative endpoint, or confirmation-recovery endpoint is exposed.
- Lookup and submission carry codes only in request bodies.
- Every lookup and submission response, successful or unsuccessful, uses `Cache-Control: no-store, max-age=0`.
- Production RSVP and confirmation browser responses use the same no-store policy while safe static versioned assets may use ordinary caching.
- Temporary successful confirmation state is not intentionally promoted to persistent storage solely to survive refresh.
- RSVP/confirmation/not-found transactional routes are non-indexed while Privacy remains public/indexable.
- A successful validated lookup exposes only the current party's limited safe named-invitee roster and other form-authorized configuration; invalid lookup reveals no roster.
- Invitation codes, safe roster identities outside the validated personalized form, RSVP answers, named-invitee responses, Plus 1 responses, attendance totals, attendee-entered names, dietary/allergy text, and confirmation destinations are excluded from public metadata and analytics.
- Ordinary logs exclude raw/normalized invitation codes, request/response bodies, substantive answers, roster/attendee names, dietary/allergy information, confirmation destinations, `clientSubmissionId`, workbook content, and secrets.
- Restricted diagnostic correlation, when genuinely necessary, uses a pseudonymous non-reversible identifier and is explicitly enabled, access-restricted, minimum-field, time-limited, and retired after use.
- Lookup is limited to 10 requests per 15-minute rolling window per client IP.
- Submission is limited to 6 requests per 15-minute rolling window per client IP and 6 per normalized invitation code.
- Rate-limited submissions create no RSVP version and no confirmation delivery attempt.
- Trusted-proxy handling and spoofed forwarded-address rejection are tested.
- Google, email, SMS, sender, and protected administrative-recipient credentials remain backend-only.
- The private administrative workbook is not browser-accessible and is permission restricted.
- Production invitation data, development fixtures, and environment credentials remain separated.
- Guest-safe errors reveal no infrastructure, provider, credential, workbook, close-match, roster/allocation, or environment-enumeration detail.
- Attendee-entered names and per-attendee dietary/allergy information appear only on the submitting party's authorized confirmation surfaces, protected administrative confirmation, and authorized private records; they are absent from analytics, public metadata, ordinary logs, unrelated output, and other parties' data.
- RSVP mobile numbers remain transactional-only.
- Text Message confirmation remains disabled until provider selection, applicable disclosure/authorization review, backend-only credential/sender configuration, and production-flow testing satisfy the gate.
- Production RSVP traffic uses HTTPS and ordinary HTTP redirects before private data can be submitted.
- Active RSVP-operational data, including person-level responses and attendee-entered names, is retired by July 30, 2027 subject only to a minimal documented exception, and protected backups containing retired data expire by August 29, 2027.
- Post-retirement aggregates remain non-identifying; a separately retained private `Invitees List` does not keep the public RSVP application dependent on retired response history.
- Privacy/security rules create no additional public RSVP API endpoint.
- The current decisions, requirements, system design, API contract, configurations, schema, and this catalog describe the same corrected spreadsheet-authoritative data model and security boundaries.

With these conditions documented, the test catalog is synchronized with the corrected person-level RSVP revision and remains ready to drive implementation and integrated QA.

---

# 30. Persistence-Recovery and Single-Writer Reliability Tests

| ID | Scenario | Expected result | Status |
|---|---|---|---|
| `REL-001` | RSVP version/history write succeeds but lifecycle record does not advance from `prepared`. | Same logical retry recognizes the matching mutation, repairs/accepts stored state, creates no duplicate version, then continues safely. | Implemented |
| `REL-002` | Matching version-history row exists but current-response write is missing. | Same logical retry repairs current-response state without appending another version. | Implemented |
| `REL-003` | Target private RSVP version is already occupied by a different mutation ID. | Mutation fails closed; no overwrite, duplicate version, or silent reconciliation. | Implemented |
| `REL-004` | Delivery record is stored but final submission-completion write fails. | Same logical retry reuses recorded delivery status; provider delivery is not repeated. | Implemented |
| `REL-005` | Provider delivery may have completed but durable delivery-history write fails. | Same logical retry does not automatically resend; recovered delivery status is `uncertain` and RSVP/version remain unchanged. | Implemented |
| `REL-006` | A different logical submission arrives while an earlier lifecycle for the same invitation is incomplete. | New mutation is temporarily refused with the existing guest-safe unavailable boundary until the interrupted logical submission is recovered. | Implemented |
| `REL-007` | Two distinct revisions for the same invitation are submitted concurrently to one backend instance. | In-process serialization causes each revision to merge against the latest authoritative current RSVP; version sequence remains unique and ordered. | Implemented |
| `REL-008` | Exact completed logical submission is replayed. | Stored response is returned with `idempotentRepeat: true`; no additional version or delivery attempt is created. | Implemented |
| `REL-009` | Inspect public API responses after any recovery scenario. | No lifecycle state, mutation ID, private version, workbook row, or storage-recovery detail is exposed. | Required |
| `REL-010` | Production deployment uses Google Sheets persistence. | Only one mutation-capable RSVP backend instance is active at a time; no active-active or horizontally distributed RSVP writers are used without a later locking/storage decision. | Required |

The reliability model intentionally does not claim that Google Sheets provides database transactions. The approved implementation supplies recoverable logical writes and in-process serialization under the documented single-writer deployment constraint.

---

# 31. Resend Isolated Live-Email Validation

| ID | Scenario | Expected result | Status |
|---|---|---|---|
| `EMAIL-LIVE-001` | Run the isolated validation without an explicit test recipient. | Test refuses to send. | Implemented |
| `EMAIL-LIVE-002` | Run the isolated validation without the exact acknowledgement value. | Test refuses to send. | Implemented |
| `EMAIL-LIVE-003` | Run the isolated validation in production mode. | Test refuses to send. | Implemented |
| `EMAIL-LIVE-004` | Configure a sender name, sender address, Reply-To address, or provider other than the approved email identity. | Test refuses to send. | Implemented |
| `EMAIL-LIVE-005` | Run the isolated validation with the approved identity and backend-only Resend credentials. | Resend transport returns a definite `sent` result and the script reports `PASS`. | Live validated |
| `EMAIL-LIVE-006` | Inspect the received live-test message. | From identity, Reply-To identity, and safety body match the approved configuration. | Live validated |
| `EMAIL-LIVE-007` | Inspect RSVP storage after the isolated transport test. | No RSVP submission, version, revision, invitation lookup, Google Sheets access, or RSVP delivery record is required by the test path. | Implemented |
| `EMAIL-LIVE-008` | Inspect repository and ordinary output. | API key and test-recipient address are not committed or printed. | Required |

The September 20, 2026 live validation satisfied `EMAIL-LIVE-005` and `EMAIL-LIVE-006` without using production guest data.

---

# 32. Manual Resend Maintenance CLI Tests

| ID | Scenario | Expected result | Status |
|---|---|---|---|
| `RESEND-CLI-001` | Invoke the maintenance command outside production mode. | Command refuses to run. | Implemented |
| `RESEND-CLI-002` | Omit the invitation code or exact acknowledgement. | Command refuses to run before delivery. | Implemented |
| `RESEND-CLI-003` | Supply an unknown, inactive, environment-ineligible, or no-current-RSVP invitation. | Safe `NOT FOUND`; no delivery attempt and no resend record. | Implemented |
| `RESEND-CLI-004` | Resend a valid stored email confirmation. | Sends only the guest email containing the complete current RSVP; administrative email is not repeated. | Implemented |
| `RESEND-CLI-005` | Successful resend. | Separate resend record is appended; current RSVP and version history remain unchanged. | Implemented |
| `RESEND-CLI-006` | Delivery throws or returns an unknown provider-specific value. | Result is recorded as `uncertain`; RSVP remains unchanged. | Implemented |
| `RESEND-CLI-007` | Inspect command output on success/failure/not-found. | No invitation code, destination, RSVP content, workbook details, or credential is printed. | Required |
| `RESEND-CLI-008` | Inspect route inventory / Express application. | No public or administrative manual-resend HTTP endpoint exists. | Required |
| `RESEND-CLI-009` | Inspect environment handling. | Invitation code and acknowledgement are ephemeral operator inputs and are not required to be persisted in project environment files. | Implemented |

The manual resend CLI is an administrative delivery operation only. It is not a submission, revision, recovery endpoint, or mechanism for editing stored RSVP data.

---

# 33. Production Invitation Activation Tests

The September 20, 2026 controlled production activation validated the prior invitation configuration shape. Because the corrected contract adds the safe `namedInvitees` roster and a configuration-capacity invariant, the affected transformation, activation, and verification cases must be rerun before the current contract can be considered production-validated.

| ID | Scenario | Expected result | Status |
|---|---|---|---|
| `PROD-ACT-001` | Run production readiness with the authoritative private source and valid workbook schema. | Source audit, named-invitee derivation, capacity reconciliation, and schema verification pass without modifying workbook rows. | Historical live validation; rerun required |
| `PROD-ACT-002` | Production readiness finds any row in a non-invitation RSVP operational table before corrected reactivation. | Readiness fails before invitation activation. | Implemented |
| `PROD-ACT-003` | Run production invitation loader without exact destructive-write acknowledgement. | Loader refuses to modify the workbook. | Implemented |
| `PROD-ACT-004` | Run guarded corrected activation after readiness passes. | Private six-tab pre-load snapshot is created before the first invitation write. | Historical live validation; rerun required |
| `PROD-ACT-005` | Replace production invitation configuration using corrected transformer output. | Only `Invitations` is rewritten; all expected configurations are classified `production` and include the required safe named-invitee roster. | Historical live validation; rerun required |
| `PROD-ACT-006` | Verify loaded invitation rows against the corrected transformed authoritative source. | Exact configuration match; exactly 57 production invitations; every row satisfies roster/allocation/capacity reconciliation. | Historical live validation; rerun required |
| `PROD-ACT-007` | Compare non-invitation RSVP sections before and after the guarded corrected load. | Current RSVPs, RSVP Versions, Submission Records, Delivery Records, and Resend Records remain unchanged. | Historical live validation; rerun required |
| `PROD-ACT-008` | Post-write verification fails after snapshot creation. | Loader attempts to restore the prior invitation rows and reports failure. | Implemented |
| `PROD-ACT-009` | Run independent production activation verifier after successful corrected load. | Exactly 57 production invitations match the private source and corrected configuration shape; operational RSVP tables retain the expected pre-activation state. | Historical live validation; rerun required |
| `PROD-ACT-010` | Inspect ordinary command output and source control after activation. | No real invitation code, guest identity, workbook identifier, source mapping, snapshot content, or credential is exposed. | Required |

Historical September 20 results remain evidence that the guarded activation mechanism worked, but they do not substitute for rerunning the corrected transformation/configuration contract.

---

# 34. Production Runtime and Deployment Readiness Tests

The runtime architecture remains valid, but any production readiness/smoke case that reads the transformed invitation configuration or validates the lookup response must be rerun after corrected production invitation activation.

| ID | Scenario | Expected result | Status |
|---|---|---|---|
| `PROD-RUN-001` | Parse complete production configuration. | Canonical origin, approved Resend identity, disabled SMS, bounded proxy trust, and writer count of one are accepted. | Implemented |
| `PROD-RUN-002` | Configure a different production browser origin. | Production environment validation fails closed. | Implemented |
| `PROD-RUN-003` | Configure zero/missing or more than one mutation-capable writer. | Production environment validation fails closed. | Implemented |
| `PROD-RUN-004` | Configure unapproved sender identity or enable SMS before its gate. | Production environment validation fails closed. | Implemented |
| `PROD-RUN-005` | Send production RSVP request with canonical explicit `Origin`. | Origin middleware permits the request to continue. | Implemented |
| `PROD-RUN-006` | Send production RSVP request with mismatched explicit `Origin`. | No-store `403`; RSVP route processing does not continue. | Implemented |
| `PROD-RUN-007` | Send controlled originless server-side request. | Origin middleware does not reject solely because `Origin` is absent. | Implemented |
| `PROD-RUN-008` | First production process acquires local writer lock; second same-host process attempts the same lock. | Second acquisition fails until first releases the lock. | Implemented |
| `PROD-RUN-009` | Run the real production runtime readiness command after corrected invitation activation. | Environment, corrected Google invitation schema/data, Resend construction, and writer-lock acquisition/release pass. | Historical live validation; rerun required |
| `PROD-RUN-010` | Run loopback smoke with explicit acknowledgement and ephemeral real invitation code after corrected activation. | Real production app starts only on loopback; health returns HTTP 200; valid production lookup returns HTTP 200. | Historical live validation; rerun required |
| `PROD-RUN-011` | Inspect corrected smoke lookup response. | Approved blank-form response boundary, safe named-invitee roster, capacity invariant, and no-store behavior are preserved; no stored RSVP data is disclosed. | Historical live validation; rerun required |
| `PROD-RUN-012` | Compare RSVP operational workbook sections before and after corrected smoke. | No RSVP submission, version, submission lifecycle record, delivery record, or resend record is created or changed by the smoke. | Historical live validation; rerun required |
| `PROD-RUN-013` | Inspect smoke procedure and repository. | Real smoke invitation code, guest identity, protected recipient, API key, and workbook identifier are not committed. | Required |
| `PROD-RUN-014` | Change the production reverse-proxy topology. | `TRUST_PROXY` must be revalidated before guest-facing production use. | Required |
| `PROD-RUN-015` | Deploy Google Sheets-backed RSVP service. | Exactly one mutation-capable backend instance is active globally; local lock is treated only as same-host defense. | Required |

The September 20, 2026 runtime validation remains historical evidence for the unchanged deployment controls. The corrected invitation lookup/configuration gate is not current until `PROD-RUN-009` through `PROD-RUN-012` are rerun after corrected activation.
