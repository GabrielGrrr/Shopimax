module.exports = {
  friendlyName: "View welcome page",

  description: "Affiche la page d'accueil.",

  exits: {
    success: {
      viewTemplatePath: "pages/dashboard/welcome",
      description: "Affiche la page pour les users authentifiés."
    }
  },

  fn: async function(inputs, exits) {
    return exits.success();
  }
};
