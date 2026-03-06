import { defineStore } from 'pinia'

interface User {
  id:    number
  name:  string
  email: string
  role:  string
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user  = ref<User | null>(null)

  const isLoggedIn = computed(() => !!token.value)
  const isAdmin    = computed(() => user.value?.role === 'admin')

  async function login(email: string, password: string) {
    const res = await $fetch<{ data: { token: string; user: User } }>(
      '/api/auth/login',
      { method: 'POST', body: { email, password } }
    )
    token.value = res.data.token
    user.value  = res.data.user
    if (import.meta.client) {
      localStorage.setItem('auth_token', res.data.token)
    }
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    token.value = null
    user.value  = null
    if (import.meta.client) localStorage.removeItem('auth_token')
  }

  async function fetchMe() {
    try {
      const res = await $fetch<{ data: User }>('/api/auth/me', {
        headers: token.value ? { Authorization: `Bearer ${token.value}` } : {},
      })
      user.value = res.data
    } catch {
      logout()
    }
  }

  function hydrate() {
    if (!import.meta.client) return
    const saved = localStorage.getItem('auth_token')
    if (saved) token.value = saved
  }

  return { token, user, isLoggedIn, isAdmin, login, logout, fetchMe, hydrate }
})