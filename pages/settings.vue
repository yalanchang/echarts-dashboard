<script setup lang="ts">
definePageMeta({ title: '系統設定' })

const authStore   = useAuthStore()

// ── 深色/淺色 ──────────────────────────────────────
const isDark = ref(true)

onMounted(() => {
  const saved = localStorage.getItem('theme')
  isDark.value = saved ? saved === 'dark' : true
  applyTheme(isDark.value)
})

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle('light-mode', !dark)
  localStorage.setItem('theme', dark ? 'dark' : 'light')
}

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('light-mode', !isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

// ── 個人資料 ──────────────────────────────────────
const profileForm = reactive({
  name: authStore.user?.name ?? '',
})
const profileError   = ref('')
const profileSuccess = ref('')
const profileLoading = ref(false)
const avatarFile     = ref<File | null>(null)
const avatarPreview  = ref<string | null>(null)

function onAvatarChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  avatarFile.value = file
  avatarPreview.value = URL.createObjectURL(file)
}

async function saveProfile() {
  profileError.value   = ''
  profileSuccess.value = ''
  if (!profileForm.name.trim()) {
    profileError.value = '名字不能為空'
    return
  }
  profileLoading.value = true
  try {
    const { apiFetch } = useApi()
    await apiFetch(`/api/users/${authStore.user?.id}`, {
      method: 'PATCH',
      body: { name: profileForm.name },
    })
    if (authStore.user) authStore.user.name = profileForm.name
    profileSuccess.value = '個人資料已更新'
  } catch (e: any) {
    profileError.value = e?.data?.message ?? '更新失敗'
  } finally {
    profileLoading.value = false
  }
}

// ── 修改密碼 ──────────────────────────────────────
const showCurrent = ref(false)
const showNew     = ref(false)
const showConfirm = ref(false)
const error       = ref('')
const success     = ref('')
const loading     = ref(false)

const pwForm = reactive({
  current_password: '',
  new_password: '',
  confirm_password: '',
})

