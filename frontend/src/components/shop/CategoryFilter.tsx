import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/mockData";

interface CategoryFilterProps {
  value: string | null;
  onChange: (slug: string | null) => void;
}

/** Horizontal pill filter — "All" plus one pill per category, single-select. */
export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
      <FilterPill active={value === null} onClick={() => onChange(null)}>
        All
      </FilterPill>
      {CATEGORIES.map((category) => (
        <FilterPill
          key={category.slug}
          active={value === category.slug}
          onClick={() => onChange(category.slug)}
        >
          {category.name}
        </FilterPill>
      ))}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-white shadow-soft"
          : "border-border bg-surface text-neutral-600 hover:border-primary/40 hover:text-primary"
      )}
    >
      {children}
    </button>
  );
}
