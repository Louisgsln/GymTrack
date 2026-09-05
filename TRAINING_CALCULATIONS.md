# Calculs Training

Stockage canonique kg. Une livre vaut exactement 0,45359237 kg ; conversion à l’affichage sans réarrondir la valeur stockée. Les champs acceptent virgule ou point décimal.

Le volume de cette tranche poids × répétitions additionne uniquement les séries validées non supprimées, hors WARMUP. Une série dévalidée cesse immédiatement de contribuer. Le nombre de séries validées inclut les échauffements.

Epley : `poids × (1 + reps / 30)` ; pour une répétition, la charge réalisée est conservée. Zéro répétition ou entrée invalide retourne zéro dans le calcul pur. Cette estimation ne constitue pas un PR certifié. Détection/historisation des PR, calcul par exercice et règles de pertinence pour séries longues restent à implémenter.

Le minuteur conserve `restEndsAt` en UTC. L’écran calcule `max(0, ceil((échéance − maintenant)/1000))` et reprend après suspension. +15/−15 et Skip mettent à jour SQLite. Les notifications/background OS ne sont pas encore implémentées ; l’horloge murale du téléphone peut être modifiée par l’utilisateur.

Les types distance/durée/poids du corps sont prévus dans les schémas et validés lors de la complétion. L’interface de cette tranche crée seulement des exercices poids × répétitions. Les statistiques de volume ne doivent pas être étendues aux autres types sans définir leurs règles propres.
