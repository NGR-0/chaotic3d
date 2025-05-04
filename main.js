import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();

// texture sky
const skyLoader = new THREE.TextureLoader();
const skyTexture = skyLoader.load(
  "assets/sore2.jpg",
  (texture) => {
    skyTexture.mapping = THREE.EquirectangularReflectionMapping;
    skyTexture.colorSpace = THREE.SRGBColorSpace;
    scene.environment = texture;
    scene.background = skyTexture;
  },
  () => {},
  () => {},
);

// camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  10000,
);
camera.position.set(0, 300, 300);
camera.lookAt(0, 250, 0);

// canvas
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// control camera
const control = new OrbitControls(camera, renderer.domElement);
control.enableDamping = true;
control.dampingFactor = 0.05;
control.screenSpacePanning = false;
control.maxPolarAngle = Math.PI / 2 - 0.1;
control.minDistance = 1;
control.maxDistance = 1500;

// texture land
const landLoader = new THREE.TextureLoader();
const landTexture = landLoader.load(
  "./assets/rock.jpg",
  () => {},
  () => {},
  () => {},
);
landTexture.wrapS = THREE.RepeatWrapping;
landTexture.wrapT = THREE.RepeatWrapping;
landTexture.repeat.set(16, 16);
landTexture.colorSpace = THREE.SRGBColorSpace;

// plane for land
const planeGeometry = new THREE.PlaneGeometry(10000, 10000, 1, 1);
const planeMaterial = new THREE.MeshBasicMaterial({
  side: THREE.DoubleSide,
  map: landTexture,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

planeMesh.rotation.x = -Math.PI / 2;

scene.add(planeMesh);

//circle
const circleMeshes = [];
const circleCount = 3000;
for (let i = 0; i < circleCount; i++) {
  const geometry = new THREE.ConeGeometry(
    21,
    1,
    3,
    1,
    true,
    0,
    6.283185307179586,
  );
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.2,
    roughness: 0.2,
    transmission: 1,
    thickness: 1,
    ior: 1.5,
    reflectivity: 1,
    specularIntensity: 1,
    transparent: true,
    clearcoat: 1,
    clearcoatRoughness: 0,
  });

  const circleMesh = new THREE.Mesh(geometry, material);
  circleMesh.position.x = (Math.random() - 0.5) * 2500;
  circleMesh.position.y = 25 + Math.random() * 5000;
  circleMesh.position.z = Math.random() * 1000;

  circleMesh.userData.speed = 0.01 + Math.random() * 0.2;
  circleMesh.userData.offset = Math.random() * Math.PI * 2;
  circleMesh.userData.directionX = Math.random() < 0.5 ? 1 : -1;
  circleMesh.userData.directionY = Math.random() < 0.5 ? 1 : -1;
  circleMesh.userData.directionZ = Math.random() < 0.5 ? 1 : -1;

  scene.add(circleMesh);
  circleMeshes.push(circleMesh);
}
circleMeshes.forEach((x) => {
  x.rotation.x = Math.PI / 2;
});
function animate() {
  control.update();

  const time = performance.now() * 0.01;

  circleMeshes.forEach((circleMesh) => {
    const { speed, offset, directionX, directionY, directionZ } =
      circleMesh.userData;

    circleMesh.position.x += directionX * Math.sin(time * speed + offset) * 0.9;
    circleMesh.position.y += directionY * Math.cos(time * speed + offset) * 0.9;
    circleMesh.position.z += directionZ * Math.sin(time * speed + offset) * 0.9;

    circleMesh.rotation.y += circleMesh.userData.speed;
  });

  renderer.render(scene, camera);
}
