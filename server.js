//Importacion de los modulos a utilizar
const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
const cors = require('cors');

//Inicialización de los modulos
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

//Credenciales de la base de datos
const pool = mysql.createPool({
  host: process.env.MYSQLHOST || 'localhost',
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || '',
  database: process.env.MYSQLDATABASE || 'buckshot_roulette',
  port: process.env.MYSQLPORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Verificación de conexión
pool.getConnection()
  .then(conn => {
    console.log('Conexión a DB establecida');
    conn.release(); // Libera la conexión al pool
  })
  .catch(err => {
    console.error('Error de conexión a DB:', err);
  }
);

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
app.post('/api/register', async (req, res) => {
  try {
    const { usuario, contraseña } = req.body;
    
    //Verificar usuario existente
    const [users] = await pool.query("select * from users where User = ?", [usuario]);

    if (users.length > 0) {
      return res.status(409).json({ mensaje: 'Usuario ya existente' });
    }else{
        //Insertar nuevo usuario
        const [result] = await pool.query(
          "INSERT INTO users (User, Password) VALUES (?, ?)",
          [usuario, contraseña]
        );
    
        res.status(201).json({mensaje: 'Usuario registrado exitosamente', id: result.insertId});
    }
  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

//Ruta para recibir los datos de logIn
app.post('/api/login', async (req, res) => {
    try {
        const { usuario, contraseña } = req.body;

        const [users] = await pool.query("select * from users where User=? and Password = ?", [usuario, contraseña]);

        if(resultado.length === 0){
            return res.status(400).json({mensaje: 'Usuario o contraseña incorrectos'});
        }else{
            res.status(200).json({mensaje: 'Inicio de Sesión exitoso'});
        }
        //Verificar si el usuario existe
        if (users.length === 0) {
            return res.status(400).json({mensaje: 'Usuario o contraseña incorrectos'});
        }else{
            const user = users[0];
            res.status(200).json({mensaje: 'Inicio de sesión exitoso', id: user.id});
        }
    } catch (error) {
        console.error('Error en login:', error);
        
        if (error.code === 'PROTOCOL_CONNECTION_LOST') {
            return res.status(503).json({ mensaje: 'Servicio no disponible, intenta nuevamente' });
        }
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
});

//Inicia el servidor
app.listen(PORT, ()=>{
    console.log('Servidor activo en el puerto: '+PORT);
});

// Cierre al terminar la app
process.on('SIGTERM', async () => {
  console.log('Cerrando pool de MySQL...');
  await pool.end();
  process.exit(0);
});