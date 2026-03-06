<script setup lang="ts">
definePageMeta({ title: '系統設定' })

const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)
const authStore = useAuthStore()
const error = ref('')
const success = ref('')
const loading = ref(false)

const pwForm = reactive({
  current_password: '',
  new_password: '',
  confirm_password: '',
})

async function changePassword() {
  error.value = ''
  success.value = ''

  if (pwForm.new_password !== pwForm.confirm_password) {
    error.value = '新密碼與確認密碼不一致'
    return
  }
  if (pwForm.new_password.length < 8) {
    error.value = '新密碼至少 8 個字元'
    return
  }

  loading.value = true
  try {
    const { apiFetch } = useApi()
    await apiFetch('/api/settings/password', {
      method: 'PATCH',
      body: {
        current_password: pwForm.current_password,
        new_password: pwForm.new_password,
      },
    })
    success.value = '密碼更新成功'
    pwForm.current_password = ''
    pwForm.new_password = ''
    pwForm.confirm_password = ''
  } catch (e: any) {
    error.value = e?.data?.message ?? '更新失敗'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-lg">
    <div class="mb-5">
      <h1 class="text-[19px] font-bold">系統設定</h1>
    </div>

    <div class="rounded-xl border border-bline bg-bg2 p-6 mb-4">
      <div class="text-[13px] font-semibold mb-4">個人資料</div>
      <div class="flex items-center gap-4">
        <div class="flex h-14 w-14 items-center justify-center rounded-full
                    bg-gradient-to-br from-c5 to-c4 text-xl font-bold text-white">
          {{ authStore.user?.name?.[0]?.toUpperCase() }}
        </div>
        <div>
          <div class="font-medium">{{ authStore.user?.name }}</div>
          <div class="text-sm text-gray-500">{{ authStore.user?.email }}</div>
          <div class="mt-1 text-xs">
            <span class="rounded-full bg-c2/10 px-2 py-0.5 text-c2 font-mono">
              {{ authStore.user?.role }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="rounded-xl border border-bline bg-bg2 p-6">
      <div class="text-[13px] font-semibold mb-4">修改密碼</div>

      <div v-if="error" class="mb-4 rounded-lg border border-c2/30 bg-c2/10 px-3 py-2 text-xs text-c2">
        {{ error }}
      </div>
      <div v-if="success" class="mb-4 rounded-lg border border-c1/30 bg-c1/10 px-3 py-2 text-xs text-c1">
        {{ success }}
      </div>
      <div>
        <label class="mb-1.5 block text-xs text-gray-500">目前密碼</label>
        <div class="relative">
          <input v-model="pwForm.current_password" :type="showCurrent ? 'text' : 'password'" class="w-full rounded-lg border border-bline bg-bg3 px-3 py-2 pr-9
             text-sm text-[#dde3ef] outline-none transition focus:border-c1">
          <button type="button"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-c1 transition"
            @click="showCurrent = !showCurrent">
            <svg v-if="showCurrent" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
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

      <div>
        <label class="mb-1.5 block text-xs text-gray-500">新密碼</label>
        <div class="relative">
          <input v-model="pwForm.new_password" :type="showNew ? 'text' : 'password'" class="w-full rounded-lg border border-bline bg-bg3 px-3 py-2 pr-9
             text-sm text-[#dde3ef] outline-none transition focus:border-c1">
          <button type="button"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-c1 transition"
            @click="showNew = !showNew">
            <svg v-if="showNew" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
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

      <div>
        <label class="mb-1.5 block text-xs text-gray-500">確認新密碼</label>
        <div class="relative">
          <input v-model="pwForm.confirm_password" :type="showConfirm ? 'text' : 'password'" class="w-full rounded-lg border border-bline bg-bg3 px-3 py-2 pr-9
             text-sm text-[#dde3ef] outline-none transition focus:border-c1">
          <button type="button"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-c1 transition"
            @click="showConfirm = !showConfirm">
            <svg v-if="showConfirm" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
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
      <button :disabled="loading" class="w-full rounded-lg bg-c1 py-2.5 text-sm font-bold text-black mt-4 
         transition hover:brightness-110 disabled:opacity-50" @click="changePassword">
            {{ loading ? '更新中...' : '更新密碼' }}
          </button>
    </div>
    
  </div>
</template>