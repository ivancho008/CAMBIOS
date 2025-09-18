import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { User, Home, Target, CheckCircle } from "lucide-react";
import isotipo from "../static/IMG/isotipo.png";

export default function Navbar({ user, onAuthClick, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  const navItems = [
    { path: '/pomodoro', label: 'Pomodoro', icon: <Home size={20} />, requiresAuth: false },
    { path: '/meditacion', label: 'Meditación', icon: <Target size={20} />, requiresAuth: true },
    { path: '/concentracion', label: 'Estudio Profundo', icon: <CheckCircle size={20} />, requiresAuth: true },
  ];

  return (
    <>
      <nav className="modern-navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <img src={isotipo} alt="Logo" className="logo-img" />
            <span className="logo-text">Synapse</span>
          </Link>

          <button
            className={`menu-toggle ${isMenuOpen ? "active" : ""}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <ul className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
            {navItems.map(item => (
              <li key={item.path}>
                <Link
                  to={item.requiresAuth && !user ? "#" : item.path}
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (item.requiresAuth && !user) onAuthClick();
                  }}
                >
                  {item.icon} {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="auth-buttons">
            {isLoginPage && <button onClick={onAuthClick} className="btn-register">Registrarse</button>}
            {isRegisterPage && <button onClick={onAuthClick} className="btn-login">Iniciar Sesión</button>}
            {!isLoginPage && !isRegisterPage && (
              !user ? (
                <>
                  <button onClick={onAuthClick} className="btn-login">Iniciar Sesión</button>
                  <button onClick={onAuthClick} className="btn-register">Registrarse</button>
                </>
              ) : (
                <button onClick={onLogout} className="btn-login">Salir</button>
              )
            )}
          </div>
        </div>
      </nav>

      {/* ====================== CSS Dentro del Componente ====================== */}
      <style>{`
        .modern-navbar {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0,0,0,0.1);
          position: fixed;
          top: 0; left:0; right:0;
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
        }
        .nav-logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: #2d3748;
          font-weight: 700;
          font-size: 1.5rem;
          gap: 0.5rem;
          transition: transform 0.2s ease;
        }
        .nav-logo:hover { transform: scale(1.05); color: #667eea; }
        .logo-text {
          background: linear-gradient(45deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .logo-img { width: 40px; height: 60px; object-fit: contain; margin-right: 10px; border-radius: 50%; }
        .menu-toggle { display: none; flex-direction: column; background: none; border: none; cursor: pointer; padding: 0.5rem; gap: 4px; }
        .menu-toggle span { width:25px; height:3px; background:#2d3748; border-radius:2px; transition: all 0.3s ease; }
        .menu-toggle.active span:nth-child(1) { transform: rotate(45deg) translate(7px,7px); }
        .menu-toggle.active span:nth-child(2) { opacity:0; }
        .menu-toggle.active span:nth-child(3) { transform: rotate(-45deg) translate(6px,-6px); }
        .nav-menu { display:flex; list-style:none; gap:2rem; margin:0; padding:0; }
        .nav-menu li a {
          text-decoration:none; color:#2d3748; font-weight:500; padding:0.5rem 0; position:relative; transition:color 0.3s ease;
        }
        .nav-menu li a:hover { color:#667eea; }
        .nav-menu li a::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:2px; background:linear-gradient(45deg,#667eea,#764ba2); transition:width 0.3s ease; }
        .nav-menu li a:hover::after { width:100%; }
        .auth-buttons { display:flex; gap:1rem; align-items:center; }
        .btn-login { text-decoration:none; color:#2d3748; font-weight:500; padding:0.5rem 1rem; border-radius:6px; transition:all 0.3s ease; }
        .btn-login:hover { background:rgba(102,126,234,0.1); color:#667eea; text-decoration:none; }
        .btn-register { text-decoration:none; background:linear-gradient(45deg,#667eea,#764ba2); color:white; padding:0.5rem 1.5rem; border-radius:25px; font-weight:500; transition:all 0.3s ease; box-shadow:0 2px 10px rgba(102,126,234,0.3); }
        .btn-register:hover { transform:translateY(-1px); box-shadow:0 4px 15px rgba(102,126,234,0.4); text-decoration:none; color:white; }

        @media (max-width:768px){
          .menu-toggle { display:flex; }
          .nav-menu { position:fixed; top:70px; left:0; right:0; background:rgba(255,255,255,0.98); backdrop-filter:blur(10px); flex-direction:column; padding:2rem; gap:1.5rem; transform:translateY(-100vh); opacity:0; transition:all 0.3s ease; border-bottom:1px solid rgba(0,0,0,0.1); box-shadow:0 4px 6px rgba(0,0,0,0.1); }
          .nav-menu.active { transform:translateY(0); opacity:1; }
          .auth-buttons { position:fixed; bottom:2rem; left:50%; transform:translateX(-50%); gap:1rem; z-index:1001; display:none; }
          .nav-menu.active ~ .auth-buttons { display:flex; }
        }
      `}</style>
    </>
  );
}
