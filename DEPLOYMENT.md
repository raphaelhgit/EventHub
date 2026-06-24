# Documentation de déploiement - EventHub

## 1. Architecture

https://itzthomthom.fr/

le client tape le domaine, nginx recoit la requete, si c'est du front il sert le build react, si c'est l'api (/auth, /events, /tickets, /api/...) il renvoie vers le back node sur le port 3000, le back parle a sqlite dans back/data/
```
EVENTHUB/
├── front/          # Code React
├── back/           # Code Node.js
├── DEPLOYMENT.md      # Documentation principale
├── .github/
│   └── workflows/
│       └── main.yml # Pipeline CI/CD
├── scripts/
│   ├── deploy.sh      # Script de déploiement (optionnel)
└── README.md          # Description du projet
```
## 2. Prérequis

[Liste des prérequis]

serveur linux avec ssh (31.97.177.104), node 20, npm, pm2 en global (`npm install -g pm2`), compte admin avec sudo

en prod le projet est dans /var/www/eventhub

nodejs, nginx, git installé avec apt install

connexion ssh avec : ssh root@31.97.177.104 ou admin@31.97.177.104

en dev :

a lancer dans des term séparer

```bash
cd front
npm run dev
```

```bash
cd back
npm run dev
```

## 3. Installation pas à pas

### 3.1 Préparation du serveur

projet clonné avec :

```bash
git clone https://github.com/raphaelhgit/EventHub.git 
```

user admin crée avec meme mdp que root
droit sudo ajouter avec : usermod -aG sudo admin

### 3.2 Installation des dépendances

sur le serv une fois le repo cloné :

```bash
cd /var/www/eventhub/back
npm ci --include=dev
npm run build
```

```bash
cd /var/www/eventhub/front
npm ci --include=dev
npm run build
```

