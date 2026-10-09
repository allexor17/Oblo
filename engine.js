// Oblò · motore: smistamento nelle ceste, compatibilità tra ceste, ricetta del lavaggio

const HARD = {
  dolce: { f: 0.8,  name: "Dolce", range: "sotto i 15 °F" },
  media: { f: 1,    name: "Media", range: "tra 15 e 30 °F" },
  dura:  { f: 1.25, name: "Dura",  range: "oltre i 30 °F" }
};
const SOIL = {
  poco:    { f: 0.75, name: "Poco sporco" },
  normale: { f: 1,    name: "Sporco normale" },
  molto:   { f: 1.3,  name: "Molto sporco" }
};
const TEMP_STEPS = [20, 30, 40, 60, 90];
const SPIN_STEPS = [400, 600, 800, 1000, 1200, 1400];

const PROGRAMS = {
  eco:       { name: "Eco 40-60",               alt: "Cotone 40°C",                 dur: "circa 3 ore",       sinner: [3, 2, 3, 5], why: "È il programma su cui si misura l'etichetta energetica: scalda meno e compensa allungando il tempo. Pensato per cotone normalmente sporco con etichetta da 40 o 60°C." },
  cotone:    { name: "Cotone",                  alt: "Eco 40-60 se non serve igiene", dur: "circa 2–2,5 ore", sinner: [3, 4, 4, 3], why: "Movimento energico e temperatura piena: è il programma per le fibre di cellulosa robuste, e l'unico che raggiunge davvero i 60°C quando serve l'igiene." },
  misti:     { name: "Misti / Sintetici",       alt: "Colorati",                    dur: "circa 1,5 ore",     sinner: [3, 2, 3, 3], why: "Azione meccanica e centrifuga moderate: i sintetici non fissano le pieghe e i colori migrano meno." },
  colorati:  { name: "Colorati",                alt: "Misti o Cotone a 30°C",       dur: "circa 1,5 ore",     sinner: [3, 2, 3, 3], why: "Temperatura bassa e risciacqui abbondanti: il colorante diffonde poco fuori dalla fibra e quello libero viene diluito." },
  scuri:     { name: "Scuri / Jeans",           alt: "Misti a 30°C",                dur: "circa 1,5 ore",     sinner: [3, 2, 2, 3], why: "Poco movimento e pochi giri: meno abrasione in superficie, quindi meno effetto grigio e meno sbiadimento." },
  sport:     { name: "Sport",                   alt: "Sintetici a 30°C",            dur: "circa 1 ora",       sinner: [3, 2, 3, 2], why: "Temperatura bassa per salvare l'elastan e risciacqui extra per liberare la trama tecnica dai residui." },
  delicati:  { name: "Delicati",                alt: "Lana",                        dur: "circa 1 ora",       sinner: [3, 2, 2, 2], why: "Il cestello solleva appena i capi: poco attrito per fibre fragili da bagnate e per ferretti e pizzi." },
  lana:      { name: "Lana",                    alt: "A mano nel lavandino",        dur: "circa 45 minuti",   sinner: [2, 1, 1, 2], why: "Movimento a culla, acqua fredda e pochi giri: le scaglie della lana non hanno occasione di incastrarsi." },
  mano:      { name: "Seta / A mano",           alt: "Lana, o a mano nel lavandino", dur: "circa 40 minuti",  sinner: [2, 1, 1, 2], why: "Il minimo indispensabile su tutte e quattro le leve: le fibre proteiche fragili non reggono di più." },
  piumini:   { name: "Piumini",                 alt: "Delicati",                    dur: "circa 1,5 ore",     sinner: [2, 2, 2, 3], why: "Tanta acqua e tanti risciacqui: la piuma trattiene il detersivo e deve gonfiarsi senza grumi." },
  intensivo: { name: "Cotone con prelavaggio",  alt: "Intensivo",                   dur: "circa 2,5 ore",     sinner: [4, 3, 4, 4], why: "Il prelavaggio porta via lo sporco grossolano, così il detersivo del lavaggio principale non si esaurisce sul fango." }
};
const SINNER_LABELS = ["Chimica", "Temperatura", "Azione meccanica", "Tempo"];

// I nomi sul pannello della lavatrice. I programmi generici di Oblò descrivono un modo di lavare
// (movimento, acqua, centrifuga); ogni lavatrice li chiama a modo suo, e alcuni non li ha.
const DIALS = {
  generico: { name: "Nomi generici" },
  mio: {
    name: "Come la mia lavatrice",
    list: ["ECO 40-60", "Cotone", "Cotone con prelavaggio", "Lava/Indossa", "Lana", "Delicati", "Express 20'", "Jeans/Scuri", "Capi outdoor", "Impermeabilizzare", "Scarico/Centrifuga", "Solo risciacquo/Inamidare"]
  }
};
function dialProgram(pk, items, synth, T, settings) {
  const P = PROGRAMS[pk];
  if ((settings && settings.dial) !== "mio") return { name: P.name, note: "" };
  const t = `${T}°C`;
  const outdoor = items.some(it => it.fiber === "membrana" || it.g === "giacca" || it.g === "pile");
  switch (pk) {
    case "eco": return { name: "ECO 40-60", note: "" };
    case "cotone": return { name: "Cotone", note: `Imposta ${t} con il tasto della temperatura.` };
    case "intensivo": return { name: "Cotone con prelavaggio", note: "Il detersivo va sia nella vaschetta I sia nella II." };
    case "misti": return { name: "Lava/Indossa", note: `È il programma per sintetici e misti: movimento e centrifuga moderati, meno pieghe. Imposta ${t}.` };
    case "colorati": return synth
      ? { name: "Lava/Indossa", note: `La tua lavatrice non ha «Colorati»: per colorati sintetici o misti usa Lava/Indossa a ${t}. I colori li proteggono la temperatura bassa, il detersivo per colorati e gli acchiappacolore, non il nome del programma.` }
      : { name: "Cotone", note: `La tua lavatrice non ha «Colorati»: Cotone con la temperatura a ${t}. I colori li proteggono la temperatura bassa, il detersivo per colorati e gli acchiappacolore, non il nome del programma.` };
    case "scuri": return { name: "Jeans/Scuri", note: `Imposta ${t}.` };
    case "sport": return outdoor
      ? { name: "Capi outdoor", note: `Per membrane, softshell e pile: tanta acqua, movimento delicato e poca centrifuga. Imposta ${t}.` }
      : { name: "Lava/Indossa", note: `La tua lavatrice non ha «Sport»: Lava/Indossa a ${t}, che tratta i sintetici con movimento moderato.` };
    case "delicati": return { name: "Delicati", note: `Imposta ${t}.` };
    case "lana": return { name: "Lana", note: "" };
    case "mano": return { name: "Lana", note: "Il simbolo della mano accanto a Lana vuol dire che il programma va bene anche per i capi da lavare a mano, come la seta." };
    case "piumini": return { name: "Delicati", note: "La tua lavatrice non ha «Piumini»: Delicati, poi un ciclo «Solo risciacquo» in più, perché la piuma trattiene il detersivo." };
  }
  return { name: P.name, note: "" };
}

const BASKET_CARDS = {
  bianchi: ["ossigeno", "sbiancanti", "sessanta"],
  chiari: ["sbiancanti", "acchiappacolore"],
  colorati: ["acchiappacolore", "test_colore"],
  scuri: ["neri_grigi", "rovescio"],
  spugna_chiara: ["ammorbidente", "sessanta", "pelucchi"],
  spugna_col: ["ammorbidente", "sessanta", "pelucchi"],
  sport: ["sport_odori", "microplastiche"],
  delicati: ["viscosa", "centrifuga"],
  lana: ["lana_feltro", "enzimi"],
  mano: ["enzimi", "lana_feltro"],
  piumini: ["piumini"],
  stinge: ["test_colore", "sale_colori", "acchiappacolore"],
  pesante: ["carico", "tensioattivi"],
  nolav: []
};

const has = (it, tag) => (GARMENTS[it.g]?.tags || []).includes(tag);
const colorGroup = it => COLORS[it.color]?.group || "colorato";
const lc = s => s.charAt(0).toLowerCase() + s.slice(1);
const cap0 = s => s.charAt(0).toUpperCase() + s.slice(1);
const itemW = it => (GARMENTS[it.g]?.w || 200) * (it.qty || 1);

