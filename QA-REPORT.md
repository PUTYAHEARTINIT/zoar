# ZÖAR QA Audit Report

**Date:** 2026-02-16
**Auditor:** QA Engineer (Claude Sonnet 4.5)
**Scope:** Product image path integrity, UI component quality, seed data consistency
**Files Audited:**
- `/Users/newuser/zoar/prisma/seed.ts` (964 lines, ~685 product entries)
- `/Users/newuser/zoar/public/images/products/` (708 files on disk)
- `/Users/newuser/zoar/app/**/*.tsx` (14 files)
- `/Users/newuser/zoar/components/**/*.tsx` (9 files)

---

## Summary

| Check | Status | Count |
|---|---|---|
| Unique image paths in seed | - | 662 |
| Image files on disk | - | 708 |
| **Missing from disk (broken paths)** | PASS | 0 |
| **Empty images[] arrays (no image)** | FAIL | 2 |
| **Semantic image path mismatches (confirmed)** | FAIL | 2 (fixed) |
| **Semantic image path mismatches (flagged)** | WARNING | 2 |
| Dead links (`href="#"` or `href=""`) | PASS | 0 |
| `<img>` tags missing `alt=` | PASS | 0 |
| `console.log` / debug code in components | PASS | 0 |
| Hardcoded placeholder data in profile | WARNING | 1 |
| Marketplace page is placeholder ("Coming Soon") | INFO | 1 |
| Orphaned images on disk (not in seed) | INFO | 46 |

**Total issues requiring action:** 4 (2 fixed, 2 unfixable without new assets)

---

## 1. Image Path Issues

### 1a. FIXED — Confirmed Semantic Mismatches

These two entries had image paths pointing to images that do not match the product description. Both were fixed directly in `/Users/newuser/zoar/prisma/seed.ts`.

#### Fix 1 — Maison Margiela Replica Black Suede
- **File:** `prisma/seed.ts` line 268
- **Product:** `Maison Margiela Replica — Black Suede`
- **Old image:** `/images/products/margiela_replica_grey.png`
- **New image:** `/images/products/mm_replica_black.png`
- **Reason:** Product is described as Black Suede, but was using a grey-named image. `mm_replica_black.png` exists on disk and is the correct match.

#### Fix 2 — Prada Monolith Loafer Black Patent Lug
- **File:** `prisma/seed.ts` line 284
- **Product:** `Prada Monolith Loafer — Black Patent Lug`
- **Old image:** `/images/products/prada_chocolate_loafer.png`
- **New image:** `/images/products/prada_monolith_loafer_blk.png`
- **Reason:** Product is a Black loafer but was using the chocolate colorway image. `prada_monolith_loafer_blk.png` exists on disk and correctly represents the black version.

---

### 1b. WARNING — Flagged Semantic Mismatches (Review Required)

These entries have suspicious path-to-name relationships but require human judgment to confirm or deny. No automated fix was applied.

#### Flag 1 — Balenciaga 3XL Grey Mesh
- **File:** `prisma/seed.ts` line 136
- **Product:** `Balenciaga 3XL — Grey Mesh`
- **Image in use:** `/images/products/balenciaga_3xl_white.png`
- **Available alternatives:** `bal_3xl_dirty_white.png`, `bal_3xl_mesh_blue.png`, `bal_3xl_vintage_beige.png`, `bal_3xl_worn_black.png`
- **Issue:** The subtitle is "Grey Mesh" but the image path says `_white`. There is no `balenciaga_3xl_grey_mesh.png` on disk. The closest candidate is `bal_3xl_dirty_white.png` (which may actually appear grey/off-white when rendered). **Action:** Visual review needed — if the image renders grey, no change required. If it renders white, the subtitle should be updated to match.

#### Flag 2 — Rick Owens Geobasket High
- **File:** `prisma/seed.ts` line 128
- **Product:** `Rick Owens Geobasket High — White Leather Gum`
- **Image in use:** `/images/products/platform_white_hi_rick_gum_bottom_nobg.png`
- **Available alternatives:** `ro_geobasket_bw.png`, `ro_geobasket_oyster.png`
- **Issue:** The product is named "Geobasket" but the image path says `platform_gum_bottom`, which is a different silhouette. The subtitle "White Leather Gum" partially matches the image description. **Action:** If the intent is Geobasket, use `ro_geobasket_oyster.png`. If the intent is the Platform Gum-Bottom silhouette, the product name should be updated from "Geobasket High" to "Platform High Gum-Bottom" for accuracy.

