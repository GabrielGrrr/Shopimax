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
      return exits.redirect();

    offer = await Offer.findOne({ where: { id: inputs.offerId } });

    if (typeof offer === 'undefined')
      return exits.redirect();

    if (typeof this.req.session.basket !== 'undefined') {
      var basket = await JSON.parse(this.req.session.basket);
    }

    if (typeof basket === 'undefined')
      var basket = new Array();

    await basket.push([offer, typeof quantity === 'undefined' ? 1 : quantity]);

    this.req.session.basketSize = basket.length;
    this.req.session.basket = await JSON.stringify(basket);

    return exits.success();
  }


};
