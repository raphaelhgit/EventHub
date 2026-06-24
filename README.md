# EventHub — Frontend

PAS A JOUR, les infos sont dans DEPLOYMENT.md

Application React pour la gestion et l'achat de billets d'événements.

---
tout est dans "eventHub", séparer entre le back et le front
ouai la structure est un peu degeu mais pg

      email: 'organisateur@example.com',
      password: 'password123',
      name: 'Jean Organisateur',
      role: UserRole.ORGANIZER,


      email: 'utilisateur@example.com',
      password: 'password123',
      name: 'Marie Utilisatrice',
      role: UserRole.USER,


      email: 'admin@example.com',
      password: 'password123',
      name: 'Admin EventHub',
      role: UserRole.ADMIN,


## Stack technique

- **React 18** + **TypeScript**
- **Vite** (bundler + dev server)
- **React Router v6** (routing côté client)
- **Tailwind CSS v4** (style)
- **qrcode.react** (génération de QR codes)

---

## Prérequis

- Node.js ≥ 18
- Le backend Express doit tourner sur `http://localhost:3000`

---

## Installation

```bash
cd eventHub/front
npm install
```

---

## Scripts

| Commande | Description |
|---|---|
| `npm run dev` | Démarre le serveur de développement (port 5173) |
| `npm run build` | Compile pour la production dans `dist/` |
| `npm run preview` | Prévisualise le build de production |

---

## Lancer le projet

**Terminal 1 — Backend :**
```bash
cd eventHub/back
npm run dev
```

**Terminal 2 — Frontend :**
```bash
cd eventHub/front
npm run dev
```

Accès : https://itzthomthom.fr/

ssh root@31.97.177.104

---

## Variables d'environnement

Aucune variable d'environnement n'est requise côté frontend. Le proxy Vite redirige automatiquement les appels API vers `http://localhost:3000` (configuré dans `vite.config.ts`).

Routes proxifiées : `/auth`, `/events`, `/organizer`, `/tickets`.

---

## Comptes de test (seeds)

| Rôle | Email | Mot de passe |
|---|---|---|
| Utilisateur | utilisateur@example.com | password123 |
| Organisateur | organisateur@example.com | password123 |
| Admin | admin@example.com | password123 |

---

## Fonctionnalités

### Publiques
- **Accueil** (`/`) : liste des événements à venir avec recherche textuelle (titre, description, ville), filtres (catégorie, ville, prix min/max) et chargement infini (infinite scroll)
- **Détail événement** (`/events/:id`) : informations complètes, achat de billet
- **Inscription** (`/register`) : création de compte utilisateur ou organisateur, validation en temps réel
- **Connexion** (`/login`) : authentification JWT, validation en temps réel

### Utilisateur connecté
- **Mes billets** (`/tickets`) : liste des billets achetés, filtrage par statut (Valide / Utilisé / Annulé), affichage du QR code
- **Mon profil** (`/profile`) : informations personnelles, modification du nom, déconnexion

### Organisateur / Admin
- **Dashboard** (`/organizer/dashboard`) : statistiques (événements créés, billets vendus, chiffre d'affaires)
- **Mes événements** (`/organizer/events`) : liste, modification, suppression
- **Créer un événement** (`/organizer/events/new`) : formulaire complet avec prévisualisation
- **Modifier un événement** (`/organizer/events/:id/edit`) : formulaire pré-rempli

### Sécurité
- Routes protégées par `PrivateRoute` et `OrganizerRoute`
- Déconnexion automatique si le token expire (réponse 401)
- Token JWT stocké en `localStorage`
