/* ============================================================
   main.js — Morando Malau Portfolio
   ============================================================ */

/* ── NAV SCROLL ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ── HAMBURGER ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.mobile-menu a').forEach(a => {
  a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── SCROLL REVEAL ── */
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      // slight stagger for siblings
      const siblings = [...e.target.parentElement.children].filter(c => c.classList.contains('reveal'));
      const idx = siblings.indexOf(e.target);
      setTimeout(() => e.target.classList.add('visible'), idx * 90);
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

reveals.forEach(el => revealObs.observe(el));

/* ── SKILL BARS ── */
const bars = document.querySelectorAll('.sb-fill');
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.w + '%';
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });

bars.forEach(b => { b.style.width = '0%'; barObs.observe(b); });

/* ── COUNTER ANIMATION ── */
function animateCount(el, target, duration = 1200) {
  const start = performance.now();
  const step = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3); // ease-out-cubic
    el.textContent = Math.round(ease * target);
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const statObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      animateCount(el, parseInt(el.dataset.to));
      statObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-n').forEach(el => statObs.observe(el));

/* ── CONTACT FORM ── */
const form = document.getElementById('cform');
const feedback = document.getElementById('cfeedback');
const sendBtn = document.getElementById('csend');

form.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('cname').value.trim();
  const email = document.getElementById('cemail').value.trim();
  const msg = document.getElementById('cmsg').value.trim();

  feedback.style.color = '#F08070';
  if (!name) { feedback.textContent = '⚠ Nama wajib diisi.'; return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { feedback.textContent = '⚠ Format email tidak valid.'; return; }
  if (!msg) { feedback.textContent = '⚠ Pesan tidak boleh kosong.'; return; }

  sendBtn.textContent = 'Mengirim...';
  sendBtn.disabled = true;

  setTimeout(() => {
    form.reset();
    sendBtn.textContent = 'Kirim Pesan →';
    sendBtn.disabled = false;
    feedback.style.color = '#4CD494';
    feedback.textContent = '✓ Pesan terkirim! Terima kasih, Morando akan segera membalas.';
    setTimeout(() => { feedback.textContent = ''; }, 5000);
  }, 1500);
});

/* ── ACTIVE NAV HIGHLIGHT ── */
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const activeObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === '#' + e.target.id) a.style.color = 'var(--coral)';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => activeObs.observe(s));
