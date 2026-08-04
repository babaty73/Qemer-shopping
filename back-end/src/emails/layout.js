/**
 * Shared HTML shell for every transactional email — table-based layout with
 * inline styles throughout (required for consistent rendering across email
 * clients; a linked/embedded stylesheet is not reliable in most inboxes).
 * Colors match the storefront's design tokens (frontend/tailwind.config.ts).
 */
export function renderEmailLayout({ title, bodyHtml }) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#FAF9F6;font-family:Helvetica,Arial,sans-serif;color:#16140F;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF9F6;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E7E5E0;">
            <tr>
              <td style="background-color:#12946B;padding:24px 32px;">
                <span style="font-size:20px;font-weight:600;color:#FFFFFF;">Kemer Market</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;border-top:1px solid #E7E5E0;">
                <p style="margin:0;font-size:12px;color:#78746C;">
                  Kemer Market · Bole, Addis Ababa, Ethiopia
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function formatEtb(amount) {
  return `ETB ${Number(amount).toLocaleString("en-US")}`;
}

export function shortOrderId(orderId) {
  return orderId.toString().slice(-8).toUpperCase();
}
