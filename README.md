# Better Cook

Centralise et standardise tes recettes de cuisine venant du web, TikTok, Instagram et YouTube :
ingrédients / étapes / durée au même format, avec des tags (healthy, gourmande, plat, dessert, snack, protéinée…),
un suivi "à tester / testé" avec notation, et un panier qui génère une liste de courses.

C'est aussi une PWA installable, avec un raccourci de partage iOS pour importer une recette
directement depuis TikTok/Instagram.

## Prérequis (développement local)

- Node.js
- PostgreSQL (`brew install postgresql@16 && brew services start postgresql@16`)
- [`yt-dlp`](https://github.com/yt-dlp/yt-dlp) installé (`brew install yt-dlp`) — utilisé pour récupérer la légende des vidéos TikTok/Instagram/YouTube sans les télécharger.
- Une clé API Anthropic ([console.anthropic.com](https://console.anthropic.com)) pour la structuration des recettes par IA.

## Configuration

Copie `.env.local.example` en `.env.local` (ou complète `.env`) et renseigne au minimum
`ANTHROPIC_API_KEY` et `DATABASE_URL` (ex: `postgresql://localhost:5432/better_cook` en local).

## Démarrer

```bash
npm install
npx prisma migrate dev   # première fois seulement — crée le schéma dans Postgres
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Comment ça marche

1. Colle une URL sur `/recipes/new` (ou partage-la depuis TikTok/Instagram, voir plus bas).
2. Pour un site web : le contenu est récupéré et, si présent, le bloc `schema.org/Recipe` (JSON-LD) est utilisé en priorité pour une extraction fiable ; sinon le contenu principal de la page est extrait via Readability.
3. Pour TikTok/YouTube/Instagram : `yt-dlp` récupère le titre, la légende et la cover de la vidéo sans la télécharger. Si ça échoue (fréquent sur Instagram), l'app te propose de coller la légende manuellement.
4. Le texte obtenu est structuré par Claude (modèle `claude-haiku-4-5`) en JSON : titre, ingrédients, étapes, durée, tags suggérés.
5. Tu vérifies/ajustes avant d'enregistrer.
6. Classe en "À tester" / "Testé" (+ note sur 5 étoiles), sélectionne des recettes et ajoute-les au panier pour générer une liste de courses consolidée par l'IA.

## Déploiement

L'app est pensée pour tourner sur **Vercel** (app web) + un **petit service séparé pour `yt-dlp`**
(Railway), car les fonctions serverless de Vercel ne permettent pas de faire tourner `yt-dlp`
correctement (pas d'interpréteur Python, timeout court, pas de binaires système).

### 1. Base de données — Postgres hébergé

Sur Vercel : **Storage → Postgres** (propulsé par Neon), ou directement sur [neon.tech](https://neon.tech).
Copie la chaîne de connexion dans `DATABASE_URL` (utilise la variante "pooled"/pgbouncer si proposée).

### 2. Service `yt-dlp` — Railway

Voir [`yt-dlp-service/README.md`](yt-dlp-service/README.md). Une fois déployé, renseigne
`YTDLP_SERVICE_URL` et `YTDLP_SERVICE_TOKEN` dans les variables d'environnement Vercel.

### 3. Stockage des images — Vercel Blob

Sur Vercel : **Storage → Blob** → créer un store et l'attacher au projet. Le token
`BLOB_READ_WRITE_TOKEN` est alors injecté automatiquement (rien à faire côté code).

### 4. Déployer l'app

```bash
npm install -g vercel   # si pas déjà installé
vercel
```

Renseigne les variables d'environnement (`ANTHROPIC_API_KEY`, `DATABASE_URL`,
`YTDLP_SERVICE_URL`, `YTDLP_SERVICE_TOKEN`) dans le dashboard Vercel du projet. Les migrations
Prisma s'appliquent automatiquement à chaque build (`prisma migrate deploy` est intégré au
script `build`), rien à lancer manuellement.

## Installer la PWA et partager depuis TikTok/Instagram (iPhone)

⚠️ Sur iPhone, Safari ne permet pas à une PWA d'apparaître nativement dans le menu de partage
(comme WhatsApp) — c'est une limitation d'Apple, pas de l'app. La solution : un **Raccourci iOS**
qui capte le partage et ouvre l'app avec le lien pré-rempli.

**1. Installer la PWA**
Ouvre l'app dans Safari → bouton Partager (⎋) → "Sur l'écran d'accueil".

**2. Créer le raccourci de partage**
Dans l'app **Raccourcis** :
1. Nouveau raccourci → "Ajouter une action"
2. Choisis l'action **"Ouvrir les URL"** (ou "URL" puis "Ouvrir URLs")
3. Configure l'URL comme : `https://ton-domaine.vercel.app/recipes/new?url=` suivi de l'entrée
   du raccourci (insère la variable "Entrée du raccourci" juste après `url=`)
4. Dans les réglages du raccourci (icône ⓘ) : active **"Afficher dans la feuille de partage"**,
   et limite les types acceptés à **"URLs"** et **"Texte de sécurité"** (Safari services)
5. Nomme-le "Better Cook" avec une icône de ton choix

**3. Utiliser**
Depuis TikTok/Instagram → Partager → fais défiler jusqu'à "Better Cook" dans les actions →
l'app s'ouvre avec l'import déjà lancé automatiquement.
