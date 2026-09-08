# Matrice contractuelle GYMTRACK

Source de vérité : [cahier des charges](<Prompt maître — application complète Training + Nutrition type Hevy × MyFitnessPal.md>).

Statuts : NOT_STARTED, IN_PROGRESS, BLOCKED, DONE, TESTED. Un statut global ne certifie jamais des sous-fonctions non implémentées. Tous les critères originaux sont conservés ci-dessous, sans exclusion de périmètre. Les validations détaillées des lots sont dans TESTING.md.

## État initial — 2026-09-05

Dépôt sans code : seul le cahier des charges existe. Aucun package, écran, asset, environnement, test, historique Git ou migration. KEEP : cahier des charges. CREATE : application et infrastructure. Rien à refactorer/supprimer.

## Index

| ID  | Domaine                     | Exigence                                                      | Statut      |
| --- | --------------------------- | ------------------------------------------------------------- | ----------- |
| 0   | Fondations                  | RÈGLE ABSOLUE : PARITÉ FONCTIONNELLE, PAS COPIE PROPRIÉTAIRE  | IN_PROGRESS |
| 1   | Fondations                  | NOM DU PRODUIT                                                | DONE        |
| 2   | Fondations                  | OBJECTIF PRODUIT                                              | IN_PROGRESS |
| 3   | Fondations                  | PRINCIPES NON NÉGOCIABLES                                     | IN_PROGRESS |
| 4   | Fondations                  | STACK MOBILE                                                  | IN_PROGRESS |
| 5   | Fondations                  | STOCKAGE LOCAL                                                | IN_PROGRESS |
| 6   | Fondations                  | BACKEND                                                       | IN_PROGRESS |
| 7   | Fondations                  | ARCHITECTURE DU CODE                                          | IN_PROGRESS |
| 8   | Fondations                  | DESIGN SYSTEM                                                 | IN_PROGRESS |
| 9   | Fondations                  | NAVIGATION                                                    | IN_PROGRESS |
| 10  | Compte et Today             | AUTHENTIFICATION                                              | NOT_STARTED |
| 11  | Compte et Today             | ONBOARDING GLOBAL                                             | NOT_STARTED |
| 12  | Compte et Today             | DASHBOARD TODAY                                               | IN_PROGRESS |
| 13  | Training                    | MOTEUR D'ENTRAÎNEMENT                                         | IN_PROGRESS |
| 14  | Training                    | DÉMARRAGE WORKOUT                                             | DONE        |
| 15  | Training                    | EXERCISE DATABASE                                             | IN_PROGRESS |
| 16  | Training                    | MUSCLES                                                       | IN_PROGRESS |
| 17  | Training                    | ÉQUIPEMENTS                                                   | IN_PROGRESS |
| 18  | Training                    | EXERCICES PERSONNALISÉS                                       | IN_PROGRESS |
| 19  | Training                    | EXERCISE PICKER                                               | IN_PROGRESS |
| 20  | Training                    | SÉRIES                                                        | IN_PROGRESS |
| 21  | Training                    | TYPES DE SÉRIES                                               | IN_PROGRESS |
| 22  | Training                    | SET OPERATIONS                                                | DONE        |
| 23  | Training                    | RPE / RIR                                                     | IN_PROGRESS |
| 24  | Training                    | SUPERSETS                                                     | DONE        |
| 25  | Training                    | REST TIMER                                                    | IN_PROGRESS |
| 26  | Training                    | NOTES WORKOUT                                                 | DONE        |
| 27  | Training                    | PREVIOUS PERFORMANCE                                          | DONE        |
| 28  | Training                    | PERSONAL RECORDS                                              | DONE        |
| 29  | Training                    | WORKOUT SUMMARY                                               | IN_PROGRESS |
| 30  | Training                    | ROUTINES                                                      | DONE        |
| 31  | Training                    | DOSSIERS DE ROUTINES                                          | DONE        |
| 32  | Training                    | PROGRAMMES                                                    | DONE        |
| 33  | Training                    | WORKOUT HISTORY                                               | IN_PROGRESS |
| 34  | Training                    | WORKOUT STATISTICS                                            | NOT_STARTED |
| 35  | Training                    | MUSCLE STATISTICS                                             | NOT_STARTED |
| 36  | Training                    | PLATE CALCULATOR                                              | NOT_STARTED |
| 37  | Training                    | WARMUP CALCULATOR                                             | NOT_STARTED |
| 38  | Nutrition                   | DÉBUT DU MODULE NUTRITION                                     | IN_PROGRESS |
| 39  | Nutrition                   | FOOD DIARY                                                    | IN_PROGRESS |
| 40  | Nutrition                   | NAVIGATION JOURNAL                                            | IN_PROGRESS |
| 41  | Nutrition                   | RÉSUMÉ JOURNAL                                                | IN_PROGRESS |
| 42  | Nutrition                   | FOOD ENTRY                                                    | IN_PROGRESS |
| 43  | Nutrition                   | FOOD MODEL                                                    | IN_PROGRESS |
| 44  | Nutrition                   | MACRONUTRIMENTS                                               | IN_PROGRESS |
| 45  | Nutrition                   | MICRONUTRIMENTS                                               | IN_PROGRESS |
| 46  | Nutrition                   | FOOD SERVINGS                                                 | IN_PROGRESS |
| 47  | Nutrition                   | NORMALISATION ALIMENTAIRE                                     | IN_PROGRESS |
| 48  | Nutrition                   | FOOD PROVIDER ABSTRACTION                                     | NOT_STARTED |
| 49  | Nutrition                   | SOURCE DES DONNÉES                                            | NOT_STARTED |
| 50  | Nutrition                   | FOOD CACHE                                                    | NOT_STARTED |
| 51  | Nutrition                   | FOOD SEARCH                                                   | NOT_STARTED |
| 52  | Nutrition                   | RECENT FOODS                                                  | NOT_STARTED |
| 53  | Nutrition                   | FREQUENT FOODS                                                | NOT_STARTED |
| 54  | Nutrition                   | FAVORITES                                                     | NOT_STARTED |
| 55  | Nutrition                   | QUICK LOG                                                     | NOT_STARTED |
| 56  | Nutrition                   | FOOD DETAILS                                                  | NOT_STARTED |
| 57  | Nutrition                   | BARCODE SCANNER                                               | NOT_STARTED |
| 58  | Nutrition                   | FOOD CREATION                                                 | NOT_STARTED |
| 59  | Nutrition                   | FOOD QUALITY SYSTEM                                           | NOT_STARTED |
| 60  | Nutrition                   | FOOD CORRECTIONS                                              | NOT_STARTED |
| 61  | Nutrition                   | QUICK ADD                                                     | IN_PROGRESS |
| 62  | Nutrition                   | MULTI-DAY LOGGING                                             | NOT_STARTED |
| 63  | Nutrition                   | COPY MEAL                                                     | NOT_STARTED |
| 64  | Nutrition                   | COPY PREVIOUS MEAL                                            | NOT_STARTED |
| 65  | Nutrition                   | MOVE FOOD                                                     | NOT_STARTED |
| 66  | Nutrition                   | BULK OPERATIONS                                               | NOT_STARTED |
| 67  | Nutrition                   | FOOD TIMESTAMPS                                               | NOT_STARTED |
| 68  | Nutrition                   | FOOD NOTES                                                    | NOT_STARTED |
| 69  | Nutrition                   | MY FOODS                                                      | NOT_STARTED |
| 70  | Nutrition                   | SAVED MEALS                                                   | NOT_STARTED |
| 71  | Nutrition                   | RECIPES                                                       | NOT_STARTED |
| 72  | Nutrition                   | RECIPE SERVINGS                                               | NOT_STARTED |
| 73  | Nutrition                   | BULK INGREDIENT IMPORT                                        | NOT_STARTED |
| 74  | Nutrition                   | RECIPE IMPORT FROM WEB                                        | NOT_STARTED |
| 75  | Nutrition                   | RESTAURANT FOODS                                              | NOT_STARTED |
| 76  | Nutrition                   | MEAL SCAN                                                     | NOT_STARTED |
| 77  | Nutrition                   | RÈGLE MEAL SCAN                                               | NOT_STARTED |
| 78  | Nutrition                   | MEAL SCAN PROVIDER                                            | NOT_STARTED |
| 79  | Nutrition                   | VOICE LOGGING                                                 | NOT_STARTED |
| 80  | Nutrition                   | VOICE LOG REVIEW                                              | NOT_STARTED |
| 81  | Nutrition                   | VOICE PROVIDER                                                | NOT_STARTED |
| 82  | Nutrition                   | NUTRITION GOALS                                               | NOT_STARTED |
| 83  | Nutrition                   | MACRO GOALS BY GRAM                                           | NOT_STARTED |
| 84  | Nutrition                   | MACRO GOALS BY PERCENTAGE                                     | NOT_STARTED |
| 85  | Nutrition                   | DIFFERENT GOALS BY DAY                                        | NOT_STARTED |
| 86  | Nutrition                   | TRAINING-AWARE NUTRITION                                      | NOT_STARTED |
| 87  | Nutrition                   | GOALS BY MEAL                                                 | NOT_STARTED |
| 88  | Nutrition                   | ENERGY GOAL ENGINE                                            | NOT_STARTED |
| 89  | Nutrition                   | EXERCISE CALORIE SETTINGS                                     | NOT_STARTED |
| 90  | Nutrition                   | ANTI DOUBLE-COUNTING                                          | NOT_STARTED |
| 91  | Nutrition                   | NET CARBS                                                     | NOT_STARTED |
| 92  | Nutrition                   | NUTRIENT DASHBOARD                                            | NOT_STARTED |
| 93  | Nutrition                   | DAILY NUTRIENT VIEW                                           | NOT_STARTED |
| 94  | Nutrition                   | FOOD ANALYSIS                                                 | NOT_STARTED |
| 95  | Nutrition                   | MACROS BY MEAL                                                | NOT_STARTED |
| 96  | Santé et progression        | WATER                                                         | NOT_STARTED |
| 97  | Santé et progression        | WATER HISTORY                                                 | NOT_STARTED |
| 98  | Santé et progression        | ACTIVITY MODULE                                               | NOT_STARTED |
| 99  | Santé et progression        | CARDIO EXERCISE                                               | NOT_STARTED |
| 100 | Santé et progression        | STEPS                                                         | NOT_STARTED |
| 101 | Santé et progression        | CALORIE ADJUSTMENT                                            | NOT_STARTED |
| 102 | Santé et progression        | INTERMITTENT FASTING                                          | NOT_STARTED |
| 103 | Santé et progression        | WEIGHT TRACKING                                               | NOT_STARTED |
| 104 | Santé et progression        | MEASUREMENTS                                                  | NOT_STARTED |
| 105 | Santé et progression        | PROGRESS PHOTOS                                               | NOT_STARTED |
| 106 | Santé et progression        | PHOTO COMPARISON                                              | NOT_STARTED |
| 107 | Santé et progression        | PROGRESS OVERVIEW                                             | NOT_STARTED |
| 108 | Santé et progression        | WEEKLY DIGEST                                                 | NOT_STARTED |
| 109 | Santé et progression        | FOOD GROUP INSIGHTS                                           | NOT_STARTED |
| 110 | Santé et progression        | COMPLETE DAY                                                  | NOT_STARTED |
| 111 | Santé et progression        | STREAKS                                                       | NOT_STARTED |
| 112 | Santé et progression        | LOGGING REMINDERS                                             | NOT_STARTED |
| 113 | Planification               | MEAL PLANNER                                                  | NOT_STARTED |
| 114 | Planification               | MEAL PLANNER INPUTS                                           | NOT_STARTED |
| 115 | Planification               | MEAL PLAN GENERATION                                          | NOT_STARTED |
| 116 | Planification               | SWAP MEAL                                                     | NOT_STARTED |
| 117 | Planification               | LOG FROM PLAN                                                 | NOT_STARTED |
| 118 | Planification               | RECIPE LIBRARY                                                | NOT_STARTED |
| 119 | Planification               | GROCERY LIST                                                  | NOT_STARTED |
| 120 | Planification               | GROCERY NORMALIZATION                                         | NOT_STARTED |
| 121 | Planification               | PANTRY                                                        | NOT_STARTED |
| 122 | Planification               | GROCERY CATEGORIES                                            | NOT_STARTED |
| 123 | Planification               | GROCERY SHARING                                               | NOT_STARTED |
| 124 | Planification               | SHOPPING PROVIDER                                             | NOT_STARTED |
| 125 | IA                          | AI NUTRITION COACH                                            | NOT_STARTED |
| 126 | IA                          | QUESTIONS COACH                                               | NOT_STARTED |
| 127 | IA                          | UNIFIED FITNESS COACH                                         | NOT_STARTED |
| 128 | IA                          | AI CONTEXT PERMISSIONS                                        | NOT_STARTED |
| 129 | IA                          | AI ACTION SAFETY                                              | NOT_STARTED |
| 130 | IA                          | AI ROUTINE CREATION                                           | NOT_STARTED |
| 131 | IA                          | AI MEAL CREATION                                              | NOT_STARTED |
| 132 | IA                          | AI PROVIDER ABSTRACTION                                       | NOT_STARTED |
| 133 | Santé sensible              | SUIVI MÉDICAMENT OPTIONNEL                                    | NOT_STARTED |
| 134 | Santé sensible              | GLP-1 REMINDERS                                               | NOT_STARTED |
| 135 | Santé sensible              | SIDE EFFECT TRACKING                                          | NOT_STARTED |
| 136 | Santé sensible              | HEALTH DATA SECURITY                                          | NOT_STARTED |
| 137 | Social                      | SOCIAL NETWORK                                                | NOT_STARTED |
| 138 | Social                      | FOLLOW SYSTEM                                                 | NOT_STARTED |
| 139 | Social                      | WORKOUT FEED                                                  | NOT_STARTED |
| 140 | Social                      | NUTRITION PRIVACY                                             | NOT_STARTED |
| 141 | Social                      | DIARY SHARING                                                 | NOT_STARTED |
| 142 | Social                      | COPY FRIEND MEAL                                              | NOT_STARTED |
| 143 | Social                      | COMMUNITY FEED                                                | NOT_STARTED |
| 144 | Social                      | GROUPS                                                        | NOT_STARTED |
| 145 | Social                      | GROUP POSTS                                                   | NOT_STARTED |
| 146 | Social                      | BLOCKING                                                      | NOT_STARTED |
| 147 | Social                      | REPORTING                                                     | NOT_STARTED |
| 148 | Social                      | LEADERBOARDS                                                  | NOT_STARTED |
| 149 | Social                      | USER COMPARISON                                               | NOT_STARTED |
| 150 | Social                      | NOTIFICATIONS                                                 | NOT_STARTED |
| 151 | Intégrations                | APPLE HEALTH                                                  | NOT_STARTED |
| 152 | Intégrations                | HEALTH CONNECT                                                | NOT_STARTED |
| 153 | Intégrations                | PARTNER INTEGRATIONS                                          | NOT_STARTED |
| 154 | Intégrations                | STRAVA                                                        | NOT_STARTED |
| 155 | Intégrations                | WEAR OS                                                       | NOT_STARTED |
| 156 | Intégrations                | APPLE WATCH                                                   | NOT_STARTED |
| 157 | Intégrations                | WIDGETS                                                       | NOT_STARTED |
| 158 | Abonnements                 | SUBSCRIPTIONS                                                 | NOT_STARTED |
| 159 | Abonnements                 | FEATURE FLAGS                                                 | NOT_STARTED |
| 160 | Abonnements                 | BILLING                                                       | NOT_STARTED |
| 161 | Données et sécurité         | OFFLINE-FIRST NUTRITION                                       | IN_PROGRESS |
| 162 | Données et sécurité         | OFFLINE-FIRST WORKOUT                                         | IN_PROGRESS |
| 163 | Données et sécurité         | SYNC QUEUE                                                    | IN_PROGRESS |
| 164 | Données et sécurité         | IDENTIFIANTS                                                  | TESTED      |
| 165 | Données et sécurité         | CONFLICT RESOLUTION                                           | IN_PROGRESS |
| 166 | Données et sécurité         | FOOD HISTORY IMMUTABILITY                                     | TESTED      |
| 167 | Données et sécurité         | DATABASE AUTH                                                 | IN_PROGRESS |
| 168 | Données et sécurité         | DATABASE TRAINING                                             | IN_PROGRESS |
| 169 | Données et sécurité         | DATABASE NUTRITION                                            | IN_PROGRESS |
| 170 | Données et sécurité         | DATABASE PLANNING                                             | NOT_STARTED |
| 171 | Données et sécurité         | DATABASE HEALTH                                               | NOT_STARTED |
| 172 | Données et sécurité         | DATABASE SOCIAL                                               | NOT_STARTED |
| 173 | Données et sécurité         | DATABASE AI                                                   | NOT_STARTED |
| 174 | Données et sécurité         | DATABASE SUBSCRIPTIONS                                        | NOT_STARTED |
| 175 | Données et sécurité         | INDEXES                                                       | IN_PROGRESS |
| 176 | Données et sécurité         | FOOD SEARCH ENGINE                                            | NOT_STARTED |
| 177 | Données et sécurité         | RLS                                                           | IN_PROGRESS |
| 178 | Données et sécurité         | STORAGE                                                       | NOT_STARTED |
| 179 | Données et sécurité         | TEMPORARY AI IMAGES                                           | NOT_STARTED |
| 180 | Données et sécurité         | GDPR                                                          | NOT_STARTED |
| 181 | Données et sécurité         | ACCOUNT DELETE                                                | NOT_STARTED |
| 182 | Données et sécurité         | DATA EXPORT                                                   | NOT_STARTED |
| 183 | Données et sécurité         | PRINTABLE REPORT                                              | NOT_STARTED |
| 184 | Données et sécurité         | WEB COMPANION                                                 | NOT_STARTED |
| 185 | Plateformes et exploitation | ADMIN WEB                                                     | NOT_STARTED |
| 186 | Plateformes et exploitation | ADMIN FOOD                                                    | NOT_STARTED |
| 187 | Plateformes et exploitation | ADMIN CONTENT                                                 | NOT_STARTED |
| 188 | Plateformes et exploitation | AUDIT LOG                                                     | NOT_STARTED |
| 189 | Plateformes et exploitation | I18N                                                          | IN_PROGRESS |
| 190 | Plateformes et exploitation | LOCALES                                                       | IN_PROGRESS |
| 191 | Plateformes et exploitation | ALLERGENS ET DIETARY PREFERENCES                              | NOT_STARTED |
| 192 | Plateformes et exploitation | SEARCH HISTORY                                                | NOT_STARTED |
| 193 | Plateformes et exploitation | PERFORMANCE                                                   | IN_PROGRESS |
| 194 | Plateformes et exploitation | ACCESSIBILITY                                                 | IN_PROGRESS |
| 195 | Plateformes et exploitation | ANALYTICS                                                     | NOT_STARTED |
| 196 | Plateformes et exploitation | ERROR TRACKING                                                | NOT_STARTED |
| 197 | Plateformes et exploitation | NOTIFICATION SCHEDULING                                       | NOT_STARTED |
| 198 | Plateformes et exploitation | ENV VARIABLES                                                 | IN_PROGRESS |
| 199 | Plateformes et exploitation | SECRETS                                                       | IN_PROGRESS |
| 200 | Plateformes et exploitation | CI                                                            | DONE        |
| 201 | Plateformes et exploitation | BUILD                                                         | IN_PROGRESS |
| 202 | Validation                  | TESTS UNITAIRES TRAINING                                      | IN_PROGRESS |
| 203 | Validation                  | TESTS UNITAIRES NUTRITION                                     | IN_PROGRESS |
| 204 | Validation                  | FOOD SNAPSHOT TEST                                            | TESTED      |
| 205 | Validation                  | OFFLINE TEST                                                  | IN_PROGRESS |
| 206 | Validation                  | E2E TRAINING                                                  | NOT_STARTED |
| 207 | Validation                  | E2E NUTRITION MANUAL                                          | NOT_STARTED |
| 208 | Validation                  | E2E BARCODE                                                   | NOT_STARTED |
| 209 | Validation                  | E2E UNKNOWN BARCODE                                           | NOT_STARTED |
| 210 | Validation                  | E2E VOICE                                                     | NOT_STARTED |
| 211 | Validation                  | E2E MEAL SCAN                                                 | NOT_STARTED |
| 212 | Validation                  | E2E RECIPE                                                    | NOT_STARTED |
| 213 | Validation                  | E2E MEAL PLAN                                                 | NOT_STARTED |
| 214 | Validation                  | E2E SOCIAL                                                    | NOT_STARTED |
| 215 | Validation                  | E2E DIARY SHARING                                             | NOT_STARTED |
| 216 | Validation                  | E2E INTEGRATION                                               | NOT_STARTED |
| 217 | Qualité et infrastructure   | COMPONENTS                                                    | IN_PROGRESS |
| 218 | Qualité et infrastructure   | NUMBER INPUT WORKOUT                                          | IN_PROGRESS |
| 219 | Qualité et infrastructure   | NUMBER INPUT NUTRITION                                        | IN_PROGRESS |
| 220 | Qualité et infrastructure   | UX FOOD LOGGING                                               | IN_PROGRESS |
| 221 | Qualité et infrastructure   | UX ACTIVE WORKOUT                                             | IN_PROGRESS |
| 222 | Qualité et infrastructure   | SEARCH DEBOUNCE                                               | NOT_STARTED |
| 223 | Qualité et infrastructure   | OPTIMISTIC UPDATES                                            | NOT_STARTED |
| 224 | Qualité et infrastructure   | SECURITY                                                      | IN_PROGRESS |
| 225 | Qualité et infrastructure   | ABUSE PREVENTION                                              | NOT_STARTED |
| 226 | Qualité et infrastructure   | IMAGE SECURITY                                                | NOT_STARTED |
| 227 | Qualité et infrastructure   | MEDICAL SAFETY                                                | NOT_STARTED |
| 228 | Qualité et infrastructure   | DATA CONSISTENCY                                              | IN_PROGRESS |
| 229 | Qualité et infrastructure   | PRECISION                                                     | IN_PROGRESS |
| 230 | Qualité et infrastructure   | DELETIONS                                                     | IN_PROGRESS |
| 231 | Qualité et infrastructure   | EVENT SYSTEM                                                  | NOT_STARTED |
| 232 | Qualité et infrastructure   | BACKGROUND JOBS                                               | NOT_STARTED |
| 233 | Qualité et infrastructure   | DAILY AGGREGATES                                              | NOT_STARTED |
| 234 | Qualité et infrastructure   | TRAINING AGGREGATES                                           | NOT_STARTED |
| 235 | Qualité et infrastructure   | HOME PERSONALIZATION                                          | NOT_STARTED |
| 236 | Qualité et infrastructure   | COACH PERSONALIZATION                                         | NOT_STARTED |
| 237 | Qualité et infrastructure   | FEATURE DISCOVERY                                             | NOT_STARTED |
| 238 | Qualité et infrastructure   | DATA IMPORT                                                   | NOT_STARTED |
| 239 | Qualité et infrastructure   | SHARE CARDS                                                   | NOT_STARTED |
| 240 | Qualité et infrastructure   | DEEP LINKS                                                    | NOT_STARTED |
| 241 | Qualité et infrastructure   | SEARCH GLOBAL                                                 | NOT_STARTED |
| 242 | Qualité et infrastructure   | COMMAND PALETTE DE DÉVELOPPEMENT                              | NOT_STARTED |
| 243 | Qualité et infrastructure   | DOCUMENTATION                                                 | IN_PROGRESS |
| 244 | Qualité et infrastructure   | README                                                        | IN_PROGRESS |
| 245 | Qualité et infrastructure   | SEED DATA                                                     | NOT_STARTED |
| 246 | Qualité et infrastructure   | MIGRATIONS                                                    | DONE        |
| 247 | Qualité et infrastructure   | DEVELOPMENT PRINCIPLE                                         | IN_PROGRESS |
| 248 | Qualité et infrastructure   | NO FAKE COMPLETION                                            | IN_PROGRESS |
| 249 | Phases et acceptation       | PHASE 0 — AUDIT                                               | DONE        |
| 250 | Phases et acceptation       | PHASE 1 — FOUNDATION                                          | IN_PROGRESS |
| 251 | Phases et acceptation       | PHASE 2 — AUTH                                                | NOT_STARTED |
| 252 | Phases et acceptation       | PHASE 3 — TRAINING CORE                                       | IN_PROGRESS |
| 253 | Phases et acceptation       | PHASE 4 — NUTRITION CORE                                      | IN_PROGRESS |
| 254 | Phases et acceptation       | PHASE 5 — BARCODE                                             | NOT_STARTED |
| 255 | Phases et acceptation       | PHASE 6 — MEALS & RECIPES                                     | NOT_STARTED |
| 256 | Phases et acceptation       | PHASE 7 — PROGRESS                                            | NOT_STARTED |
| 257 | Phases et acceptation       | PHASE 8 — ACTIVITY                                            | NOT_STARTED |
| 258 | Phases et acceptation       | PHASE 9 — SMART LOGGING                                       | NOT_STARTED |
| 259 | Phases et acceptation       | PHASE 10 — MEAL PLANNER                                       | NOT_STARTED |
| 260 | Phases et acceptation       | PHASE 11 — SOCIAL                                             | NOT_STARTED |
| 261 | Phases et acceptation       | PHASE 12 — AI                                                 | NOT_STARTED |
| 262 | Phases et acceptation       | PHASE 13 — REPORTING                                          | NOT_STARTED |
| 263 | Phases et acceptation       | PHASE 14 — SUBSCRIPTIONS                                      | NOT_STARTED |
| 264 | Phases et acceptation       | PHASE 15 — WATCH / WIDGETS                                    | NOT_STARTED |
| 265 | Phases et acceptation       | PHASE 16 — WEB                                                | NOT_STARTED |
| 266 | Phases et acceptation       | PHASE 17 — ADMIN                                              | NOT_STARTED |
| 267 | Phases et acceptation       | PHASE 18 — HARDENING                                          | NOT_STARTED |
| 268 | Phases et acceptation       | PROCESS À CHAQUE PHASE                                        | IN_PROGRESS |
| 269 | Phases et acceptation       | NE PAS DEMANDER À L'UTILISATEUR DE FAIRE LE TRAVAIL TECHNIQUE | IN_PROGRESS |
| 270 | Phases et acceptation       | CONDITIONS DE QUALITÉ — TRAINING                              | IN_PROGRESS |
| 271 | Phases et acceptation       | CONDITIONS DE QUALITÉ — NUTRITION                             | IN_PROGRESS |
| 272 | Phases et acceptation       | CONDITIONS ADVANCED NUTRITION                                 | NOT_STARTED |
| 273 | Phases et acceptation       | CONDITIONS INTÉGRATION TRAINING × NUTRITION                   | NOT_STARTED |
| 274 | Phases et acceptation       | SCÉNARIO PRODUIT COMPLET                                      | NOT_STARTED |
| 275 | Phases et acceptation       | DERNIÈRE RÈGLE                                                | IN_PROGRESS |
| 276 | Phases et acceptation       | PREMIÈRE ACTION                                               | IN_PROGRESS |

