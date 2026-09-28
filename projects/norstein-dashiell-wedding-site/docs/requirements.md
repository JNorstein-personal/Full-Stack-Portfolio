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
  the authorized named-invitee roster, authorized additional-guest
  allocations, `maximumAttendance`, named-invitee and Plus1 attendance
  decisions, grouped unnamed-child attendance counts where authorized, the
  derived actual attending count, coordinated age-category dials, and
  `Attendee Details` for every attending person, with dietary/allergy
  information available only when Reception is selected.
- Partial RSVP revisions that merge submitted changes with the existing
  stored response.
- Explicit controls and values for replacing previously submitted answers;
  dependent values are cleared by backend rules when another submitted
  change makes them inapplicable.
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
authoritative source for active production invitation configurations and
for the RSVP form-display rules recorded in its bottom-row notes.

The September 27, 2026 unnamed-child clarification establishes that a
child counted by `Kids(n)` whose name is absent from the parallel
`First Name(s)` and `Last Name(s)` lists is an authorized unnamed child
rather than a named invitee. The latest authoritative source has also been
cleaned so `Kids(n)` is used only for children whose names are unknown at
invitation time; specifically named children are represented only through
the C/D name lists.

The grouped-children clarification further establishes that one
invitation containing `Kids(n)` produces one grouped family-level
children authorization, not one allocation object or one Yes/No question
per child.

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
  Plus1 and Kids)`. This is the maximum possible size of the
  invitation-code party, not an independently selected attending
  headcount.
- `namedInvitees`, containing one private roster record for every
  specifically named potential attendee represented by the parallel
  comma-separated `First Name(s)` and `Last Name(s)` entries, with a stable
  opaque non-name identifier and approved guest-facing display name.
- `additionalGuestAllocations`, containing zero or more authorization/control
  records for source-authorized attendance capacity whose attendee names
  are unknown at invitation time. Every allocation contains:
  - stable opaque `id`;
  - safe `kind`;
  - reviewed guest-facing `prompt`; and
  - positive whole-number `maximumCount`.
- Protected `active` and `environment` values distinguishing active
  production records from disabled development/testing records.

The active source produces two allocation variants.

For source `Plus1` transformation:

- A row with no `Plus1` creates no Plus1 allocation.
- Each source `Plus1` creates one allocation with `kind: "plus1"` and
  `maximumCount: 1`.
- A single unparenthesized `Plus1` is associated with the primary named
  invitee for that row.
- When multiple `Plus1` entries appear in one row, the parenthesized name
  following each `Plus1` identifies the named invitee for that allocation.
- The guest-facing prompt is `Will [Named Invitee] be accompanied by a +1?`
- The Plus1 person's own name is collected later through ordinary
  `Attendee Details` if that allocation is answered Yes.

For source `Kids(n)` transformation:

- The current authoritative source uses `Kids(n)` only where those children
  are unnamed in Columns C and D.
- The transformer counts specifically named invitees and explicit `Plus1`
  occurrences and derives:

  `unnamedChildCapacity = maximumAttendance - namedInvitees.length - plus1Count`

- When `unnamedChildCapacity` is positive, the source row must contain
  `Kids(n)` authorizing that capacity. Under the current cleaned source,
  the reconciled `unnamedChildCapacity` must equal `n`.
- Exactly one grouped allocation is created for that invitation with
  `kind: "unnamedChildren"` and
  `maximumCount: unnamedChildCapacity`.
- The grouped allocation uses the approved prompt:

  `We'd love for your family to celebrate with us this Mayday - will your kid(s) be accompanying you?`

- The grouped allocation represents up to `maximumCount` unnamed children;
  it does not create one allocation object per child.
- If one or more unnamed children attend, their names are collected later
  through ordinary `Attendee Details`.

The transformation must not invent attendance capacity merely from the
numeric maximum. Every person of possible capacity must be supported by a
specifically named C/D pair, an explicit `Plus1`, or an explicit
`Kids(n)` authorization.

Because one grouped child allocation may represent several people, the
governing configuration-capacity invariant is:

`namedInvitees.length + sum(additionalGuestAllocations.maximumCount) = maximumAttendance`

Both allocation variants use the existing `additionalGuestResponses`
substantive response region. No separate child-specific substantive
response region is introduced.

The limited validated lookup response may expose only the safe allocation
properties needed by the browser to render the correct control:
`id`, `kind`, `prompt`, and `maximumCount`. Raw source text, allocation
ownership notes beyond the approved prompt, and unrelated spreadsheet
metadata remain private.

The production transformation must fail before deployment when it finds:

- A malformed invitation code.
- Duplicate canonical lookup keys or normalization collisions.
- A missing required source value.
- An unsupported wording mode.
- A missing, negative, zero, or non-whole-number maximum-attendance value.
- Unequal or ambiguous parallel C/D name lists.
- A missing, malformed, duplicate, name-derived, or otherwise invalid
  named-invitee identifier.
- Malformed or ambiguous `Plus1` text.
- A missing, malformed, duplicate, name-derived, or otherwise invalid
  additional-guest allocation identifier.
- An unsupported allocation `kind`.
- A missing, zero, negative, fractional, or otherwise invalid
  `maximumCount`.
- A positive unnamed-child residual with no applicable `Kids(n)`
  authorization.
- Under the current source, a `Kids(n)` count that does not equal the
  reconciled unnamed-child capacity.
- A total configuration capacity that does not equal `maximumAttendance`.
- Ambiguous party-display data.
- Any other contradictory production record.

The current production transformation must reproduce these authoritative
source-audit results:

- 57 active invitation records.
- 57 unique canonical invitation-code keys.
- 35 singular `I` wording records and 22 plural `we` wording records.
- 23 records containing at least one `Plus1`.
- 26 total `Plus1` allocation objects.
- Two records containing more than one `Plus1`.
- 84 specifically named potential attendees represented by the parallel
  C/D name lists.
- Two invitations containing `Kids(n)`.
- Five total unnamed-child attendance slots across those two invitations.
- Two grouped `unnamedChildren` allocation objects.
- 28 total `additionalGuestAllocations` objects: 26 Plus1 objects plus two
  grouped child objects.
- 31 total additional-guest person-capacity slots: 26 Plus1 slots plus
  five unnamed-child slots.
- A combined maximum-attendance capacity of 115.
- No required active production placeholder record.

These aggregate values are transformation-validation targets only. They
must not be hard-coded into reusable RSVP rendering or business logic.

The real Invitees List, generated production configurations, production
codes, guest names, named-invitee roster mappings, additional-guest
allocation mappings, and every mapping among them must remain private.
They must not appear in public documentation, frontend source files,
public repositories, public assets, analytics, metadata, or ordinary
application logs. A validated browser response may receive only the
limited invitation-specific identifiers, approved names/labels, allocation
kind/count metadata, and configuration required to render that party's own
blank RSVP form.

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
- The authorized `additionalGuestAllocations` safe rendering fields:
  opaque stable `id`, safe `kind`, reviewed `prompt`, and positive
  `maximumCount`. `Plus1` allocations render one Yes/No decision;
  `unnamedChildren` allocations render the approved family-level Yes/No
  question and, after Yes, a count selector from 1 through `maximumCount`.
- The approved spreadsheet-authoritative question structure, conditions,
  limits, and operational confirmation options required for that
  invitation.

The browser must not receive or display:

- Another invitation's record.
- Other invitation codes.
- Unrelated guest identities, named-invitee roster records, or
  additional-guest allocation mappings.
- Private source-row fields beyond the limited display information needed
  for the validated party's own form.
- Private administrative notes.
- Complete spreadsheet data.
- The validated party's previously stored RSVP answers, including prior
  named-invitee attendance decisions, additional-guest allocation responses,
  age totals, attendee names, or dietary/allergy information.
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
- A complete `additionalGuestResponses` value for every authorized
  `additionalGuestAllocations` record:
  - a `plus1` allocation requires `"yes"` or `"no"`;
  - an `unnamedChildren` allocation requires
    `{ "attending": "yes", "count": k }`, where `k` is a whole number from
    1 through that allocation's `maximumCount`, or
    `{ "attending": "no", "count": 0 }`.
