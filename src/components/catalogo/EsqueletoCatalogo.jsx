/**
 * EsqueletoCatalogo — marcadores de posición mientras se cargan los videojuegos.
 * Usa las clases "placeholder" de Bootstrap y la misma grilla CSS que las tarjetas,
 * para que la página no "salte" cuando llegan los datos.
 */
const CANTIDAD = 6

function EsqueletoCatalogo() {
  return (
    <div role="status" data-testid="cargando-catalogo">
      <p className="text-body-secondary d-flex align-items-center gap-2">
        <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
        Cargando videojuegos...
      </p>
      <div className="grilla-juegos" aria-hidden="true">
        {Array.from({ length: CANTIDAD }, (_, indice) => (
          <div className="card h-100 placeholder-glow" key={indice}>
            <div className="placeholder esqueleto-imagen w-100"></div>
            <div className="card-body">
              <span className="placeholder col-7 mb-2 d-block"></span>
              <span className="placeholder col-11 d-block mb-1"></span>
              <span className="placeholder col-9 d-block mb-3"></span>
              <span className="placeholder btn btn-warning disabled col-12"></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EsqueletoCatalogo
