# Phase 5: Launch Readiness

## Purpose

Make the Trust Hub operationally credible at launch. A visitor should be able to understand their privacy, move through an offer journey, and receive the right next step. An admin should see the real state of the platform instead of relying on assumed configuration.

## Delivered

### Active offer catalogue

- Upserted the three approved offers into MongoDB:
  1. Credibility Audit
  2. Earned Credibility Intensive
  3. DISCERN
- Retired the legacy public `discern-intensive` and Trusted Choice Mentorship offer records without deleting their historic data.
- The public offer routes and application/booking forms can now resolve their corresponding active offer records.

### Honest operations dashboard

- Added the protected `GET /api/admin/platform-readiness` endpoint.
- Admin Settings now reports non-sensitive readiness for:
  - database connection
  - Resend email configuration
  - Cloudinary configuration
  - scheduled email worker
  - public `APP_URL`
  - active assessment version
  - active email templates and sequences
  - all three expected public offers
- The response exposes no credentials, secrets, or provider tokens.

### Public trust pages

Implemented the footer's previously missing routes:

- `/privacy`
- `/terms`
- `/assessment-disclaimer`
- `/refund-policy`

The refund page accurately reflects the current operating model: paid work is agreed through an offer-specific process, not a fictitious instant checkout.

## Launch checklist

1. Set `APP_URL` to the deployed public domain.
2. Configure a verified `EMAIL_FROM` and `RESEND_API_KEY`, then send a real contact, assessment, application, booking, and Code-subscription test.
3. Configure all Cloudinary credentials and upload a test image through Admin Media.
4. Keep `ENABLE_EMAIL_WORKER` enabled and verify the email queue changes from pending to sent.
5. Add an `externalBookingUrl` in Admin Offers only when the real calendar is ready. Without it, the audit uses the internal booking-request workflow.
6. Have a qualified legal professional review the public policy pages for Magdalene's jurisdiction and final business terms before production launch.

## Deliberate boundary

Payment checkout is still not enabled because no payment provider, currency/price policy, or refund terms for direct purchase have been approved. The platform avoids claiming that a payment is complete until a real provider integration and webhook-backed payment state exist.
