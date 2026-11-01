# Refonte MR PRESTIGE « Concierge » Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Moderniser le site (fluide, interactif) avec un parcours « demande de disponibilité » en 3 étapes qui aboutit à un message WhatsApp pré-rempli.

**Architecture:** Un module pur `concierge.js` construit l'URL WhatsApp (testable avec Deno). Une modale « Concierge » (HTML/CSS/JS) pilote les 3 étapes. Les boutons existants (flotte dynamique ou statique, yachts, villas, nav) ouvrent la modale avec le modèle pré-rempli. Le reste est de la finition CSS/JS (apparition au scroll, fiche en panneau, contenu honnête).

**Tech Stack:** HTML/CSS/JS sans framework, nginx, Railway. Tests: Deno (déjà installé, `/opt/homebrew/bin/deno`). Aperçus: `python3 -m http.server` + captures.

**Spec:** `docs/superpowers/specs/2026-10-30-mrprestige-refonte-concierge-design.md`

## Global Constraints

- Numéro WhatsApp: `33651032530` (+33 6 51 03 25 30). Les deux numéros restent affichés pour les appels.
- Aucune réservation ni paiement en ligne. Vocabulaire: « demande de disponibilité », jamais « confirmé ».
- Pas de framework ni de dépendance npm. `Dockerfile`, `nginx.conf`, `railway.json` inchangés.
- Palette conservée: `--gold:#D4AF37`, `--black:#050505`, polices Oswald + Montserrat.
- 5 langues: `fr`, `en`, `ar`, `ru`, `zh`. Toute clé ajoutée à `translations.js` existe dans les 5. `ar` s'affiche en RTL.
- **Jamais de `git push`, de PR ni de déploiement sans que l'utilisateur ait vu les aperçus et dit OK.** Commits locaux seulement.

## Review Focus

- Modèle avec accents, `&`, `#`, `/` (ex. « MERCEDES G CLASS », « Villa & Chalet »): l'URL WhatsApp est correctement encodée.
- Dates vides ou fin avant début: pas d'envoi absurde, message d'aide clair.
- `fleet.json` vide ou Supabase en échec: les cartes statiques ouvrent aussi la modale avec leur modèle.
- Langue inconnue dans `localStorage`: repli sur `fr`.
- Arabe (RTL): modale lisible, message WhatsApp en arabe.
- `prefers-reduced-motion`: aucune animation d'apparition bloquante, contenu visible.

## File Structure

- Create `website/concierge.js`: logique pure (`buildWhatsAppUrl`, `validateDates`) + câblage de la modale.
- Create `website/tests/concierge_test.ts`: tests Deno de la logique pure.
- Modify `website/index.html`, `style.css`, `script.js`, `translations.js`.

---

### Task 1: Branche et logique pure WhatsApp

**Files:**
- Create: `website/concierge.js`, `website/tests/concierge_test.ts`

**Interfaces:**
- Produces (sur `globalThis.Concierge`):
  - `buildWhatsAppUrl(req: {service: string, model?: string, start?: string, end?: string, guests?: number, note?: string}, lang: string): string`
  - `validateDates(start?: string, end?: string): {ok: boolean, reason?: 'missing' | 'order'}` (dates `YYYY-MM-DD`)
  - `WA_NUMBER = '33651032530'`

