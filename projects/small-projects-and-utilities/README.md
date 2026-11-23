# Small Projects & Utilities

This directory contains smaller software projects, focused utilities, prototypes, experiments, and applications whose scope does not currently justify a dedicated top-level portfolio project directory.

These projects are included because narrowly scoped applications can demonstrate specific technical skills, design decisions, testing practices, and release workflows just as effectively as larger systems.

## Current Published Project

### [Focus Window Reader Aid](Focus-Window-Reader-Aid/0.4.0/)

**Platform:** Mozilla Firefox  
**Current portfolio source/release-candidate version:** `0.4.0`  
**Current public Mozilla Add-ons release:** `0.3.0`

Focus Window Reader Aid is a lightweight assistive Firefox add-on that places an adjustable visual focus overlay over webpages to support reading, visual tracking, concentration, and reduction of surrounding visual distraction.

The project demonstrates:

* Firefox WebExtension development;
* JavaScript and CSS;
* DOM interaction and overlay rendering;
* adjustable geometry and visual filtering;
* browser/tab state management;
* optional per-tab persistence across supported webpage navigation;
* keyboard and toolbar interaction;
* accessibility-oriented interface design;
* regression testing;
* release cleanup and packaging;
* Mozilla Add-ons distribution and update preparation.

Version `0.4.0` is a clean rewrite of the persistence implementation around a tab-owned canonical-state model. Its planned functional regression matrix and code-quality review are complete, and it is being prepared as the next update to the existing public Mozilla Add-ons listing.

The currently published AMO release remains `0.3.0` until Mozilla accepts and publishes the `0.4.0` update.

See the version-specific README for the current implementation architecture, persistence behavior, permissions, privacy model, testing status, packaging requirements, and release history.

## Planned and Future Small Projects

Additional projects may be added here as they become sufficiently developed and prepared for portfolio publication.

Potential areas include:

### Financial Planning & Budgeting Applications

Desktop and mobile applications exploring personal financial planning, budgeting, forecasting, transaction organization, and related data-processing or visualization features.

Target platforms may include Windows and Android.

### Additional Utilities and Experiments

Future work in this section may include:

* small desktop applications;
* mobile application prototypes;
* browser extensions;
* automation utilities;
* data-processing tools;
* programming-language exercises that develop into useful applications;
* UI/UX experiments;
* API experiments;
* focused proof-of-concept implementations.

These items are future or potential portfolio work unless a corresponding project directory and implementation are present in the repository.

## Organization

Each sufficiently developed project receives its own subdirectory and README.

The current structure is:

```text
small-projects-and-utilities/
├── README.md
└── Focus-Window-Reader-Aid/
    └── 0.4.0/
        ├── README.md
        ├── manifest.json
        ├── background.js
        ├── content.js
        └── content.css
```

Additional projects may use their own versioned or unversioned directory structure depending on the nature of the software and its release process.

A project may later be promoted into its own top-level portfolio directory if its scope, complexity, continued development, or architectural significance warrants doing so.

## Portfolio Purpose

This section demonstrates breadth, experimentation, and the ability to turn narrowly defined problems into working software without presenting every exercise as a large standalone system.

For mature utilities, the portfolio emphasis includes not only implementation but also testing, accessibility, privacy, packaging, versioning, release preparation, and maintenance.

## Development and AI Assistance

AI-assisted tools may be used for planning, research, debugging, documentation, implementation support, testing support, and code review where appropriate.

Final project requirements, implementation decisions, testing, validation, release decisions, and technical ownership remain the responsibility of the project author.
