# Project Decision Log 

## Governing Relationship

This log records permanent project decisions and the associated functional and nonfunctional requirements. It must remain consistent with:

* `docs/requirements.md`
* `docs/content-inventory.md`
* `docs/link-inventory.md`
* `docs/sitemap.md`
* `docs/route-inventory.md`
* `docs/page-outlines.md`
* `docs/wireframes.md`
* `docs/rsvp-system-design.md`
* `docs/rsvp-api-contract.md`

When a later approved clarification affects more than one document, update the affected records together without deleting or renumbering an existing decision or requirement identifier.

---

## Decision 001 — Website Address 

Decision: 
The wedding website will be hosted at: 
https://www.loreweavercreations.com/wedding/ 

Reason: The wedding website is a contained application within the main Loreweaver Creations domain rather than a separate subdomain. 

Status: 
Final 

Date: 
7/23/2026

## Decision 002 — Invitation Codes

Decision:
The authoritative private production invitation source is the couple-supplied `Invitees List` spreadsheet. The current spreadsheet contains **57 active invitation records** corresponding to 57 assigned printed invitations.

The spreadsheet supplies the in-use invitation codes and the private invited-party information required to build production invitation configurations. The actual production codes and guest details must remain in private project data and must not be copied into public documentation, frontend source files, public repositories, browser URLs, analytics, page metadata, referrer data, or ordinary application logs.

Current source audit:

* All 57 supplied invitation codes normalize successfully under the approved invitation-code rules.
* All 57 normalized six-character lookup keys are unique.
* No two supplied codes collide after normalization.
* Each production code maps to one populated invited-party record.
* The supplied display values already use the approved `XXX-XXX` presentation format.
* A separate production placeholder code is not required by the current authoritative source.

Implementation Requirement:
The application must load invitation records dynamically and must not contain form-building or validation logic that assumes a permanently fixed number of invitations.

Production records must remain separate from fictional development fixtures and disabled test records.

Status:
Final

Date:
7/23/2026

Clarified:
9/19/2026

## Decision 003 — RSVP Deadline

Decision: 
The deadline for online RSVP Submissions is Monday, 3/1/2027, at 11:59PM EST.

Status:
Final

Date: 7/23/2026

## Decision 004 — Our Story Page Status

Decision: 
"Our Story" will receive its own public page and primary entry.

Status:
Final

Date:
7/24/2026

## Decision 005 — Gift Info

Decision:
Gift information will appear in the FAQ; the wedding will not use a gift registry or registry page.

Status:
Final

Date:
7/24/2026

## Decision 006 — RSVP Assistance

Decision: 
Alternative print RSVP slips will be mailed with the physical invitations, which are intended to be mailed no earlier than October 1, 2026. Guests who prefer to use the online RSVP but experience difficulty may contact us by email at RSVPhelp@loreweavercreations.com.

Status:
Final

Date:
7/24/2026

## Decision 007 — Gallery Page Status

Decision: 
The image and video gallery for the wedding shall remain visible as a Coming Soon page until post-wedding photographs and video are ready.

Status:
Final

Date:
7/24/2026


## Decision 008 — QR Code Page Access

Decision: 
Each of the 57 assigned printed invitations includes the same static QR code for https://www.loreweavercreations.com/wedding/

Status:
Final

Date:
7/24/2026

## Decision 009 — RSVP Access and URL Handling

Decision:
Guests must always enter the six-character invitation code printed on their invitation through the public RSVP entry page:

`https://www.loreweavercreations.com/wedding/rsvp/`

The application will not use or distribute personalized RSVP URLs containing invitation codes. Invitation codes must not remain visible in the browser address bar after they are submitted.

Reason:
Manual entry provides one consistent process for all guests, matches the static QR code printed on every invitation, and avoids placing private invitation codes in URLs, browser histories, copied links, analytics records, or referrer data.

Implementation Requirement:
The public RSVP entry page must submit the invitation code to the backend for validation and then render the applicable blank personalized form without changing the public URL to a code-bearing route.

Status:
Final

Date:
7/28/2026

## Decision 010 — Submission Confirmation and Refresh Behavior

Decision:
Temporary on-screen confirmation details do not need to survive a browser refresh.

After every successful initial submission or revision:

* The RSVP must be stored before any confirmation delivery is attempted.
* A protected administrative-email attempt and the invited party’s selected email- or text-message-confirmation attempt must each be made from the successfully stored complete current RSVP.
* The guest and administrative delivery attempts must proceed independently. Failure, delay, or uncertainty affecting one attempt must not prevent the other applicable attempt.
* Delivery results must be recorded separately from RSVP content and version history.
* The on-screen confirmation must identify the RSVP as successfully recorded and display the complete current guest-facing RSVP summary.
* The on-screen confirmation must identify whether the action was an initial submission or revision, display the submission timestamp and selected guest confirmation method, report the guest-delivery status, and provide only a limited administrative-attempt status without exposing the protected administrative email address.
* If the confirmation page is refreshed after its temporary state has been lost, the page must display a safe explanatory message, state that the RSVP may already have been recorded, direct the guest to the selected confirmation channel or assistance, and avoid instructing the guest to resubmit solely because the temporary summary is unavailable.

Implementation Clarification:

* A known lookup or submission-service outage must produce a guest-safe service-unavailable state that does not claim an RSVP was recorded.
* When the browser cannot determine whether a submission was recorded, the interface must produce a submission-uncertain state rather than claiming success or failure without evidence. The guest must be directed to check the selected confirmation channel and use the approved assistance path.
* A retry following an uncertain outcome must reuse the same client submission identifier so the backend can return an idempotent result without creating another RSVP version.

Status:
Final

Date:
7/28/2026

Clarified:
7/29/2026

## Decision 011 — Earliest Invitation Mailing Date

Decision:
The 57 assigned printed invitations are intended to be mailed no earlier than October 1, 2026.

Implementation Requirement:
The invitation-launch version of the website must be operational, tested, and displaying the confirmed event configuration before the printed invitations are mailed.

Status:
Final

Date:
7/25/2026

## Decision 012 — Event-Format and Venue Contingency

Decision:
The wedding will use one of the following two event configurations:

### Configuration A — Warinanco Park Ceremony and Sphinx Reception

This configuration will be used only if approval for the outdoor ceremony location is received and weather permits.

* Ceremony: Saturday, May 1, 2027, from 10:30 a.m. to 12:00 p.m.
* Ceremony location: Warinanco Park, Roselle, NJ 07036.
* Reception: Saturday, May 1, 2027, from 12:30 p.m. to 4:30 p.m.
* Reception location: Sphinx Banquet and Catering Center, 121 E 2nd Avenue, Roselle, NJ 07203.

### Configuration B — Entire Event at Sphinx

This configuration will be used if approval for Warinanco Park is not received or if inclement weather prevents use of the outdoor ceremony location.

* Ceremony and reception: Saturday, May 1, 2027, from 11:30 a.m. to 4:30 p.m.
* Location: Sphinx Banquet and Catering Center, 121 E 2nd Avenue, Roselle, NJ 07203.

Status:
Final

Date:
7/25/2026

## Decision 013 — Event-Configuration Publication

Decision:
The website will be prepared with complete content for both event configurations. Only the confirmed configuration will be active and guest-facing when the printed invitations are mailed.

Reason:
Approval for use of Warinanco Park cannot be confirmed before October 1, 2026, at the earliest, and the outdoor configuration also remains subject to weather.

Implementation Requirement:
Venue and schedule information must be maintained so that the active configuration can be selected without rewriting page components. The public Home, Venues, Travel, Schedule, and FAQ content must not display conflicting configurations at the same time. If Configuration A is active when invitations are mailed but inclement weather later requires the Sphinx-only fallback, Configuration B must be capable of being activated promptly without rebuilding the application.

Status:
Final

Date:
7/25/2026

## Decision 014 — Hotel Accommodation Block

Decision:
A block of hotel accommodations will be reserved at a nearby hotel for guests traveling from a distance.

* Hotel: To be determined.
* Check-in: Friday, April 30, 2027.
* Check-out: Sunday, May 2, 2027.

Implementation Requirement:
The Travel page must support the hotel name, address, reservation link or instructions, group-rate information, booking deadline, and accessibility information once the hotel is selected.

Status:
Final

Date:
7/25/2026

## Decision 015 — Final RSVP Question Set

Decision:
The couple-supplied private `Invitees List` spreadsheet and its bottom-row notes are authoritative for the substantive RSVP questions and how those questions are presented.

All active production invitations use one reusable spreadsheet-authoritative form structure. Invitation-specific variation comes from the source row rather than from separate production question structures.

### Attendance Control

The attendance interface is one coordinated three-checkbox group:

1. `Ceremony`
2. `Reception`
3. `Regretfully, I am unable to attend` or `Regretfully, we are unable to attend`, using the explicit `I/We wording` value from the source row.

Ceremony and Reception may be selected independently or together. Selecting either attending event disables the decline checkbox. Selecting decline disables Ceremony and Reception.

### Named `Plus1` Questions

When Column E contains one or more `Plus1` allocations:

* Render one Yes/No question for each allocation.
* Use the label `Will [Named Invitee] be accompanied by a +1?`
* When multiple `Plus1` entries appear in one row, the parenthesized invitee name following each `Plus1` identifies the named invitee for that question.
* A single unparenthesized `Plus1` is associated with the primary named invitee for that row.
* Do not request the additional guest's own name.

### Attendance Totals

For an attending RSVP, render numerical dial controls for:

* Adults, ages 21 and older.
* Young Adults, ages 18–20.
* Children, ages 3–17.
* Children under 3.

Each dial begins at zero and its current upper bound is the invitation maximum from Column F minus the values already allocated to the other age-category dials. The backend enforces the equivalent invariant that the total does not exceed the invitation maximum.

### Reception Attendee Names and Dietary Information

This section appears only when Reception is selected.

For every attending party member represented by the total attendance count, render:

1. An attendee-name field with a 100-character maximum.
2. A food-allergy / dietary-preference field with a 1000-character maximum.

The number of attendee-detail pairs must equal the complete attendance total. This data is cleared when Reception is no longer selected or the party fully declines.

### Operational Online Fields

Every online initial submission and revision must separately collect the operational confirmation fields required for the selected confirmation channel:

* Confirmation method.
* The applicable email address or SMS-capable mobile number.
* Any required transactional text-message authorization.

These operational fields are not substantive RSVP questions.

### Closed-Set Rule

Do not add accessibility, lodging, transportation, message-to-couple, entrée-selection, separate named-person attendance, or other substantive questions unless the authoritative source and project decisions are later revised.

Status:
Final

Date:
7/25/2026

Clarified:
9/19/2026

## Decision 016 — Blank RSVP Forms and Partial Revisions

Decision:
Every personalized RSVP form will load blank, including when the invitation code already has a stored response. The website will not prefill or display the party’s current stored answers.

For an initial RSVP, the guest must complete every field required to create a valid full response.

For a revision:

* The guest must re-enter the invitation code through the public RSVP entry page.
* The guest must re-enter the selected confirmation method, the applicable email address or SMS-capable mobile number, and any required transactional text-message authorization.
* Submitted operational confirmation fields replace the applicable stored confirmation method, destination, and authorization state.
* The guest may submit only the RSVP fields that need to change.
* A submitted RSVP change may explicitly replace a stored value, replace a positive numeric value with zero, change between attendance and decline, or clear a stored value through an authorized clear operation.
* An omitted RSVP field means only “leave the stored value unchanged.” Omission must never be interpreted as deletion or clearing.
* The backend must merge the submitted changes with the stored response, apply authorized dependent-value clearing, and validate the complete resulting RSVP before saving it.
* The merged response becomes the new current version.
* The guest and the couple receive confirmations containing the complete merged RSVP, not merely the fields submitted during that revision.

Explicit controls or values must be available when a guest needs to clear previously submitted information. The browser and backend must represent omission, replacement, explicit zero, attendance or decline changes, and explicit clearing as distinct operations without revealing the stored value.

Status:
Final

Date:
7/28/2026

Clarified:
7/29/2026

## Decision 017 — RSVP Confirmation Channels

Decision:
After every successful initial RSVP or revision:

* A protected administrative confirmation must be attempted by email.
* The invited party’s confirmation must be attempted through its selected method: email or text message.
* The guest must provide a valid destination applicable to the selected method and any required transactional text-message authorization.
* For a revision, the newly submitted method, destination, and authorization state replace their stored counterparts.
* The confirmation generated for both the couple and the invited party must contain the complete current RSVP.
* A text-message confirmation may use multiple message segments when necessary to include the complete RSVP.
* The guest and administrative delivery attempts must proceed independently after storage. Failure, delay, or uncertainty affecting one attempt must not prevent the other applicable attempt.
* Confirmation-delivery failure must not undo, duplicate, or increment an RSVP that was already stored successfully.
* Delivery results must be recorded separately by channel and attempt. Guest-facing confirmation may report the guest status and a limited administrative-attempt status but must not expose the protected administrative address.

The confirmation method, email address, mobile number, and any required SMS authorization are operational contact fields rather than substantive RSVP questions.

Status:
Final

Date:
7/28/2026

Clarified:
7/29/2026

## Decision 018 — Final-Month RSVP Countdown

Decision:
The RSVP entry page and personalized RSVP form will display a live countdown only during the final month before the online deadline.

Implementation Requirement:
The countdown will become visible at 12:00 a.m. EST on February 1, 2027 and will count down to Monday, March 1, 2027, at 11:59 p.m. EST. Before February 1, the pages will display the written deadline without a live countdown. At and after the deadline, the countdown will be replaced by the closed-RSVP state.

The countdown must be calculated from the `America/New_York` deadline rather than the guest’s device clock or local time zone.

Status:
Final

Date:
7/28/2026

## Decision 019 — Sticky Public Navigation

Decision:
The public website will use compact sticky navigation on desktop and mobile layouts.

Implementation Requirement:

* The navigation must remain available while the guest scrolls.
* The sticky header must not obscure headings, RSVP fields, validation messages, focused controls, or other essential content.
* Desktop navigation must present the approved primary links without overlap.
* Mobile navigation must use a clearly labeled and operable menu control rather than relying on an unexplained icon alone.
* The mobile menu must close after a destination is selected.
* Navigation must remain operable by touch and keyboard.

Status:
Final

Date:
7/28/2026

## Decision 020 — Internal and External Link Behavior

Decision:
Links to pages within `https://www.loreweavercreations.com/wedding/` will open in the same browser tab.

External media, hotel, and map links will open in a new browser tab.

Implementation Requirement:
New-tab links must use appropriate security attributes and must be identified accessibly so guests are not unexpectedly moved to another tab.

Status:
Final

Date:
7/28/2026

## Decision 021 — RSVP Privacy Notices

Decision:
The website will provide both:

1. A concise privacy notice on the RSVP entry page and personalized RSVP form.
2. A fuller public privacy page at:

   `https://www.loreweavercreations.com/wedding/privacy`

The concise notice must link to the full privacy page.

The full privacy page must explain, in plain language:

* How invitation codes are used.
* What RSVP and operational contact information is collected.
* That forms load blank and do not display stored RSVP answers or stored confirmation destinations.
* How partial revisions are merged with existing responses.
* That omitted RSVP fields remain unchanged and are distinct from explicit replacement, explicit zero, attendance or decline changes, and explicit clearing operations.
* That revision confirmation method, destination, and any required SMS authorization are entered again and replace their applicable stored counterparts.
* That RSVP information is stored in the private administrative system.
* That complete confirmations are attempted for the couple by protected administrative email and for guests by the selected email or text-message method after storage.
* That guest and administrative delivery attempts are handled independently and their results are recorded separately.
* Who may access the information.
* How long RSVP information is expected to be retained.
* How guests may request assistance or correction.
* That the site does not make unsupported guarantees of absolute security.

Status:
Final

Date:
7/28/2026

Clarified:
7/29/2026

## Decision 022 — Public Reception Schedule and Service Description

Decision:
The public website will present the wedding schedule as broad, confirmed guest-facing event blocks rather than as a restrictive internal reception itinerary.

The approved public time blocks are:

### Configuration A — Warinanco Park Ceremony and Sphinx Reception

* Ceremony at Warinanco Park: Saturday, May 1, 2027, from 10:30 a.m. to 12:00 p.m.
* Reception at Sphinx Banquet and Catering Center: Saturday, May 1, 2027, from 12:30 p.m. to 4:30 p.m.

### Configuration B — Entire Event at Sphinx

* Ceremony and reception at Sphinx Banquet and Catering Center: Saturday, May 1, 2027, from 11:30 a.m. to 4:30 p.m.
* The public website will not assign an exact internal transition time between the ceremony and reception portions unless a later approved decision establishes one.

Reception Structure:

