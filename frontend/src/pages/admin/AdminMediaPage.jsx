import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clipboard,
  FileText,
  Image,
  Loader2,
  RefreshCcw,
  Save,
  Search,
  Trash2,
  UploadCloud,
  Video
} from "lucide-react";
import { deleteMediaAsset, listMediaAssets, updateMediaAsset, uploadMediaAsset } from "../../services/api.js";
import { imageUrl } from "../../utils/cloudinaryImage.js";

const resourceFilters = [
  { value: "", label: "All" },
  { value: "image", label: "Images" },
  { value: "video", label: "Videos" },
  { value: "raw", label: "Files" }
];

const usageOptions = [
  { value: "about-brand", label: "About brand logo" },
  { value: "about-event", label: "About event / invitation" },
  { value: "home-hero", label: "Home hero" },
  { value: "home-problem", label: "Home problem section" },
  { value: "earned-credibility-hero", label: "Earned Credibility hero" },
  { value: "email", label: "Email" },
  { value: "code-entry", label: "Code of Resonance entry" }
];

const emptyUpload = {
  file: null,
  altText: "",
  folder: "earned-credibility/admin",
  usage: "",
  tags: ""
};

const formatBytes = (bytes = 0) => {
  const value = Number(bytes || 0);
  if (!value) return "0 KB";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
  return `${(value / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

const mediaIconFor = (asset) => {
  if (asset.resourceType === "video") return Video;
  if (asset.resourceType === "image") return Image;
  return FileText;
};

function MediaPreview({ asset }) {
  const src = imageUrl(asset, asset.thumbnailUrl || asset.secureUrl);

  if (asset.resourceType === "image" && src) {
    return (
      <img
        src={src}
        alt={asset.altText || asset.displayName || asset.originalFilename || ""}
        className="aspect-[4/3] w-full bg-sage object-cover"
        loading="lazy"
      />
    );
  }

  const Icon = mediaIconFor(asset);
  return (
    <div className="grid aspect-[4/3] w-full place-items-center bg-sage text-deepEmerald">
      <Icon size={34} aria-hidden="true" />
    </div>
  );
}

function MediaCard({ asset, active, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(asset)}
      className={`overflow-hidden rounded border bg-white text-left transition ${
        active ? "border-deepEmerald shadow-[0_16px_34px_rgba(15,77,62,0.12)]" : "border-sage hover:border-deepEmerald/40"
      }`}
    >
      <MediaPreview asset={asset} />
      <div className="p-3">
        <p className="line-clamp-1 text-sm font-extrabold text-charcoal">
          {asset.displayName || asset.originalFilename || "Media asset"}
        </p>
        <p className="mt-1 text-xs text-charcoal/55">
          {[asset.format?.toUpperCase(), formatBytes(asset.bytes)].filter(Boolean).join(" · ")}
        </p>
      </div>
    </button>
  );
}

export default function AdminMediaPage() {
  const [assets, setAssets] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [resourceType, setResourceType] = useState("");
  const [tag, setTag] = useState("");
  const [usage, setUsage] = useState("");
  const [selected, setSelected] = useState(null);
  const [editForm, setEditForm] = useState({ displayName: "", altText: "", usage: "", tags: "" });
  const [uploadForm, setUploadForm] = useState(emptyUpload);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const params = useMemo(
    () => ({
      limit: 48,
      ...(resourceType ? { resourceType } : {}),
      ...(tag.trim() ? { tag: tag.trim() } : {}),
      ...(usage.trim() ? { usage: usage.trim() } : {})
    }),
    [resourceType, tag, usage]
  );

  const loadAssets = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await listMediaAssets(params);
      const items = response.data.items || [];
      setAssets(items);
      setPagination(response.data.pagination || null);
      setSelected((current) => {
        if (!current) return items[0] || null;
        return items.find((item) => item._id === current._id) || items[0] || null;
      });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not load media assets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    setEditForm({
      displayName: selected?.displayName || "",
      altText: selected?.altText || "",
      usage: selected?.context?.usage || "",
      tags: (selected?.tags || []).join(", ")
    });
  }, [selected]);

  const uploadAsset = async (event) => {
    event.preventDefault();
    if (!uploadForm.file) return;

    setUploading(true);
    setError("");
    setMessage("");

    try {
      const response = await uploadMediaAsset({
        file: uploadForm.file,
        folder: uploadForm.folder,
        altText: uploadForm.altText,
        usage: uploadForm.usage,
        tags: uploadForm.tags
      });
      setMessage("Media uploaded and optimized.");
      setUploadForm(emptyUpload);
      setSelected(response.data.media);
      await loadAssets();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not upload media.");
    } finally {
      setUploading(false);
    }
  };

  const saveAsset = async (event) => {
    event.preventDefault();
    if (!selected?._id) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await updateMediaAsset(selected._id, {
        displayName: editForm.displayName,
        altText: editForm.altText,
        tags: editForm.tags
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        context: {
          ...(selected.context || {}),
          usage: editForm.usage
        }
      });
      setSelected(response.data.media);
      setAssets((current) => current.map((asset) => (asset._id === response.data.media._id ? response.data.media : asset)));
      setMessage("Media asset updated.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not update media.");
    } finally {
      setSaving(false);
    }
  };

  const removeAsset = async () => {
    if (!selected?._id) return;
    const confirmed = window.confirm("Hard delete this media asset from Cloudinary and the dashboard?");
    if (!confirmed) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      await deleteMediaAsset(selected._id);
      setMessage("Media asset deleted.");
      setSelected(null);
      await loadAssets();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not delete media.");
    } finally {
      setSaving(false);
    }
  };

  const copyUrl = async () => {
    const url = imageUrl(selected, selected?.secureUrl);
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setMessage("Optimized media URL copied.");
  };

  return (
    <section>
      <datalist id="media-usage-options">
        {usageOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </datalist>

      <div className="flex flex-col gap-5 border-b border-sage pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">Media Library</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-charcoal sm:text-5xl">Images, Video, and Files</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-charcoal/65">
            Upload optimized assets, manage alt text, and copy URLs for pages, emails, and Code of Resonance entries.
          </p>
        </div>
        <button
          type="button"
          onClick={loadAssets}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-charcoal bg-charcoal px-5 py-3 text-sm font-bold text-mutedMint transition hover:bg-deepEmerald hover:text-mistWhite"
        >
          <RefreshCcw size={16} aria-hidden="true" />
          Refresh
        </button>
      </div>

      {(message || error) && (
        <div className={`mt-6 flex gap-3 rounded border p-4 text-sm ${error ? "border-red-200 bg-red-50 text-red-700" : "border-deepEmerald/20 bg-mutedMint text-deepEmerald"}`}>
          {error ? <AlertCircle className="mt-0.5 shrink-0" size={18} aria-hidden="true" /> : <CheckCircle2 className="mt-0.5 shrink-0" size={18} aria-hidden="true" />}
          <p>{error || message}</p>
        </div>
      )}

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="grid gap-5">
          <form onSubmit={uploadAsset} className="grid gap-4 rounded border border-sage bg-white p-4 shadow-[0_16px_34px_rgba(26,26,26,0.045)] lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
            <label className="grid gap-2 lg:col-span-2">
              <span className="text-sm font-extrabold text-charcoal">Upload file</span>
              <input
                className="input bg-mistWhite"
                type="file"
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={(event) => setUploadForm((current) => ({ ...current, file: event.target.files?.[0] || null }))}
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-extrabold text-charcoal">Alt text</span>
              <input
                className="input bg-mistWhite"
                value={uploadForm.altText}
                onChange={(event) => setUploadForm((current) => ({ ...current, altText: event.target.value }))}
                placeholder="Describe the asset"
              />
            </label>
            <button
              type="submit"
              disabled={!uploadForm.file || uploading}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-deepEmerald px-5 py-3 text-sm font-extrabold text-mistWhite transition hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? <Loader2 className="animate-spin" size={16} aria-hidden="true" /> : <UploadCloud size={16} aria-hidden="true" />}
              {uploading ? "Uploading..." : "Upload"}
            </button>
            <label className="grid gap-2">
              <span className="text-sm font-extrabold text-charcoal">Folder</span>
              <input
                className="input bg-mistWhite"
                value={uploadForm.folder}
                onChange={(event) => setUploadForm((current) => ({ ...current, folder: event.target.value }))}
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-extrabold text-charcoal">Usage</span>
              <input
                className="input bg-mistWhite"
                list="media-usage-options"
                value={uploadForm.usage}
                onChange={(event) => setUploadForm((current) => ({ ...current, usage: event.target.value }))}
                placeholder="home-problem, about-brand, email"
              />
              <span className="text-xs leading-5 text-charcoal/52">Use home-problem for the homepage problem image, earned-credibility-hero for the Intensive hero, about-brand for logos, and about-event for invited events.</span>
            </label>
            <label className="grid gap-2 lg:col-span-2">
              <span className="text-sm font-extrabold text-charcoal">Tags</span>
              <input
                className="input bg-mistWhite"
                value={uploadForm.tags}
                onChange={(event) => setUploadForm((current) => ({ ...current, tags: event.target.value }))}
                placeholder="credibility, founder, email"
              />
            </label>
          </form>

          <div className="grid gap-4 rounded border border-sage bg-white p-4 shadow-[0_16px_34px_rgba(26,26,26,0.045)] lg:grid-cols-[1fr_220px_220px] lg:items-center">
            <div className="flex flex-wrap gap-2">
              {resourceFilters.map((filter) => (
                <button
                  key={filter.value || "all"}
                  type="button"
                  onClick={() => setResourceType(filter.value)}
                  className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                    resourceType === filter.value
                      ? "border-charcoal bg-charcoal text-mutedMint"
                      : "border-sage bg-mistWhite text-charcoal/72 hover:border-deepEmerald hover:text-deepEmerald"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <label className="relative block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/42" size={17} aria-hidden="true" />
              <input className="input bg-mistWhite pl-10" value={tag} onChange={(event) => setTag(event.target.value)} placeholder="Filter tag" />
            </label>
            <label className="relative block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/42" size={17} aria-hidden="true" />
              <input className="input bg-mistWhite pl-10" list="media-usage-options" value={usage} onChange={(event) => setUsage(event.target.value)} placeholder="Filter usage" />
            </label>
          </div>

          {loading ? (
            <div className="grid min-h-[260px] place-items-center rounded border border-sage bg-white text-sm font-bold text-deepEmerald">
              Loading media...
            </div>
          ) : assets.length === 0 ? (
            <div className="rounded border border-sage bg-white p-8 text-center shadow-[0_16px_34px_rgba(26,26,26,0.045)]">
              <UploadCloud className="mx-auto text-deepEmerald" size={34} aria-hidden="true" />
              <h2 className="mt-4 font-serif text-3xl">No media yet.</h2>
              <p className="mt-2 text-sm text-charcoal/60">Uploaded assets will appear here after Cloudinary optimization.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {assets.map((asset) => (
                <MediaCard key={asset._id} asset={asset} active={selected?._id === asset._id} onSelect={setSelected} />
              ))}
            </div>
          )}

          {pagination && (
            <p className="text-sm text-charcoal/55">
              Showing {assets.length} of {pagination.total || assets.length} assets.
            </p>
          )}
        </div>

        <aside className="rounded border border-sage bg-mistWhite p-4 shadow-[0_16px_34px_rgba(26,26,26,0.045)] xl:sticky xl:top-8">
          {selected ? (
            <form onSubmit={saveAsset} className="grid gap-4">
              <MediaPreview asset={selected} />
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-deepEmerald">Selected Asset</p>
                <h2 className="mt-2 break-words font-serif text-2xl leading-tight text-charcoal">
                  {selected.displayName || selected.originalFilename || "Media asset"}
                </h2>
                <p className="mt-2 text-xs text-charcoal/55">
                  {[selected.resourceType, selected.format, `${selected.width || "-"} x ${selected.height || "-"}`, formatBytes(selected.bytes)]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
              <label className="grid gap-2">
                <span className="text-sm font-extrabold text-charcoal">Display name</span>
                <input className="input bg-white" value={editForm.displayName} onChange={(event) => setEditForm((current) => ({ ...current, displayName: event.target.value }))} />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-extrabold text-charcoal">Alt text</span>
                <input className="input bg-white" value={editForm.altText} onChange={(event) => setEditForm((current) => ({ ...current, altText: event.target.value }))} />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-extrabold text-charcoal">Usage</span>
                <input className="input bg-white" list="media-usage-options" value={editForm.usage} onChange={(event) => setEditForm((current) => ({ ...current, usage: event.target.value }))} />
                <span className="text-xs leading-5 text-charcoal/52">Website images: home-problem, home-hero, earned-credibility-hero, about-brand, or about-event.</span>
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-extrabold text-charcoal">Tags</span>
                <input className="input bg-white" value={editForm.tags} onChange={(event) => setEditForm((current) => ({ ...current, tags: event.target.value }))} />
              </label>
              <div className="grid gap-2">
                <button type="button" onClick={copyUrl} className="inline-flex items-center justify-center gap-2 rounded-full border border-sage bg-white px-4 py-2.5 text-sm font-bold text-charcoal transition hover:border-deepEmerald hover:text-deepEmerald">
                  <Clipboard size={16} aria-hidden="true" />
                  Copy optimized URL
                </button>
                <a href={imageUrl(selected, selected.secureUrl)} target="_blank" rel="noreferrer" className="text-center text-sm font-bold text-deepEmerald underline-offset-4 hover:underline">
                  Open original asset
                </a>
              </div>
              <div className="grid gap-2 border-t border-sage pt-4 sm:grid-cols-2">
                <button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-full bg-deepEmerald px-4 py-2.5 text-sm font-extrabold text-mistWhite transition hover:bg-charcoal disabled:opacity-60">
                  {saving ? <Loader2 className="animate-spin" size={16} aria-hidden="true" /> : <Save size={16} aria-hidden="true" />}
                  Save
                </button>
                <button type="button" onClick={removeAsset} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-extrabold text-red-700 transition hover:border-red-300 disabled:opacity-60">
                  <Trash2 size={16} aria-hidden="true" />
                  Delete
                </button>
              </div>
            </form>
          ) : (
            <div className="grid min-h-[280px] place-items-center text-center">
              <div>
                <Image className="mx-auto text-deepEmerald" size={34} aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold text-charcoal/60">Select an asset to edit details.</p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
