
const area = document.querySelector(".area-gioco");
const selectDifficolta = document.querySelector("#difficoltà");
const btnstart = document.querySelector("#start");
const inserisciNome = document.querySelector("#inputnome");
const menu = document.querySelector("#menu");
const partita = document.querySelector("#partita");

const VELOCITA = 4;
const LARGHEZZA_NAVICELLA = 80;
const ALTEZZA_NAVICELLA = 80;
const LARGHEZZA_PROIETTILE = 10;
const ALTEZZA_PROIETTILE = 25;
const VELOCITA_PROIETTILE = 8;
const RIGHE_ALIENI = 5;
const COLONNE_ALIENI = 11;
const LARGHEZZA_ALIENO = 50;
const ALTEZZA_ALIENO = 50;
const SPAZIO_ALIENI = 15;
const PASSO_ALIENI = 5;
const INTERVALLO_ALIENI = 250;
const SCESA_ALIENI = 20;

// Nuove costanti
const VELOCITA_PROIETTILE_ALIENO = 5;
const LARGHEZZA_MURETTO = 100;
const ALTEZZA_MURETTO = 35;

let LARGHEZZA = 0;
let ALTEZZA = 0;
let nome = "";
let difficolta = "facile";
let navicella = null;
let navicellaX = 0;
let tastoSinistra = false;
let tastoDestra = false;
let proiettili = [];
let alieni = [];
let direzioneAlieni = 1;
let ultimoMovimentoAlieni = 0;

// Nuove variabili
let proiettiliAlieni = [];
let muretti = [];
let punteggio = 0;
let vite = 3;
let partitaFinita = false;
let ultimoSparoAlieni = 0;
let intervalloSparo = 2000;
let intervalloMovimento = INTERVALLO_ALIENI;
let classifica = [];

// Numero dell'ondata
let ondata = 1;


// EVENTI DEL MENU

function cambiaNome() {
    nome = inserisciNome.value;
}

function cambiaDifficolta() {
    difficolta = selectDifficolta.value;
}

function startGame() {
    if (nome.trim() === "") {
        alert("inserisci il nome");
        return;
    }

    menu.classList.add("nascosto");
    partita.classList.remove("nascosto");

    LARGHEZZA = area.clientWidth;
    ALTEZZA = area.clientHeight;

    // Ripristino dei dati della partita
    area.innerHTML = "";
    proiettili = [];
    proiettiliAlieni = [];
    alieni = [];
    muretti = [];

    punteggio = 0;
    vite = 3;
    partitaFinita = false;
    direzioneAlieni = 1;
    ultimoMovimentoAlieni = 0;
    ultimoSparoAlieni = Date.now();

    ondata = 1;

    tastoSinistra = false;
    tastoDestra = false;

    document.querySelector("#punteggio").textContent = "Punteggio: 0";
    document.querySelector("#vite").textContent = "Vite: 3";
    document.querySelector("#messaggio").textContent = "";
    document.querySelector("#rigioca").classList.add("nascosto");

    // La difficoltà cambia velocità e frequenza degli spari
    if (difficolta === "facile") {
        intervalloMovimento = 250;
        intervalloSparo = 2000;
    }

    if (difficolta === "difficile") {
        intervalloMovimento = 150;
        intervalloSparo = 1200;
    }

    if (difficolta === "superdifficile") {
        intervalloMovimento = 80;
        intervalloSparo = 700;
    }

    creaNavicella();
    creaAlieni();
    creaMuretti();
    gameLoop();
}


// NAVICELLA

function creaNavicella() {
    navicella = document.createElement("div");
    navicella.classList.add("navicella");

    navicellaX = (LARGHEZZA - LARGHEZZA_NAVICELLA) / 2;

    area.appendChild(navicella);
    disegnaNavicella();
}

function disegnaNavicella() {
    navicella.style.left = navicellaX + "px";
}

function aggiornaNavicella() {
    if (tastoSinistra) {
        navicellaX -= VELOCITA;
    }

    if (tastoDestra) {
        navicellaX += VELOCITA;
    }

    if (navicellaX < 0) {
        navicellaX = 0;
    }

    if (navicellaX > LARGHEZZA - LARGHEZZA_NAVICELLA) {
        navicellaX = LARGHEZZA - LARGHEZZA_NAVICELLA;
    }

    disegnaNavicella();
}

