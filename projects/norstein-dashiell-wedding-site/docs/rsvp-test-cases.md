# RSVP Preliminary Test Cases

**Project:** Loreweaver Creations Wedding Website  
**Phase:** Phase 3 — RSVP System Design and Planning  
**Step:** Phase 3 Step 12 — Define Preliminary RSVP Test Cases; revised through Phase 3 Step 14 — Finalize Phase 3 Privacy and Security Rules  
**Document:** `docs/rsvp-test-cases.md`  
**Status:** Preliminary test catalog finalized through Phase 3 Step 14; test execution occurs during later implementation/testing and lifecycle phases  
**Phase 3 status:** Complete  
**Last updated:** August 21, 2026

---

## 1. Purpose

This document is the controlling preliminary test catalog for the Loreweaver Creations wedding RSVP system as designed through Phase 3 Step 14.

It translates the approved RSVP requirements, decisions, API contract, form schemas, browser-state model, Step 11 fictional development archetypes, finalized Step 13 temporary-confirmation/refresh-fallback behavior, and finalized Step 14 privacy/security standard into testable cases.

This document defines **expected behavior**. It does not claim that application code already exists or that any test has already passed.

The test catalog must be executed against development or testing fixtures unless a later production-validation procedure explicitly requires otherwise. Active production invitation records and real guest data must not be used as ordinary test fixtures.

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

Where an older planning example conflicts with a later approved project document or decision, the later approved project document or decision controls.

In particular:

- The current system uses integer `additionalGuestAllowance`, supporting zero, one, or multiple authorized additional guests.
- Party-level dietary information is applicable to Ceremony-only, Reception-only, or combined attendance and is cleared only by a full decline.
- The current browser submission contract does **not** use client-supplied `expectedVersion`.
- `409 Conflict` is not an ordinary production RSVP result under the current contract.
- The RSVP interface uses the thirteen-state Phase 3 Step 10 model.
- Step 11 development fixtures are preferred for RSVP testing.
- Phase 3 Step 12 establishes this controlling preliminary test catalog.
- Phase 3 Step 13 finalizes the temporary successful-confirmation lifecycle and State 12 — Confirmation Refresh Fallback behavior.
- A browser refresh, direct navigation, bookmark/new-tab visit, or history traversal does not itself determine the visible confirmation state; usable temporary successful state continues to render State 9, 10, or 11, while absent or unusable successful state renders State 12.
- State 12 is presentation and recovery guidance only: it does not automatically perform lookup, replay a submission, create or silently reuse a `clientSubmissionId`, or retrieve a saved RSVP.
- The initial implementation requires no short-lived confirmation token, public confirmation-recovery endpoint, public saved-RSVP endpoint, code-bearing confirmation URL, or intentional persistent browser storage solely to make the on-screen summary survive refresh.
- Phase 3 Step 14 finalizes the complete privacy/security standard, including `Cache-Control: no-store, max-age=0`, analytics/logging exclusions, exact initial production rate limits, trusted-proxy handling, backend-only credentials, production/development separation, guest-safe errors, SMS-provider gating, HTTPS, and RSVP-data retirement.
- Invitation codes are limited access tokens rather than passwords; no public guest directory, code-recovery search, fuzzy/close-match suggestion, public saved-RSVP endpoint, or code-bearing personalized route is permitted.
- The initial production lookup limit is 10 requests per 15-minute rolling window per client IP.
- The initial production submission limits are 6 requests per 15-minute rolling window per client IP and 6 requests per 15-minute rolling window per normalized invitation code.
- Active RSVP-operational data is retired no later than July 30, 2027 unless a minimal record is temporarily required for a concrete documented administrative need.
- Protected backups containing retired RSVP-operational data expire no later than August 29, 2027.

---

## 3. Test-Case Conventions

### 3.1 Test-case identifiers

Test cases use the following prefixes:

| Prefix | Area |
|---|---|
| `CODE` | Invitation-code normalization and lookup |
| `APIH` | API health and endpoint boundaries |
| `CONF` | Invitation configuration and form-schema selection |
| `BLANK` | Blank-form and lookup privacy boundaries |
| `ATT` | Attendance and decline logic |
| `ADD` | Additional-guest behavior |
| `TOTAL` | Attendance-total behavior |
| `DIET` | Dietary behavior |
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
| `PRIV` | Finalized Phase 3 privacy, security, caching, logging, credential, transport, and retention boundaries |

### 3.2 Status labels

- **Required** — supported by the finalized Phase 3 design and must be implemented and executed when the relevant implementation, production-gate, or lifecycle condition exists.
- Phase 3 contains no remaining **Provisional** or **Deferred** RSVP test area. A test that can be executed only after provider selection, production deployment, or a future lifecycle date is still **Required**; its execution timing does not make the requirement provisional.

### 3.3 General execution rule

For every server-side RSVP test, verify both:

1. The HTTP/API result.
2. The resulting authoritative stored state, version history, delivery records, or lack of mutation as applicable.

For every browser-facing test, verify both:

1. The visible state or behavior.
2. That no prohibited information is exposed through URLs, metadata, analytics payloads, or browser-visible response content.

---

## 4. Development Fixture Registry

Use the Step 11 fictional fixtures as the default test inputs.

| Fixture | Primary purpose | `wordingMode` | `questionProfile` | `maximumAttendance` | `additionalGuestAllowance` | Active |
|---|---|---|---|---:|---:|---|
| `DEV001` / `DEV-001` | Archetype A — singular, no additional guest | `singular` | `default` | 1 | 0 | Yes |
| `DEV005` / `DEV-005` | Archetype B — plural household, no additional guest | `plural` | `default` | 4 | 0 | Yes |
| `DEV006` / `DEV-006` | Archetype C — singular, one additional guest | `singular` | `default` | 2 | 1 | Yes |
| `DEV002` / `DEV-002` | Archetype D — plural household, one additional guest | `plural` | `default` | 5 | 1 | Yes |
| `DEV007` / `DEV-007` | Archetype E — Ceremony-only scenario | `plural` | `default` | 3 | 0 | Yes |
| `DEV008` / `DEV-008` | Archetype F — Reception-only scenario | `plural` | `default` | 3 | 0 | Yes |
| `DEV009` / `DEV-009` | Archetype G — full-decline scenario | `plural` | `default` | 4 | 1 | Yes |
| `DEV010` / `DEV-010` | Archetype H — existing-response revision | `plural` | `default` | 4 | 1 | Yes |
| `DEV003` / `DEV-003` | Archetype I — multiple additional guests | `plural` | `default` | 7 | 3 | Yes |
| `DEV004` / `DEV-004` | Archetype J — reduced profile | `plural` | `reduced-attendance-dietary` | 2 | 0 | Yes |
| `DEV999` / `DEV-999` | Disabled-development guard fixture | `singular` | `default` | 2 | 1 | No |

