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

let LARGHEZZA = 0;
let ALTEZZA = 0;
let nome = "";
let difficolta = "facile";
let navicella = null;
let navicellaX = 0;
let tastoSinistra = false;
let tastoDestra = false;
let proiettili = [];

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

function gameLoop() {
    aggiornaNavicella();
    aggiornaProiettili();
    requestAnimationFrame(gameLoop);
    //se si muove la navicella solo con keydown essa va a scatti, poichè il dom deve attendere un'attimo, quindi abbiamo deciso di utilizzare dei flag che accendono e 
    //spengono il movimento e grazie a un game loop con requestAnimationFrame, a ogni frame (60fps), controlla le variabili e le ridisegna, così il tutto esce più fluido
}
selectDifficolta.addEventListener("change", cambiaDifficolta);
inserisciNome.addEventListener("input", cambiaNome);
btnstart.addEventListener("click", startGame);
document.addEventListener("keydown", premiTasto);
document.addEventListener("keyup", rilasciaTasto);