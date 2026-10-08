import FiltroCategorias from './FiltroCategorias.jsx'
import ListaVideojuegos from './ListaVideojuegos.jsx'
import EsqueletoCatalogo from './EsqueletoCatalogo.jsx'
import { pluralizar } from '../../utils/formato.js'

/**
 * Catalogo — sección del catálogo (<section id="catalogo">).
 *
 * Orquesta los componentes del catálogo y les pasa por props lo que necesitan:
 *   FiltroCategorias <- categorias, categoriaActiva, onCambiarCategoria
 *   ListaVideojuegos <- videojuegosFiltrados
 *
 * El estado de los filtros vive en App: así otras secciones (por ejemplo los
 * atajos de inicio) también pueden cambiar la categoría.
 */
function Catalogo({
  videojuegos,
  videojuegosFiltrados,
  categorias,
  categoriaActiva,
  onCambiarCategoria,
  busqueda,
  onCambiarBusqueda,
  cargando,
  error,
  onReintentar,
}) {
  function limpiarFiltros() {
    onCambiarCategoria('Todas')
    onCambiarBusqueda('')
  }

  /** Renderizado condicional del contenido principal del catálogo. */
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

    if (videojuegosFiltrados.length === 0) {
      return (
        <div className="estado-vacio" data-testid="sin-resultados">
          <p className="mb-3">
            No hay videojuegos
            {categoriaActiva !== 'Todas' && <> en la categoría <strong>{categoriaActiva}</strong></>}
            {busqueda.trim() && <> que coincidan con &quot;{busqueda.trim()}&quot;</>}.
          </p>
          <button type="button" className="btn btn-outline-warning" onClick={limpiarFiltros}>
            Ver todos los videojuegos
          </button>
        </div>
      )
    }

    return <ListaVideojuegos videojuegos={videojuegosFiltrados} />
  }

  const deshabilitado = cargando || Boolean(error)

  return (
    <section id="catalogo" className="seccion py-5" aria-labelledby="tituloCatalogo">
      <div className="container">
        <div className="mb-4">
          <h2 id="tituloCatalogo" className="mb-1">
            Catálogo de videojuegos
          </h2>
          <p className="text-body-secondary mb-0" aria-live="polite" data-testid="contador-catalogo">
            {cargando
              ? 'Cargando catálogo...'
              : error
                ? 'Catálogo no disponible'
                : `Mostrando ${videojuegosFiltrados.length} de ${pluralizar(videojuegos.length, 'videojuego')}`}
          </p>
        </div>

        {/* Barra de filtros: categoría + búsqueda por nombre */}
        <div className="barra-filtros mb-4">
          <FiltroCategorias
            categorias={categorias}
            activa={categoriaActiva}
            onCambiar={onCambiarCategoria}
            total={videojuegos.length}
            deshabilitado={deshabilitado}
          />
          <div className="barra-filtros__busqueda">
            <label htmlFor="busqueda" className="form-label small text-body-secondary mb-1">
              Buscar por nombre
            </label>
            <input
              id="busqueda"
              type="search"
              className="form-control"
              placeholder="Ej: Galaxia"
              value={busqueda}
              onChange={(evento) => onCambiarBusqueda(evento.target.value)}
              disabled={deshabilitado}
            />
          </div>
        </div>

        {renderizarContenido()}
      </div>
    </section>
  )
}

export default Catalogo
