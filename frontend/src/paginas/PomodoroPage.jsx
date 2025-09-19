import React, { useState, useEffect } from 'react';
import Card from '../componentes/Card';
import Button from '../componentes/Button';
import Modal from '../componentes/Modal';
import ProgresoCard from '../componentes/ProgresoCard';
import { Play, Pause, RotateCcw, Settings, Lock } from 'lucide-react';

export default function PomodoroPage({ user }) {
  // 1. Estado del temporizador
  const [tiempoTrabajo, setTiempoTrabajo] = useState(25);
  const [tiempoDescanso, setTiempoDescanso] = useState(5);
  const [tiempoActual, setTiempoActual] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [esTiempoTrabajo, setEsTiempoTrabajo] = useState(true);
  const [pomodorosCompletados, setPomodorosCompletados] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  // 2. Lógica del temporizador
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

  // 3. Actualizar tiempo actual cuando cambia la configuración
  useEffect(() => {
    if (esTiempoTrabajo && !isActive) {
      setTiempoActual(tiempoTrabajo * 60);
    }
  }, [tiempoTrabajo, esTiempoTrabajo, isActive]);

  const toggleTimer = () => setIsActive(a => !a);
  
  const resetTimer = () => {
    setIsActive(false);
    setTiempoActual(tiempoTrabajo * 60);
    setEsTiempoTrabajo(true);
  };

  const formatTiempo = (segundos) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleConfiguracionChange = (tipo, valor) => {
    const valorNumerico = parseInt(valor) || 1; // Mínimo 1 minuto
    if (tipo === 'trabajo') {
      setTiempoTrabajo(valorNumerico);
    } else {
      setTiempoDescanso(valorNumerico);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white.">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Técnica Pomodoro</h1>

        {/* ProgresoCard solo se muestra si existe usuario */}
        {user && <ProgresoCard usuarioId={user.id_usuario} />}

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
            {formatTiempo(tiempoActual)}
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
              onClick={toggleTimer}
              size="lg"
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
            Pomodoros Completados: <span className="text-purple-600">{pomodorosCompletados}</span>
          </div>
        </Card>

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
            className="w-full px-4 py-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Button size="sm" className="bg-red-500 hover:bg-red-600">
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
                value={tiempoTrabajo}
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
                value={tiempoDescanso}
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