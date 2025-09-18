import React from 'react';
import { createRoot } from 'react-dom/client';
import SynapseApp from './App';
import './index.css'; // Tailwind o estilos globales

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <SynapseApp />
    </React.StrictMode>
);
