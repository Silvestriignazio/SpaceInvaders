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
let direzioneAlieni = 1; //1 destra -1 sinistra
let ultimoMovimentoAlieni = 0;

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

    creaNavicella();
    creaAlieni();
    gameLoop();
}

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
    if (evento.key === "a") {
        tastoSinistra = true;
    }
    if (evento.key === "d") {
        tastoDestra = true;
    }

    if (evento.key === " " && !evento.repeat) {
        evento.preventDefault(); //ci permette di schiacciare la barra spaziatrice senza far muovere lo schermo
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

function sparaGiocatore() {
    const elemento = document.createElement("div");
    elemento.classList.add("proiettile");

    //creo un elemento proiettile così da poter tenere traccia dei singoli proiettili
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
    //for che permette di scorrere la lista dei proiettili e farli andare verso l'alto
    for (let i = proiettili.length - 1; i >= 0; i--) {
        const proiettile = proiettili[i];
        proiettile.y -= VELOCITA_PROIETTILE;   //andiamo a sottrarre la velocità in quanto se la y diminuisce vuol dire che il proiettile deve salire

        if (proiettile.y + ALTEZZA_PROIETTILE < 0) {
            proiettile.elemento.remove();
            proiettili.splice(i, 1); //elimina l'elemento dalla lista 
        } else {
            disegnaProiettile(proiettile);
        }
    }
}

function creaAlieni() {
    const larghezzaGriglia = COLONNE_ALIENI * LARGHEZZA_ALIENO + (COLONNE_ALIENI - 1) * SPAZIO_ALIENI;
    const inizioX = (LARGHEZZA - larghezzaGriglia) / 2;

    for (let riga = 0; riga < RIGHE_ALIENI; riga++) {
        for (let colonna = 0; colonna < COLONNE_ALIENI; colonna++) {
            const elemento = document.createElement("div");
            elemento.classList.add("alieno");

            const alieno = { //ogni singolo alieno è un oggetto che è contenuto in un array
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
    if (adesso - ultimoMovimentoAlieni < INTERVALLO_ALIENI) {
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

function gameLoop() {
    aggiornaNavicella();
    aggiornaProiettili();
    muoviAlieni();
    requestAnimationFrame(gameLoop);
    //se si muove la navicella solo con keydown essa va a scatti, poichè il dom deve attendere un'attimo, quindi abbiamo deciso di utilizzare dei flag che accendono e 
    //spengono il movimento e grazie a un game loop con requestAnimationFrame, a ogni frame (60fps), controlla le variabili e le ridisegna, così il tutto esce più fluido
}

selectDifficolta.addEventListener("change", cambiaDifficolta);
inserisciNome.addEventListener("input", cambiaNome);
btnstart.addEventListener("click", startGame);
document.addEventListener("keydown", premiTasto);
document.addEventListener("keyup", rilasciaTasto);