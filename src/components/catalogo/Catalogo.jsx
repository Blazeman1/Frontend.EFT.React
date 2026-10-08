import ListaVideojuegos from './ListaVideojuegos.jsx'
import EsqueletoCatalogo from './EsqueletoCatalogo.jsx'
import { pluralizar } from '../../utils/formato.js'

/**
 * Catalogo — sección del catálogo (<section id="catalogo">).
 *
 * Recibe por props la lista de videojuegos y el estado de la carga, y decide
 * qué mostrar (renderizado condicional): esqueleto, error o lista de tarjetas.
 */
function Catalogo({ videojuegos, cargando, error, onReintentar }) {
  function renderizarContenido() {
    if (cargando) return <EsqueletoCatalogo />

    if (error) {
      return (
        <div className="alert alert-danger d-flex flex-column flex-sm-row align-items-sm-center gap-3" role="alert">
          <div className="flex-grow-1">
            <strong>No pudimos cargar los videojuegos.</strong>
            <div className="small">{error}</div>
          </div>
          <button type="button" className="btn btn-outline-light" onClick={onReintentar} data-testid="reintentar">
            Reintentar
          </button>
        </div>
      )
    }

    return <ListaVideojuegos videojuegos={videojuegos} />
  }

  return (
    <section id="catalogo" className="seccion py-5" aria-labelledby="tituloCatalogo">
      <div className="container">
        <h2 id="tituloCatalogo" className="mb-1">
          Catálogo de videojuegos
        </h2>
        <p className="text-body-secondary mb-4" aria-live="polite">
          {cargando ? 'Cargando catálogo...' : error ? 'Catálogo no disponible' : pluralizar(videojuegos.length, 'videojuego')}
        </p>

        {renderizarContenido()}
      </div>
    </section>
  )
}

export default Catalogo
