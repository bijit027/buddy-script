# Deploy BuddyScript for free

Recommended stack (matches the live demo in README):

| Part | Service | Cost |
|------|---------|------|
| React frontend | [Vercel](https://vercel.com) | Free |
| Laravel API | [Railway](https://railway.app) or [Render](https://render.com) | Free tier / trial credits |
| MySQL | Railway MySQL or [PlanetScale](https://planetscale.com) alternative | See host |

You need a **GitHub** repo (this project: `bijit027/buddy-script`).

---

## 1. Push latest code to GitHub

```bash
git add .
git commit -m "Prepare for production deployment"
git push origin development
```

Merge to `main` if your hosts deploy from `main`.

---

## 2. Deploy MySQL + Laravel API (Railway)

1. Sign in at [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo** → select `buddy-script`.
2. Add a **MySQL** service (Plugins → MySQL).
3. Add a **Web Service** for the API:
   - **Root directory:** `backend`
   - Railway will use `backend/Dockerfile` + `railway.toml`.
4. In the **Web Service → Variables**, set:

```env
APP_NAME=BuddyScript
APP_ENV=production
APP_DEBUG=false
APP_KEY=                    # run: php artisan key:generate --show (locally) and paste
APP_URL=https://YOUR-RAILWAY-API.up.railway.app

DB_CONNECTION=mysql
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}

FRONTEND_URL=https://YOUR-VERCEL-APP.vercel.app
SESSION_DRIVER=cookie
CACHE_STORE=file
QUEUE_CONNECTION=sync
LOG_CHANNEL=stderr
```

5. **Settings → Networking → Generate domain** and copy the public URL (use it for `APP_URL`).
6. After deploy, open the service **Shell** (or redeploy) and run once if migrations did not run:

```bash
php artisan migrate --force
php artisan db:seed --force
```

7. Test: `https://YOUR-RAILWAY-API.up.railway.app/up` should return healthy.

---

## 3. Deploy frontend (Vercel)

1. Sign in at [vercel.com](https://vercel.com) → **Add New → Project** → import `buddy-script`.
2. **Root Directory:** `frontend`
3. **Framework:** Vite  
   **Build command:** `npm run build`  
   **Output directory:** `dist`
4. **Environment variable:**

```env
VITE_API_URL=https://YOUR-RAILWAY-API.up.railway.app/api
```

5. Deploy. Copy your Vercel URL (e.g. `https://buddy-script.vercel.app`).
6. Go back to Railway and set `FRONTEND_URL` to that URL (no trailing slash). Redeploy the API.

---

## 4. Alternative: Render (backend only)

1. [render.com](https://render.com) → **New → Blueprint** or **Web Service** from GitHub.
2. Use `render.yaml` in the repo root, or manually:
   - **Root directory:** `backend`
   - **Runtime:** Docker
   - Add the same env vars as Railway (use Render’s MySQL or external DB).
3. Free tier sleeps after inactivity (cold starts ~30s).

---

## 5. Checklist

- [ ] `APP_KEY` set in production (never commit `.env`)
- [ ] `APP_DEBUG=false`
- [ ] `FRONTEND_URL` = exact Vercel URL (add preview URL comma-separated if needed)
- [ ] `VITE_API_URL` ends with `/api`
- [ ] Migrations ran on production DB
- [ ] Register/login works from the live site

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| CORS error | `FRONTEND_URL` must match the browser URL exactly (https, no trailing `/`) |
| 401 on API | Token auth; ensure `VITE_API_URL` is correct |
| Images 404 | Run `php artisan storage:link` on the server |
| 500 on deploy | Check Railway/Render logs; confirm MySQL vars and `APP_KEY` |

---

## Live URLs (update README after deploy)

- Frontend: `https://________.vercel.app`
- API: `https://________.up.railway.app`
