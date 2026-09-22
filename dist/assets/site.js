const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const nav = document.querySelector('[data-nav]');

const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  nav?.classList.toggle('open', !isOpen);
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
  });
});

const characterCarousel = document.querySelector('[data-character-carousel]');
const scrollCharacters = (direction) => {
  if (!characterCarousel) return;
  const card = characterCarousel.querySelector('.character-card');
  const distance = card ? card.getBoundingClientRect().width + 16 : characterCarousel.clientWidth * 0.8;
  characterCarousel.scrollBy({ left: direction * distance, behavior: 'smooth' });
};

document.querySelector('[data-character-prev]')?.addEventListener('click', () => scrollCharacters(-1));
document.querySelector('[data-character-next]')?.addEventListener('click', () => scrollCharacters(1));

const jingle = document.querySelector('[data-jingle-audio]');
const jingleToggle = document.querySelector('[data-jingle-toggle]');
const jingleIcon = document.querySelector('[data-jingle-icon]');
const jingleLabel = document.querySelector('[data-jingle-label]');
const jingleProgress = document.querySelector('[data-jingle-progress]');
const jingleCurrent = document.querySelector('[data-jingle-current]');
const jingleDuration = document.querySelector('[data-jingle-duration]');
const jingleVolume = document.querySelector('[data-jingle-volume]');

const formatAudioTime = (seconds) => {
  if (!Number.isFinite(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remaining}`;
};

const updateJingleButton = () => {
  if (!jingle || !jingleIcon || !jingleLabel) return;
  const playing = !jingle.paused;
  jingleIcon.textContent = playing ? 'Ⅱ' : '▶';
  jingleLabel.textContent = playing ? 'Pause the jingle' : 'Play the jingle';
  jingleToggle?.setAttribute('aria-label', playing ? 'Pause the Critical Split jingle' : 'Play the Critical Split jingle');
};

jingleToggle?.addEventListener('click', async () => {
  if (!jingle) return;
  if (jingle.paused) {
    try { await jingle.play(); } catch (_) { return; }
  } else {
    jingle.pause();
  }
  updateJingleButton();
});

jingle?.addEventListener('loadedmetadata', () => {
  if (jingleDuration) jingleDuration.textContent = formatAudioTime(jingle.duration);
});

jingle?.addEventListener('timeupdate', () => {
  if (jingleCurrent) jingleCurrent.textContent = formatAudioTime(jingle.currentTime);
  if (jingleProgress && Number.isFinite(jingle.duration) && jingle.duration > 0) {
    jingleProgress.value = String((jingle.currentTime / jingle.duration) * 100);
  }
});

jingle?.addEventListener('play', updateJingleButton);
jingle?.addEventListener('pause', updateJingleButton);
jingle?.addEventListener('ended', updateJingleButton);

jingleProgress?.addEventListener('input', () => {
  if (!jingle || !Number.isFinite(jingle.duration)) return;
  jingle.currentTime = (Number(jingleProgress.value) / 100) * jingle.duration;
});

jingleVolume?.addEventListener('input', () => {
  if (jingle) jingle.volume = Number(jingleVolume.value);
});

document.querySelectorAll('[data-year]').forEach((year) => {
  year.textContent = String(new Date().getFullYear());
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  document.querySelectorAll('.reveal').forEach((item) => item.classList.add('visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));
}
