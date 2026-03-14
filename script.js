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

// ===== DARK THEME =====
(function() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
})();
document.getElementById('themeToggle')?.addEventListener('click', function() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// ===== HERO IMAGE FADE-IN =====
const heroImg = document.getElementById('heroImg');
if (heroImg) {
  const onLoad = () => heroImg.classList.add('loaded');
  if (heroImg.complete) onLoad();
  else heroImg.addEventListener('load', onLoad);
}

// ===== BOOKING FORM → WHATSAPP =====
document.getElementById('bookingForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const name    = document.getElementById('formName').value.trim();
  const phone   = document.getElementById('formPhone').value.trim();
  const date    = document.getElementById('formDate').value;
  const city    = document.getElementById('formCity').value.trim();
  const format  = document.getElementById('formFormat').value;
  const message = document.getElementById('formMessage').value.trim();

  if (!name || !phone) {
    document.getElementById(name ? 'formPhone' : 'formName').focus();
    return;
  }

  let text = `Заявка на выступление дуэта «Отображение»\n\n`;
  text += `Имя: ${name}\n`;
  text += `Телефон: ${phone}\n`;
  if (date)    text += `Дата: ${new Date(date).toLocaleDateString('ru-RU')}\n`;
  if (city)    text += `Город: ${city}\n`;
  if (format)  text += `Формат: ${format}\n`;
  if (message) text += `\n${message}`;

  window.open(`https://wa.me/79307001530?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
});

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
const PHOTOS = Array.from({length: 33}, (_, i) => `photo/photo_${i + 1}_2026-03-14_14-37-30.jpg`);

if (galleryTrack) {
  [...PHOTOS, ...PHOTOS].forEach((src, idx) => {
    const div = document.createElement('div');
    div.className = 'gallery-photo';
    div.dataset.index = idx % PHOTOS.length;
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Дуэт Отображение — фотография';
    img.loading = 'lazy';
    div.appendChild(img);
    galleryTrack.appendChild(div);
  });
}

// ===== PHOTO MODAL =====
const modal    = document.getElementById('photoModal');
const modalImg = document.getElementById('modalImg');
const modalCounter = document.getElementById('modalCounter');
let currentIdx = 0;

function openModal(idx) {
  currentIdx = idx;
  modalImg.src = PHOTOS[currentIdx];
  modalCounter.textContent = `${currentIdx + 1} / ${PHOTOS.length}`;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function showNext() {
  currentIdx = (currentIdx + 1) % PHOTOS.length;
  modalImg.style.opacity = '0';
  setTimeout(() => {
    modalImg.src = PHOTOS[currentIdx];
    modalCounter.textContent = `${currentIdx + 1} / ${PHOTOS.length}`;
    modalImg.style.opacity = '1';
  }, 150);
}

function showPrev() {
  currentIdx = (currentIdx - 1 + PHOTOS.length) % PHOTOS.length;
  modalImg.style.opacity = '0';
  setTimeout(() => {
    modalImg.src = PHOTOS[currentIdx];
    modalCounter.textContent = `${currentIdx + 1} / ${PHOTOS.length}`;
    modalImg.style.opacity = '1';
  }, 150);
}

if (modal) {
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', closeModal);
  document.getElementById('modalNext').addEventListener('click', showNext);
  document.getElementById('modalPrev').addEventListener('click', showPrev);

  document.addEventListener('keydown', e => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape')       closeModal();
    if (e.key === 'ArrowRight')   showNext();
    if (e.key === 'ArrowLeft')    showPrev();
  });

  document.addEventListener('click', e => {
    const photo = e.target.closest('.gallery-photo');
    if (photo) openModal(Number(photo.dataset.index));
  });
}

// ===== STAGGER DELAY =====
document.querySelectorAll('.formats-grid .format-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.1}s`;
});
document.querySelectorAll('.news-grid .news-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.1}s`;
});
