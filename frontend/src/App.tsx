import { Navigate, Route, Routes } from "react-router-dom";
import { CampaignCreatePage } from "./pages/CampaignCreatePage";
import { CampaignDetailPage } from "./pages/CampaignDetailPage";
import { CampaignListPage } from "./pages/CampaignListPage";
import { LoginPage } from "./pages/LoginPage";
import { RecipientsPage } from "./pages/RecipientsPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/campaigns" element={<CampaignListPage />} />
        <Route path="/campaigns/new" element={<CampaignCreatePage />} />
        <Route path="/campaigns/:campaignId" element={<CampaignDetailPage />} />
        <Route path="/recipients" element={<RecipientsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/campaigns" replace />} />
    </Routes>
  );
}
