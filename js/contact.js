/* =========================================================
   contact.js｜明信片表單（階段 6）
   前端驗證：錯誤時欄位左右晃；送出後蓋上「已寄出」印章。
   這是作業展示用，不會真的寄信。
   ========================================================= */
(function () {
  const form = document.getElementById('postcard');
  if (!form) return;
  const status = document.getElementById('formStatus');

  const rules = {
    message: v => v.trim().length >= 10 || '再多寫幾個字吧，至少 10 個字。',
    name: v => v.trim().length > 0 || '請寫上你的名字。',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Email 格式看起來不對，例如 you@example.com。'
  };

  function check(name, shake) {
    const input = form.elements[name];
    const field = form.querySelector(`[data-field="${name}"]`);
    const result = rules[name](input.value);
    const ok = result === true;
    field.classList.toggle('is-invalid', !ok);
    input.setAttribute('aria-invalid', String(!ok));
    input.setAttribute('aria-describedby', name + '-error');
    document.getElementById(name + '-error').textContent = ok ? '' : result;
    if (!ok && shake) {
      field.classList.remove('is-shake');
      void field.offsetWidth;
      field.classList.add('is-shake');
    }
    return ok;
  }

  Object.keys(rules).forEach(name => {
    form.elements[name].addEventListener('blur', () => { if (form.elements[name].value) check(name, false); });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const results = Object.keys(rules).map(n => check(n, true));
    if (results.includes(false)) {
      const firstBad = Object.keys(rules).find((n, i) => !results[i]);
      form.elements[firstBad].focus();
      status.textContent = '';
      return;
    }
    // 蓋章動畫
    form.classList.remove('is-sent');
    void form.offsetWidth;
    form.classList.add('is-sent');
    status.textContent = `謝謝你，${form.elements.name.value.trim()}！明信片已蓋好郵戳（展示用，未實際寄出）。`;
    form.querySelectorAll('input, textarea').forEach(el => { el.value = ''; });
  });

  /* ---------- 複製 Email ---------- */
  const copyBtn = document.getElementById('copyMail');
  const mail = document.getElementById('mail');
  const copyStatus = document.getElementById('copyStatus');
  if (copyBtn) copyBtn.addEventListener('click', () => {
    const text = mail.textContent;
    const selectText = () => {
      const range = document.createRange();
      range.selectNodeContents(mail);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      copyStatus.textContent = '已選取，按 Ctrl/⌘ + C 複製。';
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => { copyStatus.textContent = '已複製 Email。'; }, selectText);
    } else selectText();
  });
})();
