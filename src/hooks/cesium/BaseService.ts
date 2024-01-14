/**
 * cesium 地图基本方法
 */
import { BaseCesiumServiceInterface } from '../interface'
import {
  Viewer,
  Cartesian3,
  Entity,
  Camera,
  Rectangle,
  Matrix4,
  EasingFunction,
  Math as CesiumMath,
  Cartographic,
  Cartesian2,
  Cesium3DTileset,
  sampleTerrainMostDetailed,
  ArcGISTiledElevationTerrainProvider,
  Ellipsoid,
  I3SDataProvider,
  HeadingPitchRange,
} from 'cesium'

export class BaseService implements BaseCesiumServiceInterface {
  public map!: Viewer

  public defaultCameraPosition!: Cartesian3

  public defaultCameraPositionZ!: number

  public init(
    element: string | HTMLElement,
    options: Viewer.ConstructorOptions,
    callback?: (viewer: Viewer) => void,
  ): Viewer {
    const map = new Viewer(element, this.getOptions(options))
    // 影藏掉底部的logo
    const logo: HTMLElement = document.querySelector(
      '.cesium-viewer-bottom',
    ) as HTMLElement
    if (logo) {
      logo.style.display = 'none'
    }
    map.scene.morphTo3D(0.0) //默认三维地图
    //关闭快速抗锯齿,文字清晰
    map.scene.postProcessStages.fxaa.enabled = false
    // 1. 禁止左键拖动视角
    // false 就是禁止，true 就是允许
    map.scene.screenSpaceCameraController.enableRotate = true
    // 2. 禁止中键控制视角缩放
    // false 就是禁止，true 就是允许
    map.scene.screenSpaceCameraController.enableZoom = true

    map.scene.highDynamicRange = false
    //禁止相机入地
    map.scene.screenSpaceCameraController.minimumZoomDistance = 2500 //原来是100
    ;(map.scene.screenSpaceCameraController as any)._minimumZoomRate = 30000 //设置相机缩小时的速率
    map.clock.onTick.addEventListener(() => {
      if (map.camera.pitch > 0) {
        map.scene.screenSpaceCameraController.enableTilt = false
      }
    })
    callback?.(map)
    this.defaultCameraPosition = map.camera.position
    this.defaultCameraPositionZ = map.camera.position.z
    options.homeButton &&
      map.homeButton.viewModel.command.beforeExecute.addEventListener((e) => {
        e.cancel = true
        this.resetMap()
      })
    this.map = map
    return this.map
  }

  /**
   * 添加大雁塔模型
   */
  async Add3DTileset() {
    const viewer = this.map
    try {
      const tileSetModel = await Cesium3DTileset.fromUrl(
        'http://180.97.207.58:8082/gis_map/8d34ed08af1042c7950044b7b7518751/sicp/ks_cim_bm_2023/SceneServer',
      )
      // 加载3D瓦片集模型
      this.map.scene.primitives.add(tileSetModel)
      this.map.scene.globe.depthTestAgainstTerrain = true
      this.map.zoomTo(
        tileSetModel,
        new HeadingPitchRange(
          0.0,
          -0.5,
          tileSetModel.boundingSphere.radius * 2.0,
        ),
      )
    } catch (error) {
      console.log(`Error loading tileset: ${error}`)
    }
  }

  async AddI3S3DTileset() {
    const viewer = this.map
    try {
      const i3sProvider = await I3SDataProvider.fromUrl(
        'https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_3DObjects_1_7/SceneServer/layers/0',
        {
          traceFetches: false, // for tracing I3S fetches
          geoidTiledTerrainProvider:
            await ArcGISTiledElevationTerrainProvider.fromUrl(
              'https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/EGM2008/ImageServer',
            ), // pass the geoid service
          cesium3dTilesetOptions: {
            skipLevelOfDetail: false,
            debugShowBoundingVolume: false,
          }, // options for internal Cesium3dTileset
        },
      )
      // 加载3D瓦片集模型
      this.map.scene.primitives.add(i3sProvider)
      this.map.scene.globe.depthTestAgainstTerrain = true
      const center = Rectangle.center(i3sProvider.extent)
      center.height = 5000.0
      viewer.camera.setView({
        destination: Ellipsoid.WGS84.cartographicToCartesian(center),
        orientation: {
          // heading: CesiumMath.toRadians(90.0), // east, default value is 0.0 (north)
          pitch: CesiumMath.toRadians(-0), // default value (looking down)
        },
      })
    } catch (error) {
      console.log(`Error loading tileset: ${error}`)
    }
  }

