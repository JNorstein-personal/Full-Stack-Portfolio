# Wedding Website Route Inventory

## Purpose

This document defines the canonical browser routes for the Loreweaver Creations wedding website.

It establishes:

- The public page structure beneath `/wedding/`.
- Which destinations appear in the compact sticky primary navigation.
- Which routes may display personalized information.
- Which routes may be indexed by public search engines.
- How the manual invitation-code RSVP process operates without placing invitation codes in URLs.
- Which pages read from the centralized active-event configuration.
- How lookup, spreadsheet-authoritative personalized-form rendering, submission, validation, uncertain-outcome, closed-RSVP, service-unavailable, confirmation-delivery-warning, confirmation-refresh, and unknown-route states are handled.
- How invitation-specific singular/plural wording, maximum attendance, zero or more authorized named `Plus1` allocations, coordinated attendance totals, and Reception-only attendee-detail rows remain controlled states of one reusable RSVP route rather than separate browser destinations.

This inventory covers browser-facing website routes and controlled browser states. Backend API endpoints are documented separately in `docs/rsvp-api-contract.md`, while the authoritative Phase 3 data flow, invitation-configuration rules, and finalized privacy/security architecture are maintained in `docs/rsvp-system-design.md`. Route and state obligations must remain consistent across those documents, `docs/requirements.md`, `docs/decisions.md`, `docs/content-inventory.md`, `docs/page-outlines.md`, `docs/sitemap.md`, `docs/wireframes.md`, `docs/link-inventory.md`, and `docs/rsvp-test-cases.md`.

---

## Route Conventions

The wedding website is a contained application hosted beneath:

`https://www.loreweavercreations.com/wedding/`

All browser-facing production routes must begin with `/wedding/`.

The routes listed in this document are the canonical routes. Direct navigation and browser refresh must work for each route without producing a generic server 404 response.

Equivalent trailing-slash variations may be normalized or redirected to the canonical form, but the application must not place invitation codes, guest identities, confirmation destinations, RSVP answers, Plus 1 allocation identifiers or prompt-owner names, maximum-attendance values, Reception attendee details, or other personalized information in a path, query string, or URL fragment.

Internal links beneath `https://www.loreweavercreations.com/wedding/` must open in the same browser tab.

External media, hotel, and map links must open in a new browser tab, use appropriate security attributes, and provide an accessible indication that a new tab will open.

The production responses serving `/wedding/rsvp/` and
`/wedding/rsvp/confirmation` must use `Cache-Control: no-store, max-age=0`.
The no-store policy does not create a separate route and does not authorize
additional personalized data in the browser.

Invitation codes are limited access tokens rather than passwords. No route
may be added for public guest-directory search, code recovery, fuzzy or
close-match lookup, saved-RSVP retrieval, RSVP history, or confirmation
recovery.

---

## Canonical Route Inventory

| Route | Page or Function | Primary Navigation | Personalized | Search Indexing | Launch Requirement |
|---|---|---:|---:|---:|---:|
| `/wedding/` | Home | Yes | No | Yes | Required |
| `/wedding/rsvp/` | RSVP code entry and validated blank RSVP form | Yes | Conditional after code validation | No | Required |
| `/wedding/rsvp/confirmation` | Successful-submission confirmation, delivery-warning, and refresh-fallback states | No | Yes when temporary confirmation state exists | No | Required |
| `/wedding/theme` | Theme and Attire | Yes | No | Yes | Required |
| `/wedding/story` | Our Story | Yes | No | Yes | Required |
| `/wedding/read-listen-watch` | Read, Listen, and Watch | Yes | No | Yes | Required |
| `/wedding/venues` | Active ceremony and reception information | Yes | No | Yes | Required |
| `/wedding/travel` | Hotel block, parking, maps, and transportation | Yes | No | Yes | Required |
| `/wedding/schedule` | Active guest schedule | Yes | No | Yes | Required |
| `/wedding/faq` | Frequently Asked Questions | Yes | No | Yes | Required |
| `/wedding/gallery` | Gallery and pre-wedding Coming Soon state | Yes | No | Yes | Required |
| `/wedding/privacy` | Full RSVP Privacy notice | Yes | No | Yes | Required |
| `/wedding/not-found` | Wedding-site not-found page | No | No | No | Required |
| Any unmatched `/wedding/*` route | Render the wedding-site not-found experience | No | No | No | Required |

