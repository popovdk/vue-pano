import PanoScene from '@/components/PanoScene'
import PanoViewer from '@/components/PanoViewer'
import PanoInfoSpot from '@/components/PanoInfoSpot'
import PanoMesh from '@/components/PanoMesh'

const Components = [
  PanoViewer,
  PanoScene,
  PanoInfoSpot,
  PanoMesh
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
  PanoMesh
}