function itemMaxT(it) {
  let t = FIBERS[it.fiber] ? FIBERS[it.fiber].maxT : 40;
  if (it.flags.elastan) t = Math.min(t, 40);
  if (it.flags.stampa) t = Math.min(t, 40);
  if (it.label && /^\d+$/.test(it.label)) t = Math.min(t, +it.label);
  if (it.label === "mano") t = Math.min(t, 30);
  return t;
}
function itemSpin(it) {
  let s = FIBERS[it.fiber] ? FIBERS[it.fiber].spin : 800;
  if (it.flags.elastan) s = Math.min(s, 1000);
  if (it.label === "mano") s = Math.min(s, 400);
  if (has(it, "lingerie")) s = Math.min(s, 600);
  return s;
}
const snapDown = (v, steps) => steps.filter(s => s <= v).pop() ?? steps[0];

// ───────────────────────────── SMISTAMENTO ─────────────────────────────
function sortItem(it) {
  const G = GARMENTS[it.g], F = FIBERS[it.fiber], C = COLORS[it.color];
  const grp = colorGroup(it);
  const gname = G.name, col = lc(C.name), fib = lc(F.name);
  const out = (basket, why, cards) => ({ basket, why, notes: itemNotes(it, basket), cards: cards || BASKET_CARDS[basket] || [] });

  if (it.label === "no") return out("nolav", "Sull'etichetta c'è la vaschetta barrata: niente acqua. Il tessuto, le imbottiture o le finiture non lo reggerebbero. Cerca il cerchio sull'etichetta: ti dice quale pulizia professionale chiedere in tintoria.");
  if (it.fiber === "pelle" && it.g === "scarpe") return out("nolav", "Le scarpe di pelle non vanno in acqua: perderebbero gli oli che le tengono morbide e asciugando si crepano. Si puliscono a mano, con spazzola, panno appena umido e crema: trovi la guida nella Bacinella.", ["restringimento"]);
  if (it.fiber === "pelle") return out("nolav", "La pelle in acqua perde gli oli che la tengono morbida: asciugando si irrigidisce, si crepa e si restringe. Va in una tintoria che tratta la pelle.");

  if (it.fiber === "lana" || it.fiber === "cashmere")
    return out("lana", `${gname} in ${fib}: è cheratina, la stessa proteina dei capelli. Con acqua calda e movimento le scaglie della fibra si agganciano tra loro e il capo infeltrisce, in modo irreversibile. Serve il programma lana: freddo, movimento minimo, detersivo senza enzimi.`);

  if (it.fiber === "seta")
    return out("mano", "La seta è fibroina, una proteina: la attaccano gli enzimi proteasi, i detersivi alcalini, il calore e lo sfregamento, e bagnata è più fragile. Lavaggio a mano o programma seta, a freddo.");
  if (it.label === "mano")
    return out("mano", "L'etichetta mostra la mano nella vaschetta: acqua al massimo tiepida, niente sfregamenti né centrifuga forte. Il programma lana o 'a mano' della lavatrice è un sostituto valido.");

  if (it.fiber === "piuma")
    return out("piumini", "La piuma ha bisogno di spazio per gonfiarsi, di tanti risciacqui e di un'asciugatura lunga: un piumino alla volta, con detersivo neutro e senza ammorbidente.");

  if (it.g === "zaino")
    return out("pesante", "Lo zaino ha imbottiture, schienale e spesso un rivestimento impermeabile che in lavatrice si deformano e si sfaldano. Meglio a mano, a zone, con spugna e spazzolino: la guida è nella Bacinella. Solo se l'etichetta lo permette, in lavatrice da solo, in un sacco, a 30°C.", ["mano_o_lavatrice", "dose"]);
  if (has(it, "aparte"))
    return out("pesante", "Le scarpe sono pesanti e rigide: battono contro il cestello e strapazzano gli altri capi. In lavatrice vanno da sole, in un sacchetto, a 30°C, con un paio di asciugamani vecchi per attutire e senza lacci né solette. Più ecologico e più delicato: a mano con spazzola e poca acqua, guida nella Bacinella.", ["spugne", "mano_o_lavatrice"]);
  if (it.flags.pesante)
    return out("pesante", "Terra, fango e grasso si staccano in acqua, si ridepositano sugli altri capi e consumano gran parte del detersivo. Spazzola via lo sporco secco e lava a parte.");
  if (it.flags.peli)
    return out("pesante", "In acqua i peli si staccano e si attaccano agli altri capi, soprattutto ai sintetici carichi di elettricità statica. Toglili prima con un rullo adesivo o un guanto di gomma, poi lava a parte.");

  if (it.flags.nuovo && (C.hot || grp === "scuro"))
    return out("stinge", `${gname} ${col}, nuovo: i capi di colore intenso contengono spesso colorante in eccesso, non fissato, che si libera nei primi lavaggi e finirebbe sugli altri capi. Fai il test del cotton fioc: se colora, 2–3 lavaggi da solo o con capi dello stesso colore, a freddo, con un acchiappacolore.`);

  if (it.fiber === "membrana")
    return out("sport", "La membrana impermeabile e traspirante ha pori microscopici: l'ammorbidente li ostruisce e il calore danneggia le cuciture termosaldate. Programma sport o sintetici a 30°C, detersivo liquido, zip chiuse.");
  if (has(it, "sport") || it.fiber === "tecnico") {
    if (it.g === "costume")
      return out("delicati", "Il costume è ricchissimo di elastan, che teme calore, cloro e sfregamenti: retina e programma delicati a 30°C, oppure a mano. Sciacqualo con acqua dolce appena torni dal mare o dalla piscina.");
    return out("sport", "Il tessuto tecnico è oleofilo: trattiene il sebo, che a bassa temperatura resta e puzza. La sua trama porta via il sudore, e l'ammorbidente la otturerebbe. Lavaggio a 30–40°C, detersivo enzimatico, niente ammorbidente.");
  }

  if (has(it, "lingerie"))
    return out("delicati", `${gname}: ferretti, gancetti, pizzi ed elastici si deformano con il rotolamento e la centrifuga alta, e i gancetti aperti si agganciano agli altri capi. In retina, nel carico dei delicati.`);
  if (it.fiber === "viscosa")
    return out("delicati", "La viscosa è cellulosa rigenerata: bagnata perde circa metà della sua resistenza e si deforma o si restringe facilmente. Delicati a 30°C, centrifuga bassa, in retina.");
  if (it.fiber === "acrilico")
    return out("delicati", "L'acrilico si deforma col calore e fa pallini con lo sfregamento: programma delicati o lana, 30°C, centrifuga bassa.");
  if (it.flags.decorazioni)
    return out("delicati", "Paillettes, perline e applicazioni si staccano con l'azione meccanica e graffiano gli altri capi: al rovescio, in retina, programma delicati.");

  if (has(it, "spugna")) {
    const light = grp === "bianco" || grp === "chiaro";
    const base = it.g === "strofinacci"
      ? "Gli strofinacci raccolgono residui di cibo e batteri della cucina: vanno lavati a temperatura igienizzante, senza ammorbidente, insieme alla spugna."
      : `${gname}: la spugna perde pelucchi, va lavata a temperatura igienizzante e senza ammorbidente, che le toglierebbe assorbenza. Meglio un carico tutto suo`;
    if (light) return out("spugna_chiara", it.g === "strofinacci" ? base + " Essendo chiari, a 60°C." : base + ", a 60°C.");
    return out("spugna_col", it.g === "strofinacci" ? base + " Essendo colorati, con la spugna colorata." : base + ": i colori della spugna spesso reggono i 40–60°C, ma non insieme ai bianchi.");
  }

  if (has(it, "lavabile")) {
    const b = { bianco: "bianchi", chiaro: "chiari", colorato: "colorati", scuro: "scuri" }[grp];
    const what = it.g === "assorbente" ? "il sangue mestruale, fatto di proteine che il calore coagulerebbe nella fibra" : "le perdite, muco e proteine che seccando aderiscono alla fibra";
    const temp = grp === "bianco" ? "60°C" : grp === "chiaro" ? "40–60°C, come l'etichetta consente" : "40°C con ossigeno attivo";
    return out(b, `${gname} in ${fib}: prima un risciacquo in acqua fredda per togliere ${what}. Poi, pulito, va con l'intimo nella cesta ${BASKETS[b].name.toLowerCase()}, a ${temp}: prima si toglie a freddo, poi si igienizza a caldo. Niente ammorbidente, che con il suo film idrofobo ridurrebbe l'assorbenza.`, ["lavabili", "sangue", "ammorbidente"]);
  }

  const cellul = ["cotone", "lino", "misto", "denim"].includes(it.fiber);
  if (grp === "bianco") {
    const extra = it.g === "camice" ? " Per una divisa da reparto è proprio quello che serve: 60°C se l'etichetta lo consente." : "";
    return out("bianchi", cellul
      ? `${gname} bianco in ${fib}: la cellulosa regge calore e ossigeno attivo, quindi puoi lavarlo a 40–60°C con un detersivo in polvere che contiene sbiancanti. Con i colorati assorbirebbe il colorante libero e ingrigirebbe.${extra}`
      : `${gname} bianco in ${fib}: va con i bianchi per non prendere colore dagli altri, ma essendo sintetico la temperatura del carico sarà limitata dalla fibra.`);
  }
  if (grp === "chiaro")
    return out("chiari", `${C.name}: i colori tenui contengono poco colorante, quindi ne perdono poco, ma lo assorbono facilmente dagli altri capi. Gli sbiancanti ottici del detersivo in polvere ne altererebbero la tinta: meglio un detersivo per colorati a 30–40°C.`);
  if (grp === "colorato") {
    let w = it.color === "fantasia_c"
      ? "Una fantasia su fondo chiaro contiene coloranti diversi: col bianco rischieresti di macchiarlo, con gli scuri di sporcare il fondo chiaro. Il suo posto è tra i colorati, a 30°C."
      : `${C.name}: colore medio o vivace. A 30°C il colorante diffonde poco fuori dalla fibra; con bianchi e chiari quello libero li macchierebbe, con gli scuri non si vedrebbe ma arriverebbero pelucchi e usura.`;
    if (C.hot) w += " Rosso, arancio e fucsia sono i colori che stingono di più: un acchiappacolore nel cestello non guasta.";
    return out("colorati", w);
  }
  if (it.fiber === "denim")
    return out("scuri", "Il denim è tinto con l'indaco, un colorante che sta soprattutto sulla superficie del filo: per questo stinge e sbiadisce dove sfrega. Al rovescio, 30°C, zip chiusa, pochi giri.");
  return out("scuri", `${C.name}: i coloranti scuri sono concentrati e ne rilasciano di più, e sugli scuri si vede ogni pelucchio e ogni segno di usura. Al rovescio, 30°C, pochi giri, detersivo per scuri.`);
}

