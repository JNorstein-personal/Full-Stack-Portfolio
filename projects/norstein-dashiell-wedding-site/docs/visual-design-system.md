# Wedding Website Visual Design System

## Status

Phase 4 working design system.

Current completion state: updated through Phase 4, Step 6.

## Governing references

* Visual Design Decisions
* requirements.md
* decisions.md
* page-outlines.md
* wireframes.md

## Status labels

**Final** - already approved and should not change without a new decision.

**Provisional** - approved as a starting point but intentionally subject to browser calibration.

**To verify** - depends on rights, browser behavior, device testing, or another external fact.

These labels are used throughout the Phase 4 design system to distinguish approved design decisions from values that intentionally remain subject to browser calibration, rights review, device testing, or other external verification.

---

## Visual Direction

**Status: Final**

The wedding website should present a cohesive visual identity based on the following established thematic direction:

* Whimsical cottagecore.
* Victorian tea-party aesthetics.
* Statement-hat Sunday Best.
* Vintage garden formalwear.
* Howl's Moving Castle-inspired visual language.
* Spring wildflowers.
* Watercolor illustration.

The overall presentation should feel handcrafted, romantic, storybook-like, and intentionally decorative while remaining suitable for a functional modern website.

Appropriate supporting visual motifs may include:

* Parchment.
* Pressed flowers.
* Watercolor wildflowers.
* Brass accents.
* Decorative linework.
* Dark greens.
* Creams.
* Dusty rose.
* Lavender.
* Periwinkle.
* Navy.
* Antique gold.

These motifs establish the visual vocabulary of the site rather than a requirement that every motif appear on every page. Their use should remain selective and coordinated so that individual pages feel like parts of the same visual system rather than collections of unrelated decorative elements.

### Overall Design Character

**Status: Final**

The visual treatment should evoke a whimsical illustrated wedding invitation rather than a generic corporate website.

The site's decorative identity should be recognizable across its public informational pages, navigation, RSVP experience, and later post-wedding content. Decorative elements should support the wedding's visual character without overwhelming the information guests need to find or the actions they need to complete.

The site should balance two complementary goals:

1. **Invitation-like presentation** - rich enough in typography, illustration, borders, color, and decorative detail to reflect the established wedding aesthetic.
2. **Functional web-interface clarity** - structured enough that navigation, reading, form completion, validation, confirmation, and error recovery remain obvious and comfortable.

Where those goals conflict, readability, accessibility, and successful completion of essential guest tasks take precedence over decoration.

### Public Informational Pages

**Status: Final**

Public informational pages may use richer decorative treatment than forms and transactional states.

Pages whose primary purpose is reading, browsing, or presenting wedding information may make greater use of:

* Decorative headings.
* Watercolor imagery.
* Wildflower motifs.
* Parchment-inspired surfaces.
* Decorative borders and linework.
* Illustrated section divisions.
* Brass or antique-gold visual accents.
* Carefully applied shadows.
* More expressive page composition.

This freedom does not remove the requirement for readable text, understandable hierarchy, accessible navigation, sufficient contrast, responsive behavior, or compatibility with enlarged text.

Decorative treatment should organize and enhance public content rather than obscure it.

### RSVP and Transactional Interfaces

**Status: Final**

RSVP pages may use the same visual language as the rest of the wedding website, but they must prioritize:

* Legibility.
* Clear information hierarchy.
* Obvious interactive controls.
* Understandable instructions.
* Clear field labels.
* Predictable navigation.
* Visible validation.
* Clear submission and confirmation states.
* Straightforward error recovery.

The RSVP system is a functional application within the decorative wedding website. Its appearance should therefore feel visually related to the rest of the site without turning form completion into an ornamental or visually ambiguous experience.

Decoration must never make it difficult for a guest to determine:

* What information is being requested.
* Which options are available.
* Which option is currently selected.
* Whether a field is required.
* Whether an entered value is valid.
* What action a button will perform.
* Whether a submission succeeded.
* Whether a warning or error requires further action.
* How to recover from an error or uncertain state.

Forms and transactional states should generally use calmer content surfaces and simpler decorative arrangements than presentation-focused sections of the public site.

### Decorative Imagery and Text Readability

**Status: Final**

Decorative imagery may frame, divide, surround, or otherwise support content, but it must not sit behind dense text without an appropriate readability treatment.

Where decorative imagery appears near or behind text, the implementation must preserve a clearly readable text surface through measures such as:

* A dedicated content surface.
* A sufficiently opaque overlay.
* Adequate separation between text and decorative detail.
* Careful cropping or positioning of decorative imagery.
* A solid-color fallback when the decorative asset is unavailable.

Decorative imagery should remain decoration rather than becoming necessary for understanding the site's content or structure.

### Borders, Shadows, Linework, and Watercolor Elements

**Status: Final**

Decorative borders, shadows, linework, watercolor elements, and related ornamental treatments must not:

* Reduce text or control contrast.
* Make enabled controls appear disabled.
* Make disabled controls appear selected or active.
* Obscure field boundaries.
* Compete visually with validation or status messages.
* Make links difficult to identify.
* Interfere with visible keyboard focus.
* Create false visual hierarchy.
* Obscure the boundaries between separate interactive elements.

Decorative treatments should reinforce the invitation-like character of the website while remaining visually subordinate to interactive state and content meaning.

### Graceful Visual Degradation

**Status: Final**

The site must remain coherent and understandable if custom fonts or decorative images fail to load.

The design must not depend on successful delivery of a particular decorative asset in order for a guest to:

* Identify the page.
* Understand headings.
* Read body text.
* Navigate the site.
* Complete the RSVP form.
* Understand validation or error messages.
* Recognize links and buttons.
* Interpret confirmation or status information.

Fallback typography and solid-color or otherwise simplified background treatments should preserve the intended hierarchy and general character of the site even when the preferred decorative presentation is unavailable.

Custom fonts and decorative assets enhance the design; they do not define the site's basic usability.

### Accessibility Independence from Color

**Status: Final**

The site must remain understandable when color is removed or when a user relies on high-contrast settings, enlarged-text settings, or comparable accessibility features.

Color may reinforce meaning, hierarchy, selection, status, or interactivity, but it must not serve as the only means of communicating them.

Accordingly:

* Links must remain identifiable through more than color alone where necessary for clarity.
* Selected controls must have a distinguishable state beyond a color change alone.
* Required fields must not be identified exclusively by color.
* Validation errors must include understandable text or another programmatically available indication.
* Warning, success, uncertainty, closed, and other status states must communicate their meaning through text rather than color alone.
* Keyboard focus must remain visibly identifiable.
* Navigation and page hierarchy must remain understandable without reliance on the site's decorative palette.
* Enlarged text must not cause decorative elements to obscure, clip, or overlap essential content or controls.

### Decoration and Usability Priority

**Status: Final**

The website is intentionally decorative, but decoration is subordinate to readability, accessibility, and guest usability.

When evaluating a decorative treatment, preference should be given to the version that best preserves:

1. Readability.
2. Accessible interaction.
3. Clear information hierarchy.
4. RSVP usability.
5. Responsive behavior.
6. Consistency with the established visual direction.

A decorative treatment that substantially weakens one of these requirements should be revised, simplified, relocated, or removed rather than preserved solely for visual effect.

This principle applies throughout the remainder of the visual design system and should guide later browser calibration and implementation decisions.

---

## Font Licensing and Delivery

### Licensing Principle

**Status: Final**

The approved typography uses:

* Edwardian Script ITC.
* Felix Titling.
* Book Antiqua.

Separate webfont licenses have already been obtained for all three font families.

Accordingly, the project's use of these fonts is not dependent upon the ordinary desktop-use rights associated with copies installed through Windows, Microsoft Office, or another desktop application.

The separately obtained webfont licenses are the controlling authorization for website embedding and distribution.

Only font files supplied under, or otherwise expressly authorized by, those webfont licenses may be placed into the website's public font assets.

The presence of a separately licensed webfont does not authorize arbitrary redistribution of a different desktop copy of the same typeface.

Therefore:

* Do not copy an unrelated Windows or Microsoft Office font file into the project merely because the same typeface is licensed for web use separately.
* Do not convert a desktop TTF or OTF copy into another webfont format unless the applicable webfont license specifically permits that action.
* Prefer the font files provided as part of the licensed webfont package.
* Preserve the associated license, purchase, invoice, account, or other authorization record in private project records.
* Do not expose private purchase records, license credentials, account information, or unnecessary licensing documents through the public website.
* Keep the CSS typography roles independent from individual components so that a font can be replaced later without rewriting page-level markup.
* Retain appropriate fallback families because a licensed custom font can still fail to load because of network, browser, configuration, or asset-delivery problems.
* Do not make the site's basic usability depend on successful custom-font delivery.

The personal and noncommercial purpose of the wedding website is secondary to the actual webfont licenses. The project relies on the rights granted by those licenses rather than assuming that personal use alone permits web embedding.

### Webfont Asset Rule

**Status: Final**

No font file should enter the public application assets unless all of the following are true:

1. The font is covered by a valid webfont license applicable to this website.
2. The file being used is supplied under or permitted by that license.
3. The associated license or purchase record is retained privately.
4. The font's intended design role is documented in this design system.
5. A fallback family is defined.
6. The actual licensed webfont format has been identified before implementation.
7. The file is placed into the public application only during the appropriate asset-review and application-structure phase.

The eventual intended font location is:

`client/src/assets/fonts/`

Font files should not be placed there before the applicable asset-review and application-structure work establishes that they are the correct licensed delivery files.

### Edwardian Script ITC

**Font name:** Edwardian Script ITC

**Design role:** Ornamental/script display typeface.

Edwardian Script ITC is intended for highly decorative display text, including the main wedding title, selected page titles, and short ornamental headings where the script treatment remains readily legible.

It is not intended for dense instructional copy, ordinary body text, form labels, validation messages, warning messages, button labels, or other interface text for which rapid readability is more important than decorative character.

**Available locally:** Yes.

The typeface is available to the project for design and implementation purposes.

**Web embedding permitted:** Yes.

A separate webfont license has already been obtained for Edwardian Script ITC. Website embedding is therefore authorized subject to the terms of that license.

The project must use the webfont files supplied under or otherwise permitted by that license rather than assuming that any locally installed desktop copy may be redistributed.

**Source or license record:** Separately obtained Edwardian Script ITC webfont license.

Retain the corresponding license, purchase receipt, invoice, account record, license agreement, or equivalent evidence of authorization in the project's private licensing records.

Do not publish private licensing documentation through the public website unless there is a specific reason and the license permits doing so.

