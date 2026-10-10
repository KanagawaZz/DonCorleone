/**
 * Pizza 3D Interativa — Don Corleone (WebGL / Three.js)
 * 
 * Utiliza a foto em perspectiva da Pizza de Calabresa Don Corleone com canal alfa 100% transparente.
 * Interatividade completa de rotação 360° com mouse, parallax do cursor e suporte a touch.
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function inicializarPizza3DInterativa(containerSelector = '#pizza-3d-canvas-container') {
  const container = document.querySelector(containerSelector);
  if (!container) return null;

  container.innerHTML = '';

  const width = container.clientWidth || 540;
  const height = container.clientHeight || 540;

  // 1. Cena, Câmera e Renderizador
  const scene = new THREE.Scene();
  
  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
  camera.position.set(0, 0.4, 4.5);
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

  container.appendChild(renderer.domElement);

  // 2. Iluminação de Estúdio Gastronômico
  const ambientLight = new THREE.AmbientLight(0xfff8f0, 1.6);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffe8b8, 2.8);
  keyLight.position.set(3.5, 5, 4);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xb83226, 1.8);
  rimLight.position.set(-4, 2, -3);
  scene.add(rimLight);

  const fillLight = new THREE.PointLight(0xc8a15a, 1.6, 12);
  fillLight.position.set(0, -1, 3.5);
  scene.add(fillLight);

  // Grupo Mestre da Pizza
  const pizzaGroup = new THREE.Group();
  scene.add(pizzaGroup);

  // 3. Textura com Fundo Transparente (Foto Oficial Fornecida)
  const textureLoader = new THREE.TextureLoader();
  const pizzaTexture = textureLoader.load('/images/cardapio/calabresa-3d-transparent.png', () => {
    renderer.render(scene, camera);
  });
  pizzaTexture.colorSpace = THREE.SRGBColorSpace;
  pizzaTexture.generateMipmaps = true;
  pizzaTexture.minFilter = THREE.LinearMipmapLinearFilter;

  // 4. Geometria da Pizza 3D com Transparência e Proporção 1:1 Perfeita
  const pizzaGeo = new THREE.PlaneGeometry(4.2, 2.8, 32, 32);
  const pizzaMat = new THREE.MeshStandardMaterial({
    map: pizzaTexture,
    transparent: true,
    alphaTest: 0.05,
    roughness: 0.38,
    metalness: 0.08,
    bumpMap: pizzaTexture,
    bumpScale: 0.02,
    side: THREE.DoubleSide
  });

  const pizzaMesh = new THREE.Mesh(pizzaGeo, pizzaMat);
  pizzaGroup.add(pizzaMesh);

  // Suporte a carregamento de arquivo .glb se colocado em /models/pizza.glb
  const gltfLoader = new GLTFLoader();
  gltfLoader.load('/models/pizza.glb', (gltf) => {
    pizzaGroup.clear();
    const model = gltf.scene;
    model.scale.set(1.6, 1.6, 1.6);
    pizzaGroup.add(model);
  }, undefined, () => {});

  // 5. Interação com o Mouse e Touch (Girar 360° em todos os ângulos)
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let targetRotation = { x: 0.08, y: 0 };
  let currentRotation = { x: 0.08, y: 0 };
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

      // Limites de inclinação vertical para visão sempre elegante
      targetRotation.x = Math.max(-0.6, Math.min(0.6, targetRotation.x));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    } else {
      // Parallax sutil ao mover o cursor sem clicar
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      camera.position.x = nx * 0.3;
      camera.position.y = 0.4 - ny * 0.2;
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
      targetRotation.x = Math.max(-0.6, Math.min(0.6, targetRotation.x));

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
      targetRotation.y += scrollFraction * 0.012;
      pizzaGroup.position.y = -scrollFraction * 0.4;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // 7. Resize
  function onResize() {
    const newWidth = container.clientWidth || 540;
    const newHeight = container.clientHeight || 540;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  }
  window.addEventListener('resize', onResize);

  // 8. Loop de Animação Suave com Amortecimento (Lerp)
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
