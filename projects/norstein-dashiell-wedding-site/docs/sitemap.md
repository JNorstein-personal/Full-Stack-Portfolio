# Loreweaver Creations Wedding Website Sitemap

## Purpose

This document defines the complete browser-facing information architecture for the Loreweaver Creations wedding website.

It establishes:

- The hierarchy of public pages beneath `/wedding/`.
- The relationship between public, conditionally personalized, temporary personalized, and private administrative information.
- The approved sticky primary-navigation order.
- The sole manual-entry RSVP path.
- The boundary between ordinary pages and RSVP states.
- The location of error, closed, unavailable, uncertain-submission, delivery-warning, and not-found experiences.
- The pages controlled by the centralized active-event configuration.
- The separation between invitation-launch and post-wedding content.

This sitemap must remain consistent with:

- `docs/requirements.md`
- `docs/decisions.md`
- `docs/content-inventory.md`
- `docs/route-inventory.md`
- `docs/page-outlines.md`
- `docs/wireframes.md`
- `docs/link-inventory.md`
- `docs/rsvp-system-design.md`

Backend API endpoints, private spreadsheet structures and records, form-schema objects, source-to-configuration transformation details, and implementation code are outside the scope of this document. This sitemap records only the browser-facing consequences of the approved private invitation configuration model.

---

# Application Root

The wedding website is a contained application hosted at:

`https://www.loreweavercreations.com/wedding/`

All canonical browser routes begin with:

`/wedding/`

Invitation codes, guest identities, RSVP answers, email addresses, mobile numbers, and confirmation details must not appear in:

- Browser paths.
- Query strings.
- URL fragments.
- Public page metadata.
- Analytics events.
- Search-engine-visible content.

The production browser responses for `/wedding/rsvp/` and
`/wedding/rsvp/confirmation` use `Cache-Control: no-store, max-age=0`.
This is a browser/privacy boundary, not a separate page or route.

Invitation codes are limited access tokens rather than passwords. The
browser-facing application provides no public guest directory, public
code-recovery search, fuzzy/close-match suggestion, saved-RSVP route, or
RSVP-history route.

---

# Top-Level Sitemap

```text
/wedding/
├── Home
├── RSVP
│   ├── Public invitation-code entry state
│   ├── Invitation lookup-in-progress state
│   ├── Invalid-code state
│   ├── Validated blank personalized-form state
│   │   ├── Coordinated Ceremony / Reception / decline controls
│   │   ├── Authorized named-invitee attendance questions
│   │   │   └── One control per safe namedInvitees roster entry
│   │   ├── Authorized additional-guest allocation controls
│   │   │   ├── Plus 1 Yes/No prompts where authorized
│   │   │   └── One grouped unnamed-children family prompt where source-authorized
│   │   │       └── Conditional child-count selector after Yes
│   │   ├── Derived Total Attending Party
│   │   ├── Four coordinated attendance-category numerical dials
│   │   ├── Attendee Details region
│   │   │   └── Repeated once per person in derived overallAttendance
│   │   └── Operational confirmation fields
│   ├── Submission-in-progress state
│   ├── Validation-failure state
│   ├── Submission-uncertain state
│   ├── RSVP-service-unavailable state
│   ├── Closed-RSVP state
│   └── Confirmation
│       ├── Successful initial-submission state
│       ├── Successful revision state
│       ├── Guest-delivery-warning state
│       ├── Administrative-delivery-warning state
│       └── Refresh-without-temporary-state fallback
├── Theme and Attire
├── Our Story
├── Read, Listen, and Watch
├── Venues
├── Travel
├── Schedule
├── Frequently Asked Questions
├── Gallery
│   ├── Invitation-launch Coming Soon state
│   └── Post-wedding published-gallery state
├── Privacy
└── Wedding-Site Not Found
```

The RSVP regions listed beneath the validated blank form are controlled portions of one reusable RSVP experience. They are not separate browser routes or invitation-specific pages.

Invitation-specific variation is limited to the reviewed form heading, explicit singular/plural wording mode, `maximumAttendance`, the validated invitation's safe `namedInvitees` roster, and zero or more authorized `additionalGuestAllocations` returned after valid lookup. Each safe allocation exposes only `id`, `kind`, `prompt`, and `maximumCount`. A `plus1` allocation represents one person and always has `maximumCount: 1`. An applicable `unnamedChildren` allocation represents the complete source-authorized unnamed-child capacity for that invitation and renders one family-level Yes/No question plus a conditional count selector after Yes.

`Attendee Details` is response-dependent rather than invitation-specific routing. Whenever the party is attending Ceremony, Reception, or both, it repeats exactly once per person in backend-derived `overallAttendance`. Each row always requires an attendee name; `Dietary or allergy information` appears only when Reception is selected.

---

# Canonical Browser Routes

| Route | Destination | Visibility | Primary Navigation | Search Indexing |
|---|---|---|---:|---:|
| `/wedding/` | Home | Public | Yes | Yes |
| `/wedding/rsvp/` | RSVP entry and validated blank RSVP form | Public, then conditionally personalized | Yes | No |
| `/wedding/rsvp/confirmation` | Temporary successful-submission confirmation | Personalized | No | No |
| `/wedding/theme` | Theme and Attire | Public | Yes | Yes |
| `/wedding/story` | Our Story | Public | Yes | Yes |
| `/wedding/read-listen-watch` | Read, Listen, and Watch | Public | Yes | Yes |
| `/wedding/venues` | Active venue information | Public | Yes | Yes |
| `/wedding/travel` | Hotel, parking, and transportation information | Public | Yes | Yes |
| `/wedding/schedule` | Active guest schedule | Public | Yes | Yes |
| `/wedding/faq` | Frequently Asked Questions | Public | Yes | Yes |
| `/wedding/gallery` | Coming Soon or approved post-wedding gallery | Public | Yes | Yes |
| `/wedding/privacy` | Full RSVP privacy notice | Public | Yes | Yes |
| `/wedding/not-found` | Wedding-site error page | Public error state | No | No |
| Any unmatched `/wedding/*` route | Wedding-site not-found experience | Public error state | No | No |