## Lot 1 — preuves et limites

État historique au 2026-09-05 ; les changements suivants sont consignés dans le lot 2.

Statuts de sous-fonctions uniquement : TESTED signifie vérification métier/intégration ci-dessous, pas validation native de toute la section. Les sections composites restent IN_PROGRESS tant que tous leurs critères ne sont pas livrés.

| Sous-fonction                                                                     | Statut      | Preuve / limite                                                                           |
| --------------------------------------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------- |
| Audit exhaustif, cahier lu, 277 sections conservées                               | TESTED      | Inventaire initial et tests/contract.test.ts                                              |
| Expo 55, RN 0.83, Router, TS strict, configuration npm verrouillée                | TESTED      | typecheck, lint et exports Hermes Android/iOS                                             |
| Thème clair/sombre/système, FR/EN, réglages persistés                             | DONE        | UI réelle ; clés FR/EN vérifiées, pas de test visuel natif                                |
| Migrations SQLite, WAL, transactions, outbox atomique                             | TESTED      | tests/training.test.ts : migration répétée et rollback sur panne                          |
| UUID locaux et une seule séance active                                            | TESTED      | Tests de démarrages concurrents                                                           |
| Démarrage vide et reprise de séance                                               | TESTED      | Repository réel, fermeture/réouverture d’un fichier SQLite                                |
| Exercices personnels poids × reps et ajout à la séance                            | TESTED      | Tests métier ; formulaire mobile présent                                                  |
| Charge, reps, RPE/RIR, validation, duplication, suppression, dévalidation         | TESTED      | Tests de séries et isolation ; UI présente                                                |
| Notes de séance persistées                                                        | TESTED      | Réouverture du fichier ; notes conservées                                                 |
| Minuteur à échéance persistée, +15/−15/Skip                                       | IN_PROGRESS | Reprise/calcul testés ; notifications OS manquantes                                       |
| Fin de séance, historique et résumé de volume                                     | TESTED      | Tests métier ; liste UI paginée et détail présents                                        |
| kg/lb et estimation Epley                                                         | TESTED      | tests/calculations.test.ts ; détection PR non livrée                                      |
| Quick Add kcal/macros, suppression, journal par date                              | TESTED      | tests/nutrition.test.ts ; formulaire UI présent                                           |
| Portions fractionnaires et snapshots extensibles                                  | TESTED      | Calculs et scénario 100 → 120 kcal sans changement historique                             |
| Queue FIFO, reprise SYNCING, retry et réponse ambiguë                             | TESTED      | tests/sync.test.ts ; transport de panne uniquement en tests                               |
| Migration PostgreSQL, RPC idempotente, RLS et FK propriétaires                    | TESTED      | PostgreSQL embarqué ; pas de serveur Supabase distant                                     |
| Provider Supabase et stockage SecureStore                                         | IN_PROGRESS | Transport réel et configuration ; pas de session live vérifiée                            |
| Connexion à une instance Supabase et validation cloud réelle                      | BLOCKED     | URL/clé publique/projet absent ; auth UI et raccordement sync restent aussi à implémenter |
| Tests sur appareil iOS/Android et builds signés                                   | BLOCKED     | Aucun appareil/émulateur pilotable ni compte EAS/signatures disponibles                   |
| Synchronisation bidirectionnelle, conflits interactifs, migration du propriétaire | NOT_STARTED | L’outbox reste locale ; aucun succès cloud simulé                                         |
| Routines, supersets, PR, performances précédentes                                 | NOT_STARTED | Prochaine tranche Training après identité/sync                                            |
| CI GitHub Actions                                                                 | DONE        | Workflow créé, contrôles locaux exécutés ; run hébergé non observé                        |

