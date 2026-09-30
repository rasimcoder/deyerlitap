export type Product = {
  id: string
  title: string
  price: number
  oldPrice?: number
  image: string
  category: string
  condition: "Yeni" | "İşlənmiş"
  isFeatured?: boolean
}