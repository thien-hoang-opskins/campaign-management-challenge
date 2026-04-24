import type { CampaignDetail, CampaignListItem, CampaignStats } from "../types";
import { request } from "./client";

export type ListCampaignsResponse = {
  data: CampaignListItem[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
};

export function listCampaigns(page = 1, pageSize = 20) {
  return request<ListCampaignsResponse>(`/campaigns?page=${page}&pageSize=${pageSize}`);
}

export function createCampaign(input: {
  name: string;
  subject: string;
  body: string;
  recipientEmails: string[];
}) {
  return request<CampaignListItem>("/campaigns", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function getCampaign(campaignId: string) {
  return request<CampaignDetail>(`/campaigns/${campaignId}`);
}

export function updateCampaign(
  campaignId: string,
  input: Partial<{ name: string; subject: string; body: string }>
) {
  return request<CampaignDetail>(`/campaigns/${campaignId}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

export function deleteCampaign(campaignId: string) {
  return request<{ success: boolean }>(`/campaigns/${campaignId}`, {
    method: "DELETE"
  });
}

export function scheduleCampaign(campaignId: string, scheduledAt: string) {
  return request<CampaignDetail>(`/campaigns/${campaignId}/schedule`, {
    method: "POST",
    body: JSON.stringify({ scheduledAt })
  });
}

export function sendCampaign(campaignId: string) {
  return request<{ jobId: string; stats: CampaignStats }>(`/campaigns/${campaignId}/send`, {
    method: "POST"
  });
}

export function getCampaignStats(campaignId: string) {
  return request<CampaignStats>(`/campaigns/${campaignId}/stats`);
}
