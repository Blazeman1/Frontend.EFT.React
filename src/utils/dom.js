/**
 * Utilidades de manipulación directa del DOM.
 *
 * React genera y actualiza el DOM a partir del estado, pero algunas acciones
 * requieren usar la API del navegador directamente: mover el foco, desplazar
 * la página hasta una sección o reemplazar una imagen que no cargó.
 */

/** Desplaza la página suavemente hasta el elemento con ese id. */
export function irASeccion(id) {
  const seccion = document.getElementById(id)
  if (seccion) {
    seccion.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

/**
 * Pone el foco en el campo con ese id (por ejemplo, el primer campo con
 * error de un formulario) y lo centra en pantalla.
 */
export function enfocarCampo(id) {
  const campo = document.getElementById(id)
  if (campo) {
    campo.focus({ preventScroll: true })
    campo.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

/**
 * Manejador onError para <img>: si la imagen no carga, la reemplaza por la
 * imagen por defecto. El atributo data-reemplazada evita un ciclo infinito
 * si la imagen de reemplazo también fallara.
 */
export function usarImagenPorDefecto(evento, imagenPorDefecto) {
  const imagen = evento.currentTarget
  if (imagen.dataset.reemplazada === 'true') return
  imagen.dataset.reemplazada = 'true'
  imagen.src = imagenPorDefecto
}
