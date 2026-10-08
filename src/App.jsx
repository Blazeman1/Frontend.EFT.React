import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import Hero from './components/inicio/Hero.jsx'
import catalogo, { CATEGORIAS } from './data/videojuegos.js'
import { irASeccion } from './utils/dom.js'

/**
 * App — componente raíz de GameZone.
 *
 * Estructura semántica del sitio: <header> (Navbar), <main> con una <section>
 * por cada parte del sitio, y <footer>. Por ahora el resumen de inicio se
 * calcula directamente desde el objeto del catálogo.
 */
function App() {
  const videojuegos = catalogo.videojuegos
  const categorias = CATEGORIAS.map((nombre) => ({
    nombre,
    cantidad: videojuegos.filter((juego) => juego.categoria === nombre).length,
  }))
  const resumen = {
    total: videojuegos.length,
    categorias: categorias.filter((categoria) => categoria.cantidad > 0).length,
    precioDesde: Math.min(...videojuegos.map((juego) => juego.precio)),
  }

  return (
    <>
      <Navbar seccionActiva="inicio" totalVideojuegos={videojuegos.length} cargando={false} />

      <main id="contenido">
        <Hero resumen={resumen} cargando={false} categorias={categorias} onExplorarCategoria={() => irASeccion('catalogo')} />

        <section id="catalogo" className="seccion py-5">
          <div className="container">
            <h2>Catálogo de videojuegos</h2>
            <p className="text-body-secondary">Sección en construcción.</p>
          </div>
        </section>

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
