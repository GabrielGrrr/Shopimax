module.exports = {
  friendlyName: 'FR : Affiche les produits par catégories',

  description: 'FR : Affiche les produits contenus dans la BDD en discriminant selon certains critères' +
    'EN : Display products contained in the DB and allows multiple sorting / querying criteria',

  inputs: {
    index: {
      type: "number",
      description: "L'index de la page que l'on souhaite consulter (de 1 à ∞)"
    },
    categoryId: {
      type: "string",
      description: "L'id de la catégorie de produit que l'on souhaite parcourir."
    },
    sortingCriteria: {
      type: "string",
      isIn: ['saleCount', 'price', 'rating'],
      description: "Le critère de tri du résultat."
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
  // Et puisque Sails ne supporte ni les nested records (accès sur table à plus d'1 pas de distance relationnel),
  // ni les requêtes profondes, les requêtes construites ici avec le querybuilder natif sont très sales.
  // Il faudrait contourner le système en utilisant d'autres modules, mais out of scope (autant dev une autre appli bidon avec les outils idoines).

  fn: async function (inputs, exits) {
    var resultsPerPage = 28;
    var index = (typeof inputs.index == 'undefined') ? 1 : inputs.index;

    if (typeof inputs.categoryId !== 'undefined') {
      var categoryId = inputs.categoryId;
      var category = await ProductCategory.findOne({ where: { id: categoryId } })
        .populate('children')
        .populate('parent');
      var categoryRank = category.rank;
      var nbResults = await Product.count({ where: { category: categoryId } });
      sails.log("PDCT COUNT : " + nbResults);
    }
    else {
      var category = await ProductCategory.findOne({ where: { rank: 0 } })
        .populate('children').populate('parent');
      var categoryId = category.id;
      var categoryRank = 0;
      var nbResults = await Product.count();
    }

    var parent;
    var products = new Map();
    var productCount = 0;
    // Stream applique une fonction à chaque entrée retournée de la requête. C'est, donc une grosse boucle.
    await Product.stream({
      //where: { name: 'mary' },
      skip: (index - 1) * resultsPerPage,
      sort: 'createdAt DESC'
    }).populate('offers', {
      limit: 1,
      sort: 'price ASC'
    }).populate('images', {
      limit: 1,
      sort: 'order ASC'
    }).populate('comments')
      .populate('category')
      .eachRecord(async (product, next) => {
        if (productCount == resultsPerPage)
          return exits.success({
            products: products,
            nbResults: nbResults,
            resultsPerPage: resultsPerPage,
            category: category,
            pageNavigation: {
              firstPage: 1,
              currentPage: index,
              lastPage: await Math.ceil((typeof nbResults !== 'undefined' ? nbResults : 1) / resultsPerPage),
            }
          })

        product.commentCount = product.comments.length;
        if (product.commentCount) {
          let sum = 0;
          for (let i = 0; i < product.commentCount; i++)
            sum += product.comments[i].rating;
          product.ratingAvg = await Math.round((sum / product.commentCount) * 10) / 10;
        }
        // Pour chaque catégorie à laquelle appartient le produit, on vérifie si elle correspond à la catégorie fournie en paramètre
        // Si c'est le cas, on le persiste dans les résultats

        if (product.category.id == categoryId) {
          await products.set(product.id, product);
          productCount++;
          return next();
        }
        // On cherche aussi une correspondance avec une catégorie parente de la catégorie du produit
        else if (product.category.parent == categoryId) {
          await products.set(product.id, product);
          productCount++;
          return next();
        }
        // Et les parents du parent
        else if (product.category.rank - 1 > categoryRank) {
          parent = await ProductCategory.findOne({ where: { id: product.category.parent } });

          while (parent.rank > categoryRank) {
            if (parent.parent == categoryId) {
              await products.set(product.id, product);
              productCount++;
              return next();
            }
            parent = await ProductCategory.findOne({ where: { id: parent.parent } });
          }
        }
        return next();
      });

    return exits.success({
      products: products,
      nbResults: nbResults,
      resultsPerPage: resultsPerPage,
      category: category,
      pageNavigation: {
        firstPage: 1,
        currentPage: index,
        lastPage: await Math.ceil((typeof nbResults !== 'undefined' ? nbResults : 1) / resultsPerPage),
      }
    });
  }
};
