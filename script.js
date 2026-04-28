/* ================================================
   MT PORTFOLIO — script.js  v2.0
   ================================================ */

/* ── Navbar scroll ──────────────────────────── */
const nav = document.getElementById('mainNav');
const themeToggle = document.getElementById('themeToggle');

function applyTheme(theme) {
  const isLight = theme === 'light';
  document.body.classList.toggle('light-mode', isLight);
  themeToggle?.setAttribute('aria-pressed', String(isLight));
  localStorage.setItem('portfolio-theme', theme);
}

const savedTheme = localStorage.getItem('portfolio-theme');
applyTheme(savedTheme === 'light' ? 'light' : 'dark');

themeToggle?.addEventListener('click', () => {
  const nextTheme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
  applyTheme(nextTheme);
});

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Active nav on scroll ───────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}, { passive: true });

/* ── Close mobile nav on click ──────────────── */
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    const menu = document.getElementById('navMenu');
    if (menu.classList.contains('show')) {
      bootstrap.Collapse.getInstance(menu)?.hide();
    }
  });
});

/* ── Typing animation ───────────────────────── */
const typedEl  = document.getElementById('typed-text');
const phrases  = [
  'CS Student',
  'Frontend Developer',
];
let phraseIdx = 0, charIdx = 0, deleting = false, speed = 70;

function type() {
  const phrase = phrases[phraseIdx];
  if (deleting) {
    typedEl.textContent = phrase.slice(0, --charIdx);
    speed = 38;
  } else {
    typedEl.textContent = phrase.slice(0, ++charIdx);
    speed = 72;
  }
  if (!deleting && charIdx === phrase.length)  { deleting = true; speed = 2000; }
  if ( deleting && charIdx === 0)              { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; speed = 380; }
  setTimeout(type, speed);
}
window.addEventListener('load', () => setTimeout(type, 700));

/* ── Scroll Reveal ──────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

// Hero items reveal immediately with stagger
document.querySelectorAll('.hero-text-side .reveal, .hero-photo-side.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${i * 130}ms`;
  setTimeout(() => el.classList.add('visible'), 80 + i * 130);
});

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = [...entry.target.parentElement.children].filter(c => c.classList.contains('reveal'));
    const idx   = siblings.indexOf(entry.target);
    setTimeout(() => entry.target.classList.add('visible'), idx * 90);
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => {
  // skip hero items (already handled above)
  const inHero = el.closest('.hero-text-side, .hero-photo-side');
  if (!inHero) revealObs.observe(el);
});

/* ── Skill Bar Animation ────────────────────── */
const barObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const fill = entry.target;
    setTimeout(() => { fill.style.width = fill.dataset.width + '%'; }, 180);
    barObs.unobserve(fill);
  });
}, { threshold: 0.3 });

document.querySelectorAll('.bar-fill').forEach(b => barObs.observe(b));

/* ── Mouse glow on project cards ────────────── */
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const { left, top } = card.getBoundingClientRect();
    const x = e.clientX - left, y = e.clientY - top;
    const accentGlow = getComputedStyle(document.body).getPropertyValue('--accent-glow2').trim();
    card.style.background = `radial-gradient(380px at ${x}px ${y}px, ${accentGlow}, var(--card) 60%)`;
  });
  card.addEventListener('mouseleave', () => { card.style.background = ''; });
});

/* ── Contact Form ───────────────────────────── */
function handleFormSubmit(btn) {
  const inputs = document.querySelectorAll('.f-input');
  let ok = true;
  inputs.forEach(inp => {
    if (!inp.value.trim()) {
      ok = false;
      inp.style.borderColor = 'rgba(239,68,68,0.55)';
      inp.style.boxShadow   = '0 0 0 3px rgba(239,68,68,0.1)';
      setTimeout(() => { inp.style.borderColor = ''; inp.style.boxShadow = ''; }, 2400);
    }
  });
  if (!ok) return;

  btn.innerHTML = 'Sending… <i class="fa-solid fa-spinner fa-spin ms-2"></i>';
  btn.disabled  = true;
  btn.style.opacity = '0.75';

  setTimeout(() => {
    inputs.forEach(i => { i.value = ''; });
    btn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane ms-2"></i>';
    btn.disabled  = false;
    btn.style.opacity = '';
    showToast();
  }, 1500);
}

function showToast() {
  const t = document.getElementById('toast');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3600);
}
