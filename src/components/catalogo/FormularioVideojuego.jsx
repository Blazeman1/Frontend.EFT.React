import { useCallback } from 'react'
import CampoFormulario from '../comunes/CampoFormulario.jsx'
import TarjetaVideojuego from './TarjetaVideojuego.jsx'
import useFormulario from '../../hooks/useFormulario.js'
import { CATEGORIAS, IMAGEN_POR_DEFECTO } from '../../data/videojuegos.js'
import { LIMITES, validarVideojuego } from '../../utils/validaciones.js'
import { enfocarCampo } from '../../utils/dom.js'

const VALORES_INICIALES = { nombre: '', categoria: '', precio: '', descripcion: '', imagen: '' }
const ORDEN_CAMPOS = ['nombre', 'categoria', 'precio', 'descripcion', 'imagen']

/**
 * FormularioVideojuego — agrega un videojuego nuevo al catálogo (modo administrador).
 *
 * Props:
 *   existentes -> lista actual (para no repetir nombres)
 *   onAgregar  -> función de App que agrega el juego al ESTADO de la lista
 *   onCerrar   -> oculta el formulario
 *
 * Muestra una VISTA PREVIA reutilizando el mismo componente TarjetaVideojuego
 * que usa el catálogo, actualizada en tiempo real mientras se escribe.
 */
function FormularioVideojuego({ existentes, onAgregar, onCerrar }) {
  // La validación depende de la lista actual (nombres repetidos), por eso se
  // memoriza con useCallback y cambia solo cuando cambia la lista.
  const validar = useCallback((valores) => validarVideojuego(valores, existentes), [existentes])
  const formulario = useFormulario(VALORES_INICIALES, validar)
  const { valores, errores, manejarCambio, manejarBlur, errorVisible, esCampoValido } = formulario

  function manejarEnvio(evento) {
    evento.preventDefault() // evita que el navegador recargue la página

    if (!formulario.intentarEnvio()) {
      // Lleva el foco al primer campo con error.
      const primerError = ORDEN_CAMPOS.find((campo) => errores[campo])
      enfocarCampo(`juego-${primerError}`)
      return
    }

    onAgregar({
      nombre: valores.nombre.trim(),
      categoria: valores.categoria,
      precio: Number(valores.precio),
      descripcion: valores.descripcion.trim(),
      imagen: valores.imagen.trim() || IMAGEN_POR_DEFECTO,
    })
    formulario.reiniciar()
  }

  // Props comunes de cada campo controlado.
  const propsCampo = (campo) => ({
    id: `juego-${campo}`,
    nombre: campo,
    value: valores[campo],
    onChange: manejarCambio,
    onBlur: manejarBlur,
    error: errorVisible(campo),
    valido: esCampoValido(campo),
  })

  const cantidadErrores = Object.keys(errores).length

  return (
    <section className="card panel-admin mb-4" aria-labelledby="tituloAgregar" data-testid="formulario-juego">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h3 id="tituloAgregar" className="h5 mb-0">
          Agregar videojuego
        </h3>
        <button type="button" className="btn-close" aria-label="Cerrar formulario" onClick={onCerrar}></button>
      </div>
      <div className="card-body">
        <div className="row g-4">
          <div className="col-12 col-lg-7">
            {/* noValidate: la validación la hace JavaScript para mostrar mensajes propios */}
            <form noValidate onSubmit={manejarEnvio}>
              {formulario.intentoEnvio && cantidadErrores > 0 && (
                <div className="alert alert-danger py-2" role="alert">
                  Revisa {cantidadErrores === 1 ? 'el campo marcado' : `los ${cantidadErrores} campos marcados`}.
                </div>
              )}

              <CampoFormulario {...propsCampo('nombre')} etiqueta="Nombre" maxLength={LIMITES.nombreMax} autoComplete="off" />

              <div className="row g-3">
                <div className="col-sm-6">
                  <CampoFormulario {...propsCampo('categoria')} etiqueta="Categoría" como="select" opciones={CATEGORIAS} />
                </div>
                <div className="col-sm-6">
                  <CampoFormulario
                    {...propsCampo('precio')}
                    etiqueta="Precio (CLP)"
                    type="number"
                    inputMode="numeric"
                    min={LIMITES.precioMin}
                    max={LIMITES.precioMax}
                    placeholder="Ej: 29990"
                  />
                </div>
              </div>

              <CampoFormulario
                {...propsCampo('descripcion')}
                etiqueta="Descripción"
                como="textarea"
                rows={2}
                maxLength={LIMITES.descripcionMax}
                ayuda={`${valores.descripcion.trim().length}/${LIMITES.descripcionMax} caracteres`}
              />

              <CampoFormulario
                {...propsCampo('imagen')}
                etiqueta="URL de la imagen"
                type="url"
                requerido={false}
                placeholder="https://..."
                ayuda="Si la dejas vacía o la imagen no carga, se usa una imagen por defecto."
              />

              <div className="d-flex flex-wrap gap-2">
                <button type="submit" className="btn btn-success" data-testid="guardar-juego">
                  Agregar al catálogo
                </button>
                <button type="button" className="btn btn-outline-light" onClick={formulario.reiniciar}>
                  Limpiar
                </button>
              </div>
            </form>
          </div>

          <div className="col-12 col-lg-5">
            <p className="small text-body-secondary mb-2">Vista previa</p>
            <TarjetaVideojuego
              vistaPrevia
              juego={{
                nombre: valores.nombre.trim(),
                categoria: valores.categoria,
                precio: Number(valores.precio) || 0,
                descripcion: valores.descripcion.trim(),
                imagen: valores.imagen.trim(),
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default FormularioVideojuego
