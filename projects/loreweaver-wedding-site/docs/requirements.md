# Wedding Website Requirements

## Project Scope

The Loreweaver Creations wedding website will be a responsive,
self-hosted web application providing invited guests with wedding
information and access to a personalized RSVP system.

The website will be developed locally on a Windows PC and later
transferred to the Loreweaver Creations Ubuntu server.

The production website will be available at:

https://www.loreweavercreations.com/wedding/

The invitation-launch version of the website must be operational,
tested, and displaying the confirmed event configuration before the
printed invitations are mailed. The printed invitations are intended
to be mailed no earlier than October 1, 2026.

The application will consist of:

1. A public React website containing wedding information.
2. A React RSVP interface accessed through manual invitation-code
   entry.
3. A private Node.js and Express backend.
4. A private Google Sheets workbook used for invitation configuration
   and RSVP responses.
5. Backend email delivery and, when the finalized production SMS-provider
   gate is satisfied, text-message delivery services that send complete
   guest confirmations, together with protected administrative email
   confirmations after every successful initial submission or revision.
6. External links to lawful sources for the thematic book, audiobook,
   and movie.
7. Nextcloud-hosted wedding materials where guest access is appropriate.
8. Centralized venue and schedule content supporting either of the two
   approved event configurations without requiring page components to
   be rewritten.
9. A public Privacy page explaining the wedding website's RSVP data
   practices.

The application will not publicly host copyrighted copies of the
thematic book, audiobook, or movie.

## Event Configuration Requirements

The wedding will use one of the following two configurations.

### Configuration A — Warinanco Park Ceremony and Sphinx Reception

This configuration will be used only if approval for the outdoor
ceremony location is received and weather permits.

- Ceremony date: Saturday, May 1, 2027.
- Ceremony time: 10:30 a.m. to 12:00 p.m.
- Ceremony location: Warinanco Park, Roselle, NJ 07036.
- Reception date: Saturday, May 1, 2027.
- Reception time: 12:30 p.m. to 4:30 p.m.
- Reception location: Sphinx Banquet and Catering Center,
  121 E 2nd Avenue, Roselle, NJ 07203.

### Configuration B — Entire Event at Sphinx

This configuration will be used if approval for Warinanco Park is not
received or if inclement weather prevents use of the outdoor ceremony
location.

- Event date: Saturday, May 1, 2027.
- Ceremony and reception time: 11:30 a.m. to 4:30 p.m.
- Ceremony and reception location: Sphinx Banquet and Catering Center,
  121 E 2nd Avenue, Roselle, NJ 07203.

Complete venue and schedule content must be prepared for both
configurations. Only the confirmed configuration may be active and
guest-facing when the printed invitations are mailed.

The public Home, Venues, Travel, Schedule, and FAQ content must not
display conflicting configurations at the same time.

If Configuration A is active when the invitations are mailed but
inclement weather later requires the Sphinx-only fallback,
Configuration B must be capable of being activated promptly without
rebuilding the application.

## Public Schedule and Reception-Service Requirements

The public website must distinguish the confirmed outer event time
blocks from the flexible internal reception program.

The confirmed guest-facing time blocks are:

### Configuration A — Warinanco Park Ceremony and Sphinx Reception

- Ceremony at Warinanco Park: 10:30 a.m. to 12:00 p.m.
- Reception at Sphinx Banquet and Catering Center: 12:30 p.m. to
  4:30 p.m.

### Configuration B — Entire Event at Sphinx

- Ceremony and reception at Sphinx Banquet and Catering Center:
  11:30 a.m. to 4:30 p.m.
- The website must not invent a separate ceremony-end or
  reception-start time within this confirmed event block unless a later
  recorded decision establishes one.

The reception must be described according to the following rules:

- There is no separately scheduled formal cocktail hour.
- There is no separately scheduled formal dinner service.
- The meal is a buffet-style brunch.
- The buffet will remain available throughout the reception portion of
  the event.
- Dancing may occur at various intervals during the reception rather
  than within one fixed published dancing period.
- Guest-facing copy may state broadly that buffet brunch, dancing, and
  other festivities will take place during the reception.
- The possible self-service mimosa station remains pending confirmation
  with Sphinx Banquet and Catering Center.
- The website must not present the mimosa station as confirmed until the
  couple and banquet hall finalize the arrangement.
- If the mimosa station is later confirmed, it may be described broadly
  as available during the reception unless a later approved decision
  establishes a more specific service window.