function itemNotes(it, basket) {
  const n = [];
  const G = GARMENTS[it.g];
  if (has(it, "rovescio") || colorGroup(it) === "scuro" || it.flags.stampa) n.push("Lavalo al rovescio.");
  if (has(it, "bottoni")) n.push("Sbottonalo: le asole tirate in centrifuga si sfilacciano.");
  if (has(it, "zip")) n.push("Chiudi la zip: aperta graffia gli altri capi.");
  if (has(it, "chiudi")) n.push("Chiudilo, così i capi piccoli non ci finiscono dentro.");
  if (has(it, "lavabile")) {
    n.push("Prima del cesto: risciacquo in acqua fredda finché l'acqua esce quasi limpida.");
    n.push("Chiudi i bottoncini a pressione e mettilo in una retina: è piccolo e si perde, e le alette aperte si agganciano agli altri capi.");
    n.push("Se ha uno strato impermeabile (PUL): massimo 60°C, niente asciugatrice calda, niente candeggina.");
  }
  if ((has(it, "retina") || it.flags.decorazioni) && !has(it, "lavabile")) n.push("Mettilo in una retina.");
  if (it.flags.elastan) n.push("Contiene elastan: al massimo 40°C, niente cloro, niente asciugatrice calda.");
  if (it.flags.stampa) n.push("Stampa: niente ferro sopra e al massimo 40°C.");
  if (it.label && /^\d+$/.test(it.label) && BASKETS[basket] && +it.label < BASKETS[basket].temp)
    n.push(`L'etichetta dice al massimo ${it.label}°C: in questo carico la temperatura scenderà per tutti.`);
  if (has(it, "cede")) n.push("Perde pelucchi: tienilo lontano da pile, velluto e sintetici scuri.");
  if (has(it, "attira")) n.push("Attira i pelucchi: lontano da spugna e felpe nuove.");
  if (isMagnet(it)) n.push("Nylon chiaro: è la fibra che prende più colore dagli altri capi. Mai con scuri, jeans o capi nuovi; con i colorati, due acchiappacolore.");
  if (has(it, "noAmm") && !has(it, "spugna") && !has(it, "lavabile")) n.push("Niente ammorbidente.");
  if (it.flags.macchia && STAINS[it.flags.macchia]) n.push(`Ha una macchia di ${lc(STAINS[it.flags.macchia].name)}: trattala prima del lavaggio. Trovi i passi nella lavatrice.`);
  if (it.flags.sporco === "poco" && !has(it, "igiene") && !has(it, "sport")) n.push("È poco sporco: forse basta arieggiarlo e smacchiare localmente?");
  if (it.flags.nuovo && basket !== "stinge" && colorGroup(it) !== "bianco") n.push("Capo nuovo: fai il test del cotton fioc prima del primo lavaggio.");
  if (it.g === "costume") n.push("Il cloro della piscina degrada l'elastan: sciacqualo subito.");
  return n;
}

// Distrattori plausibili per la modalità quiz
function quizOptions(it, correct) {
  const grp = colorGroup(it);
  const byColor = { bianco: "bianchi", chiaro: "chiari", colorato: "colorati", scuro: "scuri" }[grp];
  const pool = [byColor, "delicati", "stinge", "colorati", "scuri", "bianchi", "chiari", "sport", "lana", "spugna_chiara", "pesante"];
  const seen = new Set([correct]);
  const opts = [];
  for (const b of pool) { if (opts.length >= 3) break; if (b && !seen.has(b)) { seen.add(b); opts.push(b); } }
  opts.push(correct);
  for (let i = opts.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [opts[i], opts[j]] = [opts[j], opts[i]]; }
  return opts;
}

