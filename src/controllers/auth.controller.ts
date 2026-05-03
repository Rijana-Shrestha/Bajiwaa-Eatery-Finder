import { Request, Response } from "express";
import { Webhook } from "svix";
import { createUser, deleteUser } from "../services/auth.service";

export const handleWebhook = async (req: Request, res: Response) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return res.status(500).json({ error: "Webhook secret is not configured" });
  }

  const svix_id = req.headers["svix-id"] as string;
  const svix_timestamp = req.headers["svix-timestamp"] as string;
  const svix_signature = req.headers["svix-signature"] as string;

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: "Missing svix headers" });
  }

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: any;

  try {
    evt = wh.verify(JSON.stringify(req.body), {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return res.status(400).json({ error: "Invalid webhook" });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id } = evt.data;
    await createUser(id);
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;
    await deleteUser(id);
  }

  return res.status(200).json({ message: "Webhook received" });
};
