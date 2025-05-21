/*Variables globales*/
var shootSound, blankSound, reloadSound, defib, cigaretteSound, beerSound, lensSound, handsawSound;
var gameActive = false;
var activeTurn;
var liveBullet, blanckBullet;
var player1Health, player2Health;
var chamber;
var player1 = {hasKnife: false}, player2 = {hasKnife: false};
var player1Items = [];
var player2Items = [];

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
const container = document.getElementById("items-list-player");
const botcontainer = document.getElementById("items-list-bot");
let currentTimeout = null;

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
    handsawSound = new Audio('sounds/handsaw.ogg');
    beerSound = new Audio('sounds/beer.ogg');
    cigaretteSound = new Audio('sounds/cigarrette.ogg');
    lensSound = new Audio('sounds/magnifier.ogg');

    //Genera las balas aleatoriamente.
    generateChamber();    

    setTimeout(()=>{
        reloadSound.play(); //Hace el sonido de recarga
    }, 500);

    //Indica de quien es el turno y la vida que tiene cada personaje
    showTurn();
    showHealth();

    player1Health = 3;
    player2Health = 3;

    player1Items = randomItems();
    player2Items = randomItems();

    showItems(); 


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
        
        if(activeTurn === 1){
            if (isLive && player1.hasKnife) {
                damage(targetPlayer, 2);
                player1.hasKnife = false;
            }else if(isLive){
                damage(targetPlayer, 1);
            }
        }else{
            if (isLive && player2.hasKnife) {
                damage(targetPlayer, 2);
                player2.hasKnife = false;
            }else if(isLive){
                damage(targetPlayer, 1);
            }            
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
    
    if (activeTurn === 2){
        setTimeout(() => {
            if (player2Items.length > 0) {
                // Intentar usar un ítem con 50% de probabilidad
                if (Math.random() < 0.5) {
                    const index = Math.floor(Math.random() * player2Items.length);
                    const key = player2Items[index];
        
                    //items que usara el bot
                    ITEMS[key].use('player2');
                    setStatus(`OPONENTE USÓ ${key}`);
                    //se elimina solo un item (el que usa)
                    player2Items.splice(index, 1);
                    if(key == "beer") beerSound.play();
                    if(key == "knife") handsawSound.play();
                    if(key == "cigarette") cigaretteSound.play();
                    if(key == "lens") lensSound.play();
                    showItems();
                }
            }
            
            //cuenta cuantas balas reales quedan en el cargador
            const liveCount = chamber.filter(b => b === 'live').length;

            //obtiene la cant. total de balas
            const totalLeft = chamber.length;
    
            const probaLive = liveCount / totalLeft;
    
            let decision;
            //el bot tiene 50% prob. de disparar o si el j1 tiene una vida, disparar al oponente
            if (probaLive > 0.5 || player1Health === 1){
                decision = 'opponent';
            } else{
                //el bot se dispara a si mismo
                decision = 'self';
            }
    
            shoot(decision);
        }, 1000);
    }
}

// Declaracion de los items, nombre, descripcion, uso
const ITEMS = {
    cigarette : {
        name : "cigarette",
        description: "Recupera 1 punto de vida",
        use : (player) => {
            // Si los jugadores tienen menos de 3 vidas, el cigarro repone una vida
            if (player === 'player1' && player1Health < 3) player1Health ++;
            if(player === 'player2' && player2Health < 3) player2Health++;
            // Llama al metodo vidas de los jugadores
            showHealth();
        }
    },

    beer : {
        name : "beer",
        description: "Reduce la cantidad de balas",
        use : (player) => {
            //Si el cargador tiene balas, se elimina la siguiente bala en disparar
            if(chamber.length > 0){
                chamber.pop(); //Elimina la ultima bala
            }
        } 
    },

    lens : {
        name : "lens",
        description: "Muestra la siguiente bala",
        use : (player) => {
            //Si el cargador tiene balas el jugador puede ver cual bala sigue
            if(chamber.length > 0){
                setStatus(`La siguiente bala es: ${chamber[chamber.length -1]}`);
            }
        }
    },

    knife : {
        name : "knife",
        description: "Provoca doble daño",
        use : (player) => {
            //Unicamente cambia la var boolean, player has knife
            player === 'player1' ? player1.hasKnife = true : player2.hasKnife = true;
        }
    }
}

