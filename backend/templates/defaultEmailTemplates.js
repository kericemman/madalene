const colors = {
  deepEmerald: "#0F4D3E",
  mistWhite: "#F7F8F6",
  charcoal: "#1A1A1A",
  sage: "#B8D8C5",
  mutedMint: "#B8D8C5",
  white: "#FFFFFF"
};

const systemVariables = ["brandHomeUrl", "brandLogoUrl", "currentYear"];

const withSystemVariables = (variables) => [...variables, ...systemVariables];

const paragraph = (content) => `
  <p style="margin:0 0 18px;color:${colors.charcoal};font-size:16px;line-height:1.65;">
    ${content}
  </p>
`;

const heading = (content) => `
  <h2 style="margin:28px 0 12px;color:${colors.deepEmerald};font-size:21px;line-height:1.25;font-weight:800;">
    ${content}
  </h2>
`;

const note = (content) => `
  <div style="margin:26px 0;padding:18px 20px;border-left:4px solid ${colors.deepEmerald};background:${colors.mistWhite};">
    <p style="margin:0;color:${colors.charcoal};font-size:15px;line-height:1.6;">${content}</p>
  </div>
`;

const button = (href, label) => `
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:28px 0 6px;">
    <tr>
      <td style="border-radius:4px;background:${colors.deepEmerald};">
        <a href="${href}" style="display:inline-block;padding:14px 22px;color:${colors.white};font-size:14px;font-weight:700;line-height:1;text-decoration:none;text-transform:uppercase;letter-spacing:.04em;">
          ${label}
        </a>
      </td>
    </tr>
  </table>
`;

const metric = (label, value) => `
  <td style="width:50%;padding:10px;" valign="top">
    <div style="min-height:96px;padding:18px;border:1px solid ${colors.sage};border-radius:8px;background:${colors.mistWhite};">
      <p style="margin:0 0 8px;color:${colors.deepEmerald};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">${label}</p>
      <p style="margin:0;color:${colors.charcoal};font-size:20px;font-weight:800;line-height:1.25;">${value}</p>
    </div>
  </td>
`;

const metricGrid = (items) => `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:14px -10px 22px;">
    <tr>
      ${items.map((item) => metric(item.label, item.value)).join("")}
    </tr>
  </table>
`;

