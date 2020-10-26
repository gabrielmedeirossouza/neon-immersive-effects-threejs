import * as THREE from './node_modules/three/src/Three.js'
import anime from './node_modules/animejs/lib/anime.es.js'

let fl = false

let currentTimeBeforeUpdate = 0

let fpsBeforeUpdate = 0

let materialRandomColor = false

const FPS = document.querySelector( '.fps h1' )

const DOM = document.querySelector( '.main-canvas' )

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer( {

  canvas: DOM,
  antialias: true

} )
const camera = new THREE.PerspectiveCamera(

  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000

)

scene.background = new THREE.Color( '#00002E' )

renderer.setSize(

  window.innerWidth,
  window.innerHeight

)

camera.position.z = 5
camera.position.x = 0
camera.position.y = 1

const geometry = new THREE.BoxGeometry( 0.15, 0.15, 10 )

// BEGIN - helpers

const ghostFocus = new THREE.Vector3( 0, 0, 0 )

camera.lookAt( ghostFocus )

const gridHelper = new THREE.GridHelper( 4, 20 )
scene.add( gridHelper )

scene.add( new THREE.AxesHelper() )

// END - helpers

function update( currentTime ) {

  renderer.render( scene, camera )

  const fpsNow = 1000 / ( currentTime - fpsBeforeUpdate )
  FPS.innerHTML = `FPS: ${Math.round( fpsNow )}`
  fpsBeforeUpdate = currentTime

  if ( currentTime - currentTimeBeforeUpdate >= 1 ) {

    for ( let counter = 0; counter < 3; counter++ ) {

      generateSpectrum()

    }

    currentTimeBeforeUpdate = currentTime

  }

  if ( fl === true ) {

    fl = false

    cameraRunning()

  }

  requestAnimationFrame( update )

}

window.requestAnimationFrame( update )

function generateSpectrum () {

  const material = new THREE.MeshBasicMaterial( {

    color: materialRandomColor ? '#78DAFD' : '#FE5BB4'

  } )

  const cube = new THREE.Mesh( geometry, material )

  const angle = Math.random() * Math.PI

  cube.position.x = ( Math.cos( angle ) - 0.5 ) * 20 + ( Math.random() * 10 )
  cube.position.y = ( Math.sin( angle ) - 0.5 ) * 20 + ( Math.random() * 10 )
  cube.position.z = 0

  materialRandomColor = !materialRandomColor

  scene.add( cube )

  anime( {

    targets: cube.position,
    easing: 'linear',
    duration: 1500,
    z: -100,
    complete: () => {

      scene.remove( cube )

    }

  } )

}

function cameraRunning () {

  const tl = anime.timeline( {

    targets: ghostFocus,

  } )

  tl.add( {

    duration: 1,
    easing: 'easeInOutQuad',
    x: 0,
    y: 0,
    update: () => {

      camera.lookAt( ghostFocus )

    }

  } )

  tl.add( {

    duration: 1000,
    easing: 'easeInOutQuad',
    keyframes: [

      {x: 0.5},
      {x: 1, y: -1},

    ],
    update: () => {

      camera.lookAt( ghostFocus )

    }

  } )

}

window.onclick = () => {

  fl = false

}
