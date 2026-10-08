import { useEffect, useState } from 'react'
import FiltroCategorias from './FiltroCategorias.jsx'
import ListaVideojuegos from './ListaVideojuegos.jsx'
import EsqueletoCatalogo from './EsqueletoCatalogo.jsx'
import FormularioVideojuego from './FormularioVideojuego.jsx'
import { pluralizar } from '../../utils/formato.js'

const DURACION_AVISO_MS = 4000

/**
 * Catalogo — sección del catálogo (<section id="catalogo">).
 *
 * Orquesta los componentes del catálogo y les pasa por props lo que necesitan:
 *   FiltroCategorias  <- categorias, categoriaActiva, onCambiarCategoria
 *   ListaVideojuegos  <- videojuegosFiltrados, modoAdmin, onEliminar, onConsultar
 *   FormularioVideojuego <- videojuegos (para validar), onAgregar
 *
 * Estado LOCAL (solo le importa a esta sección):
 *   modoAdmin       -> muestra el formulario para agregar y los botones Eliminar
 *   formularioVisible
 *   aviso           -> mensaje temporal "Se agregó / Se eliminó ..."
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
  onAgregar,
  onEliminar,
  onRestablecer,
  onConsultar,
}) {
  const [modoAdmin, setModoAdmin] = useState(false)
  const [formularioVisible, setFormularioVisible] = useState(true)
  const [aviso, setAviso] = useState(null)

  // Efecto: el aviso desaparece solo después de unos segundos.
  // La limpieza cancela el temporizador si llega otro aviso antes.
  useEffect(() => {
    if (!aviso) return undefined
    const temporizador = setTimeout(() => setAviso(null), DURACION_AVISO_MS)
    return () => clearTimeout(temporizador)
  }, [aviso])

  function manejarAgregar(datos) {
    onAgregar(datos)
    setAviso({ tipo: 'success', texto: `Se agregó "${datos.nombre}" al catálogo.` })
  }

  function manejarEliminar(id) {
    const juego = videojuegos.find((item) => item.id === id)
    onEliminar(id)
    setAviso({ tipo: 'warning', texto: `Se eliminó "${juego?.nombre}" del catálogo.` })
  }

  function manejarRestablecer() {
    onRestablecer()
    setAviso({ tipo: 'info', texto: 'Se restableció el catálogo original.' })
  }

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

    if (videojuegos.length === 0) {
      return (
        <div className="estado-vacio" data-testid="catalogo-vacio">
          <p className="mb-3">No quedan videojuegos en el catálogo.</p>
          <button type="button" className="btn btn-warning" onClick={manejarRestablecer}>
            Restablecer catálogo
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

    return (
      <ListaVideojuegos
        videojuegos={videojuegosFiltrados}
        modoAdmin={modoAdmin}
        onEliminar={manejarEliminar}
        onConsultar={onConsultar}
      />
    )
  }

  const deshabilitado = cargando || Boolean(error)

  return (
    <section id="catalogo" className="seccion py-5" aria-labelledby="tituloCatalogo">
      <div className="container">
        <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
          <div>
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

          {/* Interruptor de Bootstrap (form-switch) para el modo administrador */}
          <div className="form-check form-switch mb-0">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="modoAdmin"
              checked={modoAdmin}
              onChange={(evento) => {
                setModoAdmin(evento.target.checked)
                setFormularioVisible(true)
              }}
              disabled={deshabilitado}
            />
            <label className="form-check-label" htmlFor="modoAdmin">
              Modo administrador
            </label>
          </div>
        </div>

        {/* Aviso temporal (aria-live para que los lectores de pantalla lo anuncien) */}
        <div aria-live="polite">
          {aviso && (
            <div className={`alert alert-${aviso.tipo} py-2`} data-testid="aviso-catalogo">
              {aviso.texto}
            </div>
          )}
        </div>

        {/* Herramientas de administración: solo en modo administrador */}
        {modoAdmin && !deshabilitado && (
          <>
            <div className="d-flex flex-wrap gap-2 mb-3">
              {!formularioVisible && (
                <button type="button" className="btn btn-success" onClick={() => setFormularioVisible(true)}>
                  + Agregar videojuego
                </button>
              )}
              <button type="button" className="btn btn-outline-light" onClick={manejarRestablecer} data-testid="restablecer">
                Restablecer catálogo original
              </button>
            </div>
            {formularioVisible && (
              <FormularioVideojuego existentes={videojuegos} onAgregar={manejarAgregar} onCerrar={() => setFormularioVisible(false)} />
            )}
          </>
        )}

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
