import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ArrowRight, ChevronDown, Mail, Menu, X } from "lucide-react";
import BrandLogo from "../components/BrandLogo.jsx";
import Seo from "../components/Seo.jsx";
import SiteButton from "../components/SiteButton.jsx";

const seoImage =
  "https://res.cloudinary.com/fkaaucee/image/upload/c_limit,dpr_auto,f_auto,q_auto,w_1280/v1/earned-credibility/site/home/maggy-safron-gardens-00348?_a=BAMAPqM50";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/offers", label: "Services" },
  { href: "/assessment", label: "Assessment" },
  { href: "/contact", label: "Contact" }
];

const codeLinks = [
  { href: "/code-of-resonance", label: "All Notes" },
  { href: "/code-of-resonance/essays", label: "Latest Essays" },
  { href: "/code-of-resonance/trust-resonance", label: "Trust & Resonance" },
  { href: "/code-of-resonance/recommended-reading", label: "Recommended Reading" },
  { href: "/code-of-resonance/case-studies", label: "Case Studies" }
];

const footerColumns = [
  {
    title: "Explore",
    links: [
      { href: "/#earned-credibility", label: "Earned Credibility" },
      { href: "/assessment", label: "Assessment" },
      { href: "/code-of-resonance", label: "The Code of Resonance" },
      { href: "/about", label: "About Me" },
      { href: "/offers", label: "Offers" }
    ]
  },
  {
    title: "Resources",
    links: [
      { href: "/code-of-resonance/guides", label: "Credibility Guides" },
      { href: "/code-of-resonance/recommended-reading", label: "Recommended Reading" },
      { href: "/code-of-resonance/case-studies", label: "Case Studies" },
      { href: "/contact", label: "Contact" }
    ]
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms" },
      { href: "/assessment-disclaimer", label: "Assessment Disclaimer" },
      { href: "/refund-policy", label: "Refund Policy" }
    ]
  }
];

const defaultSeo = {
  title: "Earned Credibility Trust Hub | Magdalene Wambui",
  description:
    "Discover your Resonance Quotient, position the credibility you have already earned, and become easier to trust, remember, and choose.",
  canonicalPath: "/",
  image: seoImage
};

