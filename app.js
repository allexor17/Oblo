// Oblò · interfaccia
(() => {
"use strict";

// ───────────────────────────── STATO ─────────────────────────────
const KEY = "oblo.v1";
const DEF = {
  items: [], pantry: {}, seen: {}, load: [],
  settings: { cap: 7, hard: "media", fh: "", tin: 15, price: 0.3, eco: true, quiz: false, planMode: "min" },
  stats: { washes: 0, qOk: 0, qTot: 0 },
  labTab: "box", labCat: "tutti",
  timers: {}
};
const clone = o => JSON.parse(JSON.stringify(o));
function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const o = JSON.parse(raw);
      return { ...clone(DEF), ...o, settings: { ...DEF.settings, ...(o.settings || {}) }, stats: { ...DEF.stats, ...(o.stats || {}) } };
    }
  } catch (e) { /* storage non disponibile */ }
  return clone(DEF);
}
let S = loadState();
// Trasloco: i dati arrivano dal vecchio indirizzo (…/lavatrice/) nel frammento #trasloco=…
let MOVED = false;
(function importMoved() {
  const m = location.hash.match(/^#trasloco=([A-Za-z0-9_-]+)$/);
  if (!m) return;
  try {
    const b64 = m[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(b64 + "===".slice((b64.length + 3) % 4))));
    const o = JSON.parse(json);
    const empty = !S.items.length && !Object.keys(S.pantry).length && !Object.keys(S.seen).length;
    if (empty && o && typeof o === "object") {
      S = { ...clone(DEF), ...o, settings: { ...DEF.settings, ...(o.settings || {}) }, stats: { ...DEF.stats, ...(o.stats || {}) } };
      MOVED = true;
    }
  } catch (e) { /* dati non leggibili: si riparte da zero */ }
  history.replaceState(null, "", location.pathname + location.search);
})();
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S, (k, v) => (k === "_b" || k === "_r") ? undefined : v)); } catch (e) { /* ignora */ }
}

// ───────────────────────────── UTILITÀ ─────────────────────────────
const $ = s => document.querySelector(s);
const uid = () => Math.random().toString(36).slice(2, 9);
const fmt1 = n => n.toLocaleString("it-IT", { maximumFractionDigits: 1 });
const fmt2 = n => n.toLocaleString("it-IT", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
const sum = (a, f) => a.reduce((s, x) => s + f(x), 0);
const qtyOf = its => sum(its, it => it.qty || 1);
const cap1 = s => s.charAt(0).toUpperCase() + s.slice(1);
function colorDot(colorId, cls = "cdot") {
  const C = COLORS[colorId];
  if (!C) return "";
  return C.hex.startsWith("pattern") ? `<span class="${cls} ${C.hex}"></span>` : `<span class="${cls}" style="--c:${C.hex}"></span>`;
}
const swatch = k => `<span class="swatch" style="--dot:${BASKETS[k].dot}"></span>`;
function names(its, max = 3) {
  const n = [...new Set(its.map(it => lc(GARMENTS[it.g].name)))];
  return n.slice(0, max).join(", ") + (n.length > max ? "…" : "");
}

function classify() {
  const map = {};
  for (const it of S.items) {
    const r = sortItem(it);
    it._b = r.basket; it._r = r;
    (map[r.basket] = map[r.basket] || []).push(it);
  }
  return map;
}

// ───────────────────────────── NAVIGAZIONE ─────────────────────────────
let VIEW = "cesto";
const SUBS = { cesto: "Smista i capi nelle ceste", dispensa: "I prodotti che hai in casa", lavatrice: "Dosi, gradi, giri e perché", mano: "A mano e in ammollo", lab: "Il perché di ogni gesto" };
function go(v) {
  if (SIM) stopSim();
  VIEW = v;
  for (const id of ["cesto", "dispensa", "lavatrice", "mano", "lab"]) $("#v-" + id).hidden = id !== v;
  document.querySelectorAll(".tabs button").forEach(b => b.dataset.view === v ? b.setAttribute("aria-current", "page") : b.removeAttribute("aria-current"));
  $("#viewSub").textContent = SUBS[v];
  render();
  window.scrollTo(0, 0);
}
function render() {
  const seen = CARDS.filter(c => S.seen[c.id]).length;
  $("#scoreBtn").innerHTML = `<span aria-hidden="true">🔬</span><b>${seen}</b> / ${CARDS.length} box`;
  if (VIEW === "cesto") renderCesto();
  else if (VIEW === "dispensa") renderDispensa();
  else if (VIEW === "lavatrice") renderLavatrice();
  else if (VIEW === "mano") renderMano();
  else renderLab();
}

// ───────────────────────────── SHEET E TOAST ─────────────────────────────
let lastFocus = null;
function openSheet(html, keepScroll) {
  const wrap = $("#sheetWrap"), sh = $("#sheet");
  const top = keepScroll ? sh.scrollTop : 0;
  if (wrap.hidden) lastFocus = document.activeElement;
  sh.innerHTML = `<div class="grab"></div>` + html;
  wrap.hidden = false;
  document.body.style.overflow = "hidden";
  sh.scrollTop = top;
  if (!keepScroll) sh.focus();
}
function closeSheet() {
  $("#sheetWrap").hidden = true;
  $("#sheet").innerHTML = "";
  document.body.style.overflow = "";
  D = null; Q = null; CARD = null; GUIDE = null;
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}
const sheetHead = (title, extra = "") => `<div class="sheet-head"><div>${extra}<h2 id="sheetTitle">${title}</h2></div><button class="xbtn" type="button" data-act="close" aria-label="Chiudi">×</button></div>`;

let toastTimer = null, toastAction = null;
function toast(msg, action) {
  const t = $("#toast");
  toastAction = action ? action.fn : null;
  t.innerHTML = `<span>${msg}</span>${action ? `<button type="button" data-act="toast">${action.label}</button>` : ""}`;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 5000);
}

// ───────────────────────────── CESTO ─────────────────────────────
function renderCesto() {
  const map = classify();
  const keys = BASKET_ORDER.filter(k => map[k]);
  const n = qtyOf(S.items);
  let h = `<div class="section-head"><div><h2>Il cesto</h2><p class="muted">${n ? `${n} ${n === 1 ? "capo" : "capi"} in ${keys.length} ${keys.length === 1 ? "cesta" : "ceste"}` : "Ancora vuoto"}</p></div><button class="btn" type="button" data-act="add">+ Aggiungi capo</button></div>`;

  if (!n) {
    h += `<section class="panel howto">
      <h3>Come funziona</h3>
      <ol>
        <li><span><b>Metti i capi nel cesto</b>Scegli il tipo, il colore e il tessuto: Oblò li smista nelle ceste e ti dice perché.</span></li>
        <li><span><b>Riempi la dispensa</b>Segna i detersivi e gli additivi che hai in casa, la durezza dell'acqua e la capacità della lavatrice.</span></li>
        <li><span><b>Avvia la lavatrice</b>Per ogni cesta trovi programma, gradi, giri, dosi e dove metterle, con la chimica e la fisica dietro ogni scelta.</span></li>
      </ol>
    </section>`;
  }
  if (n) h += planHTML(map);
  h += `<div class="quizbar"><div class="txt"><b>Mettimi alla prova</b>Prima di smistare un capo, indovini tu la cesta.${S.stats.qTot ? ` Finora ${S.stats.qOk} su ${S.stats.qTot}.` : ""}</div><label class="switch"><input type="checkbox" data-act="quiz" ${S.settings.quiz ? "checked" : ""} aria-label="Mettimi alla prova"><span></span></label></div>`;

  if (n) {
    h += `<div class="baskets">${keys.map(k => basketCard(k, map[k])).join("")}</div>`;
    h += `<div class="row"><span class="spacer"></span><button class="btn plain sm" type="button" data-act="clear">Svuota il cesto</button></div>`;
  }
  $("#v-cesto").innerHTML = h;
}
function basketCard(k, its) {
  const B = BASKETS[k];
  const kg = sum(its, itemW) / 1000;
  const capKg = S.settings.cap * B.capF;
  const pct = capKg ? kg / capKg : 0;
  const warns = basketWarnings(k, its);
  let fill = "";
  if (k !== "nolav") {
    const capTxt = B.capF < 1 ? ` (per questo programma il cestello va riempito al massimo per ${B.capF >= 0.5 ? "metà" : B.capF >= 0.3 ? "un terzo" : B.capF >= 0.2 ? "un quarto" : "poco"})` : "";
    fill = `<div class="fill ${pct > 1 ? "over" : ""}"><i style="width:${Math.min(100, Math.max(3, pct * 100))}%"></i></div>
      <p class="fill-text">${fmt1(kg)} kg · ${Math.round(pct * 100)}% di un carico${capTxt}</p>`;
  }
  return `<article class="basket ${k === "nolav" ? "nolav" : ""}" style="--dot:${B.dot}">
    <div class="basket-head">${swatch(k)}<div><h3>${B.name}</h3><p>${B.sub}</p></div><span class="count" aria-label="${qtyOf(its)} capi">${qtyOf(its)}</span></div>
    ${fill}
    <div class="items">${its.map(itemChip).join("")}</div>
    ${warns.length ? `<div class="warns">${warns.map(w => `<div class="note warn">${w}</div>`).join("")}</div>` : ""}
    <div class="basket-foot">${k !== "nolav"
      ? `<button class="btn sm" type="button" data-act="wash" data-b="${k}">Lava questa cesta</button>`
      : `<span class="small muted">Cerca il cerchio sull'etichetta: ti dice quale pulizia chiedere in tintoria.</span>`}</div>
  </article>`;
}
function itemChip(it) {
  const G = GARMENTS[it.g];
  return `<button class="item-chip" type="button" data-act="item" data-id="${it.id}">${colorDot(it.color)}<span class="em" aria-hidden="true">${G.e}</span>${G.name}${(it.qty || 1) > 1 ? ` <span class="q">×${it.qty}</span>` : ""}</button>`;
}
function basketWarnings(k, its) {
  const w = [];
  const cede = its.filter(it => has(it, "cede")), attira = its.filter(it => has(it, "attira"));
  if (cede.length && attira.length) w.push(`${cap1(names(cede))} perde pelucchi e ${names(attira)} li attira: rovescia i secondi o lavali in due volte.`);
  if (k === "stinge" && new Set(its.map(it => it.color)).size > 1) w.push("Qui ci sono colori diversi: i capi che stingono vanno lavati da soli o solo con capi dello stesso colore.");
  if (k === "piumini" && qtyOf(its) > 1) w.push("Un piumino alla volta: ha bisogno di spazio per gonfiarsi.");
  const lim = its.filter(it => it.label && /^\d+$/.test(it.label) && +it.label < BASKETS[k].temp);
  if (lim.length) w.push(`${cap1(names(lim))}: l'etichetta abbassa la temperatura di tutta la cesta.`);
  return w;
}

