import ApiService from './api';

export const pomodoroService = {
  async iniciar(configuracion) {
    return await ApiService.post('/productividad/pomodoro/iniciar', {
      duracion_trabajo: configuracion.tiempoTrabajo || 25,
      duracion_descanso: configuracion.tiempoDescanso || 5,
      ciclos_objetivo: configuracion.ciclosObjetivo || 4,
      modo_no_distraccion: configuracion.modoNoDistraccion || false
    });
  },

  async completarCiclo(sesionId, tipoCiclo) {
    return await ApiService.patch(`/productividad/pomodoro/${sesionId}/completar-ciclo`, {
      tipo_ciclo: tipoCiclo
    });
  },

  async finalizar(sesionId, completadoTotalmente = false) {
    return await ApiService.patch(`/productividad/pomodoro/${sesionId}/finalizar`, {
      completado_totalmente: completadoTotalmente
    });
  },

  async obtenerEstado(sesionId) {
    return await ApiService.get(`/productividad/pomodoro/${sesionId}/estado`);
  }
};