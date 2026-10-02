export type Product = {
  id: string
  title: string
  description?: string | null
  price: number
  oldPrice?: number | null
  image: string
  images: string[]
  condition: string
  stock: number
  isFeatured: boolean
  isActive: boolean
  categoryId: string
  costPrice?: number | null
  category?: {
    id: string
    name: string
    slug: string
  }
}