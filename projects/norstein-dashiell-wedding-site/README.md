# Norstein-Dashiell Wedding Website

A custom full-stack wedding website for the Norstein-Dashiell wedding, built as a production web application rather than a template-based wedding page.

The site provides guests with current wedding information, themed presentation, venue and travel guidance, Day-Of details, media and story content, an invitation-specific RSVP workflow, optional background music, and privacy-minimized anonymous aggregate site analytics. The application is responsive, accessibility-conscious, privacy-conscious, and deployed on self-hosted Ubuntu infrastructure.

Production site:

```text
https://www.loreweavercreations.com/wedding/
```

Browser application base path:

```text
/wedding/
```

Backend API base path:

```text
/wedding/api/
```

## Project Status

**Invitation-launch production release is live. Workstreams 1–6 and the D14 production-readiness gate are complete. The confirmed wedding arrangement is permanently Sphinx-only. The public RSVP service is active, the production release has passed deployment and rollback verification, toggleable background music is implemented, and privacy-minimized anonymous aggregate site analytics are deployed.**

The final release sprint closed the remaining launch-critical work:

| Phase | Status | Result |
| --- | --- | --- |
| Workstream 1 — Application Foundation | Complete | React/Vite client, Express server, shared shell, design foundations, routing, configuration boundaries, and Ubuntu deployment proof |
| Workstream 2 — RSVP Backend and Data Layer | Complete | Private invitation lookup, validation, persistence, revisions, version history, idempotency, confirmation delivery, production synchronization, and recovery tooling |
| Workstream 3 — RSVP Frontend and Content Lock | Complete | Thirteen-state browser coverage, accessibility/responsive verification, guest-facing copy cleanup, privacy/bundle review, and reproducibility exit |
| Workstream 4 — Public Pages and Launch Assets | Complete | Sphinx-only public content, themed presentation, media, navigation, current links, Day-Of details, FAQ, Travel pending-state treatment, and Gallery Coming Soon |
| Workstream 5 — Integrated Release QA | Complete | Route, browser, API, accessibility, privacy, and production-build regression |
| D14 — Production Readiness | Complete | Read-only source/runtime/configuration/routing/workbook/backup/rollback review and GO decision |
| Workstream 6 — Production Cutover | Complete | Guarded Ubuntu deployment, HTTPS/public routing, service activation, smoke testing, and rollback verification |
| Post-release enhancement — Background Music | Complete | Accessible guest-controlled intro-to-loop background audio, off by default and nonessential |
| Post-release enhancement — Anonymous Analytics | Complete | First-party aggregate page metrics stored separately from RSVP data with privacy-minimized collection |

The current production deployment checkpoint is:

```text
d6f6d9919845d50058eee77a14997cb622039537
```

That checkpoint was deployed through the guarded release procedure and passed final post-release provenance, service, public-route, privacy-log, rollback-asset, and analytics-storage audits.

## Current Wedding Configuration

The active wedding presentation is permanently Sphinx-only.

**Wedding:** Saturday, May 1, 2027
**Ceremony:** 11:30 a.m.
**Event window:** 11:30 a.m.–4:30 p.m.
**Venue:** Sphinx Banquet and Catering Center
**Address:** 121 E 2nd Avenue, Roselle, NJ 07203
**Parking:** Municipal parking lot directly across the street

The earlier Warinanco Park ceremony configuration is discontinued. Historical references may remain in older planning records for traceability, but it is not an active contingency or future launch option.

## Implemented Public Experience

The production application includes:

* Home
* RSVP
* RSVP Confirmation
* Theme & Attire
* Our Story
* Read, Listen & Watch
* Venue
* Travel
* Day-Of Details
* FAQ
* Gallery — intentional pre-wedding Coming Soon state
* Wedding Website Privacy
* Wedding-specific Not Found handling

The canonical browser routes are:

```text
/wedding/
/wedding/rsvp
/wedding/rsvp/confirmation
/wedding/theme
/wedding/story
/wedding/read-listen-watch
/wedding/venue
/wedding/travel
/wedding/day-of
/wedding/faq
/wedding/gallery
/wedding/privacy
/wedding/not-found
```

Legacy planning references to `/wedding/schedule-menu` are superseded by the final `/wedding/day-of` route.

Unknown `/wedding/*` destinations remain inside the wedding application and render the wedding-specific Not Found experience.

## Core Technology

### Front End

* React
* Vite
* JavaScript
* HTML
* CSS
* React Router
* Responsive web design
* Web Audio API for guest-controlled background music

### Back End

* Node.js
* Express
* Environment-based configuration
* Server-side authorization and validation
* Security middleware
* Rate limiting
* Google Sheets persistence
* Resend email delivery
* First-party aggregate analytics endpoint

### Production Infrastructure

* Ubuntu Server
* `systemd` service management
* Self-hosted production client
* Reverse-proxy / Cloudflare Tunnel routing
* HTTPS
* Git-based Windows-to-Ubuntu release workflow
* Protected production environment files
* Timestamped backup and rollback procedure

## Project Structure

The application is maintained as one portable project root with separate client, server, and documentation responsibilities.

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
│   │   ├── analytics/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── rsvp/
│   │   ├── services/
│   │   └── validation/
│   └── tests/
│
├── docs/
├── .gitignore
├── .gitattributes
├── package.json
├── package-lock.json
└── README.md
```

The root package coordinates the client and server workspaces while each retains its own package responsibilities.

## Local Setup and Verification

From a checkout of the monorepo, open a terminal in:

```text
projects/norstein-dashiell-wedding-site
```

Install dependencies and run the standard verification sequence:

```powershell
npm ci
npm run lint:client
npm run test:client
npm run test:server
npm run build:client
```

For local development only, copy:

```text
client/.env.example -> client/.env
server/.env.example -> server/.env
```

The example files contain configuration names, not production values.

Never commit real `.env` contents, production invitation data, invitation codes, guest records, Google credentials, email credentials, spreadsheet identifiers that are intended to remain protected, or other production secrets.

Use fictional development fixtures for ordinary development and testing.

Start the development backend and client in separate terminals:

```powershell
npm run dev:server
npm run dev:client
```

Vite serves the application beneath `/wedding/` and proxies `/wedding/api/` to the local Express development server.

Local development commands do not authorize production-data mutation or production-maintenance operations.

## Shared Site Shell and Accessibility

Public routes share a reusable application shell containing:

* Skip-to-content navigation
* Sticky site header
* Desktop navigation
* Accessible mobile navigation
* Prominent RSVP access
* Background-music control
* Shared main-content structure
* Shared footer
* Back-to-top behavior where applicable
* Consistent heading, spacing, and readable-width rules

Accessibility and responsive behavior are implementation requirements rather than late-stage enhancements.

The released site includes keyboard-operable navigation and forms, visible focus treatment, semantic headings, accessible form labels and legends, text-based status communication, narrow-screen form behavior, touch-appropriate controls, reduced-motion support, accessible mobile-menu state, and meaning that does not depend solely on color.

Guest-critical flows were verified at representative phone, tablet/intermediate, laptop, and desktop widths during the final release sprint.

## Design and Presentation

The site uses a centralized visual system and shared styling rather than unrelated page-specific themes.

The production presentation includes:

* Licensed project typography
* Shared design tokens
* Reusable controls and status treatments
* Responsive cards and content sections
* Decorative header, footer, and page-background artwork
* Sphinx-only event presentation
* Howl's Moving Castle-inspired visual and editorial direction
* Theme & Attire inspiration and guest color-palette imagery
* Proposal imagery/video on Our Story
* Book and film presentation on Read, Listen & Watch
* Responsive wedding-owned and rights-reviewed launch assets

Decorative behavior remains subordinate to navigation, RSVP completion, readable content, accessibility, and performance.

## Toggleable Background Music

Background music was originally optional/deferred in the launch plan but was implemented after the required release gates were green.

The feature is intentionally nonessential.

Current behavior:

* Music is **Off by default**.
* The guest must explicitly enable music from the header control; the site does not attempt audible autoplay on initial load.
* The control exposes an accessible on/off state and is keyboard- and touch-operable.
* Enabling music starts the approved introductory segment and then transitions to the looping segment.
* Disabling music stops playback and resets the sequence.
* The music provider survives in-application route changes, so playback can continue while navigating the wedding site.
* The enabled state is not persisted across a full reload; a new page session begins with music off.
* Foreground audiovisual content suppresses the background-music level while foreground audio is active and allows it to return afterward.
* Failure to load, decode, or play audio does not affect navigation, RSVP, content access, or other website functionality.
* Browser autoplay restrictions are respected rather than bypassed.

The browser-delivery assets are based on the wedding-owned source material:

```text
IntroMerry Go Round.mp3
LoopMerry Go Round.mp3
```

Background audio must remain a progressive enhancement. No wedding-site feature depends on it.

## RSVP System

The RSVP system is invitation-specific but uses one reusable guest-facing form and one protected backend contract.

Guests manually enter the six-character invitation code printed with their invitation at:

```text
/wedding/rsvp
```

Invitation codes are sent in request bodies rather than embedded in personalized URLs.

### Lookup Boundary

A valid lookup returns only the safe configuration required to build a blank authorized form, such as:

* Party display information
* Singular/plural wording mode
* Maximum authorized attendance
* Safe `namedInvitees`
* Safe typed `additionalGuestAllocations`
* Reusable form-schema metadata
* Fixed email confirmation availability

Lookup does not return previously stored RSVP answers, prior confirmation destinations, response history, private source rows, protected record classification, or another party's information.

Re-entering an invitation code therefore opens another blank authorized form rather than exposing a stored RSVP for editing.

### Attendance Model

The current RSVP contract supports:

* Explicit Yes/No decisions for each authorized named invitee
* Zero or more one-person `plus1` allocations
* At most one grouped `unnamedChildren` allocation where authorized
* A bounded grouped-child count when that family-level allocation is attending
* Backend-derived `overallAttendance`
* Four age categories whose total must equal derived attendance
* One `attendeeDetails` record per attendee
* Reception-only optional dietary/allergy information
* Initial submissions
* Partial revisions
* Composition-sensitive attendee-detail replacement
* Explicit zero values where applicable
* Dependency-driven clearing
* Idempotent retry and duplicate-submission protection
* Current-response storage and immutable version history
* Confirmation refresh fallback
* Backend-authoritative deadline enforcement

The browser mirrors attendance calculations for usability, but the backend remains authoritative.

### Email-Only Confirmation

Decision 029 permanently changed the new guest-confirmation flow to email-only.

Each initial online RSVP and revision requires a newly entered valid email address. New submissions do not expose SMS selection or mobile-number capture.

After successful storage:

1. The guest confirmation email is attempted.
2. The protected administrative confirmation email is attempted independently.
3. Delivery status is recorded separately from RSVP state.
4. A delivery problem does not invalidate an otherwise stored RSVP.

Legacy SMS-related data or recovery handling may remain protected for historical compatibility, but it does not authorize new text messages and is not a future enablement path.

### Production Invitation Source

The private production source currently contains 68 numbered source rows:

* 63 assigned guest-list invitations
* 4 reserved invitation-code placeholders
* 1 permanent production Test Sample

The functional registry therefore contains 64 production invitation configurations: 63 guest-list-eligible invitations plus the Test Sample.

Current source-level capacity is:

```text
Real guest-list maximum attendance: 122
Permanent Test Sample maximum:       4
Combined functional maximum:        126
```

The original assigned invites 1–57 remain a separately auditable historical baseline. Later assignment of a reserved invitation must use the guarded production synchronization procedure.

Real invitation codes, guest identities, source-to-party mappings, and protected workbook content remain outside the public client and public repository documentation.

### Guarded Production Synchronization

The production Invitations sheet is a derived private registry rather than an immutable one-time seed.

A later source synchronization may add a newly populated reserved invitation, but any invitation already referenced by operational RSVP history is protected against ordinary mutation or removal.

Operational history includes:

```text
Current RSVPs
RSVP Versions
Submission Records
Delivery Records
Resend Records
```

The production synchronization path performs source audit, schema/access verification, compatibility checks, protected pre-write snapshotting, invitation replacement, unchanged-operational-data verification, exact post-write registry verification, and rollback handling.

The permanent Test Sample exists specifically for controlled production verification without using a real guest invitation.

## Anonymous Aggregate Site Analytics

The production site does **not** use standard Google Analytics / GA4.

Instead, the project uses a first-party aggregate analytics endpoint designed specifically around the approved data-minimization requirement.

Browser endpoint:

```text
POST /wedding/api/analytics
```

Production storage uses a dedicated Google Sheets workbook separate from the private RSVP workbook.

The production worksheet is:

```text
Site Analytics
```

Only these aggregate columns are stored:

```text
Page Path
Page Views
Anonymous Visitors
Engagement Milliseconds
Average Engagement Seconds
```

### Analytics Privacy Boundary

The analytics implementation intentionally stores only:

* Fixed allowlisted page paths
* Aggregate page-view counts
* Aggregate anonymous-browser/visitor counts
* Aggregate engagement duration

It does not intentionally store analytics event records, names, invitation codes, RSVP answers, attendee information, dietary/allergy information, email addresses, mobile numbers, confirmation destinations, submission identifiers, RSVP configuration, allocation details, IP addresses, geographic location, referrers, browser/device profiles, screen resolution, advertising identifiers, query strings, or URL fragments.

Infrastructure necessarily handles ordinary network metadata in transit, but that metadata is not retained in the analytics workbook.

"Anonymous Visitors" means anonymous browser instances rather than identified people. The browser keeps a local seen-page marker so a page can distinguish a first visit from a later reload without transmitting a persistent browser identifier. Clearing local browser state or using another browser/session can therefore count as another anonymous visitor.

Analytics requests use a strict fixed-path allowlist and reject query strings and fragments.

Analytics failures are swallowed on the client and must never block page rendering or RSVP functionality.

### Nonessential Analytics Configuration

RSVP storage and analytics storage use separate configuration:

```text
GOOGLE_SPREADSHEET_ID
SITE_ANALYTICS_SPREADSHEET_ID
```

`GOOGLE_SPREADSHEET_ID` is the protected RSVP workbook.

`SITE_ANALYTICS_SPREADSHEET_ID` is the dedicated aggregate analytics workbook.

The analytics workbook ID is optional at the production application-schema boundary. If analytics is not configured or becomes unavailable, the RSVP backend remains able to start and operate.

The analytics worksheet initializer separately requires an explicit production acknowledgement before initialization.

The public Privacy page documents the aggregate analytics behavior and its exclusions.

## Development and Production Separation

Ordinary development and automated tests use fictional RSVP fixtures.

Production invitation records are not used as development data.

The private production invitation source, production workbook, production analytics workbook, credentials, administrative destinations, and protected operational evidence remain backend-only.

The source-controlled application must remain reproducible without production secrets.

## Environment Configuration

Development and production configuration are deliberately separated.

Example client configuration includes:

```text
VITE_API_BASE_PATH=/wedding/api
```

Server configuration includes responsibilities such as:

```text
NODE_ENV
HOST
PORT
SITE_BASE_PATH
GOOGLE_SPREADSHEET_ID
SITE_ANALYTICS_SPREADSHEET_ID
GOOGLE_APPLICATION_CREDENTIALS
RSVP_DEADLINE
RSVP_TIME_ZONE
RSVP_ADMIN_NOTIFICATION_EMAIL
EMAIL_PROVIDER
RESEND_API_KEY
RSVP_FROM_NAME
RSVP_FROM_EMAIL
RSVP_REPLY_TO_EMAIL
RSVP_WRITER_INSTANCE_COUNT
RSVP_SINGLE_WRITER_LOCK_FILE
RSVP_SMS_ENABLED
ALLOWED_ORIGIN
TRUST_PROXY
```

Tracked `.env.example` files document configuration names without containing live values.

Production credentials and private values are stored outside the repository.

## Security and Privacy

Privacy and data-boundary requirements are part of the core architecture.

The public repository and browser bundle must not contain:

* Production invitation spreadsheets
* Real invitation codes
* Permanent Test Sample code
* Guest identities
* RSVP responses or version history
* Attendee names
* Dietary/allergy responses
* Private invitation/allocation mappings
* Protected administrative destinations
* Google credentials
* Email credentials
* Protected environment files
* Private analytics workbook identifiers where operational policy requires protection
* Production diagnostic evidence containing sensitive values

The application uses backend authorization and validation, rate limits, cache controls, guest-safe errors, origin restrictions, protected credentials, and private production data boundaries.

Analytics follows a separate aggregate-only privacy boundary and is intentionally excluded from detailed application request auditing.

## Git and Source-Control Boundaries

The project is maintained inside the broader `Full-Stack-Portfolio` repository at:

```text
projects/norstein-dashiell-wedding-site/
```

Git excludes dependencies, production build output, logs, local environment files, credentials, private working materials, protected evidence, and production wedding data where appropriate.

Before release-related commits, review the staged filenames and staged diff and run:

```powershell
git diff --cached --check
```

Do not use broad staging commands when private working materials may exist nearby.

## Windows-to-Ubuntu Release Workflow

Primary development occurs on Windows; production runs on Ubuntu.

The release flow is:

```text
Windows development
        ↓
