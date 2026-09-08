# Architecture GYMTRACK

## Audit

Le dépôt initial contient uniquement le cahier des charges (sections 0 à 276), lu intégralement. Aucun code existant à préserver, aucune dépendance ou configuration secrète présente.

## Frontières

Expo Router → composants → hooks → services métier → repositories → sources SQLite/Supabase/providers. Les composants n’appellent jamais Supabase. Les domaines sont ajoutés à mesure de leur implémentation, sans dossiers vides prétendant implémenter une fonctionnalité.

SQLite est la source de vérité sur l’appareil. Zustand contient uniquement les préférences/session UI ; TanStack Query observe les lectures locales, pas la durabilité. Aucun enregistrement de séance ne dépend du réseau.

Chaque modification métier et son événement outbox sont atomiques dans une transaction `BEGIN IMMEDIATE`. UUID générés côté client. Un mutex sérialise une connexion d’écriture dédiée ; une autre connexion lit uniquement les données commitées. WAL et foreign keys sont activés avant les migrations versionnées. Les réglages foreign keys/synchronous sont aussi appliqués à la connexion d’écriture avant BEGIN : le helper exclusif Expo ouvre sinon une nouvelle connexion sans reprendre ces PRAGMA. Les tests exécutent les mêmes migrations/repositories et l’adaptateur structurel Expo sur de vrais fichiers SQLite (Node).

Les séries sont des entités indépendantes : modifier une série ne réécrit pas tout le workout. Les mutations portent une révision attendue. Le serveur applique un compare-and-swap et une clé d’idempotence dans une transaction. Un conflit conserve le payload local et un statut ERROR dans l’outbox ; aucun last-write-wins silencieux. Le premier transport est Supabase RPC, injectable mais pas encore raccordé à l’application, même si la configuration est renseignée. La synchronisation complète multi-appareils et son écran de résolution restent une tranche distincte.

Le mode local utilise un propriétaire UUID persistant. Il ne sera jamais attribué automatiquement au prochain compte connecté : la future connexion doit proposer une migration explicite et atomique et isoler les bases par compte. Aucune fausse authentification.

Les nutriments sont extensibles, les valeurs sources ne sont pas arrondies, et chaque journalisation copie un snapshot indépendant. Les dates de journal sont des dates civiles locales ; les instants sont UTC.

Les données serveur sont privées par défaut. Les migrations PostgreSQL définissent contraintes, indexes, RLS et RPC. Les secrets fournisseurs restent dans les fonctions serveur. Les futures intégrations passent par des interfaces métier ; les statuts d’absence de configuration sont explicites.

## Routines et lectures locales — lot 2

`RoutineService` gère les mutations via `RoutineRepository` et le repository d’entités. `WorkoutTemplateService` effectue les conversions atomiques routine ↔ séance ; `RoutineSharingService` produit et valide un format portable sans identifiants utilisateur. Les références aux modèles ne sont jamais utilisées pour recalculer rétroactivement une séance. Le repos par exercice est copié dans le workout ; les anciens workouts restent lisibles grâce à une valeur nullable avec fallback sur leur exercice.

Les champs numériques des cibles et des séries utilisent le même parseur et les mêmes schémas Zod. Les unités d’affichage ne changent pas le stockage canonique kg/mètres/secondes. Les routines importées avec durée/distance disposent de leurs champs de saisie correspondants.

TanStack Query a désormais une fabrique dédiée aux lectures locales, avec `networkMode: always`. Une coupure réseau ne peut pas suspendre l’ouverture ou le rafraîchissement du journal, des séances ou des routines. Les futures requêtes distantes devront configurer leur propre comportement réseau.

Lot 3 : `TrainingService.state()` lit les quatre ensembles Training dans une transaction cohérente, puis construit la projection pure `buildPerformance`. L’interface reçoit les comparaisons par série et les records par séance sans accès direct au stockage. Cette projection se reconstruit à partir des données durables et ne crée pas une seconde source de vérité ou une queue de records à synchroniser. Les règles et limites sont décrites dans `TRAINING_CALCULATIONS.md`.

Lot 4 : `SupersetService` gère création, dissociation, repos et réorganisation sous transaction. Les routines et séances utilisent le même modèle de groupe, avec un parent exclusif. `copyGroups` alloue les identités de destination avant la copie des membres. Les fonctions pures de `supersets.ts` calculent les blocs, les repères et les tours ; le service Training décide du minuteur dans la transaction de validation de série. L’UI propose un mode guidé sans maintenir une seconde position de progression persistée.

Lot 5 : `RoutineFolderService` fournit une lecture transactionnelle dossiers/routines et les commandes de classement. Les positions sont locales à chaque dossier. L’interface délègue le dépôt natif mesuré et les déplacements par boutons aux mêmes services. La sélection de dossier appartient à l’écran Plan pour survivre aux allers-retours dans l’éditeur, tandis que l’appartenance des routines est durable dans SQLite.

Lot 6 : `ProgramService` gère les programmes et leurs occurrences ordonnées de routines. La duplication conserve les références aux modèles ; le démarrage appelle le service de snapshot dans la même transaction. La suppression d’une routine retire aussi ses occurrences. Les lectures et écritures restent locales, avec outbox atomique et contrôles de propriétaire.

## Références techniques

- [Installation Expo Router](https://docs.expo.dev/router/installation/)
- [SQLite Expo et transactions exclusives](https://docs.expo.dev/versions/v55.0.0/sdk/sqlite/)
