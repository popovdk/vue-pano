<template>
  <div class="vue-pano-viewer" ref="viewer">
    <slot></slot>
  </div>
</template>

<script>
import * as PanoLens from 'panolens/build/panolens.module'

export default {
  name: 'PanoViewer',
  props: {
    mainScene: {
      type: String,
      required: true
    },
    cameraFov: {
      type: Number,
      default: 100
    },
    noZoom: {
      type: Boolean,
      default: false
    },
    controlBar: {
      type: Boolean,
      default: true
    },
    autoHideInfospot: {
      type: Boolean,
      default: true
    },
    autoRotate: {
      type: Boolean,
      default: false
    },
    autoRotateSpeed: {
      type: Number,
      default: 1.0
    },
    tweenDuration: {
      type: Number,
      default: 1500
    },
    fastShowInfospot: {
      type: Boolean,
      default: true
    },
    enableReticle: {
      type: Boolean,
      default: false
    },
    horizontalView: {
      type: Boolean,
      default: false
    }
  },
  provide () {
    return {
      getMainScene: () => this.mainScene,
      getViewer: () => this.viewer,
      setCameraPosition: this.setCameraPosition,
      switchScene: this.switchScene,
      addScene: this.addScene,
      viewerReady: () => this.isReady
    }
  },
  data () {
    return {
      viewer: null,
      isReady: false,

      panoramas: [],
      currentScene: '',

      scenes: []
    }
  },
  mounted () {
    this.currentScene = this.mainScene
    this.initialize()
  },
  methods: {
    initialize () {
      this.viewer = new PanoLens.Viewer({
        container: this.$refs.viewer,
        cameraFov: this.cameraFov,
        controlBar: this.controlBar,
        autoHideInfospot: this.autoHideInfospot,
        autoRotate: this.autoRotate,
        autoRotateSpeed: this.autoRotateSpeed,
        enableReticle: this.enableReticle,
        horizontalView: this.horizontalView
      })

      this.viewer.OrbitControls.noZoom = this.noZoom
      this.viewer.render()

      this.$nextTick(() => {
        this.isReady = true
        this.$emit('init')
      })
    },
    addScene (scene) {
      this.viewer.add(scene)
      this.scenes[scene.name] = scene

      if (scene.name === this.mainScene) {
        this.switchScene(this.mainScene)
      }
    },
    switchScene (sceneName) {
      if (this.scenes[sceneName] === undefined) return false

      this.currentScene = sceneName
      this.viewer.setPanorama(this.scenes[sceneName])

      if (this.scenes[sceneName].center !== undefined) {
        this.setCameraPosition(this.scenes[sceneName].center)

        if (this.fastShowInfospot) {
          this.scenes[sceneName].showInfoSpots(true)
        }
      }

      this.$emit('change', this.currentScene)
    },
    setCameraPosition (position) {
      this.viewer.tweenControlCenter(position, this.tweenDuration)
    },
    clearAll () {
      this.scenes.forEach(scene => this.viewer.remove(scene))
    }
  },
  destroyed () {
    if (this.viewer) {
      this.viewer.dispose()
      this.viewer.destroy()
      this.viewer = null
    }
  }
}
</script>

<style scoped lang="scss">
.vue-pano-viewer {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
