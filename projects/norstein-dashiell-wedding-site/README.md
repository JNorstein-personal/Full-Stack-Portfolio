# Norstein-Dashiell Wedding Website

A custom full-stack wedding website being developed for the Norstein-Dashiell wedding.

The project is being built as a production web application rather than a template-based wedding page. It is intended to provide guests with wedding information, event configuration, travel and venue information, schedule details, themed presentation, and a personalized RSVP system while remaining responsive, accessible, privacy-conscious, and deployable on self-hosted infrastructure.

The application is designed to operate beneath:

```text
/wedding/
```

with its backend API available beneath:

```text
/wedding/api/
```

## Project Status

**Active development — Workstream 2 complete and verified; Workstream 3 and production backend deployment in progress. The confirmed wedding arrangement is Sphinx-only (Configuration B).**

Workstream 1 is complete. It established the client/server structure, shared application shell, canonical routing, centralized wedding and event configuration, reusable design-system foundations, relative client/API boundary, initial launch-oriented content, and an Ubuntu deployment proof.

Workstream 2 is complete and verified across private invitation lookup, blank-form construction, server-side validation, initial submission and revision handling, persistence, version history, idempotent retry behavior, confirmation delivery, production invitation transformation, and production activation/readiness tooling. Workstream 3 continues the guest-facing React interaction, accessibility, responsive behavior, and first-round content lock.

During September 2026, the RSVP architecture was resynchronized around explicit person-level attendance and the clarified treatment of unnamed children. The governing documentation, fictional development fixtures, backend lookup and submission boundaries, confirmation output, private production transformation, production activation coverage, client state model, RSVP form, and confirmation page now use the same corrected contract.

During October 2026, the private production invitation source model was extended so that the source can safely contain currently assigned invitations, reserved future invitation codes, and one permanent production Test Sample without treating all numbered source rows as guest-list records. Production synchronization tooling was correspondingly updated so later reserved invitations can become real invitations even after RSVP activity has begun, while preserving any invitation configuration already referenced by operational RSVP history.

The current RSVP model uses:

* A safe invitation-specific `namedInvitees` roster.
* Explicit Yes/No attendance decisions for every authorized named invitee.
* Typed `additionalGuestAllocations`.
* One-person `plus1` allocations.
* At most one grouped `unnamedChildren` allocation when applicable.
* A conditional grouped-child count bounded by the invitation's authorized `maximumCount`.
* Backend-derived `overallAttendance`.
* Four age-category totals whose sum must equal derived attendance.
* `attendeeDetails` for every attending person, including Ceremony-only attendees.
* Reception-specific optional dietary/allergy information.
* Blank-form partial revision semantics.
* Composition-sensitive attendee-detail replacement.
* Email confirmation as the production baseline.

The corrected RSVP contract and production invitation synchronization have been verified. At the October 8 handoff, the validated project checkpoint had **320 passing server tests**, **29 passing client tests**, successful client linting and production build, and successful protected production-source/runtime checks. The October 8 media rename was verified byte-for-byte, but a post-rename frontend asset-reference/build check is still required before release.

### Ubuntu production backend checkpoint (October 10, 2026)

* The dedicated non-login `wedding-rsvp` Linux service identity is established; the installed backend source is root-controlled and separate from the existing Loreweaver website runtime.
* The installed production backend in `/opt/loreweaver/wedding-rsvp` uses the verified **290db6c** source revision. Production Node.js dependencies were installed and validated in **Checkpoint D3** (110 packages).
* Keycloak authentication, Google Workload Identity Federation, Google token acquisition and renewal, and read-only production workbook metadata access passed their isolated preflight tests.
* The later **a56e646** Git checkpoint renamed 13 unchanged media assets; it did not replace the deployed backend installation.
* **Checkpoint D4A is next:** securely create and validate `/etc/loreweaver/wedding-rsvp/production-base.env`. Protected secrets, bounded proxy trust, systemd startup, live API routing, and production delivery checks remain pending.
* **The backend is not running as a production service.** No systemd unit or public `/wedding/api/` reverse-proxy route has been activated by this deployment sequence.
* Production invitation records and existing RSVP history must not be reloaded, printed, exported, or modified merely to verify deployment.

Workstream 3 still requires an audit and completion of remaining deadline, accessibility, responsive, browser-journey, and Content Lock Round 1 checks. The authoritative RSVP behavior and protected production data model remain unchanged.

