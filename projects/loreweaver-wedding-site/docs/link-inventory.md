# Wedding Website Link and Asset Inventory

## Purpose

This document records the external links, email actions, downloadable files, local visual assets, cross-channel URLs, and post-wedding media required for the Loreweaver Creations wedding website.

It is the separate inventory permitted by Phase 2 Step 7 rather than an expansion of `docs/content-inventory.md`.

This document must remain consistent with:

- `docs/content-inventory.md`
- `docs/requirements.md`
- `docs/decisions.md`
- `docs/route-inventory.md`
- `docs/page-outlines.md`
- `docs/sitemap.md`
- `docs/wireframes.md`
- `docs/rsvp-system-design.md`

Canonical links between pages beneath `/wedding/` are governed by `route-inventory.md` and `sitemap.md`. They are not repeated here as individual inventory rows unless a cross-channel or downloadable asset requires separate verification.

RSVP lookup, submission, safe-retry, explicit replace-or-clear, idempotency, storage, and delivery-status operations are application behaviors rather than ordinary links or assets. They remain governed by `requirements.md`, `decisions.md`, `route-inventory.md`, `page-outlines.md`, `sitemap.md`, `wireframes.md`, and `rsvp-system-design.md`. This inventory records only the external, email, cross-channel, downloadable, local-asset, or post-wedding resources used by those states.

---

# Inventory Fields

Every row records:

- **ID:** Stable link-or-asset inventory identifier.
- **Page:** The principal page or surface using the item.
- **Link or Asset:** The resource to be selected, prepared, or verified.
- **Type:** External link, email link, local asset, downloadable file, cross-channel URL, or post-wedding media.
- **Final URL/File Available?:** Whether the final production URL or file is presently available.
- **Owner:** The person or source responsible for supplying or approving it.
- **Verification Needed?:** The outstanding review required before publication.
- **Source Content Item:** The corresponding `content-inventory.md` record.
- **Launch Requirement:** Whether the item is required for invitation launch, recommended, post-wedding only, or not applicable.
- **Notes:** Publication, rights, accessibility, or technical constraints.

---

# Availability Definitions

Use only the following values in the **Final URL/File Available?** column:

- **Yes:** The final destination or file is known and available.
- **Partial:** Candidate material or underlying content exists, but the final production URL, file, format, selection, or web-ready version is incomplete.
- **No:** No final production URL or file has been selected or prepared.
- **Pending:** The item depends on a future contract, event, approval, or delivery.
- **Not applicable:** The final project does not require the item.

---

# Verification Definitions

Use the following values in the **Verification Needed?** column:

- **No:** No further verification is required beyond ordinary implementation testing.
- **Yes:** General content, destination, or production verification remains.
- **Rights review:** Publication ownership, permission, or licensing must be confirmed.
- **Accessibility review:** Alternative text, labeling, contrast, captions, transcripts, or accessible file behavior must be reviewed.
- **Technical review:** File format, responsive behavior, download behavior, HTTPS, redirect behavior, or browser handling must be tested.
- **Contract confirmation:** The resource depends on a signed or finalized vendor arrangement.
- **Post-wedding review:** The item must be reviewed for publication after the wedding.
- **Not applicable:** No verification is needed because the item is excluded.

A row may list more than one review.

---

# Link and Asset Rules

## Internal links

Links between canonical wedding-site routes:

- Open in the same browser tab.
- Use the routes defined in `route-inventory.md`.
- Must not place invitation codes, guest identities, RSVP answers, confirmation destinations, client submission identifiers, delivery details, or private administrative values in URLs.
- Recovery, delivery-warning, and refresh-fallback links may return guests only to approved canonical routes such as `/wedding/rsvp/` or `/wedding/`; they must not replay a prior submission or reconstruct personalized state from URL data.
- A safe retry after an uncertain submission is an in-application submission action, not a code-bearing or payload-bearing hyperlink. It must preserve the original client submission identifier so that the backend can respond idempotently.
- Explicit replace, zero-value, decline, and clear operations are form controls or submitted values rather than separate browser destinations. Omission remains a no-change operation and must not be represented through a link.

