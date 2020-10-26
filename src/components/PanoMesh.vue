<script>
import * as THREE from 'three'
import * as Utils from '../utils'

export default {
  name: 'PanoMesh',
  inject: ['getScene', 'sceneReady', 'getViewer', 'addObject'],
  props: {
    points: {
      type: Array,
      default: () => ([])
    },
    color: {
      type: Number,
      default: 0x0000ff
    },
    opacity: {
      type: Number,
      default: 0.3
    },
    wireframe: {
      type: Boolean,
      default: false
    },
    hoverCursor: {
      type: String,
      default: 'pointer'
    },
    hoverOpacity: {
      type: Number,
      default: 0.3
    }
  },
  data: () => ({
    vertices: [],
    geometry: null,
    material: null,
    shape: null
  }),
  render () {
    return null
  },
  watch: {
    canMount () {
      if (this.sceneReady) {
        this.createShape()
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
      this.createShape()
    }
  },
  methods: {
    createShape () {
      const holes = []
      this.points.forEach(point => {
        this.vertices.push(Utils.xyToVector3(this.getScene(), point[0], point[1]).negate())
      })
      this.geometry = new THREE.Geometry()
      this.geometry.vertices = this.vertices
      this.triangles = THREE.ShapeUtils.triangulateShape(this.geometry.vertices, holes)

      for (let i = 0; i < this.triangles.length; i++) {
        this.geometry.faces.push(new THREE.Face3(this.triangles[i][0], this.triangles[i][1], this.triangles[i][2]))
      }

      this.mesh = new THREE.Mesh(this.geometry, new THREE.MeshBasicMaterial({
        color: this.color,
        wireframe: this.wireframe,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: this.opacity
      }))

      this.mesh.onLeave = this.onLeave
      this.mesh.onHover = this.onHover
      this.mesh.onClick = this.onClick
      this.mesh.hoverCursor = this.hoverCursor

      this.getScene().add(this.mesh)
      this.addObject(this.mesh)
    },
    setOpacity (opacity) {
      this.mesh.material.opacity = opacity
    },
    onLeave () {
      this.setOpacity(this.opacity)
      this.$emit('leave', this)
    },
    onHover () {
      this.setOpacity(this.hoverOpacity)
      this.$emit('hover', this)
    },
    onClick () {
      this.$emit('click', this)
    }
  }
}
</script>
