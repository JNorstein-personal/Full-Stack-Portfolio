# Wedding Website Page Responsibility Outlines

## Purpose

This document defines the purpose, audience, required content, interface states, and boundaries of every browser-facing page in the Loreweaver Creations wedding website. It is revised through Phase 3 Step 14 so that the RSVP page responsibilities map explicitly to the approved thirteen-state React interface model, the finalized temporary-confirmation and Confirmation Refresh Fallback behavior, and the finalized browser-facing privacy and security rules.

It translates the approved requirements, decisions, content inventory, and route inventory into page-level responsibilities before wireframes or application code are created.

This document does not define backend endpoint schemas, spreadsheet columns, provider credentials, or implementation-specific component structure. Those items belong to the Phase 3 RSVP system design and API contract. The Step 10 state names used here remain conceptual browser-interface states and do not require a particular React component naming scheme. Phase 3 Step 13 finalizes the browser-facing lifecycle and copy for State 12 — Confirmation Refresh Fallback without adding a new browser route or recovery API. Phase 3 Step 14 preserves that state model while finalizing browser-facing privacy/security responsibilities, including transactional-route no-store behavior, no-index/metadata boundaries, analytics minimization, the Text Message production-enablement gate, and the public Privacy-page retention/security content.

---

## Governing Documents

These page outlines must remain consistent with:

- `docs/requirements.md`
- `docs/decisions.md`
- `docs/content-inventory.md`
- `docs/route-inventory.md`
- `docs/sitemap.md`
- `docs/wireframes.md`
- `docs/rsvp-system-design.md`
- `docs/rsvp-api-contract.md`
- `docs/rsvp-test-cases.md`

If a later approved decision changes a page responsibility, update the relevant governing documents together rather than allowing them to conflict.

---

# Site-Wide Page Responsibilities

## Global Public Page Shell

Every public page beneath `/wedding/` must use a consistent wedding-site shell.

### Required elements

1. Compact sticky primary navigation.
2. Main page-content region.
3. Site footer.
4. Accessible page title and heading structure.
5. Consistent wedding-site branding and visual language.
6. Responsive behavior for phone, tablet, laptop, and desktop layouts.
7. A visible and keyboard-operable focus state for interactive controls.
8. A mechanism for bypassing repeated navigation and moving directly to the main content.
9. Guest-safe loading, success, warning, and failure messages where applicable.

### Primary navigation order

1. Home
2. RSVP
3. Theme and Attire
4. Our Story
5. Read, Listen, and Watch
6. Venues
7. Travel
8. Schedule
9. FAQ
10. Gallery
11. Privacy

### Navigation behavior

The primary navigation must:

- Remain available while the guest scrolls on desktop and mobile layouts.
- Keep RSVP access prominent.
- Avoid obscuring headings, form controls, error messages, focused controls, or essential content.
- Present the approved links without overlap on supported desktop widths.
- Use a clearly labeled mobile menu control rather than an unexplained icon alone.
- Open and close through keyboard and touch input.
- Close the mobile menu after a destination is selected.
- Identify the current page where practical.

### Footer responsibilities

The footer must provide:

- A link to Home.
- A prominent link to RSVP.
- A link to Privacy.
- RSVP assistance information where appropriate.
- Any approved copyright or ownership notice.
- Internal links that remain within the wedding-site application.

### Link behavior

- Internal links beneath `https://www.loreweavercreations.com/wedding/` open in the same browser tab.
- External media, hotel, and map links open in a new browser tab.
- New-tab links must be identified accessibly.
- External links must use appropriate security attributes.
- No link may expose an invitation code, guest identity, RSVP answer, confirmation destination, or private administrative value in its URL.

### Active event configuration

Home, Venues, Travel, Schedule, and FAQ must read from the same centralized active-event configuration.

Only one configuration may be presented as current at a time:

- Configuration A — Warinanco Park ceremony and Sphinx reception.
- Configuration B — Ceremony and reception entirely at Sphinx.

The pages must never mix times, locations, parking instructions, maps, or contingency wording from different active configurations.

The active configuration must also carry one consistent reception-description policy:

- The public site presents confirmed outer event blocks rather than an internal reception run-of-show.
- There is no separately scheduled formal cocktail hour.
- There is no separately scheduled formal dinner service.
- The meal is a buffet-style brunch available throughout the reception portion of the event.
- Dancing may occur at various intervals during the reception.
- The possible self-service mimosa station remains unconfirmed and must not appear as promised guest information unless the couple and Sphinx Banquet and Catering Center finalize it.
- Exact times must not be assigned to flexible internal reception activities unless a later recorded decision approves them.

### Search and metadata

Public informational pages may be indexed unless the route inventory specifies otherwise.

RSVP entry, validated RSVP form states, confirmation states, error states, and other personalized or transactional content must not be indexed.

The production responses serving `/wedding/rsvp/` and `/wedding/rsvp/confirmation` must use `Cache-Control: no-store, max-age=0`. The browser must not intentionally persist the successful RSVP response solely to reconstruct a confirmation after temporary Step 13 state is lost.

Page titles, descriptions, social-preview data, analytics data, URLs, and browser history must not expose invitation codes, RSVP answers, confirmation destinations, guest identities, `clientSubmissionId` values, private source-row data, private named-`Plus1` allocation metadata beyond the limited validated form configuration, RSVP versions, or provider payloads.

If analytics are used on RSVP or confirmation routes, they must be limited to non-personalized aggregate interaction events and must not be required for RSVP operation.

---

# Page Outlines

## Home

**Route:** `/wedding/`

**Visibility:** Public

**Search indexing:** Yes

**Primary navigation:** Yes

### Purpose

- Confirm that the guest has reached the correct wedding website.
- Present the couple’s names, wedding date, and general location.
- Direct guests quickly to RSVP and essential planning information.
- Establish the tone and visual identity of the wedding.
- Display only the currently active event configuration.

### Required sections

1. **Couple’s names**
   - Use the approved spelling, capitalization, order, and presentation.
2. **Wedding date**
   - Saturday, May 1, 2027.
3. **General location**
   - Roselle, New Jersey.
4. **Welcome message**
   - Welcome guests.
   - Establish the wedding’s tone.
   - Confirm that the guest is on the correct website.
5. **Primary RSVP call to action**
   - Link to `/wedding/rsvp/`.
   - Remain visually prominent.
6. **Theme and Attire call to action**
   - Link to `/wedding/theme`.
7. **Venue or Travel call to action**
   - Link to `/wedding/venues` or `/wedding/travel`.
8. **Introductory image or artwork**
   - Optional until the approved asset is selected.
   - Must not obscure essential text or the RSVP action.
   - Must include appropriate alternative text when informational.
9. **Brief Our Story teaser**
   - Link to `/wedding/story`.
   - Must not replace the full Our Story page.
10. **Active event summary**
    - Display only information appropriate to the currently active configuration.
    - Avoid duplicating details that may become stale unless they are read from centralized configuration.
    - Use only the confirmed ceremony and reception or combined-event time blocks.
    - If reception activities are mentioned, use broad wording such as “Buffet brunch, dancing, and other festivities will take place during the reception.”
    - Do not advertise a formal cocktail hour, formal dinner segment, fixed dancing period, or unconfirmed mimosa station.

### Special behavior

- The static QR code printed on all 57 active assigned invitations opens this page.
- The RSVP destination must be immediately apparent to guests arriving through the QR code.
- The approved final-month RSVP countdown is not required on Home. It belongs on the RSVP entry and validated-form states.

### Exclusions

- No personalized invitation greeting.
- No invitation-code input embedded in unrelated homepage content unless it routes clearly into the approved RSVP entry experience.
- No private RSVP information.
- No conflicting event configurations.
- No detailed internal reception itinerary.
- No separately scheduled cocktail-hour or formal-dinner block.
- No unconfirmed mimosa-station promise.
- No hosted copyrighted book, audiobook, or full-length film.

---

## RSVP Entry and Validated Form

**Route:** `/wedding/rsvp/`

**Visibility:** Public before validation; personalized after successful code validation

**Search indexing:** No

**Primary navigation:** Yes

### Purpose

- Provide the sole public entry point for the online RSVP process.
- Allow guests to manually enter the invitation code printed on their invitation.
- Validate the code without placing it in the browser URL.
- Display one reusable blank RSVP form configured only with the information authorized for the validated invitation.
- Support initial submissions and field-level partial revisions before the deadline.
- Render named `Plus1` questions only when Column E of the authoritative private `Invitees List` grants those allocations.
- Collect coordinated attendance totals and, when Reception is selected, one attendee-detail pair for every attending party member.
- Provide deadline, assistance, confirmation, and privacy information.

### Route rule

