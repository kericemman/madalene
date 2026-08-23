import { Navigate, Route, Routes } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import AboutPage from "./pages/public/AboutPage.jsx";
import HomePage from "./pages/public/HomePage.jsx";
import AssessmentLandingPage from "./pages/public/AssessmentLandingPage.jsx";
import AssessmentResultPage from "./pages/public/AssessmentResultPage.jsx";
import ContactPage from "./pages/public/ContactPage.jsx";
import DiscernPage from "./pages/public/DiscernPage.jsx";
import WorkWithMagdalenePage from "./pages/public/offers/WorkWithMagdalenePage.jsx";
import OfferDetailPage from "./pages/public/offers/OfferDetailPage.jsx";
import OfferApplicationPage from "./pages/public/offers/OfferApplicationPage.jsx";
import OfferBookingPage from "./pages/public/offers/OfferBookingPage.jsx";
import ResourceNoticePage from "./pages/public/ResourceNoticePage.jsx";
import TestimonialRequestPage from "./pages/public/TestimonialRequestPage.jsx";
import LegalPage from "./pages/public/legal/LegalPage.jsx";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.jsx";
import AdminLoginPage from "./pages/admin/AdminLoginPage.jsx";
import AdminCodeOfResonancePage from "./pages/admin/AdminCodeOfResonancePage.jsx";
import AdminCodeAutomationPage from "./pages/admin/AdminCodeAutomationPage.jsx";
import AdminAssessmentResultsPage from "./pages/admin/AdminAssessmentResultsPage.jsx";
import AdminReviewsPage from "./pages/admin/AdminReviewsPage.jsx";
import AdminMediaPage from "./pages/admin/AdminMediaPage.jsx";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage.jsx";
import AdminLeadsPage from "./pages/admin/AdminLeadsPage.jsx";
import AdminMessagesPage from "./pages/admin/AdminMessagesPage.jsx";
import AdminOffersPage from "./pages/admin/AdminOffersPage.jsx";
import AdminApplicationsPage from "./pages/admin/AdminApplicationsPage.jsx";
import AdminBookingsPage from "./pages/admin/AdminBookingsPage.jsx";
import AdminAssessmentSetupPage from "./pages/admin/AdminAssessmentSetupPage.jsx";
import AdminEmailsPage from "./pages/admin/AdminEmailsPage.jsx";
import CodeOfResonanceEntryPage from "./pages/public/codeOfResonance/CodeOfResonanceEntryPage.jsx";
import CodeOfResonanceSectionPage from "./pages/public/codeOfResonance/CodeOfResonanceSectionPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/assessment" element={<AssessmentLandingPage />} />
        <Route path="/results/:token" element={<AssessmentResultPage />} />
        <Route path="/discern" element={<DiscernPage />} />
        <Route path="/offers" element={<WorkWithMagdalenePage />} />
        <Route path="/work-with-magdalene" element={<Navigate to="/offers" replace />} />
        <Route path="/offers/:slug" element={<OfferDetailPage />} />
        <Route path="/application/:offerSlug" element={<OfferApplicationPage />} />
        <Route path="/booking/:offerSlug" element={<OfferBookingPage />} />
        <Route path="/resources/:slug" element={<ResourceNoticePage />} />
        <Route path="/testimonial-request" element={<TestimonialRequestPage />} />
        <Route path="/privacy" element={<LegalPage page="privacy" />} />
        <Route path="/terms" element={<LegalPage page="terms" />} />
        <Route path="/assessment-disclaimer" element={<LegalPage page="assessment-disclaimer" />} />
        <Route path="/refund-policy" element={<LegalPage page="refund-policy" />} />
        <Route path="/code-of-resonance" element={<CodeOfResonanceSectionPage sectionKey="all" />} />
        <Route path="/code-of-resonance/essays" element={<CodeOfResonanceSectionPage sectionKey="essays" />} />
        <Route path="/code-of-resonance/trust-resonance" element={<CodeOfResonanceSectionPage sectionKey="trust-resonance" />} />
        <Route path="/code-of-resonance/recommended-reading" element={<CodeOfResonanceSectionPage sectionKey="recommended-reading" />} />
        <Route path="/code-of-resonance/case-studies" element={<CodeOfResonanceSectionPage sectionKey="case-studies" />} />
        <Route path="/code-of-resonance/guides" element={<CodeOfResonanceSectionPage sectionKey="guides" />} />
        <Route path="/code-of-resonance/stories" element={<CodeOfResonanceSectionPage sectionKey="stories" />} />
        <Route path="/code-of-resonance/read/:slug" element={<CodeOfResonanceEntryPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="leads" element={<AdminLeadsPage />} />
        <Route path="messages" element={<AdminMessagesPage />} />
        <Route path="assessment" element={<AdminAssessmentSetupPage />} />
        <Route path="offers" element={<AdminOffersPage />} />
        <Route path="applications" element={<AdminApplicationsPage />} />
        <Route path="bookings" element={<AdminBookingsPage />} />
        <Route path="code-of-resonance" element={<AdminCodeOfResonancePage />} />
        <Route path="code-automation" element={<AdminCodeAutomationPage />} />
        <Route path="emails" element={<AdminEmailsPage />} />
        <Route path="results" element={<AdminAssessmentResultsPage />} />
        <Route path="reviews" element={<AdminReviewsPage />} />
        <Route path="media" element={<AdminMediaPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="setting" element={<AdminSettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
