/* =========================================================
   hero.js｜首頁進場動畫（階段 2）
   做法：CSS 先寫好「進場前」與「進場後」兩種狀態，
   每個元素用 --d 控制自己的延遲；JS 只負責在圖片載好後加上 .is-entered。
   ========================================================= */
(function () {
  const hero = document.querySelector('.hero');
  const nav = document.getElementById('siteNav');
  if (!hero) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function enter() {
    // 兩個 requestAnimationFrame：確保瀏覽器先畫出「進場前」狀態，transition 才會發生
    requestAnimationFrame(() => requestAnimationFrame(() => {
      hero.classList.add('is-entered');
      if (nav) nav.style.setProperty('--d', '1.3s'), nav.classList.add('is-entered');
    }));

    // 捲動指引在 1.6s 出現後開始輕跳
    setTimeout(() => {
      const hint = hero.querySelector('.scroll-hint');
      if (hint) hint.classList.add('is-bouncing');
      if (nav) nav.style.removeProperty('--d');  // 之後導覽列的動畫不要再延遲
    }, reduceMotion ? 0 : 2300);
  }

  // 等主圖載好再開始，避免圖片還沒出現就跑完動畫；最多等 1.2 秒
  const mainImg = hero.querySelector('.hero-main img');
  if (reduceMotion || !mainImg || mainImg.complete) {
    enter();
  } else {
    let started = false;
    const go = () => { if (!started) { started = true; enter(); } };
    mainImg.addEventListener('load', go, { once: true });
    mainImg.addEventListener('error', go, { once: true });
    setTimeout(go, 1200);
  }
})();
