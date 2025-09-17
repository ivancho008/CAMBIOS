import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings, Home, Brain, Heart } from 'lucide-react';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [timer, setTimer] = useState(25 * 60); // 25 minutos por defecto
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTechnique, setCurrentTechnique] = useState('pomodoro');
  const [streak, setStreak] = useState(7);
  const [sessionsToday, setSessionsToday] = useState(3);
  const [totalMinutes, setTotalMinutes] = useState(145);
  const [distractionFreeMode, setDistractionFreeMode] = useState(false);

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (isActive && !isPaused && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsActive(false);
      // Aquí podrías agregar lógica para completar sesión
      setSessionsToday(prev => prev + 1);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused, timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const studyTechniques = {
    pomodoro: { work: 25, break: 5, name: 'Pomodoro Clásica' },
    study52: { work: 52, break: 17, name: 'Técnica 52-17' },
    ultradian: { work: 90, break: 20, name: 'Técnica Ultradian' },
    timeboxing: { work: 45, break: 15, name: 'Timeboxing' },
    study45: { work: 45, break: 15, name: 'Técnica 45-15' },
    intervals: { work: 15, break: 5, name: 'Intervalos Cortos' },
    flowtime: { work: 60, break: 10, name: 'Flowtime' }
  };

  const meditationTechniques = {
    breathing478: { duration: 4, name: 'Respiración 4-7-8', cycles: 4 },
    boxBreathing: { duration: 8, name: 'Respiración Cuadrada', cycles: 8 },
    mindfulness: { duration: 10, name: 'Atención Plena', cycles: 1 }
  };

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(!isPaused);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    const technique = currentPage === 'concentration' ? studyTechniques[currentTechnique] : meditationTechniques[currentTechnique];
    setTimer(technique.work ? technique.work * 60 : technique.duration * 60);
  };

  const changeTechnique = (newTechnique) => {
    setCurrentTechnique(newTechnique);
    setIsActive(false);
    setIsPaused(false);
    const technique = currentPage === 'concentration' ? studyTechniques[newTechnique] : meditationTechniques[newTechnique];
    setTimer(technique.work ? technique.work * 60 : technique.duration * 60);
  };

  const Navigation = () => (
    <nav className="bg-gradient-to-r from-pink-500 to-rose-400 text-white p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setCurrentPage('home')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
              currentPage === 'home' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <Home size={20} />
            <span>Inicio</span>
          </button>
          <button
            onClick={() => setCurrentPage('concentration')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
              currentPage === 'concentration' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <Brain size={20} />
            <span>Concentración</span>
          </button>
          <button
            onClick={() => setCurrentPage('meditation')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
              currentPage === 'meditation' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <Heart size={20} />
            <span>Meditación</span>
          </button>
        </div>
        <button className="p-2 rounded-lg hover:bg-white/10">
          <Settings size={20} />
        </button>
      </div>
    </nav>
  );

  const StatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="text-3xl font-bold text-gray-800 mb-2">{streak}</div>
        <div className="text-gray-600 text-sm">Días de racha</div>
        <div className="text-red-500 text-lg font-semibold mt-1">94%</div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="text-3xl font-bold text-gray-800 mb-2">{sessionsToday}</div>
        <div className="text-gray-600 text-sm">Sesiones Completadas</div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="text-3xl font-bold text-gray-800 mb-2">{totalMinutes}</div>
        <div className="text-gray-600 text-sm">Minutos Totales</div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="text-3xl font-bold text-gray-800 mb-2">7</div>
        <div className="text-gray-600 text-sm">Mejor Racha</div>
      </div>
    </div>
  );

  const TimerSection = () => (
    <div className="bg-white rounded-xl p-8 shadow-lg text-center mb-8">
      <div className="text-8xl font-bold text-gray-800 mb-6">
        {formatTime(timer)}
      </div>
      
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={isActive ? pauseTimer : startTimer}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            isActive ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isActive ? <Pause size={20} /> : <Play size={20} />}
          <span>{isActive ? (isPaused ? 'Reanudar' : 'Pausar') : 'Iniciar'}</span>
        </button>
        <button
          onClick={resetTimer}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all"
        >
          <RotateCcw size={20} />
          <span>Reiniciar</span>
        </button>
      </div>

      <div className="mb-4">
        <label className="flex items-center justify-center space-x-2">
          <input
            type="checkbox"
            checked={distractionFreeMode}
            onChange={(e) => setDistractionFreeMode(e.target.checked)}
            className="w-4 h-4 text-pink-600"
          />
          <span className="text-gray-700">Modo sin distracciones</span>
        </label>
      </div>

      {distractionFreeMode && (
        <div className="bg-pink-50 p-4 rounded-lg">
          <p className="text-pink-800 text-sm">
            Modo sin distracciones activado. Mantén la concentración con intervalos de trabajo y descanso dentíficamente.
          </p>
        </div>
      )}
    </div>
  );

  const TechniqueSelector = ({ techniques, type }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Seleccionar Técnica de {type === 'study' ? 'Estudio' : 'Meditación'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.entries(techniques).map(([key, technique]) => (
          <button
            key={key}
            onClick={() => changeTechnique(key)}
            className={`p-3 rounded-lg border-2 transition-all text-left ${
              currentTechnique === key
                ? 'border-pink-500 bg-pink-50 text-pink-800'
                : 'border-gray-200 hover:border-pink-300 text-gray-700'
            }`}
          >
            <div className="font-semibold">{technique.name}</div>
            {technique.work && (
              <div className="text-sm text-gray-600">
                {technique.work}min trabajo / {technique.break}min descanso
              </div>
            )}
            {technique.duration && !technique.work && (
              <div className="text-sm text-gray-600">
                {technique.duration} minutos - {technique.cycles} ciclos
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 p-6">
      <Navigation />
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Centro de Concentración y Meditación
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div 
            onClick={() => setCurrentPage('concentration')}
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:transform hover:scale-105"
          >
            <Brain size={48} className="text-pink-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Técnicas de Concentración</h2>
            <p className="text-gray-600 mb-4">
              Mejora tu productividad con técnicas de estudio probadas científicamente como Pomodoro, 52-17 y más.
            </p>
            <div className="text-pink-600 font-semibold">→ Comenzar sesión</div>
          </div>

          <div 
            onClick={() => setCurrentPage('meditation')}
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:transform hover:scale-105"
          >
            <Heart size={48} className="text-pink-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Meditación y Respiración</h2>
            <p className="text-gray-600 mb-4">
              Calma tu mente y prepárate para el estudio con técnicas de respiración y meditación guiada.
            </p>
            <div className="text-pink-600 font-semibold">→ Comenzar meditación</div>
          </div>
        </div>

        <div className="mt-12">
          <StatsCards />
        </div>
      </div>
    </div>
  );

  const ConcentrationPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 p-6">
      <Navigation />
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Técnicas de Concentración
        </h1>
        
        <StatsCards />
        <TimerSection />
        <TechniqueSelector techniques={studyTechniques} type="study" />
      </div>
    </div>
  );

  const MeditationPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <Navigation />
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Meditación y Respiración
        </h1>
        
        <StatsCards />
        <TimerSection />
        <TechniqueSelector techniques={meditationTechniques} type="meditation" />
        
        <div className="bg-white rounded-xl p-6 shadow-lg mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Instrucciones de Respiración</h3>
          {currentTechnique === 'breathing478' && (
            <div className="text-gray-700">
              <p className="mb-2">• Inhala por la nariz durante 4 segundos</p>
              <p className="mb-2">• Retén el aire durante 7 segundos</p>
              <p className="mb-2">• Exhala por la boca durante 8 segundos</p>
              <p>• Repite 3-4 ciclos para reducir la ansiedad</p>
            </div>
          )}
          {currentTechnique === 'boxBreathing' && (
            <div className="text-gray-700">
              <p className="mb-2">• Inhala durante 4 segundos</p>
              <p className="mb-2">• Retén el aire durante 4 segundos</p>
              <p className="mb-2">• Exhala durante 4 segundos</p>
              <p>• Pausa durante 4 segundos y repite</p>
            </div>
          )}
          {currentTechnique === 'mindfulness' && (
            <div className="text-gray-700">
              <p className="mb-2">• Siéntate cómodamente con la espalda recta</p>
              <p className="mb-2">• Enfócate en tu respiración natural</p>
              <p className="mb-2">• Cuando tu mente divague, gentilmente regresa la atención a la respiración</p>
              <p>• No juzgues tus pensamientos, simplemente obsérvalos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Render current page
  switch (currentPage) {
    case 'concentration':
      return <ConcentrationPage />;
    case 'meditation':
      return <MeditationPage />;
    default:
      return <HomePage />;
  }
};

export default App;