`DEV999` is not a guest-flow archetype. It exists to test inactive/environment-ineligible lookup behavior.

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
| `CODE-029` | Lookup after prior RSVP exists | Use `DEV010` with a fictional stored response. | Lookup succeeds but reveals no stored-response existence indicator. | Required |
| `CODE-030` | Submission revalidation | After a successful lookup, submit an RSVP with a malformed or unauthorized invitation code. | Backend independently renormalizes/revalidates; prior lookup does not authorize submission. | Required |

---

# 6. API Health and Endpoint-Boundary Tests

| ID | Context | Test | Expected result | Status |
|---|---|---|---|---|
| `APIH-001` | Backend healthy | `GET /wedding/api/health`. | Returns `200 OK` and `{ "status": "ok" }`. | Required |
| `APIH-002` | Health endpoint | Inspect response. | Contains no invitation record, guest identity, RSVP answer, confirmation destination, dietary value, delivery record, spreadsheet row, or administrative information. | Required |
| `APIH-003` | Health endpoint | Simulate unavailable Google Sheets while the application process itself can still answer health. | Health is not required by the current contract to prove Google Sheets reachability. | Required |
| `APIH-004` | Health endpoint | Simulate unavailable email/SMS providers while application process remains healthy. | Health is not required to prove delivery-provider availability. | Required |
| `APIH-005` | Route boundary | Verify public RSVP browser route vs API route. | Browser interaction remains under `/wedding/rsvp/`; backend operations remain under `/wedding/api/`. | Required |
| `APIH-006` | React fallback | Request `/wedding/api/health`, `/lookup`, or `/submit` through production routing. | React browser-route fallback does not intercept valid API endpoints. | Required |
| `APIH-007` | API inventory | Enumerate public RSVP endpoints. | Only the documented health, lookup, and submit endpoints are required by the current contract; no public saved-RSVP, directory, recovery, or admin endpoint is introduced. | Required |
| `APIH-008` | Dynamic records | Change the number of development invitation records. | Endpoint logic continues to work without assuming a permanently fixed count of 56. | Required |

---

# 7. Invitation Configuration and Form-Schema Tests

| ID | Fixture | Test | Expected result | Status |
|---|---|---|---|---|
| `CONF-001` | `DEV001` | Lookup valid singular fixture. | Guest-facing wording uses singular variants supplied by configuration. | Required |
| `CONF-002` | `DEV005` | Lookup valid plural fixture. | Guest-facing wording uses plural variants supplied by configuration. | Required |
| `CONF-003` | Any fixture | Alter display name without altering `wordingMode` in a controlled fixture copy. | Renderer follows explicit `wordingMode`; it does not infer singular/plural from names. | Required |
| `CONF-004` | `DEV001` | Render `default`, allowance 0. | Includes attendance/decline, attendance totals, dietary, operational confirmation; no additional-guest question. | Required |
| `CONF-005` | `DEV002` or `DEV006` | Render `default`, allowance 1. | Includes Yes/No `additionalGuestAttendance`. | Required |
| `CONF-006` | `DEV003` | Render `default`, allowance 3. | Includes bounded whole-number/select additional-guest control allowing 0–3. | Required |
| `CONF-007` | `DEV004` | Render reduced profile. | Includes attendance/decline, dietary, and operational confirmation only; no additional-guest or attendance-total fields. | Required |
| `CONF-008` | `DEV001` | Verify maximum attendance. | `maximumAttendance` is 1 and is enforced by backend validation. | Required |
| `CONF-009` | `DEV005` | Verify larger household maximum. | `maximumAttendance` is 4 and does not imply a named guest roster. | Required |
| `CONF-010` | `DEV003` | Verify multiple-guest maximum. | `maximumAttendance` is 7 and allowance is 3; both are enforced independently. | Required |
| `CONF-011` | `DEV999` | Validate fixture metadata. | `active` is false and fixture is not returned as an ordinary valid invitation. | Required |
| `CONF-012` | Development fixtures | Inspect all active fixture records. | Every fixture is `environment: "development"` and is separated from production data. | Required |
| `CONF-013` | All fixtures | Inspect configuration shape. | Rendering does not require a named-guest array. | Required |
| `CONF-014` | All schemas | Enumerate substantive IDs. | Only `eventAttendance`, `declineAttendance`, authorized `additionalGuestAttendance`, authorized `attendanceTotals`, and `dietaryPreferences` are permitted. | Required |
| `CONF-015` | All schemas | Check for named additional-guest field. | None exists. | Required |
| `CONF-016` | All schemas | Check for named-child attendance fields. | None exists. Children are represented only through approved age totals where the default profile applies. | Required |
| `CONF-017` | All schemas | Check closed-set exclusions. | No accessibility, lodging, transportation, message-to-couple, entrée-selection, or other unapproved substantive question is rendered. | Required |
| `CONF-018` | Reduced profile | Maliciously request or inject `additionalGuestAttendance`. | Field remains unauthorized. | Required |
| `CONF-019` | Reduced profile | Maliciously request or inject `attendanceTotals`. | Field remains unauthorized. | Required |
| `CONF-020` | Default profile | Verify party-level dietary field. | One party-level dietary field exists while attending; no per-person dietary controls exist. | Required |
| `CONF-021` | All fixtures | Alter browser-visible party name in a test double while keeping backend configuration fixed. | Browser does not infer `maximumAttendance`, allowance, or profile from display text. | Required |
| `CONF-022` | Schema-example compatibility | Verify `DEV001`–`DEV004` references. | Existing form-schema example mappings remain valid: allowance 0, allowance 1, multiple allowance, reduced profile. | Required |

---

# 8. Blank-Form and Lookup Privacy-Boundary Tests

