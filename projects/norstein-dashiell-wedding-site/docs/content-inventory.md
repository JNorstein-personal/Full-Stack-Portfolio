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
The 57 currently assigned printed invitations use the same static QR code for:

`https://www.loreweavercreations.com/wedding/`

Any later printed invitation created from an assigned reserve code uses the same public-homepage QR destination. The QR code does not contain an invitation code and does not bypass manual invitation-code entry.

The homepage must make the RSVP destination immediately apparent.

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
The explicit Yes/No attendance control displayed for each specifically named invitee authorized by the validated invitation configuration.

**Status:**
Ready

**Source or Owner:**
Decision 015; Decision 023; authoritative `Invitees List` spreadsheet; invitation configuration

**Visibility:**
Personalized

**Needed Before Launch:**
Yes

**Approved Wording Pattern:**
`Will [Named Invitee] attend?`

**Approved Answers:**

* Yes
* No

**Notes:**
The validated invitation configuration supplies a limited `namedInvitees` roster containing one stable opaque identifier and approved display name for each specifically named potential attendee associated with that invitation, including specifically named children.

The browser renders one attendance question for each authorized roster entry and must not invent, enumerate, or expose named invitees from another invitation.

On an initial attending RSVP or a transition from full decline to attendance, every authorized named invitee requires an explicit Yes/No response. During an ordinary revision that remains attending, omission means leave that named invitee's stored response unchanged unless another submitted dependency requires replacement.

Named-invitee Yes responses combine with Plus1 Yes responses and any grouped unnamed-child attending count to derive `overallAttendance`. The age-category dials classify that already-derived attending party; they do not independently choose headcount.

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

If the authorized Plus 1 will attend, that person's name is supplied later through the ordinary `Attendee Details` structure used for every attending person, regardless of whether the party is attending Ceremony only, Reception only, or both.

---

## CI-RSVP-015 — Invited-Child Attendance Wording

**Content Item:**
The attendance wording and conditional count control used for invited children, distinguishing specifically named children from source-authorized unnamed children.

**Status:**
Ready

**Source or Owner:**
Decision 015; Decision 023; authoritative `Invitees List` spreadsheet; invitation configuration

**Visibility:**
Personalized

**Needed Before Launch:**
Yes

**Approved Wording Patterns:**

For a specifically named child represented in `namedInvitees`:

`Will [Named Invitee] attend?`

For an invitation whose source row authorizes unnamed children through `Kids(n)`:

`We'd love for your family to celebrate with us this Mayday - will your kid(s) be accompanying you?`

**Approved Answers for the Grouped Child Question:**

* Yes
* No

**Conditional Count Control:**

When the grouped child question is answered **Yes**, display one required dropdown containing the consecutive whole numbers from `1` through that invitation's authorized child `maximumCount`.

When the grouped child question is answered **No**, the dropdown is hidden or otherwise inapplicable and the canonical child count is zero.

**Notes:**
A specifically named invited child represented in the validated `namedInvitees` roster receives the same explicit Yes/No attendance decision as any other named invitee.

The latest authoritative `Invitees List` uses `Kids(n)` only for children whose individual names are unknown at invitation time. Therefore an applicable source row produces **one grouped `unnamedChildren` allocation**, not one allocation or one Yes/No question per possible child.

The grouped allocation contains the safe rendering metadata needed by the browser:

* stable opaque allocation `id`;
* `kind: "unnamedChildren"`;
* the approved family-level `prompt`; and
* positive whole-number `maximumCount`.

Under the current cleaned source, grouped child `maximumCount` must reconcile exactly to the applicable `Kids(n)` value and to the invitation's total capacity.

The grouped response remains inside `additionalGuestResponses`:

* Yes uses `{ "attending": "yes", "count": k }`, where `k` is a whole number from `1` through `maximumCount`.
* No uses `{ "attending": "no", "count": 0 }`.

No separate child-specific substantive response region is introduced.

A specifically named child remains only in `namedInvitees` and must not be duplicated into grouped unnamed-child capacity.

If one or more unnamed children attend, their actual names are supplied later through ordinary `Attendee Details`, one row per attending child. The grouped question itself never requests or invents child names.

The age-category dials separately classify every attending person, including the children represented by the grouped count, and must sum exactly to backend-derived `overallAttendance`.

The optional `Dietary or allergy information` field appears in each applicable attendee row only when Reception is selected.

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

## CI-RSVP-017 — Attendee Details and Dietary/Allergy Wording

**Content Item:**
The repeating attendee-name fields required for every attending person and the conditional per-attendee dietary/allergy field displayed when Reception is selected.

**Status:**
Draft needed

**Source or Owner:**
Decision 015; authoritative `Invitees List` spreadsheet; buffet-brunch policy; couple

**Visibility:**
Personalized

**Needed Before Launch:**
Yes

**Required Content:**

For every person represented by derived `overallAttendance`, display one `Attendee Details` row containing:

1. A required field labeled `Attendee name`, with a maximum of 100 characters.
2. When Reception is selected, an optional field labeled exactly `Dietary or allergy information`, with a maximum of 1000 characters.

**Notes:**

* The number of `Attendee Details` rows must equal backend-derived `overallAttendance` exactly.
* `Attendee Details` applies to Ceremony-only, Reception-only, and combined attendance. Full decline produces no attendee rows.
* The dietary/allergy field is Reception-specific. Ceremony-only attendance preserves attendee-name rows but does not display or retain dietary/allergy values.
* Removing Reception while retaining Ceremony clears stored dietary/allergy values but preserves attendee names.
* Adding Reception without changing the attending-person composition does not require attendee names to be re-entered solely because the optional dietary/allergy field became available.
* If the attending-person composition changes, the complete attendee-detail list must be replaced even when `overallAttendance` remains numerically unchanged, so stale names cannot survive a same-count attendee swap.
* A full decline clears `Attendee Details` completely.
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
* A named-invitee response submitted for an identifier not authorized by the validated invitation.
* A missing required Yes/No response for an authorized named invitee when attendance is newly applicable.
* An `additionalGuestResponses` value submitted for an allocation not authorized by the invitation.
* A missing required response for an authorized Plus1 or grouped-child allocation when newly applicable.
* A Plus1 allocation value other than Yes or No.
* A grouped child Yes response with no child count selected.
* A grouped child count below 1, above `maximumCount`, fractional, malformed, or otherwise invalid.
* A grouped child No response carrying a nonzero count.
* A response shape that does not match the allocation `kind`.
* An attending event selection whose complete authorized attendance responses/counts produce zero attendees.
* A negative, fractional, malformed, or otherwise invalid numerical age-dial value.
* An age-category total whose complete sum does not equal derived `overallAttendance` exactly.
* A dial increase that would exceed the remaining portion of derived `overallAttendance` after the other three categories.
* Missing `Attendee Details` records for an attending RSVP.
* An attendee-detail count that does not exactly equal derived `overallAttendance`.
* A blank required attendee name.
* An attendee name exceeding 100 characters.
* A dietary/allergy response exceeding 1000 characters.
* Dietary/allergy data submitted when Reception is not selected.
* A revision that changes attending composition without supplying the required complete replacement `Attendee Details` list.
* A grouped child response/count change without complete attendee-detail replacement.
* Invalid partial revisions after merging with the stored response and applying backend dependency clearing.
* Any other malformed, contradictory, or unauthorized field.

