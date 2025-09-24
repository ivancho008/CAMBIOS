// src/componentes/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Target, CheckCircle, User, Users, Menu, X } from "lucide-react";
import isotipo from "../static/IMG/isotipo.png";

export default function Navbar({ user, onAuthClick, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { path: "/", label: "Home", icon: <Home size={18} />, requiresAuth: false },
    { path: "/pomodoro", label: "Pomodoro", icon: <Target size={18} />, requiresAuth: true },
    { path: "/meditacion", label: "Meditación", icon: <CheckCircle size={18} />, requiresAuth: true },
    { path: "/sesiones", label: "Sesiones", icon: <Users size={18} />, requiresAuth: true },
    { path: "/perfil", label: "Perfil", icon: <User size={18} />, requiresAuth: true },
  ];

  const handleNavClick = (item) => {
    if (item.requiresAuth && !user) {
      onAuthClick("login"); // abre modal
    } else {
      navigate(item.path); // navega normalmente
    }
    setIsMenuOpen(false); // cerrar menú móvil si estaba abierto
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* LOGO */}
          <div onClick={() => handleNavClick(navItems[0])} className="flex items-center space-x-2 cursor-pointer">
            <img src={isotipo} alt="Logo" className="h-10 w-10 rounded-full object-contain" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-600 bg-clip-text text-transparent">
              Synapse
            </span>
          </div>

          {/* MENU DESKTOP */}
          <div className="hidden md:flex space-x-6">
            {navItems.slice(1).map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item)}
                className="flex items-center gap-1 text-gray-700 hover:text-purple-600 transition-colors"
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          {/* BOTONES DERECHA (desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <>
                <button
                  onClick={() => onAuthClick("login")}
                  className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => onAuthClick("register")}
                  className="px-4 py-2 rounded-md bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition"
                >
                  Registrarse
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleNavClick({ path: "/perfil", requiresAuth: true })}
                  className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
                >
                  <User size={18} /> Mi Cuenta
                </button>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 rounded-md bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 transition"
                >
                  Salir
                </button>
              </div>
            )}
          </div>

          {/* BOTÓN HAMBURGUESA (móvil) */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MENU MÓVIL */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-6 space-y-4">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavClick(item)}
              className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition w-full text-left"
            >
              {item.icon} {item.label}
            </button>
          ))}

          <div className="pt-4 border-t border-gray-200 space-y-3">
            {!user ? (
              <>
                <button
                  onClick={() => { setIsMenuOpen(false); onAuthClick("login"); }}
                  className="w-full px-4 py-2 rounded-md text-gray-700 border border-gray-300 hover:bg-gray-100 transition"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => { setIsMenuOpen(false); onAuthClick("register"); }}
                  className="w-full px-4 py-2 rounded-md bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition"
                >
                  Registrarse
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavClick({ path: "/perfil", requiresAuth: true })}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition w-full text-left"
                >
                  <User size={18} /> Mi Cuenta
                </button>
                <button
                  onClick={() => { setIsMenuOpen(false); onLogout(); }}
                  className="w-full px-4 py-2 rounded-md bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 transition"
                >
                  Salir
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
