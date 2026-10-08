import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración de Vite para GameZone (EFT - PFY2201).
//
// base: './' genera rutas RELATIVAS para los archivos del build (JS, CSS e
// imágenes). GitHub Pages publica el sitio en un subdirectorio
// (https://<usuario>.github.io/<repositorio>/), así que con rutas relativas el
// sitio funciona sin importar el nombre del repositorio.
export default defineConfig({
  plugins: [react()],
  base: './',
})
