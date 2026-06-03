# Deployment Guide

Deploy in this order: **MongoDB Atlas → Backend API → Frontend (Vercel)**.

---

## 1. MongoDB Atlas

1. Create account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a **free M0 cluster**
3. Database Access → Add user (username + strong password)
4. Network Access → Add IP `0.0.0.0/0` (allow from anywhere) for Render/Railway  
   - For stricter security, add only Render/Railway outbound IPs when known
5. Connect → Drivers → copy connection string:

```
mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/kisbnb?retryWrites=true&w=majority
```

Replace `<password>` with URL-encoded password if it contains special characters.

---

## 2. Backend — Render

This repo includes **`render.yaml`** at the project root for one-click Blueprint deploy.

### Prepare repository

- Monorepo: push `server/` folder or root with `server` as root for Render
- Ensure `package.json` has:

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "engines": { "node": ">=18" }
}
```

### Render setup

1. [https://dashboard.render.com](https://dashboard.render.com) → New → **Web Service**
2. Connect GitHub repo
3. Settings:
   - **Root Directory:** `server` (if monorepo)
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance:** Free tier
4. Environment variables:

| Key | Value |
|-----|--------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` (Render sets automatically; use `process.env.PORT`) |
| `MONGO_URI` | Atlas connection string |
| `JWT_SECRET` | Long random string (32+ chars) |
| `JWT_EXPIRE` | `7d` |
| `CLIENT_URL` | `https://your-app.vercel.app` |

5. Deploy → copy URL: `https://kisbnb-api.onrender.com`

### CORS (server)

```javascript
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
```

---

## 3. Backend — Railway (alternative)

1. [https://railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Set root to `server/`
3. Add same env vars as Render
4. Generate public domain in Networking tab

---

## 4. Frontend — Vercel

1. Push `client/` to GitHub (same or separate repo)
2. [https://vercel.com](https://vercel.com) → Import Project
3. Framework Preset: **Vite**
4. Root Directory: `client`
5. Build: `npm run build` → Output: `dist`
6. Environment variables:

| Key | Value |
|-----|--------|
| `VITE_API_URL` | `https://kisbnb-api.onrender.com/api` |

7. Deploy → URL: `https://kisbnb.vercel.app`

### Update backend CORS

Set `CLIENT_URL=https://kisbnb.vercel.app` on Render and redeploy.

---

## 5. Docker (Local / CI)

### `server/Dockerfile`

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "src/server.js"]
```

### `docker-compose.yml` (project root)

```yaml
services:
  api:
    build: ./server
    ports:
      - "5000:5000"
    env_file:
      - ./server/.env
    depends_on:
      - mongo
  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
volumes:
  mongo_data:
```

Run: `docker compose up --build`

For production, use Atlas instead of local `mongo` service.

---

## 6. Post-Deploy Checklist

- [ ] `GET https://your-api.onrender.com/api/health` returns 200
- [ ] Register user on production frontend
- [ ] Create property as host
- [ ] Create booking as guest
- [ ] No CORS errors in browser console
- [ ] JWT works across page refresh (token in storage)

---

## 7. Common Issues

| Issue | Fix |
|-------|-----|
| CORS blocked | Match `CLIENT_URL` exactly (no trailing slash mismatch) |
| 502 on Render free tier | Cold start; wait 30s or upgrade |
| MongoDB auth failed | URL-encode password; check user permissions |
| `VITE_API_URL` undefined | Rebuild Vercel after adding env var |
| Mixed content | Ensure API is `https` when frontend is `https` |

---

## 8. Demo URLs for Instructors

Add to README:

```markdown
## Live Demo
- Frontend: https://kisbnb.vercel.app
- API: https://kisbnb-api.onrender.com/api
- API Docs: https://kisbnb-api.onrender.com/api/docs
```

Test accounts (create via seed, do not use real passwords in public README):

- Host: `host@demo.com` / `Demo1234!`
- Guest: `guest@demo.com` / `Demo1234!`