---

# Primary Navigation

The compact sticky primary navigation uses this order:

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

## Navigation behavior

The primary navigation must:

- Remain available while scrolling on desktop and mobile layouts.
- Keep RSVP access prominent.
- Use a clearly labeled mobile-menu control.
- Work with keyboard and touch input.
- Close the mobile menu after a destination is selected.
- Avoid obscuring headings, form controls, validation messages, focused controls, or other essential content.
- Identify the current page where practical.

## Supplemental navigation

RSVP must also appear:

- As a prominent action on Home.
- In the site footer.
- Where contextually appropriate on Schedule and FAQ.

Privacy must also appear:

- In the site footer.
- In the concise privacy notice on the public RSVP entry state.
- In the concise privacy notice on the validated RSVP form state.

Internal links beneath `/wedding/` open in the same tab.

External media, hotel, and map links open in a new tab and must be identified accessibly.

---

# Public Content Boundary

Public content is available without validating an invitation code.

## Public pages and information

Public content includes:

- The couple’s names.
- Wedding date.
- General wedding location.
- Welcome information.
- Theme and attire guidance.
- Our Story.
- Lawful book, audiobook, and film resource links.
- The currently active venue configuration.
- Travel and hotel-block information approved for publication.
- The currently active guest schedule.
- Frequently Asked Questions.
- Gift guidance.
- The pre-wedding Gallery Coming Soon page.
- Approved post-wedding photographs and videos after publication review.
- The full RSVP Privacy page.
- General RSVP instructions.
- The RSVP deadline.
- The final-month countdown when active.
- Printed RSVP alternatives.
- RSVP assistance information.
- Guest-safe error, closed, unavailable, and recovery messages.

## Public RSVP entry information

Before code validation, `/wedding/rsvp/` may display:

- Instructions for locating and entering the printed code.
- The example format `XXX-XXX`.
- The static-QR-code explanation.
- The written deadline.
- The countdown during the approved final month.
- The printed RSVP alternative.
- `RSVPhelp@loreweavercreations.com`.
- A concise privacy notice.
- A link to `/wedding/privacy`.
- Neutral validation and service-status messages.

## Public-content exclusions

Public content must not include:

- A guest directory.
- Invitation greetings before validation.
- Invitation codes other than the generic example format.
- Another party’s identity or configuration.
- Stored RSVP answers.
- Stored confirmation destinations.
- Private spreadsheet data.
- Administrative notes.
- Credentials or provider configuration.
- Publicly hosted copyrighted copies of the thematic book, audiobook, or movie.
- A gift registry.
- Private setup schedules.
- Wedding-party-only instructions.

---

# Conditionally Personalized RSVP Content

Personalized RSVP content is available only after the backend validates a manually entered invitation code.

The validated form remains at:

`/wedding/rsvp/`

The browser must not navigate to a code-bearing route.

## Permitted personalized configuration

After validation, the browser may receive only the information needed to render the authorized blank form, including:

- The reviewed invitation or household form heading.
- Explicit singular “I” or plural “We” wording mode.
- `maximumAttendance` as the invitation's potential-party capacity.
- The validated invitation's limited safe `namedInvitees` roster.
  - Each named invitee is represented only by a stable opaque identifier and approved guest-facing `displayName`.
  - Specifically named children use this same roster and attendance-control mechanism as other specifically named invitees.
- Zero or more authorized `additionalGuestAllocations`.
  - Each allocation exposes only:
    - stable opaque `id`;
    - safe `kind`;
    - reviewed guest-facing `prompt`; and
    - positive whole-number `maximumCount`.
  - A `plus1` allocation uses `kind: "plus1"`, always has `maximumCount: 1`, and may use a prompt such as `Will [Named Invitee] be accompanied by a +1?`
  - An applicable grouped child allocation uses `kind: "unnamedChildren"` and the approved prompt:
    `We'd love for your family to celebrate with us this Mayday - will your kid(s) be accompanying you?`
  - A grouped child allocation's `maximumCount` is the complete reconciled number of unnamed children authorized for that invitation.
- The reusable approved question definitions, labels, instructions, display conditions, and validation constraints.
- The information needed to support initial-submission versus revision processing without displaying stored answers.

The browser must not infer wording mode, capacity, named-invitee authorization, Plus 1 eligibility, grouped-child authorization, allocation `kind`, child `maximumCount`, or source meaning from guest names, party-display text, `maximumAttendance`, allocation-array length, or other client-visible information. It renders only the limited values returned for the validated invitation.

The browser does not receive the source spreadsheet row, source-column metadata, raw `Kids(n)` source text, unrelated invitee information, other invitation records, source-only allocation mappings, or a public code-to-guest mapping.

Every valid invitation configuration satisfies:

`namedInvitees.length + sum(additionalGuestAllocations.maximumCount) = maximumAttendance`

Allocation-object count is therefore not person capacity. One grouped child allocation may authorize more than one child.

The browser may rely on the already validated configuration for presentation but must not reconstruct, repair, infer, or invent a missing attendee slot itself.

## Required blank-form behavior

The personalized form must always load blank, even when an RSVP already exists.

It must not display:

- Prior Ceremony or Reception selections.
- Prior decline status.
- Prior named-invitee Yes/No responses.
- Prior additional-guest responses, including any grouped child Yes/No and selected count.
- Prior age-category attendance totals.
- Prior derived `overallAttendance`.
- Prior attendee names.
- Prior per-attendee dietary/allergy responses.
- Prior email address.
- Prior mobile number.
- Prior confirmation method.
- Prior confirmation-delivery status.
- Any stored-response indicator.

