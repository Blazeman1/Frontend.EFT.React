import { useMemo, useState } from 'react'

/**
 * useFormulario — hook REUTILIZABLE para formularios controlados.
 *
 * Lo usan tanto el formulario de contacto como el de agregar videojuegos:
 * cada uno entrega sus valores iniciales y su función de validación, y el hook
 * se encarga del resto (valores, campos tocados, errores visibles, reinicio).
 *
 * Los errores se muestran cuando el usuario sale de un campo (onBlur) o cuando
 * intenta enviar el formulario, no mientras escribe por primera vez.
 */
function useFormulario(valoresIniciales, validar) {
  const [valores, setValores] = useState(valoresIniciales)
  const [tocados, setTocados] = useState({})
  const [intentoEnvio, setIntentoEnvio] = useState(false)

  // Los errores se DERIVAN de los valores: no necesitan su propio useState.
  const errores = useMemo(() => validar(valores), [valores, validar])
  const esValido = Object.keys(errores).length === 0

  /** onChange genérico: usa el atributo name del campo para saber qué actualizar. */
  function manejarCambio(evento) {
    const { name, value } = evento.target
    setValores((actuales) => ({ ...actuales, [name]: value }))
  }

  /** onBlur: marca el campo como "tocado" para empezar a mostrar su error. */
  function manejarBlur(evento) {
    const { name } = evento.target
    setTocados((actuales) => ({ ...actuales, [name]: true }))
  }

  /** Cambia un valor desde código (por ejemplo, para precargar un mensaje). */
  function asignarValor(campo, valor) {
    setValores((actuales) => ({ ...actuales, [campo]: valor }))
  }

  /** Error que corresponde MOSTRAR para un campo (o undefined). */
  function errorVisible(campo) {
    return tocados[campo] || intentoEnvio ? errores[campo] : undefined
  }

  /** true si el campo ya se revisó y no tiene errores (para el estilo "válido"). */
  function esCampoValido(campo) {
    return (tocados[campo] || intentoEnvio) && !errores[campo]
  }

  /** Registra el intento de envío y devuelve si el formulario es válido. */
  function intentarEnvio() {
    setIntentoEnvio(true)
    return esValido
  }

  /** Limpia el formulario (después de un envío exitoso). */
  function reiniciar() {
    setValores(valoresIniciales)
    setTocados({})
    setIntentoEnvio(false)
  }

  return {
    valores,
    errores,
    esValido,
    intentoEnvio,
    manejarCambio,
    manejarBlur,
    asignarValor,
    errorVisible,
    esCampoValido,
    intentarEnvio,
    reiniciar,
  }
}

export default useFormulario
