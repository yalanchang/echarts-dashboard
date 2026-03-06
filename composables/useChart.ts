import * as echarts from 'echarts'


export function useChart() {
  const chartRef = ref<HTMLDivElement>()
  let   instance: echarts.ECharts | null = null

  onMounted(() => {
    if (!chartRef.value) return
    instance = echarts.init(chartRef.value, 'dark')

    const ro = new ResizeObserver(() => instance?.resize())
    ro.observe(chartRef.value)

    onUnmounted(() => {
      ro.disconnect()
      instance?.dispose()
    })
  })

  function setOption(option: echarts.EChartsOption) {
    instance?.setOption(option, true)
  }

  return { chartRef, setOption }
}

// ── 共用主題色 ──────────────────────────────────────────────
export const chartColors = {
  green:  '#3bffa0',
  red:    '#ff6b6b',
  yellow: '#ffd166',
  blue:   '#74b9ff',
  purple: '#a29bfe',
  bg2:    '#121620',
  bg3:    '#181d2a',
  line:   '#1e2536',
  text2:  '#6b7a99',
}

// ── 通用 tooltip 設定 ───────────────────────────────────────
export function defaultTooltip(trigger: 'axis' | 'item' = 'axis') {
  return {
    trigger,
    backgroundColor: chartColors.bg3,
    borderColor:     chartColors.line,
    textStyle: {
      color:      '#dde3ef',
      fontFamily: 'DM Mono',
      fontSize:   12,
    },
  }
}