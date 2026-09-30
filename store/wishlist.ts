import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Product } from "@/types/product"

type WishlistState = {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (id: string) => void
  toggleItem: (product: Product) => void
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const exists = get().items.some((item) => item.id === product.id)
        if (!exists) {
          set({ items: [...get().items, product] })
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) })
      },

      toggleItem: (product) => {
        const exists = get().items.some((item) => item.id === product.id)
        if (exists) {
          get().removeItem(product.id)
        } else {
          get().addItem(product)
        }
      },

      isInWishlist: (id) => {
        return get().items.some((item) => item.id === id)
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "deyerlitap-wishlist",
    }
  )
)