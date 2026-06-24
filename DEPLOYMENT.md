https://itzthomthom.fr/

firewall configurer a l'aide du site https://www.it-connect.fr/configurer-un-pare-feu-local-sous-debian-11-avec-ufw/

port 22 (ssh), 80 et 443 autorisé

connexion ssh avec : ssh root@31.97.177.104 ou admin@31.97.177.104

nodejs, nginx, git installé avec apt install

projet clonné avec :

```bash
git clone https://github.com/raphaelhgit/EventHub.git 
```

user admin crée avec mdp uT#a9qQy@nAfNJsH
droit sudo ajouter avec : usermod -aG sudo admin

pm2 status pour voir si ça le back tourne

nginx : https://nginx.org/en/docs/beginners_guide.html

pour si ça marche bien :
```bash
curl -I http://localhost
curl http://localhost/health
curl http://localhost/api/health
```

certif ssl avec certbot (lest encrypt)
installer avec pip


le CI/CD est fait avec github actions, il y a un runner sur le serv pour que ça marche 
a chaque push le server se met a jour, avec tous les test avant et apres


vitest pour ce projet est plus adapté que jest car il n'est pas bien suporté avec vite
https://jestjs.io/fr/docs/getting-started#utilisation-de-vite

j'utilise donc Vitest a la place