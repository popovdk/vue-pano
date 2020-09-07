<template>
  <div style="display: none">
    <slot></slot>
  </div>
</template>

<script>
import * as PanoLens from 'panolens/build/panolens.module'
import * as Utils from '../utils'

export default {
  name: 'PanoScene',
  inject: ['addScene', 'viewerReady', 'setCameraPosition', 'switchScene', 'getViewer'],
  props: {
    name: {
      required: true
    },
    cartesian: {
      type: Boolean,
      default: false
    },
    source: {
      type: String,
      required: true
    },
    video: {
      type: Boolean,
      default: false
    },
    center: {
      type: Object,
      required: true,
      validator: value => value.x !== undefined && value.y !== undefined
    }
  },
  watch: {
    canMount () {
      if (this.canMount) {
        this.addScene(this.defineScene())
      }
    }
  },
  computed: {
    canMount () {
      return this.viewerReady()
    }
  },
  provide () {
    return {
      addInfoSpot: this.addInfoSpot,
      getScene: this.getScene,
      getViewer: this.getViewer,
      sceneReady: () => this.isReady
    }
  },
  data () {
    return {
      scene: null,
      isReady: false,
      infoSpots: []
    }
  },
  mounted () {
    this.$on('switch-scene', (scene) => {
      this.scene.showInfoSpots(false)
      this.switchScene(scene)
    })

    if (this.canMount) {
      this.addScene(this.defineScene())
    }
  },
  methods: {
    defineScene () {
      if (this.scene !== null) return false

      this.scene = this.video ? new PanoLens.VideoPanorama(this.source) : new PanoLens.ImagePanorama(this.source)
      this.scene.name = this.name
      this.scene.geometry.uvsNeedUpdate = true

      this.scene.addEventListener('load', () => {
        // Create center XYZ position
        const processedCenter = Utils.processCoordinates(
          this.center.x,
          this.center.y,
          this.scene.material.map.image.width,
          this.scene.material.map.image.height,
          this.cartesian
        )
        this.scene.center = Utils.xyzToVector3(Utils.uvWrap(
          this.scene, Utils.xyToVector2(
            Utils.xyToUv(
              processedCenter.x,
              processedCenter.y,
              this.scene.material.map.image.width,
              this.scene.material.map.image.height
            )
          )
        ))

        if (this.scene.center) {
          this.setCameraPosition(this.scene.center)
        }

        this.isReady = true
        this.$emit('load')
      })

      this.scene.showInfoSpots = this.showInfoSpots

      return this.scene
    },
    getScene () {
      return this.scene
    },
    addInfoSpot (infoSpot) {
      this.infoSpots.push(infoSpot)
      this.scene.add(infoSpot)
    },
    showInfoSpots (display = true) {
      this.infoSpots.forEach(infoSpot => display ? infoSpot.show() : infoSpot.onDismiss())
    }
  },
  destroyed () {
    if (this.scene !== null) {
      this.scene.dispose()
    }
  }
}
</script>

<style scoped>

</style>
