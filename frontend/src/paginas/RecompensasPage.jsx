import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Card from '../componentes/Card';
import Button from '../componentes/Button';
import ProgresoCard from '../componentes/ProgresoCard';
import { Star, Settings, Target } from 'lucide-react';
import { recompensasService } from '../services/recompensas';

export default function RecompensasPage({ user }) {
  const [recompensasDisponibles, setRecompensasDisponibles] = useState([]);
  const [misRecompensas, setMisRecompensas] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [niveles, setNiveles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('disponibles');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [disponibles, misRecompensasData, estadisticasData, nivelesData] = await Promise.all([
        recompensasService.obtenerDisponibles(),
        recompensasService.obtenerMisRecompensas(),
        recompensasService.obtenerEstadisticas(),
        recompensasService.obtenerNiveles()
      ]);

      setRecompensasDisponibles(disponibles);
      setMisRecompensas(misRecompensasData);
      setEstadisticas(estadisticasData);
      setNiveles(nivelesData);
      setError('');
    } catch (error) {
      console.error('Error cargando recompensas:', error);
      setError('Error cargando las recompensas');
    } finally {
      setLoading(false);
    }
  };

  const reclamarRecompensa = async (recompensaId) => {
    try {
      await recompensasService.otorgar(recompensaId);
      await cargarDatos();

      const recompensa = recompensasDisponibles.find(r => r.recompensa_id === recompensaId);
      if (recompensa) {
        alert(`¡Felicidades! Has obtenido: ${recompensa.nombre}`);
      }
    } catch (error) {
      setError('Error reclamando la recompensa: ' + error.message);
    }
  };

  const verificarRecompensas = async () => {
    try {
      await recompensasService.verificarAutomaticas();
      await cargarDatos();
    } catch (error) {
      setError('Error verificando recompensas: ' + error.message);
    }
  };

  const getTipoColor = (tipo) => {
    const colors = {
      puntos: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      personalizacion: 'bg-purple-100 text-purple-800 border-purple-200',
      tecnica: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[tipo] || colors.puntos;
  };

  const getTipoIcon = (tipo) => {
    const icons = {
      puntos: <Star className="text-yellow-500" size={20} />,
      personalizacion: <Settings className="text-purple-500" size={20} />,
      tecnica: <Target className="text-blue-500" size={20} />
    };
    return icons[tipo] || icons.puntos;
  };

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 pt-20 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Sistema de Recompensas</h1>

        {/* Estadísticas y progreso */}
        {estadisticas && (
          <div className="mb-6">
            <ProgresoCard usuarioId={user.id_usuario} />
            <div className="mt-4">
              <p className="font-semibold">
                Nivel actual: {estadisticas.recompensas?.nivel_usuario || 'Principiante'}
              </p>
              <p>Puntos totales: {estadisticas.recompensas?.puntos || 0}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-4 border-b mb-6">
          <button
            onClick={() => setActiveTab('disponibles')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'disponibles' ? 'border-b-2 border-orange-500 text-orange-600' : ''
            }`}
          >
            Disponibles
          </button>
          <button
            onClick={() => setActiveTab('mis')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'mis' ? 'border-b-2 border-orange-500 text-orange-600' : ''
            }`}
          >
            Mis Recompensas
          </button>
        </div>

        {/* Contenido */}
        {loading ? (
          <p>Cargando recompensas...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeTab === 'disponibles' ? recompensasDisponibles : misRecompensas).map((r) => (
              <Card key={r.recompensa_id}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getTipoIcon(r.tipo)}
                    <div>
                      <h3 className="font-semibold">{r.nombre}</h3>
                      <div
                        className={`inline-block px-2 py-1 rounded-full text-xs border ${getTipoColor(
                          r.tipo
                        )}`}
                      >
                        {r.tipo}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{r.descripcion}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star size={16} className="text-yellow-500" />
                    <span className="text-sm font-medium">{r.valor} puntos</span>
                  </div>
                  {activeTab === 'disponibles' && (
                    <Button size="sm" onClick={() => reclamarRecompensa(r.recompensa_id)}>
                      Reclamar
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
