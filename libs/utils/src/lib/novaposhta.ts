export async function npRequest(modelName: string, calledMethod: string, methodProperties: object = {}) {
  const res = await fetch('/api/novaposhta', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ modelName, calledMethod, methodProperties })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  
  return data;
}