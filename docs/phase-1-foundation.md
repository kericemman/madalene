# Phase 1 Foundation Blueprint

## Purpose

Phase 1 turns the Earned Credibility platform into a clear trust system before the next design and backend build. The goal is to protect Magdalene Wambui's credibility by making every public page, admin workflow, offer, assessment result, and email point back to one coherent idea:

> You may not need more credibility. You may need to position the credibility you have already earned.

This phase should prevent the site from feeling like a document with sections piled together. The structure must feel intentional, useful, and conversion-ready.

## Core Positioning

Magdalene's story is the credibility engine behind the brand.

She did not build authority by trying to become more impressive. She built it by recognising that her expertise, lived experience, grief, wellness journey, resilience, and public proof were already credibility assets. Earned Credibility exists to help other practitioners position the credibility they have already earned.

Use this message consistently:

- The home page introduces the idea.
- The About page carries the full first-person origin story.
- The assessment diagnoses where credibility is unclear.
- The result email delivers practical next steps inside the email.
- The Code of Resonance nurtures trust through a five-day email sequence and ongoing essays.
- The offer system routes people to the right level of support.

## Public Sitemap

### Primary Public Pages

- `/` - Home
- `/about` - Full first-person story, philosophy, proof, and personal layer
- `/assessment` - Seven-minute Earned Credibility assessment
- `/results/:token` - Personalised result page
- `/offers` - Offer overview page
- `/offers/credibility-audit` - Credibility Audit page
- `/offers/earned-credibility-intensive` - Earned Credibility Intensive page
- `/discern` - Flagship DISCERN advisory page
- `/code-of-resonance` - Code hub
- `/code-of-resonance/essays` - Essays
- `/code-of-resonance/trust-resonance` - Trust and resonance category
- `/code-of-resonance/recommended-reading` - Reading list
- `/code-of-resonance/case-studies` - Case studies
- `/code-of-resonance/guides` - Guides
- `/code-of-resonance/stories` - Stories
- `/code-of-resonance/read/:slug` - Single entry page
- `/contact` - Contact page with modal inquiry form

### Hidden Or Utility Public Pages

- `/testimonial-request` - Hidden link Magdalene shares with clients
- `/application/:offerSlug` - Offer application form
- `/application/:offerSlug/decision` - Post-application decision page
- `/booking/:offerSlug` - Booking page or embedded calendar wrapper
- `/checkout/:offerSlug` - Payment route for direct-purchase offers
- `/resources/:slug` - Resource notice page explaining email-native delivery
- `/privacy` - Privacy policy
- `/terms` - Terms
- `/assessment-disclaimer` - Assessment disclaimer
- `/refund-policy` - Refund policy

## Recommended Navbar

Keep the public navbar focused. Too many top-level links will weaken the premium feel.

### Desktop

- Home
- About
- Assessment
- The Code of Resonance - dropdown
- Contact
- Primary CTA: Start Assessment

### Code of Resonance Dropdown

- All Notes
- Essays
- Trust and Resonance
- Recommended Reading
- Case Studies
- Guides
- Stories

### Mobile

Use the same structure, but stack it cleanly:

- Home
- About
- Assessment
- The Code of Resonance
- Contact
- Start Assessment button

## Admin Sitemap

### Core Admin Pages

- `/admin` - Overview dashboard
- `/admin/leads` - Lead CRM and status management
- `/admin/messages` - Contact inquiries
- `/admin/results` - Assessment results and recommendations
- `/admin/assessment` - Questions, scoring, score ranges, and recommendation rules
- `/admin/offers` - Offer setup and CTA routing
- `/admin/applications` - Offer applications and qualification decisions
- `/admin/bookings` - Bookings and fit-call tracking
- `/admin/code-of-resonance` - Public Code content
- `/admin/code-automation` - Five-day subscriber sequence and email delivery
- `/admin/emails` - General email templates and scheduled emails
- `/admin/reviews` - Testimonial approval
- `/admin/media` - Cloudinary media assets
- `/admin/settings` - Site, sender, admin users, and platform settings

## User Journeys

### 1. Assessment Journey

1. Visitor lands on home, About, Code, or offer content.
2. Visitor starts the assessment.
3. User completes the step-by-step form.
4. Backend stores the result and creates or updates the lead.
5. Result page shows score, stage, strongest category, weakest category, and next step.
6. Email sends the full resource directly inside the email.
7. Admin dashboard records the result and recommendation.
8. Lead is routed to the correct resource, audit, intensive, or DISCERN path.

### 2. Code of Resonance Subscriber Journey

1. Visitor reads Code content.
2. Visitor clicks Subscribe.
3. Subscription modal collects email and consent.
4. Confirmation email sends immediately.
5. Day 1 email sends two minutes later.
6. Day 2 to Day 5 emails continue through the sequence.
7. Final email includes a clear CTA to explore paid support or the next best resource.
8. Admin can edit every day email with the Tiptap editor.