Unless later finalized through a new recorded decision, the public
website must not assign exact times to:

- Buffet opening or closing beyond the confirmed reception period.
- Cocktail or mimosa service.
- Dancing periods.
- First dances.
- Toasts or speeches.
- Cake service.
- Photographs.
- Other reception activities or transitions.

Home, Venues, Travel, Schedule, and FAQ must use consistent language
drawn from the active event configuration and this flexible reception
model.

The public Schedule page must function as a concise guest-planning
schedule rather than as a binding internal run-of-show.

## Hotel Accommodation Requirements

A block of hotel accommodations will be reserved at a nearby hotel for
guests traveling from a distance.

- Hotel: To be determined.
- Check-in: Friday, April 30, 2027.
- Check-out: Sunday, May 2, 2027.

The Travel page must support the following information once the hotel
is selected:

- Hotel name.
- Hotel address.
- Reservation link or booking instructions.
- Group-rate or room-block information.
- Booking deadline.
- Accessibility information.

## Delivery Scope

The project is divided into two delivery scopes so that post-wedding
features cannot delay the website and RSVP functions required when the
printed invitations are mailed.

### Invitation-Launch Version

The invitation-launch version must be operational before the actual
invitation mailing date. The printed invitations are intended to be
mailed no earlier than October 1, 2026.

The invitation-launch version must include:

- Home.
- Functional manual invitation-code entry at `/wedding/rsvp/`.
- Functional blank personalized RSVP forms rendered after successful
  invitation-code validation without placing the code in the URL.
- The approved invitation-specific default or reduced substantive RSVP
  question profile, consistent with the corresponding printed invitation.
- Partial RSVP revisions that merge submitted changes with the existing
  stored response.
- Explicit controls for clearing or replacing previously submitted
  answers.
- Unlimited RSVP revisions through Monday, March 1, 2027, at
  11:59 p.m. EST.
- Written RSVP deadline information at all times.
- A live RSVP countdown from February 1, 2027, at 12:00 a.m. EST until
  the March 1, 2027 deadline.
- Guest confirmation by Email, with Text Message also available only
  when the finalized production SMS-provider disclosure and enablement
  gate has been satisfied.
- Administrative email confirmation after every successful initial
  submission or revision.
- Complete current RSVP information in each guest and administrative
  confirmation.
- On-screen confirmation showing the complete current guest-facing RSVP
  summary.
- Confirmation-delivery status handling that does not undo a stored RSVP
  or encourage duplicate submission.
- Theme and Attire.
- Our Story.
- Read, Listen, and Watch.
- Venues, with both event configurations built and only the selected
  configuration publicly displayed.
- Travel, including the April 30 through May 2, 2027 hotel-block dates
  and the finalized hotel details once available.
- Schedule, with both event configurations built, only the selected
  configuration publicly displayed, and only the confirmed outer event
  time blocks published.
- Reception information identifying buffet-style brunch and flexible
  dancing or festivities during the reception without creating a formal
  cocktail-hour, formal-dinner, or fixed internal reception timeline.
- FAQ, including the location contingency, weather fallback, buffet
  format, flexible reception structure, and the pending status of any
  unconfirmed mimosa-station plan.
- Gift information within the FAQ.
- A Gallery placeholder displaying the approved Coming Soon state.
- Public RSVP contact and assistance instructions.
- A concise RSVP privacy notice on the RSVP entry page and personalized
  RSVP form.
- A complete public Privacy page at `/wedding/privacy`.
- Compact sticky public navigation on desktop and mobile layouts.
- Same-tab navigation for internal wedding-site links.
- New-tab behavior for external media, hotel, and map links.

The Warinanco Park ceremony/Sphinx reception configuration and the
Sphinx-only configuration must both be complete before the
invitation-launch version is published. The selected configuration must
be active when the printed invitations are mailed.

For both configurations, the public schedule must publish only the
confirmed guest-facing event blocks and must not convert tentative or
flexible reception activities into fixed public commitments.

If the Warinanco Park ceremony/Sphinx reception configuration is active
when invitations are mailed but later weather conditions require the
fallback, the website must remain capable of switching promptly to the
Sphinx-only configuration without rebuilding the affected pages.

### Post-Wedding Version

The post-wedding version may be completed after the invitation-launch
version and after the wedding. It may include:

- Professional photographs.
- Guest photographs.
- Videos.
- Full-resolution download links.
- Ceremony program downloads.
- Archived invitations.
- Vows and speeches.
- Guestbook messages.
- Other approved wedding-history material.

Post-wedding gallery and archival work must not delay the RSVP system,
the selected venue and schedule information, or any other essential
guest information required for the invitation-launch version.

## Navigation and Link Requirements

The public website must use compact sticky navigation on desktop and
mobile layouts.

The sticky navigation must:

- Remain available while the guest scrolls.
- Keep RSVP access prominent.
- Avoid obscuring headings, RSVP fields, validation messages, focused
  controls, or other essential content.
- Present the approved primary links without overlap on desktop.
- Use a clearly labeled and operable menu control on mobile rather than
  relying on an unexplained icon alone.
- Close the mobile menu after a destination is selected.
- Remain operable through both touch and keyboard input.

Links to pages within
`https://www.loreweavercreations.com/wedding/` must open in the same
browser tab.

External media, hotel, and map links must open in a new browser tab.
New-tab links must use appropriate security attributes and must be
identified accessibly so guests are not moved to another tab without
warning.

## Production Invitation Configuration Requirements

The couple-supplied private `Invitees List` spreadsheet is the
authoritative source for the initial production invitation
configurations.

The production source contains 56 invitation records corresponding to
the 56 printed invitations. The application must load the transformed
records dynamically and must not embed a permanently fixed invitation
count in the RSVP renderer or validation logic.

Each source row must be transformed into one private party-level
configuration record containing, at minimum:

- `inviteCode`, using the normalized six-character Guest ID as the
  canonical lookup key and the `XXX-XXX` form only for approved display.
- Reviewed party-display and greeting content derived from the supplied
  private name fields.
- Explicit `wordingMode`, taken from the supplied `I/We Invite Language`
  value rather than inferred in the browser.
- `maximumAttendance`, taken from `Total Potential Attendees`.
- `additionalGuestAllowance`, represented as a nonnegative whole-number
  count derived from the source's `Plus1` allocations.
- `questionProfile`, using `default` unless the source note assigns the
  approved `reduced-attendance-dietary` profile.
- Protected `active` and `environment` values that distinguish active
  production records from disabled development or testing records.

Child-allocation information may remain available as private
administrative context, but it must not create named-child RSVP controls.

The production transformation must fail before deployment when it finds:

- A malformed invitation code.
- Duplicate canonical lookup keys or normalization collisions.
- A missing required source value.
- An unsupported wording mode.
- A missing, negative, or non-whole-number maximum-attendance value.
- A negative or non-whole-number additional-guest allowance.
- An additional-guest allowance incompatible with the invitation's
  maximum attendance.
- An unknown or unapproved question profile.
- Any other ambiguous or contradictory production record.

The initial production transformation must reproduce these approved
source-audit results:

- 56 invitation records.
- 56 unique canonical invitation-code keys.
- 34 singular `I` wording records and 22 plural `We` wording records.
- 23 records authorizing at least one additional guest.
- 26 total authorized additional-guest allocations.
- Two records authorizing more than one additional guest.
- One record using the approved reduced substantive question profile.
- A combined maximum-attendance capacity of 114.

The real Invitees List, generated production configurations, production
codes, guest names, and every mapping between them must remain private.
They must not appear in public documentation, frontend source files,
public repositories, public assets, browser responses, analytics,
metadata, or ordinary application logs.

## RSVP Access Requirements

Guests must access the online RSVP system through the public entry page:

https://www.loreweavercreations.com/wedding/rsvp/

Guests must manually enter the six-character invitation code printed on
their invitation.

The application must not use or distribute personalized RSVP URLs
containing invitation codes. Invitation codes must not remain visible in
the browser address bar after submission.

After the backend validates a code, the application must render the
applicable personalized form without changing the public route to a
code-bearing URL.

The browser must receive only the information needed to render the
validated invitation's form, including:

- Invitation-specific singular or plural wording.
- The authorized additional-guest allowance and corresponding control
  definition where the applicable profile permits it.
- Maximum permitted party size.
- The approved `default` or `reduced-attendance-dietary` question profile
  and applicable question structure.

The browser must not receive or display:

- Another invitation's record.
- Other invitation codes.
- Private administrative notes.
- Complete spreadsheet data.
- The validated party's previously stored RSVP answers.
- The validated party's previously stored confirmation contact details.

Every valid invitation-code lookup must display a blank RSVP form,
regardless of whether that invitation already has a stored response.

