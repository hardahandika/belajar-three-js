import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

//VARIABLES
let renderer, labelRenderer;
let scene, sceneOrtho, camera, cameraOrtho, orbitControl;

let sphereMeshGroup;
let poiMeshGroup;

let sphereArray = [];
let poiArray = [];

const sphere = {};
const poi = {};

let selectedPoi = null;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const textureLoader = new THREE.TextureLoader();


//RENDERER
renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.autoClear = false;

document.body.appendChild(renderer.domElement);

labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';

document.body.appendChild(labelRenderer.domElement);


//SCENE
scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5));

sceneOrtho = new THREE.Scene();


//CAMERA
const width = window.innerWidth;
const height = window.innerHeight;

camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 0.01;

cameraOrtho = new THREE.OrthographicCamera(- window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, - window.innerHeight / 2, 1, 10);
cameraOrtho.position.z = 10;


//CONTROLS
orbitControl = new OrbitControls(camera, labelRenderer.domElement);


//RESIZE WINDOW HANDLER
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
}


//ON POINTER MOVE HANDLER
function onPointerMove(event) {
    if (selectedPoi) {
        selectedPoi.material.color.set('#fff');
    }

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObject(poiMeshGroup, true);

    if (intersects.length > 0) {
        const res = intersects.filter(function (res) {
            return res && res.object;
        })[0];

        if (res && res.object) {
            selectedPoi = res.object;
            selectedPoi.material.color.set('#ccc');
            document.body.style.cursor = 'pointer';
        }
    }
    else {
        document.body.style.cursor = 'default';
        selectedPoi = null;
    }
}


//ON POINTER UP HANDLER
function onPointerUp() {
    if (selectedPoi) {
        for (let x = 0; x < poiArray.length; x++) {
            for (let y = 0; y < poiArray[x].length; y++) {
                const element = poiArray[x][y];
                if (element.mesh == selectedPoi) {
                    changeSphere(element.destinationSphereId.x, element.destinationSphereId.y);
                    document.body.style.cursor = 'default';
                    selectedPoi = null;
                }
            }
        }
    }
}


//FUNC TO CREATE INDIVIDUAL SPHERE
function createSphereMesh(spherePosition, sphereTexturePath) {
    const geometry = new THREE.SphereGeometry(-0.5, 64, 64);
    const texture = textureLoader.load(sphereTexturePath);

    const material = new THREE.MeshBasicMaterial();
    material.map = texture;
    material.side = THREE.FrontSide;

    const sphere = new THREE.Mesh(geometry, material);
    sphere.rotation.z += Math.PI;
    sphere.position.copy(spherePosition);

    return sphere;
}


//CREATE SOME SPHERE TO SCENE
function populateSphere() {
    sphereMeshGroup = new THREE.Group();

    let sphere_0_0 = createSphereMesh(new THREE.Vector3(0, 0, 0), 'textures/360_images/lantai_1/LT1-PCK25-1.jpg');
    let sphere_0_1 = createSphereMesh(new THREE.Vector3(0, 1, 0), 'textures/360_images/lantai_1/LT1-PCK25-2.jpg');
    let sphere_0_2 = createSphereMesh(new THREE.Vector3(0, 2, 0), 'textures/360_images/lantai_1/LT1-PCK25-3.jpg');

    sphereMeshGroup.add(sphere_0_0);
    sphereMeshGroup.add(sphere_0_1);
    sphereMeshGroup.add(sphere_0_2);
    scene.add(sphereMeshGroup);

    sphereArray.push([
        { mesh: sphere_0_0, id: new THREE.Vector2(0, 0) },
        { mesh: sphere_0_1, id: new THREE.Vector2(0, 1) },
        { mesh: sphere_0_2, id: new THREE.Vector2(0, 2) }
    ]);
}

//HUD
function createHud(center, scale, position, texturePath) {
    const texture = textureLoader.load(texturePath);

    const material = new THREE.SpriteMaterial({ map: texture });

    const hud = new THREE.Sprite(material);
    hud.center.set(center.x, center.y);
    hud.scale.set(scale.x * 0.5, scale.y * 0.5, 1);
    hud.position.set(position.x, position.y);
    return hud;
}

