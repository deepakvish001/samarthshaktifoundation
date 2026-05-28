## Plan: Import `mataphoolpatidss-main` into this project

The uploaded zip is a standard Lovable Vite + React + TypeScript + Tailwind + shadcn project that uses Supabase (hardcoded project `mpajkifprowijfgctvcm`) and includes ~10+ SQL migrations.

### Steps

1. **Copy source files into `/dev-server`**
   - Use `rsync --exclude='.git'` from `/tmp/extracted/mataphoolpatidss-main/` into `/dev-server/`.
   - Includes: `src/`, `public/`, `supabase/`, `index.html`, all config files (`vite.config.ts`, `tailwind.config.ts`, `tsconfig*.json`, `postcss.config.js`, `eslint.config.js`, `components.json`, `package.json`, lockfiles, `README.md`).

2. **Install dependencies**
   - Run `bun install` so all listed deps (Radix UI, react-query, supabase-js, jspdf, html2canvas, recharts, etc.) are available.

3. **Enable Lovable Cloud (Supabase) for this workspace**
   - The original code points at the previous Supabase project (`mpajkifprowijfgctvcm`) with its own anon key — that backend belongs to the old workspace and we can't reuse it here.
   - Enable Lovable Cloud on this project, which provisions a fresh Supabase backend and regenerates `src/integrations/supabase/client.ts` + env values for the new project.
   - Apply all existing SQL migrations from `supabase/migrations/` into the new backend so tables, RLS policies, and functions match the original.

4. **Verify**
   - Confirm the dev server builds and the preview loads.
   - Note any runtime errors (e.g. auth users / seeded data won't carry over — only schema does).

### Important notes for you

- **Data does not transfer.** Only the schema (migrations) is reapplied. Any rows, auth users, storage objects from the original Supabase project are not copied.
- **Secrets / edge function keys** (if any were set in the original project) need to be re-added manually via the secrets tool — tell me which ones if applicable.
- The code will be copied **as-is**; only `src/integrations/supabase/client.ts` and the `.env` will be regenerated to point at the new Cloud backend.

Confirm and I'll execute.