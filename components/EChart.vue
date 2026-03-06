<script setup lang="ts">
import * as echarts from 'echarts'

const props = defineProps<{
  option:  echarts.EChartsOption
  height?: string
  theme?:  string
}>()

const el       = ref<HTMLDivElement>()
let   instance: echarts.ECharts | null = null

onMounted(() => {
  if (!el.value) return

  instance = echarts.init(el.value, props.theme ?? 'dark')
  instance.setOption(props.option)

  const ro = new ResizeObserver(() => instance?.resize())
  ro.observe(el.value)

  onUnmounted(() => {
    ro.disconnect()
    instance?.dispose()
  })
})

watch(
  () => props.option,
  (newOption) => instance?.setOption(newOption, true),
  { deep: true }
)
</script>

<template>
  <div
    ref="el"
    :style="{ width: '100%', height: height ?? '300px' }"
  />
</template>