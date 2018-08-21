module.exports = {
  friendlyName: "View edit profile",

  description: "Affiche la page d'édition du profil",

  exits: {
    success: {
      viewTemplatePath: "pages/account/edit-profile"
    }
  },

  fn: async function(inputs, exits) {
    return exits.success();
  }
};
