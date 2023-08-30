<h1 align="center">
  Backmapper
  <br>
</h1>

Backmapper est une application hybride melant cartographie et blog de voyage. Elle permet de situer les étapes d'un voyage sur la carte du monde et d'y associer ses souvenirs et photos.

Ce repo concerne la partie Backend de l'application.
Ce projet a été réalisé avec NestJS.

## Comment l'utiliser

Pour cloner et lancer cette application vous aurez besoin de [Git](https://git-scm.com) et [Node.js](https://nodejs.org/en/download/)

Depuis votre ligne de commande :

```bash
# Clonez ce repository
$ git clone https://github.com/Jean-Paul-Groove/backmapper-back

# Rendez vous dans le nouveau dossier
$ cd backmapper-back

# Installez les dépendances
$ npm install
```

Vous devrez ensuite initialiser une base de donnée MySQL.

Il vous faudra enfin créer un fichier ".env" en suivant le modèle fourni dans ".env.template" et le remplir.

Enfin vous pouvez lancer l'application depuis votre CLI:

```bash
$ npm start
```

## Credits

Backmapper utilise notamment les dépendances suivantes:

- [NestJS](https://nestjs.com/)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js#readme)
- [Sharp](https://sharp.pixelplumbing.com/)
- [TypeORM](https://typeorm.io/)
