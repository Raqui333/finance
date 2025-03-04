'use server';

import { cookies } from 'next/headers';

const API = process.env.API_URL || 'http://localhost:3000';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  try {
    const token = await cookies().then((res) => res.get('access_token')?.value);

    if (!token) throw new Error('No Token Request');

    const resp = await fetch(`${API}${endpoint}`, {
      cache: 'no-store',
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${token}` },
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

export async function getUserProfile() {
  return await fetchAPI(`/users`);
}
export async function getEntriesFromUser() {
  return await fetchAPI(`/assets`);
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
    }),
  });
}
