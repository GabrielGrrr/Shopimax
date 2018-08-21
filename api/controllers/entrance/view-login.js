module.exports = {
  friendlyName: "View login",

  description: "Affiche la page de connexion.",

  exits: {
    success: {
      viewTemplatePath: "pages/entrance/login"
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
