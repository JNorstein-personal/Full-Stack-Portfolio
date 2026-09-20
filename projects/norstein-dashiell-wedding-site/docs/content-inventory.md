# Wedding Website Content Inventory

## Purpose

This document tracks the written content, images, external resources, personalized RSVP copy, privacy notices, guest and administrative confirmation templates, navigation copy, and post-wedding media required for the Loreweaver Creations wedding website.

Each content item records:

* Its current preparation status.
* Its source or responsible owner.
* Who may view it.
* Whether it must be completed before the invitation-launch version of the website is published.
* Any decisions or implementation requirements affecting the content.

Update this inventory whenever an item is drafted, approved, replaced, verified, published, or determined to be unnecessary.

---

## Governing Documents

This inventory must remain consistent with:

* `docs/requirements.md`
* `docs/decisions.md`
* `docs/route-inventory.md`
* `docs/page-outlines.md`
* `docs/sitemap.md`
* `docs/wireframes.md`
* `docs/link-inventory.md`
* `docs/rsvp-system-design.md`

When a governing requirement, decision, route responsibility, interface state, RSVP data-flow rule, or link-and-asset obligation changes, update the affected inventory items rather than allowing the documents to conflict.

---

## Status Definitions

Use only the following status labels:

* **Ready:** The content is finalized and available for implementation.
* **Draft needed:** The content has not yet been written or assembled.
* **Pending confirmation:** The content exists or is substantially defined but requires final review, approval, verification, or a related final decision.
* **Pending research:** The information or asset must still be researched, collected, or verified through an outside source.
* **Not yet available:** The content cannot currently be completed because it depends on a future event.
* **Not applicable:** The item is no longer required or does not apply to the final website.

A finalized feature or policy does not necessarily mean its exact guest-facing wording is ready. For example, the Gallery’s Coming Soon state is final, but the exact Coming Soon message still requires drafting.

---

## Visibility Definitions

* **Public:** Available to anyone visiting the public wedding website.
* **Personalized:** Available only after the backend validates an invitation code and only to the invited party associated with that code.
* **Private:** Available only to the couple, authorized administrators, or the backend.
* **Post-wedding public:** Intended for public display after the wedding once the material has been reviewed and published.

---

## Launch Requirement Definitions

* **Yes:** Must be ready before the invitation-launch version is published.
* **Recommended:** Should be ready before launch but may be postponed without preventing the essential website and RSVP system from operating.
* **No:** Belongs to the post-wedding or long-term version and must not delay launch.

---

# Home

## CI-HOME-001 — Couple’s Names

**Content Item:**
The names of the couple as they should appear on the wedding website.

**Status:**
Ready

**Source or Owner:**
Printed invitations; couple

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Use the same approved spelling, capitalization, order, and presentation throughout the website and email templates.

---

## CI-HOME-002 — Wedding Date

**Content Item:**
The wedding date displayed throughout the public website.

**Status:**
Ready

**Source or Owner:**
Printed invitations; couple

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
The wedding date is Saturday, May 1, 2027.

Store the date in centralized content or configuration where practical.

---

## CI-HOME-003 — General Wedding Location

**Content Item:**
The city and state displayed as the general wedding location on the homepage.

**Status:**
Ready

**Source or Owner:**
Couple; finalized venue region

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Use “Roselle, New Jersey” as the general location. Both possible event formats take place in Roselle.

---

## CI-HOME-004 — Welcome Message

**Content Item:**
A brief guest-facing message welcoming visitors to the wedding website.

**Status:**
Draft needed

**Source or Owner:**
Couple

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
The message should:

* Welcome guests.
* Establish the wedding’s tone.
* Confirm that they have reached the correct website.
* Direct them toward RSVP and essential planning information.

---

## CI-HOME-005 — Hero Image or Introductory Artwork

**Content Item:**
The principal homepage image, illustration, photograph, or decorative artwork.

**Status:**
Pending confirmation

**Source or Owner:**
Couple; approved artwork or photographs

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Confirm:

* The final asset.
* Publication rights.
* Responsive crop and sizing.
* Appropriate alternative text.

The image must not obscure the RSVP action or essential homepage text.

---

## CI-HOME-006 — Primary RSVP Call-to-Action Wording

**Content Item:**
The text used for the primary homepage RSVP button or link.

**Status:**
Draft needed

**Source or Owner:**
Couple; Decision 009; application

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
The homepage must provide a prominent and clearly labeled link to the public manual-entry page:

`/wedding/rsvp/`

The call to action must not contain, request, or expose an invitation code in its URL.

---

## CI-HOME-007 — Static QR-Code Landing Experience

**Content Item:**
The homepage experience for guests arriving through the QR code printed on the invitations.

**Status:**
Ready

**Source or Owner:**
Printed invitations; Decision 008

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
All 57 active assigned invitations use the same static QR code for:

`https://www.loreweavercreations.com/wedding/`

The homepage must make the RSVP destination immediately apparent. The QR code does not contain an invitation code and does not bypass manual invitation-code entry.
---

## CI-HOME-008 — Brief Our Story Teaser

**Content Item:**
A brief homepage introduction linking to the complete Our Story page.

**Status:**
Draft needed

**Source or Owner:**
Couple

**Visibility:**
Public

**Needed Before Launch:**
Recommended

**Notes:**
This content may provide a short introduction but must not replace the full Our Story page.

---

## CI-HOME-009 — Invitation Mailing and Website Readiness Window

**Content Item:**
The private launch milestone governing when the printed invitations may be mailed.

**Status:**
Ready

**Source or Owner:**
Decision 011

**Visibility:**
Private

**Needed Before Launch:**
Yes

**Notes:**
The printed invitations are intended to be mailed no earlier than October 1, 2026. Before mailing begins, the invitation-launch website must be operational, tested, and displaying the confirmed event configuration.

---

# RSVP Entry Page

## CI-RSVP-001 — RSVP Entry-Page Introduction

**Content Item:**
Introductory wording for the public RSVP entry page.

**Status:**
Draft needed

**Source or Owner:**
Couple; Decisions 009, 016, 018, and 021; application

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Explain that guests must manually enter the six-character code printed on their invitation.

The introduction should also make clear that:

* Invitation codes are not placed in personalized website URLs.
* A validated invitation opens a blank RSVP form.
* The written deadline is Monday, March 1, 2027, at 11:59 p.m. EST.
* A live countdown appears only during the final month before the deadline.
* A concise privacy notice and link to the full Privacy page are available.

---

## CI-RSVP-002 — Invitation-Code Location Instructions

**Content Item:**
Instructions explaining where guests can find their invitation code.

**Status:**
Draft needed

**Source or Owner:**
Couple; printed invitations

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Explain where the code appears on the invitation and display the example format:

`XXX-XXX`

---

## CI-RSVP-003 — Static QR-Code Explanation

**Content Item:**
An explanation of how the printed QR code relates to the RSVP process.

**Status:**
Ready

**Source or Owner:**
Decisions 008–009

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Explain that the invitation QR code opens the general wedding homepage and that the printed invitation code must still be entered manually on the RSVP page.

The application will not distribute code-bearing personalized RSVP links.

---

## CI-RSVP-004 — RSVP Deadline

**Content Item:**
The online RSVP submission and revision deadline.

**Status:**
Ready

**Source or Owner:**
Decisions 003 and 018

**Visibility:**
Public and personalized

**Needed Before Launch:**
Yes

**Notes:**
Online initial submissions and revisions close Monday, March 1, 2027, at 11:59 p.m. EST.

Before February 1, 2027, display the written deadline without a live countdown. Beginning February 1, 2027, at 12:00 a.m. EST, display a live countdown calculated from the `America/New_York` deadline. At and after the deadline, replace the countdown with the closed-RSVP state.

---

## CI-RSVP-005 — RSVP Revision-Policy Wording

**Content Item:**
Guest-facing wording explaining how submitted responses may be changed.

**Status:**
Ready

**Source or Owner:**
Decisions 003 and 016; RSVP requirements

**Visibility:**
Public and personalized

**Needed Before Launch:**
Yes

**Notes:**
Explain that guests may revise their online RSVP without numerical limit before the deadline by returning to the public RSVP page and re-entering the invitation code.

Every form loads blank. For a revision, the guest must complete the required confirmation-contact fields and only the RSVP fields that need to change. Submitted fields replace the corresponding stored answers; omitted RSVP fields remain unchanged. The backend merges and validates the complete response before saving it as the new current version.

The guest’s next confirmation contains the complete updated RSVP, not only the newly submitted fields.

---

## CI-RSVP-006 — Printed RSVP Alternative Instructions

**Content Item:**
Instructions for guests who prefer to use a printed RSVP slip.

**Status:**
Ready

**Source or Owner:**
Decision 006

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Explain that alternative printed RSVP slips are included with the physical invitations and may be returned instead of using the online system.

---

## CI-RSVP-007 — RSVP Assistance Contact Information

**Content Item:**
Contact information for guests experiencing difficulty with the online RSVP.

**Status:**
Ready

**Source or Owner:**
Decision 006

**Visibility:**
Public and personalized

**Needed Before Launch:**
Yes

**Notes:**
Guests who prefer to use the online system but experience difficulty may contact:

`RSVPhelp@loreweavercreations.com`

---

## CI-RSVP-008 — Invalid Invitation-Code Message

**Content Item:**
The neutral message displayed after an invalid or unknown invitation code is submitted.

**Status:**
Ready

**Source or Owner:**
Revised Phase 1–3 plan

**Visibility:**
Public and personalized

**Needed Before Launch:**
Yes

**Approved Wording:**
“We could not locate an invitation associated with that code. Please check the code as printed on your invitation and try again.”

---

## CI-RSVP-009 — Concise RSVP Privacy Reassurance

**Content Item:**
The concise privacy notice displayed on the RSVP entry page and personalized form.

**Status:**
Draft needed

**Source or Owner:**
Decision 021; couple; application

**Visibility:**
Public and personalized

**Needed Before Launch:**
Yes

**Notes:**
Briefly explain:

* That the invitation code is used to retrieve the applicable invitation configuration.
* That RSVP and confirmation-contact information is processed and stored privately.
* That forms load blank and do not display previously stored answers.
* That complete confirmations are sent to the couple by email and to the guest by the selected email or text-message method.
* That further details are available on the full Privacy page.

Do not make unsupported guarantees of absolute security.

---

## CI-RSVP-010 — Personalized RSVP URL Instructions

**Content Item:**
Wording or behavior supporting direct personalized RSVP links containing invitation codes.

**Status:**
Not applicable

**Source or Owner:**
Decision 009

**Visibility:**
Public and personalized

**Needed Before Launch:**
No

**Notes:**
The final RSVP access model uses manual invitation-code entry only at:

`/wedding/rsvp/`

No code-bearing personalized RSVP URLs will be used or distributed, and invitation codes must not remain visible in the browser address bar after submission.

---

# Personalized RSVP Form

## CI-RSVP-011 — Household or Invited-Party Greeting Format

**Content Item:**
The greeting and first-person wording displayed at the beginning of a validated RSVP form.

**Status:**
Ready

**Source or Owner:**
Decisions 015–016; invitation configuration

**Visibility:**
Personalized

**Needed Before Launch:**
Yes

**Notes:**
Each invitation configuration must select singular wording using “I” and “I am,” or plural wording using “We” and “We are.”

The greeting may identify the invited party, but the form must load blank and must not reveal previously stored RSVP answers or confirmation destinations.

---

## CI-RSVP-012 — Individual Attendance Wording

**Content Item:**
Separate accepting or declining controls for each named invitee.

**Status:**
Not applicable

**Source or Owner:**
Decision 015; authoritative `Invitees List` spreadsheet

**Visibility:**
Personalized

**Needed Before Launch:**
No

**Notes:**
The spreadsheet-authoritative RSVP model records attendance at the invitation-party level through one coordinated Ceremony / Reception / decline control and four age-category attendance totals.

The form does not provide a separate attendance decision for each named adult or child. Named-invitee `Plus1` prompts authorize additional guests; they are not separate named-invitee attendance controls.

When Reception is selected, the form separately collects one attendee-detail pair for each person represented by the complete attendance total. Those attendee-name fields identify Reception attendees after the party-level attendance decision; they do not create person-by-person acceptance controls.
---

## CI-RSVP-013 — Authorized Named-Invitee Plus-One Attendance Wording

**Content Item:**
The conditional Yes/No question displayed for each `Plus1` allocation authorized by Column E of the authoritative `Invitees List` spreadsheet.

**Status:**
Ready

**Source or Owner:**
Decisions 015 and 023; authoritative `Invitees List` spreadsheet; invitation configuration

**Visibility:**
Personalized

**Needed Before Launch:**
Yes

**Approved Wording Pattern:**
`Will [Named Invitee] be accompanied by a +1?`

**Approved Answers:**

* Yes
* No

**Notes:**

* A party whose Column E value contains no `Plus1` allocation receives no Plus 1 question.
* Each authorized `Plus1` allocation produces exactly one separate Yes/No question.
* When a row contains multiple `Plus1` entries, the parenthesized name following each entry identifies the named invitee for that question.
* A single unparenthesized `Plus1` is associated with the primary named invitee for that row.
* Multiple authorized allocations are asked separately in succession; they are not replaced by one aggregate count control.
* The question does not ask for the additional guest's own name.
* The backend must reject an allocation response whose stable allocation identifier is not authorized by the validated invitation configuration.
* The private configuration may maintain the derived count of Column E `Plus1` allocations for validation or administration, but rendering and authorization are driven by the individual allocation records.
---

## CI-RSVP-014 — Standalone Additional-Guest Name Wording

**Content Item:**
A field asking for the additional guest's name as part of the named-invitee `Plus1` authorization question.

**Status:**
Not applicable

**Source or Owner:**
Decision 015; authoritative `Invitees List` spreadsheet

**Visibility:**
Personalized

**Needed Before Launch:**
No

**Notes:**
The authorized `Plus1` question asks only whether the named invitee will be accompanied by a +1. It does not request the additional guest's name at that step.

If Reception is selected and the additional guest is included in the complete attendance total, that person's name is entered later through the same Reception attendee-detail structure used for every Reception attendee.
---

## CI-RSVP-015 — Invited-Child Attendance Wording

**Content Item:**
Separate accepting or declining controls for named invited children.

**Status:**
Not applicable

**Source or Owner:**
Decision 015; authoritative `Invitees List` spreadsheet

**Visibility:**
Personalized

**Needed Before Launch:**
No

**Notes:**
Children are represented in the complete attendance count through the approved numerical dials for Children ages 3–17 and Children under 3. The form does not provide separate accepting or declining controls for named children.

