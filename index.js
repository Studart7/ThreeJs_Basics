import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

//Renderizador
const w = window.innerWidth; //definindo altura e largura para o renderizador
const h = window.innerHeight;

const renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setSize(w, h);
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

//Geometria
const geometry = new THREE.IcosahedronGeometry(1, 4);
const material = new THREE.MeshStandardMaterial({ 
    color: 0xffffff, 
    flatShading: true
});

const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh); //Adicionando mesh (objeto geometrico) na cena



const wireframe = new THREE.MeshBasicMaterial({
    color: 0x000000,
    wireframe: true
});
const wireMesh = new THREE.Mesh(geometry, wireframe);
wireMesh.scale.multiplyScalar(1.001); //Aumentando o tamanho do wireframe para evitar z-fighting
mesh.add(wireMesh); //Adicionando wireframe na cena

// Luz
const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1);

scene.add(hemisphereLight); //Adicionando luz na cena


//Animação
function animate() {
    requestAnimationFrame(animate); //Chamando a função animate recursivamente
    mesh.rotation.x += 0.001; //Rotacionando o mesh no eixo x
    mesh.rotation.y += 0.0005; //Rotacionando o mesh no eixo y
    renderer.render(scene, camera);
    controls.update(); //Atualizando o OrbitControls para o damping
} //Renderizando a cena com a camera

animate(); //Iniciando a animação