# Oblò · la scuola del bucato

App personale (PWA) per imparare a fare la lavatrice. File statici, nessuna build: Netlify pubblica la cartella così com'è.

- `index.html` · struttura delle schermate
- `style.css` · stile (Bricolage Grotesque per i titoli, Atkinson Hyperlegible per il testo)
- `data.js` · capi, fibre, colori, ceste, prodotti, macchie, simboli delle etichette
- `scienza.js` · box scientifici (domanda, spiegazione, analogia, pratica)
- `engine.js` · smistamento nelle ceste, compatibilità tra ceste, piano con il minor numero di lavatrici, ricetta del lavaggio (programma, gradi, giri, dosi)
- `mano.js` · Bacinella: guide per lavaggi a mano, ammolli e oggetti difficili (scarpe, zaini, assorbenti lavabili), protezione delle mani
- `app.js` · interfaccia: Cesto, Dispensa, Lavatrice, Bacinella, Laboratorio
- `sw.js` · funzionamento offline (cambiare VERSION a ogni aggiornamento)

I dati (capi, dispensa, impostazioni) restano nel browser del telefono.
