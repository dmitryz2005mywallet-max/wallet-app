/* Service worker: lets the app open offline and be installed as an app (PWA).
   HTML, scripts and the manifest go network-first (updates show up as soon as there is a connection, the cached copy is the fallback);
   icons, fonts and the Firebase SDK files are served from the cache and refreshed in the background.
   Firebase Auth / Firestore requests are never touched. */
const V='mywallet-v1',CORE=['./','index.html','firebase-config.js','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png','apple-touch-icon.png'];
const CROSS=[/^https:\/\/fonts\.googleapis\.com\//,/^https:\/\/fonts\.gstatic\.com\//,/^https:\/\/www\.gstatic\.com\/firebasejs\//];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(CORE.map(u=>c.add(new Request(u,{cache:'reload'})).catch(()=>{})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
const net=r=>new Promise((ok,no)=>{const t=setTimeout(()=>no(new Error('timeout')),4000);fetch(r).then(x=>{clearTimeout(t);ok(x);},e=>{clearTimeout(t);no(e);});});
const put=(req,res)=>{if(res&&(res.ok||res.type==='opaque')){const c=res.clone();caches.open(V).then(x=>x.put(req,c)).catch(()=>{});}return res;};
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin===location.origin){
    const live=r.mode==='navigate'||/\.(html|js|webmanifest)$/.test(u.pathname)||u.pathname.endsWith('/');
    if(live){
      e.respondWith(net(r).then(res=>put(r,res)).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('index.html'))));
    }else{
      e.respondWith(caches.match(r).then(m=>{const n=fetch(r).then(res=>put(r,res)).catch(()=>m);return m||n;}));
    }
    return;
  }
  if(CROSS.some(x=>x.test(r.url))){
    e.respondWith(caches.match(r).then(m=>{const n=fetch(r).then(res=>put(r,res)).catch(()=>m);return m||n;}));
  }
});
