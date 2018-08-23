module.exports = {
  friendlyName: "Fixtures",

  description: "Fixtures something.",

  inputs: {},

  exits: {
    invalid: {
      responseType: "badRequest",
      description: "La fixture ne fonctionne pas.",
      extendedDescription:
        " Avez-vous bien installé le module faker ? npm install faker et c'est réglé ! ;) Assurez-vous d'avoir bien défini un adapter approprié à votre SGBD. Sinon, allez jeter un oeil dans controllers/fixtures.js."
    }
  },

  fn: async function (inputs, exits) {
    var countries = await sails.helpers.countrylist();
    var statuses = [
      "S.A.",
      "S.A.S.",
      "S.A.S.U.",
      "S.A.R.L.",
      "E.U.R.L.",
      "S.C.",
      "S.C.I.",
      "S.N.C.",
      "auto/micro-entreprise",
      "E.I.R.L.",
      "Association"
    ];
    var sectors = [
      "Agriculture",
      "Mode, industrie textile",
      "Industrie alimentaire",
      "Chimie, pharmacie",
      "Audiovisuel - Spectacle",
      "Social",
      "Énergie",
      "Construction aéronautique, ferroviaire et navale",
      "Banque, assurance",
      "Maintenance, entretien",
      "Fonction publique",
      "Edition, Journalisme",
      "Armée, sécurité",
      "Recherche",
      "Informatique et télécoms",
      "Commerce, distribution",
      "Audit, gestion",
      "Sport, loisirs – Tourisme",
      "Enseignement",
      "Culture - Artisanat d'art",
      "Électronique",
      "Mécanique",
      "Hôtellerie, restauration",
      "Logistique, transport",
      "Art, Design",
      "Santé",
      "Traduction - interprétariat",
      "Communication - Marketing - Pub",
      "Automobile",
      "BTP, architecture",
      "Environnement",
      "Droit, justice",
      " Verre, béton, céramique"
    ];

    var faker = await require("faker");
    var nbUsers = 50;
    var nbSellers = 100;
    var nbProducts = 1000;
    var nbAvgComment = 25;
    var nbAvgSellerReview = 10;

    sails.log(
      "On entame les fixtures, avec un nombre d'utilisateurs de " +
      nbUsers +
      ", un nombre de produits de " +
      nbProducts +
      ", un nombre de commentaires moyens de " +
      nbAvgComment
    );
    var addresses = [];
    var address;

    var buyers = [];
    var buyer;

    var sellers = [];
    var seller;

    var sellerRvws = [];
    var sellerRvw;

    var products = [];
    var product;

    var pdctCategories = [];
    var pdctCategorie;

    var catValues = [];
    var catValue;

    var pdctVariations = [];
    var pdctVariation;

    var varValues = [];
    var varValue;

    var pdctImages = [];
    var pdctImages;

    var pdctComments = []
    var pdctComment;

    var offers = [];
    var offer;

    var orders = [];
    var order;

    // ADRESSES, on en génère autant que d'acheteurs et de vendeurs. Techniquement il est possible, et relativement simple, d'incorporer des adresses multiples
    // de facturation et de livraison pour le client, en modifiant la modalité relationnelle (one way vers one to many) et en incorporant des tableaux d'adresses
    sails.log("Generating " + (nbUsers + nbSellers) + " addresses ...");
    for (i = 0; i < nbUsers + nbSellers; i++) {
      address = await Address.create({
        country:
          countries[await Math.floor((await Math.random()) * countries.length)],
        area: await faker.address.state(),
        city: await faker.address.city(),
        address: await faker.address.streetAddress(),
        additionnalAddress: await faker.address.secondaryAddress(),
        postalCode: await faker.address.zipCode(),
        phoneNumber: await faker.phone.phoneNumber()
      }).fetch();
      addresses.push(address.id);
    }

    // ACHETEURS
    sails.log("Generating " + nbUsers + " users ...");
    for (i = 0; i < nbUsers; i++) {
      buyer = await User.create({
        emailAddress: await faker.internet.email(),
        //On ne hache plus le password pour les fixtures, l'opération est bien trop longue sur de gros effectifs, 
        //et c'est inutile (sauf si on veut se logger avec un des comptes)
        /*password: await sails.helpers.passwords.hashPassword(
          faker.internet.password()
        ),*/
        password: await faker.internet.password(),
        fullName: await faker.name.findName(),
        tosAcceptedByIp: await faker.internet.ip(),
        address: addresses[i]
      }).fetch();
      buyers.push(buyer.id);
    }

    // Complètement overkill ici, mais j'ai envie de faire de la validation avancée sur les champs de sellers, et d'un point de vue
    // culture g c'est toujours intéressant de se plonger dans le droit des entreprises. Donc SIREN, SIRET, RCS et co. sont formatés selon
    // les spécifications du droit français. La sending / return policy reste la même, cette propriété est de toute façon passablement inutile mais toujours un plus.
    var SIREN;
    // VENDEURS
    sails.log("Generating " + nbSellers + " sellers ...");
    for (i = 0; i < nbSellers; i++) {
      SIREN = Math.random().toString().slice(2, 11);
      seller = await Seller.create({
        companyName: await faker.company.companyName(),
        statutJuridique: statuses[await Math.floor((await Math.random()) * statuses.length)],
        dateCreation: await faker.date.past(),
        sector: sectors[await Math.floor((await Math.random()) * sectors.length)],
        nbEmployee: await faker.random.number() + 1,
        siren: SIREN,
        siret: SIREN + await Math.random().toString().slice(2, 5),
        rcs: SIREN + " RCS de " + await faker.address.city(),
        numTVA: "FR" + await Math.floor((await Math.random()) * 10) + Math.floor((await Math.random()) * 10)
          + SIREN,
        website: await faker.internet.domainName(),
        sendingPolicy:
          "Sauf indication contraire lors de la commande, tous les articles seront envoyés sous deux jours suivant la réception d'une commande." +
          "Vous recevrez une notification en cas de retard ou d'annulation de votre commande.",
        returnPolicy:
          "Vous disposez d’un délai de 30 jours suivant la date de réception pour retourner un article commandé"
        ,
        emailAddress: await faker.internet.email(),
        phoneNumber: await faker.phone.phoneNumber(),
        password: await faker.internet.password(),
        fullName: await faker.name.findName(),
        tosAcceptedByIp: await faker.internet.ip(),
        siegeSocial: addresses[nbUsers + i]
      }).fetch();
      sellers.push(seller.id);
    }

    // NOTATION VENDEUR
    sails.log("Generating " + (nbAvgSellerReview * nbSellers) + " seller reviews ...");
    for (i = 0; i < nbAvgSellerReview * nbSellers; i++) {
      sellerRvw = await SellerReview.create({
        content: await faker.lorem.paragraphs(),
        rating: await Math.floor((await Math.random()) * 5),
        seller: sellers[await Math.floor((await Math.random()) * nbSellers)],
        author: buyers[await Math.floor((await Math.random()) * nbUsers)],
      }).fetch();
      sellerRvws.push(sellerRvw.id);
    }

    // CATEGORIES
    sails.log("Generating product categories ...");
    pdctCategories = await sails.helpers.generatecategories();


    return exits.success();
  }
};
