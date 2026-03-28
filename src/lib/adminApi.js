const EDGE_URL = 'https://szzofkefbrqvsfkwojdj.supabase.co/functions/v1/admin-api';

let adminKey = null;
export function setAdminKey(key) { adminKey = key; }
export function getAdminKey() { return adminKey; }
export function clearAdminKey() { adminKey = null; }

async function api(path, options = {}) {
  const res = await fetch(`${EDGE_URL}${path}`, {
    ...options,
    headers: {
      'x-admin-key': adminKey,
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
    body: options.body instanceof FormData ? options.body : (options.body ? JSON.stringify(options.body) : undefined),
  });
  if (res.status === 401) throw new Error('unauthorized');
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}

// Animals
export const getAnimals = (params) => {
  const qs = new URLSearchParams(params).toString();
  return api(`/animals${qs ? '?' + qs : ''}`);
};
export const createAnimal = (body) => api('/animals', { method: 'POST', body });
export const updateAnimal = (id, body) => api(`/animals/${id}`, { method: 'PUT', body });
export const deleteAnimal = (id) => api(`/animals/${id}`, { method: 'DELETE' });
export const markAsSold = (id) => api(`/animals/${id}/sold`, { method: 'PUT' });

// Media (photos + videos)
export const uploadMedia = (animalId, file, isPrimary = false) => {
  const isVideo = file.type.startsWith('video/');
  const form = new FormData();
  form.append('file', file);
  form.append('animal_id', animalId);
  form.append('is_primary', isPrimary.toString());
  form.append('media_type', isVideo ? 'video' : 'photo');
  return api('/media/upload', { method: 'POST', body: form });
};
export const deleteMedia = (id) => api(`/media/${id}`, { method: 'DELETE' });
export const setPrimaryMedia = (mediaId, animalId) => api('/media/primary', { method: 'PUT', body: { media_id: mediaId, animal_id: animalId } });

// Contacts
export const getContacts = () => api('/contacts');
export const markContactRead = (id) => api(`/contacts/${id}/read`, { method: 'PUT' });

// Litters
export const getLitters = () => api('/litters');
export const createLitter = (body) => api('/litters', { method: 'POST', body });
export const deleteLitter = (id) => api(`/litters/${id}`, { method: 'DELETE' });

// Breeds
export const getBreeds = () => api('/breeds');

// Social
export const postToSocial = (animalId) => api(`/animals/${animalId}/social`, { method: 'POST' });