---

## Primary Navigation Order

The compact sticky primary navigation must use the following order:

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

The navigation must remain available while the guest scrolls on desktop and mobile layouts.

The navigation must also:

- Keep RSVP access prominent.
- Avoid obscuring headings, form controls, validation messages, focused elements, or other essential content.
- Present the approved destinations without overlap on supported desktop widths.
- Use a clearly labeled and operable menu control on mobile.
- Close the mobile menu after a destination is selected.
- Remain operable by touch and keyboard.

RSVP must additionally appear:

- As a prominent action on the Home page.
- In the site footer.
- Where contextually appropriate on the Schedule and FAQ pages.

The Privacy page must additionally be linked from:

- The concise privacy notice on the RSVP entry state.
- The concise privacy notice on the validated RSVP form state.
- The site footer.

---

## Route Responsibilities

### `/wedding/` — Home

**Purpose:**
Confirm that the guest has reached the correct wedding website and direct the guest quickly to RSVP and essential planning information.

**Required route behavior:**

- Display the couple’s names, wedding date, and general location.
- Provide a prominent RSVP action.
- Link to Theme and Attire, Venues or Travel, and Our Story.
- Display only the currently active event configuration.
- Read repeated event information from centralized content or configuration.
- Remain publicly indexable.

The static QR code printed on all 57 assigned invitations opens this route.

### `/wedding/rsvp/` — RSVP Entry and Validated Form

**Purpose:**
Provide the only browser route through which guests enter an invitation code and complete an online RSVP.

This route has multiple controlled interface states but remains one canonical browser route.

#### Public entry state

The entry state must provide:

- Instructions to enter the six-character code printed on the invitation.
- The example format `XXX-XXX`.
- A labeled invitation-code field.
- A submit or continue control.
- The written RSVP deadline.
- A live countdown only from 12:00 a.m. EST on February 1, 2027 through Monday, March 1, 2027 at 11:59 p.m. EST.
- The printed RSVP alternative.
- `RSVPhelp@loreweavercreations.com`.
- A concise privacy notice linked to `/wedding/privacy`.

#### Lookup-in-progress state

The application must communicate that the invitation code is being checked and prevent accidental duplicate lookup requests.

#### Invalid-code state

Malformed or unknown invitation codes must produce a neutral error that does not disclose:

- Whether a similar code exists.
- Whether a particular guest or household exists.
- Other invitation codes.
- The number of invitations.
- Spreadsheet information.
- Internal application errors.

The guest must be able to correct the entry and try again.

#### Validated blank-form state

After the backend validates an invitation code, the personalized RSVP form must render on `/wedding/rsvp/` without changing the browser to a code-bearing or invitation-configuration-bearing route.

The invitation code and private configuration values must not appear in:

- The path.
- The query string.
- The URL fragment.
- Page metadata.
- Analytics data.

The backend may return only the limited configuration required to render the applicable blank form, including:

- The reviewed invitation or household form heading.
- The explicit singular or plural wording mode.
- The invitation's maximum permitted attendance.
- Zero or more authorized named `Plus1` allocations, each represented by a stable non-name allocation identifier and the guest-facing prompt required for that allocation.
- The approved labels, options, conditions, validation constraints, and operational-confirmation capabilities belonging to the single reusable RSVP schema.

The browser must not infer wording mode, maximum attendance, Plus 1 eligibility, allocation ownership, or any other invitation authorization from guest names, greeting text, party size, or other client-visible content. Those values come only from the validated backend response.

Every validated form must:

