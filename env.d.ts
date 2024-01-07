/// <reference types="vite/client" />

import { BaseService as CesiumBaseService } from '@/hooks/cesium'

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent
  export default component
}

declare global {
  interface Window {
    cesiumMapService: CesiumBaseService
  }
}

window.cesiumMapService = Window.cesiumMapService || {}