The RSVP experience must remain on `/wedding/rsvp/`.

The application must not create or distribute a route such as:

`/wedding/rsvp/XXX-XXX`

Invitation codes must not appear in:

- The route path.
- A query string.
- A URL fragment.
- Page metadata.
- Analytics events.
- Browser-visible confirmation links.

### Shared RSVP-page elements

The entry and validated-form states must provide:

1. Written RSVP deadline:
   - Monday, March 1, 2027, at 11:59 p.m. EST.
2. Final-month countdown behavior:
   - Before February 1, 2027: written deadline only.
   - From February 1, 2027 at 12:00 a.m. EST until the deadline: live countdown.
   - At and after the deadline: closed-RSVP state instead of countdown or submission controls.
3. Printed RSVP alternative.
4. Assistance address:
   - `RSVPhelp@loreweavercreations.com`
5. Concise privacy notice.
6. Link to `/wedding/privacy`.
7. Guest-safe status and error messaging.
8. No stored RSVP answers or prior confirmation destinations displayed to the guest.

---

### Phase 3 RSVP State Map — Step 10 Model, Finalized Through Step 14

The RSVP page and confirmation responsibilities below retain the thirteen formal Phase 3 Step 10 interface states. The spreadsheet-authoritative RSVP revision changes the contents of State 5 and the related validation/confirmation summaries, but does not create another top-level state:

| State | Formal state | Page responsibility |
|---:|---|---|
| 1 | Entry Ready | RSVP Entry state, with ordinary and final-month-countdown presentation variants |
| 2 | Looking Up Invitation | RSVP Lookup-in-Progress state |
| 3 | Invalid Invitation | Invalid-Code state |
| 4 | Service Unavailable | RSVP Service-Unavailable state |
| 5 | Validated Blank Form | One reusable validated blank form configured with singular/plural wording, `maximumAttendance`, and zero or more authorized named `Plus1` allocations |
| 6 | Validation Failure | Validation-Failure state |
| 7 | Submitting | Submission-in-Progress state |
| 8 | Submission Uncertain | Submission-Uncertain state |
| 9 | Confirmed Initial Submission | RSVP Confirmation initial-submission variant |
| 10 | Confirmed Revision | RSVP Confirmation revision variant |
| 11 | Stored with Delivery Warning | RSVP Confirmation delivery-warning variant |
| 12 | Confirmation Refresh Fallback | RSVP Confirmation refresh-without-state variant |
| 13 | RSVP Closed | Closed-RSVP state |

Only one top-level state should control the primary RSVP experience at a time. Countdown visibility, the presence or absence of authorized named `Plus1` questions, field-level errors, Reception-attendee-row count, delivery-warning category, and responsive layout are variants within these states rather than additional top-level states.

The backend remains authoritative for invitation validity, deadline enforcement, invitation-specific `Plus1` authorization, `maximumAttendance`, submission validity, successful storage, and initial-versus-revision classification. React must not enter a successful confirmation state solely because local validation passed or a request was sent.

---

### State 1 — Entry Ready

#### Purpose

Allow a guest to enter the six-character code printed on the invitation.

#### Required sections

1. **Introductory instructions**
   - Explain that the guest must enter the invitation code printed on the invitation.
2. **QR-code explanation**
   - Explain that the invitation QR code opens the general wedding website.
   - Explain that the printed invitation code must still be entered on the RSVP page.
3. **Invitation-code location instructions**
   - Explain where the code appears on the printed invitation.
4. **Invitation-code input**
   - Accept ordinary user-entered formatting that the approved normalization rules permit.
   - Do not imply fuzzy matching or automatic character correction.
5. **Lookup control**
   - Use a clearly labeled action such as `Find My RSVP`.
6. **Deadline and countdown treatment**
   - Use the shared RSVP-page rule above.
7. **Printed-response alternative and assistance information**.
8. **Concise privacy notice and Privacy link**.

#### Entry-state behavior

- Do not expose whether any invitation code exists before lookup succeeds.
- Do not provide a guest directory, name search, code recovery, fuzzy suggestions, or close-match hints.
- Do not describe the invitation code as a password.
- Keep the invitation code out of browser URLs and page metadata.

---

### State 2 — Looking Up Invitation

#### Purpose

Communicate that invitation validation is in progress and prevent accidental duplicate lookup activation.

#### Required elements

- Visible progress/status message.
- Disabled or guarded duplicate lookup activation while the request is pending.
- Accessible status announcement.
- The entered code may remain in the input control while the lookup is pending but must not be copied into a URL, analytics event, or metadata.

---

### State 3 — Invalid Invitation

#### Purpose

Communicate that the entered code could not open an RSVP form without revealing whether the cause was malformed input, an unknown code, an inactive record, or an environment-ineligible record.

#### Required content

- Neutral invalid-invitation heading or status message.
- Invitation-code entry control for another manual attempt.
- Printed-invitation guidance.
- Assistance contact.
- Deadline information where appropriate.

#### Prohibited disclosures

Do not reveal:

- Whether the entered code was syntactically valid internally.
- Whether a similar code exists.
- Whether the code corresponds to an inactive record.
- Whether the code belongs to development/testing data.
- Guest or household names.
- The number of production records.

---

### State 5 — Validated Blank Form

#### Purpose

Display the authorized personalized RSVP form after successful invitation validation while revealing only the information required to complete the RSVP.

The form must open blank on every successful lookup, including when the invited party already has a stored RSVP.

#### Personalization permitted

The validated form may receive and display only the limited values needed for that invitation, including:

- Reviewed invited-party display/greeting content.
- Explicit singular or plural wording mode.
- The invitation's positive whole-number `maximumAttendance`.
- Zero or more authorized named `Plus1` allocation definitions derived from Column E of the private authoritative spreadsheet.
- For each authorized allocation, only the stable allocation identifier and the named-invitee prompt text needed to render that question.
- The approved reusable question, option, condition, and validation structure.
- Deadline/time-zone information and currently enabled confirmation methods.

A party with no `Plus1` allocation in Column E receives no Plus 1 question. A party with one allocation receives one named-invitee Yes/No question. A party with multiple allocations receives one separate named-invitee Yes/No question for each allocation.

The browser must not infer `Plus1` authorization, wording mode, or `maximumAttendance` from guest names, greeting text, party size, or any other client-visible value.

#### Personalization prohibited

The validated form must not receive or display:

- Any other invitation code or party record.
- The complete private `Invitees List` source row.
- Private administrative notes.
- Previously stored RSVP answers.
- Previously stored confirmation method or destination.
- Stored RSVP version/history.
- Delivery records.
- Backend credentials, spreadsheet identifiers, provider secrets, or protected administrative destinations.

#### Required introductory sections

1. **Personalized greeting**.
2. **Blank-form notice**
   - Explain that previously stored RSVP answers are not displayed.
3. **Initial-submission guidance**
   - Explain that an initial response must supply every value required for a complete valid RSVP.
4. **Revision guidance**
   - Explain that returning guests still receive a blank form.
   - Explain that omitted applicable RSVP fields remain unchanged unless an authoritative dependency rule clears them.
   - Explain that submitted values replace their stored counterparts.
   - Explain that some dependent structures must be replaced completely when their controlling attendance state changes.
5. **Deadline and countdown**.
6. **Printed-response alternative and assistance information**.
7. **Concise privacy notice and Privacy link**.

#### Required substantive RSVP questions

The validated form uses one spreadsheet-authoritative reusable substantive structure. There is no production question-profile selector.

##### 1. Event attendance

Display the invitation-specific singular or plural attendance wording with three coordinated checkbox choices:

- `Ceremony`
- `Reception`
- `Regretfully, I am unable to attend.` or `Regretfully, we are unable to attend.`

Behavior:

- Ceremony and Reception may both be selected.
- Selecting the decline option deselects or supersedes Ceremony and Reception.
- Selecting Ceremony or Reception deselects or supersedes decline.
- An initial submission must establish either an attending state or a decline state.
- A complete attending state must include Ceremony, Reception, or both.

##### 2. Authorized named `Plus1` questions

Render this region only when the validated invitation contains one or more authorized Column E `Plus1` allocations.

For each allocation, render one Yes/No question using the named invited person associated with that allocation, following the form:

`Will [Named Invitee] be accompanied by a +1?`

Rules:

- A party with zero authorized allocations sees no Plus 1 question.
- Each allocation is answered independently with `Yes` or `No`.
- Multiple allocations produce multiple separate questions, not one numeric count control.
- Do not offer a general Plus 1 option to a party that has no allocation.
- Do not ask for the Plus 1 person's name in this region.
- The stable allocation identifier is used for submission authorization; the browser must not invent allocation IDs or submit responses for allocations not returned by the backend.
- These questions are attendance-dependent and are cleared when the complete RSVP becomes a full decline.

