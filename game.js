//Obtiene los elementos con el DOM de Javascript
const divInicio = document.getElementById("inicio");
const divJuego = document.getElementById("juego");

const inputUsuario = document.getElementById("usuario");
const inputContraseña = document.getElementById("password");

const btnJugar = document.getElementById('jugar');
const btnRegistro = document.getElementById('registro');

//Al clickear en el elemento de registro
btnRegistro.addEventListener('click', function(e){
    validarRegistro();
    e.preventDefault();
});

//Valida los datos del formulario para hacer el registro de usuarios
function validarRegistro(){
    var correcto = true;
    //Si el elemento está vacio o tiene espacios
    if(inputUsuario.value=='' || inputUsuario.value.includes(" ")){
        //Marca error en el elemento
        inputUsuario.setAttribute('class', 'error');
        inputUsuario.addEventListener('click', function(e){
            inputUsuario.setAttribute('class', "")
        });
        correcto = false;
    };
    
    //Si el elemento está vacio
    if(inputContraseña.value==''){
        //Marca error en el elemento
        inputContraseña.setAttribute('class', 'error');
        inputContraseña.addEventListener('click', function(e){
            inputContraseña.setAttribute('class', "")
        });
        correcto = false;
    };

    //Si todo está correcto
    if(correcto){
        //Envia los datos a la base de datos
    }
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




let player1Health;
let player2Health;
let player1Items = [];
let player2Items = [];
let player1 = {hasKnife: false};
let player2 = {hasKnife: false};
let turn;
let blankShells;
let liveShells;
let chamber;
let cigarette;
let beer;
let knife;
let lens;

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

    //OCULTAR DESPUES DE CINCO SEGUNDOS
    setTimeout(() => {
        bulletDisplay.style.display = 'none';
    }, 5000 );

    alert('El oponente esta revolviendo el cartucho');

}

