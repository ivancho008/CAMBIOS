import React, { useState } from 'react';
import Button from '../componentes/Button';
import Card from '../componentes/Card';

export default function HomePage({ user, onAuthClick, onNavigate }) {
const [tecnicas] = useState([
{ id: 1, nombre: 'Pomodoro', descripcion: 'Técnica de gestión del tiempo', categoria: 'concentracion' },
{ id: 2, nombre: 'Meditación', descripcion: 'Práctica de mindfulness', categoria: 'relajacion' },
{ id: 3, nombre: 'Estudio Profundo', descripcion: 'Concentración intensa', categoria: 'concentracion' }
]);


const handleExplorarTecnicas = () => { if (user) onNavigate('concentracion'); else onAuthClick(); };


return (
<div className="min-h-screen">
<section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20 text-center">
<h1 className="text-5xl font-bold mb-6">Bienvenido a Synapse</h1>
<p className="text-xl mb-8">Potencia tu productividad con técnicas de concentración avanzadas</p>
{!user ? (
<div className="space-x-4">
<Button size="lg" onClick={onAuthClick}>Registrarse</Button>
<Button variant="outline" size="lg" onClick={onAuthClick}>Iniciar Sesión</Button>
</div>
) : (
<div>
<h2 className="text-2xl mb-4">¡Hola, {user.Username || 'Usuario'}!</h2>
<Button size="lg" onClick={() => onNavigate('concentracion')}>Continuar estudiando</Button>
</div>
)}
</section>


<section className="py-16 max-w-7xl mx-auto px-4">
<h2 className="text-3xl font-bold text-center mb-12">Técnicas Disponibles</h2>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
{tecnicas.map(t => (
<Card key={t.id} className="text-center hover:shadow-lg transition-shadow">
<h3 className="text-xl font-semibold mb-2">{t.nombre}</h3>
<p className="text-gray-600 mb-4">{t.descripcion}</p>
<div className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">{t.categoria}</div>
</Card>
))}
</div>
<div className="text-center">
<Button onClick={handleExplorarTecnicas}>Explorar Todas las Técnicas</Button>
</div>
</section>
</div>
);
}