##### 3. Attendance totals by age category

When the party is attending, display the approved prompt:

> To better accommodate the seating & dietary needs of our guests, please list the total number of attendees in your party:

Display four numerical dial/stepper controls:

- Adults, ages 21 and older.
- Young Adults, ages 18–20.
- Children, ages 3–17.
- Children under 3.

Rules:

- Each value is a nonnegative whole number.
- The four values together represent the complete attending party.
- Their sum is `overallAttendance`.
- `overallAttendance` must be at least 1 while attending.
- `overallAttendance` must not exceed the invitation's `maximumAttendance`.
- The controls must coordinate their available maxima so increasing one category consumes remaining authorized capacity and decreasing one restores capacity to the others.
- A control's dynamic maximum may include its current value plus the remaining unused capacity so the guest can lower or raise categories without creating a transient over-limit state.
- The interface should make the current total and maximum capacity understandable without requiring the guest to calculate the limit manually.
- Positive authorized `Plus1` responses do not automatically alter an age-category dial; the guest supplies the complete attending-party totals and the backend validates the final result.
- Full decline clears attendance totals.

##### 4. Reception attendee details

Render this region only when Reception is selected in the complete current page state.

Create exactly one repeated attendee-detail pair for every member of the attending party represented by `overallAttendance`.

Each repeated row contains:

1. **Attendee name**
   - Required.
   - Plain-text input.
   - Maximum 100 characters.
2. **Food allergies or dietary preferences**
   - Optional free-text input for that attendee.
   - Maximum 1000 characters.

Rules:

- The number of attendee-detail rows must equal `overallAttendance` exactly.
- Ceremony-only attendance displays no Reception attendee-detail rows.
- Removing Reception clears the Reception attendee-detail structure.
- Full decline clears the structure.
- If a revision changes `overallAttendance` while Reception remains selected, the guest must submit a complete replacement attendee-detail list with exactly the new number of rows; the backend must not guess which prior row should be inserted or removed.
- The repeated fields collect the name of each Reception attendee regardless of whether that person is a named invitee or an attending Plus 1; there is no separate Plus 1-name question elsewhere.
- Do not ask for entrée selections.

#### Required operational confirmation fields

Every initial submission and revision must separately collect the currently enabled operational confirmation fields:

1. **Confirmation method**
   - Email is enabled.
   - Text Message appears only after the finalized production provider/disclosure gate is satisfied.
2. **Confirmation email**
   - Display and require when Email is selected.
3. **SMS-capable mobile number**
   - Display and require only when Text Message is enabled and selected.
4. **Transactional SMS authorization**
   - Display and require only when the enabled production Text Message flow requires it.

Previously stored confirmation values must never be prefilled or displayed. A successful revision replaces the stored operational confirmation values with the newly submitted values.

#### Explicit update and clearing controls

Because every validated form opens blank, revision controls and instructions must distinguish omission from replacement or dependency-driven clearing.

The interface must make it possible to deliberately:

- Change Ceremony/Reception/decline status.
- Change any authorized named `Plus1` Yes/No response.
- Replace an age-category total, including replacing a positive value with explicit zero.
- Replace the complete Reception attendee-detail list when it becomes newly applicable or its required cardinality changes.
- Remove Reception, which clears Reception attendee-detail data.
- Fully decline, which clears attendance-dependent `Plus1` responses, attendance totals, and Reception attendee details.

An omitted applicable field on a revision means `leave unchanged` unless another submitted controlling value makes that stored field inapplicable. A newly applicable required structure cannot be omitted.

#### Submission controls

Provide:

- A neutral submission action such as `Submit RSVP`.
- A visible submission-in-progress state.
- Protection against accidental double activation while the current logical request is in flight.
- No UI implication that a blank form necessarily means no RSVP exists.

#### Validation responsibilities visible to the guest

Guest-facing validation must cover at least:

- A valid attendance or decline state is required.
- Attendance and decline cannot coexist.
- Plus 1 responses may be submitted only for the allocation IDs authorized by the validated invitation.
- Every authorized Plus 1 question that is required in the current attending state must use only Yes or No.
- Parties without a Column E allocation must not submit a Plus 1 response.
- Age-category values must be nonnegative whole numbers.
- Their sum must be at least 1 while attending and must not exceed `maximumAttendance`.
- Reception attendee details are required only when Reception is selected.
- Reception attendee-detail row count must equal `overallAttendance` exactly.
- Every Reception attendee name is required and limited to 100 characters.
- Each dietary/allergy response is optional and limited to 1000 characters.
- Removing Reception or fully declining makes Reception attendee details inapplicable.
- Required initial-submission values must be complete.
- Newly applicable required values during a revision must be supplied.
- Email/Text Message operational dependencies must be satisfied.

The backend remains authoritative and must independently validate the invitation code, authorized named `Plus1` allocations, `maximumAttendance`, submitted RSVP changes, dependency clearing, operational confirmation fields, deadline, and complete resulting RSVP.

#### Excluded questions

The validated RSVP form must not introduce:

- Separate accepting/declining controls for every named invitee.
- A general Plus 1 option for an invitation that has no authorized Column E allocation.
- A numeric multiple-Plus-1 count control replacing the authorized named Yes/No questions.
- A standalone Plus 1-name field.
- Named-child attendance controls outside the four age-category totals.
- A party-level dietary field that replaces the required per-Reception-attendee detail structure.
- Accessibility-assistance questions.
- Lodging-plan questions.
- Transportation questions.
- A message-to-the-couple field.
- Entrée selections.
- Any other substantive RSVP question not established by the spreadsheet-authoritative model.

---

### State 7 — Submitting

#### Purpose

Communicate that a submission is being processed and prevent accidental duplicate activation.

#### Required behavior

- Disable or guard repeated submit activation while the logical request remains in flight.
- Preserve the same `clientSubmissionId` for an explicit safe retry of that same logical request after an uncertain outcome.
- Do not create a new logical submission merely because the first request is slow.
- Announce progress accessibly.
- Preserve current page-entered values until a definitive result determines the next state.

---

### State 6 — Validation Failure

#### Purpose

Allow the guest to correct a request that the browser or backend identifies as invalid without implying that the RSVP was stored.

#### Required elements

1. Accessible error summary.
2. Specific field-level messages.
3. Focus movement to the summary or first invalid field where appropriate.
4. Previously entered valid values retained.
5. Guest-safe wording.
6. Assistance information when the problem cannot be resolved through ordinary correction.

The page must not imply that an invalid response was stored.

---

### State 8 — Submission Uncertain

#### Purpose

Handle cases where the browser cannot determine whether a submission was recorded, such as a connection interruption after the request was sent.

#### Required content and behavior

- State that the result cannot yet be confirmed.
- Do not claim success or failure without evidence.
- Direct the guest to check the selected confirmation channel.
- Provide an explicit safe-retry action only when it reuses the original logical request and `clientSubmissionId`.
- Do not silently create a second logical submission.
- Provide assistance information.
- Keep this state distinct from a known pre-storage service failure.

---

### State 4 — Service Unavailable

#### Purpose

Handle a known backend/service failure before successful RSVP storage is established.

#### Required content and behavior

- State that the RSVP service is temporarily unavailable.
- Do not imply that a response was stored.
- Provide a deliberate retry path where appropriate.
- Provide the printed-response alternative and assistance information.

#### Exclusions

- Do not expose provider, credential, spreadsheet, server, stack-trace, or infrastructure details.
- Do not expose invitation existence or private configuration beyond what was already legitimately displayed before the failure.

---

### State 13 — RSVP Closed

#### Purpose

Replace editable RSVP controls at and after the authoritative deadline.

#### Required sections

1. Closed-RSVP heading.
2. Deadline statement.
3. Explanation that ordinary online submissions and revisions are no longer available.
4. Assistance contact for exceptional circumstances.
5. Link back to the public wedding website.

#### Closed-state behavior

- Remove or disable invitation lookup and submission controls.
- Remove the live countdown.
- Do not expose personalized information.
- Do not imply that ordinary online revisions remain available.

---

## RSVP Confirmation

**Route:** `/wedding/rsvp/confirmation`

**Visibility:** Personalized temporary state when a usable successful-submission response is available; non-personalized recovery fallback when temporary confirmation state is absent or unusable

**Search indexing:** No

**Primary navigation:** No, although the global shell may remain available where safe

### Purpose

- Confirm that the RSVP was successfully stored.
- Distinguish an initial submission from a revision.
- Display the complete current RSVP after any revision was merged.
- Report guest and administrative confirmation-delivery attempts.
- Explain how another revision may be submitted before the deadline.

### Phase 3 Confirmation States — Step 10 Model, Step 13 Refresh Finalization