- Load blank even when a previous response exists.
- Avoid displaying previously stored RSVP answers or confirmation destinations.
- Explain how initial submissions differ from partial revisions.
- Explain that omitted revision fields mean only “leave the stored value unchanged,” except where an authoritative dependency rule makes stored data inapplicable.
- Provide explicit replace and clear controls or values wherever a guest may need to change or remove previously stored information.
- Treat a submitted zero, replacement value, decline selection, or explicit clear instruction according to its defined meaning rather than as an omitted field.
- Require the guest to enter the operational confirmation method and the destination applicable to a currently enabled production confirmation channel for every initial submission and revision.
- Always support Email as configured.
- Display Text Message only when centralized production configuration reports that the finalized Step 14 SMS-provider disclosure/enablement gate is satisfied.
- When an enabled Text Message option is selected, display and require the valid SMS-capable mobile number and any applicable transactional text-message authorization.
- When the Step 14 provider gate is not satisfied, omit Text Message rather than presenting invented provider-specific copy.
- Explain that newly submitted operational confirmation fields replace the stored confirmation method, destination, and applicable authorization state.
- Display the concise privacy notice linked to `/wedding/privacy`.

##### Spreadsheet-authoritative reusable RSVP state

The personalized RSVP form uses one reusable substantive structure for every validated production invitation.

**Attendance and decline**

- Present three coordinated checkboxes: `Ceremony`, `Reception`, and the invitation-specific decline wording.
- Use `Regretfully, I am unable to attend.` for singular wording mode and `Regretfully, we are unable to attend.` for plural wording mode.
- Ceremony and Reception may both be selected.
- Selecting Ceremony or Reception disables the decline control.
- Selecting the decline control disables Ceremony and Reception.
- A valid attending state includes Ceremony, Reception, or both; a valid decline state includes neither event selection.

**Authorized named Plus 1 allocations**

- If the validated invitation has no authorized `Plus1` allocation derived from Column E, render no Plus 1 question and authorize no Plus 1 response.
- For each authorized allocation, render exactly one Yes/No question using the allocation's backend-supplied named-invitee prompt, such as `Will [Named Invitee] be accompanied by a +1?`
- Multiple allocations render multiple independent Yes/No questions; they are not collapsed into an aggregate count control.
- The Plus 1 question identifies the named invitee who owns the allocation. It does not ask for the additional guest's name.
- The backend must reject any allocation identifier or Plus 1 response that is not authorized for the validated invitation.

**Attendance totals**

When the resulting RSVP is attending:

- Render four numerical dials for Adults 21+, Young Adults 18–20, Children 3–17, and Children under 3.
- Each value is a nonnegative whole number.
- The four values represent the complete attending party, including any attending Plus 1 guests.
- The backend-calculated `overallAttendance` must be at least 1 and must not exceed the invitation's `maximumAttendance`.
- Each dial's currently available maximum is the invitation's maximum attendance minus the values already allocated to the other three dials, preventing the combined total from exceeding the authorized maximum.
- During a revision, an omitted category remains unchanged unless another controlling change makes the stored totals inapplicable; an explicit zero replaces a previously positive value with zero.

**Reception attendee details**

When Reception is selected:

- Render exactly one attendee-detail row for each person represented by `overallAttendance`.
- Each row contains a required attendee-name field with a maximum length of 100 characters.
- Each row contains an optional food-allergy/dietary-preference field with a maximum length of 1000 characters.
- The attendee-detail rows include all Reception attendees, including any attending Plus 1 guest.
- Ceremony-only attendance renders no Reception attendee-detail rows.
- Removing Reception clears stored Reception attendee-detail data.
- If `overallAttendance` changes while Reception remains selected, the browser must collect and submit a complete replacement attendee-detail list whose length matches the new total.

**Decline dependency**

A resulting full decline clears attendance-dependent Plus 1 responses, attendance totals, and Reception attendee details before final validation. Operational confirmation information remains required.

The backend must independently validate the invitation code, named Plus 1 allocation authorization, attendance selections, attendance totals, Reception attendee-detail cardinality and field lengths, submitted RSVP changes, explicit clear operations, operational confirmation fields, deadline, authorization, and complete resulting RSVP whenever a response is submitted. The existence of validated client-side state must not substitute for server-side authorization.

#### Submission-in-progress state

While an RSVP submission is being validated and recorded, the route must:

- Announce the in-progress state accessibly.
- Prevent accidental repeat activation of the submit control.
- Retain the guest’s entered values until the backend returns a definite result.
- Avoid claiming that the RSVP was stored before the backend confirms successful storage.
- Avoid exposing backend, spreadsheet, email-provider, or SMS-provider details.

#### Validation-failure state

When the backend rejects an initial submission or the complete merged result of a revision, the route must:

- Display a guest-safe form-level error summary and field-level messages.
- Retain the guest’s newly entered valid values where safe.
- Permit correction without revealing omitted stored RSVP values.
- State or imply only that the submitted response was not accepted; it must not claim that an RSVP version was stored.
- Preserve the distinction between omission, replacement, explicit zero, and explicit clear instructions.
- Identify unauthorized or inapplicable fields without revealing private configuration details.
- Reject Plus 1 responses for invitations with no authorized allocation, unknown or duplicated allocation identifiers, invalid Yes/No values, or responses that exceed the invitation-specific allocation set.
- Reject negative, fractional, incomplete, or excessive attendance totals.
- Reject Reception attendee-detail data when Reception is not selected, incorrect attendee-detail cardinality, blank required attendee names, attendee names longer than 100 characters, or dietary/allergy values longer than 1000 characters.

#### Submission-uncertain state

When the browser loses its connection or cannot determine whether a submission was recorded, the route must:

- State that the outcome cannot yet be confirmed.
- Avoid claiming either success or failure without evidence.
- Warn against repeated blind resubmission.
- Direct the guest to check the selected email or text-message destination and provide the approved assistance method.
- Provide a safe retry or recovery path that preserves duplicate-submission protection and does not create an additional RSVP version when the original submission was already processed.

#### Closed-RSVP state

At and after Monday, March 1, 2027 at 11:59 p.m. EST, the route must stop accepting online submissions and revisions and display the approved closed-RSVP instructions.

The closed state must include the approved assistance method and must not expose personalized information.

#### Service-unavailable state

When invitation lookup or submission services are temporarily unavailable, the route must:

- Display a guest-safe message and assistance information.
- Provide the printed RSVP alternative and a reasonable return or retry path where appropriate.
- Avoid claiming that an unconfirmed submission was stored.
- Avoid exposing internal server, spreadsheet, credential, email-provider, or SMS-provider details.
- Preserve duplicate-submission protection if the guest later retries an uncertain request.

**Search treatment:**
This route must use appropriate metadata, crawler directives, and server behavior to prevent or discourage public search indexing.

### `/wedding/rsvp/confirmation` — RSVP Confirmation

**Purpose:**
Confirm that a valid initial RSVP or revision was recorded successfully.

The route may display temporary personalized confirmation state returned after a successful submission. It must not use a distinct route for an invitation, named Plus 1 allocation set, maximum-attendance value, or Reception attendee count.

The confirmation experience must include:

- A clear success heading stating that the RSVP was recorded.
- Whether the action was an initial submission or revision.
- The complete current guest-facing RSVP after any partial revision was merged.
- Ceremony and Reception selections or decline status.
- Each authorized named-invitee Plus 1 response that is part of the complete resulting RSVP.
- All four attendance age-category totals and the backend-calculated overall attendance total when the party is attending.
- When Reception is selected, the complete current Reception attendee-detail list, including each attendee name and the corresponding food-allergy/dietary-preference value when one was supplied.
- Submission or revision timestamp.
- The selected guest confirmation method.
- Guest confirmation delivery-attempt status.
- A limited administrative-email delivery-attempt status or notice without exposing the administrative destination.
- Revision instructions explaining that the guest returns to `/wedding/rsvp/`, re-enters the code and operational confirmation fields, submits only intended changes or explicit clear operations, and receives a complete updated confirmation.
- The deadline.
- A return-to-site link.
- Assistance instructions.

Attendance-dependent values that are inapplicable in the complete resulting RSVP must be omitted rather than represented with invented zeros, blank placeholders, or “not applicable” rows. In particular:

- A fully declined RSVP contains no Plus 1 responses, attendance totals, overall attendance total, or Reception attendee details.
- Ceremony-only attendance contains no Reception attendee-detail list.
- An invitation with no authorized Column E `Plus1` allocation contains no Plus 1 summary row.

