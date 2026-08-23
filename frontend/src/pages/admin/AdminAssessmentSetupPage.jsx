import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  CirclePlay,
  Copy,
  Loader2,
  Plus,
  RefreshCcw,
  Save,
  Sparkles,
  X
} from "lucide-react";
import {
  activateAssessmentVersion,
  createAssessmentQuestion,
  createRecommendationRule,
  createScoreRange,
  duplicateAssessmentVersion,
  listAdminOffers,
  listAdminResources,
  listAssessmentQuestions,
  listAssessmentVersions,
  listRecommendationRules,
  listScoreRanges,
  updateAssessmentQuestion,
  updateRecommendationRule,
  updateScoreRange
} from "../../services/api.js";

const choiceTypes = ["likert", "multiple_choice", "single_choice", "yes_no"];

const answerTypes = [
  ["likert", "Five-point scale"],
  ["single_choice", "Single choice"],
  ["multiple_choice", "Multiple choice"],
  ["yes_no", "Yes / no"],
  ["short_text", "Short text"],
  ["long_text", "Long text"]
];

const emptyRange = {
  name: "",
  minScore: 0,
  maxScore: 100,
  description: "",
  recommendedAction: "",
  primaryCtaText: "",
  primaryCtaUrl: "",
  displayOrder: 0,
  active: true,
  report: {
    whatItMeans: "",
    biggestOpportunity: "",
    nextSteps: [],
    recommendedResourceTitle: "",
    finalNote: ""
  }
};

const newQuestion = (version) => ({
  assessmentVersion: version?._id || "",
  key: "",
  questionText: "",
  helperText: "",
  categoryKey: version?.categories?.[0]?.key || "",
  displayOrder: 1,
  answerType: "likert",
  optionsText: "Strongly disagree|1|1\nDisagree|2|2\nNeither agree nor disagree|3|3\nAgree|4|4\nStrongly agree|5|5",
  weight: 1,
  required: true,
  scored: true,
  aiScored: false,
  aiScoringRubric: "",
  active: true
});

const newRule = () => ({
  name: "",
  priority: 100,
  active: true,
  minScore: "",
  maxScore: "",
  weakestCategories: "",
  secondWeakestCategories: "",
  professions: "",
  businessStages: "",
  primaryChallenges: "",
  readinessToInvest: "",
  desiredOutcomes: "",
  offer: "",
  resource: "",
  explanation: "",
  ctaText: "",
  ctaDestination: "",
  secondaryLabel: "",
  secondaryUrl: "",
  emailSequenceKey: ""
});

const formatDate = (value) => {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
};

const splitList = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const optionTextFrom = (options = []) =>
  options
    .slice()
    .sort((left, right) => (left.displayOrder || 0) - (right.displayOrder || 0))
    .map((option) => `${option.label}|${option.value}|${option.score ?? 0}`)
    .join("\n");

const parseOptions = (value) =>
  String(value || "")
    .split("\n")
    .map((line, index) => {
      const [label, optionValue, score] = line.split("|").map((part) => part.trim());
      if (!label || !optionValue) return null;
      return { label, value: optionValue, score: Number(score || 0), displayOrder: index + 1 };
    })
    .filter(Boolean);

const rangePayload = (range) => ({
  ...range,
  minScore: Number(range.minScore || 0),
  maxScore: Number(range.maxScore || 0),
  displayOrder: Number(range.displayOrder || 0),
  report: {
    ...(range.report || {}),
    nextSteps: Array.isArray(range.report?.nextSteps)
      ? range.report.nextSteps.filter(Boolean)
      : String(range.report?.nextSteps || "")
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean)
  }
});

const questionPayload = (question) => ({
  assessmentVersion: question.assessmentVersion,
  key: question.key.trim(),
  questionText: question.questionText.trim(),
  helperText: question.helperText.trim() || undefined,
  categoryKey: question.categoryKey,
  displayOrder: Number(question.displayOrder || 0),
  answerType: question.answerType,
  options: choiceTypes.includes(question.answerType) ? parseOptions(question.optionsText) : [],
  weight: Number(question.weight || 1),
  required: Boolean(question.required),
  scored: Boolean(question.scored),
  aiScored: Boolean(question.aiScored),
  aiScoringRubric: question.aiScored ? question.aiScoringRubric?.trim() || undefined : undefined,
  active: Boolean(question.active)
});