// Piano: meno lavatrici possibili
const noteCls = l => ({ ok: "ok", lieve: "warn", forte: "forte", no: "no" })[l] || "warn";
const lvlCls = l => ({ ok: "si", lieve: "facoltativo", forte: "forte", no: "no" })[l] || "facoltativo";
const sameSet = (a, b) => a.length === b.length && a.every(x => b.includes(x));
function planHTML(map) {
  const modes = Object.keys(PLAN_MODES);
  const plans = Object.fromEntries(modes.map(m => [m, planLoads(map, S.settings, m)]));
  const P = plans[S.settings.planMode] || plans.min;
  if (!P.loads.length && !P.hand.length && !P.nolav.length) return "";
  const word = c => c === 1 ? "lavatrice" : "lavatrici";
  const saved = plans.cura.count - P.count;
  let h = `<section class="panel plan">
    <div class="plan-head"><div><h3>Il piano</h3><p class="small muted">Le ceste riunite nel minor numero di lavatrici, con i compromessi che accetti.</p></div>
      <div class="plan-n"><b>${P.count}</b><span>${word(P.count)}</span></div></div>
    <div class="seg seg3" role="group" aria-label="Quanto compromesso accetti">${modes.map(m => `<button type="button" data-act="planmode" data-v="${m}" aria-pressed="${P.mode === m}">${PLAN_MODES[m].name}<small>${plans[m].count} ${word(plans[m].count)}</small></button>`).join("")}</div>
    <p class="small muted">${PLAN_MODES[P.mode].text}${saved > 0 ? ` Rispetto alla massima cura risparmi ${saved} ${word(saved)}: circa ${saved * 45} litri d'acqua e ${fmt1(saved * 0.6)} kWh, valori indicativi.` : ""} <button class="btn plain sm" type="button" data-act="card" data-id="compromesso" style="padding:0;min-height:0">Come ragiona il piano</button></p>`;
  if (P.loads.length) h += `<ol class="loads">${P.loads.map((g, i) => {
    const its = g.keys.flatMap(k => map[k]);
    const R = buildRecipe(its, g.keys, S.pantry, S.settings);
    const cm = g.msgs.filter(m => m.level !== "ok");
    return `<li class="load"><div class="load-sw">${g.keys.map(swatch).join("")}</div><div class="load-body">
      <b>Lavatrice ${i + 1}${g.n > 1 ? ` · da dividere in ${g.n}` : ""}</b>
      <p class="load-names">${g.keys.map(k => BASKETS[k].name).join(" + ")}</p>
      <p class="small">${R.program.name}, ${R.T}°C, ${R.spin} giri · ${fmt1(g.kg)} kg, ${Math.round(R.fill * 100)}% del cestello</p>
      ${cm.length ? `<ul class="compro"><li><span class="lvl ${lvlCls(cm[0].level)}">${LEVEL_NAME[cm[0].level]}</span> ${cm[0].text}</li></ul>${cm.length > 1 ? `<details class="why"><summary>${cm.length === 2 ? "Un altro compromesso" : `Altri ${cm.length - 1} compromessi`}</summary><ul class="compro">${cm.slice(1).map(m => `<li><span class="lvl ${lvlCls(m.level)}">${LEVEL_NAME[m.level]}</span> ${m.text}</li>`).join("")}</ul></details>` : ""}` : `<p class="small muted">Nessun compromesso.</p>`}
      ${g.n > 1 ? `<p class="tiny">Non ci sta tutto in un cestello: dividi in ${g.n} lavaggi uguali.</p>` : R.fill < 0.3 ? `<p class="tiny">Carico leggero: se non ti serve subito, aspetta di avere più capi.</p>` : ""}
      ${guideChips(its, "Prima, o al posto della lavatrice:")}
      <button class="btn sm" type="button" data-act="plan-open" data-i="${i}">Apri in lavatrice</button></div></li>`;
  }).join("")}</ol>`;
  for (const g of P.hand) h += handHTML(g, map);
  if (P.nolav.length) h += `<p class="small" style="margin-top:12px"><b>In tintoria:</b> ${names(P.nolav, 5)}.</p>`;
  return h + `</section>`;
}
function handHTML(g, map) {
  const its = g.keys.flatMap(k => map[k]);
  const wool = g.keys.some(k => k === "lana" || k === "mano");
  const steps = wool ? [
    "Bacinella d'acqua a 20–30°C con un cucchiaio di detersivo per lana (o di shampoo neutro), sciolto prima di immergere il capo.",
    "Immergi e premi delicatamente per 3–5 minuti. Niente strofinare né torcere: è lo sfregamento a far agganciare le scaglie della lana.",
    "Risciacqua in acqua alla stessa temperatura finché non fa più schiuma: lo sbalzo termico favorisce il feltro.",
    "Arrotola il capo in un asciugamano e premi per togliere l'acqua, poi stendilo in piano all'ombra, nella sua forma."
  ] : [
    "Bacinella d'acqua fredda con un goccio di detersivo per colorati.",
    "Immergi e muovi il capo per qualche minuto: il colore che vedi nell'acqua è il colorante libero.",
    "Risciacqua in acqua fredda finché esce limpida: da lì in poi il capo può andare in lavatrice con i colori simili.",
    "Strizza senza torcere e stendi all'ombra, lontano dagli altri capi."
  ];
  return `<div class="load hand"><div class="load-sw">${g.keys.map(swatch).join("")}</div><div class="load-body">
    <b>A mano nel lavandino</b><p class="load-names">${cap1(names(its, 4))}</p>
    <p class="small muted">${wool ? "Per pochi capi di lana o seta non vale la pena di avviare una lavatrice: a mano ci vogliono dieci minuti." : "Uno o due capi nuovi che stingono: lavarli a mano a freddo costa meno di una lavatrice, e vedi quanto colore rilasciano."}</p>
    <div class="row" style="margin-top:10px"><button class="btn sm" type="button" data-act="guide" data-id="${wool ? (g.keys.includes("mano") && !g.keys.includes("lana") ? "seta_mano" : "lana_mano") : "stinge_mano"}">Apri la guida</button>
    <button class="btn ghost sm" type="button" data-act="hand-done" data-keys="${g.keys.join(",")}">Fatto, segna come lavato</button></div></div></div>`;
}
function removeBaskets(keys) {
  const map = classify();
  const ids = new Set(keys.flatMap(k => (map[k] || []).map(it => it.id)));
  const n = qtyOf(S.items.filter(it => ids.has(it.id)));
  S.items = S.items.filter(it => !ids.has(it.id));
  return n;
}

// Bozza di un capo
let D = null;
function blankDraft() {
  return { id: null, g: null, color: null, fiber: null, label: null, qty: 1, pickG: true,
    flags: { sporco: "normale", nuovo: false, elastan: false, stampa: false, decorazioni: false, pesante: false, peli: false, macchia: "" } };
}
function openAdd(id) {
  const base = id && S.items.find(it => it.id === id);
  D = base ? { ...clone({ ...base, _b: undefined, _r: undefined }), pickG: false } : blankDraft();
  renderAdd(false);
}
const LABEL_OPTS = [[null, "Non so"], ["30", "30°"], ["40", "40°"], ["60", "60°"], ["95", "95°"], ["mano", "A mano"], ["no", "Non lavare"]];
function renderAdd(keep = true) {
  const G = D.g && GARMENTS[D.g];
  let h = sheetHead(D.id ? "Modifica capo" : "Che capo è?");
  if (D.pickG || !G) {
    h += `<div class="group"><div class="garment-grid">${Object.entries(GARMENTS).map(([k, g]) =>
      `<button class="garment" type="button" data-act="d-g" data-v="${k}" aria-pressed="${D.g === k}"><span class="em" aria-hidden="true">${g.e}</span>${g.name}</button>`).join("")}</div></div>`;
  } else {
    h += `<div class="group row"><span class="chip" aria-pressed="true"><span class="em" aria-hidden="true">${G.e}</span>${G.name}</span><button class="btn plain sm" type="button" data-act="d-regarment">Cambia</button></div>`;
  }
  if (G) {
    const C = D.color && COLORS[D.color];
    h += `<div class="group"><h4>Colore</h4><div class="swatches">${Object.entries(COLORS).map(([k, c]) =>
      `<button class="sw ${c.hex.startsWith("pattern") ? "sw-" + c.hex : ""}" type="button" style="${c.hex.startsWith("pattern") ? "" : `--c:${c.hex}`}" data-act="d-color" data-v="${k}" aria-pressed="${D.color === k}" aria-label="${c.name}" title="${c.name}"></button>`).join("")}</div>
      <p class="sw-label">${C ? `<b>${C.name}</b> · gruppo ${({ bianco: "bianchi", chiaro: "chiari", colorato: "colorati", scuro: "scuri" })[C.group]}${C.hot ? " · tende a stingere" : ""}` : "Tocca il colore più vicino."}</p></div>`;
    h += `<div class="group"><h4>Tessuto</h4><p class="hint">Lo trovi sull'etichetta cucita all'interno. Se è misto, scegli la fibra più delicata: comanda lei.</p>
      <div class="chips">${Object.entries(FIBERS).map(([k, f]) => `<button class="chip" type="button" data-act="d-fiber" data-v="${k}" aria-pressed="${D.fiber === k}">${f.name}</button>`).join("")}</div></div>`;
    h += `<div class="group"><h4>Etichetta: la vaschetta</h4><p class="hint">Il numero nella vaschetta è la temperatura massima.</p>
      <div class="chips">${LABEL_OPTS.map(([v, t]) => `<button class="chip" type="button" data-act="d-label" data-v="${v ?? ""}" aria-pressed="${(D.label ?? "") === (v ?? "")}">${v && v !== "no" ? miniTub(v) : ""}${t}</button>`).join("")}</div></div>`;
    h += `<div class="group"><h4>Quanto è sporco?</h4><div class="chips">${Object.entries(SOIL).map(([k, s]) => `<button class="chip" type="button" data-act="d-soil" data-v="${k}" aria-pressed="${D.flags.sporco === k}">${s.name}</button>`).join("")}</div></div>`;
    const tg = [["nuovo", "Nuovo", "Ai primi lavaggi"], ["elastan", "Contiene elastan", "Scritto in etichetta: elastan, spandex, lycra"], ["stampa", "Ha una stampa", "Scritte o disegni stampati"], ["decorazioni", "Decorazioni", "Paillettes, perline, applicazioni"], ["pesante", "Fango, terra o grasso", "Sporco pesante da lavoro o sport all'aperto"], ["peli", "Peli di animali", ""]];
    h += `<div class="group"><h4>Dettagli</h4><div class="toggles">${tg.map(([k, t, s]) =>
      `<label class="toggle"><input type="checkbox" data-act="d-flag" data-v="${k}" ${D.flags[k] ? "checked" : ""}><span>${t}${s ? `<small>${s}</small>` : ""}</span></label>`).join("")}</div></div>`;
    h += `<div class="group"><h4>Macchie</h4><select class="select" data-act="d-stain" aria-label="Macchia"><option value="">Nessuna macchia</option>${Object.entries(STAINS).map(([k, s]) => `<option value="${k}" ${D.flags.macchia === k ? "selected" : ""}>${s.e} ${s.name}</option>`).join("")}</select></div>`;
    h += `<div class="group row"><h4 class="spacer">Quanti?</h4><div class="stepper"><button type="button" data-act="d-qty" data-d="-1" aria-label="Uno in meno">−</button><output>${D.qty}</output><button type="button" data-act="d-qty" data-d="1" aria-label="Uno in più">+</button></div></div>`;
  }
  const ready = D.g && D.color && D.fiber;
  h += `<div class="sheet-foot"><button class="btn wide" type="button" data-act="d-save" ${ready ? "" : "disabled"}>${D.id ? "Salva le modifiche" : !G ? "Scegli il capo" : !D.color ? "Scegli il colore" : "Metti nel cesto"}</button></div>`;
  openSheet(h, keep);
}
function miniTub(v) {
  return `<svg viewBox="0 0 40 40" width="18" height="18" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M5 13 L8.5 33 Q9 35 11 35 L29 35 Q31 35 31.5 33 L35 13"/><path d="M5 13 q3.75 -4 7.5 0 t7.5 0 t7.5 0 t7.5 0"/></svg>`;
}
function saveDraft() {
  if (!D || !D.g || !D.color || !D.fiber) return;
  const it = clone(D); delete it.pickG;
  if (it.id) {
    const i = S.items.findIndex(x => x.id === it.id);
    if (i >= 0) S.items[i] = it;
    save(); closeSheet(); render();
    const r = sortItem(it);
    toast(`${GARMENTS[it.g].name}: ${BASKETS[r.basket].name}`, { label: "Perché?", fn: () => openItem(it.id) });
    return;
  }
  it.id = uid();
  if (S.settings.quiz) { openQuiz(it); return; }
  S.items.push(it); save(); closeSheet(); render();
  const r = sortItem(it);
  toast(`${GARMENTS[it.g].name} nella cesta ${BASKETS[r.basket].name}`, { label: "Perché?", fn: () => openItem(it.id) });
}