* There will be no separately scheduled formal cocktail hour.
* There will be no separately scheduled formal dinner service.
* The meal will be a buffet-style brunch.
* The buffet will remain available throughout the reception portion of the event.
* Dancing may occur at various intervals during the reception rather than within one fixed published dancing period.
* The couple may describe buffet brunch, dancing, and other festivities as occurring “during the reception” without publishing exact internal start and end times for each activity.
* A possible self-service mimosa station remains pending confirmation with Sphinx Banquet and Catering Center and must not be presented as confirmed guest information until the couple and banquet hall finalize that arrangement.
* If the mimosa station is later confirmed, it may be described broadly as available during the reception unless a later approved decision establishes a more specific service window.

Implementation Requirement:
The public Schedule page must not publish a detailed timeline that unintentionally restricts the reception program or promises unconfirmed internal milestones.

Unless later finalized through a new recorded decision, the public site must not assign specific times to:

* Buffet opening or closing beyond the confirmed reception period.
* Cocktail service.
* Mimosa-station service.
* Dancing periods.
* First dances.
* Toasts or speeches.
* Cake service.
* Photographs.
* Other reception activities or transitions.

The Home, Venues, Schedule, Travel, and FAQ pages must use language consistent with the active event configuration and this flexible reception model.

Reason:
The ceremony and outer event times are confirmed, but the internal order of reception activities is intentionally flexible and remains partly under development with the banquet hall. Publishing only the confirmed time blocks gives guests the information they need without creating an inaccurate or unnecessarily restrictive event itinerary.

Status:
Final

Date:
7/28/2026

## Decision 023 — Production Invitation Configuration Mapping

Decision:
Each of the **57 rows** in the authoritative private `Invitees List` spreadsheet produces one private invitation-party configuration record.

The source-to-configuration mapping is:

* `inviteCode` — Guest ID normalized to the canonical six-character lookup key; `XXX-XXX` is retained only for approved display.
* `partyDisplayName` — use `Attendee Names Clarification` when populated; otherwise concatenate `First Name(s)` and `Last Name(s)` for the guest-facing form heading.
* `wordingMode` — taken directly from `I/We wording`; `I` maps to singular and `we` maps to plural.
* `maximumAttendance` — taken from `Total Potential Attendees (Including Plus1 and Kids)`.
* `additionalGuestAllocations` — one private allocation record per `Plus1`, including the named invitee used in the question label. Multiple allocations use the names supplied in parentheses in Column E.
* `active` and `environment` — protected backend configuration values distinguishing active production records from disabled development/testing records.

The current authoritative source does not require separate production invitation-specific form-configuration assignments. All 57 active production invitations use the same spreadsheet-authoritative substantive form model, with invitation-specific variation supplied by the row-level heading, wording mode, `Plus1` allocations, and maximum attendance.

Production-Source Validation Summary:

* 57 invitation records are present.
* 35 records use singular `I` wording and 22 use plural `we` wording.
* 23 records authorize at least one additional guest.
* 26 total `Plus1` allocations are represented.
* Two invitations authorize more than one additional guest.
* The sum of the supplied maximum-attendance values is 115.
* No active production placeholder code is required.

Implementation Requirement:
The transformation must be repeatable and validated. It must reject malformed codes, duplicate normalized keys, missing required source values, unsupported wording modes, malformed `Plus1` allocation text, invalid maximum-attendance values, allocation counts incompatible with maximum attendance, ambiguous heading data, or other contradictory records.

The real source spreadsheet, generated production configuration, and code-to-party/name mappings remain private and outside public source control and frontend build output.

Status:
Final

Date:
7/29/2026

Clarified:
9/19/2026

## Decision 024 — Phase 3 RSVP Privacy and Security Standard

Decision:

Phase 3 adopts the following mandatory privacy and security standard for the invitation-launch RSVP system.

### Invitation-Code Security Model

Invitation codes are limited access tokens used to select an authorized blank RSVP configuration. They are not passwords and must not be represented to guests as equivalent to strong account authentication.

The public application must not provide:

* A guest directory.
* A code-recovery search.
* A list of valid invitation codes.
* Close-match or “Did you mean?” code suggestions.
* Character-substitution guessing.
* A personalized browser route containing an invitation code.
* A public saved-RSVP lookup endpoint.

Invitation codes are accepted only through request bodies for the approved RSVP lookup and submission flows. They must not appear in browser paths, query strings, URL fragments, public metadata, analytics payloads, ordinary application logs, or public source files.

### Personalized Response and Browser Cache Policy

Personalized RSVP browser documents and RSVP API responses must not be stored in shared or persistent public caches.

The following responses must include:

`Cache-Control: no-store, max-age=0`

This applies to:

* `/wedding/rsvp/`.
* `/wedding/rsvp/confirmation`.
* Successful and unsuccessful `POST /wedding/api/rsvp/lookup` responses.
* Successful and unsuccessful `POST /wedding/api/rsvp/submit` responses.
* Any later response that contains invitation-specific RSVP configuration, guest-entered RSVP information, confirmation destinations, confirmation status, or other personalized RSVP data.

Static versioned application assets that contain no personalized or secret information may use ordinary cache optimization.

The initial confirmation implementation continues to use temporary React navigation/application state and does not persist the successful RSVP response merely to survive refresh.

### Search-Indexing and Metadata Policy

`/wedding/rsvp/`, `/wedding/rsvp/confirmation`, all controlled RSVP states, `/wedding/not-found`, and unmatched wedding routes must not be publicly indexed.

The RSVP and confirmation routes must use both appropriate page-level crawler directives and the production server's applicable no-index response behavior. They must not publish personalized values in titles, descriptions, canonical URLs, structured data, social-preview metadata, or other crawler-visible content.

The public Privacy page remains indexable.

### Analytics Policy

Analytics must not receive:

* Invitation codes.
* Guest or household identities derived from invitation records.
* RSVP answers.
* Dietary or allergy information.
* Email addresses.
* Mobile numbers.
* Confirmation destinations.
* `clientSubmissionId` values.
* Invitation-specific form-configuration details, including `Plus1` allocation mappings and derived additional-guest counts.
* RSVP version numbers.
* Delivery-provider payloads.

If analytics are used on RSVP or confirmation routes, events must be limited to non-personalized aggregate interaction names such as page/state visibility or generic form-error categories. Analytics must not be required for RSVP functionality.

### Routine Logging Policy

Ordinary application, reverse-proxy, and delivery logs must follow data minimization.

Routine logs may record:

* Server-generated request or correlation identifiers.
* Timestamp.
* Endpoint or route category.
* HTTP status.
* Request duration.
* Generic error category.
* Guest-selected delivery channel without the destination.
* Rate-limit events.
* Non-sensitive delivery outcome categories.

Routine logs must not record:

* Raw invitation codes.
* Guest names or party display names.
* Request or response bodies for RSVP lookup or submission.
* RSVP answers.
* Dietary or allergy text.
* Email addresses.
* Mobile numbers.
* Confirmation destinations.
* `clientSubmissionId` values.
* Spreadsheet rows or worksheet contents.
* Private administrative notes.
* Provider credentials or full provider payloads.

When a secured diagnostic investigation genuinely requires temporary correlation to one invitation, a non-reversible keyed pseudonymous identifier may be used instead of the raw invitation code. Diagnostic logging must be explicitly enabled, access-restricted, time-limited, and removed when the investigation ends.

### Rate-Limit Policy

The production RSVP API must apply server-side rate limiting in addition to ordinary validation.

The initial production limits are:

* `POST /wedding/api/rsvp/lookup`: maximum 10 requests per 15-minute rolling window per client IP address.
* `POST /wedding/api/rsvp/submit`: maximum 6 requests per 15-minute rolling window per client IP address.
* `POST /wedding/api/rsvp/submit`: maximum 6 requests per 15-minute rolling window per normalized invitation code.

A request that exceeds an applicable limit returns `429 Too Many Requests` with a guest-safe response and a `Retry-After` indication when supported by the implementation.

Rate-limit storage must not require raw invitation codes to be written to ordinary logs. A deployment behind a reverse proxy must derive client IP information only from the specifically trusted proxy chain rather than accepting arbitrary forwarded-address headers.

These limits may later be tightened or relaxed only through a recorded project decision if production testing shows that the approved values materially interfere with legitimate guest use or are insufficient against abuse.

### Backend Credential and Administrative Boundaries

Google credentials, Google service-account material, email credentials, SMS credentials, sender configuration, and the protected administrative recipient address must remain backend-only.

Secrets must not appear in:

* React source.
* Compiled browser assets.
* Browser storage.
* Public Nextcloud shares.
* Public documentation.
* Source-control commits.
* Ordinary logs.

Production secrets must be separate from development and testing secrets. Development/test invitation data must remain separate from production invitation data, and development fixtures must not be authorized in production.

The private Google Sheets workbook must remain non-public and accessible only to the couple, explicitly authorized administrators, and the backend service account.

### Guest-Safe Error Policy

Guest-facing errors must not expose:

* Stack traces.
* Framework or library error output.
* Filesystem paths.
* Spreadsheet identifiers.
* Worksheet names.
* Internal record identifiers.
* Provider names or provider error payloads when they would expose internal implementation details.
* Credential or secret information.
* Whether a near-match invitation code exists.
* Whether an inactive, development-only, or otherwise unauthorized invitation record exists.

Malformed, unknown, inactive, or environment-ineligible invitation codes must continue to produce neutral guest-facing invalid-invitation behavior.

### Protected Administrative Confirmation and Dietary-Information Boundary

The protected administrative RSVP confirmation is private correspondence and may contain the complete current RSVP, including applicable Reception attendee names and dietary/allergy information.

Reception attendee names and dietary/allergy information may also appear in:

* The submitting party's own temporary on-screen confirmation.
* The submitting party's own selected email or text-message confirmation.
* The authorized private administrative workbook and records required to operate the RSVP.

Reception attendee names and dietary/allergy information must not appear in analytics, public pages, public metadata, ordinary logs, unrelated administrative messages, or another invited party's response.

This rule preserves the already-approved requirement that guest and administrative confirmations contain the complete current RSVP while restricting attendee-name and dietary/allergy information to the submitting party and authorized private administrative surfaces.

### Mobile Numbers and SMS Use

A mobile number supplied for Text Message confirmation is private operational contact information and may be used only for the guest-requested transactional RSVP confirmation and approved manual resend unless the guest separately authorizes another use through a future recorded project decision.

The number must not be used for promotional, marketing, unrelated wedding messaging, or list building.

### SMS Provider Disclosure Gate

Phase 3 does not require selection of the production SMS provider.

The permanent form schema may continue to use the approved `smsAuthorization` question identifier and provider-neutral authorization framework.

Before Text Message confirmation is enabled in production:

1. The actual SMS provider must be selected.
2. The provider's current required disclosure, consent, sender-identification, opt-out/help, carrier-rate, and other legally or contractually required language must be reviewed.
3. The guest-facing authorization copy must be updated to include the verified provider-specific language that actually applies.
4. The provider credentials and sender configuration must be stored through the backend-only secret boundary.
5. The resulting copy and implementation must be tested before production activation.

If the provider has not been selected or the required disclosure copy has not been verified by launch, Text Message confirmation must remain disabled rather than displaying invented provider-specific language.

### Security Wording

Public copy may explain the actual safeguards used by the project, but it must not promise that the RSVP system is “completely secure,” “100% secure,” “unhackable,” or otherwise absolutely protected.

Privacy and security wording must describe actual practices and reasonable safeguards without making guarantees that the implementation cannot support.

### RSVP Data Retention Standard

The production RSVP system follows a data-minimization retirement schedule tied to the wedding date of May 1, 2027.

The complete active RSVP dataset may be retained through **July 30, 2027**, which is 90 days after the wedding.

No later than July 30, 2027, the active RSVP system must delete or irreversibly de-identify the following RSVP-operational data when it is no longer needed for an unresolved correction, delivery issue, or other documented administrative necessity:

* Current RSVP responses.
* Superseded RSVP versions.
* Reception attendee names and dietary/allergy text.
* Guest confirmation email addresses.
* Guest confirmation mobile numbers.
* SMS authorization records.
* `clientSubmissionId` values.
* Guest and administrative delivery-attempt records.
* Submission and revision timestamps when retained only as RSVP transaction history.
* Active invitation-code-to-RSVP-response mappings used solely by the website.

Backups that contain retired RSVP-operational data must expire through the ordinary protected backup rotation no later than **August 29, 2027**, 30 days after active-data retirement.

After retirement, the couple may retain non-identifying aggregate wedding statistics, such as total attendance counts, if those records cannot reasonably be used to reconstruct an invited party's RSVP.

The separate private `Invitees List` used as a personal wedding-planning/address record is not automatically destroyed by this RSVP-system retention rule, but after RSVP retirement it must no longer remain exposed to or required by the public RSVP application. Any later personal retention of that source remains outside the active wedding website.

If a particular RSVP record must temporarily be retained beyond the ordinary retirement date for a documented correction, dispute, delivery investigation, or other concrete administrative need, only the minimum necessary record may be retained and it must be deleted when that need ends.

### Production Transport

The production wedding website and RSVP API must be served over HTTPS. Ordinary HTTP requests must redirect to HTTPS before RSVP information is submitted.

Status:
Final

Date:
8/20/2026

---

# Functional Requirements Register

The following requirements define the mandatory, recommended, and post-wedding functions of the Loreweaver Creations wedding website.

Requirement identifiers must remain permanent. If a requirement is later removed or replaced, mark it **Superseded** rather than deleting or renumbering it.

Priority definitions:

* **Required:** Must be completed before the invitation-launch version is publicly available.
* **Recommended:** Should be completed before launch unless technical or scheduling constraints require postponement.
* **Later:** Belongs to the post-wedding or long-term version and must not delay the invitation-launch version.

---

## SITE Requirements

### SITE-001 — Wedding Application Base Path

**Requirement:**
The wedding website must operate as a contained application beneath:

`https://www.loreweavercreations.com/wedding/`

**Priority:**
Required

**Completion Test:**
Every public production route begins with `/wedding/`, and the application functions without assuming that it is hosted at the domain root.

**Status:**
Approved

---

### SITE-002 — Responsive Application

**Requirement:**
The website must use a single responsive application for desktop computers, laptops, tablets, and mobile phones.

**Priority:**
Required

**Completion Test:**
All launch pages and RSVP functions remain usable at representative phone, tablet, laptop, and desktop viewport widths.

**Status:**
Approved

---

### SITE-003 — Sticky Public Navigation

**Requirement:**
The website must provide compact sticky public navigation on desktop and mobile layouts.

**Priority:**
Required

**Completion Test:**
A guest can reach every public page from the primary navigation without returning to the homepage first; the navigation remains available while scrolling; desktop links do not overlap; the mobile menu uses a clearly labeled control; and the sticky header does not obscure essential content.

**Status:**
Final

---

### SITE-004 — Prominent RSVP Access

**Requirement:**
RSVP access must remain prominent throughout the public website.

**Priority:**
Required

**Completion Test:**
RSVP appears in the primary navigation, as a prominent homepage action, and in the site footer.

**Status:**
Approved

---

### SITE-005 — Static Invitation QR Code

**Requirement:**
The static QR code printed on all 57 assigned invitations must open:

`https://www.loreweavercreations.com/wedding/`

**Priority:**
Required

**Completion Test:**
Scanning the QR code from any printed invitation opens the public wedding homepage.

**Status:**
Final

---

### SITE-006 — QR-Code Landing Experience

**Requirement:**
The wedding homepage must explain or clearly indicate how a guest proceeds from the public homepage to the RSVP system.

**Priority:**
Required

**Completion Test:**
A guest arriving through the printed QR code can locate and open the RSVP page without needing outside instructions.

**Status:**
Approved

---

### SITE-007 — Wedding-Specific Not-Found Page

**Requirement:**
The application must provide a wedding-specific not-found page for invalid public routes beneath `/wedding/`.

**Priority:**
Required

**Completion Test:**
Navigating to an unknown wedding route displays a branded error page with links to Home, RSVP, Venues, and FAQ instead of a generic server error.

**Status:**
Approved

---

### SITE-008 — Stable Public Routes

**Requirement:**
Public pages must use stable, human-readable routes.

**Priority:**
Required

**Completion Test:**
Home, RSVP, Theme and Attire, Our Story, Read, Listen, and Watch, Venues, Travel, Schedule, FAQ, Privacy, and Gallery each have a documented route that remains stable through deployment.

**Status:**
Approved

---

### SITE-009 — Nested-Route Refresh Support

**Requirement:**
Direct navigation and browser refresh must work on every public React route.

**Priority:**
Required

**Completion Test:**
Opening or refreshing a nested route such as `/wedding/story` or `/wedding/rsvp/` does not produce a server 404 response.

**Status:**
Approved

---

### SITE-010 — Public Assistance Information

**Requirement:**
The public website must provide visible contact or assistance information where appropriate.

**Priority:**
Required

**Completion Test:**
Guests can find `RSVPhelp@loreweavercreations.com` on the RSVP page and in relevant RSVP error or assistance states.

**Status:**
Final

---

### SITE-011 — Invitation-Launch Readiness

**Requirement:**
The invitation-launch version must be operational before the printed invitations are mailed, which will occur no earlier than October 1, 2026.

