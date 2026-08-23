import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Clock, Loader2, LockKeyhole } from "lucide-react";
import { getActiveAssessment, submitAssessment } from "../../services/api.js";

const initialParticipant = {
  firstName: "",
  lastName: "",
  email: "",
  profession: "",
  businessStage: "",
  primaryChallenge: "",
  desiredOutcome: "",
  readinessToInvest: "",
  website: "",
  linkedInProfile: "",
  country: "",
  newsletterConsent: true,
  marketingConsent: true,
  consent: false
};

const businessStageOptions = [
  { value: "", label: "Select stage" },
  { value: "starting", label: "Starting or clarifying my direction" },
  { value: "growing", label: "Growing and refining my visibility" },
  { value: "established", label: "Established and ready for stronger positioning" },
  { value: "transitioning", label: "Transitioning into a new chapter" }
];

const readinessOptions = [
  { value: "", label: "Select readiness" },
  { value: "learning", label: "I want to learn first" },
  { value: "ready", label: "I am ready for a focused next step" },
  { value: "ready_for_strategic_support", label: "I am ready for strategic support" }
];

const isAnswered = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  return value !== undefined && value !== null;
};

const emailLooksValid = (email) => /\S+@\S+\.\S+/.test(email);

const fieldClass =
  "input bg-white text-charcoal placeholder:text-charcoal/38 focus:border-deepEmerald";

