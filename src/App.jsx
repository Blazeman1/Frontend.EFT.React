import { useMemo, useState } from 'react'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import Hero from './components/inicio/Hero.jsx'
import Catalogo from './components/catalogo/Catalogo.jsx'
import useVideojuegos from './hooks/useVideojuegos.js'
import { CATEGORIAS } from './data/videojuegos.js'
import { normalizarTexto } from './utils/formato.js'
import { irASeccion } from './utils/dom.js'

/**
 * App — componente raíz de GameZone.
 *
 * Aquí vive el ESTADO COMPARTIDO entre secciones y desde aquí baja a cada
 * componente mediante PROPS:
 *
 *   videojuegos (useVideojuegos) -> Navbar (total), Hero (resumen), Catalogo (tarjetas)
 *   categoriaActiva, busqueda     -> Hero (atajos de categoría) y Catalogo (filtros + lista)
 *
 * Por eso un cambio en una sección se refleja en las demás: al elegir una
 * categoría en inicio o en los filtros, se actualiza la lista del catálogo.
 */
function App() {
  const { videojuegos, cargando, error, recargar } = useVideojuegos()
  const [categoriaActiva, setCategoriaActiva] = useState('Todas')
  const [busqueda, setBusqueda] = useState('')

  // Cantidad de videojuegos por categoría (para los botones de filtro).
  const categorias = useMemo(
    () =>
      CATEGORIAS.map((nombre) => ({
        nombre,
        cantidad: videojuegos.filter((juego) => juego.categoria === nombre).length,
      })),
    [videojuegos],
  )

  // Lista filtrada por categoría y por texto de búsqueda.
  const videojuegosFiltrados = useMemo(() => {
    const texto = normalizarTexto(busqueda)
    return videojuegos.filter(
      (juego) =>
        (categoriaActiva === 'Todas' || juego.categoria === categoriaActiva) &&
        normalizarTexto(juego.nombre).includes(texto),
    )
  }, [videojuegos, categoriaActiva, busqueda])

  // Datos resumidos para la sección de inicio.
  const resumen = useMemo(
    () => ({
      total: videojuegos.length,
      categorias: categorias.filter((categoria) => categoria.cantidad > 0).length,
      precioDesde: videojuegos.length ? Math.min(...videojuegos.map((juego) => juego.precio)) : 0,
    }),
    [videojuegos, categorias],
  )

  /** Desde inicio: elige una categoría y lleva al usuario al catálogo. */
  function explorarCategoria(categoria) {
    setCategoriaActiva(categoria)
    setBusqueda('')
    irASeccion('catalogo')
  }

  return (
    <>
      <Navbar seccionActiva="inicio" totalVideojuegos={videojuegos.length} cargando={cargando} />

      <main id="contenido">
        <Hero resumen={resumen} cargando={cargando} categorias={categorias} onExplorarCategoria={explorarCategoria} />

        <Catalogo
          videojuegos={videojuegos}
          videojuegosFiltrados={videojuegosFiltrados}
          categorias={categorias}
          categoriaActiva={categoriaActiva}
          onCambiarCategoria={setCategoriaActiva}
          busqueda={busqueda}
          onCambiarBusqueda={setBusqueda}
          cargando={cargando}
          error={error}
          onReintentar={recargar}
        />

        <section id="contacto" className="seccion py-5">
          <div className="container">
            <h2>Contacto</h2>
            <p className="text-body-secondary">Sección en construcción.</p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default App