function premiTasto(evento) {
    if (partitaFinita) {
        return;
    }

    if (evento.key === "a") {
        tastoSinistra = true;
    }

    if (evento.key === "d") {
        tastoDestra = true;
    }

    if (evento.key === " " && !evento.repeat) {
        evento.preventDefault();

        if (navicella !== null) {
            sparaGiocatore();
        }
    }
}

function rilasciaTasto(evento) {
    if (evento.key === "a") {
        tastoSinistra = false;
    }

    if (evento.key === "d") {
        tastoDestra = false;
    }
}


// PROIETTILI DEL GIOCATORE

function sparaGiocatore() {
    const elemento = document.createElement("div");
    elemento.classList.add("proiettile");

    const proiettile = {
        x: navicellaX + LARGHEZZA_NAVICELLA / 2 - LARGHEZZA_PROIETTILE / 2,
        y: ALTEZZA - 10 - ALTEZZA_NAVICELLA,
        elemento: elemento
    };

    proiettili.push(proiettile);
    area.appendChild(elemento);
    disegnaProiettile(proiettile);
}

function disegnaProiettile(proiettile) {
    proiettile.elemento.style.left = proiettile.x + "px";
    proiettile.elemento.style.top = proiettile.y + "px";
}

function aggiornaProiettili() {
    for (let i = proiettili.length - 1; i >= 0; i--) {
        const proiettile = proiettili[i];

        proiettile.y -= VELOCITA_PROIETTILE;

        if (proiettile.y + ALTEZZA_PROIETTILE < 0) {
            proiettile.elemento.remove();
            proiettili.splice(i, 1);
        } else {
            disegnaProiettile(proiettile);
        }
    }
}


// ALIENI

function creaAlieni() {
    const larghezzaGriglia =
        COLONNE_ALIENI * LARGHEZZA_ALIENO +
        (COLONNE_ALIENI - 1) * SPAZIO_ALIENI;

    const inizioX = (LARGHEZZA - larghezzaGriglia) / 2;

    for (let riga = 0; riga < RIGHE_ALIENI; riga++) {
        for (let colonna = 0; colonna < COLONNE_ALIENI; colonna++) {

            const elemento = document.createElement("div");
            elemento.classList.add("alieno");

            const alieno = {
                x: inizioX + colonna * (LARGHEZZA_ALIENO + SPAZIO_ALIENI),
                y: 40 + riga * (ALTEZZA_ALIENO + SPAZIO_ALIENI),
                elemento: elemento
            };

            alieni.push(alieno);
            area.appendChild(elemento);
            disegnaAlieno(alieno);
        }
    }
}

function disegnaAlieno(alieno) {
    alieno.elemento.style.left = alieno.x + "px";
    alieno.elemento.style.top = alieno.y + "px";
}

function muoviAlieni() {
    const adesso = Date.now();

    if (adesso - ultimoMovimentoAlieni < intervalloMovimento) {
        return;
    }

    ultimoMovimentoAlieni = adesso;

    let toccatoBordo = false;

    for (let i = 0; i < alieni.length; i++) {
        const alieno = alieni[i];

        alieno.x += PASSO_ALIENI * direzioneAlieni;

        if (alieno.x <= 0 || alieno.x + LARGHEZZA_ALIENO >= LARGHEZZA) {
            toccatoBordo = true;
        }
    }

    if (toccatoBordo) {
        direzioneAlieni = direzioneAlieni * -1;

        for (let i = 0; i < alieni.length; i++) {
            alieni[i].y += SCESA_ALIENI;
        }
    }

    for (let i = 0; i < alieni.length; i++) {
        disegnaAlieno(alieni[i]);
    }
}


// SPARI DEGLI ALIENI

function sparaAlieni() {
    const adesso = Date.now();

    if (adesso - ultimoSparoAlieni < intervalloSparo) {
        return;
    }

    ultimoSparoAlieni = adesso;

    if (alieni.length === 0) {
        return;
    }

    // Sceglie un alieno casuale
    const numero = Math.floor(Math.random() * alieni.length);
    const alieno = alieni[numero];

    const elemento = document.createElement("div");
    elemento.classList.add("proiettile-alieno");

    const proiettile = {
        x: alieno.x + LARGHEZZA_ALIENO / 2 - LARGHEZZA_PROIETTILE / 2,
        y: alieno.y + ALTEZZA_ALIENO,
        elemento: elemento
    };

    proiettiliAlieni.push(proiettile);
    area.appendChild(elemento);
}

