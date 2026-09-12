# RSVP API Contract

**Project:** Loreweaver Creations Wedding Website
**Phase:** Phase 3 — Design the RSVP System
**Current completion:** Phase 3 through Step 14 — Backend Endpoints, Submission/Revision Payload Contract, Conditional/Dependency Rules, Interface-State Mapping, Preliminary Test Synchronization, Finalized Confirmation Refresh Behavior, and Finalized Privacy and Security Rules
**Status:** Final Phase 3 RSVP API contract
**Phase 3 status:** Complete
**Last updated:** August 21, 2026

---

## 1. Purpose and Status

This document records the backend API contract for the Loreweaver Creations wedding RSVP system through Phase 3 Step 14.

Phase 3 Step 4 establishes:

* The approved wedding API route prefix.
* The preliminary backend endpoints required for the invitation-launch RSVP system.
* The HTTP method and route for each endpoint.
* The purpose of each endpoint.
* The invitation-lookup request boundary.
* The preliminary request-content boundary for RSVP submission.
* The required high-level success behavior.
* The approved HTTP status-code families.
* Guest-safe handling of malformed, unknown, inactive, unauthorized, closed, rate-limited, and unavailable requests.
* The distinction between a known pre-storage service failure and an uncertain client-side submission outcome.
* The rule that successful RSVP storage remains successful even when later confirmation delivery fails.

Phase 3 Steps 5 and 6 establish the companion private invitation-configuration and reusable form-schema shapes in:

* `docs/rsvp-example-configurations.json`
* `docs/rsvp-example-form-schemas.json`
* `docs/rsvp-test-cases.md`

Phase 3 Step 7 establishes in this contract:

* The exact successful `POST /wedding/api/rsvp/lookup` response boundary.
* The permitted guest-facing fields of the `invitation` object.
* The applicable `questions` array.
* The `confirmationOptions` object.
* Profile- and allowance-specific question filtering.
* The blank-form invariant.
* The prohibition on stored-response indicators and unnecessary private configuration in lookup responses.

Phase 3 Step 8 establishes in this contract:

* The exact top-level request envelope for `POST /wedding/api/rsvp/submit`.
* The exact operational `confirmation` object for email and text-message submissions.
* The exact `changes` object and the permitted `replace` and `clear` operation objects.
* Initial-response completeness rules and partial-revision omission semantics.
* Explicit-zero representation through ordinary `replace` values rather than a separate zero operation.
* The submission representation for attendance, decline, additional-guest responses, attendance totals, and dietary information.
* A UUID-form `clientSubmissionId` generated once per logical submission and reused for an idempotent retry of that same logical submission.
* Idempotent-repeat behavior and rejection of reuse of one identifier for materially different request content.
* The decision not to adopt client-supplied `expectedVersion` checking in the current RSVP contract.
* The exact successful submission-response envelope, including the complete resulting guest-facing RSVP, selected confirmation method, guest delivery status, limited administrative-delivery status, and revision policy information.
* Exact synthetic examples for initial submissions, reduced-profile submissions, partial revisions, explicit zero, explicit clearing, confirmation-channel changes, attendance/decline changes, and successful responses.

Phase 3 Step 9 establishes in this contract:

* The authoritative processing order for merge, dependent clearing, newly applicable requirements, and final validation.
* The exact valid attendance-versus-decline resulting states.
* Automatic clearing of additional-guest, attendance-total, and dietary data made inapplicable by a full decline.
* Additional-guest applicability and requiredness for the default profile with a positive allowance.
* Default-profile attendance-total applicability, completeness, and overall-attendance rules.
* The relationship between effective additional-guest count and complete overall attendance.
* Party-level dietary applicability for Ceremony-only, Reception-only, or combined attendance, with clearing on full decline.
* Closed-set enforcement for the default and reduced substantive profiles.
* Operational Email and Text Message dependencies.
* The distinction among authorization failures, contradictory or incomplete validation failures, and backend automatic clearing of stale dependent values.

Phase 3 Step 10 establishes, through the synchronized browser-state documentation and the endpoint-state mapping in this contract:

* The thirteen explicit top-level RSVP interface states.
* The browser consequence of each lookup and submission result documented by this API contract.
* The distinction between a known pre-storage `503 Service Unavailable` result and an ambiguous browser-side Submission Uncertain outcome.
* The requirement that successful storage use the successful response object to enter Confirmed Initial Submission, Confirmed Revision, or Stored with Delivery Warning as appropriate.
* The requirement that browser-visible success never be inferred merely because a request was sent.

Phase 3 Step 11 establishes the fictional development configuration and behavioral archetypes used by later testing. Step 11 does not change the public API request or response shapes in this contract.

Phase 3 Step 12 establishes `docs/rsvp-test-cases.md` as the preliminary test catalog for the API and browser behavior defined through Step 11, including normalization, lookup, submission, revision, dependency, idempotency, delivery, deadline, privacy-boundary, interface-state, and accessibility cases. Step 12 does not change the public API request or response shapes.

Phase 3 Step 13 establishes in this contract:

* The exact handoff of the approved successful submission response into temporary React navigation/application state for `/wedding/rsvp/confirmation`.
* The eligibility rules for rendering Confirmed Initial Submission, Confirmed Revision, or Stored with Delivery Warning from that temporary response.
* The rule that an absent or unusable temporary success response enters Confirmation Refresh Fallback without inferring success or failure.
* The prohibition on automatic lookup, automatic resubmission, automatic generation of a new `clientSubmissionId`, or undocumented saved-RSVP recovery when temporary confirmation state is unavailable.
* The decision that the initial implementation requires no short-lived confirmation token and no separate public confirmation-recovery endpoint.
* The rule that confirmation-refresh recovery does not change the Step 8 request envelope, Step 8 successful response envelope, storage model, idempotency model, or delivery model.

Phase 3 Step 14 establishes in this contract:

* The finalized invitation-code security model: codes are limited access tokens rather than passwords.
* Request-body-only invitation-code transport and the continued prohibition on code-bearing public routes.
* `Cache-Control: no-store, max-age=0` for personalized RSVP browser documents and every lookup/submission API response.
* Final search-indexing and metadata boundaries for transactional RSVP routes.
* Final analytics data-minimization rules.
* Final ordinary-log and restricted-diagnostic-correlation rules.
* The initial production lookup limit of 10 requests per 15-minute rolling window per client IP.
* The initial production submission limits of 6 requests per 15-minute rolling window per client IP and 6 per 15-minute rolling window per normalized invitation code.
* Trusted-reverse-proxy requirements for per-IP rate limiting.
* Backend-only Google, email, SMS, sender, and protected administrative-recipient credentials.
* Private-workbook and production/development separation requirements.
* Final guest-safe error boundaries.
* The protected dietary/allergy information boundary.
* Transactional-only use of RSVP mobile numbers.
* A production SMS-provider disclosure gate rather than invented provider-specific copy.
* The prohibition on unsupported promises of absolute security.
* The RSVP-operational retirement date of July 30, 2027 and protected backup-retirement deadline of August 29, 2027.
* Mandatory HTTPS for production RSVP traffic.

These Step 14 rules do not change the existing lookup shape, submission envelope, successful response envelope, dependency model, idempotency model, storage/versioning model, delivery order, or Step 13 confirmation-refresh design.

This is the **final Phase 3 API contract**. Later implementation changes that alter a frozen public contract or privacy/security rule require a new recorded project decision and coordinated documentation update.

This document must remain consistent with:

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

Where a later approved decision supersedes a preliminary API detail recorded here, the later approved decision controls and this contract must be revised accordingly.

---

## 2. Governing API Principles

### 2.1 API Route Prefix

Wedding-specific backend endpoints use the project-relative prefix:

`/wedding/api/`

The same logical API route structure must be usable during local Windows development and Ubuntu production deployment.

Environment-specific hostnames, ports, proxy destinations, spreadsheet identifiers, service addresses, credentials, and similar values must remain centralized rather than being embedded in individual endpoint definitions.

### 2.2 Browser Routes and API Routes Are Separate

Browser-facing RSVP interaction occurs through:

`/wedding/rsvp/`

and, after successful storage:

`/wedding/rsvp/confirmation`

Backend operations occur beneath:

`/wedding/api/`

The production web-server fallback for React browser routes must not intercept valid backend API endpoints or the health-check endpoint.

### 2.3 No Code-Bearing Lookup URL

Invitation codes are submitted to the backend in request bodies.

The API must not provide or require a personalized lookup pattern such as:

`GET /wedding/api/rsvp/:inviteCode`

or:

`GET /wedding/api/rsvp?inviteCode=XXX-XXX`

Invitation codes must not be transported through:

* Browser paths.
* API path parameters.
* Query strings.
* URL fragments.

The sole approved invitation lookup endpoint is:

`POST /wedding/api/rsvp/lookup`

### 2.4 Backend Authority

React may perform usability normalization and validation, but the Express backend remains authoritative.

The backend independently controls:

* Invitation-code normalization.
* Invitation-code structural validation.
* Invitation existence and active-status validation.
* Environment authorization.
* Lookup rate limiting.
* Submission rate limiting.
* RSVP deadline enforcement.
* Question-profile authorization.
* Additional-guest authorization.
* Maximum-attendance enforcement.
* Submitted-value validation.
* Initial-versus-revision determination.
* Partial-revision merging.
* Explicit operation authorization.
* Dependent-value clearing.
* Complete-result validation.
* Duplicate-submission protection.
* Versioned storage.
* Current-response designation.
* Confirmation-delivery attempts.
* Delivery-result recording.
* Guest-safe API responses.

A prior successful lookup does not authorize a later submission by itself.

### 2.5 Blank Lookup Responses

A successful invitation lookup returns only the information necessary to render the applicable **blank** personalized RSVP form.

The exact successful lookup-response boundary is finalized by Phase 3 Step 7 and recorded in Section 5.5.

Lookup must not return:

* The current stored RSVP.
* Superseded RSVP versions.
* Previous attendance selections.
* Previous decline status.
* Previous additional-guest responses.
* Previous age-category totals.
* Previous dietary information.
* Previous confirmation method.
* Previous email address.
* Previous mobile number.
* Previous SMS-authorization state.
* Previous delivery results.
* Private spreadsheet rows.
* Private administrative notes.
* Credentials or secrets.
* Another invitation party's information.
* An `existingResponse`, `currentResponse`, `hasResponse`, response version, or equivalent stored-response indicator.

The lookup response is intentionally the same blank-form shape whether the later submission becomes an initial RSVP or a revision.

### 2.6 Server-Side Revalidation on Submission

Every RSVP submission or revision must cause the backend to normalize and validate the invitation code again.

A submission is also independently checked against:

* Current server time and the RSVP deadline.
* Active invitation status.
* Production or environment authorization.
* The invitation's approved question profile.
* The invitation's additional-guest allowance.
* The invitation's maximum attendance.
* Authorized RSVP fields.
* Operational confirmation fields.
* Any applicable transactional SMS authorization.
* Submitted changes and explicit operations.
* Duplicate-submission protection.

Client state never substitutes for these checks.

### 2.7 Storage Before Confirmation Delivery

A valid RSVP must be stored successfully before any guest or administrative confirmation-delivery attempt begins.

After storage:

1. The new RSVP version is written.
2. The current-response record is updated.
3. The protected administrative-email attempt begins.
4. The applicable guest email or text-message attempt begins.
5. Each delivery result is recorded separately.
6. The backend returns the appropriate successful guest-facing result.

A delivery failure after successful storage is not a storage failure.

### 2.8 Dynamic Invitation Records

The API must operate from the currently available private invitation configurations.

Reusable endpoint logic must not assume that the production invitation count will permanently remain 56.

Production, development, and testing records must remain appropriately separated.

---

## 3. Phase 3 Endpoint Inventory

