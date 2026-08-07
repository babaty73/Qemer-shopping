import { Sparkles } from "lucide-react";
import { useProductRequest } from "@/context/ProductRequestContext";

/**
 * Global floating trigger — visible on every storefront page (mounted in
 * Layout.tsx), so "Request a Product" is always one tap away regardless of
 * where a customer is browsing. Collapses to an icon-only circle on mobile
 * to avoid eating into limited screen space.
 */
export function RequestProductFAB() {
  const { openRequestForm } = useProductRequest();

  return (
    <button
      type="button"
      onClick={() => openRequestForm()}
      aria-label="Request a Product"
      className="fixed bottom-5 left-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lifted transition-transform hover:scale-105 sm:h-auto sm:w-auto sm:gap-2 sm:rounded-full sm:px-5 sm:py-3"
    >
      <Sparkles className="h-5 w-5 sm:h-4 sm:w-4" aria-hidden />
      <span className="hidden text-sm font-medium sm:inline">Request a Product</span>
    </button>
  );
}
