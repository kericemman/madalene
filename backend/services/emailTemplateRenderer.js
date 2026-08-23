import { env } from "../config/env.js";

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const trimTrailingSlash = (value) => String(value || "").replace(/\/+$/, "");
const localFrontendUrlPattern = /https?:\/\/(?:localhost|127\.0\.0\.1):(?:5173|5174|5175|5176|5177|5178|5179)/g;
const localBackendUrlPattern = /https?:\/\/(?:localhost|127\.0\.0\.1):(?:5000|5050|5051|5060)/g;

const escapeRegExp = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const apiOriginFromUrl = (value, fallback) => {
  const cleanValue = trimTrailingSlash(value || "");
  if (!cleanValue) return fallback;

  return cleanValue.replace(/\/api$/i, "");
};

const toPublicUrl = (value, baseUrl) => {
  const trimmedValue = String(value || "").trim();
  if (!trimmedValue) return "";
  if (/^https?:\/\//i.test(trimmedValue)) return trimmedValue;

  return `${baseUrl}${trimmedValue.startsWith("/") ? "" : "/"}${trimmedValue}`;
};

const brandVariables = () => {
  const frontendUrl = trimTrailingSlash(env.frontendUrl || env.appUrl || "http://localhost:5173");
  const logoUrl = toPublicUrl(env.emailLogoUrl, frontendUrl) || `${frontendUrl}/email/mw-lockup-dark-crop.png`;

  return {
    brandHomeUrl: frontendUrl,
    brandLogoUrl: logoUrl,
    currentYear: new Date().getFullYear()
  };
};

const normalizeRenderedUrls = (content = "") => {
  const frontendUrl = trimTrailingSlash(env.frontendUrl || env.appUrl || "http://localhost:5173");
  const apiOrigin = apiOriginFromUrl(env.apiUrl, "https://api.magdalenewambui.com");
  const apiEmailPattern = new RegExp(`${escapeRegExp(apiOrigin)}/email/`, "g");

  return String(content)
    .replace(localFrontendUrlPattern, frontendUrl)
    .replace(localBackendUrlPattern, apiOrigin)
    .replace(apiEmailPattern, `${frontendUrl}/email/`);
};

export const renderTemplate = (template, variables = {}) => {
  const templateVariables = { ...brandVariables(), ...variables };
  const replaceRaw = (content = "") =>
    content.replace(/\{\{\{\s*([\w.]+)\s*\}\}\}/g, (_, key) => {
      const value = key.split(".").reduce((current, part) => current?.[part], templateVariables);
      return String(value ?? "");
    });

  const replace = (content = "", escape = true) =>
    replaceRaw(content).replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key) => {
      const value = key.split(".").reduce((current, part) => current?.[part], templateVariables);
      return escape ? escapeHtml(value) : String(value ?? "");
    });

  return {
    subject: replace(template.subject),
    html: normalizeRenderedUrls(replace(template.html)),
    text: normalizeRenderedUrls(replace(template.text || "", false))
  };
};
