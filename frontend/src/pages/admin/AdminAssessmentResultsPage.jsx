import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Loader2,
  Mail,
  Search,
  SlidersHorizontal,
  Target,
  UserRound,
  XCircle
} from "lucide-react";
import {
  getAssessmentResult,
  listAssessmentResults,
  listScoreRanges,
  sendAssessmentRecommendationEmail
} from "../../services/api.js";

const categoryOptions = [
  { value: "story", label: "Story" },
  { value: "trust", label: "Trust" },
  { value: "positioning", label: "Positioning" },
  { value: "proof", label: "Proof" },
  { value: "resonance", label: "Resonance" }
];

const initialFilters = {
  search: "",
  stage: "",
  weakestCategory: "",
  gradeCheck: "",
  minScore: "",
  maxScore: ""
};

const clampScore = (value, max = 100) => Math.min(max, Math.max(0, Number(value || 0)));
const scoreMaxFor = (result) => Number(result?.overallMaxScore || result?.scoringSnapshot?.overallMaxScore || result?.review?.scoreMax || 100);
const scorePercent = (score, max = 100) => Math.round((clampScore(score, max) / Math.max(max, 1)) * 100);

const formatDate = (value) => {
  if (!value) return "No date";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
};

const fullName = (participant = {}) =>
  [participant.firstName, participant.lastName].filter(Boolean).join(" ") || "Unnamed participant";

const formatScore = (value, max = 100) => Math.round(clampScore(value, max));

const averageScore = (results) => {
  if (!results.length) return 0;
  const total = results.reduce((sum, result) => sum + Number(result.overallScore || 0), 0);
  return Math.round(total / results.length);
};

const averageScoreMax = (results) => {
  if (!results.length) return 100;
  const total = results.reduce((sum, result) => sum + scoreMaxFor(result), 0);
  return Math.round(total / results.length);
};

const hasEmail = (result) => Boolean(result?.participant?.email);

const scoreToneClass = (score, max = 100) => {
  const numericScore = scorePercent(score, max);
  if (numericScore >= 71) return "bg-deepEmerald text-mistWhite";
  if (numericScore >= 51) return "bg-mutedMint text-deepEmerald";
  if (numericScore >= 31) return "bg-sage text-deepEmerald";
  return "bg-charcoal text-mistWhite";
};

const reviewStatus = (review) => {
  if (review?.gradeStatus === "aligned") {
    return {
      label: "Aligned",
      icon: CheckCircle2,
      className: "border-deepEmerald/20 bg-mutedMint text-deepEmerald"
    };
  }

  if (review?.gradeStatus === "needs_review") {
    return {
      label: "Needs review",
      icon: XCircle,
      className: "border-amber-200 bg-amber-50 text-amber-800"
    };
  }

  return {
    label: "Unverified",
    icon: AlertCircle,
    className: "border-charcoal/10 bg-mistWhite text-charcoal/65"
  };
};

const resultMatchesGradeFilter = (result, gradeCheck) => {
  if (!gradeCheck) return true;
  if (gradeCheck === "aligned") return result.review?.gradeStatus === "aligned";
  if (gradeCheck === "needs_review") return result.review?.gradeStatus === "needs_review";
  return result.review?.gradeStatus === "unknown";
};

function StatTile({ label, value, icon: Icon, tone = "light" }) {
  return (
    <article
      className={`rounded border p-4 shadow-[0_12px_26px_rgba(34,34,34,0.035)] ${
        tone === "dark" ? "border-charcoal bg-charcoal text-mistWhite" : "border-sage bg-mistWhite text-charcoal"
      }`}
    >
      <Icon className={tone === "dark" ? "text-mutedMint" : "text-deepEmerald"} size={20} aria-hidden="true" />
      <p className={`mt-4 text-xs font-bold uppercase tracking-[0.14em] ${tone === "dark" ? "text-mistWhite/55" : "text-charcoal/55"}`}>
        {label}
      </p>
      <p className="mt-1 text-2xl font-extrabold">{value}</p>
    </article>
  );
}

