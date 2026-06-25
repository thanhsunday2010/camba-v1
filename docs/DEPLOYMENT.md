# CAMBA Production Deployment

Runbook for deploying CAMBA to **Vercel** with **Supabase** as the backend.

## Prerequisites

- [Vercel](https://vercel.com) account linked to your Git repository
- [Supabase](https://supabase.com) project (production)
- [Google Cloud Console](https://console.cloud.google.com) — OAuth + Gemini API key
- Node.js 20+ locally for verification

## 1. Supabase (Production)

### Run migrations

Apply all migrations in order via Supabase SQL Editor or CLI:

```
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_rls_policies.sql
supabase/migrations/003_sample_content.sql
supabase/migrations/004_gamification_rls.sql
supabase/migrations/005_ai_storage_and_exercises.sql
supabase/migrations/006_mock_test_sample.sql
supabase/migrations/007_parent_teacher.sql
supabase/migrations/008_ielts_program.sql
supabase/migrations/009_security_integrity.sql
supabase/migrations/010_data_model_alignment.sql
supabase/migrations/013_subscriptions.sql
supabase/migrations/014_sepay_payments.sql
```

Then run `supabase/seed.sql` for Cambridge program data (optional for production; use admin UI for custom content).

### SePay Live (subscription payments)

1. **SePay Dashboard → Live mode** (not Test mode). Link your real bank account (e.g. ACB `83993998`).
2. **Company → Payment code**: prefix `CAMBA` (must match `SEPAY_PAYMENT_CODE_PREFIX`).
3. **Webhooks → Create (Live)**:
   - URL: `https://your-domain.vercel.app/api/webhooks/sepay`
   - Event: incoming transfers only
   - Bank account: your linked Live account
   - Security: **API Key** — copy the key into Vercel as `SEPAY_WEBHOOK_API_KEY` (Live keys do not start with `spsk_test_`).
4. Set `SEPAY_LIVE=true` in Production env.
5. Local dev with real money: use ngrok (`npm run dev:sepay-ngrok`) and point the **Live** webhook URL to `https://xxxx.ngrok-free.dev/api/webhooks/sepay` temporarily.

Run `npm run sepay:setup` locally to print the checklist and webhook URL.

Do **not** use `npm run test:sepay-webhook` for real payments — it simulates webhooks. Real flow: user pays via VietQR on `/subscriptions`, SePay sends the webhook, plan activates automatically.

### Auth configuration

1. **Authentication → URL Configuration**
   - Site URL: `https://your-domain.vercel.app`
   - Redirect URLs:
     - `https://your-domain.vercel.app/auth/callback`
     - `http://localhost:3000/auth/callback` (for local dev)

2. **Authentication → Providers**
   - Enable **Email**
   - Enable **Google OAuth** with production Client ID/Secret

3. **Storage** (Phase 4+)
   - Ensure buckets used by AI/writing features exist and RLS policies from migration `005` are applied.

### Assign roles

Parent and teacher roles are not self-assigned. Insert into `user_roles` in Supabase:

```sql
INSERT INTO user_roles (user_id, role)
VALUES ('<uuid>', 'teacher');
-- or 'parent', 'admin'
```

## 2. Environment variables

Copy from `.env.example` and set in **Vercel → Project → Settings → Environment Variables**:

| Variable | Scope | Required |
|----------|-------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Production only | Yes (server) |
| `GOOGLE_GEMINI_API_KEY` | Production | Yes (AI features) |
| `NEXT_PUBLIC_APP_URL` | Production, Preview | Yes |
| `SEPAY_BANK_ACCOUNT` | Production | Yes (subscriptions) |
| `SEPAY_BANK_NAME` | Production | Yes (subscriptions) |
| `SEPAY_ACCOUNT_HOLDER` | Production | Recommended |
| `SEPAY_PAYMENT_CODE_PREFIX` | Production | Yes (`CAMBA`) |
| `SEPAY_WEBHOOK_API_KEY` | Production | Yes (Live webhook API key) |
| `SEPAY_LIVE` | Production | Yes (`true`) |
| `SEPAY_WEBHOOK_SECRET` | Production | Optional (HMAC) |
| `SEPAY_QR_MEMO_PREFIX` | Production | Optional (some banks) |

**Production example:**

```
NEXT_PUBLIC_APP_URL=https://camba.vercel.app
```

**Preview deployments:** set `NEXT_PUBLIC_APP_URL` to the preview URL pattern or use Vercel's automatic URL per deployment.

> Server env is validated at runtime via `src/lib/env.ts`. Missing public vars will fail the build or first request.

## 3. Vercel deployment

### Connect repository

1. Import the Git repo in Vercel.
2. Framework preset: **Next.js**
3. Build command: `npm run build`
4. Install command: `npm install`
5. Node.js version: **20.x** (matches `engines` in `package.json`)

### Custom domain (optional)

Add domain in Vercel → Domains, then update:

- Supabase Site URL and redirect URLs
- `NEXT_PUBLIC_APP_URL` to your custom domain

### Health check

After deploy, verify:

```
GET https://your-domain.vercel.app/api/health
```

Expected: `{ "status": "ok", "service": "camba", "timestamp": "..." }`

## 4. CI (GitHub Actions)

The workflow at `.github/workflows/ci.yml` runs on push/PR:

- `npm run lint`
- `npm run typecheck`
- `npm run build` (with placeholder env vars)

Ensure CI secrets are **not** required for build — only public dummy URLs are used in CI.

## 5. Post-deploy checklist

- [ ] Sign up / login (email + Google)
- [ ] Dashboard loads with program picker
- [ ] Learning path and one exercise submission
- [ ] Mock test start (if content seeded)
- [ ] Admin content manager (admin role)
- [ ] AI writing/speaking (Gemini key valid)
- [ ] `/sitemap.xml` and `/robots.txt` accessible
- [ ] Security headers present (check with [securityheaders.com](https://securityheaders.com))

## 6. Local production build test

```bash
cp .env.example .env.local
# Fill real or dummy values

npm run lint
npm run typecheck
npm run build
npm run start
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails: invalid environment | Set all `NEXT_PUBLIC_*` vars in Vercel |
| OAuth redirect mismatch | Add exact callback URL in Supabase Auth settings |
| AI features 500 | Verify `GOOGLE_GEMINI_API_KEY` in Production env |
| Images not loading | Confirm Supabase storage URLs match `images.remotePatterns` in `next.config.ts` |
| RLS permission denied | Re-run migration `002` and role-specific migrations |

## Related docs

- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [ERD.md](./ERD.md)
