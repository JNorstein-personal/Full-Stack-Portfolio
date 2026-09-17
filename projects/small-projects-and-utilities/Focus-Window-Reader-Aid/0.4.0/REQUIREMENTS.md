# Focus Window Reader Aid 0.4.0
## Clean-Rewrite Functional Specification

Status: Frozen implementation baseline for the 0.4.0 clean rewrite.

This document defines required behavior. It deliberately does not prescribe
implementation details except where necessary to establish architectural
invariants.

---

## 1. Core Invariant

Each live Firefox tab may own at most one Focus Window session.

When Persist is enabled, the complete Focus Window state belongs to that tab
independently of the webpage, URL, hostname, origin, or document currently
displayed.

Navigation changes the document that renders the Focus Window session. It does
not transfer ownership of the session.

A webpage is therefore a rendering surface for tab-owned state rather than the
owner of that state.

---

## 2. State Ownership

The background/extension state layer is authoritative for persistent tab state.

Content scripts are responsible for:

- Rendering state.
- Handling user interaction.
- Updating their local canonical state.
- Sending persistent state changes to the authoritative background layer.
- Asking the background layer whether the current Firefox tab owns a persistent
  Focus Window session.

Persistent state must never be identified by:

- URL.
- Hostname.
- Origin.
- Document object.
- Content-script instance.

---

## 3. Canonical Focus Window State

The completed Focus Window session must eventually contain:

- Active state.
- Persist state.
- Outer-frame geometry.
- Inner-window geometry.
- Outer dim.
- Ring dim.
- Brightness.
- Contrast.
- Invert state.
- Movement-lock state.
- Overlay-lock state.

All user-facing controls must ultimately modify one canonical state
representation.

The Phase 4 persistence proof of concept intentionally uses only:

- Persist state.
- A test counter.

The counter is temporary development state and is not part of the production
Focus Window specification.

---

## 4. Global Defaults vs. Persistent Tab State

A tab without an existing persistent session may initialize a manually
activated Focus Window from ordinary defaults.

Once Persist is enabled:

1. The tab-scoped state becomes authoritative.
2. Global defaults must not overwrite that tab state during navigation.
3. Navigation must retrieve and render the tab-owned state.

---

## 5. Persistence

Persist defaults to Off for a tab that does not own a persistent session.

Turning Persist On must immediately:

1. Establish the current Firefox tab as owner of a persistent session.
2. Save the complete currently relevant state.

Turning Persist Off must:

1. End future automatic restoration for that tab.
2. Remove or deactivate its persistent tab record.
3. Leave the currently displayed UI visible until manually removed or until
   navigation replaces the current document.

Persist is independent of:

- URL.
- Hostname.
- Page content.
- Movement Lock.
- Overlay Lock.

---

## 6. Required Navigation Behavior

A persistent session must survive supported same-tab navigation including:

- Ordinary links.
- Same-site navigation.
- Cross-domain navigation.
- Redirects.
- Reload.
- Browser Back.
- Browser Forward.

Fragment navigation and client-side navigation that preserve the current
document should leave the existing Focus Window intact rather than reconstructing
it solely because the URL changed.

---

## 7. Tab Isolation

Each Firefox tab has independent Focus Window state.

Enabling Persist in one tab must never cause another tab to inherit that state.

Two tabs must remain independent even when they:

- Display the same URL.
- Display the same hostname.
- Display the same origin.
- Navigate to URLs previously displayed by one another.

---

## 8. Persistence Lifetime

Persistent state belongs to the lifetime of the live Firefox tab.

Closing the tab must end that tab's persistent Focus Window session.

A stale record must never later attach to an unrelated tab.

Persistence is therefore session behavior, not a permanent website preference.

---

## 9. Close, Escape, and Toolbar Suppression

The completed implementation must distinguish between:

1. Ownership of a persistent Focus Window session.
2. Whether the Focus Window is currently rendered in a particular document.

Close, Escape, or a deliberate toolbar hide operation must not silently turn
Persist Off.

When Persist remains On, deliberate hiding may suppress the Focus Window for
the current document while leaving the tab-owned session intact.

A later qualifying full navigation may render the persistent session again.

Document suppression must not become permanent persisted state.

---

## 10. Idempotency

A supported document must contain either:

- Zero Focus Window roots when no overlay should be displayed.

or:

- Exactly one Focus Window root when it should be displayed.

Repeated initialization, restoration, messaging, or rendering must never
produce duplicate overlays.

---

## 11. Restricted Pages

The extension is not required to bypass Firefox restrictions on privileged or
browser-internal pages.

Entering a restricted page must:

- Fail harmlessly.
- Leave persistent tab state uncorrupted.
- Leave unrelated tabs unaffected.

If the same persistent tab later reaches a supported webpage, its persistent
session should become renderable again.

---

## 12. Privacy

Focus Window Reader Aid must remain local-first.

It must not require:

- Accounts.
- Login credentials.
- Cloud processing.
- Telemetry.
- Analytics.
- Advertising.
- Behavioral tracking.
- Remote webpage-content processing.

Only extension configuration and state required to provide Focus Window
functionality may be stored.

---

## 13. Permission Minimization

Permissions must be introduced only when required by demonstrated
functionality.

The extension requires access to arbitrary user-selected supported webpages,
so broad webpage matching is expected.

No navigation or lifecycle permission should be added merely because an older
prototype used it.

---

## 14. Phase 4 Architectural Gate

Before implementing production Focus Window features, the minimal prototype
must prove that:

1. The Firefox toolbar button can show and hide a small test interface.
2. Content/background communication works.
3. The background layer can identify the Firefox tab that sent a message.
4. Different tabs have different state ownership.
5. Persist can be enabled.
6. A visible counter can be changed.
7. The counter belongs to the Firefox tab.
8. The same counter is automatically restored after supported same-tab
   navigation.
9. A separate tab does not inherit the counter.
10. Persist Off ends future automatic restoration.
11. Closing the tab removes its persistent state.
12. Repeated initialization does not create duplicate interfaces.

Required navigation tests include:

- Same-site link.
- Cross-domain link.
- Reload.
- Redirect.
- Back.
- Forward.
- Fragment navigation.
- Client-side/SPA navigation where practical.
- Separate-tab isolation.

Development must not proceed to production frame geometry, dimming, filters,
resizing, locking, or the production settings toolbar until this persistence
prototype passes.

---

## 15. Later Production Features

After the persistence architecture has been proven and frozen, the production
Focus Window will reintroduce, in controlled phases:

- Canonical full state.
- Outer frame.
- Inner reading window.
- Outer-frame movement.
- Inner-window movement.
- Outer-frame resizing.
- Inner-window resizing.
- Inner containment.
- Viewport normalization.
- Ctrl-assisted alternate resizing.
- Outer dim.
- Ring dim.
- Brightness.
- Contrast.
- Color inversion.
- Viewport-fixed settings toolbar.
- Movement Lock.
- Overlay Lock.
- Persist control.
- Close behavior.
- Escape behavior.
- Toolbar suppression behavior.
- Restricted-page handling.

Each feature must be followed by regression testing of the already-proven
persistence behavior.