When Reception is selected, every attending person represented by the complete attendance total—including a child where applicable—receives one Reception attendee-detail pair for attendee name and optional food-allergy / dietary-preference information.
---

## CI-RSVP-016 — Confirmation Method and Destination Wording

**Content Item:**
The labels, help text, and instructions for selecting a guest confirmation method and providing the applicable delivery destination.

**Status:**
Draft needed

**Source or Owner:**
Decisions 015 and 017; application

**Visibility:**
Personalized

**Needed Before Launch:**
Yes

**Required Content:**

* A confirmation-method choice between Email and Text Message.
* A confirmation-email field displayed and required when Email is selected.
* An SMS-capable mobile-number field displayed and required when Text Message is selected.
* Any required transactional text-message authorization.
* An explanation that the guest will receive the complete current RSVP through the selected method.

**Notes:**
These are operational contact and delivery fields rather than substantive RSVP questions. They do not appear on the alternative mail-in RSVP form.

The form must not display a previously stored email address, mobile number, or confirmation method.

---

## CI-RSVP-017 — Reception Attendee Name and Dietary/Allergy Wording

**Content Item:**
The repeating attendee-name and food-allergy / dietary-preference fields displayed only when Reception is selected.

**Status:**
Draft needed

**Source or Owner:**
Decision 015; authoritative `Invitees List` spreadsheet; buffet-brunch policy; couple

**Visibility:**
Personalized

**Needed Before Launch:**
Yes

**Required Content:**

For every attending party member represented by the complete attendance total while Reception is selected, display one pair of fields:

1. A required attendee-name field with a maximum of 100 characters.
2. An optional food-allergy / dietary-preference field with a maximum of 1000 characters.

**Notes:**

* The number of attendee-detail pairs must equal the complete attendance total derived from the four age-category numerical dials.
* This section is Reception-only. Ceremony-only attendance does not collect attendee names or dietary/allergy responses through this structure.
* Removing Reception from the complete resulting RSVP clears Reception attendee-detail data.
* A full decline clears Reception attendee-detail data.
* The final guest-facing field labels may be refined during functional-copy implementation, but the field purpose, repetition rule, applicability, and character limits are fixed.
* Do not add an entrée-selection field.
---

## CI-RSVP-018 — Accessibility-Assistance Question

**Content Item:**
An accessibility-assistance question within the RSVP form.

**Status:**
Not applicable

**Source or Owner:**
Decision 015

**Visibility:**
Personalized

**Needed Before Launch:**
No

**Notes:**
Accessibility questions are not part of the finalized online or mail-in RSVP question set. Verified venue accessibility information and an approved assistance method belong in public venue or FAQ content instead.

---

## CI-RSVP-019 — Accessibility-Details Prompt

**Content Item:**
An accessibility-details field within the RSVP form.

**Status:**
Not applicable

**Source or Owner:**
Decision 015

**Visibility:**
Personalized

**Needed Before Launch:**
No

**Notes:**
No accessibility-details field will appear in the RSVP form.

---

## CI-RSVP-020 — Lodging Question Wording

**Content Item:**
Questions concerning guest lodging plans within the RSVP form.

**Status:**
Not applicable

**Source or Owner:**
Decision 015

**Visibility:**
Personalized

**Needed Before Launch:**
No

**Notes:**
Hotel-block information belongs on the Travel page and will not be collected through the RSVP form.

---

## CI-RSVP-021 — Transportation-Assistance Wording

**Content Item:**
Questions concerning transportation plans or assistance within the RSVP form.

**Status:**
Not applicable

**Source or Owner:**
Decision 015

**Visibility:**
Personalized

**Needed Before Launch:**
No

**Notes:**
Transportation questions are excluded from the finalized online and mail-in RSVP question set.

---

## CI-RSVP-022 — Message-to-the-Couple Prompt

**Content Item:**
An optional message field within the RSVP form.

**Status:**
Not applicable

**Source or Owner:**
Decision 015

**Visibility:**
Personalized

**Needed Before Launch:**
No

**Notes:**
A message-to-the-couple question is not included in the finalized online or mail-in RSVP question set.

---

## CI-RSVP-023 — Submit-Button Wording

**Content Item:**
The text displayed on the RSVP submission button.

**Status:**
Draft needed

**Source or Owner:**
Couple; Decisions 016–017; application

**Visibility:**
Personalized

**Needed Before Launch:**
Yes

**Notes:**
The backend will determine whether the submission creates an initial RSVP or revises an existing one. The button wording must not imply that a blank form necessarily represents a new RSVP.

Possible neutral wording includes:

* “Submit RSVP”
* “Submit RSVP Information”

The surrounding instructions must explain the partial-revision behavior before submission.

---

## CI-RSVP-024 — Form Validation Messages

**Content Item:**
Field-level and form-level messages for missing, invalid, contradictory, or unauthorized answers.

**Status:**
Draft needed

**Source or Owner:**
Decisions 015–017 and 023; application

**Visibility:**
Personalized

**Needed Before Launch:**
Yes

**Notes:**
Prepare clear messages for:

* An invalid or missing confirmation method.
* A missing or malformed email address when Email is selected.
* A missing or malformed SMS-capable mobile number when Text Message is selected.
* Missing required transactional text authorization where applicable.
* An initial submission that does not establish Ceremony, Reception, both, or decline.
* A contradictory state that combines decline with Ceremony or Reception.
* A named-`Plus1` response submitted for an allocation not authorized by the invitation.
* A missing required Yes/No response for an authorized named-`Plus1` allocation when that response is required by the complete resulting state.
* A negative, fractional, malformed, or otherwise invalid numerical-dial value.
* An age-category total whose complete sum is below 1 while attending or exceeds the invitation's maximum attendance.
* A dial increase that would exceed the remaining authorized capacity.
* Missing Reception attendee-detail records when Reception is selected.
* A Reception attendee-detail count that does not exactly equal the complete attendance total.
* A blank required Reception attendee name.
* A Reception attendee name exceeding 100 characters.
* A dietary/allergy response exceeding 1000 characters.
* Reception attendee-detail data submitted when Reception is not selected.
* Invalid partial revisions after merging with the stored response and applying dependency clearing.
* Ambiguous attempts to clear an existing answer.
* Any other malformed, contradictory, or unauthorized field.

Validation messages must not expose previously stored answers, the invitation's private source row, unauthorized `Plus1` allocations, other invitation records, or private backend data.
---

## CI-RSVP-025 — RSVP Deadline, Countdown, and Revision Notice

**Content Item:**
The deadline, countdown, and revision-policy notice displayed on personalized forms.

**Status:**
Ready

**Source or Owner:**
Decisions 003, 016, and 018; RSVP requirements

**Visibility:**
Personalized

**Needed Before Launch:**
Yes

**Notes:**
Repeat the deadline and unlimited pre-deadline revision policy on every personalized form.

Before February 1, 2027, show the written deadline only. From February 1, 2027, at 12:00 a.m. EST until the deadline, show the live countdown. At and after the deadline, show the closed-RSVP state.

The notice must also explain that forms load blank and that omitted RSVP fields remain unchanged during a revision.

---

## CI-RSVP-026 — RSVP Assistance Instructions

**Content Item:**
Assistance information displayed within personalized RSVP forms.

**Status:**
Ready

**Source or Owner:**
Decision 006

**Visibility:**
Personalized

**Needed Before Launch:**
Yes

**Notes:**
Display the printed-response alternative and:

`RSVPhelp@loreweavercreations.com`

---

## CI-RSVP-027 — Event Attendance Question

**Content Item:**
The principal party-level attendance interface using the spreadsheet-authoritative coordinated three-checkbox presentation.

**Status:**
Ready

**Source or Owner:**
Decisions 015–016; authoritative `Invitees List` spreadsheet

**Visibility:**
Personalized

**Needed Before Launch:**
Yes

**Attendance Controls:**

* `Ceremony`
* `Reception`
* `Regretfully, I am unable to attend` or `Regretfully, we are unable to attend`, according to the source-mapped wording mode.

**Notes:**
Ceremony and Reception may be selected independently or together.

If Ceremony or Reception is selected, the decline checkbox becomes disabled and cannot be selected. If decline is selected, Ceremony and Reception become disabled and cannot be selected.

The backend enforces the same logical exclusivity regardless of browser state.

Selecting a complete resulting decline clears attendance-dependent substantive data, including authorized named-`Plus1` responses, age-category attendance totals, and Reception attendee details.

Removing Reception while remaining Ceremony-only clears Reception attendee details but does not by itself clear the remaining attending state.

During a partial revision, omission means leave the stored attendance state unchanged unless another submitted operation necessarily changes its applicability. Explicit attendance or decline input is required to change the stored state.
---

## CI-RSVP-028 — Attendance Totals by Age Category

**Content Item:**
The four coordinated numerical-dial controls represented by Columns K through N of the authoritative spreadsheet.

**Status:**
Ready

**Source or Owner:**
Decisions 015–016 and 023; authoritative `Invitees List` spreadsheet

**Visibility:**
Personalized

**Needed Before Launch:**
Yes

**Approved Prompt:**
“To better accommodate the seating & dietary needs of our guests, please list the total number of attendees in your party:”

**Categories:**

* Adults (ages 21+)
* Young Adults (ages 18–20)
* Children (ages 3–17)
* Children under 3

**Notes:**
Each category is presented as a numerical dial beginning at zero.

The invitation maximum is the `Total Potential Attendees` value from Column F. The current upper bound of each dial is the invitation maximum minus the values already allocated to the other three age-category dials. The interface must therefore prevent the visible controls from allocating more than the invitation's authorized capacity.

The backend independently validates that all four values are nonnegative whole numbers and that their sum is at least 1 for an attending RSVP and does not exceed `maximumAttendance`.

The calculated sum is the complete attendance total used to determine how many Reception attendee-detail pairs are required when Reception is selected.

During a revision, an omitted category ordinarily remains unchanged; an explicit zero replaces a previously positive category. If the complete attendance total changes while Reception remains selected, the Reception attendee-detail structure must be replaced so its record count matches the new complete total.
---

## CI-RSVP-029 — Invitation-Specific Singular and Plural Wording

**Content Item:**
The singular and plural variants used by the attendance and decline questions.

**Status:**
Ready

**Source or Owner:**
Decision 015; invitation configuration

**Visibility:**
Personalized

**Needed Before Launch:**
Yes

**Notes:**
Use “I” and “I am” for singular invitations and “We” and “We are” for plural invitations. The wording mode must be stored in the invitation configuration rather than inferred in the browser.

---

## CI-RSVP-030 — Invitation-Specific Online and Printed RSVP Structure Parity

**Content Item:**
The rule ensuring that the online RSVP implements the substantive structure and invitation-specific variation defined by the authoritative `Invitees List` spreadsheet and its notes.

**Status:**
Ready

**Source or Owner:**
Decisions 015–017 and 023; authoritative `Invitees List` spreadsheet

**Visibility:**
Private documentation

**Needed Before Launch:**
Yes

**Required Structure:**

* One coordinated Ceremony / Reception / decline attendance control.
* Explicit singular or plural wording from Column I.
* Zero or more named-invitee `Plus1` Yes/No questions derived only from Column E.
* Four coordinated age-category numerical dials bounded by Column F.
* Reception-only repeating attendee-name and dietary/allergy pairs whose count equals the complete attendance total.
* Separate operational confirmation fields required by the enabled delivery channel.

**Notes:**
All 57 active production invitations use this one reusable substantive form model. Invitation-specific variation comes from the private transformed row data; the project does not assign separate production question profiles.

Do not add separate named-person attendance controls, a standalone additional-guest-name question, accessibility details, lodging plans, transportation needs, a message to the couple, entrée selections, or another unapproved substantive question without a later recorded decision and corresponding source/document updates.
---

## CI-RSVP-031 — Blank-Form and Partial-Revision Instructions

**Content Item:**
Guest-facing instructions explaining the blank-form and field-level partial-revision model.

**Status:**
Draft needed

**Source or Owner:**
Decisions 015–016 and 023; couple; application

**Visibility:**
Public and personalized

**Needed Before Launch:**
Yes

**Required Content:**

* Every RSVP form opens blank, even when a response already exists.
* The website does not display the current stored RSVP or stored confirmation destination.
* A validated form renders only the invitation-authorized named-`Plus1` questions; a party with no Column E `Plus1` allocation receives none.
* An initial RSVP requires every value needed to create a valid complete response.
* A revision requires the guest to re-enter the confirmation method, the applicable email address or SMS-capable mobile number, and any required transactional text-message authorization.
* A revision otherwise requires only the applicable RSVP fields that need to change.
* Submitted RSVP fields replace their stored counterparts; submitted operational confirmation fields replace their stored counterparts.
* Explicit zero is a replacement value for a numerical dial.
* An explicit replace or clear action is required when the guest intends to remove or reset stored RSVP information and no controlling dependency clears it automatically.
* Omitted RSVP fields mean only “leave unchanged” and must never be interpreted as deletion.
* A resulting full decline clears named-`Plus1` responses, age-category totals, and Reception attendee details.
* Removing Reception clears Reception attendee details.
* If Reception becomes newly selected, Reception attendee details are required.
* If the complete attendance total changes while Reception remains selected, the full Reception attendee-detail list must be replaced so that its count equals the new total.
* The backend merges submitted changes, applies dependency clearing, validates authorization and the complete resulting RSVP, and saves only a valid final state.
* The next confirmation contains the complete merged RSVP rather than only the fields changed during the revision.
---

## CI-RSVP-032 — No-Change, Replace, Zero, and Clear Wording

**Content Item:**
Instructions and control labels that distinguish leaving an answer unchanged from explicitly replacing, setting to zero, or clearing it.

**Status:**
Draft needed

**Source or Owner:**
Decision 016; application

**Visibility:**
Personalized

**Needed Before Launch:**
Yes

**Notes:**
A blank omitted RSVP field means only “leave the stored answer unchanged.” The form must provide unambiguous ways to perform applicable changes such as:

* Changing from attending to declining or from declining to attending.
* Changing Ceremony and Reception selections.
* Replacing an authorized named-`Plus1` Yes/No response.
* Replacing a positive age-category dial value with explicit zero.
* Replacing the complete Reception attendee-detail list when Reception becomes newly applicable or its required record count changes.
* Explicitly clearing applicable stored information when it is not automatically cleared by attendance dependencies.

The wording must avoid revealing the previously stored value. The form must not offer a named-`Plus1` control for an allocation not authorized by the validated invitation.
---

## CI-RSVP-033 — Confirmation Method Selection Wording

**Content Item:**
The guest-facing choice between email and text-message confirmation.