// Quiz di smistamento
let Q = null;
function openQuiz(it) {
  const r = sortItem(it);
  Q = { it, r, opts: quizOptions(it, r.basket), picked: null };
  renderQuiz();
}
function describe(it) {
  const G = GARMENTS[it.g], C = COLORS[it.color], F = FIBERS[it.fiber];
  const ex = [];
  if (it.flags.nuovo) ex.push("nuovo");
  if (it.flags.elastan) ex.push("con elastan");
  if (it.flags.pesante) ex.push("sporco di terra o grasso");
  if (it.flags.peli) ex.push("pieno di peli");
  if (it.flags.decorazioni) ex.push("con decorazioni");
  if (it.label === "no") ex.push("etichetta: non lavare");
  else if (it.label === "mano") ex.push("etichetta: lavaggio a mano");
  else if (it.label) ex.push(`etichetta: ${it.label}°C`);
  return `${G.name}, ${lc(C.name)}, ${lc(F.name)}${ex.length ? ", " + ex.join(", ") : ""}`;
}
function renderQuiz() {
  const { it, r, opts, picked } = Q;
  let h = sheetHead("Dove lo metti?");
  h += `<p class="quiz-q"><span aria-hidden="true">${GARMENTS[it.g].e}</span> ${describe(it)}.</p>`;
  h += `<div class="opt-list">${opts.map(b => {
    const cls = picked ? (b === r.basket ? "right" : b === picked ? "wrong" : "") : "";
    return `<button class="opt ${cls}" type="button" data-act="q-pick" data-b="${b}" ${picked ? "disabled" : ""}>${swatch(b)}<span><b>${BASKETS[b].name}</b><div class="opt-fb">${BASKETS[b].sub}</div></span></button>`;
  }).join("")}</div>`;
  if (picked) {
    const ok = picked === r.basket;
    h += `<div class="group note ${ok ? "ok" : "warn"}"><b>${ok ? "Esatto." : `Non proprio: va in ${BASKETS[r.basket].name}.`}</b>${r.why}</div>`;
    if (!ok) h += `<p class="small muted group">${wrongHint(picked, it)}</p>`;
    if (r.notes.length) h += `<div class="group"><h4>Da fare</h4><ul class="bullets">${r.notes.map(n => `<li>${n}</li>`).join("")}</ul></div>`;
    h += `<div class="sheet-foot"><button class="btn wide" type="button" data-act="q-done">Metti nel cesto</button></div>`;
  }
  openSheet(h, true);
}
function wrongHint(b, it) {
  const m = {
    bianchi: "La cesta dei bianchi è per cotone e lino bianchi: qualsiasi colore libero li ingrigirebbe.",
    chiari: "I chiari sono per i colori tenui: hanno poco colorante e lo assorbono facilmente.",
    colorati: "I colorati sono capi colorati robusti, senza esigenze particolari di fibra.",
    scuri: "Gli scuri sono per neri, blu e jeans che non hanno esigenze particolari di fibra.",
    delicati: "I delicati sono per fibre fragili da bagnate, pizzi, collant e decorazioni.",
    stinge: "Questa cesta è per i capi nuovi di colore intenso, che rilasciano colorante.",
    sport: "Questa cesta è per i tessuti tecnici, che non vogliono ammorbidente.",
    lana: "Questa cesta è per lana e cashmere, fibre di cheratina.",
    spugna_chiara: "Questa cesta è per la spugna chiara da lavare a 60°C.",
    pesante: "Questa cesta è per fango, grasso, peli e scarpe.",
    mano: "Questa cesta è per seta e capi da lavare a mano.",
    piumini: "Questa cesta è per i capi imbottiti di piuma."
  };
  return (m[b] || "") + " Qui la variabile che decide è un'altra: rileggi la spiegazione sopra.";
}

// Scheda di un capo
function openItem(id) {
  const it = S.items.find(x => x.id === id);
  if (!it) return;
  const r = sortItem(it), G = GARMENTS[it.g], B = BASKETS[r.basket];
  let h = sheetHead(`<span aria-hidden="true">${G.e}</span> ${G.name}${(it.qty || 1) > 1 ? ` ×${it.qty}` : ""}`);
  h += `<div class="chips">
    <span class="chip">${colorDot(it.color)}${COLORS[it.color].name}</span>
    <span class="chip">${FIBERS[it.fiber].name}</span>
    ${it.label ? `<span class="chip">${it.label === "mano" ? "A mano" : it.label === "no" ? "Non lavare" : `Max ${it.label}°C`}</span>` : ""}
    <span class="chip">${SOIL[it.flags.sporco || "normale"].name}</span>
  </div>`;
  h += `<div class="dest group">${swatch(r.basket)}<div><small>Va nella cesta</small><b>${B.name}</b></div></div>`;
  h += `<h4>Perché</h4><p>${r.why}</p>`;
  if (r.notes.length) h += `<div class="group"><h4>Da fare</h4><ul class="bullets">${r.notes.map(n => `<li>${n}</li>`).join("")}</ul></div>`;
  if (it.flags.macchia && STAINS[it.flags.macchia]) h += `<div class="group"><h4>La macchia</h4><div class="links"><button class="link-card" type="button" data-act="stain" data-id="${it.flags.macchia}">${STAINS[it.flags.macchia].e} Come trattare: ${lc(STAINS[it.flags.macchia].name)}</button></div></div>`;
  const gid = guideFor(it);
  if (gid) h += `<div class="group"><h4>Passo passo</h4><button class="guide-link" type="button" data-act="guide" data-id="${gid}"><span class="em" aria-hidden="true">${GUIDES[gid].e}</span><span><b>${GUIDES[gid].name}</b><small>${GUIDES[gid].sub}</small></span></button></div>`;
  if (r.cards.length) h += `<div class="group"><h4>Approfondisci</h4><div class="links">${r.cards.map(cid => `<button class="link-card" type="button" data-act="card" data-id="${cid}">${CARD_BY_ID[cid].title}</button>`).join("")}</div></div>`;
  h += `<div class="sheet-foot row"><button class="btn ghost" type="button" data-act="edit" data-id="${it.id}">Modifica</button><button class="btn danger" type="button" data-act="remove" data-id="${it.id}">Togli dal cesto</button></div>`;
  openSheet(h);
}

// ───────────────────────────── DISPENSA ─────────────────────────────
function renderDispensa() {
  const st = S.settings;
  const ownedIds = Object.keys(PRODUCTS).filter(id => owned(S.pantry, id));
  let h = `<div class="section-head"><div><h2>Dispensa</h2><p class="muted">Oblò sceglie tra i prodotti che hai e calcola le dosi.</p></div></div>`;
  h += `<section class="panel">
    <h3>La tua lavatrice</h3>
    <div class="kv"><div class="k">Capacità<small>Sul frontale o nel libretto: i kg di cotone asciutto</small></div>
      <div class="stepper"><button type="button" data-act="cap" data-d="-1" aria-label="Meno">−</button><output>${st.cap} kg</output><button type="button" data-act="cap" data-d="1" aria-label="Più">+</button></div></div>
    <div class="kv" style="grid-template-columns:1fr">
      <div class="k">Durezza dell'acqua<small>Sul sito del gestore idrico del tuo comune, in gradi francesi (°F)</small></div>
      <div class="chips">${Object.entries(HARD).map(([k, v]) => `<button class="chip" type="button" data-act="hard" data-v="${k}" aria-pressed="${st.hard === k}">${v.name} <span class="tiny">${v.range}</span></button>`).join("")}</div>
      <div class="row"><label class="small muted" for="fh">Oppure scrivi il valore:</label><input class="num" id="fh" type="number" inputmode="decimal" min="0" max="80" data-inp="fh" value="${st.fh}"><span class="small muted">°F</span></div>
    </div>
    <div class="kv"><label for="tin">Acqua in ingresso<small>Circa 10°C d'inverno, 18–20°C d'estate</small></label><span class="row"><input class="num" id="tin" type="number" inputmode="decimal" data-inp="tin" value="${st.tin}"> °C</span></div>
    <div class="kv"><label for="price">Prezzo dell'energia<small>Euro al kWh, dalla bolletta</small></label><span class="row"><input class="num" id="price" type="number" step="0.01" inputmode="decimal" data-inp="price" value="${st.price}"> €</span></div>
    <div class="kv"><div class="k">Preferisci i programmi Eco<small>Più lunghi, meno energia</small></div><label class="switch"><input type="checkbox" data-act="eco" ${st.eco ? "checked" : ""} aria-label="Preferisci i programmi Eco"><span></span></label></div>
  </section>`;

  h += `<section class="panel"><h3>I tuoi prodotti</h3>`;
  if (!ownedIds.length) h += `<p class="muted" style="margin-top:6px">Ancora nessuno. Aggiungili qui sotto, oppure parti dal kit essenziale.</p>`;
  else {
    h += `<p class="small muted" style="margin:4px 0 12px">La dose è quella per un carico pieno normale con acqua media: se il flacone dice diverso, correggila.</p><div class="prod-list">`;
    h += ownedIds.map(id => {
      const P = PRODUCTS[id];
      const doseIn = P.dose && (P.cat === "Detersivi" || id === "ammorbidente") && id !== "capsule" ? `<div class="dose"><input class="num" type="number" inputmode="decimal" data-inp="dose" data-id="${id}" value="${doseOf(S.pantry, id)}" aria-label="Dose di ${P.name}"> ${P.unit}</div>` : "<span></span>";
      return `<div class="prod"><span class="em" aria-hidden="true">${P.e}</span><div><div class="name">${P.name}</div><div class="chem">${P.chem}</div></div>${doseIn}
        <div class="prod-actions"><span class="tiny">Sì: ${P.good}.${P.bad ? ` No: ${P.bad}.` : ""}</span></div>
        <div class="prod-actions"><button class="btn plain sm" type="button" data-act="unown" data-id="${id}">Rimuovi</button></div></div>`;
    }).join("");
    h += `</div>`;
  }
  h += `</section>`;

  const missingKit = STARTER_KIT.filter(id => !owned(S.pantry, id));
  if (missingKit.length) {
    h += `<section class="panel kit stack">
      <h3>Il kit essenziale</h3>
      <p class="small">Con sei prodotti copri quasi tutto, e ognuno ha un compito chimico diverso: un <b>liquido per colorati</b> (tensioattivi ed enzimi, niente ossidanti), una <b>polvere</b> per i bianchi (ossigeno attivo e sbiancanti ottici), il <b>percarbonato</b> per macchie e igiene, l'<b>acido citrico</b> come anticalcare e ammorbidente ecologico, un <b>detersivo per lana</b> a pH neutro senza enzimi, i <b>fogli acchiappacolore</b>.</p>
      <p class="small muted">Prova a ragionare: perché non basta un detersivo solo per tutto? Pensa a cosa farebbe l'ossigeno attivo su un maglione nero, o una proteasi su un cashmere.</p>
      <button class="btn ghost" type="button" data-act="kit">Aggiungi il kit (${missingKit.length})</button>
    </section>`;
  }
  h += `<section class="panel"><h3>Aggiungi</h3>`;
  for (const cat of PRODUCT_CATS) {
    h += `<div class="cat-title">${cat}</div><div class="chips">${Object.entries(PRODUCTS).filter(([, p]) => p.cat === cat).map(([id, p]) =>
      `<button class="chip" type="button" data-act="own" data-id="${id}" aria-pressed="${owned(S.pantry, id)}"><span class="em" aria-hidden="true">${p.e}</span>${p.name}</button>`).join("")}</div>`;
  }
  h += `</section>`;
  h += `<section class="panel stack">
    <h3>Backup</h3>
    <p class="small muted">I dati di Oblò (cesto, dispensa, impostazioni, box scoperti) restano solo su questo telefono. Con un backup li porti su un altro telefono o su un nuovo indirizzo dell'app.</p>
    <div class="row"><button class="btn ghost sm" type="button" data-act="export">Esporta backup</button>
    <label class="btn ghost sm" for="importOblo">Importa backup</label><input type="file" id="importOblo" accept="application/json,.json" hidden></div>
  </section>`;
  $("#v-dispensa").innerHTML = h;
}

