---
name: MR PRESTIGE
description: Voitures d'exception, yachts et chauffeurs sur la Côte d'Azur, sur demande.
colors:
  champagne: "#c9a55a"
  champagne-lit: "#d6b46a"
  champagne-deep: "#a8863f"
  lacquer: "#07080a"
  lacquer-raised: "#0c0d10"
  stage: "#111317"
  field: "#181a1f"
  hairline: "#25282e"
  ivory: "#ece7dd"
  ivory-muted: "#a39e94"
  error-coral: "#f0a08a"
typography:
  display:
    fontFamily: "Bodoni Moda, Didot, Bodoni 72, Georgia, serif"
    fontSize: "clamp(3rem, 1.6rem + 5.4vw, 6rem)"
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Bodoni Moda, Didot, Bodoni 72, Georgia, serif"
    fontSize: "clamp(2.4rem, 1.6rem + 3vw, 4.2rem)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Bodoni Moda, Didot, Bodoni 72, Georgia, serif"
    fontSize: "clamp(1.9rem, 1.4rem + 1.6vw, 2.8rem)"
    fontWeight: 500
    lineHeight: 1.05
  title-sm:
    fontFamily: "Bodoni Moda, Didot, Bodoni 72, Georgia, serif"
    fontSize: "clamp(1.4rem, 1.2rem + 0.6vw, 1.75rem)"
    fontWeight: 500
    lineHeight: 1.15
  price:
    fontFamily: "Bodoni Moda, Didot, Bodoni 72, Georgia, serif"
    fontSize: "clamp(1.8rem, 1.4rem + 1.2vw, 2.4rem)"
    fontWeight: 500
    fontFeature: "lnum, tnum"
  lead:
    fontFamily: "Hanken Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.05rem, 0.98rem + 0.3vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Hanken Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Hanken Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 400
    letterSpacing: "0.02em"
  button:
    fontFamily: "Hanken Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 600
    letterSpacing: "0.02em"
rounded:
  pill: "999px"
  panel: "1.4rem"
  frame: "1.2rem"
spacing:
  xs: "0.35rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.6rem"
  xl: "2.5rem"
components:
  button-primary:
    backgroundColor: "{colors.champagne}"
    textColor: "{colors.lacquer}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 1.6rem"
    height: "2.9rem"
  button-primary-hover:
    backgroundColor: "{colors.champagne-lit}"
    textColor: "{colors.lacquer}"
  link-hairline:
    textColor: "{colors.ivory}"
    height: "2.75rem"
  input-pill:
    backgroundColor: "{colors.field}"
    textColor: "{colors.ivory}"
    rounded: "{rounded.pill}"
    padding: "0.55rem 2.6rem 0.55rem 1.1rem"
    height: "2.9rem"
  ask-bar:
    backgroundColor: "{colors.lacquer-raised}"
    rounded: "{rounded.panel}"
    padding: "1rem 1rem 1rem 1.25rem"
  chip-filter:
    backgroundColor: "transparent"
    textColor: "{colors.ivory-muted}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 1rem"
    height: "2.75rem"
  chip-filter-selected:
    backgroundColor: "{colors.ivory}"
    textColor: "{colors.lacquer}"
  index-row:
    textColor: "{colors.ivory-muted}"
    typography: "{typography.body}"
    padding: "1.05rem 0.25rem"
    height: "3.5rem"
  index-row-selected:
    textColor: "{colors.ivory}"
  stage-photo:
    backgroundColor: "{colors.stage}"
    rounded: "{rounded.frame}"
---

# Design System: MR PRESTIGE

## Overview

**Creative North Star: "Riviera Nuit"**

Le site est un showroom de nuit sur la Riviera. Le fond est une laque noire, le champagne y joue le rôle d'une lumière (filets d'un pixel, un seul aplat par écran, l'italique des noms), et le texte est ivoire. La voiture et la demande passent avant tout discours : une photo plein cadre, un titre en Bodoni, puis une barre de demande qui est l'action principale.

