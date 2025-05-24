/*Variables globales*/
var shootSound, blankSound, reloadSound, defib, cigaretteSound, beerSound, lensSound, handsawSound, laughSound;
var gameActive = false;
var activeTurn;
var liveBullet, blanckBullet;
var player1Health, player2Health;
var chamber;
var player1 = {hasKnife: false}, player2 = {hasKnife: false};
var player1Items = [];
var player2Items = [];
var enemyCharacter = "EL DEALER"; // Por defecto
var resurrectionUsed; // Para el Resurrector
var bulletAdded;

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
const imgEnemigo = document.getElementById('enemigo'); 
const tablaDealer = document.getElementsByClassName('Dealer');
const tablaPsicopata = document.getElementsByClassName('Psicopata');
const tablaTramposo = document.getElementsByClassName('Tramposo');
const tablaResurector = document.getElementsByClassName('Resurector');
let currentTimeout = null;

//Declara los enemigos 
const enemyTypes = ["EL DEALER", "EL TRAMPOSO", "EL RESURECTOR", "EL PSICOPATA"];



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
    laughSound = new Audio('sounds/evil_laugh.ogg');

    //Genera las balas aleatoriamente.
    generateChamber();    

    setTimeout(()=>{
        reloadSound.play(); //Hace el sonido de recarga
    }, 500);

    //Seleccion del tipo de enemigo
    enemyCharacter = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    
    //Restablece las clases de los elementos de la tabla de winrate
    for(i=0; i<2;i++){
        tablaDealer[i].setAttribute('class', 'Dealer');
    }
    for(i=0; i<2;i++){
        tablaPsicopata[i].setAttribute('class', 'Psicopata');
    }
    for(i=0; i<2;i++){
        tablaTramposo[i].setAttribute('class', 'Tramposo');
    }
    for(i=0; i<2;i++){
        tablaResurector[i].setAttribute('class', 'Resurector');
    }


    //Muestra la imagen segun el enemigo
    switch(enemyCharacter){
        case "EL DEALER":
            imgEnemigo.setAttribute('src', 'images/Dealer.gif');
            imgEnemigo.setAttribute('class', 'enemigo dealer');
            for(i=0; i<2;i++){
                tablaDealer[i].setAttribute('class', 'Dealer active');
            }
            break;
        case "EL TRAMPOSO": 
            imgEnemigo.setAttribute('src', 'images/Tramposo.gif');
            imgEnemigo.setAttribute('class', 'enemigo');
            for(i=0; i<2;i++){
                tablaTramposo[i].setAttribute('class', 'Tramposo active')
            }
            break;
        case "EL PSICOPATA":
            imgEnemigo.setAttribute('src', 'images/Psicopata.gif');
            imgEnemigo.setAttribute('class', 'enemigo dealer');
            for(i=0; i<2;i++){
                tablaPsicopata[i].setAttribute('class', 'Psicopata active')
            }
            break;
        case "EL RESURECTOR":
            imgEnemigo.setAttribute('src', 'images/Resurector.gif');
            imgEnemigo.setAttribute('class', 'enemigo');
            for(i=0; i<2;i++){
                tablaResurector[i].setAttribute('class', 'Resurector active')
            }
            break;            
        default:
            imgEnemigo.setAttribute('src', 'images/Dealer.gif');
            imgEnemigo.setAttribute('class', 'enemigo dealer');
            for(i=0; i<2;i++){
                tablaDealer[i].setAttribute('class', 'Dealer active');
            }
            break;
    }
    
    resurrectionUsed = false; // Para el Resurrector
    bulletAdded = false; // Para el tramposo

    player1Health = 3;
    player2Health = 3;

    //Indica de quien es el turno y la vida que tiene cada personaje
    showTurn();
    showHealth();

    player1Items = randomItems();
    player2Items = randomItems();

    showItems(); 

    clearCurrentTimeout();

    //Establece el texto del estado
    setStatus("JUEGO CONTRA: "+enemyCharacter);
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
        if(isLive && activeTurn === 1 && isOpponent) setStatus(`¡DISPARASTE A ${enemyCharacter}!`);
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
            }else if(player2.hasKnife){
                player2.hasKnife = false;
            }         
        }
        
        if (!gameActive) return;
        
        // Bala real - turno normal
        if (isLive) {
            if (chamber.length === 0) {
                currentTimeout = setTimeout(reload, 1500);
            } else {
                currentTimeout = setTimeout(nextTurn, 1500);
            }
        } else { // Bala falsa
            if (!isOpponent) {
                if (activeTurn === 1) {
                    setStatus("¡BALA FALSA! DISPARA DE NUEVO");
                    shotgun.dataset.aim = "";
                }else {
                    setStatus("¡"+enemyCharacter+" VUELVE A TIRAR!");
                    currentTimeout = setTimeout(opponentTurn, 1500);
                    shotgun.dataset.aim = "";
                }
            } else {
                // Disparo a oponente con bala falsa - turno normal
                currentTimeout = setTimeout(nextTurn, 1500);
            }
        }
    }, 1000);
    
    if(chamber.length === 0){
        reload();
    }
}

