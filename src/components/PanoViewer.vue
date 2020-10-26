<template>
  <div class="vue-pano-viewer"
       ref="viewer"
       @click="handleClick"
       @mousemove="handleRaycaster">
    <slot></slot>
  </div>
</template>

<script>
import * as THREE from 'three'
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
    maxFov: {
      type: Number,
      default: 120
    },
    minFov: {
      type: Number,
      default: 30
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
      getViewer: () => this.getViewer(),
      getCurrentScene: () => this.getScene(),
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

      panoScenes: [],
      scenes: [],

      intersectsObjects: [],
      raycaster: null,
      mouse: null
    }
  },
  watch: {
    intersectsObjects (oldObj, newObj) {
      const oldUUID = oldObj.length > 0 ? oldObj[0].object.uuid : ''
      const newUUID = newObj.length > 0 ? newObj[0].object.uuid : ''

      if ((oldUUID !== newUUID) && (oldObj.length > 0)) {
        if (oldObj[0].object.onLeave !== undefined) {
          oldObj[0].object.onHover()
        }

        if (oldObj[0].object.hoverCursor !== undefined) {
          this.viewer.renderer.domElement.style.cursor = oldObj[0].object.hoverCursor
        }
      }

      if ((oldUUID !== newUUID) && (newObj.length > 0)) {
        if (newObj[0].object.onLeave !== undefined) {
          newObj[0].object.onLeave()
          this.viewer.renderer.domElement.style.cursor = 'auto'
        }
      }
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

      this.viewer.OrbitControls.minFov = this.minFov
      this.viewer.OrbitControls.maxFov = this.maxFov
      this.viewer.OrbitControls.noZoom = this.noZoom

      this.viewer.render()
      this.initRaycaster()
      this.tapEvent()

      this.$nextTick(() => {
        this.isReady = true
        this.$emit('init')
      })
    },
    getViewer () {
      return this.viewer
    },
    getScene () {
      return this.scenes[this.currentScene]
    },
    getPanoScene () {
      return this.panoScenes[this.currentScene]
    },
    addScene (scene, panoScene) {
      this.viewer.add(scene)
      this.scenes[scene.name] = scene
      this.panoScenes[scene.name] = panoScene

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

      this.viewer.OrbitControls.minPolarAngle = this.getPanoScene().minPolarAngle
      this.viewer.OrbitControls.maxPolarAngle = this.getPanoScene().maxPolarAngle
      this.viewer.OrbitControls.minAzimuthAngle = this.getPanoScene().minAzimuthAngle
      this.viewer.OrbitControls.maxAzimuthAngle = this.getPanoScene().maxAzimuthAngle

      this.$emit('change', this.currentScene)
    },
    setCameraPosition (position) {
      this.viewer.tweenControlCenter(position, this.tweenDuration)
    },
    setCameraFov (value) {
      if (this.viewer) {
        this.viewer.setCameraFov(value)
        this.viewer.reverseDraggingDirection()
      }
    },
    initRaycaster () {
      this.raycaster = new THREE.Raycaster()
      this.mouse = new THREE.Vector2()
    },
    handleClick (event) {
      event.preventDefault()
      if (!this.viewer) return false

      if (this.intersectsObjects.length > 0) {
        if (this.intersectsObjects[0].object.onClick !== undefined) {
          this.intersectsObjects[0].object.onClick()
        }
      }
    },
    getAzimuthalAngle () {
      return this.viewer.control.getAzimuthalAngle()
    },
    getPolarAngle () {
      return this.viewer.control.getPolarAngle()
    },
    handleRaycaster (event) {
      if (!this.viewer) return false

      if (event.changedTouches !== undefined) {
        if (event.changedTouches.length === 0) {
          return false
        }
        this.mouse.x = (event.changedTouches[0].clientX / this.viewer.renderer.domElement.clientWidth) * 2 - 1
        this.mouse.y = -(event.changedTouches[0].clientY / this.viewer.renderer.domElement.clientHeight) * 2 + 1
      } else {
        this.mouse.x = (event.clientX / this.viewer.renderer.domElement.clientWidth) * 2 - 1
        this.mouse.y = -(event.clientY / this.viewer.renderer.domElement.clientHeight) * 2 + 1
      }

      this.raycaster.setFromCamera(this.mouse, this.viewer.camera)
      this.intersectsObjects = this.raycaster.intersectObjects(this.getPanoScene().objects)
    },
    tapEvent () {
      this.viewer.renderer.domElement.addEventListener('touchstart', this.touchStart)
      this.viewer.renderer.domElement.addEventListener('touchmove', this.touchMove)
      this.viewer.renderer.domElement.addEventListener('touchend', this.touchEnd)
    },
    touchStart () {
      this.touchMoved = false
    },
    touchMove () {
      this.touchMoved = true
    },
    touchEnd (event) {
      if (!this.touchMoved) {
        this.handleRaycaster(event)
        this.handleClick(event)
      }
    },
    clearAll () {
      this.scenes.forEach(scene => this.viewer.remove(scene))
    }
  },
  destroyed () {
    if (this.viewer) {
      this.viewer.renderer.domElement.removeEventListener('touchstart', this.touchStart)
      this.viewer.renderer.domElement.removeEventListener('touchmove', this.touchMove)
      this.viewer.renderer.domElement.removeEventListener('touchend', this.touchEnd)
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