## Lot 2 — routines et réutilisation des séances — 2026-09-06

État historique avant le lot 3 ; consulter le lot suivant pour les performances et les PR.

Les sections 14, 26 et 30 passent à DONE : leurs parcours locaux sont implémentés. Les preuves automatisées ci-dessous ne remplacent pas une validation native sur appareil. La section 33 reste IN_PROGRESS : la conversion historique → routine est livrée, mais calendrier, filtres avancés, PR, médias et partage de workout restent à réaliser. Les 277 sections contractuelles sont conservées intégralement.

| Sous-fonction                                                   | Statut  | Preuve / limite                                                                                                                                          |
| --------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Créer, modifier, dupliquer et supprimer une routine             | TESTED  | tests/routines.test.ts et tests/routines-ui.test.tsx ; confirmation avant suppression                                                                    |
| Réordonner routines, exercices et séries                        | TESTED  | Permutations complètes validées ; boutons monter/descendre accessibles ; dossiers et drag-and-drop §31 non livrés                                        |
| Démarrer une routine hors ligne                                 | TESTED  | Copie indépendante notes/repos/cibles, garde de séance active, réouverture SQLite et rollback intégral                                                   |
| Répéter/copier une séance terminée et enregistrer comme routine | TESTED  | Nouveaux UUID, complétions remises à zéro, historique source inchangé ; supersets refusés explicitement tant que §24 absent                              |
| Notes de séance, exercice de séance et exercice de routine      | TESTED  | Persistance et indépendance entre modèle et séance ; notes visibles dans l’historique                                                                    |
| Cibles poids/reps, durée/distance, RPE/RIR et types de séries   | TESTED  | Parseur commun avec la séance active ; unités canoniques ; test de démarrage/validation durée-distance                                                   |
| Export/import portable de routines                              | TESTED  | JSON versionné sans identifiants personnels ; prévisualisation sans écriture ; confirmation avant import et appel Share ; validation stricte et rollback |
| Partage natif vers une autre application                        | BLOCKED | Appel Share et annulation testés avec doublure ; réception effective à vérifier sur téléphone                                                            |
| Migration SQLite v1 → v2 et nouvelles tables PostgreSQL         | TESTED  | Base existante préservée ; outbox locale appliquée dans PostgreSQL embarqué, RLS/FK et tombstones contrôlés                                              |
| Lectures SQLite avec l’appareil déclaré hors ligne              | TESTED  | Fabrique TanStack Query en networkMode always ; chargement à froid et modification via le véritable écran Plan                                           |
| Authentification et synchronisation cloud réelle                | BLOCKED | Configuration Supabase absente ; raccordement app, identité et synchronisation bidirectionnelle encore à réaliser                                        |
| Validation globale du lot                                       | TESTED  | 43 tests dans 9 fichiers ; format, ESLint, TypeScript, compatibilité Expo et exports Hermes Android/iOS                                                  |

Documentation détaillée : [ROUTINES.md](ROUTINES.md), [TESTING.md](TESTING.md), [ROADMAP.md](ROADMAP.md). Dossiers, programmes, performances précédentes et détection PR restent dans leurs statuts antérieurs. L’onglet Plan héberge ici les routines ; le meal planner §113 n’est pas implémenté.

## Lot 3 — performances précédentes et PR — 2026-09-06

Les sections 27 et 28 passent à DONE pour les parcours locaux implémentés. §29 et §33 restent IN_PROGRESS : les records sont visibles dans le détail d’historique, mais le bilan complet, médias, calendrier et filtres restent à réaliser. Les tables matérialisées et agrégats des sections 168/234 ne sont pas certifiés par cette projection locale.

| Sous-fonction                                                   | Statut  | Preuve / limite                                                                                                                                        |
| --------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Précédente performance avant chaque série                       | TESTED  | Identité d’exercice, occurrence, type et rang ; exclusion des séances abandonnées/ultérieures, gestion des trous et états vides                        |
| Charge, reps, RPE et unités d’affichage                         | TESTED  | Parcours Training réel sous hôtes React Native simulés, bascule kg/lb sans écriture SQLite                                                             |
| Cinq PR par exercice                                            | TESTED  | Maximum charge/reps/volume de série/1RM estimé/volume d’exercice dans une séance ; formule Epley injectable, première référence, égalités et tolérance |
| Recalcul après correction, dévalidation, suppression ou abandon | TESTED  | Projection pure des sources SQLite ; records actifs provisoires et reconstruction des records historiques suivants                                     |
| Affichage des records dans l’historique                         | TESTED  | Parcours UI validation → dévalidation → clôture confirmée → détail History                                                                             |
| Reprise hors ligne et isolation                                 | TESTED  | Réouverture SQLite, propriétaire isolé et absence d’écriture outbox lors des lectures ; chargement UI hors ligne                                       |
| Validation native et cloud                                      | BLOCKED | Aucun téléphone/émulateur accessible ; configuration Supabase toujours absente                                                                         |

54 tests dans 10 fichiers. Les règles exactes, y compris les métriques applicables aux différents types d’exercice, sont documentées dans [TRAINING_CALCULATIONS.md](TRAINING_CALCULATIONS.md). Les records de charge ne traitent jamais l’assistance comme un poids soulevé et n’inventent pas de masse corporelle. Les critères originaux ci-dessous restent intacts.

## Lot 4 — supersets et réorganisation — 2026-09-06

Les sections 22 et 24 passent à DONE pour les parcours locaux. Les séries se réordonnent dans la séance active ; superset, tri-set et giant set possèdent un modèle durable, des repères, un parcours guidé et un repos par tour. §25 reste IN_PROGRESS : notifications et validation du cycle de vie sur appareil ne sont pas livrées. §168 reste partiel malgré l’ajout de `superset_groups`.

| Sous-fonction                                                 | Statut  | Preuve / limite                                                                                                                              |
| ------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Groupe durable avec parent routine ou séance                  | TESTED  | SQLite v3, propriétaire/parent exclusif, création et dissociation atomiques, refus des membres invalides                                     |
| Superset / tri-set / giant set, repères A1/A2/A3              | TESTED  | Groupes de 2/3/4+ membres ; commandes d’interface et fonctions de navigation                                                                 |
| Réorganisation blocs, membres et séries                       | TESTED  | Permutations complètes, groupes contigus et positions persistées ; boutons accessibles sans dépendance de drag-and-drop                      |
| Mode guidé et repos de fin de tour                            | TESTED  | A1 → A2 → A3 → A1, séries en nombres inégaux, dévalidation et reprise d’une base fichier                                                     |
| Routines, copies de séance et partages conservent les groupes | TESTED  | Nouveaux UUID, repos indépendant ; format v2 prévisualisé et validé ; import v1 sans groupes conservé                                        |
| Résistance aux pannes de copies/modifications                 | TESTED  | Graphe et outbox annulés ensemble ; sources incohérentes refusées sans perte silencieuse de groupe                                           |
| Extension PostgreSQL/RPC/RLS                                  | TESTED  | Troisième migration et outbox réelle jusqu’aux copies/tombstones ; contrainte parent/propriétaire, idempotence et absence d’écriture directe |
| Contrôle global                                               | TESTED  | 68 tests, 11 fichiers ; TypeScript, ESLint et formatage                                                                                      |
| Validation native et cloud réelle                             | BLOCKED | Téléphone/émulateur et instance Supabase non vérifiés ; notification de repos toujours absente                                               |

Voir [SUPERSETS.md](SUPERSETS.md), [TESTING.md](TESTING.md) et [ROADMAP.md](ROADMAP.md). Les critères originaux des 277 sections restent intacts. Les mentions de supersets futurs/refusés dans le journal des lots précédents décrivent leur état historique ; le lot 4 les remplace.

## Lot 5 — dossiers de routines — 2026-09-06

La section 31 passe à DONE : `RoutineFolder`, classement et glisser-déposer sont implémentés localement. Les programmes §32 restent NOT_STARTED. Les mentions de dossiers futurs dans les lots précédents décrivent leur état historique ; les 277 sections contractuelles restent intactes.

| Sous-fonction                                                 | Statut  | Preuve / limite                                                                                                                                       |
| ------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Créer, renommer et classer les dossiers                       | TESTED  | Service SQLite transactionnel, ordre persistant et formulaire réel                                                                                    |
| Déplacer/insérer les routines dans un dossier ou Sans dossier | TESTED  | Positions par dossier, ancrage par UUID, permutations complètes et concurrence sérialisée                                                             |
| Glisser-déposer et commandes équivalentes                     | TESTED  | Événements grant/move/release/terminate dans le composant réel ; géométrie native simulée, annulations sans écriture ; boutons pour cibles hors écran |
| Suppression de dossier sans perte                             | TESTED  | Confirmation UI, routines ajoutées à la racine, graphes et séances conservés, rollback sur panne                                                      |
| Bibliothèque filtrée et retour de l’éditeur                   | TESTED  | Création dans le dossier courant et sélection conservée entre écrans                                                                                  |
| Migration et reprise hors ligne                               | TESTED  | SQLite v4, ancienne ligne sans folderId et outbox conservées ; réouverture fichier, isolation du propriétaire                                         |
| PostgreSQL / RPC / RLS                                        | TESTED  | Quatrième migration, vraie outbox jusqu’au tombstone, FK composite et idempotence                                                                     |
| Vérification native/cloud                                     | BLOCKED | Mesures/gestes physiques et serveur Supabase réel non vérifiés ; protocole testé en PostgreSQL embarqué                                               |

82 tests dans 12 fichiers ; détails dans [ROUTINE_FOLDERS.md](ROUTINE_FOLDERS.md) et [TESTING.md](TESTING.md). La duplication conserve le dossier source ; les imports et conversions depuis l’historique sont rangés dans Sans dossier. Le partage ne transmet pas l’organisation privée des dossiers.

## Lot 6 — programmes — 2026-09-08

La section §32 est livrée. Les programmes regroupent des occurrences ordonnées de routines, avec répétition possible. Voir [PROGRAMS.md](PROGRAMS.md).

| Fonction                                                | Statut  | Preuve / limite                                                                                                   |
| ------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------- |
| Composition, édition, ordre, duplication et suppression | TESTED  | Références partagées aux routines, UUID distincts des occurrences et copies                                       |
| Démarrage d’une occurrence                              | TESTED  | Snapshot indépendant avec groupes, refus des routines vides et d’un second workout actif                          |
| Suppression de routine ou programme                     | TESTED  | Liens retirés atomiquement ; routines conservées lors de la suppression du programme, séances toujours conservées |
| Persistance locale et reprise                           | TESTED  | SQLite v5, upgrade v4 sans réécriture des payloads/queues, rollback et réouverture                                |
| PostgreSQL / RPC / RLS                                  | TESTED  | Cinquième migration, outbox réelle, idempotence, FK propriétaire et écritures directes interdites                 |
| Interface hors ligne                                    | TESTED  | Création, édition, composition, démarrage, duplication et suppression avec hôtes natifs simulés                   |
| Vérification native/cloud                               | BLOCKED | Exécution sur téléphone et serveur Supabase réel non vérifiés                                                     |

94 tests passent dans 13 fichiers. Les sections globales Training et base de données restent partielles ; les programmes ne livrent pas la planification calendaire ou la progression automatique.

## Critères contractuels exhaustifs

### 0. RÈGLE ABSOLUE : PARITÉ FONCTIONNELLE, PAS COPIE PROPRIÉTAIRE

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 1. NOM DU PRODUIT

Statut : DONE

<details>
<summary>Critères originaux intégraux</summary>

Nom temporaire :

GYMTRACK

Tout le branding doit être centralisé afin que le nom puisse être changé facilement.

Créer :

APP_NAME
APP_SLUG
APP_SCHEME
BRAND_CONFIG

Aucun nom de produit concurrent ne doit apparaître dans l'interface finale.

</details>

### 2. OBJECTIF PRODUIT

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 3. PRINCIPES NON NÉGOCIABLES

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 4. STACK MOBILE

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 5. STOCKAGE LOCAL

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 6. BACKEND

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 7. ARCHITECTURE DU CODE

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 8. DESIGN SYSTEM

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 9. NAVIGATION

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 10. AUTHENTIFICATION

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 11. ONBOARDING GLOBAL

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 12. DASHBOARD TODAY

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 13. MOTEUR D'ENTRAÎNEMENT

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 14. DÉMARRAGE WORKOUT

Statut : DONE

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 15. EXERCISE DATABASE

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 16. MUSCLES

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 17. ÉQUIPEMENTS

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 18. EXERCICES PERSONNALISÉS

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 19. EXERCISE PICKER

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 20. SÉRIES

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 21. TYPES DE SÉRIES

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

NORMAL
WARMUP
DROP_SET
FAILURE

Architecture extensible pour :

AMRAP
BACKOFF
MYO_REP
CUSTOM

</details>

### 22. SET OPERATIONS

Statut : DONE

<details>
<summary>Critères originaux intégraux</summary>

Supporter :

add
delete
duplicate
reorder
edit
complete
uncomplete

Chaque modification est sauvegardée immédiatement localement.

</details>

### 23. RPE / RIR

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 24. SUPERSETS

Statut : DONE

<details>
<summary>Critères originaux intégraux</summary>

Supporter :

superset
tri-set
giant set

Créer SupersetGroup.

Exemple :

A1 Bench
A2 Fly

Les timers et la navigation doivent comprendre ce groupement.

</details>

### 25. REST TIMER

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 26. NOTES WORKOUT

Statut : DONE

<details>
<summary>Critères originaux intégraux</summary>

Trois niveaux possibles :

WorkoutNote
WorkoutExerciseNote
RoutineExerciseNote

Historiser correctement.

</details>

### 27. PREVIOUS PERFORMANCE

Statut : DONE

<details>
<summary>Critères originaux intégraux</summary>

Avant une série afficher :

weight
reps
RPE

de la dernière occurrence pertinente.

L'historique doit prendre en compte les unités correctement.

</details>

### 28. PERSONAL RECORDS

Statut : DONE

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 29. WORKOUT SUMMARY

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 30. ROUTINES

Statut : DONE

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 31. DOSSIERS DE ROUTINES

Statut : DONE

<details>
<summary>Critères originaux intégraux</summary>

RoutineFolder.

Exemple :

Push Pull Legs

Push
Pull
Legs

Drag & drop.

</details>

### 32. PROGRAMMES

Statut : DONE

<details>
<summary>Critères originaux intégraux</summary>

Program

contient plusieurs routines.

Exemples originaux :

Beginner 3 Days
PPL 6 Days
Upper Lower
Strength
Hypertrophy
Home Training

</details>

### 33. WORKOUT HISTORY

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 34. WORKOUT STATISTICS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 35. MUSCLE STATISTICS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 36. PLATE CALCULATOR

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Entrées :

target weight
bar weight
available plates

Retour :

configuration de chaque côté.

</details>

### 37. WARMUP CALCULATOR

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

À partir du working set :

générer plusieurs séries progressives.

Algorithme configurable.

</details>

### 38. DÉBUT DU MODULE NUTRITION

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

Le module nutrition doit avoir le même niveau de priorité que le moteur de workout.

Un utilisateur doit pouvoir ouvrir l'app et enregistrer un aliment en quelques secondes.

</details>

### 39. FOOD DIARY

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 40. NAVIGATION JOURNAL

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

Date picker.

Support :

previous day
next day
week navigation
calendar

Permettre de modifier les journées passées ou futures.

</details>

### 41. RÉSUMÉ JOURNAL

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 42. FOOD ENTRY

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 43. FOOD MODEL

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 44. MACRONUTRIMENTS

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 45. MICRONUTRIMENTS

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 46. FOOD SERVINGS

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 47. NORMALISATION ALIMENTAIRE

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

Conserver lorsque possible :

nutrition per 100 g

et

nutrition per serving.

Conversions fiables.

Faire attention aux arrondis.

Ne jamais transformer 99 kcal en 100 kcal au niveau de la base de calcul pour des raisons uniquement visuelles.

</details>

### 48. FOOD PROVIDER ABSTRACTION

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 49. SOURCE DES DONNÉES

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 50. FOOD CACHE

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 51. FOOD SEARCH

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 52. RECENT FOODS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Créer automatiquement :

Recent

basé sur l'historique utilisateur.

</details>

### 53. FREQUENT FOODS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Calculer :

