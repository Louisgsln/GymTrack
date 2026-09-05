# GYMTRACK

Application mobile Training + Nutrition. Le [cahier des charges](<Prompt maître — application complète Training + Nutrition type Hevy × MyFitnessPal.md>) reste la source de vérité ; [FEATURE_MATRIX.md](FEATURE_MATRIX.md) conserve les 277 sections (0–276) et leur état réel.

## Démarrer

Node 24 LTS, npm et un appareil Android/iOS avec une version Expo Go compatible SDK 55, ou un development build.

```sh
npm ci
npm start
```

Le mode local ne nécessite aucun compte ni clé. Créer une séance, créer un exercice personnel, l’ajouter, saisir et valider les séries, terminer puis consulter l’historique. Today permet les ajouts nutritionnels manuels. Aucun aliment ou résultat d’IA fictif n’est injecté.

`npm run android` ouvre un émulateur Android configuré. `npm run ios` nécessite macOS/Xcode. L’application mobile n’expose pas encore de cible web ; le companion Next.js est prévu séparément.

## Environnement et backend

Copier `.env.example` vers `.env` uniquement pour préparer Supabase. Les variables `EXPO_PUBLIC_SUPABASE_URL` et `EXPO_PUBLIC_SUPABASE_ANON_KEY` sont publiques ; aucune clé service-role ou fournisseur ne doit être placée dans l’app.

La migration PostgreSQL est dans `supabase/migrations`. Avec Supabase CLI et Docker installés, `supabase start` puis `supabase db reset` appliquent les migrations au backend local. Sur un projet de staging explicitement lié : `supabase db push`. Aucun schéma à créer à la main. Aucune migration distante n’a été exécutée pendant ce lot.

Le transport RPC Supabase est implémenté mais n’est pas branché au mode local : connexion, transfert explicite du propriétaire local, récupération distante et résolution des conflits doivent être livrés avant activation. Le client refuse une opération appartenant à un autre utilisateur connecté.

## Qualité et builds

```sh
npm run check
npx expo install --check
npx expo export --platform android --platform ios
```

`eas.json` définit development/preview/production. `eas build --profile development --platform android` nécessite un projet EAS lié et des credentials. Les identifiants de bundle provisoires sont à réserver avant distribution. Les exports Hermes ne constituent pas un APK/IPA ni un test sur téléphone.

Les exercices sont créés par l’utilisateur. Le seed légal d’exercices/aliments/programmes n’est pas encore implémenté ; aucune commande seed factice n’est fournie.

Voir [ARCHITECTURE.md](ARCHITECTURE.md), [ROADMAP.md](ROADMAP.md), [DATABASE.md](DATABASE.md), [SYNC.md](SYNC.md) et [TESTING.md](TESTING.md).
