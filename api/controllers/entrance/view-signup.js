module.exports = {
  friendlyName: "View signup",

  description: "Affiche le formulaire d'inscription",

  exits: {
    success: {
      viewTemplatePath: "pages/entrance/signup"
    },

    redirect: {
      description: "L'utilisateur est déjà connecté.",
      responseType: "redirect"
    }
  },

  fn: async function(inputs, exits) {
    if (this.req.me) {
      throw { redirect: "/" };
    }

    return exits.success();
  }
};
