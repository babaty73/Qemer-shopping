import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { uploadImage } from "@/services/products";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/utils";

export interface UploadedImage {
  url: string;
  publicId?: string;
}

interface ImageUploaderProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
}

/**
 * Uploads directly to Cloudinary via POST /api/uploads and stores the
 * returned URL on the form. Removing a thumbnail here only drops it from
 * the form's local list — it doesn't delete the asset from Cloudinary, so
 * an admin can freely undo a removal before saving. Cleaning up truly
 * unused Cloudinary assets is a good candidate for a future scheduled job.
 */
export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploads = await Promise.all(Array.from(files).map((file) => uploadImage(file)));
      onChange([...images, ...uploads]);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Image upload failed", "error");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {images.map((image, index) => (
          <div
            key={image.url}
            className="relative h-24 w-24 overflow-hidden rounded-xl border border-border shadow-xs"
          >
            <img src={image.url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(index)}
              aria-label="Remove image"
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900/70 text-white hover:bg-neutral-900"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            "flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border-strong bg-surface-muted text-neutral-400 transition-colors hover:border-primary/50 hover:bg-primary-light hover:text-primary",
            uploading && "pointer-events-none opacity-60"
          )}
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
          ) : (
            <Upload className="h-5 w-5" aria-hidden />
          )}
          <span className="text-xs">{uploading ? "Uploading" : "Add"}</span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
