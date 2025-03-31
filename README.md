# Pictevent (fait_tourner)

**Pictevent** est une application de partage d'images entre amis. L'application permet aux utilisateurs de s'inscrire, d'uploader et de partager leurs photos, de consulter celles de leurs amis.

## Fonctionnalités

-   **Authentification :** Connexion sécurisée (ex. via Google OAuth).
-   **Partage de book :** Partager un book avec vos amis via un lien par Email
-   **Partage d'images :** Publier et visualiser des images sur un book.
-   **Suppression du compte :** Chaque utilisateur peut supprimer son compte ainsi que tous les books qu'il a créés.

## Dépendances et Versions

**Node** : 22.11.0

### Frontend (dossier `client`)

-   **React** : 19.0.0
-   **React Router DOM** : 7.3.0
-   **Axios** : 1.8.4
-   **JWT Decode** : 4.0.0
-   **@react-oauth/google** : 0.12.1
-   **Vite** : 6.2.0
-   **TypeScript** : ~5.7.2

### Backend (dossier `server`)

-   **Express** : 4.21.2
-   **Passport & Passport Google OAuth20** : (cf. package.json)
-   **Argon2** : 0.41.1
-   **JSON Web Token (JWT)** : 9.0.2
-   **MySQL2** : 3.13.0
-   **Multer** : 1.4.5-lts.1
-   **Nodemailer** : 6.10.0
-   **UUID** : 11.1.0

_Les versions exactes des dépendances sont indiquées dans les fichiers `package.json` respectifs._

## Schéma de l'Architecture

```plaintext
                        +-----------------+
                        |     Vercel      |
                        | (Frontend: React|
                        |     & Vite)     |
                        +--------+--------+
                                 |
                                 | Appels API (HTTP/HTTPS)
                                 |
                        +--------v--------+
                        |    Railway      |
                        | (Backend: Node/ |
                        |    Express)     |
                        +--------+--------+
                                 |
                                 | Connexion
                                 |
                        +--------v--------+
                        |    Railway      |
                        | (Base de données|
                        |      MySQL)     |
                        +-----------------+
```

## Déploiement

**Frontend**
<br>
Le déploiement est réalisé via Vercel. Il suffit de connecter le dépôt et de configurer le build (commande npm run build dans le dossier client).
<br><br>
**Backend & Base de données**
<br>
Le backend et la base de données MySQL sont déployés sur Railway. Après configuration des variables d'environnement dans Railway, la commande npm run start (dans le dossier server) permet de démarrer le serveur.

## future fonctionnalitées

-   **Suppression :**
    -   Suppression d'une image par son auteur ou par le propriétaire du book.
    -   Suppression d'un book par son auteur.
-   **Interactions :**
    -   Possibilité de commenter et de liker les images partagées.
-   **Fil d'actualité :**
    -   Sur la page principale, visualisation des dernières photos partagées dans les books auxquels nous sommes associés.
