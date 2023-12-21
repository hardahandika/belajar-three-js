import * as THREE from 'three';

export let renderer, labelRenderer, scene, camera, orbitControl;
export let spheres = []
export let pois = []

const textureLoader = new THREE.TextureLoader();

//FUNC TO CREATE INDIVIDUAL SPHERE
function createSphere(spherePosition, sphereTexturePath) {
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
export function populateSphere() {
    spheres = new THREE.Group();
    let sphere_0_0 = createSphere(new THREE.Vector3(0, 0, 0), 'textures/360_images/lantai_1/LT1-PCK25-1.jpg');
    let sphere_0_1 = createSphere(new THREE.Vector3(0, 1, 0), 'textures/360_images/lantai_1/LT1-PCK25-2.jpg');
    let sphere_0_2 = createSphere(new THREE.Vector3(0, 2, 0), 'textures/360_images/lantai_1/LT1-PCK25-3.jpg');
    spheres.add(sphere_0_0);
    spheres.add(sphere_0_1);
    spheres.add(sphere_0_2);

    return spheres;
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

//CREATE SOME POI TO SPHERE
export function populatePoi() {
    pois = new THREE.Group();
    let poi_0_0_0 = new createPoi(new THREE.Vector2(0, 0), new THREE.Vector3(0, 0, -0.4), "text");
    let poi_0_1_0 = new createPoi(new THREE.Vector2(0, 1), new THREE.Vector3(0.4, 0, 0), "text");
    let poi_0_2_0 = new createPoi(new THREE.Vector2(0, 2), new THREE.Vector3(-0.4, 0, 0), "text");
    pois.add(poi_0_0_0);
    pois.add(poi_0_1_0);
    pois.add(poi_0_2_0);

    return pois;
}

//MOVING TO OTHER SHPERE
export function changeSphere(x, y, camera, orbitControl) {
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
}
