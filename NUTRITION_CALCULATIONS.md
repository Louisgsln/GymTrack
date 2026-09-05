# Calculs Nutrition

Un nutriment est une clé extensible accompagnée d’une valeur et d’une unité : kcal, kJ, g, mg ou µg. Une valeur inconnue reste absente ; elle ne devient pas un zéro calculé. L’UI doit présenter les totaux des nutriments saisis comme partiels quand certaines entrées ne les renseignent pas.

Snapshot pour une masse : `nutrimentsPour100g × grammes / 100`. Masse d’une portion : `nombreDePortions × grammesParPortion`. La source est copiée et validée avant insertion, sans référence mutable à l’aliment d’origine. Aucun arrondi avant le rendu.

Les totaux additionnent les snapshots vivants du jour civil local. Une unité de masse compatible est convertie dans l’unité du premier snapshot. Une unité incompatible produit une erreur. Les dates civiles restent indépendantes des timestamps UTC.

Quick Add accepte kcal, protéines, glucides et lipides dans l’UI. Fibres, polyols, objectifs, recettes, kcal/kJ, sodium/sel et net carbs restent au périmètre des tranches suivantes. Il n’y a aucun objectif nutritionnel inventé ni aucune estimation médicale dans cette tranche.
