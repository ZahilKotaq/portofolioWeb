/* ==========================================================
   particles.js — Canvas Particle System
   Tanggung jawab: mengelola semua animasi di background canvas.
   Tidak ada ketergantungan ke modul lain.
   ========================================================== */

const ParticleSystem = (() => {

  // --- State ---
  let canvas, ctx;
  let particles = [];
  let orbs = [];
  let animFrameId = null;


  // ---- Config (ubah di sini kalau mau tuning visual) ----
  const CONFIG = {
    particleCount : 160,
    orbCount      : 6,
    colors        : { cyan: '#4de8d4', gold: '#c8a96e' },
    goldRatio     : 0.3,     // 30% partikel berwarna gold
  };


  // ---- Particle Class ----
  class Particle {
    constructor() { this.reset(); }

    reset() {
      this.x           = Math.random() * canvas.width;
      this.y           = Math.random() * canvas.height;
      this.size        = Math.random() * 1.5 + 0.3;
      this.speedX      = (Math.random() - 0.5) * 0.4;
      this.speedY      = (Math.random() - 0.5) * 0.4 - 0.1;
      this.opacity     = Math.random() * 0.5 + 0.1;
      this.fadeDir     = Math.random() > 0.5 ? 1 : -1;
      this.twinkleSpd  = Math.random() * 0.005 + 0.002;
      this.color       = Math.random() > (1 - CONFIG.goldRatio)
                           ? CONFIG.colors.gold
                           : CONFIG.colors.cyan;
    }

    update() {
      this.x       += this.speedX;
      this.y       += this.speedY;
      this.opacity += this.fadeDir * this.twinkleSpd;

      if (this.opacity > 0.6 || this.opacity < 0.05) this.fadeDir *= -1;
      if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) this.reset();
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle   = this.color;
      ctx.shadowBlur  = 6;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }


  // ---- Glow Orb Class ----
  class GlowOrb {
    constructor(isInitial = false) { this.reset(isInitial); }

    reset(isInitial = false) {
      this.x      = Math.random() * canvas.width;
      this.y      = isInitial ? Math.random() * canvas.height : canvas.height + 100;
      this.radius = Math.random() * 80 + 40;
      this.speedY = -(Math.random() * 0.15 + 0.05);
      this.opacity = Math.random() * 0.04 + 0.01;
      this.isCyan  = Math.random() > 0.5;
    }

    update() {
      this.y += this.speedY;
      if (this.y < -(this.radius * 2)) this.reset();
    }

    draw() {
      const color = this.isCyan ? '77,232,212' : '13,70,100';
      const grad  = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.radius
      );
      grad.addColorStop(0, `rgba(${color},${this.opacity})`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.save();
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }


  // ---- Internal helpers ----
  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    orbs.forEach(o => { o.update(); o.draw(); });
    particles.forEach(p => { p.update(); p.draw(); });
    animFrameId = requestAnimationFrame(tick);
  }


  // ---- Public API ----
  function init() {
    canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    ctx = canvas.getContext('2d');
    resizeCanvas();

    particles = Array.from({ length: CONFIG.particleCount }, () => new Particle());
    orbs      = Array.from({ length: CONFIG.orbCount      }, () => new GlowOrb(true));

    window.addEventListener('resize', resizeCanvas);
    tick();
  }

  function destroy() {
    if (animFrameId) cancelAnimationFrame(animFrameId);
    window.removeEventListener('resize', resizeCanvas);
  }

  return { init, destroy };

})();