// ───────────────────────────── COMPATIBILITÀ ─────────────────────────────
// Due dimensioni indipendenti: il colore (chi può macchiare chi) e il tessuto (quale programma regge).
// Il livello di una coppia è il peggiore dei due.
const LEVELS = { ok: 0, lieve: 1, forte: 3, no: 99 };
const LEVEL_NAME = { ok: "va bene", lieve: "piccolo compromesso", forte: "compromesso forte", no: "da evitare" };
const FABRIC = { bianchi: "cot", chiari: "cot", colorati: "cot", scuri: "cot", stinge: "cot", spugna_chiara: "spu", spugna_col: "spu", sport: "sin", delicati: "del", lana: "lan", mano: "lan", piumini: "piu", pesante: "pes", nolav: "nol" };
const DEFAULT_TONE = { bianchi: "W", chiari: "L", colorati: "C", scuri: "D", spugna_chiara: "W", spugna_col: "C", stinge: "C", sport: "C", delicati: "C", lana: "C", mano: "L", piumini: "D", pesante: "C", nolav: "C" };
const TONE_RANK = { W: 0, L: 1, C: 2, D: 3 };
function basketTone(k, its) {
  if (!its || !its.length) return DEFAULT_TONE[k] || "C";
  const t = { bianco: "W", chiaro: "L", colorato: "C", scuro: "D" };
  return its.map(it => t[colorGroup(it)]).reduce((a, b) => TONE_RANK[b] > TONE_RANK[a] ? b : a, "W");
}
const TONE_PAIRS = {
  "W|L": ["ok",    "Capi bianchi e capi chiari stanno bene insieme a 40°C con un detersivo liquido: i pastelli non vogliono gli sbiancanti ottici della polvere."],
  "L|C": ["lieve", "Capi chiari e capi colorati: 30°C, detersivo per colorati e un acchiappacolore. A freddo il colorante diffonde poco fuori dalla fibra."],
  "C|D": ["lieve", "Capi colorati e capi scuri: 30°C, scuri al rovescio, un acchiappacolore."],
  "W|C": ["forte", "I capi bianchi prendono un po' del colorante libero e col tempo ingrigiscono: 30°C, detersivo per colorati, due acchiappacolore. Ogni tanto concedi ai bianchi un lavaggio da soli a 60°C."],
  "L|D": ["forte", "I capi chiari rischiano colore e pelucchi di quelli scuri: 30°C, scuri al rovescio, due acchiappacolore."],
  "W|D": ["forte", "Bianchi con capi scuri è il compromesso più costoso: a 30°C con due acchiappacolore va bene ogni tanto, ma come abitudine i bianchi ingrigiscono."]
};
const FABRIC_PAIRS = {
  "cot|spu": ["lieve", "Spugna e capi lisci: niente ammorbidente per nessuno. La spugna bagnata è pesante e ruvida: qualche pelucchio e un po' di attrito sui capi lisci."],
  "cot|sin": ["lieve", "Con i tecnici: niente ammorbidente per tutto il carico e centrifuga a 800, il cotone esce un po' più umido."],
  "cot|del": ["lieve", "I delicati vanno in retina e il carico passa a Misti 30°C con centrifuga bassa: lo sporco più ostinato viene tolto un po' meno."],
  "sin|spu": ["forte", "La spugna perde pelucchi e i tecnici li attirano; in più la spugna rinuncia ai 60°C."],
  "del|spu": ["no",    "La spugna pesante in un programma delicato non si lava bene e riempie di pelucchi i capi fragili."],
  "del|sin": ["ok",    "Tecnici e delicati reggono lo stesso programma: 30°C, poca centrifuga, niente ammorbidente."],
  "lan|lan": ["ok",    "Lana e seta reggono lo stesso programma lana o a mano, freddo e lento."]
};
const FABRIC_SOLO = {
  lan: "La lana vuole il suo programma quasi immobile: con altri capi infeltrisce, oppure gli altri restano sporchi. Se sono pochi capi, lavali a mano.",
  piu: "Il piumino ha bisogno di spazio per gonfiarsi e di tanti risciacqui: va da solo.",
  pes: "Terra, grasso, peli e scarpe sporcherebbero gli altri capi: questo carico va da solo.",
  nol: "Questi capi non vanno in lavatrice."
};
const worse = (x, y) => LEVELS[y[0]] > LEVELS[x[0]] ? y : x;
function fabricPair(fa, fb) {
  if (fa === fb) return fa === "lan" ? FABRIC_PAIRS["lan|lan"] : ["ok", ""];
  const k = [fa, fb].sort().join("|");
  if (FABRIC_PAIRS[k]) return FABRIC_PAIRS[k];
  const solo = [fa, fb].find(f => FABRIC_SOLO[f]);
  if (solo) return ["no", FABRIC_SOLO[solo]];
  return ["lieve", ""];
}
function tonePair(ta, tb) {
  if (ta === tb) return ["ok", ""];
  const k = [ta, tb].sort((x, y) => TONE_RANK[x] - TONE_RANK[y]).join("|");
  return TONE_PAIRS[k] || ["lieve", ""];
}
function bleedPair(tb, other, to) {
  if (other === "stinge") return ["ok", ""];
  if (TONE_RANK[to] <= 1) return ["no", "Il colorante libero dei capi nuovi macchierebbe bianchi e chiari."];
  if (tb === "D" && to === "D") return ["lieve", "I capi nuovi scuri stingono ancora, ma insieme agli altri scuri, a freddo e con due acchiappacolore, il colore libero non si nota."];
  return ["forte", "Un capo nuovo di colore intenso rilascia colorante: solo a freddo, con due acchiappacolore e con colori simili."];
}
// Quarta dimensione: pelucchi e attrito.
// La spugna perde fibre e, bagnata, diventa pesante e ruvida: i suoi ricci agganciano le fibre dei capi lisci
// e le tirano fuori dal filato, come il velcro su un maglione. Sugli scuri si vede tutto, pelucchi e pallini.
// Chi cede (spugna, felpe) contro chi attira (pile, microfibra) è sempre un compromesso forte.
const LINT_DARK = "Spugna e scuri: la spugna perde fibre e, bagnata e pesante, sfrega i capi lisci come il velcro su un maglione. Sugli scuri si vedono sia i pelucchi sia i pallini. Meglio la spugna con i colorati o da sola a 60°C; se li unisci, scuri al rovescio, cestello non stipato, centrifuga bassa.";
const LINT_ATTRACT = "Qui c'è chi perde pelucchi (spugna, felpe) e chi li attira (pile, microfibra): l'elettricità statica e la trama del sintetico li trattengono, e non vanno più via.";
function lintPair(a, b, ta, tb, map) {
  const ia = (map && map[a]) || [], ib = (map && map[b]) || [];
  const dark = (k, t) => FABRIC[k] === "cot" && t === "D";
  if ((FABRIC[a] === "spu" && dark(b, tb)) || (FABRIC[b] === "spu" && dark(a, ta))) return ["forte", LINT_DARK];
  const sheds = (k, its) => FABRIC[k] === "spu" || its.some(it => has(it, "cede"));
  const attracts = its => its.some(it => has(it, "attira"));
  if ((sheds(a, ia) && attracts(ib)) || (sheds(b, ib) && attracts(ia))) return ["forte", LINT_ATTRACT];
  return ["ok", ""];
}
// Il nylon chiaro è una calamita per il colorante: i gruppi amminici della poliammide, carichi positivamente,
// legano i coloranti anionici liberi nell'acqua, come un acchiappacolore. Con scuri e capi che stingono: da evitare.
const DYE_MAGNET = ["poliammide", "membrana"];
const isMagnet = it => DYE_MAGNET.includes(it.fiber) && ["bianco", "chiaro"].includes(colorGroup(it));
const MAGNET_DARK = "Nylon chiaro con scuri o capi che stingono: la poliammide lega il colorante libero come un acchiappacolore, e quando i foglietti sono saturi continua a prenderlo lei. Il grigio e il beige virano al giallastro o al grigio sporco, e non si torna indietro facilmente. Lavalo con i chiari.";
const MAGNET_COL = "Nylon chiaro con capi colorati: la poliammide prende il colorante libero più di qualunque altra fibra. 30°C e due acchiappacolore, oppure lavalo con i chiari.";
function magnetPair(a, b, ta, tb, map) {
  if (!map) return ["ok", ""];
  for (const [x, y, ty] of [[a, b, tb], [b, a, ta]]) {
    if (!(map[x] || []).some(isMagnet)) continue;
    if (y === "stinge" || ty === "D") return ["no", MAGNET_DARK];
    if (ty === "C") return ["forte", MAGNET_COL];
  }
  return ["ok", ""];
}
// a, b: chiavi delle ceste · map: capi per cesta (facoltativo)
function compatPair(a, b, map) {
  if (a === b) return { level: "ok", msgs: [] };
  const ta = basketTone(a, map && map[a]), tb = basketTone(b, map && map[b]);
  let tone;
  if (a === "stinge") tone = bleedPair(ta, b, tb);
  else if (b === "stinge") tone = bleedPair(tb, a, ta);
  else tone = tonePair(ta, tb);
  tone = worse(tone, magnetPair(a, b, ta, tb, map));
  const fab = fabricPair(FABRIC[a], FABRIC[b]);
  // terza dimensione: chi ha bisogno dei 60°C per l'igiene li perde?
  let heat = ["ok", ""];
  if (map && map[a] && map[b] && fab[0] !== "no") {
    const ta60 = recTemp(a, map[a]) >= 60, tb60 = recTemp(b, map[b]) >= 60;
    if (ta60 !== tb60) {
      const hot = ta60 ? a : b;
      heat = map[hot].some(it => has(it, "lavabile"))
        ? ["forte", `La cesta «${BASKETS[hot].name}» contiene assorbenti lavabili e vorrebbe 60°C. A 30–40°C, dopo il risciacquo freddo, detersivo e risciacqui li puliscono bene per l'uso personale; ogni tanto concedi loro un lavaggio a 60°C con l'intimo chiaro.`]
        : ["lieve", `La cesta «${BASKETS[hot].name}» vorrebbe 60°C per l'igiene: insieme si scende a 40°C o meno. Con l'ossigeno attivo l'igiene resta buona per l'uso quotidiano.`];
    }
  }
  const lint = fab[0] === "no" ? ["ok", ""] : lintPair(a, b, ta, tb, map);
  const w = worse(worse(worse(tone, fab), heat), lint);
  const msgs = [];
  if (fab[0] === "no") msgs.push({ level: "no", text: fab[1] });
  else {
    if (tone[1]) msgs.push({ level: tone[0], text: tone[1] });
    // il messaggio su pelucchi e attrito sostituisce quello generico sul tessuto, se è più grave
    if (lint[1] && LEVELS[lint[0]] >= LEVELS[fab[0]]) msgs.push({ level: lint[0], text: lint[1] });
    else {
      if (fab[1]) msgs.push({ level: fab[0], text: fab[1] });
      if (lint[1]) msgs.push({ level: lint[0], text: lint[1] });
    }
    if (heat[1]) msgs.push({ level: heat[0], text: heat[1] });
  }
  return { level: w[0], msgs };
}
function compatLoad(keys, map) {
  let level = "ok", cost = 0; const msgs = [];
  for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) {
    const r = compatPair(keys[i], keys[j], map);
    if (LEVELS[r.level] > LEVELS[level]) level = r.level;
    cost += LEVELS[r.level];
    for (const m of r.msgs) if (!msgs.some(x => x.text === m.text)) msgs.push({ ...m, a: keys[i], b: keys[j] });
  }
  msgs.sort((x, y) => LEVELS[y.level] - LEVELS[x.level]);
  return { level, msgs, cost };
}
// Quanto si può riempire il cestello per un carico che contiene queste ceste
function groupCapF(keys) {
  const f = new Set(keys.map(k => FABRIC[k]));
  if (f.has("lan")) return keys.every(k => k === "mano") ? 0.15 : 0.25;
  if (f.has("piu")) return 0.3;
  if (f.has("del") || f.has("sin")) return (f.has("cot") || f.has("spu")) ? 0.5 : (f.has("del") ? 0.35 : 0.5);
  return 1;
}

