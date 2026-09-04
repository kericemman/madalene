import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist");
const indexPath = path.join(distDir, "index.html");
const siteUrl = (process.env.VITE_SITE_URL || process.env.VITE_APP_URL || "https://magdalenewambui.com").replace(
  /\/+$/,
  ""
);

const defaultImage =
  "https://res.cloudinary.com/fkaaucee/image/upload/c_limit,dpr_auto,f_auto,q_auto,w_1280/v1/earned-credibility/site/home/maggy-safron-gardens-00348?_a=BAMAPqM50";

const defaultRobots = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

const routes = [
  {
    path: "/",
    title: "Earned Credibility Trust Hub | Magdalene Wambui",
    description:
      "Discover your Resonance Quotient, position the credibility you have already earned, and become easier to trust, remember, and choose."
  },
  {
    path: "/about",
    title: "About Magdalene Wambui | Earned Credibility",
    description:
      "Meet Magdalene Wambui and learn how earned credibility, lived experience, and strategic positioning shape her work with wellness practitioners and experts."
  },
  {
    path: "/assessment",
    title: "Resonance Quotient Assessment | Earned Credibility",
    description:
      "Take the Resonance Quotient assessment to uncover where trust is leaking in your positioning, message, proof, and presence."
  },
  {
    path: "/offers",
    title: "Work With Magdalene | Earned Credibility Offers",
    description:
      "Explore strategic support for diagnosing credibility gaps, extracting your earned credibility, and repositioning your authority brand."
  },
  {
    path: "/work-with-magdalene",
    canonicalPath: "/offers",
    title: "Work With Magdalene | Earned Credibility Offers",
    description:
      "Explore strategic support for diagnosing credibility gaps, extracting your earned credibility, and repositioning your authority brand."
  },
  {
    path: "/offers/credibility-audit",
    title: "Credibility Audit | Magdalene Wambui",
    description:
      "Find what is costing you trust and leave with a prioritized action plan for making your expertise easier to understand, trust, and choose."
  },
  {
    path: "/offers/earned-credibility-intensive",
    title: "Earned Credibility Intensive | Magdalene Wambui",
    description:
      "Uncover the experiences, proof, and perspective that make your authority difficult to copy, then shape them into a clearer positioning direction."
  },
  {
    path: "/discern",
    title: "DISCERN 90-Day Private Advisory | Magdalene Wambui",
    description:
      "A private advisory experience for established wellness practitioners ready to reposition their expertise, reputation, and authority ecosystem."
  },
  {
    path: "/code-of-resonance",
    title: "The Code of Resonance | Magdalene Wambui",
    description:
      "Read essays, guides, stories, and case studies on trust, resonance, credibility, and becoming the trusted choice."
  },
  {
    path: "/code-of-resonance/essays",
    title: "Code of Resonance Essays | Magdalene Wambui",
    description:
      "Explore essays on trust, authority, personal brand resonance, and the signals that make experts easier to remember and choose."
  },
  {
    path: "/code-of-resonance/trust-resonance",
    title: "Trust and Resonance | The Code of Resonance",
    description:
      "Explore notes on how trust is built through clarity, proof, lived experience, and strategic authority signals."
  },
  {
    path: "/code-of-resonance/recommended-reading",
    title: "Recommended Reading | The Code of Resonance",
    description:
      "A curated reading space for leaders, practitioners, and experts building trust, credibility, and resonance."
  },
  {
    path: "/code-of-resonance/case-studies",
    title: "Case Studies | The Code of Resonance",
    description:
      "Study how credibility, positioning, proof, and message clarity shape the way audiences trust and choose experts."
  },
  {
    path: "/code-of-resonance/guides",
    title: "Credibility Guides | The Code of Resonance",
    description:
      "Practical guides for strengthening your authority, tightening your message, and becoming easier to trust."
  },
  {
    path: "/code-of-resonance/stories",
    title: "Stories | The Code of Resonance",
    description:
      "Stories and reflections on earned credibility, lived experience, and the moments that shape trusted authority."
  },
  {
    path: "/code-of-resonance/subscribe",
    title: "Subscribe to The Code of Resonance | Magdalene Wambui",
    description:
      "Join Magdalene Wambui's email publication for notes on credibility, positioning, trust, and becoming easier to choose."
  },
  {
    path: "/contact",
    title: "Contact Magdalene Wambui | Earned Credibility",
    description:
      "Contact Magdalene Wambui about Earned Credibility, DISCERN, credibility audits, private advisory, or speaking opportunities."
  },
  {
    path: "/privacy",
    title: "Privacy Policy | Earned Credibility",
    description: "Privacy policy for the Earned Credibility Trust Hub."
  },
  {
    path: "/terms",
    title: "Terms | Earned Credibility",
    description: "Terms for using the Earned Credibility Trust Hub."
  },
  {
    path: "/assessment-disclaimer",
    title: "Assessment Disclaimer | Earned Credibility",
    description: "Disclaimer for the Resonance Quotient assessment and related guidance."
  },
  {
    path: "/refund-policy",
    title: "Refund Policy | Earned Credibility",
    description: "Refund policy for Earned Credibility offers and services."
  },
  {
    path: "/testimonial-request",
    title: "Testimonial Request | Magdalene Wambui",
    description: "Private testimonial submission page for Magdalene Wambui's clients.",
    noindex: true
  }
];

