# Focus Window Reader Aid

**Focus Window Reader Aid** is a lightweight assistive Firefox add-on that places an adjustable visual focus overlay over webpages to support reading, visual tracking, concentration, and reduction of surrounding visual distraction.

The overlay provides two independently adjustable rectangular regions:

* An **outer focus frame** that defines the broader area of attention and dims the rest of the webpage.
* An **inner reading window** that can be positioned and resized within the outer frame and can apply optional brightness, contrast, and color-inversion adjustments to the content visible through it.

Version `0.4.0` adds optional **per-tab persistence across webpage navigation** while retaining the positioning, resizing, dimming, filtering, and locking functionality of the previous public release.

---

## Distribution Status

**Current source/release-package version:** `0.4.0`

**Current public Mozilla Add-ons release before the 0.4.0 update:** `0.3.0`

**Previous public release date:** January 29, 2026

**Platform:** Mozilla Firefox

**Distribution:** Publicly listed through Mozilla Add-ons (AMO)

**Availability:** Installable through Mozilla Add-ons and Firefox's Add-ons Manager

Version `0.4.0` is the current tested release package being prepared as an update to the existing public AMO listing.

The currently published AMO release remains `0.3.0` until Mozilla accepts and publishes the `0.4.0` update.

After publication, this section should be updated with the exact `0.4.0` AMO publication date.

---

## Purpose

Focus Window Reader Aid is intended to provide customizable visual assistance for users who may benefit from isolating or emphasizing a smaller portion of a webpage while reading.

Potential uses include:

* Reducing visual clutter.
* Supporting line or paragraph tracking.
* Maintaining visual focus on a selected region.
* Reducing distraction from surrounding page content.
* Emphasizing a selected reading area.
* Adjusting brightness within the active reading area.
* Adjusting contrast within the active reading area.
* Inverting colors within the active reading area.
* Maintaining a consistent focus-window configuration while navigating between supported webpages.

The add-on is an assistive interface tool.

It is **not a medical device** and is not intended to diagnose, prevent, treat, or cure any medical condition.

---

## Features

### Adjustable Outer Focus Frame

The outer frame defines the broader focus area.

When movement is available:

* Drag the outer frame's top grip to move the entire focus-window arrangement.
* The inner reading window moves with the outer frame.
* The outer frame remains constrained to the browser viewport.

The outer frame can also be resized from any corner.

---

### Adjustable Inner Reading Window

The inner reading window can be positioned independently within the outer frame.

When movement is available:

* Drag the inner frame's top grip to reposition only the inner reading window.
* The inner window remains constrained inside the outer frame.

The inner window can be resized from any corner.

---

### Ctrl-Assisted Alternate-Frame Resizing

Corner resizing normally affects the frame whose handle is being dragged.

Holding **Ctrl before beginning the resize** switches the resize target to the other frame.

For example:

```text
Outer-frame corner + Ctrl
→ resize inner frame

Inner-frame corner + Ctrl
→ resize outer frame
```

The Ctrl state is determined when the resize begins.

---

### Geometry Safety

The add-on prevents unusable geometry by enforcing minimum frame dimensions and containment rules.

The tested implementation uses these minimum sizes where the viewport permits:

```text
Outer frame:
200 × 120 CSS pixels

Inner frame:
100 × 60 CSS pixels
```

If the viewport is smaller than those dimensions, the available viewport size takes precedence.

The implementation also normalizes geometry when a persistent session is restored into a smaller viewport.

---

## Adjustable Page Dimming

Two independent dimming controls are provided.

### Outer Dim

**Outer dim** controls the darkness of the webpage outside the outer focus frame.

### Ring Dim

**Ring dim** controls the darkness of the area between the outer frame and the inner reading window.

The two dimming levels are independent.

This allows the overlay to range from subtle visual guidance to strong isolation of the active reading area.

---

## Inner-Window Visual Filters

The inner reading window supports optional visual adjustments that affect only content visible through that window:

* **Brightness**
* **Contrast**
* **Invert**

Brightness and contrast range from `0%` through `200%`.

The default values are:

```text
Brightness: 100%
Contrast: 100%
Invert: Off
```

