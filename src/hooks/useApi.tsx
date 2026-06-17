import { auth } from '@/lib/firebase'

const API = import.meta.env.VITE_API_URL ?? ''

async function getToken(): Promise<string | null> {
  try {
    return (await auth.currentUser?.getIdToken()) ?? null
  } catch {
    return null
  }
}

export async function apiFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken()
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