review + automated verification
        ↓
Git commit
        ↓
GitHub main
        ↓
exact-commit Ubuntu release candidate
        ↓
production build / preflight
        ↓
timestamped backend + frontend backups
        ↓
staged backend + frontend copies
        ↓
guarded cutover
        ↓
systemd health verification
        ↓
local + public route/API smoke checks
        ↓
rollback retained until stabilization
```

Windows `node_modules` directories are never transferred to Ubuntu.

The production backend runs under the dedicated `wedding-rsvp.service` systemd service and binds to the protected local backend listener. Public traffic reaches the wedding application through the configured production reverse-proxy/tunnel path.

The deployment procedure preserves protected environment configuration outside the deployed source tree.

## Production Verification

The final launch and post-release analytics checkpoints verified:

* Client ESLint — PASS
* Client tests — **40/40 PASS**
* Server tests — **327/327 PASS**
* Vite production build — PASS
* Backend JavaScript syntax checks — PASS
* Required analytics/privacy release files — PASS
* Exact release-candidate provenance — PASS
* Live backend matched the exact release candidate — PASS
* Live frontend matched the exact release build — PASS
* Local and public backend health — PASS
* Public Home, RSVP, Privacy, and other release routes — PASS
* Public analytics endpoint routing — PASS
* Background-music browser behavior — PASS
* Anonymous analytics browser behavior — PASS
* Analytics failure isolation from website/RSVP — PASS
* Analytics workbook aggregate-only privacy audit — PASS
* Analytics request-detail absence from relevant application/tunnel journals — PASS
* Zero post-deploy application error lines in the final audit window — PASS
* Timestamped production rollback assets retained — PASS

The analytics post-release audit confirmed one dedicated `Site Analytics` worksheet, the approved five-column schema only, allowlisted paths only, no query/hash data, aggregate numeric metrics only, and no duplicate per-page rows.

## Deferred or Changed Scope

The final release intentionally does not attempt to complete every historical planning idea.

Current deferred or superseded scope includes:

* **Advanced gallery/post-wedding media:** The Gallery remains a deliberate pre-wedding Coming Soon page. Full post-wedding galleries, guest uploads, download packages, archive workflows, and generalized media-library/Nextcloud integration remain deferred.
* **Hotel block details:** The Travel route is complete as a page, but property-specific hotel information remains externally dependent until finalized. No rate, booking code, deadline, shuttle, or accessibility claim should be invented.
* **SMS confirmation:** Superseded by Decision 029. New RSVP confirmation is email-only; SMS is not a pending launch feature or future guest-facing activation path.
* **Warinanco configuration:** Discontinued. The active wedding presentation is permanently Sphinx-only.
* **Portfolio polish:** Additional screenshots, architecture diagrams, demo-guide refinement, and optional CI improvements remain separate portfolio/maintenance work rather than wedding-site launch requirements.
* **Broad external-link expansion:** The production site uses a limited useful set of reviewed resources rather than an exhaustive shopping/streaming directory.
* **Nonessential architecture/refactoring work:** Broad refactors and dependency upgrades are handled separately from release-critical wedding functionality.
* **Dependency maintenance:** The final production preflight surfaced npm audit advisories that should be reviewed in a separate controlled maintenance task rather than addressed through forced release-time upgrades.

Background music was originally in the optional/deferred category but was subsequently implemented and verified without reopening or weakening any launch gate.

Anonymous aggregate analytics was added after the original workstream scope and completed as a separate privacy-minimized production enhancement.

## Documentation

The `docs/` directory contains the project's engineering and planning references, including:

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
* RSVP example configuration/schema material
* RSVP test cases
* Visual design system
* Development/deployment plans
* Final release sprint planning and handoff records

Historical plans are retained for traceability, but current source code, verified Git history, current specifications, and explicitly approved later decisions supersede obsolete chronology or requirements.

The project moved from a documentation-heavy sequential planning model to an implementation-focused model in which documentation is maintained when it directly supports implementation, testing, deployment, operation, recovery, or a substantive changed decision.

## Portfolio Focus

This project demonstrates practical work involving:

* Full-stack web development
* React application architecture
* Node.js/Express backend development
* Client/server separation
* REST-style API design
* Responsive interface development
* Accessible interaction design
* Design-system implementation
* Complex form and state architecture
* Server-side authorization and validation
* Google Sheets persistence
* Idempotent and versioned data mutation
* Transaction/recovery-oriented production tooling
* Email-delivery integration
* Privacy engineering and data minimization
* First-party aggregate analytics design
* Web Audio / progressive enhancement
* Environment and credential boundaries
* Git-based release management
* Cross-platform Windows/Linux development
* Ubuntu/systemd production operation
* Reverse-proxy and tunnel architecture
* Backup and rollback design
* Requirements-driven software development
* Technical documentation
* Iterative project management

The project demonstrates progression from requirements and systems planning through implementation, protected production-data integration, release-candidate validation, controlled public deployment, and post-release verification.

## Development and AI-Assistance Disclosure

This project is developed and maintained by Joshua Norstein.

AI-assisted tools may be used as development aids for planning, research, proofreading documentation, troubleshooting, syntax/error checking, architecture review, code review, implementation support, testing support, and release-procedure review.

Final project decisions, source integration, testing, repository management, production operations, and maintenance remain the developer's responsibility.

Third-party and open-source libraries, frameworks, packages, tools, templates, assets, and external material remain the work of their respective authors and are used in accordance with applicable licenses and attribution requirements.

## Author

**Joshua Norstein**

This project is maintained as part of the `Full-Stack-Portfolio` repository.
