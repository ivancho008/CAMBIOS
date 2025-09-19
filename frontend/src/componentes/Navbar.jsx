import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, Target, CheckCircle, User, Star, Users } from "lucide-react";
import isotipo from "../static/IMG/isotipo.png";

export default function Navbar({ user, onAuthClick, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={20} /> },
    { path: '/pomodoro', label: 'Pomodoro', icon: <Target size={20} /> },
    { path: '/meditacion', label: 'Meditación', icon: <CheckCircle size={20} /> },
    { path: '/sesiones', label: 'Sesiones Grupales', icon: <Users size={20} /> },
    { path: '/perfil', label: 'Perfil', icon: <User size={20} /> },
  ];

  // Cierra el menú cuando la pantalla cambia a escritorio
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <nav className="modern-navbar">
        <div className="nav-container">

          {/* IZQUIERDA: Logo */}
          <Link to="/" className="nav-logo">
            <img src={isotipo} alt="Logo" className="logo-img" />
            <span className="logo-text">Synapse</span>
          </Link>

          {/* CENTRO: Menú */}
          <div className="nav-center">
            <ul className="nav-menu">
              {navItems.slice(1).map(item => (
                <li key={item.path}>
                  <Link to={item.path}>{item.icon} {item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* DERECHA: Botones */}
          <div className="auth-buttons-desktop">
            {!user ? (
              <>
                <button onClick={() => onAuthClick('login')} className="btn-login">Iniciar Sesión</button>
                <button onClick={() => onAuthClick('register')} className="btn-register">Registrarse</button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/perfil" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
                  <User size={20} />
                  <span>Mi Cuenta</span>
                </Link>
                <button onClick={onLogout} className="btn-register">Salir</button>
              </div>
            )}
          </div>

          {/* Botón hamburguesa móvil */}
          <button
            className={`menu-toggle ${isMenuOpen ? "active" : ""}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* Menú móvil */}
      <div className={`nav-mobile-menu ${isMenuOpen ? "active" : ""}`}>
        <ul className="nav-mobile-list">
          {navItems.map(item => (
            <li key={item.path}>
              <Link to={item.path} onClick={() => setIsMenuOpen(false)}>
                {item.icon} {item.label}
              </Link>
            </li>
          ))}

          {!user ? (
            <div className="flex flex-col gap-3 mt-6 w-full">
              <button onClick={() => { setIsMenuOpen(false); onAuthClick('login'); }} className="btn-login w-full">
                Iniciar Sesión
              </button>
              <button onClick={() => { setIsMenuOpen(false); onAuthClick('register'); }} className="btn-register w-full">
                Registrarse
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 mt-6 w-full">
              <Link to="/perfil" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
                <User size={20} />
                <span>Mi Cuenta</span>
              </Link>
              <button onClick={() => { setIsMenuOpen(false); onLogout(); }} className="btn-register w-full">
                Salir
              </button>
            </div>
          )}
        </ul>
      </div>

      {/* ====================== CSS ====================== */}
      <style>{`
        .modern-navbar {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0,0,0,0.1);
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          transition: all 0.3s ease;
        }
        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: #2d3748;
          font-weight: 700;
          font-size: 1.5rem;
          gap: -0-2rem;
 
        }
        .nav-logo:hover { transform: scale(1.05); color: #667eea; }
        .logo-text {
          background: linear-gradient(45deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .logo-img { width: 40px; height: 60px; object-fit: contain; margin-right: 10px; border-radius: 50%; }

        /* ===== CENTRO ===== */
        .nav-center {
          display: flex;
          align-items: center;
          flex: 1;
          justify-content: center;
          flex: 1 !important;
          display: flex !important;
          justify-content: center !important;
        }
        .nav-menu { 
          display: flex; 
          list-style: none; 
          margin: 0; 
          padding: 0; 
          gap: 2rem; 
        }
        .nav-menu li a {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none; 
          color: #2d3748; 
          font-weight: 500; 
          padding: 0.5rem 0; 
          position: relative; 
          transition: color 0.3s ease;
        }
        .nav-menu li a:hover { color: #667eea; }
        .nav-menu li a::after { 
          content: ''; 
          position: absolute; 
          bottom: -2px; 
          left: 0; 
          width: 0; 
          height: 2px; 
          background: linear-gradient(45deg, #667eea, #764ba2); 
          transition: width 0.3s ease; 
        }
        .nav-menu li a:hover::after { width: 100%; }

        /* ===== DERECHA ===== */
        .auth-buttons-desktop { 
          display: flex; 
          gap: 1rem; 
          align-items: center;
          margin-left: auto;
          margin-left: auto !important;
          display: flex !important;
          gap: 1rem !important;
        }
        .btn-login { 
          text-decoration: none; 
          color: #2d3748; 
          font-weight: 500; 
          padding: 0.5rem 1rem; 
          border-radius: 6px; 
          transition: all 0.3s ease; 
          border: none; 
          background: transparent; 
        }
        .btn-login:hover { 
          background: rgba(102, 126, 234, 0.1); 
          color: #667eea; 
        }
        .btn-register { 
          text-decoration: none; 
          background: linear-gradient(45deg, #667eea, #764ba2); 
          color: white; 
          padding: 0.5rem 1.5rem; 
          border-radius: 25px; 
          font-weight: 500; 
          transition: all 0.3s ease; 
          box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3); 
          border: none; 
        }
        .btn-register:hover { 
          transform: translateY(-1px); 
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); 
        }

        /* ===== MENÚ MÓVIL ===== */
        .nav-mobile-menu {
          position: fixed;
          top: 70px;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          flex-direction: column;
          padding: 2rem;
          transform: translateY(-100vh);
          opacity: 0;
          transition: transform 0.3s ease, opacity 0.3s ease;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          z-index: 2000;
        }
        .nav-mobile-menu.active {
          transform: translateY(0);
          opacity: 1;
        }
        .nav-mobile-list { 
          list-style: none; 
          display: flex; 
          flex-direction: column; 
          gap: 1.5rem; 
          margin: 0; 
          padding: 0; 
          width: 100%; 
        }
        .nav-mobile-list li a {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none; 
          color: #2d3748; 
          font-weight: 500;
        }

        /* ===== BOTÓN HAMBURGUESA ===== */
        .menu-toggle {
          display: none;
          flex-direction: column;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          gap: 4px;
        }
        .menu-toggle span { 
          width: 25px; 
          height: 3px; 
          background: #2d3748; 
          border-radius: 2px; 
          transition: all 0.3s ease; 
        }
        .menu-toggle.active span:nth-child(1) { 
          transform: rotate(45deg) translate(7px, 7px); 
        }
        .menu-toggle.active span:nth-child(2) { 
          opacity: 0; 
        }
        .menu-toggle.active span:nth-child(3) { 
          transform: rotate(-45deg) translate(6px, -6px); 
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
          .nav-center { display: none; }
          .auth-buttons-desktop { display: none; }
          .menu-toggle { display: flex; }
        }
      `}</style>
    </>
  );
}
