# Product
<!-- impeccable:product-schema 1 -->

## Platform
web

## Users
- Touristes internationaux de passage sur la Côte d'Azur (saison, Grand Prix de Monaco, Festival de Cannes), qui consultent surtout sur téléphone et dans plusieurs langues.
- Clientèle locale aisée (Monaco, Nice, Cannes) qui loue pour un événement ou un week-end.
- Professionnels qui réservent pour leurs clients : conciergeries d'hôtels, organisateurs d'événements, équipages de yachts.

Leur tâche : trouver le bon véhicule ou service, vérifier le prix, puis envoyer une demande de disponibilité.

## Product Purpose
MR PRESTIGE loue des voitures de luxe, affrète des yachts, organise des transferts VIP et met à disposition des chauffeurs privés sur la Côte d'Azur. Le site public (mrprestige.fr) doit transformer une visite en demande de disponibilité. La location de voitures est le service qui rapporte le plus et reste au centre de l'accueil.

## Positioning
Une seule maison pour la voiture, le yacht et le chauffeur, avec une réponse personnelle sur WhatsApp plutôt qu'une réservation automatique.

## Operating Context
- Les demandes arrivent par WhatsApp (+33 6 51 03 25 30) via le parcours Concierge, et par le formulaire de contact (Formspree).
- La flotte publiée est exportée depuis l'application de gestion (Streamlit, `app.py`) vers `fleet.json` ; les photos sont dans Supabase Storage.
- Site statique servi par nginx dans Docker sur Railway.

## Capabilities and Constraints
- Cinq langues : français, anglais, arabe (RTL), russe, chinois (`translations.js`).
- Rien n'est réservé en ligne : toute demande est une demande de disponibilité, confirmée ensuite par l'équipe.
- Prix voitures publics à la journée ; tarifs yachts sur demande.
- Undecided: méthode de publication sur Railway (CLI ou GitHub) à confirmer.

## Brand Commitments
- Nom : MR PRESTIGE.
- Ton honnête : pas de promesse de disponibilité immédiate ni de délai de réponse chiffré (voir le commit « contenu honnête »).

## Evidence on Hand
- Photos de la flotte : `images/` et Supabase Storage ; photos des yachts : `images/yachts/`.
- Coordonnées : contact@mrprestige.fr, +33 6 51 03 25 30, +33 6 58 10 00 00.
- Aucun avis client, aucune référence presse, aucun chiffre de clientèle : ne pas en inventer.

## Product Principles
1. La voiture d'abord : la flotte est la preuve, montrée en grand et avec son prix.
2. Une demande en deux gestes, sur téléphone, dans la langue du visiteur.
3. Dire vrai : « sur demande » plutôt que « disponible ».
4. Une maison, plusieurs services : yachts, transferts et chauffeurs prolongent la voiture.
