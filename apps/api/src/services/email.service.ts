import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM ?? 'onboarding@resend.dev';

type OrderItem = {
  title_snapshot: string;
  quantity: number;
  price_snapshot: number;
};

function orderItemsHtml(items: OrderItem[], currency: string) {
  return items.map(i => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #f0ebe3">${i.title_snapshot}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;text-align:center">${i.quantity}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;text-align:right">${i.price_snapshot * i.quantity} ${currency}</td>
    </tr>
  `).join('');
}

function baseTemplate(content: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family:sans-serif;color:#1a1a1a;background:#f7f7f5;margin:0;padding:0">
      <div style="max-width:560px;margin:40px auto;background:#fff;border:1px solid #e8e3dc;border-radius:8px;overflow:hidden">
        <div style="padding:24px 32px;border-bottom:1px solid #e8e3dc">
          <h1 style="margin:0;font-size:20px;letter-spacing:0.05em;text-transform:uppercase">Arusa</h1>
        </div>
        <div style="padding:32px">
          ${content}
        </div>
        <div style="padding:16px 32px;border-top:1px solid #e8e3dc;font-size:12px;color:#888;text-align:center">
          © Arusa. Всі права захищені.
        </div>
      </div>
    </body>
    </html>
  `;
}

// Підтвердження замовлення
export async function sendOrderConfirmation(to: string, order: {
  id: number;
  total_amount: number;
  currency: string;
  items: OrderItem[];
  address?: { city: string; np_warehouse_description?: string } | null;
}) {
  const addressLine = order.address
    ? `<p style="color:#555;font-size:14px">📦 Доставка: ${order.address.city} — ${order.address.np_warehouse_description ?? ''}</p>`
    : '';

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Замовлення #${order.id} прийнято`,
    html: baseTemplate(`
      <h2 style="margin:0 0 16px">Дякуємо за замовлення!</h2>
      <p style="color:#555;font-size:14px">Ваше замовлення <strong>#${order.id}</strong> прийнято і передано на обробку.</p>
      ${addressLine}
      <table style="width:100%;border-collapse:collapse;margin:24px 0;font-size:14px">
        <thead>
          <tr style="color:#888;font-size:12px;text-transform:uppercase">
            <th style="text-align:left;padding-bottom:8px">Товар</th>
            <th style="text-align:center;padding-bottom:8px">К-сть</th>
            <th style="text-align:right;padding-bottom:8px">Сума</th>
          </tr>
        </thead>
        <tbody>${orderItemsHtml(order.items, order.currency)}</tbody>
      </table>
      <p style="text-align:right;font-size:16px;font-weight:700">Разом: ${order.total_amount} ${order.currency}</p>
    `),
  });
}

// Підтвердження оплати
export async function sendPaymentConfirmation(to: string, order: {
  id: number;
  total_amount: number;
  currency: string;
}) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Оплата замовлення #${order.id} підтверджена`,
    html: baseTemplate(`
      <h2 style="margin:0 0 16px">Оплата підтверджена ✓</h2>
      <p style="color:#555;font-size:14px">Ми отримали оплату за замовлення <strong>#${order.id}</strong>.</p>
      <p style="color:#555;font-size:14px">Сума: <strong>${order.total_amount} ${order.currency}</strong></p>
      <p style="color:#555;font-size:14px">Ваше замовлення буде відправлено найближчим часом.</p>
    `),
  });
}

// Відправлено
export async function sendOrderShipped(to: string, order: {
  id: number;
  tracking_number?: string | null;
}) {
  const trackingLine = order.tracking_number
    ? `<p style="color:#555;font-size:14px">
        Номер ТТН: <a href="https://novaposhta.ua/tracking/?cargo_number=${order.tracking_number}" style="color:#a89880">${order.tracking_number}</a>
       </p>`
    : '';

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Замовлення #${order.id} відправлено`,
    html: baseTemplate(`
      <h2 style="margin:0 0 16px">Ваше замовлення в дорозі 🚚</h2>
      <p style="color:#555;font-size:14px">Замовлення <strong>#${order.id}</strong> передано в Нову Пошту.</p>
      ${trackingLine}
    `),
  });
}

// Доставлено
export async function sendOrderDelivered(to: string, order: { id: number }) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Замовлення #${order.id} доставлено`,
    html: baseTemplate(`
      <h2 style="margin:0 0 16px">Замовлення доставлено ✓</h2>
      <p style="color:#555;font-size:14px">Ваше замовлення <strong>#${order.id}</strong> доставлено. Дякуємо що обрали Arusa!</p>
    `),
  });
}

// Скасування
export async function sendOrderCanceled(to: string, order: { id: number }) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Замовлення #${order.id} скасовано`,
    html: baseTemplate(`
      <h2 style="margin:0 0 16px">Замовлення скасовано</h2>
      <p style="color:#555;font-size:14px">Ваше замовлення <strong>#${order.id}</strong> було скасовано.</p>
      <p style="color:#555;font-size:14px">Якщо у вас є питання — зв'яжіться з нами.</p>
    `),
  });
}