async function changePassword() {
  error.value   = ''
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
        new_password:     pwForm.new_password,
      },
    })
    success.value = '密碼更新成功'
    pwForm.current_password = ''
    pwForm.new_password     = ''
    pwForm.confirm_password = ''
  } catch (e: any) {
    error.value = e?.data?.message ?? '更新失敗'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-lg space-y-4">
    <div class="mb-5">
      <h1 class="text-[19px] font-bold">系統設定</h1>
    </div>

    <!-- ── 外觀 ───────────────────────────────────── -->
    <div class="rounded-xl border border-bline bg-bg2 p-6">
      <div class="text-[13px] font-semibold mb-4">外觀</div>
      <div class="flex items-center justify-between">
        <div>
          <div class="text-sm">{{ isDark ? '深色模式' : '淺色模式' }}</div>
          <div class="text-xs text-gray-500 mt-0.5">切換介面配色</div>
        </div>
        <!-- Toggle Switch -->
        <button
          class="relative h-6 w-11 rounded-full transition-colors duration-300"
          :class="isDark ? 'bg-c1/30' : 'bg-gray-600'"
          @click="toggleTheme"
        >
          <span
            class="absolute top-0.5 h-5 w-5 rounded-full shadow transition-all duration-300 flex items-center justify-center text-[10px]"
            :class="isDark ? 'left-[22px] bg-c1 text-black' : 'left-0.5 bg-white text-yellow-500'"
          >
          </span>
        </button>
      </div>
    </div>

    <!-- ── 個人資料 ────────────────────────────────── -->
    <div class="rounded-xl border border-bline bg-bg2 p-6">
      <div class="text-[13px] font-semibold mb-4">個人資料</div>

      <!-- 頭貼 -->
      <div class="flex items-center gap-4 mb-5">
        <div class="relative group">
          <div class="flex h-16 w-16 items-center justify-center rounded-full
                      bg-gradient-to-br from-c5 to-c4 text-2xl font-bold text-white overflow-hidden">
            <img v-if="avatarPreview" :src="avatarPreview" class="h-full w-full object-cover">
            <span v-else>{{ authStore.user?.name?.[0]?.toUpperCase() }}</span>
          </div>
          <label
            class="absolute inset-0 flex items-center justify-center rounded-full
                   bg-black/50 opacity-0 group-hover:opacity-100 transition cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="white" stroke-width="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
            <input type="file" accept="image/*" class="hidden" @change="onAvatarChange">
          </label>
        </div>
        <div>
          <div class="text-sm font-medium">{{ authStore.user?.name }}</div>
          <div class="text-xs text-gray-500">{{ authStore.user?.email }}</div>
          <div class="mt-1">
            <span class="rounded-full bg-c2/10 px-2 py-0.5 text-[11px] text-c2 font-mono">
              {{ authStore.user?.role }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="profileError"
        class="mb-3 rounded-lg border border-c2/30 bg-c2/10 px-3 py-2 text-xs text-c2">
        {{ profileError }}
      </div>
      <div v-if="profileSuccess"
        class="mb-3 rounded-lg border border-c1/30 bg-c1/10 px-3 py-2 text-xs text-c1">
        {{ profileSuccess }}
      </div>

      <div class="mb-4">
        <label class="mb-1.5 block text-xs text-gray-500">顯示名稱</label>
        <input v-model="profileForm.name"
          class="w-full rounded-lg border border-bline bg-bg3 px-3 py-2
                 text-sm text-[#dde3ef] outline-none transition focus:border-c1">
      </div>

      <div class="mb-4">
        <label class="mb-1.5 block text-xs text-gray-500">Email</label>
        <input :value="authStore.user?.email" disabled
          class="w-full rounded-lg border border-bline bg-bg3/50 px-3 py-2
                 text-sm text-gray-500 outline-none cursor-not-allowed">
      </div>

      <button :disabled="profileLoading"
        class="w-full rounded-lg bg-c1 py-2.5 text-sm font-bold text-black
               transition hover:brightness-110 disabled:opacity-50"
        @click="saveProfile">
        {{ profileLoading ? '儲存中...' : '儲存個人資料' }}
      </button>
    </div>

    <!-- ── 修改密碼 ────────────────────────────────── -->
    <div class="rounded-xl border border-bline bg-bg2 p-6">
      <div class="text-[13px] font-semibold mb-4">修改密碼</div>

      <div v-if="error"
        class="mb-4 rounded-lg border border-c2/30 bg-c2/10 px-3 py-2 text-xs text-c2">
        {{ error }}
      </div>
      <div v-if="success"
        class="mb-4 rounded-lg border border-c1/30 bg-c1/10 px-3 py-2 text-xs text-c1">
        {{ success }}
      </div>

      <div class="space-y-4">
        <div>
          <label class="mb-1.5 block text-xs text-gray-500">目前密碼</label>
          <div class="relative">
            <input v-model="pwForm.current_password"
              :type="showCurrent ? 'text' : 'password'"
              class="w-full rounded-lg border border-bline bg-bg3 px-3 py-2 pr-9
                     text-sm text-[#dde3ef] outline-none transition focus:border-c1">
            <button type="button"
              class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-c1 transition"
              @click="showCurrent = !showCurrent">
              <svg v-if="showCurrent" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
              <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>
        </div>

        <div>
          <label class="mb-1.5 block text-xs text-gray-500">新密碼</label>
          <div class="relative">
            <input v-model="pwForm.new_password"
              :type="showNew ? 'text' : 'password'"
              class="w-full rounded-lg border border-bline bg-bg3 px-3 py-2 pr-9
                     text-sm text-[#dde3ef] outline-none transition focus:border-c1">
            <button type="button"
              class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-c1 transition"
              @click="showNew = !showNew">
              <svg v-if="showNew" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
              <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>
        </div>

        <div>
          <label class="mb-1.5 block text-xs text-gray-500">確認新密碼</label>
          <div class="relative">
            <input v-model="pwForm.confirm_password"
              :type="showConfirm ? 'text' : 'password'"
              class="w-full rounded-lg border border-bline bg-bg3 px-3 py-2 pr-9
                     text-sm text-[#dde3ef] outline-none transition focus:border-c1">
            <button type="button"
              class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-c1 transition"
              @click="showConfirm = !showConfirm">
              <svg v-if="showConfirm" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
              <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>
        </div>

        <button :disabled="loading"
          class="w-full rounded-lg bg-c1 py-2.5 text-sm font-bold text-black
                 transition hover:brightness-110 disabled:opacity-50"
          @click="changePassword">
          {{ loading ? '更新中...' : '更新密碼' }}
        </button>
      </div>
    </div>
  </div>
</template>