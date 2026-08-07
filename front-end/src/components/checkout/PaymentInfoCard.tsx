import { Landmark, Smartphone } from "lucide-react";
import { PAYMENT_INFO } from "@/lib/constants";

/** Bank + Telebirr details — shown on the Cart page and again at Checkout. */
export function PaymentInfoCard() {
  return (
    <div className="surface-card p-6">
      <p className="text-base font-medium text-neutral-900">Payment Information</p>
      <p className="mt-1 text-sm text-neutral-500">
        Transfer the total, then attach your payment screenshot at checkout.
      </p>

      <div className="mt-5 space-y-4">
        <div className="flex gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
            <Landmark className="h-4 w-4" aria-hidden />
          </span>
          <div className="text-sm">
            <p className="font-medium text-neutral-900">{PAYMENT_INFO.bankName}</p>
            <p className="text-neutral-500">{PAYMENT_INFO.accountName}</p>
            <p className="price-tag text-neutral-700">{PAYMENT_INFO.accountNumber}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary-light text-secondary">
            <Smartphone className="h-4 w-4" aria-hidden />
          </span>
          <div className="text-sm">
            <p className="font-medium text-neutral-900">Telebirr</p>
            <p className="price-tag text-neutral-700">{PAYMENT_INFO.telebirrNumber}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