## RSVP Submission and Revision Requirements

### Initial Submissions

For an initial RSVP, the guest must complete every field required to
create a valid full response.

The backend must validate the complete initial response before saving
it as the current response for that invitation.

### Revisions

For a revision, the guest must:

- Return to the public RSVP entry page.
- Re-enter the invitation code.
- Re-enter the required operational confirmation fields, including the
  selected confirmation method, the applicable email address or,
  when Text Message is enabled and selected, SMS-capable mobile number,
  and any required transactional text-message authorization.
- Complete only the RSVP fields that need to change.

The revision process must use field-level partial updates:

- A submitted RSVP field replaces the corresponding stored value.
- An omitted RSVP field retains its current stored value.
- Submitted operational confirmation fields replace the applicable
  stored confirmation method, destination, and authorization state.
- The backend merges submitted changes with the stored response.
- The backend validates the complete merged response before saving it.
- The validated merged response becomes the new current version.
- The submission version increments without creating a duplicate current
  record.

The interface must provide explicit controls or values for clearing
previously submitted information. An omitted blank field must mean only
"leave this answer unchanged" and must not also mean "delete the stored
answer."

The system must support clear and unambiguous changes including:

- Changing between attendance and decline.
- Changing Ceremony and Reception selections.
- Changing an authorized additional-guest answer or count when that field
  belongs to the applicable profile.
- Changing attendance totals by age category when those fields belong to
  the applicable profile.
- Removing or replacing a prior dietary response.
- Changing the confirmation method or destination.

The final merged response must remain internally consistent and must not
contain:

- Simultaneous attendance and decline.
- An additional-guest field for a profile or invitation that does not
  authorize it.
- A negative, fractional, or above-allowance additional-guest count.
- Attendance-total fields for the approved reduced profile.
- Negative or non-whole-number attendance totals in the default profile.
- Default-profile attendance totals exceeding the invitation maximum.
- Dietary information retained for a fully declining party when it is
  no longer applicable.
- Any other unauthorized or contradictory answer state.

## RSVP Deadline and Countdown Requirements

The deadline for online initial submissions and revisions is Monday,
March 1, 2027, at 11:59 p.m. EST.

The deadline must be enforced using the `America/New_York` time zone and
must not depend on the guest's device clock or local time zone.

Before February 1, 2027, the RSVP entry page and personalized form must
display the written deadline without a live countdown.

Beginning February 1, 2027, at 12:00 a.m. EST, the RSVP entry page and
personalized form must display a live countdown to the deadline.

At and after the deadline:

- The countdown must be removed.
- Online submission and revision controls must be disabled.
- The RSVP pages must display the closed-RSVP state.
- Guests must receive appropriate contact instructions for late changes
  or assistance.

## RSVP Service and Uncertain-Outcome Requirements

When invitation lookup or submission services are temporarily
unavailable, the RSVP route must display a guest-safe service-unavailable
state. That state must provide the approved assistance information and
printed-response alternative without exposing server, spreadsheet,
credential, email-provider, or text-message-provider details.

When a network interruption or other client-side failure prevents the
browser from determining whether a submission was recorded, the RSVP
route must display a submission-uncertain state. The state must:

- Explain that the website cannot yet confirm whether the RSVP was
  recorded.
- Avoid claiming either success or failure without evidence.
- Direct the guest to check the selected email or text-message
  destination and provide the approved assistance method.
- Avoid encouraging repeated immediate or blind resubmission.
- Permit a safe retry using the same client submission identifier so the
  backend can return an idempotent outcome without writing a duplicate
  RSVP version.

A service-unavailable or submission-uncertain state must not expose
previously stored RSVP answers, confirmation destinations, invitation
configuration details, or internal system information.

## RSVP Question Requirements

The online RSVP system must use one of the two approved substantive
question profiles associated with the applicable invitation
configuration. Each profile must remain consistent with the substantive
response information intended for the corresponding printed invitation.

### Default RSVP Question Profile

The default substantive profile contains:

1. Invitation-specific attendance wording using either “I” or “We”:
   - “I will be attending” or “We will be attending.”
   - Guests may select Ceremony, Reception, or both.
2. Invitation-specific decline wording using either “I am” or “We are”:
   - “Regretfully, I am unable to attend” or
     “Regretfully, we are unable to attend.”
