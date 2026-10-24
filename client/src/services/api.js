const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
export class ApiError extends Error { constructor(message, status, code, details) { super(message); this.name = 'ApiError'; this.status = status; this.code = code; this.details = details || []; } }
export async function request(path, { method = 'GET', body, signal } = {}) {
  let response;
  try { response = await fetch(`${API_BASE}${path}`, { method, credentials: 'include', signal, headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined }); }
  catch (error) { if (error.name === 'AbortError') throw error; throw new ApiError('Unable to connect. Check your internet connection and try again.', 0, 'NETWORK_ERROR'); }
  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) { const error = data.error || {}; throw new ApiError(error.message || 'Something went wrong. Please try again.', response.status, error.code, error.details); }
  return data;
}
export const api = {
  me: () => request('/auth/me'), register: (payload) => request('/auth/register', { method: 'POST', body: payload }), login: (payload) => request('/auth/login', { method: 'POST', body: payload }), logout: () => request('/auth/logout', { method: 'POST' }),
  events: (params = {}, endpoint = '/events') => { const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value)); return request(`${endpoint}${query.size ? `?${query}` : ''}`); },
  event: (id) => request(`/events/${id}`), createEvent: (payload) => request('/events', { method: 'POST', body: payload }), updateEvent: (id, payload) => request(`/events/${id}`, { method: 'PATCH', body: payload }), deleteEvent: (id) => request(`/events/${id}`, { method: 'DELETE' }), saveEvent: (id) => request(`/events/${id}/save`, { method: 'POST' }), unsaveEvent: (id) => request(`/events/${id}/save`, { method: 'DELETE' })
};
