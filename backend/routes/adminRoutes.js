import { Router } from "express";
import {
  activateAssessmentVersion,
  createAssessmentVersion,
  duplicateAssessmentVersion,
  createOffer,
  createQuestion,
  createRecommendationRule,
  createResource,
  createScoreRange,
  listAssessmentVersions,
  listOffers,
  listQuestions,
  listRecommendationRules,
  listResources,
  listScoreRanges,
  updateAssessmentVersion,
  updateOffer,
  updateQuestion,
  updateRecommendationRule,
  updateResource,
  updateScoreRange
} from "../controllers/adminAssessmentController.js";
import {
  createCodeOfResonanceEntry,
  deleteCodeOfResonanceEntry,
  getCodeOfResonanceEntry,
  listCodeOfResonanceEntries,
  updateCodeOfResonanceEntry
} from "../controllers/adminCodeOfResonanceController.js";
import {
  addLeadNote,
  cancelScheduledEmail,
  createAdminUser,
  createEmailTemplate,
  getApplication,
  getBooking,
  getCodeOfResonanceAutomation,
  getAssessmentResult,
  getContactMessage,
  getDashboard,
  getPlatformReadiness,
  getLead,
  listAdminUsers,
  listApplications,
  listAssessmentResults,
  listBookings,
  listContactMessages,
  listEmailTemplates,
  listLeads,
  listMediaAssets,
  listReviews,
  listScheduledEmails,
  retryScheduledEmail,
  sendAssessmentRecommendationEmail,
  updateAdminUser,
  updateApplication,
  updateBooking,
  updateCodeOfResonanceAutomationTemplate,
  updateContactMessage,
  updateEmailTemplate,
  updateLead,
  updateMediaAsset,
  updateReview,
  updateScheduledEmail
} from "../controllers/adminOperationsController.js";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth, requireRole("admin"));

router.get("/dashboard", getDashboard);
router.get("/platform-readiness", getPlatformReadiness);

router.get("/code-of-resonance", listCodeOfResonanceEntries);
router.post("/code-of-resonance", createCodeOfResonanceEntry);
router.get("/code-of-resonance/:id", getCodeOfResonanceEntry);
router.patch("/code-of-resonance/:id", updateCodeOfResonanceEntry);
router.delete("/code-of-resonance/:id", deleteCodeOfResonanceEntry);

router.get("/leads", listLeads);
router.get("/leads/:id", getLead);
router.patch("/leads/:id", updateLead);
router.post("/leads/:id/notes", addLeadNote);

router.get("/assessment-results", listAssessmentResults);
router.post("/assessment-results/:id/recommendation-email", sendAssessmentRecommendationEmail);
router.get("/assessment-results/:id", getAssessmentResult);

router.get("/contact-messages", listContactMessages);
router.get("/contact-messages/:id", getContactMessage);
router.patch("/contact-messages/:id", updateContactMessage);

router.get("/applications", listApplications);
router.get("/applications/:id", getApplication);
router.patch("/applications/:id", updateApplication);

router.get("/bookings", listBookings);
router.get("/bookings/:id", getBooking);
router.patch("/bookings/:id", updateBooking);

router.get("/reviews", listReviews);
router.patch("/reviews/:id", updateReview);

router.get("/email-templates", listEmailTemplates);
router.post("/email-templates", createEmailTemplate);
router.patch("/email-templates/:id", updateEmailTemplate);

router.get("/code-automation", getCodeOfResonanceAutomation);
router.patch("/code-automation/templates/:id", updateCodeOfResonanceAutomationTemplate);

router.get("/scheduled-emails", listScheduledEmails);
router.patch("/scheduled-emails/:id", updateScheduledEmail);
router.post("/scheduled-emails/:id/retry", retryScheduledEmail);
router.post("/scheduled-emails/:id/cancel", cancelScheduledEmail);

router.get("/media-assets", listMediaAssets);
router.patch("/media-assets/:id", updateMediaAsset);

router.get("/users", listAdminUsers);
router.post("/users", createAdminUser);
router.patch("/users/:id", updateAdminUser);

router.get("/assessment-versions", listAssessmentVersions);
router.post("/assessment-versions", createAssessmentVersion);
router.post("/assessment-versions/:id/duplicate", duplicateAssessmentVersion);
router.post("/assessment-versions/:id/activate", activateAssessmentVersion);
router.patch("/assessment-versions/:id", updateAssessmentVersion);

router.get("/assessment-questions", listQuestions);
router.post("/assessment-questions", createQuestion);
router.patch("/assessment-questions/:id", updateQuestion);

router.get("/score-ranges", listScoreRanges);
router.post("/score-ranges", createScoreRange);
router.patch("/score-ranges/:id", updateScoreRange);

router.get("/offers", listOffers);
router.post("/offers", createOffer);
router.patch("/offers/:id", updateOffer);

router.get("/resources", listResources);
router.post("/resources", createResource);
router.patch("/resources/:id", updateResource);

router.get("/recommendation-rules", listRecommendationRules);
router.post("/recommendation-rules", createRecommendationRule);
router.patch("/recommendation-rules/:id", updateRecommendationRule);

export default router;