## External links

External media, hotel, and map links:

- Open in a new browser tab.
- Use appropriate security attributes.
- Include an accessible indication that a new tab will open.
- Must use lawful and reputable destinations.
- Must be tested immediately before invitation launch.
- Must be rechecked periodically when availability is likely to change.

## Email links

Email actions must:

- Use the approved address exactly.
- Provide a meaningful visible label rather than exposing only a raw `mailto:` URL where context is needed.
- Avoid placing invitation codes, RSVP answers, confirmation destinations, submission identifiers, or other private RSVP information automatically into a subject line, body parameter, or URL.
- Be tested on supported desktop and mobile browsers.
- Use `RSVPhelp@loreweavercreations.com` for approved guest-facing assistance from RSVP entry, validated-form, service-unavailable, submission-uncertain, delivery-warning, confirmation-refresh, FAQ, and footer contexts.
- Never expose the protected administrative confirmation recipient as a guest-facing email action, page value, link target, or browser metadata field. Guest-facing confirmation states may report only a limited administrative delivery-attempt status.

## Local assets and downloads

Local visual assets and downloadable files must:

- Use web-appropriate formats.
- Have stable production filenames or content-managed identifiers.
- Be optimized for their intended display or download purpose.
- Include alternative text or accessible descriptions when informational.
- Be reviewed for publication rights.
- Avoid embedding private metadata where practical.
- Not contain copyrighted source media that the project is not authorized to distribute.

## QR-code verification

The static QR code printed on the invitations must resolve to:

`https://www.loreweavercreations.com/wedding/`

The QR code does not contain an invitation code and does not open a personalized RSVP URL.

## Copyright restriction

Do not add a copyrighted image, book file, audiobook file, full-length film, or public share containing those works to the production asset list unless its public use and distribution are affirmatively authorized.

---

# Invitation-Launch Required Inventory

