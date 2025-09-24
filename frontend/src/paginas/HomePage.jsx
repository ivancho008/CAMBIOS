import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Leaf, Clock, CheckCircle, Star, Users, User } from 'lucide-react'; // Iconos de lucide-react



const HomePage = ({ user, onAuthClick }) => {
  const navigate = useNavigate();

  // -----------------------------
  // Lista de técnicas disponibles
  // -----------------------------
  const [tecnicas] = useState([
    {
      id: 1,
      nombre: 'Pomodoro',
      descripcion: 'Mejora tu productividad trabajando en bloques de tiempo con pausas estratégicas.',
      categoria: 'concentracion',
      ruta: '/pomodoro',
      requiresAuth: true,
      icon: <Clock size={40} className="text-[#667eea]" />,
    },
    {
      id: 2,
      nombre: 'Meditación',
      descripcion: 'Reduce el estrés y aumenta tu claridad mental con prácticas guiadas de mindfulness.',
      categoria: 'relajacion',
      ruta: '/meditacion',
      requiresAuth: true,
      icon: <Leaf size={40} className="text-[#764ba2]" />,
    },
    
    // --- Añadidos sin eliminar nada del original ---
    {
      id: 4,
      nombre: 'Tareas',
      descripcion: 'Organiza y gestiona tus pendientes fácilmente.',
      categoria: 'organizacion',
      ruta: '/tareas',
      requiresAuth: true,
      icon: <CheckCircle size={40} className="text-[#22c55e]" />,
    },
    {
      id: 5,
      nombre: 'Recompensas',
      descripcion: 'Gana logros y puntos por tus hábitos.',
      categoria: 'motivacion',
      ruta: '/recompensas',
      requiresAuth: true,
      icon: <Star size={40} className="text-[#eab308]" />,
    },
    {
      id: 6,
      nombre: 'Sesiones Grupales',
      descripcion: 'Conéctate con otros usuarios en tiempo real.',
      categoria: 'social',
      ruta: '/sesiones',
      requiresAuth: true,
      icon: <Users size={40} className="text-[#3b82f6]" />,
    },
    {
      id: 7,
      nombre: 'Perfil',
      descripcion: 'Configura y revisa tu progreso personal.',
      categoria: 'usuario',
      ruta: '/perfil',
      requiresAuth: true,
      icon: <User size={40} className="text-[#8b5cf6]" />,
    }
  ]);

  // -----------------------------
  // Funciones de navegación
  // -----------------------------
  const handleTecnicaClick = (tecnica) => {
    if (tecnica.requiresAuth && !user) {
      onAuthClick('login');
    } else {
      navigate(tecnica.ruta);
    }
  };

  const handleExplorarTecnicas = () => {
    navigate('/concentracion');
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden">



      {/* ==============================
           HERO SECTION
           ============================== */}
      <section className="bg-gradient-to-br from-[#667eea] to-[#764ba2] min-h-[90vh] flex items-center pt-8 md:pt-0 relative overflow-hidden mt-[70px]">
        {/* Fondo animado */}
        <div className="absolute inset-0 w-full h-full animate-bg-gradient"></div>

        <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Texto principal */}
          <div className="text-white z-10 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 text-shadow-md">
              Potencia tu{' '}
              <span className="text-[#ffd700] relative after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r after:from-[#ffd700] after:to-[#ffed4a] after:rounded-sm">
                Mente
              </span>
            </h1>
            <p className="text-lg sm:text-xl leading-relaxed mb-8 opacity-90 max-w-lg mx-auto lg:mx-0">
              Entrena tu concentración, medita con propósito y transforma tu productividad con técnicas científicamente probadas.
            </p>
            <div className="flex justify-center lg:justify-start flex-wrap gap-4">
              <button
                className="bg-gradient-to-br from-[#ff6b6b] to-[#ff8e8e] text-white font-semibold py-4 px-8 rounded-full shadow-lg hover:scale-105 transform transition-all duration-300"
                onClick={() => onAuthClick("register")}
              >
                Registrarse
              </button>
              <button
                className="bg-transparent text-white font-semibold py-4 px-8 rounded-full border-2 border-[rgba(255,255,255,0.3)] backdrop-blur-md hover:bg-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.5)] transform transition-all duration-300"
                onClick={() => onAuthClick("login")}
              >
                Iniciar Sesión
              </button>
            </div>
          </div>

          {/* Ilustración animada */}
          <div className="flex justify-center items-center relative lg:order-last">
            <div className="relative w-[300px] h-[300px] flex items-center justify-center bg-[rgba(255,255,255,0.1)] rounded-full animate-pulse-light">
              <div className="relative w-[200px] h-[200px] border-2 border-[rgba(255,215,0,0.6)] rounded-full animate-pulse-heavy">
                {/* Círculos en rotación */}
                <div className="absolute top-1/2 left-1/2 w-24 h-24 border border-[rgba(255,255,255,0.4)] rounded-full -translate-x-[70%] -translate-y-1/2 animate-rotate-slow"></div>
                <div className="absolute top-1/2 left-1/2 w-24 h-24 border border-[rgba(255,255,255,0.4)] rounded-full -translate-x-[30%] -translate-y-1/2 animate-rotate-reverse-slow"></div>
              </div>
              {/* Puntos flotantes */}
              <div className="absolute inset-0">
                <div className="absolute w-1 h-1 bg-[#ffd700] rounded-full top-1/4 left-1/4 animate-float-one"></div>
                <div className="absolute w-1 h-1 bg-[#ffd700] rounded-full bottom-1/4 right-1/4 animate-float-two"></div>
                <div className="absolute w-1 h-1 bg-[#ffd700] rounded-full bottom-1/4 left-1/2 animate-float-three"></div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* ==============================
           FEATURES SECTION
           ============================== */}
      <section className="py-24 bg-[#f8fafc]">
        <div className="container mx-auto px-4 md:px-8">
          {/* Título */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Características que <span className="text-[#667eea]">Transforman</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Todo lo que necesitas para entrenar tu mente más fuerte y productiva.
            </p>
          </div>

          {/* Cards de características */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] mb-8">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-white">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Entrenamiento de Concentración</h3>
              <p className="text-gray-600">Ejercicios personalizados para mejorar tu enfoque mental.</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center bg-gradient-to-br from-[#f093fb] to-[#f5576c] mb-8">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-white">
                  <path d="M9 12l2 2 4-4" />
                  <circle cx="21" cy="12" r="1" />
                  <circle cx="3" cy="12" r="1" />
                  <path d="M8 21l4-7 4 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Meditación Inteligente</h3>
              <p className="text-gray-600">Sesiones guiadas con biofeedback y adaptación en tiempo real.</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center bg-gradient-to-br from-[#4facfe] to-[#00f2fe] mb-8">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-white">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Análisis Avanzado</h3>
              <p className="text-gray-600">Reportes detallados para maximizar tu desarrollo.</p>
            </div>
          </div>
        </div>
      </section>



      {/* ==============================
           TÉCNICAS DISPONIBLES
           ============================== */}
      <section className="py-16 max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-12 text-gray-800">Técnicas Disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tecnicas.map((t) => (
            <div
              key={t.id}
              className="bg-white p-8 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center"
            >
              <div className="mb-4">{t.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{t.nombre}</h3>
              <p className="text-gray-600 mb-4 text-center">{t.descripcion}</p>
              <button
                className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-blue-600 transition-colors"
                onClick={() => handleTecnicaClick(t)}
              >
                Ir a {t.nombre}
              </button>
            </div>
          ))}
        </div>
      </section>



      {/* ==============================
           RESULTADOS
           ============================== */}
      <section className="py-24 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white text-center">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Resultados que <span className="text-[#ffd700]">Inspiran</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div><h3 className="text-5xl font-bold text-[#ffd700] mb-2">+127%</h3><p>Mejora en concentración</p></div>
            <div><h3 className="text-5xl font-bold text-[#ffd700] mb-2">89%</h3><p>Reducción del estrés</p></div>
            <div><h3 className="text-5xl font-bold text-[#ffd700] mb-2">15k+</h3><p>Usuarios activos</p></div>
            <div><h3 className="text-5xl font-bold text-[#ffd700] mb-2">4.9 ★</h3><p>Valoración promedio</p></div>
          </div>
        </div>
      </section>



      {/* ==============================
           CALL TO ACTION
           ============================== */}
      <section className="py-24 bg-[#1a202c] text-white text-center">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para <span className="text-[#ffd700]">Transformar tu Mente?</span>
          </h2>
          <p className="text-lg md:text-xl leading-relaxed mb-12 opacity-90">
            Únete a miles de personas entrenando su mente para alcanzar su máximo potencial.
          </p>
          <button
            className="bg-gradient-to-br from-[#ff6b6b] to-[#ff8e8e] text-white font-semibold py-4 px-8 rounded-full shadow-lg hover:scale-105 transform transition-all duration-300"
            onClick={() => onAuthClick('login')}
          >
            Comenzar Ahora
          </button>
        </div>
      </section>

    </div>
  );
};



export default HomePage;
