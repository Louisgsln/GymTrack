Tu es à la fois :

- Staff Software Engineer mobile
- Staff Backend Engineer
- architecte PostgreSQL
- ingénieur React Native
- ingénieur IA
- Product Designer mobile
- expert UX fitness
- expert data nutrition
- QA Engineer
- DevOps Engineer
- Security Engineer

Ta mission est de construire de A à Z une application mobile complète de fitness combinant :

1. le niveau fonctionnel d'une excellente application de tracking de musculation telle que Hevy ;
2. le niveau fonctionnel d'une excellente application de nutrition telle que MyFitnessPal ;
3. une intégration profonde entre entraînement, alimentation, poids, activité et progression.

Le résultat ne doit PAS être une simple démonstration.

Il doit s'agir d'un véritable produit pouvant progressivement devenir une application commercialisable.

# 0. RÈGLE ABSOLUE : PARITÉ FONCTIONNELLE, PAS COPIE PROPRIÉTAIRE

S'inspirer du fonctionnement et des concepts fonctionnels de produits comme Hevy et MyFitnessPal.

Ne jamais :

- copier leur code ;
- décompiler leurs applications ;
- scraper leur base alimentaire ;
- récupérer leurs images ;
- récupérer leurs animations ;
- réutiliser leur logo ;
- réutiliser leur nom ;
- reproduire exactement leurs écrans pixel par pixel ;
- copier leur texte marketing ;
- copier leurs illustrations ;
- copier une base de données propriétaire ;
- utiliser un endpoint privé ou non autorisé.

Créer :

- une identité graphique originale ;
- un design system original ;
- des textes originaux ;
- une architecture originale ;
- des algorithmes documentés ;
- une base de données légalement exploitable.

Objectif :

PARITÉ FONCTIONNELLE ET QUALITÉ UX.

Pas :

CLONE VISUEL EXACT.

---

# 1. NOM DU PRODUIT

Nom temporaire :

GYMTRACK

Tout le branding doit être centralisé afin que le nom puisse être changé facilement.

Créer :

APP_NAME
APP_SLUG
APP_SCHEME
BRAND_CONFIG

Aucun nom de produit concurrent ne doit apparaître dans l'interface finale.

---

# 2. OBJECTIF PRODUIT

GYMTRACK doit permettre à une personne d'utiliser UNE SEULE application pour :

- suivre ses entraînements ;
- planifier ses entraînements ;
- enregistrer toutes ses séries ;
- suivre ses records ;
- analyser sa progression ;
- suivre calories ;
- suivre protéines ;
- suivre glucides ;
- suivre lipides ;
- suivre fibres ;
- suivre micronutriments ;
- scanner des produits ;
- reconnaître un repas à partir d'une photo ;
- enregistrer un repas par la voix ;
- créer des recettes ;
- planifier ses repas ;
- créer une liste de courses ;
- suivre son poids ;
- suivre ses mensurations ;
- suivre ses pas ;
- suivre son activité ;
- suivre son hydratation ;
- suivre éventuellement son jeûne ;
- synchroniser ses appareils de santé ;
- recevoir des analyses intelligentes ;
- utiliser un coach IA ;
- partager ses entraînements ;
- suivre des amis ;
- comparer ses performances ;
- consulter l'historique complet de ses données.

L'application doit comprendre qu'entraînement et nutrition sont liés.

---

# 3. PRINCIPES NON NÉGOCIABLES

Le produit doit être :

- offline-first pour les fonctions essentielles ;
- extrêmement rapide ;
- fiable ;
- typé ;
- testable ;
- modulaire ;
- sécurisé ;
- accessible ;
- internationalisable ;
- responsive ;
- maintenable.

Priorité générale :

1. aucune perte de données ;
2. fonctionnement du workout tracker ;
3. fonctionnement du journal alimentaire ;
4. rapidité de saisie ;
5. offline ;
6. synchronisation ;
7. précision des calculs ;
8. UX ;
9. statistiques ;
10. fonctionnalités sociales ;
11. esthétique.

---

# 4. STACK MOBILE

Utiliser :

React Native
Expo
TypeScript strict
Expo Router

Ajouter lorsque pertinent :

React Native Reanimated
React Native Gesture Handler
React Native SVG
FlashList
Expo Camera
Expo Image
Expo Notifications
Expo Haptics
Expo Secure Store
Expo File System

State :

Zustand

Server state :

TanStack Query

Forms :

React Hook Form

Validation :

Zod

Charts :

bibliothèque React Native performante et maintenue.

Ne jamais utiliser :

any

sauf justification documentée exceptionnelle.

---

# 5. STOCKAGE LOCAL

Utiliser SQLite.

Le téléphone possède une véritable base locale.

Stocker localement au minimum :

- séance active ;
- séries ;
- routines ;
- exercices récemment utilisés ;
- journal alimentaire récent ;
- aliments favoris/récents nécessaires ;
- repas ;
- recettes ;
- objectifs ;
- poids ;
- paramètres ;
- file de synchronisation.

Une interruption réseau ne doit jamais empêcher :

- de terminer une série ;
- d'enregistrer un aliment déjà accessible ;
- de terminer un workout ;
- d'enregistrer son poids ;
- d'éditer une donnée locale.

---

# 6. BACKEND

Utiliser Supabase comme première implémentation :

PostgreSQL
Supabase Auth
Supabase Storage
Supabase Realtime
Row Level Security
Edge Functions

Mais ne jamais coupler directement l'interface à Supabase.

Architecture :

UI
↓
Hooks
↓
Service
↓
Repository
↓
Data source

Data sources :

SQLite
Supabase
External Providers

Exemple :

FoodSearchScreen
↓
useFoodSearch()
↓
FoodService
↓
FoodRepository
↓
FoodProvider

---

# 7. ARCHITECTURE DU CODE

Créer notamment :

/app

/src
  /components
  /features
    /auth
    /onboarding
    /dashboard
    /training
    /exercises
    /routines
    /nutrition
    /foods
    /recipes
    /meals
    /meal-planner
    /grocery
    /water
    /fasting
    /activity
    /progress
    /measurements
    /social
    /community
    /coach
    /notifications
    /integrations
    /subscription

  /services
  /repositories
  /providers
  /database
  /sync
  /store
  /hooks
  /theme
  /types
  /utils
  /constants
  /i18n

/supabase
  /migrations
  /functions
  /seed

/tests

/docs

---

# 8. DESIGN SYSTEM

Créer :

colors.ts
spacing.ts
typography.ts
radius.ts
shadows.ts
icons.ts
motion.ts

Support :

LIGHT
DARK
SYSTEM

Le design doit être original.

Style souhaité :

- moderne ;
- premium ;
- très lisible ;
- très rapide ;
- dense lorsque nécessaire ;
- adapté à l'utilisation en salle ;
- adapté à la saisie alimentaire quotidienne.

---

# 9. NAVIGATION

Concevoir une navigation originale avec au maximum 5 destinations principales.

Proposition :

TODAY
TRAIN
PLAN
PROGRESS
PROFILE

Ajouter un bouton global "+" contextuel.

Le bouton permet notamment :

- Log Food
- Scan Barcode
- Scan Meal
- Voice Log
- Log Water
- Log Weight
- Start Workout
- Add Exercise
- Quick Add

Les fonctionnalités sociales peuvent être accessibles depuis Today/Profile/Discover.

Ne pas sacrifier l'ergonomie pour reproduire une navigation concurrente.

---

# 10. AUTHENTIFICATION

Support :

Email + Password
Sign in with Apple
Google Sign-In

Fonctions :

- register ;
- login ;
- logout ;
- forgotten password ;
- email verification ;
- session refresh ;
- account deletion ;
- reauthentication ;
- multi-device sessions.

Stocker les tokens sensibles correctement.

---

# 11. ONBOARDING GLOBAL

Créer un onboarding progressif.

Demander uniquement ce qui est nécessaire.

Données possibles :

username
display name
avatar
date de naissance
sexe biologique facultatif lorsque nécessaire aux calculs énergétiques
taille
poids
unité
objectif de poids
niveau d'activité
objectif fitness
expérience musculation
nombre de séances hebdomadaires
équipements disponibles
préférences alimentaires
allergènes éventuels
préférences unités

Objectifs :

LOSE_WEIGHT
GAIN_WEIGHT
MAINTAIN_WEIGHT
BUILD_MUSCLE
GAIN_STRENGTH
IMPROVE_HEALTH
CUSTOM

Ne jamais présenter les estimations nutritionnelles comme un diagnostic médical.

