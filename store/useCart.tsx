// // store/useCart.ts
// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// export interface CartItem {
//   id: string;
//   name: string;
//   dbId?: string;
//   slug: string;
//   price: number;
//   quantity: number;
//   image: string;
//   size?: string;
//   color?: string;
// }

// interface CartStore {
//   items: CartItem[];
//   addItem: (item: CartItem) => void;
//   removeItem: (id: string) => void;
//   updateQuantity: (id: string, delta: number) => void;
//   clearCart: () => void;
//   setItems: (items: CartItem[]) => void; // Add this line
// }

// export const useCart = create<CartStore>()(
//   persist(
//     (set) => ({
//       items: [],
//       addItem: (newItem) =>
//         set((state) => {
//           const existing = state.items.find((i) => i.id === newItem.id);
//           if (existing) {
//             return {
//               items: state.items.map((i) =>
//                 i.id === newItem.id
//                   ? { ...i, quantity: i.quantity + newItem.quantity }
//                   : i
//               ),
//             };
//           }
//           return { items: [...state.items, newItem] };
//         }),
//       removeItem: (id) =>
//         set((state) => ({
//           items: state.items.filter((i) => i.id !== id),
//         })),
//       updateQuantity: (id, delta) =>
//         set((state) => ({
//           items: state.items.map((i) =>
//             i.id === id
//               ? { ...i, quantity: Math.max(1, i.quantity + delta) }
//               : i
//           ),
//         })),
//       clearCart: () => set({ items: [] }),
//       setItems: (newItems) => set({ items: newItems }), // Add this implementation
//     }),
//     { name: "shopping-cart" }
//   )
// );

// store/useCart.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string; // This is the composite ID for frontend: productId-size-color
  productId: string; // The actual product UUID
  dbId?: string; // The database CartItem.id (only available after sync)
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  setItems: (items: CartItem[]) => void;
  syncWithDatabase: (dbItems: any[]) => void;
}

// Helper to create composite ID
export const createCartItemId = (
  productId: string,
  size?: string,
  color?: string
) => {
  const parts = [productId];
  if (size) parts.push(size);
  if (color) parts.push(color);
  return parts.join("-");
};

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (newItem) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === newItem.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === newItem.id
                  ? { ...i, quantity: i.quantity + newItem.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, newItem] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      updateQuantity: (id, delta) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id
              ? { ...i, quantity: Math.max(1, i.quantity + delta) }
              : i
          ),
        })),

      clearCart: () => set({ items: [] }),

      setItems: (newItems) => set({ items: newItems }),

      // Sync local cart with database cart items
      syncWithDatabase: (dbItems) =>
        set((state) => {
          const syncedItems = dbItems.map((dbItem) => {
            const compositeId = createCartItemId(
              dbItem.productId,
              dbItem.size,
              dbItem.color
            );

            // Find matching local item
            const localItem = state.items.find((i) => i.id === compositeId);

            return {
              id: compositeId,
              productId: dbItem.productId,
              dbId: dbItem.id, // Store the database ID
              name: dbItem.product.name,
              slug: dbItem.product.slug,
              price: Number(dbItem.product.price),
              quantity: dbItem.quantity,
              image: dbItem.product.thumbnail,
              size: dbItem.size || undefined,
              color: dbItem.color || undefined,
            };
          });

          return { items: syncedItems };
        }),
    }),
    { name: "shopping-cart" }
  )
);
