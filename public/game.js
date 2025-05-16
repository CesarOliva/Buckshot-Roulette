//Obtiene los elementos con el DOM de Javascript
const divInicio = document.getElementById("inicio");
const divJuego = document.getElementById("juego");

const formulario = document.getElementById('formulario');
const inputUsuario = document.getElementById("usuario");
const inputContraseña = document.getElementById("password");

const btnJugar = document.getElementById('jugar');
const btnRegistro = document.getElementById('registro');

//Al clickear en el elemento de registro
btnRegistro.addEventListener('click', function(e){
    e.preventDefault();
    validarRegistro();
});

//Valida los datos del formulario para hacer el registro de usuarios
function validarRegistro(){
    var correcto = true;
    //Si el elemento está vacio o tiene espacios
    if(inputUsuario.value=='' || inputUsuario.value.includes(" ")){
        //Marca error en el elemento
        inputUsuario.setAttribute('class', 'error');
        inputUsuario.addEventListener('DOMFocusIn', function(e){
            inputUsuario.setAttribute('class', "")
        });
        correcto = false;
    };
    
    //Si el elemento está vacio
    if(inputContraseña.value==''){
        //Marca error en el elemento
        inputContraseña.setAttribute('class', 'error');
        inputContraseña.addEventListener('DOMFocusIn', function(e){
            inputContraseña.setAttribute('class', "")
        });
        correcto = false;
    };

    //Si todo está correcto
    if(correcto){
        enviarFormulario();
    }
}

async function enviarFormulario(){
    var usuario = inputUsuario.value;
    var contraseña = inputContraseña.value;
    //Envia los datos a la base de datos
    const res = await fetch('http://localhost:3000/api/save', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({usuario, contraseña})
    });
    
    const data = await res.json();
    alert(data.mensaje);
}

//Al clickear en el elemento de jugar
btnJugar.addEventListener('click', function(e){
    divInicio.remove();
    divJuego.style.display = "block"
})

//Valida los datos para iniciar el jeugo
function validarInicio(){
    //Si existe el usuario y coincide la contraseña
}

//Inicia el juego
function iniciarJuego(){

}



// Variables globales
let player1Health, player2Health, turn, liveShells, blankShells, chamber;
let gameActive = false;
let currentTimeout = null;
let shootSound, blankSound, reloadSound; //Pa los sonidos bb

// Elementos del DOM
const inicio = document.getElementById("inicio");
const juego = document.getElementById("juego");
const jugarBtn = document.getElementById("jugar");
const shotgun = document.getElementById("shotgun");
const statusElement = document.getElementById("status");
const player1HealthElement = document.getElementById("player-1-health");
const player2HealthElement = document.getElementById("player-2-health");
const bulletDisplay = document.getElementById("bullet_display");
const shootOpponentBtn = document.getElementById("shoot-opponent");
const shootSelfBtn = document.getElementById("shoot-self");

// Función para limpiar el timeout actual
function clearCurrentTimeout() {
    if (currentTimeout) {
        clearTimeout(currentTimeout);
        currentTimeout = null;
    }
}

// Inicialización del juego
function startGame() {
    clearCurrentTimeout();
    player1Health = 3;
    player2Health = 3;
    gameActive = true;

        // Cargar sonidos
    shootSound = new Audio('sounds/liveBullet.wav');
    blankSound = new Audio('sounds/blanckBullet.wav');
    reloadSound = new Audio('sounds/rack shotgun.ogg');

    generateChamber();
    turn = Math.floor(Math.random() * 2) + 1;
    
    shotgun.dataset.aim = "";
    
    renderHealth();
    renderTurn();
    updateBulletDisplay();
    setStatus(turn === 1 ? "Tu turno - ¡DISPARA!" : "Turno del oponente...");
    
    shootOpponentBtn.classList.toggle("hidden", turn !== 1);
    shootSelfBtn.classList.toggle("hidden", turn !== 1);
    
    if (turn === 2) {
        currentTimeout = setTimeout(opponentTurn, 1500);
    }
}

// Turno del oponente (IA)
function opponentTurn() {
    if (!gameActive) return;
    
    const shootAtPlayer = player2Health === 1 ? Math.random() < 0.4 : Math.random() < 0.7;
    shoot(shootAtPlayer ? "opponent" : "self");
}

// Generar cartucho balanceado
function generateChamber() {
    const minLive = 1;
    const maxLive = 4;
    liveShells = Math.floor(Math.random() * (maxLive - minLive + 1)) + minLive;
    blankShells = 6 - liveShells;
    
    chamber = Array(blankShells).fill('blank').concat(Array(liveShells).fill('live'));
    shuffleArray(chamber);
}