3. Conditional additional-guest attendance:
   - An `additionalGuestAllowance` of zero produces no additional-guest
     question.
   - An allowance of one produces “Will you be accompanied by a +1?”
     with Yes and No answers.
   - An allowance greater than one produces a whole-number or select
     control asking how many additional guests will accompany the party.
   - The permitted response range is zero through the configured
     allowance.
   - The form must not request an additional guest's name.
4. Party attendance totals under the prompt:
   - “To better accommodate the seating & dietary needs of our guests,
     please list the total number of attendees in your party.”
   - Adults, ages 21 and older.
   - Young Adults, ages 18–20.
   - Children, ages 3–17.
   - Children under 3.
5. One party-level free-text response requesting food allergies or
   dietary preferences for the members of the party.

For the default profile, the sum of the four age-category totals must
represent the complete attending party, including every attending
additional guest, and must not exceed `maximumAttendance`.

### Reduced Attendance-and-Dietary Profile

The single approved `reduced-attendance-dietary` profile contains only:

1. Ceremony and Reception attendance using the applicable singular or
   plural wording, or the mutually exclusive decline response.
2. One party-level free-text response requesting food allergies or
   dietary preferences.

The reduced profile must not render or accept:

- An additional-guest response.
- Adults, Young Adults, Children, or Children-under-3 totals.
- An overall attendance total derived from those absent fields.

No second reduced profile or other substantive question profile may be
enabled without a later recorded decision.

### Closed Substantive Question Set

Across both approved profiles, the RSVP form must not ask for:

- Individual named-guest attendance.
- An additional guest's name.
- Named-child attendance.
- Accessibility details.
- Lodging plans.
- Transportation needs.
- A message to the couple.
- Entrée selections.
- Any other unapproved substantive guest-facing question.

Invitation-specific substantive variation is limited to:

- Singular or plural wording mode.
- The authorized additional-guest allowance and corresponding control.
- Selection of the approved default or reduced question profile.

The online form must separately require operational contact and delivery
fields for every initial submission and revision under either profile,
including:

- Confirmation method.
- Confirmation email address when Email is selected.
- SMS-capable mobile number only when Text Message is enabled in the
  current production configuration and selected.
- Any required transactional text-message authorization when the enabled
  Text Message process requires it.

These operational fields are not part of the substantive mail-in RSVP
question profile.

## RSVP Confirmation Requirements

After every successful initial submission or revision, the RSVP must be
stored before guest or administrative confirmation delivery is
attempted.

After storage succeeds, the guest-confirmation attempt and the protected
administrative-email attempt must be handled independently. Failure,
delay, or uncertainty affecting one delivery channel must not prevent the
other applicable confirmation attempt from being made.

### Guest Confirmation

Email confirmation is an approved guest confirmation method.

Text-message confirmation is also an approved method, but it may be
presented and accepted in production only after the finalized Phase 3
Step 14 SMS-provider enablement gate has been satisfied.

Before Text Message is enabled in production:

- The production SMS provider must be selected.
- The provider's applicable sender-identification, consent, carrier-rate,
  opt-out/help, and other required guest-facing wording must be verified.
- Provider credentials and sender configuration must remain backend-only.
- The production Text Message flow must be tested.

If those conditions are not satisfied, the Text Message option must
remain disabled rather than displaying invented provider-specific copy.

The guest must provide at least one valid confirmation destination
applicable to the selected method.

An Email selection requires a valid email address. An enabled Text
Message selection requires a valid SMS-capable mobile number and any
applicable transactional-message authorization.

The guest confirmation must contain the complete current RSVP according
to the invitation's approved question profile after the initial
submission or merged revision, including:

- Ceremony and Reception selections or decline status.
- The additional-guest answer or count when that field belongs to the
  applicable profile.
- All four age-category totals and the overall attendance total when those
  fields belong to the applicable profile.
- Party-level food-allergy or dietary-preference response.
- Submission or revision timestamp.
- Whether the confirmation reflects an initial submission or revision.
- RSVP deadline and revision instructions.
- RSVP assistance information.

The confirmation must omit fields that do not belong to the applicable
profile. It must not invent a zero value or display a “not applicable”
placeholder merely because another profile uses the field.

A text-message confirmation may use multiple message segments when
necessary to include the complete current RSVP.

### Administrative Confirmation

Every successful initial submission or revision must send an
administrative confirmation by email to the couple's configured address.

The administrative email must contain the complete current RSVP
according to the invitation's approved question profile, including:

- The invitation or invited-party identifier needed by the couple.
- The applicable question-profile identifier or equivalent private
  administrative context.
- Whether the action was an initial submission or revision.
- Ceremony and Reception selections or decline status.
- The additional-guest answer or count when that field belongs to the
  applicable profile.
- All four age-category totals and the overall attendance total when those
  fields belong to the applicable profile.
- Party-level food-allergy or dietary-preference response.
- Guest confirmation method and destination.
- Submission version.
- Submission or revision timestamp.

The administrative email must omit substantive fields that are absent
from the applicable profile rather than inventing values for them.

Administrative confirmation emails must be treated as protected private
correspondence because they contain complete RSVP information.

### On-Screen Confirmation

After the response has been stored, the on-screen confirmation must:

- Clearly state that the RSVP was recorded successfully.
- Identify whether the recorded action was an initial submission or a
  revision.
- Display the complete current guest-facing RSVP summary.
- Display the submission or revision timestamp.
- Identify the selected guest confirmation channel.
- Display the guest-confirmation delivery-attempt status.
- Indicate whether the protected administrative-email attempt succeeded,
  failed, or remains uncertain without exposing the administrative email
  address.
- Explain that the guest may revise the RSVP before the deadline.
- Explain that a revision begins by returning to the RSVP entry page and
  re-entering the invitation code.
- Explain that omitted RSVP fields remain unchanged during a revision.
- Explain that the next confirmation will contain the complete updated
  RSVP.

Temporary on-screen confirmation details do not need to survive a
browser refresh.

If the confirmation route is refreshed after temporary confirmation
state is lost, the page must:

- Explain safely that the prior RSVP may already have been recorded.
- Direct the guest back to manual RSVP entry.
- Avoid instructing the guest to resubmit an RSVP that may already exist.

### Delivery Failure

A guest email, guest text message, or administrative-email delivery
failure must not:

- Undo a successfully stored RSVP.
- Create a duplicate RSVP.
- Increment the RSVP version by itself.
- Prevent the other applicable guest or administrative confirmation
  attempt from being made.
- Instruct the guest to repeat a submission that was already stored.

When the RSVP was stored but confirmation delivery failed, the website
must display a success-with-warning state and provide appropriate
assistance information.

The private administrative records must track delivery status by
channel and attempt. The couple must have a documented method for
resending a failed guest confirmation without changing the stored RSVP.

## Privacy and Security Requirements

The RSVP entry page and personalized RSVP form must display a concise
privacy notice before the guest submits information.

The concise notice must:

- Explain briefly that the invitation code is used to retrieve the
  applicable blank RSVP form configuration.
- Avoid describing the invitation code as a password or password-equivalent
  authentication mechanism.
- Explain that RSVP and confirmation-contact information is processed and
  stored privately for RSVP administration and confirmation delivery.
- Explain that complete confirmations are sent to the couple by protected
  administrative email and to the guest by Email or, when enabled, the
  selected Text Message method.
- Explain that RSVP mobile numbers are used only for the approved
  transactional RSVP-confirmation purpose and approved manual resend unless
  another use is separately authorized by a later recorded decision.
- Link to the complete Privacy page.
- Avoid unsupported promises or guarantees.

The full Privacy page must be publicly available at:

https://www.loreweavercreations.com/wedding/privacy

The Privacy page must explain in plain language:

- How invitation codes are used and their limits as access tokens rather
  than strong account passwords.
- What RSVP information is collected.
- What operational contact and delivery information is collected.
- That every form loads blank and does not display stored RSVP answers or
  stored confirmation destinations.
- How partial revisions are merged with existing responses.
- That RSVP information is stored in the private administrative system.
- That complete protected administrative confirmations are sent to the
  couple by email.
- That guest confirmations are sent by Email or, when the production SMS
  gate has been satisfied, Text Message.
- Who may access the information.
- The privacy boundary for party-level dietary and allergy information.
- The data-exposure safeguards applicable to URLs, indexing, analytics, and
  ordinary logs.
- The finalized RSVP-operational retention and retirement schedule.
- How guests may request assistance or correction.
- That the website describes actual safeguards without promising absolute
  security.

Invitation codes are limited access tokens. The system must not provide:

- A public guest or invitation directory.
- A public invitation-code recovery search.
- Fuzzy matching or close-match suggestions.
- Automatic visually similar character substitution.
- A public saved-RSVP or RSVP-history endpoint.
- A personalized code-bearing browser route.

