/**
 * Offer.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    type: {
      type: "string",
      isIn: ["Neuf", "Reconditionné", "Occasion"],
      defaultsTo: "Neuf"
    },
    price: {
      type: "number",
      required: true
    },
    deliveryFee: {
      type: "number",
      required: true
    },
    remainingStock: {
      type: "number",
      required: true
    },
    //équivalent au FBA : Shopimax s'assure des retours et livraisons
    sentByShopimax: {
      type: "boolean",
      defaultsTo: false,
      description:
        "Profitez du service d'envoi par Shopimax : On s'occuppe de toute la livraison et les retours, et vous gardez un contrôle sur le prix auquel est vendu votre produit",
      extendedDescription:
        "Si un produit est envoyé par Shopimax, alors j'imagine qu'il est éligible aux offres premium de gratuité des frais d'envoi," +
        "que les stock correspondant à l'offre et les délais d'envoi seront directement mis à jour par la centrale d'expédition de Shopimax etc." +
        "Je m'invente complètement une vie là, mais on restreindra quand même les droits du seller en écriture sur tous les champs en fonction de cette donnée"
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    seller: {
      model: "seller"
    },
    sender: {
      model: "sender"
    },
    product: {
      model: "product"
    },
    variation: {
      collection: "productvariation"
    }
  }
};
