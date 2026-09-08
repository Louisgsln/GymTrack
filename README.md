# GYMTRACK

Application mobile Training + Nutrition. Le [cahier des charges](<Prompt maître — application complète Training + Nutrition type Hevy × MyFitnessPal.md>) reste la source de vérité ; [FEATURE_MATRIX.md](FEATURE_MATRIX.md) conserve les 277 sections (0–276) et leur état réel.

## Démarrer

Node 24 LTS, npm et un appareil Android/iOS avec une version Expo Go compatible SDK 57, ou un development build reconstruit pour ce SDK. Le projet utilise Expo 57.0.21, React Native 0.86.3 et React 19.2.3 dans son lockfile.

```sh
npm ci
npm start
```

Pour ouvrir explicitement Expo Go : `npm run go -- --clear`, puis scanner le QR code depuis le téléphone sur le même réseau. Installer la version compatible depuis [expo.dev/go](https://expo.dev/go), en sélectionnant SDK 57 et la plateforme. La version des stores peut différer : suivre les instructions Expo pour Android ou iOS, notamment `eas go`/TestFlight si nécessaire sur iPhone. Le SDK 57 requiert iOS 16.4 ou supérieur. Voir le [guide de compatibilité Expo Go](https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/).

Le mode local ne nécessite aucun compte ni clé. Créer une séance, créer un exercice personnel, l’ajouter, saisir et valider les séries, terminer puis consulter l’historique. Today permet les ajouts nutritionnels manuels. Aucun aliment ou résultat d’IA fictif n’est injecté.

Planifier permet de créer/éditer des routines, réordonner leurs exercices/séries, les dupliquer et les démarrer. Depuis l’historique, une séance peut être répétée, copiée ou enregistrée comme routine. Le partage JSON passe par une prévisualisation ; le contenu reçu s’importe après confirmation. Voir [ROUTINES.md](ROUTINES.md).

La séance active affiche les performances précédentes et les records provisoires par exercice. Les records acquis sont consultables dans le détail de l’historique. Les comparaisons fonctionnent hors ligne et respectent le choix kg/lb ; voir [TRAINING_CALCULATIONS.md](TRAINING_CALCULATIONS.md) pour les règles de pertinence et les cinq métriques.

`npm run android` ouvre un émulateur Android configuré. `npm run ios` nécessite macOS/Xcode. L’application mobile n’expose pas encore de cible web ; le companion Next.js est prévu séparément.

Supersets, tri-sets et giant sets sont disponibles dans « Organiser les exercices », pour les routines et séances actives. Le mode guidé suit les tours et le minuteur attend leur complétion. Les groupes restent indépendants lors des copies et imports. Voir [SUPERSETS.md](SUPERSETS.md).

Planifier permet aussi de créer des dossiers et de déplacer les routines par glisser-déposer ou avec les boutons. Supprimer un dossier conserve ses routines dans Sans dossier. Voir [ROUTINE_FOLDERS.md](ROUTINE_FOLDERS.md).

## Environnement et backend

Planifier → Programmes regroupe des routines dans un ordre choisi, avec répétition possible. Les programmes peuvent être édités, dupliqués et supprimés ; démarrer une occurrence crée une séance indépendante. Voir [PROGRAMS.md](PROGRAMS.md).

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
