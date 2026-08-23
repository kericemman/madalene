import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, EyeOff, Flag, RefreshCcw, Search, Star } from "lucide-react";
import { listAdminReviews, updateAdminReview } from "../../services/api.js";

const statuses = [
  { value: "pending", label: "Pending" },
  { value: "published", label: "Published" },
  { value: "hidden", label: "Hidden" },
  { value: "flagged", label: "Flagged" },
  { value: "", label: "All" }
];

const statusStyles = {
  pending: "border-deepEmerald/25 bg-sage text-deepEmerald",
  published: "border-deepEmerald bg-deepEmerald text-mistWhite",
  hidden: "border-charcoal/20 bg-charcoal/[0.08] text-charcoal",
  flagged: "border-red-200 bg-red-50 text-red-700"
};

const ratingStars = (rating = 5) => Array.from({ length: Math.max(Math.min(Number(rating) || 5, 5), 1) });

export default function AdminReviewsPage() {
  const [status, setStatus] = useState("pending");
  const [search, setSearch] = useState("");
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState("");

  const params = useMemo(
    () => ({
      limit: 24,
      ...(status ? { status } : {}),
      ...(search.trim() ? { search: search.trim() } : {})
    }),
    [search, status]
  );

  const loadReviews = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await listAdminReviews(params);
      setReviews(response.data.items || []);
      setPagination(response.data.pagination || null);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not load reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const updateReview = async (review, payload) => {
    setActionId(review._id);
    setError("");
    try {
      const response = await updateAdminReview(review._id, payload);
      const updatedReview = response.data.review;
      setReviews((current) =>
        current
          .map((item) => (item._id === updatedReview._id ? updatedReview : item))
          .filter((item) => !status || item.status === status)
      );
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not update review.");
    } finally {
      setActionId("");
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">
            Client Proof
          </p>
          <h1 className="mt-2 font-serif text-4xl leading-tight text-charcoal sm:text-5xl">
            Review Approval
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-charcoal/65">
            Approve client reviews before they appear on the homepage and About page.
          </p>
        </div>

        <button
          type="button"
          onClick={loadReviews}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-charcoal bg-charcoal px-5 py-3 text-sm font-bold text-mutedMint transition hover:bg-deepEmerald hover:text-mistWhite"
        >
          <RefreshCcw size={16} aria-hidden="true" />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 border border-sage bg-white p-4 shadow-[0_16px_34px_rgba(34,34,34,0.045)] lg:grid-cols-[1fr_320px] lg:items-center">
        <div className="flex flex-wrap gap-2">
          {statuses.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setStatus(item.value)}
              className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                status === item.value
                  ? "border-charcoal bg-charcoal text-mutedMint"
                  : "border-sage bg-mistWhite text-charcoal/72 hover:border-deepEmerald hover:text-deepEmerald"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <label className="relative block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/42" size={17} aria-hidden="true" />
          <input
            className="input bg-mistWhite pl-10"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search reviews"
          />
        </label>
      </div>

      {error && (
        <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <div className="border border-sage bg-white p-8 text-charcoal shadow-[0_16px_34px_rgba(34,34,34,0.045)]">
          Loading reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="border border-sage bg-white p-8 text-center shadow-[0_16px_34px_rgba(34,34,34,0.045)]">
          <CheckCircle2 className="mx-auto text-deepEmerald" size={34} aria-hidden="true" />
          <h2 className="mt-4 font-serif text-3xl">No reviews here.</h2>
          <p className="mt-2 text-sm text-charcoal/60">
            New client submissions will appear in Pending before they go live.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reviews.map((review) => (
            <article
              key={review._id}
              className="grid gap-5 border border-sage bg-white p-5 shadow-[0_16px_34px_rgba(34,34,34,0.045)] xl:grid-cols-[1fr_240px]"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full border px-3 py-1 text-xs font-extrabold uppercase tracking-[0.1em] ${statusStyles[review.status] || statusStyles.pending}`}>
                    {review.status}
                  </span>
                  {review.featured && (
                    <span className="rounded-full border border-deepEmerald/25 bg-sage px-3 py-1 text-xs font-extrabold uppercase tracking-[0.1em] text-deepEmerald">
                      Featured
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-deepEmerald" aria-label={`${review.rating || 5} star review`}>
                    {ratingStars(review.rating).map((_, index) => (
                      <Star key={index} size={14} fill="currentColor" aria-hidden="true" />
                    ))}
                  </div>
                </div>

                <h2 className="mt-4 font-serif text-3xl leading-tight text-charcoal">
                  {review.headline || "Review submission"}
                </h2>
                <p className="mt-3 text-lg leading-8 text-charcoal">"{review.review}"</p>

                {(review.before || review.after) && (
                  <div className="mt-5 grid gap-4 border-t border-sage pt-5 md:grid-cols-2">
                    {review.before && (
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-charcoal/50">
                          Before
                        </p>
                        <p className="mt-2 text-sm leading-6 text-charcoal/70">{review.before}</p>
                      </div>
                    )}
                    {review.after && (
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">
                          After
                        </p>
                        <p className="mt-2 text-sm leading-6 text-charcoal/70">{review.after}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid content-between gap-5 border-t border-sage pt-5 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0">
                <div>
                  <p className="font-bold text-charcoal">{review.name}</p>
                  <p className="mt-1 text-sm text-charcoal/60">{review.email}</p>
                  {review.role && <p className="mt-1 text-sm text-charcoal/60">{review.role}</p>}
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/45">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="grid gap-2">
                  {review.status !== "published" && (
                    <button
                      type="button"
                      disabled={actionId === review._id}
                      onClick={() => updateReview(review, { status: "published" })}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-deepEmerald bg-deepEmerald px-4 py-2.5 text-sm font-bold text-mistWhite transition hover:bg-charcoal disabled:opacity-60"
                    >
                      <CheckCircle2 size={16} aria-hidden="true" />
                      Approve
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={actionId === review._id}
                    onClick={() => updateReview(review, { featured: !review.featured })}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-sage bg-mistWhite px-4 py-2.5 text-sm font-bold text-charcoal transition hover:border-deepEmerald hover:text-deepEmerald disabled:opacity-60"
                  >
                    <Star size={16} aria-hidden="true" />
                    {review.featured ? "Unfeature" : "Feature"}
                  </button>
                  {review.status !== "hidden" && (
                    <button
                      type="button"
                      disabled={actionId === review._id}
                      onClick={() => updateReview(review, { status: "hidden" })}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-charcoal/15 bg-white px-4 py-2.5 text-sm font-bold text-charcoal/70 transition hover:border-charcoal hover:text-charcoal disabled:opacity-60"
                    >
                      <EyeOff size={16} aria-hidden="true" />
                      Hide
                    </button>
                  )}
                  {review.status !== "flagged" && (
                    <button
                      type="button"
                      disabled={actionId === review._id}
                      onClick={() => updateReview(review, { status: "flagged" })}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-60"
                    >
                      <Flag size={16} aria-hidden="true" />
                      Flag
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {pagination && (
        <p className="text-sm font-semibold text-charcoal/55">
          Showing {reviews.length} of {pagination.total} reviews.
        </p>
      )}
    </div>
  );
}
