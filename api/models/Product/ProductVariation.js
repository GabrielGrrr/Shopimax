/**
 * ProductVariation.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    createdAt: false,
    updatedAt: false,
    name: {
      type: "string",
      required: true,
      maxLength: 120,
      example: "Couleur, Taille, Pointure, Matière, Modèle, Bundle etc."
    },
    overrideImage: {
      type: "boolean",
      defaultsTo: false,
      required: true,
      description:
        "Est-ce que cette variation de produit possède ses propres photos qui remplaceront celles du produit"
    },
    overrideDetails: {
      type: "boolean",
      defaultsTo: false,
      required: true,
      description:
        "Est-ce que cette variation de produit possède ses propres détails techniques qui remplaceront ceux du produit"
    },
    isDetail: {
      type: "boolean",
      description:
        "Est-ce que la variation du produit doit être mentionnée dans les détails le décrivant",
      extendedDescription: `Si oui, elle sera ajouté à la liste des détails du produit, par défaut en premier, et dans l'ordre des différentes variations ajoutées au produit`,
      defaultsTo: true
    },
    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    values: {
      collection: "variationvalue",
      via: "variation"
    }
  }
};
