<script setup lang="ts">
definePageMeta({ layout: false, title: '登入' })

const authStore = useAuthStore()
const router = useRouter()
const showPassword = ref(false)
const form = reactive({ email: '', password: '' })
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await authStore.login(form.email, form.password)
    router.push('/')
  } catch (e: any) {
    error.value = e?.data?.message ?? '登入失敗'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-bg0">
    <div class="w-full max-w-sm">
      <div class="mb-8 text-center">
        <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center
                    rounded-xl bg-c1 text-2xl">⚡</div>
        <h1 class="font-mono text-xl font-bold text-[#dde3ef]">DataPulse</h1>
      </div>

      <div class="rounded-2xl border border-bline bg-bg2 p-8">
        <h2 class="mb-6  font-semibold text-[#dde3ef]">登入管理後台</h2>

        <div v-if="error" class="mb-4 rounded-lg border border-c2/30 bg-c2/10
                 px-3 py-2 text-xs text-c2">
          {{ error }}
        </div>

        <div class="mb-4">
          <label class="mb-1.5 block text-xs text-gray-500">Email</label>
          <input v-model="form.email" type="email" class="w-full rounded-lg border border-bline bg-bg3 px-3 py-2
                   text-sm text-[#dde3ef] outline-none transition focus:border-c1">
        </div>
        <div class="mb-6">
          <label class="mb-1.5 block text-xs text-gray-500">密碼</label>
          <div class="relative">
            <input v-model="form.password" :type="showPassword ? 'text' : 'password'" class="w-full rounded-lg border border-bline bg-bg3 px-3 py-2 pr-9
             text-sm text-[#dde3ef] outline-none transition focus:border-c1" @keyup.enter="submit">
            <button type="button"
              class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-c1 transition"
              @click="showPassword = !showPassword">
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        </div>

        <button :disabled="loading" class="w-full rounded-lg bg-c1 py-2.5 text-sm font-bold text-black
                 transition hover:brightness-110 disabled:opacity-50" @click="submit">
          {{ loading ? '登入中...' : '登入' }}
        </button>

        <p class="mt-4 text-center text-[11px] text-gray-600">
          預設帳號：admin@example.com / 11111111
        </p>
      </div>
    </div>
  </div>
</template>