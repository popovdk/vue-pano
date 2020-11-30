<template>
  <div id="app">
    <pano-viewer no-zoom
                 :camera-fov="80"
                 @loadScene="sceneLoadEnd"
                 @progressScene="sceneLoadStart"
                 :auto-hide-infospot="false"
                 fast-show-infospot
                 main-scene="first">
      <pano-scene
        name="first"
        :source="require('@/assets/rooms/room1.jpeg')"
        :center="{x: 1970, y: 570}"
      >
        <pano-mesh
          @click="setRed"
          @leave="setBlue"
          :hover-opacity="0.5"
          :opacity="0.1"
          :points="[
            [418, 434],
            [419, 523],
            [551, 545],
            [550, 401],
          ]"
        />
        <pano-mesh
          @click="setRed"
          @leave="setBlue"
          :hover-opacity="0.5"
          :opacity="0.1"
          :points="[
            [666, 385],
            [662, 558],
            [829, 569],
            [832, 388],
          ]"
        />
        <pano-info-spot
          :scale="300"
          label="Position 3"
          :icon="require('@/assets/dot.png')"
          :label-delta="30"
          :position="{x: 1970, y: 570}"
          to="third"
        />
        <pano-info-spot
          :scale="300"
          label="Position 3"
          :icon="require('@/assets/dot.png')"
          :label-delta="30"
          :position="{x: 290, y: 590}"
          to="second"
        />
      </pano-scene>

      <pano-scene
        name="second"
        :source="require('@/assets/rooms/room2.jpeg')"
        :center="{x: 120, y: 570}"
      >
        <pano-info-spot
          :scale="300"
          label="Position 1"
          :icon="require('@/assets/dot.png')"
          :label-delta="30"
          :position="{x: 120, y: 570}"
          to="first"
        />
        <pano-info-spot
          :scale="300"
          label="Position 3"
          :icon="require('@/assets/dot.png')"
          :label-delta="30"
          :position="{x: 400, y: 540}"
          to="third"
        />
      </pano-scene>

      <pano-scene
        name="third"
        :source="require('@/assets/rooms/room3.jpeg')"
        :center="{x: 640, y: 590}"
      >
        <pano-info-spot
          :scale="300"
          label="Position 2"
          :icon="require('@/assets/dot.png')"
          :label-delta="30"
          :position="{x: 640, y: 590}"
          to="second"
        />
        <pano-info-spot
          :scale="300"
          label="Position 1"
          :icon="require('@/assets/dot.png')"
          :label-delta="30"
          :position="{x: 950, y: 590}"
          to="first"
        />
      </pano-scene>
    </pano-viewer>
  </div>
</template>

<script>
import PanoViewer from '@/components/PanoViewer'
import PanoScene from '@/components/PanoScene'
import PanoInfoSpot from '@/components/PanoInfoSpot'
import PanoMesh from '@/components/PanoMesh'
export default {
  name: 'App',
  components: {
    PanoMesh,
    PanoInfoSpot,
    PanoScene,
    PanoViewer
  },
  methods: {
    setRed (layout) {
      layout.mesh.material.color = { r: 255, g: 0, b: 0 }
    },
    setBlue (layout) {
      layout.mesh.material.color = { r: 0, g: 0, b: 255 }
    },
    sceneLoadStart () {
      console.log('Load start')
    },
    sceneLoadEnd () {
      console.log('Load end')
    }
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  height: 100vh;
  width: 100vw;
}
</style>
