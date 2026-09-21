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
- The spreadsheet-authoritative personalized RSVP question structure,
  using the source-controlled party heading, singular or plural wording,
  the authorized named-invitee roster, named `Plus1` allocations,
  `maximumAttendance`, person-level attendance decisions, the derived actual
  attending count, coordinated age-category dials, and `Attendee Details`
  for every attending person, with dietary/allergy information available only
  when Reception is selected.
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
authoritative source for the active production invitation configurations
and for the substantive RSVP form-display rules recorded in its bottom-row
notes.

The current authoritative source contains 57 populated invitation records
corresponding to 57 assigned printed invitations. No production placeholder
record is required. The application must load transformed records
dynamically and must not embed a permanently fixed invitation count in the
RSVP renderer, validation logic, or route structure.

Each populated source row must be transformed into one private party-level
configuration record containing, at minimum:

- `inviteCode`, using the normalized six-character Guest ID as the
  canonical lookup key and the `XXX-XXX` form only for approved display.
- `partyDisplayName`, using `Attendee Names Clarification` when populated;
  otherwise deriving the heading from the supplied `First Name(s)` and
  `Last Name(s)` values.
- Explicit `wordingMode`, taken from the spreadsheet's `I/We wording`
  value rather than inferred in the browser.
- `maximumAttendance`, taken from `Total Potential Attendees (Including
  Plus1 and Kids)`. This value is the maximum possible size of the
  invitation-code party; it is not an independently selected attending
  headcount.
- `namedInvitees`, containing one private roster record for every
  non-`Plus1` potential attendee represented by the invitation, with a
  stable opaque non-name identifier and the approved guest-facing display
  name needed for that person's individual attendance question.
- `additionalGuestAllocations`, containing one private allocation record
  per source `Plus1`, with a stable opaque non-name identifier and the named
  invitee used in the guest-facing allocation question label.
- Protected `active` and `environment` values that distinguish active
  production records from disabled development or testing records.

The produced configuration must account for every potential-attendance
slot represented by the authoritative maximum:

`namedInvitees.length + additionalGuestAllocations.length = maximumAttendance`

A source row that cannot satisfy this relationship must fail transformation
for private review rather than allowing the application to invent,
omit, or infer an unidentified attendee from the numeric maximum alone.

For the named-invitee roster:

- Every non-`Plus1` potential attendee represented by the invitation must
  become one `namedInvitees` record.
- Each record uses a stable opaque identifier that does not encode the
  person's name.
- The limited validated lookup response may expose only the identifier and
  approved display information needed to ask that party's own attendance
  question.
- Unknown, duplicate, malformed, or cross-party named-invitee identifiers
  must never be accepted on submission.
- A child represented as a non-`Plus1` potential attendee uses the same
  reusable named-invitee attendance mechanism as another named invitee;
  the child's age classification is recorded later through the applicable
  attendance-total dial.

For `Plus1` transformation:

- A row with no `Plus1` creates no additional-guest allocation.
- A single unparenthesized `Plus1` is associated with the primary named
  invitee for that row.
- When multiple `Plus1` entries appear in one row, the parenthesized name
  following each `Plus1` identifies the named invitee for that allocation.
- The additional guest's own name is not part of the allocation question
  or private allocation definition beyond what is necessary to associate
  the allocation with its authorized named invitee. If the additional guest
  attends, that person's name is collected later through ordinary
  `Attendee Details`.

The current authoritative source defines one reusable production
substantive RSVP form structure. It does not require separate production
question-profile assignments. Invitation-specific variation is limited to
the source-controlled party heading, singular or plural wording, authorized
`namedInvitees` roster, authorized named-invitee `Plus1` allocations,
`maximumAttendance`, and the resulting person-level and repeated-field
behavior.

The production transformation must fail before deployment when it finds:

- A malformed invitation code.
- Duplicate canonical lookup keys or normalization collisions.
- A missing required source value.
- An unsupported wording mode.
- A missing, negative, zero, or non-whole-number maximum-attendance value.
- Ambiguous or incomplete named-invitee roster data.
- A missing, malformed, duplicate, name-derived, or otherwise invalid
  named-invitee identifier.
