import { renderEmailLayout, formatEtb, shortOrderId } from "./layout.js";

function itemsTable(items) {
  const rows = items
    .map((item) => {
      const variant = [item.color, item.size].filter(Boolean).join(", ");
      return `
      <tr>
        <td style="padding:8px 0;font-size:14px;color:#3F3B35;border-bottom:1px solid #F2F0EA;">
          ${item.name}${variant ? ` (${variant})` : ""} × ${item.quantity}
        </td>
        <td style="padding:8px 0;font-size:14px;color:#16140F;text-align:right;border-bottom:1px solid #F2F0EA;">
          ${formatEtb(item.price * item.quantity)}
        </td>
      </tr>`;
    })
    .join("");

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">${rows}</table>`;
}

/** Sent when an admin approves a payment (order status -> "Accepted"). */
export function buildPaymentAcceptedEmail(order) {
  const bodyHtml = `
    <h1 style="margin:0 0 12px;font-size:20px;color:#16140F;">Your payment has been verified</h1>
    <p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:#57534B;">
      Hi ${order.customer.fullName}, thanks for your order — we've confirmed your payment for order
      <strong>#${shortOrderId(order._id)}</strong> and we're preparing it now.
    </p>
    ${itemsTable(order.items)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
      <tr>
        <td style="padding-top:12px;font-size:14px;font-weight:600;color:#16140F;">Total</td>
        <td style="padding-top:12px;font-size:14px;font-weight:600;color:#12946B;text-align:right;">${formatEtb(order.totalPrice)}</td>
      </tr>
    </table>
    <p style="margin:24px 0 0;font-size:14px;line-height:1.6;color:#57534B;">
      We'll be in touch about delivery to <strong>${order.customer.address}</strong>.
      If anything looks off, just reply to this email or message us on Telegram/WhatsApp.
    </p>
  `;

  return {
    subject: `Payment confirmed — Order #${shortOrderId(order._id)}`,
    html: renderEmailLayout({ title: "Payment Confirmed", bodyHtml }),
  };
}

/** Sent when an admin rejects a payment (order status -> "Payment Rejected"). */
export function buildPaymentRejectedEmail(order) {
  const bodyHtml = `
    <h1 style="margin:0 0 12px;font-size:20px;color:#16140F;">We couldn't verify your payment</h1>
    <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#57534B;">
      Hi ${order.customer.fullName}, we reviewed the payment screenshot for order
      <strong>#${shortOrderId(order._id)}</strong> but weren't able to verify it against our records.
    </p>
    <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#57534B;">
      This can happen if the transfer hasn't cleared yet, the amount doesn't match the order total, or the
      screenshot was unclear. Please reach out to us on Telegram or WhatsApp and we'll help sort it out.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding-top:4px;font-size:14px;font-weight:600;color:#16140F;">Order Total</td>
        <td style="padding-top:4px;font-size:14px;font-weight:600;color:#16140F;text-align:right;">${formatEtb(order.totalPrice)}</td>
      </tr>
    </table>
  `;

  return {
    subject: `Payment could not be verified — Order #${shortOrderId(order._id)}`,
    html: renderEmailLayout({ title: "Payment Not Verified", bodyHtml }),
  };
}
