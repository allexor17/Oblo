// Oblò · dati: capi, fibre, colori, ceste, prodotti, macchie, simboli delle etichette

const FIBERS = {
  cotone:     { name: "Cotone",                       code: "CO", fam: "cellulosa naturale",  maxT: 95, spin: 1400 },
  lino:       { name: "Lino",                         code: "LI", fam: "cellulosa naturale",  maxT: 60, spin: 1000 },
  denim:      { name: "Denim (cotone)",               code: "CO", fam: "cellulosa naturale",  maxT: 40, spin: 1000 },
  misto:      { name: "Misto cotone-poliestere",      code: "CO + PES", fam: "misto",               maxT: 60, spin: 1000 },
  poliestere: { name: "Poliestere",                   code: "PES", fam: "sintetica",           maxT: 40, spin: 800 },
  poliammide: { name: "Nylon / poliammide",           code: "PA", fam: "sintetica",           maxT: 40, spin: 800 },
  polipropilene: { name: "Polipropilene", code: "PP", fam: "sintetica", maxT: 30, spin: 800 },
  acrilico:   { name: "Acrilico",                     code: "PAN", fam: "sintetica",           maxT: 30, spin: 800 },
  tecnico:    { name: "Tecnico sportivo",             code: "", fam: "sintetica",           maxT: 40, spin: 800 },
  viscosa:    { name: "Viscosa / modal / bambù",      code: "CV · CMD", fam: "cellulosa rigenerata", maxT: 30, spin: 600 },
  lyocell:    { name: "Lyocell / Tencel",             code: "CLY", fam: "cellulosa rigenerata", maxT: 40, spin: 800 },
  lana:       { name: "Lana",                         code: "WO", fam: "proteica (cheratina)", maxT: 30, spin: 600 },
  cashmere:   { name: "Cashmere / alpaca / angora",   code: "WS", fam: "proteica (cheratina)", maxT: 30, spin: 400 },
  seta:       { name: "Seta",                         code: "SE", fam: "proteica (fibroina)",  maxT: 30, spin: 400 },
  piuma:      { name: "Piuma (imbottitura)",          code: "", fam: "proteica (cheratina)", maxT: 30, spin: 600 },
  membrana:   { name: "Membrana impermeabile",        code: "", fam: "sintetica tecnica",    maxT: 30, spin: 600 },
  pelle:      { name: "Pelle / scamosciato",          code: "", fam: "pelle animale",        maxT: 0,  spin: 0 }
};

