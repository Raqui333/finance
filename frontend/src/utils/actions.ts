'use server';

const API = process.env.API_URL || 'http://localhost:3000';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  try {
    const resp = await fetch(`${API}${endpoint}`, {
      cache: 'no-store',
      ...options,
    });

    if (resp.status === 404) return [];

    if (!resp.ok) {
      throw new Error(`Status ${resp.status}: ${resp.statusText}`);
    }

    return await resp.json();
  } catch (error) {
    if (error instanceof Error)
      throw new Error(`Error trying to fetch API: ${error.message}`);
  }
}

export async function getEntriesFromUser(id: number) {
  return await fetchAPI(`/assets/from/${id}`);
}

export async function getUserProfile(id: number) {
  return await fetchAPI(`/users/${id}`);
}

export async function removeUserEntry(id: number) {
  return await fetchAPI(`/assets/${id}`, { method: 'DELETE' });
}

export async function createUserEntry(id: number, entry: UserEntryForPost) {
  return await fetchAPI(`/assets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...entry,
      date: new Date(entry.date).toISOString(),
      holder_id: id,
    }),
  });
}
