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

  // FR : Puisque sails a désormais supprimé les méthodes d'instance (méthodes accessibles sur l'instance d'un modèle et non sa classe), et ne permet
  // aucun moyen pour implémenter des champs calculés (qui résultent d'opérations simple sur d'autres champs, comme le count d'éléments enfants),
  // on doit itérer sur la table produit et ajouter manuellement les notes users moyennes, nb de commentaires par produits, nb de commentaires
  // par produit et par note, date de livraison estimée etc etc.
  // Aussi, comme Sails ne supporte ni les nested records (jointures / populate multiples, soit accès sur table à plus d'1 pas de distance relationnel),
  // ni les requêtes profondes, l'algorithme d'accès aux données est plus complexe que ce que j'aurais apprécié.
  // Il faudrait contourner le système en utilisant d'autres modules, mais out of scope (autant dev une autre appli bidon avec les outils idoines).
  fn: async function (inputs, exits) {
    var resultsPerPage = 30;
    var index = (typeof inputs.index == 'undefined') ? 1 : inputs.index;
    var root = await ProductCategory.findOne({ where: { rank: 0 } })
      .populate('children').populate('parent');

    // On pourrait également récupérer l'ensemble de l'arbre des catégories, plutôt que de faire un find en boucle, il n'est pas bien lourd
    if (typeof inputs.categoryId !== 'undefined' && inputs.categoryId !== root.id) {
      var categoryId = inputs.categoryId;
      var categoriesIds = [categoryId];
      var category = await ProductCategory.findOne({ where: { id: categoryId } })
        .populate('children')
        .populate('parent');

      if (typeof category.children !== 'undefined') {
        async function getChildrenIds(catObj) {
          if (typeof catObj.children !== 'undefined') {
            for (let i = 0; i < catObj.children.length; i++) {
              let child = await ProductCategory.findOne({ where: { id: catObj.children[i].id } }).populate('children');
              await categoriesIds.push(child.id);
              await getChildrenIds(child);
            }
          }
        }
        await getChildrenIds(category);
      }
      var nbResults = await Product.count({ category: categoriesIds });

    }
    else {
      var category = root;
      var categoryId = category.id;
      nbResults = await Product.count();
    }

    products = await Product.find(
      typeof categoriesIds !== 'undefined'
        ? { category: categoriesIds } : {}
    ).limit(resultsPerPage)
      .skip((index - 1) * resultsPerPage)
      .sort('saleCount DESC')
      .populate('offers', {
        limit: 1,
        sort: [{ sentByShopimax: 'DESC' }, { price: 'ASC' }]
      }).populate('images', {
        limit: 1,
        sort: 'order ASC'
      }).populate('comments')
      .populate('brand');

    // FR : Puisque sails a désormais supprimé les méthodes d'instance (méthodes accessibles sur l'instance d'un modèle avec this en paramètre et non sa classe),
    // On parcours l'ensemble des données récupérées pour calculer la note moyenne et le compteur de notes
    // EN : Since sails erased instance methods and does not provide any way to get computed fields, we loop through our (limited) products records, 
    // and for each entry, manually add computed ratings, comment count, estimated delivery date and such
    // It would be more efficient to add those datas to the DB and refresh them on relevant update / create / delete, just sayin'
    products.forEach(async (product, next) => {
      product.commentCount = product.comments.length;
      if (product.commentCount) {
        let sum = 0;
        for (let i = 0; i < product.commentCount; i++)
          sum += product.comments[i].rating;
        product.ratingAvg = await Math.round((sum / product.commentCount) * 10) / 10;
      }
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
