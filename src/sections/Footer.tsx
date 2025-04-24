import { Facebook, Instagram, Linkedin } from 'lucide-react'
import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t text-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row md:justify-between md:items-start gap-12 text-center md:text-left">

        {/* Columna 1: Logo + Descripción */}
        <div className="md:w-1/4 mx-auto md:mx-0">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 text-transparent bg-clip-text">
            AgendIA
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Herramienta digital para gestionar tus turnos de forma simple y efectiva.
          </p>
        </div>

        {/* Columna 2: Navegación */}
        <div className="md:w-1/4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700 mb-3">Navegación</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#hero" className="hover:text-blue-600">Inicio</a></li>
            <li><a href="#solutions" className="hover:text-blue-600">Soluciones</a></li>
            <li><a href="#pricing" className="hover:text-blue-600">Precios</a></li>
            <li><a href="#faq" className="hover:text-blue-600">Preguntas frecuentes</a></li>
          </ul>
        </div>

        {/* Columna 3: Contacto */}
        <div className="md:w-1/4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700 mb-3">Contacto</h3>
          <ul className="space-y-2 text-sm">
            <li>Email: <a href="mailto:juanbautistaliendo1@gmail.com" className="hover:text-blue-600">juanbautista.................</a></li>
            <li>Tel: <a href="tel:+549.........." className="hover:text-blue-600">+54 9 ... ... ....</a></li>
          </ul>
        </div>

        {/* Columna 4: Redes sociales */}
        <div className="md:w-1/4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700 mb-3">Seguinos</h3>
          <div className="flex justify-center md:justify-start gap-4 text-blue-600">
            <a href="#" aria-label="Instagram" className="hover:text-blue-800">
              <Instagram size={20} />
            </a>
            <a href="#" aria-label="Facebook" className="hover:text-blue-800">
              <Facebook size={20} />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-blue-800">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t text-center text-sm text-gray-500 py-6">
        © {new Date().getFullYear()} AgendIA. Todos los derechos reservados.
      </div>
    </footer>
  )
}
