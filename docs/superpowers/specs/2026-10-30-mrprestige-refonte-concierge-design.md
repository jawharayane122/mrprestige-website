# Refonte MR PRESTIGE : parcours « Concierge » (WhatsApp)

## Objectif
Moderniser mrprestige.fr : plus fluide, plus interactif, avec un parcours qui amène le visiteur à une **demande de disponibilité sur WhatsApp**.

## Contraintes
- Pas de réservation ni de paiement en ligne : les véhicules et bateaux appartiennent à des tiers, la disponibilité ne peut pas être confirmée automatiquement.
- Stack inchangée : HTML/CSS/JS pur, nginx, Railway. Pas de framework.
- Identité conservée : noir et or, Oswald + Montserrat.
- Numéro WhatsApp : +33 6 51 03 25 30 (celui des liens actuels). Les deux numéros restent affichés pour les appels.
- Multilingue : FR / EN / AR / RU / ZH via `translations.js`.

## Hors périmètre
Paiement, calendrier de disponibilité en temps réel, back-office, pages séparées par service.

## Composants

### 1. Parcours Concierge (3 étapes)
1. **Besoin** : véhicule, yacht, transfert, chauffeur, immobilier.
2. **Détails** : dates, modèle (pré-rempli si venu d'une fiche), nombre de personnes, note libre.
3. **Récapitulatif** : bouton « Envoyer sur WhatsApp » qui ouvre `wa.me` avec un message pré-rempli (service, modèle, dates, langue du site).

Textes : « Demande de disponibilité », jamais « réservation confirmée ». Mention : « Nous vous confirmons la disponibilité sous peu. »
Le formulaire de contact existant reste en secours.

### 2. Flotte et yachts
- Filtres de catégorie en direct.
- Fiche détaillée en panneau (sans changement de page), galerie plein cadre.
- Bouton « Demander la disponibilité » sur chaque fiche : ouvre le parcours à l'étape 2 avec le modèle déjà choisi.
- Correction des compteurs de carrousel (ils reflètent le nombre réel d'images).
- Prix yachts harmonisés sur un seul format (à valider avec toi).

### 3. Fluidité
- Apparition des sections au scroll (IntersectionObserver), transitions douces ouverture/fermeture des fiches.
- Menu mobile soigné, navigation allégée.
- Respect de `prefers-reduced-motion`.
- Typographie plus fine, effet verre léger sur les panneaux.

### 4. Contenu honnête
- Badges « Disponible » remplacés par « Sur demande ».
- « 100 % satisfaction » et « réponse garantie en 15 min » retirés ou reformulés (ta décision).
- Sélecteur de langue : uniquement les langues réellement traduites.

## Fichiers touchés
`website/index.html`, `website/style.css`, `website/script.js`, `website/translations.js`. Travail sur une branche dédiée (des modifications non commitées existent sur `main`).

## Vérification
- Chaque bouton WhatsApp produit le bon texte encodé, dans les 5 langues.
- Parcours testé au clavier et sur mobile (390 px et 768 px).
- Aucun changement du Dockerfile, de `nginx.conf` ni de `railway.json`.
- Lighthouse performance mobile non dégradée par rapport à l'actuel.

## Questions ouvertes
- Format de prix des yachts à retenir.
- Faut-il garder ou retirer les chiffres clés non sourcés du hero ?
