<script>
import * as THREE from 'panolens/node_modules/three'
import * as Utils from '../utils'

export default {
  name: 'PanoLine',
  inject: ['getScene', 'sceneReady', 'getViewer'],
  props: {
    points: {
      type: Array,
      default: () => ([])
    },
    color: {
      type: Number,
      default: 0x0000ff
    },
    lineWidth: {
      type: Number,
      default: 1
    },
    lineCap: {
      type: String,
      default: 'round'
    },
    lineJoin: {
      type: String,
      default: 'round'
    }
  },
  data: () => ({
    vertices: [],
    geometry: null,
    material: null,
    line: null
  }),
  render () {
    return null
  },
  watch: {
    canMount () {
      if (this.sceneReady) {
        this.createLine()
      }
    }
  },
  computed: {
    canMount () {
      return this.sceneReady()
    }
  },
  mounted () {
    if (this.canMount) {
      this.createLine()
    }
  },
  methods: {
    createLine () {
      this.points.forEach(point => {
        this.vertices.push(Utils.xyToVector3(this.getScene(), point[0], point[1]).negate())
      })
      this.geometry = new THREE.BufferGeometry().setFromPoints(this.vertices)
      this.material = new THREE.LineBasicMaterial({
        color: this.color,
        linewidth: this.lineWidth,
        linecap: this.lineCap,
        linejoin: this.lineJoin
      })

      this.line = new THREE.Line(this.geometry, this.material)
      this.getScene().add(this.line)
    }
  }
}
</script>
