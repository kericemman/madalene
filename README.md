# Earned Credibility Platform

This repository is the starter scaffold for Magdalene Wambui's Earned Credibility Trust Hub: a MERN platform for credibility assessment, lead qualification, publishing, offers, bookings, email automation, and service management.

## What is included now

- `backend/` Express API with MongoDB configuration, security middleware, modular routes, Resend email services, scheduled email jobs, and Cloudinary media upload/optimization services.
- `frontend/` Vite React shell with Tailwind, routing, public Trust Hub pages, and service helpers.
- `docs/architecture.md` with the platform understanding, domain modules, and implementation roadmap.
- `deployment/` placeholders for PM2, Nginx, and VPS deployment notes.

## First setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment examples:

   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

3. Fill in MongoDB, Resend, and Cloudinary credentials.

4. Seed default email templates:

   ```bash
   npm run seed:email
   ```

5. Run the backend and frontend in separate terminals:

   ```bash
   npm run dev:backend
   npm run dev:frontend
   ```

## Key integrations

- Resend sends transactional email and is wrapped by a database-backed email queue so assessment results, guide delivery, contact confirmations, reminders, and nurture sequences can retry safely.
- Cloudinary handles uploaded images and files. The backend creates optimized image URLs using automatic format and quality transformations, with responsive `srcset` data for frontend rendering.

Never commit real secrets. Use the `.env.example` files as the source of truth for required configuration.
# madalene
