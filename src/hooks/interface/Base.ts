import { Viewer } from 'cesium'

export abstract class BaseCesiumServiceInterface {
  /**
   * 地图初始化
   * @param element<string | HTMLElement> dom节点
   * @param options<MapOptions> cesium 配置
   * @param callback
   */
  public abstract init(
    element: string | HTMLElement,
    options: Viewer.ConstructorOptions,
    callback?: (viewer: Viewer) => void,
  ): Viewer
}

export interface MapInitEvent {
  initEvent: (...args: any[]) => void
}