---

### 1c. FAIL — Empty images[] Arrays (No Image Assigned)

Two products have `images: []` and will display the "Photo Coming Soon" fallback UI on every device:

| Line | Product | Subtitle | Category |
|---|---|---|---|
| 834 | Yeezy | Boost 700 V3 Alvah | Yeezy |
| 863 | Lanvin | Curb Sneaker Burgundy | Lanvin |

- **File:** `prisma/seed.ts`
- **Issue:** `yeezy_700v3_azael.png` exists on disk and its Azael variant is seeded at line 835. An `_alvah` image was likely meant to be added. For Lanvin Burgundy, no burgundy curb image exists on disk.
- **Action needed:** Source or upload `yeezy_700v3_alvah.png` and a Lanvin Curb Burgundy image, then update those two seed entries. Until then, these two products will show "Photo Coming Soon" in production.

---

### 1d. INFO — Orphaned Files on Disk (Not Referenced in Seed)

The following 46 files exist in `public/images/products/` but are not referenced by any product in `prisma/seed.ts`. They are not causing any errors, but represent storage clutter and potential confusion.

**Raw camera images (likely obsolete — replaced by _nobg versions):**
```
brown_furry_ramone_rick_low.jpg
burgandy_fur_ramone_low_rick.jpg
crazy_string_platform_rick.jpg
crazy_string_rick.jpg
grey_low_ramone_furry_rick.jpg
orange_rick_hi.jpg
platform_hi_rick_white.jpg
platform_white_hi_rick_gum_bottom.jpg
ramone_stud_rick_lo.jpg
red_low_rick_furry_van.jpg
snakeskin_lime_rick.jpg
van_brown_low_rick.jpg
```

**Possible unsold/removed product images:**
```
af1_ow_ica.png              (Off-White ICA AF1 — not seeded)
bal_rally_destroyed.png     (Balenciaga Rally Destroyed — not seeded)
balenciaga_bulldozer_chain.png
balenciaga_bulldozer_clog.png
balenciaga_bulldozer_derby_2.png
bottega_puddle_ankle_bw.png
bottega_puddle_boot_white.png
jordan_11_gratitude.png
lanvin_chelsea_black.png
lanvin_curb_boot_black.png
margiela_replica_grey.png   (was fixed — now orphaned)
misc_low_navy.png
misc_runner_silver.png
misc_sneaker_black.png
misc_sneaker_brown.png
misc_woven_slide.png
mm_distorted_heel.png
ow_meteor_chelsea.png
ow_sponge_boot_blk.png
prada_chocolate_loafer.png  (was fixed — now orphaned)
rick_owens_platform_bw.png
```

**Unidentified camera roll imports (IMG_xxxx.png):**
```
IMG_3762.png through IMG_3775.png (13 files, IMG_3773 missing)
```

**Action:** No immediate action required. Consider running a cleanup pass to delete `.jpg` duplicates (replaced by `_nobg.png` versions), and the `IMG_xxxx.png` files if they have been processed. `margiela_replica_grey.png` and `prada_chocolate_loafer.png` are now safe to delete following the fixes above.

---

## 2. UI Component Issues

### 2a. PASS — Dead Links

No `href="#"` or `href=""` placeholders were found in any `.tsx` file under `app/` or `components/`.

The footer's `href="/#honor-code"` links to the `<section id="honor-code">` element on `app/page.tsx` line 113. This anchor exists and the link is valid.

### 2b. PASS — Missing alt Attributes on Images

All `<Image>` usages (Next.js Image component) include a populated `alt` attribute:

| File | Line | alt value |
|---|---|---|
| `app/page.tsx` | 284 | `{p.name}` |
| `components/ProductCard.tsx` | 89 | `{product.name}` |
| `components/ProductDetail.tsx` | 148 | `{product.name}` |
| `components/InquiryPanel.tsx` | 278 | `{product.name}` |

No raw `<img>` tags were found anywhere in `app/` or `components/`.

### 2c. PASS — Debug Code

No `console.log`, `console.error`, `console.warn`, `debugger`, `TODO`, or `FIXME` comments were found in any `app/` or `components/` file.

### 2d. WARNING — Hardcoded Member Number in Profile

