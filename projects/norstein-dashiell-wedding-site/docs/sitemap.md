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
│   │   ├── Authorized named Plus 1 questions
│   │   │   └── Zero or more controls, one per authorized Column E allocation
│   │   ├── Four coordinated attendance-category numerical dials
│   │   ├── Reception attendee-details region
│   │   │   └── Repeated once per attending party member when Reception is selected
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

Invitation-specific variation is limited to the reviewed form heading, explicit singular/plural wording mode, maximum attendance, and zero or more authorized named `Plus1` allocation prompts returned after valid lookup. A party whose private source record contains no `Plus1` in Column E receives no Plus 1 question.

Reception attendee-detail rows are response-dependent rather than invitation-specific routes: they appear only when Reception is selected and repeat exactly once for each member of the attending party represented by the four attendance-category totals.

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
- Maximum permitted attendance.
- Zero or more authorized named `Plus1` allocation definitions.
  - Each allocation uses a stable non-name identifier.
  - Each allocation supplies only the guest-facing prompt needed for that invitation, such as `Will [Named Invitee] be accompanied by a +1?`
  - If the private invitation configuration contains no authorized allocation, the browser receives no Plus 1 prompt to render.
- The reusable approved question definitions, labels, instructions, display conditions, and validation constraints.
- The information needed to support initial-submission versus revision processing without displaying stored answers.

The browser must not infer wording mode, maximum attendance, Plus 1 authorization, allocation count, or prompt ownership from guest names, party-display text, or other client-visible information. It renders only the limited values returned for the validated invitation.

The browser does not receive the source spreadsheet row, source-column metadata, unrelated invitee information, other invitation records, or a public code-to-guest mapping.

## Required blank-form behavior

The personalized form must always load blank, even when an RSVP already exists.

It must not display:

- Prior Ceremony or Reception selections.
- Prior decline status.
- Prior named-`Plus1` Yes/No responses.
- Prior age-category attendance totals.
- Prior Reception attendee names.
- Prior per-attendee dietary/allergy responses.
- Prior email address.
- Prior mobile number.
- Prior confirmation method.
- Prior confirmation-delivery status.

The blank-form rule does not prevent the browser from displaying the invitation-specific configuration needed to construct the form, such as the reviewed heading, wording mode, maximum attendance, and authorized named Plus 1 prompts.

## Initial-submission content

For an invitation without a stored response, the form must collect all information required to construct one complete valid RSVP under the single approved substantive structure:

1. A valid attendance or decline decision.
2. Every authorized named-`Plus1` response when the invitation has one or more such allocations and the party is attending.
3. All four attendance-category totals when attending.
4. Reception attendee-detail records when Reception is selected.
5. Operational confirmation information required for the selected enabled confirmation method.

An invitation without an authorized `Plus1` allocation must not render, require, or accept a Plus 1 response.

## Revision content

For an invitation with a stored response, the blank form must explain that:

- The guest re-enters the required operational confirmation fields, including the selected confirmation method, the applicable email address or SMS-capable mobile number, and any required transactional text-message authorization.
- The guest completes only the applicable RSVP fields intended to change or explicitly clear.
- A submitted RSVP value replaces its stored counterpart.
- An omitted applicable RSVP field means only “leave the stored value unchanged,” unless a controlling dependency makes the stored value inapplicable.
- Omission, replacement, an explicit zero, a decline selection, and an explicit clear instruction are distinct operations.
- Explicit replace and clear controls or values are required wherever previously stored information may need to be changed or removed.
- Newly submitted operational confirmation fields replace the stored confirmation method, destination, and applicable authorization state.
- The backend merges submitted changes and authorized clear operations with the current stored response.
- The complete merged result is validated against the invitation’s current authorized configuration and maximum attendance.
- A full decline makes named-`Plus1` responses, attendance totals, and Reception attendee details inapplicable and clears them before final validation.
- Removing Reception makes Reception attendee details inapplicable and clears them before final validation.
- If Reception remains selected but the complete attendance total changes, the Reception attendee-detail list must be replaced as one complete list with exactly the required number of attendee records.
- The complete updated RSVP is sent in the next confirmation.

## Approved reusable substantive structure

The production system uses one reusable substantive RSVP structure rather than invitation-selected question profiles.

### Attendance and decline

The attendance region provides three coordinated choices:

- Ceremony.
- Reception.
- `Regretfully, I am unable to attend` for singular wording; or
- `Regretfully, we are unable to attend` for plural wording.

Ceremony and Reception may be selected together. Selecting either attending option disables the decline choice; selecting decline disables Ceremony and Reception. The backend independently enforces the same mutual-exclusion rule.

### Authorized named Plus 1 questions

A Plus 1 question exists only when the private invitation configuration contains a corresponding authorization derived from Column E of the authoritative source.

For each authorized allocation, render one independent Yes/No question using the authorized prompt:

`Will [Named Invitee] be accompanied by a +1?`

Rules:

- No authorized allocation means no Plus 1 question and no authorized Plus 1 response.
- One allocation produces one Yes/No question.
- Multiple allocations produce one independent Yes/No question per allocation.
- Multiple allocations do not become a numeric guest-count control.
- Submission values are associated with stable allocation identifiers rather than guest names or prompt text.
- This question does not ask for the unknown Plus 1 guest’s name.
- If that Plus 1 attends the Reception, the attendee’s name is collected later as part of the Reception attendee-detail list.

### Attendance totals by age category

When the party is attending, the form uses four numerical dials:

1. Adults, ages 21 and older.
2. Young Adults, ages 18–20.
3. Children, ages 3–17.
4. Children under 3.

Each dial:

- Uses a nonnegative whole-number value.
- Begins at zero on a blank form.
- Is coordinated with the other three values.
- Must not permit the combined total to exceed the invitation’s `maximumAttendance`.

The browser may implement each current dial maximum as the invitation maximum minus the amount already allocated across the other attendance categories, or another equivalent interface rule that prevents the combined values from exceeding the authorized maximum.

The backend calculates `overallAttendance` from the four categories and remains authoritative. For an attending RSVP, the final sum must be at least 1 and no greater than `maximumAttendance`.

### Reception attendee details

This region applies only when Reception is selected.

The form renders exactly one attendee-detail record for each member of the attending party represented by `overallAttendance`.

Each record contains:

- **Attendee name**
  - Required.
  - Maximum 100 characters.
- **Food allergies or dietary preferences**
  - Optional.
  - Maximum 1000 characters.

The attendee-detail list therefore contains the names of all Reception attendees, including any attending authorized Plus 1s.

Ceremony-only attendance does not render or collect Reception attendee-detail records.

Removing Reception clears the Reception attendee-detail list. A full decline clears it together with all other attendance-dependent substantive information.

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

- Separate accepting/declining controls for each named invitee.
- A standalone field asking for a Plus 1 guest’s name merely because a `Plus1` allocation exists.
- Named-child attendance controls.
- Accessibility details.
- Lodging plans.
- Transportation needs.
- A message to the couple.
- Entrée selections.
- Any other unapproved substantive question.

The standalone Plus 1 name exclusion does not prohibit the required attendee-name field within Reception attendee details. When an authorized Plus 1 attends the Reception, that person is represented through the same Reception attendee-detail structure as every other Reception attendee.

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
- Each authorized named-`Plus1` Yes/No response applicable to the invitation.
- Adults age 21 and older.
- Young Adults ages 18–20.
- Children ages 3–17.
- Children under 3.
- Calculated overall attendance.
- When Reception is selected, the complete current Reception attendee-detail list, including each attendee name and that attendee’s dietary/allergy response when supplied.
- Submission or revision timestamp.
- Selected guest confirmation method.
- Guest delivery-attempt status.
- Limited administrative email-attempt status without exposing the private administrative address.
- Revision instructions.
- Deadline.
- Assistance information.

When the invitation has no authorized `Plus1` allocation, the confirmation must not invent a Plus 1 row.

When Reception is not selected, the confirmation must not invent Reception attendee-detail rows, dietary/allergy placeholders, zero-value rows, or “not applicable” entries.

A full decline confirmation contains the decline result and operational confirmation information but does not retain stale named-`Plus1` responses, attendance totals, overall attendance, or Reception attendee details.

## Confirmation boundary

The page must not display:

- Spreadsheet row numbers or source-column notes.
- Internal record identifiers.
- Private administrative notes.
- Provider credentials.
- Another party’s information.
- Invitation codes in the URL.
- Private source configuration that is not necessary to explain the submitting party’s own recorded RSVP.
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

## Private content includes, while required by the active RSVP system and
subject to the finalized Step 14 retirement schedule:

- Complete invitation records.
- Active and disabled invitation codes.
- Reviewed invitation/form headings.
- Wording mode.
- Maximum party size.
- Zero or more authorized named-`Plus1` allocation definitions for each invitation.
- Stable private allocation identifiers and the reviewed prompt-subject information needed to construct authorized Plus 1 questions.
- Current RSVP responses.
- Superseded response versions or revision history.
- Ceremony/Reception/decline state.
- Current named-`Plus1` Yes/No responses.
- Current four-category attendance totals and calculated overall attendance.
- Current Reception attendee-detail records, including attendee names and per-attendee dietary/allergy information.
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

The private administrative system may retain source fields needed to reproduce and audit the authoritative transformation, but source-column structure and unrelated private source values must not be exposed as public browser content.

## Administrative email content

The approved administrative confirmation may contain the complete current RSVP, including:

- Ceremony/Reception/decline state.
- Every authorized named-`Plus1` response applicable to the invitation.
- All four attendance-category totals and overall attendance when attending.
- The complete Reception attendee-detail list when Reception is selected, including attendee names and supplied dietary/allergy information.
- Guest confirmation method and destination.
- Submission/revision and version information required for administration.