The blank-form rule does not prevent the browser from displaying the invitation-specific configuration needed to construct the form, such as the reviewed heading, wording mode, `maximumAttendance`, safe named-invitee roster, and authorized allocation `id`, `kind`, `prompt`, and `maximumCount` values.

## Initial-submission content

For an invitation without a stored response, the form must collect all information required to construct one complete valid RSVP under the single approved substantive structure:

1. A valid Ceremony, Reception, Ceremony-plus-Reception, or full-decline decision.
2. When attending, one explicit Yes/No `namedInviteeResponses` decision for every authorized `namedInvitees` entry.
3. When attending, one complete `additionalGuestResponses` value for every authorized allocation:
   - `plus1`: `"yes"` or `"no"`;
   - `unnamedChildren`: `{ "attending": "yes", "count": k }` where `k` is 1 through `maximumCount`, or `{ "attending": "no", "count": 0 }`.
4. All four attendance-category totals when attending; their complete sum must equal backend-derived `overallAttendance`.
5. Exactly one `Attendee Details` record per attending person, including Ceremony-only attendance and each child represented by the grouped count.
6. A required attendee name in every attendee-detail record.
7. Optional `Dietary or allergy information` within each attendee record only when Reception is selected.
8. Operational confirmation information required for the selected enabled confirmation method.

A party with no authorized additional-guest allocations receives no additional-guest controls and cannot submit `additionalGuestResponses`.

## Revision content

For an invitation with a stored response, the blank form must explain that:

- The guest re-enters the required operational confirmation fields, including the selected confirmation method, the applicable email address or SMS-capable mobile number, and any required transactional text-message authorization.
- The guest submits only the substantive regions intended to change.
- A submitted `replace` operation replaces the applicable stored value or region according to that region's contract.
- An omitted applicable RSVP region means only “leave the stored value unchanged,” unless a controlling dependency makes the stored value inapplicable or requires a complete replacement.
- Explicit zero is an ordinary replacement value for an age-category total.
- Newly submitted operational confirmation fields replace the stored confirmation method, destination, and applicable authorization state.
- The backend merges submitted changes with the current stored response, applies dependency clearing required by the resulting state, and validates the complete result.
- A full decline automatically clears named-invitee responses, additional-guest responses, attendance totals, derived attendance, and `Attendee Details`.
- A transition from decline to attendance makes complete named-invitee responses, complete additional-guest responses, complete age totals, and complete attendee details newly applicable.
- Removing Reception while Ceremony attendance remains preserves attendee names and the attendee-detail list but clears Reception-specific dietary/allergy values.
- Adding Reception without changing who is attending preserves existing attendee names; dietary/allergy information becomes available but remains optional.
- Any named-invitee or Plus 1 response change that changes who is attending requires complete replacement of `Attendee Details`, even if numeric `overallAttendance` does not change.
- Any grouped unnamed-child response/count change requires complete replacement of `Attendee Details` because the identities represented by previously unnamed child rows cannot safely be presumed unchanged.
- Any change that produces a different `overallAttendance` requires a complete attendee-detail list with exactly the new number of records.
- The complete updated RSVP is sent in the next confirmation.

The public revision contract does not use a generic client `clear` operation. Inapplicable data is cleared by the backend's dependency rules, while applicable submitted regions use their defined replacement semantics.

## Approved reusable substantive structure

The production system uses one reusable substantive RSVP structure rather than invitation-selected question profiles.

### Attendance and decline

The attendance region provides three coordinated choices:

- Ceremony.
- Reception.
- `Regretfully, I am unable to attend` for singular wording; or
- `Regretfully, we are unable to attend` for plural wording.

Ceremony and Reception may be selected together. Selecting either attending option disables the decline choice; selecting decline disables Ceremony and Reception. The backend independently enforces the same mutual-exclusion rule.

The event-attendance region establishes which portion or portions of the wedding the attending party will attend. It does not determine which individual people are attending.

### Authorized named-invitee attendance questions

When the party is attending, render one explicit Yes/No question for every object in `invitation.namedInvitees`.

Each control:

- Uses the backend-authorized opaque invitee ID as the submission key.
- Uses the approved `displayName` only as guest-facing presentation text.
- Accepts exactly Yes or No.
- Does not expose or infer private source-row identifiers.
- Applies equally to specifically named adults and specifically named children.

On an initial attending response or a transition from decline to attendance, every authorized named invitee requires an explicit response.

### Authorized additional-guest allocation controls

When the party is attending, render one control instance for every object in `invitation.additionalGuestAllocations`, using the behavior authorized by that allocation's `kind`.

Every allocation:

- Uses the backend-authorized opaque allocation `id` as the submission key.
- Uses its reviewed backend-supplied `prompt` for presentation.
- Exposes only the safe `kind` and positive whole-number `maximumCount` needed to render the authorized control.
- Does not request an attending additional person's actual name in the allocation control itself.

Two authorized variants exist.

#### Plus 1 allocation

A `kind: "plus1"` allocation:

- Always has `maximumCount: 1`.
- Renders one independent Yes/No question using a reviewed prompt such as `Will [Named Invitee] be accompanied by a +1?`
- Stores `"yes"` or `"no"` in `additionalGuestResponses`.
- Contributes one person to derived `overallAttendance` when Yes and zero when No.
- Collects the attending Plus 1's actual name later through ordinary `Attendee Details`.

#### Grouped unnamed-children allocation

An invitation with source-authorized unnamed children contains at most one `kind: "unnamedChildren"` allocation.

It renders exactly one family-level Yes/No question:

`We'd love for your family to celebrate with us this Mayday - will your kid(s) be accompanying you?`

When No is selected:

- the child-count selector is hidden or otherwise inapplicable;
- the canonical response is `{ "attending": "no", "count": 0 }`;
- the allocation contributes zero attendees.

When Yes is selected:

- reveal one required dropdown;
- the available choices are the consecutive whole numbers from `1` through that allocation's `maximumCount`;
- the canonical response is `{ "attending": "yes", "count": k }`;
- the validated selected count contributes directly to derived `overallAttendance`.

