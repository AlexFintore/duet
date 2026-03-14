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

// ===== VIDEO MODAL =====
const videoModal   = document.getElementById('videoModal');
const videoModalWrap = document.getElementById('videoModalWrap');

function openVideoModal(embedUrl) {
  videoModalWrap.innerHTML = `<iframe src="${embedUrl}" frameborder="0" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`;
  videoModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeVideoModal() {
  videoModal.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => { if (videoModalWrap) videoModalWrap.innerHTML = ''; }, 300);
}

document.getElementById('videoModalClose')?.addEventListener('click', closeVideoModal);
document.getElementById('videoModalOverlay')?.addEventListener('click', closeVideoModal);

document.querySelectorAll('.video-thumb').forEach(card => {
  card.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    const ytMatch = href.match(/youtube\.com\/watch\?v=([^&]+)/);
    if (!ytMatch) return;
    e.preventDefault();
    openVideoModal(`https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`);
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (videoModal?.classList.contains('active')) closeVideoModal();
  }
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

// ===== REPERTOIRE =====
const REPERTOIRE = [
  { title: 'Пожелайте бывшим счастья', genre: 'own', tag: 'Авторская' },
  { title: 'Танцы в ночи',             genre: 'own', tag: 'Авторская' },
  { title: 'Любовь приходит не одна',  genre: 'own', tag: 'Авторская' },
  { title: 'Бригантина любви',         genre: 'own', tag: 'Авторская' },
  { title: 'Незаконченный роман',      genre: 'own', tag: 'Авторская' },
  { title: 'Заходи ко мне во сне',     genre: 'own', tag: 'Авторская' },
  // Поп
  { title: 'Ты моя нежность',          genre: 'pop', tag: 'Поп' },
  { title: 'Опять метель',             genre: 'pop', tag: 'Поп' },
  { title: 'Два билета на самолёт',    genre: 'pop', tag: 'Поп' },
  { title: 'Белая ночь',               genre: 'pop', tag: 'Поп' },
  { title: 'Снег кружится',            genre: 'pop', tag: 'Поп' },
  { title: 'Лучшее только начинается', genre: 'pop', tag: 'Поп' },
  { title: 'Всё только начинается',    genre: 'pop', tag: 'Поп' },
  { title: 'Нам не жить друг без друга', genre: 'pop', tag: 'Поп' },
  // Рок
  { title: 'Группа крови',             genre: 'rock', tag: 'Рок' },
  { title: 'Звезда по имени Солнце',   genre: 'rock', tag: 'Рок' },
  { title: 'В последний раз',          genre: 'rock', tag: 'Рок' },
  { title: 'Мой рок-н-ролл',          genre: 'rock', tag: 'Рок' },
  { title: 'Нежность',                 genre: 'rock', tag: 'Рок' },
  { title: 'Осень',                    genre: 'rock', tag: 'Рок' },
  // Шансон
  { title: 'Первый тост',              genre: 'shanson', tag: 'Шансон' },
  { title: 'Я куплю тебе дом',         genre: 'shanson', tag: 'Шансон' },
  { title: 'Ты целуй меня',            genre: 'shanson', tag: 'Шансон' },
  { title: 'Гуляй душа',              genre: 'shanson', tag: 'Шансон' },
  { title: 'На теплоходе музыка играет', genre: 'shanson', tag: 'Шансон' },
  { title: 'Не для меня',              genre: 'shanson', tag: 'Шансон' },
];

const repGrid = document.getElementById('repertoireGrid');
if (repGrid) {
  function renderRepertoire(genre) {
    repGrid.innerHTML = '';
    REPERTOIRE.filter(s => genre === 'all' || s.genre === genre).forEach(song => {
      const div = document.createElement('div');
      div.className = 'rep-item fade-in';
      div.dataset.genre = song.genre;
      div.innerHTML = `<span class="rep-dot rep-dot--${song.genre}"></span><span class="rep-title">${song.title}</span><span class="rep-tag">${song.tag}</span>`;
      repGrid.appendChild(div);
    });
    // re-observe new fade-in elements
    document.querySelectorAll('#repertoireGrid .fade-in:not(.visible)').forEach(el => {
      el.classList.add('visible');
    });
  }
  renderRepertoire('all');

  document.getElementById('repertoireFilters')?.querySelectorAll('.rep-filter').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.rep-filter').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      renderRepertoire(this.dataset.genre);
    });
  });
}

