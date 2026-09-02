import { useEffect, useMemo, useState } from "react";
import { Mark, Node, mergeAttributes } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlertCircle,
  Bold,
  CheckCircle2,
  Clock,
  Eye,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Mail,
  Quote,
  Redo2,
  Save,
  Send,
  Sparkles,
  Undo2,
  Users,
  X
} from "lucide-react";
import { getCodeAutomation, updateCodeAutomationTemplate } from "../../services/api.js";

const emailColors = {
  deepEmerald: "#0F4D3E",
  mistWhite: "#F7F8F6",
  charcoal: "#1A1A1A",
  sage: "#B8D8C5",
  mutedMint: "#B8D8C5",
  white: "#FFFFFF"
};

const defaultCta = {
  label: "Explore DISCERN",
  href: "{{brandHomeUrl}}/discern"
};

const defaultBodyHtml = `
  <p>Hello {{firstName}},</p>
  <p>Write the lesson, reflection, or trust-building prompt for this day.</p>
  <p>Warmly,<br />Magdalene Wambui</p>
`;

const emptyTemplate = {
  subject: "",
  preheader: "",
  title: "",
  bodyHtml: defaultBodyHtml,
  ctaLabel: defaultCta.label,
  ctaHref: defaultCta.href,
  active: true
};

const LinkMark = Mark.create({
  name: "link",
  inclusive: false,
  addAttributes() {
    return {
      href: { default: null },
      target: { default: "_blank" },
      rel: { default: "noopener noreferrer" }
    };
  },
  parseHTML() {
    return [{ tag: "a[href]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "a",
      mergeAttributes(HTMLAttributes, {
        target: "_blank",
        rel: "noopener noreferrer"
      }),
      0
    ];
  }
});

const EmailImage = Node.create({
  name: "emailImage",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: null },
      alt: { default: "" }
    };
  },
  parseHTML() {
    return [{ tag: "img[src]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "img",
      mergeAttributes(
        {
          style:
            "display:block;width:100%;max-width:520px;height:auto;margin:22px auto;border:1px solid #B8D8C5;border-radius:8px;"
        },
        HTMLAttributes
      )
    ];
  }
});

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const statusCount = (items = [], status) => items.find((item) => item._id === status)?.count || 0;

const delayLabelFor = (step = {}) => {
  if (step.isUniversal) return "manual / not automated";
  if (Number(step.delayDays || 0) > 0) {
    return `after ${step.delayDays} day${step.delayDays === 1 ? "" : "s"}`;
  }
  if (Number(step.delayHours || 0) > 0) {
    return `after ${step.delayHours} hour${step.delayHours === 1 ? "" : "s"}`;
  }
  if (Number(step.delayMinutes || 0) > 0) {
    return `after ${step.delayMinutes} minute${step.delayMinutes === 1 ? "" : "s"}`;
  }
  return "today";
};

const labelForStep = (step = {}) => {
  if (step.isUniversal) return "Universal email";
  return step.order ? `Day ${step.order}` : "Code of Resonance email";
};

const removeEmailCtaFrom = (wrapper) => {
  const ctaLink = Array.from(wrapper.querySelectorAll("a[href]")).find(
    (link) => link.textContent.trim() && !link.querySelector("img")
  );

  if (!ctaLink) return { ctaLabel: defaultCta.label, ctaHref: defaultCta.href };

  let removable = ctaLink;
  while (removable.parentElement && removable.parentElement !== wrapper) {
    removable = removable.parentElement;
  }
  removable.remove();

  const ctaLabel = ctaLink.textContent.trim() || defaultCta.label;
  const ctaHref = ctaLink.getAttribute("href") || defaultCta.href;

  if (/read\s+the\s+code/i.test(ctaLabel) || /code-of-resonance\/?$/.test(ctaHref)) {
    return defaultCta;
  }

  return { ctaLabel, ctaHref };
};

