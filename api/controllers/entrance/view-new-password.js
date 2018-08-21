module.exports = {
  friendlyName: "View new password",

  description: "Affiche le formulaire de renouvellement de mot de passe.",

  inputs: {
    token: {
      description: "Le jeton de renouvellement du mot de passe.",
      example: "4-32fad81jdaf$329"
    }
  },

  exits: {
    success: {
      viewTemplatePath: "pages/entrance/new-password"
    },

    invalidOrExpiredToken: {
      responseType: "expired",
      description: "Le jeton fourni est expiré, invalide, ou déjà utilisé."
    }
  },

  fn: async function(inputs, exits) {
    // Si le token n'existe pas, on affiche une page d'erreur idoine
    if (!inputs.token) {
      sails.log.warn(
        "Tentative de consultation de la page de renouvellement du mot de passe, mais pas de jeton de renouvellement inclus dans la requête! Affichage de la page d'erreur..."
      );
      throw "invalidOrExpiredToken";
    } //•

    // Trouve l'user correspondant au resetToken
    var userRecord = await User.findOne({ passwordResetToken: inputs.token });
    // S'il n'y en a pas, on renvoie vers la page idoine
    if (!userRecord || userRecord.passwordResetTokenExpiresAt <= Date.now()) {
      throw "invalidOrExpiredToken";
    }

    // On récupère le jeton et on l'inclue dans la vue
    return exits.success({
      token: inputs.token
    });
  }
};