---

# 12. DASHBOARD TODAY

TODAY est la synthèse quotidienne.

Afficher :

Calories consommées
Calories objectif
Calories restantes

Macros :

Protein
Carbs
Fat

Puis :

repas du jour
entraînement prévu/effectué
eau
pas
activité
streak
poids récent

Actions rapides.

L'utilisateur doit comprendre sa journée en moins de 3 secondes.

---

# 13. MOTEUR D'ENTRAÎNEMENT

Implémenter une véritable séance active.

Workout :

id
user_id
title
routine_id
started_at
finished_at
duration
notes
privacy
created_at
updated_at

La séance doit survivre à :

- fermeture app ;
- crash ;
- perte réseau ;
- verrouillage écran ;
- redémarrage téléphone.

---

# 14. DÉMARRAGE WORKOUT

Permettre :

Start Empty Workout

Start Routine

Repeat Previous Workout

Copy Workout

Resume Active Workout

Lorsqu'un workout actif existe :

Workout in progress

Push Day

47 minutes

Resume

Discard

Le bouton Discard demande confirmation.

---

# 15. EXERCISE DATABASE

Exercise :

id
name
aliases
primary_muscle
secondary_muscles
equipment
exercise_type
instructions
media
source
created_at

Types :

WEIGHT_REPS
BODYWEIGHT_REPS
ASSISTED_BODYWEIGHT
WEIGHT_DURATION
DURATION
DISTANCE
DISTANCE_DURATION

---

# 16. MUSCLES

Modèle extensible.

Exemples :

chest
upper_chest
back
lats
traps
rear_delts
front_delts
side_delts
biceps
triceps
forearms
abs
obliques
glutes
quadriceps
hamstrings
calves
adductors
lower_back

Séparer :

primary muscle

secondary muscles

pour les statistiques.

---

# 17. ÉQUIPEMENTS

Supporter notamment :

Barbell
Dumbbell
Cable
Machine
Smith Machine
Bodyweight
Assisted
Kettlebell
Resistance Band
EZ Bar
Trap Bar
Plate
Other

---

# 18. EXERCICES PERSONNALISÉS

Créer Custom Exercise.

Champs :

name
muscles
equipment
tracking_type
instructions
media
default_rest_timer

Ils doivent fonctionner exactement comme les exercices natifs.

---

# 19. EXERCISE PICKER

Recherche instantanée.

Filtres :

muscle
equipment
favorites
recent
custom
exercise type

Afficher :

nom
muscle
equipment
miniature

Possibilité de sélectionner plusieurs exercices.

---

# 20. SÉRIES

Afficher :

SET
PREVIOUS
KG
REPS
RPE
✓

Exemple :

1 | 100×8 | 102.5 | 8 | 8 | ✓

Saisies ultra rapides.

Un tap sur le poids ouvre directement le clavier numérique.

---

# 21. TYPES DE SÉRIES

NORMAL
WARMUP
DROP_SET
FAILURE

Architecture extensible pour :

AMRAP
BACKOFF
MYO_REP
CUSTOM

---

# 22. SET OPERATIONS

Supporter :

add
delete
duplicate
reorder
edit
complete
uncomplete

Chaque modification est sauvegardée immédiatement localement.

---

# 23. RPE / RIR

RPE :

6
6.5
7
7.5
8
8.5
9
9.5
10

Prévoir également éventuellement RIR.

Paramètre utilisateur :

RPE
RIR
OFF

---

# 24. SUPERSETS

Supporter :

superset
tri-set
giant set

Créer SupersetGroup.

Exemple :

A1 Bench
A2 Fly

Les timers et la navigation doivent comprendre ce groupement.

---

# 25. REST TIMER

Timer personnalisable :

30 sec
45 sec
60 sec
90 sec
120 sec
180 sec
300 sec
Custom

Actions :

+15 sec
-15 sec
Skip

Notification locale.

Fonctionnement en background.

---

# 26. NOTES WORKOUT

Trois niveaux possibles :

WorkoutNote
WorkoutExerciseNote
RoutineExerciseNote

Historiser correctement.

---

# 27. PREVIOUS PERFORMANCE

Avant une série afficher :

weight
reps
RPE

de la dernière occurrence pertinente.

L'historique doit prendre en compte les unités correctement.

---

# 28. PERSONAL RECORDS

PR possibles :

MAX_WEIGHT
MAX_REPS
MAX_SET_VOLUME
MAX_ESTIMATED_1RM
MAX_WORKOUT_VOLUME

Estimated 1RM par défaut :

Epley

weight × (1 + reps / 30)

Créer une interface permettant d'ajouter d'autres formules.

---

# 29. WORKOUT SUMMARY

À la fin :

duration
sets
exercises
volume
PR
muscles
optional calories
photos
videos

Possibilité de modifier :

title
notes
privacy

avant sauvegarde finale.

---

# 30. ROUTINES

Créer :

Routine
RoutineExercise
RoutineSetTemplate

Actions :

create
edit
duplicate
delete
reorder
share
start

---

# 31. DOSSIERS DE ROUTINES

RoutineFolder.

Exemple :

Push Pull Legs

Push
Pull
Legs

Drag & drop.

---

# 32. PROGRAMMES

Program

contient plusieurs routines.

Exemples originaux :

Beginner 3 Days
PPL 6 Days
Upper Lower
Strength
Hypertrophy
Home Training

---

# 33. WORKOUT HISTORY

Vue :

Calendar
List

Filtres :

week
month
year
custom

Workout detail :

sets
reps
weight
RPE
PR
notes
media

Actions :

repeat
copy
save as routine
share

---

# 34. WORKOUT STATISTICS

Dashboard :

workouts/week
sets/week
volume
training time
streak

Par exercice :

max weight
estimated 1RM
volume
reps
frequency

Graphes :

1M
3M
6M
1Y
ALL

---

# 35. MUSCLE STATISTICS

Calculer :

sets par muscle
volume
frequency

Périodes :

7D
30D
3M
1Y

Documenter précisément le traitement des muscles secondaires.

---

# 36. PLATE CALCULATOR

Entrées :

target weight
bar weight
available plates

Retour :

configuration de chaque côté.

---

# 37. WARMUP CALCULATOR

À partir du working set :

générer plusieurs séries progressives.

Algorithme configurable.

---

# 38. DÉBUT DU MODULE NUTRITION

Le module nutrition doit avoir le même niveau de priorité que le moteur de workout.

Un utilisateur doit pouvoir ouvrir l'app et enregistrer un aliment en quelques secondes.

---

# 39. FOOD DIARY

Créer un journal quotidien.

DailyDiary :

date
user_id
calorie_goal
protein_goal
carb_goal
fat_goal
status

Chaque journée contient MealSlots.

Par défaut :

Breakfast
Lunch
Dinner
Snacks

L'utilisateur peut :

- renommer ;
- ajouter ;
- supprimer ;
- réordonner.

Ne pas limiter artificiellement à 4 repas.

---

# 40. NAVIGATION JOURNAL

Date picker.

Support :

previous day
next day
week navigation
calendar

Permettre de modifier les journées passées ou futures.

---

# 41. RÉSUMÉ JOURNAL

En haut :

Calories

Consumed
Goal
Remaining

Puis :

Protein
Carbs
Fat

Puis accès aux micronutriments.

---

# 42. FOOD ENTRY

FoodDiaryEntry :

id
user_id
diary_date
meal_slot_id
food_id
serving_id
servings
grams
logged_at
source
created_at
updated_at

IMPORTANT :

Sauvegarder un snapshot nutritionnel de l'entrée.

Pourquoi :

si l'aliment global est modifié plus tard, l'historique utilisateur ne doit pas changer silencieusement.

Créer :

FoodEntryNutrientSnapshot.

---

# 43. FOOD MODEL

Food :

id
source
external_id
barcode
name
brand
description
country
language
data_quality
verified
created_at
updated_at

Ne pas mettre tous les nutriments en colonnes rigides.

Créer :

Nutrient
FoodNutrient

permettant d'étendre la liste.

---

# 44. MACRONUTRIMENTS

Support obligatoire :

energy_kcal
energy_kj
protein
carbohydrates
fat
fiber
sugars

Support également :

saturated_fat
monounsaturated_fat
polyunsaturated_fat
trans_fat
sugar_alcohols

---

# 45. MICRONUTRIMENTS

Architecture extensible couvrant notamment :

sodium
salt
potassium
calcium
iron
magnesium
zinc
phosphorus

vitamin_a
vitamin_b1
vitamin_b2
vitamin_b3
vitamin_b5
vitamin_b6
vitamin_b7
vitamin_b9
vitamin_b12
vitamin_c
vitamin_d
vitamin_e
vitamin_k

cholesterol

etc.

---

# 46. FOOD SERVINGS

FoodServing :

id
food_id
description
amount
unit
grams_equivalent
milliliters_equivalent

Exemples :

100 g
1 g
1 ml
1 cup
1 tbsp
1 tsp
1 slice
1 piece
1 package
1 serving

L'utilisateur doit pouvoir saisir :

0.5
1
1.5
2.25

servings.

---

# 47. NORMALISATION ALIMENTAIRE

Conserver lorsque possible :

nutrition per 100 g

et

nutrition per serving.

Conversions fiables.

Faire attention aux arrondis.

Ne jamais transformer 99 kcal en 100 kcal au niveau de la base de calcul pour des raisons uniquement visuelles.

---

# 48. FOOD PROVIDER ABSTRACTION

Créer :

interface FoodProvider {
  search(...)
  getFood(...)
  getByBarcode(...)
}

Providers possibles :

InternalFoodProvider
USDAFoodProvider
OpenFoodFactsProvider
CustomUserFoodProvider
RestaurantFoodProvider

Ne jamais scraper MyFitnessPal.

---

# 49. SOURCE DES DONNÉES

Prévoir notamment :

USDA FoodData Central

et, sous réserve du respect de sa licence :

Open Food Facts

Créer une documentation :

FOOD_DATA_LICENSING.md

Documenter pour chaque source :

licence
attribution
rate limits
redistribution
caching
commercial usage
source update policy

Ne jamais mélanger des bases légalement incompatibles sans analyse de licence.

---

# 50. FOOD CACHE

Ne pas faire un appel API à chaque affichage.

Créer :

cache local
cache serveur
source provenance

FoodSource :

provider
external_id
last_synced_at
provider_revision

---

# 51. FOOD SEARCH

Recherche par :

nom
marque
alias
restaurant
catégorie

Résultats classés en fonction de :

query relevance
locale
country
user history
frequency
favorites
quality
verification

---

# 52. RECENT FOODS

Créer automatiquement :

Recent

basé sur l'historique utilisateur.

---

# 53. FREQUENT FOODS

Calculer :

nombre de logs
récence
meal slot

Utiliser cela pour accélérer la saisie.

---

# 54. FAVORITES

L'utilisateur peut explicitement ajouter un aliment en favori.

---

# 55. QUICK LOG

Afficher un bouton "+" à côté d'un résultat.

Il enregistre directement la portion par défaut.

Feedback :

haptic
toast

---

# 56. FOOD DETAILS

Avant ajout :

name
brand
serving
calories
macros
full nutrients

Modifier :

serving
quantity
meal
date
timestamp

Puis :

LOG.

---

# 57. BARCODE SCANNER

Utiliser la caméra.

Supporter :

EAN-8
EAN-13
UPC-A
UPC-E
autres formats alimentaires pertinents

Workflow :

Camera
↓
Barcode
↓
FoodProvider lookup
↓
Food result
↓
Serving confirmation
↓
Diary

Si produit inconnu :

CREATE FOOD

avec code déjà prérempli.

---

# 58. FOOD CREATION

L'utilisateur peut créer un aliment.

Champs :

name
brand
barcode optional
serving
serving grams
calories
protein
carbs
fat
fiber
sugar
micronutrients
photo optional

Possibilité :

PRIVATE FOOD
COMMUNITY CONTRIBUTION

Ne jamais publier automatiquement un aliment utilisateur sans consentement.

---

# 59. FOOD QUALITY SYSTEM

Créer un score de qualité.

Dimensions :

completeness
source reliability
nutrient consistency
community reports
brand verification

Étiquettes possibles :

VERIFIED
TRUSTED
COMMUNITY
PERSONAL

Ne jamais laisser entendre qu'un aliment est vérifié s'il ne l'est pas.

---

# 60. FOOD CORRECTIONS

Bouton :

Report incorrect data

Motifs :

wrong calories
wrong serving
wrong macros
wrong barcode
wrong brand
duplicate
other

Créer workflow de modération.

---

# 61. QUICK ADD

Permettre d'enregistrer directement :

Calories

et optionnellement :

Protein
Carbs
Fat
Fiber
Sugar Alcohols

sans rechercher un aliment.

QuickAddEntry.

---

# 62. MULTI-DAY LOGGING

Permettre d'ajouter le même aliment à :

plusieurs dates

en une action.

Exemple :

Monday
Tuesday
Wednesday
Thursday
Friday

---

# 63. COPY MEAL

Permettre :

Copy Meal to Today
Copy to Date
Copy to Another Meal

---

# 64. COPY PREVIOUS MEAL

Action très rapide :

Same as yesterday

permettant de récupérer le contenu du même meal slot de la dernière journée pertinente.

---

# 65. MOVE FOOD

Déplacer un aliment de :

Lunch

vers :

Dinner

sans recréer l'entrée.

---

# 66. BULK OPERATIONS

Sélection multiple :

delete
move
copy
duplicate

---

# 67. FOOD TIMESTAMPS

Chaque entrée peut avoir :

date
time

Option :

timestamps enabled/disabled.

Permettre analyses futures :

répartition des protéines
horaire des repas
nutrition autour des entraînements

---

# 68. FOOD NOTES

Notes journalières ou par repas.

Exemple :

"Très faim aujourd'hui"

Ne pas envoyer automatiquement ces notes à l'IA sans permission.

---

# 69. MY FOODS

Section personnelle regroupant :

aliments créés
aliments favoris
aliments privés

---

# 70. SAVED MEALS

Créer MealTemplate.

Exemple :

"Déjeuner bureau"

qui contient :

150 g chicken
200 g rice
vegetables
olive oil

Une action :

LOG MEAL

ajoute toutes les entrées.

---

# 71. RECIPES

Recipe :

id
user_id
name
description
instructions
servings
prep_time
cook_time
image
created_at

RecipeIngredient :

food
quantity
serving

Calcul automatique :

total calories
total macros
total micronutrients
per serving nutrition

---

# 72. RECIPE SERVINGS

L'utilisateur peut modifier :

nombre de portions produites

et la nutrition par portion est recalculée.

---

# 73. BULK INGREDIENT IMPORT

Permettre de coller :

500g chicken breast
200g rice
1 tbsp olive oil
2 tomatoes

Le parser propose les correspondances.

L'utilisateur valide chaque correspondance avant calcul final.

---

# 74. RECIPE IMPORT FROM WEB

Entrée :

URL publique d'une recette.

Backend :

fetch autorisé
parse JSON-LD Recipe/Schema.org lorsque disponible
extract ingredients
extract instructions
extract servings

Puis matching ingrédients avec FoodProvider.

Ne jamais contourner des protections de site.

Toujours afficher un écran de confirmation.

---

# 75. RESTAURANT FOODS

Architecture pour aliments de restaurants.

Food :

restaurant_brand
menu_item
country
region

Sources :

APIs/licences autorisées
datasets
partenariats
imports admin

Ne jamais scraper illégalement des menus propriétaires.

---

# 76. MEAL SCAN

Créer une fonction :

SCAN MEAL

L'utilisateur :

1. prend une photo ;
2. sélectionne éventuellement une photo existante ;
3. l'image est analysée ;
4. plusieurs aliments possibles sont proposés ;
5. les portions sont estimées ;
6. l'utilisateur confirme/corrige ;
7. les aliments sont ajoutés au journal.

Pipeline :

Image
↓
Food Detection
↓
Food Classification
↓
Portion Estimation
↓
Food Search
↓
Candidate Matching
↓
User Confirmation
↓
Diary Logging

---

# 77. RÈGLE MEAL SCAN

Ne jamais enregistrer automatiquement un résultat incertain.

Afficher :

recognized food
confidence
estimated serving

L'utilisateur garde le dernier mot.

---

# 78. MEAL SCAN PROVIDER

Créer abstraction :

MealVisionProvider

afin de pouvoir utiliser :

API vision
modèle propriétaire
modèle local futur

Ne pas lier le domaine métier à un fournisseur IA précis.

---

# 79. VOICE LOGGING

Créer :

VOICE LOG

Exemple utilisateur :

"For lunch I had 180 grams of chicken, 250 grams of cooked rice and a tablespoon of olive oil."

Pipeline :