- Malformed or ambiguous `Plus1` allocation text.
- A missing, malformed, duplicate, name-derived, or otherwise invalid
  additional-guest allocation identifier.
- A `namedInvitees` plus `additionalGuestAllocations` count that does not
  equal `maximumAttendance`.
- Ambiguous party-display data.
- Any other contradictory production record.

The initial production transformation must reproduce these authoritative
source-audit results:

- 57 active invitation records.
- 57 unique canonical invitation-code keys.
- 35 singular `I` wording records and 22 plural `we` wording records.
- 23 records authorizing at least one additional guest.
- 26 total `Plus1` allocations.
- Two records authorizing more than one additional guest.
- A combined maximum-attendance capacity of 115.
- No required active production placeholder record.

These aggregate values are transformation-validation targets only. They
must not be hard-coded into the reusable RSVP renderer or business logic.

The real Invitees List, generated production configurations, production
codes, guest names, named-invitee roster mappings, named-invitee `Plus1`
mappings, and every mapping among them must remain private. They must not
appear in public documentation, frontend source files, public repositories,
public assets, analytics, metadata, or ordinary application logs. A
validated browser response may receive only the limited invitation-specific
identifiers, names, labels, and configuration required to render that
party's own blank RSVP form.
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
validated invitation's blank form, including as applicable:

- The reviewed party-display heading or greeting.
- Invitation-specific singular or plural wording.
- `maximumAttendance` as the maximum possible party size.
- The validated party's limited `namedInvitees` roster, containing only
  opaque stable identifiers and approved display names needed to render
  one Yes/No attendance decision per named invitee.
- The authorized named-invitee `Plus1` allocation labels and opaque stable
  allocation identifiers required to render one Yes/No question per
  allocation.
- The approved spreadsheet-authoritative question structure, conditions,
  limits, and operational confirmation options required for that
  invitation.

The browser must not receive or display:

- Another invitation's record.
- Other invitation codes.
- Unrelated guest identities, named-invitee roster records, or `Plus1`
  mappings.
- Private source-row fields beyond the limited display information needed
  for the validated party's own form.
- Private administrative notes.
- Complete spreadsheet data.
- The validated party's previously stored RSVP answers, including prior
  named-invitee attendance decisions, `Plus1` responses, age totals,
  attendee names, or dietary/allergy information.
- The validated party's previously stored confirmation contact details.
- A stored-response indicator that would disclose whether the party has
  previously submitted an RSVP.

Every valid invitation-code lookup must display a blank RSVP form,
regardless of whether that invitation already has a stored response.
## RSVP Submission and Revision Requirements

### Initial Submissions

For an initial RSVP, the guest must complete every field required by the
validated invitation configuration and the guest's current selections to
create a valid full response.

An attending initial RSVP must include:

- Ceremony, Reception, or both as the party's event attendance selection,
  with full decline not selected.
- One explicit Yes/No `namedInviteeResponses` decision for every
  authorized record in `invitation.namedInvitees`.
- One explicit Yes/No `additionalGuestResponses` decision for every
  authorized named-invitee `Plus1` allocation.
- Complete values for all four age-category attendance dials.
- Exactly one `attendeeDetails` record per person in the backend-derived
  actual attending party, regardless of whether the RSVP is Ceremony only,
  Reception only, or Ceremony plus Reception.
- A required `attendeeName` in every attendee-detail record.
- `Dietary or allergy information` only when Reception is selected; the
  value may be blank.
- The required operational confirmation method, applicable destination,
  and any required transactional SMS authorization.

For an attending RSVP, the backend must derive the actual attending count
from the complete person-level decisions:

`overallAttendance = named invitees answered Yes + authorized Plus1 allocations answered Yes`

The derived `overallAttendance` must be at least 1 and may never exceed
`maximumAttendance`. The four age-category totals must sum exactly to this
derived count, and `attendeeDetails.length` must equal it exactly.

A full decline establishes `overallAttendance = 0` and must contain the
decline state plus the required operational confirmation fields without
retaining named-invitee responses, `Plus1` responses, age-category totals,
or attendee-detail records.