| Method | Endpoint                   | Purpose                                                                                                                                                                                            |
| ------ | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET`  | `/wedding/api/health`      | Confirm that the wedding application backend is running without querying or exposing invitation or RSVP data.                                                                                      |
| `POST` | `/wedding/api/rsvp/lookup` | Normalize and validate a manually entered invitation code and, when valid and active, return the limited schema required to render the applicable blank RSVP form.                                 |
| `POST` | `/wedding/api/rsvp/submit` | Accept an initial RSVP or partial revision, independently validate and merge it, store the new current version, attempt confirmations, and return complete current guest-facing confirmation data. |

No additional public RSVP API endpoint is required by Phase 3 Step 4.

In particular, Step 4 does not create:

* A code-bearing GET lookup endpoint.
* A public “view my saved RSVP” endpoint.
* A public invitation directory.
* A public code-recovery endpoint.
* An invitation-specific API route.
* A public administrative API or dashboard.

---

# 4. Health Check

## 4.1 Endpoint

`GET /wedding/api/health`

## 4.2 Purpose

The health endpoint exists to confirm that the wedding application backend is running and capable of answering a basic application-health request.

The health check must not query or expose:

* Invitation records.
* Production invitation codes.
* Guest identities.
* RSVP responses.
* Confirmation destinations.
* Dietary information.
* Delivery records.
* Spreadsheet rows.
* Private administrative information.

It is not an RSVP lookup endpoint.

## 4.3 Successful Response

A successful health check returns:

```json
{
  "status": "ok"
}
```

The successful response uses HTTP:

`200 OK`

## 4.4 Health-Check Boundary

Phase 3 Step 4 does not require the health endpoint to prove that:

* Google Sheets is reachable.
* Email delivery is available.
* Text-message delivery is available.
* A particular invitation exists.
* The RSVP deadline is open.

Those are separate application or service concerns.

The health endpoint must remain free of invitation-specific or RSVP-specific response data.

---

# 5. Invitation Lookup

## 5.1 Endpoint

`POST /wedding/api/rsvp/lookup`

## 5.2 Purpose

This endpoint receives the invitation code that the guest manually entered on:

`/wedding/rsvp/`

It:

1. Receives the code in the request body.
2. Independently normalizes the value according to the approved Phase 3 Step 2 algorithm.
3. Rejects malformed values.
4. Applies lookup rate limiting.
5. Determines whether the resulting canonical code identifies an authorized active invitation configuration in the current environment.
6. Applies the backend RSVP-availability and deadline rules.
7. Returns a limited blank-form schema when lookup succeeds.
8. Returns a guest-safe failure result otherwise.

The browser remains on:

`/wedding/rsvp/`

throughout this process.

## 5.3 Request

The request contains an `inviteCode` value.

Synthetic example:

```json
{
  "inviteCode": "A1B-C2D"
}
```

`A1B-C2D` is a fictional documentation-only value and must not be activated as a production invitation code.

The request may contain the guest-entered presentation form. The backend does not require React to have already converted the value to its canonical six-character representation.

Express independently performs the authoritative normalization process.

## 5.4 Invitation-Code Normalization

For lookup, Express applies the following process in order:

1. Convert the received value to a string.
2. Remove leading and trailing whitespace.
3. Remove internal ordinary whitespace.
4. Remove hyphens.
5. Convert letters to uppercase.
6. Reject remaining characters outside `A–Z` and `0–9`.
7. Confirm that exactly six characters remain.
8. Use the resulting six-character value as the canonical internal lookup key.
9. Use `XXX-XXX` only when a guest-facing display representation is appropriate.

The runtime does not re-enforce the historical code-generation preference concerning the minimum number of letters.

## 5.5 Successful Lookup and Limited Blank-Form Response

A successful invitation lookup returns:

`200 OK`

A `200` response means:

* The received invitation code normalized successfully.
* The canonical code identifies one authorized active invitation configuration for the current environment.
* Online RSVP access remains open under the authoritative backend deadline.
* The backend selected the invitation's approved question profile and applicable form schema.
* The response contains only the guest-facing invitation data, question definitions, operational confirmation options, and public policy information required to render a blank form.
* The response contains no stored RSVP answers or stored confirmation destination.

The successful lookup response has exactly three top-level properties:

1. `invitation`
2. `questions`
3. `confirmationOptions`

The response does **not** contain an `existingResponse`, `currentResponse`, `hasResponse`, response version, stored-answer object, or other field that tells React what the invited party previously submitted.

The backend determines initial-versus-revision status authoritatively when:

`POST /wedding/api/rsvp/submit`

is called.

### 5.5.1 `invitation`

The `invitation` object contains only the invitation-specific values needed to render the current blank form.

Permitted fields are:

* `partyDisplayName` — reviewed invited-party display wording for the validated invitation.
* `greeting` — reviewed guest-facing greeting for the validated invitation.
* `wordingMode` — `singular` or `plural`; React must not infer this value from names or apparent party size.
* `maximumAttendance` — the maximum permitted party size used by applicable validation.
* `additionalGuestAllowance` — a nonnegative integer returned for the `default` profile, including `0` when no additional-guest control is rendered. It is omitted for `reduced-attendance-dietary`, which does not authorize that substantive field.
* `questionProfile` — either `default` or `reduced-attendance-dietary`.
* `deadline` — the centralized public RSVP deadline supplied by backend configuration.
* `timeZone` — `America/New_York`.

The response must not expose protected private-configuration fields such as:

* The canonical production lookup key.
* A guest-facing reproduction of the production invitation code when it is not needed to render the form.
* `partyId` or equivalent private record identifiers.
* `active`.
* `environment`.
* Source-spreadsheet row numbers.
* Child-allocation notes.
* Private administrative notes.
* Other invitation records or codes.

The backend may internally use those values when authorizing and selecting the response, but React does not require them.

### 5.5.2 `questions`

`questions` contains only the question objects applicable to the validated invitation.

Each returned question object uses the common structure established in:

`docs/rsvp-example-form-schemas.json`

including the applicable subset of:

* `id`
* `scope`
* `type`
* `label`
* `labelVariants`
* `requiredOnInitial`
* `requiredWhenVisible`
* `options`
* `displayCondition`
* `validation`
* `patchBehavior`
* `clearBehavior`
* `helpText`

Permanent IDs remain independent of visible wording.

The current substantive IDs are:

* `eventAttendance`
* `declineAttendance`
* `additionalGuestAttendance`
* `attendanceTotals`
* `dietaryPreferences`

The current operational IDs are:

* `confirmationMethod`
* `confirmationEmail`
* `confirmationMobile`
* `smsAuthorization`

The browser may use returned display conditions and validation constraints for rendering and usability validation.

These client-side rules never replace authoritative backend validation.

### 5.5.3 Profile and Allowance Filtering

The backend filters the question array before returning it.

For `questionProfile: "default"`:

* `eventAttendance` is returned.
* `declineAttendance` is returned.
* `attendanceTotals` is returned.
* `dietaryPreferences` is returned.
* `additionalGuestAttendance` is omitted when `additionalGuestAllowance` is `0`.
* `additionalGuestAttendance` is returned as the approved Yes/No control when `additionalGuestAllowance` is `1`.
* `additionalGuestAttendance` is returned as the bounded whole-number control when `additionalGuestAllowance` is greater than `1`.

For `questionProfile: "reduced-attendance-dietary"`:

* `eventAttendance` is returned.
* `declineAttendance` is returned.
* `dietaryPreferences` is returned.
* `additionalGuestAttendance` is not returned.
* `attendanceTotals` is not returned.
* `additionalGuestAllowance` is omitted from the guest-facing `invitation` object because that substantive profile does not permit an additional-guest response.

The operational confirmation questions required for online submission are returned for both approved substantive profiles.

The backend must not return a substantive field merely because another profile uses it.

### 5.5.4 `confirmationOptions`

`confirmationOptions` records the enabled guest-confirmation channels and the applicable SMS-authorization requirement needed by the form renderer.

The object uses these keys:

* `email`
* `textMessage`
* `smsAuthorizationRequired`

A fictional example in which both supported channels are enabled and the selected SMS process requires transactional authorization is:

```json
{
  "email": true,
  "textMessage": true,
  "smsAuthorizationRequired": true
}
```

Actual runtime values must come from the applicable centralized project configuration.

Under the finalized Phase 3 Step 14 rule, production may expose `textMessage: true` only after the selected SMS provider's required guest-facing disclosure and authorization language has been verified and implemented. Until that production gate is satisfied, Text Message confirmation must remain disabled rather than using invented provider-specific copy.

The permanent `smsAuthorization` question ID remains stable even if the verified production wording changes to satisfy the selected provider's requirements.

### 5.5.5 Normative Synthetic Example

The following example represents a fictional development-only invitation using the `default` profile with one authorized additional guest.

It contains no real production invitation code or guest identity.

```json
{
  "invitation": {
    "partyDisplayName": "The Example Household",
    "greeting": "Welcome, Example Household!",
    "wordingMode": "plural",
    "maximumAttendance": 3,
    "additionalGuestAllowance": 1,
    "questionProfile": "default",
    "deadline": "2027-03-01T23:59:00-05:00",
    "timeZone": "America/New_York"
  },
  "questions": [
    {
      "id": "eventAttendance",
      "scope": "party",
      "type": "checkbox-group",
      "label": "Event attendance",
      "labelVariants": {
        "singular": "I will be attending (check all that apply):",
        "plural": "We will be attending (check all that apply):"
      },
      "requiredOnInitial": false,
      "requiredWhenVisible": false,
      "options": [
        {
          "value": "ceremony",
          "label": "Ceremony"
        },
        {
          "value": "reception",
          "label": "Reception"
        }
      ],
      "displayCondition": {
        "always": true
      },
      "validation": {
        "allowedValues": [
          "ceremony",
          "reception"
        ],
        "maximumSelections": 2
      },
      "patchBehavior": {
        "omittedOnRevision": "leaveUnchanged",
        "replaceOperation": "replace"
      },
      "clearBehavior": {
        "when": {
          "fieldEquals": [
            "declineAttendance",
            true
          ]
        },
        "action": "clear"
      },
      "helpText": "For a revision, omission means leave the stored attendance selection unchanged."
    },
    {
      "id": "declineAttendance",
      "scope": "party",
      "type": "checkbox",
      "label": "Unable to attend",
      "labelVariants": {
        "singular": "Regretfully, I am unable to attend.",
        "plural": "Regretfully, we are unable to attend."
      },
      "requiredOnInitial": false,
      "requiredWhenVisible": false,
      "options": [
        {
          "value": true,
          "label": "Unable to attend"
        }
      ],
      "displayCondition": {
        "always": true
      },
      "validation": {
        "allowedValues": [
          true,
          false
        ]
      },
      "patchBehavior": {
        "omittedOnRevision": "leaveUnchanged",
        "replaceOperation": "replace"
      },
      "clearBehavior": {
        "whenValue": true,
        "clearQuestionIds": [
          "eventAttendance",
          "additionalGuestAttendance",
          "attendanceTotals",
          "dietaryPreferences"
        ]
      },
      "helpText": "Attendance and decline are mutually exclusive. A revision may omit this field to leave the stored status unchanged."
    },
    {
      "id": "additionalGuestAttendance",
      "scope": "party",
      "type": "radio",
      "label": "Will you be accompanied by a +1?",
      "requiredOnInitial": true,
      "requiredWhenVisible": true,
      "options": [
        {
          "value": "yes",
          "label": "Yes"
        },
        {
          "value": "no",
          "label": "No"
        }
      ],
      "displayCondition": {
        "not": {
          "fieldEquals": [
            "declineAttendance",
            true
          ]
        }
      },
      "validation": {
        "allowedValues": [
          "yes",
          "no"
        ],
        "configurationRequirement": {
          "additionalGuestAllowanceEquals": 1
        }
      },
      "patchBehavior": {
        "omittedOnRevision": "leaveUnchanged",
        "replaceOperation": "replace",
        "clearOperation": "clear"
      },
      "clearBehavior": {
        "when": {
          "fieldEquals": [
            "declineAttendance",
            true
          ]
        },
        "action": "clear"
      },
      "helpText": "No additional guest name is requested. Exact submission encoding is finalized in Phase 3 Step 8."
    },
    {
      "id": "attendanceTotals",
      "scope": "party",
      "type": "number-group",
      "label": "To better accommodate the seating & dietary needs of our guests, please list the total number of attendees in your party:",
      "requiredOnInitial": true,
      "requiredWhenVisible": true,
      "options": [],
      "displayCondition": {
        "not": {
          "fieldEquals": [
            "declineAttendance",
            true
          ]
        }
      },
      "validation": {
        "fields": [
          {
            "id": "adults21Plus",
            "label": "Adults, ages 21 and older",
            "wholeNumber": true,
            "minimum": 0
          },
          {
            "id": "youngAdults18To20",
            "label": "Young Adults, ages 18–20",
            "wholeNumber": true,
            "minimum": 0
          },
          {
            "id": "children3To17",
            "label": "Children, ages 3–17",
            "wholeNumber": true,
            "minimum": 0
          },
          {
            "id": "childrenUnder3",
            "label": "Children under 3",
            "wholeNumber": true,
            "minimum": 0
          }
        ],
        "sumMaximumFrom": "invitation.maximumAttendance"
      },
      "patchBehavior": {
        "omittedOnRevision": "leaveUnchanged",
        "omittedNestedFieldOnRevision": "leaveUnchanged",
        "replaceOperation": "replace",
        "explicitZero": "replace"
      },
      "clearBehavior": {
        "when": {
          "fieldEquals": [
            "declineAttendance",
            true
          ]
        },
        "action": "clear"
      },
      "helpText": "The four-category sum represents the complete attending party, including every attending additional guest, and must not exceed maximumAttendance."
    },
    {
      "id": "dietaryPreferences",
      "scope": "party",
      "type": "textarea",
      "label": "Please list any food allergies or dietary preferences for the members of your party.",
      "requiredOnInitial": false,
      "requiredWhenVisible": false,
      "options": [],
      "displayCondition": {
        "not": {
          "fieldEquals": [
            "declineAttendance",
            true
          ]
        }
      },
      "validation": {
        "maximumLength": 1000
      },
      "patchBehavior": {
        "omittedOnRevision": "leaveUnchanged",
        "replaceOperation": "replace",
        "clearOperation": "clear"
      },
      "clearBehavior": {
        "when": {
          "fieldEquals": [
            "declineAttendance",
            true
          ]
        },
        "action": "clear"
      },
      "helpText": "One free-text response applies to the entire party. Do not create per-person dietary fields."
    },
    {
      "id": "confirmationMethod",
      "scope": "operational",
      "type": "radio",
      "label": "Confirmation method",
      "requiredOnInitial": true,
      "requiredWhenVisible": true,
      "options": [
        {
          "value": "email",
          "label": "Email"
        },
        {
          "value": "textMessage",
          "label": "Text message"
        }
      ],
      "displayCondition": {
        "always": true
      },
      "validation": {
        "allowedValues": [
          "email",
          "textMessage"
        ]
      },
      "patchBehavior": {
        "omittedOnRevision": "invalidWhenRequired",
        "replaceOperation": "replace"
      },
      "clearBehavior": {
        "bySelectedValue": {
          "email": [
            "confirmationMobile",
            "smsAuthorization"
          ],
          "textMessage": [
            "confirmationEmail"
          ]
        }
      },
      "helpText": "Required for every initial submission and revision. The newly submitted method replaces the stored method."
    },
    {
      "id": "confirmationEmail",
      "scope": "operational",
      "type": "email",
      "label": "Email address",
      "requiredOnInitial": false,
      "requiredWhenVisible": true,
      "options": [],
      "displayCondition": {
        "fieldEquals": [
          "confirmationMethod",
          "email"
        ]
      },
      "validation": {
        "format": "email"
      },
      "patchBehavior": {
        "omittedOnRevision": "invalidWhenRequired",
        "replaceOperation": "replace"
      },
      "clearBehavior": {
        "when": {
          "fieldNotEquals": [
            "confirmationMethod",
            "email"
          ]
        },
        "action": "clear"
      },
      "helpText": "Required when Email is selected. The complete current RSVP will be sent to the newly entered address."
    },
    {
      "id": "confirmationMobile",
      "scope": "operational",
      "type": "tel",
      "label": "SMS-capable mobile number",
      "requiredOnInitial": false,
      "requiredWhenVisible": true,
      "options": [],
      "displayCondition": {
        "fieldEquals": [
          "confirmationMethod",
          "textMessage"
        ]
      },
      "validation": {
        "format": "sms-capable-mobile-number"
      },
      "patchBehavior": {
        "omittedOnRevision": "invalidWhenRequired",
        "replaceOperation": "replace"
      },
      "clearBehavior": {
        "when": {
          "fieldNotEquals": [
            "confirmationMethod",
            "textMessage"
          ]
        },
        "action": "clear"
      },
      "helpText": "Required when Text message is selected. The complete current RSVP will be sent to the newly entered mobile number."
    },
    {
      "id": "smsAuthorization",
      "scope": "operational",
      "type": "consent",
      "label": "Transactional text-message authorization",
      "requiredOnInitial": false,
      "requiredWhenVisible": true,
      "options": [
        {
          "value": true,
          "label": "I authorize the required transactional RSVP confirmation text message."
        }
      ],
      "displayCondition": {
        "all": [
          {
            "fieldEquals": [
              "confirmationMethod",
              "textMessage"
            ]
          },
          {
            "configurationEquals": [
              "smsAuthorizationRequired",
              true
            ]
          }
        ]
      },
      "validation": {
        "requiredValue": true
      },
      "patchBehavior": {
        "omittedOnRevision": "invalidWhenRequired",
        "replaceOperation": "replace"
      },
      "clearBehavior": {
        "whenAny": [
          {
            "fieldNotEquals": [
              "confirmationMethod",
              "textMessage"
            ]
          },
          {
            "configurationEquals": [
              "smsAuthorizationRequired",
              false
            ]
          }
        ],
        "action": "clear"
      },
      "helpText": "Displayed and required only when the selected SMS process requires transactional authorization. Final provider-specific copy remains to be approved."
    }
  ],
  "confirmationOptions": {
    "email": true,
    "textMessage": true,
    "smsAuthorizationRequired": true
  }
}
```

### 5.5.6 Blank-Form Invariant

The lookup response is blank-form data regardless of whether the invitation already has a stored RSVP.

The response must never include or prefill:

* Previous Ceremony or Reception selections.
* Previous decline state.
* Previous additional-guest answer or count.
* Previous attendance totals.
* Previous dietary information.
* Previous confirmation method.
* Previous email address.
* Previous mobile number.
* Previous SMS-authorization state.
* Previous delivery status.
* Current or superseded RSVP versions.

The same lookup response structure is therefore usable before an initial submission and before a revision.

## 5.6 Lookup Status Codes

| Status                    | Preliminary meaning                                                                                                   |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `200 OK`                  | Valid active invitation; limited blank-form schema returned.                                                          |
| `400 Bad Request`         | Invitation-code input is malformed under the approved normalization rules.                                            |
| `404 Not Found`           | No authorized active invitation matches the normalized code.                                                          |
| `410 Gone`                | Online RSVP access is closed under the authoritative backend deadline when a lookup request is nevertheless received. |
| `429 Too Many Requests`   | Lookup attempt rate limit has been exceeded.                                                                          |
| `503 Service Unavailable` | The backend cannot presently complete invitation lookup.                                                              |

## 5.7 Inactive, Disabled, and Environment-Ineligible Codes

For the public lookup API, an invitation code that is:

* Inactive.
* Disabled.
* A development-only code used against production.
* A testing-only code used against production.
* Otherwise unavailable in the current environment.

must not reveal that such a private record exists.

For guest-facing lookup semantics, these conditions are treated as **no matching active invitation** and use:

`404 Not Found`

The API response and browser UI must not tell the guest whether the normalized code:

* Never existed.
* Exists but is inactive.
* Exists only in another environment.
* Was formerly active.
* Is a disabled testing record.

## 5.8 Malformed Versus Unknown Guest Experience

The API may distinguish malformed lookup input with `400` and no matching active invitation with `404`.

The guest-facing interface normally must not use those different status codes to disclose invitation-record information.

Malformed and unknown invitation codes use the same approved neutral guest-facing message:

> We could not locate an invitation associated with that code. Please check the code as printed on your invitation and try again.

The interface must not provide:

* A close-match suggestion.
* A “Did you mean?” code.
* A guest or party name.
* A one-character correction.
* Another invitation code.
* Invitation-record counts.
* Spreadsheet details.
* Internal identifiers.
* Backend implementation details.

## 5.9 Closed Lookup Behavior

The backend deadline is authoritative.

At or after the online RSVP deadline, a lookup request received from a stale browser state or other client must not return a personalized blank-form schema.

The closed-state lookup result is:

`410 Gone`

The browser should then display the approved closed-RSVP state rather than an editable personalized form.

## 5.10 Lookup Rate Limiting

Lookup is subject to the finalized Phase 3 Step 14 backend rate limit.

The initial production limit for:

`POST /wedding/api/rsvp/lookup`

is:

**Maximum 10 requests per 15-minute rolling window per client IP address.**

When the applicable limit is exceeded, the endpoint returns:

`429 Too Many Requests`

The response must:

* Use guest-safe wording.
* Reveal no invitation existence, near-match, active-status, environment, or record-count information.
* Include the same personalized-response no-store behavior required by Section 12.
* Include a `Retry-After` indication when supported by the selected rate-limiting implementation.

When the application is deployed behind a reverse proxy or tunnel, the client IP used for this limit must be derived only from the specifically configured trusted proxy chain. Express must not blindly trust arbitrary forwarded-address headers supplied by an untrusted client.

The exact rate-limiting library and internal counter-storage mechanism remain implementation choices so long as they satisfy this contract and do not place raw invitation codes or private RSVP information into ordinary logs.

## 5.11 Lookup Service Unavailable

When the backend knows it cannot complete invitation lookup, it returns:

`503 Service Unavailable`

The guest-facing application must then use the approved RSVP service-unavailable state.

That state must not expose:

* Stack traces.
* Google API errors.
* Workbook or worksheet names.
* Server filesystem paths.
* Credential information.
* Email-provider internals.
* Text-message-provider internals.
* Private invitation information.

The service-unavailable state must not imply that an RSVP was submitted or stored.

---

# 6. Initial or Revised RSVP Submission

## 6.1 Endpoint

`POST /wedding/api/rsvp/submit`

## 6.2 Purpose

This endpoint is the single submission endpoint for both:

* A guest's first online RSVP; and
* A later partial revision.

The backend, not React, determines which case applies.

The endpoint must:

1. Receive the invitation code in the request body.
2. Receive one client-generated submission identifier for duplicate-submission protection.
3. Receive the operational confirmation information required for the selected confirmation channel.
4. Receive the substantive RSVP changes being submitted.
5. Receive explicit `replace` or `clear` operations where required to distinguish an intended change from omission.
6. Independently normalize and revalidate the invitation code.
7. Verify that the invitation is active and authorized in the current environment.
8. Verify that server time remains before the RSVP deadline for a new logical submission.
9. Apply submission rate limiting and duplicate-submission protection.
10. Validate the selected confirmation method, destination, and applicable SMS authorization.
11. Validate every submitted RSVP field against the invitation's approved question profile.
12. Enforce the authorized `additionalGuestAllowance`.
13. Enforce the invitation's `maximumAttendance` where attendance totals belong to the selected profile.
14. Determine whether a current response already exists.
15. For an initial submission, require everything necessary to form a complete valid response.
16. For a revision, load the current stored response.
17. Merge submitted changes with the stored response.
18. Treat omitted RSVP fields as unchanged.
19. Apply authorized replacement, explicit-zero, attendance/decline, and clear semantics.
20. Apply the Phase 3 Step 9 dependency rules in Section 6.8, including automatic clearing of values made inapplicable by a full decline and rejection of unauthorized or invalid resulting states.
21. Validate the complete resulting RSVP.
22. Store one new RSVP version for one genuinely new logical submission or revision.
23. Update the authoritative current-response record.
24. Attempt the protected administrative email.
25. Attempt the guest's selected email or text-message confirmation.
26. Record delivery results separately from RSVP content.
27. Return the exact successful guest-facing result defined in this section.

## 6.3 Exact Request Envelope

The Step 8 request body has exactly four top-level properties:

1. `inviteCode`
2. `clientSubmissionId`
3. `confirmation`
4. `changes`

Normative shape:

```json
{
  "inviteCode": "DEV-002",
  "clientSubmissionId": "0de4c990-3cf5-4b51-b9c5-7a1f4d6bf3e2",
  "confirmation": {
    "method": "email",
    "email": "guest@example.com"
  },
  "changes": {}
}
```

The request does **not** include:

* `partyId`.
* `questionProfile`.
* `wordingMode`.
* `maximumAttendance`.
* `additionalGuestAllowance`.
* `active` or `environment`.
* A stored-response object.
* A current response version.
* `expectedVersion`.
* Administrative recipient information.

Those values are loaded or determined authoritatively by the backend.

Unknown top-level properties are not part of the Step 8 contract and may be rejected as a malformed request.

### 6.3.1 `inviteCode`

`inviteCode` is the manually entered invitation code.

The request may use the guest-entered display form. The backend independently applies the authoritative normalization rules defined in Phase 3 Step 2.

The client must not move the code into a route, query string, or URL fragment.

### 6.3.2 `clientSubmissionId`

`clientSubmissionId` is a client-generated UUID-form string identifying one logical submission attempt.

The client must:

* Generate one new identifier when the guest intentionally begins one new logical submission or revision.
* Keep that identifier stable while that logical submission is being sent.
* Reuse the same identifier for a safe retry after an uncertain network outcome.
* Generate a different identifier for a later, genuinely new RSVP change.

Synthetic example:

`0de4c990-3cf5-4b51-b9c5-7a1f4d6bf3e2`

The backend scopes idempotency to the normalized invitation and `clientSubmissionId` together.

The same identifier must not be reused for materially different request content. If the same invitation and identifier are received with a materially different `confirmation` or `changes` payload, the request is contradictory and may be rejected with `400 Bad Request` rather than creating another RSVP version.

### 6.3.3 No `expectedVersion` Field

The current Step 8 contract does **not** adopt client-supplied expected-version checking.

Therefore:

* `expectedVersion` is not a permitted request property.
* The blank lookup response continues to expose no current or stored RSVP version.
* A revision is merged against the authoritative current response that exists when the backend processes that distinct logical submission.
* The backend still increments its private RSVP version after a successful new logical submission or revision.
* Private administrative confirmation may include the resulting version, but the public browser request and success response do not need that value.
* `409 Conflict` is not part of the current production submission flow merely because another version exists.

A future expected-version or other optimistic-concurrency mechanism requires a later recorded decision and a revision to this contract.

## 6.4 Operational `confirmation` Object

Every initial submission and every revision must include a complete operational `confirmation` object for the newly selected guest-confirmation channel.

Operational confirmation data is separate from the substantive RSVP `changes` object.

The submitted operational values replace the applicable stored confirmation method, destination, and authorization state after validation.

### 6.4.1 Email Confirmation

When email is selected, the object is:

```json
{
  "method": "email",
  "email": "guest@example.com"
}
```

Rules:

* `method` must be `email`.
* `email` is required and must pass the backend's approved email validation.
* `mobile` is not part of an email confirmation object.
* `smsAuthorization` is not part of an email confirmation object.
* The newly submitted email address replaces the previously stored guest-confirmation destination after successful validation and storage.

### 6.4.2 Text-Message Confirmation

When text message is selected and transactional authorization is required, the object is:

```json
{
  "method": "textMessage",
  "mobile": "+15555550123",
  "smsAuthorization": true
}
```

Rules:

* `method` must be `textMessage`.
* `mobile` is required and must pass the backend's approved SMS-capable-number validation.
* `email` is not part of a text-message confirmation object.
* When the centralized configuration says SMS authorization is required, `smsAuthorization` must be present and must be `true`.
* When the centralized configuration says SMS authorization is not required, the field is omitted rather than used as a second guest-facing choice.
* The newly submitted mobile number and applicable authorization state replace their stored counterparts after successful validation and storage.

Supplying both email and mobile destinations does not authorize two guest-confirmation channels. The current system supports exactly one selected guest channel per submission: email or text message.

## 6.5 Exact `changes` Structure

`changes` is an object keyed by permanent substantive RSVP question ID.

The current permitted substantive keys are:

* `eventAttendance`
* `declineAttendance`
* `additionalGuestAttendance` when authorized by the invitation's selected profile and allowance.
* `attendanceTotals` when authorized by the selected profile.
* `dietaryPreferences`

A field omitted from `changes` means:

**Leave the stored RSVP value unchanged during a revision.**

Omission is never an implicit delete operation.

For an initial response, the backend ignores the revision meaning of omission and instead requires every field necessary to construct a complete valid initial RSVP for the applicable profile and resulting attendance state.

The `changes` object may be empty for a revision whose intended change is limited to the newly submitted operational confirmation method or destination. It cannot satisfy an initial RSVP by itself.

### 6.5.1 Permitted Operation Objects

Step 8 uses two operation names:

* `replace`
* `clear`

There is no separate `zero`, `decline`, or `delete` operation name.

A replacement object has the form:

```json
{
  "operation": "replace",
  "value": "replacement value"
}
```

Rules:

* `replace` requires a `value` property.
* The value must match the field's authorized type and validation rules.
* A numeric zero is an ordinary replacement value where zero is permitted.
* A Boolean decline change is an ordinary replacement of `declineAttendance`.

A clear object has the form:

```json
{
  "operation": "clear"
}
```

Rules:

* `clear` carries no `value` property.
* `clear` is used only when the applicable schema expressly permits explicit clearing.
* A clear request is principally a revision operation; an initial response has no stored answer to clear.
* A syntactically authorized clear operation can still be rejected if the complete merged RSVP would be invalid after the clear.

An unknown operation name is malformed.

A submitted question ID that is unknown, excluded from the invitation's profile, or otherwise unauthorized is an authorization failure even if its operation object is structurally well formed.

### 6.5.2 Attendance and Decline Pair

`eventAttendance` and `declineAttendance` jointly describe the party's controlling attendance state.

When an initial response is attending, the payload includes both:

```json
{
  "eventAttendance": {
    "operation": "replace",
    "value": ["ceremony", "reception"]
  },
  "declineAttendance": {
    "operation": "replace",
    "value": false
  }
}
```

The `eventAttendance` replacement may contain:

* `"ceremony"`
* `"reception"`
* Both values.

When an initial response is declining, the payload includes both:

```json
{
  "eventAttendance": {
    "operation": "replace",
    "value": []
  },
  "declineAttendance": {
    "operation": "replace",
    "value": true
  }
}
```

For a revision:

* If the guest is not changing the attendance/decline state, both fields may be omitted and remain unchanged.
* If the guest intentionally changes attendance or decline, the client should submit the complete intended pair so the desired controlling state does not depend on hidden stored values.
* A nonempty attendance selection and `declineAttendance: true` are contradictory and invalid.
* A resulting state with no event selected and decline not selected is invalid when a complete attendance/decline decision is required.

Detailed dependent-value clearing caused by this pair is governed by the finalized Phase 3 Step 9 rules in Section 6.8.

### 6.5.3 `additionalGuestAttendance`

The exact replacement value depends on the authoritative invitation configuration.

For `questionProfile: "default"` with `additionalGuestAllowance: 1`:

```json
{
  "additionalGuestAttendance": {
    "operation": "replace",
    "value": "yes"
  }
}
```

or:

```json
{
  "additionalGuestAttendance": {
    "operation": "replace",
    "value": "no"
  }
}
```

For `questionProfile: "default"` with `additionalGuestAllowance` greater than `1`, the replacement value is a nonnegative whole number from zero through the configured allowance:

```json
{
  "additionalGuestAttendance": {
    "operation": "replace",
    "value": 2
  }
}
```

An explicit zero is represented as:

```json
{
  "additionalGuestAttendance": {
    "operation": "replace",
    "value": 0
  }
}
```

The field is unauthorized when:

* The allowance is `0`; or
* The substantive profile is `reduced-attendance-dietary`.

The client must never submit an additional guest's name.

Where the Step 6 schema permits `clear`, an explicit clear uses:

```json
{
  "additionalGuestAttendance": {
    "operation": "clear"
  }
}
```

The final merged response must still be valid. When an attending state continues to require an additional-guest response, `"no"` or numeric `0` is the ordinary way to express that no additional guest will attend.

### 6.5.4 `attendanceTotals`

`attendanceTotals` is authorized only by the `default` substantive profile.

Its four permanent nested keys are:

* `adults21Plus`
* `youngAdults18To20`
* `children3To17`
* `childrenUnder3`

For an initial attending response, all four values are supplied:

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

Every value must be a nonnegative whole number.

For a revision, the Step 6 grouped-field patch behavior permits a replacement object to contain only the nested categories that intentionally change. Omitted nested categories remain unchanged.

For example, replacing a prior positive children age-category value with zero is:

```json
{
  "attendanceTotals": {
    "operation": "replace",
    "value": {
      "children3To17": 0
    }
  }
}
```

This is the required **explicit-zero** representation. Zero is a replacement value, not omission and not a separate operation.

The backend validates the complete merged four-category result and the resulting overall attendance total against `maximumAttendance` and all applicable dependency rules.

`clear` is not a direct client operation for `attendanceTotals` in the form schema. Under the finalized Step 9 rules, a full decline automatically removes attendance totals as inapplicable before final validation.

### 6.5.5 `dietaryPreferences`

A new or replacement dietary response uses:

```json
{
  "dietaryPreferences": {
    "operation": "replace",
    "value": "One guest has a tree-nut allergy."
  }
}
```

The value is one party-level string and remains subject to the configured text-length and content validation.

To remove a previously stored dietary response, the revision uses:

```json
{
  "dietaryPreferences": {
    "operation": "clear"
  }
}
```

An omitted `dietaryPreferences` key during a revision means leave the stored value unchanged.

A blank string is not the documented clearing mechanism. The client should use the explicit `clear` operation when the guest intentionally removes the prior response.

## 6.6 Initial Submission Requirements and Examples

The backend determines that the request is an initial submission when the invitation has no current stored RSVP.

An initial submission must contain everything required to produce one complete valid response under the authoritative invitation configuration and the resulting attendance state.

### 6.6.1 Default Profile, Allowance One, Email Confirmation

The following example uses the fictional development configuration `DEV-002` from `docs/rsvp-example-configurations.json`.

```json
{
  "inviteCode": "DEV-002",
  "clientSubmissionId": "0de4c990-3cf5-4b51-b9c5-7a1f4d6bf3e2",
  "confirmation": {
    "method": "email",
    "email": "guest@example.com"
  },
  "changes": {
    "eventAttendance": {
      "operation": "replace",
      "value": ["ceremony", "reception"]
    },
    "declineAttendance": {
      "operation": "replace",
      "value": false
    },
    "additionalGuestAttendance": {
      "operation": "replace",
      "value": "yes"
    },
    "attendanceTotals": {
      "operation": "replace",
      "value": {
        "adults21Plus": 2,
        "youngAdults18To20": 0,
        "children3To17": 1,
        "childrenUnder3": 0
      }
    },
    "dietaryPreferences": {
      "operation": "replace",
      "value": "One guest has a tree-nut allergy."
    }
  }
}
```

The example contains no additional-guest name.

### 6.6.2 Default Profile, Allowance Greater Than One

The following fragment shows the additional-guest representation for the fictional `DEV-003` configuration:

```json
{
  "additionalGuestAttendance": {
    "operation": "replace",
    "value": 2
  }
}
```

The server loads the actual allowance from private configuration and rejects a negative, fractional, or above-allowance count.

### 6.6.3 Reduced Profile, Text-Message Confirmation

The following example uses the fictional `DEV-004` reduced-profile configuration.

```json
{
  "inviteCode": "DEV-004",
  "clientSubmissionId": "4bd1926b-938b-47ce-85bb-036c84ca06dc",
  "confirmation": {
    "method": "textMessage",
    "mobile": "+15555550123",
    "smsAuthorization": true
  },
  "changes": {
    "eventAttendance": {
      "operation": "replace",
      "value": ["ceremony"]
    },
    "declineAttendance": {
      "operation": "replace",
      "value": false
    },
    "dietaryPreferences": {
      "operation": "replace",
      "value": "Vegetarian options requested."
    }
  }
}
```

The reduced-profile payload contains no:

* `additionalGuestAttendance`.
* `attendanceTotals`.
* Additional-guest name.
* Named-guest attendance field.

### 6.6.4 Initial Decline

A complete initial decline uses the attendance/decline pair:

```json
{
  "eventAttendance": {
    "operation": "replace",
    "value": []
  },
  "declineAttendance": {
    "operation": "replace",
    "value": true
  }
}
```

Other attendance-dependent substantive fields are omitted from the initial request. Under Section 6.8, the resulting declined state contains `eventAttendance: []`, `declineAttendance: true`, `dietaryPreferences: null`, and no additional-guest or attendance-total fields.

## 6.7 Partial Revision Requirements and Examples

When a current RSVP exists, the backend treats a new logical request as a revision.

For every revision:

* `inviteCode` is re-entered and revalidated.
* A new `clientSubmissionId` identifies that new logical revision.
* A complete operational `confirmation` object is entered again.
* Submitted operational confirmation values replace their stored counterparts.
* Only substantive fields intentionally being changed need to appear in `changes`.
* Omitted substantive fields remain unchanged.
* The backend loads the current response, applies the submitted operations, performs required dependent adjustments, and validates the complete resulting RSVP before storage.

### 6.7.1 Partial Revision with Explicit Zero and Dietary Clear

```json
{
  "inviteCode": "DEV-002",
  "clientSubmissionId": "49cf96ba-69a6-44d5-95f8-df54aa39b9af",
  "confirmation": {
    "method": "textMessage",
    "mobile": "+15555550123",
    "smsAuthorization": true
  },
  "changes": {
    "attendanceTotals": {
      "operation": "replace",
      "value": {
        "children3To17": 0
      }
    },
    "dietaryPreferences": {
      "operation": "clear"
    }
  }
}
```

In this example:

* Omitted attendance selections remain unchanged.
* Omitted decline state remains unchanged.
* Omitted additional-guest status remains unchanged.
* Omitted age categories within `attendanceTotals` remain unchanged.
* `children3To17: 0` explicitly replaces the prior value for that category.
* The `clear` operation removes the stored dietary response.
* The new text-message confirmation data replaces the stored operational confirmation data after the revision is validated and stored.

### 6.7.2 Attendance-to-Decline Revision

When the guest intentionally changes the controlling attendance state to decline, the client submits the intended pair:

```json
{
  "changes": {
    "eventAttendance": {
      "operation": "replace",
      "value": []
    },
    "declineAttendance": {
      "operation": "replace",
      "value": true
    }
  }
}
```

The backend then applies the authoritative dependency rules in Section 6.8: any stored additional-guest response and attendance totals become inapplicable, and any stored dietary response is cleared.

### 6.7.3 Decline-to-Attendance Revision

When the guest intentionally changes from decline to attendance, the client submits the intended pair:

```json
{
  "changes": {
    "eventAttendance": {
      "operation": "replace",
      "value": ["reception"]
    },
    "declineAttendance": {
      "operation": "replace",
      "value": false
    }
  }
}
```

The revision must also supply any newly applicable required substantive fields under Section 6.8. For the default profile, that means all four attendance-total categories and the applicable additional-guest response when the allowance is positive; the dietary response remains optional. The reduced profile requires neither additional-guest data nor attendance totals.

### 6.7.4 Confirmation-Channel-Only Revision

A returning guest may change the operational confirmation method or destination without changing a substantive RSVP answer.

For that case, `changes` may be empty:

```json
{
  "inviteCode": "DEV-002",
  "clientSubmissionId": "d970852a-b59b-4603-b0dc-d2e185d62c8f",
  "confirmation": {
    "method": "email",
    "email": "updated@example.com"
  },
  "changes": {}
}
```

The backend still loads and validates the complete current RSVP and stores the revision according to the ordinary revision rules.

## 6.8 Submission Revalidation, Merge, and Authoritative Dependency Processing

A successful lookup does not authorize a later submission.

Phase 3 Step 9 finalizes the dependency behavior that follows the Step 8 request and operation model.

### 6.8.1 Processing Order

For a genuinely new logical submission or revision, the backend performs this sequence:

1. Normalize and structurally validate `inviteCode`.
2. Confirm that the invitation is active and authorized in the current environment.
3. Apply submission rate limiting.
4. Validate `clientSubmissionId`.
5. Apply idempotency handling for a previously processed materially identical logical submission.
6. Enforce the authoritative RSVP deadline for a new logical submission.
7. Load the authoritative invitation configuration and approved question profile.
8. Validate the operational `confirmation` object and applicable destination/authorization.
9. Reject unknown or profile-inapplicable `changes` keys.
10. Validate every submitted operation object.
11. Reject `additionalGuestAttendance` when the profile or allowance does not authorize it.
12. Reject `attendanceTotals` for `reduced-attendance-dietary`.
13. Determine whether a current RSVP exists.
14. For a revision, load the current stored RSVP.
15. Apply submitted `replace` and authorized `clear` operations.
16. During a revision, preserve omitted substantive fields and omitted nested attendance-total categories.
17. Resolve the complete intended attendance/decline state.
18. Apply the dependent-value rules below, including automatic removal of values made inapplicable by a full decline.
19. Determine whether any mandatory substantive value has become newly applicable and require it.
20. Validate the applicable additional-guest response.
21. Validate complete attendance totals and `maximumAttendance` when those fields are applicable.
22. Validate party-level dietary text when present.
23. Validate the complete resulting substantive RSVP.
24. If any required validation fails, return a guest-safe error without writing a new RSVP version.
25. Otherwise, write one new version and update the current-response record atomically where practical.
26. Record whether the action was initial or revision.
27. Store the newly submitted operational confirmation values with the new current response as applicable.
28. Attempt confirmations only after storage succeeds.
29. Record delivery results separately.
30. Return the successful response defined in Section 6.9.

Authorization occurs before dependency clearing. A field that the authoritative profile or allowance does not authorize is not made acceptable merely because another submitted answer would hide it.

### 6.8.2 Attendance and Decline Matrix

A complete RSVP has exactly one of these controlling states:

| Resulting state | `eventAttendance` | `declineAttendance` | Result |
| --- | --- | --- | --- |
| Attending | `["ceremony"]`, `["reception"]`, or both | `false` | Valid controlling state |
| Declining | `[]` | `true` | Valid controlling state |
| Contradictory | One or more events | `true` | `400 Bad Request` |
| No decision | `[]` | `false` | `400 Bad Request` when a complete state is required |

For an initial response, the request must establish a valid controlling state.

For a revision:

* If the guest intentionally changes the controlling state, the client sends the complete intended pair as defined in Step 8.
* If the guest does not change the controlling state, both fields may be omitted and the stored pair remains unchanged.
* The backend never infers an attending state from dependent values such as totals or dietary text.

### 6.8.3 Full Decline

When the complete resulting RSVP is a full decline:

* `eventAttendance` is normalized to `[]`.
* `declineAttendance` is `true`.
* Any applicable `additionalGuestAttendance` is removed as inapplicable.
* Any applicable `attendanceTotals` object is removed as inapplicable.
* Any stored or newly supplied `dietaryPreferences` is cleared.
* The successful guest-facing complete RSVP reports `dietaryPreferences: null`.
* The successful guest-facing complete RSVP omits `additionalGuestAttendance`, `attendanceTotals`, and `overallAttendance`.

Attendance totals are not retained as a synthetic four-zero object merely to preserve a field that is no longer applicable.

A stale stored dependent value must therefore not survive an attendance-to-decline revision.

If a request contains profile-authorized dependent values together with a valid full-decline pair, those values are not retained after dependency processing. React should ordinarily omit the now-inapplicable controls.

An otherwise unauthorized field—such as an additional-guest field for allowance zero or the reduced profile—remains a `403 Forbidden` authorization failure even when the request also declines.

Operational confirmation remains required for a decline.

### 6.8.4 Attending Result and Newly Applicable Fields

An attending result has:

* One or more event selections; and
* `declineAttendance: false`.

For either approved profile, `dietaryPreferences` is applicable to any attending state:

* Ceremony only.
* Reception only.
* Both Ceremony and Reception.

Dietary applicability is **not** restricted to Reception attendance. The field remains optional.

For `default`:

* `attendanceTotals` is applicable and required whenever the result is attending.
* If `additionalGuestAllowance > 0`, `additionalGuestAttendance` is applicable and required whenever the result is attending.
* If `additionalGuestAllowance == 0`, no additional-guest response is authorized.

For `reduced-attendance-dietary`:

* `additionalGuestAttendance` is never applicable.
* `attendanceTotals` is never applicable.

When a revision changes from decline to attendance, previously cleared mandatory fields become newly applicable. The revision must therefore supply:

* For `default`, all four attendance-total categories.
* For `default` with a positive allowance, the applicable additional-guest response.
* No additional-guest or attendance-total value for the reduced profile.

Dietary text may be supplied during the transition but is optional.

When a revision remains attending, ordinary Step 8 omission semantics continue to apply to already-applicable stored values.

### 6.8.5 Additional-Guest Rules

`additionalGuestAttendance` is authorized only for an attending `default`-profile RSVP whose authoritative `additionalGuestAllowance` is greater than zero.

For allowance `1`:

* `"yes"` means one attending additional guest.
* `"no"` means zero attending additional guests.

For allowance greater than `1`:

* The value must be a whole number.
* The minimum is `0`.
* The maximum is `additionalGuestAllowance`.

Negative values, fractional values, and above-allowance values are invalid.

For allowance `0` or the reduced profile, submitting `additionalGuestAttendance` is unauthorized.

When the field is applicable, an initial response or a decline-to-attendance revision must provide it.

A direct Step 8 `clear` operation cannot leave a continuing attending response without this required value. To state that no additional guest is attending, the client uses `"no"` for allowance one or numeric `0` for a larger allowance.

When the party fully declines, the field is automatically removed.

For an attending default-profile response, the effective additional-guest count must not exceed `overallAttendance`, because the age-category totals represent the complete attending party.

Changing an additional-guest response does not authorize the server to guess which age category should change. The complete merged attendance totals must independently remain valid.

### 6.8.6 Attendance-Total Rules

`attendanceTotals` is authorized only for an attending `default`-profile RSVP.

The required categories are:

* `adults21Plus`
* `youngAdults18To20`
* `children3To17`
* `childrenUnder3`

For an initial attending response, and whenever totals become newly applicable after a prior decline:

* All four categories must be present.
* Every category must be a nonnegative whole number.
* Explicit zero is valid.
* `overallAttendance` is the server-calculated sum of all four categories.
* `overallAttendance` must be at least `1`.
* `overallAttendance` must not exceed the authoritative `maximumAttendance`.

For a revision that remains attending, the grouped replacement object may contain only the categories intentionally changed. Omitted nested categories remain unchanged, after which the backend recalculates and validates the complete totals object.

If an additional-guest response is applicable, its effective attending additional-guest count must not exceed `overallAttendance`.

`attendanceTotals` is unauthorized for `reduced-attendance-dietary`.

There is no direct Step 8 client `clear` operation for `attendanceTotals`. A full decline automatically removes the totals as inapplicable.

### 6.8.7 Dietary Rules

`dietaryPreferences` is one optional party-level free-text value under both approved substantive profiles.

For any attending state:

* A string value may be supplied whether the party attends Ceremony, Reception, or both.
* The value remains subject to the configured `1000`-character maximum.
* `replace` stores a new value.
* An authorized `clear` removes the stored value during a revision.
* Revision omission leaves the stored value unchanged.

Dietary information is not conditioned on Reception attendance.

When the complete resulting RSVP is a full decline, any stored dietary information is automatically cleared before storage. The complete guest-facing declined RSVP reports `dietaryPreferences: null`.

The API does not create or accept per-person dietary fields.

### 6.8.8 Closed Profile Rules

For `default`, the possible substantive fields are:

* `eventAttendance`
* `declineAttendance`
* `additionalGuestAttendance` only when the allowance is positive and the result is attending
* `attendanceTotals` when attending
* `dietaryPreferences` when attending

For `reduced-attendance-dietary`, the only substantive fields are:

* `eventAttendance`
* `declineAttendance`
* `dietaryPreferences` when attending

The reduced profile never accepts an additional-guest response or attendance totals.

No other substantive question becomes authorized through client state or conditional rendering.

### 6.8.9 Operational Confirmation Dependencies

The operational `confirmation` object is required for every initial submission and revision under either substantive profile.

When `method` is `email`:

* `email` is required and must be valid.
* `mobile` is not permitted in the object.
* `smsAuthorization` is not permitted in the object.

When `method` is `textMessage`:

* `mobile` is required and must pass the approved SMS-capable-number validation.
* `email` is not permitted in the object.
* When centralized configuration requires transactional SMS authorization, `smsAuthorization` must be present and `true`.
* When authorization is not required, `smsAuthorization` is omitted.

After successful storage, the newly submitted method, destination, and applicable authorization state replace the stored operational values for the current RSVP.

### 6.8.10 Error Classification at the Dependency Boundary

Step 9 does not freeze the exact guest-facing API field-error object. Phase 3 Step 10 now finalizes the browser-side Validation Failure interpretation of these outcomes, while this contract continues to leave the exact detailed error-body shape unfrozen unless a later implementation decision requires it. Step 9 does finalize the applicable status families.

`403 Forbidden` is appropriate for a structurally processable request that submits a substantive field or operation the authoritative invitation never authorizes, including:

* `additionalGuestAttendance` for allowance `0`.
* `additionalGuestAttendance` for `reduced-attendance-dietary`.
* `attendanceTotals` for `reduced-attendance-dietary`.
* An unknown or otherwise profile-inapplicable substantive question.

`400 Bad Request` is appropriate for malformed, contradictory, incomplete, or invalid data, including:

* A nonempty event selection combined with `declineAttendance: true`.
* An empty event selection combined with `declineAttendance: false` when a complete state is required.
* A missing newly applicable additional-guest response.
* Missing newly applicable default-profile attendance-total categories.
* Negative, fractional, or above-allowance additional-guest values when the field is otherwise authorized.
* Negative, fractional, incomplete, zero-total attending, or above-maximum attendance totals.
* An effective additional-guest count greater than overall attendance.
* Invalid dietary text.
* An invalid or incomplete operational confirmation object.

Automatic dependent clearing is not itself an error. It is the backend normalization required when a valid controlling full-decline state makes previously applicable substantive values inapplicable.

The backend must apply the same authoritative rules regardless of what React displayed or hid.

## 6.9 Exact Successful Submission Response

A successful response has exactly five top-level properties:

1. `submission`
2. `invitation`
3. `rsvp`
4. `confirmation`
5. `revisionPolicy`

The successful response does not echo:

* The invitation code.
* `clientSubmissionId`.
* Guest confirmation email address.
* Guest confirmation mobile number.
* SMS authorization content.
* Private RSVP version.
* `partyId`.
* Workbook row numbers.
* Administrative recipient address.
* Provider credentials or internals.

### 6.9.1 `submission`

The `submission` object contains:

* `recorded` — always `true` for a `200` or `201` success response under this contract.
* `action` — `initial` or `revision`, reflecting the action the backend stored for the logical submission.
* `idempotentRepeat` — `true` only when this HTTP response is replaying a previously processed logical submission rather than writing another version.
* `recordedAt` — the authoritative server timestamp for the stored logical submission in ISO 8601 form.

Example:

```json
{
  "recorded": true,
  "action": "initial",
  "idempotentRepeat": false,
  "recordedAt": "2026-08-19T20:30:00Z"
}
```

### 6.9.2 `invitation`

The successful response may contain only the guest-facing invitation context needed by the temporary confirmation experience:

* `partyDisplayName`
* `wordingMode`
* `questionProfile`

It does not return the production invitation code or private party identifier.

### 6.9.3 `rsvp`

`rsvp` is the complete guest-facing RSVP resulting from this logical submission after all merge and validation work.

It always contains:

* `eventAttendance` — the resulting Ceremony/Reception array, which may be empty for a decline.
* `declineAttendance` — the resulting Boolean decline state.
* `dietaryPreferences` — the resulting party-level string or `null` when no dietary response is stored.

It conditionally contains:

* `additionalGuestAttendance` only when that field is authorized and remains applicable to the resulting RSVP.
* `attendanceTotals` only when those totals are authorized and remain applicable to the resulting RSVP.
* `overallAttendance` when `attendanceTotals` is present; this is the backend-calculated sum of the four age-category values.

The response omits profile-inapplicable substantive fields rather than inventing zero, blank, disabled, or `N/A` placeholders merely because another profile uses them.

Conditional applicability after attendance/decline changes is finalized in Section 6.8.

### 6.9.4 `confirmation`

The `confirmation` object contains guest-safe delivery information:

* `method` — `email` or `textMessage`.
* `guestDeliveryStatus` — `sent`, `failed`, or `uncertain`.
* `administrativeDeliveryStatus` — `sent`, `failed`, or `uncertain`.
* `deliveryWarning` — `true` when either delivery status is `failed` or `uncertain`; otherwise `false`.

The response identifies the selected method but does not echo the email address or mobile number.

The administrative status does not expose the protected administrative destination.

### 6.9.5 `revisionPolicy`

The `revisionPolicy` object contains the public information needed to support the confirmation page's revision instructions:

* `mayRevise` — whether online revisions remain available under the authoritative server deadline at the time of the response.
* `deadline` — `2027-03-01T23:59:00-05:00` under the currently approved deadline.
* `timeZone` — `America/New_York`.
* `assistanceEmail` — `RSVPhelp@loreweavercreations.com`.

Guest-facing prose explaining how to revise remains governed by the approved content inventory and interface documentation.

### 6.9.6 Successful Initial Submission Example

A successfully stored initial RSVP normally returns `201 Created`.

```json
{
  "submission": {
    "recorded": true,
    "action": "initial",
    "idempotentRepeat": false,
    "recordedAt": "2026-08-19T20:30:00Z"
  },
  "invitation": {
    "partyDisplayName": "The Example Household",
    "wordingMode": "plural",
    "questionProfile": "default"
  },
  "rsvp": {
    "eventAttendance": ["ceremony", "reception"],
    "declineAttendance": false,
    "additionalGuestAttendance": "yes",
    "attendanceTotals": {
      "adults21Plus": 2,
      "youngAdults18To20": 0,
      "children3To17": 1,
      "childrenUnder3": 0
    },
    "overallAttendance": 3,
    "dietaryPreferences": "One guest has a tree-nut allergy."
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

A successfully stored revision returns `200 OK` even if a post-storage confirmation attempt fails.

```json
{
  "submission": {
    "recorded": true,
    "action": "revision",
    "idempotentRepeat": false,
    "recordedAt": "2026-08-19T20:45:00Z"
  },
  "invitation": {
    "partyDisplayName": "The Example Household",
    "wordingMode": "plural",
    "questionProfile": "default"
  },
  "rsvp": {
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
  },
  "confirmation": {
    "method": "textMessage",
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

The browser must state that the RSVP was recorded and present a guest-safe delivery warning. It must not tell the guest to repeat a successfully stored RSVP merely because delivery failed.

### 6.9.8 Idempotent Successful Replay

When a previously successful logical submission is retried using the same invitation, the same `clientSubmissionId`, and materially the same request content:

* No new RSVP version is written.
* The request is not reclassified as a new revision.
* No duplicate confirmation delivery attempt is created merely because the HTTP request was replayed.
* The backend returns the recorded successful result with HTTP `200 OK`.
* `submission.action` remains the original `initial` or `revision` action.
* `submission.idempotentRepeat` is `true`.

The idempotent response is a replay of the logical submission result, not a command to mutate the RSVP again.

## 6.10 Submission Status Codes

| Status                    | Current Step 8 meaning                                                                                                                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `201 Created`             | A valid first RSVP was stored as the invitation's new current response.                                                                                                                      |
| `200 OK`                  | A valid revision was stored, or a repeated request using the same submission identifier was resolved idempotently without creating another RSVP version.                                     |
| `400 Bad Request`         | The request envelope or operation object is malformed, required initial or operational information is missing, the resulting state is contradictory, or one identifier is reused for different logical request content. |
| `403 Forbidden`           | The request attempts an unauthorized question, profile-inapplicable field, additional-guest value, clear operation, or other operation not authorized for the invitation.                   |
| `410 Gone`                | The authoritative RSVP deadline has passed for a new logical submission or revision.                                                                                                        |
| `429 Too Many Requests`   | Submission rate limit has been exceeded.                                                                                                                                                     |
| `503 Service Unavailable` | Core backend or storage processing is unavailable before successful RSVP storage can be confirmed.                                                                                           |

`409 Conflict` is not used by the current Step 8 contract because client-supplied expected-version checking is not adopted.

# 7. Submission Error Semantics

## 7.1 `400 Bad Request`

A `400` may be used when:

* The invitation-code input itself is malformed.
* The request body is malformed.
* A required top-level property is missing.
* An unsupported top-level request property is supplied.
* `clientSubmissionId` is missing or malformed.
* The same invitation and `clientSubmissionId` are reused with materially different logical request content.
* A `replace` operation omits its required `value`.
* A `clear` operation improperly includes a replacement `value`.
* An unknown operation name is supplied.
* Required initial-response content is missing.
* Required operational confirmation information is missing or malformed.
* The confirmation object contains contradictory channel data.
* Mutually contradictory RSVP values are submitted.
* Numeric values are invalid.
* The resulting complete RSVP cannot form a valid state for reasons that are not principally authorization failures.

Where useful, the response may carry guest-safe form-level or field-level validation information.

The error response must not reveal stored values omitted from a partial revision.

## 7.2 `403 Forbidden`

A `403` may be used when a structurally processable request attempts something the invitation is not authorized to do.

Examples include:

* Submitting an unknown substantive question ID.
* Submitting a question excluded from the invitation's approved profile.
* Supplying `additionalGuestAttendance` when none is authorized.
* Supplying an additional-guest count above the configured allowance.
* Supplying default-profile attendance totals to the approved reduced profile.
* Using `clear` for a field whose schema does not authorize that client operation.
* Attempting another field or operation not authorized for that invitation.
* Attempting to submit through an invitation code that does not authorize an active submission in the current environment.

The guest-facing result must not disclose private configuration details merely to explain the authorization failure.

## 7.3 `409 Conflict` — Not Used by the Current Contract

Phase 3 Step 4 reserved `409 Conflict` for a genuine version conflict **if** Step 8 later adopted expected-version checking.

Phase 3 Step 8 does not adopt that mechanism.

Therefore:

* `expectedVersion` is not accepted in the submission payload.
* The lookup response continues to expose no stored response version.
* The current RSVP submission flow does not emit `409` merely because another version exists or another device was used.
* Distinct logical revisions are merged against the authoritative current response present when each is processed.

A future optimistic-concurrency mechanism requires a new recorded decision and a revision to this contract before `409` becomes an active production submission result.

## 7.4 `410 Gone`

The backend enforces the RSVP deadline according to:

`America/New_York`

At or after:

**Monday, March 1, 2027, at 11:59 p.m. EST**

new online submissions and revisions are rejected.

The HTTP result is:

`410 Gone`

The guest's device clock or time zone cannot extend the backend deadline.

An idempotent replay of a logical submission that was already successfully stored is not a new RSVP mutation and is handled under the idempotency rules rather than by creating another version.

## 7.5 `429 Too Many Requests`

Submission is subject to the finalized Phase 3 Step 14 backend rate limits.

The initial production limits for:

`POST /wedding/api/rsvp/submit`

are:

1. **Maximum 6 requests per 15-minute rolling window per client IP address.**
2. **Maximum 6 requests per 15-minute rolling window per normalized invitation code.**

When either applicable limit is exceeded:

`429 Too Many Requests`

is returned.

The response must:

* Use guest-safe wording.
* Reveal no private invitation configuration, stored RSVP value, provider detail, or internal counter state.
* Include the personalized-response no-store behavior required by Section 12.
* Include a `Retry-After` indication when supported by the selected rate-limiting implementation.

The normalized-code limiter uses the backend's authoritative normalized invitation value internally. It does not authorize logging the raw or normalized invitation code in ordinary logs.

When deployed behind a reverse proxy or tunnel, the client IP used for the IP-based limit must come only from the configured trusted proxy chain.

Rate limiting does not change the existing storage, versioning, delivery, or idempotency rules:

* A rate-limited request creates no RSVP version.
* A rate-limited request starts no confirmation delivery attempt.
* A previously stored logical request remains stored.
* Safe retry of an uncertain logical submission continues to use the original `clientSubmissionId` under the existing idempotency model.
* Step 14 does not introduce `expectedVersion` or ordinary `409 Conflict` behavior.

The exact rate-limiting library and internal counter-storage mechanism remain implementation choices.

## 7.6 `503 Service Unavailable`

`503 Service Unavailable` is appropriate when the backend knows that the RSVP could not be completed because a required core operation is unavailable **before successful storage has been confirmed**.

Examples may include inability to complete required storage or a core backend dependency failure that prevents authoritative processing.

The browser uses the guest-safe service-unavailable state.

The response must not expose private provider, spreadsheet, credential, or server information.

# 8. Duplicate-Submission Protection and Idempotency

## 8.1 Client Submission Identifier

Every initial submission and revision uses the required top-level:

`clientSubmissionId`

The Step 8 contract uses a client-generated UUID-form string.

The identifier belongs to one logical RSVP action, not to the browser session and not permanently to the invitation.

The client generates a new identifier for a genuinely new logical submission or revision and preserves the same identifier for retries of that exact logical action.

## 8.2 Server Idempotency Key

The backend treats the normalized invitation key plus `clientSubmissionId` as the idempotency identity for one logical submission.

The backend may maintain a private request fingerprint or equivalent protected record so it can distinguish:

* A safe replay of the same logical request; from
* Incorrect reuse of the same identifier for materially different request content.

The fingerprint and idempotency records are private backend data and are not exposed through lookup responses or ordinary logs.

## 8.3 Same Identifier, Same Logical Submission

Repeated processing of the same invitation, the same `clientSubmissionId`, and materially the same logical request must not create multiple RSVP versions.

This includes repeats caused by:

* Double-clicking Submit.
* Rapid repeated activation.
* Client retry.
* Browser retry.
* An uncertain network outcome followed by a safe retry.

If the backend recognizes that the same logical submission was already processed successfully, it returns the recorded successful result rather than creating another RSVP version.

The HTTP status for such a safely resolved repeat is:

`200 OK`

The successful response sets:

```json
{
  "idempotentRepeat": true
}
```

inside the `submission` object while preserving the original `action` value.

## 8.4 Same Identifier, Different Logical Request

The same `clientSubmissionId` must not be repurposed for a materially different logical request for the same invitation.

For example, a client must not retry one identifier first with:

```json
{
  "dietaryPreferences": {
    "operation": "clear"
  }
}
```

and later reuse that same identifier for:

```json
{
  "dietaryPreferences": {
    "operation": "replace",
    "value": "Vegetarian options requested."
  }
}
```

That is not an idempotent retry. It is contradictory reuse of an idempotency identifier and may return:

`400 Bad Request`

The guest must use a new identifier for a new logical RSVP action.

## 8.5 Idempotent Repeat Does Not Become a Revision

A repeated request using the same logical submission identifier is not automatically treated as a new RSVP revision merely because the first processing already created or updated a response.

Only a genuinely new logical RSVP action receives a new submission identifier and may create a new response version.

An idempotent replay also does not create a duplicate guest or administrative confirmation attempt merely because the HTTP request was repeated. Authorized manual resend behavior remains separate from RSVP submission and does not change the RSVP version.

# 9. Known Service Failure Versus Uncertain Submission

A known service failure and an uncertain client outcome are not the same condition.

## 9.1 Known Pre-Storage Failure

When the server definitively reports:

`503 Service Unavailable`

before storage succeeds, the browser uses the service-unavailable state.

The UI must not claim that the RSVP was recorded.

## 9.2 Uncertain Client Outcome

If the browser loses the connection, times out locally, is closed, or otherwise fails to receive a definitive server response, the browser may be unable to know whether the backend stored the RSVP.

The absence of a response must not automatically be interpreted as:

* `503`.
* Successful storage.
* Failed storage.

The browser instead uses the **Submission Uncertain** state.

That state must:

* State that the outcome cannot yet be confirmed.
* Avoid claiming success or failure without evidence.
* Warn against blind repeated submission.
* Direct the guest to check the selected email or text-message destination.
* Provide the approved assistance method.
* Use the same original client submission identifier if a safe retry is offered.

A retry with the same identifier must remain idempotent.

---

# 10. Confirmation Delivery After Successful Storage

## 10.1 Delivery Attempts Are Post-Storage Operations

After the RSVP has been stored:

* The protected administrative email is attempted.
* The selected guest email or text message is attempted.
* Those attempts proceed independently.
* Each result is recorded separately.

Failure, delay, or uncertainty affecting one delivery attempt must not prevent the other applicable attempt merely because that first delivery failed.

The guest-facing successful API response uses the Step 8 `confirmation` object and reports each result only as:

* `sent`
* `failed`
* `uncertain`

Provider internals remain private.

## 10.2 Delivery Failure Is Still a Successful RSVP Result

A guest or administrative delivery failure after successful RSVP storage must not be returned as:

`503 Service Unavailable`

or another generic storage failure.

The API returns the appropriate successful RSVP status:

* `201 Created` for the successfully stored initial submission; or
* `200 OK` for the successfully stored revision or safely resolved idempotent repeat.

The successful response additionally sets the applicable delivery status and:

```json
{
  "deliveryWarning": true
}
```

inside the `confirmation` object whenever either reported delivery status is `failed` or `uncertain`.

## 10.3 Delivery Failure Must Not

A post-storage delivery failure must not:

* Roll back the RSVP.
* Create another RSVP version.
* Increment the version by itself.
* Change the current RSVP.
* Cause attendance to be counted twice.
* Tell the guest to repeat a successfully stored submission.

## 10.4 Guest and Administrative Delivery Information in the Public Response

The public success response may identify:

* The selected guest confirmation `method`.
* Guest delivery status.
* Limited administrative delivery status.
* Whether a guest-safe delivery warning is required.

It must not echo:

* The submitted guest email address.
* The submitted guest mobile number.
* SMS authorization content.
* The protected administrative address.
* Provider credentials or internal provider error details.

The complete private administrative confirmation may contain the information separately approved for the couple, including the private RSVP version and guest confirmation destination, because that email is protected correspondence rather than a public API response.

## 10.5 Step 13 Successful-Response Handoff to the Confirmation Route

The only ordinary source of a successful on-screen confirmation is the successful response returned by `POST /wedding/api/rsvp/submit` after authoritative storage and the applicable delivery attempts.

React passes the approved limited successful response into temporary navigation/application state while navigating to:

`/wedding/rsvp/confirmation`

The temporary state contains the existing five-property successful response:

1. `submission`
2. `invitation`
3. `rsvp`
4. `confirmation`
5. `revisionPolicy`

The confirmation route does not require the original submission request body merely to render a successful result. It therefore does not need the invitation code, `clientSubmissionId`, guest email address, guest mobile number, SMS-authorization content, private RSVP version, or protected administrative destination. Those values remain excluded from the public success response.

The confirmation route may render a successful confirmation state only when the temporary response is structurally usable as the approved successful response and reports:

`submission.recorded: true`

The browser selects the successful state from the response content rather than from HTTP status alone:

* `submission.action: "initial"` with `confirmation.deliveryWarning: false` → State 9 — Confirmed Initial Submission.
* `submission.action: "revision"` with `confirmation.deliveryWarning: false` → State 10 — Confirmed Revision.
* Either action with `confirmation.deliveryWarning: true` → State 11 — Stored with Delivery Warning while preserving the initial-versus-revision designation.

A safely replayed initial submission may return HTTP `200 OK` with `submission.action: "initial"` and `submission.idempotentRepeat: true`. The browser must therefore not classify every `200` success as a revision.

## 10.6 Step 13 Confirmation Refresh Fallback Is Not an API Recovery Operation

When `/wedding/rsvp/confirmation` loads without a structurally usable temporary successful-submission response, the browser enters State 12 — Confirmation Refresh Fallback.

This condition may occur after:

* A full page reload.
* Direct navigation to the confirmation route.
* Opening or bookmarking the confirmation route without the original temporary state.
* Opening the confirmation route in a new tab without temporary state.
* History traversal where the temporary response is no longer available.
* Any other route load in which the successful response is absent or unusable.

The browser does not need to determine why the state is unavailable.

State 12 does **not** represent a new API error status and does not itself prove whether storage succeeded or failed. The browser must not automatically:

* Repeat `POST /wedding/api/rsvp/submit`.
* Repeat `POST /wedding/api/rsvp/lookup`.
* Generate a new `clientSubmissionId`.
* Reuse a retained `clientSubmissionId` outside the explicit State 8 safe-retry workflow.
* Request a stored RSVP through an undocumented public endpoint.
* Infer successful storage merely because the confirmation route was reached.
* Infer failed storage merely because temporary state is absent.

The approved State 12 copy and browser-facing actions are finalized in `rsvp-system-design.md`, `page-outlines.md`, and `wireframes.md`. The API consequence is that **no new recovery request is required merely because temporary confirmation state is unavailable**.

## 10.7 No Confirmation-Recovery Token or Endpoint in the Initial Implementation

Phase 3 Step 13 adds no new public RSVP endpoint.

The initial implementation does not require:

* A short-lived confirmation token.
* A confirmation token in a route path, query string, or fragment.
* A public `GET` endpoint for retrieving the just-submitted RSVP.
* A public saved-RSVP view endpoint.
* A code-bearing confirmation URL.
* Persistent browser storage solely to reconstruct the successful confirmation summary after temporary state has been lost.

If later implementation testing identifies a concrete need for a recoverable confirmation-summary mechanism, that mechanism requires a new recorded decision and coordinated revisions to this contract, `rsvp-system-design.md`, route/privacy documentation, and `rsvp-test-cases.md` before implementation.

## 10.8 Deliberate Return to RSVP After State 12

The State 12 `Return to RSVP` action navigates to `/wedding/rsvp/` and begins an ordinary deliberate manual-entry interaction. It is not an automatic retry or recovery API call.

If online RSVP remains open, the guest may deliberately begin a new lookup and, if desired, a revision through the normal flow. If the authoritative deadline has passed, the ordinary RSVP route and backend `410 Gone` behavior remain controlling. State 12 does not reconstruct a lost `revisionPolicy` object or create a special deadline bypass.

# 11. Guest-Safe API Error Boundary

Backend errors must be translated into guest-safe API behavior.

Public responses must not expose unnecessary:

* Stack traces.
* Framework or library diagnostic output.
* Filesystem paths.
* Server usernames.
* Spreadsheet identifiers.
* Spreadsheet names.
* Worksheet names.
* Google API internals.
* Email-provider internals.
* SMS-provider internals.
* Full provider request or response payloads.
* Credential information.
* Private administrative recipient addresses.
* Private invitation notes.
* Other invitation records.
* Internal row or record identifiers.
* Close-match invitation-code information.
* Development/test-record existence.
* Rate-limit counter internals.

Malformed, unknown, inactive, disabled, development-only, and environment-ineligible invitation codes must continue to produce neutral guest-facing invalid-invitation behavior. The public flow must not provide fuzzy matching, close-match suggestions, a code-recovery search, or character-substitution guessing.

A known backend failure before storage can be confirmed continues to use the documented `503 Service Unavailable` behavior.

A request that exceeds an approved rate limit uses `429 Too Many Requests` without disclosing invitation existence or private counter information.

An uncertain browser-side submission outcome remains State 8 — Submission Uncertain rather than being converted into a fabricated server error.

Loss of temporary confirmation state remains State 12 — Confirmation Refresh Fallback rather than a new API error or automatic recovery request.

Detailed internal operational categories may be maintained privately only within the finalized Step 14 logging boundary in Section 12. They must not cause invitation codes, RSVP answers, dietary information, confirmation destinations, guest identities, `clientSubmissionId` values, or provider secrets to enter ordinary logs.

---

# 12. Finalized Personalized Response, Caching, Logging, Credential, and Transport Boundary

Phase 3 Step 14 finalizes the API-facing privacy and security boundaries in this section.

These rules apply without expanding the data already permitted by the Step 7 lookup response or Step 8 successful submission response.

### 12.1 Browser Isolation and Invited-Party Separation

A response associated with one validated invitation must never expose another invited party's information.

Lookup must return only the approved blank-form schema for the validated party.

Submission success must return only the approved complete current guest-facing RSVP and limited confirmation metadata for the submitting party.

The API must not expose:

* A public guest directory.
* A public invitation directory.
* A code-recovery search.
* A public saved-RSVP endpoint.
* A public RSVP-history endpoint.
* A public administrative endpoint.
* Another party's RSVP.
* Another party's confirmation destination.
* Another party's dietary information.

### 12.2 Invitation Codes Are Limited Access Tokens

Invitation codes are limited access tokens used to select one authorized blank RSVP configuration.

They are not passwords and must not be represented as equivalent to strong account authentication.

The API must not implement:

* Fuzzy invitation-code matching.
* Close-match suggestions.
* “Did you mean?” responses.
* Automatic `O`/`0` or similar character substitution.
* Code enumeration.
* A recovery endpoint that searches by guest identity.
* A personalized code-bearing GET route.

All existing backend normalization and exact-match authorization rules remain controlling.

### 12.3 Request-Body-Only Code Transport

Invitation codes remain permitted only in the approved request bodies for:

* `POST /wedding/api/rsvp/lookup`
* `POST /wedding/api/rsvp/submit`

They must not appear in:

* API path parameters.
* Browser paths.
* Query strings.
* URL fragments.
* Canonical URLs.
* Public metadata.
* Analytics payloads.
* Ordinary logs.

The API must not introduce a code-bearing confirmation or recovery URL.

### 12.4 Final Personalized Response Cache-Control

Every response from:

* `POST /wedding/api/rsvp/lookup`
* `POST /wedding/api/rsvp/submit`

must include:

`Cache-Control: no-store, max-age=0`

This applies to successful and unsuccessful responses, including `200`, `201`, `400`, `403`, `404`, `410`, `429`, and `503` outcomes as applicable.

The production browser responses serving:

* `/wedding/rsvp/`
* `/wedding/rsvp/confirmation`

must use the same `Cache-Control: no-store, max-age=0` policy.

Any later response containing invitation-specific form configuration, RSVP information, confirmation destination, confirmation status, or other personalized RSVP information must use equivalent no-store behavior.

Static versioned application assets containing no personalized or secret information are outside this no-store requirement and may use ordinary cache optimization.

The no-store policy does not authorize expanding a response payload.

### 12.5 Step 13 Temporary Confirmation State Remains Non-Persistent

The Step 13 successful-confirmation design remains unchanged.

The browser may carry the limited successful submission response through temporary React navigation/application state to:

`/wedding/rsvp/confirmation`

The application does not intentionally persist that successful response in:

* `localStorage`.
* `sessionStorage`.
* IndexedDB.
* Cookies.
* URL parameters.
* URL fragments.
* A newly created backend confirmation-token record.

solely to reconstruct the temporary confirmation after refresh.

If a structurally usable temporary successful response is unavailable, the browser enters State 12 rather than using an undocumented API recovery operation.

### 12.6 Search-Indexing and Metadata Boundary

The API does not rely on search-engine exclusion as authentication, but the production application must prevent or discourage public indexing of:

* `/wedding/rsvp/`
* `/wedding/rsvp/confirmation`
* `/wedding/not-found`
* Unmatched wedding routes
* Controlled personalized, transactional, error, warning, closed, and fallback RSVP states

The browser/server implementation must not place personalized values in titles, descriptions, canonical URLs, structured data, social-preview metadata, or other crawler-visible metadata.

The public `/wedding/privacy` route remains indexable.

No-index treatment supplements, and does not replace, backend authorization and response minimization.

### 12.7 Analytics Data-Minimization Boundary

Analytics instrumentation must not receive:

* Invitation codes.
* Guest or household identities derived from invitation records.
* RSVP answers.
* Attendance or decline values.
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
* Provider payloads.
* Private administrative identifiers.

If analytics are used on RSVP or confirmation routes, events must be limited to non-personalized aggregate interaction names.

Analytics must not be required to complete lookup, form rendering, submission, storage, confirmation delivery, or recovery.

### 12.8 Final Ordinary Logging Policy

Ordinary application, reverse-proxy, and delivery logs may record only operational information needed for service operation, such as:

* A server-generated request or correlation identifier.
* Timestamp.
* Endpoint or route category.
* HTTP status.
* Request duration.
* Generic error category.
* Guest-selected delivery channel without destination.
* Rate-limit event.
* Non-sensitive delivery outcome category.

Ordinary logs must not record:

* Raw invitation codes.
* Normalized invitation codes.
* Guest names or party display names.
* Lookup request bodies.
* Submission request bodies.
* Lookup response bodies.
* Submission response bodies.
* RSVP answers.
* Dietary or allergy text.
* Email addresses.
* Mobile numbers.
* Confirmation destinations.
* `clientSubmissionId` values.
* Spreadsheet rows or worksheet contents.
* Private administrative notes.
* Google credentials.
* Email credentials.
* SMS credentials.
* Provider secrets.
* Full provider request or response payloads.

Request-body logging for RSVP POST endpoints must therefore be disabled in ordinary middleware/proxy logs.

### 12.9 Restricted Diagnostic Correlation

Routine troubleshooting must use the non-sensitive operational data allowed by Section 12.8 whenever possible.

When a specific secured investigation genuinely requires correlation to one invitation, a non-reversible keyed pseudonymous invitation identifier may be used instead of a raw invitation code.

Such diagnostic logging must be:

* Explicitly enabled.
* Access-restricted.
* Limited to the minimum necessary fields.
* Time-limited.
* Disabled when the investigation ends.
* Removed or retired when no longer required.

This exception does not authorize ordinary logging of raw invitation codes, RSVP answers, dietary information, confirmation destinations, or provider secrets.

### 12.10 Trusted Reverse-Proxy Boundary

The production deployment may operate behind a reverse proxy or tunnel.

Per-IP rate limiting must use client-address information only from the specifically configured trusted proxy chain.

Express must not blindly trust arbitrary forwarded-address headers supplied directly by an untrusted client.

The exact deployment-specific proxy configuration is an implementation detail, but production testing must verify that the rate limiter sees the intended client address through the approved proxy chain.

### 12.11 Backend-Only Google Credentials and Workbook Access

Google API credentials, service-account material, private keys, access tokens, and spreadsheet authentication secrets remain backend-only.

They must not appear in:

* React source.
* Compiled browser assets.
* Browser storage.
* Browser API responses.
* Public Nextcloud shares.
* Public documentation.
* Ordinary logs.
* Source-control commits.

The React application never connects directly to the private Google Sheets workbook.

The private administrative workbook may be accessible only to:

* The couple.
* Explicitly authorized administrators.
* The backend service account.

It must not be published to the web, exposed through a public share link, embedded into the frontend, or returned through a public API.

### 12.12 Backend-Only Email, SMS, Sender, and Administrative Credentials

Email credentials, SMTP credentials, SMS-provider credentials, API keys, sender configuration, provider authentication secrets, and the protected administrative recipient address must remain backend-only.

They belong in protected backend environment configuration or equivalent server-side secret storage.

They must not appear in:

* React source.
* Compiled browser assets.
* Browser storage.
* Public configuration files.
* Public documentation.
* Ordinary logs.
* Source-control commits.

The public successful submission response may report only the approved limited administrative-attempt status and must never expose the protected administrative recipient address.

### 12.13 Production and Development/Test Separation

Production invitation data, development/test fixtures, production credentials, and development/test credentials must remain separated.

Development fixtures such as the Step 11 `DEVxxx` records must not be authorized by the production invitation registry.

Production guest records and production secrets must not be copied into:

* Public test fixtures.
* Frontend source.
* Public documentation.
* Public repositories.

Environment authorization remains backend-controlled.

A development/test code presented to production receives neutral unavailable/invalid behavior without disclosing that the record exists elsewhere.

### 12.14 Protected Dietary and Allergy Information

Party-level dietary or allergy information is private RSVP content.

It may appear only in the approved surfaces required by the RSVP workflow:

* The submitting party's own temporary on-screen confirmation.
* The submitting party's selected email confirmation.
* The submitting party's selected text-message confirmation.
* The protected administrative confirmation.
* Authorized private administrative records required to operate the RSVP.

It must not appear in:

* Analytics.
* Public pages.
* Public metadata.
* Ordinary logs.
* Unrelated administrative messages.
* Another invited party's data.
* Public troubleshooting output.

This privacy boundary does not change the existing requirement that the submitting party and the protected administrative confirmation receive the complete current RSVP.

### 12.15 Transactional Mobile-Number Use

A mobile number submitted for Text Message confirmation is private operational contact information.

It may be used only for:

* The guest-requested transactional RSVP confirmation generated from the corresponding successful initial submission or revision.
* An approved manual resend of that RSVP confirmation.

It must not be used for marketing, promotional messages, unrelated wedding announcements, list building, or another purpose not separately authorized by a future recorded decision.

### 12.16 SMS Provider Disclosure Gate

Phase 3 does not require selection of the production SMS provider.

The API and form schema may continue to use the stable operational identifier:

`smsAuthorization`

Before `confirmationOptions.textMessage` may be enabled in production:

1. The production SMS provider must be selected.
2. The provider's then-current required disclosure and authorization language must be reviewed.
3. Applicable sender-identification language must be included.
4. Applicable consent language must be included.
5. Applicable carrier-rate language must be included when required.
6. Applicable opt-out/help language must be included when required.
7. Other legally or contractually required provider-specific language must be included.
8. Provider credentials and sender configuration must satisfy the backend-only secret boundary.
9. The completed production Text Message flow must be tested.

If those conditions are not satisfied, the production lookup response must represent Text Message confirmation as unavailable rather than returning invented provider-specific authorization copy.

Email confirmation remains available according to the approved centralized production configuration.

### 12.17 No Unsupported Absolute-Security Promise

The API and public Privacy/RSVP copy may accurately describe safeguards actually implemented.

The project must not claim that the RSVP system is completely secure, 100% secure, unhackable, risk-free, or guaranteed never to experience unauthorized access.

### 12.18 RSVP Data Retirement

The complete active RSVP-operational dataset may be retained through:

**July 30, 2027**

No later than that date, data no longer required for a documented unresolved administrative need must be deleted or irreversibly de-identified from the active RSVP system.

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
* Submission and revision timestamps retained only as RSVP transaction history.
* Active invitation-code-to-RSVP-response mappings used solely by the website.

This retirement is an administrative/backend lifecycle operation. Step 14 does not create a public deletion or history endpoint.

### 12.19 Protected Backup Retirement

Protected backups containing retired RSVP-operational data must expire through the ordinary protected backup rotation no later than:

**August 29, 2027**

New backups created after active retirement must not unnecessarily reintroduce data already deleted or irreversibly de-identified from the active system.

### 12.20 Permitted Aggregate Retention and `Invitees List`

After RSVP-operational retirement, the couple may retain non-identifying aggregate wedding statistics only when they cannot reasonably be used to reconstruct an invited party's RSVP.

The separate private `Invitees List` may be retained as a personal wedding-planning/address record outside the active RSVP system.

Its separate retention does not authorize the public RSVP application to remain dependent on retired RSVP response history.

### 12.21 Documented Retention Exception

A particular RSVP record may remain temporarily beyond July 30, 2027 only for a concrete unresolved administrative need such as a correction, dispute, or delivery investigation.

Only the minimum necessary record may be retained, access must remain restricted, and the retained data must be deleted when the documented need ends.

### 12.22 Production HTTPS

The production wedding website and RSVP API must use HTTPS.

Ordinary HTTP navigation must redirect to HTTPS before RSVP information is submitted.

Local Windows development may use an appropriate local-development origin; this does not weaken the production HTTPS requirement.

### 12.23 Step 14 Creates No New Public RSVP Endpoint

The public RSVP endpoint inventory remains:

* `GET /wedding/api/health`
* `POST /wedding/api/rsvp/lookup`
* `POST /wedding/api/rsvp/submit`

Step 14 creates no:

* Public guest directory.
* Code-recovery endpoint.
* Saved-RSVP endpoint.
* RSVP-history endpoint.
* Administrative endpoint.
* Confirmation-recovery endpoint.
* Invitation-specific public route.

---

# 13. Phase 3 Synchronization Status Through Step 14

Phase 3 Steps 4–9 establish the API request, response, validation, merge, dependency, idempotency, storage, delivery, and guest-safe error boundaries in this contract.

Phase 3 Step 10 is synchronized through Section 14's endpoint-to-interface mapping. The thirteen-state model does not require new API endpoints beyond health, lookup, and submit.

Phase 3 Step 11 is complete in `rsvp-system-design.md` and `rsvp-example-configurations.json`. Its fictional development archetypes do not change this public API contract.

Phase 3 Step 12 establishes:

`docs/rsvp-test-cases.md`

as the controlling preliminary test catalog.

Phase 3 Step 13 finalizes the successful-response handoff, temporary confirmation-state eligibility, refresh/direct-load fallback boundary, and the explicit absence of a new confirmation-recovery token or public endpoint in the initial implementation.

Phase 3 Step 14 now finalizes:

* Personalized-response cache control.
* Search-indexing and metadata boundaries.
* Analytics exclusions.
* Ordinary-log and diagnostic-correlation safeguards.
* Concrete initial production lookup/submission rate limits.
* Trusted proxy handling for per-IP rate limiting.
* Backend-only credential boundaries.
* Private workbook access.
* Production/development separation.
* Guest-safe error requirements.
* Dietary/allergy information boundaries.
* Transactional mobile-number use.
* The SMS provider disclosure gate.
* Security-copy limitations.
* RSVP-operational and protected-backup retirement dates.
* HTTPS production transport.

The Step 14 API rules preserve all frozen Step 7–13 public request/response shapes and create no new public endpoint.

The core Phase 3 RSVP API contract is therefore complete. The remaining approved working-sequence activity is cross-document propagation of these final rules into the Step 14 test catalog and browser-facing privacy documentation.

# 14. Endpoint-to-Interface Mapping Through Step 14

| API result                               | Intended browser consequence                                                                                                            |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Health `200`                             | Backend health check succeeds; no guest or RSVP information is displayed from the health response.                                      |
| Lookup `200`                             | Render the applicable blank personalized form on `/wedding/rsvp/`.                                                                      |
| Lookup `400`                             | Display the neutral invalid-invitation state.                                                                                           |
| Lookup `404`                             | Display the same neutral invalid-invitation state without disclosing whether the code was unknown, inactive, or environment-ineligible. |
| Lookup `410`                             | Display the closed-RSVP state.                                                                                                          |
| Lookup `429`                             | Display guest-safe excessive-attempt feedback after the Step 14 limit is exceeded; reveal no invitation information and preserve no-store behavior. |
| Lookup `503`                             | Display the RSVP service-unavailable state.                                                                                             |
| Submit `201`                             | Navigate to temporary confirmation as a successfully stored initial RSVP using the exact Step 8 success-response object.                 |
| Submit `200`, new revision               | Navigate to temporary confirmation as a successfully stored revision using the exact Step 8 success-response object.                     |
| Submit `200`, idempotent replay          | Treat the logical submission as already recorded; do not create another version or duplicate delivery attempt.                           |
| Submit `400`                             | Remain on the form and display guest-safe validation information.                                                                       |
| Submit `403`                             | Remain on the form and display guest-safe authorization or validation information without revealing private configuration.              |
| Submit `409`                             | No current production behavior; Step 8 does not adopt `expectedVersion` checking.                                                       |
| Submit `410`                             | Display the closed-RSVP state for a new logical submission or revision after the deadline.                                               |
| Submit `429`                             | Display guest-safe excessive-submission handling after either Step 14 submission limit is exceeded; create no RSVP version or delivery attempt. |
| Submit `503` before confirmed storage    | Display the RSVP service-unavailable state.                                                                                             |
| No definitive client response            | Display the Submission Uncertain state; preserve the same `clientSubmissionId` for a safe retry and do not infer success, failure, or `503`. |
| Successful storage plus delivery failure | Display successful RSVP confirmation with the applicable Step 8 delivery warning; do not treat as storage failure.                      |

The guest-facing interpretation of these outcomes is governed by the finalized Step 10 state model in `rsvp-system-design.md`, `page-outlines.md`, and `wireframes.md`. Phase 3 Step 13 adds the following browser-only confirmation-route mapping:

| Confirmation-route condition | Intended browser consequence |
|---|---|
| Structurally usable temporary success response with `submission.recorded: true` | Render State 9, 10, or 11 according to `submission.action` and `confirmation.deliveryWarning`; no recovery API request is required. |
| Confirmation route loads without a structurally usable temporary success response | Render State 12 — Confirmation Refresh Fallback; do not automatically call lookup or submit, do not infer storage outcome, and do not create a recovery token/endpoint. |
| Guest deliberately activates `Return to RSVP` from State 12 | Navigate to `/wedding/rsvp/` and begin the ordinary manual-entry flow; any later lookup/submission is a deliberate new interaction governed by the normal API and deadline rules. |

State 12 is therefore a browser-state consequence of missing temporary client state, not an additional backend status code.

Phase 3 Step 14 adds the following cross-cutting API consequences:

| Step 14 condition | API / browser consequence |
|---|---|
| Any lookup response | Include `Cache-Control: no-store, max-age=0`. |
| Any submission response | Include `Cache-Control: no-store, max-age=0`. |
| Lookup exceeds 10 requests in 15 minutes for the client IP | Return guest-safe `429`; disclose no invitation existence information. |
| Submission exceeds 6 requests in 15 minutes for the client IP | Return guest-safe `429`; create no RSVP version or delivery attempt. |
| Submission exceeds 6 requests in 15 minutes for the normalized invitation code | Return guest-safe `429`; do not expose the code or counter state. |
| Deployment is behind proxy/tunnel infrastructure | Per-IP limiter trusts only the configured production proxy chain. |
| SMS provider disclosure gate is incomplete | Production `confirmationOptions` must not advertise Text Message as available. |
| Guest/API traffic is production traffic | Use HTTPS; ordinary HTTP must redirect before RSVP information is submitted. |
| API logging executes | Do not log RSVP request/response bodies, raw/normalized invitation codes, destinations, dietary information, `clientSubmissionId`, or secrets. |
| Active RSVP lifecycle reaches July 30, 2027 | Retire RSVP-operational data under the Step 14 retention rule; no public API endpoint is created for this administrative lifecycle task. |

# 15. Phase 3 Step 4 Completion Check

Phase 3 Step 4 is complete because this document records that:

* Wedding backend endpoints use the `/wedding/api/` prefix.
* The preliminary API contains a health endpoint.
* The preliminary API contains a POST invitation-lookup endpoint.
* The preliminary API contains one POST endpoint for both initial RSVP submissions and revisions.
* `GET /wedding/api/health` confirms application health without querying or exposing invitation or RSVP data.
* A successful health check returns `200` with `{"status":"ok"}`.
* Invitation lookup uses `POST /wedding/api/rsvp/lookup`.
* The invitation code is sent in the request body.
* No code-bearing GET lookup route is defined.
* Invitation codes are not placed in API paths, query strings, or URL fragments.
* Express independently normalizes every lookup.
* Malformed lookup values use `400`.
* No matching active invitation uses `404`.
* Inactive, disabled, test-only, and environment-ineligible codes do not disclose the existence of private invitation records.
* A valid active lookup uses `200`.
* A successful lookup returns only the limited information required to render a blank personalized form.
* Successful lookup does not return stored RSVP answers or stored confirmation destinations.
* Lookup rate limiting may return `429`; Step 14 now fixes the initial production threshold at 10 requests per 15-minute rolling window per client IP.
* Lookup service failure may return `503`.
* A stale lookup received after the authoritative RSVP deadline may return `410` without returning a personalized schema.
* Malformed and unknown lookup failures use the same neutral guest-facing invalid-code treatment.
* `POST /wedding/api/rsvp/submit` serves both initial submissions and revisions.
* The backend determines initial-versus-revision status.
* Submission requests conceptually contain the invitation code, operational confirmation data, client submission identifier, RSVP changes, and any required explicit operations.
* Phase 3 Step 4 originally deferred the exact submission JSON structure to Step 8; that structure is now finalized in Section 6.
* Every submission independently revalidates the invitation code and current authorization state.
* Every submission is validated against the invitation's approved question profile, additional-guest allowance, maximum attendance, deadline, and permitted fields.
* Initial submissions require a complete valid response.
* Revisions merge submitted changes with the current stored RSVP.
* Omitted revision fields remain unchanged.
* Explicit replacement, zero, decline, and clear behavior remains distinct from omission.
* The complete resulting RSVP is validated before storage.
* A valid initial submission returns `201`.
* A valid revision returns `200`.
* A safely resolved repeated submission with the same idempotency identifier returns `200` without creating another RSVP version.
* Malformed or contradictory submissions may return `400`.
* Unauthorized fields or operations may return `403`.
* Phase 3 Step 4 reserved `409` conditionally; Phase 3 Step 8 does not adopt `expectedVersion`, so the current contract does not use `409` for ordinary submissions.
* Submissions received at or after the deadline return `410`.
* Excessive submissions may return `429`; Step 14 now fixes the initial production thresholds at 6 requests per 15-minute rolling window per client IP and 6 per 15-minute rolling window per normalized invitation code.
* Known core service failure before confirmed storage may return `503`.
* A missing or interrupted client response is not automatically treated as `503`; the browser uses the Submission Uncertain state.
* A safe retry after an uncertain result preserves the original client submission identifier.
* Successful RSVP storage occurs before confirmation delivery.
* Guest and administrative confirmation attempts proceed independently after storage.
* Delivery results are recorded separately from RSVP content.
* Guest or administrative confirmation-delivery failure does not undo or duplicate a successfully stored RSVP.
* A post-storage delivery failure remains a successful RSVP response with an appropriate delivery warning.
* A successful submission returns the complete current guest-facing RSVP required by the temporary confirmation state.
* Successful confirmation data omits fields absent from the invitation's approved substantive profile.
* API responses never intentionally expose another invited party's information.
* The frontend never connects directly to the private Google Sheets workbook.
* The contract does not assume a permanently fixed number of invitation records.
* Invitation configuration, form schema, limited blank-form lookup response, submission/partial-revision payloads, conditional/dependency rules, interface-state interpretation, preliminary test catalog, confirmation-refresh behavior, and the final privacy/security API rules are synchronized through Phase 3 Step 14.

---

# 16. Phase 3 Step 7 Completion Check

Phase 3 Step 7 is complete because this contract records that:

* A successful `POST /wedding/api/rsvp/lookup` response has exactly three top-level properties: `invitation`, `questions`, and `confirmationOptions`.
* The `invitation` object contains only the guest-facing invitation values required to render the form.
* The browser receives explicit `wordingMode` rather than inferring grammar.
* The browser receives `maximumAttendance` for applicable rendering and usability validation.
* The browser receives `additionalGuestAllowance` for the `default` profile, including zero when the absence of an additional-guest control is the authorized result.
* The reduced profile omits `additionalGuestAllowance` because that substantive profile does not permit an additional-guest response.
* The browser receives the approved `questionProfile` and only the applicable question definitions.
* The centralized RSVP deadline and `America/New_York` time zone may be returned for guest-facing deadline behavior.
* Returned question objects use the common structure defined in `docs/rsvp-example-form-schemas.json`.
* The default profile returns the allowance-appropriate additional-guest control.
* The reduced profile returns neither `additionalGuestAttendance` nor `attendanceTotals`.
* Operational confirmation questions remain separate through `scope: "operational"` and are available to both approved substantive profiles.
* Lookup never returns a party's current or superseded RSVP answers.
* Lookup never returns stored confirmation method, email address, mobile number, SMS authorization, or delivery status.
* Lookup does not return `existingResponse`, `currentResponse`, `hasResponse`, or another stored-response indicator.
* Lookup does not return another party's information, other invitation codes, private notes, workbook rows, credentials, administrative delivery addresses, or unneeded protected flags.
* The browser does not receive private `partyId`, `active`, `environment`, source-row information, or child-allocation notes.
* The lookup response does not reproduce the production invitation code because the renderer does not need it after validation.
* The same blank lookup structure is used whether the guest will later submit an initial RSVP or a revision.
* The backend remains authoritative for initial-versus-revision determination and all submission validation.

---

# 17. Phase 3 Step 8 Completion Check

Phase 3 Step 8 is complete because this contract records that:

* `POST /wedding/api/rsvp/submit` uses one exact four-property request envelope: `inviteCode`, `clientSubmissionId`, `confirmation`, and `changes`.
* The submission request does not contain private invitation configuration, `partyId`, stored-answer data, response version, or administrative recipient information.
* `clientSubmissionId` is a client-generated UUID-form identifier for one logical submission.
* A safe retry of the same logical submission reuses the same identifier.
* A genuinely new RSVP action receives a new identifier.
* Reuse of one identifier for materially different logical request content is invalid.
* Email confirmation uses `method: "email"` plus the applicable email address.
* Text-message confirmation uses `method: "textMessage"`, the applicable SMS-capable mobile number, and required transactional authorization when configured.
* Only one guest confirmation channel is selected per submission under the current requirements.
* Operational confirmation data remains separate from substantive RSVP changes and is re-entered for every revision.
* `changes` is keyed by permanent substantive question ID.
* Omitted substantive fields mean leave unchanged during a revision.
* `replace` and `clear` are the only Step 8 operation names.
* Explicit zero is represented by a `replace` operation whose value is numeric zero rather than by a separate operation.
* Attendance and decline use replacement values and are submitted as a complete intended pair whenever that controlling state is intentionally changed.
* `additionalGuestAttendance` uses `"yes"` or `"no"` for allowance one and a bounded whole-number value for allowances greater than one.
* `additionalGuestAttendance` is unauthorized for allowance zero and for `reduced-attendance-dietary`.
* `attendanceTotals` is authorized only for the default profile.
* Initial default-profile attendance totals supply all four age categories when applicable.
* Revision attendance-total replacement may update only the nested categories intentionally changed; omitted nested categories remain unchanged.
* Dietary information may be replaced or explicitly cleared.
* A blank dietary string is not the documented clearing mechanism; `clear` expresses intentional removal.
* Initial submissions must supply everything necessary to construct a complete valid response.
* Revisions may submit only the substantive fields that need to change and may use an empty `changes` object when the intended revision is operational-confirmation-only.
* The backend still determines initial versus revision status from authoritative stored state.
* Every new logical submission or revision is independently revalidated against the current invitation configuration, deadline, profile, allowance, maximum attendance, field authorization, and merged-state rules.
* Step 8 does not adopt `expectedVersion`; the browser continues to receive no stored version during lookup.
* Distinct revisions merge against the authoritative current response present when each is processed.
* The current contract does not use `409 Conflict` for ordinary RSVP submission concurrency.
* A successful response has exactly `submission`, `invitation`, `rsvp`, `confirmation`, and `revisionPolicy` at the top level.
* The successful public response does not echo the invitation code, client submission identifier, guest email address, mobile number, SMS authorization content, private RSVP version, or protected administrative address.
* A `201` success identifies an initial action; a `200` success identifies a stored revision or a safely replayed idempotent result.
* An idempotent replay creates no new RSVP version and no duplicate delivery attempt merely because the HTTP request was repeated.
* The success response contains the complete resulting guest-facing RSVP rather than only the submitted changes.
* Profile-inapplicable fields are omitted from the successful `rsvp` object.
* `overallAttendance` is backend-calculated when attendance totals are present.
* Guest and administrative delivery status values are limited to `sent`, `failed`, or `uncertain` in the public response.
* A post-storage delivery failure remains a successful RSVP result with `deliveryWarning: true`.
* The successful response includes the public revision deadline, `America/New_York` time zone, and approved RSVP assistance email needed by the temporary confirmation experience.
* Step 8 intentionally left detailed conditional and dependency relationships to Step 9; those rules are now finalized in Section 6.8.

---

# 18. Phase 3 Step 9 Completion Check

Phase 3 Step 9 is complete because this contract records that:

* Dependency processing occurs after Step 8 merge semantics and before final complete-state validation.
* Attendance and decline have exactly two valid complete-state forms.
* A nonempty attendance selection with decline is contradictory and invalid.
* An empty attendance selection with no decline is invalid when a complete state is required.
* A full decline automatically removes any applicable additional-guest response and attendance totals and clears dietary information.
* A declined successful guest-facing RSVP reports `eventAttendance: []`, `declineAttendance: true`, and `dietaryPreferences: null`, while omitting additional-guest and attendance-total fields.
* Default-profile decline does not preserve a synthetic four-zero attendance-total object.
* Operational confirmation remains mandatory for a decline.
* Dietary information is applicable to Ceremony-only, Reception-only, or combined attendance under both approved profiles.
* Dietary information is optional while attending and is not restricted to Reception attendance.
* `additionalGuestAttendance` is authorized only for an attending default-profile RSVP with a positive allowance.
* An applicable additional-guest response is required on an initial attending RSVP and when it becomes newly applicable after a prior decline.
* Allowance one uses `"yes"` or `"no"` and larger allowances use bounded whole numbers.
* An effective additional-guest count may not exceed complete overall attendance.
* Attendance totals are authorized only for an attending default-profile RSVP.
* All four age categories are required on an initial attending RSVP and whenever totals become newly applicable after a prior decline.
* Partial revisions that remain attending may replace selected nested total categories while omitted categories remain unchanged.
* The server-calculated overall attendance must be at least one when attending and must not exceed `maximumAttendance`.
* The backend does not guess age categories when an additional-guest response changes.
* The reduced profile never accepts additional-guest or attendance-total data.
* Email and Text Message confirmation dependencies are exact and mutually exclusive at the object-property level.
* Authorization failures remain distinct from contradictory or incomplete validation failures.
* Stale stored dependent values made inapplicable by a full decline are automatically cleared.
* Express enforces every dependency rule independently of browser visibility.
* Step 9 does not change the Step 8 request envelope, operation names, idempotency model, or successful response envelope.

---

# 19. Phase 3 Step 10 and Step 12 Synchronization Check

Phase 3 Step 10 and Step 12 are synchronized with this contract because:

* The Step 10 thirteen-state browser model maps the documented lookup and submission outcomes without adding invitation-specific API routes.
* Lookup `400` and `404` both lead to neutral invalid-invitation handling without record-existence disclosure.
* Lookup or submission `410` leads to the closed-RSVP state for a new logical action.
* Known pre-storage `503` remains distinct from a browser-side uncertain outcome that has no definitive server response.
* Successful `201` or `200` storage results provide the exact successful response used for the temporary confirmation experience.
* Post-storage delivery failure remains a successful response and maps to Stored with Delivery Warning.
* The Step 12 preliminary test catalog covers the current lookup, submission, revision, dependency, idempotency, delivery, deadline, privacy-boundary, state, and accessibility behaviors.
* Step 12 does not introduce `expectedVersion`, ordinary `409` concurrency, code-bearing routes, or other behavior absent from this contract.

---

# 20. Phase 3 Step 13 Completion Check

Phase 3 Step 13 is complete in this contract because it records that:

* The successful `POST /wedding/api/rsvp/submit` response is the only ordinary API source for a successful on-screen confirmation.
* React passes the existing five-property successful response to `/wedding/rsvp/confirmation` through temporary navigation/application state.
* The confirmation route does not need the original request body, invitation code, `clientSubmissionId`, guest destination, SMS authorization, private RSVP version, or protected administrative destination merely to display success.
* A successful confirmation state requires a structurally usable approved response with `submission.recorded: true`.
* `submission.action` and `confirmation.deliveryWarning`, rather than HTTP status alone, determine whether State 9, State 10, or State 11 is rendered.
* An idempotent replay of an initial submission may return `200 OK` while preserving `submission.action: "initial"`.
* If temporary success state is absent or unusable, the browser enters State 12 — Confirmation Refresh Fallback.
* State 12 is not an API error status and does not prove successful or failed storage.
* State 12 does not automatically call lookup or submit, generate a new identifier, replay a retained identifier, or request a stored RSVP from an undocumented endpoint.
* The initial implementation requires no short-lived confirmation token and no separate public confirmation-recovery endpoint.
* No code-bearing confirmation URL or public saved-RSVP retrieval endpoint is added.
* The `Return to RSVP` action begins an ordinary deliberate manual-entry interaction rather than an automatic replay.
* The backend-authoritative RSVP deadline still controls any new lookup or submission after the guest returns to the RSVP route.
* Step 13 does not alter the Step 8 request envelope, successful response envelope, storage model, delivery model, or idempotency model; Step 14 likewise preserves those shapes while adding privacy/security controls.
* Any later recoverable confirmation-summary mechanism requires a new recorded decision and coordinated contract changes before implementation.

---

# 21. Phase 3 Step 14 Completion Check

Phase 3 Step 14 is complete in this API contract because it records that:

* Invitation codes are limited access tokens rather than passwords.
* The API exposes no public guest directory, code-recovery search, close-match suggestion, saved-RSVP endpoint, RSVP-history endpoint, or invitation-specific public route.
* Invitation codes remain request-body-only for lookup and submission.
* Every lookup and submission response uses `Cache-Control: no-store, max-age=0`.
* Production RSVP and confirmation browser responses use the same no-store policy.
* Step 13 temporary confirmation state is not intentionally persisted solely for refresh reconstruction.
* RSVP and confirmation routes are excluded from public indexing and personalized values are prohibited from metadata.
* Analytics cannot receive invitation codes, identities derived from invitation records, RSVP answers, dietary information, contact destinations, `clientSubmissionId` values, profile assignments, allowances, versions, or provider payloads.
* Ordinary logs exclude raw and normalized invitation codes, RSVP request/response bodies, guest answers, dietary information, contact destinations, `clientSubmissionId`, workbook contents, and secrets.
* A time-limited keyed pseudonymous diagnostic correlation mechanism is permitted only for a concrete secured investigation.
* Lookup is limited to 10 requests per 15-minute rolling window per client IP in the initial production configuration.
* Submission is limited to 6 requests per 15-minute rolling window per client IP and 6 per 15-minute rolling window per normalized invitation code.
* Per-IP limiting trusts only the configured reverse-proxy/tunnel chain.
* `429` behavior creates no RSVP version or delivery attempt.
* Google, email, SMS, sender, and protected administrative-recipient credentials remain backend-only.
* The frontend has no direct workbook access and the administrative workbook remains private.
* Production records, development/test fixtures, and environment secrets remain separated.
* Guest-facing errors expose no infrastructure, provider, credential, workbook, close-match, or environment-enumeration details.
* Dietary/allergy information is limited to the submitting party's confirmation surfaces, protected administrative confirmation, and authorized private records.
* RSVP mobile numbers are transactional-only.
* Production Text Message confirmation remains disabled until the selected provider's required disclosure and authorization language has been verified and implemented.
* Public copy makes no unsupported absolute-security promise.
* Active RSVP-operational data is retired no later than July 30, 2027 unless a minimum record is temporarily required for a concrete documented administrative need.
* Protected backups containing retired RSVP-operational data expire no later than August 29, 2027.
* Non-identifying aggregate statistics may remain after retirement.
* The private `Invitees List` may remain a separate personal planning/address record without keeping the active RSVP system dependent on retired response history.
* Production RSVP traffic uses HTTPS.
* Step 14 creates no new public API endpoint.
* The Step 13 confirmation-refresh rule remains intact: loss of temporary confirmation state does not justify private data in URLs, automatic replay, or an undocumented recovery API.

With Step 14 documented, this is the **final Phase 3 RSVP API contract**.

**Next working-sequence file:** `rsvp-test-cases.md` — convert the remaining Step 14 privacy/security deferrals into finalized required test cases.