// tag: rovescio · bottoni · abbottona · zip · retina · piano · igiene · spugna · cede · attira · sport · lingerie · aparte · noAmm · chiudi · impermeabile · imbottito · visiera
const GARMENTS = {
  tshirt:      { name: "T-shirt",                   e: "👕", fiber: "cotone",     w: 160,  tags: [] },
  camicia:     { name: "Camicia",                   e: "👔", fiber: "cotone",     w: 220,  tags: ["bottoni"] },
  top:         { name: "Top / camicetta",           e: "👚", fiber: "viscosa",    w: 150,  tags: [] },
  maglione:    { name: "Maglione",                  e: "🧶", fiber: "lana",       w: 450,  tags: ["piano"] },
  cardigan:    { name: "Cardigan",                  e: "🧶", fiber: "lana",       w: 400,  tags: ["abbottona", "piano", "retina"] },
  canotta:     { name: "Canotta / canottiera",      e: "👕", fiber: "cotone",     w: 100,  tags: [] },
  felpa:       { name: "Felpa",                     e: "🧥", fiber: "misto",      w: 500,  tags: ["rovescio", "cede", "zip"] },
  jeans:       { name: "Jeans",                     e: "👖", fiber: "denim",      w: 650,  tags: ["rovescio", "zip"] },
  pantaloni:   { name: "Pantaloni",                 e: "👖", fiber: "misto",      w: 450,  tags: ["zip"] },
  shorts:      { name: "Pantaloncini",              e: "🩳", fiber: "cotone",     w: 250,  tags: [] },
  tuta:        { name: "Pantaloni della tuta",      e: "👖", fiber: "misto",      w: 400,  tags: ["rovescio", "cede"] },
  sportmaglia: { name: "Maglia sportiva",           e: "🎽", fiber: "tecnico",    w: 150,  tags: ["sport", "rovescio", "noAmm"] },
  leggings:    { name: "Leggings / tuta sportiva",  e: "🎽", fiber: "tecnico",    w: 220,  tags: ["sport", "rovescio", "noAmm"] },
  topsport:    { name: "Reggiseno sportivo",        e: "🎽", fiber: "tecnico",    w: 90,   tags: ["sport", "retina", "noAmm"] },
  termica:     { name: "Maglia termica",            e: "🎽", fiber: "tecnico",    w: 180,  tags: ["sport", "rovescio", "noAmm"] },
  vestito:     { name: "Vestito",                   e: "👗", fiber: "viscosa",    w: 300,  tags: ["zip"] },
  gonna:       { name: "Gonna",                     e: "👗", fiber: "misto",      w: 250,  tags: ["zip"] },
  intimo:      { name: "Slip / boxer",              e: "🩲", fiber: "cotone",     w: 50,   tags: ["igiene"] },
  salvaslip:   { name: "Salvaslip lavabile",        e: "🩹", fiber: "cotone",     w: 12,   tags: ["igiene", "lavabile", "retina", "noAmm"], stain: "perdite" },
  assorbente:  { name: "Assorbente lavabile",       e: "🩹", fiber: "cotone",     w: 35,   tags: ["igiene", "lavabile", "retina", "noAmm"], stain: "mestruo" },
  reggiseno:   { name: "Reggiseno",                 e: "👙", fiber: "poliammide", w: 80,   tags: ["retina", "lingerie"] },
  calzini:     { name: "Calzini (paio)",            e: "🧦", fiber: "misto",      w: 50,   tags: ["igiene", "rovescio"] },
  collant:     { name: "Collant",                   e: "🧦", fiber: "poliammide", w: 40,   tags: ["retina", "lingerie"] },
  pigiama:     { name: "Pigiama",                   e: "👘", fiber: "cotone",     w: 350,  tags: [] },
  costume:     { name: "Costume da bagno",          e: "🩱", fiber: "tecnico",    w: 120,  tags: ["retina", "lingerie", "noAmm"] },
  asciugamano: { name: "Asciugamano viso",          e: "🛁", fiber: "cotone",     w: 250,  tags: ["spugna", "igiene", "cede", "noAmm"] },
  telo:        { name: "Telo bagno",                e: "🛁", fiber: "cotone",     w: 650,  tags: ["spugna", "igiene", "cede", "noAmm"] },
  accappatoio: { name: "Accappatoio",               e: "🥋", fiber: "cotone",     w: 1100, tags: ["spugna", "igiene", "cede", "noAmm"] },
  turbante:    { name: "Asciugamano capelli in microfibra", e: "🧖", fiber: "poliestere", w: 150, tags: ["igiene", "attira", "noAmm"] },
  struccanti:  { name: "Dischetti struccanti lavabili", e: "⚪", fiber: "cotone",  w: 5,    tags: ["igiene", "retina", "noAmm"], stain: "trucco" },
  strofinacci: { name: "Strofinaccio",              e: "🍽️", fiber: "cotone",     w: 80,   tags: ["spugna", "igiene", "noAmm"] },
  tovaglia:    { name: "Tovaglia",                  e: "🍽️", fiber: "cotone",     w: 500,  tags: [] },
  lenzuolo:    { name: "Lenzuolo",                  e: "🛏️", fiber: "cotone",     w: 700,  tags: ["igiene"] },
  federa:      { name: "Federa",                    e: "🛏️", fiber: "cotone",     w: 150,  tags: ["igiene", "chiudi"] },
  copripiumino:{ name: "Copripiumino",              e: "🛏️", fiber: "cotone",     w: 1000, tags: ["igiene", "chiudi"] },
  coprimaterasso:{ name: "Coprimaterasso",          e: "🛏️", fiber: "cotone",     w: 900,  tags: ["igiene"] },
  cuscino:     { name: "Cuscino (guanciale)",       e: "🛏️", fiber: "poliestere", w: 800,  tags: ["imbottito"] },
  trapunta:    { name: "Piumone / trapunta",        e: "🛏️", fiber: "piuma",      w: 2000, tags: ["imbottito"] },
  camice:      { name: "Camice / divisa",           e: "🥼", fiber: "misto",      w: 400,  tags: ["igiene", "bottoni"] },
  giacca:      { name: "Giacca impermeabile",       e: "🧥", fiber: "membrana",   w: 600,  tags: ["zip", "noAmm"] },
  kway:        { name: "K-way / giacca a vento",    e: "🧥", fiber: "poliammide", w: 250,  tags: ["zip", "noAmm", "impermeabile"] },
  piumino:     { name: "Piumino",                   e: "🧥", fiber: "piuma",      w: 900,  tags: ["zip", "noAmm"] },
  pile:        { name: "Pile",                      e: "🧥", fiber: "poliestere", w: 400,  tags: ["attira", "zip"] },
  sciarpa:     { name: "Sciarpa",                   e: "🧣", fiber: "lana",       w: 150,  tags: [] },
  berretto:    { name: "Berretto",                  e: "🧢", fiber: "acrilico",   w: 80,   tags: [] },
  cappellino:  { name: "Cappellino con visiera",    e: "🧢", fiber: "cotone",     w: 100,  tags: ["visiera"] },
  capelli:     { name: "Fascia o elastici per capelli", e: "🎀", fiber: "misto",  w: 20,   tags: ["retina"] },
  guanti:      { name: "Guanti di lana",            e: "🧤", fiber: "lana",       w: 60,   tags: [] },
  microfibra:  { name: "Panno in microfibra",       e: "🧽", fiber: "poliestere", w: 40,   tags: ["attira", "noAmm"] },
  tenda:       { name: "Tenda",                     e: "🪟", fiber: "poliestere", w: 1200, tags: [] },
  scarpe:      { name: "Scarpe",                    e: "👟", fiber: "misto",      w: 700,  tags: ["aparte"] },
  zaino:       { name: "Zaino o borsa di tela",     e: "🎒", fiber: "poliestere", w: 600,  tags: ["aparte"] }
};

// Gruppi del selettore "Che capo è?"
const GARMENT_GROUPS = [
  { name: "Sopra", ids: ["tshirt", "canotta", "camicia", "top", "maglione", "cardigan", "felpa", "vestito", "camice"] },
  { name: "Sotto", ids: ["jeans", "pantaloni", "tuta", "shorts", "gonna"] },
  { name: "Intimo e notte", ids: ["intimo", "reggiseno", "salvaslip", "assorbente", "calzini", "collant", "pigiama"] },
  { name: "Sport", ids: ["sportmaglia", "leggings", "topsport", "termica", "costume"] },
  { name: "Giacche e accessori", ids: ["kway", "giacca", "piumino", "pile", "sciarpa", "berretto", "cappellino", "guanti", "capelli", "scarpe", "zaino"] },
  { name: "Bagno e cura", ids: ["asciugamano", "telo", "accappatoio", "turbante", "struccanti"] },
  { name: "Casa e letto", ids: ["lenzuolo", "federa", "copripiumino", "coprimaterasso", "cuscino", "trapunta", "tovaglia", "strofinacci", "microfibra", "tenda"] }
];

