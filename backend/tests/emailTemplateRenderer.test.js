import { describe, expect, it } from "vitest";
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
});
