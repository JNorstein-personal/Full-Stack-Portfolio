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
- Invitation-specific safe named-invitee rosters and zero-, one-, and multiple-named-`Plus1` allocation variants.
- Explicit person-level attendance decisions for named invitees and authorized Plus 1 slots.
- Backend-derived `overallAttendance`, age-category totals that must equal that derived count, and all-attendance `Attendee Details` repetition.
- Reception-specific dietary/allergy fields within otherwise universal attendee-detail rows.
- Active-event configuration variants.
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

The RSVP states and behaviors shown here are synchronized through Phase 3 Step 14 with `docs/rsvp-system-design.md`, `docs/rsvp-api-contract.md`, `docs/page-outlines.md`, and `docs/rsvp-test-cases.md`. These wireframes continue to define browser-facing information order and layout rather than backend implementation or API payload structure. The Step 10 state names remain conceptual interface states; Phase 3 Step 13 finalizes the lifecycle, visible copy, recovery actions, and accessibility responsibilities of State 12 — Confirmation Refresh Fallback without creating a new browser route or recovery API. Phase 3 Step 14 preserves those layouts while finalizing the visible Privacy-page information architecture, conditional production availability of Text Message confirmation, and the browser-facing no-index/no-store/data-minimization boundaries.

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
- `{ Configuration A }` and `{ Configuration B }` identify mutually exclusive event states.
- `{ Authorized named invitees }` identifies a region repeated once for each safe named invitee returned by the validated invitation configuration.
- `{ Authorized Plus1 allocations }` identifies a conditional region that exists only when the validated invitation configuration contains one or more named `Plus1` allocations derived from the authoritative spreadsheet.
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

Countdown visibility, invitation-specific named-invitee and named-`Plus1` variants, all-attendance `Attendee Details` repetition, Reception-specific dietary/allergy fields, guest-versus-administrative delivery warnings, and responsive layouts are presentation variants inside these states rather than additional top-level states.

The interface must render only one top-level RSVP state at a time. A state transition may preserve local draft information when needed for validation correction or idempotent retry, but it must never expose invitation codes, stored answers, or confirmation destinations through a browser URL.

## Step 14 browser-facing privacy/security conventions

- `/wedding/rsvp/` and `/wedding/rsvp/confirmation` are transactional, non-indexed routes and their production responses use `Cache-Control: no-store, max-age=0`.
- Successful confirmation data is not intentionally persisted in browser storage solely so that it can be reconstructed after temporary Step 13 state is lost.
- Any analytics associated with RSVP/confirmation layouts is non-personalized and must not contain invitation codes, guest/party identities derived from invitation records, RSVP answers, attendee names, dietary/allergy information, confirmation destinations, `clientSubmissionId`, named-`Plus1` allocation details, versions, or provider payloads.
- Every wireframe that shows a **Text message** confirmation choice represents a configuration-dependent variant. In production, omit that choice unless the selected SMS provider, required disclosure/authorization copy, backend-only credentials/sender configuration, and production-flow testing satisfy the finalized Step 14 enablement gate.
- If Text Message confirmation is not enabled, the confirmation-method region presents Email without leaving a disabled or misleading provider-dependent choice.
- Invitation-code, error, warning, fallback, and help layouts must not expose internal security architecture, workbook details, provider secrets, protected administrative addresses, or close-match invitation information.


---

# Shared Mobile Page Shell

```text
┌──────────────────────────────┐
│ [Skip to main content]       │
├──────────────────────────────┤
│ SITE BRAND / COUPLE NAMES    │
│ [Menu]              [RSVP]   │  ← compact sticky header
├──────────────────────────────┤
│ {Expanded mobile menu}       │
│ Home                         │
│ RSVP                         │
│ Theme and Attire             │
│ Our Story                    │
│ Read, Listen, and Watch      │
│ Venues                       │
│ Travel                       │
│ Schedule                     │
│ FAQ                          │
│ Gallery                      │
│ Privacy                      │
│ [Close menu]                 │
├──────────────────────────────┤
│ MAIN CONTENT                 │
│                              │
│ Page-specific sections       │
│                              │
├──────────────────────────────┤
│ FOOTER                       │
│ [Home] [RSVP] [Privacy]      │
│ RSVP assistance              │
│ Ownership/copyright notice   │
└──────────────────────────────┘
```

## Shared mobile behavior

1. The header remains sticky while scrolling.
2. The sticky header must not cover headings, fields, errors, or focused controls.
3. The mobile menu is clearly labeled.
4. The menu closes after a destination is selected.
5. RSVP remains prominent whether the menu is open or closed.
6. Internal wedding-site links open in the same tab.
7. External media, hotel, and map links open in a new tab and are identified as such.
8. The content begins below the sticky header.
9. The footer follows the final page section.
10. All controls remain keyboard- and touch-operable.

## Wider-screen adaptation

At tablet and desktop widths:

```text
┌────────────────────────────────────────────────────────────────────┐
│ BRAND  Home RSVP Theme Story Read/Listen/Watch Venues Travel ...  │
│                                                       [RSVP]       │
├────────────────────────────────────────────────────────────────────┤
│ MAIN CONTENT                                                       │
├────────────────────────────────────────────────────────────────────┤
│ FOOTER                                                             │
└────────────────────────────────────────────────────────────────────┘
```

- The approved navigation remains in the same logical order.
- Content may use columns where doing so improves comprehension.
- Reading order remains meaningful when columns collapse to mobile.
- The RSVP action remains visually prominent.
- The page must not require hover to reveal essential content.

## Shared event-schedule and reception policy

All event-dependent wireframes must follow the approved public-schedule model:

- Show confirmed outer event blocks rather than a detailed internal reception run-of-show.
- Configuration A uses:
  - Ceremony at Warinanco Park from 10:30 a.m. to 12:00 p.m.
  - Guest travel between venues from 12:00 p.m. to 12:30 p.m.
  - Reception at Sphinx from 12:30 p.m. to 4:30 p.m.
- Configuration B uses one combined ceremony-and-reception event block at Sphinx from 11:30 a.m. to 4:30 p.m.
- Do not invent a separate ceremony-ending or reception-starting time for Configuration B.
- There is no separately scheduled formal cocktail hour.
- There is no separately scheduled formal dinner service.
- Buffet-style brunch remains available throughout the reception portion of the event.
- Dancing and other festivities may occur at various intervals during the reception.
- Do not assign exact public times to dancing, toasts, speeches, cake service, photographs, buffet activity, or other flexible internal events.
- The possible self-service mimosa station remains absent from guest-facing wireframes unless the couple and Sphinx Banquet and Catering Center later confirm it.

---

# 1. Home Wireframes

**Route:** `/wedding/`

## 1A. Home — Configuration A

**Active configuration:** Warinanco Park ceremony and Sphinx reception.

