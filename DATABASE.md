# Données

## SQLite v1

`src/database/migrations.ts` crée `schema_migrations`, `local_settings`, `exercises`, `workouts`, `workout_exercises`, `workout_sets`, `food_diary_entries` et `sync_queue`. Chaque entité possède id, owner_id, revision, payload JSON validé Zod et updated_at. Des colonnes générées/indexées exposent les relations et dates. Les foreign keys assurent les parents ; un index partiel impose une seule séance active par propriétaire.

Cette représentation évite de dupliquer les snapshots du transport et du stockage. Les futurs attributs nécessitant agrégation/index seront projetés en colonnes ou tables relationnelles au moyen de nouvelles migrations. Les tables contractuelles aliments, portions, nutriments de référence, plannings, santé, social, IA et abonnements ne sont pas encore implémentées.

Les modifications et l’outbox sont validées ensemble, sous mutex, dans une transaction `BEGIN IMMEDIATE` sur une connexion d’écriture dédiée. Une erreur annule les deux écritures. WAL, `synchronous=FULL` et foreign keys sont activés ; les réglages propres à une connexion sont appliqués à chaque writer avant BEGIN. Les schémas plus récents que l’app sont refusés sans effacement. Les suppressions de séries/entrées deviennent des tombstones pour la synchronisation ; ceci ne remplace pas le futur effacement RGPD.

## SQLite v2 — routines

`src/database/routinesMigration.ts` ajoute `routines`, `routine_exercises`, `routine_sets` et la référence nullable de `workouts` vers `routines`. Les enfants sont indexés par parent ; les clés étrangères composites des modèles contrôlent leur propriétaire. Le test d’upgrade crée une vraie base v1 avec une séance active et son outbox, puis applique v2 sans modifier ces données. Notes, repos et séries sont copiés lors d’un démarrage ; les suppressions de routine ne touchent pas les workouts existants.

## SQLite v3 — supersets

SQLite v3 ajoute `superset_groups` et les références de groupes des exercices de routine/séance via `src/database/supersetsMigration.ts`. Chaque groupe a exactement un parent ; les FK et triggers vérifient propriétaire/parent. Les payloads et queues v2 sont conservés à l’upgrade. Le nouveau champ nullable des modèles d’exercice se lit aussi quand il est absent des anciennes lignes.

## SQLite v4 — dossiers

`src/database/foldersMigration.ts` crée `routine_folders` et la référence nullable/indexée des routines. Les anciennes lignes sans `folderId` sont lues dans Sans dossier ; la migration ne réécrit pas leurs payloads ou queues. Les triggers et FK contrôlent le propriétaire du dossier. Les positions de routines sont désormais interprétées par dossier. Supprimer un dossier déplace ses routines vers la racine avant de créer son tombstone.

## SQLite v5 — programmes

`src/database/programsMigration.ts` ajoute `programs` et `program_routines`. Chaque occurrence possède une position et des références composites au programme et à la routine du même propriétaire. Une routine peut apparaître plusieurs fois. La migration préserve les anciennes lignes et opérations en attente. Les suppressions de programme ou routine retirent leurs liens dans la même transaction.

## PostgreSQL

`supabase/migrations/202609050001_training_sync.sql` définit profils, cinq tables du lot, receipts d’idempotence et RPC. PostgreSQL valide ownership, révisions, relations composites, valeurs de séries et nutriments. Les valeurs nutritionnelles JSONB utilisent des nombres PostgreSQL, sans arrondi de présentation.

Toutes les tables personnelles ont RLS. Les rôles applicatifs ne peuvent pas écrire directement les entités sync ; seule la RPC autorisée vérifie `auth.uid()`, la révision et la propriété. Lecture limitée au propriétaire, même si une métadonnée `privacy` vaut PUBLIC : aucun partage n’est activé par ce lot. Les tables distantes ne constituent pas encore le modèle relationnel complet des sections 167–174.

`supabase/migrations/202609060001_routines.sql` ajoute les trois tables de modèles, leurs contraintes, indexes et RLS. La RPC est étendue aux nouveaux types et conserve les mêmes garanties d’idempotence. La migration initiale reste inchangée. Le partage portable de routines se produit côté mobile après prévisualisation, sans ouvrir les politiques de lecture serveur.

`supabase/migrations/202609060002_supersets.sql` ajoute les groupes, leurs FK composites vers parent/propriétaire, les références des membres, indexes et RLS. La RPC accepte désormais `superset_groups` avec les mêmes vérifications d’identité, révision et idempotence.

`supabase/migrations/202609060003_routine_folders.sql` ajoute les dossiers, leur index de classement, RLS, la référence composite des routines et l’extension RPC à `routine_folders`.

`supabase/migrations/202609060004_programs.sql` ajoute les programmes et leurs occurrences, les indexes, les contraintes de propriétaire, RLS et l’extension RPC. Les tables contractuelles Training restent partielles, notamment les records matérialisés.
