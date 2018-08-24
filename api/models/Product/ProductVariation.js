/**
 * ProductVariation.js
 *
 * @description :: FR : Une variation de produit. Un même pantalon dans la BDD peut être disponible en plusieurs tailles par exemple, et en consultant la fiche produit du
 * pantalon / veste / smartphone etc. l'utilisateur peut choisir de faire varier le modèle en fonction de critères de variations propres au produit 
 * (taille, mémoire, couleur ...).
 * Chaque ensemble de variation pour un même produit correspond à un modèle unique, qui est sujet à sa propre
 * quantité en stock, voire son propre prix etc. Ce ne sont toutefois pas des produits différents, aux yeux du SGBD et de l'utilisateur. Les commentaires users,
 * spécifications techniques et images dans certains cas comme les différents indices de popularité sont propres à un produit et ne dépendent pas de ses variations.
 * 
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
    name: {
      type: "string",
      required: true,
      maxLength: 120,
      description: "On utilise cette propriété pour différencier des catégories homonymes en adjoignant leur contexte à leur nom pour plus de clarté",
      example: "TaillePantalon, TailleMemoire, TailleChemise, TailleChapeau, etc."
    },
    friendlyName: {
      type: "string",
      required: true,
      maxLength: 120,
      description: "Le nom de la variation, tel qu'il sera affiché sur la page du navigateur web",
      example: "Couleur, Taille, Pointure, Matière, Modèle, Bundle etc."
    },
    overrideImage: {
      type: "boolean",
      defaultsTo: false,
      description:
        "Est-ce que cette variation de produit possède ses propres photos qui REMPLACERONT COMPLETEMENT celles du produit"
    },
    overrideDetails: {
      type: "boolean",
      defaultsTo: false,
      description:
        "Est-ce que cette variation de produit possède ses propres détails techniques qui REMPLACERONT COMPLETEMENT ceux du produit"
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
    },
    products: {
      collection: "product",
      via: "variations"
    }
  }
};