| ID | Fixture | Test | Expected result | Status |
|---|---|---|---|---|
| `BLANK-001` | New `DEV001` | Lookup invitation with no stored RSVP. | Validated form loads blank. | Required |
| `BLANK-002` | `DEV010` with fictional stored RSVP | Lookup invitation with existing response. | Validated form still loads blank. | Required |
| `BLANK-003` | `DEV010` | Inspect lookup response for `existingResponse`, `currentResponse`, `hasResponse`, or equivalent. | None is returned. | Required |
| `BLANK-004` | `DEV010` | Inspect lookup response for prior event attendance. | Not returned. | Required |
| `BLANK-005` | `DEV010` | Inspect lookup response for prior decline state. | Not returned. | Required |
| `BLANK-006` | `DEV010` | Inspect lookup response for prior additional-guest response. | Not returned. | Required |
| `BLANK-007` | `DEV010` | Inspect lookup response for prior attendance totals. | Not returned. | Required |
| `BLANK-008` | `DEV010` | Inspect lookup response for prior dietary response. | Not returned. | Required |
| `BLANK-009` | `DEV010` | Inspect lookup response for prior confirmation method. | Not returned. | Required |
| `BLANK-010` | `DEV010` | Inspect lookup response for prior email/mobile/SMS authorization. | Not returned. | Required |
| `BLANK-011` | `DEV010` | Inspect lookup response for delivery history. | Not returned. | Required |
| `BLANK-012` | Valid fixture | Inspect lookup response for `partyId`, workbook row, private notes, `active`, `environment`, or credentials. | None is returned. | Required |
| `BLANK-013` | Valid fixture | Inspect lookup response top level. | Contains only the approved lookup boundary: `invitation`, `questions`, `confirmationOptions`. | Required |
| `BLANK-014` | Valid fixture | Inspect `invitation`. | Contains only guest-facing values necessary to render the applicable blank form. | Required |
| `BLANK-015` | Valid fixture | Verify code echo behavior. | Production invitation code is not returned merely to reproduce it after validation. | Required |
| `BLANK-016` | Public route | Inspect search indexing outcome for RSVP and confirmation routes. | Personalized/transactional RSVP states are excluded from public indexing. | Required |
| `BLANK-017` | Public route | Inspect concise privacy notice. | Notice is present on entry and validated form and links to `/wedding/privacy`. | Required |
| `BLANK-018` | Invalid/unknown lookup | Inspect error content. | No name, close match, record count, spreadsheet detail, internal identifier, or backend detail is disclosed. | Required |

---

# 9. Attendance and Decline Dependency Tests

| ID | Fixture | Test | Expected result | Status |
|---|---|---|---|---|
| `ATT-001` | `DEV007` | Submit Ceremony only with `declineAttendance: false`. | Valid attending state. | Required |
| `ATT-002` | `DEV008` | Submit Reception only with `declineAttendance: false`. | Valid attending state. | Required |
| `ATT-003` | Default fixture | Submit Ceremony and Reception with `declineAttendance: false`. | Valid attending state. | Required |
| `ATT-004` | `DEV009` | Submit full decline: empty event array and `declineAttendance: true`. | Valid declining state; dependent substantive values become inapplicable as defined. | Required |
| `ATT-005` | Default fixture | Submit nonempty event selection and `declineAttendance: true`. | Rejected as contradictory; no new RSVP version. | Required |
| `ATT-006` | Initial default fixture | Submit empty event array and `declineAttendance: false`. | Rejected; initial RSVP has not established a valid attendance/decline state. | Required |
| `ATT-007` | Initial reduced fixture | Submit neither attendance nor decline. | Rejected as incomplete. | Required |
| `ATT-008` | Existing attending response | Revise to full decline using complete attendance/decline pair. | Result becomes declined; stale dependent values are cleared/removed before final validation. | Required |
| `ATT-009` | Existing declined response | Revise to attending. | Newly applicable required fields must be supplied according to profile and allowance. | Required |
| `ATT-010` | Continuing attending response | Omit both attendance and decline in a revision. | Stored attendance/decline pair remains unchanged. | Required |
| `ATT-011` | Revision | Intentionally change event selection. | Client sends the complete intended attendance/decline controlling pair; backend validates merged state. | Required |
| `ATT-012` | Full decline | Include profile-authorized dependent values in the same request. | Full-decline rule removes now-inapplicable dependent values; valid decline remains possible. | Required |
| `ATT-013` | Full decline | Include a field never authorized by the profile. | Authorization failure remains; decline does not make unauthorized fields acceptable. | Required |
| `ATT-014` | Any attending profile | Submit dietary omitted. | Attendance remains valid because dietary is optional. | Required |
| `ATT-015` | Default profile | Submit attending state without required attendance totals. | Rejected as incomplete. | Required |
| `ATT-016` | Default positive allowance | Submit attending state without required additional-guest response. | Rejected as incomplete when the field is applicable/newly applicable. | Required |
| `ATT-017` | Reduced profile | Submit valid attending state without totals/additional guest. | Valid if attendance/decline and operational confirmation are complete; no default-profile fields required. | Required |
| `ATT-018` | Full decline | Inspect successful guest-facing RSVP. | `eventAttendance` is `[]`, `declineAttendance` is `true`, dietary is `null`, and inapplicable additional-guest/totals/overall values are omitted. | Required |

---

# 10. Additional-Guest Tests

| ID | Fixture | Test | Expected result | Status |
|---|---|---|---|---|
| `ADD-001` | `DEV001` | Render form. | No `additionalGuestAttendance` control. | Required |
| `ADD-002` | `DEV001` | Maliciously submit `additionalGuestAttendance`. | `403 Forbidden` authorization failure; no storage. | Required |
| `ADD-003` | `DEV006` | Submit `"yes"`. | Represents one attending additional guest. | Required |
| `ADD-004` | `DEV006` | Submit `"no"`. | Represents zero attending additional guests. | Required |
| `ADD-005` | Allowance 1 | Submit numeric `1` instead of approved Yes/No representation. | Rejected unless later schema explicitly permits it; current contract uses `"yes"`/`"no"`. | Required |
| `ADD-006` | `DEV003` | Submit integer `0`. | Valid additional-guest response while attending. | Required |
| `ADD-007` | `DEV003` | Submit integer `3`. | Valid upper-bound response. | Required |
| `ADD-008` | `DEV003` | Submit integer `4`. | Rejected above allowance. | Required |
| `ADD-009` | `DEV003` | Submit negative number. | Rejected. | Required |
| `ADD-010` | `DEV003` | Submit fractional number. | Rejected. | Required |
| `ADD-011` | `DEV003` | Submit nonnumeric value. | Rejected. | Required |
| `ADD-012` | Positive allowance | Set effective additional-guest count greater than overall attendance. | Rejected; complete result invalid. | Required |
| `ADD-013` | Positive allowance | Change additional-guest response without adjusting totals when totals remain independently valid. | Backend does not invent an age-category change; merged totals are validated as submitted/stored. | Required |
| `ADD-014` | Positive allowance | Change additional-guest response so existing totals become incompatible. | Rejected unless guest also supplies necessary total changes; backend does not guess. | Required |
| `ADD-015` | Full decline from prior positive allowance | Decline after stored `"yes"` or positive count. | Additional-guest field is removed as inapplicable. | Required |
| `ADD-016` | Any additional-guest fixture | Inspect form. | No additional guest name field exists. | Required |

---

# 11. Attendance-Total Tests