**Priority:**
Required

**Completion Test:**
Before the invitations are mailed, the production website is accessible at the approved address, the RSVP system passes its launch tests, and the public pages display only the confirmed event configuration.

**Status:**
Final

---

### SITE-012 — Final-Month RSVP Countdown

**Requirement:**
The RSVP entry page and personalized RSVP form must display a live deadline countdown only during the final month before the online RSVP deadline.

**Priority:**
Required

**Completion Test:**
Before February 1, 2027, the pages display the written deadline without a live countdown. Beginning at 12:00 a.m. EST on February 1, the countdown displays the remaining time until March 1, 2027, at 11:59 p.m. EST. At and after the deadline, the countdown is replaced by the closed-RSVP state.

The countdown is calculated from the `America/New_York` deadline rather than the guest’s device time zone or clock.

**Status:**
Final

---

### SITE-013 — Internal and Designated External Link Behavior

**Requirement:**
Internal wedding-site links must open in the same browser tab, while external media, hotel, and map links must open in a new tab.

**Priority:**
Required

**Completion Test:**
Links whose destination remains beneath `https://www.loreweavercreations.com/wedding/` use same-tab navigation. External retailer, library, streaming, hotel, booking, and map links open in a new tab, use appropriate security attributes, and are identified accessibly as new-tab links.

**Status:**
Final

---

### SITE-014 — Public Wedding Privacy Page

**Requirement:**
The website must provide a public privacy page at `/wedding/privacy`.

**Priority:**
Required

**Completion Test:**
The Privacy page is reachable from the concise RSVP privacy notice and the public footer, explains the approved RSVP-data practices in plain language, and remains available without an invitation code.

**Status:**
Final

---

## RSVP Requirements

### RSVP-001 — Manual Invitation-Code Entry

**Requirement:**
Guests must be able to enter the six-character invitation code printed on their invitation through a manually accessible RSVP page.

**Priority:**
Required

**Completion Test:**
Entering a valid production code on `/wedding/rsvp/` opens the correct personalized RSVP form.

**Status:**
Approved

---

### RSVP-002 — Personalized RSVP URLs

**Requirement:**
The RSVP system must support personalized URLs ending with the applicable invitation code.

**Priority:**
Required

**Completion Test:**
A route in the format `/wedding/rsvp/XXX-XXX` retrieves and displays the form associated with that invitation code.

**Status:**
Superseded

**Superseded By:**
Decision 009 and RSVP-001. Guests must manually enter their invitation code on `/wedding/rsvp/`; invitation codes must not be placed in or retained within public URLs.

---

### RSVP-003 — Reusable Form-Building System

**Requirement:**
The application must use one reusable RSVP form-building system rather than a separately coded form page for each invitation.

**Priority:**
Required

**Completion Test:**
The same React renderer and backend form-building process serve every invitation while applying the spreadsheet-authoritative party heading, singular or plural wording, authorized named-invitee `Plus1` allocation configuration, maximum attendance, coordinated attendance controls, age-category dials, and Reception-only attendee-detail rules. No invitation requires a separately coded React page.

**Status:**
Final

---

### RSVP-004 — Invitation-Specific Questions

**Requirement:**
Every active production invitation must use the spreadsheet-authoritative closed RSVP question structure. Invitation-specific variation is limited to the source-controlled party heading, singular or plural wording, named `Plus1` allocations, maximum attendance, and the resulting repeated attendee-detail count.

**Priority:**
Required

**Completion Test:**
The validated invitation renders the correct `I` or `We` wording, exactly one Yes/No question for each authorized named-invitee `Plus1` allocation, four bounded age-category dials for an attending response, and exactly one attendee-name/dietary pair per attending party member when Reception is selected. No invitation receives an unapproved substantive question.

**Status:**
Final

---

### RSVP-005 — Isolation of Invitation Records

**Requirement:**
The browser must not receive invitation records belonging to other households or invited parties, and a valid invitation-code lookup must not return the party’s stored RSVP answers for prefilling.

**Priority:**
Required

**Completion Test:**
A personalized-form API response contains only the configuration needed to render the requested party’s blank form—such as wording mode, `Plus1` allocation configuration, party maximum, authorized invitation configuration, and permitted question schema—and contains no other codes, other guest identities, stored RSVP answers, confirmation destinations, private notes, source-spreadsheet rows, or unrelated configuration records.

**Status:**
Final

---

### RSVP-006 — Invitation-Code Normalization

**Requirement:**
The backend must normalize invitation codes consistently and authoritatively. Client normalization is for usability only.

**Priority:**
Required

**Completion Test:**
For every lookup and submission, the backend converts the received value to a string, trims leading and trailing whitespace, removes internal ordinary whitespace, removes hyphens, converts letters to uppercase, rejects any remaining character outside `A–Z` and `0–9`, and confirms that exactly six characters remain.

The six-character value is used for internal lookup and is formatted as `XXX-XXX` only for guest-facing display. Lowercase letters, omitted hyphens, and ordinary spaces are accepted when the resulting value is otherwise valid; underscores, punctuation, short values, and long values are rejected.

Runtime validation checks format and existence. It does not re-enforce the historical code-generation rule concerning the minimum number of letters.

The 57 production codes in the authoritative private source all pass these rules and produce 57 unique canonical keys with no normalization collision.

**Status:**
Final

---

### RSVP-007 — Neutral Invalid-Code Handling

**Requirement:**
Invalid or unknown invitation codes must produce a neutral guest-facing error message.

**Priority:**
Required

**Completion Test:**
The error does not reveal whether a similar code exists, another guest’s identity, the number of invitations, spreadsheet data, or internal application details.

**Status:**
Approved

---

### RSVP-008 — Dynamic Invitation Loading

**Requirement:**
The RSVP system must load invitation records dynamically.

**Priority:**
Required

**Completion Test:**
Application logic functions from the available configuration records and does not assume that the production list always contains a hard-coded number of records.

**Status:**
Final

---

### RSVP-009 — Production Invitation Count

**Requirement:**
The production invitation configuration must contain 57 active invitation codes corresponding to the 57 populated records in the authoritative `Invitees List`.

**Priority:**
Required

**Completion Test:**
The authoritative private source contains exactly 57 populated production records. Before launch, each row transforms into one active private configuration, each normalized code resolves to its intended invited party, no normalized key is duplicated, and no placeholder or testing record is enabled as production.

**Status:**
Final

### RSVP-010 — Disabled Placeholder and Test Codes

**Requirement:**
Any placeholder or development-only invitation code must remain disabled in production.

**Priority:**
Required

**Completion Test:**
Test or placeholder codes work only in an explicitly configured development or testing environment and are rejected by the production application.

**Status:**
Approved

---

### RSVP-011 — Individual Attendance Controls

**Requirement:**
Each named invitee must have an individual attendance control.

**Priority:**
Required

**Completion Test:**
A household containing multiple invited people can record accepting and declining responses separately for each person.

**Status:**
Superseded

**Superseded By:**
RSVP-051, RSVP-052, RSVP-053, and RSVP-065. Attendance is recorded at the invitation-party level through event selections and the fields included by the invitation’s authorized invitation configuration.

---

### RSVP-012 — Mixed Household Attendance

**Requirement:**
The system must support mixed attendance within a household or invited party.

**Priority:**
Required

**Completion Test:**
One invited person may accept while another person associated with the same code declines.

**Status:**
Superseded

**Superseded By:**
RSVP-052 and RSVP-055. The finalized RSVP form does not collect individual named-guest attendance.

---

### RSVP-013 — Authorized Plus Ones

**Requirement:**
Each authorized `Plus1` allocation in the authoritative source must render as its own Yes/No question associated with the named invitee.

**Priority:**
Required

**Completion Test:**
Rows without `Plus1` receive no plus-one question. A row with one `Plus1` receives one question using `Will [Named Invitee] be accompanied by a +1?`. A row with multiple `Plus1` allocations receives one such question for each allocation using the parenthesized invitee names from the source. No field requests the additional guest's own name.

**Status:**
Final

### RSVP-014 — Invited Children

**Requirement:**
Invited children are represented in the attendance-total dials rather than through separate named-child attendance controls.

**Priority:**
Required

**Completion Test:**
Children ages 3–17 and children under 3 are counted through their respective numerical dials. The form does not create named-child attendance checkboxes solely because Column E records children.

**Status:**
Final

### RSVP-015 — Buffet-Style Brunch

**Requirement:**
The wedding meal must be represented as a buffet-style brunch rather than as a formal plated dinner, and the RSVP form must not request entrée selections.

**Priority:**
Required

**Completion Test:**
No entrée, main-course, or meal-choice control appears in any production RSVP form.

Public meal information describes buffet-style brunch service during the reception and does not promise a separately scheduled formal dinner period.

**Status:**
Final

---

### RSVP-016 — Reception Attendee Dietary Information

**Requirement:**
When Reception is selected, the form must collect one attendee name plus one food-allergy/dietary-preference field for each attending party member.

**Priority:**
Required

**Completion Test:**
The number of attendee-detail pairs equals the complete attendance total. Every pair contains a required attendee-name field limited to 100 characters and an optional dietary/allergy field limited to 1000 characters. Ceremony-only attendance does not display this section.

**Status:**
Final

### RSVP-017 — Conditional Reception Attendee Details

**Requirement:**
Reception attendee name/dietary pairs appear only when Reception is part of the complete attendance selection.

**Priority:**
Required

**Completion Test:**
Selecting Reception makes the attendee-detail list applicable and requires exactly one entry per attending party member. Ceremony-only attendance and full decline make the list inapplicable. Removing Reception or fully declining clears the stored list during authoritative dependency processing.

**Status:**
Final

### RSVP-018 — Accessibility Questions

**Requirement:**
The RSVP system must support accessibility questions when enabled for an invitation.

**Priority:**
Required

**Completion Test:**
Applicable invitations can request accessibility assistance and display a details field when assistance is requested.

**Status:**
Superseded

**Superseded By:**
Decision 015 and RSVP-065. Accessibility questions are not part of the spreadsheet-authoritative production RSVP question structure.

---

### RSVP-019 — Travel Questions

**Requirement:**
The RSVP system must support lodging or transportation questions when enabled for an invitation.

**Priority:**
Required

**Completion Test:**
Applicable invitations display configured travel questions, while invitations without those questions do not receive them.

**Status:**
Superseded

**Superseded By:**
Decision 015 and RSVP-065. Lodging and transportation questions are not part of the spreadsheet-authoritative production RSVP question structure; hotel and transportation information belongs on public planning pages.

---

### RSVP-020 — Confirmation Contact and Delivery Method

**Requirement:**
Every online initial submission and revision must collect the operational contact information required for the guest’s selected confirmation method.

**Priority:**
Required

**Completion Test:**
The guest selects Email or Text Message and supplies the applicable valid email address or SMS-capable mobile number and any required transactional text-message authorization. A submission is rejected with a clear field error when the method, destination, or required authorization is missing or invalid.

For a revision, the operational confirmation fields are entered again and replace the applicable stored method, destination, and authorization state. These fields are documented as operational confirmation fields rather than as part of the mail-in RSVP question set.

**Status:**
Final

---

### RSVP-021 — Online RSVP Deadline

**Requirement:**
The deadline for all online RSVP submissions and revisions must be Monday, March 1, 2027, at 11:59 p.m. EST.

**Priority:**
Required

**Completion Test:**
Valid submissions and revisions are accepted before the deadline and rejected at or after the deadline.

**Status:**
Final

---

### RSVP-022 — Deadline Time Zone

**Requirement:**
The RSVP deadline must be enforced according to the `America/New_York` time zone rather than according to the guest’s device time zone.

**Priority:**
Required

**Completion Test:**
Deadline testing produces the same result regardless of browser location or device clock settings.

**Status:**
Approved

---

### RSVP-023 — Unlimited Revisions

**Requirement:**
Guests must be able to revise their RSVP without a numerical limit before the deadline.

**Priority:**
Required

**Completion Test:**
Repeated valid submissions using the same invitation code update the existing response instead of creating duplicate household or attendee records.

**Status:**
Final

---

### RSVP-024 — Latest Submission Controls

**Requirement:**
The most recent valid complete response produced by an initial submission or merged revision before the deadline must supersede all earlier versions of that invitation’s response.

**Priority:**
Required

**Completion Test:**
The private response records identify the latest fully merged version as current while retaining appropriate timestamps or revision history.

**Status:**
Final

---

### RSVP-025 — Multiple-Device Access

**Requirement:**
An invitation code may be used from more than one browser or device.

**Priority:**
Required

**Completion Test:**
A guest can enter the invitation code and submit a valid revision from another supported device before the deadline. The form still loads blank and does not retrieve or prefill the stored response.

**Status:**
Final

---

### RSVP-026 — Server-Side Validation

**Requirement:**
The backend must validate every submitted answer independently of browser-side validation.

**Priority:**
Required

**Completion Test:**
Invalid, unauthorized, malformed, or manipulated payloads are rejected even when sent outside the normal React interface.

**Status:**
Approved

---

### RSVP-027 — Unauthorized Questions

**Requirement:**
The backend must reject substantive fields, dynamic allocation identifiers, or attendee-detail structures that are not authorized by the validated invitation configuration and the spreadsheet-authoritative question set.

**Priority:**
Required

**Completion Test:**
Unknown question IDs, unknown `Plus1` allocation IDs, extra attendee-detail entries, malformed attendee-detail objects, accessibility/travel/message/entrée fields, or any other unsupported substantive field cause rejection and no unauthorized data is stored.

**Status:**
Final

### RSVP-028 — Unauthorized Guest IDs

**Requirement:**
The backend must reject guest IDs that do not belong to the submitted invitation.

**Priority:**
Required

**Completion Test:**
A request containing an unrelated or invented guest ID is rejected.

**Status:**
Superseded

**Superseded By:**
Decision 015 and RSVP-055. The finalized party-level payload does not use named-guest attendance IDs.

---

### RSVP-029 — Maximum Attendance

**Requirement:**
The backend must enforce each invitation's Column-F maximum attendance.

**Priority:**
Required

**Completion Test:**
Adults 21+, Young Adults 18–20, Children 3–17, and Children under 3 are nonnegative whole numbers. Their sum is at least one when attending and never exceeds `maximumAttendance`. The browser's four dials apply the same limit interactively by reducing each dial's maximum according to the values already allocated to the other dials.

The number of attending authorized `Plus1` allocations cannot exceed the complete attendance total.

**Status:**
Final

### RSVP-030 — Clearing Inapplicable Answers

**Requirement:**
The backend must clear stored values that become inapplicable because of a controlling attendance change.

**Priority:**
Required

**Completion Test:**
A full decline clears event attendance, per-allocation `Plus1` responses, attendance totals, and Reception attendee details. Changing from Reception attendance to Ceremony-only clears Reception attendee details. Operational confirmation remains required.

**Status:**
Final

### RSVP-031 — Initial Response Creation

**Requirement:**
A first-time RSVP submission must create one current party-level response without duplicate invitation records.

**Priority:**
Required

**Completion Test:**
When no response exists for the invitation, the backend requires every substantive field made applicable by that invitation’s authorized configuration and the guest’s current selections. The stored response contains Ceremony/Reception selections or decline status, one response for each applicable named-invitee `Plus1` allocation, all four age-category totals for an attending response, the complete Reception attendee-name/dietary list when Reception is selected, the selected confirmation method and destination, any required transactional SMS authorization, timestamp, version, and client submission identifier.

Conditionally inapplicable fields are not required, stored as fabricated answers, or accepted from the browser.

**Status:**
Final

---

### RSVP-032 — RSVP Partial-Update and Upsert Process

**Requirement:**
A revised RSVP submission must merge submitted changes into the existing party-level response rather than append a duplicate current response, replace omitted fields with blanks, or treat omission as deletion.

**Priority:**
Required

**Completion Test:**
For an existing response:

* Submitted RSVP fields replace the corresponding stored values.
* Submitted explicit zero values replace previously positive numeric values where zero is valid.
* Submitted authorized clear operations remove the applicable stored values.
* Submitted attendance or decline changes apply the required mutually exclusive and dependent-value clearing behavior.
* Omitted RSVP fields retain their stored values and mean only “leave unchanged.”
* Re-entered confirmation method, destination, and required SMS authorization replace their applicable stored counterparts.
* The backend validates the complete merged response before saving it.
* The merged response becomes the new current version.
* The submission version increments without creating a second current invitation record.

**Status:**
Final

---

### RSVP-033 — Initial Versus Revised Submission

**Requirement:**
The system must distinguish between an initial submission and a later revision.

**Priority:**
Required

**Completion Test:**
The response record, administrative alert, and guest confirmation identify whether the action was new or updated.

**Status:**
Approved

---

### RSVP-034 — Initial Guest Confirmation Delivery

**Requirement:**
Every successful initial RSVP submission must send a confirmation through the guest’s selected delivery method: email or text message.

**Priority:**
Required

**Completion Test:**
The response is stored, a confirmation-delivery attempt is made to the selected valid destination, the message contains the complete current RSVP, and the delivery result is recorded.

