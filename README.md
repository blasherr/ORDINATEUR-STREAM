# 🕵️ Simulation macOS FIB - SIA OS 2025

## Description
Simulation interactive d'un système d'exploitation macOS fictif appartenant au **FIB** (Federal Investigation Bureau) et à la **SIA** (Secure Intelligence Agency).

## 🚀 Déploiement Vercel

### Méthode 1: Via CLI
```bash
npm install -g vercel
cd simulation-macos-fib
vercel
```

### Méthode 2: Via GitHub
1. Push le projet sur GitHub
2. Connectez-vous à [vercel.com](https://vercel.com)
3. Importez le repository
4. Deploy!

### Méthode 3: Drag & Drop
1. Allez sur [vercel.com/new](https://vercel.com/new)
2. Glissez-déposez le dossier `simulation-macos-fib`

## 🎮 Scénario de la Mission

### Objectif
Vous êtes un agent infiltré. Votre mission est de récupérer des fichiers top secret concernant le projet **CHIMERA-X7** (armes chimiques évoluées) et de les transférer au serveur de la **F.A.N.** (Force d'Action Neutralisation).

### Étapes de la Mission

1. **Connexion** - Utilisez le mot de passe: `root`

2. **Collecte d'informations** - Explorez les dossiers sur le bureau:
   - 📁 Communications_Agents
   - 📁 Opérations_Classifiées  
   - 📁 Rapports_Terrain
   
3. **Révéler le dossier secret** - Ouvrez le Terminal et tapez: `reveal`

4. **Exfiltration** - Dans le terminal, tapez: `send CHIMERA_X7.enc 192.168.13.37`

5. **Bypass du pare-feu** - Tapez rapidement les 10 lettres affichées à l'écran

6. **Mission accomplie!** 🏆

## 🚀 Installation

1. Placez votre fichier `FIB-LOGO.png` dans le même dossier (optionnel - un logo de secours est inclus)

2. Ouvrez `index.html` dans un navigateur moderne

## 📁 Structure des fichiers

```
simulation-macos-fib/
├── index.html       # Page principale
├── styles.css       # Styles macOS + effets immersifs
├── script.js        # Logique du jeu + système audio
├── vercel.json      # Configuration Vercel
├── package.json     # Métadonnées du projet
├── FIB-LOGO.svg     # Logo vectoriel de secours
├── FIB-LOGO.png     # (À ajouter) Logo principal
└── README.md        # Ce fichier
```

## 🔊 Effets Sonores (Web Audio API)

Le jeu utilise des sons synthétiques générés en temps réel:
- 🎵 **Boot sound** - Mélodie de démarrage futuriste
- 🖱️ **Click sounds** - Retour audio pour chaque clic
- ⌨️ **Keyboard sounds** - Sons de frappe clavier
- 🚨 **Alert sounds** - Alertes pare-feu
- ✅ **Success sounds** - Mélodies de réussite
- 🌐 **Ambience** - Bruit de serveur subtil en fond

## 🎯 Commandes Terminal

| Commande | Description |
|----------|-------------|
| `help` | Affiche l'aide |
| `ls` | Liste les fichiers |
| `clear` | Efface le terminal |
| `reveal` | Révèle le dossier secret |
| `send [fichier] [ip]` | Envoie un fichier |
| `status` | État de la mission |

## 🔐 Informations Importantes

- **Mot de passe**: `root`
- **IP du serveur F.A.N.**: `192.168.13.37`
- **Fichier à exfiltrer**: `CHIMERA_X7.enc`

## 🎨 Fonctionnalités

- ✅ Écran de boot avec animation + son de démarrage
- ✅ Écran de connexion sécurisé avec feedback audio
- ✅ Bureau macOS style avec fond bleu FIB
- ✅ Effets CRT (scanlines, vignette, flicker)
- ✅ Fenêtres draggables (glisser-déposer)
- ✅ Fenêtres de dossiers interactives
- ✅ Visionneuse de documents classifiés
- ✅ Terminal fonctionnel avec sons
- ✅ Mini-jeu de bypass (10 touches) avec feedback sonore
- ✅ Animation de hack glitch
- ✅ Ambiance sonore de serveur
- ✅ Écran de mission accomplie avec mélodie de victoire
- ✅ Optimisé pour Vercel

## 📝 Personnalisation

Pour personnaliser le logo FIB, remplacez `FIB-LOGO.png` par votre propre image.

Bonne mission, Agent! 🕵️‍♂️
