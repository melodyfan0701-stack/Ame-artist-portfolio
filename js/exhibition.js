/* =========================================================
   exhibition.js｜線上手帳展：水平展牆（階段 6）
   桌機：區塊「釘住」在畫面上，往下捲的距離轉換成展牆往左移動的距離。
   手機：不釘住，直接左右滑（scroll-snap）。
   ========================================================= */
(function () {
  const pin = document.getElementById('exhibitPin');
  const track = document.getElementById('exhibitTrack');
  if (!pin || !track) return;

  const LETTERS = ['A', 'B', 'C', 'D'];

  /* ---------- 產生四個展區 ---------- */
  Object.entries(CHARACTERS).forEach(([key, c], i) => {
    const works = WORKS.filter(w => w.character === key);
    const booth = document.createElement('article');
    booth.className = 'booth';
    booth.dataset.char = key;
    booth.style.setProperty('--booth-main', c.main);
    booth.style.setProperty('--booth-accent', c.accent);
    booth.style.setProperty('--r', (i % 2 ? 1.2 : -1.2) + 'deg');
    booth.innerHTML = `
      <div class="booth__body">
        <div class="booth__head">
          <span class="booth__no script">Room ${LETTERS[i]}</span>
          <span class="dot-sticker" aria-hidden="true"><img src="${c.face}" alt=""></span>
        </div>
        <h3>${c.name}</h3>
        <p class="booth__motto">${c.motto}</p>
        <p class="booth__palette"><span class="swatch" style="background:${c.main}"></span><span class="swatch" style="background:${c.accent}"></span>${c.palette}</p>
        <ul class="booth__works">
          ${works.map(w => `
            <li><button type="button" data-id="${w.id}" aria-label="放大檢視《${w.title}》">
              <img src="${w.image}" alt="" loading="lazy" width="1024" height="1024" style="object-position:${w.focus}">
              <span>${w.title}</span>
            </button></li>`).join('')}
        </ul>
      </div>`;
    track.appendChild(booth);

    // 點展區小圖 → 用同一個 Lightbox，只在這位角色的作品間切換
    booth.querySelectorAll('button[data-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('gallery:open', {
          detail: { id: btn.dataset.id, list: works.map(w => w.id), trigger: btn }
        }));
      });
    });
  });

  /* ---------- 釘住＋水平移動 ---------- */
  const desktop = window.matchMedia('(min-width: 900px)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let distance = 0;

  function size() {
    if (!desktop.matches || reduceMotion.matches) {
      pin.classList.remove('is-pinned');
      pin.style.height = '';
      track.style.transform = '';
      return;
    }
    pin.classList.add('is-pinned');
    distance = Math.max(0, track.scrollWidth - pin.clientWidth);
    // 釘住區塊的總高度 = 一個畫面高 + 要水平移動的距離
    pin.style.height = (window.innerHeight + distance) + 'px';
    update();
  }

  function update() {
    if (!pin.classList.contains('is-pinned')) return;
    const rect = pin.getBoundingClientRect();
    const total = pin.offsetHeight - window.innerHeight;
    const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
    track.style.transform = `translate3d(${(-p * distance).toFixed(1)}px, 0, 0)`;
    track.style.setProperty('--p', p.toFixed(3));
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; update(); });
  }, { passive: true });
  window.addEventListener('resize', size);
  window.addEventListener('load', size);
  desktop.addEventListener('change', size);
  size();
})();