After storage, the guest confirmation and protected administrative email attempts are independent. Failure, delay, or uncertainty in one channel must not prevent the other channel from being attempted, must not roll back the RSVP, and must not create another RSVP version.

If either delivery attempt fails or remains uncertain, the route must continue to state that the RSVP was recorded and display the applicable success-with-delivery-warning variant. The warning must distinguish the affected delivery category without exposing provider internals or the couple's private administrative address, and it must not instruct the guest to resubmit solely because delivery failed.

The route must not expose:

- Spreadsheet row numbers or source-spreadsheet notes.
- Internal record identifiers.
- Private administrative notes.
- Credentials.
- Another party's information.
- Invitation codes in the URL.
- Private source-row data, allocation-owner mappings beyond the guest-facing prompts required for the validated party, or other invitation configuration not needed in the confirmation.

Confirmation details do not need to survive a browser refresh. If temporary confirmation state is unavailable, the route must display a safe fallback explaining that the submission may already have been processed and directing the guest to consult the email or text confirmation or return to `/wedding/rsvp/` for assistance or another revision.

The fallback must not instruct the guest to resubmit solely because the on-screen summary is unavailable.

**Search treatment:**
This route must not be indexed and must not place personalized information in page titles, descriptions, URLs, or crawler-visible metadata.

### `/wedding/theme` — Theme and Attire

**Purpose:**
Explain the wedding aesthetic and help guests select appropriate attire without requiring prior familiarity with the source inspiration.

**Required route behavior:**

- Present the vintage garden formal aesthetic.
- Provide color, outfit, hat, accessory, costume, anachronism, and gender-neutral guidance.
- Present inspiration materials and approved design-guide downloads.
- State that suggestions are inspirational rather than mandatory.
- Remain publicly indexable.

### `/wedding/story` — Our Story

**Purpose:**
Present the couple’s relationship story as a complete public page.

**Required route behavior:**

- Appear in the primary navigation.
- Contain the approved relationship and wedding-planning narrative.
- Link contextually to Home or RSVP where appropriate.
- Remain publicly indexable.

### `/wedding/read-listen-watch` — Read, Listen, and Watch

**Purpose:**
Provide lawful external resources for the thematic book, audiobook, and film.

**Required route behavior:**

- Link to approved purchase, rental, streaming, subscription, and library sources.
- Store maintained external links in centralized content or configuration.
- Open external media destinations in a new browser tab.
- Identify new-tab behavior accessibly.
- Avoid hosting or embedding complete copyrighted copies of the book, audiobook, or film.
- Remain publicly indexable.

### `/wedding/venues` — Venues

**Purpose:**
Display the ceremony and reception information for the currently active event configuration.

**Required route behavior:**

- Read from the centralized active-event configuration.
- Display either Configuration A or Configuration B, never a mixture.
- Support the Warinanco Park ceremony and Sphinx reception configuration.
- Support the Sphinx-only ceremony-and-reception fallback.
- Include appropriate accessibility, parking, arrival, map, and weather information.
- Open external map links in a new browser tab.
- Remain publicly indexable.

### `/wedding/travel` — Travel

**Purpose:**
Provide hotel-block, parking, driving, transit, airport, and local transportation information.

**Required route behavior:**

- Include the hotel-block dates of Friday, April 30 through Sunday, May 2, 2027.
- Add the hotel name, address, group rate, booking instructions, deadline, and accessibility information after confirmation.
- Avoid publishing invented hotel details while those details remain pending.
- Read any configuration-dependent venue or travel information from the centralized active-event configuration.
- Open external hotel and map links in a new browser tab.
- Remain publicly indexable.

### `/wedding/schedule` — Schedule

**Purpose:**
Display the guest-facing schedule for the currently active event configuration.

**Required route behavior:**

- Read from the same centralized active-event configuration as Home, Venues, Travel, and FAQ.
- Display either the Warinanco/Sphinx schedule or the Sphinx-only schedule, never a mixture.
- Exclude private setup, vendor, or wedding-party-only scheduling details from the public route.
- Remain publicly indexable.