The confirmation route uses four formal Step 10 states. States 9–11 require a structurally usable temporary successful-submission response that proves successful storage. State 12 remains the fallback when that temporary success response is absent or unusable.

#### State 9 — Confirmed Initial Submission

Use this state only when the backend proves that an initial RSVP was stored successfully and no delivery warning is required. The page must identify the action as an initial submission and display the complete current guest-facing RSVP.

#### State 10 — Confirmed Revision

Use this state only when the backend proves that a revision was stored successfully and no delivery warning is required. The page must identify the action as a revision and display the complete merged current RSVP rather than only the fields changed by that revision.

#### State 11 — Stored with Delivery Warning

Use this state when storage succeeded but guest confirmation, protected administrative confirmation, or both failed or remain uncertain. The page must continue to state clearly that the RSVP was recorded, preserve the initial-versus-revision designation, display the complete current RSVP, and avoid instructing the guest to resubmit merely because delivery failed.

#### State 12 — Confirmation Refresh Fallback

Use this state whenever `/wedding/rsvp/confirmation` loads without a structurally usable temporary successful-submission response. This includes a refresh, direct visit, bookmark or new-tab visit, or return to a history entry when the temporary successful response is no longer available.

A refresh or history action does not force State 12 if the approved successful response remains available and usable. When that response remains available, React may continue to render State 9, 10, or 11. When the response is absent or unusable, the page must enter State 12 without attempting to determine why the state was lost.

State 12 is a presentation and recovery-guidance state. It must not infer successful storage merely because the confirmation route was reached, infer failed storage from missing temporary state, automatically perform lookup, automatically replay the prior RSVP submission, generate a new `clientSubmissionId`, silently reuse an earlier identifier, or retrieve a stored RSVP through an undocumented public recovery endpoint.

The initial implementation does not require a short-lived confirmation token, a code-bearing confirmation URL, a public saved-RSVP endpoint, or persistent browser storage solely to preserve the on-screen summary.

### Required sections

1. **Success heading**
   - Clearly state that the RSVP was recorded.
2. **Submission type**
   - Initial submission or revision.
3. **Complete current RSVP summary**
   - Ceremony selection.
   - Reception selection.
   - Decline status.
   - Every applicable authorized named `Plus1` response, using guest-safe prompt/label text.
   - Adults age 21 and older.
   - Young Adults ages 18–20.
   - Children ages 3–17.
   - Children under age 3.
   - Overall attendance total.
   - When Reception is selected, the complete Reception attendee-detail list containing each attendee name and that attendee's dietary/allergy response when supplied.
   - When Reception is not selected, do not invent Reception attendee-detail rows or show placeholders for them.
4. **Submission or revision timestamp**.
5. **Guest confirmation method**
   - Email or Text Message when enabled and selected.
6. **Guest delivery-attempt status**
   - Identify whether the selected guest confirmation was sent, accepted for delivery, failed, or remains uncertain using guest-safe wording.
7. **Limited administrative email-attempt status or notice**
   - Identify whether the protected administrative confirmation was attempted and whether a warning applies.
   - Do not expose the administrative destination.
8. **Revision instructions**
   - Return to `/wedding/rsvp/`.
   - Re-enter the invitation code.
   - Re-enter the confirmation method, applicable destination, and any required transactional text-message authorization.
   - Complete only the RSVP fields to be changed, except that a newly applicable or cardinality-changing Reception attendee-detail structure must be supplied as a complete replacement list.
   - Omitted applicable RSVP fields otherwise remain unchanged unless a dependency rule clears them.
   - Submitted operational confirmation fields replace their stored counterparts.
   - The next confirmation contains the complete updated RSVP.
9. **Deadline**.
10. **Return-to-site link**.
11. **Assistance information**.

### Confirmation-delivery behavior and warning variants

After storage succeeds, the guest-confirmation attempt and protected administrative-email attempt proceed independently. Failure, delay, or uncertainty affecting one delivery category must not prevent the other applicable attempt, roll back the stored RSVP, or create another RSVP version.

If either delivery attempt fails or remains uncertain:

- Continue to state clearly that the RSVP was recorded.
- Display a success-with-delivery-warning state rather than a submission failure.
- Distinguish whether the warning concerns the guest confirmation, the administrative email, or both without exposing provider internals or the couple’s private administrative address.
- Do not instruct the guest to resubmit the RSVP solely because delivery failed or remains uncertain.
- Provide the approved assistance method where guest action may be useful.
- Allow the couple to resend a failed guest confirmation through the documented administrative process without changing the RSVP version.

### Phase 3 Step 13 Finalized Refresh-without-State Variant

Confirmation details do not need to survive a browser refresh or other loss of temporary navigation/application state.

#### Entry condition

Render State 12 when `/wedding/rsvp/confirmation` does not have the structurally usable temporary successful-submission response required to prove and display State 9, 10, or 11.

This may occur after:

- A full page refresh.
- Direct navigation to the confirmation route.
- Opening or bookmarking the confirmation route without the original temporary state.
- Opening the route in a new tab without that state.
- Returning through browser history after the temporary successful response is unavailable.
- Any other client-side loss or invalidation of the temporary successful response.

The application does not need to distinguish among these causes before rendering the fallback.

If the structurally usable successful response is still available, the confirmation route continues to display the appropriate State 9, 10, or 11 instead of forcing the fallback merely because a refresh or history action occurred.

#### Final approved guest-facing copy

**Heading**

> Confirmation Summary No Longer Available

**Primary explanation**

> The temporary on-screen RSVP summary is no longer available. If you submitted an RSVP, it may already have been recorded. Please check the email or text message you selected for confirmation. Do not submit the same response again only because this summary is unavailable.

**Revision guidance**

> To make a deliberate revision, return to the RSVP page and enter your invitation code again.

**Assistance wording**

> If you are unsure whether your RSVP was received, contact us at RSVPhelp@loreweavercreations.com.

#### Required actions

1. **Return to RSVP**
   - Navigate to `/wedding/rsvp/`.
   - Begin a new ordinary manual-entry interaction.
   - Do not carry the invitation code or prior response in the URL.
2. **Contact for Help**
   - Use `RSVPhelp@loreweavercreations.com`.
3. **Return to wedding website**
   - Provide a safe link to `/wedding/` or equivalent approved Home route.

#### Prohibited recovery behavior

State 12 must not:

- Automatically call the lookup endpoint.
- Automatically replay the prior submission.
- Generate a new `clientSubmissionId` on entry.
- Silently reuse an old `clientSubmissionId`.
- Attempt to reconstruct the response from browser history, URL values, analytics, or metadata.
- Expose a public saved-RSVP retrieval endpoint.
- Expose a confirmation-recovery token in the URL.
- Claim that no RSVP exists merely because temporary state is missing.

#### Accessibility responsibilities

- Move focus to or announce the fallback heading/message when State 12 becomes active.
- Keep all actions keyboard- and touch-operable.
- Preserve meaning without relying on color or animation.
- Respect reduced-motion preferences for any optional transition treatment.
- Do not use a timed redirect that removes the guest's opportunity to read the uncertainty-safe message.

### Exclusions

- No invitation code in the URL.
- No provider credentials or provider-error payloads.
- No protected administrative email address.
- No spreadsheet identifiers or row numbers.
- No stored RSVP history beyond the complete current guest-facing summary legitimately returned by the successful submission response.
- No unrelated private invitation-source information.

### Phase 3 Step 10 RSVP State-Transition Responsibilities

The page outlines preserve these state-transition boundaries:

- Entry Ready → Looking Up Invitation only after deliberate lookup activation.
- Looking Up Invitation → Invalid Invitation, Service Unavailable, RSVP Closed, or Validated Blank Form according to the backend result.
- Validated Blank Form → Validation Failure when local or authoritative validation rejects the proposed result.
- Validated Blank Form → Submitting only after deliberate submission activation.
- Submitting → Submission Uncertain only when the browser lacks a definitive backend result.
- Submitting → Validation Failure, RSVP Closed, Service Unavailable, Confirmed Initial Submission, Confirmed Revision, or Stored with Delivery Warning according to the definitive result.
- Confirmation states → Entry Ready only through a deliberate return/revision action; no automatic saved-response retrieval occurs.
- At the authoritative deadline, editable RSVP states yield to RSVP Closed.

---
## Theme and Attire

**Route:** `/wedding/theme`

**Visibility:** Public

**Search indexing:** Yes

**Primary navigation:** Yes

### Purpose

- Explain the wedding aesthetic without requiring prior familiarity with the thematic source material.
- Help guests choose attire that fits the event while preserving flexibility.
- Make clear that examples and inspiration are not mandatory.

### Required sections

