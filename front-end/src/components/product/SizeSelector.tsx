import { cn } from "@/lib/utils";

interface SizeSelectorProps {
  sizes: string[];
  selected?: string;
  onSelect: (size: string) => void;
}

export function SizeSelector({ sizes, selected, onSelect }: SizeSelectorProps) {
  return (
    <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Choose a size">
      {sizes.map((size) => {
        const active = selected === size;
        return (
          <button
            key={size}
            type="button"
            onClick={() => onSelect(size)}
            aria-pressed={active}
            className={cn(
              "flex h-10 min-w-10 items-center justify-center rounded-full border-2 px-4 text-sm font-medium transition-colors",
              active
                ? "border-emerald-500 text-emerald-700"
                : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
            )}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}
