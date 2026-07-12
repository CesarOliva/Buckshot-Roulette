
# Buckshot Roulette Web

Version web inspirada en Buckshot Roulette, con una interfaz en el navegador, efectos de sonido, enemigos con habilidades y registro/inicio de sesion respaldado por MySQL.

## Descripcion

El proyecto tiene dos partes:

- Un servidor en Node.js con Express que sirve los archivos estaticos y expone endpoints para registro e inicio de sesion.
- Un frontend en HTML, CSS y JavaScript que implementa la logica del juego.

## Caracteristicas

- Registro e inicio de sesion de usuarios.
- Juego contra 4 tipos de enemigo:
  - `EL DEALER`
  - `EL TRAMPOSO`
  - `EL RESURECTOR`
  - `EL PSICOPATA`
- Sistema de vidas con 3 puntos por jugador.
- Cartucho de 6 balas con balas reales y falsas aleatorias.
- Items jugables:
  - `CIGARETTE`
  - `BEER`
  - `LENS`
  - `KNIFE`
- Sonido ambiente y efectos para acciones del juego.

## Requisitos

- Node.js 18 o superior.
- MySQL 8 o superior.

## Instalacion

1. Clona el repositorio.
2. Instala dependencias:

```bash
npm install
```

3. Crea la base de datos y la tabla de usuarios.
4. Configura las variables de entorno.
5. Inicia el servidor:

```bash
npm start
```

## Variables de entorno

El servidor usa estas variables:

- `PORT`: puerto del servidor. Por defecto `3000`.
- `MYSQLHOST`: host de MySQL. Por defecto `localhost`.
- `MYSQLUSER`: usuario de MySQL. Por defecto `root`.
- `MYSQLPASSWORD`: contrasena de MySQL. Por defecto vacia.
- `MYSQLDATABASE`: nombre de la base de datos. Por defecto `buckshot_roulette`.
- `MYSQLPORT`: puerto de MySQL. Por defecto `3306`.

Ejemplo en PowerShell:

```powershell
$env:PORT="3000"
$env:MYSQLHOST="localhost"
$env:MYSQLUSER="root"
$env:MYSQLPASSWORD=""
$env:MYSQLDATABASE="buckshot_roulette"
$env:MYSQLPORT="3306"
```

## Base de datos

El backend espera una tabla llamada `users` con una estructura compatible con estas columnas:

- `id`
- `User`
- `Password`

Ejemplo de SQL minimo:

```sql
CREATE DATABASE IF NOT EXISTS buckshot_roulette;
USE buckshot_roulette;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  User VARCHAR(100) NOT NULL UNIQUE,
  Password VARCHAR(255) NOT NULL
);
```

## Uso

1. Abre la aplicacion en el navegador.
2. Escribe un usuario y contrasena.
3. Pulsa `REGISTRARSE` para crear tu cuenta.
4. Pulsa `JUGAR` para iniciar sesion y entrar al juego.
5. Haz clic dentro de la pagina si el audio no arranca de inmediato, ya que el navegador puede bloquear la reproduccion automatica.

## API

### `POST /api/register`

Registra un usuario nuevo.

Body:

```json
{
  "usuario": "demo",
  "contraseña": "1234"
}
```

Respuestas comunes:

- `201`: usuario registrado exitosamente.
- `409`: el usuario ya existe.
- `500`: error interno.

### `POST /api/login`

Valida credenciales existentes.

Body:

```json
{
  "usuario": "demo",
  "contraseña": "1234"
}
```

Respuestas comunes:

- `200`: inicio de sesion exitoso.
- `400`: usuario o contrasena incorrectos.
- `500`: error interno.

## Estructura principal

- `server.js`: servidor Express y acceso a MySQL.
- `public/index.html`: interfaz principal.
- `public/game.js`: logica del juego.
- `public/form.js`: registro e inicio de sesion.
- `public/style.css`: estilos.
- `public/images/`: sprites e imagenes del juego.
- `public/sounds/`: efectos de audio.

## Notas del juego

- El jugador siempre empieza el turno.
- Cuando el cartucho se vacia, se recarga automaticamente.
- Algunos enemigos alteran el comportamiento del juego:
  - `EL TRAMPOSO` puede agregar una bala misteriosa.
  - `EL PSICOPATA` puede robar un item.
  - `EL RESURECTOR` puede volver a la vida una vez.
- Los items del jugador se muestran en pantalla y se usan con un clic.

## Despliegue

El frontend usa la URL local cuando detecta `localhost` y una URL remota cuando se ejecuta en produccion. Si vas a cambiar el hosting, revisa `public/form.js` y ajusta `BASE_URL`.

## Licencia

ISC
