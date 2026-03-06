<script setup lang="ts">
definePageMeta({ title: '新增用戶' })

const router = useRouter()
const form = reactive({
  name: '',
  email: '',
  password: '',
  role: 'viewer'
})
const error = ref('')
const loading = ref(false)

async function submit() {
  if (!form.name || !form.email || !form.password) {
    error.value = '請填寫所有欄位'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const { apiFetch } = useApi()
    await apiFetch('/api/users', {
      method: 'POST',
      body: form
    })
    router.push('/users')
  } catch (e: any) {
    error.value = e?.data?.message ?? '建立失敗'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-lg">
    <div class="mb-5">
      <NuxtLink to="/users" class="text-gray-500 hover:text-c1 transition text-sm">
        返回列表
      </NuxtLink>
      <h1 class="mt-2 text-[19px] font-bold">新增用戶</h1>
    </div>

    <div class="rounded-xl border border-bline bg-bg2 p-6">
      <div v-if="error" class="mb-4 rounded-lg border border-c2/30 bg-c2/10 px-3 py-2 text-xs text-c2">
        {{ error }}
      </div>

      <div class="mb-4">
        <label class="mb-1.5 block text-xs text-gray-500">姓名</label>
        <input v-model="form.name"
          class="w-full rounded-lg border border-bline bg-bg3 px-3 py-2
                 text-sm text-[#dde3ef] outline-none transition focus:border-c1">
      </div>

      <div class="mb-4">
        <label class="mb-1.5 block text-xs text-gray-500">Email</label>
        <input v-model="form.email" type="email"
          class="w-full rounded-lg border border-bline bg-bg3 px-3 py-2
                 text-sm text-[#dde3ef] outline-none transition focus:border-c1">
      </div>

      <div class="mb-4">
        <label class="mb-1.5 block text-xs text-gray-500">密碼</label>
        <input v-model="form.password" type="password"
          class="w-full rounded-lg border border-bline bg-bg3 px-3 py-2
                 text-sm text-[#dde3ef] outline-none transition focus:border-c1">
      </div>

      <div class="mb-6">
        <label class="mb-1.5 block text-xs text-gray-500">角色</label>
        <select v-model="form.role"
          class="w-full rounded-lg border border-bline bg-bg3 px-3 py-2
                 text-sm text-[#dde3ef] outline-none transition focus:border-c1">
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <button
        :disabled="loading"
        class="w-full rounded-lg bg-c1 py-2.5 text-sm font-bold text-black
               transition hover:brightness-110 disabled:opacity-50"
        @click="submit"
      >
        {{ loading ? '建立中...' : '建立用戶' }}
      </button>
    </div>
  </div>
</template>