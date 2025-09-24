import { useEffect } from 'react';
import { recompensasService } from '../services/recompensas';
import { useAuth } from './useAuth';

export const useRecompensas = () => {
  const { user } = useAuth();

  const verificarRecompensas = async () => {
    if (!user) return;
    try {
      const resultado = await recompensasService.verificarAutomaticas();
      if (resultado?.recompensas_otorgadas?.length > 0) {
        resultado.recompensas_otorgadas.forEach(r =>
          console.log('¡Nueva recompensa obtenida!', r.nombre)
        );
      }
      return resultado;
    } catch (error) {
      console.error('Error verificando recompensas:', error);
    }
  };

  useEffect(() => {
    if (user) {
      verificarRecompensas();
      const interval = setInterval(verificarRecompensas, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [user]);

  return { verificarRecompensas };
};