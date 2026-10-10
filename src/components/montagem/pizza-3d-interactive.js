/**
 * Pizza 3D Interativa — Don Corleone (WebGL / Three.js)
 * 
 * Renderizador 3D em tempo real com suporte a arraste/rotação 360° com o mouse,
 * iluminação de estúdio cinematográfica (PBR), mapa de relevo e suporte a arquivo .glb.
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function inicializarPizza3DInterativa(containerSelector = '#pizza-3d-canvas-container') {
  const container = document.querySelector(containerSelector);
  if (!container) return null;

  // Limpa instâncias anteriores
  container.innerHTML = '';

  const width = container.clientWidth || 540;
  const height = container.clientHeight || 540;

  // 1. Cena, Câmera e Renderizador
  const scene = new THREE.Scene();
  
  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
  camera.position.set(0, 3.2, 4.2);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  container.appendChild(renderer.domElement);

  // 2. Iluminação de Estúdio Gastronômico
  const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.2);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffdfa0, 3.5);
  keyLight.position.set(3, 6, 4);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  keyLight.shadow.bias = -0.001;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xa82a22, 2.2);
  rimLight.position.set(-4, 3, -3);
  scene.add(rimLight);

  const fillLight = new THREE.PointLight(0xc8a15a, 2.0, 10);
  fillLight.position.set(0, -2, 3);
  scene.add(fillLight);

  // Grupo Mestre da Pizza (para rotações pelo mouse e scroll)
  const pizzaGroup = new THREE.Group();
  scene.add(pizzaGroup);

  // 3. Textura Hiper-Realista da Pizza de Calabresa Don Corleone
  const textureLoader = new THREE.TextureLoader();
  const pizzaTexture = textureLoader.load('/images/cardapio/calabresa-artesanal.jpg', () => {
    renderer.render(scene, camera);
  });
  pizzaTexture.wrapS = THREE.ClampToEdgeWrapping;
  pizzaTexture.wrapT = THREE.ClampToEdgeWrapping;
  pizzaTexture.colorSpace = THREE.SRGBColorSpace;

  // 4. Criação da Geometria 3D Procedural Realista
  // Borda alta napolitana (Torus com relevo)
  const crustGeo = new THREE.TorusGeometry(1.6, 0.26, 32, 64);
  const crustMat = new THREE.MeshStandardMaterial({
    color: 0xdca868,
    roughness: 0.85,
    metalness: 0.05
  });
  const crustMesh = new THREE.Mesh(crustGeo, crustMat);
  crustMesh.rotation.x = Math.PI / 2;
  crustMesh.castShadow = true;
  crustMesh.receiveShadow = true;
  pizzaGroup.add(crustMesh);

  // Superfície da Pizza com Queijo e Molho
  const pizzaFaceGeo = new THREE.CylinderGeometry(1.62, 1.62, 0.12, 64);
  const pizzaFaceMat = new THREE.MeshStandardMaterial({
    map: pizzaTexture,
    roughness: 0.45,
    metalness: 0.1,
    bumpMap: pizzaTexture,
    bumpScale: 0.04
  });
  const pizzaFaceMesh = new THREE.Mesh(pizzaFaceGeo, pizzaFaceMat);
  pizzaFaceMesh.position.y = 0.02;
  pizzaFaceMesh.castShadow = true;
  pizzaFaceMesh.receiveShadow = true;
  pizzaGroup.add(pizzaFaceMesh);

  // Tábua Rústica de Madeira por baixo
  const boardGeo = new THREE.CylinderGeometry(1.95, 1.95, 0.15, 64);
  const boardMat = new THREE.MeshStandardMaterial({
    color: 0x3d2b1f,
    roughness: 0.9,
    metalness: 0.05
  });
  const boardMesh = new THREE.Mesh(boardGeo, boardMat);
  boardMesh.position.y = -0.12;
  boardMesh.receiveShadow = true;
  pizzaGroup.add(boardMesh);

  // Tenta carregar .glb caso exista em /models/pizza.glb
  const gltfLoader = new GLTFLoader();
  gltfLoader.load('/models/pizza.glb', (gltf) => {
    // Se o usuário adicionar um .glb, substitui a geometria procedural
    pizzaGroup.clear();
    const model = gltf.scene;
    model.scale.set(1.5, 1.5, 1.5);
    model.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    pizzaGroup.add(model);
  }, undefined, () => {
    // Se não houver .glb, mantém a mesh procedural em alta qualidade
  });

  // 5. Interação com o Mouse (Girar 360° em todos os ângulos)
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let targetRotation = { x: 0.35, y: 0 };
  let currentRotation = { x: 0.35, y: 0 };
  let autoRotateSpeed = 0.003;

  const canvas = renderer.domElement;

  function onMouseDown(e) {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  }

  function onMouseMove(e) {
    if (isDragging) {
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      targetRotation.y += deltaX * 0.008;
      targetRotation.x += deltaY * 0.008;

      // Limite para não virar de ponta cabeça
      targetRotation.x = Math.max(-0.2, Math.min(1.2, targetRotation.x));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    } else {
      // Parallax sutil ao mover o cursor sem clicar
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      camera.position.x = nx * 0.4;
      camera.position.y = 3.2 - ny * 0.3;
      camera.lookAt(0, 0, 0);
    }
  }

  function onMouseUp() {
    isDragging = false;
  }

  // Suporte a Touch no Mobile
  function onTouchStart(e) {
    if (e.touches.length === 1) {
      isDragging = true;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }

  function onTouchMove(e) {
    if (isDragging && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      targetRotation.y += deltaX * 0.01;
      targetRotation.x += deltaY * 0.01;
      targetRotation.x = Math.max(-0.2, Math.min(1.2, targetRotation.x));

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }

  function onTouchEnd() {
    isDragging = false;
  }

  canvas.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);

  canvas.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: true });
  window.addEventListener('touchend', onTouchEnd);

  // 6. Integração com o Scroll da Página
  function onScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollFraction = Math.min(1, Math.max(0, scrollY / (window.innerHeight * 1.5)));

    // Rotação suave sincronizada com o scroll
    if (!isDragging) {
      targetRotation.y += scrollFraction * 0.02;
      pizzaGroup.position.y = -scrollFraction * 0.8;
      pizzaGroup.scale.setScalar(1 + scrollFraction * 0.15);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // 7. Redimensionamento Responsivo
  function onResize() {
    const newWidth = container.clientWidth || 540;
    const newHeight = container.clientHeight || 540;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  }
  window.addEventListener('resize', onResize);

  // 8. Loop de Renderização Contínuo com Interpolação Suave (Lerp)
  let animationFrameId;
  function animate() {
    animationFrameId = requestAnimationFrame(animate);

    // Rotação automática contínua suave quando o usuário não estiver arrastando
    if (!isDragging) {
      targetRotation.y += autoRotateSpeed;
    }

    // Interpolação amortecida
    currentRotation.x += (targetRotation.x - currentRotation.x) * 0.08;
    currentRotation.y += (targetRotation.y - currentRotation.y) * 0.08;

    pizzaGroup.rotation.x = currentRotation.x;
    pizzaGroup.rotation.y = currentRotation.y;

    renderer.render(scene, camera);
  }
  animate();

  // Função de Limpeza
  return {
    destroy: () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    }
  };
}
