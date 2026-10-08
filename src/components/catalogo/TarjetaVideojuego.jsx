import { useState } from 'react'
import { IMAGEN_POR_DEFECTO } from '../../data/videojuegos.js'
import { formatearPrecio } from '../../utils/formato.js'
import { usarImagenPorDefecto } from '../../utils/dom.js'

/**
 * TarjetaVideojuego — tarjeta de Bootstrap (card) para UN videojuego.
 *
 * Componente REUTILIZABLE: se usa en la lista del catálogo y también como
 * "vista previa" dentro del formulario para agregar videojuegos.
 *
 * Props:
 *   juego       -> { nombre, categoria, precio, descripcion, imagen, nuevo? }
 *   modoAdmin   -> si es true muestra el botón Eliminar; si no, Consultar
 *   onEliminar  -> función a llamar con el id del juego (opcional)
 *   onConsultar -> función a llamar con el juego (opcional)
 *   vistaPrevia -> true cuando se usa en el formulario (sin botones)
 *
 * Estado local: confirmando, para pedir confirmación antes de eliminar.
 */
function TarjetaVideojuego({ juego, modoAdmin = false, onEliminar, onConsultar, vistaPrevia = false }) {
  const [confirmando, setConfirmando] = useState(false)

  return (
    <article className={`card tarjeta-juego h-100 ${juego.nuevo ? 'tarjeta-nueva' : ''}`} data-testid={vistaPrevia ? 'vista-previa' : `juego-${juego.id}`}>
      <div className="tarjeta-juego__imagen">
        {/* key = URL: si cambia la imagen se crea un <img> nuevo y el respaldo vuelve a funcionar */}
        <img
          key={juego.imagen || IMAGEN_POR_DEFECTO}
          src={juego.imagen || IMAGEN_POR_DEFECTO}
          alt={`Portada de ${juego.nombre || 'videojuego'}`}
          loading="lazy"
          onError={(evento) => usarImagenPorDefecto(evento, IMAGEN_POR_DEFECTO)}
        />
        <span className="badge text-bg-dark tarjeta-juego__categoria">{juego.categoria || 'Sin categoría'}</span>
        {juego.nuevo && <span className="badge text-bg-success tarjeta-juego__nuevo">Nuevo</span>}
      </div>

      <div className="card-body d-flex flex-column">
        <h3 className="h5 card-title mb-1">{juego.nombre || 'Nombre del videojuego'}</h3>
        <p className="card-text text-body-secondary small flex-grow-1">{juego.descripcion || 'Descripción breve del videojuego.'}</p>
        <p className="precio mb-3">{juego.precio ? formatearPrecio(juego.precio) : '$0'}</p>

        {/* Renderizado condicional de acciones según el modo */}
        {!vistaPrevia && !modoAdmin && onConsultar && (
          <button type="button" className="btn btn-warning w-100" onClick={() => onConsultar(juego)} data-testid={`consultar-${juego.id}`}>
            Consultar disponibilidad
          </button>
        )}

        {!vistaPrevia && modoAdmin && onEliminar && (
          confirmando ? (
            <div className="d-flex gap-2" role="group" aria-label={`Confirmar eliminación de ${juego.nombre}`}>
              <button type="button" className="btn btn-danger flex-fill" onClick={() => onEliminar(juego.id)} data-testid={`confirmar-eliminar-${juego.id}`}>
                Sí, eliminar
              </button>
              <button type="button" className="btn btn-outline-light flex-fill" onClick={() => setConfirmando(false)}>
                Cancelar
              </button>
            </div>
          ) : (
            <button type="button" className="btn btn-outline-danger w-100" onClick={() => setConfirmando(true)} data-testid={`eliminar-${juego.id}`}>
              Eliminar del catálogo
            </button>
          )
        )}
      </div>
    </article>
  )
}

export default TarjetaVideojuego