These effects use browser CSS backdrop-filtering support.

If the Firefox environment does not provide the required backdrop-filter functionality:

* Brightness is disabled.
* Contrast is disabled.
* Invert is disabled.
* The remainder of Focus Window Reader Aid remains functional.

Frame geometry, dimming, locks, toolbar behavior, and persistence do not depend on backdrop-filter support.

---

## Viewport-Anchored Settings Toolbar

The main Focus Window settings toolbar is anchored to the **upper-left of the browser viewport**.

It is independent of outer-frame and inner-frame geometry.

Moving or resizing either frame therefore does not move the settings toolbar.

The toolbar:

* Wraps its controls on narrower browser windows.
* Remains within the viewport.
* Uses internal vertical scrolling when the available viewport height becomes too small for all controls.
* Reserves space for the independent upper-right session controls.

The toolbar has been tested with the focus frames positioned against all viewport boundaries.

---

## Movement Lock

The toolbar includes:

```text
Move: Free
Move: Locked
```

Movement Lock affects **dragging only**.

When:

```text
Move: Locked
```

the outer and inner drag grips are hidden and frame movement is unavailable.

However:

* Outer resizing remains available.
* Inner resizing remains available.
* Ctrl-assisted alternate-frame resizing remains available.
* Dimming controls remain available.
* Visual-filter controls remain available.
* Persistence remains available.

Movement Lock is therefore separate from Overlay Lock.

---

## Overlay Lock

The upper-right session controls include:

```text
Overlay: Unlocked
Overlay: Locked
```

When Overlay Lock is enabled:

* The visual overlay remains present.
* Outer dimming remains present.
* Ring dimming remains present.
* Inner-window filters remain present.
* The main settings toolbar is hidden.
* Outer and inner drag grips are hidden.
* Outer and inner resize handles are hidden.
* Frame interaction is disabled.

The following controls remain visible and usable:

```text
Overlay: Locked
Persist: On / Off
```

This allows the overlay to function as a passive visual aid without its geometry controls interfering with normal webpage interaction.

Overlay Lock and Movement Lock are independent.

For example:

```text
Move: Locked
→ Overlay: Locked
→ Overlay: Unlocked
```

returns to:

```text
Move: Locked
```

rather than resetting Movement Lock.

---

## Controls

| Control                    | Function                                                               |
| -------------------------- | ---------------------------------------------------------------------- |
| Firefox toolbar button     | Show or suppress the Focus Window for the current document             |
| Overlay: Locked / Unlocked | Enable or disable interaction with the overlay frames and main toolbar |
| Persist: On / Off          | Enable or disable automatic restoration in the current Firefox tab     |
| Move: Free / Locked        | Allow or prevent frame dragging while retaining resizing               |
| Outer dim                  | Adjust darkness outside the outer frame                                |
| Ring dim                   | Adjust darkness between the outer and inner frames                     |
| Brightness                 | Adjust brightness within the inner reading window                      |
| Contrast                   | Adjust contrast within the inner reading window                        |
| Invert                     | Toggle color inversion within the inner reading window                 |
| Close                      | Suppress the overlay for the current document                          |
| Escape                     | Suppress the overlay for the current document                          |
| Outer top grip             | Move the outer and inner frames together                               |
| Inner top grip             | Move the inner frame independently                                     |
| Corner handles             | Resize the selected frame                                              |
| Ctrl + corner resize       | Resize the alternate frame                                             |

---

# Persistence

## Persist Control

The upper-right controls include:

```text
Persist: Off
Persist: On
```

Persistence defaults to **Off** in a Firefox tab that does not already have a live persistent Focus Window session.

When **Persist: On** is selected, the current canonical Focus Window state becomes associated with that Firefox tab.

Normal supported webpage navigation can then replace the document without ending the logical Focus Window session.

---

## Tab-Owned Persistence Model

Persistence belongs to the **live Firefox tab**, not to:

* A URL.
* A webpage.
* A domain.
* An origin.
* A hostname.

This means a persistent Focus Window session can survive:

* An ordinary same-tab link.
* Navigation to another page on the same site.
* Navigation to another supported domain.
* Redirects.
* Reload.
* Browser Back.
* Browser Forward.