**Status:**
Final

---

### RSVP-035 — Revised Guest Confirmation Delivery

**Requirement:**
Every successful RSVP revision must attempt a new confirmation through the method and destination re-entered for that revision.

**Priority:**
Required

**Completion Test:**
After the partial revision is merged and stored, the guest-confirmation attempt uses the newly submitted method, destination, and applicable SMS authorization; contains the complete current RSVP rather than only the changed fields; and records the result without creating another RSVP version.

**Status:**
Final

---

### RSVP-036 — Administrative RSVP Confirmations

**Requirement:**
Every successful initial submission or revision must trigger an administrative email to the configured address.

**Priority:**
Required

**Completion Test:**
The administrative email identifies the invitation, states whether the action is new or revised, and contains the complete current RSVP. This includes Ceremony/Reception or decline status, each applicable named-invitee `Plus1` response, all four age-category totals and overall attendance when attending, the Reception attendee-name/dietary list when Reception is selected, guest confirmation method and destination, submission version, and timestamp.

The email does not invent or display fields that are not applicable to the invitation’s spreadsheet-authoritative form configuration and current attendance state.

**Status:**
Final

---

### RSVP-037 — Sensitive Information in Administrative Alerts

**Requirement:**
Administrative RSVP alert emails must not reproduce sensitive free-text guest responses.

**Priority:**
Required

**Completion Test:**
Administrative alerts omit food-allergy or dietary-preference text.

**Status:**
Superseded

**Superseded By:**
Decision 017, RSVP-036, and PRIVACY-016. The couple’s administrative email must contain the complete current RSVP, including the applicable Reception attendee-name/dietary list, and must therefore be handled as a protected private message.

---

### RSVP-038 — RSVP Write Before Confirmation Delivery

**Requirement:**
RSVP data must be written successfully before guest confirmation or administrative email delivery is attempted. After storage, the guest and administrative delivery attempts must proceed independently.

**Priority:**
Required

**Completion Test:**
An email- or text-message-delivery failure cannot prevent or roll back an otherwise valid spreadsheet update, and failure, delay, or uncertainty affecting one post-storage delivery attempt does not prevent the other applicable attempt.

**Status:**
Final

---

### RSVP-039 — Confirmation-Delivery Failure and Duplicate Prevention

**Requirement:**
Failure, delay, or uncertainty affecting an email, text-message, or administrative-email delivery attempt must not create or encourage a duplicate RSVP submission and must not block the other applicable delivery attempt.

**Priority:**
Required

**Completion Test:**
When the RSVP is stored but one or more delivery attempts fail or remain uncertain, the guest receives a success-with-warning state rather than an instruction to resubmit. The stored RSVP version is unchanged, and each applicable delivery attempt has its own recorded outcome.

**Status:**
Final

---

### RSVP-040 — Confirmation-Delivery Status

**Requirement:**
The system must record guest-confirmation and administrative-email delivery status separately by channel and attempt.

**Priority:**
Required

**Completion Test:**
The couple can determine independently whether the guest email or text message and the administrative email were attempted, accepted or sent, failed, remain pending or uncertain, or were resent. Guest-facing confirmation may show the guest-delivery status and only a limited administrative-attempt status without exposing the protected administrative address.

**Status:**
Final

---

### RSVP-041 — Manual Confirmation Resend

**Requirement:**
The couple must have a documented manual method for resending a failed guest confirmation through the applicable email or text-message channel.

**Priority:**
Required

**Completion Test:**
A failed confirmation can be resent with the complete current RSVP without altering, incrementing, or duplicating the RSVP response.

**Status:**
Final

---

### RSVP-042 — On-Screen Confirmation

**Requirement:**
After the initial submission or merged revision is stored, the on-screen confirmation page must display the complete current guest-facing RSVP summary for the invitation’s spreadsheet-authoritative form configuration and current attendance state together with the approved limited confirmation metadata.

**Priority:**
Required

**Completion Test:**
A successful submission displays the recorded Ceremony and Reception selections or decline status, each applicable named-invitee `Plus1` response, all four age-category totals and overall attendance when attending, the Reception attendee-name/dietary list when Reception is selected, whether the action was an initial submission or revision, submission timestamp, selected guest confirmation channel, guest-delivery status, and a limited administrative-attempt status.

The confirmation omits fields that are not applicable to the invitation’s current form state and does not expose the administrative email address, private spreadsheet fields, administrative notes, provider credentials, internal identifiers, or another invitation record.

**Status:**
Final

---

### RSVP-043 — Confirmation Refresh Behavior

**Requirement:**
Confirmation-page details do not need to survive a browser refresh.

**Priority:**
Required

**Completion Test:**
Refreshing the confirmation route without temporary confirmation state displays a safe explanatory message, states that the prior RSVP may already have been recorded, and directs the guest back to manual RSVP entry without instructing the guest to resubmit.

**Status:**
Final

---

### RSVP-044 — Revision Instructions

**Requirement:**
The confirmation page and guest confirmation message must explain that the RSVP may be revised without limit until March 1, 2027, at 11:59 p.m. EST.

**Priority:**
Required

**Completion Test:**
Both confirmation surfaces explain that the guest should return to the RSVP entry page, enter the invitation code again, re-enter the selected confirmation method, applicable destination, and any required SMS authorization, and submit only the RSVP fields that need to change. The instructions distinguish omission from replacement, explicit zero, attendance or decline changes, and explicit clearing; explain that omitted RSVP fields remain unchanged; and state that the next confirmation will contain the complete updated RSVP.

**Status:**
Final

---

### RSVP-045 — Printed RSVP Alternative

**Requirement:**
The RSVP page must explain that alternative printed RSVP slips were supplied with the physical invitations.

**Priority:**
Required

**Completion Test:**
Guests are informed that they may return the printed RSVP slip instead of using the online system.

**Status:**
Final

---

### RSVP-046 — RSVP Assistance Email

**Requirement:**
The RSVP page must direct guests experiencing online difficulties to `RSVPhelp@loreweavercreations.com`.

**Priority:**
Required

**Completion Test:**
The address appears in the RSVP instructions and relevant failure or invalid-code states.

**Status:**
Final

---

### RSVP-047 — Closed RSVP State

**Requirement:**
The RSVP system must provide a closed state after the online deadline.

**Priority:**
Required

**Completion Test:**
After the deadline, forms are non-editable and display the deadline and contact instructions for late changes.

**Status:**
Approved

---

### RSVP-048 — Duplicate Submission Protection

**Requirement:**
The RSVP system must prevent duplicate processing caused by repeated clicks, rapid duplicate requests, retries, or ambiguous network outcomes.

**Priority:**
Required

**Completion Test:**
Repeated processing of the same client submission identifier returns an idempotent result and creates only one RSVP version for the intended submission.

**Status:**
Final

---

### RSVP-049 — Uncertain Submission State

**Requirement:**
The RSVP system must provide a safe response when the browser cannot determine whether a submission was recorded because of a network interruption or another ambiguous client-side outcome.

**Priority:**
Required

**Completion Test:**
The state does not claim success or failure without evidence, directs the guest to check the selected confirmation destination and use the approved assistance path, warns against blind repeated submission, and permits a safe retry using the same client submission identifier so no duplicate RSVP version is written.

**Status:**
Final

---

### RSVP-050 — RSVP Search Indexing

**Requirement:**
The RSVP entry, form, and confirmation experience must not be indexed by public search engines.

**Priority:**
Required

**Completion Test:**
The RSVP entry and confirmation routes use appropriate metadata and crawler directives. No public invitation-code URL pattern exists.

**Status:**
Final

---

### RSVP-051 — Invitation-Specific Singular or Plural Wording

**Requirement:**
Attendance and decline prompts must use invitation-specific singular or plural wording.

**Priority:**
Required

**Completion Test:**
Single-person invitations use “I will be attending” and “I am unable to attend,” while multi-person invitations use “We will be attending” and “We are unable to attend.”

**Status:**
Final

---

### RSVP-052 — Ceremony and Reception Attendance Selection

**Requirement:**
The browser must present Ceremony, Reception, and the applicable decline wording as one coordinated three-checkbox attendance interface.

**Priority:**
Required

**Completion Test:**
Ceremony and Reception may be checked independently or together. Selecting either disables the decline checkbox. Selecting decline disables Ceremony and Reception. The backend still validates the authoritative event-selection and decline values independently of the browser state.

**Status:**
Final

### RSVP-053 — Mutually Exclusive Decline Response

**Requirement:**
The decline checkbox must use the explicit singular/plural wording mode from the invitation configuration and remain mutually exclusive with Ceremony and Reception.

**Priority:**
Required

**Completion Test:**
Singular invitations display `Regretfully, I am unable to attend.` and plural invitations display `Regretfully, we are unable to attend.` Selecting decline prevents Ceremony/Reception selection and vice versa.

**Status:**
Final

### RSVP-054 — Named-Invitee `Plus1` Questions

**Requirement:**
Each source `Plus1` allocation must create one named-invitee Yes/No question.

**Priority:**
Required

**Completion Test:**
The question is `Will [Named Invitee] be accompanied by a +1?`. Multiple allocations render in succession as separate questions using the source-specified associated invitee names. No additional-guest name is requested.

**Status:**
Final

### RSVP-055 — Party Totals by Age Category

**Requirement:**
Every attending production RSVP must collect the complete party total through four age-category numerical dials.

**Priority:**
Required

**Completion Test:**
The four dials represent Adults 21+, Young Adults 18–20, Children 3–17, and Children under 3. Each accepts whole numbers from zero up to the remaining available capacity, and the final sum is between one and the invitation maximum.

**Status:**
Final

### RSVP-056 — Reception Attendee Names and Dietary Responses

**Requirement:**
When Reception is selected, the form must collect attendee-specific name and dietary/allergy information rather than one party-level dietary field.

**Priority:**
Required

**Completion Test:**
The form renders exactly one attendee-detail pair for each person in the complete attendance total. `attendeeName` is required and limited to 100 characters; `dietaryPreferences` is optional and limited to 1000 characters. The list is absent for Ceremony-only attendance and full decline.

**Status:**
Final

### RSVP-057 — Closed RSVP Question Set and Spreadsheet Parity

**Requirement:**
The substantive online RSVP questions must remain consistent with the authoritative spreadsheet bottom-row display notes.

**Priority:**
Required

**Completion Test:**
The production form contains only the coordinated attendance triad, authorized named-invitee `Plus1` Yes/No questions, the four age-category dials, and Reception-only repeating attendee-name/dietary pairs. It does not introduce accessibility, lodging, transportation, message-to-couple, entrée-selection, or separate named-person attendance questions.

The separately required confirmation method, confirmation destination, and any applicable SMS authorization remain operational online fields.

**Status:**
Final

### RSVP-058 — Blank Personalized Form on Every Load

**Requirement:**
Every valid invitation-code lookup must render a blank personalized RSVP form, regardless of whether the invitation already has a stored response.

**Priority:**
Required

**Completion Test:**
Initial and returning guests receive the applicable wording, eligibility, party maximum, and question structure, but no stored RSVP answer, confirmation destination, or prior selection is displayed or prefilled.

**Status:**
Final

---

### RSVP-059 — Partial RSVP Revisions

**Requirement:**
A returning guest must be able to submit only the RSVP fields that need to change after re-entering the selected confirmation method, applicable destination, and any required SMS authorization.

**Priority:**
Required

**Completion Test:**
Submitted replacement, explicit-zero, attendance or decline, and authorized clear operations update their corresponding stored RSVP values; omitted RSVP fields remain unchanged; submitted operational confirmation values replace their applicable stored counterparts; and the backend saves one validated merged current response with an incremented version.

**Status:**
Final

---

### RSVP-060 — Explicit Replacement, Dependency Clearing, and Merged-State Validation

**Requirement:**
The RSVP interface and backend must distinguish omission from intentional replacement and must validate the complete merged result of every revision.

**Priority:**
Required

**Completion Test:**
Omitted substantive fields remain unchanged. Explicit zero remains a valid age-total replacement. Attendance changes may automatically clear now-inapplicable `Plus1`, totals, or Reception attendee-detail data. If Reception remains selected but the complete attendance count changes, the attendee-detail list must be replaced with a complete list whose length matches the new total. If the list is omitted and remains applicable without a count change, the stored list remains unchanged.

**Status:**
Final

### RSVP-061 — Guest Confirmation Method and Destination

**Requirement:**
Each online initial submission and revision must identify the guest’s selected confirmation method and provide the applicable valid destination and authorization.

**Priority:**
Required

**Completion Test:**
Email requires a valid email address. Text Message requires a valid SMS-capable mobile number and the applicable transactional-message authorization. A revision requires these operational fields to be entered again, and the submitted values replace their stored counterparts. Supplying both destinations does not cause both channels to be used unless the guest explicitly selects both in a future approved revision of this requirement.

**Status:**
Final

---

### RSVP-062 — Complete Current RSVP in Confirmations

**Requirement:**
Every guest confirmation and administrative confirmation must contain the complete current RSVP produced after the submission or merged revision.

**Priority:**
Required

**Completion Test:**
The confirmation contains the current attendance or decline status, each applicable named-invitee `Plus1` response, all four age-category totals and overall attendance when attending, the Reception attendee-name/dietary list when Reception is selected, timestamp, revision status, and assistance information. A revision confirmation does not contain only the fields changed in that submission.

**Status:**
Superseded

**Superseded By:**
RSVP-068. Confirmations must contain every applicable field in the invitation’s spreadsheet-authoritative current form state without inventing inapplicable fields.

---

### RSVP-063 — RSVP Service-Unavailable State

**Requirement:**
The RSVP route must provide a guest-safe service-unavailable state when the backend cannot complete invitation lookup or submission processing.

**Priority:**
Required

**Completion Test:**
The state explains that the RSVP service is temporarily unavailable, provides the printed-response alternative and approved assistance information, does not claim that an RSVP was recorded, and exposes no server, spreadsheet, credential, email-provider, text-message-provider, stored-answer, confirmation-destination, or invitation-configuration details.

**Status:**
Final

---

### RSVP-064 — Authorized `Plus1` Allocation Attendance

**Requirement:**
Each invitation configuration must store the count and named-invitee mapping of its authorized `Plus1` allocations.

**Priority:**
Required

**Completion Test:**
Zero allocations produce no `Plus1` question. Each allocation produces a separate Yes/No response keyed by a stable non-name allocation identifier and labeled `Will [Named Invitee] be accompanied by a +1?`. Unknown allocation IDs or missing applicable allocation responses are rejected. The form never requests the additional guest's own name.

**Status:**
Final

### RSVP-065 — Spreadsheet-Authoritative Question Structure

**Requirement:**
All active production invitations use the same reusable substantive form structure defined by the authoritative `Invitees List` spreadsheet.

**Priority:**
Required

**Completion Test:**
Every active invitation supports the coordinated attendance triad, attendance totals, and Reception-only attendee-detail list. `Plus1` questions appear only for source allocations and are labeled per associated named invitee. The current authoritative source defines one production substantive form structure rather than separate production question profiles.

Every online initial submission and revision still requires the separate operational confirmation method, applicable destination, and any required transactional SMS authorization.

**Status:**
Final

### RSVP-066 — Authoritative Production Invitation Source

**Requirement:**
The couple-supplied private `Invitees List` spreadsheet is the authoritative source for the 57 active production invitation configurations and the controlling substantive form-display notes.

**Priority:**
Required

**Completion Test:**
The source contains 57 populated invitation records; every supplied code normalizes successfully; the 57 canonical keys are unique; each key maps to one invited-party record; and the source is stored and processed only within approved private project locations.

The real production codes and guest details do not appear in public documentation, frontend source, public repositories, public assets, analytics, metadata, or ordinary logs.

**Status:**
Final

### RSVP-067 — Invitees List Configuration Mapping

**Requirement:**
The private production transformation must reproduce the authoritative spreadsheet's row-level heading, wording, maximum-attendance, and `Plus1` allocation semantics.

**Priority:**
Required

**Completion Test:**
The transformation maps Guest ID to `inviteCode`; Column G to `partyDisplayName` when present or otherwise combines Columns C and D; Column I to `wordingMode`; Column F to `maximumAttendance`; and Column E to the named `additionalGuestAllocations` needed to render one question per allocation.

The transformation rejects malformed codes, duplicate normalized keys, unsupported wording values, invalid maximum attendance, malformed/ambiguous `Plus1` allocation text, allocation counts incompatible with the maximum, or ambiguous party-display data.

**Status:**
Final

### RSVP-068 — Complete Applicable RSVP in Confirmations

**Requirement:**
Every guest and administrative confirmation must contain the complete current RSVP under the spreadsheet-authoritative form model.

**Priority:**
Required

**Completion Test:**
Every confirmation includes current Ceremony/Reception selections or decline status, each applicable named-invitee `Plus1` response, all four age-category totals and overall attendance when attending, and the Reception attendee-name/dietary list when Reception is selected, plus timestamp, revision status, and assistance information.