// ───────────────────────────── PIANO: MENO LAVATRICI ─────────────────────────────
// Divide le ceste nel minor numero di lavatrici possibile, rispettando il livello di compromesso
// scelto e la capienza del cestello. Ricerca esatta su tutti i raggruppamenti (le ceste sono al massimo 13).
const PLAN_MODES = {
  min:        { name: "Meno lavatrici", allow: LEVELS.forte, text: "Accetta anche i compromessi forti, come bianchi e colori insieme a 30°C con due acchiappacolore. Il minimo di acqua, energia e tempo." },
  equilibrio: { name: "Equilibrio",     allow: LEVELS.lieve, text: "Solo piccoli compromessi: chiari con colorati, colorati con scuri, delicati in retina. I bianchi restano tra loro." },
  cura:       { name: "Massima cura",   allow: LEVELS.ok,    text: "Nessun compromesso: ogni capo nel suo programma ideale, a costo di più lavaggi." }
};
function planLoads(map, settings, mode) {
  const allow = (PLAN_MODES[mode] || PLAN_MODES.min).allow;
  const keys = BASKET_ORDER.filter(k => map[k] && map[k].length && k !== "nolav");
  const n = keys.length, N = 1 << n;
  const kg = keys.map(k => map[k].reduce((s, it) => s + itemW(it), 0) / 1000);
  const P = keys.map((a, i) => keys.map((b, j) => j > i ? LEVELS[compatPair(a, b, map).level] : 0));
  const qty = keys.map(k => map[k].reduce((s, it) => s + (it.qty || 1), 0));
  const feas = new Uint8Array(N), loads = new Uint8Array(N), pen = new Uint16Array(N), hand = new Uint8Array(N);
  for (let m = 1; m < N; m++) {
    let ok = true, p = 0, w = 0, q = 0; const ks = [];
    for (let i = 0; i < n && ok; i++) if (m >> i & 1) {
      ks.push(keys[i]); w += kg[i]; q += qty[i];
      for (let j = i + 1; j < n; j++) if (m >> j & 1) { if (P[i][j] > allow) { ok = false; break; } p += P[i][j]; }
    }
    if (!ok) continue;
    feas[m] = 1; pen[m] = p;
    // pochi capi di lana o seta, o uno-due capi nuovi che stingono: a mano nel lavandino, non serve una lavatrice
    if ((ks.every(k => k === "lana" || k === "mano") && q <= 3) || (ks.length === 1 && ks[0] === "stinge" && q <= 2)) {
      hand[m] = 1; loads[m] = 0; pen[m] = p + 1;
    } else loads[m] = Math.max(1, Math.ceil(w / (settings.cap * groupCapF(ks)) - 1e-9));
  }
  const best = new Array(N); best[0] = { l: 0, p: 0 };
  for (let m = 1; m < N; m++) {
    const low = m & -m; let b = null;
    for (let s = m; s; s = (s - 1) & m) {
      if (!(s & low) || !feas[s]) continue;
      const r = best[m ^ s];
      const l = r.l + loads[s], p = r.p + pen[s];
      if (!b || l < b.l || (l === b.l && p < b.p)) b = { l, p, s };
    }
    best[m] = b;
  }
  const groups = [];
  for (let m = N - 1; m > 0; m = m ^ best[m].s) {
    const s = best[m].s;
    const ks = keys.filter((k, i) => s >> i & 1);
    const its = ks.flatMap(k => map[k]);
    const q = its.reduce((t, it) => t + (it.qty || 1), 0);
    groups.push({ keys: ks, kg: ks.reduce((t, k) => t + kg[keys.indexOf(k)], 0), n: loads[s], qty: q, hand: !!hand[s], ...compatLoad(ks, map) });
  }
  groups.sort((x, y) => BASKET_ORDER.indexOf(x.keys[0]) - BASKET_ORDER.indexOf(y.keys[0]));
  const machine = groups.filter(g => !g.hand);
  return {
    mode, loads: machine, hand: groups.filter(g => g.hand),
    count: machine.reduce((t, g) => t + g.n, 0),
    nolav: map.nolav || []
  };
}

// ───────────────────────────── RICETTA ─────────────────────────────
const owned = (pantry, id) => !!(pantry[id] && pantry[id].have);
const doseOf = (pantry, id) => (pantry[id] && pantry[id].dose != null && pantry[id].dose !== "") ? +pantry[id].dose : PRODUCTS[id].dose;
const round5 = v => Math.max(5, Math.round(v / 5) * 5);
const ENZYMATIC = ["polvere", "liq_univ", "liq_colori", "liq_scuri", "sport", "eco", "capsule"];
const fmt = (n, d = 1) => n.toLocaleString("it-IT", { maximumFractionDigits: d, minimumFractionDigits: 0 });

function recTemp(k, its) {
  const b = BASKETS[k];
  let t = b.temp;
  if (b.tempIg && its.some(it => has(it, "igiene"))) t = b.tempIg;
  if (k === "bianchi" && its.some(it => it.flags.sporco === "molto")) t = 60;
  return t;
}
function residualMoisture(rpm) {
  const pts = [[400, 80], [600, 75], [800, 70], [1000, 62], [1200, 56], [1400, 50], [1600, 45]];
  for (let i = 0; i < pts.length - 1; i++) {
    const [r1, m1] = pts[i], [r2, m2] = pts[i + 1];
    if (rpm <= r2) return Math.round(m1 + (m2 - m1) * (rpm - r1) / (r2 - r1));
  }
  return 45;
}
const gForce = (rpm, r = 0.25) => Math.pow(2 * Math.PI * rpm / 60, 2) * r / 9.81;
const heatKWh = (litres, tin, T) => litres * 4.186 * Math.max(0, T - tin) / 3600;

