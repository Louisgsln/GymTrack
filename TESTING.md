# Validation du lot initial

Les résultats finaux sont mis à jour après exécution des commandes, pas déduits de la présence des fichiers.

## Couverture réelle

- Unitaires : kg/lb, Epley, deadline du timer, portions fractionnaires, nutriments, unités et date civile locale.
- SQLite réel : migration répétée, fermeture/réouverture de fichier, reprise de séance/séries/notes/timer, historique, rollback si outbox indisponible, écritures concurrentes, validation, isolation locale, séries dupliquées/supprimées/dévalidées, révision obsolète.
- Nutrition : snapshot 100 kcal préservé après modification de la source à 120 kcal ; totaux fractionnaires et suppression avec outbox.
- Sync : perte de réponse après commit, retry idempotent, récupération SYNCING, FIFO et conflit conservé.
- PostgreSQL embarqué PGlite : migration SQL réelle, application des payloads réels de SQLite, receipts, conflit, RLS sous authenticated, écritures directes refusées, injection de table refusée, foreign keys entre propriétaires et valeurs invalides.

Les doubles de transport existent uniquement dans `tests/`. Les migrations et repositories de production sont exécutés sans remplacement dans les tests d’intégration.

## Limites explicites

PostgreSQL embarqué simule uniquement `auth.users`, `auth.uid()` et les rôles de Supabase ; les migrations métier sont réelles. Aucun test n’a appelé un projet Supabase distant ni validé Auth, Realtime ou Storage.

Les bundles Hermes Android/iOS ont été exportés. Aucun émulateur/SDK Android, Xcode, téléphone pilotable ou Docker n’est disponible dans l’environnement constaté. Les crashs/kill et redémarrages testés concernent le fichier SQLite dans Node, pas encore le cycle de vie natif Expo ni VoiceOver/TalkBack. Les E2E des sections 205–216 restent ouverts.

CI fournie dans `.github/workflows/ci.yml` ; son exécution hébergée n’a pas encore eu lieu.

## Résultats observés — 2026-09-05

- Tests : 24 passent (7 fichiers), incluant SQLite et PostgreSQL embarqué. Le test de l’adaptateur Expo vérifie également les clés étrangères du writer et l’isolation des lectures avant commit.
- TypeScript strict : passe, aucune erreur.
- ESLint : passe, aucune erreur ni avertissement.
- Exports Android et iOS : bundles Hermes générés.
- Audit npm après correction UUID : 0 critique, 0 élevée, 8 alertes modérées transitives issues de `decode-uri-component` ≤ 0.4.2 (GHSA-vcc3-ghjq-m6fr). La version corrigée 0.5.0 est ESM et ne remplace pas directement le require CommonJS de query-string 7 ; aucun override incompatible n’a été appliqué. À résoudre avec la migration compatible de la chaîne Router avant distribution publique.
- `xcode → uuid 11.1.1` est ciblé sur l’API v4 CommonJS, conservée.

Prettier format check et `expo install --check` passent. L’arbre npm ne contient aucun conflit de dépendances directes. Le smoke test du générateur UUID xcode passe avec l’override.

## Lot 2 — routines, 2026-09-06

43 tests passent dans 9 fichiers, dont 19 nouveaux tests :

- Migration réelle SQLite v1 → v2 avec séance active et outbox conservées ; ouverture répétée des migrations.
- Création/édition/duplication/suppression de routines, réordonnancement complet des trois niveaux, permutations invalides, accès entre propriétaires, validation des valeurs.
- Fermeture/réouverture d’un fichier, démarrage atomique, impossibilité d’écraser la séance active, copies indépendantes, notes/repos/cibles conservés et rollback complet des créations/imports/suppressions en cas d’erreur.
- Conversion historique → routine et répétition/copie de séance ; remise à zéro des validations ; cibles de durée/distance.
- Partage JSON versionné sans IDs de compte/historique, validation stricte, copie indépendante et rejet des versions/contenus invalides.
- React : création/édition/démarrage à travers l’écran, revue avant partage/import, confirmation avant suppression et premier rendu/modification sans réseau. Les services, repositories, hooks et SQLite sont réels ; les hôtes React Native, navigation et feuille de partage sont des doubles de test. Ces vérifications ne sont pas des E2E sur téléphone.
- PostgreSQL embarqué : chaîne des deux migrations appliquée ; envoi de la queue routines → séance → suppressions ; conservation des références, RLS et refus des écritures directes.

