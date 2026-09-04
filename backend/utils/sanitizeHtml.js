import sanitizeHtml from "sanitize-html";

const allowedIframeHosts = new Set(["www.youtube.com", "www.youtube-nocookie.com", "player.vimeo.com"]);

const isSafeIframeSrc = (src = "") => {
  try {
    const url = new URL(src);
    return url.protocol === "https:" && allowedIframeHosts.has(url.hostname);
  } catch {
    return false;
  }
};

export const sanitizeRichHtml = (html = "") =>
  sanitizeHtml(String(html || ""), {
    allowedTags: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "blockquote",
      "h2",
      "h3",
      "h4",
      "ul",
      "ol",
      "li",
      "a",
      "img",
      "figure",
      "figcaption",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "hr",
      "iframe"
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "srcset", "sizes", "alt", "title", "width", "height", "loading"],
      iframe: ["src", "title", "allow", "allowfullscreen", "loading", "referrerpolicy"],
      h2: ["id"],
      h3: ["id"],
      h4: ["id"],
      th: ["colspan", "rowspan"],
      td: ["colspan", "rowspan"]
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: {
      img: ["http", "https"]
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        target: "_blank",
        rel: "noopener noreferrer"
      })
    },
    exclusiveFilter(frame) {
      return frame.tag === "iframe" && !isSafeIframeSrc(frame.attribs?.src);
    },
    disallowedTagsMode: "discard"
  });
