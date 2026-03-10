<script setup lang="ts">
definePageMeta({ title: '訂單管理' })

const page    = ref(1)
const limit   = ref(20)
const search  = ref('')
const status  = ref('')
const loading = ref(false)

function goToOrder(row: Order) {
  const id = row.id
  navigateTo('/orders/' + id)
}
interface Order {
  id: number; order_no: string; user_name: string
  user_email: string; total: number; status: string; created_at: string
}

const orders     = ref<Order[]>([])
const total      = ref(0)
const totalPages = computed(() => Math.ceil(total.value / limit.value))

const columns = [
  { key: 'order_no',   label: '訂單編號', width: '140px' },
  { key: 'user_name',  label: '客戶' },
  { key: 'user_email', label: 'Email' },
  { key: 'total',      label: '金額',    width: '120px' },
  { key: 'status',     label: '狀態',    width: '100px' },
  { key: 'created_at', label: '日期',    width: '140px' },
]

async function fetchOrders() {
  loading.value = true
  try {
    const { apiFetch } = useApi()
    let url = `/api/orders?page=${page.value}&limit=${limit.value}`
    if (search.value) url += `&search=${encodeURIComponent(search.value)}`
    if (status.value) url += `&status=${encodeURIComponent(status.value)}`

    const res = await apiFetch<{
      success: boolean
      data: Order[]
      pagination: { total: number }
    }>(url)

    orders.value = res.data ?? []
    total.value  = res.pagination?.total ?? 0
  } catch (e) {
    console.error(e)
    orders.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrders()
})

watch([page, search, status], () => {
  if (import.meta.client) fetchOrders()
})

watch([page, search, status], () => fetchOrders(), { immediate: true })

const statusOptions = [
  { value: '',           label: '全部狀態' },
  { value: 'pending',    label: '待處理' },
  { value: 'processing', label: '處理中' },
  { value: 'shipped',    label: '配送中' },
  { value: 'done',       label: '已完成' },
  { value: 'refund',     label: '已退款' },
  { value: 'cancelled',  label: '已取消' },
]
</script>

<template>
  <div>
    <div class="mb-5 flex items-end justify-between">
      <div>
        <h1 class="text-[19px] font-bold">訂單管理</h1>
        <p class="mt-0.5 text-xs text-gray-500">共 {{ total }} 筆訂單</p>
      </div>
    </div>

    <div class="mb-3 flex items-center gap-2">
      <input
        v-model="search"
        class="rounded-lg border border-bline bg-bg2 px-3 py-1.5 text-xs
               text-[#dde3ef] outline-none transition focus:border-c1 w-52"
        placeholder="搜尋訂單編號 / 客戶..."
      >
      <select
        v-model="status"
        class="rounded-lg border border-bline bg-bg2 px-3 py-1.5 text-xs
               text-[#dde3ef] outline-none transition focus:border-c1"
      >
        <option v-for="o in statusOptions" :key="o.value" :value="o.value">
          {{ o.label }}
        </option>
      </select>
    </div>

    <!-- 手機版卡片 -->
    <div class="md:hidden space-y-2">
      <div
        v-if="loading"
        class="text-center py-10 text-xs text-gray-500"
      >
        載入中...
      </div>
      <div
        v-else-if="orders.length === 0"
        class="text-center py-10 text-xs text-gray-500"
      >
        沒有訂單
      </div>
      <div
        v-for="row in orders"
        :key="row.id"
        class="rounded-xl border border-bline bg-bg1 p-3 cursor-pointer
               hover:border-c1 transition"
        @click="goToOrder(row)"
      >
        <div class="flex items-center justify-between mb-2">
          <span class="font-mono text-c4 text-xs">{{ row.order_no }}</span>
          <StatusBadge :status="row.status" />
        </div>
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs font-medium">{{ row.user_name }}</div>
            <div class="text-[11px] text-gray-500 mt-0.5">{{ row.user_email }}</div>
          </div>
          <div class="text-right">
            <div class="font-mono text-c3 text-sm">${{ Number(row.total).toLocaleString() }}</div>
            <div class="text-[11px] text-gray-500 mt-0.5">{{ row.created_at }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 桌機版表格 -->
    <div class="hidden md:block">
      <DataTable :columns="columns" :rows="orders" :loading="loading" @row-click="goToOrder">
        <template #cell-total="{ value }">
          <span class="font-mono text-c3">${{ Number(value).toLocaleString() }}</span>
        </template>
        <template #cell-status="{ value }">
          <StatusBadge :status="(value as string)" />
        </template>
        <template #cell-order_no="{ value }">
          <span class="font-mono text-c4">{{ value }}</span>
        </template>
      </DataTable>
    </div>

    <div class="mt-3 flex items-center justify-between text-xs text-gray-500">
      <span>第 {{ page }} / {{ totalPages }} 頁，共 {{ total }} 筆</span>
      <div class="flex gap-1.5">
        <button
          :disabled="page <= 1"
          class="rounded-lg border border-bline px-3 py-1.5 transition
                 hover:border-c1 hover:text-c1 disabled:opacity-30"
          @click="page--"
        >
          上一頁
        </button>
        <button
          :disabled="page >= totalPages"
          class="rounded-lg border border-bline px-3 py-1.5 transition
                 hover:border-c1 hover:text-c1 disabled:opacity-30"
          @click="page++"
        >
          下一頁
        </button>
      </div>
    </div>
  </div>
</template>