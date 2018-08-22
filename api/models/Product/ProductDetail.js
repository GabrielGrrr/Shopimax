/**
 * ProductDetail.js
 *
 * @description :: FR : Un détail de produit est une paire de valeur détaillant une caractéristique
 * du produit (le nom de la caractéristique et sa valeur pour le produit concerné). Un détail n'est pas
 * une catégorie, mais une catégorie peut être un détail.
 *
 * EN : A product detail is a couple of string values storing a product characteristic or feature,
 * it includes the name of said characteristic and its value for the given product. A feature is not
 * a category, but a category can be a feature.
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
      maxLength: 100,
      description: "",
      example: "Mémoire, Doublure, Largeur, Processeur, Poids etc."
    },
    value: {
      type: "string",
      required: true,
      maxLength: 250,
      example: "Intel Atom X1000 4.7Ghz quadcore"
    }

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
  }
};
