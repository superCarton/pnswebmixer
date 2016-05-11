Polytech Web Sequencer
======================

<p><span class="tabulation">Projet regroupant les matières client et server sides. Il s'agit d'une application web musicale sous la forme d'un séquenceur. Il permet à l'utilisateur d'intéragir avec des échantillons, de modifier leur tempo, leur fréquence etc... et d'enregistrer le résultat en ligne. L'ensemble des patterns est disponible pour tous les utilisateurs qui peuvent alors laisser leurs avis et/ou leur attribuer une note.</span></p>


# Installation de Node.js, MongoDB, Grunt & Bower

**Node.js** :
  - Depuis les pacquets Ubuntu:
```
sudo apt-get install nodejs
```
  - Depuis le repository nodesource:
```
sudo apt-get install curl
curl -sL https://deb.nodesource.com/setup_5.x | sudo bash -
sudo apt-get install nodejs
sudo apt-get upgrade
sudo apt-get update
```

**MongoDB** :
  - Depuis les pacquets Ubuntu:
```
sudo apt-get install mongodb
mongod
```

  - Depuis le site officiel:
https://www.mongodb.org/downloads#production
```
wget https://fastdl.mongodb.org/linux/(archive-version)
tar -xvzf (archive-version).jar
./(path to folder)/bin/mongod
```

**Client Grunt** : Install grunt en global.
```
sudo npm install -g grunt-cli
```

**Client Bower** : Install bower en global.
```
sudo npm install -g bower
```

# Server Side

## Installation

**Dépendances Npm**: Install les dépendances nécessaires au projet via le
fichier package.json
```
npm install
```

## Utilisation

**Lancement** du serveur avec **grunt**. Cette commande permet également de relancer
automatiquement le serveur en cas de modification d'un fichier nécessaire à son
fonctionnement.
```
grunt serve
``` 
ou directement via la commande **node**
```
node bin/webMixer.js
```

# Client Side

## Installation

**Dépendances Npm**: Install les dépendances nécessaires au projet via le
fichier package.json
```
sudo npm install
```

**Dépendances Bower**: Install les dépendances nécessaires au projet via le
fichier bower.json
```
bower install
```

## Utilisation

**Lancement du serveur** avec grunt. Cette commande permet également de relancer
automatiquement le serveur en cas de modification d'un fichier nécessaire à son
fonctionnement.
```
grunt serve
``` 

# Membres de l'équipe
**Vincent Montalieu** : vincent.montalieu@etu.unice.fr</br>
**Rémy Dupanloup** : remy.dupanloup@etu.unice.fr</br>
**Quan Sun** : quan.sun@etu.unice.fr</br>
**Romain Guillot** : romain.guillot@etu.unice.fr
