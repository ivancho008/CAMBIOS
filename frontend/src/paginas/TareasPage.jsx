import React, { useState } from 'react';
import Button from '../componentes/Button';
import Card from '../componentes/Card';
import Modal from '../componentes/Modal';
import ProgresoCard from '../componentes/ProgresoCard';
import { Plus, Edit, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function TareasPage({ user, onNavigate }) {
const [tareas, setTareas] = useState([
{ id_tarea: '1', titulo: 'Estudiar React', descripcion: 'Completar tutorial de componentes', prioridad: 'alta', completada: false, fecha_vencimiento: '2024-12-31' },
{ id_tarea: '2', titulo: 'Ejercicio diario', descripcion: '30 minutos de caminata', prioridad: 'media', completada: true, fecha_vencimiento: '2024-12-18' }
]);
const [showModal, setShowModal] = useState(false);
const [editingTarea, setEditingTarea] = useState(null);
const [formData, setFormData] = useState({ titulo: '', descripcion: '', prioridad: 'media', fecha_vencimiento: '' });


if (!user) { onNavigate('home'); return null; }


const crearTarea = () => {
const nuevaTarea = { id_tarea: Date.now().toString(), ...formData, completada: false };
setTareas(prev => [...prev, nuevaTarea]);
setShowModal(false);
resetForm();
};

const actualizarTarea = () => {
setTareas(prev => prev.map(t => t.id_tarea === editingTarea.id_tarea ? { ...t, ...formData } : t));
setShowModal(false);
resetForm();
};
const eliminarTarea = (id) => { if (window.confirm('¿Eliminar tarea?')) setTareas(prev => prev.filter(t => t.id_tarea !== id)); };
const completarTarea = (id) => { setTareas(prev => prev.map(t => t.id_tarea === id ? { ...t, completada: !t.completada } : t)); };
const resetForm = () => { setFormData({ titulo: '', descripcion: '', prioridad: 'media', fecha_vencimiento: '' }); setEditingTarea(null); };
const handleEdit = (t) => { setEditingTarea(t); setFormData({ titulo: t.titulo, descripcion: t.descripcion || '', prioridad: t.prioridad, fecha_vencimiento: t.fecha_vencimiento || '' }); setShowModal(true); };


const getPrioridadColor = (p) => p === 'alta' ? 'bg-red-100 text-red-800' : p === 'media' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800';
const getPrioridadIcon = (p) => p === 'alta' ? <AlertCircle size={16} className="text-red-500"/> : p === 'media' ? <Clock size={16} className="text-yellow-500"/> : <CheckCircle size={16} className="text-green-500"/>;


return (
<div className="max-w-6xl mx-auto px-4 py-8">
<div className="flex justify-between items-center mb-8">
<h1 className="text-3xl font-bold">Gestión de Tareas</h1>
<Button onClick={() => setShowModal(true)}><Plus size={20}/> Nueva Tarea</Button>
</div>
<ProgresoCard usuarioId={user.id_usuario}/>
<div className="grid gap-4 mt-8">
{tareas.map(t => (
<Card key={t.id_tarea} className={`${t.completada ? 'opacity-60' : ''}`}>
<div className="flex items-start justify-between">
<div className="flex-1">
<div className="flex items-center gap-3 mb-2">
<h3 className={`text-lg font-semibold ${t.completada ? 'line-through' : ''}`}>{t.titulo}</h3>
<div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getPrioridadColor(t.prioridad)}`}>{getPrioridadIcon(t.prioridad)}{t.prioridad}</div>
{t.completada && <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Completada</div>}
</div>
{t.descripcion && <p className="text-gray-600 mb-2">{t.descripcion}</p>}
{t.fecha_vencimiento && <p className="text-sm text-gray-500">Vence: {new Date(t.fecha_vencimiento).toLocaleDateString()}</p>}
</div>
<div className="flex gap-2">
{!t.completada && <Button size="sm" variant="success" onClick={() => completarTarea(t.id_tarea)}><CheckCircle size={16}/></Button>}
<Button size="sm" variant="outline" onClick={() => handleEdit(t)}><Edit size={16}/></Button>
<Button size="sm" variant="danger" onClick={() => eliminarTarea(t.id_tarea)}><Trash2 size={16}/></Button>
</div>
</div>
</Card>
))}
{tareas.length === 0 && <Card className="text-center py-8"><p className="text-gray-500 mb-4">No tienes tareas creadas aún</p><Button onClick={() => setShowModal(true)}>Crear tu primera tarea</Button></Card>}
</div>
<Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm(); }} title={editingTarea ? 'Editar Tarea' : 'Nueva Tarea'}>
<form onSubmit={(e) => { e.preventDefault(); editingTarea ? actualizarTarea() : crearTarea(); }} className="space-y-4">
<input type="text" value={formData.titulo} onChange={(e) => setFormData({ ...formData, titulo: e.target.value })} placeholder="Título" required className="w-full px-3 py-2 border rounded-md"/>
<textarea value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} placeholder="Descripción" className="w-full px-3 py-2 border rounded-md"/>
<select value={formData.prioridad} onChange={(e) => setFormData({ ...formData, prioridad: e.target.value })} className="w-full px-3 py-2 border rounded-md">
<option value="baja">Baja</option><option value="media">Media</option><option value="alta">Alta</option>
</select>
<input type="date" value={formData.fecha_vencimiento} onChange={(e) => setFormData({ ...formData, fecha_vencimiento: e.target.value })} className="w-full px-3 py-2 border rounded-md"/>
<div className="flex gap-2"><Button type="submit" className="flex-1">{editingTarea ? 'Actualizar' : 'Crear'} Tarea</Button><Button type="button" variant="secondary" onClick={() => { setShowModal(false); resetForm(); }}>Cancelar</Button></div>
</form>
</Modal>
</div>
);
}