// group: bianco · chiaro · colorato · scuro    hot: tende a stingere
const COLORS = {
  bianco:        { name: "Bianco",             hex: "#FFFFFF", group: "bianco" },
  panna:         { name: "Panna / beige",      hex: "#EFE4CF", group: "chiaro" },
  grigio_chiaro: { name: "Grigio chiaro",      hex: "#CDD3DB", group: "chiaro" },
  rosa_pastello: { name: "Rosa pastello",      hex: "#F4C8D3", group: "chiaro" },
  azzurro_past:  { name: "Azzurro pastello",   hex: "#BEDCF2", group: "chiaro" },
  giallo:        { name: "Giallo",             hex: "#F2CB45", group: "colorato" },
  verde:         { name: "Verde",              hex: "#5BB07B", group: "colorato" },
  azzurro:       { name: "Azzurro",            hex: "#4C97DE", group: "colorato" },
  viola:         { name: "Viola",              hex: "#9163C7", group: "colorato" },
  arancio:       { name: "Arancio",            hex: "#EE8636", group: "colorato", hot: true },
  rosso:         { name: "Rosso",              hex: "#D3313E", group: "colorato", hot: true },
  fucsia:        { name: "Fucsia",             hex: "#D23A8C", group: "colorato", hot: true },
  fantasia_c:    { name: "Fantasia su fondo chiaro", hex: "pattern-light", group: "colorato" },
  blu_scuro:     { name: "Blu scuro",          hex: "#22325F", group: "scuro" },
  verde_scuro:   { name: "Verde scuro",        hex: "#23503D", group: "scuro" },
  bordeaux:      { name: "Bordeaux",           hex: "#6A1D31", group: "scuro", hot: true },
  marrone:       { name: "Marrone",            hex: "#5B3A29", group: "scuro" },
  grigio_scuro:  { name: "Grigio scuro",       hex: "#4A4F58", group: "scuro" },
  nero:          { name: "Nero",               hex: "#1A1A1F", group: "scuro" },
  denim:         { name: "Denim",              hex: "#3C5C8E", group: "scuro", hot: true },
  fantasia_s:    { name: "Fantasia su fondo scuro", hex: "pattern-dark", group: "scuro" }
};

// capF = frazione della capacità nominale (kg di cotone) adatta a quel programma
const BASKETS = {
  bianchi:       { name: "Bianchi",                 sub: "Cotone e lino bianchi: reggono calore e ossigeno attivo",           dot: "#FFFFFF",  temp: 40, tempIg: 60, spin: 1200, capF: 1 },
  chiari:        { name: "Chiari e pastello",       sub: "Colori tenui che temono gli sbiancanti ottici",                     dot: "#F4C8D3",  temp: 40, spin: 1200, capF: 1 },
  colorati:      { name: "Colorati",                sub: "Colori medi e vivaci, a freddo o tiepido",                         dot: "#4C97DE",  temp: 30, tempIg: 40, spin: 1000, capF: 1 },
  scuri:         { name: "Scuri e jeans",           sub: "Neri, blu, denim: al rovescio, 30°C, pochi giri",                   dot: "#22325F",  temp: 30, spin: 800,  capF: 1 },
  spugna_chiara: { name: "Spugna chiara",           sub: "Asciugamani e strofinacci chiari: igiene a 60°C, niente ammorbidente", dot: "#E9F3F9", temp: 60, spin: 1400, capF: 1 },
  spugna_col:    { name: "Spugna colorata",         sub: "Asciugamani colorati: igiene senza perdere il colore",              dot: "#5BB07B",  temp: 40, tempIg: 60, spin: 1400, capF: 1 },
  sport:         { name: "Sport e tecnici",         sub: "Sintetici che trattengono sebo e odori",                            dot: "#2FB5A3",  temp: 30, spin: 800,  capF: 0.5 },
  delicati:      { name: "Delicati",                sub: "Viscosa, pizzi, collant, decorazioni",                              dot: "#C9B6E4",  temp: 30, spin: 600,  capF: 0.35 },
  lana:          { name: "Lana e cashmere",         sub: "Cheratina: freddo, movimento minimo, niente enzimi",                dot: "#B89A7A",  temp: 30, spin: 600,  capF: 0.25 },
  mano:          { name: "Seta e lavaggio a mano",  sub: "Fibre proteiche fragili o etichetta con la mano",                   dot: "#E8D8B0",  temp: 30, spin: 400,  capF: 0.15 },
  piumini:       { name: "Piumini e imbottiti",     sub: "Piumini, cuscini, trapunte: spazio per gonfiarsi",                          dot: "#9FB4C9",  temp: 30, spin: 600,  capF: 0.3 },
  stinge:        { name: "A parte: stingono",       sub: "Capi nuovi e intensi che rilasciano colorante",                     dot: "#D3313E",  temp: 30, spin: 800,  capF: 1 },
  pesante:       { name: "A parte: sporco pesante", sub: "Fango, grasso, peli, scarpe",                                       dot: "#8A6A4A",  temp: 40, spin: 1000, capF: 1 },
  nolav:         { name: "Non in lavatrice",        sub: "Tintoria o pulizia professionale",                                  dot: "#9AA3B2",  temp: 0,  spin: 0,    capF: 0 }
};
const BASKET_ORDER = ["bianchi", "chiari", "colorati", "scuri", "spugna_chiara", "spugna_col", "sport", "delicati", "lana", "mano", "piumini", "stinge", "pesante", "nolav"];
// dal più delicato al più robusto: in un carico misto comanda il più delicato
const DELICACY = ["mano", "lana", "piumini", "delicati", "sport", "stinge", "scuri", "colorati", "spugna_col", "chiari", "pesante", "spugna_chiara", "bianchi"];

// dose = dose base per carico pieno normale (≈ 4,5–5 kg), sporco normale, acqua media
const PRODUCTS = {
  // detersivi
  polvere:   { name: "Detersivo in polvere",        e: "📦", cat: "Detersivi", unit: "g",  dose: 70, chem: "Tensioattivi, zeoliti, percarbonato con attivatore TAED e sbiancanti ottici. Il re dei bianchi.", good: "Bianchi, spugna chiara, sporco ossidabile, 40–60°C", bad: "Lana, seta, scuri e pastelli (sbiancanti e ossidanti)" },
  liq_univ:  { name: "Detersivo liquido universale", e: "🧴", cat: "Detersivi", unit: "ml", dose: 40, chem: "Tensioattivi ed enzimi, niente candeggiante. Si scioglie subito anche a 20°C, ottimo sul grasso.", good: "Quasi tutto tranne lana e seta", bad: "Lana e seta (contiene proteasi)" },
  liq_colori:{ name: "Detersivo per colorati",      e: "🌈", cat: "Detersivi", unit: "ml", dose: 40, chem: "Senza candeggianti né sbiancanti ottici, con polimeri che impediscono al colore di ridepositarsi.", good: "Colorati, chiari, pastelli", bad: "Lana e seta" },
  liq_scuri: { name: "Detersivo per capi scuri",    e: "🖤", cat: "Detersivi", unit: "ml", dose: 40, chem: "Come quello per colorati, spesso con cellulasi che tagliano i pelucchi grigi del cotone.", good: "Neri, blu, jeans", bad: "Bianchi" },
  lana:      { name: "Detersivo per lana e delicati", e: "🐑", cat: "Detersivi", unit: "ml", dose: 30, chem: "pH neutro, senza proteasi: non attacca cheratina e fibroina.", good: "Lana, cashmere, seta, piumini, delicati", bad: "Sporco pesante (lava poco)" },
  sport:     { name: "Detersivo per sportivi",      e: "🏃", cat: "Detersivi", unit: "ml", dose: 40, chem: "Tensioattivi e lipasi mirati al sebo trattenuto dal poliestere.", good: "Tecnici, sintetici con odori", bad: "Lana, seta" },
  eco:       { name: "Detersivo con Ecolabel",      e: "🌿", cat: "Detersivi", unit: "ml", dose: 40, chem: "Formula con limiti più severi su tossicità acquatica e imballaggi, efficace a basse temperature.", good: "Uso quotidiano", bad: "Lana e seta se contiene enzimi" },
  capsule:   { name: "Capsule",                      e: "🫧", cat: "Detersivi", unit: "pz", dose: 1,  chem: "Detersivo liquido concentrato in un film di alcol polivinilico (PVA) che si scioglie in acqua.", good: "Carichi pieni normali", bad: "Mezzi carichi (dose fissa), lana, seta" },
  shampoo:   { name: "Shampoo neutro",               e: "🧴", cat: "Detersivi", unit: "ml", dose: 15, chem: "Tensioattivi delicati pensati per la cheratina dei capelli: un ripiego sensato per la lana.", good: "Lana e cashmere a mano, in emergenza", bad: "Bucato normale (troppa schiuma)" },
  // additivi
  percarbonato:{ name: "Percarbonato di sodio",     e: "⚪", cat: "Additivi", unit: "g",  dose: 30, chem: "Carbonato di sodio + acqua ossigenata in forma solida: in acqua libera ossigeno attivo che 'spegne' i pigmenti delle macchie.", good: "Bianchi, spugna, macchie di vino, caffè, frutta, igiene a 40°C", bad: "Lana, seta, pelle, metalli; inefficace sotto i 40°C senza attivatore" },
  bicarbonato:{ name: "Bicarbonato di sodio",       e: "🧂", cat: "Additivi", unit: "g",  dose: 30, chem: "Base debole: neutralizza gli acidi grassi volatili del sudore che puzzano.", good: "Odori di sport e sudore", bad: "Lana e seta; inutile se mescolato con acidi" },
  acchiappacolore:{ name: "Foglietti acchiappacolore", e: "🧻", cat: "Additivi", unit: "fogli", dose: 1, chem: "Tessuto con polimeri carichi positivamente che catturano i coloranti liberi nell'acqua.", good: "Carichi misti di colori, capi nuovi", bad: "Non aggiusta un capo già macchiato" },
  candeggina:{ name: "Candeggina (ipoclorito)",     e: "☣️", cat: "Additivi", unit: "ml", dose: 0,  chem: "Ossidante e disinfettante fortissimo a base di cloro.", good: "Solo cotone bianco senza elastan, raramente", bad: "Colori, lana, seta, elastan; MAI con acidi o ammoniaca" },
  igienizzante:{ name: "Igienizzante per bucato",   e: "🦠", cat: "Additivi", unit: "ml", dose: 0,  chem: "In genere sali di ammonio quaternario: disinfettanti cationici.", good: "Carichi a rischio lavati a bassa temperatura", bad: "Uso di routine: tossici per gli organismi acquatici" },
  // risciacquo
  ammorbidente:{ name: "Ammorbidente",              e: "🌸", cat: "Risciacquo", unit: "ml", dose: 30, chem: "Tensioattivi cationici che rivestono le fibre di un film lubrificante.", good: "Cotone liscio, se ti piace l'effetto", bad: "Spugna, sportivi, microfibra, piumini, membrane" },
  acido_citrico:{ name: "Acido citrico (soluzione 15%)", e: "🍋", cat: "Risciacquo", unit: "ml", dose: 100, chem: "150 g di acido citrico in 1 litro d'acqua. Scioglie il calcare e neutralizza i residui alcalini: morbidezza senza pellicole.", good: "Quasi tutto, soprattutto con acqua dura e spugna", bad: "MAI nello stesso lavaggio con candeggina" },
  aceto:     { name: "Aceto bianco",                e: "🫙", cat: "Risciacquo", unit: "ml", dose: 100, chem: "Acido acetico al 5–6% circa: acido debole anticalcare.", good: "Risciacquo occasionale", bad: "Uso continuo (alcuni produttori lo sconsigliano per le guarnizioni); mai con candeggina" },
  // pretrattamento
  smacchiatore:{ name: "Smacchiatore enzimatico",   e: "🎯", cat: "Pretrattamento", unit: "", dose: 0, chem: "Spray o gel con proteasi, amilasi e lipasi concentrate.", good: "Sangue, uovo, erba, sughi, cioccolato", bad: "Lana e seta" },
  marsiglia: { name: "Sapone di Marsiglia",         e: "🧼", cat: "Pretrattamento", unit: "", dose: 0, chem: "Sali di sodio di acidi grassi: tensioattivo anionico naturale, alcalino.", good: "Colli e polsini unti", bad: "Macchie di vino e frutta; lana e seta" },
  piatti:    { name: "Detersivo per piatti",        e: "🍽️", cat: "Pretrattamento", unit: "", dose: 0, chem: "Tensioattivi molto efficaci sul grasso alimentare.", good: "Olio, burro, trucco: una goccia sulla macchia", bad: "Mai nella vaschetta: troppa schiuma" },
  amido:     { name: "Talco o amido di mais",       e: "🌽", cat: "Pretrattamento", unit: "", dose: 0, chem: "Polveri ad alta superficie che assorbono l'olio per capillarità.", good: "Olio fresco, prima di bagnare", bad: "" },
  alcol:     { name: "Alcol denaturato",            e: "🧪", cat: "Pretrattamento", unit: "", dose: 0, chem: "Solvente: scioglie inchiostri e resine che l'acqua non scioglie.", good: "Penna a sfera, pennarello, rossetto", bad: "Acetato e tessuti delicati: prova su un punto nascosto" },
  // accessori
  retina:    { name: "Sacchetti a rete",            e: "🕸️", cat: "Accessori", unit: "", dose: 0, chem: "Riducono l'attrito e impediscono ai ferretti e ai gancetti di agganciarsi.", good: "Reggiseni, collant, calzini, delicati", bad: "" },
  filtro:    { name: "Sacchetto anti-microfibre",   e: "🎒", cat: "Accessori", unit: "", dose: 0, chem: "Tessuto a maglia fittissima che trattiene le fibre rilasciate dai sintetici.", good: "Sintetici e pile", bad: "" },
  palline:   { name: "Palline per asciugatrice",    e: "🎾", cat: "Accessori", unit: "", dose: 0, chem: "Battono i capi durante l'asciugatura: aprono i grumi e fanno circolare l'aria.", good: "Piumini, spugna", bad: "" },
  // bacinella e mani
  guanti:    { name: "Guanti in nitrile riutilizzabili", e: "🧤", cat: "Bacinella e mani", unit: "", dose: 0, chem: "Una barriera tra la pelle e tensioattivi, basi e ossidanti. Il nitrile non contiene lattice e resiste bene a grassi e soluzioni alcaline.", good: "Acqua calda, percarbonato, ammolli lunghi", bad: "" },
  pinze:     { name: "Pinze da cucina o mollette",  e: "🥢", cat: "Bacinella e mani", unit: "", dose: 0, chem: "Per pescare i capi dall'ammollo senza immergere le mani.", good: "Ammolli", bad: "" },
  spazzolino:{ name: "Spazzolino da denti vecchio", e: "🪥", cat: "Bacinella e mani", unit: "", dose: 0, chem: "Setole morbide e testa piccola: lavora la macchia al posto delle dita, senza consumare il tessuto.", good: "Macchie, cuciture, tomaie", bad: "" },
  spazzola:  { name: "Spazzola a setole dure",      e: "🧹", cat: "Bacinella e mani", unit: "", dose: 0, chem: "Per fango secco, suole e tela robusta.", good: "Scarpe, zaini, tappetini", bad: "Delicati" },
  spugna_cell:{ name: "Spugna di cellulosa o luffa", e: "🧽", cat: "Bacinella e mani", unit: "", dose: 0, chem: "Fibre vegetali: si compostano e non perdono microplastiche come le spugne sintetiche.", good: "Lavaggi a zone, zaini, pelle", bad: "" },
  bacinella: { name: "Bacinella",                    e: "🥣", cat: "Bacinella e mani", unit: "", dose: 0, chem: "Lavare e risciacquare per immersione consuma molta meno acqua del rubinetto aperto.", good: "Lavaggi a mano", bad: "" },
  secchio:   { name: "Secchio con coperchio",        e: "🪣", cat: "Bacinella e mani", unit: "", dose: 0, chem: "Per gli ammolli: il coperchio trattiene calore e odori ed evita gli schizzi.", good: "Ammolli", bad: "" },
  crema_mani:{ name: "Crema mani emolliente",        e: "🧴", cat: "Bacinella e mani", unit: "", dose: 0, chem: "Glicerina e ceramidi trattengono l'acqua e aiutano a ricostruire la barriera della pelle dopo il lavoro bagnato.", good: "Dopo ogni lavaggio a mano", bad: "" }
};
const PRODUCT_CATS = ["Detersivi", "Additivi", "Risciacquo", "Pretrattamento", "Accessori", "Bacinella e mani"];
const STARTER_KIT = ["liq_colori", "polvere", "percarbonato", "acido_citrico", "lana", "acchiappacolore"];

