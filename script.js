/* === 1. PAGE LOADER ==== */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  // Minimum display time for cinematic feel
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = 'auto';
    // Kick off hero animations after load
    initHeroAnimations();
  }, 2200);
});

// Prevent scroll during load
document.body.style.overflow = 'hidden';

/* === 2. CUSTOM CURSOR === */
(function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let animId = null;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Smooth lagging ring
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    animId = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect on interactive elements
  const hoverTargets = 'a, button, .project-card, .skill-category, .tech-bubble, .filter-btn, input, textarea';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) document.body.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) document.body.classList.remove('cursor-hover');
  });

  // Hide on mobile
  document.addEventListener('touchstart', () => {
    dot.style.display  = 'none';
    ring.style.display = 'none';
    cancelAnimationFrame(animId);
  }, { once: true });
})();

/* === 3. PARTICLE CANVAS === */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouse = { x: null, y: null };
  const PARTICLE_COUNT = window.innerWidth < 768 ? 40 : 80;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x    = Math.random() * W;
      this.y    = Math.random() * H;
      this.size = Math.random() * 1.5 + 0.5;
      this.vx   = (Math.random() - 0.5) * 0.3;
      this.vy   = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.5 + 0.1;
      // Alternate cyan and violet
      this.color = Math.random() > 0.5 ? '0,212,255' : '124,58,237';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Mouse repulsion
      if (mouse.x) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          this.x += dx / dist * 1.2;
          this.y += dy / dist * 1.2;
        }
      }

      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
      ctx.fill();
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(loop);
  }

  resize();
  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
  loop();

  window.addEventListener('resize', () => {
    resize();
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
  });

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
})();

/* ==== 4. TYPING ANIMATION ==== */
(function initTyped() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const phrases = [
    'Software Engineer',
    'Full-Stack Developer',
    'UI/UX Enthusiast',
    'Cloud Architect',
    'Open Source Contributor',
    'Problem Solver',
  ];

  let phraseIdx = 0, charIdx = 0, isDeleting = false;

  function type() {
    const currentPhrase = phrases[phraseIdx];
    if (isDeleting) {
      el.textContent = currentPhrase.substring(0, charIdx - 1);
      charIdx--;
    } else {
      el.textContent = currentPhrase.substring(0, charIdx + 1);
      charIdx++;
    }

    let delay = isDeleting ? 60 : 90;

    if (!isDeleting && charIdx === currentPhrase.length) {
      delay = 1800; // pause at end
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx  = (phraseIdx + 1) % phrases.length;
      delay = 300;
    }

    setTimeout(type, delay);
  }

  // Start after loader
  setTimeout(type, 2400);
})();