**Web format available:** Other - exact licensed package format is not yet recorded in this design-system document.

Before the font files are copied into the public application, inspect the licensed webfont package and update this field to identify the actual authorized format, such as WOFF2, WOFF, or another supplied web format.

Do not generate a replacement webfont file by converting an unrelated locally installed desktop font unless the applicable license explicitly authorizes that conversion.

**Fallback family:** `"Brush Script MT", "Segoe Script", cursive`

These named fallback fonts are local-font candidates only and are not to be bundled merely because they appear in the stack.

The generic `cursive` family provides the final platform-controlled fallback.

Fallback behavior must preserve understandable content even though no fallback is expected to reproduce Edwardian Script ITC exactly.

**Status:** Final

Web-embedding authorization is confirmed through the separately obtained webfont license.

The exact licensed delivery-file format remains a pre-bundling implementation detail to verify and record; that does not reopen the approved licensing decision.

### Felix Titling

**Font name:** Felix Titling

**Design role:** Titling and functional display typeface.

Felix Titling is intended for heading and titling applications where a formal display treatment is appropriate but Edwardian Script ITC would be difficult to scan.

It also serves as the companion display family for numeral treatment where the approved design system requires numerals to appear alongside Edwardian Script ITC lettering.

It may be used for functional headings, longer headings, RSVP state headings, navigation-adjacent headings, and other display text for which a non-script treatment provides clearer reading.

**Available locally:** Yes.

The typeface is available to the project for design and implementation purposes.

**Web embedding permitted:** Yes.

A separate webfont license has already been obtained for Felix Titling. Website embedding is therefore authorized subject to the terms of that license.

The project must use the licensed webfont files or another file specifically authorized by that license rather than redistributing an unrelated desktop installation.

**Source or license record:** Separately obtained Felix Titling webfont license.

Retain the corresponding license, purchase receipt, invoice, account record, license agreement, or equivalent evidence of authorization in the project's private licensing records.

**Web format available:** Other - exact licensed package format is not yet recorded in this design-system document.

Before bundling Felix Titling with the public application, inspect the licensed package and record whether the authorized delivery format is WOFF2, WOFF, another web format, or a combination of formats.

Do not manufacture a webfont by converting an unrelated desktop copy unless the license expressly permits doing so.

**Fallback family:** `"Palatino Linotype", Palatino, Georgia, "Times New Roman", serif`

These fallbacks are intended to preserve a formal serif character and clear heading presentation when Felix Titling is unavailable.

They are not expected to reproduce its exact letterforms.

Named fallback fonts are local-font candidates only unless separately licensed for website distribution.

**Status:** Final

Web-embedding authorization is confirmed through the separately obtained webfont license.

The exact licensed delivery-file format remains a pre-bundling implementation detail to verify and record.

### Book Antiqua

**Font name:** Book Antiqua

**Design role:** Primary readable serif family.

Book Antiqua is intended for the site's principal readable typography, including:

* Body text.
* Form instructions.
* Field labels.
* Help text.
* Validation messages.
* Warning and uncertainty copy.
* Privacy information.
* FAQ answers.
* Long-form narrative content.
* Other ordinary informational copy.

Book Antiqua also provides the family used for the approved subtitle/emphasis treatment where Bold Italic styling is called for.

**Available locally:** Yes.

The typeface is available to the project for design and implementation purposes.

**Web embedding permitted:** Yes.

A separate webfont license has already been obtained for Book Antiqua. Website embedding is therefore authorized subject to the terms of that license.

The project must use the font files supplied under or specifically permitted by the webfont license rather than assuming that an unrelated Microsoft Office or Windows copy may be uploaded.

Where the licensed package contains separate Regular, Bold, Italic, and Bold Italic files, only the faces actually required by the approved design system should be bundled unless there is a documented reason to include additional files.

**Source or license record:** Separately obtained Book Antiqua webfont license.

Retain the corresponding license, purchase receipt, invoice, account record, license agreement, or equivalent evidence of authorization in the project's private licensing records.

**Web format available:** Other - exact licensed package format is not yet recorded in this design-system document.

Before bundling Book Antiqua with the application, inspect the licensed package and record the actual authorized webfont format or formats for each required face.

The required faces should later be reconciled against the actual typography implementation so the website does not distribute unnecessary font files.

**Fallback family:** `"Palatino Linotype", Palatino, "Bookman Old Style", Georgia, "Times New Roman", serif`

This stack is intended to preserve a traditional, readable serif character when Book Antiqua fails to load.

Because Book Antiqua carries the majority of long-form and functional text, its fallback behavior is particularly important. Pages, forms, error messages, and RSVP states must remain fully usable in the fallback family.

Named fallback fonts are local-font candidates only unless separately licensed for website distribution.

**Status:** Final

Web-embedding authorization is confirmed through the separately obtained webfont license.

The exact licensed delivery-file format remains a pre-bundling implementation detail to verify and record.

### Font Licensing Status Summary

**Status: Final**

| Font                 | Design role                                                           | Available locally | Web embedding permitted | License basis                       | Web format                                                   | Status |
| -------------------- | --------------------------------------------------------------------- | ----------------- | ----------------------- | ----------------------------------- | ------------------------------------------------------------ | ------ |
| Edwardian Script ITC | Ornamental/script display                                             | Yes               | Yes                     | Separately obtained webfont license | Exact licensed package format to be recorded before bundling | Final  |
| Felix Titling        | Titling, functional display headings, and companion numeral treatment | Yes               | Yes                     | Separately obtained webfont license | Exact licensed package format to be recorded before bundling | Final  |
| Book Antiqua         | Primary body/readability family and subtitle/emphasis family          | Yes               | Yes                     | Separately obtained webfont license | Exact licensed package format to be recorded before bundling | Final  |

### License-Record Retention

**Status: Final**

The project should retain evidence of the webfont licenses independently from the public website assets.

The retained private record should be sufficient to establish:

* Which font was licensed.
* Which license applies to web use.
* Where or from whom the license was obtained.
* The applicable license terms.
* The date or transaction record where available.
* Which supplied font files correspond to that license.

These records are for project administration and rights verification. They do not need to be exposed to ordinary website visitors unless an applicable license specifically requires public attribution or another public notice.

If a webfont license includes attribution, domain, traffic, distribution, modification, renewal, or other conditions that affect implementation, those conditions must be followed during asset preparation and deployment.

### Font-Failure and Fallback Requirement

**Status: Final**

Possession of valid webfont licenses does not remove the requirement for graceful fallback behavior.

The site must remain usable if:

* A font request fails.
* A font file is blocked.
* A browser declines or delays the custom font.
* The visitor uses accessibility settings that alter typography.
* A production asset path is temporarily unavailable.
* A future licensing or technical decision requires substitution of the preferred typeface.

Typography must therefore be implemented through stable semantic roles rather than page-specific font declarations.

The design system should ultimately expose roles corresponding to:

* Script display typography.
* Titling/display typography.
* Body typography.
* Body emphasis/subtitle typography.

The actual font family attached to a role may change in the future without requiring the underlying components or document structure to be redesigned.

### Phase 4 Step 3 Decision

**Status: Final**

Edwardian Script ITC, Felix Titling, and Book Antiqua are approved for continued use in the wedding website's visual design system.

Separate webfont licenses have already been obtained for all three families.

Therefore:

1. No replacement typeface is required because of unresolved web-embedding rights.
2. All three approved font families may proceed into subsequent design and implementation work.
3. Only font files supplied under or specifically permitted by the corresponding webfont licenses may be bundled.
4. Ordinary locally installed desktop copies must not be treated as the website-distribution source unless the applicable license expressly permits that use.
5. License and purchase records must be retained privately.
6. Exact licensed WOFF2, WOFF, or other delivery formats must be recorded before the files are moved into the public application assets.
7. Appropriate fallback families remain mandatory.
8. The website must remain coherent and usable if the custom fonts fail to load.
9. The semantic typography roles must remain stable even if a font implementation later changes.

---

## Typography Roles and Heading Hierarchy

### Typography Hierarchy Principle

**Status: Final**

The website uses three approved typography families with distinct semantic responsibilities:

* **Edwardian Script ITC** for ornamental/script display typography.
* **Felix Titling** for formal titling, functional display typography, and numerals paired with Edwardian Script ITC.
* **Book Antiqua** for readable body, interface, informational, and supporting typography.

The hierarchy is intentionally decorative at its highest levels and progressively more functional as content becomes denser or more interactive.

Decorative typography must never be allowed to compromise comprehension, particularly within the RSVP workflow and other transactional states.

### Approved Visual Starting Scale

**Status: Final for hierarchy and relative relationships. Provisional for final browser-calibrated CSS values.**

The following values are the approved visual starting sizes established by the Visual Design Decisions.

They define the intended relative hierarchy.

They must **not** be treated as instructions to mechanically reproduce Word point measurements as CSS `pt` values.

During browser implementation:

* Preserve the relative hierarchy.
* Begin with CSS sizes that visually approximate these approved values.
* Test the results in actual browsers.
* Test representative mobile and desktop widths.
* Recalibrate where necessary for legibility, wrapping, responsive behavior, and the actual metrics of the licensed webfonts.
* Record calibrated changes in this document rather than altering typography values ad hoc in individual components.

| Role      | Edwardian Script treatment for letters | Numerals paired with Edwardian Script | Felix Titling-only alternative |
| --------- | -------------------------------------- | ------------------------------------- | ------------------------------ |
| Title     | Edwardian Script ITC Bold, 72          | Felix Titling Bold Italic, 48         | Felix Titling, 48              |
| Heading 1 | Edwardian Script ITC Bold, 48          | Felix Titling Bold Italic, 36         | Felix Titling, 36              |
| Heading 2 | Edwardian Script ITC Bold, 36          | Felix Titling Bold Italic, 28         | Felix Titling, 28              |
| Heading 3 | Edwardian Script ITC Bold, 28          | Felix Titling Bold Italic, 26         | Felix Titling, 26              |
| Heading 4 | Edwardian Script ITC Bold, 26          | Felix Titling Bold Italic, 24         | Felix Titling, 24              |

Supporting typography uses the following approved starting scale:

| Role      | Typeface and treatment        | Approved starting size |
| --------- | ----------------------------- | ---------------------- |
| Subtitle  | Book Antiqua Bold Italic      | 28                     |
| Hyperlink | Book Antiqua Bold, underlined | 16                     |
| Body      | Book Antiqua                  | 16                     |

The numeric scale above is part of the approved visual direction.

The eventual browser implementation values remain **Provisional** until the planned browser-calibration pass has been completed.

