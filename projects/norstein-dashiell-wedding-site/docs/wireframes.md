# Loreweaver Creations Wedding Website
# Low-Fidelity Mobile-First Wireframes

## Purpose

This document provides the Phase 2 low-fidelity wireframes for the Loreweaver Creations wedding website, revised through Phase 3 Step 14 so that every RSVP layout maps explicitly to the approved thirteen-state React interface model, the finalized temporary-confirmation and Confirmation Refresh Fallback behavior, and the finalized browser-facing privacy/security constraints.

These wireframes define:

- Information order.
- Page hierarchy.
- Header, navigation, content, action, form, and footer placement.
- Mobile stacking order.
- Public and personalized RSVP states.
- One reusable spreadsheet-authoritative RSVP form structure.
- Invitation-specific safe named-invitee rosters and typed additional-guest allocation variants, including one-person Plus 1 controls and at most one grouped unnamed-children control per applicable invitation.
- Explicit named-invitee and Plus 1 Yes/No decisions plus grouped unnamed-child Yes/No-and-count behavior.
- Backend-derived `overallAttendance`, age-category totals that must equal that derived count, and all-attendance `Attendee Details` repetition.
- Reception-specific dietary/allergy fields within otherwise universal attendee-detail rows.
- Confirmed Sphinx-only event presentation.
- Invitation-launch and post-wedding Gallery states.

They intentionally do **not** define:

- Final watercolor artwork.
- Final typography.
- Final colors.
- Exact spacing.
- Final borders, shadows, animation, or decorative treatment.
- React component names.
- Backend implementation.
- API payloads.
- Spreadsheet structure.

The controlling project documents are:

- `docs/requirements.md`
- `docs/decisions.md`
- `docs/content-inventory.md`
- `docs/link-inventory.md`
- `docs/route-inventory.md`
- `docs/page-outlines.md`
- `docs/sitemap.md`
- `docs/rsvp-system-design.md`
- `docs/rsvp-api-contract.md`
- `docs/rsvp-test-cases.md`

The RSVP states and behaviors shown here are synchronized through Phase 3 Step 14 and the September 27, 2026 grouped `Kids(n)` correction with `docs/rsvp-system-design.md`, `docs/rsvp-api-contract.md`, `docs/page-outlines.md`, and `docs/rsvp-test-cases.md`. The public-page wireframes are additionally synchronized through the November 1, 2026 Workstream 4 content lock. These wireframes continue to define browser-facing information order and layout rather than backend implementation or API payload structure. The grouped-child correction changes only conditional content inside existing RSVP states: one family-level child Yes/No control may reveal one count selector from 1 through the authorized `maximumCount`. It does not create a new route, top-level state, child-specific substantive region, or independently editable headcount.

**October 12, 2026 — Decision 029 reconciliation:** Email is the sole guest RSVP confirmation method for new submissions and revisions. Every online initial submission and revision requires a newly entered valid guest email address; no confirmation-method selector, text-message option, mobile-number input, or SMS authorization appears in the guest interface. Successful storage precedes independent guest-email and protected administrative-email delivery attempts. Disabled historical SMS-capable paths and sensitive records remain subject to separately reviewed retirement and privacy controls; they are not a future activation option. These wireframe updates do not authorize production deployment or public RSVP activation.

---

# Wireframe Conventions

```text
┌──────────────────────────────┐
│ PAGE OR REGION               │
└──────────────────────────────┘
```

- `[ Button ]` represents a button or prominent call to action.
- `[ Link ]` represents an ordinary link.
- `[____________________]` represents a text input.
- `( )` represents a radio option.
- `[ ]` represents a checkbox.
- `< Select one >` represents a select control.
- `{ Conditional }` identifies content shown only in an applicable state.
- `{ Confirmed event details }` identifies guest-facing information derived from the finalized Sphinx-only wedding configuration.
- `{ Authorized named invitees }` identifies a region repeated once for each safe named invitee returned by the validated invitation configuration.
- `{ Authorized additional-guest allocations }` identifies a conditional region that exists only when the validated invitation configuration contains one or more `additionalGuestAllocations`. Each allocation exposes safe `id`, `kind`, `prompt`, and `maximumCount` metadata. A `plus1` allocation renders one Yes/No control; an `unnamedChildren` allocation renders one grouped family Yes/No control and, after Yes, one required count selector from 1 through `maximumCount`.
- `{ Reception selected }` identifies content shown only when Reception is part of the current attendance state.
- `{ Attending party }` identifies content shown whenever derived `overallAttendance` is greater than zero.
- `[−] 0 [+]` represents a coordinated whole-number dial whose available increase is limited by the remaining portion of derived `overallAttendance` after the other age-category values.
- `...` indicates repeated content following the same structural pattern.

These wireframes are mobile-first. Content is shown in the order in which it should stack on a narrow screen.

---

# Phase 3 RSVP State Map — Step 10 Model, Finalized Through Step 14

Phase 3 Step 10 establishes thirteen explicit top-level RSVP interface states. Phase 3 Step 13 preserves that state model and finalizes the temporary-confirmation lifecycle and State 12 fallback presentation. Phase 3 Step 14 adds privacy/security presentation constraints around those same states without creating another top-level state. The wireframes below remain organized by route and visual layout, but they map to the formal state model as follows:

| State | Formal name | Wireframe |
|---:|---|---|
| 1 | Entry Ready | 2A and 2B |
| 2 | Looking Up Invitation | 2C |
| 3 | Invalid Invitation | 2D |
| 4 | Service Unavailable | 2E |
| 5 | Validated Blank Form | 3A–3F |
| 6 | Validation Failure | 3G |
| 7 | Submitting | 3H |
| 8 | Submission Uncertain | 3I |
| 9 | Confirmed Initial Submission | 4A–4B |
| 10 | Confirmed Revision | 4C |
| 11 | Stored with Delivery Warning | 4D–4E |
| 12 | Confirmation Refresh Fallback | 4F |
| 13 | RSVP Closed | 2F |

Countdown visibility, invitation-specific named-invitee controls, Plus 1 controls, grouped-child conditional count selection, all-attendance `Attendee Details` repetition, Reception-specific dietary/allergy fields, guest-versus-administrative delivery warnings, and responsive layouts are presentation variants inside these states rather than additional top-level states.

The interface must render only one top-level RSVP state at a time. A state transition may preserve local draft information when needed for validation correction or idempotent retry, but it must never expose invitation codes, stored answers, or confirmation destinations through a browser URL.

## Step 14 browser-facing privacy/security conventions

- `/wedding/rsvp/` and `/wedding/rsvp/confirmation` are transactional, non-indexed routes and their production responses use `Cache-Control: no-store, max-age=0`.
- Successful confirmation data is not intentionally persisted in browser storage solely so that it can be reconstructed after temporary Step 13 state is lost.
- Any analytics associated with RSVP/confirmation layouts is non-personalized and must not contain invitation codes, guest/party identities derived from invitation records, RSVP answers, attendee names, dietary/allergy information, confirmation destinations, `clientSubmissionId`, additional-guest allocation details, versions, or provider payloads.
- Every initial online RSVP and revision uses the fixed guest confirmation method `email` and requires a newly entered valid email address. No guest-facing channel selector, Text Message option, mobile confirmation number, or transactional SMS authorization is displayed or collected.
- The guest confirmation email attempt and the protected administrative email attempt occur independently after successful storage; guests see only appropriate delivery-attempt status, not a guarantee of inbox delivery.
- Historical mobile numbers, SMS authorization records, and delivery history, if present, remain private until controlled retirement. No new text messages are sent, and historical SMS destinations are not automatically converted to email addresses.
- Invitation-code, error, warning, fallback, and help layouts must not expose internal security architecture, workbook details, provider secrets, protected administrative addresses, or close-match invitation information.


---

# Shared Mobile Page Shell

```text
┌──────────────────────────────┐
│ [Skip to main content]       │
├──────────────────────────────┤
│ BRAND / HOME LINK            │
│ [Menu]              [RSVP]   │  ← compact sticky header
├──────────────────────────────┤
│ {Expanded mobile menu}       │
│ Home                         │
│ RSVP                         │
│ Theme & Attire               │
│ Our Story                    │
│ Read, Listen & Watch         │
│ Venue                        │
│ Travel                       │
│ Day-Of Details               │
│ FAQ                          │
│ Gallery                      │
│ Privacy                      │
│ | Music [Off/On toggle]      │
│ [Close menu]                 │
├──────────────────────────────┤
│ MAIN CONTENT                 │
│                              │
│ Page-specific sections       │
│                              │
├──────────────────────────────┤
│ FOOTER                       │
│ [Home] [RSVP] [FAQ]          │
│ [Privacy]                    │
│ RSVP assistance              │
│ Ownership/copyright notice   │
│ [Decorative Calcifer GIF]    │
└──────────────────────────────┘
```

## Shared mobile behavior

1. The header remains sticky while scrolling.
2. The sticky header must not cover headings, fields, errors, or focused controls.
3. The mobile menu is clearly labeled.
4. The menu closes after a destination is selected.
5. RSVP remains prominent whether the menu is open or closed.
6. Primary route navigation returns the guest to the top of the selected page.
7. Internal wedding-site links open in the same tab.
8. External media, hotel, and map links open in a new tab and are identified as such.
9. The content begins below the sticky header.
10. The footer follows the final page section.
11. All controls remain keyboard- and touch-operable.
12. Informational images provide meaningful alternative text where appropriate; hover/title text may supplement but never replace accessible alternative text.

## Background-music control

The header places a visible separator immediately after Privacy, followed by the background-music toggle.

- Music is **Off by default**. The site does not attempt audible autoplay on initial page load.
- Turning Music on begins with the approved intro segment, then transitions into the looping segment.
- Turning Music off stops the background playback.
- When site multimedia that requires foreground audio is playing, background music is temporarily suppressed and may resume afterward if the guest left the music toggle on.
- The toggle exposes an accessible name and status; essential state is not communicated by visual position alone.

## Route-transition loading overlay

Primary route changes may display a floating loading overlay while the destination page and its immediate media prepare.

```text
┌──────────────────────────────┐
│          [GIF]               │
│                              │
│          Loading…            │
│ Please wait while we prepare │
│ this page.                   │
└──────────────────────────────┘
```

The loading overlay:

- Appears above the destination page rather than as permanent page content.
- Uses a decorative animated image that is hidden from assistive technology.
- Announces loading status politely.
- Prevents a partially loaded multimedia-heavy page from appearing to stall mid-scroll.
- Clears when the transition is ready or when the route-loading safeguard completes.
- Does not expose technical asset, network, framework, or server details.

## Wider-screen adaptation

