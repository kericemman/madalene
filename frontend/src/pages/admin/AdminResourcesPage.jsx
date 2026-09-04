import { Mark, mergeAttributes } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BookMarked,
  Bold,
  CheckCircle2,
  EyeOff,
  FileText,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Plus,
  Quote,
  Redo2,
  RefreshCcw,
  Save,
  Search,
  Undo2
} from "lucide-react";
import {
  createAdminResource,
  listAdminOffers,
  listAdminResources,
  listMediaAssets,
  updateAdminResource
} from "../../services/api.js";
import { imageUrl } from "../../utils/cloudinaryImage.js";

const oneToOneBookingUrl =
  import.meta.env.VITE_ONE_TO_ONE_BOOKING_URL ||
  "https://calendly.com/wambui-magdalene/content-that-connects";

const resourceTypes = [
  "pdf_guide",
  "workbook",
  "checklist",
  "playbook",
  "blueprint",
  "reading_list",
  "video",
  "audio",
  "external_article",
  "template",
  "email_resource"
];

const gapCategories = [
  ["", "No specific gap"],
  ["story", "Story"],
  ["trust", "Trust"],
  ["positioning", "Positioning"],
  ["proof", "Proof"],
  ["resonance", "Resonance"]
];

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

const emptyResource = {
  title: "",
  slug: "",
  description: "",
  resourceType: "workbook",
  coverImage: "",
  fileUrl: "",
  externalUrl: "",
  price: 0,
  free: true,
  emailGated: true,
  category: "Earned Credibility",
  relatedAssessmentScoreRange: "",
  relatedWeakestCategory: "",
  relatedOffer: "",
  emailDelivery: {
    subject: "",
    preheader: "",
    title: "",
    intro: "",
    bodyHtml: "",
    text: "",
    ctaText: "Book a 1:1 Call",
    ctaUrl: oneToOneBookingUrl
  },
  active: true
};

const normalizeId = (value) => value?._id || value || "";

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const htmlToPlainText = (value = "") =>
  String(value)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|h[1-6]|li|blockquote)>/gi, "\n")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();

const prepareResource = (resource = {}) => ({
  ...emptyResource,
  ...resource,
  coverImage: normalizeId(resource.coverImage),
  relatedOffer: normalizeId(resource.relatedOffer),
  emailDelivery: {
    ...emptyResource.emailDelivery,
    ...(resource.emailDelivery || {})
  }
});

const compactPayload = (form) => {
  const payload = {
    title: form.title.trim(),
    description: form.description.trim(),
    resourceType: form.resourceType,
    fileUrl: form.fileUrl.trim(),
    externalUrl: form.externalUrl.trim(),
    price: Number(form.price || 0),
    free: Boolean(form.free),
    emailGated: Boolean(form.emailGated),
    category: form.category.trim(),
    relatedAssessmentScoreRange: form.relatedAssessmentScoreRange.trim(),
    relatedWeakestCategory: form.relatedWeakestCategory.trim(),
    active: Boolean(form.active),
    emailDelivery: {
      subject: form.emailDelivery.subject.trim(),
      preheader: form.emailDelivery.preheader.trim(),
      title: form.emailDelivery.title.trim(),
      intro: form.emailDelivery.intro.trim(),
      bodyHtml: form.emailDelivery.bodyHtml,
      text: form.emailDelivery.text.trim() || htmlToPlainText(form.emailDelivery.bodyHtml),
      ctaText: form.emailDelivery.ctaText.trim(),
      ctaUrl: form.emailDelivery.ctaUrl.trim()
    }
  };

  const slug = form.slug.trim();
  if (slug) payload.slug = slug;
  if (form.coverImage) payload.coverImage = form.coverImage;
  if (form.relatedOffer) payload.relatedOffer = form.relatedOffer;

  return payload;
};

const selectedAsset = (assets, id) => assets.find((asset) => asset._id === id) || null;