Speech to Text
↓
Food NLP Parser
↓
Quantity extraction
↓
Meal/date extraction
↓
Food candidates
↓
Review
↓
Log

---

# 80. VOICE LOG REVIEW

Avant insertion :

Chicken Breast
180 g

Rice cooked
250 g

Olive Oil
1 tbsp

Actions :

edit
remove
retry
confirm

---

# 81. VOICE PROVIDER

Créer :

SpeechProvider
FoodParsingProvider

Interchangeables.

---

# 82. NUTRITION GOALS

NutritionGoal :

calories
protein
carbs
fat
fiber
micronutrients

Supporter :

gram values

et :

macro percentage.

---

# 83. MACRO GOALS BY GRAM

Exemple :

Protein 180 g
Carbs 300 g
Fat 70 g

Calculer les pourcentages affichés.

---

# 84. MACRO GOALS BY PERCENTAGE

Exemple :

Protein 30%
Carbs 40%
Fat 30%

La somme doit faire 100%.

---

# 85. DIFFERENT GOALS BY DAY

Exemple :

Training Day

2600 kcal
180 P
300 C
70 F

Rest Day

2300 kcal
180 P
220 C
70 F

Supporter un calendrier hebdomadaire.

---

# 86. TRAINING-AWARE NUTRITION

Amélioration intégrée au produit :

les jours peuvent être automatiquement classés :

TRAINING
REST

en fonction du programme.

Mais l'utilisateur peut modifier manuellement.

---

# 87. GOALS BY MEAL

Permettre :

Breakfast 20%
Lunch 30%
Pre-workout 15%
Dinner 35%

ou calories absolues.

Permettre également objectifs protéines par repas.

---

# 88. ENERGY GOAL ENGINE

Créer un moteur transparent.

Entrées possibles :

age
weight
height
sex when supplied
activity level
goal
desired rate

Supporter calculs standards comme Mifflin-St Jeor.

Puis :

BMR
↓
estimated TDEE
↓
goal adjustment
↓
daily target

Toujours permettre :

CUSTOM CALORIE TARGET.

Ne pas prétendre reproduire un algorithme propriétaire concurrent.

---

# 89. EXERCISE CALORIE SETTINGS

Paramètre :

ADD_EXERCISE_CALORIES_TO_GOAL = ON/OFF

Si ON :

Daily calorie allowance =
base target + eligible activity calories

Si OFF :

les exercices restent enregistrés mais ne modifient pas la cible.

---

# 90. ANTI DOUBLE-COUNTING

Critique.

Si une séance GYMTRACK est également importée depuis Apple Health ou Health Connect :

ne pas compter deux fois les calories.

Créer :

ActivitySource
external_event_id
start_time
end_time
activity_type

Déduplication basée sur :

source
timestamps
duration
type
external id

---

# 91. NET CARBS

Option :

TOTAL_CARBS
NET_CARBS

Net carbs configurable selon données disponibles.

Enregistrer séparément :

total carbs
fiber
sugar alcohols

La logique doit être documentée et adaptée au contexte réglementaire/local.

---

# 92. NUTRIENT DASHBOARD

Modes de dashboard :

MACROS
BALANCED
HEART
LOW_CARB
CUSTOM

Ce sont des présentations originales, pas des copies visuelles.

---

# 93. DAILY NUTRIENT VIEW

Afficher :

consumed
goal
remaining
percentage

pour tous les nutriments configurés.

---

# 94. FOOD ANALYSIS

Analyser les aliments d'une journée/semaine :

principales sources de protéines
fibres
sodium
saturated fat
etc.

Ne pas qualifier automatiquement un aliment de "bon" ou "mauvais".

Utiliser des formulations informatives.

---

# 95. MACROS BY MEAL

Pour chaque repas :

Calories
Protein
Carbs
Fat

Graphique relatif.

---

# 96. WATER

WaterLog :

date
timestamp
amount_ml

Actions rapides configurables :

+250 ml
+330 ml
+500 ml

Objectif hydratation.

Support unités :

ml
L
fl oz

---

# 97. WATER HISTORY

Vue :

daily
weekly

Pas besoin de transformer l'hydratation en recommandation médicale.

---

# 98. ACTIVITY MODULE

Supporter :

GYMTRACK workouts
cardio manually logged
walking
running
cycling
other activity
synced workouts
steps

---

# 99. CARDIO EXERCISE

CardioEntry :

activity
duration
distance optional
calories optional
heart_rate optional

Les calories manuelles doivent être identifiées comme estimées.

---

# 100. STEPS

DailySteps :

date
count
goal
source

Source :

Apple Health
Health Connect
Wearable provider

Ne pas prétendre compter les pas directement si le système ne fournit pas cette donnée.

---

# 101. CALORIE ADJUSTMENT

Créer un moteur configurable utilisant :

activity profile
step/activity data
energy target

Afficher clairement :

Base goal
Activity adjustment
Final goal

L'utilisateur doit comprendre pourquoi son objectif change.

---

# 102. INTERMITTENT FASTING

Module optionnel.

FastingPlan :

fast_duration
eating_duration
start_time
schedule

Exemples génériques :

12:12
14:10
16:8
Custom

L'utilisateur peut :

start
stop
edit
delete past fast

Afficher :

elapsed
remaining
history

Ne pas promouvoir le jeûne comme traitement médical.

---

# 103. WEIGHT TRACKING

WeightEntry :

date
weight
source
note

Support :

kg
lb

Historique graphique.

---

# 104. MEASUREMENTS

MeasurementType personnalisable.

Défauts :

weight
body fat
waist
chest
hips
neck
arm
thigh
calf

L'utilisateur peut créer d'autres mesures.

---

# 105. PROGRESS PHOTOS

ProgressPhoto :

date
weight optional
angle
image
note

Angles :

FRONT
SIDE
BACK
CUSTOM

Photos privées par défaut.

---

# 106. PHOTO COMPARISON

Comparer :

Date A
Date B

Vue :

side-by-side
slider

Ne jamais rendre une progress photo publique automatiquement.

---

# 107. PROGRESS OVERVIEW

Créer une synthèse personnalisée.

Afficher tendances :

calories
protein consistency
training frequency
steps
weight
workout volume
logging consistency

Comparaisons :

this week
previous week

---

# 108. WEEKLY DIGEST

Générer automatiquement chaque semaine :

average calories
calorie target adherence
average macros
protein adherence
most logged foods
training count
exercise calories
steps
weight trend
streak
food groups

Historiser les rapports.

---

# 109. FOOD GROUP INSIGHTS

Catégoriser lorsque possible :

vegetables
fruit
protein foods
grains
dairy
snacks
desserts
drinks

La classification doit être séparée des données nutritionnelles.

---

# 110. COMPLETE DAY

Action :

FINISH LOGGING FOR TODAY

Créer un DailyCompletion.

Afficher :

résumé
adherence
nutrition balance

Éviter les prédictions de poids irréalistes ou non validées.

---

# 111. STREAKS

Types possibles :

daily logging
workout
nutrition logging
water

Ne jamais supprimer définitivement des données à cause d'un streak cassé.

---

# 112. LOGGING REMINDERS

Notifications configurables :

breakfast reminder
lunch reminder
dinner reminder
water
workout
weight
fasting
custom

Exemple :

"Tu n'as pas encore enregistré ton déjeuner."

---

# 113. MEAL PLANNER

Créer un véritable système de planification.

MealPlan :

start_date
end_date
user_id
goals
budget
preferences

Planning jour par jour.

---

# 114. MEAL PLANNER INPUTS

Permettre de renseigner :

calorie goal
macro goal
number of meals
servings
budget
max cook time
diet
cuisine preferences
disliked foods
allergens
available equipment
leftover preference

---

# 115. MEAL PLAN GENERATION

Le moteur doit sélectionner ou générer des recettes respectant approximativement :

Calories
Protein
Carbs
Fat

au niveau quotidien.

Ne jamais fabriquer une nutrition sans recalculer à partir des ingrédients.

---

# 116. SWAP MEAL

Action :

SWAP

propose plusieurs alternatives compatibles avec :

meal calories
macros
preferences
time
budget

---

# 117. LOG FROM PLAN

Un repas planifié peut être ajouté au journal en un clic.

Choisir :

date
meal
servings

---

# 118. RECIPE LIBRARY

Créer une bibliothèque de recettes originales.

Filtres :

high protein
vegetarian
vegan
quick
budget
breakfast
lunch
dinner
snack
low carb
etc.

Chaque recette contient de vraies données calculables.

