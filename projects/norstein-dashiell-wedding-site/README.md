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

**Active development — Workstream 1 application foundation complete**

The project has completed its initial application-foundation workstream, establishing the client/server structure, shared application shell, canonical routing, centralized wedding and event configuration, reusable design-system foundations, relative client/API boundary, initial launch-oriented content, and an Ubuntu deployment proof.

The current implementation includes a navigable React application beneath `/wedding/`, a Node.js/Express API foundation beneath `/wedding/api/`, dedicated Home, RSVP, Our Story, Privacy, confirmation, and Not Found experiences where appropriate for the present development stage, and structural placeholders for public pages scheduled for later implementation.

The complete RSVP backend and guest-facing RSVP workflow are extensively specified but are not yet fully implemented. Subsequent workstreams will build those capabilities on top of the completed application foundation.

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

The RSVP system is a major component of the overall project, but its complete implementation occurs after the initial application foundation.

The architecture is intended to support:

* Invitation-code lookup
* Personalized RSVP forms
* Server-side validation
* Initial responses
* Response revisions
* Conditional questions
* Additional-guest handling
* Attendance and dietary logic
* Idempotent submissions
* Version history
* Current-response storage
* Deadline enforcement
* Confirmation workflow
* Guest confirmation
* Administrative notification
* Delivery-warning handling
* Safe retry behavior
* Confirmation-page refresh handling

The RSVP interface is designed around clearly defined application states rather than assuming that every request succeeds immediately.

Production invitation records are not used during ordinary development.

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

Later workstreams will build the complete RSVP backend and guest workflow, remaining public-site content, production deployment, and subsequent operational features on this foundation.

## Development Priorities

Under schedule pressure, the project prioritizes:

1. Correct architecture
2. Git and privacy safety
3. Route structure
4. Shared application shell
5. Design-system foundations
6. Form, status, and focus behavior
7. Centralized configuration
8. Successful production build
9. Ubuntu deployment proof

Decorative refinement is intentionally secondary to producing a reliable, accessible, secure, and reproducible application foundation.

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

AI-assisted tools may be used during project planning, research, documentation, architecture review, debugging, code review, and implementation support.

## Author

**Joshua Norstein**

This project is maintained as part of the `Full-Stack-Portfolio` repository.
