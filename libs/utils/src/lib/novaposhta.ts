export async function npRequest(modelName: string, calledMethod: string, methodProperties: object = {}) {
  const res = await fetch('https://api.novaposhta.ua/v2.0/json/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apiKey: process.env.NP_API_KEY,
      modelName,
      calledMethod,
      methodProperties
    })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.errors?.join(', '));
  return data.data;
}