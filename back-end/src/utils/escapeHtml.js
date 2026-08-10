const HTML_ESCAPES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/**
 * Escapes HTML special characters so a string is safe to interpolate into
 * an HTML email template. Used for every customer-supplied value inserted
 * into a transactional email (name, address, requested color/size, etc.) —
 * those values come straight from public, unauthenticated forms (checkout,
 * product request) and were previously inserted into the email HTML as-is.
 */
export function escapeHtml(value) {
  if (value === null || value === undefined) return "";
  return String(value).replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}