The same URL opened in a different tab does **not** inherit the first tab's Focus Window session.

Each Firefox tab remains independent.

Conceptually:

```text
Firefox Tab
│
├── persistent Focus Window session
│
├── canonical state
│
└── current document
     └── rendered overlay
```

A full webpage navigation replaces the document but not the Firefox tab.

That distinction is what allows persistence to survive navigation.

---

## Canonical Focus Window State

Version `0.4.0` uses one authoritative state structure:

```javascript
{
  active: true,
  persist: false,

  outer: {
    left: 100,
    top: 100,
    width: 900,
    height: 400
  },

  inner: {
    left: 140,
    top: 180,
    width: 820,
    height: 180
  },

  dimming: {
    outer: 0.75,
    ring: 0.35
  },

  filters: {
    brightness: 1.0,
    contrast: 1.0,
    invert: false
  },

  locks: {
    movement: false,
    overlay: false
  }
}
```

The same state shape is used for rendering and, when persistence is enabled, for the tab-owned persistent snapshot.

Individual controls do not maintain independent persistence records.

---

## Persistent State Fields

When **Persist: On** is enabled, the tab-owned state preserves:

* Outer-frame left position.
* Outer-frame top position.
* Outer-frame width.
* Outer-frame height.
* Inner-window left position.
* Inner-window top position.
* Inner-window width.
* Inner-window height.
* Outer dim level.
* Ring dim level.
* Brightness.
* Contrast.
* Invert state.
* Movement Lock state.
* Overlay Lock state.
* Persist state.

The current document's temporary suppression state is intentionally **not** part of persistent state.

---

## Defaults vs. Persistent Tab State

Version `0.4.0` does not use a second global saved overlay configuration as an alternate source of truth.

Instead:

```text
No persistent tab session
→ canonical defaults are loaded
→ current document may be configured locally
```

If Persist remains Off, those current-document settings are not used to automatically recreate the overlay after full navigation.

When the user selects:

```text
Persist: On
```

the current canonical state becomes the persistent snapshot for that specific Firefox tab.

From that point forward, changes to persistent geometry, dimming, filters, and lock state update the complete tab-owned canonical snapshot.

This avoids competing global, URL-based, and tab-based state representations.

---

## Persistence Storage

The tested `0.4.0` implementation uses Firefox extension session storage for live-tab persistence.

The background extension context owns persistent tab records and identifies the sending tab through Firefox-provided tab identity.

Persistent records are associated with the Firefox **tab ID**, not with the page URL.

The content script does not choose a tab identity itself.

The general flow is:

```text
Supported document loads
        │
        ▼
content.js starts
        │
        ▼
CONTENT_READY message sent
        │
        ▼
Firefox supplies sender tab identity
        │
        ▼
background.js checks that tab's
session persistence state
        │
        ├── no persistent state
        │   └── return defaults
        │
        └── persistent state exists
            └── return canonical tab state
                    │
                    ▼
             overlay rendered
```

This startup handshake avoids relying on URL-based storage or fragile assumptions about navigation timing.

---

## Turning Persist Off

Selecting:

```text
Persist: Off
```

ends future automatic restoration for that tab.

The current overlay remains visible in the current document.

Its current settings also remain usable locally until that document is replaced or the overlay is removed.

After the next full navigation:

```text
Persist: Off
→ no automatic overlay restoration
```

Turning Persist Off does not itself close the currently displayed overlay.

---

## Persistence Lifetime

Persistent state belongs to the lifetime of the **live Firefox tab**.

When the tab closes:

* Its persistent Focus Window state is removed.
* A later unrelated tab does not inherit that state.
* Reopening the same URL in a new tab does not resurrect the old session.

Persistence is therefore a live-tab convenience feature rather than a permanent website preference.

---

# Close, Escape, and Toolbar Suppression

## Close

The **Close** button removes the Focus Window from the current document.

It does not silently change:

```text
Persist: On
```

to:

```text
Persist: Off
```

If persistence remains enabled, a later qualifying full navigation in that same tab can reconstruct the persistent Focus Window session.

---

## Escape