1. **General wedding aesthetic**
2. **“Vintage garden formal” explanation**
3. **Guest color palette**
4. **Outfit examples and suggestions**
5. **Hat and accessory guidance**
6. **Costume and anachronism guidance**
7. **Gender-neutral outfit guidance**
8. **Inspiration images**
9. **Wedding-party design-guide downloads**
10. **Inspiration-package disclaimer**
    - Ideas, concepts, outfits, and accessories are suggestions.
    - Reference images are provided for inspiration.
    - Nothing is mandatory unless separately and explicitly stated.
    - Character descriptions are secondary references.

### Link behavior

- Design guides hosted beneath the wedding site or approved Loreweaver-owned resources open according to their internal route or download behavior.
- External inspiration sources, where used, follow the approved new-tab external-link rule.
- Do not publish assets without confirmed rights or permission.

---

## Our Story

**Route:** `/wedding/story`

**Visibility:** Public

**Search indexing:** Yes

**Primary navigation:** Yes

### Purpose

- Present the couple’s relationship story as a complete public page.
- Provide context for the celebration.
- Offer a personal destination separate from logistical guest information.

### Required sections

1. **Page title and brief introduction**
2. **Relationship story**
3. **Engagement or wedding-planning context**
4. **Optional photographs**
5. **Contextual link to RSVP or Home**

### Content boundaries

- Publish only information and photographs approved by the couple.
- Do not include private guest information.
- Do not allow optional photographs to delay the page’s launch-ready written content.

---

## Read, Listen, and Watch

**Route:** `/wedding/read-listen-watch`

**Visibility:** Public

**Search indexing:** Yes

**Primary navigation:** Yes

### Purpose

- Introduce the thematic book, audiobook, and film.
- Direct guests to lawful places where each work may be borrowed, streamed, rented, or purchased.
- Avoid publicly hosting copyrighted source material.

### Required sections

1. **Introductory explanation**
2. **Book resource card**
   - Title and descriptive information.
   - Lawful purchase or library links.
3. **Audiobook resource card**
   - Title and descriptive information.
   - Lawful purchase, subscription, or library links.
4. **Film resource card**
   - Title and descriptive information.
   - Lawful streaming, rental, purchase, or library links.
5. **Availability and regional-access disclaimer**
6. **Copyrighted-media exclusion notice where appropriate**

### External-link behavior

Retailer, library, subscription, streaming, rental, and other external resource links:

- Open in a new tab.
- Are identified accessibly as external or new-tab links.
- Are maintained from centralized content or configuration.
- Must be verified before publication.

### Exclusions

This page must not include:

- An embedded ebook reader.
- A hosted ebook download.
- An audiobook player serving full copyrighted files.
- Hosted audiobook downloads.
- A full-length movie player.
- A hosted full-length film.
- Public Nextcloud links to copyrighted copies.
- Unlawful download or streaming links.

---

## Venues

**Route:** `/wedding/venues`

**Visibility:** Public

**Search indexing:** Yes

**Primary navigation:** Yes

**Active-event dependency:** Yes

### Purpose

- Present the active ceremony and reception locations.
- Provide accurate confirmed outer times, addresses, maps, entrances, parking, accessibility, and contingency information.
- Describe the reception without converting flexible internal activities into a fixed public itinerary.
- Prevent guests from seeing mixed event configurations.

### Required sections

1. **Active event-configuration identification**
2. **Active ceremony information**
3. **Active reception information**
4. **Selectable street addresses**
5. **Verified map links**
6. **Parking instructions**
7. **Entrance instructions**
8. **Verified accessibility information**
9. **Weather and contingency instructions**
10. **Configuration-status notice where appropriate**
11. **Broad reception-format description**

### Prepared Configuration A content

**Warinanco Park ceremony and Sphinx reception**

- Ceremony:
  - Saturday, May 1, 2027.
  - 10:30 a.m. to 12:00 p.m.
  - Warinanco Park, Roselle, NJ 07036.
- Reception:
  - Saturday, May 1, 2027.
  - 12:30 p.m. to 4:30 p.m.
  - Sphinx Banquet and Catering Center.
  - 121 E 2nd Avenue, Roselle, NJ 07203.
  - Buffet-style brunch remains available throughout the reception.
  - Dancing and other festivities may occur at various intervals during the reception.

### Prepared Configuration B content

**Entire event at Sphinx**

- Saturday, May 1, 2027.
- One combined ceremony-and-reception event block from 11:30 a.m. to 4:30 p.m.
- Sphinx Banquet and Catering Center.
- 121 E 2nd Avenue, Roselle, NJ 07203.
- Do not invent a separate ceremony-ending or reception-starting time.
- Buffet-style brunch remains available throughout the reception portion of the event.
- Dancing and other festivities may occur at various intervals during the reception.

### Approved reception wording

The page may use broad wording such as:

> Buffet brunch, dancing, and other festivities will take place during the reception.

This wording may be adapted to the page, provided it does not create exact internal activity times.

### Configuration rule

Only the selected configuration may appear as current.

Do not:

- Show the Warinanco ceremony time with the Sphinx-only schedule.
- Present both configurations as simultaneous guest choices.
- Display parking, maps, or arrival instructions for an inactive venue as though they are current.
- Require page reconstruction to switch to the approved fallback.
- Create a formal cocktail-hour or formal-dinner segment.
- Assign exact times to buffet service, dancing, toasts, speeches, cake, photographs, or other flexible reception activities.
- Present the possible self-service mimosa station as confirmed before the couple and banquet hall finalize it.

### External-link behavior

Verified map links open in a new tab and must be identified accessibly.

---

## Travel

**Route:** `/wedding/travel`

**Visibility:** Public

**Search indexing:** Yes

**Primary navigation:** Yes

**Active-event dependency:** Yes

### Purpose

- Help guests traveling from a distance plan lodging and transportation.
- Present the fixed hotel-block dates while tracking property-specific details as pending.
- Provide travel guidance consistent with the active event configuration.
- Avoid turning travel guidance into an internal reception timeline.

### Required sections

1. **Hotel-block statement**
2. **Check-in date**
   - Friday, April 30, 2027.
3. **Check-out date**
   - Sunday, May 2, 2027.
4. **Hotel name and address**
   - Add once selected.
5. **Group rate or room-block details**
   - Add once finalized.
6. **Booking instructions and booking link**
   - Add once finalized.
7. **Booking deadline**
   - Add once finalized.
8. **Hotel accessibility information**
   - Add once verified.
9. **Parking for the active venue configuration**
10. **Train information**
11. **Airport information**
12. **Local transportation**
13. **Taxi and ride-sharing guidance**
14. **Driving guidance**
15. **Travel accessibility notes**
16. **Day-of travel contact information**
    - Include only if approved and available.

### Pending-content behavior

Until the hotel property is selected:

- Display only accurate confirmed information.
- Treat April 30 through May 2, 2027 as ready content.
- Do not invent a hotel, rate, booking link, deadline, or accessibility claim.
- Use a clearly written pending-information state where guest-facing publication is necessary.

### Event-day travel behavior

For Configuration A:

- The confirmed 12:00 p.m. ceremony conclusion and 12:30 p.m. reception start create a guest transition window between Warinanco Park and Sphinx.
- Describe this only as travel or transition time.
- Do not label it as a cocktail hour.

For Configuration B:

- The event remains one combined 11:30 a.m. to 4:30 p.m. block at Sphinx.
- Do not invent a ceremony-ending, reception-starting, or internal travel time.

For both configurations:

- Do not use buffet service, dancing, beverages, or another flexible reception activity as a guest travel deadline unless a later recorded decision establishes a genuine transportation need.

### Link behavior

External hotel booking and map links open in a new tab and are identified accessibly.

---

## Schedule

**Route:** `/wedding/schedule`

**Visibility:** Public

**Search indexing:** Yes

**Primary navigation:** Yes

**Active-event dependency:** Yes

### Purpose

- Present a concise guest-planning schedule for the active event configuration.
- Publish the confirmed outer ceremony and reception or combined-event time blocks.
- Describe the flexible reception structure without creating a binding internal run-of-show.
- Keep private setup, vendor, wedding-party, and flexible internal reception timing out of the public site.
- Provide contextual links to Venues, Travel, and RSVP.

### Required Configuration A schedule

1. **Ceremony**
   - Warinanco Park.
   - 10:30 a.m. to 12:00 p.m.
2. **Guest transition between venues**
   - 12:00 p.m. to 12:30 p.m.
   - Present as travel or transition time, not as a cocktail hour.
3. **Reception**
   - Sphinx Banquet and Catering Center.
   - 12:30 p.m. to 4:30 p.m.
4. **Reception description**
   - Buffet-style brunch remains available throughout the reception.
   - Dancing and other festivities may occur at various intervals during the reception.

