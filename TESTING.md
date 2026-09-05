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
