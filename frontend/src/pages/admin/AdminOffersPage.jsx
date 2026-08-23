import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Plus, RefreshCcw, Save, Search, SlidersHorizontal } from "lucide-react";
import { createAdminOffer, listAdminOffers, updateAdminOffer } from "../../services/api.js";

const emptyOffer = {
  name: "",
  slug: "",
  shortDescription: "",
  fullDescription: "",
  price: 0,
  currency: "USD",
  offerType: "audit",
  deliveryMethod: "",
  features: "",
  outcomes: "",
  idealClient: "",
  ctaText: "",
  ctaType: "application",
  ctaUrl: "",
  checkoutEnabled: false,
  bookingEnabled: false,
  applicationRequired: true,
  externalBookingUrl: "",
  active: true,
  displayOrder: 0,
  featured: false,
  relatedEmailSequenceKey: ""
};

const offerTypes = [
  "free",
  "digital_product",
  "audit",
  "one_time_session",
  "intensive",
  "consulting_package",
  "application_only"
];

const ctaTypes = ["checkout", "booking", "application", "external_url", "download"];

const toMultiline = (items = []) => (Array.isArray(items) ? items.join("\n") : items || "");
const fromMultiline = (value = "") =>
  String(value)
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const formatPrice = (offer) => {
  const price = Number(offer.price || 0);
  if (!price) return "No price set";
  return `${offer.currency || "USD"} ${price.toLocaleString()}`;
};

const prepareOffer = (offer) => ({
  ...emptyOffer,
  ...offer,
  features: toMultiline(offer.features),
  outcomes: toMultiline(offer.outcomes)
});

const payloadFromForm = (form) => ({
  ...form,
  price: Number(form.price || 0),
  displayOrder: Number(form.displayOrder || 0),
  features: fromMultiline(form.features),
  outcomes: fromMultiline(form.outcomes)
});