// Detersivo preferito per tipo di carico (in ordine)
const DETERGENT_PREF = {
  bianchi:       ["polvere", "liq_univ", "eco", "capsule", "liq_colori"],
  chiari:        ["liq_colori", "liq_univ", "eco", "capsule", "polvere"],
  colorati:      ["liq_colori", "liq_univ", "eco", "capsule"],
  scuri:         ["liq_scuri", "liq_colori", "liq_univ", "eco", "capsule"],
  spugna_chiara: ["polvere", "liq_univ", "eco", "capsule"],
  spugna_col:    ["liq_colori", "liq_univ", "eco", "capsule"],
  sport:         ["sport", "liq_univ", "eco", "liq_colori", "capsule"],
  delicati:      ["lana", "liq_colori", "eco", "liq_univ"],
  lana:          ["lana", "shampoo"],
  mano:          ["lana", "shampoo"],
  piumini:       ["lana", "shampoo"],
  stinge:        ["liq_colori", "liq_scuri", "liq_univ", "eco"],
  pesante:       ["polvere", "liq_univ", "eco", "capsule"]
};

// Macchie
const STAINS = {
  sangue:    { name: "Sangue", e: "🩸", fam: "Proteica",
    chem: "Emoglobina, albumina e fibrinogeno sono proteine: il calore le denatura e le 'cuoce' dentro la fibra, come l'albume in padella.",
    fare: ["Sciacqua subito da rovescio con acqua fredda, per spingere la macchia fuori invece che attraverso il tessuto.", "Massaggia con detersivo enzimatico o smacchiatore e lascia agire 15–30 minuti.", "Tracce vecchie: ammollo freddo o a 30°C con detersivo enzimatico, anche per una notte.", "Sui bianchi resistenti, l'acqua ossigenata al 3% schiuma e sbianca l'alone residuo (prova prima su un punto nascosto)."],
    no: ["Acqua calda prima che la macchia sia sparita.", "Asciugatrice o ferro: fissano definitivamente.", "Candeggina al cloro sulle proteine: può ingiallire l'alone."], prod: ["smacchiatore", "liq_univ"] },
  sudore:    { name: "Aloni di sudore e deodorante", e: "💧", fam: "Mista",
    chem: "Proteine e grassi del sudore si legano ai sali di alluminio degli antitraspiranti: col tempo formano un alone giallo e rigido.",
    fare: ["Ammollo di un'ora nella soluzione di acido citrico (o acqua e succo di limone): l'acido scioglie i composti di alluminio.", "Poi detersivo enzimatico massaggiato sull'alone.", "Sui bianchi, lavaggio a 40–60°C con percarbonato."],
    no: ["Candeggina al cloro: reagisce con le proteine e rende l'alone più giallo.", "Lavaggi a caldo prima del trattamento."], prod: ["acido_citrico", "smacchiatore", "percarbonato"] },
  mestruo:   { name: "Sangue mestruale", e: "🔴", fam: "Proteica",
    chem: "Sangue, muco cervicale e cellule dell'endometrio: proteine e glicoproteine. Come per ogni macchia di sangue, il calore le coagula dentro la fibra, mentre in acqua fredda restano solubili.",
    fare: ["Appena tolto, sciacqua sotto l'acqua fredda strizzando, finché l'acqua esce quasi limpida.", "Se non lavi subito: ammollo in acqua fredda, cambiandola ogni giorno, oppure lascialo asciugare all'aria fino al lavaggio. Chiuso e umido in un sacchetto prende odore.", "Sugli aloni rimasti, detersivo enzimatico o smacchiatore per 15–30 minuti, poi lavaggio a 40–60°C con l'intimo.", "Aloni che restano dopo il lavaggio: sono pigmento ossidato, non sporco. Sui pad chiari un ammollo con percarbonato a 40°C, o il sole, li schiarisce."],
    no: ["Acqua calda prima del risciacquo: fissa le proteine nella fibra.", "Ammorbidente: lascia un film idrofobo che riduce l'assorbenza.", "Candeggina al cloro: rovina il cotone e l'eventuale strato impermeabile, e ingiallisce gli aloni proteici.", "Asciugatrice calda, se c'è uno strato impermeabile (PUL)."],
    prod: ["smacchiatore", "percarbonato", "liq_univ"] },
  perdite:   { name: "Perdite vaginali", e: "🤍", fam: "Glicoproteica e acida",
    chem: "Le perdite fisiologiche sono soprattutto muco (glicoproteine dette mucine), acqua e cellule di sfaldamento, con l'acido lattico prodotto dai lattobacilli: il pH vaginale è circa 3,8–4,5. Col tempo quell'acidità lascia aloni sbiaditi sui tessuti scuri, e le proteine ossidate aloni giallini su quelli chiari.",
    fare: ["Sciacqua in acqua fredda appena puoi: il muco ancora idratato si stacca facilmente, seccato aderisce alla fibra.", "Lavaggio con detersivo enzimatico: le proteasi tagliano la parte proteica delle mucine.", "Aloni gialli sui pad chiari: ammollo con percarbonato a 40°C, poi lavaggio normale."],
    no: ["Acqua calda prima del risciacquo.", "Ammorbidente: riduce l'assorbenza."],
    prod: ["smacchiatore", "percarbonato", "liq_univ"] },
  uovo:      { name: "Uovo, latte, gelato", e: "🥚", fam: "Proteica e grassa",
    chem: "Proteine (che il caldo fissa) e grassi (che il freddo non scioglie): prima l'enzima, poi il tensioattivo.",
    fare: ["Raschia via il residuo con un cucchiaino.", "Acqua fredda da rovescio.", "Detersivo enzimatico sulla macchia, 15 minuti, poi lavaggio normale a 30–40°C."],
    no: ["Acqua calda subito."], prod: ["smacchiatore", "liq_univ"] },
  erba:      { name: "Erba", e: "🌿", fam: "Mista",
    chem: "Clorofilla e altri pigmenti vegetali intrappolati con proteine e cere della pianta.",
    fare: ["Detersivo enzimatico massaggiato, 15–30 minuti.", "Poi lavaggio con ossigeno attivo (percarbonato) se il capo lo regge.", "Sui jeans un po' di alcol denaturato aiuta a sciogliere i pigmenti."],
    no: ["Strofinare a secco: spingi i pigmenti nella trama."], prod: ["smacchiatore", "percarbonato", "alcol"] },
  vino:      { name: "Vino rosso, frutti di bosco", e: "🍷", fam: "Tannica (antociani)",
    chem: "Gli antociani sono indicatori di pH, come il cavolo rosso: in ambiente alcalino virano al blu-grigio e si legano più forte alla fibra.",
    fare: ["Tampona (non strofinare) con carta assorbente.", "Sciacqua con acqua fredda.", "Ammollo con percarbonato in acqua tiepida (40°C circa) per qualche ora, se il tessuto lo regge.", "Lavaggio normale con detersivo per colorati o polvere sui bianchi."],
    no: ["Sapone di Marsiglia o detersivi molto alcalini sulla macchia fresca: la fanno virare al grigio-blu.", "Acqua calda e asciugatrice prima che sia sparita."], prod: ["percarbonato"] },
  caffe:     { name: "Caffè e tè", e: "☕", fam: "Tannica",
    chem: "Tannini e melanoidine: pigmenti solubili in acqua, che l'ossigeno attivo decolora.",
    fare: ["Sciacqua subito con acqua fredda da rovescio.", "Detersivo liquido massaggiato.", "Ossigeno attivo nel lavaggio (bianchi e colori solidi)."],
    no: ["Lasciarla asciugare: i tannini ossidati si fissano.", "Se c'era latte, niente caldo: anche le proteine si fissano."], prod: ["percarbonato", "liq_univ"] },
  frutta:    { name: "Frutta e succhi", e: "🍓", fam: "Tannica e zuccherina",
    chem: "Pigmenti vegetali (antociani, carotenoidi) e zuccheri che caramellano col calore.",
    fare: ["Acqua fredda subito.", "Ossigeno attivo in ammollo o in lavatrice.", "Al sole: la luce degrada molti pigmenti vegetali."],
    no: ["Sapone alcalino sulle macchie rosse e viola.", "Ferro da stiro: caramella gli zuccheri."], prod: ["percarbonato"] },
  sugo:      { name: "Sugo di pomodoro", e: "🍅", fam: "Grassa con pigmenti liposolubili",
    chem: "Il licopene è un carotenoide liposolubile: sta nell'olio del sugo, quindi prima va tolto il grasso.",
    fare: ["Raschia l'eccesso.", "Una goccia di detersivo per piatti, massaggia, sciacqua con acqua tiepida.", "Lavaggio con detersivo enzimatico.", "L'alone arancio residuo sparisce bene stendendo il capo al sole: la luce degrada il licopene."],
    no: ["Partire con l'ossigeno attivo prima di aver tolto il grasso."], prod: ["piatti", "smacchiatore"] },
  olio:      { name: "Olio, burro, grasso", e: "🫒", fam: "Grassa",
    chem: "Trigliceridi apolari: l'acqua da sola li sposta e allarga la macchia, servono adsorbenti e tensioattivi.",
    fare: ["Copri subito con talco o amido di mais, lascia 15–30 minuti e spazzola via: assorbe l'olio per capillarità.", "Una goccia di detersivo per piatti o liquido puro, massaggia.", "Lava alla temperatura più alta che l'etichetta consente: il grasso si scioglie meglio."],
    no: ["Bagnare subito con acqua.", "Asciugatrice prima di controllare: l'alone ossidato non va più via."], prod: ["amido", "piatti", "liq_univ"] },
  trucco:    { name: "Fondotinta e trucco", e: "💄", fam: "Grassa con pigmenti",
    chem: "Pigmenti minerali dispersi in oli e siliconi.",
    fare: ["Un po' di acqua micellare o detersivo per piatti: sono tensioattivi.", "Tampona dal rovescio con carta sotto.", "Rossetto: alcol denaturato, poi detersivo."],
    no: ["Strofinare: allarghi i pigmenti."], prod: ["piatti", "alcol"] },
  cioccolato:{ name: "Cioccolato", e: "🍫", fam: "Mista",
    chem: "Burro di cacao (grasso), proteine del latte, zuccheri e tannini del cacao: serve una strategia a strati.",
    fare: ["Raschia, poi acqua fredda da rovescio (proteine).", "Detersivo enzimatico.", "Ossigeno attivo per l'alone marrone."],
    no: ["Acqua calda all'inizio."], prod: ["smacchiatore", "percarbonato"] },
  penna:     { name: "Penna a sfera", e: "🖊️", fam: "Pigmento in solvente",
    chem: "L'inchiostro è sciolto in solventi oleosi: l'acqua non lo scioglie, l'alcol sì.",
    fare: ["Carta assorbente sotto la macchia.", "Tampona con alcol denaturato, cambiando spesso la carta.", "Poi detersivo e lavaggio."],
    no: ["Acqua e strofinare: allarghi la macchia."], prod: ["alcol"] },
  ruggine:   { name: "Ruggine", e: "🔩", fam: "Metallica",
    chem: "Ossidi di ferro: si sciolgono con acidi che chelano il ferro (citrico, ossalico).",
    fare: ["Succo di limone o soluzione di acido citrico sulla macchia, un pizzico di sale, al sole.", "Ripeti se serve, poi lava."],
    no: ["Candeggina al cloro: ossida ancora il ferro e scurisce la macchia."], prod: ["acido_citrico"] },
  cera:      { name: "Cera di candela", e: "🕯️", fam: "Cerosa",
    chem: "Paraffina: solida a temperatura ambiente, fonde verso 50–60°C.",
    fare: ["Indurisci con un cubetto di ghiaccio e gratta via.", "Carta assorbente sopra e sotto, ferro tiepido: la cera fonde e migra nella carta per capillarità.", "L'alone colorato residuo: alcol, poi lavaggio."],
    no: ["Acqua calda subito: spandi la cera."], prod: ["alcol"] },
  fango:     { name: "Fango e terra", e: "🟫", fam: "Particellare",
    chem: "Particelle minerali (argilla, sabbia) che si incastrano meccanicamente nella trama.",
    fare: ["Lascia asciugare del tutto.", "Spazzola via la terra secca.", "Lavaggio con detersivo in polvere: i builder disperdono le particelle di argilla meglio dei liquidi."],
    no: ["Strofinare il fango bagnato: lo spingi più dentro."], prod: ["polvere"] },
  gomma:     { name: "Gomma da masticare", e: "🫧", fam: "Polimerica",
    chem: "Un polimero elastico che sotto zero diventa rigido e fragile (sotto la sua transizione vetrosa).",
    fare: ["Capo in freezer in un sacchetto per un'ora, o ghiaccio sopra.", "Gratta via la gomma ormai fragile.", "Residui: una goccia di olio la ammorbidisce, poi detersivo per piatti."],
    no: ["Lavare con la gomma attaccata: si spalma sugli altri capi."], prod: ["piatti"] }
};