### Edwardian Script Numeral Rule

**Status: Final**

Edwardian Script ITC numerals must not be used in the website's ornamental/script display treatment.

Whenever text contains both letters and numerals and the letters are rendered in Edwardian Script ITC:

* Letters use the appropriate Edwardian Script ITC treatment for that hierarchy level.
* Numerals use Felix Titling Bold Italic.
* The Felix Titling numerals use the smaller paired size specified for that hierarchy level.

This rule applies wherever Edwardian Script ITC is used and numerals occur visually within the same title or heading.

For example, a decorative heading containing a date must not simply inherit Edwardian Script ITC across the entire string.

The letters and numerals must instead be capable of receiving their respective approved typography treatments.

The implementation should therefore allow mixed-font display text where necessary rather than forcing the entire heading into one font family.

### Title Role

**Status: Final for role. Provisional for final CSS size.**

The Title role is the highest decorative typographic level.

**Preferred treatment:**

* Letters: Edwardian Script ITC Bold.
* Approved visual starting size: 72.
* Numerals, when present: Felix Titling Bold Italic.
* Approved paired numeral size: 48.

**Felix-only alternative:**

* Felix Titling.
* Approved visual starting size: 48.

The Title role is appropriate for:

* The principal wedding title.
* The primary invitation-like display treatment.
* Other singular top-level display text where equivalent visual prominence is specifically justified.

The Title role should not be repeated excessively throughout a page.

It is intended to establish visual identity and hierarchy, not to serve as ordinary heading typography.

### Heading 1 Role

**Status: Final for role. Provisional for final CSS size.**

**Preferred ornamental treatment:**

* Letters: Edwardian Script ITC Bold.
* Approved visual starting size: 48.
* Numerals, when present: Felix Titling Bold Italic.
* Approved paired numeral size: 36.

**Felix-only alternative:**

* Felix Titling.
* Approved visual starting size: 36.

Heading 1 is appropriate for primary page-level headings where the page design supports an ornamental treatment.

A Felix Titling-only Heading 1 should be preferred where:

* The heading is long.
* The heading contains wording that becomes difficult to scan in script.
* The page is highly functional.
* The heading is associated with an RSVP or transactional state.
* Responsive wrapping makes the Edwardian treatment impractical.
* Accessibility or readability testing demonstrates that Felix provides a clearer result.

### Heading 2 Role

**Status: Final for role. Provisional for final CSS size.**

**Preferred ornamental treatment:**

* Letters: Edwardian Script ITC Bold.
* Approved visual starting size: 36.
* Numerals, when present: Felix Titling Bold Italic.
* Approved paired numeral size: 28.

**Felix-only alternative:**

* Felix Titling.
* Approved visual starting size: 28.

Heading 2 is appropriate for major sections within a page.

Edwardian Script ITC may be used when the heading is short and decorative treatment supports the page composition.

Felix Titling should be preferred for longer, more functional, or more frequently repeated section headings.

### Heading 3 Role

**Status: Final for role. Provisional for final CSS size.**

**Preferred ornamental treatment:**

* Letters: Edwardian Script ITC Bold.
* Approved visual starting size: 28.
* Numerals, when present: Felix Titling Bold Italic.
* Approved paired numeral size: 26.

**Felix-only alternative:**

* Felix Titling.
* Approved visual starting size: 26.

Heading 3 is appropriate for subordinate sections and grouped content where a visible heading remains necessary but should not compete with Heading 1 or Heading 2.

Because the visual-size difference between the Heading 3 ornamental treatment and its Felix alternative is relatively small, font choice, spacing, structure, and surrounding context must work together to communicate hierarchy.

### Heading 4 Role

**Status: Final for role. Provisional for final CSS size.**

**Preferred ornamental treatment:**

* Letters: Edwardian Script ITC Bold.
* Approved visual starting size: 26.
* Numerals, when present: Felix Titling Bold Italic.
* Approved paired numeral size: 24.

**Felix-only alternative:**

* Felix Titling.
* Approved visual starting size: 24.

Heading 4 is the lowest approved display-heading level in the current visual hierarchy.

It should be used selectively.

Do not create unnecessary heading depth merely to obtain a particular visual size. HTML heading structure must continue to represent the actual organization of the content.

### Subtitle Role

**Status: Final for role. Provisional for final CSS size.**

The approved Subtitle treatment is:

* Book Antiqua Bold Italic.
* Approved visual starting size: 28.

The Subtitle role is intended for supporting display text that complements a primary title or heading without functioning as another ornamental heading level.

Possible uses include:

* A short descriptive line beneath a title.
* Introductory contextual text.
* Invitation-like supporting text.
* A brief section lead where visual emphasis is useful but Edwardian Script ITC or Felix Titling would be excessive.

Subtitles should remain concise.

Long explanatory paragraphs should use the Body role rather than Subtitle styling.

### Hyperlink Role

**Status: Final for typography role. Provisional for final CSS calibration.**

The approved hyperlink typography is:

* Book Antiqua Bold.
* Underlined.
* Approved visual starting size: 16.

The underline is part of the approved starting treatment and helps ensure that hyperlinks remain identifiable independently of color.

Hyperlinks in ordinary text use Book Antiqua Bold.

Decorative script must not be used for ordinary link text.

A link must remain readable and identifiable if the custom Book Antiqua webfont fails and the fallback stack is used.

Navigation links may later receive component-specific treatment where appropriate, but their styling must preserve comparable readability and accessibility.

### Body Role

**Status: Final for role. Provisional for final CSS calibration.**

The approved body typography is:

* Book Antiqua.
* Approved visual starting size: 16.

Book Antiqua is the primary typography for readable and functional content throughout the site.

It should be used for:

* Ordinary paragraphs.
* Long-form narrative text.
* Form instructions.
* Field labels.
* Help text.
* Input-adjacent explanations.
* Validation messages.
* General error messages.
* Warning messages.
* Submission-uncertainty copy.
* Privacy information.
* FAQ answers.
* Venue and travel information.
* Schedule details.
* Other informational content requiring sustained readability.

Body typography must remain comfortable to read at both desktop and mobile widths.

The eventual CSS implementation may adjust the exact rendered size, line height, or related metrics during browser calibration, but it must preserve the approved hierarchy and remain suitable for long-form reading.

### Edwardian Script Usage

**Status: Final**

Edwardian Script ITC should be used sparingly.

Appropriate uses include:

* The main wedding title.
* Selected page titles.
* Short ornamental headings where readability remains strong.

Edwardian Script ITC should not be used merely because a piece of text is technically a heading.

Prefer Felix Titling when:

* The heading is long.
* The wording is informational rather than decorative.
* The text wraps awkwardly in script.
* The heading needs to be scanned quickly.
* The heading appears within a functional interface.
* Mobile presentation significantly reduces script readability.

Edwardian Script ITC must not be used for:

* Form labels.
* Error messages.
* Validation messages.
* Button labels.
* Dense instructional copy.
* Long-form paragraphs.
* Privacy text.
* Other interface text where ornament interferes with immediate comprehension.

### Felix Titling Usage

**Status: Final**

Felix Titling is the primary non-script display family.

Use Felix Titling for:

* Functional headings.
* Longer headings.
* RSVP state headings.
* Navigation-adjacent headings.
* Headings where Edwardian Script ITC becomes difficult to scan.
* Felix-only alternatives to the ornamental title and heading treatments.
* Numerals paired with Edwardian Script ITC.

Felix Titling provides the design system with a formal display treatment that preserves the site's vintage and invitation-like character while remaining more functional than script typography.

It should therefore serve as the preferred display fallback whenever the ornamental Edwardian treatment is inappropriate for the content or context.

### Book Antiqua Usage

**Status: Final**

Use Book Antiqua for:

* Body text.
* Form instructions.
* Field labels.
* Validation messages.
* Warning messages.
* Submission-uncertainty copy.
* Privacy information.
* FAQ answers.
* Long-form narrative content.
* Hyperlinks.
* Supporting informational text.

Book Antiqua Bold may be used where functional emphasis is required.

Book Antiqua Bold Italic provides the approved Subtitle role.

Book Antiqua should carry the majority of the site's text because it is the primary readable family in the design system.

### Decorative Typography Restrictions

**Status: Final**

Decorative script must never be used for:

* Form field labels.
* Validation messages.
* Error messages.
* Warning messages.
* Button text.
* Dense instructions.
* Long-form functional copy.

These restrictions apply even when a decorative treatment might visually match the surrounding page.

Transactional clarity takes priority over stylistic uniformity.

RSVP controls and status information may remain visually connected to the larger wedding design through:

* Color.
* Borders.
* Surfaces.
* Spacing.
* Small decorative motifs.
* Surrounding display headings.

The functional text itself must remain readily readable.

### Typography and Semantic HTML

**Status: Final**

Visual typography levels and semantic HTML heading levels are related but must not be treated as interchangeable concepts.

The markup must maintain a logical document structure.

Do not choose an HTML heading level solely because its default or custom visual styling produces the desired size.

Where necessary:

* Preserve the semantically correct HTML heading level.
* Apply the appropriate visual typography role through styling.

Likewise, visually styled text that is not actually a heading should not be promoted to heading markup solely to obtain display typography.

This distinction is important for:

* Screen-reader navigation.
* Document outline.
* Search interpretation.
* Keyboard and assistive-technology navigation.
* Long-term maintainability.

### Responsive Typography

**Status: Provisional**

The approved hierarchy establishes the visual relationships between typography roles, but final responsive behavior remains subject to browser calibration.

During implementation, typography must be tested for:

* Narrow phones.
* Larger phones.
* Tablets.
* Laptops.
* Desktop displays.
* Enlarged browser text.
* Browser zoom.
* Long headings.
* Headings containing numerals.
* Mixed Edwardian/Felix headings.
* Fallback-font rendering.

Responsive implementation may use techniques such as:

* `rem`-based sizing.
* `clamp()`.
* Breakpoint-specific adjustments.
* Controlled line lengths.
* Responsive spacing around headings.

No particular CSS mechanism is Final at this stage.

The requirement is that responsive scaling preserve:

1. Hierarchy.
2. Legibility.
3. Sufficient distinction between heading levels.
4. Practical wrapping.
5. Accessible enlarged-text behavior.
6. The intended visual relationship among Edwardian Script ITC, Felix Titling, and Book Antiqua.

### Mixed-Font Heading Implementation

**Status: Final requirement; implementation method Provisional**

Because Edwardian Script ITC numerals are prohibited, headings that combine letters and numerals may require separate styling within a single semantic heading.

