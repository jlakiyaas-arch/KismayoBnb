import api from './axios';

export const createBooking = (data) =>
  api.post('/bookings', data).then((res) => res.data);

export const getMyBookings = () => api.get('/bookings/my').then((res) => res.data);

export const getHostBookings = () => api.get('/bookings/host').then((res) => res.data);

export const cancelBooking = (id) =>
  api.patch(`/bookings/${id}/cancel`).then((res) => res.data);

export const checkAvailability = (propertyId, checkIn, checkOut) =>
  api
    .get(`/bookings/property/${propertyId}/availability`, {
      params: { checkIn, checkOut },
    })
    .then((res) => res.data);