| ID | Page | Link or Asset | Type | Final URL/File Available? | Owner | Verification Needed? | Source Content Item | Launch Requirement | Notes |
|---|---|---|---|---|---|---|---|---|---|
| LI-HOME-001 | Home | Hero image or introductory artwork | Local asset | Partial | Couple | Rights review; accessibility review; technical review | CI-HOME-005 | Required | Select the final image or artwork, confirm publication rights, prepare responsive crops or sizing, and supply appropriate alternative text. The asset must not obscure the RSVP action. |
| LI-HOME-002 | Printed invitation → Home | Static QR-code destination | Cross-channel URL | Yes | Couple; application | Yes; technical review | CI-HOME-007 | Required | Final destination is `https://www.loreweavercreations.com/wedding/`. Test the actual printed QR code from multiple representative phones before mailing. Confirm HTTPS, redirect behavior, and homepage availability. |
| LI-RSVP-001 | RSVP entry and validated form; service-unavailable, submission-uncertain, delivery-warning, and confirmation-refresh states; FAQ; footer | RSVP assistance email action | Email link | Yes | Couple; application | Yes; technical review | CI-RSVP-007; CI-SITE-004; CI-SITE-006; CI-CONFIRM-006; CI-CONFIRM-010; CI-CONFIRM-014 | Required | Use `RSVPhelp@loreweavercreations.com`. Test the visible label and `mailto:` behavior in every applicable state. Do not automatically include invitation codes, RSVP answers, confirmation destinations, submission identifiers, or other private RSVP details in the email subject, body, or URL. |
| LI-THEME-001 | Theme and Attire | Guest color-palette web graphic | Local asset | Partial | Couple; existing palette | Accessibility review; technical review | CI-THEME-003 | Required | The palette content exists but needs final approval and a web-ready presentation. Color names and written values must remain available without relying only on the graphic. |
| LI-THEME-002 | Theme and Attire | Outfit-example asset set | Local assets, illustrations, photographs, or external references | Partial | Couple | Rights review; accessibility review | CI-THEME-004 | Required | Final presentation method remains to be selected. Any public image or external reference must be approved and described accessibly. |
| LI-THEME-003 | Theme and Attire | Inspiration-image set | Local assets or approved external references | No | Couple | Rights review; accessibility review | CI-THEME-008 | Required | Collect the final set only after confirming that each image may be published or linked. Do not place unreviewed fan art, concept art, or copyrighted images in public assets. |
| LI-MEDIA-001 | Read, Listen, and Watch | Paperback retailer | External link | No | Couple; authorized retailer | Yes | CI-MEDIA-003 | Required | Select and verify at least one lawful purchase source. Confirm that the link resolves to the correct title and edition. |
| LI-MEDIA-002 | Read, Listen, and Watch | Library book search or catalog | External link | No | Couple; library service | Yes | CI-MEDIA-003 | Required | Select a lawful library-discovery option. Prefer a durable search or title page rather than a temporary session URL. |
| LI-MEDIA-003 | Read, Listen, and Watch | Audiobook purchase source | External link | No | Couple; authorized audiobook retailer | Yes | CI-MEDIA-005 | Required | Verify the correct audiobook title, edition, narrator where relevant, and regional availability. |
| LI-MEDIA-004 | Read, Listen, and Watch | Audiobook subscription or listening service | External link | No | Couple; authorized service | Yes | CI-MEDIA-005 | Required | Verify that the destination is lawful and accurately describes access requirements. |
| LI-MEDIA-005 | Read, Listen, and Watch | Audiobook library source | External link | No | Couple; library service | Yes | CI-MEDIA-005 | Required | Prefer a durable catalog or search destination. Do not link to an unauthorized downloadable copy. |
| LI-MEDIA-006 | Read, Listen, and Watch | Film streaming source | External link | No | Couple; authorized streaming service | Yes | CI-MEDIA-007 | Required | Verify title, version, language options where relevant, region, and current availability immediately before launch. |
| LI-MEDIA-007 | Read, Listen, and Watch | Film rental source | External link | No | Couple; authorized rental service | Yes | CI-MEDIA-007 | Required | Verify that the film can currently be rented lawfully and that the destination opens the intended title. |
| LI-MEDIA-008 | Read, Listen, and Watch | Film purchase source | External link | No | Couple; authorized retailer | Yes | CI-MEDIA-007 | Required | Verify format and regional availability. Do not imply that the site itself sells or hosts the film. |
| LI-MEDIA-009 | Read, Listen, and Watch | Film library or lawful borrowing source | External link | No | Couple; library service | Yes | CI-MEDIA-007 | Required | Prefer a stable search or catalog destination rather than a temporary authenticated session link. |
| LI-VENUE-001 | Venues | Warinanco Park ceremony map | External map link | No | Couple; venue; mapping service | Yes; technical review | CI-VENUE-010 | Required for Configuration A readiness | Verify the correct guest entrance, drop-off point, or parking destination rather than linking only to a broad park boundary. Prepare even if Configuration B is initially active. |
| LI-VENUE-002 | Venues | Sphinx Banquet and Catering Center map | External map link | No | Couple; venue; mapping service | Yes; technical review | CI-VENUE-010 | Required | Verify the address, guest entrance, parking destination, and map pin for 121 E 2nd Avenue, Roselle, NJ 07203. |
| LI-TRAVEL-001 | Travel | Hotel-block reservation page or approved booking instructions | External link or booking instructions | Pending | Couple; selected hotel | Contract confirmation; technical review | CI-TRAVEL-001; CI-TRAVEL-002 | Required | Add only after the hotel and room block are finalized. Verify group code, rate, dates, booking deadline, cancellation information, and accessibility details. |
| LI-TRAVEL-002 | Travel | Selected hotel property map | External map link | Pending | Couple; selected hotel; mapping service | Contract confirmation; technical review | CI-TRAVEL-001 | Required after hotel selection | Verify the exact selected property and appropriate guest arrival destination. |
| LI-TRAVEL-003 | Travel | Hotel accessibility information source | External link or approved hotel document | Pending | Selected hotel | Contract confirmation; accessibility review | CI-TRAVEL-001; CI-TRAVEL-002 | Required after hotel selection | Use verified property-specific information. Do not infer accessibility from a generic brand page. |
| LI-SITE-001 | All pages containing external links | Accessible new-tab notice treatment | Interface text or icon-plus-text asset | Partial | Application; couple | Accessibility review; technical review | CI-SITE-007 | Required | Decide whether external links use visible text, accessible-name text, an icon with hidden text, or a consistent combination. Essential meaning must not depend on an unexplained icon alone. |

