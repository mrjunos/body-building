# -*- coding: utf-8 -*-
import json, base64, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from routine import DAYS

def here(*p):
    return os.path.join(HERE, *p)

OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, '..', 'antigua.html')

names = json.load(open(here('names.json')))
mapping = json.load(open(here('mapping.json')))
try:
    db = {e['id']: e for e in json.load(open(here('exercises.json')))}
except FileNotFoundError:
    sys.exit("Falta exercises.json y las fotos. Ejecuta antes: bash generador/fetch.sh")

def durl(rel):
    p = here('small', rel.replace('/', '__'))
    with open(p, 'rb') as f:
        return 'data:image/jpeg;base64,' + base64.b64encode(f.read()).decode()

IMG = {}
for key, v in mapping.items():
    p = db[v['primary']]
    IMG[key] = {
        'name': names[v['primary']],
        'shots': [durl(i) for i in p['images'][:2]],
        'alts': [{'name': names[a], 'src': durl(db[a]['images'][0]),
                  'eq': db[a]['equipment']} for a in v['alts'] if db[a]['images']],
    }

CSS = r"""
:root{
  --bg:#ECEEF2; --surface:#FFFFFF; --surface-2:#F5F6F9; --line:#DADEE6;
  --ink:#13161B; --ink-2:#3F4653; --muted:#6F7885; --shadow:0 1px 2px rgba(19,22,27,.06),0 8px 24px -18px rgba(19,22,27,.4);
  --k-torso:#1B58C0; --k-pierna:#B4342A; --k-run:#0F6E45; --k-rest:#69717E; --on-kind:#FFFFFF;
  color-scheme:light;
}
@media (prefers-color-scheme:dark){ :root:not([data-theme="light"]){
  --bg:#0F1216; --surface:#171B21; --surface-2:#1D222A; --line:#2A3038;
  --ink:#E9ECF1; --ink-2:#B6BEC9; --muted:#8B94A1; --shadow:0 1px 2px rgba(0,0,0,.5),0 8px 24px -18px rgba(0,0,0,.9);
  --k-torso:#6C9DF3; --k-pierna:#F07C6C; --k-run:#3FBC85; --k-rest:#96A0AD; --on-kind:#10141A;
  color-scheme:dark;
}}
:root[data-theme="dark"]{
  --bg:#0F1216; --surface:#171B21; --surface-2:#1D222A; --line:#2A3038;
  --ink:#E9ECF1; --ink-2:#B6BEC9; --muted:#8B94A1; --shadow:0 1px 2px rgba(0,0,0,.5),0 8px 24px -18px rgba(0,0,0,.9);
  --k-torso:#6C9DF3; --k-pierna:#F07C6C; --k-run:#3FBC85; --k-rest:#96A0AD; --on-kind:#10141A;
  color-scheme:dark;
}
*{box-sizing:border-box}
[hidden]{display:none!important}
body{background:var(--bg);color:var(--ink);
  font-family:"Public Sans","Helvetica Neue",Arial,sans-serif;font-size:15px;line-height:1.55;
  -webkit-text-size-adjust:100%;}
.wrap{max-width:640px;margin:0 auto;padding:0 14px 64px;display:flex;flex-direction:column;gap:18px}

/* ---------- top ---------- */
.top{padding-top:20px;display:flex;flex-direction:column;gap:12px}
.eyebrow{margin:0;font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:10.5px;
  letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}
.rail{display:grid;grid-template-columns:repeat(7,1fr);gap:5px}
.rail button{appearance:none;border:1px solid var(--line);background:var(--surface);border-radius:9px;
  padding:8px 0 7px;display:flex;flex-direction:column;align-items:center;gap:5px;cursor:pointer;
  font:600 13px/1 "Public Sans",sans-serif;color:var(--ink-2);transition:background .15s,border-color .15s}
.rail button .dot{width:16px;height:3px;border-radius:2px;background:var(--kind)}
.rail button[aria-current="true"]{background:var(--kind);border-color:var(--kind);color:var(--on-kind)}
.rail button[aria-current="true"] .dot{background:var(--on-kind);opacity:.7}
.rail button.today::after{content:"";width:4px;height:4px;border-radius:50%;background:var(--ink);opacity:.5;margin-top:-2px}
.rail button[aria-current="true"].today::after{background:var(--on-kind);opacity:.9}

/* ---------- hero ---------- */
.hero{background:var(--surface);border:1px solid var(--line);border-radius:14px;box-shadow:var(--shadow);
  overflow:hidden}
.hero .stripe{height:4px;background:var(--kind)}
.hero .body{padding:16px 16px 15px;display:flex;flex-direction:column;gap:9px}
.hero .kicker{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.tag{font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;
  padding:3px 7px;border-radius:5px;background:color-mix(in srgb,var(--kind) 14%,transparent);color:var(--kind);font-weight:600}
.tag.now{background:var(--kind);color:var(--on-kind)}
h1{margin:0;font-family:"Archivo","Helvetica Neue",Arial,sans-serif;font-weight:900;
  font-stretch:112%;text-transform:uppercase;letter-spacing:-.015em;line-height:.92;
  font-size:clamp(38px,12vw,58px);text-wrap:balance}
.hero .sub{margin:0;font-family:"Archivo",sans-serif;font-weight:700;font-size:17px;color:var(--kind);letter-spacing:-.01em}
.hero .lead{margin:0;color:var(--ink-2);font-size:14px;max-width:58ch}
.meter{display:flex;flex-direction:column;gap:6px;margin-top:3px}
.meter .row{display:flex;justify-content:space-between;align-items:baseline;gap:10px;
  font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.06em;color:var(--muted);
  font-variant-numeric:tabular-nums;text-transform:uppercase}
.meter .track{height:5px;border-radius:3px;background:var(--surface-2);border:1px solid var(--line);overflow:hidden}
.meter .fill{height:100%;background:var(--kind);width:0;transition:width .25s ease}
.reset{appearance:none;background:none;border:0;padding:0;color:var(--muted);cursor:pointer;
  font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.06em;text-transform:uppercase;
  text-decoration:underline;text-underline-offset:3px}
.reset:hover{color:var(--ink)}

/* ---------- callout ---------- */
.callout{background:var(--surface);border:1px solid var(--line);border-left:3px solid var(--kind);
  border-radius:10px;padding:13px 15px;display:flex;flex-direction:column;gap:7px}
.callout h2{margin:0;font-family:"Archivo",sans-serif;font-size:13px;font-weight:800;text-transform:uppercase;
  letter-spacing:.07em;color:var(--kind)}
.callout ol,.callout ul{margin:0;padding-left:18px;display:flex;flex-direction:column;gap:6px;
  font-size:13.5px;color:var(--ink-2)}
.callout li::marker{color:var(--muted);font-family:"IBM Plex Mono",monospace;font-size:11px}

/* ---------- exercise list ---------- */
.list{background:var(--surface);border:1px solid var(--line);border-radius:14px;box-shadow:var(--shadow);overflow:hidden}
.ex + .ex{border-top:1px solid var(--line)}
.ex-head{width:100%;appearance:none;background:none;border:0;text-align:left;cursor:pointer;
  display:grid;grid-template-columns:56px 1fr auto;gap:12px;align-items:center;padding:13px 14px 11px;color:inherit;font:inherit}
.ex-head:hover{background:var(--surface-2)}
.thumb{width:56px;height:56px;border-radius:8px;object-fit:cover;background:var(--surface-2);
  border:1px solid var(--line);display:block}
.ex-txt{min-width:0;display:flex;flex-direction:column;gap:1px}
.grp{font-family:"IBM Plex Mono",monospace;font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--kind);font-weight:600}
.ex-txt h3{margin:0;font-family:"Archivo",sans-serif;font-weight:700;font-size:15.5px;letter-spacing:-.012em;line-height:1.22}
.alt{font-size:12px;color:var(--muted);line-height:1.35}
.rx{display:flex;flex-direction:column;align-items:flex-end;gap:1px;font-family:"IBM Plex Mono",monospace;
  font-variant-numeric:tabular-nums;white-space:nowrap}
.rx b{font-size:14px;font-weight:600}
.rx span{font-size:10px;letter-spacing:.05em;color:var(--muted);text-transform:uppercase}
.ex-head .chev{grid-column:3;justify-self:end}
.sets{display:flex;gap:6px;padding:0 14px 13px;margin-left:68px;flex-wrap:wrap;align-items:center}
.sets .lbl{font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-right:2px}
.set{appearance:none;width:34px;height:30px;border-radius:7px;border:1px solid var(--line);background:var(--surface-2);
  color:var(--muted);font-family:"IBM Plex Mono",monospace;font-size:12px;font-weight:600;cursor:pointer;
  transition:background .12s,color .12s,border-color .12s}
.set[aria-pressed="true"]{background:var(--kind);border-color:var(--kind);color:var(--on-kind)}
.panel{padding:0 14px 16px;display:flex;flex-direction:column;gap:12px;background:var(--surface-2);
  border-top:1px dashed var(--line);padding-top:14px}
.shots{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.shot{display:flex;flex-direction:column;gap:5px}
.shot img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:8px;border:1px solid var(--line);background:var(--surface)}
.cap{font-family:"IBM Plex Mono",monospace;font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
.cue{margin:0;font-size:13.5px;color:var(--ink-2);max-width:60ch}
.cue b{color:var(--ink);font-weight:600}
.alts h4{margin:0 0 8px;font-family:"IBM Plex Mono",monospace;font-size:9.5px;letter-spacing:.14em;
  text-transform:uppercase;color:var(--muted);font-weight:600}
.altrow{display:flex;gap:9px;overflow-x:auto;padding-bottom:4px;scrollbar-width:thin}
.altcard{flex:0 0 132px;display:flex;flex-direction:column;gap:5px}
.altcard img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:7px;border:1px solid var(--line);background:var(--surface)}
.altcard .an{font-size:12px;line-height:1.25;color:var(--ink-2);font-weight:500}
.altcard .ae{font-family:"IBM Plex Mono",monospace;font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}

/* ---------- rest / run blocks ---------- */
.rest{background:var(--surface);border:1px solid var(--line);border-radius:14px;box-shadow:var(--shadow);
  padding:26px 18px;display:flex;flex-direction:column;gap:12px;align-items:flex-start}
.rest .big{font-family:"Archivo",sans-serif;font-weight:900;font-stretch:112%;text-transform:uppercase;
  font-size:clamp(26px,8vw,36px);line-height:.95;margin:0;color:var(--kind)}
.rest p{margin:0;color:var(--ink-2);max-width:56ch;font-size:14px}
.runblock{background:var(--surface);border:1px solid var(--line);border-radius:14px;box-shadow:var(--shadow);overflow:hidden}
.runblock .stripe{height:3px;background:var(--k-run)}
.runblock .inner{padding:14px;display:grid;grid-template-columns:74px 1fr;gap:13px;align-items:start}
.runblock img{width:74px;height:74px;object-fit:cover;border-radius:9px;border:1px solid var(--line)}
.runblock h3{margin:0 0 2px;font-family:"Archivo",sans-serif;font-weight:700;font-size:15.5px}
.runblock .eyebrow{margin-bottom:3px;color:var(--k-run)}
.runblock p{margin:0;font-size:13px;color:var(--ink-2)}

/* ---------- footer ---------- */
footer{display:flex;flex-direction:column;gap:14px;padding-top:6px}
.legend{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}
.leg{background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:11px 12px;display:flex;flex-direction:column;gap:3px}
.leg dt{font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.13em;text-transform:uppercase;color:var(--muted)}
.leg dd{margin:0;font-size:13px;color:var(--ink-2)}
.src{font-size:11.5px;color:var(--muted);text-align:center;line-height:1.6}
.src a{color:var(--muted)}
:focus-visible{outline:2px solid var(--kind,#1B58C0);outline-offset:2px;border-radius:6px}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
@media (max-width:400px){
  .ex-head{grid-template-columns:48px 1fr auto;gap:10px;padding:12px 12px 10px}
  .thumb{width:48px;height:48px}
  .sets{margin-left:58px;padding-left:12px}
  .rx b{font-size:13px}
}
"""

