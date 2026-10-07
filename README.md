# 🎓 SchoolDashboard - Tableau de bord de classe (Style ClassroomScreen)

Une application web interactive inspirée de **ClassroomScreen**, développée avec **React**, **Vite** et **Tailwind CSS**. Elle permet d'organiser et d'animer une classe avec des widgets flottants, déplaçables et redimensionnables.

---

## ✨ Fonctionnalités et Widgets

### 🕒 1. Horloge & Date
- Affichage numérique ou analogique (avec aiguilles animées).
- Affichage complet de la date en français (ex : *Lundi 5 Octobre 2026*).
- Option pour masquer ou afficher les secondes.

### ⏱️ 2. Minuteur interactif
- Compte à rebours avec anneau de progression visuel circulaire.
- Boutons rapides d'incrémentation (+1 min, 3 min, 5 min, 10 min, 15 min).
- Signal sonore de carillon (via Web Audio API) à la fin du temps.
- Explosion de confettis festifs à la fin du décompte.

### ✅ 3. Liste de tâches (To-Do List)
- Ajout facile de consignes ou d'étapes de travail.
- Cochage avec effet barré.
- Filtres : *Toutes*, *En cours*, *Faites*.
- Sauvegarde automatique locale (`localStorage`).

### 📝 4. Notes & Post-its
- Choix de couleurs (Jaune pastel, Bleu ciel, Émeraude, Rose, Sombre).
- Bascule entre police manuscrite (*cursive*) et police standard épurée.
- Ajustement de la taille du texte (A- / A+).
- Possibilité d'ouvrir plusieurs notes simultanément.

### 🖼️ 5. Image & Illustration
- Importation d'une image locale (depuis l'ordinateur) par sélection de fichier.
- Ou saisie d'un lien d'image web.
- Bascule du mode d'affichage (*Contenir* ou *Remplir le cadre*).
- Possibilité d'ajouter plusieurs cadres d'images.

### 🎨 6. Barre d'outils & Personnalisation (Dock ClassroomScreen)
- **Barre flottante en bas de l'écran** pour ouvrir/fermer chaque widget en un clic.
- **Sélecteur de fond d'écran :** Tableaux d'école, forêt, montagne, bibliothèque, dégradés ou image personnalisée via URL.
- **Réinitialisation de la disposition :** Replace les widgets de manière ordonnée.
- **Mode Plein écran (Fullscreen) :** Idéal pour projection sur TBI / vidéoprojecteur.

---

## 🚀 Lancement du projet

```bash
# Lancer le serveur de développement
npm run dev

# Compiler pour la production
npm run build
```

---

## 🐳 Déploiement avec Docker & Portainer

### Méthode 1 : Déploiement direct avec Portainer (Recommandé via Git)
1. Poussez le projet sur votre dépôt Git (GitHub, GitLab, Gitea, etc.).
2. Rendez-vous sur votre interface **Portainer**.
3. Allez dans **Stacks** > **Add stack**.
4. Donnez un nom à votre stack (ex: `school-dashboard`).
5. Sélectionnez la méthode **Repository** (Git) :
   - Indiquez l'URL de votre dépôt.
   - Compose path : `docker-compose.yml`.
6. Cliquez sur **Deploy the stack**. Portainer va construire l'image et démarrer le conteneur automatiquement.
7. Accédez à l'application sur `http://<IP-DU-SERVEUR>:8080`.

### Méthode 2 : Déploiement manuel sur le serveur
Copiez les fichiers du projet sur votre serveur Docker puis lancez :
```bash
docker compose up -d --build
```

