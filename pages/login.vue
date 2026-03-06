<script setup lang="ts">
definePageMeta({ layout: false, title: '登入' })

const authStore = useAuthStore()
const router    = useRouter()

const form  = reactive({ email: '', password: '' })
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value   = ''
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

        <div v-if="error"
          class="mb-4 rounded-lg border border-c2/30 bg-c2/10
                 px-3 py-2 text-xs text-c2">
          {{ error }}
        </div>

        <div class="mb-4">
          <label class="mb-1.5 block text-xs text-gray-500">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="w-full rounded-lg border border-bline bg-bg3 px-3 py-2
                   text-sm text-[#dde3ef] outline-none transition focus:border-c1"
          >
        </div>
        <div class="mb-6">
          <label class="mb-1.5 block text-xs text-gray-500">密碼</label>
          <input
            v-model="form.password"
            type="password"
            class="w-full rounded-lg border border-bline bg-bg3 px-3 py-2
                   text-sm text-[#dde3ef] outline-none transition focus:border-c1"
            @keyup.enter="submit"
          >
        </div>

        <button
          :disabled="loading"
          class="w-full rounded-lg bg-c1 py-2.5 text-sm font-bold text-black
                 transition hover:brightness-110 disabled:opacity-50"
          @click="submit"
        >
          {{ loading ? '登入中...' : '登入' }}
        </button>

        <p class="mt-4 text-center text-[11px] text-gray-600">
          預設帳號：admin@example.com / Admin@1234
        </p>
      </div>
    </div>
  </div>
</template>