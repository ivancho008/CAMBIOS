import React, { useState, useEffect } from 'react';
import Card from './Card';


export default function ProgresoCard({ usuarioId }) {
const [progreso, setProgreso] = useState({ tareas_completadas: 5, sesiones_completadas: 3, puntos_acumulados: 150 });
useEffect(() => {
if (usuarioId) {
setProgreso({
tareas_completadas: Math.floor(Math.random() * 10),
sesiones_completadas: Math.floor(Math.random() * 8),
puntos_acumulados: Math.floor(Math.random() * 500)
});
}
}, [usuarioId]);
return (
<Card className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white">
<h3 className="text-2xl font-bold mb-4">Tu Progreso de Hoy</h3>
<div className="grid grid-cols-3 gap-4">
<div className="text-center"><div className="text-3xl font-bold">{progreso.tareas_completadas}</div><div className="text-sm opacity-80">Tareas</div></div>
<div className="text-center"><div className="text-3xl font-bold">{progreso.sesiones_completadas}</div><div className="text-sm opacity-80">Sesiones</div></div>
<div className="text-center"><div className="text-3xl font-bold">{progreso.puntos_acumulados}</div><div className="text-sm opacity-80">Puntos</div></div>
</div>
</Card>
);
}