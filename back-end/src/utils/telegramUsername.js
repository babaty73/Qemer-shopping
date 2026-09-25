// Telegram's own username rules: 5-32 characters, must start with a
// letter, the rest letters/digits/underscores. Applied after stripping an
// optional leading "@" so both "@customer123" and "customer123" validate
// the same way.
const TELEGRAM_USERNAME_PATTERN = /^[a-zA-Z][a-zA-Z0-9_]{4,31}$/;

/** Strips an optional leading "@" and surrounding whitespace — "@customer123" and "customer123" both -> "customer123". */
export function normalizeTelegramUsername(value) {
  return String(value ?? "").trim().replace(/^@/, "");
}

/** True if `value`, once normalized, matches Telegram's username format. */
export function isValidTelegramUsername(value) {
  return TELEGRAM_USERNAME_PATTERN.test(normalizeTelegramUsername(value));
}
