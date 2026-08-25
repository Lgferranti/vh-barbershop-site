// Mantém o banco acordado: o Supabase gratuito hiberna após dias sem consultas.
const SB_URL = 'https://ddehzfbderumdfxkvvme.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZWh6ZmJkZXJ1bWRmeGt2dm1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5OTIxNzQsImV4cCI6MjA5OTU2ODE3NH0.0Y7LDDQlPuYNrVZLpExTwppG7NnO0_50hILsVKvwje0';

export default async function handler(req, res) {
  const started = Date.now();
  try {
    const r = await fetch(`${SB_URL}/rest/v1/services?select=id&limit=1`, {
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
    });
    const rows = r.ok ? await r.json() : null;
    const ok = r.ok && Array.isArray(rows) && rows.length > 0;
    res.status(ok ? 200 : 503).json({ ok, banco: ok ? 'acordado' : 'sem resposta esperada', status: r.status, ms: Date.now() - started, quando: new Date().toISOString() });
  } catch (e) {
    res.status(503).json({ ok: false, banco: 'inacessivel', erro: String(e), quando: new Date().toISOString() });
  }
}
