/**
 * Product/CategoryValue.js
 *
 * @description :: FR : Une des valeurs de l'énumération de valeurs possible d'un catégorie. Cette classe est probablement inutile et peut être
 * remplacée par du JSON, mais cela implique d'éventuels problèmes de comptabilité avec MySQL, à voir au niveau des performances.
 *
 * EN : One of the different possible values a product can take (ex: Blue, Green, Yellow, Red for the category) for a given category.
 * This class may be superfluous, and should probably be replaced by a raw JSON table, but that may imply compatibility problems with MySQL,
 * and I'm still not sure I want to restrict myself to only one adapter.
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
      example: "Femme, Mangas, 10-12 ans, Xiaomi ..."
    },
    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    category: {
      model: "productcategory",
      via: "values"
    },
    products: {
      collection: "product",
      via: "categories"
    }
  }
};