// Turno del oponente
function opponentTurn() {
    if (!gameActive) return;

    //Habilidad del Tramposo (añadir bala misteriosa)
    if (enemyCharacter === "EL TRAMPOSO" && chamber.length > 0 && Math.random() < 0.3 && !bulletAdded){
        bulletAdded = true;
        var mysteryBullet = Math.random() < 0.5 ? "live" : "blank";
        chamber.push(mysteryBullet);
        setStatus("¡EL TRAMPOSO AÑADIÓ UNA BALA MISTERIOSA!");
        // Sonido de recarga para indicar que añadió una bala
        setTimeout(() => reloadSound.play(), 300);
    }
    
    //Habilidad del Psicópata (intentar robar ítem antes de disparar)
    if (enemyCharacter === "EL PSICOPATA" && Math.random() < 0.2 && player1Items.length > 0) {
        var stolenItemIndex = Math.floor(Math.random() * player1Items.length);
        var stolenItem = player1Items[stolenItemIndex];
        player1Items.splice(stolenItemIndex, 1);
        player2Items.push(stolenItem);
        setStatus(`¡EL PSICOPATA TE ROBÓ ${stolenItem}!`);
        showItems();
        // Pequeña pausa antes de continuar con el disparo
        setTimeout(() => opponentTurn(), 1000);
        return;
    }

    var shootAtPlayer;
    switch(enemyCharacter) {
        case "EL TRAMPOSO":
            // Comportamiento arriesgado, prefiere disparar al jugador
            shootAtPlayer = player2Health === 1 ? 
                Math.random() < 0.4 :  // Si tiene poca vida, 40% de dispararse
                Math.random() < 0.8;    // Sino, 80% de disparar al jugador
            break;
            
        case "EL RESURECTOR":
            // Comportamiento conservador, evita riesgos
            shootAtPlayer = player2Health === 1 ? 
                Math.random() < 0.7 :  // Si tiene poca vida, 70% de dispararse
                (player1Health === 1 ? Math.random() < 0.9 : Math.random() < 0.5);
            break;
            
        case "EL PSICOPATA":
            // Comportamiento impredecible, a menudo se dispara a sí mismo
            shootAtPlayer = player2Health === 1 ? 
                Math.random() < 0.6 :  // Si tiene poca vida, 60% de dispararse
                Math.random() < 0.3;   // Sino, solo 30% de disparar al jugador
            break;
            
        default: // Enemigo normal
            // Comportamiento original
            shootAtPlayer = player2Health === 1 ? 
                Math.random() < 0.4 : 
                (player1Health === 1 ? Math.random() < 0.7 : Math.random() < 0.6);
    }

    shoot(shootAtPlayer ? "opponent" : "self");
}

// Daño al jugador
function damage(player, amount) {
    if (!gameActive) return;
    
    if (player === "player1") player1Health -= amount;
    if (player === "player2") player2Health -= amount;

      // Habilidad del Resurrector
    if (enemyCharacter === "EL RESURECTOR" && player === "player2" && 
        player2Health <= 0 && !resurrectionUsed) {
        player2Health = 1; // Revive con 1 vida
        resurrectionUsed = true; // Marca que ya usó su habilidad
        setStatus("¡EL RESURECTOR HA REVIVIDO!");
        defib.play();
        laughSound.play();
        // Pequeña pausa antes de mostrar el cambio de vida
        setTimeout(() => showHealth(), 500);
        return;
    }   
    showHealth();
}

