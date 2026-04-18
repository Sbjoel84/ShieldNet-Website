# ShieldNet Dashboard — Deploy Instructions

## Local Development

```bash
cd dashboard
npm install
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
npm run dev
# Open http://localhost:5173
```

> **Demo mode:** If Supabase env vars are not set, the app runs with seed data and auto-logs in as Admin. No backend needed to preview the UI.

---

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste the contents of `supabase/schema.sql` → Run
3. Go to **Settings → API** and copy:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`
4. Go to **Authentication → Providers** and enable:
   - Email (OTP / Magic Link)
   - Phone (SMS OTP — requires Twilio or similar)
5. Go to **Authentication → URL Configuration** and set:
   - Site URL: `https://your-domain.vercel.app`
   - Redirect URLs: `https://your-domain.vercel.app/**`

---

## Deploy to Vercel

### Option A — Vercel CLI
```bash
npm i -g vercel
cd dashboard
vercel
# Follow prompts, set env vars when asked
```

### Option B — Vercel Dashboard

1. Push repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) → Import repo
3. Set **Root Directory** to `dashboard`
4. Set **Framework Preset** to `Vite`
5. Add environment variables:
   | Key | Value |
   |-----|-------|
   | `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...` |
6. Click **Deploy**

### Option C — Static export + any host

```bash
cd dashboard
npm run build
# Output is in dist/ — deploy to Netlify, Cloudflare Pages, etc.
```

---

## First Admin User

After deploying, sign in with your email. Then in Supabase SQL Editor:

```sql
UPDATE public.profiles
SET role = 'admin', verified = true, shield_score = 95
WHERE email = 'your@email.com';
```

---

## Folder Structure

```
dashboard/
├── src/
│   ├── components/
│   │   ├── ui/            ← Shadcn/Radix UI components
│   │   ├── layout/        ← Sidebar, Header, DashboardLayout
│   │   ├── auth/          ← AuthPage (email + phone OTP)
│   │   ├── dashboard/     ← Overview
│   │   ├── shield-farm/   ← CropDiagnosis, MarketPrices, FarmDiary
│   │   ├── properties/    ← PropertyCard, PropertyForm, PropertyMap
│   │   ├── admin/         ← AdminQueue
│   │   └── ai-tools/      ← AITools
│   ├── data/seedData.ts   ← 8 properties + 5 farms (demo data)
│   ├── hooks/useAuth.tsx  ← Supabase auth context
│   ├── lib/               ← utils, types, supabase client
│   └── App.tsx            ← Router + protected routes
├── supabase/schema.sql    ← Full DB schema with RLS
└── .env.example
```

---

## User Roles

| Role | Access |
|------|--------|
| `admin` | Full access, Admin Queue, all listings |
| `agent` | List properties, view own listings |
| `farmer` | ShieldFarm tools, farm diary |
| `public` | View approved properties, market prices |

Set role in Supabase `profiles` table or via `raw_user_meta_data` on signup.