The backend must validate the complete initial response before saving it
as the current response for that invitation.

### Revisions

For a revision, the guest must:

- Return to the public RSVP entry page.
- Re-enter the invitation code.
- Re-enter the required operational confirmation fields, including the
  selected confirmation method, the applicable email address or, when
  Text Message is enabled and selected, SMS-capable mobile number, and any
  required transactional text-message authorization.
- Complete only the substantive RSVP fields that need to change, except
  where a dependency requires a complete replacement structure.

The revision process must use field-level partial updates:

- A submitted substantive field replaces the corresponding stored value.
- An omitted substantive field retains its current stored value unless an
  authoritative dependency makes the stored value inapplicable.
- Explicit zero is a valid replacement for an age-category total and is
  distinct from omission.
- An authorized explicit clear operation is distinct from omission.
- Submitted operational confirmation fields replace the applicable stored
  confirmation method, destination, and authorization state.
- The backend merges submitted changes with the stored response.
- The backend applies authoritative dependent-value clearing.
- The backend re-derives `overallAttendance` from the complete resulting
  person-level attendance decisions rather than preserving or trusting an
  independently supplied headcount.
- The backend validates the complete merged response before saving it.
- The validated merged response becomes the new current version.
- The submission version increments without creating a duplicate current
  record.

The interface must provide explicit controls or values for clearing or
replacing previously submitted information. An omitted blank field must
mean only "leave this answer unchanged" and must not also mean "delete the
stored answer," except where another submitted change makes that value
inapplicable through an authoritative dependency.

The system must support clear and unambiguous changes including:

- Changing between attendance and full decline.
- Changing Ceremony and Reception selections.
- Changing any authorized named-invitee Yes/No response.
- Changing any authorized named-invitee `Plus1` Yes/No response.
- Changing any age-category dial value, including replacing a positive
  value with zero.
- Replacing the complete `attendeeDetails` list when the identity
  composition of the attending party changes, even when the numerical
  `overallAttendance` remains unchanged.
- Replacing the complete `attendeeDetails` list when the derived attending
  count changes.
- Replacing or explicitly clearing applicable Reception dietary/allergy
  information through the authorized attendee-detail structure.
- Changing the confirmation method or destination.

Dependency processing must enforce the following rules:

- A full decline clears Ceremony and Reception selections as applicable,
  all `namedInviteeResponses`, all `additionalGuestResponses`, all
  age-category totals, the derived attending state, and the entire
  `attendeeDetails` list.
- A transition from full decline to an attending state makes all
  named-invitee and authorized `Plus1` Yes/No decisions newly applicable,
  requires complete age-category totals, and requires a complete
  `attendeeDetails` list matching the newly derived attending party.
- Removing Reception while continuing to attend preserves the applicable
  `attendeeDetails` records and attendee names but clears all stored
  dietary/allergy values because those values are Reception-specific.
- Adding Reception while the attending composition remains unchanged does
  not invalidate stored attendee names; dietary/allergy information becomes
  applicable but remains optional.
- Any change to named-invitee or authorized `Plus1` responses that changes
  which people are attending is an attending-composition change and
  requires complete replacement of `attendeeDetails`, even if the numeric
  `overallAttendance` is unchanged.
- Any change that produces a different `overallAttendance` requires a
  complete `attendeeDetails` list with exactly the new number of records.
- If the attending composition is unchanged and `attendeeDetails` is
  omitted in a revision, the stored attendee-detail list remains unchanged,
  subject to Reception-specific dietary clearing.
- The complete merged age-category totals must equal the newly derived
  `overallAttendance` exactly before storage.

The final merged response must remain internally consistent and must not
contain:

- Simultaneous attendance and full decline.
- Ceremony or Reception selections together with a full-decline state.
- Missing named-invitee responses when they are newly applicable.
- A response for an unknown, duplicate, malformed, or cross-party
  named-invitee identifier.
- Missing responses for an applicable authorized `Plus1` allocation when
  they are newly applicable.
