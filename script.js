// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });
}

// ===== HEADER SCROLL =====
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ===== HAMBURGER MENU =====
const burger = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');
if (burger && navLinks) {
  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    burger.classList.toggle('active');
    burger.setAttribute('aria-expanded', isOpen);
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}

// ===== INTERSECTION OBSERVER (fade-in) =====
const fadeEls = document.querySelectorAll('.fade-in');
if (fadeEls.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  fadeEls.forEach(el => observer.observe(el));
}

// ===== VIDEO CLICK-TO-EMBED =====
document.querySelectorAll('.video-thumb').forEach(card => {
  card.addEventListener('click', function handler(e) {
    const href = this.getAttribute('href');
    const ytMatch = href.match(/youtube\.com\/watch\?v=([^&]+)/);
    if (!ytMatch) return; // non-YouTube: default behavior (open in new tab)
    e.preventDefault();
    const wrap = this.querySelector('.video-wrap');
    wrap.innerHTML = `<iframe src="https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0" frameborder="0" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`;
    this.removeEventListener('click', handler);
    this.style.cursor = 'default';
  });
});

// ===== GALLERY =====
const galleryTrack = document.getElementById('galleryTrack');
if (galleryTrack) {
  const photos = Array.from({length: 33}, (_, i) => `photo/photo_${i + 1}_2026-03-14_14-37-30.jpg`);
  [...photos, ...photos].forEach(src => {
    const div = document.createElement('div');
    div.className = 'gallery-photo';
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Дуэт Отображение — фотография';
    img.loading = 'lazy';
    div.appendChild(img);
    galleryTrack.appendChild(div);
  });
}

// ===== STAGGER DELAY =====
document.querySelectorAll('.formats-grid .format-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.1}s`;
});
document.querySelectorAll('.news-grid .news-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.1}s`;
});