const extractMarkedBody = (html = "") => {
  const match = String(html).match(/<!--\s*EC_EMAIL_BODY_START\s*-->([\s\S]*?)<!--\s*EC_EMAIL_BODY_END\s*-->/i);
  return match?.[1]?.trim();
};

const extractEmailParts = (template = {}, order, label) => {
  if (typeof DOMParser === "undefined") {
    return {
      ...emptyTemplate,
      subject: template.subject || "",
      preheader: template.preheader || "",
      title: template.name || label || `Code of Resonance Day ${order || ""}`,
      bodyHtml: extractMarkedBody(template.html) || template.html || defaultBodyHtml,
      active: template.active !== false
    };
  }

  const parser = new DOMParser();
  const document = parser.parseFromString(template.html || "", "text/html");
  const h1 = document.querySelector("h1");
  const markedBody = extractMarkedBody(template.html);
  let bodyHtml = markedBody;
  let ctaLabel = defaultCta.label;
  let ctaHref = defaultCta.href;

  if (markedBody) {
    const markedWrapper = document.createElement("div");
    markedWrapper.innerHTML = markedBody;
    const cta = removeEmailCtaFrom(markedWrapper);
    ctaLabel = cta.ctaLabel;
    ctaHref = cta.ctaHref;
    bodyHtml = markedWrapper.innerHTML.trim();
  } else if (h1?.parentElement) {
    const wrapper = document.createElement("div");
    let node = h1.nextSibling;
    while (node) {
      wrapper.appendChild(node.cloneNode(true));
      node = node.nextSibling;
    }
    const cta = removeEmailCtaFrom(wrapper);
    ctaLabel = cta.ctaLabel;
    ctaHref = cta.ctaHref;
    bodyHtml = wrapper.innerHTML.trim();
  }

  return {
    subject: template.subject || "",
    preheader: template.preheader || "",
    title: h1?.textContent?.trim() || template.name || label || `Code of Resonance Day ${order || ""}`,
    bodyHtml: bodyHtml || defaultBodyHtml,
    ctaLabel,
    ctaHref,
    active: template.active !== false
  };
};

