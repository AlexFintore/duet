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
  // === АВТОРСКИЕ ===
  { title: 'Пожелайте бывшим счастья',       genre: 'own', artist: 'Дуэт «Отображение»' },
  { title: 'Любовь приходит не одна',         genre: 'own', artist: 'Дуэт «Отображение»' },
  { title: 'Бригантина любви',               genre: 'own', artist: 'Дуэт «Отображение»' },
  { title: 'Танцы в ночи',                   genre: 'own', artist: 'Дуэт «Отображение»' },
  { title: 'Дети войны',                     genre: 'own', artist: 'Сергей Зорин' },
  { title: 'Скажи мне',                      genre: 'own', artist: 'Сергей Зорин' },

  // === ПОП ===
  { title: 'Песенка о медведях',             genre: 'pop', artist: 'Алёна Свиридова' },
  { title: 'Безответно',                     genre: 'pop', artist: 'В. Меладзе, А. Приходько' },
  { title: 'Незаконченный роман',            genre: 'pop', artist: 'И. Аллегрова, И. Крутой' },
  { title: 'Счастье',                        genre: 'pop', artist: 'Лев Лещенко, Жасмин' },
  { title: 'Счастье (новогодняя)',           genre: 'pop', artist: 'Лев Лещенко, Жасмин' },
  { title: 'За тебя',                        genre: 'pop', artist: 'Ян Марти, Ваенга' },
  { title: 'Девочка моя',                    genre: 'pop', artist: 'Emin' },
  { title: 'Как долго я тебя искал',         genre: 'pop', artist: 'Алексей Брянцев' },
  { title: '7000 над землёй',               genre: 'pop', artist: 'Валерий Сюткин' },
  { title: 'Большая Медведица',             genre: 'pop', artist: 'Михаил Боярский' },
  { title: 'Любимый человек',               genre: 'pop', artist: 'Анивар' },
  { title: 'Уфтанма',                       genre: 'pop', artist: 'Элвин Грей' },
  { title: 'Лирика',                        genre: 'pop', artist: 'Filatov & Karas' },
  { title: 'Одно и то же',                  genre: 'pop', artist: 'IOWA' },
  { title: 'Белые цветы',                   genre: 'pop', artist: 'Silder' },
  { title: 'Credo',                         genre: 'pop', artist: 'Zivert' },
  { title: 'ЯТЛ',                           genre: 'pop', artist: 'Zivert' },
  { title: 'Звёздное лето',                 genre: 'pop', artist: 'А. Пугачёва' },
  { title: 'Миллион алых роз',              genre: 'pop', artist: 'А. Пугачёва' },
  { title: 'Зимний сон',                    genre: 'pop', artist: 'Алсу' },
  { title: 'Милэшлэрем',                    genre: 'pop', artist: 'Алсу Хисамиева' },
  { title: 'Не жди меня',                   genre: 'pop', artist: 'А. Варум' },
  { title: 'Так же как все',                genre: 'pop', artist: 'А-Студио' },
  { title: 'Попытка №5',                    genre: 'pop', artist: 'ВИА ГРА' },
  { title: 'Задержи',                       genre: 'pop', artist: 'В. Ильинская' },
  { title: 'Солнце',                        genre: 'pop', artist: 'Е. Терлеева' },
  { title: 'Ягода-малина',                  genre: 'pop', artist: 'Жасмин' },
  { title: 'С днём рождения',               genre: 'pop', artist: 'И. Аллегрова' },
  { title: 'Угонщица',                      genre: 'pop', artist: 'И. Аллегрова' },
  { title: 'Бессовестно счастливая',        genre: 'pop', artist: 'Н. Голицина' },
  { title: 'Брутальный мужчина',            genre: 'pop', artist: 'К. Ростовцева' },
  { title: 'Всё в твоих руках',             genre: 'pop', artist: 'Агутин, Варум' },
  { title: 'Я тебя люблю',                  genre: 'pop', artist: 'М. Собко' },
  { title: 'Музыка нас связала',            genre: 'pop', artist: 'Мираж' },
  { title: 'Ветер с моря дул',              genre: 'pop', artist: 'Натали' },
  { title: 'Полюби меня такой',             genre: 'pop', artist: 'Н. Могилевская' },
  { title: 'Черная смородина',              genre: 'pop', artist: 'А. Росс' },
  { title: 'Я у твоих ног',                 genre: 'pop', artist: 'Н. Власова' },
  { title: 'Жёлтые тюльпаны',              genre: 'pop', artist: 'Н. Королёва' },
  { title: 'Синие лебеди',                  genre: 'pop', artist: 'Н. Королёва' },
  { title: 'Чуть-чуть не считается',        genre: 'pop', artist: 'Н. Королёва' },
  { title: 'Каждая женщина хочет',          genre: 'pop', artist: 'Н. Королёва' },
  { title: 'Отображение',                   genre: 'pop', artist: 'Нюша' },
  { title: 'На теплоходе музыка играет',    genre: 'pop', artist: 'О. Зарубина' },
  { title: 'Снежинка',                      genre: 'pop', artist: 'Приключения Электроников' },
  { title: 'Подруга',                       genre: 'pop', artist: 'Слава' },
  { title: 'Белая черёмуха',               genre: 'pop', artist: 'Ю. Михальчик' },
  { title: 'Жили-были',                     genre: 'pop', artist: 'Юта' },
  { title: 'Матушка-Земля',                 genre: 'pop', artist: 'Т. Куртукова' },
  { title: 'Странник',                      genre: 'pop', artist: 'Абдулкарим Каримов' },

  // === РОК ===
  { title: 'Cristmas',                      genre: 'rock', artist: 'Би-2' },
  { title: 'Компромисс',                    genre: 'rock', artist: 'Би-2' },
  { title: 'Лайки',                         genre: 'rock', artist: 'Би-2' },
  { title: 'Скользкие улицы',               genre: 'rock', artist: 'Би-2' },
  { title: 'Ветер знает',                   genre: 'rock', artist: 'Браво' },
  { title: 'Жар-птица',                     genre: 'rock', artist: 'Браво' },
  { title: 'Этот город',                    genre: 'rock', artist: 'Браво' },
  { title: 'Это за окном рассвет',          genre: 'rock', artist: 'Браво' },
  { title: 'Первый снег',                   genre: 'rock', artist: 'Моральный кодекс' },
  { title: 'Диктофоны',                     genre: 'rock', artist: 'Танцы минус' },
  { title: 'Половинка',                     genre: 'rock', artist: 'Танцы минус' },
  { title: 'Цветут цветы',                  genre: 'rock', artist: 'Танцы минус' },
  { title: 'Город',                         genre: 'rock', artist: 'Танцы минус' },
  { title: 'Танкист',                       genre: 'rock', artist: 'Жуки' },

  // === ШАНСОН ===
  { title: 'В сердце твоём',               genre: 'shanson', artist: 'И. Круг, А. Брянцев' },
  { title: 'Как будто мы с тобой',          genre: 'shanson', artist: 'И. Круг, А. Брянцев' },
  { title: 'Любимый взгляд',               genre: 'shanson', artist: 'И. Круг, А. Брянцев' },
  { title: 'Привет, малыш',                genre: 'shanson', artist: 'И. Круг, А. Брянцев' },
  { title: 'Заходи ко мне во сне',          genre: 'shanson', artist: 'И. Круг, А. Брянцев' },
  { title: 'Тебе моя последняя любовь',    genre: 'shanson', artist: 'И. Круг, М. Круг' },
  { title: 'А мы не ангелы, парень',       genre: 'shanson', artist: 'Алексей Пономарев' },
  { title: 'Одинокая волчица',              genre: 'shanson', artist: 'Белый Орёл' },
  { title: 'Владимирский централ',          genre: 'shanson', artist: 'Михаил Круг' },
  { title: 'Мой Бог',                       genre: 'shanson', artist: 'Михаил Круг' },
  { title: 'Мышка',                         genre: 'shanson', artist: 'Михаил Круг' },
  { title: 'Падал снег',                    genre: 'shanson', artist: 'Михаил Круг' },
  { title: 'Марджанджа',                    genre: 'shanson', artist: 'Михаил Шуфутинский' },
  { title: 'Марджанджа (ремикс)',           genre: 'shanson', artist: 'Михаил Шуфутинский' },
  { title: 'Пальма-де-Майорка',            genre: 'shanson', artist: 'Михаил Шуфутинский' },
  { title: 'Ветер в голове',               genre: 'shanson', artist: 'Трофим' },
  { title: 'Московская',                    genre: 'shanson', artist: 'Трофим' },
  { title: 'Сочи',                          genre: 'shanson', artist: 'Трофим' },
  { title: 'Снегири',                       genre: 'shanson', artist: 'Трофим' },
  { title: 'Осколки',                       genre: 'shanson', artist: 'Юрий Смыслов' },
  { title: 'Желаю',                         genre: 'shanson', artist: 'Ваенга' },
  { title: 'Курю',                          genre: 'shanson', artist: 'Ваенга' },
  { title: 'Девочка',                       genre: 'shanson', artist: 'Ваенга' },
  { title: 'Бокал Бакарди',               genre: 'shanson', artist: 'И. Круг' },
  { title: 'Ветер',                         genre: 'shanson', artist: 'И. Круг' },
  { title: 'Дом на горе',                   genre: 'shanson', artist: 'И. Круг' },
  { title: 'Ищи не ищи',                   genre: 'shanson', artist: 'И. Круг' },
  { title: 'Я прочитаю в глазах твоих',    genre: 'shanson', artist: 'И. Круг' },
  { title: 'Младший лейтенант',             genre: 'shanson', artist: 'И. Аллегрова' },
  { title: 'Не жалей',                      genre: 'shanson', artist: 'Лилия Туманова' },
  { title: 'Гитара',                        genre: 'shanson', artist: 'Л. Успенская' },
  { title: 'К единственному нежному',       genre: 'shanson', artist: 'Л. Успенская' },
  { title: 'Мы с тобою похожи',            genre: 'shanson', artist: 'Л. Успенская' },
  { title: 'Небо',                          genre: 'shanson', artist: 'Л. Успенская' },
  { title: 'По полюшку',                   genre: 'shanson', artist: 'Л. Успенская' },
];