function ProgressDots({ steps, activeIndex }) {
  return (
    <div className="flex flex-wrap gap-2">
      {steps.map((step, index) => (
        <span
          key={step.key}
          className={`h-2.5 flex-1 rounded-full transition ${
            index <= activeIndex ? "bg-deepEmerald" : "bg-sage"
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function ProfileStep({ participant, onChange }) {
  const update = (event) => {
    const { name, value } = event.target;
    onChange({ [name]: value });
  };

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-extrabold text-charcoal">First name</span>
          <input
            className={fieldClass}
            name="firstName"
            value={participant.firstName}
            onChange={update}
            placeholder="Magdalene"
            required
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-extrabold text-charcoal">Last name</span>
          <input
            className={fieldClass}
            name="lastName"
            value={participant.lastName}
            onChange={update}
            placeholder="Wambui"
          />
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-extrabold text-charcoal">Email</span>
        <input
          className={fieldClass}
          type="email"
          name="email"
          value={participant.email}
          onChange={update}
          placeholder="you@example.com"
          required
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-extrabold text-charcoal">Profession</span>
          <input
            className={fieldClass}
            name="profession"
            value={participant.profession}
            onChange={update}
            placeholder="Coach, consultant, therapist..."
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-extrabold text-charcoal">Business stage</span>
          <select className={fieldClass} name="businessStage" value={participant.businessStage} onChange={update}>
            {businessStageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-extrabold text-charcoal">Website</span>
          <input
            className={fieldClass}
            name="website"
            value={participant.website}
            onChange={update}
            placeholder="https://..."
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-extrabold text-charcoal">LinkedIn</span>
          <input
            className={fieldClass}
            name="linkedInProfile"
            value={participant.linkedInProfile}
            onChange={update}
            placeholder="https://linkedin.com/in/..."
          />
        </label>
      </div>
    </div>
  );
}

function QuestionStep({ step, answers, onAnswer }) {
  return (
    <div className="grid gap-5">
      {step.questions.map((question) => (
        <QuestionField
          key={question.key}
          question={question}
          value={answers[question.key]}
          onChange={(value) => onAnswer(question.key, value)}
        />
      ))}
    </div>
  );
}

function QuestionField({ question, value, onChange }) {
  if (question.answerType === "long_text") {
    const minimumLength = Number(question.minAnswerLength || 0);
    const currentLength = String(value || "").trim().length;

    return (
      <label className="grid gap-3 rounded border border-sage bg-white p-4">
        <QuestionHeader question={question} />
        <textarea
          className={`${fieldClass} min-h-32`}
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Share a specific example in a few sentences..."
          maxLength={1200}
        />
        {minimumLength > 0 && (
          <span className={`text-xs font-semibold ${currentLength >= minimumLength ? "text-deepEmerald" : "text-charcoal/52"}`}>
            {currentLength}/{minimumLength} characters minimum
          </span>
        )}
      </label>
    );
  }

  if (question.answerType === "short_text") {
    return (
      <label className="grid gap-3 rounded border border-sage bg-white p-4">
        <QuestionHeader question={question} />
        <input
          className={fieldClass}
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Your answer"
        />
      </label>
    );
  }

  if (question.answerType === "multiple_choice") {
    const selected = Array.isArray(value) ? value : [];
    return (
      <fieldset className="rounded border border-sage bg-white p-4">
        <QuestionHeader question={question} />
        <div className="mt-4 grid gap-3">
          {question.options.map((option) => {
            const checked = selected.includes(option.value);
            return (
              <label
                key={option.value}
                className={`flex cursor-pointer items-start gap-3 rounded border p-3 transition ${
                  checked ? "border-deepEmerald bg-mutedMint/55" : "border-sage bg-mistWhite hover:border-deepEmerald/35"
                }`}
              >
                <input
                  type="checkbox"
                  className="mt-1 accent-deepEmerald"
                  checked={checked}
                  onChange={(event) => {
                    if (event.target.checked) onChange([...selected, option.value]);
                    else onChange(selected.filter((item) => item !== option.value));
                  }}
                />
                <span className="text-sm font-semibold text-charcoal/78">{option.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
    );
  }

  const isLikertScale = question.answerType === "likert" && question.options.length === 5;
  const choiceColumns = isLikertScale ? "grid-cols-5" : question.options.length <= 4 ? "sm:grid-cols-2" : "sm:grid-cols-5";

  return (
    <fieldset className="rounded border border-sage bg-white p-4">
      <QuestionHeader question={question} />
      {isLikertScale && (
        <div className="mt-4 flex items-center justify-between gap-3 text-[11px] font-bold uppercase tracking-[0.08em] text-charcoal/52">
          <span>1 = Strongly disagree</span>
          <span>5 = Strongly agree</span>
        </div>
      )}
      <div className={`mt-4 grid gap-3 ${choiceColumns}`}>
        {question.options.map((option) => (
          <label
            key={option.value}
            className={`flex cursor-pointer items-center rounded border text-left transition ${
              isLikertScale ? "min-h-14 justify-center p-2 text-center" : "min-h-[88px] p-4"
            } ${
              value === option.value
                ? "border-deepEmerald bg-mutedMint text-deepEmerald"
                : "border-sage bg-mistWhite text-charcoal/68 hover:border-deepEmerald/35 hover:text-deepEmerald"
            }`}
          >
            <input
              type="radio"
              name={question.key}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {isLikertScale ? (
              <span className="text-lg font-black leading-none">
                <span aria-hidden="true">{option.value}</span>
                <span className="sr-only">{option.label}</span>
              </span>
            ) : (
              <span className="text-sm font-bold leading-6">{option.label}</span>
            )}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function QuestionHeader({ question }) {
  return (
    <div>
      <p className="text-lg font-extrabold leading-7 text-charcoal">{question.questionText}</p>
      {question.helperText && <p className="mt-2 text-sm leading-6 text-charcoal/60">{question.helperText}</p>}
    </div>
  );
}

function ContextStep({ participant, onChange }) {
  const update = (event) => {
    const { name, value, type, checked } = event.target;
    onChange({ [name]: type === "checkbox" ? checked : value });
  };

  return (
    <div className="grid gap-5">
      <label className="grid gap-2">
        <span className="text-sm font-extrabold text-charcoal">What feels most challenging right now?</span>
        <textarea
          className={`${fieldClass} min-h-28`}
          name="primaryChallenge"
          value={participant.primaryChallenge}
          onChange={update}
          placeholder="What are people not understanding, trusting, or choosing yet?"
        />
        <span className="text-xs leading-5 text-charcoal/58">
          Optional context helps shape your recommendation. Your pillar evidence responses determine the evidence review.
        </span>
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-extrabold text-charcoal">What outcome are you hoping for?</span>
        <textarea
          className={`${fieldClass} min-h-24`}
          name="desiredOutcome"
          value={participant.desiredOutcome}
          onChange={update}
          placeholder="Clearer message, stronger proof, more aligned enquiries..."
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-extrabold text-charcoal">Readiness</span>
          <select className={fieldClass} name="readinessToInvest" value={participant.readinessToInvest} onChange={update}>
            {readinessOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-extrabold text-charcoal">Country</span>
          <input
            className={fieldClass}
            name="country"
            value={participant.country}
            onChange={update}
            placeholder="Kenya, United States..."
          />
        </label>
      </div>

      <div className="grid gap-3 rounded border border-sage bg-sage/35 p-4">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            name="newsletterConsent"
            checked={participant.newsletterConsent}
            onChange={update}
            className="mt-1 accent-deepEmerald"
          />
          <span className="text-sm leading-6 text-charcoal/72">
            Send me trust-building notes and related resources from The Code of Resonance.
          </span>
        </label>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            name="marketingConsent"
            checked={participant.marketingConsent}
            onChange={update}
            className="mt-1 accent-deepEmerald"
          />
          <span className="text-sm leading-6 text-charcoal/72">
            I agree to receive relevant recommendations based on my assessment result.
          </span>
        </label>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            name="consent"
            checked={participant.consent}
            onChange={update}
            className="mt-1 accent-deepEmerald"
            required
          />
          <span className="text-sm font-semibold leading-6 text-charcoal">
            I agree for my answers, including automated evidence analysis, to be processed so my Earned Credibility result can be calculated and saved.
          </span>
        </label>
      </div>
    </div>
  );
}

export default function AssessmentLandingPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [participant, setParticipant] = useState(initialParticipant);
  const [answers, setAnswers] = useState({});
  const [stepIndex, setStepIndex] = useState(0);
  const [status, setStatus] = useState("loading");
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [error, setError] = useState("");
  const [stepError, setStepError] = useState("");

  useEffect(() => {
    let active = true;
    setStatus("loading");

    getActiveAssessment()
      .then((response) => {
        if (!active) return;
        setAssessment(response.data.assessment);
        setQuestions(response.data.questions || []);
        setStatus("ready");
      })
      .catch((requestError) => {
        if (!active) return;
        setError(requestError.response?.data?.message || "Could not load the assessment right now.");
        setStatus("error");
      });

    return () => {
      active = false;
    };
  }, []);

  const steps = useMemo(() => {
    if (!assessment) return [];
    const categorySteps = (assessment.categories || [])
      .map((category) => ({
        key: category.key,
        title: category.name,
        helper: `${category.description ? `${category.description} ` : ""}Rate the five statements, then share a brief piece of evidence for this pillar.`,
        questions: questions.filter((question) => question.categoryKey === category.key)
      }))
      .filter((step) => step.questions.length > 0);

    return [
      {
        key: "profile",
        title: "Before we begin",
        helper: "Tell us where to send your result and how to personalise the recommendation.",
        questions: []
      },
      ...categorySteps,
      {
        key: "context",
        title: "Context & consent",
        helper: "One final layer so the dashboard can recommend a useful next action.",
        questions: []
      }
    ];
  }, [assessment, questions]);

  const activeStep = steps[stepIndex];
  const progress = steps.length ? Math.round(((stepIndex + 1) / steps.length) * 100) : 0;

  const updateParticipant = (patch) => {
    setParticipant((current) => ({ ...current, ...patch }));
  };

  const updateAnswer = (questionKey, value) => {
    setAnswers((current) => ({ ...current, [questionKey]: value }));
  };

  const validateStep = (targetStep = activeStep) => {
    if (!targetStep) return false;

    if (targetStep.key === "profile") {
      if (!participant.firstName.trim()) return "Please add your first name.";
      if (!emailLooksValid(participant.email)) return "Please add a valid email address.";
      return "";
    }

    if (targetStep.key === "context") {
      if (!participant.consent) return "Please confirm consent before submitting.";
      return "";
    }

    const missingQuestion = targetStep.questions.find((question) => question.required && !isAnswered(answers[question.key]));
    if (missingQuestion) return "Please answer every required question on this step.";
    return "";
  };

  const handleNext = () => {
    const validationMessage = validateStep();
    if (validationMessage) {
      setStepError(validationMessage);
      return;
    }

    setStepError("");
    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  };

  const handleBack = () => {
    setStepError("");
    setStepIndex((current) => Math.max(current - 1, 0));
  };

  const handleSubmit = async () => {
    const currentValidation = validateStep();
    if (currentValidation) {
      setStepError(currentValidation);
      return;
    }

    const missingStep = steps.find((step) => validateStep(step));
    if (missingStep) {
      setStepIndex(steps.findIndex((step) => step.key === missingStep.key));
      setStepError(validateStep(missingStep));
      return;
    }

    setSubmitStatus("loading");
    setStepError("");
    setError("");

    try {
      const answerPayload = questions
        .map((question) => ({
          questionKey: question.key,
          value: answers[question.key]
        }))
        .filter((answer) => isAnswered(answer.value));

      const response = await submitAssessment({
        participant: {
          ...participant,
          email: participant.email.toLowerCase().trim(),
          consentVersion: "2026-07"
        },
        answers: answerPayload,
        leadSource: "public_assessment_form"
      });

      const token = response.data.result?.resultToken;
      if (token) {
        navigate(`/results/${token}`, { state: { result: response.data.result } });
      } else {
        setSubmitStatus("success");
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not submit the assessment right now.");
      setSubmitStatus("error");
    }
  };

  if (status === "loading") {
    return (
      <section className="container-shell grid min-h-[62vh] place-items-center py-16">
        <div className="flex items-center gap-3 text-sm font-extrabold text-deepEmerald">
          <Loader2 className="animate-spin" size={18} aria-hidden="true" />
          Loading assessment...
        </div>
      </section>
    );
  }

  if (status === "error") {
    return (
      <section className="container-shell grid min-h-[62vh] place-items-center py-16 text-center">
        <div className="max-w-xl">
          <AlertCircle className="mx-auto text-deepEmerald" size={34} aria-hidden="true" />
          <h1 className="mt-4 font-serif text-4xl">Assessment unavailable</h1>
          <p className="mt-3 text-charcoal/66">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-mistWhite py-12 sm:py-16 lg:py-20">
      <div className="container-shell">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-mutedMint px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">
              <Clock size={15} aria-hidden="true" />
              {assessment.estimatedMinutes || 7}-Minute Assessment
            </p>
            <h1 className="font-serif text-3xl leading-tight text-charcoal text-balance sm:text-4xl">
              How visible is the credibility you have already earned?
            </h1>
          </div>
          <p className="text-lg md:text-xl leading-9 text-charcoal/72">
            Having credibility and having a brand that communicates it are two different things. This assessment shows where your
            credibility is already working, where it may be getting lost, and what to focus on next.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[310px_minmax(0,1fr)]">
          <aside className="rounded border border-charcoal bg-charcoal p-5 text-mistWhite shadow-[0_18px_45px_rgba(34,34,34,0.16)] lg:sticky lg:top-28 lg:self-start">
            <div className="lg:hidden">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-mutedMint">
                  Step {stepIndex + 1} of {steps.length}
                </p>
                <p className="text-sm font-extrabold text-mutedMint">{progress}%</p>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-mistWhite/14">
                <div
                  className="h-full rounded-full bg-mutedMint transition-[width] duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-4 font-serif text-2xl leading-tight text-mistWhite">{activeStep.title}</p>
              {activeStep.helper && <p className="mt-2 text-sm leading-6 text-mistWhite/62">{activeStep.helper}</p>}
            </div>

            <div className="hidden lg:block">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-mutedMint">Progress</p>
              <p className="mt-3 font-serif text-4xl">{progress}%</p>
              <ProgressDots steps={steps} activeIndex={stepIndex} />
              <div className="mt-6 grid gap-3">
                {steps.map((step, index) => (
                  <button
                    key={step.key}
                    type="button"
                    onClick={() => {
                      if (index <= stepIndex) setStepIndex(index);
                    }}
                    className={`rounded border px-3 py-3 text-left text-sm transition ${
                      index === stepIndex
                        ? "border-mutedMint bg-mistWhite/[0.08] text-mutedMint"
                        : index < stepIndex
                          ? "border-mistWhite/15 text-mistWhite/72 hover:border-mutedMint/50"
                          : "border-mistWhite/8 text-mistWhite/35"
                    }`}
                  >
                    <span className="block text-xs font-extrabold uppercase tracking-[0.14em]">Step {index + 1}</span>
                    <span className="mt-1 block font-bold">{step.title}</span>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex gap-3 rounded border border-mistWhite/10 bg-mistWhite/[0.05] p-3 text-sm leading-6 text-mistWhite/62">
                <LockKeyhole className="mt-1 shrink-0 text-mutedMint" size={17} aria-hidden="true" />
                Your result is saved securely and connected to the admin dashboard for follow-up.
              </div>
            </div>
          </aside>

          <div className="rounded border border-sage bg-mistWhite shadow-[0_18px_45px_rgba(34,34,34,0.04)]">
            <div className="border-b border-sage bg-white p-5 sm:p-6">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-deepEmerald">
                Step {stepIndex + 1} of {steps.length}
              </p>
              <h2 className="mt-2 font-serif text-4xl leading-tight text-charcoal">{activeStep.title}</h2>
              {activeStep.helper && <p className="mt-3 text-sm leading-6 text-charcoal/62">{activeStep.helper}</p>}
            </div>

            <div className="p-5 sm:p-6">
              {activeStep.key === "profile" && <ProfileStep participant={participant} onChange={updateParticipant} />}
              {activeStep.key !== "profile" && activeStep.key !== "context" && (
                <>
                  <div className="mb-5 border-l-2 border-deepEmerald bg-sage/35 px-4 py-3 text-sm leading-6 text-charcoal/72">
                    Choose the answer that reflects your current reality, not where you would like your brand to be. There are no right or wrong answers.
                  </div>
                  <QuestionStep step={activeStep} answers={answers} onAnswer={updateAnswer} />
                </>
              )}
              {activeStep.key === "context" && <ContextStep participant={participant} onChange={updateParticipant} />}

              {(stepError || error || submitStatus === "success") && (
                <div
                  className={`mt-6 flex gap-3 rounded border p-4 text-sm font-semibold ${
                    submitStatus === "success"
                      ? "border-deepEmerald/20 bg-mutedMint text-deepEmerald"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {submitStatus === "success" ? (
                    <CheckCircle2 className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
                  ) : (
                    <AlertCircle className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
                  )}
                  <p>{submitStatus === "success" ? "Assessment submitted successfully." : stepError || error}</p>
                </div>
              )}

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-sage pt-5 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={stepIndex === 0 || submitStatus === "loading"}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-charcoal/15 px-5 py-3 text-sm font-extrabold text-charcoal transition hover:border-deepEmerald hover:text-deepEmerald disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft size={16} aria-hidden="true" />
                  Back
                </button>

                {stepIndex < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-deepEmerald px-5 py-3 text-sm font-extrabold text-mistWhite transition hover:bg-charcoal"
                  >
                    Continue
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitStatus === "loading"}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-deepEmerald px-5 py-3 text-sm font-extrabold text-mistWhite transition hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitStatus === "loading" ? <Loader2 className="animate-spin" size={16} aria-hidden="true" /> : <CheckCircle2 size={16} aria-hidden="true" />}
                    {submitStatus === "loading" ? "Scoring..." : "Get my result"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
