import PanoScene from '@/components/PanoScene'
import PanoViewer from '@/components/PanoViewer'
import PanoInfoSpot from '@/components/PanoInfoSpot'
import PanoMesh from '@/components/PanoMesh'
import PanoLine from '@/components/PanoLine'

const Components = [
  PanoViewer,
  PanoScene,
  PanoInfoSpot,
  PanoMesh,
  PanoLine,
]

const install = function (Vue, opts = {}) {
  Components.forEach(component => {
    Vue.component(component.name, component)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  PanoViewer,
  PanoScene,
  PanoInfoSpot,
  PanoMesh,
  PanoLine
}
