// src/paginas/SesionGrupalPage.jsx
import React, { useState } from 'react';
import Button from '../componentes/Button.jsx';
import Card from '../componentes/Card.jsx';
import Modal from '../componentes/Modal.jsx';
import { Plus, Users } from 'react-feather';
import ProgresoCard from '../componentes/ProgresoCard.jsx';

const SesionGrupalPage = ({ user }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [salasActivas, setSalasActivas] = useState([
    {
      id_sala: '1',
      nombre: 'Estudio Matutino',
      tecnica: 'Pomodoro',
      duracion: '25 min',
      participantes: 5,
      maxParticipantes: 8,
    },
  ]);

  const unirseASala = (id) => {
    // Lógica para unirse a una sala
    console.log("Unirse a sala con id:", id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Sesiones Grupales</h1>

        {/* Solo mostrar progreso si hay usuario */}
        {user && <ProgresoCard usuarioId={user.id_usuario} />}

        <div className="flex space-x-4 mb-8 justify-center">
          <Button onClick={() => setShowJoinModal(true)} className="bg-blue-500 hover:bg-blue-600">
            <Users size={18} className="mr-2" /> Unirse a Sala
          </Button>
          <Button onClick={() => setShowCreateModal(true)} className="bg-green-500 hover:bg-green-600">
            <Plus size={18} className="mr-2" /> Crear Sala
          </Button>
        </div>

        {/* Mostrar las salas activas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {salasActivas.map((sala) => (
            <Card key={sala.id_sala} className="p-6">
              <h3 className="text-xl font-semibold mb-2">{sala.nombre}</h3>
              <p className="text-gray-600 mb-2">{sala.tecnica} — {sala.duracion}</p>
              <p className="text-sm text-gray-500 mb-4">
                Participantes: {sala.participantes}/{sala.maxParticipantes}
              </p>
              <Button onClick={() => unirseASala(sala.id_sala)} className="w-full">
                <Users size={16} className="mr-2" /> Unirse
              </Button>
            </Card>
          ))}
        </div>

        {/* Modal Crear Sala */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Crear Sala"
        >
          <form>
            <input
              type="text"
              placeholder="Nombre de la sala"
              className="w-full px-4 py-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Button type="submit" className="w-full">
              Crear Sala
            </Button>
          </form>
        </Modal>

        {/* Modal Unirse a Sala */}
        <Modal
          isOpen={showJoinModal}
          onClose={() => setShowJoinModal(false)}
          title="Unirse a Sala"
        >
          <p className="text-gray-600">Selecciona una sala disponible para unirte.</p>
          {salasActivas.map((sala) => (
            <Button
              key={sala.id_sala}
              onClick={() => unirseASala(sala.id_sala)}
              className="w-full mb-2"
            >
              <Users size={16} className="mr-2" /> {sala.nombre}
            </Button>
          ))}
        </Modal>
      </div>
    </div>
  );
};

export default SesionGrupalPage;