TypeScript, ESLint et compatibilité Expo passent. Les bundles Hermes Android/iOS ont été générés avec les nouveaux écrans. Les dépendances de tests restent hors du bundle applicatif. L’installation npm signale toujours les 8 alertes modérées transitives déjà documentées au lot 1.

La feuille de partage native entre applications, le cycle de vie sur appareil et la connexion réelle à Supabase restent non vérifiés faute d’environnement accessible/configuré.

## Lot 3 — performances et PR, 2026-09-06

54 tests dans 10 fichiers, dont 11 nouveaux :

- `tests/performance.test.ts` : cinq métriques par exercice, cumul des occurrences, égalités et tolérance flottante, formule injectable, filtres de type/échauffement, correction/dévalidation/suppression/abandon, rang des séries et occurrences, trous non validés, séance pertinente et exclusion des séances ultérieures.
- Reconstruction chronologique indépendante de l’ordre des lignes ; correction des records suivants après changement d’une donnée source. Réouverture d’un vrai fichier SQLite, queue inchangée après lecture et isolation des propriétaires.
- `tests/routines-ui.test.tsx` couvre désormais aussi les écrans Training/History : rendu à froid hors ligne, valeurs précédentes, kg/lb sans écriture, validation et dévalidation des records provisoires, confirmation de clôture, records historiques et première référence.

Les tests UI utilisent les vrais composants/hooks/services/SQLite avec des hôtes React Native simulés. Ils ne certifient pas le rendu visuel ou l’accessibilité sur téléphone. Aucun test cloud ou mobile natif supplémentaire n’est prétendu. Les 277 sections contractuelles restent contrôlées par le test de matrice.

Formatage, ESLint et TypeScript passent. Les exports Hermes Android (1293 modules) et iOS (1269 modules) sont générés ; l’exécution du compilateur local a nécessité de sortir du sandbox Windows. Aucune dépendance supplémentaire pour ce lot.

## Lot 4 — supersets, 2026-09-06

68 tests passent dans 11 fichiers, dont 14 nouveaux :

- `tests/supersets.test.ts` : tailles 2/3/4+, ordre par tour et séries inégales, minuteur uniquement en fin de tour, dévalidation, réorganisation des blocs/membres/séries, refus des permutations incorrectes et des groupes séparés.
- Propriétaires/parents, modifications d’une séance fermée, copies avec UUID indépendants dans les deux directions, format partagé v2, import v1 et rejet des groupes invalides.
- Rollback groupe/membres/outbox, copie groupée annulée sur panne de série, groupe source incohérent refusé, suppression d’un membre de routine sans altérer la séance source, reprise d’un fichier réel et migration v2 → v3 sans réécriture des anciennes données/queue.
- `tests/postgres.test.ts` : troisième migration, outbox réelle avec création, changement de repos, copies, suppression de routine et tombstones de groupes ; idempotence, contrainte de repos, références au mauvais parent, isolation RLS et écritures directes interdites.
- `tests/routines-ui.test.tsx` : tri-set créé hors ligne à travers l’écran, mode guidé A1 → A2 → A3 → A1, repos après le tour, confirmation avant dissociation ; groupe de routine et démarrage indépendant.

Les hôtes natifs restent simulés dans les tests UI. Les tests sur téléphone, notifications OS et raccordement Supabase réel ne sont pas déclarés réalisés. Aucun ajout de dépendance pour ce lot.

Formatage, ESLint et TypeScript passent sans erreur ni avertissement de lint. Les exports Hermes Android (1297 modules) et iOS (1267 modules) sont générés avec les commandes de groupe et le mode guidé.

## Lot 5 — dossiers de routines, 2026-09-06

