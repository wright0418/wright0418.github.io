/**
 * ============================================================================
 * 星際先鋒 STAR VANGUARD 3D
 * 純靜態 Three.js 太空射擊遊戲 (可直接部署於 GitHub Pages)
 * ============================================================================
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. Web Audio API 合成音效引擎 (完全免外部音檔)
     ========================================================================== */
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.muted = false;
      this.noiseBuffer = null;
    }

    /** 在首次使用者互動時初始化 AudioContext，避免瀏覽器自動播放限制 */
    init() {
      try {
        if (!this.ctx) {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (!AudioCtx) return;
          this.ctx = new AudioCtx();
          this._createNoiseBuffer();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
      } catch (err) {
        console.warn('音訊初始化失敗:', err);
      }
    }

    /** 預先產生白噪音緩衝，用於爆炸低音轟鳴與推進氣流聲 */
    _createNoiseBuffer() {
      if (!this.ctx) return;
      const length = this.ctx.sampleRate * 1.2;
      const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      this.noiseBuffer = buffer;
    }

    toggleMute() {
      this.muted = !this.muted;
      return this.muted;
    }

    /** 玩家雷射發射音效 */
    playLaser(upgraded = false) {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = upgraded ? 'sawtooth' : 'triangle';

        const startFreq = upgraded ? 1120 : 880;
        const endFreq = upgraded ? 220 : 180;
        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.11);

        gain.gain.setValueAtTime(upgraded ? 0.11 : 0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      } catch (e) {}
    }

    /** 敵機電漿彈發射音效 */
    playEnemyShot() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.14);

        gain.gain.setValueAtTime(0.055, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      } catch (e) {}
    }

    /** 命中裝甲清脆火花聲 */
    playHit() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.06);

        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.07);
      } catch (e) {}
    }

    /** 爆炸低音轟鳴 (濾波噪音 + 重低音震盪) */
    playExplosion(scale = 1) {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const duration = Math.min(0.85, 0.35 + scale * 0.22);

        // 1. 低通濾波噪音
        if (this.noiseBuffer) {
          const noise = this.ctx.createBufferSource();
          noise.buffer = this.noiseBuffer;

          const filter = this.ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(850, now);
          filter.frequency.exponentialRampToValueAtTime(75, now + duration);

          const nGain = this.ctx.createGain();
          nGain.gain.setValueAtTime(Math.min(0.28, 0.16 * scale), now);
          nGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

          noise.connect(filter);
          filter.connect(nGain);
          nGain.connect(this.ctx.destination);
          noise.start(now);
          noise.stop(now + duration);
        }

        // 2. 次低音衝擊波
        const sub = this.ctx.createOscillator();
        const sGain = this.ctx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(115, now);
        sub.frequency.exponentialRampToValueAtTime(28, now + duration * 0.85);
        sGain.gain.setValueAtTime(Math.min(0.32, 0.2 * scale), now);
        sGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.85);
        sub.connect(sGain);
        sGain.connect(this.ctx.destination);
        sub.start(now);
        sub.stop(now + duration * 0.9);
      } catch (e) {}
    }

    /** 道具拾取分解和弦音效 */
    playPowerup(isWeapon = false) {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const notes = isWeapon ? [523.25, 659.25, 783.99, 1046.5] : [440, 554.37, 659.25];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          const t = now + idx * 0.06;
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.12, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.19);
        });
      } catch (e) {}
    }

    /** 玩家受擊警報音效 */
    playDamage() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        [0, 0.1].forEach((offset) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(210, now + offset);
          osc.frequency.linearRampToValueAtTime(125, now + offset + 0.085);
          gain.gain.setValueAtTime(0.15, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.09);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + offset);
          osc.stop(now + offset + 0.095);
        });
      } catch (e) {}
    }

    /** 無敵閃避推進音效 */
    playDash() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(920, now + 0.18);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.36);

        gain.gain.setValueAtTime(0.13, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      } catch (e) {}
    }

    /** 波次升級提示音 */
    playWaveUp() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const freqs = [392, 493.88, 587.33, 783.99];
        freqs.forEach((f, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          const t = now + i * 0.08;
          osc.frequency.setValueAtTime(f, t);
          gain.gain.setValueAtTime(0.1, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.34);
        });
      } catch (e) {}
    }
  }

  /* ==========================================================================
     2. 全域常數與遊戲狀態管理
     ========================================================================== */
  const STORAGE_KEY_BEST = 'star_vanguard_3d_highscore_v1';

  const CAMERA_PRESETS = [
    { name: '標準追尾', pos: new THREE.Vector3(0, 3.8, 22.5), look: new THREE.Vector3(0, 0.2, -24), fov: 60 },
    { name: '低空俯衝', pos: new THREE.Vector3(0, 1.8, 17.5), look: new THREE.Vector3(0, 0.8, -32), fov: 68 },
    { name: '戰術高空', pos: new THREE.Vector3(0, 9.5, 25.5), look: new THREE.Vector3(0, -1.5, -18), fov: 56 }
  ];

  const state = {
    mode: 'menu', // 'menu' | 'playing' | 'paused' | 'gameover'
    score: 0,
    bestScore: 0,
    wave: 1,
    waveTimer: 0,
    kills: 0,

    // 玩家屬性
    hp: 100,
    maxHp: 100,
    invulnTimer: 0,
    dashTimer: 0,
    dashCooldown: 0,
    dashMaxCooldown: 3.8,
    dashDuration: 0.55,

    // 武器系統
    weaponLevel: 1, // 1: 雙聯雷射, 2: 三向散射
    weaponTimer: 0,
    weaponMaxTime: 14.0,
    fireCooldown: 0,
    autoFire: true,

    // 鏡頭與特效
    cameraPresetIdx: 0,
    cameraOrbitX: 0,
    cameraOrbitY: 0,
    shakeIntensity: 0,
    fxFlashTimer: 0,

    // 動態遊玩邊界 (於 Z=0 平面)
    boundsX: 15.5,
    boundsY: 8.8,

    // 生成計時器
    asteroidSpawnTimer: 0.8,
    enemySpawnTimer: 2.2,
    eliteSpawnTimer: 16.0
  };

  // 輸入狀態
  const input = {
    keys: {},
    controlMode: 'keyboard', // 'keyboard' | 'pointer'
    pointerActive: false,
    pointerShooting: false,
    pointerTargetX: 0,
    pointerTargetY: 0,
    lastMouseX: 0,
    lastMouseY: 0,
    // 右鍵拖曳微調鏡頭角度
    rightDragging: false,
    dragStartX: 0,
    dragStartY: 0
  };

  // DOM 元件快取
  const dom = {
    container: document.getElementById('game-container'),
    fxOverlay: document.getElementById('fx-overlay'),
    hud: document.getElementById('hud'),
    hudScore: document.getElementById('hud-score'),
    hudBest: document.getElementById('hud-best'),
    hudWave: document.getElementById('hud-wave'),
    hudHpText: document.getElementById('hud-hp-text'),
    barShield: document.getElementById('bar-shield'),
    hudDashText: document.getElementById('hud-dash-text'),
    barDash: document.getElementById('bar-dash'),
    weaponTimerRow: document.getElementById('weapon-timer-row'),
    hudWeaponTime: document.getElementById('hud-weapon-time'),
    barWeapon: document.getElementById('bar-weapon'),
    hudWeaponName: document.getElementById('hud-weapon-name'),

    waveBanner: document.getElementById('wave-banner'),
    waveBannerTitle: document.getElementById('wave-banner-title'),
    waveBannerSub: document.getElementById('wave-banner-sub'),
    toastMsg: document.getElementById('toast-msg'),

    screenStart: document.getElementById('screen-start'),
    screenPause: document.getElementById('screen-pause'),
    screenGameOver: document.getElementById('screen-gameover'),
    startBestScore: document.getElementById('start-best-score'),
    endScore: document.getElementById('end-score'),
    endBest: document.getElementById('end-best'),
    endWave: document.getElementById('end-wave'),
    endKills: document.getElementById('end-kills'),
    newRecordTag: document.getElementById('gameover-new-record'),

    btnStart: document.getElementById('btn-start'),
    btnResume: document.getElementById('btn-resume'),
    btnRestartPause: document.getElementById('btn-restart-pause'),
    btnRetry: document.getElementById('btn-retry'),
    btnAutofire: document.getElementById('btn-autofire'),
    btnCamera: document.getElementById('btn-camera'),
    btnMute: document.getElementById('btn-mute'),
    btnPause: document.getElementById('btn-pause'),
    btnDashMobile: document.getElementById('btn-dash-mobile'),

    errorBox: document.getElementById('error-box'),
    errorBoxMsg: document.getElementById('error-box-msg')
  };

  const sound = new SoundEngine();

  // Three.js 核心變數
  let scene, camera, renderer, clock;
  let playerGroup, playerShieldMesh, leftFlame, rightFlame, engineLight;
  let starPoints, warpStreaks, nebulaGroup, gridHelper;

  // 動態物件池陣列
  let playerBullets = [];
  let enemyBullets = [];
  let enemies = []; // 包含隕石、無人機、菁英敵機
  let powerups = [];
  let particles = [];
  let shockwaves = [];

  // 共用程式化發光貼圖 (透過 Canvas 繪製，零外部圖片請求)
  let glowTextures = {};

  /* ==========================================================================
     3. 本地最高分儲存 (含異常防護)
     ========================================================================== */
  function loadBestScore() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BEST);
      state.bestScore = saved ? parseInt(saved, 10) || 0 : 0;
    } catch (e) {
      state.bestScore = 0;
    }
    dom.hudBest.textContent = state.bestScore.toLocaleString();
    dom.startBestScore.textContent = state.bestScore.toLocaleString();
  }

  function saveBestScore() {
    if (state.score > state.bestScore) {
      state.bestScore = state.score;
      try {
        localStorage.setItem(STORAGE_KEY_BEST, String(state.bestScore));
      } catch (e) {}
      return true;
    }
    return false;
  }

  /* ==========================================================================
     4. Three.js 場景、材質與 3D 模型建構器
     ========================================================================== */

  /** 使用離屏 Canvas 產生柔和徑向光暈貼圖 */
  function createGlowTexture(innerColor, midColor, outerColor = 'rgba(0,0,0,0)') {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(size / 2, size / 2, 2, size / 2, size / 2, size / 2);
    grad.addColorStop(0, innerColor);
    grad.addColorStop(0.35, midColor);
    grad.addColorStop(1, outerColor);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }

  /** 初始化 Three.js 渲染器、場景、霧效與燈光 */
  function initThreeScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x02050f);
    // 深空指數霧效，讓遠處星體與敵機自然浮現
    scene.fog = new THREE.FogExp2(0x030818, 0.0072);

    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 400);
    camera.position.copy(CAMERA_PRESETS[0].pos);
    camera.lookAt(CAMERA_PRESETS[0].look);

    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    dom.container.appendChild(renderer.domElement);

    // 燈光配置：環境光 + 主方向光 + 科幻冷藍補光
    const ambientLight = new THREE.AmbientLight(0x4b6a9b, 1.15);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xeef8ff, 1.45);
    dirLight.position.set(14, 24, 18);
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x00d9ff, 0.85);
    rimLight.position.set(-18, -10, -16);
    scene.add(rimLight);

    // 建立常用光暈貼圖
    glowTextures = {
      cyan: createGlowTexture('rgba(255,255,255,1)', 'rgba(0,243,255,0.65)'),
      gold: createGlowTexture('rgba(255,255,230,1)', 'rgba(255,190,11,0.7)'),
      green: createGlowTexture('rgba(230,255,245,1)', 'rgba(0,255,157,0.7)'),
      red: createGlowTexture('rgba(255,235,235,1)', 'rgba(255,42,95,0.75)'),
      purple: createGlowTexture('rgba(255,220,255,1)', 'rgba(181,23,158,0.65)'),
      nebulaBlue: createGlowTexture('rgba(30,90,220,0.32)', 'rgba(12,35,95,0.12)'),
      nebulaPurple: createGlowTexture('rgba(150,35,180,0.28)', 'rgba(45,10,70,0.08)')
    };

    createSpaceEnvironment();
    createPlayerShip();
    updateResponsiveBounds();
  }

  /** 建立多層次高速流動 3D 星空 (Warp Starfield)、遠景星雲與航道網格 */
  function createSpaceEnvironment() {
    // 層級 1：1400 顆遠中景深空星塵
    const starCount = 1400;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const palette = [
      new THREE.Color(0xffffff),
      new THREE.Color(0x9be7ff),
      new THREE.Color(0xc4b5fd),
      new THREE.Color(0xfde68a)
    ];

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 240;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 160;
      starPositions[i * 3 + 2] = -Math.random() * 260 + 35;
      const col = palette[Math.floor(Math.random() * palette.length)];
      starColors[i * 3] = col.r;
      starColors[i * 3 + 1] = col.g;
      starColors[i * 3 + 2] = col.b;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.72,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // 層級 2：高速曲速流線光束 (Warp Streaks)
    warpStreaks = new THREE.Group();
    const streakGeo = new THREE.BoxGeometry(0.06, 0.06, 4.5);
    const streakMat = new THREE.MeshBasicMaterial({
      color: 0x70f3ff,
      transparent: true,
      opacity: 0.52,
      blending: THREE.AdditiveBlending
    });

    for (let i = 0; i < 110; i++) {
      const mesh = new THREE.Mesh(streakGeo, streakMat);
      resetWarpStreak(mesh, true);
      warpStreaks.add(mesh);
    }
    scene.add(warpStreaks);

    // 層級 3：深空星雲發光體 (遠景氛圍)
    nebulaGroup = new THREE.Group();
    const nebulaConfigs = [
      { x: -45, y: 24, z: -155, scale: 120, tex: glowTextures.nebulaBlue },
      { x: 52, y: -16, z: -175, scale: 140, tex: glowTextures.nebulaPurple },
      { x: 5, y: 35, z: -195, scale: 110, tex: glowTextures.nebulaBlue }
    ];
    nebulaConfigs.forEach((cfg) => {
      const mat = new THREE.SpriteMaterial({
        map: cfg.tex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const sprite = new THREE.Sprite(mat);
      sprite.position.set(cfg.x, cfg.y, cfg.z);
      sprite.scale.set(cfg.scale, cfg.scale, 1);
      nebulaGroup.add(sprite);
    });
    scene.add(nebulaGroup);

    // 層級 4：下方遠景微光星際航道網格 (大幅增強空間速度感)
    gridHelper = new THREE.GridHelper(180, 36, 0x00a8cc, 0x092447);
    gridHelper.position.set(0, -16, -65);
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.22;
    scene.add(gridHelper);
  }

  function resetWarpStreak(mesh, randomZ = false) {
    // 避免遮擋中央戰機視線，分佈於外環柱狀空間
    const angle = Math.random() * Math.PI * 2;
    const radius = 14 + Math.random() * 48;
    mesh.position.x = Math.cos(angle) * radius;
    mesh.position.y = Math.sin(angle) * radius * 0.7;
    mesh.position.z = randomZ ? -Math.random() * 200 + 25 : -170 - Math.random() * 60;
    mesh.userData.speed = 65 + Math.random() * 55;
  }

  /** 組裝高精緻度玩家科幻太空戰機 */
  function createPlayerShip() {
    playerGroup = new THREE.Group();

    // 材質定義
    const hullMat = new THREE.MeshStandardMaterial({
      color: 0xdbeafe,
      metalness: 0.65,
      roughness: 0.28
    });
    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.75,
      roughness: 0.35
    });
    const accentMat = new THREE.MeshStandardMaterial({
      color: 0x00b4d8,
      emissive: 0x006688,
      emissiveIntensity: 0.55,
      metalness: 0.5,
      roughness: 0.25
    });
    const cockpitMat = new THREE.MeshPhongMaterial({
      color: 0x00f3ff,
      emissive: 0x00a8e8,
      emissiveIntensity: 0.8,
      shininess: 120,
      transparent: true,
      opacity: 0.88
    });

    // 1. 中央流線主機身
    const bodyGeo = new THREE.ConeGeometry(0.75, 4.4, 5);
    bodyGeo.rotateX(-Math.PI / 2);
    const body = new THREE.Mesh(bodyGeo, hullMat);
    body.scale.set(1.05, 0.52, 1.0);
    body.position.set(0, 0, -0.35);
    playerGroup.add(body);

    // 機身中段裝甲脊背
    const spineGeo = new THREE.BoxGeometry(0.9, 0.42, 2.3);
    const spine = new THREE.Mesh(spineGeo, darkMat);
    spine.position.set(0, 0.08, 0.55);
    playerGroup.add(spine);

    // 2. 發光流線駕駛艙
    const cockpitGeo = new THREE.SphereGeometry(0.45, 16, 12);
    const cockpit = new THREE.Mesh(cockpitGeo, cockpitMat);
    cockpit.scale.set(0.85, 0.55, 2.1);
    cockpit.position.set(0, 0.34, -0.15);
    playerGroup.add(cockpit);

    // 3. 雙側後掠三角主翼 (以自訂 ExtrudeGeometry 打造俐落科幻外型)
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0.7);
    wingShape.lineTo(2.75, -0.95);
    wingShape.lineTo(2.55, -1.55);
    wingShape.lineTo(0.45, -1.1);
    wingShape.lineTo(0, -1.25);
    wingShape.closePath();

    const wingGeo = new THREE.ExtrudeGeometry(wingShape, {
      depth: 0.1,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 2
    });
    wingGeo.rotateX(Math.PI / 2);

    const rightWing = new THREE.Mesh(wingGeo, hullMat);
    rightWing.position.set(0.32, 0.04, 0.25);
    playerGroup.add(rightWing);

    const leftWing = rightWing.clone();
    leftWing.scale.x = -1;
    leftWing.position.x = -0.32;
    playerGroup.add(leftWing);

    // 4. 翼尖導流鰭與霓虹飾條
    [-1, 1].forEach((side) => {
      const finGeo = new THREE.BoxGeometry(0.08, 0.65, 1.05);
      const fin = new THREE.Mesh(finGeo, accentMat);
      fin.position.set(side * 2.75, 0.16, 1.25);
      fin.rotation.z = side * -0.28;
      playerGroup.add(fin);

      // 翼下雷射砲管
      const gunGeo = new THREE.CylinderGeometry(0.07, 0.09, 1.55, 8);
      gunGeo.rotateX(Math.PI / 2);
      const gun = new THREE.Mesh(gunGeo, darkMat);
      gun.position.set(side * 1.48, -0.16, 0.2);
      playerGroup.add(gun);

      // 砲口發光環
      const tipGeo = new THREE.CylinderGeometry(0.085, 0.085, 0.18, 8);
      tipGeo.rotateX(Math.PI / 2);
      const tip = new THREE.Mesh(tipGeo, cockpitMat);
      tip.position.set(side * 1.48, -0.16, -0.58);
      playerGroup.add(tip);

      // 雙側傾斜垂直尾翼
      const tailGeo = new THREE.BoxGeometry(0.08, 0.85, 1.15);
      const tail = new THREE.Mesh(tailGeo, accentMat);
      tail.position.set(side * 0.68, 0.42, 1.32);
      tail.rotation.z = side * -0.38;
      playerGroup.add(tail);

      // 雙引擎噴射艙
      const engGeo = new THREE.CylinderGeometry(0.24, 0.3, 1.25, 12);
      engGeo.rotateX(Math.PI / 2);
      const eng = new THREE.Mesh(engGeo, darkMat);
      eng.position.set(side * 0.56, -0.05, 1.38);
      playerGroup.add(eng);
    });

    // 5. 動態雙引擎尾焰與光暈
    const flameGeo = new THREE.ConeGeometry(0.22, 1.65, 10);
    flameGeo.rotateX(Math.PI / 2);
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending
    });

    leftFlame = new THREE.Mesh(flameGeo, flameMat);
    leftFlame.position.set(-0.56, -0.05, 2.7);
    playerGroup.add(leftFlame);

    rightFlame = new THREE.Mesh(flameGeo, flameMat.clone());
    rightFlame.position.set(0.56, -0.05, 2.7);
    playerGroup.add(rightFlame);

    [-0.56, 0.56].forEach((xPos) => {
      const halo = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glowTextures.cyan,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      );
      halo.position.set(xPos, -0.05, 2.15);
      halo.scale.set(1.75, 1.75, 1);
      playerGroup.add(halo);
    });

    // 引擎點光源照亮機尾
    engineLight = new THREE.PointLight(0x00e5ff, 2.0, 11);
    engineLight.position.set(0, 0.1, 2.6);
    playerGroup.add(engineLight);

    // 6. 能量保護罩球體 (無敵閃避 / 剛受擊時顯示)
    const shieldGeo = new THREE.SphereGeometry(2.85, 24, 18);
    const shieldMat = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      transparent: true,
      opacity: 0.0,
      wireframe: true,
      blending: THREE.AdditiveBlending
    });
    playerShieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    playerGroup.add(playerShieldMesh);

    playerGroup.position.set(0, -1.5, 0);
    scene.add(playerGroup);
  }

  /** 建立多面體不規則旋轉隕石 */
  function spawnAsteroid() {
    const tier = Math.random();
    const radius = tier > 0.82 ? 2.25 : tier > 0.42 ? 1.45 : 0.95;
    const hp = tier > 0.82 ? 5 + Math.floor(state.wave * 0.6) : tier > 0.42 ? 3 : 1;

    const geo = new THREE.IcosahedronGeometry(radius, 1);
    // 隨機偏移頂點形成天然凹凸岩石質感
    const posAttr = geo.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < posAttr.count; i++) {
      v.fromBufferAttribute(posAttr, i);
      const noise = 0.78 + Math.sin(v.x * 3.1 + v.y * 2.7) * 0.15 + Math.cos(v.z * 2.9) * 0.14;
      v.multiplyScalar(noise);
      posAttr.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();

    const rockColors = [0x64748b, 0x78716c, 0x475569, 0x8b6f5c];
    const color = rockColors[Math.floor(Math.random() * rockColors.length)];
    const mat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.88,
      metalness: 0.18,
      flatShading: true
    });

    const mesh = new THREE.Mesh(geo, mat);
    const spawnX = (Math.random() * 2 - 1) * (state.boundsX * 1.15);
    const spawnY = (Math.random() * 2 - 1) * (state.boundsY * 1.05);
    mesh.position.set(spawnX, spawnY, -135 - Math.random() * 35);
    scene.add(mesh);

    const speedBase = 24 + state.wave * 2.4 + Math.random() * 14;
    enemies.push({
      type: 'asteroid',
      mesh,
      hp,
      maxHp: hp,
      radius: radius * 0.95,
      scoreVal: tier > 0.82 ? 120 : tier > 0.42 ? 70 : 40,
      vx: (Math.random() - 0.5) * 3.5,
      vy: (Math.random() - 0.5) * 2.5,
      vz: speedBase,
      rotSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 2.4,
        (Math.random() - 0.5) * 2.4,
        (Math.random() - 0.5) * 2.4
      ),
      hitFlash: 0
    });
  }

  /** 建立會發射電漿彈的敵方無人機 / 攔截機 */
  function spawnEnemyDrone() {
    const group = new THREE.Group();

    const hullMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b2e,
      metalness: 0.72,
      roughness: 0.3
    });
    const redGlowMat = new THREE.MeshBasicMaterial({ color: 0xff2a5f });
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0xb91c1c,
      metalness: 0.5,
      roughness: 0.35
    });

    // 核心機體
    const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.85, 0), hullMat);
    core.scale.set(1.1, 0.65, 1.75);
    group.add(core);

    // 前掠鐮刀翼
    [-1, 1].forEach((side) => {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.12, 0.9), trimMat);
      wing.position.set(side * 1.25, 0, 0.15);
      wing.rotation.y = side * -0.42;
      wing.rotation.z = side * 0.18;
      group.add(wing);
    });

    // 發光紅眼感測器
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.32, 10, 10), redGlowMat);
    eye.position.set(0, 0.06, 1.05);
    group.add(eye);

    const halo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTextures.red,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    halo.scale.set(2.4, 2.4, 1);
    halo.position.set(0, 0, 1.1);
    group.add(halo);

    const spawnX = (Math.random() * 2 - 1) * (state.boundsX * 0.95);
    const spawnY = (Math.random() * 2 - 1) * (state.boundsY * 0.85);
    group.position.set(spawnX, spawnY, -135);
    scene.add(group);

    const hp = 2 + Math.floor(state.wave / 2);
    enemies.push({
      type: 'drone',
      mesh: group,
      hp,
      maxHp: hp,
      radius: 1.55,
      scoreVal: 160 + state.wave * 20,
      vz: 21 + state.wave * 1.8,
      phase: Math.random() * Math.PI * 2,
      swayAmp: 3.2 + Math.random() * 2.5,
      baseX: spawnX,
      fireTimer: 1.1 + Math.random() * 1.2,
      hitFlash: 0
    });
  }

  /** 建立隨波次升級的菁英敵機 (重型巡洋攔截艦) */
  function spawnEliteShip() {
    const group = new THREE.Group();

    const armorMat = new THREE.MeshStandardMaterial({
      color: 0x2e1065,
      metalness: 0.78,
      roughness: 0.25
    });
    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0x78350f,
      emissiveIntensity: 0.45,
      metalness: 0.8,
      roughness: 0.2
    });
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xff007f });

    // 重裝中央艦體
    const mainHull = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.0, 3.8), armorMat);
    group.add(mainHull);

    // 雙側裝甲巨翼
    [-1, 1].forEach((side) => {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.35, 2.2), armorMat);
      wing.position.set(side * 2.2, 0, -0.2);
      wing.rotation.z = side * -0.15;
      group.add(wing);

      const canon = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 2.2, 8), goldTrimMat);
      canon.rotateX(Math.PI / 2);
      canon.position.set(side * 2.6, -0.15, 0.9);
      group.add(canon);
    });

    // 旋轉能量環與核心
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.05, 0.1, 8, 24),
      new THREE.MeshBasicMaterial({ color: 0xe879f9 })
    );
    ring.position.set(0, 0.25, 1.45);
    group.add(ring);

    const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.65, 0), coreMat);
    core.position.set(0, 0.25, 1.45);
    group.add(core);

    const halo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTextures.purple,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    halo.scale.set(4.5, 4.5, 1);
    halo.position.set(0, 0.2, 1.5);
    group.add(halo);

    // 3D 漂浮血量條
    const hpBarBg = new THREE.Mesh(
      new THREE.PlaneGeometry(3.8, 0.28),
      new THREE.MeshBasicMaterial({ color: 0x111827, side: THREE.DoubleSide })
    );
    hpBarBg.position.set(0, 2.1, 0);
    group.add(hpBarBg);

    const hpBarFill = new THREE.Mesh(
      new THREE.PlaneGeometry(3.68, 0.18),
      new THREE.MeshBasicMaterial({ color: 0xff2a5f, side: THREE.DoubleSide })
    );
    hpBarFill.position.set(0, 2.1, 0.04);
    group.add(hpBarFill);

    const spawnX = (Math.random() * 2 - 1) * (state.boundsX * 0.65);
    const spawnY = (Math.random() * 2 - 1) * (state.boundsY * 0.5);
    group.position.set(spawnX, spawnY, -145);
    scene.add(group);

    const hp = 12 + state.wave * 4;
    enemies.push({
      type: 'elite',
      mesh: group,
      ringMesh: ring,
      hpBarFill,
      hp,
      maxHp: hp,
      radius: 3.1,
      scoreVal: 550 + state.wave * 100,
      vz: 14 + state.wave * 0.8,
      hoverZ: -38 - Math.random() * 14,
      phase: Math.random() * Math.PI * 2,
      fireTimer: 1.5,
      hitFlash: 0
    });

    showToast('⚠️ 偵測到高能量反應：菁英巡洋艦出現！', '#ff5e9c');
  }

  /** 生成能量晶體道具 (護盾修復 / 三向散射升級) */
  function spawnPowerup(pos) {
    const isWeapon = Math.random() < 0.52;
    const type = isWeapon ? 'weapon' : 'shield';
    const color = isWeapon ? 0xffbe0b : 0x00ff9d;

    const group = new THREE.Group();
    const crystal = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.75, 0),
      new THREE.MeshPhongMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.75,
        shininess: 100
      })
    );
    group.add(crystal);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.15, 0.06, 8, 24),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8 })
    );
    group.add(ring);

    const halo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: isWeapon ? glowTextures.gold : glowTextures.green,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    halo.scale.set(3.4, 3.4, 1);
    group.add(halo);

    group.position.copy(pos);
    scene.add(group);

    powerups.push({
      type,
      mesh: group,
      crystal,
      ring,
      vz: 18,
      radius: 1.6
    });
  }

  /* ==========================================================================
     5. 戰鬥射擊、爆炸粒子與特效系統
     ========================================================================== */

  /** 玩家發射雷射光束 */
  function firePlayerWeapon() {
    const isTriple = state.weaponLevel >= 2;
    sound.playLaser(isTriple);

    const createBolt = (offsetX, angleX = 0, colorHex = 0x00f3ff) => {
      const geo = new THREE.CylinderGeometry(0.09, 0.09, 3.2, 6);
      geo.rotateX(Math.PI / 2);
      const mat = new THREE.MeshBasicMaterial({
        color: colorHex,
        blending: THREE.AdditiveBlending
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        playerGroup.position.x + offsetX,
        playerGroup.position.y - 0.1,
        playerGroup.position.z - 1.8
      );
      mesh.rotation.y = angleX;
      scene.add(mesh);

      const speed = 135;
      playerBullets.push({
        mesh,
        vx: -Math.sin(angleX) * speed,
        vy: 0,
        vz: -Math.cos(angleX) * speed,
        damage: 1,
        life: 1.6
      });
    };

    if (isTriple) {
      // 三向強化金色高能散射
      createBolt(0, 0, 0xffd166);
      createBolt(-1.35, 0.13, 0x00f3ff);
      createBolt(1.35, -0.13, 0x00f3ff);
      state.fireCooldown = 0.145;
    } else {
      // 標準雙聯翼下脈衝雷射
      createBolt(-1.42, 0, 0x00f3ff);
      createBolt(1.42, 0, 0x00f3ff);
      state.fireCooldown = 0.17;
    }
  }

  /** 敵機朝向玩家發射電漿球 */
  function fireEnemyPlasma(originPos, speed = 42, spreadAngle = 0) {
    const group = new THREE.Group();
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.42, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xff3b6b })
    );
    group.add(core);

    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTextures.red,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    glow.scale.set(2.2, 2.2, 1);
    group.add(glow);

    group.position.copy(originPos);
    scene.add(group);

    // 計算瞄準玩家的方向向量
    const dir = new THREE.Vector3().subVectors(playerGroup.position, originPos).normalize();
    if (spreadAngle !== 0) {
      dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), spreadAngle);
    }

    enemyBullets.push({
      mesh: group,
      vx: dir.x * speed,
      vy: dir.y * speed * 0.85,
      vz: Math.max(20, dir.z * speed),
      radius: 0.65,
      life: 4.5
    });
  }

  /** 建立多粒子 3D 爆炸與震盪波特效 */
  function createExplosion(pos, colorHex = 0xff7b00, scale = 1.0) {
    const count = Math.floor(18 * scale);
    const debrisGeo = new THREE.OctahedronGeometry(0.24 * scale, 0);

    for (let i = 0; i < count; i++) {
      const isHot = Math.random() > 0.35;
      const mat = new THREE.MeshBasicMaterial({
        color: isHot ? colorHex : 0xffffff,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending
      });
      const p = new THREE.Mesh(debrisGeo, mat);
      p.position.copy(pos);

      const speed = (6 + Math.random() * 22) * Math.sqrt(scale);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      scene.add(p);
      particles.push({
        mesh: p,
        vx: Math.sin(phi) * Math.cos(theta) * speed,
        vy: Math.sin(phi) * Math.sin(theta) * speed,
        vz: Math.cos(phi) * speed,
        life: 0.45 + Math.random() * 0.4,
        maxLife: 0.85
      });
    }

    // 擴散能量衝擊環
    const ringGeo = new THREE.RingGeometry(0.4, 0.72, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(pos);
    ring.lookAt(camera.position);
    scene.add(ring);

    shockwaves.push({
      mesh: ring,
      scaleSpeed: 10 * scale,
      life: 0.38,
      maxLife: 0.38
    });
  }

  /** 命中微小火花 */
  function createHitSparks(pos, colorHex = 0x00f3ff) {
    const geo = new THREE.BoxGeometry(0.14, 0.14, 0.14);
    for (let i = 0; i < 6; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending
      });
      const m = new THREE.Mesh(geo, mat);
      m.position.copy(pos);
      scene.add(m);
      particles.push({
        mesh: m,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.5) * 18,
        vz: (Math.random() - 0.5) * 18,
        life: 0.22 + Math.random() * 0.12,
        maxLife: 0.34
      });
    }
  }

  /* ==========================================================================
     6. 玩家互動、閃避推進、受擊與 HUD 更新
     ========================================================================== */

  function triggerScreenFlash(type, duration = 0.24) {
    dom.fxOverlay.className = type;
    state.fxFlashTimer = duration;
  }

  let toastTimer = null;
  function showToast(text, color = '#ffbe0b') {
    dom.toastMsg.textContent = text;
    dom.toastMsg.style.color = color;
    dom.toastMsg.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      dom.toastMsg.classList.remove('show');
    }, 2400);
  }

  let waveBannerTimer = null;
  function showWaveBanner(waveNum) {
    const subtitles = [
      '深空警戒 // 敵方前鋒接近',
      '警告 // 敵方攔截機群增強',
      '高能反應 // 菁英巡洋艦投入戰場',
      '星域封鎖 // 火力全開突破重圍',
      '極限防衛 // 無盡星海決戰'
    ];
    dom.waveBannerTitle.textContent = `WAVE ${String(waveNum).padStart(2, '0')}`;
    dom.waveBannerSub.textContent = subtitles[Math.min(waveNum - 1, subtitles.length - 1)];
    dom.waveBanner.classList.add('show');
    clearTimeout(waveBannerTimer);
    waveBannerTimer = setTimeout(() => {
      dom.waveBanner.classList.remove('show');
    }, 2800);
  }

  /** 觸發無敵閃避加速 (Shift / 手機閃避鍵) */
  function triggerDash() {
    if (state.mode !== 'playing') return;
    if (state.dashCooldown > 0 || state.dashTimer > 0) return;

    state.dashTimer = state.dashDuration;
    state.dashCooldown = state.dashMaxCooldown;
    state.invulnTimer = Math.max(state.invulnTimer, state.dashDuration + 0.15);
    sound.playDash();
    triggerScreenFlash('dash', 0.38);
  }

  /** 玩家受到傷害處理 */
  function damagePlayer(amount) {
    if (state.invulnTimer > 0 || state.mode !== 'playing') return;

    state.hp = Math.max(0, state.hp - amount);
    state.invulnTimer = 0.85;
    state.shakeIntensity = Math.min(1.4, state.shakeIntensity + 0.85);
    sound.playDamage();
    triggerScreenFlash('damage', 0.3);
    createHitSparks(playerGroup.position, 0xff2a5f);
    updateHUD();

    if (state.hp <= 0) {
      endGame();
    }
  }

  /** 同步所有 HUD 數值與進度條 */
  function updateHUD() {
    dom.hudScore.textContent = state.score.toLocaleString();
    dom.hudBest.textContent = Math.max(state.score, state.bestScore).toLocaleString();
    dom.hudWave.textContent = String(state.wave).padStart(2, '0');

    const hpPct = Math.round((state.hp / state.maxHp) * 100);
    dom.hudHpText.textContent = `${hpPct}%`;
    dom.barShield.style.width = `${hpPct}%`;
    dom.barShield.classList.toggle('low', hpPct <= 30);

    const dashReadyPct = state.dashCooldown <= 0
      ? 100
      : Math.round((1 - state.dashCooldown / state.dashMaxCooldown) * 100);
    dom.barDash.style.width = `${dashReadyPct}%`;
    dom.hudDashText.textContent = state.dashTimer > 0 ? 'ACTIVE!' : dashReadyPct >= 100 ? 'READY' : `${dashReadyPct}%`;
    dom.btnDashMobile.classList.toggle('cooling', state.dashCooldown > 0);

    if (state.weaponLevel >= 2 && state.weaponTimer > 0) {
      dom.weaponTimerRow.style.display = 'flex';
      dom.hudWeaponTime.textContent = `${state.weaponTimer.toFixed(1)}s`;
      dom.barWeapon.style.width = `${Math.min(100, (state.weaponTimer / state.weaponMaxTime) * 100)}%`;
      dom.hudWeaponName.textContent = '三向高能散射砲';
      dom.hudWeaponName.classList.add('upgraded');
    } else {
      dom.weaponTimerRow.style.display = 'none';
      dom.hudWeaponName.textContent = '雙聯脈衝雷射';
      dom.hudWeaponName.classList.remove('upgraded');
    }
  }

  /* ==========================================================================
     7. 遊戲流程控制 (開始 / 暫停 / 結束 / 清理重置)
     ========================================================================== */

  function clearDynamicObjects() {
    const removeList = (arr) => {
      for (let i = 0; i < arr.length; i++) {
        scene.remove(arr[i].mesh);
      }
      arr.length = 0;
    };
    removeList(playerBullets);
    removeList(enemyBullets);
    removeList(enemies);
    removeList(powerups);
    removeList(particles);
    removeList(shockwaves);
  }

  function startGame() {
    sound.init();
    clearDynamicObjects();

    state.mode = 'playing';
    state.score = 0;
    state.wave = 1;
    state.waveTimer = 0;
    state.kills = 0;
    state.hp = state.maxHp;
    state.invulnTimer = 1.0;
    state.dashTimer = 0;
    state.dashCooldown = 0;
    state.weaponLevel = 1;
    state.weaponTimer = 0;
    state.fireCooldown = 0;
    state.shakeIntensity = 0;
    state.asteroidSpawnTimer = 0.6;
    state.enemySpawnTimer = 2.0;
    state.eliteSpawnTimer = 18.0;

    playerGroup.visible = true;
    playerGroup.position.set(0, -1.0, 0);
    playerGroup.rotation.set(0, 0, 0);
    input.pointerTargetX = 0;
    input.pointerTargetY = -1.0;

    dom.screenStart.classList.remove('visible');
    dom.screenPause.classList.remove('visible');
    dom.screenGameOver.classList.remove('visible');
    dom.hud.classList.add('active');

    updateHUD();
    showWaveBanner(1);
    sound.playWaveUp();
  }

  function togglePause() {
    if (state.mode === 'playing') {
      state.mode = 'paused';
      dom.screenPause.classList.add('visible');
    } else if (state.mode === 'paused') {
      state.mode = 'playing';
      dom.screenPause.classList.remove('visible');
      clock.getDelta(); // 避免暫停期間累積超大 dt
    }
  }

  function endGame() {
    state.mode = 'gameover';
    playerGroup.visible = false;
    createExplosion(playerGroup.position, 0x00f3ff, 2.2);
    createExplosion(playerGroup.position, 0xff5500, 1.8);
    sound.playExplosion(2.0);
    state.shakeIntensity = 1.8;

    const isNewRecord = saveBestScore();
    dom.endScore.textContent = state.score.toLocaleString();
    dom.endBest.textContent = state.bestScore.toLocaleString();
    dom.endWave.textContent = String(state.wave).padStart(2, '0');
    dom.endKills.textContent = String(state.kills);
    dom.newRecordTag.style.display = isNewRecord ? 'inline-block' : 'none';
    dom.startBestScore.textContent = state.bestScore.toLocaleString();

    dom.hud.classList.remove('active');
    setTimeout(() => {
      if (state.mode === 'gameover') {
        dom.screenGameOver.classList.add('visible');
      }
    }, 700);
  }

  /* ==========================================================================
     8. 視窗響應式縮放與座標轉換
     ========================================================================== */

  /** 依據視窗長寬比動態調整相機距離與戰機可移動範圍，確保手機直向與桌面寬螢幕都完美可視 */
  function updateResponsiveBounds() {
    if (!camera || !renderer) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const aspect = w / h;

    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);

    // 在 Z=0 平面上計算安全可視邊界
    const preset = CAMERA_PRESETS[state.cameraPresetIdx];
    const extraDist = aspect < 0.85 ? (0.85 - aspect) * 26 : 0;
    const camZ = preset.pos.z + extraDist;
    const vFovRad = THREE.MathUtils.degToRad(preset.fov);
    const visibleHeight = 2 * Math.tan(vFovRad / 2) * camZ;
    const visibleWidth = visibleHeight * aspect;

    state.boundsX = Math.max(7.2, Math.min(18.5, visibleWidth * 0.42));
    state.boundsY = Math.max(6.2, Math.min(11.5, visibleHeight * 0.36));
  }

  /** 將螢幕滑鼠/觸控座標映射為遊戲內 Z=0 平面目標座標 */
  function updatePointerTarget(clientX, clientY, isTouch = false) {
    const normX = (clientX / window.innerWidth) * 2 - 1;
    const normY = -((clientY / window.innerHeight) * 2 - 1);

    // 觸控時略微上移目標點，避免手指遮住戰機
    const touchLiftY = isTouch ? 1.8 : 0;
    input.pointerTargetX = THREE.MathUtils.clamp(normX * state.boundsX * 1.15, -state.boundsX, state.boundsX);
    input.pointerTargetY = THREE.MathUtils.clamp(normY * state.boundsY * 1.15 + touchLiftY, -state.boundsY, state.boundsY);
  }

  /* ==========================================================================
     9. 事件監聽綁定 (鍵盤 / 滑鼠 / 觸控 / UI 按鈕)
     ========================================================================== */
  function bindEvents() {
    window.addEventListener('resize', updateResponsiveBounds);

    // 鍵盤事件
    window.addEventListener('keydown', (e) => {
      sound.init();
      const code = e.code;
      input.keys[code] = true;

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(code)) {
        if (state.mode === 'playing') e.preventDefault();
      }

      if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(code)) {
        input.controlMode = 'keyboard';
      }

      if ((code === 'ShiftLeft' || code === 'ShiftRight') && state.mode === 'playing') {
        triggerDash();
      }
      if ((code === 'KeyP' || code === 'Escape') && (state.mode === 'playing' || state.mode === 'paused')) {
        togglePause();
      }
      if (code === 'KeyF' && state.mode === 'playing') {
        toggleAutoFire();
      }
      if (code === 'KeyM') {
        toggleMuteUI();
      }
      if (code === 'KeyC') {
        cycleCameraPreset();
      }
    });

    window.addEventListener('keyup', (e) => {
      input.keys[e.code] = false;
    });

    // 畫布滑鼠事件 (左鍵射擊 + 移動跟隨 + 右鍵拖曳微調鏡頭角度)
    const canvas = renderer.domElement;
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    canvas.addEventListener('mousedown', (e) => {
      sound.init();
      if (e.button === 2) {
        input.rightDragging = true;
        input.dragStartX = e.clientX;
        input.dragStartY = e.clientY;
      } else if (e.button === 0 && state.mode === 'playing') {
        input.controlMode = 'pointer';
        input.pointerShooting = true;
        updatePointerTarget(e.clientX, e.clientY, false);
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (e.button === 2) input.rightDragging = false;
      if (e.button === 0) input.pointerShooting = false;
    });

    window.addEventListener('mousemove', (e) => {
      // 右鍵拖曳調整 3D 鏡頭角度
      if (input.rightDragging) {
        const dx = e.clientX - input.dragStartX;
        const dy = e.clientY - input.dragStartY;
        input.dragStartX = e.clientX;
        input.dragStartY = e.clientY;
        state.cameraOrbitX = THREE.MathUtils.clamp(state.cameraOrbitX + dx * 0.025, -8, 8);
        state.cameraOrbitY = THREE.MathUtils.clamp(state.cameraOrbitY + dy * 0.02, -4, 6);
        return;
      }

      if (state.mode !== 'playing') return;

      // 超過些微移動門檻即無縫切換至滑鼠跟隨控制
      const distMoved = Math.hypot(e.clientX - input.lastMouseX, e.clientY - input.lastMouseY);
      input.lastMouseX = e.clientX;
      input.lastMouseY = e.clientY;

      if (distMoved > 3 || input.controlMode === 'pointer') {
        input.controlMode = 'pointer';
        updatePointerTarget(e.clientX, e.clientY, false);
      }
    });

    // 觸控事件 (手機與平板順暢拖曳控制與自動連發)
    canvas.addEventListener(
      'touchstart',
      (e) => {
        sound.init();
        if (state.mode !== 'playing' || e.touches.length === 0) return;
        e.preventDefault();
        input.controlMode = 'pointer';
        input.pointerActive = true;
        input.pointerShooting = true;
        const t = e.touches[0];
        updatePointerTarget(t.clientX, t.clientY, true);
      },
      { passive: false }
    );

    canvas.addEventListener(
      'touchmove',
      (e) => {
        if (state.mode !== 'playing' || e.touches.length === 0) return;
        e.preventDefault();
        input.controlMode = 'pointer';
        const t = e.touches[0];
        updatePointerTarget(t.clientX, t.clientY, true);
      },
      { passive: false }
    );

    canvas.addEventListener('touchend', () => {
      input.pointerActive = false;
      input.pointerShooting = false;
    });

    // UI 按鈕綁定
    dom.btnStart.addEventListener('click', startGame);
    dom.btnResume.addEventListener('click', togglePause);
    dom.btnRestartPause.addEventListener('click', startGame);
    dom.btnRetry.addEventListener('click', startGame);
    dom.btnPause.addEventListener('click', togglePause);
    dom.btnAutofire.addEventListener('click', toggleAutoFire);
    dom.btnMute.addEventListener('click', toggleMuteUI);
    dom.btnCamera.addEventListener('click', cycleCameraPreset);
    dom.btnDashMobile.addEventListener('click', () => {
      sound.init();
      triggerDash();
    });
  }

  function toggleAutoFire() {
    state.autoFire = !state.autoFire;
    dom.btnAutofire.classList.toggle('on', state.autoFire);
    dom.btnAutofire.textContent = state.autoFire ? '⚡ 自動(射擊)' : '⚡ 手動射擊';
  }

  function toggleMuteUI() {
    sound.init();
    const muted = sound.toggleMute();
    dom.btnMute.classList.toggle('muted', muted);
    dom.btnMute.textContent = muted ? '🔇 靜音' : '🔊 音效';
  }

  function cycleCameraPreset() {
    state.cameraPresetIdx = (state.cameraPresetIdx + 1) % CAMERA_PRESETS.length;
    state.cameraOrbitX = 0;
    state.cameraOrbitY = 0;
    updateResponsiveBounds();
    showToast(`🎥 視角切換：${CAMERA_PRESETS[state.cameraPresetIdx].name}`, '#00f3ff');
  }

  /* ==========================================================================
     10. 主更新迴圈 (60fps 物理、AI、碰撞與動態鏡頭)
     ========================================================================== */
  function updateGame(dt, elapsed) {
    // 1. 螢幕閃光與震動衰減
    if (state.fxFlashTimer > 0) {
      state.fxFlashTimer -= dt;
      if (state.fxFlashTimer <= 0) {
        dom.fxOverlay.className = '';
      }
    }
    state.shakeIntensity = Math.max(0, state.shakeIntensity - dt * 3.2);

    // 2. 星空粒子與高速曲速流線動畫 (選單與遊戲中皆持續流動)
    const warpFactor = state.dashTimer > 0 ? 3.2 : state.mode === 'playing' ? 1.0 + state.wave * 0.08 : 0.65;

    const posArr = starPoints.geometry.attributes.position.array;
    for (let i = 0; i < posArr.length; i += 3) {
      posArr[i + 2] += 42 * warpFactor * dt;
      if (posArr[i + 2] > 38) {
        posArr[i] = (Math.random() - 0.5) * 240;
        posArr[i + 1] = (Math.random() - 0.5) * 160;
        posArr[i + 2] = -225;
      }
    }
    starPoints.geometry.attributes.position.needsUpdate = true;

    warpStreaks.children.forEach((streak) => {
      streak.position.z += streak.userData.speed * warpFactor * dt;
      streak.scale.z = state.dashTimer > 0 ? 3.4 : 1.0 + (warpFactor - 1) * 0.6;
      if (streak.position.z > 30) {
        resetWarpStreak(streak, false);
      }
    });

    // 下方星際航道網格無限捲動
    gridHelper.position.z += 28 * warpFactor * dt;
    if (gridHelper.position.z > -45) {
      gridHelper.position.z -= 20;
    }

    // 尾焰脈動動畫
    const flamePulse = (state.dashTimer > 0 ? 2.1 : 1.0) + Math.sin(elapsed * 42) * 0.18;
    leftFlame.scale.set(1, 1, flamePulse);
    rightFlame.scale.set(1, 1, flamePulse);
    engineLight.intensity = state.dashTimer > 0 ? 4.2 : 1.8 + Math.sin(elapsed * 30) * 0.3;

    // 選單待機展示動畫
    if (state.mode === 'menu') {
      playerGroup.visible = true;
      playerGroup.position.x = Math.sin(elapsed * 0.8) * 2.5;
      playerGroup.position.y = -1.2 + Math.cos(elapsed * 1.2) * 0.65;
      playerGroup.rotation.z = -Math.cos(elapsed * 0.8) * 0.25;
      playerGroup.rotation.x = Math.sin(elapsed * 1.2) * 0.08;

      const menuCamX = Math.sin(elapsed * 0.25) * 4.5 + state.cameraOrbitX;
      camera.position.lerp(new THREE.Vector3(menuCamX, 3.6 + state.cameraOrbitY, 18.5), dt * 2.5);
      camera.lookAt(0, -0.5, -10);
      return;
    }

    // 爆炸粒子與衝擊波在結束畫面也繼續播完
    updateParticles(dt);

    if (state.mode !== 'playing') {
      updateCamera(dt);
      return;
    }

    // 3. 波次時間推進
    state.waveTimer += dt;
    const waveDuration = 22 + state.wave * 3;
    if (state.waveTimer >= waveDuration) {
      state.waveTimer = 0;
      state.wave += 1;
      state.score += state.wave * 200;
      showWaveBanner(state.wave);
      sound.playWaveUp();
    }

    // 4. 玩家計時器 (無敵、閃避、武器升級)
    if (state.invulnTimer > 0) state.invulnTimer = Math.max(0, state.invulnTimer - dt);
    if (state.dashTimer > 0) state.dashTimer = Math.max(0, state.dashTimer - dt);
    if (state.dashCooldown > 0) state.dashCooldown = Math.max(0, state.dashCooldown - dt);

    if (state.weaponTimer > 0) {
      state.weaponTimer = Math.max(0, state.weaponTimer - dt);
      if (state.weaponTimer <= 0) {
        state.weaponLevel = 1;
        showToast('武器能源耗盡，回復標準脈衝雷射', '#8fb3d1');
      }
    }

    // 護盾視覺顯示 (閃避無敵或受擊短暫閃爍)
    if (state.dashTimer > 0) {
      playerShieldMesh.material.opacity = 0.42;
      playerShieldMesh.material.color.setHex(0x00f3ff);
      playerShieldMesh.rotation.y += dt * 4;
    } else if (state.invulnTimer > 0) {
      playerShieldMesh.material.opacity = 0.22 + Math.sin(elapsed * 45) * 0.14;
      playerShieldMesh.material.color.setHex(0x00ff9d);
      playerShieldMesh.rotation.y += dt * 2;
    } else {
      playerShieldMesh.material.opacity = 0;
    }

    // 5. 玩家戰機移動與翻滾 (Bank/Roll) + 俯仰 (Pitch) 動態姿態
    const prevX = playerGroup.position.x;
    const prevY = playerGroup.position.y;
    const moveSpeed = state.dashTimer > 0 ? 44 : 25;

    if (input.controlMode === 'keyboard') {
      let mx = 0;
      let my = 0;
      if (input.keys['KeyA'] || input.keys['ArrowLeft']) mx -= 1;
      if (input.keys['KeyD'] || input.keys['ArrowRight']) mx += 1;
      if (input.keys['KeyW'] || input.keys['ArrowUp']) my += 1;
      if (input.keys['KeyS'] || input.keys['ArrowDown']) my -= 1;

      if (mx !== 0 && my !== 0) {
        mx *= 0.7071;
        my *= 0.7071;
      }

      playerGroup.position.x = THREE.MathUtils.clamp(
        playerGroup.position.x + mx * moveSpeed * dt,
        -state.boundsX,
        state.boundsX
      );
      playerGroup.position.y = THREE.MathUtils.clamp(
        playerGroup.position.y + my * moveSpeed * dt,
        -state.boundsY,
        state.boundsY
      );
    } else {
      // 滑鼠跟隨 / 觸控拖曳平滑插值
      const followLerp = Math.min(1, dt * (state.dashTimer > 0 ? 18 : 11.5));
      playerGroup.position.x = THREE.MathUtils.lerp(playerGroup.position.x, input.pointerTargetX, followLerp);
      playerGroup.position.y = THREE.MathUtils.lerp(playerGroup.position.y, input.pointerTargetY, followLerp);
    }

    const velX = (playerGroup.position.x - prevX) / Math.max(dt, 0.001);
    const velY = (playerGroup.position.y - prevY) / Math.max(dt, 0.001);

    // 閃避中執行帥氣 360 度桶滾翻轉，平時依據速度流暢傾斜
    if (state.dashTimer > 0) {
      const progress = 1 - state.dashTimer / state.dashDuration;
      const rollDir = velX < -1 ? 1 : -1;
      playerGroup.rotation.z = rollDir * progress * Math.PI * 2;
      playerGroup.rotation.x = THREE.MathUtils.lerp(playerGroup.rotation.x, 0.14, dt * 10);
    } else {
      const targetRoll = THREE.MathUtils.clamp(-velX * 0.028, -0.68, 0.68);
      const targetPitch = THREE.MathUtils.clamp(velY * 0.018, -0.38, 0.38);
      playerGroup.rotation.z = THREE.MathUtils.lerp(playerGroup.rotation.z, targetRoll, dt * 10);
      playerGroup.rotation.x = THREE.MathUtils.lerp(playerGroup.rotation.x, targetPitch, dt * 10);
    }

    // 6. 玩家射擊判定
    state.fireCooldown = Math.max(0, state.fireCooldown - dt);
    const wantsToShoot = state.autoFire || input.keys['Space'] || input.pointerShooting;
    if (wantsToShoot && state.fireCooldown <= 0) {
      firePlayerWeapon();
    }

    // 7. 敵人與隕石生成排程 (隨波次動態提升密度與強度)
    state.asteroidSpawnTimer -= dt;
    if (state.asteroidSpawnTimer <= 0) {
      spawnAsteroid();
      state.asteroidSpawnTimer = Math.max(0.32, 1.05 - state.wave * 0.08) * (0.75 + Math.random() * 0.5);
    }

    state.enemySpawnTimer -= dt;
    if (state.enemySpawnTimer <= 0) {
      spawnEnemyDrone();
      state.enemySpawnTimer = Math.max(0.95, 2.8 - state.wave * 0.22) * (0.8 + Math.random() * 0.45);
    }

    state.eliteSpawnTimer -= dt;
    if (state.eliteSpawnTimer <= 0 && state.wave >= 2) {
      spawnEliteShip();
      state.eliteSpawnTimer = Math.max(12, 24 - state.wave * 1.4);
    }

    // 8. 更新玩家子彈與碰撞檢測
    for (let i = playerBullets.length - 1; i >= 0; i--) {
      const b = playerBullets[i];
      b.mesh.position.x += b.vx * dt;
      b.mesh.position.y += b.vy * dt;
      b.mesh.position.z += b.vz * dt;
      b.life -= dt;

      let hit = false;
      for (let j = enemies.length - 1; j >= 0; j--) {
        const e = enemies[j];
        const dist = b.mesh.position.distanceTo(e.mesh.position);
        if (dist < e.radius + 0.75) {
          hit = true;
          e.hp -= b.damage;
          e.hitFlash = 0.1;
          createHitSparks(b.mesh.position, 0x00f3ff);

          if (e.hp <= 0) {
            destroyEnemy(j);
          } else {
            sound.playHit();
            if (e.type === 'elite' && e.hpBarFill) {
              const ratio = Math.max(0.01, e.hp / e.maxHp);
              e.hpBarFill.scale.x = ratio;
            }
          }
          break;
        }
      }

      if (hit || b.life <= 0 || b.mesh.position.z < -180) {
        scene.remove(b.mesh);
        playerBullets.splice(i, 1);
      }
    }

    // 9. 更新敵人 / 隕石 AI 與撞擊判定
    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];

      if (e.type === 'asteroid') {
        e.mesh.position.x += e.vx * dt;
        e.mesh.position.y += e.vy * dt;
        e.mesh.position.z += e.vz * dt;
        e.mesh.rotation.x += e.rotSpeed.x * dt;
        e.mesh.rotation.y += e.rotSpeed.y * dt;
        e.mesh.rotation.z += e.rotSpeed.z * dt;
      } else if (e.type === 'drone') {
        e.phase += dt * 2.4;
        e.mesh.position.z += e.vz * dt;
        e.mesh.position.x = THREE.MathUtils.clamp(
          e.baseX + Math.sin(e.phase) * e.swayAmp,
          -state.boundsX,
          state.boundsX
        );
        e.mesh.rotation.z = -Math.cos(e.phase) * 0.45;

        e.fireTimer -= dt;
        if (e.fireTimer <= 0 && e.mesh.position.z > -105 && e.mesh.position.z < -12) {
          fireEnemyPlasma(e.mesh.position, 44 + state.wave * 2);
          sound.playEnemyShot();
          e.fireTimer = Math.max(1.1, 2.3 - state.wave * 0.12);
        }
      } else if (e.type === 'elite') {
        e.phase += dt * 1.6;
        // 巡洋艦推進至懸停區域後左右壓制射擊
        if (e.mesh.position.z < e.hoverZ) {
          e.mesh.position.z += e.vz * dt;
        } else {
          e.mesh.position.z += 2.6 * dt; // 緩慢逼近施壓
          e.mesh.position.x = Math.sin(e.phase) * (state.boundsX * 0.65);
          e.mesh.position.y = Math.cos(e.phase * 1.3) * (state.boundsY * 0.45);
        }
        if (e.ringMesh) e.ringMesh.rotation.z += dt * 3.5;

        e.fireTimer -= dt;
        if (e.fireTimer <= 0 && e.mesh.position.z > -95 && e.mesh.position.z < -8) {
          // 三發扇形電漿齊射
          fireEnemyPlasma(e.mesh.position, 42 + state.wave * 1.8, -0.14);
          fireEnemyPlasma(e.mesh.position, 45 + state.wave * 1.8, 0);
          fireEnemyPlasma(e.mesh.position, 42 + state.wave * 1.8, 0.14);
          sound.playEnemyShot();
          e.fireTimer = Math.max(1.3, 2.4 - state.wave * 0.1);
        }
      }

      // 受擊縮放回饋
      if (e.hitFlash > 0) {
        e.hitFlash -= dt;
        const s = 1 + e.hitFlash * 0.9;
        e.mesh.scale.set(s, s, s);
      } else {
        e.mesh.scale.set(1, 1, 1);
      }

      // 與玩家機體碰撞檢測
      const distToPlayer = e.mesh.position.distanceTo(playerGroup.position);
      if (distToPlayer < e.radius + 1.25) {
        if (state.dashTimer > 0) {
          // 無敵閃避期間直接撞碎小型敵機與隕石
          if (e.type !== 'elite') {
            destroyEnemy(i);
            continue;
          }
        } else {
          const dmg = e.type === 'elite' ? 35 : e.type === 'drone' ? 22 : 20;
          damagePlayer(dmg);
          if (e.type !== 'elite') {
            destroyEnemy(i, false);
            continue;
          }
        }
      }

      // 超出後方鏡頭範圍即回收
      if (e.mesh.position.z > 26) {
        scene.remove(e.mesh);
        enemies.splice(i, 1);
      }
    }

    // 10. 更新敵方電漿彈
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
      const eb = enemyBullets[i];
      eb.mesh.position.x += eb.vx * dt;
      eb.mesh.position.y += eb.vy * dt;
      eb.mesh.position.z += eb.vz * dt;
      eb.life -= dt;

      if (eb.mesh.position.distanceTo(playerGroup.position) < eb.radius + 1.15) {
        damagePlayer(15);
        scene.remove(eb.mesh);
        enemyBullets.splice(i, 1);
        continue;
      }

      if (eb.life <= 0 || eb.mesh.position.z > 26) {
        scene.remove(eb.mesh);
        enemyBullets.splice(i, 1);
      }
    }

    // 11. 更新能量晶體道具與拾取判定
    for (let i = powerups.length - 1; i >= 0; i--) {
      const p = powerups[i];
      p.mesh.position.z += p.vz * dt;
      p.crystal.rotation.y += dt * 3.2;
      p.crystal.rotation.x += dt * 1.6;
      p.ring.rotation.x += dt * 2.5;
      p.ring.rotation.y -= dt * 2.0;

      // 接近玩家時產生微弱磁吸效果，手感更佳
      const dist = p.mesh.position.distanceTo(playerGroup.position);
      if (dist < 6.5) {
        p.mesh.position.lerp(playerGroup.position, dt * 6);
      }

      if (dist < p.radius + 1.55) {
        if (p.type === 'shield') {
          state.hp = Math.min(state.maxHp, state.hp + 30);
          state.score += 100;
          sound.playPowerup(false);
          triggerScreenFlash('heal', 0.25);
          showToast('🛡 護盾修復 +30%', '#00ff9d');
        } else {
          state.weaponLevel = 2;
          state.weaponTimer = state.weaponMaxTime;
          state.score += 150;
          sound.playPowerup(true);
          triggerScreenFlash('powerup', 0.28);
          showToast('🔥 獲得三向高能散射武器！', '#ffbe0b');
        }
        scene.remove(p.mesh);
        powerups.splice(i, 1);
        continue;
      }

      if (p.mesh.position.z > 24) {
        scene.remove(p.mesh);
        powerups.splice(i, 1);
      }
    }

    // 12. 動態相機追蹤與 HUD 刷新
    updateCamera(dt);
    updateHUD();
  }

  /** 擊毀敵目標並計算分數與掉落 */
  function destroyEnemy(index, awardScore = true) {
    const e = enemies[index];
    const pos = e.mesh.position.clone();
    const fxColor = e.type === 'elite' ? 0xe879f9 : e.type === 'drone' ? 0xff2a5f : 0xff9f1c;
    const fxScale = e.type === 'elite' ? 2.1 : e.type === 'drone' ? 1.2 : 1.0;

    createExplosion(pos, fxColor, fxScale);
    sound.playExplosion(fxScale);

    if (awardScore) {
      state.score += e.scoreVal;
      state.kills += 1;
      if (e.type === 'elite') {
        state.shakeIntensity = Math.min(1.2, state.shakeIntensity + 0.6);
        showToast(`💥 菁英巡洋艦擊破！+${e.scoreVal}`, '#ffbe0b');
        spawnPowerup(pos); // 菁英機必定掉落道具
      } else if (Math.random() < (e.type === 'drone' ? 0.24 : 0.12)) {
        spawnPowerup(pos);
      }
    }

    scene.remove(e.mesh);
    enemies.splice(index, 1);
  }

  /** 更新爆炸碎片與能量衝擊環 */
  function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.mesh.position.x += p.vx * dt;
      p.mesh.position.y += p.vy * dt;
      p.mesh.position.z += p.vz * dt;
      p.mesh.rotation.x += dt * 6;
      p.mesh.rotation.y += dt * 5;
      p.life -= dt;
      p.mesh.material.opacity = Math.max(0, p.life / p.maxLife);
      const s = Math.max(0.01, p.life / p.maxLife);
      p.mesh.scale.set(s, s, s);

      if (p.life <= 0) {
        scene.remove(p.mesh);
        particles.splice(i, 1);
      }
    }

    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const sw = shockwaves[i];
      sw.life -= dt;
      const grow = 1 + (1 - sw.life / sw.maxLife) * sw.scaleSpeed;
      sw.mesh.scale.set(grow, grow, 1);
      sw.mesh.material.opacity = Math.max(0, (sw.life / sw.maxLife) * 0.85);
      if (sw.life <= 0) {
        scene.remove(sw.mesh);
        shockwaves.splice(i, 1);
      }
    }
  }

  /** 更新動態 3D 相機 (視角預設 + 戰機跟隨視差 + 閃避 FOV 擴張 + 受擊震動) */
  function updateCamera(dt) {
    const preset = CAMERA_PRESETS[state.cameraPresetIdx];
    const aspect = window.innerWidth / window.innerHeight;
    const extraDist = aspect < 0.85 ? (0.85 - aspect) * 26 : 0;

    // 閃避推進時動態擴大視野 FOV，強化超光速速度感
    const targetFov = preset.fov + (state.dashTimer > 0 ? 11 : 0);
    camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, dt * 7);
    camera.updateProjectionMatrix();

    const targetPos = new THREE.Vector3(
      preset.pos.x + playerGroup.position.x * 0.34 + state.cameraOrbitX,
      preset.pos.y + playerGroup.position.y * 0.28 + state.cameraOrbitY,
      preset.pos.z + extraDist
    );

    camera.position.lerp(targetPos, dt * 6);

    // 受擊微幅畫面震動 (Camera Shake)
    if (state.shakeIntensity > 0) {
      camera.position.x += (Math.random() - 0.5) * state.shakeIntensity;
      camera.position.y += (Math.random() - 0.5) * state.shakeIntensity;
    }

    const lookTarget = new THREE.Vector3(
      preset.look.x + playerGroup.position.x * 0.25,
      preset.look.y + playerGroup.position.y * 0.2,
      preset.look.z
    );
    camera.lookAt(lookTarget);
  }

  /** 動畫主循環 */
  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05); // 限制最大步長防止切頁跳幀
    const elapsed = clock.elapsedTime;
    updateGame(dt, elapsed);
    renderer.render(scene, camera);
  }

  /* ==========================================================================
     11. 程式啟動入口 (等待 window.onload 確保所有資源載入完成)
     ========================================================================== */
  window.onload = function () {
    try {
      if (typeof THREE === 'undefined') {
        throw new Error('Three.js 函式庫載入失敗，請確認網路連線後重新整理頁面。');
      }
      clock = new THREE.Clock();
      loadBestScore();
      initThreeScene();
      bindEvents();
      animate();
    } catch (err) {
      console.error('遊戲啟動失敗:', err);
      dom.errorBoxMsg.textContent = err.message || '瀏覽器可能不支援 WebGL 渲染。';
      dom.errorBox.style.display = 'block';
    }
  };
})();