- A response for an unknown, duplicate, malformed, or unauthorized
  `Plus1` allocation.
- A derived `overallAttendance` below one for an attending response or
  above `maximumAttendance`.
- Negative or fractional age-category totals.
- Age-category totals whose complete sum differs from derived
  `overallAttendance`.
- An `attendeeDetails` array whose length differs from derived
  `overallAttendance`.
- A missing attendee name or an attendee name exceeding 100 characters.
- Dietary/allergy information exceeding 1000 characters.
- Dietary/allergy data when Reception is not selected.
- Attendance-dependent substantive data retained after a full decline.
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

The online RSVP system must use the single reusable substantive question
structure defined by the authoritative private `Invitees List` spreadsheet
and its bottom-row display notes together with the approved attendance-model
clarification. The renderer must use invitation-specific configuration
values to determine wording, authorized named-invitee attendance questions,
authorized named-invitee `Plus1` questions, party capacity, the derived
actual attending count, coordinated age totals, and repeated attendee-detail
fields without creating separate production question profiles.

### Coordinated Event-Attendance Control

The substantive form must present one coordinated three-checkbox event
attendance interface:

1. `Ceremony`.
2. `Reception`.
3. `Regretfully, I am unable to attend.` or
   `Regretfully, we are unable to attend.`, according to the explicit
   singular or plural wording mode in the invitation configuration.

Ceremony and Reception may be selected independently or together.
Selecting either attending event must disable the full-decline checkbox.
Selecting full decline must disable Ceremony and Reception. The backend
must independently reject any contradictory submitted combination
regardless of browser state.

The event-attendance choice establishes which wedding event or events the
attending members of the invited party will attend. It does not by itself
establish which individual people in a multi-person invitation are
attending.

### Named-Invitee Attendance Decisions

When the party is attending, the form must render one individual Yes/No
attendance question for every authorized object in
`invitation.namedInvitees`.

Named-invitee behavior must follow these rules:

- Each control displays the invitee's approved guest-facing name.
- Each submitted response is keyed by the invitee's stable opaque
  identifier; the identifier must not encode the person's name.
- Every authorized named invitee requires an explicit Yes or No response
  on an initial attending RSVP or a transition from full decline to an
  attending state.
- On an ordinary continuing-attendance revision, an omitted stored
  response remains unchanged unless another submitted change requires a
  complete replacement or makes it inapplicable.
- Unknown, duplicate, malformed, or cross-party named-invitee identifiers
  are rejected.
- A full party decline makes all individual named-invitee attendance
  responses inapplicable and establishes an actual attending count of zero.

### Named-Invitee `Plus1` Questions

For each authorized source `Plus1` allocation, the form must render one
Yes/No question labeled:

`Will [Named Invitee] be accompanied by a +1?`

Additional-guest behavior must follow these rules:

- A row with no authorized `Plus1` allocation renders no `Plus1` question.
- A row with one allocation renders exactly one question.
- A row with multiple allocations renders one question for each allocation
  in succession.
- Each response is keyed by a stable opaque non-name allocation identifier.
- Multiple-allocation labels use the associated invitee names supplied by
  the source.
- The allocation question does not request the additional guest's own name.
- Every applicable allocation requires a Yes or No response for an initial
  attending RSVP or a transition from full decline to attendance.
- A Yes response contributes one person to the derived actual attending
  count; an attending additional guest's name is collected later through
  ordinary `Attendee Details`.

### Derived Total Attending Party

`maximumAttendance` remains the maximum possible size of the
invitation-code party. It must not be presented or treated as an
independently selectable actual-attendance value.

For an attending RSVP, the backend derives `overallAttendance` from the
complete person-level attendance decisions:

`overallAttendance = named invitees answered Yes + authorized Plus1 allocations answered Yes`

The validated invitation configuration must satisfy:

`namedInvitees.length + additionalGuestAllocations.length = maximumAttendance`

For an attending RSVP, `overallAttendance` must be at least 1 and may
never exceed `maximumAttendance`. For a full decline, `overallAttendance`
is 0.