nombre de logs
récence
meal slot

Utiliser cela pour accélérer la saisie.

</details>

### 54. FAVORITES

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

L'utilisateur peut explicitement ajouter un aliment en favori.

</details>

### 55. QUICK LOG

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Afficher un bouton "+" à côté d'un résultat.

Il enregistre directement la portion par défaut.

Feedback :

haptic
toast

</details>

### 56. FOOD DETAILS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 57. BARCODE SCANNER

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 58. FOOD CREATION

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 59. FOOD QUALITY SYSTEM

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 60. FOOD CORRECTIONS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 61. QUICK ADD

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 62. MULTI-DAY LOGGING

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Permettre d'ajouter le même aliment à :

plusieurs dates

en une action.

Exemple :

Monday
Tuesday
Wednesday
Thursday
Friday

</details>

### 63. COPY MEAL

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Permettre :

Copy Meal to Today
Copy to Date
Copy to Another Meal

</details>

### 64. COPY PREVIOUS MEAL

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Action très rapide :

Same as yesterday

permettant de récupérer le contenu du même meal slot de la dernière journée pertinente.

</details>

### 65. MOVE FOOD

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Déplacer un aliment de :

Lunch

vers :

Dinner

sans recréer l'entrée.

</details>

### 66. BULK OPERATIONS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Sélection multiple :

delete
move
copy
duplicate

</details>

### 67. FOOD TIMESTAMPS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Chaque entrée peut avoir :

date
time

Option :

timestamps enabled/disabled.

Permettre analyses futures :

répartition des protéines
horaire des repas
nutrition autour des entraînements

</details>

### 68. FOOD NOTES

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Notes journalières ou par repas.

Exemple :

"Très faim aujourd'hui"

Ne pas envoyer automatiquement ces notes à l'IA sans permission.

</details>

### 69. MY FOODS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Section personnelle regroupant :

aliments créés
aliments favoris
aliments privés

</details>

### 70. SAVED MEALS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 71. RECIPES

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 72. RECIPE SERVINGS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

L'utilisateur peut modifier :

nombre de portions produites

et la nutrition par portion est recalculée.

</details>

### 73. BULK INGREDIENT IMPORT

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Permettre de coller :

500g chicken breast
200g rice
1 tbsp olive oil
2 tomatoes

Le parser propose les correspondances.

L'utilisateur valide chaque correspondance avant calcul final.

</details>

### 74. RECIPE IMPORT FROM WEB

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 75. RESTAURANT FOODS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 76. MEAL SCAN

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 77. RÈGLE MEAL SCAN

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Ne jamais enregistrer automatiquement un résultat incertain.

Afficher :

recognized food
confidence
estimated serving

L'utilisateur garde le dernier mot.

</details>

### 78. MEAL SCAN PROVIDER

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Créer abstraction :

MealVisionProvider

afin de pouvoir utiliser :

API vision
modèle propriétaire
modèle local futur

Ne pas lier le domaine métier à un fournisseur IA précis.

</details>

### 79. VOICE LOGGING

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 80. VOICE LOG REVIEW

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 81. VOICE PROVIDER

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Créer :

SpeechProvider
FoodParsingProvider

Interchangeables.

</details>

### 82. NUTRITION GOALS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 83. MACRO GOALS BY GRAM

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Exemple :

Protein 180 g
Carbs 300 g
Fat 70 g

Calculer les pourcentages affichés.

</details>

### 84. MACRO GOALS BY PERCENTAGE

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Exemple :

Protein 30%
Carbs 40%
Fat 30%

La somme doit faire 100%.

</details>

### 85. DIFFERENT GOALS BY DAY

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 86. TRAINING-AWARE NUTRITION

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Amélioration intégrée au produit :

les jours peuvent être automatiquement classés :

TRAINING
REST

en fonction du programme.

Mais l'utilisateur peut modifier manuellement.

</details>

### 87. GOALS BY MEAL

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Permettre :

Breakfast 20%
Lunch 30%
Pre-workout 15%
Dinner 35%

ou calories absolues.

Permettre également objectifs protéines par repas.

</details>

### 88. ENERGY GOAL ENGINE

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 89. EXERCISE CALORIE SETTINGS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Paramètre :

ADD_EXERCISE_CALORIES_TO_GOAL = ON/OFF

Si ON :

Daily calorie allowance =
base target + eligible activity calories

Si OFF :

les exercices restent enregistrés mais ne modifient pas la cible.

</details>

### 90. ANTI DOUBLE-COUNTING

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 91. NET CARBS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Option :

TOTAL_CARBS
NET_CARBS

Net carbs configurable selon données disponibles.

Enregistrer séparément :

total carbs
fiber
sugar alcohols

La logique doit être documentée et adaptée au contexte réglementaire/local.

</details>

### 92. NUTRIENT DASHBOARD

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Modes de dashboard :

MACROS
BALANCED
HEART
LOW_CARB
CUSTOM

Ce sont des présentations originales, pas des copies visuelles.

</details>

### 93. DAILY NUTRIENT VIEW

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Afficher :

consumed
goal
remaining
percentage

pour tous les nutriments configurés.

</details>

### 94. FOOD ANALYSIS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Analyser les aliments d'une journée/semaine :

principales sources de protéines
fibres
sodium
saturated fat
etc.

Ne pas qualifier automatiquement un aliment de "bon" ou "mauvais".

Utiliser des formulations informatives.

</details>

### 95. MACROS BY MEAL

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Pour chaque repas :

Calories
Protein
Carbs
Fat

Graphique relatif.

</details>

### 96. WATER

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 97. WATER HISTORY

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Vue :

daily
weekly

Pas besoin de transformer l'hydratation en recommandation médicale.

</details>

### 98. ACTIVITY MODULE

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Supporter :

GYMTRACK workouts
cardio manually logged
walking
running
cycling
other activity
synced workouts
steps

</details>

### 99. CARDIO EXERCISE

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

CardioEntry :

activity
duration
distance optional
calories optional
heart_rate optional

Les calories manuelles doivent être identifiées comme estimées.

</details>

### 100. STEPS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 101. CALORIE ADJUSTMENT

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Créer un moteur configurable utilisant :

activity profile
step/activity data
energy target

Afficher clairement :

Base goal
Activity adjustment
Final goal

L'utilisateur doit comprendre pourquoi son objectif change.

</details>

### 102. INTERMITTENT FASTING

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 103. WEIGHT TRACKING

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

WeightEntry :

date
weight
source
note

Support :

kg
lb

Historique graphique.

</details>

### 104. MEASUREMENTS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 105. PROGRESS PHOTOS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 106. PHOTO COMPARISON

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Comparer :

Date A
Date B

Vue :

side-by-side
slider

Ne jamais rendre une progress photo publique automatiquement.

</details>

### 107. PROGRESS OVERVIEW

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 108. WEEKLY DIGEST

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 109. FOOD GROUP INSIGHTS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 110. COMPLETE DAY

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Action :

FINISH LOGGING FOR TODAY

Créer un DailyCompletion.

Afficher :

résumé
adherence
nutrition balance

Éviter les prédictions de poids irréalistes ou non validées.

</details>

### 111. STREAKS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Types possibles :

daily logging
workout
nutrition logging
water

Ne jamais supprimer définitivement des données à cause d'un streak cassé.

</details>

### 112. LOGGING REMINDERS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 113. MEAL PLANNER

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Créer un véritable système de planification.

MealPlan :

start_date
end_date
user_id
goals
budget
preferences

Planning jour par jour.

</details>

### 114. MEAL PLANNER INPUTS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 115. MEAL PLAN GENERATION

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Le moteur doit sélectionner ou générer des recettes respectant approximativement :

Calories
Protein
Carbs
Fat

au niveau quotidien.

Ne jamais fabriquer une nutrition sans recalculer à partir des ingrédients.

</details>

### 116. SWAP MEAL

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Action :

SWAP

propose plusieurs alternatives compatibles avec :

meal calories
macros
preferences
time
budget

</details>

### 117. LOG FROM PLAN

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Un repas planifié peut être ajouté au journal en un clic.

Choisir :

date
meal
servings

</details>

### 118. RECIPE LIBRARY

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 119. GROCERY LIST

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

À partir du Meal Plan :

agréger les ingrédients.

Exemple :

Chicken 1.8 kg
Rice 1.2 kg
Tomatoes 8
Olive oil 150 ml

</details>

### 120. GROCERY NORMALIZATION

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Fusionner intelligemment :

500 g chicken
1 kg chicken

→

1.5 kg chicken

lorsque les unités sont compatibles.

</details>

### 121. PANTRY

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

L'utilisateur coche :

Already have

L'ingrédient sort de la liste à acheter.

</details>

### 122. GROCERY CATEGORIES

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 123. GROCERY SHARING

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Partager une liste via :

deep link
text
share sheet

La personne peut importer une copie.

</details>

### 124. SHOPPING PROVIDER

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Créer une abstraction :

GroceryProvider

permettant ultérieurement :

delivery service
retailer
click & collect

Ne jamais intégrer un service sans API/autorisation compatible.

</details>

### 125. AI NUTRITION COACH

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 126. QUESTIONS COACH

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Exemples :

"Combien de protéines me reste-t-il aujourd'hui ?"

"Que puis-je manger avec 500 kcal restantes ?"

"Analyse ma semaine."

"Propose un dîner avec 40 g de protéines."

"Que manger avant ma séance ?"

"Compare cette semaine à la précédente."

</details>

### 127. UNIFIED FITNESS COACH

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Le même moteur peut également répondre :