function buildRecipe(items, keys, pantry, settings) {
  const R = { keys, items, warnings: [], additives: [], drawer: { I: null, II: [], A: null }, drum: [], missing: [] };
  const gov = DELICACY.find(k => keys.includes(k));
  R.gov = gov;
  const kg = items.reduce((s, it) => s + itemW(it), 0) / 1000;
  const capF = groupCapF(keys);
  const capKg = settings.cap * capF;
  R.kg = kg; R.capKg = capKg; R.fill = capKg ? kg / capKg : 0;

  // sporco del carico
  const soil = items.some(it => it.flags.sporco === "molto") ? "molto" : items.every(it => it.flags.sporco === "poco") ? "poco" : "normale";
  R.soil = soil;
  const igiene = items.filter(it => has(it, "igiene"));
  R.igiene = igiene.length > 0;

  // temperatura
  const byKey = k => items.filter(it => it._b === k);
  let rec = Math.min(...keys.map(k => recTemp(k, byKey(k))));
  const maxT = Math.min(...items.map(itemMaxT));
  let T = Math.min(rec, maxT);
  const tempReasons = [];
  if (rec > maxT) {
    const lim = items.filter(it => itemMaxT(it) === maxT).map(it => lc(GARMENTS[it.g].name));
    tempReasons.push(`Scende a ${snapDown(maxT, TEMP_STEPS)}°C perché ${[...new Set(lim)].slice(0, 3).join(", ")} non regge di più (fibra o etichetta).`);
  }
  if (soil === "molto" && ["chiari", "colorati", "pesante", "spugna_col", "scuri"].includes(gov)) {
    const up = TEMP_STEPS.find(s => s > T);
    if (up && up <= maxT && up <= 60) { T = up; tempReasons.push("Alzata di un gradino perché lo sporco è pesante: il calore aiuta tensioattivi e grassi."); }
  }
  const tones = new Set(items.map(colorGroup));
  R.mixedTones = (tones.has("bianco") || tones.has("chiaro")) && (tones.has("colorato") || tones.has("scuro"));
  if (R.mixedTones && T > 30) { T = 30; tempReasons.push("Scende a 30°C perché nel carico ci sono capi bianchi o chiari insieme a capi colorati o scuri: a freddo il colorante diffonde poco fuori dalla fibra, e l'acchiappacolore cattura quello che si stacca."); }
  T = snapDown(T, TEMP_STEPS);
  R.T = T;
  if (R.igiene && T < 60 && keys.length > 1) {
    const ig = [...new Set(igiene.map(it => lc(GARMENTS[it.g].name)))].slice(0, 3).join(", ");
    tempReasons.push(`Compromesso: ${ig} lavati a ${T}°C invece di 60°C. Per l'uso quotidiano detersivo e risciacqui bastano; se in casa qualcuno ha un'infezione, lavali a parte a 60°C.`);
  }
  // alternativa eco
  if (soil === "poco" && T >= 40 && !R.igiene) {
    R.ecoT = TEMP_STEPS[TEMP_STEPS.indexOf(T) - 1];
  }
  const tWhy = {
    bianchi: R.igiene && T >= 60 ? "Ci sono capi a contatto con la pelle o con lo sporco di casa: 60°C è la soglia igienica di riferimento, e la cellulosa bianca la regge." : "Per bianchi normalmente sporchi bastano 40°C: enzimi e ossigeno attivo lavorano bene e risparmi quasi metà dell'energia rispetto ai 60°C.",
    chiari: "40°C bastano per lo sporco quotidiano senza far migrare il poco colorante dei pastelli.",
    colorati: T >= 40 ? "40°C perché ci sono capi da igienizzare; con colori solidi va bene, ma aspettati un po' più di sbiadimento." : "30°C: la diffusione del colorante fuori dalla fibra è lenta, e i detersivi moderni lavorano già bene.",
    scuri: "30°C: i coloranti scuri sono concentrati, e il freddo ne limita la migrazione.",
    spugna_chiara: "60°C: asciugamani e strofinacci raccolgono batteri e funghi della pelle e della cucina.",
    spugna_col: T >= 60 ? "60°C per l'igiene: i colori della spugna di solito lo reggono, ma controlla l'etichetta." : "40°C per proteggere i colori: aggiungi ossigeno attivo per avvicinarti all'igiene dei 60°C.",
    sport: "30°C: l'elastan perde elasticità col calore, e il sebo lo attaccano gli enzimi più che la temperatura.",
    delicati: "30°C: viscosa, pizzi ed elastici si deformano con il calore.",
    lana: "30°C al massimo, meglio a freddo: il calore apre le scaglie della lana e prepara il feltro.",
    mano: "Acqua fredda o al massimo tiepida: le fibre proteiche si danneggiano col calore.",
    piumini: "30°C con detersivo neutro: la cheratina della piuma non ama né calore né alcalinità.",
    stinge: "30°C, o anche a freddo: più è fredda l'acqua, meno colorante si libera.",
    pesante: "40°C: abbastanza per sciogliere i grassi senza 'cuocere' le parti proteiche dello sporco."
  };
  R.tempWhy = [tWhy[gov] || "", ...tempReasons].filter(Boolean);

  // programma
  const synthW = items.filter(it => ["sintetica", "sintetica tecnica"].includes(FIBERS[it.fiber]?.fam)).reduce((s, it) => s + itemW(it), 0) / 1000;
  const synth = kg > 0 && synthW / kg > 0.4;
  let pk;
  switch (gov) {
    case "bianchi": case "spugna_chiara": case "spugna_col": pk = T >= 60 ? "cotone" : (settings.eco ? "eco" : "cotone"); break;
    case "chiari": pk = synth ? "misti" : (settings.eco && T >= 40 ? "eco" : "cotone"); break;
    case "colorati": pk = synth ? "misti" : "colorati"; break;
    case "scuri": pk = "scuri"; break;
    case "sport": pk = "sport"; break;
    case "delicati": pk = "delicati"; break;
    case "lana": pk = "lana"; break;
    case "mano": pk = "mano"; break;
    case "piumini": pk = "piumini"; break;
    case "stinge": pk = synth ? "misti" : "colorati"; break;
    case "pesante": pk = items.some(it => it.flags.pesante) ? "intensivo" : "delicati"; break;
    default: pk = "cotone";
  }
  if (gov === "pesante" && items.every(it => has(it, "aparte"))) pk = "delicati";
  if (pk === "eco" && T < 40) pk = R.mixedTones ? "colorati" : "cotone";
  const fabs = new Set(keys.map(k => FABRIC[k]));
  if (["delicati", "sport"].includes(gov) && (fabs.has("cot") || fabs.has("spu"))) pk = "misti";
  if (gov === "stinge" && keys.includes("scuri")) pk = "scuri";
  R.mixed = keys.length > 1;
  R.program = PROGRAMS[pk]; R.pk = pk;
  const dp = dialProgram(pk, items, synth, T, settings);
  R.progName = dp.name; R.progNote = dp.note;
  if (pk === "eco" && T > 40 && !R.igiene) { /* eco gestisce 40-60 */ }

  // centrifuga
  let spin = Math.min(...keys.map(k => BASKETS[k].spin), ...items.map(itemSpin));
  if (items.some(it => it.fiber === "lino")) spin = Math.min(spin, 1000);
  R.spin = snapDown(spin, SPIN_STEPS);
  const sWhy = [];
  if (R.spin >= 1200) sWhy.push("Cotone e spugna reggono una centrifuga alta: escono più asciutti e si asciugano prima.");
  else if (R.spin >= 1000) sWhy.push("Giri medi: un compromesso tra capi asciutti e meno pieghe.");
  else if (R.spin >= 800) sWhy.push("Giri moderati: meno pieghe fissate nei sintetici, meno abrasione sugli scuri.");
  else sWhy.push("Pochi giri: fibre fragili da bagnate, elastici e ferretti non reggerebbero centinaia di g.");
  const limiters = items.filter(it => itemSpin(it) <= R.spin && itemSpin(it) < BASKETS[gov].spin).map(it => lc(GARMENTS[it.g].name));
  if (limiters.length) sWhy.push(`Limitata da: ${[...new Set(limiters)].slice(0, 3).join(", ")}.`);
  R.spinWhy = sWhy;
  R.g = gForce(R.spin); R.moist = residualMoisture(R.spin);

  // detersivo
  const pref = DETERGENT_PREF[gov] || DETERGENT_PREF.colorati;
  const det = pref.find(id => owned(pantry, id));
  const hardF = HARD[settings.hard].f, soilF = SOIL[soil].f, loadF = R.fill < 0.5 ? 0.75 : 1;
  R.detIdeal = pref[0];
  if (det) {
    const P = PRODUCTS[det];
    let amount, unit = P.unit, where;
    if (det === "capsule") {
      const n = (settings.hard === "dura" && (soil === "molto" || kg > 6)) ? 2 : 1;
      amount = n; unit = n === 1 ? "capsula" : "capsule";
      where = "drum";
    } else {
      amount = round5(doseOf(pantry, det) * hardF * soilF * loadF);
      where = "II";
    }
    const why = [];
    why.push(`Base ${doseOf(pantry, det)} ${P.unit} per un carico pieno normale${det === "capsule" ? "" : `, × ${fmt(hardF, 2)} per l'acqua ${HARD[settings.hard].name.toLowerCase()}, × ${fmt(soilF, 2)} per lo sporco (${SOIL[soil].name.toLowerCase()}), × ${fmt(loadF, 2)} per il carico (${Math.round(R.fill * 100)}% del cestello)`}.`);
    if (det === "capsule") why.push("La capsula ha una dose fissa: non puoi adattarla a carico e durezza. Per i mezzi carichi un liquido dosabile spreca meno.");
    if (det !== pref[0]) why.push(`L'ideale sarebbe ${lc(PRODUCTS[pref[0]].name)}, che non hai in dispensa: ${DET_REASON[pref[0]] || ""}`);
    else why.push(`Hai il prodotto giusto: ${DET_REASON[det] || ""}`);
    if (det === "polvere" && T <= 30) why.push("A 30°C la polvere può non sciogliersi del tutto: sciogli la dose in un bicchiere d'acqua tiepida prima di versarla.");
    if (det === "polvere" && ["chiari", "colorati", "spugna_col", "stinge"].includes(gov)) why.push("Attenzione: la polvere contiene sbiancanti ottici e ossigeno attivo, che possono alterare i colori. Se puoi, usa un liquido per colorati.");
    R.detergent = { id: det, amount, unit, where, why };
    if (where === "II") R.drawer.II.push({ id: det, amount, unit });
    else R.drum.push({ id: det, amount, unit, note: "sul fondo del cestello, prima dei capi" });
  } else {
    const anyDet = ["polvere", "liq_univ", "liq_colori", "liq_scuri", "eco", "capsule", "sport"].find(id => owned(pantry, id));
    R.detergent = null;
    if (anyDet && ["lana", "mano", "piumini"].includes(gov)) {
      R.warnings.push(`Il tuo ${lc(PRODUCTS[anyDet].name)} contiene enzimi (proteasi) che attaccano la cheratina e la fibroina: per questo carico serve un detersivo neutro per lana, o in emergenza uno shampoo delicato.`);
    } else if (!anyDet) {
      R.warnings.push(`In dispensa non hai detersivi. Per questo carico l'ideale è ${lc(PRODUCTS[pref[0]].name)}: aggiungilo in Dispensa e la dose comparirà qui.`);
    } else {
      R.warnings.push(`Nessuno dei tuoi detersivi è adatto: per questo carico serve ${lc(PRODUCTS[pref[0]].name)}.`);
    }
    R.missing.push(pref[0]);
  }

  // additivi
  const add = (id, level, amount, where, why) => R.additives.push({ id, level, amount, where, why });
  const noOx = ["lana", "mano", "piumini", "delicati", "scuri", "stinge"].includes(gov) || keys.some(k => ["lana", "mano", "piumini"].includes(k));
  const whiteish = ["bianchi", "spugna_chiara"].includes(gov) || (gov === "pesante" && items.every(it => ["bianco", "chiaro"].includes(colorGroup(it))));
  const tannic = items.some(it => ["vino", "caffe", "frutta", "erba", "cioccolato", "sudore"].includes(it.flags.macchia));
  const percDose = kg < 2.5 ? 15 : kg < 5 ? 20 : 30;
  if (!noOx) {
    const withPowder = R.detergent && R.detergent.id === "polvere";
    if (whiteish) {
      if (owned(pantry, "percarbonato")) {
        if (withPowder && !R.igiene && !tannic) add("percarbonato", "facoltativo", `${percDose} g`, "drum", "Il tuo detersivo in polvere contiene già ossigeno attivo: aggiungine solo se ci sono macchie colorate o vuoi più igiene.");
        else if (T < 40) add("percarbonato", "facoltativo", `${percDose} g`, "drum", "Sotto i 40°C, senza attivatore, l'acqua ossigenata si libera poco: meglio usarlo in un ammollo a 40–50°C.");
        else add("percarbonato", "si", `${percDose} g (${percDose <= 15 ? "1 cucchiaio" : percDose <= 20 ? "1 cucchiaio abbondante" : "2 cucchiai"})`, "drum", "Ossigeno attivo: spegne i pigmenti delle macchie e il giallo, e a 40–60°C contribuisce all'igiene. Nel cestello sotto i capi, o nella vaschetta II se usi la polvere.");
      } else if (!withPowder) R.missing.push("percarbonato");
    } else if (["chiari", "colorati", "spugna_col", "pesante"].includes(gov) && (R.igiene || tannic) && T >= 40 && owned(pantry, "percarbonato")) {
      add("percarbonato", "facoltativo", `${percDose} g`, "drum", R.igiene && T < 60 ? "Con capi da igienizzare a 40°C, l'ossigeno attivo compensa i gradi in meno. È sicuro sulla maggior parte dei colori solidi: prova prima su una cucitura." : "Aiuta sulle macchie colorate. È sicuro sulla maggior parte dei colori solidi: prova prima su una cucitura.");
    }
  }
  if (gov === "sport" || (items.some(it => has(it, "sport")) && !noOx)) {
    if (owned(pantry, "bicarbonato")) add("bicarbonato", "si", "30 g (2 cucchiai)", "drum", "Base debole: neutralizza gli acidi grassi volatili del sudore che danno l'odore di palestra.");
  }
  const groups = new Set(items.map(colorGroup));
  const needCatcher = ["colorati", "scuri", "stinge", "spugna_col"].includes(gov) || keys.length > 1 || items.some(it => it.flags.nuovo && colorGroup(it) !== "bianco") || items.some(it => COLORS[it.color].hot);
  if (needCatcher && !["lana", "mano", "piumini", "bianchi", "spugna_chiara"].includes(gov)) {
    const n = (gov === "stinge" || groups.size > 1) ? 2 : 1;
    if (owned(pantry, "acchiappacolore")) add("acchiappacolore", gov === "stinge" || keys.length > 1 ? "si" : "facoltativo", `${n} ${n === 1 ? "foglio" : "fogli"}`, "drum", "Polimeri cationici che catturano il colorante libero prima che si depositi. Guarda il colore del foglio a fine ciclo: ti dice quanto colore c'era in acqua.");
    else if (gov === "stinge" || keys.length > 1) R.missing.push("acchiappacolore");
  }
  if (owned(pantry, "candeggina") && whiteish) add("candeggina", "no", "", "", "Non serve: ossigeno attivo e temperatura bastano. Se proprio la usi: solo cotone bianco senza elastan, da sola, mai con acido citrico o aceto.");
  if (owned(pantry, "igienizzante") && R.igiene) add("igienizzante", T >= 60 ? "no" : "facoltativo", "dose del flacone", "A", T >= 60 ? "A 60°C è superfluo." : "Ha senso solo per carichi davvero a rischio (malattia in casa) a bassa temperatura: i sali di ammonio quaternario sono tossici per gli organismi acquatici.");
  const retinaItems = items.filter(it => has(it, "retina") || it.flags.decorazioni || it.fiber === "viscosa" || it.g === "calzini");
  if (retinaItems.length) {
    const names = [...new Set(retinaItems.map(it => lc(GARMENTS[it.g].name)))];
    R.retina = names;
    if (!owned(pantry, "retina")) R.missing.push("retina");
  }
  if ((gov === "sport" || synth) && owned(pantry, "filtro")) add("filtro", "si", "", "drum", "Trattiene le microfibre rilasciate dai sintetici.");

  // risciacquo: ammorbidente o acido citrico
  const noSoftReasons = [];
  if (items.some(it => has(it, "spugna"))) noSoftReasons.push("la spugna perderebbe assorbenza");
  if (items.some(it => has(it, "sport") || it.fiber === "tecnico" || it.fiber === "membrana")) noSoftReasons.push("i tessuti tecnici si otturerebbero");
  if (items.some(it => it.g === "microfibra")) noSoftReasons.push("la microfibra smetterebbe di catturare lo sporco");
  if (items.some(it => it.fiber === "piuma")) noSoftReasons.push("le piume si incollerebbero");
  if (items.some(it => has(it, "lavabile"))) noSoftReasons.push("gli assorbenti lavabili perderebbero assorbenza");
  if (["lana", "mano"].includes(gov)) noSoftReasons.push("il detersivo per lana basta, e la fibra non ne ha bisogno");
  const acidOk = !["lana", "mano", "piumini"].includes(gov);
  const rinse = { soft: noSoftReasons.length === 0, why: [] };
  if (noSoftReasons.length) rinse.why.push(`Niente ammorbidente: ${noSoftReasons.join("; ")}.`);
  if (acidOk && owned(pantry, "acido_citrico")) {
    const ml = settings.hard === "dura" ? 100 : settings.hard === "media" ? 80 : 60;
    R.drawer.A = { id: "acido_citrico", amount: ml, unit: "ml" };
    rinse.why.push(`Acido citrico: ${ml} ml nella vaschetta ⚘. Scioglie il calcare e neutralizza i residui alcalini: morbidezza senza pellicole${items.some(it => has(it, "spugna")) ? ", e la spugna resta assorbente" : ""}.`);
    if (rinse.soft && owned(pantry, "ammorbidente")) rinse.why.push("Con l'acido citrico l'ammorbidente non serve: se lo vuoi comunque, mettine metà dose, non entrambi.");
  } else if (acidOk && owned(pantry, "aceto")) {
    R.drawer.A = { id: "aceto", amount: 100, unit: "ml" };
    rinse.why.push("Aceto bianco: 100 ml nella vaschetta ⚘ come anticalcare. Va bene ogni tanto; per l'uso regolare l'acido citrico è più efficace e non ha odore.");
  } else if (rinse.soft && owned(pantry, "ammorbidente")) {
    const ml = round5(doseOf(pantry, "ammorbidente") / 2);
    R.drawer.A = { id: "ammorbidente", amount: ml, unit: "ml" };
    rinse.why.push(`Ammorbidente facoltativo: ${ml} ml, metà della dose indicata, basta per l'effetto e lascia meno residui. In alternativa prova l'acido citrico.`);
  } else if (rinse.soft) {
    rinse.why.push("Non serve niente nella vaschetta ⚘. Se l'acqua è dura, l'acido citrico è l'alternativa ecologica all'ammorbidente.");
    if (settings.hard === "dura") R.missing.push("acido_citrico");
  }
  if (R.drawer.A && owned(pantry, "candeggina") && R.additives.some(a => a.id === "candeggina" && a.level !== "no")) rinse.why.push("Mai acido citrico o aceto se nel lavaggio c'è candeggina: libererebbero cloro.");
  R.rinse = rinse;
  if (soil === "molto" && items.some(it => it.flags.pesante)) R.drawer.I = { note: "Prelavaggio: un terzo della dose nella vaschetta I." };

  // pretrattamenti
  const stainMap = {};
  items.forEach(it => { if (it.flags.macchia && STAINS[it.flags.macchia]) (stainMap[it.flags.macchia] = stainMap[it.flags.macchia] || []).push(lc(GARMENTS[it.g].name)); });
  R.stains = Object.entries(stainMap).map(([id, names]) => ({ id, names: [...new Set(names)] }));

  // checklist
  const ck = ["Svuota le tasche: un fazzoletto di carta dimenticato riempie tutto di pelucchi."];
  const list = tag => [...new Set(items.filter(it => has(it, tag)).map(it => lc(GARMENTS[it.g].name)))];
  if (list("zip").length) ck.push(`Chiudi zip e velcro (${list("zip").join(", ")}).`);
  if (list("bottoni").length) ck.push(`Sbottona ${list("bottoni").join(", ")}: le asole tirate si sfilacciano.`);
  if (list("chiudi").length) ck.push(`Chiudi ${list("chiudi").join(", ")}: altrimenti i capi piccoli ci finiscono dentro.`);
  const rov = [...new Set(items.filter(it => has(it, "rovescio") || colorGroup(it) === "scuro" || it.flags.stampa).map(it => lc(GARMENTS[it.g].name)))];
  if (rov.length) ck.push(`Rovescia ${rov.join(", ")}.`);
  if (R.retina) ck.push(`In retina: ${R.retina.join(", ")}.`);
  if (items.some(it => it.g === "scarpe")) ck.push("Togli lacci e solette, spazzola via la terra.");
  if (items.some(it => has(it, "lavabile"))) ck.push(`${cap0(list("lavabile").join(", "))}: già risciacquati in acqua fredda, bottoncini chiusi, in retina.`);
  if (items.some(it => it.flags.peli)) ck.push("Togli i peli con un rullo adesivo prima di bagnare i capi.");
  if (R.stains.length) ck.push("Pretratta le macchie (qui sotto).");
  if (R.fill > 1) ck.push("Il cestello è troppo pieno: dividi in due lavaggi.");
  else ck.push(capF >= 1 ? "Carica senza pressare: resta lo spazio di un palmo sopra i capi." : `Per questo programma riempi al massimo ${capF >= 0.5 ? "metà" : capF >= 0.3 ? "un terzo" : "un quarto"} del cestello.`);
  R.checklist = ck;

  // energia
  const litres = Math.min(18, Math.max(6, 6 + 1.4 * kg));
  R.litres = Math.round(litres);
  R.kwh = heatKWh(litres, settings.tin, T);
  R.cost = R.kwh * settings.price;
  if (R.ecoT != null) { R.kwhEco = heatKWh(litres, settings.tin, R.ecoT); }
  if (T > 30) R.kwh30 = heatKWh(litres, settings.tin, 30);

  // riempimento
  const pct = Math.round(R.fill * 100);
  if (R.fill > 1) R.fillMsg = `Troppo pieno (${pct}%): i capi non avrebbero spazio per cadere e si laverebbero male. Dividi il carico.`;
  else if (R.fill >= 0.7) R.fillMsg = `Carico pieno (${pct}%): l'acqua scaldata si divide su tanti capi. Ottimo.`;
  else if (R.fill >= 0.4) R.fillMsg = `Carico medio (${pct}%): va bene se non puoi aspettare.`;
  else R.fillMsg = `Carico leggero (${pct}%): consumi quasi la stessa acqua ed energia di un carico pieno. Se puoi, aspetta di avere più capi o unisci una cesta compatibile.`;

  // dopo il lavaggio
  const after = ["Stendi entro 30–60 minuti dalla fine: nei capi bagnati e chiusi i batteri dell'odore di umido si moltiplicano in fretta."];
  if (["bianchi", "spugna_chiara"].includes(gov)) after.push("Al sole se puoi: gli UV sbiancano e igienizzano.");
  if (["colorati", "scuri", "spugna_col", "chiari", "stinge"].includes(gov)) after.push("All'ombra e al rovescio: gli UV spezzano anche i cromofori dei tuoi colori.");
  if (items.some(it => has(it, "spugna"))) after.push("Spugna: sbattila forte prima di stenderla, o 10 minuti di asciugatrice per farla tornare morbida.");
  if (gov === "sport") after.push("Subito all'aria, niente asciugatrice calda: l'elastan oltre i 60°C perde elasticità.");
  if (gov === "delicati") after.push("Su gruccia o in piano, senza strizzare.");
  if (["lana", "mano"].includes(gov)) after.push("Arrotola il capo in un asciugamano per togliere l'acqua, poi in piano all'ombra, riportandolo alla sua forma.");
  if (gov === "piumini") after.push("Asciugatrice a bassa temperatura con 2–3 palline, più cicli, finché è asciutto anche dentro: i grumi umidi ammuffiscono.");
  if (gov === "stinge") after.push("Stendilo separato: anche umido può macchiare i capi vicini sullo stendino.");
  if (pk === "misti" || synth) after.push("I sintetici: scuotili e stendili subito, spesso non serve stirarli.");
  R.after = after;
  return R;
}

const DET_REASON = {
    polvere: "contiene ossigeno attivo e sbiancanti ottici, perfetti per bianchi e spugna chiara.",
    liq_colori: "senza sbiancanti né ossidanti, con polimeri che impediscono al colore di ridepositarsi.",
    liq_scuri: "protegge i coloranti scuri, e le sue cellulasi tagliano i pelucchi che fanno il grigio.",
    liq_univ: "tensioattivi ed enzimi, niente ossidanti: un jolly per quasi tutto.",
    lana: "pH neutro e niente proteasi: non digerisce la cheratina.",
    shampoo: "è fatto per la cheratina dei capelli: in emergenza va bene anche per la lana, in piccola dose.",
    sport: "mirato al sebo trattenuto dal poliestere.",
    eco: "un buon detersivo quotidiano con un impatto ambientale ridotto.",
    capsule: "detersivo liquido concentrato, comodo ma a dose fissa."
};
