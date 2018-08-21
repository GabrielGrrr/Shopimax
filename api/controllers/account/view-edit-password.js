module.exports = {
  friendlyName: "View edit password",

  description: "Affiche la page d'édition du password",

  exits: {
    success: {
      viewTemplatePath: "pages/account/edit-password"
    }
  },

  fn: async function(inputs, exits) {
    return exits.success();
  }
};