The implementation must preserve the heading as one understandable semantic unit even if visual spans are used to apply different fonts.

For example, implementation may separate:

* Edwardian Script lettering.
* Felix Titling numerals.

However:

* The text must retain its correct reading order.
* The visual split must not create duplicate accessible text.
* Screen readers should encounter the heading naturally.
* The implementation must not require manually constructed inaccessible images of text.
* The heading should remain understandable if custom fonts fail.

The exact React/CSS implementation is deferred until the application styling phase.

### Font Weight and Style Implementation

**Status: To verify for supplied font-file mechanics; Final for intended visual treatment**

The approved visual hierarchy specifies treatments including:

* Edwardian Script ITC Bold.
* Felix Titling Bold Italic.
* Book Antiqua Bold.
* Book Antiqua Bold Italic.

These are the intended visual treatments established by the approved design decisions.

Before implementation, the licensed webfont packages must be inspected to determine which required weights and styles are supplied as distinct licensed files and how each package authorizes them to be used.

Do not invent or bundle an additional font file merely to match a style label.

Where a required treatment depends on browser-applied weight or italic styling rather than a separately supplied face, its rendered result must be checked during browser calibration.

If browser synthesis produces an unacceptable result, document the problem before changing the approved typography treatment.

### Line Height and Letter Spacing

**Status: Provisional**

No final line-height or letter-spacing values are established at Phase 4 Step 4.

These values must be calibrated in the browser because the three approved fonts have substantially different visual metrics.

The implementation should begin from readable defaults and then test:

* Whether Edwardian Script strokes collide across lines.
* Whether Felix Titling remains readable at display sizes.
* Whether Book Antiqua body text has comfortable vertical rhythm.
* Whether all-capital or titling treatments require additional tracking.
* Whether italic or bold-italic text remains visually distinct.
* Whether mobile wrapping creates crowded display typography.

Do not use extreme negative letter spacing or compressed line height merely to force decorative text into a predetermined space.

Typography should adapt to content rather than making content fit an inflexible ornamental frame.

### Browser Calibration Rule

**Status: Final**

The numeric sizes in this design system are approved visual starting values, not final CSS measurements.

When the Vite application and style files exist, browser calibration must:

1. Implement the approved hierarchy using CSS values that visually approximate the starting scale.
2. Test the actual licensed webfonts rather than relying only on word-processing previews.
3. Compare desktop and mobile rendering.
4. Test headings containing both letters and numerals.
5. Test Felix-only alternatives.
6. Test Book Antiqua body, subtitle, and hyperlink roles.
7. Test fallback-font behavior.
8. Test enlarged text and zoom.
9. Adjust provisional values where necessary.
10. Record all accepted calibrated values in this document.

Do not silently alter the typography hierarchy in component CSS.

If browser testing demonstrates that an approved relationship requires substantive redesign rather than ordinary calibration, document the issue before changing the governing visual decision.

### Typography Accessibility Rules

**Status: Final**

Typography must support the accessibility requirements of the site.

Accordingly:

* Decorative typography must not prevent text from being read.
* Important information must remain ordinary HTML text rather than text embedded only in an image.
* Text must remain understandable when custom fonts fail.
* Font size must not be locked in a way that prevents user enlargement.
* Text must remain usable under browser zoom.
* Headings must maintain logical semantic structure.
* Functional text must use readable typography.
* Links must remain identifiable.
* Italics, weight, font family, size, or color must not be the sole means of conveying essential meaning.
* Content must not overlap or become clipped when text is enlarged.
* Decorative script must not be used for dense or high-consequence interface information.

### Initial Typography Role Plan

**Status: Final for role names; Provisional for implementation values**

The eventual design-token system should provide stable semantic typography roles corresponding to at least:

* `font-display-script`
* `font-display-titling`
* `font-body`
* `font-body-emphasis`

And type-scale roles corresponding to:

* `text-title`
* `text-h1`
* `text-h2`
* `text-h3`
* `text-h4`
* `text-subtitle`
* `text-body`
* `text-link`

The exact CSS custom-property syntax and calibrated values are established in later Phase 4 and implementation work.

Individual React components should not independently recreate the approved typography hierarchy with unrelated hard-coded values.

### Phase 4 Step 4 Decision

**Status: Final**

The wedding website's typography system is approved as follows:

1. Edwardian Script ITC is the ornamental/script display family.
2. Felix Titling is the formal titling and functional display family.
3. Book Antiqua is the primary readable body and interface family.
4. Edwardian Script ITC numerals are prohibited.
5. Numerals appearing with Edwardian Script ITC lettering must use Felix Titling Bold Italic at the approved smaller paired size.
6. A Felix Titling-only alternative exists for every ornamental Title through Heading 4 level.
7. The approved visual starting hierarchy is:

   * Title: Edwardian 72 / paired Felix numerals 48 / Felix-only 48.
   * Heading 1: Edwardian 48 / paired Felix numerals 36 / Felix-only 36.
   * Heading 2: Edwardian 36 / paired Felix numerals 28 / Felix-only 28.
   * Heading 3: Edwardian 28 / paired Felix numerals 26 / Felix-only 26.
   * Heading 4: Edwardian 26 / paired Felix numerals 24 / Felix-only 24.
   * Subtitle: Book Antiqua Bold Italic 28.
   * Hyperlink: Book Antiqua Bold, underlined, 16.
   * Body: Book Antiqua 16.
8. The listed numeric sizes establish the approved visual scale but are not final CSS point measurements.
9. Final CSS typography values remain Provisional until browser calibration.
10. Edwardian Script ITC should be reserved for selected short decorative display text.
11. Felix Titling should be preferred for functional, longer, RSVP-related, navigation-adjacent, or otherwise difficult-to-scan headings.
12. Book Antiqua should carry body text and functional/informational copy.
13. Decorative script must not be used for form labels, error messages, button labels, or dense instructional copy.
14. Semantic HTML structure must remain independent from purely visual typography choices.
15. Mixed Edwardian/Felix headings must remain one coherent accessible text unit.
16. Responsive typography must preserve hierarchy, legibility, and enlarged-text usability.
17. Final line height, letter spacing, responsive scaling, and exact browser sizes remain Provisional.
18. The licensed webfont packages must be inspected before implementation to determine the available authorized files for required weights and styles.
19. Browser-calibrated changes must be recorded in this design system rather than introduced ad hoc in individual components.

---

## Semantic Color Roles

### Color-System Principle

**Status: Final**

The wedding website must use semantic color roles rather than scattering literal color values through individual pages and components.

A semantic color role describes **what a color does** in the interface rather than merely what the color looks like.

For example:

* Components should use the shared Title role rather than independently choosing their own gold.
* Buttons should use the Button role rather than independently assigning unrelated purple values.
* Navigation should use the Navigation role rather than defining a blue-green color inside each navigation component.
* Status messages should use shared Error, Warning, Success, Uncertainty, and Closed roles rather than inventing one-off values.

This structure is intended to:

* Keep the site visually consistent.
* Make later browser calibration manageable.
* Centralize accessibility corrections.
* Prevent slightly different versions of the same intended color from appearing across different components.
* Allow a semantic role to be recalibrated without rewriting every component that uses it.
* Keep decorative and functional color decisions distinguishable.

Exact approved semantic values must be defined centrally and consumed through shared tokens rather than hard-coded repeatedly throughout React component styles.

### Approved Semantic Color Palette

**Status: Final for the Step 5 color choices listed below.**

The following exact CSS values have been visually reviewed and approved as the Phase 4 Step 5 semantic palette.

| Role | Semantic token | Approved value | Visual role | Status |
| --- | --- | --- | --- | --- |
| Title | `--color-title` | `#8A6A22` | Deep antique gold | Final |
| Heading | `--color-heading` | `#8A6A22` | Deep antique gold | Final |
| Heading outline | `--color-heading-outline` | `#111111` | Near-black outline | Final |
| Heading shadow | `--color-heading-shadow` | `rgba(17, 17, 17, 0.38)` | Soft near-black display shadow | Final for color/opacity; geometry remains subject to browser calibration |
| Body text | `--color-body` | `#2F3952` | Navy-charcoal | Final |
| Hyperlink | `--color-link` | `#3D679C` | Darkened cornflower/light blue | Final |
| Hyperlink hover | `--color-link-hover` | `#31567F` | Darker blue interaction state | Final for color; behavior defined further in Step 7 |
| Hyperlink active | `--color-link-active` | `#263F64` | Deep blue pressed/active state | Final for color; behavior defined further in Step 7 |
| Visited hyperlink | `--color-link-visited` | `#334A7D` | Slate-indigo blue | Final |
| Navigation background | `--color-navigation-bg` | `#356B68` | Deep watercolor blue-green | Final |
| Navigation text | `--color-navigation-text` | `#F8F3EA` | Soft Ivory | Final |
| Primary button background | `--color-button-bg` | `#6F568E` | Deep heather/plum purple | Final |
| Primary button text | `--color-button-text` | `#F8F3EA` | Soft Ivory | Final |
| Decorative border | `--color-border-decorative` | `#B89548` | Antique Gold | Final |
| Primary readable surface | `--color-surface` | `#F8F3EA` | Soft Ivory | Final |
| Muted readable surface | `--color-surface-muted` | `#F5ECD8` | Wildflower Cream | Final |
| Focus | `--color-focus` | `#A83D78` | Ruby-rose | Final for color; complete focus treatment defined in Step 10 |
| Error | `--color-error` | `#8B3F49` | Deep dusty crimson | Final for color; complete status treatment defined in Step 9 |
| Warning | `--color-warning` | `#7A5A17` | Deep antique amber | Final for color; complete status treatment defined in Step 9 |
| Success | `--color-success` | `#3E6A48` | Deep garden green | Final for color; complete status treatment defined in Step 9 |
| Uncertainty | `--color-uncertainty` | `#5E567D` | Muted indigo-violet | Final for color; complete status treatment defined in Step 9 |
| Closed | `--color-closed` | `#5B5961` | Slate charcoal | Final for color; complete status treatment defined in Step 9 |

These exact values supersede the earlier Step 5 state in which the semantic directions were approved but the literal CSS values remained unresolved.

They remain subject to implementation verification in the sense that browser testing may reveal an accessibility or rendering problem requiring a new documented decision. They are not, however, merely candidate values: they are the currently approved project values and should be implemented as such unless later testing establishes a reason to revise them.

### Approved CSS Token Set

**Status: Final for Step 5 values.**

The eventual `client/src/styles/tokens.css` implementation should begin from the following color definitions:

```css
:root {
  /* Display typography */
  --color-title: #8A6A22;
  --color-heading: #8A6A22;
  --color-heading-outline: #111111;
  --color-heading-shadow: rgba(17, 17, 17, 0.38);

  /* Primary readable text */
  --color-body: #2F3952;

  /* Links */
  --color-link: #3D679C;
  --color-link-hover: #31567F;
  --color-link-active: #263F64;
  --color-link-visited: #334A7D;

  /* Navigation */
  --color-navigation-bg: #356B68;
  --color-navigation-text: #F8F3EA;

  /* Primary buttons */
  --color-button-bg: #6F568E;
  --color-button-text: #F8F3EA;

  /* Decorative framing */
  --color-border-decorative: #B89548;

  /* Readable content surfaces */
  --color-surface: #F8F3EA;
  --color-surface-muted: #F5ECD8;

  /* Keyboard focus */
  --color-focus: #A83D78;

  /* Semantic status colors */
  --color-error: #8B3F49;
  --color-warning: #7A5A17;
  --color-success: #3E6A48;
  --color-uncertainty: #5E567D;
  --color-closed: #5B5961;
}
```

This code block records the approved token values; it does not require `tokens.css` to be created during Phase 4. The actual style-file structure is established later in the project plan.

### Color Relationship to the Wedding Palette

**Status: Final**

The semantic palette is intentionally related to, but not identical with, the broader decorative wedding palette.

The approved interface colors draw from the established visual language as follows:

* `#8A6A22` deepens the antique/honey-gold family sufficiently for foreground display typography.
* `#B89548` preserves the existing Antique Gold as the lighter decorative-border role.
* `#2F3952` gives body copy a navy-charcoal character that harmonizes with the established navy, muted indigo, periwinkle, and slate-blue portions of the wedding palette.
* `#3D679C` preserves the cornflower/light-blue link direction while darkening it for readable foreground use.
* `#334A7D` shifts visited links toward slate-indigo so visited state is clearly distinct from the normal link state.
* `#356B68` interprets the navigation role as a painted-garden blue-green rather than a pure forest green or saturated teal.
* `#6F568E` deepens the heather/lavender-purple family sufficiently for a filled primary action.
* `#F8F3EA` preserves the established Soft Ivory as the primary readable surface and light interface text.
* `#F5ECD8` preserves the established Wildflower Cream as a quieter secondary readable surface.
* `#A83D78` introduces a ruby-rose focus accent that remains visually separate from ordinary links, navigation, buttons, and status colors.
* Error, Warning, Success, Uncertainty, and Closed colors use muted, vintage-compatible tones rather than highly saturated default web colors.

The broader decorative palette may continue to include lighter spring watercolor values that would not provide sufficient contrast for ordinary interface text. Decorative and semantic use must remain distinct.

### Title Color

**Semantic token:** `--color-title`

**Approved value:** `#8A6A22`

**Status: Final**

Title text uses the approved deep antique-gold role.

The primary Title treatment includes:

* Gold foreground: `#8A6A22`.
* Thin near-black outline: `#111111`.
* Soft near-black background shadow: `rgba(17, 17, 17, 0.38)`.

The approved gold provides approximately 4.56:1 contrast against the primary Soft Ivory surface `#F8F3EA` and approximately 4.29:1 against the Wildflower Cream muted surface `#F5ECD8`.

Because the Title role is large display typography, this provides a strong starting relationship while preserving the intended antique-gold appearance.

The outline and shadow remain decorative aids and must not be treated as substitutes for sufficient foreground/background contrast.

### Heading Color

**Semantic token:** `--color-heading`

**Approved value:** `#8A6A22`

**Status: Final**

Heading text uses the same approved deep antique-gold value as the Title role at Phase 4 Step 5.

Title and Heading remain separate semantic tokens even though they currently share the same value. This allows later browser calibration to adjust one role without forcing the other to change if the actual Edwardian Script ITC and Felix Titling rendering demonstrates a need for separate values.

The approved heading treatment includes:

* Gold foreground: `#8A6A22`.
* Thin near-black outline: `#111111` where the approved decorative display treatment applies.
* Soft near-black background shadow: `rgba(17, 17, 17, 0.38)` where the approved decorative display treatment applies.

Functional headings that do not use the decorative outline/shadow treatment must still remain readable against their actual surface.

### Heading Outline

**Semantic token:** `--color-heading-outline`

**Approved value:** `#111111`

**Status: Final for color; implementation technique remains subject to browser calibration.**

The approved display outline is near-black rather than pure decorative gray.

Its purpose is to:

* Reinforce display-letter definition.
* Support the invitation-like presentation.
* Help separate gold display typography from decorative surroundings.

The exact CSS technique—such as text stroke, carefully constructed text shadow, or another supported method—remains an implementation question to test later.

The visual result must remain acceptable when the preferred effect is unavailable.

### Heading Shadow

**Semantic token:** `--color-heading-shadow`

**Approved value:** `rgba(17, 17, 17, 0.38)`

**Status: Final for shadow color and opacity; Provisional for offset, blur, spread, and other geometry.**

The approved shadow uses the same near-black base as the display outline with reduced opacity.

The shadow should:

* Reinforce depth and decorative presentation.
* Remain subordinate to the foreground text.
* Avoid blurring the letterforms.
* Avoid creating a duplicate-text appearance.
* Avoid reducing readability over watercolor or illustrated backgrounds.

The actual shadow offset and blur must be calibrated in-browser with the licensed display fonts.

### Body Text Color

**Semantic token:** `--color-body`

**Approved value:** `#2F3952`

**Status: Final**

Body text uses a dark navy-charcoal rather than ordinary black or dark garden green.

This value is intended to:

* Harmonize with the established navy, muted indigo, slate-blue, and periwinkle portions of the wedding palette.
* Remain visually softer than pure black while still reading as a dark neutral in paragraphs.
* Preserve strong contrast for sustained Book Antiqua body copy.
* Remain clearly distinct from links and semantic status colors.

Approximate contrast:

* Against Soft Ivory `#F8F3EA`: 10.39:1.
* Against Wildflower Cream `#F5ECD8`: 9.78:1.

This provides substantial contrast margin for ordinary body copy, form instructions, labels, privacy text, FAQ answers, RSVP messaging, and other functional text.

### Hyperlink Color

**Semantic token:** `--color-link`

**Approved value:** `#3D679C`

**Status: Final**

Normal hyperlinks use a darkened cornflower/light-blue role.

The value preserves the approved light-blue direction while providing approximately:

* 5.25:1 contrast against Soft Ivory `#F8F3EA`.
* 4.94:1 contrast against Wildflower Cream `#F5ECD8`.

Ordinary content links also retain the approved Book Antiqua Bold and underlined treatment so that links remain identifiable independently of color.

### Visited Hyperlink Color

**Semantic token:** `--color-link-visited`

**Approved value:** `#334A7D`

**Status: Final**

Visited hyperlinks use the approved blue role in a deeper slate-indigo treatment.

Approximate contrast:

* Against Soft Ivory `#F8F3EA`: 7.86:1.
* Against Wildflower Cream `#F5ECD8`: 7.40:1.

The value is intentionally deeper than the normal link blue so that visited and unvisited links remain visibly distinguishable, especially on resource-heavy pages.

The underline and other link-identification requirements remain in force.

### Link Interaction States

**Status: Final for Step 5 colors; detailed behavior remains subject to Step 7.**

The approved starting link-state colors are:

* Normal: `#3D679C`.
* Hover: `#31567F`.
* Active/pressed: `#263F64`.
* Visited: `#334A7D`.
* Keyboard focus: reinforced using the separate Focus role `#A83D78` and the focus-treatment rules defined later in Phase 4.

The implementation must preserve visible link identification and must not rely solely on subtle hue changes.

Step 7 will define the complete button/link interaction treatment; Step 5 establishes the approved color vocabulary from which that treatment begins.

### Navigation Color

**Semantic token:** `--color-navigation-bg`

**Approved value:** `#356B68`

**Status: Final**

Navigation uses a deep watercolor blue-green surface.

This value is intended to feel like a muted painted-garden color rather than a saturated modern teal.

The approved navigation text color is:

`--color-navigation-text: #F8F3EA;`

Soft Ivory text provides approximately 5.50:1 contrast against the approved navigation background.

Navigation testing must still account for:

* Ordinary navigation items.
* Current-page indication.
* RSVP prominence.
* Hover states.
* Keyboard focus.
* Mobile-menu presentation.
* Enlarged text.
* Decorative borders or shadows adjacent to navigation.

Step 11 defines the complete sticky-navigation and mobile-menu styling.

### Primary Button Color

**Semantic token:** `--color-button-bg`

**Approved value:** `#6F568E`

**Status: Final**

Primary buttons use a deep heather/plum purple.

The approved button-label color is:

`--color-button-text: #F8F3EA;`

Soft Ivory text provides approximately 5.59:1 contrast against the approved purple surface.

The primary purple must remain visually distinct from:

* Ordinary links.
* Navigation.
* Decorative cards.
* Disabled controls.
* Selected form fields.
* Warning or status messages.

Step 7 defines complete button hover, active, focus, secondary, and disabled treatments.

### Button Text Color

**Semantic token:** `--color-button-text`

**Approved value:** `#F8F3EA`

**Status: Final**

Primary button text uses Soft Ivory.

This choice ties the button typography to the primary readable surface while providing strong contrast against the approved purple button background.

Disabled-button treatment remains to be defined in Step 7 and must not reduce button text below acceptable readability.

### Decorative Border Color

**Semantic token:** `--color-border-decorative`

**Approved value:** `#B89548`

**Status: Final**

Decorative borders retain the established Antique Gold.

This lighter gold is intentionally distinct from the deeper foreground display gold `#8A6A22`.

The decorative-border role may incorporate the approved thin near-black outline/background-shadow treatment where appropriate.

Decorative gold must not be confused with:

* Functional input borders.
* Error borders.
* Focus outlines.
* Ordinary card boundaries.

The decorative border is not ordinary body text and therefore does not need to satisfy the same foreground-text contrast relationship as the Title/Heading role.

### Surface Color

**Semantic token:** `--color-surface`

**Approved value:** `#F8F3EA`

**Status: Final**

The primary readable content surface uses the established Soft Ivory.

This surface should carry most dense text, RSVP content, long-form prose, and other readability-critical content when decorative page backgrounds are present.

The surface is intended to:

* Feel warmer and more invitation-like than pure white.
* Work with the approved navy-charcoal body text.
* Support the approved link, visited-link, status, button, and display-text palette.
* Provide a stable high-readability region over more decorative page treatments.

