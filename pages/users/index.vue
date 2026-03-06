<script setup lang="ts">
definePageMeta({ title: '用戶管理' })

const router  = useRouter()
const page    = ref(1)
const search  = ref('')
const role    = ref('')
const loading = ref(false)

interface User {
  id: number; name: string; email: string
  role: string; is_active: number; last_login: string; created_at: string
}

const users      = ref<User[]>([])
const total      = ref(0)
const totalPages = computed(() => Math.ceil(total.value / 20))

const columns = [
  { key: 'name',       label: '姓名' },
  { key: 'email',      label: 'Email' },
  { key: 'role',       label: '角色',    width: '90px' },
  { key: 'is_active',  label: '狀態',    width: '80px' },
  { key: 'last_login', label: '最後登入', width: '140px' },
  { key: 'created_at', label: '建立日期', width: '110px' },
]

const roleMap: Record<string, string> = {
  admin:  'bg-c2/10 text-c2',
  editor: 'bg-c3/10 text-c3',
  viewer: 'bg-c4/10 text-c4',
}

async function fetchUsers() {
  loading.value = true
  try {
    let url = `/api/users?page=${page.value}&limit=20`
    if (search.value) url += `&search=${encodeURIComponent(search.value)}`
    if (role.value)   url += `&role=${encodeURIComponent(role.value)}`

    const { apiFetch } = useApi()
    const res = await apiFetch<{ data: User[]; pagination: { total: number } }>(url)
    users.value = res.data ?? []
    total.value = res.pagination?.total ?? 0
  } catch (e) {
    console.error(e)
    users.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchUsers())
watch([page, search, role], () => {
  if (import.meta.client) fetchUsers()
})
</script>

<template>
  <div>
    <div class="mb-5 flex items-end justify-between">
      <div>
        <h1 class="text-[19px] font-bold">用戶管理</h1>
        <p class="mt-0.5 text-xs text-gray-500">共 {{ total }} 位用戶</p>
      </div>
      <button
        class="rounded-lg bg-c1 px-3 py-1.5 text-xs font-bold
               text-black transition hover:brightness-110"
        @click="router.push('/users/create')"
      >
        ＋ 新增用戶
      </button>
    </div>

    <div class="mb-3 flex items-center gap-2">
      <input
        v-model="search"
        class="rounded-lg border border-bline bg-bg2 px-3 py-1.5 text-xs
               text-[#dde3ef] outline-none transition focus:border-c1 w-52"
        placeholder="搜尋姓名 / Email..."
      >
      <select
        v-model="role"
        class="rounded-lg border border-bline bg-bg2 px-3 py-1.5 text-xs
               text-[#dde3ef] outline-none"
      >
        <option value="">全部角色</option>
        <option value="admin">Admin</option>
        <option value="editor">Editor</option>
        <option value="viewer">Viewer</option>
      </select>
    </div>

    <DataTable :columns="columns" :rows="users" :loading="loading">
      <template #cell-role="{ value }">
        <span :class="['px-2 py-0.5 rounded-full text-[11px] font-mono font-medium',
                       roleMap[value as string] ?? 'bg-gray-500/10 text-gray-500']">
          {{ value }}
        </span>
      </template>
      <template #cell-is_active="{ value }">
        <span :class="value ? 'text-c1' : 'text-c2'">
          {{ value ? '● 啟用' : '○ 停用' }}
        </span>
      </template>
      <template #cell-last_login="{ value }">
        <span class="text-gray-500">{{ value ?? '從未登入' }}</span>
      </template>
    </DataTable>

    <div class="mt-3 flex items-center justify-between text-xs text-gray-500">
      <span>第 {{ page }} / {{ totalPages }} 頁</span>
      <div class="flex gap-1.5">
        <button
          :disabled="page <= 1"
          class="rounded-lg border border-bline px-3 py-1.5 transition
                 hover:border-c1 hover:text-c1 disabled:opacity-30"
          @click="page--"
        >上一頁</button>
        <button
          :disabled="page >= totalPages"
          class="rounded-lg border border-bline px-3 py-1.5 transition
                 hover:border-c1 hover:text-c1 disabled:opacity-30"
          @click="page++"
        >下一頁</button>
      </div>
    </div>
  </div>
</template>