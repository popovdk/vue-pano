import * as THREE from 'three'

/**
 * @param position
 * @returns {THREE.Vector2}
 */
export function xyToVector2 (position) {
  return new THREE.Vector2(position.x, position.y)
}

/**
 * @param position
 * @returns {THREE.Vector3}
 */
export function xyzToVector3 (position) {
  return new THREE.Vector3(-position.x, -position.y, position.z)
}

/**
 * @param x
 * @param y
 * @param width
 * @param height
 * @returns {{x: number, y: number}}
 */
export function xyToUv (x, y, width, height) {
  return {
    x: x / width,
    y: y / height
  }
}

/**
 * @param mesh
 * @param point
 * @returns {*}
 */
export function uvWrap (mesh, point) {
  const geometry = new THREE.Geometry().fromBufferGeometry(mesh.geometry)
  const result = []
  const uvs = geometry.faceVertexUvs[0]
  const { faces } = geometry

  for (let i = 0; i < uvs.length; i += 1) {
    const uv = uvs[i]
    const face = faces[i]
    if (this.inUv(uv, point)) {
      const wMatrix = new THREE.Matrix4().multiplyMatrices(
        this.makeInitialUvMatrix(uv), this.makeFaceWorldMatrix(mesh, face))
      wMatrix.transpose()
      const uvPoint = new THREE.Vector3(point.x, point.y, 1)
      uvPoint.applyMatrix4(wMatrix)
      result.push(uvPoint)
    }
  }

  return result[0]
}

/**
 * @param uv
 * @returns {*}
 */
export function makeInitialUvMatrix (uv) {
  const uvMatrix = new THREE.Matrix4()
  uvMatrix.set(
    uv[0].x, uv[0].y, 0, 1,
    uv[1].x, uv[1].y, 0, 1,
    uv[2].x, uv[2].y, 0, 1,
    0, 0, 1, 0
  )
  return new THREE.Matrix4().getInverse(uvMatrix)
}

/**
 * @param mesh
 * @param face
 * @returns {*}
 */
export function makeFaceWorldMatrix (mesh, face) {
  const geometry = new THREE.Geometry().fromBufferGeometry(mesh.geometry)
  const { vertices } = geometry

  const a = vertices[face.a].clone().applyMatrix4(mesh.matrixWorld)
  const b = vertices[face.b].clone().applyMatrix4(mesh.matrixWorld)
  const c = vertices[face.c].clone().applyMatrix4(mesh.matrixWorld)
  return new THREE.Matrix4().set(
    a.x, a.y, a.z, 0,
    b.x, b.y, b.z, 0,
    c.x, c.y, c.z, 0,
    0, 0, 0, 1
  )
}

/**
 * @param uv
 * @param point
 * @returns {boolean}
 */
export function inUv (uv, point) {
  const x = point.x - uv[0].x
  const y = point.y - uv[0].y
  const s = (uv[1].x - uv[0].x) * y - (uv[1].y - uv[0].y) * x > 0
  if (((uv[2].x - uv[0].x) * y - (uv[2].y - uv[0].y) * x > 0) === s) {
    return false
  }
  const beg = (uv[2].y - uv[1].y) * (point.x - uv[1].x)
  const end = (uv[2].x - uv[1].x) * (point.y - uv[1].y)
  return (end - beg > 0) === s
}