Pressing **Escape** performs the same current-document suppression behavior as Close.

Escape also remains available when Overlay Lock is enabled.

---

## Firefox Toolbar Toggle

The Firefox extension toolbar button behaves as a show/suppress toggle for the current supported document.

When the overlay is visible:

```text
toolbar click
→ overlay suppressed
```

When it is suppressed:

```text
toolbar click
→ overlay shown again
```

Toolbar suppression does not independently disable Persist.

---

## Suppression Is Document-Local

Close, Escape, and toolbar suppression use a temporary current-document condition.

Conceptually:

```text
Tab session:
Persist = On
Canonical Focus Window state still exists

Current document:
renderSuppressed = true
```

`renderSuppressed` is deliberately **not stored** as part of the persistent tab state.

As a result:

```text
Persist On
→ Close / Escape / toolbar off
→ overlay absent from current document
→ full supported navigation
→ new document loads
→ persistent overlay returns
```

Same-document events such as fragment changes, history-state changes, or viewport resizing do not defeat deliberate suppression.

---

# Navigation Behavior

## Full Navigation

With Persist enabled, the Focus Window session has been tested across:

* Ordinary same-tab link navigation.
* Same-site navigation.
* Cross-domain supported navigation.
* Redirects.
* Reload.
* Browser Back.
* Browser Forward.

The persistent state remains associated with the tab throughout these transitions.

---

## Same-Document Navigation

Navigation that leaves the current document alive does not reconstruct the Focus Window unnecessarily.

Tested examples include:

* Fragment navigation.
* `history.pushState()`.
* `history.replaceState()`.
* Same-document Back/Forward behavior.
* Ordinary body replacement.

When the document survives, the existing Focus Window root survives with it.

The implementation therefore does not add speculative MutationObserver-based reconstruction machinery.

This keeps lifecycle handling simpler and prevents accidental duplication.

---

## Duplicate Prevention

A supported document should contain either:

```text
0 Focus Window roots
```

when the overlay should not be present, or:

```text
1 Focus Window root
```

when the overlay should be rendered.

The renderer is idempotent.

Repeated rendering and repeated initialization must not create multiple independent Focus Window roots in the same document.

The `0.4.0` regression suite verified this behavior.

---

# Restricted and Protected Pages

Firefox does not allow ordinary extension content scripts to run on every browser page.

Examples can include:

```text
about:preferences
about:addons
```

and other browser-internal or specially protected contexts.

Focus Window Reader Aid does not attempt to bypass Firefox's restrictions.

When a persistent tab navigates:

```text
supported webpage
→ restricted page
→ supported webpage
```

the expected and tested behavior is:

```text
restricted page:
no Focus Window rendered
no session corruption

next supported page:
same tab-owned persistent session restored
```

A restricted page does not clear the session for unrelated tabs or cause persistent state to move between tabs.

Clicking the extension toolbar button while ordinary content-script execution is unavailable should fail harmlessly.

---

# Viewport Changes

A persistent geometry configuration may have been created in a larger viewport than the destination document provides.

When necessary, version `0.4.0` normalizes the restored geometry so:

* The outer frame remains inside the current viewport.
* The inner frame remains inside the outer frame.
* Minimum usable dimensions are respected where the viewport allows.

If normalization changes persistent geometry, the normalized result becomes the latest tab state.

---

# Project Architecture

The runtime package consists of:

```text
Focus-Window-Reader-Aid/
├── manifest.json
├── background.js
├── content.js
├── content.css
└── README.md
```

## `manifest.json`

Defines:

* Manifest V3.
* Extension identity and version.
* Firefox toolbar action.
* Background script.
* Content script.
* Content stylesheet.
* `storage` permission.
* `<all_urls>` host permission.
* Firefox data-collection declaration.
* `document_idle` content-script injection.

---

## `background.js`

Owns extension-level and tab-persistent behavior.

Responsibilities include:

* Receiving messages from content scripts.
* Receiving the Firefox toolbar action.
* Obtaining trustworthy tab identity from Firefox message/action context.
* Maintaining live persistent canonical state for each tab.
* Returning persistent state to a newly loaded supported document.
* Replacing the complete persistent state after committed configuration changes.
* Clearing persistent state when Persist is turned Off.
* Removing tab-owned persistent state when the Firefox tab closes.

