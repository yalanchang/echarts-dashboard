export default defineNuxtRouteMiddleware((to) => {
    const authStore = useAuthStore()
    authStore.hydrate()
  
    // 不需要登入
    if (to.path === '/login') return
  
    // 沒有 token 跳到登入頁
    if (!authStore.token) {
      return navigateTo('/login')
    }
  })