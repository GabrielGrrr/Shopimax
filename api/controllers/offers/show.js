module.exports = {


  friendlyName: 'Affiche les offres pour un produit.',


  description: 'Affiche les différentes offres de différents vendeurs pour un même produit.',


  inputs: {
    productId: {
      type: "string",
      description: "L'id du produit dont on veut consulter l'ensemble des offres."
    }

  },


  exits: {
    success: {
      statusCode: 200,
      description:
        "RAS",
      viewTemplatePath: "pages/offers/show"
    },

    redirect: {
      responseType: "redirect",
      description:
        "Impossible d'ajouter le produit désiré au panier."
    }
  },


  fn: async function (inputs, exits) {
    if (typeof inputs.productId === 'undefined')
      throw { redirect: "/" }

    var product = await Product.findOne({ where: { id: inputs.productId } })
      .populate('offers', {
        sort: [{ sentByShopimax: 'DESC' }, { price: 'ASC' }]
      });

    if (typeof product === 'undefined')
      throw { redirect: "/" }

    if (typeof product.offers !== undefined)
      for (let i = 0; i < product.offers.length; i++) {
        product.offers[i].seller = await Seller.find({
          where: { id: product.offers[i].seller },
        });
      }
    else throw { redirect: "/" }

    return exits.success({ product: product });

  }


};
