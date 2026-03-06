<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({ title: '訂單詳情' })

const route = useRoute()
const id = route.params.id

const order = ref<any>(null)
const pending = ref(true)

onMounted(async () => {
  try {
    const { apiFetch } = useApi()
    const res = await apiFetch<{ data: any }>('/api/orders/' + id)
    order.value = res.data
  } catch (e) {
    console.error(e)
  } finally {
    pending.value = false
  }
})
</script>

<template>
  <div>
    <div class="mb-5">
  <NuxtLink to="/orders" class="text-gray-500 hover:text-c1 transition text-sm">
    返回列表
  </NuxtLink>
  <h1 class="mt-2 text-[19px] font-bold">訂單 {{ order?.order_no }}</h1>
</div>

    <div v-if="pending" class="text-gray-500 text-sm">載入中...</div>

    <div v-else-if="order" class="grid grid-cols-2 gap-4">
      <div class="rounded-xl border border-bline bg-bg2 p-5">
        <div class="text-[13px] font-semibold mb-4">訂單資訊</div>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500">訂單編號</span>
            <span class="font-mono text-c4">{{ order.order_no }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">客戶</span>
            <span>{{ order.user_name }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Email</span>
            <span>{{ order.user_email }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">總金額</span>
            <span class="font-mono text-c3">${{ Number(order.total).toLocaleString() }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">狀態</span>
            <StatusBadge :status="order.status" />
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">建立時間</span>
            <span class="text-gray-400">{{ order.created_at }}</span>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-bline bg-bg2 p-5">
        <div class="text-[13px] font-semibold mb-4">訂單明細</div>
        <table class="w-full text-xs border-collapse">
          <thead>
            <tr>
              <th class="pb-2 text-left text-gray-500 font-mono">商品</th>
              <th class="pb-2 text-left text-gray-500 font-mono">數量</th>
              <th class="pb-2 text-left text-gray-500 font-mono">單價</th>
              <th class="pb-2 text-left text-gray-500 font-mono">小計</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in order.items" :key="item.id"
                class="border-t border-bline">
              <td class="py-2">{{ item.product_name }}</td>
              <td class="py-2">{{ item.qty }}</td>
              <td class="py-2 font-mono">${{ Number(item.unit_price).toLocaleString() }}</td>
              <td class="py-2 font-mono text-c3">${{ Number(item.subtotal).toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="!order.items?.length" class="text-gray-500 text-center py-4">
          無明細資料
        </div>
      </div>
    </div>

    <div v-else class="text-gray-500 text-sm">找不到訂單</div>
  </div>
</template>