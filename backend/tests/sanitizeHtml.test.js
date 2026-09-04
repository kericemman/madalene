import { describe, expect, it } from "vitest";
import { sanitizeRichHtml } from "../utils/sanitizeHtml.js";

describe("sanitizeRichHtml", () => {
  it("strips scripts, event handlers, unsafe links, and unsafe iframes", () => {
    const html = sanitizeRichHtml(`
      <h2 onclick="alert('x')">Credibility</h2>
      <script>alert('bad')</script>
      <p><a href="javascript:alert('x')" onclick="alert('x')">Unsafe link</a></p>
      <iframe src="http://evil.example/embed"></iframe>
    `);

    expect(html).toContain("<h2>Credibility</h2>");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("onclick");
    expect(html).not.toContain("javascript:");
    expect(html).not.toContain("<iframe");
  });

  it("keeps editor-safe links and trusted video embeds", () => {
    const html = sanitizeRichHtml(`
      <p><a href="https://magdalenewambui.com/code-of-resonance">Read more</a></p>
      <iframe src="https://www.youtube.com/embed/example" title="Video"></iframe>
    `);

    expect(html).toContain('href="https://magdalenewambui.com/code-of-resonance"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('src="https://www.youtube.com/embed/example"');
  });
});
