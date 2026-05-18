import { Resend } from 'resend';
import { OrderItem } from '@org/shared-types';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM ?? 'onboarding@resend.dev';

// ─── Шаблони ──────────────────────────────────────────────────────────────────

function baseTemplate(title: string, content: string) {
  return `
    <!DOCTYPE html>
    <html lang="uk">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
      <style>
        body { font-family: sans-serif; background: #f7f7f5; margin: 0; padding: 0; }
        .wrapper { max-width: 600px; margin: 40px auto; background: #fff; border: 1px solid #e8e3dc; border-radius: 8px; overflow: hidden; }
        .header { background: #1a1a1a; color: #fff; padding: 24px 32px; font-size: 20px; letter-spacing: 0.05em; text-transform: uppercase; }
        .body { padding: 32px; color: #333; font-size: 15px; line-height: 1.6; }
        .footer { padding: 16px 32px; background: #f7f7f5; color: #888; font-size: 12px; border-top: 1px solid #e8e3dc; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        th { text-align: left; padding: 8px 12px; background: #f7f7f5; font-size: 12px; text-transform: uppercase; color: #888; }
        td { padding: 10px 12px; border-bottom: 1px solid #f0ebe3; font-size: 14px; }
        .total { font-size: 16px; font-weight: 600; text-align: right; margin-top: 8px; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 13px; background: #f0ebe3; color: #1a1a1a; }
        .btn { display: inline-block; padding: 12px 24px; background: #1a1a1a; color: #fff; text-decoration: none; border-radius: 4px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 16px; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">Arusa</div>
        <div class="body">${content}</div>
        <div class="footer">© Arusa. Якщо у вас є питання — відповідайте на цей лист.</div>
      </div>
    </body>
    </html>
  `;
}

function itemsTable(items: { title_snapshot: string; quantity: number; price_snapshot: number }[], total: number, currency: string) {
  const rows = items.map(i => `
    <tr>
      <td>${i.title_snapshot}</td>
      <td>${i.quantity}</td>
      <td>${i.price_snapshot} ${currency}</td>
      <td>${i.price_snapshot * i.quantity} ${currency}</td>
    </tr>
  `).join('');

  return `
    <table>
      <thead><tr><th>Товар</th><th>К-сть</th><th>Ціна</th><th>Разом</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="total">Разом: ${total} ${currency}</div>
  `;
}

// ─── Листи ────────────────────────────────────────────────────────────────────

type OrderEmailData = {
  to: string;
  order_id: number;
  total_amount: number;
  currency: string;
  items: { title_snapshot: string; quantity: number; price_snapshot: number }[];
};

export async function sendOrderConfirmation(data: OrderEmailData) {
  const content = `
    <p>Дякуємо за ваше замовлення! 🎉</p>
    <p>Ваше замовлення <strong>#${data.order_id}</strong> успішно оформлено та очікує підтвердження.</p>
    ${itemsTable(data.items, data.total_amount, data.currency)}
    <p>Ми повідомимо вас коли замовлення буде підтверджено.</p>
  `;

  return resend.emails.send({
    from: FROM,
    to: data.to,
    subject: `Замовлення #${data.order_id} оформлено — Arusa`,
    html: baseTemplate(`Замовлення #${data.order_id}`, content),
  });
}

export async function sendPaymentSuccess(data: OrderEmailData) {
  const content = `
    <p>Оплату отримано! ✅</p>
    <p>Замовлення <strong>#${data.order_id}</strong> успішно оплачено.</p>
    ${itemsTable(data.items, data.total_amount, data.currency)}
    <p>Ми готуємо ваше замовлення до відправки і незабаром повідомимо вас.</p>
  `;

  return resend.emails.send({
    from: FROM,
    to: data.to,
    subject: `Оплату підтверджено — замовлення #${data.order_id}`,
    html: baseTemplate('Оплату підтверджено', content),
  });
}

export async function sendOrderShipped(data: { to: string; order_id: number; tracking_number: string }) {
  const trackingUrl = `https://novaposhta.ua/tracking/?cargo_number=${data.tracking_number}`;
  const content = `
    <p>Ваше замовлення <strong>#${data.order_id}</strong> відправлено! 📦</p>
    <p>Номер ТТН Нової Пошти: <strong>${data.tracking_number}</strong></p>
    <a href="${trackingUrl}" class="btn">Відстежити посилку</a>
    <p style="margin-top: 16px; color: #888; font-size: 13px;">
      Або перейдіть за посиланням: <a href="${trackingUrl}">${trackingUrl}</a>
    </p>
  `;

  return resend.emails.send({
    from: FROM,
    to: data.to,
    subject: `Замовлення #${data.order_id} відправлено`,
    html: baseTemplate('Замовлення відправлено', content),
  });
}

export async function sendOrderStatusChanged(data: { to: string; order_id: number; status: string }) {
  const STATUS_LABELS: Record<string, string> = {
    CONFIRMED: 'Підтверджено',
    CANCELED: 'Скасовано',
    DELIVERED: 'Доставлено',
  };

  const label = STATUS_LABELS[data.status];
  if (!label) return; // не відправляємо для всіх статусів

  const content = `
    <p>Статус вашого замовлення <strong>#${data.order_id}</strong> змінився.</p>
    <p>Поточний статус: <span class="badge">${label}</span></p>
    <a href="${process.env.CLIENT_URL}/profile" class="btn">Переглянути замовлення</a>
  `;

  return resend.emails.send({
    from: FROM,
    to: data.to,
    subject: `Замовлення #${data.order_id} — ${label}`,
    html: baseTemplate('Статус замовлення', content),
  });
}

export async function sendWelcome(data: { to: string; first_name: string }) {
  const content = `
    <p>Вітаємо, <strong>${data.first_name}</strong>! 👋</p>
    <p>Дякуємо за реєстрацію в Arusa. Ваш акаунт успішно створено.</p>
    <a href="${process.env.CLIENT_URL}" class="btn">Перейти до магазину</a>
  `;

  return resend.emails.send({
    from: FROM,
    to: data.to,
    subject: 'Ласкаво просимо до Arusa',
    html: baseTemplate('Ласкаво просимо', content),
  });
}