**Status:**
Draft needed

**Source or Owner:**
Decision 017; application

**Visibility:**
Personalized

**Needed Before Launch:**
Yes

**Notes:**
Make clear that the selected channel will receive the complete current RSVP after every successful initial submission or revision.

Every initial submission and revision requires a newly entered confirmation method and the valid destination applicable to that method. Email requires a valid email address. Text Message requires a valid SMS-capable mobile number and any applicable transactional-message authorization.

A returning guest’s stored confirmation method, email address, mobile number, or authorization state must not be displayed or prefilled. The newly submitted operational confirmation values replace their stored counterparts after the complete RSVP is validated and saved.

---

## CI-RSVP-034 — Transactional Text-Message Authorization Wording

**Content Item:**
The disclosure and authorization associated with text-message RSVP confirmations.

**Status:**
Draft needed

**Source or Owner:**
Decisions 017 and 021; privacy requirements

**Visibility:**
Personalized

**Needed Before Launch:**
Yes

**Notes:**
Explain that the mobile number will be used for transactional RSVP-confirmation messages, that the complete RSVP may require multiple message segments, and that the number will not be used for promotional or unrelated messaging without separate authorization.

Include any legally or provider-required message-frequency, carrier-rate, consent, or opt-out language after the delivery provider is selected and verified.

---

## CI-RSVP-035 — Final-Month Countdown Copy

**Content Item:**
The labels and supporting text displayed with the live RSVP countdown.

**Status:**
Draft needed

**Source or Owner:**
Decision 018; application

**Visibility:**
Public and personalized

**Needed Before Launch:**
Yes

**Notes:**
The live countdown appears only from February 1, 2027, at 12:00 a.m. EST through March 1, 2027, at 11:59 p.m. EST.

Before that period, display the written deadline without a countdown. At and after the deadline, replace the countdown with the closed-RSVP message.

The countdown text must remain understandable without relying only on animation or continuously changing numbers.

---

# RSVP Confirmation and Delivery

## CI-CONFIRM-001 — On-Screen Success Heading

**Content Item:**
The principal heading displayed after a successful RSVP submission or revision.

**Status:**
Draft needed

**Source or Owner:**
Decision 010; couple; application

**Visibility:**
Personalized

**Needed Before Launch:**
Yes

**Notes:**
Clearly state that the RSVP was successfully recorded before describing confirmation-delivery status.

The heading must remain accurate whether the action created an initial response or stored a merged revision.

---

## CI-CONFIRM-002 — Complete On-Screen RSVP Summary Format

**Content Item:**
The on-screen summary of the complete current RSVP that was recorded.

**Status:**
Draft needed

**Source or Owner:**
Decisions 010, 015–017, and 023; application

**Visibility:**
Personalized

**Needed Before Launch:**
Yes

**Required Content:**

* Ceremony and Reception selections or decline status.
* Each authorized named-invitee `Plus1` response applicable to the invitation.
* Adults, Young Adults, Children ages 3–17, Children under 3, and the calculated overall attendance total for an attending response.
* When Reception is selected, the complete ordered set of Reception attendee names and each attendee's associated dietary/allergy response where supplied.
* Submission or revision timestamp.
* Whether the action was an initial submission or revision.
* Selected guest confirmation method.
* Guest confirmation-delivery attempt status.
* A limited administrative-email attempt status where appropriate.

**Notes:**
The summary must show the complete current merged RSVP, not only the fields supplied during a revision.

Do not invent a Plus 1 response for a party without an authorized allocation. Do not display Reception attendee details when Reception is not part of the complete current RSVP.

Guest and administrative delivery statuses must remain distinct. The administrative status must not expose the couple's private administrative email address. Do not expose spreadsheet row numbers, internal allocation identifiers, administrative notes, provider credentials, or unrelated party information.
---

## CI-CONFIRM-003 — Submission Timestamp Wording

**Content Item:**
Wording identifying the date and time of a successful submission or revision.

**Status:**
Draft needed

**Source or Owner:**
Application

**Visibility:**
Personalized

**Needed Before Launch:**
Yes

---

## CI-CONFIRM-004 — Guest Confirmation-Delivery Notice

**Content Item:**
The notice explaining the selected guest confirmation channel and whether delivery succeeded.

**Status:**
Draft needed

**Source or Owner:**
Decisions 010 and 017; application

**Visibility:**
Personalized

**Needed Before Launch:**
Yes

**Notes:**
Identify whether the guest confirmation was attempted by Email or Text Message and report its guest-safe status without displaying more of the destination than is necessary.

The guest-delivery attempt is separate from the protected administrative-email attempt. Failure of either channel must not prevent the other channel from being attempted after storage.

If guest delivery fails after the RSVP is stored, clearly state that the RSVP was still recorded. Do not instruct the guest to resubmit an RSVP that may already exist.

---

## CI-CONFIRM-005 — Revision Instructions

**Content Item:**
Instructions for submitting another RSVP revision.

**Status:**
Ready

**Source or Owner:**
Decisions 003 and 016; RSVP requirements

**Visibility:**
Personalized

**Needed Before Launch:**
Yes

**Notes:**
Explain that another revision may be submitted before Monday, March 1, 2027, at 11:59 p.m. EST by returning to the public RSVP entry page and manually entering the invitation code again.

Explain that the next form will open blank and that the guest must again enter the confirmation method, the applicable email address or SMS-capable mobile number, and any required transactional text-message authorization. State that the newly submitted operational confirmation values replace their stored counterparts.

Explain that the guest should submit only the RSVP fields that need to change, use an explicit replace or clear operation when stored information must be removed or reset, and understand that omitted RSVP fields remain unchanged. The next confirmation must contain the complete updated RSVP.

---

## CI-CONFIRM-006 — Confirmation Refresh Fallback

**Content Item:**
The message displayed when temporary on-screen confirmation information is unavailable after a browser refresh.

**Status:**
Draft needed

**Source or Owner:**
Decision 010; application

**Visibility:**
Personalized

**Needed Before Launch:**
Yes

**Notes:**
Explain safely that confirmation details are no longer available on the page and that the prior RSVP may already have been recorded.

Direct the guest to consult the selected email or text-message confirmation, return to the public manual-entry RSVP page where appropriate, or contact assistance. Do not instruct the guest to repeat a submission merely because the temporary confirmation state was lost.

---

## CI-CONFIRM-007 — Guest Confirmation Template

**Content Item:**
The email or text-message confirmation sent to the guest after every successful initial submission or revision.

**Status:**
Draft needed

**Source or Owner:**
Decisions 010 and 015–017; couple; application

**Visibility:**
Personalized

**Needed Before Launch:**
Yes

**Required Content:**

* Invited party or household name where appropriate.
* Whether the action was an initial submission or revision.
* Ceremony and Reception selections or decline status.
* Each authorized named-invitee `Plus1` Yes/No response applicable to the invitation.
* Adults, Young Adults, Children ages 3–17, Children under 3, and overall attendance total for an attending response.
* When Reception is selected, each Reception attendee name and the associated dietary/allergy response where supplied.
* Submission or revision timestamp.
* RSVP deadline.
* Blank-form and partial-revision instructions.
* RSVP assistance information.

**Notes:**
The confirmation must contain the complete current RSVP after a revision is merged and validated.

Email and text-message versions may differ in formatting but not in substantive content. They must not invent unauthorized `Plus1` questions or Reception-only data that is not applicable to the complete current RSVP.
---

## CI-CONFIRM-008 — Administrative Initial-Submission Confirmation Template

**Content Item:**
The protected private email sent to the couple after an initial RSVP submission.

**Status:**
Draft needed

**Source or Owner:**
Decisions 010, 015, and 017; couple; application

**Visibility:**
Private

**Needed Before Launch:**
Yes

**Required Content:**

* Invitation code or approved invited-party identifier.
* Invited party or household.
* Identification of the action as an initial submission.
* Ceremony and Reception selections or decline status.
* Every authorized named-invitee `Plus1` response applicable to the invitation.
* All four age-category totals and the calculated overall attendance total for an attending response.
* When Reception is selected, the complete Reception attendee-detail list, including attendee names and dietary/allergy responses where supplied.
* Guest confirmation method and destination.
* Submission version.
* Timestamp.

**Notes:**
This message contains the complete current RSVP and must be treated as protected private correspondence sent only to the approved administrative address.

It must not include unrelated invitation records, publicize internal backend details, or manufacture responses that are not authorized or applicable.
---

## CI-CONFIRM-009 — Administrative Revision Confirmation Template

**Content Item:**
The protected private email sent to the couple after an RSVP revision.

**Status:**
Draft needed

**Source or Owner:**
Decisions 010 and 015–017; couple; application

**Visibility:**
Private

**Needed Before Launch:**
Yes

**Required Content:**

* Invitation code or approved invited-party identifier.
* Invited party or household.
* Identification of the action as an RSVP revision.
* Complete current Ceremony and Reception selections or decline status.
* Complete current authorized named-invitee `Plus1` responses.
* Complete current age-category totals and calculated overall attendance total for an attending response.
* When Reception is selected, the complete current Reception attendee-detail list, including attendee names and dietary/allergy responses where supplied.
* Guest confirmation method and destination supplied for the revision.
* New submission version.
* Timestamp.

**Notes:**
The message must contain the complete merged RSVP, not only the fields changed during the revision. Treat it as protected private correspondence and do not expose unrelated party data.
---

## CI-CONFIRM-010 — Confirmation-Delivery Failure Warning

**Content Item:**
The guest-facing warning displayed when the RSVP was stored but guest email, guest text-message, or administrative-email delivery failed.

**Status:**
Draft needed

**Source or Owner:**
Decisions 010 and 017; application

**Visibility:**
Personalized

**Needed Before Launch:**
Yes

**Notes:**
Explain that the RSVP was successfully recorded and identify separately whether the guest confirmation, the protected administrative email, or both could not be completed where that information can be disclosed safely.

Guest and administrative delivery attempts proceed independently after storage. Failure or uncertainty in one channel must not prevent the other channel from being attempted and must not obscure the other channel’s status.

Direct the guest to assistance without encouraging a duplicate submission. Delivery failure must not imply that the stored RSVP was rolled back.

---

## CI-CONFIRM-011 — Manual Guest-Confirmation Resend Wording

**Content Item:**
The private template or procedure used to resend a failed guest confirmation by email or text message.

**Status:**
Draft needed

**Source or Owner:**
Decision 017; couple; application

**Visibility:**
Private

**Needed Before Launch:**
Yes

**Notes:**
The resend must reproduce the complete current RSVP through the approved guest channel without modifying the stored response, creating a duplicate, or incrementing the RSVP version.

The resend procedure must protect the guest’s email address or mobile number and record the new delivery attempt and result.

---

## CI-CONFIRM-012 — Guest Text-Message Confirmation Template

**Content Item:**
The text-message-specific format used to send the complete current RSVP to a guest.

**Status:**
Draft needed

**Source or Owner:**
Decision 017; couple; application

**Visibility:**
Personalized

**Needed Before Launch:**
Yes

**Notes:**
The text confirmation must include the same substantive RSVP information as the email confirmation. It may use multiple message segments where necessary.

The format must remain readable across segments, identify the sender clearly, include assistance information, and comply with the selected provider’s verified transactional-message requirements.

---

## CI-CONFIRM-013 — Complete Current RSVP Formatting Standard

**Content Item:**
The shared ordering and labels used whenever the complete current RSVP is displayed or delivered.

**Status:**
Draft needed

**Source or Owner:**
Decisions 010 and 016–017; application

**Visibility:**
Personalized and private

**Needed Before Launch:**
Yes

**Notes:**
Use one consistent substantive order for the on-screen summary, guest email, guest text message, and protected administrative email:

1. Attendance or decline state.
2. Authorized named-invitee `Plus1` responses, if any.
3. Age-category totals and calculated overall attendance for an attending RSVP.
4. Reception attendee-detail records when Reception is selected.
5. Timestamp and submission/revision context.
6. Applicable delivery information for the surface.

Channel-specific formatting may vary, but no confirmation may omit a substantive part of the complete current RSVP. A surface must not invent a Plus 1 response for an invitation without that allocation or display Reception attendee details when Reception is not selected.
---

## CI-CONFIRM-014 — Success-with-Delivery-Warning State

**Content Item:**
The on-screen state shown when the RSVP was stored successfully but one or more confirmation deliveries failed.

**Status:**
Draft needed

**Source or Owner:**
Decisions 010 and 017; application

**Visibility:**
Personalized

**Needed Before Launch:**
Yes

**Required Content:**

* Clear confirmation that the RSVP was recorded.
* The complete current guest-facing RSVP summary.
* The guest confirmation method and guest-delivery attempt status.
* A limited administrative-email attempt status without exposing the private administrative address.
* The failed or uncertain delivery channel where it can be identified safely.
* Assistance and resend instructions.
* A warning not to repeat the submission solely because delivery failed.

**Notes:**
Guest and administrative confirmation attempts remain independent after storage. A failure in one channel does not convert the other channel’s success into a failure and does not prevent the other attempt.

---

# Theme and Attire

## CI-THEME-001 — General Wedding-Aesthetic Description

**Content Item:**
A summary of the visual and thematic character of the wedding.

**Status:**
Draft needed

**Source or Owner:**
Couple; existing wedding material

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
The description should not require guests to be familiar with the thematic source material.

---

## CI-THEME-002 — Dress-Code Wording

**Content Item:**
The complete explanation of the “vintage garden formal” dress code.

**Status:**
Pending confirmation

**Source or Owner:**
Existing wedding material; couple

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Ensure the final wording corresponds with the printed invitations and existing attire materials.

---

## CI-THEME-003 — Guest Color Palette

**Content Item:**
The approved public color palette for guest attire.

**Status:**
Pending confirmation

**Source or Owner:**
Existing color palette

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
The palette is substantially prepared but requires final approval and preparation for web display.

---

## CI-THEME-004 — Outfit Examples and Suggestions

**Content Item:**
Examples of suitable guest outfits.

**Status:**
Pending confirmation

**Source or Owner:**
Existing wedding material; couple

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Confirm whether examples will be presented as text, illustrations, photographs, or links.

---

## CI-THEME-005 — Hat and Accessory Guidance

**Content Item:**
Guest-facing guidance concerning hats and accessories.

**Status:**
Pending confirmation

**Source or Owner:**
Existing wedding material; couple

**Visibility:**
Public

**Needed Before Launch:**
Yes

---

## CI-THEME-006 — Costume and Anachronism Guidance

**Content Item:**
Guidance concerning costumes, historical influences, and deliberate anachronism.

