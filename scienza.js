// Oblò · box scientifici
// Ogni box: prima una domanda per ragionare, poi la spiegazione, un'analogia e cosa farne in pratica.

const CARD_CATS = {
  chimica: "Chimica",
  fisica: "Fisica",
  fibre: "Fibre",
  ecologia: "Ecologia",
  miti: "Miti",
  trucchi: "Trucchi",
  curiosita: "Curiosità",
  pelle: "Pelle"
};

const CARDS = [
  // ───────── CHIMICA ─────────
  {
    id: "tensioattivi", cat: "chimica",
    title: "Come fa un detersivo a staccare l'unto?",
    ask: "Su una macchia d'olio l'acqua da sola scivola via senza toglierla. Cosa le manca?",
    opts: [
      ["Calore: l'olio si scioglie nell'acqua calda", false, "Il calore rende l'olio più fluido, ma olio e acqua restano immiscibili anche a 90°C."],
      ["Una molecola che faccia da ponte tra acqua e grasso", true],
      ["Più sfregamento", false, "Lo sfregamento sposta la macchia, ma senza un 'ponte' il grasso torna a depositarsi."]
    ],
    body: [
      "L'acqua è una molecola polare: le sue molecole si attraggono tra loro con legami idrogeno e 'escludono' tutto ciò che è apolare, come i grassi. Per questo olio e acqua non si mescolano.",
      "Un <b>tensioattivo</b> è una molecola anfifilica: ha una <b>testa idrofila</b> (carica o polare) e una <b>coda idrofoba</b> (una catena di atomi di carbonio). Le code si infilano nel grasso, le teste restano rivolte verso l'acqua. Quando abbastanza molecole circondano una goccia di sporco si forma una <b>micella</b>: un guscio con il grasso imprigionato dentro e una superficie esterna 'amica' dell'acqua. La goccia si stacca dalla fibra e se ne va con i risciacqui.",
      "C'è un secondo effetto: i tensioattivi abbassano la tensione superficiale. L'acqua smette di formare gocce e si infila tra le fibre, bagnando anche lo sporco più nascosto.",
      "Le micelle si formano solo sopra una certa concentrazione, la <b>concentrazione micellare critica</b>. Sotto, il detersivo lavora male; sopra, aggiungerne non migliora quasi nulla. Tienilo a mente: torna nel box sulla dose."
    ],
    ana: "È la stessa strategia dei sali biliari nel duodeno: emulsionano i grassi del pasto in micelle perché le lipasi possano attaccarli. Il detersivo fa lo stesso nel cestello, e infatti molti detersivi contengono anche lipasi.",
    pratica: [
      "Sulle macchie unte porta i tensioattivi dove servono: una goccia di detersivo liquido puro, massaggiata, prima del lavaggio.",
      "Non serve acqua bollente: i tensioattivi moderni lavorano bene a 30–40°C.",
      "Dosare di più non aiuta: oltre la concentrazione micellare critica aggiungi solo schiuma e residui."
    ],
    rel: ["dose", "enzimi", "sapone"]
  },
  {
    id: "enzimi", cat: "chimica",
    title: "Gli enzimi del detersivo e il troppo caldo",
    ask: "Un detersivo con enzimi su una macchia di uovo: lava meglio a 90°C o a 40°C?",
    opts: [
      ["A 90°C: più caldo, reazioni più veloci", false, "Vero fino a un certo punto: oltre la soglia l'enzima perde la sua forma e smette di funzionare."],
      ["A 40°C", true],
      ["Uguale, la temperatura non conta", false, "Conta eccome: gli enzimi hanno un intervallo ottimale."]
    ],
    body: [
      "Gli enzimi dei detersivi sono proteine catalizzatrici che spezzano molecole grandi e insolubili in frammenti piccoli e solubili, che i tensioattivi portano via. Ognuno ha il suo bersaglio:",
      "<b>Proteasi</b> per sangue, uovo, latte, erba. <b>Amilasi</b> per l'amido di sughi, pappe, cioccolato. <b>Lipasi</b> per grassi e sebo. <b>Mannanasi</b> per gli addensanti di ketchup, gelati e cosmetici. <b>Cellulasi</b> per le microfibrille che sporgono dal cotone consumato: tagliandole ravvivano i colori e riducono i pallini.",
      "La velocità di una reazione enzimatica cresce col calore (all'incirca raddoppia ogni 10°C, il famoso Q10) finché la struttura terziaria della proteina regge. Oltre i 55–60°C molti enzimi si denaturano: a 90°C il detersivo ha perso gran parte del suo arsenale biologico. Gli enzimi moderni sono selezionati per lavorare già tra 20 e 40°C."
    ],
    ana: "Le proteasi del detersivo sono parenti della tripsina: è digestione, solo fuori dal corpo. E come una febbre molto alta mette in crisi le proteine, a 90°C gli enzimi 'cuociono'.",
    pratica: [
      "Macchie biologiche (sangue, uovo, sudore, erba): 30–40°C con detersivo enzimatico, mai partire caldi.",
      "Un ammollo di 30 minuti a 30–40°C dà agli enzimi il tempo di lavorare (il tempo è una delle leve del cerchio di Sinner).",
      "Lana e seta sono proteine: niente detersivi con proteasi, che le 'digerirebbero'. Per questo esistono i detersivi per lana."
    ],
    rel: ["sangue", "sinner", "lana_feltro"]
  },
  {
    id: "sangue", cat: "chimica",
    title: "Macchia di sangue: acqua calda o fredda?",
    ask: "Hai una macchia di sangue fresca su un camice bianco. Prima mossa?",
    opts: [
      ["Acqua calda, così si scioglie", false, "Il calore fa esattamente il contrario: coagula e fissa le proteine nella fibra."],
      ["Acqua fredda, da rovescio", true],
      ["Candeggina subito", false, "Il cloro reagisce con le proteine e può lasciare un alone giallo: prima va tolta la parte proteica."]
    ],
    body: [
      "Il sangue è fatto soprattutto di proteine: emoglobina, albumina, fibrinogeno. Il calore le <b>denatura</b>: si srotolano, espongono le parti idrofobe e si aggrovigliano tra loro e con le fibre del tessuto, diventando insolubili.",
      "In acqua fredda restano solubili e si staccano. Poi entrano in gioco le proteasi del detersivo e, sulle tracce che restano, l'ossigeno attivo. L'acqua ossigenata fa schiuma sul sangue perché la catalasi dei globuli rossi la decompone in acqua e ossigeno, e intanto l'ossidante decolora il ferro dell'eme.",
      "Sciacquare da rovescio non è un dettaglio: l'acqua spinge la macchia fuori dalla strada da cui è entrata, invece di trascinarla attraverso tutto lo spessore del tessuto."
    ],
    ana: "È l'albume in padella: liquido e trasparente, col calore diventa bianco e solido, e non torna più indietro. Se scaldi la macchia, l'hai cucinata dentro la fibra.",
    pratica: [
      "Acqua fredda da rovescio, poi detersivo enzimatico massaggiato e lasciato agire.",
      "Macchie vecchie: ammollo freddo con detersivo enzimatico per qualche ora.",
      "Niente asciugatrice né ferro finché la macchia non è sparita del tutto."
    ],
    rel: ["enzimi", "ossigeno", "sessanta"]
  },
  {
    id: "lavabili", cat: "chimica",
    title: "Assorbenti lavabili: prima freddo, poi caldo",
    ask: "Dopo un lavaggio a 60°C su un assorbente lavabile resta un alone marroncino. L'assorbente è ancora sporco?",
    opts: [
      ["Sì: se c'è la macchia, non è igienico", false, "Il colore e l'igiene sono due cose diverse: l'alone è un pigmento, non una colonia di batteri."],
      ["No: l'alone è pigmento rimasto nella fibra, l'igiene la fanno temperatura, detersivo e risciacqui", true],
      ["Dipende dal detersivo usato", false, "Il detersivo conta per togliere il colore, ma l'igiene a 60°C c'è comunque."]
    ],
    body: [
      "Il sangue mestruale è fatto di sangue, muco e cellule: proteine e glicoproteine. Come per ogni macchia di sangue, l'acqua fredda le lascia solubili e le porta via; l'acqua calda le denatura e le incolla alla fibra.",
      "Per questo l'<b>ordine</b> conta: prima un risciacquo freddo che toglie la materia organica, poi il lavaggio caldo che igienizza. Se parti dal caldo, cuoci le proteine dentro il cotone e la macchia diventa permanente. Se invece hai già tolto il grosso a freddo, a 60°C il calore non fissa più quasi nulla e fa solo il suo lavoro igienico.",
      "L'alone che a volte resta è soprattutto pigmento derivato dal ferro dell'eme, ossidato e intrappolato nella fibra: brutto da vedere, ma dopo detersivo, 60°C e risciacqui non è un problema igienico. L'ossigeno attivo e il sole lo schiariscono.",
      "Niente ammorbidente: i tensioattivi cationici rivestono il cotone di un film idrofobo e l'assorbente beve meno, esattamente come succede agli asciugamani. In più resterebbero residui a contatto con la mucosa."
    ],
    ana: "È la regola della sterilizzazione degli strumenti chirurgici: prima la detersione, che toglie la materia organica, poi la sterilizzazione. Se sterilizzi uno strumento ancora sporco, il calore fissa i residui organici e protegge i microrganismi che ci sono sotto.",
    pratica: [
      "Risciacquo freddo appena lo togli, finché l'acqua esce quasi limpida.",
      "Se lavi più tardi: ammollo freddo cambiando l'acqua ogni giorno, oppure asciugatura all'aria. Mai chiuso e umido.",
      "Lavaggio con l'intimo a 60°C sui chiari, o a 40°C con ossigeno attivo sui colorati. Bottoncini chiusi, in retina.",
      "Niente ammorbidente né candeggina. Se c'è uno strato impermeabile (PUL): massimo 60°C e niente asciugatrice calda.",
      "Al sole se puoi: gli UV schiariscono gli aloni."
    ],
    rel: ["sangue", "ammorbidente", "sessanta", "stendere"]
  },
  {
    id: "ossigeno", cat: "chimica",
    title: "Dove finisce il colore di una macchia sbiancata?",
    ask: "Quando il percarbonato fa sparire una macchia di vino, le molecole del vino…",
    opts: [
      ["Vengono sciolte e portate via", false, "In parte succede, ma la maggior parte del lavoro è un altro."],
      ["Cambiano struttura e smettono di assorbire la luce", true],
      ["Evaporano col calore", false, "I pigmenti del vino non sono volatili."]
    ],
    body: [
      "Il <b>percarbonato di sodio</b> (2Na₂CO₃·3H₂O₂) è carbonato di sodio 'impacchettato' con acqua ossigenata. In acqua si separa: il carbonato alza il pH, e a pH alcalino l'acqua ossigenata forma lo <b>ione idroperossido (HOO⁻)</b>, l'ossidante vero e proprio.",
      "I pigmenti delle macchie (antociani del vino, tannini del caffè, carotenoidi) sono colorati perché hanno lunghe catene di <b>doppi legami coniugati</b> che assorbono la luce visibile. L'ossidante spezza quella coniugazione: la molecola esiste ancora, ma non assorbe più nel visibile e diventa incolore. Frammentata, è anche più facile da rimuovere. Per questo si chiama sbiancare: non lava, spegne i cromofori.",
      "Lavora bene da 40°C, al meglio verso 60°C. Nei detersivi in polvere c'è un attivatore, il <b>TAED</b>, che reagendo con l'acqua ossigenata forma acido peracetico, attivo già a 30–40°C."
    ],
    ana: "Come una lampadina col filo tagliato: è ancora lì, ma non fa più luce. Il cromoforo è il filamento, l'ossidante la forbice.",
    pratica: [
      "Bianchi e spugna: 1–2 cucchiai nel cestello a 40–60°C.",
      "Colori solidi: di solito sì, ma prova su una cucitura interna.",
      "Mai su lana, seta, pelle (ossida le proteine) e su metalli delicati.",
      "Non metterlo nello stesso lavaggio con aceto o acido citrico: abbassi il pH e spegni lo ione HOO⁻. Se li usi entrambi, l'acido va nella vaschetta dell'ammorbidente, che entra solo nell'ultimo risciacquo.",
      "Ammollo per macchie ostinate: un cucchiaio per litro d'acqua a 40–50°C, qualche ora."
    ],
    rel: ["polvere_liquido", "sbiancanti", "aceto_bicarbonato"]
  },
  {
    id: "polvere_liquido", cat: "chimica",
    title: "Perché nel liquido non c'è il candeggiante?",
    ask: "Esistono detersivi in polvere con candeggiante all'ossigeno, ma quasi nessun liquido lo contiene. Perché?",
    opts: [
      ["Costerebbe troppo", false, "Il percarbonato è economico: il problema è un altro."],
      ["Si decomporrebbe dentro il flacone", true],
      ["I liquidi sono pensati solo per i colorati", false, "Esistono liquidi universali: semplicemente non possono contenere ossidanti solidi."]
    ],
    body: [
      "Il perossido 'vive' bene solo finché è secco e cristallizzato. In un prodotto a base d'acqua si decomporrebbe lentamente e ossiderebbe il resto della formula, enzimi compresi, perdendo efficacia già sullo scaffale.",
      "Da qui due prodotti con personalità diverse. La <b>polvere</b>: tensioattivi, builder (zeoliti, carbonati), percarbonato con TAED, sbiancanti ottici. Ideale per bianchi, macchie colorate ossidabili, 40–60°C. Il <b>liquido</b>: più tensioattivi non ionici ed enzimi, niente ossidanti. Si scioglie subito anche a 20°C, è ottimo sul grasso ed è delicato sui colori.",
      "Le capsule sono detersivo liquido concentrato: niente ossigeno attivo nemmeno lì."
    ],
    ana: "Come un antibiotico in polvere da ricostituire: stabile finché è secco, una volta in sospensione ha i giorni contati (e va tenuto in frigo).",
    pratica: [
      "Bianchi: polvere, oppure liquido più un cucchiaio di percarbonato.",
      "Colorati e scuri: liquido per colorati.",
      "A 20–30°C la polvere può non sciogliersi del tutto e lasciare aloni bianchi: sciogli la dose in un bicchiere d'acqua tiepida."
    ],
    rel: ["ossigeno", "capsule", "sbiancanti"]
  },
  {
    id: "candeggina", cat: "chimica",
    title: "Candeggina: potentissima, e per questo pericolosa",
    ask: "Cosa succede se mescoli candeggina con aceto o con un anticalcare acido?",
    opts: [
      ["Si neutralizzano e non succede nulla", false, "Purtroppo succede qualcosa di molto peggiore."],
      ["Diventa più efficace", false, "Diventa più pericolosa, non più efficace."],
      ["Si libera cloro gassoso, tossico", true]
    ],
    body: [
      "La candeggina è <b>ipoclorito di sodio</b> (NaClO) in soluzione alcalina: un ossidante potente che spegne i cromofori come il percarbonato e uccide la maggior parte dei microrganismi.",
      "A pH acido l'ipoclorito diventa acido ipocloroso e poi <b>cloro gassoso (Cl₂)</b>, irritante per le vie respiratorie. Con ammoniaca (o urina) forma le <b>clorammine</b>, anch'esse tossiche. Per questo non va mai mescolata con altri prodotti.",
      "Sui tessuti: distrugge lana e seta (proteine), ingiallisce e indebolisce l'elastan, schiarisce i colori in modo irreversibile. Nelle acque di scarico può formare composti organoclorurati persistenti."
    ],
    ana: "Il tuo sistema immunitario la usa davvero: i neutrofili producono acido ipocloroso con la mieloperossidasi per uccidere i batteri fagocitati. Arma potentissima in dosi mirate e nel posto giusto, dannosa se fuori controllo.",
    pratica: [
      "Per il bucato di tutti i giorni non serve: 60°C più ossigeno attivo bastano anche per l'igiene.",
      "Se la usi: solo cotone o lino bianchi senza elastan, diluita, da sola.",
      "Triangolo sbarrato sull'etichetta = niente candeggianti. Triangolo con due righe = solo ossigeno."
    ],
    rel: ["ossigeno", "sessanta", "aceto_bicarbonato"]
  },
  {
    id: "durezza", cat: "chimica",
    title: "Perché con l'acqua dura serve più detersivo?",
    ask: "Con acqua molto calcarea il flacone consiglia una dose più alta. Perché?",
    opts: [
      ["L'acqua dura è più sporca", false, "È acqua potabile come le altre: contiene solo più sali disciolti."],
      ["Il calcio 'cattura' una parte del detersivo", true],
      ["Il calcare graffia le fibre", false, "I depositi irrigidiscono, ma la ragione della dose è chimica."]
    ],
    body: [
      "La durezza misura gli ioni <b>calcio (Ca²⁺)</b> e <b>magnesio (Mg²⁺)</b> disciolti. In Italia si esprime in gradi francesi: 1 °F corrisponde a 10 mg di carbonato di calcio per litro.",
      "I tensioattivi anionici hanno la testa carica negativamente: il calcio ci si lega e forma sali insolubili. È la patina che ingrigisce i bianchi e rende rigidi gli asciugamani, la stessa che il sapone lascia sul bordo della vasca.",
      "Per difendersi i detersivi contengono i <b>builder</b>: sostanze che sequestrano il calcio prima che rovini i tensioattivi. Zeoliti (gabbie che scambiano Ca²⁺ con Na⁺), citrati, policarbossilati. Con acqua dura i builder si esauriscono prima, quindi serve più prodotto. Scaldando, poi, il bicarbonato di calcio precipita come carbonato: è il calcare sulla resistenza."
    ],
    ana: "È il principio delle provette: il citrato nella provetta azzurra della coagulazione e l'EDTA in quella viola chelano il calcio per impedire che il sangue coaguli. Il citrato nel detersivo fa lo stesso lavoro: toglie il calcio di mezzo.",
    pratica: [
      "Cerca la durezza della tua acqua sul sito del gestore idrico e impostala in Dispensa: l'app scala le dosi.",
      "Con acqua dura usa l'acido citrico nella vaschetta dell'ammorbidente.",
      "Il sottodosaggio con acqua dura è la causa più comune dei bianchi grigi."
    ],
    rel: ["acido_citrico", "dose", "sapone"]
  },
  {
    id: "acido_citrico", cat: "chimica",
    title: "L'acido citrico ammorbidisce senza essere un ammorbidente",
    ask: "Messo nella vaschetta dell'ammorbidente, l'acido citrico rende i capi più morbidi perché…",
    opts: [
      ["Riveste le fibre di una pellicola", false, "Questo è il meccanismo dell'ammorbidente vero: l'acido citrico fa il contrario."],
      ["Toglie calcare e residui alcalini che le irrigidiscono", true],
      ["Profuma il bucato", false, "È inodore."]
    ],
    body: [
      "Dopo il lavaggio nelle fibre restano due cose che le rendono ruvide: microcristalli di sali di calcio e magnesio, e residui di detersivo alcalino.",
      "L'<b>acido citrico</b>, un acido tricarbossilico, abbassa il pH neutralizzando i residui alcalini e <b>chela il calcio</b>, sciogliendo i depositi tra le fibre. Libere di scorrere l'una sull'altra, le fibre tornano morbide senza che venga aggiunto nulla sopra. Bonus: la lavatrice resta pulita dal calcare.",
      "Ricetta della soluzione al 15%: 150 g di acido citrico in 1 litro d'acqua, in una bottiglia etichettata. Circa 100 ml nella vaschetta ⚘."
    ],
    ana: "È la differenza tra il balsamo, che aggiunge un rivestimento al capello, e il risciacquo acido con aceto o limone che si usava una volta: il primo aggiunge, il secondo toglie.",
    pratica: [
      "Perfetto con acqua dura e sugli asciugamani: non riduce l'assorbenza.",
      "Mai nello stesso lavaggio con la candeggina.",
      "Conserva la soluzione lontano dai bambini: negli occhi è irritante."
    ],
    rel: ["durezza", "ammorbidente", "candeggina"]
  },
  {
    id: "ammorbidente", cat: "chimica",
    title: "Perché l'ammorbidente rovina gli asciugamani",
    ask: "Gli asciugamani lavati sempre con l'ammorbidente asciugano peggio. Perché?",
    opts: [
      ["Si consumano prima", false, "L'usura c'entra poco."],
      ["Restano coperti da un film che respinge l'acqua", true],
      ["Trattengono il detersivo", false, "Il problema non è il detersivo ma ciò che aggiungi dopo."]
    ],
    body: [
      "L'ammorbidente contiene <b>tensioattivi cationici</b> (esterquat, sali di ammonio quaternario): una testa carica positivamente e due code grasse. In acqua il cotone ha una carica superficiale negativa: le molecole si attaccano per attrazione elettrostatica con la testa sulla fibra e le code verso l'esterno, come un tappeto lubrificante.",
      "Risultato: meno attrito (la morbidezza), meno elettricità statica, profumo. Ma le code sono idrofobe. Sull'asciugamano formano un film che rallenta l'assorbimento; sui tessuti tecnici occludono i canali che portano via il sudore; sulle microfibre riempiono gli spazi che catturano lo sporco; nei piumini incollano i filamenti.",
      "In più le microcapsule di profumo sono spesso polimeriche, cioè microplastiche, e i residui di ammorbidente nutrono il biofilm nella vaschetta."
    ],
    ana: "È la stessa chimica di shampoo e balsamo: lo shampoo è anionico e lava, il balsamo è cationico e si deposita sul capello, carico negativamente, rendendolo scorrevole. L'ammorbidente è un balsamo per vestiti.",
    pratica: [
      "No su spugna, abbigliamento sportivo e tecnico, microfibra, piumini, giacche impermeabili.",
      "Se ti piace sul cotone liscio, ne basta metà della dose indicata.",
      "Alternativa: acido citrico nella vaschetta, poi sbatti i capi prima di stenderli."
    ],
    rel: ["acido_citrico", "biofilm", "sport_odori"]
  },
  {
    id: "sbiancanti", cat: "chimica",
    title: "Più bianco del bianco: un trucco di luce",
    ask: "Gli sbiancanti ottici fanno sembrare il bucato più bianco…",
    opts: [
      ["Togliendo lo sporco giallo", false, "Non tolgono nulla: aggiungono."],
      ["Aggiungendo luce blu che compensa il giallo", true],
      ["Ossidando le macchie", false, "Questo è il lavoro dell'ossigeno attivo, un'altra molecola."]
    ],
    body: [
      "Gli sbiancanti ottici sono molecole <b>fluorescenti</b> (spesso derivati dello stilbene) che restano sulle fibre: assorbono ultravioletto invisibile, intorno ai 350 nm, e riemettono luce blu, intorno ai 430–450 nm.",
      "Col tempo il cotone tende al giallo (sebo ossidato, residui). Il blu è il complementare del giallo: la somma appare bianca, anzi più luminosa, perché il capo restituisce più luce visibile di quella che riceve nel visibile. È per questo che le camicie bianche brillano sotto le lampade UV.",
      "Non lavano niente: è un'illusione ottica utile. Sui pastelli però alterano la tinta (un rosa diventa più freddo), ed è per questo che i detersivi per colorati non li contengono."
    ],
    ana: "Il turchinetto delle nonne faceva la stessa correzione con un pigmento blu. In oculistica la fluoresceina sfrutta lo stesso fenomeno: assorbe luce blu e riemette verde, rendendo visibili le lesioni della cornea.",
    pratica: [
      "Bianchi: detersivo in polvere, che li contiene.",
      "Pastelli e colorati: detersivo per colorati.",
      "Un bianco grigio non dipende quasi mai dalla mancanza di sbiancanti: guarda prima durezza dell'acqua, dose e colori mischiati."
    ],
    rel: ["ossigeno", "durezza", "polvere_liquido"]
  },
  {
    id: "sapone", cat: "chimica",
    title: "Sapone di Marsiglia: ottimo sui colletti, meno in lavatrice",
    ask: "Il sapone 'vero', in acqua dura…",
    opts: [
      ["Lava meglio", false, "Il calcio è proprio il suo punto debole."],
      ["Forma grumi insolubili con il calcio", true],
      ["Si comporta come un detersivo moderno", false, "I detersivi moderni hanno tensioattivi e builder pensati per resistere al calcio."]
    ],
    body: [
      "Il sapone è un insieme di <b>sali di sodio di acidi grassi</b>, ottenuti scaldando oli vegetali con soda (saponificazione). È un tensioattivo anionico naturale, molto efficace su sebo e grasso di colli e polsini.",
      "In acqua dura però il calcio prende il posto del sodio e si formano <b>saponi di calcio</b> insolubili: patina grigia sui capi, tessuti rigidi, residui nella lavatrice. Inoltre è alcalino (pH 9–10): non adatto a lana e seta, e fa virare al grigio-blu le macchie di vino.",
      "I detersivi sintetici sono nati proprio per questo: tensioattivi meno sensibili al calcio, più builder che lo sequestrano."
    ],
    ana: "Come un farmaco storico ancora ottimo per un'indicazione mirata, ma superato come terapia di routine.",
    pratica: [
      "Colli e polsini: inumidisci, strofina la saponetta, lascia agire 10 minuti, poi lavaggio normale.",
      "Come detersivo unico in lavatrice ha senso solo con acqua dolce.",
      "Per lana e seta serve un detersivo a pH neutro."
    ],
    rel: ["tensioattivi", "durezza"]
  },

  // ───────── FISICA ─────────
  {
    id: "sinner", cat: "fisica",
    title: "Il cerchio di Sinner: le quattro leve del pulito",
    ask: "Il programma Eco 40-60 lava a temperatura più bassa e consuma meno, ma dura circa tre ore. Perché?",
    opts: [
      ["La lavatrice scalda più lentamente per risparmiare", false, "Il riscaldamento è una piccola parte della durata."],
      ["Per compensare il minor calore serve più tempo", true],
      ["Usa più risciacqui", false, "Anzi, i programmi Eco tendono a usare meno acqua."]
    ],
    body: [
      "Nel 1959 Herbert Sinner, chimico della Henkel, descrisse il lavaggio come la somma di quattro fattori: <b>chimica</b> (detersivo), <b>temperatura</b>, <b>azione meccanica</b> e <b>tempo</b>. Per ottenere lo stesso pulito, se ne riduci uno devi aumentare gli altri.",
      "Il programma Eco abbassa la temperatura, che è la voce più costosa in energia, e allunga il tempo: enzimi e tensioattivi hanno più tempo per lavorare e l'acqua penetra meglio. Un programma rapido fa il contrario: poco tempo, quindi serve più chimica o più calore, e spesso il risultato è peggiore.",
      "I programmi lana e delicati tagliano l'azione meccanica e la temperatura: la somma complessiva è più bassa, ed è per questo che non vanno bene per lo sporco pesante. Nella lavatrice di Oblò vedi le quattro barre per ogni programma."
    ],
    ana: "Pensa all'esposizione a un farmaco, l'area sotto la curva: una concentrazione più bassa mantenuta più a lungo può dare lo stesso effetto di un picco alto e breve. Il programma Eco è la somministrazione lenta.",
    pratica: [
      "Per il cotone normalmente sporco, Eco 40-60 è il programma più efficiente: è quello su cui si calcola l'etichetta energetica.",
      "Rapido solo per carichi piccoli e poco sporchi.",
      "Delicati e lana: solo per capi delicati, non per 'trattare bene' capi sporchi."
    ],
    rel: ["energia", "enzimi", "carico"]
  },
  {
    id: "energia", cat: "fisica",
    title: "Dove va l'energia di una lavatrice?",
    ask: "In un lavaggio a 40°C, quale voce consuma di più?",
    opts: [
      ["Il motore che fa girare il cestello", false, "Il motore consuma relativamente poco, anche in centrifuga."],
      ["Scaldare l'acqua", true],
      ["La pompa di scarico", false, "La pompa lavora pochi minuti."]
    ],
    body: [
      "Scaldare l'acqua richiede <b>Q = m · c · ΔT</b>, e l'acqua ha uno dei calori specifici più alti in natura: c = 4,186 kJ per kg e per grado.",
      "Facciamo i conti con 12 litri e acqua in ingresso a 15°C. A 40°C: 12 × 4,186 × 25 ≈ 1256 kJ, cioè circa <b>0,35 kWh</b>. A 60°C (ΔT = 45): circa <b>0,63 kWh</b>. A 90°C (ΔT = 75): circa <b>1,05 kWh</b>. Si stima che gran parte dell'energia di un lavaggio, spesso intorno al 90%, vada nel riscaldamento.",
      "Ora ragiona sulla proporzione: passare da 40 a 30°C porta ΔT da 25 a 15. Non è un risparmio del 25%, ma del <b>40%</b> sull'energia di riscaldamento. Quello che conta non è la temperatura finale, è il salto rispetto all'acqua che entra."
    ],
    ana: "L'alto calore specifico dell'acqua è lo stesso motivo per cui il nostro corpo, fatto in gran parte d'acqua, tiene stabile la temperatura, e per cui le città di mare hanno inverni più miti: l'acqua è un volano termico.",
    pratica: [
      "Con sporco leggero abbassa di 10°C: è il gesto ecologico con più effetto.",
      "Carichi pieni: la stessa acqua scaldata si divide su più capi.",
      "In inverno l'acqua in ingresso è più fredda: lo stesso programma consuma di più. Prova il calcolatore nel Laboratorio."
    ],
    rel: ["sinner", "sessanta", "carico"]
  },
  {
    id: "centrifuga", cat: "fisica",
    title: "Quanti g fa la tua centrifuga?",
    ask: "A 1400 giri al minuto, un calzino premuto contro il cestello subisce un'accelerazione di circa…",
    opts: [
      ["5 g", false, "Molto di più: fai il conto con ω²·r."],
      ["50 g", false, "Ancora un ordine di grandezza in più."],
      ["500 g", true]
    ],
    body: [
      "L'accelerazione centripeta è <b>a = ω² · r</b>, con ω = 2π · giri / 60. Con un cestello di 25 cm di raggio: a 1400 giri ω ≈ 147 rad/s e a ≈ 5400 m/s², circa <b>550 g</b>. A 800 giri circa 180 g, a 400 giri circa 45 g.",
      "L'acqua viene spinta verso l'esterno e attraverso i fori del cestello. Più giri significano capi più asciutti: indicativamente circa il 50% di umidità residua a 1400 giri, il 60% a 1000, il 70% a 800. E l'acqua che resta va poi evaporata, pagando il calore latente: circa 2260 kJ per ogni kg. In asciugatrice è energia elettrica, sullo stendino è energia gratis del sole e dell'aria.",
      "Ma più giri significano anche più pieghe, più stress sulle fibre deboli da bagnate (viscosa, lana) e più usura dell'elastan."
    ],
    ana: "Le centrifughe da laboratorio che separano il plasma dal sangue lavorano a qualche centinaio o migliaio di g: la tua lavatrice gioca nello stesso campionato.",
    pratica: [
      "Spugna e cotone robusto: 1200–1400 giri.",
      "Jeans e scuri: 800–1000 (meno pieghe, meno sbiadimento). Sintetici: 800. Delicati: 600. Lana: 400–600. Seta: 400 o a mano.",
      "Se usi l'asciugatrice, una centrifuga alta fa risparmiare molta più energia di quanta ne consumi."
    ],
    rel: ["pieghe", "viscosa", "stendere"]
  },
  {
    id: "carico", cat: "fisica",
    title: "Più pieno o più vuoto? La fisica del cestello",
    ask: "Se riempi il cestello fino all'orlo…",
    opts: [
      ["Lavi più capi con la stessa energia, quindi meglio", false, "L'energia per capo scende, ma il pulito crolla."],
      ["I capi non hanno spazio per cadere e si lavano peggio", true],
      ["Non cambia nulla", false, "Cambia molto: lo spazio è parte dell'azione meccanica."]
    ],
    body: [
      "In una lavatrice a carica frontale l'azione meccanica viene dalla <b>caduta</b>: il cestello solleva i capi, che ricadono nel bagno di lavaggio. Impatto e sfregamento fanno uscire lo sporco staccato dalla chimica.",
      "Se il cestello è stipato, i capi girano come un blocco unico: niente caduta, poca acqua che circola, risciacquo peggiore e residui di detersivo. Se è troppo vuoto sprechi acqua ed energia per capo, la centrifuga si sbilancia e, come vedrai nel box sulle microplastiche, un rapporto acqua/tessuto alto aumenta il rilascio di fibre.",
      "Regola pratica: per il cotone lascia lo spazio di un palmo in verticale tra i capi e il bordo superiore del cestello. Per sintetici e misti, metà cestello. Per la lana, un terzo o meno."
    ],
    ana: "Come un'impastatrice: con troppo impasto il gancio non riesce a lavorarlo, con troppo poco gira a vuoto.",
    pratica: [
      "Oblò stima il riempimento dai pesi tipici dei capi.",
      "Se il carico è basso, valuta se aspettare o unirlo a una cesta compatibile.",
      "Mezzo carico non vuol dire mezza dose: servono circa tre quarti."
    ],
    rel: ["microplastiche", "sinner", "dose"]
  },
  {
    id: "pieghe", cat: "fisica",
    title: "Perché i sintetici si stampano di pieghe con l'acqua calda?",
    ask: "Una camicia di poliestere lavata a 60°C esce piena di pieghe che non vanno più via. Cos'è successo?",
    opts: [
      ["Si è ristretta", false, "Il poliestere si restringe poco."],
      ["Ha superato la transizione vetrosa e le pieghe si sono fissate raffreddandosi", true],
      ["Il detersivo l'ha irrigidita", false, "Il detersivo non c'entra."]
    ],
    body: [
      "Il poliestere è un polimero termoplastico. Sotto la sua <b>temperatura di transizione vetrosa (Tg)</b>, circa 70–80°C da asciutto e qualche grado in meno in acqua, le catene sono 'congelate'; sopra diventano mobili.",
      "Lavando caldo e poi centrifugando e raffreddando i capi accartocciati, le catene si bloccano nella forma della piega: ecco pieghe quasi permanenti. È lo stesso principio della plissettatura permanente, che si fa piegando il tessuto e fissandolo col calore.",
      "Il programma sintetici usa temperature basse, centrifuga moderata e in molte macchine un raffreddamento graduale dell'acqua."
    ],
    ana: "Come una stecca termoplastica in ortopedia: la ammorbidisci in acqua calda, la modelli sul polso, raffreddandosi mantiene quella forma.",
    pratica: [
      "Sintetici: massimo 40°C, centrifuga 800.",
      "Tirali fuori appena finisce il ciclo e scuotili prima di stenderli.",
      "Le camicie sintetiche asciugate su gruccia spesso non hanno bisogno del ferro."
    ],
    rel: ["centrifuga", "restringimento"]
  },
  {
    id: "neri_grigi", cat: "fisica",
    title: "Perché i neri diventano grigi?",
    ask: "Un maglione nero dopo molti lavaggi sembra grigio, anche se il colorante è in gran parte ancora lì. Com'è possibile?",
    opts: [
      ["Il nero si scioglie nell'acqua", false, "Un po' di colorante si perde, ma non spiega tutto."],
      ["La superficie consumata diffonde luce bianca", true],
      ["È colpa del calcare", false, "Contribuisce, ma non è la causa principale."]
    ],
    body: [
      "Un tessuto appare nero perché assorbe quasi tutta la luce che lo colpisce. Con l'abrasione le fibre in superficie si rompono e si aprono in <b>microfibrille</b>: queste superfici irregolari riflettono e diffondono la luce bianca in tutte le direzioni. Il capo appare grigiastro anche se gran parte del colorante è ancora nella fibra.",
      "A questo si aggiungono un po' di colorante perso e i depositi di calcare e detersivo. Le <b>cellulasi</b> di alcuni detersivi per scuri tagliano le microfibrille sporgenti del cotone e riportano un aspetto più scuro."
    ],
    ana: "Il vetro smerigliato: stesso vetro trasparente, ma la superficie graffiata lo rende bianco opaco. O il cristallino con la cataratta: la trasparenza persa è un problema di diffusione della luce.",
    pratica: [
      "Scuri e jeans al rovescio: l'abrasione colpisce l'interno.",
      "30°C, centrifuga 800–1000, detersivo per scuri, carico non stipato.",
      "Asciuga all'ombra."
    ],
    rel: ["rovescio", "stendere", "carico"]
  },

  // ───────── FIBRE ─────────
  {
    id: "lana_feltro", cat: "fibre",
    title: "Perché la lana infeltrisce (e non si torna indietro)",
    ask: "Cosa serve perché un maglione di lana infeltrisca?",
    opts: [
      ["Solo il caldo", false, "Una lana immobile in acqua calda non infeltrisce: manca un ingrediente."],
      ["Acqua e movimento, con calore e pH alcalino che accelerano", true],
      ["Solo il detersivo sbagliato", false, "Il detersivo alcalino peggiora le cose, ma da solo non basta."]
    ],
    body: [
      "La fibra di lana è un pelo: <b>cheratina</b> rivestita da una cuticola di scaglie sovrapposte come tegole, tutte orientate dalla radice alla punta. Strofinata, la fibra scorre facilmente in un verso e si blocca nell'altro (<b>effetto di attrito differenziale</b>).",
      "Con l'agitazione in acqua ogni fibra 'cammina' in una sola direzione, si aggroviglia con le vicine e le scaglie si incastrano tra loro. Acqua calda e pH alcalino fanno gonfiare la fibra e sollevare le scaglie, accelerando tutto. Anche lo shock termico, da caldo a freddo, peggiora le cose.",
      "Il processo è irreversibile: è proprio così che si fabbrica il feltro. Il programma lana usa acqua fredda o tiepida e un movimento 'a culla' minimo."
    ],
    ana: "Sono capelli. Prendi un capello tra pollice e indice e sfregalo: senti che avanza in un verso solo. I dreadlocks si formano con lo stesso meccanismo.",
    pratica: [
      "Programma lana, massimo 30°C, centrifuga bassa, niente asciugatrice.",
      "Detersivo neutro senza proteasi. In emergenza uno shampoo delicato: è fatto per la cheratina.",
      "Stendi in piano: bagnata, la lana si allunga sotto il proprio peso."
    ],
    rel: ["enzimi", "piumini", "sinner"]
  },
  {
    id: "viscosa", cat: "fibre",
    title: "Viscosa: delicata anche se è cellulosa come il cotone",
    ask: "Viscosa e cotone sono entrambi cellulosa. Perché la viscosa va trattata come un delicato?",
    opts: [
      ["Perché in realtà è sintetica", false, "È artificiale ma non sintetica: è cellulosa del legno rigenerata."],
      ["Perché bagnata perde molta della sua resistenza", true],
      ["Perché teme il detersivo", false, "Il detersivo non c'entra."]
    ],
    body: [
      "La viscosa (e in misura minore modal e lyocell) è cellulosa del legno sciolta chimicamente e riformata in filamenti. Le sue catene sono più corte e meno ordinate di quelle del cotone: ha meno zone cristalline e più zone amorfe.",
      "In acqua le zone amorfe assorbono molta acqua, si gonfiano e i legami idrogeno tra le catene si allentano. Bagnata la viscosa può perdere circa metà della sua resistenza, si deforma e si restringe facilmente. Il cotone, al contrario, da bagnato è persino un po' più resistente."
    ],
    ana: "Come un cartone: asciutto regge, bagnato si affloscia. Stesso materiale della carta di un libro antico, ma organizzazione diversa.",
    pratica: [
      "Delicati 30°C, centrifuga 600 o meno, in retina.",
      "Non strizzare: stendi su gruccia o in piano.",
      "Stira al rovescio a temperatura media mentre è appena umida."
    ],
    rel: ["centrifuga", "restringimento"]
  },
  {
    id: "restringimento", cat: "fibre",
    title: "Perché il cotone si restringe?",
    ask: "Una maglietta di cotone nuova si accorcia al primo lavaggio. Cosa succede alle fibre?",
    opts: [
      ["Si accorciano per il calore", false, "Le fibre di cotone non si accorciano col calore: cambia la loro disposizione."],
      ["Il tessuto era stato tirato in produzione e l'acqua libera quelle tensioni", true],
      ["Il detersivo le scioglie", false, "Il detersivo non scioglie la cellulosa."]
    ],
    body: [
      "Durante filatura, tessitura e finissaggio i fili sono tenuti in tensione e il tessuto viene asciugato in forma tesa. Le catene di cellulosa restano bloccate in una configurazione allungata da legami idrogeno.",
      "L'acqua è un <b>plastificante</b>: rompe temporaneamente i legami idrogeno, le fibre si gonfiano e il tessuto torna alla sua forma rilassata. È il <b>restringimento da rilassamento</b>. Calore e soprattutto il rotolamento in asciugatrice accelerano il processo, che è massimo nei primi lavaggi."
    ],
    ana: "Come un elastico tenuto tirato e fissato con la colla: bagnandolo la colla cede e l'elastico torna corto.",
    pratica: [
      "Cotone nuovo a cui tieni: 30–40°C e asciugatura all'aria per i primi lavaggi.",
      "Stendi il capo umido tirandolo delicatamente nella sua forma.",
      "L'asciugatrice calda è la prima responsabile dei capi accorciati."
    ],
    rel: ["pieghe", "viscosa", "stendere"]
  },
  {
    id: "sport_odori", cat: "fibre",
    title: "Perché le magliette sintetiche puzzano più del cotone?",
    ask: "Dopo la palestra, la maglia di poliestere puzza molto più di quella di cotone. Perché?",
    opts: [
      ["Fa sudare di più", false, "Anzi, spesso fa evaporare meglio il sudore."],
      ["Il poliestere trattiene il sebo e ospita batteri diversi", true],
      ["Colpa del detersivo", false, "Il detersivo può non bastare, ma l'origine è altrove."]
    ],
    body: [
      "Il poliestere è <b>oleofilo</b>: attira e trattiene le sostanze grasse del sebo e del sudore, che i lavaggi a bassa temperatura non rimuovono del tutto. Gli odori nascono dai batteri che degradano questi lipidi in acidi grassi a catena corta e composti solforati.",
      "Uno studio dell'Università di Gent del 2014 ha trovato che sul poliestere, dopo l'allenamento, proliferano soprattutto i micrococchi, associati a odori più intensi, mentre sul cotone no.",
      "L'ammorbidente peggiora le cose: chiude la trama tecnica che porta il sudore verso l'esterno e aggiunge altro materiale grasso."
    ],
    ana: "Il sebo sul poliestere è come il sugo di pomodoro su un contenitore di plastica: dal vetro va via, dalla plastica no, perché la plastica è lipofila come il grasso che ci si attacca.",
    pratica: [
      "Lava presto, non lasciare i capi sudati chiusi e umidi nel cesto.",
      "Al rovescio, 30–40°C con detersivo enzimatico (le lipasi attaccano il sebo).",
      "Due cucchiai di bicarbonato nel cestello neutralizzano gli acidi che puzzano. Mai ammorbidente.",
      "L'elastan teme il cloro e il calore oltre i 60°C: niente asciugatrice calda."
    ],
    rel: ["ammorbidente", "enzimi", "microplastiche"]
  },
  {
    id: "piumini", cat: "fibre",
    title: "Piumino in lavatrice: le palline non sono una leggenda",
    ask: "Perché nell'asciugatrice si mettono delle palline insieme al piumino?",
    opts: [
      ["Per profumarlo", false, "Le palline non profumano."],
      ["Per rompere i grumi di piuma bagnata e far circolare l'aria", true],
      ["Per bilanciare il cestello", false, "Il motivo è dentro il piumino, non nel cestello."]
    ],
    body: [
      "La piuma è <b>cheratina</b>, come lana e capelli, organizzata in ciuffi tridimensionali che intrappolano aria. È l'aria ferma a isolare, non la piuma in sé.",
      "Bagnata, la piuma collassa e si aggrega in grumi. Se asciuga così resta compatta e isola meno, e i grumi umidi all'interno possono ammuffire. Le palline battono il capo durante l'asciugatura, aprono i grumi e ripristinano il volume.",
      "Niente ammorbidente, che incollerebbe i filamenti, e un detersivo neutro, specifico per piumini o per lana."
    ],
    ana: "Come i capelli lasciati asciugare senza pettinarli: si appiccicano a ciocche. Le palline sono il pettine.",
    pratica: [
      "Programma piumini o delicati a 30°C, da solo.",
      "Centrifuga 600–800, anche due volte, per togliere più acqua possibile.",
      "Asciugatrice a bassa temperatura con 2–3 palline, più cicli, finché è asciutto anche dentro."
    ],
    rel: ["lana_feltro", "ammorbidente"]
  },

  // ───────── ECOLOGIA ─────────
  {
    id: "microplastiche", cat: "ecologia",
    title: "Il programma delicati riduce le microplastiche? Non proprio",
    ask: "Quale programma rilascia più microfibre dai capi sintetici?",
    opts: [
      ["Cotone 40 con tanti giri", false, "Intuitivo, ma i dati dicono altro."],
      ["Delicati, perché usa molta acqua", true],
      ["Rapido 30", false, "I cicli brevi e freddi in genere rilasciano meno."]
    ],
    body: [
      "Poliestere, acrilico e nylon perdono microfibre a ogni lavaggio. Una parte sfugge ai depuratori e finisce nei fiumi e nei mari, il resto nei fanghi di depurazione, spesso sparsi sui campi. Uno studio dell'Università di Plymouth (2016) ha stimato che un carico di 6 kg di acrilico possa rilasciarne fino a circa 700.000.",
      "Il dato controintuitivo arriva da Newcastle (2019): il fattore chiave è il <b>rapporto tra volume d'acqua e tessuto</b>. Il programma delicati, che usa molta acqua, rilasciava centinaia di migliaia di fibre in più di un programma standard. Non è il colpo violento a strappare le fibre, è il flusso d'acqua che le trascina fuori dalla trama."
    ],
    ana: "Come l'erosione di un argine: conta più quanta acqua scorre che la forza di un singolo colpo.",
    pratica: [
      "Sintetici a pieno carico (meno acqua per capo), a freddo, programmi brevi se poco sporchi.",
      "Un sacchetto anti-microfibre per sport e pile.",
      "Lava meno spesso ciò che non è sporco: arieggia.",
      "Quando compri, il pile è tra i tessuti che perdono di più."
    ],
    rel: ["carico", "lavare_meno", "sport_odori"]
  },
  {
    id: "dose", cat: "ecologia",
    title: "Più detersivo, più pulito?",
    ask: "Raddoppiare la dose di detersivo rende il bucato più pulito?",
    opts: [
      ["Sì, più tensioattivi più sporco tolto", false, "Solo fino a un certo punto, poi la curva si appiattisce."],
      ["No: oltre una certa dose aumentano solo i problemi", true]
    ],
    body: [
      "Oltre la concentrazione micellare critica i tensioattivi in più non aumentano proporzionalmente il pulito: lo sporco è già stato agganciato.",
      "L'eccesso fa troppa schiuma, che ammortizza la caduta dei capi (meno azione meccanica) e costringe a più risciacqui. I residui restano nelle fibre: le irrigidiscono, irritano la pelle, attirano nuovo sporco e nutrono il biofilm della lavatrice. E tutto quel detersivo arriva al depuratore.",
      "Il sottodosaggio però è un problema anche lui, soprattutto con acqua dura: i builder si esauriscono e i bianchi ingrigiscono."
    ],
    ana: "Una curva dose-risposta: oltre il plateau di efficacia, aumentando la dose crescono solo gli effetti avversi. Il detersivo ha un suo indice terapeutico.",
    pratica: [
      "Dosa in base a durezza dell'acqua, sporco e carico: Oblò lo calcola per te.",
      "Usa il misurino, non l'occhio.",
      "Mezzo carico: circa tre quarti della dose, non la metà."
    ],
    rel: ["tensioattivi", "durezza", "biofilm"]
  },
  {
    id: "sessanta", cat: "ecologia",
    title: "Quando serve il 60 (e il 90 quasi mai)",
    ask: "Quando ha senso lavare a 60°C?",
    opts: [
      ["Sempre per lenzuola e asciugamani, per sicurezza", false, "Spesso sì, ma non serve 'per sicurezza' a tutto il resto."],
      ["Quando c'è un rischio igienico reale", true],
      ["Mai, i detersivi moderni bastano", false, "A 30°C molti microrganismi vengono rimossi ma non uccisi."]
    ],
    body: [
      "A 30–40°C detersivo e risciacqui rimuovono la maggior parte dei microrganismi per diluizione e azione fisica, ma non li uccidono tutti.",
      "Per i carichi a rischio igienico (asciugamani, intimo, strofinacci, lenzuola, capi di chi ha un'infezione gastrointestinale o cutanea, divise da reparto) le raccomandazioni di igiene domestica indicano <b>60°C</b>, oppure <b>40°C con un detersivo con ossigeno attivo</b>.",
      "90°C raramente serve: consuma molto di più (ΔT 75 contro 45), sfibra il tessuto e mette fuori gioco gli enzimi. Il resto del bucato quotidiano non ne ha bisogno."
    ],
    ana: "Come un antibiotico ad ampio spettro: lo usi quando c'è un'indicazione, non di routine. Una sorta di stewardship della temperatura.",
    pratica: [
      "Spugna, intimo bianco, strofinacci: 60°C.",
      "Divise e capi colorati a rischio: 40°C con percarbonato, se l'etichetta non consente 60.",
      "Tutto il resto: 30–40°C."
    ],
    rel: ["energia", "ossigeno", "biofilm"]
  },
  {
    id: "stendere", cat: "ecologia",
    title: "Stendere al sole: igiene gratis o colori rovinati?",
    ask: "Cosa fa il sole a un bucato steso?",
    opts: [
      ["Sbianca e igienizza, ma sbiadisce i colori", true],
      ["Niente, asciuga e basta", false, "La luce ultravioletta fa parecchio."],
      ["Indurisce tutte le fibre", false, "Solo la spugna diventa più rigida, e per un altro motivo."]
    ],
    body: [
      "Gli ultravioletti hanno un'azione germicida: danneggiano il DNA dei microrganismi formando i dimeri di timina. E sbiancano per via fotochimica: spezzano i cromofori del giallo, ma anche quelli dei coloranti dei capi colorati.",
      "L'evaporazione al sole è gratis. Un'asciugatrice deve fornire il calore latente di evaporazione, circa 2260 kJ per kg d'acqua: quella a pompa di calore lo recupera in parte ed è molto più efficiente di quella a resistenza.",
      "La spugna asciugata all'aria diventa rigida perché gli anelli collassano e asciugando fermi si saldano con legami idrogeno; il rotolamento in asciugatrice li tiene separati."
    ],
    ana: "È la stessa idea della fototerapia per l'ittero neonatale: la luce modifica la struttura di una molecola gialla, la bilirubina, e la rende eliminabile.",
    pratica: [
      "Bianchi e spugna al sole.",
      "Colorati e scuri all'ombra e al rovescio.",
      "Spugna rigida: sbattila forte prima di stenderla, oppure 10 minuti di asciugatrice a fine asciugatura."
    ],
    rel: ["centrifuga", "profumo_sole", "neri_grigi"]
  },
  {
    id: "biofilm", cat: "ecologia",
    title: "Il bucato che puzza di umido appena lavato",
    ask: "Bucato appena lavato che sa di cantina. Il colpevole principale?",
    opts: [
      ["Il detersivo scaduto", false, "Il detersivo può perdere efficacia, ma l'odore ha un'origine viva."],
      ["Batteri che vivono nella lavatrice e nei capi rimasti bagnati", true],
      ["L'acqua dura", false, "Il calcare non ha odore."]
    ],
    body: [
      "Il classico odore di bucato rimasto in lavatrice è stato attribuito, in uno studio giapponese del 2012, soprattutto a <b>Moraxella osloensis</b>: un batterio che resiste all'essiccamento e ai raggi UV e produce acido 4-metil-3-esenoico, una molecola che il naso sente anche in tracce minime.",
      "Vive nel <b>biofilm</b> di guarnizione, cassetto e tubi, favorito da lavaggi sempre a bassa temperatura, residui di ammorbidente e detersivo, oblò chiuso. Lasciare i capi bagnati nel cestello per ore dà ai batteri il tempo di moltiplicarsi."
    ],
    ana: "Come la placca dentale o il biofilm su un catetere: una comunità batterica protetta da una matrice che si difende meglio dei batteri liberi, e che va rimossa meccanicamente e con trattamenti periodici.",
    pratica: [
      "Stendi entro 30–60 minuti dalla fine del ciclo.",
      "Lascia oblò e cassetto socchiusi, asciuga la guarnizione.",
      "Una volta al mese un ciclo a vuoto a 60–90°C con percarbonato o anticalcare.",
      "Ogni tanto un carico a 60°C tiene a bada il biofilm."
    ],
    rel: ["ammorbidente", "dose", "sessanta"]
  },
  {
    id: "fosfati", cat: "ecologia",
    title: "Fosfati, Ecolabel e biodegradabilità",
    ask: "Perché i fosfati sono stati quasi eliminati dai detersivi in Europa?",
    opts: [
      ["Sono tossici per l'uomo", false, "Il problema non è la nostra salute diretta."],
      ["Nutrono le alghe e soffocano laghi e mari", true],
      ["Rovinano le lavatrici", false, "Anzi, erano ottimi anticalcare."]
    ],
    body: [
      "Il tripolifosfato di sodio era il builder perfetto: sequestra il calcio. Ma scaricato nelle acque è un fertilizzante. Alghe e cianobatteri esplodono (<b>eutrofizzazione</b>), poi muoiono, e la loro decomposizione consuma l'ossigeno disciolto: zone senza ossigeno, morie di pesci.",
      "Nell'Unione europea i fosfati nei detersivi per bucato sono fortemente limitati dal 2013, e i tensioattivi devono per legge essere biodegradabili. L'<b>Ecolabel UE</b>, il fiore con la E, certifica limiti ulteriori su tossicità acquatica e imballaggi, ed efficacia anche a basse temperature."
    ],
    ana: "Come una stanza chiusa con troppi invitati: il cibo abbonda, ma alla fine è l'aria a mancare per tutti.",
    pratica: [
      "Cerca il fiore dell'Ecolabel.",
      "Dosare giusto è la scelta ecologica più semplice: meno detersivo, meno carico al depuratore.",
      "I concentrati riducono plastica e trasporti."
    ],
    rel: ["dose", "durezza"]
  },
  {
    id: "capsule", cat: "ecologia",
    title: "Capsule: comode, ma…",
    ask: "Qual è il limite principale delle capsule?",
    opts: [
      ["Lavano peggio", false, "Sono detersivo liquido concentrato: lavano come un liquido."],
      ["La dose è fissa e non si adatta a carico, acqua e sporco", true],
      ["Non si sciolgono mai del tutto", false, "Il film si scioglie, se la capsula va nel cestello e non nella vaschetta."]
    ],
    body: [
      "Il film esterno è <b>alcol polivinilico</b> (PVA), un polimero solubile in acqua. Dentro c'è detersivo concentrato con pochissima acqua, altrimenti scioglierebbe il film dall'interno.",
      "Una capsula è pensata per un carico pieno normale. Per mezzo carico o acqua dolce sovradosi, con acqua molto dura e sporco pesante sottodosi. Sulla biodegradabilità completa del PVA negli impianti di depurazione il dibattito scientifico è ancora aperto.",
      "Sono pericolose per i bambini: nell'UE devono avere confezioni opache e difficili da aprire, una sostanza amaricante e un film che non si scioglie prima di circa 30 secondi a contatto con l'acqua."
    ],
    ana: "Una compressa a dosaggio fisso contro uno sciroppo con la siringa dosatrice: comodità contro titolazione della dose.",
    pratica: [
      "Sul fondo del cestello, prima dei capi, con le mani asciutte. Mai nella vaschetta.",
      "Per i mezzi carichi meglio un liquido dosabile.",
      "Chiudi sempre la confezione."
    ],
    rel: ["dose", "polvere_liquido"]
  },
  {
    id: "mani", cat: "pelle",
    title: "Perché i detersivi irritano le mani",
    ask: "Dopo un lungo lavaggio a mano le mani tirano e si screpolano. Cosa è successo alla pelle?",
    opts: [
      ["Ha perso acqua, quindi è disidratata", false, "È vero, ma è la conseguenza: manca ciò che di solito trattiene l'acqua."],
      ["I tensioattivi hanno portato via i lipidi che fanno da barriera", true],
      ["È un'allergia al detersivo", false, "L'allergia esiste ma è rara. Molto più comune è l'irritazione, che non ha bisogno del sistema immunitario."]
    ],
    body: [
      "Lo strato più esterno della pelle, lo strato corneo, funziona come un muro di <b>mattoni e malta</b>. I mattoni sono i corneociti, cellule morte piene di cheratina; la malta è un impasto di lipidi (ceramidi, colesterolo, acidi grassi liberi) disposti in lamelle. È la malta che trattiene l'acqua dentro e tiene fuori le sostanze irritanti.",
      "I tensioattivi non distinguono il grasso della macchia da quello della malta: emulsionano anche quello e lo portano via. Alcuni, come il laurilsolfato di sodio, si legano pure alla cheratina e la fanno gonfiare. Da una barriera bucata l'acqua evapora più in fretta (aumenta la perdita d'acqua transepidermica): la pelle diventa secca, ruvida, screpolata, e lascia entrare più facilmente altri irritanti.",
      "Due aggravanti. Il <b>pH</b>: la superficie della pelle è acida, intorno a pH 4,5–5,5, il cosiddetto mantello acido. Percarbonato, soda e sapone di Marsiglia la spingono verso l'alcalino, e a pH più alto si attivano enzimi che sciolgono i legami tra i corneociti. Il <b>calore</b>: l'acqua calda scioglie la malta più in fretta.",
      "Ripetuto nel tempo, questo si chiama <b>dermatite irritativa da contatto</b>, la forma più comune di eczema delle mani. Nella medicina del lavoro si parla di lavoro bagnato oltre circa 2 ore al giorno con le mani in acqua o dentro guanti occlusivi, o oltre una ventina di lavaggi delle mani: anche il guanto, tenuto a lungo, fa macerare la pelle nel sudore."
    ],
    ana: "È il motivo per cui in reparto, quando le mani non sono visibilmente sporche, si preferisce la frizione alcolica al lavaggio con acqua e sapone: il gel con emollienti evapora in fretta e porta via molti meno lipidi della barriera. L'eczema delle mani di chi lavora in ospedale è il caso da manuale del lavoro bagnato.",
    pratica: [
      "Guanti per l'acqua calda, i prodotti alcalini e gli ammolli; mani nude solo per risciacqui brevi in acqua fredda.",
      "Guanti in nitrile, con un sottoguanto di cotone se li tieni a lungo. Toglili appena senti sudare.",
      "Pinze per gli ammolli e spazzolino per le macchie: meno dita nel detersivo.",
      "Dopo: sciacqua, asciuga bene anche tra le dita, crema emolliente con glicerina o ceramidi."
    ],
    rel: ["tensioattivi", "enzimi", "candeggina"]
  },
  {
    id: "ammollo", cat: "fisica",
    title: "Ammollo: quando il tempo lava al posto tuo",
    ask: "Un'ora di ammollo freddo toglie una macchia di sangue meglio di cinque minuti di strofinate. Perché?",
    opts: [
      ["Perché l'acqua fredda è più aggressiva", false, "Al contrario, è più gentile. Il vantaggio sta altrove."],
      ["Perché il rigonfiamento delle fibre e la diffusione dello sporco hanno bisogno di tempo", true],
      ["Perché col tempo il detersivo si concentra", false, "La concentrazione resta la stessa: cambia quanto sporco riesce a uscire."]
    ],
    body: [
      "Lo sporco incastrato nella trama deve fare un viaggio: l'acqua deve entrare nella fibra, sciogliere o staccare lo sporco, e lo sporco deve diffondere fuori. La diffusione è lenta: secondo la legge di Fick, il tempo per percorrere una distanza cresce con il quadrato della distanza. Nei fili ritorti e nelle fibre le distanze sono piccole, ma tortuose.",
      "In acqua il cotone si gonfia: le zone amorfe della cellulosa assorbono acqua e la fibra si apre, liberando lo sporco intrappolato. Gli enzimi, se ci sono, hanno il tempo di tagliare proteine e amidi in frammenti solubili. È la quarta leva del cerchio di Sinner: il tempo che sostituisce calore e strofinate.",
      "Ma l'ammollo ha dei limiti. Un'acqua ferma e piena di sporco organico è anche un terreno di coltura: dopo molte ore a temperatura ambiente i batteri si moltiplicano e l'acqua comincia a puzzare. Il colorante libero si ridistribuisce sulle zone chiare, e l'elastan e i rivestimenti impermeabili soffrono l'immersione lunga. Per questo l'ammollo ha una durata, e l'acqua si cambia."
    ],
    ana: "Come un impacco: una garza umida lasciata in posa ammorbidisce una crosta molto meglio che strofinarla, e senza danneggiare la pelle sotto.",
    pratica: [
      "Macchie proteiche: ammollo freddo, da 30 minuti a qualche ora.",
      "Ingrigimenti e aloni sui bianchi: ammollo a 40–50°C con percarbonato.",
      "Oltre 12–24 ore cambia l'acqua, oppure lascia asciugare all'aria fino al lavaggio.",
      "Un coperchio sul secchio: meno odori e meno evaporazione."
    ],
    rel: ["sinner", "sangue", "lavabili"]
  },
  {
    id: "mano_o_lavatrice", cat: "ecologia",
    title: "A mano o in lavatrice: chi consuma meno?",
    ask: "Due maglioni di lana: meglio una bacinella o un ciclo lana in lavatrice?",
    opts: [
      ["La lavatrice: è sempre più efficiente", false, "Lo è con i carichi pieni. Con due capi vince la bacinella."],
      ["La bacinella: pochi litri e niente da scaldare", true],
      ["È uguale", false, "Un ciclo ha un costo fisso di acqua ed energia anche con due capi dentro."]
    ],
    body: [
      "Una lavatrice moderna usa all'incirca 40–60 litri per un ciclo completo, e il ciclo lana è tra i più ricchi d'acqua in rapporto al carico. Con due capi soli, quell'acqua e l'energia del ciclo si dividono su pochissimi chili.",
      "In bacinella, un capo delicato chiede circa 5 litri per il lavaggio e 5–10 per i risciacqui, a freddo o tiepido. Il segreto è proprio la bacinella: risciacquare sotto il rubinetto aperto consuma 6–12 litri al minuto e si mangia tutto il vantaggio.",
      "Con un carico pieno, invece, la lavatrice vince quasi sempre: dosa l'acqua, centrifuga meglio di qualsiasi strizzata (e l'acqua che resta nei capi andrà poi fatta evaporare), e non tiene le tue mani nel detersivo.",
      "La regola che ne esce: pochi capi delicati a mano, tutto il resto a carichi pieni in lavatrice."
    ],
    ana: "Autobus o bicicletta: con tanti passeggeri l'autobus consuma meno per persona, per uno solo vince la bicicletta.",
    pratica: [
      "Fino a 2–3 capi delicati: bacinella.",
      "Risciacqua immergendo in una seconda bacinella, non sotto il getto.",
      "Tutto il resto a carichi pieni in lavatrice."
    ],
    rel: ["carico", "energia", "compromesso"]
  },
  {
    id: "spugne", cat: "ecologia",
    title: "Spugne, spazzole e microplastiche",
    ask: "La gomma magica (spugna di melamina) toglie i segni dalle suole così bene perché…",
    opts: [
      ["Contiene un detergente potentissimo", false, "Non contiene detergenti: è solo una schiuma."],
      ["È un abrasivo finissimo che si consuma mentre strofini", true],
      ["Attira lo sporco con l'elettricità statica", false, "L'effetto è puramente meccanico."]
    ],
    body: [
      "La spugna di melamina è una schiuma di resina melammina-formaldeide molto rigida: al microscopio è una rete di filamenti duri e sottilissimi, che si comporta come una carta abrasiva finissima. Lo sporco viene grattato via e, intanto, la spugna si consuma: per questo si rimpicciolisce.",
      "Quello che perde sono microfibre di plastica. Uno studio pubblicato nel 2024 su <i>Environmental Science &amp; Technology</i> ha stimato circa 6,5 milioni di fibre per grammo di spugna consumata, e oltre mille miliardi di fibre al mese nel mondo, contando solo le vendite online.",
      "Anche le spugne sintetiche comuni, in poliuretano o poliestere, perdono frammenti con l'uso. Le alternative: spugne di cellulosa (fibra vegetale rigenerata, compostabile), luffa (il frutto essiccato di una pianta della famiglia delle zucche), spazzole durevoli. Uno spazzolino vecchio è il riuso perfetto: setole morbide, testa piccola, già in casa."
    ],
    ana: "È come la carta vetrata: leviga perché i suoi granelli si staccano e si consumano insieme al materiale. Solo che i granelli della melamina finiscono nello scarico.",
    pratica: [
      "Suole e bordi: prima pasta di bicarbonato e spazzola, la gomma magica solo se serve davvero.",
      "Se la usi: bagnata, su piccole zone, e strizzala nel secchio dell'indifferenziato, non nel lavandino.",
      "Spugne di cellulosa o luffa per i lavaggi a mano, spazzolino vecchio per le macchie."
    ],
    rel: ["microplastiche", "lavare_meno"]
  },
  {
    id: "compromesso", cat: "ecologia",
    title: "Una lavatrice in meno: quanto vale un compromesso?",
    ask: "Hai 2 kg di bianchi e 2 kg di colorati. Cosa consuma meno: due lavaggi separati, o uno solo da 4 kg a 30°C?",
    opts: [
      ["Due lavaggi: ognuno è più leggero, quindi consuma la metà", false, "Il consumo di una lavatrice dipende poco dal peso: l'acqua da scaldare, i risciacqui e il motore ci sono comunque."],
      ["Uno solo: acqua ed energia si dividono su più capi", true],
      ["È uguale", false, "Un ciclo ha un costo fisso alto: due cicli lo pagano due volte."]
    ],
    body: [
      "Una lavatrice spende acqua ed energia quasi indipendentemente da quanto è piena: deve scaldare il bagno, fare i risciacqui, far girare il cestello. Le macchine moderne riducono un po' l'acqua con i carichi piccoli, ma il consumo <b>per chilo di bucato</b> cresce molto quando il cestello è mezzo vuoto. È anche il motivo per cui l'etichetta energetica europea misura i consumi a diversi livelli di carico.",
      "Il compromesso di un carico misto si governa con le leve che già conosci: <b>temperatura bassa</b>, perché a 30°C il colorante diffonde poco fuori dalla fibra; <b>acchiappacolore</b>, che cattura il colorante libero; <b>detersivo per colorati</b>, senza sbiancanti; <b>retina</b> per i delicati; <b>centrifuga</b> regolata sul capo più fragile. Il prezzo lo paga sempre il capo più esigente: i bianchi perdono un po' di splendore, la spugna l'igiene dei 60°C, il cotone esce più umido.",
      "Il piano di Oblò prova tutti i raggruppamenti possibili delle ceste e sceglie quello con meno lavatrici; a parità, quello con i compromessi più leggeri. Per ogni coppia di ceste valuta tre cose: il <b>colore</b> (chi macchia chi), il <b>tessuto</b> (quale programma reggono tutti) e l'<b>igiene</b> (chi perde i 60°C). Lana, piumini e capi che stingono restano isolati, o vanno a mano se sono pochi."
    ],
    ana: "È il cohorting di un reparto: chi ha lo stesso profilo di rischio condivide la stanza con le precauzioni giuste, e si isola solo chi deve davvero esserlo. Nel cestello le precauzioni sono temperatura, acchiappacolore e retina.",
    pratica: [
      "Meno lavatrici: carichi pieni a 30°C, due acchiappacolore, scuri al rovescio, delicati in retina.",
      "Ogni tanto concedi a bianchi e spugna un lavaggio da soli a 60°C: recuperi bianco e igiene.",
      "Pochi capi di lana o seta: a mano. I capi nuovi che stingono: primo lavaggio a mano, poi con i colori simili."
    ],
    rel: ["carico", "acchiappacolore", "sessanta", "energia"]
  },
  {
    id: "lavare_meno", cat: "ecologia",
    title: "Il lavaggio più ecologico è quello che non fai",
    ask: "Un paio di jeans va lavato…",
    opts: [
      ["Dopo ogni uso", false, "Non serve, e li consuma."],
      ["Quando è sporco o ha odore, spesso dopo diversi utilizzi", true],
      ["Mai: basta metterli in freezer", false, "Il freddo non uccide i batteri, li mette in pausa."]
    ],
    body: [
      "Ogni lavaggio costa acqua, energia, detersivo, microfibre e usura: abrasione, perdita di colore, restringimento. Molti capi esterni (jeans, maglioni, giacche) toccano poco la pelle: arieggiarli e smacchiare localmente basta per diversi utilizzi.",
      "Il mito dei jeans in freezer: il freddo rallenta i batteri della pelle ma non li uccide. Quando il tessuto torna a temperatura ambiente gli odori ritornano."
    ],
    ana: "Il congelamento per i batteri è un'ibernazione, non una sentenza: nei laboratori i ceppi batterici si conservano proprio a −80°C per farli ripartire anni dopo.",
    pratica: [
      "Intimo, calzini, sport, asciugamani: dopo ogni uso o pochi utilizzi.",
      "Jeans, maglioni, felpe: quando servono.",
      "Arieggia su gruccia, smacchia subito localmente."
    ],
    rel: ["microplastiche", "neri_grigi", "energia"]
  },

  // ───────── MITI ─────────
  {
    id: "aceto_bicarbonato", cat: "miti",
    title: "Aceto e bicarbonato insieme puliscono di più",
    ask: "Vero o falso? La schiuma di aceto e bicarbonato è la prova che stanno pulendo.",
    opts: [
      ["Vero", false, "La schiuma è reale, ma non è pulizia."],
      ["Falso: si neutralizzano a vicenda", true]
    ],
    body: [
      "NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂. La schiuma è anidride carbonica: spettacolare, ma alla fine ti resta acqua con acetato di sodio, un sale praticamente inerte.",
      "Separati sono utili: il bicarbonato è una base debole che deodora neutralizzando gli acidi grassi del sudore; l'aceto è un acido debole che scioglie il calcare. Insieme si annullano.",
      "Se vuoi usarli entrambi, separali nel tempo: bicarbonato nel cestello durante il lavaggio, acido nella vaschetta ⚘, che la lavatrice preleva solo all'ultimo risciacquo."
    ],
    ana: "Come iniettare nella stessa siringa un farmaco e il suo antagonista: tanto movimento, effetto netto zero.",
    pratica: [
      "Bicarbonato: odori di sport, nel cestello.",
      "Acido citrico o aceto: nella vaschetta dell'ammorbidente.",
      "Mai nella stessa vaschetta."
    ],
    rel: ["acido_citrico", "ossigeno"]
  },
  {
    id: "sale_colori", cat: "miti",
    title: "Il sale fissa i colori",
    ask: "Vero o falso? Un pugno di sale in lavatrice impedisce a un capo nuovo di stingere.",
    opts: [
      ["Vero", false, "Il sale serve davvero, ma in un altro momento della vita del tessuto."],
      ["Falso, per i capi che compri già tinti", true]
    ],
    body: [
      "Nell'industria il sale si usa davvero, ma <b>durante la tintura</b>: con certi coloranti (diretti e reattivi) aiuta le molecole di colorante, cariche negativamente come la fibra di cotone, a vincere la repulsione e a salire sulla fibra. Il fissaggio vero dei coloranti reattivi avviene poi con legami covalenti in ambiente alcalino.",
      "Sul capo finito, un pugno di sale in lavatrice non ricrea queste condizioni: non riattacca il colorante che si sta staccando. Funzionano meglio lavaggio a freddo, detersivo per colorati con inibitori del trasferimento del colore (come il PVP), acchiappacolore e primi lavaggi separati."
    ],
    ana: "Come pretendere che un cerotto riattacchi un punto di sutura saltato: il fissaggio vero è avvenuto prima, in sala operatoria, con altri strumenti.",
    pratica: [
      "Test del cotton fioc prima del primo lavaggio.",
      "Capi nuovi intensi da soli, a freddo, con acchiappacolore.",
      "Dopo 2–3 lavaggi il colorante libero di solito si è esaurito."
    ],
    rel: ["acchiappacolore", "test_colore"]
  },
  {
    id: "acchiappacolore", cat: "chimica",
    title: "Come funziona un acchiappacolore?",
    ask: "Il foglietto acchiappacolore cattura il colorante perché…",
    opts: [
      ["Assorbe l'acqua come una spugna qualsiasi", false, "Assorbirebbe pochissimo colorante rispetto all'acqua del cestello."],
      ["Lega i coloranti dispersi nell'acqua per attrazione elettrostatica", true],
      ["Sbianca il colorante", false, "Non contiene ossidanti."]
    ],
    body: [
      "È un tessuto non tessuto trattato con <b>polimeri cationici</b>, carichi positivamente. Molti coloranti per cotone sono anionici: quelli che si staccano e galleggiano nel bagno vengono catturati dal foglio prima di depositarsi su un altro capo.",
      "Non impedisce al colorante di staccarsi e non ripara un capo già macchiato. Però il colore del foglio a fine ciclo è un'informazione: ti dice quanto colorante libero c'era. È un indicatore."
    ],
    ana: "Funziona come la colestiramina: una resina con cariche positive che nell'intestino lega gli acidi biliari, carichi negativamente, e li porta via prima che vengano riassorbiti.",
    pratica: [
      "Carichi misti chiari e colorati, o colorati e scuri.",
      "Capi nuovi che stingono.",
      "Se il foglio esce molto colorato, quel capo deve continuare a fare lavaggi a parte."
    ],
    rel: ["sale_colori", "test_colore", "nylon_colore"]
  },
  {
    id: "nylon_colore", cat: "chimica",
    title: "Il nylon è un acchiappacolore",
    ask: "Dopo un lavaggio con gli scuri, la giacca a vento grigio chiaro è diventata giallastra, ma il profilo bianco in poliestere è rimasto bianco. Perché?",
    opts: [
      ["Il poliestere era trattato con un antimacchia", false, "Non serve un trattamento: è la chimica della fibra a fare la differenza."],
      ["La poliammide ha gruppi carichi positivamente che legano i coloranti anionici; il poliestere non ha cariche", true],
      ["Il nylon si è rovinato col calore", false, "A 30°C il nylon non si altera: il giallo è colorante arrivato dagli altri capi."]
    ],
    body: [
      "Le catene della <b>poliammide</b> terminano con gruppi amminici che in acqua, a pH neutro o acido, diventano –NH₃⁺. Molti coloranti che si staccano dal cotone hanno gruppi solfonato –SO₃⁻: più e meno si attraggono, e il colorante si lega alla fibra. È lo stesso principio del foglietto acchiappacolore, che è un tessuto caricato di gruppi positivi.",
      "Il <b>poliestere</b> invece non ha cariche ed è idrofobo: i suoi coloranti entrano solo verso i 130°C. A 30°C non prende niente. Nei test di solidità del colore si lava il capo insieme a una striscia con sei fibre diverse, e la banda di nylon è spesso quella che si macchia di più.",
      "Perché giallo e non nero? Il nero e il blu notte sono spesso miscele di più coloranti. Nell'acqua si separano, e la fibra prende di più quelli con più affinità: un po' come il pennarello nero che nella cromatografia su carta si divide in blu, rosso e giallo.",
      "L'industria tinge il nylon in bagno acido, perché l'acido aumenta le cariche positive. Per questo un risciacquo acido, con colorante ancora in giro, non lo aiuta. Al contrario, un bagno alcalino toglie le cariche e può far rilasciare una parte del colorante appena preso."
    ],
    ana: "Come un acchiappacolore cucito dentro la giacca: quando i foglietti nel cestello sono saturi, continua a lavorare lui.",
    pratica: [
      "Nylon chiaro con i chiari, mai con scuri, jeans o capi nuovi.",
      "Se ha preso colore: ammollo alcalino con un po' di percarbonato a 30–40°C e due acchiappacolore nuovi nel secchio, prima che il capo asciughi.",
      "Due foglietti usciti neri vogliono dire che il colorante libero era più di quanto potessero catturare."
    ],
    rel: ["acchiappacolore", "test_colore", "ossigeno"]
  },
  {
    id: "novanta", cat: "miti",
    title: "Lavare a 90°C è più igienico, sempre",
    ask: "Vero o falso? Per avere il bucato davvero pulito bisognerebbe lavare tutto ad alta temperatura.",
    opts: [
      ["Vero", false, "Il pulito non coincide con la temperatura."],
      ["Falso", true]
    ],
    body: [
      "Il pulito visibile dipende da tutte e quattro le leve del cerchio di Sinner, non solo dal calore. Sopra i 60°C molti enzimi del detersivo si denaturano, i colori migrano, i sintetici fissano le pieghe, il cotone si sfibra prima.",
      "Per l'igiene, 60°C (o 40°C con ossigeno attivo) bastano per i carichi a rischio. Il 90 ha senso solo in casi particolari, come la pulizia periodica della lavatrice a vuoto."
    ],
    ana: "Come aumentare la dose di un farmaco oltre il necessario: non guarisci prima, aumenti solo gli effetti collaterali.",
    pratica: [
      "30–40°C per la maggior parte del bucato.",
      "60°C per spugna, intimo, strofinacci.",
      "90°C a vuoto, una volta al mese, per la lavatrice."
    ],
    rel: ["sessanta", "enzimi", "energia"]
  },

  // ───────── TRUCCHI ─────────
  {
    id: "test_colore", cat: "trucchi",
    title: "Il test del cotton fioc: stingerà?",
    ask: "Come capisci prima del lavaggio se un capo nuovo stinge?",
    opts: [
      ["Dal prezzo", false, "Anche capi costosi possono stingere."],
      ["Bagnando un punto nascosto e premendoci sopra un panno bianco", true],
      ["Dall'odore", false, "Il colorante non ha un odore riconoscibile."]
    ],
    body: [
      "Inumidisci con acqua tiepida e una goccia di detersivo un punto nascosto (una cucitura interna, un orlo). Premi per 30 secondi un dischetto di cotone bianco o un cotton fioc. Se si colora, il capo rilascia colorante libero.",
      "Il colorante che migra in lavatrice è quello in eccesso, non fissato alla fibra. La tua prova simula il bagno di lavaggio in miniatura."
    ],
    ana: "È un patch test del tessuto, come la prova sulla pelle prima di usare una tinta per capelli.",
    pratica: [
      "Se il dischetto si colora: primi lavaggi da solo o con capi dello stesso colore, a freddo, con acchiappacolore.",
      "Rifai il test dopo 2–3 lavaggi.",
      "Rossi, fucsia, bordeaux e jeans scuri sono i sospettati abituali."
    ],
    rel: ["acchiappacolore", "sale_colori"]
  },
  {
    id: "rovescio", cat: "trucchi",
    title: "Zip chiuse, bottoni aperti, capi al rovescio",
    ask: "Perché le zip vanno chiuse e i bottoni delle camicie aperti?",
    opts: [
      ["Per abitudine, non cambia nulla", false, "Cambia, e si vede dopo qualche mese."],
      ["La zip aperta graffia gli altri capi, l'asola abbottonata si sfilaccia sotto tensione", true],
      ["Per bilanciare il cestello", false, "Il bilanciamento dipende dalla distribuzione del peso."]
    ],
    body: [
      "Una zip aperta è una lima dentata che sfrega contro tutto il carico. Chiusa, i denti sono nascosti.",
      "Un bottone allacciato, durante rotolamento e centrifuga, tira l'asola in modo ripetuto: il tessuto attorno si sfilaccia e il bottone si scuce.",
      "Al rovescio l'abrasione colpisce la parte interna: superficie visibile, stampe e colori restano protetti. I copripiumini invece vanno chiusi, altrimenti calzini e piccoli capi ci finiscono dentro e non si lavano."
    ],
    ana: "Come proteggere una ferita con la medicazione rivolta verso l'interno: l'attrito lo prende la garza, non la pelle.",
    pratica: [
      "Svuota le tasche: un fazzoletto di carta dimenticato riempie tutto di pelucchi.",
      "Chiudi zip e velcro, apri i bottoni, annoda i lacci.",
      "Rovescia scuri, jeans, stampe e felpe.",
      "Reggiseni con gancetti chiusi, in retina."
    ],
    rel: ["neri_grigi", "pelucchi"]
  },
  {
    id: "pelucchi", cat: "trucchi",
    title: "Chi cede e chi attira: la guerra dei pelucchi",
    ask: "Perché gli asciugamani nuovi riempiono di pelucchi il pile nero?",
    opts: [
      ["Sono di bassa qualità", false, "Anche gli asciugamani migliori perdono fibre nei primi lavaggi."],
      ["La spugna perde fibre corte e il sintetico le attira con la carica elettrostatica e la trama", true],
      ["Il lavaggio era troppo caldo", false, "La temperatura c'entra poco."]
    ],
    body: [
      "Spugna, ciniglia, felpe nuove e tessuti garzati <b>cedono</b> fibre corte. Pile, velluto, sintetici scuri, collant e microfibra le <b>attirano</b>: si elettrizzano facilmente per strofinio (sono in fondo alla serie triboelettrica) e hanno superfici che intrappolano le fibre.",
      "Sul nero una fibra bianca si vede il doppio: per questo il problema sembra riguardare solo gli scuri."
    ],
    ana: "Il palloncino strofinato sui capelli che poi attira i pezzetti di carta: lo stesso fenomeno, dentro il cestello.",
    pratica: [
      "Spugna da sola o con capi simili.",
      "Separa i capi che cedono da quelli che attirano.",
      "Pulisci il filtro della lavatrice.",
      "Rovescia i capi che attirano."
    ],
    rel: ["rovescio", "asciugamani_nuovi", "pallini"]
  },
  {
    id: "pallini", cat: "fibre",
    title: "Pelucchi dello stesso colore: i pallini",
    ask: "Dopo un lavaggio con gli asciugamani verdi, la maglia nera è piena di pallini neri. Da dove vengono?",
    opts: [
      ["Dagli asciugamani", false, "Sarebbero verdi: questi hanno il colore della maglia, quindi vengono da lei."],
      ["Dalla maglia stessa: lo sfregamento tira fuori le fibre dal filato e le aggroviglia", true],
      ["Dal detersivo non sciolto", false, "Il detersivo lascia polvere o aloni biancastri, non palline di fibra."]
    ],
    body: [
      "Il <b>pilling</b> avviene in tre tempi. Lo sfregamento sfila le estremità delle fibre dal filato e la superficie si copre di peluria; le fibre libere si aggrovigliano in una pallina; la pallina resta appesa alle poche fibre ancora ancorate al filato.",
      "Se quelle fibre sono deboli, come nel cotone e nella lana, prima o poi si spezzano e la pallina cade. Il poliestere è così resistente che non si spezzano mai: la pallina resta lì. Per questo i misti con poliestere si riempiono di pallini più del cotone puro.",
      "Nel cestello gli abrasivi sono la <b>spugna</b>, che bagnata diventa pesante e ha ricci che agganciano le fibre dei capi lisci, i <b>jeans</b> con cuciture spesse e rivetti, zip e velcro. Un cestello stipato e un programma lungo aumentano lo sfregamento.",
      "Le <b>cellulasi</b> di alcuni detersivi per scuri tagliano la peluria del cotone prima che diventi pallina: nell'industria tessile si chiama <i>biopolishing</i>. Sul poliestere non hanno presa."
    ],
    ana: "I nodi sulla nuca dove sfrega la sciarpa: i capelli si annodano dove l'attrito è più forte, e il nodo resta attaccato perché i capelli sono troppo resistenti per spezzarsi. O il velcro su un maglione: ogni passaggio sfila qualche fibra.",
    pratica: [
      "Aspetta che il capo sia asciutto e togli i pallini con un levapelucchi: tirandoli con le dita strappi altre fibre e prepari i pallini di domani.",
      "Scuri, maglie e jeans al rovescio, zip chiuse.",
      "Spugna e jeans lontani dalle maglie fini, o maglie in retina.",
      "Cestello non stipato, centrifuga bassa per gli scuri."
    ],
    rel: ["pelucchi", "neri_grigi", "rovescio"]
  },
  {
    id: "asciugamani_nuovi", cat: "trucchi",
    title: "Asciugamani nuovi che non asciugano",
    ask: "Un asciugamano appena comprato non assorbe. Perché?",
    opts: [
      ["È difettoso", false, "Quasi sempre è normale."],
      ["È coperto da un finissaggio che lo rende morbido in negozio ma idrofobo", true],
      ["Va usato di più per 'rompere' le fibre", false, "Più che l'uso, serve un lavaggio."]
    ],
    body: [
      "In negozio la spugna ha spesso un finissaggio a base di siliconi o ammorbidenti che la rende soffice al tatto ma respinge l'acqua.",
      "La spugna funziona grazie ai suoi anelli, che moltiplicano la superficie: l'acqua sale per capillarità tra le fibre di cotone, che è idrofilo grazie ai gruppi –OH della cellulosa. Tolta la pellicola, l'asciugamano beve."
    ],
    ana: "Come una garza: assorbe risalendo per capillarità. Se la ricopri di vaselina, smette di farlo.",
    pratica: [
      "Lava prima del primo uso a 40–60°C, senza ammorbidente.",
      "Acido citrico nella vaschetta aiuta.",
      "Asciugatrice o una bella sbattuta per gonfiare gli anelli."
    ],
    rel: ["ammorbidente", "pelucchi", "acido_citrico"]
  },

  // ───────── CURIOSITÀ ─────────
  {
    id: "profumo_sole", cat: "curiosita",
    title: "Perché il bucato steso al sole profuma di pulito?",
    ask: "Il profumo del bucato asciugato al sole viene da…",
    opts: [
      ["Il detersivo che si attiva col caldo", false, "Si sente anche con detersivi senza profumo."],
      ["Molecole prodotte dalla luce sulle fibre", true],
      ["L'ozono nell'aria", false, "L'ozono ha un odore pungente e diverso."]
    ],
    body: [
      "Ricerche recenti di chimica atmosferica suggeriscono che la luce del sole inneschi reazioni fotochimiche sulle fibre, con l'ossigeno e le tracce di sostanze organiche presenti, che producono <b>aldeidi e chetoni</b> volatili: molecole che troviamo anche in profumi e alimenti, con note fresche.",
      "Non esiste un odore di pulito in sé: è chimica innescata dalla luce. Asciugato in casa, lo stesso capo non profuma così."
    ],
    ana: "La luce come reagente, come nella pelle: i raggi UVB trasformano il 7-deidrocolesterolo in previtamina D. Nessun ingrediente in più, solo energia luminosa.",
    pratica: [
      "Bianchi e spugna al sole: profumo, igiene e sbiancamento gratis.",
      "Colorati all'ombra, anche se profumeranno meno."
    ],
    rel: ["stendere"]
  },
  {
    id: "calzini", cat: "curiosita",
    title: "Dove finiscono i calzini spaiati?",
    ask: "Il calzino che sparisce in lavatrice…",
    opts: [
      ["Si dissolve", false, "Il cotone non si scioglie in acqua."],
      ["Si infila tra guarnizione e cestello, nel filtro, o dentro un copripiumino o una manica", true],
      ["Non esiste: lo perdi prima", false, "Succede anche questo, ma la lavatrice ha i suoi nascondigli."]
    ],
    body: [
      "I capi piccoli e leggeri sono i più mobili nel cestello. Possono scivolare nella piega della guarnizione, finire nel filtro della pompa, oppure infilarsi dentro un copripiumino aperto, una federa o la manica di una felpa, dove restano anche dopo lo stendino.",
      "L'elettricità statica fa il resto: in asciugatrice un calzino resta attaccato all'interno di una maglia sintetica."
    ],
    ana: "Un piccolo problema di cinematica: gli oggetti con massa minore vengono sballottati di più e trovano gli interstizi.",
    pratica: [
      "Calzini in una retina.",
      "Chiudi copripiumini e federe.",
      "Controlla ogni tanto guarnizione e filtro."
    ],
    rel: ["rovescio"]
  },
  {
    id: "lisciva", cat: "curiosita",
    title: "Il bucato con la cenere delle bisnonne",
    ask: "Perché la cenere di legna nell'acqua, la lisciva, lavava i panni?",
    opts: [
      ["Perché è abrasiva", false, "Si usava l'acqua filtrata, non la cenere strofinata."],
      ["Perché rilascia una base che trasforma i grassi dello sporco in sapone", true],
      ["Perché profuma", false, "Il profumo non c'entra."]
    ],
    body: [
      "La cenere di legna contiene soprattutto <b>carbonato di potassio</b>. In acqua forma una soluzione fortemente alcalina, la lisciva. L'alcalinità attacca i grassi dello sporco (trigliceridi) e li <b>saponifica</b>: li spezza in glicerolo e sali di acidi grassi, cioè sapone.",
      "In pratica lo sporco grasso diventava il proprio detersivo. Lo stesso principio, con soda al posto della cenere e oli al posto dello sporco, è quello con cui si fa il sapone."
    ],
    ana: "Una piccola autodigestione: lo sporco viene trasformato nell'agente che lo porta via.",
    pratica: [
      "Una curiosità storica: oggi non serve, e la lisciva concentrata è caustica per pelle e occhi.",
      "Spiega perché lana e seta, proteiche, venivano lavate a parte: l'alcalinità le danneggia."
    ],
    rel: ["sapone", "tensioattivi"]
  }
];
const CARD_BY_ID = Object.fromEntries(CARDS.map(c => [c.id, c]));