The guest-facing interface may display the derived value as the party's
`Total Attending Party`, but the guest must not independently choose or
edit that number apart from the underlying person-level Yes/No decisions.

### Attendance Totals by Age Category

For every attending RSVP, the form must display numerical dial controls
under the attendance-total prompt for:

- Adults, ages 21 and older.
- Young Adults, ages 18–20.
- Children, ages 3–17.
- Children under 3.

The four age-category controls describe the already-derived attending
party; they do not determine the size of that party independently.

Each dial:

- Begins at zero on every blank form load.
- Accepts only nonnegative whole numbers.
- May increase only to the remaining unallocated portion of the derived
  `overallAttendance` after accounting for the current values of the other
  three dials.

The four-category sum:

- Represents the age composition of the complete attending party,
  including every attending authorized `Plus1`.
- Must equal derived `overallAttendance` exactly.

The browser must enforce coordinated remaining-count behavior for
usability. The backend must independently enforce the same final equality
invariant.

### Attendee Details

The repeated section is named `Attendee Details`, not `Reception Attendee
Details`.

Whenever derived `overallAttendance` is greater than zero, the form must
render exactly one `attendeeDetails` record for each attending person,
regardless of whether the party is attending:

- Ceremony only.
- Reception only.
- Ceremony and Reception.

Every attendee-detail record contains:

1. A required `Attendee name` field with a maximum length of 100
   characters.
2. When Reception is selected, a `Dietary or allergy information` field
   with a maximum length of 1000 characters.

The visible dietary/allergy label must be exactly `Dietary or allergy
information`; it must not append `(optional)`. The field value may still be
left blank.

The `attendeeDetails` array must contain exactly as many records as
derived `overallAttendance`. It applies to every attending person,
including invited adults, young adults, children, and attending additional
guests.

Ceremony-only attendance still displays and requires attendee names but
must not display, accept, or store dietary/allergy values. Removing
Reception while continuing to attend therefore clears only dietary/allergy
values and preserves attendee-detail records and attendee names. Full
decline displays and stores no attendee-detail records.

If a revision changes which people are attending, the complete
`attendeeDetails` list must be replaced even when numeric
`overallAttendance` remains unchanged. If the attending composition is
unchanged and the list is omitted, the stored attendee-detail records
remain unchanged subject to Reception-specific dietary clearing.

### Closed Substantive Question Set

The production RSVP form must not add substantive questions outside the
spreadsheet-authoritative structure. It must not ask for:

- A separate additional-guest-name field attached to a `Plus1` allocation
  question; an attending additional guest is named through ordinary
  `Attendee Details`.
- A child-specific attendance control type separate from the ordinary
  named-invitee Yes/No mechanism.
- Accessibility details.
- Lodging plans.
- Transportation needs.
- A message to the couple.
- Entrée selections.
- Any other unapproved substantive guest-facing question.

Invitation-specific substantive variation is limited to:

- The reviewed party-display heading or greeting.
- Singular or plural wording mode.
- The authorized `namedInvitees` roster and display names.
- The authorized named-invitee `Plus1` allocations and their labels.
- `maximumAttendance`.
- The person-level decisions that produce derived `overallAttendance`.
- The resulting `Attendee Details` cardinality.
- Reception-specific visibility of `Dietary or allergy information`.

The online form must separately require operational contact and delivery
fields for every initial submission and revision, including:

- Confirmation method.
- Confirmation email address when Email is selected.
- SMS-capable mobile number only when Text Message is enabled in the
  current production configuration and selected.
- Any required transactional text-message authorization when the enabled
  Text Message process requires it.

These operational fields are not substantive mail-in RSVP questions.
## RSVP Confirmation Requirements

After every successful initial submission or revision, the RSVP must be
stored before guest or administrative confirmation delivery is attempted.

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

The guest confirmation must contain the complete current RSVP after the
initial submission or merged revision, including every field applicable to
the current spreadsheet-authoritative form state:

- Ceremony and Reception selections or full-decline status.
- Every applicable named-invitee attendance Yes/No response.
- Every applicable named-invitee `Plus1` Yes/No response.
- All four age-category totals and derived `overallAttendance` for an
  attending response.
