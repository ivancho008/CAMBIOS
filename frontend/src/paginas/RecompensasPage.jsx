import React, { useState } from 'react';
import Card from '../componentes/Card';
import Button from '../componentes/Button';
import ProgresoCard from '../componentes/ProgresoCard';
import { Star, Settings, Target, Gift } from 'lucide-react';

export default function RecompensasPage({ user, onNavigate }) {
const [recompensas] = useState([
{ id_recompensa: '1', nombre: 'Maestro del Pomodoro', descripcion: 'Completa 50 sesiones de Pomodoro', tipo: 'tecnica', valor: 100, requisitos: { sesiones_pomodoro: 50 } },
{ id_recompensa: '2', nombre: 'Organizador Experto', descripcion: 'Completa 20 tareas', tipo: 'puntos', valor: 50, requisitos: { tareas_completadas: 20 } }
]);


if (!user) { onNavigate('home'); return null; }


const getTipoColor = (tipo) => tipo === 'puntos' ? 'bg-yellow-100 text-yellow-800' : tipo === 'personalizacion' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
const getTipoIcon = (tipo) => tipo === 'puntos' ? <Star className="text-yellow-500" size={20}/> : tipo === 'personalizacion' ? <Settings className="text-purple-500" size={20}/> : <Target className="text-blue-500" size={20}/>;


return (
<div className="max-w-6xl mx-auto px-4 py-8">
<h1 className="text-3xl font-bold mb-8">Sistema de Recompensas</h1>
<ProgresoCard usuarioId={user.id_usuario}/>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
{recompensas.map(r => (
<Card key={r.id_recompensa}>
<div className="flex items-start justify-between mb-4">
<div className="flex items-center gap-3">
{getTipoIcon(r.tipo)}
<div>
<h3 className="font-semibold">{r.nombre}</h3>
<div className={`inline-block px-2 py-1 rounded-full text-xs ${getTipoColor(r.tipo)}`}>{r.tipo}</div>
</div>
</div>
</div>
<p className="text-gray-600 mb-4">{r.descripcion}</p>
{r.requisitos && <div className="mb-4"><h4 className="font-medium text-sm mb-2">Requisitos:</h4><ul className="text-sm text-gray-600 space-y-1">{Object.entries(r.requisitos).map(([k, v]) => (<li key={k}>• {k.replace('_',' ')}: {v}</li>))}</ul></div>}
<div className="flex items-center justify-between">
<div className="flex items-center gap-2"><Star size={16} className="text-yellow-500"/><span className="text-sm font-medium">{r.valor} puntos</span></div>
<Button size="sm">Reclamar</Button>
</div>
</Card>
))}
</div>
</div>
);
}