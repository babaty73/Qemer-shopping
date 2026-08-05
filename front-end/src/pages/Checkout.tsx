import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/services/orders";
import { ImageFilePicker } from "@/components/ui/ImageFilePicker";
import { PaymentInfoCard } from "@/components/checkout/PaymentInfoCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { EmptyState } from "@/components/ui/EmptyState";
import { buttonVariants } from "@/components/ui/Button";
import { cn, formatPrice } from "@/lib/utils";

interface FormState {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  paymentMethod: string;
  notes: string;
}

const EMPTY_FORM: FormState = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  paymentMethod: "Bank Transfer",
  notes: "",
};

type Errors = Partial<Record<keyof FormState | "screenshot", string>>;

function validate(form: FormState, screenshot: File | null): Errors {
  const errors: Errors = {};
  if (!form.fullName.trim()) errors.fullName = "Full name is required.";
  if (!form.phone.trim()) errors.phone = "Phone number is required.";
  if (!form.email.trim()) errors.email = "Email is required.";
  else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = "Enter a valid email address.";
  if (!form.address.trim()) errors.address = "Delivery address is required.";
  if (!screenshot) errors.screenshot = "Attach your payment screenshot to continue.";
  return errors;
}

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<{ id: string; total: number } | null>(null);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleScreenshotChange(file: File | null) {
    setScreenshot(file);
    setScreenshotPreview(file ? URL.createObjectURL(file) : null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors = validate(form, screenshot);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !screenshot) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await createOrder({
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
        address: form.address,
        paymentMethod: form.paymentMethod,
        notes: form.notes || undefined,
        screenshot,
        items,
      });
      setConfirmedOrder({ id: result._id, total: result.totalPrice });
      clearCart();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong placing your order.");
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmedOrder) {
    return (
      <div className="container flex flex-col items-center py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-primary">
          <CheckCircle2 className="h-7 w-7" aria-hidden />
        </div>
        <h1 className="mt-6 text-3xl font-medium text-neutral-900">Order received</h1>
        <p className="mt-3 max-w-md text-base leading-relaxed text-neutral-500">
          Order{" "}
          <span className="price-tag text-neutral-700">#{confirmedOrder.id.slice(-8).toUpperCase()}</span> for{" "}
          {formatPrice(confirmedOrder.total)} is pending payment verification. We'll email you as soon as
          it's confirmed.
        </p>
        <Link to="/shop" className={cn(buttonVariants({ size: "lg" }), "mt-8")}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container py-16">
        <SectionTitle eyebrow="Checkout" title="Checkout" />
        <div className="mt-10">
          <EmptyState
            title="Your cart is empty"
            description="Add products to your cart before checking out."
            action={
              <Link to="/shop" className={buttonVariants({ size: "lg" })}>
                Browse Shop
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <SectionTitle
        eyebrow="Checkout"
        title="Checkout"
        description={`${items.length} item${items.length === 1 ? "" : "s"} · ${formatPrice(subtotal)}`}
      />

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <form onSubmit={handleSubmit} noValidate className="surface-card space-y-5 p-6 lg:col-span-2 sm:p-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Full Name" error={errors.fullName}>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                className={cn("field-input", errors.fullName && "field-input-error")}
              />
            </Field>
            <Field label="Phone Number" error={errors.phone}>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className={cn("field-input", errors.phone && "field-input-error")}
              />
            </Field>
          </div>

          <Field label="Email" error={errors.email}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={cn("field-input", errors.email && "field-input-error")}
            />
          </Field>

          <Field label="Delivery Address" error={errors.address}>
            <textarea
              rows={3}
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
              className={cn("field-input resize-none", errors.address && "field-input-error")}
            />
          </Field>

          <Field label="Payment Method">
            <select
              value={form.paymentMethod}
              onChange={(e) => updateField("paymentMethod", e.target.value)}
              className="field-input"
            >
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Telebirr">Telebirr</option>
            </select>
          </Field>

          <Field label="Payment Screenshot" error={errors.screenshot}>
            <ImageFilePicker
              preview={screenshotPreview}
              onChange={handleScreenshotChange}
              label="Click to upload payment screenshot"
              previewAlt="Payment screenshot preview"
            />
          </Field>

          <Field label="Additional Notes (optional)">
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              placeholder="Anything we should know about your order?"
              className="field-input resize-none"
            />
          </Field>

          {submitError && <p className="field-error">{submitError}</p>}

          <button type="submit" disabled={submitting} className={buttonVariants({ size: "lg", className: "w-full" })}>
            {submitting ? "Placing Order…" : "Place Order"}
          </button>
        </form>

        <div className="space-y-6">
          <div className="surface-card p-6">
            <p className="text-base font-medium text-neutral-900">Order Summary</p>
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="min-w-0 truncate text-neutral-600">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="price-tag shrink-0 font-medium text-neutral-900">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm">
              <span className="font-medium text-neutral-900">Total</span>
              <span className="price-tag font-semibold text-primary">{formatPrice(subtotal)}</span>
            </div>
          </div>

          <PaymentInfoCard />
        </div>
      </div>
    </div>
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
