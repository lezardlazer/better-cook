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