const rulePayload = (rule) => {
  const criteria = {
    ...(rule.minScore !== "" ? { minScore: Number(rule.minScore) } : {}),
    ...(rule.maxScore !== "" ? { maxScore: Number(rule.maxScore) } : {}),
    ...(splitList(rule.weakestCategories).length ? { weakestCategories: splitList(rule.weakestCategories) } : {}),
    ...(splitList(rule.secondWeakestCategories).length ? { secondWeakestCategories: splitList(rule.secondWeakestCategories) } : {}),
    ...(splitList(rule.professions).length ? { professions: splitList(rule.professions) } : {}),
    ...(splitList(rule.businessStages).length ? { businessStages: splitList(rule.businessStages) } : {}),
    ...(splitList(rule.primaryChallenges).length ? { primaryChallenges: splitList(rule.primaryChallenges) } : {}),
    ...(splitList(rule.readinessToInvest).length ? { readinessToInvest: splitList(rule.readinessToInvest) } : {}),
    ...(splitList(rule.desiredOutcomes).length ? { desiredOutcomes: splitList(rule.desiredOutcomes) } : {})
  };

  return {
    name: rule.name.trim(),
    priority: Number(rule.priority || 0),
    active: Boolean(rule.active),
    criteria,
    ...(rule.offer ? { offer: rule.offer } : {}),
    ...(rule.resource ? { resource: rule.resource } : {}),
    explanation: rule.explanation.trim(),
    ctaText: rule.ctaText.trim(),
    ctaDestination: rule.ctaDestination.trim(),
    ...(rule.secondaryLabel || rule.secondaryUrl
      ? { secondaryAction: { ...(rule.secondaryLabel ? { label: rule.secondaryLabel.trim() } : {}), ...(rule.secondaryUrl ? { url: rule.secondaryUrl.trim() } : {}) } }
      : {}),
    ...(rule.emailSequenceKey ? { emailSequenceKey: rule.emailSequenceKey.trim() } : {})
  };
};

function Modal({ title, eyebrow, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6">
      <button type="button" className="absolute inset-0 bg-charcoal/55" onClick={onClose} aria-label="Close panel" />
      <section role="dialog" aria-modal="true" aria-label={title} className="relative flex max-h-[calc(100dvh-1rem)] w-full max-w-4xl flex-col overflow-hidden rounded border border-sage bg-mistWhite shadow-[0_24px_70px_rgba(34,34,34,0.32)]">
        <header className="flex items-start justify-between gap-4 border-b border-sage bg-charcoal px-5 py-5 text-mistWhite">
          <div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-mutedMint">{eyebrow}</p><h2 className="mt-2 font-serif text-2xl leading-tight sm:text-3xl">{title}</h2></div>
          <button type="button" onClick={onClose} className="inline-grid size-10 shrink-0 place-items-center rounded-full border border-mistWhite/20 transition hover:border-mutedMint hover:text-mutedMint" aria-label="Close panel"><X size={18} aria-hidden="true" /></button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">{children}</div>
      </section>
    </div>
  );
}

function Field({ label, children, className = "" }) {
  return <label className={`grid gap-2 ${className}`}><span className="text-sm font-extrabold text-charcoal">{label}</span>{children}</label>;
}

