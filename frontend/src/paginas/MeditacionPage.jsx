// src/paginas/MeditacionPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import Button from '../componentes/Button.jsx';
import Card from '../componentes/Card.jsx';
import Modal from '../componentes/Modal.jsx';
import ProgresoCard from '../componentes/ProgresoCard.jsx';
import { Play, Pause, RotateCcw, Settings, Lock, Star } from 'lucide-react';
import { meditacionService } from '../services/meditacion';
import { useRecompensas } from '../hooks/useRecompensas';

export default function MeditacionPage({ user, onAuthClick }) {
  const [sesionActual, setSesionActual] = useState(null);
  const [duracionMeditacion, setDuracionMeditacion] = useState(10);
  const [tipoMeditacion, setTipoMeditacion] = useState('mindfulness');
  const [tiposMeditacion, setTiposMeditacion] = useState([]);

  const [tiempoRestante, setTiempoRestante] = useState(10 * 60);
  const [isActive, setIsActive] = useState(false);

  const [showSettings, setShowSettings] = useState(false);
  const [showCalificacion, setShowCalificacion] = useState(false);

  const [sitiosBloqueados, setSitiosBloqueados] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const intervalRef = useRef(null);
  const { verificarRecompensas } = useRecompensas();

  // Cargar tipos de meditación al inicio
  useEffect(() => {
    if (!user) return;
    cargarTiposMeditacion();
  }, [user]);

  // Timer controlado
  useEffect(() => {
    if (isActive && tiempoRestante > 0) {
      intervalRef.current = setInterval(() => {
        setTiempoRestante((prev) => {
          if (prev <= 1) {
            handleMeditacionCompletada();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive, tiempoRestante]);

  const cargarTiposMeditacion = async () => {
    try {
      const tipos = await meditacionService.obtenerTipos();
      setTiposMeditacion(tipos);
    } catch (err) {
      console.error('Error cargando tipos de meditación:', err);
      setError('No se pudieron cargar los tipos de meditación');
    }
  };

  const iniciarMeditacion = async () => {
    try {
      if (!user) return onAuthClick?.();
      setLoading(true);
      setError('');

      const sesion = await meditacionService.iniciar(duracionMeditacion, tipoMeditacion);
      setSesionActual(sesion);
      setTiempoRestante(duracionMeditacion * 60);
      setIsActive(true);

      mostrarNotificacion('¡Meditación iniciada!');
    } catch (err) {
      console.error('Error iniciando meditación:', err);
      setError('Error iniciando la meditación: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMeditacionCompletada = () => {
    setIsActive(false);
    setShowCalificacion(true);
    verificarRecompensas?.('meditacion');
    mostrarNotificacion('Has completado tu sesión de meditación. ¡Bien hecho!');
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => setTiempoRestante(duracionMeditacion * 60);

  const formatTiempo = (segundos) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const activarBloqueo = () => {
    if (!sitiosBloqueados) return alert('Ingresa al menos un sitio web.');
    alert(`Bloqueando sitios: ${sitiosBloqueados}`);
  };

  const mostrarNotificacion = (mensaje) => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Meditación', { body: mensaje, icon: '/isotipo.png' });
      } else if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  };

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white pt-20 pb-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Meditación Guiada</h1>

        {user && <ProgresoCard usuarioId={user.id_usuario} />}
        {error && <p className="text-red-500">{error}</p>}

        <Card className="text-center mb-8 p-8">
          {/* Botón iniciar */}
          <Button onClick={iniciarMeditacion} disabled={loading} className="mb-4">
            <Play className="w-4 h-4 mr-2" /> Iniciar Meditación
          </Button>

          {/* Timer */}
          <div className="text-6xl font-mono font-bold mb-6 text-purple-600">
            {formatTiempo(tiempoRestante)}
          </div>

          {/* Controles */}
          <div className="flex justify-center space-x-4">
            <Button onClick={toggleTimer}>
              {isActive ? (
                <>
                  <Pause size={20} className="mr-2" /> Pausar
                </>
              ) : (
                <>
                  <Play size={20} className="mr-2" /> Reanudar
                </>
              )}
            </Button>
            <Button onClick={resetTimer}>
              <RotateCcw size={20} className="mr-2" /> Reiniciar
            </Button>
            <Button variant="outline" onClick={() => setShowSettings(true)}>
              <Settings size={20} className="mr-2" /> Configurar
            </Button>
          </div>
        </Card>

        {/* Bloqueo Anti-distracciones */}
        <Card className="p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Lock size={20} className="mr-2" />
            Bloqueo Anti-distracciones
          </h3>
          <p className="text-gray-600 mb-4">
            Ingresa sitios web que quieres bloquear durante la meditación (separados por comas)
          </p>
          <input
            type="text"
            placeholder="facebook.com, youtube.com, twitter.com"
            value={sitiosBloqueados}
            onChange={(e) => setSitiosBloqueados(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Button size="sm" className="bg-red-500 hover:bg-red-600" onClick={activarBloqueo}>
            <Lock size={16} className="mr-2" /> Activar Bloqueo
          </Button>
        </Card>

        {/* Modal Configuración */}
        <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="⚙️ Configurar Meditación">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                ⏳ Duración de la Meditación (minutos)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={duracionMeditacion}
                onChange={(e) => setDuracionMeditacion(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                🧘 Tipo de Meditación
              </label>
              <select
                value={tipoMeditacion}
                onChange={(e) => setTipoMeditacion(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {tiposMeditacion.map((t) => (
                  <option key={t.id} value={t.nombre}>
                    {t.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-4">
              <Button
                onClick={() => {
                  resetTimer();
                  setShowSettings(false);
                }}
                className="flex-1"
              >
                Aplicar y Reiniciar
              </Button>
              <Button variant="secondary" onClick={() => setShowSettings(false)} className="flex-1">
                Cancelar
              </Button>
            </div>
          </div>
        </Modal>

        {/* Modal Calificación */}
        {showCalificacion && (
          <Modal onClose={() => setShowCalificacion(false)} title="✨ Sesión completada">
            <h2 className="text-lg font-bold mb-4">¡Bien hecho!</h2>
            <Button onClick={() => setShowCalificacion(false)}>
              <Star className="w-4 h-4 mr-2" /> Calificar sesión
            </Button>
          </Modal>
        )}
      </div>
    </div>
  );
}
