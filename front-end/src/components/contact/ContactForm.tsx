import { useState } from "react";
import { Send, MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { cn, getTelegramContactLink, getWhatsAppContactLink } from "@/lib/utils";

interface FormState {
  name: string;
  email: string;
  message: string;
}

type Errors = Partial<Record<keyof FormState, string>>;

const EMPTY_FORM: FormState = { name: "", email: "", message: "" };

function validate(form: FormState): Errors {
  const errors: Errors = {};
  if (!form.name.trim()) errors.name = "Please enter your name.";
  if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = "Enter a valid email, or leave this blank.";
  }
  if (!form.message.trim()) errors.message = "Tell us a little about what you need.";
  return errors;
}

/**
 * There's no online checkout on this site, so this form doesn't post to a
 * backend either — consistent with the rest of the storefront, it hands the
 * message straight to Telegram or WhatsApp, prefilled and ready to send.
 */
export function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Errors>({});

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSend(getLink: (input: FormState) => string) {
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    window.open(getLink(form), "_blank", "noopener,noreferrer");
    setForm(EMPTY_FORM);
  }

  return (
    <form
      noValidate
      onSubmit={(e) => e.preventDefault()}
      className="rounded-2xl border border-neutral-100 p-6 shadow-soft sm:p-8"
    >
      <Field label="Name" error={errors.name}>
        <input
          type="text"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          className={inputClass(Boolean(errors.name))}
          placeholder="Your name"
        />
      </Field>

      <Field label="Email (optional)" error={errors.email} className="mt-5">
        <input
          type="email"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
          className={inputClass(Boolean(errors.email))}
          placeholder="you@example.com"
        />
      </Field>

      <Field label="Message" error={errors.message} className="mt-5">
        <textarea
          value={form.message}
          onChange={(e) => updateField("message", e.target.value)}
          rows={4}
          className={cn(inputClass(Boolean(errors.message)), "resize-none")}
          placeholder="What can we help with?"
        />
      </Field>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => handleSend(getTelegramContactLink)}
          className={buttonVariants({ size: "lg", className: "flex-1" })}
        >
          <Send className="h-4 w-4" aria-hidden /> Send via Telegram
        </button>
        <button
          type="button"
          onClick={() => handleSend(getWhatsAppContactLink)}
          className={buttonVariants({ variant: "secondary", size: "lg", className: "flex-1" })}
        >
          <MessageCircle className="h-4 w-4" aria-hidden /> Send via WhatsApp
        </button>
      </div>
    </form>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    "w-full rounded-xl border bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-emerald-500",
    hasError ? "border-red-300" : "border-neutral-200"
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-neutral-900">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
