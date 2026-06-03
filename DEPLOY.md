# Deploy KISBNB (Phase 6)

Deploy order: **Atlas → Render (API) → Vercel (UI) → seed production DB**.

---

## Prerequisites

- GitHub repo with this project pushed
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- [Render](https://render.com) account (free tier)
- [Vercel](https://vercel.com) account (free tier)

---

## Step 1 — MongoDB Atlas

1. Create **M0 free cluster**.
2. **Database Access** → add user + password.
3. **Network Access** → **Allow Access from Anywhere** (`0.0.0.0/0`) for Render.
4. **Connect** → Drivers → copy URI and set database name:

```
mongodb+srv://USER:PASSWORD@cluster.xxxxx.mongodb.net/kisbnb?retryWrites=true&w=majority
```

URL-encode special characters in the password.

---

## Step 2 — Deploy API on Render

### Option A: Blueprint (fastest)

1. Render Dashboard → **New** → **Blueprint**
2. Connect GitHub repo (root contains `render.yaml`)
3. Set secret env vars when prompted:
   - `MONGO_URI` — Atlas URI above
   - `JWT_SECRET` — run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - `CLIENT_URL` — leave blank for now; update after Vercel (Step 3)

### Option B: Manual Web Service

| Setting | Value |
|---------|--------|
| Root Directory | `server` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Health Check Path | `/api/health` |

**Environment variables:**

| Key | Value |
|-----|--------|
| `NODE_ENV` | `production` |
| `MONGO_URI` | Atlas connection string |
| `JWT_SECRET` | 64+ char random string |
| `JWT_EXPIRE` | `7d` |
| `CLIENT_URL` | Your Vercel URL (Step 3) |

Copy API URL: `https://kisbnb-api.onrender.com`

**Verify:** open `https://YOUR-API.onrender.com/api/health`

---

## Step 3 — Deploy frontend on Vercel

1. [vercel.com/new](https://vercel.com/new) → Import GitHub repo
2. **Root Directory:** `client` (or use repo root if using root `vercel.json`)
3. Framework: **Vite** (auto-detected)
4. **Environment variable:**

| Key | Value |
|-----|--------|
| `VITE_API_URL` | `https://YOUR-API.onrender.com/api` |

5. Deploy → copy URL: `https://your-app.vercel.app`

---

## Step 4 — Link CORS

1. Render → your service → **Environment**
2. Set `CLIENT_URL` = `https://your-app.vercel.app` (no trailing slash)
3. **Save** → manual redeploy if needed

For Vercel preview URLs, use comma-separated:

```
https://your-app.vercel.app,https://your-app-git-main-youruser.vercel.app
```

---

## Step 5 — Seed production database (once)

From your machine (with production `MONGO_URI` in env):

```bash
cd server
# Temporarily set MONGO_URI to Atlas production URI
npm run seed
```

Creates demo users + sample listings. **Do not commit production credentials.**

---

## Step 6 — Smoke test

- [ ] `GET /api/health` → 200
- [ ] `GET /api/docs` → endpoint list
- [ ] Register / login on live site
- [ ] Browse properties
- [ ] Host: create listing
- [ ] Guest: book + wishlist
- [ ] No CORS errors in browser DevTools

---

## Docker (local only)

```bash
docker compose up --build
```

Uses local MongoDB container; production should use Atlas.

---

## Add live URLs to README

```markdown
## Live Demo
- App: https://your-app.vercel.app
- API: https://your-api.onrender.com/api
- Docs: https://your-api.onrender.com/api/docs
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| CORS error | `CLIENT_URL` must exactly match Vercel origin |
| 502 / slow first request | Render free tier cold start (~30s) |
| Empty listings | Run `npm run seed` against production Atlas |
| `VITE_API_URL` wrong | Redeploy Vercel after changing env |

Full guide: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