JS = r"""
const $ = (s,r=document)=>r.querySelector(s);
const KIND={torso:'var(--k-torso)',pierna:'var(--k-pierna)',run:'var(--k-run)',rest:'var(--k-rest)'};
const KINDLBL={torso:'Fuerza · torso',pierna:'Fuerza · pierna',run:'Running',rest:'Descanso'};
const LETTER={dom:'D',lun:'L',mar:'M',mie:'X',jue:'J',vie:'V',sab:'S'};
const ORDER=['lun','mar','mie','jue','vie','sab','dom'];
const byKey=Object.fromEntries(DAYS.map(d=>[d.key,d]));
const todayKey=DAYS.find(d=>d.dow===new Date().getDay()).key;
const iso=new Date().toLocaleDateString('sv');

let store={date:iso,done:{}};
try{const raw=localStorage.getItem('bb-sets-v1');if(raw){const p=JSON.parse(raw);if(p&&p.date===iso)store=p;}}catch(e){}
const save=()=>{try{localStorage.setItem('bb-sets-v1',JSON.stringify(store))}catch(e){}};

let current=todayKey;
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));

function rail(){
  const r=$('#rail');
  r.innerHTML=ORDER.map(k=>{const d=byKey[k];return `<button type="button" data-k="${k}"
    style="--kind:${KIND[d.kind]}" class="${k===todayKey?'today':''}"
    aria-current="${k===current}" title="${esc(d.name)} · ${esc(d.title)}">${LETTER[k]}<span class="dot"></span></button>`}).join('');
  r.querySelectorAll('button').forEach(b=>b.onclick=()=>{current=b.dataset.k;rail();render();
    window.scrollTo({top:0,behavior:'smooth'})});
}

function totals(d){
  const tot=d.ex.reduce((a,e)=>a+e.s,0);
  const done=d.ex.reduce((a,e,i)=>a+Math.min(store.done[d.key+'-'+i]||0,e.s),0);
  return {tot,done};
}

function exNode(d,e,i){
  const im=IMG[e.k], id=d.key+'-'+i, n=store.done[id]||0;
  const pills=Array.from({length:e.s},(_,j)=>
    `<button class="set" type="button" data-id="${id}" data-j="${j}" aria-pressed="${j<n}"
      aria-label="Serie ${j+1} de ${e.s}">${j+1}</button>`).join('');
  const alts=im.alts.length?`<div class="alts"><h4>Si está ocupado · otras opciones</h4><div class="altrow">
    ${im.alts.map(a=>`<figure class="altcard"><img src="${a.src}" alt="${esc(a.name)}" loading="lazy">
      <figcaption class="an">${esc(a.name)}</figcaption><span class="ae">${esc(a.eq)}</span></figure>`).join('')}
    </div></div>`:'';
  const shots=`<div class="shots">${im.shots.map((s,k)=>`<figure class="shot">
      <img src="${s}" alt="${esc(im.name)} — ${k?'posición final':'posición inicial'}" loading="lazy">
      <figcaption class="cap">${k?'Final':'Inicio'}</figcaption></figure>`).join('')}</div>`;
  return `<article class="ex">
    <button class="ex-head" type="button" aria-expanded="false" aria-controls="p-${id}">
      <img class="thumb" src="${im.shots[0]}" alt="" loading="lazy">
      <span class="ex-txt"><span class="grp">${esc(e.g)}</span><h3>${esc(e.n)}</h3>
        <span class="alt">${esc(e.alt)}</span></span>
      <span class="rx"><b>${e.s}×${esc(e.r)}</b><span>${esc(e.rir)}</span></span>
    </button>
    <div class="sets"><span class="lbl">Series</span>${pills}</div>
    <div class="panel" id="p-${id}" hidden>${shots}
      <p class="cue">${esc(e.cue)}</p>${alts}</div>
  </article>`;
}

function render(){
  const d=byKey[current], k=KIND[d.kind];
  const {tot,done}=totals(d);
  const isToday=current===todayKey;
  let html=`<section class="hero" style="--kind:${k}"><div class="stripe"></div><div class="body">
    <div class="kicker"><span class="tag${isToday?' now':''}">${isToday?'Hoy':KINDLBL[d.kind]}</span>
      ${isToday?`<span class="tag">${KINDLBL[d.kind]}</span>`:''}</div>
    <h1>${esc(d.name)}</h1>
    <p class="sub">${esc(d.title)} — ${esc(d.focus)}</p>
    <p class="lead">${esc(d.lead)}</p>`;
  if(tot){html+=`<div class="meter"><div class="row"><span>${d.ex.length} ejercicios · ${tot} series</span>
      <span id="tally">${done}/${tot} hechas</span></div>
      <div class="track"><div class="fill" id="fill" style="width:${done/tot*100}%"></div></div>
      <div class="row"><span></span><button class="reset" type="button" id="reset" ${done?'':'hidden'}>Reiniciar series</button></div></div>`;}
  html+=`</div></section>`;

  if(d.double){html+=`<section class="callout" style="--kind:${k}"><h2>Reglas de la jornada doble</h2><ol>
    <li><b>Separa las sesiones al menos 6 h.</b> Si corres a las 8:00, pesas a partir de las 14:00. Así las señales de resistencia (AMPK) no apagan las de crecimiento (mTOR).</li>
    <li><b>Si no puedes separarlas, pesas primero</b>, descansa 10-15 min y sal a correr. Al revés llegas al gimnasio con el sistema nervioso fatigado y tus marcas caen.</li>
    <li><b>Proteína e hidratación impecables</b>, y una pizca de sal en el agua para reponer electrolitos.</li></ol></section>`;}

  if(!d.ex.length){
    html+=`<section class="rest" style="--kind:${k}"><p class="big">Hoy no se entrena</p>
      <p>${esc(d.lead)}</p><p>El sueño es tu mejor aliado anabólico: sin él, buena parte del esfuerzo de la semana se pierde.</p></section>`;
  }else{
    html+=`<section class="list" style="--kind:${k}">${d.ex.map((e,i)=>exNode(d,e,i)).join('')}</section>`;
  }
  if(d.run){const im=IMG[d.run.k];
    html+=`<section class="runblock"><div class="stripe"></div><div class="inner">
      <img src="${im.shots[0]}" alt="${esc(im.name)}" loading="lazy">
      <div><p class="eyebrow">Segunda sesión · running</p><h3>${esc(d.run.n)}</h3><p>${esc(d.run.d)}</p></div>
    </div></section>`;}
  $('#app').innerHTML=html;
  wire(d);
}

function wire(d){
  $('#app').querySelectorAll('.ex-head').forEach(h=>h.onclick=()=>{
    const p=h.parentElement.querySelector('.panel');
    const open=!p.hidden; p.hidden=open; h.setAttribute('aria-expanded',String(!open));
  });
  const sync=()=>{
    $('#app').querySelectorAll('.set').forEach(p=>
      p.setAttribute('aria-pressed',String(+p.dataset.j<(store.done[p.dataset.id]||0))));
    const {tot,done}=totals(d), f=$('#fill'), t=$('#tally'), r=$('#reset');
    if(f)f.style.width=(tot?done/tot*100:0)+'%';
    if(t)t.textContent=`${done}/${tot} hechas`;
    if(r)r.hidden=!done;
  };
  $('#app').querySelectorAll('.set').forEach(b=>b.onclick=()=>{
    const id=b.dataset.id, j=+b.dataset.j, n=store.done[id]||0;
    store.done[id]=(n===j+1)?j:j+1; store.date=iso; save(); sync();
  });
  const r=$('#reset'); if(r)r.onclick=()=>{d.ex.forEach((_,i)=>delete store.done[d.key+'-'+i]);save();sync()};
}
rail();render();
"""