function StatusPill({ active }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${active ? "bg-mutedMint text-deepEmerald" : "bg-sage text-charcoal/55"}`}>
      {active ? "Active" : "Hidden"}
    </span>
  );
}

function Field({ label, children, className = "", helper }) {
  return (
    <label className={`grid gap-2 ${className}`}>
      <span className="text-sm font-extrabold text-charcoal">{label}</span>
      {children}
      {helper && <span className="text-xs leading-5 text-charcoal/55">{helper}</span>}
    </label>
  );
}

function EditorButton({ label, active = false, onClick, children }) {
  return (
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
      {children}
    </button>
  );
}

function ResourceBodyEditor({ value, onChange }) {
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, LinkMark],
    content: value || "<p></p>",
    editorProps: {
      attributes: {
        class: "ProseMirror min-h-[360px] max-w-none p-4 font-serif text-lg leading-8 text-charcoal focus:outline-none sm:p-6"
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
    return <div className="min-h-[420px] animate-pulse rounded border border-sage bg-sage/20" />;
  }

  const insertLink = () => {
    const href = linkUrl.trim();
    if (!href) return;
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, " ").trim();
    editor
      .chain()
      .focus()
      .insertContent(
        `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(selectedText || href)}</a>`
      )
      .run();
    setLinkUrl("");
    setShowLinkInput(false);
  };

  return (
    <div className="tiptap-editor overflow-hidden rounded border border-sage bg-mistWhite shadow-[0_16px_34px_rgba(26,26,26,0.045)]">
      <div className="flex flex-wrap gap-2 border-b border-sage bg-sage/35 p-2">
        <EditorButton
          label="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 size={16} aria-hidden="true" />
        </EditorButton>
        <EditorButton
          label="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 size={16} aria-hidden="true" />
        </EditorButton>
        <EditorButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={16} aria-hidden="true" />
        </EditorButton>
        <EditorButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={16} aria-hidden="true" />
        </EditorButton>
        <EditorButton
          label="Bulleted list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={16} aria-hidden="true" />
        </EditorButton>
        <EditorButton
          label="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={16} aria-hidden="true" />
        </EditorButton>
        <EditorButton label="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote size={16} aria-hidden="true" />
        </EditorButton>
        <EditorButton label="Add link" active={showLinkInput} onClick={() => setShowLinkInput((current) => !current)}>
          <Link2 size={16} aria-hidden="true" />
        </EditorButton>
        <EditorButton label="Undo" onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 size={16} aria-hidden="true" />
        </EditorButton>
        <EditorButton label="Redo" onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 size={16} aria-hidden="true" />
        </EditorButton>
      </div>

      {showLinkInput && (
        <div className="flex gap-2 border-b border-sage bg-mistWhite p-2">
          <input
            className="input min-w-0 bg-white"
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
            placeholder="Paste link URL"
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

      <EditorContent editor={editor} className="max-h-[520px] overflow-y-auto bg-white" />
    </div>
  );
}

export default function AdminResourcesPage() {
  const [resources, setResources] = useState([]);
  const [offers, setOffers] = useState([]);
  const [assets, setAssets] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState(emptyResource);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const filteredResources = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return resources;
    return resources.filter((resource) =>
      [resource.title, resource.slug, resource.description, resource.resourceType, resource.relatedWeakestCategory]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [resources, search]);

  const previewAsset = selectedAsset(assets, form.coverImage);

  const loadResources = async (nextSelectedId = selectedId) => {
    setLoading(true);
    setError("");
    try {
      const [resourcesResponse, offersResponse, assetsResponse] = await Promise.all([
        listAdminResources({ limit: 100 }),
        listAdminOffers({ limit: 100 }),
        listMediaAssets({ limit: 100, resourceType: "image" })
      ]);
      const items = resourcesResponse.data.items || [];
      setResources(items);
      setOffers(offersResponse.data.items || []);
      setAssets(assetsResponse.data.items || []);

      const selectedResource = items.find((resource) => resource._id === nextSelectedId) || items[0];
      if (selectedResource) {
        setSelectedId(selectedResource._id);
        setForm(prepareResource(selectedResource));
      } else {
        setSelectedId("");
        setForm(emptyResource);
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not load resources.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectResource = (resource) => {
    setSelectedId(resource._id);
    setForm(prepareResource(resource));
    setNotice("");
    setError("");
  };

  const startNewResource = () => {
    setSelectedId("");
    setForm(emptyResource);
    setNotice("");
    setError("");
  };

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateEmailField = (field, value) => {
    setForm((current) => ({
      ...current,
      emailDelivery: {
        ...current.emailDelivery,
        [field]: value
      }
    }));
  };

  const saveResource = async (event) => {
    event.preventDefault();
    setSaving(true);
    setNotice("");
    setError("");

    try {
      const payload = compactPayload(form);
      const response = selectedId
        ? await updateAdminResource(selectedId, payload)
        : await createAdminResource(payload);
      const savedResource = response.data.item || response.data.resource || response.data;
      await loadResources(savedResource._id);
      setNotice(selectedId ? "Resource updated." : "Resource created.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not save resource.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <div className="flex flex-col gap-5 border-b border-sage pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">Assessment Library</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-charcoal sm:text-5xl">Resources</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-charcoal/65">
            Store the private workbooks, checklists, and playbooks that appear only after the assessment recommends them.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={startNewResource}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-deepEmerald bg-deepEmerald px-5 py-3 text-sm font-bold text-mistWhite transition hover:bg-charcoal"
          >
            <Plus size={16} aria-hidden="true" />
            New resource
          </button>
          <button
            type="button"
            onClick={() => loadResources(selectedId)}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-charcoal bg-charcoal px-5 py-3 text-sm font-bold text-mutedMint transition hover:bg-deepEmerald hover:text-mistWhite"
          >
            <RefreshCcw size={16} aria-hidden="true" />
            Refresh
          </button>
        </div>
      </div>

      {(notice || error) && (
        <div
          className={`mt-6 flex gap-3 rounded border p-4 text-sm ${
            error ? "border-red-200 bg-red-50 text-red-700" : "border-deepEmerald/20 bg-mutedMint text-deepEmerald"
          }`}
        >
          {error ? <AlertCircle size={18} aria-hidden="true" /> : <CheckCircle2 size={18} aria-hidden="true" />}
          <p>{error || notice}</p>
        </div>
      )}

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.76fr_1.24fr]">
        <div className="rounded border border-sage bg-white p-4 shadow-[0_16px_34px_rgba(26,26,26,0.045)]">
          <label className="relative block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/42" size={17} aria-hidden="true" />
            <input
              className="input bg-mistWhite pl-10"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search resources"
            />
          </label>

          <div className="mt-5 grid max-h-[760px] gap-3 overflow-y-auto pr-1">
            {loading ? (
              <div className="grid min-h-[240px] place-items-center text-sm font-bold text-deepEmerald">
                Loading resources...
              </div>
            ) : filteredResources.length ? (
              filteredResources.map((resource) => (
                <button
                  key={resource._id}
                  type="button"
                  onClick={() => selectResource(resource)}
                  className={`rounded border p-4 text-left transition ${
                    selectedId === resource._id
                      ? "border-deepEmerald bg-mutedMint/60"
                      : "border-sage bg-mistWhite hover:border-deepEmerald/35 hover:bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-extrabold text-charcoal">{resource.title}</p>
                      <p className="mt-1 truncate text-xs text-charcoal/55">/resources/{resource.slug}</p>
                    </div>
                    <StatusPill active={resource.active !== false} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-deepEmerald">
                      {resource.resourceType}
                    </span>
                    {(resource.relatedWeakestCategory || resource.relatedAssessmentScoreRange) && (
                      <span className="rounded-full border border-sage bg-white px-3 py-1 text-xs font-bold text-charcoal/60">
                        {resource.relatedWeakestCategory || resource.relatedAssessmentScoreRange}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-charcoal/60">{resource.description}</p>
                </button>
              ))
            ) : (
              <div className="border border-sage bg-mistWhite p-8 text-center text-sm text-charcoal/60">
                No resources found.
              </div>
            )}
          </div>
        </div>

        <form onSubmit={saveResource} className="rounded border border-sage bg-white p-5 shadow-[0_16px_34px_rgba(26,26,26,0.045)]">
          <div className="flex flex-col gap-4 border-b border-sage pb-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">
                <BookMarked size={17} aria-hidden="true" />
                {selectedId ? "Edit Resource" : "Create Resource"}
              </div>
              <h2 className="mt-3 font-serif text-4xl leading-tight text-charcoal">
                {form.title || "Private resource setup"}
              </h2>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-deepEmerald px-5 py-3 text-sm font-extrabold text-mistWhite transition hover:bg-charcoal disabled:opacity-60"
            >
              {saving ? <Loader2 className="animate-spin" size={16} aria-hidden="true" /> : <Save size={16} aria-hidden="true" />}
              {saving ? "Saving..." : "Save resource"}
            </button>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Field label="Title">
              <input
                className="input bg-mistWhite"
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                required
              />
            </Field>
            <Field label="Slug" helper="Leave blank when creating a new resource to auto-generate it.">
              <input
                className="input bg-mistWhite"
                value={form.slug}
                onChange={(event) => updateField("slug", event.target.value)}
                placeholder="story-clarity-workbook"
              />
            </Field>
            <Field label="Resource type">
              <select
                className="input bg-mistWhite"
                value={form.resourceType}
                onChange={(event) => updateField("resourceType", event.target.value)}
                required
              >
                {resourceTypes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Assessment gap">
              <select
                className="input bg-mistWhite"
                value={form.relatedWeakestCategory}
                onChange={(event) => updateField("relatedWeakestCategory", event.target.value)}
              >
                {gapCategories.map(([value, label]) => (
                  <option key={value || "none"} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Category">
              <input
                className="input bg-mistWhite"
                value={form.category}
                onChange={(event) => updateField("category", event.target.value)}
              />
            </Field>
            <Field label="Score range">
              <input
                className="input bg-mistWhite"
                value={form.relatedAssessmentScoreRange}
                onChange={(event) => updateField("relatedAssessmentScoreRange", event.target.value)}
                placeholder="Trusted Choice™"
              />
            </Field>
            <Field label="Cover image">
              <select
                className="input bg-mistWhite"
                value={form.coverImage}
                onChange={(event) => updateField("coverImage", event.target.value)}
              >
                <option value="">No cover image</option>
                {assets.map((asset) => (
                  <option key={asset._id} value={asset._id}>
                    {asset.displayName || asset.altText || asset.originalFilename || asset.publicId}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Related offer">
              <select
                className="input bg-mistWhite"
                value={form.relatedOffer}
                onChange={(event) => updateField("relatedOffer", event.target.value)}
              >
                <option value="">No related offer</option>
                {offers.map((offer) => (
                  <option key={offer._id} value={offer._id}>
                    {offer.name}
                  </option>
                ))}
              </select>
            </Field>
            {previewAsset && (
              <div className="lg:col-span-2">
                <img
                  src={imageUrl(previewAsset)}
                  alt={previewAsset.altText || previewAsset.displayName || ""}
                  className="h-40 w-full rounded border border-sage object-cover"
                />
              </div>
            )}
            <Field label="Description" className="lg:col-span-2">
              <textarea
                className="input min-h-24 bg-mistWhite"
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
              />
            </Field>
          </div>

          <div className="mt-7 border-t border-sage pt-6">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">
              <FileText size={16} aria-hidden="true" />
              Reader Content
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <Field label="Reader title">
                <input
                  className="input bg-mistWhite"
                  value={form.emailDelivery.title}
                  onChange={(event) => updateEmailField("title", event.target.value)}
                />
              </Field>
              <Field label="Email subject">
                <input
                  className="input bg-mistWhite"
                  value={form.emailDelivery.subject}
                  onChange={(event) => updateEmailField("subject", event.target.value)}
                />
              </Field>
              <Field label="Intro" className="lg:col-span-2">
                <textarea
                  className="input min-h-24 bg-mistWhite"
                  value={form.emailDelivery.intro}
                  onChange={(event) => updateEmailField("intro", event.target.value)}
                />
              </Field>
              <div className="grid gap-2 lg:col-span-2">
                <p className="text-sm font-extrabold text-charcoal">Resource content</p>
                <ResourceBodyEditor
                  value={form.emailDelivery.bodyHtml}
                  onChange={(nextValue) => updateEmailField("bodyHtml", nextValue)}
                />
                <p className="text-xs leading-5 text-charcoal/55">
                  Write the actual workbook, checklist, guide, or playbook here. This is the private reader content sent after the assessment recommends it.
                </p>
              </div>
              <Field label="Plain text fallback" className="lg:col-span-2" helper="Optional. If you leave this blank, the system derives a plain-text version from the resource content when saving.">
                <textarea
                  className="input min-h-36 bg-mistWhite"
                  value={form.emailDelivery.text}
                  onChange={(event) => updateEmailField("text", event.target.value)}
                />
              </Field>
              <Field label="Email preheader">
                <input
                  className="input bg-mistWhite"
                  value={form.emailDelivery.preheader}
                  onChange={(event) => updateEmailField("preheader", event.target.value)}
                />
              </Field>
              <Field label="CTA text">
                <input
                  className="input bg-mistWhite"
                  value={form.emailDelivery.ctaText}
                  onChange={(event) => updateEmailField("ctaText", event.target.value)}
                />
              </Field>
              <Field label="CTA URL">
                <input
                  className="input bg-mistWhite"
                  value={form.emailDelivery.ctaUrl}
                  onChange={(event) => updateEmailField("ctaUrl", event.target.value)}
                />
              </Field>
              <Field label="External or file URL">
                <input
                  className="input bg-mistWhite"
                  value={form.externalUrl || form.fileUrl}
                  onChange={(event) => {
                    updateField("externalUrl", event.target.value);
                    updateField("fileUrl", "");
                  }}
                  placeholder="Optional"
                />
              </Field>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 border-t border-sage pt-5">
            {[
              ["active", "Active"],
              ["free", "Free"],
              ["emailGated", "Hidden until recommended"]
            ].map(([field, label]) => (
              <label key={field} className="inline-flex min-h-11 items-center gap-2 text-sm font-extrabold text-charcoal">
                <input
                  type="checkbox"
                  className="accent-deepEmerald"
                  checked={Boolean(form[field])}
                  onChange={(event) => updateField(field, event.target.checked)}
                />
                {label}
              </label>
            ))}
            <div className="inline-flex min-h-11 items-center gap-2 rounded-full bg-sage/55 px-4 text-xs font-bold text-charcoal/62">
              <EyeOff size={15} aria-hidden="true" />
              Public page still requires an assessment token.
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