// ───────────────────────────── LAVATRICE ─────────────────────────────
let CUR = null; // ricetta corrente
const PROD_COLOR = { polvere: "#EEF2F8", liq_univ: "#5C7CFA", liq_colori: "#7B61FF", liq_scuri: "#2F3E66", lana: "#E2C99B", sport: "#2FB5A3", eco: "#5BB07B", capsule: "#7B61FF", shampoo: "#F2B5C6", acido_citrico: "#F2D45C", aceto: "#E9E4CF", ammorbidente: "#F6A3C8" };
function renderLavatrice() {
  const map = classify();
  const keys = BASKET_ORDER.filter(k => map[k] && k !== "nolav");
  let h = `<div class="section-head"><div><h2>Lavatrice</h2><p class="muted">Scegli cosa caricare: una cesta, o più ceste se vanno d'accordo.</p></div></div>`;
  if (!keys.length) {
    h += `<section class="panel empty"><div class="porthole-wrap">${portholeHTML([])}</div><h3>Il cestello è vuoto</h3><p>Metti qualche capo nel cesto: lo smisto io, e poi qui trovi programma, gradi, giri e dosi.</p><button class="btn" type="button" data-act="go" data-view="cesto">Vai al cesto</button></section>`;
    $("#v-lavatrice").innerHTML = h; CUR = null; return;
  }
  const PL = planLoads(map, S.settings, S.settings.planMode || "min");
  S.load = (S.load || []).filter(k => keys.includes(k));
  if (!S.load.length) S.load = PL.loads.length ? [...PL.loads[0].keys] : [keys[0]];
  const items = S.load.flatMap(k => map[k]);
  const R = buildRecipe(items, S.load, S.pantry, S.settings);
  CUR = R;
  const comp = compatLoad(S.load, map);

  if (PL.loads.length) {
    h += `<div class="stack" style="gap:8px"><p class="small"><b>Dal piano</b> · ${PLAN_MODES[PL.mode].name.toLowerCase()}, ${PL.count} ${PL.count === 1 ? "lavatrice" : "lavatrici"}</p>
      <div class="chips">${PL.loads.map((g, i) => `<button class="chip" type="button" data-act="plan-pick" data-i="${i}" aria-pressed="${sameSet(g.keys, S.load)}"><span class="mini-sw">${g.keys.map(swatch).join("")}</span>Lavatrice ${i + 1}</button>`).join("")}</div>
      <p class="small"><b>Oppure scegli tu le ceste</b></p></div>`;
  }
  h += `<div class="chips load-pick">${keys.map(k => `<button class="chip" type="button" data-act="pick" data-b="${k}" aria-pressed="${S.load.includes(k)}">${swatch(k)}${BASKETS[k].name} <span class="tiny">${qtyOf(map[k])}</span></button>`).join("")}</div>`;
  const noteHTML = m => `<div class="note ${noteCls(m.level)}"><b>${BASKETS[m.a].name} + ${BASKETS[m.b].name}: ${LEVEL_NAME[m.level]}</b>${m.text}</div>`;
  const cmsgs = comp.msgs.filter(m => m.level !== "ok");
  if (cmsgs.length) {
    h += noteHTML(cmsgs[0]);
    if (cmsgs.length > 1) h += `<details class="why" style="margin-top:0"><summary>${cmsgs.length === 2 ? "Un altro compromesso" : `Altri ${cmsgs.length - 1} compromessi`} in questo carico</summary><div class="why-body">${cmsgs.slice(1).map(noteHTML).join("")}</div></details>`;
  } else if (comp.msgs.length) h += noteHTML(comp.msgs[0]);

  // la macchina
  h += `<section class="machine" aria-label="La lavatrice">
    <div class="m-top">
      ${drawerHTML(R)}
      <div class="display" aria-live="polite"><span class="t" id="dispT">${R.T}°</span><span class="p">${R.program.name}</span><span class="r" id="dispR">${R.spin} giri · ${R.program.dur}</span></div>
    </div>
    <div class="porthole-wrap">${portholeHTML(items)}</div>
    <div class="phase" id="phase"><div class="ph-title">Pronta</div><p>${R.kg ? `${fmt1(R.kg)} kg di bucato, ${R.litres} litri d'acqua circa.` : ""} Avvia la simulazione per vedere cosa succede dentro il cestello, fase per fase.</p><div class="progress"><i id="phaseBar"></i></div></div>
    <div class="row" style="margin-top:12px"><button class="btn wide" type="button" data-act="sim" id="simBtn">Avvia la simulazione</button></div>
  </section>`;

  h += `<div class="recipe">`;
  if (comp.level === "no") h += `<div class="note no"><b>Carico sconsigliato</b>Ti mostro comunque la ricetta, così vedi cosa cambierebbe. Ma questa combinazione rischia di rovinare qualche capo: meglio lavaggi separati.</div>`;
  for (const w of R.warnings) h += `<div class="note no"><b>Attenzione</b>${w}</div>`;

  // programma, temperatura, giri
  h += `<section class="panel">
    <div class="big3">
      <div class="prog"><small>Programma</small><b>${R.program.name}</b></div>
      <div><small>Temperatura</small><b>${R.T}°C</b></div>
      <div><small>Centrifuga</small><b>${R.spin}</b></div>
    </div>
    <details class="why"><summary>Perché questo programma</summary><div class="why-body"><p>${R.program.why}</p>${R.program.alt ? `<p>Se la tua lavatrice non ce l'ha: <b>${R.program.alt}</b>. Durata indicativa: ${R.program.dur}.</p>` : ""}
      <div><b class="small">Il cerchio di Sinner di questo programma</b><div class="sinner">${R.program.sinner.map((v, i) => `<div class="sr"><span>${SINNER_LABELS[i]}</span><span class="pips">${[1, 2, 3, 4, 5].map(n => `<i class="${n <= v ? "on" : ""}"></i>`).join("")}</span></div>`).join("")}</div></div>
      <p class="small">Quattro leve: chimica, temperatura, azione meccanica, tempo. Se una scende, le altre devono salire per lo stesso pulito. <button class="btn plain sm" type="button" data-act="card" data-id="sinner">Approfondisci</button></p></div></details>
    <details class="why"><summary>Perché ${R.T}°C</summary><div class="why-body">${R.tempWhy.map(t => `<p>${t}</p>`).join("")}
      ${R.ecoT ? `<p><b>Ragiona:</b> i capi sono poco sporchi. A ${R.ecoT}°C invece di ${R.T}°C scalderesti l'acqua di ${R.T - R.ecoT} gradi in meno: circa il ${Math.round((1 - R.kwhEco / R.kwh) * 100)}% di energia di riscaldamento risparmiata.</p>` : ""}
      <button class="btn plain sm" type="button" data-act="card" data-id="${R.T >= 60 ? "sessanta" : "energia"}">Approfondisci</button></div></details>
    <details class="why"><summary>Perché ${R.spin} giri</summary><div class="why-body">${R.spinWhy.map(t => `<p>${t}</p>`).join("")}
      <p>A ${R.spin} giri il bucato vicino alla parete del cestello subisce circa <b>${Math.round(R.g)} g</b>, e resta con circa il ${R.moist}% di umidità.</p>
      <button class="btn plain sm" type="button" data-act="card" data-id="centrifuga">Approfondisci</button></div></details>
  </section>`;

  // dosi
  h += `<section class="panel"><h3>Cosa mettere e dove</h3><div class="dose-list" style="margin-top:12px">`;
  if (R.drawer.I) h += doseRow("I", "", "Prelavaggio", R.drawer.I.note, "");
  if (R.detergent) {
    const d = R.detergent, P = PRODUCTS[d.id];
    h += doseRow(d.where === "II" ? "II" : "◯", d.where === "II" ? "" : "in-drum", P.name, d.where === "II" ? "Nella vaschetta II, quella del lavaggio principale." : "Sul fondo del cestello, prima dei capi: nella vaschetta non si scioglierebbe.", `${d.amount} ${d.unit}`, d.why);
  }
  for (const a of R.additives) {
    const P = PRODUCTS[a.id];
    const where = a.level === "no" ? "✕" : a.where === "drum" ? "◯" : a.where === "A" ? "⚘" : "II";
    h += doseRow(where, a.level === "no" ? "no" : a.where === "drum" ? "in-drum" : "", `${P.name}<span class="lvl ${a.level}">${a.level === "si" ? "sì" : a.level}</span>`, a.where === "drum" ? "Nel cestello." : "", a.amount, [a.why]);
  }
  if (R.drawer.A) {
    const P = PRODUCTS[R.drawer.A.id];
    h += doseRow("⚘", "", P.name, "Nella vaschetta col fiore: la lavatrice la preleva all'ultimo risciacquo.", `${R.drawer.A.amount} ${R.drawer.A.unit}`, R.rinse.why);
  } else {
    h += doseRow("⚘", "no", "Vaschetta ⚘", "", "", R.rinse.why);
  }
  if (R.retina) h += doseRow("🕸️", "in-drum", "Retina", `Per ${R.retina.join(", ")}.`, "", ["La rete riduce l'attrito sulle fibre fragili e impedisce a ferretti e gancetti di agganciarsi agli altri capi."]);
  h += `</div>`;
  const miss = [...new Set(R.missing)].filter(id => !owned(S.pantry, id));
  if (miss.length) h += `<div class="note warn" style="margin-top:14px"><b>Ti sarebbe utile</b><div class="missing">${miss.map(id => `<button class="chip" type="button" data-act="own" data-id="${id}"><span class="em">${PRODUCTS[id].e}</span>${PRODUCTS[id].name}</button>`).join("")}</div><p class="tiny" style="margin-top:6px">Tocca per segnarlo come presente in dispensa.</p></div>`;
  h += `</section>`;

  // prima di avviare
  const gch = guideChips(items, "");
  if (gch) h += `<section class="panel"><h3>Prima, o al posto della lavatrice</h3><p class="small muted" style="margin-top:4px">Per alcuni capi di questo carico c'è una guida a mano: un ammollo da fare prima, o un modo più delicato ed ecologico.</p>${gch}</section>`;
  h += `<section class="panel"><h3>Prima di avviare</h3><div class="checklist" style="margin-top:8px">${R.checklist.map((c, i) => `<label class="check"><input type="checkbox" data-act="noop"><span>${c}</span></label>`).join("")}</div></section>`;

  if (R.stains.length) {
    h += `<section class="panel"><h3>Pretratta le macchie</h3><div class="stack" style="margin-top:10px">${R.stains.map(s => {
      const St = STAINS[s.id];
      return `<div><h4>${St.e} ${St.name} <span class="tiny">su ${s.names.join(", ")}</span></h4><p class="small muted" style="margin:4px 0 6px">${St.chem}</p><ul class="bullets small">${St.fare.slice(0, 3).map(f => `<li>${f}</li>`).join("")}</ul><button class="btn plain sm" type="button" data-act="stain" data-id="${s.id}">Tutti i passi</button></div>`;
    }).join("")}</div></section>`;
  }

  // energia e carico
  h += `<section class="panel"><h3>Energia e carico</h3>
    <div class="energy" style="margin-top:10px"><div class="kwh">${fmt2(R.kwh)}<small> kWh</small></div>
      <p class="small">per scaldare circa ${R.litres} litri da ${S.settings.tin} a ${R.T}°C, cioè circa ${fmt2(R.cost)} € (Q = m · c · ΔT). È la voce più pesante del lavaggio.</p></div>
    ${R.kwh30 != null && R.T > 30 ? `<p class="small muted" style="margin-top:10px">A 30°C sarebbero ${fmt2(R.kwh30)} kWh: ${Math.round((1 - R.kwh30 / R.kwh) * 100)}% in meno. ${R.igiene ? "Qui però il calore serve all'igiene." : "Ti serve davvero più calore per questo carico?"}</p>` : ""}
    <div class="fill ${R.fill > 1 ? "over" : ""}" style="margin:14px 0 0"><i style="width:${Math.min(100, Math.max(3, R.fill * 100))}%"></i></div>
    <p class="small" style="margin-top:6px">${R.fillMsg}</p>
    ${mergeSuggestions(keys, map, R)}
  </section>`;

  h += `<section class="panel"><h3>Dopo il lavaggio</h3><ul class="bullets" style="margin-top:8px">${R.after.map(a => `<li>${a}</li>`).join("")}</ul>
    <div class="row" style="margin-top:14px"><button class="btn ghost wide" type="button" data-act="done">Fatto, segna come lavato</button></div></section>`;
  h += `</div>`;
  $("#v-lavatrice").innerHTML = h;
}
function doseRow(where, cls, title, sub, amount, why) {
  return `<div class="dose"><span class="where ${cls}" aria-hidden="true">${where}</span><div class="what"><b>${title}</b>${amount ? ` · <span class="amt">${amount}</span>` : ""}${sub ? `<p>${sub}</p>` : ""}
    ${why && why.length ? `<details class="why"><summary>Perché</summary><div class="why-body">${why.map(w => `<p>${w}</p>`).join("")}</div></details>` : ""}</div></div>`;
}
function drawerHTML(R) {
  const comp = (lab, content, color, h) => `<div class="comp"><span>${lab}</span><i class="lev ${content ? "on" : ""}" style="--lc:${color || "var(--blu)"};--lh:${h || "45%"}"></i><span class="amt">${content || ""}</span></div>`;
  const II = R.detergent && R.detergent.where === "II" ? `${R.detergent.amount} ${R.detergent.unit}` : "";
  const A = R.drawer.A ? `${R.drawer.A.amount} ml` : "";
  return `<div class="drawer" aria-label="Cassetto dei detersivi">
    ${comp("I", R.drawer.I ? "pre" : "", "#9FB4C9", "30%")}
    ${comp("II", II, R.detergent ? PROD_COLOR[R.detergent.id] : "", "50%")}
    ${comp("⚘", A, R.drawer.A ? PROD_COLOR[R.drawer.A.id] : "", "40%")}
  </div>`;
}
const SLOTS = [[18, 60], [44, 64], [64, 57], [30, 74], [54, 76], [70, 70], [10, 44], [36, 48], [58, 42], [76, 46], [24, 30], [48, 28], [66, 26], [40, 86]];
function portholeHTML(items) {
  const pieces = [];
  for (const it of items) for (let i = 0; i < Math.min(it.qty || 1, 3); i++) pieces.push(it);
  const cl = pieces.slice(0, SLOTS.length).map((it, i) => {
    const C = COLORS[it.color];
    const [x, y] = SLOTS[i];
    const pat = C.hex.startsWith("pattern") ? C.hex : "";
    return `<span class="cloth ${pat}" style="left:${x - 15}%;top:${y - 10}%;--r:${(i * 47) % 180 - 90}deg;${pat ? "" : `--c:${C.hex}`}"></span>`;
  }).join("");
  return `<div class="porthole" id="porthole" data-phase="">
    <div class="glass"><div class="drum">${cl}</div><div class="water"><svg viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true"><path d="M0 6 Q12.5 0 25 6 T50 6 T75 6 T100 6 T125 6 T150 6 T175 6 T200 6 V12 H0Z"/></svg></div><div class="foam"></div></div>
  </div>`;
}
function mergeSuggestions(keys, map, R) {
  if (R.fill >= 0.5) return "";
  const others = keys.filter(k => !S.load.includes(k));
  const ok = others.filter(k => compatLoad([...S.load, k], map).level === "ok");
  const warn = others.filter(k => compatLoad([...S.load, k], map).level === "lieve");
  if (!ok.length && !warn.length) return "";
  const chips = ks => `<div class="chips" style="margin-top:6px">${ks.map(k => `<button class="chip" type="button" data-act="pick" data-b="${k}">${swatch(k)}+ ${BASKETS[k].name}</button>`).join("")}</div>`;
  return (ok.length ? `<p class="small" style="margin-top:12px"><b>Puoi unire senza problemi:</b></p>${chips(ok)}` : "")
    + (warn.length ? `<p class="small" style="margin-top:12px"><b>Con un piccolo compromesso:</b> aggiungila e leggi cosa cambia.</p>${chips(warn)}` : "");
}

