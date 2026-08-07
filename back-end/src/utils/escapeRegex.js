/** Escapes regex special characters so user-supplied search terms are always safe as a RegExp source. */
export function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
