# Calculs Training

Stockage canonique kg. Une livre vaut exactement 0,45359237 kg ; conversion à l’affichage sans réarrondir la valeur stockée. Les champs acceptent virgule ou point décimal.

Le volume de cette tranche poids × répétitions additionne uniquement les séries validées non supprimées, hors WARMUP. Une série dévalidée cesse immédiatement de contribuer. Le nombre de séries validées inclut les échauffements.

Epley : `poids × (1 + reps / 30)` ; pour une répétition, la charge réalisée est conservée. Zéro répétition ou entrée invalide retourne zéro dans le calcul pur. L’interface `OneRepMaxFormula` permet d’injecter une autre formule. Le record d’estimation reste distinct d’une charge maximale effectivement réalisée ; les séries longues ne sont pas plafonnées par une règle arbitraire.

Le minuteur conserve `restEndsAt` en UTC. L’écran calcule `max(0, ceil((échéance − maintenant)/1000))` et reprend après suspension. +15/−15 et Skip mettent à jour SQLite. Les notifications/background OS ne sont pas encore implémentées ; l’horloge murale du téléphone peut être modifiée par l’utilisateur.

Lot 4 : pour un exercice groupé, le repos appartient au groupe et commence quand toutes les séries présentes au rang du tour sont validées. Les membres sans série à ce rang sont sautés. Zéro seconde signifie aucune échéance. Le mode guidé suit le même ordre de tours que le moteur de repos. Les règles de modification et de reprise sont détaillées dans [SUPERSETS.md](SUPERSETS.md).

Les types distance/durée/poids du corps sont prévus dans les schémas et validés lors de la complétion. L’interface de cette tranche crée seulement des exercices poids × répétitions. Les statistiques de volume ne doivent pas être étendues aux autres types sans définir leurs règles propres.

Lot 2 : les champs des séries et des cibles de routine partagent `parseTargetInput` et affichent les mesures correspondant au type d’exercice, y compris les définitions importées avec durée/distance. La création manuelle d’exercice reste poids × répétitions. Le repos copié depuis une routine est utilisé avant le défaut de l’exercice ; les modifications ultérieures du modèle ne changent pas la séance. Les conversions de séance en modèle retirent toute information de validation/completion.

## Lot 3 — performances précédentes et records

`buildPerformance` reconstruit les comparaisons et les records depuis un état SQLite cohérent, sans modifier les séries ni ajouter d’événement outbox. Les résultats sont disponibles hors ligne et identiques après réouverture du fichier.

La précédente performance recherche le même identifiant d’exercice, son rang d’occurrence dans la séance (si cet exercice apparaît plusieurs fois), puis le même type de série et son rang parmi les séries de ce type. La dernière séance terminée avant le début de la séance active contenant une série validée de ce type fait référence. Une séance abandonnée, une occurrence vide ou un type sans série validée est ignoré. Une série manquante ou dévalidée au rang recherché affiche explicitement l’absence de comparaison, sans décaler les séries suivantes. Les séries supprimées sont retirées de l’ordre. Le nom ne sert jamais de clé de rapprochement. Charge, reps et RPE sont affichés, ainsi que durée/distance pour les types correspondants ; kg/lb ne modifie que l’affichage.

Les cinq PR sont calculés **par exercice** :

| Type               | Mesure                                                                                 |
| ------------------ | -------------------------------------------------------------------------------------- |
| MAX_WEIGHT         | Plus grande charge d’une série poids × reps validée                                    |
| MAX_REPS           | Plus grand nombre de répétitions d’une série poids × reps ou poids du corps            |
| MAX_SET_VOLUME     | Plus grand produit charge kg × reps d’une série                                        |
| MAX_ESTIMATED_1RM  | Plus grande estimation de la formule injectée, Epley par défaut                        |
| MAX_WORKOUT_VOLUME | Somme charge kg × reps de cet exercice dans une séance, toutes ses occurrences réunies |

Seules les séries validées non supprimées, hors WARMUP, contribuent. Les quatre métriques de charge concernent WEIGHT_REPS. Le poids du corps contribue uniquement à MAX_REPS : aucune masse corporelle manquante n’est inventée. Assistance, durée et distance ne produisent pas artificiellement ces records de charge/répétitions ; leurs métriques spécifiques restent une extension future. MAX_REPS compare le nombre de répétitions toutes charges confondues, pas un record par palier de charge.

Une première valeur positive est étiquetée « Première référence ». Une égalité ne crée pas un record ; la comparaison utilise une tolérance relative de 1e-9 pour les écarts flottants de conversion. Pour chaque séance, une seule meilleure valeur par exercice/type est retenue, avec la valeur précédente et l’identifiant de la série source (sauf le volume agrégé). L’ordre historique est commencé le, terminé le, puis UUID en cas d’égalité complète. Les records actifs sont provisoires et comparés seulement aux séances terminées avant leur début.

Après modification, dévalidation, suppression ou abandon, les records sont reconstruits. Les séances terminées montrent leurs records au moment de leur position dans l’historique, même si une séance ultérieure les dépasse. Une correction des données sources reconstruit également les records suivants. L’édition de séances déjà terminées n’est pas ajoutée par ce lot. Les records sont une projection des données durables ; la table matérialisée `personal_records` de §168 et les agrégats distants de §234 restent à réaliser.