- The complete attendee-name list for every attending response.
- Dietary/allergy information when Reception is selected and a value was
  supplied.
- Submission or revision timestamp.
- Whether the confirmation reflects an initial submission or revision.
- RSVP deadline and revision instructions.
- RSVP assistance information.

The confirmation must omit inapplicable conditional data rather than
inventing a zero value, blank placeholder, or `not applicable` value. A
Ceremony-only response therefore includes attendee names but omits dietary
or allergy information. A full decline omits all attendance-dependent
person-level responses, totals, and attendee details.

A text-message confirmation may use multiple message segments when
necessary to include the complete current RSVP.

### Administrative Confirmation

Every successful initial submission or revision must send an
administrative confirmation by email to the couple's configured address.

The administrative email must contain the complete current RSVP under the
spreadsheet-authoritative form model, including:

- The invitation or invited-party identifier needed by the couple.
- The private invitation-configuration context needed to interpret the
  response, including authorized named-invitee roster and `Plus1`
  allocation context where applicable.
- Whether the action was an initial submission or revision.
- Ceremony and Reception selections or full-decline status.
- Every applicable named-invitee attendance Yes/No response.
- Every applicable named-invitee `Plus1` Yes/No response.
- All four age-category totals and derived `overallAttendance` for an
  attending response.
- The complete attendee-name list for every attending response.
- Dietary/allergy information when Reception is selected and supplied.
- Guest confirmation method and destination.
- Submission version.
- Submission or revision timestamp.

The administrative email must omit inapplicable conditional fields rather
than inventing values for them.

Administrative confirmation emails must be treated as protected private
correspondence because they contain complete RSVP information, including
attendee names for attending responses and dietary/allergy information
when Reception is selected and supplied.

### On-Screen Confirmation

After the response has been stored, the on-screen confirmation must:

- Clearly state that the RSVP was recorded successfully.
- Identify whether the recorded action was an initial submission or a
  revision.
- Display the complete current guest-facing RSVP summary.
- Display Ceremony and Reception selections or full-decline status.
- Display every applicable named-invitee attendance response.
- Display every applicable named-invitee `Plus1` response.
- Display all four age-category totals and derived `overallAttendance` for
  an attending response.
- Display the complete attendee-name list for an attending response.
- Display dietary/allergy information when Reception is selected and a
  value was supplied.
- Display the submission or revision timestamp.
- Identify the selected guest confirmation channel.
- Display the guest-confirmation delivery-attempt status.
- Indicate whether the protected administrative-email attempt succeeded,
  failed, or remains uncertain without exposing the administrative email
  address.
- Explain that the guest may revise the RSVP before the deadline.
- Explain that a revision begins by returning to the RSVP entry page and
  re-entering the invitation code.
- Explain that omitted substantive fields remain unchanged during a
  revision unless another submitted change makes them inapplicable.
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

The private administrative records must track delivery status by channel
and attempt. The couple must have a documented method for resending a
failed guest confirmation without changing the stored RSVP.
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
- Explain that an attending RSVP collects one attendee name for every
  attending person and that Reception attendance may additionally collect
  attendee-specific dietary/allergy information.
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
- What RSVP information is collected, including individual named-invitee
  attendance decisions, named-invitee `Plus1` responses, age-category
  totals, attendee names for every attending response, and dietary/allergy
  information when Reception is selected and supplied.
- What operational contact and delivery information is collected.
- That every form loads blank and does not display stored RSVP answers or
  stored confirmation destinations.
- How partial revisions are merged with existing responses.
- That omission, replacement, explicit zero, person-level attendance
  changes, event-attendance or full-decline changes, and explicit clearing
  have distinct meanings.
- That the actual attending count is derived from authorized person-level
  attendance decisions rather than independently selected from the party
  maximum.
- That RSVP information is stored in the private administrative system.
- That complete protected administrative confirmations are sent to the
  couple by email.
- That guest confirmations are sent by Email or, when the production SMS
  gate has been satisfied, Text Message.
- That guest and administrative confirmation attempts are handled
  independently after storage.
- Who may access the information.
- The privacy boundary for attendee names and Reception-specific
  dietary/allergy information.
- The data-exposure safeguards applicable to URLs, indexing, analytics,
  and ordinary logs.
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
party's information. RSVP records, confirmation destinations, source
invitation data, named-invitee roster mappings, named-invitee `Plus1`
mappings, attendee names, dietary/allergy information, administrative
notes, spreadsheet contents, credentials, and internal identifiers must
not be exposed publicly.

RSVP entry, form, confirmation, not-found, and unmatched transactional
experiences must not be indexed by public search engines. Personalized
values must not appear in page titles, descriptions, canonical URLs,
structured data, social-preview metadata, or other crawler-visible
metadata.

Analytics associated with RSVP or confirmation routes must not receive:

- Invitation codes.
- Guest or household identities derived from invitation records.
- Attendee names.
- RSVP answers, including named-invitee attendance decisions and
  named-invitee `Plus1` responses.
- Named-invitee roster or `Plus1` allocation mappings.
- Dietary or allergy information.
- Email addresses.
- Mobile numbers.
- Confirmation destinations.
- `clientSubmissionId` values.
- Invitation-specific form-configuration details.
- RSVP version numbers.
- Delivery-provider payloads.

Analytics must not be required for RSVP functionality.

Ordinary application, reverse-proxy, and delivery logs must not record
raw or normalized invitation codes, guest names or party display names,
RSVP request or response bodies, guest answers, named-invitee roster or
`Plus1` allocation mappings, attendee names, dietary or allergy text,
confirmation destinations, `clientSubmissionId` values, private workbook
content, protected administrative addresses, or provider
credentials/secrets.

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

Attendee names may appear only in the submitting party's own temporary
on-screen confirmation, that party's selected electronic confirmation,
the protected administrative confirmation, and authorized private
administrative records. Dietary/allergy information has the same privacy
boundary but is collected and retained as an attendee response only when
Reception is selected. Neither category may appear in analytics, public
metadata, ordinary logs, unrelated administrative messages, or another
invited party's information.

Complete active RSVP-operational data may be retained through
**July 30, 2027**, 90 days after the May 1, 2027 wedding.

No later than July 30, 2027, RSVP-operational data no longer needed for a
concrete unresolved administrative purpose must be deleted or irreversibly
de-identified from the active RSVP system. This includes current and
superseded RSVP responses, attendee names, dietary/allergy text, guest
confirmation destinations, SMS authorization records,
`clientSubmissionId` values, delivery-attempt history, transaction
timestamps retained only as RSVP history, and active
invitation-code-to-RSVP-response mappings used solely by the website.

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
- View only the reviewed party heading, invitation-specific singular or
  plural wording, its own limited named-invitee display roster, authorized
  named-invitee `Plus1` questions, permitted party maximum, and
  spreadsheet-authoritative question structure associated with its
  invitation.
- Submit an initial RSVP.
- Revise its RSVP as many times as desired until Monday, March 1, 2027,
  at 11:59 p.m. EST.
- Submit only the substantive fields that need to change during a revision
  after completing the required confirmation-contact fields, except where
  a dependency requires a complete replacement structure.
- Explicitly clear or replace previously submitted information.
- Use the coordinated Ceremony / Reception / full-decline controls.
- Answer one Yes/No attendance question for each authorized named invitee
  when the party is attending.
- Answer one Yes/No question for each authorized named-invitee `Plus1`
  allocation.
- See the actual `Total Attending Party` derived from those person-level
  decisions rather than independently choose a headcount up to the party
  maximum.
- Enter the age composition of that derived attending party through four
  coordinated dials whose sum must equal the derived total exactly.
- Enter exactly one `Attendee Details` record with a required attendee name
  per attending person for Ceremony-only, Reception-only, or combined
  attendance.
- When Reception is selected, optionally provide `Dietary or allergy
  information` within each attendee-detail record.
- View the complete current guest-facing RSVP on the temporary
  confirmation screen.
