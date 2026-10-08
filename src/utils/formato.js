/**
 * Utilidades de formato — funciones puras reutilizadas por varios componentes.
 */

const formateadorCLP = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
})

/** Formatea un número como pesos chilenos. Ej: 27990 -> "$27.990". */
export function formatearPrecio(valor) {
  return formateadorCLP.format(valor)
}

/** Devuelve "1 videojuego" o "N videojuegos" según la cantidad. */
export function pluralizar(cantidad, singular, plural = `${singular}s`) {
  return `${cantidad} ${cantidad === 1 ? singular : plural}`
}

/**
 * Normaliza un texto para comparar búsquedas: minúsculas y sin tildes.
 * Así buscar "accion" encuentra "Acción" y "cronicas" encuentra "Crónicas".
 */
export function normalizarTexto(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}
