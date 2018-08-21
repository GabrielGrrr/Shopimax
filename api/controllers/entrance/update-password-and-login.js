module.exports = {
  friendlyName: "Update password and login",

  description:
    "Termine le processus de récupération du password en définissant le nouveau password et en " +
    "loggant l'user, en fonction de l'authenticité de leur token.",

  inputs: {
    password: {
      description: "Le nouveau password, non encrypté.",
      example: "abc123v2",
      required: true
    },

    token: {
      description:
        "Le token de reset généré par `sendPasswordRecoveryEmail` endpoint.",
      example: "gwa8gs8hgw9h2g9hg29hgwh9asdgh9q34$$$$$asdgasdggds",
      required: true
    }
  },

  exits: {
    invalidToken: {
      description: "Le token fourni est invalide, expiré, ou déjà utilisé.",
      responseType: "expired"
    }
  },

  fn: async function(inputs, exits) {
    if (!inputs.token) {
      throw "invalidToken";
    }

    // Cherche l'user correspondant au token de reset
    var userRecord = await User.findOne({ passwordResetToken: inputs.token });

    // S'il n'y en a pas, throw invalid.
    if (!userRecord || userRecord.passwordResetTokenExpiresAt <= Date.now()) {
      throw "invalidToken";
    }

    // Hache le pwd
    var hashed = await sails.helpers.passwords.hashPassword(inputs.password);

    // Enregistre le nouveau password et efface le token à usage unique.
    await User.update({ id: userRecord.id }).set({
      password: hashed,
      passwordResetToken: "",
      passwordResetTokenExpiresAt: 0
    });

    // Log l'user.
    this.req.session.userId = userRecord.id;

    return exits.success();
  }
};
