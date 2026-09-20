# RSVP API Contract

**Project:** Loreweaver Creations Wedding Website
**Phase:** Phase 3 — Design the RSVP System
**Current completion:** Phase 3 through Step 14, revised September 20, 2026 to conform to the authoritative `Invitees List` spreadsheet and its bottom-row RSVP-display instructions
**Status:** Final Phase 3 RSVP API contract, spreadsheet-authoritative revision
**Phase 3 status:** Complete
**Last updated:** September 20, 2026

---

## 1. Purpose and Status

This document defines the public backend API contract for the Loreweaver Creations wedding RSVP system.

The contract preserves the established Phase 3 architecture:

* One reusable RSVP application.
* Manual invitation-code entry.
* Request-body-only invitation-code transport.
* A private backend invitation configuration.
* A limited blank-form lookup response.
* A four-property submission request envelope.
* Partial revision semantics.
* Backend-authoritative validation and dependency processing.
* Versioned storage with one authoritative current RSVP.
* Idempotent safe retry using `clientSubmissionId`.
* Storage before confirmation delivery.
* Independent guest and administrative delivery outcomes.
* A five-property successful submission response.
* No public saved-RSVP retrieval endpoint.
* No code-bearing personalized route.
* No client-supplied `expectedVersion` field and no ordinary `409 Conflict` flow.
* Backend-enforced deadline, rate limits, no-store behavior, HTTPS, logging boundaries, production/development separation, and retention rules.

The September 20, 2026 revision changes the substantive RSVP data model so that the API follows the authoritative private `Invitees List` spreadsheet and its bottom-row display instructions.

The active production API model therefore uses:

* One spreadsheet-authoritative substantive form structure rather than separate `default` and `reduced-attendance-dietary` production profiles.
* One coordinated attendance state represented by Ceremony, Reception, both, or full decline.
* Zero or more named-invitee `Plus1` allocations derived only from the authoritative source.
* One Yes/No response for each authorized named-invitee `Plus1` allocation.
* Four age-category attendance totals.
* Backend-derived overall attendance.
* Reception-only attendee-detail records containing attendee name and optional dietary/allergy information.

The former aggregate `additionalGuestAllowance`, aggregate `additionalGuestAttendance`, party-level `dietaryPreferences`, and production `questionProfile` architecture is no longer part of the active API contract.

This contract must remain consistent with:

* `docs/requirements.md`
* `docs/decisions.md`
* `docs/content-inventory.md`
* `docs/link-inventory.md`
* `docs/sitemap.md`
* `docs/route-inventory.md`
* `docs/page-outlines.md`
* `docs/wireframes.md`
* `docs/rsvp-system-design.md`
* `docs/rsvp-example-configurations.json`
* `docs/rsvp-example-form-schemas.json`
* `docs/rsvp-test-cases.md`

Where a later approved project decision supersedes a detail recorded here, that later decision controls and this file must be revised before implementation continues on the affected contract surface.

---

## 2. Governing API Principles

### 2.1 API Route Prefix

All wedding RSVP API endpoints are beneath:

`/wedding/api/`

The initial invitation-launch API contains only:

* `GET /wedding/api/health`
* `POST /wedding/api/rsvp/lookup`
* `POST /wedding/api/rsvp/submit`

No public endpoint is defined for:

* Guest-directory search.
* Invitation-code recovery.
* Fuzzy or close-match code lookup.
* Saved-RSVP retrieval.
* RSVP history retrieval.
* Confirmation recovery.
* Invitation-specific guest URLs.
* Public administrative access.

### 2.2 Browser Routes and API Routes Are Separate

The canonical browser RSVP route remains:

`/wedding/rsvp/`

The canonical confirmation route remains:

`/wedding/rsvp/confirmation`

API operations occur behind those browser states. API endpoints are not guest-facing page destinations and do not create invitation-specific browser routes.

### 2.3 No Code-Bearing Lookup URL

Invitation codes are transmitted only in POST request bodies.

They must not be placed in:

* Browser paths.
* Query strings.
* URL fragments.
* Canonical metadata.
* Analytics events.
* Referrer-visible URLs.

### 2.4 Backend Authority

React may normalize and validate for usability, but Express is authoritative.

For every lookup and submission, the backend independently:

* Normalizes the invitation code.
* Determines whether one active invitation is authorized in the current environment.
* Loads the private invitation configuration.
* Validates every submitted substantive field and allocation identifier.
* Applies the authoritative deadline.
* Determines initial versus revision status.
* Loads current stored state when needed.
* Applies revision merge semantics.
* Applies dependency clearing.
* Validates the complete resulting RSVP.
* Enforces idempotency and rate limits.
* Performs storage before delivery.

Browser visibility or client-side form constraints never substitute for server authorization.

### 2.5 Blank Lookup Responses

A successful lookup returns only the information needed to render a blank personalized form.

Lookup never returns:

* Previously stored attendance.
* Previously stored named-`Plus1` responses.
* Previously stored age totals.
* Previously stored Reception attendee names.
* Previously stored dietary/allergy text.
* Previously stored confirmation method or destination.
* Previously stored SMS authorization.
* Delivery history.
* RSVP version history.
* An `existingResponse`, `hasResponse`, `currentResponse`, or equivalent indicator.

The browser therefore cannot determine from lookup alone whether the next valid submission will be initial or revision.

### 2.6 Server-Side Revalidation on Submission

Every submission is independently re-authorized against the private invitation record.

A valid lookup does not create a reusable authorization token that bypasses submission validation.

### 2.7 Storage Before Confirmation Delivery

The authoritative order is:

1. Validate and authorize.
2. Merge with current response when revising.
3. Apply dependencies and final validation.
4. Persist the RSVP/version atomically enough to establish the authoritative current response.
5. Attempt guest confirmation delivery.
6. Attempt protected administrative email delivery independently.
7. Record delivery outcomes.
8. Return the guest-safe successful response.

A delivery failure does not roll back a successfully stored RSVP.

### 2.8 Dynamic Invitation Records

Application logic must not depend on a permanently fixed production invitation count.

The current authoritative source audit identifies 57 active assigned production invitations, but that count is validation context, not renderer logic.

---