The grouped child question is not repeated once per child.

A specifically named child remains a normal `namedInvitees` roster entry and must not also be represented by grouped unnamed-child capacity.

If one or more unnamed children attend, their actual names are collected later through ordinary `Attendee Details`, one record per attending child.

### Derived actual attendance and attendance totals by age category

When the party is attending, the backend derives:

`overallAttendance = named-invitee Yes count + Plus 1 Yes count + grouped unnamed-child attending count`

`overallAttendance` is not an independent browser-editable field. It must be at least 1 for an attending RSVP and may never exceed `maximumAttendance`.

The form then uses four coordinated numerical dials:

1. Adults, ages 21 and older.
2. Young Adults, ages 18–20.
3. Children, ages 3–17.
4. Children under 3.

Each dial:

- Uses a nonnegative whole-number value.
- Begins at zero on a blank form.
- Is coordinated with the other three values against derived `overallAttendance`.
- Must participate in a complete four-category sum equal to derived `overallAttendance` exactly.

The browser may implement each current dial maximum as derived `overallAttendance` minus the values already assigned to the other three categories, or another equivalent interface rule. The backend independently validates the exact final equality.

Changing a named-invitee response, Plus 1 response, or grouped child response/count can change derived `overallAttendance`; the age-category values must then be brought into exact agreement with that new derived count.

### Attendee Details

`Attendee Details` applies whenever the party is attending Ceremony, Reception, or both.

The form renders exactly one attendee-detail record for each person represented by derived `overallAttendance`.

Each record contains:

- **Attendee name**
  - Required.
  - Maximum 100 characters.
- **Dietary or allergy information**
  - Shown only when Reception is selected.
  - Optional when shown.
  - Maximum 1000 characters.

The attendee-detail list therefore contains the names of every attending person, including specifically named invitees, attending Plus 1 guests, and each child represented by a grouped unnamed-child attending count.

Ceremony-only attendance retains the attendee-detail list and required attendee names but does not display or accept dietary/allergy information.

Removing Reception while Ceremony remains selected preserves attendee names and clears only dietary/allergy values. A full decline clears the complete attendee-detail list with the other attendance-dependent substantive data.

When named-invitee or Plus 1 attendance changes the identity composition of the party, the complete attendee-detail list must be replaced even if numeric `overallAttendance` remains unchanged. Any grouped child response/count change also requires complete replacement because previously unnamed child identities cannot safely be mapped onto stored rows.

## Operational confirmation fields

The online form must collect the operational delivery fields required for the confirmation methods currently enabled in centralized production configuration.

Email is an approved production confirmation method.

Text Message is part of the reusable RSVP schema vocabulary but may be advertised and accepted in production only after the finalized Step 14 SMS-provider disclosure and enablement gate is satisfied. Until then, the Text Message choice is omitted rather than shown with invented provider-specific copy.

For every initial submission and revision, the form collects:

- Confirmation method.
- Email address when Email is selected.
- SMS-capable mobile number when an enabled Text Message option is selected.
- Transactional text-message authorization where required by the enabled SMS process.

The form does not display previously stored operational confirmation values. During a revision, the newly submitted confirmation method, destination, and applicable authorization state replace their stored counterparts.

These are operational delivery fields rather than additional substantive wedding-planning questions.

## Personalized-content exclusions

The RSVP form must not collect:

- Per-person Ceremony-versus-Reception event selections beyond the approved party-level event-attendance control.
- A standalone field asking for a Plus 1 guest's name within the Plus 1 authorization question.
- A standalone field asking for an unnamed child's name within the grouped unnamed-children authorization question.
- A separate Yes/No question repeated once per authorized unnamed child.
- Accessibility details.
- Lodging plans.
- Transportation needs.
- A message to the couple.
- Entrée selections.
- Any other unapproved substantive question.

These allocation-question name exclusions do not prohibit the required attendee-name field within ordinary `Attendee Details`. If an authorized Plus 1 or one or more previously unnamed children attend, each attending person's actual name is supplied there.

---

# Temporary Confirmation Content

Temporary confirmation content appears only after the backend successfully records an initial RSVP or merged revision. Storage must be complete before either confirmation-delivery attempt begins.

After storage, the guest-confirmation attempt and protected administrative-email attempt proceed independently. Failure, delay, or uncertainty affecting one delivery category must not prevent the other applicable attempt, roll back the stored RSVP, or create another RSVP version.

The canonical confirmation route is:

`/wedding/rsvp/confirmation`

## Permitted confirmation content

The page may display the complete current guest-facing RSVP, including:

- Whether the action was an initial submission or revision.
- Ceremony selection.
- Reception selection.
- Decline status.
- Each applicable authorized named-invitee Yes/No response.
- Each applicable authorized additional-guest response using its guest-safe prompt.
  - Plus 1 allocations display their Yes/No response.
  - A grouped unnamed-children allocation displays the family-level Yes/No response and selected child count when Yes.
- Backend-derived `overallAttendance` when attending.
- Adults age 21 and older.
- Young Adults ages 18–20.
- Children ages 3–17.
- Children under 3.
- The complete current attendee-name list for every attending response.
- When Reception is selected, each attendee's dietary/allergy response where supplied.
- Submission or revision timestamp.
- Selected guest confirmation method.
- Guest delivery-attempt status.
- Limited administrative email-attempt status without exposing the private administrative address.
- Revision instructions.
- Deadline.
- Assistance information.

When the invitation has no authorized additional-guest allocation, the confirmation must not invent an additional-guest response row.

When Reception is not selected, the confirmation retains attendee names but must not invent dietary/allergy placeholders, zero-value rows, or “not applicable” entries.

A full decline confirmation contains the decline result and operational confirmation information but does not retain stale named-invitee responses, additional-guest responses, age-category totals, derived `overallAttendance`, or attendee details.

## Confirmation boundary

The page must not display:

- Spreadsheet row numbers or source-column notes.
- Internal record identifiers.
- Private administrative notes.
- Provider credentials.
- Another party's information.
- Invitation codes in the URL.
- Private source configuration that is not necessary to explain the submitting party's own recorded RSVP.
- Raw source `Kids(n)` text, source-only allocation mappings, or private allocation/source metadata beyond the safe `id`, `kind`, `prompt`, and `maximumCount` already applicable to the validated party.
- Debugging details.

## Refresh fallback

Confirmation details do not need to survive a browser refresh.

When temporary confirmation state is unavailable, the page must:

- Explain that the on-screen summary is no longer available.
- Explain that the RSVP may already have been processed.
- Direct the guest to consult the selected email or text-message confirmation.
- Link back to `/wedding/rsvp/`.
- Provide assistance information.
- Avoid instructing the guest to resubmit solely because the summary disappeared.

---

# Private Administrative Boundary

Private administrative content is not part of the public sitemap and must not be exposed through public React routes.

The initial administrative interface is the private Google Sheets workbook and documented server-side operations.

## Private content includes, while required by the active RSVP system and subject to the finalized Step 14 retirement schedule:

- Complete invitation records.
- Active and disabled invitation codes.
- Reviewed invitation/form headings.
- Wording mode.
- Maximum party size.
- Complete specifically named `namedInvitees` rosters.
- Zero or more authorized `additionalGuestAllocations` for each invitation, including one-person Plus 1 allocations and at most one grouped unnamed-children allocation where applicable.
- Stable private allocation identifiers, allocation kinds, authorized `maximumCount` values, and the source/configuration context needed to construct reviewed guest-facing prompts.
- Current RSVP responses.
- Superseded response versions or revision history.
- Ceremony/Reception/decline state.
- Current named-invitee Yes/No responses.
- Current additional-guest responses, including Plus 1 Yes/No values and grouped child Yes/No plus selected count.
- Current four-category attendance totals and backend-derived `overallAttendance`.
- Current attendee-detail records for every attending RSVP, including attendee names and Reception-specific dietary/allergy information where applicable.
- Email addresses.
- Mobile numbers.
- Confirmation methods.
- Transactional SMS authorization records where required.
- Private production-source transformation and validation records.
- Submission timestamps.
- Update timestamps.
- Version numbers.
- Guest confirmation-delivery records.
- Administrative confirmation-delivery records.
- Manual resend status.
- Private correction notes.
- Test and production environment controls.
- Service-account and provider configuration.

The private administrative system may retain source fields needed to reproduce and audit the authoritative transformation, including the distinction among specifically named invitees, Plus 1 allocations, raw `Kids(n)` authorization, and grouped unnamed-child capacity. Source-column structure and unrelated private source values must not be exposed as public browser content.

## Administrative email content

The approved administrative confirmation may contain the complete current RSVP, including:

- Ceremony/Reception/decline state.
- Every applicable authorized named-invitee response.
- Every applicable authorized additional-guest response, including grouped child attending count where applicable.
- Backend-derived `overallAttendance` and all four attendance-category totals when attending.
- The complete attendee-name list for every attending response.
- When Reception is selected, supplied per-attendee dietary/allergy information.
- Guest confirmation method and destination.
- Submission/revision and version information required for administration.

The administrative confirmation is sent only to the couple's protected administrative email destination.

It must not manufacture named-invitee or additional-guest responses that are not authorized for the invitation, and it must not retain stale attendance-dependent data after dependency clearing.

Administrative content must not be exposed through:

- A public dashboard.
- Public share links.
- Frontend source files.
- Browser URLs.
- Public logs.
- Analytics services.
- Public source control.

---

# Phase 3 Step 14 Browser-Facing Privacy and Security Boundary

The finalized Step 14 privacy/security rules do not add a new browser
route. They constrain the existing RSVP information architecture.

For `/wedding/rsvp/` and `/wedding/rsvp/confirmation`:

- Production responses use `Cache-Control: no-store, max-age=0`.
- Personalized RSVP data is not intentionally persisted in browser storage
  solely to reconstruct the temporary confirmation after Step 13 state is
  lost.
- Transactional RSVP/confirmation states remain non-indexed.
- Personalized values are excluded from metadata and analytics.
- Analytics, if used, is non-personalized and is not required for RSVP
  operation.
- Guest-facing error and fallback experiences do not expose internal
  infrastructure, private workbook details, provider secrets, protected
  administrative addresses, or close-match invitation information.
- Text Message is displayed as a confirmation option only when centralized
  production configuration reports that the finalized SMS-provider gate is
  satisfied.
- Mobile numbers collected for RSVP confirmation are transactional-only
  under the approved rule.
- Attendee names for every attending RSVP and Reception-specific per-attendee
  dietary/allergy information remain personalized RSVP data and are excluded
  from public metadata, analytics, and ordinary logs.

The public `/wedding/privacy` page remains indexable and explains the
finalized collection, access, data-minimization, SMS-gate, retention, and
security-limitation policies.

---

# Active Event Configuration Boundary

The following pages depend on one centralized active-event configuration:

- Home.
- Venues.
- Travel.
- Schedule, limited to the confirmed outer event blocks and approved broad reception description.
- FAQ, including the flexible reception structure and any confirmed beverage information.

The centralized configuration must control both the confirmed outer event blocks and the approved reception-description policy.

## Configuration A

**Warinanco Park ceremony and Sphinx reception**

- Ceremony:
  - Saturday, May 1, 2027.
  - 10:30 a.m. to 12:00 p.m.
  - Warinanco Park, Roselle, NJ 07036.
- Guest transition between venues:
  - 12:00 p.m. to 12:30 p.m.
  - This is travel or transition time, not a separately scheduled cocktail hour.
- Reception:
  - Saturday, May 1, 2027.
  - 12:30 p.m. to 4:30 p.m.
  - Sphinx Banquet and Catering Center.
  - 121 E 2nd Avenue, Roselle, NJ 07203.
  - Buffet-style brunch remains available throughout the reception.
  - Dancing and other festivities may occur at various intervals during the reception.

