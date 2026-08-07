import { cn } from "@/lib/utils";
import { getColorSwatch } from "@/lib/colorTokens";

interface ColorSwatchesProps {
  colors: string[];
  selected?: string;
  onSelect: (color: string) => void;
}

export function ColorSwatches({ colors, selected, onSelect }: ColorSwatchesProps) {
  return (
    <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Choose a color">
      {colors.map((color) => {
        const swatch = getColorSwatch(color);
        const active = selected === color;

        return (
          <button
            key={color}
            type="button"
            onClick={() => onSelect(color)}
            aria-pressed={active}
            aria-label={color}
            title={color}
            className={cn(
              "flex h-10 items-center justify-center rounded-full border-2 transition-colors",
              swatch ? "w-10 p-0.5" : "px-4 text-xs font-medium",
              active ? "border-primary" : "border-border hover:border-border-strong"
            )}
          >
            {swatch ? (
              <span
                className="block h-full w-full rounded-full border border-black/5"
                style={{ backgroundColor: swatch }}
              />
            ) : (
              color
            )}
          </button>
        );
      })}
    </div>
  );
}