Validation messages must not expose previously stored answers, the invitation's private source row, raw `Kids(n)` text, unauthorized named invitees or additional-guest allocations, other invitation records, or private backend data.

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
The principal party-level event-selection interface using the spreadsheet-authoritative coordinated three-checkbox presentation.

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

The event-selection controls determine which event or events the attending members of the party will attend; they do not independently determine which people or how many grouped unnamed children attend.

When an attending state is selected, the complete named-invitee responses, Plus1 responses, and any grouped unnamed-child response/count determine the attending-party composition and backend-derived `overallAttendance`.

The backend rejects an attending event state whose complete authorized attendance responses/counts produce zero attendees.

Selecting a complete resulting decline clears `namedInviteeResponses`, `additionalGuestResponses`, age-category totals, derived `overallAttendance`, and `Attendee Details`.

Removing Reception while remaining Ceremony-only preserves attendee-name details but clears dietary/allergy values because those values are Reception-specific.

During a partial revision, omission means leave the stored event-attendance state unchanged unless another submitted operation changes its applicability. Explicit event attendance or decline input is required to change the stored event state.

## CI-RSVP-028 — Attendance Totals by Age Category

**Content Item:**
The four coordinated numerical-dial controls used to classify the already-derived attending party by age category.

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

`maximumAttendance` remains the invitation's authoritative potential-party capacity from Column F, but the dials do not allow the guest to choose an arbitrary headcount anywhere up to that maximum.

Actual `overallAttendance` is first derived as:

`named-invitee Yes count + Plus1 Yes count + grouped unnamed-child attending count`

A grouped child allocation answered Yes contributes its validated selected count; No contributes zero.

The current upper bound of each dial is derived `overallAttendance` minus the values already allocated to the other three age categories. The browser must therefore coordinate the visible controls against the actual attending count rather than merely against `maximumAttendance`.

The backend independently validates that all four values are nonnegative whole numbers and that their complete sum equals derived `overallAttendance` exactly.

During a revision, an omitted category ordinarily remains unchanged and an explicit zero replaces a previously positive category, but any merged age totals must still equal the newly derived `overallAttendance`. Any attendance-composition change may therefore require one or more age-category replacements even when those categories were not otherwise being edited.

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
The rule ensuring that the online RSVP implements the substantive structure and invitation-specific variation defined by the authoritative `Invitees List` spreadsheet and its approved project clarifications.

**Status:**
Ready

**Source or Owner:**
Decisions 015–017 and 023; authoritative `Invitees List` spreadsheet

**Visibility:**
Private documentation

**Needed Before Launch:**
Yes

**Required Structure:**

* One coordinated Ceremony / Reception / decline event-attendance control.
* Explicit singular or plural wording from Column I.
* One explicit Yes/No attendance control for every authorized object in the invitation's safe `namedInvitees` roster.
* Zero or more authorized additional-guest controls derived from the private invitation configuration.
* One Yes/No control for every `kind: "plus1"` allocation.
* At most one grouped `kind: "unnamedChildren"` control per applicable invitation.
* The approved grouped child family prompt plus a conditional required count selector from `1` through the allocation's `maximumCount` after Yes.
* Backend-derived `overallAttendance` equal to named-invitee Yes count + Plus1 Yes count + grouped unnamed-child attending count.
* Four coordinated age-category numerical dials whose complete sum equals derived `overallAttendance` exactly.
* Repeating `Attendee Details` rows whose count equals derived `overallAttendance`, with required attendee name for every attendee.
* An optional field labeled `Dietary or allergy information` within each attendee row only when Reception is selected.
* Separate operational confirmation fields required by the enabled delivery channel.

**Notes:**
Every functional production invitation uses this one reusable substantive form model. That currently includes the 57 guest-list-eligible assigned invitations and the permanent Test Sample. Reserved source rows 58–67 produce no functional RSVP form until they are deliberately populated as assigned invitations.

Invitation-specific variation comes from the private transformed row data; the project does not assign separate production question profiles.

The private production configuration must reconcile:

`namedInvitees.length + sum(additionalGuestAllocations.maximumCount) === maximumAttendance`

An allocation object is therefore not assumed to equal one person. A grouped child allocation may represent multiple authorized child-capacity slots.

Ambiguous or contradictory source rows fail transformation for review rather than being served to guests.

Do not add unrecognized or unauthorized named-person controls, a standalone additional-guest-name field inside a Plus1 or grouped-child authorization question, accessibility details, lodging plans, transportation needs, a message to the couple, entrée selections, a separate child substantive region, or another unapproved substantive question without a later recorded decision and corresponding source/document updates.

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
* A validated form renders only the named-invitee roster and safe additional-guest allocation controls authorized for that invitation.
* Plus1 allocations use one Yes/No response each.
* A grouped unnamed-child allocation uses one family-level Yes/No response; Yes additionally requires the number attending from 1 through the authorized `maximumCount`.
* An initial attending RSVP requires explicit responses for every named invitee and every authorized allocation, all four age totals, and exactly one `Attendee Details` row for each derived attendee.
* A revision requires the guest to re-enter the confirmation method, applicable email address or SMS-capable mobile number, and any required transactional text-message authorization.
* A revision otherwise requires only the applicable RSVP fields that need to change, subject to dependency and complete-replacement rules.
* Submitted RSVP fields replace their stored counterparts; submitted operational confirmation fields replace their stored counterparts.
* Explicit zero is a replacement value for a numerical age dial and is also the canonical count carried by a grouped child No response.
* Omitted RSVP fields mean only “leave unchanged” and must never be interpreted as deletion.
* Values made inapplicable by another submitted change are cleared by backend dependency rules.
* A resulting full decline clears named-invitee responses, all `additionalGuestResponses`, age-category totals, derived `overallAttendance`, and `Attendee Details`.
* Removing Reception while remaining Ceremony-only preserves attendee names and clears dietary/allergy values only.
* Adding Reception while attendee composition is unchanged makes optional dietary/allergy fields available without requiring names to be re-entered.
* Any named-invitee or Plus1 change that changes attending composition requires a complete replacement `Attendee Details` list.
* Any grouped child response/count change requires a complete replacement `Attendee Details` list because the identities of unnamed child attendee rows cannot safely be presumed unchanged.
* The complete merged age-category totals must equal the newly derived `overallAttendance`.
* The backend merges submitted changes, applies dependency clearing, validates authorization and the complete resulting RSVP, and saves only a valid final state.
* The next confirmation contains the complete merged RSVP rather than only the fields changed during the revision.

## CI-RSVP-032 — No-Change, Replace, Zero, and Clear Wording

**Content Item:**
Instructions and control labels that distinguish leaving an answer unchanged from explicitly replacing it, using zero where valid, or allowing backend dependency rules to clear information that has become inapplicable.

**Status:**
Draft needed

**Source or Owner:**
Decision 016; application

**Visibility:**
Personalized

**Needed Before Launch:**
Yes

**Notes:**
A blank omitted RSVP field means only “leave the stored answer unchanged.”

The active submission contract does **not** use a generic client substantive `clear` operation. The form must instead provide unambiguous ways to perform applicable changes such as:

* Changing from attending to declining or from declining to attending.
* Changing Ceremony and Reception selections.
* Replacing an authorized named-invitee Yes/No response.
* Replacing an authorized Plus1 Yes/No response.
* Replacing the grouped unnamed-child `{attending,count}` response.
* Replacing a positive age-category dial value with explicit zero.
* Replacing the complete `Attendee Details` list whenever attending composition changes, including a same-count swap or any grouped child response/count change.
* Clearing dietary/allergy information by removing Reception or by submitting an empty value where the optional field remains applicable.

Backend dependency rules automatically clear values made inapplicable by another change, including all attendance-dependent substantive data after full decline and dietary/allergy values when Reception is removed.

The wording must avoid revealing previously stored values. The form must not offer a named-invitee or additional-guest control that is not authorized by the validated invitation.

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
* Each authorized named-invitee Yes/No response applicable to the invitation.
* Each authorized additional-guest allocation response applicable to the invitation.
* Derived `overallAttendance` for an attending response.
* Adults, Young Adults, Children ages 3–17, and Children under 3, whose complete total equals `overallAttendance`.
* The complete ordered set of attendee names for every attending response.
* When Reception is selected, each attendee's dietary/allergy response where supplied.
* Submission or revision timestamp.
* Whether the action was an initial submission or revision.
* Selected guest confirmation method.
* Guest confirmation-delivery attempt status.
* A limited administrative-email attempt status where appropriate.

**Notes:**
The summary must show the complete current merged RSVP, not only the fields supplied during a revision.

Do not invent a named-invitee or Plus 1 response that is not authorized by the invitation. Ceremony-only summaries still include attendee names; they omit dietary/allergy information because that field is Reception-specific.

Guest and administrative delivery statuses must remain distinct. The administrative status must not expose the couple's private administrative email address. Do not expose spreadsheet row numbers, internal invitee/allocation identifiers, administrative notes, provider credentials, or unrelated party information.

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

Explain that the guest should submit only the RSVP fields that need to change, use an explicit replace or clear operation when stored information must be removed or reset, and understand that omitted RSVP fields remain unchanged unless a dependency makes them inapplicable or requires complete replacement.

The instructions must specifically make clear that changing which people are attending requires a complete replacement `Attendee Details` list even if the numerical attendance total stays the same, while removing Reception alone preserves attendee names and clears only dietary/allergy information. The next confirmation must contain the complete updated RSVP.

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
* Each authorized named-invitee Yes/No response applicable to the invitation.
* Each authorized additional-guest allocation Yes/No response applicable to the invitation.
* Derived overall attendance and all four age-category totals for an attending response.
* Every attendee name for an attending response.
* When Reception is selected, each attendee's dietary/allergy response where supplied.
* Submission or revision timestamp.
* RSVP deadline.
* Blank-form and partial-revision instructions.
* RSVP assistance information.

**Notes:**
The confirmation must contain the complete current RSVP after a revision is merged and validated.

Email and text-message versions may differ in formatting but not in substantive content. They must not invent unauthorized named-invitee or `Plus1` questions, and they must not show dietary/allergy information when Reception is not part of the complete current RSVP.

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
* Every authorized named-invitee Yes/No response applicable to the invitation.
* Every authorized additional-guest allocation response applicable to the invitation.
* Derived `overallAttendance` and all four age-category totals for an attending response.
* The complete attendee-name list for an attending response.
* When Reception is selected, dietary/allergy responses where supplied.
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
* Complete current authorized named-invitee Yes/No responses.
* Complete current authorized additional-guest allocation responses.
* Current derived `overallAttendance` and complete age-category totals for an attending response.
* Complete current attendee-name list for an attending response.
* When Reception is selected, current dietary/allergy responses where supplied.
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
Ready

**Source or Owner:**
Decision 017; couple; application

**Visibility:**
Private

**Needed Before Launch:**
Yes

**Notes:**
The resend reproduces the complete current RSVP through the stored approved guest confirmation channel without modifying the stored response, creating a duplicate, or incrementing the RSVP version.

The production maintenance command is:

`npm run resend:rsvp-confirmation`

The operator supplies the invitation code and acknowledgement only as ephemeral shell environment variables:

`RSVP_MANUAL_RESEND_INVITE_CODE`
`RSVP_MANUAL_RESEND_ACK=RESEND_CURRENT_RSVP_CONFIRMATION`

The command is production-only. It loads the existing private invitation and current RSVP from Google Sheets, uses the already stored confirmation destination, sends only the guest confirmation, and records the result in the separate `Resend Records` history.

The command does not print the invitation code, guest destination, RSVP contents, provider credentials, or workbook contents. Its terminal result is limited to safe operational states such as `PASS (sent)`, `RECORDED (failed)`, `RECORDED (uncertain)`, `NOT FOUND`, or `FAIL`.

A failed or uncertain resend does not alter RSVP content or version history.

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

1. Ceremony / Reception / decline state.
2. Authorized named-invitee Yes/No responses.
3. Authorized additional-guest allocation responses, if any.
4. Derived `overallAttendance` and age-category totals for an attending RSVP.
5. `Attendee Details` names for every attending person.
6. When Reception is selected, per-attendee `Dietary or allergy information` where supplied.
7. Timestamp and submission/revision context.
8. Applicable delivery information for the surface.

Channel-specific formatting may vary, but no confirmation may omit a substantive part of the complete current RSVP. A surface must not invent an unauthorized named invitee or Plus 1 response. Ceremony-only attendance includes attendee names but omits dietary/allergy information.

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

The authorization question does not ask for the additional guest's name. If the authorized additional guest will attend, that person's name is supplied later through the same `Attendee Details` structure used for every attending person. Dietary/allergy information appears for that attendee only when Reception is selected.

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
* Every attending person is identified by name in `Attendee Details`.
* When Reception is selected, each attendee row also provides the optional field `Dietary or allergy information` so dietary needs can be associated with the correct attendee.

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
* Explicit Yes/No responses for named invitees authorized for the validated invitation.
* Plus1 Yes/No responses where authorized.
* The grouped unnamed-child family Yes/No response and selected child count where `Kids(n)` is authorized.
* Backend-derived overall attendance.
* Adults, Young Adults, Children ages 3–17, and Children under 3, whose totals equal the derived attendance count.
* Attendee names for every attending response, including attending Plus1s and children represented by the grouped count.
* Per-attendee dietary/allergy information where supplied when Reception is selected.
* Confirmation method.
* Email address or SMS-capable mobile number.
* Transactional text-message authorization where applicable.
* The fact that invitation-specific named-invitee and additional-guest controls appear only when authorized by the private invitation configuration.
* The fact that attendee names are collected for all attending RSVPs while dietary/allergy information is Reception-specific.

The explanation must distinguish substantive RSVP information from operational confirmation-contact information and must not imply that the public browser can retrieve previously stored answers.

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

Explain that submitted RSVP replacements are merged privately with the current response, omitted RSVP fields remain unchanged, and backend dependency rules clear information that another change makes inapplicable. Do not describe a generic client substantive `clear` operation because it is not part of the active contract.

Explain at a high level that named-invitee changes, Plus1 changes, and grouped child response/count changes can affect derived headcount, age-category totals, and attendee-detail requirements. Any grouped child response/count change requires the complete attendee-name list to be replaced because the system cannot safely infer which unnamed child identity corresponds to a previously stored row.

Removing Reception while continuing to attend Ceremony preserves attendee names but removes Reception-specific dietary/allergy information.

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

Explain that named-invitee attendance decisions, Plus1 responses, grouped unnamed-child Yes/No and attending counts, age totals, attendee names, dietary/allergy information, confirmation destinations, and RSVP transaction history are private RSVP-operational data. Attendee names may appear in the submitting party's own confirmation surfaces and protected administrative records; dietary/allergy information appears there only when it applies to Reception.

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

## CI-ADMIN-001 — Authoritative Production Invitation-Code Source

**Content Item:**
The complete private numbered invitation-code source containing assigned guest-list invitations, reserved future invitation codes, and the permanent production Test Sample.

**Status:**
Ready

**Source or Owner:**
Couple-supplied `Invitees List` spreadsheet

**Visibility:**
Private

**Needed Before Launch:**
Yes

**Notes:**
The authoritative private source currently contains 68 numbered invitation-code rows with 68 unique canonical invitation codes and a valid numbered sequence through Invite 68.

The current source roles are:

* Invites 1–57 — assigned guest-list invitations.
* Invites 58–67 — reserved invitation-code placeholders that are not currently functional RSVP identities.
* Invite 68 — the permanent production Test Sample.

The current functional registry therefore contains 58 invitation configurations: 57 guest-list-eligible assigned invitations and one permanent Test Sample. The ten reserved rows remain source-level placeholders until deliberately populated.

For the established assigned guest-list baseline represented by invites 1–57, the source contains 35 singular `I` wording records and 22 plural `we` wording records. The current guest-list maximum attendance remains 115. The Test Sample has maximum attendance 2 and does not contribute to guest-list counts, so the current functional combined maximum attendance is 117.

If one or more of invites 58–67 is later populated as an assigned invitation, the source remains authoritative, the reserved-placeholder count decreases, and the current guest-list invitation and capacity totals increase dynamically. The invites 1–57 baseline remains independently auditable at 57 invitations and 115 maximum attendance.

The spreadsheet, real codes, Test Sample code, guest names, source `Plus1` mappings, `Kids(n)` unnamed-child authorization mappings, source-role classification, and code-to-party associations must remain in approved private project storage and outside public documentation, frontend source files, public repositories, analytics, metadata, ordinary logs, and unnecessary browser responses.

## CI-ADMIN-002 — Invitation Party Configuration Records

**Content Item:**
The private backend configuration generated for each functional production invitation record.

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
* Reviewed party display name or greeting.
* Explicit singular or plural `wordingMode` from Column I.
* `maximumAttendance` from Column F, representing complete potential-party capacity.
* `namedInvitees`, containing one stable opaque non-name-derived identifier and approved `displayName` for each specifically named potential attendee.
* Zero or more `additionalGuestAllocations`.
* Every allocation contains:
  * stable opaque `id`;
  * safe `kind`;
  * reviewed guest-facing `prompt`;
  * positive whole-number `maximumCount`.
* Each source `Plus1` becomes one `kind: "plus1"` allocation with `maximumCount: 1`.
* Each applicable `Kids(n)` source row becomes one grouped `kind: "unnamedChildren"` allocation whose `maximumCount` equals the reconciled unnamed-child capacity for that invitation.
* Private `recordRole`, using `assigned` for guest-list invitations and `test` for the permanent Test Sample.
* Private `guestListEligible`, true only for assigned guest-list invitations.
* Active status and production environment classification.

**Notes:**
A reserved placeholder row does not produce a functional production configuration. An exact reserved placeholder remains source-only until deliberately populated. A partially populated or otherwise ambiguous reserved row fails closed for private review.

The current source produces 58 validated functional production configurations:

* 57 assigned configurations with `recordRole: "assigned"` and `guestListEligible: true`.
* One permanent Test Sample with `recordRole: "test"` and `guestListEligible: false`.

Every valid functional configuration must satisfy:

`namedInvitees.length + sum(additionalGuestAllocations.maximumCount) === maximumAttendance`

The established invites 1–57 guest-list baseline contains:

* 35 singular-wording records and 22 plural-wording records.
* 84 specifically named potential attendees.
* 23 invitations with at least one allocation.
* 26 Plus1 allocation objects.
* Two invitations with `Kids(n)`.
* Five total unnamed-child person-capacity slots.
* Two grouped `unnamedChildren` allocation objects.
* 28 total allocation objects.
* 31 total additional-guest person-capacity slots.
* Four invitations containing more than one allocation.
* Combined guest-list maximum-attendance capacity of 115.

The permanent Test Sample contributes one named invitee, one Plus1 allocation, and maximum attendance 2, but contributes nothing to guest-list totals.

Every functional production invitation uses the same spreadsheet-authoritative substantive form structure. No production question-profile assignment is required.

After successful lookup, the browser may receive only the safe invitation fields required to render the applicable blank form. Private `recordRole`, `guestListEligible`, raw `Kids(n)` text, private source-row identifiers, unrelated guest records, and source-only mapping metadata remain backend-private.

The configuration records remain pending until the updated source has been synchronized into the protected production workbook and the complete production verification sequence has passed.

## CI-ADMIN-003 — Reserved, Permanent-Test, and Development Records

**Content Item:**
The private classification and handling rules for reserved source codes, the permanent production Test Sample, and fictional development/test fixtures.

**Status:**
Ready

**Source or Owner:**
Couple; Decisions 023, 027, and 028; application

**Visibility:**
Private

**Needed Before Launch:**
Yes

**Notes:**
Invites 58–67 are reserved source-code placeholders. In their exact placeholder state they do not produce production invitation configurations, cannot retrieve an RSVP form, and do not contribute to guest-list counts or capacity.

When the couple deliberately populates one of invites 58–67 as a real invitation, it becomes an ordinary assigned production invitation with `recordRole: "assigned"` and `guestListEligible: true`. Its capacity is then added to the current guest-list totals without changing the established invites 1–57 baseline audit.

Invite 68 is the permanent production Test Sample. It is a functional production identity with `recordRole: "test"` and `guestListEligible: false`. It follows the ordinary production RSVP contract for lookup, blank-form rendering, submission, revision, persistence, version history, idempotency, confirmation, and operational storage, but it is excluded from real wedding guest-list counts and capacity.

The Test Sample code remains private. Production smoke testing must use this identity rather than a real guest invitation.

Fictional development/test fixtures remain separate from production records and are never authorized as production invitations.

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
The couple has confirmed the administrative recipient. The actual address is intentionally omitted from this public portfolio artifact and must be maintained only in protected backend configuration. It must not be a public or broadly shared distribution list because each message contains the complete current RSVP, including attendee names, applicable Reception dietary/allergy information, and confirmation-contact information.

---

## CI-ADMIN-005 — Guest Confirmation Sender Identities and Reply Behavior

**Content Item:**
The public sender identity, reply-to behavior, and assistance wording for guest email and text-message confirmations.

**Status:**
Email finalized and live validated; Text Message pending production SMS gate

**Source or Owner:**
Couple; Decision 017; delivery providers

**Visibility:**
Private configuration and guest confirmations

**Needed Before Launch:**
Yes

