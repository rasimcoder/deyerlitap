export type Product = {
  id: string
  title: string
  description?: string | null
  price: number
  oldPrice?: number | null
  image: string
  images: string[]
  condition: string
  isFeatured: boolean
  isActive: boolean
  categoryId: string
  category?: {
    id: string
    name: string
    slug: string
  }
}