import { RecipientModel } from "../../infrastructure/database/models";

export async function listRecipients() {
  return RecipientModel.findAll({ order: [["created_at", "DESC"]] });
}

export async function createRecipient(email: string, name?: string) {
  const [recipient, created] = await RecipientModel.findOrCreate({
    where: { email: email.toLowerCase() },
    defaults: { email: email.toLowerCase(), name: name ?? null }
  });
  return { recipient, created };
}
