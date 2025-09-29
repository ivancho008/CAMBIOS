import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../componentes/Navbar.jsx';

export default function DashboardPage({ user, onAuthClick, onLogout }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0e7ff] to-[#f3f0ff] text-gray-800 pt-20 pb-8">
      <Navbar user={user} onAuthClick={onAuthClick} onLogout={onLogout} />
      <div className="max-w-5xl mx-auto px-4 pt-24">

        <div className="mb-8 p-8 bg-white/80 rounded-xl shadow">
          <h1 className="text-3xl font-bold mb-2">¡Buenas tardes, {user?.nombre || 'Usuario'}! <span className="ml-2">👋</span></h1>
          <p className="mb-4">Aquí podrás encontrar las siguientes <span className="text-purple-600 font-semibold">técnicas de estudio</span> diseñadas para maximizar tu productividad y concentración.</p>
          <div className="flex space-x-2 mb-4">
            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">Nivel: Principiante</span>
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">Racha: 3 días</span>
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">Hoy: 45 min</span>
          </div>
          <div className="flex justify-end text-right text-purple-700 font-bold text-lg">
            <div>
              <div className="text-2xl">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              <div className="text-xs">{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center">Elige tu Técnica de Estudio</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-white border-t-4 border-pink-400 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-2 text-pink-600">Técnica Pomodoro</h3>
            <p className="mb-2">Trabaja en intervalos de 25 minutos con descansos de 5 minutos para mantener tu concentración al máximo.</p>
            <ul className="mb-4 text-sm list-disc pl-5">
              <li>Timer automático</li>
              <li>Descansos programados</li>
              <li>Estadísticas detalladas</li>
            </ul>
            <Link to="/pomodoro" className="block">
              <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full font-semibold w-full">Iniciar Sesión</button>
            </Link>
          </div>
          <div className="p-6 bg-white border-t-4 border-blue-400 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-2 text-blue-600">Concentración Profunda</h3>
            <p className="mb-2">Técnicas de meditación y respiración para eliminar distracciones y entrar en estado de flow.</p>
            <ul className="mb-4 text-sm list-disc pl-5">
              <li>Meditación guiada</li>
              <li>Bloqueador de distracciones</li>
              <li>Ejercicios de respiración</li>
            </ul>
            <Link to="/meditacion" className="block">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-semibold w-full">Iniciar Sesión</button>
            </Link>
          </div>
          <div className="p-6 bg-white border-t-4 border-green-400 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-2 text-green-600">Todo List Inteligente</h3>
            <p className="mb-2">Organiza tus tareas con nuestro sistema de recompensas que te motiva a completar tus objetivos.</p>
            <ul className="mb-4 text-sm list-disc pl-5">
              <li>Sistema de recompensas</li>
              <li>Priorización automática</li>
              <li>Seguimiento de progreso</li>
            </ul>
            <Link to="/tareas" className="block">
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-semibold w-full">Ver Todo List</button>
            </Link>
          </div>
          <div className="p-6 bg-white border-t-4 border-purple-400 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-2 text-purple-600">Estudio en Grupo</h3>
            <p className="mb-2">Conecta con otros estudiantes, crea salas de estudio virtuales y aprende de forma colaborativa.</p>
            <ul className="mb-4 text-sm list-disc pl-5">
              <li>Salas virtuales</li>
              <li>Chat en tiempo real</li>
              <li>Sesiones programadas</li>
            </ul>
            <Link to="/sesiones" className="block">
              <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-full font-semibold w-full">Unirse a Grupo</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