```text
┌──────────────────────────────┐
│ SHARED STICKY HEADER         │
├──────────────────────────────┤
│ HERO / INTRO REGION          │
│                              │
│ [Optional approved artwork]  │
│                              │
│ COUPLE'S NAMES               │
│ Saturday, May 1, 2027        │
│ Roselle, New Jersey          │
│                              │
│ Brief welcome message        │
│                              │
│ [RSVP]                       │
├──────────────────────────────┤
│ QUICK PLANNING LINKS         │
│ [Theme and Attire]           │
│ [Venues]                     │
│ [Travel]                     │
├──────────────────────────────┤
│ ACTIVE EVENT SUMMARY         │
│                              │
│ Ceremony                     │
│ Warinanco Park               │
│ 10:30 a.m.–12:00 p.m.        │
│                              │
│ Reception                    │
│ Sphinx Banquet Center        │
│ 12:30 p.m.–4:30 p.m.         │
│                              │
│ Buffet brunch, dancing, and  │
│ other festivities take place │
│ during the reception.        │
│                              │
│ [View Venues]                │
│ [View Schedule]              │
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

### Configuration A rules

- Show only the Warinanco/Sphinx combination.
- Do not display the Sphinx-only 11:30 a.m. start time.
- Keep reception wording broad.
- Do not add a cocktail-hour, formal-dinner, dancing-period, or mimosa-station block.
- Venue and Schedule links read from the same active configuration.

---

## 1B. Home — Configuration B

**Active configuration:** Ceremony and reception entirely at Sphinx.

```text
┌──────────────────────────────┐
│ SHARED STICKY HEADER         │
├──────────────────────────────┤
│ HERO / INTRO REGION          │
│                              │
│ [Optional approved artwork]  │
│                              │
│ COUPLE'S NAMES               │
│ Saturday, May 1, 2027        │
│ Roselle, New Jersey          │
│                              │
│ Brief welcome message        │
│                              │
│ [RSVP]                       │
├──────────────────────────────┤
│ QUICK PLANNING LINKS         │
│ [Theme and Attire]           │
│ [Venues]                     │
│ [Travel]                     │
├──────────────────────────────┤
│ ACTIVE EVENT SUMMARY         │
│                              │
│ Ceremony and Reception       │
│ Sphinx Banquet Center        │
│ 11:30 a.m.–4:30 p.m.         │
│                              │
│ Buffet brunch, dancing, and  │
│ other festivities take place │
│ during the reception portion.│
│                              │
│ [View Venue]                 │
│ [View Schedule]              │
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

### Configuration B rules

- Show only the Sphinx-only event.
- Do not display Warinanco Park as a current venue.
- Do not display the Configuration A travel interval.
- Do not split the 11:30 a.m.–4:30 p.m. event into invented ceremony and reception times.
- Keep reception wording broad.
- Do not add a cocktail-hour, formal-dinner, fixed dancing, or mimosa-station block.

---

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

The form remains on the canonical RSVP route. Invitation codes, private source-row identifiers, named-invitee identifiers, named-`Plus1` allocation identifiers, and other private configuration values do not appear in the URL.

Every validated invitation uses the same reusable substantive RSVP structure. Invitation-specific variation is limited to information authorized by the validated private configuration, principally:

- Singular or plural first-person wording.
- `maximumAttendance` derived from `Total Potential Attendees` as the maximum potential size of the invited party.
- A safe `namedInvitees` roster containing only stable opaque IDs and approved display names for the named invitees associated with that invitation.
- Zero or more named-`Plus1` allocation prompts derived from Column E of the authoritative `Invitees List` spreadsheet.

The validated configuration must reconcile so that the number of named invitees plus the number of authorized Plus 1 slots equals `maximumAttendance`. The browser must never use `maximumAttendance` as an independently selectable headcount.

When Ceremony, Reception, or both are selected, the guest records an explicit Yes/No attendance decision for every authorized named invitee and every authorized Plus 1 slot. `overallAttendance` is then derived from the number of Yes responses across those person-level decisions. The four age-category dials classify that already-derived attending party and must sum exactly to `overallAttendance`.

Whenever `overallAttendance` is greater than zero, the page renders exactly one **Attendee Details** row per attending person. Every row always requires **Attendee name**. When Reception is selected, each row additionally displays **Dietary or allergy information**; that field remains optional and is absent when Reception is not selected.

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
│ Revision: re-enter the       │
│ confirmation method and      │
│ destination, then provide    │
│ only the RSVP changes you    │
│ intend to make.              │
│                              │
│ Omitted applicable RSVP      │
│ fields remain unchanged      │
│ unless a controlling change  │
│ makes them inapplicable or   │
│ requires complete replacement│
│ of a dependent structure.    │
│                              │
│ New confirmation fields      │
│ replace their stored         │
│ counterparts.                │
├──────────────────────────────┤
│ PERSONALIZED FORM            │
│ One reusable form; named     │
│ invitees and authorized Plus1│
│ prompts vary by invitation.  │
└──────────────────────────────┘
```

The interface may display only the validated party greeting, the approved named-invitee display names required for person-level attendance decisions, and the named invitee text necessary for authorized `Plus1` prompts. It must not expose the production invitation code, another party's configuration, private spreadsheet notes, source-row information, or internal opaque identifiers.

## 3B. Shared Event Attendance and Decline Region

```text
┌──────────────────────────────┐
│ ATTENDANCE                   │
│                              │
│ {Singular wording}           │
│ [ ] I will attend Ceremony   │
│ [ ] I will attend Reception  │
│ [ ] Regretfully, I am unable │
│     to attend.               │
│                              │
│ {Plural wording}             │
│ [ ] We will attend Ceremony  │
│ [ ] We will attend Reception │
│ [ ] Regretfully, we are      │
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

Selecting the decline checkbox clears Ceremony and Reception on the page. Selecting either attending checkbox clears decline. The backend independently enforces the same mutually exclusive resulting states. Selecting an attending event does not itself determine how many people attend; the person-level Yes/No decisions below determine actual headcount.

## 3C. Person-Level Attendance Decisions

This region appears only when the resulting event-attendance state includes Ceremony, Reception, or both. A complete full decline makes all person-level attendance decisions inapplicable and clears them.

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
- The visible label uses only the approved `displayName`; the stable opaque `id` remains an authorization key rather than visible copy.
- Mixed household attendance is permitted: one named invitee may answer Yes while another answers No.
- On an initial attending RSVP, or after changing from full decline to attendance, every authorized named invitee requires an explicit Yes/No response.
- On an ordinary revision that remains attending, an omitted named-invitee response means leave that stored response unchanged.

### Authorized named `Plus1` allocations

#### No authorized `Plus1`

```text
┌──────────────────────────────┐
│ {NO PLUS1 REGION RENDERED}   │
└──────────────────────────────┘
```

