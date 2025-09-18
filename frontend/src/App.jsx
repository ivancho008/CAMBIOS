import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Componentes
import Navbar from './componentes/Navbar.jsx';
import Footer from './componentes/Footer.jsx';
import AuthModal from './componentes/AuthModal.jsx';
import { apiCall } from './componentes/api.js';

// Páginas
import HomePage from './paginas/HomePage.jsx';
import ConcentracionPage from './paginas/ConcentracionPage.jsx';
import PomodoroPage from './paginas/PomodoroPage.jsx';
import TareasPage from './paginas/TareasPage.jsx';
import RecompensasPage from './paginas/RecompensasPage.jsx';

// ------------------------
// Hook de autenticación
// ------------------------
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      apiCall('/auth/me')
        .then((data) => setUser(data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (correo, password) => {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: { correo, password },
    });
    localStorage.setItem('token', data.access_token);
    setUser(data.usuario);
    return data;
  };

  const register = async (userData) => {
    const data = await apiCall('/auth/register', {
      method: 'POST',
      body: userData,
    });
    localStorage.setItem('token', data.access_token);
    setUser(data.usuario);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return { user, loading, login, register, logout };
};

// ------------------------
// App principal
// ------------------------
export default function SynapseApp() {
  const { user, loading, login, register, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando Synapse...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar
          user={user}
          onAuthClick={() => setShowAuthModal(true)}
          onLogout={logout}
        />

        <main className="flex-1">
          <Routes>
            {/* Ruta pública */}
            <Route
              path="/"
              element={
                <HomePage
                  user={user}
                  onAuthClick={() => setShowAuthModal(true)}
                />
              }
            />

            {/* Rutas protegidas */}
            <Route
              path="/concentracion"
              element={
                user ? (
                  <ConcentracionPage user={user} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/pomodoro"
              element={
                user ? <PomodoroPage user={user} /> : <Navigate to="/" replace />
              }
            />
            <Route
              path="/tareas"
              element={
                user ? <TareasPage user={user} /> : <Navigate to="/" replace />
              }
            />
            <Route
              path="/recompensas"
              element={
                user ? (
                  <RecompensasPage user={user} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={login}
          onRegister={register}
        />
      </div>
    </Router>
  );
}
