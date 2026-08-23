# Hostinger Deployment Guide

This project should be deployed as a React/Vite frontend plus a Node/Express API. The simplest production shape on Hostinger is a VPS with Nginx serving `frontend/dist` and proxying `/api` to the backend on port `5000`.

## 1. Local preflight

Run these before uploading:

```bash
npm install
npm run build --workspace frontend
npm test --workspace backend
```

The frontend build must produce `frontend/dist`. That folder includes `.htaccess`, `robots.txt`, and `sitemap.xml`.

## 2. Production environment

Use these examples as the source of truth:

- `frontend/.env.production.example`
- `backend/.env.production.example`

For the current target domain, use:

```bash
VITE_API_URL=https://api.magdalenewambui.com/api
VITE_APP_URL=https://magdalenewambui.com
VITE_SITE_URL=https://magdalenewambui.com
FRONTEND_URL=https://magdalenewambui.com
ADMIN_URL=https://magdalenewambui.com/admin
CORS_ORIGINS=https://magdalenewambui.com,https://www.magdalenewambui.com
APP_URL=https://magdalenewambui.com
API_URL=https://api.magdalenewambui.com/api
```

Required backend production secrets:

- `MONGODB_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `RESULT_TOKEN_SECRET`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `EMAIL_LOGO_URL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `OPENAI_API_KEY` if AI scoring is enabled

Keep `ENABLE_EMAIL_WORKER=true` in production so Code of Resonance and assessment follow-up emails are delivered.

## 3. Hostinger VPS flow

Install Node 20+, Nginx, PM2, and Git on the VPS. Then place the project at:

```bash
/var/www/earned-credibility
```

Build or upload the already-built frontend so this exists:

```bash
/var/www/earned-credibility/frontend/dist/index.html
```

Create the backend production `.env` from `backend/.env.production.example`.

If the full repository is on the VPS, install dependencies and build from the project root:

```bash
cd /var/www/earned-credibility
npm ci
npm run build --workspace frontend
pm2 start deployment/ecosystem.config.js --env production
pm2 save
```

If you uploaded the prepared backend archive instead of the full repository, install backend dependencies from the backend folder before starting PM2:

```bash
cd /var/www/earned-credibility/backend
npm install --omit=dev
cd ..
pm2 start deployment/ecosystem.config.js --env production
pm2 save
```

Copy `deployment/nginx.conf` to the Nginx sites folder, enable it, then reload Nginx:

```bash
sudo cp deployment/nginx.conf /etc/nginx/sites-available/earned-credibility
sudo ln -s /etc/nginx/sites-available/earned-credibility /etc/nginx/sites-enabled/earned-credibility
sudo nginx -t
sudo systemctl reload nginx
```

Add SSL with Certbot after DNS points to the VPS.

## 4. If using Hostinger static hosting for frontend

Upload the contents of `frontend/dist` into `public_html`. The included `.htaccess` makes React routes work on refresh.

The backend still needs Node hosting, usually a VPS or Hostinger Node.js app. Because the backend is on `api.magdalenewambui.com`, rebuild the frontend with:

```bash
VITE_API_URL=https://api.magdalenewambui.com/api
```

Then set backend CORS:

```bash
CORS_ORIGINS=https://magdalenewambui.com,https://www.magdalenewambui.com
```

## 5. Seed and launch checks

After the backend is connected to production MongoDB:

```bash
npm run seed:email --workspace backend
npm run seed:assessment --workspace backend
npm run seed:offers --workspace backend
npm run seed:code --workspace backend
npm run seed:admin --workspace backend
```

Confirm:

- `https://api.magdalenewambui.com/api/health` returns healthy JSON.
- `https://magdalenewambui.com/robots.txt` is reachable.
- `https://magdalenewambui.com/sitemap.xml` is reachable.
- Contact form sends confirmation email.
- Code of Resonance subscription sends confirmation and schedules Day 1.
- Assessment submits and emails the AI-enhanced report when OpenAI is enabled.
- Admin login works at `/admin/login`.
- Media upload works through Cloudinary.

## 6. Search engine submission

Submit this sitemap after launch:

```text
https://magdalenewambui.com/sitemap.xml
```

Use Google Search Console and Bing Webmaster Tools. Bing also helps discovery across Bing-powered search engines.
