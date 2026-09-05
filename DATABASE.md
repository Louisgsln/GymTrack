# Données

## SQLite v1

`src/database/migrations.ts` crée `schema_migrations`, `local_settings`, `exercises`, `workouts`, `workout_exercises`, `workout_sets`, `food_diary_entries` et `sync_queue`. Chaque entité possède id, owner_id, revision, payload JSON validé Zod et updated_at. Des colonnes générées/indexées exposent les relations et dates. Les foreign keys assurent les parents ; un index partiel impose une seule séance active par propriétaire.

Cette représentation évite de dupliquer les snapshots du transport et du stockage. Les futurs attributs nécessitant agrégation/index seront projetés en colonnes ou tables relationnelles au moyen de nouvelles migrations. Les tables contractuelles routines, aliments, portions, nutriments de référence, plannings, santé, social, IA et abonnements ne sont pas encore implémentées.

Les modifications et l’outbox sont validées ensemble, sous mutex, dans une transaction `BEGIN IMMEDIATE` sur une connexion d’écriture dédiée. Une erreur annule les deux écritures. WAL, `synchronous=FULL` et foreign keys sont activés ; les réglages propres à une connexion sont appliqués à chaque writer avant BEGIN. Les schémas plus récents que l’app sont refusés sans effacement. Les suppressions de séries/entrées deviennent des tombstones pour la synchronisation ; ceci ne remplace pas le futur effacement RGPD.

## PostgreSQL

`supabase/migrations/202609050001_training_sync.sql` définit profils, cinq tables du lot, receipts d’idempotence et RPC. PostgreSQL valide ownership, révisions, relations composites, valeurs de séries et nutriments. Les valeurs nutritionnelles JSONB utilisent des nombres PostgreSQL, sans arrondi de présentation.

Toutes les tables personnelles ont RLS. Les rôles applicatifs ne peuvent pas écrire directement les entités sync ; seule la RPC autorisée vérifie `auth.uid()`, la révision et la propriété. Lecture limitée au propriétaire, même si une métadonnée `privacy` vaut PUBLIC : aucun partage n’est activé par ce lot. Les tables distantes ne constituent pas encore le modèle relationnel complet des sections 167–174.
