import catalogo from '../data/videojuegos.js'

/**
 * Servicio de datos de videojuegos.
 *
 * Simula una API externa: entrega el catálogo de forma ASÍNCRONA (con una
 * Promesa y una pequeña demora), igual que una petición fetch() a un servidor.
 * Así los componentes ya están preparados para trabajar con datos remotos:
 * muestran un estado de carga, manejan errores y permiten reintentar.
 *
 * Para demostrar el manejo de errores, agrega ?error a la URL del sitio
 * (por ejemplo .../Frontend.EFT.React/?error): la primera carga fallará y el
 * botón "Reintentar" la recuperará.
 */

const LATENCIA_MS = 700

/** true si la URL actual pide simular un error de carga (?error). */
export function urlPideError() {
  return new URLSearchParams(window.location.search).has('error')
}

/**
 * Obtiene la lista de videojuegos.
 * @param {{ signal?: AbortSignal, simularError?: boolean }} opciones
 * @returns {Promise<Array>} copia del arreglo de videojuegos
 */
export function obtenerVideojuegos({ signal, simularError = false } = {}) {
  return new Promise((resolve, reject) => {
    const temporizador = setTimeout(() => {
      if (simularError) {
        reject(new Error('El servidor no respondió (error simulado con ?error en la URL).'))
        return
      }
      // Se entrega una COPIA: así los cambios en el estado de React (agregar o
      // eliminar) nunca modifican el objeto original del catálogo.
      resolve(catalogo.videojuegos.map((juego) => ({ ...juego })))
    }, LATENCIA_MS)

    // Permite cancelar la petición si el componente se desmonta antes de tiempo.
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(temporizador)
        reject(new DOMException('Carga cancelada', 'AbortError'))
      },
      { once: true },
    )
  })
}
