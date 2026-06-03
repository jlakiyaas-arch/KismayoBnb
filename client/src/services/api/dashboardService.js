import api from './axios';

export const getHostStats = () => api.get('/dashboard/host/stats').then((res) => res.data);
