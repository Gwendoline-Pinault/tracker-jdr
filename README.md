# Tracker JDR
Ce projet personnel consiste à suivre mes campagnes de jeux de rôle et d'en établir les statistiques.

## Sommaire
- [Description](#description)
- [Historique](#historique)
- [Version 1](#première-version---012024)
- [Version 2](#deuxième-version---septembre-2024)
- [Modification 3](#troisième-modification---février-2026)
- [Modification 4](#quatrième-modification---mai-2026)
- [Stack](#stack)
- [Déploiement](#déploiement)
- [Contributions](#contributions)

## Description
Ce site permet de calculer les statistiques des parties de jeux de rôle sur des systèmes de dés différents (dé 20 / dé 100). Chaque campagne affiche la liste des parties et des statistiques précises de chaque personnage. Une page détail permet de consulter plus d'informations sur un personnage en particulier.

## Historique

Ce projet a été construit progressivement. 

### Première version - 01/2024
Initialement, j'ai développé un programme Python pour calculer la moyenne et le nombre d'échecs critiques et de réussites critiques d'une partie. Le programme sauvegardait dans un fichier JSON chaque partie. Le premier JDR concerné était Aria.

Comme les joueurs ont eu envie de pouvoir consulter les statistiques directement, j'ai modifié le programme pour ajouter une visualisation web que j'ai déployé pour le partage. Cette version était encore complètement manuelle de mon côté pour les modifications.

Cette première version était codée uniquement avec Python pour le programme et du JavaScript/CSS/HTML pour l'affichage de la page web.

### Deuxième version - septembre 2024

J'ai remanié le programme initial pour le passer sous Node.js avec des pages générées avec EJS. EJS m'a permis de générer une structure globale qui s'adapte aux données du JDR concerné (templating). J'ai ajouté également suite aux retours des joueurs, une page détail pour chaque personnage avec des statistiques plus complètes.

La saisie des dés des parties passaient alors par un fichier Python où je notais la liste dans un tableau puis lançait le programme pour calculer les nouvelles statistiques.

### Troisième modification - février 2026

J'ai dû ajouter un nouveau JDR et j'en ai profité pour développer une interface pour me permettre de saisir les parties directement depuis le site. Le fichier de saisie directe a disparu et j'ai géré la modification du JSON suite à la soumission du formulaire.

Avec cette version, je peux saisir directement la partie depuis le site grâce à mon authentification.

### Quatrième modification - mai 2026
Suite à la création d'un nouveau JDR, j'ai ajouté la création de campagne aux fonctionnalités accessibles par l'administrateur.

J'ai également fait une refonte du style pour être responsive (mobile/tablette/bureau).


## Stack
Le serveur a été fait avec Express - Node.js. J'utilise également Python pour générer les histogrammes. Les données sont stockées au format JSON.

Le style a été réalisé avec des feuilles de style CSS. La structure des pages du site est affichée grâce à EJS (templating) afin d'avoir une seule base répétable pour chaque JDR.

Le site suit une architecture MVC (Model - View - Controller) afin de séparer les éléments.

## Déploiement
Le site est déployé avec Vercel.

## Contributions

Site réalisé par :

- Gwendoline PINAULT (@Gwendoline-Pinault), développeuse web full stack