### `/wedding/faq` — Frequently Asked Questions

**Purpose:**
Provide concise answers to recurring guest questions.

**Required route behavior:**

- Include gift information without creating a registry page.
- Include RSVP revision, printed-response, invalid-code, confirmation-delivery, blank-form, partial-revision, privacy, venue, weather, travel, attire, children, plus-one, accessibility, photography, and dietary-accommodation answers where approved.
- Read venue, schedule, and contingency answers from the centralized active-event configuration.
- Link to `/wedding/privacy` for the complete privacy explanation.
- Remain publicly indexable.

### `/wedding/gallery` — Gallery

**Purpose:**
Reserve the permanent public route for approved wedding photographs and videos.

**Invitation-launch behavior:**

- Display only the intentional approved Coming Soon state.
- Do not require a functioning pre-wedding media gallery.
- Remain visible in primary navigation.
- Remain publicly indexable.

**Post-wedding behavior:**

The same route may later display reviewed and approved:

- Professional photographs.
- Guest photographs.
- Videos.
- Optimized previews.
- Full-resolution download links.
- Other approved wedding-history material.

Post-wedding media work must not delay the invitation-launch version.

### `/wedding/privacy` — RSVP Privacy

**Purpose:**
Provide the complete public explanation of RSVP information handling.

**Required route behavior:**

- Explain how invitation codes are used and that they are limited access
  tokens rather than passwords.
- Explain what RSVP and operational confirmation information is collected.
- Explain that forms load blank and do not display stored answers or
  confirmation destinations.
- Explain how partial revisions are merged with existing responses.
- Explain that RSVP information is stored in the private administrative
  system and who may access it.
- Explain that the couple receives complete protected administrative
  confirmations by email.
- Explain that Email is an approved guest confirmation method and Text
  Message is described as available only when the finalized production
  provider/disclosure gate has been satisfied.
- Explain transactional-only RSVP mobile-number use.
- Explain that Reception attendee names and per-attendee dietary/allergy information are collected only for parties attending the Reception, are private RSVP information, and are limited to the submitting party's own confirmation surfaces, protected administrative confirmation, and authorized private records.
- Explain in plain language that personalized RSVP data is kept out of
  personalized browser URLs, public indexing, analytics, and ordinary logs
  according to the approved data-minimization rules.
- State that complete active RSVP-operational data may be retained through
  **July 30, 2027** and is then deleted or irreversibly de-identified
  unless a minimum record is temporarily required for a concrete documented
  unresolved administrative need.
- State that protected backups containing retired RSVP-operational data
  expire no later than **August 29, 2027**.
- Explain that non-identifying aggregate statistics may be retained and
  that the separate private `Invitees List` may remain a personal
  planning/address record outside the active RSVP system.
- Explain how guests may request assistance or correction.
- Avoid unsupported promises of absolute security.
- Link to `RSVPhelp@loreweavercreations.com` where appropriate.
- Remain publicly indexable.


### `/wedding/not-found` and Unmatched `/wedding/*` Routes

**Purpose:**
Provide a branded wedding-site error experience instead of a generic server error.

**Required route behavior:**

- Render for `/wedding/not-found` and any unknown browser route beneath `/wedding/`.
- Provide links to Home, RSVP, Venues, and FAQ.
- Avoid revealing server paths, stack traces, framework errors, or deployment details.
- Avoid indexing.

The application may render the not-found component at the unknown URL or redirect internally to `/wedding/not-found`, provided that the behavior does not create redirect loops and nested-route refresh remains functional.

---

## Routes Not Permitted

The invitation-launch application must not create or distribute any code-bearing personalized browser route, including:

- `/wedding/rsvp/:inviteCode`
- `/wedding/rsvp/XXX-XXX`
- `/wedding/rsvp?code=XXX-XXX`
- `/wedding/rsvp/#XXX-XXX`

The application must not place invitation-specific form configuration in a browser route, query string, or fragment. It must not create routes such as:

- `/wedding/rsvp/plus-one/2`
- `/wedding/rsvp/maximum-attendance/4`
- `/wedding/rsvp/reception-attendees/3`

