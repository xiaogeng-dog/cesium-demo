import * as echarts from 'echarts'
import 'echarts-liquidfill'
import 'echarts-gl'
export default class useEchart {
  constructor(target, options) {
    this.echartInstance = null
    this.intervalTimer = null
    this.target = target
    this.echarts = echarts
    this.options = options
    if (this.echartInstance) {
      this._taskID = new Date()
    } else {
      this._initEcharts()
    }
    // if (this.options) {
    //   this.setOption(this.options)
    // }
  }

  _initEcharts() {
    this.echartInstance = this.echarts.init(this.target, null, {
      renderer: 'svg',
      ...this.options
    })
  }
  // 为了方便 该 hooks 的使用
  setOption(option) {
    this.echartInstance.setOption(option)
  }

  resizeEchart() {
    this.echartInstance.resize()
  }
  registerMap(json) {
    echarts.registerMap('map-json', json)
  }
  disposeEcharts() {
    this.echartInstance && this.echartInstance.dispose() // 销毁实例
  }

  //获取屏幕宽度并计算比例
  fontSize(res) {
    let clientWidth =
      window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    if (!clientWidth) return
    let fontSize = 100 * (clientWidth / 1920)
    return res * fontSize
  }

  animationRotate(dataLength, duration = 3000) {
    let currentIndex = -1
    setInterval(() => {
      const dataLen = dataLength
      // 取消之前高亮的图形
      this.echartInstance.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: currentIndex
      })
      currentIndex = (currentIndex + 1) % dataLen
      // 高亮当前图形
      this.echartInstance.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: currentIndex
      })
      // 显示 tooltip
      this.echartInstance.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: currentIndex
      })
    }, duration)
  }

  clearPoll(time = this.intervalTimer) {
    time && clearInterval(time)
  }
  // 轮询
  poll(dataLength = 5, startValue = 0, endValue = 4, timer = 3 * 1000) {
    if (this.intervalTimer) clearInterval(this.intervalTimer)
    this.intervalTimer = setInterval(() => {
      // 如果是最后一个？
      if (endValue >= dataLength) {
        // 还原
        this.echartInstance.dispatchAction({
          type: 'dataZoom',
          startValue: (startValue = 0),
          endValue: (endValue = 4)
        })
      } else {
        // 轮播
        this.echartInstance.dispatchAction({
          type: 'dataZoom',
          startValue: (startValue += 1),
          endValue: (endValue += 1)
        })
      }
    }, timer)

    return this.intervalTimer
  }
}
