// VH Barbershop — service worker (rede primeiro; cache só como reserva offline)
const C='vh-v2';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(clients.claim()));
self.addEventListener('fetch',e=>{
  if(e.request.mode==='navigate'){
    e.respondWith(
      fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r;})
        .catch(()=>caches.match(e.request))
    );
  }
});

/* ===== avisos de novo agendamento ===== */
self.addEventListener('push', e=>{
  let d={titulo:'VH Barbershop', corpo:'Novo agendamento'};
  try{ if(e.data) d=Object.assign(d, e.data.json()); }catch(err){ try{ d.corpo=e.data.text(); }catch(_){} }
  e.waitUntil(self.registration.showNotification(d.titulo||'VH Barbershop', {
    body: d.corpo || '',
    icon: 'icons/icon-192.png',
    badge: 'icons/icon-192.png',
    tag: 'vh-agendamento',
    renotify: true,
    data: { url: '/painel' }
  }));
});
self.addEventListener('notificationclick', e=>{
  e.notification.close();
  const url=(e.notification.data&&e.notification.data.url)||'/painel';
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
    for(const c of list){ if(c.url.includes('/painel') && 'focus' in c) return c.focus(); }
    return clients.openWindow(url);
  }));
});