| ID | Fixture | Test | Expected result | Status |
|---|---|---|---|---|
| `TOTAL-001` | Default attending | Supply four nonnegative whole-number categories with positive sum. | Valid if sum is within `maximumAttendance`. | Required |
| `TOTAL-002` | Default attending | Supply all four categories as zero. | Rejected because overall attendance must be at least 1 while attending. | Required |
| `TOTAL-003` | `DEV001` | Supply total of 2. | Rejected above maximum 1. | Required |
| `TOTAL-004` | `DEV005` | Supply total of 5. | Rejected above maximum 4. | Required |
| `TOTAL-005` | Default attending | Supply negative category. | Rejected. | Required |
| `TOTAL-006` | Default attending | Supply fractional category. | Rejected. | Required |
| `TOTAL-007` | Default attending | Supply nonnumeric category. | Rejected. | Required |
| `TOTAL-008` | Initial default attending | Omit one category. | Rejected as incomplete. | Required |
| `TOTAL-009` | Decline-to-attendance revision | Omit one category after totals became newly applicable. | Rejected as incomplete; all four are newly required. | Required |
| `TOTAL-010` | Continuing attending revision | Change one nested category and omit the other three. | Omitted nested categories remain unchanged; merged four-category object is validated. | Required |
| `TOTAL-011` | Continuing attending revision | Replace a prior positive category with numeric `0`. | Zero is stored as an explicit replacement, not treated as omission. | Required |
| `TOTAL-012` | Default attending | Verify server-calculated `overallAttendance`. | Equals the sum of the four authoritative categories. | Required |
| `TOTAL-013` | Default attending with additional guest | Verify relationship to additional-guest count. | Effective additional-guest count does not exceed overall attendance. | Required |
| `TOTAL-014` | Reduced profile | Submit `attendanceTotals`. | `403 Forbidden`; field is unauthorized. | Required |
| `TOTAL-015` | Full decline | Inspect resulting stored/public state. | Attendance totals and overall attendance are omitted, not retained as a synthetic all-zero object. | Required |

---

# 12. Dietary Tests

| ID | Fixture | Test | Expected result | Status |
|---|---|---|---|---|
| `DIET-001` | `DEV007` Ceremony only | Supply dietary text. | Accepted; dietary applies to Ceremony-only attendance. | Required |
| `DIET-002` | `DEV008` Reception only | Supply dietary text. | Accepted. | Required |
| `DIET-003` | Combined attendance | Supply dietary text. | Accepted. | Required |
| `DIET-004` | Any attending profile | Omit dietary text on initial response. | Valid; dietary is optional. | Required |
| `DIET-005` | Existing dietary value | Revision `replace` with new text. | Stored dietary value is replaced. | Required |
| `DIET-006` | Existing dietary value | Revision `clear`. | Stored dietary value is intentionally removed. | Required |
| `DIET-007` | Existing dietary value | Omit dietary field in revision. | Stored dietary value remains unchanged. | Required |
| `DIET-008` | Existing dietary value | Revise to full decline. | Dietary value is cleared automatically; successful guest-facing RSVP reports `null`. | Required |
| `DIET-009` | Declined result | Attempt to preserve dietary text while fully declining. | Full-decline rule clears it before final valid state is stored. | Required |
| `DIET-010` | Dietary field | Submit more than the configured maximum length of 1000 characters. | Rejected as invalid dietary text. | Required |
| `DIET-011` | Any profile | Inspect rendering. | One party-level dietary field only; no per-person dietary fields. | Required |
| `DIET-012` | Revision | Submit blank string as an attempted clear. | Blank string is not the documented clear mechanism; authorized `clear` expresses intentional removal. | Required |

---

# 13. Initial Submission Tests

| ID | Fixture | Test | Expected result | Status |
|---|---|---|---|---|
| `INIT-001` | `DEV001` | Submit complete valid initial RSVP with email confirmation. | `201 Created`; one new RSVP version; `submission.action = "initial"`. | Required |
| `INIT-002` | `DEV004` | Submit complete valid reduced-profile initial RSVP. | `201 Created`; no additional-guest or totals data created. | Required |
| `INIT-003` | Positive allowance | Omit applicable additional-guest answer. | `400 Bad Request`; no storage. | Required |
| `INIT-004` | Default attending | Omit one required attendance-total category. | `400 Bad Request`; no storage. | Required |
| `INIT-005` | Any profile | Omit operational `confirmation`. | `400 Bad Request`; no storage. | Required |
| `INIT-006` | Any profile | Omit `clientSubmissionId`. | `400 Bad Request`; no storage. | Required |
| `INIT-007` | Any profile | Use malformed `clientSubmissionId`. | `400 Bad Request`. | Required |
| `INIT-008` | Any profile | Inspect request top level. | Exactly `inviteCode`, `clientSubmissionId`, `confirmation`, and `changes` are used by the current contract. | Required |
| `INIT-009` | Any profile | Add unsupported top-level `partyId`, `maximumAttendance`, or `questionProfile`. | Request may be rejected as malformed; client must not supply authoritative private values. | Required |
| `INIT-010` | Any profile | Add `expectedVersion`. | Not permitted by current contract; request must not enter a version-conflict flow and must not produce ordinary `409` behavior. | Required |
| `INIT-011` | Any profile | Use unknown operation name. | `400 Bad Request`. | Required |
| `INIT-012` | Any profile | Use `replace` without `value`. | `400 Bad Request`. | Required |
| `INIT-013` | Any profile | Use `clear` with a replacement `value`. | `400 Bad Request`. | Required |
| `INIT-014` | Any profile | Successfully store response. | Storage completes before guest/admin delivery attempts begin. | Required |
| `INIT-015` | Any profile | Inspect success response top level. | Exactly `submission`, `invitation`, `rsvp`, `confirmation`, `revisionPolicy`. | Required |
| `INIT-016` | Any profile | Inspect success response privacy boundary. | Does not echo invite code, clientSubmissionId, email/mobile destination, SMS authorization, private version, partyId, workbook row, admin address, or provider internals. | Required |

---

# 14. Revision and Merge Tests

Use `DEV010` and the Step 11 fictional stored response for revision-heavy cases unless another fixture better isolates the behavior.

| ID | Test | Expected result | Status |
|---|---|---|---|
| `REV-001` | Lookup `DEV010` before revision. | Form loads blank; no stored answers or existence indicator returned. | Required |
| `REV-002` | Submit a valid partial substantive revision. | Backend loads current response, merges submitted changes, validates complete result, writes one new revision version, returns `200 OK`. | Required |
| `REV-003` | Omit an applicable substantive field. | Stored value remains unchanged unless a controlling full-decline rule makes it inapplicable. | Required |
| `REV-004` | Replace a stored value. | Submitted replacement becomes authoritative after successful merge/storage. | Required |
| `REV-005` | Replace a prior positive attendance-total category with `0`. | Explicit zero replaces the prior value. | Required |
| `REV-006` | Explicitly clear stored dietary text. | Dietary value is removed. | Required |
| `REV-007` | Submit only operational confirmation fields with `changes: {}`. | Valid revision if operational data is valid; new operational values replace stored ones. | Required |
| `REV-008` | Revise attendance while leaving unrelated fields omitted. | Omitted values remain unchanged unless dependency rules make them inapplicable. | Required |
| `REV-009` | Change attending response to full decline. | Attendance-dependent additional-guest/totals are removed; dietary cleared; operational confirmation still required. | Required |
| `REV-010` | Change full decline to attending default profile, allowance 0. | All four attendance-total categories must be newly supplied. | Required |
| `REV-011` | Change full decline to attending default profile, allowance 1. | All four totals plus applicable additional-guest answer must be newly supplied. | Required |
| `REV-012` | Change full decline to attending reduced profile. | No additional-guest or totals fields are required or accepted. | Required |
| `REV-013` | Submit a partial nested attendance-total replacement while continuing to attend. | Omitted nested categories remain unchanged; complete merged totals are validated. | Required |
| `REV-014` | Submit revision that produces above-maximum merged total. | Rejected; current stored RSVP remains unchanged. | Required |
| `REV-015` | Submit revision that produces contradictory attendance/decline state. | Rejected; no new version. | Required |
| `REV-016` | Change confirmation method from email to text message. | Newly entered text-message operational values replace email-channel operational values; email no longer active. | Required |
| `REV-017` | Change confirmation method from text message to email. | Newly entered email replaces mobile/SMS operational values; mobile/SMS values no longer active. | Required |
| `REV-018` | Perform revision from a second browser/device with a new `clientSubmissionId`. | Backend merges against authoritative current response at processing time; no `409` merely because another version exists. | Required |
| `REV-019` | Perform two distinct valid revisions before deadline, each with a new identifier. | Two new versions are created in order; latest successful version becomes current. | Required |
| `REV-020` | Inspect confirmation after partial revision. | Displays complete merged current RSVP, not merely changed fields. | Required |
| `REV-021` | Inspect superseded response after revision. | Remains historical only and is not counted as current attendance. | Required |
| `REV-022` | Submit revision after authoritative deadline. | `410 Gone`; no new version. | Required |

---

# 15. Confirmation-Channel Tests

| ID | Context | Test | Expected result | Status |
|---|---|---|---|---|
| `CHAN-001` | Email | Submit valid email confirmation object. | Accepted. | Required |
| `CHAN-002` | Email | Omit email address. | `400 Bad Request`. | Required |
| `CHAN-003` | Email | Supply invalid email format. | `400 Bad Request`. | Required |
| `CHAN-004` | Email | Include `mobile`. | Rejected as contradictory/unauthorized channel data. | Required |
| `CHAN-005` | Email | Include `smsAuthorization`. | Rejected as contradictory/unauthorized channel data. | Required |
| `CHAN-006` | Text | Submit valid SMS-capable number when authorization required, with `smsAuthorization: true`. | Accepted. | Required |
| `CHAN-007` | Text | Omit mobile number. | `400 Bad Request`. | Required |
| `CHAN-008` | Text | Supply invalid mobile format. | `400 Bad Request`. | Required |
| `CHAN-009` | Text | Authorization-required configuration with missing `smsAuthorization`. | `400 Bad Request`. | Required |
| `CHAN-010` | Text | Authorization-required configuration with `smsAuthorization: false`. | Rejected; required value is `true`. | Required |
| `CHAN-011` | Text | Include email in text confirmation object. | Rejected as contradictory/unauthorized channel data. | Required |
| `CHAN-012` | Text | Configuration does not require SMS authorization. | `smsAuthorization` is omitted rather than treated as a second choice. | Required |
| `CHAN-013` | Any revision | Omit operational confirmation object because prior one exists. | Rejected; every revision requires newly entered operational confirmation. | Required |
| `CHAN-014` | Any revision | Submit new valid destination. | New operational destination replaces prior stored destination after successful storage. | Required |
| `CHAN-015` | Guest confirmation | Inspect content for an initial RSVP. | Contains the complete current RSVP for the applicable profile. | Required |
| `CHAN-016` | Guest confirmation | Inspect content for a revision. | Contains the complete merged current RSVP, not only changed fields. | Required |
| `CHAN-017` | SMS confirmation | Complete current RSVP requires multiple SMS segments. | Multiple segments are permitted; content still represents the complete current guest-facing RSVP. | Required |
| `CHAN-018` | Guest confirmation | Inspect profile-inapplicable fields. | They are omitted rather than shown as zero, disabled, or `N/A`. | Required |
| `CHAN-019` | Production configuration before SMS provider gate is satisfied | Inspect lookup `confirmationOptions`. | `textMessage` is not advertised as available in production; the application does not invent provider-specific authorization language. | Required |
| `CHAN-020` | Production configuration after SMS provider gate is satisfied | Enable Text Message only after provider selection, verified required disclosure/authorization language, backend-only credentials/sender configuration, and production-flow testing. | `textMessage` may be advertised as available only after all gate conditions are satisfied. | Required |
| `CHAN-021` | SMS authorization schema | Compare provider-specific approved copy with the form schema. | Permanent operational question ID remains `smsAuthorization`; only the verified guest-facing copy/configuration changes as required. | Required |
| `CHAN-022` | Production Text Message disabled | Inspect alternative confirmation channel. | Email confirmation remains available according to centralized production configuration; disabling Text Message does not remove the approved email path. | Required |
| `CHAN-023` | Submitted RSVP mobile number | Trace permitted use after successful submission/revision. | Number is used only for the guest-requested transactional RSVP confirmation and an approved manual resend unless a future recorded decision separately authorizes another purpose. | Required |
| `CHAN-024` | Submitted RSVP mobile number | Attempt marketing, promotional, unrelated wedding messaging, or list-building use. | Prohibited; the RSVP mobile number is not repurposed. | Required |

---

# 16. API Error and Authorization Tests

| ID | Test | Expected result | Status |
|---|---|---|---|
| `ERR-001` | Malformed submission body. | `400 Bad Request`. | Required |
| `ERR-002` | Missing required top-level property. | `400 Bad Request`. | Required |
| `ERR-003` | Unknown top-level property. | May be rejected as `400 Bad Request`; client should not send it. | Required |
| `ERR-004` | Unknown substantive question ID. | `403 Forbidden`. | Required |
| `ERR-005` | Submit `additionalGuestAttendance` for allowance 0. | `403 Forbidden`. | Required |
| `ERR-006` | Submit `additionalGuestAttendance` for reduced profile. | `403 Forbidden`. | Required |
| `ERR-007` | Submit `attendanceTotals` for reduced profile. | `403 Forbidden`. | Required |
| `ERR-008` | Use `clear` on a field whose schema does not authorize client clearing. | `403 Forbidden`. | Required |
| `ERR-009` | Authorized field with invalid numeric content. | `400 Bad Request`. | Required |
| `ERR-010` | Contradictory attendance/decline values. | `400 Bad Request`. | Required |
| `ERR-011` | Reuse same identifier with materially different request. | `400 Bad Request`. | Required |
| `ERR-012` | New logical submission/revision at or after deadline. | `410 Gone`. | Required |
| `ERR-013` | Preload or exercise either finalized submission limit, then issue the next applicable request. | Exceeding 6 requests per 15-minute rolling window for the client IP or 6 per 15-minute rolling window for the normalized invitation code returns guest-safe `429 Too Many Requests`; no RSVP version or delivery attempt is created. | Required |
| `ERR-014` | Known core failure before successful storage. | `503 Service Unavailable`; Service Unavailable state; no claim of storage. | Required |
| `ERR-015` | Browser receives no definitive response. | Do not synthesize `503`; use Submission Uncertain. | Required |
| `ERR-016` | Existing newer private version on server, no malformed request. | No ordinary `409`; current contract does not use `expectedVersion` concurrency. | Required |
| `ERR-017` | Validation error on partial revision. | Error response does not reveal omitted stored values. | Required |
| `ERR-018` | Authorization error. | Guest-facing response does not disclose private allowance/profile/configuration details merely to explain the failure. | Required |

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