---

# Recommended or Conditional Pre-Wedding Inventory

| ID | Page | Link or Asset | Type | Final URL/File Available? | Owner | Verification Needed? | Source Content Item | Launch Requirement | Notes |
|---|---|---|---|---|---|---|---|---|---|
| LI-THEME-004 | Theme and Attire | Wedding-party design-guide downloads | Downloadable files | Partial | Couple; existing design guides | Rights review; accessibility review; technical review | CI-THEME-009 | Recommended | Confirm which guides are appropriate for public or restricted-public access. Prepare final filenames, file formats, accessible headings, and download labels. |
| LI-STORY-001 | Our Story | Relationship-story photographs | Local assets | Partial | Couple | Rights review; accessibility review; technical review | CI-STORY-004 | Recommended | Select only approved photographs. Prepare responsive versions and meaningful alternative text where the image conveys information. |
| LI-TRAVEL-004 | Travel | Train-service information or trip-planning source | External link | No | Couple; public transportation source | Yes | CI-TRAVEL-005 | Recommended | Use current official or otherwise reliable sources. Avoid promising travel times. |
| LI-TRAVEL-005 | Travel | Airport information source | External link | No | Couple; airport or transportation source | Yes | CI-TRAVEL-006 | Recommended | Link only where it adds useful planning value. Do not imply guaranteed airport-to-venue travel times. |
| LI-TRAVEL-006 | Travel | Local public-transportation information | External link | No | Couple; transportation source | Yes | CI-TRAVEL-007 | Recommended | Verify that the source is current and relevant to the selected hotel and active venue configuration. |
| LI-TRAVEL-007 | Travel | Taxi or ride-sharing information | External link or informational reference | No | Couple; public sources | Yes | CI-TRAVEL-008 | Recommended | Do not guarantee availability, pricing, wait times, or service area. A written advisory may be preferable to provider links. |
| LI-TRAVEL-008 | Travel | Driving-directions destination for active venue configuration | External map link | No | Couple; mapping service | Yes; technical review | CI-TRAVEL-009 | Recommended | Use the verified venue or parking destination. Configuration A may require separate ceremony and reception destinations. |
| LI-TRAVEL-009 | Travel | Between-venue directions for Configuration A | External map link | No | Couple; mapping service | Yes; technical review | CI-TRAVEL-009 | Conditional on Configuration A | Verify Warinanco-to-Sphinx routing. Present the 12:00–12:30 p.m. period as travel between venues, not a cocktail hour. |
| LI-FAQ-001 | FAQ | Confirmed mimosa-station information | Guest-facing text; no separate link required | Pending | Couple; Sphinx Banquet and Catering Center | Contract confirmation | CI-SCHEDULE-010; CI-FAQ-023 | Conditional | Do not publish the FAQ item or any related asset until the arrangement is confirmed. It must not be presented as a formal cocktail hour. |

---

# Post-Wedding Inventory

