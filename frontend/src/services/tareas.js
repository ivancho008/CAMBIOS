import ApiService from './api';

export const tareasService = {
  async obtenerTareas(filtros = {}) {
    const params = new URLSearchParams(filtros).toString();
    return await ApiService.get(`/tareas${params ? `?${params}` : ''}`);
  },

  async crearTarea(tarea) {
    return await ApiService.post('/tareas', tarea);
  },

  async actualizarTarea(tareaId, datos) {
    return await ApiService.put(`/tareas/${tareaId}`, datos);
  },

  async eliminarTarea(tareaId) {
    return await ApiService.delete(`/tareas/${tareaId}`);
  },

  async completarTarea(tareaId) {
    return await ApiService.patch(`/tareas/${tareaId}/completar`);
  },

  async completarTareaAnticipadamente(tareaId) {
    return await ApiService.patch(`/listas/todo/tarea/${tareaId}/completar-anticipadamente`);
  },

  async obtenerEstadisticas() {
    return await ApiService.get('/tareas/estadisticas');
  },

  // TODO Lists
  async obtenerListas() {
    return await ApiService.get('/listas/todo/listas');
  },

  async crearLista(nombre, descripcion, fechaLimite) {
    return await ApiService.post('/listas/todo/lista', {
      nombre,
      descripcion,
      fecha_limite: fechaLimite
    });
  }
};