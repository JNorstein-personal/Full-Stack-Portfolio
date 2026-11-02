# Wedding Website Page Responsibility Outlines

## Purpose

This document defines the purpose, audience, required content, interface states, and boundaries of every browser-facing page in the Loreweaver Creations wedding website.

It is synchronized through Phase 3 Step 14, the September 20, 2026 attendance-composition correction, the September 27 unnamed-child source clarification, the cleaned latest `Invitees List`, the grouped `Kids(n)` family-control clarification, and the November 1, 2026 Workstream 4 public-content lock.

For RSVP pages, this document therefore assumes:

* One reusable blank personalized RSVP form.
* Explicit named-invitee Yes/No attendance decisions.
* One scalar Yes/No control for each authorized Plus1 allocation.
* At most one grouped unnamed-children control per applicable invitation.
* The approved family-level child question, with a conditional `1..maximumCount` dropdown after Yes.
* Backend-derived actual attendance from named Yes + Plus1 Yes + grouped child count.
* Four age-category totals whose sum equals derived attendance exactly.
* `Attendee Details` for every attending person, including every child represented by the grouped count.
* Reception-specific dietary/allergy fields only.

This document does not define backend endpoint schemas, private spreadsheet columns, provider credentials, or implementation-specific React component structure. Those responsibilities remain in the Phase 3 system-design/API documents.

The formal thirteen-state RSVP browser model remains unchanged. The grouped-child correction changes content and validation within existing states, especially State 5 — Validated Blank Form, State 6 — Validation Failure, and confirmation States 9–11; it does not create a new browser route or top-level interface state.

Phase 3 Step 13 continues to govern temporary confirmation-state loss and the Confirmation Refresh Fallback. Phase 3 Step 14 continues to govern no-store responses, no-index behavior, analytics minimization, and the public Privacy page. Decision 029 supersedes the former Text Message production gate and establishes email-only guest confirmation.

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
3. Theme & Attire
4. Our Story
5. Read, Listen & Watch
6. Venue
7. Travel
8. Day-Of Details
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
- A link to FAQ.
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

### Confirmed event configuration

Home, Venue, Travel, Day-Of Details, and FAQ must present one consistent confirmed public event format:

- Ceremony and reception at Sphinx Banquet and Catering Center.
- Saturday, May 1, 2027.
- Guest-facing event window: 11:30 a.m.–4:30 p.m.

The former Warinanco Park ceremony configuration is discontinued and may remain only as historical project documentation or inactive historical source data. It must not appear to guests as a pending venue decision, alternate public schedule, weather fallback, or future event configuration.

The public event presentation must also remain consistent with these rules:

- The ceremony flows directly into brunch and the reception.
- There is no separately scheduled formal cocktail hour.
- There is no separately scheduled formal dinner service.
- Buffet brunch, dancing, speeches, and other reception moments may occur flexibly rather than through a minute-by-minute guest itinerary.
- Exact times must not be assigned to flexible internal reception activities unless a later recorded decision approves them.
- The current guest-facing beverage/menu wording may be published as approved on Day-Of Details; any later vendor-specific service promise requires separate confirmation.

### Search and metadata

Public informational pages may be indexed unless the route inventory specifies otherwise.

RSVP entry, validated RSVP form states, confirmation states, error states, and other personalized or transactional content must not be indexed.

The production responses serving `/wedding/rsvp/` and `/wedding/rsvp/confirmation` must use `Cache-Control: no-store, max-age=0`. The browser must not intentionally persist the successful RSVP response solely to reconstruct a confirmation after temporary Step 13 state is lost.

Page titles, descriptions, social-preview data, analytics data, URLs, and browser history must not expose invitation codes, RSVP answers, confirmation destinations, guest identities, `clientSubmissionId` values, private source-row data, private additional-guest allocation metadata beyond the limited validated form configuration, RSVP versions, or provider payloads.

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
- Display the confirmed Sphinx-only event configuration.

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
6. **Theme & Attire call to action**
   - Link to `/wedding/theme`.
7. **Venue or Travel call to action**
   - Link to `/wedding/venue` or `/wedding/travel`.
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

- The static QR code printed on every assigned guest invitation opens this page. Any later printed invitation created from a reserved production code must use the same static homepage QR destination.
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

- Provide the sole public entry point for online RSVP.
- Allow guests to manually enter the invitation code printed on their invitation.
- Validate the code without placing it in the browser URL.
- Display one reusable blank RSVP form configured only with information authorized for the validated invitation.
- Support initial submissions and field-level partial revisions before the deadline.
- Render one explicit Yes/No attendance decision for every authorized named invitee.
- Render each authorized additional-guest control according to the allocation's safe `kind`, `prompt`, and `maximumCount`.
- Render Plus1 allocations as individual Yes/No questions.
- Render a grouped unnamed-child allocation as one family-level Yes/No question; after Yes, reveal one required child-count dropdown from 1 through `maximumCount`.
- Derive actual attending-party count from named-invitee Yes responses, Plus1 Yes responses, and grouped child count.
- Collect four coordinated age-category totals whose sum equals derived actual attendance.
- Collect exactly one Attendee Details record for every attending person, with attendee name always required and `Dietary or allergy information` shown only when Reception is selected.
- Provide deadline, assistance, confirmation, and privacy information.

### Route rule

The RSVP experience remains on `/wedding/rsvp/`.

The application must not create or distribute code-bearing personalized routes such as:

`/wedding/rsvp/XXX-XXX`

Invitation codes must not appear in:

- Route paths.
- Query strings.
- URL fragments.
- Page metadata.
- Analytics events.
- Browser-visible confirmation links.

### Shared RSVP-page elements

The entry and validated-form states provide:

1. Written RSVP deadline:
   - Monday, March 1, 2027, at 11:59 p.m. EST.
2. Final-month countdown:
   - Before February 1, 2027: written deadline only.
   - February 1, 2027 at 12:00 a.m. EST through the deadline: live countdown.
   - At/after the deadline: closed-RSVP state.
3. Printed RSVP alternative.
4. Assistance address:
   - `RSVPhelp@loreweavercreations.com`
5. Concise privacy notice.
6. Link to `/wedding/privacy`.
7. Guest-safe status/error messaging.
8. No stored RSVP answers or prior confirmation destinations displayed.
9. A guest-facing Gift Policy reference linking to `/wedding/day-of`.

---

### Phase 3 RSVP State Map — Step 10 Model, Finalized Through Step 14

