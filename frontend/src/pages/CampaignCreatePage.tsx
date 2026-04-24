import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createCampaign } from "../api/campaignApi";
import { ErrorAlert } from "../components/ErrorAlert";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

type CreateCampaignForm = {
  name: string;
  subject: string;
  body: string;
  recipientText: string;
};

type CreateCampaignFieldErrors = Partial<Record<keyof CreateCampaignForm, string>>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseRecipientEmails(input: string) {
  return input
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function validateCreateCampaign(values: CreateCampaignForm): CreateCampaignFieldErrors {
  const errors: CreateCampaignFieldErrors = {};
  if (!values.name.trim()) {
    errors.name = "Name is required";
  }
  if (!values.subject.trim()) {
    errors.subject = "Subject is required";
  }
  if (!values.body.trim()) {
    errors.body = "Body is required";
  }

  const emails = parseRecipientEmails(values.recipientText);
  const invalid = emails.filter((email) => !emailRegex.test(email));
  if (invalid.length > 0) {
    errors.recipientText = `Invalid email format: ${invalid[0]}`;
  }

  const duplicates = new Set<string>();
  const seen = new Set<string>();
  for (const email of emails) {
    const normalized = email.toLowerCase();
    if (seen.has(normalized)) {
      duplicates.add(normalized);
    }
    seen.add(normalized);
  }
  if (duplicates.size > 0) {
    errors.recipientText = "Duplicate recipient emails are not allowed";
  }

  return errors;
}

export function CampaignCreatePage() {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [recipientText, setRecipientText] = useState("");
  const [fieldErrors, setFieldErrors] = useState<CreateCampaignFieldErrors>({});

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const recipients = useMemo(() => parseRecipientEmails(recipientText), [recipientText]);
  const uniqueRecipients = useMemo(() => Array.from(new Set(recipients.map((email) => email.toLowerCase()))), [recipients]);

  const createMutation = useMutation({
    mutationFn: createCampaign,
    onSuccess: async (campaign) => {
      await queryClient.invalidateQueries({ queryKey: ["campaigns", "list"] });
      navigate(`/campaigns/${campaign.id}`);
    }
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values: CreateCampaignForm = { name, subject, body, recipientText };
    const validationErrors = validateCreateCampaign(values);
    setFieldErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    createMutation.mutate({ name: name.trim(), subject: subject.trim(), body: body.trim(), recipientEmails: uniqueRecipients });
  };

  return (
    <main className="page narrow">
      <h1>Create Campaign</h1>
      <form className="card form-grid" onSubmit={onSubmit}>
        <label htmlFor="name">Name</label>
        <input id="name" value={name} onChange={(event) => setName(event.target.value)} required />
        {fieldErrors.name && <ErrorAlert message={fieldErrors.name} />}

        <label htmlFor="subject">Subject</label>
        <input
          id="subject"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          required
        />
        {fieldErrors.subject && <ErrorAlert message={fieldErrors.subject} />}

        <label htmlFor="body">Body</label>
        <textarea id="body" value={body} onChange={(event) => setBody(event.target.value)} required />
        {fieldErrors.body && <ErrorAlert message={fieldErrors.body} />}

        <label htmlFor="recipients">Recipient emails (comma or newline separated)</label>
        <textarea
          id="recipients"
          value={recipientText}
          onChange={(event) => setRecipientText(event.target.value)}
          placeholder={"jane@example.com,\nalex@example.com"}
        />
        {fieldErrors.recipientText && <ErrorAlert message={fieldErrors.recipientText} />}
        <p>
          Parsed recipients: {uniqueRecipients.length} {uniqueRecipients.length === 1 ? "email" : "emails"}
        </p>

        <button disabled={createMutation.isPending} type="submit">
          {createMutation.isPending ? "Creating..." : "Create campaign"}
        </button>

        {createMutation.isError && <ErrorAlert message={getApiErrorMessage(createMutation.error, "Create campaign failed")} />}
      </form>
    </main>
  );
}
