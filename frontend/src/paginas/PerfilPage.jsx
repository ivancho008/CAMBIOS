// src/paginas/PerfilPage.jsx
import React, { useState } from 'react';
import Button from '../componentes/Button.jsx';
import Card from '../componentes/Card.jsx';
import ProgressBar from '../componentes/ProgresoBar.jsx';
import Modal from '../componentes/Modal.jsx';
import ProgresoCard from '../componentes/ProgresoCard.jsx';
import { Edit, CheckCircle } from 'react-feather';

const PerfilPage = ({ user }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [perfilData, setPerfilData] = useState({
    Username: user?.Username || 'Invitado',
    correo: user?.correo || 'correo@ejemplo.com',
    nivel: 5,
    progresoNivel: 75,
    racha: 7,
    tiempoTotal: '45h 30m',
    fechaUnion: '2024-01-15'
  });

  const [preferenciasData, setPreferenciasData] = useState({
    metaDiaria: 120, // minutos
    horarioPreferido: 'mañana'
  });

  const actualizarPerfil = (e) => {
    e.preventDefault();
    setPerfilData((prev) => ({
      ...prev,
      Username: perfilData.Username,
      correo: perfilData.correo
    }));
    setPreferenciasData({
      metaDiaria: preferenciasData.metaDiaria,
      horarioPreferido: preferenciasData.horarioPreferido
    });
    setShowEditModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white.">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Mi Perfil</h1>

        {/* ProgresoCard solo si hay usuario */}
        {user && <ProgresoCard usuarioId={user.id_usuario} />}

        {/* Información del Perfil */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Información Personal</h2>
            <Button onClick={() => setShowEditModal(true)}>
              <Edit size={18} className="mr-2" /> Editar
            </Button>
          </div>
          <p><strong>Usuario:</strong> {perfilData.Username}</p>
          <p><strong>Correo:</strong> {perfilData.correo}</p>
          <p><strong>Nivel:</strong> {perfilData.nivel}</p>
          <ProgressBar progreso={perfilData.progresoNivel} />
        </Card>

        {/* Estadísticas */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">📊 Estadísticas</h2>
          <p><strong>Racha actual:</strong> {perfilData.racha} días</p>
          <p><strong>Tiempo total:</strong> {perfilData.tiempoTotal}</p>
          <p><strong>Miembro desde:</strong> {perfilData.fechaUnion}</p>
        </Card>

        {/* Preferencias */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">⚙️ Preferencias</h2>
          <p><strong>Meta diaria:</strong> {preferenciasData.metaDiaria} min</p>
          <p><strong>Horario preferido:</strong> {preferenciasData.horarioPreferido}</p>
        </Card>

        {/* Modal para editar perfil */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Editar Perfil"
        >
          <form onSubmit={actualizarPerfil} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Usuario</label>
              <input
                type="text"
                value={perfilData.Username}
                onChange={(e) => setPerfilData({ ...perfilData, Username: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Correo</label>
              <input
                type="email"
                value={perfilData.correo}
                onChange={(e) => setPerfilData({ ...perfilData, correo: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <Button type="submit" className="bg-green-500 hover:bg-green-600">
                <CheckCircle size={18} className="mr-2" /> Guardar
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowEditModal(false)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default PerfilPage;
