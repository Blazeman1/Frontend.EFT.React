import { useCallback, useEffect, useState } from 'react'
import { obtenerVideojuegos, urlPideError } from '../services/videojuegosService.js'

/**
 * useVideojuegos — hook personalizado que maneja la LISTA de videojuegos.
 *
 * - useState guarda la lista, el estado de carga y el posible error.
 * - useEffect pide los datos al servicio al montar el componente (y cada vez
 *   que se pide recargar), y cancela la petición si se desmonta antes.
 */
function useVideojuegos() {
  const [videojuegos, setVideojuegos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  // Cambiar "intento" vuelve a ejecutar el efecto (botones Reintentar / Restablecer).
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    const controlador = new AbortController()
    setCargando(true)
    setError(null)

    obtenerVideojuegos({
      signal: controlador.signal,
      // El error simulado (?error en la URL) solo afecta la primera carga,
      // así "Reintentar" demuestra la recuperación.
      simularError: intento === 0 && urlPideError(),
    })
      .then((datos) => setVideojuegos(datos))
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message)
      })
      .finally(() => {
        if (!controlador.signal.aborted) setCargando(false)
      })

    // Función de limpieza: cancela la carga pendiente.
    return () => controlador.abort()
  }, [intento])

  /** Vuelve a cargar el catálogo original (deshace agregados y eliminados). */
  const recargar = useCallback(() => setIntento((n) => n + 1), [])

  return { videojuegos, cargando, error, recargar }
}

export default useVideojuegos
