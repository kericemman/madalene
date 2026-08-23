import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const DEFAULT_SITE_NAME = "Earned Credibility Trust Hub";
const DEFAULT_TITLE = "Earned Credibility Trust Hub | Magdalene Wambui";
const DEFAULT_DESCRIPTION =
  "Discover your Resonance Quotient, position the credibility you have already earned, and become easier to trust, remember, and choose.";
const DEFAULT_ROBOTS = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

function cleanBaseUrl(value) {
  return (value || "").replace(/\/+$/, "");
}

function getSiteUrl() {
  if (typeof window === "undefined") {
    return cleanBaseUrl(import.meta.env.VITE_SITE_URL || import.meta.env.VITE_APP_URL);
  }

  return cleanBaseUrl(import.meta.env.VITE_SITE_URL || import.meta.env.VITE_APP_URL || window.location.origin);
}

function toAbsoluteUrl(value, siteUrl) {
  if (!value) return "";

  try {
    return new URL(value, `${siteUrl}/`).toString();
  } catch {
    return value;
  }
}

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      element.setAttribute(key, value);
    }
  });
}

function upsertLink(selector, attributes) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      element.setAttribute(key, value);
    }
  });
}

function upsertJsonLd(data) {
  const id = "page-jsonld";
  let element = document.getElementById(id);

  if (!element) {
    element = document.createElement("script");
    element.id = id;
    element.type = "application/ld+json";
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify(data);
}

export default function Seo({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonicalPath,
  image,
  type = "website",
  noindex = false,
  jsonLd = []
}) {
  const location = useLocation();

  useEffect(() => {
    const siteUrl = getSiteUrl();
    const canonicalUrl = toAbsoluteUrl(canonicalPath || location.pathname, siteUrl);
    const imageUrl = toAbsoluteUrl(image || "/email/mw-lockup-dark-crop.png", siteUrl);
    const robots = noindex ? "noindex, nofollow" : DEFAULT_ROBOTS;

    document.title = title;

    upsertMeta('meta[name="description"]', { name: "description", content: description });
    upsertMeta('meta[name="robots"]', { name: "robots", content: robots });
    upsertMeta('meta[name="author"]', { name: "author", content: "Magdalene Wambui" });

    upsertLink('link[rel="canonical"]', { rel: "canonical", href: canonicalUrl });

    upsertMeta('meta[property="og:type"]', { property: "og:type", content: type });
    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: DEFAULT_SITE_NAME });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: title });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: description });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
    upsertMeta('meta[property="og:image"]', { property: "og:image", content: imageUrl });

    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: imageUrl });

    upsertJsonLd([
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: DEFAULT_SITE_NAME,
        url: `${siteUrl}/`
      },
      {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Magdalene Wambui",
        url: `${siteUrl}/`,
        jobTitle: "Earned Credibility strategist",
        description:
          "Magdalene Wambui helps wellness practitioners and experts position the credibility they have already earned so they become easier to trust, remember, and choose."
      },
      ...jsonLd
    ]);
  }, [canonicalPath, description, image, jsonLd, location.pathname, noindex, title, type]);

  return null;
}
