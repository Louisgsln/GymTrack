# Supersets — lot 4

Exigences livrées : §24 (SupersetGroup, superset, tri-set, giant set, repos et navigation) et réordonnancement des séries de §22. Le reste du minuteur §25, notamment notifications locales et validation du cycle de vie natif, conserve son statut partiel.

## Utilisation

Dans une séance active ou l’éditeur de routine, « Organiser les exercices » permet de sélectionner de 2 à 200 exercices libres et de créer un groupe. Deux membres forment un superset, trois un tri-set, quatre ou plus un giant set. Les membres restent contigus et portent des repères A1, A2, etc. Les groupes suivants utilisent B, C, puis AA après Z. Le groupe prend la place du premier exercice sélectionné, et ses membres conservent leur ordre initial.

Les boutons Monter/Descendre déplacent un bloc entier ou un membre à l’intérieur du groupe. Un ordre incomplet, dupliqué, étranger ou séparant les membres d’un groupe est refusé. Les séries d’une séance active se réordonnent également ; chaque commande valide les identifiants complets et enregistre immédiatement ses modifications et son outbox dans une transaction SQLite.

Le repos entre tours accepte 0 à 3600 secondes. Le changement se fait explicitement avec « Appliquer ce repos au groupe ». Dissocier demande confirmation et conserve les exercices et séries. Dans une routine, retirer un membre dissocie son groupe entier ; la confirmation le précise. Pour changer la composition, dissocier puis sélectionner les nouveaux membres. Les séances déjà terminées restent inchangées.

## Navigation et repos

L’indication « À suivre » identifie la première série non validée dans l’ordre du circuit. Le mode guidé affiche uniquement cette série et avance après validation : A1 série 1 → A2 série 1 → A3 série 1 → A1 série 2. « Afficher toutes les séries » permet de revenir à l’édition complète. L’ordre se reconstruit à partir des positions et validations persistées ; après relance, l’indication reprend la bonne série. Le choix de présentation guidée est une préférence temporaire d’écran.

Un tour contient la série de même rang de chaque membre, en incluant tous les types de séries. Les séries supprimées sont retirées de l’ordre ; les membres sans série à ce rang sont sautés. Les nombres de séries peuvent donc différer. Une validation intermédiaire ne lance aucun repos. La validation qui complète le tour déclenche le repos du groupe, même si les séries ont été validées dans un autre ordre. Il remplace le repos individuel ; zéro signifie aucun minuteur. Le dernier tour déclenche aussi ce repos.

La dévalidation, la suppression, l’ajout ou la réorganisation des séries groupées annulent une échéance devenue potentiellement inadaptée. La réorganisation des exercices, la création/dissociation et le changement du repos du groupe annulent aussi l’échéance active. Modifier seulement la charge ou les répétitions ne change pas un repos déjà lancé. Les PR et performances précédentes gardent leurs règles propres ; le groupement n’ajoute aucune charge ou répétition.

## Données et copies

`superset_groups` contient un UUID, un propriétaire, une révision, exactement un parent workout/routine, un repos et un tombstone. SQLite v3 ajoute cette table et les références des membres ; les données v1/v2 restent lisibles. Les contraintes et triggers empêchent le rattachement à un groupe d’un autre propriétaire ou parent. Le service impose au moins deux membres libres et conserve les groupes contigus. Ces invariants de collection sont appliqués par les commandes atomiques ; la RPC distante continue de transférer une entité à la fois.

Les démarrages, répétitions, duplications et conversions créent de nouveaux groupes avant leurs membres dans la même transaction. Ni les membres ni le repos ne sont partagés par référence avec le modèle source. Une panne d’écriture annule le graphe et son outbox ; un groupe source manquant provoque une erreur plutôt qu’une copie amputée.

Le partage exporte maintenant `gymtrack.routine` version 2. Les groupes portent uniquement des indices d’exercices contigus et leur repos, jamais leurs UUID. La prévisualisation d’import décrit les membres et le repos. Les références hors limites, doublons, groupes chevauchants, membres non contigus, groupes de moins de deux et champs inconnus sont refusés. La version 1 reste importable sans groupe ; les anciennes applications qui ne comprennent que v1 ne peuvent pas importer v2.

`202609060002_supersets.sql` ajoute la table PostgreSQL, les références composites propriétaire/parent, les indexes, RLS et l’extension de la RPC idempotente. L’outbox place les parents avant leurs enfants et retire les références des membres avant les tombstones de groupe. La suppression d’une routine dissocie ses groupes sans toucher aux séances issues du modèle. Aucun raccordement cloud de l’application n’est prétendu par cette migration.

## Validation

Les tests SQLite couvrent tailles de groupes, ordre des tours, séries inégales, repos, dévalidation, réordonnancement, propriétaires et parents, copie indépendante, format v1/v2, rollback, reprise de fichier et upgrade v2 → v3. Les tests PostgreSQL rejouent la vraie outbox jusqu’aux copies et tombstones, contrôlent RLS et refusent les références à un autre parent.

Les tests d’interface passent par les écrans et services réels : création d’un tri-set hors ligne, navigation guidée, repos à la fin du tour, confirmation de dissociation, groupe de routine et démarrage indépendant. Les hôtes React Native et appels système sont simulés ; le rendu et le cycle de vie sur téléphone restent à vérifier.
