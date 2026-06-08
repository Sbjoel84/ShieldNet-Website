const API       = import.meta.env.VITE_API_URL ?? ''
const TOKEN_KEY = 'shieldnet_token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export async function apiFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Request failed')
  return data as T
}
