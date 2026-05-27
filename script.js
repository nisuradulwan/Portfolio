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

/* ===  PARTICLE CANVAS === */
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

/* ====  TYPING ANIMATION ==== */
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

/* == NAVBAR== */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  
  const onScroll = () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else                      navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.classList.toggle('menu-open');
  });

  
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.classList.remove('menu-open');
    });
  });
})();

/* == ACTIVE NAV ON SCROLL == */
(function initActiveNav() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link[data-section]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
})();

/* ==  SCROLL PROGRESS BAR == */
(function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* == BACK TO TOP == */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) btn.classList.add('visible');
    else                       btn.classList.remove('visible');
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* == DARK / LIGHT TOGGLE == */
(function initTheme() {
  const btn  = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const body = document.body;

  // Persist preference
  const saved = localStorage.getItem('portfolio-theme') || 'dark';
  body.setAttribute('data-theme', saved);
  icon.className = saved === 'dark' ? 'fas fa-moon' : 'fas fa-sun';

  btn.addEventListener('click', () => {
    const curr = body.getAttribute('data-theme');
    const next = curr === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', next);
    icon.className = next === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    localStorage.setItem('portfolio-theme', next);
  });
})();

/* ==  AOS INIT == */
AOS.init({
  duration: 700,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  once: true,
  offset: 60,
});

/* ==  SKILL BARS == */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        fill.style.width = fill.dataset.width + '%';
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(f => observer.observe(f));
})();

/* ==  STATS COUNTER == */
(function initCounters() {
  const nums = document.querySelectorAll('.stat-num[data-target]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '+';
      let start    = 0;
      const dur    = 1600;
      const step   = 16;
      const inc    = target / (dur / step);

      const timer = setInterval(() => {
        start += inc;
        if (start >= target) {
          el.textContent = target + suffix;
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(start) + suffix;
        }
      }, step);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  nums.forEach(n => observer.observe(n));
})();

/* ==  PROJECT FILTER == */
(function initProjectFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();
/* == SMOOTH SCROLL == */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* == HERO ANIMATIONS == */
function initHeroAnimations() {
  // Stagger-in hero elements
  const items = [
    '.hero-badge',
    '.hero-name',
    '.hero-role',
    '.hero-desc',
    '.hero-actions',
    '.hero-socials',
    '.hero-visual',
  ];

  items.forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.style.opacity   = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.7s ease ${i * 0.1 + 0.1}s, transform 0.7s ease ${i * 0.1 + 0.1}s`;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity   = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  });
}

/* == ANIMATED GRADIENT BORDER == */
// Add animated gradient border to featured project card
(function initGradientBorder() {
  const featuredCards = document.querySelectorAll('.project-card.featured');
  featuredCards.forEach(card => {
    card.style.background = `
      linear-gradient(var(--bg-2), var(--bg-2)) padding-box,
      linear-gradient(135deg, #00d4ff, #7c3aed, #ec4899) border-box
    `;
    card.style.border = '1px solid transparent';
  });
})();

/* == SECTION REVEAL GLOW == */
// Add subtle glow under section headers on scroll
(function initSectionGlow() {
  const headers = document.querySelectorAll('.section-header');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transition = 'filter 0.8s ease';
        entry.target.style.filter = 'drop-shadow(0 0 30px rgba(0,212,255,0.08))';
      }
    });
  }, { threshold: 0.5 });

  headers.forEach(h => observer.observe(h));
})();

/* == NEWSLETTER TOAST == */
(function initNewsletter() {
  const btn = document.querySelector('.newsletter-form button');
  const inp = document.querySelector('.newsletter-form input');
  if (!btn || !inp) return;

  btn.addEventListener('click', () => {
    const email = inp.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      inp.style.borderColor = '#ef4444';
      setTimeout(() => inp.style.borderColor = '', 2000);
      return;
    }
    inp.value = '';
    showToast('Subscribed! 🎉 Thanks for staying in the loop.');
  });
})();

function showToast(msg) {
  const toast = document.createElement('div');
  toast.textContent = msg;
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '2rem',
    left: '50%',
    transform: 'translateX(-50%) translateY(20px)',
    background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
    color: '#fff',
    padding: '0.8rem 1.5rem',
    borderRadius: '12px',
    fontSize: '0.88rem',
    fontWeight: '600',
    zIndex: '99999',
    opacity: '0',
    transition: 'all 0.4s ease',
    whiteSpace: 'nowrap',
    boxShadow: '0 8px 30px rgba(0,212,255,0.3)',
  });
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity   = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity   = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

/* ==  TECH BUBBLE ANIMATION == */
(function initTechBubbles() {
  const bubbles = document.querySelectorAll('.tech-bubble');
  bubbles.forEach((b, i) => {
    b.style.animationDelay = `${i * 0.08}s`;
  });
})();

/* == KEYBOARD ACCESSIBILITY == */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.getElementById('hamburger').classList.remove('open');
    document.getElementById('navLinks').classList.remove('open');
    document.body.classList.remove('menu-open');
  }
});

/* == PERFORMANCE: Passive Listeners == */
// All scroll and touch listeners use { passive: true } ✓
// (already applied above)

/* ==  Console Easter Egg == */
console.log(
  `%c
  ██████╗  ██████╗ ██████╗ ████████╗███████╗ ██████╗ ██╗     ██╗ ██████╗
  ██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝██╔═══██╗██║     ██║██╔═══██╗
  ██████╔╝██║   ██║██████╔╝   ██║   █████╗  ██║   ██║██║     ██║██║   ██║
  ██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══╝  ██║   ██║██║     ██║██║   ██║
  ██║     ╚██████╔╝██║  ██║   ██║   ██║     ╚██████╔╝███████╗██║╚██████╔╝
  ╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝      ╚═════╝ ╚══════╝╚═╝ ╚═════╝

  👋 Hey there, curious developer!
  Built with love, caffeine, and clean code.
  — Nisura Lokuliyana
  `,
  'color: #00d4ff; font-family: monospace; font-size: 10px;'
);

/* == SKILLS TABS == */
(function initSkillTabs() {
  const tabs   = document.querySelectorAll('.sk-tab');
  const panels = document.querySelectorAll('.sk-panel');

  const panelMap = {
    frontend: 'sk-frontend',
    backend:  'sk-backend',
    devops:   'sk-devops',
    tools:    'sk-tools',
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(panelMap[tab.dataset.target]);
      if (target) target.classList.add('active');
    });
  });
})();

