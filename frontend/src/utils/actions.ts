'use server';

import { cookies } from 'next/headers';

const API = process.env.API_URL || 'http://localhost:3000';

const public_routes = ['/auth/login', '/auth/register'];

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  try {
    const token = await cookies().then((res) => res.get('access_token')?.value);

    if (!public_routes.includes(endpoint) && !token)
      throw new Error('No Token Request');

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
  return await fetchAPI('/users');
}
export async function getEntriesFromUser() {
  return await fetchAPI('/assets');
}

export async function removeUserEntry(id: number) {
  return await fetchAPI(`/assets/${id}`, { method: 'DELETE' });
}

export async function createUserEntry(entry: UserEntryForPost) {
  return await fetchAPI('/assets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...entry,
      date: new Date(entry.date).toISOString(),
    }),
  });
}

export async function login(username: string, password: string) {
  const response = await fetchAPI('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  await cookies().then((res) =>
    res.set('access_token', response.access_token, {
      path: '/',
    })
  );
}
