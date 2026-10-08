import FormularioContacto from './FormularioContacto.jsx'

// Datos de la tienda en un arreglo: el JSX los recorre en vez de repetir marcado.
const DATOS_CONTACTO = [
  { titulo: 'Correo', detalle: 'contacto@gamezone.cl' },
  { titulo: 'Teléfono', detalle: '+56 2 2345 6789' },
  { titulo: 'Horario de atención', detalle: 'Lunes a viernes, 9:00 a 18:00' },
  { titulo: 'Tiempo de respuesta', detalle: 'Menos de 24 horas hábiles' },
]

/**
 * Contacto — sección de contacto (<section id="contacto">).
 *
 * Recibe juegoConsultado desde App y lo pasa a FormularioContacto: así el
 * botón "Consultar" de una tarjeta del catálogo (otra sección) llena el
 * mensaje automáticamente. El <aside> usa Flexbox para listar los datos.
 */
function Contacto({ juegoConsultado, onQuitarConsulta }) {
  return (
    <section id="contacto" className="seccion py-5" aria-labelledby="tituloContacto">
      <div className="container">
        <h2 id="tituloContacto">Contacto</h2>
        <p className="text-body-secondary mb-4">
          ¿Tienes dudas sobre un videojuego, un pedido o disponibilidad? Escríbenos.
        </p>

        <div className="row g-4">
          <div className="col-12 col-lg-7">
            <div className="card h-100">
              <div className="card-body p-4">
                <FormularioContacto juegoConsultado={juegoConsultado} onQuitarConsulta={onQuitarConsulta} />
              </div>
            </div>
          </div>

          <aside className="col-12 col-lg-5" aria-label="Información de contacto">
            <div className="card h-100">
              <div className="card-body p-4">
                <h3 className="h5">Información de la tienda</h3>
                <ul className="lista-contacto list-unstyled mb-0">
                  {DATOS_CONTACTO.map((dato) => (
                    <li key={dato.titulo}>
                      <span className="text-body-secondary small">{dato.titulo}</span>
                      <span>{dato.detalle}</span>
                    </li>
                  ))}
                </ul>
                <address className="mt-4 mb-0 text-body-secondary">
                  GameZone
                  <br />
                  Av. Providencia 1234, Santiago, Chile
                </address>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

export default Contacto
