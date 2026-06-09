/* ============================================================
   B&T Bargains — Hero 3D scene
   A low-poly floating farm island: barn, silo, spinning
   windmill, drifting clouds, a warm sun and orbiting produce.
   Built with three.js (loaded via import map). No build step.
   Fails gracefully to the SVG fallback if WebGL is unavailable.
   ============================================================ */

import * as THREE from "three";

const mount = document.getElementById("hero3d");

(function initFarm() {
  if (!mount) return;

  // Respect users who prefer less motion: keep the still SVG fallback.
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (err) {
    // No WebGL — the SVG fallback stays visible.
    return;
  }

  // ---- palette (matches the rustic CSS theme) ----
  const C = {
    grass:   0x7a8c4a,
    grassHi: 0x90a058,
    dirt:    0x7a5a44,
    dirtDk:  0x5b4636,
    barn:    0x9b3322,
    barnDk:  0x7a2618,
    cream:   0xf6efe1,
    silo:    0xcdd2d6,
    siloDk:  0x9aa0a6,
    wood:    0x5b4636,
    leaf:    0x5c6b3a,
    leafHi:  0x7a8c4a,
    gold:    0xd39a3a,
    hay:     0xd6b057,
    water:   0x6fa9c4,
    apple:   0xc0492f,
    pumpkin: 0xe08a32,
    tomato:  0xd6483a,
  };

  const W = () => mount.clientWidth || window.innerWidth;
  const H = () => mount.clientHeight || window.innerHeight;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(42, W() / H(), 0.1, 100);
  camera.position.set(0, 3.4, 11.5);
  camera.lookAt(0, 0.4, 0);

  const smallScreen = Math.min(window.innerWidth, window.innerHeight) < 680;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setSize(W(), H());
  renderer.setClearColor(0x000000, 0); // transparent — CSS provides the sky
  if (!smallScreen) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }
  mount.appendChild(renderer.domElement);
  renderer.domElement.style.pointerEvents = "none";
  mount.classList.add("is-live");

  // ---- lights ----
  const hemi = new THREE.HemisphereLight(0xfff1d6, 0x6b5a3e, 0.95);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xffe6b0, 1.5);
  sun.position.set(-6, 9, 5);
  if (!smallScreen) {
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 30;
    sun.shadow.camera.left = -9;
    sun.shadow.camera.right = 9;
    sun.shadow.camera.top = 9;
    sun.shadow.camera.bottom = -9;
    sun.shadow.bias = -0.0006;
  }
  scene.add(sun);

  const fill = new THREE.DirectionalLight(0xffd9a8, 0.35);
  fill.position.set(6, 4, 8);
  scene.add(fill);

  // ---- helpers ----
  const std = (color, opts = {}) =>
    new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.92, metalness: 0.0, ...opts });

  function mesh(geo, mat, { cast = true, receive = false } = {}) {
    const m = new THREE.Mesh(geo, mat);
    m.castShadow = cast;
    m.receiveShadow = receive;
    return m;
  }

  // ============ THE ISLAND ============
  const island = new THREE.Group();
  scene.add(island);

  // grass top
  const top = mesh(
    new THREE.CylinderGeometry(5, 5, 1, 28),
    std(C.grass),
    { cast: true, receive: true }
  );
  top.position.y = -0.5;
  island.add(top);

  // a thin two-tone grass cap, kept flush with the top surface (y≈0)
  const cap = mesh(new THREE.CylinderGeometry(4.7, 4.9, 0.2, 28), std(C.grassHi), { receive: true });
  cap.position.y = -0.06;
  island.add(cap);

  // dirt underside (floating chunk of earth)
  const dirt = mesh(new THREE.CylinderGeometry(5, 1.2, 3.4, 28), std(C.dirt));
  dirt.position.y = -2.7;
  island.add(dirt);
  const dirtTip = mesh(new THREE.ConeGeometry(1.2, 2.2, 24), std(C.dirtDk));
  dirtTip.position.y = -5.3;
  island.add(dirtTip);

  // a few floating rocks below
  for (let i = 0; i < 5; i++) {
    const r = 0.18 + Math.random() * 0.22;
    const rock = mesh(new THREE.DodecahedronGeometry(r, 0), std(0x6b5544));
    const a = Math.random() * Math.PI * 2;
    rock.position.set(Math.cos(a) * (1.5 + Math.random()), -4 - Math.random() * 2.4, Math.sin(a) * (1.5 + Math.random()));
    island.add(rock);
  }

  // ============ BARN ============
  const barn = new THREE.Group();
  barn.position.set(-1.7, 0, -0.4);
  barn.rotation.y = 0.5;
  island.add(barn);

  const barnBody = mesh(new THREE.BoxGeometry(2.2, 1.5, 1.8), std(C.barn), { receive: true });
  barnBody.position.y = 0.75;
  barn.add(barnBody);

  // gable roof (triangular prism)
  const roofShape = new THREE.Shape();
  roofShape.moveTo(-1.25, 0); roofShape.lineTo(1.25, 0); roofShape.lineTo(0, 1.0); roofShape.lineTo(-1.25, 0);
  const roof = mesh(
    new THREE.ExtrudeGeometry(roofShape, { depth: 1.9, bevelEnabled: false }),
    std(C.barnDk)
  );
  // triangle stands in XY and extrudes along +Z (the barn's depth); center it over the body
  roof.position.set(0, 1.5, -0.95);
  barn.add(roof);

  // white trim + door + windows
  const door = mesh(new THREE.BoxGeometry(0.7, 0.95, 0.06), std(C.cream));
  door.position.set(0, 0.5, 0.92);
  barn.add(door);
  const doorX = mesh(new THREE.BoxGeometry(0.7, 0.08, 0.07), std(C.barn));
  doorX.position.set(0, 0.5, 0.95); doorX.rotation.z = 0.6; barn.add(doorX);
  const doorX2 = doorX.clone(); doorX2.rotation.z = -0.6; barn.add(doorX2);

  const haylight = mesh(new THREE.CircleGeometry(0.22, 5), std(C.cream, { side: THREE.DoubleSide }));
  haylight.position.set(0, 1.35, 0.93); barn.add(haylight);

  for (const sx of [-0.7, 0.7]) {
    const win = mesh(new THREE.BoxGeometry(0.32, 0.32, 0.06), std(C.cream));
    win.position.set(sx, 0.85, 0.92); barn.add(win);
  }

  // ============ SILO ============
  const silo = new THREE.Group();
  silo.position.set(0.55, 0, -1.3);
  island.add(silo);
  const siloBody = mesh(new THREE.CylinderGeometry(0.55, 0.55, 2.1, 18), std(C.silo, { metalness: 0.25, roughness: 0.6 }));
  siloBody.position.y = 1.05; silo.add(siloBody);
  // corrugation rings
  for (let i = 0; i < 5; i++) {
    const ring = mesh(new THREE.TorusGeometry(0.56, 0.03, 6, 18), std(C.siloDk), { cast: false });
    ring.rotation.x = Math.PI / 2; ring.position.y = 0.35 + i * 0.4; silo.add(ring);
  }
  const siloDome = mesh(new THREE.SphereGeometry(0.55, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), std(C.siloDk, { metalness: 0.3, roughness: 0.5 }));
  siloDome.position.y = 2.1; silo.add(siloDome);

  // ============ WINDMILL (animated) ============
  const windmill = new THREE.Group();
  windmill.position.set(2.6, 0, 1.1);
  island.add(windmill);

  // lattice tower (tapered)
  const tower = mesh(new THREE.CylinderGeometry(0.12, 0.32, 2.4, 8, 1, true), std(C.wood, { side: THREE.DoubleSide }));
  tower.position.y = 1.2; windmill.add(tower);
  // cross-braces
  for (let i = 0; i < 3; i++) {
    const brace = mesh(new THREE.TorusGeometry(0.18 + i * 0.05, 0.018, 5, 10), std(0x4a3a2c), { cast: false });
    brace.rotation.x = Math.PI / 2; brace.position.y = 0.6 + i * 0.6; windmill.add(brace);
  }

  // fan wheel
  const fan = new THREE.Group();
  fan.position.set(0, 2.5, 0.18);
  windmill.add(fan);
  const hub = mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.14, 12), std(C.barn));
  hub.rotation.x = Math.PI / 2; fan.add(hub);
  const bladeGeo = new THREE.BoxGeometry(0.07, 0.42, 0.02);
  const bladeMat = std(C.cream, { metalness: 0.2, roughness: 0.6 });
  const blades = 14;
  for (let i = 0; i < blades; i++) {
    const b = mesh(bladeGeo, bladeMat, { cast: false });
    const a = (i / blades) * Math.PI * 2;
    b.position.set(Math.sin(a) * 0.28, Math.cos(a) * 0.28, 0.04);
    b.rotation.z = -a;
    b.rotation.y = 0.35; // slight pitch so it reads like a fan
    fan.add(b);
  }
  const fanRing = mesh(new THREE.TorusGeometry(0.5, 0.02, 6, 22), std(C.barnDk), { cast: false });
  fanRing.position.z = 0.04; fan.add(fanRing);
  // tail vane
  const vane = mesh(new THREE.BoxGeometry(0.6, 0.3, 0.02), std(C.barn));
  vane.position.set(-0.55, 2.5, 0); windmill.add(vane);
  const vaneArm = mesh(new THREE.BoxGeometry(0.5, 0.05, 0.05), std(C.wood));
  vaneArm.position.set(-0.3, 2.5, 0); windmill.add(vaneArm);

  // ============ TREES ============
  function makeTree(x, z, s = 1) {
    const t = new THREE.Group();
    const trunk = mesh(new THREE.CylinderGeometry(0.1 * s, 0.14 * s, 0.7 * s, 7), std(C.wood));
    trunk.position.y = 0.35 * s; t.add(trunk);
    const foliage = mesh(new THREE.IcosahedronGeometry(0.55 * s, 0), std(C.leaf), { receive: false });
    foliage.position.y = 0.95 * s; t.add(foliage);
    const foliage2 = mesh(new THREE.IcosahedronGeometry(0.4 * s, 0), std(C.leafHi));
    foliage2.position.set(0.25 * s, 1.2 * s, 0.1 * s); t.add(foliage2);
    t.position.set(x, 0, z);
    island.add(t);
  }
  makeTree(-3.4, 1.8, 1.1);
  makeTree(-3.8, -1.2, 0.85);
  makeTree(3.4, -2.2, 0.95);
  makeTree(-0.4, 2.9, 0.8);

  // ============ CROP ROWS (corn) ============
  const cropPatch = new THREE.Group();
  cropPatch.position.set(1.6, 0, -2.4);
  cropPatch.rotation.y = -0.2;
  island.add(cropPatch);
  const stalkMat = std(C.leafHi);
  const cornMat = std(C.gold);
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 5; c++) {
      const stalk = mesh(new THREE.ConeGeometry(0.06, 0.55, 5), stalkMat, { cast: false });
      stalk.position.set(c * 0.26 - 0.5, 0.28, r * 0.26 - 0.4);
      cropPatch.add(stalk);
      const cob = mesh(new THREE.SphereGeometry(0.05, 6, 5), cornMat, { cast: false });
      cob.position.set(c * 0.26 - 0.5, 0.42, r * 0.26 - 0.4);
      cropPatch.add(cob);
    }
  }
  // tilled soil patch under the corn
  const soil = mesh(new THREE.BoxGeometry(1.7, 0.08, 1.5), std(C.dirt), { cast: false, receive: true });
  soil.position.set(0.1, 0.02, 0.25); cropPatch.add(soil);

  // ============ HAYSTACKS ============
  function makeHay(x, z) {
    const hay = mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.42, 12), std(C.hay));
    hay.rotation.z = Math.PI / 2; hay.position.set(x, 0.18, z); island.add(hay);
    const ring = mesh(new THREE.TorusGeometry(0.3, 0.04, 6, 14), std(C.gold), { cast: false });
    ring.position.set(x, 0.18, z); island.add(ring);
  }
  makeHay(-2.3, 1.0);
  makeHay(-1.4, 1.5);

  // ============ POND ============
  const pond = mesh(new THREE.CircleGeometry(0.85, 22), std(C.water, { metalness: 0.4, roughness: 0.25, transparent: true, opacity: 0.92 }), { cast: false, receive: false });
  pond.rotation.x = -Math.PI / 2; pond.position.set(-2.6, 0.02, -1.9); island.add(pond);

  // ============ FENCE (partial rim) ============
  const fenceMat = std(C.cream);
  for (let i = 0; i < 9; i++) {
    const a = -0.4 + i * 0.18;
    const post = mesh(new THREE.BoxGeometry(0.07, 0.5, 0.07), fenceMat, { cast: false });
    post.position.set(Math.cos(a) * 4.4, 0.2, Math.sin(a) * 4.4);
    island.add(post);
  }

  // ============ SUN (soft sprite halo) ============
  function sunSprite() {
    const cv = document.createElement("canvas");
    cv.width = cv.height = 256;
    const g = cv.getContext("2d");
    const grad = g.createRadialGradient(128, 128, 8, 128, 128, 128);
    grad.addColorStop(0, "rgba(255,247,214,0.95)");
    grad.addColorStop(0.25, "rgba(255,221,140,0.65)");
    grad.addColorStop(0.6, "rgba(255,200,110,0.18)");
    grad.addColorStop(1, "rgba(255,200,110,0)");
    g.fillStyle = grad; g.fillRect(0, 0, 256, 256);
    const tex = new THREE.CanvasTexture(cv);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const sp = new THREE.Sprite(mat);
    sp.scale.set(9, 9, 1);
    sp.position.set(-7, 6.5, -6);
    scene.add(sp);
    // bright core
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.9, 18, 14), new THREE.MeshBasicMaterial({ color: 0xfff2cf }));
    core.position.copy(sp.position);
    scene.add(core);
  }
  sunSprite();

  // ============ CLOUDS (drifting) ============
  const clouds = [];
  function makeCloud(radius, height, speed, scale) {
    const c = new THREE.Group();
    const m = new THREE.MeshStandardMaterial({ color: 0xfdf8ee, flatShading: true, roughness: 1 });
    const puffs = [[0, 0, 0, 0.7], [0.6, -0.05, 0, 0.5], [-0.6, -0.05, 0, 0.5], [0.2, 0.25, 0.1, 0.45]];
    for (const [x, y, z, r] of puffs) {
      const puff = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 0), m);
      puff.position.set(x, y, z); c.add(puff);
    }
    c.scale.setScalar(scale);
    c.userData = { radius, height, speed, angle: Math.random() * Math.PI * 2 };
    scene.add(c);
    clouds.push(c);
  }
  // kept above the barn/silo/windmill (which reach ~y2.5) so they drift over, not through, the farm
  makeCloud(8.5, 3.8, 0.04, 1.1);
  makeCloud(9.5, 3.1, 0.03, 0.9);
  makeCloud(7.8, 4.6, 0.05, 0.7);
  makeCloud(10, 3.4, 0.025, 1.0);

  // ============ ORBITING PRODUCE ============
  const produce = [];
  function makeProduce(color, r, radius, height, speed, ridged = false) {
    const g = new THREE.Group();
    const body = mesh(ridged ? new THREE.SphereGeometry(r, 10, 8) : new THREE.IcosahedronGeometry(r, 0), std(color, { roughness: 0.7 }));
    if (ridged) body.scale.set(1, 0.85, 1);
    g.add(body);
    // little stem + leaf
    const stem = mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.18, 5), std(C.wood), { cast: false });
    stem.position.y = r * 0.85; g.add(stem);
    const leaf = mesh(new THREE.IcosahedronGeometry(0.1, 0), std(C.leafHi), { cast: false });
    leaf.position.set(0.1, r * 0.85, 0); leaf.scale.set(1.4, 0.4, 0.8); g.add(leaf);
    g.userData = { radius, height, speed, angle: Math.random() * Math.PI * 2, spin: 0.5 + Math.random() };
    scene.add(g);
    produce.push(g);
  }
  makeProduce(C.apple, 0.34, 5.6, 1.6, 0.32);
  makeProduce(C.pumpkin, 0.42, 6.2, 0.6, -0.24, true);
  makeProduce(C.tomato, 0.3, 5.2, 2.4, 0.4);
  makeProduce(C.gold, 0.3, 6.6, 1.9, -0.3, true); // a squash/gourd

  // ============ INTERACTION + ANIMATION ============
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  if (!reduceMotion) {
    window.addEventListener("pointermove", (e) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  // Pause rendering when the hero is off-screen or the tab is hidden.
  let visible = true;
  const io = new IntersectionObserver(
    (entries) => { visible = entries[0].isIntersecting; if (visible) loop(); },
    { threshold: 0.01 }
  );
  io.observe(mount);
  document.addEventListener("visibilitychange", () => { if (!document.hidden && visible) loop(); });

  const clock = new THREE.Clock();
  let running = false;

  function render() {
    const t = clock.getElapsedTime();

    if (!reduceMotion) {
      // island slow spin + gentle bob
      island.rotation.y = t * 0.12;
      island.position.y = Math.sin(t * 0.8) * 0.18;

      // windmill spins
      fan.rotation.z = t * 1.6;

      // clouds drift
      for (const c of clouds) {
        c.userData.angle += c.userData.speed * 0.01;
        c.position.set(
          Math.cos(c.userData.angle) * c.userData.radius,
          c.userData.height + Math.sin(t * 0.5 + c.userData.radius) * 0.12,
          Math.sin(c.userData.angle) * c.userData.radius - 2
        );
      }

      // produce orbits + spins
      for (const p of produce) {
        p.userData.angle += p.userData.speed * 0.008;
        p.position.set(
          Math.cos(p.userData.angle) * p.userData.radius,
          p.userData.height + Math.sin(t * 0.9 + p.userData.radius) * 0.25,
          Math.sin(p.userData.angle) * p.userData.radius
        );
        p.rotation.y += 0.01 * p.userData.spin;
        p.rotation.x = Math.sin(t * p.userData.spin) * 0.2;
      }

      // camera parallax
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      camera.position.x = pointer.x * 1.4;
      camera.position.y = 3.4 - pointer.y * 0.8;
      camera.lookAt(0, 0.4, 0);
    }

    renderer.render(scene, camera);
  }

  function loop() {
    if (running) return;
    running = true;
    const tick = () => {
      if (!visible || document.hidden) { running = false; return; }
      render();
      if (reduceMotion) { running = false; return; } // one frame is enough
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

  // kick it off
  render();   // paint first frame immediately
  loop();
})();
