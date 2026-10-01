import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Əvvəlcə köhnə məlumatları təmizlə (istəsən)
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  // Kateqoriyalar
  const yeni = await prisma.category.create({
    data: {
      name: "Yeni",
      slug: "yeni",
      description: "Yeni və istifadə olunmamış məhsullar",
    },
  })

  const isinmis = await prisma.category.create({
    data: {
      name: "İşlənmiş",
      slug: "isinmis",
      description: "Keyfiyyətli ikinci əl məhsullar",
    },
  })

  const elektronika = await prisma.category.create({
    data: {
      name: "Elektronika",
      slug: "elektronika",
      description: "TV, telefon, kompüter və digər texnika",
    },
  })

  const mebel = await prisma.category.create({
    data: {
      name: "Mebel",
      slug: "mebel",
      description: "Divan, masa, stul və digər mebel",
    },
  })

  const evVeBag = await prisma.category.create({
    data: {
      name: "Ev və Bağ",
      slug: "ev-ve-bag",
      description: "Ev əşyaları, bağ alətləri və dekor",
    },
  })

  const sexsiEsya = await prisma.category.create({
    data: {
      name: "Şəxsi Əşyalar",
      slug: "sexsi-esya",
      description: "Çanta, saat, aksesuar və s.",
    },
  })

  // Məhsullar
  await prisma.product.createMany({
    data: [
      {
        title: "2 ədəd Qədim Çanta Dəsti",
        price: 15,
        oldPrice: 25,
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&h=500&fit=crop",
        images: [],
        condition: "İşlənmiş",
        isFeatured: true,
        categoryId: sexsiEsya.id,
      },
      {
        title: "Şəkspir və Qılınc və Qalxan Kitabları",
        price: 15,
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop",
        images: [],
        condition: "İşlənmiş",
        categoryId: isinmis.id,
      },
      {
        title: "Tarix Cibinizdə: SSRİ və 90-cı illərin Pul Kolleksiyası",
        price: 10,
        image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=500&h=500&fit=crop",
        images: [],
        condition: "İşlənmiş",
        isFeatured: true,
        categoryId: isinmis.id,
      },
      {
        title: "2-li Yumru Zigon Masa Dəsti - Mərmər Naxışlı",
        price: 180,
        oldPrice: 250,
        image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=500&h=500&fit=crop",
        images: [],
        condition: "Yeni",
        categoryId: evVeBag.id,
      },
      {
        title: "Müasir Modul Künc Divanı",
        price: 1200,
        oldPrice: 1500,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop",
        images: [],
        condition: "Yeni",
        isFeatured: true,
        categoryId: mebel.id,
      },
      {
        title: "Müasir Oval Stol-Stul Dəsti",
        price: 1000,
        oldPrice: 1200,
        image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=500&h=500&fit=crop",
        images: [],
        condition: "Yeni",
        categoryId: mebel.id,
      },
      {
        title: "Ideal Vəziyyətdə Böyük Ekran TCL Smart TV",
        price: 1200,
        oldPrice: 2000,
        image: "https://images.unsplash.com/photo-1593359677879-a4b92e8c6925?w=500&h=500&fit=crop",
        images: [],
        condition: "İşlənmiş",
        categoryId: elektronika.id,
      },
      {
        title: "Müasir Yazı və Ofis Masası",
        price: 90,
        image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&h=500&fit=crop",
        images: [],
        condition: "Yeni",
        categoryId: mebel.id,
      },
    ],
  })

  console.log("Seed tamamlandı!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })