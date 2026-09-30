import type { MetadataRoute } from "next"
import { products } from "@/data/products"
import { categories } from "@/data/categories"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://deyerlitap.az"

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const categoryUrls = categories.map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...categoryUrls,
    ...productUrls,
  ]
}