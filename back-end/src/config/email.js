import { Resend } from "resend";
import { env } from "./env.js";

/**
 * Optional by design — the server should still run in development without
 * Resend configured. If RESEND_API_KEY is missing, `resend` stays null and
 * sendEmail() logs + no-ops instead of throwing.
 */
let resend = null;

if (env.email.resendApiKey) {
  resend = new Resend(env.email.resendApiKey);
} else {
  // eslint-disable-next-line no-console
  console.warn("Resend is not configured (RESEND_API_KEY) — emails will be logged, not sent.");
}

export { resend };
