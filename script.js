const area = document.querySelector(".area-gioco");
let LARGHEZZA = 0;
let ALTEZZA = 0;
let LARGHEZZA_NAVICELLA = 40;
let navicellaX = 0;


const selectDifficolta = document.querySelector("#difficoltà");
let difficolta = "facile";

const btnstart = document.querySelector("#start");

const inserisciNome = document.querySelector("#inputnome");
let nome = ""; 

const menu = document.querySelector("#menu");
const partita = document.querySelector("#partita");

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

}

let navicella = null; 

function creaNavicella() {
    navicella = document.createElement("div");   // niente let: assegni
    navicella.classList.add("navicella");
    navicellaX = (LARGHEZZA - LARGHEZZA_NAVICELLA)/2;
    area.appendChild(navicella);
    disegnaNavicella();
}

function disegnaNavicella() {
    navicella.style.left = navicellaX + "px";
}

// Scrivi un nome, premi Start: il menu sparisce, la partita compare e in console vedi nome difficolta 500 600. Se vedi 0 0, l’ordine delle righe è sbagliato.
//Prossimo passo, questa volta tuo: il pannello punteggio e vite nell’HTML. Dentro #partita, prima dell’area di gioco, un <div> con due <span> (uno per il punteggio, uno per le vite), ognuno con un id. Provaci e mandamelo.




selectDifficolta.addEventListener("change", cambiaDifficolta);
inserisciNome.addEventListener("input", cambiaNome);
btnstart.addEventListener("click", startGame);