La densité est éditoriale et calme : de grandes marges latérales proportionnelles, des listes séparées par des filets plutôt que des grilles de cartes, des prix composés en chiffres alignés. Le mouvement est lent et décéléré, comme un rideau de vitrine qui s'ouvre ; il disparaît entièrement quand l'utilisateur demande moins d'animations.

Le monde refuse, d'après le contrat de direction : le slogan centré au-dessus de deux boutons, la grille de cartes identiques à badges, les émojis, les sur-titres.

**Key Characteristics:**
- Laque noire, champagne comme lumière, ivoire pour le texte.
- Bodoni Moda en titrage, l'italique champagne pour l'accent ; Hanken Grotesk pour tout le reste.
- Contrôles en pilule, filets d'un pixel, aucune carte répétée.
- Listes éditoriales plutôt que grilles.
- Interaction signature : le volet clip-path sur la photo de scène du showroom.
- Bidirectionnel : chaque direction (volet, retrait des lignes, chevrons) se retourne en arabe.

## Colors

Une palette quasi monochrome de noirs laqués et d'ivoires, traversée par un seul métal chaud.

### Primary
- **Champagne** (`champagne`) : la lumière du monde. Aplat du seul bouton principal par écran, italique des mots-accents dans les titres et les noms de modèles, prix à la journée, filets d'accent (soulignement de la ligne choisie, bordure de focus, chevrons des champs), anneau `:focus-visible` et sélection de texte.
- **Champagne éclairé** (`champagne-lit`) : survol du bouton principal uniquement.
- **Champagne profond** (`champagne-deep`) : pouce de barre de défilement ; jamais en texte.

### Neutral
- **Laque** (`lacquer`) : fond de page, texte posé sur le champagne et sur la puce de filtre active, base des dégradés posés sur les photos.
- **Laque relevée** (`lacquer-raised`) : fond de la barre de demande, à 86 % d'opacité au-dessus de la photo.
- **Scène** (`stage`) : fond de la photo de scène pendant le chargement.
- **Champ** (`field`) : fond des sélecteurs et champs de date.
- **Filet** (`hairline`) : séparateurs de listes, bordure des champs et des filtres au repos.
- **Ivoire** (`ivory`) : texte principal, titres, ligne choisie, puce de filtre active (en aplat).
- **Ivoire voilé** (`ivory-muted`) : texte secondaire, libellés, lignes non choisies, ligne des lieux.
- **Corail d'erreur** (`error-coral`) : message d'erreur de la barre de demande, seul usage.

Les filets champagne sont des dérivés en transparence de `champagne` : 22 % (ligne des lieux), 28 % (cadre de la photo de scène), 32 % (contour de la barre de demande), 35 % (filet supérieur des services), 50 % (soulignement du lien). L'ivoire voilé du sous-titre est l'ivoire à 82 %.

### Named Rules
**The Single Light Rule.** Un seul aplat champagne visible par écran : le bouton de demande. Partout ailleurs, le champagne n'est qu'un filet, une italique ou un chiffre.

**The Italic Accent Rule.** L'accent d'un titre passe par l'italique Bodoni en champagne, jamais par la seule couleur sur un mot droit. Dans l'index du showroom, l'italique reste ivoire tant que la ligne n'est pas choisie.

## Typography

**Display Font:** Bodoni Moda (avec Didot, Bodoni 72, Georgia)
**Body Font:** Hanken Grotesk (avec Helvetica Neue, Arial)

**Character:** Un didone à fort contraste, chargé en axe optique, pour la voix de la maison ; une grotesque nette et neutre pour l'information et les contrôles.

### Hierarchy
- **Display** (500, clamp 3rem à 6rem, 0.98, -0.02em) : titre du premier écran seulement, deux lignes, `text-wrap: balance`.
- **Headline** (500, clamp 2.4rem à 4.2rem, 1, -0.015em) : titre de section du monde (le showroom).
- **Title** (500, clamp 1.9rem à 2.8rem, 1.05) : nom du modèle sur la scène.
- **Title small** (500, clamp 1.4rem à 1.75rem, 1.15) : intitulé d'une ligne de services.
- **Price** (500, clamp 1.8rem à 2.4rem, chiffres alignés et tabulaires) : prix à la journée en champagne ; dans l'index, le prix est en Bodoni 1.2rem.
- **Lead** (400, clamp 1.05rem à 1.25rem, 1.55, 34rem max) : phrase sous le titre du premier écran.
- **Body** (400, 1rem à 1.08rem, 1.6 à 1.65, 36rem ou 52ch max) : introductions et descriptions.
- **Label** (400, 0.8rem, 0.02em) : libellés des champs.
- **Button** (600, 0.95rem, 0.02em) : boutons et liens d'action.

