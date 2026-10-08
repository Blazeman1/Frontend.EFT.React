import { useEffect, useState } from 'react'

/**
 * useSeccionActiva — indica qué sección de la página está visible.
 *
 * Usa IntersectionObserver, una API del navegador que avisa cuando un elemento
 * del DOM entra o sale de la pantalla. La barra de navegación usa este valor
 * para resaltar el enlace de la sección en la que está el usuario.
 *
 * @param {string[]} ids ids de las secciones a observar (arreglo constante)
 */
function useSeccionActiva(ids) {
  const [seccionActiva, setSeccionActiva] = useState(ids[0])

  useEffect(() => {
    const secciones = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!('IntersectionObserver' in window) || secciones.length === 0) return undefined

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) setSeccionActiva(entrada.target.id)
        })
      },
      // Una sección se considera activa cuando cruza la franja central de la pantalla.
      { rootMargin: '-45% 0px -50% 0px' },
    )

    secciones.forEach((seccion) => observador.observe(seccion))
    // Limpieza: deja de observar al desmontar.
    return () => observador.disconnect()
  }, [ids])

  return seccionActiva
}

export default useSeccionActiva
