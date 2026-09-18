# Full-Stack Portfolio

Portfolio repository for software development, full-stack web development, systems administration, networking, infrastructure, and related technical projects developed by **Joshua Norstein**.

I am completing a B.S. in Science, Mathematics & Technology with a concentration in Computer Science at SUNY Empire State University (Prospective graduation date: 12/11/2026). This repository is intended to document representative academic, personal, production-oriented, and independently developed work while demonstrating both finished implementations and ongoing engineering projects.

The projects represented here span:

* full-stack web development;
* React and component-based frontend development;
* Node.js/Express backend development;
* REST-style API design;
* responsive and accessible interface development;
* C# and Godot application/game development;
* Linux systems administration;
* Docker/Podman containerization;
* networking and cybersecurity;
* identity and access management;
* self-hosted infrastructure;
* data integration;
* testing, validation, and debugging;
* technical documentation;
* Git/GitHub development workflows.

---

## Portfolio Repository Status

This repository is an actively maintained portfolio of my software development, systems, and infrastructure work.

Several projects represented on my résumé began as local academic, personal, or production projects before I adopted a more consistent Git/GitHub workflow and began reorganizing my work into this portfolio. The underlying projects therefore exist locally in varying stages of development, while preparation of their public repository versions is an ongoing process.

As a result, projects listed on my résumé may exist locally in a more advanced state than the version currently committed here, and some projects may not yet have been fully migrated into this repository.

Preparing a project for portfolio publication may include:

* reviewing and organizing its existing source and documentation;
* removing private, production, or environment-specific information;
* establishing an appropriate repository structure;
* creating or revising project documentation;
* adding `.gitignore` and environment boundaries;
* reviewing credentials, secrets, generated files, and user data;
* preserving useful development history where practical;
* committing representative project materials according to current Git and security practices.

Repository status should therefore not be interpreted as a complete inventory of all locally developed work.

For the clearest examples of my current work, begin with the projects under **Recommended Starting Points** below. I update that section as additional projects are prepared and brought up to date.

---

## Recommended Starting Points

### [Norstein-Dashiell Wedding Website](projects/norstein-dashiell-wedding-site/)

A custom full-stack production web application being developed using **React, Vite, React Router, Node.js, and Express**.

The project demonstrates full-stack application architecture, responsive and accessible component development, REST-style API design, personalized RSVP workflows, server-side validation, Google Sheets integration, automated email workflows, testing, privacy/security boundaries, environment configuration, and deployment to self-hosted Ubuntu infrastructure.

This is currently one of the most active application-development projects in the portfolio.

### [Self-Hosted Linux Infrastructure, Networking & Homelab Administration](projects/homelab-infrastructure/)

An operational self-hosted Linux environment designed, deployed, secured, and administered as an ongoing infrastructure project.

The project demonstrates practical work with **Ubuntu Linux, OpenWrt, Docker, Docker Compose, Podman, PostgreSQL, Nextcloud, Keycloak, OIDC/SSO, Tailscale, Cloudflare Tunnel/Access, UniFi, CUPS, networking, firewalls, storage, backup/recovery, monitoring, and identity/access management**.

Unlike a demonstration-only lab, this environment supports active services and users, so infrastructure changes are developed using inspection, rollback planning, controlled implementation, testing, persistence verification, and documentation.

### [Focus Window Reader Aid — Firefox Add-on](projects/small-projects-and-utilities/Focus-Window-Reader-Aid/0.4.0/)

A lightweight assistive Firefox add-on that provides an adjustable visual focus overlay for webpages to support reading, visual tracking, concentration, and reduction of surrounding visual distraction.

The project demonstrates browser-extension development, JavaScript, CSS, DOM interaction, extension state management, accessibility-oriented UI design, per-tab persistence across webpage navigation, regression testing, release preparation, and Mozilla Add-ons packaging.

The current portfolio version is **0.4.0**.

---

## Projects

### Full-Stack and Web Application Development

#### [Norstein-Dashiell Wedding Website](projects/norstein-dashiell-wedding-site/)

**Status:** Active development

Custom full-stack wedding application developed as a production web project rather than a template-based event page.

Primary areas of work include:

* React/Vite frontend architecture;
* React Router application routing;
* Node.js/Express backend services;
* REST-style API design;
* personalized invitation and RSVP workflows;
* Google Sheets-backed administrative data;
* automated email workflows;
* server-side validation and error handling;
* idempotent and revision-capable submissions;
* responsive and accessible interface development;
* privacy and production-data separation;
* Git-based Windows-to-Ubuntu deployment;
* self-hosted production infrastructure.

See the project README and documentation for current implementation details.

---

#### Loreweaver Creations Full-Stack Web Platform

**Status:** Early development

Public-facing web platform for Loreweaver Creations and its publishing and creative services.

The project is intended to grow beyond a static company website into a maintainable application supporting structured content, catalog-oriented information, interactive features, and integration with other Loreweaver-hosted services.

Current and planned areas include:

* React;
* Vite;
* Node.js;
* JavaScript;
* HTML/CSS;
* responsive and accessible interface development;
* reusable component architecture;
* structured content and catalog management;
* self-hosted deployment;
* integration with other Loreweaver services.

Repository migration and organization of existing local project materials remain in progress, but current priority is on the completion and launch of Norstein-Dashiell Wedding Website; once this is concluded, more focus can be shifted to this project.

---

#### Lor-E — Self-Hosted RAG-Enabled Personal AI Assistant

**Status:** Early development — conceptual work transitioning into architectural planning

Lor-E is a planned local-first personal AI assistant intended to combine local language-model inference, Retrieval-Augmented Generation, persistent project knowledge, semantic retrieval, and conversational context.

The project is being developed as the Fall 2026 term project for **CSCI 4005 — Software Engineering**, with a functional prototype targeted for completion by the end of the semester.

Current work focuses on requirements and architecture, including:

* Retrieval-Augmented Generation;
* document ingestion;
* chunking and embeddings;
* semantic search;
* vector storage;
* persistent project knowledge;
* source-grounded responses;
* modular model/retrieval components;
* local inference;
* browser-based interaction;
* self-hosted deployment architecture.

Implementation has not yet reached the coding stage, and repository publication will follow as the architecture and prototype develop.

---

#### [H/exicon ONLINE](projects/hexicon/)

**Status:** In development

Turn-based asynchronous online multiplayer digital board game being developed using **C# and Godot 4**.

The project demonstrates:

* object-oriented application architecture;
* procedural board generation;
* game-state and rules systems;
* UI development;
* multiplayer-oriented design;
* maintainable and extensible gameplay systems;
* cross-platform planning for Windows/Steam and Android;
* integration with self-hosted Linux services.

The current development effort is being reorganized from earlier experimental work into a cleaner portfolio-oriented implementation.

---

### Systems, Networking, and Infrastructure

#### [Self-Hosted Linux Infrastructure, Networking & Homelab Administration](projects/homelab-infrastructure/)

**Status:** Operational and under active development

Self-hosted Linux infrastructure used for real services rather than as a demonstration-only environment.

Major areas include:

* Ubuntu Linux administration;
* Docker and Docker Compose;
* Podman;
* OpenWrt routing and firewalling;
* UniFi wireless infrastructure;
* DHCP and DNS;
* IPv4/IPv6 networking;
* Tailscale remote administration;
* Cloudflare Tunnel and Cloudflare Access;
* Keycloak and OpenID Connect;
* Nextcloud;
* PostgreSQL;
* service monitoring;
* Linux filesystem administration;
* ext4 storage;
* backup and recovery;
* printing/scanning infrastructure;
* service hardening;
* troubleshooting and change control.

See the project README for current architecture, deployment history, security practices, recovery methodology, and active workstreams.

---

### Small Projects and Utilities

This area contains smaller applications, utilities, experiments, assistive tools, and focused technical projects that do not require the scope of the primary portfolio projects.

#### [Focus Window Reader Aid](projects/small-projects-and-utilities/Focus-Window-Reader-Aid/0.4.0/)

**Platform:** Firefox
**Current portfolio version:** 0.4.0

Assistive browser add-on providing an adjustable focus-window overlay intended to support reading and visual tracking while reducing surrounding visual distraction.

Representative skills and practices include:

* Firefox WebExtension development;
* JavaScript;
* CSS;
* DOM manipulation;
* browser/tab state management;
* persistence across webpage navigation;
* accessibility-oriented interaction design;
* regression testing;
* release cleanup;
* extension packaging and distribution preparation.