The RSVP page and confirmation responsibilities retain the thirteen formal Step 10 states. The grouped child interaction is a variant inside the existing validated-form and confirmation states:

| State | Formal state | Page responsibility |
|---:|---|---|
| 1 | Entry Ready | RSVP entry, including ordinary/final-month-countdown presentation |
| 2 | Looking Up Invitation | Lookup in progress |
| 3 | Invalid Invitation | Neutral invalid-code state |
| 4 | Service Unavailable | Backend/service unavailable before successful storage |
| 5 | Validated Blank Form | Reusable blank form using wording mode, `maximumAttendance`, safe `namedInvitees`, and safe typed `additionalGuestAllocations` |
| 6 | Validation Failure | Current page-entered values plus accessible field/form errors |
| 7 | Submitting | Submission in progress |
| 8 | Submission Uncertain | Storage/delivery outcome cannot safely be inferred |
| 9 | Confirmed Initial Submission | Successful stored initial RSVP |
| 10 | Confirmed Revision | Successful stored revision |
| 11 | Stored with Delivery Warning | RSVP stored; one or more delivery attempts failed/uncertain |
| 12 | Confirmation Refresh Fallback | Temporary success response unavailable |
| 13 | RSVP Closed | Deadline reached |

Only one top-level state controls the primary RSVP experience at a time.

Within State 5, the presence/absence of named invitees, Plus1 controls, grouped child control, grouped child dropdown, derived `overallAttendance`, Attendee Details rows, Reception dietary fields, and validation messages are ordinary variants rather than new states.

The backend remains authoritative for invitation validity, deadline enforcement, named-invitee authorization, allocation `kind`/`maximumCount`, capacity reconciliation, response authorization, grouped-child count bounds, derived `overallAttendance`, exact age-total reconciliation, attendee-detail requirements, storage success, and initial-versus-revision classification.

### State 1 — Entry Ready

#### Purpose

Allow a guest to enter the six-character code printed on the invitation.

#### Required sections

1. **Introductory instructions**
   - Explain that the guest must enter the invitation code printed on the invitation.
2. **QR-code explanation**
   - Explain that the invitation QR code opens the general wedding website.
   - Explain that the printed code must still be entered here.
3. **Invitation-code location instructions**.
4. **Invitation-code input**
   - Accept approved formatting variations.
   - Do not imply fuzzy matching or automatic correction.
5. **Lookup action**
   - Use a clearly labeled control such as `Find My RSVP`.
6. **Deadline/countdown**.
7. **Printed-response alternative and assistance**.
8. **Concise privacy notice and Privacy link**.

#### Entry-state behavior

- Do not expose whether any code exists before lookup succeeds.
- Do not provide guest directory/name search/code recovery/fuzzy suggestions.
- Do not describe the invitation code as a password.
- Keep the code out of URLs and metadata.

### State 2 — Looking Up Invitation

#### Purpose

Communicate lookup progress and prevent accidental duplicate activation.

#### Required elements

- Visible progress/status message.
- Duplicate lookup activation disabled/guarded while pending.
- Accessible status announcement.
- Entered code may remain in the input while pending but must not be copied into URL, analytics, or metadata.

### State 3 — Invalid Invitation

#### Purpose

Communicate that the entered code could not open a form without revealing whether the cause was malformed input, unknown code, inactive data, or environment eligibility.

#### Required content

- Neutral invalid-invitation message.
- Code-entry control for another attempt.
- Printed-invitation guidance.
- Assistance contact.
- Deadline information where appropriate.

#### Prohibited disclosures

Do not reveal:

- Internal syntax validity.
- Whether a similar code exists.
- Whether the code corresponds to an inactive record.
- Whether the code belongs to development/testing data.
- Guest/household names.
- Production record count.

### State 5 — Validated Blank Form

#### Purpose

Display the authorized personalized RSVP form after successful invitation validation while revealing only the information required to complete the RSVP.

The form opens blank on every successful lookup, including when a stored RSVP already exists.

#### Personalization permitted

The validated form may receive/display:

- Reviewed invited-party display/greeting content.
- Explicit `wordingMode`.
- Positive whole-number `maximumAttendance`, representing total possible party capacity.
- Authorized `namedInvitees`, each limited to:
  - stable opaque `id`
  - approved `displayName`
- Authorized `additionalGuestAllocations`, each limited to:
  - stable opaque `id`
  - safe `kind`
  - reviewed guest-facing `prompt`
  - positive whole-number `maximumCount`
- Reusable question/option/condition/validation metadata.
- Deadline/time-zone information.
- Fixed email-only confirmation capability.

Supported allocation kinds are:

- `plus1`
- `unnamedChildren`

A `plus1` allocation always has `maximumCount: 1`.

At most one `unnamedChildren` allocation exists for an invitation. Its `maximumCount` represents the complete source-authorized unnamed-child capacity for that invitation.

Every valid private configuration must satisfy:

`namedInvitees.length + sum(additionalGuestAllocations.maximumCount) === maximumAttendance`

Allocation-array length is **not** person capacity. One grouped child allocation can authorize several children.

A party with no allocations receives no additional-guest controls.

Every named invitee receives one separate Yes/No attendance decision while the party is attending.

The browser must not infer named-invitee authorization, Plus1 authorization, grouped-child authorization, `maximumCount`, wording mode, or `maximumAttendance` from greeting text, household assumptions, `Kids(n)` knowledge, or any value not returned by the validated backend configuration.

#### Personalization prohibited

The form must not receive/display:

- Any other invitation code/party record.
- Complete private source rows.
- Raw `Kids(n)` source text.
- Private source row identifiers.
- Source-only Plus1/child mapping metadata beyond approved prompt/rendering fields.
- Private administrative notes.
- Previously stored RSVP answers.
- Previously stored confirmation email destination or protected legacy confirmation/contact details.
- Stored RSVP version/history.
- Delivery records.
- Credentials, spreadsheet ids, provider secrets, or administrative destinations.

#### Required introductory sections

1. **Personalized greeting**.
2. **Blank-form notice**
   - Explain that stored RSVP answers are not displayed.
3. **Initial-submission guidance**
   - Explain that an initial response must supply every applicable required value.
4. **Revision guidance**
   - Returning guests still receive a blank form.
   - Omitted applicable RSVP fields ordinarily remain unchanged.
   - Submitted replacements replace stored counterparts.
   - Backend dependency rules clear values made inapplicable by another change.
   - Composition changes can require a complete attendee-detail replacement.
5. **Deadline/countdown**.
6. **Printed-response alternative and assistance**.
7. **Concise privacy notice and Privacy link**.