// Simboli delle etichette (ISO 3758)
const LABEL_GROUPS = [
  { name: "Lavaggio", items: [
    { s: { t: "tub", n: "95" }, title: "Lavaggio fino a 95°C", text: "Cotone e lino bianchi molto resistenti. Il numero è il massimo consentito, non un obbligo: quasi mai servono più di 60°C.", why: "Solo la cellulosa nativa del cotone, con catene lunghe e molto cristalline, regge l'ebollizione senza deformarsi." },
    { s: { t: "tub", n: "60" }, title: "Lavaggio fino a 60°C", text: "Bianchi e colorati resistenti. La temperatura di riferimento per l'igiene di asciugamani, intimo e lenzuola.", why: "A 60°C la maggior parte dei batteri e dei funghi del bucato viene inattivata, e i coloranti di qualità reggono." },
    { s: { t: "tub", n: "40" }, title: "Lavaggio fino a 40°C", text: "Colorati, misti, sintetici robusti.", why: "Sopra i 40°C i coloranti migrano più facilmente e i sintetici si avvicinano alla temperatura in cui le pieghe si fissano." },
    { s: { t: "tub", n: "30" }, title: "Lavaggio fino a 30°C", text: "Colori che stingono, capi con elastan, finiture delicate.", why: "Più è basso il calore, più lenta è la diffusione del colorante fuori dalla fibra." },
    { s: { t: "tub", n: "40", bars: 1 }, title: "40°C, programma sintetici", text: "Una barra sotto la vaschetta: azione meccanica ridotta, centrifuga più bassa, raffreddamento graduale.", why: "Meno movimento e meno giri riducono le pieghe che si fissano nei polimeri sintetici caldi." },
    { s: { t: "tub", n: "30", bars: 2 }, title: "30°C, programma molto delicato", text: "Due barre: programma lana o delicati, movimento minimo, pochissimi giri.", why: "È la condizione per non far camminare le scaglie della lana e non stirare fibre deboli da bagnate." },
    { s: { t: "tub", hand: true }, title: "Lavaggio a mano", text: "Acqua al massimo a 40°C, niente sfregamenti, niente strizzature. Molte lavatrici hanno un programma 'lana/a mano' certificato che va bene lo stesso.", why: "Strizzare torce le fibre bagnate, quando i legami idrogeno tra le catene sono più deboli." },
    { s: { t: "tub", cross: true }, title: "Non lavare in acqua", text: "Il capo non va in lavatrice né a mano: guarda il cerchio per la pulizia professionale.", why: "Imbottiture, colle, finiture o fibre che in acqua si deformano in modo irreversibile." }
  ]},
  { name: "Candeggio", items: [
    { s: { t: "tri" }, title: "Qualsiasi candeggiante", text: "Va bene sia il cloro sia l'ossigeno attivo.", why: "Fibra e colore resistono agli ossidanti forti: tipico del cotone bianco." },
    { s: { t: "tri", lines: true }, title: "Solo ossigeno, niente cloro", text: "Percarbonato e detersivi in polvere sì, candeggina no.", why: "L'ossigeno attivo è più selettivo: spegne i pigmenti delle macchie ma rispetta la maggior parte dei coloranti solidi." },
    { s: { t: "tri", cross: true }, title: "Nessun candeggiante", text: "Né cloro né ossigeno: niente percarbonato, attenzione ai detersivi in polvere.", why: "Il colorante o la fibra (lana, seta, alcune finiture) verrebbero ossidati." }
  ]},
  { name: "Asciugatura", items: [
    { s: { t: "sq", circle: true, dots: 2 }, title: "Asciugatrice, temperatura normale", text: "Due punti: fino a circa 80°C in uscita.", why: "Il cotone regge il calore; il rotolamento tiene sollevati gli anelli della spugna." },
    { s: { t: "sq", circle: true, dots: 1 }, title: "Asciugatrice, temperatura bassa", text: "Un punto: fino a circa 60°C. Sintetici, misti, capi con elastan.", why: "L'elastan perde elasticità e i sintetici fissano le pieghe ad alte temperature." },
    { s: { t: "sq", circle: true, cross: true }, title: "Niente asciugatrice", text: "Asciugatura all'aria.", why: "Calore e rotolamento farebbero restringere o infeltrire il capo." },
    { s: { t: "sq", line: "v" }, title: "Asciugare appeso", text: "Su stendino o gruccia.", why: "Il peso dell'acqua tira il tessuto verso il basso e distende le pieghe." },
    { s: { t: "sq", line: "h" }, title: "Asciugare in piano", text: "Steso su un asciugamano, su una superficie orizzontale. Tipico della lana.", why: "Bagnata, la lana si allunga sotto il proprio peso: appesa si deformerebbe." },
    { s: { t: "sq", line: "v", shade: true }, title: "Appeso all'ombra", text: "La linea diagonale nell'angolo indica l'ombra.", why: "Gli ultravioletti rompono i cromofori dei coloranti: il colore sbiadisce." }
  ]},
  { name: "Stiratura", items: [
    { s: { t: "iron", dots: 1 }, title: "Ferro a 110°C", text: "Un punto: sintetici, acrilico, seta. Meglio senza vapore.", why: "I sintetici si ammorbidiscono e possono lucidarsi o fondere a temperature più alte." },
    { s: { t: "iron", dots: 2 }, title: "Ferro a 150°C", text: "Due punti: lana, poliestere, viscosa, misti.", why: "Oltre questa soglia la cheratina della lana inizia a bruciacchiarsi." },
    { s: { t: "iron", dots: 3 }, title: "Ferro a 200°C", text: "Tre punti: cotone e lino, meglio con vapore.", why: "Il vapore porta acqua che rompe i legami idrogeno della cellulosa: la piega si distende e si fissa piatta raffreddando." },
    { s: { t: "iron", cross: true }, title: "Non stirare", text: "Stampe, decorazioni, alcuni sintetici.", why: "Il calore fonderebbe la stampa o la fibra." }
  ]},
  { name: "Pulizia professionale", items: [
    { s: { t: "circ", l: "P" }, title: "Lavaggio a secco (P)", text: "In tintoria con percloroetilene o altri solventi.", why: "I solventi sciolgono il grasso senza gonfiare le fibre con l'acqua." },
    { s: { t: "circ", l: "F" }, title: "Lavaggio a secco delicato (F)", text: "Solo solventi idrocarburici, più delicati.", why: "Per finiture e colle che il percloroetilene scioglierebbe." },
    { s: { t: "circ", l: "W" }, title: "Lavaggio ad acqua professionale (W)", text: "Wet cleaning in tintoria, con macchinari e detergenti controllati.", why: "Una alternativa più ecologica ai solventi." },
    { s: { t: "circ", cross: true }, title: "Niente lavaggio a secco", text: "Il capo non regge i solventi.", why: "Alcune plastiche, stampe e rivestimenti si sciolgono nei solventi." }
  ]}
];
