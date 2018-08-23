/**
 * Product.js
 *
 * @description :: FR : Un produit, qui peut faire l'objet d'offres de la part de différents vendeurs, et possède une description (details)
 * conçue comme étant un ensemble de spécifications techniques de type type : valeur (aucune validation ou restriction implémentée à ce niveau),
 * des images descriptives, un créateur qui n'est pas nécessairement un ou le vendeur du produit, des commentaires et leur notation moyenne (que l'on implémentera
 * préférablement de façon plus intelligente qu'en la calculant à chaque rafraîchissement de page), et il appartient à des catégories (marque, collection etc.)
 * qui permettent de le localiser dans le tableau de bord de recherche, et qui peuvent aussi être des variations
 * de ce même produit et faire varier l'offre (prix / stock / fdp) ainsi que les photos ou les détails du produit en fonction de leur valeur
 * (par exemple un polo qui se déclinerait en rouge, bleu et vert; ainsi qu'en M, L et XL).
 *
 *  EN : A product, that can be referenced by multiple offers from multiple sellers, and has a description (details) which is really a
 * set of string pairs that each define its own feature and its value, but also has its own images, a creator (which is a seller, but not necessarily THE seller),
 * some comments by some angry users, with their content full of hatred and their rating full of discontentment. Ideally, the rating avg for the product will be cached
 * or something, probably stored someplace and updated only on insert / update in the relevant comment subset.
 * A product is defined and found in the website dashboard by its categories, each category has different values that a product can refer to.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    name: {
      type: "string",
      required: true,
      maxLength: 120,
      example: "Chimère irisée X3000"
    },
    details: {
      type: "json"
    },
    hasVariations: {
      type: "boolean",
      description:
        "Est-ce qu'un même produit a plusieurs variations, chacune correspondant à un modèle différent non-interchangeable pour le client (taille, couleur, modèle ...)",
      extendedDescription: `Si oui, une offre de vente (stock, prix, délais, fdp etc.) sera spécifique à chaque variation, ainsi que, potentiellement, un ensemble d'image`,
      defaultsTo: false
    },
    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    images: {
      collection: "productimage",
      via: "product"
    },
    comments: {
      collection: "productcomment",
      via: "product"
    },
    offers: {
      collection: "offer",
      via: "product"
    },
    categories: {
      collection: "categoryvalue",
      via: "product"
    },
    variations: {
      collection: "productvariation",
      via: "product"
    }
  }
};