// Simulazione
let SIM = null;
function buildPhases(R) {
  const tin = S.settings.tin;
  const P = [];
  const det = R.detergent ? lc(PRODUCTS[R.detergent.id].name) : "detersivo";
  const enz = R.detergent && ENZYMATIC.includes(R.detergent.id);
  const perc = R.additives.some(a => a.id === "percarbonato" && a.level !== "no") || (R.detergent && R.detergent.id === "polvere");
  P.push({ k: "fill", ms: 2600, t: "Carico dell'acqua", p: `Entrano circa ${R.litres} litri. Le fibre si bagnano e si gonfiano: il cotone assorbe acqua tra le catene di cellulosa, i sintetici molto meno. Dalla vaschetta II scende il ${det}.` });
  if (R.T > tin + 2) P.push({ k: "heat", ms: 2600, t: `Riscaldamento a ${R.T}°C`, p: `La resistenza porta l'acqua da ${tin} a ${R.T}°C: circa ${fmt2(R.kwh)} kWh, la voce più costosa del lavaggio. ${R.T >= 60 ? "Oltre i 55–60°C molti enzimi iniziano a perdere efficacia: lavorano soprattutto durante la salita." : "Siamo nella zona in cui gli enzimi lavorano al meglio."}` });
  P.push({ k: "wash", ms: 5200, t: "Lavaggio", p: `Il cestello solleva i capi e li lascia cadere nel bagno: è l'azione meccanica. Intanto i tensioattivi avvolgono il grasso in micelle${enz ? ", gli enzimi tagliano proteine, amidi e grassi in pezzi solubili" : ""}${perc && R.T >= 40 ? ", e l'ossigeno attivo spegne i pigmenti delle macchie" : ""}. Tutte e quattro le leve di Sinner al lavoro.` });
  P.push({ k: "drain", ms: 1800, t: "Scarico", p: "L'acqua sporca esce portandosi via lo sporco sospeso nelle micelle. Una prima centrifuga leggera toglie l'acqua trattenuta dalle fibre." });
  const rinseP = R.drawer.A ? ` All'ultimo risciacquo la lavatrice preleva dalla vaschetta ⚘ ${lc(PRODUCTS[R.drawer.A.id].name)}${R.drawer.A.id === "acido_citrico" || R.drawer.A.id === "aceto" ? ", che scioglie il calcare e neutralizza i residui alcalini" : ", che riveste le fibre di un film lubrificante"}.` : "";
  P.push({ k: "rinse", ms: 3600, t: "Risciacqui", p: `Acqua pulita, due o tre volte: è pura diluizione, ogni risciacquo riduce i residui di detersivo di un fattore grande.${rinseP}` });
  P.push({ k: "spin", ms: 3600, t: `Centrifuga a ${R.spin} giri`, p: `Circa ${Math.round(R.g)} g contro la parete: l'acqua viene spinta fuori dai fori del cestello. Il bucato resta con circa il ${R.moist}% di umidità.` });
  return P;
}
function startSim() {
  if (!CUR) return;
  const phases = buildPhases(CUR);
  SIM = { i: -1, phases, timer: null, raf: null, t0: 0 };
  $("#simBtn").textContent = "Salta alla fine";
  $("#simBtn").dataset.act = "skip";
  nextPhase();
}
function nextPhase() {
  if (!SIM) return;
  SIM.i++;
  const ph = SIM.phases[SIM.i];
  if (!ph) { endSim(); return; }
  $("#porthole").dataset.phase = ph.k;
  const n = SIM.phases.length;
  $("#phase").innerHTML = `<div class="ph-title">${ph.t} <small>fase ${SIM.i + 1} di ${n}</small></div><p>${ph.p}</p><div class="progress"><i id="phaseBar"></i></div>`;
  if (ph.k === "heat") animateTemp(S.settings.tin, CUR.T, ph.ms);
  SIM.t0 = performance.now();
  const tick = () => {
    if (!SIM) return;
    const f = Math.min(1, (performance.now() - SIM.t0) / ph.ms);
    const total = (SIM.i + f) / n;
    const bar = $("#phaseBar"); if (bar) bar.style.width = (total * 100) + "%";
    if (f < 1) SIM.raf = requestAnimationFrame(tick);
  };
  SIM.raf = requestAnimationFrame(tick);
  SIM.timer = setTimeout(nextPhase, ph.ms);
}
function animateTemp(a, b, ms) {
  const el = $("#dispT"); const t0 = performance.now();
  const f = () => { const k = Math.min(1, (performance.now() - t0) / ms); if (el) el.textContent = Math.round(a + (b - a) * k) + "°"; if (k < 1 && SIM) requestAnimationFrame(f); };
  requestAnimationFrame(f);
}
function stopSim() {
  if (!SIM) return;
  clearTimeout(SIM.timer); cancelAnimationFrame(SIM.raf);
  SIM = null;
}
function endSim() {
  stopSim();
  const ph = $("#porthole"); if (ph) ph.dataset.phase = "";
  const t = $("#dispT"); if (t && CUR) t.textContent = CUR.T + "°";
  $("#phase").innerHTML = `<div class="ph-title">Fine</div><p>${CUR.after[0]}</p><div class="progress"><i style="width:100%"></i></div>`;
  const b = $("#simBtn"); b.textContent = "Rivedi la simulazione"; b.dataset.act = "sim";
}
function markDone() {
  const map = classify();
  const ids = new Set(S.load.flatMap(k => (map[k] || []).map(it => it.id)));
  const n = qtyOf(S.items.filter(it => ids.has(it.id)));
  S.items = S.items.filter(it => !ids.has(it.id));
  S.stats.washes++;
  S.load = [];
  save(); render(); window.scrollTo(0, 0);
  toast(`Lavati ${n} ${n === 1 ? "capo" : "capi"}. Ora stendi entro mezz'ora.`);
}

