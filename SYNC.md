# Synchronisation

## Implémenté et vérifié

Chaque mutation reçoit un UUID, un propriétaire, une entité, un payload, une révision attendue et une date UTC. La même transaction conserve les données et l’opération PENDING. Le worker FIFO utilise SYNCING puis SYNCED ; après redémarrage, SYNCING est remis à PENDING. Le même operation_id est réutilisé lorsqu’une réponse réseau est perdue après commit serveur.

Retry exponentiel plafonné à cinq minutes. Les opérations restent stockées indéfiniment tant qu’elles ne sont pas résolues. Deux flush simultanés du même moteur partagent une seule exécution. Une instance du moteur par propriétaire/base est requise.

Le serveur compare la révision attendue et écrit la nouvelle valeur ainsi que le reçu d’idempotence dans sa transaction. Un conflit devient ERROR/CONFLICT et bloque la suite de la queue, afin de ne pas appliquer des enfants d’une écriture rejetée. Le contenu local reste intact. Les séries sont des entités indépendantes.

Les tests utilisent le vrai repository SQLite et des transports de test pour les ruptures réseau ; un second groupe rejoue de vrais payloads locaux dans PostgreSQL embarqué, avec RLS et RPC réelles.

Le lot 2 étend les types synchronisables à `routines`, `routine_exercises` et `routine_sets`. Les parents sont créés avant les enfants ; les suppressions marquent les enfants puis le parent dans la même transaction locale. Les tests rejouent toute la queue jusqu’aux tombstones et vérifient que le workout issu d’une routine supprimée reste lisible côté serveur. Cette validation du protocole n’active pas le transport cloud dans l’application.

Le lot 4 ajoute `superset_groups`. Création/copie : parent routine ou workout → groupe → membres → séries. Dissociation : membres sans référence → tombstone de groupe. Les tests PostgreSQL appliquent la vraie outbox comprenant ces transitions et vérifient les références composites propriétaire/parent, les reçus de répétition et les politiques de lecture. Le groupe et ses membres sont atomiques localement ; l’API distante garde sa granularité par entité.

Le lot 5 ajoute `routine_folders`. Le dossier précède ses références de routines dans l’outbox. Sa suppression déplace les routines dans Sans dossier avant d’enregistrer le tombstone. Les mouvements inter-dossiers ne recopient pas le graphe de routine ou les séances. La quatrième migration/RPC et ces transitions sont testées dans PostgreSQL embarqué avec les contrôles propriétaire et idempotence.

Le lot 6 ajoute `programs` et `program_routines`. Les parents programme/routine précèdent leurs occurrences dans l’outbox ; leurs liens sont retirés avant les tombstones des parents. La duplication conserve les références aux routines. La cinquième migration étend la RPC avec les mêmes contrôles de révision, propriétaire et idempotence. Ces transitions sont testées dans PostgreSQL embarqué ; le transport réel reste à brancher.

## Pas encore activé dans l’app

Le mode local conserve l’outbox mais n’envoie rien au cloud. Restent : connexion Supabase, migration explicite du propriétaire local, pull avec curseurs serveur, réception des changements, raccordement réseau/app-state, écran de résolution de conflit, gestion des erreurs permanentes, limites et compactage sûrs de l’outbox, rétention des tombstones et reçus, stress multi-appareils. Ces points sont IN_PROGRESS/NOT_STARTED, pas TESTED.

Le cache TanStack Query n’est jamais utilisé comme stockage durable. Aucune suppression locale n’est déclenchée par une erreur de sync ou de configuration.
