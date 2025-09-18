import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  User,
  Home,
  Target,
  Users,
  Gift,
  CheckCircle,
} from 'lucide-react';

export default function Navbar({ user, onAuthClick, onLogout }) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Inicio', icon: <Home size={20} />, requiresAuth: false },
    { path: '/concentracion', label: 'Concentración', icon: <Target size={20} />, requiresAuth: true },
    { path: '/tareas', label: 'Tareas', icon: <CheckCircle size={20} />, requiresAuth: true },
    { path: '/sesion-grupal', label: 'Sesión Grupal', icon: <Users size={20} />, requiresAuth: true },
    { path: '/recompensas', label: 'Recompensas', icon: <Gift size={20} />, requiresAuth: true },
    { path: '/perfil', label: 'Perfil', icon: <User size={20} />, requiresAuth: true },
  ];

  return (
    <nav className="bg-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo / título */}
          <Link to="/" className="text-2xl font-bold hover:text-purple-200">
            Synapse
          </Link>

          {/* Links de navegación */}
          <div className="flex space-x-6">
            {navItems.map((item) => {
              if (item.requiresAuth && !user) return null;

              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 transition-colors ${
                    isActive
                      ? 'text-purple-200 font-semibold'
                      : 'hover:text-purple-200'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}

            {/* Botones de login/logout */}
            {!user ? (
              <button
                onClick={onAuthClick}
                className="hover:text-purple-200 transition-colors"
              >
                Iniciar Sesión
              </button>
            ) : (
              <button
                onClick={onLogout}
                className="hover:text-purple-200 transition-colors"
              >
                Salir
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
