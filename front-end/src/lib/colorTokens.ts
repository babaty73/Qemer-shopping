/**
 * Maps common color names used in the catalog to an actual swatch color.
 * Unmapped names still work — ColorSwatches falls back to a neutral
 * text-label pill instead of a filled dot, so unrecognized names are never
 * silently wrong (e.g. shown as black).
 */
export const COLOR_TOKENS: Record<string, string> = {
  black: "#111827",
  white: "#FFFFFF",
  charcoal: "#374151",
  sand: "#E4CBA0",
  natural: "#EDE4D3",
  olive: "#6B7250",
  brown: "#7A4B2A",
  tan: "#C9A377",
  clear: "#F3F4F6",
  amber: "#F59E0B",
  "sky blue": "#7DD3E8",
};

export function getColorSwatch(name: string): string | null {
  return COLOR_TOKENS[name.trim().toLowerCase()] ?? null;
}
