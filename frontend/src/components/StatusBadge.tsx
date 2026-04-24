import type { CampaignStatus } from "../types";

const labelByStatus: Record<string, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  sent: "Sent"
};

export function StatusBadge({ status }: { status: CampaignStatus }) {
  const normalized = status.toLowerCase();
  const knownStatus = normalized in labelByStatus;
  const label = knownStatus ? labelByStatus[normalized] : `Unknown (${status})`;
  const className = knownStatus ? `status-${normalized}` : "status-unknown";
  return <span className={`badge ${className}`}>{label}</span>;
}
