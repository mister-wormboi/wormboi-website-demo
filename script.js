'use strict';

const photos = [
  { image: 'photo/МАЛЫШ.webp', date: '2026-03-20' },
  { image: 'photo/greenroom.webp', date: '2026-04-13' },
  { image: 'photo/mayhem.webp', date: '2026-03-26' },
  { image: 'photo/restore.webp', date: '2026-03-22' },
  { image: 'photo/クソ写真家.webp', date: '2026-01-20' },
  { image: 'photo/wormboi.webp', date: '2026-07-12' },
  { image: 'photo/pandemonian.webp', date: '2026-07-13' },
  { image: 'photo/01.25.sharic.webp', date: '2025-01-15' },
  { image: 'photo/crist.webp', date: '2025-01-09' },
  { image: 'photo/crystal castles.webp', date: '2025-05-08' },
  { image: 'photo/lost.webp', date: '2025-01-19' },
  { image: 'photo/running.webp', date: '2025-01-13' },
  { image: 'photo/selfmade.webp', date: '2024-08-29' }
].sort((first, second) => second.date.localeCompare(first.date));

const grid = document.getElementById('photo-grid');
const gallery = document.getElementById('gallery');
const galleryImage = gallery.querySelector('.gallery-img');
const disclaimer = document.getElementById('win98');
let galleryIndex = 0;

function createCard(photo, index) {
  const card = document.createElement('article');
  card.className = 'card';

  const image = document.createElement('img');
  const filename = photo.image.split('/').pop();
  image.src = `static/${photo.image}`;
  image.alt = filename;
  image.loading = index === 0 ? 'eager' : 'lazy';
  image.fetchPriority = index === 0 ? 'high' : 'auto';
  image.decoding = 'async';
  image.tabIndex = 0;
  image.setAttribute('role', 'button');
  image.setAttribute('aria-label', `Открыть фото: ${filename}`);
  image.addEventListener('click', () => openGallery(index));
  image.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openGallery(index);
  });

  card.append(image);
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
  galleryImage.alt = photo.image.split('/').pop();
}

function closeGallery() {
  gallery.classList.remove('active');
}

function moveGallery(step) {
  galleryIndex = (galleryIndex + step + photos.length) % photos.length;
  updateGalleryImage();
}

gallery.querySelector('.gallery-close').addEventListener('click', closeGallery);
gallery.addEventListener('click', event => {
  if (event.target === gallery) closeGallery();
});
document.addEventListener('keydown', event => {
  if (gallery.classList.contains('active')) {
    if (event.key === 'Escape') closeGallery();
    if (event.key === 'ArrowRight') moveGallery(1);
    if (event.key === 'ArrowLeft') moveGallery(-1);
  } else if (event.key === 'Escape') {
    disclaimer.classList.remove('active');
  }
});

document.getElementById('open-disclaimer').addEventListener('click', () => {
  disclaimer.classList.add('active');
});
document.querySelector('.win98-close').addEventListener('click', () => {
  disclaimer.classList.remove('active');
});
document.querySelector('.win98-btn').addEventListener('click', () => {
  disclaimer.classList.remove('active');
});
disclaimer.addEventListener('click', event => {
  if (event.target === disclaimer) disclaimer.classList.remove('active');
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.card').forEach(card => observer.observe(card));
} else {
  document.querySelectorAll('.card').forEach(card => card.classList.add('visible'));
}

if (matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.card').forEach(card => {
    const image = card.querySelector('img');
    let frame = 0;
    let rotateX = 0;
    let rotateY = 0;
    let targetX = 0;
    let targetY = 0;

    function animate() {
      rotateX += (targetX - rotateX) * 0.12;
      rotateY += (targetY - rotateY) * 0.12;
      image.style.transform = `translateZ(-20px) scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

      if (Math.abs(targetX - rotateX) > 0.02 || Math.abs(targetY - rotateY) > 0.02) {
        frame = requestAnimationFrame(animate);
      } else {
        frame = 0;
      }
    }

    card.addEventListener('mousemove', event => {
      const bounds = card.getBoundingClientRect();
      targetX = -(event.clientY - bounds.top - bounds.height / 2) / 80;
      targetY = (event.clientX - bounds.left - bounds.width / 2) / 80;
      if (!frame) frame = requestAnimationFrame(animate);
    });
    card.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
      if (!frame) frame = requestAnimationFrame(animate);
    });
  });
}