function shoot(player) {

    const shell = chamber.pop();
    if (shell === 'live') {

    let damageAmount = 1;

    // Verifica si hay cuchillo activo para aplicar daño doble
    if (turn === 1 && player1.hasKnife) {
        damageAmount = 2;
        player1.hasKnife = false;
    }

    if (turn === 2 && player2.hasKnife) {
        damageAmount = 2;
        player2.hasKnife = false;
    }

    if (turn === 1) {
        if (player === "opponent") {
            shotgun.dataset.aim = "2";
            setTimeout(() => {
                alert("¡Se disparó una bala real!");
                damage("player2", damageAmount);
            }, 1000);

        } else if (player === "self") {
            shotgun.dataset.aim = "1";
            setTimeout(() => {
                alert("¡Se disparó una bala real!");
                damage("player1", damageAmount);
            }, 1000);
        }
    }

    if (turn === 2) {
        if (player === "opponent") {
            shotgun.dataset.aim = "1";
            setTimeout(() => {
                alert("¡Se disparó una bala real!");
                damage("player1", damageAmount);
            }, 1000);

        } else if (player === "self") {
            shotgun.dataset.aim = "2";
            setTimeout(() => {
                alert("¡Se disparó una bala real!");
                damage("player2", damageAmount);
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

const ITEMS = {
    cigarette : {
        name : "Cigarro",
        description: "Recupera 1 punto de vida",
        use : (player) => {
            if (player1 === 'player1' && player1Health < 3) player1Health ++;
            if(player2 === 'player2' && player2Health < 3) player2Health++;
            renderHealth();
        }
    },

    beer : {
        name : "Cerveza",
        description: "Reduce la cantidad de balas",
        use : (player) => {
            if(chamber.length > 0){
                chamber = chamber.filter(b => b !== 'live');
                chamber.push('blank');
            }
        } 
    },

    lens : {
        name : "Lupa",
        description: "Muestra la siguiente bala",
        use : (player) => {
            if(chamber.length > 0){
                alert('La siguiente bala es: ${chamber[chamber.length -1]}');
            }
        }
    },

    knife : {
        name : "Cuchillo",
        description: "Porvoca doble daño",
        uso : (player) => {
            player.hasKnife = true;
        } 
    }
}

function randomItems(){
    const keys = Object.keys(ITEMS);
    const numItems = Math.floor(Math.random()*3)+2;
    const shuffled = keys.sort(() => .5 -Math.random());
    return shuffled.slice(0,numItems);
}


function renderItems(){
    const container = document.getElementById("items-list");
    container.innerHTML = ''; // Limpia ítems anteriores

    player1Items.forEach((item, index) => {
        const btn = document.createElement("button");
        btn.innerText = item;
        btn.classList.add("item-button");
        btn.onclick = () => useItem(item, index);
        container.appendChild(btn);
    });
    /*const container = document.getElementById("player-items");
    container.innerHTML = "";

    player1Items.forEach((key,index) => {
        const item = ITEMS[keys];
        const btn = document.createElement("button");
        btn.innerText = inter.name;
        btn.title = item.description;
        btn.onclick = () => {
            item.use('player1');
            player1Items.splice(index,1);
            renderItems();
        };
        container.appendChild(btn);
    });*/
}

function userItems(player, item,index){
    if(payer === "player1"){
        switch(item){
            case "Cigarro":
                if(player1Health < 3){
                    player1Health++;
                    alert("Cigarro, +1 vida");
                    renderHealth();
                } else {
                    alert("Ya tienes la vida completa");
                    return;
                }
                break;

            case "Cerveza":
                if (chamber.length > 0) {
                const removed = chamber.pop();
                    alert(`Descargaste una bala : ${removed === 'live' ? 'Real' : 'Falsa'}`);
                } else {
                alert("No hay balas para quitar");
            }
                break;

            case "Lupa":
                alert("La siguiente bala es: "+chamber[chamber.length - 1]==='live' ? 'Real' : 'Falsa');
                break;
                
            case "Cuchillo":
                player1.hasKnife = true;
                alert("El sigueinte disparo hara el doble de daño");
                break;    
        }
        player1Items.splice(index, 1);
        renderItems();
    }
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

        if (turn === 2){
           // setTimeout(()=> {
              //  if(player2Items.length > 0 && Math.random()< .5){
                   // const key =player2Items.pop();
                 //   ITEMS[key].use('player2');
               // }
         //   });

            setTimeout(() => {
                
                if(player2Items.length > 0 && Math.random()< .5){
                    const key =player2Items.pop();
                    ITEMS[key].use('player2');
                 }
                const liveCount = chamber.filter(b => b === 'live').length;
                const totalLeft = chamber.length;

                const probaLive = liveCount / totalLeft;

                let decision;
                if (probaLive > 0.5 || player1Health === 1){
                    decision = 'opponent';
                } else{
                    decision = 'self';
                }

                shoot(decision);
                
            }, 1000);
        }
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

    do{
    liveShells = Math.floor(Math.random() * 5) + 2;
    blankShells = totalShells - liveShells;
    }while(liveShells === 0 || blankShells === 0);

    alert(`${liveShells} live & ${blankShells} blank shells`);
    chamber = Array(blankShells).fill('blank').concat(Array(liveShells).fill('live'));
    shuffleArray(chamber);

    bulletTemporal();
}

function startGame() {
    alert(`Comienza el Juego!!`);


    totalShells = 6;

    do{
    liveShells = Math.floor(Math.random() * 5) + 2;
    blankShells = totalShells - liveShells;
    }while(liveShells === 0 || blankShells === 0);

    chamber = Array(blankShells).fill('blank').concat(Array(liveShells).fill('live'));
    shuffleArray(chamber);

    bulletTemporal();

    player1Health = 3;
    player2Health = 3;

    player1Items = getRandomItems();
    player2Items = getRandomItems();

    //generateRandomChamber();
    renderHealth();
    renderItems();


    turn = Math.floor(Math.random() * 2) + 1;
    renderTurn();


}

startGame();