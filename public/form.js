const divInicio = document.getElementById('inicio');
const divJuego = document.getElementById('juego');
const btnJugar = document.getElementById('jugar');

btnJugar.addEventListener('click', () => {
  divInicio.style.display = 'none';
  divJuego.style.display = 'block';
  startGame();
});
