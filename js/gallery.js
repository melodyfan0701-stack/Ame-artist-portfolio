/* =========================================================
   gallery.js｜作品集：產生卡片、角色篩選動畫（階段 3）

   篩選動畫流程（不可瞬間換圖）：
   1. 要隱藏的作品：淡出＋縮小到 0.8（250ms）
   2. 留下的作品：用 FLIP 平滑移到新位置（400ms）
   3. 新出現的作品：從下方 20px 淡入，每張間隔 60ms，旋轉回自己的角度
   4. 方格紙與紙膠帶換成該角色主題色（CSS @property 漸變 0.6s）

   FLIP = First, Last, Invert, Play
   First：記下元素「變動前」的位置
   Last：讓版面直接變成最後的樣子，再量一次位置
   Invert：用 transform 把元素「推回」原本的位置（看起來沒動）
   Play：把 transform 動畫回 0，元素就從舊位置滑到新位置
   好處是只動 transform，不觸發重新排版，動畫很順。
   ========================================================= */
(function () {
  const grid = document.getElementById('gallery');
  const tabs = document.querySelectorAll('.tab[data-filter]');
  const countEl = document.getElementById('galleryCount');
  if (!grid) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const TILTS = [-2.4, 1.8, -1.2, 2.6, -2, 1.2, 2.2, -1.6, 0.9];  // 固定的「隨機」角度，每次載入都一樣
  let current = 'all';
  let busy = false;

  /* ---------- 1. 產生卡片 ---------- */
  WORKS.forEach((w, i) => {
    const c = CHARACTERS[w.character];
    const card = document.createElement('article');
    card.className = 'card';
    card.dataset.id = w.id;
    card.dataset.char = w.character;
    card.dataset.aspect = w.aspect;
    card.dataset.tilt = TILTS[i % TILTS.length];
    card.style.setProperty('--tilt', TILTS[i % TILTS.length] + 'deg');
    card.style.setProperty('--card-main', c.main);
    card.style.setProperty('--card-accent', c.accent);
    card.innerHTML = `
      <div class="card__inner">
        <button class="card__sticker" type="button" aria-label="放大檢視《${w.title}》">
          <span class="tape" aria-hidden="true"></span>
          <img src="${w.image}" alt="${c.short}《${w.title}》" width="1024" height="1024" loading="lazy" style="object-position:${w.focus}">
          <span class="card__peel" aria-hidden="true"></span>
          <span class="card__note" aria-hidden="true"><span class="script">${c.short}</span> 的手帳 · 點我放大</span>
        </button>
        <div class="card__caption">
          <div class="card__title-row">
            <h3 class="card__title"><a href="${workUrl(w.id)}">${w.title}</a></h3>
            <span class="card__year">${w.year}</span>
          </div>
          <div class="card__meta"><span class="chip">${c.short}</span></div>
          <p class="card__desc">${w.description}</p>
        </div>
      </div>`;
    grid.appendChild(card);
  });

  // 每個分類的作品數量
  tabs.forEach(t => {
    const f = t.dataset.filter;
    const n = f === 'all' ? WORKS.length : WORKS.filter(w => w.character === f).length;
    const span = t.querySelector('.count');
    if (span) span.textContent = n;
  });

  const cards = () => Array.from(grid.querySelectorAll('.card'));

  /* ---------- 瀑布流：依每張卡片的高度算出要跨幾列 ---------- */
  function layout() {
    const cs = getComputedStyle(grid);
    const row = parseFloat(cs.gridAutoRows) || 4;
    const gapY = parseFloat(cs.getPropertyValue('--gap-y')) || 32;
    cards().forEach(card => {
      if (card.hidden) return;
      const h = card.firstElementChild.offsetHeight;   // offsetHeight 不受 transform 影響
      card.style.setProperty('--span', Math.ceil((h + gapY) / row));
    });
  }
  layout();
  grid.querySelectorAll('img').forEach(img => img.complete || img.addEventListener('load', layout, { once: true }));
  new ResizeObserver(layout).observe(grid);
  document.fonts && document.fonts.ready.then(layout);
  const matches = (card, f) => f === 'all' || card.dataset.char === f;
  const wait = ms => new Promise(r => setTimeout(r, reduceMotion.matches ? 0 : ms));

  function updateCount() {
    const n = cards().filter(c => !c.hidden).length;
    if (countEl) countEl.textContent = n + ' works';
  }
  updateCount();

  /* ---------- 2. 篩選 ---------- */
  async function applyFilter(filter) {
    if (busy || filter === current) return;
    busy = true;
    current = filter;

    // 主題色：在 <html> 設 data-char，CSS 會把 --theme-main 漸變過去
    if (filter === 'all') delete document.documentElement.dataset.char;
    else document.documentElement.dataset.char = filter;

    const all = cards();
    const leaving = all.filter(c => !c.hidden && !matches(c, filter));
    const staying = all.filter(c => !c.hidden && matches(c, filter));
    const entering = all.filter(c => c.hidden && matches(c, filter));

    // ① 淡出＋縮小
    leaving.forEach(c => c.animate(
      [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(.8)' }],
      { duration: reduceMotion.matches ? 0 : 250, easing: 'ease-in', fill: 'forwards' }
    ));
    await wait(250);

    // ② FLIP：First
    const first = new Map(staying.map(c => [c, c.getBoundingClientRect()]));

    // Last：直接換成最後的版面
    leaving.forEach(c => { c.hidden = true; c.getAnimations().forEach(a => a.cancel()); });
    entering.forEach(c => { c.hidden = false; });
    layout();

    // Invert + Play
    if (!reduceMotion.matches) {
      staying.forEach(c => {
        const a = first.get(c);
        const b = c.getBoundingClientRect();
        const dx = a.left - b.left;
        const dy = a.top - b.top;
        if (dx || dy) {
          c.animate(
            [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0, 0)' }],
            { duration: 400, easing: 'cubic-bezier(.2,.7,.2,1)' }
          );
        }
      });

      // ③ 新作品從下方淡入，每張間隔 60ms，旋轉回原本的角度
      entering.forEach((c, i) => {
        c.animate(
          [
            { opacity: 0, transform: 'translateY(20px) rotate(-6deg) scale(.92)' },
            { opacity: 1, transform: 'translateY(0) rotate(0) scale(1)' }
          ],
          { duration: 450, delay: 120 + i * 60, easing: 'cubic-bezier(.34,1.4,.64,1)', fill: 'backwards' }
        );
      });
    }

    updateCount();
    grid.dispatchEvent(new CustomEvent('gallery:filtered', { bubbles: true, detail: { filter } }));
    await wait(400 + entering.length * 60);
    busy = false;
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.setAttribute('aria-pressed', String(t === tab)));
      tab.classList.remove('is-bounce');
      void tab.offsetWidth;            // 重新觸發 animation
      tab.classList.add('is-bounce');
      applyFilter(tab.dataset.filter);
    });
  });

  /* ---------- 3. 點擊作品：通知 Lightbox（階段 4） ---------- */
  grid.addEventListener('click', e => {
    const btn = e.target.closest('.card__sticker');
    if (!btn) return;
    const card = btn.closest('.card');
    const list = cards().filter(c => !c.hidden).map(c => c.dataset.id);
    grid.dispatchEvent(new CustomEvent('gallery:open', {
      bubbles: true,
      detail: { id: card.dataset.id, list, trigger: btn }
    }));
  });

  // 「全螢幕瀏覽」按鈕：從目前分類的第一張開始
  const fsBtn = document.getElementById('fsAll');
  if (fsBtn) fsBtn.addEventListener('click', () => {
    if (window.FullscreenGallery) window.FullscreenGallery.open(window.Gallery.visibleIds(), 0);
  });

  // 給其他模組使用：目前顯示中的作品 id
  window.Gallery = {
    visibleIds: () => cards().filter(c => !c.hidden).map(c => c.dataset.id)
  };
})();