## 3. Endpoint Inventory

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/wedding/api/health` | Minimal service-health proof. |
| `POST` | `/wedding/api/rsvp/lookup` | Validate an invitation code and return the limited blank-form configuration. |
| `POST` | `/wedding/api/rsvp/submit` | Store an initial RSVP, store a revision, or resolve an idempotent retry. |

No additional public RSVP endpoint is created by the current contract.

---

# 4. Health Check

## 4.1 Endpoint

`GET /wedding/api/health`

## 4.2 Purpose

The health endpoint proves that the Express service is reachable.

It must not:

* Read or expose production invitation records.
* Return workbook identifiers.
* Return secrets or credential paths.
* Return provider configuration.
* Return RSVP data.
* Perform a guest lookup.

## 4.3 Successful Response

A healthy service may return:

```json
{
  "status": "ok",
  "application": "Norstein-Dashiell Wedding Website"
}
```

with:

`200 OK`

## 4.4 Health-Check Boundary

A successful health check does not prove that Google Sheets, email delivery, SMS delivery, or every RSVP dependency is available. It proves only the service-health boundary implemented for this endpoint.

---

# 5. Invitation Lookup

## 5.1 Endpoint

`POST /wedding/api/rsvp/lookup`

## 5.2 Purpose

The lookup endpoint:

1. Accepts the manually entered invitation code.
2. Normalizes it using the approved canonical algorithm.
3. Verifies one active invitation for the current environment.
4. Enforces the authoritative RSVP deadline.
5. Loads the private spreadsheet-derived invitation configuration.
6. Returns only the limited guest-facing configuration needed to render a blank RSVP form.

It does not retrieve saved RSVP answers for display.

## 5.3 Request

The request body contains exactly:

```json
{
  "inviteCode": "DEV-006"
}
```

The example is fictional development-only data.

Rules:

* `inviteCode` is required.
* The backend converts the received value to a string before canonical normalization.
* No additional guest identity, party identifier, or saved-response identifier is accepted in the lookup request.

## 5.4 Invitation-Code Normalization

The backend performs the approved sequence:

1. Convert to string.
2. Trim leading/trailing whitespace.
3. Remove internal ordinary ASCII spaces.
4. Remove ASCII hyphen-minus characters.
5. Uppercase.
6. Reject any remaining character outside `A-Z` and `0-9`.
7. Require exactly six characters.
8. Use the six-character uppercase value as the canonical lookup key.
9. Use `XXX-XXX` only for approved display.

No fuzzy matching, close-match suggestion, or automatic character substitution is permitted.

## 5.5 Successful Lookup and Limited Blank-Form Response

A successful lookup returns:

`200 OK`

A `200` response means:

* The submitted code normalized successfully.
* One active invitation is authorized for the current environment.
* The RSVP deadline remains open.
* The private invitation configuration was validated.
* The response contains only the guest-facing values and question definitions needed to render the authorized blank form.

The response has exactly three top-level properties:

1. `invitation`
2. `questions`
3. `confirmationOptions`

### 5.5.1 `invitation`

The `invitation` object may contain only guest-facing invitation context required by the form:

* `partyDisplayName`
* `greeting`
* `wordingMode`
* `maximumAttendance`
* `additionalGuestAllocations`
* `deadline`
* `timeZone`

`wordingMode` is explicitly `singular` or `plural` and is never inferred from guest names in the browser.

`maximumAttendance` is the positive whole-number limit derived from the authoritative spreadsheet's `Total Potential Attendees` value.

`additionalGuestAllocations` is an array containing only the authorized named-invitee `Plus1` prompt definitions for the validated invitation. A party with no `Plus1` allocation receives an empty array.

Each allocation object contains exactly:

* `id` — a stable non-name identifier used by the API.
* `prompt` — the reviewed guest-facing question, such as `Will Example Guest be accompanied by a +1?`.

The allocation identifier must not itself encode a real guest name.

The browser does not receive:

* Canonical production invitation code.
* Raw source spreadsheet row.
* `partyId` or equivalent internal party identifier.
* `active`.
* `environment`.
* Private administrative notes.
* Unrelated invited-party names.
* A production `questionProfile`.
* An aggregate `additionalGuestAllowance`.

### 5.5.2 `questions`

`questions` contains the reusable question/schema objects required by the spreadsheet-authoritative form.

Permanent substantive regions are:

* `eventAttendance`
* `additionalGuestResponses`
* `attendanceTotals`
* `receptionAttendeeDetails`

Permanent operational question IDs remain:

* `confirmationMethod`
* `confirmationEmail`
* `confirmationMobile`
* `smsAuthorization`

The exact reusable object structure is governed by `docs/rsvp-example-form-schemas.json`.

Returned schema data may include, as applicable:

* `id`
* `scope`
* `type`
* `label`
* `labelVariants`
* `options`
* `displayCondition`
* `validation`
* `patchBehavior`
* `clearBehavior`
* `helpText`
* Repeatable-region metadata.

The client may use those values for rendering and usability validation, but the backend remains authoritative.

### 5.5.3 Spreadsheet-Authoritative Rendering Rules

The lookup response must support these browser behaviors:

**Attendance**

The visible substantive attendance control uses the invitation's singular/plural wording and represents:

* Ceremony.
* Reception.
* Regretfully unable to attend.

Ceremony and Reception may both be selected. Full decline is mutually exclusive with both attending options.

**Named-invitee `Plus1` questions**

* No Column E `Plus1` allocation: no Plus 1 question exists.
* One allocation: one named-invitee Yes/No question exists.
* Multiple allocations: one separate named-invitee Yes/No question exists for each authorized allocation.
* The browser must never synthesize another `Plus1` question from party size or maximum attendance.

**Attendance totals**

The form includes four numerical age-category controls:

* `adults21Plus`
* `youngAdults18To20`
* `children3To17`
* `childrenUnder3`

The browser may constrain each dial's maximum according to the remaining invitation capacity after the other three current values are considered. The backend enforces the equivalent complete-sum rule.

**Reception attendee details**

When Reception is selected, the browser renders exactly one attendee-detail pair for each person represented by the current overall attendance total.

Each pair contains:

* Required attendee name, maximum 100 characters.
* Optional dietary/allergy response, maximum 1000 characters.

Ceremony-only attendance and full decline do not render Reception attendee-detail fields.

### 5.5.4 `confirmationOptions`

`confirmationOptions` uses:

```json
{
  "email": true,
  "textMessage": false,
  "smsAuthorizationRequired": false
}
```

Runtime values come from centralized backend configuration.

Production may expose `textMessage: true` only after the finalized SMS-provider gate has been satisfied. Until then, Text Message confirmation remains disabled.

### 5.5.5 Normative Synthetic Lookup Example

The following example is fictional and contains no production code or real guest identity:

```json
{
  "invitation": {
    "partyDisplayName": "The Example Household",
    "greeting": "Welcome, Example Household!",
    "wordingMode": "plural",
    "maximumAttendance": 4,
    "additionalGuestAllocations": [
      {
        "id": "plus1-a",
        "prompt": "Will Example Guest be accompanied by a +1?"
      }
    ],
    "deadline": "2027-03-01T23:59:00-05:00",
    "timeZone": "America/New_York"
  },
  "questions": [
    {
      "id": "eventAttendance",
      "scope": "party",
      "type": "checkbox-group",
      "labelVariants": {
        "singular": "I will be attending (check all that apply):",
        "plural": "We will be attending (check all that apply):"
      },
      "options": [
        { "value": "ceremony", "label": "Ceremony" },
        { "value": "reception", "label": "Reception" },
        {
          "value": "decline",
          "labelVariants": {
            "singular": "Regretfully, I am unable to attend.",
            "plural": "Regretfully, we are unable to attend."
          }
        }
      ]
    },
    {
      "id": "additionalGuestResponses",
      "scope": "authorized-allocation-list",
      "type": "repeated-radio",
      "allowedValues": ["yes", "no"]
    },
    {
      "id": "attendanceTotals",
      "scope": "party",
      "type": "number-group",
      "fields": [
        "adults21Plus",
        "youngAdults18To20",
        "children3To17",
        "childrenUnder3"
      ]
    },
    {
      "id": "receptionAttendeeDetails",
      "scope": "repeated-attendee",
      "type": "repeatable-group",
      "fields": [
        {
          "id": "attendeeName",
          "type": "text",
          "required": true,
          "maximumLength": 100
        },
        {
          "id": "dietaryPreferences",
          "type": "textarea",
          "required": false,
          "maximumLength": 1000
        }
      ]
    },
    {
      "id": "confirmationMethod",
      "scope": "operational",
      "type": "radio",
      "optionsFrom": "confirmationOptions"
    },
    {
      "id": "confirmationEmail",
      "scope": "operational",
      "type": "email",
      "displayWhen": "confirmationMethod=email"
    },
    {
      "id": "confirmationMobile",
      "scope": "operational",
      "type": "tel",
      "displayWhen": "confirmationMethod=textMessage"
    },
    {
      "id": "smsAuthorization",
      "scope": "operational",
      "type": "checkbox",
      "displayWhen": "confirmationOptions.smsAuthorizationRequired=true"
    }
  ],
  "confirmationOptions": {
    "email": true,
    "textMessage": false,
    "smsAuthorizationRequired": false
  }
}
```

The finalized JSON schema examples may contain additional rendering metadata, but they must not contradict this contract.

### 5.5.6 Blank-Form Invariant

A successful lookup must not reveal whether a stored response exists.

The endpoint must not return:

* Prior substantive values.
* Prior confirmation values.
* Current RSVP version.
* Stored timestamps.
* Delivery outcomes.
* An initial/revision prediction.

## 5.6 Lookup Status Codes

| Status | Meaning |
|---|---|
| `200 OK` | Valid active invitation; limited blank-form response returned. |
| `400 Bad Request` | Invitation-code input is malformed under the approved normalization rules. |
| `404 Not Found` | No authorized active invitation matches the normalized code. |
| `410 Gone` | Online RSVP access is closed under the authoritative backend deadline. |
| `429 Too Many Requests` | Lookup rate limit exceeded. |
| `503 Service Unavailable` | Backend cannot presently complete authoritative lookup. |

## 5.7 Inactive, Disabled, and Environment-Ineligible Codes

Inactive, disabled, development-only, testing-only, or otherwise environment-ineligible records must not be distinguishable from an ordinary unknown code.

They return the same guest-safe `404 Not Found` class as an unknown normalized code.

## 5.8 Malformed Versus Unknown Guest Experience

The API may distinguish malformed input as `400` and unknown/inactive normalized input as `404`, but the browser's guest-facing experience must remain neutral and must not offer code enumeration, close-match information, or record-existence detail.

## 5.9 Closed Lookup Behavior

After the authoritative deadline, a new lookup request returns:

`410 Gone`

The browser enters the RSVP Closed state.

## 5.10 Lookup Rate Limiting

The initial production lookup limit is:

**10 requests per 15-minute rolling window per client IP address.**

When exceeded:

`429 Too Many Requests`

The response must be guest-safe and create no RSVP mutation or delivery attempt.

When deployed behind a reverse proxy or tunnel, the IP address used for limiting must come only from the configured trusted proxy chain.

## 5.11 Lookup Service Unavailable

`503 Service Unavailable` is used when the backend knows it cannot complete authoritative lookup.

The response must not expose provider, spreadsheet, credential, server-path, or other internal details.

---

# 6. Initial or Revised RSVP Submission

## 6.1 Endpoint

`POST /wedding/api/rsvp/submit`

## 6.2 Purpose

The submit endpoint handles:

* First RSVP creation.
* Partial revision of an existing RSVP.
* Operational confirmation-channel replacement.
* Idempotent replay of an uncertain logical request.

The backend determines initial versus revision status only after authoritative lookup of the current private RSVP state.

## 6.3 Exact Request Envelope

The request has exactly four top-level properties:

1. `inviteCode`
2. `clientSubmissionId`
3. `confirmation`
4. `changes`

Example:

```json
{
  "inviteCode": "DEV-006",
  "clientSubmissionId": "2bc9b79c-b707-4e10-a488-8d9575b961f5",
  "confirmation": {
    "method": "email",
    "email": "guest@example.com"
  },
  "changes": {
    "eventAttendance": {
      "operation": "replace",
      "value": ["ceremony", "reception"]
    }
  }
}
```

No `expectedVersion` field is accepted.

### 6.3.1 `inviteCode`

The backend independently normalizes `inviteCode` on every submission.

The request does not rely on prior lookup state for authorization.

### 6.3.2 `clientSubmissionId`

`clientSubmissionId` is a UUID-form identifier generated once for one logical submission attempt.

Rules:

* A genuinely new RSVP action uses a new identifier.
* A safe retry of the same uncertain logical request reuses the same identifier.
* The same identifier plus materially identical logical request content resolves idempotently.
* The same identifier reused for materially different logical content is invalid.

### 6.3.3 No `expectedVersion`

The client does not receive or submit a response version for optimistic concurrency.

Distinct logical revisions merge against the authoritative current response that exists when each request is processed.

## 6.4 Operational `confirmation` Object

The `confirmation` object is always complete for every initial submission and revision. Stored operational values are never silently reused.

### 6.4.1 Email Confirmation

```json
{
  "method": "email",
  "email": "guest@example.com"
}
```

Rules:

* `method` must be `email`.
* `email` is required and must pass backend validation.
* `mobile` is absent.
* `smsAuthorization` is absent.
* The newly submitted email replaces the stored guest-confirmation destination after successful validation and storage.

### 6.4.2 Text-Message Confirmation

When the production or test configuration enables Text Message confirmation and transactional authorization is required:

```json
{
  "method": "textMessage",
  "mobile": "+15555550123",
  "smsAuthorization": true
}
```

Rules:

* `method` must be `textMessage`.
* Text Message must currently be enabled by centralized configuration.
* `mobile` is required and must pass backend validation.
* `email` is absent.
* If SMS authorization is required, `smsAuthorization` must be present and `true`.
* Newly submitted operational values replace their stored counterparts after successful storage.

Exactly one guest confirmation method is selected per logical submission.

## 6.5 Exact `changes` Structure

`changes` is an object keyed by the permanent substantive region IDs:

* `eventAttendance`
* `additionalGuestResponses`
* `attendanceTotals`
* `receptionAttendeeDetails`

A key omitted during a revision means:

**Leave the stored applicable value unchanged, unless an authoritative dependency transition clears it or makes a complete replacement newly required.**

Omission is not deletion.

For an initial response, all data required to construct a valid complete RSVP for the resulting attendance state must be supplied.

`changes` may be empty only for a revision whose substantive RSVP remains unchanged and whose logical action changes only the newly submitted operational confirmation values.

### 6.5.1 Operation Objects

The active substantive contract uses the operation:

`replace`

A replacement object is:

```json
{
  "operation": "replace",
  "value": "replacement value"
}
```

Rules:

* `replace` requires `value`.
* The value must match the authorized type.
* Explicit numeric zero is an ordinary replacement value.
* Dependency-driven clearing is performed by the backend when a value becomes inapplicable.

The active spreadsheet-authoritative fields do not require a generic client `clear` operation:

* Full decline automatically clears all attendance-dependent substantive data.
* Removing Reception automatically clears Reception attendee details.
* Changing Reception attendance total while Reception remains selected requires replacement of the complete attendee-detail list.

A future direct clear operation for another field requires a coordinated schema and contract revision.

### 6.5.2 `eventAttendance`

`eventAttendance` is one complete closed-set attendance state.

Valid replacement values are exactly:

```json
["ceremony"]
```

```json
["reception"]
```

```json
["ceremony", "reception"]
```

```json
["decline"]
```

Ordering of Ceremony and Reception is not semantically significant.

Rules:

* `decline` cannot coexist with `ceremony` or `reception`.
* An empty array is not a complete valid attendance decision.
* When a revision changes the attendance state, the complete intended state is replaced.
* When omitted on a revision, the existing attendance state remains unchanged unless another rule requires otherwise.

### 6.5.3 `additionalGuestResponses`

This field exists only when the validated invitation has at least one authorized named-invitee `Plus1` allocation.

A replacement value is an object keyed by stable authorized allocation IDs:

```json
{
  "additionalGuestResponses": {
    "operation": "replace",
    "value": {
      "plus1-a": "yes",
      "plus1-b": "no"
    }
  }
}
```

Rules:

* Each value is exactly `yes` or `no`.
* The guest-facing name/prompt is never used as the authorization key.
* Unknown allocation IDs are forbidden.
* A party with no authorized allocations must not submit this field.
* An initial attending RSVP requires one response for every authorized allocation.
* A revision while remaining attending may replace only selected allocation IDs; omitted authorized IDs retain their stored values.
* A transition from full decline to attending makes every authorized allocation newly required.
* Full decline automatically clears all stored `additionalGuestResponses`.
* The number of `yes` responses in the complete resulting map must not exceed `overallAttendance`.
* Changing a `Plus1` response does not authorize the backend to guess an age category or attendee name.

### 6.5.4 `attendanceTotals`

`attendanceTotals` contains four permanent nested keys:

* `adults21Plus`
* `youngAdults18To20`
* `children3To17`
* `childrenUnder3`

Initial attending example:

```json
{
  "attendanceTotals": {
    "operation": "replace",
    "value": {
      "adults21Plus": 2,
      "youngAdults18To20": 0,
      "children3To17": 1,
      "childrenUnder3": 0
    }
  }
}
```

Rules:

* Attendance totals are applicable to every attending state.
* Initial attending responses require all four nested values.
* A transition from decline to attending requires all four nested values.
* Every value is a nonnegative whole number.
* The complete merged four-category sum is `overallAttendance`.
* `overallAttendance` must be at least 1.
* `overallAttendance` must not exceed the invitation's `maximumAttendance`.
* A revision may replace only selected nested age categories when totals remain applicable; omitted nested categories remain unchanged.
* Explicit zero is a replacement, not omission.
* Full decline automatically clears the entire stored attendance-total structure.
* If the merged overall attendance changes while Reception remains selected, `receptionAttendeeDetails` must also be replaced in full with exactly the new number of entries.

The browser's coordinated dial limits are a usability expression of the same maximum-attendance rule. Express validates the final sum independently.

### 6.5.5 `receptionAttendeeDetails`

This field is applicable if and only if Reception is selected in the complete resulting attendance state.

A replacement value is the complete Reception attendee-detail list:

```json
{
  "receptionAttendeeDetails": {
    "operation": "replace",
    "value": [
      {
        "attendeeName": "Example Guest",
        "dietaryPreferences": "Tree-nut allergy."
      },
      {
        "attendeeName": "Example Companion",
        "dietaryPreferences": ""
      }
    ]
  }
}
```

Each entry contains exactly:

* `attendeeName`
* `dietaryPreferences`

Rules:

* `attendeeName` is required, nonblank, and no more than 100 characters.
* `dietaryPreferences` is optional and no more than 1000 characters.
* An empty dietary string represents no dietary/allergy information for that attendee.
* The list length must equal the complete merged `overallAttendance`.
* Initial Reception attendance requires the complete list.
* A transition from no Reception to Reception requires the complete list.
* If Reception remains selected and overall attendance changes, the complete list must be replaced.
* If Reception remains selected, overall attendance is unchanged, and this field is omitted during a revision, the stored list remains unchanged.
* Removing Reception automatically clears the stored list.
* Full decline automatically clears the stored list.
* Ceremony-only attendance does not authorize this field.
* Unknown nested properties are rejected once the exact schema is applied.

The API does not attempt to map these attendee names back to source invitee records. They are RSVP-response content supplied for Reception planning.

## 6.6 Initial Submission Requirements and Examples

### 6.6.1 Initial Ceremony-and-Reception RSVP with One Authorized `Plus1`

```json
{
  "inviteCode": "DEV-006",
  "clientSubmissionId": "2bc9b79c-b707-4e10-a488-8d9575b961f5",
  "confirmation": {
    "method": "email",
    "email": "guest@example.com"
  },
  "changes": {
    "eventAttendance": {
      "operation": "replace",
      "value": ["ceremony", "reception"]
    },
    "additionalGuestResponses": {
      "operation": "replace",
      "value": {
        "plus1-a": "yes"
      }
    },
    "attendanceTotals": {
      "operation": "replace",
      "value": {
        "adults21Plus": 2,
        "youngAdults18To20": 0,
        "children3To17": 0,
        "childrenUnder3": 0
      }
    },
    "receptionAttendeeDetails": {
      "operation": "replace",
      "value": [
        {
          "attendeeName": "Example Guest",
          "dietaryPreferences": ""
        },
        {
          "attendeeName": "Example Companion",
          "dietaryPreferences": "Vegetarian."
        }
      ]
    }
  }
}
```

### 6.6.2 Initial Ceremony-Only RSVP

A Ceremony-only initial response includes complete attendance totals and any authorized `Plus1` responses but omits Reception attendee details:

```json
{
  "inviteCode": "DEV-005",
  "clientSubmissionId": "5b7227d2-4105-4b15-b571-2891358221cb",
  "confirmation": {
    "method": "email",
    "email": "guest@example.com"
  },
  "changes": {
    "eventAttendance": {
      "operation": "replace",
      "value": ["ceremony"]
    },
    "attendanceTotals": {
      "operation": "replace",
      "value": {
        "adults21Plus": 2,
        "youngAdults18To20": 0,
        "children3To17": 1,
        "childrenUnder3": 0
      }
    }
  }
}
```

If that invitation has authorized named `Plus1` allocations, the complete corresponding `additionalGuestResponses` map is also required.

### 6.6.3 Initial Reception-Only RSVP

Reception-only uses:

```json
"eventAttendance": {
  "operation": "replace",
  "value": ["reception"]
}
```

and requires complete age totals plus a complete attendee-detail list of exactly `overallAttendance` entries.

### 6.6.4 Initial Full Decline

```json
{
  "inviteCode": "DEV-007",
  "clientSubmissionId": "7af6fd62-c384-45af-b6ce-e2b5353ce0e1",
  "confirmation": {
    "method": "email",
    "email": "guest@example.com"
  },
  "changes": {
    "eventAttendance": {
      "operation": "replace",
      "value": ["decline"]
    }
  }
}
```

A full-decline initial submission does not include `additionalGuestResponses`, `attendanceTotals`, or `receptionAttendeeDetails`.

## 6.7 Partial Revision Requirements and Examples

### 6.7.1 Replace One Authorized `Plus1` Response

When the party remains attending, one allocation may be changed without exposing or resubmitting other stored answers:

```json
{
  "changes": {
    "additionalGuestResponses": {
      "operation": "replace",
      "value": {
        "plus1-a": "no"
      }
    }
  }
}
```

The complete merged RSVP must still satisfy all cross-field rules.

### 6.7.2 Replace One Age Category with Explicit Zero

```json
{
  "changes": {
    "attendanceTotals": {
      "operation": "replace",
      "value": {
        "children3To17": 0
      }
    }
  }
}
```

If this replacement changes `overallAttendance` while Reception remains selected, the request must also include a complete replacement `receptionAttendeeDetails` list matching the new total.

### 6.7.3 Remove Reception While Remaining Ceremony-Only

```json
{
  "changes": {
    "eventAttendance": {
      "operation": "replace",
      "value": ["ceremony"]
    }
  }
}
```

The backend automatically clears stored Reception attendee details.

### 6.7.4 Transition from Attending to Full Decline

```json
{
  "changes": {
    "eventAttendance": {
      "operation": "replace",
      "value": ["decline"]
    }
  }
}
```

The backend automatically clears stored named-`Plus1` responses, attendance totals, derived overall attendance, and Reception attendee details.

### 6.7.5 Transition from Decline to Reception Attendance

The revision must provide all newly applicable data:

```json
{
  "changes": {
    "eventAttendance": {
      "operation": "replace",
      "value": ["reception"]
    },
    "additionalGuestResponses": {
      "operation": "replace",
      "value": {
        "plus1-a": "no"
      }
    },
    "attendanceTotals": {
      "operation": "replace",
      "value": {
        "adults21Plus": 1,
        "youngAdults18To20": 0,
        "children3To17": 0,
        "childrenUnder3": 0
      }
    },
    "receptionAttendeeDetails": {
      "operation": "replace",
      "value": [
        {
          "attendeeName": "Example Guest",
          "dietaryPreferences": ""
        }
      ]
    }
  }
}
```

For an invitation with no authorized `Plus1` allocations, `additionalGuestResponses` is omitted.

### 6.7.6 Confirmation-Channel-Only Revision

A revision may intentionally leave substantive state unchanged:

```json
{
  "inviteCode": "DEV-008",
  "clientSubmissionId": "4af5bd92-10a1-4c84-95e0-9a58b8accf67",
  "confirmation": {
    "method": "email",
    "email": "new-address@example.com"
  },
  "changes": {}
}
```

The newly entered operational values replace the stored confirmation configuration while substantive RSVP content remains unchanged.

## 6.8 Submission Revalidation, Merge, and Authoritative Dependency Processing

### 6.8.1 Processing Order

For each new logical submission:

1. Parse and validate the top-level request envelope.
2. Normalize the invitation code.
3. Apply lookup/authorization/deadline/rate-limit rules.
4. Resolve idempotency using normalized invitation plus `clientSubmissionId` and logical request identity.
5. Load the private invitation configuration.
6. Determine whether a current RSVP exists.
7. Interpret `changes` as complete initial data or partial revision operations.
8. Establish the resulting `eventAttendance` state.
9. Apply automatic clearing for data made inapplicable by that state.
10. Establish the complete resulting named-`Plus1` response map.
11. Establish complete attendance totals and derive `overallAttendance` when attending.
12. Determine Reception attendee-detail applicability.
13. Enforce newly required complete structures.
14. Validate final cross-field invariants.
15. Persist only after the complete resulting RSVP is valid.
16. Attempt independent delivery operations.

### 6.8.2 Attendance Matrix

Valid complete attendance states are exactly:

* Ceremony only.
* Reception only.
* Ceremony and Reception.
* Full decline.

No event plus no decline equivalent is invalid.

Full decline cannot coexist with an attending event.

### 6.8.3 Full Decline

A resulting full decline automatically makes these substantive structures inapplicable and clears any stored values:

* `additionalGuestResponses`
* `attendanceTotals`
* Derived `overallAttendance`
* `receptionAttendeeDetails`

Operational confirmation remains required.

### 6.8.4 Transition from Decline to Attending

When a stored decline becomes an attending state, the backend requires:

* Every authorized named-`Plus1` Yes/No response.
* All four age totals.
* Complete Reception attendee details when Reception is selected.

No previously cleared value is guessed or resurrected.

### 6.8.5 Named-Invitee `Plus1` Rules

For each authorized allocation:

* Initial attending RSVP: response required.
* Attending revision: omission preserves current stored response unless newly applicable.
* Value must be `yes` or `no`.
* Unknown allocation ID: authorization failure.

A party with no authorized allocations must not submit `additionalGuestResponses`.

The number of complete resulting `yes` responses must not exceed `overallAttendance`.

### 6.8.6 Attendance-Total Rules

While attending, complete merged totals must:

* Contain all four categories.
* Use nonnegative whole numbers.
* Sum to at least 1.
* Sum to no more than `maximumAttendance`.

If selected nested totals are revised, omitted nested totals remain unchanged.

If the resulting total changes while Reception remains selected, a complete replacement Reception attendee-detail list is required.

### 6.8.7 Reception Attendee-Detail Rules

Reception attendee details are applicable if and only if Reception is selected.

When applicable:

* List length equals `overallAttendance` exactly.
* Every `attendeeName` is required and at most 100 characters.
* Every `dietaryPreferences` value is optional and at most 1000 characters.

Removing Reception clears the stored list.

If Reception remains selected and overall attendance is unchanged, omission leaves the stored list unchanged.

### 6.8.8 Spreadsheet-Authoritative Closed Set

The backend accepts only the substantive regions defined by this contract.

It does not accept:

* A production `questionProfile` selection.
* Aggregate `additionalGuestAllowance` from the browser.
* Aggregate `additionalGuestAttendance`.
* A party-level dietary field outside Reception attendee details.
* Named-child attendance controls.
* Accessibility questions.
* Lodging responses.
* Transportation responses.
* Entrée selections.
* Messages to the couple.
* Unknown substantive IDs.

### 6.8.9 Operational Confirmation Dependencies

Email and Text Message objects are mutually exclusive at the property level.

The backend validates enabled methods and all required destination/authorization values independently of client visibility.

### 6.8.10 Dependency-Boundary Error Classification

Use `400 Bad Request` for malformed, incomplete, contradictory, or invalid resulting states that are not principally authorization failures.

Use `403 Forbidden` for a structurally understandable request that attempts an invitation-specific field, allocation ID, operation, or confirmation channel that the invitation/current environment does not authorize.

Automatic clearing is not an error when it is the defined consequence of a valid controlling-state change.

## 6.9 Exact Successful Submission Response

A successful response has exactly five top-level properties:

1. `submission`
2. `invitation`
3. `rsvp`
4. `confirmation`
5. `revisionPolicy`

The successful response does not echo:

* Invitation code.
* `clientSubmissionId`.
* Confirmation email address.
* Confirmation mobile number.
* SMS authorization content.
* Private RSVP version.
* `partyId`.
* Workbook row numbers.
* Protected administrative recipient address.
* Provider credentials or payload internals.

### 6.9.1 `submission`

```json
{
  "recorded": true,
  "action": "initial",
  "idempotentRepeat": false,
  "recordedAt": "2026-09-20T20:30:00Z"
}
```

Fields:

* `recorded` — always `true` for an API success under this contract.
* `action` — `initial` or `revision`.
* `idempotentRepeat` — whether this HTTP response replayed an already processed logical request.
* `recordedAt` — authoritative server timestamp for the stored logical submission.

### 6.9.2 `invitation`

The successful response contains only guest-facing static context needed by the temporary confirmation route:

* `partyDisplayName`
* `wordingMode`

It does not contain the invitation code, allocation authorization configuration, `partyId`, active/environment flags, or private source data.

### 6.9.3 `rsvp`

`rsvp` is the complete current guest-facing RSVP after merge, dependency processing, validation, and storage.

For an attending RSVP it contains:

* `eventAttendance`
* `additionalGuestResponses` when at least one authorized allocation exists.
* `attendanceTotals`
* `overallAttendance`
* `receptionAttendeeDetails` only when Reception is selected.

Each `additionalGuestResponses` item returned for confirmation includes the authorized guest-facing prompt and resulting Yes/No response without exposing the private source record:

```json
[
  {
    "id": "plus1-a",
    "prompt": "Will Example Guest be accompanied by a +1?",
    "response": "yes"
  }
]
```

A decline response contains:

```json
{
  "eventAttendance": ["decline"]
}
```

and omits attendance-dependent structures rather than inventing zeros or `N/A` values.

Reception attendee detail output contains complete attendee names and dietary/allergy text for the submitting party's own confirmation experience.

### 6.9.4 `confirmation`

```json
{
  "method": "email",
  "guestDeliveryStatus": "sent",
  "administrativeDeliveryStatus": "sent",
  "deliveryWarning": false
}
```

Allowed delivery statuses are:

* `sent`
* `failed`
* `uncertain`

The response identifies the selected method but does not echo the destination.

### 6.9.5 `revisionPolicy`

```json
{
  "mayRevise": true,
  "deadline": "2027-03-01T23:59:00-05:00",
  "timeZone": "America/New_York",
  "assistanceEmail": "RSVPhelp@loreweavercreations.com"
}
```

### 6.9.6 Successful Initial Submission Example

A newly stored initial response normally returns `201 Created`:

```json
{
  "submission": {
    "recorded": true,
    "action": "initial",
    "idempotentRepeat": false,
    "recordedAt": "2026-09-20T20:30:00Z"
  },
  "invitation": {
    "partyDisplayName": "The Example Household",
    "wordingMode": "plural"
  },
  "rsvp": {
    "eventAttendance": ["ceremony", "reception"],
    "additionalGuestResponses": [
      {
        "id": "plus1-a",
        "prompt": "Will Example Guest be accompanied by a +1?",
        "response": "yes"
      }
    ],
    "attendanceTotals": {
      "adults21Plus": 2,
      "youngAdults18To20": 0,
      "children3To17": 0,
      "childrenUnder3": 0
    },
    "overallAttendance": 2,
    "receptionAttendeeDetails": [
      {
        "attendeeName": "Example Guest",
        "dietaryPreferences": ""
      },
      {
        "attendeeName": "Example Companion",
        "dietaryPreferences": "Vegetarian."
      }
    ]
  },
  "confirmation": {
    "method": "email",
    "guestDeliveryStatus": "sent",
    "administrativeDeliveryStatus": "sent",
    "deliveryWarning": false
  },
  "revisionPolicy": {
    "mayRevise": true,
    "deadline": "2027-03-01T23:59:00-05:00",
    "timeZone": "America/New_York",
    "assistanceEmail": "RSVPhelp@loreweavercreations.com"
  }
}
```

### 6.9.7 Successful Revision with Delivery Warning

A successfully stored revision normally returns `200 OK`, including when later delivery fails:

```json
{
  "submission": {
    "recorded": true,
    "action": "revision",
    "idempotentRepeat": false,
    "recordedAt": "2026-09-20T20:45:00Z"
  },
  "invitation": {
    "partyDisplayName": "The Example Household",
    "wordingMode": "plural"
  },
  "rsvp": {
    "eventAttendance": ["ceremony"],
    "additionalGuestResponses": [
      {
        "id": "plus1-a",
        "prompt": "Will Example Guest be accompanied by a +1?",
        "response": "no"
      }
    ],
    "attendanceTotals": {
      "adults21Plus": 1,
      "youngAdults18To20": 0,
      "children3To17": 0,
      "childrenUnder3": 0
    },
    "overallAttendance": 1
  },
  "confirmation": {
    "method": "email",
    "guestDeliveryStatus": "failed",
    "administrativeDeliveryStatus": "sent",
    "deliveryWarning": true
  },
  "revisionPolicy": {
    "mayRevise": true,
    "deadline": "2027-03-01T23:59:00-05:00",
    "timeZone": "America/New_York",
    "assistanceEmail": "RSVPhelp@loreweavercreations.com"
  }
}
```

The browser must state that the RSVP was recorded and present a guest-safe delivery warning. It must not instruct the guest to resubmit solely because delivery failed.

### 6.9.8 Idempotent Successful Replay

When the same normalized invitation, same `clientSubmissionId`, and materially identical logical request are replayed:

* No new RSVP version is written.
* No duplicate delivery operation is initiated solely because of the replay.
* HTTP result is `200 OK`.
* `submission.action` remains the originally stored action.
* `submission.idempotentRepeat` is `true`.

## 6.10 Submission Status Codes

| Status | Meaning |
|---|---|
| `201 Created` | A valid first RSVP was stored as the invitation's current response. |
| `200 OK` | A valid revision was stored, or an idempotent repeat returned the already recorded logical result. |
| `400 Bad Request` | Malformed envelope/operation, missing required data, invalid values, contradictory state, incomplete newly applicable data, or same `clientSubmissionId` reused for materially different logical content. |
| `403 Forbidden` | Structurally understandable request attempts an unauthorized substantive field, allocation ID, confirmation channel, or other invitation/environment-specific operation. |
| `410 Gone` | Authoritative deadline passed for a new logical submission or revision. |
| `429 Too Many Requests` | Submission rate limit exceeded. |
| `503 Service Unavailable` | Core backend/storage processing unavailable before successful storage can be confirmed. |

`409 Conflict` is not used by the current contract.

---

# 7. Submission Error Semantics

## 7.1 `400 Bad Request`

Examples include:

* Malformed invitation code.
* Malformed JSON/request body.
* Missing required top-level property.
* Unsupported top-level request property.
* Missing or malformed UUID-form `clientSubmissionId`.
* Same logical idempotency identifier reused with materially different request content.
* Unknown operation name.
* `replace` without `value`.
* Invalid attendance combination.
* Empty complete attendance state.
* Missing required initial attending values.
* Missing newly applicable values after a decline-to-attending transition.
* Missing complete Reception attendee-detail replacement after a Reception total change.
* Negative or non-whole-number age total.
* Overall attendance less than 1 or greater than `maximumAttendance` while attending.
* More `Plus1` Yes responses than overall attendance.
* Reception attendee-detail count unequal to overall attendance.
* Blank or overlength attendee name.
* Overlength dietary/allergy text.
* Malformed or contradictory operational confirmation object.

Where useful, the response may include guest-safe field/form validation information, but it must not reveal hidden stored values from an omitted partial-revision field.

## 7.2 `403 Forbidden`

Examples include:

* Unknown substantive region ID.
* `additionalGuestResponses` for a party with no authorized allocations.
* Unknown/unauthorized allocation ID.
* A browser-supplied aggregate `additionalGuestAllowance` or obsolete aggregate `additionalGuestAttendance` field.
* Reception attendee details when Reception is not selected in the complete resulting state.
* A disabled confirmation channel.
* An unsupported client operation.
* Submission through a code that does not authorize active submission in the current environment.

The response must not disclose the private configuration that produced the authorization failure.

## 7.3 `409 Conflict` — Not Used

The current contract has no `expectedVersion` request property and no ordinary client-visible version-conflict mechanism.

A future optimistic-concurrency mechanism requires a new recorded decision and coordinated contract update.

## 7.4 `410 Gone`

The backend enforces the deadline in `America/New_York`.

At or after the closed boundary associated with:

**Monday, March 1, 2027, at 11:59 p.m. EST**

new online submissions and revisions are rejected with:

`410 Gone`

A previously stored logical request replayed idempotently is not a new mutation and is handled according to the idempotency record rather than by creating another version.

## 7.5 `429 Too Many Requests`

Initial production submission limits are:

1. **6 requests per 15-minute rolling window per client IP address.**
2. **6 requests per 15-minute rolling window per normalized invitation code.**

When either applicable limit is exceeded:

`429 Too Many Requests`

A rate-limited request:

* Creates no RSVP version.
* Starts no confirmation delivery operation.
* Reveals no internal counter or private invitation detail.
* Uses the required no-store policy.
* May include an appropriate `Retry-After` indication.

The normalized-code limiter does not authorize ordinary logging of raw or normalized invitation codes.

## 7.6 `503 Service Unavailable`

Use `503 Service Unavailable` only when the backend knows authoritative processing could not be completed before successful storage was confirmed.

The browser enters the guest-safe service-unavailable state.

Do not expose spreadsheet, credential, provider, filesystem, server, or tunnel details.

---

# 8. Duplicate-Submission Protection and Idempotency

## 8.1 Client Submission Identifier

Every logical submission carries a UUID-form `clientSubmissionId`.

## 8.2 Server Idempotency Key

The backend associates idempotency with at least:

* The authorized invitation identity.
* `clientSubmissionId`.
* A canonical representation or digest sufficient to detect materially different logical request content.

The exact internal storage representation is implementation-specific and private.

## 8.3 Same Identifier, Same Logical Submission

If the same logical request is repeated:

* Return the existing logical result.
* Do not create another RSVP version.
* Do not reclassify initial as revision.
* Do not duplicate confirmation delivery solely because of the HTTP replay.
* Return `200 OK` with `idempotentRepeat: true`.

## 8.4 Same Identifier, Different Logical Request

Reuse of one identifier for materially different logical content is invalid and returns `400 Bad Request`.

## 8.5 Idempotent Repeat Does Not Become a Revision

The presence of an already stored response does not convert a replay of the same logical initial request into a new revision.

---

# 9. Known Service Failure Versus Uncertain Submission

## 9.1 Known Pre-Storage Failure

If the backend definitively responds with `503` before successful storage is confirmed, the browser knows the request was not accepted as a successful RSVP result.

## 9.2 Uncertain Client Outcome

If the browser loses connectivity or otherwise receives no definitive server result, the outcome is uncertain.

The client must not assume success or failure.

A safe retry uses the same `clientSubmissionId` and materially identical request content.

The client must not silently generate a new identifier for the retry of the same uncertain logical action.

---

# 10. Confirmation Delivery After Successful Storage

## 10.1 Delivery Attempts Are Post-Storage Operations

Guest and protected administrative delivery attempts occur only after successful authoritative RSVP storage.

## 10.2 Delivery Failure Is Still a Successful RSVP Result

If storage succeeded but either delivery attempt fails or remains uncertain:

* The RSVP remains stored.
* The successful API response remains `200` or `201` as appropriate.
* `confirmation.deliveryWarning` is `true`.
* Delivery status identifies the affected category without exposing provider internals or protected destinations.

## 10.3 Delivery Failure Must Not

Delivery failure must not:

* Roll back RSVP storage.
* Create a duplicate RSVP version.
* Automatically resubmit the RSVP.
* Tell the guest to repeat the RSVP solely because delivery failed.

## 10.4 Public Delivery Information

The browser may receive only:

* Selected confirmation method.
* Guest delivery status.
* Limited administrative-delivery status.
* Boolean delivery-warning state.

It does not receive:

* Email/mobile destination.
* Protected administrative address.
* Provider message IDs.
* Provider payloads.
* Credentials.

## 10.5 Successful-Response Handoff to Confirmation Route

The successful five-property response is the ordinary API source for the temporary confirmation screen.

React passes the usable response through temporary navigation/application state to:

`/wedding/rsvp/confirmation`

The confirmation route does not require the original invitation code or request body merely to display the completed result.

## 10.6 Confirmation Refresh Fallback Is Not API Recovery

If the temporary successful response becomes unavailable because of refresh, direct navigation, new tab, or history behavior, the browser enters the documented Confirmation Refresh Fallback state.

That state does not automatically:

* Call lookup.
* Call submit.
* Generate a new `clientSubmissionId`.
* Replay an old identifier.
* Retrieve a stored RSVP.

## 10.7 No Confirmation-Recovery Endpoint

The initial implementation defines no short-lived confirmation token and no public confirmation-recovery endpoint.

## 10.8 Deliberate Return to RSVP

A guest may deliberately return to the ordinary RSVP route and manually enter the code again. That starts a normal blank-form interaction and remains subject to the backend deadline.

---

# 11. Guest-Safe API Error Boundary

Every guest-facing API error must:

* Use neutral, useful language.
* Avoid revealing whether a close invitation-code match exists.
* Avoid revealing inactive/development/test record existence.
* Avoid exposing stored RSVP values.
* Avoid exposing hidden invitation configuration.
* Avoid exposing Google Sheets structure or identifiers.
* Avoid exposing provider names/details unless intentionally public elsewhere.
* Avoid exposing credentials, paths, stack traces, SQL/Sheet formulas, internal exception text, server/tunnel data, or administrative recipient addresses.

Validation details may identify a guest-visible field or problem category when doing so does not disclose hidden stored or private configuration data.

---

# 12. Personalized Response, Caching, Logging, Credential, and Transport Boundary

## 12.1 Browser Isolation and Invited-Party Separation

A validated party may receive only its own limited invitation context and its own temporary successful confirmation result.

No response may include another party's configuration or RSVP data.

## 12.2 Invitation Codes Are Limited Access Tokens

Invitation codes are not described as strong passwords or full identity authentication.

Their limited-access-token role does not justify exposing them in URLs, logs, analytics, or unrelated responses.

## 12.3 Request-Body-Only Code Transport

Both lookup and submit carry invitation codes only in POST bodies.

## 12.4 `Cache-Control`

Every lookup and submission API response, including errors, uses:

`Cache-Control: no-store, max-age=0`

Production browser documents for `/wedding/rsvp/` and `/wedding/rsvp/confirmation` use the same policy.

## 12.5 Temporary Confirmation State

The initial implementation does not intentionally persist the successful confirmation response solely so that the summary can be reconstructed after refresh.

## 12.6 Search Indexing and Metadata

Transactional RSVP routes and states must not be publicly indexed.

Personalized values must not appear in public metadata, structured data, canonical URLs, or crawler-visible content.

## 12.7 Analytics Data Minimization

Analytics must not receive:

* Invitation codes.
* Guest identities derived from private invitation records.
* Named `Plus1` prompt/response data.
* Age totals.
* Reception attendee names.
* Dietary/allergy text.
* Confirmation destinations.
* `clientSubmissionId` values.
* Private versions.
* Provider payloads.

## 12.8 Ordinary Logging Policy

Ordinary application/access logs must not intentionally record:

* Raw or normalized invitation codes.
* RSVP request or response bodies.
* Named `Plus1` responses.
* Attendance totals.
* Reception attendee names.
* Dietary/allergy text.
* Confirmation destinations.
* SMS authorization data.
* `clientSubmissionId` values.
* Workbook contents.
* Credentials/secrets.

Necessary status, timing, route, and non-sensitive operational data may be logged consistent with the project security rules.

## 12.9 Restricted Diagnostic Correlation

A secured, time-limited, keyed pseudonymous diagnostic-correlation mechanism may be used only for a concrete investigation and must not become ordinary raw-code logging.

## 12.10 Trusted Reverse Proxy

Per-IP rate limiting trusts only the explicitly configured reverse-proxy/tunnel chain.

## 12.11 Google Credentials and Workbook Access

Google service-account credentials, spreadsheet identifiers where sensitive, and workbook access remain backend-only.

The browser never talks directly to the private workbook.

## 12.12 Email, SMS, Sender, and Administrative Credentials

Provider credentials, sender secrets/configuration, and protected administrative destination information remain backend-only.

## 12.13 Production and Development/Test Separation

Fictional development fixtures and production invitation data remain isolated.

Development-only codes are not active production records.

Real source data is not copied into public documentation or test fixtures.

## 12.14 Protected Reception Attendee and Dietary/Allergy Information

Reception attendee names and dietary/allergy information are private RSVP content.

They may appear only in:

* The submitting party's own temporary on-screen confirmation.
* The submitting party's own selected electronic confirmation.
* The protected administrative confirmation.
* Authorized private administrative records required to operate the RSVP.

They must not appear in public pages, analytics, ordinary logs, metadata, or another invited party's response.

Dietary/allergy text exists only inside applicable Reception attendee-detail records under the current contract.

## 12.15 Transactional Mobile-Number Use

An RSVP mobile number may be used only for the requested transactional confirmation and an approved manual resend unless a later decision explicitly authorizes another use.

## 12.16 SMS Provider Disclosure Gate

Production Text Message confirmation remains disabled until:

1. A production SMS provider is selected.
2. Required provider disclosure/authorization language is verified.
3. Applicable sender identification, consent, carrier-rate, opt-out/help, and other required language is implemented.
4. Backend-only credentials/sender configuration are established.
5. The completed production flow is tested.

Until then, `confirmationOptions.textMessage` is `false` in production.

## 12.17 No Unsupported Absolute-Security Promise

Public copy may describe concrete safeguards but must not promise absolute security or confidentiality.

## 12.18 RSVP Data Retirement

Active RSVP-operational data must be deleted or de-identified no later than:

**July 30, 2027**

unless the minimum necessary record is temporarily required for a concrete documented administrative purpose.

## 12.19 Protected Backup Retirement

Protected backups containing retired RSVP-operational data expire no later than:

**August 29, 2027**

## 12.20 Aggregate Retention and Private `Invitees List`

Non-identifying aggregate statistics may remain after operational data retirement.

The separate private `Invitees List` may remain as a personal planning/address record, but the active RSVP system must not remain dependent on retired response history.

## 12.21 Documented Retention Exception

Any temporary retention beyond the ordinary retirement date must be limited to the minimum data required for a concrete documented administrative need and removed promptly when that need ends.

## 12.22 Production HTTPS

All production RSVP traffic uses HTTPS.

## 12.23 No New Public Endpoint

The privacy/security rules and spreadsheet-authoritative revision do not create another public RSVP endpoint.

---

# 13. Development Fixture and Production-Source Boundary

Development/test fixtures must model, at minimum:

* Singular invitation with no `Plus1` allocation.
* Plural invitation with no `Plus1` allocation.
* One named `Plus1` allocation.
* Multiple named `Plus1` allocations.
* Ceremony-only attendance.
* Reception-only attendance.
* Ceremony-and-Reception attendance.
* Full decline.
* Existing-response revision.
* Capacity-boundary behavior.
* Reception attendee-detail cardinality and length validation.
* Inactive development record.

Development fixtures must use synthetic names, allocation IDs, and invitation codes.

The current authoritative production-source audit is:

* 57 active assigned invitation rows.
* 57 unique normalized invitation-code keys.
* 35 singular wording records.
* 22 plural wording records.
* 23 records with at least one `Plus1` allocation.
* 26 total `Plus1` allocations.
* Two records with more than one allocation.
* Combined maximum-attendance capacity of 115.
* No required active or placeholder 58th production record.

Those aggregate values are private transformation-validation targets, not public API constants.

---

# 14. Endpoint-to-Interface Mapping

| API result | Browser consequence |
|---|---|
| Lookup `200` | State 5 — Validated Blank Form. |
| Lookup `400` | State 3 — Invalid Invitation, neutral guest-safe presentation. |
| Lookup `404` | State 3 — Invalid Invitation, neutral guest-safe presentation. |
| Lookup `410` | State 13 — RSVP Closed. |
| Lookup `429` | Guest-safe throttled/invalid interaction handling consistent with current UI documentation; no personalized data disclosed. |
| Lookup `503` | State 4 — Service Unavailable. |
| Submit `201` with no delivery warning | State 9 — Confirmed Initial Submission. |
| Submit `200`, `action: revision`, no delivery warning | State 10 — Confirmed Revision. |
| Submit `200` idempotent replay | Successful state corresponding to stored `submission.action`; `idempotentRepeat` is informational. |
| Submit success with `deliveryWarning: true` | State 11 — Stored with Delivery Warning. |
| Submit `400` | State 6 — Validation Failure when the request/field error can be corrected in the current form. |
| Submit `403` | Guest-safe authorization/validation failure without private configuration disclosure. |
| Submit `410` | State 13 — RSVP Closed for the new logical action. |
| Submit `429` | Guest-safe rate-limit handling; no RSVP mutation occurred. |
| Submit `503` | State 4 — Service Unavailable when known pre-storage failure is confirmed. |
| No definitive client result | State 8 — Submission Uncertain. |
| Confirmation route without usable temporary success state | State 12 — Confirmation Refresh Fallback. |

---

# 15. Contract Completion Check — Endpoint Foundation

The endpoint foundation is complete because this contract defines:

* `/wedding/api/` as the API prefix.
* Health, lookup, and submit endpoints.
* Request-body-only invitation-code handling.
* Backend-authoritative normalization.
* Guest-safe malformed/unknown/inactive handling.
* Deadline, rate-limit, and service-unavailable classes.
* Storage-before-delivery behavior.

---

# 16. Contract Completion Check — Lookup Response

The lookup contract is complete because it defines:

* Exactly three top-level success properties.
* The allowed guest-facing invitation context.
* `additionalGuestAllocations` as zero or more authorized named-invitee `Plus1` prompt definitions.
* No production `questionProfile`.
* No aggregate `additionalGuestAllowance`.
* Reusable substantive regions for attendance, named `Plus1` responses, four age totals, and Reception attendee details.
* Operational confirmation options.
* The blank-form invariant.
* Prohibition on stored-response indicators and private configuration leakage.

---

# 17. Contract Completion Check — Submission Payload

The submission contract is complete because it defines:

* Exactly four top-level request properties.
* Complete operational confirmation replacement on every logical submission.
* Permanent substantive keys:
  * `eventAttendance`
  * `additionalGuestResponses`
  * `attendanceTotals`
  * `receptionAttendeeDetails`
* `replace` operation semantics.
* Initial completeness versus revision omission semantics.
* Explicit-zero semantics for age totals.
* Stable authorized allocation IDs for named `Plus1` responses.
* Complete-replacement semantics for Reception attendee-detail lists.
* UUID-form idempotency identifiers.
* No `expectedVersion` field.
* Exactly five top-level successful-response properties.

---

# 18. Contract Completion Check — Dependency Rules

The dependency contract is complete because it records that:

* Attendance is exactly Ceremony, Reception, both, or full decline.
* Full decline automatically clears all attendance-dependent substantive data.
* Decline-to-attending transitions require every newly applicable structure.
* Only source-authorized named `Plus1` allocations may receive responses.
* Parties without a Column E `Plus1` allocation receive and submit no Plus 1 field.
* Every authorized allocation requires Yes/No when attending and newly applicable.
* Complete attending age totals must sum from 1 through `maximumAttendance`.
* Browser dial remaining-capacity limits are advisory expressions of the authoritative backend sum validation.
* Reception attendee details exist if and only if Reception is selected.
* Reception attendee-detail count equals overall attendance exactly.
* Attendee names are required and limited to 100 characters.
* Dietary/allergy values are optional and limited to 1000 characters.
* Removing Reception clears Reception attendee details.
* Changing overall attendance while Reception remains selected requires a complete replacement attendee-detail list.
* Ceremony-only attendance retains no Reception attendee-detail data.
* The backend never guesses an age category, `Plus1` response, or attendee name.

---

# 19. Contract Completion Check — Idempotency, Delivery, and Browser States

The contract preserves:

* Same logical request + same identifier = idempotent replay.
* Same identifier + materially different request = `400`.
* No new version on idempotent replay.
* Delivery failures occur after storage and do not roll back the RSVP.
* Guest and administrative delivery attempts are independent.
* Successful storage drives States 9, 10, or 11 through the five-property response.
* No definitive response produces Submission Uncertain rather than inferred success/failure.
* Missing temporary confirmation state produces State 12 without automatic recovery mutation.
* No confirmation-recovery endpoint or token is required in the initial implementation.

---

# 20. Contract Completion Check — Privacy and Security

The final API privacy/security boundary is complete because it requires:

* Invitation codes treated as limited access tokens.
* No public guest directory, code-recovery search, fuzzy lookup, saved-RSVP endpoint, RSVP-history endpoint, or personalized code route.
* Request-body-only invitation codes.
* `Cache-Control: no-store, max-age=0` on every lookup and submit response.
* No-index transactional browser routes.
* Analytics exclusion of invitation, RSVP, attendee, dietary, contact, idempotency, version, and provider-sensitive data.
* Ordinary-log exclusion of the same sensitive request/response content.
* Trusted-proxy-aware rate limiting.
* Backend-only Google, email, SMS, sender, and administrative credentials.
* Production/development/test isolation.
* Guest-safe errors.
* Restricted handling of Reception attendee names and dietary/allergy data.
* Transactional-only mobile-number use.
* SMS provider disclosure gate.
* No unsupported absolute-security claims.
* Operational RSVP retirement by July 30, 2027.
* Protected backup retirement by August 29, 2027.
* HTTPS for production RSVP traffic.

---

# 21. Spreadsheet-Authoritative Revision Check

This September 20, 2026 revision is complete only when all coordinated governing files agree that:

* The authoritative private `Invitees List` spreadsheet controls production invitation configuration and the substantive form-display behavior recorded in its bottom-row notes.
* There are 57 active assigned production invitation records in the current source audit.
* No production 58th placeholder is required.
* The active API does not use the former production `default`/`reduced-attendance-dietary` profile split.
* The active API does not use aggregate `additionalGuestAllowance` or aggregate `additionalGuestAttendance` browser fields.
* Only invitations whose source Column E contains `Plus1` allocations receive Plus 1 questions.
* Each authorized Column E allocation produces one separate named-invitee Yes/No prompt.
* The API submits those responses by stable non-name allocation ID.
* Every attending RSVP uses four age-category totals and a backend-derived `overallAttendance`.
* Reception attendance activates one attendee-detail record per attending party member.
* Reception attendee details contain required attendee name and optional dietary/allergy information.
* Dietary/allergy information is no longer one party-level field and is not collected for Ceremony-only attendance.
* The blank-form, revision, idempotency, delivery, security, deadline, and retention architecture remains intact.

With those rules recorded, this file is the controlling spreadsheet-authoritative RSVP API contract pending any later approved project decision.