### Muted Surface Color

**Semantic token:** `--color-surface-muted`

**Approved value:** `#F5ECD8`

**Status: Final**

The muted surface uses the established Wildflower Cream.

Potential uses include:

* Secondary cards.
* Supporting informational regions.
* Subordinate content sections.
* Visually quieter readable areas.

The muted surface must not be used in a way that causes enabled content to appear disabled.

### Focus Color

**Semantic token:** `--color-focus`

**Approved value:** `#A83D78`

**Status: Final for color; complete focus-indicator treatment remains subject to Step 10.**

The focus role uses a strong ruby-rose accent deliberately separated from the ordinary blue link, blue-green navigation, purple action, green success, and crimson error families.

Approximate contrast:

* Against Soft Ivory `#F8F3EA`: 5.27:1.
* Against Wildflower Cream `#F5ECD8`: 4.96:1.

Because one color cannot be assumed to remain equally distinct against every light and dark component surface, Step 10 should still implement the approved focus color as part of a strong focus treatment, potentially including a two-layer ring, offset, shape, or contrasting companion layer.

### Error Color

**Semantic token:** `--color-error`

**Approved value:** `#8B3F49`

**Status: Final for color; complete status treatment remains subject to Step 9.**

Error uses a deep dusty crimson compatible with the vintage/watercolor aesthetic without resembling a bright default-web red.

Approximate contrast:

* Against Soft Ivory `#F8F3EA`: 6.54:1.
* Against Wildflower Cream `#F5ECD8`: 6.15:1.

Error meaning must always be communicated through text and appropriate accessible state, not crimson alone.

### Warning Color

**Semantic token:** `--color-warning`

**Approved value:** `#7A5A17`

**Status: Final for color; complete status treatment remains subject to Step 9.**

Warning uses a deep antique amber/ochre.

Approximate contrast:

* Against Soft Ivory `#F8F3EA`: 5.75:1.
* Against Wildflower Cream `#F5ECD8`: 5.41:1.

Warning meaning must remain clear independently of color.

### Success Color

**Semantic token:** `--color-success`

**Approved value:** `#3E6A48`

**Status: Final for color; complete status treatment remains subject to Step 9.**

Success uses a deep garden green.

Approximate contrast:

* Against Soft Ivory `#F8F3EA`: 5.65:1.
* Against Wildflower Cream `#F5ECD8`: 5.32:1.

A successful RSVP or other successful action must also be stated explicitly in text.

### Uncertainty Color

**Semantic token:** `--color-uncertainty`

**Approved value:** `#5E567D`

**Status: Final for color; complete status treatment remains subject to Step 9.**

Uncertainty uses a muted indigo-violet.

Approximate contrast:

* Against Soft Ivory `#F8F3EA`: 6.12:1.
* Against Wildflower Cream `#F5ECD8`: 5.76:1.

This role is especially important for submission states in which the application cannot safely tell the guest whether an operation completed.

It must remain semantically distinct from success, definite error, ordinary warning, service unavailable, and RSVP closed.

### Closed-State Color

**Semantic token:** `--color-closed`

**Approved value:** `#5B5961`

**Status: Final for color; complete status treatment remains subject to Step 9.**

The closed state uses a neutral slate charcoal.

Approximate contrast:

* Against Soft Ivory `#F8F3EA`: 6.24:1.
* Against Wildflower Cream `#F5ECD8`: 5.87:1.

The closed state must not look like an unexplained disabled input, application failure, successful submission, or ordinary warning.

It must be accompanied by explicit text explaining the state.

### Semantic Status Colors

**Status: Final for color assignments; complete message system remains subject to Step 9.**

The status roles are:

* Error: `#8B3F49`.
* Warning: `#7A5A17`.
* Success: `#3E6A48`.
* Uncertainty: `#5E567D`.
* Closed: `#5B5961`.

These roles remain semantically distinct even if their eventual Step 9 surfaces, borders, icons, or layout treatments share structural characteristics.

Meaning must come primarily from:

* Clear language.
* Headings or lead text.
* Context.
* Borders or surfaces where useful.
* Accessible announcement behavior where necessary.

Color serves as reinforcement.

### Contrast and State Testing Requirements

**Status: Final**

The approved values have acceptable initial contrast relationships for their intended baseline uses, but they must still be verified in the actual browser implementation and against any decorative backgrounds or altered component states.

At minimum:

1. Test body text against Soft Ivory and Wildflower Cream surfaces.
2. Test normal link text against every ordinary link background.
3. Test link hover state.
4. Test link keyboard-focus state.
5. Test link active state.
6. Test visited links.
7. Test primary button text against the purple button surface.
8. Test default primary-button state.
9. Test button hover state after Step 7 defines it.
10. Test button keyboard-focus state.
11. Test button active/pressed state after Step 7 defines it.
12. Test disabled-button readability after Step 7 defines it.
13. Test navigation text against the blue-green navigation surface.
14. Test navigation hover and current-page states after their styling is defined.
15. Test navigation keyboard focus.
16. Test status-message text and icons against their eventual Step 9 surfaces.
17. Test validation-error presentation.
18. Test warning presentation.
19. Test success presentation.
20. Test uncertainty presentation.
21. Test closed-state presentation.
22. Test selected form controls.
23. Test unselected form controls.
24. Test disabled form controls where they exist.
25. Test decorative gold text or borders against actual decorative backgrounds.
26. Verify that the interface remains understandable when color is removed.

Testing must use the actual licensed fonts, surfaces, backgrounds, and component states rather than judging isolated swatches alone.

If testing demonstrates that an approved value creates an accessibility or usability problem in a required context, record a new calibrated decision in this document before changing the token.

### Baseline Contrast Reference

**Status: Informational record of the approved starting relationships.**

Approximate WCAG-style contrast ratios for the approved foreground values against the principal readable surfaces are:

| Role | Foreground | On Soft Ivory `#F8F3EA` | On Wildflower Cream `#F5ECD8` |
| --- | --- | ---: | ---: |
| Title/Heading | `#8A6A22` | 4.56:1 | 4.29:1 |
| Body | `#2F3952` | 10.39:1 | 9.78:1 |
| Link | `#3D679C` | 5.25:1 | 4.94:1 |
| Visited link | `#334A7D` | 7.86:1 | 7.40:1 |
| Focus | `#A83D78` | 5.27:1 | 4.96:1 |
| Error | `#8B3F49` | 6.54:1 | 6.15:1 |
| Warning | `#7A5A17` | 5.75:1 | 5.41:1 |
| Success | `#3E6A48` | 5.65:1 | 5.32:1 |
| Uncertainty | `#5E567D` | 6.12:1 | 5.76:1 |
| Closed | `#5B5961` | 6.24:1 | 5.87:1 |

Additional primary component relationships:

* Soft Ivory `#F8F3EA` on Navigation `#356B68`: approximately 5.50:1.
* Soft Ivory `#F8F3EA` on Primary Button `#6F568E`: approximately 5.59:1.

These values are reference checks, not permission to skip browser, font, zoom, high-contrast, interaction-state, or decorative-background testing.

### Display Text Contrast

**Status: Final**

The thin near-black outline and background shadow surrounding gold display typography are part of the approved decorative treatment.

They do not eliminate the requirement for sufficient text/background contrast.

The implementation must not deliberately choose or preserve an otherwise unreadable treatment merely because the outline makes portions of the letterform visible.

The foreground, outline, shadow, background, font size, actual letterforms, and responsive rendering must be evaluated together.

If an ornamental background makes the approved gold display text difficult to read, acceptable solutions may include:

* Changing the background treatment.
* Adding or strengthening a readable surface behind the display text.
* Repositioning decorative imagery.
* Adjusting the provisional outline/shadow geometry.
* Choosing a less visually complex background.
* If necessary, documenting and approving a later calibrated change to the gold token.

Accessibility must not be solved solely by making shadows excessively heavy.

### Color Independence

**Status: Final**

No essential information may rely solely on semantic color.

The final interface must remain understandable if:

* Color perception is reduced.
* The display is rendered in grayscale.
* A high-contrast mode overrides project colors.
* Custom CSS colors fail to load.
* A user cannot reliably distinguish two hues.

Therefore:

* Errors require text.
* Warnings require text.
* Success requires text.
* Submission uncertainty requires text.
* Closed-state notices require text.
* Required fields require a textual or programmatic indication.
* Selected controls require a distinguishable state beyond color alone.
* Links retain a visible identification treatment.
* Focus requires a visible shape, outline, thickness, offset, or comparable treatment in addition to color where necessary.

### Decorative Palette Versus Semantic Interface Colors

**Status: Final**

The wider wedding palette and the semantic interface palette serve related but different purposes.

Decorative colors may be selected from or inspired by:

* Dark greens.
* Creams.
* Dusty rose.
* Lavender.
* Periwinkle.
* Navy.
* Antique gold.
* Watercolor wildflower tones.
* Brass-inspired tones.

However, semantic interface colors exist to communicate consistent functional roles.

A decorative purple used in an illustration is not automatically the Button color.

A decorative blue-green used in foliage is not automatically the Navigation color.

The lighter Antique Gold `#B89548` is not automatically the foreground Title/Heading gold; foreground display typography uses `#8A6A22`.

A decorative red or rose is not automatically the Error color.

This distinction allows artwork and visual compositions to remain expressive while the interface maintains a stable and testable semantic system.

### Color Use in RSVP Interfaces

**Status: Final**

RSVP interfaces inherit the same semantic color roles as the wider site but must apply them conservatively.

The RSVP experience should avoid:

* Highly saturated decorative surfaces behind form fields.
* Gold ornamental treatments around every control.
* Watercolor patterns that obscure labels or validation.
* Purple styling that makes non-buttons appear actionable.
* Blue-green styling that makes ordinary content resemble navigation.
* Status colors that compete with the form's primary action.

RSVP color should make the functional hierarchy clearer rather than more elaborate.

Decorative color may remain present in:

* Page framing.
* Section headings.
* Subtle motifs.
* Surrounding surfaces.
* Controlled borders.

The form itself should remain visually calm and unambiguous.

### Color Use in Public Informational Pages

**Status: Final**

Public informational pages may use a broader decorative palette provided semantic interface roles remain recognizable.

A page may contain substantial wildflower, watercolor, parchment, garden, gold, navy, green, rose, lavender, or periwinkle treatment without changing the meaning of:

* Links.
* Navigation.
* Buttons.
* Focus.
* Status messages.
* Functional controls.

The visual design should avoid using an interface-semantic color so pervasively that its functional meaning becomes difficult to recognize.

### Color Use with Background Imagery