// ───────────────────────────── BACINELLA ─────────────────────────────
function guideChips(items, label) {
  const ids = [...new Set(items.map(guideFor).filter(Boolean))];
  if (!ids.length) return "";
  return `${label ? `<p class="small" style="margin-top:10px"><b>${label}</b></p>` : ""}<div class="links" style="margin-top:8px">${ids.map(id => `<button class="link-card" type="button" data-act="guide" data-id="${id}">${GUIDES[id].e} ${GUIDES[id].name}</button>`).join("")}</div>`;
}
const fmtLeft = ms => {
  if (ms <= 0) return "finito";
  const m = Math.ceil(ms / 60000);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60), r = m % 60;
  return r ? `${h} h ${r} min` : `${h} h`;
};
const fmtDur = sec => sec < 3600 ? `${Math.round(sec / 60)} minuti` : `${fmt1(sec / 3600)} ${sec === 3600 ? "ora" : "ore"}`;
const fmtClock = ts => new Date(ts).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
function timersHTML() {
  const ts = Object.entries(S.timers || {});
  if (!ts.length) return "";
  return `<section class="panel stack"><h3>In corso</h3>${ts.map(([gid, t]) => `<div class="timer-row"><span class="em" aria-hidden="true">${GUIDES[gid] ? GUIDES[gid].e : "⏱️"}</span>
    <button class="timer-name" type="button" data-act="guide" data-id="${gid}"><b>${t.step}</b><small>${GUIDES[gid] ? GUIDES[gid].name : ""} · pronto alle ${fmtClock(t.end)}</small></button>
    <span class="timer-left" data-timer-end="${t.end}">${fmtLeft(t.end - Date.now())}</span>
    <button class="xbtn" type="button" data-act="timer-stop" data-id="${gid}" aria-label="Togli il timer">×</button></div>`).join("")}</section>`;
}
function toolChip(id) {
  const P = PRODUCTS[id], have = owned(S.pantry, id);
  return `<button class="chip need ${have ? "have" : ""}" type="button" data-act="own-g" data-id="${id}" aria-pressed="${have}" title="${have ? "Ce l'hai" : "Tocca se ce l'hai"}"><span class="em" aria-hidden="true">${P.e}</span>${P.name}</button>`;
}
function renderMano() {
  const map = classify();
  let h = `<div class="section-head"><div><h2>Bacinella</h2><p class="muted">Quello che la lavatrice non sa fare, o fa peggio: ammolli, lavaggi a mano, scarpe e zaini.</p></div></div>`;
  h += timersHTML();
  // dal cesto
  const fromBasket = {};
  for (const it of S.items) { const g = guideFor(it); if (g) (fromBasket[g] = fromBasket[g] || []).push(it); }
  const fb = Object.entries(fromBasket);
  if (fb.length) {
    h += `<section class="panel stack"><h3>Dal tuo cesto</h3><div class="guide-list">${fb.map(([gid, its]) => guideCard(gid, cap1(names(its, 3)))).join("")}</div></section>`;
  }
  // mani
  h += `<section class="panel hands">
    <h3>Le mani prima di tutto</h3>
    <p class="small muted" style="margin-top:4px">I detersivi sciolgono il grasso delle macchie, ma anche quello che tiene insieme la barriera della pelle.</p>
    <ul class="hand-rules">${HANDS.rules.map(r => `<li>${r}</li>`).join("")}</ul>
    <button class="guide-link" type="button" data-act="card" data-id="mani"><span class="em" aria-hidden="true">🔬</span><span><b>${CARD_BY_ID.mani.title}</b><small>Mattoni, malta e mantello acido: la pelle vista dal detersivo</small></span></button>
    <h4 style="margin-top:16px">Gli attrezzi</h4>
    <p class="tiny" style="margin:2px 0 8px">Tocca quelli che hai già: le guide li useranno.</p>
    <div class="chips">${HANDS.tools.map(toolChip).join("")}</div>
  </section>`;
  for (const gr of GUIDE_GROUPS) h += `<section class="stack"><h3>${gr.name}</h3><div class="guide-list">${gr.ids.map(id => guideCard(id)).join("")}</div></section>`;
  $("#v-mano").innerHTML = h;
}
function guideCard(id, forWhat) {
  const g = GUIDES[id];
  return `<button class="guide-card" type="button" data-act="guide" data-id="${id}">
    <span class="em" aria-hidden="true">${g.e}</span>
    <span class="gc-body"><b>${g.name}</b><span class="gc-sub">${forWhat ? `Per: ${forWhat}` : g.sub}</span>
      <span class="gc-meta"><span>${g.time}</span><span class="skin ${g.skin}">${SKIN[g.skin].short}</span></span></span></button>`;
}
let GUIDE = null;
function openGuide(id, keep) {
  const g = GUIDES[id]; if (!g) return;
  GUIDE = id;
  let h = sheetHead(`<span aria-hidden="true">${g.e}</span> ${g.name}`, `<span class="tiny">${g.method}</span>`);
  h += `<div class="guide-meta">
    <div><small>Tempo</small><b>${g.time}</b></div>
    <div><small>Acqua</small><b>${g.water}</b></div>
    <div class="skin-box ${g.skin}"><small>Mani</small><b>${SKIN[g.skin].name}</b></div>
  </div>`;
  h += `<p class="group">${g.when}</p>`;
  h += `<div class="note ${g.skin === "must" ? "no" : g.skin === "si" ? "warn" : "ok"} group"><b>${SKIN[g.skin].name}</b>${g.skinWhy}</div>`;
  // cosa serve
  h += `<div class="group"><h4>Cosa ti serve</h4><div class="need-list">${g.products.map(grp => {
    const have = grp.ids.find(pid => owned(S.pantry, pid));
    const pid = have || grp.ids[0], P = PRODUCTS[pid];
    const alts = grp.ids.filter(x => x !== pid).map(x => lc(PRODUCTS[x].name));
    return `<div class="need-row ${have ? "ok" : ""}"><span class="em" aria-hidden="true">${P.e}</span><div><b>${P.name}</b>${have ? ` <span class="lvl si">ce l'hai</span>` : ` <button class="lvl add" type="button" data-act="own-g" data-id="${pid}">ce l'ho</button>`}
      <p class="small muted">${cap1(grp.note)}.${alts.length ? ` In alternativa: ${alts.join(", ")}.` : ""}</p></div></div>`;
  }).join("")}</div>
    <div class="chips" style="margin-top:10px">${g.tools.map(toolChip).join("")}</div></div>`;
  // passaggi
  h += `<div class="group"><h4>Passo passo</h4><ol class="steps">${g.steps.map((st, i) => {
    const t = S.timers && S.timers[id];
    const running = t && t.i === i;
    const tbtn = st.timer ? (running
      ? `<div class="step-timer on"><span>⏱️ <b data-timer-end="${t.end}">${fmtLeft(t.end - Date.now())}</b> · pronto alle ${fmtClock(t.end)}</span><button class="btn plain sm" type="button" data-act="timer-stop" data-id="${id}">Ferma</button></div>`
      : `<button class="btn ghost sm step-timer" type="button" data-act="timer-start" data-id="${id}" data-i="${i}">⏱️ Avvia timer · ${fmtDur(st.timer)}</button>`) : "";
    return `<li><b>${st.t}</b><p>${st.d}</p>${tbtn}</li>`;
  }).join("")}</ol></div>`;
  h += `<div class="group"><h4>Da evitare</h4><ul class="bullets">${g.avoid.map(a => `<li>${a}</li>`).join("")}</ul></div>`;
  h += `<div class="group eco-box"><b>🌿 Ecologia</b>${g.eco}</div>`;
  h += `<div class="group"><h4>La scienza</h4><p>${g.why}</p>${g.cards.length ? `<div class="links" style="margin-top:10px">${g.cards.map(c => `<button class="link-card" type="button" data-act="card" data-id="${c}">${CARD_BY_ID[c].title}</button>`).join("")}</div>` : ""}</div>`;
  openSheet(h, keep);
}
function startTimer(id, i) {
  const st = GUIDES[id].steps[i];
  S.timers = S.timers || {};
  S.timers[id] = { i, step: st.t, end: Date.now() + st.timer * 1000, done: false };
  save();
  toast(`Timer avviato: pronto alle ${fmtClock(S.timers[id].end)}. Tienilo d'occhio qui, nella Bacinella.`);
}
setInterval(() => {
  const now = Date.now();
  document.querySelectorAll("[data-timer-end]").forEach(el => { el.textContent = fmtLeft(+el.dataset.timerEnd - now); });
  for (const [gid, t] of Object.entries(S.timers || {})) {
    if (!t.done && t.end <= now) {
      t.done = true; save();
      toast(`${GUIDES[gid] ? GUIDES[gid].e + " " : ""}${t.step}: tempo scaduto.`, { label: "Apri", fn: () => openGuide(gid) });
      if (navigator.vibrate) try { navigator.vibrate([200, 100, 200]); } catch (e) { /* niente */ }
    }
  }
}, 1000);