## Configuration B

**Ceremony and reception entirely at Sphinx**

- Saturday, May 1, 2027.
- One combined ceremony-and-reception event block from 11:30 a.m. to 4:30 p.m.
- Sphinx Banquet and Catering Center.
- 121 E 2nd Avenue, Roselle, NJ 07203.
- The public website must not invent a separate ceremony-ending or reception-starting time within this combined block.
- Buffet-style brunch remains available throughout the reception portion of the event.
- Dancing and other festivities may occur at various intervals during the reception.

## Shared reception-description policy

The public site may use broad wording such as:

> Buffet brunch, dancing, and other festivities will take place during the reception.

The active configuration must not create or imply:

- A separately scheduled formal cocktail hour.
- A separately scheduled formal dinner service.
- A fixed dancing period.
- Exact public times for first dances, toasts, speeches, cake service, photographs, buffet activity, or other flexible reception activities.
- A detailed internal reception run-of-show.
- A confirmed self-service mimosa station before the couple and Sphinx Banquet and Catering Center finalize the arrangement.

If the mimosa station is later confirmed, the active configuration may describe it broadly as available during the reception unless a later recorded decision establishes a more specific service window.

## Publication rule

Both configurations must be complete before launch.

Only one may be active and guest-facing at a time.

The site must not mix:

- Venue names.
- Addresses.
- Ceremony times.
- Reception or combined-event times.
- Parking instructions.
- Map links.
- Arrival guidance.
- Weather instructions.
- Reception-description wording.
- Buffet-service wording.
- Mimosa-station confirmation status.
- Transportation or transition guidance.

Configuration B must be activatable promptly if:

- Warinanco Park approval is not received.
- Inclement weather prevents the outdoor ceremony.
- The approved fallback otherwise becomes necessary.

The public Schedule page remains one stable route under either configuration. Switching configurations changes its content state rather than creating another route.

---

# Invitation-Launch and Post-Wedding Boundaries

## Invitation-launch sitemap

The invitation-launch version includes:

- Home.
- RSVP entry and validated blank form.
- RSVP confirmation.
- Theme and Attire.
- Our Story.
- Read, Listen, and Watch.
- Venues.
- Travel.
- Schedule.
- FAQ.
- Gallery in the Coming Soon state.
- Privacy.
- Wedding-site Not Found.
- All required RSVP error and transitional states.

## Post-wedding sitemap

The public route structure does not require new top-level pages merely because post-wedding material becomes available.

The existing Gallery route may transition from Coming Soon to approved published content.

Post-wedding Gallery content may include:

- Professional photographs.
- Approved guest photographs.
- Videos.
- Albums or categories.
- Optimized previews.
- Approved full-resolution downloads.
- Ceremony-program downloads.
- Archived invitations.
- Vows and speeches.
- Guestbook messages.
- Other approved wedding-history material.

Post-wedding work must not delay the invitation-launch website or RSVP system.

## RSVP retirement

After RSVP retirement:

- New submissions and revisions are disabled.
- The public RSVP route displays the appropriate retired or closed state.
- Personalized RSVP forms are no longer available.
- Complete active RSVP-operational data is retired no later than
  **July 30, 2027**, subject only to the approved minimum-record exception
  for a concrete unresolved administrative need.
- Protected backups containing retired RSVP-operational data expire through
  normal protected backup rotation no later than **August 29, 2027**.
- Non-identifying aggregate wedding statistics may remain when they cannot
  reasonably reconstruct an invited party's RSVP.
- The separate private `Invitees List` may remain as a personal
  planning/address record, but the active public RSVP application must no
  longer depend on retired RSVP response history.
- Public informational pages and approved Gallery content may remain online.

---

# Error and Transitional Experiences

These experiences are part of the sitemap even when they do not have independent routes.

## Invalid Invitation Code

**Parent route:** `/wedding/rsvp/`

### Required message

> We could not locate an invitation associated with that code. Please check the code as printed on your invitation and try again.

### Required recovery

- Allow correction and resubmission.
- Show the example format `XXX-XXX`.
- Provide printed RSVP instructions.
- Provide `RSVPhelp@loreweavercreations.com`.

### Prohibited disclosures

Do not indicate:

- That a similar code exists.
- Which character may be incorrect.
- That a named guest or household exists.
- The number of invitations.
- Spreadsheet details.
- Internal errors.

---

## Invitation Lookup in Progress

**Parent route:** `/wedding/rsvp/`

### Required behavior

- Indicate that the code is being checked.
- Announce the state accessibly.
- Prevent accidental duplicate lookup requests.
- Avoid exposing backend details.

---

## RSVP Service Unavailable

**Parent route:** `/wedding/rsvp/`

This state applies when lookup or submission dependencies are unavailable and the browser cannot complete the requested operation.

### Required content

- Guest-friendly temporary-unavailability message.
- A statement that does not claim an RSVP was stored unless the backend has confirmed storage.
- Printed RSVP alternative.
- Assistance address.
- Safe return or retry path where appropriate.

### Exclusions

Do not display:

- Stack traces.
- Google API errors.
- Spreadsheet names.
- Server paths.
- Credential or provider configuration.

---

## RSVP Closed

**Parent route:** `/wedding/rsvp/`

### Required content

- Notice that online submissions and revisions are closed.
- Deadline:
  - Monday, March 1, 2027, at 11:59 p.m. EST.
- Contact instructions for late corrections or exceptional circumstances.
- Link back to the public wedding site.

### Required behavior

- Remove or disable lookup and submission controls.
- Remove the live countdown.
- Do not imply that ordinary online revisions remain available.

---

## Validation Failure

**Parent route:** `/wedding/rsvp/`

### Required content

- Form-level error summary.
- Field-level explanations.
- Preserved newly entered valid values.
- Focus movement to the summary or first invalid field where appropriate.
- Assistance information when needed.
- Guest-safe messages for unauthorized named-invitee or additional-guest identifiers; invalid Plus 1 Yes/No values; missing, malformed, fractional, or out-of-range grouped child counts; grouped child No responses with nonzero counts; age totals that do not equal derived `overallAttendance`; invalid attendee-detail cardinality; attendee names over 100 characters; dietary/allergy responses over 1000 characters; or dietary/allergy values submitted when Reception is not selected.
- No disclosure of whether another invitation has different named-invitee, Plus 1, grouped-child capacity, or other private configuration.

The page must not imply that the invalid response was stored.

---

## Submission in Progress

**Parent route:** `/wedding/rsvp/`

### Required behavior

- Announce the submission state accessibly.
- Prevent accidental duplicate submission.
- Retain entered values until success is confirmed.
- Avoid claiming that the RSVP is recorded before backend confirmation.

---

## Submission Uncertain

**Parent route:** `/wedding/rsvp/`

This state applies when the browser loses its connection or cannot determine whether the response was recorded.

### Required content

- Explain that the system cannot confirm the outcome.
- Warn against repeated immediate submissions.
- Direct the guest to check the selected email or text-message destination.
- Provide a safe retry or assistance path.
- Provide `RSVPhelp@loreweavercreations.com`.

The state must not claim either success or failure without evidence. Any safe retry must reuse or otherwise preserve the client submission identifier so the backend can return an idempotent outcome without creating a duplicate RSVP version.

---

## Guest Confirmation Delivery Warning

**Parent route:** `/wedding/rsvp/confirmation`

This state applies when the RSVP was recorded but the guest email or text-message confirmation failed or remains uncertain. The guest-delivery problem does not prevent the protected administrative-email attempt.

### Required content

- State clearly that the RSVP was recorded.
- Identify the guest delivery problem without exposing provider internals.
- Do not instruct the guest to resubmit solely because delivery failed.
- Provide assistance information.
- Explain that the couple may resend the confirmation through the administrative process.

---

## Administrative Confirmation Delivery Warning

**Parent route:** `/wedding/rsvp/confirmation`

This state applies when the RSVP was recorded but the administrative email confirmation failed or remains uncertain. The administrative-delivery problem does not prevent the selected guest email or text-message attempt.

### Required content

- State clearly that the guest’s RSVP was recorded.
- Avoid exposing the couple’s private email address unless separately approved.
- Do not instruct the guest to resubmit.
- Record the administrative delivery status privately for follow-up.

---

## Confirmation Refresh Without Temporary State

**Route:** `/wedding/rsvp/confirmation`

### Required content

- Explain that the temporary on-screen summary is no longer available.
- Explain that the RSVP may already have been processed.
- Direct the guest to consult the selected email or text confirmation.
- Link back to `/wedding/rsvp/`.
- Provide assistance information.

### Exclusions

- No RSVP data in URL parameters.
- No automatic replay of the prior submission.
- No instruction to resubmit solely because the page was refreshed.

---

## Wedding-Site Not Found

**Canonical route:** `/wedding/not-found`

**Also used for:** Any unmatched `/wedding/*` route

### Required links

- Home.
- RSVP.
- Venues.
- FAQ.

### Required behavior

- Display a wedding-specific guest-safe explanation.
- Avoid exposing server, framework, filesystem, or routing details.
- Do not imply that an unknown path corresponds to a valid invitation.

---

# Page-to-Page Relationships

## Home links to

- RSVP.
- Theme and Attire.
- Venues or Travel.
- Our Story.
- Other primary-navigation destinations.

## RSVP links to

- Privacy.
- Home.
- Printed-response and assistance information.
- Confirmation after successful submission.

## Confirmation links to

- RSVP for another revision.
- Home or another public destination.
- Assistance information.

## Theme and Attire links to

- RSVP.
- Approved design-guide downloads.
- Other relevant public pages.

## Our Story links to

- Home.
- RSVP.

## Read, Listen, and Watch links to

- Verified external book sources.
- Verified external audiobook sources.
- Verified external film sources.
- Home or other public pages.

## Venues links to

- Verified external maps.
- Travel.
- Schedule.
- FAQ.

## Travel links to

- Verified hotel booking resources when available.
- Verified external maps.
- Venues.
- Schedule.
- FAQ.

## Schedule links to

- Venues.
- Travel.
- RSVP.
- FAQ.

The Schedule destination remains the same under both event configurations. Its content changes through the centralized active-event setting and must not branch into separate cocktail-hour, dinner, dancing, or other internal-activity pages.

## FAQ links to

- RSVP.
- Theme and Attire.
- Venues.
- Travel.
- Schedule.
- Read, Listen, and Watch.
- Privacy.

Reception answers must link back to the concise Schedule page rather than to a separate or more detailed internal itinerary.

## Gallery links to

- Home or other public navigation destinations.
- Approved downloads after publication.

## Privacy links to

- RSVP.
- Home.
- Assistance information.

## Not Found links to

- Home.
- RSVP.
- Venues.
- FAQ.

---

# Search-Indexing Boundary

## Indexable public pages

The following routes may be indexed:

- `/wedding/`
- `/wedding/theme`
- `/wedding/story`
- `/wedding/read-listen-watch`
- `/wedding/venues`
- `/wedding/travel`
- `/wedding/schedule`
- `/wedding/faq`
- `/wedding/gallery`
- `/wedding/privacy`

## Non-indexed routes and states

The following must not be indexed:

- `/wedding/rsvp/`
- Validated personalized RSVP state.
- `/wedding/rsvp/confirmation`
- Invalid-code state.
- Closed-RSVP state.
- Service-unavailable state.
- Submission-uncertain state.
- Delivery-warning states.
- `/wedding/not-found`
- Any unmatched wedding route.

No personalized or transactional value may appear in indexable metadata.

---

# Sitemap Exclusions

