import { useCallback, useEffect, useMemo, useState } from "react";
import { Mark, Node, mergeAttributes } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlertCircle,
  ArrowRight,
  Bold,
  BookOpenText,
  CheckCircle2,
  Clock,
  Eye,
  FileCheck2,
  FileText,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Layers3,
  Link2,
  List,
  ListOrdered,
  Loader2,
  MessageSquareQuote,
  Plus,
  Quote,
  Save,
  Search,
  Sparkles,
  Star,
  Trash2,
  UploadCloud,
  Video,
  X
} from "lucide-react";
import {
  createCodeOfResonanceEntry,
  deleteCodeOfResonanceEntry,
  listCodeOfResonanceEntries,
  updateCodeOfResonanceEntry,
  uploadMediaAsset
} from "../../services/api.js";
import { imageUrl } from "../../utils/cloudinaryImage.js";

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
        rel: "noopener noreferrer",
        class: "font-bold text-deepEmerald underline underline-offset-4"
      }),
      0
    ];
  }
});

const ContentImage = Node.create({
  name: "contentImage",
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
          class: "my-5 block w-full max-w-[620px] rounded border border-sage object-cover shadow-sm"
        },
        HTMLAttributes
      )
    ];
  }
});

const IframeVideo = Node.create({
  name: "iframeVideo",
  group: "block",
  atom: true,
  selectable: true,
  addAttributes() {
    return {
      src: { default: null },
      title: { default: "Embedded video" }
    };
  },
  parseHTML() {
    return [{ tag: "iframe[src]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      { class: "my-5 aspect-video overflow-hidden rounded border border-sage bg-charcoal shadow-sm" },
      [
        "iframe",
        mergeAttributes(
          {
            class: "h-full w-full",
            loading: "lazy",
            allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
            allowfullscreen: "true"
          },
          HTMLAttributes
        )
      ]
    ];
  }
});

const contentTypes = [
  {
    value: "essay",
    label: "Essay",
    section: "Latest Essays",
    description: "A point-of-view article that shifts how the reader thinks.",
    starter:
      "<p>Open with the tension your reader already feels.</p><p>Make the belief shift clear, then support it with proof, story, or observation.</p>",
    icon: BookOpenText
  },
  {
    value: "trust_resonance",
    label: "Trust & Resonance",
    section: "Trust & Resonance",
    description: "A focused note on trust signals, resonance, and earned authority.",
    starter:
      "<p>Name the trust signal or pattern you want the reader to notice.</p><p>Explain why it matters and how it changes the way people choose.</p>",
    icon: Sparkles
  },
  {
    value: "guide",
    label: "Guide",
    section: "Practical Guides",
    description: "A practical resource that helps the reader apply one idea.",
    starter:
      "<p>Start with the outcome this guide helps the reader create.</p><h2>Steps</h2><ol><li>First practical step.</li><li>Second practical step.</li><li>Next clear action.</li></ol>",
    icon: FileText
  },
  {
    value: "reading_list",
    label: "Recommended Reading",
    section: "Recommended Reading",
    description: "A book, article, or reference note with Magdalene's takeaways.",
    starter:
      "<p>Explain why this resource belongs inside The Code of Resonance.</p><p>Pull out the idea that matters most for credibility, trust, or positioning.</p>",
    icon: Layers3
  },
  {
    value: "case_study",
    label: "Case Study",
    section: "Case Studies",
    description: "A proof-led client or project story built around challenge, work, and result.",
    starter:
      "<h2>What changed</h2><p>Describe the shift in language, positioning, trust, or visibility.</p><h2>The work</h2><p>Explain the decisions that created the result.</p>",
    icon: FileCheck2
  },
  {
    value: "testimonial",
    label: "Transformation Story",
    section: "Stories of Transformation",
    description: "A before-and-after story in the client's or reader's words.",
    starter:
      "<p>Frame the transformation with context, then let the before-and-after carry the proof.</p>",
    icon: MessageSquareQuote
  }
];

const statusOptions = [
  { value: "idea", label: "Idea" },
  { value: "outline", label: "Outline" },
  { value: "draft", label: "Draft" },
  { value: "review", label: "Review" },
  { value: "ready", label: "Live" },
  { value: "archived", label: "Archived" }
];

const journeyStages = [
  { value: "awareness", label: "Awareness" },
  { value: "belief_shift", label: "Belief shift" },
  { value: "trust_building", label: "Trust building" },
  { value: "proof", label: "Proof" },
  { value: "conversion", label: "Conversion" },
  { value: "retention", label: "Retention" }
];

const emptyForm = {
  title: "",
  contentType: "essay",
  status: "draft",
  excerpt: "",
  body: contentTypes[0].starter,
  ctaText: "",
  ctaUrl: "",
  category: "",
  tags: "",
  coverImage: "",
  coverImagePreview: "",
  authorName: "Magdalene Wambui",
  featured: false,
  displayOrder: 0,
  readingTimeMinutes: "",
  journeyStage: "belief_shift",
  audience: "",
  objective: "",
  readerShift: "",
  primaryCta: "",
  successMetric: "",
  pillar: "",
  angle: "",
  coreQuestion: "",
  thesis: "",
  proofPoints: "",
  sourceTitle: "",
  sourceAuthor: "",
  sourceUrl: "",
  clientName: "",
  challenge: "",
  result: "",
  testimonialBefore: "",
  testimonialAfter: "",
  testimonialName: "",
  testimonialRole: "",
  seoTitle: "",
  seoDescription: "",
  seoCanonicalUrl: ""
};

const typeFor = (contentType) => contentTypes.find((type) => type.value === contentType) || contentTypes[0];
const normalizeStatus = (status) => {
  if (status === "published") return "ready";
  return statusOptions.some((option) => option.value === status) ? status : "draft";
};

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const stripHtml = (value = "") => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const wordCount = (value = "") => {
  const text = stripHtml(value);
  return text ? text.split(/\s+/).length : 0;
};

const mediaAssetUrl = (media) => media?.optimizedUrl || media?.secureUrl || media?.thumbnailUrl || "";

const embedUrlFrom = (value = "") => {
  const candidate = String(value).trim();
  const rawUrl = candidate.startsWith("<iframe") ? candidate.match(/src=["']([^"']+)["']/i)?.[1] || "" : candidate;
  if (!rawUrl) return "";

  try {
    const url = new URL(rawUrl);
    const host = url.hostname.replace(/^www\./, "");

    if (host.includes("youtube.com")) {
      const id = url.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }

    if (host === "youtu.be") {
      const id = url.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }

    if (host === "vimeo.com") {
      const id = url.pathname.slice(1);
      return id ? `https://player.vimeo.com/video/${id}` : "";
    }

    return rawUrl;
  } catch {
    return "";
  }
};

const parseTags = (value = "") =>
  String(value)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

const parseLines = (value = "") =>
  String(value)
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const countSummary = (items = []) =>
  Object.fromEntries(items.map((item) => [item._id || "unknown", item.count || 0]));

const formFromEntry = (entry = {}) => ({
  ...emptyForm,
  title: entry.title || "",
  contentType: entry.contentType || "essay",
  status: normalizeStatus(entry.status),
  excerpt: entry.excerpt || "",
  body: entry.body || typeFor(entry.contentType).starter,
  ctaText: entry.ctaText || "",
  ctaUrl: entry.ctaUrl || "",
  category: entry.category || "",
  tags: (entry.tags || []).join(", "),
  coverImage: entry.coverImage?._id || entry.coverImage || "",
  coverImagePreview: mediaAssetUrl(entry.coverImage),
  authorName: entry.authorName || "Magdalene Wambui",
  featured: Boolean(entry.featured),
  displayOrder: entry.displayOrder || 0,
  readingTimeMinutes: entry.readingTimeMinutes || "",
  journeyStage: entry.strategicGoal?.journeyStage || "belief_shift",
  audience: entry.strategicGoal?.audience || "",
  objective: entry.strategicGoal?.objective || "",
  readerShift: entry.strategicGoal?.readerShift || "",
  primaryCta: entry.strategicGoal?.primaryCta || "",
  successMetric: entry.strategicGoal?.successMetric || "",
  pillar: entry.editorialPlan?.pillar || "",
  angle: entry.editorialPlan?.angle || "",
  coreQuestion: entry.editorialPlan?.coreQuestion || "",
  thesis: entry.editorialPlan?.thesis || "",
  proofPoints: (entry.editorialPlan?.proofPoints || []).join("\n"),
  sourceTitle: entry.source?.title || "",
  sourceAuthor: entry.source?.author || "",
  sourceUrl: entry.source?.url || "",
  clientName: entry.caseStudy?.clientName || "",
  challenge: entry.caseStudy?.challenge || "",
  result: entry.caseStudy?.result || "",
  testimonialBefore: entry.testimonial?.before || "",
  testimonialAfter: entry.testimonial?.after || "",
  testimonialName: entry.testimonial?.name || "",
  testimonialRole: entry.testimonial?.role || "",
  seoTitle: entry.seo?.title || "",
  seoDescription: entry.seo?.description || "",
  seoCanonicalUrl: entry.seo?.canonicalUrl || ""
});

const payloadFromForm = (form) => ({
  title: form.title.trim(),
  contentType: form.contentType,
  status: form.status,
  excerpt: form.excerpt,
  body: form.body,
  ctaText: form.ctaText,
  ctaUrl: form.ctaUrl,
  category: form.category,
  tags: parseTags(form.tags),
  coverImage: form.coverImage,
  authorName: form.authorName,
  featured: Boolean(form.featured),
  displayOrder: Number(form.displayOrder || 0),
  readingTimeMinutes: form.readingTimeMinutes === "" ? undefined : Number(form.readingTimeMinutes),
  strategicGoal: {
    journeyStage: form.journeyStage,
    audience: form.audience,
    objective: form.objective,
    readerShift: form.readerShift,
    primaryCta: form.primaryCta,
    successMetric: form.successMetric
  },
  editorialPlan: {
    pillar: form.pillar,
    angle: form.angle,
    coreQuestion: form.coreQuestion,
    thesis: form.thesis,
    proofPoints: parseLines(form.proofPoints)
  },
  source: {
    title: form.sourceTitle,
    author: form.sourceAuthor,
    url: form.sourceUrl
  },
  caseStudy: {
    clientName: form.clientName,
    challenge: form.challenge,
    result: form.result
  },
  testimonial: {
    before: form.testimonialBefore,
    after: form.testimonialAfter,
    name: form.testimonialName,
    role: form.testimonialRole
  },
  seo: {
    title: form.seoTitle,
    description: form.seoDescription,
    canonicalUrl: form.seoCanonicalUrl
  }
});

function Field({ label, help, children, className = "" }) {
  return (
    <label className={`grid gap-2 ${className}`}>
      <span className="text-sm font-extrabold text-charcoal">{label}</span>
      {children}
      {help ? <span className="text-xs leading-5 text-charcoal/52">{help}</span> : null}
    </label>
  );
}

function TypePickerModal({ open, onClose, onSelect, counts }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-charcoal/58 p-4 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded border border-sage bg-mistWhite p-4 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4 border-b border-sage pb-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">Create entry</p>
            <h2 className="mt-2 font-serif text-3xl leading-tight text-charcoal">Choose the format</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-charcoal/62">
              Pick what you are creating. The editor will only show the fields that fit that format.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-sage text-charcoal/62 transition hover:border-charcoal hover:text-charcoal"
            aria-label="Close format picker"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {contentTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => onSelect(type.value)}
                className="group grid min-h-[168px] content-between rounded border border-sage bg-white p-4 text-left shadow-[0_14px_30px_rgba(26,26,26,0.035)] transition hover:border-deepEmerald hover:shadow-[0_18px_38px_rgba(26,26,26,0.08)]"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded bg-mutedMint text-deepEmerald transition group-hover:bg-deepEmerald group-hover:text-mistWhite">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <ArrowRight size={17} className="mt-2 text-charcoal/34 transition group-hover:translate-x-1 group-hover:text-deepEmerald" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-serif text-xl leading-tight text-charcoal">{type.label}</span>
                  <span className="mt-2 block text-sm leading-6 text-charcoal/62">{type.description}</span>
                  <span className="mt-3 inline-flex rounded-full border border-sage px-3 py-1 text-xs font-bold text-charcoal/56">
                    {counts[type.value] || 0} saved
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function EditorToolbar({ editor, onUploadMedia }) {
  const insertLink = () => {
    const href = window.prompt("Paste the link URL");
    if (!href) return;
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, " ").trim();
    editor
      .chain()
      .focus()
      .insertContent(`<a href="${escapeHtml(href.trim())}">${escapeHtml(selectedText || href.trim())}</a>`)
      .run();
  };

  const insertImage = () => {
    const src = window.prompt("Paste the image URL");
    if (!src) return;
    editor.chain().focus().insertContent({ type: "contentImage", attrs: { src: src.trim() } }).run();
  };

  const insertVideo = () => {
    const src = window.prompt("Paste a YouTube or Vimeo URL");
    const embed = embedUrlFrom(src);
    if (!embed) return;
    editor.chain().focus().insertContent({ type: "iframeVideo", attrs: { src: embed } }).run();
  };

  const handleInlineImage = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const response = await onUploadMedia({
      file,
      usage: "code-entry-inline",
      relatedModel: "CodeOfResonanceEntry"
    });
    const media = response.data?.media || response.media;
    const src = mediaAssetUrl(media);
    if (src) {
      editor.chain().focus().insertContent({ type: "contentImage", attrs: { src, alt: media?.altText || "" } }).run();
    }
  };

  const toolbarButton = (label, icon, onClick, active = false) => (
    <button
      type="button"
      onClick={onClick}
      className={`grid h-9 w-9 place-items-center rounded border transition ${
        active
          ? "border-deepEmerald bg-deepEmerald text-mistWhite"
          : "border-transparent text-charcoal/66 hover:border-sage hover:bg-mutedMint/35 hover:text-charcoal"
      }`}
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sage bg-white px-3 py-2">
      <div className="flex flex-wrap items-center gap-1">
        {toolbarButton("Heading 2", <Heading2 size={16} aria-hidden="true" />, () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive("heading", { level: 2 }))}
        {toolbarButton("Heading 3", <Heading3 size={16} aria-hidden="true" />, () => editor.chain().focus().toggleHeading({ level: 3 }).run(), editor.isActive("heading", { level: 3 }))}
        {toolbarButton("Bold", <Bold size={16} aria-hidden="true" />, () => editor.chain().focus().toggleBold().run(), editor.isActive("bold"))}
        {toolbarButton("Italic", <Italic size={16} aria-hidden="true" />, () => editor.chain().focus().toggleItalic().run(), editor.isActive("italic"))}
        {toolbarButton("Quote", <Quote size={16} aria-hidden="true" />, () => editor.chain().focus().toggleBlockquote().run(), editor.isActive("blockquote"))}
        {toolbarButton("Bulleted list", <List size={16} aria-hidden="true" />, () => editor.chain().focus().toggleBulletList().run(), editor.isActive("bulletList"))}
        {toolbarButton("Numbered list", <ListOrdered size={16} aria-hidden="true" />, () => editor.chain().focus().toggleOrderedList().run(), editor.isActive("orderedList"))}
      </div>

      <div className="flex flex-wrap items-center gap-1">
        {toolbarButton("Insert link", <Link2 size={16} aria-hidden="true" />, insertLink)}
        {toolbarButton("Insert image URL", <ImageIcon size={16} aria-hidden="true" />, insertImage)}
        <label
          className="grid h-9 w-9 cursor-pointer place-items-center rounded border border-transparent text-charcoal/66 transition hover:border-sage hover:bg-mutedMint/35 hover:text-charcoal"
          title="Upload image"
          aria-label="Upload image"
        >
          <UploadCloud size={16} aria-hidden="true" />
          <input type="file" accept="image/*" className="sr-only" onChange={handleInlineImage} />
        </label>
        {toolbarButton("Embed video", <Video size={16} aria-hidden="true" />, insertVideo)}
      </div>
    </div>
  );
}

