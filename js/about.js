/* =========================================================
   about.js｜角色名片（階段 6）
   名片在 hover、鍵盤聚焦或點擊時翻面（rotateY 180deg）
   ========================================================= */
(function () {
  const list = document.getElementById('charCards');
  if (!list) return;

  Object.entries(CHARACTERS).forEach(([key, c]) => {
    const first = WORKS.find(w => w.character === key);
    const count = WORKS.filter(w => w.character === key).length;
    const li = document.createElement('li');
    li.className = 'flip reveal-up';
    li.style.setProperty('--c-main', c.main);
    li.style.setProperty('--c-accent', c.accent);
    li.innerHTML = `
      <button class="flip__btn" type="button" aria-pressed="false" aria-label="${c.name}的名片，按下翻面">
        <span class="flip__inner">
          <span class="flip__face flip__face--front">
            <span class="dot-sticker"><img src="${c.face}" alt=""></span>
            <h3>${c.name}</h3>
            <span class="script">${count} works · ${c.palette}</span>
          </span>
          <span class="flip__face flip__face--back">
            <h3>${c.name}</h3>
            <span class="swatches"><span class="swatch" style="background:${c.main}"></span><span class="swatch" style="background:${c.accent}"></span></span>
            <p>${c.motto}${c.bio}</p>
            <span class="flip__hint">代表作《${first.title}》</span>
          </span>
        </span>
      </button>
      <a class="btn-ghost" href="${workUrl(first.id)}" style="margin-top:12px">看她的作品 →</a>`;
    list.appendChild(li);
  });

  // 觸控與鍵盤：點一下翻面，再點一下翻回來
  list.addEventListener('click', e => {
    const btn = e.target.closest('.flip__btn');
    if (!btn) return;
    btn.setAttribute('aria-pressed', String(btn.getAttribute('aria-pressed') !== 'true'));
  });
})();
