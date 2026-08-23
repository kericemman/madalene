const normalizeKey = (value) => String(value || "").trim().toLowerCase();
const round = (value, precision = 2) => {
  const multiplier = 10 ** precision;
  return Math.round(Number(value || 0) * multiplier) / multiplier;
};

const toPlainObject = (document) => {
  if (!document) return document;
  if (typeof document.toObject === "function") return document.toObject();
  return document;
};

const getAnswerValue = (answersByKey, question) =>
  answersByKey.get(String(question._id)) ?? answersByKey.get(question.key);

const optionScore = (question, value) => {
  const option = question.options?.find((item) => item.value === value);
  if (!option) return null;
  return option.score || 0;
};

const maxQuestionScore = (question) => {
  if (!question.scored) return 0;

  if (question.answerType === "multiple_choice") {
    return (question.options || [])
      .filter((option) => option.score > 0)
      .reduce((sum, option) => sum + option.score, 0);
  }

  if (["likert", "single_choice", "yes_no"].includes(question.answerType)) {
    return Math.max(...(question.options || []).map((option) => option.score || 0), 0);
  }

  return 0;
};

const scoreQuestion = (question, value) => {
  if (!question.scored) {
    return {
      scoreEarned: 0,
      maxScore: 0
    };
  }

  const maxScore = maxQuestionScore(question);

  if (question.answerType === "multiple_choice") {
    const values = Array.isArray(value) ? value : [];
    const scoreEarned = values.reduce((sum, selectedValue) => {
      const score = optionScore(question, selectedValue);
      return score === null ? sum : sum + score;
    }, 0);

    return {
      scoreEarned: Math.min(scoreEarned, maxScore),
      maxScore
    };
  }

  if (["likert", "single_choice", "yes_no"].includes(question.answerType)) {
    const scoreEarned = optionScore(question, value);
    return {
      scoreEarned: scoreEarned ?? 0,
      maxScore
    };
  }

  return {
    scoreEarned: 0,
    maxScore: 0
  };
};

export const validateAssessmentAnswers = ({ questions, answers }) => {
  const answersByKey = new Map();
  for (const answer of answers || []) {
    if (answer.questionId) answersByKey.set(String(answer.questionId), answer.value);
    if (answer.questionKey) answersByKey.set(answer.questionKey, answer.value);
  }

  const errors = [];

  for (const question of questions) {
    const value = getAnswerValue(answersByKey, question);
    const emptyArray = Array.isArray(value) && value.length === 0;
    const emptyString = typeof value === "string" && value.trim() === "";
    const missing = value === undefined || value === null || emptyArray || emptyString;

    if (question.required && missing) {
      errors.push({
        questionKey: question.key,
        message: "This question is required."
      });
      continue;
    }

    if (
      !missing &&
      ["short_text", "long_text"].includes(question.answerType) &&
      Number(question.minAnswerLength || 0) > 0 &&
      String(value).trim().length < Number(question.minAnswerLength)
    ) {
      errors.push({
        questionKey: question.key,
        message: `Please provide at least ${question.minAnswerLength} characters for this response.`
      });
      continue;
    }

    if (missing || !question.scored) continue;

    if (question.answerType === "multiple_choice") {
      const validValues = new Set(question.options.map((option) => option.value));
      const selectedValues = Array.isArray(value) ? value : [];
      const invalid = selectedValues.filter((selectedValue) => !validValues.has(selectedValue));
      if (invalid.length) {
        errors.push({
          questionKey: question.key,
          message: "One or more selected options are invalid."
        });
      }
      continue;
    }

    if (["likert", "single_choice", "yes_no"].includes(question.answerType)) {
      const validValues = new Set(question.options.map((option) => option.value));
      if (!validValues.has(value)) {
        errors.push({
          questionKey: question.key,
          message: "The selected option is invalid."
        });
      }
    }
  }

  return errors;
};