### Required Configuration B schedule

1. **Ceremony and reception**
   - Sphinx Banquet and Catering Center.
   - One combined event block from 11:30 a.m. to 4:30 p.m.
2. **Reception description**
   - Buffet-style brunch remains available throughout the reception portion of the event.
   - Dancing and other festivities may occur at various intervals during the reception.
3. **Internal transition rule**
   - Do not invent a separate ceremony-ending or reception-starting time unless a later recorded decision establishes one.

### Approved general reception wording

The page may use concise wording such as:

> Buffet brunch, dancing, and other festivities will take place during the reception.

Equivalent wording may be used provided it:

- Does not promise a formal cocktail hour.
- Does not promise a formal dinner service.
- Does not create a fixed dancing period.
- Does not imply a more detailed internal itinerary than has actually been approved.
- Does not mention the possible self-service mimosa station unless it is later confirmed.

### Additional sections

1. Guest arrival guidance when finalized.
2. Guest-relevant transportation deadlines, but only where an actual transportation arrangement creates one.
3. Link to Venues.
4. Link to Travel.
5. Contextual RSVP link.
6. Optional brief note that reception activities are intentionally flexible.

### Configuration rule

Only the active schedule may be publicly displayed.

### Do not publish

- Private setup times.
- Vendor-only timing.
- Wedding-party-only instructions.
- A mixed schedule assembled from both configurations.
- A separately scheduled formal cocktail hour.
- A separately scheduled formal dinner period.
- A fixed dancing block.
- Exact times for first dances, toasts, speeches, cake service, photographs, buffet activity, or other internal reception events.
- A more detailed Configuration B ceremony-to-reception transition unless later approved.
- The possible self-service mimosa station as confirmed information before the couple and Sphinx Banquet and Catering Center finalize it.
- Unconfirmed milestones presented as final.

### Future-decision rule

A later confirmed guest-facing milestone may be added only through an updated recorded decision and corresponding revisions to the requirements, content inventory, page outlines, sitemap, and wireframes where affected.

---

## Frequently Asked Questions

**Route:** `/wedding/faq`

**Visibility:** Public

**Search indexing:** Yes

**Primary navigation:** Yes

**Active-event dependency:** Yes for venue, schedule, parking, accessibility, weather, and Configuration B timing answers

### Purpose

- Answer common guest questions in one public location.
- Reinforce RSVP, attire, venue, travel, reception, gift, and thematic-resource information.
- Explain the flexible reception structure without publishing an internal run-of-show.
- Explain RSVP rules without exposing another invited party's private configuration.
- Reduce confusion without adding unauthorized RSVP questions.

### Required topics

1. Children and the four age-category attendance totals.
2. Plus 1 authorization: only a named invitee whose invitation configuration contains a Column E `Plus1` allocation receives a corresponding Plus 1 question.
3. Why some validated RSVP forms contain no Plus 1 questions while others contain one or more named-invitee Yes/No questions.
4. Attire.
5. Hats.
6. Costumes and anachronism.
7. Parking.
8. Buffet-style brunch.
9. Flexible reception structure and dancing.
10. Absence of a separately scheduled formal cocktail hour.
11. Absence of a separately scheduled formal dinner.
12. Reception attendee names and food-allergy/dietary-preference information.
13. Accessibility of the active venue or venues.
14. Photography.
15. Weather and the Sphinx-only fallback.
16. Which event configuration is active.
17. Hotel-block dates and booking details.
18. RSVP revisions.
19. Blank forms and partial updates.
20. Invalid invitation codes.
21. Printed RSVP alternative.
22. Ceremony and reception locations.
23. Guest confirmation by email or Text Message when enabled.
24. RSVP privacy.
25. Gifts.
26. Thematic book, audiobook, and film resources.
27. The possible self-service mimosa station only if the arrangement is later confirmed.

### Required policy statements

- The meal is a buffet-style brunch.
- There is no separately scheduled formal cocktail hour.
- There is no separately scheduled formal dinner service.
- The buffet remains available throughout the reception portion of the event.
- Dancing may occur at various intervals during the reception.
- The public schedule intentionally avoids exact times for flexible internal reception activities.
- Configuration B is one combined 11:30 a.m. to 4:30 p.m. event block; no separate internal ceremony-ending or reception-starting time is currently approved.
- The possible self-service mimosa station must not be presented as confirmed unless the couple and banquet hall finalize it.
- No entrée selection is required.
- Every attending RSVP supplies four age-category totals whose sum is the complete attending party and cannot exceed the invitation maximum.
- A Plus 1 question appears only for a named invitee who has a `Plus1` allocation in the private authoritative source. Each allocation produces a separate Yes/No question; no general or numeric multiple-guest Plus 1 control is offered.
- When Reception is selected, the RSVP collects one attendee name and optional food-allergy/dietary-preference response for every attending party member. Ceremony-only attendance does not collect those Reception attendee details.
- The RSVP does not collect accessibility, lodging, transportation, separate accepting/declining answers for each invitee, a standalone Plus 1-name field, or a message-to-the-couple answer.
- No gift registry will be used.
- Gifts are optional.
- Guests choosing to give a gift may consider cash or cash-equivalent gifts, including checks or savings bonds, or handcrafted or otherwise thoughtful gifts.
- Store-specific gift cards and investments made in the couple’s name are not preferred.
- A returning guest's RSVP form loads blank.
- Omitted applicable revision fields remain unchanged unless a dependency rule clears them; newly applicable required structures must be supplied.
- The complete updated RSVP is sent after a successful revision.
- Guests may select Email or, when the finalized production gate is satisfied, Text Message confirmation.

### Contextual links

Include links to:

- RSVP.
- Theme and Attire.
- Venues.
- Travel.
- Schedule.
- Read, Listen, and Watch.
- Privacy.

Internal links remain in the same tab.

---
## Gallery

**Route:** `/wedding/gallery`

**Visibility:** Public before and after wedding; post-wedding content published only after review

**Search indexing:** Yes

**Primary navigation:** Yes

### Purpose

- Preserve a stable Gallery destination before media is available.
- Publish approved wedding photographs and videos after review.
- Separate optimized page previews from original-resolution downloads.

### Invitation-launch state

Before post-wedding media is ready:

1. Display the Gallery page title.
2. Display a simple, intentional Coming Soon message.
3. Permit a text-only placeholder.
4. Do not require engagement or planning photographs.
5. Do not allow gallery work to delay RSVP or essential guest information.

### Post-wedding state

After approved media is ready:

1. Professional photographs.
2. Approved guest photographs.
3. Wedding videos.
4. Albums or categories.
5. Optimized preview files.
6. Lazy-loaded gallery content.
7. Separate original-resolution download links where approved.
8. Publication-review and privacy controls.

### Media responsibilities

- Review all photographs and videos before publication.
- Use optimized previews rather than original-resolution files as thumbnails.
- Keep full-resolution downloads separate.
- Provide alternative text or accessible descriptions where appropriate.
- Avoid publishing private, unapproved, or rights-restricted material.

---

## Privacy

**Route:** `/wedding/privacy`

**Visibility:** Public

**Search indexing:** Yes

**Primary navigation:** Yes

### Purpose

- Provide the complete plain-language RSVP privacy notice.
- Explain the use and limits of invitation codes, invitation-specific named `Plus1` authorization, RSVP answers, Reception attendee details, confirmation destinations, administrative records, email delivery, and Text Message delivery.
- Explain blank forms and partial revisions.
- Explain the finalized RSVP data-retention and retirement schedule.
- Explain the production Text Message enablement gate without inventing provider-specific language before a provider is selected.
- Explain assistance, correction, data-minimization, and security practices without making unsupported absolute-security guarantees.

### Required sections

1. **Page title and introduction**
   - Explain that this notice applies to the wedding website's RSVP system and related confirmation delivery.

2. **Invitation-code use**
   - Explain that a code retrieves only the limited blank-form configuration applicable to that invitation.
   - Explain that invitation codes are limited access tokens rather than traditional account passwords.
   - Do not imply that the code provides strong account authentication.
   - Do not advertise any public guest directory, invitation-code recovery search, fuzzy/close-match lookup, or saved-RSVP retrieval because the approved system provides none.

3. **Information collected**
   - Attendance or decline status, including Ceremony and Reception selections.
   - Yes/No responses only for named `Plus1` allocations authorized for that invitation; invitations without an allocation collect no Plus 1 response.
   - Attendance totals across Adults 21+, Young Adults 18–20, Children 3–17, and Children under 3.
   - When Reception is selected, one attendee name and optional dietary/allergy response for each attending party member.
   - Confirmation method.
   - Email address or SMS-capable mobile number.
   - Transactional SMS authorization where required.
   - Submission and revision records needed to operate the versioned RSVP.

