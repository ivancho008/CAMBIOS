import React from "react";

import { Link } from "react-router-dom"; 

import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";

import isotipo from "../static/IMG/isotipo.png";



export default function Footer() {
  return (
    <footer className="bg-[#111827] text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Organizacion del footer principal */}
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Logo y descripción */}
          <div>
            <div className="flex items-center mb-4">
              <img
                src={isotipo}
                alt="Logo Synapse"
                className="w-12 h-12 rounded-full mr-3"
              />
              <span className="text-2xl font-bold">Synapse</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Transformando el aprendizaje a través de la tecnología consciente y el desarrollo humano integral.
            </p>
            <div className="flex space-x-4">
           <a
    href="https://www.facebook.com/tu_pagina"
    target="_blank"
    rel="noopener noreferrer"
    className="w-9 h-9 flex items-center justify-center bg-white/10 rounded-full text-gray-400 hover:bg-white hover:text-[#111827] transform hover:-translate-y-1 hover:scale-110 transition"
  >
    <FaFacebookF />
  </a>
  <a
    href="https://twitter.com/tu_usuario"
    target="_blank"
    rel="noopener noreferrer"
    className="w-9 h-9 flex items-center justify-center bg-white/10 rounded-full text-gray-400 hover:bg-white hover:text-[#111827] transform hover:-translate-y-1 hover:scale-110 transition"
  >
    <FaTwitter />
  </a>
  <a
    href="https://www.linkedin.com/in/tu_perfil"
    target="_blank"
    rel="noopener noreferrer"
    className="w-9 h-9 flex items-center justify-center bg-white/10 rounded-full text-gray-400 hover:bg-white hover:text-[#111827] transform hover:-translate-y-1 hover:scale-110 transition"
  >
    <FaLinkedinIn />
  </a>
  <a
    href="https://www.instagram.com/tu_usuario"
    target="_blank"
    rel="noopener noreferrer"
    className="w-9 h-9 flex items-center justify-center bg-white/10 rounded-full text-gray-400 hover:bg-white hover:text-[#111827] transform hover:-translate-y-1 hover:scale-110 transition"
  >
    <FaInstagram />
  </a>
</div>
          </div>



          {/* Plataforma */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Plataforma</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  to="/pomodoro" 
                  className="text-gray-400 hover:text-white hover:translate-x-1 transition"
                >
                  Pomodoro
                </Link>
              </li>
              <li>
                <Link 
                  to="/meditacion" 
                  className="text-gray-400 hover:text-white hover:translate-x-1 transition"
                >
                  Meditación
                </Link>
              </li>
              <li><Link to="/perfil" className="text-gray-400 hover:text-white hover:translate-x-1 transition">Perfil</Link></li>
            </ul>
          </div>



          {/* Recursos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Recursos</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white hover:translate-x-1 transition">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white hover:translate-x-1 transition">Guías</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white hover:translate-x-1 transition">Webinars</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white hover:translate-x-1 transition">Comunidad</a></li>
            </ul>
          </div>



          {/* Soporte */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Soporte</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white hover:translate-x-1 transition">Centro de Ayuda</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white hover:translate-x-1 transition">Contacto</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white hover:translate-x-1 transition">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white hover:translate-x-1 transition">Términos</a></li>
            </ul>
          </div>
        </div>



        {/* Parte inferior */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; 2025 Synapse. Todos los derechos reservados.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition">Privacidad</a>
            <a href="#" className="hover:text-white transition">Cookies</a>
            <a href="#" className="hover:text-white transition">Made with Readdy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