// Cambiar turno
function nextTurn() {
    shotgun.dataset.aim = "";
    activeTurn = activeTurn === 1 ? 2 : 1;
    showTurn();
    
    if (activeTurn === 2 && gameActive) {
        setStatus("TURNO DE "+enemyCharacter+"...");
        
         // Solo manejar el uso de ítems aquí
        if (player2Items.length > 0 && Math.random() < 0.5) {
            const index = Math.floor(Math.random() * player2Items.length);
            const key = player2Items[index];
            ITEMS[key].use('player2');
            setStatus(`OPONENTE USÓ ${key}`);
            player2Items.splice(index, 1);
            if(key == "BEER") beerSound.play();
            if(key == "KNIFE") handsawSound.play();
            if(key == "CIGARETTE") cigaretteSound.play();
            if(key == "LENS") lensSound.play();
            showItems();
            currentTimeout = setTimeout(opponentTurn, 1500);
        } else {
            currentTimeout = setTimeout(opponentTurn, 1000);
        }
    } else if (gameActive) {
        setStatus("TU TURNO - ¡DISPARA!");
    }
}

// Declaracion de los items, nombre, descripcion, uso
const ITEMS = {
    CIGARETTE : {
        name : "CIGARETTE",
        description: "Recupera 1 punto de vida",
        use : (player) => {
            // Si los jugadores tienen menos de 3 vidas, el cigarro repone una vida
            if (player === 'player1' && player1Health < 3) player1Health ++;
            if(player === 'player2' && player2Health < 3) player2Health++;
            // Llama al metodo vidas de los jugadores
            showHealth();
        }
    },

    BEER : {
        name : "BEER",
        description: "Reduce la cantidad de balas",
        use : (player) => {
            //Si el cargador tiene balas, se elimina la siguiente bala en disparar
            if(chamber.length > 0){
                chamber.pop(); //Elimina la ultima bala
            }
        } 
    },

    LENS : {
        name : "LENS",
        description: "Muestra la siguiente bala",
        use : (player) => {
            //Si el cargador tiene balas el jugador puede ver cual bala sigue
            if(chamber.length > 0){
                setStatus(`La siguiente bala es: ${chamber[chamber.length -1]}`);
            }
        }
    },

    KNIFE : {
        name : "KNIFE",
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
            case "CIGARETTE":
                if(player1Health < 3){  //si tiene menos de 3 vidas
                    player1Health++;    //se añade una vida
                    setStatus("SE HA AÑADIDO UNA VIDA");
                    //llama a la funcion de salud
                    showHealth();
                }else {
                    setStatus("?????????");
                }
                cigaretteSound.play();
                break;

            case "BEER":
                //si hay balas en el cargador, se remueve una
                if (chamber.length > 0) {
                    let removed = chamber.pop();
                    setStatus(`SE DESCARGÓ UNA BALA ${removed === 'live' ? 'Real' : 'Falsa'}`);
                } else {
                    //mensaje en caso de  que el cartucho este vacio
                    setStatus("NO HAY BALAS PARA QUITAR");
                }
                beerSound.play();
                break;

            case "LENS":
                //mensaje que bala es la proxima en dispararse
                setStatus("LA SIGUIENTE BALA ES "+(chamber[chamber.length - 1]==='live' ? 'Real' : 'Falsa'));
                lensSound.play();                
                break;
                
            case "KNIFE":
                //cambia la var player has knife
                player1.hasKnife = true;
                //mensaje sobre el daño que provocara
                setStatus("EL SIGUIENTE DISPARO HARÁ EL DOBLE DE DAÑO");
                handsawSound.play();
                break;    
            }
        //solo se quitara un item (el que se utilizo)
        player1Items.splice(index, 1);
        //llama la funcion de items
        showItems();
    }else{
        switch(item){
            case "CIGARETTE":
                if(player2Health < 3){  //si tiene menos de 3 vidas
                    player2Health++;    //se añade una vida
                    setStatus("¡"+enemyCharacter+" SE HA AUMENTADO UNA VIDA!");
                    //llama a la funcion de salud
                    showHealth();
                } else {
                    setStatus("OKEY????");
                }
                break;

            case "BEER":
                if (chamber.length > 0) {
                    let removed = chamber.pop();
                    setStatus(`SE DESCARGÓ UNA BALA ${removed === 'live' ? 'Real' : 'Falsa'}`);
                } else {
                    //mensaje en caso de  que el cartucho este vacio
                    setStatus("NO HAY BALAS PARA QUITAR");
                }
                break;

            case "LENS":
                //mensaje que bala es la proxima en dispararse
                setStatus("INTERESANTE....");
                break;
                
            case "KNIFE":
                //cambia la var player has knife
                player2.hasKnife = true;

                //mensaje sobre el daño que provocara
                setStatus("EL SIGUIENTE DISPARO HARÁ EL DOBLE DE DAÑO");
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