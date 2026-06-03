import api from './axios';

export const getProperties = (params = {}) =>
  api.get('/properties', { params }).then((res) => res.data);

export const getFeaturedProperties = (params = {}) =>
  api.get('/properties/featured', { params }).then((res) => res.data);

export const getPropertyById = (id) =>
  api.get(`/properties/${id}`).then((res) => res.data);

export const getMyProperties = () =>
  api.get('/properties/host/me').then((res) => res.data);

export const createProperty = (data) =>
  api.post('/properties', data).then((res) => res.data);

export const updateProperty = (id, data) =>
  api.put(`/properties/${id}`, data).then((res) => res.data);

export const deleteProperty = (id) =>
  api.delete(`/properties/${id}`).then((res) => res.data);