---

# 119. GROCERY LIST

À partir du Meal Plan :

agréger les ingrédients.

Exemple :

Chicken 1.8 kg
Rice 1.2 kg
Tomatoes 8
Olive oil 150 ml

---

# 120. GROCERY NORMALIZATION

Fusionner intelligemment :

500 g chicken
1 kg chicken

→

1.5 kg chicken

lorsque les unités sont compatibles.

---

# 121. PANTRY

L'utilisateur coche :

Already have

L'ingrédient sort de la liste à acheter.

---

# 122. GROCERY CATEGORIES

Regrouper :

Produce
Meat
Fish
Dairy
Bakery
Frozen
Pantry
Drinks
Other

---

# 123. GROCERY SHARING

Partager une liste via :

deep link
text
share sheet

La personne peut importer une copie.

---

# 124. SHOPPING PROVIDER

Créer une abstraction :

GroceryProvider

permettant ultérieurement :

delivery service
retailer
click & collect

Ne jamais intégrer un service sans API/autorisation compatible.

---

# 125. AI NUTRITION COACH

Créer :

Nutrition Coach.

Il peut accéder, avec autorisation explicite, à :

food diary
calorie goal
macros
recent nutrition
saved meals
recipes
meal plan
steps
training
preferences

---

# 126. QUESTIONS COACH

Exemples :

"Combien de protéines me reste-t-il aujourd'hui ?"

"Que puis-je manger avec 500 kcal restantes ?"

"Analyse ma semaine."

"Propose un dîner avec 40 g de protéines."

"Que manger avant ma séance ?"

"Compare cette semaine à la précédente."

---

# 127. UNIFIED FITNESS COACH

Le même moteur peut également répondre :

"Pourquoi mon bench stagne ?"

"Mon volume pec a-t-il augmenté ?"

"Est-ce que je mange moins les jours de jambes ?"

"Compare mon apport en glucides à mes performances."

"Génère mon Push Day."

---

# 128. AI CONTEXT PERMISSIONS

L'utilisateur contrôle individuellement l'accès IA à :

nutrition
workouts
weight
steps
measurements
photos

Photos désactivées par défaut.

---

# 129. AI ACTION SAFETY

L'IA ne modifie jamais directement :

history
weight
goals
workouts
medical data

Elle produit :

proposal
preview

Puis l'utilisateur confirme.

---

# 130. AI ROUTINE CREATION

L'IA peut générer :

Workout Routine Draft.

Preview.

SAVE ROUTINE.

---

# 131. AI MEAL CREATION

L'IA peut générer :

Meal Draft
Recipe Draft
Meal Plan Draft

Mais la nutrition finale est recalculée depuis les vrais Food IDs.

Ne jamais prendre pour vérité les macros générées textuellement par un LLM.

---

# 132. AI PROVIDER ABSTRACTION

interface AIProvider

Implementations possibles :

OpenAI
Anthropic
Local
Other

Aucun composant UI ne dépend directement du fournisseur.

---

# 133. SUIVI MÉDICAMENT OPTIONNEL

Prévoir une feature totalement optionnelle et désactivable pour suivre certaines données de traitement.

Implémentation initiale possible :

GLP1Tracking

Données :

medication_label
dose_mg
date
time
injection_location
notes

---

# 134. GLP-1 REMINDERS

L'utilisateur peut créer un rappel.

L'application ne décide jamais elle-même de la fréquence ni de la dose.

---

# 135. SIDE EFFECT TRACKING

Option :

side_effect_type
severity
date
note

Ne jamais diagnostiquer.

Ne jamais recommander de modifier une dose.

Afficher clairement :

"Tracking only. Follow your prescriber's instructions."

Stocker ces données comme hautement sensibles.

---

# 136. HEALTH DATA SECURITY

Les données suivantes doivent recevoir une protection particulière :

weight
measurements
medication logs
side effects
health integrations
progress photos

Minimiser leur exposition.

Ne jamais les rendre sociales par défaut.

---

# 137. SOCIAL NETWORK

Créer :

profiles
follows
friend requests
feed
likes
comments

Profil :

avatar
display name
username
bio
training stats

---

# 138. FOLLOW SYSTEM

Support :

follow
unfollow
request
accept
decline
block

Profils :

PUBLIC
PRIVATE

---

# 139. WORKOUT FEED

Workout card :

user
workout title
duration
sets
volume
PR
exercises
media

Actions :

like
comment
share

---

# 140. NUTRITION PRIVACY

Ne jamais publier automatiquement :

calories
weight
food diary
medications

Le partage alimentaire doit être explicitement activé.

---

# 141. DIARY SHARING

Modes :

PRIVATE
FRIENDS
PUBLIC
ACCESS_LINK

Pour ACCESS_LINK :

token sécurisé révocable.

Permettre de consulter uniquement ce que l'utilisateur a choisi.

---

# 142. COPY FRIEND MEAL

Lorsqu'un ami autorise son diary :

l'utilisateur peut copier un repas vers son propre journal.

Créer de nouvelles DiaryEntries.

Ne pas créer de références modifiables vers les entrées originales.

---

# 143. COMMUNITY FEED

Supporter :

posts
images
progress achievements
workout achievements
comments
likes

---

# 144. GROUPS

Créer :

CommunityGroup

Public
Private

Fonctions :

join
request access
leave
invite
moderators

---

# 145. GROUP POSTS

GroupPost
GroupComment

Moderation obligatoire.

---

# 146. BLOCKING

Block User empêche :

profile access
follow
comment
message
interaction

selon la politique produit.

---

# 147. REPORTING

Report :

USER
WORKOUT
POST
COMMENT
MEDIA
FOOD

Motif.

Admin review.

---

# 148. LEADERBOARDS

Entre amis :

Bench
Squat
Deadlift
Pull-up
etc.

Metrics :

max weight
estimated 1RM
relative strength

Opt-in uniquement pour global leaderboard.

---

# 149. USER COMPARISON

Comparer :

workout frequency
volume
common exercises
PR
muscle distribution

Ne jamais comparer poids/nutrition sans permission explicite.

---

# 150. NOTIFICATIONS

Types :

follow
follow accepted
like
comment
reply
PR
workout reminder
meal reminder
water
fasting
weekly digest
meal plan
grocery
system

Préférences granulaires.

---

# 151. APPLE HEALTH

Créer HealthIntegration interface.

Support lorsque disponible :

read :

steps
weight
workouts
active energy
heart rate
sleep

write :

workouts
weight éventuellement
nutrition si pertinent et autorisé

Permissions explicites.

---

# 152. HEALTH CONNECT

Même architecture.

Sync :

steps
weight
exercise
energy

selon APIs réellement disponibles.

---

# 153. PARTNER INTEGRATIONS

Architecture extensible pour :

Garmin
Fitbit
Strava
Samsung Health
other wearables

Chaque connecteur possède :

connect
disconnect
refresh token
sync
webhook/polling
mapping

---

# 154. STRAVA

OAuth.

Partager éventuellement les workouts terminés.

Ne jamais envoyer la nutrition à Strava par défaut.

---

# 155. WEAR OS

Créer companion app.

Nutrition :

daily calories
macros
water
quick food
quick calories
frequent foods

Training :

active workout
current exercise
weight
reps
set validation
rest timer

---

# 156. APPLE WATCH

Fonctions similaires.

Training prioritaire.

Sync avec téléphone.

---

# 157. WIDGETS

iOS/Android widgets :

Calories remaining
Protein
Water
Steps
Workout streak
Quick start workout
Favorite routine

---

# 158. SUBSCRIPTIONS

Créer tiers originaux :

FREE
PRO
PRO_PLUS

Noms modifiables.

---

# 159. FEATURE FLAGS

Exemples :

barcodeScanner
mealScan
voiceLogging
advancedNutrition
advancedTrainingStats
aiCoach
mealPlanner
unlimitedRecipes
unlimitedRoutines
dataExport
advancedReports

Les limites sont server-driven.

---

# 160. BILLING

Utiliser RevenueCat.

Support :

iOS
Android

Vérification côté serveur.

Ne jamais faire confiance uniquement au client pour déterminer le statut Premium.

---

# 161. OFFLINE-FIRST NUTRITION

Sans réseau :

l'utilisateur peut :

- consulter les aliments récents mis en cache ;
- ajouter ses repas locaux ;
- utiliser ses recettes locales ;
- modifier le journal ;
- enregistrer eau ;
- enregistrer poids.

Les fonctions nécessitant un serveur comme :

