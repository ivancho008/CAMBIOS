import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Card from '../componentes/Card';
import ProgresoCard from '../componentes/ProgresoCard';
import { Clock, Star, CheckCircle, Users } from 'lucide-react';

export default function ConcentracionPage({ user }) {
  const navigate = useNavigate();

  if (!user) return <Navigate to="/" replace />; // redirige al home si no hay user

  const tecnicas = [
    { nombre: 'Pomodoro', icono: <Clock size={40}/>, page: '/pomodoro' },
    { nombre: 'Meditación', icono: <Star size={40}/>, page: '/meditacion' },
    { nombre: 'Tareas', icono: <CheckCircle size={40}/>, page: '/tareas' },
    { nombre: 'Sesión Grupal', icono: <Users size={40}/>, page: '/sesion' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sesión de Concentración</h1>
      <div className="mb-8">
        <ProgresoCard usuarioId={user.id_usuario}/>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tecnicas.map(t => (
          <Card
            key={t.nombre}
            className="text-center hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer"
            onClick={() => navigate(t.page)}
          >
            <div className="text-purple-600 mb-4 flex justify-center">{t.icono}</div>
            <h3 className="text-xl font-semibold">{t.nombre}</h3>
          </Card>
        ))}
      </div>
    </div>
  );
}
