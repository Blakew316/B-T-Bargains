/* ============================================================
   B&T Bargains — Hero 3D scene
   A cinematic, wind-swept wheat field at golden hour:
   thousands of instanced stalks swaying in the breeze,
   atmospheric haze, a low warm sun and drifting pollen.
   three.js via import map. Falls back to a graded CSS sky
   if WebGL is unavailable; honors prefers-reduced-motion.
   ============================================================ */

import * as THREE from "three";

const mount = document.getElementById("hero3d");

(function initField() {
  if (!mount) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true });
  } catch (e) {
    return; // CSS fallback remains visible
  }

  const W = () => mount.clientWidth || window.innerWidth;
  const H = () => mount.clientHeight || window.innerHeight;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setSize(W(), H());
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  mount.appendChild(renderer.domElement);
  renderer.domElement.style.pointerEvents = "none";

  const scene = new THREE.Scene();

  // ---- warm hazy sky as the background ----
  const sky = (() => {
    const c = document.createElement("canvas");
    c.width = 4; c.height = 256;
    const g = c.getContext("2d");
    const grad = g.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0.0, "#f2dea2");
    grad.addColorStop(0.45, "#edcb83");
    grad.addColorStop(0.72, "#e3a862");
    grad.addColorStop(1.0, "#cf8f4e");
    g.fillStyle = grad; g.fillRect(0, 0, 4, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();
  scene.background = sky;

  const HORIZON = new THREE.Color(0xdca15c);
  scene.fog = new THREE.Fog(HORIZON, 7, 42);

  const camera = new THREE.PerspectiveCamera(50, W() / H(), 0.1, 120);
  camera.position.set(0, 1.15, 9);
  camera.lookAt(0, 1.5, -10);

  // ---- light ----
  scene.add(new THREE.HemisphereLight(0xffe9bf, 0x6a5a2e, 0.9));
  const sun = new THREE.DirectionalLight(0xffd89a, 1.25);
  sun.position.set(-4, 3.2, -6);
  scene.add(sun);

  // ---- ground ----
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(70, 48),
    new THREE.MeshStandardMaterial({ color: 0x8a7236, roughness: 1, metalness: 0 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;
  scene.add(ground);

  // ============ WHEAT FIELD (instanced, wind-swayed) ============
  const COUNT = Math.min(window.innerWidth, window.innerHeight) < 720 ? 3800 : 7200;

  // one tapered blade, pivot at the base
  const blade = new THREE.PlaneGeometry(0.075, 1, 1, 5);
  blade.translate(0, 0.5, 0);
  {
    const pos = blade.attributes.position;
    const colors = [];
    const base = new THREE.Color(0x4f4a23);
    const tip = new THREE.Color(0xd9b257);
    const tmp = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);            // 0 (base) .. 1 (tip)
      pos.setX(i, pos.getX(i) * (1 - 0.82 * y)); // taper to a point
      tmp.copy(base).lerp(tip, y * y);
      colors.push(tmp.r, tmp.g, tmp.b);
    }
    blade.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    blade.computeVertexNormals();
  }

  const uTime = { value: 0 };
  const fieldMat = new THREE.MeshStandardMaterial({
    vertexColors: true, roughness: 1, metalness: 0, side: THREE.DoubleSide,
  });
  fieldMat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uTime;
    shader.vertexShader =
      "uniform float uTime;\nattribute float aPhase;\n" + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `#include <begin_vertex>
       float h = position.y; // 0 at base, 1 at tip (no UV dependency)
       float gust = 0.55 + 0.45 * sin(uTime * 0.22 + aPhase * 0.3);
       float bend = pow(h, 1.8) * 0.42 * gust;
       transformed.x += sin(uTime * 1.55 + aPhase) * bend;
       transformed.z += cos(uTime * 1.15 + aPhase * 1.3) * bend * 0.5;`
    );
  };

  const field = new THREE.InstancedMesh(blade, fieldMat, COUNT);
  field.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const phases = new Float32Array(COUNT);
  const dummy = new THREE.Object3D();
  const tint = new THREE.Color();
  for (let i = 0; i < COUNT; i++) {
    // scatter in front of the camera, receding to the horizon
    const x = (Math.random() - 0.5) * 54;
    const z = 8 - Math.random() * 44;
    dummy.position.set(x, 0, z);
    dummy.rotation.y = Math.random() * Math.PI;
    const ht = 0.7 + Math.random() * 0.9;
    dummy.scale.set(0.8 + Math.random() * 0.5, ht, 1);
    dummy.updateMatrix();
    field.setMatrixAt(i, dummy.matrix);
    phases[i] = Math.random() * Math.PI * 2;
    // per-blade tint variation (some greener, some more golden/dry)
    const v = 0.82 + Math.random() * 0.3;
    tint.setRGB(v, v * (0.92 + Math.random() * 0.12), v * (0.7 + Math.random() * 0.18));
    field.setColorAt(i, tint);
  }
  blade.setAttribute("aPhase", new THREE.InstancedBufferAttribute(phases, 1));
  field.instanceColor.needsUpdate = true;
  scene.add(field);

  // ============ SUN GLOW (sprites) ============
  function softSprite(size, stops) {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d");
    const grad = g.createRadialGradient(64, 64, 2, 64, 64, 64);
    stops.forEach(([o, col]) => grad.addColorStop(o, col));
    g.fillStyle = grad; g.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    const m = new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending });
    const s = new THREE.Sprite(m);
    s.scale.set(size, size, 1);
    return s;
  }
  const sunGlow = softSprite(26, [[0, "rgba(255,244,214,0.9)"], [0.2, "rgba(255,226,160,0.5)"], [0.55, "rgba(255,200,120,0.16)"], [1, "rgba(255,200,120,0)"]]);
  sunGlow.position.set(-3.5, 3.4, -22);
  scene.add(sunGlow);
  const sunCore = softSprite(7, [[0, "rgba(255,250,232,0.95)"], [0.5, "rgba(255,238,196,0.7)"], [1, "rgba(255,238,196,0)"]]);
  sunCore.position.copy(sunGlow.position);
  scene.add(sunCore);

  // ============ POLLEN PARTICLES ============
  const PCOUNT = 130;
  const pPos = new Float32Array(PCOUNT * 3);
  const pVel = new Float32Array(PCOUNT);
  for (let i = 0; i < PCOUNT; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 26;
    pPos[i * 3 + 1] = Math.random() * 5;
    pPos[i * 3 + 2] = 6 - Math.random() * 26;
    pVel[i] = 0.12 + Math.random() * 0.22;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  const pTex = (() => {
    const c = document.createElement("canvas"); c.width = c.height = 32;
    const g = c.getContext("2d");
    const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, "rgba(255,248,224,1)"); grad.addColorStop(1, "rgba(255,248,224,0)");
    g.fillStyle = grad; g.fillRect(0, 0, 32, 32);
    return new THREE.CanvasTexture(c);
  })();
  const pollen = new THREE.Points(pGeo, new THREE.PointsMaterial({
    size: 0.14, map: pTex, transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending, opacity: 0.7, sizeAttenuation: true,
  }));
  scene.add(pollen);

  // ============ INTERACTION ============
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  if (!reduceMotion) {
    window.addEventListener("pointermove", (e) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5);
      pointer.ty = (e.clientY / window.innerHeight - 0.5);
    }, { passive: true });
  }

  let visible = true;
  const io = new IntersectionObserver((en) => { visible = en[0].isIntersecting; if (visible) loop(); }, { threshold: 0.01 });
  io.observe(mount);
  document.addEventListener("visibilitychange", () => { if (!document.hidden && visible) loop(); });

  const clock = new THREE.Clock();
  let running = false;

  function render() {
    const t = clock.getElapsedTime();
    if (!reduceMotion) {
      uTime.value = t;

      // pollen drifts up and resets
      const arr = pGeo.attributes.position.array;
      for (let i = 0; i < PCOUNT; i++) {
        arr[i * 3 + 1] += pVel[i] * 0.016;
        arr[i * 3] += Math.sin(t * 0.5 + i) * 0.002;
        if (arr[i * 3 + 1] > 6) { arr[i * 3 + 1] = 0; arr[i * 3 + 2] = 6 - Math.random() * 26; }
      }
      pGeo.attributes.position.needsUpdate = true;

      // slow cinematic drift + gentle parallax
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;
      camera.position.x = Math.sin(t * 0.06) * 0.5 + pointer.x * 1.1;
      camera.position.y = 1.15 - pointer.y * 0.3;
      camera.position.z = 9 + Math.sin(t * 0.045) * 0.35;
      camera.lookAt(pointer.x * 0.6, 1.5, -10);
    }
    renderer.render(scene, camera);
  }

  function loop() {
    if (running) return;
    running = true;
    const tick = () => {
      if (!visible || document.hidden) { running = false; return; }
      render();
      if (reduceMotion) { running = false; return; }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function onResize() {
    camera.aspect = W() / H();
    camera.updateProjectionMatrix();
    renderer.setSize(W(), H());
    if (reduceMotion) render();
  }
  window.addEventListener("resize", onResize, { passive: true });

  render();
  loop();
})();