const shell = ({ preheader, eyebrow, title, body, footerNote }) => `
<!doctype html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body style="margin:0;padding:0;background:${colors.mistWhite};font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;line-height:1px;">
      ${preheader}
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:${colors.mistWhite};">
      <tr>
        <td align="center" style="padding:32px 14px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:660px;border-collapse:separate;border-spacing:0;">
            <tr>
              <td style="padding:24px 28px;background:${colors.charcoal};border-radius:14px 14px 0 0;border-bottom:4px solid ${colors.deepEmerald};">
                <a href="{{brandHomeUrl}}" style="display:inline-block;text-decoration:none;">
                  <img src="{{brandLogoUrl}}" width="285" alt="Magdalene Wambui - Become The Trusted Choice" style="display:block;width:285px;max-width:100%;height:auto;border:0;outline:none;text-decoration:none;" />
                </a>
              </td>
            </tr>

            <tr>
              <td style="padding:0;background:${colors.white};border-right:1px solid ${colors.sage};border-left:1px solid ${colors.sage};">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="padding:38px 34px 34px;">
                      <p style="margin:0 0 12px;color:${colors.deepEmerald};font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;">${eyebrow}</p>
                      <h1 style="margin:0 0 18px;color:${colors.charcoal};font-size:30px;line-height:1.12;font-weight:800;letter-spacing:0;">
                        ${title}
                      </h1>
                      ${body}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:22px 28px;background:${colors.charcoal};border-radius:0 0 14px 14px;">
                <p style="margin:0 0 10px;color:${colors.mistWhite};font-size:13px;line-height:1.6;">
                  ${footerNote || "You are receiving this because you connected with Magdalene Wambui through the Earned Credibility Trust Hub."}
                </p>
                <p style="margin:0;color:${colors.mutedMint};font-size:12px;line-height:1.5;">
                  &copy; {{currentYear}} Magdalene Wambui. Become The Trusted Choice.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

const codeSequenceTemplate = ({ day, subject, preheader, title, body }) => ({
  key: `code_resonance_day_${day}`,
  name: `Code of Resonance Day ${day}`,
  type: "code_resonance_sequence",
  subject,
  preheader,
  html: shell({
    preheader,
    eyebrow: `The Code of Resonance - Day ${day}`,
    title,
    body: `
      ${paragraph("Hello {{firstName}},")}
      ${body}
      ${button("{{brandHomeUrl}}/discern", "Explore DISCERN")}
      ${paragraph("Warmly,<br />Magdalene Wambui")}
    `,
    footerNote: "You are receiving this because you subscribed to The Code of Resonance."
  }),
  text: `Hello {{firstName}},\n\n${preheader}\n\nExplore DISCERN: {{brandHomeUrl}}/discern\n\nWarmly,\nMagdalene Wambui`,
  variables: withSystemVariables(["firstName", "subscriptionName"])
});

export const codeOfResonanceSequence = {
  key: "code_of_resonance_5_day",
  name: "The Code of Resonance 6-Day Sequence",
  description: "Six trust-building emails for new Code of Resonance subscribers.",
  trigger: "code_of_resonance_subscription",
  steps: [
    { templateKey: "code_resonance_day_1", delayMinutes: 2, order: 1 },
    { templateKey: "code_resonance_day_2", delayDays: 1, order: 2 },
    { templateKey: "code_resonance_day_3", delayDays: 2, order: 3 },
    { templateKey: "code_resonance_day_4", delayDays: 3, order: 4 },
    { templateKey: "code_resonance_day_5", delayDays: 4, order: 5 },
    { templateKey: "code_resonance_day_6", delayDays: 5, order: 6 }
  ]
};

export const defaultEmailTemplates = [
  {
    key: "contact_confirmation",
    name: "Contact Confirmation",
    type: "contact_confirmation",
    subject: "I received your message",
    preheader: "Thank you for contacting Magdalene Wambui.",
    html: shell({
      preheader: "Thank you for contacting Magdalene Wambui.",
      eyebrow: "Message Received",
      title: "Your message is in safe hands.",
      body: `
        ${paragraph("Hello {{name}},")}
        ${paragraph("Thank you for reaching out. I have received your message and will review it with care. If your enquiry needs a direct reply, I will respond as soon as possible.")}
        ${note("In the meantime, keep noticing where your credibility is already present and where it needs to become easier for others to trust.")}
        ${paragraph("You are also welcome to subscribe to <strong>The Code of Resonance</strong>, where I share trust-building notes, credibility reflections, and practical prompts for becoming the trusted choice.")}
        ${button("{{brandHomeUrl}}/code-of-resonance?subscribe=1", "Subscribe To The Code")}
        ${paragraph("Warmly,<br />Magdalene Wambui")}
      `
    }),
    text: "Hello {{name}},\n\nThank you for reaching out. I have received your message and will review it with care. If your enquiry needs a direct reply, I will respond as soon as possible.\n\nYou are also welcome to subscribe to The Code of Resonance for trust-building notes, credibility reflections, and practical prompts for becoming the trusted choice: {{brandHomeUrl}}/code-of-resonance?subscribe=1\n\nWarmly,\nMagdalene Wambui",
    variables: withSystemVariables(["name"])
  },
  {
    key: "admin_contact_notification",
    name: "Admin Contact Notification",
    type: "admin_contact_notification",
    subject: "New Trust Hub enquiry from {{name}}",
    preheader: "A new contact form message has arrived.",
    html: shell({
      preheader: "A new contact form message has arrived.",
      eyebrow: "New Enquiry",
      title: "{{name}} sent a message.",
      body: `
        ${metricGrid([
          { label: "Email", value: "{{email}}" },
          { label: "Reason", value: "{{reason}}" }
        ])}
        ${paragraph("<strong>Profession:</strong> {{profession}}")}
        <div style="margin:18px 0 0;padding:20px;border:1px solid ${colors.sage};border-radius:8px;background:${colors.mistWhite};">
          <p style="margin:0 0 8px;color:${colors.deepEmerald};font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;">Message</p>
          <p style="margin:0;color:${colors.charcoal};font-size:15px;line-height:1.65;white-space:pre-line;">{{message}}</p>
        </div>
      `,
      footerNote: "This is an internal admin notification from the Earned Credibility Trust Hub."
    }),
    text: "New contact message\n\nName: {{name}}\nEmail: {{email}}\nProfession: {{profession}}\nReason: {{reason}}\n\nMessage:\n{{message}}",
    variables: withSystemVariables(["name", "email", "profession", "reason", "message"])
  },
  {
    key: "newsletter_welcome",
    version: 2,
    name: "Code Subscription Confirmation",
    type: "newsletter_welcome",
    subject: "You are subscribed to The Code of Resonance",
    preheader: "Thank you for subscribing. Your 6-day trust-building sequence starts shortly.",
    html: shell({
      preheader: "Thank you for subscribing. Your 6-day trust-building sequence starts shortly.",
      eyebrow: "Code of Resonance",
      title: "Thank you for subscribing.",
      body: `
        ${paragraph("Hello {{firstName}},")}
        ${paragraph("Thank you for subscribing to <strong>{{subscriptionName}}</strong>. I am glad you are here.")}
        ${paragraph("Over the next six days, I will send you a short trust-building email series on how to make your earned credibility more visible, memorable, and easier for the right people to trust.")}
        ${note("Your Day 1 email should arrive a few minutes after this confirmation. If you do not see it, check your Promotions, Updates, or spam folder and move it to your primary inbox.")}
        ${paragraph("Warmly,<br />Magdalene Wambui")}
      `
    }),
    text: "Hello {{firstName}},\n\nThank you for subscribing to {{subscriptionName}}.\n\nOver the next six days, I will send you a short trust-building email series on how to make your earned credibility more visible, memorable, and easier for the right people to trust.\n\nYour Day 1 email should arrive a few minutes after this confirmation. If you do not see it, check your Promotions, Updates, or spam folder and move it to your primary inbox.\n\nWarmly,\nMagdalene Wambui",
    variables: withSystemVariables(["firstName", "subscriptionName"])
  },
  {
    ...codeSequenceTemplate({
      day: 1,
      subject: "Day 1: Trust begins before the first conversation",
      preheader: "The first Code of Resonance note: trust starts before people contact you.",
      title: "Trust begins before the first conversation.",
      body: `
        ${paragraph("Most practitioners think trust begins when a potential client speaks with them. In reality, trust begins much earlier.")}
        ${paragraph("It begins when someone lands on your profile, reads your words, notices your proof, and quietly asks: can I trust this person with what matters to me?")}
        ${note("Today, look at one public touchpoint and ask: what would help a new person feel safer choosing me before we ever speak?")}
      `
    })
  },
  {
    ...codeSequenceTemplate({
      day: 2,
      subject: "Day 2: Your story is not decoration",
      preheader: "Your story helps people understand why your work carries weight.",
      title: "Your story is not decoration.",
      body: `
        ${paragraph("Your story is not there to make your brand emotional for the sake of it. It helps people understand why your work carries weight.")}
        ${paragraph("When your story is connected to your philosophy, your experience becomes easier to trust. People can see not only what you do, but why you care enough to do it well.")}
        ${note("Today, write one sentence that begins: I do this work because...")}
      `
    })
  },
  {
    ...codeSequenceTemplate({
      day: 3,
      subject: "Day 3: Proof makes trust easier",
      preheader: "Proof is not bragging. It is evidence that reduces hesitation.",
      title: "Proof makes trust easier.",
      body: `
        ${paragraph("Proof is not bragging. It is evidence that reduces hesitation.")}
        ${paragraph("Your client stories, testimonials, outcomes, frameworks, and professional recognition help people understand that your credibility is not a claim. It has been earned.")}
        ${note("Today, choose one piece of proof you already have and decide where it needs to become more visible.")}
      `
    })
  },
  {
    ...codeSequenceTemplate({
      day: 4,
      subject: "Day 4: Positioning creates preference",
      preheader: "Clear positioning helps people remember why you are the right choice.",
      title: "Positioning creates preference.",
      body: `
        ${paragraph("Being visible is not the same as being chosen. People choose when they understand what makes your approach different and why that difference matters to them.")}
        ${paragraph("Clear positioning gives your credibility a shape. It helps people explain you, remember you, and refer you with confidence.")}
        ${note("Today, answer this: if a client explained why they chose me instead of someone else, what would I hope they say?")}
      `
    })
  },
  {
    ...codeSequenceTemplate({
      day: 5,
      subject: "Day 5: Become the trusted choice",
      preheader: "The trusted choice is remembered because trust, proof, story and resonance work together.",
      title: "Become the trusted choice.",
      body: `
        ${paragraph("The Trusted Choice is not simply the most qualified person in the room. The Trusted Choice is the practitioner whose credibility is visible, specific, memorable, and trusted.")}
        ${paragraph("That happens when your story, trust signals, positioning, proof, and resonance work together.")}
        ${note("If you are ready to understand where your earned credibility is strong and where it needs strategy, DISCERN is the next step.")}
      `
    })
  },
  {
    ...codeSequenceTemplate({
      day: 6,
      subject: "Day 6: What your credibility needs next",
      preheader: "A final trust-building prompt to help you decide what needs strategy now.",
      title: "What your credibility needs next.",
      body: `
        ${paragraph("Trust grows when your expertise, story, proof, positioning, and presence are working together instead of competing for attention.")}
        ${paragraph("By now, you have looked at the signals people notice before they choose. The next question is not whether you are credible. It is whether your credibility is organised clearly enough for the right people to understand, remember, and trust it.")}
        ${note("Today, choose one credibility signal that needs strengthening first: your story, your proof, your positioning, your message, or your public presence.")}
      `
    })
  },
  {
    key: "code_resonance_universal",
    name: "Code of Resonance Universal Email",
    type: "code_resonance_sequence",
    subject: "A note from The Code of Resonance",
    preheader: "A credibility reflection from Magdalene Wambui.",
    html: shell({
      preheader: "A credibility reflection from Magdalene Wambui.",
      eyebrow: "The Code of Resonance",
      title: "A note on trust, visibility, and earned credibility.",
      body: `
        ${paragraph("Hello {{firstName}},")}
        ${paragraph("Use this space for a standalone Code of Resonance email when there is something timely, personal, or strategic to send outside the automated sequence.")}
        ${note("Write the full email here, then connect it to the most relevant next step only when the message naturally calls for it.")}
        ${button("{{brandHomeUrl}}/discern", "Explore DISCERN")}
        ${paragraph("Warmly,<br />Magdalene Wambui")}
      `,
      footerNote: "You are receiving this because you subscribed to The Code of Resonance."
    }),
    text: "Hello {{firstName}},\n\nUse this space for a standalone Code of Resonance email when there is something timely, personal, or strategic to send outside the automated sequence.\n\nExplore DISCERN: {{brandHomeUrl}}/discern\n\nWarmly,\nMagdalene Wambui",
    variables: withSystemVariables(["firstName", "subscriptionName"])
  },
  {
    key: "assessment_results",
    version: 6,
    name: "Assessment Results Delivered",
    type: "results_delivered",
    subject: "Your Earned Credibility™ results are in",
    preheader: "Your score, stage, biggest opportunity, and recommended resource are inside.",
    html: shell({
      preheader: "Your score, stage, biggest opportunity, and recommended resource are inside.",
      eyebrow: "Assessment Results",
      title: "Your Earned Credibility™ results are in.",
      body: `
        ${paragraph("Hello {{firstName}},")}
        ${paragraph("Your assessment gives you a clearer view of how visible, trusted, and easy to choose your earned credibility currently is.")}
        ${metricGrid([
          { label: "Earned Credibility™ Score", value: "{{score}}/{{scoreMax}}" },
          { label: "Your Stage", value: "{{stage}}" }
        ])}
        ${heading("{{stage}}")}
        ${paragraph("{{stageWhatItMeans}}")}
        ${heading("Your Biggest Opportunity")}
        ${note("{{stageBiggestOpportunity}}")}
        ${heading("Start Here")}
        <div style="margin:0 0 20px;color:${colors.charcoal};font-size:16px;line-height:1.65;">
          {{{stageNextStepsHtml}}}
        </div>
        ${heading("Recommended for you")}
        ${paragraph("<strong>{{stageResourceTitle}}</strong><br />{{stageResourceDescription}}")}
        ${button("{{stageResourceUrl}}", "Read Recommended Resource")}
        <div style="margin:0 0 20px;color:${colors.charcoal};font-size:16px;line-height:1.65;">
          {{{gapResourcesHtml}}}
        </div>
        ${note("{{stageFinalNote}}")}
        ${note("Ready to turn these insights into a positioning direction people can recognise and remember?")}
        ${button("{{intensiveCtaUrl}}", "{{intensiveCtaText}}")}
        ${button("{{resultsUrl}}", "View Full Results")}
      `
    }),
    text: "Hello {{firstName}},\n\nYour Earned Credibility™ Score is {{score}}/{{scoreMax}}.\n\n{{stage}}\n\n{{stageWhatItMeans}}\n\nYour Biggest Opportunity\n{{stageBiggestOpportunity}}\n\nStart Here\n{{stageNextStepsText}}\n\nRecommended for you: {{stageResourceTitle}}\n{{stageResourceDescription}}\nRead resource: {{stageResourceUrl}}\n\n{{gapResourcesText}}\n\n{{stageFinalNote}}\n\n{{intensiveCtaText}}: {{intensiveCtaUrl}}\n\nView your full results: {{resultsUrl}}",
    variables: withSystemVariables([
      "firstName",
      "score",
      "scoreMax",
      "stage",
      "stageWhatItMeans",
      "stageBiggestOpportunity",
      "stageNextStepsHtml",
      "stageNextStepsText",
      "stageFinalNote",
      "stageResourceTitle",
      "stageResourceDescription",
      "stageResourceUrl",
      "gapResourcesHtml",
      "gapResourcesText",
      "intensiveCtaText",
      "intensiveCtaUrl",
      "recommendedAction",
      "resultsUrl"
    ])
  },
  {
    key: "assessment_next_action",
    name: "Assessment Next Action",
    type: "assessment_next_action",
    subject: "Your recommended next step after the 7-minute assessment",
    preheader: "A personalised next action based on your Earned Credibility score.",
    html: shell({
      preheader: "A personalised next action based on your Earned Credibility score.",
      eyebrow: "Next Action",
      title: "Here is the next credibility move I recommend.",
      body: `
        ${paragraph("Hello {{firstName}},")}
        ${paragraph("I reviewed your 7-minute Earned Credibility assessment. Your score is <strong>{{score}}/{{scoreMax}}</strong>, which places you at <strong>{{grade}}</strong>.")}
        ${metricGrid([
          { label: "Strongest Area", value: "{{strongestCategory}}" },
          { label: "Focus Area", value: "{{weakestCategory}}" }
        ])}
        ${note("My recommendation: <strong>{{recommendedAction}}</strong>")}
        ${button("{{ctaUrl}}", "{{ctaText}}")}
        ${paragraph("Warmly,<br />Magdalene Wambui")}
      `
    }),
    text: "Hello {{firstName}},\n\nI reviewed your 7-minute Earned Credibility assessment. Your score is {{score}}/{{scoreMax}}, which places you at {{grade}}.\n\nYour strongest area is {{strongestCategory}}, and the dimension that deserves the most attention right now is {{weakestCategory}}.\n\nRecommended next action: {{recommendedAction}}\n\n{{ctaText}}: {{ctaUrl}}\n\nWarmly,\nMagdalene Wambui",
    variables: withSystemVariables([
      "firstName",
      "score",
      "scoreMax",
      "grade",
      "storedStage",
      "expectedStage",
      "strongestCategory",
      "weakestCategory",
      "recommendedAction",
      "ctaText",
      "ctaUrl"
    ])
  },
  {
    key: "resource_email_delivery",
    name: "Email Resource Delivery",
    type: "free_guide_delivery",
    subject: "{{resourceSubject}}",
    preheader: "{{resourcePreheader}}",
    html: shell({
      preheader: "{{resourcePreheader}}",
      eyebrow: "Your Personalised Resource",
      title: "{{resourceTitle}}",
      body: `
        ${paragraph("Hello {{firstName}},")}
        ${paragraph("Based on your Resonance Quotient result, this is the resource I recommend you work through first. I am sending it directly here so you can read, reflect, and use it without needing to open a separate download.")}
        ${note("Your current stage: <strong>{{stage}}</strong>. Resource focus: <strong>{{resourceFocus}}</strong>.")}
        <div style="margin:28px 0;padding:0;color:${colors.charcoal};font-size:16px;line-height:1.7;">
          {{{resourceBodyHtml}}}
        </div>
        ${button("{{ctaUrl}}", "{{ctaText}}")}
        ${paragraph("Warmly,<br />Magdalene Wambui")}
      `
    }),
    text: "Hello {{firstName}},\n\nBased on your Resonance Quotient result, this is the resource I recommend you work through first.\n\nStage: {{stage}}\nResource: {{resourceTitle}}\n\n{{resourceText}}\n\n{{ctaText}}: {{ctaUrl}}\n\nWarmly,\nMagdalene Wambui",
    variables: withSystemVariables([
      "firstName",
      "stage",
      "resourceSubject",
      "resourcePreheader",
      "resourceTitle",
      "resourceFocus",
      "resourceBodyHtml",
      "resourceText",
      "ctaText",
      "ctaUrl"
    ])
  },
  {
    key: "application_received",
    name: "Application Received",
    type: "application_received",
    subject: "I received your {{offerName}} application",
    preheader: "Thank you for applying to work with Magdalene Wambui.",
    html: shell({
      preheader: "Thank you for applying to work with Magdalene Wambui.",
      eyebrow: "Application Received",
      title: "Your application has been received.",
      body: `
        ${paragraph("Hello {{firstName}},")}
        ${paragraph("Thank you for applying for <strong>{{offerName}}</strong>. I have received your application and will review it with care.")}
        ${note("{{nextStep}}")}
        ${paragraph("If the fit is clear, the next step will be shared with you directly. If another path would serve you better, I will point you toward the most appropriate next step.")}
        ${paragraph("Warmly,<br />Magdalene Wambui")}
      `
    }),
    text: "Hello {{firstName}},\n\nThank you for applying for {{offerName}}. I have received your application and will review it with care.\n\n{{nextStep}}\n\nWarmly,\nMagdalene Wambui",
    variables: withSystemVariables(["firstName", "offerName", "nextStep"])
  },
  {
    key: "application_approved",
    version: 2,
    name: "Application Approved",
    type: "application_approved",
    subject: "Your next step for {{offerName}}",
    preheader: "Your application has been reviewed.",
    html: shell({
      preheader: "Your application has been reviewed.",
      eyebrow: "Next Step",
      title: "Your next step is ready.",
      body: `
        ${paragraph("Hello {{firstName}},")}
        ${paragraph("I have reviewed your application for <strong>{{offerName}}</strong>, and the next step is to book a 1:1 private fit conversation.")}
        ${note("This conversation is designed to clarify fit, timing, and the best strategic path for where you are now.")}
        ${button("{{bookingUrl}}", "Book A 1:1 Call")}
        ${paragraph("Warmly,<br />Magdalene Wambui")}
      `
    }),
    text: "Hello {{firstName}},\n\nI have reviewed your application for {{offerName}}. The next step is to book a 1:1 private fit conversation.\n\nBook a 1:1 call: {{bookingUrl}}\n\nWarmly,\nMagdalene Wambui",
    variables: withSystemVariables(["firstName", "offerName", "bookingUrl"])
  },
  {
    key: "application_not_ready",
    name: "Application Not Ready",
    type: "application_not_ready",
    subject: "A better next step after your {{offerName}} application",
    preheader: "A thoughtful next step based on your application.",
    html: shell({
      preheader: "A thoughtful next step based on your application.",
      eyebrow: "Application Update",
      title: "Here is the next step I recommend.",
      body: `
        ${paragraph("Hello {{firstName}},")}
        ${paragraph("Thank you for applying for <strong>{{offerName}}</strong>. After reviewing your application, I believe a different next step may serve you better right now.")}
        ${note("{{recommendedNextStep}}")}
        ${button("{{ctaUrl}}", "{{ctaText}}")}
        ${paragraph("Warmly,<br />Magdalene Wambui")}
      `
    }),
    text: "Hello {{firstName}},\n\nThank you for applying for {{offerName}}. After reviewing your application, I believe a different next step may serve you better right now.\n\n{{recommendedNextStep}}\n\n{{ctaText}}: {{ctaUrl}}\n\nWarmly,\nMagdalene Wambui",
    variables: withSystemVariables(["firstName", "offerName", "recommendedNextStep", "ctaText", "ctaUrl"])
  },
  {
    key: "booking_confirmation",
    name: "Booking Confirmation",
    type: "booking_confirmation",
    subject: "Your {{sessionName}} is confirmed",
    preheader: "Your session details are inside.",
    html: shell({
      preheader: "Your session details are inside.",
      eyebrow: "Booking Confirmation",
      title: "Your session is confirmed.",
      body: `
        ${paragraph("Hello {{firstName}},")}
        ${paragraph("Your <strong>{{sessionName}}</strong> is scheduled for <strong>{{startsAt}}</strong>.")}
        ${note("Before we speak, take a moment to notice where your credibility already feels strong and where people may still hesitate before choosing you.")}
        ${button("{{meetingUrl}}", "Open Session Link")}
        ${paragraph("Warmly,<br />Magdalene Wambui")}
      `
    }),
    text: "Hello {{firstName}},\n\nYour {{sessionName}} is scheduled for {{startsAt}}.\n\nSession link: {{meetingUrl}}\n\nWarmly,\nMagdalene Wambui",
    variables: withSystemVariables(["firstName", "sessionName", "startsAt", "meetingUrl"])
  },
  {
    key: "free_guide_delivery",
    name: "Legacy Resource Delivery",
    type: "free_guide_delivery",
    subject: "Your credibility resource",
    preheader: "Here is the resource you requested.",
    html: shell({
      preheader: "Here is the resource you requested.",
      eyebrow: "Resource Delivery",
      title: "Your credibility resource is ready.",
      body: `
        ${paragraph("Hello {{firstName}},")}
        ${paragraph("Here is the resource you requested. Use it to begin making your earned credibility more visible, specific, and easier to trust.")}
        ${button("{{resourceUrl}}", "Open Resource")}
        ${note("A small shift in how you communicate proof can change how quickly people understand why they can trust you.")}
      `
    }),
    text: "Hello {{firstName}},\n\nHere is your credibility resource: {{resourceUrl}}\n\nUse it to begin making your earned credibility more visible, specific, and easier to trust.",
    variables: withSystemVariables(["firstName", "resourceUrl"])
  },
  {
    key: "booking_reminder",
    name: "Booking Reminder",
    type: "booking_reminder",
    subject: "Reminder: your session is coming up",
    preheader: "Your scheduled session is almost here.",
    html: shell({
      preheader: "Your scheduled session is almost here.",
      eyebrow: "Session Reminder",
      title: "Your {{sessionName}} is coming up.",
      body: `
        ${paragraph("Hello {{firstName}},")}
        ${paragraph("This is a reminder that your <strong>{{sessionName}}</strong> is scheduled for <strong>{{startsAt}}</strong>.")}
        ${button("{{meetingUrl}}", "Join Session")}
        ${paragraph("I look forward to the conversation.<br />Magdalene Wambui")}
      `
    }),
    text: "Hello {{firstName}},\n\nThis is a reminder that your {{sessionName}} is scheduled for {{startsAt}}.\n\nMeeting link: {{meetingUrl}}",
    variables: withSystemVariables(["firstName", "sessionName", "startsAt", "meetingUrl"])
  }
];

export const defaultEmailTemplateMap = new Map(
  defaultEmailTemplates.map((template) => [template.key, template])
);
