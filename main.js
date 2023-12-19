import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
//import * as THREE from 'https://cdn.skypack.dev/three@0.132.2/build/three.module.js'
//import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';

//VARIABLES
let renderer, scene, camera360, cameraUI, controls;
let gui;
const textureLoader = new THREE.TextureLoader();

let poi = {}

function changePOI(x, y) {
    let cameraDistanceToX = camera360.position.x - controls.target.x;
    let cameraDistanceToY = camera360.position.y - controls.target.y;
    let cameraDistanceToZ = camera360.position.z - controls.target.z;

    controls.target.set(x, y, 0);

    camera360.position.set(
        controls.target.x + cameraDistanceToX, 
        controls.target.y + cameraDistanceToY, 
        controls.target.z + cameraDistanceToZ
    );

    camera360.updateProjectionMatrix();
}

function createSphere(pos, texturePath) {
    const geometry = new THREE.SphereGeometry(1, 16, 16);
    const texture = textureLoader.load(texturePath);

    const material = new THREE.MeshBasicMaterial();
    material.map = texture;
    material.side = THREE.BackSide;

    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.copy(pos);

    return sphere;
}

function populatePoiList(){
    poi['1'] = function() { changePOI(0,0); };
    poi['2'] = function() { changePOI(0,2); };
}

function populateWorld(){
    const group = new THREE.Group();
    group.add(new createSphere(new THREE.Vector3(0, 0, 0), 'textures/360.webp'));
    group.add(new createSphere(new THREE.Vector3(0, 2, 0), 'textures/Rick-Astley-Never-Gonna-Give-You-Up.webp'));
    scene.add(group);
}

function initGUI(){
    gui = new GUI();
    gui.title( 'POI' );
    gui.add( poi, '1' );
    gui.add( poi, '2' );
    gui.open();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function init() {
    //RENDERER
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //SCENE
    scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(5));

/*
    //UI
    const spriteMap = textureLoader.load('spongebob.jpeg');
    const spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap });
    const sprite = new THREE.Sprite(spriteMaterial);
    scene.add(sprite);
*/

    //CAMERA
    camera360 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera360.position.z = 0.01;

    cameraUI = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 2000);

    //CONTROLS
    controls = new OrbitControls(camera360, renderer.domElement);
    //controls.enablePan = false;
    //controls.enableZoom = false;

    //MKB LISTENER
    document.addEventListener('keyup', function (event) {
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
    
    window.addEventListener( 'resize', onWindowResize );
    populatePoiList();
    populateWorld();
    initGUI();
}

init();

//UPDATE PER FRAME
function animate() {
    requestAnimationFrame(animate);

    controls.update();

    //renderer.render(scene, cameraUI);
    renderer.render(scene, camera360);
}

//START UPDATE PER FRAME
animate();
