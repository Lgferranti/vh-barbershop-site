// Entrega o aviso de novo agendamento aos aparelhos cadastrados (Web Push).
import webpush from 'web-push';

const SECRET = 'vh_push_5Kq2xR9mTd';
const VAPID_PUBLIC  = 'BPEXceHiKTNpkwfHYQuwiVw2B0q-MT4OWkeJ7J7yj4Zwe6feeaB-Q0gq60yfMn7AnaiWnOXv9e_cX4tObvT8fkg';
const VAPID_PRIVATE = 'NxlxSiMpfBhwU73g2yi3RfcghcRvsW5bVxFL9CC43_M';

webpush.setVapidDetails('mailto:contato@vhbarber.shop', VAPID_PUBLIC, VAPID_PRIVATE);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, erro: 'metodo' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    if (body.secret !== SECRET) return res.status(401).json({ ok: false, erro: 'nao autorizado' });
    const subs = Array.isArray(body.subs) ? body.subs : [];
    const payload = JSON.stringify({
      titulo: body.titulo || 'VH Barbershop',
      corpo: body.corpo || 'Novo agendamento',
    });
    const results = await Promise.all(subs.map(async (s) => {
      try { await webpush.sendNotification(s, payload, { urgency: 'high', TTL: 86400 }); return { ok: true }; }
      catch (e) { return { ok: false, status: e.statusCode || 0 }; }
    }));
    const enviados = results.filter((r) => r.ok).length;
    res.status(200).json({ ok: true, enviados, total: subs.length, falhas: results.filter(r => !r.ok) });
  } catch (e) {
    res.status(500).json({ ok: false, erro: String(e) });
  }
}
