import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { createProductRequest } from "@/services/productRequests";
import { ImageFilePicker } from "@/components/ui/ImageFilePicker";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface FormState {
  productName: string;
  color: string;
  size: string;
  quantity: string;
  email: string;
  deliveryAddress: string;
  notes: string;
}

const EMPTY_FORM: FormState = {
  productName: "",
  color: "",
  size: "",
  quantity: "1",
  email: "",
  deliveryAddress: "",
  notes: "",
};

type Errors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): Errors {
  const errors: Errors = {};
  if (!form.productName.trim()) errors.productName = "Tell us what you're looking for.";
  if (!form.color.trim()) errors.color = "Preferred color is required.";
  if (!form.size.trim()) errors.size = "Preferred size is required.";
  if (!form.quantity.trim() || Number(form.quantity) < 1) errors.quantity = "Enter a quantity of at least 1.";
  if (!form.email.trim()) errors.email = "Email is required.";
  else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = "Enter a valid email address.";
  if (!form.deliveryAddress.trim()) errors.deliveryAddress = "Delivery address is required.";
  return errors;
}

interface ProductRequestFormProps {
  prefillName?: string;
  onDone: () => void;
}

/** No payment involved — this just logs interest so the business can try to source the item. */
export function ProductRequestForm({ prefillName, onDone }: ProductRequestFormProps) {
  const [form, setForm] = useState<FormState>(() => ({ ...EMPTY_FORM, productName: prefillName ?? "" }));
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Keep the field in sync if the trigger opens the form with a different
  // product name while it's already mounted (e.g. navigating between pages
  // wouldn't remount it if it were ever hoisted higher — defensive but cheap).
  useEffect(() => {
    if (prefillName) setForm((prev) => ({ ...prev, productName: prefillName }));
  }, [prefillName]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleImageChange(file: File | null) {
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await createProductRequest({
        productName: form.productName,
        color: form.color,
        size: form.size,
        quantity: Number(form.quantity),
        email: form.email,
        deliveryAddress: form.deliveryAddress,
        notes: form.notes || undefined,
        image: image ?? undefined,
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong submitting your request.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center py-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
          <CheckCircle2 className="h-6 w-6" aria-hidden />
        </div>
        <p className="mt-4 text-base font-medium text-neutral-900">Request received</p>
        <p className="mt-1.5 text-sm text-neutral-500">
          We'll review it and email you at {form.email} once we know more.
        </p>
        <button type="button" onClick={onDone} className={cn(buttonVariants(), "mt-6")}>
          Done
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Field label="Product Name" error={errors.productName}>
        <input
          type="text"
          value={form.productName}
          onChange={(e) => updateField("productName", e.target.value)}
          className={cn("field-input", errors.productName && "field-input-error")}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Preferred Color" error={errors.color}>
          <input
            type="text"
            value={form.color}
            onChange={(e) => updateField("color", e.target.value)}
            className={cn("field-input", errors.color && "field-input-error")}
          />
        </Field>
        <Field label="Preferred Size" error={errors.size}>
          <input
            type="text"
            value={form.size}
            onChange={(e) => updateField("size", e.target.value)}
            className={cn("field-input", errors.size && "field-input-error")}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Quantity" error={errors.quantity}>
          <input
            type="number"
            min={1}
            value={form.quantity}
            onChange={(e) => updateField("quantity", e.target.value)}
            className={cn("field-input", errors.quantity && "field-input-error")}
          />
        </Field>
        <Field label="Email" error={errors.email}>
          <input
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            className={cn("field-input", errors.email && "field-input-error")}
          />
        </Field>
      </div>

      <Field label="Delivery Address" error={errors.deliveryAddress}>
        <textarea
          rows={2}
          value={form.deliveryAddress}
          onChange={(e) => updateField("deliveryAddress", e.target.value)}
          className={cn("field-input resize-none", errors.deliveryAddress && "field-input-error")}
        />
      </Field>

      <Field label="Product Image (optional)">
        <ImageFilePicker
          preview={imagePreview}
          onChange={handleImageChange}
          label="Click to attach a reference image"
        />
      </Field>

      <Field label="Additional Notes (optional)">
        <textarea
          rows={2}
          value={form.notes}
          onChange={(e) => updateField("notes", e.target.value)}
          placeholder="Any other details that would help us find it?"
          className="field-input resize-none"
        />
      </Field>

      {submitError && <p className="field-error">{submitError}</p>}

      <button type="submit" disabled={submitting} className={cn(buttonVariants({ size: "lg" }), "w-full")}>
        {submitting ? "Submitting…" : "Submit Request"}
      </button>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {children}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