At tablet and desktop widths:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ BRAND  Home RSVP Theme Story Read/Listen/Watch Venue Travel Day-Of ... │
│                                         Privacy | Music [Off/On] [RSVP] │
├─────────────────────────────────────────────────────────────────────────┤
│ MAIN CONTENT                                                            │
├─────────────────────────────────────────────────────────────────────────┤
│ FOOTER: Home · RSVP · FAQ · Privacy                         [Calcifer]   │
└─────────────────────────────────────────────────────────────────────────┘
```

- The approved navigation remains in the same logical order.
- Content may use columns where doing so improves comprehension.
- Reading order remains meaningful when columns collapse to mobile.
- The RSVP action remains visually prominent.
- The page must not require hover to reveal essential content.

## Shared event-schedule and reception policy

All event-dependent wireframes use the single confirmed public wedding format:

- Ceremony and reception are both at Sphinx Banquet and Catering Center.
- Saturday, May 1, 2027.
- Ceremony begins at 11:30 a.m.
- Festivities conclude at 4:30 p.m.
- The ceremony flows directly into brunch and the reception.
- There is no separately scheduled formal cocktail hour.
- There is no separately scheduled formal dinner service.
- Buffet brunch, dancing, speeches, and other reception moments may occur flexibly rather than through a minute-by-minute guest itinerary.
- Do not assign exact public times to dancing, toasts, speeches, cake service, photographs, buffet activity, or other flexible internal events unless a later recorded decision approves them.
- The former Warinanco Park ceremony configuration is discontinued and must not appear as a current, pending, alternate, or weather-fallback guest plan.

# 1. Home Wireframe

**Route:** `/wedding/`

**Confirmed event format:** Ceremony and reception entirely at Sphinx.

```text
┌──────────────────────────────┐
│ SHARED STICKY HEADER         │
├──────────────────────────────┤
│ HERO / INTRO REGION          │
│ [Approved couple photograph] │
│ COUPLE'S NAMES               │
│ Saturday, May 1, 2027        │
│ Roselle, New Jersey          │
│ Brief welcome message        │
│ [RSVP]                       │
├──────────────────────────────┤
│ QUICK PLANNING LINKS         │
│ [Theme & Attire]             │
│ [Venue]                      │
│ [Travel]                     │
│ [Day-Of Details]             │
├──────────────────────────────┤
│ CONFIRMED EVENT SUMMARY      │
│ Ceremony + Reception         │
│ Sphinx Banquet Center        │
│ 11:30 a.m.–4:30 p.m.         │
│                              │
│ Buffet brunch, dancing,      │
│ speeches, and other          │
│ festivities follow the       │
│ ceremony.                    │
│                              │
│ [View Venue]                 │
│ [View Day-Of Details]        │
├──────────────────────────────┤
│ OUR STORY TEASER             │
│ Brief introduction           │
│ [Read Our Story]             │
├──────────────────────────────┤
│ PLANNING REMINDER            │
│ RSVP deadline text           │
│ RSVP assistance link         │
├──────────────────────────────┤
│ SHARED FOOTER                │
└──────────────────────────────┘
```

### Home rules

- Present only the confirmed Sphinx-only wedding format.
- Do not display Warinanco Park as a current, pending, alternate, or weather-fallback venue.
- Do not split the 11:30 a.m.–4:30 p.m. guest-facing event window into invented internal ceremony/reception times.
- Keep flexible reception wording broad.
- Do not add a separately scheduled cocktail hour, formal dinner, or fixed dancing block.
- The static invitation QR code continues to open this public Home route.

# 2. RSVP Entry Wireframes

**Route:** `/wedding/rsvp/`

## 2A. State 1 — Entry Ready — Before February 1, 2027

```text
┌──────────────────────────────┐
│ SHARED STICKY HEADER         │
├──────────────────────────────┤
│ RSVP                         │
│                              │
│ Enter the six-character code │
│ printed on your invitation.  │
├──────────────────────────────┤
│ WHERE TO FIND YOUR CODE      │
│ Short location instructions  │
│ Example: XXX-XXX             │
├──────────────────────────────┤
│ QR CODE EXPLANATION          │
│ The printed QR code opens    │
│ the wedding homepage. The    │
│ invitation code must still   │
│ be entered here.             │
├──────────────────────────────┤
│ INVITATION CODE              │
│ [________________________]   │
│ Format: XXX-XXX              │
│                              │
│ [Continue]                   │
├──────────────────────────────┤
│ DEADLINE                     │
│ Monday, March 1, 2027        │
│ 11:59 p.m. EST               │
│                              │
│ Revisions are permitted      │
│ before the deadline.         │
├──────────────────────────────┤
│ PRINTED RSVP ALTERNATIVE     │
│ Brief return-slip directions │
├──────────────────────────────┤
│ PRIVACY REASSURANCE          │
│ Brief code-and-data notice   │
│ [Read Full Privacy Notice]   │
├──────────────────────────────┤
│ NEED HELP?                   │
│ RSVPhelp@...                 │
├──────────────────────────────┤
│ SHARED FOOTER                │
└──────────────────────────────┘
```

---

## 2B. State 1 — Entry Ready — Final-Month Countdown

**Active from:** February 1, 2027 at 12:00 a.m. EST  
**Ends:** March 1, 2027 at 11:59 p.m. EST

```text
┌──────────────────────────────┐
│ SHARED STICKY HEADER         │
├──────────────────────────────┤
│ RSVP                         │
│ Enter the code printed on    │
│ your invitation.             │
├──────────────────────────────┤
│ RSVP COUNTDOWN               │
│                              │
│ 28 days : 06 hours : ...     │
│ remaining                    │
│                              │
│ Deadline written in full     │
├──────────────────────────────┤
│ INVITATION CODE              │
│ [________________________]   │
│ Format: XXX-XXX              │
│ [Continue]                   │
├──────────────────────────────┤
│ QR / CODE INSTRUCTIONS       │
├──────────────────────────────┤
│ PRINTED RSVP ALTERNATIVE     │
├──────────────────────────────┤
│ PRIVACY REASSURANCE          │
│ [Read Full Privacy Notice]   │
├──────────────────────────────┤
│ NEED HELP?                   │
├──────────────────────────────┤
│ SHARED FOOTER                │
└──────────────────────────────┘
```

### Countdown rules

- Do not show the countdown before February 1, 2027.
- Always show the written deadline.
- Calculate against `America/New_York`.
- Replace the countdown and form controls with the closed state at the deadline.

---

## 2C. State 2 — Looking Up Invitation

```text
┌──────────────────────────────┐
│ SHARED STICKY HEADER         │
├──────────────────────────────┤
│ RSVP                         │
├──────────────────────────────┤
│ CHECKING INVITATION CODE     │
│ [Loading/status indicator]   │
│ Please wait while we check   │
│ the code.                    │
│                              │
│ [Continue — disabled]        │
├──────────────────────────────┤
│ NEED HELP?                   │
├──────────────────────────────┤
│ SHARED FOOTER                │
└──────────────────────────────┘
```

---

## 2D. State 3 — Invalid Invitation

```text
┌──────────────────────────────┐
│ SHARED STICKY HEADER         │
├──────────────────────────────┤
│ RSVP                         │
├──────────────────────────────┤
│ ERROR SUMMARY                │
│ We could not locate an       │
│ invitation associated with   │
│ that code. Please check the  │
│ code as printed on your      │
│ invitation and try again.    │
├──────────────────────────────┤
│ INVITATION CODE              │
│ [previous entry retained]    │
│ Format: XXX-XXX              │
│ [Try Again]                  │
├──────────────────────────────┤
│ PRINTED RSVP ALTERNATIVE     │
├──────────────────────────────┤
│ NEED HELP?                   │
│ RSVPhelp@...                 │
├──────────────────────────────┤
│ SHARED FOOTER                │
└──────────────────────────────┘
```

---

## 2E. State 4 — Service Unavailable

```text
┌──────────────────────────────┐
│ SHARED STICKY HEADER         │
├──────────────────────────────┤
│ RSVP TEMPORARILY UNAVAILABLE │
│                              │
│ Guest-safe explanation       │
│ No technical details         │
│ No claim that an RSVP was    │
│ recorded                     │
│                              │
│ [Return Home]                │
├──────────────────────────────┤
│ PRINTED RSVP ALTERNATIVE     │
├──────────────────────────────┤
│ NEED HELP?                   │
│ RSVPhelp@...                 │
├──────────────────────────────┤
│ SHARED FOOTER                │
└──────────────────────────────┘
```

Use this state when the lookup or submission service is known to be unavailable before storage is confirmed. When the browser cannot determine whether a submission was recorded, use the separate Submission Uncertain state instead.

---

## 2F. State 13 — RSVP Closed

```text
┌──────────────────────────────┐
│ SHARED STICKY HEADER         │
├──────────────────────────────┤
│ ONLINE RSVP IS CLOSED        │
│                              │
│ Online submissions and       │
│ revisions closed Monday,     │
│ March 1, 2027 at 11:59 p.m.  │
│ EST.                         │
│                              │
│ Contact instructions for     │
│ late corrections or special  │
│ circumstances.               │
│                              │
│ [Return Home]                │
├──────────────────────────────┤
│ NEED HELP?                   │
│ RSVPhelp@...                 │
├──────────────────────────────┤
│ SHARED FOOTER                │
└──────────────────────────────┘
```

---

# 3. Personalized Blank RSVP Form Wireframes

**Route:** `/wedding/rsvp/`

The form remains on the canonical RSVP route. Invitation codes, private source-row identifiers, named-invitee identifiers, allocation identifiers, raw `Kids(n)` source text, and other private configuration values do not appear in the URL.

Every validated invitation uses the same reusable substantive RSVP structure. Invitation-specific variation is limited to information authorized by the validated private configuration, principally:

- Singular or plural first-person wording.
- `maximumAttendance` as the maximum potential size of the invited party.
- A safe `namedInvitees` roster containing only stable opaque IDs and approved display names for specifically named potential attendees.
- Zero or more safe `additionalGuestAllocations`, each exposing only:
  - `id`
  - `kind`
  - `prompt`
  - `maximumCount`

A `plus1` allocation represents one potential person and always has `maximumCount: 1`.

An applicable `unnamedChildren` allocation represents the complete grouped unnamed-child capacity for that invitation. At most one such allocation exists per invitation.

The validated private configuration must reconcile:

`namedInvitees.length + sum(additionalGuestAllocations.maximumCount) === maximumAttendance`

The browser must never use allocation-array length as person capacity and must never treat `maximumAttendance` as an independently selectable actual headcount.

When Ceremony, Reception, or both are selected:

- Every authorized named invitee receives one explicit Yes/No attendance decision.
- Every authorized Plus 1 allocation receives one explicit Yes/No decision.
- Every applicable grouped unnamed-children allocation receives one family-level Yes/No decision.
- If the grouped child response is Yes, one required count selector appears with values `1..maximumCount`.
- If the grouped child response is No, the child count is zero and the selector is not applicable.

`overallAttendance` is then derived as:

`named-invitee Yes count + Plus 1 Yes count + grouped unnamed-child attending count`

The four age-category dials classify that already-derived attending party and must sum exactly to `overallAttendance`.

Whenever `overallAttendance` is greater than zero, the page renders exactly one **Attendee Details** row per attending person. Every row requires **Attendee name**. When Reception is selected, each row additionally displays optional **Dietary or allergy information**. This includes one attendee row for every child represented by the grouped child count.

## 3A. State 5 — Validated Blank Form — Shared Introduction

```text
┌──────────────────────────────┐
│ SHARED STICKY HEADER         │
├──────────────────────────────┤
│ RSVP FOR                     │
│ [Invited party greeting]     │
├──────────────────────────────┤
│ DEADLINE / COUNTDOWN         │
│ Written deadline             │
│ {Countdown during final      │
│ month only}                  │
├──────────────────────────────┤
│ IMPORTANT: BLANK FORM        │
│                              │
│ Previously submitted answers │
│ and contact details are not  │
│ displayed here.              │
│                              │
│ First RSVP: complete every   │
│ required applicable field.   │
│                              │
│ Revision: enter a new valid  │
│ confirmation email address,  │
│ then provide only the RSVP   │
│ changes you intend to make.  │
│                              │
│ Omitted applicable RSVP      │
│ fields remain unchanged      │
│ unless a controlling change  │
│ makes them inapplicable or   │
│ requires complete replacement│
│ of a dependent structure.    │
│                              │
│ A saved revision replaces    │
│ the previous confirmation    │
│ destination with the newly   │
│ entered email address.       │
├──────────────────────────────┤
│ PERSONALIZED FORM            │
│ One reusable form; named     │
│ invitees, Plus 1 controls,   │
│ and grouped-child controls   │
│ vary by invitation.          │
└──────────────────────────────┘
```

The interface may display only the validated party greeting, approved named-invitee display names, and the safe allocation `kind`, reviewed `prompt`, and `maximumCount` needed to render authorized additional-guest controls. It must not expose the production invitation code, another party's configuration, private spreadsheet notes, raw `Kids(n)` text, source-row information, or internal opaque identifiers.

## 3B. Shared Event Attendance and Decline Region

```text
┌──────────────────────────────┐
│ ATTENDANCE                   │
│                              │
│ {Singular wording}           │
│ [ ] I will attend Ceremony   │
│ [ ] I will attend Reception  │
│ [ ] Regrettably, I am unable │
│     to attend.               │
│                              │
│ {Plural wording}             │
│ [ ] We will attend Ceremony  │
│ [ ] We will attend Reception │
│ [ ] Regrettably, we are      │
│     unable to attend.        │
│                              │
│ Ceremony + Reception may be  │
│ selected together. Decline   │
│ is mutually exclusive with   │
│ either attending choice.     │
│                              │
│ {Revision}                   │
│ Leave this region untouched  │
│ to keep the stored status;   │
│ interact with it only when   │
│ changing event attendance.   │
└──────────────────────────────┘
```

Selecting the decline checkbox clears Ceremony and Reception on the page. Selecting either attending checkbox clears decline. The backend independently enforces the same mutually exclusive resulting states. Selecting an attending event does not itself determine how many people attend; named-invitee Yes/No responses, Plus 1 Yes/No responses, and any grouped child selected count below determine actual headcount.

## 3C. Authorized Attendance Decisions

This region appears only when the resulting event-attendance state includes Ceremony, Reception, or both. A complete full decline makes all named-invitee and additional-guest attendance responses inapplicable and clears them.

### Authorized named invitees

```text
┌──────────────────────────────┐
│ WHO IS ATTENDING?            │
│                              │
│ Will [Named Invitee A]       │
│ attend?                      │
│ ( ) Yes          ( ) No      │
│                              │
│ Will [Named Invitee B]       │
│ attend?                      │
│ ( ) Yes          ( ) No      │
│                              │
│ ...repeat once per validated │
│ named invitee...             │
│                              │
│ {Revision}                   │
│ Leave an answer untouched to │
│ keep that stored response,   │
│ or select Yes/No to replace. │
└──────────────────────────────┘
```

Named-invitee rules:

- Render one Yes/No control for every object in the validated invitation's safe `namedInvitees` roster.
- The visible label uses only approved `displayName`; opaque `id` remains a submission/authorization key rather than visible copy.
- Mixed household attendance is permitted.
- Specifically named children use this same control.
- On an initial attending RSVP, or after changing from full decline to attendance, every authorized named invitee requires an explicit Yes/No response.
- On an ordinary revision that remains attending, an omitted named-invitee response means leave that stored response unchanged.

### Authorized additional-guest allocations

#### No authorized additional-guest allocation

```text
┌──────────────────────────────┐
│ {NO ADDITIONAL-GUEST REGION  │
│  RENDERED}                   │
└──────────────────────────────┘
```

When the validated invitation contains no `additionalGuestAllocations`, no additional-guest heading, placeholder, disabled control, or “not applicable” row appears.

#### Authorized Plus 1 allocation

```text
┌──────────────────────────────┐
│ AUTHORIZED PLUS 1            │
│                              │
│ Will [Named Invitee] be      │
│ accompanied by a +1?         │
│                              │
│ ( ) Yes          ( ) No      │
│                              │
│ {Revision}                   │
│ Leave unanswered to keep the │
│ stored response unchanged,   │
│ or select Yes/No to replace. │
└──────────────────────────────┘
```

A Plus 1 allocation:

- Exists only when the validated invitation contains `kind: "plus1"`.
- Always has `maximumCount: 1`.
- Stores `"yes"` or `"no"`.
- Contributes one attendee when Yes and zero when No.
- Does not request the Plus 1's own name; that name is supplied later through ordinary **Attendee Details**.

#### Grouped unnamed-children allocation — unanswered or No

```text
┌──────────────────────────────┐
│ AUTHORIZED CHILDREN          │
│                              │
│ We'd love for your family to │
│ celebrate with us this       │
│ Mayday - will your kid(s) be │
│ accompanying you?            │
│                              │
│ ( ) Yes          ( ) No      │
│                              │
│ {No selected}                │
│ No child-count selector      │
│ is displayed.                │
│                              │
│ {Revision}                   │
│ Leave untouched to keep the  │
│ stored grouped response.     │
└──────────────────────────────┘
```

When No is selected, the canonical grouped response is:

`{ "attending": "no", "count": 0 }`

#### Grouped unnamed-children allocation — Yes selected

```text
┌──────────────────────────────┐
│ AUTHORIZED CHILDREN          │
│                              │
│ We'd love for your family to │
│ celebrate with us this       │
│ Mayday - will your kid(s) be │
│ accompanying you?            │
│                              │
│ (●) Yes          ( ) No      │
│                              │
│ How many?                    │
│ < Select one >               │
│   1                          │
│   2                          │
│   ... through maximumCount   │
│                              │
│ Count is required while Yes. │
└──────────────────────────────┘
```

When Yes is selected:

- Reveal one required select control.
- Options are exactly the consecutive whole numbers from `1` through that allocation's `maximumCount`.
- The canonical grouped response is `{ "attending": "yes", "count": k }`.
- The validated selected count contributes directly to `overallAttendance`.
- The control is rendered **once**, not once per child.
- No child name is requested here.

A grouped unnamed-children allocation exists only when the validated invitation contains `kind: "unnamedChildren"`. A specifically named child remains in `namedInvitees` and is not duplicated in grouped capacity.

#### Mixed authorized allocations

```text
┌──────────────────────────────┐
│ ADDITIONAL GUESTS            │
│                              │
│ Will [Named Invitee] be      │
│ accompanied by a +1?         │
│ ( ) Yes          ( ) No      │
│                              │
│ We'd love for your family to │
│ celebrate with us this       │
│ Mayday - will your kid(s) be │
│ accompanying you?            │
│ ( ) Yes          ( ) No      │
│                              │
│ {If child response = Yes}    │
│ How many? < Select one >     │
└──────────────────────────────┘
```

Additional-guest rules:

- Render each allocation according to backend-supplied `kind`.
- `plus1` uses scalar Yes/No.
- `unnamedChildren` uses one grouped Yes/No response plus a conditional child count.
- Allocation-array length is not person capacity.
- No generic “How many additional guests?” control exists.
- The grouped child count selector is specific to the single authorized child allocation.
- Actual names for attending Plus 1 guests and children are supplied only through ordinary **Attendee Details**.
- On an initial attending RSVP or transition from decline to attendance, every authorized allocation requires a complete response.
- On an ordinary attending revision, an omitted unchanged allocation response means leave the stored value unchanged.

## 3D. Coordinated Attendance Dials

This region appears whenever the resulting RSVP is attending.

```text
┌──────────────────────────────┐
│ TOTAL ATTENDING PARTY        │
│                              │
│ Derived total: [N]           │
│                              │
│ To better accommodate the    │
│ seating & dietary needs of   │
│ our guests, please list the  │
│ total number of attendees in │
│ your party:                  │
│                              │
│ Adults (ages 21+)            │
│ [−] 0 [+]                    │
│                              │
│ Young Adults (ages 18–20)    │
│ [−] 0 [+]                    │
│                              │
│ Children (ages 3–17)         │
│ [−] 0 [+]                    │
│                              │
│ Children under 3             │
│ [−] 0 [+]                    │
│                              │
│ Assigned: [sum] of [N]       │
└──────────────────────────────┘
```

The derived total is:

`overallAttendance = named-invitee Yes count + Plus 1 Yes count + grouped unnamed-child attending count`

Presentation and validation rules:

- `overallAttendance` is derived from authorized attendance responses/counts before age totals are validated.
- The guest does not edit `overallAttendance` directly.
- The complete four-dial sum must equal `overallAttendance` exactly.
- Each dial's available increase is constrained by `overallAttendance` minus the values currently assigned to the other three age categories.
- The four dials classify all attending people, including every child represented by the grouped child count.
- If a named-invitee, Plus 1, or grouped child response/count changes and the merged age totals no longer equal newly derived `overallAttendance`, the affected age totals must be revised before submission can succeed.
- Explicit zero remains a valid replacement value for an age category during a revision.

## 3E. Attendee Details

This region appears whenever derived `overallAttendance` is greater than zero, including Ceremony-only attendance.

```text
┌──────────────────────────────┐
│ ATTENDEE DETAILS             │
│                              │
│ Attendee 1                   │
│ Attendee name                │
│ [__________________________] │
│                              │
│ {Reception selected}         │
│ Dietary or allergy           │
│ information                  │
│ [__________________________] │
│                              │
│ Attendee 2                   │
│ Attendee name                │
│ [__________________________] │
│                              │
│ {Reception selected}         │
│ Dietary or allergy           │
│ information                  │
│ [__________________________] │
│                              │
│ ...repeat until row count    │
│ equals overallAttendance...  │
└──────────────────────────────┘
```

Rules:

- The number of rows equals complete derived `overallAttendance`.
- Every row always requires **Attendee name**.
- Attendee name maximum length is 100 characters.
- When Reception is selected, each row additionally displays **Dietary or allergy information**.
- Dietary/allergy information remains optional and is limited to 1000 characters.
- When Reception is not selected, dietary/allergy controls are absent and those values are not stored.
- The list includes all attending named invitees, attending Plus 1 guests, and one row for each child represented by the grouped child count.
- If a named-invitee or Plus 1 response changes which people attend, the complete attendee-detail list must be replaced even when numeric `overallAttendance` remains unchanged.
- **Any grouped child response/count change requires complete attendee-detail replacement**, because previously unnamed child identities cannot safely be matched to stored rows.
- If composition remains unchanged and `attendeeDetails` is omitted from a revision, the stored list remains unchanged except for Reception-specific dietary clearing.
- Removing Reception while continuing to attend preserves attendee names and removes dietary/allergy values.

## 3F. Required Email Confirmation and Submission Region

```text
┌──────────────────────────────┐
│ RSVP CONFIRMATION BY EMAIL   │
│ Required for every initial   │
│ submission and revision.     │
│                              │
│ Email address                │
│ [____________________]       │
│                              │
│ On a saved revision, this    │
│ new email address replaces   │
│ the prior guest confirmation │
│ destination.                 │
├──────────────────────────────┤
│ REVISION REMINDER            │
│ Omitted applicable RSVP      │
│ fields normally remain       │
│ unchanged, but person-level  │
│ changes may require updated  │
│ age totals and complete      │
│ Attendee Details replacement.│
├──────────────────────────────┤
│ [ Submit RSVP ]              │
│                              │
│ Privacy information          │
│ Assistance                   │
└──────────────────────────────┘
```

The method is always `email` and is not guest-selectable. The email address is required for every initial submission and revision, is never prefilled from stored RSVP contact information, and becomes the guest confirmation destination after successful storage. There is no SMS choice, mobile-number field, or SMS authorization checkbox. The protected administrative email is attempted separately after storage; neither delivery attempt reverses a stored RSVP.

## 3G. State 6 — Validation Failure

```text
┌──────────────────────────────┐
│ PLEASE REVIEW YOUR RSVP      │
│                              │
│ [Accessible error summary]   │
│ • Attendance choice needed   │
│ • Named invitee response     │
│   missing / invalid          │
│ • Additional-guest response │
│   missing / invalid          │
│ • No attendee marked Yes     │
│   for an attending RSVP      │
│ • Age totals do not equal    │
│   derived attendance         │
│ • Attendee Details count     │
│   does not match attendance  │
│ • Attendee name required     │
│ • Dietary text unavailable   │
│   without Reception          │
│ • Email/mobile invalid       │
│ • ...                        │
├──────────────────────────────┤
│ FORM                         │
│ Guest's current page-entered │
│ values remain visible for    │
│ correction.                  │
│                              │
│ No stored prior answers are  │
│ revealed.                    │
└──────────────────────────────┘
```

Validation messages must be field-associated where appropriate, summarized accessibly, and written without exposing private source rows, opaque identifiers, other parties, stored prior answers, or backend internals.

## 3H. State 7 — Submitting

```text
┌──────────────────────────────┐
│ SUBMITTING RSVP              │
│ Please do not close or       │
│ resubmit this form.          │
│                              │
│ [Submit control disabled]    │
│ [Progress announced]         │
└──────────────────────────────┘
```

The current logical request retains one `clientSubmissionId`; repeated activation while that request is in flight is prevented.

## 3I. State 8 — Submission Uncertain

```text
┌──────────────────────────────┐
│ WE COULDN'T CONFIRM THE      │
│ RESULT                       │
│                              │
│ Your RSVP may already have   │
│ been recorded.               │
│                              │
│ Check the email inbox you    │
│ entered for confirmation.    │
│                              │
│ [Retry safely]               │
│ [Contact for Help]           │
└──────────────────────────────┘
```

A safe retry reuses the same logical request and `clientSubmissionId`. This state must not claim either success or failure without evidence.

---

# 4. RSVP Confirmation Wireframes

**Route:** `/wedding/rsvp/confirmation`

The confirmation route displays only the complete current guest-facing RSVP returned by a successful submission plus limited delivery/status information. It never exposes the protected administrative email address, provider internals, private spreadsheet rows, opaque internal identifiers, invitation codes in the URL, or another party's information.

The summary follows the single spreadsheet-authoritative RSVP model. It includes the applicable event-attendance state, named-invitee responses, Plus 1 responses, any grouped unnamed-child Yes/No and selected attending count, age-category totals, derived `overallAttendance`, and `Attendee Details`. Dietary/allergy information appears only when Reception is part of the complete current RSVP. Conditional regions that genuinely do not apply are omitted rather than rendered as disabled or `N/A` placeholders.

## 4A. State 9 — Confirmed Initial Submission — No Authorized Additional Guest

```text
┌──────────────────────────────┐
│ SHARED STICKY HEADER         │
├──────────────────────────────┤
│ RSVP RECORDED                │
│ Thank you.                   │
│ Initial submission           │
├──────────────────────────────┤
│ COMPLETE CURRENT RSVP        │
│                              │
│ Attendance                   │
│ ✓ Ceremony                   │
│ ✓ Reception                  │
│                              │
│ NAMED INVITEES               │
│ [Invitee A] ........ Yes     │
│ [Invitee B] ........ Yes     │
│ [Invitee C] ........ Yes     │
│                              │
│ PARTY TOTALS                 │
│ Adults 21+ ............ 2    │
│ Young Adults 18–20 .... 0    │
│ Children 3–17 ......... 1    │
│ Children under 3 ...... 0    │
│ Overall attendance .... 3    │
│                              │
│ ATTENDEE DETAILS             │
│ 1. [Attendee name]           │
│    Dietary/allergy: [...]    │
│ 2. [Attendee name]           │
│    Dietary/allergy: none     │
│ 3. [Attendee name]           │
│    Dietary/allergy: [...]    │
├──────────────────────────────┤
│ Submitted [timestamp]        │
│ Confirmation: Email          │
│ Guest delivery: [status]     │
│ Admin attempt: [status only] │
├──────────────────────────────┤
│ NEED TO REVISE?              │
│ Return to RSVP, enter your   │
│ code again, and submit only  │
│ deliberate changes.          │
│ [Return to RSVP]             │
├──────────────────────────────┤
│ DEADLINE / ASSISTANCE        │
├──────────────────────────────┤
│ SHARED FOOTER                │
└──────────────────────────────┘
```

No empty additional-guest region is displayed merely to indicate that the invitation does not contain an authorized allocation.

## 4B. State 9 — Confirmed Initial Submission — Authorized Additional Guests

```text
┌──────────────────────────────┐
│ RSVP RECORDED                │
│ Initial submission           │
├──────────────────────────────┤
│ COMPLETE CURRENT RSVP        │
│                              │
│ Attendance                   │
│ ✓ Reception                  │
│                              │
│ NAMED INVITEES               │
│ [Invitee A] ........ Yes     │
│ [Invitee B] ........ No      │
│                              │
│ ADDITIONAL GUEST RESPONSES   │
│ [Invitee A] +1 ...... Yes    │
│ Children accompanying: Yes   │
│ Children attending: ... 2    │
│                              │
│ PARTY TOTALS                 │
│ Adults 21+ ............ 2    │
│ Young Adults 18–20 .... 0    │
│ Children 3–17 ......... 2    │
│ Children under 3 ...... 0    │
│ Overall attendance .... 4    │
│                              │
│ ATTENDEE DETAILS             │
│ 1. [Attendee name]           │
│    Dietary/allergy: [...]    │
│ 2. [Attendee name]           │
│    Dietary/allergy: none     │
│ 3. [Child name]              │
│    Dietary/allergy: [...]    │
│ 4. [Child name]              │
│    Dietary/allergy: none     │
├──────────────────────────────┤
│ [Timestamp / delivery status]│
└──────────────────────────────┘
```

The confirmation uses guest-facing prompts/labels but does not expose internal person/allocation ids or raw private source data.

For a Plus 1 allocation, the confirmation shows its Yes/No result.

For a grouped unnamed-children allocation:

- No may be summarized as `Children accompanying: No`.
- Yes includes both the family-level Yes response and the selected number attending.
- The confirmation does not repeat one synthetic “invited child” response per child.

For a Ceremony-only confirmation, the **Attendee Details** list remains present with attendee names, while dietary/allergy lines are omitted.

## 4C. State 10 — Confirmed Revision

```text
┌──────────────────────────────┐
│ SHARED STICKY HEADER         │
├──────────────────────────────┤
│ RSVP UPDATED                 │
│ Your revision was recorded.  │
├──────────────────────────────┤
│ COMPLETE CURRENT RSVP        │
│                              │
│ [Attendance or decline]      │
│ {Named invitee responses}    │
│ {Plus1 / grouped-child       │
│  responses and child count}  │
│ {Four attendance totals +    │
│ derived overallAttendance}   │
│ {Attendee Details whenever   │
│ overallAttendance > 0}       │
│ {Dietary/allergy values only │
│ if Reception selected}       │
│                              │
│ This is the complete merged  │
│ result, not only the fields  │
│ submitted in this revision.  │
├──────────────────────────────┤
│ Revised [timestamp]          │
│ Confirmation: Email          │
│ Guest delivery: [status]     │
│ Admin attempt: [status only] │
├──────────────────────────────┤
│ [Return to RSVP]             │
├──────────────────────────────┤
│ SHARED FOOTER                │
└──────────────────────────────┘
```

If a revision removes Reception while retaining Ceremony attendance, the summary keeps **Attendee Details** and attendee names but omits dietary/allergy values. A grouped child response/count change appears in the complete merged summary and requires the corresponding complete attendee-detail replacement before storage. If the resulting RSVP fully declines, the summary omits named-invitee responses, all additional-guest responses, attendance totals, and Attendee Details because the authoritative result contains zero attendees.

## 4D. State 11 — Stored with Delivery Warning — Guest Delivery

```text
┌──────────────────────────────┐
│ SHARED STICKY HEADER         │
├──────────────────────────────┤
│ RSVP RECORDED                │
│ Your RSVP was saved.         │
├──────────────────────────────┤
│ COMPLETE CURRENT RSVP        │
│ [Applicable complete summary]│
├──────────────────────────────┤
│ GUEST DELIVERY ISSUE         │
│ The guest confirmation       │
│ email could not be delivered │
│ or its delivery confirmed.   │
│                              │
│ The administrative email     │
│ attempt was handled          │
│ independently.               │
│                              │
│ Do not resubmit solely for   │
│ this reason.                 │
│                              │
│ [Contact for Help]           │
├──────────────────────────────┤
│ SHARED FOOTER                │
└──────────────────────────────┘
```

## 4E. State 11 — Stored with Delivery Warning — Administrative Delivery

```text
┌──────────────────────────────┐
│ SHARED STICKY HEADER         │
├──────────────────────────────┤
│ RSVP RECORDED                │
│ Your RSVP was saved.         │
├──────────────────────────────┤
│ COMPLETE CURRENT RSVP        │
│ [Applicable complete summary]│
├──────────────────────────────┤
│ ADMIN EMAIL DELIVERY ISSUE   │
│ The couple's administrative  │
│ confirmation could not be    │
│ delivered or confirmed.      │
│                              │
│ The private address is not   │
│ displayed. Guest delivery    │
│ was attempted independently. │
│                              │
│ Do not resubmit.             │
│ [Contact for Help]           │
├──────────────────────────────┤
│ SHARED FOOTER                │
└──────────────────────────────┘
```

The guest and administrative warning regions may appear together when both independent attempts fail or remain uncertain. The complete RSVP summary remains governed by the same conditional rules as States 9 and 10.

## 4F. State 12 — Confirmation Refresh Fallback

Render this wireframe when `/wedding/rsvp/confirmation` loads without a structurally usable temporary successful-submission response. This can occur after a refresh, direct visit, bookmark/new-tab visit, browser-history return, or other loss/invalidation of temporary navigation/application state.

A refresh or history action does **not** force this fallback if the approved successful response remains available and usable. In that case, continue to render State 9, 10, or 11 as appropriate.

```text
┌──────────────────────────────┐
│ SHARED STICKY HEADER         │
├──────────────────────────────┤
│ CONFIRMATION SUMMARY NO      │
│ LONGER AVAILABLE             │
│                              │
│ The temporary on-screen RSVP │
│ summary is no longer         │
│ available. If you submitted  │
│ an RSVP, it may already have │
│ been recorded. Please check  │
│ your email for confirmation. │
│ Do not submit the same       │
│ response again only because  │
│ this summary is unavailable. │
├──────────────────────────────┤
│ TO MAKE A DELIBERATE         │
│ REVISION                     │
│ Return to the RSVP page and  │
│ enter your invitation code   │
│ again.                       │
│                              │
│ [Return to RSVP]             │
├──────────────────────────────┤
│ NEED HELP?                   │
│ If you are unsure whether    │
│ your RSVP was recorded or    │
│ need help, contact           │
│ RSVPhelp@                    │
│ loreweavercreations.com.     │
│                              │
│ [Contact for Help]           │
├──────────────────────────────┤
│ SHARED FOOTER                │
└──────────────────────────────┘
```

The visible copy above preserves the finalized Phase 3 Step 13 uncertainty-safe fallback and applies Decision 029's email-only update. Implementation may make minor punctuation or responsive line-wrap adjustments, but must preserve the substantive meaning: the submission may already be recorded, the guest should check email, and the guest must not resubmit solely because temporary confirmation state is unavailable.

### State 12 information-order rules

1. Shared sticky header.
2. Fallback heading.
3. Primary uncertainty-safe explanation.
4. Instruction to check the guest confirmation email inbox.
5. Explicit instruction not to submit the same response again solely because the temporary summary is unavailable.
6. Deliberate-revision guidance.
7. `Return to RSVP` action.
8. Assistance explanation using `RSVPhelp@loreweavercreations.com`.
9. `Contact for Help` action.
10. Shared footer.

### State 12 action behavior

**Return to RSVP**:

- Navigates to `/wedding/rsvp/`.
- Begins an ordinary deliberate manual-entry interaction.
- Does not reconstruct or automatically replay the lost submission.
- Does not automatically perform invitation lookup.
- Does not generate a new `clientSubmissionId` merely because confirmation state was lost.
- Does not silently reuse a prior `clientSubmissionId` outside the explicit State 8 safe-retry workflow.
- Remains subject to the ordinary authoritative deadline; if online RSVP is closed, the RSVP route displays State 13 rather than bypassing closure.

**Contact for Help**:

- Exposes the approved RSVP assistance method using `RSVPhelp@loreweavercreations.com`.
- Does not disclose provider details, protected administrative destinations, or private RSVP records.

### State 12 prohibited recovery behavior

The fallback must not automatically:

- Repeat `POST /wedding/api/rsvp/submit`.
- Repeat `POST /wedding/api/rsvp/lookup`.
- Generate a new `clientSubmissionId`.
- Reuse an earlier `clientSubmissionId` outside State 8 safe retry.
- Request a stored RSVP through an undocumented public endpoint.
- Reconstruct RSVP content from a code-bearing or data-bearing URL.
- Infer success merely because the confirmation route was reached.
- Infer failure merely because temporary state is absent.
- Redirect the guest on a timer before the explanation can be read.

The initial implementation does not require a short-lived confirmation token, a public confirmation-recovery endpoint, a public saved-RSVP endpoint, a code-bearing confirmation URL, or intentional persistent browser storage solely to make the on-screen summary survive refresh.

### State 12 accessibility rules

- Move focus to, or programmatically announce, the fallback heading or primary explanatory region as appropriate.
- Preserve explicit text for uncertainty, revision guidance, and assistance; do not rely on color, icon, or animation alone.
- Keep both actions keyboard- and touch-operable.
- Ensure the sticky header does not obscure the heading or focused controls.
- Respect reduced-motion preferences for any optional transition treatment.
- Do not use a timed automatic redirect.

---

# Phase 3 RSVP Transition Rules — Step 10 Model, Finalized Through Step 14

The preceding RSVP wireframes must be connected according to these browser-facing transition rules. Phase 3 Step 13 refines only the confirmation-state lifecycle and State 12 recovery behavior. Phase 3 Step 14 adds privacy/security constraints without another top-level RSVP state; Decision 029 replaces the former SMS provider gate with fixed email-only guest confirmation:

1. **State 1 → State 2:** Activating Continue begins one lookup request and protects the control against repeated activation.
2. **State 2 → State 5:** A valid active invitation renders the authorized blank form on the same `/wedding/rsvp/` route.
3. **State 2 → State 3:** Malformed, unknown, or inactive lookup results use the same neutral invalid-invitation presentation.
4. **State 2 → State 4:** A known lookup-service failure uses Service Unavailable.
5. **State 2 → State 13:** An authoritative closed result removes entry controls.
6. **State 5 → State 6:** Client or server validation errors preserve the guest's current page-entered values and display accessible correction guidance.
7. **State 5 or State 6 → State 7:** A valid logical submission disables duplicate activation and retains the request's `clientSubmissionId`.
8. **State 7 → State 9, 10, or 11:** Proven storage leads to an initial confirmation, revision confirmation, or success-with-delivery-warning state.
9. **State 7 → State 6:** A rejected pre-storage submission returns guest-safe validation errors without revealing stored values.
10. **State 7 → State 4:** A known core-service failure before storage is established may use Service Unavailable.
11. **State 7 → State 8:** A lost or ambiguous browser response uses Submission Uncertain rather than claiming failure.
12. **State 8 safe retry:** Reuse the same logical request and `clientSubmissionId`; do not create a new logical submission merely because the first response was lost.
13. **Confirmation-state availability → State 9, 10, 11, or 12:** If a structurally usable successful-submission response remains available, continue to render the applicable successful confirmation state. If that response is absent or unusable after refresh, direct navigation, bookmark/new-tab access, history traversal, or other state loss, enter State 12 without automatic lookup, submission replay, identifier reuse, or private-data reconstruction.
14. **Deadline → State 13:** The backend-authoritative deadline prevents new lookup/submission interaction, but it does not erase a successful confirmation already established by the server.

All state changes that announce progress, error, warning, uncertainty, success, or closure must be conveyed in text and exposed accessibly; color or animation alone is never sufficient.

---

# 5. Theme & Attire Wireframe

**Route:** `/wedding/theme`

```text
┌──────────────────────────────┐
│ SHARED STICKY HEADER         │
├──────────────────────────────┤
│ THEME & ATTIRE               │
│ Introductory statement       │
├──────────────────────────────┤
│ WEDDING AESTHETIC            │
│ Howl's Moving Castle         │
│ inspiration explained        │
├──────────────────────────────┤
│ VINTAGE GARDEN FORMAL        │
│ Plain-language dress-code    │
│ explanation                  │
├──────────────────────────────┤
│ [Guest attire inspiration]   │
│ Click/tap to expand          │
├──────────────────────────────┤
│ HATS, ACCESSORIES &          │
│ A LITTLE MAGIC               │
│ Statement hats encouraged    │
│ Whimsical/anachronistic      │
│ details welcome              │
├──────────────────────────────┤
│ [Guest color palette]        │
│ Click/tap to expand          │
├──────────────────────────────┤
│ COLOR PALETTE                │
│ Written guidance; palette is │
│ inspiration, not a rulebook  │
├──────────────────────────────┤
│ FINAL ATTIRE GUIDANCE        │
│ Comfort, celebration, and    │
│ personal style emphasized    │
├──────────────────────────────┤
│ SHARED FOOTER                │
└──────────────────────────────┘
```

The two informational graphics must remain understandable with their accompanying written content, use appropriate alternative/hover text, and support responsive click/tap expansion without obscuring surrounding content.

# 6. Our Story Wireframe

**Route:** `/wedding/story`

```text
┌──────────────────────────────┐
│ SHARED STICKY HEADER         │
├──────────────────────────────┤
│ OUR STORY                    │
│ Brief introduction           │
│                              │
│ Explore this page:           │
│ [Hair-Raising Happily-...]   │
│ [Engagement to Wedding Day]  │
│ [Join Us]                    │
├──────────────────────────────┤
│ A HAIR-RAISING               │
│ HAPPILY-EVER-AFTER           │
│ Narrative text               │
│ [Relationship media]         │
│ [Jump To: section links]     │
├──────────────────────────────┤
│ FROM ENGAGEMENT TO           │
│ WEDDING DAY                  │
│ Proposal/planning narrative  │
│ [Proposal photographs]       │
│ [Proposal video]             │
│ [Jump To: section links]     │
├──────────────────────────────┤
│ JOIN US                      │
│ Closing invitation/context   │
│ [RSVP] [Return Home]         │
│ [Jump To: section links]     │
├──────────────────────────────┤
│ SHARED FOOTER                │
└──────────────────────────────┘
```

All Explore/Jump-To links are same-page fragment links. Proposal imagery/video uses approved accessible labels or captions where applicable. Background music temporarily yields to foreground multimedia playback.

# 7. Read, Listen, and Watch Wireframe

**Route:** `/wedding/read-listen-watch`

```text
┌──────────────────────────────┐
│ SHARED STICKY HEADER         │
├──────────────────────────────┤
│ READ, LISTEN & WATCH         │
│ Introductory explanation     │
│                              │
│ Explore this page:           │
│ [About the Book]             │
│ [About the Movie]            │
│ [Experience the Story]       │
├──────────────────────────────┤
│ ABOUT THE BOOK               │
│ [Book cover]                 │
│ Description / significance   │
│ Audiobook information        │
│ [Lawful external resources]  │
│ [Jump To: section links]     │
├──────────────────────────────┤
│ ABOUT THE MOVIE              │
│ [Movie poster]               │
│ Description / significance   │
│ [Trailer / media]            │
│ [Jump To: section links]     │
├──────────────────────────────┤
│ EXPERIENCE THE STORY         │
│ [Bookshop.org — new tab]     │
│ [Amazon book — new tab]      │
│ [IMDb — new tab]             │
│ [Blu-ray — new tab]          │
│ [Streaming — new tab]        │
│ Availability disclaimer      │
│ [Jump To: section links]     │
├──────────────────────────────┤
│ COPYRIGHTED MEDIA NOTICE     │
│ Site links to lawful sources │
│ and does not host full works │
├──────────────────────────────┤
│ SHARED FOOTER                │
└──────────────────────────────┘
```

### Wider-screen adaptation

- Media/text blocks may use wider layouts when doing so improves comprehension.
- Each resource group remains coherent when stacked.
- External-link behavior remains visible and accessible.
- Explore/Jump-To links remain usable by keyboard and touch.

# 8. Venue Wireframe

**Route:** `/wedding/venue`

```text
┌──────────────────────────────┐
│ SHARED STICKY HEADER         │
├──────────────────────────────┤
│ VENUE                        │
│ Ceremony + reception at      │
│ Sphinx Banquet & Catering    │
│ Center                       │
├──────────────────────────────┤
│ ADDRESS                      │
│ 121 E 2nd Avenue             │
│ Roselle, NJ 07203            │
├──────────────────────────────┤
│ DIRECTIONS                   │
│ [Google Maps — new tab]      │
│ [Apple Maps — new tab]       │
├──────────────────────────────┤
│ PARKING                      │
│ Municipal lot directly       │
│ across the street            │
├──────────────────────────────┤
│ DAY-OF CONTEXT               │
│ Ceremony begins 11:30 a.m.   │
│ Festivities end 4:30 p.m.    │
│ Entire celebration at Sphinx │
├──────────────────────────────┤
│ [Travel] [Day-Of Details]    │
│ [Theme & Attire]             │
├──────────────────────────────┤
│ SHARED FOOTER                │
└──────────────────────────────┘
```

### Venue rules

- Do not present a second ceremony venue or between-venue travel period.
- Do not present Warinanco Park as a current, pending, alternate, or weather-fallback venue.
- Map links open in a new tab and are identified accessibly.
- Do not invent entrance, accessibility, or parking details beyond information that has actually been verified.

# 9. Travel Wireframe

**Route:** `/wedding/travel`

```text
┌──────────────────────────────┐
│ SHARED STICKY HEADER         │
├──────────────────────────────┤
│ TRAVEL                       │
│ Sphinx location reminder     │
├──────────────────────────────┤
│ DRIVING & PARKING            │
│ Municipal lot across street  │
│ [Google Maps — new tab]      │
│ [Apple Maps — new tab]       │
├──────────────────────────────┤
│ HOTELS & OVERNIGHT STAYS     │
│ Friendly pending message:    │
│ hotel recommendations and    │
│ booking details are still    │
│ being gathered               │
│                              │
│ {Future confirmed details}   │
│ Hotel / address              │
│ Booking instructions         │
│ Rate / block / deadline      │
│ Accessibility details        │
│ [Booking link — new tab]     │
├──────────────────────────────┤
│ ADDITIONAL TRAVEL GUIDANCE   │
│ Future verified information  │
│ may be added without         │
│ inventing unconfirmed facts  │
├──────────────────────────────┤
│ [Venue] [Day-Of Details]     │
│ [FAQ]                        │
├──────────────────────────────┤
│ SHARED FOOTER                │
└──────────────────────────────┘
```

### Travel rules

- The entire wedding takes place at Sphinx; do not create between-venue travel.
- Do not publish an invented hotel, room block, negotiated rate, booking code, booking deadline, cancellation rule, or accessibility promise.
- Pending hotel language should remain warm and guest-facing rather than administrative.
- The absence of finalized hotel details does not block publication of the confirmed venue/driving/parking information.

# 10. Day-Of Details Wireframe

**Route:** `/wedding/day-of`

```text
┌──────────────────────────────┐
│ SHARED STICKY HEADER         │
├──────────────────────────────┤
│ DAY-OF DETAILS               │
│ Introductory copy            │
│                              │
│ Explore this page:           │
│ [The Schedule] [The Menu]    │
│ [Dietary Needs] [Gift Policy]│
├──────────────────────────────┤
│ THE SCHEDULE                 │
│ 11:30 a.m. — Ceremony        │
│ After ceremony — brunch,     │
│ dancing, speeches, and       │
│ celebration                  │
│ 4:30 p.m. — festivities end  │
│ [Venue]                      │
│ [Jump To: section links]     │
├──────────────────────────────┤
│ THE MENU                     │
│ [Approved breakfast image]   │
│ Hot Brunch Buffet            │
│ Bagels & Schmears            │
│ Appetizing / fruit           │
│ Coffee / tea / mockmosas     │
│ Dessert: to be announced     │
│ [Approved themed image +     │
│  caption]                    │
│ [Jump To: section links]     │
├──────────────────────────────┤
│ DIETARY NEEDS                │
│ Gluten-free/non-dairy        │
│ availability                 │
│ Allergy/restriction reminder │
│ Cross-contact caveat         │
│ [RSVP]                       │
│ [Jump To: section links]     │
├──────────────────────────────┤
│ GIFT POLICY                  │
│ No traditional registry      │
│ Preferred/non-preferred      │
│ categories                   │
│ Presence matters most        │
│ [Jump To: section links]     │
├──────────────────────────────┤
│ SHARED FOOTER                │
└──────────────────────────────┘
```

### Day-Of Details rules

- Use the confirmed Sphinx-only 11:30 a.m.–4:30 p.m. guest-facing schedule.
- Do not create a formal cocktail-hour block, formal-dinner block, fixed dancing block, or minute-by-minute internal run-of-show.
- Speeches and other flexible reception moments may be announced during the reception rather than assigned exact public times.
- The Gift Policy remains part of Day-Of Details; do not create a separate gift-registry page.
- Explore/Jump-To navigation uses same-page fragment links and remains keyboard/touch-operable.

# 11. FAQ Wireframe

**Route:** `/wedding/faq`

```text
┌──────────────────────────────┐
│ SHARED STICKY HEADER         │
├──────────────────────────────┤
│ FREQUENTLY ASKED QUESTIONS   │
├──────────────────────────────┤
│ Where are the ceremony and   │
│ reception?                   │
│ Warm concise answer          │
│ [Venue]                      │
├──────────────────────────────┤
│ When should I arrive?        │
│ 11:30 a.m. ceremony; arrive  │
│ a little early               │
│ [Day-Of Details]             │
├──────────────────────────────┤
│ Where can I park?            │
│ Municipal lot across street  │
│ [Venue]                      │
├──────────────────────────────┤
│ What should I wear?          │
│ Vintage Garden Formal        │
│ [Theme & Attire]             │
├──────────────────────────────┤
│ What does the day look like? │
│ Relaxed 11:30–4:30 flow      │
│ [Day-Of Details]             │
├──────────────────────────────┤
│ When is the RSVP deadline?   │
│ Centralized deadline         │
│ [RSVP]                       │
├──────────────────────────────┤
│ Can I mail in my RSVP?       │
│ Printed RSVP alternative     │
│ [RSVP]                       │
├──────────────────────────────┤
│ Can I change my RSVP?        │
│ Revision before deadline     │
│ [RSVP]                       │
├──────────────────────────────┤
│ What if I have dietary needs?│
│ Concise dietary guidance     │
│ [Day-Of Details] [RSVP]      │
├──────────────────────────────┤
│ Are hotels arranged?         │
│ Friendly forthcoming-details │
│ answer                       │
│ [Travel]                     │
├──────────────────────────────┤
│ What is your gift policy?    │
│ No traditional registry;     │
│ presence matters most        │
│ [Day-Of Details]             │
├──────────────────────────────┤
│ How does RSVP information    │
│ stay private?                │
│ Plain-language summary       │
│ [Privacy]                    │
├──────────────────────────────┤
│ How do I get RSVP help?      │
│ RSVPhelp@...                 │
│ [RSVP]                       │
├──────────────────────────────┤
│ SHARED FOOTER                │
└──────────────────────────────┘
```

### FAQ rules

- Answers are friendly, cordial, and concise rather than clinical or implementation-oriented.
- Every answer with a corresponding in-depth page includes a contextual link to that page.
- The FAQ does not expose source-spreadsheet syntax, private invitation configuration, internal allocation identifiers, stored RSVP values, or provider details.
- Day-of answers use the confirmed Sphinx-only plan.
- Hotel answers may honestly state that details are forthcoming.
- Gift Policy points to Day-Of Details; Privacy points to the full Privacy page.

# 12. Gallery Wireframes

**Route:** `/wedding/gallery`

## 12A. Invitation-Launch Coming Soon State

```text
┌──────────────────────────────┐
│ SHARED STICKY HEADER         │
├──────────────────────────────┤
│ GALLERY                      │
├──────────────────────────────┤
│ COMING SOON                  │
│ [Decorative Sophie GIF]       │
│                              │
│ Friendly message explaining  │
│ that wedding photographs and │
│ videos will appear after the │
│ celebration and review       │
│ process.                     │
│                              │
│ [Return Home]                │
├──────────────────────────────┤
│ SHARED FOOTER                │
└──────────────────────────────┘
```

The launch state may include the approved decorative Sophie-cleaning GIF; post-wedding photograph/video publication remains deferred until after review.

---

## 12B. Post-Wedding Published State

```text
┌──────────────────────────────┐
│ SHARED STICKY HEADER         │
├──────────────────────────────┤
│ GALLERY                      │
│ Introductory text            │
├──────────────────────────────┤
│ ALBUM / CATEGORY FILTERS     │
│ [Ceremony] [Reception]       │
│ [Guests] [Video] ...         │
├──────────────────────────────┤
│ OPTIMIZED PREVIEWS           │
│ [Thumb] [Thumb]              │
│ [Thumb] [Thumb]              │
│ ... lazy loaded              │
├──────────────────────────────┤
│ SELECTED ITEM                │
│ [Larger optimized preview]   │
│ Caption / accessibility text │
│ [Previous] [Next]            │
├──────────────────────────────┤
│ APPROVED DOWNLOADS           │
│ [Full Resolution Download]   │
│ [Program / Archive Item]     │
├──────────────────────────────┤
│ SHARED FOOTER                │
└──────────────────────────────┘
```

---

# 13. Privacy Wireframe

**Route:** `/wedding/privacy`

This public informational page was added through the approved privacy decision and is revised through Phase 3 Step 14, the authorized attendance correction, and Decision 029. It preserves the finalized retention, historical contact-data safeguards, data minimization, named-invitee and attendee-detail boundaries, and security-limitation information order.

```text
┌──────────────────────────────┐
│ SHARED STICKY HEADER         │
├──────────────────────────────┤
│ RSVP PRIVACY                 │
│ Plain-language introduction  │
├──────────────────────────────┤
│ HOW INVITATION CODES WORK    │
│ Limited access token; code   │
│ retrieves only the blank     │
│ authorized form config.      │
│ Not a password.              │
│ No public directory/recovery │
├──────────────────────────────┤
│ INFORMATION COLLECTED        │
│ • Attendance / decline       │
│ • Named-invitee Yes/No       │
│   responses                  │
│ • Plus 1 responses, when     │
│   authorized                 │
│ • Grouped child Yes/No +     │
│   attending count, when      │
│   authorized                 │
│ • Four age-category totals   │
│ • Attendee names             │
│ • Reception dietary/allergy  │
│   information, if supplied   │
│ • Required guest email       │
│   confirmation destination   │
│ • Submission/revision record │
├──────────────────────────────┤
│ WHY INFORMATION IS USED      │
│ RSVP administration, event   │
│ planning, seating, dietary   │
│ accommodation, confirmation, │
│ and corrections              │
├──────────────────────────────┤
│ BLANK FORMS                  │
│ Prior answers/destinations   │
│ are not shown on lookup.     │
├──────────────────────────────┤
│ PARTIAL REVISIONS            │
│ Omitted applicable values    │
│ remain unchanged unless a    │
│ dependency/composition change│
│ clears or requires replacing │
│ them.                        │
├──────────────────────────────┤
│ EMAIL CONFIRMATIONS          │
│ New RSVPs and revisions      │
│ require a newly entered      │
│ confirmation email address.  │
│ Guest and protected admin    │
│ email attempts are separate. │
│                              │
│ HISTORICAL CONTACT DATA      │
│ Earlier mobile/SMS records,  │
│ if present, remain private.  │
│ No new SMS is sent and such  │
│ records are retired under    │
│ applicable safeguards.       │
├──────────────────────────────┤
│ STORAGE AND ACCESS           │
│ Private administrative       │
│ system; authorized access.   │
├──────────────────────────────┤
│ ATTENDEE + DIETARY DATA      │
│ Attendee names are private   │
│ RSVP information for every   │
│ attending RSVP. Dietary /    │
│ allergy text is collected    │
│ only when Reception applies. │
│ These values are limited to  │
│ the submitting party's own   │
│ confirmation surfaces and    │
│ protected admin records.     │
├──────────────────────────────┤
│ DATA-EXPOSURE SAFEGUARDS     │
│ No personalized RSVP data in │
│ URLs; transactional routes   │
│ not publicly indexed;        │
│ analytics/logs minimized.    │
├──────────────────────────────┤
│ RETENTION                    │
│ Active RSVP data retired by  │
│ July 30, 2027.               │
│ Protected backups expire by  │
│ August 29, 2027.             │
│ Non-identifying aggregates   │
│ may remain.                  │
├──────────────────────────────┤
│ SEPARATE INVITEES LIST       │
│ May remain private as a      │
│ personal planning/address    │
│ record outside active RSVP.  │
├──────────────────────────────┤
│ CORRECTIONS / ASSISTANCE     │
│ RSVPhelp@...                 │
├──────────────────────────────┤
│ SECURITY LIMITATION          │
│ Describe actual safeguards;  │
│ no absolute security claim.  │
├──────────────────────────────┤
│ [Return to RSVP]             │
├──────────────────────────────┤
│ SHARED FOOTER                │
└──────────────────────────────┘
```

### Step 14 Privacy-wireframe rules

- The Privacy page itself remains public and indexable.
- Explain that a successful invitation lookup returns only the validated party's limited safe named-invitee display data and authorized additional-guest prompts needed to render that party's blank form; do not publish the production invitation registry, source rows, opaque person/allocation IDs, allocation-type metadata, or another party's configuration.
- Explain that named-invitee, Plus 1, and grouped-child attendance responses are private RSVP information used to derive actual attendance.
- Explain in plain language that some invitations may include unnamed children as one family-level Yes/No question with a count when Yes; the form does not ask for those children's names in that grouped question.
- Explain that attendee names are collected later for every person actually attending, including Plus 1 guests and children represented by a grouped count, and that dietary/allergy information is collected only when Reception is selected.
- Explain that attendee names and any dietary/allergy text may appear in the submitting party's own confirmation surfaces and authorized private administrative records, but not public pages, public metadata, analytics, ordinary logs, unrelated administrative messages, or another party's response.
- The retention region must state the finalized July 30, 2027 active-data retirement date and August 29, 2027 protected-backup retirement deadline.
- The final prose must also explain the minimum-record exception for a concrete unresolved correction, dispute, delivery investigation, or comparable administrative need.
- Explain that a newly entered valid email address is required for every online RSVP and revision, and that the separate guest and protected administrative email attempts follow successful storage. No selectable guest confirmation method, SMS delivery option, confirmation mobile number, or transactional SMS authorization is presented.
- Explain that any historical mobile numbers, SMS authorization information, or delivery records remain protected administrative data pending controlled retirement; they are not used to send new text messages, automatically redirected to email, or reused for unrelated messages.
- The page may explain practical safeguards but must not reveal secrets, detailed internal security architecture, or make an absolute-security guarantee.

---

# 14. Wedding-Site Not Found Wireframe

**Canonical route:** `/wedding/not-found`  
**Also used for:** Any unmatched `/wedding/*` route

```text
┌──────────────────────────────┐
│ SHARED STICKY HEADER         │
├──────────────────────────────┤
│ PAGE NOT FOUND               │
│ "It looks like this page     │
│ wandered off somewhere."     │
│ Friendly recovery message    │
│                              │
│ Useful places to continue:   │
│ [Wedding Home]               │
│ [RSVP]                       │
│ [Venue & Directions]         │
│ [Day-Of Details]             │
│ [Frequently Asked Questions] │
├──────────────────────────────┤
│ SHARED FOOTER                │
└──────────────────────────────┘
```

No server, framework, filesystem, or routing details appear.

# Mobile Stacking Summary

## Public information pages

The default narrow-screen order is:

1. Skip link.
2. Sticky header.
3. Page heading.
4. Page introduction.
5. Primary or time-sensitive information.
6. Main content sections.
7. Contextual actions.
8. Assistance or disclaimer content.
9. Footer.

## RSVP entry

1. Header.
2. Page heading.
3. Deadline/countdown.
4. Entry instructions.
5. Code field.
6. Primary action.
7. Error/status region.
8. Printed alternative.
9. Privacy reassurance.
10. Assistance.
11. Footer.

## Personalized RSVP form

Shared narrow-screen order:

1. Header.
2. Party greeting.
3. Deadline/countdown.
4. Blank-form and revision instructions.
5. Coordinated Ceremony / Reception / decline checkboxes.
6. Named-invitee Yes/No attendance controls, repeated once per validated `namedInvitees` object.
7. Authorized additional-guest region only when one or more `additionalGuestAllocations` exist:
   - each Plus 1 allocation renders one Yes/No question;
   - an applicable grouped unnamed-children allocation renders one family Yes/No question;
   - after grouped-child Yes, render one required count selector from 1 through `maximumCount`.
8. Derived `overallAttendance` display based on named-invitee Yes + Plus 1 Yes + grouped child selected count.
9. Four coordinated age-category attendance dials whose sum must equal derived `overallAttendance`.
10. **Attendee Details** rows whenever `overallAttendance > 0`, repeated exactly once per attendee; every row contains **Attendee name**, and Reception-selected rows additionally contain **Dietary or allergy information**.
11. Required newly entered confirmation email address for every initial submission and revision; the guest method is fixed to email.
12. Notice that a successful revision replaces the previous guest confirmation destination with the new email address; the stored address is never prefilled.
13. Privacy information, including a link to the full Privacy page.
14. Validation summary.
15. Submit action.
16. Assistance.
17. Footer.

Named-invitee presentation rules:

- One Yes/No attendance decision is displayed for each named invitee returned by the validated invitation configuration.
- Mixed named-invitee attendance is permitted.
- A specifically named child uses the same named-invitee control.
- Opaque person ids are not shown to the guest.

Additional-guest allocation presentation rules:

- No authoritative allocation means no additional-guest region.
- Allocation rendering is driven by safe backend `kind`, `prompt`, and `maximumCount`.
- A Plus 1 allocation has `maximumCount: 1` and uses one Yes/No question.
- A grouped unnamed-children allocation uses exactly one family-level Yes/No question.
- Grouped child Yes reveals one required count selector containing whole numbers 1 through `maximumCount`.
- Grouped child No means count 0 and no selector remains applicable.
- There is no one-question-per-child rendering.
- There is no aggregate “How many additional guests?” control.
- Allocation-object count is not person capacity.
- Actual names for attending Plus 1 guests and unnamed children are collected only in **Attendee Details**.

Attendance-dial presentation rules:

- `overallAttendance` is derived as named-invitee Yes count + Plus 1 Yes count + grouped child attending count and is not independently editable.
- Adults 21+, Young Adults 18–20, Children 3–17, and Children under 3 are coordinated whole-number dials.
- Each increase action respects the number of derived attendees not yet assigned to the other three age categories.
- The complete age-category sum must equal derived `overallAttendance` exactly.

Attendee-detail presentation rules:

- Every attending RSVP produces exactly `overallAttendance` **Attendee Details** rows, including Ceremony-only attendance and each child represented by the grouped count.
- Each row always contains required **Attendee name**.
- When Reception is selected, each row additionally contains optional **Dietary or allergy information**.
- Removing Reception while remaining Ceremony-only preserves attendee names and removes dietary/allergy values.
- Any grouped child response/count change requires complete attendee-detail replacement.
- Other attending-person composition changes likewise require complete replacement even when numerical headcount is unchanged.

## RSVP confirmation

1. Header.
2. Success or warning heading.
3. Initial/revision label.
4. Complete current event attendance or decline state.
5. Named-invitee Yes/No responses when attending.
6. Authorized additional-guest responses only when that invitation actually has allocations, including Plus 1 Yes/No and grouped child Yes/No plus selected count when Yes.
7. Four age-category totals and derived `overallAttendance` when attending.
8. Attendee names whenever attending; per-attendee dietary/allergy information only when Reception is selected.
9. Timestamp.
10. Fixed guest confirmation method: email.
11. Guest delivery status.
12. Limited administrative-attempt status without the private address.
13. Revision instructions covering omission, replacement, explicit zero where applicable, dependency clearing, exact age-total reconciliation, and complete Attendee Details replacement when attending-person composition changes, including any grouped child response/count change.
14. Deadline.
15. Assistance.
16. Footer.

The confirmation omits genuinely inapplicable conditional regions. It does not insert disabled, `N/A`, or “not applicable” rows merely because an invitation has no `additionalGuestAllocations` or because Reception-specific dietary information does not apply.

## Confirmation Refresh Fallback

1. Header.
2. “Confirmation Summary No Longer Available” heading.
3. Primary explanation that the temporary summary is unavailable and that, if an RSVP was submitted, it may already have been recorded.
4. Instruction to check the guest confirmation email inbox.
5. Explicit warning not to submit the same response again solely because the summary is unavailable.
6. Deliberate-revision guidance directing the guest back to manual RSVP entry.
7. `Return to RSVP` action.
8. Assistance explanation with `RSVPhelp@loreweavercreations.com`.
9. `Contact for Help` action.
10. Footer.

The fallback contains no RSVP summary, invitation code, confirmation destination, submission identifier, recovery token, or hidden reconstruction control. It does not automatically perform lookup, replay a submission, or redirect the guest before the explanation can be read.

## Confirmed event-information pages

1. Header.
2. Page heading.
3. Confirmed Sphinx-only event information.
4. Venue, Day-Of Details, or Travel content.
5. Broad reception description where applicable.
6. Contextual links and same-page jump navigation where applicable.
7. Footer.

No event-information mobile stack inserts a second venue, between-venue travel period, formal cocktail hour, formal dinner, fixed dancing block, or invented minute-by-minute reception schedule.

---

# Phase 2 Step 6 Completion Review

The low-fidelity wireframes are complete when:

- Home is represented.
- RSVP entry is represented.
- Personalized RSVP is represented.
- RSVP confirmation is represented.
- Theme & Attire is represented.
- Read, Listen & Watch is represented.
- Venue is represented.
- Travel is represented.
- Day-Of Details is represented.
- FAQ is represented.
- Gallery is represented.
- The approved Our Story, Privacy, and Not Found routes are represented.
- Every wireframe shows a header.
- Every ordinary page shows navigation or access to the menu.
- Every page has a page heading.
- Main sections are ordered.
- Primary buttons are placed.
- Form placement is shown.
- Every page includes a footer.
- Mobile stacking order is documented.
- Home, Venue, Travel, Day-Of Details, and FAQ consistently present the confirmed Sphinx-only wedding format.
- The former Warinanco/dual-venue configuration is retired from guest-facing wireframes.
- Day-Of Details replaces the former Schedule page and uses `/wedding/day-of`.
- Day-Of Details includes The Schedule, The Menu, Dietary Needs, Gift Policy, and Explore/Jump-To navigation.
- FAQ uses the approved warm guest-facing questions and links each answer to its corresponding in-depth page where one exists.
- Our Story and Read, Listen & Watch include their approved Explore/Jump-To navigation.
- Footer navigation is Home, RSVP, FAQ, and Privacy.
- Not Found provides Home, RSVP, Venue, Day-Of Details, and FAQ recovery routes.
- The header includes the opt-in Music toggle, default Off.
- Route changes may use the approved floating Loading overlay while destination media prepares.
- No formal cocktail-hour or formal-dinner block appears.
- Exact times for flexible reception activities are excluded.
- RSVP countdown behavior is represented before and during the final month.
- Manual invitation-code entry is the sole RSVP access method.
- No code-bearing personalized URL appears.
- Personalized forms load blank and do not display stored RSVP answers or confirmation destinations.
- One reusable spreadsheet-authoritative substantive form is represented; no active default/reduced production-profile selector remains.
- A party with no `additionalGuestAllocations` has no additional-guest question.
- Every authorized Plus 1 allocation produces one independent backend-prompted Yes/No question.
- Every applicable unnamed-children allocation produces one grouped family-level Yes/No question rather than one question per child.
- Grouped child Yes reveals one required count selector from 1 through `maximumCount`; No means count 0.
- Allocation-object count is not treated as person capacity.
- Every validated attending form shows one named-invitee Yes/No control per authorized named invitee, and mixed named-invitee attendance is supported.
- A specifically named child remains a named-invitee control and is not duplicated as an unnamed-child allocation.
- `overallAttendance` is displayed as named-invitee Yes count + Plus 1 Yes count + grouped unnamed-child attending count rather than as an independently selected number.
- Four coordinated age-category dials classify the derived attending party and must sum exactly to `overallAttendance`.
- Every attending RSVP, including Ceremony-only attendance, produces exactly one Attendee Details row per `overallAttendance`; every row requires attendee name.
- Reception selection adds the optional **Dietary or allergy information** field to each attendee row rather than controlling whether attendee rows exist.
- Partial revision behavior distinguishes omission, replacement, explicit zero, attendance/decline changes, dependency clearing, exact age-total reconciliation, and complete Attendee Details replacement whenever attending-person composition changes, including same-count swaps and every grouped child response/count change.
- A newly entered valid guest confirmation email address is required for every initial submission and revision; email is fixed and no channel selector, mobile-number input, or SMS authorization is offered.
- After a successful revision, the new email address replaces the previous guest confirmation destination without displaying or prefilling the stored address.
- Submission-in-progress, validation-failure, submission-uncertain, service-unavailable, closed-RSVP, and refresh-without-state branches are represented.
- Safe retry behavior preserves the client submission identifier and remains idempotent.
- Guest and administrative confirmation attempts are represented as independent post-storage attempts.
- Confirmation screens show initial-versus-revision status, timestamp, the fixed email guest method, guest delivery-attempt status, and limited administrative-attempt status without exposing the private address.
- Confirmation summaries show the complete resulting RSVP and omit conditional regions that are genuinely inapplicable.
- Guest-delivery and administrative-delivery warning variants are represented.
- Final decorative styling has not been selected.
- No implementation code is required to understand the layouts.

---

# Phase 3 Step 10 Synchronization Review

Phase 3 Step 10 is reflected in these wireframes when all of the following are true:

- The thirteen formal RSVP interface states map to the RSVP layouts listed in the Step 10 state map.
- Entry Ready has separate pre-countdown and final-month presentation variants without becoming two top-level states.
- Looking Up Invitation announces progress and prevents repeated lookup requests.
- Invalid Invitation uses neutral wording and reveals no private invitation information.
- Service Unavailable is visually distinct from Submission Uncertain and never claims storage without proof.
- Validated Blank Form remains blank and supports the validated party's safe named-invitee roster, Plus 1 controls, and grouped child Yes/No-plus-count variation without revealing stored answers.
- Validation Failure preserves current page-entered values and makes errors accessible, including grouped child count errors.
- Submitting prevents duplicate activation and does not display success before backend-confirmed storage.
- Submission Uncertain warns against blind resubmission and supports an idempotent safe retry using the original logical request.
- Confirmed Initial Submission and Confirmed Revision display the complete current RSVP under the spreadsheet-authoritative model, including grouped child attending count when applicable.
- Stored with Delivery Warning preserves an explicit successful-storage message and does not instruct RSVP resubmission merely because delivery failed or remains uncertain.
- Confirmation Refresh Fallback avoids sensitive URL state and uses uncertainty-safe recovery guidance.
- RSVP Closed removes editable RSVP controls at the deadline without contradicting an already established successful confirmation.
- Progress, validation, warning, uncertainty, success, and closed states remain usable by keyboard, touch, and assistive technology.
- No Step 10 state introduces a code-bearing personalized browser route.

---

# Phase 3 Step 13 Synchronization Review

Phase 3 Step 13 is reflected in these wireframes when all of the following are true:

- The existing thirteen-state Step 10 model remains unchanged.
- States 9–11 continue to use `/wedding/rsvp/confirmation` only when a structurally usable temporary successful-submission response is available.
- A browser refresh or history action does not automatically force State 12 when usable successful state remains available.
- State 12 is entered whenever the confirmation route lacks a structurally usable temporary successful response, regardless of whether the cause was refresh, direct navigation, bookmark/new-tab access, history traversal, or other temporary-state loss.
- The finalized State 12 heading is “Confirmation Summary No Longer Available.”
- The finalized primary explanation states that the temporary summary is unavailable, that a submitted RSVP may already have been recorded, that the guest should check the confirmation email inbox, and that the same response should not be submitted again solely because the summary is unavailable.
- The fallback tells a guest making a deliberate revision to return to the RSVP page and enter the invitation code again.
- The fallback provides `RSVPhelp@loreweavercreations.com` when the guest is uncertain or needs help.
- `Return to RSVP` starts an ordinary manual-entry interaction at `/wedding/rsvp/`; it is not an automatic recovery replay and does not bypass the authoritative deadline.
- State 12 does not automatically perform lookup or submission, create a new `clientSubmissionId`, silently reuse an earlier identifier, or retrieve a saved RSVP through an undocumented public endpoint.
- The initial implementation does not require a short-lived confirmation token, public confirmation-recovery endpoint, public saved-RSVP endpoint, code-bearing confirmation URL, or intentional persistent browser storage solely to make the confirmation survive refresh.
- The fallback does not infer success or failure from the route or from missing temporary state.
- The fallback does not expose an invitation code, RSVP summary, confirmation destination, protected administrative address, provider internals, or other private RSVP content through the URL or visible recovery controls.
- The fallback uses explicit text, accessible focus or announcement behavior, keyboard/touch-operable actions, unobscured focus, reduced-motion compatibility, and no timed automatic redirect.
- `rsvp-system-design.md`, `rsvp-api-contract.md`, and `page-outlines.md` describe the same finalized State 12 lifecycle and visible behavior.
- `rsvp-test-cases.md` treats the Step 13 confirmation-refresh cases as finalized and uses the same fallback lifecycle.
- At the time the Step 13 wireframe synchronization was completed, cache-control, logging, rate-limit, credential, retention, and broader privacy/security details remained assigned to Step 14. Those rules are now finalized and reflected below.

Phase 3 Step 14 is now synchronized into these wireframes; the final cross-document consistency review remains the next approved working-sequence step.

---

# Phase 3 Step 14 Synchronization Review

Phase 3 Step 14 is reflected in these wireframes when:

- The thirteen-state Step 10 model and finalized Step 13 confirmation-refresh behavior remain unchanged.
- RSVP and confirmation layouts are treated as non-indexed, no-store transactional experiences without adding a visible cache-control UI.
- Temporary successful confirmation data is not intentionally promoted to persistent browser storage solely for refresh recovery.
- Wireframes never place invitation codes, RSVP summaries, confirmation destinations, `clientSubmissionId`, private versions, or provider payloads into browser URLs or recovery controls.
- Analytics, when used, are non-personalized and do not become a dependency of the RSVP interaction.
- Guest email is the only approved confirmation method and is fixed in every initial/revision form; every submission requires a newly entered valid email destination, with no channel selector, Text Message option, mobile confirmation field, or SMS authorization.
- Guest and protected administrative email attempts occur independently after successful storage. Historical SMS contact/authorization/delivery records remain private pending controlled retirement and do not authorize future SMS activation.
- The Privacy wireframe includes invitation-code limits, safe named-invitee and additional-guest lookup data, authorized attendance responses, data collected and used, blank forms, partial revisions, confirmation-channel treatment, private storage/access, all-attendance attendee-name and Reception-specific dietary/allergy boundaries, data-exposure safeguards, retention, the separate private `Invitees List`, assistance, and the security limitation.
- The Privacy wireframe identifies July 30, 2027 as the active RSVP-data retirement date and August 29, 2027 as the protected-backup retirement deadline.
- The final Privacy-page prose may explain a minimum-record documented retention exception without turning that exception into a general indefinite-retention rule.
- `rsvp-system-design.md`, `rsvp-api-contract.md`, `rsvp-test-cases.md`, `page-outlines.md`, and this file describe the same Step 14 browser-facing consequences.
- The synchronized governing documents must continue to describe the same spreadsheet-authoritative RSVP model as implementation proceeds.

With these constraints recorded, `wireframes.md` preserves the finalized Phase 3 Step 14 state/privacy architecture, the approved authorized-attendance correction, and the November 1, 2026 Workstream 4 public-content lock.
