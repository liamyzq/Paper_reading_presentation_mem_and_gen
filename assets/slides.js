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
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === next);
    slide.classList.toggle('leaving', i < next);
    slide.setAttribute('aria-hidden', i === next ? 'false' : 'true');
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
  if (['ArrowRight','PageDown',' '].includes(event.key)) { event.preventDefault(); showSlide(current + 1); }
  if (['ArrowLeft','PageUp'].includes(event.key)) { event.preventDefault(); showSlide(current - 1); }
  if (event.key === 'Home') showSlide(0);
  if (event.key === 'End') showSlide(slides.length - 1);
});
document.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].screenX; }, {passive:true});
document.addEventListener('touchend', (event) => {
  if (touchStartX === null) return;
  const delta = event.changedTouches[0].screenX - touchStartX;
  if (Math.abs(delta) > 45) showSlide(current + (delta < 0 ? 1 : -1));
  touchStartX = null;
}, {passive:true});

window.addEventListener('DOMContentLoaded', () => {
  const requested = Number.parseInt(location.hash.slice(1), 10);
  showSlide(Number.isFinite(requested) ? requested - 1 : 0, false);
});
window.addEventListener('load', () => {
  if (window.renderMathInElement) {
    renderMathInElement(document.body, {
      delimiters: [
        {left:'$$', right:'$$', display:true},
        {left:'\\[', right:'\\]', display:true},
        {left:'\\(', right:'\\)', display:false}
      ],
      throwOnError:false,
      strict:false
    });
  }
});
