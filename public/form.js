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
        //Envia los datos del registro
        enviarRegistro();
    }
}

//Envia los datos del registro
async function enviarRegistro(){
    var usuario = inputUsuario.value;
    var contraseña = inputContraseña.value;
    
    //Envia los datos al post para la petición
    const res = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({usuario, contraseña})
    });
    
    //Obtiene el mensaje de exito o error
    const data = await res.json();
    alert(data.mensaje);
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
    const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({usuario, contraseña})
    });
    
    //Obtiene el mensaje de exito o error
    const data = await res.json();
    alert(data.mensaje);
    
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