import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

type OrderEmailItem = {
  title: string
  price: number
  quantity: number
}

type OrderEmailData = {
  orderId: string
  fullName: string
  phone: string
  city: string
  address: string
  note?: string | null
  total: number
  items: OrderEmailItem[]
}

export async function sendOrderNotification(order: OrderEmailData) {
  const adminEmail = process.env.ADMIN_EMAIL

  console.log("EMAIL DEBUG:", {
    hasKey: !!process.env.RESEND_API_KEY,
    adminEmail,
  })

  if (!process.env.RESEND_API_KEY || !adminEmail) {
    console.warn("RESEND_API_KEY və ya ADMIN_EMAIL yoxdur — email göndərilmədi")
    return
  }

  const itemsHtml = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">${item.title}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${item.price * item.quantity} ₼</td>
        </tr>`
    )
    .join("")

  const result = await resend.emails.send({
    from: "Dəyərli Tap <onboarding@resend.dev>",
    to: adminEmail,
    subject: `Yeni sifariş #${order.orderId.slice(0, 8)} – ${order.total} ₼`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#0f172a;">Yeni sifariş alındı</h2>
        <p><strong>Sifariş ID:</strong> ${order.orderId}</p>
        <p><strong>Müştəri:</strong> ${order.fullName}</p>
        <p><strong>Telefon:</strong> ${order.phone}</p>
        <p><strong>Ünvan:</strong> ${order.city}, ${order.address}</p>
        ${order.note ? `<p><strong>Qeyd:</strong> ${order.note}</p>` : ""}

        <table style="width:100%;border-collapse:collapse;margin-top:16px;">
          <thead>
            <tr style="background:#f1f5f9;">
              <th style="padding:8px;text-align:left;">Məhsul</th>
              <th style="padding:8px;text-align:center;">Ədəd</th>
              <th style="padding:8px;text-align:right;">Məbləğ</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <p style="margin-top:16px;font-size:18px;">
          <strong>Cəmi: ${order.total} ₼</strong>
        </p>

        <p style="color:#64748b;font-size:13px;margin-top:24px;">
          Bu email Dəyərli Tap sifariş sistemindən avtomatik göndərilib.
        </p>
      </div>
    `,
  })
  console.log("EMAIL RESULT:", result)
}