The sitemap does not include:

- `/wedding/rsvp/:inviteCode`
- Any code-bearing RSVP path.
- Any invitation-code query string or fragment.
- A separate route per invitation.
- A public administrative dashboard.
- A guest directory.
- A code-recovery search.
- A public saved-RSVP route.
- A public RSVP-history route.
- A public confirmation-recovery route.
- A gift-registry page.
- A hosted-media library.
- An ebook reader.
- A full-audiobook player.
- A full-length movie player.
- Public copyrighted-media downloads.
- A separate pre-wedding photo-gallery requirement.
- Person-by-person RSVP pages.
- Individual invitee attendance routes.
- A standalone Plus 1 guest-name route or question merely because an invitation authorizes a `Plus1`.
- A separate route for an invitation’s maximum attendance.
- A separate route for one or more authorized additional-guest allocations.
- A separate route for grouped child attendance or child count.
- A count-bearing child route or query parameter.
- A separate route for an attendance category or attendee-detail record.
- Accessibility, lodging, transportation, or message-to-the-couple RSVP pages.
- Mixed venue-and-schedule configurations.
- A separate cocktail-hour page or schedule state.
- A separate formal-dinner page or schedule state.
- A fixed dancing-schedule page or state.
- A page or route for unconfirmed internal reception milestones.
- An invented Configuration B ceremony-to-reception transition.
- A guest-facing mimosa-station page or state before the arrangement is confirmed.

The allocation-question name exclusions do not prevent collection of an attending Plus 1's or previously unnamed children's actual names through the ordinary `Attendee Details` structure when those people attend.

---

# Sitemap Completion Review

This sitemap is complete when:

- Every browser-facing page has one canonical route.
- Manual code entry is the sole RSVP access method.
- No invitation code is placed in a public URL.
- Public and personalized information are clearly separated.
- Stored RSVP answers are not returned to the blank form.
- The validated form receives only the reviewed form heading, explicit wording mode, `maximumAttendance`, the validated party's safe `namedInvitees` roster, zero or more authorized `additionalGuestAllocations` containing only safe `id`, `kind`, `prompt`, and `maximumCount`, reusable schema information, and enabled confirmation capabilities needed for that invitation.
- Specifically named adults and children use the ordinary named-invitee Yes/No attendance mechanism.
- Each authorized `plus1` allocation has `maximumCount: 1` and produces one independent Yes/No question using its reviewed prompt.
- Each applicable `unnamedChildren` allocation produces one grouped family-level Yes/No question, not one question per child.
- Grouped child No means count 0 and no count selector remains applicable.
- Grouped child Yes reveals one required selector containing exactly the whole numbers from 1 through that allocation's `maximumCount`.
- A specifically named child is not duplicated into grouped unnamed-child capacity.
- A party with no authorized additional-guest allocation receives no additional-guest control and cannot submit an `additionalGuestResponses` value.
- `namedInvitees.length + sum(additionalGuestAllocations.maximumCount)` equals `maximumAttendance` for every valid invitation configuration.
- Allocation-object count is not treated as additional-person capacity.
- `overallAttendance` is backend-derived from named-invitee Yes responses plus Plus 1 Yes responses plus any grouped unnamed-child attending count rather than from the age-category dials.
- An attending RSVP has derived `overallAttendance` of at least 1 and no greater than `maximumAttendance`; a full decline has zero.
- The four attendance-category numerical dials represent the age composition of the derived attending party and sum to `overallAttendance` exactly.
- `Attendee Details` appears for Ceremony-only, Reception-only, and combined attendance and repeats exactly once per derived attendee, including each child represented by a grouped count.
- Every attendee-detail record requires an attendee name of no more than 100 characters.
- `Dietary or allergy information` appears only when Reception is selected, remains optional when applicable, and is limited to 1000 characters.
- Removing Reception while Ceremony attendance remains preserves attendee names and clears only dietary/allergy values.
- A full decline clears named-invitee responses, additional-guest responses, age totals, derived attendance, and attendee details.
- A named-invitee or Plus 1 change that alters attending composition requires complete attendee-detail replacement even if numeric attendance is unchanged.
- Any grouped child response/count change requires complete attendee-detail replacement.
- Revision omission, `replace`, explicit numerical zero, and backend dependency clearing retain their distinct meanings; the public contract does not use a generic client `clear` operation.
- Operational confirmation fields are entered again for revisions and replace their stored counterparts; Text Message and applicable SMS authorization appear in production only after the finalized provider gate is satisfied.
- Temporary confirmation information is separated from public content.
- Confirmation summaries include every applicable current named-invitee response, Plus 1 response, grouped child response/count, derived attendance and age totals, attendee names, and Reception-specific dietary/allergy values without inventing inapplicable values.
- Guest and administrative confirmation attempts proceed independently after storage, and only limited delivery statuses appear on the confirmation route.
- Private administrative information remains outside the public route tree.
- The Privacy page is included.
- Sticky navigation order is documented.
- Internal and external link behavior is documented.
- Both venue configurations are prepared and only one may be active.
- The Schedule route publishes only confirmed outer event blocks and broad reception wording.
- Configuration B does not invent an internal ceremony-to-reception transition.
- Gallery uses one canonical route for both Coming Soon and post-wedding states.
- RSVP states, validation, service-unavailable, uncertain-submission, delivery-warning, confirmation-refresh, and 404 behavior are accounted for.
- Search-indexing boundaries are documented and personalized RSVP states remain non-indexed.
- Privacy-sensitive RSVP values do not appear in URLs, public metadata, analytics, or the ordinary public route tree.
- The invitation-launch and post-wedding boundaries are clear.
- No unnecessary route has been introduced merely to represent invitation-specific allocation controls or grouped child count state.

The grouped `Kids(n)` clarification changes conditional form state inside the existing RSVP route. It does **not** create a new browser page, new top-level route, child-specific route, allocation-specific route, or count-bearing route.
