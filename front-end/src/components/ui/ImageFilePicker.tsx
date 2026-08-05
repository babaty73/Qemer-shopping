import { useRef } from "react";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageFilePickerProps {
  preview: string | null;
  onChange: (file: File | null) => void;
  label: string;
  previewAlt?: string;
}

/**
 * Single-file picker used wherever a customer attaches one photo directly
 * to a form submission (checkout payment screenshot, product request
 * reference image). The file isn't uploaded ahead of time — it's attached
 * to the parent form's request and uploaded server-side in that same call,
 * so there's exactly one network round trip for the customer.
 */
export function ImageFilePicker({ preview, onChange, label, previewAlt = "Selected image preview" }: ImageFilePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      {preview ? (
        <div className="relative inline-block">
          <img src={preview} alt={previewAlt} className="h-32 w-32 rounded-xl border border-border object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Remove image"
            className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-white shadow-soft transition-colors hover:bg-neutral-800"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex h-28 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border-strong bg-surface-muted text-neutral-400 transition-colors hover:border-primary/50 hover:bg-primary-light hover:text-primary"
          )}
        >
          <Upload className="h-5 w-5" aria-hidden />
          <span className="text-sm">{label}</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
