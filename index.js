import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import getStarfield from './getStarfield.js';
import { getFresnelMat } from './getFresnelMat.js';

//Renderizador
const w = window.innerWidth; //definindo altura e largura para o renderizador
const h = window.innerHeight;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
document.body.appendChild(renderer.domElement);

//Cena
const scene = new THREE.Scene();

//Camera
const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

camera.position.z = 2;

//Controles de órbita
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const earthGroup = new THREE.Group();
earthGroup.rotation.x = -23.4 * Math.PI / 180; //Inclinando o eixo da Terra
scene.add(earthGroup);

//Geometria
const geometry = new THREE.IcosahedronGeometry(1, 12); 
const loader = new THREE.TextureLoader();
const material = new THREE.MeshPhongMaterial({
  map: loader.load('./materials/8081_earthmap10k.jpg'),
  specularMap: loader.load('./materials/8081_earthlights10k.jpg'),
  bumpMap: loader.load('./materials/8081_earthbump10k.jpg'),
  bumpScale: 0.2,
});

const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh); //Adicionando mesh (objeto geometrico) na cena
earthGroup.add(mesh); //Adicionando mesh (objeto geometrico) na earthGroup

const stars = getStarfield({ numStars: 12000 });
scene.add(stars); //Adicionando estrelas na cena


/*Wireframe
const wireframe = new THREE.MeshBasicMaterial({
    color: 0x000000,
    wireframe: true
});
const wireMesh = new THREE.Mesh(geometry, wireframe);
wireMesh.scale.multiplyScalar(1.001); //Aumentando o tamanho do wireframe para evitar z-fighting
mesh.add(wireMesh); //Adicionando wireframe na cena
*/

const cloudsMat = new THREE.MeshStandardMaterial({
  map: loader.load('./materials/8081_earthhiresclouds4K.jpg'),
  transparent: true,
  opacity: 0.3,
  alphaMap: loader.load('./materials/earthcloudmaptrans.jpg'),
});
const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
cloudsMesh.scale.setScalar(1.009);
earthGroup.add(cloudsMesh); //Adicionando nuvens na cena

const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.015);
earthGroup.add(glowMesh); //Adicionando glow na cena

// Luz
const lightsMat = new THREE.MeshBasicMaterial({ 
    map: loader.load('./materials/8081_earthlights10k.jpg'),
    blending: THREE.AdditiveBlending,
 });

const lightsMesh = new THREE.Mesh(geometry, lightsMat); //Usando lightsMat para o lightsMesh
//lightsMesh.scale.multiplyScalar(1.005);
earthGroup.add(lightsMesh); //Adicionando luzes na cena

const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set(-2, 0.5, 2);
scene.add(sunLight); //Adicionando luz na cena


/*
 const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
 scene.add(hemisphereLight); //Adicionando luz na cena
*/

//Animação
function animate() {
    requestAnimationFrame(animate); //Chamando a função animate recursivamente
    
    mesh.rotation.y += 0.0002; //Rotacionando o mesh no eixo y
    lightsMesh.rotation.y += 0.0002; //Rotacionando o mesh no eixo y
    cloudsMesh.rotation.y += 0.00028; //Rotacionando o mesh no eixo y
    glowMesh.rotation.y += 0.0002; //Rotacionando o mesh no eixo y
    renderer.render(scene, camera);
    controls.update(); //Atualizando o OrbitControls para o damping
} //Renderizando a cena com a camera

animate(); //Iniciando a animação