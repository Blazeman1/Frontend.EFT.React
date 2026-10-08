import { formatearPrecio } from '../../utils/formato.js'
import { irASeccion } from '../../utils/dom.js'

/**
 * Hero — sección de inicio (<section id="inicio">).
 *
 * Props:
 *   resumen             -> { total, categorias, precioDesde } calculado en App
 *   cargando            -> muestra marcadores mientras llegan los datos
 *   categorias          -> [{ nombre, cantidad }] para los atajos por categoría
 *   onExplorarCategoria -> función de App: filtra el catálogo y lleva hasta él
 *
 * El diseño usa FLEXBOX (d-flex de Bootstrap y .hero-contenido en app.css)
 * para poner el texto y el resumen lado a lado en escritorio y apilados en móvil.
 */
function Hero({ resumen, cargando, categorias, onExplorarCategoria }) {
  const datos = [
    { etiqueta: 'Videojuegos', valor: resumen.total },
    { etiqueta: 'Categorías', valor: resumen.categorias },
    { etiqueta: 'Precios desde', valor: resumen.total ? formatearPrecio(resumen.precioDesde) : '—' },
  ]

  return (
    <section id="inicio" className="hero py-5" aria-labelledby="tituloInicio">
      <div className="container hero-contenido">
        <div className="hero-texto">
          <p className="text-warning fw-semibold text-uppercase small mb-2">Tienda online de videojuegos</p>
          <h1 id="tituloInicio" className="display-5 fw-bold">
            Encuentra tu próxima aventura en GameZone
          </h1>
          <p className="lead text-body-secondary">
            Acción, aventura, RPG, deportes, carreras y estrategia. Filtra por categoría, revisa precios y
            escríbenos si tienes dudas.
          </p>
          <div className="d-flex flex-wrap gap-2">
            <button type="button" className="btn btn-warning btn-lg" onClick={() => irASeccion('catalogo')}>
              Ver catálogo
            </button>
            <button type="button" className="btn btn-outline-light btn-lg" onClick={() => irASeccion('contacto')}>
              Contáctanos
            </button>
          </div>
        </div>

        {/* Resumen: valores derivados del estado de App (cambian al agregar o eliminar juegos) */}
        <dl className="hero-resumen" data-testid="resumen-inicio">
          {datos.map((dato) => (
            <div className="hero-dato" key={dato.etiqueta}>
              <dt>{dato.etiqueta}</dt>
              <dd className={cargando ? 'placeholder-glow' : ''}>
                {cargando ? <span className="placeholder col-8"></span> : dato.valor}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="container mt-4">
        <h2 className="h6 text-body-secondary">Explora por categoría</h2>
        <div className="d-flex flex-wrap gap-2">
          {categorias.map((categoria) => (
            <button
              key={categoria.nombre}
              type="button"
              className="btn btn-sm btn-outline-warning rounded-pill"
              onClick={() => onExplorarCategoria(categoria.nombre)}
              disabled={cargando || categoria.cantidad === 0}
              data-testid={`atajo-${categoria.nombre}`}
            >
              {categoria.nombre}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
