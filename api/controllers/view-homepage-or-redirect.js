module.exports = {
  friendlyName: "Voir la page d'accueil ou rediriger l'user",

  description:
    "Affiche, ou redirige jusqu'à la page d'accueil appropriéee en fonction du statut du login.",

  exits: {
    success: {
      statusCode: 200,
      description:
        "L'utilisateur est un invité, on le renvoie donc vers la page d'accueil publique.",
      viewTemplatePath: "pages/homepage"
    },

    redirect: {
      responseType: "redirect",
      description:
        "L'utilisateur est connecté, on le renvoie donc vers la page d'accueil interne."
    }
  },

  fn: async function (inputs, exits) {
    if (this.req.me) {
      throw { redirect: "/welcome" };
    }

    return exits.success();
  }
};
