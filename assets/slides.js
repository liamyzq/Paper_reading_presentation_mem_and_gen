(async () => {
  const partPaths = Array.from(
    { length: 10 },
    (_, index) => `assets/deck/deck-${String(index + 1).padStart(2, '0')}.js`
  );

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.addEventListener('load', () => {
        script.remove();
        resolve();
      }, { once: true });
      script.addEventListener('error', () => {
        reject(new Error(`Could not load ${src}`));
      }, { once: true });
      document.head.appendChild(script);
    });
  }

  for (const path of partPaths) {
    await loadScript(path);
  }

  const deck = document.querySelector('.deck');
  const htmlParts = window.__DECK_HTML_PARTS || [];
  if (!deck || htmlParts.length !== partPaths.length) {
    throw new Error(`Deck assembly failed: expected ${partPaths.length} parts, found ${htmlParts.length}`);
  }

  deck.innerHTML = htmlParts.join('');
  delete window.__DECK_HTML_PARTS;

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
})().catch((error) => {
  console.error(error);
  const notice = document.createElement('div');
  notice.style.cssText = 'position:fixed;inset:18px 18px auto;z-index:9999;padding:14px 18px;border:1px solid #ff91a5;border-radius:12px;background:#24111a;color:#ffe8ed;font:16px/1.4 system-ui';
  notice.textContent = `Presentation failed to load: ${error.message}`;
  document.body.appendChild(notice);
});
