/* =========================================================
   lightbox.js｜Lightbox 燈箱＋全螢幕畫廊（階段 4）

   使用方式：任何頁面只要發出 'gallery:open' 事件就能打開燈箱
     detail: { id: 作品 id, list: [可切換的作品 id], trigger: 被點的元素 }

   Lightbox 動畫 Timeline：
   ① 縮圖 scale 1→1.05（150ms）
   ② 遮罩 opacity 0→1（300ms），顏色是該角色的格紋
   ③ 大圖 scale 0.9→1（350ms）
   ========================================================= */
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const byId = id => WORKS.find(w => w.id === id);

  const ICON = {
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>',
    prev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    full: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  /* ---------- 建立 Lightbox DOM ---------- */
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-labelledby', 'lbTitle');
  lb.innerHTML = `
    <div class="lightbox__backdrop" data-close></div>
    <button class="round-btn lightbox__close" type="button" aria-label="關閉" data-close>${ICON.close}</button>
    <button class="round-btn lightbox__prev" type="button" aria-label="上一張">${ICON.prev}</button>
    <button class="round-btn lightbox__next" type="button" aria-label="下一張">${ICON.next}</button>
    <div class="lightbox__panel">
      <figure class="lightbox__figure sticker">
        <span class="tape" aria-hidden="true"></span>
        <img alt="" width="1024" height="1024">
      </figure>
      <aside class="lightbox__note note">
        <div class="who"><span class="dot-sticker" aria-hidden="true"><img alt=""></span><span class="who-name"></span></div>
        <h2 id="lbTitle"></h2>
        <span class="year"></span>
        <p class="desc"></p>
        <span class="counter"></span>
        <div class="lightbox__actions">
          <a class="btn-sticker detail-link" href="#">查看作品詳情 →</a>
          <button class="btn-ghost fs-open" type="button">${ICON.full.replace('<svg', '<svg width="18" height="18"')} 全螢幕</button>
        </div>
      </aside>
    </div>`;
  document.body.appendChild(lb);

  const $ = s => lb.querySelector(s);
  const els = {
    panel: $('.lightbox__panel'),
    figure: $('.lightbox__figure'),
    img: $('.lightbox__figure img'),
    face: $('.who img'),
    who: $('.who-name'),
    title: $('#lbTitle'),
    year: $('.year'),
    desc: $('.desc'),
    counter: $('.counter'),
    link: $('.detail-link')
  };

  let list = [];
  let index = 0;
  let trigger = null;
  let isOpen = false;

  function fill(work) {
    const c = CHARACTERS[work.character];
    lb.style.setProperty('--lb-main', c.main);
    lb.style.setProperty('--lb-accent', c.accent);
    els.img.src = work.image;
    els.img.alt = `${c.short}《${work.title}》`;
    els.face.src = c.face;
    els.who.textContent = c.name;
    els.title.textContent = work.title;
    els.year.textContent = work.year;
    els.desc.textContent = work.description;
    els.counter.textContent = `${index + 1} / ${list.length}`;
    els.link.href = workUrl(work.id);
  }

  function open(id, ids, from) {
    list = ids && ids.length ? ids : WORKS.map(w => w.id);
    index = Math.max(0, list.indexOf(id));
    trigger = from || null;
    fill(byId(list[index]));

    // ① 縮圖先放大一點，150ms 後再打開燈箱
    const delay = trigger && !reduceMotion.matches ? 150 : 0;
    if (trigger) trigger.classList.add('is-picked');
    setTimeout(() => {
      isOpen = true;
      document.body.classList.add('is-locked');
      lb.classList.add('is-open');            // ② 遮罩淡入，③ 大圖 0.9→1（CSS）
      $('.lightbox__close').focus({ preventScroll: true });
      if (trigger) setTimeout(() => trigger.classList.remove('is-picked'), 300);
    }, delay);
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    lb.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    if (trigger) trigger.focus({ preventScroll: true });   // 焦點回到原本的卡片
  }

  // 切換上一張 / 下一張：只在目前篩選的分類內循環
  function go(step) {
    if (list.length < 2) return;
    index = (index + step + list.length) % list.length;
    const work = byId(list[index]);
    if (reduceMotion.matches) return fill(work);
    const out = [{ opacity: 1, transform: 'translateX(0)' }, { opacity: 0, transform: `translateX(${-step * 40}px)` }];
    const inn = [{ opacity: 0, transform: `translateX(${step * 40}px)` }, { opacity: 1, transform: 'translateX(0)' }];
    els.panel.animate(out, { duration: 160, easing: 'ease-in' }).onfinish = () => {
      fill(work);
      els.panel.animate(inn, { duration: 260, easing: 'cubic-bezier(.2,.7,.2,1)' });
    };
  }

  lb.addEventListener('click', e => {
    if (e.target.closest('[data-close]')) close();
  });
  $('.lightbox__prev').addEventListener('click', () => go(-1));
  $('.lightbox__next').addEventListener('click', () => go(1));
  $('.fs-open').addEventListener('click', () => FS.open(list, index));

  document.addEventListener('gallery:open', e => open(e.detail.id, e.detail.list, e.detail.trigger));

  /* ---------------------------------------------------------
     全螢幕畫廊
     --------------------------------------------------------- */
  const fs = document.createElement('div');
  fs.className = 'fs';
  fs.setAttribute('role', 'dialog');
  fs.setAttribute('aria-modal', 'true');
  fs.setAttribute('aria-label', '全螢幕畫廊');
  fs.innerHTML = `
    <div class="fs__stage"><img class="fs__img" alt=""></div>
    <div class="fs__caption"><span class="script"></span><span class="fs__title"></span></div>
    <span class="fs__hint">← → 切換 · Esc 離開</span>
    <div class="fs__bar">
      <button class="round-btn" type="button" data-step="-1" aria-label="上一張">${ICON.prev}</button>
      <span class="fs__count" aria-live="polite"></span>
      <button class="round-btn" type="button" data-step="1" aria-label="下一張">${ICON.next}</button>
      <button class="round-btn" type="button" data-exit aria-label="離開全螢幕">${ICON.close}</button>
    </div>`;
  document.body.appendChild(fs);

  const fsImg = fs.querySelector('.fs__img');
  let fsList = [];
  let fsIndex = 0;
  let fsOpen = false;
  let fsBusy = false;
  let idleTimer = 0;

  function fsFill() {
    const w = byId(fsList[fsIndex]);
    const c = CHARACTERS[w.character];
    fsImg.src = w.image;
    fsImg.alt = `${c.short}《${w.title}》`;
    fs.querySelector('.fs__caption .script').textContent = c.short;
    fs.querySelector('.fs__title').textContent = `《${w.title}》 ${w.year}`;
    fs.querySelector('.fs__count').textContent = `${fsIndex + 1} / ${fsList.length}`;
  }

  // 滑鼠移動 → 顯示控制列；靜止 2 秒 → 淡出
  function wake() {
    fs.classList.remove('is-idle');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => fs.classList.add('is-idle'), 2000);
  }

  // 換圖轉場：像翻手帳一頁（rotateY）
  async function fsGo(step) {
    if (fsBusy || fsList.length < 2) return;
    fsBusy = true;
    fsIndex = (fsIndex + step + fsList.length) % fsList.length;
    if (!reduceMotion.matches) {
      await fsImg.animate(
        [{ transform: 'rotateY(0) translateX(0)', opacity: 1 }, { transform: `rotateY(${step * -75}deg) translateX(${step * -60}px)`, opacity: 0 }],
        { duration: 220, easing: 'ease-in', fill: 'forwards' }
      ).finished;
    }
    fsFill();
    try { await fsImg.decode(); } catch (e) { /* 圖片尚未載入也照常切換 */ }
    fsImg.getAnimations().forEach(a => a.cancel());
    if (!reduceMotion.matches) {
      await fsImg.animate(
        [{ transform: `rotateY(${step * 75}deg) translateX(${step * 60}px)`, opacity: 0 }, { transform: 'rotateY(0) translateX(0)', opacity: 1 }],
        { duration: 340, easing: 'cubic-bezier(.2,.7,.2,1)' }
      ).finished;
    }
    fsBusy = false;
  }

  function fsStart(ids, at) {
    fsList = ids && ids.length ? ids : WORKS.map(w => w.id);
    fsIndex = at || 0;
    fsFill();
    fsOpen = true;
    fs.classList.add('is-open');
    document.body.classList.add('is-locked');
    wake();
    fs.querySelector('[data-exit]').focus({ preventScroll: true });
    // 真正的瀏覽器全螢幕；不支援或被拒絕時，仍以鋪滿視窗的模式瀏覽
    if (fs.requestFullscreen) fs.requestFullscreen().catch(() => {});
  }

  function fsClose() {
    if (!fsOpen) return;
    fsOpen = false;
    fs.classList.remove('is-open');
    clearTimeout(idleTimer);
    if (!isOpen) document.body.classList.remove('is-locked');
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    // 從 Lightbox 進來的話，回到 Lightbox 時顯示同一張
    if (isOpen && fsList === list) { index = fsIndex; fill(byId(list[index])); }
  }

  fs.addEventListener('mousemove', wake);
  fs.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) return fsGo(Number(step.dataset.step));
    if (e.target.closest('[data-exit]')) return fsClose();
    wake();
  });
  // 按 Esc 時瀏覽器會先退出原生全螢幕，這裡一起關掉畫廊
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && fsOpen) fsClose();
  });

  // 手機：左右滑動切換
  let startX = null;
  fs.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') startX = e.clientX; });
  fs.addEventListener('pointerup', e => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 50) fsGo(dx < 0 ? 1 : -1);
    else wake();
  });

  const FS = { open: fsStart, close: fsClose };
  window.FullscreenGallery = FS;

  /* ---------- 鍵盤 ---------- */
  document.addEventListener('keydown', e => {
    if (fsOpen) {
      if (e.key === 'ArrowLeft') fsGo(-1);
      else if (e.key === 'ArrowRight') fsGo(1);
      else if (e.key === 'Escape') fsClose();
      else return;
      e.preventDefault();
      wake();
      return;
    }
    if (!isOpen) return;
    if (e.key === 'ArrowLeft') go(-1);
    else if (e.key === 'ArrowRight') go(1);
    else if (e.key === 'Escape') close();
    else if (e.key === 'Tab') {
      // 焦點留在燈箱裡
      const f = Array.from(lb.querySelectorAll('button, a[href]'));
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
      return;
    } else return;
    e.preventDefault();
  });
})();
