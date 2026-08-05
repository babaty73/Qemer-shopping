import { renderEmailLayout } from "./layout.js";

/** Sent when an admin approves a custom product request. */
export function buildRequestApprovedEmail(request) {
  const variant = [request.color, request.size ? `size ${request.size}` : null].filter(Boolean).join(", ");

  const bodyHtml = `
    <h1 style="margin:0 0 12px;font-size:20px;color:#16140F;">Your product request was approved</h1>
    <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#57534B;">
      Good news — we're going to source <strong>${request.productName}</strong>${variant ? ` (${variant})` : ""}
      for you. We'll reach out at this email once it's ready.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
      <tr>
        <td style="padding:4px 0;font-size:13px;color:#78746C;">Quantity</td>
        <td style="padding:4px 0;font-size:13px;color:#16140F;text-align:right;">${request.quantity}</td>
      </tr>
    </table>
    <p style="margin:20px 0 0;font-size:14px;line-height:1.6;color:#57534B;">
      Questions in the meantime? Just reply to this email or message us on Telegram/WhatsApp.
    </p>
  `;

  return {
    subject: `Your product request was approved — ${request.productName}`,
    html: renderEmailLayout({ title: "Request Approved", bodyHtml }),
  };
}

/** Sent when an admin declines a custom product request. */
export function buildRequestDeclinedEmail(request) {
  const bodyHtml = `
    <h1 style="margin:0 0 12px;font-size:20px;color:#16140F;">About your product request</h1>
    <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#57534B;">
      Thanks for asking us about <strong>${request.productName}</strong>. Unfortunately we're not able to
      source this item right now.
    </p>
    <p style="margin:0;font-size:14px;line-height:1.6;color:#57534B;">
      Feel free to browse the current catalog, or send us another request if your needs change.
    </p>
  `;

  return {
    subject: `Update on your product request — ${request.productName}`,
    html: renderEmailLayout({ title: "Request Update", bodyHtml }),
  };
}