### 3. Offer Journey

Different offers need different levels of friction.

- Credibility Audit: direct purchase or booking, then intake form.
- Earned Credibility Intensive: application or consult path, depending on final offer model.
- DISCERN: dedicated page, application, decision page, qualified calendar, fit call, nurture if no booking.

### 4. Testimonial Journey

1. Magdalene sends a private testimonial request link.
2. Client submits testimonial.
3. Admin reviews and approves.
4. Latest three approved testimonials show on home.
5. Full approved testimonial library shows on About.

### 5. Contact Journey

1. Visitor clicks Write a Message.
2. Modal form collects inquiry details.
3. Backend stores message.
4. User receives confirmation email.
5. Email invites them to subscribe to the Code of Resonance.
6. Admin sees the message under Messages.

## Three Offer Architecture

### 01. Credibility Audit

Role: Diagnose.

Promise: Find out what is making people hesitate.

Best for: Someone who knows something is not landing but cannot tell exactly what.

Primary CTA: Book Your Credibility Audit.

System path: checkout or booking -> intake -> confirmation email -> delivery workflow.

### 02. Earned Credibility Intensive

Role: Extract.

Promise: Stop sounding like everyone else in your field.

Best for: Someone who needs to uncover and articulate what makes their authority difficult to compare.

Primary CTA: Uncover What Makes You Difficult to Copy.

System path: offer page -> application or booking -> confirmation email -> admin follow-up.

### 03. DISCERN

Role: Reposition.

Promise: Reposition expertise and lived experience into a cohesive authority brand.

Best for: Established wellness practitioners whose reputation needs to catch up with the depth of their work.

Primary CTA: Apply for DISCERN.

System path: dedicated page -> application -> decision page -> calendar for qualified leads -> fit call -> nurture if not booked.

## Brand And Credibility Rules

### Brand Colours

- Deep Emerald: `#0B6E4F` - 60 percent usage; identity, primary buttons, links, key highlights, icons
- Soft Mist White: `#F5F7F4` - 25 percent usage; backgrounds, whitespace, reading sections
- Charcoal Black: `#222222` - 10 percent usage; typography, navigation, footer, premium contrast
- Sage: `#DCE8DF` - 5 percent usage; dividers, cards, quote areas, worksheets
- Muted Mint: `#CFE5D8` - sparingly; hover states, subtle highlights, success states

### Copy Rules

- Use first person for Magdalene's story: "I", not "she".
- Use proof after philosophy, not before it.
- Do not overuse claims without visible evidence or source context.
- Avoid dense paragraphs on landing sections.
- Do not make every page explain everything.
- Keep CTAs specific to intent.
- Use specific offer language, not generic "book a call" everywhere.

### Design Rules

- Home should feel like a guided trust journey, not a long article.
- About should carry the deeper narrative.
- Offer pages should feel decisive and commercial.
- Assessment should feel simple, guided, and low-friction.
- Admin should feel operational, not decorative.
- Use images, proof bars, split sections, cards, and step flows to break copy.

## Folder Structure Direction

The current code already separates public and admin pages. Keep that pattern.

### Frontend Target

```text
frontend/src/pages/public/
  about/
  assessment/
  codeOfResonance/
  contact/
  home/
  offers/
  testimonial/

frontend/src/pages/admin/
  applications/
  assessment/
  codeOfResonance/
  dashboard/
  emails/
  leads/
  media/
  messages/
  offers/
  reviews/
  settings/
```

### Backend Target

```text
backend/controllers/
  applicationController.js
  bookingController.js
  offerController.js
  orderController.js

backend/models/
  Application.js
  Booking.js
  Order.js

backend/routes/
  applicationRoutes.js
  bookingRoutes.js
  offerRoutes.js
  orderRoutes.js
```

Do not migrate files just for tidiness. Move files only when a feature is being rebuilt or expanded.

## Current Gaps Found In The App

- Home offers are still three static cards and do not match the final editorial offer-preview architecture.
- Offer CTAs currently route too generally instead of using offer-specific flows.
- Public offer pages are missing.
- DISCERN page exists but needs the full funnel: sales page, application, decision page, calendar, nurture.
- Admin nav has Leads and Messages labels, but both currently point back to `/admin`.
- Admin offer APIs exist, but a dedicated admin offers screen is not connected.
- Backend Lead model already supports many funnel statuses, but application, booking, checkout, and order models are not implemented yet.
- About page does not yet carry the full first-person origin story.
- Legal links exist in the footer, but the actual public pages are not implemented.

## Phase 1 Completion Criteria

Phase 1 is complete when:

- The sitemap is approved.
- The navbar structure is approved.
- The offer architecture is approved.
- The admin sitemap is approved.
- The five key journeys are approved.
- The brand and credibility rules are agreed.
- The Phase 2 backend/admin build can proceed without guessing.