The project must not create separate routes or React pages for individual invitation codes, guest households, named Plus 1 allocation sets, maximum-attendance values, or Reception attendee counts.

Synthetic examples of prohibited code-specific source patterns include:

- `RSVPABC123.jsx`
- `RSVPDEF456.jsx`
- `RSVPGHI789.jsx`

One reusable RSVP entry and form-rendering route must serve every valid invitation through backend-controlled invitation configuration. Invitation-specific wording, maximum attendance, named Plus 1 allocation prompts, and response-dependent Reception attendee rows are controlled data or state within that reusable route rather than guest-specific pages.

The project must not create separate public routes for:

- A gift registry.
- A hosted ebook reader.
- A hosted audiobook player.
- A full-length movie player or embed.
- Guest-accessible folders containing copyrighted copies of the thematic book, audiobook, or film.
- A public administrative dashboard for the invitation-launch version.
- Individual guest or household RSVP records.
- Invitation-code recovery or guest-directory search.
- A public saved-RSVP view.
- A public RSVP-history view.
- A public confirmation-recovery route.
- A production invitation-code list or source-spreadsheet export.

---

## Active-Event Configuration Rules

The following routes must read repeated event details from one centralized active-event configuration:

- `/wedding/`
- `/wedding/venues`
- `/wedding/travel`
- `/wedding/schedule`
- `/wedding/faq`

Only one configuration may be guest-facing at a time.

### Configuration A

- Ceremony at Warinanco Park from 10:30 a.m. to 12:00 p.m.
- Reception at Sphinx Banquet and Catering Center from 12:30 p.m. to 4:30 p.m.

### Configuration B

- Ceremony and reception at Sphinx Banquet and Catering Center from 11:30 a.m. to 4:30 p.m.

Configuration A may be activated only after park approval and while weather permits. Configuration B must remain available for lack of park approval or an inclement-weather fallback.

Changing the active configuration must not require rewriting the affected page components or changing their routes.

---

## Search-Indexing Rules

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

The following routes and states must not be indexed:

- `/wedding/rsvp/`
- The lookup-in-progress, invalid-code, validated personalized-form—including zero or more authorized named Plus 1 controls, attendance-dial states, and Reception attendee-detail states—submission-in-progress, validation-failure, submission-uncertain, closed, and service-unavailable states on `/wedding/rsvp/`.
- `/wedding/rsvp/confirmation`, including initial-success, revision-success, guest-delivery-warning, administrative-delivery-warning, and refresh-without-temporary-state variants.
- `/wedding/not-found`
- Any unmatched `/wedding/*` route.

No page title, description, canonical URL, structured data, analytics event, or crawler-visible metadata may contain an invitation code, guest identity, RSVP response, confirmation destination, `clientSubmissionId`, named Plus 1 allocation identifier or ownership mapping, maximum-attendance value, Reception attendee detail, RSVP version, provider payload, or other personalized information.

---

## Phase 3 Step 14 Browser-Route Privacy and Security Rules

The finalized Step 14 rules apply to the canonical routes without creating
new browser destinations.

### RSVP and confirmation route caching

Production responses serving:

- `/wedding/rsvp/`
- `/wedding/rsvp/confirmation`

must use:

`Cache-Control: no-store, max-age=0`

Static versioned application assets containing no personalized or secret
information may use ordinary cache optimization.

### Browser persistence

The successful submission response may exist in temporary React
navigation/application state for the confirmation experience, but the
application does not intentionally persist it in local storage, session
storage, IndexedDB, cookies, URL parameters/fragments, or a newly created
backend recovery token solely to reconstruct the summary after Step 13
state is lost.

### Analytics

Analytics associated with RSVP or confirmation routes must be
non-personalized and must not receive invitation codes, invited-party
identities derived from invitation records, RSVP answers, attendee names,
dietary/allergy information, contact destinations, `clientSubmissionId`,
named Plus 1 allocation identifiers or ownership mappings, maximum-attendance
values, versions, or provider payloads.

Analytics must not be required for the RSVP flow to function.

### Guest-safe route states

