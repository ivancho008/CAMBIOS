import React, { useState, useEffect } from 'react';
import Card from '../componentes/Card';
import Button from '../componentes/Button';
import Modal from '../componentes/Modal';
import ProgresoCard from '../componentes/ProgresoCard';
import { Play, Pause, RotateCcw, Settings, Lock } from 'lucide-react';

export default function PomodoroPage({ user, onNavigate }) {
  // 👉 1. Declarar todos los hooks siempre arriba
  const [tiempoTrabajo, setTiempoTrabajo] = useState(25);
  const [tiempoDescanso, setTiempoDescanso] = useState(5);
  const [tiempoActual, setTiempoActual] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [esTiempoTrabajo, setEsTiempoTrabajo] = useState(true);
  const [pomodorosCompletados, setPomodorosCompletados] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  // 👉 2. Redirigir al usuario solo con un efecto, no antes de los hooks
  useEffect(() => {
    if (!user) {
      onNavigate('home');
    }
  }, [user, onNavigate]);

  // 👉 3. Lógica del temporizador
  useEffect(() => {
    let intervalo = null;
    if (isActive && tiempoActual > 0) {
      intervalo = setInterval(() => setTiempoActual(t => t - 1), 1000);
    } else if (tiempoActual === 0) {
      if (esTiempoTrabajo) {
        setPomodorosCompletados(p => p + 1);
        setTiempoActual(tiempoDescanso * 60);
        setEsTiempoTrabajo(false);
      } else {
        setTiempoActual(tiempoTrabajo * 60);
        setEsTiempoTrabajo(true);
      }
      setIsActive(false);
    }
    return () => clearInterval(intervalo);
  }, [isActive, tiempoActual, tiempoTrabajo, tiempoDescanso, esTiempoTrabajo]);

  const toggleTimer = () => setIsActive(a => !a);
  const resetTimer = () => {
    setIsActive(false);
    setTiempoActual(tiempoTrabajo * 60);
    setEsTiempoTrabajo(true);
  };

  const formatTiempo = (segundos) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  // 👉 4. Renderizar null si no hay usuario (después de los hooks)
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Técnica Pomodoro</h1>

      <ProgresoCard usuarioId={user.id_usuario} />

      <Card className="text-center mb-8">
        <Button
          variant="outline"
          onClick={() => setShowSettings(true)}
          className="mb-4"
        >
          <Settings size={20} /> Configurar Técnica
        </Button>

        <div className="text-6xl font-mono font-bold mb-4 text-purple-600">
          {formatTiempo(tiempoActual)}
        </div>

        <div className="mb-4">
          <span
            className={`inline-block px-4 py-2 rounded-full text-white ${
              esTiempoTrabajo ? 'bg-red-500' : 'bg-green-500'
            }`}
          >
            {esTiempoTrabajo ? 'Tiempo de Trabajo' : 'Tiempo de Descanso'}
          </span>
        </div>

        <div className="space-x-4 mb-6">
          <Button onClick={toggleTimer}>
            {isActive ? <Pause size={20} /> : <Play size={20} />}{' '}
            {isActive ? 'Pausar' : 'Iniciar'}
          </Button>
          <Button variant="secondary" onClick={resetTimer}>
            <RotateCcw size={20} /> Reiniciar
          </Button>
        </div>

        <div className="text-lg font-semibold mb-4">
          Pomodoros Completados: {pomodorosCompletados}
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-semibold mb-4">Anti-distracciones</h3>
        <input
          type="text"
          placeholder="facebook.com, youtube.com"
          className="w-full px-3 py-2 border rounded-md mb-4"
        />
        <Button size="sm">
          <Lock size={16} /> Activar Bloqueo
        </Button>
      </Card>

      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Configurar Pomodoro"
      >
        <div className="space-y-4">
          <label>Tiempo de Trabajo (min)</label>
          <input
            type="number"
            value={tiempoTrabajo}
            onChange={(e) => setTiempoTrabajo(parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded-md"
          />
          <label>Tiempo de Descanso (min)</label>
          <input
            type="number"
            value={tiempoDescanso}
            onChange={(e) => setTiempoDescanso(parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded-md"
          />
          <Button
            onClick={() => {
              resetTimer();
              setShowSettings(false);
            }}
          >
            Aplicar Configuración
          </Button>
        </div>
      </Modal>
    </div>
  );
}