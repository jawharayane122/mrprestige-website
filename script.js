// ===== SUPABASE CONFIG (référence — clé anon publique lecture seule) =====
const SUPABASE_URL  = 'https://hrjgaundrgiukdjlpgxy.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyamdhdW5kcmdpdWtkamxwZ3h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODIyNDMsImV4cCI6MjA4ODY1ODI0M30.j2uqWZsTq91I3Klr60Tj5kYnkgZF3qZWE_KLrgHgke8'; // clé anon publique (lecture seule)

// ===== CHARGEMENT DE LA FLOTTE DYNAMIQUE =====
// Lit fleet.json (généré par le Fleet Manager) et remplace les cartes HTML statiques
async function loadFleetFromSupabase() {
  const grid = document.getElementById('fleetGrid');
  if (!grid) return;

  let vehicles = null;

  // 1. Essayer fleet.json en priorité (généré par l'app FleetRent)
  try {
    const res = await fetch('fleet.json?t=' + Date.now());
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        vehicles = data;
        console.log(`✅ fleet.json chargé — ${vehicles.length} véhicule(s)`);
      }
    }
  } catch (e) {
    console.log('fleet.json non disponible, essai Supabase...');
  }

  // 2. Fallback : essayer l'API Supabase directement
  if (!vehicles) {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/vehicles?published=eq.true&select=id,brand,model,year,cat,img,website_price,website_category,website_label&order=brand.asc`,
        {
          headers: {
            'apikey':        SUPABASE_ANON,
            'Authorization': `Bearer ${SUPABASE_ANON}`,
          }
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          vehicles = data.map(v => ({
            id:    v.id,
            brand: v.brand,
            model: v.model,
            year:  v.year,
            cat:   (v.website_category || v.cat || 'berline').toLowerCase(),
            price: v.website_price || 0,
            img:   v.img || '',
            label: v.website_label || `${v.brand} ${v.model} ${v.year}`,
          }));
          console.log(`✅ Supabase chargé — ${vehicles.length} véhicule(s)`);
        }
      }
    } catch (e) {
      console.log('Supabase non disponible, conservation des cartes statiques.');
    }
  }

  // 3. Si aucune donnée dynamique, garder les cartes HTML statiques
  if (!vehicles || vehicles.length === 0) {
    console.log('Aucune donnée dynamique — utilisation des cartes statiques HTML.');
    return;
  }

  // 4. Construire les cartes dynamiques
  const t = T[currentLang] || T['fr'];
  grid.innerHTML = '';

  vehicles.forEach(v => {
    const cat   = (v.cat || 'berline').toLowerCase();
    const price = v.price || 0;
    const label = v.label || `${v.brand} ${v.model} ${v.year}`;
    const img   = v.img || '';
    const parts = label.split(' ');
    const brand = parts[0] || v.brand || '';
    const modelPart = parts.slice(1).join(' ');

    const card = document.createElement('div');
    card.className = 'car-card';
    card.dataset.cat = cat;
    card.innerHTML = `
      <div class="car-img-wrap">
        <img src="${img}" alt="${label}" loading="lazy"
             onerror="this.style.background='#1a1a1a';this.style.minHeight='200px'">
        <span class="car-badge available">${t.badge_avail || 'Disponible'}</span>
      </div>
      <div class="car-body">
        <div class="car-brand">${brand}</div>
        <div class="car-model">${modelPart}</div>
        <div class="car-specs">
          <span>${v.year || ''}</span><span>•</span>
          <span>${cat.charAt(0).toUpperCase() + cat.slice(1)}</span><span>•</span>
          <span>${t.car_auto || 'Automatique'}</span>
        </div>
        <div class="car-footer">
          <div class="car-price"><span class="gold">${Number(price).toLocaleString('fr-FR')} €</span><small>/jour</small></div>
          <a href="#contact" class="btn-reserve"
             onclick="preselectVehicle('${label.replace(/'/g, "\\'")}')"
          >${t.btn_reserve || 'Réserver'}</a>
        </div>
      </div>`;
    grid.appendChild(card);
  });

  // Ré-appliquer le filtre actif
  const activeFilter = document.querySelector('.filter-btn.active');
  if (activeFilter) activeFilter.click();
}

// ====================================================

const FLAGS = { fr:'🇫🇷', en:'🇬🇧', ar:'🇸🇦', ru:'🇷🇺', zh:'🇨🇳' };
const CODES = { fr:'FR', en:'EN', ar:'AR', ru:'RU', zh:'ZH' };

// Map data-i18n key → DOM element(s)
const I18N_MAP = () => [

  // Nav
  ['nav_services', ...document.querySelectorAll('[data-i18n="nav_services"]')],
  ['nav_fleet',    ...document.querySelectorAll('[data-i18n="nav_fleet"]')],
  ['nav_transfers',...document.querySelectorAll('[data-i18n="nav_transfers"]')],
  ['nav_book',     ...document.querySelectorAll('[data-i18n="nav_book"]')],
  // Hero
  ['hero_tagline', document.querySelector('.hero-tagline')],
  ['hero_title',   document.querySelector('.hero-title')],        // innerHTML
  ['hero_sub',     document.querySelector('.hero-sub')],
  ['hero_btn1',    document.querySelector('.hero-btns .btn-primary')],
  ['hero_btn2',    document.querySelector('.hero-btns .btn-secondary')],
  // Stats
  ['stat_vehicles', document.querySelector('.stat-item:nth-child(1) .stat-label')],
  ['stat_services', document.querySelector('.stat-item:nth-child(3) .stat-label')],
  ['stat_avail',    document.querySelector('.stat-item:nth-child(5) .stat-label')],
  ['stat_sat',      document.querySelector('.stat-item:nth-child(7) .stat-label')],
  // Services section
  ['sec_services_tag',   document.querySelector('#services .section-tag')],
  ['sec_services_title', document.querySelector('#services .section-title')],
  // Service cards (title, desc, link)
  ['svc1_title', document.querySelector('.service-card:nth-child(1) h3')],
  ['svc1_desc',  document.querySelector('.service-card:nth-child(1) p')],
  ['svc1_link',  document.querySelector('.service-card:nth-child(1) .card-link')],
  ['svc2_title', document.querySelector('.service-card:nth-child(2) h3')],
  ['svc2_desc',  document.querySelector('.service-card:nth-child(2) p')],
  ['svc2_link',  document.querySelector('.service-card:nth-child(2) .card-link')],
  ['svc3_title', document.querySelector('.service-card:nth-child(3) h3')],
  ['svc3_desc',  document.querySelector('.service-card:nth-child(3) p')],
  ['svc3_link',  document.querySelector('.service-card:nth-child(3) .card-link')],
  ['svc4_title', document.querySelector('.service-card:nth-child(4) h3')],
  ['svc4_desc',  document.querySelector('.service-card:nth-child(4) p')],
  ['svc4_link',  document.querySelector('.service-card:nth-child(4) .card-link')],
  ['svc5_title', document.querySelector('.service-card:nth-child(5) h3')],
  ['svc5_desc',  document.querySelector('.service-card:nth-child(5) p')],
  ['svc5_link',  document.querySelector('.service-card:nth-child(5) .card-link')],
  // Fleet
  ['fleet_tag',   document.querySelector('#fleet .section-tag')],
  ['fleet_title', document.querySelector('#fleet .section-title')],
  ['f_all',     document.querySelector('[data-filter="all"]')],
  ['f_berline', document.querySelector('[data-filter="berline"]')],
  ['f_suv',     document.querySelector('[data-filter="suv"]')],
  ['f_sport',   document.querySelector('[data-filter="sportive"]')],
  ['f_van',     document.querySelector('[data-filter="van"]')],
  ['f_city',    document.querySelector('[data-filter="citadine"]')],
  // Fleet reserve buttons
  ['btn_reserve', ...document.querySelectorAll('.btn-reserve')],
  // Fleet badges
  ['badge_avail', ...document.querySelectorAll('.car-badge.available')],
  // Transfers
  ['tr_tag',   document.querySelector('#transfers .section-tag')],
  ['tr_title', document.querySelector('#transfers .section-title')],  // innerHTML
  ['tr_desc',  document.querySelector('.transfers-desc')],
  ['tr1', document.querySelector('.transfers-list li:nth-child(1)')],
  ['tr2', document.querySelector('.transfers-list li:nth-child(2)')],
  ['tr3', document.querySelector('.transfers-list li:nth-child(3)')],
  ['tr4', document.querySelector('.transfers-list li:nth-child(4)')],
  ['tr5', document.querySelector('.transfers-list li:nth-child(5)')],
  ['tr_btn', document.querySelector('.transfers-text .btn-primary')],
  // Why us
  ['why_tag',    document.querySelector('.why-us .section-tag')],
  ['why_title',  document.querySelector('.why-us .section-title')],   // innerHTML
  ['why1_title', document.querySelector('.why-card:nth-child(1) h4')],
  ['why1_desc',  document.querySelector('.why-card:nth-child(1) p')],
  ['why2_title', document.querySelector('.why-card:nth-child(2) h4')],
  ['why2_desc',  document.querySelector('.why-card:nth-child(2) p')],
  ['why3_title', document.querySelector('.why-card:nth-child(3) h4')],
  ['why3_desc',  document.querySelector('.why-card:nth-child(3) p')],
  ['why4_title', document.querySelector('.why-card:nth-child(4) h4')],
  ['why4_desc',  document.querySelector('.why-card:nth-child(4) p')],
  // Contact
  ['ct_tag',       document.querySelector('#contact .section-tag')],
  ['ct_title',     document.querySelector('#contact .section-title')],  // innerHTML
  ['ct_phone_lbl', document.querySelector('.contact-item:nth-child(1) .contact-label')],
  ['ct_email_lbl', document.querySelector('.contact-item:nth-child(2) .contact-label')],
  ['ct_zone_lbl',  document.querySelector('.contact-item:nth-child(3) .contact-label')],
  ['ct_zone_val',  document.querySelector('.contact-item:nth-child(3) .contact-value')],
  ['btn_wa',       document.querySelector('.btn-whatsapp')],
  // Form labels
  ['f_name',    document.querySelector('label[for-group="name"]')],
  ['f_phone',   document.querySelector('label[for-group="phone"]')],
  ['f_email',   document.querySelector('label[for-group="email"]')],
  ['f_service', document.querySelector('label[for-group="service"]')],
  // Form select options
  ['f_s0', document.querySelector('#formService option:nth-child(1)')],
  ['f_s1', document.querySelector('#formService option:nth-child(2)')],
  ['f_s2', document.querySelector('#formService option:nth-child(3)')],
  ['f_s3', document.querySelector('#formService option:nth-child(4)')],
  ['f_s4', document.querySelector('#formService option:nth-child(5)')],
  ['f_s5', document.querySelector('#formService option:nth-child(6)')],
  ['f_vehicle',  document.querySelector('label[for-group="vehicle"]')],
  ['f_date_s',   document.querySelector('label[for-group="datestart"]')],
  ['f_date_e',   document.querySelector('label[for-group="dateend"]')],
  ['f_msg',      document.querySelector('label[for-group="msg"]')],
  ['f_submit',   document.querySelector('[data-fs-submit-btn]')],
  ['f_success',  document.querySelector('[data-fs-success]')],
  // Footer
  ['footer_tag',  document.querySelector('.footer-tag')],
  ['footer_copy', document.querySelector('.footer-copy')],
];

// Keys that use innerHTML (contain HTML tags like <span>, <br>)
const HTML_KEYS = new Set(['hero_title','tr_title','why_title','ct_title']);

// Transfer list items need special handling (gold span prefix)
const TRANSFER_KEYS = { tr1:0, tr2:1, tr3:2, tr4:3, tr5:4 };

let currentLang = localStorage.getItem('mrprestige_lang') || 'fr';

function applyLang(lang) {
  const t = T[lang];
  if (!t) return;
  currentLang = lang;
  localStorage.setItem('mrprestige_lang', lang);

  // RTL support
  document.documentElement.setAttribute('dir', t.dir);
  document.documentElement.setAttribute('lang', lang);

  // Update button label
  document.getElementById('langFlag').textContent = FLAGS[lang];
  document.getElementById('langCode').textContent  = CODES[lang];

  // Mark active item
  document.querySelectorAll('#langDropdown li').forEach(li => {
    li.classList.toggle('active', li.dataset.lang === lang);
  });

  // Apply translations
  I18N_MAP().forEach(([key, ...els]) => {
    const val = t[key];
    if (!val) return;
    els.forEach(el => {
      if (!el) return;
      // Transfer list items: preserve gold checkmark span
      if (key in TRANSFER_KEYS) {
        el.innerHTML = `<span class="gold">✓</span> ${val}`;
      } else if (HTML_KEYS.has(key)) {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    });
  });

  // Update form labels (select by position in form-group)
  const formGroups = document.querySelectorAll('#contactForm .form-group label');
  const labelKeys = ['f_name','f_phone','f_email','f_service','f_vehicle','f_date_s','f_date_e','f_msg'];
  formGroups.forEach((lbl, i) => {
    if (labelKeys[i] && t[labelKeys[i]]) lbl.textContent = t[labelKeys[i]];
  });

  // Font for Chinese / Arabic
  if (lang === 'zh') {
    document.body.style.fontFamily = "'Noto Sans SC', 'Montserrat', sans-serif";
  } else if (lang === 'ar') {
    document.body.style.fontFamily = "'Noto Sans Arabic', 'Montserrat', sans-serif";
  } else {
    document.body.style.fontFamily = "'Montserrat', sans-serif";
  }
}

// ===== LANGUAGE SWITCHER =====
const langBtn      = document.getElementById('langBtn');
const langDropdown = document.getElementById('langDropdown');

langBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  langDropdown.classList.toggle('open');
});
document.addEventListener('click', () => langDropdown.classList.remove('open'));
langDropdown.querySelectorAll('li').forEach(li => {
  li.addEventListener('click', () => {
    applyLang(li.dataset.lang);
    langDropdown.classList.remove('open');
  });
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== BURGER MENU =====
const burger   = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 100);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.service-card').forEach(el => observer.observe(el));

// ===== FLEET FILTER =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.car-card').forEach(card => {
      const match = filter === 'all' || card.dataset.cat === filter;
      card.classList.toggle('hidden', !match);
      if (match) card.style.animation = 'fadeIn 0.4s ease forwards';
    });
  });
});

// ===== PRESELECT VEHICLE =====
function preselectVehicle(name) {
  const field = document.getElementById('formVehicle');
  const group = document.getElementById('vehicleGroup');
  const svc   = document.getElementById('formService');
  if (field && group) { field.value = name; group.style.display = 'block'; }
  if (svc) svc.value = 'Location Véhicule';
}

// ===== SMOOTH ACTIVE NAV =====
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? '#D4AF37' : '';
  });
});

// ===== PARALLAX HERO =====
window.addEventListener('scroll', () => {
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) heroBg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
});

// Keyframe fadeIn
const style = document.createElement('style');
style.textContent = `@keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`;
document.head.appendChild(style);

// ===== INIT LANGUAGE + FLEET =====
applyLang(currentLang);

// Charger la flotte dynamique (remplace les cartes statiques si Supabase répond)
loadFleetFromSupabase();

