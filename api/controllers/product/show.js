module.exports = {
  friendlyName: 'FR : Affiche une page produit.'
    + 'EN : Display a product page',

  description: '',

  inputs: {
    productId: {
      type: "string",
      description: "L'id du produit consulté."
    }
  },

  exits: {
    success: {
      statusCode: 200,
      description:
        "RAS",
      viewTemplatePath: "pages/product/show"
    },

    redirect: {
      responseType: "redirect",
      description:
        "Les criètes / catégorie n'existent pas, on renvoie vers une page pertinente."
    }
  },

  fn: async function (inputs, exits) {
    if (typeof inputs.productId === "undefined") throw { redirect: "/" }

    product = await Product.findOne({
      where: { id: inputs.productId },
    }).populate('offers', {
      //where: { type: 'Neuf' },
      sort: [{ sentByShopimax: 'DESC' }, { price: 'ASC' }],
      limit: 3
    }).populate('images', {
      sort: 'order ASC'
    }).populate('comments')
      .populate('category')
      .populate('brand');

    // On boucle également sur ces entrées (comments et offers) pour les afficher dans la vue, mais pour maintenir la structure MVC, je garde tous les accès database
    // et les transformations d'éléments dans l'action / controller. Ca fait une complexité algorithmique inutilement deux fois plus grande cependant.
    var sum = 0;
    product.commentCount = product.comments.length;
    if (product.commentCount) {
      for (let i = 0; i < product.commentCount; i++) {
        sum += product.comments[i].rating;
        let date = new Date(product.comments[i].createdAt * 1000);
        product.comments[i].date = date.getDate() + '/' + date.getMonth();
      }
      product.ratingAvg = Math.round((sum / product.commentCount) * 10) / 10;
    }

    if (typeof product.offers !== undefined)
      for (let i = 0; i < product.offers.length; i++) {
        product.offers[i].seller = await Seller.find({
          where: { id: product.offers[i].seller },
        });
      }

    return exits.success({
      product: product
    });
  }
};
