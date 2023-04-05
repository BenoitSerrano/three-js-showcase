import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import gsap from 'gsap'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

const raycaster = new THREE.Raycaster()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Floor
const bricks = []
function createBrick(position, rotation) {
    const brickMesh = new THREE.Mesh(brickGeometry, brickMaterial)
    brickMesh.position.x = position.x
    brickMesh.position.y = position.y
    brickMesh.position.z = position.z
    brickMesh.rotation.x = rotation.x
    brickMesh.rotation.y = rotation.y
    brickMesh.rotation.z = rotation.z
    return brickMesh
}

function generateFloor() {
    const interval = brickSize.depth/10
    const NB_ROW = 10;
    const NB_COLUMN = 20;
    const rowOffset = NB_ROW / 2
    const columnOffset = NB_COLUMN / 2
    
    for(let i = -columnOffset; i < NB_COLUMN-columnOffset; i++) {
        for(let j = -rowOffset; j < NB_ROW-rowOffset; j++) {
            const x = i * brickSize.width + interval*i
            const y = (Math.random()-0.5)*0.05
            const z = j * brickSize.depth + brickSize.depth + interval*j + (i%2 == 0 ? brickSize.depth /2 : 0)
            const rotation = {
                x: (Math.random()-0.5)*Math.PI*0.05,
                y:0,
                z:(Math.random()-0.5)*Math.PI*0.05,
            }
            const brick = createBrick({x, y, z},rotation)
            bricks.push(brick)
            scene.add(brick)
        }
    }
}

const brickSize = {height: 0.25, width: 0.5, depth: 1}
const brickGeometry = new THREE.BoxGeometry(brickSize.width,brickSize.height,brickSize.depth)

const textureLoader = new THREE.TextureLoader()
const brickTexture = textureLoader.load("./textures/flagstone.jpg")
brickTexture.wrapS = THREE.RepeatWrapping
brickTexture.wrapT = THREE.RepeatWrapping
brickTexture.minFilter = THREE.NearestFilter
const brickMaterial = new THREE.MeshStandardMaterial({map: brickTexture})

generateFloor()

// Light
const pointLight = new THREE.PointLight(0xbd6f02, 5, 10)
pointLight.position.y = 2
scene.add(pointLight)


const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

// Mouse
const mouse = new THREE.Vector2()

window.addEventListener('click', (event) =>
{
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(bricks)

    if(intersects.length > 0) {
        const timeline = gsap.timeline()
        timeline.to(intersects[0].object.position, {
            duration: 1,
            ease: 'power2.inOut',
            y: '+=2'
        })
        timeline.to(intersects[0].object.rotation, {
            duration: 2,
            ease: 'power2.inOut',
            y: '+=3.14',
            z: '+=3.14',
            x: '+=3.14',
        }, '<')
        timeline.to(intersects[0].object.position, {
            duration: 1,
            ease: 'power2.inOut',
            y: '-=2'
        }, '1')
    }
})

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
function moveLight() {
    const elapsedTime = clock.getElapsedTime()
    const radius = 2
    const angle = Math.PI * elapsedTime * 0.1
    const x = radius * Math.cos(angle)
    const y = 2+Math.cos(elapsedTime*0.5)
    const z = radius * Math.sin(angle)
    pointLight.position.x = x
    pointLight.position.y = y
    pointLight.position.z = z
}

function animateLight() {
    const elapsedTime = clock.getElapsedTime()
    const nominalIntensity = 5
    const intensity = Math.sin(elapsedTime) + nominalIntensity 
    
    pointLight.intensity = intensity
}


const tick = () =>
{
    // const elapsedTime = clock.getElapsedTime()
    moveLight()
    animateLight()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
