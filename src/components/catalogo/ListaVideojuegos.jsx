import TarjetaVideojuego from './TarjetaVideojuego.jsx'

/**
 * ListaVideojuegos — genera dinámicamente una tarjeta por cada videojuego.
 *
 * Recorre el arreglo recibido por props con .map(): React crea, actualiza o
 * elimina en el DOM solo las tarjetas que cambian, identificándolas por su
 * "key" (el id del juego). La grilla usa CSS GRID (.grilla-juegos en app.css).
 */
function ListaVideojuegos({ videojuegos, modoAdmin, onEliminar, onConsultar }) {
  return (
    <ul className="grilla-juegos list-unstyled mb-0" data-testid="lista-juegos">
      {videojuegos.map((juego) => (
        <li key={juego.id}>
          <TarjetaVideojuego juego={juego} modoAdmin={modoAdmin} onEliminar={onEliminar} onConsultar={onConsultar} />
        </li>
      ))}
    </ul>
  )
}

export default ListaVideojuegos