- Complete values for all four age-category attendance dials.
- Exactly one `attendeeDetails` record per person in the backend-derived
  actual attending party, regardless of whether the RSVP is Ceremony only,
  Reception only, or Ceremony plus Reception.
- A required `attendeeName` in every attendee-detail record.
- `Dietary or allergy information` only when Reception is selected; the
  value may be blank.
- The required operational confirmation method, applicable destination,
  and any required transactional SMS authorization.

For an attending RSVP, the backend derives the actual attending count
from the complete authorized attendance decisions:

`overallAttendance = named-invitee Yes count + Plus1 Yes count + grouped unnamed-child attending count`

A named invitee answered Yes contributes one person. A Plus1 answered Yes
contributes one person. A grouped unnamed-children response contributes
its validated `count` when `attending` is `"yes"` and contributes zero
when `attending` is `"no"`.

The derived `overallAttendance` must be at least 1 and may never exceed
`maximumAttendance`. The four age-category totals must sum exactly to this
derived count, and `attendeeDetails.length` must equal it exactly.

A full decline establishes `overallAttendance = 0` and must contain the
decline state plus the required operational confirmation fields without
retaining named-invitee responses, `additionalGuestResponses`,
age-category totals, or attendee-detail records.

The backend must validate the complete initial response before saving it
as the current response for that invitation.

### Revisions

For a revision, the guest must:

- Return to the public RSVP entry page.
- Re-enter the invitation code.
- Re-enter the required operational confirmation fields, including the
  selected confirmation method, applicable email address or, when Text
  Message is enabled and selected, SMS-capable mobile number, and any
  required transactional text-message authorization.
- Complete only substantive RSVP fields that need to change, except where
  a dependency requires a complete replacement structure.

Revision processing must use the approved replacement-and-merge model:

- A submitted substantive field with `operation: "replace"` replaces or
  merges according to that field's contract-defined replacement rules.
- An omitted substantive field retains its stored value unless another
  submitted change makes the stored value inapplicable.
- Explicit numeric zero is a valid replacement value where authorized and
  is distinct from omission.
- The client does not use a generic substantive `clear` operation.
- Backend dependency rules clear values that become inapplicable, such as
  attendance-dependent state after full decline or dietary values after
  Reception is removed.
- Submitted operational confirmation fields replace the applicable stored
  confirmation method, destination, and authorization state.
- The backend merges submitted changes with stored state.
- The backend re-derives `overallAttendance` from the complete resulting
  named-invitee, Plus1, and grouped-child responses rather than preserving
  or trusting a client-writable headcount.
- The backend validates the complete merged response before saving it.
- The validated merged response becomes the new current version.
- The submission version increments without creating a duplicate current
  record.

The system must support clear and unambiguous revisions including:

- Changing between attendance and full decline.
- Changing Ceremony and Reception selections.
- Changing any authorized named-invitee Yes/No response.
- Changing any authorized Plus1 Yes/No response.
- Changing a grouped unnamed-children response between No and Yes.
- Changing the selected grouped unnamed-child attending count while it
  remains within `1..maximumCount`.
- Changing any age-category dial value, including replacing a positive
  value with zero.
- Replacing the complete `attendeeDetails` list when the identity
  composition or number of attending people changes.
- Replacing Reception-specific dietary/allergy information through the
  authorized attendee-detail structure.
- Changing the confirmation method or destination.

Dependency processing must enforce these rules:

- A full decline clears Ceremony and Reception selections as applicable,
  all `namedInviteeResponses`, all `additionalGuestResponses`, all
  age-category totals, derived `overallAttendance`, and the entire
  `attendeeDetails` list.
- A transition from full decline to an attending state makes every
  authorized named-invitee response and every authorized additional-guest
  response newly applicable. It requires complete age-category totals and
  a complete `attendeeDetails` list matching the newly derived party.
