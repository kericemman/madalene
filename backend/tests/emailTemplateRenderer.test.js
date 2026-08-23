import { describe, expect, it } from "vitest";
import { env } from "../config/env.js";
import { renderTemplate } from "../services/emailTemplateRenderer.js";

describe("renderTemplate", () => {
  it("renders subject, html, and text variables", () => {
    const rendered = renderTemplate(
      {
        subject: "Hello {{ firstName }}",
        html: "<p>{{message}}</p>",
        text: "{{message}}"
      },
      {
        firstName: "Magdalene",
        message: "A clear next step"
      }
    );

    expect(rendered.subject).toBe("Hello Magdalene");
    expect(rendered.html).toBe("<p>A clear next step</p>");
    expect(rendered.text).toBe("A clear next step");
  });

  it("escapes html variables by default", () => {
    const rendered = renderTemplate(
      {
        subject: "Test",
        html: "<p>{{message}}</p>",
        text: "{{message}}"
      },
      {
        message: "<script>alert('x')</script>"
      }
    );

    expect(rendered.html).toContain("&lt;script&gt;");
    expect(rendered.text).toContain("<script>");
  });

  it("allows trusted triple-brace html blocks", () => {
    const rendered = renderTemplate(
      {
        subject: "Resource",
        html: "<article>{{{resourceBodyHtml}}}</article><p>{{message}}</p>",
        text: "{{message}}"
      },
      {
        resourceBodyHtml: "<h2>Part 1</h2>",
        message: "<strong>escaped</strong>"
      }
    );

    expect(rendered.html).toContain("<article><h2>Part 1</h2></article>");
    expect(rendered.html).toContain("&lt;strong&gt;escaped&lt;/strong&gt;");
  });

  it("uses the frontend URL for brand links and logo fallbacks", () => {
    const original = {
      appUrl: env.appUrl,
      frontendUrl: env.frontendUrl,
      emailLogoUrl: env.emailLogoUrl
    };

    env.appUrl = "https://api.magdalenewambui.com";
    env.frontendUrl = "https://magdalenewambui.com";
    env.emailLogoUrl = "";

    const rendered = renderTemplate({
      subject: "Logo",
      html: '<a href="{{brandHomeUrl}}"><img src="{{brandLogoUrl}}" /></a>',
      text: "{{brandHomeUrl}} {{brandLogoUrl}}"
    });

    env.appUrl = original.appUrl;
    env.frontendUrl = original.frontendUrl;
    env.emailLogoUrl = original.emailLogoUrl;

    expect(rendered.html).toContain('href="https://magdalenewambui.com"');
    expect(rendered.html).toContain('src="https://magdalenewambui.com/email/mw-lockup-transparent.png"');
    expect(rendered.html).not.toContain("https://api.magdalenewambui.com/email");
  });

  it("converts a relative email logo path into an absolute frontend URL", () => {
    const original = {
      frontendUrl: env.frontendUrl,
      emailLogoUrl: env.emailLogoUrl
    };

    env.frontendUrl = "https://magdalenewambui.com";
    env.emailLogoUrl = "/email/mw-lockup-dark-crop.png";

    const rendered = renderTemplate({
      subject: "Logo",
      html: '<img src="{{brandLogoUrl}}" />',
      text: "{{brandLogoUrl}}"
    });

    env.frontendUrl = original.frontendUrl;
    env.emailLogoUrl = original.emailLogoUrl;

    expect(rendered.html).toContain('src="https://magdalenewambui.com/email/mw-lockup-transparent.png"');
  });

  it("rewrites old localhost frontend links in saved email buttons", () => {
    const original = {
      frontendUrl: env.frontendUrl,
      apiUrl: env.apiUrl
    };

    env.frontendUrl = "https://magdalenewambui.com";
    env.apiUrl = "https://api.magdalenewambui.com/api";

    const rendered = renderTemplate({
      subject: "Button",
      html: '<a href="http://localhost:5173/discern">Explore DISCERN</a>',
      text: "Explore: http://localhost:5173/discern"
    });

    env.frontendUrl = original.frontendUrl;
    env.apiUrl = original.apiUrl;

    expect(rendered.html).toContain('href="https://magdalenewambui.com/discern"');
    expect(rendered.text).toContain("https://magdalenewambui.com/discern");
    expect(rendered.html).not.toContain("localhost");
    expect(rendered.text).not.toContain("localhost");
  });

  it("rewrites backend-hosted email assets to the frontend domain", () => {
    const original = {
      frontendUrl: env.frontendUrl,
      apiUrl: env.apiUrl
    };

    env.frontendUrl = "https://magdalenewambui.com";
    env.apiUrl = "https://api.magdalenewambui.com/api";

    const rendered = renderTemplate({
      subject: "Logo",
      html: '<img src="https://api.magdalenewambui.com/email/mw-lockup-dark-crop.png" />',
      text: "https://api.magdalenewambui.com/email/mw-lockup-dark-crop.png"
    });

    env.frontendUrl = original.frontendUrl;
    env.apiUrl = original.apiUrl;

    expect(rendered.html).toContain('src="https://magdalenewambui.com/email/mw-lockup-transparent.png"');
    expect(rendered.text).toContain("https://magdalenewambui.com/email/mw-lockup-transparent.png");
  });
});