82 tests passent dans 12 fichiers, dont 14 nouveaux :

- `tests/routine-folders.test.ts` : classement par dossier, insertion avant une routine, suppression avec conservation des graphes/séances, duplication dans le dossier source, imports/conversions sans dossier, références étrangères et ancrages périmés refusés, rollback, déplacements concurrents et réouverture sans écriture supplémentaire.
- Migration d’une vraie base v3 contenant un payload sans `folderId` et son opération en attente ; données inchangées et lecture compatible après v4. Résolution des zones de dépôt et annulation des cibles invalides.
- `tests/routines-ui.test.tsx` : gestes natifs grant/move/release/terminate jusqu’au service SQLite, déplacement entre dossiers et insertion, réorganisation de dossiers hors ligne, annulation sans outbox, parcours par boutons, création/renommage/suppression confirmée et dossier sélectionné conservé après édition.
- `tests/postgres.test.ts` : quatrième migration et outbox réelle, déplacements puis tombstone, séance conservée, répétition idempotente, mauvais propriétaire refusé par FK, lecture RLS et écriture directe interdite.

Les mesures et hôtes React Native sont simulés dans les tests d’interface. Le geste physique, les lecteurs d’écran et le défilement natif restent non vérifiés sur appareil. Le drag vise les éléments visibles ; les boutons permettent d’atteindre les dossiers hors écran. Aucune dépendance supplémentaire pour ce lot.

Formatage, ESLint et TypeScript passent. Les exports Hermes Android (1302 modules) et iOS (1278 modules) sont générés avec l’organisation des dossiers.

## Lot 6 — programmes, 2026-09-08

94 tests passent dans 13 fichiers, dont 12 nouveaux :

- `tests/programs.test.ts` : composition avec routines répétées, ordre, édition, duplication avec références partagées, snapshots indépendants, suppression des liens, refus des mauvais propriétaires et permutations invalides.
- Rollback des copies/suppressions/démarrages, garde contre les routines vides et démarrages concurrents, réouverture SQLite et migration v4 → v5 conservant les anciennes lignes et opérations en attente.
- `tests/routines-ui.test.tsx` : parcours hors ligne création/édition/composition/réorganisation/démarrage/duplication/suppression, champs invalides et routine vide sans création de séance.
- `tests/postgres.test.ts` : cinquième migration et outbox réelle, références répétées, copies et tombstones, idempotence, FK propriétaire, isolation RLS et écritures directes interdites.

Les exports Hermes Android (1307 modules) et iOS (1283 modules) sont générés. Les hôtes natifs des tests UI restent simulés ; aucun test sur téléphone ou serveur Supabase réel n’est déclaré réalisé. Aucune dépendance supplémentaire pour ce lot.

## Compatibilité Expo Go SDK 57 — 2026-09-08

Migration incrémentale SDK 55 → 56 → 57. Expo 57.0.21, React Native 0.86.3, React/renderer 19.2.3 et TypeScript 6.0.3 sont installés. Les versions natives Reanimated 4.5.1 et Worklets 0.10.1 sont explicites pour éviter les versions transitives incompatibles avec Expo Go.

Les 94 tests dans 13 fichiers et TypeScript passent après chaque étape. Sur SDK 57, `npm run check` passe (formatage, ESLint, TypeScript, tests), Expo Doctor valide 21/21 contrôles et les exports Hermes Android (1488 modules) et iOS (1353 modules) réussissent. `npm ls --depth=0` ne signale aucune dépendance invalide. L’installation npm signale encore 3 vulnérabilités modérées transitives ; aucune correction majeure forcée n’a été appliquée.

La configuration déclare les plugins de localisation et de barre de statut. `npm run go` sélectionne explicitement Expo Go. Le serveur Metro a été démarré sur localhost, son manifeste annonce GYMTRACK et `sdkVersion: 57.0.0`, puis le serveur de vérification a été arrêté. Les schémas SQLite et les migrations métier sont inchangés. L’exécution réelle sur téléphone et les builds APK/IPA restent à vérifier.
