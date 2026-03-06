<script setup lang="ts">
import type { EChartsOption } from 'echarts'

definePageMeta({ title: '數據報表' })

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
    textStyle: { color: '#dde3ef', fontFamily: 'DM Mono', fontSize: 11 },
  }
}

function axisStyle() {
  return {
    axisLine:  { lineStyle: { color: C.line } },
    axisLabel: { color: C.text2, fontFamily: 'DM Mono', fontSize: 11 },
    splitLine: { lineStyle: { color: C.line } },
  }
}

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

// ── 年度對比折線圖 ──────────────────────────────────────────
const lineMultiOption: EChartsOption = {
  backgroundColor: 'transparent',
  grid: { top: 36, right: 12, bottom: 28, left: 52 },
  legend: { top: 4, textStyle: { color: C.text2, fontSize: 11 } },
  tooltip: tip(),
  xAxis: { type: 'category', data: months, ...axisStyle() },
  yAxis: { type: 'value', ...axisStyle(), axisLabel: { color: C.text2, formatter: (v: number) => `$${v}K` } },
  series: [
    {
      name: '2024', type: 'line', smooth: true, symbol: 'none',
      data: [600,640,700,720,810,880,840,900,870,950,920,1000],
      lineStyle: { color: C.text2 }, itemStyle: { color: C.text2 },
    },
    {
      name: '2025', type: 'line', smooth: true, symbol: 'none',
      data: [820,940,1080,960,1140,1320,1210,1440,1380,1560,1480,1620],
      lineStyle: { color: C.blue }, itemStyle: { color: C.blue },
    },
    {
      name: '2026', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
      data: [1100,1240,null,null,null,null,null,null,null,null,null,null],
      lineStyle: { color: C.green, type: 'dashed' }, itemStyle: { color: C.green },
    },
  ],
}

// ── 堆疊柱狀圖 ────────────────────────────────────────────
const barStackOption: EChartsOption = {
  backgroundColor: 'transparent',
  grid: { top: 36, right: 12, bottom: 28, left: 44 },
  
  legend: { top: 4, textStyle: { color: C.text2, fontSize: 11 } },
  xAxis: { type: 'category', data: ['Q1','Q2','Q3','Q4'], ...axisStyle() },
  yAxis: { type: 'value', ...axisStyle() },
  series: [
    {
      name: '電子', type: 'bar', stack: 's',
      data: [1200,1400,1100,1600],
      itemStyle: { color: C.blue },
    },
    {
      name: '服飾', type: 'bar', stack: 's',
      data: [800,960,850,1100],
      itemStyle: { color: C.purple },
    },
    {
      name: '居家', type: 'bar', stack: 's',
      data: [400,500,380,520],
      itemStyle: { color: C.green, borderRadius: [4,4,0,0] } as any,
    },
  ],
}

// ── 付款方式環形餅圖 ──────────────────────────────────────
const pie3Option: EChartsOption = {
  backgroundColor: 'transparent',
  
  series: [{
    type: 'pie', radius: ['38%','65%'],
    emphasis: {
      scale: false,
      label: { show: true },
    },
    label: { formatter: '{b}\n{d}%', color: '#dde3ef', fontSize: 10 },
    data: [
      { value: 45, name: '信用卡',  itemStyle: { color: C.blue } },
      { value: 30, name: 'Line Pay',itemStyle: { color: C.green } },
      { value: 15, name: 'ATM',     itemStyle: { color: C.yellow } },
      { value: 10, name: '其他',    itemStyle: { color: C.purple } },
    ],
  }],
}

// ── 裝置類型餅圖 ──────────────────────────────────────────
const pie4Option: EChartsOption = {
  backgroundColor: 'transparent',
  series: [{
    type: 'pie', radius: ['38%','65%'],
    emphasis: {
      scale: false,
      label: { show: true },
    },
    label: { formatter: '{b} {d}%', color: '#dde3ef', fontSize: 10 },
    data: [
      { value: 52, name: '手機', itemStyle: { color: C.green } },
      { value: 34, name: '桌機', itemStyle: { color: C.blue } },
      { value: 14, name: '平板', itemStyle: { color: C.yellow } },
    ],
  }],
}

// ── 轉換率折線圖 ──────────────────────────────────────────
const lineConvOption: EChartsOption = {
  backgroundColor: 'transparent',
  grid: { top: 10, right: 10, bottom: 24, left: 42 },
  tooltip: tip(),
  xAxis: { type: 'category', data: months, ...axisStyle() },
  yAxis: {
    type: 'value', ...axisStyle(),
    axisLabel: { color: C.text2, formatter: (v: number) => `${v}%` },
  },
  
  series: [{
    type: 'line', smooth: true, symbol: 'none',
    data: [2.1,2.3,2.8,2.5,3.1,3.4,3.2,3.8,3.5,4.0,3.9,4.3],
    lineStyle: { color: C.purple, width: 2 },
    areaStyle: {
      color: {
        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: 'rgba(162,155,254,.22)' },
          { offset: 1, color: 'rgba(162,155,254,0)' },
        ],
      },
    },
  }],
}
</script>

<template>
  <div>
    <div class="mb-5">
      <h1 class="text-[19px] font-bold">數據報表</h1>
      <p class="mt-0.5 text-xs text-gray-500">ECharts · 折線圖 / 柱狀圖 / 餅圖</p>
    </div>

    <div class="mb-3 grid grid-cols-[2fr_1fr] gap-3">
      <div class="rounded-xl border border-bline bg-bg2 p-4">
        <div class="text-[13px] font-semibold">年度收入對比</div>
        <div class="mb-3 text-[11px] text-gray-500">折線圖 · 2024 vs 2025 vs 2026</div>
        <EChart :option="lineMultiOption" height="255px" />
      </div>
      <div class="rounded-xl border border-bline bg-bg2 p-4">
        <div class="text-[13px] font-semibold">季度訂單</div>
        <div class="mb-3 text-[11px] text-gray-500">堆疊柱狀圖</div>
        <EChart :option="barStackOption" height="255px" />
      </div>
    </div>

    <div class="grid grid-cols-3 gap-3">
      <div class="rounded-xl border border-bline bg-bg2 p-4">
        <div class="text-[13px] font-semibold">付款方式分布</div>
        <div class="mb-3 text-[11px] text-gray-500">環形餅圖</div>
        <EChart :option="pie3Option" height="190px" />
      </div>
      <div class="rounded-xl border border-bline bg-bg2 p-4">
        <div class="text-[13px] font-semibold">裝置類型</div>
        <div class="mb-3 text-[11px] text-gray-500">餅圖</div>
        <EChart :option="pie4Option" height="190px" />
      </div>
      <div class="rounded-xl border border-bline bg-bg2 p-4">
        <div class="text-[13px] font-semibold">轉換率趨勢</div>
        <div class="mb-3 text-[11px] text-gray-500">折線圖 · %</div>
        <EChart :option="lineConvOption" height="190px" />
      </div>
    </div>
  </div>
</template>