A revision confirmation contains the complete merged current RSVP rather than only the fields changed in that submission.

**Status:**
Final

## CONTENT Requirements

### CONTENT-001 — Wedding Homepage

**Requirement:**
The website must provide a public homepage containing the couple’s names, wedding date, welcome content, and prominent links to essential information.

**Priority:**
Required

**Completion Test:**
The homepage presents the required identifying information and links to RSVP, attire, venue, and travel content.

**Status:**
Approved

---

### CONTENT-002 — Theme and Attire Page

**Requirement:**
Theme and Attire must have a dedicated public page.

**Priority:**
Required

**Completion Test:**
`/wedding/theme` provides the dress code, palette, outfit inspiration, hat and accessory guidance, and relevant disclaimers.

**Status:**
Approved

---

### CONTENT-003 — Dedicated Our Story Page

**Requirement:**
Our Story must have its own public page and primary-navigation entry.

**Priority:**
Required

**Completion Test:**
`/wedding/story` is publicly accessible and linked directly from both desktop and mobile primary navigation.

**Status:**
Final

---

### CONTENT-004 — Our Story Homepage Teaser

**Requirement:**
The Our Story page must be distinct from any brief homepage introduction.

**Priority:**
Required

**Completion Test:**
The homepage may contain a short teaser, but the complete relationship and wedding-planning story appears on `/wedding/story`.

**Status:**
Approved

---

### CONTENT-005 — Ceremony Information

**Requirement:**
The website must provide ceremony information for both approved implementation configurations while publishing only the active configuration to guests.

**Priority:**
Required

**Completion Test:**
The prepared content supports either:

* Warinanco Park, Roselle, NJ 07036, from 10:30 a.m. to 12:00 p.m.; or
* Sphinx Banquet and Catering Center, 121 E 2nd Avenue, Roselle, NJ 07203, as part of the 11:30 a.m. to 4:30 p.m. combined event.

Only the confirmed configuration appears on the public site.

**Status:**
Final

---

### CONTENT-006 — Reception Information

**Requirement:**
The website must provide the confirmed reception information for Sphinx Banquet and Catering Center, 121 E 2nd Avenue, Roselle, NJ 07203, without presenting the reception as a fixed sequence of unconfirmed internal events.

**Priority:**
Required

**Completion Test:**
The public Venues and Schedule pages show either:

* The 12:30 p.m. to 4:30 p.m. reception following the Warinanco Park ceremony; or
* The 11:30 a.m. to 4:30 p.m. combined ceremony-and-reception event at Sphinx.

The guest-facing reception description:

* Identifies the meal as a buffet-style brunch.
* Does not advertise a separately scheduled formal cocktail hour.
* Does not advertise a separately scheduled formal dinner service.
* Explains, where useful, that buffet brunch, dancing, and other festivities will occur during the reception.
* Does not assign exact times to dancing or other internal reception activities unless those times are later finalized through a new recorded decision.
* Does not present the possible self-service mimosa station as confirmed until the couple and Sphinx Banquet and Catering Center approve the final arrangement.

**Status:**
Final

---

### CONTENT-007 — Travel and Accommodation Information

**Requirement:**
The website must provide travel and accommodation information, including the planned hotel block for guests traveling from a distance.

**Priority:**
Required

**Completion Test:**
The Travel page identifies the selected nearby hotel once confirmed and provides check-in on Friday, April 30, 2027, check-out on Sunday, May 2, 2027, booking instructions, group-rate information, booking deadline, parking, and other applicable transportation details.

**Status:**
Approved

---

### CONTENT-008 — Guest-Facing Schedule

**Requirement:**
The website must provide one concise guest-facing schedule corresponding to the active event configuration while avoiding an unnecessarily restrictive internal reception itinerary.

**Priority:**
Required

**Completion Test:**
The public Schedule page displays either:

* Warinanco Park ceremony from 10:30 a.m. to 12:00 p.m. and Sphinx reception from 12:30 p.m. to 4:30 p.m.; or
* The combined ceremony and reception at Sphinx from 11:30 a.m. to 4:30 p.m.

For Configuration B, the page does not invent a separate ceremony-end or reception-start time within the confirmed 11:30 a.m. to 4:30 p.m. event block.

The Schedule page may state broadly that buffet brunch, dancing, and other festivities will occur during the reception, but it does not assign exact internal times to buffet service, dancing, toasts, speeches, cake service, photographs, or other reception activities unless those times are later finalized through a new recorded decision.

The page does not display both event configurations simultaneously, advertise a formal cocktail hour or formal dinner segment, present the possible mimosa station as confirmed, or expose private setup or wedding-party-only instructions.

**Status:**
Final

---

### CONTENT-009 — Frequently Asked Questions

**Requirement:**
The website must provide a public FAQ page.

**Priority:**
Required

**Completion Test:**
The FAQ addresses children, plus ones, attire, hats, costumes, parking, buffet-style brunch and reception structure, dietary accommodations, accessibility, photography, weather, RSVP revisions, invalid codes, venues, gifts, and thematic-media resources.

Any FAQ answer concerning the reception states that there is no separately scheduled formal cocktail hour or formal dinner, avoids assigning unconfirmed times to dancing or other internal activities, and treats the possible self-service mimosa station as pending until confirmed.

**Status:**
Approved

---

### CONTENT-010 — No Gift Registry

**Requirement:**
The FAQ must state that the wedding will not use a gift registry of any kind.

**Priority:**
Required

**Completion Test:**
No registry page or registry link exists, and the FAQ clearly states that there is no registry.

**Status:**
Final

---

### CONTENT-011 — Preferred Gift Categories

**Requirement:**
The FAQ must describe the couple’s preferred gift categories.

**Priority:**
Required

**Completion Test:**
The FAQ states that guests who wish to give a gift may consider cash or cash-equivalent gifts, including checks or savings bonds, or handcrafted or otherwise thoughtful gifts.

**Status:**
Final

---

### CONTENT-012 — Nonpreferred Gift Categories

**Requirement:**
The FAQ must explain that store-specific gift cards and investments made in the couple’s name are not preferred.

**Priority:**
Required

**Completion Test:**
The gift guidance contains this qualification without presenting it as a registry or mandatory gift request.

**Status:**
Final

---

### CONTENT-013 — Gifts Are Optional

**Requirement:**
The public site must explain that gifts are optional and must not imply that a gift is a condition of attendance.

**Priority:**
Required

**Completion Test:**
Gift wording is presented as guidance for guests who choose to give rather than as an RSVP requirement.

**Status:**
Approved

---

### CONTENT-014 — Read, Listen, and Watch Page

**Requirement:**
The website must provide a Read, Listen, and Watch page for the thematic book, audiobook, and film.

**Priority:**
Required

**Completion Test:**
`/wedding/read-listen-watch` presents three clearly identified resource sections or cards.

**Status:**
Approved

---

### CONTENT-015 — Thematic-Relevance Explanations

**Requirement:**
The Read, Listen, and Watch page must explain the thematic relevance of each work without requiring guests to know the source material.

**Priority:**
Required

**Completion Test:**
Each resource includes a concise guest-facing explanation of its relationship to the wedding theme.

**Status:**
Approved

---

### CONTENT-016 — External Availability Disclaimer

**Requirement:**
Public content must identify external availability as subject to provider, price, region, and service changes.

**Priority:**
Required

**Completion Test:**
The resource page includes an availability disclaimer.

**Status:**
Approved

---

### CONTENT-017 — Dual Event-Configuration Content

**Requirement:**
Complete venue and schedule content must be prepared for both the Warinanco Park/Sphinx configuration and the Sphinx-only configuration.

**Priority:**
Required

**Completion Test:**
Both configurations can be reviewed and activated without drafting missing page sections after the Warinanco Park decision is received.

**Status:**
Final

---

### CONTENT-018 — Single Active Public Event Configuration

**Requirement:**
The public website must display only one confirmed event configuration when invitations are mailed.

**Priority:**
Required

**Completion Test:**
Home, Venues, Travel, Schedule, and FAQ present consistent locations and times, and no guest-facing page presents the inactive alternative as current information. The active configuration may be changed later if inclement weather activates the Sphinx-only fallback.

**Status:**
Final

---

### CONTENT-019 — Hotel-Block Dates

**Requirement:**
Hotel-block content must preserve the approved stay dates even while the hotel remains to be determined.

**Priority:**
Required

**Completion Test:**
The Travel content records Friday, April 30, 2027, as check-in and Sunday, May 2, 2027, as check-out, and the hotel name and booking details can be added later without changing those dates.

**Status:**
Final

---

### CONTENT-020 — Concise RSVP Privacy Notice

**Requirement:**
The RSVP entry page and personalized RSVP form must provide a concise plain-language privacy notice.

**Priority:**
Required

**Completion Test:**
The notice explains that the invitation code retrieves only the applicable blank form configuration, that submitted information is used to record and confirm the RSVP, and that additional details are available through a clearly labeled link to `/wedding/privacy`.

**Status:**
Final

---

### CONTENT-021 — Full RSVP Privacy Page Content

**Requirement:**
The public Privacy page must explain the approved RSVP data practices in plain language.

**Priority:**
Required

**Completion Test:**
The page addresses invitation-code use, collected RSVP and contact information, blank forms, partial revision merging, private administrative storage, email and text-message confirmations, administrative access, expected retention, assistance and correction requests, and the absence of unsupported absolute-security guarantees.

**Status:**
Final

---

### CONTENT-022 — RSVP Countdown Wording

**Requirement:**
The written RSVP deadline, final-month countdown label, and closed-state wording must be clear and consistent.

**Priority:**
Required

**Completion Test:**
All RSVP surfaces identify Monday, March 1, 2027, at 11:59 p.m. EST as the deadline; the countdown appears only beginning February 1, 2027; and the closed state does not imply that the deadline is based on the guest’s local time zone.

**Status:**
Final

---

### CONTENT-023 — Flexible Reception Programming

**Requirement:**
Guest-facing content must distinguish the confirmed outer ceremony and reception time blocks from the flexible and partly unconfirmed internal reception program.

**Priority:**
Required

**Completion Test:**
The public website:

* Publishes the confirmed Configuration A and Configuration B time blocks.
* Does not create a separately scheduled cocktail-hour or formal-dinner segment.
* Identifies the meal as buffet-style brunch available throughout the reception portion of the event.
* Describes dancing as occurring at various intervals during the reception rather than as one fixed scheduled block.
* May use broad wording such as “Buffet brunch, dancing, and other festivities will take place during the reception.”
* Does not promise a self-service mimosa station unless the couple and banquet hall later confirm it.
* Does not assign exact times to internal reception activities unless a later recorded decision approves those times.
* Remains consistent across Home, Venues, Schedule, Travel, and FAQ.

**Status:**
Final

---

## MEDIA Requirements

### MEDIA-001 — Lawful Book Sources

**Requirement:**
The website must link only to lawful sources for reading or purchasing the thematic book.

**Priority:**
Required

**Completion Test:**
At least one verified retailer, authorized preview, or library-service link is available.

**Status:**
Approved

---

### MEDIA-002 — Lawful Audiobook Sources

**Requirement:**
The website must link only to lawful sources for streaming, purchasing, or borrowing the audiobook.

**Priority:**
Required

**Completion Test:**
At least one verified audiobook retailer, subscription, or library-service link is available.

**Status:**
Approved

---

### MEDIA-003 — Lawful Film Sources

**Requirement:**
The website must link only to lawful sources for streaming, renting, purchasing, or borrowing the film.

**Priority:**
Required

**Completion Test:**
At least one verified lawful film-availability link is available.

**Status:**
Approved

---

### MEDIA-004 — No Hosted Source Media

**Requirement:**
The public application must not host or distribute the complete thematic book, audiobook, or film.

**Priority:**
Required

**Completion Test:**
No complete copyrighted source-media files exist in React assets, public web directories, or guest-accessible Nextcloud shares.

**Status:**
Final

---

### MEDIA-005 — Excluded Media Components

**Requirement:**
The resource page must not include an ebook reader, hosted audiobook player, hosted full-length movie player, or copyrighted-media download system.

**Priority:**
Required

**Completion Test:**
The production build contains no such components or packages used for these excluded purposes.

**Status:**
Final

---

### MEDIA-006 — Centralized External Links

**Requirement:**
External media links must be maintained from centralized application data and must open in a new browser tab.

**Priority:**
Required

**Completion Test:**
Retailer, library, subscription, trailer, and availability links are defined in one maintained data or configuration source rather than repeated across components. Each external media link opens in a new tab, uses appropriate security attributes, and is identified accessibly as an external new-tab link.

**Status:**
Final

---

## GALLERY Requirements

### GALLERY-001 — Public Gallery Route

**Requirement:**
The Gallery route must be publicly visible in the primary navigation at launch.

**Priority:**
Required

**Completion Test:**
`/wedding/gallery` is reachable from the public navigation before the wedding.

**Status:**
Final

---

### GALLERY-002 — Coming Soon State

**Requirement:**
The Gallery page must display a deliberate Coming Soon state until post-wedding photographs and video have been prepared for publication.

**Priority:**
Required

**Completion Test:**
Before gallery publication, the route displays the approved placeholder and does not expose incomplete albums or private files.

**Status:**
Final

---

### GALLERY-003 — Text-Only Placeholder

**Requirement:**
The Gallery may remain a text-only Coming Soon page before post-wedding content is ready.

**Priority:**
Required

**Completion Test:**
No engagement or planning photographs are required for the invitation-launch version.

**Status:**
Final

---

### GALLERY-004 — Gallery Must Not Delay Launch

**Requirement:**
Post-wedding gallery work must not delay the invitation-launch version of the website.

**Priority:**
Required

**Completion Test:**
The website can launch with the Gallery placeholder while the later gallery remains incomplete.

**Status:**
Approved

---

### GALLERY-005 — Post-Wedding Albums

**Requirement:**
The post-wedding Gallery must organize photographs and videos into understandable albums or categories.

**Priority:**
Later

**Completion Test:**
Published media can be browsed by defined album or category rather than through one undifferentiated collection.

**Status:**
Planned

---

### GALLERY-006 — Optimized Gallery Previews

**Requirement:**
The post-wedding Gallery must use optimized preview media.

**Priority:**
Later

**Completion Test:**
Gallery pages load appropriately sized thumbnails or previews rather than original-resolution photographs and videos.

**Status:**
Planned

---

### GALLERY-007 — Separate Original-Resolution Downloads

**Requirement:**
Original-resolution downloads must remain separate from ordinary gallery previews.

**Priority:**
Later

**Completion Test:**
Guests do not automatically download full-resolution originals merely by opening a gallery page.

**Status:**
Planned

---

### GALLERY-008 — Gallery Loading Performance

**Requirement:**
Post-wedding media must use lazy loading, pagination, album separation, or an equivalent method to prevent excessive initial loading.

**Priority:**
Later

**Completion Test:**
Opening the Gallery does not request every full media asset at once.

**Status:**
Planned

---

## ADMIN Requirements

### ADMIN-001 — Private Invitation Configuration

**Requirement:**
Private invitation configuration must remain outside the public React source and build output.

**Priority:**
Required

**Completion Test:**
Inspecting the frontend repository and production bundle reveals no complete invitation list, private guest configuration, or administrative notes.

**Status:**
Approved

---

### ADMIN-002 — Secret Management

**Requirement:**
Passwords, API keys, sensitive spreadsheet identifiers, email credentials, and service-account credentials must remain outside committed source files.

**Priority:**
Required

**Completion Test:**
Secrets are loaded through backend environment variables or protected server-side files excluded from Git.

**Status:**
Approved

---

### ADMIN-003 — Google Sheets Administration

**Requirement:**
The private Google Sheets workbook must serve as the initial administrative interface.

**Priority:**
Required

**Completion Test:**
The couple can review and maintain invitation records, wording mode, maximum attendance, `Plus1` allocation configuration, question structure, event selections or decline status, each applicable named-invitee `Plus1` response, age-category and overall attendance totals, Reception attendee-name/dietary lists, guest confirmation methods, destinations, authorization states, client submission identifiers, timestamps, versions, merged current responses, and separate per-channel delivery statuses through the private workbook.

The workbook distinguishes inapplicable conditional fields from unanswered applicable fields, including `Plus1` allocations and Reception-only attendee details.

**Status:**
Final

---

### ADMIN-004 — Private Workbook Access

**Requirement:**
The private workbook must not be publicly shared.

**Priority:**
Required

**Completion Test:**
Access is limited to the couple, explicitly authorized administrators, and the backend service account.

**Status:**
Approved

---

### ADMIN-005 — Submission Timestamps

**Requirement:**
Response updates must preserve the original submission time and record the most recent update time.

**Priority:**
Required

**Completion Test:**
A revised RSVP retains the initial submission timestamp and records a distinct latest-update timestamp.

**Status:**
Approved

---

### ADMIN-006 — Submission Version

**Requirement:**
Response records must include a submission version or equivalent revision counter.

**Priority:**
Required

**Completion Test:**
Every successful revision increments the recorded version.

