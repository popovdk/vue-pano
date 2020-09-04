# vue-pano

A [PanolensJS](https://pchen66.github.io/Panolens/) panorama for Vue.js 2.0.

## Install
```
npm i @black40x/vue-pano
```

## Quick Start
``` javascript
import Vue from 'vue'
import VuePano from '@black40x/vue-pano'
import '@black40x/vue-pano/dist/vue-pano.css'

Vue.use(VuePano)
```

## Usage

``` html
<template>
  <pano-viewer main-scene="first">
    <pano-scene
      name="first"
      source="http://mySource.com/360-image.jpeg"
      :center="{x: 1970, y: 570}"
      >
      <pano-info-spot
        label="Info point"
        :position="{x: 1970, y: 570}"
        to="sceneName"
      />
    </pano-scene>
  </pano-viewer
</template>
```