The background layer is the continuity point for persistent sessions because full webpage navigation destroys the previous document's content-script context while leaving the Firefox tab alive.

---

## `content.js`

Owns the currently displayed document's Focus Window behavior.

Responsibilities include:

* Idempotent overlay construction.
* Geometry rendering.
* Outer-frame movement.
* Inner-window movement.
* Corner resizing.
* Ctrl-assisted alternate-frame resizing.
* Geometry constraints.
* Viewport normalization.
* Outer dim.
* Ring dim.
* Inner-window brightness.
* Inner-window contrast.
* Inner-window inversion.
* Movement Lock.
* Overlay Lock.
* Persist interaction.
* Close behavior.
* Escape behavior.
* Firefox toolbar show/suppress behavior.
* Current-document suppression.
* Communication with the background script.

The content script owns the rendered document interface but does not independently invent persistent tab identity.

---

## `content.css`

Defines the presentation and interaction layout for:

* Root overlay.
* Outer dimming layer.
* Ring dimming layer.
* Inner filtering layer.
* Outer frame.
* Inner frame.
* Drag grips.
* Resize handles.
* Viewport-anchored settings toolbar.
* Responsive toolbar wrapping.
* Toolbar overflow behavior.
* Upper-right Overlay/Persist controls.
* Movement-Locked state.
* Overlay-Locked state.
* Persist active state.
* Visible keyboard focus treatment.

---

# Permissions

Version `0.4.0` requests:

```json
"permissions": [
  "storage"
]
```

## `storage`

The `storage` permission is required for the extension's live tab-specific persistence implementation.

The tested persistence architecture uses Firefox session storage for tab-owned canonical state.

It is not used to create a permanent per-website browsing profile.

---

The extension also declares:

```json
"host_permissions": [
  "<all_urls>"
]
```

## Why `<all_urls>` Is Required

Focus Window Reader Aid is not designed for a predetermined set of websites.

Its purpose is to provide a reading and visual-tracking overlay on ordinary supported webpages selected by the user.

Restricting host access to selected domains would prevent the tool from following normal browsing activity across supported websites.

Firefox may still block extension content scripts on browser-internal or specially protected pages.

---

# Privacy

Focus Window Reader Aid is designed as a **local-first assistive browser tool**.

The extension does not require:

* A Focus Window Reader Aid account.
* Login credentials.
* Cloud processing.
* Advertising services.
* Analytics.
* Behavioral tracking.
* Telemetry.
* Remote analysis of webpage content.

The add-on does not need to transmit webpage content to provide its core functionality.

Stored session data consists only of configuration necessary to maintain an enabled persistent Focus Window session, including:

* Frame geometry.
* Dimming values.
* Visual-filter values.
* Lock states.
* Persistence state.

Persistent state is associated with a live Firefox tab and is removed when that tab closes or when Persist is explicitly turned Off.

---

## Firefox Data Collection Declaration

The Firefox-specific manifest configuration declares:

```json
"data_collection_permissions": {
  "required": [
    "none"
  ]
}
```

This reflects the extension's local visual-assistance design.

---

# Compatibility

Focus Window Reader Aid is developed specifically for **Mozilla Firefox**.

The extension uses:

* Firefox WebExtensions APIs.
* Manifest V3.
* CSS backdrop filtering for optional inner-window visual filters.

Brightness, contrast, and inversion require support for:

```css
backdrop-filter
```

and/or:

```css
-webkit-backdrop-filter
```

If neither is available, the three visual-filter controls are disabled while the rest of the Focus Window remains usable.

---

# Known Limitations

* The overlay cannot operate normally on Firefox internal pages where Firefox does not permit ordinary content-script execution.
* Firefox may restrict extension operation on other specially protected pages.
* Brightness, contrast, and inversion depend on browser backdrop-filter support.
* Persist is scoped to the live Firefox tab rather than being a permanent site preference.
* Closing a tab intentionally terminates that tab's persistent Focus Window session.
* Persistence does not propagate to other tabs, even when they display the same URL.
* A configuration may be geometrically normalized when restored into a substantially smaller viewport.
* Close, Escape, and Firefox-toolbar suppression apply only to the current document and do not independently disable Persist.
* Same-document navigation intentionally preserves the existing overlay rather than rebuilding it.
* The extension does not attempt to bypass Firefox restrictions on privileged pages.