const seoByPath = {
  "/": defaultSeo,
  "/about": {
    title: "About Magdalene Wambui | Earned Credibility",
    description:
      "Meet Magdalene Wambui and learn how earned credibility, lived experience, and strategic positioning shape her work with wellness practitioners and experts.",
    canonicalPath: "/about",
    image: seoImage
  },
  "/assessment": {
    title: "Resonance Quotient Assessment | Earned Credibility",
    description:
      "Take the Resonance Quotient assessment to uncover where trust is leaking in your positioning, message, proof, and presence.",
    canonicalPath: "/assessment",
    image: seoImage
  },
  "/offers": {
    title: "Work With Magdalene | Earned Credibility Offers",
    description:
      "Explore strategic support for diagnosing credibility gaps, extracting your earned credibility, and repositioning your authority brand.",
    canonicalPath: "/offers",
    image: seoImage
  },
  "/offers/credibility-audit": {
    title: "Credibility Audit | Magdalene Wambui",
    description:
      "Find what is costing you trust and leave with a prioritized action plan for making your expertise easier to understand, trust, and choose.",
    canonicalPath: "/offers/credibility-audit",
    image: seoImage
  },
  "/offers/earned-credibility-intensive": {
    title: "Earned Credibility Intensive | Magdalene Wambui",
    description:
      "Uncover the experiences, proof, and perspective that make your authority difficult to copy, then shape them into a clearer positioning direction.",
    canonicalPath: "/offers/earned-credibility-intensive",
    image: seoImage
  },
  "/discern": {
    title: "DISCERN 90-Day Private Advisory | Magdalene Wambui",
    description:
      "A private advisory experience for established wellness practitioners ready to reposition their expertise, reputation, and authority ecosystem.",
    canonicalPath: "/discern",
    image: seoImage
  },
  "/code-of-resonance": {
    title: "The Code of Resonance | Magdalene Wambui",
    description:
      "Read essays, guides, stories, and case studies on trust, resonance, credibility, and becoming the trusted choice.",
    canonicalPath: "/code-of-resonance",
    image: seoImage
  },
  "/code-of-resonance/essays": {
    title: "Code of Resonance Essays | Magdalene Wambui",
    description:
      "Explore essays on trust, authority, personal brand resonance, and the signals that make experts easier to remember and choose.",
    canonicalPath: "/code-of-resonance/essays",
    image: seoImage
  },
  "/code-of-resonance/trust-resonance": {
    title: "Trust and Resonance | The Code of Resonance",
    description:
      "Explore notes on how trust is built through clarity, proof, lived experience, and strategic authority signals.",
    canonicalPath: "/code-of-resonance/trust-resonance",
    image: seoImage
  },
  "/code-of-resonance/recommended-reading": {
    title: "Recommended Reading | The Code of Resonance",
    description:
      "A curated reading space for leaders, practitioners, and experts building trust, credibility, and resonance.",
    canonicalPath: "/code-of-resonance/recommended-reading",
    image: seoImage
  },
  "/code-of-resonance/case-studies": {
    title: "Case Studies | The Code of Resonance",
    description:
      "Study how credibility, positioning, proof, and message clarity shape the way audiences trust and choose experts.",
    canonicalPath: "/code-of-resonance/case-studies",
    image: seoImage
  },
  "/code-of-resonance/guides": {
    title: "Credibility Guides | The Code of Resonance",
    description:
      "Practical guides for strengthening your authority, tightening your message, and becoming easier to trust.",
    canonicalPath: "/code-of-resonance/guides",
    image: seoImage
  },
  "/code-of-resonance/stories": {
    title: "Stories | The Code of Resonance",
    description:
      "Stories and reflections on earned credibility, lived experience, and the moments that shape trusted authority.",
    canonicalPath: "/code-of-resonance/stories",
    image: seoImage
  },
  "/contact": {
    title: "Contact Magdalene Wambui | Earned Credibility",
    description:
      "Contact Magdalene Wambui about Earned Credibility, DISCERN, credibility audits, private advisory, or speaking opportunities.",
    canonicalPath: "/contact",
    image: seoImage
  },
  "/privacy": {
    title: "Privacy Policy | Earned Credibility",
    description: "Privacy policy for the Earned Credibility Trust Hub.",
    canonicalPath: "/privacy",
    image: seoImage
  },
  "/terms": {
    title: "Terms | Earned Credibility",
    description: "Terms for using the Earned Credibility Trust Hub.",
    canonicalPath: "/terms",
    image: seoImage
  },
  "/assessment-disclaimer": {
    title: "Assessment Disclaimer | Earned Credibility",
    description: "Disclaimer for the Resonance Quotient assessment and related guidance.",
    canonicalPath: "/assessment-disclaimer",
    image: seoImage
  },
  "/refund-policy": {
    title: "Refund Policy | Earned Credibility",
    description: "Refund policy for Earned Credibility offers and services.",
    canonicalPath: "/refund-policy",
    image: seoImage
  }
};

function getSeoForPath(pathname) {
  if (pathname.startsWith("/results/")) {
    return {
      title: "Assessment Results | Earned Credibility",
      description: "Private Resonance Quotient assessment results.",
      canonicalPath: pathname,
      image: seoImage,
      noindex: true
    };
  }

  if (pathname.startsWith("/application/") || pathname.startsWith("/booking/")) {
    return {
      title: "Client Application | Magdalene Wambui",
      description: "Private application and booking flow for Magdalene Wambui's services.",
      canonicalPath: pathname,
      image: seoImage,
      noindex: true
    };
  }

  if (pathname.startsWith("/resources/")) {
    return {
      title: "Earned Credibility Resource | Magdalene Wambui",
      description: "A tailored Earned Credibility resource connected to your assessment insights.",
      canonicalPath: pathname,
      image: seoImage,
      noindex: true
    };
  }

  if (pathname === "/testimonial-request") {
    return {
      title: "Testimonial Request | Magdalene Wambui",
      description: "Private testimonial submission page for Magdalene Wambui's clients.",
      canonicalPath: pathname,
      image: seoImage,
      noindex: true
    };
  }

  if (pathname.startsWith("/code-of-resonance/read/")) {
    return {
      title: "Read The Code of Resonance | Magdalene Wambui",
      description:
        "An article from The Code of Resonance on trust, credibility, authority, and becoming easier to choose.",
      canonicalPath: pathname,
      image: seoImage,
      type: "article"
    };
  }

  if (pathname === "/work-with-magdalene") {
    return seoByPath["/offers"];
  }

  return seoByPath[pathname] || defaultSeo;
}

