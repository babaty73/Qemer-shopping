import { useRef } from "react";
import { Upload, X } from "lucide-react";

interface PaymentScreenshotUploadProps {
  preview: string | null;
  onChange: (file: File | null) => void;
}

/**
 * Single required file picker for the checkout form. Unlike the admin
 * ImageUploader, this doesn't upload immediately — the file is attached
 * directly to the order-creation request and uploaded server-side in the
 * same call, so there's exactly one network round trip for the customer.
 */
export function PaymentScreenshotUpload({ preview, onChange }: PaymentScreenshotUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Payment screenshot preview"
            className="h-40 w-40 rounded-xl border border-border object-cover"
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Remove screenshot"
            className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-white shadow-soft transition-colors hover:bg-neutral-800"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border-strong bg-surface-muted text-neutral-400 transition-colors hover:border-primary/50 hover:bg-primary-light hover:text-primary"
        >
          <Upload className="h-5 w-5" aria-hidden />
          <span className="text-sm">Click to upload payment screenshot</span>
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
