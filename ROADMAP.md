# Ordre d’implémentation

Chaque section du cahier des charges reste contractuelle ; cet ordre ne réduit aucun périmètre.

1. Socle Expo, Router, TypeScript strict, thème, FR/EN, SQLite migré, transactions, outbox, vérifications et CI.
2. Première tranche Training : séance vide, exercices personnels, séries, sauvegarde immédiate, reprise et historique ; protocole de sync versionné sans écrasement silencieux.
3. Auth complète : e-mail, Apple, Google, récupération, profils/onboarding, isolation des comptes, migration explicite du profil local, sync bidirectionnelle et RLS vérifiée sur instance réelle.
4. Compléter Training : routines/dossiers/programmes, tous les types de tracking, supersets, timers/notifications, performances précédentes, PR, statistiques et calculateurs.
5. Nutrition utilisable : sources autorisées, cache, recherche, aliments privés, portions, snapshots, journal, objectifs, favoris/récents/fréquents.
6. Barcode, repas/recettes, imports validés, opérations groupées et multi-jours.
7. Progression, eau, activité, objectifs contextuels, déduplication santé, intégrations et jeûne optionnel.
8. Scan repas et voix avec revue explicite, planification, courses, pantry.
9. Social/confidentialité/modération, IA avec permissions et propositions confirmées.
10. Bilans/exports, abonnements serveur, montres/widgets, companion et admin web.
11. Durcissement continu : sécurité, performance, accessibilité, E2E mobiles, builds et publication.

Les critères d’acceptation 270–274 constituent les portes de sortie du produit complet. Une tranche livrée n’implique pas que toute sa phase est terminée.

## Avancement au 2026-09-06

Lot 2 : §30 livré, avec démarrage depuis routine, répétition/copie d’historique et sauvegarde d’une séance comme routine. Cette tranche Training indépendante du réseau a été avancée pendant l’absence de configuration Supabase. L’authentification et la sync bidirectionnelle restent prioritaires et conservent leur périmètre.

Lot 3 : §27 et §28 livrés, avec performances précédentes par série, cinq types de PR par exercice, records provisoires et restitution dans le détail d’historique. Reconstruction après changement des données, reprise SQLite et parcours UI hors ligne testés. Le bilan complet §29 et les tables/agrégats matérialisés restent partiels.

Lot 4 : §22 et §24 livrés. Supersets, tri-sets, giant sets, réorganisation des blocs/membres/séries, mode guidé et repos par tour sont disponibles dans les séances ; les modèles, copies et partages conservent les groupes. Migrations SQLite v3/PostgreSQL et format partagé v2 validés, import v1 conservé.

Lot 5 : §31 livré. Dossiers, filtre de bibliothèque, création/renommage/suppression sans perte, glisser-déposer et déplacements par boutons sont implémentés. Classement, migration SQLite v4, RPC PostgreSQL, reprise et annulation des gestes sont testés. La validation tactile sur appareil reste à réaliser.

Lot 6 (2026-09-08) : §32 livré. Programmes composés de routines ordonnées et répétables, édition, duplication, suppression et démarrage indépendant. SQLite v5, RPC/RLS PostgreSQL et parcours hors ligne validés ; 94 tests passent.

Prochaine tranche Training exécutable sans serveur : enrichir l’historique (§33). Les notifications de repos et le bilan complet restent à suivre. L’authentification et la sync restent prioritaires dès que leur environnement peut être vérifié.
