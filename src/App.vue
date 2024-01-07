<template>
  <div>
    <RouterView />
    <div id="_cesium_container"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { BaseService } from '@/hooks/cesium'

onMounted(() => {
  const cesiumMapService = new BaseService()
  window.cesiumMapService = cesiumMapService
  cesiumMapService.init(
    document.getElementById('_cesium_container') as HTMLElement,
    {
      homeButton: false,
    },
    (map) => {
      // 启用地球照明
      // map.scene.globe.enableLighting = true
    },
  )
})
</script>

<style scoped>
#_cesium_container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
