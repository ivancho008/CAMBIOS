import ApiService from './api';

export const recompensasService = {
  async obtenerRecompensas(tipo = null) {
    const params = tipo ? `?tipo=${tipo}` : '';
    return await ApiService.get(`/recompensas${params}`);
  },

  async obtenerMisRecompensas() {
    return await ApiService.get('/recompensas/mis-recompensas');
  },

  async obtenerDisponibles() {
    return await ApiService.get('/recompensas/disponibles');
  },

  async otorgar(recompensaId) {
    return await ApiService.post('/recompensas/otorgar', {
      recompensa_id: recompensaId
    });
  },

  async verificarAutomaticas() {
    return await ApiService.post('/gamificacion/recompensas/verificar-automaticas');
  },

  async obtenerEstadisticas() {
    return await ApiService.get('/gamificacion/recompensas/usuario/estadisticas');
  },

  async obtenerNiveles() {
    return await ApiService.get('/gamificacion/recompensas/niveles');
  }
};