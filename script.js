'use strict';

const photos = [
  { image: 'photo/МАЛЫШ.bmp', date: '2026-03-20', artist: 'The Beatles', title: 'Something' },
  { image: 'photo/greenroom.jpg', date: '2026-04-13', artist: 'Crystal Castles', title: 'Fleece' },
  { image: 'photo/mayhem.png', date: '2026-03-26', artist: 'Mayhem', title: 'Deathcrush' },
  { image: 'photo/restore.jpg', date: '2026-03-22', artist: 'Deftones', title: 'Drive' },
  { image: 'photo/クソ写真家.jpg', date: '2026-01-20', artist: 'Cafuné', title: 'Tek It (Acoustic)' },
  { image: 'photo/ボーイワーム.png', date: '2026-07-12', artist: 'NIN', title: 'I Do Not Want This' },
  { image: 'photo/pandemonian.png', date: '2026-07-13', artist: 'The Cure', title: 'Lovesong' },
  { image: 'photo/01.25.sharic.jpg', date: '2025-01-15', artist: 'Death Grips', title: 'Guillotine' },
  { image: 'photo/crist.JPG', date: '2025-01-09', artist: 'bladee', title: 'reborn' },
  { image: 'photo/crystal castles.jpg', date: '2025-05-08', artist: 'Crystal Castles', title: 'Alice Practice' },
  { image: 'photo/first.gif', date: '2024-07-08', artist: 'Salem', title: 'King Night' },
  { image: 'photo/lost.jpeg', date: '2025-01-19', artist: 'Anri', title: 'Kanashimi ga Tomaranai (I CAN’T STOP THE LONELINESS)' },
  { image: 'photo/punk.jpeg', date: '2024-07-30', artist: 'Acid Bath', title: 'Dr. Seuss Is Dead' },
  { image: 'photo/running.jpeg', date: '2025-01-13', artist: 'Marilyn Manson', title: 'Running To The Edge Of The World' },
  { image: 'photo/selfmade.jpg', date: '2024-08-29', artist: 'Philip Glass', title: 'Prophecies' }
].sort((a, b) => b.date.localeCompare(a.date));

const grid = document.getElementById('photo-grid');
const gallery = document.getElementById('gallery');
const galleryImage = gallery.querySelector('.gallery-img');
let galleryIndex = 0;

function createCard(photo, index) {
  const card = document.createElement('article');
  card.className = 'card';

  const image = document.createElement('img');
  image.src = `static/${photo.image}`;
  image.alt = `${photo.artist} — ${photo.title}`;
  image.loading = index < 2 ? 'eager' : 'lazy';
  image.decoding = 'async';
  image.tabIndex = 0;
  image.setAttribute('role', 'button');
  image.setAttribute('aria-label', `Открыть фото: ${photo.image.split('/').pop()}`);
  image.addEventListener('click', () => openGallery(index));
  image.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openGallery(index);
    }
  });

  const player = document.createElement('div');
  player.className = 'player unavailable';

  const trackName = document.createElement('button');
  trackName.className = 'btn';
  trackName.type = 'button';
  trackName.disabled = true;
  trackName.textContent = `${photo.artist} – ${photo.title}`;
  trackName.title = 'Аудиофайл отсутствует в локальном архиве';

  const progress = document.createElement('div');
  progress.className = 'line';

  const time = document.createElement('span');
  time.className = 'time';
  time.textContent = 'audio unavailable';

  player.append(trackName, progress, time);
  card.append(image, player);
  return card;
}

photos.forEach((photo, index) => grid.append(createCard(photo, index)));

function openGallery(index) {
  galleryIndex = index;
  updateGalleryImage();
  gallery.classList.add('active');
}

function updateGalleryImage() {
  const photo = photos[galleryIndex];
  galleryImage.src = `static/${photo.image}`;
  galleryImage.alt = `${photo.artist} — ${photo.title}`;
}

function closeGallery() {
  gallery.classList.remove('active');
}

function moveGallery(step) {
  galleryIndex = (galleryIndex + step + photos.length) % photos.length;
  updateGalleryImage();
}

gallery.querySelector('.gallery-close').addEventListener('click', closeGallery);
gallery.querySelector('.prev').addEventListener('click', () => moveGallery(-1));
gallery.querySelector('.next').addEventListener('click', () => moveGallery(1));
gallery.addEventListener('click', event => {
  if (event.target === gallery) closeGallery();
});
document.addEventListener('keydown', event => {
  if (!gallery.classList.contains('active')) return;
  if (event.key === 'Escape') closeGallery();
  if (event.key === 'ArrowRight') moveGallery(1);
  if (event.key === 'ArrowLeft') moveGallery(-1);
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.card').forEach(card => observer.observe(card));
} else {
  document.querySelectorAll('.card').forEach(card => card.classList.add('visible'));
}

document.getElementById('open-disclaimer').addEventListener('click', () => {
  document.getElementById('win98').classList.add('active');
});

document.querySelector('.win98-close').addEventListener('click', closeDisclaimer);
document.querySelector('.win98-btn').addEventListener('click', closeDisclaimer);
document.getElementById('win98').addEventListener('click', event => {
  if (event.target.id === 'win98') closeDisclaimer();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeDisclaimer();
});

function closeDisclaimer() {
  document.getElementById('win98').classList.remove('active');
}