#### Required substantive RSVP questions

The form uses one reusable substantive structure. There is no production question-profile selector.

##### 1. Event attendance

Display:

- `Ceremony`
- `Reception`
- Singular/plural decline wording.

Behavior:

- Ceremony and Reception may both be selected.
- Decline is mutually exclusive with both attending choices.
- Initial submission must establish attendance or decline.
- Event choice establishes which wedding events attending party members will attend; it does not determine which people/how many grouped children attend.

##### 2. Named-invitee attendance

When attending, render one Yes/No question for every authorized named invitee.

Each control:

- Uses approved `displayName`.
- Uses stable opaque `id` as submission key.
- Accepts only Yes/No.
- Requires explicit response on initial attending RSVP and decline-to-attending transition.
- May be omitted on an ordinary attending revision only where omission means leave stored response unchanged.

Specifically named children use this same mechanism.

##### 3. Authorized additional-guest controls

Render this region only when one or more authorized allocations exist.

###### Plus1 allocation

For `kind: "plus1"` render:

`Will [Named Invitee] be accompanied by a +1?`

Rules:

- One control per authorized Plus1.
- `maximumCount` must be 1.
- Yes/No only.
- Multiple Plus1 authorizations remain separate controls.
- Do not ask for the Plus1's name here.
- If attending, the Plus1's name is collected later in Attendee Details.

###### Grouped unnamed-children allocation

For `kind: "unnamedChildren"` render exactly one family-level question:

`We'd love for your family to celebrate with us this Mayday - will your kid(s) be accompanying you?`

Rules:

- Use one Yes/No toggle/control for the group.
- Do **not** render one Yes/No control per possible child.
- While unanswered or No, no child-count selector is applicable.
- No corresponds to `{ "attending": "no", "count": 0 }`.
- When Yes is selected, reveal one required dropdown.
- Dropdown choices are every whole number from `1` through that allocation's `maximumCount`.
- Yes corresponds to `{ "attending": "yes", "count": k }`.
- Do not request children's names here.
- Actual child names are collected later through ordinary Attendee Details.
- A specifically named child is represented as a named invitee and is never duplicated in this grouped control.
- The browser does not derive the grouped control or maximum from `maximumAttendance`, visible names, or raw `Kids(n)` source data.

For both allocation kinds, browser code must not invent allocation ids or submit responses for unreturned allocations.

##### 4. Derived actual attendance and age-category totals

The interface may display the current derived actual attending count for usability.

`overallAttendance` is not independently guest-editable.

Derive provisionally as:

`named-invitee Yes count + Plus1 Yes count + grouped unnamed-child selected count`

Contribution rules:

- Named Yes = 1.
- Plus1 Yes = 1.
- Grouped children Yes = selected count.
- All corresponding No values = 0.

An attending RSVP must derive at least 1; full decline derives 0.

Display the approved prompt:

> To better accommodate the seating & dietary needs of our guests, please list the total number of attendees in your party:

Display four numerical dial/stepper controls:

- Adults, ages 21+.
- Young Adults, ages 18–20.
- Children, ages 3–17.
- Children under 3.

Rules:

- Each is a nonnegative whole number.
- They classify the already-derived party; they do not choose headcount independently.
- Complete sum must equal derived `overallAttendance`.
- Available maxima coordinate against the remaining unclassified portion of derived attendance.
- Changing a named/Plus1 response or grouped child count updates the derived required total.
- Full decline clears attendance totals.

##### 5. Attendee Details

Render whenever derived `overallAttendance > 0`, including Ceremony-only attendance.

Create exactly one row per attending person.

Each row contains:

1. **Attendee name**
   - Required.
   - Maximum 100 characters.
2. **Dietary or allergy information**
   - Only when Reception is selected.
   - Optional.
   - Maximum 1000 characters.
   - Do not append `(optional)` to visible label.

Rules:

- Row count equals derived `overallAttendance` exactly.
- Ceremony-only still requires names.
- Rows represent every attending named invitee, Plus1, and each child represented by grouped child count.
- Additional-guest names are collected here, not in allocation controls.
- Full decline clears Attendee Details.
- Named/Plus1 changes that alter attending composition require complete list replacement.
- **Any grouped child response/count change requires complete Attendee Details replacement**, even if an offsetting change leaves `overallAttendance` numerically unchanged.
- Removing Reception while composition remains unchanged preserves names but clears dietary/allergy values.
- Adding Reception while composition remains unchanged does not require name re-entry.
- Backend must not guess which row corresponds to a newly attending/no-longer-attending person.
- Do not ask for entrée selections.

#### Required operational confirmation fields

Every initial RSVP submission and revision requires:

1. **Guest confirmation email**
   - A newly entered, valid email address is required.
   - The address must be entered again for every revision, even if the guest previously supplied the same address.
   - Previously stored confirmation addresses must never be displayed or prefilled.

2. **Fixed confirmation method**
   - The guest confirmation method is always `email`.
   - No guest-selectable confirmation method control is presented.
   - The approved target confirmation object is:
     `{ "method": "email", "email": "guest@example.com" }`

3. **Email-only delivery**
   - SMS and Text Message confirmations are not offered.
   - No mobile number or transactional SMS authorization is collected for confirmation.
   - A separate protected administrative email attempt follows successful RSVP storage.
   - Guest and administrative email attempts proceed independently.
   - Delivery failures or uncertainty must not undo a successfully stored RSVP.

A successfully validated revision replaces the stored guest confirmation email destination with the newly submitted address.

Any historical SMS contact information or authorization records remain protected until controlled retirement. Existing disabled SMS-capable implementation paths require separately reviewed and tested removal before the email-only target can be declared fully implemented.

#### Revision/update controls

Because validated forms open blank, instructions must distinguish omission from replacement and backend dependency clearing.

The interface must allow the guest to deliberately:

- Change Ceremony/Reception/decline.
- Change named-invitee Yes/No.
- Change Plus1 Yes/No.
- Change grouped child No/Yes and selected child count.
- Replace an age-category total, including with explicit zero.
- Replace complete Attendee Details when attendance composition changes.
- Remove Reception while preserving applicable attendee names and clearing dietary values.
- Add Reception without unnecessary name re-entry when composition is unchanged.
- Fully decline, which clears attendance-dependent substantive state.

There is no generic client substantive `clear` operation.

#### Submission controls

Provide:

- Neutral action such as `Submit RSVP`.
- Visible submission-in-progress state.
- Duplicate-submit guarding for the current logical request.
- No implication that blank form means no prior RSVP exists.

