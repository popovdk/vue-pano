<template>
  <div class="pano-hover-element">
    <slot name="hoverElement"></slot>
    <slot name="dotElement"></slot>
  </div>
</template>

<script>
import * as Utils from '../utils'
import * as PanoLens from 'panolens'

export default {
  name: 'PanoInfoSpot',
  inject: ['addInfoSpot', 'getScene', 'sceneReady', 'getViewer', 'showOneInfoSpot', 'getCurrentScene'],
  props: {
    label: {
      type: String,
      required: true
    },
    labelDelta: {
      type: Number,
      default: 40
    },
    icon: {
      type: String,
      default: undefined
    },
    position: {
      type: Object,
      required: true,
      validator: value => value.x !== undefined && value.y !== undefined
    },
    cartesian: {
      type: Boolean,
      default: false
    },
    focusOnClick: {
      type: Boolean,
      default: false
    },
    scale: {
      type: Number,
      default: 300
    },
    animated: {
      type: Boolean,
      default: true
    },
    to: {
      type: String,
      required: false
    }
  },
  watch: {
    canMount () {
      if (this.sceneReady) {
        this.addInfoSpot(this.defineInfoSpot())
      }
    }
  },
  computed: {
    canMount () {
      return this.sceneReady()
    }
  },
  data () {
    return {
      infoSpot: null
    }
  },
  mounted () {
    if (this.canMount) {
      this.addInfoSpot(this.defineInfoSpot())
    }
  },
  methods: {
    customElementPrototype () {
      const that = this

      PanoLens.Infospot.prototype.updateElement = function (element) {
        this.element = element.elm
        this.element.style.display = 'none'
        this.element.style.position = 'absolute'
        this.element.verticalDelta = 0
        this.element.style.top = '0'

        const spot = this

        const updateTranslate = function () {
          if (that.getScene().name !== that.getCurrentScene().name) {
            spot.element.style.display = 'none'
          } else {
            const vector = that.getViewer().getScreenVector(that.infoSpot.position)
            spot.element.style.display = 'block'
            spot.element.style.transform = 'translate(' + (vector.x) + 'px, ' + (vector.y) + 'px)'
            spot.element._width = spot.element.clientWidth
            spot.element._height = spot.element.clientHeight
            spot.element.dataset.showing = 'false'
          }
        }

        this.element.addEventListener('click', () => {
          that.onClick()
        })

        that.getViewer().addUpdateCallback(updateTranslate)
      }
    },
    defineInfoSpot () {
      if (this.infoSpot !== null) return false

      const processedPosition = Utils.processCoordinates(
        this.position.x,
        this.position.y,
        this.getScene().material.map.image.width,
        this.getScene().material.map.image.height,
        this.cartesian
      )

      const spotPosition = Utils.uvWrap(
        this.getScene(), Utils.xyToVector2(
          Utils.xyToUv(
            processedPosition.x,
            processedPosition.y,
            this.getScene().material.map.image.width,
            this.getScene().material.map.image.height
          )
        )
      )

      if (spotPosition !== undefined) {
        if (this.hasDotElement()) {
          this.infoSpot = new PanoLens.Infospot(1, '', false)
          this.customElementPrototype()
          this.infoSpot.updateElement(this.$slots.dotElement[0])
        } else {
          this.infoSpot = new PanoLens.Infospot(
            this.scale, this.icon ? this.icon : PanoLens.DataImage.Info, this.animated
          )
        }

        this.infoSpot.position.set(-spotPosition.x, -spotPosition.y, spotPosition.z)

        if (this.hasHoverElement()) {
          this.infoSpot.addHoverElement(this.$slots.hoverElement[0].elm, this.labelDelta)
        } else if (!this.hasDotElement()) {
          this.infoSpot.addHoverText(this.label, this.labelDelta)
        }

        this.infoSpot.addEventListener('click', () => {
          this.onClick()
        })

        this.infoSpot.addEventListener('hover', () => {
          this.$emit('hover', this.infoSpot)
        })

        this.infoSpot.addEventListener('hoverenter', () => {
          this.$emit('hoverenter', this.infoSpot)
        })

        this.infoSpot.addEventListener('hoverleave', () => {
          this.$emit('hoverleave', this.infoSpot)
        })

        this.$emit('defined', this.infoSpot)

        this.infoSpot.show()

        return this.infoSpot
      }
    },
    onClick () {
      if (this.to === undefined && this.focusOnClick) {
        this.infoSpot.focus()
      }

      if (this.to !== undefined) {
        this.$parent.$emit('switch-scene', this.to)
      }

      this.showOneInfoSpot(this.infoSpot)

      this.$emit('click', this.infoSpot)
    },
    focus () {
      this.infoSpot.focus()
    },
    hasHoverElement () {
      return this.$slots.hoverElement !== undefined && this.$slots.hoverElement.length > 0
    },
    hasDotElement () {
      return this.$slots.dotElement !== undefined && this.$slots.dotElement.length > 0
    }
  },
  destroyed () {
    if (this.infoSpot !== null) {
      this.infoSpot.dispose()
    }
  }
}
</script>

<style scoped>

</style>
