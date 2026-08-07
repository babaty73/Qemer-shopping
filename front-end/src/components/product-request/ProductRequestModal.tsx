import { Modal } from "@/components/ui/Modal";
import { useProductRequest } from "@/context/ProductRequestContext";
import { ProductRequestForm } from "./ProductRequestForm";

/** Mounted once, globally — see Layout.tsx. Opened via useProductRequest() from anywhere. */
export function ProductRequestModal() {
  const { isOpen, prefillName, closeRequestForm } = useProductRequest();

  return (
    <Modal open={isOpen} onClose={closeRequestForm} title="Request a Product" size="lg">
      <ProductRequestForm prefillName={prefillName} onDone={closeRequestForm} />
    </Modal>
  );
}