When the validated invitation configuration contains no Column E `Plus1` allocation, no Plus 1 heading, question, placeholder, disabled control, or “not applicable” row appears.

#### One authorized `Plus1`

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

#### Multiple authorized `Plus1` allocations

```text
┌──────────────────────────────┐
│ AUTHORIZED PLUS 1 GUESTS     │
│                              │
│ Will [Named Invitee A] be    │
│ accompanied by a +1?         │
│ ( ) Yes          ( ) No      │
│                              │
│ Will [Named Invitee B] be    │
│ accompanied by a +1?         │
│ ( ) Yes          ( ) No      │
│                              │
│ ...repeat once per authorized│
│ Column E allocation only...  │
└──────────────────────────────┘
```

Plus-1 rules:

- Every authorized Column E allocation becomes its own Yes/No prompt.
- No generic “How many additional guests?” control exists.
- No Plus 1 prompt is rendered for a named invitee without an authoritative Column E allocation.
- The prompt does not request the Plus 1's own name. If that authorized slot is answered Yes, the additional guest contributes one person to derived `overallAttendance`; their name is supplied later through the ordinary **Attendee Details** rows used for every attendee.
- On an initial attending RSVP, or after changing from full decline to attendance, every authorized Plus 1 allocation requires an explicit Yes/No response.

Derived-headcount rule:

`overallAttendance = count(named-invitee Yes responses) + count(authorized Plus 1 Yes responses)`

The browser may display this derived value for usability, but it is not independently editable and is not an alternative guest-count control. If an attending event is selected but every authorized person/slot is answered No, the form is invalid because an attending RSVP must contain at least one attendee.

## 3D. Coordinated Attendance Dials

```text
┌──────────────────────────────┐
│ ATTENDING PARTY BY AGE       │
│ To help us plan seating and  │
│ dietary needs, classify the  │
│ attending party by age.      │
│                              │
│ Derived attendees: [#]       │
│ Maximum potential party: [#] │
│                              │
│ Adults, ages 21+             │
│ [−]        0        [+]      │
│                              │
│ Young Adults, ages 18–20     │
│ [−]        0        [+]      │
│                              │
│ Children, ages 3–17          │
│ [−]        0        [+]      │
│                              │
│ Children under 3             │
│ [−]        0        [+]      │
│                              │
│ Age-category total: [#]      │
│ Must equal attendees: [#]    │
│                              │
│ Each [+] is bounded by the   │
│ remaining unclassified       │
│ derived attendees.           │
├──────────────────────────────┤
│ {Revision}                   │
│ Leave a dial untouched to    │
│ keep that stored category.   │
│ Setting a dial to 0 is an    │
│ explicit replacement value.  │
└──────────────────────────────┘
```

Dial rules:

- Every dial uses a nonnegative whole number.
- `overallAttendance` is derived from person-level attendance decisions before the age totals are validated.
- The complete resulting four-dial sum must equal `overallAttendance` exactly; it is not sufficient merely to remain at or below `maximumAttendance`.
- Each dial's available increase is constrained by `overallAttendance` minus the values currently assigned to the other three age categories.
- The dials classify the attending party; they do not create or remove attendees.
- The browser does not infer an age category from a named invitee or from a Plus 1 response.
- If a revision changes person-level attendance so that the existing merged age totals no longer equal newly derived `overallAttendance`, the guest must revise the affected age totals before submission can succeed.
- Full decline makes the attendance dials inapplicable and clears their resulting stored values.

## 3E. Attendee Details

This region appears whenever derived `overallAttendance` is greater than zero, including Ceremony-only attendance.

```text
┌──────────────────────────────┐
│ {ATTENDING PARTY}            │
│ ATTENDEE DETAILS             │
│                              │
│ Please provide one entry for │
│ each person attending.       │
│                              │
│ Attendee 1                   │
│ Attendee name *              │
│ [________________________]   │
│                              │
│ {Reception selected}         │
│ Dietary or allergy           │
│ information                  │
│ [________________________]   │
│ [________________________]   │
│                              │
│ Attendee 2                   │
│ Attendee name *              │
│ [________________________]   │
│                              │
│ {Reception selected}         │
│ Dietary or allergy           │
│ information                  │
│ [________________________]   │
│ [________________________]   │
│                              │
│ ...repeat until row count    │
│ equals overallAttendance...  │
└──────────────────────────────┘
```

Attendee-detail rules:

- The number of rows equals complete derived `overallAttendance` for every attending RSVP.
- Every row requires **Attendee name**, limited to 100 characters.
- When Reception is selected, every row additionally displays **Dietary or allergy information**, limited to 1000 characters and optional even though the visible label does not include `(optional)`.
- Ceremony-only attendance still displays the same attendee-name rows, but the dietary/allergy field is absent.
- There is no single party-level dietary field.
- A full decline clears the entire `attendeeDetails` structure.
- Removing Reception while remaining Ceremony-only preserves the attendee-detail rows and attendee names but clears/removes dietary/allergy values.
- Adding Reception without changing who is attending does not require attendee names to be re-entered solely because dietary/allergy fields become available; those dietary fields are optional.
- If any named-invitee or authorized Plus 1 Yes/No decision changes which people are attending, the complete attendee-detail list must be replaced, even when `overallAttendance` remains numerically unchanged.
- If the attending-person composition is unchanged, an omitted attendee-detail list on revision may remain stored unchanged under the backend patch rules.
- The page remains blank on a later lookup; stored attendee names and dietary/allergy responses are never prefilled.

## 3F. Confirmation Method and Submission Region

```text
┌──────────────────────────────┐
│ CONFIRMATION METHOD          │
│ Required for every initial   │
│ submission and revision.     │
│                              │
│ ( ) Email                    │
│     Email address            │
│     [____________________]   │
│                              │
│ {Text Message enabled}       │
│ ( ) Text message             │
│     SMS-capable mobile       │
│     [____________________]   │
│     [ ] Required verified    │
│         transactional SMS    │
│         authorization copy   │
│                              │
│ New operational values       │
│ replace stored counterparts. │
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
│ Privacy / authorization      │
│ Assistance                   │
└──────────────────────────────┘
```

Text Message controls are omitted—not merely disabled—when the production SMS gate is not satisfied.

## 3G. State 6 — Validation Failure

