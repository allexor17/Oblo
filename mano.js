// Oblò · Bacinella: lavaggi a mano, ammolli, oggetti difficili e protezione delle mani

// Livelli di protezione per le mani
const SKIN = {
  no:   { name: "Mani libere", short: "Mani libere" },
  si:   { name: "Guanti consigliati", short: "Guanti consigliati" },
  must: { name: "Guanti necessari", short: "Guanti necessari" }
};

const HANDS = {
  rules: [
    "<b>Guanti</b> per l'acqua calda, per i prodotti alcalini (percarbonato, bicarbonato, sapone di Marsiglia) e per gli ammolli lunghi. Meglio in nitrile: niente lattice, quindi niente rischio di allergia al lattice.",
    "<b>Anche il guanto è lavoro bagnato</b>: dentro, la pelle suda e macera. Toglilo appena hai finito; se lavori più di 15–20 minuti, mettici sotto un sottoguanto di cotone.",
    "<b>Meno dita nel detersivo</b>: le pinze pescano i capi dall'ammollo, lo spazzolino lavora le macchie al posto dei polpastrelli.",
    "<b>Dopo</b>: sciacqua, asciuga bene anche tra le dita e metti una crema emolliente, con glicerina o ceramidi."
  ],
  tools: ["guanti", "pinze", "spazzolino", "spazzola", "spugna_cell", "bacinella", "secchio", "crema_mani"]
};

const GUIDE_GROUPS = [
  { name: "Ammolli", ids: ["assorbenti", "ammollo_bianchi", "stinge_mano"] },
  { name: "A mano", ids: ["lana_mano", "seta_mano", "delicati_mano"] },
  { name: "Oggetti difficili", ids: ["scarpe_tela", "scarpe_pelle", "zaino"] },
  { name: "Senza lavare tutto", ids: ["smacchiare", "rinfrescare"] }
];

