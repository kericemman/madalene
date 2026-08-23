# Phase 3: Assessment And Email Automation

## Purpose

Phase 3 turns the Resonance Quotient into a managed diagnosis and follow-up system. The assessment is not a generic quiz: it should identify where someone is being underestimated, explain the most important credibility opportunity, and guide them to the right next step without over-promising.

## What Is Now Operational

### Assessment Management

- The admin can duplicate an assessment version into a draft, including its questions and scoring setup.
- Draft versions can be edited without changing historic submissions.
- Promoting a version to live archives the previously active version.
- Each assessment result retains a complete scoring snapshot, so past results remain explainable even after the question set evolves.
- Question editing supports categories, answer formats, weights, active status, required answers, and scored or unscored questions.
- The API validates that each question belongs to a category in its assessment version and that choice questions contain valid options.

### Result Stages And Recommendations

- Score stages now manage the participant-facing explanation, opportunity, next steps, resource title, and CTA.
- Active score ranges cannot overlap, avoiding ambiguous grades.
- Recommendation rules can be managed in the dashboard with score, category, readiness, business-stage, offer, resource, CTA, and optional email-sequence criteria.
- A recommendation can point to a paid offer, an email-native resource, or both.

### Email Delivery

- Immediate emails now attempt delivery as soon as they are queued: assessment results, full email resources, contact confirmations, subscription confirmations, booking confirmations, application receipts, and application decisions.
- The email worker is enabled by default and can only be paused explicitly with `ENABLE_EMAIL_WORKER=false`.
- A rule with an `emailSequenceKey` schedules its follow-up sequence after an assessment result is created.
- When an application becomes `accepted`, the applicant receives the approved next-step email. When it becomes `not_ready` or `declined`, the applicant receives a respectful recommended-next-step email.

## Recommended Admin Workflow

1. Duplicate the live assessment version before changing questions or scoring.
2. Edit the draft questions and test the score outcome with representative answers.
3. Confirm the score-stage copy reflects the intended diagnosis.
4. Create or revise a recommendation rule, attach the right offer and email-native resource, then verify its priority.
5. Promote the draft only when the journey is ready; the previous version is archived automatically.

## Email Configuration Required For Real Delivery

The delivery system will queue and attempt messages automatically, but real inbox delivery still requires valid production configuration:

- `RESEND_API_KEY`
- `EMAIL_FROM` using a verified Resend domain
- `APP_URL` pointing to the live public site
- `ENABLE_EMAIL_WORKER` left unset or set to `true`

Use the Emails dashboard to inspect queued, sent, failed, and cancelled jobs. A failed job retains its error and can be retried.

## Deferred To Phase 4

- Public pages for each offer and their dedicated application/booking forms.
- Payment and checkout records for direct-purchase offers.
- Offer-specific calendar routing after a qualified application.
