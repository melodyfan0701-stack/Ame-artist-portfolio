/* =========================================================
   effects.js｜導覽列互動、捲動效果、觸控 hover（階段 5）
   全站共用：每一頁都載入這支。
   ========================================================= */
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nav = document.getElementById('siteNav');

  // 頁尾的設計者名字（在 js/works.js 的 SITE.designer 修改）
  if (typeof SITE !== 'undefined') document.querySelectorAll('[data-designer]').forEach(el => { el.textContent = SITE.designer; });

  /* ---------- 1. 導覽列：捲動後縮小、加底色 ---------- */
  const progress = document.createElement('div');
  progress.className = 'progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);

  function onScroll() {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('is-scrolled', y > 60);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.setProperty('--progress', max > 0 ? (y / max).toFixed(4) : 0);
  }

  /* ---------- 2. 漢堡選單 ---------- */
  if (nav) {
    const toggle = document.createElement('button');
    toggle.className = 'nav-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', '開啟選單');
    toggle.innerHTML = '<span></span>';
    nav.querySelector('.container').appendChild(toggle);

    const setMenu = open => {
      nav.classList.toggle('is-menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? '關閉選單' : '開啟選單');
    };
    toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-menu-open')));
    nav.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  }

  /* ---------- 3. 螢光筆底線：目前所在的頁面或區塊 ---------- */
  const links = nav ? Array.from(nav.querySelectorAll('.nav-links a')) : [];
  const page = document.body.dataset.page;
  if (page) {
    links.forEach(a => { if (a.dataset.page === page || a.dataset.section === page) a.setAttribute('aria-current', 'page'); });
  }
  const sections = links
    .map(a => a.dataset.section && document.getElementById(a.dataset.section))
    .filter(Boolean);
  if (sections.length && !page) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(a => {
          if (a.dataset.section === entry.target.id) a.setAttribute('aria-current', 'location');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => io.observe(s));
  }

  /* ---------- 4. 捲動進場：貼上 / 上移淡入 / 紙膠帶展開 ---------- */
  // Gallery 卡片的內層加上「貼上」效果
  document.querySelectorAll('.card__inner').forEach(el => el.classList.add('reveal-stick'));

  const revealEls = document.querySelectorAll('.reveal-stick, .reveal-up, .section-head .tape');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const ro = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        // 同一批進場的元素，依序延遲一點點
        const siblings = Array.from(el.parentElement.parentElement.querySelectorAll('.is-waiting'));
        const i = Math.max(0, siblings.indexOf(el));
        setTimeout(() => el.classList.remove('is-waiting'), Math.min(i, 4) * 90);
        ro.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealEls.forEach(el => {
      const r = el.getBoundingClientRect();
      // 載入時已經在畫面內的元素不隱藏，首屏保持完整
      if (r.top < window.innerHeight * 0.92) return;
      el.classList.add('is-waiting');
      ro.observe(el);
    });
  }

  /* ---------- 5. 視差貼紙 ---------- */
  const parallaxEls = Array.from(document.querySelectorAll('[data-speed]'));
  const isSmall = window.matchMedia('(max-width: 767px)');
  let bases = [];

  function measure() {
    bases = parallaxEls.map(el => {
      const prev = el.style.getPropertyValue('--py');
      el.style.setProperty('--py', '0px');
      const r = el.getBoundingClientRect();
      el.style.setProperty('--py', prev);
      return r.top + window.scrollY + r.height / 2;
    });
  }

  let ticking = false;
  function parallax() {
    ticking = false;
    if (reduceMotion || isSmall.matches) {
      parallaxEls.forEach(el => el.style.setProperty('--py', '0px'));
      return;
    }
    const center = window.scrollY + window.innerHeight / 2;
    parallaxEls.forEach((el, i) => {
      const speed = parseFloat(el.dataset.speed) || 0.3;
      const py = Math.max(-140, Math.min(140, (center - bases[i]) * speed * -0.35));
      el.style.setProperty('--py', py.toFixed(1) + 'px');
    });
  }

  function requestTick() {
    if (!ticking) { ticking = true; requestAnimationFrame(() => { onScroll(); parallax(); }); }
  }

  measure();
  onScroll();
  parallax();
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', () => { measure(); requestTick(); });
  window.addEventListener('load', () => { measure(); requestTick(); });

  /* ---------- 6. 觸控裝置：第一下顯示 hover 效果，第二下才放大 ---------- */
  let lastPointer = 'mouse';
  document.addEventListener('pointerdown', e => { lastPointer = e.pointerType; }, true);
  document.addEventListener('keydown', () => { lastPointer = 'mouse'; }, true);
  document.addEventListener('click', e => {
    const btn = e.target.closest('.card__sticker');
    if (!btn || lastPointer === 'mouse') return;
    const card = btn.closest('.card');
    if (card.classList.contains('is-touched')) return;   // 第二下：交給 Lightbox
    document.querySelectorAll('.card.is-touched').forEach(c => c.classList.remove('is-touched'));
    card.classList.add('is-touched');
    e.stopPropagation();
    e.preventDefault();
  }, true);
})();