export const calculateAssessmentScore = ({ assessmentVersion, questions, answers }) => {
  const version = toPlainObject(assessmentVersion);
  const plainQuestions = questions.map(toPlainObject).filter((question) => question.active);
  const errors = validateAssessmentAnswers({ questions: plainQuestions, answers });

  if (errors.length) {
    const error = new Error("Assessment answers are incomplete or invalid.");
    error.statusCode = 422;
    error.errors = errors;
    throw error;
  }

  const answersByKey = new Map();
  for (const answer of answers || []) {
    if (answer.questionId) answersByKey.set(String(answer.questionId), answer.value);
    if (answer.questionKey) answersByKey.set(answer.questionKey, answer.value);
  }

  const categoryMap = new Map(
    version.categories.map((category) => [
      category.key,
      {
        key: category.key,
        name: category.name,
        weight: category.weight || 1,
        pointsEarned: 0,
        maxPoints: 0,
        score: 0
      }
    ])
  );

  const responseSnapshots = [];

  for (const question of plainQuestions) {
    const value = getAnswerValue(answersByKey, question);
    const { scoreEarned, maxScore } = scoreQuestion(question, value);
    const weightedScoreEarned = scoreEarned * (question.weight || 1);
    const weightedMaxScore = maxScore * (question.weight || 1);
    const category = categoryMap.get(question.categoryKey);

    if (category && question.scored) {
      category.pointsEarned += weightedScoreEarned;
      category.maxPoints += weightedMaxScore;
    }

    responseSnapshots.push({
      question: question._id,
      questionKey: question.key,
      questionText: question.questionText,
      categoryKey: question.categoryKey,
      answerType: question.answerType,
      value,
      scoreEarned,
      maxScore,
      weight: question.weight || 1,
      scored: question.scored
    });
  }

  const categoryScores = [...categoryMap.values()]
    .sort((a, b) => {
      const left = version.categories.find((category) => category.key === a.key)?.displayOrder || 0;
      const right = version.categories.find((category) => category.key === b.key)?.displayOrder || 0;
      return left - right;
    })
    .map((category) => ({
      ...category,
      score: category.maxPoints > 0 ? Math.round((category.pointsEarned / category.maxPoints) * 100) : 0
    }));

  const scoredCategories = categoryScores.filter((category) => category.maxPoints > 0);
  const rawTotalScore = round(scoredCategories.reduce((sum, category) => sum + category.pointsEarned, 0));
  const rawMaxScore = scoredCategories.reduce((sum, category) => sum + category.maxPoints, 0);
  const weightedScoreSum = scoredCategories.reduce(
    (sum, category) => sum + category.score * (category.weight || 1),
    0
  );
  const weightSum = scoredCategories.reduce((sum, category) => sum + (category.weight || 1), 0);
  const percentageScore = weightSum > 0 ? Math.round(weightedScoreSum / weightSum) : 0;
  const scoringMode = version.scoringMode || "percentage";
  const overallScore = scoringMode === "raw_total" ? Math.round(rawTotalScore) : percentageScore;
  const overallMaxScore = scoringMode === "raw_total" ? version.scoreDisplayMax || rawMaxScore || 25 : 100;

  const categoriesByStrength = [...scoredCategories].sort((a, b) => b.score - a.score);
  const categoriesByWeakness = [...scoredCategories].sort((a, b) => a.score - b.score);

  return {
    overallScore,
    overallMaxScore,
    categoryScores,
    strongestCategory: categoriesByStrength[0] || null,
    weakestCategory: categoriesByWeakness[0] || null,
    secondWeakestCategory: categoriesByWeakness[1] || null,
    responses: responseSnapshots,
    scoringSnapshot: {
      assessmentVersion: version._id,
      assessmentVersionNumber: version.version,
      scoringMode,
      overallMaxScore,
      rawTotalScore,
      rawMaxScore,
      percentageScore,
      categories: version.categories,
      questions: plainQuestions.map((question) => ({
        id: question._id,
        key: question.key,
        categoryKey: question.categoryKey,
        answerType: question.answerType,
        options: question.options,
        weight: question.weight,
        scored: question.scored,
        required: question.required,
        versionNumber: question.versionNumber
      }))
    }
  };
};

export const publicQuestion = (question) => ({
  id: question._id,
  key: question.key,
  questionText: question.questionText,
  helperText: question.helperText,
  categoryKey: question.categoryKey,
  displayOrder: question.displayOrder,
  answerType: question.answerType,
  required: question.required,
  minAnswerLength: question.minAnswerLength || 0,
  options: question.options
    .slice()
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
    .map((option) => ({
      label: option.label,
      value: option.value,
      displayOrder: option.displayOrder
    }))
});

export const normalizeMatchValue = (value) => normalizeKey(value);
