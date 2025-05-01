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
control.enableDamping = true; // Efek damping (inertia) agar lebih halus
control.dampingFactor = 0.05;
control.screenSpacePanning = false; // Batasi panning agar tetap di plane
control.maxPolarAngle = Math.PI / 2 - 0.1; // Batasi rotasi agar tidak bisa melihat dari bawah
control.minDistance = 1; // Jarak minimum kamera dari target (misalnya 1 unit)
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
const circleCount = 2500;
for (let i = 0; i < circleCount; i++) {
  const geometry = new THREE.CircleGeometry(25, 25, 1, 7);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, // Warna dasar putih
    metalness: 0.7, // Kaca bukan logam
    roughness: 0, // Licin agar refleksi tajam
    transmission: 1, // Biar tembus pandang (khusus MeshPhysicalMaterial)
    thickness: 1, // Ketebalan kaca
    ior: 1.5, // Index of Refraction (kaca sekitar 1.5)
    reflectivity: 1, // Maksimalkan refleksi
    specularIntensity: 1, // Highlight terang
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
function animate() {
  control.update();

  const time = performance.now() * 0.01;

  circleMeshes.forEach((circleMesh) => {
    const { speed, offset, directionX, directionY, directionZ } =
      circleMesh.userData;

    circleMesh.position.x += directionX * Math.sin(time * speed + offset) * 0.9;
    circleMesh.position.y += directionY * Math.cos(time * speed + offset) * 0.9;
    circleMesh.position.z += directionZ * Math.sin(time * speed + offset) * 0.9;
  });

  renderer.render(scene, camera);
}
