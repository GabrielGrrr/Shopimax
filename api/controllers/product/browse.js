module.exports = {


  friendlyName: 'FR : Affiche les produits par catégories',


  description: 'FR : Affiche les produits contenus dans la BDD en discriminant selon certains critères' +
    'EN : Display products contained in the DB and allows multiple sorting / querying criteria',


  inputs: {
    sortingCriteria: {
      type: "string",
      isIn: ['saleCount', 'price', 'rating'],
      description: "Le critère de tri du résultat."
    },
    category: {
      type: "string",
      description: "L'id de la catégorie de produit que l'on souhaite parcourir."
    },
    index: {
      type: "number",
      description: "L'index de la page que l'on souhaite consulter (de 1 à ∞)"
    }
  },


  exits: {
    success: {
      statusCode: 200,
      description:
        "RAS",
      viewTemplatePath: "pages/product/browse"
    },

    redirect: {
      responseType: "redirect",
      description:
        "Les criètes / catégorie n'existent pas, on renvoie vers une page pertinente."
    }
  },

  // EN : Since sails erased instance methods and does not provide any way to get computed fields (like, wtf ?), we stream through our product table
  // or document, add the results to a dictionary, and for each entry, manually add computed ratings, comment count, estimated delivery date and such
  // It would be more efficient to add those datas to the DB and refresh them on relevant update / create / delete

  // FR : Puisque sails a désormais supprimé les méthodes d'instance (méthodes accessibles sur l'instance d'un modèle et non sa classe), et ne permet
  // aucun moyen pour implémenter des champs calculés (qui résultent d'opérations simple sur d'autres champs, comme le count d'éléments enfants),
  // on doit itérer en streamant la table produit et ajouter manuellement les notes users moyennes, nb de commentaires par produits, nb de commentaires
  // par produit et par note, date de livraison estimée etc etc.

  fn: async function (inputs, exits) {
    var resultsPerPage = 28;
    var sum;
    var products = new Map();
    await Product.stream({
      //where: { name: 'mary' },
      //skip: 20,
      limit: resultsPerPage,
      sort: 'createdAt DESC'
    }).populate('offers', {
      //where: { type: 'Neuf' },
      limit: 1,
      sort: 'price ASC'
    }).populate('images', {
      limit: 1,
      sort: 'order ASC'
    }).populate('comments')

      .eachRecord(async (product, next) => {
        sum = 0;
        product.commentCount = product.comments.length;
        if (product.commentCount) {
          for (var i = 0; i < product.commentCount; i++)
            sum += product.comments[i].rating;
          product.ratingAvg = Math.round((sum / product.commentCount) * 10) / 10;
        }
        products.set(product.id, product);
        return next();
      });

    var nbResults = await Product.count();
    return exits.success({
      products: products, nbResults: nbResults, resultsPerPage: resultsPerPage,
      pageNavigation: {
        firstPage: 1,
        currentPage: inputs.index ? inputs.index : 1,
        lastPage: await Math.ceil(nbResults ? nbResults : 1 / resultsPerPage)
      }
    });
  }
};