export default function PublicLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const seo = getSeoForPath(location.pathname);

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="min-h-screen bg-mistWhite text-charcoal">
      <Seo {...seo} />
      <header className="sticky top-0 z-40 border-b border-mistWhite/10 bg-charcoal text-mistWhite shadow-[0_10px_24px_rgba(0,0,0,0.16)]">
        <div className="container-shell flex min-h-[68px] items-center justify-between gap-3 py-2">
          <BrandLogo onClick={closeMobile} />

          <nav className="hidden items-center gap-4 text-sm font-semibold text-mistWhite/76 xl:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative py-2 transition hover:text-mutedMint after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-mutedMint after:transition after:content-[''] hover:after:scale-x-100"
              >
                {item.label}
              </a>
            ))}
            <div className="group relative">
              <button
                type="button"
                className="inline-flex items-center gap-1 py-2 transition hover:text-mutedMint"
              >
                The Code of Resonance
                <ChevronDown size={14} aria-hidden="true" />
              </button>
              <div className="invisible absolute left-0 top-[calc(100%+18px)] w-72 translate-y-2 border border-mutedMint/20 bg-charcoal p-3 opacity-0 shadow-[0_18px_45px_rgba(0,0,0,0.28)] transition group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                {codeLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block border-b border-mutedMint/10 px-1 py-2.5 text-sm text-mistWhite/72 transition last:border-b-0 hover:text-mutedMint"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <SiteButton
              to="/assessment"
              variant="nav"
              className="hidden shrink-0 sm:inline-flex"
              onClick={closeMobile}
            >
              Start Assessment
              <ArrowRight size={15} aria-hidden="true" />
            </SiteButton>
            <button
              type="button"
              className="inline-grid size-11 place-items-center rounded-full border border-mutedMint/30 bg-charcoal text-mistWhite transition hover:border-mutedMint hover:text-mutedMint xl:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((isOpen) => !isOpen)}
            >
              {mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-sage bg-mistWhite text-charcoal shadow-[0_18px_34px_rgba(26,26,26,0.12)] xl:hidden">
            <div className="container-shell grid gap-4 py-5">
              <nav className="grid gap-1 text-base font-semibold text-charcoal" aria-label="Mobile navigation">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="border-b border-sage px-1 py-3 transition hover:text-deepEmerald"
                    onClick={closeMobile}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              <div className="border-t border-sage pt-4">
                <p className="pb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">
                  The Code of Resonance
                </p>
                <div className="grid gap-1">
                  {codeLinks.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="border-b border-sage py-2 text-sm font-medium text-charcoal/76 transition last:border-b-0 hover:text-deepEmerald"
                      onClick={closeMobile}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              <SiteButton
                to="/assessment"
                variant="blackGreen"
                className="sm:hidden"
                onClick={closeMobile}
              >
                Start Assessment
                <ArrowRight size={16} aria-hidden="true" />
              </SiteButton>
            </div>
          </div>
        )}
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-mistWhite/10 bg-charcoal text-mistWhite">
        <div className="container-shell py-12 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1.4fr]">
            <div>
              <BrandLogo variant="footer" />
              <p className="mt-4 max-w-md text-sm leading-7 text-mistWhite/70">
                Helping wellness practitioners transform lived experience into earned credibility
                and become the trusted choice.
              </p>
              <SiteButton
                to="/assessment"
                variant="darkPrimary"
                className="mt-6"
              >
                Discover my earned credibility
                <ArrowRight size={16} aria-hidden="true" />
              </SiteButton>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              {footerColumns.map((column) => (
                <div key={column.title}>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-mutedMint">
                    {column.title}
                  </h2>
                  <ul className="mt-4 space-y-3 text-sm text-mistWhite/70">
                    {column.links.map((item) => (
                      <li key={item.label}>
                        <a href={item.href} className="transition hover:text-mutedMint">
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-mistWhite/20 pt-6 text-sm text-mistWhite/60 md:flex-row md:items-center md:justify-between">
            <p>© 2026 Magdalene Wambui. All rights reserved.</p>
            <a href="mailto:hello@example.com" className="inline-flex items-center gap-2 transition hover:text-mutedMint">
              <Mail size={15} aria-hidden="true" />
              hello@magdalenewambui.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