function ResultListItem({ result, active, onClick }) {
  const status = reviewStatus(result.review);
  const StatusIcon = status.icon;
  const scoreMax = scoreMaxFor(result);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded border p-4 text-left transition ${
        active
          ? "border-deepEmerald bg-mutedMint/60 shadow-[0_14px_30px_rgba(11,110,79,0.08)]"
          : "border-sage bg-mistWhite hover:border-deepEmerald/35 hover:bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold text-charcoal">{fullName(result.participant)}</p>
          <p className="mt-1 truncate text-xs text-charcoal/62">{result.participant?.email || "No email captured"}</p>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-extrabold ${scoreToneClass(result.overallScore, scoreMax)}`}>
          {formatScore(result.overallScore, scoreMax)}/{scoreMax}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-sage px-3 py-1 font-bold text-deepEmerald">
          {result.review?.grade || result.credibilityStage?.name || "Unassigned"}
        </span>
        <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 font-bold ${status.className}`}>
          <StatusIcon size={13} aria-hidden="true" />
          {status.label}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-charcoal/60">
        <span>{result.weakestCategory?.name || "No weakest category"}</span>
        <span>{formatDate(result.submittedAt)}</span>
      </div>
    </button>
  );
}

function ScoreBar({ category }) {
  const score = clampScore(category.score);

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-charcoal">{category.name || category.key}</p>
        <p className="text-sm font-extrabold text-deepEmerald">{formatScore(score)}%</p>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-sage">
        <div className="h-full rounded-full bg-deepEmerald" style={{ width: `${score}%` }} />
      </div>
      {category.aiApplied && (
        <p className="mt-2 text-xs font-semibold text-charcoal/58">
          Evidence {category.evidencePoints}/5, self-rating {Number(category.selfAssessmentPoints || 0).toFixed(1)}/5
          {Math.abs(Number(category.scoreDelta || 0)) >= 2 ? " - review difference" : ""}
        </p>
      )}
    </div>
  );
}

function DetailField({ label, value }) {
  if (!value) return null;

  return (
    <div className="border-t border-sage pt-3 first:border-t-0 first:pt-0">
      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-charcoal/45">{label}</p>
      <p className="mt-1 text-sm font-semibold text-charcoal/82">{value}</p>
    </div>
  );
}