// products: gruppi di alternative (si usa la prima che hai in dispensa) · tools: attrezzi · steps: sequenza, timer in secondi
const GUIDES = {
  assorbenti: {
    name: "Assorbenti e salvaslip lavabili", e: "🩹",
    sub: "Risciacquo freddo (o ammollo se si sono seccati), poi in lavatrice con l'intimo",
    method: "Ammollo, poi lavatrice", time: "2 minuti subito, poi con il bucato", water: "Fredda", skin: "no",
    skinWhy: "Il risciacquo è solo acqua fredda: le mani vanno bene. Per lo smacchiatore enzimatico usa lo spazzolino, o i guanti.",
    when: "La lavatrice sa igienizzare, ma non sa fare il primo passo: togliere le proteine finché sono fredde e solubili. Quello spetta a te, ed è il passo che decide se resteranno aloni.",
    products: [
      { ids: ["smacchiatore", "liq_univ", "liq_colori"], note: "solo se resta un alone: una goccia massaggiata, 15–30 minuti" },
      { ids: ["percarbonato"], note: "facoltativo, dopo il lavaggio, per schiarire gli aloni sui pad chiari" }
    ],
    tools: ["secchio", "pinze", "spazzolino", "retina"],
    steps: [
      { t: "Risciacqua subito", d: "Sotto l'acqua fredda, strizzando il pad su se stesso, finché l'acqua esce quasi limpida. Basta un minuto." },
      { t: "Se si sono già seccati: reidrata", d: "Bacinella d'acqua fredda o appena tiepida (massimo 30°C) con un cucchiaino di detersivo liquido o un po' di smacchiatore enzimatico. Lascia in ammollo: l'acqua deve riportare in soluzione proteine e muco seccati, e gli enzimi hanno bisogno di tempo. Poi strofina il pad su se stesso, cotone contro cotone, e sciacqua. Pinze o guanti per le mani.", timer: 3600 },
      { t: "Scegli come aspettare il bucato", d: "<b>All'asciutto</b>: appeso, o in una retina aperta all'aria. È il metodo più semplice e non fa odore. <b>In ammollo</b>: secchio con coperchio e acqua fredda, da cambiare ogni giorno, per 1–2 giorni al massimo. Oltre, l'acqua ferma diventa un terreno di coltura e lo strato impermeabile soffre." },
      { t: "Se resta un alone, gli enzimi", d: "Una goccia di smacchiatore enzimatico o di detersivo liquido sull'alone, lavorata con lo spazzolino. Lascia agire.", timer: 1800 },
      { t: "Se l'alone resiste, l'ossigeno attivo", d: "Prima sciacqua lo smacchiatore in acqua fredda: porta via le proteine già spezzate dagli enzimi, che il calore potrebbe fissare. Poi ammollo con percarbonato, 1 cucchiaio per litro, a 40–50°C, da qualche ora a una notte. Puoi usare la stessa soluzione preparata per federe o bianchi, ma se il retro del pad è colorato mettila in una ciotola a parte: il colorante finirebbe sul cotone bianco. Un'ombra giallo-arancio che resta è il ferro dell'eme: il pad è pulito." },
      { t: "In lavatrice con l'intimo", d: "Bottoncini chiusi, in retina, nel carico dell'intimo: 60°C se il pad è chiaro, altrimenti 40°C con ossigeno attivo. Niente ammorbidente." },
      { t: "Asciuga all'aria, meglio al sole", d: "Gli UV schiariscono gli aloni rimasti. Niente termosifone né asciugatrice calda se c'è lo strato impermeabile (PUL)." },
      { t: "Morbidi di nuovo", d: "Acido citrico nella vaschetta ⚘ al lavaggio: scioglie calcare e residui alcalini che irrigidiscono il cotone. Prima di stendere sbatti forte il pad; da asciutto stropiccialo tra le mani per qualche secondo, per staccare le fibre che si sono incollate asciugando ferme." }
    ],
    avoid: ["Acqua calda prima del risciacquo o della reidratazione: cuoce le proteine dentro la fibra.", "Ammollo per giorni senza cambiare l'acqua.", "Candeggina al cloro e ammorbidente: l'ammorbidente sembra ammorbidire, ma riveste il cotone di un film che assorbe meno."],
    eco: "Un assorbente lavabile dura anni e sostituisce centinaia di usa e getta. Il suo costo ambientale sta quasi tutto nel lavaggio: risciacquo freddo e un posto nel carico dell'intimo che fai comunque, senza lavatrici dedicate.",
    why: "L'ammollo freddo usa il tempo, la quarta leva di Sinner, senza il rischio del calore: l'acqua entra nelle fibre, il cotone si gonfia e le proteine ancora solubili diffondono fuori. Ma un'acqua ferma, a temperatura ambiente e ricca di proteine, è anche un brodo di coltura: per questo va cambiata, oppure si sceglie l'attesa all'asciutto.",
    cards: ["lavabili", "ammollo", "mani"]
  },

  ammollo_bianchi: {
    name: "Ammollo sbiancante", e: "⚪",
    sub: "Percarbonato e detersivo in acqua calda per federe e colletti gialli, aloni, spugne ingrigite",
    method: "Ammollo", time: "Da 30 minuti a una notte", water: "Circa 50°C", skin: "must",
    skinWhy: "La soluzione di percarbonato è alcalina, con un pH intorno a 10–11, e ossidante: guanti in nitrile, e pinze per tirare fuori i capi.",
    when: "Per pochi capi ingialliti, un ammollo mirato costa meno che lavare tutto il carico a 60–90°C, e lavora molto più a lungo. È la strada quando il giallo è dappertutto e lo smacchiatore sulla singola macchia non basta.",
    products: [
      { ids: ["percarbonato"], note: "1 cucchiaio per litro per gli aloni ostinati, metà per ravvivare" },
      { ids: ["polvere", "liq_univ", "liq_colori"], note: "2 cucchiai ogni 5 litri: enzimi e tensioattivi staccano il sebo che tiene attaccato il giallo" }
    ],
    tools: ["secchio", "guanti", "pinze"],
    steps: [
      { t: "Metà bollente, metà fredda", d: "Acqua bollente e acqua fredda del rubinetto in parti uguali danno circa 55°C: la temperatura finale è la media, perché il calore che cede l'una è quello che acquista l'altra. Secchio e capi freddi la portano verso i 50°C: abbastanza per l'ossigeno attivo, non tanto da spegnere gli enzimi." },
      { t: "Prima sciogli, poi immergi", d: "Percarbonato e detersivo nell'acqua, mescolando con un cucchiaio di legno finché non vedi più granuli. Se sulle macchie più scure vuoi insistere, prima dell'ammollo massaggiale con lo smacchiatore enzimatico." },
      { t: "Tutto sott'acqua", d: "Federe e copricuscini sono sacchi: intrappolano aria e galleggiano. Aprili, spingili giù e appoggia sopra un piatto o una bottiglia piena d'acqua. Le parti fuori dall'acqua restano gialle." },
      { t: "Aspetta", d: "Coperchio appoggiato, non chiuso, e un asciugamano sopra per trattenere il calore. Il percarbonato lavora soprattutto nelle prime ore calde, gli enzimi continuano mentre l'acqua si raffredda. Dopo un paio d'ore rigira i capi; per gli aloni vecchi lascia tutta la notte.", timer: 7200 },
      { t: "Leggi l'acqua", d: "Se al mattino è giallo-marrone, il sebo ossidato è uscito. Se i capi sono ancora gialli, ripeti con una soluzione nuova: gli strati di mesi non si sciolgono in una notte." },
      { t: "In lavatrice a 60°C", d: "Tira fuori con le pinze, strizza con i guanti e lava a 60°C con i bianchi in cotone, detersivo in polvere e acido citrico nella vaschetta col fiore. Se puoi, stendi al sole: gli UV spezzano gli ultimi doppi legami." },
      { t: "Se restano macchie scure", d: "Una pasta di percarbonato e poca acqua calda sulla macchia per un'ora, poi di nuovo in lavatrice. Puntini neri o verdastri a grappolo, con odore di cantina, sono muffa: se resistono a due ammolli, sul cotone bianco serve candeggina diluita sulla sola macchia, poi risciacquo abbondante e, in quel lavaggio, niente acido citrico." }
    ],
    avoid: ["Lana, seta, pelle, metalli delicati.", "Colori che non hai provato su una cucitura.", "Macchie arancio-marroni di ruggine: l'acqua ossigenata non le toglie e, col ferro, può indebolire il cotone fino a bucarlo. Per la ruggine serve l'acido citrico.", "Contenitori chiusi ermeticamente: libera ossigeno, e il tappo può saltare.", "Mai insieme a candeggina o acidi: candeggina e acido citrico liberano cloro gassoso."],
    eco: "L'ossigeno attivo finisce in acqua, ossigeno e carbonato di sodio: niente cloro negli scarichi.",
    why: "Il giallo di federe e colletti è sebo ossidato: come nella lipofuscina, i lipidi perossidati si legano alle proteine e formano molecole con lunghe catene di doppi legami coniugati, che assorbono il blu. In acqua il percarbonato si separa in carbonato di sodio e acqua ossigenata; a pH alcalino l'acqua ossigenata forma lo ione idroperossido, che spezza quei doppi legami e rende il pigmento incolore. Ma il grasso sotto resterebbe e si ossiderebbe di nuovo: per questo servono anche enzimi e tensioattivi.",
    cards: ["ossigeno", "enzimi", "mani", "candeggina"]
  },

  stinge_mano: {
    name: "Il primo lavaggio di un capo che stinge", e: "🎨",
    sub: "A mano e a freddo: vedi tu quanto colore libero c'è",
    method: "A mano", time: "15 minuti", water: "Fredda", skin: "si",
    skinWhy: "Il colorante libero tinge anche pelle e unghie.",
    when: "Un capo nuovo e intenso può rilasciare colorante ai primi lavaggi. A mano non rischi gli altri capi e vedi nell'acqua quanto colore esce: è un test e un lavaggio insieme.",
    products: [
      { ids: ["liq_colori", "liq_univ", "lana"], note: "un cucchiaino in 5 litri d'acqua fredda" },
      { ids: ["acchiappacolore"], note: "facoltativo, nella bacinella" }
    ],
    tools: ["bacinella", "guanti"],
    steps: [
      { t: "Test del cotton fioc", d: "Tampona una cucitura interna con un dischetto bianco umido. Se si colora, prosegui." },
      { t: "Ammollo freddo", d: "In acqua fredda con poco detersivo, muovendo il capo ogni tanto.", timer: 600 },
      { t: "Guarda l'acqua", d: "Il colore nell'acqua è il colorante libero, quello non fissato alla fibra. Più è intenso, più lavaggi a parte serviranno." },
      { t: "Risciacqua finché esce limpida", d: "Cambia l'acqua fredda finché resta chiara. Da lì in poi il capo può andare in lavatrice con i colori simili." },
      { t: "Stendi da solo", d: "All'ombra e lontano dagli altri capi: anche umido macchia per contatto." }
    ],
    avoid: ["Acqua calda: libera più colorante.", "Ammollo per ore: il colorante si ridistribuisce sulle parti chiare del capo."],
    eco: "Un ammollo in bacinella al posto di un ciclo di lavatrice dedicato a un capo solo.",
    why: "Il colorante libero diffonde nell'acqua tanto più in fretta quanto più è calda. A freddo ne esce meno alla volta, e cambiando l'acqua lo porti via prima che torni a depositarsi.",
    cards: ["test_colore", "acchiappacolore", "sale_colori"]
  },

  lana_mano: {
    name: "Lana e cashmere a mano", e: "🧶",
    sub: "Temperatura costante, premere senza strofinare, asciugare in piano",
    method: "A mano", time: "15 minuti", water: "20–30°C, uguale nel lavaggio e nel risciacquo", skin: "si",
    skinWhy: "Il detersivo per lana è delicato, ma dieci minuti di mani nei tensioattivi sono già lavoro bagnato. Guanti se lavi più capi; altrimenti mani asciugate bene e crema subito dopo.",
    when: "Per pochi capi la bacinella consuma una frazione dell'acqua di un ciclo, e il movimento lo controlli tu: è la variabile che decide se la lana infeltrisce.",
    products: [
      { ids: ["lana", "shampoo"], note: "un cucchiaio in 5 litri, sciolto prima di immergere il capo" },
      { ids: ["acido_citrico", "aceto"], note: "facoltativo: un goccio nell'ultimo risciacquo riporta la lana al suo pH leggermente acido" }
    ],
    tools: ["bacinella", "guanti"],
    steps: [
      { t: "Prepara l'acqua", d: "Bacinella con acqua a 20–30°C e il detersivo già sciolto: niente getto diretto sul capo." },
      { t: "Immergi e premi", d: "Spingi il capo sott'acqua e premilo piano, come una spugna, per 3–5 minuti. Niente strofinare né torcere: è lo sfregamento a far camminare le scaglie." },
      { t: "Lascia riposare", d: "Fermo nell'acqua: il tempo fa il lavoro dell'azione meccanica.", timer: 600 },
      { t: "Risciacqua alla stessa temperatura", d: "Acqua pulita alla stessa temperatura, finché non fa più schiuma. Lo sbalzo caldo-freddo è uno dei grilletti del feltro." },
      { t: "Togli l'acqua senza strizzare", d: "Arrotola il capo in un asciugamano asciutto e premi: l'asciugamano beve l'acqua per capillarità." },
      { t: "Asciuga in piano", d: "Su un altro asciugamano, all'ombra, riportando il capo alla sua forma con le mani." }
    ],
    avoid: ["Acqua calda e sbalzi di temperatura.", "Strofinare, torcere, appendere bagnato.", "Detersivi con enzimi."],
    eco: "Un maglione a mano: circa 10 litri d'acqua e nessun riscaldamento. E la lana si lava poco: arieggiarla spesso basta, perché la cheratina trattiene meno odori di molte fibre sintetiche.",
    why: "Le scaglie della cuticola della lana si sollevano con il calore e con il pH alcalino, e con il movimento si agganciano tra loro. Tenendo costante la temperatura, neutro il pH e minimo il movimento, togli le tre condizioni del feltro.",
    cards: ["lana_feltro", "mani", "mano_o_lavatrice"]
  },

  seta_mano: {
    name: "Seta a mano", e: "🪭",
    sub: "Freddo, detergente neutro e un goccio di acido nel risciacquo",
    method: "A mano", time: "10 minuti", water: "Fredda, sotto i 30°C", skin: "no",
    skinWhy: "Pochi minuti con un detergente delicato: basta asciugare bene le mani dopo.",
    when: "La seta è fibroina, una proteina, e da bagnata è fragile. Anche col programma seta, la lavatrice la sfrega più delle tue mani.",
    products: [
      { ids: ["lana", "shampoo"], note: "un cucchiaino in 3–4 litri d'acqua fredda" },
      { ids: ["acido_citrico", "aceto"], note: "un cucchiaio nell'ultimo risciacquo: lucentezza e pH acido" }
    ],
    tools: ["bacinella"],
    steps: [
      { t: "Prima un test del colore", d: "Tampona un punto nascosto con un panno bianco umido: le sete tinte a volte stingono." },
      { t: "Immergi per poco", d: "3–5 minuti al massimo, muovendo piano. Niente ammollo lungo: bagnata, la seta perde resistenza." },
      { t: "Risciacqua con un goccio di acido", d: "Acqua fredda con un cucchiaio di acido citrico o di aceto: neutralizza i residui alcalini e ridà lucentezza." },
      { t: "Tampona e asciuga all'ombra", d: "Arrotolata in un asciugamano, senza torcere. Al riparo dal sole: gli UV ingialliscono la fibroina." },
      { t: "Stira al rovescio, ancora umida", d: "Ferro a un punto, con un panno di cotone in mezzo." }
    ],
    avoid: ["Detersivi con enzimi o alcalini, come il sapone di Marsiglia.", "Sole diretto.", "Strizzare."],
    eco: "Freddo e pochi litri: il lavaggio più leggero che esista.",
    why: "La lucentezza della seta viene dalla sezione quasi triangolare delle sue fibre, che riflette la luce come un prisma. Basi ed enzimi rovinano la superficie della fibroina e la rendono opaca; un risciacquo leggermente acido la riporta al pH in cui sta meglio.",
    cards: ["enzimi", "acido_citrico"]
  },

  delicati_mano: {
    name: "Reggiseni, lingerie e costumi a mano", e: "👙",
    sub: "Un ammollo breve al posto del cestello: ferretti ed elastici ringraziano",
    method: "A mano", time: "20 minuti, quasi tutti di attesa", water: "Fredda o tiepida, massimo 30°C", skin: "no",
    skinWhy: "L'ammollo lavora da solo: le mani entrano solo per un risciacquo. Con le pinze, ancora meno.",
    when: "Reggiseni e costumi sono tra i capi che la lavatrice consuma di più: ferretti che si deformano, gancetti che si agganciano, elastan che perde elasticità a ogni centrifuga. Un ammollo breve li lava quasi senza attrito.",
    products: [{ ids: ["lana", "shampoo", "liq_colori"], note: "un cucchiaio in 5 litri" }],
    tools: ["bacinella", "pinze"],
    steps: [
      { t: "Chiudi i gancetti", d: "Così non si agganciano agli altri capi né al pizzo." },
      { t: "Ammollo", d: "Tutto sott'acqua nell'acqua saponata: lascia lavorare il tempo.", timer: 900 },
      { t: "Muovi e premi", d: "Qualche movimento delicato e una pressione sulle zone a contatto con la pelle, come sottoseno e spalline. Senza piegare i ferretti." },
      { t: "Risciacqua", d: "Acqua pulita alla stessa temperatura, due volte." },
      { t: "Asciuga appeso dal centro", d: "I reggiseni per il ponticello tra le coppe, non per le spalline, che col peso dell'acqua si allungano. I costumi in piano, all'ombra." }
    ],
    avoid: ["Centrifuga e asciugatrice per i costumi: l'elastan teme calore e torsione.", "Lasciare il costume col cloro o la salsedine: sciacqualo appena torni."],
    eco: "Due o tre capi delicati non valgono un ciclo: la bacinella usa una decina di litri d'acqua fredda.",
    why: "L'elastan è un poliuretano a segmenti: tratti rigidi che fanno da ancora e tratti morbidi che si allungano e tornano. Calore, cloro e sfregamento rompono i tratti morbidi, e l'elastico si sfibra. Meno movimento, elastici che durano di più.",
    cards: ["sport_odori", "centrifuga", "mano_o_lavatrice"]
  },

  scarpe_tela: {
    name: "Scarpe da ginnastica", e: "👟",
    sub: "Tela, mesh e sintetico: a mano con la spazzola, o in lavatrice nel sacco",
    method: "A mano, o in lavatrice", time: "20 minuti, più 1–2 giorni per asciugare", water: "Fredda o tiepida, massimo 30°C", skin: "si",
    skinWhy: "Bicarbonato e sapone sono alcalini: per qualche minuto vanno bene le mani, per due scarpe intere meglio i guanti.",
    when: "A mano usi pochi litri d'acqua fredda e strofini solo dove serve. La lavatrice va bene per tela e mesh, ma sbattendo nel cestello le scarpe si deformano e le colle soffrono. Se scegli lei: sacco, 30°C, centrifuga bassa e un paio di asciugamani vecchi per attutire.",
    products: [
      { ids: ["marsiglia", "piatti", "liq_univ"], note: "poco: un cucchiaino in una ciotola d'acqua tiepida" },
      { ids: ["bicarbonato"], note: "in pasta con poca acqua, per suole e bordi ingrigiti" },
      { ids: ["percarbonato"], note: "facoltativo, per i lacci bianchi in ammollo" }
    ],
    tools: ["spazzola", "spazzolino", "bacinella", "guanti"],
    steps: [
      { t: "Smonta", d: "Togli lacci e solette: si lavano a parte, e da sotto escono sabbia e cattivo odore." },
      { t: "Spazzola a secco", d: "Fango e terra si tolgono da asciutti: bagnati diventano fanghiglia e si infilano nella trama." },
      { t: "Lava la tomaia", d: "Spazzolino intinto nell'acqua saponata, a piccoli cerchi, senza inzuppare: l'acqua dentro la scarpa ci mette giorni ad andare via." },
      { t: "Suole e bordi", d: "Pasta di bicarbonato e poca acqua, spazzola dura, poi una passata con la spugna umida." },
      { t: "Lacci e solette", d: "Lacci bianchi in ammollo con acqua calda e un cucchiaino di percarbonato, poi in retina con il bucato. Solette spazzolate con acqua e sapone, oppure una notte nel bicarbonato asciutto contro gli odori.", timer: 1800 },
      { t: "Asciuga lentamente", d: "All'aria e all'ombra, con carta di giornale appallottolata dentro, da cambiare quando è umida: assorbe l'acqua per capillarità e tiene la forma. Mai sul termosifone né al sole diretto: le colle si ammorbidiscono e la gomma ingiallisce." }
    ],
    avoid: ["La gomma magica sulle suole: funziona perché è un abrasivo che si consuma, e si consuma in microplastiche.", "Asciugatrice e termosifone.", "Candeggina sulla tela colorata."],
    eco: "Spazzolare a secco toglie gran parte dello sporco senza acqua. Per un paio di scarpe basta una bacinella di 3–4 litri.",
    why: "Le scarpe sono un oggetto composito: tessuto, gomma, schiuma e colle termoplastiche, che si ammorbidiscono già a 50–60°C. Per questo freddo, poca acqua e asciugatura lenta. Il bicarbonato è un abrasivo dolce: i suoi cristalli sono teneri, quindi grattano via lo sporco ma rigano poco le superfici.",
    cards: ["spugne", "mani", "mano_o_lavatrice"]
  },

  scarpe_pelle: {
    name: "Scarpe di pelle e scamosciate", e: "👞",
    sub: "Mai in acqua: spazzola, panno appena umido e nutrimento",
    method: "Senza immersione", time: "10 minuti", water: "Solo un panno umido", skin: "no",
    skinWhy: "Una traccia di sapone neutro su un panno: contatto minimo.",
    when: "La pelle è collagene conciato. In ammollo perde gli oli che la tengono morbida, si gonfia e asciugando si irrigidisce e si crepa. Va pulita solo in superficie.",
    products: [{ ids: ["marsiglia", "shampoo", "lana"], note: "una traccia su un panno umido, mai direttamente sulla pelle" }],
    tools: ["spazzola", "spugna_cell"],
    steps: [
      { t: "Spazzola la polvere", d: "Spazzola morbida o panno asciutto. Sullo scamosciato una spazzola apposita, o una gomma bianca da cancellare, solleva il pelo e toglie lo sporco a secco." },
      { t: "Panno appena umido", d: "Panno di cotone strizzato quasi asciutto, con una traccia di sapone neutro, a movimenti leggeri. Lo scamosciato non si bagna: prende aloni d'acqua." },
      { t: "Asciuga e nutri", d: "All'aria, lontano dal calore. Poi un velo di crema o grasso per pelle: rimette gli oli persi e chiude la superficie all'acqua." },
      { t: "Contro gli odori", d: "Bicarbonato in un calzino vecchio dentro la scarpa, per una notte." }
    ],
    avoid: ["Lavatrice e ammollo.", "Termosifone e phon caldo.", "Alcol e solventi: sciolgono finiture e tinte."],
    eco: "Scarpe di pelle curate durano molti anni: la cura è la scelta ecologica.",
    why: "Tra le fibre di collagene della pelle ci sono oli e grassi aggiunti con la concia. L'acqua li porta via e, asciugando, le fibre si incollano tra loro con legami idrogeno: la pelle diventa rigida e fragile. La crema rimette il lubrificante tra le fibre.",
    cards: ["restringimento", "lavare_meno"]
  },

  zaino: {
    name: "Zaini e borse di tessuto", e: "🎒",
    sub: "Spugna e spazzola a zone; lavatrice solo se l'etichetta lo permette",
    method: "A mano", time: "20 minuti, più una notte ad asciugare", water: "Tiepida, 30°C", skin: "si",
    skinWhy: "Venti minuti di spugna nell'acqua saponata: con i guanti eviti di sgrassarti le mani.",
    when: "Spalline imbottite, schienali rigidi e rivestimenti impermeabili si deformano e si sfaldano in lavatrice. A mano lavi solo dove serve, con pochi litri.",
    products: [
      { ids: ["liq_univ", "liq_colori", "eco", "marsiglia"], note: "un cucchiaio in una bacinella d'acqua tiepida" },
      { ids: ["smacchiatore", "piatti"], note: "sulle macchie di cibo e di unto" }
    ],
    tools: ["bacinella", "spugna_cell", "spazzolino", "guanti"],
    steps: [
      { t: "Svuota e scuoti", d: "Tasche aperte, zaino capovolto, una bella scossa e l'aspirapolvere negli angoli: briciole e sabbia fanno da abrasivo." },
      { t: "Prima le macchie", d: "Smacchiatore o una goccia di detersivo per piatti sulle macchie. Lascia agire.", timer: 600 },
      { t: "Lava con la spugna", d: "Spugna immersa nell'acqua saponata e strizzata, a zone, dall'alto verso il basso. Lo spazzolino su cuciture e fondo." },
      { t: "Risciacqua", d: "Spugna pulita e acqua chiara, finché non fa più schiuma: il detersivo rimasto attira nuovo sporco." },
      { t: "Asciuga aperto e capovolto", d: "Tasche aperte, appeso a testa in giù, all'ombra. Mai chiuso da umido: muffa." }
    ],
    avoid: ["Lavatrice se ha schienale rigido, parti in pelle o rivestimento gommato.", "Asciugatrice."],
    eco: "Lavare a zone con una bacinella usa pochi litri invece di un ciclo intero.",
    why: "Molti zaini sono impermeabilizzati all'interno con un rivestimento di poliuretano. Calore, sfregamento e detersivi alcalini ne accelerano l'idrolisi, la reazione con l'acqua che spezza le catene del polimero: il rivestimento si sfalda e diventa appiccicoso.",
    cards: ["dose", "mani"]
  },

  smacchiare: {
    name: "Smacchiare un punto senza lavare tutto", e: "🎯",
    sub: "Dal rovescio, tamponando, con la carta sotto",
    method: "Localizzato", time: "5–15 minuti", water: "Fredda", skin: "si",
    skinWhy: "Sgrassatori, smacchiatori e alcol sgrassano anche la pelle: lo spazzolino lavora al posto delle dita.",
    when: "Una macchia su un capo altrimenti pulito non vale un lavaggio intero. Trattarla subito costa poche gocce d'acqua e salva il capo.",
    products: [
      { ids: ["smacchiatore", "liq_univ", "piatti"], note: "una goccia: la scelta dipende dalla famiglia della macchia" },
      { ids: ["amido", "alcol"], note: "talco per l'unto fresco, alcol per inchiostro e rossetto" }
    ],
    tools: ["spazzolino", "guanti"],
    steps: [
      { t: "Riconosci la famiglia", d: "Proteica, grassa, tannica o pigmento: la guida delle macchie nel Laboratorio ti dice chi la scioglie." },
      { t: "Carta sotto, lavora dal rovescio", d: "Un panno o della carta assorbente sotto la macchia, e tratta dal rovescio: la macchia esce dalla strada da cui è entrata." },
      { t: "Tampona, non strofinare", d: "Strofinare allarga la macchia e consuma le fibre. Tampona, e cambia spesso la carta sotto." },
      { t: "Risciacqua il punto", d: "Acqua fredda dal rovescio. Se il resto del capo è pulito, lascialo asciugare e basta." }
    ],
    avoid: ["Acqua calda sulle macchie proteiche.", "Ferro o asciugatrice prima di aver controllato che la macchia sia sparita."],
    eco: "Smacchiare subito spesso evita un lavaggio intero, o un lavaggio più caldo.",
    why: "La carta sotto la macchia sfrutta la capillarità: il liquido migra verso le fibre più asciutte, quindi dalla macchia alla carta. E lavorando dal rovescio lo sporco fa la strada più corta per uscire.",
    cards: ["sangue", "tensioattivi"]
  },

  rinfrescare: {
    name: "Rinfrescare senza lavare", e: "🌬️",
    sub: "Aria, vapore e una spazzolata: il lavaggio più ecologico",
    method: "Senza acqua", time: "Una notte", water: "Nessuna", skin: "no",
    skinWhy: "Niente detersivi, niente acqua.",
    when: "Jeans, maglioni, giacche e cappotti si sporcano poco e si consumano a ogni lavaggio. Spesso basta togliere l'odore e le pieghe.",
    products: [{ ids: ["bicarbonato"], note: "facoltativo, per scarpe e borse che sanno di chiuso" }],
    tools: ["spazzola"],
    steps: [
      { t: "Arieggia", d: "Su una gruccia, all'aperto o vicino a una finestra aperta, per qualche ora o una notte: gli odori sono molecole volatili e se ne vanno con l'aria." },
      { t: "Vapore per le pieghe", d: "Appendi il capo in bagno mentre fai una doccia calda: il vapore allenta i legami idrogeno che tengono le pieghe." },
      { t: "Spazzola", d: "Una spazzola per abiti toglie polvere e pelucchi da lana e cappotti." },
      { t: "Smacchia solo dove serve", d: "Per le macchie isolate, la guida per smacchiare un punto." }
    ],
    avoid: ["Il freezer contro gli odori: i batteri si mettono in pausa, non muoiono."],
    eco: "Ogni lavaggio evitato risparmia acqua, energia, detersivo e microfibre, e allunga la vita del capo.",
    why: "L'odore dei capi indossati viene da acidi grassi volatili e composti solforati prodotti dai batteri della pelle. Sono volatili, quindi l'aria in movimento li porta via; il sole aggiunge un'azione ossidante e germicida.",
    cards: ["lavare_meno", "profumo_sole"]
  }
};

// Quale guida serve per un capo del cesto
function guideFor(it) {
  const G = GARMENTS[it.g];
  if (!G) return null;
  const tags = G.tags || [];
  if (tags.includes("lavabile")) return "assorbenti";
  if (it.g === "scarpe") return it.fiber === "pelle" ? "scarpe_pelle" : "scarpe_tela";
  if (it.g === "zaino") return "zaino";
  if (it.fiber === "lana" || it.fiber === "cashmere") return "lana_mano";
  if (it.fiber === "seta") return "seta_mano";
  if (tags.includes("lingerie")) return "delicati_mano";
  if (it._b === "stinge") return "stinge_mano";
  return null;
}
