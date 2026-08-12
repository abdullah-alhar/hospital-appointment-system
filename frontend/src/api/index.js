import client from './client';

export const authApi = {
  login: (data) => client.post('/auth/login', data).then((r) => r.data),
};

export const patientApi = {
  create: (data) => client.post('/patients', data).then((r) => r.data),
  getAll: () => client.get('/patients').then((r) => r.data),
  getById: (id) => client.get(`/patients/${id}`).then((r) => r.data),
  update: (id, data) => client.put(`/patients/${id}`, data).then((r) => r.data),
  remove: (id) => client.delete(`/patients/${id}`),
  changePassword: (id, data) => client.put(`/patients/${id}/password`, data).then((r) => r.data),
};

export const doctorApi = {
  create: (data) => client.post('/doctors', data).then((r) => r.data),
  getAll: () => client.get('/doctors').then((r) => r.data),
  getById: (id) => client.get(`/doctors/${id}`).then((r) => r.data),
  update: (id, data) => client.put(`/doctors/${id}`, data).then((r) => r.data),
  remove: (id) => client.delete(`/doctors/${id}`),
  changePassword: (id, data) => client.put(`/doctors/${id}/password`, data).then((r) => r.data),
};

export const adminApi = {
  create: (data) => client.post('/admins', data).then((r) => r.data),
  getAll: () => client.get('/admins').then((r) => r.data),
  getById: (id) => client.get(`/admins/${id}`).then((r) => r.data),
  update: (id, data) => client.put(`/admins/${id}`, data).then((r) => r.data),
  remove: (id) => client.delete(`/admins/${id}`),
  changePassword: (id, data) => client.put(`/admins/${id}/password`, data).then((r) => r.data),
};

export const scheduleApi = {
  create: (data) => client.post('/schedules', data).then((r) => r.data),
  getAll: () => client.get('/schedules').then((r) => r.data),
  getById: (id) => client.get(`/schedules/${id}`).then((r) => r.data),
  getByDoctor: (doctorId) => client.get(`/schedules/doctor/${doctorId}`).then((r) => r.data),
  remove: (id) => client.delete(`/schedules/${id}`),
};

export const appointmentApi = {
  create: (data) => client.post('/appointments', data).then((r) => r.data),
  getAll: () => client.get('/appointments').then((r) => r.data),
  getById: (id) => client.get(`/appointments/${id}`).then((r) => r.data),
  cancel: (id) => client.put(`/appointments/${id}/cancel`).then((r) => r.data),
};
