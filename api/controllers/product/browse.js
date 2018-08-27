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
    var sum;
    var i;
    var parent;
    var products = new Map();
    var index = (typeof inputs.index == 'undefined') ? 1 : inputs.index;

    if (typeof inputs.categoryId !== 'undefined') {
      var category = await ProductCategory.findOne({ where: { id: categoryId } })
        .populate('children')
        .populate('products');
      var categoryRank = category.rank;
      var categoryId = inputs.categoryId;
      var nbResults = category.products.length;
    }
    else {
      var category = await ProductCategory.findOne({ where: { rank: 0 } })
        .populate('children');
      var categoryId = category.id;
      var categoryRank = 0;
      var nbResults = await Product.count();
    }


    // Stream applique une fonction à chaque entrée retournée de la requête. C'est, donc une grosse boucle.
    await Product.stream({
      //where: { name: 'mary' },
      skip: index * resultsPerPage,
      limit: resultsPerPage,
      sort: 'createdAt DESC'
    }).populate('offers', {
      limit: 1,
      sort: 'price ASC'
    }).populate('images', {
      limit: 1,
      sort: 'order ASC'
    }).populate('comments')
      .populate('categories')
      .eachRecord(async (product, next) => {
        sum = 0;
        product.commentCount = product.comments.length;
        if (product.commentCount) {
          for (i = 0; i < product.commentCount; i++)
            sum += product.comments[i].rating;
          product.ratingAvg = await Math.round((sum / product.commentCount) * 10) / 10;
        }

        await products.set(product.id, product);
        sails.log("PRODUCT CATEGORIES : " + product.categories[0].id + " PARENT : " + product.categories[0].parent);
        // Pour chaque catégorie à laquelle appartient le produit, on vérifie si elle correspond à la catégorie fournie en paramètre
        // Si c'est le cas, on le persiste dans les résultats
        for (i = 0; i < product.categories.length; i++) {
          if (product.categories[i].id == categoryId) {
            await products.set(product.id, product);
            break;
          }
          // On cherche aussi une correspondance avec une catégorie parente de la catégorie du produit
          else if (product.categories[i].parent == categoryId) {
            await products.set(product.id, product);
            break;
          }
          // Et les parents du parent
          else if (product.categories[i].rank - 1 > categoryRank) {
            parent = await ProductCategory.find({ where: { id: product.categories[i].parent } }).limit(1); //findOne refuses to take the criteria into account ...
            sails.log("PARENT :" + parent[0] + " RANK : " + parent[0].rank + " PARENTPARENT :" + parent[0].parent
              + " CATID : " + categoryId + " ID PARENT FROM PDCT : " + product.categories[i].parent);
            while (parent[0].rank > categoryRank) {
              sails.log("PARENT :" + parent[0] + " RANK : " + parent[0].rank + " PARENTPARENT :" + parent[0].parent
                + " CATID : " + categoryId + " ID PARENT FROM PDCT : " + product.categories[i].parent);
              if (parent[0].parent == categoryId) {
                await products.set(product.id, product);
                break;
              }
              parent = await ProductCategory.find({ where: { id: parent[0].parent } }).limit(1);
            }
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