- Removing Reception while continuing to attend preserves applicable
  attendee-detail records and attendee names but clears stored
  dietary/allergy values.
- Adding Reception while the attending composition remains unchanged does
  not invalidate stored attendee names; dietary/allergy information becomes
  available but remains optional.
- A named-invitee Yes/No change or Plus1 Yes/No change that changes the
  attending composition requires complete `attendeeDetails` replacement,
  even when the numerical `overallAttendance` remains unchanged.
- Any grouped unnamed-child response/count change is an attendance-
  composition change because the identities represented by those unnamed
  attendee rows cannot safely be presumed unchanged; it therefore requires
  complete `attendeeDetails` replacement.
- Any change that produces a different `overallAttendance` requires a
  complete `attendeeDetails` list with exactly the new number of records.
- If attendance composition is unchanged and `attendeeDetails` is omitted
  in a revision, the stored attendee-detail list remains unchanged, subject
  to Reception-specific dietary clearing.
- The complete merged age-category totals must equal the newly derived
  `overallAttendance` exactly before storage.

The final merged response must remain internally consistent and must not
contain:

- Simultaneous attendance and full decline.
- Ceremony or Reception selections together with full decline.
- Missing named-invitee responses when they are newly applicable.
- A response for an unknown, duplicate, malformed, or cross-party
  named-invitee identifier.
- Missing responses for an applicable authorized additional-guest
  allocation when newly applicable.
- A response for an unknown, duplicate, malformed, or unauthorized
  additional-guest allocation.
- A Plus1 response other than `"yes"` or `"no"`.
- An unnamed-children response with an unsupported shape.
- `attending: "yes"` for grouped children with a count below 1, above
  `maximumCount`, fractional, or otherwise invalid.
- `attending: "no"` for grouped children with a count other than 0.
- A derived `overallAttendance` below one for an attending response or
  above `maximumAttendance`.
- Negative or fractional age-category totals.
- Age-category totals whose complete sum differs from derived
  `overallAttendance`.
- An `attendeeDetails` array whose length differs from derived
  `overallAttendance`.
- A missing attendee name or attendee name exceeding 100 characters.
- Dietary/allergy information exceeding 1000 characters.
- Dietary/allergy data when Reception is not selected.
- Attendance-dependent substantive data retained after full decline.
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

The permanent substantive RSVP question regions remain:

1. `eventAttendance`
2. `namedInviteeResponses`
3. `additionalGuestResponses`
4. `attendanceTotals`
5. `attendeeDetails`

The grouped unnamed-children behavior does not introduce a sixth
substantive region. It is an allocation variant rendered and submitted
through `additionalGuestResponses`.

### Coordinated Event-Attendance Control

The visible event-attendance interface uses one coordinated group containing:

- `Ceremony`
- `Reception`
- the invitation-specific singular/plural full-decline wording.

Ceremony and Reception may be selected independently or together.
Decline is mutually exclusive with both attending choices.

The event choice establishes which wedding events the attending members
of the party will attend. It does not by itself establish which people or
how many unnamed children are attending.

### Named-Invitee Attendance Decisions

For each object in `invitation.namedInvitees`, an attending RSVP must
render one explicit Yes/No question using the invitee's approved
guest-facing display name.

Named-invitee behavior must follow these rules:

- Each submitted response is keyed by the invitee's stable opaque id.
- Every authorized named invitee requires an explicit Yes/No response on
  an initial attending RSVP and when attendance becomes newly applicable.
- Ordinary revisions may omit an unchanged authorized response while
  attendance remains applicable.
- Unknown, duplicate, malformed, or cross-party invitee ids are rejected.
- A specifically named child uses this same mechanism.

### Authorized Additional-Guest Allocation Controls

`additionalGuestAllocations` contains authorization/control definitions,
not necessarily one allocation object per possible person.

Every public allocation object contains only the safe fields required for
rendering and validation:

- `id`
- `kind`
- `prompt`
- `maximumCount`

The browser must render each allocation according to its `kind`.

#### Named-Invitee `Plus1` Allocations

For each `kind: "plus1"` allocation:

- `maximumCount` must equal 1.
- Render one Yes/No question using the configured prompt:
  `Will [Named Invitee] be accompanied by a +1?`
- The canonical response value is `"yes"` or `"no"`.
- Yes contributes one person to derived `overallAttendance`; No
  contributes zero.
- The Plus1 person's own name is supplied later through ordinary
  `Attendee Details`.

#### Grouped Unnamed-Children Allocation

An invitation with positive reconciled unnamed-child capacity contains
exactly one `kind: "unnamedChildren"` allocation.

The visible family-level prompt is:

`We'd love for your family to celebrate with us this Mayday - will your kid(s) be accompanying you?`

The control must provide a toggleable Yes/No choice.

When No is selected:

- The child-count selector is not displayed or applicable.
- The canonical response is:
  `{ "attending": "no", "count": 0 }`
- The grouped allocation contributes zero people to
  `overallAttendance`.

When Yes is selected:

- A required child-count dropdown becomes visible.
- The options are the consecutive whole numbers from 1 through that
  allocation's `maximumCount`.
- The canonical response is:
  `{ "attending": "yes", "count": k }`
  where `k` is the selected authorized count.
- The validated count contributes directly to `overallAttendance`.

The form must not render one Yes/No question per unnamed child.

The grouped allocation exists only when the validated invitation
configuration authorizes it. The browser must not infer a grouped child
control from `maximumAttendance`, party wording, or any raw source concept.

A specifically named child remains a `namedInvitees` record and must not
also be represented by grouped unnamed-child capacity.

The actual names of the selected number of attending unnamed children are
supplied later through ordinary `Attendee Details`.

### Derived Total Attending Party

`maximumAttendance` remains the maximum possible size of the
invitation-code party. It must not be presented or treated as an
independently selectable actual-attendance value.

For an attending RSVP:

`overallAttendance = named-invitee Yes count + Plus1 Yes count + grouped unnamed-child attending count`

The validated invitation configuration must satisfy:

`namedInvitees.length + sum(additionalGuestAllocations.maximumCount) = maximumAttendance`

For an attending RSVP, `overallAttendance` must be at least 1 and may
never exceed `maximumAttendance`. For a full decline it is 0.

The guest-facing interface may display the derived value as `Total
Attending Party`, but the guest must not independently edit that number
apart from the underlying authorized responses.

### Attendance Totals by Age Category

For every attending RSVP, the form must display numerical dial controls
for:

- Adults, ages 21 and older.
- Young Adults, ages 18–20.
- Children, ages 3–17.
- Children under 3.

The four age-category controls classify the already-derived attending
party; they do not choose party size independently.

Each dial:

- Begins at zero on every blank form load.
- Accepts only nonnegative whole numbers.
- May increase only to the remaining unallocated portion of
  `overallAttendance` after accounting for the other three dials.

The complete four-category sum must equal derived `overallAttendance`
exactly, including all attending named invitees, attending Plus1s, and
every child represented by the grouped child attending count.

The browser enforces coordinated remaining-count behavior for usability.
The backend independently enforces the final equality invariant.

### Attendee Details

The repeated section is named `Attendee Details`, not `Reception Attendee
Details`.

Whenever `overallAttendance` is greater than zero, the form renders
exactly one `attendeeDetails` record per attending person for Ceremony
only, Reception only, or Ceremony plus Reception.

Every attendee-detail record contains:

1. Required `Attendee name`, maximum 100 characters.
2. When Reception is selected, `Dietary or allergy information`, maximum
   1000 characters and allowed to be blank.

The visible dietary/allergy label must not append `(optional)`.

The attendee-detail list includes every attending named invitee, Plus1,
and each individual child represented by a grouped unnamed-child count.

Ceremony-only attendance retains attendee names but must not display,
accept, or store dietary/allergy values. Removing Reception while
continuing to attend clears dietary values only.

If a revision changes the attending composition, the complete
`attendeeDetails` list must be replaced even when `overallAttendance`
remains numerically unchanged. Any grouped unnamed-child response/count
change is treated as a composition change.

### Closed Substantive Question Set

