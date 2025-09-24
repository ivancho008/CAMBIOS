import ApiService from './api';

export const progresoService = {
  async obtenerProgresoHoy() {
    return await ApiService.get('/progreso/hoy');
  },

  async obtenerProgresoSemana() {
    return await ApiService.get('/progreso/semana');
  },

  async obtenerProgresoMes(año = null, mes = null) {
    const params = new URLSearchParams();
    if (año) params.append('año', año);
    if (mes) params.append('mes', mes);
    
    return await ApiService.get(`/progreso/mes${params.toString() ? `?${params}` : ''}`);
  },

  async actualizarProgreso() {
    return await ApiService.post('/progreso/actualizar');
  },

  async obtenerEstadisticasGenerales() {
    return await ApiService.get('/progreso/estadisticas-generales');
  }
};