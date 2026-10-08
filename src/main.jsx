import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Bootstrap 5 instalado con npm (npm install bootstrap). Se importa ANTES de
// los estilos propios para que app.css pueda personalizarlo.
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/app.css'

import App from './App.jsx'

// Punto de entrada: React toma el <div id="root"> de index.html y genera
// dentro de él todo el sitio a partir del componente App.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