### Named Rules
**The Lining Figures Rule.** Tout prix et tout compteur se compose en chiffres alignés (`lining-nums`, plus `tabular-nums` pour les prix), pour que les colonnes de prix tombent juste.

**The Two Voices Rule.** Bodoni porte les titres, les noms et les prix ; Hanken porte tout le reste. Pas de capitales espacées en dehors du logotype.

## Layout

Gouttière latérale proportionnelle `max(1.25rem, 6vw)` et largeur maximale de 1440px pour les sections du monde. Le premier écran occupe `min(84svh, 820px)` : photo plein cadre, contenu aligné en début de ligne (54rem max), puis une ligne de pied séparée par un filet (lieux à gauche, compteur à droite).

Le showroom est une grille à deux colonnes asymétriques (scène 1.65fr, index minimum 17rem), la scène restant collante à 6rem du haut. Les services sont une liste à trois colonnes (intitulé 18rem, description, lien 9rem) alignées sur la ligne de base.

Points de rupture observés : 1100px (la barre de demande passe sur deux colonnes, service et bouton en pleine largeur), 900px (le showroom passe sur une colonne, la scène n'est plus collante), 680px (premier écran recadré sur la photo mobile avec un dégradé vertical, légende et prix empilés, filtres en défilement horizontal, services sur une colonne).

Les cibles tactiles font au moins 2.75rem (filtres, liens) et 2.9rem (champs, boutons).

## Elevation & Depth

Le monde est plat. La profondeur vient de la photo et des dégradés de laque qui la couvrent (latéral 90° plus bas de page sur ordinateur, vertical sur mobile), et des filets champagne translucides. Deux ombres seulement, douces et diffuses, jamais décalées.

### Shadow Vocabulary
- **Flottement de la barre** (`box-shadow: 0 24px 60px -24px rgba(0,0,0,.8)`) : barre de demande posée sur la photo.
- **Soulèvement du bouton** (`box-shadow: 0 12px 26px -12px rgba(0,0,0,.85)`) : survol du bouton principal, avec une montée de 1px ; disparaît à l'appui.

### Named Rules
**The Lit-Not-Lifted Rule.** On signale un état par la lumière (filet champagne, passage à l'ivoire), pas par l'élévation. Seul le bouton principal se soulève.

## Shapes

Trois rayons : la pilule (999px) pour tout contrôle (bouton, champ, filtre, bouton de navigation), le panneau (1.4rem, 1.2rem sous 1100px) pour la barre de demande, le cadre (1.2rem) pour la photo de scène, bordée d'un filet champagne intérieur. Les listes n'ont pas de coins : elles sont faites de filets horizontaux d'un pixel. Les icônes des champs sont des traits fins en SVG champagne (1.2 à 1.4 de trait, 14px).

## Components

### Buttons
Un seul bouton plein, lumineux et posé.
- **Shape:** pilule (999px), hauteur minimale 2.9rem.
- **Primary:** aplat champagne, texte laque, Hanken 600 0.95rem, padding 0.75rem 1.6rem.
- **Hover / Focus:** champagne éclairé, montée de 1px et ombre de soulèvement, transition sur `--ease-out` en 0.25s ; retour à plat à l'appui ; anneau champagne de 2px décalé de 3px au clavier.
- **Lien filet:** lien secondaire en ivoire souligné d'un filet champagne à 50 %, qui passe au champagne au survol. Le lien d'action des services est en champagne, sans filet au repos, filet au survol.

### Chips
- **Style:** filtres de catégorie du showroom, pilules transparentes, bordure filet, texte ivoire voilé.
- **State:** survol en ivoire avec bordure ivoire à 35 % ; sélection (`aria-pressed`) en aplat ivoire et texte laque. L'aplat ivoire, et non champagne, préserve la Single Light Rule.

### Cards / Containers
Pas de cartes. Deux conteneurs seulement :
- **Barre de demande:** panneau de laque relevée à 86 %, contour champagne à 32 %, ombre de flottement ; grille service, du, au, bouton.
- **Photo de scène:** ratio 16/10, cadre 1.2rem, fond scène, filet champagne intérieur à 28 % et léger dégradé de laque en pied.

### Inputs / Fields
- **Style:** pilules sur fond champ, bordure filet, texte ivoire Hanken 500 1rem, chevron ou calendrier en trait champagne côté fin de ligne (retourné en RTL). Les parties de date vides restent en ivoire voilé.
- **Focus:** la bordure passe au champagne.
- **Error:** message en corail d'erreur sous la barre, annoncé par `role="alert"`.

### Navigation
- Barre fixe transparente sur la photo, puis voile de verre au défilement (flou 22px) avec un filet bas. Logotype en Bodoni 600 capitales espacées de 0.2em (0.14em sur mobile). Liens Hanken 500 0.95rem en ivoire voilé, ivoire au survol et pour la section courante. L'action de navigation est une pilule à contour champagne qui se remplit au survol. Sous 680px, menu plein écran sur voile.

### Showroom (signature)
Index à gauche de la lecture, scène à côté. Chaque ligne de l'index est un bouton : nom en Hanken avec le modèle en italique Bodoni, prix en Bodoni à droite, séparés par des filets. Au survol, la ligne s'avance de 0.6rem ; la ligne choisie passe à l'ivoire, son italique au champagne, et un filet champagne s'étire sous elle (0.5s). Choisir un modèle fait glisser la nouvelle photo par-dessus l'ancienne en volet `clip-path` (0.85s, `--ease-out`, depuis le bord de début de ligne, inversé en RTL), puis l'ancienne est retirée. Sans animation, l'image est remplacée directement.

### Liste de services
Liste éditoriale sous un filet champagne à 35 % : intitulé en Bodoni, description en ivoire voilé, lien d'action en champagne en fin de ligne. Au survol, la ligne s'avance de 0.8rem (0.4s).

### Mouvement
Courbe unique `--ease-out` pour les gestes du monde. À l'arrivée, la photo du premier écran se pose (léger zoom et assombrissement levés en 2.4s), puis titre, phrase et barre montent de 18px en cascade (1.1s, décalages 0.15s, 0.3s, 0.45s). Tout est neutralisé sous `prefers-reduced-motion`.

## Do's and Don'ts

### Do:
- **Do** réserver l'aplat champagne au seul bouton de demande de l'écran ; le reste du champagne est filet, italique ou prix.
- **Do** composer les listes de choix (modèles, services) en lignes séparées par des filets d'un pixel, avec un retrait au survol.
- **Do** donner à chaque contrôle la forme pilule (999px) et une hauteur d'au moins 2.75rem.
- **Do** marquer l'accent d'un titre par l'italique Bodoni en champagne.
- **Do** composer prix et compteurs en chiffres alignés.
- **Do** retourner chaque geste directionnel en arabe (volet, retrait, chevrons, padding des champs).
- **Do** passer chaque animation sur `--ease-out` et la couper sous `prefers-reduced-motion`.

### Don't:
- **Don't** aligner des cartes identiques en grille ni poser des badges sur les offres.
- **Don't** utiliser d'émojis ni de glyphes en guise d'icônes ; les icônes sont des traits SVG fins.
- **Don't** placer de sur-titre au-dessus d'un titre.
- **Don't** centrer un slogan au-dessus de deux boutons dans le premier écran.
- **Don't** marquer un mot d'accent par la seule couleur sur un caractère droit.
- **Don't** introduire de vert ni d'autre couleur d'accent ; l'unique accent est le champagne.
- **Don't** écrire « disponible » : l'état d'un modèle est « sur demande », en texte simple.
