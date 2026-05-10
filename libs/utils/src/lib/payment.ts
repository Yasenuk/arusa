import { fetchWithAuth } from "./auth.js";

export async function initiateLiqPay(order_id: number) {
  const res = await fetchWithAuth('/api/payments/liqpay', {
    method: 'POST',
    body: JSON.stringify({ order_id }),
  });

  if (!res.ok) throw new Error((await res.json()).error);

  const { data, signature } = await res.json();

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://www.liqpay.ua/api/3/checkout';
  form.acceptCharset = 'utf-8';

  ['data', 'signature'].forEach((key) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = key === 'data' ? data : signature;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}