/**
 * Footer — pie de página (<footer>) con información de la tienda.
 * Componente presentacional: no recibe props ni tiene estado.
 */
function Footer() {
  const anioActual = new Date().getFullYear()

  return (
    <footer className="pie-pagina py-4 mt-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-12 col-md-5">
            <h2 className="h6 text-uppercase">GameZone</h2>
            <p className="text-body-secondary mb-0">
              Tienda online de videojuegos. Proyecto académico de Desarrollo Frontend I (PFY2201) — Duoc UC.
            </p>
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <h2 className="h6 text-uppercase">Secciones</h2>
            <ul className="list-unstyled mb-0">
              <li><a className="link-light link-underline-opacity-0" href="#inicio">Inicio</a></li>
              <li><a className="link-light link-underline-opacity-0" href="#catalogo">Catálogo</a></li>
              <li><a className="link-light link-underline-opacity-0" href="#contacto">Contacto</a></li>
            </ul>
          </div>
          <div className="col-12 col-sm-6 col-md-4">
            <h2 className="h6 text-uppercase">Contacto</h2>
            <address className="text-body-secondary mb-0">
              contacto@gamezone.cl
              <br />
              Santiago, Chile
            </address>
          </div>
        </div>
        <hr className="border-secondary" />
        <p className="text-center text-body-secondary small mb-0">
          &copy; {anioActual} GameZone · Fernando Fuentes Allende · Evaluación Final Transversal PFY2201
        </p>
      </div>
    </footer>
  )
}

export default Footer
