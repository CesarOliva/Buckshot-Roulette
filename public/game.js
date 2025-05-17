/*Variables globales*/
var shootSound, blankSound, reloadSound, defib;
var gameActive = false;
var activeTurn;
var liveBullet, blanckBullet;
var player1Health, player2Health;
var chamber;

//Elementos del DOM
const audio = document.getElementById("audio");
const divBalas = document.getElementById("bullet_display");
const statusElement = document.getElementById("status");
const shootOpponentBtn = document.getElementById("shoot-opponent");
const shootSelfBtn = document.getElementById("shoot-self");
const player1HealthElement = document.getElementById("player-1-health");
const player2HealthElement = document.getElementById("player-2-health");
const shotgun = document.getElementById("shotgun");
const bloodImg = document.getElementById("blood");
let currentTimeout = null;

// Variables globales

// Inicialización del juego
function startGame() {
    //Se establecen las vidas y el estado del juego
    player1Health = 3;
    player2Health = 3;
    gameActive = true;
    activeTurn = 1; //Empieza siempre el usuario
    audio.setAttribute('src', 'sounds/backgroundNoise.ogg'); //Cambia la musica de fondo
    shotgun.dataset.aim = "";
    
    // Carga los sonidos
    shootSound = new Audio('sounds/liveBullet.wav');
    blankSound = new Audio('sounds/blanckBullet.wav');
    reloadSound = new Audio('sounds/rack shotgun.ogg');
    defib = new Audio('sounds/defib.ogg');

    //Genera las balas aleatoriamente.
    generateChamber();    

    setTimeout(()=>{
        reloadSound.play(); //Hace el sonido de recarga
    }, 500);

    //Indica de quien es el turno y la vida que tiene cada personaje
    showTurn();
    showHealth();

    clearCurrentTimeout();

    //Establece el texto del estado
    setStatus("EMPIEZA EL JUEGO - ¡DISPARA!");
}

// Generar las balas del cartucho
function generateChamber() {
    const minLive = 1;
    const maxLive = 4;
    liveBullet = Math.floor(Math.random() * (maxLive - minLive + 1)) + minLive;  //Cantidad de balas activas
    blanckBullet = 6 - liveBullet;                                               //Cantidad de balas vacias
    
    //Agrega las balas al cartucho
    chamber = Array(blanckBullet).fill('blank').concat(Array(liveBullet).fill('live')); //Llena de un arreglo con las balas

    //Muestra la cantidad de balas buenas y malas antes de estar revueltas
    showBulletDisplay();

    //Mezcla el cartucho
    shuffleChamber(chamber);
}

// Mezcla las balas del cartucho
function shuffleChamber(chamber){
    // Algoritmo de Fisher-Yates que intercambia la posición i por el aleatorio j
    for (let i = chamber.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [chamber[i], chamber[j]] = [chamber[j], chamber[i]];
    }
}

// Muestra las balas por unos breves segundos
function showBulletDisplay() {
    //Muestra las balas
    divBalas.style.display = "flex";
    divBalas.innerHTML = "";
    chamber.forEach(shell => {
        const bullet = document.createElement("div");
        bullet.className = `bullet ${shell}`;
        divBalas.appendChild(bullet);
    });

    //Pasados dos segundos las quita
    setTimeout(()=>{
        divBalas.style.display = 'none';
    }, 2000);
}

// Recargar el cartucho
function reload() {
    //Apunta neutro por el momento
    shotgun.dataset.aim = "";

    clearCurrentTimeout();
    
    //Genera las balas aleatorias y posteriormente las revuelve
    generateChamber();

    //Muestra el mensaje de status
    setStatus(`Recarga: ${liveBullet} bala(s) real(es) y ${blanckBullet} falsa(s)`);
    
    //Sonido de recarga
    reloadSound.play();
    
    currentTimeout = setTimeout(nextTurn, 1500);
}

// Mostrar turno actual
function showTurn() {
    //Obtiene los elementos que indican las vidas e intercambia la clase activa
    document.getElementById("player-1").classList.toggle("active", activeTurn === 1);
    document.getElementById("player-2").classList.toggle("active", activeTurn === 2);
    
    //Oculta los botones cuando es turno del oponente
    shootOpponentBtn.classList.toggle("hidden", activeTurn !== 1);
    shootSelfBtn.classList.toggle("hidden", activeTurn !== 1);
}

// Mostrar la salud de los jugadores
function showHealth() {
    //Agrega rayitos indicando cuantas vidas tiene
    player1HealthElement.innerText = '⚡'.repeat(Math.max(0, player1Health));
    player2HealthElement.innerText = '⚡'.repeat(Math.max(0, player2Health));

    //Cuando la vida de alguno de los jugadores sea 0 o menor a 0
    if (player1Health <= 0 || player2Health <= 0) {
        //Cambia el estado del juego a falso
        gameActive = false;

        //Estado de la escopeta a neutro
        shotgun.dataset.aim = "";

        //muestra quien gana
        var winner;
        if(player1Health <=0){
            winner = "OPONENTE";
            audio.setAttribute('src', 'sounds/death.ogg')
        }else{
            winner = "USUARIO"
            audio.setAttribute('src', 'sounds/win.ogg')
        }

        //Oculta los botones de disparo
        shootOpponentBtn.classList.add('hidden');
        shootSelfBtn.classList.add('hidden');
        
        //Crea un boton para reiniciar el juego
        setStatus(`¡${winner} GANA! <button id="reiniciar-btn" style="cursor: pointer;">JUGAR DE NUEVO</button>`);
        
        const restartBtn = document.getElementById('reiniciar-btn');
        restartBtn.onclick = function(e) {
            startGame();
        };

        clearCurrentTimeout();
    }
}

//Botones de disparo
shootOpponentBtn.addEventListener("click", function() {
    if (activeTurn === 1 && gameActive) {
        shoot("opponent");
    }
});

shootSelfBtn.addEventListener("click", function() {
    if (activeTurn === 1 && gameActive) {
        shoot("self");
    }
});


// Función de disparar
function shoot(player) {
    if(!gameActive) return;

    clearCurrentTimeout();
    
    var shell = chamber.pop(); //Guarda y quita el ultimo elemento del arreglo
    var isOpponent = (player === "opponent"); //Guarda en booleano si a quien tira es oponente
    var isLive = (shell === "live"); //Guarda en booleano si es una bala real

    //Obtiene el jugador a quien se disparará
    var targetPlayer;
    if(activeTurn === 1){
        if(isOpponent){
            targetPlayer = "player2"
        }else{
            targetPlayer = "player1";
        }
    }else{
        if(isOpponent){
            targetPlayer = "player1"
        }else{
            targetPlayer = "player2";
        }
    }

    
    // Reproducir sonido según el tipo de bala
    setTimeout(()=>{
        if (isLive) {
            shootSound.play();
        } else {
            blankSound.play();
        }
    }, 500);

    //hace la animación de a quien apunta
    if(activeTurn === 1){
        if(isOpponent){
            shotgun.dataset.aim = "2";
            if(isLive){
                setTimeout(()=>{
                    defib.play();
                }, 500)
            }
        }else{
            shotgun.dataset.aim = "1";
            if(isLive){
                setTimeout(()=>{
                    bloodImg.style.display = 'block'
                    defib.play();
                }, 500)
                setTimeout(()=>{
                    bloodImg.style.display = 'none'
                }, 2000)
            }
        }
    }else{
        if(isOpponent){
            shotgun.dataset.aim = "1";
            if(isLive){
                setTimeout(()=>{
                    bloodImg.style.display = 'block'
                    defib.play();
                }, 500)
                setTimeout(()=>{
                    bloodImg.style.display = 'none'
                }, 2000)
            }            
        }else{
            shotgun.dataset.aim = "2";
            if(isLive){
                setTimeout(()=>{
                    defib.play();
                }, 500)
            }            
        }
    }

    currentTimeout = setTimeout(() => {
        if(isLive && activeTurn === 1 && !isOpponent) setStatus(`!VAYA SUICIDA!`);
        if(isLive && activeTurn === 1 && isOpponent) setStatus(`¡ESO, BALA REAL!`);
        if(!isLive && activeTurn === 1 && !isOpponent) setStatus(`¡QUE HUEVOS!`);
        if(!isLive && activeTurn === 1 && isOpponent) setStatus(`¡BUUUU, MALA SUERTE!`);
        
        if (isLive) {
            damage(targetPlayer, 1);
        }
        
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
    
    if(chamber.length === 0){
        reload();
    }
}

// Turno del oponente
function opponentTurn() {
    if (!gameActive) return;
    
    const shootAtPlayer = player2Health === 1 ? Math.random() < 0.4 : Math.random() < 0.7;
    shoot(shootAtPlayer ? "opponent" : "self");
}

// Daño al jugador
function damage(player, amount) {
    if (!gameActive) return;
    
    if (player === "player1") player1Health -= amount;
    if (player === "player2") player2Health -= amount;
    showHealth();
}

// Cambiar turno
function nextTurn() {
    shotgun.dataset.aim = "";
    activeTurn = activeTurn === 1 ? 2 : 1;
    showTurn();
    
    if (activeTurn === 2 && gameActive) {
        setStatus("Turno del oponente...");
        currentTimeout = setTimeout(opponentTurn, 1500);
    } else if (gameActive) {
        setStatus("Tu turno - ¡DISPARA!");
    }
}

// Mensajes de estado
function setStatus(message) {
    statusElement.innerHTML = message;
}


// Función para limpiar el timeout actual
function clearCurrentTimeout() {
    if (currentTimeout) {
        clearTimeout(currentTimeout);
        currentTimeout = null;
    }
}