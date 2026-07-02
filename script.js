/* ==========================================
   MEZZA HOUSE — INTERACTIONS & ANIMATIONS
   ========================================== */

'use strict';

/* ---- THEME TOGGLE ---- */
const html        = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = themeToggle ? themeToggle.querySelector('.theme-icon') : null;

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('mh-theme', theme);
  if (themeIcon) {
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

// Load saved preference, default to dark
const savedTheme = localStorage.getItem('mh-theme') || 'dark';
applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}


/* ---- NAV: Scroll glassmorphism effect ---- */
const navbar = document.getElementById('navbar');

function handleNavScroll() {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

/* ---- NAV: Mobile hamburger ---- */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  // Animate hamburger to X
  const spans = hamburger.querySelectorAll('span');
  hamburger.classList.toggle('active');
  if (hamburger.classList.contains('active')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Close nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ---- SCROLL REVEAL ---- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---- MENU TABS ---- */
const tabBtns   = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    const panel = document.getElementById('panel-' + target);
    if (panel) panel.classList.add('active');
  });
});

/* ---- REVIEWS AUTO-SCROLL: duplicate cards for seamless loop ---- */
function initReviewsCarousel() {
  const track = document.getElementById('reviewsTrack');
  if (!track) return;

  // Duplicate cards for infinite loop
  const originals = Array.from(track.children);
  originals.forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });
}

initReviewsCarousel();

/* ---- SMOOTH SCROLL for anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'));
      const top  = target.getBoundingClientRect().top + window.pageYOffset - navH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---- DISH CARD: subtle tilt effect on hover ---- */
document.querySelectorAll('.dish-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const centerX = rect.left + rect.width  / 2;
    const centerY = rect.top  + rect.height / 2;
    const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -4;
    const rotateY = ((e.clientX - centerX) / (rect.width  / 2)) *  4;
    card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'all 0.3s cubic-bezier(0.4,0,0.2,1)';
  });
});

/* ---- HERO: Parallax scroll effect ---- */
const heroImg = document.querySelector('.hero-img');

function handleParallax() {
  if (!heroImg) return;
  const scrolled = window.pageYOffset;
  if (scrolled < window.innerHeight) {
    heroImg.style.transform = `translateY(${scrolled * 0.08}px)`;
  }
}

window.addEventListener('scroll', handleParallax, { passive: true });