const buildEmailHtml = ({ order, label, preheader, title, bodyHtml, ctaHref, ctaLabel }) => {
  const fallbackTitle = label || (order ? `Code of Resonance Day ${order}` : "The Code of Resonance");
  const safeTitle = escapeHtml(title || fallbackTitle);
  const safePreheader = escapeHtml(preheader || "");
  const nextStepHref = String(ctaHref || "").trim();
  const safeCtaLabel = escapeHtml(ctaLabel || defaultCta.label);
  const safeCtaHref = escapeHtml(nextStepHref);
  const eyebrow = escapeHtml(label || (order ? `The Code of Resonance - Day ${order}` : "The Code of Resonance"));

  return `<!doctype html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeTitle}</title>
    <style>
      .email-content p { margin: 0 0 18px; color: ${emailColors.charcoal}; font-size: 16px; line-height: 1.65; }
      .email-content h2 { margin: 28px 0 14px; color: ${emailColors.charcoal}; font-size: 24px; line-height: 1.2; }
      .email-content h3 { margin: 24px 0 12px; color: ${emailColors.charcoal}; font-size: 20px; line-height: 1.3; }
      .email-content ul, .email-content ol { margin: 0 0 20px; padding-left: 22px; color: ${emailColors.charcoal}; font-size: 16px; line-height: 1.65; }
      .email-content li { margin: 0 0 8px; }
      .email-content blockquote { margin: 24px 0; padding: 18px 20px; border-left: 4px solid ${emailColors.deepEmerald}; background: ${emailColors.mistWhite}; color: ${emailColors.charcoal}; }
      .email-content a { color: ${emailColors.deepEmerald}; font-weight: 700; }
      .email-content img { display: block; width: 100%; max-width: 520px; height: auto; margin: 22px auto; border: 1px solid ${emailColors.sage}; border-radius: 8px; }
      @media screen and (max-width: 520px) {
        .email-card { border-radius: 0 !important; }
        .email-pad { padding: 28px 20px !important; }
        .email-title { font-size: 26px !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:${emailColors.mistWhite};font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;line-height:1px;">
      ${safePreheader}
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:${emailColors.mistWhite};">
      <tr>
        <td align="center" style="padding:32px 14px;">
          <table class="email-card" role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:660px;border-collapse:separate;border-spacing:0;">
            <tr>
              <td style="padding:24px 28px;background:${emailColors.charcoal};border-radius:14px 14px 0 0;border-bottom:4px solid ${emailColors.deepEmerald};">
                <a href="{{brandHomeUrl}}" style="display:inline-block;text-decoration:none;">
                  <img src="{{brandLogoUrl}}" width="285" alt="Magdalene Wambui - Become The Trusted Choice" style="display:block;width:285px;max-width:100%;height:auto;border:0;outline:none;text-decoration:none;" />
                </a>
              </td>
            </tr>
            <tr>
              <td class="email-pad" style="padding:38px 34px 34px;background:${emailColors.white};border-right:1px solid ${emailColors.sage};border-left:1px solid ${emailColors.sage};">
                <p style="margin:0 0 12px;color:${emailColors.deepEmerald};font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;">${eyebrow}</p>
                <h1 class="email-title" style="margin:0 0 18px;color:${emailColors.charcoal};font-size:30px;line-height:1.12;font-weight:800;letter-spacing:0;">
                  ${safeTitle}
                </h1>
                <div class="email-content">
                  <!-- EC_EMAIL_BODY_START -->
                  ${bodyHtml || defaultBodyHtml}
                  <!-- EC_EMAIL_BODY_END -->
                </div>
                ${
                  nextStepHref
                    ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:28px 0 6px;">
                  <tr>
                    <td style="border-radius:4px;background:${emailColors.deepEmerald};">
                      <a href="${safeCtaHref}" style="display:inline-block;padding:14px 22px;color:${emailColors.white};font-size:14px;font-weight:700;line-height:1;text-decoration:none;text-transform:uppercase;letter-spacing:.04em;">
                        ${safeCtaLabel}
                      </a>
                    </td>
                  </tr>
                </table>`
                    : ""
                }
              </td>
            </tr>
            <tr>
              <td style="padding:22px 28px;background:${emailColors.charcoal};border-radius:0 0 14px 14px;">
                <p style="margin:0 0 10px;color:${emailColors.mistWhite};font-size:13px;line-height:1.6;">
                  You are receiving this because you subscribed to The Code of Resonance.
                </p>
                <p style="margin:0;color:${emailColors.mutedMint};font-size:12px;line-height:1.5;">
                  &copy; {{currentYear}} Magdalene Wambui. Become The Trusted Choice.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

