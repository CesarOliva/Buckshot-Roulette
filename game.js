//Obtiene los elementos con el DOM de Javascript
const inicio = document.getElementById("inicio");
const usuario = document.getElementById("usuario");
const contraseña = document.getElementById("password");
const jugar = document.getElementById('jugar');
const registro = document.getElementById('registro');

const juego = document.getElementById("juego");

//Al clickear en el elemento de registro
registro.addEventListener('click', function(e){
    validarRegistro();
    e.preventDefault();
});

//Valida los datos del formulario para hacer el registro de usuarios
function validarRegistro(){
    var correcto = true;
    //Si el elemento está vacio o tiene espacios
    if(usuario.value=='' || usuario.value.includes(" ")){
        //Marca error en el elemento
        usuario.setAttribute('class', 'error');
        usuario.addEventListener('click', function(e){
            usuario.setAttribute('class', "")
        });
        correcto = false;
    };
    
    //Si el elemento está vacio
    if(contraseña.value==''){
        //Marca error en el elemento
        contraseña.setAttribute('class', 'error');
        contraseña.addEventListener('click', function(e){
            contraseña.setAttribute('class', "")
        });
        correcto = false;
    };

    //Si todo está correcto
    if(correcto){
        //Envia los datos a la base de datos
    }
}

//Al clickear en el elemento de jugar
jugar.addEventListener('click', function(e){
    inicio.remove();
    juego.style.display = "block"
})

//Valida los datos para iniciar el jeugo
function validarInicio(){
    //Si existe el usuario y coincide la contraseña
    usuario.parentElement();
}

//Inicia el juego
function iniciarJuego(){

}




let player1Health;
let player2Health;
let turn;
let blankShells;
let liveShells;
let chamber;

const statusElement = document.getElementById("status");
const player1HealthElement = document.getElementById("player-1-health");
const player2HealthElement = document.getElementById("player-2-health");
const turnIndicatorElement = document.getElementById("turn-indicator");
const shotgun = document.getElementById("shotgun");

function setStatus(message) {
    statusElement.innerHTML = message;
}

function damage(player, amount) {
    if (player === "player1") {
        player1Health -= amount;
    }

    if (player === "player2") {
        player2Health -= amount;
    }
    renderHealth();
}


function generateRandomChamber(){
    chamber = [];
    for(let i = 0; i < 6; i++){
        const isLive = Math.random() < 0.3; //30% DE PROBABILDAD
        chamber.push(isLive ? 'live' : 'fake') 
    }
    shuffleArray(chamber);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


function bulletTemporal(){
    const bulletDisplay = document.getElementById("bullet_display");
    bulletDisplay.innerHTML = ''; //LIMPIA

    chamber.forEach(shell => {
        const bullet = document.createElement("div");
        bullet.classList.add("bullet");
        if(shell === 'blank'){
            bullet.classList.add("blank");
        }
        bulletDisplay.appendChild(bullet);
    });

    bulletDisplay.style.display = 'flex';

    //OCULTAR DESPUES DE TRES SEGUNDOS
    setTimeout(() => {
        bulletDisplay.style.display = 'none';
    }, 3000 ); //MILISEGUNDOS

    alert('El oponente esta revolviendo el cartucho');

}

function shoot(player) {

    const shell = chamber.pop();
    if (shell === 'live') {

        if (turn == 1) {
            if (player === "opponent") {
                shotgun.dataset.aim = "2";
                setTimeout(() => {
                    alert("Se disparo una bala real!");
                    damage("player2", 1);
                }, 1000);

            } else if (player === "self") {
                shotgun.dataset.aim = "1";
                setTimeout(() => {
                    alert("Se disparo una bala real!");
                    damage("player1", 1);
                }, 1000);

            }
        }

        if (turn == 2) {
            if (player === "opponent") {
                shotgun.dataset.aim = "1";
                setTimeout(() => {
                    alert("Se disparo una bala real!");
                    damage("player1", 1);
                }, 1000);

            } else if (player === "self") {
                shotgun.dataset.aim = "2";
                setTimeout(() => {
                    alert("Se disparo una bala real!");
                    damage("player2", 1);
                }, 1000);

            }
        }


    } else {

        if (turn == 1) {
            if (player === "opponent") {
                shotgun.dataset.aim = "2";
                setTimeout(() => {
                    alert("Se disparo una bala falsa!"); 
                }, 1000);

            } else if (player === "self") {
                shotgun.dataset.aim = "1";
                setTimeout(() => {
                    alert("Se disparo una bala falsa!");
                    nextTurn();
                }, 1000);

            }
        }

        if (turn == 2) {
            if (player === "opponent") {
                shotgun.dataset.aim = "1";
                setTimeout(() => {
                    alert("Se disparo una bala falsa!");
                }, 1000);

            } else if (player === "self") {
                shotgun.dataset.aim = "2";
                setTimeout(() => {
                    alert("Se disparo una bala falsa!");
                    nextTurn();
                }, 1000);
            }
        }
    }
    if (chamber.length === 0) {
        reload();
    }

    nextTurn();
}


function renderHealth() {
    if (player1Health <= 0) {
        setTimeout(() => {
            alert("Jugador 2 Gana!!");
            startGame();
        }, 1000);
    }

    if (player2Health <= 0) {
        setTimeout(() => {
            alert("Jugador 1 Gana!!");
            startGame();
        }, 1000);
    }
    player1HealthElement.innerText = '⚡️'.repeat(player1Health);
    player2HealthElement.innerText = '⚡️'.repeat(player2Health);
}

function nextTurn() {
    setTimeout(() => {
        shotgun.dataset.aim = "";
        if (turn == 1) {
            turn = 2;
        } else {
            turn = 1;
        }
        renderTurn();
    }, 1000);
}

function renderTurn() {
    if (turn == 1) {
        document.getElementById("player-2").classList.remove("active");
        document.getElementById("player-1").classList.add("active");
    } else {
        document.getElementById("player-1").classList.remove("active");
        document.getElementById("player-2").classList.add("active");
    }
}

function reload() {
    alert("Se termino el cartucho, recargando...");

    //generateRandomChamber()
    const totalShells = 6;
    liveShells = Math.floor(Math.random() * 5) + 2;
    blankShells = totalShells - liveShells;

    alert(`${liveShells} live & ${blankShells} blank shells`);
    chamber = Array(blankShells).fill('blank').concat(Array(liveShells).fill('live'));
    shuffleArray(chamber);

    bulletTemporal();
}

function startGame() {
    alert(`Comienza el Juego!!`);


    totalShells = 6;

    liveShells = Math.floor(Math.random() * 5) + 2;
    blankShells = totalShells - liveShells;

    chamber = Array(blankShells).fill('blank').concat(Array(liveShells).fill('live'));
    shuffleArray(chamber);

    bulletTemporal();


    player1Health = 3;
    player2Health = 3;

    //generateRandomChamber();
    renderHealth();

    turn = Math.floor(Math.random() * 2) + 1;
    renderTurn();


}

startGame();
