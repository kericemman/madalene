import { Resend } from "resend";
import { env } from "../config/env.js";

let resendClient;

const getClient = () => {
  if (!env.resendApiKey) return null;
  if (!resendClient) {
    resendClient = new Resend(env.resendApiKey);
  }
  return resendClient;
};

export const sendTransactionalEmail = async ({ to, subject, html, text, tags = [], replyTo }) => {
  const client = getClient();

  if (!client) {
    throw new Error("RESEND_API_KEY is not configured. The email was not sent.");
  }

  const response = await client.emails.send({
    from: env.emailFrom,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    text,
    reply_to: replyTo,
    tags: tags.map((tag) => (typeof tag === "string" ? { name: tag, value: tag } : tag))
  });

  if (response.error) {
    throw new Error(response.error.message || "Resend failed to send the email.");
  }

  return {
    provider: "resend",
    id: response.data?.id
  };
};