// ===== REPERTOIRE MODAL =====
(function() {
  let currentGenre = 'all';

  const modal = document.getElementById('repModal');
  if (!modal) return;

  function getFiltered() {
    return currentGenre === 'all' ? REPERTOIRE : REPERTOIRE.filter(s => s.genre === currentGenre);
  }

  function render() {
    const list = getFiltered();
    document.getElementById('repModalList').innerHTML = list.map(song =>
      `<div class="rep-modal-item"><span class="rep-title">${song.title}</span>${song.artist ? `<span class="rep-artist">${song.artist}</span>` : ''}</div>`
    ).join('');
    document.getElementById('repModalCount').textContent = `${list.length} песен`;
  }

  function open() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    render();
  }

  function close() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.getElementById('openRepModal')?.addEventListener('click', open);
  document.getElementById('repModalClose')?.addEventListener('click', close);
  document.getElementById('repModalOverlay')?.addEventListener('click', close);

  document.getElementById('repModalFilters')?.querySelectorAll('.rep-filter').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('#repModalFilters .rep-filter').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentGenre = this.dataset.genre;
      document.getElementById('repModalList').scrollTop = 0;
      render();
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('active')) close();
  });
})()

// ===== SINGLE TRACK PLAY =====
// Polling: when user clicks inside an iframe it becomes document.activeElement.
// We detect the change and reset all other track iframes.
(function() {
  var activeIframe = null;
  setInterval(function() {
    var el = document.activeElement;
    if (el && el.tagName === 'IFRAME' && el.closest('.track-embed') && el !== activeIframe) {
      activeIframe = el;
      document.querySelectorAll('.track-embed iframe').forEach(function(iframe) {
        if (iframe !== el) {
          var src = iframe.src;
          iframe.src = '';
          setTimeout(function() { iframe.src = src; }, 150);
        }
      });
    }
  }, 250);
})();

