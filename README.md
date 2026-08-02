# Tagaytay Highlands by Jewel

A premium, conversion-focused landing page for **Tagaytay Highlands** with a private
**Seller's Portal** and a **Live Page Editor** so Jewel can update everything herself —
no coding required.

---

## 🔑 Access Modes

Open the sign-in screen by pressing **`Alt + A`** (or **`Ctrl/Cmd + Shift + A`**) anywhere,
or by adding **`#admin`** to the URL.

| Mode                 | PIN          | What it does                                                                  |
| -------------------- | ------------ | ----------------------------------------------------------------------------- |
| **Seller's Portal**  | `jewel2026`  | Full dashboard: listings, multi-photo uploads, promos & countdowns, 4 community photos, ownership terms, restaurants/clubs, Gate 2 leads, cloud backup |
| **Live Page Editor** | `jewel1623`  | Turn the **entire landing page** into a click-to-edit canvas — click any text to rewrite it, click any photo to replace it, then **Save & Exit** |

> Change the Seller's Portal PIN in **Seller's Portal → Security & Reset**.

---

## ✅ How edits are saved "for good"

1. **Every edit is saved instantly to your browser** (localStorage) — it survives refreshes
   and stays forever on the device where you edit.
2. The **Live Page Editor** and **Seller's Portal** share the same underlying content store,
   so edits made in either place appear everywhere on the site.
3. Use **Seller's Portal → Cloud Backup & Restore** to make your content truly portable:
   - **Download Backup File** — one-click JSON backup of EVERYTHING (listings, photos,
     promos, leads, all custom text). Keep it safe in Google Drive / WhatsApp.
   - **Restore from File** — load that backup on any device.
      - **Supabase Shared Sync** — the app now saves shared content to your existing Supabase
         tables so changes can appear on other devices automatically.

### Want visitors to see your edits instantly? (Optional, one-time setup)
Your deployed site is static, so visitors normally see the content that was in the code at
deploy time. To make edits **live for every visitor** via Supabase:

1. Use your existing Supabase tables for shared content:
   - `site_settings`
   - `properties`
   - `leads`
   - `reviews`
   - `ownership_tiers`
2. Make sure the app can read, insert, update, and delete rows in those tables.
3. Set these Vite env vars in Vercel and locally:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
4. Press **Sync Now** in the Seller's Portal once, then keep the app open on the other
   device. It will poll Supabase and pull the latest shared content.

---

## 🚀 Deploy to Vercel

1. Push this repository to **GitHub**.
2. In [vercel.com](https://vercel.com), click **Add New → Project** and import the repo.
3. Vercel auto-detects Vite. Keep the default build command (`npm run build`) and output
   directory (`dist`).
4. Click **Deploy** — done. No environment variables are required.

The site is a fully client-side app; everything (photos, forms, portal, editor) works on
static hosting.

---

## Supabase Setup

You can connect this project to Supabase even before creating tables.

1. Local environment:
   - Create `.env.local` in the project root.
   - Add:
   ```env
   VITE_SUPABASE_URL=https://xsbdkopjkcmhbghefxiw.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
   ```
2. Vercel environment variables:
   - In Vercel Project Settings -> Environment Variables, add the same two keys:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
3. Restart local dev server after changing env vars.
4. Run `npm run dev` and check browser console for:
   - `Supabase is connected and reachable.`

### Notes

- This Vite project uses `VITE_` prefix (not `NEXT_PUBLIC_`).
- Supabase client is initialized in [src/lib/supabase.ts](src/lib/supabase.ts).
- Shared state sync lives in [src/utils/cloudSync.ts](src/utils/cloudSync.ts).
- A startup health check runs in development from [src/utils/supabaseHealth.ts](src/utils/supabaseHealth.ts).
- You can start adding tables later in Supabase SQL Editor without changing the connection setup.

---

## 📦 Tech

- React 19 + TypeScript + Vite + Tailwind CSS v4
- `lucide-react` icons
- Google Fonts: Fraunces (display) + Inter (body)
- Single-file build via `vite-plugin-singlefile` (deploys as one `index.html`)
- Persistence: `localStorage` + Supabase shared sync + JSON export/import

## ⚠️ Privacy note
The admin PINs listed above are **demo defaults**. Change the Seller's Portal PIN before
going live, and never publish the `#admin`/`Alt+A` access pattern publicly.
