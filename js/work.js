/* =========================================================
   work.js｜作品詳細頁（階段 6）
   網址：work.html?id=midori-01（也接受 work.html#midori-01）
   ========================================================= */
(function () {
  const params = new URLSearchParams(location.search);
  const wanted = params.get('id') || decodeURIComponent(location.hash.slice(1));
  const work = WORKS.find(w => w.id === wanted) || WORKS[0];
  const c = CHARACTERS[work.character];
  const $ = id => document.getElementById(id);

  // 整頁換成這位角色的主題色
  document.documentElement.dataset.char = work.character;
  document.title = `${work.title}｜Ame 雨音 貼紙手帳`;

  /* ---------- 填入內容 ---------- */
  $('dHeroImg').src = work.image;
  // 橫幅只露出上半部，對焦在臉附近
  $('dHeroImg').style.objectPosition = work.focus.split(' ')[0] + ' 22%';
  $('dTitle').textContent = work.title;
  $('dYear').textContent = work.year;
  $('dChar').textContent = c.name;
  $('dFace').src = c.face;
  $('dDesc').textContent = work.description;
  $('dConcept').textContent = work.concept;
  $('dImg').src = work.image;
  $('dImg').alt = `${c.short}《${work.title}》`;
  if (work.prompt) {
    $('dPrompt').textContent = work.prompt;
    $('dPromptBox').hidden = false;
  }

  /* ---------- 更多圖片：同角色的其他作品，不足 4 張再補其他女孩 ---------- */
  const same = WORKS.filter(w => w.character === work.character && w.id !== work.id);
  const others = WORKS.filter(w => w.character !== work.character);
  const more = same.concat(others).slice(0, 4);
  $('dMore').innerHTML = more.map(w => `
    <li><button type="button" data-id="${w.id}" aria-label="放大檢視《${w.title}》">
      <img src="${w.image}" alt="" loading="lazy" width="1024" height="1024" style="object-position:${w.focus}">
      <span>${w.title}</span>
      <span class="who">${CHARACTERS[w.character].short}</span>
    </button></li>`).join('');

  // 點「更多圖片」或右頁大圖 → 用 Lightbox 瀏覽（這一頁＋更多圖片）
  const lbList = [work.id].concat(more.map(w => w.id));
  $('dMore').addEventListener('click', e => {
    const btn = e.target.closest('button[data-id]');
    if (!btn) return;
    document.dispatchEvent(new CustomEvent('gallery:open', { detail: { id: btn.dataset.id, list: lbList, trigger: btn } }));
  });
  $('dZoom').addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('gallery:open', { detail: { id: work.id, list: lbList, trigger: $('dZoom') } }));
  });

  /* ---------- 上一件 / 下一件 ---------- */
  const i = WORKS.indexOf(work);
  const prev = WORKS[(i - 1 + WORKS.length) % WORKS.length];
  const next = WORKS[(i + 1) % WORKS.length];
  $('dPrev').href = workUrl(prev.id);
  $('dPrev').querySelector('strong').textContent = prev.title;
  $('dNext').href = workUrl(next.id);
  $('dNext').querySelector('strong').textContent = next.title;

  /* ---------- Hero 視差：圖片移動速度比頁面慢 ---------- */
  const heroImg = $('dHeroImg');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) {
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = Math.min(window.scrollY, window.innerHeight);
      heroImg.style.setProperty('--py', (y * 0.4).toFixed(1) + 'px');
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }
})();