```text
┌──────────────────────────────┐
│ PLEASE REVIEW YOUR RSVP      │
│                              │
│ [Accessible error summary]   │
│ • Attendance choice needed   │
│ • Named invitee response     │
│   missing / invalid          │
│ • Authorized Plus1 response  │
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
│ Check the confirmation       │
│ channel you selected.        │
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

The summary follows the single spreadsheet-authoritative person-level RSVP model. It includes the applicable event-attendance state, named-invitee responses, authorized Plus 1 responses, age-category totals, derived `overallAttendance`, and `Attendee Details`. Dietary/allergy information appears only when Reception is part of the complete current RSVP. Conditional regions that genuinely do not apply are omitted rather than rendered as disabled or `N/A` placeholders.

## 4A. State 9 — Confirmed Initial Submission — No Authorized `Plus1`

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

No empty Plus 1 region is displayed merely to indicate that the invitation did not authorize one.

## 4B. State 9 — Confirmed Initial Submission — Authorized Named `Plus1`

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
│ AUTHORIZED PLUS 1 RESPONSES  │
│ [Invitee A] +1: Yes          │
│ [Invitee B] +1: Yes          │
│                              │
│ PARTY TOTALS                 │
│ Adults 21+ ............ 3    │
│ Young Adults 18–20 .... 0    │
│ Children 3–17 ......... 0    │
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
│ [Timestamp / delivery status]│
└──────────────────────────────┘
```

The confirmation identifies named-invitee and authorized named-`Plus1` responses using guest-facing labels but does not expose internal person/allocation IDs.