const toPlainText = ({ title, bodyHtml, ctaHref, ctaLabel }) => {
  if (typeof document === "undefined") {
    return `${title}\n\n${String(bodyHtml || "").replace(/<[^>]+>/g, " ")}${ctaHref ? `\n\n${ctaLabel}: ${ctaHref}` : ""}`;
  }

  const wrapper = document.createElement("div");
  wrapper.innerHTML = bodyHtml || "";
  wrapper.querySelectorAll("br").forEach((breakNode) => breakNode.replaceWith("\n"));
  wrapper.querySelectorAll("p,h1,h2,h3,li,blockquote").forEach((node) => {
    node.append(document.createTextNode("\n\n"));
  });

  return [
    title,
    wrapper.textContent,
    ctaHref ? `${ctaLabel || defaultCta.label}: ${ctaHref}` : ""
  ]
    .filter(Boolean)
    .join("\n\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

function StatTile({ label, value, icon: Icon }) {
  return (
    <article className="rounded border border-sage bg-mistWhite p-4 shadow-[0_12px_26px_rgba(26,26,26,0.035)]">
      <Icon className="text-deepEmerald" size={20} aria-hidden="true" />
      <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-charcoal/55">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-charcoal">{value}</p>
    </article>
  );
}

function StepCard({ step, active, onClick }) {
  const template = step.template || {};
  const stepLabel = labelForStep(step);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded border p-4 text-left transition ${
        active
          ? "border-deepEmerald bg-mutedMint/60 shadow-[0_14px_30px_rgba(15,77,62,0.08)]"
          : "border-sage bg-mistWhite hover:border-deepEmerald/35 hover:bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">{stepLabel}</p>
          <h3 className="mt-2 font-serif text-2xl leading-tight text-charcoal">{template.name || "Untitled email"}</h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${template.active ? "bg-mutedMint text-deepEmerald" : "bg-sage text-charcoal/60"}`}>
          {template.active ? "Active" : "Paused"}
        </span>
      </div>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-charcoal/66">{template.subject || "No subject yet"}</p>
      <p className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-charcoal/50">
        <Clock size={14} aria-hidden="true" />
        {step.isUniversal ? "Use manually when needed" : `Sends ${delayLabelFor(step)}`}
      </p>
    </button>
  );
}

function IconButton({ active = false, label, onClick, children }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`inline-grid size-9 place-items-center rounded border text-sm transition ${
        active
          ? "border-deepEmerald bg-deepEmerald text-mistWhite"
          : "border-sage bg-mistWhite text-charcoal hover:border-deepEmerald hover:text-deepEmerald"
      }`}
    >
      {children}
    </button>
  );
}

function VariableChip({ value, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className="rounded-full border border-sage bg-white px-3 py-1 text-xs font-bold text-charcoal transition hover:border-deepEmerald hover:text-deepEmerald"
    >
      {`{{${value}}}`}
    </button>
  );
}

function EmailBodyEditor({ value, onChange, variables = [] }) {
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [activeTool, setActiveTool] = useState(null);

  const editor = useEditor({
    extensions: [StarterKit, LinkMark, EmailImage],
    content: value || "<p></p>",
    editorProps: {
      attributes: {
        class: "tiptap-editor-body min-h-[360px] px-4 py-4 focus:outline-none"
      }
    },
    onUpdate({ editor: activeEditor }) {
      onChange(activeEditor.getHTML());
    }
  });

  useEffect(() => {
    if (!editor) return;
    const nextContent = value || "<p></p>";
    if (nextContent !== editor.getHTML()) {
      editor.commands.setContent(nextContent, false);
    }
  }, [editor, value]);

  if (!editor) {
    return <div className="min-h-[360px] rounded border border-sage bg-sage/30" />;
  }

  const insertLink = () => {
    const href = linkUrl.trim();
    if (!href) return;
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, " ").trim();
    editor
      .chain()
      .focus()
      .insertContent(`<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(selectedText || href)}</a>`)
      .run();
    setLinkUrl("");
    setActiveTool(null);
  };

  const insertImage = () => {
    const src = imageUrl.trim();
    if (!src) return;
    editor.chain().focus().insertContent({ type: "emailImage", attrs: { src, alt: "" } }).run();
    setImageUrl("");
    setActiveTool(null);
  };

  const insertVariable = (variable) => {
    editor.chain().focus().insertContent(`{{${variable}}}`).run();
  };

  return (
    <div className="overflow-hidden rounded border border-sage bg-mistWhite">
      <div className="flex flex-wrap gap-2 border-b border-sage bg-sage/35 p-2">
        <IconButton label="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 size={16} aria-hidden="true" />
        </IconButton>
        <IconButton label="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 size={16} aria-hidden="true" />
        </IconButton>
        <IconButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={16} aria-hidden="true" />
        </IconButton>
        <IconButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={16} aria-hidden="true" />
        </IconButton>
        <IconButton label="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={16} aria-hidden="true" />
        </IconButton>
        <IconButton label="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={16} aria-hidden="true" />
        </IconButton>
        <IconButton label="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote size={16} aria-hidden="true" />
        </IconButton>
        <IconButton label="Add link" active={activeTool === "link"} onClick={() => setActiveTool((tool) => (tool === "link" ? null : "link"))}>
          <Link2 size={16} aria-hidden="true" />
        </IconButton>
        <IconButton label="Add image" active={activeTool === "image"} onClick={() => setActiveTool((tool) => (tool === "image" ? null : "image"))}>
          <ImageIcon size={16} aria-hidden="true" />
        </IconButton>
        <IconButton label="Undo" onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 size={16} aria-hidden="true" />
        </IconButton>
        <IconButton label="Redo" onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 size={16} aria-hidden="true" />
        </IconButton>
      </div>

      {(activeTool === "link" || activeTool === "image") && (
        <div className="flex gap-2 border-b border-sage bg-mistWhite p-2">
          <input
            className="input min-w-0 bg-white"
            value={activeTool === "link" ? linkUrl : imageUrl}
            onChange={(event) => (activeTool === "link" ? setLinkUrl(event.target.value) : setImageUrl(event.target.value))}
            placeholder={activeTool === "link" ? "Paste link URL" : "Paste hosted image URL"}
          />
          <button
            type="button"
            onClick={activeTool === "link" ? insertLink : insertImage}
            className="inline-grid size-12 shrink-0 place-items-center rounded border border-deepEmerald bg-deepEmerald text-mistWhite transition hover:bg-charcoal"
            aria-label={activeTool === "link" ? "Insert link" : "Insert image"}
          >
            {activeTool === "link" ? <Link2 size={17} aria-hidden="true" /> : <ImageIcon size={17} aria-hidden="true" />}
          </button>
        </div>
      )}

      {variables.length > 0 && (
        <div className="border-b border-sage bg-white p-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-extrabold uppercase tracking-[0.14em] text-charcoal/48">Variables</span>
            {variables.map((variable) => (
              <VariableChip key={variable} value={variable} onClick={insertVariable} />
            ))}
          </div>
        </div>
      )}

      <EditorContent editor={editor} className="tiptap-editor max-h-[46vh] overflow-y-auto bg-white sm:max-h-[420px]" />
    </div>
  );
}

function EmailPreview({ html }) {
  return (
    <div className="rounded border border-sage bg-white p-3">
      <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-charcoal">
        <Eye size={16} aria-hidden="true" />
        Email preview
      </div>
      <iframe
        title="Email preview"
        srcDoc={html}
        className="h-[540px] w-full rounded border border-sage bg-mistWhite"
        sandbox=""
      />
    </div>
  );
}

export default function AdminCodeAutomationPage() {
  const [sequence, setSequence] = useState(null);
  const [universalTemplate, setUniversalTemplate] = useState(null);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [scheduledByStatus, setScheduledByStatus] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [form, setForm] = useState(emptyTemplate);
  const [status, setStatus] = useState("loading");
  const [saveStatus, setSaveStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const steps = useMemo(
    () => (sequence?.steps || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0)),
    [sequence]
  );

  const automationItems = useMemo(() => {
    const items = [...steps];
    if (universalTemplate) {
      items.push({
        _id: `universal-${universalTemplate._id}`,
        order: null,
        delayDays: 0,
        delayHours: 0,
        delayMinutes: 0,
        active: universalTemplate.active !== false,
        isUniversal: true,
        template: universalTemplate
      });
    }
    return items;
  }, [steps, universalTemplate]);

  const selectedStep = automationItems.find((step) => step.template?._id === selectedTemplateId) || automationItems[0];
  const selectedLabel = labelForStep(selectedStep);

  const previewHtml = useMemo(
    () =>
      buildEmailHtml({
        order: selectedStep?.order,
        label: selectedLabel,
        preheader: form.preheader,
        title: form.title,
        bodyHtml: form.bodyHtml,
        ctaHref: form.ctaHref,
        ctaLabel: form.ctaLabel
      }),
    [form.bodyHtml, form.ctaHref, form.ctaLabel, form.preheader, form.title, selectedLabel, selectedStep?.order]
  );

  const loadAutomation = () => {
    setStatus("loading");
    setMessage("");

    getCodeAutomation()
      .then((response) => {
        const nextSequence = response.data.sequence;
        setSequence(nextSequence);
        setUniversalTemplate(response.data.universalTemplate || null);
        setSubscriberCount(response.data.subscriberCount || 0);
        setScheduledByStatus(response.data.scheduledByStatus || []);
        const firstTemplate = nextSequence?.steps?.find((step) => step.template)?.template || response.data.universalTemplate;
        setSelectedTemplateId((current) => current || firstTemplate?._id || "");
        setStatus("ready");
      })
      .catch((requestError) => {
        setMessage(requestError.response?.data?.message || "Could not load Code automation.");
        setStatus("error");
      });
  };

  useEffect(() => {
    loadAutomation();
  }, []);

  useEffect(() => {
    const template = selectedStep?.template;
    if (!template) {
      setForm(emptyTemplate);
      return;
    }

    setForm(extractEmailParts(template, selectedStep?.order, selectedLabel));
    setSaveStatus("idle");
    setShowPreview(false);
  }, [selectedLabel, selectedStep]);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const updateBody = (bodyHtml) => {
    setForm((current) => ({ ...current, bodyHtml }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!selectedStep?.template?._id) return;

    setSaveStatus("saving");
    setMessage("");

    const payload = {
      subject: form.subject,
      preheader: form.preheader,
      html: previewHtml,
      text: toPlainText({
        title: form.title,
        bodyHtml: form.bodyHtml,
        ctaHref: form.ctaHref,
        ctaLabel: form.ctaLabel
      }),
      active: form.active
    };

    try {
      await updateCodeAutomationTemplate(selectedStep.template._id, payload);
      setSaveStatus("saved");
      setMessage("Automation email updated.");
      loadAutomation();
    } catch (requestError) {
      setSaveStatus("error");
      setMessage(requestError.response?.data?.message || "Could not save this automation email.");
    }
  };

  return (
    <section>
      <div className="flex flex-col gap-4 border-b border-sage pb-7 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">Subscriber Automation</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">Code of Resonance 6-Day Sequence</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-charcoal/66">
            Compose the six automated emails subscribers receive after joining The Code of Resonance, plus one universal email Magdalene can use manually when needed.
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`mt-6 flex gap-3 rounded border p-4 text-sm ${
            saveStatus === "error" || status === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-deepEmerald/20 bg-mutedMint text-deepEmerald"
          }`}
        >
          {saveStatus === "error" || status === "error" ? (
            <AlertCircle className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
          ) : (
            <CheckCircle2 className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
          )}
          <p>{message}</p>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Subscribers" value={subscriberCount} icon={Users} />
        <StatTile label="Pending Sequence Emails" value={statusCount(scheduledByStatus, "pending")} icon={Clock} />
        <StatTile label="Sent Sequence Emails" value={statusCount(scheduledByStatus, "sent")} icon={Send} />
        <StatTile label="Active Automation Steps" value={steps.filter((step) => step.active && step.template?.active !== false).length} icon={Mail} />
      </div>

      {status === "loading" ? (
        <div className="mt-8 grid min-h-[340px] place-items-center rounded border border-sage bg-mistWhite">
          <div className="flex items-center gap-3 text-sm font-bold text-deepEmerald">
            <Loader2 className="animate-spin" size={18} aria-hidden="true" />
            Loading automation...
          </div>
        </div>
      ) : (
        <div className="mt-8 grid items-start gap-6 xl:grid-cols-[0.75fr_1.25fr]">
          <div className="grid content-start gap-3">
            {automationItems.map((step) => (
              <StepCard
                key={step._id || step.order}
                step={step}
                active={selectedStep?.template?._id === step.template?._id}
                onClick={() => setSelectedTemplateId(step.template?._id)}
              />
            ))}
          </div>

          <form
            onSubmit={handleSave}
            className="flex max-h-[calc(100dvh-7rem)] min-h-0 flex-col overflow-hidden rounded border border-sage bg-mistWhite shadow-[0_16px_36px_rgba(26,26,26,0.04)] xl:sticky xl:top-8 xl:max-h-[calc(100dvh-4rem)]"
          >
            <div className="shrink-0 bg-mistWhite px-4 pb-5 pt-4 sm:px-6 sm:pt-6">
              <div className="flex flex-col gap-3 border-b border-sage pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">
                    {selectedLabel} · {selectedStep?.isUniversal ? "Manual / not automated" : `Sends ${delayLabelFor(selectedStep)}`}
                  </p>
                  <h2 className="mt-2 font-serif text-3xl text-charcoal">{selectedStep?.template?.name || "Automation Email"}</h2>
                </div>
                <label className="inline-flex items-center gap-2 text-sm font-extrabold text-charcoal">
                  <input type="checkbox" name="active" checked={form.active} onChange={updateField} className="accent-deepEmerald" />
                  Active
                </label>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 sm:px-6">
              <div className="mt-1 grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-sm font-extrabold text-charcoal">Subject line</span>
                  <input className="input bg-white" name="subject" value={form.subject} onChange={updateField} required />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-extrabold text-charcoal">Inbox preview</span>
                  <input className="input bg-white" name="preheader" value={form.preheader} onChange={updateField} />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-extrabold text-charcoal">Email headline</span>
                  <input className="input bg-white" name="title" value={form.title} onChange={updateField} required />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-extrabold text-charcoal">Optional next-step CTA label</span>
                  <input className="input bg-white" name="ctaLabel" value={form.ctaLabel} onChange={updateField} />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-extrabold text-charcoal">Optional next-step CTA link</span>
                  <input className="input bg-white" name="ctaHref" value={form.ctaHref} onChange={updateField} />
                </label>
              </div>

              <div className="mt-5 grid gap-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm font-extrabold text-charcoal">Email body</span>
                  <button
                    type="button"
                    onClick={() => setShowPreview((current) => !current)}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-sage bg-white px-4 py-2 text-xs font-extrabold text-charcoal transition hover:border-deepEmerald hover:text-deepEmerald"
                  >
                    {showPreview ? <X size={14} aria-hidden="true" /> : <Eye size={14} aria-hidden="true" />}
                    {showPreview ? "Close preview" : "Preview email"}
                  </button>
                </div>
                <EmailBodyEditor value={form.bodyHtml} onChange={updateBody} variables={selectedStep?.template?.variables || []} />
              </div>

              {showPreview && (
                <div className="mt-5">
                  <EmailPreview html={previewHtml} />
                </div>
              )}
            </div>

            <div className="shrink-0 border-t border-sage bg-mistWhite/95 px-4 py-4 backdrop-blur sm:flex sm:items-center sm:justify-between sm:gap-3 sm:px-6">
              <p className="inline-flex items-center gap-2 text-xs font-bold leading-5 text-charcoal/58">
                <Sparkles className="shrink-0 text-deepEmerald" size={15} aria-hidden="true" />
                Write the full email content here. The bottom CTA is only for a paid/resource next step.
              </p>
              <button
                type="submit"
                disabled={saveStatus === "saving"}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-deepEmerald px-5 py-3 text-sm font-extrabold text-mistWhite transition hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-60 sm:mt-0 sm:w-auto"
              >
                {saveStatus === "saving" ? <Loader2 className="animate-spin" size={16} aria-hidden="true" /> : <Save size={16} aria-hidden="true" />}
                {saveStatus === "saving" ? "Saving..." : "Save email"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