"Pourquoi mon bench stagne ?"

"Mon volume pec a-t-il augmenté ?"

"Est-ce que je mange moins les jours de jambes ?"

"Compare mon apport en glucides à mes performances."

"Génère mon Push Day."

</details>

### 128. AI CONTEXT PERMISSIONS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

L'utilisateur contrôle individuellement l'accès IA à :

nutrition
workouts
weight
steps
measurements
photos

Photos désactivées par défaut.

</details>

### 129. AI ACTION SAFETY

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 130. AI ROUTINE CREATION

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

L'IA peut générer :

Workout Routine Draft.

Preview.

SAVE ROUTINE.

</details>

### 131. AI MEAL CREATION

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

L'IA peut générer :

Meal Draft
Recipe Draft
Meal Plan Draft

Mais la nutrition finale est recalculée depuis les vrais Food IDs.

Ne jamais prendre pour vérité les macros générées textuellement par un LLM.

</details>

### 132. AI PROVIDER ABSTRACTION

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

interface AIProvider

Implementations possibles :

OpenAI
Anthropic
Local
Other

Aucun composant UI ne dépend directement du fournisseur.

</details>

### 133. SUIVI MÉDICAMENT OPTIONNEL

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 134. GLP-1 REMINDERS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

L'utilisateur peut créer un rappel.

L'application ne décide jamais elle-même de la fréquence ni de la dose.

</details>

### 135. SIDE EFFECT TRACKING

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 136. HEALTH DATA SECURITY

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Les données suivantes doivent recevoir une protection particulière :

weight
measurements
medication logs
side effects
health integrations
progress photos

Minimiser leur exposition.

Ne jamais les rendre sociales par défaut.

</details>

### 137. SOCIAL NETWORK

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 138. FOLLOW SYSTEM

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 139. WORKOUT FEED

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 140. NUTRITION PRIVACY

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Ne jamais publier automatiquement :

calories
weight
food diary
medications

Le partage alimentaire doit être explicitement activé.

</details>

### 141. DIARY SHARING

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Modes :

PRIVATE
FRIENDS
PUBLIC
ACCESS_LINK

Pour ACCESS_LINK :

token sécurisé révocable.

Permettre de consulter uniquement ce que l'utilisateur a choisi.

</details>

### 142. COPY FRIEND MEAL

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Lorsqu'un ami autorise son diary :

l'utilisateur peut copier un repas vers son propre journal.

Créer de nouvelles DiaryEntries.

Ne pas créer de références modifiables vers les entrées originales.

</details>

### 143. COMMUNITY FEED

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Supporter :

posts
images
progress achievements
workout achievements
comments
likes

</details>

### 144. GROUPS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 145. GROUP POSTS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

GroupPost
GroupComment

Moderation obligatoire.

</details>

### 146. BLOCKING

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Block User empêche :

profile access
follow
comment
message
interaction

selon la politique produit.

</details>

### 147. REPORTING

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Report :

USER
WORKOUT
POST
COMMENT
MEDIA
FOOD

Motif.

Admin review.

</details>

### 148. LEADERBOARDS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 149. USER COMPARISON

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Comparer :

workout frequency
volume
common exercises
PR
muscle distribution

Ne jamais comparer poids/nutrition sans permission explicite.

</details>

### 150. NOTIFICATIONS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 151. APPLE HEALTH

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 152. HEALTH CONNECT

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Même architecture.

Sync :

steps
weight
exercise
energy

selon APIs réellement disponibles.

</details>

### 153. PARTNER INTEGRATIONS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 154. STRAVA

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

OAuth.

Partager éventuellement les workouts terminés.

Ne jamais envoyer la nutrition à Strava par défaut.

</details>

### 155. WEAR OS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 156. APPLE WATCH

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Fonctions similaires.

Training prioritaire.

Sync avec téléphone.

</details>

### 157. WIDGETS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

iOS/Android widgets :

Calories remaining
Protein
Water
Steps
Workout streak
Quick start workout
Favorite routine

</details>

### 158. SUBSCRIPTIONS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Créer tiers originaux :

FREE
PRO
PRO_PLUS

Noms modifiables.

</details>

### 159. FEATURE FLAGS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 160. BILLING

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Utiliser RevenueCat.

Support :

iOS
Android

Vérification côté serveur.

Ne jamais faire confiance uniquement au client pour déterminer le statut Premium.

</details>

### 161. OFFLINE-FIRST NUTRITION

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 162. OFFLINE-FIRST WORKOUT

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

Toutes les opérations de séance restent disponibles.

Le réseau ne doit jamais bloquer la salle.

</details>

### 163. SYNC QUEUE

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 164. IDENTIFIANTS

Statut : TESTED

<details>
<summary>Critères originaux intégraux</summary>

Générer les UUID côté client lorsque nécessaire.

Permet création offline.

</details>

### 165. CONFLICT RESOLUTION

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

Documenter stratégie.

Exemple :

immutable logs :
append

editable metadata :
updated_at + merge policy

workout sets :
entity-level updates

Ne jamais écraser silencieusement des données.

</details>

### 166. FOOD HISTORY IMMUTABILITY

Statut : TESTED

<details>
<summary>Critères originaux intégraux</summary>

Les données nutritionnelles enregistrées dans un diary restent un snapshot.

Une mise à jour du produit global ne doit pas modifier les calories consommées plusieurs mois auparavant.

</details>

### 167. DATABASE AUTH

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

Tables :

users
profiles
user_settings
user_preferences
devices
sessions metadata where appropriate

Auth sensible gérée par Supabase Auth.

</details>

### 168. DATABASE TRAINING

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 169. DATABASE NUTRITION

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 170. DATABASE PLANNING

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

meal_plans
meal_plan_days
meal_plan_meals

grocery_lists
grocery_items
pantry_items

</details>

### 171. DATABASE HEALTH

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 172. DATABASE SOCIAL

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 173. DATABASE AI

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

ai_conversations
ai_messages
ai_permissions
ai_generated_drafts

Éviter de stocker inutilement du contexte sensible.

</details>

### 174. DATABASE SUBSCRIPTIONS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

subscriptions
subscription_events
entitlements
feature_flags

</details>

### 175. INDEXES

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 176. FOOD SEARCH ENGINE

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Pour une petite version :

PostgreSQL full-text/trigram.

À grande échelle prévoir abstraction permettant :

Typesense
Meilisearch
Algolia
OpenSearch

sans réécrire toute l'application.

</details>

### 177. RLS

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 178. STORAGE

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Buckets distincts :

avatars
workout-media
progress-photos
meal-scan-temp
recipe-images
community-media

Progress photos privées.

Signed URLs lorsque nécessaire.

</details>

### 179. TEMPORARY AI IMAGES

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Les images Meal Scan temporaires doivent pouvoir être supprimées automatiquement après traitement sauf demande explicite de conservation.

</details>

### 180. GDPR

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Créer :

export data
delete account
privacy center
consent records
data retention policy

</details>

### 181. ACCOUNT DELETE

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Flow :

confirmation
reauthentication
grace period optional
revoke integrations
delete private media
delete/anonymize account data according to policy

</details>

### 182. DATA EXPORT

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 183. PRINTABLE REPORT

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Créer companion web ou génération PDF pour :

date range
food diary
nutrition
exercise
weight

Format imprimable.

</details>

### 184. WEB COMPANION

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 185. ADMIN WEB

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Next.js.

Roles serveur :

SUPPORT
MODERATOR
CONTENT_ADMIN
SUPER_ADMIN

</details>

### 186. ADMIN FOOD

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Admin peut :

inspect food
resolve reports
merge duplicates
verify entries
disable malicious entry
manage restaurant data

Audit log obligatoire.

</details>

### 187. ADMIN CONTENT

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Gérer :

programs
recipes
exercise library
community reports
users

</details>

### 188. AUDIT LOG

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Pour toute action admin sensible :

admin_id
action
entity
entity_id
before
after
timestamp

</details>

### 189. I18N

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

Support initial :

French
English

Architecture extensible.

Aucun texte visible hardcodé dans les composants.

</details>

### 190. LOCALES

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 191. ALLERGENS ET DIETARY PREFERENCES

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 192. SEARCH HISTORY

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Conserver localement :

food searches
exercise searches

Permettre clear history.

</details>

### 193. PERFORMANCE

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

Objectifs :

fluid lists
fast startup
minimal unnecessary renders
pagination
image compression
database indexes

Aucun feed contenant 500 éléments ne doit rendre les 500 composants simultanément.

</details>

### 194. ACCESSIBILITY

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

Respecter :

VoiceOver/TalkBack
dynamic font
contrast
touch targets
accessible labels
keyboard navigation web

</details>

### 195. ANALYTICS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 196. ERROR TRACKING

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Sentry.

Séparer :

development
staging
production

Scrubber PII.

Ne jamais envoyer automatiquement des diary contents à Sentry.

</details>

### 197. NOTIFICATION SCHEDULING

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Utiliser :

local notifications

pour timers et rappels locaux.

Backend notifications pour :

social
weekly reports
events serveur

</details>

### 198. ENV VARIABLES

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 199. SECRETS

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

Les secrets serveur comme :

STRAVA_CLIENT_SECRET
AI private keys

ne doivent jamais être embarqués dans l'application mobile.

</details>

### 200. CI

Statut : DONE

<details>
<summary>Critères originaux intégraux</summary>

GitHub Actions :

install
lint
format check
typecheck
unit tests
integration tests

Sur PR.

</details>

### 201. BUILD

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

Configurer :

development
preview
production

