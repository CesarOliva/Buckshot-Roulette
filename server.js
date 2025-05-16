//Importacion de los modulos a utilizar
const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const cors = require('cors');

//Inicialización de los modulos
const app = express();
app.use(cors());
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

//Credenciales de la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'buckshot_roulette'
})

//Conectar a la base de datos
db.connect((err)=>{
    console.log('Base de datos conectada');
});

//Ruta para recibir los datos del formulario
app.post('/api/save', (req, res)=>{
    const { usuario, contraseña } = req.body;
    const insertarUsuario = "insert into usuarios (Usuario, Contraseña) values (?,?)"
    db.query(insertarUsuario, [usuario, contraseña], (err, resultado)=>{
        if(err){
            console.log(err);
            return res.status(500).json({mensaje: 'Error al registrar el usuario'})
        }
        res.status(200).json({mensaje: 'Usuario registrado exitosamente',id:resultado.insertId});
    })
});

//Inicia el servidor
app.listen(3000, ()=>{
    console.log('Servidor activo');
});