export default function AdminOffersPage() {
  const [offers, setOffers] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState(emptyOffer);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const filteredOffers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return offers;
    return offers.filter((offer) =>
      [offer.name, offer.slug, offer.offerType, offer.shortDescription].some((value) =>
        String(value || "").toLowerCase().includes(term)
      )
    );
  }, [offers, search]);

  const loadOffers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await listAdminOffers({ limit: 100 });
      const items = response.data.items || [];
      setOffers(items);
      if (!selectedId && items[0]?._id) {
        setSelectedId(items[0]._id);
        setForm(prepareOffer(items[0]));
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not load offers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectOffer = (offer) => {
    setSelectedId(offer._id);
    setForm(prepareOffer(offer));
    setNotice("");
    setError("");
  };

  const startNewOffer = () => {
    setSelectedId("");
    setForm(emptyOffer);
    setNotice("");
    setError("");
  };

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const saveOffer = async (event) => {
    event.preventDefault();
    setSaving(true);
    setNotice("");
    setError("");

    try {
      const payload = payloadFromForm(form);
      const response = selectedId
        ? await updateAdminOffer(selectedId, payload)
        : await createAdminOffer(payload);
      const savedOffer = response.data.item || response.data.offer || response.data;
      setOffers((current) => {
        const exists = current.some((offer) => offer._id === savedOffer._id);
        return exists
          ? current.map((offer) => (offer._id === savedOffer._id ? savedOffer : offer))
          : [savedOffer, ...current];
      });
      setSelectedId(savedOffer._id);
      setForm(prepareOffer(savedOffer));
      setNotice(selectedId ? "Offer updated." : "Offer created.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not save offer.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <div className="flex flex-col gap-5 border-b border-sage pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">Commercial System</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-charcoal sm:text-5xl">Offers</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-charcoal/65">
            Manage the four service paths, their CTAs, and the way each offer routes into application, booking, or checkout.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={startNewOffer}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-deepEmerald bg-deepEmerald px-5 py-3 text-sm font-bold text-mistWhite transition hover:bg-charcoal"
          >
            <Plus size={16} aria-hidden="true" />
            New offer
          </button>
          <button
            type="button"
            onClick={loadOffers}
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

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        <div className="rounded border border-sage bg-white p-4 shadow-[0_16px_34px_rgba(34,34,34,0.045)]">
          <label className="relative block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/42" size={17} aria-hidden="true" />
            <input
              className="input bg-mistWhite pl-10"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search offers"
            />
          </label>

          <div className="mt-5 grid max-h-[760px] gap-3 overflow-y-auto pr-1">
            {loading ? (
              <div className="grid min-h-[240px] place-items-center text-sm font-bold text-deepEmerald">
                Loading offers...
              </div>
            ) : filteredOffers.length ? (
              filteredOffers.map((offer) => (
                <button
                  key={offer._id}
                  type="button"
                  onClick={() => selectOffer(offer)}
                  className={`rounded border p-4 text-left transition ${
                    selectedId === offer._id
                      ? "border-deepEmerald bg-mutedMint/60"
                      : "border-sage bg-mistWhite hover:border-deepEmerald/35 hover:bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-extrabold text-charcoal">{offer.name}</p>
                      <p className="mt-1 text-xs text-charcoal/55">{offer.slug}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${offer.active ? "bg-mutedMint text-deepEmerald" : "bg-sage text-charcoal/55"}`}>
                      {offer.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-deepEmerald">{offer.offerType}</p>
                  <p className="mt-2 text-sm text-charcoal/60">{formatPrice(offer)}</p>
                </button>
              ))
            ) : (
              <div className="border border-sage bg-mistWhite p-8 text-center text-sm text-charcoal/60">
                No offers found.
              </div>
            )}
          </div>
        </div>

        <form onSubmit={saveOffer} className="rounded border border-sage bg-white p-5 shadow-[0_16px_34px_rgba(34,34,34,0.045)]">
          <div className="flex flex-col gap-4 border-b border-sage pb-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">
                <SlidersHorizontal size={17} aria-hidden="true" />
                {selectedId ? "Edit Offer" : "Create Offer"}
              </div>
              <h2 className="mt-3 font-serif text-4xl leading-tight text-charcoal">
                {form.name || "Offer setup"}
              </h2>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-deepEmerald px-5 py-3 text-sm font-extrabold text-mistWhite transition hover:bg-charcoal disabled:opacity-60"
            >
              {saving ? <Loader2 className="animate-spin" size={16} aria-hidden="true" /> : <Save size={16} aria-hidden="true" />}
              {saving ? "Saving..." : "Save offer"}
            </button>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-extrabold text-charcoal">Name</span>
              <input className="input bg-mistWhite" value={form.name} onChange={(event) => updateField("name", event.target.value)} required />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-extrabold text-charcoal">Slug</span>
              <input className="input bg-mistWhite" value={form.slug} onChange={(event) => updateField("slug", event.target.value)} placeholder="auto-generated if blank" />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-extrabold text-charcoal">Offer type</span>
              <select className="input bg-mistWhite" value={form.offerType} onChange={(event) => updateField("offerType", event.target.value)} required>
                {offerTypes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-extrabold text-charcoal">CTA type</span>
              <select className="input bg-mistWhite" value={form.ctaType} onChange={(event) => updateField("ctaType", event.target.value)}>
                {ctaTypes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-extrabold text-charcoal">Price</span>
              <input className="input bg-mistWhite" type="number" min="0" value={form.price} onChange={(event) => updateField("price", event.target.value)} />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-extrabold text-charcoal">Currency</span>
              <input className="input bg-mistWhite" value={form.currency} onChange={(event) => updateField("currency", event.target.value)} />
            </label>
            <label className="grid gap-2 lg:col-span-2">
              <span className="text-sm font-extrabold text-charcoal">Short description</span>
              <textarea className="input min-h-24 bg-mistWhite" value={form.shortDescription} onChange={(event) => updateField("shortDescription", event.target.value)} />
            </label>
            <label className="grid gap-2 lg:col-span-2">
              <span className="text-sm font-extrabold text-charcoal">Full description</span>
              <textarea className="input min-h-32 bg-mistWhite" value={form.fullDescription} onChange={(event) => updateField("fullDescription", event.target.value)} />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-extrabold text-charcoal">Features</span>
              <textarea className="input min-h-40 bg-mistWhite" value={form.features} onChange={(event) => updateField("features", event.target.value)} placeholder="One feature per line" />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-extrabold text-charcoal">Outcomes</span>
              <textarea className="input min-h-40 bg-mistWhite" value={form.outcomes} onChange={(event) => updateField("outcomes", event.target.value)} placeholder="One outcome per line" />
            </label>
            <label className="grid gap-2 lg:col-span-2">
              <span className="text-sm font-extrabold text-charcoal">Ideal client</span>
              <textarea className="input min-h-24 bg-mistWhite" value={form.idealClient} onChange={(event) => updateField("idealClient", event.target.value)} />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-extrabold text-charcoal">CTA text</span>
              <input className="input bg-mistWhite" value={form.ctaText} onChange={(event) => updateField("ctaText", event.target.value)} />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-extrabold text-charcoal">CTA URL</span>
              <input className="input bg-mistWhite" value={form.ctaUrl} onChange={(event) => updateField("ctaUrl", event.target.value)} />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-extrabold text-charcoal">External booking URL</span>
              <input className="input bg-mistWhite" value={form.externalBookingUrl} onChange={(event) => updateField("externalBookingUrl", event.target.value)} />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-extrabold text-charcoal">Email sequence key</span>
              <input className="input bg-mistWhite" value={form.relatedEmailSequenceKey} onChange={(event) => updateField("relatedEmailSequenceKey", event.target.value)} />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-extrabold text-charcoal">Display order</span>
              <input className="input bg-mistWhite" type="number" value={form.displayOrder} onChange={(event) => updateField("displayOrder", event.target.value)} />
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 border-t border-sage pt-5">
            {[
              ["active", "Active"],
              ["featured", "Featured"],
              ["checkoutEnabled", "Checkout enabled"],
              ["bookingEnabled", "Booking enabled"],
              ["applicationRequired", "Application required"]
            ].map(([field, label]) => (
              <label key={field} className="inline-flex items-center gap-2 text-sm font-extrabold text-charcoal">
                <input
                  type="checkbox"
                  className="accent-deepEmerald"
                  checked={Boolean(form[field])}
                  onChange={(event) => updateField(field, event.target.checked)}
                />
                {label}
              </label>
            ))}
          </div>
        </form>
      </div>
    </section>
  );
}
