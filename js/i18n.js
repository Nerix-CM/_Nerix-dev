// Локализация RU/EN. Выбор хранится в localStorage (работает и на GitHub Pages).
(() => {
  const KEY = window.SITE_CONFIG.storageKey;
  const T = {
    ru: { title: '_Nerix', hint: 'Привет! Сайт в разработке', brand: 'Перезагрузить сайт', langLabel: 'Язык' },
    en: { title: '_Nerix', hint: 'Hi! This site is under construction', brand: 'Reload site', langLabel: 'Language' }
  };
  const read = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
  const save = l => { try { localStorage.setItem(KEY, l); } catch {} };

  function apply(lang) {
    const t = T[lang];
    document.documentElement.lang = lang;
    document.title = t.title;
    document.querySelectorAll('[data-i18n]').forEach(el => el.textContent = t[el.dataset.i18n]);
    document.querySelectorAll('[data-i18n-label]').forEach(el => el.setAttribute('aria-label', t[el.dataset.i18nLabel]));
    document.querySelectorAll('[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  }

  const saved = read();
  apply(T[saved] ? saved : (navigator.language || '').toLowerCase().startsWith('ru') ? 'ru' : 'en');

  document.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', () => {
    save(b.dataset.lang);
    apply(b.dataset.lang);
  }));
})();
