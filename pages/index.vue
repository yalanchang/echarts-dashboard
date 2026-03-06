<script setup lang="ts">
import type { EChartsOption } from 'echarts'

definePageMeta({ title: '儀表板' })

const { apiFetch } = useApi()

const stats = ref<DashboardStats | null>(null)
const recentOrders = ref<any[]>([])

onMounted(async () => {
  try {
    const [statsRes, ordersRes] = await Promise.all([
      apiFetch<{ data: DashboardStats }>('/api/dashboard/stats'),
      apiFetch<{ data: any[] }>('/api/orders?page=1&limit=4'),
    ])
    stats.value = statsRes.data
    recentOrders.value = ordersRes.data ?? []
  } catch (e) {
    console.error(e)
  }
})
interface DashboardStats {
  kpi: {
    revenue: number; prevRev: number
    orders: number; prevOrders: number
    activeUsers: number
    refundRate: number
  }
  revenueByMonth: { month: string; revenue: number }[]
  ordersByWeekday: { weekday: string; count: number }[]
}

onMounted(async () => {
  try {
    const res = await apiFetch<{ data: DashboardStats }>('/api/dashboard/stats')
    stats.value = res.data
  } catch (e) {
    console.error(e)
  }
})

const C = {
  green: '#3bffa0', red: '#ff6b6b', yellow: '#ffd166',
  blue: '#74b9ff', purple: '#a29bfe',
  line: '#1e2536', text2: '#6b7a99', bg3: '#181d2a',
}

function tip(trigger: 'axis' | 'item' = 'axis') {
  return {
    trigger,
    backgroundColor: C.bg3,
    borderColor: C.line,
    textStyle: { color: '#dde3ef', fontFamily: 'DM Mono', fontSize: 12 },
  }
}

const lineOption = computed<EChartsOption>(() => ({
  backgroundColor: 'transparent',
  grid: { top: 32, right: 12, bottom: 28, left: 52 },
  tooltip: tip(),
  xAxis: {
    type: 'category',
    data: stats.value?.revenueByMonth.map(r => r.month) ?? [],
    axisLine: { lineStyle: { color: C.line } },
    axisLabel: { color: C.text2, fontFamily: 'DM Mono' },
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: C.text2, formatter: (v: number) => `$${v}K` },
    splitLine: { lineStyle: { color: C.line } },
  },
  series: [{
    type: 'line',
    data: stats.value?.revenueByMonth.map(r => r.revenue) ?? [],
    smooth: true, symbol: 'circle', symbolSize: 5,
    lineStyle: { color: C.green, width: 2 },
    itemStyle: { color: C.green },
    areaStyle: {
      color: {
        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: 'rgba(59,255,160,.22)' },
          { offset: 1, color: 'rgba(59,255,160,0)' },
        ],
      },
    },
  }],
}))

const pieOption = computed<EChartsOption>(() => ({
  backgroundColor: 'transparent',
  legend: {
    orient: 'horizontal',
    bottom: 0,
    textStyle: { color: C.text2, fontSize: 10 },
    itemWidth: 10,
    itemHeight: 10,
  },
  series: [{
    type: 'pie',
    radius: ['38%', '65%'],
    center: ['50%', '45%'],
    label: {
      show: true,
      formatter: '{b} {d}%',
      color: '#dde3ef',
      fontSize: 10,
    },
        emphasis: {
      scale: false,
      label: { show: true },
    },
    data: [
      { value: 35, name: '電子產品', itemStyle: { color: C.blue } },
      { value: 28, name: '服飾',     itemStyle: { color: C.purple } },
      { value: 20, name: '居家',     itemStyle: { color: C.green } },
      { value: 17, name: '其他',     itemStyle: { color: C.yellow } },
    ],
  }],
}))

const barOption = computed<EChartsOption>(() => ({
  backgroundColor: 'transparent',
  grid: { top: 10, right: 10, bottom: 24, left: 36 },
  tooltip: tip(),
  xAxis: {
    type: 'category',
    data: stats.value?.ordersByWeekday.map(r => r.weekday) ?? [],
    axisLine: { lineStyle: { color: C.line } },
    axisLabel: { color: C.text2, fontSize: 10 },
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: C.text2 },
    splitLine: { lineStyle: { color: C.line } },
  },
  series: [{
    type: 'bar',
    data: stats.value?.ordersByWeekday.map(r => r.count) ?? [],
    barMaxWidth: 28,
    itemStyle: {
      color: {
        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: C.blue },
          { offset: 1, color: 'rgba(116,185,255,.2)' },
        ],
      },
      borderRadius: [4, 4, 0, 0],
    },
  }],
}))