Invitation codes must be transported only in request bodies for the
approved RSVP lookup and submission operations. They must not appear in
browser paths, query strings, URL fragments, public metadata, analytics
payloads, or ordinary logs.

The production responses serving `/wedding/rsvp/` and
`/wedding/rsvp/confirmation`, and every successful or unsuccessful RSVP
lookup or submission API response, must use:

`Cache-Control: no-store, max-age=0`

Static versioned application assets containing no personalized or secret
information may use ordinary cache optimization.

The application must prevent one invited party from receiving another
party's information. RSVP records, confirmation destinations, dietary
information, administrative notes, spreadsheet contents, credentials,
and internal identifiers must not be exposed publicly.

RSVP entry, form, confirmation, not-found, and unmatched transactional
experiences must not be indexed by public search engines. Personalized
values must not appear in page titles, descriptions, canonical URLs,
structured data, social-preview metadata, or other crawler-visible
metadata.

Analytics associated with RSVP or confirmation routes must not receive:

- Invitation codes.
- Guest or household identities derived from invitation records.
- RSVP answers.
- Dietary or allergy information.
- Email addresses.
- Mobile numbers.
- Confirmation destinations.
- `clientSubmissionId` values.
- Question-profile assignments.
- Additional-guest allowances.
- RSVP version numbers.
- Delivery-provider payloads.

Analytics must not be required for RSVP functionality.

Ordinary application, reverse-proxy, and delivery logs must not record
raw or normalized invitation codes, RSVP request or response bodies,
guest answers, dietary or allergy text, confirmation destinations,
`clientSubmissionId` values, private workbook content, protected
administrative addresses, or provider credentials/secrets.

The production RSVP API must enforce these initial rate limits:

- `POST /wedding/api/rsvp/lookup`: maximum 10 requests per 15-minute
  rolling window per client IP address.
- `POST /wedding/api/rsvp/submit`: maximum 6 requests per 15-minute rolling
  window per client IP address.
- `POST /wedding/api/rsvp/submit`: maximum 6 requests per 15-minute rolling
  window per normalized invitation code.

An exceeded limit must use guest-safe `429 Too Many Requests` behavior and
must not create an RSVP version or delivery attempt. When deployed behind
a reverse proxy or tunnel, per-IP limiting must trust only the configured
production proxy chain rather than arbitrary forwarded-address headers.

Google credentials, email credentials, SMS credentials, sender
configuration, and the protected administrative-recipient address must
remain backend-only. Production and development/testing invitation data,
fixtures, and secrets must remain separated.

Guest-facing backend errors must not expose stack traces, framework
diagnostics, filesystem paths, spreadsheet identifiers, worksheet names,
provider payloads, credentials, protected administrative addresses,
internal record identifiers, close-match invitation information, or
development-record existence.

Party-level dietary or allergy information may appear only in the
submitting party's own temporary on-screen confirmation, that party's
selected electronic confirmation, the protected administrative
confirmation, and authorized private administrative records. It must not
appear in analytics, public metadata, ordinary logs, unrelated
administrative messages, or another invited party's information.

Complete active RSVP-operational data may be retained through
**July 30, 2027**, 90 days after the May 1, 2027 wedding.

No later than July 30, 2027, RSVP-operational data no longer needed for a
concrete unresolved administrative purpose must be deleted or irreversibly
de-identified from the active RSVP system. This includes current and
superseded RSVP responses, dietary/allergy text, guest confirmation
destinations, SMS authorization records, `clientSubmissionId` values,
delivery-attempt history, transaction timestamps retained only as RSVP
history, and active invitation-code-to-RSVP-response mappings used solely
by the website.

Protected backups containing retired RSVP-operational data must expire
through the ordinary protected backup rotation no later than
**August 29, 2027**.

Non-identifying aggregate wedding statistics may be retained after RSVP
retirement when they cannot reasonably be used to reconstruct an invited
party's RSVP.

The separate private `Invitees List` may remain as the couple's personal
wedding-planning/address record outside the active RSVP system. Its
retention must not keep the public RSVP application dependent on retired
RSVP response history.

A minimum necessary RSVP record may temporarily remain beyond the ordinary
retirement date only for a concrete documented correction, dispute,
delivery investigation, or comparable unresolved administrative need and
must be deleted when that need ends.

The production wedding website and RSVP API must use HTTPS. Ordinary HTTP
navigation must redirect to HTTPS before RSVP information can be
submitted.

