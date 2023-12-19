import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
//import * as THREE from 'https://cdn.skypack.dev/three@0.132.2/build/three.module.js'
//import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';

// Your Three.js code goes here

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a scene
const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5));

//create UI
const spriteMap = new THREE.TextureLoader().load('spongebob.jpeg');
const spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap });
const sprite = new THREE.Sprite(spriteMaterial);
scene.add(sprite);

// Create a camera
const camera360 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera360.position.z = 0.01;

const cameraUI = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 2000);

//controls
const controls = new OrbitControls(camera360, renderer.domElement);
controls.enablePan = false;
controls.enableZoom = false;

// Keyboard input event listener
document.addEventListener('keyup', function (event) {
    // event.key contains the pressed key
    console.log('Key pressed:', event.key);

    if (event.key === '1') {
        camera360.position.set(0, 0, 0.01);
        controls.target.set(0, 0, 0);
        camera360.updateProjectionMatrix();
    }
    else if (event.key === '2') {
        camera360.position.set(0, 2, 0.01);
        controls.target.set(0, 2, 0);
        camera360.updateProjectionMatrix();
    }
});

//create sphere
function createSphere(pos, texturePath) {
    const geometry = new THREE.SphereGeometry(1, 16, 16);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(texturePath);

    const material = new THREE.MeshBasicMaterial();
    material.map = texture;
    material.side = THREE.BackSide;

    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.copy(pos);
    return sphere;
}

const group = new THREE.Group();
group.add(new createSphere(new THREE.Vector3(0, 0, 0), 'textures/360.webp'));
group.add(new createSphere(new THREE.Vector3(0, 2, 0), 'textures/Rick-Astley-Never-Gonna-Give-You-Up.webp'));
scene.add(group);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    //control
    controls.update();

    // Render the scene
    renderer.render(scene, cameraUI);
    renderer.render(scene, camera360);
}

// Start the animation loop
animate();
