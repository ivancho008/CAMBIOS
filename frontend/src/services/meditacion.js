import ApiService from './api';

export const meditacionService = {
  async iniciar(duracion, tipoMeditacion) {
    return await ApiService.post('/bienestar/meditacion/iniciar', {
      duracion: duracion,
      tipo_meditacion: tipoMeditacion
    });
  },

  async finalizar(sesionId, completada = true, calificacion = null) {
    return await ApiService.patch(`/bienestar/meditacion/${sesionId}/finalizar`, {
      completada,
      calificacion
    });
  },

  async obtenerTipos() {
    return await ApiService.get('/bienestar/meditacion/tipos');
  },

  async obtenerHistorial(limite = 20) {
    return await ApiService.get(`/bienestar/meditacion/historial?limite=${limite}`);
  }
};