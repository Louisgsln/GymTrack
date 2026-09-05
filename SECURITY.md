# Sécurité du premier lot

- UUID de propriétaire local persistant ; aucune association implicite avec un compte connecté.
- SQL paramétré ; seuls les noms de tables internes d’une union fermée sont interpolés. RPC à allowlist explicite, search_path vide et contrôle de auth.uid().
- RLS privée et foreign keys composites owner/entity ; tests PostgreSQL exécutés sous le rôle authenticated.
- Zod avant stockage local ; contrôles PostgreSQL sur les payloads distants. Validation exhaustive du futur modèle complet reste à développer.
- SecureStore pour le provider Supabase. Aucune clé privée fournisseur ni service-role côté mobile.
- Logging catégoriel : pas de notes, aliments, payload, identifiants personnels ou tokens dans les logs.
- SQLite n’est pas chiffré applicativement dans cette tranche. Le chiffrement/backup natif, effacement physique et threat model doivent être vérifiés avant déploiement de données médicales.

Le consentement IA, le rate limiting distant, l’export RGPD, l’effacement de compte et le stockage média privé ne sont pas encore livrés. Les migrations ne rendent aucun contenu public.

## Dépendances

L’override ciblé `xcode → uuid 11.1.1` conserve l’API CommonJS v4 utilisée par xcode et corrige GHSA-w5hq-g745-h8pq. L’audit du lot et ses limites figurent dans TESTING.md.