**Status:**
Approved

---

### ADMIN-007 — Current and Superseded Responses

**Requirement:**
The administrative record must distinguish current responses from superseded response versions.

**Priority:**
Required

**Completion Test:**
Counts and attendee summaries use only the latest valid response for each invitation.

**Status:**
Approved

---

### ADMIN-008 — Confirmation-Delivery Records

**Requirement:**
Administrative records must track guest email, guest text-message, and administrative-email delivery results separately by channel and attempt.

**Priority:**
Required

**Completion Test:**
The workbook or associated backend record identifies the channel, protected destination, attempt time, accepted or sent state, failure, pending or uncertain state, and resend status for each applicable confirmation. The records demonstrate that one failed or delayed delivery attempt did not suppress the other applicable post-storage attempt.

**Status:**
Final

---

### ADMIN-009 — Separate Development Data

**Requirement:**
The application must maintain a development or testing data source separate from the live production response data.

**Priority:**
Required

**Completion Test:**
Local and automated tests cannot alter the live wedding RSVP workbook.

**Status:**
Approved

---

### ADMIN-010 — No Public Administrative Dashboard

**Requirement:**
No public administrative dashboard is required for the invitation-launch version.

**Priority:**
Required

**Completion Test:**
All required initial administrative tasks can be completed through the private workbook and documented server operations.

**Status:**
Final

---

### ADMIN-011 — RSVP Backups

**Requirement:**
RSVP response data must be backed up.

**Priority:**
Required

**Completion Test:**
A documented backup process creates recoverable copies of the workbook or its exported data.

**Status:**
Approved

---

### ADMIN-012 — RSVP System Retirement

**Requirement:**
The RSVP system must support retirement after the response period.

**Priority:**
Later

**Completion Test:**
New submissions can be disabled, personalized routes can be removed from public access, and the private response archive can be retained separately.

**Status:**
Planned

# Nonfunctional Requirements Register

The following nonfunctional requirements define the technical, privacy, accessibility, responsive-design, and maintainability standards that apply across the Loreweaver Creations wedding website.

These requirements describe **how** the application must operate rather than identifying individual pages or guest-facing features.

Requirement identifiers must remain permanent. If a requirement is later removed or replaced, mark it **Superseded** rather than deleting or renumbering it.

Priority definitions:

* **Required:** Must be satisfied before the invitation-launch version is placed into production.
* **Recommended:** Should be satisfied before launch unless a documented decision allows postponement.
* **Later:** Applies primarily to post-wedding development and must not delay the invitation-launch version.

---

## PORTABILITY Requirements

### PORTABILITY-001 — Project-Relative Source Paths

**Requirement:**
Application source code must use project-relative paths wherever practical.

**Priority:**
Required

**Completion Test:**
Frontend and backend source files reference project resources through relative imports, configured aliases, or centralized base-path values rather than absolute file-system locations.

**Status:**
Proposed

---

### PORTABILITY-002 — No Windows Drive Letters

**Requirement:**
Application code must not contain hard-coded Windows drive letters or Windows-specific absolute file paths.

**Priority:**
Required

**Completion Test:**
A source-code search finds no application dependency on paths such as:

`C:\Users\...`

`D:\Projects\...`

or any other fixed Windows drive location.

**Status:**
Proposed

---

### PORTABILITY-003 — No Hard-Coded Ubuntu Deployment Directories

**Requirement:**
Application source code must not depend on a specific Ubuntu production directory.

**Priority:**
Required

**Completion Test:**
The application can be placed in a different Ubuntu directory without requiring source-code changes.

Production locations such as `/opt/loreweaver/`, `/srv/`, or another deployment path may be defined through deployment configuration, environment variables, container mounts, or service files, but must not be embedded throughout the application source.

**Status:**
Proposed

---

### PORTABILITY-004 — Consistent Development and Production Routes

**Requirement:**
Development and production environments must use the same public route structure.

**Priority:**
Required

**Completion Test:**
Routes beginning with `/wedding/` and backend endpoints beginning with `/wedding/api/` behave consistently during local development and production deployment.

No component must require one route structure on Windows and a different route structure on Ubuntu.

**Status:**
Proposed

---

### PORTABILITY-005 — Centralized Environment Configuration

**Requirement:**
Values that differ between development and production must be centralized in environment configuration or another documented configuration source.

**Priority:**
Required

**Completion Test:**
Environment-dependent values—including ports, base paths, spreadsheet identifiers, email settings, allowed origins, credential locations, and service addresses—can be changed without editing individual React components or Express route files.

**Status:**
Proposed

---

### PORTABILITY-006 — No Scattered Localhost References

**Requirement:**
Local development addresses must not be hard-coded throughout the application.

**Priority:**
Required

**Completion Test:**
A source-code search finds no scattered references to addresses such as:

`http://localhost:3001`

`http://localhost:5173`

or equivalent development URLs inside individual application components.

Local addresses, where needed, are supplied through centralized development configuration.

**Status:**
Proposed

---

### PORTABILITY-007 — Operating-System-Independent Dependencies

**Requirement:**
The project must not depend on copying Windows-installed dependency folders into the Ubuntu production environment.

**Priority:**
Required

**Completion Test:**
The Windows `node_modules` directories are excluded from transfer and source control, and dependencies can be installed independently on Ubuntu from the project’s package manifests and lock files.

**Status:**
Proposed

---

### PORTABILITY-008 — Consistent Project Structure

**Requirement:**
The project must use the same logical folder structure on the Windows development PC and the Ubuntu production server.

**Priority:**
Required

**Completion Test:**
The project can be transferred without renaming source folders, changing import paths, or maintaining separate Windows-only and Ubuntu-only application layouts.

**Status:**
Proposed

---

### PORTABILITY-009 — Nested Public Base Path Support

**Requirement:**
The frontend must operate correctly beneath `/wedding/` rather than assuming that it is hosted at the root of the domain.

**Priority:**
Required

**Completion Test:**
Built JavaScript, CSS, image, font, navigation, and other asset paths resolve correctly from:

`https://www.loreweavercreations.com/wedding/`

No production asset incorrectly resolves from the domain root unless intentionally shared with the main Loreweaver Creations website.

**Status:**
Proposed

---

## PRIVACY Requirements

### PRIVACY-001 — Invitation Configurations Excluded from Frontend Build

**Requirement:**
Private invitation configurations must not be included in the React frontend source or compiled frontend build.

**Priority:**
Required

**Completion Test:**
Inspection of the React source, production JavaScript bundles, browser network responses, and public asset files does not reveal the complete invitation list, production invitation codes, source-to-guest mappings, or private invitation configuration.

**Status:**
Final

---

### PRIVACY-002 — Backend-Only Google Credentials

**Requirement:**
Google API credentials and service-account credentials must remain exclusively on the backend.

**Priority:**
Required

**Completion Test:**
No Google credential, private key, service-account file, access token, authentication secret, spreadsheet credential, or equivalent secret appears in React source code, browser-delivered files, browser storage, public Nextcloud shares, public documentation, ordinary logs, or source-control commits.

**Status:**
Final

---

### PRIVACY-003 — Backend-Only Confirmation-Delivery Credentials

**Requirement:**
Email- and text-message-service credentials, sender configuration, and administrative recipient addresses must remain in backend environment configuration or protected server-side secrets.

**Priority:**
Required

**Completion Test:**
No email password, SMTP credential, SMS-provider credential, API key, private administrative recipient configuration, sender secret, or equivalent secret appears in the frontend build, browser storage, public file shares, ordinary logs, or committed repository. Production and development/testing credentials are separate.

**Status:**
Final

---

### PRIVACY-004 — No Public Caching of Personalized RSVP Information

**Requirement:**
Invitation-specific form configuration, RSVP transaction responses, and confirmation information must not be cached publicly or intentionally persisted in browser storage solely to reconstruct personalized confirmation state.

**Priority:**
Required

**Completion Test:**
`/wedding/rsvp/`, `/wedding/rsvp/confirmation`, `POST /wedding/api/rsvp/lookup` responses, and `POST /wedding/api/rsvp/submit` responses use `Cache-Control: no-store, max-age=0`. Any later response containing personalized RSVP information uses equivalent no-store behavior.

Static versioned application assets containing no personalized or secret information may use ordinary cache optimization.

The blank RSVP form response does not include stored RSVP answers or stored confirmation destinations, and the Step 13 confirmation design does not add persistent browser storage merely to survive refresh.

**Status:**
Final

---

### PRIVACY-005 — Minimal Logging of Guest Responses

**Requirement:**
Guest answers, invitation codes, confirmation destinations, and other private RSVP values must not appear in ordinary application, proxy, or provider logs.

**Priority:**
Required

**Completion Test:**
Routine logs are limited to operational information such as a server-generated request/correlation identifier, timestamp, endpoint category, HTTP status, duration, generic error category, delivery channel without destination, rate-limit event, and non-sensitive delivery outcome.

Routine logs do not contain raw invitation codes, guest names, request or response bodies for lookup or submission, RSVP answers, dietary/allergy text, email addresses, mobile numbers, confirmation destinations, `clientSubmissionId` values, spreadsheet rows, private notes, provider credentials, or full provider payloads.

A temporary secured diagnostic process may use a non-reversible keyed pseudonymous invitation identifier when genuinely necessary, but it must be explicitly enabled, access-restricted, time-limited, and removed after the diagnostic need ends.

**Status:**
Final

---

### PRIVACY-006 — Separation of Invited Parties

**Requirement:**
One invited party must never receive another invited party’s personalized information.

**Priority:**
Required

**Completion Test:**
A valid invitation-code lookup returns only the configuration needed for that party’s blank form, including its greeting, singular or plural wording, `Plus1` allocation configuration, permitted party maximum, question structure, and approved questions. It does not return the party’s stored answers or confirmation destinations and does not reveal another invitation record.

Testing confirms that changing submitted invitation codes, question identifiers, `Plus1` allocation identifiers or values, attendee-detail structures, or invitation-configuration fields cannot retrieve or authorize another party’s information.

**Status:**
Final

---

### PRIVACY-007 — Limited Personalized API Responses

**Requirement:**
The backend must return only the information required to render and process the requested blank personalized RSVP form or to display the approved limited successful confirmation.

**Priority:**
Required

**Completion Test:**
A lookup response excludes:

* Other invitation codes.
* Other invited parties.
* The current party’s stored RSVP answers.
* Stored confirmation email addresses or mobile numbers.
* Private administrative notes.
* Complete spreadsheet data.
* Internal spreadsheet row numbers.
* Google credentials.
* Email or text-message credentials.
* Unnecessary worksheet names.
* Administrative flags not needed by the browser.

A successful submission response contains only the approved guest-facing complete current RSVP and limited confirmation/delivery metadata required by the confirmation route.

**Status:**
Final

---

### PRIVACY-008 — Neutral Invitation-Code Errors

**Requirement:**
Invitation-code errors must not disclose private, enumerative, or close-match information.

**Priority:**
Required

**Completion Test:**
Malformed, unknown, inactive, environment-ineligible, and near-match invitation codes produce neutral guest-facing invalid-invitation behavior that does not disclose:

* Whether a similar code exists.
* Whether one character was incorrect.
* Whether a particular guest exists.
* Whether an inactive or development-only record exists.
* Other invitation codes.
* The total number of invitations.
* Spreadsheet information.
* Internal application errors.

The system performs no fuzzy matching, code-recovery search, “Did you mean?” suggestion, or automatic `O`/`0`-style character substitution.

**Status:**
Final

---

### PRIVACY-009 — No Sensitive Information in Administrative Email Alerts

**Requirement:**
Administrative RSVP alert emails must not reproduce sensitive free-text guest responses.

**Priority:**
Required

**Completion Test:**
Administrative alerts omit the party’s food-allergy or dietary-preference text.

**Status:**
Superseded

**Superseded By:**
Decision 017, RSVP-036, PRIVACY-016, and Decision 024. The protected administrative confirmation must contain the complete current RSVP, including the applicable Reception attendee-name/dietary list, and must therefore be treated as private correspondence rather than as a non-sensitive generic alert.

---

### PRIVACY-010 — Private Administrative Workbook

**Requirement:**
The Google Sheets workbook containing invitation configuration and RSVP responses must remain private.

**Priority:**
Required

**Completion Test:**
The workbook is accessible only to the couple, explicitly authorized administrators, and the backend service account. It is not published to the web, exposed through a public share link, embedded in the frontend, or made available through a public API.

**Status:**
Final

---

### PRIVACY-011 — Search-Engine Exclusion for RSVP Routes

**Requirement:**
The RSVP entry and confirmation routes, controlled RSVP states, not-found route, and unmatched wedding routes must not be indexed by public search engines.

**Priority:**
Required

**Completion Test:**
`/wedding/rsvp/` and `/wedding/rsvp/confirmation` use appropriate page-level crawler directives and production server no-index behavior. `/wedding/not-found` and unmatched wedding routes are likewise excluded.

No invitation code, guest identity, RSVP answer, confirmation destination, invitation-specific form-configuration detail, `Plus1` allocation configuration, or other personalized value appears in page titles, descriptions, canonical URLs, structured data, social-preview data, or other crawler-visible metadata.

The public `/wedding/privacy` page remains indexable.

**Status:**
Final

---

### PRIVACY-012 — Limited Confirmation Display

**Requirement:**
The on-screen RSVP confirmation must display the complete current guest-facing RSVP for the applicable question structure and approved limited status metadata while excluding private administrative and system information.

**Priority:**
Required

**Completion Test:**
The confirmation page may display event selections or decline status, each applicable named-invitee `Plus1` response, all four age-category totals and overall attendance when attending, the Reception attendee-name/dietary list when Reception is selected, whether the action was an initial submission or revision, selected confirmation method, submission time, revision instructions, guest-delivery status, and a limited administrative-attempt status.

It omits fields that are not applicable to the invitation’s current form state and does not display the protected administrative address, spreadsheet row numbers, internal identifiers, administrative notes, provider credentials, unrelated party data, or other private backend information.

The confirmation route uses the finalized Step 13 temporary-state behavior and does not add a sensitive URL, public recovery endpoint, or persistent browser copy solely to survive refresh.

**Status:**
Final

---

### PRIVACY-013 — Concise RSVP Privacy Notice

**Requirement:**
The RSVP entry page and personalized form must display a concise privacy notice before the guest submits information.

**Priority:**
Required

**Completion Test:**
The notice accurately summarizes invitation-code use, RSVP processing, confirmation delivery, private storage, transactional use of contact information, and the link to the full Privacy page without making unsupported security promises or hiding material practices.

**Status:**
Final

---

### PRIVACY-014 — Full Public RSVP Privacy Page

**Requirement:**
A full public RSVP privacy notice must be available at `/wedding/privacy`.

**Priority:**
Required

**Completion Test:**
The page explains what information is collected, why it is used, how blank forms and partial revisions work, how omission differs from explicit replacement or clearing, how re-entered operational confirmation fields replace their stored counterparts, where information is stored, how independent guest and administrative confirmation attempts are handled, who may access information, the approved retention schedule, transactional mobile-number use, the provider-specific SMS disclosure gate, assistance/correction procedures, and the absence of unsupported absolute-security guarantees.

**Status:**
Final

---

### PRIVACY-015 — Mobile Numbers and Transactional Text Messages

**Requirement:**
Mobile numbers collected for text-message confirmations must be used only for the approved transactional RSVP-confirmation purpose and approved manual resend unless the guest separately authorizes another use through a future recorded decision.

**Priority:**
Required

**Completion Test:**
The form clearly identifies Text Message as a confirmation option, records the applicable authorization, protects the submitted number as private RSVP contact information, and does not use the number for promotional, marketing, unrelated wedding messaging, or list-building purposes.

**Status:**
Final

---

### PRIVACY-016 — Protected Complete Administrative Confirmations

**Requirement:**
Administrative emails containing the complete current RSVP must be treated as private correspondence and sent only to the approved administrative address.

**Priority:**
Required

**Completion Test:**
The recipient address is maintained in protected backend configuration; the email is not sent to public or shared distribution lists; the message contains no unrelated invitation records or backend secrets; and access to the receiving mailbox is restricted to the couple or explicitly authorized administrators.

Complete applicable Reception attendee-name and dietary/allergy information is allowed in this protected administrative confirmation because the already-approved confirmation model requires the complete current RSVP.

**Status:**
Final

---

### PRIVACY-017 — Invitation Codes Are Access Tokens, Not Passwords

**Requirement:**
Invitation codes must be treated as limited access tokens used to select one authorized blank RSVP configuration, not as strong passwords or full account authentication.

**Priority:**
Required

**Completion Test:**
Guest-facing copy does not describe invitation codes as passwords or promise password-equivalent security. The application provides no public guest directory, code-recovery search, close-match suggestion, fuzzy matching, list of codes, or public saved-RSVP lookup.

**Status:**
Final

---

### PRIVACY-018 — Request-Body-Only Invitation-Code Transport

**Requirement:**
Invitation codes must be transmitted to the approved RSVP endpoints in request bodies and must not be placed in browser or API URLs.