function populateHud() {
    let hudFloor = new createHud(
        new THREE.Vector2(0, 0),
        new THREE.Vector2(216, 90),
        new THREE.Vector2(-900, 400),
        'textures/ui_images/floor title bg guide.png'
    );

    let hudLokasiIcon = new createHud(
        new THREE.Vector2(0, 0),
        new THREE.Vector2(90, 90),
        new THREE.Vector2(-900, 350),
        'textures/ui_images/lokasi icon.png'
    )

    let hudLokasiBG = new createHud(
        new THREE.Vector2(0, 0),
        new THREE.Vector2(139, 90),
        new THREE.Vector2(-855, 350),
        'textures/ui_images/name.png'
    )

    sceneOrtho.add(hudFloor);
    sceneOrtho.add(hudLokasiIcon);
    sceneOrtho.add(hudLokasiBG);
}

//FUNC TO CREATE INDIVIDUAL POI
function createPoi(sphereId, poiPosition, poiText) {
    const texture = textureLoader.load('textures/ui_images/poi guide.png');

    const material = new THREE.SpriteMaterial({ map: texture });

    const poi = new THREE.Sprite(material);
    poi.position.x = (sphereId.x + poiPosition.x);
    poi.position.y = (sphereId.y + poiPosition.y);
    poi.position.z = poiPosition.z;
    poi.scale.set(0.125, 0.05, 0.05);

    return poi;
}


//FUNCTION WHEN POI CLICKED
function onPoiClicked(sphereId) {
    changeSphere(sphereId.x, sphereId.y);
}


//CREATE SOME POI TO SPHERE
function populatePoi() {
    poiMeshGroup = new THREE.Group();

    let poi_0_0_0 = new createPoi(new THREE.Vector2(0, 0), new THREE.Vector3(0, 0, -0.4), "text");
    let poi_0_1_0 = new createPoi(new THREE.Vector2(0, 1), new THREE.Vector3(0.4, 0, 0), "text");
    let poi_0_2_0 = new createPoi(new THREE.Vector2(0, 2), new THREE.Vector3(-0.4, 0, 0), "text");

    poiMeshGroup.add(poi_0_0_0);
    poiMeshGroup.add(poi_0_1_0);
    poiMeshGroup.add(poi_0_2_0);
    scene.add(poiMeshGroup);

    poiArray.push([
        {
            mesh: poi_0_0_0,
            sphereId: new THREE.Vector3(0, 0, 0),
            destinationSphereId: new THREE.Vector3(0, 1, 0)
        }
    ]);
    poiArray.push([
        {
            mesh: poi_0_1_0,
            sphereId: new THREE.Vector3(0, 1, 0),
            destinationSphereId: new THREE.Vector3(0, 2, 0)
        }
    ]);
    poiArray.push([
        {
            mesh: poi_0_2_0,
            sphereId: new THREE.Vector3(0, 2, 0),
            destinationSphereId: new THREE.Vector3(0, 0, 0)
        }
    ]);

    for (let x = 0; x < poiArray.length; x++) {
        for (let y = 0; y < poiArray[x].length; y++) {
            console.log(poiArray[x][y].sphereId);
        }
    }
}


//MOVING TO OTHER SHPERE
function changeSphere(x, y) {
    let cameraDistanceToX = camera.position.x - orbitControl.target.x;
    let cameraDistanceToY = camera.position.y - orbitControl.target.y;
    let cameraDistanceToZ = camera.position.z - orbitControl.target.z;

    orbitControl.target.set(x, y, 0);

    camera.position.set(
        orbitControl.target.x + cameraDistanceToX,
        orbitControl.target.y + cameraDistanceToY,
        orbitControl.target.z + cameraDistanceToZ
    );

    camera.updateProjectionMatrix();

    console.log('pindah');
}


//GUI
const button = {
    'Lantai 1-1': function () { changeSphere(0, 0); },
    'Lantai 1-2': function () { changeSphere(0, 1); },
    'Lantai 1-3': function () { changeSphere(0, 2); },
}


//INIT GUI
function initGUI() {
    const panel = new GUI();
    panel.title("Lantai");

    const lantai1 = panel.addFolder('Lantai 1').close();
    lantai1.add(button, 'Lantai 1-1');
    lantai1.add(button, 'Lantai 1-2');
    lantai1.add(button, 'Lantai 1-3');
}


//INIT
function init() {
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);

    populateSphere();
    populatePoi();
    populateHud();
    initGUI();
}


//UPDATE
function update() {
    requestAnimationFrame(update);

    orbitControl.update();


    renderer.clear();
    renderer.render(scene, camera);
    renderer.clearDepth();
    renderer.render(sceneOrtho, cameraOrtho);
    labelRenderer.render(scene, camera);
}


init();
update();