The production RSVP form must not add substantive questions outside the
approved spreadsheet-authoritative structure. It must not ask for:

- A separate Plus1-name field attached to the allocation question.
- A separate unnamed-child-name field attached to the grouped child
  question.
- A separate child-specific substantive response region.
- Accessibility details.
- Lodging plans.
- Transportation needs.
- A message to the couple.
- Entrée selections.
- Any other unapproved substantive guest-facing question.

Names for attending Plus1s and unnamed children are collected only through
ordinary `Attendee Details`.

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
- Every applicable authorized additional-guest response, including
  each Plus1 Yes/No decision and, for grouped unnamed children, the family
  Yes/No decision plus selected attending-child count when Yes.
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
attendance-composition responses, totals, and attendee details.

A text-message confirmation may use multiple message segments when
necessary to include the complete current RSVP.

### Administrative Confirmation

Every successful initial submission or revision must send an
administrative confirmation by email to the couple's configured address.

The administrative email must contain the complete current RSVP under the
spreadsheet-authoritative form model, including:

- The invitation or invited-party identifier needed by the couple.
- The private invitation-configuration context needed to interpret the
  response, including authorized named-invitee roster and
  additional-guest allocation context where applicable.
- Whether the action was an initial submission or revision.
- Ceremony and Reception selections or full-decline status.
- Every applicable named-invitee attendance Yes/No response.
- Every applicable authorized additional-guest response, including
  each Plus1 Yes/No decision and any grouped unnamed-child attending count.
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
- Display every applicable authorized additional-guest response,
  including any grouped unnamed-child attending count.
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
  attendance decisions, authorized additional-guest allocation responses
  (including Plus1 decisions and any grouped unnamed-child count), age-category totals,
  attendee names for every attending response, and dietary/allergy
  information when Reception is selected and supplied.
- What operational contact and delivery information is collected.
- That every form loads blank and does not display stored RSVP answers or
  stored confirmation destinations.
- How partial revisions are merged with existing responses.
- That omission, replacement, explicit zero, attendance-composition
  changes, and event-attendance or full-decline changes have distinct
  meanings; dependent data is cleared by backend rules when another change
  makes it inapplicable.
- That the actual attending count is derived from authorized named-invitee
  responses, Plus1 responses, and any grouped unnamed-child count rather
  than independently selected from the party maximum.
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
invitation data, named-invitee roster mappings, additional-guest
allocation mappings, attendee names, dietary/allergy information,
administrative
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
  authorized additional-guest allocation responses.
- Named-invitee roster or additional-guest allocation mappings.
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
additional-guest allocation mappings, attendee names, dietary or allergy
text,
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
  plural wording, its own limited named-invitee display roster, safe
  authorized additional-guest allocation controls, permitted party
  maximum, and reusable question structure associated with its invitation.
- Submit an initial RSVP.
- Revise its RSVP as many times as desired until Monday, March 1, 2027,
  at 11:59 p.m. EST.
- Submit only substantive fields that need to change during a revision
  after completing required confirmation-contact fields, except where a
  dependency requires a complete replacement structure.
- Use the coordinated Ceremony / Reception / full-decline controls.
- Answer one Yes/No attendance question for each authorized named invitee
  when the party is attending.
- Answer one Yes/No question for each authorized Plus1 allocation.
- When authorized for unnamed children, answer the single family-level
  child question and, after Yes, select the number attending from 1
  through the invitation's authorized `maximumCount`.
- See `Total Attending Party` derived from named-invitee Yes responses,
  Plus1 Yes responses, and any grouped child attending count rather than
  independently choosing a headcount.
- Enter the age composition of the derived attending party through four
  coordinated dials whose sum must equal the derived total exactly.
- Enter exactly one `Attendee Details` record with a required attendee
  name per attending person for Ceremony-only, Reception-only, or combined
  attendance.
- Supply the actual names of attending Plus1s and unnamed children through
  those attendee-detail rows.
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
- Maintain source-authorized Plus1 and grouped unnamed-children allocation
  mappings.
