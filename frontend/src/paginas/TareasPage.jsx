// src/paginas/TareasPage.jsx
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Button from '../componentes/Button';
import Card from '../componentes/Card';
import Modal from '../componentes/Modal';
import ProgresoCard from '../componentes/ProgresoCard';
import { Plus, Edit, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { tareasService } from '../services/tareas';
import { useRecompensas } from '../hooks/useRecompensas';

export default function TareasPage({ user }) {
  const [tareas, setTareas] = useState([]);
  const [listas, setListas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showListaModal, setShowListaModal] = useState(false);
  const [editingTarea, setEditingTarea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState({
    estado: '',
    prioridad: '',
    sala_id: ''
  });

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    prioridad: 'media',
    fecha_vencimiento: '',
    sala_id: ''
  });

  const [formLista, setFormLista] = useState({
    nombre: '',
    descripcion: '',
    fecha_limite: ''
  });

  const { verificarRecompensas } = useRecompensas();

  useEffect(() => {
    cargarDatos();
  }, [filtros]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [tareasData, listasData] = await Promise.all([
        tareasService.obtenerTareas(filtros),
        tareasService.obtenerListas()
      ]);
      
      setTareas(tareasData);
      setListas(listasData.listas || []);
      setError('');
    } catch (error) {
      console.error('Error cargando datos:', error);
      setError('Error cargando las tareas');
    } finally {
      setLoading(false);
    }
  };

  const crearTarea = async () => {
    try {
      const nuevaTarea = await tareasService.crearTarea(formData);
      setTareas(prev => [nuevaTarea, ...prev]);
      setShowModal(false);
      resetForm();
    } catch (error) {
      setError('Error creando la tarea: ' + error.message);
    }
  };

  const actualizarTarea = async () => {
    try {
      const tareaActualizada = await tareasService.actualizarTarea(
        editingTarea.tarea_id, 
        formData
      );
      setTareas(prev => prev.map(t => 
        t.tarea_id === editingTarea.tarea_id ? tareaActualizada : t
      ));
      setShowModal(false);
      resetForm();
    } catch (error) {
      setError('Error actualizando la tarea: ' + error.message);
    }
  };

  const eliminarTarea = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      return;
    }

    try {
      await tareasService.eliminarTarea(id);
      setTareas(prev => prev.filter(t => t.tarea_id !== id));
    } catch (error) {
      setError('Error eliminando la tarea: ' + error.message);
    }
  };

  const completarTarea = async (tarea) => {
    try {
      const hoy = new Date();
      const fechaVencimiento = tarea.fecha_vencimiento ? new Date(tarea.fecha_vencimiento) : null;
      
      let resultado;
      if (fechaVencimiento && hoy < fechaVencimiento) {
        resultado = await tareasService.completarTareaAnticipadamente(tarea.tarea_id);
      } else {
        resultado = await tareasService.completarTarea(tarea.tarea_id);
      }
      
      setTareas(prev => prev.map(t => 
        t.tarea_id === tarea.tarea_id 
          ? { ...t, estado: 'Completado' }
          : t
      ));
      
      await verificarRecompensas();
      
      if (resultado.completada_anticipadamente) {
        alert(`¡Excelente! Completaste la tarea ${resultado.dias_anticipados} días antes de tiempo.`);
      }
    } catch (error) {
      setError('Error completando la tarea: ' + error.message);
    }
  };

  const crearLista = async () => {
    try {
      const nuevaLista = await tareasService.crearLista(
        formLista.nombre,
        formLista.descripcion,
        formLista.fecha_limite || null
      );
      setListas(prev => [...prev, nuevaLista]);
      setShowListaModal(false);
      setFormLista({ nombre: '', descripcion: '', fecha_limite: '' });
    } catch (error) {
      setError('Error creando la lista: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      prioridad: 'media',
      fecha_vencimiento: '',
      sala_id: ''
    });
    setEditingTarea(null);
  };

  const handleEdit = (tarea) => {
    setEditingTarea(tarea);
    setFormData({
      titulo: tarea.titulo,
      descripcion: tarea.descripcion || '',
      prioridad: tarea.prioridad,
      fecha_vencimiento: tarea.fecha_vencimiento || '',
      sala_id: tarea.sala_id || ''
    });
    setShowModal(true);
  };

  const getPrioridadColor = (prioridad) => {
    const colors = {
      alta: 'bg-red-100 text-red-800 border-red-200',
      media: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      baja: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[prioridad] || colors.media;
  };

  const getPrioridadIcon = (prioridad) => {
    const icons = {
      alta: <AlertCircle size={16} className="text-red-500" />,
      media: <Clock size={16} className="text-yellow-500" />,
      baja: <CheckCircle size={16} className="text-green-500" />
    };
    return icons[prioridad] || icons.media;
  };

  const esVencida = (tarea) => {
    if (!tarea.fecha_vencimiento || tarea.estado === 'Completado') return false;
    return new Date(tarea.fecha_vencimiento) < new Date();
  };

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8">
      {/* Aquí ya puedes renderizar la UI de tareas y listas como en tu versión anterior */}
    </div>
  );
}