Voice AI
Meal Scan remote
food search non cached

affichent correctement leur indisponibilité.

---

# 162. OFFLINE-FIRST WORKOUT

Toutes les opérations de séance restent disponibles.

Le réseau ne doit jamais bloquer la salle.

---

# 163. SYNC QUEUE

Chaque mutation possède :

operation_id
entity_type
entity_id
operation
payload
created_at
retry_count
status

Status :

PENDING
SYNCING
SYNCED
ERROR

---

# 164. IDENTIFIANTS

Générer les UUID côté client lorsque nécessaire.

Permet création offline.

---

# 165. CONFLICT RESOLUTION

Documenter stratégie.

Exemple :

immutable logs :
append

editable metadata :
updated_at + merge policy

workout sets :
entity-level updates

Ne jamais écraser silencieusement des données.

---

# 166. FOOD HISTORY IMMUTABILITY

Les données nutritionnelles enregistrées dans un diary restent un snapshot.

Une mise à jour du produit global ne doit pas modifier les calories consommées plusieurs mois auparavant.

---

# 167. DATABASE AUTH

Tables :

users
profiles
user_settings
user_preferences
devices
sessions metadata where appropriate

Auth sensible gérée par Supabase Auth.

---

# 168. DATABASE TRAINING

Créer au minimum :

exercises
exercise_aliases
exercise_muscles
custom_exercises

workouts
workout_exercises
workout_sets

routines
routine_folders
routine_exercises
routine_sets

programs
program_routines

personal_records
exercise_favorites

---

# 169. DATABASE NUTRITION

Créer notamment :

foods
food_sources
brands
food_servings
nutrients
food_nutrients
food_reports

user_foods
food_favorites

diaries
meal_slots
food_diary_entries
food_entry_nutrient_snapshots
food_notes
daily_completions

quick_add_entries

saved_meals
saved_meal_items

recipes
recipe_ingredients
recipe_tags

---

# 170. DATABASE PLANNING

meal_plans
meal_plan_days
meal_plan_meals

grocery_lists
grocery_items
pantry_items

---

# 171. DATABASE HEALTH

weight_entries
measurement_types
measurement_entries
progress_photos

water_logs
fasting_plans
fasting_logs

activity_entries
step_entries
activity_adjustments

health_connections

optional_medication_logs
optional_side_effect_logs

---

# 172. DATABASE SOCIAL

follows
follow_requests
blocks

posts
workout_posts
likes
comments

community_groups
group_members
group_posts
group_comments

reports
notifications

diary_share_permissions
share_links

---

# 173. DATABASE AI

ai_conversations
ai_messages
ai_permissions
ai_generated_drafts

Éviter de stocker inutilement du contexte sensible.

---

# 174. DATABASE SUBSCRIPTIONS

subscriptions
subscription_events
entitlements
feature_flags

---

# 175. INDEXES

Indexer intelligemment :

foods.name
foods.barcode
foods.brand
diary date/user
workout user/date
sets workout
recipes user
follows
notifications
activity source ids

Utiliser trigram/full-text search lorsque pertinent.

---

# 176. FOOD SEARCH ENGINE

Pour une petite version :

PostgreSQL full-text/trigram.

À grande échelle prévoir abstraction permettant :

Typesense
Meilisearch
Algolia
OpenSearch

sans réécrire toute l'application.

---

# 177. RLS

Un utilisateur modifie uniquement ses propres :

workouts
routines
food diary
weight
measurements
recipes
meal plans
photos
settings
medical tracking

Les fonctions sociales suivent les règles de privacy.

---

# 178. STORAGE

Buckets distincts :

avatars
workout-media
progress-photos
meal-scan-temp
recipe-images
community-media

Progress photos privées.

Signed URLs lorsque nécessaire.

---

# 179. TEMPORARY AI IMAGES

Les images Meal Scan temporaires doivent pouvoir être supprimées automatiquement après traitement sauf demande explicite de conservation.

---

# 180. GDPR

Créer :

export data
delete account
privacy center
consent records
data retention policy

---

# 181. ACCOUNT DELETE

Flow :

confirmation
reauthentication
grace period optional
revoke integrations
delete private media
delete/anonymize account data according to policy

---

# 182. DATA EXPORT

Export :

CSV
JSON

Inclure :

workouts
sets
routines
food diary
recipes
nutrition
weight
measurements
water
activities

Ne pas mélanger automatiquement les données de santé sensibles avec un export public.

---

# 183. PRINTABLE REPORT

Créer companion web ou génération PDF pour :

date range
food diary
nutrition
exercise
weight

Format imprimable.

---

# 184. WEB COMPANION

Créer ultérieurement :

Next.js
TypeScript

Fonctions principales :

login
diary
history
progress
reports
recipes
routines
profile

Réutiliser API métier.

---

# 185. ADMIN WEB

Next.js.

Roles serveur :

SUPPORT
MODERATOR
CONTENT_ADMIN
SUPER_ADMIN

---

# 186. ADMIN FOOD

Admin peut :

inspect food
resolve reports
merge duplicates
verify entries
disable malicious entry
manage restaurant data

Audit log obligatoire.

---

# 187. ADMIN CONTENT

Gérer :

programs
recipes
exercise library
community reports
users

---

# 188. AUDIT LOG

Pour toute action admin sensible :

admin_id
action
entity
entity_id
before
after
timestamp

---

# 189. I18N

Support initial :

French
English

Architecture extensible.

Aucun texte visible hardcodé dans les composants.

---

# 190. LOCALES

Supporter :

decimal separator
date formats
week start
metric/imperial

Nutrition :

kcal
kJ

Europe :

salt

États-Unis :

sodium

selon configuration.

---

# 191. ALLERGENS ET DIETARY PREFERENCES

Meal Planner peut prendre en compte :

vegetarian
vegan
pescatarian
halal preference
kosher preference
gluten preference
lactose preference
allergens
disliked foods

Ne jamais prétendre qu'une recette est garantie sans allergène sans source fiable.

---

# 192. SEARCH HISTORY

Conserver localement :

food searches
exercise searches

Permettre clear history.

---

# 193. PERFORMANCE

Objectifs :

fluid lists
fast startup
minimal unnecessary renders
pagination
image compression
database indexes

Aucun feed contenant 500 éléments ne doit rendre les 500 composants simultanément.

---

# 194. ACCESSIBILITY

Respecter :

VoiceOver/TalkBack
dynamic font
contrast
touch targets
accessible labels
keyboard navigation web

---

# 195. ANALYTICS

Créer AnalyticsService.

Events possibles :

signup_completed

workout_started
set_completed
workout_finished
pr_achieved

food_logged
barcode_scanned
meal_scanned
voice_log_used
recipe_created

water_logged
weight_logged

meal_plan_created

ai_question_asked

Ne jamais envoyer le texte sensible exact dans les analytics.

---

# 196. ERROR TRACKING

Sentry.

Séparer :

development
staging
production

Scrubber PII.

Ne jamais envoyer automatiquement des diary contents à Sentry.

---

# 197. NOTIFICATION SCHEDULING

Utiliser :

local notifications

pour timers et rappels locaux.

Backend notifications pour :

social
weekly reports
events serveur

---

# 198. ENV VARIABLES

Créer .env.example.

Exemple :

SUPABASE_URL=
SUPABASE_ANON_KEY=

USDA_API_KEY=

AI_PROVIDER_KEY=

REVENUECAT_IOS_KEY=
REVENUECAT_ANDROID_KEY=

STRAVA_CLIENT_ID=
STRAVA_CLIENT_SECRET=

SENTRY_DSN=

FOOD_PROVIDER_MODE=

Ne jamais commit les secrets.

---

# 199. SECRETS

Les secrets serveur comme :

STRAVA_CLIENT_SECRET
AI private keys

ne doivent jamais être embarqués dans l'application mobile.

---

# 200. CI

GitHub Actions :

install
lint
format check
typecheck
unit tests
integration tests

Sur PR.

---

# 201. BUILD

Configurer :

development
preview
production

avec EAS.

---

# 202. TESTS UNITAIRES TRAINING

Tester :

volume
1RM
unit conversion
plate calculator
warm-up
PR detection
superset ordering
timer

---

# 203. TESTS UNITAIRES NUTRITION

Tester :

servings
grams conversion
calorie sum
macro totals
nutrient totals
recipe calculation
meal total
daily total
net carbs
macro percentages
exercise adjustment
unit conversion

---

# 204. FOOD SNAPSHOT TEST

Créer un test critique :