#### Validation responsibilities visible to the guest

Guest-facing validation must cover at least:

- Valid attending/decline state.
- Attendance and decline cannot coexist.
- Named response ids must be authorized; values Yes/No only.
- Plus1 allocation ids must be authorized; values Yes/No only.
- Grouped child allocation id must be authorized.
- Grouped child Yes requires a whole-number count from 1 through `maximumCount`.
- Grouped child No requires count 0.
- Wrong allocation-kind response shapes are invalid.
- A party with no allocations must not submit `additionalGuestResponses`.
- Attending event state must derive at least one attendee.
- `overallAttendance` cannot be client-overridden.
- Age-category values are nonnegative whole numbers and sum exactly to derived attendance.
- Attendee Details required whenever anyone attends.
- Attendee Details row count equals derived attendance.
- Every attendee name required; maximum 100 characters.
- Dietary/allergy text only for Reception; maximum 1000 characters.
- Any grouped child response/count change requires complete attendee-detail replacement.
- Other composition changes require complete attendee-detail replacement even if headcount is unchanged.
- Newly applicable structures during revisions must be supplied.
- Confirmation-method dependencies must be satisfied.

The backend independently validates all of the above.

#### Excluded questions

The form must not introduce:

- Per-person Ceremony/Reception event selection.
- Named attendance controls for unauthorized people.
- General Plus1 option without source authorization.
- Numeric multiple-Plus1 count replacing separate authorized Plus1 questions.
- One unnamed-child Yes/No control per possible child.
- A standalone Plus1-name or child-name field outside Attendee Details.
- A separate child substantive response region.
- Party-level dietary field replacing per-attendee Reception-specific dietary fields.
- Accessibility, lodging, transportation, message-to-couple, entrée-selection, or other unapproved substantive questions.

### State 7 — Submitting

#### Purpose

Communicate that submission is being processed and prevent accidental duplicate activation.

#### Required behavior

- Disable/guard repeated submit activation while current logical request is in flight.
- Preserve page-entered values while pending.
- Use accessible status messaging.
- Do not claim storage success until backend confirms it.

### State 6 — Validation Failure

#### Purpose

Allow correction of a request that the browser/backend identifies as invalid without implying storage.

#### Required elements

- Accessible form-level validation summary.
- Field-level messages associated with applicable controls.
- Preserve current page-entered values.
- Grouped child errors attach to the family-level Yes/No or child-count dropdown as appropriate.
- Do not reveal stored RSVP values while explaining a revision failure.
- Do not create a new top-level route/state.

### State 8 — Submission Uncertain

#### Purpose

Handle an outcome where the client cannot safely determine whether storage succeeded.

#### Required content and behavior

- Uncertainty-safe explanation.
- Do not claim success or failure.
- Do not create a new submission identifier merely because the first response is uncertain.
- If the approved retry path is offered, retry the same logical request/idempotency identity.
- Do not automatically create another revision/version.
- Provide assistance guidance.

### State 4 — Service Unavailable

#### Purpose

Handle known service/backend failure before successful storage is established.

#### Required content and behavior

- State that the RSVP service is temporarily unavailable.
- Do not imply the invitation code is invalid.
- Provide assistance information where appropriate.
- Do not expose infrastructure/provider/spreadsheet details.

#### Exclusions

- Do not use this state after backend has already proven storage succeeded; delivery problems after storage belong to State 11.

### State 13 — RSVP Closed

#### Purpose

Replace editable RSVP controls at/after the authoritative deadline.

#### Required sections

- Closed-RSVP heading.
- Written deadline.
- Explanation that online editing is closed.
- Assistance contact.
- Printed-response guidance if still appropriate.

#### Closed-state behavior

- Remove/disable editable online form controls.
- Backend remains authoritative for deadline enforcement.
- Do not allow a stale browser view to bypass the deadline.

## RSVP Confirmation

**Route:** `/wedding/rsvp/confirmation`

**Visibility:** Personalized temporary state when a usable successful-submission response is available; non-personalized recovery fallback when temporary confirmation state is absent/unusable

**Search indexing:** No

**Primary navigation:** No, although the safe global shell may remain

### Purpose

- Confirm successful RSVP storage.
- Distinguish initial submission from revision.
- Display the complete current RSVP after merge.
- Display named-invitee, Plus1, and grouped-child attendance results accurately.
- Report guest/admin confirmation-delivery attempts.
- Explain how to make another deliberate revision before the deadline.

### Phase 3 Confirmation States — Step 10 Model, Step 13 Refresh Finalization

States 9–11 require a structurally usable successful-submission response proving storage. State 12 is used when that temporary response is absent/unusable.

#### State 9 — Confirmed Initial Submission

Use only when backend proves an initial RSVP was stored and no delivery-warning state is required.

#### State 10 — Confirmed Revision

Use only when backend proves a revision was stored and no delivery-warning state is required. Display the complete merged current RSVP, not only changed fields.

#### State 11 — Stored with Delivery Warning

Use when storage succeeded but guest confirmation, protected admin confirmation, or both failed/remain uncertain. Continue to state that RSVP was recorded and do not instruct resubmission merely because delivery failed.

#### State 12 — Confirmation Refresh Fallback

Use when the route loads without structurally usable temporary success state.

This may occur after refresh/direct visit/bookmark/new tab/history return once temporary state is unavailable.

Do not infer success from reaching the route, infer failure from missing state, automatically lookup/replay, generate/reuse a new submission identifier, or retrieve stored RSVP through an undocumented recovery endpoint.

### Required sections

1. **Success heading**
   - Clearly state RSVP was recorded.
2. **Submission type**
   - Initial or revision.
3. **Complete current RSVP summary**
   - Ceremony.
   - Reception.
   - Decline.
   - Every applicable named-invitee Yes/No response using display names.
   - Every applicable Plus1 Yes/No response using safe prompt/label.
   - For grouped unnamed children:
     - the family-level Yes/No result;
     - when Yes, the selected attending-child count.
   - Backend-derived `overallAttendance` when attending.
   - Adults 21+.
   - Young Adults 18–20.
   - Children 3–17.
   - Children under 3.
   - Complete Attendee Details list whenever attending.
   - Reception dietary/allergy values where supplied.
   - No invented dietary placeholders when Reception is not selected.
4. **Submission/revision timestamp**.
5. **Guest confirmation method (email only)**.
6. **Guest delivery-attempt status**.
7. **Limited admin-email-attempt status/notice**
   - Never expose destination.
