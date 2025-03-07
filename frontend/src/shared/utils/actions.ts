'use server';

import { cookies } from 'next/headers';

const API = process.env.API_URL || 'http://localhost:3000';

const public_routes = [
  '/auth/login',
  '/auth/register',
  '/users/validate-username',
];

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  try {
    const token = await cookies().then((res) => res.get('access_token')?.value);

    // matches routes that starts with any of the public routes
    const routesPattern = new RegExp(
      `^${public_routes.join('|').replace('/', '\\/')}`
    );

    if (!routesPattern.test(endpoint) && !token)
      throw new Error('No Token Request');

    const response = await fetch(`${API}${endpoint}`, {
      cache: 'no-store',
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 404 && !endpoint.includes('/auth')) return [];

      throw new Error(JSON.stringify(data));
    }

    return data;
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
  }
}

export async function getProfile() {
  return await fetchAPI('/users');
}

export async function getEntries() {
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

export async function register(form: RegisterFormForPost) {
  return await fetchAPI('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...form,
      email: `${form.username}@financedashboard.com`,
    }),
  });
}

export async function validateUsername(username: string) {
  return await fetchAPI(`/users/validate-username/${username}`);
}

export async function logout() {
  await cookies().then((res) => res.delete('access_token'));
}