**Status:**
Pending confirmation

**Source or Owner:**
Existing wedding material; couple

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Clearly explain what is welcome without making themed dress mandatory.

---

## CI-THEME-007 — Gender-Neutral Attire Guidance

**Content Item:**
Attire guidance that does not impose gendered clothing requirements.

**Status:**
Pending confirmation

**Source or Owner:**
Existing wedding material; couple

**Visibility:**
Public

**Needed Before Launch:**
Yes

---

## CI-THEME-008 — Inspiration Images

**Content Item:**
Images used to illustrate the wedding aesthetic and guest attire.

**Status:**
Pending research

**Source or Owner:**
Couple; approved references

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Collect the final image set and conduct a publication-rights review before adding the images to public assets.

---

## CI-THEME-009 — Wedding-Party Design-Guide Downloads

**Content Item:**
Downloadable wedding-party design guides.

**Status:**
Pending confirmation

**Source or Owner:**
Existing design guides

**Visibility:**
Public or restricted public link

**Needed Before Launch:**
Recommended

**Notes:**
Confirm which guides are appropriate for public download and prepare the final files.

---

## CI-THEME-010 — Inspiration-Package Disclaimer

**Content Item:**
A disclaimer explaining that the supplied ideas and references are optional.

**Status:**
Ready

**Source or Owner:**
Existing wedding-guide disclaimer

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
State that suggested outfits, accessories, images, and concepts are inspirational rather than mandatory.

---

# Our Story

## CI-STORY-001 — Page Title and Introductory Text

**Content Item:**
The title and opening introduction for the Our Story page.

**Status:**
Draft needed

**Source or Owner:**
Couple

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Our Story must appear as its own public page and primary-navigation entry.

---

## CI-STORY-002 — Relationship Story

**Content Item:**
The complete relationship narrative intended for guests.

**Status:**
Draft needed

**Source or Owner:**
Couple

**Visibility:**
Public

**Needed Before Launch:**
Yes

---

## CI-STORY-003 — Engagement or Wedding-Planning Context

**Content Item:**
The portion of the story addressing the engagement or wedding-planning process.

**Status:**
Draft needed

**Source or Owner:**
Couple

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Include only details the couple is comfortable publishing publicly.

---

## CI-STORY-004 — Optional Photographs

**Content Item:**
Photographs accompanying the relationship story.

**Status:**
Pending confirmation

**Source or Owner:**
Couple

**Visibility:**
Public

**Needed Before Launch:**
Recommended

**Notes:**
Select photographs, confirm publication suitability, and prepare alternative text where necessary.

---

## CI-STORY-005 — RSVP or Home Call-to-Action

**Content Item:**
A link directing visitors from Our Story back to RSVP or Home.

**Status:**
Draft needed

**Source or Owner:**
Couple; application

**Visibility:**
Public

**Needed Before Launch:**
Yes

---

# Read, Listen, and Watch

## CI-MEDIA-001 — Page Introduction

**Content Item:**
Introductory wording for the Read, Listen, and Watch page.

**Status:**
Draft needed

**Source or Owner:**
Couple

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Explain why the book, audiobook, and film are relevant to the wedding theme.

---

## CI-MEDIA-002 — Book Title and Descriptive Information

**Content Item:**
The title, author, edition, and description of the thematic book.

**Status:**
Pending confirmation

**Source or Owner:**
Couple; authorized retailer or library sources

**Visibility:**
Public

**Needed Before Launch:**
Yes

---

## CI-MEDIA-003 — Book Purchase or Library Links

**Content Item:**
Lawful links for purchasing, borrowing, or locating the thematic book.

**Status:**
Pending research

**Source or Owner:**
Retailers; library services

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Provide at least one verified lawful option.

---

## CI-MEDIA-004 — Audiobook Title and Descriptive Information

**Content Item:**
The title, narrator, edition, and description of the audiobook.

**Status:**
Pending confirmation

**Source or Owner:**
Couple; authorized audiobook sources

**Visibility:**
Public

**Needed Before Launch:**
Yes

---

## CI-MEDIA-005 — Audiobook Purchase, Subscription, or Library Links

**Content Item:**
Lawful links for listening to, purchasing, subscribing to, or borrowing the audiobook.

**Status:**
Pending research

**Source or Owner:**
Audiobook retailers; subscription and library services

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Provide at least one verified lawful listening option.

---

## CI-MEDIA-006 — Film Title and Descriptive Information

**Content Item:**
The title, edition, and description of the thematic film.

**Status:**
Pending confirmation

**Source or Owner:**
Couple; authorized streaming or retailer sources

**Visibility:**
Public

**Needed Before Launch:**
Yes

---

## CI-MEDIA-007 — Film Streaming, Rental, Purchase, or Library Links

**Content Item:**
Lawful links for viewing, renting, purchasing, or borrowing the film.

**Status:**
Pending research

**Source or Owner:**
Streaming services; retailers; library services

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Provide at least one verified lawful viewing option.

---

## CI-MEDIA-008 — Availability and Regional-Access Disclaimer

**Content Item:**
A disclaimer concerning changing prices, services, and regional availability.

**Status:**
Draft needed

**Source or Owner:**
Couple; application

**Visibility:**
Public

**Needed Before Launch:**
Yes

---

## CI-MEDIA-009 — Copyrighted-Media Exclusion Notice

**Content Item:**
Private documentation explaining which source-media files are excluded from the website.

**Status:**
Ready

**Source or Owner:**
Project requirements

**Visibility:**
Private documentation

**Needed Before Launch:**
Yes

**Notes:**
The application must not host:

* An ebook.
* An audiobook.
* A full-length film.
* A public Nextcloud share containing those copyrighted works.

---

# Venues

## CI-VENUE-001 — Ceremony Venue Name

**Content Item:**
The public-facing ceremony venue under each prepared event format.

**Status:**
Pending confirmation

**Source or Owner:**
Decision 012; Warinanco Park approval

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Outdoor format: Warinanco Park, Roselle, NJ 07036.

Indoor or inclement-weather format: Sphinx Banquet and Catering Center.

---

## CI-VENUE-002 — Ceremony Address

**Content Item:**
The ceremony location displayed under the active event format.

**Status:**
Pending confirmation

**Source or Owner:**
Decision 012; venue sources

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Outdoor format: Warinanco Park, Roselle, NJ 07036. The exact guest entrance or street-address/map destination remains to be verified.

Indoor format: Sphinx Banquet and Catering Center, 121 E 2nd Avenue, Roselle, NJ 07203.

---

## CI-VENUE-003 — Ceremony Arrival and Start Times

**Content Item:**
The ceremony timing shown under each event format.

**Status:**
Pending confirmation

**Source or Owner:**
Decisions 012 and 022; couple; venue

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Outdoor format: ceremony from 10:30 a.m. to 12:00 p.m. at Warinanco Park.

Indoor format: the ceremony and reception occur within one combined 11:30 a.m.–4:30 p.m. event block at the Sphinx. Do not invent or publish a separate ceremony-ending or reception-starting time unless a later recorded decision establishes one.

A separate recommended guest-arrival time remains to be confirmed for each active format.

---

## CI-VENUE-004 — Ceremony Entrance Instructions

**Content Item:**
Instructions identifying the correct guest entrance.

**Status:**
Pending confirmation

**Source or Owner:**
Venue

**Visibility:**
Public

**Needed Before Launch:**
Yes

---

## CI-VENUE-005 — Reception Venue Name

**Content Item:**
The public-facing reception venue.

**Status:**
Ready

**Source or Owner:**
Decision 012; venue

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
The reception venue under both event formats is the Sphinx Banquet and Catering Center.

---

## CI-VENUE-006 — Reception Address

**Content Item:**
The complete street address of the reception venue.

**Status:**
Ready

**Source or Owner:**
Decision 012; venue

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Approved Address:**
Sphinx Banquet and Catering Center  
121 E 2nd Avenue  
Roselle, NJ 07203

---

## CI-VENUE-007 — Reception Start and Ending Times

**Content Item:**
The guest-facing reception timing under each event format.

**Status:**
Ready

**Source or Owner:**
Decisions 012 and 022

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Outdoor format: reception from 12:30 p.m. to 4:30 p.m. at the Sphinx.

Indoor format: ceremony and reception together run from 11:30 a.m. to 4:30 p.m. at the Sphinx. The public website must not assign a separate internal ceremony-ending or reception-starting time unless a later recorded decision approves one.

The reception timing record establishes the outer guest-facing event block. It does not create fixed public times for buffet service, dancing, toasts, speeches, cake service, photographs, or other internal reception activities.

---

## CI-VENUE-008 — Venue Parking Instructions

**Content Item:**
Parking information for the ceremony and reception venues.

**Status:**
Pending confirmation

**Source or Owner:**
Venue

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Confirm:

* Parking locations.
* Restrictions.
* Accessible spaces.
* Fees, if any.

---

## CI-VENUE-009 — Venue Accessibility Details

**Content Item:**
Verified accessibility information for the venues.

**Status:**
Pending research

**Source or Owner:**
Venue

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Verify:

* Step-free entrances.
* Elevators.
* Restrooms.
* Seating.
* Accessible parking.
* Other relevant accommodations.

---

## CI-VENUE-010 — Ceremony and Reception Map Links

**Content Item:**
External map links for the ceremony and reception.

**Status:**
Pending research

**Source or Owner:**
Venue; mapping service

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Verify that each link opens the correct guest entrance or parking destination.

---

## CI-VENUE-011 — Weather-Related Venue Instructions

**Content Item:**
Guest instructions explaining the inclement-weather fallback.

**Status:**
Draft needed

**Source or Owner:**
Decision 012; couple

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
If the outdoor format is approved and published, explain that inclement weather will move both ceremony and reception to the Sphinx Banquet and Catering Center under the 11:30 a.m.–4:30 p.m. indoor schedule.

---

## CI-VENUE-012 — Outdoor Event Configuration

**Content Item:**
The complete venue-and-schedule content version used if Warinanco Park approval is granted.

**Status:**
Pending confirmation

**Source or Owner:**
Decisions 012, 013, and 022; Warinanco Park approval

**Visibility:**
Public when active

**Needed Before Launch:**
Yes

**Notes:**
Ceremony: Warinanco Park, 10:30 a.m.–12:00 p.m.

Reception: Sphinx Banquet and Catering Center, 12:30 p.m.–4:30 p.m.

Reception copy may state broadly that buffet brunch, dancing, and other festivities will take place during the reception. Do not publish a formal cocktail-hour segment, a formal dinner segment, or exact times for flexible internal activities.

Include the Sphinx-only inclement-weather fallback.

---

## CI-VENUE-013 — Indoor or Inclement-Weather Event Configuration

**Content Item:**
The complete venue-and-schedule content version used if Warinanco Park is not approved or weather prevents the outdoor ceremony.

**Status:**
Ready

**Source or Owner:**
Decisions 012, 013, and 022

**Visibility:**
Public when active

**Needed Before Launch:**
Yes

**Notes:**
Both ceremony and reception take place at the Sphinx Banquet and Catering Center within the combined 11:30 a.m.–4:30 p.m. event block.

Do not create a separate public ceremony-ending or reception-starting time within that block unless a later recorded decision approves one.

Reception copy may state broadly that buffet brunch, dancing, and other festivities will take place during the reception. Do not publish a formal cocktail-hour segment, a formal dinner segment, or exact times for flexible internal activities.

---

## CI-VENUE-014 — Active Event-Configuration Selection

**Content Item:**
The configuration value selecting which prepared venue-and-schedule version is guest-facing.

**Status:**
Pending confirmation

**Source or Owner:**
Decisions 012–013; couple; application

**Visibility:**
Private configuration controlling public content

**Needed Before Launch:**
Yes

**Notes:**
Select the baseline active configuration after the Warinanco Park approval decision and before the printed invitations are mailed. Only one configuration may be publicly active at a time. If Configuration A is initially active but inclement weather later requires the Sphinx-only fallback, Configuration B must be capable of being activated promptly without rebuilding the application.

---

# Travel

## CI-TRAVEL-001 — Reserved Hotel-Block Property

**Content Item:**
The nearby hotel selected for the reserved accommodation block.

**Status:**
Pending research

**Source or Owner:**
Decision 014; couple; hotel sources

**Visibility:**
Public after confirmation

**Needed Before Launch:**
Yes

**Notes:**
Select a nearby hotel suitable for attendees traveling from a distance and verify the final name, address, reservation link or instructions, group-rate information, booking deadline, accessibility information, and proximity to the active venue configuration.

---

## CI-TRAVEL-002 — Hotel-Block Details

**Content Item:**
The reserved hotel-block stay dates and booking information.

**Status:**
Pending confirmation

**Source or Owner:**
Decision 014; selected hotel

**Visibility:**
Public after confirmation

**Needed Before Launch:**
Yes

**Ready Details:**

* Check-in: Friday, April 30, 2027.
* Check-out: Sunday, May 2, 2027.

**Pending Details:**

* Hotel name and address.
* Reservation link or booking instructions.
* Group-rate or room-block information.
* Block name or code, if applicable.
* Booking deadline.
* Accessibility information.

---

## CI-TRAVEL-003 — Hotel Booking Deadlines

**Content Item:**
The deadline and terms for reserving a room in the hotel block.

**Status:**
Pending confirmation

**Source or Owner:**
Selected hotel

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Confirm after the hotel block is contracted.

---

## CI-TRAVEL-004 — General Parking Information

**Content Item:**
General guest parking guidance.

**Status:**
Pending confirmation

**Source or Owner:**
Venue; couple

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Coordinate with the Venues page and avoid contradictory instructions.

---

## CI-TRAVEL-005 — Train Information

**Content Item:**
Relevant train stations, services, and routes.

**Status:**
Pending research

**Source or Owner:**
Public transportation sources

**Visibility:**
Public

**Needed Before Launch:**
Recommended

---

## CI-TRAVEL-006 — Airport Information

**Content Item:**
The airports most relevant to traveling guests.

**Status:**
Pending research

**Source or Owner:**
Public transportation and airport sources

**Visibility:**
Public

**Needed Before Launch:**
Recommended

**Notes:**
Do not imply guaranteed travel times.

---

## CI-TRAVEL-007 — Local Transportation Information

**Content Item:**
Relevant local bus, shuttle, taxi, or transportation options.

**Status:**
Pending research

**Source or Owner:**
Public transportation sources

**Visibility:**
Public

**Needed Before Launch:**
Recommended

---

## CI-TRAVEL-008 — Taxi and Ride-Sharing Guidance

**Content Item:**
General information about taxi and ride-sharing services.

**Status:**
Pending research

**Source or Owner:**
Public sources

