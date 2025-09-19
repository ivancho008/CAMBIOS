// src/paginas/MeditacionPage.jsx
import React, { useState, useEffect } from 'react';
import Button from '../componentes/Button.jsx';
import Card from '../componentes/Card.jsx';
import Modal from '../componentes/Modal.jsx';
import ProgresoCard from '../componentes/ProgresoCard.jsx';
import { Play, Pause, RotateCcw, Settings } from 'react-feather';

const MeditacionPage = ({ user }) => {
  const [duracionMeditacion, setDuracionMeditacion] = useState(10);
  const [tiempoActual, setTiempoActual] = useState(10 * 60);
  const [isActive, setIsActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    let intervalo = null;
    if (isActive && tiempoActual > 0) {
      intervalo = setInterval(() => {
        setTiempoActual((t) => t - 1);
      }, 1000);
    }
    return () => clearInterval(intervalo);
  }, [isActive, tiempoActual]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => setTiempoActual(duracionMeditacion * 60);

  const formatTiempo = (segundos) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white.">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Meditación Guiada</h1>

        {/* Mostrar progreso solo si hay usuario */}
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

          <div className="flex justify-center space-x-4">
            <Button onClick={toggleTimer}>
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
            <Button onClick={resetTimer}>
              <RotateCcw size={20} className="mr-2" /> Reiniciar
            </Button>
          </div>
        </Card>

        {/* Modal de configuración */}
        <Modal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          title="⚙️ Configurar Meditación"
        >
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
};

export default MeditacionPage;