1. utilisateur log Food A à 100 kcal ;
2. Food A est modifié globalement à 120 kcal ;
3. historique du jour initial reste à 100 kcal.

---

# 205. OFFLINE TEST

Scénario :

disable network
start workout
log food
log water
finish workout
restart app
enable network

Toutes les données doivent être synchronisées sans perte.

---

# 206. E2E TRAINING

Register
↓
Onboarding
↓
Create routine
↓
Add Bench
↓
Start workout
↓
100 kg × 8
↓
Complete set
↓
Timer
↓
Finish
↓
PR
↓
History
↓
Stats

---

# 207. E2E NUTRITION MANUAL

Open Today
↓
Lunch
↓
Search chicken
↓
Select 150 g
↓
Log
↓
Calories update
↓
Protein update
↓
Reload app
↓
Entry still exists

---

# 208. E2E BARCODE

Open Scanner
↓
Scan EAN
↓
Product match
↓
Set serving
↓
Log
↓
Diary totals update

---

# 209. E2E UNKNOWN BARCODE

Scan unknown
↓
Create product
↓
enter nutrition
↓
save
↓
log

---

# 210. E2E VOICE

Voice:

"200 grams chicken and 250 grams rice for lunch"

↓
parse
↓
review
↓
correct if needed
↓
confirm
↓
two diary entries

---

# 211. E2E MEAL SCAN

Take picture
↓
detect foods
↓
propose portions
↓
review
↓
log
↓
nutrition totals

---

# 212. E2E RECIPE

Create recipe
↓
ingredients
↓
nutrition calculation
↓
set 4 servings
↓
log 1 serving
↓
daily totals correct

---

# 213. E2E MEAL PLAN

Set:

2600 kcal
180g protein

↓
generate week
↓
swap meal
↓
grocery list
↓
log planned meal

---

# 214. E2E SOCIAL

User A follows User B.

B posts workout.

A sees it.

A likes.

B receives notification.

---

# 215. E2E DIARY SHARING

B enables Friends diary.

A opens B diary.

A copies lunch.

Copied items appear in A diary as independent entries.

---

# 216. E2E INTEGRATION

Log workout locally.

Sync to health platform.

Health platform returns same workout.

System detects duplicate.

Calories are not double counted.

---

# 217. COMPONENTS

Créer notamment :

AppButton
IconButton
BottomSheet
Modal
Toast
Avatar
Skeleton
EmptyState
ErrorState

WorkoutCard
RoutineCard
ExerciseRow
SetRow
SetTypePicker
RPEPicker
WorkoutTimer
RestTimer
PRBadge

FoodRow
FoodSearchResult
ServingPicker
MacroRing
NutrientProgress
MealSection
DiaryEntryRow
BarcodeScanner
FoodEditor
RecipeCard
MealCard
GroceryItem

WeightChart
ProgressChart
MeasurementCard

PostCard
CommentSheet

---

# 218. NUMBER INPUT WORKOUT

Optimisé salle.

weight field :

auto-select
decimal
+1.25
+2.5
+5
-2.5

reps :

integer
+1
-1

---

# 219. NUMBER INPUT NUTRITION

Serving input :

0.25
0.5
1
1.5

grams input :

numeric decimal

Support copy/paste.

---

# 220. UX FOOD LOGGING

Objectif :

un aliment fréquent doit pouvoir être enregistré en environ 2 à 4 interactions.

Ne pas obliger l'utilisateur à ouvrir 5 modales.

---

# 221. UX ACTIVE WORKOUT

Objectif :

valider une série avec un seul tap.

Le clavier ne doit pas gêner le scroll.

---

# 222. SEARCH DEBOUNCE

Recherche alimentaire :

debounce raisonnable

annuler requêtes obsolètes.

---

# 223. OPTIMISTIC UPDATES

Utiliser pour :

like
favorite
simple diary edits
set completion

mais conserver rollback en cas d'échec.

---

# 224. SECURITY

Validation :

client
server

Rate limiting :

auth
search
comments
AI
image scan
voice parse
uploads

---

# 225. ABUSE PREVENTION

Pour Food API proxy :

rate limits utilisateur
cache
provider quotas

Pour IA :

daily quotas
token limits
moderation when appropriate

---

# 226. IMAGE SECURITY

Valider :

file type
file size
dimensions

Strip metadata sensible lorsque pertinent.

---

# 227. MEDICAL SAFETY

L'application :

ne diagnostique pas ;
ne prescrit pas ;
ne modifie pas un traitement ;
ne remplace pas un professionnel de santé.

Les objectifs nutritionnels automatiques sont des estimations.

---

# 228. DATA CONSISTENCY

Toutes les valeurs temporelles serveur :

UTC.

Afficher en timezone utilisateur.

Diary dates doivent respecter le jour local utilisateur.

Attention aux voyages et DST.

---

# 229. PRECISION

Stockage nutrition :

NUMERIC approprié.

Ne pas utiliser uniquement INTEGER pour des grammes décimaux.

---

# 230. DELETIONS

Utiliser soft-delete uniquement lorsque justifié.

Pour les données personnelles, la suppression demandée par l'utilisateur doit réellement suivre la politique de rétention définie.

---

# 231. EVENT SYSTEM

Créer Domain Events :

WorkoutFinished
SetCompleted
FoodLogged
WeightLogged
PRCreated
MealPlanGenerated

Permet de déclencher :

statistics
notifications
analytics
background processing

sans coupler les modules.

---

# 232. BACKGROUND JOBS

Créer jobs pour :

weekly digest
food cache refresh
stats aggregation
notifications
meal plan generation
media cleanup

---

# 233. DAILY AGGREGATES

Créer des tables agrégées uniquement pour performance.

La source de vérité reste les événements/logs.

Exemple :

DailyNutritionSummary

peut être recalculé.

---

# 234. TRAINING AGGREGATES

Même principe :

UserTrainingSummary
ExerciseStats

recalculables depuis workouts.

---

# 235. HOME PERSONALIZATION

L'utilisateur choisit les cartes :

Calories
Macros
Water
Steps
Weight
Next Workout
Weekly Sets
Streak

---

# 236. COACH PERSONALIZATION

Suggested prompts basés sur :

time of day
remaining calories
training schedule
recent activity

Sans exposer inutilement les données.

---

# 237. FEATURE DISCOVERY

Les fonctions avancées doivent être découvrables progressivement.

Ne pas afficher 30 boutons sur Today.

Utiliser :

contextual actions
bottom sheets
settings
more menu

---

# 238. DATA IMPORT

Prévoir import futur depuis :

CSV nutrition
CSV workout
generic JSON

Créer des parsers séparés.

Ne pas copier de données concurrentes en violation de leurs CGU.

---

# 239. SHARE CARDS

Workout share card.

Nutrition share card optionnelle ne montrant que ce que l'utilisateur choisit.

Exemples :

Protein goal reached
Workout PR
Weekly streak

Jamais le poids sans opt-in explicite.

---

# 240. DEEP LINKS

Support :

/user/{username}

/workout/{publicId}

/routine/{publicId}

/program/{publicId}

/recipe/{publicId}

/meal-plan/{shareId}

---

# 241. SEARCH GLOBAL

Recherche globale possible :

users
foods
exercises
routines
recipes

Résultats séparés par catégories.

---

# 242. COMMAND PALETTE DE DÉVELOPPEMENT

En development seulement :

clear local DB
force sync
simulate offline
view sync queue
switch entitlements
view network logs

Jamais en production.

---

# 243. DOCUMENTATION

Créer :

README.md
ARCHITECTURE.md
DATABASE.md
SYNC.md
FOOD_DATA.md
FOOD_DATA_LICENSING.md
NUTRITION_CALCULATIONS.md
TRAINING_CALCULATIONS.md
AI.md
SECURITY.md
PRIVACY.md
TESTING.md

---

# 244. README

Expliquer :

install
Node version
package manager
env
Supabase
migrations
seed
iOS
Android
tests
build

---

# 245. SEED DATA

npm run seed

Créer :

exercise library
muscle groups
equipment
nutrient definitions
demo foods legally usable
demo recipes
training programs

Ne jamais seed depuis une base concurrente propriétaire.

---

# 246. MIGRATIONS

Toute modification PostgreSQL passe par migration.

Jamais :

"Va créer la table manuellement dans Supabase."

L'agent doit écrire la migration.

---

# 247. DEVELOPMENT PRINCIPLE

Ne jamais produire un énorme fichier unique.

Une fonctionnalité complexe doit être découpée.