function escapeAttribute(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function replaceOrInsertMeta(html, attributeName, attributeValue, tag) {
  const pattern = new RegExp(`<meta\\s+[^>]*${attributeName}=["']${attributeValue}["'][^>]*>`, "i");

  if (pattern.test(html)) {
    return html.replace(pattern, tag);
  }

  return html.replace("</head>", `    ${tag}\n  </head>`);
}

function replaceOrInsertLink(html, rel, tag) {
  const pattern = new RegExp(`<link\\s+[^>]*rel=["']${rel}["'][^>]*>`, "i");

  if (pattern.test(html)) {
    return html.replace(pattern, tag);
  }

  return html.replace("</head>", `    ${tag}\n  </head>`);
}

function withRouteMeta(sourceHtml, route) {
  const canonicalUrl = `${siteUrl}${route.canonicalPath || route.path}`;
  const imageUrl = route.image || defaultImage;
  const robots = route.noindex ? "noindex, nofollow" : defaultRobots;
  const title = escapeAttribute(route.title);
  const description = escapeAttribute(route.description);
  const image = escapeAttribute(imageUrl);
  const canonical = escapeAttribute(canonicalUrl);

  let html = sourceHtml.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);

  html = replaceOrInsertMeta(html, "name", "robots", `<meta name="robots" content="${escapeAttribute(robots)}" />`);
  html = replaceOrInsertMeta(html, "name", "description", `<meta name="description" content="${description}" />`);
  html = replaceOrInsertLink(html, "canonical", `<link rel="canonical" href="${canonical}" />`);
  html = replaceOrInsertMeta(html, "property", "og:type", `<meta property="og:type" content="${route.type || "website"}" />`);
  html = replaceOrInsertMeta(html, "property", "og:title", `<meta property="og:title" content="${title}" />`);
  html = replaceOrInsertMeta(
    html,
    "property",
    "og:description",
    `<meta property="og:description" content="${description}" />`
  );
  html = replaceOrInsertMeta(html, "property", "og:url", `<meta property="og:url" content="${canonical}" />`);
  html = replaceOrInsertMeta(html, "property", "og:image", `<meta property="og:image" content="${image}" />`);
  html = replaceOrInsertMeta(html, "name", "twitter:title", `<meta name="twitter:title" content="${title}" />`);
  html = replaceOrInsertMeta(
    html,
    "name",
    "twitter:description",
    `<meta name="twitter:description" content="${description}" />`
  );
  html = replaceOrInsertMeta(html, "name", "twitter:image", `<meta name="twitter:image" content="${image}" />`);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: route.title,
      description: route.description,
      url: canonicalUrl,
      image: imageUrl
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Magdalene Wambui",
      url: `${siteUrl}/`,
      image: imageUrl,
      jobTitle: "Earned Credibility strategist",
      description:
        "Magdalene Wambui helps wellness practitioners and experts position the credibility they have already earned so they become easier to trust, remember, and choose."
    }
  ];

  html = html.replace(
    /<script\s+id=["']page-jsonld["']\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/i,
    `<script id="page-jsonld" type="application/ld+json">\n      ${JSON.stringify(jsonLd, null, 2)}\n    </script>`
  );

  return html;
}

const sourceHtml = await readFile(indexPath, "utf8");

await Promise.all(
  routes.map(async (route) => {
    const routeDir = path.join(distDir, route.path.replace(/^\/+/, ""));
    await mkdir(routeDir, { recursive: true });
    await writeFile(path.join(routeDir, "index.html"), withRouteMeta(sourceHtml, route));
  })
);

console.log(`Generated crawlable HTML for ${routes.map((route) => route.path).join(", ")}`);
