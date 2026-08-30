# Better Cook — service yt-dlp

Petit service HTTP séparé qui expose `yt-dlp` en API, pour l'extraction de titre/légende/cover
des vidéos TikTok/Instagram/YouTube. Existe séparément de l'app Next.js principale car ces
outils ne tournent pas dans un environnement serverless (Vercel).

## Déploiement sur Railway

1. Crée un compte sur [railway.app](https://railway.app) si besoin.
2. Nouveau projet → "Deploy from GitHub repo" → sélectionne ce repo, avec pour **root directory**
   `yt-dlp-service`. Railway détecte le `Dockerfile` automatiquement.
3. Dans les variables d'environnement du service Railway, ajoute :
   - `SERVICE_TOKEN` — une valeur secrète de ton choix (ex: générée avec `openssl rand -hex 32`).
     Cela protège le service pour que seule ton app Next.js puisse l'appeler.
4. Une fois déployé, Railway te donne une URL publique (ex: `https://xxx.up.railway.app`).

## Configuration côté app Next.js

Dans les variables d'environnement Vercel de l'app principale, ajoute :

- `YTDLP_SERVICE_URL` = l'URL Railway (ex: `https://xxx.up.railway.app`)
- `YTDLP_SERVICE_TOKEN` = la même valeur que `SERVICE_TOKEN` ci-dessus

Sans ces variables, l'app principale utilise `yt-dlp` en local (comportement de développement).

## Cookies (contourner les blocages anti-bot)

TikTok et Instagram bloquent de plus en plus souvent les requêtes venant d'IP de datacenter
(Railway, Render, etc.), même avec la dernière version de yt-dlp. Fournir des cookies d'une
session connectée réduit fortement ces blocages.

1. Connecte-toi à TikTok (et/ou Instagram) dans ton navigateur habituel.
2. Exporte les cookies au format Netscape avec une extension comme
   [Get cookies.txt LOCALLY](https://chromewebstore.google.com/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc)
   (exporte depuis un onglet ouvert sur tiktok.com, éventuellement aussi instagram.com dans le
   même fichier).
3. Dans les variables d'environnement du service (Render/Railway/...), ajoute :
   - `YTDLP_COOKIES` = le contenu complet du fichier `cookies.txt` exporté (colle tout le texte,
     multi-lignes). Marque-la comme secret/sensible.
4. Redéploie le service. Au démarrage, il écrit ce contenu dans un fichier temporaire et l'utilise
   automatiquement (`--cookies`) pour tous les appels à yt-dlp.

⚠️ Ces cookies donnent accès à ta session connectée — ne les partage jamais et régénère-les
(déconnexion/reconnexion) si tu penses qu'ils ont fuité. Ils expirent périodiquement et devront
être régénérés de temps en temps.

## Test local

```bash
cd yt-dlp-service
npm install
node server.js
# dans un autre terminal :
curl -X POST http://localhost:8080/metadata \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```