8. **Revision instructions**
   - Return to `/wedding/rsvp/`.
   - Re-enter invitation code.
   - Re-enter a valid guest confirmation email address.
   - Submit only intended changes except where dependency/composition rules require complete structures.
   - Any grouped child response/count change requires complete Attendee Details replacement.
   - Other composition changes likewise require complete replacement even at same headcount.
   - Removing Reception alone preserves names when composition unchanged and clears Reception-only dietary values.
   - Omitted applicable fields otherwise remain unchanged unless dependency rules make them inapplicable.
   - Next confirmation contains complete updated RSVP.
9. **Deadline**.
10. **Return-to-site link**.
11. **Assistance information**.

### Confirmation-delivery behavior and warning variants

After storage, guest and protected admin delivery attempts proceed independently.

If either fails/remains uncertain:

- State clearly that RSVP was recorded.
- Use success-with-delivery-warning, not submission failure.
- Distinguish warning category without provider/admin-address disclosure.
- Do not instruct resubmission solely because delivery failed.
- Provide assistance guidance where useful.
- Administrative resend does not change RSVP content/version.

### Phase 3 Step 13 Finalized Refresh-without-State Variant

#### Entry condition

Render State 12 when no structurally usable temporary success response is available.

If usable success state remains available, continue to render State 9, 10, or 11 instead of forcing fallback.

#### Final approved guest-facing copy

**Heading**

> Confirmation Summary No Longer Available

**Primary explanation**

> The temporary on-screen RSVP summary is no longer available. If you submitted an RSVP, it may already have been recorded. Please check your email for confirmation. Do not submit the same response again only because this summary is unavailable.

**Revision guidance**

> To make a deliberate revision, return to the RSVP page and enter your invitation code again.

**Assistance wording**

> If you are unsure whether your RSVP was received, contact us at RSVPhelp@loreweavercreations.com.

#### Required actions

1. **Return to RSVP**
2. **Contact for Help**
3. **Return to wedding website**

#### Prohibited recovery behavior

State 12 must not:

- Automatically call lookup.
- Automatically replay submission.
- Generate/reuse an idempotency identifier merely on entry.
- Reconstruct response from URL/history/analytics/metadata.
- Expose public saved-RSVP retrieval.
- Expose confirmation-recovery token in URL.
- Claim no RSVP exists merely because temporary state is missing.

#### Accessibility responsibilities

- Move focus to/announce fallback heading/message.
- Keep actions keyboard/touch operable.
- Do not rely on color/animation alone.
- Respect reduced motion.
- Do not use a timed redirect that prevents reading.

### Exclusions

- No invitation code in URL.
- No private source metadata.
- No internal RSVP version/history.
- No raw `Kids(n)` text.
- No allocation-array-length-as-headcount display.
- No separate child-specific summary field outside the applicable allocation response/count and attendee-details list.
- No automatic saved-RSVP recovery.
- No provider secrets or protected administrative destination.

### Phase 3 Step 10 RSVP State-Transition Responsibilities

The state-transition responsibilities remain:

- Entry Ready → Looking Up Invitation.
- Looking Up Invitation → Invalid Invitation, Service Unavailable, RSVP Closed, or Validated Blank Form.
- Validated Blank Form → Validation Failure or Submitting.
- Validation Failure → Validated Blank Form/Submitting after correction.
- Submitting → Validation Failure, RSVP Closed, Service Unavailable, Confirmed Initial Submission, Confirmed Revision, Stored with Delivery Warning, or Submission Uncertain according to definitive result.
- Temporary confirmation state loss → Confirmation Refresh Fallback.
- At the authoritative deadline, editable RSVP states yield to RSVP Closed.

## Theme & Attire

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

### In-page navigation

Provide an **Explore this page** menu near the top and a **Jump To** menu at the end of each major section for:

- A Hair-Raising Happily-Ever-After.
- From Engagement to Wedding Day.
- Join Us.

The links use same-page fragment anchors and must remain keyboard-operable.

---

## Read, Listen & Watch

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

### In-page navigation

Provide the established **Explore this page** menu near the top and **Jump To** navigation at the end of each major section using same-page fragment anchors.

---

## Venue

**Route:** `/wedding/venue`

**Visibility:** Public

**Search indexing:** Yes

**Primary navigation:** Yes

**Confirmed-event dependency:** Yes

### Purpose

- Present the confirmed ceremony and reception location.
- Make it clear that the entire celebration takes place at Sphinx Banquet and Catering Center.
- Provide the confirmed address, map links, parking information, and contextual planning links.
- Keep venue facts consistent with Home, Travel, Day-Of Details, and FAQ.

### Confirmed public venue information

- **Sphinx Banquet and Catering Center**
- 121 E 2nd Avenue, Roselle, NJ 07203.
- Ceremony and reception both take place at this venue.
- Ceremony begins at 11:30 a.m.
- Festivities conclude at 4:30 p.m.
- Municipal parking is available in the lot directly across the street.

### Required sections

1. **Venue introduction**
   - State clearly that both ceremony and reception are at Sphinx.
2. **Address**
   - Present the confirmed street address.
3. **Directions**
   - Provide Google Maps and Apple Maps external links.
4. **Parking**
   - Explain the municipal lot across the street.
5. **Related planning links**
   - Travel.
   - Day-Of Details.
   - Theme & Attire where contextually useful.

### External-link behavior

Map links open in a new tab and are identified accessibly.

### Exclusions

- Do not present Warinanco Park as a current, pending, alternate, or weather-fallback ceremony location.
- Do not create a separate ceremony-to-reception travel segment.
- Do not invent a separate cocktail-hour or formal-dinner block.
- Do not publish private setup/vendor/wedding-party timing.

---

## Travel

**Route:** `/wedding/travel`

**Visibility:** Public

**Search indexing:** Yes

**Primary navigation:** Yes

**Confirmed-event dependency:** Yes

### Purpose

- Help guests traveling from a distance plan for the confirmed Sphinx-only wedding.
- Provide current driving/parking information.
- Preserve an honest, structured hotel-information area while hotel recommendations or booking details remain forthcoming.
- Avoid inventing hotel, rate, booking, transportation, or accessibility details that have not been confirmed.

### Required sections

1. **Venue/location reminder**
   - Sphinx Banquet and Catering Center, Roselle, New Jersey.
2. **Driving & Parking**
   - Municipal parking is available in the lot directly across the street.
   - Provide approved map links.
3. **Hotels & Overnight Stays**
   - State warmly that hotel recommendations and any booking/block details are still being gathered.
   - Do not claim that a room block or negotiated rate exists unless later confirmed.
