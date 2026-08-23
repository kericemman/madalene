import { env } from "../config/env.js";

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const trimTrailingSlash = (value) => String(value || "").replace(/\/+$/, "");

const brandVariables = () => {
  const appUrl = trimTrailingSlash(env.appUrl || env.frontendUrl || "http://localhost:5173");

  return {
    brandHomeUrl: appUrl,
    brandLogoUrl: env.emailLogoUrl || `${appUrl}/email/mw-lockup-dark-crop.png`,
    currentYear: new Date().getFullYear()
  };
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
    html: replace(template.html),
    text: replace(template.text || "", false)
  };
};