The interface must render one top-level RSVP state at a time. Countdown, profile, allowance, delivery-warning category, and responsive layout are variants within these states.

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
| `STATE-009` | 5 — Validated Blank Form | Switch among fixture profile/allowance variants. | Correct variant renders without creating extra top-level states/routes. | Required |
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
| `PAGE-006` | Inspect profile-inapplicable fields. | Omitted, not fabricated as zero/blank/`N/A`. | Required |
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
| `A11Y-004` | Inspect four attendance-total inputs. | Group has an accessible legend/label and each category is identifiable. | Required |
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
| `PRIV-054` | Inspect submitting party's temporary on-screen confirmation. | Applicable party-level dietary/allergy response may appear as part of that party's complete current RSVP. | Required |
| `PRIV-055` | Inspect submitting party's selected email/text confirmation. | Applicable dietary/allergy response may appear as part of that party's complete current RSVP. | Required |
| `PRIV-056` | Inspect protected administrative confirmation. | Applicable dietary/allergy response may appear because the protected administrative message contains the complete current RSVP. | Required |
| `PRIV-057` | Inspect analytics, public pages/metadata, ordinary logs, unrelated admin output, and another invited party's data. | Dietary/allergy text is absent from all prohibited surfaces. | Required |
| `PRIV-058` | Production SMS gate not yet satisfied. | Text Message confirmation remains disabled; no invented provider-specific disclosure is shown. | Required |
| `PRIV-059` | Production SMS gate satisfied. | Provider is selected; required sender/consent/carrier-rate/opt-out/help/other applicable wording is verified; credentials remain backend-only; production flow is tested before Text Message is enabled. | Required |
| `PRIV-060` | Inspect public security/privacy copy. | No claim of “completely secure,” “100% secure,” “unhackable,” “risk-free,” or equivalent absolute guarantee appears. | Required |
| `PRIV-061` | Production traffic test. | RSVP entry, lookup, submission, and confirmation use HTTPS. | Required |
| `PRIV-062` | Attempt ordinary HTTP navigation in production. | Redirects to HTTPS before RSVP information can be submitted. | Required |
| `PRIV-063` | Active RSVP-data lifecycle review by July 30, 2027. | Current responses, superseded versions, dietary/allergy text, guest confirmation destinations, SMS authorization, `clientSubmissionId`, delivery-attempt history, transaction timestamps retained only as history, and active code-to-response mappings are deleted or irreversibly de-identified unless a documented exception applies. | Required |
| `PRIV-064` | Retention exception review after July 30, 2027. | Only the minimum record needed for a concrete unresolved correction, dispute, delivery investigation, or other documented administrative need remains; access is restricted and the record is deleted when the need ends. | Required |
| `PRIV-065` | Protected backup lifecycle review by August 29, 2027. | Backups containing retired RSVP-operational data have expired through protected backup rotation. | Required |
| `PRIV-066` | Create backups after active-data retirement. | New backups do not unnecessarily reintroduce RSVP-operational data already deleted or irreversibly de-identified from the active system. | Required |
| `PRIV-067` | Inspect post-retirement aggregate records. | Only non-identifying aggregates that cannot reasonably reconstruct an invited party's RSVP may be retained under the RSVP-system rule. | Required |
| `PRIV-068` | Inspect retained private `Invitees List` after RSVP-system retirement. | It may remain a private personal planning/address record, but the active public RSVP application no longer depends on retired RSVP response history and the list is not exposed publicly. | Required |
| `PRIV-069` | Enumerate public RSVP endpoints after Step 14. | Public endpoint inventory remains health, lookup, and submit only; no guest directory, code recovery, saved-RSVP, history, admin, or confirmation-recovery endpoint was added. | Required |
| `PRIV-070` | Inspect `/wedding/not-found` and unmatched wedding routes. | They are excluded from indexing and expose no technical/internal/private detail. | Required |
| `PRIV-071` | Compare no-index/no-store behavior with backend authorization. | Search/caching controls supplement rather than replace backend invitation validation, environment authorization, and response minimization. | Required |

---

# 24. Step 11 Archetype Coverage Matrix

The preliminary suite must exercise every Step 11 archetype or guard fixture.

| Archetype | Fixture | Minimum cases that must exercise it |
|---|---|---|
| A — Singular, no additional guest | `DEV001` | `CONF-001`, `CONF-004`, `CONF-008`, `ADD-001`, `ADD-002`, `TOTAL-003`, `INIT-001` |
| B — Plural household, no additional guest | `DEV005` | `CONF-002`, `CONF-009`, `CONF-016`, `TOTAL-004` |
| C — Singular, one additional guest | `DEV006` | `CONF-005`, `ADD-003`, `ADD-004`, `ADD-012` |
| D — Plural household, one additional guest | `DEV002` | `CONF-005`, `ADD-003`, `TOTAL-013`, delivery/confirmation cases |
| E — Ceremony only | `DEV007` | `ATT-001`, `DIET-001`, `STATE-009` |
| F — Reception only | `DEV008` | `ATT-002`, `DIET-002` |
| G — Entire party declines | `DEV009` | `ATT-004`, `ATT-012`, `DIET-008`, `ADD-015`, `TOTAL-015` |
| H — Existing-response revision | `DEV010` | `BLANK-002`–`BLANK-011`, `REV-001`–`REV-022` as applicable |
| I — Multiple additional guests | `DEV003` | `CONF-006`, `CONF-010`, `ADD-006`–`ADD-014` |
| J — Reduced profile | `DEV004` | `CONF-007`, `CONF-018`, `CONF-019`, `TOTAL-014`, `INIT-002`, `ATT-017` |
| Disabled guard fixture | `DEV999` | `CODE-014`, `CONF-011`, `PRIV-010` |

---

# 25. Cross-Document Acceptance Checks

Before treating Step 12 as complete, verify that the test catalog itself satisfies the following documentation checks.

