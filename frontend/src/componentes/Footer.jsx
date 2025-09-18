import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Marca y frase */}
          <div>
            <h3 className="text-xl font-bold mb-4">Synapse</h3>
            <p className="text-gray-300 italic">
              "El éxito no es el final, el fracaso no es fatal: es el coraje de continuar lo que cuenta."
            </p>
          </div>

          {/* Políticas */}
          <div>
            <h4 className="font-semibold mb-4">Políticas</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Términos de Servicio
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Cookies
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-gray-300">
              <li>📧 support@synapse.com</li>
              <li>📞 +1 (555) 123-4567</li>
            </ul>
          </div>
        </div>

        {/* Línea inferior */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 Synapse. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
