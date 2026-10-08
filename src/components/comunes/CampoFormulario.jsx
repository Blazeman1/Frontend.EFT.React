/**
 * CampoFormulario — campo de formulario REUTILIZABLE (input, textarea o select).
 *
 * Lo usan el formulario de contacto y el de agregar videojuegos. Centraliza el
 * marcado de Bootstrap (form-label, form-control/form-select, is-invalid,
 * invalid-feedback) y los atributos de accesibilidad (aria-invalid,
 * aria-describedby), para no repetir ese bloque en cada campo.
 *
 * Props principales:
 *   id, nombre, etiqueta     -> identificación del campo
 *   como                     -> 'input' (por defecto), 'textarea' o 'select'
 *   error                    -> mensaje de error a mostrar (o undefined)
 *   valido                   -> true para mostrar el estilo de campo correcto
 *   ayuda                    -> texto de ayuda bajo el campo
 *   opciones                 -> arreglo de strings (solo para select)
 *   ...resto                 -> cualquier otro atributo (type, value, onChange, etc.)
 */
function CampoFormulario({ id, nombre, etiqueta, como = 'input', error, valido, ayuda, opciones = [], requerido = true, ...resto }) {
  const claseBase = como === 'select' ? 'form-select' : 'form-control'
  const claseEstado = error ? 'is-invalid' : valido ? 'is-valid' : ''
  const idAyuda = ayuda ? `${id}-ayuda` : null
  const idError = error ? `${id}-error` : null
  const describedBy = [idAyuda, idError].filter(Boolean).join(' ') || undefined

  const atributos = {
    id,
    name: nombre,
    className: `${claseBase} ${claseEstado}`.trim(),
    'aria-invalid': Boolean(error),
    'aria-describedby': describedBy,
    'aria-required': requerido,
    ...resto,
  }

  let control
  if (como === 'textarea') {
    control = <textarea {...atributos} />
  } else if (como === 'select') {
    control = (
      <select {...atributos}>
        <option value="">Selecciona una opción</option>
        {opciones.map((opcion) => (
          <option key={opcion} value={opcion}>
            {opcion}
          </option>
        ))}
      </select>
    )
  } else {
    control = <input {...atributos} />
  }

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {etiqueta}
        {requerido ? (
          <span className="text-danger" aria-hidden="true">
            {' '}*
          </span>
        ) : (
          <span className="text-body-secondary small"> (opcional)</span>
        )}
      </label>
      {control}
      {/* Renderizado condicional: el mensaje de error solo existe si hay error */}
      {error && (
        <div className="invalid-feedback" id={idError}>
          {error}
        </div>
      )}
      {ayuda && (
        <div className="form-text" id={idAyuda}>
          {ayuda}
        </div>
      )}
    </div>
  )
}

export default CampoFormulario