function pct(curr: number, prev: number) {
  if (!prev) return 0
  return Math.round((curr - prev) / prev * 100 * 10) / 10
}

function fmtMoney(n: number) {
  return n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(2)}M`
    : `$${(n / 1_000).toFixed(1)}K`
}
</script>

<template>
  <div>
    <div class="mb-5">
      <h1 class="text-[19px] font-bold">總覽儀表板</h1>
      <p class="mt-0.5 text-xs text-gray-500">即時數據</p>
    </div>

    <!-- KPI Cards：手機2欄，桌機4欄 -->
    <div class="mb-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
      <KpiCard label="本月營收" :value="stats ? fmtMoney(stats.kpi.revenue) : '—'"
        :change="stats ? pct(stats.kpi.revenue, stats.kpi.prevRev) : undefined" />
      <KpiCard label="訂單數" color="text-c4" :value="stats?.kpi.orders.toLocaleString() ?? '—'"
        :change="stats ? pct(stats.kpi.orders, stats.kpi.prevOrders) : undefined" />
      <KpiCard label="活躍用戶" color="text-c5" :value="stats?.kpi.activeUsers.toLocaleString() ?? '—'" />
      <KpiCard label="退貨率" color="text-c2" :value="stats ? `${stats.kpi.refundRate}%` : '—'" />
    </div>

    <!-- 圖表第一排：手機單欄，桌機2欄 -->
    <div class="mb-3 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3">
      <div class="rounded-xl border border-bline bg-bg2 p-4">
        <div class="text-[13px] font-semibold">月營收趨勢</div>
        <div class="mb-3 text-[11px] text-gray-500">折線圖 · 近12個月</div>
        <EChart :option="lineOption" height="220px" />
      </div>
      <div class="rounded-xl border border-bline bg-bg2 p-4">
        <div class="text-[13px] font-semibold">品類佔比</div>
        <div class="mb-3 text-[11px] text-gray-500">餅圖 · 本月</div>
        <EChart :option="pieOption" height="220px" />
      </div>
    </div>

    <!-- 圖表第二排：手機單欄，桌機3欄 -->
    <div class="mb-3 grid grid-cols-1 lg:grid-cols-3 gap-3">
      <div class="rounded-xl border border-bline bg-bg2 p-4">
        <div class="text-[13px] font-semibold">週訂單量</div>
        <div class="mb-3 text-[11px] text-gray-500">柱狀圖 · 本週</div>
        <EChart :option="barOption" height="190px" />
      </div>

      <!-- 最新訂單：手機全寬，桌機佔2欄 -->
      <div class="lg:col-span-2 rounded-xl border border-bline bg-bg2">
        <div class="flex items-center justify-between border-b border-bline px-4 py-3">
          <span class="text-[13px] font-semibold">最新訂單</span>
          <NuxtLink to="/orders" class="text-xs text-gray-500 hover:text-c1 transition">
            查看全部
          </NuxtLink>
        </div>
        <!-- 手機版簡化，桌機完整 -->
        <div class="overflow-x-auto">
          <table class="w-full text-xs border-collapse">
            <thead>
              <tr>
                <th class="px-4 py-2 text-left font-mono text-[10px] uppercase
                           tracking-widest text-gray-500 bg-bg3 border-b border-bline">
                  訂單編號
                </th>
                <th class="px-4 py-2 text-left font-mono text-[10px] uppercase
                           tracking-widest text-gray-500 bg-bg3 border-b border-bline
                           hidden sm:table-cell">
                  客戶
                </th>
                <th class="px-4 py-2 text-left font-mono text-[10px] uppercase
                           tracking-widest text-gray-500 bg-bg3 border-b border-bline">
                  金額
                </th>
                <th class="px-4 py-2 text-left font-mono text-[10px] uppercase
                           tracking-widest text-gray-500 bg-bg3 border-b border-bline">
                  狀態
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!recentOrders.length">
                <td colspan="4" class="px-4 py-6 text-center text-gray-500">無資料</td>
              </tr>
              <tr v-for="order in recentOrders" :key="order.id"
                class="border-b border-bline last:border-0 hover:bg-bg3 transition cursor-pointer"
                @click="navigateTo('/orders/' + order.id)">
                <td class="px-4 py-2.5 font-mono text-c4">{{ order.order_no }}</td>
                <td class="px-4 py-2.5 hidden sm:table-cell">{{ order.user_name }}</td>
                <td class="px-4 py-2.5 font-mono text-c3">${{ Number(order.total).toLocaleString() }}</td>
                <td class="px-4 py-2.5">
                  <StatusBadge :status="order.status" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>