// ===== CONCIERGE : demande de disponibilité via WhatsApp =====
// Logique pure (sans DOM) ; le câblage de la modale est ajouté plus bas.
(function (root) {
  const WA_NUMBER = '33651032530';

  // [salutation, ligne service, "du … au …", "personnes"]
  const PHRASES = {
    fr: { hello: 'Bonjour MR PRESTIGE, je souhaite connaître la disponibilité', for: 'pour', from: 'du', to: 'au', guests: 'personne(s)', note: 'Remarque' },
    en: { hello: 'Hello MR PRESTIGE, I would like to check availability', for: 'for', from: 'from', to: 'to', guests: 'guest(s)', note: 'Note' },
    ar: { hello: 'مرحباً MR PRESTIGE، أود الاستفسار عن التوفر', for: 'لـ', from: 'من', to: 'إلى', guests: 'أشخاص', note: 'ملاحظة' },
    ru: { hello: 'Здравствуйте, MR PRESTIGE! Хочу узнать о наличии', for: 'для', from: 'с', to: 'по', guests: 'чел.', note: 'Примечание' },
    zh: { hello: '您好 MR PRESTIGE，我想咨询是否有空档', for: '关于', from: '从', to: '至', guests: '人', note: '备注' },
  };

  const SERVICES = {
    fr: { vehicle: 'une location de véhicule', yacht: 'un charter de yacht', transfer: 'un transfert', driver: 'un chauffeur privé', property: 'une location immobilière' },
    en: { vehicle: 'a vehicle rental', yacht: 'a yacht charter', transfer: 'a transfer', driver: 'a private driver', property: 'a property rental' },
    ar: { vehicle: 'تأجير سيارة', yacht: 'استئجار يخت', transfer: 'خدمة نقل', driver: 'سائق خاص', property: 'تأجير عقار' },
    ru: { vehicle: 'аренды автомобиля', yacht: 'чартера яхты', transfer: 'трансфера', driver: 'личного водителя', property: 'аренды недвижимости' },
    zh: { vehicle: '租车', yacht: '游艇租赁', transfer: '接送服务', driver: '私人司机', property: '房产租赁' },
  };

  function buildWhatsAppUrl(req, lang) {
    const l = PHRASES[lang] ? lang : 'fr';
    const p = PHRASES[l];
    const svc = (SERVICES[l][req.service]) || req.service || '';
    const parts = [`${p.hello} ${p.for} ${svc}${req.model ? ' : ' + req.model : ''}.`];
    if (req.start && req.end) parts.push(`${p.from} ${req.start} ${p.to} ${req.end}.`);
    if (req.guests) parts.push(`${req.guests} ${p.guests}.`);
    if (req.note) parts.push(`${p.note} : ${req.note}`);
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(parts.join('\n'))}`;
  }

  // Date locale (et non UTC) au format des champs <input type="date">
  function todayISO(d) {
    d = d || new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function validateDates(start, end, today) {
    if (!start || !end) return { ok: false, reason: 'missing' };
    if (start < (today || todayISO())) return { ok: false, reason: 'past' };
    if (end < start) return { ok: false, reason: 'order' };
    return { ok: true };
  }

  root.Concierge = Object.assign(root.Concierge || {}, { WA_NUMBER, buildWhatsAppUrl, validateDates, todayISO });
})(typeof globalThis !== 'undefined' ? globalThis : window);

// ===== Modale : 3 étapes =====
(function () {
  if (typeof document === 'undefined') return;

  const SVC_KEYS = ['vehicle', 'yacht', 'transfer', 'driver', 'property'];
  let state, step, lastFocus;

  const $ = (id) => document.getElementById(id);
  const tr = () => (typeof T !== 'undefined' && T[typeof currentLang !== 'undefined' ? currentLang : 'fr']) || {};
  const lang = () => (typeof currentLang !== 'undefined' ? currentLang : 'fr');

  function show(n) {
    step = n;
    document.querySelectorAll('#conciergeModal .cc-step').forEach(s => { s.hidden = Number(s.dataset.step) !== n; });
    document.querySelectorAll('.cc-progress i').forEach((i, idx) => i.classList.toggle('on', idx < n));
    $('ccBack').hidden = n === 1;
    $('ccNext').hidden = n === 3 || n === 1;
    $('ccNext').dataset.i18n = 'cc_next';
    if (n === 3) renderSummary();
  }

  function readForm() {
    state.model = $('ccModel').value.trim();
    state.start = $('ccStart').value;
    state.end = $('ccEnd').value;
    state.guests = Number($('ccGuests').value) || undefined;
    state.note = $('ccNote').value.trim();
  }

  function renderSummary() {
    const t = tr();
    const rows = [
      [t['cc_svc_' + state.service] || state.service, state.model],
      [`${t.cc_start || 'Du'} → ${t.cc_end || 'Au'}`, `${state.start} → ${state.end}`],
      [t.cc_guests || 'Personnes', state.guests],
      [t.cc_note || 'Remarque', state.note],
    ].filter(r => r[1]);
    const ul = $('ccSummary');
    ul.replaceChildren(...rows.map(([k, v]) => {
      const li = document.createElement('li');
      const b = document.createElement('b'); b.textContent = k;
      li.append(b, document.createTextNode(String(v)));
      return li;
    }));
    $('ccSend').href = Concierge.buildWhatsAppUrl(state, lang());
  }

  function next() {
    if (step !== 2) return;
    readForm();
    const v = Concierge.validateDates(state.start, state.end);
    const err = $('ccError');
    if (!v.ok) {
      err.textContent = tr()['cc_err_' + v.reason] || '';
      err.hidden = false;
      return;
    }
    err.hidden = true;
    show(3);
  }

  function close() {
    $('conciergeModal').hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function open(opts) {
    opts = opts || {};
    lastFocus = document.activeElement;
    state = { service: opts.service || '', model: opts.model || '' };
    $('ccModel').value = state.model;
    $('ccStart').value = opts.start || '';
    $('ccEnd').value = opts.end || '';
    $('ccNote').value = '';
    $('ccStart').min = $('ccEnd').min = Concierge.todayISO();
    $('ccGuests').value = 2;
    $('ccError').hidden = true;
    $('conciergeModal').hidden = false;
    document.body.style.overflow = 'hidden';
    show(opts.service ? 2 : 1);
    // Dates déjà saisies dans la barre d'accueil : on enchaîne sur le modèle
    const first = !opts.service ? document.querySelector('.cc-services button') : (opts.start ? $('ccModel') : $('ccStart'));
    if (first) first.focus();
  }

  function init() {
    document.querySelectorAll('.cc-services button').forEach(b => {
      b.addEventListener('click', () => { state.service = b.dataset.svc; show(2); $('ccModel').focus(); });
    });
    $('ccNext').addEventListener('click', next);
    $('ccBack').addEventListener('click', () => show(Math.max(1, step - 1)));
    $('ccClose').addEventListener('click', close);
    $('conciergeModal').addEventListener('click', (e) => { if (e.target.id === 'conciergeModal') close(); });
    document.addEventListener('keydown', (e) => {
      if ($('conciergeModal').hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'Enter' && step === 2 && e.target.tagName !== 'TEXTAREA') { e.preventDefault(); next(); }
      if (e.key === 'Tab') { // focus piégé dans la modale
        const f = [...$('conciergeModal').querySelectorAll('button:not([hidden]), input, textarea, a[href]')].filter(el => !el.closest('[hidden]'));
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    // Les liens « Réserver » / « Demander un devis » ouvrent la modale, pas l'ancre #contact
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a.btn-reserve, a.ycard-btn-primary, a.btn-nav');
      if (!a) return;
      e.preventDefault();
      if (a.classList.contains('btn-nav')) open();
    });
    $('ccNext').hidden = true;
  }

  Object.assign(Concierge, { open, close });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
