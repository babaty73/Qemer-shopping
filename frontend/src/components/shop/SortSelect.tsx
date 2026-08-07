import type { ProductFilters } from "@/types";

const OPTIONS: { value: NonNullable<ProductFilters["sort"]>; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

interface SortSelectProps {
  value: NonNullable<ProductFilters["sort"]>;
  onChange: (value: NonNullable<ProductFilters["sort"]>) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <label className="flex items-center gap-2 text-sm text-neutral-600">
      <span className="hidden sm:inline">Sort</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as NonNullable<ProductFilters["sort"]>)}
        className="h-11 rounded-full border border-border bg-surface px-4 text-sm text-neutral-900 transition-colors focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
