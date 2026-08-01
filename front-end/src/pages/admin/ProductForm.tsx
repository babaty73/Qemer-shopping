import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { ImageUploader, type UploadedImage } from "@/components/admin/ImageUploader";
import { Skeleton } from "@/components/ui/Skeleton";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/mockData";
import { createProduct, getProductBySlug, updateProduct } from "@/services/products";
import { useToast } from "@/context/ToastContext";

interface FormState {
  name: string;
  description: string;
  category: string;
  price: string;
  colors: string;
  sizes: string;
  featured: boolean;
  inStock: boolean;
}

const EMPTY_FORM: FormState = {
  name: "",
  description: "",
  category: CATEGORIES[0].name,
  price: "",
  colors: "",
  sizes: "",
  featured: false,
  inStock: true,
};

const inputClass = "field-input";

function splitList(value: string): string[] {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

/**
 * Handles both create (`/admin/products/new`) and edit
 * (`/admin/products/:slug/edit`) — editing loads by slug (the only single-
 * product GET the API exposes) and saves via PUT using the loaded _id.
 */
export default function ProductForm() {
  const { slug } = useParams<{ slug?: string }>();
  const isEdit = Boolean(slug);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [productId, setProductId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!slug) return;
    getProductBySlug(slug)
      .then((product) => {
        setProductId(product._id);
        setForm({
          name: product.name,
          description: product.description,
          category: product.category,
          price: String(product.price),
          colors: product.colors.join(", "),
          sizes: product.sizes.join(", "),
          featured: product.featured,
          inStock: product.inStock,
        });
        setImages(product.images.map((url) => ({ url })));
      })
      .catch((err) => showToast(err instanceof Error ? err.message : "Failed to load product", "error"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (images.length === 0) {
      showToast("Add at least one product image", "error");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        images: images.map((img) => img.url),
        colors: splitList(form.colors),
        sizes: splitList(form.sizes),
        featured: form.featured,
        inStock: form.inStock,
      };

      if (isEdit && productId) {
        await updateProduct(productId, payload);
        showToast("Product updated");
      } else {
        await createProduct(payload);
        showToast("Product created");
      }
      navigate("/admin/products");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to save product", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl">
        <Skeleton className="h-8 w-40" />
        <div className="mt-8 space-y-6">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-24 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>
          <Skeleton className="h-24 w-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-medium text-neutral-900">{isEdit ? "Edit product" : "New product"}</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <FormField label="Name">
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            className={inputClass}
          />
        </FormField>

        <FormField label="Description">
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            className={cn(inputClass, "resize-none")}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Category">
            <select
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              className={inputClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Price (ETB)">
            <input
              type="number"
              required
              min={0}
              value={form.price}
              onChange={(e) => updateField("price", e.target.value)}
              className={inputClass}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Colors (comma-separated)">
            <input
              type="text"
              value={form.colors}
              onChange={(e) => updateField("colors", e.target.value)}
              placeholder="Black, White"
              className={inputClass}
            />
          </FormField>
          <FormField label="Sizes (comma-separated)">
            <input
              type="text"
              value={form.sizes}
              onChange={(e) => updateField("sizes", e.target.value)}
              placeholder="S, M, L"
              className={inputClass}
            />
          </FormField>
        </div>

        <FormField label="Images">
          <ImageUploader images={images} onChange={setImages} />
        </FormField>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => updateField("featured", e.target.checked)}
              className="h-4 w-4 rounded border-border-strong text-primary focus:ring-primary/30"
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => updateField("inStock", e.target.checked)}
              className="h-4 w-4 rounded border-border-strong text-primary focus:ring-primary/30"
            />
            In Stock
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={saving} className={buttonVariants({ size: "lg" })}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Create Product"
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}
