import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { listCampaigns } from "../api/campaignApi";
import { ErrorAlert } from "../components/ErrorAlert";
import { SkeletonList } from "../components/SkeletonList";
import { StatusBadge } from "../components/StatusBadge";
import { useAuthStore } from "../store/authStore";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

export function CampaignListPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const clearSession = useAuthStore((state) => state.clearSession);
  const campaignsQuery = useQuery({
    queryKey: ["campaigns", "list", page, pageSize],
    queryFn: () => listCampaigns(page, pageSize)
  });

  return (
    <main className="page">
      <header className="page-header">
        <h1>Campaigns</h1>
        <div className="header-actions">
          <Link to="/campaigns/new">Create campaign</Link>
          <Link to="/recipients">Recipients</Link>
          <button className="secondary" type="button" onClick={clearSession}>
            Logout
          </button>
        </div>
      </header>

      {campaignsQuery.isPending && <SkeletonList />}
      {campaignsQuery.isError && <ErrorAlert message={getApiErrorMessage(campaignsQuery.error, "Failed to load campaigns")} />}

      {campaignsQuery.data && campaignsQuery.data.data.length === 0 && (
        <div className="empty-state">
          <p>No campaigns yet. Create one to get started.</p>
        </div>
      )}

      {campaignsQuery.data && campaignsQuery.data.data.length > 0 && (
        <>
          <ul className="campaign-list">
            {campaignsQuery.data.data.map((campaign) => (
              <li key={campaign.id} className="card campaign-row">
                <div>
                  <Link to={`/campaigns/${campaign.id}`}>{campaign.name}</Link>
                  <p>{campaign.subject}</p>
                </div>
                <StatusBadge status={campaign.status} />
              </li>
            ))}
          </ul>
          <div className="pagination">
            <button type="button" className="secondary" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
              Previous
            </button>
            <span>
              Page {campaignsQuery.data.pagination.page} of {Math.max(campaignsQuery.data.pagination.totalPages, 1)}
            </span>
            <button
              type="button"
              className="secondary"
              disabled={page >= campaignsQuery.data.pagination.totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  );
}
