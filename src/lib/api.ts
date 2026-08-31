export interface AuthUser {
  id: string;
  username: string;
  role: 'investor' | 'admin';
  name: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

class ApiError extends Error {}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError((data as { error?: string }).error || 'Something went wrong. Please try again.');
  }
  return data as T;
}

export async function loginRequest(username: string, password: string): Promise<AuthResponse> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return handleResponse<AuthResponse>(res);
}

export async function registerRequest(username: string, password: string, name: string): Promise<AuthResponse> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, name })
  });
  return handleResponse<AuthResponse>(res);
}

export async function fetchCurrentUser(token: string): Promise<{ user: AuthUser }> {
  const res = await fetch('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return handleResponse<{ user: AuthUser }>(res);
}

export async function updateCredentialsRequest(
  token: string,
  updates: { currentPassword: string; newUsername?: string; newPassword?: string }
): Promise<AuthResponse> {
  const res = await fetch('/api/auth/credentials', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(updates)
  });
  return handleResponse<AuthResponse>(res);
}
