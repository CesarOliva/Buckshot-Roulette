# Buckshot Roulette Web

Version web inspirada en Buckshot Roulette, con una interfaz en el navegador, efectos de sonido, enemigos con habilidades y acceso directo al juego con un solo boton.

## Descripcion

El proyecto tiene dos partes:

- Un servidor en Node.js con Express que sirve los archivos estaticos.
- Un frontend en HTML, CSS y JavaScript que implementa la logica del juego.

## Caracteristicas

- Pantalla inicial simplificada con un solo boton `JUGAR`.
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

## Instalacion

1. Clona el repositorio.
2. Instala dependencias:

```bash
npm install
```

3. Inicia el servidor:

```bash
npm start
```

## Uso

1. Abre la aplicacion en el navegador.
2. Pulsa `JUGAR` para entrar al juego.
3. Haz clic dentro de la pagina si el audio no arranca de inmediato, ya que el navegador puede bloquear la reproduccion automatica.

## Estructura principal

- `server.js`: servidor Express para archivos estaticos.
- `public/index.html`: interfaz principal.
- `public/game.js`: logica del juego.
- `public/form.js`: arranque de la partida desde la pantalla inicial.
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

## Licencia

ISC
