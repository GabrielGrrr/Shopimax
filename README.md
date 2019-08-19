Shopimax

EN : A fake e-commerce website, written with Node JS and the Sails framework

FR : Un site d'e-commerce factice, écrit avec Node et le framework Sails en javascript

Sails version : 1.0.2
Features :

EN : Listing, viewing and adding products to basket. Nested categories. Account management and CRUD access on user account. User sessions. Session-stored basket. Different sellers per products.

FR : Affichage des produits par liste et affichage particulier, recherche par catégories emboîtées, gestion de compte classique et gestion de session utilisateur. Panier d'achat stocké en session. Affichage de différents vendeurs par produits.
INSTALLATION EN FRANÇAIS

FR : Procédure d'installation :

    Installez NodeJS et NPM, si ce n'est déjà fait

    Installez Sails

    Maintenant, copiez Shopimax en faisant :

    git clone https://github.com/GabrielPoint/Shopimax.git

    Configurer la base de donnée : Le fichier de configuration de la BDD se situe dans config/datastore.js Sous "default", ajoutez :

adapter: "sails-mongo",
url: "mongodb://localhost:27017/shopimax"

Pour MongoDB, OU
adapter: 'sails-mysql',
url: 'mysql://user:password@host:port/database'

Pour MySQL

    Pour lancer l'application, faites un

    sails lift

    Pour générer des fixtures, allez à l'URL: http://localhost:1337/fixtures

    L'application est visitable sur http://localhost:1337