**Visibility:**
Public

**Needed Before Launch:**
Recommended

**Notes:**
Do not guarantee service availability.

---

## CI-TRAVEL-009 — Driving Guidance

**Content Item:**
Driving information not adequately communicated through ordinary map links.

**Status:**
Pending research

**Source or Owner:**
Venue; mapping sources

**Visibility:**
Public

**Needed Before Launch:**
Recommended

---

## CI-TRAVEL-010 — Travel Accessibility Notes

**Content Item:**
Accessibility information concerning hotels and transportation.

**Status:**
Pending research

**Source or Owner:**
Hotels; transportation providers; venue

**Visibility:**
Public

**Needed Before Launch:**
Recommended

**Notes:**
Distinguish confirmed facts from general suggestions.

---

## CI-TRAVEL-011 — Day-of Travel Contact Information

**Content Item:**
Contact information for guest travel questions on the wedding day.

**Status:**
Pending confirmation

**Source or Owner:**
Couple

**Visibility:**
Public

**Needed Before Launch:**
Recommended

**Notes:**
Include only if the couple designates an appropriate contact who will be available during the event.

---

# Schedule

## CI-SCHEDULE-001 — Guest Arrival Time

**Content Item:**
The recommended time for guests to arrive under the active event format.

**Status:**
Pending confirmation

**Source or Owner:**
Couple; venue; Decision 012

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
The event start times are known, but the recommended arrival buffer remains to be finalized separately for the outdoor and indoor formats.

---

## CI-SCHEDULE-002 — Ceremony Time

**Content Item:**
The ceremony timing under each prepared event format.

**Status:**
Ready

**Source or Owner:**
Decisions 012 and 022

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Outdoor format: 10:30 a.m.–12:00 p.m. at Warinanco Park.

Indoor format: the ceremony occurs within the combined 11:30 a.m.–4:30 p.m. event at the Sphinx. The public website must not invent a separate ceremony-ending or reception-starting time unless a later recorded decision establishes one.

---

## CI-SCHEDULE-003 — Cocktail-Hour Timing

**Content Item:**
A separately scheduled guest-facing cocktail-hour time or segment.

**Status:**
Not applicable

**Source or Owner:**
Decision 022; couple

**Visibility:**
Public

**Needed Before Launch:**
No

**Notes:**
There will be no separately scheduled formal cocktail hour.

Do not create a cocktail-hour block, label, or implied transition in the public Schedule page.

General reception beverage information may be added elsewhere only after it is confirmed and must not be presented as a formal cocktail-hour segment.

---

## CI-SCHEDULE-004 — Buffet-Style Brunch or Reception-Meal Timing

**Content Item:**
The guest-facing description of buffet-style brunch service during the reception.

**Status:**
Ready

**Source or Owner:**
Decisions 015 and 022; couple; caterer; venue

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
The meal is a buffet-style brunch rather than a formal plated dinner.

Outdoor format: the buffet will remain available throughout the 12:30 p.m.–4:30 p.m. reception.

Indoor format: the buffet will remain available throughout the reception portion of the combined 11:30 a.m.–4:30 p.m. event. Because no separate internal ceremony-ending or reception-starting time is currently approved, do not publish an invented buffet-opening time for this format.

Do not create a separately scheduled formal dinner period, imply assigned entrée service, or publish a more restrictive buffet timeline unless a later recorded decision approves it.

---

## CI-SCHEDULE-005 — Reception Activities or Dancing

**Content Item:**
Guest-facing information about reception activities or dancing.

**Status:**
Ready

**Source or Owner:**
Decision 022; couple

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Dancing may occur at various intervals during the reception rather than within one fixed scheduled dancing period.

The public site may use broad wording such as:

“Buffet brunch, dancing, and other festivities will take place during the reception.”

Do not assign exact public times to dancing, first dances, toasts, speeches, cake service, photographs, or other reception activities unless a later recorded decision approves those times.

---

## CI-SCHEDULE-006 — Farewell or Closing Time

**Content Item:**
The final guest-facing event-ending time.

**Status:**
Ready

**Source or Owner:**
Decisions 012 and 022; venue

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Both approved event configurations conclude at 4:30 p.m.

Do not create a separately timed farewell activity unless one is later finalized through a recorded decision.

---

## CI-SCHEDULE-007 — Guest Transportation Deadlines

**Content Item:**
Any time by which guests must use or board arranged transportation.

**Status:**
Pending confirmation

**Source or Owner:**
Couple; transportation provider

**Visibility:**
Public

**Needed Before Launch:**
Recommended

**Notes:**
Include only if transportation arrangements create a specific guest deadline.

---

## CI-SCHEDULE-008 — Private Setup and Wedding-Party Schedule

**Content Item:**
Setup times and wedding-party-only instructions.

**Status:**
Not applicable

**Source or Owner:**
Couple; wedding party

**Visibility:**
Private and excluded from public site

**Needed Before Launch:**
No

**Notes:**
Do not publish this content on the public Schedule page.

---

## CI-SCHEDULE-009 — Active Schedule Version

**Content Item:**
The concise public schedule corresponding to the active venue configuration.

**Status:**
Pending confirmation

**Source or Owner:**
Decisions 012, 013, and 022; couple; application

**Visibility:**
Public when active

**Needed Before Launch:**
Yes

**Notes:**
Prepare both schedule versions.

Configuration A contains:

* Warinanco Park ceremony from 10:30 a.m. to 12:00 p.m.
* Sphinx reception from 12:30 p.m. to 4:30 p.m.

Configuration B contains:

* Ceremony and reception at the Sphinx within one combined 11:30 a.m. to 4:30 p.m. event block.

Only the active version may be guest-facing.

The public schedule must remain a concise guest-planning schedule rather than an internal run-of-show. It may state broadly that buffet brunch, dancing, and other festivities occur during the reception, but it must not publish a formal cocktail-hour segment, formal dinner segment, invented Configuration B transition time, or fixed times for flexible internal reception activities.

---

## CI-SCHEDULE-010 — Self-Service Mimosa Station

**Content Item:**
Guest-facing information concerning the possible self-service mimosa station.

**Status:**
Pending confirmation

**Source or Owner:**
Decision 022; couple; Sphinx Banquet and Catering Center

**Visibility:**
Public only if confirmed

**Needed Before Launch:**
Recommended

**Notes:**
The couple and banquet hall still need to confirm whether a self-service mimosa station will be offered.

Do not mention or imply that the station is available until the arrangement is finalized.

If confirmed, guest-facing copy may describe it broadly as available during the reception unless a later recorded decision establishes a more specific service window.

Do not present it as a formal cocktail hour.

---

# Frequently Asked Questions

## CI-FAQ-001 — Children Policy Wording

**Content Item:**
The FAQ answer concerning invited children and family attendance.

**Status:**
Pending confirmation

**Source or Owner:**
Existing draft; couple

**Visibility:**
Public

**Needed Before Launch:**
Yes

---

## CI-FAQ-002 — Additional-Guest Policy Wording

**Content Item:**
The FAQ answer concerning additional-guest eligibility.

**Status:**
Ready

**Source or Owner:**
Decisions 015 and 023; authoritative `Invitees List` spreadsheet

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Explain that Plus 1 eligibility is determined by the invitation.

Only an invitation whose private source row contains a `Plus1` allocation displays a Plus 1 question. Each authorized allocation is asked separately as a Yes/No question for the named invitee associated with that allocation. A party with no authorized `Plus1` allocation receives no Plus 1 question.

The authorization question does not ask for the additional guest's name. If the additional guest attends the Reception and is included in the party's complete attendance total, the guest's name is entered later through the ordinary Reception attendee-detail fields.

Guests should follow only the options displayed after their invitation code is validated and contact RSVP assistance rather than assuming an unlisted guest may be added.
---

## CI-FAQ-003 — Attire Summary

**Content Item:**
A concise FAQ summary of the dress code.

**Status:**
Pending confirmation

**Source or Owner:**
Theme and Attire content

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Link to the complete Theme and Attire page.

---

## CI-FAQ-004 — Hat Guidance

**Content Item:**
A concise FAQ answer concerning statement hats.

**Status:**
Pending confirmation

**Source or Owner:**
Theme and Attire content

**Visibility:**
Public

**Needed Before Launch:**
Yes

---

## CI-FAQ-005 — Costume and Anachronism Guidance

**Content Item:**
A concise FAQ answer concerning costumes and anachronistic attire.

**Status:**
Pending confirmation

**Source or Owner:**
Theme and Attire content

**Visibility:**
Public

**Needed Before Launch:**
Yes

---

## CI-FAQ-006 — Parking Answer

**Content Item:**
A concise FAQ answer concerning guest parking.

**Status:**
Pending confirmation

**Source or Owner:**
Venue; Travel content

**Visibility:**
Public

**Needed Before Launch:**
Yes

---

## CI-FAQ-007 — Buffet-Style Brunch and Dietary-Accommodation Answer

**Content Item:**
The FAQ answer concerning the meal, reception service, and dietary accommodations.

**Status:**
Ready

**Source or Owner:**
Decisions 015 and 022; buffet-brunch policy

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Explain that:

* The meal is a buffet-style brunch.
* There is no separately scheduled formal dinner service.
* In Configuration A, the buffet remains available throughout the 12:30 p.m.–4:30 p.m. reception.
* In Configuration B, the buffet remains available throughout the reception portion of the combined 11:30 a.m.–4:30 p.m. event, without publishing an invented internal transition time.
* Guests do not select an entrée.
* When Reception is selected in the RSVP, the form asks for each attending Reception guest's name and provides an associated field for that attendee's food allergies or dietary preferences.
---

## CI-FAQ-008 — Accessibility Answer

**Content Item:**
The FAQ answer concerning venue accessibility and accommodation requests.

**Status:**
Draft needed

**Source or Owner:**
Couple; venue

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Publish verified venue accessibility details. Do not state that accessibility information is collected through the RSVP form, because it is not part of the finalized question set. Provide an approved assistance contact for individual requests.

---

## CI-FAQ-009 — Photography Policy

**Content Item:**
The FAQ answer concerning guest photography and social sharing.

**Status:**
Draft needed

**Source or Owner:**
Couple; photographer

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Finalize any rules concerning:

* Guest photography.
* Social posting.
* Ceremony restrictions.
* Unplugged portions of the event.

---

## CI-FAQ-010 — Weather Answer

**Content Item:**
The FAQ answer explaining the outdoor-ceremony weather contingency.

**Status:**
Draft needed

**Source or Owner:**
Decision 012; couple

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
If the outdoor format is active, explain that inclement weather will move the entire event to the Sphinx Banquet and Catering Center from 11:30 a.m. to 4:30 p.m. If the indoor format is active from the outset, the answer should state that both ceremony and reception are indoors at the Sphinx.

---

## CI-FAQ-011 — RSVP Revision Answer

**Content Item:**
The FAQ answer explaining how guests may revise their RSVP.

**Status:**
Ready

**Source or Owner:**
Decisions 003 and 016; RSVP requirements

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Explain unlimited online revisions through March 1, 2027, at 11:59 p.m. EST.

A guest revises an RSVP by returning to the public RSVP page, manually re-entering the invitation code, completing the required confirmation-contact fields, and supplying only the RSVP information that needs to change. The blank form does not display stored answers; omitted RSVP fields remain unchanged, and the next confirmation contains the complete updated RSVP.

---

## CI-FAQ-012 — Invalid-Code Assistance Answer

**Content Item:**
The FAQ answer for guests whose invitation code is not accepted.

**Status:**
Ready

**Source or Owner:**
Decision 006; RSVP requirements

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Direct guests to recheck the printed code and contact:

`RSVPhelp@loreweavercreations.com`

---

## CI-FAQ-013 — Printed RSVP Alternative Answer

**Content Item:**
The FAQ answer explaining the printed response option.

**Status:**
Ready

**Source or Owner:**
Decision 006

**Visibility:**
Public

**Needed Before Launch:**
Yes

---

## CI-FAQ-014 — Ceremony and Reception Location Answer

**Content Item:**
The FAQ answer identifying the active ceremony and reception locations and confirmed outer time blocks.

**Status:**
Pending confirmation

**Source or Owner:**
Decisions 012, 013, and 022; active event-configuration setting

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Prepare both versions and publish only the active version selected before the printed invitations are mailed.

Configuration A identifies the Warinanco Park ceremony from 10:30 a.m. to 12:00 p.m. and the Sphinx reception from 12:30 p.m. to 4:30 p.m. Retain a clear explanation of the Sphinx-only inclement-weather fallback.

Configuration B identifies the entire ceremony-and-reception event at the Sphinx from 11:30 a.m. to 4:30 p.m. Do not invent a separate internal ceremony-ending or reception-starting time.

---

## CI-FAQ-015 — No-Registry Gift Policy

**Content Item:**
The FAQ statement explaining that there is no gift registry.

**Status:**
Ready

**Source or Owner:**
Decision 005; gift requirements

**Visibility:**
Public

**Needed Before Launch:**
Yes

---

## CI-FAQ-016 — Preferred Gift Categories

**Content Item:**
The FAQ description of preferred gift categories.

**Status:**
Ready

**Source or Owner:**
Couple; gift requirements

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Explain that guests who choose to give may consider:

* Cash.
* Cash-equivalent gifts.
* Checks.
* Savings bonds.
* Handcrafted gifts.
* Otherwise thoughtful gifts.

---

## CI-FAQ-017 — Nonpreferred Gift Categories

**Content Item:**
The FAQ explanation of gift categories that are not preferred.

**Status:**
Ready

**Source or Owner:**
Couple; gift requirements

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Explain that store-specific gift cards and investments made in the couple’s name are not preferred.

---

## CI-FAQ-018 — Gifts-Are-Optional Wording

**Content Item:**
Wording clarifying that gifts are optional.

**Status:**
Draft needed

**Source or Owner:**
Couple

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Do not imply that a gift is required or is a condition of attendance.

---

## CI-FAQ-019 — Thematic Book, Audiobook, and Film Answer

**Content Item:**
The FAQ answer concerning the thematic media resources.

**Status:**
Draft needed

**Source or Owner:**
Read, Listen, and Watch content

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Briefly explain the resources and link to the dedicated page.

---

## CI-FAQ-020 — Confirmation Method and Delivery Answer

**Content Item:**
The FAQ answer explaining guest email and text-message RSVP confirmations.

**Status:**
Draft needed

**Source or Owner:**
Decision 017; couple

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Explain that online guests select Email or Text Message, provide the applicable valid destination, and receive the complete current RSVP after each successful initial submission or revision.