// ===== CONTACT FLOAT =====
function toggleContact() {
  var popup = document.getElementById('contactPopup');
  var float = document.getElementById('contactFloat');
  if (!popup) return;
  var opening = !popup.classList.contains('open');
  popup.classList.toggle('open', opening);
  if (float) float.classList.toggle('open', opening);
}
document.addEventListener('click', function(e) {
  var float = document.getElementById('contactFloat');
  var popup = document.getElementById('contactPopup');
  if (float && popup && popup.classList.contains('open') && !float.contains(e.target)) {
    popup.classList.remove('open');
    float.classList.remove('open');
  }
}, true);

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

// ===== CONTACT QUICK FORM =====
document.getElementById('contactQuickForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const type  = document.getElementById('qfEventType')?.value;
  const date  = document.getElementById('qfDate')?.value;
  const city  = document.getElementById('qfCity')?.value.trim();
  const phone = document.getElementById('qfPhone')?.value.trim();
  const note  = document.getElementById('qfNote')?.value.trim();

  let text = `Заявка на выступление дуэта «Отображение»\n\n`;
  if (type)  text += `Мероприятие: ${type}\n`;
  if (date)  text += `Дата: ${new Date(date).toLocaleDateString('ru-RU')}\n`;
  if (city)  text += `Город: ${city}\n`;
  if (phone) text += `Телефон: ${phone}\n`;
  if (note)  text += `\nПожелания: ${note}`;

  window.open(`https://wa.me/79307001530?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
});

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