## Core Technology

The application architecture uses:

### Front End

* React
* Vite
* JavaScript
* HTML
* CSS
* React Router
* Responsive web design

### Back End

* Node.js
* Express
* Environment-based configuration
* Server-side validation
* Security middleware
* Rate limiting

### Deployment

* Ubuntu Server
* Git-based Windows-to-Ubuntu deployment workflow
* Production client build
* Reverse-proxy routing
* HTTPS in the production deployment
* Self-hosted infrastructure

## Project Structure

The application is maintained as one portable project root with separate client, server, and documentation responsibilities.

The project is organized around the following client, server, and documentation structure:

```text
norstein-dashiell-wedding-site/
│
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── data/
│       ├── styles/
│       └── utils/
│
├── server/
│   ├── scripts/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── rsvp/
│   │   ├── services/
│   │   └── validation/
│   ├── secrets/
│   └── tests/
│
├── docs/
├── .gitignore
├── .gitattributes
├── package.json
├── package-lock.json
└── README.md
```

The root package is intended to coordinate the client and server while allowing each to retain its own package responsibilities.

## Public Application Routes

The canonical browser routes are beneath `/wedding/`:

```text
/wedding/
/wedding/rsvp/
/wedding/rsvp/confirmation
/wedding/theme
/wedding/story
/wedding/read-listen-watch
/wedding/venues
/wedding/travel
/wedding/schedule
/wedding/faq
/wedding/gallery
/wedding/privacy
/wedding/not-found
```

Unknown `/wedding/*` destinations are intended to remain inside the wedding application and render a wedding-specific Not Found experience.

## Shared Site Shell

Public application routes use a common application shell containing:

* Skip-to-content navigation
* Shared page container
* Sticky site header
* Desktop navigation
* Accessible mobile navigation
* Prominent RSVP access
* Shared main-content structure
* Footer
* Consistent heading and layout system

The application is designed so that essential functionality does not depend on hover behavior.

## Responsive and Accessible Design

Accessibility and responsive behavior are treated as implementation requirements rather than late-stage enhancements.

Planned accessibility features include:

* Keyboard-accessible navigation
* Skip-to-content support
* Visible `:focus-visible` treatment
* Semantic headings
* Accessible form labels and legends
* Text-based status communication
* Responsive single-column form behavior on narrow screens
* Touch-appropriate interactive controls
* Reduced-motion support
* Meaning that does not depend solely on color
* Accessible mobile menu state
* Avoidance of keyboard traps

Representative layouts will be tested across phone, tablet, laptop, and desktop widths.

## Design System

The application uses a centralized design system rather than page-specific visual styling.

Shared style responsibilities include:

* Typography roles
* Type scale
* Semantic colors
* Spacing
* Readable content widths
* Control geometry
* Focus indicators
* Buttons
* Links
* Form controls
* Status messages
* Cards
* Decorative surfaces
* Responsive foundations
* Reduced-motion behavior

Shared design tokens are intended to allow changes to typography, spacing, colors, and other reusable values without individually modifying page components.

## Shared Components

Reusable component families establish common interaction patterns, including:

* Primary and secondary buttons
* Status messages
* Content cards
* External links
* Form controls
* Page containers
* Content sections
* Header and navigation
* Skip link
* Footer

The goal is to establish one consistent interaction and design language across the site rather than allowing individual pages to develop unrelated component behavior.

## Centralized Wedding Configuration

Guest-facing wedding information is centralized where practical rather than duplicated across React page components.

Centralized application data includes information such as:

* Wedding date
* General location
* RSVP deadline
* RSVP assistance information
* Navigation labels
* Reusable guest-facing labels
* Gift-policy content
* Venue and schedule configuration

**Confirmed arrangement — Configuration B (Sphinx-only).** The ceremony and reception take place at Sphinx Banquet and Catering Center on May 1, 2027, from **11:30 a.m. to 4:30 p.m.** The public website must select Configuration B.

Historical Configuration A (Warinanco Park ceremony followed by Sphinx reception) is **discontinued as of October 10, 2026** and retained only as a reference to the earlier contingency. No further Warinanco-specific planning, implementation, or launch verification is required.

Venue and schedule components continue to consume the centralized event configuration so that the confirmed arrangement is presented consistently across public pages.

## RSVP System

