import { useEffect, useMemo, useState } from "react";
import { Mark, mergeAttributes, Node } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bold,
  BookOpenText,
  CheckCircle2,
  Edit3,
  Eye,
  FileText,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link2,
  Layers3,
  List,
  ListOrdered,
  Plus,
  Quote,
  Redo2,
  RotateCcw,
  Save,
  Search,
  Sparkles,
  Star,
  Trash2,
  Undo2,
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

const ContentImage = Node.create({
  name: "contentImage",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: null },
      alt: { default: "" },
      title: { default: "" }
    };
  },
  parseHTML() {
    return [{ tag: "img[src]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes({ class: "content-editor-image" }, HTMLAttributes)];
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
      "iframe",
      mergeAttributes(
        {
          class: "content-editor-video",
          loading: "lazy",
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          allowfullscreen: "true",
          referrerpolicy: "strict-origin-when-cross-origin"
        },
        HTMLAttributes
      )
    ];
  }
});

const contentTypes = [
  {
    value: "guide",
    label: "Credibility Shift Guide",
    section: "Featured Resource",
    goal: "Convert curiosity into a guided lead-capture moment.",
    readerShift: "I already have credibility; I need to uncover it.",
    metric: "Guide downloads and assessment starts",
    icon: FileText
  },
  {
    value: "trust_resonance",
    label: "Trust & Resonance",
    section: "The Code of Resonance",
    goal: "Build Magdalene's worldview and make the trust philosophy memorable.",
    readerShift: "Resonance is earned clarity, not louder visibility.",
    metric: "Subscribers and repeat readers",
    icon: Sparkles
  },
  {
    value: "essay",
    label: "Latest Essay",
    section: "Latest Essays",
    goal: "Challenge conventional thinking and open a new belief.",
    readerShift: "Visibility alone is not enough to become the trusted choice.",
    metric: "Essay reads and assessment clicks",
    icon: BookOpenText
  },
  {
    value: "reading_list",
    label: "Recommended Reading",
    section: "Recommended Reading",
    goal: "Show the intellectual depth behind the Earned Credibility framework.",
    readerShift: "This work is grounded, ethical, and deeply thought through.",
    metric: "Saved resources and return visits",
    icon: Layers3
  },
  {
    value: "case_study",
    label: "Case Study",
    section: "Case Studies",
    goal: "Turn transformation into proof that reduces hesitation.",
    readerShift: "This can work for someone like me.",
    metric: "Application starts and enquiry clicks",
    icon: Eye
  },
  {
    value: "testimonial",
    label: "Transformation Story",
    section: "Stories of Transformation",
    goal: "Make client trust visible through before-and-after language.",
    readerShift: "Other practitioners have felt this same gap and moved through it.",
    metric: "Offer-page clicks and trust lift",
    icon: Star
  }
];

const statusWorkflow = ["idea", "outline", "draft", "review", "ready"];
const activeWorkflow = statusWorkflow;

const journeyStages = [
  { value: "awareness", label: "Awareness" },
  { value: "belief_shift", label: "Belief Shift" },
  { value: "trust_building", label: "Trust Building" },
  { value: "proof", label: "Proof" },
  { value: "conversion", label: "Conversion" },
  { value: "retention", label: "Retention" }
];

const qualityChecks = [
  { key: "clearPromise", label: "Clear promise" },
  { key: "readerRelevance", label: "Reader relevance" },
  { key: "trustSignal", label: "Trust signal" },
  { key: "emotionalResonance", label: "Emotional resonance" },
  { key: "specificProof", label: "Specific proof" },
  { key: "clearNextStep", label: "Clear next step" }
];

const editorTabs = [
  {
    key: "brief",
    label: "Brief",
    shortLabel: "Brief",
    description: "Choose the resonance type, name the asset, and set the reader journey."
  },
  {
    key: "intent",
    label: "Intent",
    shortLabel: "Intent",
    description: "Shape the strategic purpose and section-specific fields."
  },
  {
    key: "draft",
    label: "Draft",
    shortLabel: "Draft",
    description: "Write the main content and add links, images, or embedded video."
  },
  {
    key: "proof",
    label: "Proof",
    shortLabel: "Proof",
    description: "Run the credibility checks before this moves forward."
  },
  {
    key: "seo",
    label: "SEO & CTA",
    shortLabel: "SEO",
    description: "Prepare the call-to-action, search snippet, order, and feature state."
  }
];

const emptyChecks = qualityChecks.reduce((checks, item) => ({ ...checks, [item.key]: false }), {});

const emptyForm = {
  title: "",
  contentType: "trust_resonance",
  status: "idea",
  excerpt: "",
  body: "<p></p>",
  coverImage: "",
  coverImagePreview: null,
  ctaText: "",
  ctaUrl: "",
  category: "",
  tags: "",
  displayOrder: 0,
  readingTimeMinutes: "",
  featured: false,
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
  qualityChecks: emptyChecks,
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
  seoDescription: ""
};

const typeFor = (type) => contentTypes.find((item) => item.value === type) || contentTypes[1];
const countFor = (items, key) => items?.find((item) => item._id === key)?.count || 0;
const normalizeWorkflowStatus = (status) => (statusWorkflow.includes(status) ? status : "draft");

const toTags = (value) =>
  String(value || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

const compactObject = (value) =>
  Object.fromEntries(
    Object.entries(value).filter(([, item]) => {
      if (Array.isArray(item)) return item.length > 0;
      return item !== "" && item !== undefined && item !== null;
    })
  );

const stripHtml = (value = "") =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const wordCount = (value = "") => {
  const text = stripHtml(value);
  return text ? text.split(/\s+/).length : 0;
};

const formatDate = (value) => {
  if (!value) return "Not scheduled";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
};

const mediaAssetUrl = (media) => media?.optimizedUrl || media?.secureUrl || media?.thumbnailUrl || "";

const extractIframeSrc = (value = "") => {
  const match = String(value).match(/src=["']([^"']+)["']/i);
  return match?.[1] || "";
};

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const embedUrlFrom = (value = "") => {
  const candidate = String(value).trim();
  const rawUrl = candidate.startsWith("<iframe") ? extractIframeSrc(candidate) : candidate;
  if (!rawUrl) return "";

  try {
    const url = new URL(rawUrl);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtube.com" || host === "m.youtube.com") {
      const videoId = url.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }

    if (host === "youtu.be") {
      const videoId = url.pathname.split("/").filter(Boolean)[0];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }

    if (host === "vimeo.com") {
      const videoId = url.pathname.split("/").filter(Boolean)[0];
      if (videoId) return `https://player.vimeo.com/video/${videoId}`;
    }

    return rawUrl;
  } catch {
    return "";
  }
};