function aggiornaProiettiliAlieni() {
    for (let i = proiettiliAlieni.length - 1; i >= 0; i--) {
        const proiettile = proiettiliAlieni[i];

        proiettile.y += VELOCITA_PROIETTILE_ALIENO;

        proiettile.elemento.style.left = proiettile.x + "px";
        proiettile.elemento.style.top = proiettile.y + "px";

        if (proiettile.y > ALTEZZA) {
            proiettile.elemento.remove();
            proiettiliAlieni.splice(i, 1);
        }
    }
}


// MURETTI PROTETTIVI

function creaMuretti() {
    for (let i = 0; i < 4; i++) {
        const elemento = document.createElement("div");
        elemento.classList.add("muretto");

        const muretto = {
            x: (LARGHEZZA / 5) * (i + 1) - LARGHEZZA_MURETTO / 2,
            y: ALTEZZA - 160,
            resistenza: 3,
            elemento: elemento
        };

        muretti.push(muretto);
        area.appendChild(elemento);

        elemento.style.left = muretto.x + "px";
        elemento.style.top = muretto.y + "px";
    }
}


// CONTROLLO COLLISIONI

function collisione(x1, y1, larghezza1, altezza1,
                    x2, y2, larghezza2, altezza2) {

    if (
        x1 < x2 + larghezza2 &&
        x1 + larghezza1 > x2 &&
        y1 < y2 + altezza2 &&
        y1 + altezza1 > y2
    ) {
        return true;
    }

    return false;
}

function controllaCollisioni() {

    // Proiettili del giocatore contro alieni
    for (let i = proiettili.length - 1; i >= 0; i--) {
        const proiettile = proiettili[i];
        let colpito = false;

        for (let j = alieni.length - 1; j >= 0; j--) {
            const alieno = alieni[j];

            if (collisione(
                proiettile.x, proiettile.y,
                LARGHEZZA_PROIETTILE, ALTEZZA_PROIETTILE,
                alieno.x, alieno.y,
                LARGHEZZA_ALIENO, ALTEZZA_ALIENO
            )) {
                alieno.elemento.remove();
                alieni.splice(j, 1);

                punteggio += 10;
                document.querySelector("#punteggio").textContent =
                    "Punteggio: " + punteggio;

                colpito = true;
                break;
            }
        }

        // Controlla anche i muretti
        if (!colpito) {
            for (let j = muretti.length - 1; j >= 0; j--) {
                const muretto = muretti[j];

                if (collisione(
                    proiettile.x, proiettile.y,
                    LARGHEZZA_PROIETTILE, ALTEZZA_PROIETTILE,
                    muretto.x, muretto.y,
                    LARGHEZZA_MURETTO, ALTEZZA_MURETTO
                )) {
                    danneggiaMuretto(j);
                    colpito = true;
                    break;
                }
            }
        }

        if (colpito) {
            proiettile.elemento.remove();
            proiettili.splice(i, 1);
        }
    }

    // Proiettili alieni contro muretti e navicella
    for (let i = proiettiliAlieni.length - 1; i >= 0; i--) {
        const proiettile = proiettiliAlieni[i];
        let colpito = false;

        for (let j = muretti.length - 1; j >= 0; j--) {
            const muretto = muretti[j];

            if (collisione(
                proiettile.x, proiettile.y,
                LARGHEZZA_PROIETTILE, ALTEZZA_PROIETTILE,
                muretto.x, muretto.y,
                LARGHEZZA_MURETTO, ALTEZZA_MURETTO
            )) {
                danneggiaMuretto(j);
                colpito = true;
                break;
            }
        }

        if (!colpito && collisione(
            proiettile.x, proiettile.y,
            LARGHEZZA_PROIETTILE, ALTEZZA_PROIETTILE,
            navicellaX, ALTEZZA - ALTEZZA_NAVICELLA - 10,
            LARGHEZZA_NAVICELLA, ALTEZZA_NAVICELLA
        )) {
            vite--;

            document.querySelector("#vite").textContent = "Vite: " + vite;

            colpito = true;

            // Se finiscono le vite termina la partita
            if (vite <= 0) {
                finePartita(false);
                return;
            }
        }

        if (colpito) {
            proiettile.elemento.remove();
            proiettiliAlieni.splice(i, 1);
        }
    }
}

