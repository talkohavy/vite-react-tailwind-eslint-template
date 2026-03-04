import { API_GATEWAY_URL, API_URLS } from '@src/common/constants';
import type { User } from '../../types';

export async function fetchUserById(id: number) {
  const targetUrl = `${API_GATEWAY_URL}${API_URLS.users}/${id}`;

  const response = await fetch(targetUrl, {
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