// Barajar el cartucho
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Disparar
function shoot(player) {
    if (!gameActive || chamber.length === 0) return;

    clearCurrentTimeout();
    
    const shell = chamber.pop();
    const isOpponent = (player === "opponent");
    const isLive = (shell === "live");
    const targetPlayer = (turn === 1) ? 
        (isOpponent ? "player2" : "player1") : 
        (isOpponent ? "player1" : "player2");

    shotgun.dataset.aim = (turn === 1) ? (isOpponent ? "2" : "1") : (isOpponent ? "1" : "2");

        // Reproducir sonido según el tipo de bala
        setTimeout(()=>{
            if (isLive) {
                shootSound.currentTime = 0;
                shootSound.play();
            } else {
                blankSound.currentTime = 0;
                blankSound.play();
            }
        }, 200);

    currentTimeout = setTimeout(() => {
        setStatus(`¡Bala ${isLive ? "REAL" : "falsa"}! ${isLive ? "¡DAÑO!" : "¡SALVASTE!"}`);
        if (isLive) {
            damage(targetPlayer, 1);
        }
        
        updateBulletDisplay();
        
        if (!gameActive) return;
        
        if (isLive || isOpponent) {
            if (chamber.length === 0) {
                currentTimeout = setTimeout(reload, 1500);
            } else {
                currentTimeout = setTimeout(nextTurn, 1500);
            }
        } else if (!isOpponent) {
            currentTimeout = setTimeout(nextTurn, 1500);
        }
    }, 1000);
}

// Recargar
function reload() {
    if (!gameActive) return;
    
    clearCurrentTimeout();
    generateChamber();
    setStatus(`Recarga: ${liveShells} bala(s) real(es) y ${blankShells} falsa(s)`);
    updateBulletDisplay();
    shotgun.dataset.aim = "";
    currentTimeout = setTimeout(nextTurn, 1500);
}

// Daño al jugador
function damage(player, amount) {
    if (!gameActive) return;
    
    if (player === "player1") player1Health -= amount;
    if (player === "player2") player2Health -= amount;
    renderHealth();
}

// Mostrar salud
function renderHealth() {
    player1HealthElement.innerText = '⚡'.repeat(Math.max(0, player1Health));
    player2HealthElement.innerText = '⚡'.repeat(Math.max(0, player2Health));

    if (player1Health <= 0 || player2Health <= 0) {
        gameActive = false;
        clearCurrentTimeout();
        
        const winner = player1Health <= 0 ? "¡OPONENTE GANA!" : "¡TÚ GANAS!";
        
        shootOpponentBtn.classList.add('hidden');
        shootSelfBtn.classList.add('hidden');
        
        setStatus(`${winner} <button id="reiniciar-btn" style="cursor: pointer;">JUGAR DE NUEVO</button>`);
        
        shotgun.dataset.aim = "";
        
        const restartBtn = document.getElementById('reiniciar-btn');
        if (restartBtn) {
            restartBtn.onclick = function() {
                inicio.style.display = "none";
                juego.style.display = "block";
                startGame();
            };
        }
    }
}

// Cambiar turno
function nextTurn() {
    shotgun.dataset.aim = "";
    turn = turn === 1 ? 2 : 1;
    renderTurn();
    
    if (turn === 2 && gameActive) {
        setStatus("Turno del oponente...");
        currentTimeout = setTimeout(opponentTurn, 1500);
    } else if (gameActive) {
        setStatus("Tu turno - ¡DISPARA!");
    }
}

// Mostrar turno actual
function renderTurn() {
    document.getElementById("player-1").classList.toggle("active", turn === 1);
    document.getElementById("player-2").classList.toggle("active", turn === 2);
    
    shootOpponentBtn.classList.toggle("hidden", turn !== 1);
    shootSelfBtn.classList.toggle("hidden", turn !== 1);
}

// Actualizar balas en UI
function updateBulletDisplay() {
    bulletDisplay.innerHTML = "";
    chamber.forEach(shell => {
        const bullet = document.createElement("div");
        bullet.className = `bullet ${shell}`;
        bulletDisplay.appendChild(bullet);
    });
}

// Mensajes de estado
function setStatus(message) {
    statusElement.innerHTML = message;
}

startGame();

shootOpponentBtn.addEventListener("click", function() {
    if (turn === 1 && gameActive) {
        shoot("opponent");
    }
});

shootSelfBtn.addEventListener("click", function() {
    if (turn === 1 && gameActive) {
        shoot("self");
    }
});