// ───────────────────────────── LABORATORIO ─────────────────────────────
function renderLab() {
  const tabs = [["box", "Box"], ["macchie", "Macchie"], ["etichette", "Etichette"], ["calcoli", "Calcoli"]];
  let h = `<div class="section-head"><div><h2>Laboratorio</h2><p class="muted">Prima ragiona, poi scopri la spiegazione.</p></div></div>`;
  h += `<div class="seg" role="group" aria-label="Sezioni del laboratorio">${tabs.map(([k, t]) => `<button type="button" data-act="labtab" data-v="${k}" aria-pressed="${S.labTab === k}">${t}</button>`).join("")}</div>`;
  if (S.labTab === "box") h += labBox();
  else if (S.labTab === "macchie") h += labStains();
  else if (S.labTab === "etichette") h += labLabels();
  else h += labCalc();
  $("#v-lab").innerHTML = h;
  if (S.labTab === "calcoli") updateCalc();
}
function labBox() {
  const seen = CARDS.filter(c => S.seen[c.id]).length;
  const order = Object.keys(CARD_CATS);
  const list = CARDS.filter(c => S.labCat === "tutti" || c.cat === S.labCat).sort((a, b) => order.indexOf(a.cat) - order.indexOf(b.cat));
  return `<div class="progress-line"><span class="small"><b>${seen}</b> su ${CARDS.length} scoperti</span><div class="bar"><i style="width:${seen / CARDS.length * 100}%"></i></div></div>
    <div class="chips">${[["tutti", "Tutti"], ...Object.entries(CARD_CATS)].map(([k, t]) => `<button class="chip" type="button" data-act="labcat" data-v="${k}" aria-pressed="${S.labCat === k}">${t}</button>`).join("")}</div>
    <div class="cards">${list.map(c => `<button class="label-card" type="button" data-act="card" data-id="${c.id}"><span class="cat">${CARD_CATS[c.cat]}</span><h3>${c.title}</h3><p class="ask">${c.ask}</p>${S.seen[c.id] ? `<span class="seen" aria-label="Scoperto">✓</span>` : ""}</button>`).join("")}</div>`;
}
let CARD = null;
function openCard(id) {
  CARD = { id, picked: null, revealed: !!S.seen[id] };
  renderCard(false);
}
function renderCard(keep = true) {
  const c = CARD_BY_ID[CARD.id];
  let h = sheetHead(c.title, `<span class="tiny">${CARD_CATS[c.cat]}</span>`);
  h += `<div class="card-sheet stack">`;
  h += `<div class="ask-box"><p class="quiz-q">${c.ask}</p><div class="opt-list">${c.opts.map((o, i) => {
    const cls = CARD.picked != null ? (o[1] ? "right" : i === CARD.picked ? "wrong" : "") : "";
    return `<button class="opt ${cls}" type="button" data-act="c-opt" data-i="${i}" ${CARD.picked != null ? "disabled" : ""}><span>${o[0]}${CARD.picked === i && !o[1] && o[2] ? `<div class="opt-fb">${o[2]}</div>` : ""}</span></button>`;
  }).join("")}</div>
  ${CARD.picked == null && !CARD.revealed ? `<button class="btn plain sm" type="button" data-act="c-reveal" style="margin-top:8px">Mostrami direttamente la spiegazione</button>` : ""}
  ${CARD.picked != null ? `<p class="small" style="margin-top:10px"><b>${c.opts[CARD.picked][1] ? "Ragionamento giusto." : "Non proprio."}</b> Ecco perché.</p>` : ""}</div>`;
  if (CARD.revealed) {
    h += `<div class="body">${c.body.map(p => `<p>${p}</p>`).join("")}</div>`;
    h += `<div class="ana"><b>L'analogia</b>${c.ana}</div>`;
    h += `<div><h4>In pratica</h4><ul class="bullets" style="margin-top:6px">${c.pratica.map(p => `<li>${p}</li>`).join("")}</ul></div>`;
    if (c.rel && c.rel.length) h += `<div><h4>Collegati</h4><div class="links" style="margin-top:6px">${c.rel.filter(r => CARD_BY_ID[r]).map(r => `<button class="link-card" type="button" data-act="card" data-id="${r}">${CARD_BY_ID[r].title}</button>`).join("")}</div></div>`;
  }
  h += `</div>`;
  openSheet(h, keep);
}
function revealCard() {
  CARD.revealed = true;
  if (!S.seen[CARD.id]) { S.seen[CARD.id] = true; save(); }
  renderCard(true);
  render();
}
function labStains() {
  return `<p class="small muted">Ogni macchia appartiene a una famiglia chimica, e la famiglia decide chi la scioglie: enzimi, tensioattivi, ossidanti, acidi o solventi.</p>
    <div class="stain-grid">${Object.entries(STAINS).map(([k, s]) => `<button class="tile" type="button" data-act="stain" data-id="${k}"><span class="em" aria-hidden="true">${s.e}</span>${s.name}</button>`).join("")}</div>`;
}
function openStain(id) {
  const s = STAINS[id];
  const have = s.prod.filter(p => owned(S.pantry, p)), need = s.prod.filter(p => !owned(S.pantry, p));
  let h = sheetHead(`<span aria-hidden="true">${s.e}</span> ${s.name}`);
  h += `<span class="fam">${s.fam}</span>`;
  h += `<div class="group"><h4>Che cos'è</h4><p>${s.chem}</p></div>`;
  h += `<div class="group"><h4>Cosa fare</h4><ol class="bullets">${s.fare.map(f => `<li>${f}</li>`).join("")}</ol></div>`;
  h += `<div class="group"><h4>Cosa non fare</h4><ul class="bullets">${s.no.map(f => `<li>${f}</li>`).join("")}</ul></div>`;
  if (s.prod.length) h += `<div class="group"><h4>Con quello che hai</h4>${have.length ? `<div class="chips">${have.map(p => `<span class="chip" aria-pressed="true"><span class="em">${PRODUCTS[p].e}</span>${PRODUCTS[p].name}</span>`).join("")}</div>` : `<p class="small muted">In dispensa non hai ancora i prodotti utili per questa macchia.</p>`}
    ${need.length ? `<p class="small muted" style="margin:10px 0 6px">Ti servirebbe anche:</p><div class="chips">${need.map(p => `<button class="chip" type="button" data-act="own-s" data-id="${p}" data-s="${id}"><span class="em">${PRODUCTS[p].e}</span>${PRODUCTS[p].name}</button>`).join("")}</div>` : ""}</div>`;
  openSheet(h);
}
function sym(s) {
  let h = 40, g = "";
  const T = (x, y, t, fs) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="${fs}" font-weight="700" fill="currentColor" stroke="none" font-family="system-ui, sans-serif">${t}</text>`;
  if (s.t === "tub") {
    h = 46;
    g += `<path d="M5 13 L8.5 33 Q9 35 11 35 L29 35 Q31 35 31.5 33 L35 13"/><path d="M5 13 q3.75 -4 7.5 0 t7.5 0 t7.5 0 t7.5 0"/>`;
    if (s.n) g += T(20, 30, s.n, 11);
    if (s.hand) g += `<path d="M14 32 V25 M17 32 V22 M20 32 V21 M23 32 V22.5 M26 32 L28.5 27.5" stroke-width="1.8"/>`;
    if (s.bars >= 1) g += `<path d="M7 40 H33"/>`;
    if (s.bars >= 2) g += `<path d="M7 44 H33"/>`;
    if (s.cross) g += `<path d="M5 9 L35 38 M35 9 L5 38"/>`;
  } else if (s.t === "tri") {
    g += `<path d="M20 5 L36 33 H4 Z"/>`;
    if (s.lines) g += `<path d="M14.5 31 L20.5 19 M19.5 31 L25.5 19" stroke-width="1.8"/>`;
    if (s.cross) g += `<path d="M6 7 L34 35 M34 7 L6 35"/>`;
  } else if (s.t === "sq") {
    g += `<rect x="5" y="5" width="30" height="30" rx="2"/>`;
    if (s.circle) g += `<circle cx="20" cy="20" r="11"/>`;
    if (s.dots === 1) g += `<circle cx="20" cy="20" r="2" fill="currentColor" stroke="none"/>`;
    if (s.dots === 2) g += `<circle cx="16" cy="20" r="2" fill="currentColor" stroke="none"/><circle cx="24" cy="20" r="2" fill="currentColor" stroke="none"/>`;
    if (s.line === "v") g += `<path d="M20 11 V30"/>`;
    if (s.line === "h") g += `<path d="M11 20 H29"/>`;
    if (s.shade) g += `<path d="M5 14 L14 5"/>`;
    if (s.cross) g += `<path d="M3 3 L37 37 M37 3 L3 37"/>`;
  } else if (s.t === "iron") {
    g += `<path d="M5 31 H35 L33.5 22 Q32.5 15 26 15 H14 Q8 15 6.5 22 Z"/><path d="M13 15 Q13 9 19 9 H31"/>`;
    const pos = { 1: [20], 2: [16.5, 23.5], 3: [13.5, 20, 26.5] }[s.dots] || [];
    g += pos.map(x => `<circle cx="${x}" cy="24.5" r="1.8" fill="currentColor" stroke="none"/>`).join("");
    if (s.cross) g += `<path d="M5 7 L35 36 M35 7 L5 36"/>`;
  } else if (s.t === "circ") {
    g += `<circle cx="20" cy="20" r="14"/>`;
    if (s.l) g += T(20, 25, s.l, 14);
    if (s.cross) g += `<path d="M7 7 L33 33 M33 7 L7 33"/>`;
  }
  return `<svg viewBox="0 0 40 ${h}" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${g}</svg>`;
}
function labLabels() {
  return `<p class="small muted">I simboli internazionali delle etichette (ISO 3758). Ogni simbolo è una regola, e ogni regola ha una ragione fisica o chimica.</p>` +
    LABEL_GROUPS.map((gr, gi) => `<section class="stack"><h3>${gr.name}</h3><div class="sym-grid">${gr.items.map((it, ii) =>
      `<button class="tile" type="button" data-act="sym" data-g="${gi}" data-i="${ii}">${sym(it.s)}<span>${it.title}</span></button>`).join("")}</div></section>`).join("");
}
function openSym(gi, ii) {
  const it = LABEL_GROUPS[gi].items[ii];
  let h = sheetHead(it.title, `<span class="tiny">${LABEL_GROUPS[gi].name}</span>`);
  h += `<div class="sym-big">${sym(it.s)}</div><p>${it.text}</p><div class="group note"><b>Perché</b>${it.why}</div>`;
  openSheet(h);
}
function labCalc() {
  const st = S.settings;
  return `<section class="panel calc">
      <h3>Quanto costa scaldare l'acqua</h3>
      <p class="small muted">Q = m · c · ΔT, con c = 4,186 kJ/(kg·°C). Prova a dimezzare ΔT e guarda cosa succede.</p>
      ${rng("cL", "Litri riscaldati", 6, 20, 1, 12, " L")}
      ${rng("cTin", "Acqua in ingresso", 5, 25, 1, st.tin, "°C")}
      ${rng("cT", "Temperatura di lavaggio", 20, 90, 10, 40, "°C")}
      <div class="out" id="oE"></div><p class="small" id="oE2"></p>
    </section>
    <section class="panel calc">
      <h3>La forza della centrifuga</h3>
      <p class="small muted">a = ω² · r, con ω = 2π · giri / 60. Poi l'acqua rimasta va evaporata: circa 2260 kJ per ogni kg.</p>
      ${rng("cRpm", "Giri al minuto", 400, 1600, 200, 1200, "")}
      ${rng("cR", "Raggio del cestello", 20, 30, 1, 25, " cm")}
      <div class="out" id="oG"></div><p class="small" id="oG2"></p>
    </section>
    <section class="panel calc">
      <h3>Durezza dell'acqua</h3>
      <p class="small muted">1 °F = 10 mg di carbonato di calcio per litro. 1 °dH (grado tedesco) = 1,79 °F.</p>
      ${rng("cF", "Gradi francesi", 0, 60, 1, st.fh !== "" ? +st.fh : 25, " °F")}
      <div class="out" id="oH"></div><p class="small" id="oH2"></p>
      <button class="btn ghost sm" type="button" data-act="usehard">Usa questo valore in Dispensa</button>
    </section>`;
}
const rng = (id, label, min, max, step, val, unit) => `<div class="range"><label for="${id}">${label} <b><span id="${id}v">${val}</span>${unit}</b></label><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}" data-calc="1"></div>`;
function updateCalc() {
  const v = id => +($("#" + id) || {}).value;
  if (!$("#cL")) return;
  ["cL", "cTin", "cT", "cRpm", "cR", "cF"].forEach(id => { const o = $("#" + id + "v"); if (o) o.textContent = v(id); });
  const kwh = heatKWh(v("cL"), v("cTin"), v("cT"));
  const year = kwh * 4 * 52;
  $("#oE").innerHTML = `${fmt2(kwh)} <small>kWh a lavaggio · ${fmt2(kwh * S.settings.price)} €</small>`;
  const k30 = heatKWh(v("cL"), v("cTin"), 30), k60 = heatKWh(v("cL"), v("cTin"), 60);
  $("#oE2").innerHTML = `Con 4 lavaggi a settimana: circa ${Math.round(year)} kWh l'anno solo per scaldare l'acqua, cioè ${Math.round(year * S.settings.price)} € e circa ${Math.round(year * 0.25)} kg di CO₂ (fattore indicativo 0,25 kg/kWh). ${v("cT") > 30 ? `A 30°C sarebbero ${fmt2(k30)} kWh a lavaggio.` : ""} ${v("cT") < 60 ? `A 60°C ${fmt2(k60)}.` : ""}`;
  const rpm = v("cRpm"), r = v("cR") / 100;
  const g = gForce(rpm, r), m = residualMoisture(rpm);
  const water = 5 * m / 100;
  $("#oG").innerHTML = `${Math.round(g)} <small>g · umidità residua circa ${m}%</small>`;
  $("#oG2").innerHTML = `Su 5 kg di bucato restano circa ${fmt1(water)} kg d'acqua. Per evaporarla servono almeno ${fmt2(water * 2260 / 3600)} kWh di calore: sullo stendino li regalano aria e sole, in asciugatrice li paghi.`;
  const f = v("cF"), cls = f < 15 ? "dolce" : f <= 30 ? "media" : "dura";
  $("#oH").innerHTML = `${fmt1(f / 1.79)} <small>°dH · ${f * 10} mg/L di CaCO₃</small>`;
  $("#oH2").innerHTML = `Acqua <b>${HARD[cls].name.toLowerCase()}</b>: dose del detersivo × ${fmt2(HARD[cls].f)}. ${cls === "dura" ? "Il calcare sequestra tensioattivi: l'acido citrico nella vaschetta ⚘ aiuta molto." : cls === "dolce" ? "Con acqua dolce basta meno detersivo, e il sapone di Marsiglia funziona bene." : ""}`;
}

