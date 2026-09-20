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

**Active development — Workstream 2 RSVP backend implementation underway**

Workstream 1 is complete. It established the client/server structure, shared application shell, canonical routing, centralized wedding and event configuration, reusable design-system foundations, relative client/API boundary, initial launch-oriented content, and an Ubuntu deployment proof.

The current application includes a navigable React application beneath `/wedding/`, a Node.js/Express API foundation beneath `/wedding/api/`, dedicated Home, RSVP, Our Story, Privacy, confirmation, and Not Found experiences where appropriate for the present development stage, and structural placeholders for public pages scheduled for later implementation.

Workstream 2 is now converting the finalized RSVP architecture into backend code. The implementation already includes centralized server environment validation, reusable invitation-code normalization, and development-only invitation fixture support. The governing RSVP documentation and development fixture definitions have been reconciled to the current spreadsheet-authoritative invitation model before lookup, submission, persistence, delivery, and production-data transformation proceed.

The complete lookup/submission lifecycle, durable RSVP storage, Google Sheets integration, confirmation delivery, and full guest-facing RSVP workflow are not yet complete and must not be inferred from the existing backend foundation.

## Core Technology

The planned application architecture uses:

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

The project is organized around the following client, server, and documentation structure. Some feature-specific subdirectories will be added as later workstreams require them:

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

The canonical browser routes are planned beneath `/wedding/`:

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

The application supports two planned event configurations:

### Configuration A

Ceremony at Warinanco Park with reception at Sphinx.

### Configuration B

Ceremony and reception at Sphinx.

Only one configuration will be active for guest-facing presentation at a time.

Pages that depend upon venue or schedule configuration consume the same centralized configuration so that changing the active event arrangement does not require manually editing multiple pages.

## RSVP System

The RSVP system is the primary focus of the current backend workstream. Its governing architecture is already specified; implementation is proceeding against fictional development data before protected production invitation data is introduced.

### Access and lookup model

Guests use the shared route:

```text
/wedding/rsvp/
```

and manually enter the six-character invitation code printed with their invitation. Invitation codes are submitted to the backend in request bodies rather than embedded in personalized browser URLs.

A successful lookup returns only the limited invitation configuration required to construct a **blank** authorized form. It does not return previously stored RSVP answers, prior confirmation destinations, response history, or another party's information.

### Spreadsheet-authoritative production configuration

The current private source contains **57 active assigned production invitation records**. Real invitation codes, guest identities, and source-to-party mappings remain outside the public client and public documentation.

Each production configuration is derived privately from the authoritative source and includes only the values needed by the backend, such as:

* Reviewed party/form heading
* Explicit singular or plural wording mode
* Maximum permitted attendance
* Zero or more authorized named `Plus1` allocations
* Active/environment state

Production RSVP behavior no longer uses separate substantive question profiles or a generic aggregate additional-guest allowance.

### Reusable substantive RSVP structure

Every production invitation uses the same reusable substantive form structure, with invitation-specific variation supplied only by authorized configuration.

The form supports:

* Ceremony attendance
* Reception attendance
* Mutually exclusive singular/plural decline wording
* Zero or more named-invitee Plus 1 Yes/No questions
* Four numerical attendance-category dials
* Reception-only attendee details
* Operational confirmation fields

A Plus 1 question appears **only** when the private invitation configuration contains a corresponding `Plus1` authorization. Each authorized allocation produces one independent question such as:

```text
Will [Named Invitee] be accompanied by a +1?
```

An invitation with no authorized `Plus1` allocation receives no Plus 1 question and cannot submit an authorized Plus 1 response. Multiple allocations remain separate Yes/No questions rather than becoming a numeric guest-count control.

The four attendance categories are:

* Adults, ages 21 and older
* Young Adults, ages 18–20
* Children, ages 3–17
* Children under 3

Their combined value represents the complete attending party and must remain between 1 and the invitation's authorized maximum whenever the party is attending.

When Reception is selected, the form requires exactly one attendee-detail record per member of the attending party. Each record contains:

* Attendee name — required, maximum 100 characters
* Food allergies or dietary preferences — optional, maximum 1000 characters

Ceremony-only attendance does not collect Reception attendee-detail records. Removing Reception clears those records, and a full decline clears all attendance-dependent Plus 1 responses, attendance totals, and Reception attendee details.

### Submission and revision model

The architecture supports:

* Server-side authorization and validation
* Initial responses
* Blank-form partial revisions
* Omitted-field-means-unchanged semantics
* Explicit replacement, explicit zero, and explicit clear behavior
* Dependency clearing
* Idempotent submissions and safe retries
* Current-response storage and version history
* Backend-authoritative deadline enforcement
* Guest confirmation
* Protected administrative confirmation
* Independent delivery-warning handling
* Confirmation-page refresh fallback

Operational confirmation information is entered again for every initial submission and revision. Email is the required baseline channel. Text Message remains disabled in production until its separate provider/disclosure/authorization/testing gate is satisfied.

The RSVP interface is designed around clearly defined application states rather than assuming that every request succeeds immediately.

Production invitation records are not used during ordinary development. Development and automated tests use fictional fixtures so that backend work can proceed without exposing real invitation codes or guest identities.

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
* Guest identities and RSVP data
* Reception attendee names and dietary/allergy responses
* Private Plus 1 allocation mappings
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

## Current RSVP Backend Workstream

Workstream 2 builds the RSVP backend and private data layer on top of the completed foundation.

Implemented or established at the current stage:

* Centralized environment parsing and validation
* Development/production configuration separation
* Reusable invitation-code normalization and display formatting
* Fictional development invitation fixtures
* Automated tests for the implemented backend foundations
* Spreadsheet-authoritative RSVP architecture and development fixture definitions
* Public/private source-control boundaries for invitation data

The next implementation stages add the private invitation service, lookup endpoint, submission validation and revision merge logic, persistence, idempotency, deadline/rate-limit/cache behavior, production transformation, confirmation delivery, and the associated automated tests.

The current production source is treated as private backend input. It is not copied into the React client, committed to public source control, or used as ordinary development test data.

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
