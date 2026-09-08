# Programmes — lot 6

La section §32 est disponible dans Planifier → Programmes. Un programme contient un nom, des notes et une liste ordonnée de routines. Une même routine peut apparaître plusieurs fois, par exemple Push/Pull/Legs répété sur six séances. Aucun programme prérempli n’est injecté.

Création, édition, ajout/retrait de routines, réorganisation, duplication et suppression fonctionnent hors ligne avec sauvegarde immédiate. Un programme vide reste un brouillon. Chaque occurrence possède son propre UUID et sa position ; les routines restent des références partagées. Modifier une routine met donc à jour son modèle dans tous ses programmes. Dupliquer un programme copie ses occurrences avec de nouveaux UUID, en conservant les références aux routines.

Démarrer une occurrence copie le graphe de routine dans une séance indépendante, avec de nouveaux UUID, ses groupes et ses séries non validées. Une séance active empêche un second démarrage. Les routines vides sont refusées sans créer de séance. Les modifications ultérieures du modèle ne changent pas les séances existantes.

Supprimer un programme supprime ses liens, en conservant les routines et les séances. Supprimer une routine retire ses occurrences de tous les programmes dans la même transaction et conserve les séances existantes. Chaque mutation et son outbox sont atomiques ; une panne annule l’ensemble.

SQLite v5 et la cinquième migration PostgreSQL ajoutent `programs` et `program_routines`, leurs indexes, les références composites par propriétaire et les politiques RLS. La RPC applique les mêmes contrôles de révision et d’idempotence que les autres entités.

Cette tranche ne comprend pas de calendrier, de progression automatique ou de partage d’un programme complet. Le partage de routines reste disponible séparément. Les tests couvrent les services, la reprise SQLite, les migrations, l’interface hors ligne et PostgreSQL embarqué. La validation sur téléphone et la synchronisation Supabase réelle restent à réaliser.