| ID | Page | Link or Asset | Type | Final URL/File Available? | Owner | Verification Needed? | Source Content Item | Launch Requirement | Notes |
|---|---|---|---|---|---|---|---|---|---|
| LI-GALLERY-001 | Gallery | Professional wedding photograph master files | Post-wedding media | Pending | Photographer; couple | Post-wedding review; rights review | CI-GALLERY-004 | Post-wedding only | Confirm delivery rights, publication permissions, credits if required, and any contractual restrictions. |
| LI-GALLERY-002 | Gallery | Approved guest photograph files | Post-wedding media | Pending | Guests; couple | Post-wedding review; rights review | CI-GALLERY-005 | Post-wedding only | Establish submission, permission, review, and removal procedures before publication. |
| LI-GALLERY-003 | Gallery | Wedding video master or delivery files | Post-wedding media | Pending | Videographer; guests; couple | Post-wedding review; rights review | CI-GALLERY-006 | Post-wedding only | Prepare web-appropriate streaming versions rather than loading original files directly as page previews. |
| LI-GALLERY-004 | Gallery | Optimized photograph thumbnails and previews | Local post-wedding assets | Pending | Couple; application | Post-wedding review; accessibility review; technical review | CI-GALLERY-008 | Post-wedding only | Generate optimized previews after approved photographs are selected. Preserve meaningful captions or alternative text. |
| LI-GALLERY-005 | Gallery | Optimized video previews or poster frames | Local post-wedding assets | Pending | Couple; application | Post-wedding review; accessibility review; technical review | CI-GALLERY-006; CI-GALLERY-008 | Post-wedding only | Provide captions, transcripts, or other accessible alternatives where appropriate. |
| LI-GALLERY-006 | Gallery | Original-resolution photograph download links | External or Nextcloud download links | Pending | Couple; Nextcloud | Post-wedding review; rights review; technical review | CI-GALLERY-009 | Post-wedding only | Keep original-resolution downloads separate from ordinary previews. Publish only approved wedding-owned or appropriately licensed material. |
| LI-GALLERY-007 | Gallery | Approved video download links | External or Nextcloud download links | Pending | Couple; Nextcloud | Post-wedding review; rights review; technical review | CI-GALLERY-006; CI-GALLERY-009 | Post-wedding only | Offer downloads only when rights, file size, privacy, and guest access treatment have been reviewed. |
| LI-GALLERY-008 | Gallery | Album or category cover assets | Local post-wedding assets | Pending | Couple; application | Post-wedding review; accessibility review | CI-GALLERY-007; CI-GALLERY-008 | Post-wedding only | Create only after the approved gallery organization is known. |

---

# Not-Applicable or Prohibited Items