## User Groups

### Public Wedding Guests

Public wedding guests may view:

- Home.
- Theme and Attire.
- Our Story.
- Read, Listen, and Watch.
- Venues.
- Travel.
- Schedule.
- FAQ.
- Privacy.
- Public Gallery content.

Public wedding guests must see only the currently active event
configuration.

Public guests may see the confirmed ceremony and reception time blocks
and broad reception descriptions, but must not be shown an unconfirmed
or unnecessarily restrictive internal reception itinerary.

### Invited Parties

An invited party may:

- Open the public RSVP entry page.
- Manually enter its invitation code.
- Open a blank personalized RSVP form without exposing the code in the
  browser URL.
- View only the invitation-specific wording, approved question profile,
  additional-guest allowance or control where applicable, and permitted
  party maximum associated with its invitation.
- Submit an initial RSVP.
- Revise its RSVP as many times as desired until Monday, March 1, 2027,
  at 11:59 p.m. EST.
- Submit only the fields that need to change during a revision after
  completing the required confirmation-contact fields.
- Explicitly clear or replace previously submitted information.
- View the complete current guest-facing RSVP on the temporary
  confirmation screen.
- Select Email as the guest confirmation method and, when the finalized production SMS-provider gate has been satisfied, select Text Message.
- Receive the complete current RSVP after every successful initial
  submission or revision.
- View the concise privacy notice and complete Privacy page.
- Use the RSVP system from more than one supported browser or device.

The form must never display or prefill the invited party's current stored
answers or confirmation-contact information.

### Couple and Administrators

The couple may:

- Maintain invitation records.
- Maintain invitation-specific singular or plural wording.
- Maintain the nonnegative additional-guest allowance for each
  invitation.
- Maintain the approved default or reduced question profile for each
  invitation.
- Maintain the maximum permitted attendance for each invitation.
- Maintain and activate the appropriate venue and schedule
  configuration.
- Maintain the public reception description without assigning fixed
  times to flexible or unconfirmed internal reception activities.
- Add a mimosa-station description only after the arrangement is
  confirmed with Sphinx Banquet and Catering Center.
- Review party-level RSVP responses.
- Receive an administrative email containing the complete current RSVP
  whenever a response is submitted or revised.
- Review event selections and every additional-guest or attendance-total
  value applicable to the invitation's approved question profile.
- Review party-level food-allergy and dietary-preference responses.
- Review guest confirmation methods and destinations.
- Review email-delivery status and Text Message delivery status when that production channel is enabled.
- Resend a failed guest confirmation manually without changing the RSVP.
- Review submission versions and timestamps.
- Correct spreadsheet records.
- Update public wedding information.
- Add the finalized hotel-block information when it becomes available.
- Publish post-wedding photographs and videos.

No public administrative dashboard is required for the initial version.
Google Sheets will serve as the initial administrative interface.

### Post-Wedding Visitors

Post-wedding visitors may:

- View approved photographs and videos.
- Download approved wedding-owned materials.
- View permanent wedding-history pages.
- View the public Privacy page while it remains applicable.

They will not retain access to personalized RSVP forms after the RSVP
system has been retired.

## Phase 3 Step 14 Requirements Synchronization Review

The requirements are synchronized through Phase 3 Step 14 when the
following remain true:

- The RSVP question and revision model is unchanged.
- Invitation codes are limited access tokens and remain out of URLs,
  analytics, and ordinary logs.
- Personalized RSVP browser and API responses use the finalized no-store
  policy.
- Exact lookup and submission rate limits match the finalized Step 14 API
  contract.
- Production and development/test data and credentials remain separated.
- Text Message confirmation remains unavailable in production until its
  provider/disclosure gate is satisfied.
- Mobile numbers remain transactional-only.
- Dietary/allergy information remains restricted to the approved private
  confirmation and administrative surfaces.
- Active RSVP-operational data is retired by July 30, 2027 and protected
  backups expire by August 29, 2027, subject only to the documented
  minimum-record exception.
- The separate private `Invitees List` may remain a personal
  planning/address record without remaining part of the active RSVP
  application.
- Production RSVP traffic uses HTTPS.
- No Step 14 rule introduces a new substantive RSVP profile, new public
  RSVP endpoint, or new personalized browser route.

With these requirements recorded, `requirements.md` is synchronized
through **Phase 3 Step 14**.