**Priority:**
Required

**Completion Test:**
No supported route uses an invitation code in a browser path, API path parameter, query string, or fragment. Public metadata, analytics, referrer-visible URLs, and ordinary logs likewise contain no raw invitation code.

**Status:**
Final

---

### PRIVACY-019 — RSVP Analytics Data Minimization

**Requirement:**
Analytics instrumentation must not receive personalized RSVP or invitation data.

**Priority:**
Required

**Completion Test:**
Analytics payloads contain none of the following: invitation codes, guest/party identities derived from invitation records, RSVP answers, Reception attendee names, dietary/allergy information, email addresses, mobile numbers, confirmation destinations, `clientSubmissionId` values, invitation-specific form-configuration details, `Plus1` allocation configurations, RSVP versions, or delivery-provider payloads.

If analytics are present on RSVP or confirmation routes, they are limited to non-personalized aggregate event names and are not required for RSVP operation.

**Status:**
Final

---

### PRIVACY-020 — RSVP Lookup Rate Limit

**Requirement:**
`POST /wedding/api/rsvp/lookup` must be rate-limited to a maximum of 10 requests per 15-minute rolling window per client IP address in the initial production configuration.

**Priority:**
Required

**Completion Test:**
The eleventh applicable lookup request within the same rolling window returns `429 Too Many Requests` with guest-safe wording and a `Retry-After` indication when supported. No invitation information is disclosed by the rate-limit response.

When deployed behind a reverse proxy, client IP information is accepted only from the configured trusted proxy chain.

**Status:**
Final

---

### PRIVACY-021 — RSVP Submission Rate Limit

**Requirement:**
`POST /wedding/api/rsvp/submit` must be rate-limited in the initial production configuration to:

* A maximum of 6 requests per 15-minute rolling window per client IP address.
* A maximum of 6 requests per 15-minute rolling window per normalized invitation code.

**Priority:**
Required

**Completion Test:**
Exceeding either applicable limit returns `429 Too Many Requests` with guest-safe wording and a `Retry-After` indication when supported. Rate-limit implementation does not write raw invitation codes to ordinary logs, and the rate limit does not alter RSVP storage or idempotency semantics.

**Status:**
Final

---

### PRIVACY-022 — Production and Development Separation

**Requirement:**
Production invitation data, development/test fixtures, credentials, and delivery configuration must remain separated.

**Priority:**
Required

**Completion Test:**
Development fixtures such as `DEVxxx` codes are not authorized by the production invitation registry. Production invitation records and production credentials are not copied into development fixtures, public test data, or frontend source. Environment authorization is enforced on the backend.

**Status:**
Final

---

### PRIVACY-023 — Guest-Safe Backend Errors

**Requirement:**
Guest-facing backend errors must not reveal internal infrastructure, configuration, enumeration, or provider details.

**Priority:**
Required

**Completion Test:**
Guest-facing errors contain no stack trace, framework/library error output, filesystem path, spreadsheet identifier, worksheet name, internal record identifier, credential, secret, provider payload, private administrative address, or close-match invitation information.

**Status:**
Final

---

### PRIVACY-024 — Reception Attendee Names and Dietary/Allergy Information Boundary

**Requirement:**
Reception attendee names and dietary/allergy responses are sensitive RSVP information and must be confined to the submitting party's authorized confirmation surfaces, the protected private data store, and protected administrative confirmations.

**Priority:**
Required

**Completion Test:**
Per-attendee names and dietary/allergy text do not appear in analytics, public pages or metadata, ordinary logs, unrelated administrative output, or another invited party's data. They may appear in the submitting party's temporary on-screen confirmation and selected confirmation message because those surfaces contain that party's complete current RSVP.

**Status:**
Final

### PRIVACY-025 — SMS Provider Disclosure Gate

**Requirement:**
Text Message confirmation must not be enabled in production until the selected SMS provider’s applicable guest-facing disclosure and authorization requirements have been verified and implemented.

**Priority:**
Required

**Completion Test:**
Before production Text Message confirmation is enabled, the provider is selected; required sender-identification, consent, carrier-rate, opt-out/help, and other provider-specific language is reviewed; the permanent `smsAuthorization` control is populated with the verified applicable wording; credentials remain backend-only; and the production flow is tested.

If these conditions are not met, Text Message confirmation remains disabled rather than displaying invented provider-specific language.

**Status:**
Final

---

### PRIVACY-026 — No Unsupported Absolute-Security Promise

**Requirement:**
Public privacy and RSVP copy must describe actual safeguards without promising absolute security.

**Priority:**
Required

**Completion Test:**
No page claims that the RSVP system is completely secure, 100% secure, unhackable, risk-free, or otherwise absolutely protected. Copy may accurately describe concrete safeguards and the project’s efforts to limit access and exposure.

**Status:**
Final

---

### PRIVACY-027 — RSVP Data Retention and Retirement

**Requirement:**
Complete production RSVP-operational data may be retained through July 30, 2027, 90 days after the May 1, 2027 wedding, and must then be retired according to Decision 024.

**Priority:**
Required

**Completion Test:**
No later than July 30, 2027, the active RSVP system deletes or irreversibly de-identifies current responses, superseded versions, dietary/allergy text, guest confirmation destinations, SMS authorization records, `clientSubmissionId` values, delivery-attempt history, RSVP transaction timestamps retained only for transaction history, and active invitation-code-to-RSVP mappings unless a minimum subset is temporarily required for a documented unresolved administrative need.

Protected backups containing retired RSVP-operational data expire through normal backup rotation no later than August 29, 2027.

Only non-identifying aggregate statistics may be retained indefinitely under this RSVP-system rule.

The separate private `Invitees List` may be retained by the couple as a personal wedding-planning/address record outside the active RSVP system.

**Status:**
Final

---

### PRIVACY-028 — HTTPS Production Transport

**Requirement:**
The production wedding website and RSVP API must use HTTPS for guest traffic.

**Priority:**
Required

**Completion Test:**
Production RSVP entry, lookup, submission, and confirmation are available over HTTPS, and ordinary HTTP navigation is redirected to HTTPS before RSVP information can be submitted.

**Status:**
Final

---

## ACCESSIBILITY Requirements

### ACCESSIBILITY-001 — Visible Form Labels

**Requirement:**
Every RSVP form control must have a visible guest-facing label.

**Priority:**
Required

**Completion Test:**
Every text field, textarea, checkbox, radio group, select control, and other interactive form element has a persistent visible label that identifies its purpose.

Placeholder text alone is not used as the control’s only label.

**Status:**
Proposed

---

### ACCESSIBILITY-002 — Programmatic Form Associations

**Requirement:**
Form labels, instructions, errors, and controls must be programmatically associated where applicable.

**Priority:**
Required

**Completion Test:**
Assistive technology can determine:

* The label associated with each control.
* Whether the control is required.
* Relevant help text.
* Whether an error is present.
* The text of the applicable error message.

**Status:**
Proposed

---

### ACCESSIBILITY-003 — Appropriate Grouping of Related Controls

**Requirement:**
Related form controls must use appropriate semantic and visual grouping.

**Priority:**
Required

**Completion Test:**
Related radio buttons, checkboxes, attendance questions, guest-specific fields, and conditional question groups are presented within appropriate grouped structures with clear group labels.

**Status:**
Proposed

---

### ACCESSIBILITY-004 — Visible Keyboard Focus

**Requirement:**
Keyboard focus must remain clearly visible on every interactive element.

**Priority:**
Required

**Completion Test:**
A keyboard user can visually identify the currently focused navigation link, button, form control, menu item, external link, gallery control, and other interactive element.

No style removes the browser focus indicator without providing an equally visible replacement.

**Status:**
Proposed

---

### ACCESSIBILITY-005 — Keyboard Operation

**Requirement:**
All essential site and RSVP functions must be operable by keyboard.

**Priority:**
Required

**Completion Test:**
A guest can navigate the public site, open and close the mobile menu, enter an invitation code, complete the RSVP form, correct validation errors, and submit the response without using a mouse or touchscreen.

**Status:**
Proposed

---

### ACCESSIBILITY-006 — Text-Based Error Explanations

**Requirement:**
Validation and application errors must be explained through text.

**Priority:**
Required

**Completion Test:**
Every validation error includes a written explanation identifying what must be corrected.

Errors are not communicated exclusively through color, icons, animation, or changes in border style.

**Status:**
Proposed

---

### ACCESSIBILITY-007 — Error Summary

**Requirement:**
RSVP forms containing validation errors must provide an accessible error summary.

**Priority:**
Required

**Completion Test:**
When submission fails because of invalid or missing answers:

* An error summary appears near the beginning of the form.
* Individual fields display specific error messages.
* Focus moves to the summary or first invalid field.
* Previously completed valid answers remain intact.

**Status:**
Proposed

---

### ACCESSIBILITY-008 — Required-Field Identification

**Requirement:**
Required fields must be identifiable without relying exclusively on color.

**Priority:**
Required

**Completion Test:**
Each required field includes visible text, a symbol with an explained meaning, accessible metadata, or an equivalent method that remains understandable without perceiving color differences.

**Status:**
Proposed

---

### ACCESSIBILITY-009 — Text Enlargement

**Requirement:**
The website must remain usable when browser text is enlarged.

**Priority:**
Required

**Completion Test:**
At enlarged text or browser zoom settings:

* Text remains readable.
* Controls remain operable.
* Content does not overlap.
* Important information is not clipped.
* Horizontal scrolling is not introduced for ordinary page content.
* RSVP questions and answers remain understandable.

**Status:**
Proposed

---

### ACCESSIBILITY-010 — Reduced Motion Preferences

**Requirement:**
Decorative motion must respect the guest’s reduced-motion preference.

**Priority:**
Required

**Completion Test:**
When the browser or operating system indicates a reduced-motion preference, nonessential animation, parallax effects, automatic motion, and decorative transitions are removed or substantially reduced.

**Status:**
Proposed

---

### ACCESSIBILITY-011 — Color-Independent Meaning

**Requirement:**
Color must not be the only method used to communicate status, selection, errors, required fields, or success.

**Priority:**
Required

**Completion Test:**
Selected answers, errors, warnings, confirmation states, disabled controls, and required fields remain understandable through text, shape, symbols, control state, or other non-color indicators.

**Status:**
Proposed

---

### ACCESSIBILITY-012 — Readable Color Contrast

**Requirement:**
Text and essential interface controls must remain readable against their backgrounds.

**Priority:**
Required

**Completion Test:**
The final wedding palette, watercolor artwork, parchment textures, borders, buttons, links, focus indicators, form fields, error messages, and confirmation messages are reviewed to ensure adequate visual contrast.

Decorative artwork does not interfere with reading or control identification.

**Status:**
Proposed

---

### ACCESSIBILITY-013 — Touch-Target Usability

**Requirement:**
Buttons, links, menu controls, form options, and other interactive elements must be practical to operate on a touchscreen.

**Priority:**
Required

**Completion Test:**
Interactive targets have sufficient size and spacing to reduce accidental activation on common mobile devices.

**Status:**
Proposed

---

### ACCESSIBILITY-014 — Logical Heading Structure

**Requirement:**
Public pages and RSVP forms must use a logical heading hierarchy.

**Priority:**
Required

**Completion Test:**
Each page has one clear primary heading, and subordinate content sections use headings in a meaningful sequence without selecting heading levels solely for visual appearance.

**Status:**
Proposed

---

### ACCESSIBILITY-015 — Accessible Loading and Status Messages

**Requirement:**
Loading, submission, validation, success, warning, and failure states must be communicated to assistive technology.

**Priority:**
Required

**Completion Test:**
A screen-reader user is informed when:

* An invitation lookup begins.
* The form becomes available.
* An invitation code is invalid.
* Submission begins.
* Validation fails.
* Submission succeeds.
* Email delivery fails after a successful RSVP.
* The RSVP system is closed or unavailable.

**Status:**
Proposed

---

### ACCESSIBILITY-016 — Alternative Text for Informational Images

**Requirement:**
Images that communicate meaningful wedding information must include appropriate text alternatives.

**Priority:**
Required

**Completion Test:**
Informational images include useful alternative text, while purely decorative watercolor, border, floral, or background images are hidden from assistive technology where appropriate.

**Status:**
Proposed

---

## RESPONSIVENESS Requirements

### RESPONSIVENESS-001 — Single Responsive Application

**Requirement:**
The same application must serve desktop, tablet, and mobile devices.

**Priority:**
Required

**Completion Test:**
No separate mobile-only or desktop-only wedding application is required to access the complete public site and RSVP system.

**Status:**
Proposed

---

### RESPONSIVENESS-002 — Mobile Single-Column RSVP Layout

**Requirement:**
RSVP forms must use a single-column layout on narrow screens.

**Priority:**
Required

**Completion Test:**
On representative mobile widths, guest questions, labels, instructions, controls, errors, and buttons stack vertically in a clear reading order without requiring horizontal scrolling.

**Status:**
Proposed

---

### RESPONSIVENESS-003 — Touch and Keyboard Navigation

**Requirement:**
Navigation must work with both touch and keyboard input.

**Priority:**
Required

**Completion Test:**
Desktop and mobile navigation can be opened, traversed, activated, and closed through touch controls and keyboard controls.

No essential navigation function depends on hovering.

**Status:**
Proposed

---

### RESPONSIVENESS-004 — Long-Text Wrapping

**Requirement:**
Long guest names, page titles, form labels, button text, email addresses, and assistance instructions must wrap without producing horizontal page scrolling.

**Priority:**
Required

**Completion Test:**
Representative long names and text strings remain within the viewport at supported mobile widths.

**Status:**
Proposed

---

### RESPONSIVENESS-005 — Responsive Sticky Public Navigation

**Requirement:**
The primary navigation must remain sticky and adapt appropriately to desktop and mobile layouts.

**Priority:**
Required

**Completion Test:**
Desktop navigation remains visible while scrolling and presents the approved primary links without overlap. Mobile navigation remains available through a clearly labeled and operable menu control rather than an unexplained icon alone.

**Status:**
Final

---

### RESPONSIVENESS-006 — Mobile Menu Behavior

**Requirement:**
The mobile menu must close after a navigation destination is selected.

**Priority:**
Required

**Completion Test:**
Selecting a public page from the mobile menu navigates to the page and dismisses the open menu without requiring a separate close action.

**Status:**
Final

---

### RESPONSIVENESS-007 — Sticky Navigation Must Not Obscure Content

**Requirement:**
The sticky header and expanded mobile menu must not obscure headings, RSVP fields, validation messages, focused controls, or other essential content.

**Priority:**
Required

**Completion Test:**
At supported viewport sizes and when navigating to anchors or focused fields, all essential content can be viewed and operated without being hidden beneath the sticky header or mobile menu.

**Status:**
Final

---

### RESPONSIVENESS-008 — Responsive Media and Artwork

**Requirement:**
Images, decorative artwork, resource cards, map links, and future gallery previews must resize appropriately for the available viewport.

**Priority:**
Required

**Completion Test:**
Public media does not overflow its container, distort the page layout, or force horizontal scrolling.

**Status:**
Proposed

---

### RESPONSIVENESS-009 — Responsive Validation Messages

**Requirement:**
RSVP validation summaries and individual error messages must remain readable and correctly associated with their controls on narrow screens.

**Priority:**
Required

**Completion Test:**
Long error messages wrap within the viewport and do not overlap form controls or decorative page elements.

**Status:**
Proposed

---

### RESPONSIVENESS-010 — Responsive Confirmation Page

**Requirement:**
The RSVP confirmation page must remain usable at phone, tablet, laptop, and desktop widths.

**Priority:**
Required

**Completion Test:**
The recorded attendance summary, timestamp, revision instructions, delivery warning where applicable, and return links remain readable and correctly ordered at all supported viewport widths.

**Status:**
Proposed

---

## MAINTAINABILITY Requirements

### MAINTAINABILITY-001 — Centralized Public Content

**Requirement:**
Public wedding content should be centralized where practical.

**Priority:**
Required

**Completion Test:**
Information that appears in multiple locations—such as the wedding date, RSVP deadline, countdown start, assistance email address, active event configuration, venue details, schedule times, hotel-block dates, gift policy, privacy-page route, and repeated navigation labels—is maintained from centralized data or configuration rather than duplicated manually throughout unrelated components.

**Status:**
Final

---

### MAINTAINABILITY-002 — Centralized External Media Links

**Requirement:**
External book, audiobook, and film links must be stored in one maintained data source.

**Priority:**
Required

**Completion Test:**
Retailer, streaming, rental, subscription, purchase, and library links can be updated without editing multiple page components.

**Status:**
Proposed

---

### MAINTAINABILITY-003 — Reusable RSVP Form System

**Requirement:**
One reusable RSVP form-building system must serve every invitation.

**Priority:**
Required

**Completion Test:**
All 57 active production invitations are rendered through the same maintained form-building architecture rather than through separately coded React pages.

**Status:**
Proposed

---