The administrative confirmation is sent only to the couple’s protected administrative email destination.

It must not manufacture Plus 1 responses for invitations without authorized allocations or retain stale Reception attendee-detail information after Reception is removed or the party fully declines.

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
- Reception attendee names and per-attendee dietary/allergy information remain
  personalized RSVP data and are excluded from public metadata, analytics, and
  ordinary logs.

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
- Guest-safe messages for unauthorized Plus 1 allocation identifiers, invalid Yes/No values, excessive or incomplete attendance totals, invalid Reception attendee-detail cardinality, attendee names over 100 characters, and dietary/allergy responses over 1000 characters.
- No disclosure of whether another invitation has different Plus 1 authorization or private configuration.

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
- A separate route for one or more Plus 1 allocations.
- A separate route for an attendance category or Reception attendee-detail record.
- Accessibility, lodging, transportation, or message-to-the-couple RSVP pages.
- Mixed venue-and-schedule configurations.
- A separate cocktail-hour page or schedule state.
- A separate formal-dinner page or schedule state.
- A fixed dancing-schedule page or state.
- A page or route for unconfirmed internal reception milestones.
- An invented Configuration B ceremony-to-reception transition.
- A guest-facing mimosa-station page or state before the arrangement is confirmed.

The standalone Plus 1 name exclusion does not prevent collection of an attending Plus 1’s name through the ordinary Reception attendee-detail record when that person attends the Reception.

---

# Sitemap Completion Review

This sitemap is complete when:

- Every browser-facing page has one canonical route.
- Manual code entry is the sole RSVP access method.
- No invitation code is placed in a public URL.
- Public and personalized information are clearly separated.
- Stored RSVP answers are not returned to the blank form.
- The validated form receives only the reviewed form heading, explicit wording mode, maximum attendance, zero or more authorized named `Plus1` allocation definitions, reusable schema information, and enabled confirmation capabilities needed for that invitation.
- A party with no Column E `Plus1` authorization receives no Plus 1 control and cannot submit an authorized Plus 1 response.
- One authorized allocation produces one independent named-invitee Yes/No question.
- Multiple authorized allocations produce multiple independent named-invitee Yes/No questions rather than a numeric guest-count control.
- The four attendance-category numerical dials represent the complete attending party and cannot collectively exceed `maximumAttendance`.
- The backend-calculated overall attendance is at least 1 for an attending RSVP and no greater than the invitation maximum.
- Reception attendee-detail rows appear only when Reception is selected and repeat exactly once per member of the attending party.
- Each Reception attendee-detail record requires an attendee name of no more than 100 characters and permits an optional dietary/allergy response of no more than 1000 characters.
- Ceremony-only attendance does not create Reception attendee-detail records.
- A full decline clears attendance-dependent named-`Plus1` responses, attendance totals, and Reception attendee details.
- Removing Reception clears Reception attendee details.
- Omitted revision fields, replacement values, explicit zeros, decline selections, and explicit clear instructions have distinct meanings.
- Operational confirmation fields are entered again for revisions and replace their stored counterparts; Text Message and applicable SMS authorization appear in production only after the finalized provider gate is satisfied.
- Temporary confirmation information is separated from public content.
- Confirmation summaries include every applicable current named-`Plus1` response, attendance total, overall attendance value, and Reception attendee-detail record without inventing inapplicable values.
- Guest and administrative confirmation attempts proceed independently after storage, and only limited delivery statuses appear on the confirmation route.
- Private administrative information remains outside the public route tree.
- The Privacy page is included.
- Sticky navigation order is documented.
- Internal and external link behavior is documented.
- Both venue configurations are prepared and only one may be active.
- The Schedule route publishes only confirmed outer event blocks and broad reception wording.
- Configuration B does not invent an internal ceremony-to-reception transition.
- No separate cocktail-hour, formal-dinner, or fixed dancing state exists.
- The possible self-service mimosa station remains absent from the public sitemap unless confirmed.
- Invitation-launch and post-wedding Gallery states are separated.
- Invalid-code, unavailable, closed, validation-failure, submission-in-progress, uncertain-submission, delivery-warning, refresh-fallback, and not-found experiences are included.
- Search-indexing boundaries are defined.
- RSVP and confirmation browser responses use the finalized no-store policy.
- Text Message is conditionally available under the finalized production provider/disclosure gate.
- RSVP retirement reflects the July 30, 2027 active-data retirement date and August 29, 2027 protected-backup retirement deadline.
- No page or state contradicts the approved requirements, decisions, route inventory, content inventory, page outlines, wireframes, RSVP system design, API contract, or RSVP test catalog.

---

# Phase 3 Step 14 Sitemap Synchronization Review

This sitemap is synchronized through Phase 3 Step 14 because the finalized
privacy/security rules add no new public browser route and are represented
through the existing route/state boundaries, conditional Text Message
availability, no-store/no-index treatment, and RSVP retirement lifecycle.