**Status: Final**

Semantic color roles must be tested against actual background imagery.

Do not assume one text value will remain readable over every crop of a watercolor or photographic background.

Where necessary:

* Place text on a dedicated readable surface.
* Apply an appropriate overlay.
* Restrict decorative imagery to margins or framing areas.
* Use a solid-color fallback.
* Reposition imagery responsively.

Important functional text should not be placed directly over uncontrolled high-detail imagery.

### Color Tokens and Component Ownership

**Status: Final**

Individual components must consume semantic color roles rather than own their own copies of approved colors.

For example:

* A primary button should reference the Button semantic role.
* A normal body link should reference the Link role.
* A visited body link should reference the Visited Link role.
* Navigation should reference the Navigation role.
* Display headings should reference the Heading role.
* Status components should reference the appropriate status roles.

If a component requires a genuinely distinct reusable state, add or document an appropriate semantic token.

Do not create component-local values such as:

* `--rsvp-purple`
* `--travel-link-blue`
* `--faq-heading-gold`
* `--venue-nav-green`

when those values represent an already established shared semantic role.

### Future CSS Token Location

**Status: Final for architectural destination**

The eventual implementation will place semantic design tokens within:

`client/src/styles/tokens.css`

The exact file does not yet need to exist during Phase 4.

When it is created, it should centralize the semantic values defined by this design system.

Component styles should consume those tokens.

The implementation should make it possible to recalibrate a role such as `--color-link` or `--color-button-bg` in one centralized location.

### Browser Verification of Approved Colors

**Status: Final process**

The Step 5 color values are approved, but they must still be verified using the actual website implementation.

The verification pass should include representative examples of:

* Decorative title.
* H1-H4 headings.
* Body text.
* Subtitle text.
* Normal hyperlink.
* Hovered hyperlink.
* Active hyperlink.
* Visited hyperlink.
* Navigation.
* Primary button.
* Secondary action after Step 7 defines it.
* Form controls.
* Selected controls.
* Validation error.
* General error.
* Warning.
* Success.
* Submission uncertainty.
* Closed-state notice.
* Card.
* Decorative border.
* Soft Ivory surface.
* Wildflower Cream surface.
* Watercolor or image background.

If implementation testing demonstrates insufficient contrast, visual ambiguity, poor readability, or inconsistent hierarchy, revise the affected value through a documented design-system decision rather than silently changing component CSS.

### Phase 4 Step 5 Decision

**Status: Final**

The wedding website's semantic color system is approved as follows:

1. Color values must be centralized by semantic role rather than scattered through component files.
2. Title text uses Deep Antique Gold `#8A6A22`.
3. Heading text uses Deep Antique Gold `#8A6A22`.
4. Gold Title and Heading treatments use near-black outline `#111111` and shadow `rgba(17, 17, 17, 0.38)` where the approved decorative display treatment applies.
5. Body text uses Navy-Charcoal `#2F3952`.
6. Normal hyperlinks use Darkened Cornflower/Light Blue `#3D679C`.
7. Hyperlink hover uses `#31567F` as the approved Step 5 color, with final interaction behavior defined in Step 7.
8. Hyperlink active/pressed uses `#263F64` as the approved Step 5 color, with final interaction behavior defined in Step 7.
9. Visited hyperlinks use Slate-Indigo Blue `#334A7D`.
10. Navigation uses Watercolor Blue-Green `#356B68` with Soft Ivory text `#F8F3EA`.
11. Primary buttons use Deep Heather/Plum Purple `#6F568E` with Soft Ivory text `#F8F3EA`.
12. Decorative borders use Antique Gold `#B89548` with the approved outline/background-shadow treatment where appropriate.
13. The primary readable surface uses Soft Ivory `#F8F3EA`.
14. The muted readable surface uses Wildflower Cream `#F5ECD8`.
15. Keyboard focus uses Ruby-Rose `#A83D78`; the complete focus-indicator construction remains for Step 10.
16. Error uses Deep Dusty Crimson `#8B3F49`; the complete status-message construction remains for Step 9.
17. Warning uses Deep Antique Amber `#7A5A17`; the complete status-message construction remains for Step 9.
18. Success uses Deep Garden Green `#3E6A48`; the complete status-message construction remains for Step 9.
19. Submission uncertainty uses Muted Indigo-Violet `#5E567D`; the complete status-message construction remains for Step 9.
20. Closed state uses Slate Charcoal `#5B5961`; the complete status-message construction remains for Step 9.
21. Status colors reinforce meaning but must never be the sole means by which a state is communicated.
22. Decorative palette colors and functional semantic colors remain conceptually distinct.
23. RSVP interfaces should use semantic colors conservatively and prioritize functional clarity.
24. Public informational pages may use richer decorative color treatment without changing the meaning of functional semantic roles.
25. The approved colors must still be verified in their actual browser contexts, interaction states, fonts, surfaces, decorative backgrounds, enlarged-text conditions, and accessibility modes.
26. The black outline and shadow used with gold display typography are decorative aids and do not substitute for sufficient contrast.
27. Selected and unselected form controls must remain distinguishable without relying on color alone.
28. The interface must remain understandable when color is removed or overridden.
29. Any later color change required by browser or accessibility testing must be recorded in this design system rather than introduced ad hoc in components.
30. The eventual centralized implementation belongs in `client/src/styles/tokens.css`.

Phase 4 Step 5 is complete with the exact semantic CSS values, semantic role assignments, accessibility requirements, and browser-verification requirements documented here.

---

## Spacing and Readable-Width Tokens

### Spacing-System Principle

**Status: Provisional**

Spacing and maximum readable content widths were intentionally left open for browser calibration.

The project must nevertheless begin from one consistent provisional spacing system rather than allowing unrelated margins, gaps, and padding values to accumulate independently across pages and components.

The spacing scale is intended to provide a shared vocabulary for:

* Inline separation.
* Icon/control separation.
* Field and label spacing.
* Paragraph spacing.
* Card padding.
* Form-group spacing.
* Section-internal spacing.
* Separation between page sections.
* Large display composition.

The starting values documented in this section are implementation recommendations rather than irreversible visual decisions. They may be recalibrated after browser testing, but components should continue to consume shared tokens rather than replacing them with one-off values.

### Approved Provisional Spacing Scale

**Status: Provisional**

Use the following starting spacing scale:

| Token | CSS value | Approximate pixel equivalent at a 16px root | Intended starting role |
| --- | ---: | ---: | --- |
| `--space-1` | `0.25rem` | 4px | Very small internal separation |
| `--space-2` | `0.5rem` | 8px | Compact control/icon spacing |
| `--space-3` | `0.75rem` | 12px | Compact grouped content |
| `--space-4` | `1rem` | 16px | Ordinary control and paragraph separation |
| `--space-6` | `1.5rem` | 24px | Section-internal separation |
| `--space-8` | `2rem` | 32px | Section separation |
| `--space-12` | `3rem` | 48px | Major section separation |
| `--space-16` | `4rem` | 64px | Large desktop display separation |

The token numbering deliberately follows the approved Phase 4 naming scheme rather than implying that every integer between 1 and 16 must exist as a separate token.

Do not create additional spacing tokens merely to reproduce arbitrary values found in a mock-up. Add a new shared spacing role only when repeated browser implementation demonstrates that the existing scale cannot express a legitimate reusable need.

### Why Spacing Uses `rem`

**Status: Provisional implementation choice**

The initial CSS representation uses `rem` rather than fixed `px` values so the spacing system can scale coherently when a user's root text size differs from the browser default.

At a conventional 16px root size, the provisional values correspond exactly to the plan's recommended 4, 8, 12, 16, 24, 32, 48, and 64px starting scale.

This use of `rem` is not intended to make every visual gap grow without limit. Browser testing must verify that the spacing remains practical under:

* Enlarged default font settings.
* Browser zoom.
* Narrow mobile widths.
* Long navigation labels.
* Long form labels and validation text.
* Wrapped headings.
* Large touch controls.

If testing shows that a specific layout relationship requires a different responsive technique, preserve the semantic spacing role while adjusting the implementation deliberately rather than introducing component-local magic numbers.

### Very Small Separation — `--space-1`

**Value:** `0.25rem`

**Status: Provisional**

Use `--space-1` for very small internal relationships where two elements should clearly remain part of the same visual unit.

Potential uses include:

* Minimal icon-to-text adjustment where a larger gap would appear disconnected.
* Small internal decorative separations.
* Tight but intentional spacing between closely related inline elements.

Do not use this token as the default gap between independent interactive controls or dense lines of body text.

### Compact Control/Icon Spacing — `--space-2`

**Value:** `0.5rem`

**Status: Provisional**

Use `--space-2` for compact but clearly visible separation.

Potential uses include:

* Icon and visible text inside a control.
* Closely related metadata.
* Compact navigation-internal relationships.
* Small gaps between an input and a tightly associated non-error helper element where testing supports it.

This value should not be used to compress touch targets or to crowd radio buttons, checkboxes, or adjacent buttons.

### Compact Grouped Content — `--space-3`

**Value:** `0.75rem`

**Status: Provisional**

Use `--space-3` where related content needs more separation than an icon/text pair but should still read as one group.

Potential uses include:

* Closely related lines inside a card.
* Small label/help-text groupings.
* Compact stacked metadata.
* Minor internal card relationships.

### Ordinary Separation — `--space-4`

**Value:** `1rem`

**Status: Provisional**

Use `--space-4` as the principal ordinary spacing unit.

Potential uses include:

* Paragraph-to-paragraph separation where line-height and browser testing support it.
* Ordinary gaps between form controls within a tightly related group.
* Button-label/icon relationships when `--space-2` is too compact.
* Card-internal content spacing.
* Small stacked content groups.

Because `--space-4` is the baseline ordinary unit, it should appear more frequently than highly specialized intermediate values.

### Section-Internal Separation — `--space-6`

**Value:** `1.5rem`

**Status: Provisional**

Use `--space-6` to separate meaningful groups that remain within the same section or card.

Potential uses include:

* Form question groups.
* Heading-to-body relationships where more emphasis is needed than ordinary paragraph spacing.
* Card padding where later component testing supports this value.
* Separation between a lead sentence and a related control group.

### Section Separation — `--space-8`

**Value:** `2rem`

**Status: Provisional**

Use `--space-8` for visible separation between distinct sections or major groups that should remain visually related within the same page region.

Potential uses include:

* Adjacent form sections.
* Successive informational blocks.
* Ordinary page-section spacing on smaller screens.
* Separation between cards and nearby section copy.

### Major Section Separation — `--space-12`

