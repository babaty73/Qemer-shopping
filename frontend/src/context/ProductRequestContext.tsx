import { createContext, useContext, useState, type ReactNode } from "react";

interface ProductRequestContextValue {
  isOpen: boolean;
  /** Pre-fills the Product Name field — e.g. opened from an out-of-stock product's page. */
  prefillName?: string;
  openRequestForm: (prefillName?: string) => void;
  closeRequestForm: () => void;
}

const ProductRequestContext = createContext<ProductRequestContextValue | undefined>(undefined);

/** Lets the "Request a Product" trigger live anywhere (FAB, footer, empty states, product pages). */
export function ProductRequestProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prefillName, setPrefillName] = useState<string | undefined>();

  function openRequestForm(name?: string) {
    setPrefillName(name);
    setIsOpen(true);
  }

  function closeRequestForm() {
    setIsOpen(false);
  }

  return (
    <ProductRequestContext.Provider value={{ isOpen, prefillName, openRequestForm, closeRequestForm }}>
      {children}
    </ProductRequestContext.Provider>
  );
}

export function useProductRequest(): ProductRequestContextValue {
  const ctx = useContext(ProductRequestContext);
  if (!ctx) throw new Error("useProductRequest must be used within ProductRequestProvider");
  return ctx;
}