- **File:** `app/profile/page.tsx` line 81
- **Issue:** The profile card renders `NO. 01292` as a hardcoded string. This is displayed to all logged-in members regardless of their actual membership number (e.g., `Z-00002`, `Z-00003`, etc.).
- **Code:** `<p style={{ fontSize: 13, color: "var(--text-dim)" }}>NO. 01292</p>`
- **Action:** Replace with `{(session?.user as any)?.memberNumber || "N/A"}` once `memberNumber` is exposed in the session token, or fetch from the `/api/profile` endpoint.
- **Note:** This is a UI/display issue only. No backend data is corrupted.

### 2e. INFO — Marketplace Page is Placeholder

- **File:** `app/marketplace/page.tsx`
- **Status:** The page is a "Coming Soon" marketing page, not a functional product grid. The nav links to `/marketplace` and the vault's success flow (`app/sell/page.tsx` line 131) links to `/marketplace`. The marketplace detail page (`app/marketplace/[id]/page.tsx`) uses `ProductDetail` and would function if products were assigned to the marketplace listing type.
- **No action needed** — placeholder is intentional per project notes.

### 2f. INFO — Sell Page Category List Incomplete

- **File:** `app/sell/page.tsx` lines 9–22
- **Issue:** The sell form's category dropdown includes `["Rick Owens", "Balenciaga", "Jordan", "Bapesta", "Nike SB", "Bottega Veneta", "Maison Margiela", "Marni", "Gucci", "Prada", "Mihara", "Other"]` but is missing several brands that exist in the vault and seed: `Nike`, `Alexander McQueen`, `Dolce & Gabbana`, `Off-White`, `Yeezy`, `Lanvin`, `Louis Vuitton`, `ZÖAR Merch`.
- **Note:** Sell page is member-only and functional for the listed categories. The omission means members cannot self-categorize listings under these brands without selecting "Other". Not a breaking issue, but worth noting.

---

## 3. Passed Checks

- **All 662 unique image paths referenced in seed.ts resolve to existing files on disk** — zero broken image paths.
- **No dead links** in any component or page file.
- **All Next.js Image components have alt attributes** populated with dynamic product names.
- **No console.log or debug artifacts** in any component or page file.
- **No `href="#"` placeholders** in navigation, footer, or product cards.
- **Footer `/#honor-code` anchor link** resolves to a real section on the homepage (`app/page.tsx:113`).
- **All nav links** (`/vault`, `/marketplace`, `/iso`, `/sell`, `/profile`, `/apply`, `/login`) correspond to existing routes under `app/`.
- **ProductCard, ProductDetail, InquiryPanel** all handle the `images.length === 0` case gracefully with a fallback UI — no null-reference crashes from missing images.
- **659 of 662 products** (all except 2 with `images: []`) have at least one valid image path.

---

## 4. Fixes Applied

The following edits were made to `prisma/seed.ts` during this audit:

```diff
// Line 268 — Maison Margiela Replica Black Suede
- images: ["/images/products/margiela_replica_grey.png"]
+ images: ["/images/products/mm_replica_black.png"]

// Line 284 — Prada Monolith Loafer Black Patent Lug
- images: ["/images/products/prada_chocolate_loafer.png"]
+ images: ["/images/products/prada_monolith_loafer_blk.png"]
```

**To apply:** Re-run the database seed (`npx prisma db seed`) to propagate these image corrections to the database.

---

## 5. Recommended Next Steps

| Priority | Action | File |
|---|---|---|
| HIGH | Re-seed database to apply image fixes | `prisma/seed.ts` |
| HIGH | Source/upload `yeezy_700v3_alvah.png` and add to seed line 834 | `prisma/seed.ts:834` |
| HIGH | Source/upload a Lanvin Curb Burgundy image and add to seed line 863 | `prisma/seed.ts:863` |
| MEDIUM | Visual review: Balenciaga 3XL "Grey Mesh" at line 136 — confirm image or rename subtitle | `prisma/seed.ts:136` |
| MEDIUM | Visual review: Rick Owens "Geobasket High" at line 128 — confirm silhouette intent | `prisma/seed.ts:128` |
| MEDIUM | Fix hardcoded member number `NO. 01292` in profile page | `app/profile/page.tsx:81` |
| LOW | Delete orphaned `.jpg` files (replaced by `_nobg.png` versions) from `public/images/products/` | disk |
| LOW | Delete newly orphaned `margiela_replica_grey.png` and `prada_chocolate_loafer.png` from disk | disk |
| LOW | Add missing brands to sell page category list | `app/sell/page.tsx:9-22` |
| LOW | Investigate and tag `IMG_3762.png` through `IMG_3775.png` or delete if processed | disk |
