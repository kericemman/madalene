import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

const adminTokenKey = "earned_credibility_admin_access_token";

export const getAdminAccessToken = () => window.localStorage.getItem(adminTokenKey);

export const setAdminAccessToken = (token) => {
  if (token) window.localStorage.setItem(adminTokenKey, token);
};

export const clearAdminAccessToken = () => {
  window.localStorage.removeItem(adminTokenKey);
};

api.interceptors.request.use((config) => {
  const token = getAdminAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const postContactMessage = async (payload) => {
  const { data } = await api.post("/contact", payload);
  return data;
};

export const listPublicCodeOfResonanceEntries = async (params = {}) => {
  const { data } = await api.get("/code-of-resonance", { params });
  return data;
};

export const getPublicCodeOfResonanceEntry = async (slug) => {
  const { data } = await api.get(`/code-of-resonance/${slug}`);
  return data;
};

export const subscribeToNewsletter = async (payload) => {
  const { data } = await api.post("/newsletter/subscribe", payload);
  return data;
};

export const listPublicReviews = async (params = {}) => {
  const { data } = await api.get("/reviews", { params });
  return data;
};

export const submitReview = async (payload) => {
  const { data } = await api.post("/reviews", payload);
  return data;
};

export const listPublicOffers = async (params = {}) => {
  const { data } = await api.get("/offers", { params });
  return data;
};

export const getPublicOffer = async (slug) => {
  const { data } = await api.get(`/offers/${slug}`);
  return data;
};

export const submitApplication = async (payload) => {
  const { data } = await api.post("/applications", payload);
  return data;
};

export const submitBooking = async (payload) => {
  const { data } = await api.post("/bookings", payload);
  return data;
};

export const getActiveAssessment = async () => {
  const { data } = await api.get("/assessments/active");
  return data;
};

export const submitAssessment = async (payload) => {
  const { data } = await api.post("/assessments/submit", payload);
  return data;
};

export const getAssessmentResultByToken = async (token) => {
  const { data } = await api.get(`/assessments/results/${token}`);
  return data;
};

export const loginAdmin = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  setAdminAccessToken(data.data.accessToken);
  return data;
};

export const getCurrentAdmin = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};

export const logoutAdmin = async () => {
  try {
    await api.post("/auth/logout");
  } finally {
    clearAdminAccessToken();
  }
};

export const getAdminDashboard = async () => {
  const { data } = await api.get("/admin/dashboard");
  return data;
};

export const getPlatformReadiness = async () => {
  const { data } = await api.get("/admin/platform-readiness");
  return data;
};

export const listCodeOfResonanceEntries = async (params = {}) => {
  const { data } = await api.get("/admin/code-of-resonance", { params });
  return data;
};

export const createCodeOfResonanceEntry = async (payload) => {
  const { data } = await api.post("/admin/code-of-resonance", payload);
  return data;
};

export const updateCodeOfResonanceEntry = async (id, payload) => {
  const { data } = await api.patch(`/admin/code-of-resonance/${id}`, payload);
  return data;
};

export const deleteCodeOfResonanceEntry = async (id) => {
  const { data } = await api.delete(`/admin/code-of-resonance/${id}`);
  return data;
};

export const listMediaAssets = async (params = {}) => {
  const { data } = await api.get("/media", { params });
  return data;
};

export const listPublicMediaAssets = async (params = {}) => {
  const { data } = await api.get("/media/public", { params });
  return data;
};

export const updateMediaAsset = async (id, payload) => {
  const { data } = await api.patch(`/admin/media-assets/${id}`, payload);
  return data;
};

export const deleteMediaAsset = async (id) => {
  const { data } = await api.delete(`/media/${id}`);
  return data;
};