**Value:** `3rem`

**Status: Provisional**

Use `--space-12` where page structure needs a clear visual break.

Potential uses include:

* Major public-page sections.
* Large changes in information topic.
* Separation before or after featured invitation-like callouts.
* Desktop and tablet section composition where `--space-8` is insufficient.

### Large Display Separation — `--space-16`

**Value:** `4rem`

**Status: Provisional**

Use `--space-16` sparingly for large display relationships, primarily at wider viewport sizes.

Potential uses include:

* Hero/title-region breathing room.
* Large desktop transitions between major decorative page regions.
* Deliberate invitation-like compositions that require substantial open space.

Do not force `--space-16` onto narrow mobile layouts merely because it is used on desktop. Responsive composition may step down to smaller shared tokens where necessary.

### Responsive Spacing Rule

**Status: Final process; individual values Provisional**

The spacing scale is shared across viewport sizes, but a component is not required to use the same spacing token at every width.

For example, a major section may legitimately use:

* `--space-8` on a narrow phone.
* `--space-12` on a tablet or ordinary desktop.
* `--space-16` in a wide display composition.

Responsive changes should move among approved spacing tokens wherever practical instead of introducing unrelated one-off values at each breakpoint.

The final choice must be based on actual content behavior rather than viewport width alone.

### Touch-Target Independence

**Status: Final**

Spacing tokens must not be confused with interactive target dimensions.

A small visual gap such as `--space-1` or `--space-2` does not authorize a control to become too small to operate.

Later button and form-control rules govern control height, padding, and touch-target requirements. If adequate touch targets require more space than the nearest decorative composition would otherwise use, interaction usability takes precedence.

### Readable-Width Principle

**Status: Provisional**

Readable text and form content should not expand indefinitely merely because the viewport is wide.

Full-width decorative backgrounds, illustrations, color fields, and other non-text presentation may extend beyond the ordinary content width. Dense reading and form interaction should remain inside controlled content containers.

The initial readable-width system defines three semantic layout roles:

* Long-form prose.
* Forms and transactional content.
* Ordinary public-page content.

These roles are starting targets and must be tested with the actual licensed fonts, final content, RSVP controls, and representative viewport sizes.

### Long-Form Prose Width

**Semantic token:** `--content-prose-max`

**Provisional starting value:** `46rem`

**Status: Provisional**

The governing Phase 4 plan recommends approximately 44–48rem for long-form prose. The initial implementation value is the midpoint:

`46rem`

Use this role for content whose primary purpose is sustained reading, including where appropriate:

* Our Story narrative sections.
* Privacy text.
* Long FAQ answers.
* Longer explanatory or thematic copy.
* Other prose-heavy content.

The container may become narrower naturally when the viewport is smaller than 46rem plus required page gutters.

Do not force a fixed width on narrow devices.

### Form Width

**Semantic token:** `--content-form-max`

**Provisional starting value:** `46rem`

**Status: Provisional**

The governing Phase 4 plan recommends approximately 42–48rem for forms depending on control length. The initial implementation begins at:

`46rem`

This width provides room for explanatory copy and longer controls while keeping the RSVP experience visually contained.

Use this role for:

* RSVP entry content.
* RSVP questions.
* Confirmation-preference controls.
* Validation and help copy associated with the form.
* Other transactional form regions.

The actual rendered form remains single-column on narrow screens.

Controls should generally fill the available form-content width when doing so improves usability, but individual short controls do not need to be artificially stretched when a narrower intrinsic or component-level maximum is more appropriate.

### Ordinary Public-Page Content Width

**Semantic token:** `--content-site-max`

**Provisional starting value:** `68rem`

**Status: Provisional**

The governing Phase 4 plan recommends approximately 64–72rem for ordinary public-page content. The initial implementation uses the midpoint:

`68rem`

Use this role for ordinary page composition containing combinations of:

* Headings.
* Text.
* Cards.
* Images.
* Resource links.
* Venue information.
* Travel information.
* Schedule content.
* FAQ groupings.

A `68rem` site container is not a requirement that paragraphs themselves stretch to 68rem. Prose-heavy regions nested inside an ordinary page should use the narrower `--content-prose-max` role where appropriate.

### Decorative Full-Width Regions

**Status: Final**

Full-width decorative backgrounds may exceed `--content-site-max`.

Examples may include:

* Hero backgrounds.
* Watercolor fields.
* Decorative garden imagery.
* Full-width section backgrounds.
* Borders or framing compositions intended to reach the viewport edge.

Important text placed inside such a region must still remain within an appropriate readable content container unless a deliberately shorter display element has been separately validated.

A full-width background is not permission to allow long paragraphs or form controls to span the full viewport.

### Content Width and Page Gutters

**Status: Provisional**

The content maximum establishes the upper bound of the readable region; it does not by itself define the minimum horizontal space between content and the viewport edge.

Page gutters should be built from the shared spacing system and calibrated in-browser.

A reasonable starting approach is to use a smaller shared spacing token on narrow screens and a larger token at wider widths, for example:

* Narrow screens: `--space-4`.
* Comfortable tablet/desktop widths: `--space-6` or `--space-8` where composition supports it.

The exact page-gutter policy remains Provisional because final header behavior, mobile navigation, background imagery, and actual content wrapping have not yet been tested.

### Width and Accessibility Rules

**Status: Final**

Content-width limits must not create accessibility problems.

Accordingly:

* Content containers must shrink fluidly below their maximum width.
* Horizontal scrolling must not be required for ordinary text at normal responsive widths.
* Enlarged text must be allowed to reflow.
* Form controls must not overflow their container when labels or values become longer.
* Validation and status messages must wrap naturally.
* Decorative borders must expand with content rather than clipping enlarged text.
* Long links must wrap where necessary.
* A maximum readable width must never become a fixed minimum width.

### Initial Spacing and Width Token Set

**Status: Provisional**

The eventual `client/src/styles/tokens.css` implementation should begin with the following spacing and layout values:

```css
:root {
  /* Spacing */
  --space-1: 0.25rem;  /* 4px at 16px root */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */

  /* Readable content widths */
  --content-prose-max: 46rem;
  --content-form-max: 46rem;
  --content-site-max: 68rem;
}
```

These definitions document the Phase 4 Step 6 starting values. The actual stylesheet does not need to be created during Phase 4.

### Avoid One-Off Layout Values

**Status: Final**

Components should not introduce arbitrary values merely to make one screenshot look correct.

Avoid patterns such as:

* One card using 19px padding while another equivalent card uses 21px.
* One section using a unique 37px margin because it visually appears close to the intended spacing.
* One RSVP question using a custom gap unrelated to the rest of the form.
* Separate page-specific maximum widths when the existing prose, form, or site role already describes the content.

Where a component genuinely needs a distinct reusable relationship, first determine whether an existing spacing or width token can express it. If not, document the new semantic need before adding another token.

### Browser Calibration Requirements for Spacing

**Status: Final process**

The spacing scale must later be tested with representative real content, including:

* Short and long titles.
* Mixed Edwardian/Felix headings containing numerals.
* Multi-paragraph prose.
* Short and long navigation labels.
* RSVP labels and help text.
* Radio and checkbox groups.
* Validation errors.
* Warning, success, uncertainty, and closed-state messages.
* Cards containing different amounts of content.
* Decorative borders.
* Background imagery.
* Mobile-menu content.

Review whether:

* Related items remain visually grouped.
* Unrelated sections have sufficient separation.
* Narrow screens do not feel unnecessarily spacious.
* Wide screens do not feel visually empty or disconnected.
* Touch targets retain adequate separation.
* Decorative elements do not consume space needed for functional content.
* Enlarged text does not collide with neighboring content.

If calibration changes a token, update the shared token rather than compensating in every component that uses it.

### Browser Calibration Requirements for Readable Width

**Status: Final process**

Test the provisional width values at representative phone, tablet, laptop, and desktop widths.

For `--content-prose-max`, evaluate:

* Comfortable line length in Book Antiqua.
* Paragraph scanning.
* Long-form narrative rhythm.
* Privacy and FAQ readability.

For `--content-form-max`, evaluate:

* Label wrapping.
* Long option text.
* Input and select lengths.
* Help text.
* Validation messages.
* Confirmation-preference controls.
* Single-column mobile behavior.

For `--content-site-max`, evaluate:

* Card layouts.
* Image/text relationships.
* Venue and travel information.
* Schedule presentation.
* FAQ groupings.
* Decorative compositions.

A width should be revised only when actual browser testing demonstrates that the approved starting target weakens readability, responsiveness, or visual balance.

### Phase 4 Step 6 Decision

**Status: Provisional values; Final token architecture and calibration process**

The Phase 4 Step 6 spacing and readable-width system is established as follows:

1. Spacing must use a shared semantic scale rather than unrelated component-specific values.
2. `--space-1` begins at `0.25rem` / approximately 4px.
3. `--space-2` begins at `0.5rem` / approximately 8px.
4. `--space-3` begins at `0.75rem` / approximately 12px.
5. `--space-4` begins at `1rem` / approximately 16px.
6. `--space-6` begins at `1.5rem` / approximately 24px.
7. `--space-8` begins at `2rem` / approximately 32px.
8. `--space-12` begins at `3rem` / approximately 48px.
9. `--space-16` begins at `4rem` / approximately 64px.
10. `--content-prose-max` begins at `46rem`, within the plan's recommended approximately 44–48rem range.
11. `--content-form-max` begins at `46rem`, within the plan's recommended approximately 42–48rem range.
12. `--content-site-max` begins at `68rem`, within the plan's recommended approximately 64–72rem range.
13. Full-width decorative backgrounds may exceed the ordinary site-content maximum, but readable text remains constrained to an appropriate readable container.
14. Prose nested inside a wider public-page layout should use the narrower prose role where appropriate.
15. Forms remain fluid and single-column on narrow screens.
16. Maximum widths must never behave as fixed minimum widths.
17. Page gutters should use the shared spacing scale and remain Provisional until browser calibration.
18. Responsive layouts may move among shared spacing tokens rather than using one identical gap at every viewport width.
19. Touch-target requirements take priority over compact decorative spacing.
20. Exact spacing and content-width values remain Provisional until tested with the actual fonts, components, RSVP content, decorative assets, and representative viewport widths.
21. Any accepted calibration change must be recorded in this design system rather than introduced ad hoc in component CSS.
22. The eventual centralized implementation belongs in `client/src/styles/tokens.css`.

Phase 4 Step 6 is complete with the provisional spacing scale, readable-width targets, token assignments, responsive rules, accessibility requirements, and browser-calibration process documented here.

