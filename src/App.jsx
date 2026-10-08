import { useMemo, useState } from 'react'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import Hero from './components/inicio/Hero.jsx'
import Catalogo from './components/catalogo/Catalogo.jsx'
import Contacto from './components/contacto/Contacto.jsx'
import useVideojuegos from './hooks/useVideojuegos.js'
import useSeccionActiva from './hooks/useSeccionActiva.js'
import { CATEGORIAS } from './data/videojuegos.js'
import { normalizarTexto } from './utils/formato.js'
import { irASeccion } from './utils/dom.js'

// ids de las secciones de la página (constante fuera del componente para que
// useSeccionActiva reciba siempre el mismo arreglo).
const SECCIONES = ['inicio', 'catalogo', 'contacto']

/**
 * App — componente raíz de GameZone.
 *
 * Aquí vive el ESTADO COMPARTIDO entre secciones y desde aquí baja a cada
 * componente mediante PROPS:
 *
 *   videojuegos (useVideojuegos) -> Navbar (total), Hero (resumen), Catalogo (tarjetas)
 *   categoriaActiva, busqueda     -> Hero (atajos de categoría) y Catalogo (filtros + lista)
 *   juegoConsultado               -> Catalogo lo define con "Consultar" y Contacto lo usa
 *                                    para precargar el mensaje del formulario
 *
 * Por eso un cambio en una sección se refleja en las demás: al filtrar se
 * actualiza la lista; al agregar o eliminar un juego cambian el contador de la
 * barra de navegación, el resumen de inicio y los filtros.
 */
function App() {
  const { videojuegos, cargando, error, recargar, agregar, eliminar } = useVideojuegos()
  const [categoriaActiva, setCategoriaActiva] = useState('Todas')
  const [busqueda, setBusqueda] = useState('')
  const [juegoConsultado, setJuegoConsultado] = useState(null)
  const seccionActiva = useSeccionActiva(SECCIONES)

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

  /** Agrega un juego y limpia los filtros para que el nuevo quede visible. */
  function manejarAgregar(datos) {
    agregar(datos)
    setCategoriaActiva('Todas')
    setBusqueda('')
  }

  /** Restaura el catálogo original y limpia los filtros. */
  function manejarRestablecer() {
    recargar()
    setCategoriaActiva('Todas')
    setBusqueda('')
  }

  /** "Consultar" en una tarjeta: guarda el juego y lleva al formulario de contacto. */
  function manejarConsultar(juego) {
    setJuegoConsultado(juego)
    irASeccion('contacto')
  }

  return (
    <>
      <a className="visually-hidden-focusable saltar-contenido" href="#contenido">
        Saltar al contenido principal
      </a>

      <Navbar seccionActiva={seccionActiva} totalVideojuegos={videojuegos.length} cargando={cargando} />

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
          onAgregar={manejarAgregar}
          onEliminar={eliminar}
          onRestablecer={manejarRestablecer}
          onConsultar={manejarConsultar}
        />

        <Contacto juegoConsultado={juegoConsultado} onQuitarConsulta={() => setJuegoConsultado(null)} />
      </main>

      <Footer />
    </>
  )
}

export default App