---

# Installation

## Install from Mozilla Add-ons

Focus Window Reader Aid is publicly distributed through **Mozilla Add-ons (AMO)**.

The published release can be installed using:

* Mozilla Add-ons.
* Firefox's built-in Add-ons Manager.

At the time the `0.4.0` package is being prepared, the currently published AMO release is:

```text
0.3.0
```

Version `0.4.0` is intended to replace it after Mozilla's update submission and review process is complete.

AMO-installed releases are signed by Mozilla and can receive approved updates through Firefox according to the user's extension-update preferences.

---

## Temporary Development Installation

To load the current source tree directly in Firefox:

1. Open Firefox.

2. Navigate to:

   ```text
   about:debugging
   ```

3. Select **This Firefox**.

4. Select **Load Temporary Add-on...**

5. Navigate to the `0.4.0` source directory.

6. Select:

   ```text
   manifest.json
   ```

The Focus Window Reader Aid toolbar button should then appear in Firefox.

When source files change during development:

1. Save the changed files.
2. Return to `about:debugging`.
3. Locate Focus Window Reader Aid.
4. Select **Reload**.
5. Reload or revisit the webpage being used for testing if necessary.

Temporary add-ons are removed when Firefox is fully restarted and must be loaded again for later development sessions.

---

# Testing Status

Version `0.4.0` has completed its planned functional regression matrix.

The tested areas include:

* Toolbar activation and suppression.
* Fixed toolbar positioning.
* Responsive toolbar behavior.
* Outer-frame movement.
* Inner-window movement.
* Outer-frame resizing.
* Inner-window resizing.
* Ctrl-assisted alternate-frame resizing.
* Geometry containment.
* Viewport normalization.
* Outer dimming.
* Ring dimming.
* Brightness.
* Contrast.
* Inversion.
* Movement Lock.
* Overlay Lock.
* Tab-specific persistence.
* Same-tab navigation.
* Same-site navigation.
* Cross-domain navigation.
* Redirects.
* Reload.
* Back/Forward.
* Fragment navigation.
* SPA/history-state navigation.
* Separate-tab isolation.
* Same-URL tab isolation.
* Persist Off behavior.
* Close suppression.
* Escape suppression.
* Firefox toolbar suppression.
* Tab-close persistence cleanup.
* Duplicate prevention.
* Restricted-page transitions.
* Unsupported backdrop-filter fallback behavior.

Runtime code should not be considered release-ready solely because of this behavioral matrix; code-quality review, packaging verification, and AMO submission preparation remain separate release phases.

---

# Version 0.4.0

Version `0.4.0` is a clean rewrite of the persistence implementation around a tab-owned canonical-state architecture.

## Added or Revised

* Added **Persist: On / Off**.
* Added automatic restoration across supported full-page navigation.
* Added tab-owned session persistence.
* Added automatic persistent-state cleanup when the tab closes.
* Established one canonical Focus Window state representation.
* Added full geometry restoration.
* Added dimming restoration.
* Added visual-filter restoration.
* Added Movement Lock restoration.
* Added Overlay Lock restoration.
* Added viewport normalization.
* Added document-local Close/Escape/toolbar suppression.
* Added fixed viewport-anchored settings toolbar behavior.
* Added responsive toolbar wrapping and overflow handling.
* Added safe restricted-page transitions.
* Preserved same-document overlays without speculative lifecycle observers.
* Verified duplicate prevention through idempotent rendering.

---

# Version History

## 0.4.0 — September 2026

**Status:** Tested release package being prepared for submission to the existing public Mozilla Add-ons listing.

The exact public publication date should be added after Mozilla accepts and publishes the release.

Primary change:

```text
Optional persistent Focus Window sessions owned by the live Firefox tab.
```