  /**
   * 重置地图
   * @returns 地图实例
   */
  public resetMap(): Viewer {
    this.map?.camera.flyTo({
      destination: Cartesian3.fromDegrees(
        117.16,
        32.71,
        this.defaultCameraPositionZ,
      ),
    })
    return this.map
  }

  public getPosition(longitude: number, latitude: number, height?: number) {
    return Cartesian3.fromDegrees(longitude, latitude, height)
  }

  protected getOptions(
    options: Viewer.ConstructorOptions,
  ): Viewer.ConstructorOptions {
    return {
      animation: options.animation || false, // 是否创建动画小器件，左下角仪表
      baseLayerPicker: options.baseLayerPicker || false, //是否显示图层选择器
      fullscreenButton: options.fullscreenButton || false, // 是否显示全屏按钮
      vrButton: options.vrButton || false, //是否显示VR按钮
      geocoder: options.geocoder || false, //是否显示geocoder小器件，右上角查询按钮
      homeButton: options.homeButton || false, //是否显示Home按钮
      infoBox: options.infoBox || false, //是否显示信息框
      sceneModePicker: options.sceneModePicker || false, // 是否显示3D/2D选择器
      selectionIndicator: options.selectionIndicator || false, // 是否显示选取指示器组件
      timeline: options.timeline || false, // 是否显示时间轴
      navigationHelpButton: options.navigationHelpButton || false, // 是否显示右上角的帮助按钮
      scene3DOnly: true, // 如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
      navigationInstructionsInitiallyVisible: false,
      showRenderLoopErrors: false,
      //   imageryProvider: options.imageryProvider,
      requestRenderMode:
        typeof options.requestRenderMode === 'boolean'
          ? options.requestRenderMode
          : true,
      ...options,
    }
  }

  /**
   * 创建marker
   * @param options
   */
  public createMarker(options: Entity.ConstructorOptions) {
    return new Entity(options)
  }

  /**
   * 相机飞行
   * @param options
   */
  public flyTo(options: {
    destination: Cartesian3 | Rectangle
    orientation?: any
    duration?: number
    complete?: Camera.FlightCompleteCallback
    cancel?: Camera.FlightCancelledCallback
    endTransform?: Matrix4
    maximumHeight?: number
    pitchAdjustHeight?: number
    flyOverLongitude?: number
    flyOverLongitudeWeight?: number
    convert?: boolean
    easingFunction?: EasingFunction.Callback
  }) {
    return this.map.camera.flyTo(options)
  }

  /**
   * 中心视图设置
   * @param camera
   * @param options
   */
  public setView(
    camera: Camera,
    options: {
      destination?: Cartesian3 | Rectangle
      orientation?: any
      endTransform?: Matrix4
      convert?: boolean
    },
  ) {
    return camera.setView(options)
  }

  /**
   * 获取经纬度 椭球上的点
   * @param event
   */
  public getCoordinate(event: { position: Cartesian2 }) {
    // pickEllipsoid 获取椭球上的点的经纬度（椭球上的点）
    const cartesian: Cartesian3 = this.map.camera.pickEllipsoid(
      event.position,
    ) as Cartesian3
    // getPickRay 获取地表面的点的经纬度（地形上的点
    // pickPosition 获取场景里的点的经纬度（模型上的点）
    const cartographic = Cartographic.fromCartesian(cartesian)
    const lng = CesiumMath.toDegrees(cartographic.longitude) // 经度
    const lat = CesiumMath.toDegrees(cartographic.latitude) // 纬度
    const alt = cartographic.height // 高度，椭球面height永远等于0
    const coordinate = {
      longitude: Number(lng.toFixed(6)),
      latitude: Number(lat.toFixed(6)),
      altitude: Number(alt.toFixed(2)),
    }
    return coordinate
    console.log(coordinate)
  }
}
