# Synchronisation

## Implémenté et vérifié

Chaque mutation reçoit un UUID, un propriétaire, une entité, un payload, une révision attendue et une date UTC. La même transaction conserve les données et l’opération PENDING. Le worker FIFO utilise SYNCING puis SYNCED ; après redémarrage, SYNCING est remis à PENDING. Le même operation_id est réutilisé lorsqu’une réponse réseau est perdue après commit serveur.

Retry exponentiel plafonné à cinq minutes. Les opérations restent stockées indéfiniment tant qu’elles ne sont pas résolues. Deux flush simultanés du même moteur partagent une seule exécution. Une instance du moteur par propriétaire/base est requise.

Le serveur compare la révision attendue et écrit la nouvelle valeur ainsi que le reçu d’idempotence dans sa transaction. Un conflit devient ERROR/CONFLICT et bloque la suite de la queue, afin de ne pas appliquer des enfants d’une écriture rejetée. Le contenu local reste intact. Les séries sont des entités indépendantes.

Les tests utilisent le vrai repository SQLite et des transports de test pour les ruptures réseau ; un second groupe rejoue de vrais payloads locaux dans PostgreSQL embarqué, avec RLS et RPC réelles.

## Pas encore activé dans l’app

Le mode local conserve l’outbox mais n’envoie rien au cloud. Restent : connexion Supabase, migration explicite du propriétaire local, pull avec curseurs serveur, réception des changements, raccordement réseau/app-state, écran de résolution de conflit, gestion des erreurs permanentes, limites et compactage sûrs de l’outbox, rétention des tombstones et reçus, stress multi-appareils. Ces points sont IN_PROGRESS/NOT_STARTED, pas TESTED.

Le cache TanStack Query n’est jamais utilisé comme stockage durable. Aucune suppression locale n’est déclenchée par une erreur de sync ou de configuration.