- Select Email as the guest confirmation method and, when the finalized
  production SMS-provider gate has been satisfied, select Text Message.
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
- Maintain the reviewed party-display heading or greeting.
- Maintain each invitation's authorized named-invitee roster and stable
  private identifier mapping.
- Maintain each invitation's named-invitee `Plus1` allocation mapping.
- Maintain `maximumAttendance` for each invitation and verify that the
  complete named-invitee roster plus authorized `Plus1` allocations
  accounts for that maximum exactly.
- Maintain and activate the appropriate venue and schedule
  configuration.
- Maintain the public reception description without assigning fixed
  times to flexible or unconfirmed internal reception activities.
- Add a mimosa-station description only after the arrangement is
  confirmed with Sphinx Banquet and Catering Center.
- Review party-level RSVP responses.
- Receive an administrative email containing the complete current RSVP
  whenever a response is submitted or revised.
- Review Ceremony/Reception or full-decline status, every applicable
  named-invitee attendance response, and every applicable named-invitee
  `Plus1` response.
- Review all four age-category totals and the derived `overallAttendance`
  for attending responses.
- Review the complete attendee-name list for every attending response.
- Review dietary/allergy information when Reception is selected and a
  value was supplied.
- Review guest confirmation methods and destinations.
- Review email-delivery status and Text Message delivery status when that
  production channel is enabled.
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

The requirements remain synchronized with the finalized Phase 3 privacy
and security rules, the spreadsheet-authoritative RSVP source, and the
approved September 21 attendance-model clarification when all of the
following remain true:

- The private `Invitees List` spreadsheet and its bottom-row display notes
  control the active production substantive RSVP model, subject to later
  approved clarifications recorded in the governing project documents.
- The current production source contains 57 active assigned invitations,
  with no required active production placeholder.
- All active production invitations use one reusable substantive form
  structure rather than separate production question profiles.
- Each production configuration contains the authorized `namedInvitees`
  roster and authorized `additionalGuestAllocations`, and their combined
  count equals `maximumAttendance` exactly.
- Ceremony, Reception, and the singular/plural full-decline wording are one
  coordinated event-attendance interface.
- Every authorized named invitee receives an individual Yes/No attendance
  decision when the party is attending.
- Each authorized source `Plus1` allocation produces its own named-invitee
  Yes/No question.
- `maximumAttendance` remains party capacity rather than an independently
  selectable actual-attendance value.
- `overallAttendance` is derived from named-invitee Yes responses plus
  authorized `Plus1` Yes responses.
- The four coordinated age-category dials describe that derived attending
  party and must sum to `overallAttendance` exactly.
- Every attending response contains exactly one `Attendee Details` record
  per derived attendee, including Ceremony-only attendance; every such
  record contains a required attendee name.
- `Dietary or allergy information` appears only when Reception is selected,
  may be left blank, and is not labeled `(optional)` in the interface.
- Removing Reception while continuing to attend preserves attendee names
  and clears only Reception-specific dietary/allergy values.
- A change in attending-party identity composition requires complete
  `attendeeDetails` replacement even when the numeric attending count is
  unchanged.
- Blank-form and partial-revision semantics remain unchanged: stored
  answers are never displayed, omission ordinarily means no change, and
  replacement, explicit zero, event/person attendance changes, and explicit
  clearing are distinct operations.
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
- Attendee names for all attending responses and Reception-specific
  dietary/allergy information remain restricted to the approved private
  and submitting-party confirmation surfaces.
- Active RSVP-operational data is retired by July 30, 2027 and protected
  backups expire by August 29, 2027, subject only to the documented
  minimum-record exception.
- The separate private `Invitees List` may remain a personal
  planning/address record without remaining part of the active RSVP
  application after RSVP retirement.
- Production RSVP traffic uses HTTPS.
- No attendance-model correction introduces a new public RSVP endpoint or
  new personalized browser route.

With these requirements recorded, `requirements.md` is synchronized with
the authoritative `Invitees List` spreadsheet, the approved revised
`decisions.md`, and the finalized Phase 3 Step 14 privacy/security
boundaries while incorporating the September 21 attendance-model
clarification.
