const deck = document.querySelector('.deck');
const htmlParts = window.__DECK_HTML_PARTS || [];

if (!deck || htmlParts.length !== 10) {
  throw new Error(`Deck assembly failed: expected 10 parts, found ${htmlParts.length}`);
}

deck.innerHTML = htmlParts.join('');
delete window.__DECK_HTML_PARTS;

const localFigureMap = {
  'assets/figures/dynamical-regimes/recap.png': 'assets/figures/dynamical-regimes/recap.svg',
  'assets/figures/dynamical-regimes/speciation-real.png': 'assets/figures/dynamical-regimes/speciation-real.svg',
  'assets/figures/dynamical-regimes/collapse-real.png': 'assets/figures/dynamical-regimes/collapse-real.svg',
  'assets/figures/selective-underfitting/extrapolation-illustration.png': 'assets/figures/selective-underfitting/extrapolation-illustration.svg',
  'assets/figures/selective-underfitting/extrapolation-distance.png': 'assets/figures/selective-underfitting/extrapolation-distance.svg',
  'assets/figures/selective-underfitting/contrastive-scaling.png': 'assets/figures/selective-underfitting/contrastive-scaling.svg',
  'assets/figures/selective-underfitting/phase-transition-example.png': 'assets/figures/selective-underfitting/phase-transition-example.svg',
  'assets/figures/selective-underfitting/phase-transition-plot.png': 'assets/figures/selective-underfitting/phase-transition-plot.svg',
  'assets/figures/selective-underfitting/foe-generalization.png': 'assets/figures/selective-underfitting/foe-generalization.svg',
  'assets/figures/selective-underfitting/foe-memorization.png': 'assets/figures/selective-underfitting/foe-memorization.svg',
  'assets/figures/selective-underfitting/foe-plot.png': 'assets/figures/selective-underfitting/foe-plot.svg'
};

deck.querySelectorAll('img[src]').forEach((image) => {
  const source = image.getAttribute('src');
  if (localFigureMap[source]) image.setAttribute('src', localFigureMap[source]);
});

const overviewCaption = [...deck.querySelectorAll('.slide')]
  .find((slide) => slide.dataset.title === 'Exact reverse dynamics')
  ?.querySelector('.paper-caption');
if (overviewCaption) {
  overviewCaption.textContent = 'Schematic reconstruction adapted from Biroli et al., Fig. 1.';
}

const slides = [...document.querySelectorAll('.slide')];
const progressBar = document.getElementById('progressBar');
const slideNo = document.getElementById('slideNo');
const sectionName = document.getElementById('sectionName');
let current = 0;
let touchStartX = null;

function normalizeIndex(index) {
  return (index + slides.length) % slides.length;
}

function showSlide(index, updateHash = true) {
  const next = normalizeIndex(index);
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle('active', slideIndex === next);
    slide.classList.toggle('leaving', slideIndex < next);
    slide.setAttribute('aria-hidden', slideIndex === next ? 'false' : 'true');
  });
  current = next;
  progressBar.style.width = `${((current + 1) / slides.length) * 100}%`;
  slideNo.textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  sectionName.textContent = slides[current].dataset.title || '';
  if (updateHash) history.replaceState(null, '', `#${current + 1}`);
}

function jumpToTitle(title) {
  const index = slides.findIndex((slide) => slide.dataset.title === title);
  if (index >= 0) showSlide(index);
}

document.getElementById('prev').addEventListener('click', () => showSlide(current - 1));
document.getElementById('next').addEventListener('click', () => showSlide(current + 1));
document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-jump]');
  if (!button) return;
  event.preventDefault();
  jumpToTitle(button.dataset.jump);
});
document.addEventListener('keydown', (event) => {
  if (['ArrowRight', 'PageDown', ' '].includes(event.key)) {
    event.preventDefault();
    showSlide(current + 1);
  }
  if (['ArrowLeft', 'PageUp'].includes(event.key)) {
    event.preventDefault();
    showSlide(current - 1);
  }
  if (event.key === 'Home') showSlide(0);
  if (event.key === 'End') showSlide(slides.length - 1);
});
document.addEventListener('touchstart', (event) => {
  touchStartX = event.changedTouches[0].screenX;
}, { passive: true });
document.addEventListener('touchend', (event) => {
  if (touchStartX === null) return;
  const delta = event.changedTouches[0].screenX - touchStartX;
  if (Math.abs(delta) > 45) showSlide(current + (delta < 0 ? 1 : -1));
  touchStartX = null;
}, { passive: true });

if (window.renderMathInElement) {
  renderMathInElement(deck, {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '\\[', right: '\\]', display: true },
      { left: '\\(', right: '\\)', display: false }
    ],
    throwOnError: false,
    strict: false
  });
}

const requested = Number.parseInt(location.hash.slice(1), 10);
showSlide(Number.isFinite(requested) ? requested - 1 : 0, false);