Clarify that delivery failure does not erase an RSVP that was already stored and that assistance is available for a resend.

---

## CI-FAQ-021 — RSVP Privacy and Blank-Form Answer

**Content Item:**
The FAQ answer summarizing RSVP privacy, blank forms, and partial revisions.

**Status:**
Draft needed

**Source or Owner:**
Decisions 016 and 021; couple

**Visibility:**
Public

**Needed Before Launch:**
Recommended

**Notes:**
Explain that the form loads blank and does not display stored answers, that revision fields are merged privately with the current response, and that the complete Privacy page contains further information.

---

## CI-FAQ-022 — Reception Structure and Dancing Answer

**Content Item:**
The FAQ answer explaining the flexible reception format.

**Status:**
Ready

**Source or Owner:**
Decision 022; couple

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Explain that:

* There is no separately scheduled formal cocktail hour.
* There is no separately scheduled formal dinner.
* Buffet brunch, dancing, and other festivities will take place during the reception.
* Dancing may occur at various intervals rather than within one fixed published dancing period.
* The website intentionally does not publish exact times for flexible internal reception activities.

Do not imply that the absence of a detailed internal timeline means that the confirmed ceremony, reception, or event-ending times are uncertain.

---

## CI-FAQ-023 — Mimosa Station Answer

**Content Item:**
An FAQ answer concerning the possible self-service mimosa station.

**Status:**
Pending confirmation

**Source or Owner:**
Decision 022; couple; Sphinx Banquet and Catering Center

**Visibility:**
Public only if confirmed

**Needed Before Launch:**
Recommended

**Notes:**
Do not publish this question or answer unless the couple and banquet hall confirm the mimosa-station plan.

If confirmed, state the approved service arrangement without presenting it as a formal cocktail hour or assigning a more specific public time than the confirmed arrangement supports.

---

# Gallery

## CI-GALLERY-001 — Gallery Page Title

**Content Item:**
The public title of the Gallery page.

**Status:**
Ready

**Source or Owner:**
Decision 007

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
The Gallery remains visible in the primary navigation.

---

## CI-GALLERY-002 — Pre-Publication Coming Soon Message

**Content Item:**
The placeholder message displayed before wedding photographs and videos are published.

**Status:**
Draft needed

**Source or Owner:**
Couple

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Decision 007 finalizes the Coming Soon state, but the exact guest-facing wording still requires drafting.

---

## CI-GALLERY-003 — Pre-Wedding Gallery Image

**Content Item:**
An engagement, planning, or decorative image for the Coming Soon page.

**Status:**
Not applicable

**Source or Owner:**
Decision 007; Gallery requirements

**Visibility:**
Public

**Needed Before Launch:**
No

**Notes:**
No pre-wedding image is required.

The page may remain a text-only placeholder.

---

## CI-GALLERY-004 — Professional Wedding Photographs

**Content Item:**
Professional photographs taken at the wedding.

**Status:**
Not yet available

**Source or Owner:**
Photographer; couple

**Visibility:**
Post-wedding public

**Needed Before Launch:**
No

---

## CI-GALLERY-005 — Guest Photographs

**Content Item:**
Photographs supplied by wedding guests.

**Status:**
Not yet available

**Source or Owner:**
Guests; couple

**Visibility:**
Post-wedding public

**Needed Before Launch:**
No

**Notes:**
Establish submission, permission, review, and publication procedures before use.

---

## CI-GALLERY-006 — Wedding Videos

**Content Item:**
Professional or guest-recorded wedding videos.

**Status:**
Not yet available

**Source or Owner:**
Videographer; guests; couple

**Visibility:**
Post-wedding public

**Needed Before Launch:**
No

**Notes:**
Prepare streaming-friendly versions rather than loading original files directly as page previews.

---

## CI-GALLERY-007 — Album and Category Names

**Content Item:**
The names used to organize published wedding media.

**Status:**
Not yet available

**Source or Owner:**
Couple

**Visibility:**
Post-wedding public

**Needed Before Launch:**
No

---

## CI-GALLERY-008 — Optimized Preview Files

**Content Item:**
Thumbnails and optimized preview versions of photographs and videos.

**Status:**
Not yet available

**Source or Owner:**
Couple; application

**Visibility:**
Post-wedding public

**Needed Before Launch:**
No

---

## CI-GALLERY-009 — Original-Resolution Download Links

**Content Item:**
Links to approved original-resolution wedding media.

**Status:**
Not yet available

**Source or Owner:**
Couple; Nextcloud

**Visibility:**
Post-wedding public

**Needed Before Launch:**
No

**Notes:**
Keep downloads separate from ordinary page previews.

Expose only approved wedding-owned or appropriately licensed material.

---

## CI-GALLERY-010 — Gallery Privacy and Publication Review

**Content Item:**
The private review process used before media is published.

**Status:**
Not yet available

**Source or Owner:**
Couple

**Visibility:**
Private administrative process

**Needed Before Launch:**
No

---

# Site-Wide and Transitional Content

## CI-SITE-001 — Main Navigation Labels

**Content Item:**
The final labels used in the compact sticky primary navigation.

**Status:**
Pending confirmation

**Source or Owner:**
Decisions 004, 007, 019, and 021; route inventory

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Required Destinations:**

* Home
* RSVP
* Theme and Attire
* Our Story
* Read, Listen, and Watch
* Venues
* Travel
* Schedule
* FAQ
* Gallery
* Privacy

**Notes:**
The navigation remains available while guests scroll. The mobile menu must use a clearly labeled control and close after a destination is selected.

---

## CI-SITE-002 — Footer Content

**Content Item:**
The links and information displayed in the site footer.

**Status:**
Draft needed

**Source or Owner:**
Decisions 019–021; couple; application

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Include appropriate navigation, prominent RSVP access, RSVP assistance, the full Privacy page, and other approved site information.

Internal wedding-site links open in the same tab. External media, hotel, and map links open in a new tab with an accessible indication.

---

## CI-SITE-003 — Wedding-Specific Not-Found Message

**Content Item:**
The message displayed when a visitor opens an unknown wedding-site route.

**Status:**
Draft needed

**Source or Owner:**
Couple; application

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Provide links to:

* Home
* RSVP
* Venues
* FAQ

Do not expose server details.

---

## CI-SITE-004 — RSVP Service-Unavailable Message

**Content Item:**
The message displayed when the RSVP service is temporarily unavailable.

**Status:**
Draft needed

**Source or Owner:**
Application

**Visibility:**
Public and personalized

**Needed Before Launch:**
Yes

**Notes:**
Explain that the RSVP lookup or submission service is temporarily unavailable and provide the printed RSVP alternative, the approved assistance method, and a safe instruction to try again later where appropriate.

Do not claim that an RSVP was recorded unless the backend confirmed successful storage. When a request may have reached the backend but the browser cannot determine the outcome, use the Submission-Uncertain state instead of the service-unavailable message.

Do not display:

* Stack traces.
* Spreadsheet names.
* Google API errors.
* Server paths.
* Provider or credential details.

---

## CI-SITE-005 — RSVP Closed Message

**Content Item:**
The message displayed after the online RSVP deadline.

**Status:**
Draft needed

**Source or Owner:**
Couple; application

**Visibility:**
Public and personalized

**Needed Before Launch:**
Yes

**Notes:**
State:

* That online submissions and revisions are closed.
* The March 1, 2027 deadline.
* How guests may request a late change.

---

## CI-SITE-006 — Submission-Uncertain Message

**Content Item:**
The message displayed when the browser cannot confirm whether an RSVP was recorded.

**Status:**
Draft needed

**Source or Owner:**
Application

**Visibility:**
Personalized

**Needed Before Launch:**
Yes

**Notes:**
State that the website cannot yet confirm whether the RSVP was recorded and must not claim either success or failure without evidence.

Direct the guest to check the selected email or text-message destination and provide `RSVPhelp@loreweavercreations.com`. Do not encourage repeated immediate submissions. Any offered retry must reuse the original client submission identifier or otherwise preserve idempotency so that the retry cannot create a duplicate RSVP version.

---

## CI-SITE-007 — External-Link Treatment and Notice

**Content Item:**
Consistent behavior and accessible indication for links to outside websites.

**Status:**
Draft needed

**Source or Owner:**
Decision 020; application

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Links within `https://www.loreweavercreations.com/wedding/` open in the same tab.

External media, hotel, and map links open in a new tab, use appropriate security attributes, and include an accessible indication that a new tab will open.

---

## CI-SITE-008 — Public RSVP Privacy Notice

**Content Item:**
The concise public notice explaining the collection, processing, storage, and confirmation delivery of RSVP information.

**Status:**
Draft needed

**Source or Owner:**
Decision 021; couple; application

**Visibility:**
Public and personalized

**Needed Before Launch:**
Yes

**Notes:**
Display the notice on the RSVP entry page and personalized form. It must link to:

`/wedding/privacy`

The notice must summarize invitation-code use, private RSVP processing, operational email or mobile-number collection, complete confirmation delivery, and the availability of fuller information without making unsupported security guarantees.

---

## CI-SITE-009 — Page Titles and Browser Metadata

**Content Item:**
The browser title and description associated with each page.

**Status:**
Draft needed

**Source or Owner:**
Decisions 009 and 021; couple; application

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Prepare a unique title and appropriate description for every public page, including the Privacy page.

RSVP entry and confirmation metadata must not expose invitation codes, guest identities, confirmation destinations, or stored RSVP information. No invitation-code-bearing public route will be implemented.

---

## CI-SITE-010 — Event-Configuration Status and Contingency Copy

**Content Item:**
Centralized public wording identifying the active event configuration and any applicable weather fallback.

**Status:**
Draft needed

**Source or Owner:**
Decisions 012–013; couple; application

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
This content must remain consistent across Home, Venues, Travel, Schedule, and FAQ. It must never present both configurations as simultaneously active. If Configuration A is active, the public content must explain the inclement-weather fallback to Configuration B.

---

## CI-SITE-011 — Privacy Page Title and Introductory Copy

**Content Item:**
The page title, introductory paragraph, and section headings for the full public RSVP Privacy page.

**Status:**
Draft needed

**Source or Owner:**
Decision 021; couple

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
The page is located at:

`/wedding/privacy`

Use plain language and organize the notice so that guests with varying technical experience can understand the site’s RSVP practices.

---

## CI-SITE-012 — Sticky Navigation and Mobile Menu Wording

**Content Item:**
The label and accessible instructions associated with the compact sticky navigation and mobile menu control.

**Status:**
Draft needed

**Source or Owner:**
Decision 019; application

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Use a clearly understandable mobile control such as “Menu,” with an accessible expanded or collapsed state. Do not rely on an unlabeled icon alone.

Navigation copy and spacing must remain compact enough not to obscure page headings, form fields, validation messages, or focused controls.

---

# RSVP Privacy

## CI-PRIVACY-001 — Information Collection and Purpose Explanation

**Content Item:**
The full Privacy-page explanation of what RSVP and operational contact information is collected and why.

**Status:**
Draft needed

**Source or Owner:**
Decision 021; privacy requirements; couple

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Required Topics:**

* Invitation-code use.
* Ceremony, Reception, or decline information.
* Authorized named-invitee `Plus1` Yes/No responses where the invitation contains one or more Column E allocations.
* Adults, Young Adults, Children ages 3–17, Children under 3, and the calculated overall attendance total.
* Reception attendee names when Reception is selected.
* Per-attendee food-allergy / dietary-preference information where supplied for Reception attendees.
* Confirmation method.
* Email address or SMS-capable mobile number.
* Transactional text-message authorization where applicable.
* The fact that invitation-specific `Plus1` questions are shown only when authorized by the private invitation configuration.
* The fact that Reception attendee-detail information is collected only when Reception is selected.

The explanation must distinguish substantive RSVP information from operational confirmation-contact information and must not imply that the public browser can retrieve previously stored answers.
---

## CI-PRIVACY-002 — Blank Forms and Partial-Revisions Explanation

**Content Item:**
The full Privacy-page explanation of blank forms and backend merging of revisions.

**Status:**
Draft needed

**Source or Owner:**
Decisions 016 and 021; privacy requirements

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Explain that every form loads blank and stored RSVP answers and contact destinations are not displayed. For a revision, the guest re-enters the confirmation method, applicable destination, and any required transactional SMS authorization; these submitted operational values replace their stored counterparts.

Explain that submitted RSVP changes, including explicit replace or clear operations, are merged privately with the current response; omitted RSVP fields remain unchanged and do not delete stored information; and the complete merged response is validated before being saved.

---

## CI-PRIVACY-003 — Confirmation Delivery and SMS-Use Explanation

**Content Item:**
The full Privacy-page explanation of administrative email, guest email, and guest text-message confirmations.

**Status:**
Draft needed

**Source or Owner:**
Decisions 017 and 021; privacy requirements

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Explain that, after successful storage, the couple receives the complete current RSVP by protected administrative email and the guest receives it through the selected email or text-message channel. The two delivery attempts are independent; a failure in one channel does not prevent the other attempt and does not undo the stored RSVP.

State that mobile numbers are used for the approved transactional RSVP-confirmation purpose and are not used for promotional or unrelated messaging without separate authorization.

---

## CI-PRIVACY-004 — Access, Storage, and Retention Explanation

**Content Item:**
The full Privacy-page explanation of where RSVP information is stored, who may access it, and how long it is expected to be retained.

**Status:**
Draft needed

**Source or Owner:**
Decision 021; Decision 024; couple; private administrative policy

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Describe access accurately and do not imply broader access than the couple, explicitly authorized administrators, and required backend services.

The public explanation must reflect the finalized retention standard:

* Active RSVP-operational data is retired no later than July 30, 2027, unless the minimum information is temporarily required for a concrete documented administrative need.
* Any such exception must remain restricted and be deleted when the documented need ends.
* Protected backups containing retired RSVP-operational data expire no later than August 29, 2027 through backup rotation.
* Non-identifying aggregate information may be retained only when it cannot reasonably reconstruct an invited party's RSVP.
* The separately retained private `Invitees List` may remain as a personal planning/address record, but the active public RSVP application must not remain dependent on retired response history.
---

## CI-PRIVACY-005 — Assistance, Correction, and Security-Limitation Explanation

**Content Item:**
The full Privacy-page instructions for requesting assistance or correction and the statement concerning security limitations.

**Status:**
Draft needed

**Source or Owner:**
Decision 021; couple

**Visibility:**
Public

**Needed Before Launch:**
Yes

**Notes:**
Direct guests to the approved RSVP assistance method and explain that reasonable safeguards are used without promising absolute security.

---

# Private Administrative Content

## CI-ADMIN-001 — Authoritative Production Invitation-Code List

