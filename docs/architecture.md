# Earned Credibility Trust Hub Architecture

## Understanding

This project is not a brochure site. It is a client-conversion platform around Magdalene Wambui's proprietary Earned Credibility framework. The central product is a seven-minute Resonance Quotient assessment that turns a visitor into a qualified lead, produces a scored credibility diagnosis, recommends the right next step, and starts the correct follow-up journey.

The core journey is:

1. Visitor arrives from LinkedIn, social content, search, or referral.
2. Visitor reads Trust Hub content and starts the assessment.
3. Backend validates answers, calculates the 0-100 score, stores a scoring snapshot, and creates or updates a lead.
4. Recommendation rules use score, weakest categories, profession, business stage, challenge, readiness, and desired outcome.
5. The participant sees results, receives a Resend email report, and is guided to a resource, offer, application, booking, or checkout.
6. Admin users manage questions, score ranges, recommendation rules, leads, content, offers, resources, scheduled emails, applications, bookings, and analytics.

## Domain Modules

- Public Trust Hub: home, Earned Credibility, assessment landing, results, offers, resources, essays, case studies, about, contact, and legal pages.
- Assessment Engine: database-managed questions, answer weights, category scoring, score ranges, rule-based recommendation, result tokens, and immutable scoring snapshots.
- Lead CRM: lead records, status transitions, tags, notes, consent, source attribution, assessment history, purchases, bookings, applications, and email events.
- Email Automation: editable templates, sequences, scheduled jobs, retries, idempotency keys, unsubscribe and communication preferences, using Resend as the sender.
- Content System: Code of Resonance essays, categories, tags, SEO metadata, resources, reading list, case studies, and testimonials.
- Offers and Conversion: offer pages, checkout abstraction, payments, bookings, applications, intake forms, order records, and confirmation emails.
- Media: Cloudinary-backed upload, secure file storage where appropriate, optimized image transformations, responsive sources, alt text, and usage metadata.
- Admin: role-based dashboard for platform management, analytics, audit logs, and settings.

## Resend Integration

Email is isolated in backend services:

- `EmailTemplate` stores editable database templates.
- `ScheduledEmail` stores queued jobs, attempt counts, status, related lead/result/offer references, and idempotency keys.
- `emailService` sends through Resend.
- `emailQueueService` schedules and processes jobs.
- `emailWorker` processes pending jobs on an interval when enabled.

This supports contact confirmations, admin notifications, assessment result delivery, resource delivery, booking reminders, purchase receipts, application updates, feedback requests, and nurture sequences.

## Cloudinary Integration

Media is isolated in backend services:

- `uploadMiddleware` validates file type and size with Multer memory storage.
- `cloudinaryService` uploads buffers to Cloudinary and generates optimized URLs.
- `MediaAsset` stores public IDs, URLs, dimensions, format, resource type, alt text, folder, and responsive variants.
- Frontend media helpers can use `optimizedUrl` and `srcset` returned by the API.

Images use automatic format and quality where possible so Cloudinary can deliver WebP, AVIF, or other best formats per browser.

## Implementation Roadmap

1. Foundation: environment, database, security middleware, response conventions, admin auth, roles, settings.
2. Assessment Engine: question models, scoring service, score ranges, recommendation rules, result tokens, lead creation.
3. Email Automation: template management, Resend sending, queue processing, sequences, unsubscribe preferences.
4. Media and Content: Cloudinary uploads, essays, resources, reading list, case studies, testimonials.
5. Offers and Conversion: offers, orders, payment provider abstraction, bookings, applications, intake forms.
6. Admin Dashboard: management screens, filters, CSV exports, analytics cards, audit logs.
7. Deployment: VPS setup, Nginx, PM2, SSL, MongoDB Atlas/self-hosting, backups, monitoring.

See `docs/phase-1-foundation.md` for the approved foundation blueprint: sitemap, navigation, user journeys, offer architecture, brand rules, folder direction, and current gaps.

See `docs/phase-2-backend-admin.md` for the current backend/admin backbone delivered for leads, messages, offers, applications, bookings, assessment setup, and email operations.

See `docs/phase-3-assessment-email-automation.md` for the managed assessment workflow, safe versioning, recommendation routing, and email automation delivered in Phase 3.

# Phase delivery

- [Phase 1: Foundation](./phase-1-foundation.md)
- [Phase 2: Backend and Admin](./phase-2-backend-admin.md)
- [Phase 3: Assessment and Email Automation](./phase-3-assessment-email-automation.md)
- [Phase 4: Offers and Conversion](./phase-4-offers-conversion.md)
- [Phase 5: Launch Readiness](./phase-5-launch-readiness.md)