For a Ceremony-only confirmation, the **Attendee Details** list is still present and contains the attendee names, but dietary/allergy lines are omitted.

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
│ {Authorized Plus1 responses} │
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
│ Confirmation: [method]       │
│ Guest delivery: [status]     │
│ Admin attempt: [status only] │
├──────────────────────────────┤
│ [Return to RSVP]             │
├──────────────────────────────┤
│ SHARED FOOTER                │
└──────────────────────────────┘
```

If a revision removes Reception while retaining Ceremony attendance, the summary keeps **Attendee Details** and attendee names but omits dietary/allergy values. If the resulting RSVP fully declines, the summary omits named-invitee responses, Plus 1 responses, attendance totals, and Attendee Details because the authoritative result contains zero attendees.

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
│ The selected email/text      │
│ confirmation could not be    │
│ delivered or confirmed.      │
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
│ the email or text message    │
│ you selected for             │
│ confirmation. Do not submit  │
│ the same response again only │
│ because this summary is      │
│ unavailable.                 │
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

The visible copy above is the finalized Phase 3 Step 13 guest-facing fallback copy. Implementation may make minor punctuation or responsive line-wrap adjustments, but it must preserve the substantive meaning.

### State 12 information-order rules

1. Shared sticky header.
2. Fallback heading.
3. Primary uncertainty-safe explanation.
4. Instruction to check the selected email or text-message confirmation.
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

The preceding RSVP wireframes must be connected according to these browser-facing transition rules. Phase 3 Step 13 refines only the confirmation-state lifecycle and State 12 recovery behavior. Phase 3 Step 14 adds privacy/security constraints and the SMS production gate but does not add another top-level RSVP state:

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

# 5. Theme and Attire Wireframe

**Route:** `/wedding/theme`

```text
┌──────────────────────────────┐
│ SHARED STICKY HEADER         │
├──────────────────────────────┤
│ THEME AND ATTIRE             │
│ Brief introductory statement │
├──────────────────────────────┤
│ WEDDING AESTHETIC            │
│ Concise theme description    │
├──────────────────────────────┤
│ VINTAGE GARDEN FORMAL        │
│ Plain-language dress-code    │
│ explanation                  │
├──────────────────────────────┤
│ COLOR PALETTE                │
│ [Color swatches / labels]    │
│ [Download or expand details] │
├──────────────────────────────┤
│ OUTFIT INSPIRATION           │
│ [Image]                      │
│ Suggestion text              │
│ ...                          │
├──────────────────────────────┤
│ HATS AND ACCESSORIES         │
├──────────────────────────────┤
│ COSTUMES / ANACHRONISM       │
├──────────────────────────────┤
│ GENDER-NEUTRAL GUIDANCE      │
├──────────────────────────────┤
│ WEDDING-PARTY GUIDES         │
│ [Guide download]             │
│ [Guide download]             │
│ ...                          │
├──────────────────────────────┤
│ INSPIRATION DISCLAIMER       │
│ Suggestions are not          │
│ mandatory.                   │
├──────────────────────────────┤
│ [RSVP]                       │
├──────────────────────────────┤
│ SHARED FOOTER                │
└──────────────────────────────┘
```

---

# 6. Our Story Wireframe

**Route:** `/wedding/story`

This page was not named in the Step 6 example list, but it is an approved primary-navigation page and therefore receives a Phase 2 wireframe.

```text
┌──────────────────────────────┐
│ SHARED STICKY HEADER         │
├──────────────────────────────┤
│ OUR STORY                    │
│ Brief introduction           │
├──────────────────────────────┤
│ STORY SECTION 1              │
│ [Optional photograph]        │
│ Narrative text               │
├──────────────────────────────┤
│ STORY SECTION 2              │
│ Narrative text               │
│ [Optional photograph]        │
├──────────────────────────────┤
│ ENGAGEMENT / PLANNING        │
│ Context text                 │
├──────────────────────────────┤
│ NEXT STEP                    │
│ [RSVP] [Return Home]         │
├──────────────────────────────┤
│ SHARED FOOTER                │
└──────────────────────────────┘
```

---

# 7. Read, Listen, and Watch Wireframe

**Route:** `/wedding/read-listen-watch`

```text
┌──────────────────────────────┐
│ SHARED STICKY HEADER         │
├──────────────────────────────┤
│ READ, LISTEN, AND WATCH      │
│ Introductory explanation     │
├──────────────────────────────┤
│ BOOK                         │
│ [Cover image]                │
│ Title / description          │
│ [Retailer — new tab]         │
│ [Library — new tab]          │
├──────────────────────────────┤
│ AUDIOBOOK                    │
│ [Cover image]                │
│ Title / description          │
│ [Service — new tab]          │
│ [Library — new tab]          │
├──────────────────────────────┤
│ FILM                         │
│ [Poster image]               │
│ Title / description          │
│ [Stream/Rent — new tab]      │
│ [Purchase — new tab]         │
│ [Library — new tab]          │
├──────────────────────────────┤
│ AVAILABILITY DISCLAIMER      │
│ Services and regional access │
│ may change.                  │
├──────────────────────────────┤
│ COPYRIGHTED MEDIA NOTICE     │
│ This site does not host the  │
│ book, audiobook, or movie.   │
├──────────────────────────────┤
│ SHARED FOOTER                │
└──────────────────────────────┘
```

### Wider-screen adaptation

- Resource cards may appear in two or three columns.
- Each card remains a coherent unit when stacked.
- External-link behavior remains visible and accessible.

---

# 8. Venues Wireframes

**Route:** `/wedding/venues`

## 8A. Venues — Configuration A

```text
┌──────────────────────────────┐
│ SHARED STICKY HEADER         │
├──────────────────────────────┤
│ VENUES                       │
│ Active configuration notice  │
├──────────────────────────────┤
│ CEREMONY                     │
│ Warinanco Park               │
│ Roselle, NJ 07036            │
│ 10:30 a.m.–12:00 p.m.        │
│                              │
│ [Open Map — new tab]         │
│ Entrance instructions        │
│ Parking instructions         │
│ Accessibility information    │
├──────────────────────────────┤
│ TRAVEL BETWEEN VENUES        │
│ 12:00 p.m.–12:30 p.m.        │
│ Guest travel guidance        │
│ Not a cocktail hour          │
├──────────────────────────────┤
│ RECEPTION                    │
│ Sphinx Banquet Center        │
│ 121 E 2nd Avenue             │
│ Roselle, NJ 07203            │
│ 12:30 p.m.–4:30 p.m.         │
│                              │
│ Buffet brunch remains open   │
│ throughout reception hours.  │
│ Dancing and festivities      │
│ occur at various intervals.  │
│                              │
│ [Open Map — new tab]         │
│ Entrance instructions        │
│ Parking instructions         │
│ Accessibility information    │
├──────────────────────────────┤
│ WEATHER / FALLBACK           │
│ Current contingency notice   │
├──────────────────────────────┤
│ [Travel] [Schedule] [FAQ]    │
├──────────────────────────────┤
│ SHARED FOOTER                │
└──────────────────────────────┘
```

### Configuration A venue rules

- The 12:00–12:30 p.m. interval is travel between venues.
- Do not label it as a cocktail hour.
- Do not add exact times for dancing, buffet activity, toasts, cake, photographs, or other reception activities.
- Do not show a mimosa station unless later confirmed.

---

## 8B. Venues — Configuration B

```text
┌──────────────────────────────┐
│ SHARED STICKY HEADER         │
├──────────────────────────────┤
│ VENUE                        │
│ Active configuration notice  │
├──────────────────────────────┤
│ CEREMONY AND RECEPTION       │
│ Sphinx Banquet Center        │
│ 121 E 2nd Avenue             │
│ Roselle, NJ 07203            │
│ 11:30 a.m.–4:30 p.m.         │
│                              │
│ One combined event block     │
│                              │
│ Buffet brunch remains open   │
│ during the reception portion.│
│ Dancing and festivities      │
│ occur at various intervals.  │
│                              │
│ [Open Map — new tab]         │
│ Entrance instructions        │
│ Parking instructions         │
│ Accessibility information    │
├──────────────────────────────┤
│ CONFIGURATION NOTICE         │
│ Approved Sphinx-only wording │
├──────────────────────────────┤
│ [Travel] [Schedule] [FAQ]    │
├──────────────────────────────┤
│ SHARED FOOTER                │
└──────────────────────────────┘
```

### Configuration B venue rules

- Do not create a visual divider labeled “Reception begins.”
- Do not invent a ceremony-ending time.
- Do not add exact internal activity times.
- Do not show a mimosa station unless later confirmed.

---

# 9. Travel Wireframes

**Route:** `/wedding/travel`

## 9A. Travel — Shared Hotel Block

```text
┌──────────────────────────────┐
│ SHARED STICKY HEADER         │
├──────────────────────────────┤
│ TRAVEL                       │
├──────────────────────────────┤
│ HOTEL BLOCK                  │
│ Check-in: Fri., Apr. 30      │
│ Check-out: Sun., May 2       │
│                              │
│ {Before hotel selected}      │
│ Property details are being   │
│ finalized.                   │
│                              │
│ {After hotel selected}       │
│ Hotel name and address       │
│ Rate / deadline              │
│ Accessibility details        │
│ [Book Hotel — new tab]       │
├──────────────────────────────┤
│ ACTIVE-VENUE TRAVEL          │
│ {Configuration-specific}     │
├──────────────────────────────┤
│ TRAIN                        │
│ Guest guidance               │
├──────────────────────────────┤
│ AIRPORTS                     │
│ Guest guidance               │
├──────────────────────────────┤
│ LOCAL TRANSPORTATION         │
│ Taxi / rideshare / transit   │
├──────────────────────────────┤
│ DRIVING                      │
│ Guest guidance               │
├──────────────────────────────┤
│ ACCESSIBILITY NOTES          │
├──────────────────────────────┤
│ [Venues] [Schedule]          │
├──────────────────────────────┤
│ SHARED FOOTER                │
└──────────────────────────────┘
```

---

## 9B. Travel — Configuration A Active-Venue Section

```text
┌──────────────────────────────┐
│ ACTIVE-VENUE TRAVEL          │
├──────────────────────────────┤
│ WARINANCO PARK ARRIVAL       │
│ Parking / drop-off / entrance│
│ Recommended arrival TBD      │
│ [Map — new tab]              │
├──────────────────────────────┤
│ BETWEEN-VENUE TRAVEL         │
│ 12:00 p.m.–12:30 p.m.        │
│ Travel from Warinanco to     │
│ Sphinx                       │
│                              │
│ No cocktail-hour label       │
├──────────────────────────────┤
│ SPHINX ARRIVAL               │
│ Reception begins 12:30 p.m.  │
│ Parking / entrance           │
│ [Map — new tab]              │
└──────────────────────────────┘
```

### Configuration A travel rules

- Use the confirmed transition window only for guest travel.
- Do not tie arrival guidance to buffet, dancing, beverage, or other internal reception activity times.

---

## 9C. Travel — Configuration B Active-Venue Section

```text
┌──────────────────────────────┐
│ ACTIVE-VENUE TRAVEL          │
├──────────────────────────────┤
│ SPHINX ARRIVAL               │
│ One-location event           │
│ 11:30 a.m.–4:30 p.m.         │
│ Recommended arrival TBD      │
│ Parking / drop-off / entrance│
│ [Map — new tab]              │
└──────────────────────────────┘
```

### Configuration B travel rules

- Do not create an internal travel interval.
- Do not use an invented reception-starting time as an arrival deadline.
- Internal reception activities do not determine guest travel timing unless a later confirmed transportation arrangement requires it.

---

# 10. Schedule Wireframes

**Route:** `/wedding/schedule`

## 10A. Schedule — Configuration A

```text
┌──────────────────────────────┐
│ SHARED STICKY HEADER         │
├──────────────────────────────┤
│ SCHEDULE                     │
│ Saturday, May 1, 2027        │
├──────────────────────────────┤
│ CEREMONY                     │
│ 10:30 a.m.–12:00 p.m.        │
│ Warinanco Park               │
├──────────────────────────────┤
│ TRAVEL BETWEEN VENUES        │
│ 12:00 p.m.–12:30 p.m.        │
│ Warinanco Park → Sphinx      │
├──────────────────────────────┤
│ RECEPTION                    │
│ 12:30 p.m.–4:30 p.m.         │
│ Sphinx Banquet Center        │
├──────────────────────────────┤
│ DURING THE RECEPTION         │
│ Buffet brunch remains open   │
│ throughout reception hours.  │
│                              │
│ Dancing and other festivities│
│ take place at various        │
│ intervals.                   │
│                              │
│ No detailed internal         │
│ timeline is published.       │
├──────────────────────────────┤
│ [Venues] [Travel] [FAQ]      │
│ [RSVP]                       │
├──────────────────────────────┤
│ SHARED FOOTER                │
└──────────────────────────────┘
```

### Configuration A schedule rules

- The page uses three guest-facing blocks: Ceremony, Travel, and Reception.
- The Travel block is not a cocktail hour.
- Do not add exact times for buffet service, dancing, toasts, speeches, cake, photographs, or other reception activities.
- Do not show a mimosa station unless later confirmed.

---

## 10B. Schedule — Configuration B

```text
┌──────────────────────────────┐
│ SHARED STICKY HEADER         │
├──────────────────────────────┤
│ SCHEDULE                     │
│ Saturday, May 1, 2027        │
├──────────────────────────────┤
│ CEREMONY AND RECEPTION       │
│ 11:30 a.m.–4:30 p.m.         │
│ Sphinx Banquet Center        │
│                              │
│ One combined event block     │
├──────────────────────────────┤
│ DURING THE RECEPTION PORTION │
│ Buffet brunch remains open.  │
│                              │
│ Dancing and other festivities│
│ take place at various        │
│ intervals.                   │
│                              │
│ No separate reception-start  │
│ time is published.           │
├──────────────────────────────┤
│ [Venue] [Travel] [FAQ]       │
│ [RSVP]                       │
├──────────────────────────────┤
│ SHARED FOOTER                │
└──────────────────────────────┘
```

### Configuration B schedule rules

- Preserve one combined 11:30 a.m.–4:30 p.m. block.
- Do not add a visual timeline split between ceremony and reception.
- Do not add exact times for buffet service, dancing, toasts, speeches, cake, photographs, or other reception activities.
- Do not show a mimosa station unless later confirmed.

---

## 10C. Later Confirmed Mimosa-Station Variant

This variant is **not active** unless the arrangement is confirmed.

```text
┌──────────────────────────────┐
│ DURING THE RECEPTION         │
│ Buffet brunch remains open.  │
│ Dancing and other festivities│
│ occur at various intervals.  │
│                              │
│ Self-service mimosa station  │
│ available during reception.  │
└──────────────────────────────┘
```

### Mimosa variant rules

- Add only after the couple and Sphinx confirm the arrangement.
- Do not relabel it as a cocktail hour.
- Do not assign a narrower time unless a later recorded decision establishes one.

---

# 11. FAQ Wireframes

**Route:** `/wedding/faq`

## 11A. FAQ — Shared Structure

```text
┌──────────────────────────────┐
│ SHARED STICKY HEADER         │
├──────────────────────────────┤
│ FREQUENTLY ASKED QUESTIONS   │
│ Brief introduction           │
├──────────────────────────────┤
│ RSVP                         │
│ ▸ How do I RSVP?             │
│ ▸ Can I revise my RSVP?      │
│ ▸ Why is the form blank?     │
│ ▸ Email or text confirmation?│
│ ▸ What if my code fails?     │
├──────────────────────────────┤
│ ATTENDANCE                   │
│ ▸ Can children attend?       │
│ ▸ May I bring a Plus 1?      │
│ ▸ Why do some guests see     │
│   Plus 1 questions?          │
│ ▸ How do I report our party  │
│   size?                      │
│ ▸ Why am I asked for attendee│
│   names?                     │
├──────────────────────────────┤
│ FOOD AND RECEPTION           │
│ ▸ What meal is served?       │
│ ▸ Is there a cocktail hour?  │
│ ▸ Is there a formal dinner?  │
│ ▸ When will dancing happen?  │
│ ▸ How do I report dietary    │
│   information?               │
│ ▸ {Mimosa question only if   │
│   later confirmed}           │
├──────────────────────────────┤
│ ATTIRE                       │
│ ▸ What should I wear?        │
│ ▸ Are hats encouraged?       │
│ ▸ Are costumes welcome?      │
├──────────────────────────────┤
│ VENUE AND WEATHER            │
│ {Configuration-specific}     │
├──────────────────────────────┤
│ TRAVEL                       │
│ ▸ What are hotel dates?      │
│ ▸ Where do I park?           │
├──────────────────────────────┤
│ GIFTS                        │
│ ▸ Is there a registry?       │
│ ▸ What gifts are preferred?  │
├──────────────────────────────┤
│ THEME RESOURCES              │
│ ▸ Where can I find the book, │
│   audiobook, and movie?      │
├──────────────────────────────┤
│ PRIVACY                      │
│ Brief answer                 │
│ [Full Privacy Notice]        │
├──────────────────────────────┤
│ [Schedule] [RSVP]            │
│ [Contact for Help]           │
├──────────────────────────────┤
│ SHARED FOOTER                │
└──────────────────────────────┘
```

### RSVP attendance-answer structure

- Explain that the validated invitation identifies the named invitees associated with that invitation and asks for an explicit Yes/No attendance decision for each of them when the party is attending.
- Explain that mixed attendance within one invited party is allowed; one named invitee may attend while another declines.
- Explain that a Plus 1 is available **only** when the private invitation configuration contains a `Plus1` allocation from the authoritative Invitees List.
- Explain that not every invited party has a Plus 1 option and that every authorized allocation receives its own Yes/No question rather than one aggregate guest-count control.
- Explain that actual `overallAttendance` is derived from the number of named-invitee and authorized Plus 1 Yes responses.
- Explain that the four age-category dials classify that derived attending party and must add up exactly to the derived count; they do not independently choose party size.
- Explain that every attending person receives an **Attendee Details** row with an attendee name. When Reception is selected, the row also provides optional **Dietary or allergy information**.
- Do not expose internal named-invitee IDs, allocation identifiers, source-row details, or another party's invitation configuration.

### Food and reception answer structure

```text
┌──────────────────────────────┐
│ WHAT MEAL IS SERVED?         │
│ Buffet-style brunch.         │
│ Buffet remains available     │
│ throughout reception.        │
├──────────────────────────────┤
│ HOW DO I REPORT DIETARY      │
│ INFORMATION?                 │
│ If attending Reception, use  │
│ the Dietary or allergy       │
│ information field in each    │
│ attendee's Attendee Details  │
│ row.                         │
├──────────────────────────────┤
│ IS THERE A COCKTAIL HOUR?    │
│ No separately scheduled      │
│ formal cocktail hour.        │
├──────────────────────────────┤
│ IS THERE A FORMAL DINNER?    │
│ No separately scheduled      │
│ formal dinner service.       │
├──────────────────────────────┤
│ WHEN WILL DANCING HAPPEN?    │
│ At various intervals during  │
│ the reception; no fixed      │
│ public dancing block.        │
├──────────────────────────────┤
│ {MIMOSA STATION — ONLY IF    │
│ CONFIRMED}                   │
│ Approved guest-facing answer │
└──────────────────────────────┘
```

## 11B. FAQ — Configuration A Venue/Weather State

```text
┌──────────────────────────────┐
│ VENUE AND WEATHER            │
├──────────────────────────────┤
│ ▸ Where is the ceremony?     │
│   Warinanco Park             │
│   10:30 a.m.–12:00 p.m.      │
│                              │
│ ▸ How do we reach reception? │
│   Travel to Sphinx during    │
│   12:00–12:30 p.m.           │
│                              │
│ ▸ Is that a cocktail hour?   │
│   No; it is guest travel     │
│   between venues.            │
│                              │
│ ▸ Where is the reception?    │
│   Sphinx, 12:30–4:30 p.m.    │
│                              │
│ ▸ What happens in bad        │
│   weather?                   │
│   Approved fallback wording  │
└──────────────────────────────┘
```

## 11C. FAQ — Configuration B Venue/Weather State

```text
┌──────────────────────────────┐
│ VENUE AND WEATHER            │
├──────────────────────────────┤
│ ▸ Where are the ceremony and │
│   reception?                 │
│   Sphinx Banquet Center      │
│                              │
│ ▸ What time is the event?    │
│   11:30 a.m.–4:30 p.m.       │
│                              │
│ ▸ When does reception begin? │
│   The public schedule uses   │
│   one combined event block;  │
│   no separate time is posted.│
│                              │
│ ▸ Is Warinanco Park part of  │
│   the current guest plan?    │
│   No / approved wording      │
└──────────────────────────────┘
```

---

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
│                              │
│ Simple intentional message   │
│ explaining that wedding      │
│ photographs and videos will  │
│ appear after the celebration │
│ and review process.          │
│                              │
│ [Return Home]                │
├──────────────────────────────┤
│ SHARED FOOTER                │
└──────────────────────────────┘
```

