/**
 * FiltroCategorias — permite filtrar el catálogo por categoría.
 *
 * Componente CONTROLADO: no guarda estado propio. Muestra la categoría activa
 * que recibe por props y avisa los cambios con onCambiar. El estado vive en
 * App, que entrega la lista ya filtrada a ListaVideojuegos.
 *
 * Responsivo: en pantallas medianas y grandes se ven botones; en móvil, un
 * menú desplegable (select) que ocupa menos espacio (clases d-none / d-md-flex).
 */
function FiltroCategorias({ categorias, activa, onCambiar, total, deshabilitado }) {
  const opciones = [{ nombre: 'Todas', cantidad: total }, ...categorias]

  return (
    <div>
      {/* Botones: tablet y escritorio */}
      <div className="d-none d-md-flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
        {opciones.map((opcion) => {
          const seleccionada = activa === opcion.nombre
          return (
            <button
              key={opcion.nombre}
              type="button"
              className={`btn btn-sm ${seleccionada ? 'btn-warning' : 'btn-outline-secondary'}`}
              aria-pressed={seleccionada}
              onClick={() => onCambiar(opcion.nombre)}
              disabled={deshabilitado || (opcion.cantidad === 0 && !seleccionada)}
              data-testid={`filtro-${opcion.nombre}`}
            >
              {opcion.nombre} <span className="badge text-bg-dark ms-1">{opcion.cantidad}</span>
            </button>
          )
        })}
      </div>

      {/* Menú desplegable: móvil */}
      <div className="d-md-none">
        <label htmlFor="filtroCategoriaMovil" className="form-label small text-body-secondary mb-1">
          Categoría
        </label>
        <select
          id="filtroCategoriaMovil"
          className="form-select"
          value={activa}
          onChange={(evento) => onCambiar(evento.target.value)}
          disabled={deshabilitado}
        >
          {opciones.map((opcion) => (
            <option key={opcion.nombre} value={opcion.nombre} disabled={opcion.cantidad === 0 && activa !== opcion.nombre}>
              {opcion.nombre} ({opcion.cantidad})
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default FiltroCategorias