**Notes:**
Production email uses Resend with sender name `Norstein-Dashiell Wedding`, sender address `confirm@rsvp.loreweavercreations.com`, and Reply-To / assistance address `RSVPhelp@loreweavercreations.com`.

The sending subdomain was verified and an isolated live-email test passed on September 20, 2026. The received message matched the approved From identity, Reply-To identity, and safety content. The test did not access RSVP storage or production invitation records, and no API key or test-recipient address is recorded here.

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
Ready

**Source or Owner:**
Decision 017; couple; application

**Visibility:**
Private

**Needed Before Launch:**
Yes

**Notes:**
The process does not resubmit, modify, duplicate, or increment the RSVP. It resends the complete current RSVP to the stored guest confirmation destination and records the new delivery attempt and result in `Resend Records`.

Approved operator procedure:

1. Run only from the protected backend maintenance environment with production Google Sheets and email-provider configuration already available.
2. Set `RSVP_MANUAL_RESEND_INVITE_CODE` ephemerally to the printed invitation code supplied for the affected party.
3. Set `RSVP_MANUAL_RESEND_ACK` ephemerally to exactly `RESEND_CURRENT_RSVP_CONFIRMATION`.
4. Run `npm run resend:rsvp-confirmation`.
5. Review only the safe terminal result:
   * `PASS (sent)`
   * `RECORDED (failed)`
   * `RECORDED (uncertain)`
   * `NOT FOUND`
   * `FAIL`
6. Remove both ephemeral environment variables from the shell after the operation.
7. If the result is `failed` or `uncertain`, investigate delivery separately; do not create a new RSVP merely to resend confirmation.

The maintenance command does not start Express and creates no public/admin API endpoint. It verifies Google Sheets access, retrieves only the matching invitation/current RSVP, reuses the stored guest confirmation destination, and sends only the guest confirmation. It does not repeat the protected administrative message.

The invitation code, guest destination, RSVP contents, provider credentials, and workbook details must not be written to ordinary terminal output or logs by this operation.

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
The process used to retire real-guest RSVP operations and RSVP-operational data after the response period and wedding while preserving the permanent production Test Sample for portfolio verification.

**Status:**
Draft needed

**Source or Owner:**
Decision 024; permanent Test Sample requirement; couple; application

**Visibility:**
Private

**Needed Before Launch:**
No

**Notes:**
Document how real-guest personalized submission activity is retired and how RSVP-operational data is deleted or irreversibly de-identified in accordance with the finalized retention standard.

Active current responses, superseded versions, named-invitee and additional-guest attendance responses, age totals, attendee names, dietary/allergy text, guest confirmation destinations, SMS authorization, client submission identifiers, delivery-attempt history, transaction timestamps retained only as RSVP history, and real-guest code-to-response mappings must be deleted or irreversibly de-identified no later than July 30, 2027 unless a minimum record is temporarily required for a concrete documented administrative need.

Protected backups containing retired RSVP-operational data must expire no later than August 29, 2027 through backup rotation. The separately maintained private `Invitees List` may remain for personal planning/address purposes, but retired real-guest RSVP operation must not depend on historical response data.

The permanent Test Sample configuration is not retired with the real wedding guest list. Its private production identity remains available indefinitely for controlled portfolio and production-verification use. Historical Test Sample RSVP responses may still be deleted or de-identified under the same data-minimization policy; continued Test Sample functionality must not depend on retaining old Test Sample submissions.

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
Decisions 011, 015–021, 023, 024, 027, and 028; couple

**Visibility:**
Private

**Needed Before Launch:**
Yes

**Notes:**
Confirm that the active event configuration, public pages, manual-entry RSVP flow, blank forms, partial-revision merge behavior, enabled confirmation channels, protected administrative email, countdown states, sticky navigation, link behavior, privacy notices, and production invitation registry are ready before mailing.

The checkpoint must also confirm that:

* The authoritative private source contains 68 numbered rows, 68 unique canonical source codes, and a valid Invite 1–68 sequence.
* Invites 1–57 are the established assigned guest-list baseline; invites 58–67 are exact reserved placeholders unless deliberately populated; Invite 68 is the permanent Test Sample.
* The current source produces 58 functional production configurations: 57 guest-list eligible and one permanent test identity.
* The ten exact reserved placeholders produce no functional production configuration.
* Every functional configuration uses the correct party heading, wording mode, `maximumAttendance`, complete safe `namedInvitees` roster, exact source `Plus1` mapping, and any source-authorized grouped unnamed-child capacity required by `Kids(n)` reconciliation.
* Every functional configuration satisfies `namedInvitees.length + sum(additionalGuestAllocations.maximumCount) === maximumAttendance`.
* The established invites 1–57 baseline reconciles to 84 named potential attendees, 31 additional-person capacity slots, and 115 maximum guest-list attendance.
* The permanent Test Sample has maximum attendance 2 and does not contribute to guest-list counts.
* Current functional combined maximum attendance is 117 while current guest-list maximum attendance remains 115.
* Every authorized named invitee produces one explicit Yes/No attendance control using only that invitation's limited safe roster.
* A source row with no `Plus1` receives no Plus1 question.
* Each authorized `Plus1` allocation produces its own named-invitee Yes/No question.
* Each applicable source row with unnamed-child capacity produces one grouped `unnamedChildren` family question and a conditional 1-through-`maximumCount` selector rather than one question per child.
* Derived `overallAttendance` equals named-invitee Yes count + Plus1 Yes count + grouped unnamed-child attending count.
* All attending forms use the four coordinated age-category numerical dials and require their sum to equal derived `overallAttendance` exactly.
* Every attending response produces exactly one `Attendee Details` row per derived attendee, with a required attendee name of no more than 100 characters.
* The field `Dietary or allergy information` appears only when Reception is selected and remains optional with a 1000-character limit.
* Ceremony-only attendance preserves attendee-name rows and contains no dietary/allergy values.
* No real production code, Test Sample code, unrelated guest detail, raw source-row identifier, or private allocation mapping appears in public source, public documentation, browser metadata, analytics, or ordinary logs.
* Fictional development/test fixtures remain separated from the production registry.
* Production uses only one mutation-capable RSVP backend instance while Google Sheets remains the persistence adapter.
* Failure-injection tests confirm recovery from interrupted RSVP persistence and ambiguous delivery completion without duplicate versions or automatic duplicate confirmations.
* Production readiness verifies the source audit, workbook schema, and compatibility of every operationally referenced invitation configuration. It does not require the RSVP operational tables to be empty.
* The guarded invitation synchronization creates a private pre-load snapshot, replaces only the `Invitations` registry, proves operational RSVP sections are unchanged, verifies an exact source-to-workbook functional registry match, and attempts invitation rollback if a post-backup load step fails.
* Independent post-load activation verification confirms the exact current functional invitation registry and continued compatibility of all operationally referenced invitations.
* Production runtime readiness is rerun after the updated invitation registry is synchronized.
* Production loopback smoke uses only the permanent Test Sample and proves that the read-only health/lookup path leaves operational RSVP data unchanged.

The September 20, 2026 activation and runtime results remain historical evidence of the guarded infrastructure; they do not replace the current source, synchronization, and Test Sample verification gates.

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
Document the approved recipient, mailbox-access restrictions, sender configuration, content boundaries, delivery-status recording, and handling of:

* named-invitee Yes/No responses;
* Plus1 Yes/No responses;
* grouped unnamed-child Yes/No plus attending count;
* derived `overallAttendance`;
* age totals;
* attendee names;
* Reception-specific per-attendee dietary/allergy information; and
* guest confirmation-contact information.

The email must contain only the applicable invitation's complete current RSVP and no unrelated records, raw private source data, or backend secrets.

The administrative-email attempt occurs independently of the guest email or text-message attempt; failure of either delivery must not prevent the other attempt after storage.

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
Document how submitted RSVP fields replace stored values, omitted RSVP fields remain unchanged, explicit numeric zero is preserved where valid, and backend dependency rules clear values made inapplicable by another submitted change. Do not document a generic client substantive `clear` operation because it is not part of the active submission contract.

Document how newly submitted confirmation method, destination, and applicable SMS-authorization fields replace their stored counterparts.

The procedure must specifically document:

* Authorization of `namedInviteeResponses` against the invitation's private safe named-invitee roster.
* Authorization of `additionalGuestResponses` against typed private allocation records.
* Validation of scalar Yes/No for `plus1`.
* Validation of grouped `{attending,count}` for `unnamedChildren`, including `1..maximumCount` for Yes and `0` for No.
* Backend derivation of `overallAttendance` from named-invitee Yes count + Plus1 Yes count + grouped unnamed-child attending count; the client cannot override it.
* Exact age-category total validation against derived `overallAttendance`.
* Automatic clearing of all attendance-dependent substantive data on full decline.
* Preservation of attendee names and automatic clearing of dietary/allergy values when Reception is removed but Ceremony remains selected.
* Optional availability of dietary/allergy fields when Reception is added without requiring attendee-name re-entry solely because Reception became applicable.
* Complete replacement of `Attendee Details` whenever attending composition changes.
* Mandatory complete attendee-detail replacement after any grouped child response/count change.
* Exact cardinality validation between `Attendee Details` records and derived `overallAttendance`.
* Attendee-name and dietary/allergy character limits and Reception-only authorization of dietary/allergy data.
* Contradiction rejection, complete merged-state validation, idempotent duplicate protection, current-version designation, timestamps/version history, and confirmation generation from the complete merged state.
* Private submission lifecycle states used for recoverable persistence without exposing stored answers or internal version metadata.
* Private non-reversible mutation identifiers used to recognize and repair interrupted writes without appending duplicate RSVP versions.
* The rule that an ambiguous post-provider crash resolves to an `uncertain` delivery result rather than an automatic duplicate confirmation.
* The Google Sheets single-writer deployment boundary unless a later storage/locking decision supports coordinated independent writers.

## CI-ADMIN-018 — Invitees List Transformation and Synchronization Procedure

**Content Item:**
The repeatable private procedure that transforms the authoritative `Invitees List` spreadsheet into the functional production invitation registry and safely synchronizes that registry with the production workbook.

**Status:**
Ready

**Source or Owner:**
Decisions 023 and 027; production invitation requirements; application

**Visibility:**
Private

**Needed Before Launch:**
Yes

**Required Mapping:**

* Guest ID to canonical `inviteCode` and approved display code.
* Invitation number plus source-row shape to private source-role classification.
* `Attendee Names Clarification` to `partyDisplayName` when populated; otherwise the source First Name(s) and Last Name(s) fields to reviewed party-display and greeting content.
* `I/We wording` to explicit `wordingMode`.
* `Total Potential Attendees (Including Plus1 and Kids)` to `maximumAttendance`.
* Parallel C/D name entries to the complete safe `namedInvitees` roster.
* Each source `Plus1` occurrence to one `kind: "plus1"` allocation with `maximumCount: 1` and the correct named-invitee prompt association.
* Each applicable source `Kids(n)` row to **one** grouped `kind: "unnamedChildren"` allocation whose `maximumCount` equals the complete reconciled unnamed-child capacity.
* Assigned rows to `recordRole: "assigned"` and `guestListEligible: true`.
* The permanent Test Sample to `recordRole: "test"` and `guestListEligible: false`.
* Protected deployment configuration to `active: true` and `environment: "production"` for each functional configuration.

**Reserved-Row Rules:**

* Invites 58–67 are reserved-code slots.
* An exact placeholder row remains source-only and produces no functional invitation configuration.
* A deliberately populated reserve row becomes an assigned guest-list invitation.
* A partially populated or ambiguous reserve row fails closed for private review.

**Required Validation:**

* Exactly 68 numbered source rows in the current authoritative source.
* Exactly 68 unique normalized source invitation codes.
* Valid numbered source sequence through Invite 68.
* Exactly one permanent Test Sample source row at Invite 68.
* Current exact placeholder recognition for invites 58–67.
* Successful normalization of every source code.
* No duplicate canonical key or normalization collision.
* No missing required value in a functional invitation row.
* Only supported singular/plural wording modes.
* Positive whole-number maximum-attendance values for functional invitations.
* Equal, unambiguous parallel C/D name counts.
* Correct identification of every specifically named invitee needed to form the safe roster.
* Unique stable opaque named-invitee ids within each invitation configuration.
* Correct parsing of every Column E `Plus1` allocation.
* Correct association of parenthesized names with allocations on rows containing multiple `Plus1` entries.
* A single unparenthesized `Plus1` maps to the row's primary named invitee.
* Correct parsing of `Kids(n)`.
* Derivation of:

  `unnamedChildCapacity = maximumAttendance - namedInvitees.length - plus1Count`

* A negative residual fails transformation.
* A positive residual requires applicable `Kids(n)` authorization.
* Under the current cleaned authoritative source, a positive residual equals source `n`.
* Exactly one grouped `unnamedChildren` allocation is created when the residual is positive.
* No grouped child allocation is created when the residual is zero.
* A named child remains in `namedInvitees` and is never duplicated into grouped child capacity.
* Every allocation has valid stable opaque `id`, supported `kind`, approved prompt, and positive whole-number `maximumCount`.
* Every `plus1` has `maximumCount: 1`.
* At most one `unnamedChildren` allocation exists per invitation.
* Exact reconciliation:

  `namedInvitees.length + sum(additionalGuestAllocations.maximumCount) === maximumAttendance`

* No production question-profile assignment requirement.
* Explicit assigned-versus-test classification and guest-list eligibility.
* Failure before deployment when any source record is malformed, incomplete, duplicate, contradictory, or ambiguous.

**Current Source Audit:**

* 68 numbered source rows.
* 68 unique source invitation codes.
* Valid Invite 1–68 sequence.
* 10 reserved placeholders.
* 58 functional production configurations.
* 57 guest-list-eligible assigned invitations.
* One permanent Test Sample.
* 117 functional combined maximum attendance.
* 115 current guest-list maximum attendance.
* 35 singular and 22 plural guest-list invitations.
* 84 specifically named guest-list potential attendees.
* 23 guest-list invitations containing at least one allocation.
* 26 total guest-list Plus1 allocation objects.
* Two guest-list records containing `Kids(n)`.
* Five total guest-list unnamed-child person-capacity slots.
* Two grouped `unnamedChildren` allocation objects.
* 28 total guest-list `additionalGuestAllocations` objects.
* 31 total guest-list additional-person capacity slots.
* Four guest-list invitations containing more than one allocation.
* Test Sample: one named invitee, one Plus1 allocation, maximum attendance 2.
* Stable invites 1–57 baseline: 57 invitations and 115 maximum attendance.

**Synchronization Safety:**

The production Invitations sheet is a derived private registry and may be synchronized again after RSVP activity has begun.

Before any invitation replacement, the current private workbook snapshot is checked against the source-derived expected registry. Every party referenced by Current RSVPs, RSVP Versions, Submission Records, Delivery Records, or Resend Records must retain the same invitation code and the same complete private invitation configuration in the expected registry. A referenced invitation therefore cannot be changed or removed through the ordinary synchronization path.

Newly assigned invitations may be added. Existing invitations with no operational history may be corrected or removed; such changes are reported by the compatibility check.

The guarded synchronization sequence is:

1. Load and audit the private source.
2. Verify production environment, Google Sheets access, and exact RSVP-store schema.
3. Read a complete private pre-write workbook snapshot.
4. Verify compatibility of the expected invitation registry with all operationally referenced parties.
5. Write the private pre-load snapshot to the protected backup directory.
6. Replace only the `Invitations` registry with the complete expected functional production configurations.
7. Read a post-write snapshot.
8. Verify every non-invitation operational section is unchanged.
9. Verify the stored invitation registry exactly matches the current source-derived functional configurations.
10. If a post-backup synchronization or verification step fails, attempt to restore the prior Invitations rows from the pre-write snapshot.

Production readiness is read-only and performs the source audit, schema/access checks, and operational compatibility check. It does not require operational tables to be empty.

Independent post-load activation verification repeats the source audit, schema check, exact invitation-registry match, and operational-history compatibility check without modifying the workbook.

**Historical validation — September 20, 2026:** the initial production activation completed successfully with 57 invitation configurations while all five operational RSVP tables were empty. That condition is retained as a historical fact, not as a permanent synchronization prerequisite.

The procedure, generated production configuration, real codes, Test Sample code, guest identities, source-to-guest/allocation mappings, workbook identifier, raw `Kids(n)` mapping, and private snapshot contents remain private and outside public source control and frontend build output.

## CI-ADMIN-019 — Production RSVP Runtime and Deployment Readiness Procedure

**Content Item:**
The private production-startup, runtime-verification, single-writer, trusted-proxy, origin, and permanent-Test-Sample loopback-smoke procedure used before the guest-facing RSVP backend is opened publicly and for later controlled production verification.

**Status:**
Ready

**Source or Owner:**
Decisions 025–028; application; production deployment

**Visibility:**
Private

**Needed Before Launch:**
Yes

**Required Runtime Controls:**

* Production environment validation must fail closed unless the Google Sheets workbook, protected administrative recipient, Resend provider/key, approved sender name/address, approved Reply-To address, canonical public origin, bounded trusted-proxy setting, and explicit single-writer instance count are present.
* The canonical browser origin is `https://www.loreweavercreations.com`.
* The approved production email identity remains the Decision 025 Resend identity.
* Text Message confirmation remains disabled until its separate production gate is satisfied.
* `RSVP_WRITER_INSTANCE_COUNT` must equal `1` while Google Sheets remains the persistence adapter.
* Production startup must acquire an exclusive same-host writer lock before listening. The local lock supplements rather than replaces the global one-writer deployment requirement.
* The active Cloudflare Tunnel-to-Express topology uses a bounded loopback trust configuration. A topology change that inserts another proxy requires revalidation before production use.
* Production RSVP browser requests with an explicit mismatched `Origin` are rejected with a no-store `403`. Originless non-browser maintenance requests remain permitted.
* Runtime verification must confirm Google Sheets authentication/access, exact RSVP-store schema, Resend transport construction, and writer-lock acquisition/release without starting guest-facing traffic.
* Production loopback smoke must use the one authoritative permanent Test Sample rather than a real guest invitation.
* Before starting the loopback app, the smoke procedure must load and audit the private source, locate exactly one functional configuration classified as `recordRole: "test"` and `guestListEligible: false`, canonicalize the operator-supplied smoke code, and refuse to continue unless that code identifies the permanent Test Sample.
* The stored Test Sample configuration in Google Sheets must exactly match the authoritative source-derived Test Sample configuration before the API smoke request begins.
* The smoke app must bind only to `127.0.0.1` on an ephemeral port, verify the health endpoint, perform one blank-form lookup for the permanent Test Sample, verify the expected guest-facing response boundary and Test Sample roster/capacity/allocation shape, shut down, and prove the RSVP operational sections are unchanged.
* The Test Sample invitation code and smoke acknowledgement remain ephemeral operator inputs and must not be persisted in source control, ordinary project configuration, or logs.

**Historical validation — September 20, 2026:**

* The earlier production runtime readiness command returned `PASS`.
* Real Google Sheets authentication/access and RSVP-store schema verification succeeded.
* Real Resend configuration was accepted for transport construction without sending a message.
* The same-host writer lock was acquired and released successfully.
* The earlier production loopback smoke returned `PASS`, including HTTP 200 health and blank-form lookup results with no operational RSVP mutation.
* That historical smoke used a private real invitation code because the permanent Test Sample had not yet been established. The code remains intentionally absent from this repository.

Those results remain evidence that the deployment/runtime infrastructure worked under the earlier contract. Future production smoke runs must use only the permanent Test Sample.

**Notes:**
Passing runtime readiness and permanent-Test-Sample smoke establishes the applicable production verification state only. It does not itself enable a disabled delivery channel or alter guest RSVP data.

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
Decision 015 fixes the current substantive RSVP structure:

* coordinated event attendance/decline;
* explicit named-invitee Yes/No attendance;
* source-authorized Plus1 Yes/No questions;
* one grouped family-level unnamed-child Yes/No-plus-count control where `Kids(n)` applies;
* backend-derived `overallAttendance`;
* four age-category numerical dials equal to that derived total; and
* `Attendee Details` for every attendee with Reception-specific dietary/allergy information.

The grouped child behavior remains inside `additionalGuestResponses`; it does not create a separate child substantive region.

Confirmation method, applicable email address or SMS-capable mobile number, and required transactional text-message authorization remain allowed as operational contact/delivery fields rather than substantive RSVP questions.

## CI-EXCLUDE-011 — Unauthorized or Unmapped Named-Guest Attendance Controls

**Excluded Content:**
Named-person attendance controls that are invented by the frontend, derived from an unrelated invitation, or otherwise not backed by an object in the validated invitation's authorized `namedInvitees` roster.

**Status:**
Not applicable

**Reason:**
The corrected RSVP model does require one explicit Yes/No attendance control for every authorized named invitee. Those controls must be generated only from the limited safe `namedInvitees` roster returned after successful validation of that invitation code and keyed by stable opaque identifiers.

The exclusion therefore applies only to unauthorized, guessed, hard-coded, cross-party, or otherwise unmapped named-person controls. It does not exclude the required authorized `namedInviteeResponses` defined by Decision 015.

---

## CI-EXCLUDE-012 — Accessibility, Lodging, Transportation, Standalone Plus-One Name, and Message Questions

**Excluded Content:**
Accessibility questions, lodging questions, transportation questions, a standalone field asking for an additional guest's name as part of the `Plus1` authorization question, and a message-to-the-couple field within the RSVP.