4. **Purpose of collection**
   - Record and manage the RSVP.
   - Plan attendance, seating, and dietary accommodation.
   - Identify each attending Reception guest sufficiently to associate dietary/allergy information with that attendee.
   - Send the invited party's confirmation.
   - Send the protected administrative confirmation to the couple.
   - Support corrections, revisions, delivery troubleshooting, and approved manual confirmation resend.

5. **Blank forms**
   - Explain that previously stored answers and confirmation destinations are not displayed on later lookup.
   - Explain that a returning guest begins from the same blank personalized form rather than a public saved-RSVP page.

6. **Partial revisions**
   - Explain that submitted changes are merged with the stored response.
   - Explain that omitted applicable RSVP fields remain unchanged unless an authoritative dependency rule makes a value inapplicable.
   - Explain that newly applicable structures must be supplied when required.
   - Explain that changing Reception attendance count requires a complete replacement Reception attendee-detail list because the system does not guess which attendee record should be added or removed.
   - Explain that newly re-entered operational confirmation values replace their stored counterparts.
   - Explain that the next successful confirmation contains the complete current RSVP.

7. **Confirmation delivery and mobile-number use**
   - Explain the Email confirmation option.
   - Explain Text Message confirmation only when that channel is actually enabled in production.
   - Explain that text messages may require multiple message segments to contain the complete current RSVP.
   - State that an RSVP mobile number is used only for the guest-requested transactional RSVP confirmation and an approved manual resend unless another use is separately authorized in the future.
   - If Text Message confirmation is enabled, include the verified provider-dependent, sender-identification, consent, carrier-rate, opt-out/help, or other required disclosures that actually apply.
   - If the production SMS provider or required wording has not been verified, Text Message confirmation remains unavailable rather than using invented provider-specific language.

8. **Storage and authorized access**
   - Explain that invitation configuration and RSVP records are maintained through the private administrative system.
   - Explain that the private administrative workbook is limited to the couple, explicitly authorized administrators, and the backend service account.
   - Explain that the frontend does not directly access the private workbook.
   - Explain that protected administrative confirmations are private correspondence sent only to the approved administrative address.
   - Do not reveal credentials, provider secrets, spreadsheet identifiers, or unnecessary infrastructure details.

9. **Reception attendee names and dietary/allergy information**
   - Explain that attendee names and dietary/allergy text collected for Reception planning are private RSVP information.
   - Explain that these values may appear in the submitting party's own on-screen and selected electronic confirmation, the protected administrative confirmation, and authorized private administrative records because those surfaces contain the complete current RSVP.
   - Explain that these values are not intended for public pages, public metadata, analytics, ordinary logs, unrelated administrative messages, or other invited parties.

10. **Data-exposure safeguards**
    - Explain in plain language that invitation codes and RSVP details are not placed in personalized browser URLs.
    - Explain that RSVP and confirmation pages are not intended for public search indexing.
    - Explain that the project limits analytics and routine logging so personalized RSVP values are not intentionally sent to analytics or written into ordinary logs.
    - Do not expose internal security architecture or present these safeguards as a guarantee against all unauthorized access.

11. **Retention and retirement**
    - State that complete active RSVP-operational data may be retained through **July 30, 2027**, 90 days after the May 1, 2027 wedding.
    - State that, no later than July 30, 2027, RSVP-operational data no longer needed for a concrete unresolved administrative purpose will be deleted or irreversibly de-identified from the active RSVP system.
    - Explain that this retirement includes current and superseded RSVP responses, Reception attendee names, dietary/allergy text, RSVP confirmation destinations, SMS authorization records, submission identifiers, delivery-attempt history, and website RSVP transaction history that is no longer operationally needed.
    - State that protected backups containing retired RSVP-operational data expire through the ordinary protected backup rotation no later than **August 29, 2027**.
    - Explain that non-identifying aggregate wedding statistics may be retained afterward when they cannot reasonably reconstruct an invited party's RSVP.
    - Explain that the couple's separate private `Invitees List` may remain as a personal planning/address record outside the active RSVP system.
    - Explain that a minimum necessary record may temporarily remain beyond the ordinary retirement date only for a concrete unresolved correction, dispute, delivery investigation, or comparable documented administrative need and is deleted when that need ends.

12. **Assistance and correction**
    - Provide `RSVPhelp@loreweavercreations.com`.
    - Explain how guests may request correction or assistance.

13. **Security limitations**
    - Explain that reasonable safeguards are used.
    - Do not claim that the system is completely secure, unhackable, risk-free, or otherwise guaranteed against all unauthorized access.

### Exclusions

The Privacy page must not expose:

- Production invitation codes.
- Guest names or private invitation allocations.
- RSVP answers.
- Confirmation destinations.
- The protected administrative email destination.
- Spreadsheet IDs, row numbers, credentials, provider secrets, or server paths.
- A list of valid invitation codes or a means to search for them.

---
## Wedding-Site Not Found

**Canonical route:** `/wedding/not-found`

**Also used for:** Any unmatched `/wedding/*` browser route

**Visibility:** Public error state

**Search indexing:** No

**Primary navigation:** No

### Purpose

- Replace a generic server error with a wedding-specific recovery page.
- Help guests reach common destinations.
- Avoid exposing technical details.

### Required sections

1. Clear not-found heading.
2. Brief guest-friendly explanation.
3. Link to Home.
4. Link to RSVP.
5. Link to Venues.
6. Link to FAQ.
7. Assistance information where appropriate.

### Exclusions

- No stack trace.
- No server path.
- No framework or hosting error details.
- No invitation-code information.
- No suggestion that an unknown route corresponds to a real guest or invitation.

---

# Cross-Page Content Ownership

## Centralized content or configuration

The following repeated values must be maintained centrally where practical:

- Couple’s names.
- Wedding date.
- General location.
- RSVP deadline.
- Countdown start.
- RSVP assistance email.
- Active event configuration.
- Venue names, addresses, and confirmed outer event times.
- Flexible reception-description policy.
- Buffet-service policy.
- Mimosa-station confirmation status.
- Hotel-block dates.
- Gift policy.
- Privacy-page route.
- Primary navigation labels.
- External thematic-resource links.
- Gallery launch state.
- The reusable RSVP question/schema definition.
- `maximumAttendance` validation and coordinated attendance-dial behavior.
- Named `Plus1` allocation rendering/authorization rules.
- Reception attendee-detail cardinality and validation rules.

## Page-specific content ownership

- **Home:** welcome message, hero artwork, homepage teasers and calls to action.
- **RSVP:** entry instructions, validation messages, revision instructions, invitation-authorized named `Plus1` wording, attendance-dial presentation, Reception attendee-detail wording, confirmation-field wording, privacy reassurance, closed and unavailable states.
- **Confirmation:** success, delivery, complete-summary, refresh-fallback, and revision wording.
- **Theme and Attire:** aesthetic, attire, palette, examples, images, downloads, and disclaimer.
- **Our Story:** relationship narrative and approved photographs.
- **Read, Listen, and Watch:** descriptions, verified external links, and availability disclaimer.
- **Venues:** active venue details, entrances, parking, accessibility, maps, contingency instructions, and broad reception description.
- **Travel:** hotel block, transportation, driving, travel-accessibility information, and only genuine guest travel deadlines.
- **Schedule:** confirmed outer event blocks and the approved flexible reception description.
- **FAQ:** approved guest-facing policy answers, including RSVP authorization rules, Reception detail collection, the reception structure, and any confirmed beverage information.
- **Gallery:** Coming Soon copy and reviewed post-wedding media.
- **Privacy:** complete RSVP privacy explanation.
- **Not Found:** guest-safe recovery wording.

---

# Page-Level Exclusions

No page may include:

- Hosted copyrighted ebook files.
- Hosted copyrighted audiobook files.
- An embedded or hosted full-length film.
- Public Nextcloud links to copyrighted source media.
- A gift registry page or registry links.
- Entrée-selection content.
- A separate RSVP page coded for each invitation.
- Code-bearing personalized RSVP URLs.
- Prefilled or displayed stored RSVP answers.
- A public administrative dashboard.
- Private setup or wedding-party-only schedule details.
- A separately scheduled formal cocktail hour.
- A separately scheduled formal dinner period.
- Fixed public times for flexible reception activities.
- An invented Configuration B ceremony-to-reception transition.
- An unconfirmed self-service mimosa station.
- Substantive RSVP questions outside the spreadsheet-authoritative RSVP structure.
- Separate accepting/declining controls for each named adult or child.
- A general Plus 1 option for a party without an authorized Column E allocation.
- A numeric multiple-Plus-1 count control in place of separate named-invitee authorization questions.
- A standalone Plus 1-name question; Plus 1 names, when attending the Reception, are collected only through the same Reception attendee-detail rows used for every attendee.
- A party-level dietary field in place of per-Reception-attendee dietary/allergy fields.
- Accessibility, lodging, transportation, or message-to-the-couple questions within the RSVP form.
- Omitted revision fields treated as deletions when they remain applicable.
- An assumption that guest confirmation is email-only.
- Mixed active-event configurations.

