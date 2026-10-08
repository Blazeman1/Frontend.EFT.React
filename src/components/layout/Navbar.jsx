import { useState } from 'react'

// Enlaces de la barra de navegación: un arreglo evita repetir el mismo JSX
// tres veces y permite agregar secciones nuevas en un solo lugar.
const ENLACES = [
  { id: 'inicio', texto: 'Inicio' },
  { id: 'catalogo', texto: 'Catálogo' },
  { id: 'contacto', texto: 'Contacto' },
]

/**
 * Navbar — encabezado del sitio (<header>) con la barra de navegación de Bootstrap.
 *
 * Props:
 *   seccionActiva    -> id de la sección visible (resalta el enlace correspondiente)
 *   totalVideojuegos -> cantidad de juegos en el catálogo (insignia del enlace Catálogo)
 *   cargando         -> mientras carga el catálogo, la insignia muestra "…"
 *
 * Estado local: menuAbierto, para desplegar el menú en pantallas pequeñas sin
 * usar el JavaScript de Bootstrap (React controla la clase "show").
 */
function Navbar({ seccionActiva, totalVideojuegos, cargando }) {
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <header className="sticky-top">
      <nav className="navbar navbar-expand-md navbar-dark bg-gz shadow-sm" aria-label="Navegación principal">
        <div className="container">
          <a className="navbar-brand fw-bold d-flex align-items-center gap-2" href="#inicio" onClick={() => setMenuAbierto(false)}>
            <span className="logo-gz" aria-hidden="true">
              GZ
            </span>
            GameZone
          </a>

          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setMenuAbierto((abierto) => !abierto)}
            aria-controls="menuPrincipal"
            aria-expanded={menuAbierto}
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${menuAbierto ? 'show' : ''}`} id="menuPrincipal">
            <ul className="navbar-nav ms-auto gap-md-2">
              {ENLACES.map((enlace) => {
                const activo = seccionActiva === enlace.id
                return (
                  <li className="nav-item" key={enlace.id}>
                    <a
                      className={`nav-link ${activo ? 'active' : ''}`}
                      aria-current={activo ? 'page' : undefined}
                      href={`#${enlace.id}`}
                      onClick={() => setMenuAbierto(false)}
                    >
                      {enlace.texto}
                      {enlace.id === 'catalogo' && (
                        <span className="badge rounded-pill text-bg-warning ms-2" data-testid="contador-navbar">
                          {cargando ? '…' : totalVideojuegos}
                        </span>
                      )}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