- [ ] **Step 1:** `git checkout -b refonte-concierge`, puis un commit local de base « chore: état actuel avant refonte » qui contient les modifications déjà présentes dans `website/` (elles appartiennent à l'utilisateur ; ne rien pousser).
- [ ] **Step 2: Tests d'abord** dans `concierge_test.ts` (`import "../concierge.js"`, lire `globalThis.Concierge`):
  - `url commence par https://wa.me/33651032530?text=`
  - `modèle avec & # / é est encodé` : `decodeURIComponent(text)` contient exactement `MERCEDES G CLASS & Co #1/é`
  - `langue inconnue → fr` : `buildWhatsAppUrl(req,'xx')` identique à `'fr'`
  - `ar` : le texte décodé contient des caractères arabes et le nom du modèle
  - `validateDates('2026-11-10','2026-11-05')` → `{ok:false, reason:'order'}` ; `validateDates('', '')` → `{ok:false, reason:'missing'}` ; dates valides → `{ok:true}`
  - le texte n'inclut ni « confirm » ni « réservation confirmée ».
- [ ] **Step 3:** Lancer `cd website && deno test tests/` — attendu: échec (module absent).
- [ ] **Step 4:** Implémenter `concierge.js` (modèle de phrase par langue dans un objet interne, « Bonjour MR PRESTIGE, je souhaite connaître la disponibilité de … du … au … »). Aucune dépendance au DOM dans ces fonctions.
- [ ] **Step 5:** `deno test tests/` — attendu: tous les tests passent.
- [ ] **Step 6:** Commit local `feat: logique WhatsApp du parcours Concierge`.

### Task 2: Modale Concierge (3 étapes) et branchement des boutons

**Files:**
- Modify: `website/index.html` (balisage de la modale `#conciergeModal`, nav), `style.css`, `script.js` (cartes dynamiques ~l.100-108, `preselectVehicle`, `preselectYacht`), `translations.js`, `concierge.js`
- Consumes: Task 1 (`buildWhatsAppUrl`, `validateDates`).
- Produces: `Concierge.open(opts?: {service?: string, model?: string})` ; ouvre l'étape 1, ou l'étape 2 si `service` est fourni.

- [ ] **Step 1:** Ajouter les clés i18n (`cc_step1_title`, `cc_step2_title`, `cc_step3_title`, `cc_svc_vehicle|yacht|transfer|driver|property`, `cc_dates`, `cc_guests`, `cc_note`, `cc_next`, `cc_back`, `cc_send`, `cc_disclaimer`, `cc_err_dates`) dans les 5 langues.
- [ ] **Step 2:** Balisage accessible de la modale (`role="dialog"`, `aria-modal`, focus piégé, fermeture Échap et clic extérieur, retour du focus au bouton d'origine). Étape 3 = récapitulatif + bouton « Envoyer sur WhatsApp » + phrase « Nous vous confirmons la disponibilité sous peu ».
- [ ] **Step 3:** Câbler `Concierge.open` : bouton nav (`btn-nav`), `.btn-reserve` des cartes dynamiques ET statiques (délégation d'événement sur `#fleetGrid`), boutons yachts, boutons villas. `preselectVehicle`/`preselectYacht` appellent `Concierge.open({service, model})`. Le formulaire `#contactForm` reste en secours dans `#contact`.
- [ ] **Step 4:** Vérifier à la main dans un navigateur: avec `fleet.json` valide, puis avec `fleet.json` renommé (cartes statiques) — le modèle arrive dans le message. Tester FR et AR (RTL).
- [ ] **Step 5:** Commit local `feat: parcours Concierge en 3 étapes`.

### Task 3: Fiches en panneau et carrousels corrigés

**Files:** Modify `website/index.html`, `style.css`, `script.js`
- Consumes: `Concierge.open`.

- [ ] **Step 1:** `openFleetPanel(cardEl: HTMLElement): void` — panneau latéral/plein cadre avec photo, specs, prix et bouton « Demander la disponibilité » (`Concierge.open({service:'vehicle', model})`). Fermeture Échap.
- [ ] **Step 2:** Corriger les compteurs de carrousel: le total affiché vaut le nombre réel d'images de la fiche (`YACHTS[yachtId].images.length`), mis à jour dans `ys_go`.
- [ ] **Step 3:** Vérifier visuellement les 4 yachts: compteurs exacts, flèches et swipe tactile OK.
- [ ] **Step 4:** Commit local `feat: fiches en panneau, compteurs de carrousel exacts`.

### Task 4: Fluidité et modernité

**Files:** Modify `website/style.css`, `script.js`, `index.html`

- [ ] **Step 1:** Apparition au scroll via `IntersectionObserver` (étendre l'observateur existant l.348-355 à toutes les sections et cartes), avec transitions `transform/opacity`.
- [ ] **Step 2:** Bloc `@media (prefers-reduced-motion: reduce)` qui désactive les animations et laisse tout visible.
- [ ] **Step 3:** Typographie plus fine, effet verre (`backdrop-filter`) sur navbar, panneau et modale ; menu mobile soigné (burger → panneau).
- [ ] **Step 4:** Vérifier: aucun saut de mise en page (CLS) visible, 60 fps ressentis au scroll sur 390 px.
- [ ] **Step 5:** Commit local `style: fluidité, scroll, glass`.

### Task 5: Contenu honnête

**Files:** Modify `website/index.html`, `script.js`, `translations.js`

- [ ] **Step 1:** Remplacer « Disponible » par « Sur demande » (clé `badge_avail`, ligne dynamique `t.badge_avail` + cartes statiques) dans les 5 langues.
- [ ] **Step 2:** Prix yachts: tous en `price_on_demand`. Hero: retirer « 100 % satisfaction » (décision à confirmer avec l'utilisateur, par défaut retirée) ; reformuler « réponse garantie en 15 min » en « Réponse rapide sur WhatsApp ».
- [ ] **Step 3:** Sélecteur de langue: ne lister que les langues dont `translations.js` couvre ≥ 95 % des clés `fr` ; vérifier avec un petit script Deno qui compare les clés par langue (échoue s'il en manque).
- [ ] **Step 4:** Commit local `fix: contenu honnête (disponibilité sur demande, claims retirés)`.

### Task 6: Aperçus et validation (point d'arrêt obligatoire)

- [ ] **Step 1:** `cd website && python3 -m http.server 8080` en arrière-plan. Captures (FR) à 1280, 768 et 390 px de : accueil, flotte, fiche ouverte, yacht, modale étapes 1-2-3. Captures AR (RTL) de la modale.
- [ ] **Step 2:** Montrer les captures à l'utilisateur avec le lien `http://localhost:8080` pour qu'il teste lui-même.
- [ ] **Step 3:** **S'arrêter.** Aucun push ni PR avant son « OK ». S'il demande des changements, itérer puis remontrer des aperçus.
- [ ] **Step 4:** Seulement après accord explicite: l'utilisateur décide du push / merge / déploiement (voir `superpowers:finishing-a-development-branch`).
