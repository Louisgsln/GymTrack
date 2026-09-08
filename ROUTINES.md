# Routines — lot 2

Exigences : §30 (routine, exercices, séries modèles, create/edit/duplicate/delete/reorder/share/start), §14 (démarrer une routine, répéter/copier une séance), §26 (notes) et §33 (historique vers routine).

## Parcours livré

L’onglet Planifier contient la bibliothèque, un éditeur et le partage/import. Création, modifications valides des champs, ajout/retrait de séries et réordonnancement sont persistés immédiatement avec l’outbox. Les boutons Monter/Descendre réordonnent les routines, leurs exercices et leurs séries. Depuis le lot 5, les dossiers §31 proposent aussi le glisser-déposer pour classer et déplacer les routines ; voir [ROUTINE_FOLDERS.md](ROUTINE_FOLDERS.md).

Une routine vide reste un brouillon éditable. Son démarrage nécessite au moins un exercice et une série par exercice. Un workout actif empêche tout autre démarrage ; aucune séance n’est remplacée implicitement. Le démarrage copie le graphe dans une seule transaction, remet toutes les séries à non validées et génère de nouveaux UUID. Le titre, les notes, les charges canoniques, les cibles, les notes d’exercice et le repos sont conservés comme valeurs indépendantes de la routine.

Depuis le détail d’une séance terminée : Répéter, Copier dans une nouvelle séance (titre choisi) et Enregistrer comme routine. Ces conversions incluent les séries non supprimées, même non validées, en tant que cibles ; elles ne recréent jamais une performance réalisée. Depuis le lot 4, les groupes de supersets sont copiés avec de nouveaux UUID et leur repos indépendant. Voir [SUPERSETS.md](SUPERSETS.md).

Supprimer une routine marque ses modèles, enfants et occurrences dans les programmes supprimés dans la même transaction. Les exercices personnels de référence et toutes les séances issues de la routine restent présents. Les tombstones sont destinés au protocole de synchronisation, pas à une politique finale de rétention RGPD. Les références partagées entre programmes sont décrites dans [PROGRAMS.md](PROGRAMS.md).

## Partage portable

Format JSON `gymtrack.routine`, version 2 depuis le lot 4 ; la version 1 reste importable. Le contenu contient nom, notes, définitions d’exercices, repos, cibles des séries et groupes représentés par les indices de leurs membres. La prévisualisation précède l’appel à la feuille de partage native ; aucun identifiant de compte, de séance ou de modèle ni timestamp de performance n’est exporté. Les notes et charges sont visibles dans la prévisualisation : le partage n’est pas automatique.

L’import se fait en collant le contenu reçu, en le vérifiant puis en confirmant. Les champs inconnus, versions incompatibles et valeurs invalides sont refusés. Limites de lecture : 500 000 caractères, 200 exercices et 200 séries par exercice par paquet. Aucune limite commerciale n’est appliquée au nombre de routines locales. Le destinataire reçoit de nouveaux UUID et des exercices privés indépendants ; deux définitions identiques dans le même paquet partagent une seule nouvelle définition locale.

Le partage par lien hébergé/deep link (§240) et les fonctions sociales restent distincts. Aucun backend n’est requis pour copier un contenu partagé.

## Données et validation

SQLite v2 et `202609060001_routines.sql` ajoutent routines/routine_exercises/routine_sets et leurs relations/indexes/contrôles. La RPC conserve l’idempotence et vérifie les propriétaires. Les tests appliquent la chaîne complète des migrations PostgreSQL, puis rejouent l’outbox de création/démarrage/suppression des routines.

Les lectures SQLite de TanStack Query utilisent `networkMode: always`. Le test d’écran passe explicitement le gestionnaire réseau en offline avant le premier rendu. Les services, hooks et repositories restent réels ; seuls les composants natifs et les appels au système sont remplacés dans ces tests React. La vérification sur appareil et le transfert effectif entre deux applications de partage restent à réaliser.