**Content Item:**
The final private list of active production invitation codes and primary invited-party account records.

**Status:**
Ready

**Source or Owner:**
Couple-supplied `Invitees List` spreadsheet

**Visibility:**
Private

**Needed Before Launch:**
Yes

**Notes:**
The authoritative private source contains 57 active assigned production invitation records.

Current verification establishes that all 57 supplied codes normalize successfully, all 57 canonical six-character keys are unique, no normalization collision exists, every code maps to one populated invited-party record, and the supplied display values already use the approved `XXX-XXX` format.

The active production source contains 35 singular `I` wording records and 22 plural `we` wording records. No active production placeholder record is required.

The spreadsheet, real codes, guest names, Column E `Plus1` mappings, and code-to-party associations must remain in approved private project storage and outside public documentation, frontend source files, public repositories, analytics, metadata, ordinary logs, and unnecessary browser responses.
---

## CI-ADMIN-002 — Invitation Party Configuration Records

**Content Item:**
The private backend configuration generated for each production invitation record.

**Status:**
Pending confirmation

**Source or Owner:**
Decision 023; couple-supplied `Invitees List` spreadsheet; application

**Visibility:**
Private

**Needed Before Launch:**
Yes

**Required Information:**

* Canonical six-character `inviteCode` and approved `XXX-XXX` display value.
* Reviewed party display name or greeting, using `Attendee Names Clarification` where populated and otherwise the source name fields.
* Explicit singular or plural `wordingMode` from Column I.
* `maximumAttendance` from Column F.
* Zero or more `additionalGuestAllocations`, with one stable private allocation record per Column E `Plus1` and the named invitee used in that question label.
* The derived Column E `Plus1` allocation count where useful for private validation or administration; this count must not replace the individual allocation records or produce an aggregate guest-count control.
* Active or inactive status.
* Production or development environment classification.

**Notes:**
Each of the 57 active source rows must produce one validated private production configuration record.

The current source contains 35 singular-wording records and 22 plural-wording records. Twenty-three records authorize at least one additional guest, representing 26 total `Plus1` allocations; two invitations authorize more than one allocation. The supplied maximum-attendance values total 115.

All 57 production invitations use the same spreadsheet-authoritative substantive form structure. No production question-profile assignment is required.

Named `Plus1` allocation data is retained privately because it authorizes and labels the applicable guest-facing Yes/No questions. The configuration records remain pending until the repeatable private transformation has been generated, reviewed, and accepted.
---

## CI-ADMIN-003 — Disabled Placeholder or Test Records

**Content Item:**
Development-only invitation records, synthetic test codes, and any optional future inactive reserve records.

**Status:**
Pending confirmation

**Source or Owner:**
Couple; application

**Visibility:**
Private

**Needed Before Launch:**
Yes

**Notes:**
The current authoritative production source requires no active 58th placeholder code.

Development/test fixtures must remain separate from production records and must never become active production invitations. Any future reserve or placeholder record must be explicitly inactive unless the couple deliberately assigns and activates it through the private production process.
---

## CI-ADMIN-004 — Administrative Recipient Email Address

**Content Item:**
The protected private email address that receives complete RSVP confirmations after every initial submission and revision.

**Status:**
Final

**Source or Owner:**
Couple; Decision 017

**Visibility:**
Private

**Needed Before Launch:**
Yes

**Notes:**
The couple has confirmed the administrative recipient. The actual address is intentionally omitted from this public portfolio artifact and must be maintained only in protected backend configuration. It must not be a public or broadly shared distribution list because each message contains the complete current RSVP, including Reception attendee dietary/allergy information and confirmation-contact information.

---

## CI-ADMIN-005 — Guest Confirmation Sender Identities and Reply Behavior

**Content Item:**
The public sender identity, reply-to behavior, and assistance wording for guest email and text-message confirmations.

**Status:**
Email finalized; Text Message pending production SMS gate

**Source or Owner:**
Couple; Decision 017; delivery providers

**Visibility:**
Private configuration and guest confirmations

**Needed Before Launch:**
Yes

**Notes:**
Production email uses Resend with sender name `Norstein-Dashiell Wedding`, sender address `confirm@rsvp.loreweavercreations.com`, and Reply-To / assistance address `RSVPhelp@loreweavercreations.com`.

The text-message sending identity remains intentionally unresolved while Text Message confirmation is disabled. It must not be invented before the separate SMS-provider disclosure and production-enablement gate is satisfied.

---

## CI-ADMIN-006 — Confirmation-Delivery Status Labels

**Content Item:**
The standardized values used to record guest-email, guest-text, and administrative-email delivery results.

**Status:**
Draft needed

**Source or Owner:**
Decision 017; application

**Visibility:**
Private

**Needed Before Launch:**
Yes

**Possible Values:**

* Pending
* Sent
* Delivered, where provider-confirmed delivery is available
* Failed
* Resend pending
* Resent

**Notes:**
Track guest-email, guest-text, and administrative-email status separately by channel and attempt. Guest and administrative attempts proceed independently after storage, so one failed or uncertain delivery must not prevent the other attempt, obscure successful storage, or overwrite another channel’s result.

---

## CI-ADMIN-007 — Manual Guest-Confirmation Resend Procedure

**Content Item:**
Instructions for resending a failed guest confirmation through the applicable email or text-message channel.

**Status:**
Draft needed

**Source or Owner:**
Decision 017; couple; application

**Visibility:**
Private

**Needed Before Launch:**
Yes

**Notes:**
The process must not resubmit, modify, duplicate, or increment the RSVP. It must resend the complete current RSVP to a verified destination and record the new delivery attempt and result.

---

## CI-ADMIN-008 — RSVP Backup Procedure

**Content Item:**
The process used to back up private RSVP records.

**Status:**
Draft needed

**Source or Owner:**
Couple; application

**Visibility:**
Private

**Needed Before Launch:**
Yes

**Notes:**
Document how the private workbook or exported response data will be backed up and restored.

---

## CI-ADMIN-009 — Post-Deadline RSVP Handling Procedure

**Content Item:**
The process used to record late changes received after the online deadline.

**Status:**
Draft needed

**Source or Owner:**
Couple

**Visibility:**
Private

**Needed Before Launch:**
Yes

**Notes:**
Define how late changes received through `RSVPhelp@loreweavercreations.com` or another approved method will be recorded.

---

## CI-ADMIN-010 — RSVP System-Retirement Procedure

**Content Item:**
The process used to retire the personalized RSVP system and RSVP-operational data after the response period and wedding.

**Status:**
Draft needed

**Source or Owner:**
Decision 024; couple; application

**Visibility:**
Private

**Needed Before Launch:**
No

**Notes:**
Document how personalized submissions are disabled and how RSVP-operational data is retired in accordance with the finalized retention standard.

Active current responses, superseded versions, attendee names collected for Reception, dietary/allergy text, guest confirmation destinations, SMS authorization, client submission identifiers, delivery-attempt history, transaction timestamps retained only as RSVP history, and active code-to-response mappings must be deleted or irreversibly de-identified no later than July 30, 2027 unless a minimum record is temporarily required for a concrete documented administrative need.

Protected backups containing retired RSVP-operational data must expire no later than August 29, 2027 through backup rotation. The separately maintained private `Invitees List` may remain for personal planning/address purposes, but it must not keep the retired public RSVP application dependent on historical RSVP responses.
---

## CI-ADMIN-011 — Active Event-Configuration Setting

**Content Item:**
The private setting selecting the guest-facing event configuration.

**Status:**
Draft needed

**Source or Owner:**
Decisions 012–013; application

**Visibility:**
Private

**Needed Before Launch:**
Yes

**Notes:**
The setting must update venue, schedule, timing, weather, map, Travel-page, and related FAQ content consistently. Only one configuration may be active publicly. The setting must also support a prompt switch from Configuration A to Configuration B if inclement weather requires the fallback.

---

## CI-ADMIN-012 — Invitation Mailing Readiness Checkpoint

**Content Item:**
The private checklist completed before print invitations are mailed.

**Status:**
Draft needed

**Source or Owner:**
Decisions 011, 015–021, 023, and 024; couple

**Visibility:**
Private

**Needed Before Launch:**
Yes

**Notes:**
Confirm that the active event configuration, public pages, manual-entry RSVP flow, blank forms, partial-revision merge behavior, email and text-message confirmations, protected administrative email, countdown states, sticky navigation, link behavior, privacy notices, and invitation-code records are ready before mailing, which will occur no earlier than October 1, 2026.

The checkpoint must also confirm that:

* All 57 authoritative active source rows have produced reviewed private configuration records.
* Every configuration uses the correct party heading, wording mode, maximum attendance, and exact Column E named-`Plus1` allocation mapping.
* A source row with no `Plus1` receives no Plus 1 question.
* Each authorized `Plus1` allocation produces its own named-invitee Yes/No question; the two rows with multiple allocations produce separate questions rather than an aggregate count control.
* All attending forms use the four coordinated age-category numerical dials and enforce the invitation maximum.
* Reception selection produces exactly one attendee-detail pair per person in the complete attendance total, with the approved 100-character attendee-name and 1000-character dietary/allergy limits.
* Ceremony-only attendance does not collect Reception attendee details.
* No real production code, guest detail, or private allocation mapping appears in public source, public documentation, browser metadata, analytics, or ordinary logs.
* Development/test records are separated from production and no placeholder is required merely to reach a historical count of 58.
---

## CI-ADMIN-013 — Hotel-Block Record

**Content Item:**
The private record of the selected hotel block.

**Status:**
Pending research

**Source or Owner:**
Decision 014; couple

**Visibility:**
Private until published

**Needed Before Launch:**
Yes

**Required Information:**

* Hotel name and address.
* Check-in: Friday, April 30, 2027.
* Check-out: Sunday, May 2, 2027.
* Reservation link or booking instructions.
* Group-rate or room-block information.
* Block name or code, if applicable.
* Booking deadline.
* Accessibility information.

---

## CI-ADMIN-014 — Text-Message Provider and Sending Configuration

**Content Item:**
The private provider, sending number or identity, credentials, and verified transactional-message requirements used for guest text confirmations.

**Status:**
Pending research

**Source or Owner:**
Couple; application

**Visibility:**
Private

**Needed Before Launch:**
Yes

**Notes:**
Confirm provider availability, sending identity, segmentation behavior, delivery-status support, required consent language, carrier-rate disclosures, opt-out handling, credential storage, and production costs before finalizing text-message content or implementation.

---

## CI-ADMIN-015 — Confirmation Method and Destination Data Fields

**Content Item:**
The private administrative fields storing the current guest confirmation method and applicable delivery destination.

**Status:**
Pending confirmation

**Source or Owner:**
Decision 017; application

**Visibility:**
Private

**Needed Before Launch:**
Yes

**Required Information:**

* Selected confirmation method.
* Current confirmation email address where applicable.
* Current SMS-capable mobile number where applicable.
* Required text-message authorization record where applicable.
* Per-channel delivery attempt and status information.

**Notes:**
These fields must be protected as private RSVP contact information and must not be returned to the browser on later blank-form loads.

Every initial submission and revision requires the guest to submit the confirmation method, the destination applicable to that method, and any required transactional text-message authorization. On a successful revision, the newly submitted operational values replace the stored confirmation method, destination, and applicable authorization state.

---

## CI-ADMIN-016 — Protected Complete Administrative Confirmation Procedure

**Content Item:**
The private safeguards and handling instructions for administrative emails containing complete RSVP information.

**Status:**
Draft needed

**Source or Owner:**
Decision 017; privacy requirements; couple

**Visibility:**
Private

**Needed Before Launch:**
Yes

**Notes:**
Document the approved recipient, mailbox-access restrictions, sender configuration, content boundaries, delivery-status recording, and handling of attendee names, per-attendee dietary/allergy information, and guest confirmation-contact information.

The email must contain only the applicable invitation's complete current RSVP and no unrelated records or backend secrets. The administrative-email attempt occurs independently of the guest email or text-message attempt; failure of either delivery must not prevent the other attempt after storage.
---

## CI-ADMIN-017 — Partial-Revision Merge and Audit Procedure

**Content Item:**
The private procedure and administrative fields used to merge a partial revision, validate the complete result, and retain appropriate version history.

**Status:**
Draft needed

**Source or Owner:**
Decision 016; application

**Visibility:**
Private

**Needed Before Launch:**
Yes

**Notes:**
Document how submitted RSVP fields replace stored values, omitted RSVP fields remain unchanged, and explicit replace, clear, and zero-value operations are represented without revealing stored answers. Document how newly submitted confirmation method, destination, and applicable SMS-authorization fields replace their stored counterparts.

The procedure must specifically document:

* Authorization of named-`Plus1` responses against the invitation's private allocation records.
* Coordinated age-category total validation against `maximumAttendance`.
* Automatic clearing of attendance-dependent data on a full decline.
* Automatic clearing of Reception attendee details when Reception is removed.
* Requirement for Reception attendee details when Reception becomes newly applicable.
* Complete replacement of the Reception attendee-detail list when its required record count changes while Reception remains selected.
* Exact cardinality validation between Reception attendee-detail records and the complete attendance total.
* Attendee-name and dietary/allergy character limits.
* Contradiction rejection, complete merged-state validation, idempotent duplicate protection, current-version designation, timestamps and version history, and confirmation generation from the complete merged state.
---

## CI-ADMIN-018 — Invitees List Transformation and Validation Procedure

**Content Item:**
The repeatable private procedure or configuration-generation process that transforms the authoritative `Invitees List` spreadsheet into production invitation-party configuration records.

**Status:**
Draft needed

**Source or Owner:**
Decision 023; production invitation requirements; application

**Visibility:**
Private

**Needed Before Launch:**
Yes

**Required Mapping:**

* Guest ID to canonical `inviteCode` and approved display code.
* `Attendee Names Clarification` to `partyDisplayName` when populated; otherwise the source First Name(s) and Last Name(s) fields to reviewed party-display and greeting content.
* `I/We wording` to explicit `wordingMode`.
* `Total Potential Attendees (Including Plus1 and Kids)` to `maximumAttendance`.
* Column E to zero or more named `additionalGuestAllocations`, one record per `Plus1` occurrence.
* Column E to a derived allocation count where useful for private validation or administration.
* Protected deployment configuration to `active` and `environment`.

**Required Validation:**

