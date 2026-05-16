import { fetchWithAuth } from "./auth.js";

export async function initiateStripe(order_id: number) {
  const res = await fetchWithAuth('/api/payments/stripe', {
    method: 'POST',
    body: JSON.stringify({ order_id }),
  });

  if (!res.ok) throw new Error((await res.json()).error);

  const { url } = await res.json();
  window.location.href = url;
}