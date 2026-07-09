(() => {
  'use strict';

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const ui = {
    menu: document.getElementById('menuScreen'),
    how: document.getElementById('howScreen'),
    pause: document.getElementById('pauseScreen'),
    gameOver: document.getElementById('gameOverScreen'),
    score: document.getElementById('scoreText'),
    combo: document.getElementById('comboText'),
    fuel: document.getElementById('fuelText'),
    wave: document.getElementById('waveText'),
    mission: document.getElementById('missionText'),
    countdown: document.getElementById('countdownText'),
    finalScore: document.getElementById('finalScoreText'),
    resultDetails: document.getElementById('resultDetails'),
    leaderboard: document.getElementById('leaderboardList'),
    unlockList: document.getElementById('unlockList'),
    toast: document.getElementById('toast'),
    startBtn: document.getElementById('startBtn'),
    howBtn: document.getElementById('howBtn'),
    backBtn: document.getElementById('backBtn'),
    resumeBtn: document.getElementById('resumeBtn'),
    restartPauseBtn: document.getElementById('restartPauseBtn'),
    menuPauseBtn: document.getElementById('menuPauseBtn'),
    restartBtn: document.getElementById('restartBtn'),
    shareBtn: document.getElementById('shareBtn'),
    menuBtn: document.getElementById('menuBtn')
  };

  const CONFIG = {
    collectionUrl: 'https://app.ebisusbay.com/collection/cronos/milky-way-marvels/',
    competitionDays: 4,
    pointsRule: 'Every 1 $CRO purchase = 1 point',
    prizes: [
      { place: '1st', ravers: 10000, planets: 3 },
      { place: '2nd', ravers: 5000, planets: 2 },
      { place: '3rd', ravers: 2500, planets: 1 }
    ],
    storagePrefix: 'mwm_orbit_rush_v1',
    // Change this to a fixed ISO date if you need an official public event launch time.
    launchDate: null
  };

  const OBJECTS = [
    { name: 'Mercury', type: 'planet', r: 16, points: 100, colors: ['#d9c4a2', '#8d7559'] },
    { name: 'Venus', type: 'planet', r: 20, points: 120, colors: ['#ffd68a', '#b97736'] },
    { name: 'Earth', type: 'planet', r: 22, points: 150, colors: ['#38bdf8', '#22c55e'] },
    { name: 'Mars', type: 'planet', r: 19, points: 130, colors: ['#ff875c', '#913a2e'] },
    { name: 'Jupiter', type: 'planet', r: 31, points: 190, colors: ['#f8d7a2', '#c47b4e'] },
    { name: 'Saturn', type: 'planet', r: 29, points: 180, colors: ['#f1d28b', '#aa843b'], ring: true },
    { name: 'Uranus', type: 'planet', r: 24, points: 160, colors: ['#9cf6ff', '#54bcd2'] },
    { name: 'Neptune', type: 'planet', r: 24, points: 170, colors: ['#5685ff', '#152a9a'] },
    { name: 'Moon Relic', type: 'relic', r: 15, points: 90, colors: ['#f4f4f5', '#9ca3af'] },
    { name: 'Comet Core', type: 'relic', r: 14, points: 110, colors: ['#a7f3d0', '#2dd4bf'] }
  ];

  const state = {
    mode: 'menu',
    w: 1,
    h: 1,
    dpr: 1,
    time: 0,
    last: performance.now(),
    score: 0,
    combo: 1,
    bestCombo: 1,
    fuel: 100,
    wave: 1,
    lives: 3,
    discovered: new Set(),
    entities: [],
    particles: [],
    stars: [],
    keys: Object.create(null),
    pointer: { active: false, x: 0, y: 0, lastTap: 0 },
    player: { x: 0, y: 0, vx: 0, vy: 0, r: 17, invuln: 0, boostPulse: 0 },
    spawnTimer: 0,
    stormTimer: 0,
    runStart: 0,
    planetsCollected: 0,
    crystalsCollected: 0,
    damageTaken: 0
  };

  function resize() {
    state.dpr = Math.min(window.devicePixelRatio || 1, 2);
    state.w = Math.floor(window.innerWidth);
    state.h = Math.floor(window.innerHeight);
    canvas.width = Math.floor(state.w * state.dpr);
    canvas.height = Math.floor(state.h * state.dpr);
    canvas.style.width = state.w + 'px';
    canvas.style.height = state.h + 'px';
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    buildStars();
    if (!state.player.x) {
      state.player.x = state.w * 0.5;
      state.player.y = state.h * 0.68;
    }
  }

  function buildStars() {
    const count = Math.round(Math.min(260, Math.max(120, state.w * state.h / 7000)));
    state.stars = Array.from({ length: count }, () => ({
      x: Math.random() * state.w,
      y: Math.random() * state.h,
      z: 0.25 + Math.random() * 1.4,
      tw: Math.random() * Math.PI * 2
    }));
  }

  function showScreen(name) {
    [ui.menu, ui.how, ui.pause, ui.gameOver].forEach(s => s.classList.remove('active'));
    if (name === 'menu') ui.menu.classList.add('active');
    if (name === 'how') ui.how.classList.add('active');
    if (name === 'pause') ui.pause.classList.add('active');
    if (name === 'gameOver') ui.gameOver.classList.add('active');
  }

  function toast(message) {
    ui.toast.textContent = message;
    ui.toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => ui.toast.classList.remove('show'), 1800);
  }

  function getLaunchDate() {
    const saved = localStorage.getItem(CONFIG.storagePrefix + '_launch');
    if (CONFIG.launchDate) return new Date(CONFIG.launchDate);
    if (saved) return new Date(saved);
    const now = new Date();
    localStorage.setItem(CONFIG.storagePrefix + '_launch', now.toISOString());
    return now;
  }

  function updateCountdown() {
    const launch = getLaunchDate();
    const end = new Date(launch.getTime() + CONFIG.competitionDays * 24 * 60 * 60 * 1000);
    const diff = Math.max(0, end.getTime() - Date.now());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    ui.countdown.textContent = diff > 0
      ? `Time left: ${d}d ${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`
      : 'Competition timer ended. Set a new launch date in game.js for the next event.';
  }

  function startGame() {
    state.mode = 'playing';
    showScreen(null);
    state.time = 0;
    state.score = 0;
    state.combo = 1;
    state.bestCombo = 1;
    state.fuel = 100;
    state.wave = 1;
    state.lives = 3;
    state.entities = [];
    state.particles = [];
    state.discovered = new Set();
    state.spawnTimer = 0.4;
    state.stormTimer = 0;
    state.runStart = performance.now();
    state.planetsCollected = 0;
    state.crystalsCollected = 0;
    state.damageTaken = 0;
    state.player.x = state.w * 0.5;
    state.player.y = state.h * 0.68;
    state.player.vx = 0;
    state.player.vy = 0;
    state.player.invuln = 1.4;
    updateHud();
    ui.mission.textContent = 'Collect planets, dodge asteroids, survive the solar storm.';
  }

  function pauseGame() {
    if (state.mode !== 'playing') return;
    state.mode = 'paused';
    showScreen('pause');
  }

  function resumeGame() {
    if (state.mode !== 'paused') return;
    state.mode = 'playing';
    state.last = performance.now();
    showScreen(null);
  }

  function gameOver() {
    state.mode = 'gameOver';
    saveScore();
    renderGameOver();
    showScreen('gameOver');
  }

  function updateHud() {
    ui.score.textContent = Math.floor(state.score).toLocaleString('en-US');
    ui.combo.textContent = 'x' + state.combo;
    ui.fuel.textContent = Math.max(0, Math.round(state.fuel)) + '%';
    ui.wave.textContent = state.wave;
  }

  function rand(min, max) { return min + Math.random() * (max - min); }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }

  function spawnEntity() {
    const waveFactor = 1 + state.wave * 0.08;
    const roll = Math.random();
    const side = Math.floor(Math.random() * 4);
    let x, y, vx, vy;
    if (side === 0) { x = rand(30, state.w - 30); y = -50; }
    else if (side === 1) { x = state.w + 50; y = rand(70, state.h - 70); }
    else if (side === 2) { x = rand(30, state.w - 30); y = state.h + 50; }
    else { x = -50; y = rand(70, state.h - 70); }
    const angle = Math.atan2(state.player.y - y, state.player.x - x) + rand(-0.5, 0.5);
    const speed = rand(40, 95) * waveFactor;
    vx = Math.cos(angle) * speed;
    vy = Math.sin(angle) * speed;

    let entity;
    if (roll < 0.48) {
      const obj = OBJECTS[Math.floor(Math.random() * OBJECTS.length)];
      entity = { kind: 'collectible', obj, x, y, vx, vy, r: obj.r, rot: rand(0, Math.PI * 2), spin: rand(-2, 2), life: 20 };
    } else if (roll < 0.66) {
      entity = { kind: 'crystal', x, y, vx, vy, r: 12, rot: rand(0, Math.PI * 2), spin: rand(-4, 4), life: 18 };
    } else if (roll < 0.76) {
      entity = { kind: 'fuel', x, y, vx, vy, r: 13, rot: rand(0, Math.PI * 2), spin: rand(-3, 3), life: 18 };
    } else if (roll < 0.94) {
      entity = { kind: 'asteroid', x, y, vx: vx * 1.08, vy: vy * 1.08, r: rand(16, 30), rot: rand(0, Math.PI * 2), spin: rand(-2.5, 2.5), life: 22 };
    } else {
      entity = { kind: 'blackhole', x, y, vx: vx * 0.45, vy: vy * 0.45, r: rand(24, 38), rot: rand(0, Math.PI * 2), spin: rand(-1.5, 1.5), life: 24 };
    }
    state.entities.push(entity);
  }

  function burst(x, y, color, amount = 12, power = 90) {
    for (let i = 0; i < amount; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = rand(power * 0.2, power);
      state.particles.push({
        x, y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        r: rand(1.5, 4.2),
        color,
        life: rand(0.35, 0.9),
        maxLife: 1
      });
    }
  }

  function addScore(points) {
    state.score += points * state.combo;
    state.bestCombo = Math.max(state.bestCombo, state.combo);
  }

  function takeDamage(amount) {
    if (state.player.invuln > 0) return;
    state.damageTaken += amount;
    state.fuel -= amount;
    state.combo = 1;
    state.player.invuln = 1.0;
    state.player.vx *= -0.65;
    state.player.vy *= -0.65;
    burst(state.player.x, state.player.y, '#ff5f87', 22, 160);
    ui.mission.textContent = 'Hull impact! Combo reset. Recover fast.';
    if (state.fuel <= 0) gameOver();
  }

  function update(dt) {
    if (state.mode !== 'playing') return;
    state.time += dt;
    state.wave = 1 + Math.floor(state.time / 22);
    state.stormTimer += dt;
    state.spawnTimer -= dt;
    state.fuel -= dt * (1.25 + state.wave * 0.16);
    state.player.invuln = Math.max(0, state.player.invuln - dt);
    state.player.boostPulse = Math.max(0, state.player.boostPulse - dt);

    const p = state.player;
    let ax = 0, ay = 0;
    if (state.keys.ArrowLeft || state.keys.KeyA) ax -= 1;
    if (state.keys.ArrowRight || state.keys.KeyD) ax += 1;
    if (state.keys.ArrowUp || state.keys.KeyW) ay -= 1;
    if (state.keys.ArrowDown || state.keys.KeyS) ay += 1;

    if (state.pointer.active) {
      const dx = state.pointer.x - p.x;
      const dy = state.pointer.y - p.y;
      const mag = Math.hypot(dx, dy) || 1;
      ax += clamp(dx / mag, -1, 1) * clamp(mag / 160, 0, 1);
      ay += clamp(dy / mag, -1, 1) * clamp(mag / 160, 0, 1);
    }

    let boosting = state.keys.Space || state.player.boostPulse > 0;
    if (boosting && state.fuel > 4) {
      state.fuel -= dt * 8;
    } else {
      boosting = false;
    }

    const mag = Math.hypot(ax, ay) || 1;
    ax /= mag; ay /= mag;
    const accel = boosting ? 680 : 390;
    p.vx += ax * accel * dt;
    p.vy += ay * accel * dt;
    const friction = Math.pow(0.04, dt);
    p.vx *= friction;
    p.vy *= friction;
    const maxSpeed = boosting ? 520 : 330;
    const speed = Math.hypot(p.vx, p.vy);
    if (speed > maxSpeed) {
      p.vx = p.vx / speed * maxSpeed;
      p.vy = p.vy / speed * maxSpeed;
    }
    p.x = clamp(p.x + p.vx * dt, p.r + 6, state.w - p.r - 6);
    p.y = clamp(p.y + p.vy * dt, p.r + 6, state.h - p.r - 6);

    const spawnEvery = clamp(0.85 - state.wave * 0.055, 0.28, 0.85);
    if (state.spawnTimer <= 0) {
      spawnEntity();
      if (state.wave > 4 && Math.random() < 0.16) spawnEntity();
      state.spawnTimer = spawnEvery;
    }

    if (state.stormTimer > 16) {
      state.stormTimer = 0;
      ui.mission.textContent = 'Solar storm surge. More objects incoming.';
      for (let i = 0; i < 4 + Math.min(5, state.wave); i++) spawnEntity();
    }

    for (const e of state.entities) {
      e.life -= dt;
      e.rot += e.spin * dt;
      if (e.kind === 'blackhole') {
        const dx = e.x - p.x;
        const dy = e.y - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 480 * 480) {
          const pull = 44000 / Math.max(900, d2);
          p.vx += dx * pull * dt;
          p.vy += dy * pull * dt;
        }
      }
      e.x += e.vx * dt;
      e.y += e.vy * dt;

      if (dist(p, e) < p.r + e.r) {
        e.dead = true;
        if (e.kind === 'collectible') {
          state.planetsCollected += 1;
          state.discovered.add(e.obj.name);
          addScore(e.obj.points);
          state.combo = Math.min(9, state.combo + 1);
          state.fuel = Math.min(100, state.fuel + 3);
          burst(e.x, e.y, e.obj.colors[0], 18, 130);
          ui.mission.textContent = `${e.obj.name} discovered. Combo increased.`;
        } else if (e.kind === 'crystal') {
          state.crystalsCollected += 1;
          addScore(25);
          state.fuel = Math.min(100, state.fuel + 5);
          burst(e.x, e.y, '#a78bfa', 12, 115);
          ui.mission.textContent = '$RAVERSE crystal collected. Fuel restored.';
        } else if (e.kind === 'fuel') {
          state.fuel = Math.min(100, state.fuel + 24);
          addScore(10);
          burst(e.x, e.y, '#59ffa8', 14, 120);
          ui.mission.textContent = 'Fuel cell recovered.';
        } else if (e.kind === 'asteroid') {
          takeDamage(18);
        } else if (e.kind === 'blackhole') {
          takeDamage(34);
        }
      }
    }

    state.entities = state.entities.filter(e => !e.dead && e.life > 0 && e.x > -120 && e.x < state.w + 120 && e.y > -120 && e.y < state.h + 120);

    for (const part of state.particles) {
      part.life -= dt;
      part.x += part.vx * dt;
      part.y += part.vy * dt;
      part.vx *= Math.pow(0.08, dt);
      part.vy *= Math.pow(0.08, dt);
    }
    state.particles = state.particles.filter(p => p.life > 0);

    if (state.fuel <= 0) gameOver();
    updateHud();
  }

  function drawBackground() {
    const g = ctx.createRadialGradient(state.w * 0.5, state.h * 0.42, 20, state.w * 0.5, state.h * 0.45, Math.max(state.w, state.h));
    g.addColorStop(0, '#15195a');
    g.addColorStop(0.38, '#080b25');
    g.addColorStop(1, '#02030a');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, state.w, state.h);

    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.translate(state.w * 0.5, state.h * 0.5);
    ctx.rotate(state.time * 0.012);
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.strokeStyle = i % 2 ? '#46e7ff' : '#9f7cff';
      ctx.lineWidth = 1;
      ctx.ellipse(0, 0, 130 + i * 70, 42 + i * 24, i * 0.24, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    for (const s of state.stars) {
      const pulse = 0.4 + 0.6 * Math.sin(state.time * s.z + s.tw) ** 2;
      ctx.globalAlpha = clamp(0.2 + pulse * s.z, 0.15, 0.95);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect((s.x + state.time * s.z * 7) % state.w, s.y, s.z * 1.35, s.z * 1.35);
    }
    ctx.globalAlpha = 1;
  }

  function drawPlayer() {
    const p = state.player;
    const angle = Math.atan2(p.vy, p.vx || -1) + Math.PI / 2;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(angle);
    if (p.invuln > 0 && Math.floor(state.time * 14) % 2 === 0) ctx.globalAlpha = 0.45;

    const glow = ctx.createRadialGradient(0, 0, 1, 0, 0, 58);
    glow.addColorStop(0, 'rgba(70, 231, 255, 0.34)');
    glow.addColorStop(1, 'rgba(70, 231, 255, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, 58, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -23);
    ctx.lineTo(17, 19);
    ctx.lineTo(0, 11);
    ctx.lineTo(-17, 19);
    ctx.closePath();
    const body = ctx.createLinearGradient(0, -22, 0, 22);
    body.addColorStop(0, '#f4f7ff');
    body.addColorStop(0.55, '#8edcff');
    body.addColorStop(1, '#6d5dfc');
    ctx.fillStyle = body;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.75)';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    ctx.fillStyle = '#05040d';
    ctx.beginPath();
    ctx.ellipse(0, -5, 6, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    if (state.keys.Space || p.boostPulse > 0) {
      ctx.globalAlpha = 0.85;
      const flame = ctx.createLinearGradient(0, 12, 0, 52);
      flame.addColorStop(0, '#46e7ff');
      flame.addColorStop(1, 'rgba(159,124,255,0)');
      ctx.fillStyle = flame;
      ctx.beginPath();
      ctx.moveTo(-8, 14);
      ctx.lineTo(0, 54 + Math.sin(state.time * 35) * 8);
      ctx.lineTo(8, 14);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  function drawPlanet(e) {
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(e.rot);
    if (e.obj.ring) {
      ctx.save();
      ctx.rotate(-0.28);
      ctx.strokeStyle = 'rgba(255, 238, 180, 0.82)';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(0, 0, e.r * 1.72, e.r * 0.48, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    const g = ctx.createRadialGradient(-e.r * 0.3, -e.r * 0.35, e.r * 0.1, 0, 0, e.r);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(0.18, e.obj.colors[0]);
    g.addColorStop(1, e.obj.colors[1]);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, e.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.globalAlpha = 0.34;
    ctx.strokeStyle = '#ffffff';
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.ellipse(0, i * e.r * 0.22, e.r * 0.9, e.r * 0.13, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawCrystal(e) {
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(e.rot);
    ctx.fillStyle = '#a78bfa';
    ctx.strokeStyle = '#ecfeff';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(0, -e.r);
    ctx.lineTo(e.r * 0.8, 0);
    ctx.lineTo(0, e.r);
    ctx.lineTo(-e.r * 0.8, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-2, -e.r * 0.65, 4, e.r * 1.3);
    ctx.restore();
  }

  function drawFuel(e) {
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(e.rot);
    ctx.fillStyle = 'rgba(89,255,168,0.18)';
    ctx.beginPath();
    ctx.arc(0, 0, e.r + 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#59ffa8';
    ctx.fillRect(-9, -12, 18, 24);
    ctx.fillStyle = '#05040d';
    ctx.fillRect(-5, -7, 10, 14);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-3, -4, 6, 8);
    ctx.restore();
  }

  function drawAsteroid(e) {
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(e.rot);
    ctx.fillStyle = '#7a6a62';
    ctx.strokeStyle = '#c7a58f';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    const points = 10;
    for (let i = 0; i < points; i++) {
      const a = (i / points) * Math.PI * 2;
      const rr = e.r * randStatic(e, i, 0.62, 1.08);
      const x = Math.cos(a) * rr;
      const y = Math.sin(a) * rr;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#191919';
    ctx.beginPath(); ctx.arc(e.r * 0.2, -e.r * 0.2, e.r * 0.18, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-e.r * 0.25, e.r * 0.22, e.r * 0.12, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function randStatic(e, i, min, max) {
    const v = Math.sin((e.x * 12.9898 + e.y * 78.233 + i * 37.719) * 43758.5453);
    return min + (Math.abs(v) % 1) * (max - min);
  }

  function drawBlackhole(e) {
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(e.rot);
    const g = ctx.createRadialGradient(0, 0, 1, 0, 0, e.r * 2.8);
    g.addColorStop(0, '#000000');
    g.addColorStop(0.42, '#090012');
    g.addColorStop(0.68, 'rgba(159,124,255,0.65)');
    g.addColorStop(1, 'rgba(70,231,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, e.r * 2.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#46e7ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, e.r * 1.4, e.r * 0.52, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(0, 0, e.r * 0.86, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawEntities() {
    for (const e of state.entities) {
      if (e.kind === 'collectible') drawPlanet(e);
      else if (e.kind === 'crystal') drawCrystal(e);
      else if (e.kind === 'fuel') drawFuel(e);
      else if (e.kind === 'asteroid') drawAsteroid(e);
      else if (e.kind === 'blackhole') drawBlackhole(e);
    }
  }

  function drawParticles() {
    for (const p of state.particles) {
      ctx.globalAlpha = clamp(p.life / p.maxLife, 0, 1);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawFuelWarning() {
    if (state.fuel > 24 || state.mode !== 'playing') return;
    ctx.save();
    ctx.globalAlpha = 0.25 + 0.16 * Math.sin(state.time * 12);
    ctx.strokeStyle = '#ff5f87';
    ctx.lineWidth = 12;
    ctx.strokeRect(6, 6, state.w - 12, state.h - 12);
    ctx.restore();
  }

  function render() {
    drawBackground();
    drawEntities();
    drawParticles();
    drawPlayer();
    drawFuelWarning();
  }

  function loop(now) {
    const dt = Math.min(0.033, (now - state.last) / 1000 || 0.016);
    state.last = now;
    update(dt);
    render();
    requestAnimationFrame(loop);
  }

  function saveScore() {
    const key = CONFIG.storagePrefix + '_leaderboard';
    const item = {
      score: Math.floor(state.score),
      date: new Date().toISOString(),
      planets: state.planetsCollected,
      crystals: state.crystalsCollected,
      combo: state.bestCombo
    };
    const board = JSON.parse(localStorage.getItem(key) || '[]');
    board.push(item);
    board.sort((a, b) => b.score - a.score);
    localStorage.setItem(key, JSON.stringify(board.slice(0, 10)));
  }

  function getLeaderboard() {
    return JSON.parse(localStorage.getItem(CONFIG.storagePrefix + '_leaderboard') || '[]');
  }

  function renderGameOver() {
    const duration = Math.round((performance.now() - state.runStart) / 1000);
    ui.finalScore.textContent = Math.floor(state.score).toLocaleString('en-US');
    ui.resultDetails.innerHTML = `
      <div>Survived: <strong>${duration}s</strong></div>
      <div>Planets/objects collected: <strong>${state.planetsCollected}</strong></div>
      <div>$RAVERSE crystals: <strong>${state.crystalsCollected}</strong></div>
      <div>Best combo: <strong>x${state.bestCombo}</strong></div>
      <div>Competition rule: <strong>${CONFIG.pointsRule}</strong></div>
    `;
    const board = getLeaderboard();
    ui.leaderboard.innerHTML = board.length
      ? board.map((b, i) => `<li><strong>${b.score.toLocaleString('en-US')}</strong> — ${b.planets} objects, x${b.combo} combo</li>`).join('')
      : '<li>No runs yet.</li>';
    const discovered = [...state.discovered];
    ui.unlockList.innerHTML = discovered.length
      ? discovered.map(name => `<span class="unlock-chip">${name}</span>`).join('')
      : '<span class="unlock-chip">No objects discovered this run</span>';
  }

  async function copyTweet() {
    const text = `Milky Way Marvels: Orbit Rush\nI scored ${Math.floor(state.score).toLocaleString('en-US')} in the @EbisusBay arcade challenge.\n1 $CRO purchase = 1 point. Top 3 win $RAVERSE + Planets.\n${CONFIG.collectionUrl}`;
    try {
      await navigator.clipboard.writeText(text);
      toast('Tweet copied');
    } catch (err) {
      toast('Copy failed. Select text manually from console.');
      console.log(text);
    }
  }

  function bindEvents() {
    window.addEventListener('resize', resize);
    window.addEventListener('keydown', e => {
      state.keys[e.code] = true;
      if (e.code === 'KeyP') {
        if (state.mode === 'playing') pauseGame();
        else if (state.mode === 'paused') resumeGame();
      }
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
    }, { passive: false });
    window.addEventListener('keyup', e => { state.keys[e.code] = false; });

    canvas.addEventListener('pointerdown', e => {
      state.pointer.active = true;
      state.pointer.x = e.clientX;
      state.pointer.y = e.clientY;
      const now = performance.now();
      if (now - state.pointer.lastTap < 280) state.player.boostPulse = 0.6;
      state.pointer.lastTap = now;
    });
    canvas.addEventListener('pointermove', e => {
      if (!state.pointer.active) return;
      state.pointer.x = e.clientX;
      state.pointer.y = e.clientY;
    });
    window.addEventListener('pointerup', () => { state.pointer.active = false; });
    window.addEventListener('pointercancel', () => { state.pointer.active = false; });

    ui.startBtn.addEventListener('click', startGame);
    ui.howBtn.addEventListener('click', () => showScreen('how'));
    ui.backBtn.addEventListener('click', () => showScreen('menu'));
    ui.resumeBtn.addEventListener('click', resumeGame);
    ui.restartPauseBtn.addEventListener('click', startGame);
    ui.menuPauseBtn.addEventListener('click', () => { state.mode = 'menu'; showScreen('menu'); });
    ui.restartBtn.addEventListener('click', startGame);
    ui.menuBtn.addEventListener('click', () => { state.mode = 'menu'; showScreen('menu'); });
    ui.shareBtn.addEventListener('click', copyTweet);
  }

  function init() {
    resize();
    bindEvents();
    showScreen('menu');
    setInterval(updateCountdown, 1000);
    updateCountdown();
    requestAnimationFrame(loop);
  }

  init();
})();
