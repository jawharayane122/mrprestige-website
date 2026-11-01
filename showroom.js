// ===== SHOWROOM : la flotte présentée comme une vitrine =====
// Logique pure (sans DOM) ; le rendu de la vitrine est ajouté plus bas.
(function (root) {
  const CAT_ORDER = ['berline', 'suv', 'sportive', 'cabriolet', 'van', 'citadine'];

  // « G CLASS » → « G Class », « rolls-royce » → « Rolls-Royce »
  function titleCase(s) {
    return String(s || '').trim().replace(/\s+/g, ' ').toLowerCase()
      .replace(/(^|[\s-])(\p{L})/gu, (_, sep, ch) => sep + ch.toUpperCase());
  }

  // Une seule forme de véhicule, quelle que soit la source (fleet.json, Supabase, HTML)
  function normalize(v) {
    const brand = titleCase(v.brand);
    const model = brand ? titleCase(v.model) : titleCase(v.label || v.model);
    return {
      brand,
      model,
      name: [brand, model].filter(Boolean).join(' '),
      year: v.year || '',
      cat: String(v.cat || 'berline').toLowerCase(),
      price: Number(v.price) || 0,
      img: v.img || '',
    };
  }

  function categories(list) {
    const present = new Set(list.map(v => v.cat));
    return CAT_ORDER.filter(c => present.has(c)).concat([...present].filter(c => !CAT_ORDER.includes(c)));
  }

  const LOCALES = { fr: 'fr-FR', en: 'en-GB', ar: 'ar', ru: 'ru-RU', zh: 'zh-CN' };
  function formatPrice(n, lang) {
    if (!n) return '';
    return new Intl.NumberFormat(LOCALES[lang] || 'fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
  }

  root.Showroom = Object.assign(root.Showroom || {}, { titleCase, normalize, categories, formatPrice });
})(typeof globalThis !== 'undefined' ? globalThis : window);

// ===== Vitrine =====
(function () {
  if (typeof document === 'undefined') return;

  const CAT_KEYS = { berline: 'f_berline', suv: 'f_suv', sportive: 'f_sport', van: 'f_van', citadine: 'f_city', cabriolet: 'f_cab' };
  let cars = [], filter = 'all', current = null;

  const $ = (sel, el) => (el || document).querySelector(sel);
  const tr = () => (typeof T !== 'undefined' && T[typeof currentLang !== 'undefined' ? currentLang : 'fr']) || {};
  const lang = () => (typeof currentLang !== 'undefined' ? currentLang : 'fr');
  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function catLabel(c) {
    return tr()[CAT_KEYS[c]] || Showroom.titleCase(c);
  }

  function renderFilters() {
    const box = $('#srFilters');
    const cats = Showroom.categories(cars);
    box.hidden = cats.length < 2;
    box.replaceChildren(...['all'].concat(cats).map(c => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'rn-sr-filter';
      b.dataset.cat = c;
      b.textContent = c === 'all' ? (tr().f_all || 'Tous') : catLabel(c);
      b.setAttribute('aria-pressed', String(c === filter));
      b.addEventListener('click', () => { filter = c; renderFilters(); renderList(); });
      return b;
    }));
  }

  function renderList() {
    const list = $('#srList');
    const shown = cars.filter(v => filter === 'all' || v.cat === filter);
    list.replaceChildren(...shown.map(v => {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'rn-sr-row';
      b.setAttribute('aria-pressed', String(v === current));
      const name = document.createElement('span');
      name.className = 'rn-sr-row-name';
      name.append(v.brand ? v.brand + ' ' : '');
      const em = document.createElement('em');
      em.textContent = v.model;
      name.append(em);
      const price = document.createElement('span');
      price.className = 'rn-sr-row-price';
      price.textContent = Showroom.formatPrice(v.price, lang());
      b.append(name, price);
      b.addEventListener('click', () => select(v, true));
      // Précharge la photo dès que l'intention se précise
      const warm = () => { if (v.img) { const i = new Image(); i.src = v.img; } };
      b.addEventListener('pointerenter', warm, { once: true });
      b.addEventListener('focus', warm, { once: true });
      li.append(b);
      return li;
    }));
    if (!shown.includes(current) && shown[0]) select(shown[0], false);
  }

  function fillCaption(v) {
    const t = tr();
    const title = $('#srName');
    title.replaceChildren(v.brand ? v.brand + ' ' : '');
    const em = document.createElement('em');
    em.textContent = v.model;
    title.append(em);
    $('#srSpecs').textContent = [v.year, catLabel(v.cat), t.car_auto || 'Automatique'].filter(Boolean).join(' · ');
    $('#srPrice').textContent = Showroom.formatPrice(v.price, lang());
    $('#srPer').textContent = t.sr_per_day || '/ jour';
    $('#srPer').hidden = !v.price;
  }

  function swapPhoto(v, animate) {
    const frame = $('#srPhoto');
    const old = frame.querySelector('img');
    const img = document.createElement('img');
    img.alt = v.name;
    img.decoding = 'async';
    img.src = v.img;
    img.addEventListener('error', () => { img.removeAttribute('src'); img.classList.add('is-missing'); }, { once: true });
    if (!animate || !old || reduceMotion()) {
      frame.replaceChildren(img);
      return;
    }
    img.className = 'is-entering';
    frame.append(img);
    const done = () => { if (old.isConnected) old.remove(); img.classList.remove('is-entering'); };
    // Le volet ne part qu'une fois la photo prête, pour ne jamais dévoiler un cadre vide
    (img.decode ? img.decode() : Promise.resolve()).catch(() => {}).then(() => {
      requestAnimationFrame(() => img.classList.add('is-in'));
      img.addEventListener('transitionend', done, { once: true });
      setTimeout(done, 900);
    });
  }

  function select(v, animate) {
    if (!v) return;
    const changed = v !== current;
    current = v;
    const shown = cars.filter(c => filter === 'all' || c.cat === filter);
    document.querySelectorAll('#srList .rn-sr-row').forEach((b, i) => {
      b.setAttribute('aria-pressed', String(shown[i] === v));
    });
    fillCaption(v);
    if (changed) swapPhoto(v, animate);
    if (animate && window.innerWidth < 900) {
      const stage = $('#srStage');
      if (stage.getBoundingClientRect().top < 0) stage.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
    }
  }

  function mount(vehicles) {
    if (!$('#showroom') || !vehicles || !vehicles.length) return;
    cars = vehicles.map(Showroom.normalize).filter(v => v.model);
    if (!cars.length) return;
    const keep = current && cars.find(c => c.name === current.name);
    current = null;
    renderFilters();
    renderList();
    select(keep || cars[0], false);
  }

  // Changement de langue : libellés, catégories et prix suivent
  function relabel() {
    if (!cars.length) return;
    renderFilters();
    renderList();
    if (current) fillCaption(current);
  }

  // Lit la vitrine écrite dans le HTML (premier affichage sans attendre fleet.json)
  function readStatic() {
    return [...document.querySelectorAll('#srList [data-car]')].map(el => JSON.parse(el.dataset.car));
  }

  function init() {
    const ask = $('#srRequest');
    if (ask) ask.addEventListener('click', () => {
      if (current && window.Concierge) Concierge.open({ service: 'vehicle', model: current.name });
    });
    mount(readStatic());
  }

  Object.assign(Showroom, { mount, relabel });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