HEAD = """<title>Torso, Pierna y Running</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=IBM+Plex+Mono:wght@400;500;600&family=Public+Sans:wght@400;500;600;700&display=swap">
<style>%s</style>""" % CSS

BODY = """
<div class="wrap">
  <header class="top">
    <p class="eyebrow">Torso / Pierna &middot; 4 días de fuerza + 3 de running</p>
    <nav class="rail" id="rail" aria-label="Día de la semana"></nav>
  </header>
  <main id="app"></main>
  <footer>
    <dl class="legend">
      <div class="leg"><dt>RIR</dt><dd>Repeticiones en recámara: las que <em>podrías</em> hacer aún al terminar la serie. RIR 0 = al fallo.</dd></div>
      <div class="leg"><dt>Volumen semanal</dt><dd>5 a 15 series efectivas por grupo muscular. Esta rutina se mantiene dentro del rango.</dd></div>
      <div class="leg"><dt>Efecto interferencia</dt><dd>Correr y levantar compiten por la recuperación. Por eso las dobles caen en día de torso.</dd></div>
      <div class="leg"><dt>Sueño</dt><dd>Una sola noche mala puede reducir la síntesis de proteínas un 18 %%. Es parte del entrenamiento.</dd></div>
    </dl>
    <p class="src">Selección de ejercicios según Neco (doctor en Ciencias del Deporte) y Andoni &mdash; <em>El mejor ejercicio para cada músculo</em>.<br>
    Fotografías: <a href="https://github.com/yuhonas/free-exercise-db">free-exercise-db</a>, licencia Unlicense.</p>
  </footer>
</div>
<script>
const DAYS=%s;
const IMG=%s;
%s
</script>
""" % (json.dumps(DAYS, ensure_ascii=False), json.dumps(IMG), JS)

out = HEAD + BODY
open(OUT, 'w').write(out)
print('Escrito', os.path.relpath(OUT), '—', round(len(out.encode())/1e6, 2), 'MB')
