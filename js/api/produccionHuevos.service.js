import { request } from './apiClient.js';

export const produccionHuevosService = {
  CreateProduccionHuevos: (data) => {
    return request('/produccion-huevos/crear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },

  GetProduccionHuevosById: (produccion_id) => {
    return request(`/produccion-huevos/by-id/${produccion_id}`);
  },

  UpdateProduccionHuevos: (id, data) => {
    return request(`/produccion-huevos/by-id/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',  // 👈 importante
      },
      body: JSON.stringify(data),
    });
  },

  GetProduccionHuevosAll: ({ page = 1, limit = 10, fecha_inicio = null, fecha_fin = null } ={}) => {
  const offset = (page - 1) * limit;

  return request('/produccion-huevos/all', {
    params: { limit, offset, fecha_inicio, fecha_fin }
  });
}




};
