import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, FileText, RotateCcw, Scale, ShieldCheck } from "lucide-react";

const legalPages = {
  privacy: {
    eyebrow: "Privacy",
    title: "Privacy Policy",
    intro: "Your information is treated with care and used only to support a clear, relevant experience with Magdalene Wambui and Earned Credibility.",
    icon: ShieldCheck,
    sections: [
      {
        title: "What I collect",
        paragraphs: [
          "I collect the details you choose to share through the assessment, contact form, booking requests, applications, testimonial requests, and Code of Resonance subscription. This can include your name, email address, profession, business context, website, and the information you provide about your goals or challenges.",
          "I also retain operational records needed to manage your enquiry, application, booking, assessment result, consent preferences, and email delivery."
        ]
      },
      {
        title: "How I use it",
        paragraphs: [
          "Your information is used to respond to you, deliver the assessment and its email-based resources, manage a booking or application, improve the site, and send the communications you have agreed to receive.",
          "You can unsubscribe from marketing communications at any time. Essential transactional emails, such as a requested assessment result or booking confirmation, may still be sent when needed to provide that service."
        ]
      },
      {
        title: "Service providers and storage",
        paragraphs: [
          "The platform uses selected service providers to operate securely, including MongoDB for application data, Resend for email delivery, and Cloudinary for media handling. They process information only as needed to provide their services.",
          "Access to operational records is limited to authorised administrators and service providers supporting this platform."
        ]
      },
      {
        title: "Your choices",
        paragraphs: [
          "You may request access to, correction of, or deletion of personal information held about you, subject to any legal or legitimate operational requirement to retain it. You may also withdraw marketing consent at any time.",
          "For privacy requests, contact hello@magdalenewambui.com."
        ]
      }
    ]
  },
  terms: {
    eyebrow: "Terms",
    title: "Terms of Use",
    intro: "These terms explain how the Earned Credibility Trust Hub, its assessment, resources, and ways of working may be used.",
    icon: Scale,
    sections: [
      {
        title: "The purpose of this site",
        paragraphs: [
          "This site provides information about Earned Credibility, The Code of Resonance, and Magdalene Wambui's services. The assessment and resources are designed for education and strategic reflection. They are not a guarantee of a particular business, personal-brand, or commercial outcome."
        ]
      },
      {
        title: "Applications and bookings",
        paragraphs: [
          "Submitting an application or booking request does not create a client relationship or guarantee acceptance into a service. Magdalene reviews applications to determine fit and may recommend a different next step where that is more useful.",
          "Any scope, timing, payment, and service terms for paid work are confirmed separately and in writing before an engagement begins."
        ]
      },
      {
        title: "Content and intellectual property",
        paragraphs: [
          "The Earned Credibility, Resonance Quotient, Trusted Choice, DISCERN, and Code of Resonance materials are protected content. You may read, share links to, and use the resources for your own learning, but you may not reproduce, sell, republish, or present them as your own without written permission."
        ]
      },
      {
        title: "Respectful use",
        paragraphs: [
          "Do not misuse the site, submit misleading information, attempt unauthorised access, or interfere with the platform's security or delivery systems."
        ]
      }
    ]
  },
  "assessment-disclaimer": {
    eyebrow: "Assessment",
    title: "Assessment Disclaimer",
    intro: "The Resonance Quotient assessment is a structured reflection on how clearly your earned credibility is currently being communicated.",
    icon: FileText,
    sections: [
      {
        title: "How to read your result",
        paragraphs: [
          "Your result is based on the answers you provide and is intended to help you identify a practical next step around story, trust, positioning, proof, or resonance. It is not a clinical, psychological, legal, financial, or professional diagnosis.",
          "A result does not measure your worth, the quality of your work, or your potential. It reflects what this assessment can see from the information available at the time."
        ]
      },
      {
        title: "Recommendations",
        paragraphs: [
          "Any resource, offer, or action recommended after the assessment is a starting point, not a promise of a particular result. You remain responsible for deciding whether that action suits your circumstances."
        ]
      },
      {
        title: "Privacy and delivery",
        paragraphs: [
          "Your answers and contact details are stored so your result can be delivered, understood, and followed up appropriately. Marketing messages are sent only in line with your communication preferences."
        ]
      }
    ]
  },
  "refund-policy": {
    eyebrow: "Payments",
    title: "Refund Policy",
    intro: "The site does not currently process instant checkout payments. Paid work begins only after the right support path and terms have been confirmed.",
    icon: RotateCcw,
    sections: [
      {
        title: "Before an engagement begins",
        paragraphs: [
          "The scope, payment schedule, rescheduling terms, and any applicable refund arrangements for a paid service will be confirmed in the service agreement or invoice before work starts."
        ]
      },
      {
        title: "Booking requests and applications",
        paragraphs: [
          "Submitting an application, booking request, or assessment does not create a payment obligation. A paid engagement begins only after the offer and terms have been agreed."
        ]
      },
      {
        title: "Questions about a payment",
        paragraphs: [
          "For a question about an agreed service, invoice, or payment arrangement, contact hello@magdalenewambui.com with the relevant details."
        ]
      }
    ]
  }
};

export default function LegalPage({ page: pageProp }) {
  const { page: pageParam } = useParams();
  const page = pageProp || pageParam;
  const content = legalPages[page];

  if (!content) return <Navigate to="/" replace />;

  const Icon = content.icon;

  return (
    <main className="bg-mistWhite py-10 sm:py-14 lg:py-20">
      <div className="container-shell max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-deepEmerald transition hover:text-charcoal">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to home
        </Link>

        <section className="mt-8 border border-sage bg-white p-6 shadow-[0_18px_42px_rgba(34,34,34,0.055)] sm:p-10">
          <Icon className="text-deepEmerald" size={28} aria-hidden="true" />
          <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">{content.eyebrow}</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-charcoal sm:text-5xl">{content.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-charcoal/72">{content.intro}</p>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-charcoal/45">Last updated August 20, 2026</p>
        </section>

        <div className="mt-8 divide-y divide-sage border-y border-sage">
          {content.sections.map((section) => (
            <section key={section.title} className="py-8 sm:py-10">
              <h2 className="font-serif text-3xl leading-tight text-charcoal">{section.title}</h2>
              <div className="mt-4 grid gap-4 text-base leading-7 text-charcoal/72">
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
