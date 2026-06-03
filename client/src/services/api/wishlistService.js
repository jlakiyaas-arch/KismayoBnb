import api from './axios';

export const getWishlist = () => api.get('/wishlist').then((res) => res.data);

export const checkWishlist = (propertyId) =>
  api.get(`/wishlist/check/${propertyId}`).then((res) => res.data);

export const addToWishlist = (propertyId) =>
  api.post(`/wishlist/${propertyId}`).then((res) => res.data);

export const removeFromWishlist = (propertyId) =>
  api.delete(`/wishlist/${propertyId}`).then((res) => res.data);