| ID | Page or Surface | Link or Asset | Type | Final URL/File Available? | Owner | Verification Needed? | Source Content Item | Launch Requirement | Reason |
|---|---|---|---|---|---|---|---|---|---|
| LI-EXCLUDE-001 | Gallery launch state | Pre-wedding Gallery image | Local asset | Not applicable | Couple | Not applicable | CI-GALLERY-003 | Not applicable | The launch Gallery may remain a text-only Coming Soon page. |
| LI-EXCLUDE-002 | Read, Listen, and Watch | Hosted ebook or ebook download | Prohibited hosted media | Not applicable | Application | Not applicable | CI-EXCLUDE-001 | Prohibited | The site links to lawful external sources and does not distribute the book. |
| LI-EXCLUDE-003 | Read, Listen, and Watch | Hosted audiobook or audiobook download | Prohibited hosted media | Not applicable | Application | Not applicable | CI-EXCLUDE-002 | Prohibited | The site links to lawful external sources and does not distribute the audiobook. |
| LI-EXCLUDE-004 | Read, Listen, and Watch | Embedded or hosted full-length film | Prohibited hosted media | Not applicable | Application | Not applicable | CI-EXCLUDE-003 | Prohibited | The site links to lawful external sources and does not host the film. |
| LI-EXCLUDE-005 | Public assets or downloads | Public Nextcloud share containing copyrighted thematic source media | Prohibited public share | Not applicable | Couple; application | Not applicable | CI-EXCLUDE-004 | Prohibited | Nextcloud must not be used to publicly distribute unauthorized copies of the book, audiobook, or film. |
| LI-EXCLUDE-006 | FAQ or other page | Gift-registry link | Prohibited external link | Not applicable | Couple | Not applicable | CI-EXCLUDE-005 | Prohibited | The wedding will not use a gift registry. |
| LI-EXCLUDE-007 | RSVP | Code-bearing personalized RSVP link | Prohibited personalized URL | Not applicable | Application | Not applicable | CI-EXCLUDE-013 | Prohibited | Guests manually enter codes at `/wedding/rsvp/`; invitation codes do not appear in URLs. |
| LI-EXCLUDE-008 | Schedule or FAQ | Separate cocktail-hour asset, page, or link | Not applicable | Not applicable | Couple; application | Not applicable | CI-SCHEDULE-003; Decision 022 | Prohibited | There is no separately scheduled formal cocktail hour. |
| LI-EXCLUDE-009 | Schedule or FAQ | Separate formal-dinner asset, page, or link | Not applicable | Not applicable | Couple; application | Not applicable | Decision 022 | Prohibited | The meal is buffet-style brunch during the reception rather than a separately scheduled formal dinner. |
| LI-EXCLUDE-010 | Schedule | Fixed dancing-schedule graphic | Not applicable | Not applicable | Couple; application | Not applicable | CI-SCHEDULE-005; Decision 022 | Prohibited unless policy changes | Dancing occurs at various intervals and does not receive one fixed public time block. |
| LI-EXCLUDE-011 | Guest-facing RSVP and confirmation states | Protected administrative recipient address or email action | Prohibited private email link | Not applicable | Couple; application | Not applicable | CI-ADMIN-004; CI-ADMIN-016; CI-CONFIRM-002; CI-CONFIRM-010; CI-CONFIRM-014 | Prohibited | Guest-facing states may display only a limited administrative delivery-attempt status. They must not display, link, encode, or otherwise expose the couple’s protected administrative confirmation address. |
| LI-EXCLUDE-012 | Submission-uncertain and confirmation-refresh states | Code-bearing, payload-bearing, or auto-replay retry/resubmission URL | Prohibited transactional URL | Not applicable | Application | Not applicable | CI-SITE-006; CI-CONFIRM-006 | Prohibited | Safe retry is an in-application idempotent action using the original client submission identifier. A refresh fallback must not replay a prior request or instruct automatic resubmission solely because temporary confirmation state is unavailable. |

---

# Verification Procedures

## External-link verification

For each launch-required external link:

1. Open the link from the production or staging site.
2. Confirm that it uses HTTPS where available.
3. Confirm that it reaches the intended title, venue, hotel, map destination, or service.
4. Confirm that it does not depend on an expired session, private account, temporary token, or copied search state.
5. Confirm that new-tab behavior and accessible labeling are present.
6. Test representative desktop and mobile browsers.
7. Record the verification date.
8. Recheck time-sensitive media and hotel links immediately before invitations are mailed.

## Email-action verification

For each launch-required guest-facing email action:

1. Confirm that the visible label identifies the purpose of the action.
2. Confirm that the destination is exactly `RSVPhelp@loreweavercreations.com`.
3. Confirm that the action works from representative desktop and mobile email clients.
4. Confirm that the generated `mailto:` URL does not automatically include invitation codes, RSVP answers, confirmation destinations, client submission identifiers, delivery details, or other private RSVP information.
5. Confirm that the assistance action appears in every approved RSVP recovery or warning state that requires it.
6. Confirm that no guest-facing page, email link, browser metadata field, or URL exposes the protected administrative confirmation recipient.

## Map verification

For each map link:

1. Confirm the displayed venue name and address.
2. Confirm the pin or destination is suitable for guest arrival.
3. Verify parking, entrance, or drop-off information where known.
4. Check Configuration A and Configuration B independently.
5. Confirm that inactive-configuration links are not presented as current.
6. Test the link in at least one commonly used mobile mapping application.

## Local-asset verification

For each public image or document:

1. Confirm ownership, permission, or licensing.
2. Remove or avoid unnecessary private metadata where practical.
3. Confirm file format and file size.
4. Test responsive display or download behavior.
5. Supply alternative text, captions, or accessible document structure as applicable.
6. Confirm that the file does not contain unauthorized copyrighted source media.
7. Confirm that the production filename or identifier is stable.
8. Verify that replacement or fallback behavior does not break the page.

## Download verification

For each downloadable file:

1. Confirm the file opens successfully.
2. Confirm that the visible label describes the file and format.
3. Confirm the file is the approved final version.
4. Confirm access permissions.
5. Confirm that download links do not expose private server paths or credentials.
6. Confirm that large files are not loaded automatically as ordinary page assets.

## QR-code verification

Before invitation mailing:

1. Scan the QR code from an actual printed proof.
2. Test more than one phone and camera application where practical.
3. Confirm that it opens `https://www.loreweavercreations.com/wedding/`.
4. Confirm that the homepage prominently exposes RSVP access.
5. Confirm that no invitation code appears in the destination URL.
6. Confirm that the target works over the intended public internet connection and not only on the local development network.

---

# Verification Record Template

Use this table when individual resources are finalized.

| Inventory ID | Final URL or File Identifier | Verified By | Verification Date | Desktop Result | Mobile Result | Rights/Permission Result | Accessibility Result | Notes |
|---|---|---|---|---|---|---|---|---|
| `[LI-ID]` | `[URL, repository path, or managed asset ID]` | `[Name]` | `[YYYY-MM-DD]` | `[Pass/Fail/N/A]` | `[Pass/Fail/N/A]` | `[Pass/Fail/N/A]` | `[Pass/Fail/N/A]` | `[Notes]` |

Do not place credentials, private share tokens, service-account details, or private RSVP information in this record.

---

# Phase 2 Step 7 Completion Review

Phase 2 Step 7 is complete when:

- Every launch-required external link and local asset has an inventory row.
- Every row has an owner.
- Every row states whether its final URL or file is available.
- Every row identifies the required verification.
- The static invitation QR destination is recorded.
- The RSVP assistance email action is recorded for entry, validated-form, service-unavailable, submission-uncertain, delivery-warning, confirmation-refresh, FAQ, and footer contexts.
- Guest-facing states do not expose or link the protected administrative confirmation recipient.
- Recovery and refresh-fallback links use only approved canonical routes and never contain invitation codes, RSVP data, confirmation destinations, client submission identifiers, or private administrative values.
- A safe retry after an uncertain submission remains an idempotent in-application action rather than a code-bearing, payload-bearing, or auto-replay URL.
- The homepage hero asset is recorded.
- Theme palette, outfit-reference, inspiration, and design-guide assets are recorded.
- Lawful book, audiobook, and film resource links are recorded.
- Warinanco Park and Sphinx map links are recorded separately.
- Hotel booking, map, and accessibility resources are recorded as pending the hotel contract.
- Recommended travel-source links are recorded without presenting them as finalized.
- Post-wedding photographs, videos, previews, and download links are separated from launch requirements.
- The Coming Soon Gallery image is identified as not required.
- Copyrighted source-media hosting and public unauthorized shares are explicitly prohibited.
- No code-bearing personalized RSVP link is included.
- No separate cocktail-hour, formal-dinner, or fixed dancing asset or link is included.
- The possible mimosa-station content remains conditional until confirmed.
- External-link, email-action, map, asset, download, and QR-code verification procedures are documented.
- Final URLs and files can later be entered without restructuring the inventory.