The RSVP system is the primary feature of Workstream 2. Its governing architecture is specified in the project documentation and is implemented against fictional development data before protected production invitation data is activated.

### Access and lookup model

Guests use the shared route:

```text
/wedding/rsvp/
```

and manually enter the six-character invitation code printed with their invitation.

Invitation codes are submitted to the backend in request bodies rather than embedded in personalized browser URLs.

A successful lookup returns only the limited safe configuration required to construct a **blank** authorized form.

Depending on the invitation, that safe response may include:

* Party display information.
* Singular or plural wording mode.
* Maximum authorized attendance capacity.
* A safe `namedInvitees` roster.
* Zero or more safe `additionalGuestAllocations`.
* Reusable form-schema metadata.
* Available confirmation methods.

Lookup does **not** return:

* Previously stored RSVP answers.
* Prior confirmation destinations.
* Response history.
* Internal party identifiers.
* Private source-spreadsheet rows or notes.
* Another invited party's information.
* Private production record classification such as `recordRole` or `guestListEligible`.

Entering the same invitation code again therefore produces another blank authorized form rather than displaying a stored RSVP for editing.

### Spreadsheet-authoritative production configuration

The private production source currently contains **68 numbered invitation-code rows**. Those rows are intentionally not all equivalent guest-list records.

The current source model is:

* **Invites 1–63** — assigned real guest-list invitations.
* **Invites 64–67** — four reserved invitation-code placeholders, not functional RSVP identities.
* **Invite 68** — the permanent production **Test Sample** identity used for safe production verification.

Invites 1–57 remain the independently audited historical baseline; invites 58–63 are now assigned, rather than reserved.

Real invitation codes, guest identities, and source-to-party mappings remain outside the public client and public repository documentation.

Reserved rows retain unique invitation codes in the private source but do not become stored production invitation configurations until their invitation-defining fields are populated. A partially populated or ambiguous reserved row fails closed rather than being inferred as either a valid invitation or a harmless placeholder.

The permanent Test Sample is a fully functional production invitation. It follows the same lookup, blank-form, submission, revision, persistence, version-history, idempotency, confirmation, and operational-storage contracts as an ordinary invitation. Its distinguishing private classification is:

```text
recordRole = test
guestListEligible = false
```

Assigned real invitations use:

```text
recordRole = assigned
guestListEligible = true
```

These classification values are backend/private configuration metadata. They are not part of the guest-facing lookup response.

Each functional production invitation configuration is derived privately from the authoritative source and includes the values required by the RSVP backend, including:

* Reviewed party/form heading.
* Explicit singular or plural wording mode.
* `maximumAttendance`.
* A safe `namedInvitees` roster containing stable opaque IDs and approved display names.
* Zero or more typed `additionalGuestAllocations`.
* Private record classification.
* Active/environment state.

The safe public shape of an additional-guest allocation is:

```js
{
  id,
  kind,
  prompt,
  maximumCount
}
```

Supported allocation kinds are:

```text
plus1
unnamedChildren
```

A `plus1` allocation:

* Represents exactly one potential additional attendee.
* Always has `maximumCount: 1`.
* Uses one invitation-specific Yes/No response.

An `unnamedChildren` allocation:

* Represents the complete authorized capacity for children whose individual names were not known at invitation time.
* Appears at most once on an invitation.
* Uses one family-level Yes/No response.
* Reveals one count selector when Yes is chosen.
* Allows only whole-number counts from `1` through that allocation's `maximumCount`.
* Uses count `0` when the response is No.

Specifically named children remain ordinary members of `namedInvitees`; they are not duplicated in grouped unnamed-child capacity.

Every valid functional invitation configuration must satisfy:

```text
namedInvitees.length
+ sum(additionalGuestAllocations.maximumCount)
= maximumAttendance
```

The number of allocation objects is **not** treated as person capacity.

#### Current production-source audit

The current private-source transformation audit reconciles to these source-level totals:

* 68 numbered source rows.
* 68 unique source invitation codes.
* Valid numbered sequence through Invite 68.
* 4 reserved placeholders (Invites 64–67).
* 64 functional production invitation configurations:
  * 63 guest-list-eligible assigned invitations.
  * 1 permanent Test Sample.
* 126 functional combined maximum attendance:
  * 122 current real guest-list maximum attendance.
  * 4 Test Sample maximum attendance.

For the established assigned guest list represented by invites 1–57, the stable baseline audit remains:

* 57 assigned guest-list invitations.
* 35 singular-wording invitations.
* 22 plural-wording invitations.
* 84 specifically named potential attendees.
* 26 Plus 1 allocation objects.
* 2 grouped unnamed-child allocation objects.
* 28 total allocation objects.
* 31 total additional-person capacity slots.
* 5 grouped unnamed-child capacity slots.
* 115 combined maximum attendance.

The **115-person figure is the historical baseline for invites 1–57**, not the current guest-list total. Invites 58–63 were subsequently assigned, bringing current real guest-list capacity to **122**. If any reserved invite 64–67 is later assigned, the transformation and protected synchronization procedure can increase the current totals without changing the original 1–57 baseline audit.

Production transformation and activation code validate the corrected person-capacity model rather than the superseded one-allocation-equals-one-person assumption.

### Production invitation synchronization and safety

The production Invitations sheet is a derived private registry rather than an immutable one-time seed.

A later source synchronization may add a newly populated reserved invitation after guests have already begun submitting RSVPs. Production tooling therefore does **not** require the operational RSVP tables to remain permanently empty.

Before any invitation replacement occurs, the current workbook snapshot is compared with the source-derived expected registry.

Every party referenced by operational RSVP data must satisfy all of the following:

* Its existing invitation configuration still exists.
* The new expected source-derived registry still contains the same party.
* The invitation code remains unchanged.
* The complete private invitation configuration remains unchanged.

Operational history includes references from:

* Current RSVPs.
* RSVP Versions.
* Submission Records.
* Delivery Records.
* Resend Records.

An invitation that has operational history is therefore immutable through the ordinary synchronization path. A synchronization that would change or remove such an invitation fails before the production invitation write begins.

An invitation with no operational history may still be corrected or removed through the guarded synchronization path. Newly assigned invitations may be added.

The production synchronization sequence is:

1. Load and audit the private source.
2. Verify production environment and Google Sheets schema/access.
3. Read a complete private workbook snapshot.
4. Verify source-derived invitation compatibility with all operationally referenced parties.
5. Write the private pre-load snapshot to the protected backup directory.
6. Replace the Invitations sheet with the complete expected functional production registry.
7. Read a post-write snapshot.
8. Verify every operational RSVP section is unchanged.
9. Verify the stored Invitations sheet exactly matches the source-derived expected registry.
10. If a post-backup activation step fails, attempt to restore the prior Invitations sheet from the snapshot.

The synchronization process intentionally changes only the invitation registry. It does not clear or rewrite RSVP history.

### Production readiness, activation verification, and audit

Production readiness verification confirms:

* `NODE_ENV=production`.
* The private source can be loaded.
* Source transformation and audit targets pass.
* Google Sheets access is available.
* The RSVP workbook schema is valid.
* The proposed source-derived invitation registry is compatible with all existing operational RSVP history.

Readiness does **not** require operational RSVP tables to be empty.

Post-load activation verification confirms:

* The production source still passes its transformation audit.
* The stored Invitations sheet exactly matches all current functional production configurations.
* Any existing operational RSVP history remains compatible with the invitation configurations it references.

The transformation audit reports source, functional, guest-list, reserved, Test Sample, and baseline metrics separately so that the current guest list is not conflated with all numbered source rows.

### Permanent Test Sample production smoke path

Production loopback smoke testing uses the permanent Test Sample rather than a real guest invitation.

The smoke command still requires explicit operator acknowledgement and an explicitly supplied invitation code, but the script independently loads the authoritative source and refuses to continue unless the supplied code canonicalizes to the one permanent production configuration classified as:

```text
recordRole = test
guestListEligible = false
```

Before exercising the production API, the smoke script also verifies that the Test Sample stored in Google Sheets exactly matches its authoritative source-derived configuration.

The smoke test then performs read-only production checks including:

* Health endpoint success.
* Valid RSVP lookup.
* Expected no-store response behavior.
* Expected guest-facing lookup boundary.
* Expected Test Sample capacity, named-invitee, and allocation configuration.
* No changes to operational RSVP storage.

The real Test Sample invitation code remains private and is not written into repository documentation or test fixtures.

### Reusable substantive RSVP structure

Every invitation uses the same five substantive RSVP regions:

1. `eventAttendance`
2. `namedInviteeResponses`
3. `additionalGuestResponses`
4. `attendanceTotals`
5. `attendeeDetails`

