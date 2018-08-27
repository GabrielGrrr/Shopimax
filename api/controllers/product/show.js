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

    product = await Product.findOne({
      where: { id: inputs.productId },
    }).populate('offers', {
      //where: { type: 'Neuf' },
      sort: 'price ASC'
    }).populate('images', {
      sort: 'order ASC'
    }).populate('comments')
      .populate('category');

    var sum = 0;
    product.commentCount = product.comments.length;
    if (product.commentCount) {
      for (var i = 0; i < product.commentCount; i++)
        sum += product.comments[i].rating;
      product.ratingAvg = Math.round((sum / product.commentCount) * 10) / 10;
    }
    return exits.success({
      product: product
    });
  }
};
