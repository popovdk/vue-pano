<script>
import * as THREE from 'panolens/node_modules/three'
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
    autoClose: {
      type: Boolean,
      default: true
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
    mesh: null
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
      // Generate Vector3D
      this.points.forEach(point => {
        const coord = Utils.xyToVector3(this.getScene(), point[0], point[1])

        if (coord !== undefined) {
          this.vertices.push(coord.negate())
        }
      })

      // Auto close
      if (this.autoClose && this.points[0] !== this.points[this.points.length - 1]) {
        const coord = Utils.xyToVector3(this.getScene(), this.points[0][0], this.points[0][1])

        if (coord !== undefined) {
          this.vertices.push(coord.negate())
        }
      }

      const normal = new THREE.Vector3(0, 1, 0) // I already know the normal of xz-plane ;)
      const normalZ = new THREE.Vector3(0, 0, 1) // base normal of xy-plane
      const quaternion = new THREE.Quaternion().setFromUnitVectors(normal, normalZ)
      const quaternionBack = new THREE.Quaternion().setFromUnitVectors(normalZ, normal)

      this.vertices.forEach(point => {
        point.applyQuaternion(quaternion)
      })

      const shape = new THREE.Shape(this.vertices)
      const shapeGeom = new THREE.ShapeGeometry(shape)

      this.vertices.forEach(point => {
        point.applyQuaternion(quaternionBack)
      })

      shapeGeom.vertices = this.vertices

      this.mesh = new THREE.Mesh(shapeGeom, new THREE.MeshBasicMaterial({
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

      this.addObject(this.mesh)
      this.getScene().add(this.mesh)
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
