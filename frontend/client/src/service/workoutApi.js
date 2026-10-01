import { supabase } from '../supabaseClient';

const API_URL = `${import.meta.env.VITE_API_URL}/api/items`;

// võtame guesti tokeni
async function authHeaders() {
  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session) {
    throw new Error('Guest session unavailable');
  }

  return { Authorization: `Bearer ${data.session.access_token}` };
}

// serveri veateade
async function errorMessage(response) {
  try {
    const body = await response.json();
    return body.error || 'Something went wrong';
  } catch {
    return 'Something went wrong';
  }
}

export async function getWorkouts(search = '') {
  const url = search ? `${API_URL}?search=${encodeURIComponent(search)}` : API_URL;
  const response = await fetch(url, { headers: await authHeaders() });

  if (!response.ok) {
    throw new Error(await errorMessage(response));
  }

  return response.json();
}

export async function addWorkout(workout) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { ...(await authHeaders()), 'Content-Type': 'application/json' },
    body: JSON.stringify(workout),
  });

  if (!response.ok) {
    throw new Error(await errorMessage(response));
  }

  return response.json();
}

export async function deleteWorkout(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: await authHeaders(),
  });

  // 204 puhul keha pole
  if (!response.ok) {
    throw new Error(await errorMessage(response));
  }
}