Operational confirmation fields remain separate from substantive RSVP answers.

### Event attendance

The complete attendance state is one of:

```text
Ceremony
Reception
Ceremony + Reception
Decline
```

Ceremony and Reception may be selected together.

Decline is mutually exclusive with both attending choices.

A full decline produces zero attendance and clears attendance-dependent substantive data.

### Named invitee attendance

Whenever the party is attending, each authorized object in `namedInvitees` receives an explicit Yes/No attendance decision.

Responses are keyed by stable opaque invitee IDs. Display names are presentation-only and are not authorization keys.

Mixed household attendance is permitted. Specifically named children use this same named-invitee mechanism.

On an initial attending RSVP, every authorized named invitee requires an explicit response.

On an ordinary revision that remains attending, an omitted named-invitee response may remain unchanged when no controlling dependency requires replacement.

### Additional guest attendance

Additional-guest controls appear only when the validated invitation contains corresponding authorization.

A Plus 1 response is scalar:

```js
"yes"
```

or:

```js
"no"
```

A grouped unnamed-child Yes response is:

```js
{
  attending: "yes",
  count: 2
}
```

A grouped unnamed-child No response is:

```js
{
  attending: "no",
  count: 0
}
```

The approved grouped-child guest-facing question is:

```text
We'd love for your family to celebrate with us this Mayday - will your kid(s) be accompanying you?
```

If Yes is selected, the browser displays one required count selector containing the consecutive whole numbers from `1` through the allocation's authorized `maximumCount`.

The grouped control is rendered once for the family allocation, not once per unnamed child.

Child names are not collected in this control. Like Plus 1 names, they are entered later through ordinary `Attendee Details`.

No generic client-selected “How many additional guests?” field exists.

### Derived overall attendance

Guests do not directly submit `overallAttendance`.

The authoritative backend derives it as:

```text
number of named invitees answered Yes
+ number of Plus 1 allocations answered Yes
+ grouped unnamed-child attending count
= overallAttendance
```

The browser mirrors this calculation for usability, but server-side validation remains authoritative.

An attending RSVP requires at least one actual attendee.

A full decline has derived attendance of zero.

### Attendance totals

The four age categories are:

* Adults, ages 21 and older.
* Young Adults, ages 18–20.
* Children, ages 3–17.
* Children under 3.

These controls classify the already-derived attending party.

They do not independently choose party size.

Each value must be a nonnegative whole number and the complete sum must equal `overallAttendance` exactly.

The browser coordinates the controls against the derived attending count, while the backend independently validates the final result.

### Attendee Details

Whenever at least one person is attending, the RSVP contains exactly one `attendeeDetails` record per attendee.

This includes:

* Named invitees who are attending.
* Attending Plus 1 guests.
* Every child represented by the grouped unnamed-child attending count.
* Ceremony-only attendees.
* Reception-only attendees.
* Attendees participating in both events.

Every attendee row contains:

* `attendeeName` — required, maximum 100 characters.

When Reception is selected, the row may additionally contain:

* `dietaryPreferences` — optional, maximum 1000 characters.

The visible field label is:

```text
Dietary or allergy information
```

Dietary/allergy information is not applicable to Ceremony-only attendance and is omitted or cleared when Reception is not selected.

### Composition-sensitive revisions

The revision model is intentionally stricter than a simple numerical-headcount patch.

A change to who is attending may require complete `attendeeDetails` replacement even if the total number of attendees remains the same.

Composition-sensitive changes include:

* Named-invitee Yes/No changes that change who attends.
* Plus 1 Yes/No changes that change who attends.
* Any grouped unnamed-child response or count change.

Grouped-child response/count changes are always treated as composition-sensitive because the identities represented by previously unnamed child rows cannot safely be assumed unchanged.

When composition changes, a complete replacement `attendeeDetails` list is required.

If Reception is removed while Ceremony attendance remains and composition is otherwise unchanged:

* `attendeeDetails` and `attendeeName` values are preserved.
* Reception-specific `dietaryPreferences` values are removed.

If Reception is added while attending-person composition remains unchanged, existing attendee names may remain unchanged and dietary/allergy fields simply become available.

### Submission and revision model

The architecture supports:

* Server-side authorization and validation.
* Initial responses.
* Blank-form partial revisions.
* Omitted-field-means-unchanged semantics where dependencies permit omission.
* Explicit replacement values.
* Explicit zero values for nested attendance totals.
* Dependency-driven clearing.
* Composition-sensitive attendee-detail replacement.
* Idempotent submissions and safe retries.
* Current-response storage and version history.
* Backend-authoritative deadline enforcement.
* Guest confirmation.
* Protected administrative confirmation.
* Independent delivery-warning handling.
* Confirmation-page refresh fallback.

A revision may submit `changes: {}` when the guest intends only to replace the operational confirmation destination.

The browser does not submit an authoritative `overallAttendance` and does not send an `expectedVersion` concurrency field. The backend determines and validates the complete resulting RSVP.

Operational confirmation information is entered again for every initial submission and revision.

Email is the required baseline channel. Text Message remains disabled in production until its separate provider/disclosure/authorization/testing gate is satisfied.

### Confirmation behavior

A successful confirmation presents the complete current guest-facing RSVP rather than only the fields included in the latest request.

Applicable confirmation content includes:

* Event attendance.
* Named-invitee Yes/No responses.
* Plus 1 Yes/No responses.
* Grouped unnamed-child Yes/No response and selected attending count when applicable.
* Age-category totals.
* Derived `overallAttendance`.
* `Attendee Details`.
* Dietary/allergy information only when Reception is selected.
* Submission type and recorded timestamp.
* Guest delivery status.
* Administrative delivery-attempt status without exposing the protected administrative destination.

The email and on-screen confirmation render grouped children as one family-level response. When children are attending, they also report the selected child count. They do not invent synthetic per-child authorization responses.

### Development and production separation

Production invitation records are not used during ordinary development.

Development and automated tests use fictional fixtures so backend and client work can proceed without exposing real invitation codes or guest identities.

The private production source remains backend-only input and is excluded from public source-control and client bundles.

The permanent production Test Sample is the deliberate exception to the ordinary real-guest production population: it exists specifically so protected production verification can exercise a valid RSVP identity without requiring a real guest's invitation code. Its code and private configuration remain protected production data.

Before production launch, the reconciled production transformation, synchronization/readiness checks, activation verification, runtime verification, and Test Sample smoke test must all be rerun against the final protected environment.

## Client/API Boundary

Browser API access is designed around the relative base path:

```text
/wedding/api
```

Client components should not contain hard-coded backend hostnames such as:

```text
http://localhost:...
```

During development, Vite will proxy requests under `/wedding/api/` to the local Express application.

This preserves the same browser-facing API path between development and deployment environments.

## Environment Configuration

Development and production configuration are deliberately separated.

Example client configuration includes:

```text
VITE_API_BASE_PATH=/wedding/api
```

Server configuration is expected to include values for responsibilities such as:

* Application environment
* Server port
* Site base path
* Google integration
* RSVP deadline
* Time zone
* Administrative notifications
* Email provider
* SMS provider
* Allowed origin
* Reverse-proxy behavior

Actual secrets are not stored in tracked environment files.

## Security and Privacy

The website handles information that may include guest identities and RSVP responses, so privacy boundaries are a core architectural requirement.

The repository is intended to exclude:

* Production invitation spreadsheets
* Real invitation codes
* The permanent production Test Sample code
* Guest identities and RSVP data
* Attendee names and, when Reception is selected, dietary/allergy responses
* Private additional-guest allocation mappings, including Plus 1 and grouped-child authorization
* Google service-account credentials
* Email credentials
* SMS credentials
* Administrative destinations
* Local `.env` files
* Protected server-secret files
* Private working materials

Public React code must not contain server-side secrets or private production invitation information.

Development uses fictional or otherwise non-production configuration until production data is intentionally introduced through protected backend mechanisms.

## Git and Source-Control Boundaries

The project is maintained within the broader `Full-Stack-Portfolio` Git repository.

This project directory is:

```text
projects/norstein-dashiell-wedding-site/
```

Git excludes dependencies, production builds, logs, local environment files, credentials, private working materials, and production wedding data where appropriate.

The project is intended to remain reproducible from committed source files, dependency manifests, example environment configuration, and documented deployment requirements.

## Windows-to-Ubuntu Workflow

Primary application development may occur on Windows, while the production environment is Ubuntu.

The intended workflow is:

```text
Windows development
        ↓
Git commit
        ↓
GitHub repository
        ↓
Clone / pull on Ubuntu
        ↓
Install dependencies
        ↓
Build client
        ↓
Run Express application
        ↓
Serve /wedding/
        ↓
Proxy /wedding/api/
```