function RichTextEditor({ value, onChange, onUploadMedia }) {
  const editor = useEditor({
    extensions: [StarterKit, LinkMark, ContentImage, IframeVideo],
    content: value || "<p></p>",
    editorProps: {
      attributes: {
        class:
          "ProseMirror min-h-[360px] max-w-none p-4 font-serif text-lg leading-8 text-charcoal focus:outline-none sm:p-6"
      }
    },
    onUpdate({ editor: activeEditor }) {
      onChange(activeEditor.getHTML());
    }
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "<p></p>", false);
    }
  }, [editor, value]);

  if (!editor) {
    return <div className="min-h-[420px] animate-pulse rounded border border-sage bg-sage/20" />;
  }

  return (
    <div className="tiptap-editor overflow-hidden rounded border border-sage bg-mistWhite shadow-[0_16px_34px_rgba(26,26,26,0.045)]">
      <EditorToolbar editor={editor} onUploadMedia={onUploadMedia} />
      <EditorContent editor={editor} />
    </div>
  );
}

function CoverUploader({ form, uploading, onUpload }) {
  return (
    <div className="rounded border border-sage bg-white p-3">
      {form.coverImagePreview ? (
        <img
          src={form.coverImagePreview}
          alt=""
          className="h-44 w-full rounded border border-sage object-cover"
        />
      ) : (
        <div className="grid h-44 place-items-center rounded border border-dashed border-sage bg-mutedMint/25 text-center text-sm font-semibold text-charcoal/56">
          No cover image
        </div>
      )}
      <label className="mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-charcoal bg-charcoal px-4 py-2.5 text-sm font-extrabold text-mutedMint transition hover:bg-deepEmerald hover:text-mistWhite">
        {uploading ? <Loader2 className="animate-spin" size={16} aria-hidden="true" /> : <UploadCloud size={16} aria-hidden="true" />}
        {uploading ? "Uploading..." : "Upload cover"}
        <input type="file" accept="image/*" className="sr-only" disabled={uploading} onChange={onUpload} />
      </label>
    </div>
  );
}