* Exactly one production configuration record per populated active source invitation row.
* Exactly 57 active production configuration records for the current authoritative source.
* Successful normalization of every production code.
* No duplicate canonical key or normalization collision.
* No missing required source field.
* Only supported singular/plural wording modes.
* Positive whole-number maximum-attendance values.
* Correct parsing of every Column E `Plus1` allocation.
* Correct association of parenthesized names with each allocation on rows containing multiple `Plus1` entries.
* A single unparenthesized `Plus1` maps to the row's primary named invitee.
* Allocation counts compatible with the invitation's maximum attendance.
* No production question-profile assignment requirement.
* Explicit production-versus-development classification.
* Failure before deployment when any source record is malformed, incomplete, duplicate, contradictory, or ambiguous.

**Current Source Audit:**

* 57 active invitation records.
* 57 unique canonical invitation-code keys.
* 35 singular `I` wording records and 22 plural `we` wording records.
* 23 records containing at least one `Plus1` allocation.
* 26 total `Plus1` allocations.
* Two records containing more than one allocation.
* Combined maximum-attendance capacity of 115.
* No required active production placeholder.

**Notes:**
The process must be repeatable so that a controlled update to the private source can regenerate or update configuration records without copying production data into the public React application.

The procedure, generated production configuration, real codes, guest identities, and source-to-guest/allocation mappings remain private and outside public source control and frontend build output.
---

# Content Excluded from the Website

## CI-EXCLUDE-001 — Hosted Ebook or Ebook Download

**Excluded Content:**
A hosted copy or downloadable copy of the thematic ebook.

**Status:**
Not applicable

**Reason:**
The website will provide lawful external reading and purchase links only.

---

## CI-EXCLUDE-002 — Hosted Audiobook or Audiobook Download

**Excluded Content:**
A hosted copy or downloadable copy of the thematic audiobook.

**Status:**
Not applicable

**Reason:**
The website will provide lawful external listening, purchase, subscription, or library links only.

---

## CI-EXCLUDE-003 — Embedded or Hosted Full-Length Film

**Excluded Content:**
A hosted or embedded copy of the complete thematic film.

**Status:**
Not applicable

**Reason:**
The website will provide lawful external streaming, rental, purchase, or library links only.

---

## CI-EXCLUDE-004 — Public Nextcloud Shares Containing Copyrighted Source Media

**Excluded Content:**
Guest-accessible Nextcloud shares containing the complete thematic book, audiobook, or film.

**Status:**
Not applicable

**Reason:**
The copyrighted source works must not be distributed through the wedding website.

---

## CI-EXCLUDE-005 — Gift Registry Page or Registry Links

**Excluded Content:**
A wedding registry page or links to gift registries.

**Status:**
Not applicable

**Reason:**
The wedding will not use a gift registry of any kind.

Gift guidance belongs in the FAQ.

---

## CI-EXCLUDE-006 — Entrée-Selection Content

**Excluded Content:**
Entrée, main-course, or meal-selection questions.

**Status:**
Not applicable

**Reason:**
The meal is a buffet-style brunch.

Guests will report only food allergies and dietary preferences.

---

## CI-EXCLUDE-007 — Separate RSVP Page Coded for Each Invitation

**Excluded Content:**
A separately coded React page or component for each invitation.

**Status:**
Not applicable

**Reason:**
One reusable dynamic form system must serve all invitations.

---

## CI-EXCLUDE-008 — Public Administrative Dashboard

**Excluded Content:**
A public website interface for administering invitations and responses.

**Status:**
Not applicable

**Reason:**
Google Sheets will serve as the initial private administrative interface.

---

## CI-EXCLUDE-009 — Private Setup or Wedding-Party-Only Schedule

**Excluded Content:**
Private setup times and wedding-party-only instructions.

**Status:**
Not applicable

**Reason:**
The public Schedule page contains only guest-relevant events.

---

## CI-EXCLUDE-010 — Additional RSVP Questions Outside the Approved Spreadsheet-Authoritative Structure

**Excluded Content:**
Guest-facing substantive online RSVP questions that are not part of the authoritative spreadsheet-defined form structure or a later recorded revision to that structure.

**Status:**
Not applicable

**Reason:**
Decision 015 fixes the current substantive RSVP structure: coordinated event attendance/decline, authorized named-invitee `Plus1` questions, four age-category numerical dials, and Reception-only attendee name plus dietary/allergy pairs.

Confirmation method, the applicable email address or SMS-capable mobile number, and required transactional text-message authorization remain allowed as operational online contact and delivery fields rather than substantive RSVP questions.
---

## CI-EXCLUDE-011 — Individual Named-Guest Attendance Controls

**Excluded Content:**
Separate accepting or declining controls for each named adult or child.

**Status:**
Not applicable

**Reason:**
Attendance is recorded at the invitation-party level through Ceremony and Reception choices and a mutually exclusive decline response, followed by the four age-category numerical dials for an attending party.

Named-invitee `Plus1` questions authorize additional guests but do not create person-by-person attendance decisions. Reception attendee-name fields identify the people represented by the complete attendance total after Reception has been selected; they likewise do not create individual acceptance controls.
---

## CI-EXCLUDE-012 — Accessibility, Lodging, Transportation, Standalone Plus-One Name, and Message Questions

**Excluded Content:**
Accessibility questions, lodging questions, transportation questions, a standalone field asking for an additional guest's name as part of the `Plus1` authorization question, and a message-to-the-couple field within the RSVP.

**Status:**
Not applicable

**Reason:**
These items are not part of the spreadsheet-authoritative substantive RSVP structure established by Decision 015.

This exclusion does not prohibit the Reception attendee-name fields required for every person included in the complete Reception attendance total. An attending Plus 1 who is part of that total is identified there in the same manner as every other Reception attendee.
---

## CI-EXCLUDE-013 — Code-Bearing Personalized RSVP URLs

**Excluded Content:**
Personalized RSVP routes or distributed links containing an invitation code.

**Status:**
Not applicable

**Reason:**
Decision 009 requires manual invitation-code entry through `/wedding/rsvp/` and prohibits invitation codes from remaining visible in the browser address bar.

---

## CI-EXCLUDE-014 — Prefilled or Displayed Stored RSVP Answers

**Excluded Content:**
Previously stored RSVP answers or confirmation destinations displayed or prefilled in the browser after invitation-code validation.

**Status:**
Not applicable

**Reason:**
Decision 016 requires every personalized form to load blank and protects stored answers from being returned to or displayed by the form.

---

## CI-EXCLUDE-015 — Email-Only Guest Confirmation Assumption

**Excluded Content:**
Content or interface wording that treats guest confirmation email as the only available confirmation channel.

**Status:**
Not applicable

**Reason:**
Decision 017 permits the guest to select either email or text-message confirmation.

---

## CI-EXCLUDE-016 — Omitted Revision Fields Treated as Deletions

**Excluded Content:**
Revision instructions or backend behavior that interpret an omitted blank field as deleting an existing answer.

**Status:**
Not applicable

**Reason:**
Under Decision 016, omitted RSVP fields mean “leave unchanged.” Clearing or replacing a stored answer requires an explicit submitted action or value.

---

# Inventory Review Checklist

Before the invitation-launch version is published and the printed invitations are mailed, confirm that:

* Every item marked **Needed Before Launch: Yes** is either Ready or has an explicitly approved temporary substitute.
* The invitation-launch website is operational and tested before invitation mailing begins, which is intended to occur no earlier than October 1, 2026.
* Complete public content exists for both approved event configurations.
* Only one event configuration is active and guest-facing at a time.
* Configuration A displays the Warinanco Park ceremony from 10:30 a.m. to 12:00 p.m. and the Sphinx reception from 12:30 p.m. to 4:30 p.m.
* Configuration B displays the ceremony and reception at the Sphinx within one combined 11:30 a.m. to 4:30 p.m. event block without inventing an internal ceremony-ending or reception-starting time.
* The active configuration is consistent across Home, Venues, Travel, Schedule, and FAQ.
* Public schedule content remains limited to confirmed outer event blocks and does not function as an internal run-of-show.
* No public page advertises a separately scheduled formal cocktail hour or formal dinner service.
* Buffet-style brunch is described as available throughout the reception portion of the event.
* Dancing is described as occurring at various intervals during the reception rather than within one fixed published period.
* No exact public times are assigned to flexible reception activities unless later approved through a recorded decision.
* The possible self-service mimosa station is omitted unless and until the couple and Sphinx Banquet and Catering Center confirm the arrangement.
* If Configuration A is active, the Sphinx-only inclement-weather fallback is clearly explained and can be activated promptly.
* The hotel block lists check-in on Friday, April 30, 2027, and check-out on Sunday, May 2, 2027.
* The selected hotel’s name, address, reservation instructions, rate information, booking deadline, and accessibility information are published once confirmed.
* The March 1, 2027, 11:59 p.m. EST RSVP deadline appears consistently wherever required.
* Before February 1, 2027, RSVP pages display the written deadline without a live countdown.
* From February 1, 2027, at 12:00 a.m. EST through the deadline, RSVP pages display the live countdown calculated from `America/New_York` time.
* At and after the deadline, the countdown is replaced by the closed-RSVP state and late-change instructions.
* `RSVPhelp@loreweavercreations.com` appears consistently in RSVP assistance content.
* Printed RSVP slips are identified as the alternative to online submission.
* The authoritative private `Invitees List` contains 57 active assigned production records whose normalized lookup keys are valid, unique, and collision-free.
* All 57 active source rows have corresponding reviewed private production configuration records before launch.
* The configuration transformation maps the approved party heading, source wording mode, maximum attendance, and exact Column E named-`Plus1` allocations without placing production codes, guest identities, or private allocation mappings in public source.
* The current source audit reflects 35 singular and 22 plural wording records, 23 invitations with at least one `Plus1` allocation, 26 total `Plus1` allocations, two invitations with multiple allocations, and 115 total potential attendees.
* No active production placeholder is required; development/test fixtures remain separate from production.
* The homepage correctly supports guests arriving through the static invitation QR code.
* Guests access RSVP through `/wedding/rsvp/` and manually enter their invitation code.
* No code-bearing personalized RSVP URL is distributed or implemented, and invitation codes do not remain visible in the browser address bar.
* Every validated RSVP form loads blank and does not display stored answers or stored confirmation destinations.
* Initial submissions require every field needed for a valid complete response.
* Revisions require a newly entered confirmation method, applicable email address or SMS-capable mobile number, any required transactional SMS authorization, and only the RSVP fields that need to change.
* Submitted operational confirmation values replace their stored counterparts.
* Submitted RSVP fields replace corresponding stored values, omitted RSVP fields remain unchanged, and explicit replace, clear, or zero-value operations exist for changing stored information.
* The backend validates the complete merged RSVP before saving the new current version.
* Each RSVP uses the source-mapped singular “I/I am” or plural “We/We are” wording.
* The RSVP permits Ceremony, Reception, or both, and includes the applicable mutually exclusive decline wording.
* A party with no Column E `Plus1` allocation receives no Plus 1 question; every authorized allocation produces its own named-invitee Yes/No question, including separate successive questions for multiple allocations in one row.
* Every attending RSVP uses the four coordinated numerical dials for Adults, Young Adults, Children ages 3–17, and Children under 3; the complete sum is at least 1 and does not exceed the invitation maximum.
* When Reception is selected, the form renders exactly one attendee-detail pair per person in the complete attendance total, with a required attendee name of no more than 100 characters and an optional dietary/allergy response of no more than 1000 characters.
* Ceremony-only attendance does not collect Reception attendee details; removing Reception or fully declining clears those details.
* The RSVP does not request separate named-person attendance decisions, a standalone additional-guest name during `Plus1` authorization, accessibility details, lodging plans, transportation needs, a message to the couple, entrée selections, or another unapproved substantive question.
* The online form collects a confirmation method and the valid email address or SMS-capable mobile number required by the selected method.
* Required transactional text-message authorization and provider-specific disclosures are accurate and complete.
* Mobile numbers are described and used only for approved transactional RSVP-confirmation messaging unless separately authorized.
* All active production invitations use the one spreadsheet-authoritative substantive form structure, with invitation-specific variation supplied by the private party heading, wording mode, authorized named-`Plus1` allocations, and maximum attendance.
* Every successful response is stored before any guest or administrative confirmation delivery is attempted.
* Guest and administrative delivery attempts proceed independently after storage, and failure of one channel does not prevent the other attempt.
* Guest email and text-message templates contain the complete current RSVP after an initial submission or merged revision, including only authorized named-`Plus1` responses and Reception attendee details that are applicable to the complete current state.
* Text confirmations remain understandable when divided into multiple message segments.
* Administrative emails contain the applicable invitation’s complete current RSVP, including authorized named-`Plus1` responses, age-category totals, Reception attendee details when applicable, and the guest confirmation method and destination, without including unrelated party data.
* Complete administrative confirmations are sent only to the approved protected address and are handled as private correspondence.
* Delivery failures do not undo, duplicate, or increment a stored RSVP and do not instruct guests to resubmit unnecessarily.
* Submission-uncertain copy does not claim success or failure without evidence, directs guests to check the selected confirmation channel, and permits only idempotent safe retry behavior.
* Service-unavailable copy remains distinct from an uncertain submission outcome and does not imply that an unconfirmed RSVP was stored.
* Manual resend procedures reproduce the complete current RSVP without modifying the stored response.
* The on-screen confirmation displays the complete current guest-facing RSVP, initial-or-revision designation, timestamp, selected guest delivery method, guest-delivery status, and a limited administrative-attempt status without exposing private backend data or the administrative address.
* Refresh fallback copy warns that the RSVP may already be recorded and directs the guest to the selected confirmation channel, manual entry, or assistance without encouraging a duplicate submission.
* Compact sticky navigation works on desktop and mobile, remains operable by touch and keyboard, and never obscures essential content.
* The mobile menu uses a clear text label or accessible name and closes after a destination is selected.
* Internal links beneath `https://www.loreweavercreations.com/wedding/` open in the same tab.
* External media, hotel, and map links open in a new tab with appropriate security attributes and an accessible indication.
* A concise privacy notice appears on the RSVP entry page and personalized form.
* The complete Privacy page is available at `/wedding/privacy` and accurately explains information collection, blank forms, partial revisions, storage, confirmations, access, retention, assistance, correction, and security limitations.
* The no-registry gift policy appears in the FAQ.
* Our Story has complete content for its dedicated public page.
* The Gallery displays the approved Coming Soon state.
* All public images have been reviewed for publication rights and accessibility.
* External book, audiobook, and film links have been verified.
* No copyrighted source-media files are included in public assets or guest-accessible shares.
* RSVP entry and confirmation experiences are excluded from public search indexing.
* Personalized and administrative content exposes only the information necessary for the applicable invited party or authorized recipient.
* Private invitation records, credentials, administrative notes, confirmation destinations, and RSVP answers remain outside the public frontend.
