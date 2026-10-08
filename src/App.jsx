import { useMemo } from 'react'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import Hero from './components/inicio/Hero.jsx'
import Catalogo from './components/catalogo/Catalogo.jsx'
import useVideojuegos from './hooks/useVideojuegos.js'
import { CATEGORIAS } from './data/videojuegos.js'
import { irASeccion } from './utils/dom.js'

/**
 * App — componente raíz de GameZone.
 *
 * La lista de videojuegos (estado del hook useVideojuegos) baja por props a
 * Navbar, Hero y Catalogo, que genera una tarjeta por cada juego.
 */
function App() {
  const { videojuegos, cargando, error, recargar } = useVideojuegos()

  const categorias = useMemo(
    () =>
      CATEGORIAS.map((nombre) => ({
        nombre,
        cantidad: videojuegos.filter((juego) => juego.categoria === nombre).length,
      })),
    [videojuegos],
  )

  const resumen = useMemo(
    () => ({
      total: videojuegos.length,
      categorias: categorias.filter((categoria) => categoria.cantidad > 0).length,
      precioDesde: videojuegos.length ? Math.min(...videojuegos.map((juego) => juego.precio)) : 0,
    }),
    [videojuegos, categorias],
  )

  return (
    <>
      <Navbar seccionActiva="inicio" totalVideojuegos={videojuegos.length} cargando={cargando} />

      <main id="contenido">
        <Hero resumen={resumen} cargando={cargando} categorias={categorias} onExplorarCategoria={() => irASeccion('catalogo')} />

        <Catalogo videojuegos={videojuegos} cargando={cargando} error={error} onReintentar={recargar} />

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
