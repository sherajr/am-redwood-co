# Editing A & M Redwood Co

Keep changes small and tied to the request. Read `content/site.ts` first: it is the source for business details and services. `app/page.tsx` owns section order and longer copy; `app/globals.css` owns design.

Preserve Asa Branden, Manny Fonseca, 831-794-3305, and service areas Boulder Creek, Felton and Ben Lomond. Never invent reviews, ratings, completed-project photos, prices, licensing, insurance, years of experience or certifications. Forest photographs are atmosphere, not completed jobs.

Keep the single marketing page and small `/manage` operational page. Reuse installed UI primitives. Preserve the starter, lockfile, Sites Vite plugin, and manifest identity. Honor reduced motion and keyboard access.

D1 remains the source of truth. All management requests require server authorization. No public/default passwords, secrets in URLs, client-only gates or readable invitation codes in storage. Preserve atomic code consumption, the unique invitation constraint, consent, pending-by-default behavior and approved-only public reads. Render customer text as text, never raw HTML. SQL uses bound parameters and one statement per prepare. Generate migrations and never alter deployed migration history.

Keep `.env`, `.dev.vars`, database state and build output out of Git. Run TypeScript and production build after meaningful changes; run `scripts/test-testimonials.mjs` after API/security/database changes. Check relevant rendered interactions when available. GitHub source and live hosting are separate deliverables; only report verified publication.
