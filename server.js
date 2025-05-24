//Importacion de los modulos a utilizar
const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const cors = require('cors');

//Inicialización de los modulos
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));


//Credenciales de la base de datos
const db = mysql.createConnection({
    port: process.env.MYSQLPORT || 3306,    
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || '',
    database: process.env.MYSQLDATABASE || 'buckshot_roulette',
})

//Conectar a la base de datos
db.connect((err)=>{
    if(err){
        console.log(err)
    }else{
        console.log('Base de datos conectada');
    }
});


/*Peticiones a la base de datos*/

/*NOTA IMPORTANTE:
CODIGO      SIGNIFICADO
200         TODO BIEN
201         CREADO CORRECTAMENTE
400         DATOS INCORRECTOS
401         CREDENCIALES INVALIDAS
403         ACCESO RESTRINGIDO
404         NO ENCONTRADO
409         CONFLICTO (YA EXISTE)
500         ERROR DEL SERVIDOR
*/

//Ruta para recibir los datos del registro
app.post('/api/register', (req, res)=>{
    const { usuario, contraseña } = req.body;

    //Verifica que no exista ya el usuario
    db.query("select * from users where User=?", [usuario], (error, results)=>{
        if(error){
            return res.status(500).json({mensaje: 'Error al registrar el usuario'})
        };

        //Si no hay resultados coincidentes
        if(results.length === 0){
            const insertarUsuario = "insert into users (User, Password) values (?,?)"
            db.query(insertarUsuario, [usuario, contraseña], (error, resultado)=>{
                if(error){
                    return res.status(500).json({mensaje: 'Error al registrar el usuario'})
                }

                res.status(201).json({mensaje: 'Usuario registrado exitosamente',id:resultado.insertId});
            });
        }else{
            res.status(409).json({mensaje: 'Usuario ya existente. Intente con otro'});
        }
    });
});

//Ruta para recibir los datos de logIn
app.post('/api/login', (req, res)=>{
    const { usuario, contraseña } = req.body;

    //Verifica que coincidan los datos de usuario y contraseña
    db.query("select * from users where User=? and Password = ?", [usuario, contraseña], (error, resultado)=>{
        if(error){
            console.log(error);
            return res.status(500).json({mensaje: 'Error al iniciar sesión'})
        }

        if(resultado.length === 0){
            return res.status(400).json({mensaje: 'Usuario o contraseña incorrectos'});
        }else{
            res.status(200).json({mensaje: 'Inicio de Sesión exitoso'});
        }
    })
});

//Inicia el servidor
app.listen(PORT, ()=>{
    console.log('Servidor activo en el puerto: '+PORT);
});