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
                ? "border-primary text-primary"
                : "border-border text-neutral-600 hover:border-border-strong"
            )}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}
