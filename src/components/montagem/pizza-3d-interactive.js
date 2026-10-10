/**
 * Pizza 3D Interativa — Don Corleone (WebGL / Three.js)
 * 
 * Modelo 3D sólido de alta fidelidade com textura zenital (top-down) hiper-realista,
 * relevo natural (bump map), borda napolitana com espessura 3D e rotação 360° livre.
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function inicializarPizza3DInterativa(containerSelector = '#pizza-3d-canvas-container') {
  const container = document.querySelector(containerSelector);
  if (!container) return null;

  container.innerHTML = '';

  const width = container.clientWidth || 540;
  const height = container.clientHeight || 540;

  // 1. Cena, Câmera e Renderizador WebGL
  const scene = new THREE.Scene();
  
  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
  camera.position.set(0, 3.2, 4.4);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  container.appendChild(renderer.domElement);

  // 2. Iluminação de Estúdio Gastronômico Cinematográfica
  const ambientLight = new THREE.AmbientLight(0xfff8f0, 1.4);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffe8b8, 3.2);
  keyLight.position.set(3.5, 6, 4);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  keyLight.shadow.bias = -0.001;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xb83226, 2.2);
  rimLight.position.set(-4, 3, -3);
  scene.add(rimLight);

  const fillLight = new THREE.PointLight(0xc8a15a, 1.8, 12);
  fillLight.position.set(0, -1, 3.5);
  scene.add(fillLight);

  // Grupo Mestre da Pizza
  const pizzaGroup = new THREE.Group();
  scene.add(pizzaGroup);

  // 3. Carregamento da Textura Fotográfica Top-Down
  const textureLoader = new THREE.TextureLoader();
  const pizzaTexture = textureLoader.load('/images/cardapio/calabresa-topdown-3d.png', () => {
    renderer.render(scene, camera);
  });
  pizzaTexture.colorSpace = THREE.SRGBColorSpace;
  pizzaTexture.generateMipmaps = true;
  pizzaTexture.minFilter = THREE.LinearMipmapLinearFilter;

  // 4. Geometria Sólida 3D da Pizza (Cilindro com espessura de massa e bordas reais)
  const radius = 2.1;
  const heightThickness = 0.18;
  const pizzaGeo = new THREE.CylinderGeometry(radius, radius, heightThickness, 64);

  // Materiais das 3 faces: [0: Lateral da borda, 1: Topo recheado, 2: Fundo da massa]
  const crustSideMat = new THREE.MeshStandardMaterial({
    color: 0x8a5426,
    roughness: 0.88,
    metalness: 0.05
  });

  const topFaceMat = new THREE.MeshStandardMaterial({
    map: pizzaTexture,
    roughness: 0.42,
    metalness: 0.08,
    bumpMap: pizzaTexture,
    bumpScale: 0.04
  });

  const bottomFaceMat = new THREE.MeshStandardMaterial({
    color: 0x3d2412,
    roughness: 0.95
  });

  const pizzaMesh = new THREE.Mesh(pizzaGeo, [crustSideMat, topFaceMat, bottomFaceMat]);
  pizzaMesh.castShadow = true;
  pizzaMesh.receiveShadow = true;
  pizzaGroup.add(pizzaMesh);

  // Suporte a carregamento de arquivo .glb se o usuário colocar em /models/pizza.glb
  const gltfLoader = new GLTFLoader();
  gltfLoader.load('/models/pizza.glb', (gltf) => {
    pizzaGroup.clear();
    const model = gltf.scene;
    model.scale.set(1.6, 1.6, 1.6);
    pizzaGroup.add(model);
  }, undefined, () => {});

  // 5. Interação com Mouse e Touch (Rotação 360° em todos os ângulos)
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let targetRotation = { x: 0.48, y: 0 };
  let currentRotation = { x: 0.48, y: 0 };
  const autoRotateSpeed = 0.003;

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

      // Limites de inclinação vertical
      targetRotation.x = Math.max(-0.1, Math.min(1.2, targetRotation.x));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    } else {
      // Parallax sutil ao mover o cursor
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      camera.position.x = nx * 0.35;
      camera.position.y = 3.2 - ny * 0.25;
      camera.lookAt(0, 0, 0);
    }
  }

  function onMouseUp() {
    isDragging = false;
  }

  // Touch Mobile
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
      targetRotation.x = Math.max(-0.1, Math.min(1.2, targetRotation.x));

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

  // 6. Rotação Sincronizada com o Scroll
  function onScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollFraction = Math.min(1, Math.max(0, scrollY / (window.innerHeight * 1.5)));

    if (!isDragging) {
      targetRotation.y += scrollFraction * 0.015;
      pizzaGroup.position.y = -scrollFraction * 0.6;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // 7. Resize Responsivo
  function onResize() {
    const newWidth = container.clientWidth || 540;
    const newHeight = container.clientHeight || 540;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  }
  window.addEventListener('resize', onResize);

  // 8. Loop de Animação com Interpolação Suave (Lerp)
  let animationFrameId;
  function animate() {
    animationFrameId = requestAnimationFrame(animate);

    if (!isDragging) {
      targetRotation.y += autoRotateSpeed;
    }

    currentRotation.x += (targetRotation.x - currentRotation.x) * 0.08;
    currentRotation.y += (targetRotation.y - currentRotation.y) * 0.08;

    pizzaGroup.rotation.x = currentRotation.x;
    pizzaGroup.rotation.y = currentRotation.y;

    renderer.render(scene, camera);
  }
  animate();

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