function FormatFields({ form, onChange }) {
  if (form.contentType === "case_study") {
    return (
      <div className="grid gap-4">
        <Field label="Client or project">
          <input className="input bg-mistWhite" name="clientName" value={form.clientName} onChange={onChange} placeholder="Client name, project, or anonymized label" />
        </Field>
        <Field label="Challenge">
          <textarea className="input min-h-28 bg-mistWhite" name="challenge" value={form.challenge} onChange={onChange} placeholder="What was unclear, stuck, invisible, or costing trust?" />
        </Field>
        <Field label="Result">
          <textarea className="input min-h-28 bg-mistWhite" name="result" value={form.result} onChange={onChange} placeholder="What changed after the work?" />
        </Field>
        <Field label="Outcome highlights" help="One highlight per line. These appear as the case study proof strip.">
          <textarea className="input min-h-28 bg-mistWhite" name="proofPoints" value={form.proofPoints} onChange={onChange} placeholder={"Clearer offer language\nStronger trust signals\nMore confident buyer conversations"} />
        </Field>
      </div>
    );
  }

  if (form.contentType === "reading_list") {
    return (
      <div className="grid gap-4">
        <Field label="Source title">
          <input className="input bg-mistWhite" name="sourceTitle" value={form.sourceTitle} onChange={onChange} placeholder="Book, article, podcast, or resource" />
        </Field>
        <Field label="Author or creator">
          <input className="input bg-mistWhite" name="sourceAuthor" value={form.sourceAuthor} onChange={onChange} />
        </Field>
        <Field label="Source link">
          <input className="input bg-mistWhite" name="sourceUrl" value={form.sourceUrl} onChange={onChange} placeholder="https://..." />
        </Field>
        <Field label="Why it matters">
          <textarea className="input min-h-28 bg-mistWhite" name="thesis" value={form.thesis} onChange={onChange} placeholder="What idea should the reader take from it?" />
        </Field>
      </div>
    );
  }

  if (form.contentType === "testimonial") {
    return (
      <div className="grid gap-4">
        <Field label="Person">
          <input className="input bg-mistWhite" name="testimonialName" value={form.testimonialName} onChange={onChange} placeholder="Name or anonymized label" />
        </Field>
        <Field label="Role">
          <input className="input bg-mistWhite" name="testimonialRole" value={form.testimonialRole} onChange={onChange} placeholder="Practitioner, founder, coach..." />
        </Field>
        <Field label="Before">
          <textarea className="input min-h-28 bg-mistWhite" name="testimonialBefore" value={form.testimonialBefore} onChange={onChange} placeholder="Where were they before?" />
        </Field>
        <Field label="After">
          <textarea className="input min-h-28 bg-mistWhite" name="testimonialAfter" value={form.testimonialAfter} onChange={onChange} placeholder="What shifted after the work?" />
        </Field>
      </div>
    );
  }

  if (form.contentType === "guide") {
    return (
      <div className="grid gap-4">
        <Field label="Guide promise">
          <textarea className="input min-h-24 bg-mistWhite" name="objective" value={form.objective} onChange={onChange} placeholder="What will this guide help the reader do?" />
        </Field>
        <Field label="Reader shift">
          <textarea className="input min-h-24 bg-mistWhite" name="readerShift" value={form.readerShift} onChange={onChange} placeholder="What should they understand or do differently after reading?" />
        </Field>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <Field label={form.contentType === "trust_resonance" ? "Trust idea" : "Core idea"}>
        <textarea className="input min-h-24 bg-mistWhite" name="thesis" value={form.thesis} onChange={onChange} placeholder="The main point this piece wants to make." />
      </Field>
      <Field label="Reader question">
        <input className="input bg-mistWhite" name="coreQuestion" value={form.coreQuestion} onChange={onChange} placeholder="What question is this answering for the reader?" />
      </Field>
      <Field label="Reader shift">
        <textarea className="input min-h-24 bg-mistWhite" name="readerShift" value={form.readerShift} onChange={onChange} placeholder="The before-to-after belief shift." />
      </Field>
    </div>
  );
}

function EntryEditorModal({
  form,
  editingId,
  saving,
  uploadingCover,
  onChange,
  onBodyChange,
  onClose,
  onSave,
  onDelete,
  onCoverUpload,
  onUploadMedia
}) {
  const type = typeFor(form.contentType);
  const Icon = type.icon;
  const words = wordCount(form.body);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal/58 p-0 backdrop-blur-sm sm:p-4">
      <div className="mx-auto min-h-screen w-full bg-mistWhite shadow-2xl sm:min-h-0 sm:max-w-7xl sm:rounded sm:border sm:border-sage">
        <header className="sticky top-0 z-10 border-b border-sage bg-mistWhite/95 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-sage text-charcoal/62 transition hover:border-charcoal hover:text-charcoal"
                aria-label="Close editor"
              >
                <X size={18} aria-hidden="true" />
              </button>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded bg-mutedMint text-deepEmerald">
                <Icon size={18} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">{type.section}</p>
                <h2 className="truncate font-serif text-xl leading-tight text-charcoal sm:text-2xl">
                  {form.title || `New ${type.label}`}
                </h2>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-sage px-3 py-2 text-xs font-bold text-charcoal/58">
                <Clock size={14} aria-hidden="true" />
                {words} words
              </span>
              <select className="input w-auto min-w-32 bg-white px-3 py-2 text-sm font-bold" name="status" value={form.status} onChange={onChange}>
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={onSave}
                disabled={saving || !form.title.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-deepEmerald px-5 py-3 text-sm font-extrabold text-mistWhite transition hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-55"
              >
                {saving ? <Loader2 className="animate-spin" size={16} aria-hidden="true" /> : <Save size={16} aria-hidden="true" />}
                {saving ? "Saving..." : editingId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </header>

        <div className="grid gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <main className="grid min-w-0 gap-5">
            <section className="grid gap-4 rounded border border-sage bg-white p-4 shadow-[0_16px_34px_rgba(26,26,26,0.035)] sm:p-5">
              <Field label="Format">
                <select className="input bg-mistWhite" name="contentType" value={form.contentType} onChange={onChange}>
                  {contentTypes.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Title">
                <input className="input bg-mistWhite text-lg font-bold sm:text-xl" name="title" value={form.title} onChange={onChange} placeholder="Write the title" />
              </Field>
              <Field label="Short summary" help="This appears on the library cards and near the article title.">
                <textarea className="input min-h-24 bg-mistWhite" name="excerpt" value={form.excerpt} onChange={onChange} placeholder="A clean preview of what this piece is about." />
              </Field>
            </section>

            <section>
              <div className="mb-2 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-extrabold text-charcoal">Main content</p>
                  <p className="mt-1 text-xs text-charcoal/52">Write the piece itself. Use the side panel only for details that support this format.</p>
                </div>
              </div>
              <RichTextEditor value={form.body} onChange={onBodyChange} onUploadMedia={onUploadMedia} />
            </section>
          </main>

          <aside className="grid h-max gap-4 lg:sticky lg:top-24">
            <section className="rounded border border-sage bg-white p-4 shadow-[0_16px_34px_rgba(26,26,26,0.035)]">
              <h3 className="font-serif text-xl text-charcoal">{type.label} details</h3>
              <p className="mt-1 text-sm leading-6 text-charcoal/58">{type.description}</p>
              <div className="mt-4">
                <FormatFields form={form} onChange={onChange} />
              </div>
            </section>

            <section className="rounded border border-sage bg-white p-4 shadow-[0_16px_34px_rgba(26,26,26,0.035)]">
              <h3 className="font-serif text-xl text-charcoal">Cover image</h3>
              <p className="mt-1 text-sm leading-6 text-charcoal/58">Optional, but helpful for the public library.</p>
              <div className="mt-4">
                <CoverUploader form={form} uploading={uploadingCover} onUpload={onCoverUpload} />
              </div>
            </section>

            <section className="rounded border border-sage bg-white p-4 shadow-[0_16px_34px_rgba(26,26,26,0.035)]">
              <h3 className="font-serif text-xl text-charcoal">Publishing</h3>
              <div className="mt-4 grid gap-4">
                <Field label="Tags" help="Separate tags with commas.">
                  <input className="input bg-mistWhite" name="tags" value={form.tags} onChange={onChange} placeholder="trust, positioning, proof" />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <Field label="Category">
                    <input className="input bg-mistWhite" name="category" value={form.category} onChange={onChange} />
                  </Field>
                  <Field label="Read time">
                    <input className="input bg-mistWhite" type="number" min="0" name="readingTimeMinutes" value={form.readingTimeMinutes} onChange={onChange} placeholder="5" />
                  </Field>
                </div>
                <Field label="CTA text">
                  <input className="input bg-mistWhite" name="ctaText" value={form.ctaText} onChange={onChange} placeholder="Book the Earned Credibility offer" />
                </Field>
                <Field label="CTA link">
                  <input className="input bg-mistWhite" name="ctaUrl" value={form.ctaUrl} onChange={onChange} placeholder="https://... or /offers/..." />
                </Field>
                <label className="flex items-center gap-3 rounded border border-sage bg-mutedMint/20 p-3 text-sm font-bold text-charcoal">
                  <input className="h-4 w-4 rounded border-sage text-deepEmerald" type="checkbox" name="featured" checked={form.featured} onChange={onChange} />
                  Feature this entry
                </label>
              </div>
            </section>

            <details className="rounded border border-sage bg-white p-4 shadow-[0_16px_34px_rgba(26,26,26,0.035)]">
              <summary className="cursor-pointer font-serif text-xl text-charcoal">SEO and order</summary>
              <div className="mt-4 grid gap-4">
                <Field label="SEO title">
                  <input className="input bg-mistWhite" name="seoTitle" value={form.seoTitle} onChange={onChange} />
                </Field>
                <Field label="SEO description">
                  <textarea className="input min-h-24 bg-mistWhite" name="seoDescription" value={form.seoDescription} onChange={onChange} />
                </Field>
                <Field label="Canonical URL">
                  <input className="input bg-mistWhite" name="seoCanonicalUrl" value={form.seoCanonicalUrl} onChange={onChange} placeholder="https://..." />
                </Field>
                <Field label="Display order">
                  <input className="input bg-mistWhite" type="number" name="displayOrder" value={form.displayOrder} onChange={onChange} />
                </Field>
                <Field label="Journey stage">
                  <select className="input bg-mistWhite" name="journeyStage" value={form.journeyStage} onChange={onChange}>
                    {journeyStages.map((stage) => (
                      <option key={stage.value} value={stage.value}>
                        {stage.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </details>

            {editingId ? (
              <button
                type="button"
                onClick={onDelete}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-white px-5 py-3 text-sm font-extrabold text-red-700 transition hover:bg-red-50"
              >
                <Trash2 size={16} aria-hidden="true" />
                Delete entry
              </button>
            ) : null}
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function AdminCodeOfResonancePage() {
  const [entries, setEntries] = useState([]);
  const [summary, setSummary] = useState({ byStatus: [], byType: [], featuredCount: 0, subscriberCount: 0 });
  const [filters, setFilters] = useState({ contentType: "", status: "", search: "" });
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [typePickerOpen, setTypePickerOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const typeCounts = useMemo(() => countSummary(summary.byType), [summary.byType]);
  const filteredStatusOptions = useMemo(() => statusOptions.filter((status) => status.value !== "archived"), []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await listCodeOfResonanceEntries({ ...filters, limit: 100 });
      setEntries(response.data.items || []);
      setSummary(response.data.summary || { byStatus: [], byType: [], featuredCount: 0, subscriberCount: 0 });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not load Code of Resonance entries.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateForm = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => {
      if (name === "contentType") {
        const nextType = typeFor(value);
        const isBodyEmpty = !stripHtml(current.body);
        return {
          ...current,
          contentType: value,
          body: isBodyEmpty ? nextType.starter : current.body
        };
      }

      return {
        ...current,
        [name]: type === "checkbox" ? checked : value
      };
    });
  };

  const openNewEntry = (contentType) => {
    const type = typeFor(contentType);
    setForm({
      ...emptyForm,
      contentType,
      body: type.starter,
      category: type.section,
      status: "draft"
    });
    setEditingId("");
    setTypePickerOpen(false);
    setEditorOpen(true);
  };

  const openExistingEntry = (entry) => {
    setForm(formFromEntry(entry));
    setEditingId(entry._id);
    setEditorOpen(true);
  };

  const saveEntry = async () => {
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const payload = payloadFromForm(form);
      if (editingId) {
        await updateCodeOfResonanceEntry(editingId, payload);
      } else {
        await createCodeOfResonanceEntry(payload);
      }

      setEditorOpen(false);
      setNotice(editingId ? "Entry updated." : "Entry saved.");
      await loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not save this entry.");
    } finally {
      setSaving(false);
    }
  };

  const uploadCover = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploadingCover(true);
    setError("");

    try {
      const response = await uploadMediaAsset({
        file,
        usage: "code-entry-cover",
        relatedModel: "CodeOfResonanceEntry"
      });
      const media = response.data?.media || response.media;
      setForm((current) => ({
        ...current,
        coverImage: media?._id || "",
        coverImagePreview: mediaAssetUrl(media)
      }));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not upload cover image.");
    } finally {
      setUploadingCover(false);
    }
  };

  const removeEntry = async () => {
    if (!editingId) return;
    const confirmed = window.confirm("Delete this Code of Resonance entry?");
    if (!confirmed) return;

    setSaving(true);
    setError("");

    try {
      await deleteCodeOfResonanceEntry(editingId);
      setEditorOpen(false);
      setNotice("Entry deleted.");
      await loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not delete this entry.");
    } finally {
      setSaving(false);
    }
  };

  const totalEntries = entries.length;
  const liveEntries = entries.filter((entry) => entry.status === "ready").length;
  const draftEntries = entries.filter((entry) => ["idea", "outline", "draft", "review"].includes(entry.status)).length;

  return (
    <section className="min-h-screen bg-mistWhite text-charcoal">
      <header className="border-b border-sage bg-white px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">Editorial library</p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-charcoal sm:text-5xl">The Code of Resonance</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-charcoal/64">
              Write and publish essays, guides, reading notes, case studies, and transformation stories without extra workflow noise.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setTypePickerOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-deepEmerald px-5 py-3 text-sm font-extrabold text-mistWhite transition hover:bg-charcoal"
          >
            <Plus size={16} aria-hidden="true" />
            New entry
          </button>
        </div>

        <div className="mx-auto mt-8 grid max-w-7xl grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Total", totalEntries],
            ["Drafts", draftEntries],
            ["Live", liveEntries],
            ["Featured", summary.featuredCount || 0]
          ].map(([label, value]) => (
            <div key={label} className="rounded border border-sage bg-mistWhite p-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-charcoal/46">{label}</p>
              <p className="mt-1 text-3xl font-black text-charcoal">{value}</p>
            </div>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
        {(notice || error) && (
          <div
            className={`mb-5 flex gap-3 rounded border p-4 text-sm font-semibold ${
              error ? "border-red-200 bg-red-50 text-red-700" : "border-deepEmerald/20 bg-mutedMint text-deepEmerald"
            }`}
            role={error ? "alert" : "status"}
          >
            {error ? <AlertCircle className="mt-0.5 shrink-0" size={18} aria-hidden="true" /> : <CheckCircle2 className="mt-0.5 shrink-0" size={18} aria-hidden="true" />}
            <p>{error || notice}</p>
          </div>
        )}

        <div className="grid gap-3 rounded border border-sage bg-white p-3 shadow-[0_16px_34px_rgba(26,26,26,0.04)] lg:grid-cols-[1fr_auto_auto] lg:items-center">
          <label className="relative block min-w-0">
            <span className="sr-only">Search entries</span>
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/42" aria-hidden="true" />
            <input
              className="input bg-mistWhite py-2 pl-10 text-sm"
              value={filters.search}
              onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
              placeholder="Search titles, tags, or themes"
            />
          </label>
          <label>
            <span className="sr-only">Filter by format</span>
            <select
              className="input bg-mistWhite py-2 text-sm font-bold lg:w-56"
              value={filters.contentType}
              onChange={(event) => setFilters((current) => ({ ...current, contentType: event.target.value }))}
            >
              <option value="">All formats</option>
              {contentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Filter by status</span>
            <select
              className="input bg-mistWhite py-2 text-sm font-bold lg:w-44"
              value={filters.status}
              onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
            >
              <option value="">All statuses</option>
              {filteredStatusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 grid gap-4">
          {loading ? (
            [1, 2, 3].map((item) => (
              <div key={item} className="h-32 animate-pulse rounded border border-sage bg-white" />
            ))
          ) : entries.length === 0 ? (
            <div className="rounded border border-dashed border-sage bg-white p-10 text-center">
              <Eye className="mx-auto text-deepEmerald" size={28} aria-hidden="true" />
              <h2 className="mt-3 font-serif text-3xl text-charcoal">No entries yet</h2>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-charcoal/60">
                Create the first Code of Resonance entry. Choose the format, write the piece, save it as draft or make it live.
              </p>
              <button
                type="button"
                onClick={() => setTypePickerOpen(true)}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-deepEmerald px-5 py-3 text-sm font-extrabold text-mistWhite transition hover:bg-charcoal"
              >
                <Plus size={16} aria-hidden="true" />
                New entry
              </button>
            </div>
          ) : (
            entries.map((entry) => {
              const type = typeFor(entry.contentType);
              const Icon = type.icon;
              const coverSrc = imageUrl(entry.coverImage, "");
              const statusLabel = statusOptions.find((status) => status.value === normalizeStatus(entry.status))?.label || entry.status;

              return (
                <button
                  key={entry._id}
                  type="button"
                  onClick={() => openExistingEntry(entry)}
                  className="group grid w-full gap-4 rounded border border-sage bg-white p-4 text-left shadow-[0_16px_34px_rgba(26,26,26,0.04)] transition hover:border-deepEmerald hover:shadow-[0_18px_38px_rgba(26,26,26,0.075)] md:grid-cols-[96px_minmax(0,1fr)_auto] md:items-center"
                >
                  <span className="block h-24 overflow-hidden rounded border border-sage bg-mutedMint/35 md:h-20">
                    {coverSrc ? (
                      <img src={coverSrc} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="grid h-full w-full place-items-center text-deepEmerald">
                        <Icon size={22} aria-hidden="true" />
                      </span>
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-mutedMint px-3 py-1 text-xs font-extrabold text-deepEmerald">
                        <Icon size={13} aria-hidden="true" />
                        {type.label}
                      </span>
                      <span className="rounded-full border border-sage px-3 py-1 text-xs font-bold capitalize text-charcoal/56">
                        {statusLabel}
                      </span>
                      {entry.featured ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-sage px-3 py-1 text-xs font-bold text-charcoal/56">
                          <Star size={12} aria-hidden="true" />
                          Featured
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-3 block truncate font-serif text-2xl leading-tight text-charcoal transition group-hover:text-deepEmerald">
                      {entry.title || "Untitled entry"}
                    </span>
                    <span className="mt-2 block line-clamp-2 text-sm leading-6 text-charcoal/60">
                      {entry.excerpt || entry.caseStudy?.result || entry.testimonial?.after || stripHtml(entry.body) || "No summary yet."}
                    </span>
                  </span>
                  <span className="flex items-center justify-between gap-4 text-sm font-bold text-charcoal/46 md:justify-end">
                    <span>{wordCount(entry.body)} words</span>
                    <ArrowRight size={18} className="transition group-hover:translate-x-1 group-hover:text-deepEmerald" aria-hidden="true" />
                  </span>
                </button>
              );
            })
          )}
        </div>
      </main>

      <TypePickerModal
        open={typePickerOpen}
        onClose={() => setTypePickerOpen(false)}
        onSelect={openNewEntry}
        counts={typeCounts}
      />

      {editorOpen ? (
        <EntryEditorModal
          form={form}
          editingId={editingId}
          saving={saving}
          uploadingCover={uploadingCover}
          onChange={updateForm}
          onBodyChange={(body) => setForm((current) => ({ ...current, body }))}
          onClose={() => setEditorOpen(false)}
          onSave={saveEntry}
          onDelete={removeEntry}
          onCoverUpload={uploadCover}
          onUploadMedia={uploadMediaAsset}
        />
      ) : null}
    </section>
  );
}