// ===== AVAILABILITY =====
const BUSY_DATES = {
  '2026-03': [1,7,8,14,21,22],
  '2026-04': [4,5,11,12,18,19,25,26],
  '2026-05': [2,3,9,10,16,23,24,30,31],
};
const MONTH_NAMES = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];

const availEl = document.getElementById('availMonths');
if (availEl) {
  const now = new Date();
  for (let m = 0; m < 3; m++) {
    const d = new Date(now.getFullYear(), now.getMonth() + m, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const key = `${year}-${String(month + 1).padStart(2, '0')}`;
    const busySet = new Set(BUSY_DATES[key] || []);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = (new Date(year, month, 1).getDay() + 6) % 7; // Mon=0
    const today = now.getDate();

    const col = document.createElement('div');
    col.className = 'avail-month';
    col.innerHTML = `<div class="avail-month-name">${MONTH_NAMES[month]} ${year}</div><div class="avail-days" id="days-${key}"></div>`;
    availEl.appendChild(col);

    const grid = col.querySelector('.avail-days');
    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      empty.className = 'avail-day';
      grid.appendChild(empty);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const cell = document.createElement('div');
      const isPast = m === 0 && day < today;
      const isBusy = busySet.has(day);
      cell.className = 'avail-day' + (isPast ? ' avail-day--past' : isBusy ? ' avail-day--busy' : ' avail-day--free');
      cell.textContent = day;
      grid.appendChild(cell);
    }
  }
}

// ===== QUIZ STEPPER =====
(function() {
  let quizEventType = '';
  let currentStep = 1;

  const steps = [
    document.getElementById('quizStep1'),
    document.getElementById('quizStep2'),
    document.getElementById('quizStep3'),
  ];
  const progressBar = document.getElementById('quizProgressBar');

  if (!steps[0]) return;

  function goToStep(n) {
    steps.forEach((s, i) => s && s.classList.toggle('active', i === n - 1));
    if (progressBar) progressBar.style.width = (n / 3 * 100) + '%';
    currentStep = n;
  }

  // Step 1: click option → advance
  steps[0]?.querySelectorAll('.quiz-opt').forEach(btn => {
    btn.addEventListener('click', function() {
      steps[0].querySelectorAll('.quiz-opt').forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
      quizEventType = this.dataset.val;
      setTimeout(() => goToStep(2), 200);
    });
  });

  // Step 2: nav
  document.getElementById('quizBack2')?.addEventListener('click', () => goToStep(1));
  document.getElementById('quizNext2')?.addEventListener('click', () => goToStep(3));

  // Step 3: nav
  document.getElementById('quizBack3')?.addEventListener('click', () => goToStep(2));

  // Submit
  document.getElementById('quizSubmit')?.addEventListener('click', function() {
    const date  = document.getElementById('quizDate')?.value;
    const city  = document.getElementById('quizCity')?.value.trim();
    const note  = document.getElementById('quizNote')?.value.trim();
    const checks = [...(document.querySelectorAll('#quizStep3 .quiz-check-item input:checked'))].map(c => c.value);

    let text = `Заявка на выступление дуэта «Отображение»\n\n`;
    text += `Мероприятие: ${quizEventType || '—'}\n`;
    if (date) text += `Дата: ${new Date(date).toLocaleDateString('ru-RU')}\n`;
    if (city) text += `Город: ${city}\n`;
    if (checks.length) text += `Важно: ${checks.join(', ')}\n`;
    if (note) text += `\n${note}`;

    window.open(`https://wa.me/79307001530?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  });
})();

// ===== SWIPE FOR PHOTO MODAL =====
(function() {
  const modal = document.getElementById('photoModal');
  if (!modal) return;
  let touchStartX = 0;
  modal.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  modal.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 50) diff > 0 ? showPrev() : showNext();
  }, { passive: true });
})();
