import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import * as Environment from './environment.js';

let renderer, labelRenderer, scene, camera, orbitControl;

let selectedObject = null;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

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

//CAMERA
camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 0.01;

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
    if (selectedObject) {

        selectedObject.material.color.set('#000');
        selectedObject = null;

    }

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObject(Environment.pois, true);

    if (intersects.length > 0) {

        const res = intersects.filter(function (res) {

            return res && res.object;

        })[0];

        if (res && res.object) {

            selectedObject = res.object;
            selectedObject.material.color.set('#f00');

        }

    }

}

//GUI
const button = {
    'Lantai 1-1': function () { Environment.changeSphere(0, 0, camera, orbitControl); console.log('lantai 1-1'); },
    'Lantai 1-2': function () { Environment.changeSphere(0, 1, camera, orbitControl); console.log('lantai 1-2'); },
    'Lantai 1-3': function () { Environment.changeSphere(0, 2, camera, orbitControl); console.log('lantai 1-3'); },
}

//INIT
function init() {
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('pointermove', onPointerMove);
    scene.add(Environment.populateSphere());
    scene.add(Environment.populatePoi());
    initGUI();
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

//UPDATE
function update() {
    requestAnimationFrame(update);

    orbitControl.update();

    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}

init();
update();
