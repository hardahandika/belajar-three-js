import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
//import * as THREE from 'https://cdn.skypack.dev/three@0.132.2/build/three.module.js'
//import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';

//VARIABLES
let renderer, scene, camera360, cameraUI, controls, labelRenderer;
let gui;
const textureLoader = new THREE.TextureLoader();

let spheres = {}

function changeSphere(x, y) {
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
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const texture = textureLoader.load(texturePath);

    const material = new THREE.MeshBasicMaterial();
    material.map = texture;
    material.side = THREE.BackSide;

    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.copy(pos);

    return sphere;
}

function populateSphereList() {
    spheres['1'] = function () { changeSphere(0, 0); };
    spheres['2'] = function () { changeSphere(0, 2); };
}

function populateWorld() {
    const group = new THREE.Group();
    group.add(new createSphere(new THREE.Vector3(0, 0, 0), 'textures/360_images/lantai_1/LT1-PCK25-1.jpg'));
    group.add(new createSphere(new THREE.Vector3(0, 2, 0), 'textures/Rick-Astley-Never-Gonna-Give-You-Up.webp'));
    scene.add(group);

    const poiTexture = textureLoader.load('textures/ui_images/poi guide.png');
    const poiMaterial = new THREE.SpriteMaterial({ map: poiTexture });
    const poi = new THREE.Sprite(poiMaterial);
    poi.position.set(0, 0, -0.9);
    poi.scale.set(0.25, 0.1, 0.1);
    scene.add(poi);

    /*     const poi1Geometry = new THREE.CircleGeometry(0.1, 16, 0, Math.PI * 2);
        const poi1Material = new THREE.MeshBasicMaterial();
        const poi1 = new THREE.Mesh(poi1Geometry, poi1Material);
        scene.add(poi1);
    
        const poi1Div = document.createElement('div');
        poi1Div.className = 'label';
        poi1Div.textContent = 'POI 1';
        poi1Div.style.backgroundColor = 'transparent';
    
        const poi1Label = new CSS2DObject(poi1Div);
        poi1Label.position.set(0, 0, 0);
        poi1Label.center.set(0, 1);
        poi1.add(poi1Label); */
}

function initGUI() {
    gui = new GUI();
    gui.title('POI');
    gui.add(spheres, '1');
    gui.add(spheres, '2');
    gui.open();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
}

function init() {
    //RENDERER
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    document.body.appendChild(labelRenderer.domElement);

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
    camera360 = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera360.position.z = 0.01;

    cameraUI = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 2000);

    //CONTROLS
    controls = new OrbitControls(camera360, labelRenderer.domElement);
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

    window.addEventListener('resize', onWindowResize);
    populateSphereList();
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
    labelRenderer.render(scene, camera360);
}

//START UPDATE PER FRAME
animate();
