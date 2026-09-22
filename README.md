# A & M Redwood Co

Responsive service-business website for Asa Branden and Manny Fonseca. Serving Boulder Creek, Felton, and Ben Lomond. Forest photography, scroll motion, service accordions, click-to-call/text, and code-gated customer testimonials.

## Editing map

| Change | File |
| --- | --- |
| Phone, services, areas, headline, process | `content/site.ts` |
| Section order and longer copy | `app/page.tsx` |
| Theme, layout, responsive styles | `app/globals.css` |
| Customer form | `components/site/testimonials.tsx` |
| Private team interface | `components/site/manager.tsx` |
| Authorization and validation | `lib/server.ts` |
| API routes | `app/api/testimonials/route.ts`, `app/api/manage/route.ts` |
| Database | `db/schema.ts`, `drizzle/` |
| AI editing instructions | `AGENTS.md` |

No external CMS, customer account, analytics SDK, or form-service subscription is required. Customer messages and invitation hashes live in D1, never in Git.

## Development

Node 22.13+ and the pinned package manager in `package.json`:

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
pnpm exec tsc --noEmit
pnpm build
```

The Sites managed runtime uses its provided dependency and preview helpers. Production output is a Cloudflare-compatible Worker plus assets. **GitHub Pages alone cannot run the testimonial system.** GitHub holds source; Sites runs the website/database.

## Testimonials

1. Configure a random `MANAGEMENT_KEY` of at least 32 characters as a hosted Sites **secret**. Generate it using a password manager or `openssl rand -hex 32`. Never commit it or place it in a URL.
2. Share that key privately with Asa. At `/manage`, enter it to open the team area. The key stays only in page memory; reloading/locking clears it.
3. Select **Create a customer code** and copy it immediately. Give it to one customer. Codes have eight characters, expire after 30 days, and work once. Only hashes are stored.
4. Customers open **Have a code? Leave a kind word**, enter the code and feedback, and consent to publication.
5. The review stays pending until Asa selects **Approve & publish**. **Keep private** hides it. No fake reviews or ratings are seeded.

Public reads return approved names, towns and messages only. No customer email/phone is collected. Prepared SQL, input and body-size limits, origin checks, persistent rate limits and atomic single-use enforcement protect submission. Errors preserve the form. Missing configuration fails closed.

## Database

`.openai/hosting.json` declares `d1: "DB"`. Sites provisions D1 and applies committed migrations. After schema changes, run `pnpm db:generate`, inspect SQL, then build. Never modify deployed migration history.

After the first build, apply each migration once to a new **local** database:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_true_fat_cobra.sql
```

`.env.example` documents the required secret name. Real production values belong in Sites environment settings.

## Publishing

Use the Sites building/hosting skills. Register once, preserve the returned `project_id`, configure the secret, build, push source, package and deploy. Do not invent IDs. The testimonial system becomes live only after D1 migrations and deployment succeed.

To publish source from an authenticated GitHub CLI on your machine:

```sh
git init -b main
git add .
git commit -m "Build A & M Redwood Co website"
gh repo create am-redwood-co --public --source . --remote github --push
```

Omit initialization if already in a Git checkout. If the repository name exists, inspect it before making changes. Never overwrite unrelated work. Secrets, dependencies, local database state and build artifacts are ignored.

## Verification and design

Use `pnpm exec tsc --noEmit`, `pnpm build` and, after API/security changes, `node scripts/test-testimonials.mjs`. The smoke test uses disposable Miniflare/D1 state and creates no production data.

System fonts, two compressed local images, semantic headings, labeled forms, keyboard-accessible primitives, responsive layouts and reduced-motion support keep the site maintainable. See `ASSETS.md` for image sources. The optional WebMCP tool `start_testimonial` only opens/prefills the form and never submits or publishes; unsupported browsers use the normal form.