4. **Pending hotel structure**
   - Preserve headings/space for future hotel name, address, booking instructions, rate/block details, deadlines, and accessibility information.
5. **Contextual planning links**
   - Venue.
   - Day-Of Details.
   - FAQ where useful.

### Pending-content behavior

Until hotel information is finalized:

- Publish only accurate confirmed information.
- Do not invent a hotel, group rate, booking code/link, booking deadline, cancellation rule, or accessibility claim.
- Use cordial guest-facing pending language rather than administrative placeholder language.
- The unresolved hotel dependency does not invalidate the rest of the Travel page or block Workstream 4 content completion.

### Event-day travel behavior

- The entire wedding takes place at Sphinx.
- Do not create between-venue directions or a guest travel window between ceremony and reception.
- Do not use flexible reception activities as artificial travel deadlines.

### Link behavior

External map and later-approved hotel links open in a new tab and are identified accessibly.

---

## Day-Of Details

**Route:** `/wedding/day-of`

**Visibility:** Public

**Search indexing:** Yes

**Primary navigation:** Yes

**Confirmed-event dependency:** Yes

### Purpose

- Give guests one friendly, concise destination for the wedding-day schedule, brunch menu, dietary guidance, and gift policy.
- Present the confirmed Sphinx-only schedule without creating a minute-by-minute reception run-of-show.
- Provide direct links to Venue and RSVP where guests need additional action or planning information.

### In-page navigation

Near the top, provide an **Explore this page** menu linking to:

- The Schedule.
- The Menu.
- Dietary Needs.
- Gift Policy.

At the end of each major section, provide the matching **Jump To** menu using same-page fragment links.

### The Schedule

1. **11:30 a.m. — Ceremony**
   - Encourage guests to arrive a little early and settle in.
2. **After the Ceremony — Brunch & Celebration**
   - Ceremony flows directly into a relaxed afternoon of buffet brunch, dancing, speeches, and celebrating.
   - There is no formal cocktail hour or minute-by-minute guest itinerary.
   - Speeches and other flexible moments may be announced during the reception.
3. **4:30 p.m. — Festivities Conclude**
   - Confirm that everything takes place at Sphinx.
   - Link to Venue for directions and parking.

### The Menu

Present the approved current brunch menu, including:

- Hot Brunch Buffet.
- Bagels & Schmears.
- Gluten-Free Bagels.
- Schmears.
- Appetizing.
- Seasonal fruit.
- Coffee, tea, and mockmosas.
- Dessert selection explicitly marked as still to be announced.

The page may use approved thematic imagery/captions around the menu provided publication rights/attribution, accessibility, and responsive presentation requirements are met.

### Dietary Needs

- State that gluten-free and non-dairy options will be available.
- Ask guests to include food allergies, dietary restrictions, or other food-related needs with their RSVP.
- Include the cross-contact/common-allergen preparation disclaimer.
- Link to RSVP.

### Gift Policy

- State that the couple is not using a traditional wedding registry.
- Explain that thoughtful/handcrafted gifts or contributions toward future plans are welcome if a guest wishes to give something.
- Render the centralized preferred and non-preferred gift categories.
- Emphasize warmly that the guest's presence matters more than bringing a gift.
- Do not create a separate gift-registry page or external registry link.

### Exclusions

- No private setup times.
- No vendor-only or wedding-party-only timing.
- No separately scheduled formal cocktail hour.
- No separately scheduled formal dinner period.
- No fixed public dancing block.
- No exact public times for flexible reception activities unless a later recorded decision approves them.
- No Warinanco or between-venue schedule.
- No gift registry.

---

## Frequently Asked Questions

**Route:** `/wedding/faq/`

**Visibility:** Public

**Search indexing:** Yes

**Primary navigation:** Yes

### Purpose

- Give guests quick, cordial answers to the questions they are most likely to ask.
- Keep answers useful on their own while linking to the page containing the fuller explanation.
- Avoid clinical, implementation-oriented, or administrative wording.
- Avoid duplicating long page content.

### Required guest-facing questions and destinations

1. **Where are the ceremony and reception?**
   - Answer with the confirmed Sphinx-only location.
   - Link to Venue.
2. **When should I arrive?**
   - State the 11:30 a.m. ceremony start and recommend arriving a little early.
   - Link to Day-Of Details.
3. **Where can I park?**
   - Explain the municipal lot directly across the street.
   - Link to Venue.
4. **What should I wear?**
   - Summarize Vintage Garden Formal and statement-hat guidance.
   - Link to Theme & Attire.
5. **What does the day look like?**
   - Summarize the relaxed Sphinx-only 11:30 a.m.–4:30 p.m. flow without inventing a formal cocktail hour or minute-by-minute itinerary.
   - Link to Day-Of Details.
6. **When is the RSVP deadline?**
   - Use the centralized RSVP deadline.
   - Link to RSVP.
7. **Can I mail in my RSVP instead?**
   - Explain the printed RSVP alternative.
   - Link to RSVP.
8. **Can I change an RSVP I've already submitted?**
   - Explain that revisions remain available before the deadline by re-entering the invitation code and completing the blank revision form.
   - Link to RSVP.
9. **What if I have dietary needs?**
   - Summarize the approved dietary guidance and cross-contact caveat.
   - Link to Day-Of Details and RSVP.
10. **Are hotels arranged?**
    - Use warm pending language explaining that hotel recommendations/booking details are still being gathered.
    - Link to Travel.
11. **What is your gift policy?**
    - Summarize the no-registry policy and emphasize that presence matters most.
    - Link to Day-Of Details.
12. **How does RSVP information stay private?**
    - Summarize the limited-data/blank-form approach in plain language.
    - Link to Privacy.
13. **How do I get RSVP help?**
    - Use the approved assistance email.
    - Link to RSVP.

### Link rule

Every FAQ answer that has a corresponding in-depth guest page must contain a contextual link to that page.

### Privacy/RSVP explanation boundary

The FAQ may explain RSVP behavior conceptually but must not expose:

- Raw source-spreadsheet syntax.
- Invitation codes.
- Another party's named-invitee roster or capacities.
- Internal allocation identifiers.
- Provider/backend details.
- Stored RSVP answers.

Detailed privacy handling belongs on Privacy. Detailed RSVP interaction belongs on RSVP. Detailed day-of information belongs on Day-Of Details.

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

**Route:** `/wedding/privacy/`

**Visibility:** Public

**Search indexing:** Yes

