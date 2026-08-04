import nodemailer from "nodemailer";
import { env } from "./env.js";

/**
 * Optional by design — the server should still run in development without
 * SMTP configured. If it's missing, `transporter` stays null and
 * sendEmail() logs + no-ops instead of throwing.
 */
let transporter = null;

console.log("SMTP DEBUG:", {
  host: env.email.host,
  user: env.email.user,
  pass: env.email.pass ? "exists" : "missing",
  from: env.email.from,
});

if (env.email.host && env.email.user && env.email.pass) {
  transporter = nodemailer.createTransport({
    host: env.email.host,
    port: env.email.port,
    secure: env.email.port === 465,
    auth: { user: env.email.user, pass: env.email.pass },
  });
} else {
  // eslint-disable-next-line no-console
  console.warn("SMTP not configured (SMTP_HOST/SMTP_USER/SMTP_PASS) — emails will be logged, not sent.");
}

export { transporter };