const nextStatus = (status) => {
  const index = activeWorkflow.indexOf(status);
  return activeWorkflow[Math.min(index + 1, activeWorkflow.length - 1)] || "idea";
};

const readinessFor = (entry) => {
  const checks = entry.qualityChecks || {};
  const qualityScore = qualityChecks.filter((item) => checks[item.key]).length;
  const fields = [
    entry.title,
    entry.excerpt,
    stripHtml(entry.body),
    entry.strategicGoal?.objective,
    entry.strategicGoal?.readerShift,
    entry.strategicGoal?.successMetric,
    entry.editorialPlan?.thesis,
    entry.editorialPlan?.coreQuestion,
    entry.ctaText,
    entry.seo?.description
  ].filter(Boolean).length;

  return Math.round(((fields + qualityScore) / (10 + qualityChecks.length)) * 100);
};

const toPayload = (form) => ({
  title: form.title,
  contentType: form.contentType,
  status: form.status,
  excerpt: form.excerpt,
  body: form.body,
  coverImage: form.coverImage || undefined,
  ctaText: form.ctaText,
  ctaUrl: form.ctaUrl,
  category: form.category,
  tags: toTags(form.tags),
  displayOrder: Number(form.displayOrder || 0),
  readingTimeMinutes: form.readingTimeMinutes === "" ? undefined : Number(form.readingTimeMinutes),
  featured: form.featured,
  strategicGoal: compactObject({
    journeyStage: form.journeyStage,
    audience: form.audience,
    objective: form.objective,
    readerShift: form.readerShift,
    primaryCta: form.primaryCta,
    successMetric: form.successMetric
  }),
  editorialPlan: compactObject({
    pillar: form.pillar,
    angle: form.angle,
    coreQuestion: form.coreQuestion,
    thesis: form.thesis,
    proofPoints: toTags(form.proofPoints)
  }),
  qualityChecks: form.qualityChecks,
  source: compactObject({
    title: form.sourceTitle,
    author: form.sourceAuthor,
    url: form.sourceUrl
  }),
  caseStudy: compactObject({
    clientName: form.clientName,
    challenge: form.challenge,
    result: form.result
  }),
  testimonial: compactObject({
    before: form.testimonialBefore,
    after: form.testimonialAfter,
    name: form.testimonialName,
    role: form.testimonialRole
  }),
  seo: compactObject({
    title: form.seoTitle,
    description: form.seoDescription
  })
});

const fromEntry = (entry) => ({
  ...emptyForm,
  title: entry.title || "",
  contentType: entry.contentType || "trust_resonance",
  status: normalizeWorkflowStatus(entry.status),
  excerpt: entry.excerpt || "",
  body: entry.body || "<p></p>",
  coverImage: entry.coverImage?._id || entry.coverImage || "",
  coverImagePreview: entry.coverImage || null,
  ctaText: entry.ctaText || "",
  ctaUrl: entry.ctaUrl || "",
  category: entry.category || "",
  tags: (entry.tags || []).join(", "),
  displayOrder: entry.displayOrder || 0,
  readingTimeMinutes: entry.readingTimeMinutes ?? "",
  featured: Boolean(entry.featured),
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
  proofPoints: (entry.editorialPlan?.proofPoints || []).join(", "),
  qualityChecks: { ...emptyChecks, ...(entry.qualityChecks || {}) },
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
  seoDescription: entry.seo?.description || ""
});

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