// ───────────────────────────── EVENTI ─────────────────────────────
document.addEventListener("click", e => {
  const a = e.target.closest("[data-act]");
  if (!a) return;
  const act = a.dataset.act, id = a.dataset.id;
  if (a.tagName === "INPUT" || a.tagName === "SELECT") return; // gestiti da change
  switch (act) {
    case "go": go(a.dataset.view); break;
    case "close": closeSheet(); break;
    case "toast": $("#toast").hidden = true; if (toastAction) toastAction(); break;
    case "add": openAdd(null); break;
    case "item": openItem(id); break;
    case "edit": openAdd(id); break;
    case "remove": S.items = S.items.filter(it => it.id !== id); save(); closeSheet(); render(); toast("Tolto dal cesto."); break;
    case "clear": if (confirm("Svuotare il cesto?")) { S.items = []; S.load = []; save(); render(); } break;
    case "wash": S.load = [a.dataset.b]; save(); go("lavatrice"); break;
    case "planmode": S.settings.planMode = a.dataset.v; S.load = []; save(); render(); break;
    case "plan-open": case "plan-pick": {
      const P = planLoads(classify(), S.settings, S.settings.planMode || "min");
      const g = P.loads[+a.dataset.i]; if (!g) break;
      S.load = [...g.keys]; save();
      if (act === "plan-open") go("lavatrice"); else render();
      break;
    }
    case "guide": openGuide(id); break;
    case "own-g": {
      S.pantry[id] = { ...(S.pantry[id] || {}), have: !owned(S.pantry, id) }; save();
      if (GUIDE && !$("#sheetWrap").hidden) openGuide(GUIDE, true);
      if (VIEW === "mano" || VIEW === "dispensa") render();
      break;
    }
    case "timer-start": startTimer(id, +a.dataset.i); openGuide(id, true); if (VIEW === "mano") render(); break;
    case "timer-stop": delete S.timers[id]; save(); if (!$("#sheetWrap").hidden && GUIDE === id) openGuide(id, true); if (VIEW === "mano") render(); break;
    case "hand-done": { const n = removeBaskets(a.dataset.keys.split(",")); save(); render(); toast(`Lavati a mano ${n} ${n === 1 ? "capo" : "capi"}. In piano all'ombra.`); break; }
    // bozza
    case "d-g": D.g = a.dataset.v; D.fiber = GARMENTS[D.g].fiber; D.pickG = false; D.flags.elastan = ["leggings", "sportmaglia", "costume"].includes(D.g); if (GARMENTS[D.g].stain && !D.id) D.flags.macchia = GARMENTS[D.g].stain; renderAdd(false); break;
    case "d-regarment": D.pickG = true; renderAdd(false); break;
    case "d-color": D.color = a.dataset.v; renderAdd(); break;
    case "d-fiber": D.fiber = a.dataset.v; renderAdd(); break;
    case "d-label": D.label = a.dataset.v || null; renderAdd(); break;
    case "d-soil": D.flags.sporco = a.dataset.v; renderAdd(); break;
    case "d-qty": D.qty = Math.max(1, Math.min(20, D.qty + (+a.dataset.d))); renderAdd(); break;
    case "d-save": saveDraft(); break;
    // quiz
    case "q-pick":
      if (Q && !Q.picked) { Q.picked = a.dataset.b; S.stats.qTot++; if (Q.picked === Q.r.basket) S.stats.qOk++; save(); renderQuiz(); }
      break;
    case "q-done":
      if (Q) { const it = Q.it; S.items.push(it); save(); closeSheet(); render(); toast(`${GARMENTS[it.g].name} nella cesta ${BASKETS[sortItem(it).basket].name}`); }
      break;
    // dispensa
    case "cap": S.settings.cap = Math.max(4, Math.min(14, S.settings.cap + (+a.dataset.d))); save(); render(); break;
    case "hard": S.settings.hard = a.dataset.v; S.settings.fh = ""; save(); render(); break;
    case "own": S.pantry[id] = { ...(S.pantry[id] || {}), have: !owned(S.pantry, id) }; save(); render(); if (owned(S.pantry, id)) toast(`${PRODUCTS[id].name} in dispensa.`); break;
    case "own-s": S.pantry[id] = { ...(S.pantry[id] || {}), have: true }; save(); openStain(a.dataset.s); break;
    case "unown": S.pantry[id] = { ...(S.pantry[id] || {}), have: false }; save(); render(); break;
    case "export": exportBackup(); break;
    case "kit": STARTER_KIT.forEach(k => { S.pantry[k] = { ...(S.pantry[k] || {}), have: true }; }); save(); render(); toast("Kit essenziale in dispensa."); break;
    // lavatrice
    case "pick": {
      const b = a.dataset.b;
      if (S.load.includes(b)) { if (S.load.length > 1) S.load = S.load.filter(k => k !== b); }
      else S.load = [...S.load, b];
      save(); render(); break;
    }
    case "sim": startSim(); break;
    case "skip": endSim(); break;
    case "done": markDone(); break;
    // laboratorio
    case "labtab": S.labTab = a.dataset.v; save(); render(); break;
    case "labcat": S.labCat = a.dataset.v; save(); render(); break;
    case "card": openCard(id); break;
    case "c-opt": if (CARD && CARD.picked == null) { CARD.picked = +a.dataset.i; revealCard(); } break;
    case "c-reveal": revealCard(); break;
    case "stain": openStain(id); break;
    case "sym": openSym(+a.dataset.g, +a.dataset.i); break;
    case "usehard": {
      const f = +$("#cF").value; S.settings.fh = f; S.settings.hard = f < 15 ? "dolce" : f <= 30 ? "media" : "dura"; save();
      toast(`Durezza impostata: ${f} °F, acqua ${HARD[S.settings.hard].name.toLowerCase()}.`); break;
    }
  }
});
async function exportBackup() {
  const data = JSON.stringify({ app: "oblo", version: 1, saved: new Date().toISOString(), state: JSON.parse(JSON.stringify(S, (k, v) => (k === "_b" || k === "_r") ? undefined : v)) });
  const name = `oblo-backup-${new Date().toISOString().slice(0, 10)}.json`;
  const blob = new Blob([data], { type: "application/json" });
  try {
    const file = new File([blob], name, { type: "application/json" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: "Backup Oblò" }); return; }
  } catch (e) { if (e && e.name === "AbortError") return; }
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
function importBackup(file) {
  const r = new FileReader();
  r.onload = () => {
    try {
      const o = JSON.parse(r.result);
      const st = o && o.app === "oblo" ? o.state : o;
      if (!st || typeof st !== "object" || !Array.isArray(st.items)) throw new Error("formato");
      if ((S.items.length || Object.keys(S.pantry).length) && !confirm("Sostituire i dati attuali con quelli del backup?")) return;
      S = { ...clone(DEF), ...st, settings: { ...DEF.settings, ...(st.settings || {}) }, stats: { ...DEF.stats, ...(st.stats || {}) } };
      save(); render();
      toast(`Backup importato: ${qtyOf(S.items)} capi nel cesto, ${Object.keys(S.pantry).filter(k => owned(S.pantry, k)).length} prodotti in dispensa.`);
    } catch (e) { toast("Questo file non è un backup di Oblò."); }
  };
  r.readAsText(file);
}
document.addEventListener("change", e => {
  const el = e.target;
  if (el.id === "importOblo") { if (el.files[0]) importBackup(el.files[0]); el.value = ""; return; }
  const act = el.dataset.act, inp = el.dataset.inp;
  if (act === "quiz") { S.settings.quiz = el.checked; save(); render(); return; }
  if (act === "eco") { S.settings.eco = el.checked; save(); return; }
  if (act === "d-flag" && D) { D.flags[el.dataset.v] = el.checked; renderAdd(); return; }
  if (act === "d-stain" && D) { D.flags.macchia = el.value; return; }
  if (inp === "fh") {
    const f = parseFloat(String(el.value).replace(",", "."));
    S.settings.fh = isNaN(f) ? "" : f;
    if (!isNaN(f)) S.settings.hard = f < 15 ? "dolce" : f <= 30 ? "media" : "dura";
    save(); render(); return;
  }
  if (inp === "tin") { const v = parseFloat(String(el.value).replace(",", ".")); if (!isNaN(v)) S.settings.tin = Math.max(2, Math.min(30, v)); save(); return; }
  if (inp === "price") { const v = parseFloat(String(el.value).replace(",", ".")); if (!isNaN(v)) S.settings.price = Math.max(0, Math.min(2, v)); save(); return; }
  if (inp === "dose") { const v = parseFloat(String(el.value).replace(",", ".")); S.pantry[el.dataset.id] = { ...(S.pantry[el.dataset.id] || {}), dose: isNaN(v) ? "" : v }; save(); return; }
});
document.addEventListener("input", e => { if (e.target.dataset.calc) updateCalc(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("#sheetWrap").hidden) closeSheet(); });

// ───────────────────────────── AVVIO ─────────────────────────────
go("cesto");
if (MOVED) { save(); toast("Trasloco completato: cesto, dispensa e box scoperti sono qui."); }
if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("sw.js", { scope: "./" }).catch(() => {}));
})();
