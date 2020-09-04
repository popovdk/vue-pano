import PanoScene from '@/components/PanoScene'
import PanoViewer from '@/components/PanoViewer'
import PanoInfoSpot from '@/components/PanoInfoSpot'

const Components = [
  PanoViewer,
  PanoScene,
  PanoInfoSpot
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
  PanoInfoSpot
}
