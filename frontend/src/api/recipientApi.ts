import type { Recipient } from "../types";
import { request } from "./client";

export type ListRecipientsResponse = {
  data: Recipient[];
};

export function listRecipients() {
  return request<ListRecipientsResponse>("/recipients");
}

export function createRecipient(input: { email: string; name?: string }) {
  return request<Recipient>("/recipients", {
    method: "POST",
    body: JSON.stringify(input)
  });
}