Additional small projects and utilities will be added to this section as they are prepared for portfolio publication.

---

## Repository Organization

The repository is organized primarily beneath:

```text
Full-Stack-Portfolio/
│
├── projects/
│   ├── homelab-infrastructure/
│   ├── norstein-dashiell-wedding-site/
│   ├── hexicon/
│   ├── loreweaver-creations-site/
│   ├── small-projects-and-utilities/
│   │   └── Focus-Window-Reader-Aid/
│   │       └── 0.4.0/
│   └── ...
│
└── README.md
```

Individual projects may contain their own:

* `README.md`;
* requirements;
* architecture documentation;
* design decisions;
* implementation notes;
* source code;
* tests;
* deployment documentation;
* sanitized configuration examples;
* project-specific supporting materials.

Exact organization varies where the nature of the project requires a different structure.

---

## Development Approach

These projects are intended not only to demonstrate particular programming languages or technologies, but also the engineering practices used to develop and maintain them.

Where appropriate, project work includes:

1. defining requirements and scope;
2. separating architectural decisions from implementation details;
3. identifying security and privacy boundaries;
4. establishing source-control and secret-handling rules;
5. implementing in discrete, testable steps;
6. validating changes before proceeding;
7. maintaining rollback or recovery options for consequential changes;
8. testing expected and failure behavior;
9. documenting the resulting architecture and operational requirements;
10. preparing the project for reproducible development or deployment.

Not every project uses every practice listed above. The level of process applied is proportional to the project's scope, risk, and maturity.

---

## Git and Portfolio Development

My earlier academic and personal development work used Git with varying levels of consistency. During 2026 I began applying a more systematic Git/GitHub workflow across my portfolio projects.

Current practices emphasize:

* meaningful repository organization;
* incremental commits;
* descriptive commit messages;
* `.gitignore` and environment boundaries;
* protection of credentials and production data;
* project-level READMEs;
* requirements and architecture documentation where useful;
* preservation of reproducible source and configuration;
* separation of generated/runtime data from source control;
* release-oriented cleanup before publishing representative builds.

Because older projects are being brought into this structure gradually, repository history may begin later than the actual development history of a project.

---

## Security, Privacy, and Sensitive Data

Projects involving production systems, infrastructure, authentication, event data, or other private information are sanitized before publication.

This repository is not intended to contain items such as:

* real passwords;
* API tokens;
* OAuth/OIDC secrets;
* cryptographic private keys;
* tunnel credentials;
* database passwords;
* live `.env` files;
* private production data;
* personal RSVP information;
* private infrastructure backups;
* recovery archives;
* generated service databases;
* other credentials or sensitive user information.

Where representative configuration is useful for portfolio purposes, sanitized examples may be provided instead.

---

## Development and AI Assistance

The projects in this portfolio are developed and maintained by **Joshua Norstein**.

AI-assisted tools may be used during development for tasks such as:

* research assistance;
* brainstorming and planning;
* proofreading;
* documentation refinement;
* syntax checking;
* debugging assistance;
* code review;
* configuration review;
* identifying possible implementation or security issues.

AI assistance does not replace responsibility for the resulting work.

Project architecture, technical decisions, implementation choices, configuration changes, testing, verification, debugging, source-control operations, and maintenance are evaluated and carried out by the project author unless otherwise identified.

Third-party and open-source libraries, frameworks, applications, assets, and other dependencies remain the work of their respective authors and are used according to their applicable licenses and attribution requirements.

---

## Current Portfolio Development

This repository will continue to evolve as:

* locally developed projects are migrated and sanitized for publication;
* active projects reach additional implementation milestones;
* project documentation is consolidated;
* older work is reorganized according to current repository practices;
* smaller utilities are prepared for inclusion;
* completed work is refined for employer review.

For the most representative current material, see **Recommended Starting Points** near the top of this README.

---

## Author

**Joshua Norstein**

Computer Science student and technology professional focused on full-stack software development, Linux systems, networking, cybersecurity, and self-hosted infrastructure.

GitHub:
https://github.com/JNorstein-personal

Portfolio Repository:
https://github.com/JNorstein-personal/Full-Stack-Portfolio