fichier .env a creer dans back/ a partir de .env.example (JWT_SECRET, FRONTEND_URL=https://itzthomthom.fr, NODE_ENV=production)

### 3.3 Configuration de la base de données

sqlite, pas mysql/postgres (plus simple pour le projet). le fichier est dans back/data/eventhub.db, il se cree tout seul au premier lancement

les données de demo (users + events) sont seed au demarrage du back via seed.ts

test dispo : curl https://itzthomthom.fr/api/test-db

### 3.4 Configuration de l'application

en prod : 

```bash
cd /var/www/eventhub/front
sudo systemctl start nginx
```

```bash
cd /var/www/eventhub/back
pm2 start dist/index.js --name eventhub-api 
```

pm2 status pour voir si ça le back tourne

### 3.5 Configuration de Nginx

config dans /etc/nginx/conf.d/eventhub.conf (pas sites-enabled sur notre install nginx.org)

nginx : https://nginx.org/en/docs/beginners_guide.html

pour si ça marche bien :
```bash
curl -I http://localhost
curl http://localhost/health
curl http://localhost/api/health
```

### 3.6 Configuration SSL

nom de domaine acheter sur ionos (c'est pas ouf btw, je recommande pas)

certif ssl avec certbot (lest encrypt)
installer avec pip

```bash
sudo certbot --nginx -d itzthomthom.fr -d www.itzthomthom.fr
```

DNS ionos : enregistrement A @ et www vers 31.97.177.104

### 3.7 Sécurisation

firewall configurer a l'aide de ufw, site utiliser : https://www.it-connect.fr/configurer-un-pare-feu-local-sous-debian-11-avec-ufw/

port 22 (ssh), 80 et 443 autorisé 

sudo ufw status

```bash
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere                  
80/tcp                     ALLOW       Anywhere                  
443/tcp                    ALLOW       Anywhere                  
22/tcp (v6)                ALLOW       Anywhere (v6)             
80/tcp (v6)                ALLOW       Anywhere (v6)             
443/tcp (v6)               ALLOW       Anywhere (v6)     
```

## 4. CI/CD

le CI/CD est fait avec github actions, il y a un runner sur le serv pour que ça marche 
a chaque push le server se met a jour, avec tous les test avant et apres

```bash
cd /var/www/eventhub/actions-runner
sudo ./svc.sh start
```

vitest pour ce projet est plus adapté que jest car il n'est pas bien suporté avec vite
https://jestjs.io/fr/docs/getting-started#utilisation-de-vite

j'utilise donc Vitest a la place

fichier workflow : .github/workflows/main.yml
script deploy sur le serv : scripts/deploy.sh

le deploy ssh direct depuis github marchait pas (timeout), du coup runner self-hosted dans /var/www/eventhub/actions-runner

## 5. Maintenance

### 5.1 Mise à jour de l'application

normalement rien a faire a la main : push sur main sur github et le runner deploy tout seul

sinon en manuel :

```bash
cd /var/www/eventhub
bash scripts/deploy.sh
```

### 5.2 Monitoring

liste des test : 

le reboot marche bien, tout se relance correctement : le back avec pm2, le front avec nginx et le CI/CD avec le runner github 

curl -I https://itzthomthom.fr/ : 
```bash
HTTP/1.1 200 OK
Server: nginx/1.31.2
Date: Wed, 24 Jun 2026 09:15:27 GMT
Content-Type: text/html
Content-Length: 537
Last-Modified: Wed, 24 Jun 2026 08:52:32 GMT
Connection: keep-alive
ETag: "6a3b9ad0-219"
Accept-Ranges: bytes
```
curl https://itzthomthom.fr/ :

```bash
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>react</title>
    <script type="module" crossorigin src="/assets/index-Cmr1LL1E.js"></script>
    <link rel="modulepreload" crossorigin href="/assets/jsx-runtime-Dt24AjeN.js">
    <link rel="stylesheet" crossorigin href="/assets/index-BRHAu58I.css">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```
curl  https://itzthomthom.fr/api/test-db :
```bash
{"status":"ok","database":"connected","result":{"ok":1}}
```
curl  https://itzthomthom.fr/api/health :
```bash
{"status":"ok","timestamp":"2026-06-24T09:21:07.575Z"}
```

### 5.3 Logs

pm2 logs
```bash
[TAILING] Tailing last 15 lines for [all] processes (change the value with --lines option)
/home/admin/.pm2/pm2.log last 15 lines:
PM2        | 2026-06-24T09:07:45: PM2 log: Node.js version      : 20.19.2
PM2        | 2026-06-24T09:07:45: PM2 log: Current arch         : x64
PM2        | 2026-06-24T09:07:45: PM2 log: PM2 home             : /home/admin/.pm2
PM2        | 2026-06-24T09:07:45: PM2 log: PM2 PID file         : /home/admin/.pm2/pm2.pid
PM2        | 2026-06-24T09:07:45: PM2 log: RPC socket file      : /home/admin/.pm2/rpc.sock
PM2        | 2026-06-24T09:07:45: PM2 log: BUS socket file      : /home/admin/.pm2/pub.sock
PM2        | 2026-06-24T09:07:45: PM2 log: Application log path : /home/admin/.pm2/logs
PM2        | 2026-06-24T09:07:45: PM2 log: Worker Interval      : 30000
PM2        | 2026-06-24T09:07:45: PM2 log: Process dump file    : /home/admin/.pm2/dump.pm2
PM2        | 2026-06-24T09:07:45: PM2 log: Concurrent actions   : 2
PM2        | 2026-06-24T09:07:45: PM2 log: SIGTERM timeout      : 1600
PM2        | 2026-06-24T09:07:45: PM2 log: Runtime Binary       : /usr/bin/node
PM2        | 2026-06-24T09:07:45: PM2 log: ===============================================================================
PM2        | 2026-06-24T09:07:45: PM2 log: App [eventhub-api:0] starting in -fork mode-
PM2        | 2026-06-24T09:07:45: PM2 log: App [eventhub-api:0] online

/home/admin/.pm2/logs/eventhub-api-error.log last 15 lines:
/home/admin/.pm2/logs/eventhub-api-out.log last 15 lines:
0|eventhub |   User already exists: admin@example.com
0|eventhub |   Event already exists: Concert Jazz au Sunset
0|eventhub |   Event already exists: Conference Tech Leaders
0|eventhub |   Event already exists: Festival Electro Summer
0|eventhub |   Event already exists: Match de Gala
0|eventhub |   Event already exists: Hamlet - Comedie Francaise
0|eventhub |   Event already exists: Soiree Stand-up Parisienne
0|eventhub |   Event already exists: Hackathon Green Tech
0|eventhub |   Event already exists: Expo Art Contemporain
0|eventhub |   Event already exists: Concert Hip-Hop Lyon
0|eventhub |   Event already exists: Marathon de Toulouse
0|eventhub | Demo data seeded successfully.
0|eventhub | EventHub API running on http://localhost:3000
0|eventhub | Environment: development
0|eventhub | Frontend URL: https://itzthomthom.fr
```

sudo tail -n 20 /var/log/nginx/access.log

```bash
5.134.103.30 - - [24/Jun/2026:08:48:10 +0000] "GET /test-db HTTP/1.1" 404 53 "-" "curl/8.5.0" "-"
5.134.103.30 - - [24/Jun/2026:08:51:57 +0000] "GET /api/test-db HTTP/1.1" 404 53 "-" "curl/8.5.0" "-"
31.97.177.104 - - [24/Jun/2026:08:52:42 +0000] "GET /api/health HTTP/1.1" 200 54 "-" "curl/8.14.1" "-"
5.134.103.30 - - [24/Jun/2026:08:56:10 +0000] "GET /api/test-db HTTP/1.1" 200 56 "-" "curl/8.5.0" "-"
51.159.23.43 - - [24/Jun/2026:09:05:14 +0000] "GET / HTTP/1.1" 200 537 "-" "-" "-"
5.134.103.30 - - [24/Jun/2026:09:09:01 +0000] "GET / HTTP/1.1" 200 537 "-" "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:151.0) Gecko/20100101 Firefox/151.0" "-"
5.134.103.30 - - [24/Jun/2026:09:09:02 +0000] "GET /assets/jsx-runtime-Dt24AjeN.js HTTP/1.1" 200 8575 "https://itzthomthom.fr/" "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:151.0) Gecko/20100101 Firefox/151.0" "-"
5.134.103.30 - - [24/Jun/2026:09:09:02 +0000] "GET /assets/index-Cmr1LL1E.js HTTP/1.1" 200 237948 "https://itzthomthom.fr/" "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:151.0) Gecko/20100101 Firefox/151.0" "-"
5.134.103.30 - - [24/Jun/2026:09:09:02 +0000] "GET /assets/index-BRHAu58I.css HTTP/1.1" 200 10369 "https://itzthomthom.fr/" "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:151.0) Gecko/20100101 Firefox/151.0" "-"
5.134.103.30 - - [24/Jun/2026:09:09:02 +0000] "GET /favicon.svg HTTP/1.1" 200 9522 "https://itzthomthom.fr/" "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:151.0) Gecko/20100101 Firefox/151.0" "-"
5.134.103.30 - - [24/Jun/2026:09:09:02 +0000] "GET /events?upcoming=true HTTP/1.1" 200 2990 "https://itzthomthom.fr/" "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:151.0) Gecko/20100101 Firefox/151.0" "-"
5.134.103.30 - - [24/Jun/2026:09:09:02 +0000] "GET /auth/me HTTP/1.1" 304 0 "https://itzthomthom.fr/" "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:151.0) Gecko/20100101 Firefox/151.0" "-"
5.134.103.30 - - [24/Jun/2026:09:09:02 +0000] "GET /events?upcoming=true HTTP/1.1" 304 0 "https://itzthomthom.fr/" "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:151.0) Gecko/20100101 Firefox/151.0" "-"
5.134.103.30 - - [24/Jun/2026:09:09:08 +0000] "GET /api/test-db HTTP/1.1" 200 56 "-" "curl/8.5.0" "-"
5.134.103.30 - - [24/Jun/2026:09:09:13 +0000] "GET /api/health HTTP/1.1" 200 54 "-" "curl/8.5.0" "-"
172.235.216.39 - - [24/Jun/2026:09:15:27 +0000] "GET /wp-login.php HTTP/1.1" 200 537 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/129.0.0.0 Safari/537.36" "-"
5.134.103.30 - - [24/Jun/2026:09:15:27 +0000] "HEAD / HTTP/1.1" 200 0 "-" "curl/8.5.0" "-"
5.134.103.30 - - [24/Jun/2026:09:15:47 +0000] "GET / HTTP/1.1" 200 537 "-" "curl/8.5.0" "-"
5.134.103.30 - - [24/Jun/2026:09:17:33 +0000] "GET /api/test-db HTTP/1.1" 200 56 "-" "curl/8.5.0" "-"
5.134.103.30 - - [24/Jun/2026:09:21:07 +0000] "GET /api/health HTTP/1.1" 200 54 "-" "curl/8.5.0" "-"
```

### 5.4 Backup et restauration

la bdd c'est juste un fichier sqlite, pour backup :

```bash
cp /var/www/eventhub/back/data/eventhub.db ~/backup-eventhub-$(date +%F).db
```

pas de cron mis en place pour l'instant mais faisable facilement

### 5.5 Rollback

revenir au commit d'avant sur le serv :

```bash
cd /var/www/eventhub
git log --oneline -5
git reset --hard COMMIT_ID
bash scripts/deploy.sh
```

## 6. Problèmes rencontrés

[Liste et solutions]

- nginx servait la page par defaut : la config etait dans sites-enabled mais nginx.org lit conf.d/ → fix : mettre eventhub.conf dans /etc/nginx/conf.d/
- deploy github ssh timeout : le reseau du serv bloque les ip github → fix : runner self-hosted
- git pull bloqué par back/dist/ commité par erreur → fix : dist/ dans gitignore + git reset --hard dans deploy.sh
- sudo demandait mdp pendant le deploy → fix : ligne NOPASSWD en bas du visudo pour nginx et systemctl
- /api/test-db 404 : route pas encore deploy → fix : ajout route test-db + push
- smoke test 502 apres pm2 restart : back pas encore pret → fix : sleep + retry dans le workflow

## 7. Ressources consultées

[Liens et références]

https://nginx.org/en/docs/beginners_guide.html
https://www.it-connect.fr/configurer-un-pare-feu-local-sous-debian-11-avec-ufw/
https://jestjs.io/fr/docs/getting-started#utilisation-de-vite
https://docs.github.com/en/actions/hosting-your-own-runners
https://pm2.keymetrics.io/docs/usage/quick-start/
https://certbot.eff.org/