---

# 248. NO FAKE COMPLETION

Interdit de considérer une fonctionnalité terminée si elle utilise :

TODO
fake API
mock button
hardcoded success
setTimeout simulant serveur

Mocks autorisés uniquement dans les tests et Storybook/dev harness.

---

# 249. PHASE 0 — AUDIT

Avant toute modification :

inspecte l'ensemble du repository.

Afficher :

architecture existante
dependencies
navigation
database
environment
existing screens

Identifier :

KEEP
REFACTOR
DELETE
CREATE

---

# 250. PHASE 1 — FOUNDATION

Créer :

Expo
Router
TypeScript strict
lint
format
theme
i18n
navigation
database layer
logging
error handling

---

# 251. PHASE 2 — AUTH

Auth
profiles
onboarding
settings
RLS

---

# 252. PHASE 3 — TRAINING CORE

Exercises
routines
active workout
sets
timers
history
PR

Workout doit devenir réellement utilisable avant de continuer.

---

# 253. PHASE 4 — NUTRITION CORE

Foods
providers
food search
diary
servings
macros
nutrient calculation
recent foods
custom foods

Nutrition doit devenir réellement utilisable avant de continuer.

---

# 254. PHASE 5 — BARCODE

Camera
barcode parsing
provider lookup
unknown product flow

---

# 255. PHASE 6 — MEALS & RECIPES

Saved meals
recipes
recipe calculations
import
copy/move

---

# 256. PHASE 7 — PROGRESS

Weight
measurements
photos
training charts
nutrition charts

---

# 257. PHASE 8 — ACTIVITY

Steps
water
cardio
calorie adjustments
health platform integrations

---

# 258. PHASE 9 — SMART LOGGING

Meal Scan
Voice Log
multi-day
timestamps
advanced search

---

# 259. PHASE 10 — MEAL PLANNER

Planner
recipe discovery
grocery
pantry
meal swap

---

# 260. PHASE 11 — SOCIAL

Profiles
follows
feed
comments
sharing
community

---

# 261. PHASE 12 — AI

Nutrition Coach
Training Coach
unified context
permissions

---

# 262. PHASE 13 — REPORTING

Weekly digest
progress overview
data export
PDF/web reports

---

# 263. PHASE 14 — SUBSCRIPTIONS

RevenueCat
feature flags
entitlements

---

# 264. PHASE 15 — WATCH / WIDGETS

Wear OS
Apple Watch
home widgets

---

# 265. PHASE 16 — WEB

Next.js companion
reports
diary
history

---

# 266. PHASE 17 — ADMIN

moderation
food quality
users
reports
content

---

# 267. PHASE 18 — HARDENING

security
performance
offline stress testing
E2E
accessibility
app-store readiness

---

# 268. PROCESS À CHAQUE PHASE

1. inspecter le code existant ;
2. définir précisément l'objectif ;
3. écrire/modifier le code ;
4. ajouter migration si nécessaire ;
5. mettre à jour types ;
6. mettre à jour tests ;
7. exécuter lint ;
8. exécuter TypeScript ;
9. exécuter tests ;
10. corriger les erreurs ;
11. vérifier fonctionnement réel ;
12. documenter ;
13. seulement ensuite passer à la phase suivante.

---

# 269. NE PAS DEMANDER À L'UTILISATEUR DE FAIRE LE TRAVAIL TECHNIQUE

Si une migration est nécessaire :

écris-la.

Si une configuration est nécessaire :

crée le fichier exemple.

Si un type est nécessaire :

crée-le.

Si une fonction manque :

implémente-la.

Ne réponds pas uniquement avec :

"Voici comment tu pourrais faire."

Agis directement sur le repository.

---

# 270. CONDITIONS DE QUALITÉ — TRAINING

La partie entraînement n'est pas terminée tant qu'un utilisateur ne peut pas réellement :

✓ créer une routine

✓ ajouter des exercices

✓ créer un exercice

✓ démarrer une séance

✓ saisir séries

✓ saisir poids

✓ saisir reps

✓ saisir RPE/RIR

✓ faire supersets

✓ utiliser timer

✓ consulter previous performance

✓ ajouter notes

✓ terminer séance

✓ voir volume

✓ voir PR

✓ voir historique

✓ voir progression

✓ utiliser offline

---

# 271. CONDITIONS DE QUALITÉ — NUTRITION

La partie nutrition n'est pas terminée tant qu'un utilisateur ne peut pas réellement :

✓ rechercher un aliment

✓ sélectionner une portion

✓ modifier quantité

✓ l'enregistrer dans un repas

✓ modifier l'entrée

✓ supprimer l'entrée

✓ déplacer l'entrée

✓ copier un repas

✓ voir calories

✓ voir protéines

✓ voir glucides

✓ voir lipides

✓ voir micronutriments

✓ créer un aliment

✓ créer un repas enregistré

✓ créer une recette

✓ scanner un code-barres

✓ saisir Quick Add

✓ consulter Recent

✓ consulter Frequent

✓ utiliser des objectifs personnalisés

✓ utiliser différents objectifs par jour

✓ voir ses calories restantes

✓ journaliser offline

---

# 272. CONDITIONS ADVANCED NUTRITION

La version avancée doit également permettre :

✓ Meal Scan

✓ Voice Log

✓ Multi-Day Logging

✓ timestamps

✓ macros by meal

✓ net carbs

✓ exercise calorie settings

✓ water

✓ fasting

✓ steps

✓ Meal Planner

✓ Grocery List

✓ Nutrition Coach

✓ Weekly Digest

✓ progress overview

✓ diary sharing

✓ optional GLP-1 tracking

---

# 273. CONDITIONS INTÉGRATION TRAINING × NUTRITION

Le produit final doit faire correctement :

Training Day
↓
Workout
↓
Activity data
↓
Daily dashboard
↓
Nutrition targets depending on settings
↓
Weekly training + nutrition analysis

Sans double counting.

---

# 274. SCÉNARIO PRODUIT COMPLET

Un utilisateur doit pouvoir :

se connecter

↓
définir 2600 kcal / 180 g protéines

↓
créer Push Day

↓
préparer ses repas

↓
scanner son yaourt

↓
enregistrer son déjeuner

↓
voir qu'il lui reste 110 g de protéines

↓
faire Push Day

↓
enregistrer Bench 100×8

↓
obtenir son timer

↓
battre son PR

↓
terminer sa séance

↓
voir ses statistiques

↓
voir son activité dans Today

↓
enregistrer son dîner

↓
atteindre ses macros

↓
consulter son bilan journalier

↓
recevoir son analyse hebdomadaire

sans quitter l'application.

---

# 275. DERNIÈRE RÈGLE

Ne cherche pas à construire un "MVP minimal" lorsque je demande une fonctionnalité complète.

Construis une architecture qui peut supporter le produit final décrit ici.

Tu peux implémenter progressivement, mais :

ne supprime aucune fonctionnalité de ce cahier des charges parce qu'elle paraît complexe.

Si une fonction nécessite un service externe non configuré :

1. créer l'interface ;
2. créer la logique métier ;
3. créer l'écran ;
4. créer les types ;
5. créer la configuration ;
6. documenter le provider nécessaire ;
7. garder la fonctionnalité explicitement marquée comme dépendance externe et non comme "terminée".

---

# 276. PREMIÈRE ACTION

Commence immédiatement.

1. inspecte le repository complet ;
2. affiche son architecture ;
3. identifie ce qui existe ;
4. compare avec ce cahier des charges ;
5. crée FEATURE_MATRIX.md contenant absolument toutes les fonctionnalités de ce prompt ;
6. chaque fonctionnalité doit avoir un statut :

NOT_STARTED
IN_PROGRESS
BLOCKED
DONE
TESTED

7. crée l'architecture cible ;
8. mets en place les foundations ;
9. implémente Phase 1 ;
10. exécute les tests ;
11. corrige ;
12. passe à la phase suivante.

IMPORTANT :

FEATURE_MATRIX.md constitue la checklist contractuelle du projet.

Aucune fonctionnalité de ce prompt ne doit disparaître au fil du développement.

Pour chaque tâche terminée :

mettre à jour FEATURE_MATRIX.md.

Un élément ne peut passer à TESTED que lorsqu'un test ou une vérification concrète confirme son fonctionnement.

NE ME DONNE PAS SIMPLEMENT DES INSTRUCTIONS.

TRAVAILLE DIRECTEMENT DANS LE CODE ET CONSTRUIS LE PRODUIT.