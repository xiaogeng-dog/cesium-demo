<template>
  <div id="container" class="box">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as Cesium from 'cesium'
onMounted(() => {
  initCesium()
})
function initCesium() {
  var token = 'a42a5cc72ceffa83582cc329ed0d156f'
  // 服务域名
  var tdtUrl = 'https://t{s}.tianditu.gov.cn/'
  // 服务负载子域
  var subdomains = ['0', '1', '2', '3', '4', '5', '6', '7']

  // geoserver叠加参数，EPSG码+图层等级
  const TileMatrixLabels = [
    'EPSG:900913:0',
    'EPSG:900913:1',
    'EPSG:900913:2',
    'EPSG:900913:3',
    'EPSG:900913:4',
    'EPSG:900913:5',
    'EPSG:900913:6',
    'EPSG:900913:7',
    'EPSG:900913:8',
    'EPSG:900913:9',
    'EPSG:900913:10',
    'EPSG:900913:11',
    'EPSG:900913:12',
    'EPSG:900913:13',
    'EPSG:900913:14',
    'EPSG:900913:15',
    'EPSG:900913:16',
    'EPSG:900913:17',
    'EPSG:900913:18',
  ]

  Cesium.Ion.defaultAccessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjM2M1YWM2My1kOGQyLTRlZDMtODg1OS00YTg4YjdlYzIxYzkiLCJpZCI6MTI5MzU0LCJpYXQiOjE2NzkyMzM0Mjh9.0Qbw5zRJd0TC8sd5QvY40t2mtEeSroN0M4Jqfc3_7mE'

  var tdtImage = new Cesium.WebMapTileServiceImageryProvider({
    url: 'http://localhost:8089/geoserver/gwc/service/wmts/rest/nurc:Img_Sample/{style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}?format=image/png',
    layer: 'nurc:Img_Sample',
    style: '',
    format: 'image/png',
    tileMatrixSetID: 'EPSG:900913',
    // tileMatrixSetID: 'EPSG:3857',
    // tileMatrixLabels: TileMatrixLabels,
    // tileWidth: 256,
    // tileHeight: 256,
    // tilingScheme: new Cesium.WebMercatorTilingScheme({
    //   numberOfLevelZeroTilesX: 1,
    //   numberOfLevelZeroTilesY: 1,
    // }),
    // ellipsoid: Cesium.Ellipsoid.WGS84,
    // //范围保留六位小数，以免因为精度问题 影像被拉伸变形
    // rectangle: Cesium.Rectangle.fromDegrees(
    //   103.738403,
    //   31.065216,
    //   103.81668,
    //   31.138,
    // ),
    // maximumLevel: 17,
    // minimumLevel: 0,
  })
  /**
   * wmts 4326
   * imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
    url: 'http://localhost:9527/geoserver/gwc/service/wmts/rest/china:pengzhou1/{style}/{TileMatrixSet}/{TileMatrixSet}:{TileMatrix}/{TileRow}/{TileCol}?format=image/png',
    layer:'china:pengzhou',
    style : '',
    format : 'image/png',
    tileMatrixSetID: "EPSG:4326",
    maximumLevel: 17,
    minimumLevel: 0,
    tilingScheme: new Cesium.GeographicTilingScheme({
        numberOfLevelZeroTilesX: 2,
        numberOfLevelZeroTilesY: 1
      }),
    ellipsoid: Cesium.Ellipsoid.WGS84,
    rectangle: Cesium.Rectangle.fromDegrees(103.7384033203125, 31.065216064453125, 103.81668090820312, 31.13800048828125),
  })
   */
  /**
   * wms
   * new Cesium.WebMapServiceImageryProvider({
    url: "http://localhost:9527/geoserver/ows?service=WMS",
    layers: 'china:pengzhou',
    maximumLevel: 17,
    minimumLevel: 0,
    tilingScheme: new Cesium.GeographicTilingScheme(),
    rectangle: Cesium.Rectangle.fromDegrees(103.7384033203125, 31.065216064453125, 103.81668090820312, 31.13800048828125),
    ellipsoid: Cesium.Ellipsoid.WGS84,
    parameters: {
      //透明要和format:'image/png'一起开
      transparent: true,
      format: 'image/png',
      // srs: 'EPSG:3857',
      // styles: '',
      // width: 20,
      // height: 20
    }
  })
   */
  /** tms
   new Cesium.UrlTemplateImageryProvider({
    // url: "http://localhost:9527/geoserver/gwc/service/tms/1.0.0/china%3Apengzhou@EPSG%3A3857@png/{z}/{x}/{reverseY}.png",
    // tilingScheme: new Cesium.WebMercatorTilingScheme(),
    url: "http://localhost:9527/geoserver/gwc/service/tms/1.0.0/china%3Apengzhou@EPSG%3A4326@png/{z}/{x}/{reverseY}.png",
    tilingScheme: new Cesium.GeographicTilingScheme(),
    minimumLevel: 0,
    maximumLevel: 17,
    rectangle: Cesium.Rectangle.fromDegrees(103.7384033203125, 31.065216064453125, 103.81668090820312, 31.13800048828125)
  })
   */
  const viewer = new Cesium.Viewer('cesiumContainer', {
    imageryProvider: tdtImage, // 地图底图服务
    shouldAnimate: true, //是否允许动画
    selectionIndicator: false,
    navigationInstructionsInitiallyVisible: false,
    showRenderLoopErrors: false,
    shadows: false,
    projectionPicker: false,
    // terrain: Cesium.Terrain.fromWorldTerrain(), // 添加地形高度
    sceneModePicker: false, // 控制右上角第三个位置的选择视角模式，2d，3d
    baseLayerPicker: false, // 控制右上角第四个位置的图层选择器
    navigationHelpButton: false, // 控制右上角第五个位置的导航帮助按钮
    animation: false, // 控制左下角的动画器件
    timeline: false, // 控制下方时间线
    fullscreenButton: false, // 右下角全屏按钮
    geocoder: false, // 控制右上角第一个位置的查找工具
    homeButton: false, // 控制右上角第二个位置的home图标
    infoBox: false, // If set to false, the InfoBox widget will not be created.
    // vrButton:false//右下角vr按钮
  })
  // 抗锯齿
  viewer.scene.fxaa = true
  viewer.scene.postProcessStages.fxaa.enabled = false
  // 水雾特效
  viewer.scene.globe.showGroundAtmosphere = true
  // 设置最大俯仰角，[-90,0]区间内，默认为-30，单位弧
  viewer.scene.screenSpaceCameraController.constrainedPitch =
    Cesium.Math.toRadians(-20)
  viewer.scene.screenSpaceCameraController.autoResetHeadingPitch = false
  viewer.scene.screenSpaceCameraController.inertiaZoom = 0.5
  viewer.scene.screenSpaceCameraController.minimumZoomDistance = 50
  viewer.scene.screenSpaceCameraController.maximumZoomDistance = 20000000
  viewer.scene.screenSpaceCameraController.zoomEventTypes = [
    Cesium.CameraEventType.RIGHT_DRAG,
    Cesium.CameraEventType.WHEEL,
    Cesium.CameraEventType.PINCH,
  ]
  viewer.scene.screenSpaceCameraController.tiltEventTypes = [
    Cesium.CameraEventType.MIDDLE_DRAG,
    Cesium.CameraEventType.PINCH,
    {
      eventType: Cesium.CameraEventType.LEFT_DRAG,
      modifier: Cesium.KeyboardEventModifier.CTRL,
    },
    {
      eventType: Cesium.CameraEventType.RIGHT_DRAG,
      modifier: Cesium.KeyboardEventModifier.CTRL,
    },
  ]
  // 取消默认的双击事件
  viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
    Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
  )

  // 叠加影像服务
  var imgMap = new Cesium.UrlTemplateImageryProvider({
    url: tdtUrl + 'DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + token,
    subdomains: subdomains,
    tilingScheme: new Cesium.WebMercatorTilingScheme(),
    maximumLevel: 18,
  })
  // viewer.imageryLayers.addImageryProvider(imgMap)

  // 叠加国界服务
  // var iboMap = new Cesium.UrlTemplateImageryProvider({
  //   url: tdtUrl + 'DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=' + token,
  //   subdomains: subdomains,
  //   tilingScheme: new Cesium.WebMercatorTilingScheme(),
  //   maximumLevel: 10,
  // })
  // viewer.imageryLayers.addImageryProvider(iboMap)
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(103.84, 31.15, 17850000),
    orientation: {
      heading: Cesium.Math.toRadians(348.4202942851978),
      pitch: Cesium.Math.toRadians(-89.74026687972041),
      roll: Cesium.Math.toRadians(0),
    },
    complete: function callback() {
      // 定位完成之后的回调函数
    },
  })
  // this.addTiles(viewer);
  viewer._cesiumWidget._creditContainer.style.display = 'none' // 隐藏版权
}
</script>

<style scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.box {
  width: 100%;
  height: 100%;
}
</style>