- Maintain each allocation's stable id, safe kind, reviewed prompt, and
  authorized `maximumCount`.
- Maintain `maximumAttendance` for each invitation and verify:

  `namedInvitees.length + sum(additionalGuestAllocations.maximumCount) = maximumAttendance`

- Maintain and activate the appropriate venue and schedule configuration.
- Maintain the public reception description without assigning fixed times
  to flexible or unconfirmed internal reception activities.
- Add a mimosa-station description only after the arrangement is confirmed
  with Sphinx Banquet and Catering Center.
- Review party-level RSVP responses.
- Receive an administrative email containing the complete current RSVP
  whenever a response is submitted or revised.
- Review Ceremony/Reception or full-decline status, every applicable
  named-invitee attendance response, each Plus1 response, and any grouped
  unnamed-child Yes/No plus attending count.
- Review all four age-category totals and derived `overallAttendance` for
  attending responses.
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
- Add finalized hotel-block information when available.
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
and security rules, the spreadsheet-authoritative RSVP source, the
September 20 person-level attendance clarification, the September 27
unnamed-child source clarification, the cleaned latest Invitees List, and
the grouped-children interaction when all of the following remain true:

- The private `Invitees List` spreadsheet and its bottom-row notes control
  the active production substantive RSVP model, subject to later approved
  clarifications recorded in governing project documents.
- The current production source contains 57 active assigned invitations
  with no required active production placeholder.
- All active production invitations use one reusable substantive form
  structure rather than separate production question profiles.
- Specifically named potential attendees are represented through
  `namedInvitees`.
- Each source `Plus1` creates one `kind: "plus1"` allocation with
  `maximumCount: 1`.
- An invitation with source-authorized unnamed children creates one
  `kind: "unnamedChildren"` grouped allocation whose `maximumCount`
  represents the complete reconciled unnamed-child capacity for that
  invitation.
- `Kids(n)` in the latest authoritative source occurs only for unnamed
  children and reconciles exactly to the grouped child capacity.
- The configuration-capacity invariant is
  `namedInvitees.length + sum(additionalGuestAllocations.maximumCount) = maximumAttendance`.
- The current source requires 84 specifically named potential attendees,
  26 Plus1 allocation objects, two grouped child allocation objects,
  five total unnamed-child slots, 28 total allocation objects, 31 total
  additional-guest person-capacity slots, and combined maximum capacity
  of 115.
- Ceremony, Reception, and singular/plural full decline remain one
  coordinated event-attendance interface.
- Every authorized named invitee receives one Yes/No attendance decision
  when the party is attending.
- Every Plus1 allocation receives one Yes/No decision.
- Each grouped unnamed-children allocation receives one family-level
  Yes/No decision; Yes reveals and requires one child-count selection from
  1 through `maximumCount`, while No records count 0.
- No separate child-specific substantive response region is introduced;
  both allocation variants use `additionalGuestResponses`.
- `maximumAttendance` remains party capacity rather than an independently
  selected actual-attendance value.
- `overallAttendance` is derived from named-invitee Yes responses, Plus1
  Yes responses, and any grouped unnamed-child attending count.
- The four coordinated age-category dials describe that derived attending
  party and sum to `overallAttendance` exactly.
- Every attending response contains exactly one `Attendee Details` record
  per derived attendee, including Ceremony-only attendance.
- Actual names for attending Plus1s and unnamed children are collected
  through `Attendee Details`, not allocation controls.
- `Dietary or allergy information` appears only when Reception is selected,
  may be left blank, and is not labeled `(optional)`.
- Removing Reception while continuing to attend preserves attendee names
  and clears only Reception-specific dietary/allergy values.
- A named-invitee change, Plus1 change, or grouped child response/count
  change that alters attendance composition requires complete
  `attendeeDetails` replacement.
- Every successful submission stores the complete resulting RSVP before
  delivery attempts begin.
- Guest and administrative confirmations include all applicable
  named-invitee, Plus1, and grouped child attendance/count information.
- Guest and administrative delivery attempts remain independent and their
  results remain separate from RSVP substantive/version data.
