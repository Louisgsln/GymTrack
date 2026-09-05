import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
if (existsSync('FEATURE_MATRIX.md'))
  throw new Error(
    'Refusing to overwrite the project checklist. Edit statuses in place.',
  );
const source = readdirSync('.').find((file) =>
  file.startsWith('Prompt maître'),
);
const text = readFileSync(source, 'utf8');
const sections = [
  ...text.matchAll(/^# (\d+)\. (.+)\r?\n([\s\S]*?)(?=^# \d+\.|$(?![\s\S]))/gm),
];
if (sections.length !== 277)
  throw new Error(`Expected sections 0–276, got ${sections.length}`);
const domain = (n) =>
  n < 10
    ? 'Fondations'
    : n < 13
      ? 'Compte et Today'
      : n < 38
        ? 'Training'
        : n < 96
          ? 'Nutrition'
          : n < 113
            ? 'Santé et progression'
            : n < 125
              ? 'Planification'
              : n < 133
                ? 'IA'
                : n < 137
                  ? 'Santé sensible'
                  : n < 151
                    ? 'Social'
                    : n < 158
                      ? 'Intégrations'
                      : n < 161
                        ? 'Abonnements'
                        : n < 185
                          ? 'Données et sécurité'
                          : n < 202
                            ? 'Plateformes et exploitation'
                            : n < 217
                              ? 'Validation'
                              : n < 249
                                ? 'Qualité et infrastructure'
                                : 'Phases et acceptation';
let result = `# Matrice contractuelle GYMTRACK\n\nSource de vérité : [cahier des charges](<${source}>).\n\nStatuts : NOT_STARTED, IN_PROGRESS, BLOCKED, DONE, TESTED. Un statut global ne certifie jamais des sous-fonctions non implémentées. Tous les critères originaux sont conservés ci-dessous, sans exclusion de périmètre. Les validations détaillées des lots sont dans TESTING.md.\n\n## État initial — 2026-09-05\n\nDépôt sans code : seul le cahier des charges existe. Aucun package, écran, asset, environnement, test, historique Git ou migration. KEEP : cahier des charges. CREATE : application et infrastructure. Rien à refactorer/supprimer.\n\n## Index\n\n| ID | Domaine | Exigence | Statut |\n| --- | --- | --- | --- |\n`;
for (const [, id, title] of sections)
  result += `| ${id} | ${domain(Number(id))} | ${title} | NOT_STARTED |\n`;
result += '\n## Critères contractuels exhaustifs\n';
for (const [, id, title, body] of sections)
  result += `\n### ${id}. ${title}\n\nStatut : NOT_STARTED\n\n<details>\n<summary>Critères originaux intégraux</summary>\n\n${body.trim().replace(/\n---$/, '')}\n\n</details>\n`;
writeFileSync('FEATURE_MATRIX.md', result);
