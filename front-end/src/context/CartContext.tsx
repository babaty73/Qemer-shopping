import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { buildCartItemId, type CartItem } from "@/types/cart";

const STORAGE_KEY = "kemer-market-cart";

interface AddToCartInput {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  color?: string;
  size?: string;
  quantity?: number;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (input: AddToCartInput) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function loadStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) return [];

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Cart state, persisted to localStorage, plus drawer open/close state. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadStoredCart());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(input: AddToCartInput) {
    const id = buildCartItemId(
      input.productId,
      input.color,
      input.size
    );

    const quantity = input.quantity ?? 1;

    setItems((prev) => {
      const existing = prev.find((item) => item.id === id);

      if (existing) {
        return prev.map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          id,
          productId: input.productId,
          slug: input.slug,
          name: input.name,
          price: input.price,
          image: input.image,
          color: input.color,
          size: input.size,
          quantity,
        },
      ];
    });

    setIsOpen(true);
  }

  function updateQuantity(id: string, quantity: number) {
    if (quantity < 1) {
      removeItem(id);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity }
          : item
      )
    );
  }

  function removeItem(id: string) {
    setItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  }

  function clearCart() {
    setItems([]);
  }

  const { itemCount, subtotal } = useMemo(
    () => ({
      itemCount: items.reduce(
        (sum, item) => sum + item.quantity,
        0
      ),
      subtotal: items.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      ),
    }),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        isOpen,

        openCart: () => {
          setIsOpen(true);
        },

        closeCart: () => {

          setIsOpen(false);
        },

        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error(
      "useCart must be used within CartProvider"
    );
  }

  return ctx;
}
