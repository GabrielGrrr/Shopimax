module.exports = {


  friendlyName: 'FR : Affiche les produits par catégories',


  description: 'FR : Affiche les produits contenus dans la BDD en discriminant selon certains critères' +
    'EN : Display products contained in the DB and allows multiple sorting / querying criteria',


  inputs: {

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


  fn: async function (inputs, exits) {

    var products = await Product.find({
      //where: { name: 'mary' },
      //skip: 20,
      limit: 50,
      sort: 'createdAt DESC'
    }).populate('offers', {
      //where: { type: 'Neuf' },
      limit: 1,
      sort: 'price ASC'
    }).populate('images', {
      limit: 1,
      sort: 'order ASC'
    });
    await sails.log(products[0].offers[0]);

    return exits.success({ products: products });

  }


};