function danneggiaMuretto(indice) {
    const muretto = muretti[indice];

    muretto.resistenza--;

    if (muretto.resistenza === 2) {
        muretto.elemento.style.backgroundColor = "orange";
    }

    if (muretto.resistenza === 1) {
        muretto.elemento.style.backgroundColor = "red";
    }

    if (muretto.resistenza <= 0) {
        muretto.elemento.remove();
        muretti.splice(indice, 1);
    }
}


// PARTITA CON ONDATE INFINITE

function controllaFinePartita() {

    if (partitaFinita) {
        return;
    }

    // Quando tutti gli alieni vengono eliminati
    // arriva una nuova ondata
    if (alieni.length === 0) {
        ondata++;

        // Gli alieni diventano più veloci
        if (intervalloMovimento > 50) {
            intervalloMovimento -= 10;
        }

        creaAlieni();
    }

    // Se gli alieni raggiungono la navicella
    for (let i = 0; i < alieni.length; i++) {
        if (alieni[i].y + ALTEZZA_ALIENO >=
            ALTEZZA - ALTEZZA_NAVICELLA - 10) {

            finePartita(false);
            return;
        }
    }
}


// FINE PARTITA

function finePartita(vittoria) {
    if (partitaFinita) {
        return;
    }

    partitaFinita = true;

    if (vittoria) {
        document.querySelector("#messaggio").textContent =
            "HAI VINTO! Punteggio: " + punteggio;
    } else {
        document.querySelector("#messaggio").textContent =
            "GAME OVER! Punteggio: " + punteggio;
    }

    document.querySelector("#rigioca").classList.remove("nascosto");

    // Salva il risultato nella classifica della sessione
    classifica.push({
        nome: nome,
        punteggio: punteggio
    });

    mostraClassifica();
}

function rigioca() {
    partita.classList.add("nascosto");
    menu.classList.remove("nascosto");
    navicella = null;
}


// CLASSIFICA JSON

async function caricaClassifica() {
    const stato = document.querySelector("#statoClassifica");

    stato.textContent = "Caricamento classifica in corso...";

    try {
        const risposta = await fetch("classifica.json");

        if (!risposta.ok) {
            throw new Error("Errore nel caricamento");
        }

        classifica = await risposta.json();

        stato.textContent = "Classifica caricata!";
        mostraClassifica();

    } catch (errore) {
        stato.textContent = "Errore nel caricamento della classifica";
        classifica = [];
        mostraClassifica();
    }
}

function mostraClassifica() {
    const lista = document.querySelector("#listaClassifica");

    lista.innerHTML = "";

    // Ordina dal punteggio più alto al più basso
    classifica.sort(function(a, b) {
        return b.punteggio - a.punteggio;
    });

    for (let i = 0; i < classifica.length && i < 10; i++) {
        const elemento = document.createElement("li");

        elemento.textContent =
            classifica[i].nome + " - " +
            classifica[i].punteggio + " punti";

        lista.appendChild(elemento);
    }
}


// GAME LOOP

function gameLoop() {
    if (partitaFinita) {
        return;
    }

    aggiornaNavicella();
    aggiornaProiettili();
    muoviAlieni();

    sparaAlieni();
    aggiornaProiettiliAlieni();

    controllaCollisioni();
    controllaFinePartita();

    if (!partitaFinita) {
        requestAnimationFrame(gameLoop);
    }
}


// EVENT LISTENER

selectDifficolta.addEventListener("change", cambiaDifficolta);
inserisciNome.addEventListener("input", cambiaNome);
btnstart.addEventListener("click", startGame);

document.addEventListener("keydown", premiTasto);
document.addEventListener("keyup", rilasciaTasto);

document.querySelector("#rigioca").addEventListener("click", rigioca);

// Carica la classifica all'apertura della pagina
caricaClassifica();
