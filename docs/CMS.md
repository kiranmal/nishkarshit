# CMS architecture (Admin → database → public site)

## Flow
Admin screen → server action (`src/app/admin/cms-actions.ts`, `content-actions.ts`) → the database → server component reads it
(`src/lib/cms/store.ts`) → public page. Saving calls `revalidatePath`, and public pages are dynamic, so changes are live immediately.

## Tables
| Table | Purpose |
|---|---|
| `homepage_sections` (existing, extended) | one doc per homepage block: `visible`, `order`, and structured `data` |
| `cms_pages` (new) | generic page engine: education tabs (`kind: education-tab`), Bank CSP / Loan / Hardware-listing pages (`banking`), Privacy / Refund / Terms / Cloud Computing (`footer-page`). Each doc has `sections[]` (type, variant, items, buttons, order, visible…) and `seo` |
| `blog_posts` (new) | the public `/blogs` posts |
| `hardware_products` (new) | `/banking/csp-hardware/[slug]` products incl. enquiry-form fields and SEO |
| `cms_meta` (new) | markers `seeded:<group>` so deleted defaults never come back |
| `site_content` (existing) | header, footer, settings and now `itServices` |
| `seo_meta` (existing) | route-level SEO (Admin → SEO). Entity SEO (blog, product, CMS page) overrides it field by field |

## Default data vs admin data
Shipped defaults live in `src/lib/cms/defaults/*` and `src/lib/cms/home.ts`. They are imported into the database by
`npm run seed:cms` (after `npm run db:migrate`, see docs/MYSQL.md) (or the “Sync default content” buttons). Import uses `$setOnInsert`: it never overwrites or deletes
admin-edited records and can be run any number of times. Normal builds/deploys never touch the database.
Defaults are used at runtime only if the database is unreachable or a dataset was never imported (first install).
Per-page “Restore defaults” in the admin is the only operation that overwrites a record, and only when you click it.

    npm run seed:cms                      # everything
    npm run seed:cms -- education blog    # selected groups: home education banking footer-pages blog hardware

## Adding content without code
* New Education tab: Admin → Education → “Add tab” (also reachable at `/education/<slug>`).
* New section on Education / Bank CSP / Loan / footer pages: “Add section”, pick a type + layout.
* New blog / hardware product: Admin → Blogs / Banking → Hardware.
Section renderer: `src/components/cms/CmsSections.tsx`. To add a new section *type* or layout, add a case there and an
option in `src/lib/cms/sections.ts`.