---

# Page Outline Completion Review

This Phase 2 Step 3 document is complete when:

- Every browser-facing route has a defined purpose.
- Every page has a defined visibility and indexing treatment.
- Every page has a list of required sections or states.
- Public and personalized RSVP states are clearly distinguished.
- Manual code entry is the only RSVP access method.
- No code-bearing RSVP route is required.
- Blank-form and partial-revision responsibilities are documented.
- One reusable spreadsheet-authoritative RSVP structure is documented without exposing private production source rows.
- Plus 1 questions appear only for Column E allocations and each allocation produces a separate named-invitee Yes/No control.
- Parties without a Plus 1 allocation receive no Plus 1 control.
- Four coordinated age-category numerical dials and `maximumAttendance` behavior are documented.
- Reception attendee-detail rows are documented as exactly one per attending party member when Reception is selected.
- Confirmation summaries contain the complete applicable current RSVP without inventing inapplicable structures.
- Email and conditional Text Message confirmation responsibilities are documented.
- The final-month countdown is limited to the approved RSVP states and dates.
- Sticky navigation and link behavior are documented.
- The Privacy page is included.
- Both event configurations are prepared but only one may be active.
- The public schedule is limited to confirmed outer event blocks.
- Configuration B does not invent an internal ceremony-to-reception transition.
- The reception is described as buffet-style brunch with dancing and other festivities occurring flexibly during the reception.
- No formal cocktail-hour or formal-dinner segment is published.
- The possible self-service mimosa station remains unpublished unless confirmed.
- Hotel dates are fixed and property-specific details remain pending.
- Error, closed-RSVP, service-unavailable, submission-uncertain, delivery-warning, and confirmation-refresh states are documented.
- Read, Listen, and Watch contains no hosted copyrighted-media features.
- Gallery launch and post-wedding responsibilities are separated.
- No page responsibility contradicts `requirements.md`, `decisions.md`, `content-inventory.md`, or `route-inventory.md`.

---

# Phase 3 Step 10 Page-Outline Synchronization Review

The page outlines satisfy Phase 3 Step 10 when:

- All thirteen formal RSVP interface states have an explicit browser-facing responsibility.
- Entry Ready includes the written deadline and the final-month countdown only during the approved window.
- Looking Up Invitation prevents duplicate lookup and announces progress.
- Invalid Invitation uses neutral wording and reveals no private invitation information.
- Service Unavailable is used only when successful storage has not been established and remains distinct from Submission Uncertain.
- Validated Blank Form stays blank, renders the single reusable form with only the validated invitation's wording mode, maximum attendance, and authorized named `Plus1` allocation definitions, and presents both initial and revision instructions without revealing stored answers.
- Validation Failure preserves current page-entered values and exposes accessible errors.
- Submitting prevents duplicate activation and retains the current logical request until a definitive result is known.
- Submission Uncertain uses uncertainty-safe wording and supports idempotent retry with the original logical request.
- Confirmed Initial Submission displays the complete stored initial RSVP.
- Confirmed Revision displays the complete merged current RSVP.
- Stored with Delivery Warning continues to state that storage succeeded and distinguishes delivery problems without exposing provider or administrative details.
- Confirmation Refresh Fallback does not infer success or failure and does not move sensitive summary data into the URL.
- RSVP Closed removes editable online RSVP controls at the authoritative deadline.
- Page responsibilities remain synchronized with `rsvp-system-design.md`, `wireframes.md`, and the sitemap state hierarchy.

---

# Phase 3 Step 13 Page-Outline Synchronization Review

The page outlines satisfy Phase 3 Step 13 when:

- The existing thirteen-state Step 10 model remains unchanged.
- States 9–11 require a structurally usable temporary successful-submission response that proves successful storage and supplies the complete current guest-facing RSVP.
- State selection among Confirmed Initial Submission, Confirmed Revision, and Stored with Delivery Warning follows the successful-response content rather than assuming that every HTTP `200` is a revision.
- Temporary confirmation details are allowed to disappear on refresh or other loss of temporary navigation/application state.
- A refresh or history action does not force State 12 when the valid temporary successful response remains available.
- Direct navigation, bookmarks, new-tab visits, refreshes, or history returns without usable temporary successful state enter State 12 — Confirmation Refresh Fallback.
- State 12 uses the finalized heading, primary explanation, revision guidance, assistance wording, and `Return to RSVP` / `Contact for Help` actions documented above.
- State 12 states that an RSVP may already have been recorded without asserting either success or failure.
- State 12 directs the guest to check the selected email or Text Message confirmation and explicitly warns against submitting the same response again solely because the on-screen summary disappeared.
- State 12 does not automatically call lookup or submit, generate or silently reuse a submission identifier, retrieve a stored RSVP from an undocumented endpoint, or reconstruct private summary data through the URL.
- The initial implementation does not require a short-lived confirmation token, confirmation-recovery endpoint, code-bearing confirmation URL, or persistent browser storage solely to preserve the summary.
- `Return to RSVP` begins a deliberate ordinary manual-entry interaction and remains subject to the backend-authoritative deadline; it is not an automatic replay.
- The fallback is announced or focused accessibly, its actions remain keyboard- and touch-operable, and it does not use a timed automatic redirect that prevents the guest from reading the uncertainty-safe explanation.
- `rsvp-system-design.md`, `rsvp-api-contract.md`, `wireframes.md`, and `rsvp-test-cases.md` use the same finalized Step 13 confirmation-refresh behavior.
- `requirements.md`, `decisions.md`, `sitemap.md`, and `route-inventory.md` remain consistent with this finalized behavior without requiring a new confirmation route or public recovery endpoint.
- At the time the Step 13 page-outline revision was completed, the cache-control, logging, rate-limit, credential, retention, and broader privacy/security rules were intentionally left to Step 14. Those rules are now finalized and synchronized below.

---

# Phase 3 Step 14 Page-Outline Synchronization Review

The page outlines satisfy Phase 3 Step 14 when:

- The existing thirteen-state RSVP interface model remains unchanged.
- Step 14 adds privacy/security constraints around the Step 10/13 states rather than inventing another top-level state or public recovery route.
- Production `/wedding/rsvp/` and `/wedding/rsvp/confirmation` responses use `Cache-Control: no-store, max-age=0`.
- Successful confirmation data is not intentionally persisted in browser storage solely to reconstruct the Step 13 confirmation after temporary state is lost.
- RSVP, confirmation, error, warning, closed, and fallback transactional states remain excluded from public indexing.
- Browser URLs and metadata contain no invitation code, RSVP answer, confirmation destination, `clientSubmissionId`, private source-row data, private allocation metadata, RSVP version, or provider payload.
- RSVP/confirmation analytics, if present, contain no personalized RSVP or invitation values and are not required for RSVP operation.
- Guest-facing invitation-code copy does not describe the code as a password or expose a public directory, recovery search, fuzzy-match mechanism, or saved-RSVP view.
- Text Message appears as a production confirmation method only after the selected provider's required disclosure/authorization wording and production flow satisfy the approved Step 14 gate.
- When Text Message is unavailable, Email remains the available electronic confirmation path according to centralized configuration.
- Mobile numbers collected for RSVP confirmation are described as transactional-only under the approved rule.
- The Privacy page explains private storage/access, protected administrative confirmation, Reception attendee-name/dietary-information boundaries, and data-minimization safeguards without revealing secrets or claiming absolute security.
- The Privacy page states the July 30, 2027 active RSVP-data retirement date and August 29, 2027 protected-backup retirement deadline.
- The Privacy page explains permitted non-identifying aggregate retention, the separate status of the private `Invitees List`, and the minimum-record documented exception.
- `rsvp-system-design.md`, `rsvp-api-contract.md`, `rsvp-test-cases.md`, `wireframes.md`, and this file describe the same finalized Step 14 browser-facing consequences.
- `requirements.md`, `sitemap.md`, `route-inventory.md`, `content-inventory.md`, `link-inventory.md`, and `rsvp-example-configurations.json` must be reviewed against this same spreadsheet-authoritative model rather than the superseded profile/allowance model.

With these responsibilities recorded, `page-outlines.md` is synchronized with the authoritative `Invitees List` spreadsheet and the approved RSVP revisions through **Phase 3 Step 14**.