function RichTextEditor({ value, onChange, onUploadMedia }) {
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [activeMediaTool, setActiveMediaTool] = useState(null);
  const [uploadingInline, setUploadingInline] = useState(false);
  const [mediaError, setMediaError] = useState("");

  const editor = useEditor({
    extensions: [StarterKit, LinkMark, ContentImage, IframeVideo],
    content: value || "<p></p>",
    editorProps: {
      attributes: {
        class: "tiptap-editor-body min-h-[280px] px-4 py-4 focus:outline-none sm:min-h-[380px]"
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
    return <div className="min-h-[280px] rounded border border-sage bg-sage/30 sm:min-h-[380px]" />;
  }

  const insertLink = () => {
    const href = linkUrl.trim();
    if (!href) return;
    editor
      .chain()
      .focus()
      .insertContent(`<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(href)}</a>`)
      .run();
    setLinkUrl("");
    setActiveMediaTool(null);
  };

  const insertImage = (src = imageUrl, alt = imageAlt) => {
    const imageSrc = String(src || "").trim();
    if (!imageSrc) return;
    editor.chain().focus().insertContent({ type: "contentImage", attrs: { src: imageSrc, alt } }).run();
    setImageUrl("");
    setImageAlt("");
    setActiveMediaTool(null);
  };

  const insertVideo = () => {
    const src = embedUrlFrom(videoUrl);
    if (!src) {
      setMediaError("Paste a valid YouTube, Vimeo, or iframe URL.");
      return;
    }
    editor.chain().focus().insertContent({ type: "iframeVideo", attrs: { src, title: "Embedded video" } }).run();
    setVideoUrl("");
    setActiveMediaTool(null);
    setMediaError("");
  };

  const uploadInlineImage = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !onUploadMedia) return;

    setUploadingInline(true);
    setMediaError("");
    try {
      const media = await onUploadMedia(file, {
        altText: imageAlt,
        usage: "code-inline-image",
        tags: "code-of-resonance,inline-image"
      });
      insertImage(mediaAssetUrl(media), media.altText || imageAlt);
    } catch {
      setMediaError("Could not upload that image.");
    } finally {
      setUploadingInline(false);
    }
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
        <IconButton label="Undo" onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 size={16} aria-hidden="true" />
        </IconButton>
        <IconButton label="Redo" onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 size={16} aria-hidden="true" />
        </IconButton>
      </div>
      <div className="border-b border-sage bg-mistWhite p-2">
        <div className="flex flex-wrap items-center gap-2">
          <IconButton
            label="Add link"
            active={activeMediaTool === "link"}
            onClick={() => setActiveMediaTool((tool) => (tool === "link" ? null : "link"))}
          >
            <Link2 size={16} aria-hidden="true" />
          </IconButton>
          <IconButton
            label="Add image URL"
            active={activeMediaTool === "image"}
            onClick={() => setActiveMediaTool((tool) => (tool === "image" ? null : "image"))}
          >
            <ImageIcon size={16} aria-hidden="true" />
          </IconButton>
          <label
            title="Upload image"
            className="inline-grid size-9 cursor-pointer place-items-center rounded border border-sage bg-mistWhite text-charcoal transition hover:border-deepEmerald hover:text-deepEmerald"
          >
            <UploadCloud size={16} aria-hidden="true" />
            <input type="file" accept="image/*" className="sr-only" onChange={uploadInlineImage} disabled={uploadingInline} />
          </label>
          <IconButton
            label="Add video"
            active={activeMediaTool === "video"}
            onClick={() => setActiveMediaTool((tool) => (tool === "video" ? null : "video"))}
          >
            <Video size={16} aria-hidden="true" />
          </IconButton>
          {uploadingInline && <p className="text-xs font-bold text-deepEmerald">Uploading image...</p>}
        </div>

        {activeMediaTool === "link" && (
          <div className="mt-3 flex gap-2 rounded border border-sage bg-sage/25 p-2">
            <input
              className="input min-w-0"
              value={linkUrl}
              onChange={(event) => setLinkUrl(event.target.value)}
              placeholder="https://..."
            />
            <button
              type="button"
              onClick={insertLink}
              className="inline-grid size-12 shrink-0 place-items-center rounded border border-deepEmerald bg-deepEmerald text-mistWhite transition hover:bg-charcoal"
              aria-label="Insert link"
            >
              <Link2 size={17} aria-hidden="true" />
            </button>
          </div>
        )}

        {activeMediaTool === "image" && (
          <div className="mt-3 grid gap-2 rounded border border-sage bg-sage/25 p-2 sm:grid-cols-[1fr_1fr_auto_auto] xl:grid-cols-[1fr_auto_auto]">
            <input
              className="input min-w-0 sm:col-span-2 xl:col-span-1"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="Image URL"
            />
            <input
              className="input min-w-0"
              value={imageAlt}
              onChange={(event) => setImageAlt(event.target.value)}
              placeholder="Alt text"
            />
            <button
              type="button"
              onClick={() => insertImage()}
              className="inline-grid size-12 place-items-center rounded border border-deepEmerald bg-deepEmerald text-mistWhite transition hover:bg-charcoal"
              aria-label="Insert image URL"
            >
              <ImageIcon size={17} aria-hidden="true" />
            </button>
            <label
              title="Upload image"
              className="inline-grid size-12 cursor-pointer place-items-center rounded border border-charcoal/15 bg-mistWhite text-charcoal transition hover:border-deepEmerald hover:text-deepEmerald"
            >
              <UploadCloud size={17} aria-hidden="true" />
              <input type="file" accept="image/*" className="sr-only" onChange={uploadInlineImage} disabled={uploadingInline} />
            </label>
          </div>
        )}

        {activeMediaTool === "video" && (
          <div className="mt-3 flex gap-2 rounded border border-sage bg-sage/25 p-2">
            <input
              className="input min-w-0"
              value={videoUrl}
              onChange={(event) => setVideoUrl(event.target.value)}
              placeholder="YouTube, Vimeo, or iframe"
            />
            <button
              type="button"
              onClick={insertVideo}
              className="inline-grid size-12 shrink-0 place-items-center rounded border border-deepEmerald bg-deepEmerald text-mistWhite transition hover:bg-charcoal"
              aria-label="Insert video"
            >
              <Video size={17} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
      {mediaError && <p className="border-b border-sage bg-red-50 px-4 py-2 text-xs font-bold text-red-700">{mediaError}</p>}
      <EditorContent editor={editor} className="tiptap-editor" />
    </div>
  );
}

function Field({ label, children, wide = false }) {
  return (
    <label className={`grid gap-2 ${wide ? "sm:col-span-2" : ""}`}>
      <span className="text-sm font-bold text-charcoal/76">{label}</span>
      {children}
    </label>
  );
}

function StatCard({ label, value, detail, tone = "light" }) {
  return (
    <article
      className={`rounded border p-5 shadow-[0_12px_28px_rgba(34,34,34,0.035)] ${
        tone === "dark" ? "border-charcoal bg-charcoal text-mistWhite" : "border-sage bg-mistWhite text-charcoal"
      }`}
    >
      <p className={`text-xs font-extrabold uppercase tracking-[0.16em] ${tone === "dark" ? "text-mutedMint" : "text-deepEmerald"}`}>{label}</p>
      <p className="mt-3 text-3xl font-extrabold">{value}</p>
      <p className={`mt-2 text-sm ${tone === "dark" ? "text-mistWhite/62" : "text-charcoal/62"}`}>{detail}</p>
    </article>
  );
}

function StatusPill({ status }) {
  const classes = {
    idea: "border-mutedMint bg-mutedMint/50 text-charcoal",
    outline: "border-sage bg-sage text-charcoal",
    draft: "border-deepEmerald/20 bg-deepEmerald/[0.08] text-deepEmerald",
    review: "border-charcoal/20 bg-charcoal/[0.08] text-charcoal",
    ready: "border-deepEmerald bg-deepEmerald text-mistWhite",
    fallback: "border-mutedMint bg-mutedMint/50 text-charcoal"
  };

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${classes[status] || classes.fallback}`}>
      {status}
    </span>
  );
}

function EditorModal({ title, eyebrow, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-charcoal/55"
        aria-label="Close panel"
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        className="relative flex h-[calc(100dvh-1rem)] w-full max-w-6xl flex-col overflow-hidden rounded border border-sage bg-mistWhite text-charcoal shadow-[0_24px_70px_rgba(34,34,34,0.32)] sm:h-auto sm:max-h-[92vh]"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-sage bg-charcoal px-4 py-4 text-mistWhite sm:px-5 sm:py-5">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-mutedMint">{eyebrow}</p>
            <h2 className="mt-2 font-serif text-2xl leading-tight sm:text-3xl">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-grid size-10 shrink-0 place-items-center rounded-full border border-mistWhite/20 text-mistWhite transition hover:border-mutedMint hover:text-mutedMint"
            aria-label="Close panel"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-5">{children}</div>
      </section>
    </div>
  );
}

function GoalButton({ item, count, onClick }) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid min-h-36 gap-4 rounded border border-sage bg-mistWhite p-5 text-left shadow-[0_12px_28px_rgba(34,34,34,0.035)] transition hover:border-deepEmerald hover:shadow-[0_18px_36px_rgba(34,34,34,0.08)]"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="inline-grid size-10 place-items-center rounded bg-deepEmerald text-mistWhite">
          <Icon size={18} aria-hidden="true" />
        </span>
        <span className="rounded-full bg-sage px-3 py-1 text-xs font-bold text-deepEmerald">{count} items</span>
      </div>
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">{item.section}</p>
        <h3 className="mt-2 font-serif text-2xl leading-tight">{item.label}</h3>
        <p className="mt-3 text-sm leading-6 text-charcoal/64">{item.goal}</p>
      </div>
      <span className="mt-auto inline-flex items-center gap-2 text-sm font-extrabold text-deepEmerald">
        Start structured entry
        <ArrowRight size={15} aria-hidden="true" />
      </span>
    </button>
  );
}

function WorkflowStrip({ entries }) {
  return (
    <div className="grid gap-3 md:grid-cols-5">
      {activeWorkflow.map((status) => {
        const total = entries.filter((entry) => entry.status === status).length;
        return (
          <article key={status} className="rounded border border-sage bg-mistWhite p-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">{status}</p>
            <p className="mt-3 text-2xl font-extrabold">{total}</p>
          </article>
        );
      })}
    </div>
  );
}

function CoverImagePicker({ form, onUploadCover }) {
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const previewUrl = mediaAssetUrl(form.coverImagePreview);

  const uploadCover = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !onUploadCover) return;

    setUploadingCover(true);
    setUploadError("");
    try {
      await onUploadCover(file);
    } catch {
      setUploadError("Could not upload that cover image.");
    } finally {
      setUploadingCover(false);
    }
  };

  return (
    <div className="grid gap-3 rounded border border-sage bg-sage/25 p-4 sm:col-span-2">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold text-charcoal">Cover image</p>
          <p className="mt-1 text-xs leading-5 text-charcoal/62">Uploads are optimized through Cloudinary.</p>
        </div>
        <label className="inline-flex w-max cursor-pointer items-center gap-2 rounded-full border border-deepEmerald bg-deepEmerald px-4 py-2 text-sm font-bold text-mistWhite transition hover:bg-charcoal">
          <UploadCloud size={16} aria-hidden="true" />
          {uploadingCover ? "Uploading..." : "Upload cover"}
          <input type="file" accept="image/*" className="sr-only" onChange={uploadCover} disabled={uploadingCover} />
        </label>
      </div>
      {previewUrl ? (
        <img
          src={previewUrl}
          alt={form.coverImagePreview?.altText || form.title || "Cover image preview"}
          className="aspect-[16/7] w-full rounded object-cover"
        />
      ) : (
        <div className="grid aspect-[16/7] place-items-center rounded border border-dashed border-deepEmerald/35 bg-mistWhite text-sm font-bold text-deepEmerald">
          No cover selected
        </div>
      )}
      {uploadError && <p className="text-xs font-bold text-red-700">{uploadError}</p>}
    </div>
  );
}

function SectionSpecificFields({ form, onChange }) {
  if (form.contentType === "guide") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Guide Promise" wide>
          <textarea className="input min-h-24 resize-y" name="objective" value={form.objective} onChange={onChange} />
        </Field>
        <Field label="What They Unlock" wide>
          <textarea className="input min-h-24 resize-y" name="readerShift" value={form.readerShift} onChange={onChange} />
        </Field>
        <Field label="Guide Format">
          <input className="input" name="pillar" value={form.pillar} onChange={onChange} placeholder="Workbook, checklist, field guide..." />
        </Field>
        <Field label="Download CTA">
          <input className="input" name="primaryCta" value={form.primaryCta} onChange={onChange} />
        </Field>
      </div>
    );
  }

  if (form.contentType === "trust_resonance") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Resonance Pillar">
          <input className="input" name="pillar" value={form.pillar} onChange={onChange} placeholder="Trust, credibility, clarity..." />
        </Field>
        <Field label="Reader Tension">
          <input className="input" name="coreQuestion" value={form.coreQuestion} onChange={onChange} />
        </Field>
        <Field label="Core Belief" wide>
          <textarea className="input min-h-28 resize-y" name="thesis" value={form.thesis} onChange={onChange} />
        </Field>
        <Field label="Shift You Want To Create" wide>
          <textarea className="input min-h-24 resize-y" name="readerShift" value={form.readerShift} onChange={onChange} />
        </Field>
      </div>
    );
  }

  if (form.contentType === "essay") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Essay Question" wide>
          <textarea className="input min-h-24 resize-y" name="coreQuestion" value={form.coreQuestion} onChange={onChange} />
        </Field>
        <Field label="Contrarian Angle" wide>
          <textarea className="input min-h-24 resize-y" name="angle" value={form.angle} onChange={onChange} />
        </Field>
        <Field label="Thesis" wide>
          <textarea className="input min-h-28 resize-y" name="thesis" value={form.thesis} onChange={onChange} />
        </Field>
        <Field label="Proof Points" wide>
          <input className="input" name="proofPoints" value={form.proofPoints} onChange={onChange} placeholder="observation, client proof, framework, story" />
        </Field>
      </div>
    );
  }

  if (form.contentType === "reading_list") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Source Title">
          <input className="input" name="sourceTitle" value={form.sourceTitle} onChange={onChange} />
        </Field>
        <Field label="Source Author">
          <input className="input" name="sourceAuthor" value={form.sourceAuthor} onChange={onChange} />
        </Field>
        <Field label="Source URL" wide>
          <input className="input" name="sourceUrl" value={form.sourceUrl} onChange={onChange} placeholder="https://..." />
        </Field>
        <Field label="Why It Belongs In The Code" wide>
          <textarea className="input min-h-28 resize-y" name="readerShift" value={form.readerShift} onChange={onChange} />
        </Field>
      </div>
    );
  }

  if (form.contentType === "case_study") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Client Name">
          <input className="input" name="clientName" value={form.clientName} onChange={onChange} />
        </Field>
        <Field label="Audience">
          <input className="input" name="audience" value={form.audience} onChange={onChange} />
        </Field>
        <Field label="Challenge" wide>
          <textarea className="input min-h-28 resize-y" name="challenge" value={form.challenge} onChange={onChange} />
        </Field>
        <Field label="Result" wide>
          <textarea className="input min-h-28 resize-y" name="result" value={form.result} onChange={onChange} />
        </Field>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Before" wide>
        <textarea className="input min-h-24 resize-y" name="testimonialBefore" value={form.testimonialBefore} onChange={onChange} />
      </Field>
      <Field label="After" wide>
        <textarea className="input min-h-24 resize-y" name="testimonialAfter" value={form.testimonialAfter} onChange={onChange} />
      </Field>
      <Field label="Name">
        <input className="input" name="testimonialName" value={form.testimonialName} onChange={onChange} />
      </Field>
      <Field label="Role">
        <input className="input" name="testimonialRole" value={form.testimonialRole} onChange={onChange} />
      </Field>
    </div>
  );
}

function StepNavigator({ activeStep, onStepChange, completedSteps }) {
  return (
    <nav aria-label="Entry creation steps" className="rounded border border-sage bg-sage/25 p-3">
      <div className="flex gap-2 overflow-x-auto lg:grid lg:overflow-visible">
        {editorTabs.map((step, index) => {
          const isActive = activeStep === step.key;
          const isComplete = completedSteps.includes(step.key);
          return (
            <button
              key={step.key}
              type="button"
              onClick={() => onStepChange(step.key)}
              className={`flex min-w-[170px] items-start gap-3 rounded border p-3 text-left transition lg:min-w-0 ${
                isActive
                  ? "border-deepEmerald bg-deepEmerald text-mistWhite"
                  : "border-sage bg-mistWhite text-charcoal hover:border-deepEmerald"
              }`}
            >
              <span
                className={`inline-grid size-8 shrink-0 place-items-center rounded-full border text-xs font-extrabold ${
                  isActive
                    ? "border-mutedMint bg-mutedMint text-charcoal"
                    : isComplete
                      ? "border-deepEmerald bg-deepEmerald text-mistWhite"
                      : "border-sage bg-sage text-charcoal"
                }`}
              >
                {isComplete && !isActive ? <CheckCircle2 size={15} aria-hidden="true" /> : index + 1}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-extrabold">{step.label}</span>
                <span className={`mt-1 hidden text-xs leading-5 lg:block ${isActive ? "text-mistWhite/72" : "text-charcoal/60"}`}>
                  {step.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function EditorForm({
  form,
  editingId,
  saving,
  deleting,
  activeTab,
  selectedType,
  onTabChange,
  onChange,
  onQualityChange,
  onBodyChange,
  onSubmit,
  onReset,
  onUploadCover,
  onUploadMedia,
  onDelete
}) {
  const TypeIcon = selectedType.icon;
  const activeStepIndex = Math.max(editorTabs.findIndex((step) => step.key === activeTab), 0);
  const activeStep = editorTabs[activeStepIndex] || editorTabs[0];
  const completedSteps = editorTabs.slice(0, activeStepIndex).map((step) => step.key);
  const canSubmit = form.title.trim().length >= 2;
  const canMoveForward = activeTab !== "brief" || canSubmit;
  const progress = Math.round(((activeStepIndex + 1) / editorTabs.length) * 100);
  const isFirstStep = activeStepIndex === 0;
  const isLastStep = activeStepIndex === editorTabs.length - 1;

  const goToStep = (key) => {
    if (!canMoveForward && editorTabs.findIndex((step) => step.key === key) > activeStepIndex) return;
    onTabChange(key);
  };

  const goPrevious = () => {
    const previousStep = editorTabs[Math.max(activeStepIndex - 1, 0)];
    onTabChange(previousStep.key);
  };

  const goNext = () => {
    if (!canMoveForward) return;
    const nextStep = editorTabs[Math.min(activeStepIndex + 1, editorTabs.length - 1)];
    onTabChange(nextStep.key);
  };

  return (
    <form onSubmit={onSubmit} className="flex min-h-full flex-col">
      <div className="grid gap-5 border-b border-sage pb-5 xl:grid-cols-[1fr_340px]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status={form.status} />
            <span className="rounded-full border border-sage bg-sage/45 px-3 py-1 text-xs font-bold text-charcoal">
              {wordCount(form.body)} words
            </span>
          </div>
          <h3 className="mt-4 font-serif text-3xl leading-tight">{editingId ? form.title || "Untitled entry" : "New Code asset"}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-charcoal/66">{selectedType.goal}</p>
        </div>
        <div className="rounded border border-sage bg-sage/30 p-4">
          <label className="grid gap-2">
            <span className="text-sm font-bold text-charcoal/76">Type of Resonance</span>
            <select className="input" name="contentType" value={form.contentType} onChange={onChange}>
              {contentTypes.map((type) => (
                <option key={type.value} value={type.value}>{type.section}</option>
              ))}
            </select>
          </label>
          <div className="mt-4 flex items-start gap-3">
            <span className="inline-grid size-10 shrink-0 place-items-center rounded bg-deepEmerald text-mistWhite">
              <TypeIcon size={18} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-extrabold text-charcoal">{selectedType.label}</p>
              <p className="mt-1 text-xs leading-5 text-charcoal/62">{selectedType.readerShift}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded border border-sage bg-mistWhite p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">
              Step {activeStepIndex + 1} of {editorTabs.length}
            </p>
            <h4 className="mt-1 font-serif text-2xl leading-tight">{activeStep.label}</h4>
          </div>
          <span className="rounded-full border border-sage bg-sage/40 px-3 py-1 text-xs font-bold text-charcoal">
            {progress}% complete
          </span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-sage">
          <div className="h-full rounded-full bg-deepEmerald transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[270px_1fr]">
        <StepNavigator activeStep={activeTab} completedSteps={completedSteps} onStepChange={goToStep} />
        <section className="rounded border border-sage bg-mistWhite p-4 shadow-[0_12px_28px_rgba(34,34,34,0.035)] sm:p-5">
          <div className="border-b border-sage pb-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">{activeStep.shortLabel}</p>
            <p className="mt-2 text-sm leading-6 text-charcoal/64">{activeStep.description}</p>
            {!canSubmit && activeTab === "brief" && (
              <p className="mt-3 rounded border border-mutedMint bg-mutedMint/35 px-3 py-2 text-xs font-bold text-charcoal">
                Add a title to continue through the workflow.
              </p>
            )}
          </div>
          <div className="mt-5">
        {activeTab === "brief" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title" wide>
              <input className="input" name="title" value={form.title} onChange={onChange} required />
            </Field>
            <Field label="Workflow Stage">
              <select className="input" name="status" value={form.status} onChange={onChange}>
                {statusWorkflow.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </Field>
            <Field label="Reader Journey">
              <select className="input" name="journeyStage" value={form.journeyStage} onChange={onChange}>
                {journeyStages.map((stage) => (
                  <option key={stage.value} value={stage.value}>{stage.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Audience">
              <input className="input" name="audience" value={form.audience} onChange={onChange} />
            </Field>
            <Field label="Category">
              <input className="input" name="category" value={form.category} onChange={onChange} />
            </Field>
            <Field label="Success Metric">
              <input className="input" name="successMetric" value={form.successMetric} onChange={onChange} />
            </Field>
            <Field label="Primary CTA">
              <input className="input" name="primaryCta" value={form.primaryCta} onChange={onChange} />
            </Field>
            <CoverImagePicker form={form} onUploadCover={onUploadCover} />
          </div>
        )}

        {activeTab === "intent" && (
          <div className="grid gap-5">
            <SectionSpecificFields form={form} onChange={onChange} />
            <div className="grid gap-4 border-t border-sage pt-5 sm:grid-cols-2">
              <Field label="General Proof Points" wide>
                <input className="input" name="proofPoints" value={form.proofPoints} onChange={onChange} placeholder="framework, example, client proof, lived insight" />
              </Field>
            </div>
          </div>
        )}

        {activeTab === "draft" && (
          <div className="grid gap-4">
            <Field label="Excerpt">
              <textarea className="input min-h-24 resize-y" name="excerpt" value={form.excerpt} onChange={onChange} />
            </Field>
            <div className="grid gap-2">
              <span className="text-sm font-bold text-charcoal/76">Body</span>
              <RichTextEditor value={form.body} onChange={onBodyChange} onUploadMedia={onUploadMedia} />
            </div>
          </div>
        )}

        {activeTab === "proof" && (
          <div className="grid gap-5">
            <div className="grid gap-3 sm:grid-cols-2">
              {qualityChecks.map((item) => (
                <label key={item.key} className="flex items-center gap-3 rounded border border-sage bg-sage/25 px-3 py-3 text-sm font-bold">
                  <input
                    type="checkbox"
                    checked={Boolean(form.qualityChecks[item.key])}
                    onChange={() => onQualityChange(item.key)}
                    className="size-4"
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </div>
        )}

        {activeTab === "seo" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="CTA Text">
              <input className="input" name="ctaText" value={form.ctaText} onChange={onChange} placeholder="Read Now" />
            </Field>
            <Field label="CTA URL">
              <input className="input" name="ctaUrl" value={form.ctaUrl} onChange={onChange} placeholder="https://..." />
            </Field>
            <Field label="Tags">
              <input className="input" name="tags" value={form.tags} onChange={onChange} placeholder="trust, identity, positioning" />
            </Field>
            <Field label="Display Order">
              <input className="input" type="number" name="displayOrder" value={form.displayOrder} onChange={onChange} />
            </Field>
            <Field label="Reading Time">
              <input className="input" type="number" name="readingTimeMinutes" value={form.readingTimeMinutes} onChange={onChange} placeholder="7" />
            </Field>
            <Field label="SEO Title">
              <input className="input" name="seoTitle" value={form.seoTitle} onChange={onChange} />
            </Field>
            <Field label="SEO Description" wide>
              <textarea className="input min-h-24 resize-y" name="seoDescription" value={form.seoDescription} onChange={onChange} />
            </Field>
            <label className="flex items-center gap-3 rounded border border-sage bg-sage/35 px-4 py-3 text-sm font-bold sm:col-span-2">
              <input type="checkbox" name="featured" checked={form.featured} onChange={onChange} className="size-4" />
              Feature this entry when the public section connects
            </label>
          </div>
        )}
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 -mx-4 mt-6 flex flex-col-reverse gap-3 border-t border-sage bg-mistWhite/95 px-4 py-4 backdrop-blur sm:-mx-5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex flex-wrap gap-2">
          {editingId && (
            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 size={15} aria-hidden="true" />
              {deleting ? "Deleting..." : "Delete permanently"}
            </button>
          )}
          {editingId && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-2 rounded-full border border-charcoal/15 px-4 py-2 text-sm font-bold text-charcoal transition hover:border-deepEmerald hover:text-deepEmerald"
            >
              <RotateCcw size={15} aria-hidden="true" />
              Clear
            </button>
          )}
        </div>
        <div className="grid gap-2 sm:flex sm:items-center">
          <button
            type="button"
            onClick={goPrevious}
            disabled={isFirstStep}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-sage px-4 py-2 text-sm font-bold text-charcoal transition hover:border-deepEmerald hover:text-deepEmerald disabled:cursor-not-allowed disabled:opacity-45"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Back
          </button>
          {!isLastStep && (
            <button
              type="button"
              onClick={goNext}
              disabled={!canMoveForward}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-charcoal bg-charcoal px-4 py-2 text-sm font-bold text-mistWhite transition hover:border-deepEmerald hover:bg-deepEmerald disabled:cursor-not-allowed disabled:opacity-45"
            >
              Next
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          )}
          <button
            type="submit"
            disabled={saving || deleting || !canSubmit}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-deepEmerald bg-deepEmerald px-5 py-3 text-sm font-bold text-mistWhite transition hover:border-charcoal hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-65"
          >
            <Save size={16} aria-hidden="true" />
            {saving ? "Saving..." : editingId ? "Save changes" : isLastStep ? "Create entry" : "Save draft"}
          </button>
        </div>
      </div>
    </form>
  );
}

function EntryCard({ entry, onOpen, onNext, onFeature, onDelete }) {
  const type = typeFor(entry.contentType);
  const Icon = type.icon;
  const readiness = readinessFor(entry);
  const bodyPreview = entry.excerpt || stripHtml(entry.body) || "No excerpt yet.";

  return (
    <article className="rounded border border-sage bg-mistWhite p-5 shadow-[0_12px_28px_rgba(34,34,34,0.035)] transition hover:border-deepEmerald">
      <button type="button" onClick={onOpen} className="block w-full text-left">
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill status={entry.status} />
          {entry.featured && (
            <span className="rounded-full border border-mutedMint bg-mutedMint/55 px-3 py-1 text-xs font-bold text-charcoal">
              Featured
            </span>
          )}
          <span className="rounded-full border border-sage bg-sage/40 px-3 py-1 text-xs font-bold text-charcoal">
            {readiness}% ready
          </span>
        </div>
        <p className="mt-4 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">
          <Icon size={16} aria-hidden="true" />
          {type.section}
        </p>
        <h2 className="mt-3 font-serif text-3xl leading-tight">{entry.title}</h2>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-charcoal/70">{bodyPreview}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-charcoal/62">
          <span>{type.label}</span>
          <span>{entry.strategicGoal?.journeyStage || "belief_shift"}</span>
          <span>Updated: {formatDate(entry.updatedAt)}</span>
        </div>
      </button>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex items-center justify-center gap-2 rounded border border-sage px-3 py-2 text-xs font-bold text-charcoal transition hover:border-deepEmerald hover:text-deepEmerald"
        >
          <Edit3 size={14} aria-hidden="true" />
          Open
        </button>
        <button
          type="button"
          disabled={entry.status === "ready"}
          onClick={onNext}
          className="inline-flex items-center justify-center gap-2 rounded border border-sage px-3 py-2 text-xs font-bold text-charcoal transition hover:border-deepEmerald hover:text-deepEmerald disabled:cursor-not-allowed disabled:opacity-45"
        >
          <Eye size={14} aria-hidden="true" />
          Next
        </button>
        <button
          type="button"
          onClick={onFeature}
          className="inline-flex items-center justify-center gap-2 rounded border border-sage px-3 py-2 text-xs font-bold text-charcoal transition hover:border-deepEmerald hover:text-deepEmerald"
        >
          <Star size={14} aria-hidden="true" />
          {entry.featured ? "Unpin" : "Feature"}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center justify-center gap-2 rounded border border-red-200 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-50"
        >
          <Trash2 size={14} aria-hidden="true" />
          Delete
        </button>
      </div>
    </article>
  );
}

export default function AdminCodeOfResonancePage() {
  const [entries, setEntries] = useState([]);
  const [summary, setSummary] = useState({ byStatus: [], byType: [], featuredCount: 0, subscriberCount: 0 });
  const [pagination, setPagination] = useState({ total: 0 });
  const [filters, setFilters] = useState({ contentType: "", status: "", search: "" });
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [activeTab, setActiveTab] = useState("brief");
  const [panel, setPanel] = useState(null);
  const [status, setStatus] = useState("loading");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const query = useMemo(
    () => ({
      contentType: filters.contentType || undefined,
      status: filters.status || undefined,
      search: filters.search || undefined,
      limit: 80
    }),
    [filters]
  );

  const readyCount = countFor(summary.byStatus, "ready");
  const inProgressCount = ["idea", "outline", "draft", "review"].reduce(
    (total, item) => total + countFor(summary.byStatus, item),
    0
  );
  const selectedType = typeFor(form.contentType);

  const loadEntries = async () => {
    setStatus("loading");
    setError("");
    try {
      const response = await listCodeOfResonanceEntries(query);
      const items = response.data.items || [];
      setEntries(items.map((entry) => ({ ...entry, status: normalizeWorkflowStatus(entry.status) })));
      setSummary(response.data.summary || { byStatus: [], byType: [], featuredCount: 0, subscriberCount: 0 });
      setPagination(response.data.pagination || { total: 0 });
      setStatus("ready");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not load Code of Resonance entries.");
      setStatus("error");
    }
  };

  useEffect(() => {
    loadEntries();
  }, [query]);

  const changeForm = (event) => {
    const { name, type, value, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const changeQuality = (key) => {
    setForm((current) => ({
      ...current,
      qualityChecks: {
        ...current.qualityChecks,
        [key]: !current.qualityChecks[key]
      }
    }));
  };

  const closePanel = () => setPanel(null);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId("");
    setActiveTab("brief");
  };

  const openNewEntry = (contentType = "trust_resonance") => {
    setForm({ ...emptyForm, contentType });
    setEditingId("");
    setActiveTab("brief");
    setNotice("");
    setPanel("editor");
  };

  const openEntry = (entry) => {
    setEditingId(entry._id);
    setForm(fromEntry(entry));
    setActiveTab("brief");
    setNotice("");
    setPanel("editor");
  };

  const uploadCodeMedia = async (file, options = {}) => {
    setError("");
    try {
      const response = await uploadMediaAsset({
        file,
        folder: "code-of-resonance",
        relatedModel: "CodeOfResonanceEntry",
        ...options
      });
      return response.data.media;
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not upload this media file.");
      throw requestError;
    }
  };

  const uploadCoverImage = async (file) => {
    const media = await uploadCodeMedia(file, {
      altText: form.title,
      usage: "code-cover-image",
      tags: "code-of-resonance,cover"
    });
    setForm((current) => ({
      ...current,
      coverImage: media._id,
      coverImagePreview: media
    }));
    return media;
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const payload = toPayload(form);
      if (editingId) {
        await updateCodeOfResonanceEntry(editingId, payload);
        setNotice("Entry updated.");
      } else {
        await createCodeOfResonanceEntry(payload);
        setNotice("Entry created.");
      }
      resetForm();
      setPanel(null);
      await loadEntries();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not save this entry.");
    } finally {
      setSaving(false);
    }
  };

  const quickUpdate = async (entry, payload) => {
    setError("");
    setNotice("");
    try {
      await updateCodeOfResonanceEntry(entry._id, payload);
      setNotice("Entry updated.");
      await loadEntries();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not update this entry.");
    }
  };

  const deleteEntry = async (entry) => {
    const id = entry?._id || editingId;
    const title = entry?.title || form.title || "this entry";
    if (!id) return;
    if (!window.confirm(`Permanently delete "${title}"? This cannot be undone.`)) return;

    setError("");
    setNotice("");
    setDeleting(true);
    try {
      await deleteCodeOfResonanceEntry(id);
      setNotice("Entry permanently deleted.");
      if (id === editingId) {
        resetForm();
        setPanel(null);
      }
      await loadEntries();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not delete this entry.");
    } finally {
      setDeleting(false);
    }
  };

  const goalCounts = useMemo(
    () =>
      Object.fromEntries(
        contentTypes.map((item) => [
          item.value,
          entries.filter((entry) => entry.contentType === item.value).length
        ])
      ),
    [entries]
  );

  return (
    <section>
      <div className="flex flex-col gap-4 border-b border-sage pb-7 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">Content Operating System</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">The Code of Resonance Dashboard</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-charcoal/65">
            Create each entry through a focused step-by-step workflow, from strategy to draft, proof, and CTA.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openNewEntry()}
          className="inline-flex w-max items-center gap-2 rounded-full border border-deepEmerald bg-deepEmerald px-5 py-3 text-sm font-bold text-mistWhite transition hover:border-charcoal hover:bg-charcoal"
        >
          <Plus size={16} aria-hidden="true" />
          New entry
        </button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Workspace Items" value={pagination.total || 0} detail="All planned Code assets" tone="dark" />
        <StatCard label="In Progress" value={inProgressCount} detail="Idea, outline, draft, or review" />
        <StatCard label="Ready" value={readyCount} detail="Prepared for future publishing" />
        <StatCard label="Featured" value={summary.featuredCount || 0} detail="Pinned for later public sections" />
        <StatCard label="Subscribers" value={summary.subscriberCount || 0} detail="Code newsletter contacts" />
      </div>

      <div className="mt-6">
        <WorkflowStrip entries={entries} />
      </div>

      <div className="mt-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">Goal Architecture</p>
            <h2 className="mt-2 font-serif text-3xl">Choose a section to start a guided entry</h2>
          </div>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {contentTypes.map((item) => (
            <GoalButton
              key={item.value}
              item={item}
              count={goalCounts[item.value] || 0}
              onClick={() => openNewEntry(item.value)}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-3 rounded border border-sage bg-mistWhite p-4 shadow-[0_12px_28px_rgba(34,34,34,0.035)] lg:grid-cols-[1fr_240px_180px]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-deepEmerald" size={18} aria-hidden="true" />
          <input
            className="input pl-10"
            type="search"
            placeholder="Search title, category, tag, goal, or body"
            value={filters.search}
            onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
          />
        </label>
        <select
          className="input"
          value={filters.contentType}
          onChange={(event) => setFilters((current) => ({ ...current, contentType: event.target.value }))}
        >
          <option value="">All sections</option>
          {contentTypes.map((type) => (
            <option key={type.value} value={type.value}>{type.section}</option>
          ))}
        </select>
        <select
          className="input"
          value={filters.status}
          onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
        >
          <option value="">All stages</option>
          {statusWorkflow.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mt-6 flex gap-3 rounded border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="mt-0.5 shrink-0" size={20} aria-hidden="true" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {notice && (
        <div className="mt-6 flex gap-3 rounded border border-mutedMint bg-mutedMint/45 p-4 text-charcoal">
          <CheckCircle2 className="mt-0.5 shrink-0 text-deepEmerald" size={20} aria-hidden="true" />
          <p className="text-sm font-semibold">{notice}</p>
        </div>
      )}

      <div className="mt-8 grid gap-4">
        {status === "loading" && (
          <div className="rounded border border-sage bg-mistWhite p-6 text-sm text-charcoal/65">Loading content...</div>
        )}

        {status !== "loading" && entries.length === 0 && (
          <div className="rounded border border-sage bg-mistWhite p-6 text-sm text-charcoal/65">
            No Code of Resonance entries match this view yet.
          </div>
        )}

        {entries.map((entry) => (
          <EntryCard
            key={entry._id}
            entry={entry}
            onOpen={() => openEntry(entry)}
            onNext={() => quickUpdate(entry, { status: nextStatus(entry.status) })}
            onFeature={() => quickUpdate(entry, { featured: !entry.featured })}
            onDelete={() => deleteEntry(entry)}
          />
        ))}
      </div>

      {panel === "editor" && (
        <EditorModal title={editingId ? "Edit Code Asset" : selectedType.section} eyebrow="Editorial Workspace" onClose={closePanel}>
          <EditorForm
            form={form}
            editingId={editingId}
            saving={saving}
            deleting={deleting}
            activeTab={activeTab}
            selectedType={selectedType}
            onTabChange={setActiveTab}
            onChange={changeForm}
            onQualityChange={changeQuality}
            onBodyChange={(body) => setForm((current) => ({ ...current, body }))}
            onSubmit={submitForm}
            onReset={resetForm}
            onUploadCover={uploadCoverImage}
            onUploadMedia={uploadCodeMedia}
            onDelete={() => deleteEntry()}
          />
        </EditorModal>
      )}
    </section>
  );
}
