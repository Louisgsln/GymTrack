# Dossiers de routines — lot 5

La section §31 est implémentée avec `RoutineFolder`, classement des routines et glisser-déposer. Les programmes §32 restent une tranche distincte.

## Parcours

Dans Planifier, les boutons de dossier filtrent la bibliothèque ; « Sans dossier » contient les routines non classées. Créer une routine la place dans le dossier sélectionné. Ce filtre est conservé au retour de l’éditeur et du partage. Si le dossier est supprimé, la bibliothèque revient à Sans dossier. La bibliothèque garde sa pagination de 20 routines dans chaque dossier.

« Organiser les dossiers » ouvre la création, le renommage, la suppression et les déplacements. Les dossiers forment un seul niveau, sans hiérarchie implicite ni exemples de données injectés. Un nom doit contenir de 1 à 160 caractères après suppression des espaces aux extrémités.

La poignée « Glisser » capte le geste natif, suit le doigt et indique la cible survolée. Déposer une routine sur un dossier l’ajoute à sa fin ; la déposer sur une autre routine l’insère avant cette dernière, dans son dossier. Les dossiers se déposent avant un autre dossier ou sur « Fin des dossiers ». Le dépôt sur soi-même, hors cible ou interrompu est annulé sans écriture.

Les cibles sont les zones visibles mesurées au début du geste. Il n’y a pas de défilement automatique pendant le drag. Pour une cible hors écran, les boutons « Déplacer la routine » puis « Déplacer vers » permettent de choisir n’importe quel dossier ; Monter/Descendre permet de réordonner les dossiers et les routines sans geste tactile. Ces commandes utilisent les mêmes transactions que le glisser-déposer.

## Conservation des données

Supprimer un dossier demande confirmation. Ses routines sont ajoutées à la fin de Sans dossier, dans leur ordre relatif actuel. Le dossier devient un tombstone ; les routines, exercices, groupes et séries ne sont pas supprimés. Les séances déjà créées depuis ces routines restent intactes.

Une duplication locale conserve le dossier source et s’ajoute à sa fin. Les imports portables et les conversions depuis l’historique créent des routines dans Sans dossier. Le partage d’une routine n’expose ni le nom ni l’identifiant de son dossier ; le format v2 ne change pas.

Les positions de routines sont interprétées dans leur dossier. Une opération de déplacement travaille sur les données courantes dans la transaction, avec un identifiant de routine cible plutôt qu’un index périmé. Si cette cible n’appartient plus au dossier prévu, la commande échoue. Les permutations incomplètes, doublons, dossiers supprimés et données d’un autre propriétaire sont refusés. Les mutations d’entités et l’outbox sont validées ou annulées ensemble.

## Stockage et migrations

SQLite v4 ajoute `routine_folders` et la référence nullable `routines.folderId`. Les payloads anciens sans ce champ se lisent comme Sans dossier, sans réécriture de l’historique ni des opérations en attente. Les indexes couvrent propriétaire, dossier et position. Les FK et triggers empêchent de référencer le dossier d’un autre propriétaire.

`202609060003_routine_folders.sql` ajoute la table PostgreSQL, RLS, la FK composite dossier/propriétaire et le support RPC idempotent. L’outbox crée le dossier avant d’y rattacher des routines ; la suppression retire les références avant le tombstone du dossier. Le raccordement de l’application au cloud reste à implémenter et vérifier.

`RoutineFolderService.library()` lit dossiers et routines dans la même transaction SQLite. L’interface utilise cette vue cohérente et les requêtes locales fonctionnent sans réseau. Un redémarrage retrouve les dossiers et leur classement ; le choix de filtre d’écran n’est pas une préférence durable.

## Vérifications

Les tests métier utilisent SQLite : déplacements, insertions, classement par dossier, duplication/import, suppression sans perte, accès étrangers, concurrence, rollback sur panne, réouverture et migration depuis une base v3 contenant un payload et une outbox anciens.

Les tests d’interface exécutent les événements grant/move/release/terminate du composant de drag, jusqu’aux vraies écritures SQLite. Ils vérifient les déplacements entre dossiers, l’insertion avant une routine, le classement des dossiers, l’annulation, les commandes équivalentes par boutons, la confirmation de suppression et le filtre après édition. La géométrie native est simulée : la précision tactile, le rendu, les lecteurs d’écran et les interactions avec le défilement restent à vérifier sur appareil.

Les tests PostgreSQL appliquent la vraie outbox, vérifient la conservation des séances après suppression du dossier, l’idempotence, les références inter-propriétaires refusées et les politiques de lecture/écriture.
