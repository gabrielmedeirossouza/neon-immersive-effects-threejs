import * as THREE from './node_modules/three/src/Three.js'
import anime from './node_modules/animejs/lib/anime.es.js'

let CurrentTimeBeforeUpdate = 0

let MaterialRandomColor = false

const Dom = document.querySelector('.main-canvas')

const Scene = new THREE.Scene()

const Renderer = new THREE.WebGLRenderer({
  canvas: Dom,
  antialias: true
})

const Camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

const Geometry = new THREE.BoxGeometry( 0.15, 0.15, 10 )

const GhostFocus = new THREE.Vector3( 0, 0, 0 )

{
  Renderer.setSize(
    window.innerWidth,
    window.innerHeight
  )
}

{
  Camera.position.z = 5
  Camera.position.x = 0
  Camera.position.y = 1

  Camera.lookAt(GhostFocus)
}

{
  const gridHelper = new THREE.GridHelper( 4, 20 )
  Scene.add( gridHelper )
  Scene.add( new THREE.AxesHelper() )
}

function update(currentTime) {
  Renderer.render(Scene, Camera)

  if (currentTime - CurrentTimeBeforeUpdate >= 1) {
    for (let counter = 0; counter < 3; counter++) {
      generateSpectrum()
    }

    CurrentTimeBeforeUpdate = currentTime
  }

  requestAnimationFrame(update)
}

window.requestAnimationFrame(update)

function generateSpectrum() {
  const material = new THREE.MeshBasicMaterial({
    color: MaterialRandomColor ? '#78DAFD' : '#FE5BB4'
  })

  const cube = new THREE.Mesh(Geometry, material)

  const angle = Math.random() * Math.PI

  cube.position.x = (Math.cos(angle) - 0.5) * 20 + (Math.random() * 10)
  cube.position.y = (Math.sin(angle) - 0.5) * 20 + (Math.random() * 10)
  cube.position.z = 0

  MaterialRandomColor = !MaterialRandomColor

  Scene.add(cube)

  anime({
    targets: cube.position,
    easing: 'linear',
    duration: 1500,
    z: -100,
    complete: () => {
      Scene.remove(cube)
    }
  })
}
