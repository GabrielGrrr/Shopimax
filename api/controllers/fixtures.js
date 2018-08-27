module.exports = {
  friendlyName: "Fixtures",

  description: "FR : Générateur de données de test pour l'application.",
  extendedDescription: "FR : Générateur de données de test pour l'application." +
    "EN : Test fixtures generator. Does not set any fake order for now, I have no use for it.",

  inputs: {},

  exits: {
    invalid: {
      responseType: "badRequest",
      description: "La fixture ne fonctionne pas.",
      extendedDescription:
        " Avez-vous bien installé le module faker ? npm install faker et c'est réglé ! ;)" +
        "Assurez-vous d'avoir bien défini un adapter approprié à votre SGBD. Sinon, allez jeter un oeil dans controllers/fixtures.js."
    }
  },

  fn: async function (inputs, exits) {

    var countries = await sails.helpers.getenum("countries");
    var statuses = await sails.helpers.getenum("statuses");
    var sectors = await sails.helpers.getenum("sectors");

    var faker = await require("faker");
    var nbUsers = 200;
    var nbSellers = 100;
    var nbProducts = 500;
    var nbAvgComments = 10;
    var nbAvgSellerReview = 10;
    var nbAvgOffers = 6;
    var nbImageMax = 6;
    var nbDetailsMax = 15;

    // On bouclera là-dessus pour ajouter plus de diversité graphique. Varier les tailles fait aussi varier les images selon le fournisseur, 
    // et loremflickr accepte un ?random={id} pour contourner la mise en cache du navigateur.
    var imageSuppliers = [
      "https://loremflickr.com/",
      "http://placekitten.com/",
      "https://picsum.photos/"
    ];

    sails.log(
      "On entame les fixtures, avec un nombre d'utilisateurs de " +
      nbUsers +
      ", de vendeurs de " + nbSellers +
      ", un nombre de produits de " +
      nbProducts +
      ", un nombre de commentaires moyens de " +
      nbAvgComments +
      ", un nombre de notations vendeurs moyens de " +
      nbAvgSellerReview + ", " +
      nbImageMax + " images maximum par produit et " +
      nbDetailsMax + " éléments dans les spécifications techniques, au maximum, par produit. Ces données sont paramétrables dans fixtures.js."
    );

    var addresses = [];
    var address;
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


    var buyers = [];
    var buyer; var name;
    // ACHETEURS
    sails.log("Generating " + nbUsers + " users ...");
    for (i = 0; i < nbUsers; i++) {
      name = await faker.name.findName();
      buyer = await User.create({
        emailAddress: await name.replace(/\s+/g, '-') + i + "@example.com",
        //On ne hache plus le password pour les fixtures, l'opération est bien trop longue sur de gros effectifs, 
        //et c'est inutile (sauf si on veut se logger avec un des comptes)
        /*password: await sails.helpers.passwords.hashPassword(
          faker.internet.password()
        ),*/
        password: await faker.internet.password(),
        fullName: name,
        tosAcceptedByIp: await faker.internet.ip(),
        address: addresses[i]
      }).fetch();
      buyers.push(buyer.id);
    }


    var sellers = [];
    var seller;
    var SIREN;
    sails.log("Generating " + nbSellers + " sellers ...");
    for (i = 0; i < nbSellers; i++) {
      // SIRET, RCS et NumTVA sont composés du SIREN, on le génère donc en avant pour que les données soient cohérentes, à part ça, rien de compliqué
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
          "Vous disposez d’un délai de 30 jours suivant la date de réception pour retourner un article commandé",
        emailAddress: await faker.internet.email(),
        phoneNumber: await faker.phone.phoneNumber(),
        password: await faker.internet.password(),
        fullName: await faker.name.findName(),
        tosAcceptedByIp: await faker.internet.ip(),
        siegeSocial: addresses[nbUsers + i]
      }).fetch();
      sellers.push(seller.id);
    }



    var sellerRvws = [];
    var sellerRvw;
    // NOTATION VENDEUR - Rien de compliqué ici
    sails.log("Generating " + (nbAvgSellerReview * nbSellers) + " seller reviews ...");
    for (i = 0; i < nbAvgSellerReview * nbSellers; i++) {
      sellerRvw = await SellerReview.create({
        content: await faker.lorem.paragraphs(),
        rating: await Math.floor(((await Math.random()) * 5) + 1),
        seller: sellers[await Math.floor((await Math.random()) * nbSellers)],
        author: buyers[await Math.floor((await Math.random()) * nbUsers)],
      }).fetch();
      sellerRvws.push(sellerRvw.id);
    }

    // CATEGORIES
    sails.log("Generating product categories ...");
    var categories = await sails.helpers.generatecategories();

    var categoryDict = {};
    categories.forEach(category => {
      categoryDict[category] = new Array();
    });

    // VARIATIONS
    sails.log("Generating general products variations ...");
    var variations = await sails.helpers.generatevariations();

    var products = [];
    var product;
    var randBool;
    var randNbDetails;
    var randNbImages;
    var details;
    var pdctImage;
    var pdctImages = [];
    var category;
    // PRODUCTS --- Will complexify this a little bit to add stuff like relevant set of categories / brand / images
    sails.log("Generating " + nbProducts + " products ...");
    for (i = 0; i < nbProducts; i++) {

      // On crée un nombre de specs randomisées, une spec est un couple de mot / phrase en lorem
      randNbDetails = await Math.ceil(await Math.random() * nbDetailsMax) + 1;
      details = "{ ";
      for (x = 0; x < randNbDetails + 1; x++) {
        details += '"' + await faker.lorem.word() + '" : "' + await faker.lorem.sentence() + '" , ';
      }
      details += " }";

      // On crée un nombre random d'image, de dimensions randomisées, suivant certaines contraintes de taille minimum toutefois.
      randNbImages = await Math.ceil(await Math.random() * nbImageMax) + 1;
      pdctImages = [];
      for (y = 0; y < randNbImages; y++) {
        pdctImage = await ProductImage.create({
          url: imageSuppliers[await Math.floor((await Math.random()) * imageSuppliers.length)] + ""
            + (await Math.floor((await Math.random()) * 200) + 300)
            + "/" + (await Math.floor((await Math.random()) * 200) + 400) + "?random=" + y,
          order: y
        }).fetch();
        await pdctImages.push(pdctImage.id);
      }
      category = categories[await Math.floor((await Math.random()) * categories.length)];

      product = await Product.create({
        name: await faker.commerce.productAdjective() + " " + await faker.commerce.product(),
        brand: await faker.company.companyName(),
        viewCount: await Math.round(Math.random() * 10000),
        saleCount: await Math.round(Math.random() * 1000),
        details: details,
        images: pdctImages,
        categories: [category],
      }).fetch();
      // On garde les ids de produits de côté pour pouvoir créer des offres et notations users qui y correspondent
      await products.push(product.id);
      // On met de côté les couples bidons produits / catégorie, pour pouvoir informer la catégorie qu'elle est en relation avec
      // ces produits
      await categoryDict[category].push(product.id);
    }

    //On ajoute les différents ids de produits aux collections associatives idoines de leurs catégories respectives
    for (catId in categoryDict) {
      await ProductCategory.addToCollection(catId, "products", categoryDict[catId]);
    }


    var pdctComments = []
    var pdctComment;
    // COMMENTS
    sails.log("Generating " + (nbAvgComments * nbProducts) + " comments ...");
    for (i = 0; i < nbAvgComments * nbProducts; i++) {
      pdctComment = await ProductComment.create({
        content: await faker.lorem.paragraphs(),
        rating: await Math.round(((await Math.random()) * 3) + 2),
        product: products[await Math.floor((await Math.random()) * nbProducts)],
        author: buyers[await Math.floor((await Math.random()) * nbUsers)],
      }).fetch();
      pdctComments.push(pdctComment.id);
    }

    var offers = [];
    var offer;
    var sbs;
    // OFFERS
    sails.log("Generating " + (nbAvgOffers * nbProducts) + " offers ...");
    for (i = 0; i < nbAvgComments * nbProducts; i++) {
      sbs = await Math.random() < 0.5 ? true : false;
      offer = await Offer.create({
        type: await Math.random() < 0.5 ? "Neuf" : "Reconditionné",
        price: await Math.round(Math.random() * (Math.random() < 0.5 ? 10000 : (Math.random() < 0.5 ? 200 : 1000)) * 100) / 100,
        deliveryFee: sbs ? 0 : (await Math.round(Math.random() * 1500) / 100),
        remainingStock: Math.floor(Math.random() * 100),
        sentByShopimax: sbs,
        seller: sellers[await Math.floor((await Math.random()) * nbSellers)],
        product: products[await Math.floor((await Math.random()) * nbProducts)]
      }).fetch();
      await offers.push(offer.id);
    }



    var orders = [];
    var order;
    // ORDERS

    return exits.success();
  }
};
