# Blackjack Game

Un jeu de Blackjack interactif développé avec SvelteKit, Prisma et Java, jouable en local.


## 📋 Description

Ce projet est une implémentation complète du jeu de cartes Blackjack avec une interface utilisateur moderne et réactive. Le jeu offre une expérience immersive avec des animations de cartes, des effets sonores et un système de profil joueur.

## ✨ Fonctionnalités

- Interface utilisateur interactive et réactive
- Authentification des utilisateurs (inscription, connexion, mode invité)
- Animations de cartes et effets sonores
- Suivi des statistiques de jeu
- Profils personnalisables
- Mode plein écran
- Règles du jeu intégrées

## 🛠️ Technologies utilisées

- **Frontend**: SvelteKit
- **Backend**: SvelteKit (API routes)
- **Base de données**: Prisma ORM
- **Authentification**: JWT
- **Backend additionnel**: Java

## 📦 Prérequis

- Node.js (v14 ou supérieur)
- npm ou pnpm
- Base de données compatible avec Prisma (PostgreSQL recommandé)
- Java Runtime Environment (pour les composants backend Java)

## 🚀 Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/zharrow/BlackJack
   cd Blackjack
   ```

2. **Configurer l'environnement**
   Créez un fichier `.env` à la racine du projet avec les variables suivantes:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/blackjack"
   JWT_SECRET="votre_secret_jwt_tres_securise"
   ```

3. **Installer les dépendances**
   ```bash
   npm install
   ```

4. **Initialiser la base de données**
   ```bash
   npx prisma init
   npx prisma migrate dev --name init
   ```

5. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

6. **Accéder à l'application**
   Ouvrez votre navigateur et accédez à `http://localhost:5173`

## 📘 Structure du projet

Le projet suit une architecture modulaire avec une séparation claire des préoccupations:

- `/src/lib/components`: Composants d'interface utilisateur réutilisables
- `/src/lib/services`: Services pour la logique métier
- `/src/lib/stores`: Gestion de l'état avec les stores Svelte
- `/src/lib/utils`: Fonctions utilitaires
- `/src/routes`: Pages et points d'API de l'application

## 🎮 Comment jouer

1. Créez un compte ou connectez-vous en tant qu'invité
2. Accédez à la page de jeu
3. Placez votre mise
4. Jouez selon les règles standard du Blackjack:
   - Essayez d'obtenir une main qui se rapproche de 21 sans dépasser
   - Les cartes numérotées valent leur valeur faciale
   - Les figures (Valet, Dame, Roi) valent 10 points
   - Les As valent 1 ou 11 points (au choix du joueur)



## 👥 Contributeurs

- BOTROS John
- DETRES Florent


