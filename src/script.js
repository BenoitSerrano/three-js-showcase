import * as THREE from 'three'
// import gsap from "gsap"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import * as dat from 'lil-gui'

const parameters = {
    color: 0xff0000
}
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/1.png')

// Scene
const scene = new THREE.Scene()
const canvas = document.querySelector('canvas.webgl')
const group = new THREE.Group()

const normalMaterial = new THREE.MeshNormalMaterial()
const material = new THREE.MeshToonMaterial()
normalMaterial.flatShading = true
const geometry1 = new THREE.TorusGeometry(0.3, 0.2, 16, 32)
const geometry2 = new THREE.SphereGeometry(1, 32,32)
const geometry3 = new THREE.PlaneGeometry(1, 1)
const torus = new THREE.Mesh(geometry1, material)
torus.position.x = -2
const sphere = new THREE.Mesh(geometry2, material)
sphere.position.x = 2
const plane = new THREE.Mesh(geometry3, material)
group.add(torus)
group.add(sphere)
group.add(plane)
// scene.add(group)

/**
 * Lights
 */
 const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
 scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Fonts
 */
 const fontLoader = new FontLoader()

 fontLoader.load(
     '/fonts/helvetiker_regular.typeface.json',
     (font) =>
     {
         const textGeometry = new TextGeometry(
             'Hello Three.js',
             {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
             }
         )
         textGeometry.computeBoundingBox()
         textGeometry.translate(
            - textGeometry.boundingBox.max.x * 0.5,
            - textGeometry.boundingBox.max.y * 0.5,
            - textGeometry.boundingBox.max.z * 0.5
        )
                 const textMaterial = new THREE.MeshBasicMaterial({map: matcapTexture})
         const text = new THREE.Mesh(textGeometry, textMaterial)
         scene.add(text)
     }
 )

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const aspectRatio = sizes.width / sizes.height

// Clock
const clock = new THREE.Clock()

// Camera
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 1, 1000)
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

camera.position.z = 5
camera.lookAt(group.position)
scene.add(camera)


window.addEventListener("resize", () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('dblclick', () =>
{
    if(!document.fullscreenElement)
    {
        canvas.requestFullscreen()
    }
    else
    {
        document.exitFullscreen()
    }
})

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas
})


renderer.setSize(sizes.width, sizes.height)
const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    sphere.rotation.y = 0.2 * elapsedTime
    plane.rotation.y = 0.2 * elapsedTime
    torus.rotation.y = 0.2 * elapsedTime

    sphere.rotation.x = 0.25 * elapsedTime
    plane.rotation.x = 0.25 * elapsedTime
    torus.rotation.x = 0.25 * elapsedTime

    controls.update()
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()