Version `0.4.0` retains the established Focus Window functionality while changing the persistence architecture so full navigation no longer requires manual reactivation when Persist is enabled.

---

## 0.3.0 — January 29, 2026

**Status:** Current public AMO release prior to publication of `0.4.0`.

Version `0.3.0` provides the established adjustable Focus Window interface, including:

* Outer focus frame.
* Inner reading window.
* Independent dimming controls.
* Movement locking.
* Overlay interaction locking.
* Brightness adjustment.
* Contrast adjustment.
* Color inversion.

Version `0.3.0` does not preserve an active Focus Window session across full webpage navigation in the manner implemented by `0.4.0`.

---

# Project Lineage

Versions 0.1.0, 0.2.0, and early development iterations leading to 0.3.0 belong to an earlier prototype lineage created before this project adopted its current Git/GitHub development workflow.

Those versions established the core Focus Window concept and informed later interface and behavioral decisions, but their implementation should not be treated as the architectural foundation of version 0.4.0.

The final 0.3.0 release was a functional public release on Mozilla Add-ons. However, attempts to extend the earlier architecture with persistent navigation exposed structural limitations that ultimately led to the decision to rebuild the extension rather than continue patching the prototype.

Version 0.4.0 is therefore a standalone clean rewrite. Its tab-owned canonical-state model, persistence architecture, rendering lifecycle, suppression behavior, and navigation handling were designed and validated independently rather than inherited from the earlier implementation.

The earlier versions remain in the project history because they document the evolution of the concept and the development process, not because their architecture remains authoritative.

---

# Development and Repository Notes

The `0.4.0` rewrite was developed incrementally around persistence-first testing.

Major implementation milestones were committed separately so the repository history distinguishes:

* Persistence proof-of-concept work.
* Canonical state introduction.
* Renderer implementation.
* Geometry restoration.
* Dimming restoration.
* Filter restoration.
* Fixed-toolbar behavior.
* Lock behavior.
* Document suppression.
* Full persistence regression testing.

Development of this version has used AI assistance for implementation drafting, code review support, test-procedure drafting, and documentation assistance.

Project requirements, behavioral decisions, testing, acceptance of changes, and release decisions remain directed and verified by the project author.

---

# AMO Packaging

The `0.4.0` release package should contain the required runtime files at the ZIP archive root:

```text
focus-window-reader-aid-0.4.0.zip
├── manifest.json
├── background.js
├── content.js
├── content.css
└── README.md
```

Do **not** package them inside an additional enclosing project directory such as:

```text
focus-window-reader-aid-0.4.0.zip
└── Focus-Window-Reader-Aid/
    ├── manifest.json
    ├── background.js
    ├── content.js
    ├── content.css
    └── README.md
```

Development-only material should not be placed in the public release archive unless intentionally required.

Examples include:

* Development plans.
* Archived prototypes.
* Test notes.
* Previous release packages.
* Editor metadata.
* Unrelated repository files.
* Git metadata.

Before AMO upload, verify:

1. `manifest.json` reports version `0.4.0`.
2. The Firefox extension identity matches the existing AMO listing.
3. Only intended release files are included.
4. `manifest.json` is located at the archive root.
5. JavaScript syntax checks pass.
6. The manifest parses successfully.
7. The complete release regression matrix still passes after final cleanup.
8. The final ZIP installs successfully as the intended extension package.

---

# Versioning

The extension uses semantic-style version numbering in `manifest.json`.

Current source/release-package version:

```text
0.4.0
```

Current public version before the update:

```text
0.3.0
```

Future AMO releases must increment the manifest version appropriately.

---

# License

No source-code license has been specified for this project.

The absence of a repository license means that no open-source license should be assumed.

If a license is selected in the future:

1. Add the appropriate `LICENSE` file.
2. Update this README.
3. Ensure the repository and Mozilla Add-ons listing describe the licensing consistently.

---

# Project Status

**Active, publicly distributed, and under continued development.**

The existing public AMO release is `0.3.0`.

Version `0.4.0` has completed its planned functional regression testing and is being prepared as the next public update.

The remaining pre-release work consists of code-quality review, repository/release documentation review, final packaging validation, and AMO submission.
