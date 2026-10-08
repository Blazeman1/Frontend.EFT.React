/**
 * Catálogo de GameZone — OBJETO JavaScript con la información de la tienda.
 *
 * Es la "fuente de datos" del sitio: el servicio src/services/videojuegosService.js
 * lo entrega de forma asíncrona (como lo haría una API) y React genera las
 * tarjetas a partir de él. Ningún videojuego está escrito a mano en el HTML.
 *
 * Cada videojuego tiene: id, nombre, categoria, precio (CLP), descripcion e imagen.
 * Las rutas de imagen son relativas (img/...) para que funcionen en GitHub Pages.
 */

/** Categorías disponibles, en el orden en que se muestran en los filtros. */
export const CATEGORIAS = ['Acción', 'Aventura', 'RPG', 'Deportes', 'Carreras', 'Estrategia']

/** Imagen que se usa cuando un videojuego no trae imagen o la URL no carga. */
export const IMAGEN_POR_DEFECTO = 'img/sin-imagen.jpg'

const catalogo = {
  tienda: 'GameZone',
  moneda: 'CLP',
  videojuegos: [
    {
      id: 1,
      nombre: 'Reinos Olvidados',
      categoria: 'RPG',
      precio: 27990,
      descripcion: 'Explora un vasto mundo abierto lleno de reinos en ruinas y criaturas legendarias.',
      imagen: 'img/reinos-olvidados.jpg',
    },
    {
      id: 2,
      nombre: 'Sombra Silenciosa',
      categoria: 'Acción',
      precio: 29990,
      descripcion: 'Thriller de infiltración donde cada sonido cuenta para completar la misión sin ser detectado.',
      imagen: 'img/sombra-silenciosa.jpg',
    },
    {
      id: 3,
      nombre: 'Velocidad Extrema',
      categoria: 'Carreras',
      precio: 22990,
      descripcion: 'Circuitos urbanos y autos personalizables para carreras multijugador a toda velocidad.',
      imagen: 'img/velocidad-extrema.jpg',
    },
    {
      id: 4,
      nombre: 'Galaxia Infinita',
      categoria: 'Estrategia',
      precio: 32990,
      descripcion: 'Construye tu flota y coloniza planetas en este épico título de estrategia espacial.',
      imagen: 'img/galaxia-infinita.jpg',
    },
    {
      id: 5,
      nombre: 'Leyenda del Bosque',
      categoria: 'Aventura',
      precio: 24990,
      descripcion: 'Resuelve acertijos y descubre los secretos de un bosque encantado junto a tu fiel compañero.',
      imagen: 'img/leyenda-del-bosque.jpg',
    },
    {
      id: 6,
      nombre: 'Liga Estelar 26',
      categoria: 'Deportes',
      precio: 39990,
      descripcion: 'El fútbol más realista: licencias oficiales, modo carrera y partidos en línea.',
      imagen: 'img/liga-estelar-26.jpg',
    },
    {
      id: 7,
      nombre: 'Asalto Final',
      categoria: 'Acción',
      precio: 34990,
      descripcion: 'Shooter táctico por equipos con mapas destructibles y partidas clasificatorias.',
      imagen: 'img/asalto-final.jpg',
    },
    {
      id: 8,
      nombre: 'Turbo Rally Andes',
      categoria: 'Carreras',
      precio: 19990,
      descripcion: 'Rally por caminos de montaña, nieve y ripio en la cordillera de los Andes.',
      imagen: 'img/turbo-rally-andes.jpg',
    },
    {
      id: 9,
      nombre: 'Crónicas de Atacama',
      categoria: 'Aventura',
      precio: 28990,
      descripcion: 'Aventura narrativa en el desierto más árido del mundo, entre observatorios y ruinas.',
      imagen: 'img/cronicas-de-atacama.jpg',
    },
    {
      id: 10,
      nombre: 'Imperio de Acero',
      categoria: 'Estrategia',
      precio: 25990,
      descripcion: 'Gestiona recursos, investiga tecnologías y dirige ejércitos en tiempo real.',
      imagen: 'img/imperio-de-acero.jpg',
    },
    {
      id: 11,
      nombre: 'Cancha Total',
      categoria: 'Deportes',
      precio: 21990,
      descripcion: 'Básquetbol callejero 3 contra 3 con torneos locales y personajes personalizables.',
      imagen: 'img/cancha-total.jpg',
    },
    {
      id: 12,
      nombre: 'Ecos del Abismo',
      categoria: 'RPG',
      precio: 36990,
      descripcion: 'RPG oscuro por turnos con decisiones que cambian el destino de tu grupo.',
      imagen: 'img/ecos-del-abismo.jpg',
    },
  ],
}

export default catalogo