export const uploadMediaAsset = async ({ file, folder, altText, tags, usage, relatedModel }) => {
  const formData = new FormData();
  formData.append("file", file);
  if (folder) formData.append("folder", folder);
  if (altText) formData.append("altText", altText);
  if (tags) formData.append("tags", Array.isArray(tags) ? tags.join(",") : tags);
  if (usage) formData.append("usage", usage);
  if (relatedModel) formData.append("relatedModel", relatedModel);

  const { data } = await api.post("/media", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return data;
};

export const listAdminLeads = async (params = {}) => {
  const { data } = await api.get("/admin/leads", { params });
  return data;
};

export const getAdminLead = async (id) => {
  const { data } = await api.get(`/admin/leads/${id}`);
  return data;
};

export const updateAdminLead = async (id, payload) => {
  const { data } = await api.patch(`/admin/leads/${id}`, payload);
  return data;
};

export const addAdminLeadNote = async (id, payload) => {
  const { data } = await api.post(`/admin/leads/${id}/notes`, payload);
  return data;
};

export const listAssessmentResults = async (params = {}) => {
  const { data } = await api.get("/admin/assessment-results", { params });
  return data;
};

export const getAssessmentResult = async (id) => {
  const { data } = await api.get(`/admin/assessment-results/${id}`);
  return data;
};

export const sendAssessmentRecommendationEmail = async (id) => {
  const { data } = await api.post(`/admin/assessment-results/${id}/recommendation-email`);
  return data;
};

export const listScoreRanges = async (params = {}) => {
  const { data } = await api.get("/admin/score-ranges", { params });
  return data;
};

export const createScoreRange = async (payload) => {
  const { data } = await api.post("/admin/score-ranges", payload);
  return data;
};

export const updateScoreRange = async (id, payload) => {
  const { data } = await api.patch(`/admin/score-ranges/${id}`, payload);
  return data;
};

export const listAssessmentVersions = async (params = {}) => {
  const { data } = await api.get("/admin/assessment-versions", { params });
  return data;
};

export const duplicateAssessmentVersion = async (id) => {
  const { data } = await api.post(`/admin/assessment-versions/${id}/duplicate`);
  return data;
};

export const activateAssessmentVersion = async (id) => {
  const { data } = await api.post(`/admin/assessment-versions/${id}/activate`);
  return data;
};

export const updateAssessmentVersion = async (id, payload) => {
  const { data } = await api.patch(`/admin/assessment-versions/${id}`, payload);
  return data;
};

export const listAssessmentQuestions = async (params = {}) => {
  const { data } = await api.get("/admin/assessment-questions", { params });
  return data;
};

export const createAssessmentQuestion = async (payload) => {
  const { data } = await api.post("/admin/assessment-questions", payload);
  return data;
};

export const updateAssessmentQuestion = async (id, payload) => {
  const { data } = await api.patch(`/admin/assessment-questions/${id}`, payload);
  return data;
};

export const listRecommendationRules = async (params = {}) => {
  const { data } = await api.get("/admin/recommendation-rules", { params });
  return data;
};

export const createRecommendationRule = async (payload) => {
  const { data } = await api.post("/admin/recommendation-rules", payload);
  return data;
};

export const updateRecommendationRule = async (id, payload) => {
  const { data } = await api.patch(`/admin/recommendation-rules/${id}`, payload);
  return data;
};

export const listAdminResources = async (params = {}) => {
  const { data } = await api.get("/admin/resources", { params });
  return data;
};

export const listContactMessages = async (params = {}) => {
  const { data } = await api.get("/admin/contact-messages", { params });
  return data;
};

export const getContactMessage = async (id) => {
  const { data } = await api.get(`/admin/contact-messages/${id}`);
  return data;
};

export const updateContactMessage = async (id, payload) => {
  const { data } = await api.patch(`/admin/contact-messages/${id}`, payload);
  return data;
};

export const listApplications = async (params = {}) => {
  const { data } = await api.get("/admin/applications", { params });
  return data;
};

export const getApplication = async (id) => {
  const { data } = await api.get(`/admin/applications/${id}`);
  return data;
};

export const updateApplication = async (id, payload) => {
  const { data } = await api.patch(`/admin/applications/${id}`, payload);
  return data;
};

export const listBookings = async (params = {}) => {
  const { data } = await api.get("/admin/bookings", { params });
  return data;
};

export const getBooking = async (id) => {
  const { data } = await api.get(`/admin/bookings/${id}`);
  return data;
};

export const updateBooking = async (id, payload) => {
  const { data } = await api.patch(`/admin/bookings/${id}`, payload);
  return data;
};

export const listAdminOffers = async (params = {}) => {
  const { data } = await api.get("/admin/offers", { params });
  return data;
};

export const createAdminOffer = async (payload) => {
  const { data } = await api.post("/admin/offers", payload);
  return data;
};

export const updateAdminOffer = async (id, payload) => {
  const { data } = await api.patch(`/admin/offers/${id}`, payload);
  return data;
};

export const listEmailTemplates = async (params = {}) => {
  const { data } = await api.get("/admin/email-templates", { params });
  return data;
};

export const updateEmailTemplate = async (id, payload) => {
  const { data } = await api.patch(`/admin/email-templates/${id}`, payload);
  return data;
};

export const listScheduledEmails = async (params = {}) => {
  const { data } = await api.get("/admin/scheduled-emails", { params });
  return data;
};

export const retryScheduledEmail = async (id) => {
  const { data } = await api.post(`/admin/scheduled-emails/${id}/retry`);
  return data;
};

export const cancelScheduledEmail = async (id) => {
  const { data } = await api.post(`/admin/scheduled-emails/${id}/cancel`);
  return data;
};

export const listAdminReviews = async (params = {}) => {
  const { data } = await api.get("/admin/reviews", { params });
  return data;
};

export const updateAdminReview = async (id, payload) => {
  const { data } = await api.patch(`/admin/reviews/${id}`, payload);
  return data;
};

export const getCodeAutomation = async () => {
  const { data } = await api.get("/admin/code-automation");
  return data;
};

export const updateCodeAutomationTemplate = async (id, payload) => {
  const { data } = await api.patch(`/admin/code-automation/templates/${id}`, payload);
  return data;
};

export const listAdminUsers = async (params = {}) => {
  const { data } = await api.get("/admin/users", { params });
  return data;
};

export const createAdminUser = async (payload) => {
  const { data } = await api.post("/admin/users", payload);
  return data;
};

export const updateAdminUser = async (id, payload) => {
  const { data } = await api.patch(`/admin/users/${id}`, payload);
  return data;
};
