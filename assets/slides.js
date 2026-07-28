(async () => {
  try {
    const response = await fetch('assets/slides-v2.js.gz.b64', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Could not load revised presentation source: ${response.status}`);

    const base64 = (await response.text()).trim();
    const compressed = Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));

    if (typeof DecompressionStream !== 'function') {
      throw new Error('This browser does not support gzip DecompressionStream. Please use a current Chrome, Edge, Firefox, or Safari version.');
    }

    const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'));
    const source = await new Response(stream).text();
    (0, eval)(source);
  } catch (error) {
    console.error(error);
    const notice = document.createElement('div');
    notice.style.cssText = 'position:fixed;inset:18px 18px auto;z-index:9999;padding:14px 18px;border:1px solid #ff91a5;border-radius:12px;background:#24111a;color:#ffe8ed;font:16px/1.4 system-ui';
    notice.textContent = `Presentation revision failed to load: ${error.message}`;
    document.body.appendChild(notice);
  }
})();