No pre-wedding images are required.

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

This public informational page was added through the approved privacy decision and is revised through Phase 3 Step 14 plus the approved person-level attendance correction to show the finalized retention, SMS-provider-gate, data-minimization, named-invitee, attendee-detail, and security-limitation information order.

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
│ • Authorized named Plus1     │
│   responses, if applicable   │
│ • Four age-category totals   │
│ • Attendee names             │
│ • Reception dietary/allergy  │
│   information, if supplied   │
│ • Confirmation destination   │
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
│ EMAIL / TEXT CONFIRMATIONS   │
│ Text Message shown only when │
│ the provider/disclosure gate │
│ is satisfied.                │
│ Mobile numbers are           │
│ transactional-only.          │
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
- Explain that a successful invitation lookup returns only the validated party's limited safe named-invitee display data and authorized `Plus1` prompts needed to render that party's blank form; do not publish the production invitation registry, source rows, opaque person IDs, or another party's configuration.
- Explain that named-invitee and authorized Plus 1 Yes/No responses are private personalized RSVP information used to derive actual attendance.
- Explain that attendee names are collected for every attending RSVP and that dietary/allergy information is collected only when Reception is selected.
- Explain that attendee names and any dietary/allergy text may appear in the submitting party's own confirmation surfaces and authorized private administrative records, but not public pages, public metadata, analytics, ordinary logs, unrelated administrative messages, or another party's response.
- The retention region must state the finalized July 30, 2027 active-data retirement date and August 29, 2027 protected-backup retirement deadline.
- The final prose must also explain the minimum-record exception for a concrete unresolved correction, dispute, delivery investigation, or comparable administrative need.
- Provider-dependent SMS disclosure wording is inserted only after the provider's applicable requirements are verified; otherwise the public site must not imply that Text Message confirmation is enabled.
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
│ Guest-friendly explanation   │
│                              │
│ [Home]                       │
│ [RSVP]                       │
│ [Venues]                     │
│ [FAQ]                        │
├──────────────────────────────┤
│ NEED HELP?                   │
├──────────────────────────────┤
│ SHARED FOOTER                │
└──────────────────────────────┘
```

No server, framework, filesystem, or routing details appear.

---

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
7. Named `Plus1` region **only** when the validated invitation contains one or more authorized Column E allocations.
8. Derived `overallAttendance` display based on the person-level Yes responses.
9. Four coordinated age-category attendance dials whose sum must equal derived `overallAttendance`.
10. **Attendee Details** rows whenever `overallAttendance > 0`, repeated exactly once per attendee; every row contains **Attendee name**, and Reception-selected rows additionally contain **Dietary or allergy information**.
11. Confirmation method, required again for every revision.
12. Conditional confirmation destination and any required transactional SMS authorization.
13. Notice that newly submitted operational fields replace their stored counterparts.
14. Privacy/authorization content.
15. Validation summary.
16. Submit action.
17. Assistance.
18. Footer.

Named-invitee presentation rules:

- One Yes/No attendance decision is displayed for each named invitee returned by the validated invitation configuration.
- Mixed named-invitee attendance is permitted.
- Opaque person IDs are not shown to the guest.

Named-`Plus1` presentation rules:

- No authoritative allocation means no Plus 1 region at all.
- One allocation means one named-invitee Plus 1 Yes/No question.
- Multiple allocations mean multiple independent Plus 1 Yes/No questions.
- There is no aggregate “How many additional guests?” control.

Attendance-dial presentation rules:

- `overallAttendance` is displayed as the derived count of person-level Yes responses and is not independently editable.
- Adults 21+, Young Adults 18–20, Children 3–17, and Children under 3 are displayed as coordinated whole-number dials.
- Each increase action respects the number of derived attendees not yet assigned to the other three age categories.
- The complete age-category sum must equal derived `overallAttendance` exactly.

Attendee-detail presentation rules:

- Every attending RSVP produces exactly `overallAttendance` **Attendee Details** rows, including Ceremony-only attendance.
- Each row always contains required **Attendee name**.
- When Reception is selected, each row additionally contains **Dietary or allergy information**; the value remains optional.
- Removing Reception while remaining Ceremony-only preserves attendee names and removes dietary/allergy values.
- A change in attending-person composition requires complete Attendee Details replacement even when the numerical headcount is unchanged.

## RSVP confirmation

1. Header.
2. Success or warning heading.
3. Initial/revision label.
4. Complete current event attendance or decline state.
5. Named-invitee Yes/No responses when attending.
6. Authorized named-`Plus1` responses only when that invitation actually has allocations.
7. Four age-category totals and derived `overallAttendance` when attending.
8. Attendee names whenever attending; per-attendee dietary/allergy information only when Reception is selected.
9. Timestamp.
10. Selected guest confirmation method.
11. Guest delivery status.
12. Limited administrative-attempt status without the private address.
13. Revision instructions covering omission, replacement, explicit zero where applicable, dependency clearing, exact age-total reconciliation, and complete Attendee Details replacement when attending-person composition changes.
14. Deadline.
15. Assistance.
16. Footer.

The confirmation omits genuinely inapplicable conditional regions. It does not insert disabled, `N/A`, or “not applicable” rows merely because an invitation had no `Plus1` allocation or because Reception-specific dietary information does not apply.

## Confirmation Refresh Fallback

1. Header.
2. “Confirmation Summary No Longer Available” heading.
3. Primary explanation that the temporary summary is unavailable and that, if an RSVP was submitted, it may already have been recorded.
4. Instruction to check the selected email or text-message confirmation.
5. Explicit warning not to submit the same response again solely because the summary is unavailable.
6. Deliberate-revision guidance directing the guest back to manual RSVP entry.
7. `Return to RSVP` action.
8. Assistance explanation with `RSVPhelp@loreweavercreations.com`.
9. `Contact for Help` action.
10. Footer.

The fallback contains no RSVP summary, invitation code, confirmation destination, submission identifier, recovery token, or hidden reconstruction control. It does not automatically perform lookup, replay a submission, or redirect the guest before the explanation can be read.

## Event-dependent pages

1. Header.
2. Page heading.
3. Clear active-configuration identification.
4. Confirmed outer event blocks.
5. Venue, schedule, or travel information.
6. Broad reception description where applicable.
7. Contingency information.
8. Contextual links.
9. Footer.

No event-dependent mobile stack inserts a formal cocktail hour, formal dinner, fixed dancing block, or unconfirmed mimosa-station section.

---

# Phase 2 Step 6 Completion Review

The low-fidelity wireframes are complete when:

- Home is represented.
- RSVP entry is represented.
- Personalized RSVP is represented.
- RSVP confirmation is represented.
- Theme and Attire is represented.
- Read, Listen, and Watch is represented.
- Venues is represented.
- Travel is represented.
- Schedule is represented.
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
- Home has separate Configuration A and Configuration B states.
- Venues has separate Configuration A and Configuration B states.
- Travel has separate Configuration A and Configuration B content states.
- Schedule has separate Configuration A and Configuration B states.
- FAQ has separate Configuration A and Configuration B notices.
- Configuration A identifies 12:00–12:30 p.m. as travel rather than a cocktail hour.
- Configuration B remains one combined 11:30 a.m.–4:30 p.m. block without an invented internal transition.
- Buffet brunch is shown as available throughout the reception portion.
- Dancing is shown as occurring at various intervals without a fixed public schedule.
- No formal cocktail-hour or formal-dinner block appears.
- Exact times for flexible reception activities are excluded.
- The mimosa-station variant remains conditional and inactive unless confirmed.
- RSVP countdown behavior is represented before and during the final month.
- Manual invitation-code entry is the sole RSVP access method.
- No code-bearing personalized URL appears.
- Personalized forms load blank and do not display stored RSVP answers or confirmation destinations.
- One reusable spreadsheet-authoritative substantive form is represented; no active default/reduced production-profile selector remains.
- A party with no Column E `Plus1` allocation has no Plus 1 question.
- Every authorized Column E allocation produces one separate named-invitee Yes/No question; no aggregate count control is used.
- Every validated attending form shows one named-invitee Yes/No control per authorized named invitee, and mixed named-invitee attendance is supported.
- `overallAttendance` is displayed as the derived count of named-invitee and authorized Plus 1 Yes responses rather than as an independently selected number.
- Four coordinated age-category dials classify the derived attending party and must sum exactly to `overallAttendance`.
- Every attending RSVP, including Ceremony-only attendance, produces exactly one Attendee Details row per `overallAttendance`; every row requires attendee name.
- Reception selection adds the optional **Dietary or allergy information** field to each attendee row rather than controlling whether attendee rows exist.
- Partial revision behavior distinguishes omission, replacement, explicit zero, attendance/decline changes, dependency clearing, exact age-total reconciliation, and complete Attendee Details replacement whenever attending-person composition changes, including same-count swaps.
- Confirmation method, destination, and any required transactional SMS authorization are shown as required again for every revision.
- Newly submitted operational confirmation fields replace their stored counterparts.
- Submission-in-progress, validation-failure, submission-uncertain, service-unavailable, closed-RSVP, and refresh-without-state branches are represented.
- Safe retry behavior preserves the client submission identifier and remains idempotent.
- Guest and administrative confirmation attempts are represented as independent post-storage attempts.
- Confirmation screens show initial-versus-revision status, timestamp, selected guest method, guest delivery status, and limited administrative-attempt status without exposing the private address.
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
- Validated Blank Form remains blank and supports the validated party's safe named-invitee roster plus invitation-authorized named-`Plus1` variation without revealing stored answers.
- Validation Failure preserves current page-entered values and makes errors accessible.
- Submitting prevents duplicate activation and does not display success before backend-confirmed storage.
- Submission Uncertain warns against blind resubmission and supports an idempotent safe retry using the original logical request.
- Confirmed Initial Submission and Confirmed Revision display the complete current RSVP under the spreadsheet-authoritative model.
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
- The finalized primary explanation states that the temporary summary is unavailable, that a submitted RSVP may already have been recorded, that the guest should check the selected email or text-message confirmation, and that the same response should not be submitted again solely because the summary is unavailable.
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
- Every shown Text Message choice is explicitly configuration-dependent and is omitted in production until the selected provider's Step 14 disclosure/authorization gate is satisfied.
- Email remains available according to centralized production configuration when Text Message is disabled.
- The Privacy wireframe includes invitation-code limits, safe named-invitee lookup data, person-level attendance responses, data collected and used, blank forms, partial revisions, confirmation-channel treatment, private storage/access, all-attendance attendee-name and Reception-specific dietary/allergy boundaries, data-exposure safeguards, retention, the separate private `Invitees List`, assistance, and the security limitation.
- The Privacy wireframe identifies July 30, 2027 as the active RSVP-data retirement date and August 29, 2027 as the protected-backup retirement deadline.
- The final Privacy-page prose may explain a minimum-record documented retention exception without turning that exception into a general indefinite-retention rule.
- `rsvp-system-design.md`, `rsvp-api-contract.md`, `rsvp-test-cases.md`, `page-outlines.md`, and this file describe the same Step 14 browser-facing consequences.
- The synchronized governing documents must continue to describe the same spreadsheet-authoritative RSVP model as implementation proceeds.

With these constraints recorded, `wireframes.md` preserves the finalized Phase 3 Step 14 state/privacy architecture and is synchronized with the approved person-level attendance correction.