**Primary navigation:** Yes; also linked from the footer and RSVP/FAQ contexts

### Purpose

Explain what RSVP information is collected, why it is collected, how the blank-form/revision model works, how confirmation delivery operates, how access is limited, and how RSVP-operational data is retired.

### Required sections

1. **Invitation-code use**
   - Explain that the code unlocks one party's blank form.
   - Do not describe it as a password.
2. **Substantive RSVP data collected**
   - Ceremony/Reception/decline.
   - Named-invitee Yes/No responses.
   - Plus1 Yes/No responses where authorized.
   - Grouped unnamed-child family Yes/No and selected child count where authorized.
   - Backend-derived overall attendance.
   - Four age-category totals.
   - Attendee names for every attending person.
   - Reception-specific per-attendee dietary/allergy information where supplied.
3. **Operational confirmation data**
   - Guest confirmation email address, newly entered for every initial submission and revision.
   - Fixed email confirmation method.
   - No new mobile-number collection or SMS authorization.
   - Any historical SMS contact or authorization information remains protected until controlled retirement.
4. **Invitation-specific controls**
   - Explain that named-invitee, Plus1, and grouped-child controls appear only when authorized for that validated invitation.
   - Do not expose raw source spreadsheet concepts or other parties' configuration.
5. **Blank forms and revisions**
   - Stored answers/contact data are not displayed on lookup.
   - Revisions merge submitted replacements privately with current stored state.
   - Omitted applicable substantive fields ordinarily remain unchanged.
   - Backend dependency rules clear values made inapplicable.
   - No generic client substantive `clear` operation is required.
   - Grouped child response/count changes can require complete attendee-detail replacement.
6. **Confirmation delivery**
   - Explain guest email confirmations and the separate protected administrative email attempt after successful RSVP storage.
   - Explain that delivery failures do not undo a successfully stored RSVP and that guest and administrative delivery outcomes are independent.
7. **Storage/access**
   - Explain private backend storage and limited authorized administrative access.
8. **Data minimization**
   - Browser receives only limited safe invitation-specific data.
   - Safe allocation data may include `kind`/`maximumCount` because those are required to render the authorized controls.
   - Browser does not receive raw `Kids(n)` source text, unrelated parties, private source rows, administrative notes, or secrets.
9. **No public saved-RSVP retrieval**
   - Explain that blank-form lookup does not expose stored RSVP answers.
10. **Retention**
   - Active RSVP-operational data retired no later than July 30, 2027 unless a documented minimum-record exception applies.
   - Protected backups containing retired operational RSVP data expire no later than August 29, 2027.
   - Private `Invitees List` may remain separately as personal planning/address data without retaining public RSVP response history.
11. **Security statement**
   - Describe reasonable safeguards without claiming absolute security.
12. **Contact**
   - RSVP assistance/privacy contact as approved.

### Exclusions

- Do not publish real invitation codes.
- Do not publish real guest rosters or allocation mappings.
- Do not publish raw `Kids(n)` source values or source row identifiers.
- Do not publish confirmation destinations.
- Do not publish provider credentials/workbook ids/admin recipient.
- Do not promise absolute confidentiality/security.
- Do not imply advertisers/public analytics receive RSVP data.

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
5. Link to Venue.
6. Link to Day-Of Details.
7. Link to FAQ.
8. Assistance information where appropriate.

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

- Couple's names.
- Wedding date.
- General location.
- RSVP deadline.
- Countdown start.
- RSVP assistance email.
- Confirmed Sphinx-only event configuration.
- Venue names, addresses, confirmed outer event times.
- Flexible reception-description policy.
- Buffet-service policy.
- Mimosa-station confirmation status.
- Hotel-block dates.
- Gift policy.
- Privacy-page route.
- Primary navigation labels.
- External thematic-resource links.
- Gallery launch state.
- Reusable RSVP question/schema definition.
- `maximumAttendance` as potential-party capacity.
- Configuration reconciliation:
  `namedInvitees.length + sum(additionalGuestAllocations.maximumCount) === maximumAttendance`
- Named-invitee rendering/authorization and Yes/No response rules.
- Additional-guest allocation rendering/authorization rules:
  - `plus1` with `maximumCount: 1`
  - `unnamedChildren` with invitation-specific grouped `maximumCount`
- Exact grouped-child family prompt and conditional count-selector behavior.
- Backend-derived `overallAttendance` formula.
- Exact age-total reconciliation.
- Attendee Details cardinality/name validation/composition replacement/Reception-specific dietary rules.

## Page-specific content ownership

- **Home:** welcome message, hero artwork, teasers/calls to action.
- **RSVP:** entry instructions, validation messages, revision instructions, named-invitee wording, Plus1 wording, grouped child family prompt and count-selector guidance, derived-headcount/age-dial presentation, Attendee Details wording, Reception dietary wording, confirmation-field wording, privacy reassurance, closed/unavailable states.
- **Confirmation:** success, complete summary including grouped child count where applicable, delivery warning, refresh fallback, revision wording.
- **Theme & Attire:** aesthetic, attire, palette, examples, images, downloads, disclaimer.
- **Our Story:** relationship narrative/approved media plus Explore this page / Jump To navigation.
- **Read, Listen & Watch:** descriptions, lawful external links, availability disclaimer, and established Explore this page / Jump To navigation.
- **Venue:** confirmed Sphinx details, address, map links, parking, and contextual planning links.
- **Travel:** hotel block, transportation, driving, travel-accessibility info, genuine guest deadlines.
- **Day-Of Details:** confirmed schedule, current brunch menu, dietary guidance, Gift Policy, and in-page jump navigation.
- **FAQ:** warm guest-facing answers for venue, arrival, parking, attire, day-of timing, RSVP, dietary needs, hotels, Gift Policy, Privacy, and assistance, with contextual links to the corresponding in-depth pages.
- **Gallery:** Coming Soon copy and reviewed post-wedding media.
- **Privacy:** complete RSVP privacy explanation, including grouped child attendance/count data.
- **Not Found:** guest-safe recovery wording.

---

# Page-Level Exclusions

No page may include:

- Hosted copyrighted ebook/audiobook/full-length film files.
- Public Nextcloud links to copyrighted source media.
- Gift registry page/registry links.
- Entrée-selection content.
- Separate RSVP page per invitation.
- Code-bearing personalized RSVP URLs.
- Prefilled/displayed stored RSVP answers.
- Public administrative dashboard.
- Private wedding-party-only schedule details.
- Separately scheduled formal cocktail hour or formal dinner.
- Fixed public times for flexible reception activities.
- Invented separate ceremony-ending/reception-starting times or other unapproved internal transition.
- Unconfirmed self-service mimosa station.
- Substantive RSVP questions outside the approved structure.
- Per-person Ceremony/Reception controls.
- General Plus1 option without authorization.
- Grouped child control inferred by browser rather than returned by backend.
- One unnamed-child Yes/No control per possible child.
- Raw `Kids(n)` source syntax shown to guests.
- Numeric multiple-Plus1 count replacing separate Plus1 controls.
- Standalone Plus1/child name question outside Attendee Details.
- Separate child-specific substantive response region.
- Party-level dietary field replacing per-attendee Reception dietary fields.
- Accessibility/lodging/transport/message-to-couple questions inside RSVP.
- Omitted revision fields treated as deletions while still applicable.
- Guest-selectable confirmation methods or SMS/Text Message delivery options.
- Former Warinanco/alternate-event content presented as current or pending guest information.

---

# Page Outline Completion Review

This document is complete when:

- Every browser-facing route has a defined purpose, visibility, indexing treatment, and required content/state.
- Public/personalized RSVP states are clearly distinguished.
- Manual code entry is the only personalized RSVP access method.
- No code-bearing RSVP route is required.
- Blank-form/partial-revision responsibilities are documented.
- One reusable spreadsheet-authoritative RSVP structure is documented without exposing private production source rows.
- Every named invitee receives one Yes/No attendance control while attending.
- Plus1 controls appear only for authorized Plus1 allocations; each remains a separate Yes/No question.
- Each applicable invitation with unnamed child capacity receives exactly one grouped child family question.
- Grouped child Yes reveals a selector from 1 through backend-authorized `maximumCount`; No means count 0.
- A named child remains a named invitee and is not duplicated.
- Parties without the corresponding allocation receive no additional-guest control.
- `maximumAttendance` is potential-party capacity and reconciles through summed allocation `maximumCount`, not allocation-array length.
- `overallAttendance` derives from named Yes + Plus1 Yes + grouped child count.
- Four age dials classify that derived party and sum exactly to it.
- Attendee Details contains one row per attending person for every attending event combination.
- Grouped child response/count changes require complete Attendee Details replacement.
- Confirmation summaries include grouped child Yes/No and selected count where applicable.
- Email-only guest confirmation and independent protected administrative email-attempt responsibilities are documented.
- Final-month countdown is limited to approved dates/states.
- Sticky navigation, Home/RSVP/FAQ/Privacy footer links, contextual cross-links, and approved in-page jump navigation are documented.
- Privacy page is included.
- Confirmed Sphinx-only event configuration is documented consistently across public pages.
- Day-Of Details contains the confirmed guest schedule, menu, dietary guidance, and Gift Policy without inventing a minute-by-minute reception run-of-show.
- Flexible reception description remains intact.
- Error, closed, service-unavailable, submission-uncertain, delivery-warning, and refresh-fallback states are documented.
- Read/Listen/Watch contains no hosted copyrighted-media features.
- Gallery launch/post-wedding responsibilities are separated.
- No page responsibility contradicts governing requirements/decisions/content inventory/routes.

---

# Phase 3 Step 10 Page-Outline Synchronization Review

The outlines satisfy Step 10 when:

- All thirteen formal RSVP states have explicit responsibilities.
- Entry Ready includes deadline/countdown only in approved window.
- Looking Up prevents duplicate lookup and announces progress.
- Invalid Invitation remains neutral/private.
- Service Unavailable remains distinct from Submission Uncertain.
- Validated Blank Form stays blank and renders only safe validated invitation data, including typed allocations and grouped child count configuration where authorized.
- Validation Failure preserves current page-entered values and can associate errors with grouped child Yes/No/count controls.
- Submitting prevents duplicate activation.
- Submission Uncertain supports safe idempotent retry semantics.
- States 9–11 display complete current RSVP, including grouped child count where applicable.
- State 12 remains uncertainty-safe and URL-private.
- RSVP Closed removes editable controls at deadline.
- Page responsibilities remain synchronized with system design, wireframes, sitemap, and API contract.

---

# Phase 3 Step 13 Page-Outline Synchronization Review

The outlines satisfy Step 13 when:

- Existing thirteen-state model remains unchanged.
- States 9–11 require usable temporary successful-submission state.
- State choice follows successful response content.
- Temporary confirmation details may disappear on refresh/state loss.
- Usable temporary state may continue to render States 9–11.
- Missing/unusable temporary state enters State 12.
- State 12 uses the finalized uncertainty-safe copy/actions.
- State 12 does not automatically lookup/replay/generate ids/retrieve stored RSVP.
- No short-lived recovery token/code-bearing confirmation URL/public saved-RSVP endpoint is required.
- Return to RSVP begins ordinary manual-entry interaction.
- Fallback remains accessible.
- Companion RSVP documents use the same behavior.

---

# Phase 3 Step 14 Page-Outline Synchronization Review

The outlines satisfy Step 14 when:

- Existing thirteen-state model remains unchanged.
- RSVP/confirmation production responses use `Cache-Control: no-store, max-age=0`.
- Successful confirmation data is not intentionally persisted solely to reconstruct it later.
- Transactional RSVP/confirmation states remain non-indexed.
- URLs/metadata exclude invitation codes, answers, destinations, submission ids, raw source data, RSVP versions, provider payloads.
- Analytics, if present, contain no personalized RSVP data.
- Invitation-code copy does not describe codes as passwords or expose directory/recovery/fuzzy-match/saved-RSVP functionality.
- Guest RSVP confirmation uses email exclusively; no SMS activation gate, Text Message option, or new mobile-number collection for confirmation remains in scope.
- Historical SMS contact/authorization information and credentials remain protected until controlled retirement. The existing SMS runtime setting must remain disabled while obsolete code paths exist.
- Privacy page explains email-only guest confirmation, separate protected administrative email delivery, legacy-data safeguards, private storage/access, attendee-name boundaries, Reception dietary boundaries, grouped child attendance/count data, data minimization, retention, and reasonable safeguards.
- Privacy page states July 30, 2027 active-data retirement and August 29, 2027 backup retirement.
- Companion RSVP documents describe the same grouped-child model.

With these responsibilities recorded, `page-outlines.md` is synchronized with the authoritative `Invitees List`, the approved RSVP model through **Phase 3 Step 14**, the September 20 attendance-composition correction, the September 27 grouped unnamed-children clarification, and the November 1, 2026 Workstream 4 public-content lock.
