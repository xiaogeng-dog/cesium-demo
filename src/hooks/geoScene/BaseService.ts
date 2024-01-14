/**
 * geoScene 地图基本方法
 */
// import {
//   FeatureLayerProperties,
//   LabelClassProperties,
// } from '@geoscene/core/interfaces.d.ts'
import '@geoscene/core/interfaces.d.ts'

import Map from '@geoscene/core/Map'
import MapView from '@geoscene/core/views/MapView'
import SceneView from '@geoscene/core/views/SceneView'

import Ground from '@geoscene/core/Ground'
import ElevationLayer from '@geoscene/core/layers/ElevationLayer'
// 添加点要素图层
import FeatureLayer from '@geoscene/core/layers/FeatureLayer'
import WMTSLayer from '@geoscene/core/layers/WMTSLayer'

export class BaseService {
  public map!: Map
  public mapView!: MapView
  public sceneView!: SceneView

  constructor(
    element: string | HTMLDivElement,
    options?: any,
    callback?: (viewer: any) => void,
  ) {
    // 使用自定义高程图层覆盖的世界高程图层创建地图
    const worldElevation = new ElevationLayer({
      url: '//links.geoscene.cn/elevation3d/rest/services/WorldElevation3D/Terrain3D/ImageServer',
    })
    const customElevation = new ElevationLayer({
      url: 'https://my.geoscene.cn/geoscene/rest/service/MyElevationService/ImageServer',
    })
    this.map = new Map({
      // basemap: 'tianditu-vector', //底图图层服务
      basemap: 'geoscene-blue', // 底图图层服务
      // ground: new Ground({
      //   layers: [worldElevation, customElevation],
      // }),
      // ground: 'world-elevation', //高程服务
    })
    this.#_init2DMap(element)
  }

  #_init2DMap(element: string | HTMLDivElement): MapView {
    this.mapView = new MapView({
      map: this.map,
      center: [116, 39], // 经度，纬度
      zoom: 5, // 缩放级别
      container: element, // Div 元素
    })
    return this.mapView
  }

  #_init3DMap(element: string | HTMLDivElement): SceneView {
    this.sceneView = new SceneView({
      container: element,
      map: this.map,
      // camera: {
      //   position: {
      //     x: 128.0522605138008, //经度
      //     y: 41.847540077153155, //纬度
      //     z: 9260, //米
      //   },
      //   // tilt: 65,
      // },
    })
    return this.sceneView
  }

  addFeatureLayer() {
    const trailheadsRenderer = {
      type: 'simple',
      symbol: {
        type: 'picture-marker',
        url: 'http://doc.geoscene.cn/resources/images/Symbols/NPS/npsPictograph_0231b.png',
        width: '18px',
        height: '18px',
      },
    }

    const trailheadsLabels = {
      symbol: {
        type: 'text',
        color: '#FFFFFF',
        haloColor: '#5E8D74',
        haloSize: '2px',
        font: {
          size: '12px',
          family: 'Noto Sans',
          style: 'italic',
          weight: 'normal',
        },
      },

      labelPlacement: 'above-center',
      labelExpressionInfo: {
        expression: '$feature.TRL_NAME',
      },
    }
    //Trailheads 要素图层 (点)
    // const trailheadsLayer = new FeatureLayer({
    //   url: 'http://180.97.207.58:8082/gis_map/8d34ed08af1042c7950044b7b7518751/sicp/KS_dljg2/FeatureServer',
    //   renderer: {
    //     type: 'simple',
    //     symbol: {
    //       type: 'picture-marker',
    //       url: 'http://doc.geoscene.cn/resources/images/Symbols/NPS/npsPictograph_0231b.png',
    //       width: '18px',
    //       height: '18px',
    //     },
    //   },
    //   labelingInfo: [trailheadsLabels],
    // })
    // this.map.add(trailheadsLayer, 0)
  }

  addWMTSLayer() {
    // 典型用法
    const wMTSLayer = new WMTSLayer({
      url: 'http://2.36.80.109:82/8d34ed08af1042c7950044b7b7518751/sicp/ks_ssdt_01/MapServer/WMTS', // 服务的url
      activeLayer: {
        id: 'Hosted_ks_ssdt_01',
      },
    })
    this.map.add(wMTSLayer, 0)
  }
}