function StatusPill({ active, activeLabel = "Active", inactiveLabel = "Paused" }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${active ? "bg-mutedMint text-deepEmerald" : "bg-sage text-charcoal/55"}`}>{active ? activeLabel : inactiveLabel}</span>;
}

export default function AdminAssessmentSetupPage() {
  const [versions, setVersions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [scoreRanges, setScoreRanges] = useState([]);
  const [rules, setRules] = useState([]);
  const [offers, setOffers] = useState([]);
  const [resources, setResources] = useState([]);
  const [selectedVersionId, setSelectedVersionId] = useState("");
  const [selectedRangeId, setSelectedRangeId] = useState("");
  const [rangeForm, setRangeForm] = useState(emptyRange);
  const [questionEditor, setQuestionEditor] = useState(null);
  const [ruleEditor, setRuleEditor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const selectedVersion = versions.find((version) => version._id === selectedVersionId) || null;
  const activeVersion = versions.find((version) => version.status === "active") || null;
  const selectedQuestions = useMemo(() => questions.filter((question) => String(question.assessmentVersion?._id || question.assessmentVersion) === selectedVersionId), [questions, selectedVersionId]);
  const categoryCounts = useMemo(() => selectedQuestions.reduce((counts, question) => ({ ...counts, [question.categoryKey]: (counts[question.categoryKey] || 0) + 1 }), {}), [selectedQuestions]);

  const loadSetup = async () => {
    setLoading(true); setError("");
    try {
      const [versionsResponse, questionsResponse, rangesResponse, rulesResponse, offersResponse, resourcesResponse] = await Promise.all([
        listAssessmentVersions({ limit: 50 }), listAssessmentQuestions({ limit: 250 }), listScoreRanges({ limit: 50 }), listRecommendationRules({ limit: 100 }), listAdminOffers({ limit: 100 }), listAdminResources({ limit: 100 })
      ]);
      const nextVersions = versionsResponse.data.items || [];
      const nextRanges = rangesResponse.data.items || [];
      setVersions(nextVersions); setQuestions(questionsResponse.data.items || []); setScoreRanges(nextRanges); setRules(rulesResponse.data.items || []); setOffers(offersResponse.data.items || []); setResources(resourcesResponse.data.items || []);
      setSelectedVersionId((current) => current || nextVersions.find((version) => version.status === "active")?._id || nextVersions[0]?._id || "");
      setSelectedRangeId((current) => current || nextRanges[0]?._id || "");
      setRangeForm((current) => (current.name || !nextRanges[0] ? current : { ...nextRanges[0], report: { ...emptyRange.report, ...(nextRanges[0].report || {}) } }));
    } catch (requestError) { setError(requestError.response?.data?.message || "Could not load assessment setup."); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadSetup(); }, []);

  const updateRange = (field, value) => setRangeForm((current) => ({ ...current, [field]: value }));
  const updateRangeReport = (field, value) => setRangeForm((current) => ({ ...current, report: { ...(current.report || {}), [field]: value } }));
  const selectRange = (range) => { setSelectedRangeId(range._id); setRangeForm({ ...range, report: { ...emptyRange.report, ...(range.report || {}) } }); setNotice(""); setError(""); };

  const saveRange = async (event) => {
    event.preventDefault(); setSaving(true); setNotice(""); setError("");
    try {
      const response = selectedRangeId ? await updateScoreRange(selectedRangeId, rangePayload(rangeForm)) : await createScoreRange(rangePayload(rangeForm));
      const saved = response.data.item;
      setScoreRanges((current) => (current.some((range) => range._id === saved._id) ? current.map((range) => range._id === saved._id ? saved : range) : [...current, saved]).sort((left, right) => (left.displayOrder || 0) - (right.displayOrder || 0)));
      setSelectedRangeId(saved._id); setRangeForm({ ...saved, report: { ...emptyRange.report, ...(saved.report || {}) } }); setNotice(selectedRangeId ? "Result stage updated." : "Result stage created.");
    } catch (requestError) { setError(requestError.response?.data?.message || "Could not save the result stage."); }
    finally { setSaving(false); }
  };

  const openQuestion = (question) => {
    if (!selectedVersion) return;
    setQuestionEditor(question ? { id: question._id, ...question, assessmentVersion: String(question.assessmentVersion?._id || question.assessmentVersion), optionsText: optionTextFrom(question.options) } : newQuestion(selectedVersion));
    setError("");
  };

  const saveQuestion = async (event) => {
    event.preventDefault(); if (!questionEditor) return; setSaving(true); setError("");
    try {
      const response = questionEditor.id ? await updateAssessmentQuestion(questionEditor.id, questionPayload(questionEditor)) : await createAssessmentQuestion(questionPayload(questionEditor));
      const saved = response.data.item;
      setQuestions((current) => current.some((question) => question._id === saved._id) ? current.map((question) => question._id === saved._id ? saved : question) : [...current, saved]);
      setQuestionEditor(null); setNotice(questionEditor.id ? "Question updated." : "Question added to this draft.");
    } catch (requestError) { setError(requestError.response?.data?.message || "Could not save the question."); }
    finally { setSaving(false); }
  };

  const openRule = (rule) => {
    const criteria = rule?.criteria || {};
    setRuleEditor(rule ? {
      id: rule._id, name: rule.name || "", priority: rule.priority || 0, active: rule.active !== false, minScore: criteria.minScore ?? "", maxScore: criteria.maxScore ?? "", weakestCategories: (criteria.weakestCategories || []).join(", "), secondWeakestCategories: (criteria.secondWeakestCategories || []).join(", "), professions: (criteria.professions || []).join(", "), businessStages: (criteria.businessStages || []).join(", "), primaryChallenges: (criteria.primaryChallenges || []).join(", "), readinessToInvest: (criteria.readinessToInvest || []).join(", "), desiredOutcomes: (criteria.desiredOutcomes || []).join(", "), offer: rule.offer?._id || rule.offer || "", resource: rule.resource?._id || rule.resource || "", explanation: rule.explanation || "", ctaText: rule.ctaText || "", ctaDestination: rule.ctaDestination || "", secondaryLabel: rule.secondaryAction?.label || "", secondaryUrl: rule.secondaryAction?.url || "", emailSequenceKey: rule.emailSequenceKey || ""
    } : newRule());
    setError("");
  };

  const saveRule = async (event) => {
    event.preventDefault(); if (!ruleEditor) return; setSaving(true); setError("");
    try {
      const response = ruleEditor.id ? await updateRecommendationRule(ruleEditor.id, rulePayload(ruleEditor)) : await createRecommendationRule(rulePayload(ruleEditor));
      const saved = response.data.item;
      const savedWithTargets = { ...saved, offer: offers.find((offer) => offer._id === saved.offer) || saved.offer, resource: resources.find((resource) => resource._id === saved.resource) || saved.resource };
      setRules((current) => (current.some((rule) => rule._id === savedWithTargets._id) ? current.map((rule) => rule._id === savedWithTargets._id ? savedWithTargets : rule) : [...current, savedWithTargets]).sort((left, right) => (right.priority || 0) - (left.priority || 0)));
      setRuleEditor(null); setNotice(ruleEditor.id ? "Recommendation rule updated." : "Recommendation rule created.");
    } catch (requestError) { setError(requestError.response?.data?.message || "Could not save the recommendation rule."); }
    finally { setSaving(false); }
  };

  const duplicateVersion = async () => {
    if (!selectedVersion) return; setSaving(true); setError("");
    try { const response = await duplicateAssessmentVersion(selectedVersion._id); const duplicate = response.data.assessment; await loadSetup(); setSelectedVersionId(duplicate._id); setNotice(`Draft v${duplicate.version} created with ${response.data.copiedQuestions} questions.`); }
    catch (requestError) { setError(requestError.response?.data?.message || "Could not create a draft version."); }
    finally { setSaving(false); }
  };

  const makeLive = async () => {
    if (!selectedVersion || selectedVersion.status === "active") return;
    if (!window.confirm(`Make v${selectedVersion.version} live? The current active version will be archived.`)) return;
    setSaving(true); setError("");
    try { const response = await activateAssessmentVersion(selectedVersion._id); const active = response.data.item; setVersions((current) => current.map((version) => ({ ...version, status: version._id === active._id ? "active" : version.status === "active" ? "archived" : version.status }))); setNotice(`v${active.version} is now the live assessment.`); }
    catch (requestError) { setError(requestError.response?.data?.message || "Could not make this assessment version live."); }
    finally { setSaving(false); }
  };

  return (
    <section>
      <div className="flex flex-col gap-5 border-b border-sage pb-7 xl:flex-row xl:items-end xl:justify-between">
        <div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-deepEmerald">Assessment Engine</p><h1 className="mt-3 font-serif text-4xl leading-tight text-charcoal sm:text-5xl">Assessment Setup</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-charcoal/65">Shape the questions, score stages, and recommendation logic behind the 7-minute Resonance Quotient. Historic results keep their original scoring snapshot.</p></div>
        <button type="button" onClick={loadSetup} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-full border border-charcoal bg-charcoal px-5 py-3 text-sm font-bold text-mutedMint transition hover:bg-deepEmerald hover:text-mistWhite disabled:opacity-60"><RefreshCcw size={16} aria-hidden="true" />Refresh</button>
      </div>

      {(notice || error) && <div className={`mt-6 flex gap-3 rounded border p-4 text-sm ${error ? "border-red-200 bg-red-50 text-red-700" : "border-deepEmerald/20 bg-mutedMint text-deepEmerald"}`}>{error ? <AlertCircle size={18} aria-hidden="true" /> : <CheckCircle2 size={18} aria-hidden="true" />}<p>{error || notice}</p></div>}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[["Live version", activeVersion ? `v${activeVersion.version}` : "None"], ["Questions in view", selectedQuestions.length], ["Result stages", scoreRanges.length], ["Active rules", rules.filter((rule) => rule.active).length]].map(([label, value]) => <article key={label} className="rounded border border-sage bg-white p-5 shadow-[0_12px_28px_rgba(34,34,34,0.035)]"><BarChart3 className="text-deepEmerald" size={22} aria-hidden="true" /><p className="mt-4 text-xs font-extrabold uppercase tracking-[0.14em] text-charcoal/48">{label}</p><p className="mt-1 text-2xl font-extrabold text-charcoal">{value}</p></article>)}
      </div>

      {loading ? <div className="mt-8 flex items-center gap-3 border border-sage bg-white p-8 text-sm font-bold text-deepEmerald"><Loader2 className="animate-spin" size={18} aria-hidden="true" />Loading assessment controls...</div> : (
        <div className="mt-8 grid gap-6">
          <article className="rounded border border-sage bg-white p-5 shadow-[0_16px_34px_rgba(34,34,34,0.045)]">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between"><div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">Version Control</p><h2 className="mt-2 font-serif text-3xl leading-tight text-charcoal">Work safely before changing the live assessment</h2></div><div className="flex flex-wrap gap-2"><button type="button" onClick={duplicateVersion} disabled={!selectedVersion || saving} className="inline-flex items-center gap-2 rounded-full border border-deepEmerald px-4 py-2.5 text-sm font-extrabold text-deepEmerald transition hover:bg-sage disabled:opacity-60"><Copy size={15} aria-hidden="true" />Duplicate as draft</button><button type="button" onClick={makeLive} disabled={!selectedVersion || selectedVersion.status === "active" || saving} className="inline-flex items-center gap-2 rounded-full bg-deepEmerald px-4 py-2.5 text-sm font-extrabold text-mistWhite transition hover:bg-charcoal disabled:cursor-not-allowed disabled:bg-charcoal/35"><CirclePlay size={15} aria-hidden="true" />Make live</button></div></div>
            <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]"><Field label="Assessment version"><select className="input bg-mistWhite" value={selectedVersionId} onChange={(event) => setSelectedVersionId(event.target.value)}>{versions.map((version) => <option key={version._id} value={version._id}>v{version.version} - {version.title} ({version.status})</option>)}</select></Field>{selectedVersion && <div className="rounded border border-sage bg-mistWhite p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-bold text-charcoal">{selectedVersion.title}</p><p className="mt-1 text-sm text-charcoal/60">v{selectedVersion.version} - {selectedVersion.estimatedMinutes || 7} minutes - created {formatDate(selectedVersion.createdAt)}</p></div><StatusPill active={selectedVersion.status === "active"} activeLabel="Live" inactiveLabel={selectedVersion.status} /></div><p className="mt-3 text-sm leading-6 text-charcoal/65">{selectedVersion.description || "No version description recorded."}</p></div>}</div>
          </article>

          <div className="grid gap-6 xl:grid-cols-[1.06fr_0.94fr]">
            <article className="rounded border border-sage bg-white p-5 shadow-[0_16px_34px_rgba(34,34,34,0.045)]"><div className="flex flex-wrap items-center justify-between gap-4 border-b border-sage pb-4"><div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">Questions</p><h2 className="mt-2 font-serif text-3xl leading-tight text-charcoal">The diagnosis</h2></div><button type="button" onClick={() => openQuestion(null)} disabled={!selectedVersion} className="inline-flex items-center gap-2 rounded-full bg-deepEmerald px-4 py-2 text-sm font-extrabold text-mistWhite transition hover:bg-charcoal disabled:opacity-60"><Plus size={15} aria-hidden="true" />Add question</button></div>{selectedVersion && <div className="mt-4 grid gap-2 border-b border-sage pb-4 sm:grid-cols-2">{(selectedVersion.categories || []).map((category) => <div key={category.key} className="flex items-center justify-between rounded border border-sage bg-mistWhite px-3 py-2 text-sm"><span className="font-bold text-charcoal">{category.name}</span><span className="font-extrabold text-deepEmerald">{categoryCounts[category.key] || 0}</span></div>)}</div>}<div className="mt-4 grid gap-3">{selectedQuestions.length ? selectedQuestions.slice().sort((left, right) => (left.displayOrder || 0) - (right.displayOrder || 0)).map((question) => <button key={question._id} type="button" onClick={() => openQuestion(question)} className="rounded border border-sage bg-mistWhite p-4 text-left transition hover:border-deepEmerald hover:bg-white"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-deepEmerald">{question.categoryKey} - Step {question.displayOrder}</p><p className="mt-2 text-sm font-bold leading-6 text-charcoal">{question.questionText}</p></div><StatusPill active={question.active !== false} /></div><div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-charcoal/60"><span className="rounded-full bg-sage px-3 py-1">{question.answerType.replaceAll("_", " ")}</span><span className="rounded-full bg-sage px-3 py-1">Weight {question.weight || 1}</span></div></button>) : <p className="rounded border border-dashed border-sage bg-mistWhite p-5 text-sm text-charcoal/60">No questions are attached to this version yet.</p>}</div></article>
            <article className="rounded border border-sage bg-white p-5 shadow-[0_16px_34px_rgba(34,34,34,0.045)]"><div className="flex flex-wrap items-center justify-between gap-4 border-b border-sage pb-4"><div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">Recommendation Rules</p><h2 className="mt-2 font-serif text-3xl leading-tight text-charcoal">The next right action</h2></div><button type="button" onClick={() => openRule(null)} className="inline-flex items-center gap-2 rounded-full bg-deepEmerald px-4 py-2 text-sm font-extrabold text-mistWhite transition hover:bg-charcoal"><Plus size={15} aria-hidden="true" />Add rule</button></div><div className="mt-4 grid gap-3">{rules.length ? rules.map((rule) => <button key={rule._id} type="button" onClick={() => openRule(rule)} className="rounded border border-sage bg-mistWhite p-4 text-left transition hover:border-deepEmerald hover:bg-white"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-sm font-extrabold text-charcoal">{rule.name}</p><p className="mt-2 line-clamp-2 text-sm leading-6 text-charcoal/62">{rule.explanation}</p></div><StatusPill active={rule.active !== false} /></div><div className="mt-3 flex flex-wrap gap-2 text-xs font-bold"><span className="rounded-full bg-sage px-3 py-1 text-deepEmerald">Priority {rule.priority || 0}</span>{rule.offer?.name && <span className="rounded-full bg-mutedMint px-3 py-1 text-deepEmerald">{rule.offer.name}</span>}{rule.resource?.title && <span className="rounded-full bg-sage px-3 py-1 text-charcoal">Email resource: {rule.resource.title}</span>}</div></button>) : <p className="rounded border border-dashed border-sage bg-mistWhite p-5 text-sm text-charcoal/60">No rules yet. Add a default rule so every assessment ends with a useful next step.</p>}</div></article>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
            <article className="rounded border border-sage bg-white p-5 shadow-[0_16px_34px_rgba(34,34,34,0.045)]"><div className="flex items-center justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">Score Stages</p><h2 className="mt-2 font-serif text-3xl leading-tight text-charcoal">How results are named</h2></div><button type="button" onClick={() => { setSelectedRangeId(""); setRangeForm(emptyRange); }} className="inline-grid size-10 place-items-center rounded-full bg-deepEmerald text-mistWhite transition hover:bg-charcoal" aria-label="Create score stage"><Plus size={17} aria-hidden="true" /></button></div><div className="mt-5 grid gap-3">{scoreRanges.map((range) => <button key={range._id} type="button" onClick={() => selectRange(range)} className={`rounded border p-4 text-left transition ${selectedRangeId === range._id ? "border-deepEmerald bg-mutedMint/55" : "border-sage bg-mistWhite hover:border-deepEmerald hover:bg-white"}`}><div className="flex items-center justify-between gap-3"><p className="font-extrabold text-charcoal">{range.name}</p><span className="rounded-full bg-sage px-3 py-1 text-xs font-extrabold text-deepEmerald">{range.minScore}-{range.maxScore}</span></div><p className="mt-2 line-clamp-2 text-sm leading-6 text-charcoal/60">{range.description}</p></button>)}</div></article>
            <form onSubmit={saveRange} className="rounded border border-sage bg-white p-5 shadow-[0_16px_34px_rgba(34,34,34,0.045)]"><div className="flex flex-wrap items-center justify-between gap-4 border-b border-sage pb-4"><div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">Result Content</p><h2 className="mt-2 font-serif text-3xl leading-tight text-charcoal">{selectedRangeId ? "Edit score stage" : "New score stage"}</h2></div><button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-deepEmerald px-4 py-2 text-sm font-extrabold text-mistWhite transition hover:bg-charcoal disabled:opacity-60">{saving ? <Loader2 className="animate-spin" size={15} aria-hidden="true" /> : <Save size={15} aria-hidden="true" />}Save stage</button></div><div className="mt-5 grid gap-4 md:grid-cols-2"><Field label="Stage name" className="md:col-span-2"><input className="input bg-mistWhite" value={rangeForm.name} onChange={(event) => updateRange("name", event.target.value)} required /></Field><Field label="Minimum score"><input className="input bg-mistWhite" type="number" value={rangeForm.minScore} onChange={(event) => updateRange("minScore", event.target.value)} required /></Field><Field label="Maximum score"><input className="input bg-mistWhite" type="number" value={rangeForm.maxScore} onChange={(event) => updateRange("maxScore", event.target.value)} required /></Field><Field label="Short result description" className="md:col-span-2"><textarea className="input min-h-24 bg-mistWhite" value={rangeForm.description} onChange={(event) => updateRange("description", event.target.value)} required /></Field><Field label="What this means" className="md:col-span-2"><textarea className="input min-h-24 bg-mistWhite" value={rangeForm.report?.whatItMeans || ""} onChange={(event) => updateRangeReport("whatItMeans", event.target.value)} /></Field><Field label="Biggest opportunity" className="md:col-span-2"><textarea className="input min-h-24 bg-mistWhite" value={rangeForm.report?.biggestOpportunity || ""} onChange={(event) => updateRangeReport("biggestOpportunity", event.target.value)} /></Field><Field label="Next steps, one per line" className="md:col-span-2"><textarea className="input min-h-24 bg-mistWhite" value={Array.isArray(rangeForm.report?.nextSteps) ? rangeForm.report.nextSteps.join("\n") : rangeForm.report?.nextSteps || ""} onChange={(event) => updateRangeReport("nextSteps", event.target.value)} /></Field><Field label="Recommended resource title"><input className="input bg-mistWhite" value={rangeForm.report?.recommendedResourceTitle || ""} onChange={(event) => updateRangeReport("recommendedResourceTitle", event.target.value)} /></Field><Field label="Result CTA text"><input className="input bg-mistWhite" value={rangeForm.primaryCtaText || ""} onChange={(event) => updateRange("primaryCtaText", event.target.value)} /></Field><Field label="Result CTA URL" className="md:col-span-2"><input className="input bg-mistWhite" value={rangeForm.primaryCtaUrl || ""} onChange={(event) => updateRange("primaryCtaUrl", event.target.value)} placeholder="/assessment or https://..." /></Field></div></form>
          </div>
        </div>
      )}

      {questionEditor && <Modal title={questionEditor.id ? "Edit assessment question" : "Add assessment question"} eyebrow="Question Builder" onClose={() => setQuestionEditor(null)}><form onSubmit={saveQuestion} className="grid gap-5"><div className="grid gap-4 md:grid-cols-2"><Field label="Internal key"><input className="input bg-white" value={questionEditor.key} onChange={(event) => setQuestionEditor((current) => ({ ...current, key: event.target.value }))} placeholder="e.g. story-clarity" required /></Field><Field label="Category"><select className="input bg-white" value={questionEditor.categoryKey} onChange={(event) => setQuestionEditor((current) => ({ ...current, categoryKey: event.target.value }))}>{(selectedVersion?.categories || []).map((category) => <option key={category.key} value={category.key}>{category.name}</option>)}</select></Field><Field label="Question" className="md:col-span-2"><textarea className="input min-h-24 bg-white" value={questionEditor.questionText} onChange={(event) => setQuestionEditor((current) => ({ ...current, questionText: event.target.value }))} required /></Field><Field label="Helper text" className="md:col-span-2"><textarea className="input min-h-20 bg-white" value={questionEditor.helperText || ""} onChange={(event) => setQuestionEditor((current) => ({ ...current, helperText: event.target.value }))} placeholder="Optional context shown below the question" /></Field><Field label="Answer type"><select className="input bg-white" value={questionEditor.answerType} onChange={(event) => setQuestionEditor((current) => ({ ...current, answerType: event.target.value }))}>{answerTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field><Field label="Display order"><input className="input bg-white" type="number" min="1" value={questionEditor.displayOrder} onChange={(event) => setQuestionEditor((current) => ({ ...current, displayOrder: event.target.value }))} required /></Field><Field label="Weight"><input className="input bg-white" type="number" min="0" step="0.1" value={questionEditor.weight} onChange={(event) => setQuestionEditor((current) => ({ ...current, weight: event.target.value }))} required /></Field></div>{choiceTypes.includes(questionEditor.answerType) && <Field label="Options - one per line: Label | value | score"><textarea className="input min-h-44 bg-white font-mono text-sm" value={questionEditor.optionsText} onChange={(event) => setQuestionEditor((current) => ({ ...current, optionsText: event.target.value }))} required /></Field>}<div className="flex flex-wrap gap-5 rounded border border-sage bg-mistWhite p-4">{[["required", "Required answer"], ["scored", "Counts toward score"], ["aiScored", "Use written evidence"], ["active", "Visible to visitors"]].map(([field, label]) => <label key={field} className="flex items-center gap-2 text-sm font-bold text-charcoal"><input type="checkbox" checked={Boolean(questionEditor[field])} onChange={(event) => setQuestionEditor((current) => ({ ...current, [field]: event.target.checked }))} />{label}</label>)}</div>{questionEditor.aiScored && <Field label="Evidence rubric"><textarea className="input min-h-24 bg-white" value={questionEditor.aiScoringRubric || ""} onChange={(event) => setQuestionEditor((current) => ({ ...current, aiScoringRubric: event.target.value }))} placeholder="What evidence should be assessed in this answer?" /></Field>}<div className="flex justify-end gap-3"><button type="button" onClick={() => setQuestionEditor(null)} className="rounded-full border border-sage px-4 py-2.5 text-sm font-extrabold text-charcoal transition hover:border-deepEmerald">Cancel</button><button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-deepEmerald px-5 py-2.5 text-sm font-extrabold text-mistWhite transition hover:bg-charcoal disabled:opacity-60">{saving ? <Loader2 className="animate-spin" size={16} aria-hidden="true" /> : <Save size={16} aria-hidden="true" />}Save question</button></div></form></Modal>}

      {ruleEditor && <Modal title={ruleEditor.id ? "Edit recommendation rule" : "Add recommendation rule"} eyebrow="Recommendation Builder" onClose={() => setRuleEditor(null)}><form onSubmit={saveRule} className="grid gap-6"><div className="grid gap-4 md:grid-cols-2"><Field label="Rule name" className="md:col-span-2"><input className="input bg-white" value={ruleEditor.name} onChange={(event) => setRuleEditor((current) => ({ ...current, name: event.target.value }))} required /></Field><Field label="Priority"><input className="input bg-white" type="number" value={ruleEditor.priority} onChange={(event) => setRuleEditor((current) => ({ ...current, priority: event.target.value }))} required /></Field><Field label="Email sequence key"><input className="input bg-white" value={ruleEditor.emailSequenceKey} onChange={(event) => setRuleEditor((current) => ({ ...current, emailSequenceKey: event.target.value }))} placeholder="Optional follow-up sequence" /></Field><Field label="Minimum score"><input className="input bg-white" type="number" min="0" value={ruleEditor.minScore} onChange={(event) => setRuleEditor((current) => ({ ...current, minScore: event.target.value }))} /></Field><Field label="Maximum score"><input className="input bg-white" type="number" min="0" value={ruleEditor.maxScore} onChange={(event) => setRuleEditor((current) => ({ ...current, maxScore: event.target.value }))} /></Field><Field label="Weakest categories" className="md:col-span-2"><input className="input bg-white" value={ruleEditor.weakestCategories} onChange={(event) => setRuleEditor((current) => ({ ...current, weakestCategories: event.target.value }))} placeholder="story, trust, positioning, proof, resonance" /></Field><Field label="Business stages"><input className="input bg-white" value={ruleEditor.businessStages} onChange={(event) => setRuleEditor((current) => ({ ...current, businessStages: event.target.value }))} placeholder="Comma-separated" /></Field><Field label="Readiness to invest"><input className="input bg-white" value={ruleEditor.readinessToInvest} onChange={(event) => setRuleEditor((current) => ({ ...current, readinessToInvest: event.target.value }))} placeholder="Comma-separated" /></Field></div><div className="grid gap-4 rounded border border-sage bg-mistWhite p-4 md:grid-cols-2"><Field label="Recommended offer"><select className="input bg-white" value={ruleEditor.offer} onChange={(event) => setRuleEditor((current) => ({ ...current, offer: event.target.value }))}><option value="">No offer attached</option>{offers.map((offer) => <option key={offer._id} value={offer._id}>{offer.name}</option>)}</select></Field><Field label="Email-native resource"><select className="input bg-white" value={ruleEditor.resource} onChange={(event) => setRuleEditor((current) => ({ ...current, resource: event.target.value }))}><option value="">No resource attached</option>{resources.map((resource) => <option key={resource._id} value={resource._id}>{resource.title}</option>)}</select></Field><Field label="Recommendation explanation" className="md:col-span-2"><textarea className="input min-h-28 bg-white" value={ruleEditor.explanation} onChange={(event) => setRuleEditor((current) => ({ ...current, explanation: event.target.value }))} required /></Field><Field label="Primary CTA text"><input className="input bg-white" value={ruleEditor.ctaText} onChange={(event) => setRuleEditor((current) => ({ ...current, ctaText: event.target.value }))} required /></Field><Field label="Primary CTA destination"><input className="input bg-white" value={ruleEditor.ctaDestination} onChange={(event) => setRuleEditor((current) => ({ ...current, ctaDestination: event.target.value }))} placeholder="/application/discern or https://..." required /></Field></div><label className="flex items-center gap-2 text-sm font-bold text-charcoal"><input type="checkbox" checked={Boolean(ruleEditor.active)} onChange={(event) => setRuleEditor((current) => ({ ...current, active: event.target.checked }))} />Use this rule in live recommendations</label><div className="flex justify-end gap-3"><button type="button" onClick={() => setRuleEditor(null)} className="rounded-full border border-sage px-4 py-2.5 text-sm font-extrabold text-charcoal transition hover:border-deepEmerald">Cancel</button><button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-deepEmerald px-5 py-2.5 text-sm font-extrabold text-mistWhite transition hover:bg-charcoal disabled:opacity-60">{saving ? <Loader2 className="animate-spin" size={16} aria-hidden="true" /> : <Sparkles size={16} aria-hidden="true" />}Save rule</button></div></form></Modal>}
    </section>
  );
}
