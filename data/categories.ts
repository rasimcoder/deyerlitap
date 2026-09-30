export const categories = [
  {
    slug: "yeni",
    name: "Yeni",
    description: "Yeni və istifadə olunmamış məhsullar",
  },
  {
    slug: "isinmis",
    name: "İşlənmiş",
    description: "Keyfiyyətli ikinci əl məhsullar",
  },
  {
    slug: "elektronika",
    name: "Elektronika",
    description: "TV, telefon, kompüter və digər texnika",
  },
  {
    slug: "neqliyyat",
    name: "Nəqliyyat",
    description: "Velosiped, skuter və digər nəqliyyat vasitələri",
  },
  {
    slug: "ev-ve-bag",
    name: "Ev və Bağ",
    description: "Ev əşyaları, bağ alətləri və dekor",
  },
  {
    slug: "mebel",
    name: "Mebel",
    description: "Divan, masa, stul və digər mebel",
  },
  {
    slug: "sexsi-esya",
    name: "Şəxsi Əşyalar",
    description: "Çanta, saat, aksesuar və s.",
  },
  {
    slug: "diger",
    name: "Digər",
    description: "Digər kateqoriyalara daxil olmayan məhsullar",
  },
] as const

export type CategorySlug = (typeof categories)[number]["slug"]