// Funcion asigna Items de forma random
function randomItems(){
    //Obtiene los nombres de los items
    const keys = Object.keys(ITEMS);

    //Asigna minimo 2 Items randoms al jugador
    const numItems = Math.floor(Math.random()*3)+2;
    
    //Reordena el array al azar
    const shuffled = keys.sort(() => .5 -Math.random());

    // Regresa los items sin repetir
    return shuffled.slice(0,numItems);
}

// funcion que muestra los items en pantalla
function showItems(){
    container.innerHTML = ``; // Limpia ítems anteriores
    botcontainer.innerHTML = ``; // Limpia los items anteriores

    player1Items.forEach((item, index) => {
        //se crea una imagen del item
        const img = document.createElement("img");
        img.src = `images/${item}.png`; // usa el nombre del ítem
        img.alt = item;
        img.classList.add("item-icon");

        //al hacer clic se ejecuta la accion
        if(gameActive){
            img.addEventListener('click', () => useItems("player1",item, index));
        }
        container.appendChild(img);
    });


    player2Items.forEach((item,index) => {
        //se crea una imagen del item
        const img = document.createElement("img");
        img.src = `images/${item}.png`;
        img.alt = item;
        img.classList.add("item-icon");

        botcontainer.appendChild(img);
    });
}

//funcion que utiliza los items
function useItems(player, item, index){
    if(player === "player1"){
        switch(item){
            case "cigarette":
                if(player1Health < 3){  //si tiene menos de 3 vidas
                    player1Health++;    //se añade una vida
                    setStatus("Cigarro, +1 vida");
                    //llama a la funcion de salud
                    showHealth();
                }else {
                    setStatus("?????????");
                }
                cigaretteSound.play();
                break;

            case "beer":
                //si hay balas en el cargador, se remueve una
                if (chamber.length > 0) {
                    let removed = chamber.pop();
                    setStatus(`Se descargó una bala : ${removed === 'live' ? 'Real' : 'Falsa'}`);
                } else {
                    //mensaje en caso de  que el cartucho este vacio
                    setStatus("No hay balas para quitar");
                }
                beerSound.play();
                break;

            case "lens":
                //mensaje que bala es la proxima en dispararse
                setStatus("La siguiente bala es: "+(chamber[chamber.length - 1]==='live' ? 'Real' : 'Falsa'));
                lensSound.play();                
                break;
                
            case "knife":
                //cambia la var player has knife
                player1.hasKnife = true;
                //mensaje sobre el daño que provocara
                setStatus("El siguiente disparo hara el doble de daño");
                handsawSound.play();
                break;    
            }
        //solo se quitara un item (el que se utilizo)
        player1Items.splice(index, 1);
        //llama la funcion de items
        showItems();
    }else{
        switch(item){
            case "cigarette":
                if(player2Health < 3){  //si tiene menos de 3 vidas
                    player2Health++;    //se añade una vida
                    setStatus("¡SE HA AUMENTADO UNA VIDA!");
                    //llama a la funcion de salud
                    showHealth();
                } else {
                    setStatus("?????????");
                }
                break;

            case "beer":
                //si hay balas en el cargador, se remueve una
                if (chamber.length > 0) {
                    let removed = chamber.pop();
                    setStatus(`Se descargó una bala : ${removed === 'live' ? 'Real' : 'Falsa'}`);
                } else {
                    //mensaje en caso de  que el cartucho este vacio
                    setStatus("No hay balas para quitar");
                }
                break;

            case "lens":
                //mensaje que bala es la proxima en dispararse
                setStatus("Interesante....");
                //Agregar en funcion a que bala es
                break;
                
            case "knife":
                //cambia la var player has knife
                player2.hasKnife = true;

                //mensaje sobre el daño que provocara
                setStatus("El siguiente disparo hara el doble de daño");
                break;                    
        }
        showItems();
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