import React, { useState } from 'react';
import Card from '../componentes/Card';
import Button from '../componentes/Button';
import Modal from '../componentes/Modal';
import { Gift, Plus, Trash2 } from 'lucide-react';

export default function RecompensasPage({ user }) {
  // Lista de recompensas del usuario
  const [recompensas, setRecompensas] = useState([
    { id: 1, titulo: 'Ver un capítulo de mi serie', costo: 3 },
    { id: 2, titulo: 'Jugar 30 min', costo: 5 },
  ]);

  // Control del modal para crear recompensa
  const [showModal, setShowModal] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [costo, setCosto] = useState('');

  const agregarRecompensa = () => {
    if (!titulo.trim() || !costo) return;
    setRecompensas((prev) => [
      ...prev,
      { id: Date.now(), titulo: titulo.trim(), costo: parseInt(costo) },
    ]);
    setTitulo('');
    setCosto('');
    setShowModal(false);
  };

  const eliminarRecompensa = (id) =>
    setRecompensas((prev) => prev.filter((r) => r.id !== id));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Gift size={28} className="text-purple-600" />
        Recompensas
      </h1>

      {/* Si hay usuario, aquí podrías mostrar puntos disponibles */}
      {user && (
        <div className="mb-6 text-lg font-semibold text-gray-700">
          Puntos disponibles: <span className="text-purple-600">12</span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {recompensas.map((r) => (
          <Card key={r.id} className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">{r.titulo}</h3>
              <p className="text-gray-600">Costo: {r.costo} puntos</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => eliminarRecompensa(r.id)}
            >
              <Trash2 size={16} /> Eliminar
            </Button>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button onClick={() => setShowModal(true)}>
          <Plus size={20} /> Añadir Recompensa
        </Button>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Nueva Recompensa"
      >
        <div className="space-y-4">
          <label className="block">
            Título
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </label>
          <label className="block">
            Costo (puntos)
            <input
              type="number"
              value={costo}
              onChange={(e) => setCosto(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </label>
          <Button onClick={agregarRecompensa}>Guardar</Button>
        </div>
      </Modal>
    </div>
  );
}
