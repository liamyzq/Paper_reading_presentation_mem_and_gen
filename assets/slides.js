const deck = document.querySelector('.deck');
const htmlParts = window.__DECK_HTML_PARTS || [];

if (!deck || htmlParts.length !== 10) {
  throw new Error(`Deck assembly failed: expected 10 parts, found ${htmlParts.length}`);
}

deck.innerHTML = htmlParts.join('');
delete window.__DECK_HTML_PARTS;

const slides = [...document.querySelectorAll('.slide')];
const progressBar = document.getElementById('progressBar');
const slideNo = document.getElementById('slideNo');
const sectionName = document.getElementById('sectionName');
let current = 0;
let touchStartX = null;

const figureLightbox = document.createElement('div');
figureLightbox.className = 'figure-lightbox';
figureLightbox.setAttribute('aria-hidden', 'true');
figureLightbox.innerHTML = '<button class="figure-lightbox-close" type="button" aria-label="Close enlarged figure">×</button><img alt="" />';
document.body.appendChild(figureLightbox);
const lightboxImage = figureLightbox.querySelector('img');

function openFigure(source, altText = '') {
  lightboxImage.src = source;
  lightboxImage.alt = altText;
  figureLightbox.classList.add('open');
  figureLightbox.setAttribute('aria-hidden', 'false');
  figureLightbox.querySelector('.figure-lightbox-close').focus();
}

function closeFigure() {
  figureLightbox.classList.remove('open');
  figureLightbox.setAttribute('aria-hidden', 'true');
  lightboxImage.removeAttribute('src');
}

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
  const zoomButton = event.target.closest('[data-zoom-src]');
  if (zoomButton) {
    event.preventDefault();
    const image = zoomButton.querySelector('img');
    openFigure(zoomButton.dataset.zoomSrc, image?.alt || '');
    return;
  }

  if (event.target === figureLightbox || event.target.closest('.figure-lightbox-close')) {
    closeFigure();
    return;
  }

  const button = event.target.closest('[data-jump]');
  if (!button) return;
  event.preventDefault();
  jumpToTitle(button.dataset.jump);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && figureLightbox.classList.contains('open')) {
    event.preventDefault();
    closeFigure();
    return;
  }
  if (figureLightbox.classList.contains('open')) return;
  if (event.target.closest('button, a, input, textarea, select')) return;

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
  if (touchStartX === null || figureLightbox.classList.contains('open')) return;
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
