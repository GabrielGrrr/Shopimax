module.exports = {
  friendlyName: 'Ajouter au panier',

  description: 'Ajoute un produit, représenté par une offre, et sa quantité, au panier.',

  inputs: {
    offerId: {
      type: "string",
      description: "L'id de l'offre à ajouter au panier"
    },
    quantity: {
      type: "number",
      description: "La quantité de produits à ajouter."
    },
  },
  exits: {
    success: {
      statusCode: 200,
      description:
        "RAS",
      viewTemplatePath: "pages/basket/added"
    },

    redirect: {
      responseType: "redirect",
      description:
        "Impossible d'ajouter le produit désiré au panier."
    }
  },


  fn: async function (inputs, exits) {
    if (typeof this.req.session === 'undefined')
      throw { redirect: "/" }
    if (typeof inputs.offerId === 'undefined')
      throw { redirect: "/" }


    var offer = await Offer.findOne({ where: { id: inputs.offerId } });
    var product = await Product.findOne({ where: { id: offer.product } })
      .populate('images', {
        limit: 1,
        sort: 'order ASC'
      });
    var qtt = typeof inputs.quantity === 'undefined' ? 1 : inputs.quantity;

    if (typeof offer === 'undefined')
      throw { redirect: "/" }

    if (typeof this.req.session.basket !== 'undefined')
      var basket = await JSON.parse(this.req.session.basket);

    if (typeof basket === 'undefined')
      var basket = new Array();

    if (typeof this.req.session.basketSize === 'undefined')
      this.req.session.basketSize = qtt;
    else
      this.req.session.basketSize += qtt;

    offer.productName = product.name;
    offer.productImage = product.images[0].url;
    await basket.push([offer, qtt]);
    this.req.session.basket = await JSON.stringify(basket);

    return exits.success({ product: product, quantity: qtt });
  }


};