avec EAS.

</details>

### 202. TESTS UNITAIRES TRAINING

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

Tester :

volume
1RM
unit conversion
plate calculator
warm-up
PR detection
superset ordering
timer

</details>

### 203. TESTS UNITAIRES NUTRITION

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 204. FOOD SNAPSHOT TEST

Statut : TESTED

<details>
<summary>Critères originaux intégraux</summary>

Créer un test critique :

1. utilisateur log Food A à 100 kcal ;
2. Food A est modifié globalement à 120 kcal ;
3. historique du jour initial reste à 100 kcal.

</details>

### 205. OFFLINE TEST

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

Scénario :

disable network
start workout
log food
log water
finish workout
restart app
enable network

Toutes les données doivent être synchronisées sans perte.

</details>

### 206. E2E TRAINING

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 207. E2E NUTRITION MANUAL

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 208. E2E BARCODE

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 209. E2E UNKNOWN BARCODE

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Scan unknown
↓
Create product
↓
enter nutrition
↓
save
↓
log

</details>

### 210. E2E VOICE

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 211. E2E MEAL SCAN

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 212. E2E RECIPE

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 213. E2E MEAL PLAN

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 214. E2E SOCIAL

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

User A follows User B.

B posts workout.

A sees it.

A likes.

B receives notification.

</details>

### 215. E2E DIARY SHARING

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

B enables Friends diary.

A opens B diary.

A copies lunch.

Copied items appear in A diary as independent entries.

</details>

### 216. E2E INTEGRATION

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Log workout locally.

Sync to health platform.

Health platform returns same workout.

System detects duplicate.

Calories are not double counted.

</details>

### 217. COMPONENTS

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 218. NUMBER INPUT WORKOUT

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 219. NUMBER INPUT NUTRITION

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

Serving input :

0.25
0.5
1
1.5

grams input :

numeric decimal

Support copy/paste.

</details>

### 220. UX FOOD LOGGING

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

Objectif :

un aliment fréquent doit pouvoir être enregistré en environ 2 à 4 interactions.

Ne pas obliger l'utilisateur à ouvrir 5 modales.

</details>

### 221. UX ACTIVE WORKOUT

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

Objectif :

valider une série avec un seul tap.

Le clavier ne doit pas gêner le scroll.

</details>

### 222. SEARCH DEBOUNCE

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Recherche alimentaire :

debounce raisonnable

annuler requêtes obsolètes.

</details>

### 223. OPTIMISTIC UPDATES

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Utiliser pour :

like
favorite
simple diary edits
set completion

mais conserver rollback en cas d'échec.

</details>

### 224. SECURITY

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 225. ABUSE PREVENTION

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Pour Food API proxy :

rate limits utilisateur
cache
provider quotas

Pour IA :

daily quotas
token limits
moderation when appropriate

</details>

### 226. IMAGE SECURITY

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Valider :

file type
file size
dimensions

Strip metadata sensible lorsque pertinent.

</details>

### 227. MEDICAL SAFETY

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

L'application :

ne diagnostique pas ;
ne prescrit pas ;
ne modifie pas un traitement ;
ne remplace pas un professionnel de santé.

Les objectifs nutritionnels automatiques sont des estimations.

</details>

### 228. DATA CONSISTENCY

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

Toutes les valeurs temporelles serveur :

UTC.

Afficher en timezone utilisateur.

Diary dates doivent respecter le jour local utilisateur.

Attention aux voyages et DST.

</details>

### 229. PRECISION

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

Stockage nutrition :

NUMERIC approprié.

Ne pas utiliser uniquement INTEGER pour des grammes décimaux.

</details>

### 230. DELETIONS

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

Utiliser soft-delete uniquement lorsque justifié.

Pour les données personnelles, la suppression demandée par l'utilisateur doit réellement suivre la politique de rétention définie.

</details>

### 231. EVENT SYSTEM

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 232. BACKGROUND JOBS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Créer jobs pour :

weekly digest
food cache refresh
stats aggregation
notifications
meal plan generation
media cleanup

</details>

### 233. DAILY AGGREGATES

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Créer des tables agrégées uniquement pour performance.

La source de vérité reste les événements/logs.

Exemple :

DailyNutritionSummary

peut être recalculé.

</details>

### 234. TRAINING AGGREGATES

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Même principe :

UserTrainingSummary
ExerciseStats

recalculables depuis workouts.

</details>

### 235. HOME PERSONALIZATION

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

L'utilisateur choisit les cartes :

Calories
Macros
Water
Steps
Weight
Next Workout
Weekly Sets
Streak

</details>

### 236. COACH PERSONALIZATION

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Suggested prompts basés sur :

time of day
remaining calories
training schedule
recent activity

Sans exposer inutilement les données.

</details>

### 237. FEATURE DISCOVERY

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Les fonctions avancées doivent être découvrables progressivement.

Ne pas afficher 30 boutons sur Today.

Utiliser :

contextual actions
bottom sheets
settings
more menu

</details>

### 238. DATA IMPORT

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Prévoir import futur depuis :

CSV nutrition
CSV workout
generic JSON

Créer des parsers séparés.

Ne pas copier de données concurrentes en violation de leurs CGU.

</details>

### 239. SHARE CARDS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Workout share card.

Nutrition share card optionnelle ne montrant que ce que l'utilisateur choisit.

Exemples :

Protein goal reached
Workout PR
Weekly streak

Jamais le poids sans opt-in explicite.

</details>

### 240. DEEP LINKS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Support :

/user/{username}

/workout/{publicId}

/routine/{publicId}

/program/{publicId}

/recipe/{publicId}

/meal-plan/{shareId}

</details>

### 241. SEARCH GLOBAL

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Recherche globale possible :

users
foods
exercises
routines
recipes

Résultats séparés par catégories.

</details>

### 242. COMMAND PALETTE DE DÉVELOPPEMENT

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

En development seulement :

clear local DB
force sync
simulate offline
view sync queue
switch entitlements
view network logs

Jamais en production.

</details>

### 243. DOCUMENTATION

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 244. README

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 245. SEED DATA

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 246. MIGRATIONS

Statut : DONE

<details>
<summary>Critères originaux intégraux</summary>

Toute modification PostgreSQL passe par migration.

Jamais :

"Va créer la table manuellement dans Supabase."

L'agent doit écrire la migration.

</details>

### 247. DEVELOPMENT PRINCIPLE

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

Ne jamais produire un énorme fichier unique.

Une fonctionnalité complexe doit être découpée.

</details>

### 248. NO FAKE COMPLETION

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

Interdit de considérer une fonctionnalité terminée si elle utilise :

TODO
fake API
mock button
hardcoded success
setTimeout simulant serveur

Mocks autorisés uniquement dans les tests et Storybook/dev harness.

</details>

### 249. PHASE 0 — AUDIT

Statut : DONE

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 250. PHASE 1 — FOUNDATION

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 251. PHASE 2 — AUTH

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Auth
profiles
onboarding
settings
RLS

</details>

### 252. PHASE 3 — TRAINING CORE

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

Exercises
routines
active workout
sets
timers
history
PR

Workout doit devenir réellement utilisable avant de continuer.

</details>

### 253. PHASE 4 — NUTRITION CORE

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 254. PHASE 5 — BARCODE

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Camera
barcode parsing
provider lookup
unknown product flow

</details>

### 255. PHASE 6 — MEALS & RECIPES

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Saved meals
recipes
recipe calculations
import
copy/move

</details>

### 256. PHASE 7 — PROGRESS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Weight
measurements
photos
training charts
nutrition charts

</details>

### 257. PHASE 8 — ACTIVITY

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Steps
water
cardio
calorie adjustments
health platform integrations

</details>

### 258. PHASE 9 — SMART LOGGING

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Meal Scan
Voice Log
multi-day
timestamps
advanced search

</details>

### 259. PHASE 10 — MEAL PLANNER

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Planner
recipe discovery
grocery
pantry
meal swap

</details>

### 260. PHASE 11 — SOCIAL

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Profiles
follows
feed
comments
sharing
community

</details>

### 261. PHASE 12 — AI

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Nutrition Coach
Training Coach
unified context
permissions

</details>

### 262. PHASE 13 — REPORTING

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Weekly digest
progress overview
data export
PDF/web reports

</details>

### 263. PHASE 14 — SUBSCRIPTIONS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

RevenueCat
feature flags
entitlements

</details>

### 264. PHASE 15 — WATCH / WIDGETS

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Wear OS
Apple Watch
home widgets

</details>

### 265. PHASE 16 — WEB

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

Next.js companion
reports
diary
history

</details>

### 266. PHASE 17 — ADMIN

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

moderation
food quality
users
reports
content

</details>

### 267. PHASE 18 — HARDENING

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

security
performance
offline stress testing
E2E
accessibility
app-store readiness

</details>

### 268. PROCESS À CHAQUE PHASE

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 269. NE PAS DEMANDER À L'UTILISATEUR DE FAIRE LE TRAVAIL TECHNIQUE

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 270. CONDITIONS DE QUALITÉ — TRAINING

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 271. CONDITIONS DE QUALITÉ — NUTRITION

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 272. CONDITIONS ADVANCED NUTRITION

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 273. CONDITIONS INTÉGRATION TRAINING × NUTRITION

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 274. SCÉNARIO PRODUIT COMPLET

Statut : NOT_STARTED

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 275. DERNIÈRE RÈGLE

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>

### 276. PREMIÈRE ACTION

Statut : IN_PROGRESS

<details>
<summary>Critères originaux intégraux</summary>

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

</details>
