import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';

export default function AuthModal({ isOpen, onClose, onLogin, onRegister }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({ correo: '', password: '', username: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLoginMode) {
        await onLogin(formData.correo, formData.password);
      } else {
        await onRegister(formData);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isLoginMode ? 'Iniciar Sesión' : 'Registrarse'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {!isLoginMode && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de Usuario
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required={!isLoginMode}
              disabled={loading}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
            disabled={loading}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading
            ? 'Procesando...'
            : isLoginMode
            ? 'Iniciar Sesión'
            : 'Registrarse'}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-purple-600 hover:text-purple-800 text-sm"
            disabled={loading}
          >
            {isLoginMode
              ? '¿No tienes cuenta? Regístrate'
              : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
