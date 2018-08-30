module.exports = {


  friendlyName: 'Show',


  description: 'Show basket.',


  inputs: {

  },


  exits: {
    success: {
      statusCode: 200,
      description:
        "RAS",
      viewTemplatePath: "pages/basket/show"
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

    if (typeof this.req.session.basket !== 'undefined')
      var basket = await JSON.parse(this.req.session.basket);

    if (typeof basket === 'undefined')
      return exits.success({ basketEmpty: true });

    var orderTotal = 0;
    for (let i = 0; i < basket.length; i++)
      orderTotal += basket[i][0].price * basket[i][1];

    return exits.success({ basket: basket, basketSize: this.req.session.basketSize, orderTotal: orderTotal, basketEmpty: false });

  }


};
