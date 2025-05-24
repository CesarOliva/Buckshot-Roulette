//Obtiene los elementos con el DOM de Javascript
const divInicio = document.getElementById("inicio");
const divJuego = document.getElementById("juego");

const formulario = document.getElementById('formulario');
const inputUsuario = document.getElementById("usuario");
const inputContraseña = document.getElementById("password");

const btnJugar = document.getElementById('jugar');
const btnRegistro = document.getElementById('registro');

const alerts = document.getElementById('alerts');
const alertContainer = document.getElementById('alertContainer')

const BASE_URL = window.location.hostname.includes('localhost')
  ? 'http://localhost:3000/'
  : 'https://buckshot-roulette-web.up.railway.app/';

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
        //Envia los datos del registro
        enviarRegistro();
    }
}

//Envia los datos del registro
async function enviarRegistro(){
    var usuario = inputUsuario.value;
    var contraseña = inputContraseña.value;
    
    //Envia los datos al post para la petición
    const res = await fetch(`${BASE_URL}api/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({usuario, contraseña})
    });
    
    //Obtiene el mensaje de exito o error
    const data = await res.json();
    alerts.innerHTML = `${data.mensaje}`;
    alertContainer.style.display = "block";
    setTimeout(()=>{
        alertContainer.style.display = "none";
    }, 5000)
}



//Al clickear en el elemento de jugar
btnJugar.addEventListener('click', function(e){
    //Valida los datos para iniciar el juego
    validarInicio();
})

//Valida los datos para iniciar el juego
function validarInicio(){
    var correcto = true;
    //Si el elemento está vacio
    if(inputUsuario.value==''){
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
        //Envia los datos del registro
        enviarLogIn();
    }
}

//Envia los datos del LogIn
async function enviarLogIn() {
    var usuario = inputUsuario.value;
    var contraseña = inputContraseña.value;

    //Envia los datos al post para la petición
    const res = await fetch(`${BASE_URL}api/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({usuario, contraseña})
    });
    
    //Obtiene el mensaje de exito o error
    const data = await res.json();
    alerts.innerHTML = `${data.mensaje}`;
    alertContainer.style.display = 'block';
    setTimeout(()=>{
        alertContainer.style.display = 'none';
    }, 5000)
    
    if(data.mensaje == "Inicio de Sesión exitoso"){
        //Elimina los elementos de inicio de sesión y agrega los del juego
        cambiarVista();
    }
}

//Cambia la vista del formulario al juego
function cambiarVista(){
    //Oculta una sección y hace visible la otra
    divInicio.style.display = 'none';
    divJuego.style.display = "block";

    //Inicia el juego
    startGame();
}