### MAINTAINABILITY-004 — No Invitation-Specific React Pages

**Requirement:**
The project must not create and maintain a separate React page or component for each invitation code.

**Priority:**
Required

**Completion Test:**
No production source files use patterns such as:

`RSVPA1B2C3.jsx`

`RSVPD4E5F6.jsx`

or equivalent code-specific form pages.

The single personalized route loads the proper configuration dynamically.

**Status:**
Proposed

---

### MAINTAINABILITY-005 — Permanent Question Identifiers

**Requirement:**
Every RSVP question must use a permanent internal identifier that is independent of its guest-facing wording.

**Priority:**
Required

**Completion Test:**
Changing a displayed question label does not require changing its internal ID, spreadsheet association, conditional logic, stored-answer key, or validation reference.

**Status:**
Proposed

---

### MAINTAINABILITY-006 — Dynamic Invitation Records

**Requirement:**
The application must load invitation records dynamically and must not embed a fixed invitation count in form-building logic.

**Priority:**
Required

**Completion Test:**
Adding, disabling, or removing a configuration record does not require rewriting the RSVP renderer or duplicating code.

**Status:**
Final

---

### MAINTAINABILITY-007 — Production Code Classification

**Requirement:**
The invitation configuration must distinguish active production codes from disabled placeholder or testing codes.

**Priority:**
Required

**Completion Test:**
The 57 records from the authoritative private production source are enabled only in the production configuration after validation. Placeholder, synthetic example, and development-only codes are explicitly marked inactive or isolated to a nonproduction environment and cannot retrieve or submit a production RSVP.

**Status:**
Final

---

### MAINTAINABILITY-008 — Stable Requirement Identifiers

**Requirement:**
Functional and nonfunctional requirement identifiers must remain stable after assignment.

**Priority:**
Required

**Completion Test:**
A requirement that is removed, changed, or replaced is marked Superseded rather than deleted and renumbered, preserving references in tests, plans, and implementation notes.

**Status:**
Proposed

---

### MAINTAINABILITY-009 — Centralized Route Definitions

**Requirement:**
Public and personalized route definitions should be centralized.

**Priority:**
Required

**Completion Test:**
Route names and base paths are not independently recreated throughout unrelated components, reducing the risk that a route change leaves broken links elsewhere in the application.

**Status:**
Proposed

---

### MAINTAINABILITY-010 — Centralized RSVP Deadline

**Requirement:**
The RSVP deadline must be represented through one authoritative backend configuration value.

**Priority:**
Required

**Completion Test:**
The deadline of Monday, March 1, 2027, at 11:59 p.m. EST is not independently hard-coded throughout multiple components and services.

Guest-facing displays may receive the value from centralized public configuration, but the backend remains authoritative for deadline enforcement.

**Status:**
Proposed

---

### MAINTAINABILITY-011 — Centralized Assistance Contact

**Requirement:**
The RSVP assistance address must be maintained from a centralized content or configuration source.

**Priority:**
Required

**Completion Test:**
Changing `RSVPhelp@loreweavercreations.com` would update all relevant RSVP instructions and error states without requiring a manual search through every page component.

**Status:**
Proposed

---

### MAINTAINABILITY-012 — Shared Validation Definitions

**Requirement:**
Frontend usability validation and backend authoritative validation should derive from consistent schemas or shared definitions where practical.

**Priority:**
Required

**Completion Test:**
Allowed answer values, required fields, email format requirements, invitation-code rules, text-length limits, and question identifiers do not drift between the React interface and Express backend.

The backend remains authoritative even when definitions are shared.

**Status:**
Proposed

---

### MAINTAINABILITY-013 — Centralized Conditional Logic

**Requirement:**
Conditional RSVP behavior must be represented through reusable rules rather than invitation-specific component logic.

**Priority:**
Required

**Completion Test:**
Reusable configuration controls singular or plural wording, `Plus1` allocation configuration and control type, authorized invitation configuration, mutual exclusivity between attendance and decline, and validation of applicable party totals.

The single spreadsheet-authoritative production question structure is driven by reusable configuration and dependency rules rather than separately coded invitation-specific components. No accessibility, travel, additional-guest-name, separate named-person attendance, message-to-couple, or entrée-selection question is introduced through invitation-specific component logic.

**Status:**
Final

---

### MAINTAINABILITY-014 — Documented Environment Variables

**Requirement:**
Every required environment variable must be documented in an example environment file without including private values.

**Priority:**
Required

**Completion Test:**
The repository contains example configuration files identifying required variable names, while actual `.env` files and secrets remain excluded from Git.

**Status:**
Proposed

---

### MAINTAINABILITY-015 — Dependency Reproducibility

**Requirement:**
Frontend and backend dependencies must be reproducible from committed package manifests and lock files.

**Priority:**
Required

**Completion Test:**
A clean Windows or Ubuntu environment can install the required dependencies without receiving copied `node_modules` directories.

**Status:**
Proposed

---

### MAINTAINABILITY-016 — Separation of Launch and Post-Wedding Features

**Requirement:**
Post-wedding Gallery implementation must remain separable from the invitation-launch application.

**Priority:**
Required

**Completion Test:**
The public site can be deployed with the Gallery in its approved Coming Soon state without requiring unfinished photo-album, video, lightbox, download, or full-resolution-media functionality.

**Status:**
Proposed

---

### MAINTAINABILITY-017 — Replaceable Gallery Data Source

**Requirement:**
The Gallery’s Coming Soon state must be replaceable with post-wedding content without restructuring the rest of the public website.

**Priority:**
Later

**Completion Test:**
Albums, previews, videos, and approved downloads can be added to the existing Gallery route while preserving the site-wide navigation, layout, and unrelated page components.

**Status:**
Proposed

---

### MAINTAINABILITY-018 — Documented RSVP Data Structures

**Requirement:**
Invitation records, approved RSVP question structures, blank-form configuration responses, initial submission payloads, partial-revision payloads, merged current responses, spreadsheet columns, client submission identifiers, and confirmation-delivery records must use documented structures.

**Priority:**
Required

**Completion Test:**
A developer can determine the expected fields and allowed values for wording mode, question structure, maximum attendance, `Plus1` allocation configuration and response, event selections, decline status, every applicable age-category total, overall attendance total, Reception attendee-name/dietary entries, confirmation method, email address, mobile number, SMS authorization, omission as no change, replacement, explicit zero, explicit clearing, client submission identifiers, timestamps, versions, and separate guest and administrative delivery results without reverse-engineering individual components.

The structures distinguish an inapplicable field from an omitted revision field and from a stored value that is explicitly cleared.

**Status:**
Final

---

### MAINTAINABILITY-019 — Testable Requirement Mapping

**Requirement:**
Each functional and nonfunctional requirement must be capable of being associated with one or more completion tests.

**Priority:**
Required

**Completion Test:**
The implementation and testing documentation can reference requirement IDs and record whether each requirement has passed, failed, been postponed, or been superseded.

**Status:**
Proposed

---

### MAINTAINABILITY-020 — Centralized Gift Policy Content

**Requirement:**
The finalized no-registry gift policy should be maintained from a centralized content source where practical.

**Priority:**
Required

**Completion Test:**
The statement that there is no registry, the preferred gift categories, and the nonpreferred gift categories can be revised without searching through multiple unrelated page components.

**Status:**
Proposed

---

### MAINTAINABILITY-021 — Centralized Active Event Configuration

**Requirement:**
The two approved event configurations must be represented through centralized content or configuration with exactly one public configuration marked active.

**Priority:**
Required

**Completion Test:**
Changing the active configuration updates the applicable Home, Venues, Travel, Schedule, and FAQ content without rewriting page components, while the inactive configuration remains unavailable to ordinary guests.

**Status:**
Final

---

# Phase 3 Step 14 Decision-Log Completion Check

Phase 3 Step 14 is complete in this decision log because:

* The remaining proposed RSVP privacy requirements required by Step 14 are finalized.
* Invitation-code treatment as an access-token model is explicit.
* Public directory, code recovery, fuzzy/close-match disclosure, and code-bearing route behavior are prohibited.
* Personalized caching uses an explicit `Cache-Control: no-store, max-age=0` standard.
* Search-indexing and metadata boundaries are finalized.
* RSVP analytics exclusions are finalized.
* Ordinary logging exclusions and the limited diagnostic exception are finalized.
* Lookup and submission rate limits are assigned concrete initial production thresholds.
* Google, email, SMS, administrative-recipient, production, and development secret boundaries are finalized.
* Guest-safe error requirements are finalized.
* Protected administrative confirmation and dietary-information boundaries are finalized without contradicting the approved complete-current-RSVP confirmation model.
* Mobile numbers remain transactional-only.
* Provider-specific SMS wording is handled through a mandatory production-enablement gate rather than invented before provider selection.
* Unsupported absolute-security promises are prohibited.
* The RSVP data-retention standard is finalized through July 30, 2027, with protected backup retirement by August 29, 2027.
* HTTPS is mandatory for production RSVP traffic.

These decisions govern the Step 14 revisions to `rsvp-system-design.md`, `rsvp-api-contract.md`, `rsvp-test-cases.md`, and the later privacy-page synchronization documents.

---

## Decision 025 — Production RSVP Email Provider and Sender Identity

Decision:

The production RSVP email-confirmation provider is **Resend**.

The approved public email-sending identity is:

* Sender name: `Norstein-Dashiell Wedding`
* Sender address: `confirm@rsvp.loreweavercreations.com`
* Reply-To / assistance address: `RSVPhelp@loreweavercreations.com`

The protected administrative recipient has been confirmed by the couple and must be supplied only through backend secret configuration. Its actual address must not be committed to source control, public documentation, frontend assets, logs, or browser responses.

Implementation Requirements:

* The sending subdomain `rsvp.loreweavercreations.com` must be verified with Resend before production activation.
* Required Resend DNS authentication records must be configured and verified before guest email delivery is enabled.
* The Resend API key must remain backend-only and must not be committed.
* Production startup must fail closed if Resend is selected but its required backend configuration is incomplete.
* Guest and administrative messages continue to use the provider-neutral delivery boundary defined by Decisions 010 and 017.
* A successful Resend API acceptance maps to the internal `sent` state. A definite client-side/provider rejection maps to `failed`; server-side, network, or otherwise ambiguous outcomes map to `uncertain`.
* Text Message confirmation remains disabled and is unaffected by this email-provider decision until the separate SMS production-enablement gate is satisfied.

Live Validation:

On September 20, 2026, the dedicated sending subdomain `rsvp.loreweavercreations.com` was verified by Resend. An isolated live-email validation was then performed through the project’s Resend transport using backend-only local secret configuration.

The live validation:

* Used the approved sender name and address.
* Used the approved Reply-To / assistance address.
* Was sent only to a user-controlled test mailbox.
* Did not start the RSVP server.
* Did not access Google Sheets.
* Did not load a production invitation.
* Did not submit, store, revise, or modify an RSVP.
* Returned the project result `Resend isolated live-email validation: PASS`.
* Arrived with the expected From identity, Reply-To identity, and safety text.

No Resend API key, test-recipient address, provider credential, or production guest data is recorded in this public repository.

Status:
Final

Date:
9/20/2026

---

## Decision 026 — Recoverable RSVP Persistence and Single-Writer Deployment

Decision:

The RSVP backend must make each logical submission recoverable across partial persistence and delivery failures without treating Google Sheets as a transactional database.

Each accepted logical submission uses a private lifecycle record that progresses through the internal states:

* `prepared`
* `stored`
* `deliveryStarted`
* `complete`

The lifecycle record is private backend state and must not be exposed through the public RSVP API.

Each RSVP mutation also receives a private non-reversible `mutationId` derived from the private submission scope. The mutation identifier is used only to correlate version-history, current-state recovery, and delivery-history records. It must not be returned to the browser or written to ordinary logs.

Persistence Requirements:

* Before changing RSVP state, the backend records the logical submission as `prepared`.
* The RSVP version-history write and current-response update are treated as one recoverable logical mutation.
* If the version-history record was written but the current-response update did not complete, retry with the same logical submission repairs the current-response record without appending a duplicate version.
* If the target version already belongs to another mutation, the backend fails closed rather than overwriting or silently reconciling the conflict.
* A completed mutation replay returns the stored logical result with `idempotentRepeat: true` and does not create another version.
* A different logical mutation for the same invitation must not proceed while an earlier lifecycle record remains incomplete.

Delivery-Recovery Requirements:

* Delivery begins only after RSVP storage is confirmed.
* Before calling the delivery provider, the lifecycle state advances to `deliveryStarted`.
* If a delivery result is durably recorded, retry reuses that record and does not send another confirmation.
* If the process may have reached the provider but no durable delivery result exists, retry must not automatically resend merely to discover the outcome. The recovered result is recorded as `uncertain`; any later resend is an explicit administrative delivery operation.
* Delivery-history failure must not create a second RSVP mutation or version.

Concurrency and Deployment Boundary:

Google Sheets does not provide the compare-and-swap or multi-row transaction semantics required for safe distributed RSVP mutation locking. Therefore the production RSVP service must run **one mutation-capable backend instance at a time** while Google Sheets is the persistence adapter.

The application may serialize concurrent mutations for the same invitation within that instance. Horizontal scaling, active-active mutation processing, or multiple independently writable backend instances require a later storage/locking architecture decision before production use.

Status:
Final

Date:
9/20/2026

---

## Decision 027 — Guarded Production Invitation Activation

Decision:

Production invitation configuration must be activated through a controlled maintenance workflow rather than by manually editing the RSVP workbook or running an unverified destructive script.

The activation workflow is:

1. Run a read-only production readiness gate that validates the authoritative private source, exact Google Sheets store schema, and empty RSVP operational tables.
2. Require an explicit destructive-write acknowledgement before changing production invitation configuration.
3. Capture a private pre-load snapshot of all RSVP store sections before the first workbook write.
4. Replace only the `Invitations` configuration rows.
5. Compare the resulting private invitation rows exactly with the transformed authoritative source.
6. Confirm that all non-invitation RSVP operational tables remain unchanged.
7. If the guarded write or post-write verification fails after snapshot creation, attempt to restore the prior `Invitations` rows.
8. Run a separate read-only post-load verification before any guest-facing production RSVP activation.

The private snapshot, workbook identifier, invitation codes, guest identities, source mappings, and generated private configuration remain outside public source control and ordinary logs.

Activation Result:

On September 20, 2026:

* The read-only readiness gate passed with 57 audited source invitation records.
* The Google Sheets store schema passed verification.
* Current RSVP, version-history, submission-record, delivery-record, and resend-record tables were empty.
* The guarded production invitation load completed with 57 records.
* A private pre-load RSVP-store snapshot was created successfully.
* Independent post-load verification confirmed exactly 57 production invitation configurations.
* The five RSVP operational tables remained empty after the invitation load.
* Guest-facing production RSVP service activation had not yet occurred as part of this step.

Status:
Final

Date:
9/20/2026

---

## Decision 028 — Production RSVP Runtime and Deployment Readiness

Decision:

The production RSVP backend must pass a dedicated runtime-readiness gate and a loopback-only production smoke test before the guest-facing production API is opened.

Production runtime configuration is fail-closed around the current approved deployment model:

* Canonical public browser origin: `https://www.loreweavercreations.com`.
* Production email provider and sender identity: the approved Resend configuration from Decision 025.
* Text Message confirmation: disabled until its separate provider/disclosure/testing gate is complete.
* Google Sheets persistence: exactly one mutation-capable backend instance.
* Same-host duplicate-writer protection: exclusive local writer lock acquired before the real production server begins listening.
* Trusted proxy: bounded to the actual reverse-proxy topology; the currently validated direct Cloudflare Tunnel-to-loopback-Express topology uses `loopback`.
* Any later topology change that inserts or removes a proxy requires the trust boundary to be revalidated before production use.

The local writer lock is a defense against an accidental second production process on the same host. It is not a distributed lock and does not authorize horizontally scaled or active-active production writers.

Production RSVP browser requests with an explicit origin that does not match the canonical public origin are rejected before RSVP route processing. Originless maintenance/health access remains possible for controlled server-side operations.

Two separate production verification paths are required:

1. Runtime readiness — validates the complete production environment, Google Sheets access and schema, Resend transport construction, and writer-lock acquisition/release without serving guest traffic.
2. Loopback smoke — starts the real production-configured Express app only on `127.0.0.1` and an ephemeral port, verifies the health endpoint, performs one authorized production blank-form lookup using an ephemeral real invitation code, shuts down, and verifies that RSVP operational tables did not change.

Live Validation:

On September 20, 2026, both production runtime checks completed successfully.

The runtime-readiness command returned `Production RSVP runtime readiness: PASS`.

The loopback smoke returned `Production RSVP loopback smoke: PASS`. The health request returned HTTP 200 and the production lookup returned HTTP 200 through the approved blank-form response boundary. No RSVP submission, version, delivery record, resend record, or other operational RSVP mutation was created.

The invitation code used for the smoke test remains private and is not recorded in this repository.

Status:
Final

Date:
9/20/2026
