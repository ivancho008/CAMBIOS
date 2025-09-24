// src/paginas/PomodoroPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import Card from '../componentes/Card';
import Button from '../componentes/Button';
import Modal from '../componentes/Modal';
import ProgresoCard from '../componentes/ProgresoCard';
import { Play, Pause, RotateCcw, Settings, Lock } from 'lucide-react';
import { pomodoroService } from '../services/pomodoro';
import { useRecompensas } from '../hooks/useRecompensas';

export default function PomodoroPage({ user }) {
  // Configuración base
  const [config, setConfig] = useState({
    tiempoTrabajo: 25,
    tiempoDescanso: 5,
    ciclosObjetivo: 4,
  });

  // Estado
  const [sesionActual, setSesionActual] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(config.tiempoTrabajo * 60);
  const [isActive, setIsActive] = useState(false);
  const [esTiempoTrabajo, setEsTiempoTrabajo] = useState(true);
  const [pomodorosCompletados, setPomodorosCompletados] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [sitiosBloqueados, setSitiosBloqueados] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const intervalRef = useRef(null);
  const { verificarRecompensas } = useRecompensas();

  // Lógica del temporizador
  useEffect(() => {
    if (isActive && tiempoRestante > 0) {
      intervalRef.current = setInterval(() => {
        setTiempoRestante((prev) => {
          if (prev <= 1) {
            handleTiempoTerminado();
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

  // Manejo cuando termina un ciclo
  const handleTiempoTerminado = async () => {
    if (!sesionActual) return;

    try {
      setIsActive(false);

      if (esTiempoTrabajo) {
        await pomodoroService.completarCiclo(sesionActual.sesion_id, 'trabajo');
        setPomodorosCompletados((p) => p + 1);
        setEsTiempoTrabajo(false);
        setTiempoRestante(config.tiempoDescanso * 60);
        mostrarNotificacion('¡Ciclo completado! Tiempo de descanso');
      } else {
        await pomodoroService.completarCiclo(sesionActual.sesion_id, 'descanso');
        setEsTiempoTrabajo(true);
        setTiempoRestante(config.tiempoTrabajo * 60);
        mostrarNotificacion('¡Descanso terminado! De vuelta al trabajo');
      }

      verificarRecompensas(); // opcional
    } catch (error) {
      console.error('Error completando ciclo:', error);
      setError('Error completando el ciclo');
    }
  };

  // Notificaciones nativas
  const mostrarNotificacion = (mensaje) => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Pomodoro', { body: mensaje, icon: '/isotipo.png' });
      } else if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  };

  // Iniciar pomodoro
  const iniciarPomodoro = async () => {
    try {
      setLoading(true);
      setError('');

      const sesion = await pomodoroService.iniciar(config);
      setSesionActual(sesion);
      setTiempoRestante(config.tiempoTrabajo * 60);
      setIsActive(true);
      setEsTiempoTrabajo(true);
      setPomodorosCompletados(0);

      mostrarNotificacion('¡Pomodoro iniciado!');
    } catch (error) {
      console.error('Error iniciando Pomodoro:', error);
      setError('Error iniciando el Pomodoro: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTimer = () => setIsActive((a) => !a);

  const resetTimer = () => {
    setIsActive(false);
    setTiempoRestante(config.tiempoTrabajo * 60);
    setEsTiempoTrabajo(true);
  };

  const formatTiempo = (segundos) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleConfiguracionChange = (tipo, valor) => {
    const valorNumerico = parseInt(valor) || 1;
    setConfig((prev) => ({
      ...prev,
      [tipo === 'trabajo' ? 'tiempoTrabajo' : 'tiempoDescanso']: valorNumerico,
    }));
  };

  const activarBloqueo = () => {
    if (!sitiosBloqueados) return alert('Ingresa al menos un sitio web.');
    alert(`Bloqueando sitios: ${sitiosBloqueados}`);
  };

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Técnica Pomodoro</h1>

        {user && <ProgresoCard usuarioId={user.id_usuario} />}
        {error && <p className="text-red-500">{error}</p>}

        <Card className="text-center mb-8 p-8">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setShowSettings(true)}
              className="mb-4"
            >
              <Settings size={20} className="mr-2" />
              Configurar
            </Button>
          </div>

          <div className="text-6xl font-mono font-bold mb-6 text-purple-600">
            {formatTiempo(tiempoRestante)}
          </div>

          <div className="mb-6">
            <span
              className={`inline-block px-6 py-3 rounded-full text-white font-semibold ${
                esTiempoTrabajo ? 'bg-red-500' : 'bg-green-500'
              }`}
            >
              {esTiempoTrabajo ? 'Tiempo de Trabajo' : '☕ Tiempo de Descanso'}
            </span>
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            <Button
              onClick={isActive ? toggleTimer : iniciarPomodoro}
              size="lg"
              disabled={loading}
              className={isActive ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'}
            >
              {isActive ? (
                <>
                  <Pause size={20} className="mr-2" /> Pausar
                </>
              ) : (
                <>
                  <Play size={20} className="mr-2" /> Iniciar
                </>
              )}
            </Button>
            <Button variant="secondary" onClick={resetTimer} size="lg">
              <RotateCcw size={20} className="mr-2" /> Reiniciar
            </Button>
          </div>

          <div className="text-lg font-semibold">
            Pomodoros Completados:{' '}
            <span className="text-purple-600">{pomodorosCompletados}</span>
          </div>
        </Card>

        {/* Bloqueo Anti-distracciones */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Lock size={20} className="mr-2" />
            Bloqueo Anti-distracciones
          </h3>
          <p className="text-gray-600 mb-4">
            Ingresa sitios web que quieres bloquear durante el pomodoro (separados por comas)
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

        {/* Modal de Configuración */}
        <Modal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          title="Configurar Pomodoro"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Tiempo de Trabajo (minutos)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={config.tiempoTrabajo}
                onChange={(e) => handleConfiguracionChange('trabajo', e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Tiempo de Descanso (minutos)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={config.tiempoDescanso}
                onChange={(e) => handleConfiguracionChange('descanso', e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
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
              <Button
                variant="secondary"
                onClick={() => setShowSettings(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
