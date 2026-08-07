import { resend } from "../config/email.js";
import { env } from "../config/env.js";

/**
 * Sends an email via Resend and swallows any failure — a missing API key
 * or a send error should never fail the admin action (order status update,
 * request approval, etc.) that triggered it. Same signature as before, so
 * every call site (orderController, productRequestController) is unchanged.
 */
export async function sendEmail({ to, subject, html }) {
  if (!resend) {
    // eslint-disable-next-line no-console
    console.warn(`Email skipped (Resend not configured): "${subject}" -> ${to}`);
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: env.email.from,
      to,
      subject,
      html,
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.error(`Failed to send email "${subject}" to ${to}:`, error.message ?? error);
      return;
    }

    // eslint-disable-next-line no-console
    console.log(`Email sent: "${subject}" -> ${to} (id: ${data?.id ?? "unknown"})`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Failed to send email "${subject}" to ${to}:`, err.message);
  }
}
