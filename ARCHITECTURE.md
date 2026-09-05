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

## Références techniques

- [Installation Expo Router](https://docs.expo.dev/router/installation/)
- [SQLite Expo et transactions exclusives](https://docs.expo.dev/versions/v55.0.0/sdk/sqlite/)