Dependencies are installed independently on Ubuntu from committed manifests.

Windows `node_modules` directories are not transferred to the server.

The project includes an early deployment proof specifically so that path handling, nested-route refresh behavior, API proxying, and Linux portability can be validated before the application becomes significantly more complex.

## Deployment Requirements

The deployment architecture must eventually demonstrate that:

```text
/wedding/
```

serves the React application and:

```text
/wedding/api/
```

reaches the Express backend.

Direct navigation to nested routes such as:

```text
/wedding/theme
```

must continue to work after a browser refresh rather than returning a server-level 404.

The final production configuration will include additional security, deployment, backup, and operational requirements beyond the early architecture proof.

## Documentation

The `docs/` directory contains the project's engineering and planning materials.

These include documentation concerning:

* Requirements
* Architectural decisions
* Content inventory
* Link inventory
* Sitemap
* Route inventory
* Page outlines
* Wireframes
* RSVP system design
* RSVP API contract
* RSVP configuration examples
* RSVP form-schema examples
* RSVP test cases
* Visual design system
* Development and deployment planning
* Current accelerated workstream planning

The project originally used a documentation-heavy sequential planning process.

That approach has since been replaced by an accelerated implementation model in which existing specifications remain authoritative while new documentation is created primarily when it directly supports implementation, testing, deployment, operation, or a substantive changed decision.

## Completed Application Foundation Workstream

The first implementation workstream established the durable application foundation required for later feature development.

Completed foundation work includes:

* React/Vite client foundation
* Node.js/Express server foundation
* Portable client/server project structure
* Git and privacy boundaries
* Development/production configuration boundaries
* Design tokens and global CSS
* Licensed typography setup
* Shared controls
* Shared navigation and layout shell
* Canonical browser routes
* Centralized site content
* Centralized Configuration A/B data
* Development design-system calibration
* Relative client/API boundary
* Production client build
* Ubuntu deployment proof
* Initial launch-oriented content
* Dedicated Our Story and RSVP Privacy page foundations
* Reproducible README documentation

The application foundation has been exercised as a navigable application, its production client build has been validated, and its intended `/wedding/` and `/wedding/api/` deployment architecture has been proven on the Ubuntu deployment environment.

## Completed RSVP Backend Workstream

Workstream 2 completed the RSVP backend, private data layer, confirmation pipeline, and guarded production invitation activation tooling on top of the application foundation. The corrected September attendance contract and October production-source extension are verified. Guest-facing interface completion is managed in Workstream 3.

Verified source and behavior include:

* Centralized environment parsing and validation remain implemented.
* Development/production configuration separation remains established.
* Invitation-code normalization and display formatting remain implemented.
* Governing RSVP documentation is synchronized to the grouped-child/person-level attendance model and is being updated to the extended production-source model.
* Fictional development invitation configuration uses safe `namedInvitees` and typed `additionalGuestAllocations`.
* Development fixtures validate allocation `kind`, `maximumCount`, opaque identifiers, uniqueness, development-only boundaries, and exact person-capacity reconciliation.
* Lookup exposes only safe allocation fields: `id`, `kind`, `prompt`, and `maximumCount`.
* Private production classification fields such as `recordRole` and `guestListEligible` remain outside the guest-facing lookup boundary.
* Submission validation accepts scalar Plus 1 responses and structured grouped-child responses in the same `additionalGuestResponses` map.
* Backend attendance derivation counts named-invitee Yes responses, Plus 1 Yes responses, and grouped-child selected count.
* Age-category totals must reconcile exactly to derived `overallAttendance`.
* `attendeeDetails` applies to every attendee, including Ceremony-only attendance.
* Dietary/allergy information is limited to Reception attendance.
* Grouped-child response/count changes are composition-sensitive and require complete attendee-detail replacement.
* RSVP submission success responses preserve safe allocation metadata and structured grouped-child response data.
* Guest and administrative confirmation emails render grouped-child Yes/No and child count safely.
* The production transformation parses `Kids(n)` as one grouped `unnamedChildren` allocation while preserving specifically named children as ordinary named invitees.
* The current production source has 68 numbered rows: 63 assigned guest-list invitations, 4 reserved placeholders, and one permanent Test Sample.
* The functional registry contains 64 invitations: 63 guest-list-eligible identities and one permanent test identity.
* The original invites 1–57 baseline remains independently auditable: 84 named potential attendees plus 31 additional-person slots, totaling 115 maximum attendees.
* Current real guest-list maximum attendance is 122; the Test Sample maximum is 4, yielding combined functional capacity 126.
* Future population of reserved invites 64–67 must follow the guarded, history-compatible invitation synchronization procedure.
* Production activation compatibility protects any invitation already referenced by Current RSVPs, RSVP Versions, Submission Records, Delivery Records, or Resend Records.
* Operational RSVP tables no longer need to remain empty for later invitation synchronization.
* The production loader creates a private pre-write snapshot, replaces only invitation configurations, proves operational data is unchanged, verifies an exact source-to-workbook match, and attempts invitation rollback on post-backup failure.
* Production readiness verifies synchronization compatibility before any write.
* Post-load activation verification requires both exact invitation-registry matching and continued operational-history compatibility.
* Production audit output distinguishes source rows, functional invitations, guest-list invitations, reserved placeholders, the Test Sample, and the stable 1–57 baseline.
* Production loopback smoke testing is restricted to the permanent Test Sample rather than a real guest invitation.
* Production activation tests distinguish allocation-object count from person capacity and include grouped-child and operational-compatibility coverage.
* The client RSVP model supports named invitee responses, mixed allocation response shapes, derived headcount, all-attendance attendee details, and Reception-only dietary fields.
* The guest RSVP form renders one grouped child family question with a conditional `1..maximumCount` selector.
* The confirmation page renders named invitees, Plus 1 responses, grouped-child response/count, party totals, and all-attendance attendee details.
* Public/private source-control boundaries continue to protect production invitation data and credentials.

Workstream 2's protected invitation synchronization, production runtime verification, and Permanent Test Sample smoke checks were previously completed. The Ubuntu deployment is a distinct, unfinished operational task. Before public release, rerun applicable tests against the final working tree and verify the running backend without modifying real invitations.

Remaining launch and deployment checks include:

* Complete server automated test suite.
* Complete client automated test suite.
* Client linting.
* Production client build.
* Production invitation transformation audit.
* Production readiness verification.
* Read-only production runtime readiness verification.
* Authorized Permanent Test Sample smoke testing after the Ubuntu backend is configured.
* Reverse-proxy, systemd, startup/restart, writer-lock, and production confirmation-delivery verification.

Do not rerun the protected production invitation loader or change production guest records as part of routine deployment verification.

The current production source remains private backend input. It is not copied into the React client, committed to public source control, or used as ordinary development test data.

## Development Priorities

Under schedule pressure, the project prioritizes:

1. Correct architecture and contract fidelity
2. Git, credential, and private-data safety
3. Server-side RSVP authorization and validation
4. Reliable storage, revision, and idempotency behavior
5. Confirmation and delivery correctness
6. Accessible form, status, and focus behavior
7. Centralized configuration
8. Reproducible production builds
9. Proven Ubuntu deployment behavior

Decorative refinement remains secondary to producing a reliable, accessible, secure, privacy-conscious, and reproducible production application.

## Portfolio Focus

This project is intended to demonstrate practical work involving:

* Full-stack web development
* React application architecture
* Node.js/Express backend development
* Client/server separation
* REST-style API architecture
* Responsive interface development
* Accessible interaction design
* Design-system implementation
* Form architecture
* Application state design
* Data privacy boundaries
* Environment configuration
* Git-based development workflow
* Cross-platform Windows/Linux development
* Self-hosted deployment
* Reverse-proxy architecture
* Requirements-driven software development
* Technical documentation
* Iterative project management

The project is particularly intended to demonstrate the progression from extensive requirements and system planning into a maintainable production application.

## Development and AI-Assistance Disclosure

This project is developed and maintained by Joshua Norstein. AI-assisted tools may be used as development aids for tasks such as planning, research, proofreading documentation, troubleshooting, syntax and error checking, architecture review, code review, and implementation support. Final project decisions, integration, testing, repository management, and maintenance remain the developer's responsibility.

Third-party and open-source libraries, frameworks, packages, tools, templates, assets, and other external material remain the work of their respective authors and are used in accordance with their applicable licenses and attribution requirements. Material adapted from an external source should be identified and attributed where its license or terms require it.

## Author

**Joshua Norstein**

This project is maintained as part of the `Full-Stack-Portfolio` repository.
