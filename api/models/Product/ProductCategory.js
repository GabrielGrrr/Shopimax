/**
 * Product/ProductCategory.js
 *
 * @description :: FR : Une catégorie de produit identifiée par son nom (ex : taille, poids etc.), et qui peut faire référence à plusieurs
 * valeurs possible (ex : rouge, jaune, bleu etc.) selon le produit. Cette catégorie peut être simple (un produit ne peut avoir qu'une seule
 * valeur dans cette catégorie, par exemple une paire de chaussure est soit pour homme soit pour femme), ou un ensemble de variation
 * (le produit possède plusieurs modèles / poids / tailles / variations diverses auxquelles correspondent des offres de vente différentes : stock,
 * prix etc. et parfois des images ou un descriptif différent). Cela permet de proposer plusieurs modèles.
 *
 * EN : A product category, identified by its name (which could be a size, or a color for example), and which can reference many different values
 * (red, yellow, blue ...) . This category may be a vanilla category (a product can have only one value in this category, like an article of clothing
 * which is either for men or women), or it can be a set of variations (a product can have multiple variations, each variation can have its own description,
 * its own set of images and so on.). If it is a set of variation, the sellers' offers correspond to a variation and not a product (each variation has its own
 * price, stock and delivery fee).
 *
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    createdAt: false,
    updatedAt: false,
    rank: {
      type: "number"
    },
    name: {
      type: "string",
      required: true,
      maxLength: 120,
      example:
        "TaillePantalon, TailleEcran, TailleChemise, TailleChapeau, AgeBebes, AgeAdultes, MatièreTel, MatièreManteau"
    },
    friendlyName: {
      type: "string",
      required: true,
      maxLength: 120,
      example:
        "Général/Root {Vêtements, Bricolage, Parfumerie, Hi-Tech ...}, Genre, Matière, Marque, Collection ..."
    },
    img: {
      type: "string",
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    parent: {
      model: "productcategory",
    },
    children: {
      collection: "productcategory",
      via: "parent"
    },
    values: {
      collection: "categoryvalue",
      via: "category"
    }
  }
};
