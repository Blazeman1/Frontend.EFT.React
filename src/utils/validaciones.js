import { CATEGORIAS } from '../data/videojuegos.js'

/**
 * Validaciones de formularios — funciones PURAS: reciben los valores y
 * devuelven un objeto { campo: 'mensaje de error' }. Si el objeto está vacío,
 * el formulario es válido. Al no depender de React se pueden reutilizar y
 * probar de forma aislada.
 */

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const REGEX_SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]+$/

export const LIMITES = {
  nombreMin: 3,
  nombreMax: 60,
  mensajeMin: 10,
  mensajeMax: 500,
  precioMin: 1000,
  precioMax: 999990,
  descripcionMin: 15,
  descripcionMax: 160,
}

/** true si el texto es una URL http(s) válida o una ruta local a una imagen. */
function esImagenValida(texto) {
  if (/^img\/[\w-]+\.(jpe?g|png|webp|gif)$/i.test(texto)) return true
  try {
    const url = new URL(texto)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Valida el formulario para agregar un videojuego al catálogo.
 * @param {object} valores   valores del formulario
 * @param {Array}  existentes videojuegos actuales (para evitar nombres repetidos)
 */
export function validarVideojuego({ nombre, categoria, precio, descripcion, imagen }, existentes = []) {
  const errores = {}

  const nombreLimpio = nombre.trim()
  if (!nombreLimpio) {
    errores.nombre = 'Ingresa el nombre del videojuego.'
  } else if (nombreLimpio.length < 2 || nombreLimpio.length > LIMITES.nombreMax) {
    errores.nombre = `El nombre debe tener entre 2 y ${LIMITES.nombreMax} caracteres.`
  } else if (existentes.some((juego) => juego.nombre.toLowerCase() === nombreLimpio.toLowerCase())) {
    errores.nombre = 'Ya existe un videojuego con ese nombre en el catálogo.'
  }

  if (!CATEGORIAS.includes(categoria)) {
    errores.categoria = 'Selecciona una categoría.'
  }

  const precioNumero = Number(precio)
  if (String(precio).trim() === '') {
    errores.precio = 'Ingresa el precio.'
  } else if (!Number.isInteger(precioNumero)) {
    errores.precio = 'El precio debe ser un número entero, sin puntos ni decimales.'
  } else if (precioNumero < LIMITES.precioMin || precioNumero > LIMITES.precioMax) {
    errores.precio = `El precio debe estar entre $${LIMITES.precioMin.toLocaleString('es-CL')} y $${LIMITES.precioMax.toLocaleString('es-CL')}.`
  }

  const descripcionLimpia = descripcion.trim()
  if (!descripcionLimpia) {
    errores.descripcion = 'Escribe una descripción breve.'
  } else if (descripcionLimpia.length < LIMITES.descripcionMin || descripcionLimpia.length > LIMITES.descripcionMax) {
    errores.descripcion = `La descripción debe tener entre ${LIMITES.descripcionMin} y ${LIMITES.descripcionMax} caracteres (llevas ${descripcionLimpia.length}).`
  }

  const imagenLimpia = imagen.trim()
  if (imagenLimpia && !esImagenValida(imagenLimpia)) {
    errores.imagen = 'Ingresa una URL que comience con http:// o https://, o deja el campo vacío.'
  }

  return errores
}
