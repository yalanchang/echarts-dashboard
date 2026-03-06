import { useAuthStore } from '~/stores/auth'
import { $fetch } from 'ofetch'

export function useApi() {
  const authStore = useAuthStore()

  async function apiFetch<T>(url: string, options: any = {}): Promise<T> {
    const headers: any = { ...(options.headers ?? {}) }
    if (authStore.token) {
      headers['Authorization'] = `Bearer ${authStore.token}`
    }
    return $fetch<T>(url, { ...options, headers })
  }

  return { apiFetch }
}