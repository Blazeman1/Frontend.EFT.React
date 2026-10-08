import { useEffect, useState } from 'react'
import CampoFormulario from '../comunes/CampoFormulario.jsx'
import useFormulario from '../../hooks/useFormulario.js'
import { LIMITES, validarContacto } from '../../utils/validaciones.js'
import { enfocarCampo } from '../../utils/dom.js'
import { formatearPrecio } from '../../utils/formato.js'

const VALORES_INICIALES = { nombre: '', email: '', mensaje: '' }
const ORDEN_CAMPOS = ['nombre', 'email', 'mensaje']
const DEMORA_ENVIO_MS = 900

/**
 * FormularioContacto — formulario con nombre, email y mensaje.
 *
 * Valida los datos con JavaScript ANTES de enviarlos (validarContacto):
 * si falta información o está mal ingresada, muestra el error bajo cada campo,
 * un resumen arriba y lleva el foco al primer campo con problemas.
 *
 * Props:
 *   juegoConsultado  -> si el usuario pulsó "Consultar" en una tarjeta, llega
 *                       aquí desde App y se usa para precargar el mensaje
 *   onQuitarConsulta -> limpia esa consulta en App
 *
 * El envío es simulado (no hay servidor): espera un momento y muestra la
 * confirmación.
 */
function FormularioContacto({ juegoConsultado, onQuitarConsulta }) {
  const formulario = useFormulario(VALORES_INICIALES, validarContacto)
  const { valores, errores, manejarBlur, errorVisible, esCampoValido, asignarValor } = formulario
  const [estadoEnvio, setEstadoEnvio] = useState('inactivo') // 'inactivo' | 'enviando' | 'enviado'
  const [ultimoEnvio, setUltimoEnvio] = useState(null)

  // Efecto: cuando llega una consulta desde el catálogo, precarga el mensaje.
  // Depende solo de juegoConsultado: se ejecuta cada vez que se consulta otro juego.
  useEffect(() => {
    if (!juegoConsultado) return
    asignarValor(
      'mensaje',
      `Hola, quisiera saber si tienen disponible "${juegoConsultado.nombre}" (${juegoConsultado.categoria}, ${formatearPrecio(juegoConsultado.precio)}).`,
    )
    setEstadoEnvio('inactivo')
  }, [juegoConsultado])

  function manejarCambio(evento) {
    if (estadoEnvio === 'enviado') setEstadoEnvio('inactivo')
    formulario.manejarCambio(evento)
  }

  async function manejarEnvio(evento) {
    evento.preventDefault() // evita la recarga de la página

    if (!formulario.intentarEnvio()) {
      const primerError = ORDEN_CAMPOS.find((campo) => errores[campo])
      enfocarCampo(`contacto-${primerError}`)
      return
    }

    setEstadoEnvio('enviando')
    await new Promise((resolver) => setTimeout(resolver, DEMORA_ENVIO_MS))
    setUltimoEnvio({ nombre: valores.nombre.trim(), email: valores.email.trim() })
    setEstadoEnvio('enviado')
    formulario.reiniciar()
    onQuitarConsulta()
  }

  const propsCampo = (campo) => ({
    id: `contacto-${campo}`,
    nombre: campo,
    value: valores[campo],
    onChange: manejarCambio,
    onBlur: manejarBlur,
    error: errorVisible(campo),
    valido: esCampoValido(campo),
    disabled: estadoEnvio === 'enviando',
  })

  const cantidadErrores = Object.keys(errores).length
  const largoMensaje = valores.mensaje.trim().length

  return (
    <form noValidate onSubmit={manejarEnvio} aria-describedby="notaCampos" data-testid="formulario-contacto">
      {/* Mensajes condicionales: éxito, resumen de errores y consulta precargada */}
      {estadoEnvio === 'enviado' && ultimoEnvio && (
        <div className="alert alert-success d-flex justify-content-between align-items-start gap-2" role="status" data-testid="contacto-exito">
          <div>
            <strong>¡Gracias, {ultimoEnvio.nombre}!</strong> Recibimos tu mensaje y te responderemos a {ultimoEnvio.email}.
          </div>
          <button type="button" className="btn-close" aria-label="Cerrar mensaje" onClick={() => setEstadoEnvio('inactivo')}></button>
        </div>
      )}

      {formulario.intentoEnvio && cantidadErrores > 0 && (
        <div className="alert alert-danger py-2" role="alert" data-testid="contacto-errores">
          No pudimos enviar el formulario: revisa{' '}
          {cantidadErrores === 1 ? 'el campo marcado' : `los ${cantidadErrores} campos marcados`}.
        </div>
      )}

      {juegoConsultado && (
        <div className="alert alert-info py-2 d-flex justify-content-between align-items-center gap-2" data-testid="consulta-activa">
          <span>
            Consulta sobre: <strong>{juegoConsultado.nombre}</strong>
          </span>
          <button type="button" className="btn btn-sm btn-outline-info" onClick={onQuitarConsulta}>
            Quitar
          </button>
        </div>
      )}

      <p id="notaCampos" className="small text-body-secondary">
        Los campos marcados con <span className="text-danger">*</span> son obligatorios.
      </p>

      <CampoFormulario {...propsCampo('nombre')} etiqueta="Nombre" autoComplete="name" maxLength={LIMITES.nombreMax} placeholder="Tu nombre" />

      <CampoFormulario {...propsCampo('email')} etiqueta="Correo electrónico" type="email" autoComplete="email" placeholder="nombre@dominio.cl" />

      <CampoFormulario
        {...propsCampo('mensaje')}
        etiqueta="Mensaje"
        como="textarea"
        rows={5}
        placeholder="¿En qué te podemos ayudar?"
        ayuda={
          <span className={largoMensaje > LIMITES.mensajeMax ? 'text-danger' : undefined} data-testid="contador-mensaje">
            {largoMensaje}/{LIMITES.mensajeMax} caracteres (mínimo {LIMITES.mensajeMin})
          </span>
        }
      />

      <button type="submit" className="btn btn-warning w-100" disabled={estadoEnvio === 'enviando'} data-testid="enviar-contacto">
        {estadoEnvio === 'enviando' ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
            Enviando...
          </>
        ) : (
          'Enviar mensaje'
        )}
      </button>
    </form>
  )
}

export default FormularioContacto