| ID | Check | Expected result |
|---|---|---|
| `DOC-001` | Compare test cases with current `rsvp-system-design.md`. | No test resurrects a superseded behavior such as personalized code-bearing URLs or Reception-only dietary applicability. |
| `DOC-002` | Compare test cases with current `rsvp-api-contract.md`. | Status codes, request envelope, success envelope, idempotency, and no-`expectedVersion` behavior match the current contract. |
| `DOC-003` | Compare with `rsvp-example-form-schemas.json`. | Question IDs, display/dependency rules, numeric bounds, and clear/replace semantics match. |
| `DOC-004` | Compare with `rsvp-example-configurations.json`. | Fixture codes, profiles, allowances, maximums, and active flags match Step 11. |
| `DOC-005` | Compare with `wireframes.md` and `page-outlines.md`. | All thirteen interface states, the finalized State 12 copy/actions, and associated accessibility behaviors are represented consistently. |
| `DOC-006` | Compare with `sitemap.md` and `route-inventory.md`. | Canonical browser routes, refresh-without-temporary-state fallback, non-indexing, and no-code-in-URL behavior are represented. |
| `DOC-007` | Compare with `requirements.md` and `decisions.md`. | Final requirements/decisions control over superseded entries is preserved. |
| `DOC-008` | Search this file for real production invitation codes or guest identities. | None present. |
| `DOC-009` | Search for an active expected-version conflict test. | None exists; current tests instead verify that `expectedVersion` is not part of the contract and ordinary `409` is unused. |
| `DOC-010` | Search for Boolean-only plus-one assumptions. | None; zero/one/multiple integer allowance model is used. |
| `DOC-011` | Compare confirmation-refresh tests with current `rsvp-system-design.md`, `rsvp-api-contract.md`, `page-outlines.md`, and `wireframes.md`. | All five documents use the same temporary-state eligibility rule, State 12 trigger, final fallback meaning, actions, and prohibited automatic-recovery behavior. |
| `DOC-012` | Search for a required confirmation token/recovery endpoint. | None exists; Step 13 explicitly requires no such mechanism for the initial implementation. |
| `DOC-013` | Search for automatic lookup or submission replay from State 12. | None exists; State 12 is presentation/recovery guidance only. |
| `DOC-014` | Search for an assumption that every browser refresh must force State 12. | None exists; usable temporary successful state continues to render State 9, 10, or 11. |
| `DOC-015` | Compare Step 14 tests with approved `decisions.md`. | Cache, logging, analytics, rate-limit, credential, provider-gate, retention, HTTPS, and security-wording tests match the approved Step 14 decision set. |
| `DOC-016` | Compare Step 14 tests with current `rsvp-system-design.md`. | Privacy/security architecture, trusted-proxy behavior, data retirement, and confirmation-state boundaries match. |
| `DOC-017` | Compare Step 14 tests with current `rsvp-api-contract.md`. | `Cache-Control`, exact rate limits, `429` semantics, credential boundaries, SMS gate, logging exclusions, and endpoint inventory match the final Phase 3 contract. |
| `DOC-018` | Search for any remaining active Step 14 future/provisional/deferred test requirement. | None remains; all finalized Step 14 obligations are represented as Required tests. |
| `DOC-019` | Search for a test that requires provider-specific SMS copy before provider selection. | None exists; tests require the production enablement gate and verified applicable copy before Text Message is enabled. |
| `DOC-020` | Search for a retention rule inconsistent with July 30 / August 29, 2027. | None exists. |



---

# 26. Phase 3 Step 14 Privacy/Security Traceability

Phase 3 Step 14 resolves every privacy/security subject that the Step 13 version of this catalog intentionally deferred.

| Former deferred subject | Finalized Step 14 coverage |
|---|---|
| Exact personalized-response `Cache-Control` | `PRIV-021`–`PRIV-029` |
| Exact ordinary-log redaction rules | `PRIV-031`–`PRIV-037` |
| Exact lookup rate-limit threshold/window | `CODE-025`, `PRIV-038`–`PRIV-039` |
| Exact submission rate-limit threshold/window | `ERR-013`, `PRIV-040`–`PRIV-042` |
| `Retry-After` handling | `PRIV-043` |
| Provider-specific SMS disclosure handling | `CHAN-019`–`CHAN-024`, `PRIV-058`–`PRIV-059` |
| Final RSVP-data retention standard | `PRIV-063`–`PRIV-068` |
| Credential-storage/deployment checks | `PRIV-044`–`PRIV-052`, `PRIV-061`–`PRIV-062` |
| Personalized-response browser/cache behavior | `PRIV-021`–`PRIV-030` |
| Server-log tests for invitation codes, answers, and confirmation destinations | `PRIV-031`–`PRIV-037` |

No active Step 14 future/deferred test identifier remains after Step 14.

---

# 27. Phase 3 Step 12 Completion Check

Phase 3 Step 12 is complete when this document has been reviewed against the current project files and the preliminary catalog includes, at minimum:

- Accepted and rejected invitation-code normalization.
- Manual-entry and POST-body lookup.
- Neutral malformed/unknown/inactive handling.
- Lookup and submission rate-limit outcomes; at Step 12 the exact thresholds were intentionally deferred, and Step 14 now finalizes/tests them in Sections 16, 23, and 26.
- Backend-unavailable and submission-uncertain distinction.
- Singular and plural configuration wording.
- Zero, one, and multiple additional-guest allowances.
- Default and reduced question profiles.
- Active and inactive development fixtures.
- Initial and revision blank-form behavior.
- No stored-response existence indicator.
- Omission, replacement, explicit zero, and explicit clear semantics.
- Attendance-to-decline and decline-to-attendance transitions.
- Newly applicable fields after decline-to-attendance.
- Ceremony-only, Reception-only, combined attendance, and full decline.
- Contradictory attendance/decline rejection.
- Maximum-attendance and attendance-total arithmetic.
- Additional-guest bounds and relationship to complete attendance totals.
- Dietary applicability for all attending states and clearing on decline.
- Email and text-message confirmation dependencies.
- Initial storage and revision storage.
- Current-response replacement and version history.
- Double-click, duplicate request, idempotent replay, materially changed reused identifier, and safe retry.
- No active `expectedVersion`/ordinary `409` concurrency flow.
- Independent guest and administrative delivery outcomes.
- Manual resend without RSVP mutation.
- All thirteen interface states.
- Confirmation route and the Step 12 high-level refresh-fallback behavior that Phase 3 Step 13 has now finalized in Sections 19–20.
- Before-countdown, countdown-start, cross-time-zone/device-clock, immediately-before-deadline, at-deadline, and after-deadline cases.
- Labels, legends/grouping, keyboard operation, focus, validation summaries, status announcements, text enlargement, and reduced motion.
- The privacy boundaries approved at Step 12, now expanded by the finalized Step 14 cache, analytics, logging, rate-limit, credential, SMS-gate, HTTPS, and retention tests.
- All Step 11 development archetypes and the disabled `DEV999` guard fixture.
- Explicit identification, at the time Step 12 was completed, of Step 13 confirmation-refresh details and Step 14 privacy/security details rather than inventing later-step requirements prematurely.

Step 12 established this file as the controlling preliminary RSVP test catalog. Phase 3 Step 13 finalized the confirmation-refresh portions, and Phase 3 Step 14 now finalizes the remaining privacy/security portions.

---

# 28. Phase 3 Step 13 Completion Check

Phase 3 Step 13 is complete in this test catalog when all of the following are true:

- The ordinary successful confirmation source is the limited successful `POST /wedding/api/rsvp/submit` response passed into temporary React navigation/application state.
- States 9, 10, and 11 require a structurally usable successful response with `submission.recorded: true`.
- State selection uses `submission.action` and `confirmation.deliveryWarning` rather than assuming HTTP `200` means revision.
- Refresh, direct navigation, bookmark/new-tab access, and history traversal do not themselves decide the state; usable successful state continues to render State 9, 10, or 11.
- Missing or unusable successful state renders State 12 — Confirmation Refresh Fallback.
- State 12 uses the finalized heading `Confirmation Summary No Longer Available`.
- State 12 communicates that the temporary on-screen summary is unavailable and that an RSVP may already have been recorded without asserting success or failure.
- State 12 directs the guest to check the selected email or text-message confirmation.
- State 12 explicitly discourages resubmitting the same response solely because the on-screen summary disappeared.
- State 12 provides deliberate-revision guidance through `Return to RSVP` and assistance through `Contact for Help` / `RSVPhelp@loreweavercreations.com`.
- `Return to RSVP` begins a new ordinary manual-entry interaction and remains subject to the backend-authoritative deadline.
- State 12 performs no automatic lookup, automatic submission replay, new `clientSubmissionId` generation, silent identifier reuse, or undocumented saved-RSVP retrieval.
- State 12 remains distinct from State 8 — Submission Uncertain; safe idempotent replay belongs to the explicit State 8 recovery workflow.
- The initial implementation requires no short-lived confirmation token, public confirmation-recovery endpoint, public saved-RSVP endpoint, code-bearing confirmation URL, or persistent browser storage solely to make the summary survive refresh.
- No sensitive summary information is moved into the URL.
- State 12 focus/announcement, keyboard/touch actions, text-based meaning, sticky-header focus visibility, reduced-motion handling, and no-timed-redirect behavior are covered by required tests.
- `rsvp-system-design.md`, `rsvp-api-contract.md`, `page-outlines.md`, `wireframes.md`, and this test catalog describe the same finalized Step 13 behavior.
- At the time Step 13 was completed, Step 14 privacy/security details remained intentionally deferred; they are now finalized in Sections 23 and 26.

With these conditions documented, the Step 13 confirmation-refresh portion remains synchronized and complete. Phase 3 Step 14 now supplies the finalized privacy/security requirements that follow.

---

# 29. Phase 3 Step 14 Completion Check

Phase 3 Step 14 is complete in this test catalog when all of the following are true:

- Invitation codes are tested as limited access tokens rather than passwords.
- No public guest directory, code-recovery search, fuzzy/close-match suggestion, valid-code list, code-bearing personalized route, saved-RSVP endpoint, RSVP-history endpoint, administrative endpoint, or confirmation-recovery endpoint is required or exposed.
- Lookup and submission continue to carry invitation codes only in request bodies.
- Every lookup and submission response, successful or unsuccessful, is tested for `Cache-Control: no-store, max-age=0`.
- Production RSVP and confirmation browser responses are tested for the same no-store policy.
- Static non-personalized versioned assets remain eligible for ordinary cache optimization.
- Temporary successful confirmation state is not intentionally promoted to persistent browser storage solely to survive refresh.
- RSVP/confirmation/not-found transactional routes are tested for non-indexing while the public Privacy page remains indexable.
- Personalized values are tested for exclusion from metadata and analytics.
- Analytics failure/blocking is tested to ensure it cannot prevent RSVP operation.
- Ordinary logs are tested to exclude raw/normalized invitation codes, RSVP request/response bodies, answers, dietary information, confirmation destinations, `clientSubmissionId`, workbook content, and secrets.
- The restricted diagnostic-correlation exception is tested as pseudonymous, explicitly enabled, access-restricted, minimum-field, time-limited, and retired after use.
- Lookup is tested against the finalized 10-requests-per-15-minute rolling window per-client-IP limit.
- Submission is tested against both finalized 6-requests-per-15-minute rolling window limits: per client IP and per normalized invitation code.
- Rate-limited submissions are tested to ensure they create no RSVP version and start no confirmation delivery attempt.
- `Retry-After` is tested when supported by the selected rate-limiting implementation.
- Trusted-proxy handling and spoofed forwarded-address rejection are tested.
- Google, email, SMS, sender, and protected administrative-recipient credentials are tested for backend-only storage/exposure boundaries.
- Private administrative workbook permissions and browser isolation are tested.
- Production invitation data, development fixtures, and environment credentials are tested for separation.
- Guest-safe error responses are tested across applicable error families without infrastructure, provider, credential, workbook, close-match, or environment-enumeration disclosure.
- Dietary/allergy information is tested for presence only on the submitting party's own confirmation surfaces, the protected administrative confirmation, and authorized private records.
- Dietary/allergy information is tested for absence from analytics, public pages/metadata, ordinary logs, unrelated administrative output, and other parties' data.
- RSVP mobile numbers are tested as transactional-only.
- Text Message confirmation is tested as disabled until provider selection, applicable disclosure/authorization review, backend-only credentials/sender configuration, and production-flow testing satisfy the approved production gate.
- The permanent `smsAuthorization` question identifier remains stable.
- Public privacy/security copy is tested to contain no unsupported absolute-security guarantee.
- Production RSVP traffic is tested over HTTPS and ordinary HTTP redirects before private RSVP information can be submitted.
- Active RSVP-operational data is scheduled/tested for retirement by July 30, 2027, subject only to a minimum documented exception.
- Protected backups containing retired RSVP-operational data are scheduled/tested to expire by August 29, 2027.
- Post-retirement aggregates are tested to remain non-identifying.
- A separately retained private `Invitees List` is tested not to keep the active public RSVP application dependent on retired response history.
- Step 14 creates no new public RSVP API endpoint.
- `decisions.md`, `rsvp-system-design.md`, `rsvp-api-contract.md`, and this test catalog describe the same finalized Step 14 rules.
- No active Phase 3 future, provisional, or deferred RSVP test requirement remains.

With these conditions documented, the RSVP test catalog is synchronized through **Phase 3 Step 14** and **Phase 3 — Design the RSVP System is complete**.

The test catalog remains preliminary in the sense that application implementation and test execution occur in later project phases; the expected behavior itself is finalized through Phase 3.
