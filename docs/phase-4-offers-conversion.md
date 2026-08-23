# Phase 4: Offers And Conversion

## Purpose

Turn the three approved offers into a coherent public journey. Every offer explains its value, identifies its best fit, and leads to the appropriate real action instead of a generic contact page.

## Implemented public routes

| Route | Purpose |
| --- | --- |
| `/offers` | Editorial offer overview and choosing context. |
| `/offers/credibility-audit` | Credibility Audit detail and booking-request CTA. |
| `/offers/earned-credibility-intensive` | Earned Credibility Intensive detail and application CTA. |
| `/discern` | Dedicated DISCERN flagship advisory page and application CTA. |
| `/application/:offerSlug` | Three-step application for considered strategic work. |
| `/booking/:offerSlug` | Booking request for an audit, or an external calendar when an admin has configured one. |

## Lead capture and follow-up

- Applications use the existing `POST /api/applications` endpoint and create a lead, application record, and application-received email.
- Booking requests use `POST /api/bookings` and create a lead, booking record, and booking confirmation email.
- When an admin accepts an application, the email now links to that offer's booking route by default. An offer-level external booking URL overrides it when configured.
- The existing admin **Applications**, **Bookings**, and **Leads** pages remain the operational place to review and act on each request.

## Catalogue data

The canonical offer seed now contains:

1. Credibility Audit
2. Earned Credibility Intensive
3. DISCERN

Use `npm run seed:offers` to upsert only these three offer records. It does not modify assessment questions, resources, recommendations, subscribers, or client records. This is intentionally separate from `seed:assessment`, which has a wider reset/update surface.

Until the new seed is applied, public pages retain the approved copy for presentation, while new application and booking submissions stay disabled rather than creating a request against an unavailable offer record.

## Deliberately deferred

- Checkout and payment confirmation: no provider or price configuration has been approved yet.
- External calendar configuration: add an `externalBookingUrl` to an offer in Admin when a real Calendly, Cal.com, or equivalent URL is ready.
