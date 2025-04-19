import type { User } from '../../types';

export async function fetchUserById(id: number) {
  const response = await fetch(`http://localhost:8000/users/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-request-id': 'vite-react-template',
    },
  });

  if (!response.ok) {
    console.error('Failed to fetch resource:', response.statusText);
    return;
  }

  const user = (await response.json()) as User;

  return user;
}
