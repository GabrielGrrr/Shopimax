module.exports = {
  friendlyName: "View forgot password",

  description: "Affiche la page de formulaire d'oubli de password.",

  exits: {
    success: {
      viewTemplatePath: "pages/entrance/forgot-password"
    },

    redirect: {
      description: "L'utilisateur est déjà connecté.",
      extendedDescription:
        'Les utilisateurs connectés devraient changer leurs mots de passe dans "Mon Profil"',
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
