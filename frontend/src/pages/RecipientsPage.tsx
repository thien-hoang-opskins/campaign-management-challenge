import type { FormEvent } from "react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRecipient, listRecipients } from "../api/recipientApi";
import { ErrorAlert } from "../components/ErrorAlert";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RecipientsPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const recipientsQuery = useQuery({
    queryKey: ["recipients", "list"],
    queryFn: listRecipients
  });

  const createMutation = useMutation({
    mutationFn: createRecipient,
    onSuccess: async () => {
      setEmail("");
      setName("");
      setValidationError(null);
      await queryClient.invalidateQueries({ queryKey: ["recipients", "list"] });
    }
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!emailRegex.test(email.trim())) {
      setValidationError("Please enter a valid email address.");
      return;
    }
    setValidationError(null);
    createMutation.mutate({ email: email.trim().toLowerCase(), ...(name.trim() ? { name: name.trim() } : {}) });
  };

  return (
    <main className="page">
      <h1>Recipients</h1>

      <section className="card section">
        <h2>Create recipient</h2>
        <form className="form-grid" onSubmit={onSubmit}>
          <label htmlFor="recipient-email">Email</label>
          <input
            id="recipient-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="recipient-name">Name (optional)</label>
          <input id="recipient-name" value={name} onChange={(event) => setName(event.target.value)} />

          <button disabled={createMutation.isPending} type="submit">
            {createMutation.isPending ? "Saving..." : "Create recipient"}
          </button>
        </form>
        {validationError && <ErrorAlert message={validationError} />}
        {createMutation.isError && (
          <ErrorAlert message={getApiErrorMessage(createMutation.error, "Create recipient failed")} />
        )}
      </section>

      <section className="card section">
        <h2>Recipient list</h2>
        {recipientsQuery.isPending && <LoadingSpinner label="Loading recipients..." />}
        {recipientsQuery.isError && (
          <ErrorAlert message={getApiErrorMessage(recipientsQuery.error, "Failed to load recipients")} />
        )}
        {recipientsQuery.data && recipientsQuery.data.data.length === 0 && <p>No recipients found.</p>}
        {recipientsQuery.data && recipientsQuery.data.data.length > 0 && (
          <ul className="recipient-list">
            {recipientsQuery.data.data.map((recipient) => (
              <li key={recipient.id} className="card">
                <p>{recipient.email}</p>
                <p>{recipient.name ?? "No name"}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
