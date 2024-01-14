<template>
  <div id="container" class="box">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import jsonData from '@/mock/stationList1.json'
import site from '@/assets/map/site-blue.svg'

// cesium 实体集合
let cesiumEntityListLayer: any[] = [] // markerList

onMounted(() => {
  // for (let i = 0; i < cesiumEntityListLayer.length; i++) {
  //   window.cesiumMapService.map.entities.remove(cesiumEntityListLayer[i])
  // }
  // cesiumEntityListLayer = []
  // const markerList = []
  // for (let i = 0; i < jsonData.length; i++) {
  //   const latitude = parseFloat(jsonData[i].latitude)
  //   const longitude = parseFloat(jsonData[i].longitude)
  //   const marker = window.cesiumMapService.createMarker({
  //     name: jsonData[i].name,
  //     description: JSON.stringify(jsonData[i]),
  //     position: window.cesiumMapService.getPosition(longitude, latitude),
  //     billboard: {
  //       image: site,
  //       scale: 1,
  //       // pixelOffset: new Cartesian2(0, -10),
  //     },
  //   })
  //   markerList.push(marker)
  //   window.cesiumMapService.map.entities.add(marker)
  // }
  // const latitude = parseFloat(jsonData[0].latitude)
  // const longitude = parseFloat(jsonData[0].longitude)
  // window.cesiumMapService.flyTo({
  //   destination: window.cesiumMapService.getPosition(
  //     longitude,
  //     latitude,
  //     1000000,
  //   ),
  // })
  // cesiumEntityListLayer = markerList
  // return markerList
})
</script>

<style scoped>
#cesiumContainer {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;

  color: white;

  z-index: 999999;
}
.box {
  width: 100%;
  height: 100%;
}
</style>