**Status:**
Not applicable

**Reason:**
These items are not part of the spreadsheet-authoritative substantive RSVP structure established by Decision 015.

This exclusion does not prohibit the required `Attendee name` field in `Attendee Details`. Every attending person, including an attending authorized Plus 1, is identified there regardless of whether the party attends Ceremony only, Reception only, or both. Reception adds only the optional `Dietary or allergy information` field to each attendee row.

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

Before the invitation-launch version is published and printed invitations are mailed, confirm that:

* Every item marked **Needed Before Launch: Yes** is either Ready or has an explicitly approved temporary substitute.
* The invitation-launch website is operational and tested before invitation mailing begins.
* Complete public content exists for both approved event configurations and only one is active/guest-facing at a time.
* Schedule, venue, hotel, deadline, countdown, assistance, printed-response, navigation, accessibility, privacy, and external-link content remain consistent with their governing entries above.
* The authoritative private `Invitees List` contains 68 numbered source rows, 68 unique normalized source codes, and a valid Invite 1–68 sequence.
* Invites 1–57 remain the established assigned guest-list baseline; invites 58–67 are exact reserved placeholders unless deliberately populated; Invite 68 is the permanent Test Sample.
* The current source produces 58 functional production configurations: 57 guest-list eligible and one permanent test identity.
* The ten current reserved placeholder rows produce no functional production invitation.
* Production transformation maps reviewed party heading, source wording mode, `maximumAttendance`, complete `namedInvitees` roster, exact Plus1 allocations, grouped `Kids(n)` authorization, and private record classification without exposing production codes, unrelated identities, raw source-row identifiers, Test Sample code, or private transformation mappings publicly.
* The established invites 1–57 guest-list baseline audit is:
  * 35 singular and 22 plural wording records;
  * 84 specifically named potential attendees;
  * 23 invitations with at least one allocation;
  * 26 Plus1 allocation objects;
  * two invitations containing `Kids(n)`;
  * five total unnamed-child person-capacity slots;
  * two grouped `unnamedChildren` allocation objects;
  * 28 total allocation objects;
  * 31 total additional-guest person-capacity slots;
  * four invitations with multiple allocation objects;
  * combined guest-list maximum-attendance capacity 115.
* The permanent Test Sample is excluded from guest-list counts, contains one named invitee plus one Plus1 allocation, and has maximum attendance 2.
* Current functional combined maximum attendance is 117.
* Every functional production configuration satisfies:

  `namedInvitees.length + sum(additionalGuestAllocations.maximumCount) === maximumAttendance`

* Every public-safe allocation object exposes only `id`, `kind`, `prompt`, and `maximumCount`.
* Private `recordRole` and `guestListEligible` values never cross the guest-facing lookup boundary.
* Production readiness verifies source audit, schema/access, and compatibility with all operationally referenced invitations; operational RSVP tables do not need to be empty.
* Guarded invitation synchronization creates a private pre-load snapshot, changes only the Invitations registry, verifies operational sections remain unchanged, verifies an exact source-derived functional registry match, and attempts invitation rollback after a post-backup failure.
* Invitations already referenced by Current RSVPs, RSVP Versions, Submission Records, Delivery Records, or Resend Records cannot be changed or removed by ordinary synchronization.
* Newly populated reserve invitations may be added after RSVP activity has begun when all operationally referenced invitation configurations remain unchanged.
* Independent post-load activation verification confirms the exact current functional invitation registry and operational-history compatibility.
* Production runtime readiness is rerun after registry changes where required.
* Production blank-form loopback smoke uses only the permanent Test Sample, verifies that the stored test configuration matches the authoritative source, and proves operational RSVP sections are unchanged.
* September 20 activation/runtime results remain historical evidence only; they are not substitutes for the current source/synchronization/Test Sample gates.
* The homepage correctly supports guests arriving through the static invitation QR code, including any later printed invitation created from an assigned reserve code.
* Guests access RSVP through `/wedding/rsvp/` and manually enter their code; no code-bearing personalized URL is implemented.
* Every validated RSVP form loads blank and displays no stored answers or confirmation destinations.
* Initial submissions require every field needed for a complete valid result.
* Revisions re-enter confirmation information and submit only RSVP replacements required by the intended change and dependency rules.
* Omitted RSVP fields remain unchanged; explicit numeric zero is preserved where valid; backend dependency rules clear data made inapplicable. No generic client substantive `clear` operation is required.
* Every named invitee receives one authorized Yes/No control.
* Every Plus1 allocation receives one authorized Yes/No control and has `maximumCount: 1`.
* Every applicable invitation with `Kids(n)` receives exactly one grouped child question using:
  `We'd love for your family to celebrate with us this Mayday - will your kid(s) be accompanying you?`
* Grouped child No records count 0 and hides/makes inapplicable the count selector.
* Grouped child Yes requires a whole-number selection from 1 through that allocation's `maximumCount`.
* No one-question-per-unnamed-child UI remains.
* No separately named child is duplicated into grouped child capacity.
* `overallAttendance` is derived as named-invitee Yes count + Plus1 Yes count + grouped unnamed-child attending count.
* The four age-category dials sum exactly to derived `overallAttendance`.
* Every attending RSVP renders exactly one `Attendee Details` row per derived attendee, including every child represented by the grouped count.
* Actual names of attending Plus1s and unnamed children are collected only in `Attendee Details`.
* Ceremony-only attendance preserves attendee names and omits dietary/allergy information.
* Removing Reception preserves attendee names and clears dietary/allergy values only.
* Any grouped child response/count change requires complete attendee-detail replacement.
* Same-count attendee identity swaps require complete attendee-detail replacement.
* The RSVP asks no unauthorized named-person controls, standalone Plus1/child name during allocation authorization, accessibility details, lodging plans, transportation needs, message-to-couple field, entrée selections, separate child substantive region, or other unapproved substantive question.
* The online form collects only the confirmation method/destination and required transactional authorization needed for the enabled confirmation channel.
* Every successful response is stored before guest/admin confirmation delivery.
* Guest/admin confirmation attempts remain independent.
* Guest confirmations contain the complete current guest-facing RSVP, including named responses, Plus1 responses, grouped child Yes/No and attending count where applicable, derived attendance, age totals, attendee names, and Reception-specific dietary/allergy information.
* Administrative confirmations contain the same applicable current RSVP plus permitted operational confirmation information without unrelated party data.
* Delivery failures do not undo or duplicate a stored RSVP.
* Submission-uncertain and service-unavailable copy remain distinct and do not encourage unnecessary duplicate submissions.
* Manual resend reproduces the current RSVP without modifying substantive RSVP state/version.
* On-screen confirmation and refresh fallback remain within the approved temporary-state privacy boundary.
* The concise privacy notice and full `/wedding/privacy` page accurately describe named-invitee responses, Plus1 responses, grouped child count behavior, attendee names, dietary information, confirmation contact data, blank forms, revisions, retention, and safeguards.
* Real-guest RSVP-operational data can be retired without requiring deletion of the permanent Test Sample configuration or retention of old Test Sample response history.
* RSVP entry and confirmation experiences remain non-indexed.
* Private invitation records, raw `Kids(n)` mappings, credentials, administrative notes, confirmation destinations, and RSVP answers remain outside the public frontend.