export default function AdminAssessmentResultsPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [results, setResults] = useState([]);
  const [scoreRanges, setScoreRanges] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1, limit: 100 });
  const [selectedId, setSelectedId] = useState("");
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [status, setStatus] = useState("loading");
  const [detailStatus, setDetailStatus] = useState("idle");
  const [emailStatus, setEmailStatus] = useState("idle");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const resultQuery = useMemo(() => {
    const query = { limit: 100 };
    if (filters.search.trim()) query.search = filters.search.trim();
    if (filters.stage) query.stage = filters.stage;
    if (filters.weakestCategory) query.weakestCategory = filters.weakestCategory;
    if (filters.minScore !== "") query.minScore = filters.minScore;
    if (filters.maxScore !== "") query.maxScore = filters.maxScore;
    return query;
  }, [filters]);

  useEffect(() => {
    let active = true;

    listScoreRanges({ limit: 100 })
      .then((response) => {
        if (!active) return;
        setScoreRanges(response.data.items || []);
      })
      .catch(() => {
        if (!active) return;
        setScoreRanges([]);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    setStatus("loading");
    setError("");

    listAssessmentResults(resultQuery)
      .then((response) => {
        if (!active) return;
        const items = response.data.items || [];
        setResults(items);
        setPagination(response.data.pagination || { total: items.length, page: 1, pages: 1, limit: 100 });
        setStatus("ready");
      })
      .catch((requestError) => {
        if (!active) return;
        setError(requestError.response?.data?.message || "Could not load assessment results.");
        setStatus("error");
      });

    return () => {
      active = false;
    };
  }, [resultQuery]);

  const visibleResults = useMemo(
    () => results.filter((result) => resultMatchesGradeFilter(result, filters.gradeCheck)),
    [results, filters.gradeCheck]
  );

  useEffect(() => {
    if (!visibleResults.length) {
      setSelectedId("");
      setSelectedDetail(null);
      return;
    }

    if (!selectedId || !visibleResults.some((result) => result._id === selectedId)) {
      setSelectedId(visibleResults[0]._id);
    }
  }, [selectedId, visibleResults]);

  useEffect(() => {
    if (!selectedId) return;

    let active = true;
    setSelectedDetail(null);
    setDetailStatus("loading");
    setNotice("");

    getAssessmentResult(selectedId)
      .then((response) => {
        if (!active) return;
        setSelectedDetail(response.data);
        setDetailStatus("ready");
      })
      .catch((requestError) => {
        if (!active) return;
        setError(requestError.response?.data?.message || "Could not load the selected result.");
        setDetailStatus("error");
      });

    return () => {
      active = false;
    };
  }, [selectedId]);

  const selectedSummary = visibleResults.find((result) => result._id === selectedId);
  const selectedResult = selectedDetail?.result || selectedSummary;
  const selectedReview = selectedDetail?.review || selectedSummary?.review;
  const needsReviewCount = results.filter((result) => result.review?.gradeStatus === "needs_review").length;
  const emailReadyCount = results.filter(hasEmail).length;
  const activeStatus = reviewStatus(selectedReview);
  const ActiveStatusIcon = activeStatus.icon;

  const handleFilterChange = (name, value) => {
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const handleSendEmail = async () => {
    if (!selectedResult?._id || !hasEmail(selectedResult)) return;
    setEmailStatus("sending");
    setNotice("");
    setError("");

    try {
      const response = await sendAssessmentRecommendationEmail(selectedResult._id);
      setSelectedDetail((current) => ({ ...(current || {}), review: response.data.review || selectedReview }));
      setNotice(response.message || `Next-action email queued for ${selectedResult.participant.email}.`);
      setEmailStatus("sent");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not queue the next-action email.");
      setEmailStatus("error");
    }
  };

  return (
    <section>
      <div className="flex flex-col gap-4 border-b border-sage pb-7 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">7-Minute Assessment</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">Results & Next Actions</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-charcoal/66">
            Review submitted Resonance Quotient scores, compare each result against the expected credibility stage, and queue the right recommendation email.
          </p>
        </div>
        <div className="rounded border border-sage bg-sage/45 px-4 py-3 text-sm text-charcoal/72">
          <p className="font-extrabold text-deepEmerald">{scoreRanges.length || 0} active score bands</p>
          <p className="mt-1">Dashboard grading uses the saved assessment ranges.</p>
        </div>
      </div>

      {(error || notice) && (
        <div
          className={`mt-6 flex gap-3 rounded border p-4 text-sm ${
            error ? "border-red-200 bg-red-50 text-red-700" : "border-deepEmerald/20 bg-mutedMint text-deepEmerald"
          }`}
        >
          {error ? <AlertCircle className="mt-0.5 shrink-0" size={18} aria-hidden="true" /> : <CheckCircle2 className="mt-0.5 shrink-0" size={18} aria-hidden="true" />}
          <p>{error || notice}</p>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Results Found" value={pagination.total || results.length} icon={ClipboardCheck} tone="dark" />
        <StatTile label="Average Score" value={`${averageScore(results)}/${averageScoreMax(results)}`} icon={BarChart3} />
        <StatTile label="Needs Review" value={needsReviewCount} icon={AlertCircle} />
        <StatTile label="Email Ready" value={emailReadyCount} icon={Mail} />
      </div>

      <div className="mt-6 rounded border border-sage bg-mistWhite p-4 shadow-[0_12px_26px_rgba(34,34,34,0.035)]">
        <div className="flex items-center gap-2 text-sm font-extrabold text-charcoal">
          <SlidersHorizontal size={18} className="text-deepEmerald" aria-hidden="true" />
          Filter results
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1fr_0.7fr_0.7fr_auto]">
          <label className="block">
            <span className="sr-only">Search results</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" size={17} aria-hidden="true" />
              <input
                className="input pl-10"
                value={filters.search}
                onChange={(event) => handleFilterChange("search", event.target.value)}
                placeholder="Search name, email, profession"
              />
            </div>
          </label>
          <label className="block">
            <span className="sr-only">Stage</span>
            <select className="input" value={filters.stage} onChange={(event) => handleFilterChange("stage", event.target.value)}>
              <option value="">All stages</option>
              {scoreRanges.map((range) => (
                <option key={range._id} value={range.name}>
                  {range.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="sr-only">Weakest category</span>
            <select
              className="input"
              value={filters.weakestCategory}
              onChange={(event) => handleFilterChange("weakestCategory", event.target.value)}
            >
              <option value="">All weakest areas</option>
              {categoryOptions.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="sr-only">Grade check</span>
            <select
              className="input"
              value={filters.gradeCheck}
              onChange={(event) => handleFilterChange("gradeCheck", event.target.value)}
            >
              <option value="">All grade checks</option>
              <option value="aligned">Aligned</option>
              <option value="needs_review">Needs review</option>
              <option value="unknown">Unverified</option>
            </select>
          </label>
          <input
            className="input"
            value={filters.minScore}
            onChange={(event) => handleFilterChange("minScore", event.target.value)}
            inputMode="numeric"
            placeholder="Min"
          />
          <input
            className="input"
            value={filters.maxScore}
            onChange={(event) => handleFilterChange("maxScore", event.target.value)}
            inputMode="numeric"
            placeholder="Max"
          />
          <button
            type="button"
            onClick={resetFilters}
            className="rounded border border-charcoal/15 px-4 py-3 text-sm font-extrabold text-charcoal transition hover:border-deepEmerald hover:text-deepEmerald"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(420px,1.08fr)]">
        <article className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="font-serif text-2xl">Submissions</h2>
            <p className="text-sm font-semibold text-charcoal/58">{visibleResults.length} shown</p>
          </div>
          {status === "loading" ? (
            <div className="grid min-h-[340px] place-items-center rounded border border-sage bg-mistWhite">
              <div className="flex items-center gap-3 text-sm font-bold text-deepEmerald">
                <Loader2 className="animate-spin" size={18} aria-hidden="true" />
                Loading results...
              </div>
            </div>
          ) : visibleResults.length ? (
            <div className="grid max-h-[920px] gap-3 overflow-y-auto pr-1">
              {visibleResults.map((result) => (
                <ResultListItem
                  key={result._id}
                  result={result}
                  active={result._id === selectedId}
                  onClick={() => setSelectedId(result._id)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded border border-sage bg-mistWhite p-8 text-center">
              <p className="font-serif text-2xl">No results match these filters.</p>
              <p className="mt-2 text-sm text-charcoal/60">Adjust the grade, score, or category filters to widen the view.</p>
            </div>
          )}
        </article>

        <article className="min-w-0 rounded border border-sage bg-mistWhite shadow-[0_16px_36px_rgba(34,34,34,0.04)]">
          {!selectedResult ? (
            <div className="grid min-h-[520px] place-items-center p-8 text-center">
              <div>
                <UserRound className="mx-auto text-deepEmerald" size={34} aria-hidden="true" />
                <p className="mt-4 font-serif text-3xl">Select a result</p>
                <p className="mt-2 text-sm text-charcoal/60">Choose an assessment submission to review its grade and next action.</p>
              </div>
            </div>
          ) : (
            <div>
              <div className="border-b border-sage bg-charcoal p-5 text-mistWhite sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-mutedMint">Selected Result</p>
                    <h2 className="mt-2 truncate font-serif text-3xl leading-tight">{fullName(selectedResult.participant)}</h2>
                    <p className="mt-2 text-sm text-mistWhite/62">{selectedResult.participant?.email || "No email captured"}</p>
                  </div>
                  <span className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-extrabold ${activeStatus.className}`}>
                    <ActiveStatusIcon size={14} aria-hidden="true" />
                    {activeStatus.label}
                  </span>
                </div>
              </div>

              <div className="grid gap-6 p-5 sm:p-6">
                {detailStatus === "loading" && (
                  <div className="flex items-center gap-3 rounded border border-sage bg-white p-4 text-sm font-bold text-deepEmerald">
                    <Loader2 className="animate-spin" size={18} aria-hidden="true" />
                    Loading full submission...
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
                  <div className={`rounded border p-5 text-center ${scoreToneClass(selectedResult.overallScore, scoreMaxFor(selectedResult))}`}>
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] opacity-75">Score</p>
                    <p className="mt-2 text-5xl font-black">{formatScore(selectedResult.overallScore, scoreMaxFor(selectedResult))}</p>
                    <p className="mt-1 text-sm font-bold opacity-75">out of {scoreMaxFor(selectedResult)}</p>
                  </div>
                  <div className="rounded border border-sage bg-white p-5">
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-charcoal/45">Grade</p>
                    <p className="mt-2 font-serif text-3xl text-charcoal">{selectedReview?.grade || "Unassigned"}</p>
                    <div className="mt-4 grid gap-3 text-sm text-charcoal/72 sm:grid-cols-2">
                      <div>
                        <p className="font-extrabold text-charcoal">Expected</p>
                        <p className="mt-1">{selectedReview?.expectedStage?.name || "No matching range"}</p>
                      </div>
                      <div>
                        <p className="font-extrabold text-charcoal">Stored</p>
                        <p className="mt-1">{selectedReview?.storedStage?.name || "Unassigned"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
                  <div className="rounded border border-sage bg-white p-5">
                    <div className="flex items-center gap-2">
                      <Target size={18} className="text-deepEmerald" aria-hidden="true" />
                      <h3 className="font-serif text-2xl">Category Breakdown</h3>
                    </div>
                    <div className="mt-5 grid gap-4">
                      {(selectedResult.categoryScores || []).length ? (
                        selectedResult.categoryScores.map((category) => (
                          <ScoreBar key={category.key || category.name} category={category} />
                        ))
                      ) : (
                        <p className="text-sm text-charcoal/60">No category scores were saved with this result.</p>
                      )}
                    </div>
                  </div>

                  <div className="rounded border border-sage bg-white p-5">
                    <div className="flex items-center gap-2">
                      <UserRound size={18} className="text-deepEmerald" aria-hidden="true" />
                      <h3 className="font-serif text-2xl">Participant</h3>
                    </div>
                    <div className="mt-5 grid gap-3">
                      <DetailField label="Profession" value={selectedResult.participant?.profession} />
                      <DetailField label="Business Stage" value={selectedResult.participant?.businessStage} />
                      <DetailField label="Primary Challenge" value={selectedResult.participant?.primaryChallenge} />
                      <DetailField label="Desired Outcome" value={selectedResult.participant?.desiredOutcome} />
                      <DetailField label="Readiness" value={selectedResult.participant?.readinessToInvest} />
                      <DetailField label="Submitted" value={formatDate(selectedResult.submittedAt)} />
                    </div>
                  </div>
                </div>

                {(selectedResult.responses || []).some((response) => response.answerType === "long_text" && response.value) && (
                  <div className="rounded border border-sage bg-white p-5">
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">Written Evidence</p>
                    <div className="mt-4 grid gap-3">
                      {selectedResult.responses
                        .filter((response) => response.answerType === "long_text" && response.value)
                        .map((response) => (
                          <div key={response.questionKey} className="border-l-2 border-deepEmerald bg-mistWhite px-4 py-3">
                            <p className="text-sm font-extrabold text-charcoal">{response.questionText}</p>
                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-charcoal/70">{response.value}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {selectedResult.aiAnalysis && (
                  <div className="rounded border border-sage bg-white p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">Evidence Analysis</p>
                        <h3 className="mt-2 font-serif text-2xl text-charcoal">
                          {selectedResult.aiAnalysis.report?.headline || "Rule-based result"}
                        </h3>
                      </div>
                      <span className="rounded-full bg-sage px-3 py-1 text-xs font-extrabold text-deepEmerald">
                        {selectedResult.aiAnalysis.status === "complete" ? "Complete" : "Fallback used"}
                      </span>
                    </div>
                    {selectedResult.aiAnalysis.report?.summary ? (
                      <p className="mt-3 text-sm leading-6 text-charcoal/72">{selectedResult.aiAnalysis.report.summary}</p>
                    ) : (
                      <p className="mt-3 text-sm leading-6 text-charcoal/62">
                        {selectedResult.aiAnalysis.fallbackReason || "This result used the deterministic assessment rules."}
                      </p>
                    )}
                    {selectedResult.scoringSnapshot?.evidenceReview?.requiresReview && (
                      <p className="mt-4 border-l-2 border-amber-500 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-800">
                        The evidence score differs materially from the self-rating. Review this result before using it for a manual follow-up.
                      </p>
                    )}
                    {(selectedResult.aiAnalysis.categoryEvidence || []).length > 0 && (
                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {selectedResult.aiAnalysis.categoryEvidence.map((evidence) => (
                          <div key={evidence.key} className="border-l-2 border-deepEmerald bg-mistWhite px-4 py-3">
                            <p className="text-sm font-extrabold text-charcoal">{evidence.name || evidence.key}</p>
                            <p className="mt-1 text-xs font-bold text-deepEmerald">
                              Evidence score: {evidence.score}/5 {evidence.confidence ? `- ${Math.round(evidence.confidence * 100)}% confidence` : ""}
                            </p>
                            {evidence.rationale && <p className="mt-2 text-sm leading-6 text-charcoal/68">{evidence.rationale}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="rounded border border-deepEmerald/18 bg-mutedMint/45 p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-2xl">
                      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">Recommended Next Action</p>
                      <h3 className="mt-2 font-serif text-2xl text-charcoal">{selectedReview?.nextAction?.ctaText || "Review next step"}</h3>
                      <p className="mt-3 text-sm leading-6 text-charcoal/72">
                        {selectedReview?.nextAction?.explanation ||
                          "Review the assessment result and choose the next credibility-building action."}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleSendEmail}
                      disabled={!hasEmail(selectedResult) || emailStatus === "sending"}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-deepEmerald px-5 py-3 text-sm font-extrabold text-mistWhite transition hover:bg-charcoal disabled:cursor-not-allowed disabled:bg-charcoal/35"
                    >
                      {emailStatus === "sending" ? <Loader2 className="animate-spin" size={17} aria-hidden="true" /> : <Mail size={17} aria-hidden="true" />}
                      Email next action
                    </button>
                  </div>
                  {selectedReview?.nextAction?.ctaUrl && (
                    <a
                      href={selectedReview.nextAction.ctaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-deepEmerald hover:text-charcoal"
                    >
                      Preview CTA destination
                      <ChevronRight size={16} aria-hidden="true" />
                    </a>
                  )}
                </div>

                <div className="rounded border border-sage bg-white p-5">
                  <h3 className="font-serif text-2xl">Assessment Responses</h3>
                  <div className="mt-4 grid gap-3">
                    {(selectedResult.responses || []).length ? (
                      selectedResult.responses.map((response) => (
                        <div key={`${response.questionKey}-${response.categoryKey}`} className="border-t border-sage pt-3 first:border-t-0 first:pt-0">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <p className="text-sm font-bold text-charcoal">{response.questionText}</p>
                            {response.scored !== false && (
                              <span className="shrink-0 rounded-full bg-sage px-3 py-1 text-xs font-extrabold text-deepEmerald">
                                {response.scoreEarned}/{response.maxScore}
                              </span>
                            )}
                          </div>
                          <p className="mt-2 text-sm text-charcoal/62">
                            Answer: {Array.isArray(response.value) ? response.value.join(", ") : String(response.value || "Not answered")}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-charcoal/60">Full responses will appear here when the detail record loads.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