Invalid, unavailable, excessive-attempt, uncertain-submission,
delivery-warning, refresh-fallback, closed, and not-found states must not
expose stack traces, internal paths, workbook details, provider secrets,
protected administrative addresses, close-match invitation information, or
development-record existence.

### SMS production gate

Text Message is a configuration-dependent confirmation option. It appears
on the production RSVP route only after the selected SMS provider, required
guest-facing disclosures/authorization, backend-only credentials/sender
configuration, and production-flow testing satisfy the finalized Step 14
gate.

If the gate is not satisfied, the Text Message choice is omitted rather
than shown disabled with invented provider-specific copy.

### HTTPS

Production RSVP entry, confirmation, and API traffic use HTTPS. Ordinary
HTTP navigation must redirect to HTTPS before private RSVP information can
be submitted.

---

## Nested-Route Refresh and Deployment Rules

The production web server must support direct navigation and browser refresh for every canonical React route.

Requests for valid browser routes beneath `/wedding/` must be served through the wedding application rather than returning a generic web-server 404 response.

The route fallback must not intercept:

- Existing static assets.
- Backend API routes beneath the approved wedding API prefix.
- Health-check endpoints.
- Server-managed files that must be served directly.

The exact server rewrite and reverse-proxy configuration will be documented during the implementation and deployment phases.

---

## Phase 2 Step 1 Completion Check

Phase 2 Step 1 remains complete when:

- Every approved public page has one stable route.
- RSVP code entry and every validated blank-form variant share `/wedding/rsvp/` without exposing invitation codes or invitation-specific configuration in URLs.
- The confirmation route is separate and non-indexed.
- Submission-in-progress, validation-failure, submission-uncertain, service-unavailable, closed-RSVP, delivery-warning, and refresh-without-state behavior are documented as controlled route states rather than invitation-specific routes.
- The validated form receives only the reviewed form heading, explicit wording mode, maximum attendance, zero or more authorized named Plus 1 allocation prompts, confirmation-channel capabilities, and reusable schema information needed for the validated invitation.
- One spreadsheet-authoritative substantive RSVP structure serves every validated invitation; no production profile selector is required.
- Invitations with no Column E `Plus1` allocation render no Plus 1 controls; each authorized allocation renders one independent named-invitee Yes/No control.
- Attending parties use four coordinated numerical age-category dials whose combined total is at least 1 and does not exceed `maximumAttendance`.
- Reception attendance renders exactly one attendee-detail row per attending party member; Ceremony-only attendance renders none.
- Explicit replace and clear operations are distinguished from omitted revision fields.
- Operational confirmation fields are required again for revisions and replace their stored counterparts; Text Message and applicable SMS authorization are available in production only after the finalized provider gate is satisfied.
- Attendance-dependent fields that are inapplicable to the complete resulting RSVP are omitted from confirmations rather than represented by invented values.
- Guest and administrative delivery attempts are independent after storage, and limited delivery statuses are represented on the confirmation route.
- The Privacy page has a stable public route.
- No route or source page is created for an individual invitation, named Plus 1 allocation set, maximum-attendance value, or Reception attendee count.
- The not-found route and unmatched-route behavior are documented.
- Search-indexing treatment is documented.
- RSVP and confirmation browser responses use the finalized no-store policy.
- Browser persistence does not create a Step 13 confirmation-recovery mechanism.
- Analytics and guest-safe route-state boundaries reflect the finalized Step 14 data-minimization rules.
- Text Message is configuration-dependent under the finalized production provider/disclosure gate.
- Production RSVP traffic uses HTTPS.
- The Privacy route communicates the July 30, 2027 active-data retirement date and August 29, 2027 backup-retirement deadline.
- Active-event configuration dependencies are documented.
- Internal and external link behavior is documented.
- Nested-route refresh requirements are documented.

---

## Phase 3 Step 14 Route-Inventory Synchronization Review

`route-inventory.md` is synchronized through Phase 3 Step 14. The finalized
privacy/security rules constrain existing canonical routes and states but
do not add a public invitation-specific, saved-RSVP, RSVP-history,
administrative, or confirmation-recovery route.
