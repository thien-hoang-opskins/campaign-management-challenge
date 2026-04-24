import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  deleteCampaign,
  getCampaign,
  getCampaignStats,
  scheduleCampaign,
  sendCampaign,
  updateCampaign
} from "../api/campaignApi";
import { ErrorAlert } from "../components/ErrorAlert";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { RateBar } from "../components/RateBar";
import { StatusBadge } from "../components/StatusBadge";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

export function CampaignDetailPage() {
  const { campaignId = "" } = useParams();
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [scheduleInputError, setScheduleInputError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const campaignQuery = useQuery({
    queryKey: ["campaigns", "detail", campaignId],
    queryFn: () => getCampaign(campaignId)
  });
  const statsQuery = useQuery({
    queryKey: ["campaigns", "stats", campaignId],
    queryFn: () => getCampaignStats(campaignId)
  });

  const updateMutation = useMutation({
    mutationFn: () => updateCampaign(campaignId, { name: name.trim(), subject: subject.trim(), body: body.trim() }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["campaigns", "detail", campaignId] });
      await queryClient.invalidateQueries({ queryKey: ["campaigns", "list"] });
    }
  });

  const scheduleMutation = useMutation({
    mutationFn: () => scheduleCampaign(campaignId, new Date(scheduledAt).toISOString()),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["campaigns", "detail", campaignId] });
      await queryClient.invalidateQueries({ queryKey: ["campaigns", "stats", campaignId] });
      await queryClient.invalidateQueries({ queryKey: ["campaigns", "list"] });
    }
  });

  const sendMutation = useMutation({
    mutationFn: () => sendCampaign(campaignId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["campaigns", "detail", campaignId] });
      await queryClient.invalidateQueries({ queryKey: ["campaigns", "stats", campaignId] });
      await queryClient.invalidateQueries({ queryKey: ["campaigns", "list"] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteCampaign(campaignId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["campaigns", "list"] });
      navigate("/campaigns");
    }
  });

  const onSchedule = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const date = new Date(scheduledAt);
    if (Number.isNaN(date.getTime())) {
      setScheduleInputError("Please provide a valid schedule time.");
      return;
    }
    if (date.getTime() <= Date.now()) {
      setScheduleInputError("Schedule time must be in the future.");
      return;
    }
    setScheduleInputError(null);
    scheduleMutation.mutate();
  };

  const onUpdate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateMutation.mutate();
  };

  useEffect(() => {
    if (!campaignQuery.data) {
      return;
    }
    setName(campaignQuery.data.name);
    setSubject(campaignQuery.data.subject);
    setBody(campaignQuery.data.body);
  }, [campaignQuery.data]);

  if (campaignQuery.isPending || statsQuery.isPending) {
    return (
      <main className="page">
        <LoadingSpinner label="Loading campaign..." />
      </main>
    );
  }

  if (campaignQuery.isError || statsQuery.isError) {
    return (
      <main className="page">
        <ErrorAlert
          message={
            getApiErrorMessage(campaignQuery.error, "") ||
            getApiErrorMessage(statsQuery.error, "") ||
            "Unable to load campaign"
          }
        />
      </main>
    );
  }

  const campaign = campaignQuery.data;
  const stats = statsQuery.data;
  const canEdit = campaign.status === "draft";
  const canSchedule = campaign.status === "draft";
  const canSend = campaign.status === "draft" || campaign.status === "scheduled";
  const canDelete = campaign.status === "draft";

  return (
    <main className="page">
      <p>
        <Link to="/campaigns">Back to campaigns</Link>
      </p>
      <header className="page-header">
        <div>
          <h1>{campaign.name}</h1>
          <p>{campaign.subject}</p>
        </div>
        <StatusBadge status={campaign.status} />
      </header>

      <section className="card section">
        <h2>Message</h2>
        <p>{campaign.body}</p>
      </section>

      <section className="card section">
        <h2>Edit campaign</h2>
        {canEdit ? (
          <form className="form-grid" onSubmit={onUpdate}>
            <label htmlFor="edit-name">Name</label>
            <input id="edit-name" value={name} onChange={(event) => setName(event.target.value)} required />

            <label htmlFor="edit-subject">Subject</label>
            <input
              id="edit-subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              required
            />

            <label htmlFor="edit-body">Body</label>
            <textarea id="edit-body" value={body} onChange={(event) => setBody(event.target.value)} required />

            <button disabled={updateMutation.isPending} type="submit">
              {updateMutation.isPending ? "Saving..." : "Save changes"}
            </button>
          </form>
        ) : (
          <p>Edit hidden for non-draft campaigns.</p>
        )}
      </section>

      <section className="card section">
        <h2>Stats</h2>
        <div className="stats-grid">
          <RateBar label="Send rate" value={stats.send_rate} />
          <RateBar label="Open rate" value={stats.open_rate} />
          <p>Total recipients: {stats.total}</p>
          <p>Sent: {stats.sent}</p>
          <p>Failed: {stats.failed}</p>
          <p>Opened: {stats.opened}</p>
        </div>
      </section>

      <section className="card section">
        <h2>Actions</h2>
        {canSchedule ? (
          <form onSubmit={onSchedule} className="inline-form">
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(event) => setScheduledAt(event.target.value)}
              required
            />
            <button disabled={scheduleMutation.isPending} type="submit">
              Schedule
            </button>
          </form>
        ) : (
          <p>Schedule hidden for non-draft campaigns.</p>
        )}
        {scheduleInputError && <ErrorAlert message={scheduleInputError} />}

        {canSend ? (
          <button disabled={sendMutation.isPending} type="button" onClick={() => sendMutation.mutate()}>
            Send campaign
          </button>
        ) : (
          <p>Send hidden for sent campaigns.</p>
        )}

        {canDelete ? (
          <button
            className="danger"
            disabled={deleteMutation.isPending}
            type="button"
            onClick={() => deleteMutation.mutate()}
          >
            Delete campaign
          </button>
        ) : (
          <p>Delete hidden for non-draft campaigns.</p>
        )}
      </section>

      <section className="card section">
        <h2>Recipients</h2>
        {campaign.recipients.length === 0 ? (
          <p>No recipients linked.</p>
        ) : (
          <ul className="recipient-list">
            {campaign.recipients.map((recipient) => (
              <li key={recipient.recipientId}>
                {recipient.recipientId} - {recipient.status}
              </li>
            ))}
          </ul>
        )}
      </section>

      {(updateMutation.isError || scheduleMutation.isError || sendMutation.isError || deleteMutation.isError) && (
        <ErrorAlert
          message={
            getApiErrorMessage(updateMutation.error, "") ||
            getApiErrorMessage(scheduleMutation.error, "") ||
            getApiErrorMessage(sendMutation.error, "") ||
            getApiErrorMessage(deleteMutation.error, "") ||
            "Action failed"
          }
        />
      )}
    </main>
  );
}
