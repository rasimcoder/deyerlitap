export default function HomePage() {
  return (
    <div className="container py-10">
      <section className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Dəyərli Tap
        </h1>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Bakı və Sumqayıtda yeni və seçilmiş ikinci əl əşyaların satış mərkəzi.
          Antikvardan texnikaya qədər hər tapıntı burada bir dəyərdir!
        </p>
      </section>

      <section className="rounded-xl border bg-card p-8 text-center">
        <p className="text-lg text-muted-foreground">
          Məhsullar tezliklə burada görünəcək...
        </p>
      </section>
    </div>
  )
}