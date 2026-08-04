import { transporter } from "../config/email.js";
import { env } from "../config/env.js";

/**
 * Sends an email and swallows any failure — a broken SMTP config or a
 * transient send error should never fail the admin action (order status
 * update, request approval, etc.) that triggered it.
 */
export async function sendEmail({ to, subject, html }) {
  if (!transporter) {
    // eslint-disable-next-line no-console
    console.warn(`Email skipped (SMTP not configured): "${subject}" -> ${to}`);
    return;
  }

  try {
    await transporter.sendMail({ from: env.email.from, to, subject, html });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Failed to send email "${subject}" to ${to}:`, err.message);
  }
}
