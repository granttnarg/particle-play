import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

//Texture Loader
const loader = new THREE.TextureLoader()
const cloud = loader.load('/cloud.png')
const moon = loader.load('/moon.png')

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.PlaneGeometry( 1, 1, 200, 200);

const particlesGeometry = new THREE.BufferGeometry;
const particlesGeometry2 = new THREE.BufferGeometry;
const particlesCount = 5000


const posArray = new Float32Array(particlesCount * 3);
const posArray2 = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++){
    // posArray[i] = Math.random()
    // posArray[i] = Math.random() - 0.5
    posArray[i] = (Math.random() - 0.5) * (Math.random() * 3)
    posArray2[i] = (Math.random() - 0.5) * (Math.random() * 3)
};

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
particlesGeometry2.setAttribute('position', new THREE.BufferAttribute(posArray2, 3))


// Materials

const material = new THREE.PointsMaterial({
    size: 0.003,
    color: "yellow"
})

const PointsMaterial = new THREE.PointsMaterial({
    size: 0.01,
    map: cloud,
    transparent: true,
    color: 'white',
    blending: THREE.NormalBlending
})

const PointsMaterial2 = new THREE.PointsMaterial({
    size: 0.01,
    map: moon,
    transparent: true,
    color: 'blue',
    opacity: 0.5
})

// Mesh
const sphere = new THREE.Points(geometry,material)
const particlesMesh = new THREE.Points(particlesGeometry, PointsMaterial)
const particlesMesh2 = new THREE.Points(particlesGeometry2, PointsMaterial2)
scene.add(sphere, particlesMesh, particlesMesh2)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 1
scene.add(pointLight)

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
const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 50)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 1
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(new THREE.Color('black'), 1)

//Mouse

document.addEventListener('mousemove', animateParticles)

let mouseX = 0
let mouseY = 0

function animateParticles(e) {
    mouseY = e.clientY
    mouseX = e.clientX
}

const textContent = document.querySelector('.content')
        console.log(textContent)

        let currentPos = window.pageYOffset;
        const callDistort = function() {
            console.log("call distort")
            const newPos = mouseX
            const diff = newPos - currentPos;
            const speed = diff * .2;

            textContent.style.transform = "skewY(" + speed + "deg)";
            currentPos = newPos;

            requestAnimationFrame(callDistort); 

        };

        callDistort();

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .5 * elapsedTime
    sphere.rotation.z = .2 * elapsedTime
    sphere.rotation.x = .1 * elapsedTime
    
    
    particlesMesh.rotation.x = - mouseY * (elapsedTime * 0.0001)
    particlesMesh.rotation.y = elapsedTime * 0.0001
    particlesMesh2.rotation.y = elapsedTime * 0.0001

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()